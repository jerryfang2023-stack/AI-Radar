import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const siteContentPath = path.join(siteDataDir, "site-content.json");
const topicCenterJsonPath = path.join(siteDataDir, "topic-center.json");
const topicCenterJsPath = path.join(siteDataDir, "topic-center.js");
const topicCenterVersion = "V1.2.0";
const followBuildersDir = path.join(process.env.USERPROFILE || process.env.HOME || "", ".skill-store", "follow-builders");
const followBuildersFeeds = {
  x: "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-x.json",
  blogs: "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-blogs.json",
  podcasts: "https://raw.githubusercontent.com/zarazhangrui/follow-builders/main/feed-podcasts.json",
};

const fetchTimeoutMs = 15000;

function argValue(name, fallback = "") {
  const exact = `--${name}`;
  const prefix = `${exact}=`;
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(exact);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readLocalJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function text(value) {
  return value == null ? "" : String(value).trim();
}

function list(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return value ? [value] : [];
}

function hostFromUrl(url) {
  try {
    return new URL(url).host.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

function stripHtml(value) {
  return text(value)
    .replace(/<[^>]+>/gu, " ")
    .replace(/&amp;/gu, "&")
    .replace(/&quot;/gu, "\"")
    .replace(/&#39;/gu, "'")
    .replace(/\s+/gu, " ")
    .trim();
}

function hasAiSignal(value) {
  return /\b(ai|llm|gpt|claude|openai|anthropic|agent|agents|model|models|inference|rag|mcp|copilot|vector|embedding|robot|chatgpt|nvidia)\b|人工智能|大模型|智能体|机器人/iu.test(value);
}

function hasStrongAiTitle(value) {
  return /\b(ai|llm|gpt|claude|openai|anthropic|agent|agents|model|models|robot|chatgpt|nvidia)\b|人工智能|大模型|智能体|机器人/iu.test(value);
}

function hasBuilderSignal(value) {
  return /\b(ai|llm|gpt|claude|openai|anthropic|agent|agents|model|models|inference|rag|mcp|copilot|vector|embedding|developer|sdk|api|github|repo|cli|code|coding)\b|开发者|开源|智能体/iu.test(value);
}

function slug(value) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 56) || "topic";
}

function scoreGrade(score) {
  if (score >= 92) return "S";
  if (score >= 86) return "A";
  if (score >= 78) return "B";
  return "C";
}

function priorityLabel(score) {
  if (score >= 90) return "S级选题";
  if (score >= 84) return "优先观察";
  return "候选";
}

function todayStr() {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), fetchTimeoutMs);
  try {
    const response = await fetch(url, { signal: ctrl.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch {
    return "";
  } finally {
    clearTimeout(timer);
  }
}

async function fetchJson(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), fetchTimeoutMs);
  try {
    const response = await fetch(url, { signal: ctrl.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFollowBuildersFeed(name) {
  const remote = await fetchJson(followBuildersFeeds[name]);
  if (remote) return remote;
  return readLocalJson(path.join(followBuildersDir, `feed-${name}.json`), null);
}

async function fetchFollowBuildersFeeds() {
  const [x, blogs, podcasts] = await Promise.all([
    fetchFollowBuildersFeed("x"),
    fetchFollowBuildersFeed("blogs"),
    fetchFollowBuildersFeed("podcasts"),
  ]);
  return { x, blogs, podcasts };
}

function followBuilderTweetItems(feed, date) {
  const rows = [];
  for (const account of list(feed?.x)) {
    for (const tweet of list(account.tweets)) {
      const body = stripHtml(tweet.text || "");
      if (!body || body.length < 24) continue;
      const engagement = Number(tweet.likes || 0) + Number(tweet.retweets || 0) * 3 + Number(tweet.replies || 0);
      rows.push({
        baseId: `follow-builders-${tweet.id || slug(`${account.handle}-${body}`)}`,
        title: `${account.name || account.handle}: ${body}`.slice(0, 120),
        type: "builder-opinion",
        audience: "企业老板 / 产品负责人 / 开发者",
        core: body.slice(0, 240),
        relevance: "来自一线 AI builder 的公开观点，适合判断开发者采用、产品体验和企业焦虑。",
        evidence: `Follow Builders · @${account.handle || account.name} · ${engagement} engagement`,
        source: "Follow Builders",
        subSource: account.name || account.handle || "Builder",
        url: tweet.url || "",
        date: text(tweet.createdAt).slice(0, 10) || date,
        score: Math.min(94, 78 + Math.floor(engagement / 12)),
      });
    }
  }
  return dedupe(rows).sort((a, b) => b.score - a.score);
}

function followBuilderBlogItems(feed, date) {
  return dedupe(list(feed?.blogs).map((post, index) => ({
    baseId: `follow-builders-blog-${slug(post.url || post.title)}`,
    title: text(post.title || "Builder blog update").slice(0, 120),
    type: "builder-blog",
    audience: "开发者 / 产品负责人 / CTO",
    core: stripHtml(post.description || post.content || post.title).slice(0, 240),
    relevance: "来自 Follow Builders 官方/工程博客源，适合观察产品路线、开发者工具和 Agent 实践变化。",
    evidence: `Follow Builders · ${post.name || post.source || "Blog"} · ${post.publishedAt || date}`,
    source: "Follow Builders",
    subSource: post.name || "Builder Blog",
    url: post.url || "",
    date: text(post.publishedAt).slice(0, 10) || date,
    score: 88 - Math.min(index, 6),
  }))).sort((a, b) => b.score - a.score);
}

function sourceDefinitions() {
  return [
    { id: "raw_pool_pitch", title: "Raw-Pool-Pitch", desc: "每日 Raw / Pool / Card 产物" },
    { id: "industry_chain", title: "产业链分析", desc: "arXiv / HN / 官方博客" },
    { id: "builders", title: "Builders 文章", desc: "GitHub Trending / Show HN / 开发者博客" },
    { id: "viral_rewrite", title: "爆款改编", desc: "HN 热门 / arXiv 热点" },
  ];
}

function normalizeSignal(signal, index, content) {
  const sourceUrl = text(signal.sourceUrl || signal.url || signal.link);
  const host = hostFromUrl(sourceUrl);
  const title = text(signal.frontend?.displayTitle || signal.editorialTitle || signal.title || signal.sourceTitle || `候选信号 ${index + 1}`);
  const item = {
    baseId: text(signal.id || signal.slug || slug(title)),
    title,
    type: text(signal.signalType || signal.type || signal.contentType || "signal").replaceAll("_", "-"),
    audience: text(signal.audience || "企业老板 / 业务负责人 / AI 产品与运营负责人"),
    core: text(signal.judgment || signal.frontend?.whyWatch || signal.event || signal.brief || signal.summary),
    relevance: text(signal.businessMeaning || signal.frontend?.businessMeaning || signal.brief || signal.summary),
    evidence: text(signal.frontend?.evidenceNote || signal.counter || signal.sourceTitle || signal.sources || host),
    source: host || text(signal.sourceTitle || signal.sources || "content asset"),
    url: sourceUrl,
    date: text(signal.date || content.meta?.date),
    score: 91 - Math.min(index, 7),
  };
  // 尝试从原始文章提取原文摘要，替代管线失真概要
  if (signal.sourcePath) {
    const rawSummary = extractRawSummary(signal.sourcePath);
    if (rawSummary) {
      item.originalSummary = rawSummary;
    }
  }
  return item;
}

/**
 * 从信号卡的 YAML frontmatter → primary_raw.raw_json → discovery_record.discovery_summary
 * 提取原始文章摘要（RSS 源原始描述，未经管线处理）
 */
function extractRawSummary(signalCardPath) {
  try {
    const absPath = path.resolve(root, signalCardPath);
    if (!fs.existsSync(absPath)) return null;
    const cardContent = fs.readFileSync(absPath, 'utf8');
    const yamlMatch = cardContent.match(/^---\n([\s\S]*?)\n---/);
    if (!yamlMatch) return null;
    const yamlLines = yamlMatch[1].split('\n');
    // 在 primary_raw: 块下找到 raw_json: 路径
    let inPrimaryRaw = false;
    let rawJsonPath = '';
    for (const line of yamlLines) {
      if (line.trimStart().startsWith('primary_raw:')) { inPrimaryRaw = true; continue; }
      if (inPrimaryRaw && line.trimStart().startsWith('raw_json:')) {
        rawJsonPath = line.replace(/^\s*raw_json:\s*['"]?/, '').replace(/['"]?\s*$/, '');
        break;
      }
      if (inPrimaryRaw && line.length > 0 && !line.startsWith(' ') && !line.startsWith('\t')) {
        inPrimaryRaw = false;
      }
    }
    if (!rawJsonPath) return null;

    const rawJsonAbs = path.resolve(root, rawJsonPath);
    if (!fs.existsSync(rawJsonAbs)) return null;
    const rawJson = JSON.parse(fs.readFileSync(rawJsonAbs, 'utf8'));
    const summary = rawJson.discovery_record?.discovery_summary;
    if (summary && summary.length > 10) return summary;

    // fallback: 用 clean_text 前 200 字
    const cleanText = rawJson.clean_text || rawJson.full_text || '';
    if (cleanText.length > 20) return cleanText.slice(0, 200).replace(/\n+/g, ' ').trim();
    return null;
  } catch {
    return null;
  }
}

function rawPoolTopics(content, date) {
  const items = [];
  if (content.daily?.title) {
    items.push({
      baseId: text(content.daily.id || "daily-observation"),
      title: text(content.daily.title),
      type: "daily",
      audience: "企业老板 / 业务负责人",
      core: text(content.daily.judgment || content.daily.dek || content.daily.summary),
      relevance: text(content.daily.homeSummary || content.daily.summary || content.daily.dek),
      evidence: text(content.daily.dek || content.daily.issue),
      source: "今日观察",
      url: text(content.daily.link),
      date,
      score: 96,
    });
  }
  list(content.signals).forEach((signal, index) => items.push(normalizeSignal(signal, index, content)));

  const seen = new Set();
  return items
    .filter((item) => item.title && !seen.has(item.title) && seen.add(item.title))
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((item, index) => toTopic("raw_pool_pitch", item, index, date));
}

function scoreParts(score) {
  return {
    conflict: Math.round(score * 0.25),
    roleChange: Math.round(score * 0.2),
    counterIntuit: Math.round(score * 0.15),
    storyHook: Math.round(score * 0.15),
    insight: Math.round(score * 0.15),
    evidence: Math.round(score * 0.1),
  };
}

function toTopic(sourceId, item, index, date) {
  const sources = sourceDefinitions();
  const source = sources.find((entry) => entry.id === sourceId) || sources[0];
  const score = Math.max(72, Math.min(99, Number(item.score) || 80));
  const topic = {
    id: `${sourceId}-${slug(item.baseId || item.title)}-${index + 1}`,
    sourceId,
    sourceName: source.title,
    sourceDesc: item.sourceDesc || source.desc,
    subSource: item.subSource || item.source || "",
    baseId: item.baseId || slug(item.title),
    title: item.title,
    type: item.type || "topic",
    audience: item.audience || "企业老板 / 业务负责人",
    core: item.core || item.title,
    relevance: item.relevance || "需要判断它是否改变企业预算、流程、客户入口或责任边界。",
    evidence: item.evidence || item.source || "公开来源",
    source: item.source || item.subSource || source.title,
    url: item.url || "",
    date: item.date || date,
    score,
    grade: scoreGrade(score),
    priority: priorityLabel(score),
    scoreBreakdown: item.scoreBreakdown || scoreParts(score),
  };
  if (item.originalSummary) {
    topic.originalSummary = item.originalSummary;
  }
  topic.angles = Array.isArray(item.angles) && item.angles.length ? item.angles : angleSet(topic);
  return topic;
}

function angleSet(topic) {
  const subject = topic.title.split(/[，,：:｜|]/u)[0].slice(0, 34) || topic.title.slice(0, 34);
  if (topic.sourceId === "industry_chain") {
    return [
      { title: `从 ${subject} 看 AI 预算正流向哪一段产业链`, note: `切口：先写事件，再判断钱会落在算力、工具、集成、渠道还是客户现场。可用事实：${topic.evidence}` },
      { title: `${subject} 会先影响谁的采购单`, note: "切口：把读者带到一个具体买方岗位，比如 CIO、工厂负责人、客服负责人或销售运营负责人。" },
      { title: "这不是技术升级，而是责任边界重画", note: `切口：写清楚系统出错时谁负责、谁复核、谁买单。商业落点：${topic.relevance}` },
    ];
  }
  if (topic.sourceId === "builders") {
    return [
      { title: `${subject} 背后的开发者真实需求`, note: "切口：不写工具测评，写开发者为什么愿意换流程、接插件、改团队协作方式。" },
      { title: "从演示走向日常工作，差的是哪一步", note: "切口：拆一个真实任务链：需求进入、代码生成、测试、审阅、上线。" },
      { title: "企业读者该看哪些采用信号", note: "切口：看文档更新频率、GitHub issue、客户引用、招聘岗位和生态插件。" },
    ];
  }
  if (topic.sourceId === "viral_rewrite") {
    return [
      { title: `${subject} 为什么会刺中企业焦虑`, note: "切口：找一个明确情绪钩子，比如岗位替代、预算失控、客户流失、安全责任。" },
      { title: "把热闹改写成一个商业冲突", note: "切口：标题必须回答谁的利益被改变，比如供应商拿走预算、员工失去入口、平台获得控制权。" },
      { title: "爆款改编前必须补哪条事实", note: `切口：先补一条可验证来源，再写观点。当前可用证据边界：${topic.evidence}` },
    ];
  }
  return [
    { title: `${subject} 改变的是哪一类企业判断`, note: `切口：从老板是否加预算、换供应商、调岗位或重做流程写起。商业落点：${topic.relevance}` },
    { title: "这件事为什么不是普通新闻", note: `切口：找一条可验证动作，例如官方发布、客户采用、融资金额、采购入口或产品上线。当前证据：${topic.evidence}` },
    { title: "能不能转成前台 Card", note: "切口：只判断证据是否足够支撑案例、产品、融资或观点卡，不写内部生产流程。" },
  ];
}

async function fetchArxiv(query, limit = 8) {
  const url = `https://export.arxiv.org/api/query?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${limit}`;
  const xml = await fetchText(url);
  return xml.split("<entry>").slice(1).map((entry, index) => {
    const title = stripHtml(entry.match(/<title[^>]*>([\s\S]*?)<\/title>/u)?.[1]);
    const summary = stripHtml(entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/u)?.[1]);
    const link = stripHtml(entry.match(/<id[^>]*>([\s\S]*?)<\/id>/u)?.[1]);
    const authors = [...entry.matchAll(/<name[^>]*>([\s\S]*?)<\/name>/gu)].slice(0, 3).map((match) => stripHtml(match[1])).join(", ");
    return title ? { title, summary, link, authors, index } : null;
  }).filter(Boolean);
}

/**
 * 每日推荐一篇AI编程/工具/实践类文章。
 * 面向vibecoding新手用户——更侧重编程助手、工具入门、实践指南。
 * 从 arXiv 程序语言/人机交互/AI 分类中抓取最新文章。
 */
async function fetchRecommendedPaper(date) {
  const papers = await fetchArxiv(
    "(cat:cs.SE+OR+cat:cs.HC+OR+cat:cs.AI)+AND+abs:(code+generation+OR+copilot+OR+programming+assistant+OR+tutorial+OR+guide+OR+build+OR+prompt+OR+developer+tool+OR+LLM+OR+code+repair+OR+code+synthesis+OR+application+OR+demo+OR+how+to)",
    20
  );
  if (!papers.length) return null;

  const scored = papers.map((p) => {
    const text = `${p.title} ${p.summary}`.toLowerCase();
    let score = 0;
    // 🔥 核心：vibecoding / AI编程实操类（最高加分）
    if (/vibecode|vibe.?cod|copilot|code.?generat|code.?synthesis|programming.?assistant|ai.?assisted.?programming|ai.?programming|code.?complet|code.?repair|auto.?complet/i.test(text)) score += 5;
    // 🎯 教程/入门/实战指南类
    if (/tutorial|getting.?start|beginner|practical.?guide|how.?to|step.?by.?step|walkthrough|上手|入门|实践|指南|新手/i.test(text)) score += 5;
    // 🛠 工具/框架/SDK 类
    if (/tool|sdk|api|cli|framework|library|plugin|extension|ide|editor|workspace|开发工具|工具包/i.test(text)) score += 4;
    // 💡 prompt工程/agent实操
    if (/prompt.?engineer|prompt.?design|chain.?of.?thought|agent.?workflow|agent.?orchestrat|llm.?pipeline|多步推理|思维链/i.test(text)) score += 3;
    // 🚀 应用构建/项目实战
    if (/build|creat|develop|implement|deploy|application|project|demo|prototype|case.?study|构建|开发|部署|应用/i.test(text)) score += 3;
    // 📊 有用数据/效果对比（但对新手加分不如上面的高）
    if (/\d+[%x.]|improve|reduce|achieve|user.?stud|empirical|survey|comparison|评测|对比|调研/i.test(text)) score += 1;
    // ❌ 太理论/数学多的扣分（不适合新手）
    if (/theorem|lemma|proof|conjecture|mathematical|axiom|convergence|asymptotic|complexity.?class|computational.?complexity/i.test(text)) score -= 4;
    // ❌ 纯benchmark/评测没有实操价值的减分
    if (/benchmark.?suite|leaderboard|dataset.?curation/i.test(text)) score -= 1;
    return { ...p, _score: score };
  });
  scored.sort((a, b) => b._score - a._score);
  let best = scored[0];
  // 质量门：arXiv 最佳论文是否命中 vibe 核心词？
  // 如果只有 build/tool/application 等泛词，不算真正的 vibecoding 内容
  const hasVibeSignal = best ? /vibecode|vibe.?cod|copilot|code.?generat|code.?synthesis|programming.?assistant|ai.?assisted.?programming|ai.?programming|code.?complet|code.?repair|tutorial|getting.?start|beginner|practical.?guide|how.?to|step.?by.?step/i.test(
    `${best.title} ${best.summary}`.toLowerCase()
  ) : false;
  // 如果 arXiv 分数高但没命中 vibe 核心词，或者分数不够，都尝试 HN 回退
  if (!best || !hasVibeSignal || best._score < 2) {
    // arXiv 没有合适的——从 HN best 帖子里找编程实操/工具类内容
    const hnStories = await fetchHnItems("beststories", 30);
    const vibeStories = hnStories.filter((s) => {
      const t = `${s.title} ${s.text || ""}`.toLowerCase();
      return /ai|llm|gpt|claude|copilot|code|coding|programming|build|tool|tutorial|guide|开发|编程|工具|教程/i.test(t) &&
        !/show hn/i.test(s.title);
    });
    if (vibeStories.length) {
      const hnScored = vibeStories.map((s) => {
        const t = `${s.title} ${s.text || ""}`.toLowerCase();
        let score = 0;
        if (/vibecode|vibe.?cod|copilot|code.?generat|programming.?assistant|ai.?assisted.?programming|ai.?programming|code.?complet/i.test(t)) score += 5;
        if (/tutorial|getting.?start|beginner|how.?to|step.?by.?step|walkthrough|上手|入门|实践|指南/i.test(t)) score += 5;
        if (/tool|sdk|api|cli|framework|plugin|extension|ide/i.test(t)) score += 4;
        if (/prompt.?engineer|prompt.?design|agent.?workflow|chain.?of.?thought/i.test(t)) score += 3;
        if (/build|creat|develop|deploy|application|project|demo|prototype/i.test(t)) score += 3;
        if (/theorem|lemma|proof|mathematical|axiom|convergence/i.test(t)) score -= 4;
        return { title: s.title, summary: s.text?.slice(0, 300) || s.title, link: s.url || `https://news.ycombinator.com/item?id=${s.id}`, authors: "Hacker News", _score: score };
      });
      hnScored.sort((a, b) => b._score - a._score);
      best = hnScored[0];
    }
  }
  // 最终检查：如果 best 还是 arXiv 的且没有 vibe 信号，放弃（不适合新手）
  if (best && !hasVibeSignal && best.authors !== "Hacker News" && !/vibecode|vibe.?cod|copilot|code.?generat|tutorial|getting.?start|beginner|practical.?guide|how.?to/i.test(`${best.title} ${best.summary}`.toLowerCase())) {
    return null;
  }
  if (!best || best._score < 2) return null;

  return {
    title: best.title.slice(0, 150),
    summary: stripHtml(best.summary).replace(/\s+/g, ' ').trim().slice(0, 300),
    url: best.link,
    authors: best.authors,
    date,
  };
}

async function fetchHnItems(endpoint, limit = 20) {
  const ids = await fetchJson(`https://hacker-news.firebaseio.com/v0/${endpoint}.json`);
  if (!Array.isArray(ids)) return [];
  const items = await Promise.all(ids.slice(0, limit).map((id) => fetchJson(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)));
  return items.filter((item) => item && item.type === "story" && item.title);
}

function hasIndustryRelevance(text) {
  return /enterprise|deploy|startup|funding|revenue|acquisition|partner|market|business|customer|investment|regulation|policy|launch|product|competition|adoption|deployment|study|report|analysis|impact|cost|企业|部署|市场|融资|收购|监管|客户|供应商|预算|采购|生态|商业化|影响|报告|研究/iu.test(text);
}

async function fetchNewsApi(date) {
  const results = [];
  const apiKey = process.env.NEWSAPI_KEY;
  if (apiKey) {
    const url = `https://newsapi.org/v2/everything?q=AI+enterprise+OR+AI+business&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;
    const data = await fetchJson(url);
    if (data?.articles?.length) {
      data.articles.slice(0, 5).forEach((article, index) => {
        const title = stripHtml(article.title || "").slice(0, 120);
        if (!title || !hasAiSignal(title)) return;
        results.push({
          baseId: `newsapi-${slug(title)}`,
          title,
          type: "news",
          audience: "企业决策者 / 投资人",
          core: stripHtml(article.description || article.title || "").slice(0, 220),
          relevance: "全球商业新闻，反映AI产业链融资、合作、监管、竞争动态。",
          evidence: `NewsAPI · ${article.source?.name || "News"} · ${(article.publishedAt || date).slice(0, 10)}`,
          source: article.source?.name || "Business News",
          subSource: article.source?.name || "Business News",
          url: article.url || "",
          date: (article.publishedAt || date).slice(0, 10),
          score: 83 - index,
        });
      });
    }
  }
  return results;
}

async function fetchOfficialBlogs(date) {
  const results = [];
  const blogs = [
    { name: "OpenAI", url: "https://openai.com/blog", filter: /ai|model|gpt|o3|agent|research|launch|release/siu },
    { name: "Google AI", url: "https://blog.google/technology/ai/", filter: /ai|model|gemini|agent|research|launch/siu },
    { name: "Meta AI", url: "https://ai.meta.com/blog/", filter: /ai|model|llama|agent|research/siu },
    { name: "DeepMind", url: "https://deepmind.google/blog/", filter: /ai|model|agent|research|discover/siu },
  ];

  for (const blog of blogs) {
    const html = await fetchText(blog.url);
    const matches = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gu)];
    matches.slice(0, 3).forEach((match, index) => {
      const title = stripHtml(match[1]);
      if (!title || !blog.filter.test(title)) return;
      results.push({
        baseId: `${slug(blog.name)}-${slug(title)}`,
        title: title.slice(0, 120),
        type: "official",
        audience: "AI 行业从业者 / 投资人",
        core: `${blog.name} 官方博客：${title}`,
        relevance: "头部 AI 公司官方发布，直接反映产品路线和战略方向。",
        evidence: blog.name,
        source: blog.name,
        subSource: blog.name,
        url: blog.url,
        date,
        score: 85 - index,
      });
    });
  }
  return results;
}

async function fetchIndustryChain(date) {
  const results = [];
  const papers = await fetchArxiv("cat:cs.AI+AND+abs:agent+AND+abs:(business+OR+enterprise+OR+deploy+OR+market)", 12);
  papers.slice(0, 5).forEach((paper, index) => {
    results.push({
      baseId: `arxiv-${slug(paper.title)}`,
      title: paper.title.slice(0, 120),
      type: "research",
      audience: "AI 战略负责人 / 企业 CTO",
      core: paper.summary.slice(0, 220),
      relevance: /business|enterprise|deploy|market|industry|cost|customer/iu.test(paper.summary) ? "有产业应用指向，适合判断企业 AI 预算流向。" : "偏学术理论，需要补商业验证才能进入正式选题。",
      evidence: `arXiv 论文 · ${paper.authors || "多作者"}`,
      source: "arXiv",
      subSource: "arXiv",
      url: paper.link,
      date,
      score: 76 - index,
    });
  });

  const hnItems = await fetchHnItems("topstories", 50);
  hnItems
    .filter((item) => hasStrongAiTitle(item.title) && hasIndustryRelevance(`${item.title} ${item.text || ""}`)
      || (/\bai\b|openai|anthropic/iu.test(`${item.title} ${item.text || ""}`) && hasAiSignal(`${item.title} ${item.text || ""}`)))
    .slice(0, 12)
    .forEach((item, index) => {
      results.push({
        baseId: `hn-${item.id}`,
        title: item.title.slice(0, 120),
        type: "discussion",
        audience: "AI 从业者 / 技术决策者",
        core: stripHtml(item.text || item.title).slice(0, 220),
        relevance: "Hacker News 社区高活跃讨论，反映产业焦点和开发者早期反馈。",
        evidence: `Hacker News · ${item.score || "?"} points · ${item.by || "anonymous"}`,
        source: "Hacker News",
        subSource: "Hacker News",
        url: `https://news.ycombinator.com/item?id=${item.id}`,
        date: item.time ? new Date(item.time * 1000).toISOString().slice(0, 10) : date,
        score: Math.min(91, 78 + Math.floor((item.score || 0) / 80) - index),
      });
    });

  const blogHtml = await fetchText("https://www.anthropic.com/engineering");
  [...blogHtml.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gu)].slice(0, 4).forEach((match, index) => {
    const title = stripHtml(match[1]);
    if (!/(ai|agent|model|deploy|safety|enterprise|claude)/iu.test(title)) return;
    results.push({
      baseId: `anthropic-${slug(title)}`,
      title: title.slice(0, 120),
      type: "official",
      audience: "AI 行业从业者 / 投资分析师",
      core: `Anthropic 官方工程博客文章：${title}`,
      relevance: "头部 AI 公司工程实践反映行业瓶颈和突破方向。",
      evidence: "Anthropic Engineering Blog",
      source: "Anthropic Blog",
      subSource: "Anthropic Blog",
      url: "https://www.anthropic.com/engineering",
      date,
      score: 86 - index,
    });
  });

  // Source 2 新增：头部AI公司官方Blog RSS
  const officialBlogs = await fetchOfficialBlogs(date);
  results.push(...officialBlogs);

  // Source 2 新增：NewsAPI 全球商业新闻
  const newsApi = await fetchNewsApi(date);
  results.push(...newsApi);

  return dedupe(results).sort((a, b) => b.score - a.score).slice(0, 12).map((item, index) => toTopic("industry_chain", item, index, date));
}

async function fetchBuilders(date) {
  const results = [];
  const followBuilders = await fetchFollowBuildersFeeds();
  results.push(...followBuilderBlogItems(followBuilders.blogs, date).slice(0, 5));
  results.push(...followBuilderTweetItems(followBuilders.x, date).filter((item) => hasBuilderSignal(`${item.title} ${item.core}`)).slice(0, 8));

  const repoSearch = await fetchJson("https://api.github.com/search/repositories?q=topic:llm+OR+topic:ai-agent+OR+topic:artificial-intelligence&sort=updated&order=desc&per_page=15");
  if (Array.isArray(repoSearch?.items)) {
    repoSearch.items.slice(0, 8).forEach((repo) => {
      results.push({
        baseId: `github-api-${repo.full_name}`,
        title: `${repo.full_name}: ${repo.description || "AI repository"}`.slice(0, 120),
        type: "open-source",
        audience: "开发者 / CTO",
        core: repo.description || "GitHub AI 仓库近期更新。",
        relevance: "GitHub 仓库更新适合观察开源工具链、Agent 框架和开发者采用方向。",
        evidence: `GitHub · ${repo.stargazers_count || 0} stars · updated ${repo.updated_at?.slice(0, 10) || date}`,
        source: "GitHub API",
        subSource: "GitHub API",
        url: repo.html_url,
        date: repo.updated_at?.slice(0, 10) || date,
        score: Math.min(91, 78 + Math.floor((repo.stargazers_count || 0) / 3000)),
      });
    });
  }

  const trendingHtml = await fetchText("https://github.com/trending?since=daily");
  trendingHtml.split("<article").slice(1, 18).forEach((block) => {
    const href = block.match(/href=["']\/([^\/"]+\/[^\/"]+?)["']/u)?.[1];
    const desc = stripHtml(block.match(/<p[^>]*>([\s\S]*?)<\/p>/u)?.[1]);
    const stars = Number((block.match(/(\d[\d,]*)\s+stars/iu)?.[1] || "0").replace(/,/gu, ""));
    if (!href || !hasBuilderSignal(`${href} ${desc}`)) return;
    const [owner, repo] = href.split("/");
    results.push({
      baseId: `github-${slug(href)}`,
      title: `${owner}/${repo}: ${desc || "GitHub 今日热门 AI 仓库"}`.slice(0, 120),
      type: "open-source",
      audience: "开发者 / CTO",
      core: desc || "GitHub 今日热门 AI 仓库。",
      relevance: `开发者社区关注度风向，适合观察工具链、插件生态和早期采用。`,
      evidence: `GitHub Trending · ${stars || "?"} stars · ${owner}`,
      source: "GitHub Trending",
      subSource: "GitHub Trending",
      url: `https://github.com/${href}`,
      date,
      score: Math.min(90, 74 + Math.floor(stars / 120)),
    });
  });

  const showItems = await fetchHnItems("showstories", 35);
  showItems
    .filter((item) => hasBuilderSignal(`${item.title} ${item.text || ""}`))
    .slice(0, 15)
    .forEach((item, index) => {
      results.push({
        baseId: `showhn-${item.id}`,
        title: item.title.slice(0, 120),
        type: "showcase",
        audience: "开发者 / 产品经理",
        core: stripHtml(item.text || item.title).slice(0, 220),
        relevance: "Show HN 是新产品和开源工具的早期发现渠道。",
        evidence: `Show HN · ${item.score || "?"} points · ${item.by || ""}`,
        source: "Show HN",
        subSource: "Show HN",
        url: `https://news.ycombinator.com/item?id=${item.id}`,
        date: item.time ? new Date(item.time * 1000).toISOString().slice(0, 10) : date,
        score: Math.min(88, 73 + Math.floor((item.score || 0) / 60) - index),
      });
    });

  const blogs = [
    { name: "OpenAI Developers", url: "https://developers.openai.com/" },
    { name: "Anthropic Engineering", url: "https://www.anthropic.com/engineering" },
    { name: "Vercel Blog", url: "https://vercel.com/blog" },
  ];
  for (const blog of blogs) {
    const html = await fetchText(blog.url);
    const title = stripHtml(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/u)?.[1] || html.match(/<title[^>]*>([\s\S]*?)<\/title>/u)?.[1]);
    if (!title) continue;
    results.push({
      baseId: `${slug(blog.name)}-${slug(title)}`,
      title: title.slice(0, 120),
      type: "developer-blog",
      audience: "开发者 / 产品负责人",
      core: `${blog.name} 最新页面标题：${title}`,
      relevance: "开发者博客更新适合观察工具链、API、部署方式和生态接口变化。",
      evidence: blog.name,
      source: blog.name,
      subSource: blog.name,
      url: blog.url,
      date,
      score: 82,
    });
  }

  return dedupe(results).sort((a, b) => b.score - a.score).slice(0, 5).map((item, index) => toTopic("builders", item, index, date));
}

async function fetchViralRewrites(date) {
  const results = [];
  const followBuilders = await fetchFollowBuildersFeeds();
  results.push(...followBuilderTweetItems(followBuilders.x, date).slice(0, 12).map((item) => ({
    ...item,
    type: "builder-viewpoint",
    audience: "企业老板 / 媒体编辑",
    relevance: "高互动 Builder 观点，适合改写成企业能理解的商业冲突和判断题。",
    score: Math.min(95, item.score + 2),
  })));

  const topItems = await fetchHnItems("topstories", 50);
  topItems
    .filter((item) => hasStrongAiTitle(item.title) || (/\bai\b|openai|anthropic/iu.test(`${item.title} ${item.text || ""}`) && hasAiSignal(`${item.title} ${item.text || ""}`)))
    .slice(0, 12)
    .forEach((item, index) => {
      results.push({
        baseId: `viral-hn-${item.id}`,
        title: item.title.slice(0, 120),
        type: "hot-topic",
        audience: "企业老板 / 媒体编辑",
        core: stripHtml(item.text || item.title).slice(0, 220),
        relevance: `HN ${item.score || "?"} points，高传播力，可改写成商业冲突叙事。`,
        evidence: `Hacker News · ${item.score || "?"} points · ${item.by || ""}`,
        source: "HN 热门",
        subSource: "HN 热门",
        url: `https://news.ycombinator.com/item?id=${item.id}`,
        date: item.time ? new Date(item.time * 1000).toISOString().slice(0, 10) : date,
        score: Math.min(94, 82 + Math.floor((item.score || 0) / 90) - index),
      });
    });

  const papers = await fetchArxiv("cat:cs.AI+AND+abs:(agent+OR+LLM+OR+robot+OR+safety)", 12);
  papers.slice(0, 5).forEach((paper, index) => {
    results.push({
      baseId: `viral-arxiv-${slug(paper.title)}`,
      title: paper.title.slice(0, 120),
      type: "breakthrough",
      audience: "AI 从业者 / 投资人",
      core: `前沿论文：${paper.summary.slice(0, 220)}`,
      relevance: "学术突破常被简化为热点标题，适合改写成企业能理解的商业冲突。",
      evidence: "arXiv preprint",
      source: "arXiv 热点",
      subSource: "arXiv 热点",
      url: paper.link,
      date,
      score: 81 - index,
    });
  });

  return dedupe(results).sort((a, b) => b.score - a.score).slice(0, 5).map((item, index) => toTopic("viral_rewrite", item, index, date));
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = slug(item.url || item.title);
    if (!item.title || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * 加载前一天的 topic-center.json，构建跨天去重 key 集合。
 * 仅当已有数据且日期不同于当前日期时生效（避免同一天重复跑时误杀）。
 */
function loadPreviousDedupKeys(date) {
  const previous = readLocalJson(topicCenterJsonPath, null);
  if (!previous || !previous.meta?.date || previous.meta.date === date) {
    return new Set(); // 无历史数据 或 同一天已跑过 — 跳过跨天去重
  }
  const keys = new Set();
  const collect = (item) => {
    if (item.baseId) keys.add(`id:${item.baseId}`);
    if (item.url) keys.add(`url:${slug(item.url)}`);
    if (item.title) keys.add(`title:${slug(item.title)}`);
  };
  // 从历史 events 中采集
  list(previous.grouped?.events).forEach(collect);
  // 从历史 viewpoints 中采集（含合并前的原始 URL）
  list(previous.grouped?.viewpoints).forEach((vp) => {
    collect(vp);
    if (Array.isArray(vp.originalUrls)) {
      vp.originalUrls.forEach((url) => { if (url) keys.add(`url:${slug(url)}`); });
    }
  });
  console.log(`[cross-day-dedup] loaded ${keys.size} dedup keys from ${previous.meta.date}`);
  return keys;
}

/**
 * 跨天去重过滤器：从 items 中移除与 previousKeys 匹配的项。
 */
function crossDayDedupe(items, previousKeys) {
  if (!previousKeys || previousKeys.size === 0) return items;
  const before = items.length;
  const filtered = items.filter((item) => {
    const itemKeys = [];
    if (item.baseId) itemKeys.push(`id:${item.baseId}`);
    if (item.url) itemKeys.push(`url:${slug(item.url)}`);
    if (item.title) itemKeys.push(`title:${slug(item.title)}`);
    return !itemKeys.some((key) => previousKeys.has(key));
  });
  const removed = before - filtered.length;
  if (removed > 0) console.log(`[cross-day-dedup] filtered ${removed}/${before} items`);
  return filtered;
}

function mergeViewpoints(builders, viralRewrite) {
  // 跨源去重：按 URL slug 去重
  const seen = new Set();
  const allItems = [...builders, ...viralRewrite].filter((item) => {
    const key = slug(item.url || item.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // 按人物（subSource）分组
  const groups = {};
  for (const item of allItems) {
    const person = item.subSource || item.source || item.title.split(/[:：]/u)[0] || "unknown";
    if (!groups[person]) groups[person] = [];
    groups[person].push(item);
  }

  // 按最高分排序，取前3人
  const sorted = Object.entries(groups)
    .map(([person, items]) => {
      const best = items.sort((a, b) => b.score - a.score)[0];
      return { person, items, score: best.score, best };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return sorted.map((group, index) => {
    const primary = group.best;
    // 同一个人多条观点 → 合并标题
    const mergedTitle = group.items.length > 1
      ? group.person + "：" + group.items.map((item) => {
          const prefix = group.person + "：";
          const prefix2 = group.person + ": ";
          const t = item.title;
          return t.startsWith(prefix) ? t.slice(prefix.length)
            : t.startsWith(prefix2) ? t.slice(prefix2.length)
            : t;
        }).join(" / ")
      : primary.title;

    return {
      ...primary,
      id: `viewpoint-${slug(group.person)}-${index + 1}`,
      title: mergedTitle,
      mergedCount: group.items.length,
      originalUrls: group.items.map((item) => item.url).filter(Boolean),
    };
  });
}

/**
 * 识别事件所属的公司/组织簇，用于多样性过滤。
 */
function companyCluster(item) {
  const url = text(item.url || '');
  const source = text(item.source || item.subSource || '');
  const title = text(item.title || '');

  // 标题中提到的公司名（用于 URL 不直接反映公司归属的情况）
  if (/\banthropic\b/i.test(title) && !/hacker news/i.test(source)) return 'Anthropic';
  if (/\b(openai|chatgpt|gpt-?5)\b/i.test(title)) return 'OpenAI';
  if (/\b(claude\b.*\bcode|claude code)\b/i.test(title)) return 'Anthropic';

  // 按 URL/来源 判断
  if (/anthropic\.com/i.test(url) || /anthropic/i.test(source)) return 'Anthropic';
  if (/openai\.com/i.test(url) || /openai/i.test(source)) return 'OpenAI';
  if (/(research|blog|deepmind)\.?google/i.test(url) || /google ai|deepmind/i.test(source)) return 'Google';
  if (/ai\.meta\.com/i.test(url) || /meta ai/i.test(source)) return 'Meta';
  if (/nvidia/i.test(url) || /nvidia/i.test(source) || /nvidia/i.test(title)) return 'NVIDIA';
  if (/microsoft/i.test(url) || /microsoft/i.test(source)) return 'Microsoft';
  if (/amazon|aws/i.test(url) || /amazon|aws/i.test(source)) return 'Amazon';
  if (/techcrunch|reuters|bloomberg|wired|theverge|arstechnica/i.test(url)) return 'Media';

  // 社区/开源/研究 — 这些是多样性来源，不合并
  if (/news\.ycombinator/i.test(url) || /hacker news/i.test(source)) return 'Community';
  if (/github/i.test(url) || /github/i.test(source)) return 'OpenSource';
  if (/arxiv/i.test(url) || /arxiv/i.test(source)) return 'Research';
  if (/follow builders/i.test(source)) return 'Builder';
  if (/newsapi/i.test(source)) return 'News';

  return 'Other';
}

/**
 * 多样性过滤+大厂合并：选出恰好10条事件。
 * 规则：
 *   1. 大厂（Anthropic/Google/OpenAI/Meta/NVIDIA/Microsoft/Amazon）最多1条，多条则合并标题+摘要
 *   2. 非大厂簇最多 maxPerCluster 条
 *   3. 预留 diversityQuota 个名额给非大厂簇
 *   4. 优先选取含行业应用/融资/创业的内容
 */
function diversifyEvents(candidates, maxPerCluster = 2, diversityQuota = 4) {
  const BIG_TECH = new Set(['Anthropic', 'OpenAI', 'Google', 'Meta', 'NVIDIA', 'Microsoft', 'Amazon']);

  // 1. 按簇分组，大厂合并
  const clusters = {};
  for (const item of candidates) {
    const c = companyCluster(item);
    if (!clusters[c]) clusters[c] = [];
    clusters[c].push(item);
  }

  const merged = [];
  for (const [cluster, items] of Object.entries(clusters)) {
    items.sort((a, b) => b.score - a.score);
    if (BIG_TECH.has(cluster) && items.length > 1) {
      // 合并：标题用" / "连接，取最高分项的 core/originalSummary
      const primary = items[0];
      const mergedTitle = items.map((item) => {
        const t = item.title.split(/[：:]/u).pop() || item.title;
        return t;
      }).join(' / ');
      merged.push({
        ...primary,
        id: primary.id + '-merged',
        title: cluster + '：' + mergedTitle,
        mergedCount: items.length,
      });
    } else {
      merged.push(...items);
    }
  }

  // 2. 分大厂/非大厂排序
  const nonBigTech = merged.filter((item) => !BIG_TECH.has(companyCluster(item)))
    .sort((a, b) => b.score - a.score);
  const bigTech = merged.filter((item) => BIG_TECH.has(companyCluster(item)))
    .sort((a, b) => b.score - a.score);

  const result = [];
  const clusterCount = {};

  // 3. 阶段1：非大厂配额
  for (const item of nonBigTech) {
    const cluster = companyCluster(item);
    if ((clusterCount[cluster] || 0) >= maxPerCluster) continue;
    clusterCount[cluster] = (clusterCount[cluster] || 0) + 1;
    result.push(item);
    if (result.length >= diversityQuota) break;
  }

  // 4. 阶段2：大厂（每簇最多1条）
  for (const item of bigTech) {
    if (result.length >= 10) break;
    const cluster = companyCluster(item);
    if ((clusterCount[cluster] || 0) >= 1) continue;
    clusterCount[cluster] = (clusterCount[cluster] || 0) + 1;
    result.push(item);
  }

  // 5. 阶段3：从剩余非大厂填充到10条
  if (result.length < 10) {
    const used = new Set(result.map((item) => item.id));
    for (const item of nonBigTech) {
      if (used.has(item.id)) continue;
      const cluster = companyCluster(item);
      if ((clusterCount[cluster] || 0) >= maxPerCluster) continue;
      clusterCount[cluster] = (clusterCount[cluster] || 0) + 1;
      result.push(item);
      if (result.length >= 10) break;
    }
  }

  return result;
}

async function buildTopics(content, date, previousKeys) {
  let [rawPool, industryChain, builders, viralRewrite] = await Promise.all([
    Promise.resolve(rawPoolTopics(content, date)),
    fetchIndustryChain(date),
    fetchBuilders(date),
    fetchViralRewrites(date),
  ]);
  // 跨天去重：移除与前一天重复的项
  if (previousKeys && previousKeys.size > 0) {
    rawPool = crossDayDedupe(rawPool, previousKeys);
    industryChain = crossDayDedupe(industryChain, previousKeys);
    builders = crossDayDedupe(builders, previousKeys);
    viralRewrite = crossDayDedupe(viralRewrite, previousKeys);
  }
  return {
    sources: sourceDefinitions(),
    topics: [...rawPool, ...industryChain, ...builders, ...viralRewrite],
    rawPool,
    industryChain,
    builders,
    viralRewrite,
  };
}

async function main() {
  const siteContent = readJson(siteContentPath, {});
  const fallbackDate = text(siteContent.meta?.date).replaceAll(".", "-") || todayStr();
  const date = argValue("date", fallbackDate);
  // 先加载历史数据做跨天去重（必须在生成新数据之前）
  const previousKeys = loadPreviousDedupKeys(date);
  const { sources, topics, rawPool, industryChain, builders, viralRewrite } = await buildTopics(siteContent, date, previousKeys);
  const counts = Object.fromEntries(sources.map((source) => [source.id, topics.filter((topic) => topic.sourceId === source.id).length]));
  const viewpoints = mergeViewpoints(builders, viralRewrite);
  // 公司多样性过滤：同一公司簇最多2条
  const allEventCandidates = [...rawPool, ...industryChain];
  const diversifiedEvents = diversifyEvents(allEventCandidates, 2);
  // 推荐论文：今日AI研究文章
  let recommendedPaper = await fetchRecommendedPaper(date);
  // 去重检查：论文标题不能和事件明显重复
  if (recommendedPaper) {
    const paperWords = new Set(recommendedPaper.title.toLowerCase().split(/[^a-z0-9\u4e00-\u9fff]+/).filter(Boolean));
    const isDup = diversifiedEvents.some((evt) => {
      const evtWords = new Set((evt.title || '').toLowerCase().split(/[^a-z0-9\u4e00-\u9fff]+/).filter(Boolean));
      const overlap = [...paperWords].filter((w) => evtWords.has(w) && w.length > 1).length;
      return paperWords.size > 0 && overlap / paperWords.size > 0.6;
    });
    if (isDup) {
      console.log(`[dedup] paper "${recommendedPaper.title.slice(0, 60)}" overlaps with event — skipping`);
      recommendedPaper = null;
    }
  }
  const data = {
    meta: {
      version: topicCenterVersion,
      date,
      generatedAt: new Date().toISOString(),
      source: "external-source-algorithms",
      rule: "raw_pool_plus_external_sources_five_each",
      lockedAs: "ops-topic-center-v1.1.1",
      sources: counts,
      recommendedPaper,
    },
    sources,
    topics,
    grouped: {
      events: diversifiedEvents,
      viewpoints,
    },
  };

  writeJson(topicCenterJsonPath, data);
  fs.writeFileSync(topicCenterJsPath, `window.WaveSightTopicCenter = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  console.log(`topic-center generated: ${topics.length} topics -> ${path.relative(root, topicCenterJsonPath)}`);
  console.log(JSON.stringify(counts));
}

main().catch((error) => {
  console.error(`[topic-center] ${error.message}`);
  process.exit(1);
});
