import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { buildTagIndex, readTagTaxonomy } from "../../../agent-workflow/tools/tag-taxonomy-utils.mjs";
import {
  completeOpinionTranslation,
  loadTranslationCache,
  saveTranslationCache,
  translateOpinionText,
} from "../../../agent-workflow/tools/opinion-translation-utils.mjs";

const execFileAsync = promisify(execFile);
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillDir = process.env.FOLLOW_BUILDERS_SKILL_DIR
  || path.join(homedir(), ".skill-store", "follow-builders");
const prepareScript = path.join(skillDir, "scripts", "prepare-digest.js");
const outputPath = path.join(siteRoot, "data", "follow-builders-daily.json");
const builderBlogFeedPath = path.join(siteRoot, "..", "content", "11-databases", "builder-blog-feed.json");
const builderPodcastFeedPath = path.join(siteRoot, "..", "content", "11-databases", "builder-podcast-feed.json");
const tagIndex = buildTagIndex(readTagTaxonomy(process.cwd()));
const remoteFeeds = {
  x: "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json",
  podcasts: "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json",
};

function decodeText(value = "") {
  return String(value)
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replace(/\s+$/g, "")
    .trim();
}

function compact(value = "", limit = 900) {
  const text = decodeText(value).replace(/\s+/g, " ");
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
}

function roleFromBio(bio = "", handle = "") {
  const firstLine = decodeText(bio).split(/\n|\|/).map((item) => item.trim()).find(Boolean);
  return firstLine ? firstLine.replaceAll("@", "") : `${handle} on X`;
}

function isSubstantiveTweet(tweet = {}) {
  const text = decodeText(tweet.text || "");
  const withoutLinks = text.replace(/https?:\/\/\S+/g, "").trim();
  if (!tweet.url || withoutLinks.length < 18) return false;
  if (/^(go knicks|full video out tomorrow|watch on youtube)/i.test(withoutLinks)) return false;
  return true;
}

function topicForText(text = "") {
  const value = text.toLowerCase();
  if (/\b(agent|agents|openclaw|cowork|skills api|sandbox|composer)\b/.test(value)) return "Agent";
  if (/\b(code|coding|developer|software|figma|cursor|replit|vibe)\b/.test(value)) return "AI 编程";
  if (/\b(inference|compute|gpu|nvidia|model|storage|filesystem|runtime|api)\b/.test(value)) return "AI 基础设施";
  if (/\b(startup|founder|vc|arr|customer|saas|product|ship)\b/.test(value)) return "产品与创业";
  return "Builder 观点";
}

function observationForTopic(topic) {
  const map = {
    "Agent": "这条言论可作为 Agent 产品形态、协作方式或能力边界的观察入口；只代表公开观点，不作为公司事实主证据。",
    "AI 编程": "这条言论适合观察 AI 编程工具、设计到代码流程和软件生产方式的变化；需要结合产品发布或文档再做事实判断。",
    "AI 基础设施": "这条言论适合观察模型运行、算力、存储、sandbox 或开发平台基础设施的变化；后续事实判断需回到原始公告或技术文档。",
    "产品与创业": "这条言论适合观察 builder 对产品、创业、销售或市场节奏的判断；可作为选题线索，不直接等同于行业结论。",
    "Builder 观点": "这条言论适合保留为 builder 公开观点和语境线索；后续使用时需要保持来源链接和上下文。",
  };
  return map[topic] || map["Builder 观点"];
}

const tagCatalog = {
  "opinion-ai-coding": { id: "opinion-ai-coding", name: "AI Coding 观点", group: "opinion" },
  "opinion-agent-workflow": { id: "opinion-agent-workflow", name: "Agent 工作流观点", group: "opinion" },
  "opinion-model-infra": { id: "opinion-model-infra", name: "模型基础设施观点", group: "opinion" },
  "opinion-product-strategy": { id: "opinion-product-strategy", name: "产品策略观点", group: "opinion" },
  "track-ai-agent": { id: "track-ai-agent", name: "AI Agent", group: "track" },
  "track-ai-coding": { id: "track-ai-coding", name: "AI Coding", group: "track" },
  "track-ai-infra": { id: "track-ai-infra", name: "AI 基础设施", group: "track" },
  "track-enterprise-workflow": { id: "track-enterprise-workflow", name: "企业工作流", group: "track" },
  "source-social": { id: "source-social", name: "社媒线索", group: "source" },
  "source-podcast": { id: "source-podcast", name: "播客", group: "source" },
  "source-blog": { id: "source-blog", name: "技术博客", group: "source" },
};

function tagFromTaxonomy(id) {
  const tag = tagIndex.byId.get(id);
  return tag ? { id: tag.id, name: tag.name, group: tag.group } : tagCatalog[id] || null;
}

function tagsForTopic(topic, source = "x") {
  const topicTags = {
    "Agent": ["opinion-agent-workflow", "track-ai-agent"],
    "AI 编程": ["opinion-ai-coding", "track-ai-coding"],
    "AI 基础设施": ["opinion-model-infra", "track-ai-infra"],
    "产品与创业": ["opinion-product-strategy", "track-enterprise-workflow"],
    "Builder 观点": ["opinion-product-strategy", "track-enterprise-workflow"],
  };
  const sourceTags = {
    x: "source-social",
    podcast: "source-podcast",
    blog: "source-blog",
  };
  const ids = [
    ...(topicTags[topic] || topicTags["Builder 观点"]),
    sourceTags[source] || "source-social",
  ];
  return [...new Set(ids)].map(tagFromTaxonomy).filter(Boolean);
}

const translationByTweetId = {
  "2063486871037153558": "这种 agentic coding 的上瘾感，已经比打游戏还强了。",
  "2063475353335869922": "Codex 线程不应该只能按项目查看，应该可以按不同状态筛选或排序，比如“全部等待批准”“全部正在工作”。我想把线程控制在 10 个以内，但现在已经开始变得难管理了。",
  "2063438262841094604": "我最喜欢的柏拉图《对话录》之一，深入讨论了技艺的边界，以及 aidōs（敬畏与回应他人）和 dikē（判断正当性的能力）的必要性。Protagoras 在讨论知识从何而来、美德是否可以被教授时，某种程度上预示了今天关于 LLM 的问题。",
  "2063436919967522848": "再补充两个会变得更有价值的概念：Aidōs，指对他人的敬畏与回应能力；Dikē，指感知什么是正当的能力。",
  "2063432747432268259": "一种流行看法是：研究论文和实验室发布的“alpha”正在消退，因为研究人员发现，与其和市场部门争夺表达权，不如带着自己依法受保护的隐性知识离开，直接拿到超过 1 亿美元的机会。加州禁止竞业限制，对知识扩散的影响可能比 GitHub、arXiv 和 Hugging Face 加起来还大。这也是我想把 AI Engineer 做成以产品为中心的行业会议、补充论文中心型研究会议的原因之一。",
  "2063426632824562167": "LLM 没有意识。LLM 也不能被简单地说成一定没有意识。这两句话可以同时成立。",
  "2063418130714800487": "我们从没说过不会把任何用户数据上传到云端。我们说的是，代码本身，也就是文件内容，不会被上传。Paxel 是来帮助你的；随着本地模型越来越好，我们之后也能把更多事情放到本地完成。",
  "2063409501706018903": "我也希望帮助更多人通过 Paxel 变得更专业、更可靠。",
  "2063391758189572266": "很喜欢这场分享：静态内容的价值在下降，实时互动的价值在上升。人们想连接到作品背后真实的人，无论那件作品是内容还是软件。粗粝但有观点，比精致但通用更有价值。",
  "2063381764782116914": "这个周末别忘了出去走走、接触一下真实世界。",
  "2063344460705288401": "当我公开反对加沙种族灭绝时，一些平庸的 VC 公开围攻我，也试图在私下伤害我。站在我这边的人里也有很多 VC，只是他们是更好的一批，无论从道德上还是回报表现上都是。避开反社会型人物的最好方式，就是坚持自己的信念，让他们自己退出你的生活。",
  "2063342268472574268": "模型路由真的很难：它要求把每个任务匹配到合适的模型，并基于产品自己的具体任务做 benchmark，调好质量和成本之间的取舍。但难点里也有机会。我在 Gemini 期间看到企业经历了三个阶段：2024 年默认使用最热门的模型，几乎所有任务都上 GPT；2025 年初又过度纠偏，试图给每个任务找最小、最便宜的模型，但 eval 不够成熟，反而拖慢交付；之后进入更细致的路由阶段，先进的 AI-native 公司把产品拆成多个子 agent，让最难的推理走 Claude，简单任务走 Gemini Flash-Lite 或开放权重模型。和多数产品模式一样，企业通常会在 AI-native builder 之后 6 到 9 个月跟进。",
  "2063320673217609936": "Token 成本正在成为企业最关注的话题之一。这对 AI 整体是利好，因为它说明这些系统已经被用到了过去没有想象过的规模。它也会让应用层 AI 出现一种新的差异化：模型路由。当 token 成为工作流中的重要成本，公司自然会希望把钱花在最适合当前任务的 token 使用上。前沿模型仍会用于编码、法律、金融分析、医疗等高端任务，而且这部分支出会继续上升；但很多单项任务可以切给更低成本的模型，从而得到更高效的结果。要做到这一点，应用层 AI 必须比任何人都更理解所在领域的工作流，并能把不同模型匹配到不同任务。长期看，拥有最好 eval、最好工作负载路由能力，并且商业模式与客户财务目标直接一致的公司，会处在很有利的位置。",
  "2063280482922663980": "地方政府很重要。奥克兰的治理问题是可以修复的，只是它还没有像旧金山那样重新出现常识回归。Empower Oakland 正在推动这件事。",
  "2063263389238087745": "《公园散步》第二部分，嘉宾是 taiuti。内容包括：什么是世界模型；从文本到 3D 到 Reactor World 的起源；为什么决定创业；GTA、游戏和编程路径；如何在隐身状态下构建并保守秘密；如何选择有独立判断的投资人；世界模型会先从哪里增长；为什么低延迟重要；如何成为 CEO 并扩展团队；以及最后建议。",
  "2063157328753594505": "GBrain 给 OpenClaw 和 Hermes Agent 装上了翅膀。https://t.co/gUt6ll33Vn",
  "2063146456106795457": "你现在终于可以试用我几个月前预告过的一个大项目了。\n\n我们希望它随着时间推移，越来越能帮助你学习更好的软件构建技巧，并更快地构建出更好的软件。https://t.co/hQpYCpl9JB",
  "2063146111960019028": "这就是未来无人机战争里“必备品”的定义。https://t.co/m33IZgh1Dx",
  "2063089288997491063": "我几乎每天都会听到类似的说法。https://t.co/OEI3CkrtcX",
  "2063082950317486133": "比“永远使用 plan mode”更聪明的做法是：\n\n永远把你的任务表述成一个问题，这样模型会被邀请来质疑、评估这个想法的质量，并提出替代方案，而不是盲目执行你说出口的内容。\n\n因为你说的，常常并不精确等于你真正想要的。\n\n很多时候，只要在 prompt 末尾加一个问号就够了。",
  "2063055332545540096": "写代码基本上是 AI 能合理自动化的最高峰，但即便如此，我们仍然需要人类工程师监督 agent，agent 才能真正有效。\n\nAI 模型在海量复杂代码上训练；用户技术能力强，能快速使用最新工具；这类工作“可验证”，因为你可以测试应用；结果往往和代码质量并不完全绑定，代码很粗糙，应用也可能能跑；而且 agent 所需上下文通常已经数字化，放在代码库里。\n\nAI 编程 agent 拥有非常多有利条件。其中一些也适用于知识工作，但多数知识工作并不具备这些条件，比如工作成果必须被完整审阅才有用，或者数据并没有充分数字化。这会让知识工作里的 agent 更复杂。\n\n所以，即便在这些有利条件下，工程师依然非常抢手，其他知识工作被替代的风险可能低于外界感知。Agent 会让人做得比以前多得多，但人不会消失。",
  "2063038983408615435": "现在，用代码做设计已经简单到：点击、聊天、按住 Shift 多选。\n\n配合 Composer 2.5 效果最好。https://t.co/jKDWktp69K",
  "2063035894790345200": "现在 X 上到处都是关于 VC 的糟糕故事，但 VC 对创始人也有自己的恐怖故事。\n\n比如有一次，一个创始人明明知道我们显然能提供增值、思想领导力和供应商折扣，还是选择了另一个估值更高的 term sheet。",
  "2063029941202239645": "我喜欢暂时担任 AI Engineer 的 BDFL，因为这样我可以做一些调皮的事，比如我们在伦敦做的 AGI pills，还有这个。https://t.co/dXoPfxlKd0 https://t.co/DS4J7hY1gF",
  "2063028956211867837": "Cowork 最适合处理那些大到不适合放进聊天窗口里的工作：跨几十个账号做研究、周期性报告、整理收件箱并起草回复。\n\n如果你一直好奇它能帮你卸下哪些工作，这个月很适合试试看。等不及想看到你会用它做什么。",
  "2063028954546733462": "我们把 Claude Cowork 下个月的使用额度翻倍了。这适用于你的 5 小时速率限制。\n\n如果你一直攒着一个又大又乱的项目，现在就是时候。https://t.co/qwjn8cVTUk",
  "2063024953721827329": "我看到企业 AI 团队最常犯的错误之一，是围绕今天的模型能力和价格来构建。\n\n往 6 个月后想。模型会更聪明，也会更便宜。\n\n围绕今天模型的弱点搭脚手架，用它来推动前沿。押注下一代模型会原生解决这些脚手架要弥补的问题。然后继续推动前沿。\n\n为斜率而构建。\n\n长期看，反复识别并跨越模型差距的能力，本身会成为一种护城河。",
  "2063018339710992794": "现在所有付费计划都可以使用，直到 7 月 5 日。\n\n下载 Claude 桌面应用，试试 Cowork：https://t.co/EYHUToV3eS",
  "2063018337567670285": "我们把 Claude Cowork 下个月的使用额度翻倍了。\n\n把更大、更复杂的任务交给 Claude。https://t.co/ivHZuaMbZV",
  "2063013079974367557": "哈哈，designer Vincent 又回来做前沿能力测试了。https://t.co/I6OoTDbs5E",
  "2063009510503932181": "Agent 的文件系统状态现在可以独立于 Sandbox 生命周期被读取、写入和挂载。\n\n我们一直在为所有计算产品开发一种新的虚拟存储基础设施。\n\n这种存储是解耦的，但可以挂载到 Builds、Functions、Sandboxes 等产品上。https://t.co/x2CJpPHf62",
  "2062997876297609257": "来自 simpsoka 和团队的出色工作。",
  "2062997768470474765": "Codex 的小摩擦在下降，Codex 的采用在上升。https://t.co/KwVlGIB9ed",
  "2062966625733861752": "更好的记忆 = 更短的 prompts = 每个 token 带来更多效用。https://t.co/IT5h4ZSbEl",
  "2062959766314582064": "刚采访了 mvanhorn，我很受启发。\n\n我之前完全不知道他没有 CS 学位，也没有真正的工程背景。\n\n尽管如此，他已经发布了很多很棒的项目，还给 Python 和 Go 这样的仓库做过贡献。\n\n他非常认可 Every 的 Compound Engineering，认为它有助于制定好计划、写出好代码：https://t.co/L8JrNQfyPb\n\n我会整理采访，很快发到 YouTube：https://t.co/1C6pbWzPYn",
  "2062954780465434779": "向 andrewqu 致敬，他是这个项目的创始人兼 CEO：https://t.co/pYz1Gn97jD。你就是可以直接把东西 ship 出去。https://t.co/YfqUgl5zCm",
  "2062951924677128455": "使用 Skills API，让你的所有 agent 和平台都更聪明。\n\n可以把它想成 agent 能力和扩展性的 npm registry。免费、开放。https://t.co/kcVnJSupTf",
  "2062930113390354641": "我们很快会向 Every 订阅用户开放完整 workflow 和 prompts：\n\nhttps://t.co/9wRhOCUCAk",
  "2062917027103130013": "有时候，速度只是伪装成雄心的急躁。https://t.co/NQ32ApE7sD",
  "2062910976018854252": "证毕。这个 thread 下面的 quote tweets 说明我们必须做得更好。常青提醒：没有创始人，就没有 VC！https://t.co/vDQnupyZrs https://t.co/6KOdD47pHG",
  "2062899832965255443": "如何构建会检查自己工作、并随着时间改进的 AI skills：\n\n1. 给它上下文\n让 AI：“为这个重复任务创建一个 skill。这里有一些好输出示例，让它知道什么叫好。”\n\n2. 让它容易触发\n“按这个模式写清楚 skill 描述：当用户想要做某事时使用。”\n\n3. 加 evals\n“创建一个 evals md，包含 10 个 pass/fail 检查项，用来捕捉 skill 输出里的常见错误。”\n\n4. 加 memory\n“创建一个 memory md，用一句话记录过去使用这个 skill 时学到的经验。”\n\n5. 构建一个编辑 skills 的 skill\n“创建一个 skill，用来清理其他 skills，移除重复或过期指令、模糊规则和 AI 味废话。”\n\n完整演示在这里：https://t.co/u434ytNSZd",
};

async function translateTweet(tweet = {}, cache = {}) {
  const text = decodeText(tweet.text || "");
  const staticTranslation = completeOpinionTranslation(text, translationByTweetId[tweet.id] || "", {
    preferFullTranslation: true,
  });
  if (staticTranslation) {
    return { translation: staticTranslation, status: "translated", method: "static_by_tweet_id" };
  }
  return translateOpinionText(text, {
    cache,
    cacheKey: tweet.id || text,
    allowNetwork: process.env.FOLLOW_BUILDERS_TRANSLATE_NETWORK !== "false",
    preferFullTranslation: true,
  });
}

async function loadPreparedFeed() {
  let prepareError = null;
  if (existsSync(prepareScript)) {
    try {
      const { stdout } = await execFileAsync(process.execPath, [prepareScript], {
        cwd: path.join(skillDir, "scripts"),
        maxBuffer: 80 * 1024 * 1024,
        env: { ...process.env, NO_COLOR: "1" },
      });
      return {
        ...JSON.parse(stdout),
        sourceRoute: "prepare-digest",
        sourceErrors: [],
        blogs: existsSync(builderBlogFeedPath)
          ? JSON.parse(await readFile(builderBlogFeedPath, "utf8")).blogs || []
          : [],
        podcastsFromFeed: existsSync(builderPodcastFeedPath)
          ? JSON.parse(await readFile(builderPodcastFeedPath, "utf8")).podcasts || []
          : [],
      };
    } catch (error) {
      prepareError = error;
    }
  }

  async function fetchRemoteFeed(name) {
    const response = await fetch(remoteFeeds[name], { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Failed to fetch follow-builders ${name} feed: ${response.status}`);
    return { payload: await response.json(), route: `remote-${name}` };
  }

  async function readLocalOrRemote(name) {
    const localFile = path.join(skillDir, `feed-${name}.json`);
    if (existsSync(localFile)) return { payload: JSON.parse(await readFile(localFile, "utf8")), route: `local-${name}` };
    return fetchRemoteFeed(name);
  }

  let xRaw;
  let podcastRaw;
  let blogRaw;
  try {
    [xRaw, podcastRaw, blogRaw] = await Promise.all([
      readLocalOrRemote("x"),
      readLocalOrRemote("podcasts"),
      existsSync(builderBlogFeedPath)
        ? readFile(builderBlogFeedPath, "utf8").then(c => ({ payload: JSON.parse(c), route: "local-blogs" }))
        : Promise.resolve({ payload: { blogs: [] }, route: "none" }),
    ]);
  } catch (error) {
    if (prepareError) {
      throw new Error(`prepare-digest failed: ${prepareError.message}; feed fallback failed: ${error.message}`);
    }
    throw error;
  }
  const xPayload = xRaw.payload ?? xRaw;
  const podcastPayload = podcastRaw.payload ?? podcastRaw;
  const blogPayload = blogRaw.payload ?? blogRaw;
  const x = typeof xPayload === "string" ? JSON.parse(xPayload) : xPayload;
  const podcasts = typeof podcastPayload === "string" ? JSON.parse(podcastPayload) : podcastPayload;
  const blogs = typeof blogPayload === "string" ? JSON.parse(blogPayload) : blogPayload;
  return {
    status: "ok",
    generatedAt: new Date().toISOString(),
    x: x.x || [],
    blogs: blogs.blogs || [],
    podcasts: podcasts.podcasts || [],
    sourceRoute: [xRaw.route, podcastRaw.route].filter(Boolean).join("+") || "feed-fallback",
    sourceErrors: prepareError ? [`prepare-digest: ${prepareError.message}`] : [],
    stats: {
      xBuilders: x.stats?.xBuilders || x.x?.length || 0,
      totalTweets: x.stats?.totalTweets || 0,
      podcastEpisodes: podcasts.stats?.podcastEpisodes || podcasts.podcasts?.length || 0,
      feedGeneratedAt: x.generatedAt || podcasts.generatedAt || null,
    },
  };
}

async function trackedSourceCount() {
  try {
    const defaults = JSON.parse(await readFile(path.join(skillDir, "config", "default-sources.json"), "utf8"));
    return (defaults.x_accounts?.length || 0) + (defaults.podcasts?.length || 0) + (defaults.blogs?.length || 0);
  } catch {
    return 0;
  }
}

async function normalize(feed, trackedSources) {
  const translationCache = await loadTranslationCache(process.cwd());
  const remarks = [];
  for (const builder of feed.x || []) {
    for (const tweet of builder.tweets || []) {
      if (!isSubstantiveTweet(tweet)) continue;
      const text = decodeText(tweet.text);
      const translated = await translateTweet(tweet, translationCache);
      const topic = topicForText(text);
      remarks.push({
        id: tweet.id,
        source: "x",
        name: builder.name,
        handle: builder.handle,
        role: roleFromBio(builder.bio, builder.handle),
        text,
        translation: translated.translation,
        translationStatus: translated.status,
        translationMethod: translated.method,
        topic,
        formalTags: tagsForTopic(topic, "x"),
        observation: observationForTopic(topic),
        createdAt: tweet.createdAt,
        date: String(tweet.createdAt || "").slice(0, 10),
        url: tweet.url,
        likes: tweet.likes || 0,
        retweets: tweet.retweets || 0,
        replies: tweet.replies || 0,
      });
    }
  }
  await saveTranslationCache(process.cwd(), translationCache);

  // Add builder blog items (no translation needed, titles are self-explanatory)
  for (const builder of feed.blogs || []) {
    for (const item of builder.tweets || []) {
      const text = decodeText(item.text || "");
      if (!text) continue;
      const topic = topicForText(text);
      remarks.push({
        id: item.id || item.url,
        source: "blog",
        name: builder.name,
        handle: builder.handle,
        role: builder.bio || "",
        text,
        translation: text,
        translationStatus: "original",
        translationMethod: "none",
        topic,
        formalTags: tagsForTopic(topic, "blog"),
        observation: observationForTopic(topic),
        createdAt: item.createdAt,
        date: String(item.createdAt || "").slice(0, 10),
        url: item.url,
        likes: 0,
        retweets: 0,
        replies: 0,
      });
    }
  }

  remarks.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const builders = [...new Map(remarks.map((item) => [item.handle, item])).values()]
    .map((item) => ({
      name: item.name,
      handle: item.handle,
      role: item.role,
      count: remarks.filter((remark) => remark.handle === item.handle).length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const podcasts = (feed.podcastsFromFeed || feed.podcasts || []).filter((item) => item.url).slice(0, 3).map((item) => ({
    source: "podcast",
    name: item.name,
    title: item.title,
    url: item.url,
    publishedAt: item.publishedAt,
    excerpt: compact(item.excerpt || "", 920),
  }));

  return {
    meta: {
      generatedAt: feed.generatedAt || new Date().toISOString(),
      feedGeneratedAt: feed.stats?.feedGeneratedAt || null,
      platform: "other",
      sourceSkill: "follow-builders",
      sourceRoute: feed.sourceRoute || "unknown",
      sourceErrors: feed.sourceErrors || [],
      sourcePolicy: "Only content from the follow-builders prepared JSON is included. Every remark keeps its original URL and must provide Chinese translation before frontstage display.",
    },
    stats: {
      builders: builders.length,
      remarks: remarks.length,
      podcasts: podcasts.length,
      blogsBuilt: (feed.blogs || []).filter(b => b.tweets?.length).length,
      trackedSources,
      rawBuilders: feed.stats?.xBuilders || 0,
      rawTweets: feed.stats?.totalTweets || 0,
    },
    builders,
    remarks,
    podcasts,
  };
}

async function main() {
  let feed;
  let trackedSources;
  try {
    [feed, trackedSources] = await Promise.all([
      loadPreparedFeed(),
      trackedSourceCount(),
    ]);
  } catch (error) {
    if (!existsSync(outputPath)) throw error;
    const payload = JSON.parse(await readFile(outputPath, "utf8"));
    payload.meta = {
      ...(payload.meta || {}),
      generatedAt: new Date().toISOString(),
      fallbackUsed: true,
      fallbackReason: error.message,
      sourcePolicy: "follow-builders feed refresh failed; previous generated data was preserved so the independent First-Line Viewpoints page can still build.",
    };
    await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    console.log(`Wrote ${path.relative(process.cwd(), outputPath)} with ${payload.stats?.remarks || 0} remarks using previous data fallback.`);
    return;
  }
  const payload = await normalize(feed, trackedSources);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)} with ${payload.stats.remarks} remarks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
