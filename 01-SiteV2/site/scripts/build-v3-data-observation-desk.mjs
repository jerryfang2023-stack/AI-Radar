#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readTagTaxonomy } from "../../../agent-workflow/tools/tag-taxonomy-utils.mjs";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const outputFile = path.join(siteDataDir, "v3-data-observation-desk.json");
const intelligenceGraphIndexFile = path.join(siteDataDir, "intelligence-graph-index.json");

const signalRoots = [
  { category: "case", label: "案例", dir: path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "case") },
  { category: "funding", label: "融资", dir: path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "funding") },
  { category: "product-service", label: "产品", dir: path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "product-service") },
];

const trendAssetRoots = [
  path.join(root, "01-SiteV2", "content", "06-asset-candidates", "trend"),
  path.join(root, "01-SiteV2", "knowledge", "03-Asset-Candidates", "trend"),
];

const categoryLabels = {
  case: "案例",
  funding: "融资",
  "product-service": "产品",
};

const tagGroups = ["track", "function", "scenario", "customer", "evidence", "stage", "region", "source"];
const tagDictionary = loadTagDictionary();
const allowedTagIds = new Set(tagDictionary.keys());
const internalFrontstageTagIds = new Set(["stage-watch", "core-pool"]);
const internalFrontstageTagLabels = new Set(["core pool"]);

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
  if (url) return `${card.date}|${card.type}|url|${url}`;
  return `${card.date}|${card.type}|title|${normalizedTitle(card.title)}`;
}

function cardQuality(card) {
  const title = String(card.title || "");
  const sourceUrl = String(card.sourceUrl || "");
  let score = 0;
  if (sourceUrl) score += 8;
  if (card.originalHighlights?.length) score += 4;
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

function resolveRawJsonPath(rawJsonRel = "", sourceUrlHint = "") {
  const rawJson = rawJsonRel ? path.join(root, rawJsonRel) : "";
  if (rawJson && fs.existsSync(rawJson)) return rawJson;
  const dir = rawJson ? path.dirname(rawJson) : "";
  if (!dir || !fs.existsSync(dir) || !sourceUrlHint) return "";
  const target = canonicalUrl(sourceUrlHint);
  for (const file of fs.readdirSync(dir).filter((name) => name.endsWith(".json"))) {
    const full = path.join(dir, file);
    try {
      const json = JSON.parse(read(full));
      const candidate = canonicalUrl(json.original_url || json.canonical_url || "");
      if (candidate && candidate === target) return full;
    } catch {
      // Ignore malformed raw snapshots while resolving a fallback path.
    }
  }
  return "";
}

function resolveRawArchivePath(rawArchiveRel = "", rawJsonPath = "") {
  const rawArchive = rawArchiveRel ? path.join(root, rawArchiveRel) : "";
  if (rawArchive && fs.existsSync(rawArchive)) return rawArchive;
  if (!rawJsonPath || !fs.existsSync(rawJsonPath)) return "";
  try {
    const json = JSON.parse(read(rawJsonPath));
    const snapshotPath = json.markdown_snapshot_path ? path.join(root, json.markdown_snapshot_path) : "";
    return snapshotPath && fs.existsSync(snapshotPath) ? snapshotPath : "";
  } catch {
    return "";
  }
}

function loadTagDictionary() {
  const tags = new Map();
  for (const tag of readTagTaxonomy(root).filter((item) => tagGroups.includes(item.group))) {
    tags.set(tag.id, tag.name);
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

function frontstageTags(tags) {
  const result = {};
  for (const group of tagGroups) {
    result[group] = (tags[group] || []).filter((tag) => !internalFrontstageTagIds.has(tag));
  }
  return result;
}

function isFrontstageDisplayTag(tag = "") {
  if (!tag || internalFrontstageTagIds.has(tag)) return false;
  if (/^(source|region)-/u.test(tag)) return false;
  if (isGraphOpinionLikeTag(tag)) return false;
  return true;
}

function displayTags(tags) {
  return sanitizeDisplayTags(allTags(tags)
    .filter(isFrontstageDisplayTag)
    .map((id) => ({
      id,
      label: tagDictionary.get(id) || id,
    })));
}

function sanitizeDisplayTags(tags = []) {
  return tags
    .map((tag) => ({
      id: tag.id || tag,
      label: tag.label || tag.name || tag.id || tag,
    }))
    .filter((tag) => {
      const id = String(tag.id || "").trim();
      const label = String(tag.label || "").trim().toLowerCase();
      return id && !internalFrontstageTagIds.has(id) && !internalFrontstageTagLabels.has(label);
    });
}

function short(text = "", length = 180) {
  const clean = String(text).replace(/\s+/gu, " ").trim();
  return clean.length > length ? `${clean.slice(0, length - 1)}...` : clean;
}

function normalizedComparableText(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/^这条(?:融资|产品)?信号(?:可用于判断|提供了)/u, "")
    .replace(/^(新闻事实|原文要点|价值描述|可见原文片段)[:：]/u, "")
    .replace(/[，。；：、“”‘’（）()《》【】[\]\s,.!?;:'"`$€£|/_-]+/gu, "")
    .trim();
}

function textUnits(value = "") {
  const normalized = normalizedComparableText(value);
  if (!normalized) return [];
  const chars = Array.from(normalized);
  if (chars.length <= 2) return [normalized];
  const units = [];
  for (let index = 0; index < chars.length - 1; index += 1) {
    units.push(`${chars[index]}${chars[index + 1]}`);
  }
  return units;
}

function textSimilarity(left = "", right = "") {
  const a = normalizedComparableText(left);
  const b = normalizedComparableText(right);
  if (!a || !b) return 0;
  const shorter = a.length <= b.length ? a : b;
  const longer = a.length > b.length ? a : b;
  if (shorter.length >= 24 && longer.includes(shorter)) return 1;
  const aUnits = new Set(textUnits(a));
  const bUnits = new Set(textUnits(b));
  if (!aUnits.size || !bUnits.size) return 0;
  let intersection = 0;
  for (const unit of aUnits) {
    if (bUnits.has(unit)) intersection += 1;
  }
  return intersection / Math.min(aUnits.size, bUnits.size);
}

function textRepeatsAny(value = "", existing = [], threshold = 0.78) {
  return existing.some((item) => textSimilarity(value, item) >= threshold);
}

function uniqueNonRepeatingLines(lines = [], existing = [], limit = 8) {
  const accepted = [];
  for (const line of lines.map((item) => short(item, 260)).filter(Boolean)) {
    if (textRepeatsAny(line, existing.concat(accepted))) continue;
    accepted.push(line);
    if (accepted.length >= limit) break;
  }
  return accepted;
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

function sectionByHeading(markdown = "", headingPrefix = "") {
  const lines = String(markdown || "").split(/\r?\n/u);
  const start = lines.findIndex((line) => line.startsWith(headingPrefix));
  if (start < 0) return "";
  const collected = [];
  for (const line of lines.slice(start)) {
    if (collected.length && line.startsWith("## ")) break;
    collected.push(line);
  }
  return collected.join("\n").trim();
}

function parseJsonLine(section = "", key = "") {
  const match = section.match(new RegExp(`^- ${key}:\\s*(.+)$`, "mu"));
  if (!match) return null;
  try {
    return JSON.parse(match[1].trim());
  } catch {
    return null;
  }
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

function recoverCompleteTitleFromFullText(title = "", fullText = "") {
  const cleanTitle = String(title || "").replace(/\s+/gu, " ").trim();
  if (!cleanTitle || !/\.{3}|…/u.test(cleanTitle)) return cleanTitle;
  const prefix = cleanTitle.replace(/(?:\s*\.{3}|…)\s*$/u, "").trim();
  if (prefix.length < 18) return cleanTitle;
  const lines = String(fullText || "")
    .split(/\r?\n/u)
    .map((line) => line.replace(/\s+/gu, " ").trim())
    .filter(Boolean);
  const match = lines.find((line) => line.startsWith(prefix) && line.length > cleanTitle.length);
  return match || cleanTitle;
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
    if (host === "zoneandco.com") return "Zone & Co";
    if (host === "lio.ai") return "Lio";
    if (host === "druidai.com") return "Druid AI";
    if (host === "snowflake.com") return "Snowflake";
    if (host === "itwire.com" && pathname.includes("asus")) return "ASUS";
    if (host === "github.blog" && (pathname.includes("agent-hq") || pathname.includes("welcome-home-agents"))) return "GitHub";
    if (host === "metronome.com" && pathname.includes("hugging-face")) return "Hugging Face";
    if (host === "ycombinator.com" && pathname.includes("/companies/pipeshift")) return "Pipeshift";
    if ((host === "blog.google" || host.endsWith("googleblog.com")) && pathname.includes("gemma")) return "Google DeepMind";
    if (host === "github.com" && pathname.includes("googlecloudplatform/agent-starter-pack")) return "Google Cloud";
    if (host === "agno.com" && pathname.includes("github-release-notes-agent")) return "Agno";
    if (host === "techcrunch.com" && pathname.includes("openai") && pathname.includes("lockdown")) return "OpenAI";
    if (host === "techcrunch.com" && pathname.includes("openai") && pathname.includes("equity-stake")) return "OpenAI";
    if (host === "the-decoder.com" && pathname.includes("sakana-ai")) return "Sakana AI";
    if (host === "banyan-vc.com") return "Banyan VC";
    if (host === "ithome.com" && pathname.includes("960/880")) return "Apple";
    if (host === "ithome.com" && pathname.includes("961/045")) return "UK police";
    if (host === "ithome.com" && pathname.includes("960/909")) return "CCTV";
    if (host === "cnbc.com" && pathname.includes("google-to-pay-spacex")) return "Google / SpaceX";
    if (host === "techcrunch.com" && pathname.includes("google-will-pay-spacex")) return "Google / SpaceX";
    if (host === "growthlist.co" && pathname.includes("yc-startups")) return "Y Combinator";
    if (host === "saasmag.com" && pathname.includes("monetizing-ai-agents")) return "SaaS companies";
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
  const knownMatch = clean.match(/^(Google DeepMind|Google Research|Google Colab|Anthropic|Claude Cowork|Claude Code|OpenAI|Microsoft|NVIDIA|Airspeed|NeoCognition|Nimble)\b/u);
  if (knownMatch) return cleanSubject(knownMatch[1]);
  const actionMatch = clean.match(/^([A-Z][A-Za-z0-9 .&/-]{1,42}?|[\u4e00-\u9fffA-Za-z0-9 .&/-]{2,28}?)(?:\s*)(发布|推出|完成|融资|获得|获|宣布|部署|开源|用|与|让|launches?|raises?|lands?|announces?|releases?)\b/iu);
  if (actionMatch) return cleanSubject(actionMatch[1]);
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
  if (/^Moonshot AI\b/iu.test(clean)) return "Moonshot AI";
  if (/^Meta\b|^Meta 在其 AI 应用中/iu.test(clean)) return "Meta";
  if (/^Qwen3\.7-Plus\b/iu.test(clean)) return "Qwen3.7-Plus";
  if (/NeoCognition/iu.test(clean)) return "NeoCognition";
  if (/Nimble/iu.test(clean)) return "Nimble";
  if (/Airspeed/iu.test(clean)) return "Airspeed";
  if (/^Druidai$/iu.test(clean)) return "Druid AI";
  if (/^Saasmag$/iu.test(clean)) return "SaaS Magazine";
  if (/^Ithome$/iu.test(clean)) return "";
  const titled = subjectFromTitle(clean);
  if (titled && titled !== clean && clean.length > titled.length + 2) return normalizeSubject(titled);
  if (/^谷歌$/u.test(clean)) return "Google";
  if (/^微软$/u.test(clean)) return "Microsoft";
  if (/^英伟达$/u.test(clean)) return "NVIDIA";
  if (/^bcg$/iu.test(clean)) return "BCG";
  if (/^googlecloudpresscorner$/iu.test(clean)) return "";
  return clean;
}

function subjectLooksLikeTitle(value = "") {
  const clean = cleanSubject(value);
  return clean.length > 12 && /(发布|推出|完成|融资|获得|部署|重建|成为|指南|降低|提升|用于|进入|让|把|扩大|承诺|帮助|被叫停|可能|入股|渲染|升级|调整|增强|开始探索|押注|欲打破|榜单|清单|将|支付|获取|聚焦|是 AIScraping|Introducing|Top AI|Complete Guide|Release Notes Agent|with quantization|Brings Enterprise|monetizing AI agents)/iu.test(clean);
}

function isWeakSubject(value = "") {
  const clean = normalizeSubject(value);
  if (!clean || isDiscoveryLabel(clean)) return true;
  if (/^\d{4}$/u.test(clean)) return true;
  if (/^[a-z0-9.-]+\.(com|org|net|io|ai|dev|co)$/iu.test(clean)) return true;
  if (/^(LinkedIn|Linkedin|TechCrunch|Techcrunch|The[-\s]Decoder|Marktechpost|Siliconangle|Instagram|Apple Podcasts)$/iu.test(clean)) return true;
  if (/^(Requests for Startups|Enterprise AI Execution Problem|The Information'?s TITV)$/iu.test(clean)) return true;
  if (/^(一位|消息称|现在我)/u.test(clean)) return true;
  if (/(full list|Inference costs|VCs backing|raised \$100M|开源界的怪胎|富士康展示)/iu.test(clean)) return true;
  if (/^CEO\s+/iu.test(clean)) return true;
  if (/把 AI 用进/u.test(clean)) return true;
  if (subjectLooksLikeTitle(value)) return true;
  return false;
}

function frontstageTitle(frontTitle = "", rawTitle = "") {
  if (rawTitle && isDiscoveryLabel(frontTitle)) return rawTitle;
  return frontTitle || rawTitle;
}

function hasCjk(value = "") {
  return /[\u4e00-\u9fff]/u.test(String(value || ""));
}

function translateEnglishTitle(title = "", sourceUrl = "") {
  const text = String(title || "").trim();
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const byUrl = [
    [/techcrunch\.com.*nimble-way-raises-47m/u, "Nimble 融资 4700 万美元，让 AI Agent 获取实时网页数据"],
    [/techcrunch\.com.*neocognition.*lands-40m/u, "NeoCognition 融资 4000 万美元，研发像人类一样学习的自学习 AI Agent"],
    [/unite\.ai.*airspeed-raises-20m-series-a/u, "Airspeed 融资 2000 万美元，打造面向收入团队的 AI「商业大脑」"],
    [/aimultiple\.com.*ai-procurement/u, "10 个 AI 采购用例与案例研究"],
    [/aws\.amazon\.com.*procurement.*agentcore/u, "AWS：使用 Amazon Bedrock AgentCore 自动化采购工作流"],
    [/siliconangle.*archestra/u, "Archestra 融资 1000 万美元，为企业数据接入 AI Agent 搭建中介层"],
    [/linkedin\.com.*seed.*pre-seed/u, "57 家早期 AI 初创公司一周融资 3.16 亿美元"],
    [/thenextweb\.com.*voice-ai-infrastructure/u, "前高盛和 Meta 创始人融资 300 万美元，建设语音 AI 基础设施"],
    [/riseuplabs\.com.*cost.*implementing-ai/u, "2026 年企业实施 AI 的真实成本"],
    [/github\.com.*agent-ready-enterprise/u, "面向 Agent-ready 企业的 AI 开发者平台"],
    [/avasant\.com.*advanced-voice-ai/u, "2026 年高级语音 AI 平台市场观察"],
    [/firecrawl\.dev.*frameworks.*ai-agents/u, "2026 年构建 AI Agent 的开源框架"],
    [/github\.com.*governing-agents/u, "GitHub Enterprise 中的 Agent 治理"],
    [/kpmg.*procurement.*intelligent/u, "KPMG：用智能技术改造采购流程"],
  ];
  const urlMatch = byUrl.find(([pattern]) => pattern.test(normalized));
  if (urlMatch) return urlMatch[1];
  const byTitle = [
    [/^How Druid AI helped a global appliance retailer/iu, "Druid AI 帮助全球家电零售商自动化联络中心客服流程"],
    [/^ASUS Brings Enterprise\s*-\s*to\s*-\s*Edge AI/iu, "华硕在 Computex 2026 展示企业到边缘的 AI 部署方案"],
    [/^GitHub release notes agent\s*-\s*Agno/iu, "Agno 发布 GitHub Release Notes Agent"],
    [/^GoogleCloudPlatform\/agent-starter-pack/iu, "Google Cloud 发布 Agent Starter Pack 开源模板"],
    [/^How SaaS Companies Are Monetizing AI Agents in 2026/iu, "SaaS 公司开始探索 AI Agent 的商业化路径"],
    [/^Top AI Pre-Seed Investors/iu, "AI Pre-seed 投资人榜单"],
    [/^Snowflake Expands AWS Collaboration with \$6B AI Commitment/iu, "Snowflake 扩大 AWS 合作并承诺 60 亿美元 AI 投入"],
    [/^Pipeshift: Inference for real-time production workloads/iu, "Pipeshift 为实时生产工作负载提供 AI 推理服务"],
    [/^Gemma 4 with quantization-aware training/iu, "Google DeepMind 发布支持量化感知训练的 Gemma 4"],
    [/^10 AI Procurement Use Cases/iu, "10 个 AI 采购用例与案例研究"],
    [/^Automate Procurement Workflows/iu, "使用 AI Agent 自动化采购工作流"],
    [/^Archestra raises \$10M/iu, "Archestra 融资 1000 万美元，为企业数据接入 AI Agent 搭建中介层"],
    [/^57 early stage AI startups/iu, "57 家早期 AI 初创公司一周融资 3.16 亿美元"],
    [/^Ex-Goldman Sachs and Meta founders raise \$3M/iu, "前高盛和 Meta 创始人融资 300 万美元，建设语音 AI 基础设施"],
    [/^The True Cost of Implementing AI/iu, "2026 年企业实施 AI 的真实成本"],
    [/^The AI-powered developer platform/iu, "面向 Agent-ready 企业的 AI 开发者平台"],
    [/^Advanced Voice AI Platforms 2026/iu, "2026 年高级语音 AI 平台市场观察"],
    [/^The best open source frameworks/iu, "2026 年构建 AI Agent 的开源框架"],
    [/^Governing agents in GitHub Enterprise/iu, "GitHub Enterprise 中的 Agent 治理"],
    [/^Transforming procurement through intelligent technology/iu, "KPMG：用智能技术改造采购流程"],
  ];
  const titleMatch = byTitle.find(([pattern]) => pattern.test(text));
  if (titleMatch) return titleMatch[1];
  return text;
}

function chineseFactFromSource(title = "", sourceUrl = "") {
  const text = String(title || "");
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const source = `${text}\n${normalized}`;
  const rules = [
    [/nimble-way-raises-47m|Nimble raises \$47M/iu, "TechCrunch 报道，Nimble 完成 4700 万美元 B 轮融资，由 Norwest 领投，平台用 AI Agent 实时搜索网页、验证结果，并把信息结构化成可查询的数据表。"],
    [/neocognition.*lands-40m|NeoCognition lands \$40M/iu, "TechCrunch 报道，NeoCognition 从隐身状态推出并完成 4000 万美元种子轮融资，由 Cambium Capital 和 Walden Catalyst Ventures 共同领投，方向是研发自学习 AI Agent。"],
    [/airspeed-raises-20m|Airspeed Raises \$20M/iu, "Unite.AI 报道，Airspeed 完成 2000 万美元 A 轮融资，由 DN Capital 领投，资金用于扩展面向销售和收入运营团队的 AI 平台。"],
    [/10 AI Procurement Use Cases|aimultiple\.com.*ai-procurement/iu, "AIMultiple 汇总了 10 类 AI 采购用例和案例，材料重点在采购流程、工具选择和企业采用场景。"],
    [/Automate Procurement Workflows|amazon.*procurement.*agentcore/iu, "AWS 展示了用 Amazon Bedrock AgentCore 自动化采购工作流的方案，重点是把 Agent 放进采购任务和流程编排。"],
    [/Daniela Amodei|IPO 前夕驳斥|Anthropic 联合创始人/iu, "TechCrunch 报道 Anthropic 联合创始人 Daniela Amodei 在 IPO 前回应外界对 AI 投资回报的质疑。"],
    [/Claude Code v2\.1\.163/iu, "Claude Code 发布 v2.1.163 版本，属于 AI 编程工具链的持续迭代信号。"],
    [/Governing agents in GitHub Enterprise/iu, "GitHub Enterprise 材料讨论 Agent 治理，重点是企业环境下的权限、规则和管控建议。"],
    [/When AI builds itself|recursive self-improvement|递归式自我改进/iu, "Anthropic 发布递归式自我改进进展，讨论 AI 系统参与自身构建和改进时的能力边界。"],
    [/Archestra raises \$10M|archestra/iu, "Archestra 融资 1000 万美元，产品方向是为 AI Agent 访问企业数据建立受控连接层。"],
    [/57 early stage AI startups/iu, "LinkedIn 材料显示，一周内 57 家早期 AI 初创公司完成 Seed 或 Pre-seed 融资，合计约 3.16 亿美元。"],
    [/voice AI infrastructure global tech giants|thenextweb/iu, "The Next Web 报道称，两名前高盛和 Meta 创始人融资 300 万美元，建设面向大型科技公司的语音 AI 基础设施。"],
    [/True Cost of Implementing AI|riseuplabs/iu, "Riseup Labs 讨论 2026 年企业实施 AI 的成本构成，包括开发、集成、运营和维护费用。"],
    [/agent-ready enterprise/iu, "GitHub 相关材料介绍面向 Agent-ready 企业的软件开发平台，重点在开发者工作流和企业级 Agent 接入。"],
    [/Advanced Voice AI Platforms|avasant/iu, "Avasant 发布高级语音 AI 平台市场观察，材料关注语音 AI 平台能力、供应商和企业应用方向。"],
    [/open source frameworks for building AI agents|firecrawl/iu, "Firecrawl 汇总 2026 年构建 AI Agent 的开源框架，材料关注 Agent 开发工具和框架选择。"],
    [/passive heart rate|PHRM|Google Research/iu, "Google Research 发布被动心率监测系统 PHRM，展示 AI 在健康监测和感知建模中的应用。"],
    [/Transforming procurement through intelligent technology|kpmg/iu, "KPMG 客户案例讨论用智能技术改造采购流程，重点在采购自动化和流程效率。"],
    [/Nemotron 3 Ultra/iu, "NVIDIA AI 发布 Nemotron 3 Ultra，材料关注长时间运行智能体所需的大模型架构和推理能力。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(source));
  if (match) return match[1];
  // Fallback: if the title already has Chinese content, use it as a basic fact
  const cjkChars = (text.match(/[\u4e00-\u9fff]/gu) || []).length;
  if (cjkChars >= 8) return short(text, 320);
  return "";
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
    [/zoneandco\.com.*tripadvisor-streamlines-global-procurement/u, "Tripadvisor 使用 Zone & Co 优化全球采购流程"],
    [/github\.blog.*welcome-home-agents/u, "GitHub 推出 Agent HQ 统一管理编码智能体"],
    [/metronome\.com.*hugging-face/u, "Hugging Face 使用 Metronome 支持计量计费"],
    [/ycombinator\.com.*companies\/industry\/open-source/u, "Y Combinator 2026 开源创业公司索引"],
    [/growthlist\.co.*yc-startups/u, "Y Combinator 创业公司完整索引"],
  ];
  const match = rules.find(([pattern]) => pattern.test(normalized));
  if (match) return match[1];
  if (!hasCjk(title)) return translateEnglishTitle(title, sourceUrl);
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
    [/theverge\.com.*ai-laptop-nvidia-build-gemini/u, "NVIDIA / Microsoft / Google"],
    [/marktechpost.*gemma-4-qat/u, "Google DeepMind"],
    [/research\.google.*agentic-rag/u, "Google Research"],
    [/anthropic\.com.*making-claude-a-chemist/u, "Anthropic"],
    [/anthropic\.com.*claude-code.*sales/u, "Anthropic"],
    [/claude\.com.*cowork/u, "Claude Cowork"],
    [/developers\.googleblog\.com.*colab/u, "Google Colab"],
    [/huggingface\.co\/blog\/ibm-research\/agent-logic/u, "IBM Research"],
    [/techcrunch\.com.*49-us-ai-startups.*raised-100m/u, "美国 AI 初创公司"],
    [/github\.com.*anthropics.*claude-code/u, "Claude Code"],
    [/research\.google.*flood-resilience/u, "Google Research"],
    [/anthropic\.com.*claude-opus-4-8/u, "Anthropic / Claude"],
    [/theverge\.com.*as-ai-gets-better/u, "Google Gemini Spark"],
    [/siliconangle.*vapi/u, "Vapi"],
    [/youtube\.com.*tecd/u, "AI Coding Agents"],
    [/youtube\.com.*71qv/u, "AI Evals"],
    [/github\.com\/github\/copilot-sdk/u, "GitHub Copilot"],
    [/pondero\.ai.*github-copilot-sdk-ga/u, "GitHub Copilot"],
    [/linkedin\.com.*cerebras-systems_partner-spotlight/u, "Cerebras / AWS Marketplace"],
    [/ycombinator\.com\/rfs/u, "Y Combinator"],
    [/the-decoder\.com.*anthropic-poaches-openais/u, "Anthropic / OpenAI"],
    [/techtimes\.com.*openrouter/u, "OpenRouter"],
    [/the-decoder\.com.*deepseek-topped-ramps/u, "DeepSeek / Ramp"],
    [/the-decoder\.com.*perplexitys-search-as-code/u, "Perplexity"],
    [/techcrunch\.com.*tokenpocalypse/u, "Microsoft / GitHub Copilot"],
    [/drewdevault\.com.*circus-freaks-of-foss/u, "Drew DeVault"],
    [/human-in-the-loop\.bearblog\.dev.*llms-are-eroding/u, "Human in the Loop"],
    [/ithome\.com\/0\/961\/146/u, "京东 / 腾讯"],
    [/ithome\.com\/0\/961\/185/u, "华为云 / 智果园"],
    [/ithome\.com\/0\/961\/214/u, "国家安全部"],
    [/ithome\.com\/0\/961\/113/u, "极摩客 / EVO-X3"],
    [/ithome\.com\/0\/961\/163/u, "富士康 / RTX 6000 Blackwell"],
    [/linkedin\.com.*intelcapital_heres-the-full-list/u, "Intel Capital / AI 初创公司"],
    [/linkedin\.com.*unframe.*raises-50-million/u, "Unframe"],
    [/instagram\.com\/p\/dym7eqlkd71/u, "SpiceOrb"],
    [/blog\.janestreet\.com.*claude-code-more-than-figma/u, "Jane Street / Claude Code"],
    [/sky9capital\.com.*ai-native-enterprise-software/u, "Sky9 Capital"],
    [/podcasts\.apple\.com.*the-informations-titv/u, "The Information TITV"],
  ];
  const match = rules.find(([pattern]) => pattern.test(normalized));
  if (match) return match[1];
  if (/^Vapi 融资/u.test(title)) return "Vapi";
  if (/^Google 开源水文/u.test(title)) return "Google Research";
  if (/^Anthropic 发布 Claude/u.test(title)) return "Anthropic / Claude";
  if (/^不理解 AI 评测/u.test(title)) return "AI Evals";
  return "";
}

function frontstageCandidateSubject(sourceUrl = "", rawTitle = "", title = "", sourceName = "") {
  const override = frontstageSubjectOverride(sourceUrl, title || rawTitle);
  if (override) return override;
  const urlSubject = normalizeSubject(subjectFromUrl(sourceUrl));
  if (urlSubject && !isWeakSubject(urlSubject)) return urlSubject;
  const titleSubject = normalizeSubject(subjectFromTitle(rawTitle) || subjectFromTitle(title));
  if (titleSubject && !isWeakSubject(titleSubject)) return titleSubject;
  const sourceSubject = normalizeSubject(sourceName);
  if (sourceSubject && !isWeakSubject(sourceSubject)) return sourceSubject;
  const domainSubject = normalizeSubject(domain(sourceUrl));
  if (domainSubject && !isWeakSubject(domainSubject)) return domainSubject;
  return "未标注主体";
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
  if (urlSubject) return urlSubject;
  if (explicit) return explicit;
  if (isDiscoveryLabel(sourceName) && titleSubject && !isWeakSubject(titleSubject)) return titleSubject;
  return (!isWeakSubject(sourceName) ? normalizeSubject(sourceName) : "")
    || (titleSubject && !isWeakSubject(titleSubject) ? titleSubject : "")
    || "未标注主体";
}

function readRawEvidence(rawJsonRel, rawArchiveRel, sourceUrlHint = "") {
  const rawJson = resolveRawJsonPath(rawJsonRel, sourceUrlHint);
  const rawArchive = resolveRawArchivePath(rawArchiveRel, rawJson);
  let sourceName = "";
  let sourceUrl = "";
  let publishedAt = "";
  let rawTitle = "";
  let keyExcerpts = [];
  let visibleFragment = "";
  let fullText = "";
  let businessElements = {};
  let evidenceSeed = {};

  if (rawJson && fs.existsSync(rawJson)) {
    try {
      const json = JSON.parse(read(rawJson));
      sourceName = json.source_name || "";
      sourceUrl = json.original_url || json.canonical_url || "";
      publishedAt = json.published_at || "";
      keyExcerpts = Array.isArray(json.key_excerpts)
        ? json.key_excerpts.map((item) => ({
          type: item?.type || "",
          text: short(item?.text || "", 260),
        })).filter((item) => item.text).slice(0, 8)
        : [];
      fullText = json.full_text || json.clean_text || "";
      rawTitle = recoverCompleteTitleFromFullText(json.title || "", fullText);
      visibleFragment = short(fullText, 360);
      businessElements = json.business_elements || {};
      evidenceSeed = json.evidence_seed || {};
    } catch {
      // Keep the card usable even if a raw snapshot is malformed.
    }
  }

  if (!visibleFragment && rawArchive && fs.existsSync(rawArchive)) {
    const snapshot = read(rawArchive);
    visibleFragment = short(snapshot.replace(/^---[\s\S]*?---/u, ""), 360);
    const excerptMatch = snapshot.match(/key_excerpts:\s*(\[.*\])/u);
    if (!keyExcerpts.length && excerptMatch) keyExcerpts = [{ type: "supporting_context", text: short(excerptMatch[1], 220) }];
  }

  return { sourceName, sourceUrl, publishedAt, rawTitle, keyExcerpts, visibleFragment, fullText, businessElements, evidenceSeed };
}

function readPoolEvidence(date = "", poolRef = "", expectedSourceUrl = "") {
  if (!date || !poolRef) return null;
  const poolFile = path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`);
  if (!fs.existsSync(poolFile)) return null;
  const section = sectionByHeading(read(poolFile), `## ${poolRef}`);
  if (!section) return null;
  const sectionSourceUrl = (section.match(/-\s*source_url:\s*(.+)/u) || [])[1]?.trim() || "";
  if (expectedSourceUrl && sectionSourceUrl && sectionSourceUrl !== "no-url" && canonicalUrl(sectionSourceUrl) !== canonicalUrl(expectedSourceUrl)) {
    return null;
  }
  const keyExcerptObjects = parseJsonLine(section, "key_excerpts") || [];
  const evidenceSeed = parseJsonLine(section, "evidence_seed") || {};
  return {
    sourceName: "",
    sourceUrl: "",
    publishedAt: "",
    rawTitle: "",
    keyExcerpts: Array.isArray(keyExcerptObjects)
      ? keyExcerptObjects.map((item) => {
          const raw = (item?.text || "").replace(/\/\s*query=.*?\/\s*intent=.*?\/\s*path=\S*\s*/g, "").trim();
          return { type: item?.type || "", text: short(raw, 260) };
        }).filter((item) => item.text)
      : [],
    visibleFragment: "",
    fullText: section,
    businessElements: {},
    evidenceSeed,
  };
}

function mergeEvidence(primary, fallback) {
  if (!fallback) return primary;
  return {
    sourceName: primary.sourceName || fallback.sourceName || "",
    sourceUrl: primary.sourceUrl || fallback.sourceUrl || "",
    publishedAt: primary.publishedAt || fallback.publishedAt || "",
    rawTitle: primary.rawTitle || fallback.rawTitle || "",
    keyExcerpts: primary.keyExcerpts?.length ? primary.keyExcerpts : fallback.keyExcerpts || [],
    visibleFragment: primary.visibleFragment || fallback.visibleFragment || "",
    fullText: primary.fullText || fallback.fullText || "",
    businessElements: Object.keys(primary.businessElements || {}).length ? primary.businessElements : fallback.businessElements || {},
    evidenceSeed: Object.keys(primary.evidenceSeed || {}).length ? primary.evidenceSeed : fallback.evidenceSeed || {},
  };
}

function publicVisibleFragment(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/Builders Viewpoints|今日观察中的|Raw\s*\/\s*Pool|候选、人物时间线/u.test(text)) return "";
  if (!hasCjk(text)) return "";
  return text;
}

function isMechanicalFrontstageText(value = "") {
  return /^关键数字：|原文关键数字包括|发布 AI 能力|把 AI 用进|这条变化值得看|客户是否买单|流程结果、交付速度|团队协作有没有实际改善|面向销售和收入团队流程|面向地产开发和建筑设计流程|面向模型部署和算力调用|面向企业智能体协作流程/u.test(String(value || ""));
}

function procurementUseCaseHighlights(fullText = "") {
  const text = String(fullText || "");
  if (!/10 Use cases of AI in procurement processes/iu.test(text)) return [];
  return [
    "AIMultiple 列出的 10 个采购用例包括：合同管理、供应商风险管理、支出分析与分类、异常检测、自动合规、应付账款自动化、发票数据提取、采购聊天机器人、战略寻源、全球寻源。",
    "案例数据包括：某快餐连锁用 AI 寻找替代供应商后供应网络距离减少 25%，每年节省 320 万欧元。",
    "Pentair 用 AI 采购方案在两个月内全球上线，支出分类准确率超过 90%，带来 1500 万美元营运资本改善。",
    "Scribd 在应付账款异常检测中用 AI 加速财务流程 60%；Landsec 的 AP 自动化案例显示人工数据采集和验证可节省最高 92% 时间。",
    "全球寻源案例中，某 Fortune 500 油气公司把 15 套旧采购系统整合为 2 套，eSourcing 采用率提升 20%，采购 ROI 提升 15%。",
  ];
}

function archestraHighlights(fullText = "") {
  const text = String(fullText || "");
  if (!/Archestra/iu.test(text)) return [];
  const highlights = [];
  if (/four Fortune 500 companies/iu.test(text)) highlights.push("平台已在 4 家 Fortune 500 公司生产环境使用，覆盖法务、采购、管理和运营。");
  if (/days rather than months/iu.test(text)) highlights.push("Archestra 称企业 AI 团队可在数天而不是数月内把 Agent 接入内部数据。");
  if (/Jira, Confluence, GitHub, Notion, SharePoint, Google Drive and Salesforce/iu.test(text)) highlights.push("连接器覆盖 Jira、Confluence、GitHub、Notion、SharePoint、Google Drive 和 Salesforce，并支持 Claude、ChatGPT、Gemini 与开源模型。");
  if (/45 milliseconds/iu.test(text)) highlights.push("材料披露平台 95 分位延迟为 45 毫秒，并提供 Prometheus、OpenTelemetry 和 Grafana 观测。");
  if (/900 evaluated servers/iu.test(text)) highlights.push("其私有 MCP registry 可管理、版本化和回滚可用 MCP server，公共目录含 900 多个已评估 server。");
  if (/96%/u.test(text)) highlights.push("成本优化层可按团队、Agent 或组织跟踪花费，并声称简单查询路由到便宜模型可最多降低 96% 推理账单。");
  if (/3,700 stars|57 contributors/iu.test(text)) highlights.push("开源核心已获得 3700+ GitHub stars 和 57 名贡献者。");
  if (/\$13\.5 million/iu.test(text)) highlights.push("本轮后 Archestra 总融资达到 1350 万美元，2025 年 8 月曾完成 330 万美元 pre-seed。");
  return highlights;
}

function translateKnownRawExcerpt(value = "", type = "") {
  const text = String(value || "");
  const rules = [
    [/Nimble raises \$47M to give AI agents access to real-time web data/iu, "TechCrunch 原题为：Nimble raises $47M to give AI agents access to real-time web data。"],
    [/web search startup Nimble.*raised a \$47 million Series B round.*Norwest/iu, "Nimble 完成 4700 万美元 B 轮融资，由 Norwest 领投。"],
    [/platform employs AI agents to search the web in real time.*verify and validate.*queried like a database/iu, "Nimble 平台用 AI Agent 实时搜索网页、验证结果，并把信息整理成可像数据库一样查询的表格。"],
    [/businesses invest in using AI agents.*scrape the web.*modern data tools/iu, "原文指出，企业在用 AI Agent 处理数据时，需要既能抓取网页、又能返回适合现代数据工具使用结果的工具。"],
    [/LLMs and AI agents are great for searching the web.*plain text.*enterprise level/iu, "原文提到，LLM 和 AI Agent 虽适合搜索和分析网页，但常返回难以在企业级场景使用的纯文本结果。"],
    [/Nimble lets companies use web data.*existing databases.*Databricks and Snowflake/iu, "Nimble 将网页数据结构化后接入企业现有数据库、数据仓库和数据湖，文中提到 Databricks 与 Snowflake。"],
    [/AI research lab NeoCognition lands \$40M seed to build agents that learn like humans/iu, "TechCrunch 原题为：AI research lab NeoCognition lands $40M seed to build agents that learn like humans。"],
    [/NeoCognition.*emerged from stealth with \$40 million in seed funding/iu, "NeoCognition 从隐身状态推出，并完成 4000 万美元种子轮融资。"],
    [/round was co-led by Cambium Capital and Walden Catalyst Ventures.*Vista Equity Partners/iu, "NeoCognition 本轮由 Cambium Capital 和 Walden Catalyst Ventures 共同领投，Vista Equity Partners 等参投。"],
    [/Yu Su.*spun out his work into a startup.*foundational model advances.*personalized/iu, "创始人 Yu Su 将俄亥俄州立大学 AI Agent 实验室的研究拆分为公司，原因是基础模型进展让个性化 Agent 更可行。"],
    [/Today.?s agents are generalists/iu, "Yu Su 对 TechCrunch 表示，今天的 Agent 仍偏通用型，每次执行任务都像是在冒险。"],
    [/Airspeed.*raised a \$20 million Series A round led by DN Capital.*Atlassian Ventures/iu, "Airspeed 完成 2000 万美元 A 轮融资，由 DN Capital 领投，Vi Partners、Framework Venture Partners 和 Atlassian Ventures 参投。"],
    [/funding brings the company.*total capital raised to more than \$25 million/iu, "本轮后，Airspeed 累计融资超过 2500 万美元。"],
    [/formerly known as Glyphic.*rebranded to Airspeed.*execution layer for revenue organizations/iu, "Airspeed 原名 Glyphic，近期更名后从会话智能扩展为面向收入组织的执行层。"],
    [/Rather than simply surfacing insights.*autonomous AI agents.*commercial workflows/iu, "Airspeed 平台不是只从会议、邮件和 CRM 中提取洞察，而是让自主 AI Agent 跨商业工作流执行动作。"],
    [/57 early stage AI startups.*\$316M/iu, "原文记录 57 家早期 AI 初创公司一周内合计融资 3.16 亿美元。"],
    [/Claude Code v?2\.1\.163/iu, "原文记录 Claude Code v2.1.163 发布，属于工程工具链更新。"],
    [/Governing agents in GitHub Enterprise/iu, "原文讨论 GitHub Enterprise 中的 Agent 治理，重点是企业环境里的权限、策略和安全管理。"],
    [/Transforming procurement through intelligent technology/iu, "原文讨论采购流程如何用智能技术改造，场景集中在采购、供应商和流程自动化。"],
    [/Nemotron 3 Ultra/iu, "原文记录 NVIDIA AI 发布 Nemotron 3 Ultra，属于面向长时间运行 Agent 的模型和基础设施材料。"],
    [/The platform is in production at four Fortune 500 companies/iu, "平台已在 4 家 Fortune 500 公司生产环境使用，Agent 覆盖法务、采购、管理和运营。"],
    [/wire agents to internal data in days rather than months/iu, "企业 AI 团队可在数天而不是数月内把 Agent 接入内部数据，同时降低数据外泄和 prompt-injection 风险。"],
    [/Archestra acts as a middle layer between the agent and the data/iu, "Archestra 作为 Agent 与企业数据之间的中间层，负责身份、策略、访问代理和日志记录。"],
    [/raised \$10 million in new funding/iu, "Archestra 获得 1000 万美元新融资，用于扩大大型企业部署和开源生态。"],
    [/Data is crucial for procurement teams/iu, "采购团队需要外部和内部数据来跟踪支出、管理供应商关系和识别供应风险。"],
    [/more than 60% of chief procurement officers/iu, "Deloitte 调查显示，超过 60% 的首席采购官正在使用高级分析。"],
    [/ASUS Zenni Claw.*safe, controlled, reliable agentic AI experiences/iu, "华硕在 Computex 2026 展示 Zenni Claw AI 方案，强调为企业提供安全、可控、可靠的 Agentic AI 体验。"],
    [/ASUS AI x ESG Platform.*sustainability data.*supply chain/iu, "华硕 AI x ESG Platform 将可持续发展数据转化为 ESG、碳排和供应链洞察，面向企业治理与运营场景。"],
    [/Customers who track parcels in real time.*washing machine breaks down/iu, "Druid AI 案例描述家电客户期望在洗衣机周末故障时，也能获得类似实时物流、银行 App 和午夜预约的即时服务体验。"],
    [/company operating across 25\+ European markets.*25 languages/iu, "案例客户覆盖 25 个以上欧洲市场、约 25 种语言，客服自动化需求来自跨市场和多品牌服务复杂度。"],
    [/Pipeshift helps engineering teams run real-time inference in production/iu, "Pipeshift 为工程团队提供生产环境实时推理服务，重点是满足延迟和吞吐 SLA。"],
    [/optimized runtimes to meet latency\/throughput SLAs.*auto-scales and routes/iu, "Pipeshift 将优化运行时与基础设施编排结合，用于自动扩缩容和路由实时推理工作负载。"],
    [/collaboration brings generative and agentic AI capabilities directly to enterprise data/iu, "Snowflake 与 AWS 的合作把生成式 AI 和 Agentic AI 能力直接带到企业数据层，帮助共同客户更快、更安全地部署 AI 应用。"],
    [/Multi-year strategic agreement expands joint investments in customer success/iu, "Snowflake 与 AWS 的多年战略协议扩大了面向客户成功、产品集成和市场进入的联合投入。"],
    [/Salesforce hit \$800 million in Agentforce ARR.*29,000 deals/iu, "材料称 Salesforce Agentforce 在 2026 财年末达到 8 亿美元 ARR，并在第四季度完成 2.9 万笔交易。"],
    [/Our new versions of the Gemma 4 family are optimized with Quantization-Aware Training.*reduce memory requirements.*on-device performance/iu, "Google DeepMind 表示，Gemma 4 的新版本采用量化感知训练（QAT）优化，以显著降低内存需求并提升端侧性能。"],
    [/Gemma 4 QAT models.*mobile and laptop efficiency/iu, "Gemma 4 QAT 模型面向手机和笔记本效率优化，核心目标是降低本地设备部署的内存占用。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  if (match) return match[1];
  return "";
}

function arrayField(object, key) {
  return Array.isArray(object?.[key]) ? object[key].map((item) => String(item || "").trim()).filter(Boolean) : [];
}

function extractNumbers(value = "") {
  return [...String(value || "").matchAll(/(?:[$€£]\s?\d+(?:\.\d+)?\s?(?:M|B|K|million|billion)?|\d+(?:\.\d+)?\s?(?:%|M|B|K|million|billion|stars|contributors|customers|companies|days|months|servers)|Fortune\s?\d+)/giu)]
    .map((match) => match[0].replace(/\s+/gu, " ").trim());
}

function meaningfulNumbers(values = []) {
  return [...new Set(values)]
    .filter((value) => /[$€£%]|million|billion|\bM\b|\bB\b|stars|contributors|customers|companies|days|months|servers|Fortune/iu.test(value))
    .filter((value) => !/^\d{4}$/u.test(value))
    .filter((value) => !/^(?:19|20)\d{2}\s?[MBK]$/iu.test(value))
    .filter((value) => !/^(?:19|20)\d{2}\s?(?:million|billion)$/iu.test(value))
    .slice(0, 8);
}

function excerptTypeLabel(type = "") {
  const labels = {
    case_detail: "案例信息",
    company_action: "公司动作",
    funding: "融资信息",
    workflow_change: "流程变化",
    supporting_context: "背景信息",
    product_launch: "产品信息",
    viewpoint: "原文信息",
  };
  return labels[type] || "原文信息";
}

function stripSourceNoise(value = "") {
  return String(value || "")
    .replace(/\s*\/\s*query=.*$/iu, "")
    .replace(/\s*\/\s*intent=.*$/iu, "")
    .replace(/\s*\/\s*path=.*$/iu, "")
    .replace(/^Skip to Main Content\s*/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function sourceSentences(value = "") {
  const text = stripSourceNoise(value);
  if (!text) return [];
  return text
    .split(/(?<=[.!?。！？])\s+|\n+/u)
    .map(stripSourceNoise)
    .filter((item) => item.length >= 28)
    .filter((item) => !/Navigation Menu|Sign in|Search or jump to|Saved searches|Provide feedback|Appearance settings|Twitter|Facebook|LinkedIn|Email Updates/iu.test(item))
    .slice(0, 20);
}

function translatedSourcePoint(value = "", type = "") {
  const text = stripSourceNoise(value);
  if (!text) return "";
  const known = translateKnownRawExcerpt(text, type);
  if (known) return known;
  const rules = [
    [/Procurement teams.*vendor selection.*Request for Quotation/iu, "原文指出采购团队在供应商选择和 RFQ 流程中面临管理压力。"],
    [/Buyers spend significant time navigating multiple Enterprise Resource Planning systems/iu, "原文指出采购人员需要在多个 ERP 系统和外部数据源之间切换。"],
    [/consolidate supplier information.*validate compliance requirements.*compare costs/iu, "原文指出采购人员要合并供应商信息、验证合规要求，并比较不同供应商成本。"],
    [/fragmentation causes delays.*manual errors.*missed opportunities/iu, "原文把当前问题描述为系统碎片化带来的延迟、人工错误和成本优化机会流失。"],
    [/Smart Procurement Assistant.*automates procurement workflows.*reduce cycle times.*compliance validation/iu, "AWS 方案中的 Smart Procurement Assistant 用于自动化采购流程、缩短周期，并进行实时合规验证。"],
    [/compliance validation, supplier recommendation, financial analysis, and RFQ management/iu, "AgentCore 与 Strands Agents 被用于合规验证、供应商推荐、财务分析和 RFQ 管理。"],
    [/Amazon Bedrock AgentCore provides a fully managed infrastructure/iu, "Amazon Bedrock AgentCore 提供托管基础设施，用于会话处理、状态管理和 Agent 运行。"],
    [/Amazon Bedrock does not use customer data and prompts to train/iu, "原文强调 Amazon Bedrock 不使用客户数据和提示来训练或改进基础模型。"],
    [/integrating SAP enterprise data with external vendor compliance ratings/iu, "SPA 方案把 SAP 企业数据与外部供应商合规评级连接起来。"],
    [/Oracle E-Business Suite|Oracle JD Edwards|Oracle PeopleSoft|Oracle Fusion Cloud ERP/iu, "原文称该架构可扩展到 Oracle E-Business Suite、JD Edwards、PeopleSoft、Oracle Fusion Cloud ERP、Salesforce、Snowflake 等系统。"],
    [/directly create Requests for Quotation.*same interface/iu, "采购人员可在同一对话界面中创建 RFQ，减少系统切换。"],
    [/eight specialized tools/iu, "方案包含 8 个专用工具，覆盖数据结构查询、SQL 查询、财务分析、质量指标、合规验证、RFQ 校验、RFQ 创建和数据可视化。"],
    [/RFQ Creation Tool.*SAP systems through OData/iu, "RFQ 创建工具通过 OData 调用 SAP API，在 SAP 系统中创建询价请求。"],
    [/accelerates decision-making.*reducing procurement cycle times/iu, "原文把业务结果描述为缩短采购周期、提升供应商评估和支出可见性。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  if (match) return match[1];
  if (hasCjk(text)) return short(text, 220);
  return "";
}

function genericRawCorePoints(raw) {
  const points = [];
  const seed = raw.evidenceSeed || {};

  const caseDetails = [
    ...arrayField(seed, "case_details"),
    ...raw.keyExcerpts.filter((item) => item.type === "case_detail").map((item) => item.text),
  ].map((item) => translateKnownRawExcerpt(item, "case_detail")).filter(Boolean);
  points.push(...caseDetails);

  const workflowClues = [
    ...arrayField(seed, "workflow_changes"),
    ...raw.keyExcerpts.filter((item) => item.type === "workflow_change").map((item) => item.text),
  ].map((item) => translateKnownRawExcerpt(item, "workflow_change")).filter(Boolean);
  points.push(...workflowClues);

  const companyActions = [
    ...arrayField(seed, "company_actions"),
    ...raw.keyExcerpts.filter((item) => item.type === "company_action" || item.type === "funding").map((item) => item.text),
  ].map((item) => translateKnownRawExcerpt(item, "company_action")).filter(Boolean);
  points.push(...companyActions);

  const excerptPoints = raw.keyExcerpts
    .map((item) => translatedSourcePoint(item.text, item.type))
    .filter(Boolean);
  points.push(...excerptPoints);

  const sentencePoints = sourceSentences(raw.fullText)
    .map((item) => translatedSourcePoint(item))
    .filter(Boolean);
  points.push(...sentencePoints);

  return [...new Set(points)]
    .filter((item) => item && !isMechanicalFrontstageText(item))
    .slice(0, 6);
}

function buildOriginalHighlights(raw, rawDisplayTitle = "", sourceUrl = "", existing = []) {
  const specific = [
    ...procurementUseCaseHighlights(raw.fullText),
    ...archestraHighlights(raw.fullText),
  ];
  if (specific.length) return uniqueNonRepeatingLines(specific, existing, 8);
  const translated = raw.keyExcerpts
    .map((item) => translateKnownRawExcerpt(item.text, item.type))
    .filter(Boolean);
  const candidates = [...new Set([...translated, ...genericRawCorePoints(raw)])]
    .filter((item) => item && !isMechanicalFrontstageText(item) && !/原题为/u.test(item))
    .filter((item) => !textRepeatsAny(item, existing));
  // Fallback: if no translated highlights, use raw excerpt text directly
  if (!candidates.length) {
    const rawFallback = raw.keyExcerpts
      .map((item) => stripSourceNoise(item.text))
      .filter(Boolean)
      .filter((item) => isSubstantiveSourceFragment(item))
      .filter((item) => !textRepeatsAny(item, existing));
    candidates.push(...rawFallback);
  }
  return uniqueNonRepeatingLines(candidates, existing, 8);
}

function sourceTextFragment(raw, rawDisplayTitle = "") {
  const candidates = [
    ...raw.keyExcerpts.map((item) => item.text),
    ...sourceSentences(raw.fullText),
    raw.visibleFragment,
  ]
    .map(stripSourceNoise)
    .filter(Boolean)
    .filter((item) => !isMechanicalFrontstageText(item))
    .filter(isSubstantiveSourceFragment)
    .filter((item) => !textRepeatsAny(item, [rawDisplayTitle], 0.9))
    .filter((item) => !/^Back to Articles\b|^More from this author\b|^Community\b/iu.test(item));
  return short(candidates[0] || "", 260);
}

function buildSourceExcerpt(raw, highlights = [], rawDisplayTitle = "") {
  const rawExcerpt = raw.keyExcerpts
    .map((item) => translatedSourcePoint(item.text, item.type))
    .find((item) => item && !/原题为/u.test(item) && isSubstantiveSourceFragment(item));
  if (rawExcerpt) return rawExcerpt;
  const sentenceExcerpt = sourceSentences(raw.fullText)
    .map((item) => translatedSourcePoint(item))
    .find((item) => item && !/原题为/u.test(item) && isSubstantiveSourceFragment(item));
  if (sentenceExcerpt) return sentenceExcerpt;
  const visible = publicVisibleFragment(raw.visibleFragment);
  if (isSubstantiveSourceFragment(visible)) return visible;
  const highlightExcerpt = highlights.find((item) => hasCjk(item) && !/^原始来源|本地 Raw\/Pool/u.test(item) && !/原题为/u.test(item) && isSubstantiveSourceFragment(item));
  if (highlightExcerpt) return highlightExcerpt;
  return sourceTextFragment(raw, rawDisplayTitle);
}

function sourceValueFromEvidence(category, highlights = [], rawDisplayTitle = "", existing = []) {
  if (category === "funding") {
    return "这条融资信号可用于判断资金流向、投资人押注方向，以及公司后续产品或销售扩张节奏。";
  }
  if (category === "case") {
    return "这条案例信号可用于观察 AI 能力是否进入真实客户流程，以及效果指标是否足以支撑采购。";
  }
  if (category === "product-service") {
    return "这条产品信号可用于判断能力进入具体使用场景的方式，以及它是否改变现有工作流或交付成本。";
  }
  if (/funding|raises|series|seed|融资/iu.test(rawDisplayTitle)) {
    return "这条融资信号可用于判断资金流向、产品方向和赛道竞争。";
  }
  return "这条信号提供了一个可核验的业务场景事实。";
}

function fallbackSourcePoints(rawDisplayTitle = "", sourceUrl = "", rawRef = "") {
  const title = frontstageChineseTitle(rawDisplayTitle, sourceUrl);
  const points = [];
  if (/procurement guide|采购指南|contracts.*pricing/iu.test(rawDisplayTitle)) {
    points.push("原始来源主题集中在企业 AI 采购中的合同、定价和采购边界。");
  } else if (/gemini.*spark|智能体 Spark/iu.test(rawDisplayTitle)) {
    points.push("原始来源主题是 Google Gemini AI 智能体 Spark 的上手体验，重点在能力提升和体验落差。");
  } else if (title) {
    points.push(`原始来源标题：${title}。`);
  }
  if (sourceUrl) points.push(`原始来源链接：${sourceUrl}`);
  if (rawRef) points.push(`本地 Raw/Pool 要点缺失：需恢复 ${rawRef} 后补齐核心数据或案例。`);
  return points.filter(Boolean).slice(0, 3);
}

function isLargeVendorText(value = "") {
  return /\b(Google|Microsoft|Anthropic|OpenAI|NVIDIA|Nvidia|Oracle|AWS|Amazon|Meta|Apple|IBM|Salesforce|DeepMind)\b|谷歌|微软|英伟达|亚马逊/iu.test(
    String(value || "")
  );
}

const largeVendorPatterns = [
  ["anthropic", /\bAnthropic\b|\bClaude\b/iu],
  ["google", /\bGoogle\b|GoogleCloudPlatform|\bDeepMind\b|\bGemini\b|\bGoogle\s*Colab\b|\bGoogle\s*Cloud\b/iu],
  ["microsoft", /\bMicrosoft\b|\bCopilot\b/iu],
  ["nvidia", /\bNVIDIA\b|\bNvidia\b/iu],
  ["openai", /\bOpenAI\b|\bChatGPT\b/iu],
  ["github", /\bGitHub\b/iu],
  ["amazon", /\bAWS\b|\bAmazon\b|\bAmazon\s+Bedrock\b/iu],
  ["meta", /\bMeta\b|\bLlama\b/iu],
  ["apple", /\bApple\b/iu],
  ["oracle", /\bOracle\b/iu],
  ["ibm", /\bIBM\b/iu],
  ["salesforce", /\bSalesforce\b/iu],
  ["alibaba", /\bAlibaba\b|\bQwen\b|\bTongyi\b|阿里巴巴|通义千问/iu],
];

function largeVendorKeyFromText(value = "") {
  const text = String(value || "");
  const match = largeVendorPatterns.find(([, pattern]) => pattern.test(text));
  return match?.[0] || "";
}

function largeVendorKeyForCard(card = {}) {
  return largeVendorKeyFromText([
    card.title,
    card.originalTitle,
    card.subject,
    card.sourceName,
    card.sourceUrl,
  ].join(" "));
}

function isLargeVendorCard(card = {}) {
  return Boolean(largeVendorKeyForCard(card));
}

function sourceLevelScore(level = "") {
  if (level === "S") return 12;
  if (level === "A") return 8;
  if (level === "B") return 4;
  return 0;
}

function frontstageImportanceScore(card = {}) {
  const importance = Number(card.importanceScore) || 0;
  const tags = new Set(card.flatTags || []);
  let score = importance * 100 + sourceLevelScore(card.sourceLevel);
  if (card.category === "funding") score += 24;
  if (card.category === "case") score += 18;
  if (card.category === "product-service") score += 8;
  if (tags.has("evidence-funding")) score += 14;
  if (tags.has("evidence-customer-adoption")) score += 12;
  if (tags.has("evidence-customer-metric")) score += 12;
  if (tags.has("evidence-acquisition")) score += 10;
  if (tags.has("evidence-partnership-integration")) score += 8;
  if (tags.has("evidence-pricing-cost")) score += 6;
  if (tags.has("evidence-product-launch")) score += 6;
  if (tags.has("customer-enterprise")) score += 8;
  if (/vertical|procurement|health|finance|manufacturing|retail|legal|case|deployment|客户|案例|部署|采购/iu.test([
    card.title,
    card.translatedFact,
    ...(card.originalHighlights || []),
  ].join(" "))) {
    score += 12;
  }
  if (card.largeVendor) score -= 30;
  return score;
}

function frontstageText(card = {}) {
  return [
    card.title,
    card.originalTitle,
    card.subject,
    card.sourceName,
    card.sourceUrl,
    card.translatedFact,
    card.summary,
    card.visibleFragment,
    ...(card.originalHighlights || []),
    ...(card.flatTags || []),
  ].filter(Boolean).join(" ");
}

function isIsoDateOnlyFragment(value = "") {
  const text = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/u.test(text) && text.length < 45;
}

function isSubstantiveSourceFragment(value = "") {
  const text = stripSourceNoise(value).replace(/\s+/gu, " ").trim();
  if (text.length < 45) return false;
  if (isIsoDateOnlyFragment(text)) return false;
  if (/^https?:\/\//iu.test(text)) return false;
  if (!/[A-Za-z\u4e00-\u9fff]/u.test(text)) return false;
  return /AI|agent|LLM|Gemini|Claude|OpenAI|Google|Nvidia|IBM|enterprise|customer|workflow|model|funding|raises|seed|Series|cloud|security|police|court|retailer|inference|deployment|QAT|融资|客户|部署|监管|法院|警察|模型|产品|企业|资金|美元|\$|\d/iu.test(text);
}

function frontstageEvidenceScore(card = {}) {
  let score = sourceLevelScore(card.sourceLevel);
  if (isSubstantiveSourceFragment(card.translatedFact)) score += 28;
  if ((card.originalHighlights || []).some(isSubstantiveSourceFragment)) score += 22;
  if (isSubstantiveSourceFragment(card.visibleFragment)) score += 16;
  if (card.sourceUrl) score += 8;
  if (card.publishedAt) score += 4;
  return score;
}

function businessImpactScore(card = {}) {
  const text = frontstageText(card);
  let score = 0;
  if (card.category === "funding") score += 24;
  if (card.category === "case") score += 20;
  if (card.category === "product-service") score += 10;
  if (/\$ ?\d|\d+ ?(?:m|million|b|billion)\b|亿美元|百万|融资|seed|Series|funding|raises|commitment/iu.test(text)) score += 22;
  if (/police|court|legal|law|regulat|government|administration|equity stake|security|Lockdown|prompt injection|司法|法院|警察|监管|政府|合规|安全/iu.test(text)) score += 22;
  if (/equity stake|state stake|public stake|Trump|national interest|入股|持股|股权|特朗普|公共利益|国家利益/iu.test(text)) score += 75;
  if (/customer|retailer|enterprise|workflow|procurement|deployment|case|joint customers|客户|企业|流程|采购|部署|门店|零售/iu.test(text)) score += 18;
  if (/partnership|integration|collaboration|AWS|cloud|platform|inference|edge|QAT|model|Agent Starter|合作|集成|云|推理|边缘|模型/iu.test(text)) score += 12;
  if (/agent|agents|automation|AI appliance|support automation|工作流|自动化/iu.test(text)) score += 8;
  return score;
}

function genericFrontstagePenalty(card = {}) {
  const text = frontstageText(card);
  let penalty = 0;
  if (isGenericFrontstageCandidate(card)) penalty += 55;
  if (/top ai pre-seed investors|pre-seed investors|ranked by funding|monetizing ai agents|release notes agent|complete guide|market report|use cases|startup ideas|list|榜单|指南|报告|清单/iu.test(text)) penalty += 28;
  if (!card.translatedFact && !(card.originalHighlights || []).some(isSubstantiveSourceFragment)) penalty += 18;
  return penalty;
}

function frontstageEditorialScore(card = {}) {
  return frontstageImportanceScore(card) + frontstageEvidenceScore(card) + businessImpactScore(card) - genericFrontstagePenalty(card);
}

function frontstageSelectionReasons(card = {}) {
  const text = frontstageText(card);
  const reasons = [];
  if (/\$ ?\d|\d+ ?(?:m|million|b|billion)\b|亿美元|百万|融资|seed|Series|funding|raises|commitment/iu.test(text)) {
    reasons.push("涉及资金流向、预算规模或融资信号");
  }
  if (/equity stake|state stake|public stake|Trump|national interest|入股|持股|股权|特朗普|公共利益|国家利益/iu.test(text)) {
    reasons.push("涉及政府持股、公共利益或关键 AI 公司治理边界");
  }
  if (/police|court|legal|law|regulat|government|administration|equity stake|security|Lockdown|prompt injection|司法|法院|警察|监管|政府|合规|安全/iu.test(text)) {
    reasons.push("影响 AI 落地的治理、合规或安全边界");
  }
  if (/customer|retailer|enterprise|workflow|procurement|deployment|case|joint customers|客户|企业|流程|采购|部署|门店|零售/iu.test(text)) {
    reasons.push("能观察真实客户、业务流程或采购场景");
  }
  if (/partnership|integration|collaboration|AWS|cloud|platform|inference|edge|QAT|model|Agent Starter|合作|集成|云|推理|边缘|模型/iu.test(text)) {
    reasons.push("指向平台能力、交付成本或生态合作变化");
  }
  if (frontstageEvidenceScore(card) >= 40) reasons.push("有较完整的原文事实支撑");
  if (!reasons.length) reasons.push("提供了当天 AI 商业变化的可核验事实");
  return reasons.slice(0, 3);
}

function frontstageValueDescription(card = {}, reasons = []) {
  const reasonText = reasons.length ? reasons.join("；") : "提供了当天 AI 商业变化的可核验事实";
  return short(`值得关注：${reasonText}。`, 220);
}

function annotateFrontstageCandidate(card = {}) {
  const largeVendorKey = card.largeVendorKey || largeVendorKeyForCard(card);
  const annotated = {
    ...card,
    largeVendorKey,
    largeVendor: Boolean(largeVendorKey),
  };
  const evidenceScore = frontstageEvidenceScore(annotated);
  const rankScore = frontstageEditorialScore(annotated);
  const reasons = frontstageSelectionReasons(annotated);
  const qualityWarnings = [];
  if (isGenericFrontstageCandidate(annotated)) qualityWarnings.push("资料型、榜单型或工具型素材，默认不作为 Top 10 优先项");
  if (evidenceScore < 35) qualityWarnings.push("原文事实支撑偏弱，需优先补充 Raw/Pool 证据");
  if (!isSubstantiveSourceFragment(annotated.visibleFragment)) qualityWarnings.push("可见原文片段不足，已降权处理");
  return {
    ...annotated,
    frontstageRankScore: rankScore,
    frontstageEditorialScore: rankScore,
    frontstageEvidenceScore: evidenceScore,
    frontstageSelectionReasons: reasons,
    frontstageValueDescription: frontstageValueDescription(annotated, reasons),
    frontstageQualityWarnings: qualityWarnings,
    frontstageGenericCandidate: isGenericFrontstageCandidate(annotated),
    fromCorePool: (annotated.poolRoutes || []).includes("core_pool"),
  };
}

function isGenericFrontstageCandidate(card = {}) {
  const text = [
    card.title,
    card.rawTitle,
    card.sourceUrl,
    card.sourceName,
    card.source,
  ].filter(Boolean).join(" ");
  if (/\.pdf(?:$|[?#])|docs\.github\.com|pypi\.org\/project|aws\.amazon\.com\/marketplace/iu.test(text)) return true;
  if (/startup ideas|buying criteria|adoption 2026|funding record|ranked by funding|top ai pre-seed investors|pre-seed investors|top ai agent startups|ai agent marketplace|marketplaces landscape|procurement guide|procurement playbook|implementation report|market report|complete guide|framework for investors|vertical report|fastest growing|companies\s*&\s*verified leads|complete batch breakdown|\btop\s+\d+\b|\buse cases\b|field guide|glossary|open source toolkit|ai citations\s*&\s*visibility|about github copilot cloud agent|monetizing ai agents|release notes agent/iu.test(text)) return true;
  return card.category !== "funding" && /^investing in\b/iu.test(String(card.title || ""));
}

function buildDailyFrontstageSelection(cards = [], limit = 10, largeVendorTotalLimit = 3, largeVendorPerCompanyLimit = 1) {
  const byDate = new Map();
  for (const card of cards) {
    if (!card.date) continue;
    const list = byDate.get(card.date) || [];
    list.push(card);
    byDate.set(card.date, list);
  }
  const selected = [];
  const reports = [];
  for (const [date, items] of byDate.entries()) {
    let datePicked = 0;
    let largeVendorTotal = 0;
    const largeVendorCounts = new Map();
    const annotated = items.map(annotateFrontstageCandidate);
    const coreCandidates = annotated.filter((card) => card.fromCorePool);
    const preferred = annotated
      .filter((card) => card.fromCorePool)
      .filter((card) => !card.frontstageGenericCandidate && card.frontstageEvidenceScore >= 30)
      .sort((a, b) => b.frontstageRankScore - a.frontstageRankScore || a.id.localeCompare(b.id));
    const preferredIds = new Set(preferred.map((card) => card.id));
    const fallback = coreCandidates
      .filter((card) => !preferredIds.has(card.id))
      .sort((a, b) => b.frontstageRankScore - a.frontstageRankScore || a.id.localeCompare(b.id));
    const ranked = [...preferred, ...fallback];
    const rejected = [];
    for (const card of ranked) {
      if (datePicked >= limit) break;
      if (card.largeVendorKey) {
        const vendorCount = largeVendorCounts.get(card.largeVendorKey) || 0;
        if (largeVendorTotal >= largeVendorTotalLimit) {
          rejected.push({ id: card.id, reason: "large-company total cap" });
          continue;
        }
        if (vendorCount >= largeVendorPerCompanyLimit) {
          rejected.push({ id: card.id, reason: `same large-company cap: ${card.largeVendorKey}` });
          continue;
        }
        largeVendorTotal += 1;
        largeVendorCounts.set(card.largeVendorKey, vendorCount + 1);
      }
      const selectionTier = preferredIds.has(card.id) ? "editorial" : "supply-fill";
      selected.push({
        ...card,
        summary: card.frontstageValueDescription,
        frontstageSelectionTier: selectionTier,
        frontstageSupplyFill: selectionTier === "supply-fill",
      });
      datePicked += 1;
    }
    reports.push({
      date,
      target: limit,
      candidateCount: items.length,
      coreCandidateCount: coreCandidates.length,
      qualifiedCount: preferred.length,
      selectedCount: datePicked,
      supplyConstrained: preferred.length < limit,
      largeCompanySelectedCount: largeVendorTotal,
      rejectedByQuota: rejected.slice(0, 12),
    });
  }
  return {
    cards: selected.sort((a, b) => dateValue(b.date) - dateValue(a.date) || b.frontstageRankScore - a.frontstageRankScore || a.id.localeCompare(b.id)),
    reports: reports.sort((a, b) => dateValue(b.date) - dateValue(a.date)),
  };
}

function splitCsv(value = "") {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function poolCandidateSectionsForDate(date = "") {
  const file = path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`);
  if (!date || !fs.existsSync(file)) return [];
  return read(file)
    .split(/\n(?=##\s+P-\d+)/u)
    .filter((section) => /^##\s+P-\d+/mu.test(section));
}

function poolValue(section = "", key = "") {
  return section.match(new RegExp(`^- ${key}:\\s*(.+)$`, "mu"))?.[1]?.trim().replace(/^`|`$/gu, "") || "";
}

function poolRef(section = "") {
  return section.match(/^##\s+(P-\d+)/mu)?.[1] || "";
}

function poolTitle(section = "") {
  const heading = section.match(/^##\s+P-\d+\s*[｜|:：~\-–—]*(.+)$/mu)?.[1] || "";
  return heading.trim();
}

function poolCandidateCategory(section = "") {
  const text = [
    poolValue(section, "importance_type"),
    poolValue(section, "evidence_object_type"),
    poolValue(section, "usable_for"),
    poolValue(section, "key_excerpts"),
  ].join(" ");
  if (/funding|capital|融资|投资/iu.test(text)) return "funding";
  if (/product|technical|release|model|infrastructure|产品|模型|发布|基础设施/iu.test(text)) return "product-service";
  return "case";
}

function corePoolCandidateFact(section = "", title = "", sourceUrl = "") {
  const keyExcerpts = parseJsonLine(section, "key_excerpts") || [];
  const excerpt = Array.isArray(keyExcerpts)
    ? keyExcerpts.map((item) => translatedSourcePoint(item?.text || "", item?.type || "")).find(Boolean)
    : "";
  return short(
    excerpt
      || chineseFactFromSource(title, sourceUrl)
      || frontstageChineseTitle(title, sourceUrl)
      || title,
    320
  );
}

function frontstageManifestForDate(date = "") {
  const file = path.join(root, "agent-workflow", "reports", `${date}-frontstage-manifest.json`);
  if (!date || !fs.existsSync(file)) return {};
  try {
    return JSON.parse(read(file));
  } catch {
    return {};
  }
}

function corePoolNotPromotedMap(date = "") {
  const manifest = frontstageManifestForDate(date);
  const rows = Array.isArray(manifest.core_pool_not_promoted) ? manifest.core_pool_not_promoted : [];
  return new Map(rows.map((item) => [item.pool_ref, item]));
}

function publicPromotionIssue(issue = "") {
  if (/stale_source_date/iu.test(issue)) return "来源时间过旧，适合保留为背景证据";
  if (/generic_report_or_list_not_fact_signal/iu.test(issue)) return "榜单或报告类材料，不是单一事实信号";
  if (/text_indicates_index_only|index_only|index_or_directory_url/iu.test(issue)) return "目录或索引页，不适合直接成卡";
  if (/user_feedback_not_fact_signal/iu.test(issue)) return "评论或反馈材料不足以支撑正式事实卡";
  if (/funding_not_single_company_round/iu.test(issue)) return "融资信息不是单一公司轮次事件";
  if (/missing_full_text|missing_source_url|incomplete_evidence_object/iu.test(issue)) return "原文证据不完整，需要补采";
  if (/duplicate_event_cluster/iu.test(issue)) return "与已成卡事件重复，保留为辅助证据";
  if (/auto_signal_spec_null/iu.test(issue)) return "未能生成稳定的正式卡片结构";
  return "证据边界不足，暂不晋级正式 Card";
}

function publicRepairSuggestion(issues = []) {
  const text = issues.join(" ");
  if (/stale_source_date/iu.test(text)) return "补充同一事件的近期来源；否则仅作为背景证据保留。";
  if (/generic_report_or_list_not_fact_signal|text_indicates_index_only|index_only|index_or_directory_url/iu.test(text)) {
    return "回到原始来源，找到有日期、主体、动作的单一公司事件后再晋级。";
  }
  if (/user_feedback_not_fact_signal/iu.test(text)) return "用原始报道、公司公告或一手材料替代评论/反馈证据。";
  if (/funding_not_single_company_round/iu.test(text)) return "补齐单一公司的融资金额、轮次、投资方和日期。";
  if (/missing_full_text|missing_source_url|incomplete_evidence_object/iu.test(text)) return "修复 Raw 采集，补齐原文链接、全文、摘录和哈希。";
  if (/duplicate_event_cluster/iu.test(text)) return "作为已成卡事件的辅助证据保留，不重复生成 Card。";
  return "复核证据边界，确认能形成产品、融资或案例事实后再晋级。";
}

function candidatePromotionCopy(promotion = {}) {
  const rawIssues = Array.isArray(promotion.issues) ? promotion.issues : [];
  const issueLabels = rawIssues.map(publicPromotionIssue);
  const reason = issueLabels.length ? [...new Set(issueLabels)].join("；") : "暂未晋级正式 Card";
  const repair = publicRepairSuggestion(rawIssues);
  return {
    reason,
    issues: issueLabels,
    repair,
    priority: promotion.promote_priority || "review",
  };
}

function buildCorePoolCandidateItems(cards = [], activeDate = "") {
  const cardsByUrl = new Map(cards.map((card) => [canonicalUrl(card.sourceUrl), card]).filter(([url]) => url));
  const notPromotedByRef = corePoolNotPromotedMap(activeDate);
  return poolCandidateSectionsForDate(activeDate)
    .filter((section) => splitCsv(poolValue(section, "pool_routes")).includes("core_pool"))
    .map((section) => {
      const ref = poolRef(section);
      const sourceUrl = poolValue(section, "source_url");
      const card = cardsByUrl.get(canonicalUrl(sourceUrl));
      if (card) {
        return {
          ...card,
          id: `POOL-${activeDate}-${ref}`,
          linkedCardId: card.id,
          type: "core_pool_candidate",
          sourceRef: ref,
          promotionStatus: "promoted_to_signal_card",
          frontstageSelectionTier: card.frontstageSelectionTier || "core-pool",
        };
      }
      const promotion = candidatePromotionCopy(notPromotedByRef.get(ref) || {});
      const rawTitle = poolTitle(section);
      const title = frontstageChineseTitle(rawTitle, sourceUrl) || translateEnglishTitle(rawTitle, sourceUrl) || rawTitle;
      const category = poolCandidateCategory(section);
      const fact = corePoolCandidateFact(section, rawTitle, sourceUrl);
      const importanceScore = Number(poolValue(section, "importance_score")) || 0;
      const score = Number(poolValue(section, "score")) || 0;
      return {
        id: `POOL-${activeDate}-${ref}`,
        type: "core_pool_candidate",
        category,
        categoryLabel: categoryLabels[category] || category,
        title,
        originalTitle: rawTitle === title ? "" : rawTitle,
        date: activeDate,
        subject: frontstageCandidateSubject(sourceUrl, rawTitle, title, poolValue(section, "source")),
        source: domain(sourceUrl) || poolValue(section, "source"),
        sourceName: domain(sourceUrl) || poolValue(section, "source"),
        sourceUrl,
        sourceLevel: poolValue(section, "source_level"),
        importanceScore,
        poolRoutes: splitCsv(poolValue(section, "pool_routes")),
        publishedAt: "",
        tags: {},
        flatTags: [],
        displayTags: sanitizeDisplayTags([{ id: category, label: categoryLabels[category] || category }]),
        summary: fact,
        translatedFact: fact,
        originalHighlights: [],
        visibleFragment: fact,
        sourceLinks: [sourceUrl].filter(Boolean),
        status: "pooled",
        assetLevel: "core_pool",
        promotionStatus: "candidate_only",
        notPromotedReason: promotion.reason,
        notPromotedIssues: promotion.issues,
        repairSuggestion: promotion.repair,
        promotePriority: promotion.priority,
        evidenceGate: poolValue(section, "evidence_level") || "core_evidence_candidate",
        stage: "",
        evidence: "",
        track: "",
        largeVendorKey: largeVendorKeyForCard({ title: rawTitle, sourceUrl }),
        largeVendor: Boolean(largeVendorKeyForCard({ title: rawTitle, sourceUrl })),
        frontstageRankScore: score * 100 + importanceScore * 10,
        frontstageEditorialScore: score * 100 + importanceScore * 10,
        frontstageEvidenceScore: Number(poolValue(section, "readability_score")) || 0,
        frontstageSelectionReasons: ["进入当天 Core Pool 候选池", "保留为完整证据池材料"],
        frontstageValueDescription: "该条目进入当天 Core Pool，用于完整证据回看、关系图和趋势候选分析；不代表 Top10 编辑精选。",
        frontstageQualityWarnings: [],
        frontstageGenericCandidate: false,
        fromCorePool: true,
        sourceRef: ref,
      };
    })
    .sort((a, b) => (Number(b.frontstageRankScore) || 0) - (Number(a.frontstageRankScore) || 0) || String(a.sourceRef || a.id).localeCompare(String(b.sourceRef || b.id)));
}

function cardFromFile(file, category) {
  const text = read(file);
  const fm = frontmatter(text);
  if (!fm) return null;

  const type = scalar(fm, "type");
  if (type !== "signal_card") return null;

  const tags = formalTags(fm);
  const rawArchive = nestedScalar(fm, "primary_raw", "raw_archive");
  const rawJson = nestedScalar(fm, "primary_raw", "raw_json");
  const rawRef = nestedScalar(fm, "primary_raw", "raw_ref") || arrayValue(fm, "raw_refs")[0] || "";
  const rawTitleFromArchive = rawCandidateTitle(rawArchive, rawRef);
  const primarySourceUrl = nestedScalar(fm, "primary_raw", "source_url")
    || scalar(fm, "source_url")
    || nestedList(fm, "frontend", "sourceLinks")[0]
    || "";
  const poolRefs = arrayValue(fm, "pool_refs");
  const raw = mergeEvidence(readRawEvidence(rawJson, rawArchive, primarySourceUrl), readPoolEvidence(scalar(fm, "date"), poolRefs[0], primarySourceUrl));
  const rawTitle = recoverCompleteTitleFromFullText(rawTitleFromArchive || raw.rawTitle || "", raw.fullText);
  const sourceUrl = primarySourceUrl || raw.sourceUrl;
  const explicitSourceName = scalar(fm, "source_name") || raw.sourceName || "";
  const sourceName = explicitSourceName && !isDiscoveryLabel(explicitSourceName)
    ? explicitSourceName
    : domain(sourceUrl) || explicitSourceName || "未标注来源";

  const sourceLevel = String(nestedScalar(fm, "primary_raw", "source_level") || scalar(fm, "source_level") || "").toUpperCase();
  const importanceScore = Number(nestedScalar(fm, "primary_raw", "importance_score") || scalar(fm, "importance_score") || 0) || 0;
  const explicitDisplayTitle = nestedScalar(fm, "frontend", "displayTitle") || scalar(fm, "title") || "";
  const rawDisplayTitle = frontstageTitle(rawTitle || explicitDisplayTitle || path.basename(file, ".md"), rawTitle);
  const title = frontstageChineseTitle(explicitDisplayTitle || rawDisplayTitle, sourceUrl);
  const translatedFact = chineseFactFromSource(rawDisplayTitle || title, sourceUrl);
  let originalHighlights = buildOriginalHighlights(raw, rawDisplayTitle, sourceUrl, [translatedFact]);
  if (!originalHighlights.length) originalHighlights = fallbackSourcePoints(rawDisplayTitle, sourceUrl, rawRef);
  const sourceFact = translatedFact || originalHighlights.find((item) => !/^关键数字|原始来源|本地 Raw\/Pool/u.test(item)) || "";
  originalHighlights = uniqueNonRepeatingLines(
    originalHighlights.filter((item) => !/^原始来源标题|原始来源链接|本地 Raw\/Pool/u.test(item)),
    [sourceFact, title],
    8
  );
  const sourceExcerpt = buildSourceExcerpt(raw, originalHighlights, rawDisplayTitle);
  const visibleFragment = sourceExcerpt && !textRepeatsAny(sourceExcerpt, [sourceFact, title, ...originalHighlights], 0.72)
    ? sourceExcerpt
    : "";
  const sourceValue = sourceValueFromEvidence(category, originalHighlights, rawDisplayTitle, [sourceFact, title]);

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
    sourceLevel,
    importanceScore,
    poolRoutes: nestedList(fm, "primary_raw", "pool_routes"),
    publishedAt: raw.publishedAt || scalar(fm, "published_at") || scalar(fm, "original_date") || "",
    tags,
    flatTags: allTags(tags),
    displayTags: displayTags(tags),
    summary: short(sourceValue || sourceFact, 260),
    translatedFact: short(sourceFact, 320),
    originalHighlights,
    visibleFragment,
    sourceLinks: [...new Set(sourceLinks)],
    status: scalar(fm, "status"),
    assetLevel: scalar(fm, "asset_level"),
    evidenceGate: scalar(fm, "evidence_gate"),
    stage: tags.stage?.find((tag) => !internalFrontstageTagIds.has(tag)) || "",
    evidence: tags.evidence?.[0] || "",
    largeVendorKey: scalar(fm, "largeVendorKey") || "",
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

function hasSourceFacingEvidence(card = {}) {
  return Boolean(
    card.translatedFact
      || (Array.isArray(card.originalHighlights) && card.originalHighlights.length)
      || card.visibleFragment
  );
}

function idSuffixForCard(card = {}) {
  const text = [
    card.category,
    card.sourceUrl,
    card.title,
    card.originalTitle,
  ].join(" ");
  const ascii = text
    .normalize("NFKD")
    .replace(/[^\w\s-]/gu, " ")
    .replace(/_/gu, " ")
    .trim()
    .toLowerCase()
    .split(/\s+/u)
    .filter((part) => part.length >= 2)
    .slice(0, 5)
    .join("-");
  return ascii || String(Math.abs(hashText(text))).slice(0, 6);
}

function hashText(value = "") {
  let hash = 0;
  for (const char of String(value)) {
    hash = (hash * 31 + char.codePointAt(0)) | 0;
  }
  return hash;
}

function ensureUniqueCardIds(items = []) {
  const totals = new Map();
  for (const item of items) {
    if (!item?.id) continue;
    totals.set(item.id, (totals.get(item.id) || 0) + 1);
  }

  const used = new Set();
  const seen = new Map();
  return items.map((item) => {
    if (!item?.id || totals.get(item.id) <= 1) {
      if (item?.id) used.add(item.id);
      return item;
    }

    const index = (seen.get(item.id) || 0) + 1;
    seen.set(item.id, index);
    if (index === 1 && !used.has(item.id)) {
      used.add(item.id);
      return item;
    }

    const base = `${item.id}-${idSuffixForCard(item)}`.slice(0, 96);
    let next = base;
    let counter = 2;
    while (used.has(next)) {
      next = `${base}-${counter}`;
      counter += 1;
    }
    used.add(next);
    return { ...item, id: next };
  });
}

function trendAssetFromFile(file, cards = []) {
  const text = read(file);
  const fm = frontmatter(text);
  if (!fm) return null;

  const type = scalar(fm, "type");
  if (type !== "trend_candidate" && type !== "trend_card") return null;

  const rawTitle = scalar(fm, "title") || path.basename(file, ".md");
  const hypothesis = scalar(fm, "trend_hypothesis")
    || headingSection(text, "趋势候选")
    || headingSection(text, "趋势判断");
  const relationSummary = headingSection(text, "关系说明")
    || headingSection(text, "信号链")
    || headingSection(text, "相关材料");
  const frontendWhy = nestedScalar(fm, "frontend", "whyForming");
  const frontendRelation = nestedScalar(fm, "frontend", "relationSummary");
  const methodChange = headingSection(text, "技术路线 / 方法变化");
  const boundary = scalar(fm, "boundary_notes")
    || headingSection(text, "风险边界与证据缺口");
  const nextObservation = scalar(fm, "next_observation")
    || headingSection(text, "下一步观察");
  const sourceTypes = arrayValue(fm, "source_types").filter((item) => !isOpinionSourceType(item));
  const relatedSignals = arrayValue(fm, "related_signal_cards")
    .concat(arrayValue(fm, "related_change_cards"))
    .concat(arrayValue(fm, "related_case_cards"));
  const relatedIds = new Set(relatedSignals.filter(Boolean));
  const relatedCards = cards.filter((card) => relatedIds.has(card.id));
  const tags = formalTags(fm);
  const gate = scalar(fm, "trend_evidence_gate");
  const relatedChangeCount = relatedSignals.length;
  const sourceTypeCount = sourceTypes.length;
  const frontTitle = trendFrontstageTitle(rawTitle, tags);
  const publicTags = frontstageTags(tags);
  const frontDescription = trendFrontstageDescription({
    title: frontTitle,
    rawTitle,
    type,
    hypothesis,
    relationSummary,
    frontendWhy,
    frontendRelation,
    methodChange,
    relatedChangeCount,
    sourceTypeCount,
    relatedCards,
  });
  const frontBoundary = trendFrontstageBoundary(boundary);

  return {
    id: scalar(fm, "id") || path.basename(file, ".md"),
    type,
    title: frontTitle,
    date: scalar(fm, "date"),
    status: scalar(fm, "status"),
    assetLevel: scalar(fm, "asset_level"),
    trendStatus: scalar(fm, "trend_status"),
    stageLabel: type === "trend_candidate" ? "正在形成" : gate === "threshold_passed" ? "证据较强" : "继续观察",
    hypothesis: short(frontDescription || hypothesis || relationSummary, 360),
    relationSummary: short(frontDescription || relationSummary || hypothesis, 300),
    boundary: short(frontBoundary || boundary, 280),
    nextObservation: short(nextObservation, 260),
    sourceTypes,
    relatedSignals: [...new Set(relatedSignals)].filter(Boolean),
    tags: publicTags,
    displayTags: displayTags(publicTags),
  };
}

function isOpinionSourceType(value = "") {
  return /opinion|观点|觀點|builder/iu.test(String(value || ""));
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

function cleanTrendNarrative(value = "") {
  return String(value || "")
    .replace(/\s+/gu, " ")
    .replace(/、?前沿观点/gu, "")
    .replace(/builder\s*观点/giu, "")
    .replace(/^这条趋势正在形成，是因为/u, "")
    .replace(/共同指向一个变化[:：]/gu, "材料显示：")
    .replace(/信号指向同一个问题[:：]/gu, "材料显示：")
    .replace(/共同指向一个候选方向[:：]/gu, "材料显示：")
    .replace(/相关信号来自/gu, "材料来自")
    .replace(/暂按趋势候选管理。?/gu, "")
    .replace(/还处在候选阶段。?/gu, "")
    .replace(/当前材料来自 \d+ 条原文档案与 \d+ 张变化卡，/gu, "")
    .replace(/已经看到同一类客户、流程或技术路线反复出现，/gu, "")
    .replace(/但还需要更多客户采用、付费数据和反证材料。?/gu, "")
    .replace(/公开材料里还缺少/gu, "公开材料尚未披露")
    .replace(/[，,]\s*$/u, "。")
    .trim();
}

function trendFrontstageBoundary(value = "") {
  return cleanTrendNarrative(value)
    .replace(/当前仍缺少/gu, "公开材料尚未披露")
    .replace(/仍缺少/gu, "尚未披露")
    .replace(/目前仍缺少/gu, "公开材料尚未披露");
}

function trendEvidenceDescription(relatedCards = []) {
  const facts = relationshipFactsFromCards(relatedCards, 3);
  if (!facts.length) return "";
  return facts.join(" ");
}

function trendFrontstageDescription({
  title,
  rawTitle,
  type,
  hypothesis,
  relationSummary,
  frontendWhy,
  frontendRelation,
  methodChange,
  relatedChangeCount,
  sourceTypeCount,
  relatedCards,
}) {
  const evidenceText = trendEvidenceDescription(relatedCards);
  const cleanedFrontend = cleanTrendNarrative(frontendWhy || frontendRelation);
  if (cleanedFrontend) return cleanedFrontend;
  if (evidenceText) return evidenceText;
  if (/AI 编程进入预算和工程治理/u.test(title)) {
    return "AI Coding 材料开始出现团队采购、预算、权限、成本和交付质量等企业流程信息，讨论重点从个人代码生成扩展到工程团队如何管理和使用工具。";
  }
  if (/AI 治理开始从原则讨论/u.test(title)) {
    return "AI 治理材料开始把权限、日志、隔离、评测和责任边界写进产品与部署流程，治理不只出现在原则表述里，也出现在企业采购和系统接入要求里。";
  }
  if (/专业服务 AI 开始进入交付流程/u.test(title)) {
    return "专业服务 AI 材料开始描述 Agent 的执行范围、网络访问、密钥、日志和停机边界，说明产品卖点正在从内容辅助转向可控交付。";
  }
  const cleanedRelation = cleanTrendNarrative(relationSummary);
  if (cleanedRelation && !/当前材料来自/u.test(cleanedRelation)) return cleanedRelation;
  if (methodChange) return cleanTrendNarrative(methodChange);
  const cleanedHypothesis = cleanTrendNarrative(hypothesis);
  if (cleanedHypothesis && !/当前材料来自/u.test(cleanedHypothesis)) return cleanedHypothesis;
  const sourceText = sourceTypeCount ? `${sourceTypeCount} 类来源` : "公开材料";
  return `${title} 目前来自 ${sourceText}，可继续观察它是否出现在客户采用、产品发布、采购预算、交付流程或治理责任等事实材料中。`;
}

function buildTrendAssets(activeDate, cards = []) {
  const assets = uniqueById(
    trendAssetRoots
      .flatMap((dir) => walkMarkdown(dir).map((file) => trendAssetFromFile(file, cards)))
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
    for (const tag of card.flatTags.filter(isFrontstageDisplayTag)) counts.set(tag, (counts.get(tag) || 0) + 1);
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
    const last30 = categoryCards.filter((card) => daysBetween(activeDate, card.date) >= 0 && daysBetween(activeDate, card.date) <= 29);
    return {
      category,
      label,
      today: todayCards.length,
      last7: last7.length,
      last30: last30.length,
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
    any: ["function-sales", "scenario-sales-briefing", "function-procurement-bidding", "evidence-procurement", "evidence-pricing-cost"],
    titlePattern: /Adya|采购|合同|销售|收入|预算|议价|Vapi/u,
    summary: "这些材料把 AI 从产品试用带进采购、合同、销售和收入流程；共同关系是企业开始用预算、条款和收入责任来约束 AI 的商业化落地。",
    detailFocus: "内在关联：这些材料都指向同一条商业链路，AI 从产品试用进入采购预算、合同条款和收入流程。",
  },
  {
    id: "function-customer-service",
    title: "客服和语音 Agent 的共性，是先在客户接触点证明效率",
    direction: "客户体验",
    relation: ["客户体验", "行业 Agent", "效率指标"],
    any: ["function-customer-service", "track-ai-customer-service", "evidence-customer-adoption", "evidence-customer-metric", "evidence-product-launch"],
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
    any: ["evidence-product-launch", "evidence-partnership-integration", "evidence-acquisition"],
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

function cardSourceFact(card) {
  const candidates = [
    card.translatedFact,
    ...(card.originalHighlights || []),
    card.visibleFragment,
    card.summary,
    card.title,
  ]
    .map(cleanSourceFactText)
    .filter((item) => item && !isWeakSourceFact(item));
  return short(candidates[0] || cleanSourceFactText(card.title), 180);
}

function cleanSourceFactText(value = "") {
  return String(value || "")
    .replace(/\s+/gu, " ")
    .replace(/^可观察(?:真实客户、业务流程或结果指标|产品能力进入具体业务流程的方式|融资金额、资金用途或赛道线索)[:：]/u, "")
    .replace(/^[-•]\s*/u, "")
    .trim();
}

function isWeakSourceFact(value = "") {
  const text = String(value || "").trim();
  if (!text) return true;
  if (!hasCjk(text)) return true;
  if (/^##\s|raw_ref|raw_archive|raw_original_id|`01-SiteV2|本地 Raw|Raw\s*\/\s*Pool/u.test(text)) return true;
  if (/^关键数字|原文关键数字包括|原文信息：原文关键数字|融资信息：原文关键数字|公司动作：原文关键数字|案例信息：原文关键数字/u.test(text)) return true;
  if (/淘汰风险/u.test(text)) return true;
  if (text.length < 12) return true;
  return false;
}

function relationshipSubjects(items, limit = 3) {
  return countItems(items, (card) => {
    if (card.subject === "未标注主体" || isWeakSubject(card.subject)) return "";
    return card.subject;
  }).slice(0, limit).map((item) => item.label);
}

function relationshipFactsFromCards(items, limit = 3) {
  const facts = items
    .map(cardSourceFact)
    .filter(Boolean)
    .filter((item) => !/当日命中|主体包括|共同指向|内在关联|实质上|趋势候选|候选方向|Raw\s*\/\s*Pool/u.test(item));
  return [...new Set(facts)].slice(0, limit);
}

function relationshipTitleFromCards(spec, items) {
  const subjects = relationshipSubjects(items, 3);
  const subjectText = subjects.slice(0, 2).join("、");
  if (spec.id === "agent-workflow-enterprise") {
    return subjectText
      ? `${subjectText} 记录 Agent 进入采购、数据连接和企业流程`
      : "Agent 材料写清了企业流程里的实际任务";
  }
  if (spec.id === "agent-infra-boundary") {
    return subjectText
      ? `${subjectText} 记录工程工具链和运行边界`
      : "Agent 材料强调运行、隔离和工程环境";
  }
  if (spec.id === "sales-procurement-budget") {
    return subjectText
      ? `${subjectText} 记录 AI 进入采购、合同和收入流程`
      : "采购和收入材料出现 AI Agent 的执行位置";
  }
  if (spec.id === "function-customer-service") {
    return subjectText
      ? `${subjectText} 记录 AI 进入客户接触点`
      : "客服和语音 Agent 材料聚焦客户接触点";
  }
  if (spec.id === "ai-coding-engineering") {
    return subjectText
      ? `${subjectText} 记录 AI 编程工具链继续迭代`
      : "AI Coding 材料继续进入工程工具链";
  }
  if (spec.id === "product-launch-vs-adoption") {
    return subjectText
      ? `${subjectText} 同日出现在企业 AI 产品发布里`
      : "企业 AI 产品发布覆盖采购、开发工具和行业流程";
  }
  return subjectText || spec.title;
}

function relationshipSummaryFromCards(spec, items) {
  const facts = relationshipFactsFromCards(items, 3);
  if (facts.length) return facts.join(" ");
  return spec.summary || spec.detailFocus || spec.title;
}

function relationshipEvidenceMeta(items) {
  const subjects = relationshipSubjects(items, 3);
  return subjects.length ? `素材：${subjects.join(" / ")}` : "素材来自当日商业信号";
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
      const summary = relationshipSummaryFromCards(spec, todayItems);
      return {
        id: spec.id,
        title: relationshipTitleFromCards(spec, todayItems)
          .replaceAll("{date}", displayDate)
          .replaceAll("{count}", String(todayItems.length)),
        direction: spec.direction,
        relation: spec.relation,
        summary,
        evidenceMeta: relationshipEvidenceMeta(todayItems),
        detailFocus: summary,
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

function graphNodeId(kind, value = "") {
  return `${kind}:${String(value || "").replace(/\s+/gu, "-").slice(0, 80)}`;
}

function graphTagLabel(tag = "") {
  return tagDictionary.get(tag) || tag;
}

function isGraphOpinionLikeTag(tag = "") {
  return /opinion|builder|follow-builder|frontier-opinion|viewpoint/iu.test(String(tag || ""));
}

function graphTagsForCard(card) {
  const groups = ["track", "function", "scenario", "customer", "evidence"];
  const tags = groups
    .flatMap((group) => card.tags?.[group] || [])
    .filter((tag) => tag && isFrontstageDisplayTag(tag));
  return [...new Set(tags)].slice(0, 3);
}

function buildRelationshipGraph(cards, activeDate) {
  const todayCards = cards.filter((card) => card.date === activeDate && card.category !== "opinion");
  const nodes = new Map();
  const edges = new Map();

  function addNode(id, label, type, data = {}) {
    if (!label) return;
    const current = nodes.get(id) || { id, label, type, weight: 0, ...data };
    current.weight += data.weight || 1;
    nodes.set(id, current);
  }

  function addEdge(from, to, label, card) {
    if (!from || !to || from === to) return;
    const id = `${from}->${to}`;
    const current = edges.get(id) || { from, to, label, weight: 0, cardIds: [], titles: [] };
    current.weight += 1;
    if (card?.id && !current.cardIds.includes(card.id)) current.cardIds.push(card.id);
    if (card?.title && current.titles.length < 3 && !current.titles.includes(card.title)) current.titles.push(card.title);
    edges.set(id, current);
  }

  for (const card of todayCards) {
    const categoryLabel = card.categoryLabel || categoryLabels[card.category] || card.category;
    const subject = !isWeakSubject(card.subject) ? card.subject : card.sourceName || card.title;
    const categoryId = graphNodeId("category", categoryLabel);
    const subjectId = graphNodeId("subject", subject);
    addNode(categoryId, categoryLabel, "category", { category: card.category });
    addNode(subjectId, subject, "subject", { category: card.category, sourceName: card.sourceName });
    addEdge(categoryId, subjectId, categoryLabel, card);

    for (const tag of graphTagsForCard(card)) {
      const tagId = graphNodeId("signal", tag);
      addNode(tagId, graphTagLabel(tag), "signal", { tag });
      addEdge(subjectId, tagId, "关联", card);
    }
  }

  const sortedNodes = [...nodes.values()]
    .sort((a, b) => {
      const order = { category: 0, subject: 1, signal: 2 };
      return order[a.type] - order[b.type] || b.weight - a.weight || a.label.localeCompare(b.label);
    })
    .slice(0, 28);
  const allowed = new Set(sortedNodes.map((node) => node.id));
  return {
    date: activeDate,
    nodeCount: sortedNodes.length,
    edgeCount: edges.size,
    nodes: sortedNodes,
    edges: [...edges.values()]
      .filter((edge) => allowed.has(edge.from) && allowed.has(edge.to))
      .sort((a, b) => b.weight - a.weight || a.label.localeCompare(b.label))
      .slice(0, 40),
    clusters: buildRelationshipDirections(cards, activeDate).slice(0, 4),
  };
}

function buildTrendLinks(cards, activeDate, windowDays) {
  const inWindow = windowCards(cards, activeDate, windowDays);
  const groups = new Map();
  for (const card of inWindow) {
    for (const tag of card.flatTags.filter(isMeaningfulAssociationTag).filter(isFrontstageDisplayTag)) {
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

function graphIndexCard(card = {}) {
  return {
    id: card.id,
    date: card.date,
    type: card.type,
    category: card.category,
    categoryLabel: card.categoryLabel,
    title: card.title,
    subject: card.subject,
    sourceName: card.sourceName,
    sourceUrl: card.sourceUrl,
    sourceLevel: card.sourceLevel,
    importanceScore: card.importanceScore,
    rankScore: card.frontstageRankScore,
    evidenceScore: card.frontstageEvidenceScore,
    poolRoutes: card.poolRoutes || [],
    poolRefs: card.sourceRef ? [card.sourceRef] : [],
    linkedCardId: card.linkedCardId || "",
    status: card.linkedCardId || card.type === "signal_card" ? "signal_card" : card.status || "candidate",
    promotionStatus: card.promotionStatus || (card.linkedCardId ? "promoted_to_signal_card" : "candidate"),
    notPromotedReason: card.notPromotedReason || "",
    notPromotedIssues: card.notPromotedIssues || [],
    repairSuggestion: card.repairSuggestion || "",
    promotePriority: card.promotePriority || "",
    largeVendor: Boolean(card.largeVendor),
    largeVendorKey: card.largeVendorKey || "",
    tags: card.tags || {},
    flatTags: card.flatTags || [],
    displayTags: sanitizeDisplayTags(card.displayTags || []),
    fact: card.translatedFact || card.visibleFragment || card.summary || "",
    evidencePoints: uniqueNonRepeatingLines([
      ...(card.originalHighlights || []),
      card.visibleFragment,
    ], [card.translatedFact, card.summary, card.title], 6),
    value: card.frontstageValueDescription || card.summary || "",
    selectionReasons: card.frontstageSelectionReasons || [],
    qualityWarnings: card.frontstageQualityWarnings || [],
    fromCorePool: Boolean(card.fromCorePool || (card.poolRoutes || []).includes("core_pool")),
  };
}

function buildGraphObservationSeeds({ tagAssociations = [], relationshipDirections = [], trendLinks = [], activeDate = "" } = {}) {
  return [
    ...relationshipDirections.map((item) => ({
      id: `relationship:${item.id}`,
      type: "relationship_cluster",
      title: item.title,
      date: activeDate,
      signal: item.direction,
      evidenceCount: item.todayCount || item.supportingCards?.length || 0,
      windowCount: item.last30Count || item.last7Count || item.todayCount || 0,
      subjects: item.subjects || [],
      categories: item.categories || [],
      tags: item.tags || [],
      supportingCardIds: (item.supportingCards || []).map((card) => card.id),
      summary: item.summary || item.detailFocus || "",
      whyUseful: "Use this when looking for cross-card commercial relationships.",
    })),
    ...tagAssociations.map((item) => ({
      id: `tag:${item.object}`,
      type: "tag_association",
      title: item.label,
      date: activeDate,
      signal: item.object,
      evidenceCount: item.todayCount,
      windowCount: item.last30Count,
      subjects: item.subjects || [],
      categories: item.categories || [],
      coTags: item.coTags || [],
      summary: `${item.label} appears in ${item.todayCount} same-day cards and ${item.last30Count} cards in the 30-day window.`,
      whyUseful: "Use this when looking for repeated variables and co-occurring tags.",
    })),
    ...trendLinks.map((item) => ({
      id: `trend-link:${item.window}:${item.object}`,
      type: "trend_link",
      title: item.label,
      date: item.lastSeen || activeDate,
      signal: item.object,
      evidenceCount: item.cardCount,
      window: item.window,
      summary: `${item.label} has ${item.cardCount} linked cards in the ${item.window} window.`,
      whyUseful: "Use this when checking whether a repeated variable is becoming a trend candidate.",
    })),
  ].sort((a, b) => (Number(b.evidenceCount) || 0) - (Number(a.evidenceCount) || 0) || String(a.id).localeCompare(String(b.id)));
}

function buildIntelligenceGraphIndex(payload = {}) {
  const allCards = payload.cards || [];
  const activeDate = payload.meta?.activeDate || "";
  const todayCards = allCards.filter((card) => card.date === activeDate);
  const todayTop10 = (payload.frontstageCards || []).filter((card) => card.date === activeDate);
  const top10Ids = new Set(todayTop10.map((card) => card.id));
  const corePoolCandidates = payload.corePoolCandidates || [];
  const linkedCoreCount = corePoolCandidates.filter((card) => card.linkedCardId || card.type === "signal_card").length;
  const tagAssociations = payload.tagAssociations || [];
  const relationshipDirections = payload.relationshipDirections || [];
  const trendLinks = payload.trendLinks || [];

  return {
    meta: {
      version: "V3.3.2.1-intelligence-graph-index",
      generatedAt: payload.meta?.generatedAt || new Date().toISOString(),
      activeDate,
      purpose: "Stable machine-readable entry for Hermes Agent / data-officer analysis.",
      sourceDataset: "site/data/v3-data-observation-desk.json",
      updateRoute: "Generated by 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs and deployed with GitHub Pages.",
      publicUrlHint: "https://jerryfang2023-stack.github.io/AI-Radar/data/intelligence-graph-index.json",
    },
    agentContract: {
      intendedReader: "Hermes Agent data officer",
      scope: "AI business-signal intelligence graph analysis",
      useAllCorePool: true,
      top10IsPresentationOnly: true,
      excludedEvidence: ["follow-builders viewpoints", "opinion-only materials", "backend-only fields without source evidence"],
      recommendedOutputs: [
        "daily_high_value_relationships",
        "emerging_trend_candidates",
        "opportunity_gaps",
        "risk_boundaries",
        "candidate_cards_to_promote_or_repair",
      ],
    },
    summary: {
      activeDate,
      totalCards: allCards.length,
      todayCards: todayCards.length,
      todayTop10: todayTop10.length,
      corePoolCandidates: corePoolCandidates.filter((card) => card.date === activeDate).length,
      linkedCorePoolCards: linkedCoreCount,
      candidateOnlyCorePool: Math.max(corePoolCandidates.length - linkedCoreCount, 0),
      relationshipNodes: payload.relationshipGraph?.nodeCount || payload.relationshipGraph?.nodes?.length || 0,
      relationshipEdges: payload.relationshipGraph?.edgeCount || payload.relationshipGraph?.edges?.length || 0,
      relationshipClusters: relationshipDirections.length,
      tagAssociations: tagAssociations.length,
      trendLinks: trendLinks.length,
      trendCandidates: (payload.trendCandidates || []).length,
    },
    dailyLens: {
      top10CardIds: [...top10Ids],
      corePoolCardIds: corePoolCandidates.map((card) => card.linkedCardId || card.id),
      largeCompanyTop10: todayTop10
        .filter((card) => card.largeVendor)
        .map((card) => ({ id: card.id, vendor: card.largeVendorKey, title: card.title })),
      categoryStats: payload.stats || [],
    },
    cards: allCards.map(graphIndexCard),
    corePoolCandidates: corePoolCandidates.map(graphIndexCard),
    graph: {
      date: payload.relationshipGraph?.date || activeDate,
      nodes: payload.relationshipGraph?.nodes || [],
      edges: payload.relationshipGraph?.edges || [],
      clusters: payload.relationshipGraph?.clusters || [],
    },
    relationshipDirections,
    tagAssociations,
    trendSignals: {
      todayCandidates: payload.trendCandidates || [],
      recentCandidates: payload.recentTrendCandidates || [],
      historicalTrends: payload.historicalTrends || [],
      trendLinks,
    },
    observationSeeds: buildGraphObservationSeeds({
      tagAssociations,
      relationshipDirections,
      trendLinks,
      activeDate,
    }),
  };
}

const rawCards = [
  ...signalRoots.flatMap((rootItem) => walkMarkdown(rootItem.dir).map((file) => cardFromFile(file, rootItem.category))),
].filter(Boolean).sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.category.localeCompare(b.category));
const cards = ensureUniqueCardIds(dedupeFrontstageCards(rawCards).filter(hasSourceFacingEvidence))
  .map(annotateFrontstageCandidate)
  .sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.category.localeCompare(b.category));
const frontstageSelection = buildDailyFrontstageSelection(cards, 10, 4, 1);
const frontstageCards = frontstageSelection.cards;

const activeDate = cards.map((card) => card.date).filter(Boolean).sort().at(-1) || "";
const corePoolCandidates = buildCorePoolCandidateItems(cards, activeDate);
const trendAssets = buildTrendAssets(activeDate, cards);
const payload = {
  meta: {
    version: "V3.3.2.1-public-frontstage-polish",
    generatedAt: new Date().toISOString(),
    activeDate,
    source: "Signal Cards",
    tagPolicy: "formal_tags filtered by agent-workflow/product/tag-taxonomy.md",
    allowedTagCount: allowedTagIds.size,
  },
  categories: Object.entries(categoryLabels).map(([category, label]) => ({ category, label })),
  stats: buildStats(cards, activeDate),
  cards,
  frontstageCards,
  corePoolCandidates,
  frontstageSelection: frontstageSelection.reports,
  relationshipDirections: buildRelationshipDirections(cards, activeDate),
  relationshipGraph: buildRelationshipGraph(cards, activeDate),
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
fs.writeFileSync(intelligenceGraphIndexFile, JSON.stringify(buildIntelligenceGraphIndex(payload), null, 2), "utf8");
console.log(`Wrote ${rel(outputFile)} with ${cards.length} cards.`);
console.log(`Wrote ${rel(intelligenceGraphIndexFile)} for Hermes Agent.`);
