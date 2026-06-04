#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const outputFile = path.join(siteDataDir, "v3-data-observation-desk.json");

const signalRoots = [
  { category: "case", label: "案例", dir: path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "case") },
  { category: "funding", label: "融资", dir: path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "funding") },
  { category: "product-service", label: "产品", dir: path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "product-service") },
];

const opinionRoot = {
  category: "opinion",
  label: "观点",
  dir: path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Cards"),
};

const trendAssetRoots = [
  path.join(root, "01-SiteV2", "content", "06-asset-candidates", "trend"),
  path.join(root, "01-SiteV2", "knowledge", "03-Asset-Candidates", "trend"),
];

const categoryLabels = {
  case: "案例",
  funding: "融资",
  "product-service": "产品",
  opinion: "观点",
};

const tagGroups = ["track", "function", "scenario", "customer", "evidence", "stage", "region", "source", "opinion"];
const taxonomyFile = path.join(root, "agent-workflow", "product", "tag-taxonomy.md");
const tagDictionary = loadTagDictionary();
const allowedTagIds = new Set(tagDictionary.keys());

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function canonicalUrl(url = "") {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("utm_term");
    parsed.searchParams.delete("utm_content");
    return parsed.toString().replace(/\/$/u, "");
  } catch {
    return String(url || "").trim().replace(/\/$/u, "");
  }
}

function normalizedTitle(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim().toLowerCase();
}

function frontstageDedupeKey(card) {
  const url = canonicalUrl(card.sourceUrl);
  if (card.type === "signal_card" && url) return `${card.date}|signal|url|${url}`;
  if (card.type === "opinion_card" && card.id) return `${card.date}|opinion|id|${card.id}`;
  if (url) return `${card.date}|${card.type}|url|${url}`;
  return `${card.date}|${card.type}|title|${normalizedTitle(card.title)}`;
}

function cardQuality(card) {
  const title = String(card.title || "");
  const sourceUrl = String(card.sourceUrl || "");
  let score = 0;
  if (sourceUrl) score += 8;
  if (card.rawArchive || card.rawJson) score += 4;
  if (card.summary) score += 2;
  if (!/发布 AI 能力|把 AI 用进|Googlecloudpresscorner|^2025\b/u.test(title)) score += 12;
  if (/[A-Za-z]/u.test(title)) score += 2;
  return score;
}

function dedupeFrontstageCards(items) {
  const byKey = new Map();
  for (const item of items) {
    const key = frontstageDedupeKey(item);
    const current = byKey.get(key);
    if (!current || cardQuality(item) > cardQuality(current)) byKey.set(key, item);
  }
  return [...byKey.values()];
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function loadTagDictionary() {
  const text = read(taxonomyFile);
  const tags = new Map();
  const tagPattern = /`((?:track|function|scenario|customer|evidence|stage|region|source|opinion)-[a-z0-9-]+)`\s*\|\s*([^|`\r\n]+?)\s*\|/gu;
  for (const match of text.matchAll(tagPattern)) {
    tags.set(match[1], match[2].trim());
  }
  return tags;
}

function walkMarkdown(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(full));
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") files.push(full);
  }
  return files;
}

function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  return match ? match[1] : "";
}

function unquote(value = "") {
  let next = String(value).trim();
  if ((next.startsWith('"') && next.endsWith('"')) || (next.startsWith("'") && next.endsWith("'"))) {
    next = next.slice(1, -1);
  }
  return next.replace(/\\"/gu, '"').trim();
}

function scalar(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "mu"));
  if (!match) return "";
  const value = match[1].trim();
  if (!value || value === "[]" || value === "{}") return "";
  return unquote(value);
}

function block(fm, key) {
  const lines = fm.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) return "";
  const collected = [];
  for (const line of lines.slice(start + 1)) {
    if (line && !/^\s/u.test(line)) break;
    collected.push(line);
  }
  return collected.join("\n");
}

function nestedScalar(fm, section, key) {
  const text = block(fm, section);
  const match = text.match(new RegExp(`^\\s{2}${key}:\\s*(.*)$`, "mu"));
  if (!match) return "";
  const value = match[1].trim();
  if (!value || value === "[]" || value === "{}") return "";
  return unquote(value);
}

function parseArrayText(value = "") {
  const text = value.trim();
  if (!text.startsWith("[") || !text.endsWith("]")) return [];
  return text
    .slice(1, -1)
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/u)
    .map(unquote)
    .map((item) => item.trim())
    .filter(Boolean);
}

function arrayValue(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*(\\[[^\\n]*\\])`, "mu"));
  return match ? parseArrayText(match[1]) : [];
}

function nestedList(fm, section, key) {
  const text = block(fm, section);
  const inline = text.match(new RegExp(`^\\s{2}${key}:\\s*(\\[[^\\n]*\\])`, "mu"));
  if (inline) return parseArrayText(inline[1]);
  const lines = text.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) return [];
  const collected = [];
  for (const line of lines.slice(start + 1)) {
    if (/^\s{2}\S/u.test(line)) break;
    collected.push(line);
  }
  return collected
    .map((line) => line.match(/^\s*-\s*(.*)$/u)?.[1])
    .filter(Boolean)
    .map(unquote);
}

function formalTags(fm) {
  const result = {};
  for (const group of tagGroups) {
    result[group] = nestedList(fm, "formal_tags", group).filter((tag) => allowedTagIds.has(tag));
  }
  return result;
}

function allTags(tags) {
  return tagGroups.flatMap((group) => tags[group] || []);
}

function displayTags(tags) {
  return allTags(tags).map((id) => ({
    id,
    label: tagDictionary.get(id) || id,
  }));
}

function short(text = "", length = 180) {
  const clean = String(text).replace(/\s+/gu, " ").trim();
  return clean.length > length ? `${clean.slice(0, length - 1)}...` : clean;
}

function domain(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

function headingSection(markdown, heading) {
  const lines = markdown.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start < 0) return "";
  const collected = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    collected.push(line);
  }
  return collected.join("\n").trim();
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function rawCandidateTitle(rawArchiveRel, rawRef) {
  if (!rawArchiveRel || !rawRef) return "";
  const rawArchive = path.join(root, rawArchiveRel);
  if (!fs.existsSync(rawArchive)) return "";
  const heading = read(rawArchive)
    .split(/\r?\n/u)
    .find((line) => line.startsWith(`## ${rawRef}`));
  if (!heading) return "";
  return heading
    .replace(new RegExp(`^##\\s*${escapeRegExp(rawRef)}\\s*[｜|:-]?\\s*`, "u"), "")
    .trim();
}

function isDiscoveryLabel(value = "") {
  return /\b(anysearch|unknown builder|hn builder query|builder query|tavily|exa|gdelt|duckduckgo|bing|keyword search|cloud fallback|follow-builders)\b/iu.test(String(value));
}

function subjectFromUrl(url = "") {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./u, "").toLowerCase();
    const pathname = parsed.pathname.toLowerCase();
    if (host === "openai.com") return "OpenAI";
    if (host.endsWith("bcg.com")) return "BCG";
    if (host === "ai-sdk.dev") return "Vercel AI SDK";
    if (host === "aiseedfund.com") return "AI Seed";
    if (host === "firecrawl.dev") return "Firecrawl";
    if (host === "northflank.com") return "Northflank";
    if (host === "adya.ai") return "Adya";
    if (host === "wireflow.ai") return "Wireflow";
    if (host === "codesignal.com") return "CodeSignal";
    if (host === "menlovc.com") return "Menlo Ventures";
    if (host === "friendli.ai") return "FriendliAI";
    if (host === "googlecloudpresscorner.com") return "The Home Depot";
    if (host === "e2b.dev") return "E2B";
    if (host === "a16z.com") return "Andreessen Horowitz";
    if (host === "bvp.com") return "Bessemer Venture Partners";
    if (host === "techcrunch.com" && pathname.includes("alphabets-record")) return "Alphabet / Google";
    if (host === "stripe.com" && pathname.includes("cognition")) return "Cognition";
    if (host === "ycombinator.com" && pathname.includes("confident-ai")) return "Confident AI";
    if (host === "en.wikipedia.org" && pathname.includes("sam_altman")) return "Sam Altman";
  } catch {
    // Fall through to title-based detection.
  }
  return "";
}

function cleanSubject(value = "") {
  return String(value)
    .replace(/\s+/gu, " ")
    .replace(/^(Anysearch|Unknown Builder|HN Builder Query|DuckDuckGo)\s*[:：|｜-]\s*/iu, "")
    .replace(/\s*\|\s+(Wikipedia|YouTube|LinkedIn|Reddit|Podcast|Podscan\.fm|Blog)$/iu, "")
    .replace(/\s+-\s+(Wikipedia|YouTube|LinkedIn|Reddit|Podcast|Podscan\.fm)$/iu, "")
    .trim();
}

function subjectFromTitle(title = "") {
  const clean = cleanSubject(title);
  if (!clean) return "";
  const ceoMatch = clean.match(/^([A-Z][A-Za-z0-9 .&-]{1,36})\s+CEO\b/u);
  if (ceoMatch) return cleanSubject(ceoMatch[1]);
  const colonMatch = clean.match(/^([^:：]{2,36})[:：]/u);
  if (colonMatch) return cleanSubject(colonMatch[1]);
  const pipeParts = clean.split(/\s+\|\s+/u).map((part) => part.trim()).filter(Boolean);
  if (pipeParts.length > 1) {
    const last = cleanSubject(pipeParts.at(-1));
    const first = cleanSubject(pipeParts[0]);
    if (last && !/^(Blog|Wikipedia|YouTube|LinkedIn|Reddit|Podcast|Podscan\.fm)$/iu.test(last) && last.length <= 40) return last;
    if (first && first.length <= 40) return first;
  }
  const dashParts = clean.split(/\s+-\s+/u).map((part) => part.trim()).filter(Boolean);
  if (dashParts.length > 1) {
    const first = cleanSubject(dashParts[0]);
    if (first && first.length <= 40) return first;
  }
  return clean.length <= 40 ? clean : "";
}

function normalizeSubject(value = "") {
  const clean = cleanSubject(value);
  if (/^bcg$/iu.test(clean)) return "BCG";
  if (/^googlecloudpresscorner$/iu.test(clean)) return "";
  return clean;
}

function isWeakSubject(value = "") {
  const clean = normalizeSubject(value);
  if (!clean || isDiscoveryLabel(clean)) return true;
  if (/^\d{4}$/u.test(clean)) return true;
  if (/^CEO\s+/iu.test(clean)) return true;
  if (/把 AI 用进/u.test(clean)) return true;
  return false;
}

function frontstageTitle(frontTitle = "", rawTitle = "") {
  if (rawTitle && isDiscoveryLabel(frontTitle)) return rawTitle;
  return frontTitle || rawTitle;
}

function frontstageChineseTitle(title = "", sourceUrl = "") {
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const rules = [
    [/bcg\.com.*200-billion-dollar-ai-opportunity/u, "BCG：科技服务业存在 2000 亿美元 AI 机会"],
    [/research\.ibm\.com.*agentic-scaling-laws/u, "IBM：企业 AI 采用需要可扩展的 Agent 逻辑"],
    [/huggingface\.co\/blog\/ibm-research\/agent-logic/u, "IBM：企业 AI 采用需要可扩展的 Agent 逻辑"],
    [/googlecloudpresscorner.*home-depot.*gemini-enterprise/u, "家得宝用 Google Cloud Gemini 企业版把客服响应提速四倍"],
    [/techcrunch\.com.*49-us-ai-startups.*raised-100m/u, "美国已有 49 家 AI 初创公司融资超过 1 亿美元"],
    [/friendli\.ai.*series-a-funding/u, "FriendliAI 融资 2000 万美元，押注 AI 推理基础设施"],
    [/friendli\.ai.*raises-20m/u, "FriendliAI 融资 2000 万美元，押注 AI 推理基础设施"],
    [/linkedin\.com.*ai-adoption-numbers/u, "企业 AI 采用数字：哪些场景真正落地"],
    [/firecrawl\.dev.*ai-agent-sandbox/u, "AI Agent 沙盒：如何安全运行自主智能体"],
    [/ai-sdk\.dev/u, "Vercel AI SDK：面向应用与 Agent 的 TypeScript 工具包"],
    [/adya\.ai.*pricing/u, "Adya AI 企业定价：AI 采用回到预算与用量治理"],
    [/youtube\.com.*tecd/u, "AI 编程智能体将如何改变开发者工作"],
    [/northflank\.com.*sandbox-ai-agents/u, "2026 年 AI Agent 沙盒：MicroVM、gVisor 与隔离边界"],
    [/youtube\.com.*71qv/u, "不理解 AI 评测，就不要急着构建 AI"],
    [/menlovc\.com.*state-of-generative-ai-in-the-enterprise/u, "Menlo Ventures：2025 企业生成式 AI 状态报告"],
    [/itnegotiationservices.*genai-contract-negotiation/u, "AI 与 GenAI 合同谈判顾问：企业采购进入 AI 议价流程"],
    [/itnegotiationservices\.com\/services\/genai/u, "AI 与 GenAI 合同谈判顾问：企业采购进入 AI 议价流程"],
    [/atonementlicensing.*ai-procurement-guide/u, "2026 企业 AI 采购指南：合同、定价与采购边界"],
    [/github\.com.*anthropics.*claude-code.*v2\.1\.162/u, "Claude Code v2.1.162 发布"],
    [/research\.google.*flood-resilience/u, "Google 开源水文建模框架，推进洪水韧性建设"],
    [/holo31/u, "本地计算机使用 Agent Holo3.1 发布"],
    [/anthropic\.com.*claude-opus-4-8/u, "Anthropic 发布 Claude Opus 4.8"],
    [/linkedin\.com.*genai-aieconomics/u, "Menlo Ventures 报告：AI 战略与运营的三个要点"],
    [/linkedin\.com.*menlo.*key-takeaways/u, "Menlo Ventures 报告：AI 战略与运营的三个要点"],
    [/siliconangle.*vapi/u, "Vapi 融资 5000 万美元，推动语音 AI 更接近真人交互"],
    [/ft\.com.*vonage/u, "Vonage 推出面向医疗行业的专用 AI Agent"],
  ];
  const match = rules.find(([pattern]) => pattern.test(normalized));
  if (match) return match[1];
  if (/^the \$200 billion ai opportunity/iu.test(title)) return "BCG：科技服务业存在 2000 亿美元 AI 机会";
  if (/^ai workflow builder/iu.test(title)) return "AI 工作流构建工具 Wireflow";
  if (/^enterprise pricing/iu.test(title)) return "Adya AI 企业定价：AI 采用回到预算与用量治理";
  if (/^introducing claude opus/iu.test(title)) return "Anthropic 发布 Claude Opus 4.8";
  if (/^beyond llms/iu.test(title)) return "IBM：企业 AI 采用需要可扩展的 Agent 逻辑";
  if (/^menlo ventures report/iu.test(title)) return "Menlo Ventures 报告：AI 战略与运营的三个要点";
  if (/^vonage launches/iu.test(title)) return "Vonage 推出面向医疗行业的专用 AI Agent";
  if (/^how /iu.test(title)) return title.replace(/^How /iu, "如何");
  return title;
}

function frontstageSubjectOverride(sourceUrl = "", title = "") {
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const rules = [
    [/huggingface\.co\/blog\/ibm-research\/agent-logic/u, "IBM Research"],
    [/techcrunch\.com.*49-us-ai-startups.*raised-100m/u, "美国 AI 初创公司"],
    [/github\.com.*anthropics.*claude-code/u, "Claude Code"],
    [/research\.google.*flood-resilience/u, "Google Research"],
    [/anthropic\.com.*claude-opus-4-8/u, "Anthropic / Claude"],
    [/theverge\.com.*as-ai-gets-better/u, "Google Gemini Spark"],
    [/siliconangle.*vapi/u, "Vapi"],
    [/youtube\.com.*tecd/u, "AI Coding Agents"],
    [/youtube\.com.*71qv/u, "AI Evals"],
  ];
  const match = rules.find(([pattern]) => pattern.test(normalized));
  if (match) return match[1];
  if (/^Vapi 融资/u.test(title)) return "Vapi";
  if (/^Google 开源水文/u.test(title)) return "Google Research";
  if (/^Anthropic 发布 Claude/u.test(title)) return "Anthropic / Claude";
  if (/^不理解 AI 评测/u.test(title)) return "AI Evals";
  return "";
}

function frontstageSubject(fm, sourceUrl, sourceName, rawTitle, title) {
  const explicit = [
    scalar(fm, "signal_owner"),
    scalar(fm, "company_name"),
    scalar(fm, "person_name"),
    scalar(fm, "organization"),
  ].map(normalizeSubject).find((item) => !isWeakSubject(item));
  const override = frontstageSubjectOverride(sourceUrl, title || rawTitle);
  if (override) return override;
  const urlSubject = normalizeSubject(subjectFromUrl(sourceUrl));
  const titleSubject = normalizeSubject(subjectFromTitle(rawTitle) || subjectFromTitle(title));
  const derived = urlSubject || titleSubject;
  if (urlSubject) return urlSubject;
  if (isDiscoveryLabel(sourceName) && derived) return derived;
  return explicit
    || derived
    || (!isWeakSubject(sourceName) ? normalizeSubject(sourceName) : "")
    || "未标注主体";
}

function readRawEvidence(rawJsonRel, rawArchiveRel) {
  const rawJson = rawJsonRel ? path.join(root, rawJsonRel) : "";
  const rawArchive = rawArchiveRel ? path.join(root, rawArchiveRel) : "";
  let sourceName = "";
  let sourceUrl = "";
  let publishedAt = "";
  let rawTitle = "";
  let keyExcerpts = [];
  let visibleFragment = "";

  if (rawJson && fs.existsSync(rawJson)) {
    try {
      const json = JSON.parse(read(rawJson));
      sourceName = json.source_name || "";
      rawTitle = json.title || "";
      sourceUrl = json.original_url || json.canonical_url || "";
      publishedAt = json.published_at || "";
      keyExcerpts = Array.isArray(json.key_excerpts)
        ? json.key_excerpts.map((item) => short(item?.text || "", 220)).filter(Boolean).slice(0, 4)
        : [];
      visibleFragment = short(json.full_text || json.clean_text || "", 360);
    } catch {
      // Keep the card usable even if a raw snapshot is malformed.
    }
  }

  if (!visibleFragment && rawArchive && fs.existsSync(rawArchive)) {
    const snapshot = read(rawArchive);
    visibleFragment = short(snapshot.replace(/^---[\s\S]*?---/u, ""), 360);
    const excerptMatch = snapshot.match(/key_excerpts:\s*(\[.*\])/u);
    if (!keyExcerpts.length && excerptMatch) keyExcerpts = [short(excerptMatch[1], 220)];
  }

  return { sourceName, sourceUrl, publishedAt, rawTitle, keyExcerpts, visibleFragment };
}

function publicVisibleFragment(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/Builders Viewpoints|今日观察中的|Raw\s*\/\s*Pool|候选、人物时间线/u.test(text)) return "";
  return text;
}

function cardFromFile(file, category) {
  const text = read(file);
  const fm = frontmatter(text);
  if (!fm) return null;

  const type = scalar(fm, "type");
  if (category === "opinion" && type !== "opinion_card") return null;
  if (category !== "opinion" && type !== "signal_card") return null;

  const tags = formalTags(fm);
  const rawArchive = nestedScalar(fm, "primary_raw", "raw_archive") || nestedScalar(fm, "opinion_capture", "raw_archive");
  const rawJson = nestedScalar(fm, "primary_raw", "raw_json");
  const rawRef = nestedScalar(fm, "primary_raw", "raw_ref") || nestedScalar(fm, "opinion_capture", "raw_ref") || arrayValue(fm, "raw_refs")[0] || "";
  const rawTitleFromArchive = rawCandidateTitle(rawArchive, rawRef);
  const primarySourceUrl = nestedScalar(fm, "primary_raw", "source_url")
    || nestedScalar(fm, "opinion_capture", "source_url")
    || scalar(fm, "source_url")
    || nestedList(fm, "frontend", "sourceLinks")[0]
    || "";
  const raw = readRawEvidence(rawJson, rawArchive);
  const rawTitle = rawTitleFromArchive || raw.rawTitle || "";
  const sourceUrl = primarySourceUrl || raw.sourceUrl;
  const sourceName = scalar(fm, "source_name") || raw.sourceName || domain(sourceUrl) || "未标注来源";

  const rawDisplayTitle = frontstageTitle(nestedScalar(fm, "frontend", "displayTitle") || scalar(fm, "title") || path.basename(file, ".md"), rawTitle);
  const title = frontstageChineseTitle(rawDisplayTitle, sourceUrl);
  const eventLine = nestedScalar(fm, "frontend", "eventLine") || scalar(fm, "event") || "";
  const summary = nestedScalar(fm, "frontend", "whyWatch")
    || nestedScalar(fm, "frontend", "interpretation")
    || scalar(fm, "why_selected")
    || headingSection(text, "为什么值得看")
    || headingSection(text, "观澜解读")
    || eventLine;

  const sourceLinks = [
    ...nestedList(fm, "frontend", "sourceLinks"),
    sourceUrl,
  ].filter(Boolean);

  return {
    id: scalar(fm, "id") || path.basename(file, ".md"),
    type,
    category,
    categoryLabel: categoryLabels[category] || category,
    title,
    originalTitle: rawDisplayTitle === title ? "" : rawDisplayTitle,
    date: scalar(fm, "date"),
    subject: frontstageSubject(fm, sourceUrl, sourceName, rawTitle, title),
    source: sourceName,
    sourceName,
    sourceUrl,
    publishedAt: raw.publishedAt || scalar(fm, "published_at") || scalar(fm, "original_date") || "",
    tags,
    flatTags: allTags(tags),
    displayTags: displayTags(tags),
    summary: short(summary, 260),
    eventLine: short(eventLine || summary, 220),
    originalHighlights: [
      nestedScalar(fm, "frontend", "originalQuote"),
      eventLine,
      headingSection(text, "发生了什么"),
    ].filter(Boolean).map((item) => short(item, 260)).slice(0, 3),
    visibleFragment: publicVisibleFragment(raw.visibleFragment),
    keyExcerpts: raw.keyExcerpts,
    rawRefs: arrayValue(fm, "raw_refs"),
    poolRefs: arrayValue(fm, "pool_refs"),
    cardPath: rel(file),
    rawRef,
    rawTitle,
    rawArchive,
    rawJson,
    sourceLinks: [...new Set(sourceLinks)],
    status: scalar(fm, "status"),
    assetLevel: scalar(fm, "asset_level"),
    stage: tags.stage?.[0] || "",
    evidence: tags.evidence?.[0] || "",
    track: tags.track?.[0] || "",
  };
}

function uniqueById(items) {
  const byId = new Map();
  for (const item of items) {
    if (!item?.id) continue;
    const current = byId.get(item.id);
    if (!current || dateValue(item.date) >= dateValue(current.date)) byId.set(item.id, item);
  }
  return [...byId.values()];
}

function trendAssetFromFile(file) {
  const text = read(file);
  const fm = frontmatter(text);
  if (!fm) return null;

  const type = scalar(fm, "type");
  if (type !== "trend_candidate" && type !== "trend_card") return null;

  const rawTitle = scalar(fm, "title") || path.basename(file, ".md");
  const frontendWhy = nestedScalar(fm, "frontend", "whyForming");
  const relationSummary = nestedScalar(fm, "frontend", "relationSummary");
  const publicBoundary = nestedScalar(fm, "frontend", "publicBoundary");
  const hypothesis = scalar(fm, "trend_hypothesis")
    || headingSection(text, "趋势候选")
    || headingSection(text, "趋势判断");
  const methodChange = headingSection(text, "技术路线 / 方法变化");
  const boundary = scalar(fm, "boundary_notes")
    || publicBoundary
    || headingSection(text, "风险边界与证据缺口");
  const nextObservation = scalar(fm, "next_observation")
    || headingSection(text, "下一步观察");
  const sourceTypes = arrayValue(fm, "source_types");
  const relatedSignals = arrayValue(fm, "related_signal_cards")
    .concat(arrayValue(fm, "related_change_cards"))
    .concat(arrayValue(fm, "related_case_cards"));
  const relatedOpinions = arrayValue(fm, "related_opinion_cards");
  const tags = formalTags(fm);
  const gate = scalar(fm, "trend_evidence_gate");
  const relatedChangeCount = relatedSignals.length;
  const sourceTypeCount = sourceTypes.length;
  const frontTitle = trendFrontstageTitle(rawTitle, tags);
  const frontDescription = trendFrontstageDescription({
    title: frontTitle,
    rawTitle,
    type,
    hypothesis,
    relationSummary,
    frontendWhy,
    methodChange,
    relatedChangeCount,
    sourceTypeCount,
  });

  return {
    id: scalar(fm, "id") || path.basename(file, ".md"),
    type,
    title: frontTitle,
    rawTitle,
    date: scalar(fm, "date"),
    status: scalar(fm, "status"),
    assetLevel: scalar(fm, "asset_level"),
    trendStatus: scalar(fm, "trend_status"),
    stageLabel: type === "trend_candidate" ? "正在形成" : gate === "threshold_passed" ? "证据较强" : "继续观察",
    hypothesis: short(frontendWhy || frontDescription || hypothesis, 360),
    relationSummary: short(frontDescription || relationSummary || hypothesis, 300),
    boundary: short(boundary, 280),
    nextObservation: short(nextObservation, 260),
    sourceTypes,
    relatedSignals: [...new Set(relatedSignals)].filter(Boolean),
    relatedOpinions: [...new Set(relatedOpinions)].filter(Boolean),
    tags,
    displayTags: displayTags(tags),
    assetPath: rel(file),
  };
}

function trendFrontstageTitle(title = "", tags = {}) {
  if (title === "track-ai-governance") return "AI 治理开始从原则讨论转向产品和流程约束";
  if (title === "track-ai-coding") return "AI 编程工具开始进入工程团队的预算和治理流程";
  const track = tags.track || [];
  if (/^track-/u.test(title)) {
    if (track.includes("track-ai-governance")) return "AI 治理开始从原则讨论转向产品和流程约束";
    if (track.includes("track-ai-coding")) return "AI 编程工具开始进入工程团队的预算和治理流程";
    return tagDictionary.get(track[0]) || title.replace(/^track-/u, "");
  }
  return title;
}

function trendFrontstageDescription({
  title,
  rawTitle,
  type,
  hypothesis,
  relationSummary,
  frontendWhy,
  methodChange,
  relatedChangeCount,
  sourceTypeCount,
}) {
  if (/AI 编程进入预算和工程治理/u.test(title)) {
    return `这个趋势指向 AI Coding 从个人效率工具进入团队采购、预算和工程治理。具体表现是：同类开发工具、代码助手和工程流程信号反复出现，企业开始关心权限、成本、交付质量和团队协作，而不只是“能不能生成代码”。当前可见 ${relatedChangeCount || 7} 条相关信号，仍需要更多客户采用和付费数据。`;
  }
  if (/AI 治理开始从原则讨论/u.test(title)) {
    return "这个趋势指向 AI 治理从抽象原则进入产品层和流程层。具体表现是：权限、日志、隔离、评测、责任边界开始成为 AI 产品和企业部署材料里的显性问题，而不是只停留在政策口号。当前证据仍少，应作为观察线索而非成熟趋势。";
  }
  if (/专业服务 AI 开始进入交付流程/u.test(title)) {
    return "这个趋势指向专业服务 AI 从内容辅助进入真实交付流程。具体表现是：Agent 的执行范围、网络访问、密钥、日志和停机边界开始被产品化，企业采购时会追问它能做什么、不能做什么、出错后如何停。当前仍需要更多客户案例和付费数据。";
  }
  if (frontendWhy) return frontendWhy;
  if (relationSummary && !/还处在候选阶段|当前材料来自/u.test(relationSummary)) return relationSummary;
  if (methodChange) return methodChange.replace(/\s+/gu, " ").trim();
  if (hypothesis && !/还处在候选阶段|当前材料来自/u.test(hypothesis)) return hypothesis;
  const sourceText = sourceTypeCount ? `${sourceTypeCount} 类来源` : "公开材料";
  return `${title} 是一个仍在观察的趋势方向。具体表现需要看它是否持续出现在客户采用、产品发布、采购预算、交付流程或治理责任中；当前只能按 ${sourceText} 和 ${relatedChangeCount || 0} 条相关信号继续跟踪。`;
}

function buildTrendAssets(activeDate) {
  const assets = uniqueById(
    trendAssetRoots
      .flatMap((dir) => walkMarkdown(dir).map(trendAssetFromFile))
      .filter(Boolean),
  ).sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.title.localeCompare(b.title));

  return {
    todayCandidates: assets.filter((item) => item.type === "trend_candidate" && item.date === activeDate),
    recentCandidates: assets.filter((item) => item.type === "trend_candidate").slice(0, 4),
    historicalTrends: assets.filter((item) => item.type === "trend_card" || item.evidenceGate === "threshold_passed").slice(0, 4),
  };
}

function dateValue(date = "") {
  const value = Date.parse(`${date}T00:00:00Z`);
  return Number.isFinite(value) ? value : 0;
}

function daysBetween(a, b) {
  return Math.round((dateValue(a) - dateValue(b)) / 86400000);
}

function topTags(cards, limit = 4) {
  const counts = new Map();
  for (const card of cards) {
    for (const tag of card.flatTags) counts.set(tag, (counts.get(tag) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([tag, count]) => ({ tag, label: tagDictionary.get(tag) || tag, count }));
}

function buildStats(cards, activeDate) {
  return Object.entries(categoryLabels).map(([category, label]) => {
    const categoryCards = cards.filter((card) => card.category === category);
    const todayCards = categoryCards.filter((card) => card.date === activeDate);
    const last7 = categoryCards.filter((card) => daysBetween(activeDate, card.date) >= 0 && daysBetween(activeDate, card.date) <= 6);
    return {
      category,
      label,
      today: todayCards.length,
      last7: last7.length,
      total: categoryCards.length,
      topTags: topTags(todayCards.length ? todayCards : last7.length ? last7 : categoryCards, 5),
    };
  });
}

function countItems(items, keyFn) {
  const counts = new Map();
  for (const item of items) {
    const key = keyFn(item);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, count]) => ({ label, count }));
}

function windowCards(cards, activeDate, windowDays) {
  return cards.filter((card) => {
    const diff = daysBetween(activeDate, card.date);
    return diff >= 0 && diff < windowDays;
  });
}

function isMeaningfulAssociationTag(tag = "") {
  if (/^(stage|region|source)-/u.test(tag)) return false;
  if (tag === "scenario-frontier-opinion" || tag === "evidence-frontier-opinion") return false;
  return true;
}

function buildTagAssociations(cards, activeDate) {
  const todayCards = cards.filter((card) => card.date === activeDate);
  const last7Cards = windowCards(cards, activeDate, 7);
  const last30Cards = windowCards(cards, activeDate, 30);
  const todayGroups = new Map();
  for (const card of todayCards) {
    for (const tag of card.flatTags.filter(isMeaningfulAssociationTag)) {
      if (!todayGroups.has(tag)) todayGroups.set(tag, []);
      todayGroups.get(tag).push(card);
    }
  }
  const windowCount = (items, tag) => items.filter((card) => card.flatTags.includes(tag)).length;
  return [...todayGroups.entries()]
    .filter(([, items]) => items.length >= 2)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([tag, items]) => {
      const coTags = new Map();
      for (const card of items) {
        for (const otherTag of card.flatTags.filter(isMeaningfulAssociationTag)) {
          if (otherTag === tag) continue;
          coTags.set(otherTag, (coTags.get(otherTag) || 0) + 1);
        }
      }
      return {
        object: tag,
        label: tagDictionary.get(tag) || tag,
        todayCount: items.length,
        last7Count: windowCount(last7Cards, tag),
        last30Count: windowCount(last30Cards, tag),
        subjects: countItems(items, (card) => {
          if (card.subject === "未标注主体" || isWeakSubject(card.subject)) return "";
          return card.subject;
        }).slice(0, 3),
        categories: countItems(items, (card) => card.categoryLabel).slice(0, 3),
        coTags: [...coTags.entries()]
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .slice(0, 4)
          .map(([coTag, count]) => ({ tag: coTag, label: tagDictionary.get(coTag) || coTag, count })),
      };
    });
}

const relationshipSpecs = [
  {
    id: "agent-workflow-enterprise",
    title: "Agent 的企业落点正在从聊天入口转向销售、客服和工作流",
    direction: "企业工作流",
    relation: ["AI Agent", "企业工作流", "大中型企业"],
    categories: ["case"],
    all: ["track-enterprise-workflow", "customer-enterprise", "evidence-customer-adoption"],
    summary: "这些企业案例的共性不是发布新模型，而是把 Agent 放进销售、客服和企业工作流这些可交付流程；关系重点从“会不会对话”转向“能不能进入组织流程并产生结果”。",
    detailFocus: "内在关联：这些材料都把 Agent 从“会话能力”推向企业内部的流程节点，关注点转向流程结果、服务效率和客户采用。",
  },
  {
    id: "agent-infra-boundary",
    title: "Agent 要进入真实流程，先要解决推理、隔离和本地运行环境",
    direction: "基础设施",
    relation: ["AI Agent", "AI 基础设施", "安全隔离 / 评测"],
    all: ["track-ai-infra"],
    any: ["track-ai-infra", "function-engineering", "evidence-product-launch"],
    titlePattern: /FriendliAI|沙盒|MicroVM|Vercel AI SDK|Claude Code|Holo|推理基础设施|隔离|评测/u,
    summary: "这些材料共同指向 Agent 落地前的基础设施条件：推理成本、运行隔离、本地执行和工程环境。问题不再是能不能演示，而是能不能被安全、稳定地放进真实流程。",
    detailFocus: "内在关联：推理基础设施、沙盒隔离、Claude Code 和本地 Agent 都指向同一件事：Agent 需要可控、可运行、可集成的基础设施层。",
  },
  {
    id: "sales-procurement-budget",
    title: "AI 商业化正在进入采购、合同和收入流程",
    direction: "采购 / 销售",
    relation: ["企业采购", "销售 / 收入流程", "预算治理"],
    any: ["function-sales", "scenario-sales-briefing", "function-procurement-bidding"],
    titlePattern: /Adya|采购|合同|销售|收入|预算|议价|Vapi/u,
    summary: "这些材料把 AI 从产品试用带进采购、合同、销售和收入流程；共同关系是企业开始用预算、条款和收入责任来约束 AI 的商业化落地。",
    detailFocus: "内在关联：这些材料都指向同一条商业链路，AI 从产品试用进入采购预算、合同条款和收入流程。",
  },
  {
    id: "customer-service-proof",
    title: "客服和语音 Agent 的共性，是先在客户接触点证明效率",
    direction: "客户体验",
    relation: ["客户体验", "行业 Agent", "效率指标"],
    any: ["function-customer-service", "track-ai-customer-service", "evidence-customer-adoption", "evidence-product-launch"],
    titlePattern: /客服|客户体验|家得宝|Vonage|Vapi|BCG/u,
    summary: "客服、语音和行业 Agent 都落在客户接触点；这些场景的共性是更容易用响应速度、处理量和服务体验来证明 AI 是否真正改善业务。",
    detailFocus: "内在关联：客服、语音交互和行业 Agent 都属于客户接触点，企业更容易用响应速度、处理量和服务体验来衡量效果。",
  },
  {
    id: "ai-coding-engineering",
    title: "AI Coding 的竞争点正在转向工程工具链和运行环境",
    direction: "工程流程",
    relation: ["AI Coding", "工程团队", "开发流程"],
    any: ["track-ai-coding", "function-engineering"],
    titlePattern: /编程|Vercel AI SDK|Claude Code|MicroVM|水文/u,
    summary: "AI Coding 的共同关系不只是写代码更快，而是进入 SDK、代码助手、沙盒和工程工具链；竞争点开始从单次生成转向团队开发流程和运行环境。",
    detailFocus: "内在关联：这些材料的共性不是“写代码更快”，而是把 AI Coding 接进 SDK、代码助手、沙盒和工程工具链。",
  },
  {
    id: "product-launch-vs-adoption",
    title: "AI 产品发布的共同指向，是抢占企业采购、工程工具链和行业流程入口",
    direction: "产品发布",
    relation: ["产品发布", "客户采用", "商业验证"],
    categories: ["product-service"],
    any: ["evidence-product-launch"],
    summary: "这些产品材料表面上分散在报告、采购、开发工具和行业 Agent，内在关系是都在争夺企业 AI 落地入口：企业怎么买、团队怎么开发、具体行业流程在哪里使用。",
    detailFocus: "内在关联：这些产品材料表面上分散在报告、采购、开发工具和行业 Agent，实质上都在争夺企业 AI 落地时的入口位置：怎么买、怎么开发、在哪个行业流程里使用。",
  },
];

function cardMatchesSpec(card, spec) {
  const tags = new Set(card.flatTags || []);
  const allMatched = (spec.all || []).every((tag) => tags.has(tag));
  const anyMatched = !(spec.any || []).length || spec.any.some((tag) => tags.has(tag));
  const categoryMatched = !(spec.categories || []).length || spec.categories.includes(card.category);
  const text = [card.title, card.subject].join(" ");
  const titleMatched = !spec.titlePattern || spec.titlePattern.test(text);
  return allMatched && anyMatched && categoryMatched && titleMatched;
}

function buildRelationshipDirections(cards, activeDate) {
  const todayCards = cards.filter((card) => card.date === activeDate);
  const last7Cards = windowCards(cards, activeDate, 7);
  const last30Cards = windowCards(cards, activeDate, 30);
  const displayDate = activeDate.replaceAll("-", ".");

  return relationshipSpecs
    .map((spec) => {
      const todayItems = todayCards.filter((card) => cardMatchesSpec(card, spec));
      if (!todayItems.length) return null;
      const last7Items = last7Cards.filter((card) => cardMatchesSpec(card, spec));
      const last30Items = last30Cards.filter((card) => cardMatchesSpec(card, spec));
      return {
        id: spec.id,
        title: spec.title
          .replaceAll("{date}", displayDate)
          .replaceAll("{count}", String(todayItems.length)),
        direction: spec.direction,
        relation: spec.relation,
        summary: spec.summary
          .replaceAll("{date}", displayDate)
          .replaceAll("{count}", String(todayItems.length)),
        evidenceMeta: `${displayDate} · 当日 ${todayItems.length} 张 · 近 7 天 ${last7Items.length} 张`,
        detailFocus: spec.detailFocus
          .replaceAll("{date}", displayDate)
          .replaceAll("{count}", String(todayItems.length)),
        todayCount: todayItems.length,
        last7Count: last7Items.length,
        last30Count: last30Items.length,
        subjects: countItems(todayItems, (card) => {
          if (card.subject === "未标注主体" || isWeakSubject(card.subject)) return "";
          return card.subject;
        }).slice(0, 4),
        categories: countItems(todayItems, (card) => card.categoryLabel).slice(0, 4),
        supportingCards: todayItems.slice(0, 4).map((card) => ({
          id: card.id,
          title: card.title,
          subject: card.subject,
          categoryLabel: card.categoryLabel,
          sourceName: card.sourceName,
          sourceUrl: card.sourceUrl,
          date: card.date,
        })),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.todayCount - a.todayCount || b.last7Count - a.last7Count || a.title.localeCompare(b.title))
    .slice(0, 6);
}

function buildTrendLinks(cards, activeDate, windowDays) {
  const inWindow = windowCards(cards, activeDate, windowDays);
  const groups = new Map();
  for (const card of inWindow) {
    for (const tag of card.flatTags) {
      if (!groups.has(tag)) groups.set(tag, []);
      groups.get(tag).push(card);
    }
  }
  return [...groups.entries()]
    .filter(([, items]) => items.length >= 2)
    .sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([tag, items]) => ({
      window: `${windowDays} 天`,
      object: tag,
      label: tagDictionary.get(tag) || tag,
      cardCount: items.length,
      lastSeen: items.map((item) => item.date).sort().at(-1),
      filter: tag,
    }));
}

const rawCards = [
  ...signalRoots.flatMap((rootItem) => walkMarkdown(rootItem.dir).map((file) => cardFromFile(file, rootItem.category))),
  ...walkMarkdown(opinionRoot.dir).map((file) => cardFromFile(file, opinionRoot.category)),
].filter(Boolean).sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.category.localeCompare(b.category));
const cards = dedupeFrontstageCards(rawCards)
  .sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.category.localeCompare(b.category));

const activeDate = cards.map((card) => card.date).filter(Boolean).sort().at(-1) || "";
const trendAssets = buildTrendAssets(activeDate);
const payload = {
  meta: {
    version: "V3.0.0-data-observation-desk",
    generatedAt: new Date().toISOString(),
    activeDate,
    source: "Signal Cards + Opinion Cards",
    tagPolicy: "formal_tags filtered by agent-workflow/product/tag-taxonomy.md",
    allowedTagCount: allowedTagIds.size,
  },
  categories: Object.entries(categoryLabels).map(([category, label]) => ({ category, label })),
  stats: buildStats(cards, activeDate),
  cards,
  relationshipDirections: buildRelationshipDirections(cards, activeDate),
  tagAssociations: buildTagAssociations(cards, activeDate),
  trendCandidates: trendAssets.todayCandidates,
  recentTrendCandidates: trendAssets.recentCandidates,
  historicalTrends: trendAssets.historicalTrends,
  trendLinks: [
    ...buildTrendLinks(cards, activeDate, 7),
    ...buildTrendLinks(cards, activeDate, 30),
  ],
};

fs.mkdirSync(siteDataDir, { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(payload, null, 2), "utf8");
console.log(`Wrote ${rel(outputFile)} with ${cards.length} cards.`);
