import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { buildTagIndex, readTagTaxonomy } from "../../../agent-workflow/tools/tag-taxonomy-utils.mjs";

const execFileAsync = promisify(execFile);
const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillDir = process.env.FOLLOW_BUILDERS_SKILL_DIR
  || path.join(homedir(), ".skill-store", "follow-builders");
const prepareScript = path.join(skillDir, "scripts", "prepare-digest.js");
const outputPath = path.join(siteRoot, "data", "follow-builders-daily.json");
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

function translateTweet(tweet = {}) {
  return translationByTweetId[tweet.id] || decodeText(tweet.text || "");
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
      return JSON.parse(stdout);
    } catch (error) {
      prepareError = error;
    }
  }

  async function fetchRemoteFeed(name) {
    const response = await fetch(remoteFeeds[name], { signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Failed to fetch follow-builders ${name} feed: ${response.status}`);
    return response.json();
  }

  async function readLocalOrRemote(name) {
    const localFile = path.join(skillDir, `feed-${name}.json`);
    if (existsSync(localFile)) return JSON.parse(await readFile(localFile, "utf8"));
    return fetchRemoteFeed(name);
  }

  let xRaw;
  let podcastRaw;
  try {
    [xRaw, podcastRaw] = await Promise.all([
      readLocalOrRemote("x"),
      readLocalOrRemote("podcasts"),
    ]);
  } catch (error) {
    if (prepareError) {
      throw new Error(`prepare-digest failed: ${prepareError.message}; feed fallback failed: ${error.message}`);
    }
    throw error;
  }
  const x = typeof xRaw === "string" ? JSON.parse(xRaw) : xRaw;
  const podcasts = typeof podcastRaw === "string" ? JSON.parse(podcastRaw) : podcastRaw;
  return {
    status: "ok",
    generatedAt: new Date().toISOString(),
    x: x.x || [],
    podcasts: podcasts.podcasts || [],
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

function normalize(feed, trackedSources) {
  const remarks = [];
  for (const builder of feed.x || []) {
    for (const tweet of builder.tweets || []) {
      if (!isSubstantiveTweet(tweet)) continue;
      const text = decodeText(tweet.text);
      const topic = topicForText(text);
      remarks.push({
        id: tweet.id,
        source: "x",
        name: builder.name,
        handle: builder.handle,
        role: roleFromBio(builder.bio, builder.handle),
        text,
        translation: translateTweet(tweet),
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

  remarks.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const builders = [...new Map(remarks.map((item) => [item.handle, item])).values()]
    .map((item) => ({
      name: item.name,
      handle: item.handle,
      role: item.role,
      count: remarks.filter((remark) => remark.handle === item.handle).length,
    }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

  const podcasts = (feed.podcasts || []).filter((item) => item.url).slice(0, 3).map((item) => ({
    source: "podcast",
    name: item.name,
    title: item.title,
    url: item.url,
    publishedAt: item.publishedAt,
    excerpt: compact(item.transcript || "", 920),
  }));

  return {
    meta: {
      generatedAt: feed.generatedAt || new Date().toISOString(),
      feedGeneratedAt: feed.stats?.feedGeneratedAt || null,
      platform: "other",
      sourceSkill: "follow-builders",
      sourcePolicy: "Only content from the follow-builders prepared JSON is included. Every remark keeps its original URL.",
    },
    stats: {
      builders: builders.length,
      remarks: remarks.length,
      podcasts: podcasts.length,
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
  const payload = normalize(feed, trackedSources);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), outputPath)} with ${payload.stats.remarks} remarks.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
