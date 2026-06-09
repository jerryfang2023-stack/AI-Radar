import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const outputPath = path.join(siteRoot, "data", "community-intelligence.json");

const cdpUrl = process.env.COMMUNITY_CDP_URL || "http://127.0.0.1:9333";
const scrolls = Number(process.env.COMMUNITY_SCROLLS || 1);
const homeDetailLimit = Number(process.env.COMMUNITY_DETAIL_LIMIT || 6);
const searchDetailLimit = Number(process.env.COMMUNITY_SEARCH_DETAIL_LIMIT || 1);
const searchLimit = Number(process.env.COMMUNITY_SEARCH_LIMIT || 8);

const sources = {
  scys: {
    name: "生财有术",
    url: "https://scys.com/",
    cardSelector: ".compact-card",
    searchInput: 'input[placeholder*="搜索内容"]',
  },
  aipoju: {
    name: "AI破局",
    url: "https://aipoju.com/index",
    cardSelector: ".article-item",
    searchUrl: (keyword) => `https://aipoju.com/search?q=${encodeURIComponent(keyword)}`,
  },
};

const keywordGroups = {
  industry: ["留学", "教育", "健身房", "本地生活", "餐饮", "外贸", "跨境电商", "企业培训", "招聘", "财税"],
  scenario: ["获客", "成交", "交付", "私域", "自动化", "内容生产", "客服", "销售", "SOP", "知识库"],
  tools: ["Codex", "Claude Code", "n8n", "Dify", "Coze", "Cursor", "Obsidian", "飞书", "RPA", "ComfyUI"],
  opportunity: ["订单", "营收", "变现", "月入", "降本", "提效", "求助", "需求", "代运营", "工具包"],
};

function clean(value = "") {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function compact(value = "", limit = 420) {
  const text = clean(value);
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function idFor(parts) {
  return crypto.createHash("sha1").update(parts.filter(Boolean).join("|")).digest("hex").slice(0, 14);
}

function matchAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

function scorePatterns(text, patterns, score) {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(text) ? score : 0), 0);
}

function selectSearchKeywords() {
  const fromEnv = (process.env.COMMUNITY_SEARCH_KEYWORDS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const all = fromEnv.length
    ? fromEnv.map((keyword) => ({ keyword, group: "custom" }))
    : Object.entries(keywordGroups).flatMap(([group, keywords]) => keywords.map((keyword) => ({ group, keyword })));
  if (!all.length || searchLimit <= 0) return [];
  const day = Math.floor(Date.now() / 86400000);
  const offset = day % all.length;
  return Array.from({ length: Math.min(searchLimit, all.length) }, (_, index) => all[(offset + index) % all.length]);
}

function extractLinks(text = "", anchors = []) {
  const found = new Map();
  for (const anchor of anchors || []) {
    if (!anchor?.href) continue;
    if (!/feishu|larksuite|docs\.qq|kdocs|yuque/i.test(`${anchor.href} ${anchor.text || ""}`)) continue;
    found.set(anchor.href, { href: anchor.href, text: clean(anchor.text || "正文链接") });
  }
  const urlRegex = /https?:\/\/[^\s"'<>，。）、)]+/gi;
  for (const match of String(text || "").matchAll(urlRegex)) {
    const href = match[0].replace(/[.,;:!?]+$/g, "");
    if (!/feishu|larksuite|docs\.qq|kdocs|yuque/i.test(href)) continue;
    found.set(href, { href, text: href });
  }
  return [...found.values()];
}

function inferScene(text = "") {
  const haystack = clean(text);
  const rules = [
    ["获客营销与转化", /获客|引流|线索|流量|私域|成交|转化|投流|小红书|抖音|搜索获客/i],
    ["交付与服务自动化", /交付|客服|SOP|自动化|RPA|工作流|流程|复购|中后端团队/i],
    ["AI基建与企业服务", /Codex|Claude Code|ChatGPT Plus|Gmail|Apple ID|VPS|AI基建|Agent 工作台|企业老板/i],
    ["内容生产与IP运营", /内容|自媒体|IP|公众号|视频号|短视频|直播|爆文|矩阵号/i],
    ["知识库与组织提效", /Obsidian|飞书|知识库|NotebookLM|业务大脑|知识管理|提效/i],
    ["产品化工具与项目库", /项目库|工具包|模板|产品化|SaaS|上线|内测|分档收费|项目方向/i],
    ["线下组局与培训复盘", /线下|组局|复盘|培训|大课|共读|行动营/i],
    ["垂直行业应用", /留学|教育|健身房|餐饮|外贸|跨境|财税|招聘|医美|房产|本地生活/i],
  ];
  return rules.find(([, pattern]) => pattern.test(haystack))?.[0] || "AI应用案例";
}

function inferIndustry(text = "") {
  const haystack = clean(text);
  const rules = [
    ["留学教育", /留学|留学生|作业辅导|藤校|海外院校|教育/i],
    ["本地生活", /同城|实体商家|健身房|餐饮|门店|本地/i],
    ["企业服务", /企业|老板|咨询|交付|客户|培训|财税|招聘/i],
    ["内容与自媒体", /内容|IP|自媒体|小红书|公众号|视频号|短视频|抖音/i],
    ["跨境出海", /出海|海外|跨境|外贸|Gmail|美区|VPS/i],
    ["电商零售", /电商|店铺|带货|选品|直播/i],
  ];
  return rules.find(([, pattern]) => pattern.test(haystack))?.[0] || "未识别行业";
}

function inferTools(text = "") {
  const names = [
    "Codex",
    "Claude Code",
    "Claude",
    "ChatGPT",
    "Gemini",
    "Grok",
    "Cursor",
    "Obsidian",
    "NotebookLM",
    "飞书",
    "n8n",
    "Dify",
    "Coze",
    "Openclaw",
    "RPA",
    "ComfyUI",
    "Mac mini",
  ];
  const haystack = clean(text);
  return names.filter((name) => new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(haystack));
}

function inferMonetization(text = "") {
  const haystack = clean(text);
  if (/订单|营收|月入|成交|收费|付费|客资|复购|GMV|变现|收入/i.test(haystack)) return "订单成交 / 收费变现";
  if (/代运营|服务|咨询|交付|企业老板|培训/i.test(haystack)) return "服务交付 / 咨询培训";
  if (/工具包|模板|手册|项目库|SOP|资料/i.test(haystack)) return "资料产品 / 工具包";
  if (/流量|引流|获客|私域|线索/i.test(haystack)) return "流量获客 / 线索转化";
  return "待确认";
}

function inferInsightType(text = "", links = []) {
  const haystack = clean(text);
  if (matchAny(haystack, [/求助|需求|有没有|怎么做|订单|营收|月入|收费|复购|获客|线索|变现|缺口|机会/i])) {
    return "opportunity";
  }
  if (matchAny(haystack, [/Codex|Claude Code|n8n|Dify|Coze|Cursor|Obsidian|飞书|RPA|ComfyUI|工作流|提示词|工具/i])) {
    return "tool_tip";
  }
  if (links.length || matchAny(haystack, [/案例|复盘|项目|赛道|行业|留学|健身房|餐饮|企业|本地/i])) {
    return "industry_case";
  }
  return "industry_case";
}

function inferPainPoints(text = "") {
  const haystack = clean(text);
  const points = [];
  if (/获客|引流|线索|流量|投流太贵|自然流/i.test(haystack)) points.push("获客成本与精准线索");
  if (/交付|复购|SOP|团队|中后端/i.test(haystack)) points.push("交付标准化与复购");
  if (/知识库|散|信息|工作流|效率|提效/i.test(haystack)) points.push("知识沉淀与效率");
  if (/工具不好用|不会配置|搞不定|AI基建|账号|VPS/i.test(haystack)) points.push("工具配置与AI基建门槛");
  if (/内容|矩阵|IP|爆文|视频/i.test(haystack)) points.push("内容生产与账号增长");
  return points.slice(0, 3);
}

function inferResultSignal(text = "") {
  const haystack = clean(text);
  const result = haystack.match(/(?:月入|营收|成交|订单|GMV|收费|粉丝|线索|客资|播放量)[^，。；;]{0,28}/i)?.[0];
  return result || "";
}

function inferReusableMethod(text = "") {
  const haystack = clean(text);
  const methods = [];
  if (/SOP|流程|步骤|框架|模板|手册/i.test(haystack)) methods.push("沉淀成SOP/模板");
  if (/小红书|抖音|搜索|内容|矩阵/i.test(haystack)) methods.push("内容获客路径");
  if (/Obsidian|飞书|知识库|工作流|Agent/i.test(haystack)) methods.push("知识库 + Agent 工作流");
  if (/交付|复购|中后端|团队/i.test(haystack)) methods.push("前端获客 + 后端交付拆分");
  if (/工具|产品|上线|内测|分档收费/i.test(haystack)) methods.push("工具产品化");
  return methods.slice(0, 3);
}

function opportunityScore(text = "", links = [], tools = []) {
  const haystack = clean(text);
  let score = 30;
  score += scorePatterns(haystack, [/订单|营收|月入|成交|收费|复购|GMV|变现|收入/i], 18);
  score += scorePatterns(haystack, [/获客|线索|需求|求助|合作|资源对接|缺口/i], 12);
  score += scorePatterns(haystack, [/SOP|模板|工具包|手册|项目库|工作流|产品化|上线|内测/i], 10);
  score += scorePatterns(haystack, [/留学|健身房|餐饮|企业|本地|跨境|教育|财税|招聘/i], 6);
  if (links.length) score += 8;
  if (tools.length) score += 6;
  return Math.max(0, Math.min(score, 100));
}

function valueScore({ text = "", links = [], tools = [], painPoints = [], reusableMethod = [], resultSignal = "", insightType = "" }) {
  const haystack = clean(text);
  let score = 18;
  if (links.length) score += Math.min(18, links.length * 7);
  if (tools.length) score += Math.min(16, tools.length * 4);
  if (painPoints.length) score += Math.min(12, painPoints.length * 5);
  if (reusableMethod.length) score += Math.min(18, reusableMethod.length * 7);
  if (resultSignal) score += 16;
  if (/月入|收入|营收|订单|成交|GMV|付费|复购|省下|降本|提效|增长|线索/i.test(haystack)) score += 14;
  if (/SOP|流程|模板|参数|清单|复盘|实操|教程|案例|方法论|开源|提示词/i.test(haystack)) score += 12;
  if (/求助|需求|怎么做|有没有|痛点|卡点|招募|合作|资源对接/i.test(haystack)) score += 8;
  if (insightType === "opportunity") score += 8;
  if (insightType === "tool_tip") score += 5;
  if (/预告一下|即将上线|待确认/.test(haystack) && !links.length && !resultSignal) score -= 10;
  if (haystack.length < 80) score -= 8;
  return Math.max(0, Math.min(score, 100));
}

function normalizeForDedupe(value = "") {
  return clean(value)
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^\p{Script=Han}\p{Letter}\p{Number}]+/gu, "")
    .slice(0, 96);
}

function canonicalUrl(item) {
  const url = clean(item.url);
  if (!url) return "";
  const source = sources[item.source];
  const sourceUrl = source?.url || "";
  if (url === sourceUrl) return "";
  if (item.source === "aipoju" && /^https:\/\/aipoju\.com\/(?:index)?(?:\?.*)?$/.test(url)) return "";
  if (item.source === "scys" && /^https:\/\/scys\.com\/?(?:\?.*)?$/.test(url)) return "";
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return url;
  }
}

function dedupeKey(item) {
  const url = canonicalUrl(item);
  if (url) return `${item.source}:url:${url}`;
  const titleKey = normalizeForDedupe(item.title);
  if (titleKey.length > 12) return `${item.source}:title:${titleKey}`;
  return `${item.source}:body:${normalizeForDedupe([item.summary, item.evidence, item.excerpt].join(" "))}`;
}

function uniqByText(values = []) {
  return [...new Set(values.map(clean).filter(Boolean))];
}

function mergeItems(items = []) {
  const groups = new Map();
  for (const item of items) {
    const key = dedupeKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }

  return [...groups.values()].map((group) => {
    const sorted = [...group].sort((a, b) => {
      const valueDelta = (b.valueScore || 0) - (a.valueScore || 0);
      if (valueDelta) return valueDelta;
      const linkDelta = (b.links || []).length - (a.links || []).length;
      if (linkDelta) return linkDelta;
      return clean(b.evidence).length - clean(a.evidence).length;
    });
    const base = { ...sorted[0] };
    const keywords = uniqByText(group.map((item) => item.collection?.keyword));
    const keywordGroups = uniqByText(group.map((item) => item.collection?.group));
    const linkMap = new Map();
    for (const item of group) {
      for (const link of item.links || []) {
        if (link?.href) linkMap.set(link.href, link);
      }
    }
    base.id = idFor([base.source, canonicalUrl(base), normalizeForDedupe(base.title)]);
    base.url = canonicalUrl(base) || base.url;
    base.links = [...linkMap.values()];
    base.tools = uniqByText(group.flatMap((item) => item.tools || []));
    base.painPoints = uniqByText(group.flatMap((item) => item.painPoints || []));
    base.reusableMethod = uniqByText(group.flatMap((item) => item.reusableMethod || []));
    base.summary = sorted.map((item) => item.summary).sort((a, b) => clean(b).length - clean(a).length)[0] || base.summary;
    base.evidence = sorted.map((item) => item.evidence).sort((a, b) => clean(b).length - clean(a).length)[0] || base.evidence;
    base.excerpt = sorted.map((item) => item.excerpt).sort((a, b) => clean(b).length - clean(a).length)[0] || base.excerpt;
    base.matchedKeywords = keywords;
    base.duplicateCount = group.length;
    base.collection = {
      ...base.collection,
      keyword: keywords.length > 1 ? keywords.join(" / ") : (keywords[0] || base.collection?.keyword || ""),
      keywords,
      groups: keywordGroups,
    };
    base.valueScore = Math.min(100, Math.max(...group.map((item) => item.valueScore || 0)) + Math.min(10, Math.max(0, keywords.length - 1) * 2));
    return base;
  });
}

function summarize(text = "") {
  const body = clean(text);
  const firstSentence = body.split(/[。！？!?]/).map((part) => part.trim()).find((part) => part.length > 18);
  return compact(firstSentence || body, 180);
}

async function scrollFeed(page) {
  await page.bringToFront().catch(() => {});
  await page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => {});
  await page.waitForSelector(".compact-card, .article-item", { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(500);
  for (let index = 0; index < scrolls; index += 1) {
    await page.evaluate(() => window.scrollBy(0, Math.floor(window.innerHeight * 0.85))).catch(() => {});
    await page.waitForTimeout(700);
  }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  await page.waitForTimeout(300);
}

async function openSearchPage(context, sourceKey, keyword) {
  const page = await context.newPage();
  if (sourceKey === "aipoju") {
    await page.goto(sources.aipoju.searchUrl(keyword), { waitUntil: "domcontentloaded", timeout: 20000 });
    await page.waitForSelector(".article-item", { timeout: 15000 }).catch(() => {});
    return page;
  }
  await page.goto(sources.scys.url, { waitUntil: "domcontentloaded", timeout: 20000 });
  await page.waitForSelector(sources.scys.searchInput, { timeout: 15000 });
  await page.locator(sources.scys.searchInput).first().fill(keyword);
  await page.locator(".search svg").first().click({ timeout: 4000 }).catch(async () => {
    await page.locator(sources.scys.searchInput).first().press("Enter").catch(() => {});
  });
  await page.waitForSelector(".compact-card", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(1200);
  return page;
}

async function collectCards(page, sourceKey) {
  if (sourceKey === "scys") {
    return page.$$eval(sources.scys.cardSelector, (cards) => cards.map((card, index) => {
      const text = (selector) => card.querySelector(selector)?.innerText?.trim() || "";
      const excerpt = text(".content-preview");
      const title = text(".title-text") || (card.innerText || "").split("\n").find((line) => line.length > 8) || "";
      return {
        index,
        author: text(".user-name"),
        role: text(".vc-identity-badge"),
        relativeTime: text(".time-text").replace(/^·\s*/, ""),
        title,
        excerpt,
        rawText: card.innerText || "",
        metrics: text(".compact-interactions"),
        links: [...card.querySelectorAll("a[href]")].map((a) => ({ href: a.href, text: a.innerText || a.textContent || "" })),
      };
    }));
  }
  return page.$$eval(sources.aipoju.cardSelector, (cards) => cards.map((card, index) => {
    const text = (selector) => card.querySelector(selector)?.innerText?.trim() || "";
    const content = text("div[class*='line-clamp']")
      || text(".mt-0\\.8")
      || card.innerText
      || "";
    const compacted = String(content).replace(/\s+/g, " ").trim();
    const markers = [" 大家好", " 各位", " 今天", " 先", " 随着", " 这次", " 2026年", " 2025年", " 这边"];
    const cuts = markers.map((marker) => compacted.indexOf(marker)).filter((pos) => pos > 12 && pos < 180);
    const punctuation = compacted.search(/[。！？!?]/);
    if (punctuation > 18 && punctuation < 120) cuts.push(punctuation + 1);
    const cut = cuts.length ? Math.min(...cuts) : Math.min(compacted.length, 96);
    const dateMatch = (card.innerText || "").match(/\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/);
    return {
      index,
      author: text("span[class*='fw-600']") || (card.innerText || "").split("\n")[0] || "",
      role: text(".identity-badges-container"),
      publishedAt: dateMatch?.[0] || "",
      title: compacted.slice(0, cut).trim(),
      excerpt: compacted.slice(cut).trim() || compacted,
      rawText: card.innerText || "",
      metrics: text(".like-count"),
      links: [...card.querySelectorAll("a[href]")].map((a) => ({ href: a.href, text: a.innerText || a.textContent || "" })),
    };
  }));
}

async function readDetailFromPage(page, sourceKey) {
  await page.waitForLoadState("domcontentloaded", { timeout: 10000 }).catch(() => {});
  const detailSelector = sourceKey === "scys"
    ? ".post-content, .content-container"
    : ".content-wrapper, .pc-card";
  await page.waitForSelector(detailSelector, { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(500);
  return page.evaluate((key) => {
    const get = (selector) => document.querySelector(selector)?.innerText?.trim() || "";
    const content = key === "scys"
      ? get(".post-content") || get(".content-container")
      : get(".content-wrapper") || get(".pc-card") || get("#app");
    const anchors = [...document.querySelectorAll("a[href]")].map((a) => ({
      href: a.href,
      text: a.innerText || a.textContent || "",
    }));
    return {
      title: document.title || "",
      url: location.href,
      text: content || document.body.innerText || "",
      anchors,
    };
  }, sourceKey);
}

async function enrichWithDetails(page, sourceKey, cards, limit) {
  const context = page.context();
  const selector = sources[sourceKey].cardSelector;
  const enriched = [];
  const count = Math.min(cards.length, Math.max(0, limit));
  for (let index = 0; index < cards.length; index += 1) {
    const card = { ...cards[index] };
    if (index < count) {
      const beforeUrl = page.url();
      const popupPromise = context.waitForEvent("page", { timeout: 2000 }).catch(() => null);
      try {
        await page.locator(selector).nth(card.index).click({ position: { x: 36, y: 86 }, timeout: 5000 });
        const popup = await popupPromise;
        const detailPage = popup || page;
        if (!popup) await page.waitForTimeout(800);
        if (detailPage.url() !== beforeUrl || popup) {
          const detail = await readDetailFromPage(detailPage, sourceKey);
          card.url = detail.url;
          card.detailTitle = detail.title;
          card.detailText = detail.text;
          card.detailLinks = detail.anchors;
        }
        if (popup) {
          await popup.close().catch(() => {});
        } else if (page.url() !== beforeUrl) {
          await page.goBack({ waitUntil: "domcontentloaded", timeout: 10000 }).catch(() => {});
          await page.waitForTimeout(400);
        }
      } catch (error) {
        card.detailError = error.message;
      }
    }
    enriched.push(card);
  }
  return enriched;
}

function normalizeCard(sourceKey, card, job) {
  const fullText = clean([card.title, card.excerpt, card.rawText, card.detailText].filter(Boolean).join(" "));
  const links = extractLinks(fullText, [...(card.links || []), ...(card.detailLinks || [])]);
  const title = compact(clean(card.title || card.detailTitle || "未命名案例"), 96);
  const tools = inferTools(fullText);
  const detailText = clean(card.detailText);
  const excerptText = clean(card.excerpt || card.rawText);
  const evidenceText = detailText.length > 120 && !detailText.startsWith("首页 ") ? detailText : excerptText;
  const type = inferInsightType(fullText, links);
  const painPoints = inferPainPoints(fullText);
  const reusableMethod = inferReusableMethod(fullText);
  const resultSignal = inferResultSignal(fullText);
  const score = opportunityScore(fullText, links, tools);
  return {
    id: idFor([sourceKey, card.url, title, card.author, job.keyword]),
    source: sourceKey,
    sourceName: sources[sourceKey].name,
    collection: job,
    insightType: type,
    author: clean(card.author),
    role: clean(card.role),
    relativeTime: clean(card.relativeTime),
    publishedAt: clean(card.publishedAt),
    title,
    url: card.url || pageFallbackUrl(sourceKey, job),
    scene: inferScene(fullText),
    industry: inferIndustry(fullText),
    tools,
    monetization: inferMonetization(fullText),
    painPoints,
    resultSignal,
    reusableMethod,
    opportunityScore: score,
    valueScore: valueScore({
      text: fullText,
      links,
      tools,
      painPoints,
      reusableMethod,
      resultSignal,
      insightType: type,
    }),
    summary: summarize([card.title, card.excerpt || card.detailText].join(" ")),
    evidence: compact(evidenceText, 360),
    excerpt: compact(excerptText, 260),
    links,
    metrics: clean(card.metrics),
  };
}

function pageFallbackUrl(sourceKey, job) {
  if (job.mode === "search" && sourceKey === "aipoju") return sources.aipoju.searchUrl(job.keyword);
  return sources[sourceKey].url;
}

async function collectJob(context, sourceKey, job) {
  const page = job.mode === "search"
    ? await openSearchPage(context, sourceKey, job.keyword)
    : await context.newPage();
  try {
    if (job.mode === "home") {
      await page.goto(sources[sourceKey].url, { waitUntil: "domcontentloaded", timeout: 20000 });
    }
    await scrollFeed(page);
    const cards = await collectCards(page, sourceKey);
    const detailLimit = job.mode === "home" ? homeDetailLimit : searchDetailLimit;
    const enriched = await enrichWithDetails(page, sourceKey, cards, detailLimit);
    return enriched.map((card) => normalizeCard(sourceKey, card, job));
  } finally {
    await page.close().catch(() => {});
  }
}

async function main() {
  const browser = await chromium.connectOverCDP(cdpUrl);
  const context = browser.contexts()[0] || await browser.newContext();
  const selectedKeywords = selectSearchKeywords();
  const jobs = [
    { mode: "home", keyword: "", group: "daily-feed" },
    ...selectedKeywords.map((item) => ({ mode: "search", ...item })),
  ];
  const collected = [];
  const errors = [];

  for (const sourceKey of Object.keys(sources)) {
    for (const job of jobs) {
      try {
        const items = await collectJob(context, sourceKey, job);
        collected.push(...items);
      } catch (error) {
        errors.push({ source: sourceKey, mode: job.mode, keyword: job.keyword, message: error.message });
      }
    }
  }

  const unique = mergeItems(collected)
    .sort((a, b) => (b.valueScore || 0) - (a.valueScore || 0) || (b.opportunityScore || 0) - (a.opportunityScore || 0));
  const linkMap = new Map();
  for (const item of unique) {
    for (const link of item.links || []) {
      if (!link?.href || linkMap.has(link.href)) continue;
      linkMap.set(link.href, {
        href: link.href,
        text: clean(link.text || link.href),
        itemId: item.id,
        itemTitle: item.title,
        source: item.source,
        sourceName: item.sourceName,
      });
    }
  }
  const links = [...linkMap.values()];
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      cdpUrl,
      scrolls,
      homeDetailLimit,
      searchDetailLimit,
      searchLimit,
      selectedKeywords,
      updateMechanism: {
        dailyFeed: "每次运行先抓两个社群首页信息流，捕捉当天高频讨论。",
        targetedSearch: "再按关键词池轮询搜索行业、场景、工具、机会词，补充垂直案例和历史高价值内容。",
        dedupe: "按原帖 URL 优先去重；没有详情 URL 时按来源 + 规范化标题/正文指纹去重，并合并多个命中关键词。",
        valueScoring: "按资料链接、结果信号、可复用方法、工具/流程密度、痛点/需求信号、商业结果等计算价值分，高价值内容靠前。",
        login: "复用专用浏览器登录态；登录失效时脚本记录错误，需要重新扫码。",
      },
      errors,
      note: "Read-only collection from logged-in community pages. Private document contents are not bypassed.",
    },
    sources: Object.fromEntries(Object.entries(sources).map(([key, source]) => [key, {
      name: source.name,
      url: source.url,
    }])),
    keywordGroups,
    links,
    items: unique,
  };

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await browser.close();
  console.log(JSON.stringify({
    ok: true,
    outputPath,
    collected: collected.length,
    items: unique.length,
    deduped: collected.length - unique.length,
    links: links.length,
    keywords: selectedKeywords.map((item) => item.keyword),
    errors,
  }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
