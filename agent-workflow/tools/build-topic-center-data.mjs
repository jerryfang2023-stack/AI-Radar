import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const siteContentPath = path.join(siteDataDir, "site-content.json");
const topicCenterJsonPath = path.join(siteDataDir, "topic-center.json");
const topicCenterJsPath = path.join(siteDataDir, "topic-center.js");
const topicCenterVersion = "V1.1.1";
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
  return {
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
    .slice(0, 5)
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
  const papers = await fetchArxiv("cat:cs.AI+AND+abs:agent+AND+abs:(business+OR+enterprise+OR+deploy+OR+market)", 8);
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

  const hnItems = await fetchHnItems("topstories", 30);
  hnItems
    .filter((item) => hasStrongAiTitle(item.title) && hasIndustryRelevance(`${item.title} ${item.text || ""}`)
      || (/\.ai\b|openai|anthropic/iu.test(`${item.title} ${item.text || ""}`) && hasAiSignal(`${item.title} ${item.text || ""}`)))
    .slice(0, 8)
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

  return dedupe(results).sort((a, b) => b.score - a.score).slice(0, 5).map((item, index) => toTopic("industry_chain", item, index, date));
}

async function fetchBuilders(date) {
  const results = [];
  const followBuilders = await fetchFollowBuildersFeeds();
  results.push(...followBuilderBlogItems(followBuilders.blogs, date).slice(0, 3));
  results.push(...followBuilderTweetItems(followBuilders.x, date).filter((item) => hasBuilderSignal(`${item.title} ${item.core}`)).slice(0, 6));

  const repoSearch = await fetchJson("https://api.github.com/search/repositories?q=topic:llm+OR+topic:ai-agent+OR+topic:artificial-intelligence&sort=updated&order=desc&per_page=8");
  if (Array.isArray(repoSearch?.items)) {
    repoSearch.items.slice(0, 5).forEach((repo) => {
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
  trendingHtml.split("<article").slice(1, 12).forEach((block) => {
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

  const showItems = await fetchHnItems("showstories", 25);
  showItems
    .filter((item) => hasBuilderSignal(`${item.title} ${item.text || ""}`))
    .slice(0, 10)
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
  results.push(...followBuilderTweetItems(followBuilders.x, date).slice(0, 8).map((item) => ({
    ...item,
    type: "builder-viewpoint",
    audience: "企业老板 / 媒体编辑",
    relevance: "高互动 Builder 观点，适合改写成企业能理解的商业冲突和判断题。",
    score: Math.min(95, item.score + 2),
  })));

  const topItems = await fetchHnItems("topstories", 35);
  topItems
    .filter((item) => hasStrongAiTitle(item.title) || (/\.ai\b|openai|anthropic/iu.test(`${item.title} ${item.text || ""}`) && hasAiSignal(`${item.title} ${item.text || ""}`)))
    .slice(0, 8)
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

  const papers = await fetchArxiv("cat:cs.AI+AND+abs:(agent+OR+LLM+OR+robot+OR+safety)", 8);
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

async function buildTopics(content, date) {
  const [rawPool, industryChain, builders, viralRewrite] = await Promise.all([
    Promise.resolve(rawPoolTopics(content, date)),
    fetchIndustryChain(date),
    fetchBuilders(date),
    fetchViralRewrites(date),
  ]);
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
  const { sources, topics, rawPool, industryChain, builders, viralRewrite } = await buildTopics(siteContent, date);
  const counts = Object.fromEntries(sources.map((source) => [source.id, topics.filter((topic) => topic.sourceId === source.id).length]));
  const viewpoints = mergeViewpoints(builders, viralRewrite);
  const data = {
    meta: {
      version: topicCenterVersion,
      date,
      generatedAt: new Date().toISOString(),
      source: "external-source-algorithms",
      rule: "raw_pool_plus_external_sources_five_each",
      lockedAs: "ops-topic-center-v1.1.1",
      sources: counts,
    },
    sources,
    topics,
    grouped: {
      events: [...rawPool, ...industryChain],
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
