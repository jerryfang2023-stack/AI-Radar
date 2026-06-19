#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readTagTaxonomy } from "../../../agent-workflow/tools/tag-taxonomy-utils.mjs";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const outputFile = path.join(siteDataDir, "v3-data-observation-desk.json");
const intelligenceGraphIndexFile = path.join(siteDataDir, "intelligence-graph-index.json");
const siteVersion = "SITE-V3.3.8-enterprise-ai-transformation";
const businessSignalsColumnVersion = "BSIG-V1.1.0-enterprise-ai-transformation";
const enterpriseAiLensVersion = "EAI-V1.0.0-enterprise-ai-transformation";

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

function normalizedEventText(card = {}) {
  return [
    card.displayTitle,
    card.sourceTitle,
    card.originalTitle,
    card.translatedFact,
    card.title,
    ...(card.originalHighlights || []),
  ].filter(Boolean).join(" ");
}

function eventFingerprint(card = {}) {
  const text = normalizedEventText(card).toLowerCase();
  if (/prometheus/iu.test(text) && /(?:jeff\s+bezos|bezos|贝索斯)/iu.test(text) && /(?:\$?\s*12\s*b|120\s*亿|12\s*billion)/iu.test(text)) {
    return `${card.date}|prometheus|bezos|12b`;
  }
  const normalized = normalizedComparableText(text);
  if (!normalized) return "";
  return `${card.date}|${normalized.slice(0, 80)}`;
}

function publicSignalKnownEventFingerprint(card = {}) {
  const text = normalizedEventText(card).toLowerCase();
  if (/minimax/iu.test(text) && /\bm3\b/iu.test(text)) return `${card.date}|minimax|m3`;
  if (/mistral/iu.test(text) && /(funding|financing|valuation|round|融资|估值|欧元|billion|30亿|200亿)/iu.test(text)) {
    return `${card.date}|mistral|funding`;
  }
  return "";
}

function isDuplicateFrontstageEvent(card = {}, selectedCards = []) {
  const fingerprint = publicSignalKnownEventFingerprint(card) || eventFingerprint(card);
  const eventText = normalizedEventText(card);
  return selectedCards.some((selected) => {
    const selectedFingerprint = publicSignalKnownEventFingerprint(selected) || eventFingerprint(selected);
    if (fingerprint && fingerprint === selectedFingerprint) return true;
    return textSimilarity(eventText, normalizedEventText(selected)) >= 0.66;
  });
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

function urlPathSegments(url = "") {
  try {
    return new URL(url).pathname.split("/").map((part) => part.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function isSocialOrCommunitySourceUrl(sourceUrl = "") {
  const host = domain(sourceUrl).toLowerCase();
  return /(^|\.)linkedin\.com$|(^|\.)x\.com$|(^|\.)twitter\.com$|(^|\.)reddit\.com$|news\.ycombinator\.com$|hn\.algolia\.com$/u.test(host);
}

function isRepositoryOrCatalogSourceUrl(sourceUrl = "") {
  const host = domain(sourceUrl).toLowerCase();
  const segments = urlPathSegments(sourceUrl).map((part) => part.toLowerCase());
  const path = `/${segments.join("/")}`;
  if (/github\.com$/u.test(host)) {
    if (segments.includes("releases") || segments.includes("tags")) return false;
    if (segments.length <= 2) return true;
    if (segments[2] === "tree" || segments[2] === "blob") return true;
  }
  if (/docs\.github\.com$|learn\.microsoft\.com$|docs\./u.test(host)) return true;
  if (/npmjs\.com$|pypi\.org$|chromewebstore\.google\.com$|appsource\.microsoft\.com$/u.test(host)) return true;
  if (/huggingface\.co$/u.test(host) && /^\/(?:models|datasets|spaces)\//u.test(path)) return true;
  if (/(^|\/)(docs?|documentation|api|sdk|marketplace|models?|packages?|tools?|catalog)(\/|$)/iu.test(path)
    && !/(blog|news|press|release|announc|changelog|customer|case-study)/iu.test(path)) {
    return true;
  }
  return false;
}

function isGenericFundingOrListSource(card = {}) {
  const text = [
    card.title,
    card.displayTitle,
    card.sourceTitle,
    card.originalTitle,
    card.sourceUrl,
    card.translatedFact,
  ].filter(Boolean).join(" ");
  return /angelinvestorsnetwork\.com\/venture-capital\/series-b-enterprise-ai-agents|top ai agent startups|ai agent startups|funding map|ranked by funding|pre-seed investors|57 early stage ai startups|startup funding|venture capital observatory|funding tracker/iu.test(text);
}

function isPublicBusinessSignalEligible(card = {}) {
  if (isSocialOrCommunitySourceUrl(card.sourceUrl)) return false;
  if (isRepositoryOrCatalogSourceUrl(card.sourceUrl)) return false;
  if (isGenericFundingOrListSource(card)) return false;
  return true;
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

function sectionLines(section = "") {
  return String(section || "")
    .split(/\r?\n/u)
    .map((line) => line.replace(/^\s*-\s*/u, "").trim())
    .filter(Boolean);
}

function orderedSectionBodies(markdown = "") {
  const sections = [];
  let current = null;
  for (const line of String(markdown || "").split(/\r?\n/u)) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current.join("\n").trim());
      current = [];
      continue;
    }
    if (current) current.push(line);
  }
  if (current) sections.push(current.join("\n").trim());
  return sections;
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

function sourceTitleLineFromFullText(fullText = "") {
  const lines = String(fullText || "")
    .split(/\r?\n/u)
    .map((line) => line.replace(/\s+/gu, " ").trim())
    .filter(Boolean);
  for (const line of lines) {
    if (line.length < 24 || line.length > 180) continue;
    if (hasCjk(line)) continue;
    if (/^(Image Credits?|Credit|Photo|Topics?|Most Popular|Loading the next article|Error loading|REGISTER NOW)\b/iu.test(line)) continue;
    if (/^(AI|Startups?|Government & Policy|Enterprise|News|Opinion|Sponsored)$/iu.test(line)) continue;
    if (/^(UPDATED|By)\b/iu.test(line)) continue;
    if (/\b\d{1,2}:\d{2}\s*(?:AM|PM)\b|\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s+\d{4}\b/iu.test(line)) continue;
    const latinWords = line.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
    if (latinWords.length < 5) continue;
    if (!/\b(AI|agent|agents|FDE|Forward Deployed|raises?|raised|funding|seed|launches?|announces?|introducing|case|platform|models?|enterprise|robot|robots|World leaders|Design Partner|Framework)\b/iu.test(line)) continue;
    return cleanEnglishTitleForDisplay(line);
  }
  return "";
}

function sourceTitleFromFullText(fullText = "", fallbackTitle = "") {
  const recovered = recoverCompleteTitleFromFullText(fallbackTitle, fullText);
  if (recovered && !hasCjk(recovered) && !publicTitleNeedsTranslation(recovered)) return recovered;
  const sourceLine = sourceTitleLineFromFullText(fullText);
  return sourceLine || recovered;
}

function sourceTitleFromUrlOverride(sourceUrl = "") {
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  if (/prnewswire\.com\/news-releases\/voicerun-launches-full-stack-voice-ai-platform-for-enterprises-with-5-5-million-seed-round/iu.test(normalized)) {
    return "VoiceRun Launches Full-Stack Voice AI Platform for Enterprises with $5.5 Million Seed Round";
  }
  if (/techcrunch\.com\/2026\/06\/17\/world-model-maker-odyssey-nabs-1-45b-valuation-backed-by-amazon-and-other-big-names/iu.test(normalized)) {
    return "World model maker Odyssey nabs $1.45B valuation, backed by Amazon and other big names";
  }
  if (/developers\.googleblog\.com\/announcing-the-agentic-resource-discovery-specification/iu.test(normalized)) {
    return "Announcing the Agentic Resource Discovery specification";
  }
  if (/the-decoder\.com\/zhipu-ais-glm-5-2-closes-in-on-closed-source-leaders-in-coding-marathons/iu.test(normalized)) {
    return "Zhipu AI's GLM-5.2 closes in on closed-source leaders in coding marathons";
  }
  if (/genzeon\.one\/research\/field-notes\/claude-first-healthcare-fde-pod/iu.test(normalized)) {
    return "What a Claude-First Healthcare FDE Pod Actually Does — Field Note";
  }
  return "";
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
    if (host === "growthlist.co" && pathname.includes("ai-startups")) return "GrowthList";
    if (host === "saasmag.com" && pathname.includes("monetizing-ai-agents")) return "SaaS companies";
    if (host === "partners.wsj.com" && pathname.includes("broadcom")) return "Broadcom / WSJ";
    if (host === "bidnetdirect.com" && pathname.includes("2668201217")) return "NIST";
    if (host === "a16z.com" && pathname.includes("investing-in-lio")) return "Lio / a16z";
    if (host === "linkedin.com" && pathname.includes("sunita-verma")) return "Sunita Verma";
    if (host === "anthropic.com" && pathname.includes("agents-in-biology")) return "Anthropic / Biology Agents";
    if (host === "gist.github.com" && pathname.includes("anthonyalcaraz")) return "Anthony Alcaraz";
    if (host === "heliad.com" && pathname.includes("lio-technologies")) return "Lio";
    if (host === "tech.eu" && pathname.includes("archestraai")) return "Archestra.AI";
    if (host === "market.us" && pathname.includes("voice-ai-agents-market")) return "语音 AI Agent";
    if (host === "cfodive.com" && pathname.includes("bristol-myers")) return "Bristol Myers Squibb";
    if (host === "activantcapital.com" && pathname.includes("voice-agents-2-0")) return "Activant / Voice Agents";
    if (host === "techtarget.com" && pathname.includes("merck-home-depot")) return "Merck / Home Depot / Google Gemini";
    if (host === "linkedin.com" && pathname.includes("/posts/ningz_")) return "VSCode / GitHub";
    if (host === "ithome.com" && pathname.includes("961/868")) return "Cursor / SpaceX";
    if (host === "x.com" && pathname.includes("testingcatalog")) return "Creatify";
    if (host === "aarushgupta.io" && pathname.includes("kan-fpga")) return "KAN / FPGA";
    if (host === "sievo.com" && pathname.includes("ai-in-procurement")) return "Sievo";
    if (host === "the-decoder.com" && pathname.includes("apple-intelligence")) return "Apple Intelligence / Google / Nvidia";
    if (host === "huggingface.co" && pathname.includes("spaces-agents-md")) return "Hugging Face Spaces Agent";
    if (host === "huggingface.co" && pathname.includes("coherelabs/introducing-north-mini-code")) return "Cohere / North Mini Code";
    if (host === "arstechnica.com" && pathname.includes("gemini-3-5-live-translate")) return "Google Gemini Live Translate";
    if (host === "techcrunch.com" && pathname.includes("token-bill")) return "AI token costs";
    if (host === "mindstudio.ai" && pathname.includes("build-saas-with-ai-agents")) return "MindStudio";
    if (host === "github.com" && pathname.includes("/resources/insights/enterprise-content-roundup")) return "GitHub Enterprise";
    if (host === "ithome.com" && pathname.includes("963/999")) return "三星 / 海上 AI 数据中心";
    if (host === "ithome.com" && pathname.includes("963/986")) return "KPMG";
    if (host === "ithome.com" && pathname.includes("963/998")) return "三星 / AI 数据中心";
    if (host === "ithome.com" && pathname.includes("963/907")) return "科大讯飞 / 星火 X2-VL";
    if (host === "ithome.com" && pathname.includes("963/924")) return "京东健康 / 友谊医院消化大模型";
    if (host === "the-decoder.com" && pathname.includes("moonshots-open-model-kimi")) return "Moonshot AI / Kimi K2.7 Code";
    if (host === "the-decoder.com" && pathname.includes("claude-fable-5-outpaces")) return "Anthropic / Claude Fable 5";
    if (host === "the-decoder.com" && pathname.includes("us-government-forces-anthropic")) return "Anthropic / Claude Fable 5";
    if (host === "docs.aws.amazon.com" && pathname.includes("sagemaker-marketplace")) return "Amazon SageMaker";
    if (host === "businesswire.com" && pathname.includes("digitalocean-launches-inference-engine")) return "DigitalOcean";
    if (host === "sisinternational.com") return "SIS International";
    if (host === "genzeon.one") return "Genzeon Platforms";
    if (host === "gogloby.com") return "GoGloby";
    if (host === "linkedin.com" && pathname.includes("pascaldarc")) return "Procurement AI";
    if (host === "linkedin.com" && pathname.includes("jonjessup")) return "Hugging Face";
    if (host === "ithome.com" && pathname.includes("962/220")) return "香港 AI 应用示范社区";
    if (host === "huggingface.co" && pathname.includes("servicenow-ai/code-switching")) return "Hugging Face / ServiceNow";
  } catch {
    // Fall through to title-based detection.
  }
  return "";
}

function cleanSubject(value = "") {
  return String(value)
    .replace(/[｜]/gu, "|")
    .replace(/\s*\|\s*https?:?.*$/iu, "")
    .replace(/https?:\/\/\S+/giu, "")
    .replace(/[（(]\s*RSS\s*[）)]/giu, "")
    .replace(/\s+/gu, " ")
    .replace(/^(Anysearch|Unknown Builder|HN Builder Query|DuckDuckGo)\s*[:：|｜-]\s*/iu, "")
    .replace(/\s*\|\s+(Wikipedia|YouTube|LinkedIn|Reddit|Podcast|Podscan\.fm|Blog)$/iu, "")
    .replace(/\s+-\s+(Wikipedia|YouTube|LinkedIn|Reddit|Podcast|Podscan\.fm)$/iu, "")
    .trim();
}

function subjectFromTitle(title = "") {
  const clean = cleanSubject(title);
  if (!clean) return "";
  if (/^京东健康与北京友谊医院/u.test(clean)) return "京东健康 / 北京友谊医院";
  if (subjectLooksLikeTitle(clean) && !/[：:|｜-]/u.test(clean)) {
    const productionMatch = clean.match(/^([\u4e00-\u9fffA-Za-z0-9 .&/-]{2,18}?)(?:人形机器人)?\s*\d{4}年.+?(?:量产|搭载)/u);
    if (productionMatch) return cleanSubject(productionMatch[1]);
  }
  const ceoMatch = clean.match(/^([A-Z][A-Za-z0-9 .&-]{1,36})\s+CEO\b/u);
  if (ceoMatch) return cleanSubject(ceoMatch[1]);
  const colonMatch = clean.match(/^([^:：]{2,36})[:：]/u);
  if (colonMatch) {
    const lead = cleanSubject(colonMatch[1]);
    const leadActionMatch = lead.match(/^([A-Z][A-Za-z0-9 .&/-]{1,42}?|[\u4e00-\u9fffA-Za-z0-9 .&/-]{2,28}?)(?:\s*)(发布|推出|完成|融资|获得|获|宣布|部署|开源|适配|公布|引入|支持|launches?|raises?|lands?|announces?|releases?)(?=\b|\s|$|[：:，,])/iu);
    if (leadActionMatch) return cleanSubject(leadActionMatch[1]);
    if (!subjectLooksLikeTitle(lead)) return lead;
  }
  const knownMatch = clean.match(/^(Google DeepMind|Google Research|Google Colab|Anthropic|Claude Cowork|Claude Code|OpenAI|Microsoft(?: AI)?|NVIDIA|Airspeed|NeoCognition|Nimble|Arm|Meta|NIST)\b/u);
  if (knownMatch) return cleanSubject(knownMatch[1]);
  const actionMatch = clean.match(/^([A-Z][A-Za-z0-9 .&/-]{1,42}?|[\u4e00-\u9fffA-Za-z0-9 .&/-]{2,28}?)(?:\s*)(发布|推出|完成|融资|获得|获|宣布|部署|开源|适配|公布|引入|支持|launches?|raises?|lands?|announces?|releases?)(?=\b|\s|$|[：:，,])/iu);
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
  return "";
}

function normalizeSubject(value = "") {
  const clean = cleanSubject(value);
  if (/^Moonshot AI\b/iu.test(clean)) return "Moonshot AI";
  if (/^Meta\b|^Meta 在其 AI 应用中/iu.test(clean)) return "Meta";
  if (/^Qwen3\.7-Plus\b/iu.test(clean)) return "Qwen3.7-Plus";
  if (/NeoCognition/iu.test(clean)) return "NeoCognition";
  if (/Nimble/iu.test(clean)) return "Nimble";
  if (/Airspeed/iu.test(clean)) return "Airspeed";
  if (/^Microsoft AI\b/iu.test(clean)) return "Microsoft AI";
  if (/^小米\s*MiMo|^小米MiMo|^Xiaomi\s*MiMo/iu.test(clean)) return "小米 / MiMo";
  if (/^苹果智能和\s*Siri AI|^苹果\s*Siri AI/u.test(clean)) return "Apple / Siri AI";
  if (/^天工3\.0/u.test(clean)) return "天工3.0";
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
  if (clean.length > 12 && /[，。；]/u.test(clean)) return true;
  return clean.length > 12 && /(发布|推出|完成|融资|获得|部署|重建|成为|指南|降低|提升|用于|进入|让|把|扩大|承诺|帮助|被叫停|可能|入股|渲染|升级|调整|增强|开始探索|押注|欲打破|榜单|清单|将|支付|获取|聚焦|量产|搭载|适配|公布|支持|可实现|每秒|芯片|人形机器人|模型|应用|功能|早报|日报|周报|合集|是 AIScraping|Introducing|Top AI|Complete Guide|How to|Lessons from|Release Notes Agent|with quantization|Brings Enterprise|monetizing AI agents|Paid Program|Weekly Updated)/iu.test(clean);
}

function isWeakSubject(value = "") {
  const clean = normalizeSubject(value);
  if (!clean || isDiscoveryLabel(clean)) return true;
  if (/^\d{4}$/u.test(clean)) return true;
  if (/^[a-z0-9.-]+\.(com|org|net|io|ai|dev|co)$/iu.test(clean)) return true;
  if (/^(LinkedIn|Linkedin|TechCrunch|Techcrunch|Arstechnica|Ars Technica|The[-\s]Decoder|Marktechpost|Siliconangle|Instagram|Apple Podcasts)$/iu.test(clean)) return true;
  if (/^(Requests for Startups|Enterprise AI Execution Problem|The Information'?s TITV)$/iu.test(clean)) return true;
  if (/^(IT之家|Hacker News 热门|MarkTechPost|buzzing\.cc|Weekly Updated B2B Lead Database)/iu.test(clean)) return true;
  if (/^(IT早报|AI早报|早报|日报|周报)/iu.test(clean)) return true;
  if (/^AI business signal$/iu.test(clean)) return true;
  if (/^How to\b|^Complete Guide\b|^October '?25 enterprise roundup\b/iu.test(clean)) return true;
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

function subjectFromEnglishTitle(title = "") {
  const clean = cleanSubject(title);
  if (!clean) return "";
  const launchMatch = clean.match(/^([A-Z][A-Za-z0-9 .&/-]{1,42}?)\s+(?:Launches|Introduces|Releases|Announces|Raises|Secures|Lands)\b/u);
  if (launchMatch) return launchMatch[1].trim();
  const insideMatch = clean.match(/^Inside\s+([A-Z][A-Za-z0-9 .&/-]{2,36}?)(?:'|’|\b)/u);
  if (insideMatch) return insideMatch[1].trim();
  const dashMatch = clean.match(/[—-]\s*([A-Z][A-Za-z0-9 .&/-]{2,28})$/u);
  if (dashMatch) return dashMatch[1].trim();
  if (/token bill|runaway costs/iu.test(clean)) return "AI token costs";
  if (/Voice AI Adoption Report/iu.test(clean)) return "Voice AI";
  if (/Using AI for Software Development with VSCode and GitHub/iu.test(clean)) return "VSCode / GitHub";
  if (/Creatify Agent Wave/iu.test(clean)) return "Creatify";
  if (/Procurement AI/iu.test(clean)) return "Procurement AI";
  return "";
}

function fallbackChineseTitleForEnglish(title = "", sourceUrl = "") {
  const text = String(title || "").replace(/\s+/gu, " ").trim();
  if (!text) return "";
  const subject = subjectFromUrl(sourceUrl) || subjectFromEnglishTitle(text) || domain(sourceUrl).split(".")[0] || "AI";
  if (/\b(raises|raised|lands|landed|secures|secured|funding|financing|series|seed|pre-seed)\b/iu.test(text)) return `${subject} 融资，资金流向 AI 商业化环节`;
  if (/\b(launches|launch|introduces|introduced|releases|released|announces|announced|general availability)\b/iu.test(text)) return `${subject} 发布 AI 产品能力，切入企业工作流`;
  if (/\b(procurement|purchase|supply chain|customer|adoption|case study|workflow|overhaul|visuals?|furniture|companies)\b/iu.test(text)) return `${subject} 案例：AI 进入企业业务流程`;
  if (/\b(inference|model|serverless|compute|gpu|infrastructure|platform)\b/iu.test(text)) return `${subject} 发布 AI 基础设施能力`;
  if (/\b(report|benchmark|market|adoption|guide|complete)\b/iu.test(text)) return `${subject} 报告：AI 商业采用继续分化`;
  return `${subject} 信号：AI 进入企业业务流程`;
}

function fallbackChineseFactForEnglish(title = "", sourceUrl = "") {
  const text = String(title || "").replace(/\s+/gu, " ").trim();
  if (!text) return "";
  const subject = subjectFromUrl(sourceUrl) || subjectFromEnglishTitle(text) || domain(sourceUrl).split(".")[0] || "AI";
  const amount = text.match(/\$ ?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?|\d+(?:\.\d+)?\s?(?:million|billion)/u)?.[0] || "";
  if (/\b(raises|raised|lands|landed|secures|secured|funding|financing|series|seed|pre-seed)\b/iu.test(text)) {
    return `${subject} 获得${amount ? `${amount} ` : ""}融资，公开资料显示资金继续流向 AI 产品化和企业采用环节。`;
  }
  if (/\b(launches|launch|introduces|introduced|releases|released|announces|announced|general availability)\b/iu.test(text)) {
    return `${subject} 发布新的 AI 产品或平台能力，信号价值在于观察它是否进入具体企业工作流。`;
  }
  if (/\b(procurement|purchase|supply chain|customer|adoption|case study|workflow|overhaul|visuals?|furniture|companies)\b/iu.test(text)) {
    return `${subject} 的公开案例显示，AI 正在进入客户、采购、商品内容或内部工作流等业务场景。`;
  }
  if (/\b(inference|model|serverless|compute|gpu|infrastructure|platform)\b/iu.test(text)) {
    return `${subject} 的材料指向 AI 基础设施能力，重点在推理、模型部署或算力调用成本。`;
  }
  return `${subject} 的公开材料提供了一条可追踪的 AI 商业信号，需继续核对客户、产品和业务结果。`;
}

function cleanEnglishTitleForDisplay(title = "") {
  return String(title || "")
    .replace(/\s*\|\s*[^|]{2,60}$/u, "")
    .replace(/\s+-\s*(TechCrunch|SiliconANGLE|BusinessWire|PR Newswire|Markets Insider|CFO Dive|Google Cloud Press Corner)$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function sourceTitleLiteralTranslation(title = "", sourceUrl = "") {
  const raw = String(title || "").replace(/\s+/gu, " ").trim();
  if (!raw) return "";
  if (hasCjk(raw)) return raw;
  const text = cleanEnglishTitleForDisplay(raw);
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const rules = [
    [/VoiceRun Launches Full-Stack Voice AI Platform for Enterprises/iu, "VoiceRun 推出面向企业的全栈语音 AI 平台，并完成 550 万美元种子轮融资"],
    [/VoiceRun gets \$5\.5M in seed funding to give enterprises more control over voice AI agents/iu, "VoiceRun 获得 550 万美元种子融资，让企业更好地控制语音 AI Agent"],
    [/Willow Launches with \$7M to Build the Future of Enterprise AI Agent Governance/iu, "Willow 携 700 万美元融资启动，构建企业 AI Agent 治理的未来"],
    [/INXM Raises €5\.7 Million Pre-Seed To Bridge The Gap Between Enterprise AI Demos And Real Operational Deployment/iu, "INXM 获得 570 万欧元 Pre-Seed 融资，以弥合企业 AI 演示与真实运营部署之间的差距"],
    [/World model maker Odyssey nabs \$1\.45B valuation, backed by Amazon and other big names/iu, "世界模型公司 Odyssey 获得 14.5 亿美元估值，并获得 Amazon 等机构支持"],
    [/Pramaana Labs raises \$27M seed round from Khosla Ventures to bring formal verification to AI/iu, "Pramaana Labs 获得 Khosla Ventures 领投的 2700 万美元种子轮融资，将形式化验证引入 AI"],
    [/Announcing the Agentic Resource Discovery specification/iu, "发布 Agentic Resource Discovery 规范"],
    [/Zhipu AI's GLM-5\.2 closes in on closed-source leaders in coding marathons/iu, "智谱 AI 的 GLM-5.2 在编码马拉松中逼近闭源领先模型"],
    [/Applied AI Case Studies and Real-World Success Stories/iu, "应用 AI 案例研究和真实成功故事"],
    [/Ontora: AI agents that interviews every employee to hand context to AI tools/iu, "Ontora：访谈每位员工并将上下文交给 AI 工具的 AI Agent"],
    [/A Framework for Finding A Design Partner/iu, "寻找设计伙伴的框架"],
    [/Introducing Amazon Bedrock Managed Knowledge Base for faster, more accurate enterprise AI applications/iu, "推出 Amazon Bedrock 托管知识库，用于更快、更准确的企业 AI 应用"],
    [/Enterprise AI Rollout Failures: Causes and Case Studies/iu, "企业 AI 推广失败：原因与案例研究"],
    [/Governed AI Agents: How to Deploy and Scale with Confidence/iu, "受治理的 AI Agent：如何自信地部署和扩展"],
    [/New in Amazon Bedrock AgentCore: Build agents with broader knowledge and continuous learning/iu, "Amazon Bedrock AgentCore 新功能：构建拥有更广知识和持续学习能力的 Agent"],
    [/Barcelona-based NeuralTrust raises €17\.2 million to secure and govern enterprise AI agents/iu, "巴塞罗那 NeuralTrust 融资 1720 万欧元，用于保护和治理企业 AI Agent"],
    [/World leaders want American AI\. They just don[’']t want America to be able to turn it off/iu, "世界领导人想要美国 AI，但不希望美国能够将其关闭"],
    [/Collecting robot training data is dirty, unglamorous work.*XDOF/iu, "收集机器人训练数据是脏活累活，一些 AI 实验室已经在付费让 XDOF 来做"],
    [/Dangerous AI models are coming, no matter what/iu, "危险的 AI 模型无论如何都会到来"],
    [/What a Claude-First Healthcare FDE Pod Actually Does/iu, "Claude 优先的医疗 FDE Pod 实际做什么"],
  ];
  const match = rules.find(([pattern]) => pattern.test(`${text}\n${normalized}`));
  return match?.[1] || "";
}

function titleSubject(title = "", sourceUrl = "") {
  return subjectFromEnglishTitle(title)
    || subjectFromUrl(sourceUrl)
    || domain(sourceUrl).split(".")[0]
    || "AI";
}

function sourceDerivedChineseTitleForEnglish(title = "", sourceUrl = "") {
  const text = cleanEnglishTitleForDisplay(title);
  if (!text) return "";
  const known = [
    [/VoiceRun Launches Full-Stack Voice AI Platform/iu, "VoiceRun 发布企业级全栈语音 AI 平台并完成 550 万美元种子轮融资"],
    [/Applied AI Case Studies and Real-World Success Stories/iu, "GoGloby 汇总应用 AI 案例与真实业务成效"],
    [/Ontora: AI agents that interviews every employee/iu, "Ontora 用 AI Agent 访谈员工并向企业 AI 工具传递上下文"],
    [/A Framework for Finding A Design Partner/iu, "Andreessen Horowitz 发布寻找设计伙伴的框架"],
    [/Introducing Amazon Bedrock Managed Knowledge Base/iu, "AWS 发布 Amazon Bedrock 托管知识库，加速企业 AI 应用构建"],
    [/Enterprise AI Rollout Failures: Causes and Case Studies/iu, "Intuition Labs 分析企业 AI 推广失败原因与案例"],
    [/Governed AI Agents: How to Deploy and Scale with Confidence/iu, "Boomi 讨论受治理 AI Agent 的部署与规模化"],
    [/Algorithms and packages in the AWS Marketplace.*SageMaker/iu, "Amazon SageMaker AI Marketplace 提供算法和模型包"],
    [/ElevenLabs and Better\.com Showcase Success of AI Loan Agent/iu, "ElevenLabs 与 Better.com 展示 AI 贷款 Agent Betsy 的金融服务规模化应用"],
    [/DigitalOcean Launches Inference Engine/iu, "DigitalOcean 发布生产级 AI 推理引擎与 Agentic 工作负载路由"],
    [/Top European insurer accelerates claims notification with Druid AI agents/iu, "欧洲保险公司使用 Druid AI Agent 加速理赔通知"],
    [/LTM transforms HR and Sales Organization with AI-Powered Copilot Agents/iu, "LTM 使用 AI Copilot Agent 改造 HR 与销售组织"],
    [/Built x MightyBot Case Study.*AI Draw Agent/iu, "Built 与 MightyBot 案例：AI 绘图 Agent 进入生产"],
  ];
  const knownMatch = known.find(([pattern]) => pattern.test(text));
  if (knownMatch) return knownMatch[1];
  const amount = text.match(/\$ ?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?|\d+(?:\.\d+)?\s?(?:million|billion)/u)?.[0] || "";
  const subject = titleSubject(text, sourceUrl);
  const fundingPurpose = text.match(/\bto\s+(build|bring|scale|advance|accelerate|deploy|automate|secure|expand|help)\s+(.+)$/iu)?.[2] || "";
  if (/\b(raises|raised|lands|landed|secures|secured|pulls in|gets|funding|financing|series|seed|pre-seed)\b/iu.test(text)) {
    const purpose = fundingPurpose ? `，用途见原文：${fundingPurpose}` : "";
    return `${subject} 融资${amount ? ` ${amount}` : ""}${purpose}`.slice(0, 120);
  }
  const launchMatch = text.match(/^(.+?)\s+(?:launches|introduces|releases|announces|showcases|unveils)\s+(.+)$/iu);
  if (launchMatch) {
    return `${subject} 发布原文所述能力：${launchMatch[2]}`.slice(0, 120);
  }
  const withMatch = text.match(/^(.+?)\s+(?:uses|using|with|books over|accelerates|transforms|delivers|automates|showcase(?:s)? success of)\s+(.+)$/iu);
  if (withMatch) {
    return `${subject} 应用原文所述场景：${withMatch[2]}`.slice(0, 120);
  }
  if (/procurement|purchase|supply chain|workflow|claims|loan|customer|support|sales|HR|revenue/iu.test(text)) {
    return `${subject} 的原文业务场景：${text}`.slice(0, 120);
  }
  if (/agent|model|inference|platform|marketplace|sagemaker|copilot|voice ai|ai/iu.test(text)) {
    return `${subject} 的原文 AI 事件：${text}`.slice(0, 120);
  }
  return `${subject} 的原文事件标题：${text}`.slice(0, 120);
}

function sourceTitleDerivedFact(title = "", sourceUrl = "") {
  const rawTitle = String(title || "").replace(/\s+/gu, " ").trim();
  if (!rawTitle) return "";
  const direct = chineseFactFromSource(rawTitle, sourceUrl);
  if (direct && !isGenericSourceFallback(direct) && !isSourceLinkOnlyFact(direct)) return direct;
  const displayTitle = frontstageChineseTitle(rawTitle, sourceUrl) || safeFrontstageTitle(rawTitle, sourceUrl) || rawTitle;
  const subject = safeFrontstageSubject({
    sourceUrl,
    rawTitle,
    title: displayTitle,
    originalTitle: rawTitle,
  });
  const amount = rawTitle.match(/\$ ?\d+(?:\.\d+)?\s?(?:M|B|m|b|million|billion)?|\d+(?:\.\d+)?\s?(?:million|billion)/u)?.[0] || "";
  if (/\b(raises|raised|lands|landed|secures|secured|funding|financing|series|seed|pre-seed)\b/iu.test(rawTitle)) {
    return `${displayTitle}。融资主体为 ${subject}${amount ? `，披露金额为 ${amount}` : ""}。`;
  }
  if (/\b(launches|launch|introduces|introduced|releases|released|announces|announced|general availability)\b/iu.test(rawTitle)) {
    return `${displayTitle}。发布主体为 ${subject}，事件性质是产品、平台或能力发布。`;
  }
  if (/\b(procurement|purchase|supply chain|customer|adoption|case study|workflow|overhaul|voice agent|books over|support|conversion)\b/iu.test(rawTitle)) {
    return `${displayTitle}。该来源披露的是 ${subject} 相关的客户、采购、工作流或业务采用场景。`;
  }
  if (/\b(inference|model|serverless|compute|gpu|infrastructure|platform|agent)\b/iu.test(rawTitle)) {
    return `${displayTitle}。该来源披露的是 ${subject} 相关的 AI 基础设施、模型部署或智能体能力事件。`;
  }
  return `${displayTitle}。该来源披露的是 ${subject} 相关的具体 AI 商业事件。`;
}

function isInternalEvidenceDump(value = "") {
  return /^##\s*P-\d+/iu.test(String(value || "").trim())
    || /\braw_ref:|\braw_original_id:|\braw_archive:|\bpool_refs:/iu.test(String(value || ""));
}

function isUntranslatedPublicEnglish(value = "") {
  const text = String(value || "").trim();
  const hanCount = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  return text.length > 70 && latinWords.length >= 10 && hanCount < 10;
}

function publicTitleNeedsTranslation(value = "") {
  const text = String(value || "").trim();
  const hanCount = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  if (hanCount >= 5 && /(浣跨敤|鍙戝竷|铻嶈祫|瀹屾垚|鎺ㄥ嚭|寮€鍙憒搴旂敤|鍘熸枃|鐢ㄩ€旇鍘熸枃)/u.test(text)) return false;
  const sourceLikeEnglish = /\b(announces?|launches?|raises?|raised|secures?|secured|showcases?|success of|at scale|with new|for enterprise|startup|pre-seed|series\s+[a-z]|funding|financing|case study|report|guide|complete|introducing)\b/iu.test(text);
  if (text.length > 18 && hanCount === 0) return true;
  if (latinWords.length >= 7 && hanCount < 10) return true;
  if (sourceLikeEnglish && latinWords.length >= 5 && hanCount < 14) return true;
  return false;
}

function publicContentNeedsTranslation(value = "") {
  const text = String(value || "").trim();
  const hanCount = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  if (text.length > 70 && latinWords.length >= 10 && hanCount < 10) return true;
  if (text.length > 120 && latinWords.length >= 14 && hanCount < 18) return true;
  return false;
}

function publicFactLooksLikeTemplateFallback(value = "") {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (!text) return true;
  return /\u539f\u6587\u6240\u8ff0(?:\u80fd\u529b|\u573a\u666f)/u.test(text)
    || /\u539f\u6587\s*AI\s*\u4e8b\u4ef6/u.test(text)
    || /\u516c\u5f00\u6750\u6599\u63d0\u4f9b\u4e86\u4e00\u6761\u53ef\u8ffd\u8e2a\u7684\s*AI\s*\u5546\u4e1a\u4fe1\u53f7/u.test(text)
    || /\u9700\u7ee7\u7eed\u6838\u5bf9\u5ba2\u6237/u.test(text)
    || /\u5ba2\u6237\u3001\u4ea7\u54c1\u548c\u4e1a\u52a1\u7ed3\u679c/u.test(text)
    || /\u8fd9\u6761(?:\u6848\u4f8b|\u878d\u8d44|\u4ea7\u54c1)\u4fe1\u53f7\u53ef\u7528\u4e8e/u.test(text)
    || /\u4fe1\u53f7\u4ef7\u503c\u5728\u4e8e\u89c2\u5bdf/u.test(text)
    || /\u5177\u4f53\s*AI\s*\u5546\u4e1a\u4e8b\u4ef6/u.test(text)
    || /\u516c\u5f00\u8d44\u6599\u663e\u793a\u8d44\u91d1\u7ee7\u7eed\u6d41\u5411\s*AI\s*\u4ea7\u54c1\u5316\u548c\u4f01\u4e1a\u91c7\u7528\u73af\u8282/u.test(text)
    || /\u8fd9\u6761\u878d\u8d44\u4fe1\u53f7\u53ef\u7528\u4e8e\u5224\u65ad\u8d44\u91d1\u6d41\u5411/u.test(text)
    || (/\.\.\./u.test(text) && text.length < 80);
}

function publicFactLooksLikeNavigation(value = "") {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (!text) return false;
  return /\bBack Start free trial\b/iu.test(text)
    || /\bPlatform Overview\b.*\bContact Sales\b/iu.test(text)
    || /\bContact Sales\b.*\bLanguage English\b/iu.test(text)
    || /\bSolutions Resources Partners Contact Sales\b/iu.test(text);
}

function publicTextLooksGarbled(value = "") {
  const text = String(value || "");
  const controlCount = text.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu)?.length || 0;
  const replacementCount = text.match(/[\uFFFD\u951F]/gu)?.length || 0;
  return controlCount > 0 || replacementCount >= 2;
}

function publicDisplayTitleIsReady(title = "") {
  const text = String(title || "").trim();
  if (!text) return false;
  if (isBadPublicDisplayTitle(text) || isProcessedChineseTitle(text) || publicTitleLooksOverprocessed(text)) return false;
  if (publicTextLooksGarbled(text) || publicTitleNeedsTranslation(text)) return false;
  return true;
}

function publicCandidateIsDisplayReady(card = {}) {
  if (!card.title || !card.displayTitle) return false;
  const expectedTitle = publicTitleCandidate(sourceFrontstageTitle(card), card.sourceUrl);
  if (expectedTitle) {
    if (card.title !== expectedTitle || card.displayTitle !== expectedTitle) return false;
  } else if (
    card.title !== card.displayTitle
    || !publicDisplayTitleIsReady(card.title)
    || !publicDisplayTitleIsReady(card.displayTitle)
  ) {
    return false;
  }
  if (publicTitleNeedsTranslation(card.title) || publicTitleNeedsTranslation(card.displayTitle)) return false;
  if (publicFactLooksLikeTemplateFallback(card.translatedFact || card.summary || card.visibleFragment)) return false;
  return [card.summary, card.translatedFact, card.visibleFragment]
    .filter(Boolean)
    .every((value) => !publicTextLooksGarbled(value) && !publicContentNeedsTranslation(value));
}

function subjectMatchesDisplayTitle(subject = "", title = "", originalTitle = "") {
  const cleanSubjectText = cleanSubject(subject);
  const normalizedSubject = normalizedComparableText(subject);
  if (!normalizedSubject) return false;
  const shouldRejectContainedSubject = /^[a-z0-9]{13,}$/iu.test(cleanSubjectText);
  return [title, originalTitle]
    .map(normalizedComparableText)
    .filter(Boolean)
    .some((candidate) => candidate === normalizedSubject || (shouldRejectContainedSubject && candidate.includes(normalizedSubject)));
}

function safeFrontstageSubject({ subject = "", sourceUrl = "", sourceName = "", rawTitle = "", title = "", originalTitle = "" } = {}) {
  const candidates = [
    frontstageSubjectOverride(sourceUrl, title || rawTitle || originalTitle),
    subjectFromUrl(sourceUrl),
    subjectFromEnglishTitle(rawTitle || originalTitle || title),
    subject,
    subjectFromTitle(title),
    subjectFromTitle(rawTitle || originalTitle),
    sourceName,
  ];
  for (const candidate of candidates) {
    const normalized = normalizeSubject(candidate);
    if (/未标注主体|鏈爣娉ㄤ富浣?/u.test(normalized)) continue;
    if (!normalized || isWeakSubject(normalized)) continue;
    if (subjectLooksLikeTitle(normalized)) continue;
    if (subjectMatchesDisplayTitle(normalized, title, originalTitle || rawTitle)) continue;
    return normalized;
  }
  const host = domain(sourceUrl).split(".")[0];
  if (/^[a-z0-9]{18,}$/iu.test(host)) {
    try {
      const pathText = decodeURIComponent(new URL(sourceUrl).pathname)
        .replace(/[-_/]+/gu, " ")
        .replace(/\s+/gu, " ")
        .trim();
      if (/\bAI\s+agents?\b/iu.test(pathText)) return "AI agents funding";
    } catch {
      // Fall through to the neutral fallback.
    }
    return "AI business signal";
  }
  return host && !isWeakSubject(host) ? normalizeSubject(host) : "AI business signal";
}

function safeFrontstageTitle(title = "", sourceUrl = "") {
  const translated = frontstageChineseTitle(title, sourceUrl) || title;
  return hasCjk(translated) ? translated : fallbackChineseTitleForEnglish(translated, sourceUrl);
}

function sourceFrontstageTitle(card = {}, _originalTitle = "") {
  return [
    sourceTitleFromUrlOverride(card.sourceUrl),
    card.sourceTitle,
    card.rawTitle,
    card.originalSourceTitle,
    card.originalTitle,
  ]
    .map((value) => String(value || "").trim())
    .find(Boolean) || "";
}

function isBadPublicDisplayTitle(title = "") {
  return /案例：\s*AI\s*进入|信号：\s*AI\s*进入|用途见原文|原文所述|原文 AI 事件|原文事件标题|的原文业务场景|linkedin\s+(?:的原文|融资)|github\s+的原文|devblogs\s+应用|angelinvestorsnetwork\s+融资/iu.test(String(title || ""));
}

function isProcessedChineseTitle(title = "") {
  return hasCjk(title) && /押注|资金流向|业务信号|基础设施能力|可用于观察|值得关注/u.test(String(title || ""));
}

function cleanBadPublicDisplayTitle(title = "") {
  return String(title || "")
    .replace(/，?用途见原文[:：].*$/u, "")
    .replace(/发布原文所述能力[:：]\s*/u, "发布 ")
    .replace(/应用原文所述场景[:：]\s*/u, "应用 ")
    .replace(/的原文 AI 事件[:：]\s*/u, "：")
    .replace(/的原文事件标题[:：]\s*/u, "：")
    .replace(/\s+/gu, " ")
    .trim();
}

function sourceTitleFallbackForDisplay(title = "", sourceUrl = "") {
  const clean = cleanEnglishTitleForDisplay(title);
  if (!clean) return "";
  return `${titleSubject(clean, sourceUrl)}：${clean}`.slice(0, 120);
}

function sourceUrlTitleFallbackForDisplay(sourceUrl = "") {
  try {
    const parsed = new URL(sourceUrl);
    const slug = decodeURIComponent(parsed.pathname)
      .split("/")
      .filter(Boolean)
      .at(-1)
      ?.replace(/\.[a-z0-9]+$/iu, "")
      .replace(/[-_]+/gu, " ")
      .replace(/\b(?:e\d+[a-z0-9]*|podcast|episode|post|article)\b/giu, "")
      .replace(/\s+/gu, " ")
      .trim();
    if (!slug || slug.length < 6) return "";
    const title = slug.replace(/\b\w/gu, (match) => match.toUpperCase());
    return `${titleSubject(title, sourceUrl)}：${title}`.slice(0, 120);
  } catch {
    return "";
  }
}

function publicTitleCandidate(title = "", sourceUrl = "") {
  const raw = String(title || "").trim();
  if (!raw || isBadPublicDisplayTitle(raw)) return "";
  if (isProcessedChineseTitle(raw)) return "";
  const candidate = sourceTitleLiteralTranslation(raw, sourceUrl);
  const cleaned = cleanBadPublicDisplayTitle(candidate);
  if (cleaned && !isBadPublicDisplayTitle(cleaned) && !publicTitleNeedsTranslation(cleaned)) return cleaned;
  return "";
}

function publicDisplayTitle(sourceTitle = "", generatedTitle = "", sourceUrl = "") {
  const sourceCandidate = publicTitleCandidate(sourceTitle, sourceUrl);
  if (sourceCandidate) return sourceCandidate;
  const fallback = cleanBadPublicDisplayTitle(String(generatedTitle || "").trim());
  if (fallback && !isBadPublicDisplayTitle(fallback) && !publicTitleNeedsTranslation(fallback)) {
    return fallback;
  }
  return "";
}

function cleanPublicSourceFact(value = "") {
  return String(value || "")
    .replace(/\s+/gu, " ")
    .replace(/(?:\.\.\.|…)+$/u, "")
    .trim();
}

function publicTitleLooksOverprocessed(title = "") {
  const text = String(title || "").trim();
  return /押注|发布\s*AI\s*基础设施能力|推出\s*Agent\s*工作流能力|切入(?:模型部署和算力服务|地产和建筑设计工作流)/iu.test(text)
    || /获得\s*\$?\d[\d.,]*(?:\s?(?:M|B|m|b|million|billion))?(?:\s+seed)?\s*融资/iu.test(text);
}

function normalizeFactDerivedTitle(value = "") {
  return String(value || "")
    .replace(/\$\s*(\d+(?:\.\d+)?)\s*m\s*seed/giu, (_, amount) => `${Number(amount) * 100}万美元种子轮`)
    .replace(/\$\s*(\d+(?:\.\d+)?)\s*m\b/giu, (_, amount) => `${Number(amount) * 100}万美元`)
    .replace(/\$\s*(\d+(?:\.\d+)?)\s*b\b/giu, (_, amount) => `${amount}亿美元`)
    .replace(/\bseed\b/giu, "种子轮")
    .replace(/\s+/gu, " ")
    .trim();
}

function factDerivedPublicTitle(value = "") {
  const text = cleanPublicSourceFact(value);
  if (!text) return "";
  const sentence = text.split(/[。！？!?]/u).map((item) => item.trim()).find(Boolean) || "";
  if (!sentence) return "";
  const clause = sentence
    .split(/[，,:：]/u)
    .map((item) => item.trim())
    .find((item) => item.length >= 10) || sentence;
  const compact = normalizeFactDerivedTitle(clause);
  const candidate = compact.length > 44 ? `${compact.slice(0, 44).trim()}…` : compact;
  if (!candidate || !hasCjk(candidate)) return "";
  if (isBadPublicDisplayTitle(candidate) || isProcessedChineseTitle(candidate) || publicTitleLooksOverprocessed(candidate)) return "";
  if (publicTitleNeedsTranslation(candidate) || publicTextLooksGarbled(candidate)) return "";
  return candidate;
}

function normalizeFrontstageDisplay(card = {}) {
  const modelGeneratedTitle = card.modelGeneratedTitle || card.generatedTitle || card.title || "";
  const internalTitle = safeFrontstageTitle(card.title || card.originalTitle, card.sourceUrl);
  const originalTitle = card.originalTitle || (internalTitle !== card.title ? card.title : "");
  const sourceTitle = sourceFrontstageTitle(card, originalTitle);
  const replacementFact = sourceTitleDerivedFact(sourceTitle || originalTitle || internalTitle, card.sourceUrl);
  const translatedFact = [
    card.translatedFact,
    replacementFact,
    card.visibleFragment,
    card.summary,
  ].find((value) => (
    value
      && !publicContentNeedsTranslation(value)
      && !publicFactLooksLikeNavigation(value)
      && !publicFactLooksLikeTemplateFallback(value)
  )) || "";
  const cleanedTranslatedFact = cleanPublicSourceFact(translatedFact);
  const preferredDisplayTitle = publicDisplayTitle(sourceTitle, internalTitle, card.sourceUrl);
  const displayTitle = publicDisplayTitleIsReady(preferredDisplayTitle)
    ? preferredDisplayTitle
    : factDerivedPublicTitle(cleanedTranslatedFact || card.visibleFragment || card.summary);
  return {
    ...card,
    title: displayTitle,
    modelGeneratedTitle,
    generatedTitle: displayTitle,
    originalTitle,
    sourceTitle,
    displayTitle,
    translatedFact: cleanedTranslatedFact,
    subject: safeFrontstageSubject({
      subject: card.subject,
      sourceUrl: card.sourceUrl,
      sourceName: card.sourceName,
      rawTitle: card.originalTitle,
      title: displayTitle,
      originalTitle,
    }),
  };
}

function top10CompatCard(card = {}) {
  const sourceTitle = sourceFrontstageTitle(card, card.originalTitle);
  const displayTitle = publicDisplayTitle(sourceTitle, card.displayTitle || card.title || "", card.sourceUrl);
  return {
    ...card,
    modelGeneratedTitle: card.modelGeneratedTitle || card.generatedTitle || card.title || "",
    generatedTitle: displayTitle,
    sourceTitle,
    displayTitle,
    title: displayTitle,
  };
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
    [/aws\.amazon\.com\/blogs\/aws\/announcing-amazon-sagemaker-inference-for-custom-amazon-nova-models/u, "AWS：SageMaker Inference 支持部署自定义 Amazon Nova 模型"],
    [/siliconangle.*archestra/u, "Archestra 融资 1000 万美元，为企业数据接入 AI Agent 搭建中介层"],
    [/linkedin\.com.*seed.*pre-seed/u, "57 家早期 AI 初创公司一周融资 3.16 亿美元"],
    [/thenextweb\.com.*voice-ai-infrastructure/u, "前高盛和 Meta 创始人融资 300 万美元，建设语音 AI 基础设施"],
    [/riseuplabs\.com.*cost.*implementing-ai/u, "2026 年企业实施 AI 的真实成本"],
    [/github\.com.*agent-ready-enterprise/u, "面向 Agent-ready 企业的 AI 开发者平台"],
    [/avasant\.com.*advanced-voice-ai/u, "2026 年高级语音 AI 平台市场观察"],
    [/firecrawl\.dev.*frameworks.*ai-agents/u, "2026 年构建 AI Agent 的开源框架"],
    [/github\.com.*governing-agents/u, "GitHub Enterprise 中的 Agent 治理"],
    [/kpmg.*procurement.*intelligent/u, "KPMG：用智能技术改造采购流程"],
    [/bidnetdirect.*2668201217/u, "NIST 寻求承包商提供 AI 模型托管和推理服务"],
    [/linkedin.*sunita-verma.*inference/u, "Sunita Verma：推理成本两年下降 280 倍"],
    [/fortunebusinessinsights.*ai-saas-market/u, "AI SaaS 市场规模与预测（至 2034 年）"],
    [/protopia.*protopia-ai-on-aws/u, "Protopia AI 现已登陆 AWS Marketplace"],
    [/huggingface.*rdjarbeng.*yc-rfs/u, "Y Combinator RFS 数据集：创业方向分析"],
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
  byTitle.push(
    [/^How to govern AI agents in your GitHub Enterprise/iu, "GitHub Enterprise 中的 AI Agent 治理"],
    [/^Mercury 2, the first reasoning diffusion LLM, is now on Baseten/iu, "Baseten 上线 Mercury 2 推理扩散大模型"],
    [/^Bill Joplin.*ServiceTitan AI Voice Agent/iu, "Bill Joplin 使用 ServiceTitan AI 语音 Agent 处理 90% 以上来电"],
    [/^F2 Raises \$24M to Build AI for Private Credit/iu, "F2 融资 2400 万美元，建设私募信贷 AI 平台"],
    [/^Notch Raises \$30 Million to Build the AI Operating System for Regulated Industries/iu, "Notch 融资 3000 万美元，建设受监管行业 AI 操作系统"],
    [/^Poetic Raises \$50M Series A/iu, "Poetic 完成 5000 万美元 A 轮融资，自动化复杂企业流程"]
  );
  const titleMatch = byTitle.find(([pattern]) => pattern.test(text));
  if (titleMatch) return titleMatch[1];
  return sourceDerivedChineseTitleForEnglish(text, sourceUrl) || fallbackChineseTitleForEnglish(text, sourceUrl);
}

function chineseFactFromSource(title = "", sourceUrl = "") {
  const text = String(title || "");
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const source = `${text}\n${normalized}`;
  const rules = [
    [/Willow Launches with \$7M to Build the Future of Enterprise AI Agent Governance/iu, "Willow 原文标题包含启动、700 万美元融资和企业 AI Agent 治理三个事实点。"],
    [/INXM Raises €5\.7 Million Pre-Seed To Bridge The Gap Between Enterprise AI Demos And Real Operational Deployment/iu, "INXM 获得 570 万欧元 Pre-Seed 融资，原文标题说明其目标是弥合企业 AI 演示与真实运营部署之间的差距。"],
    [/World model maker Odyssey nabs \$1\.45B valuation, backed by Amazon and other big names/iu, "Odyssey 原文标题说明该世界模型公司获得 14.5 亿美元估值，并得到 Amazon 等机构支持。"],
    [/Announcing the Agentic Resource Discovery specification/iu, "Google Developers Blog 原文标题宣布 Agentic Resource Discovery 规范。"],
    [/Zhipu AI's GLM-5\.2 closes in on closed-source leaders in coding marathons/iu, "The Decoder 原文标题称智谱 AI 的 GLM-5.2 在编码马拉松中逼近闭源领先模型。"],
    [/New in Amazon Bedrock AgentCore: Build agents with broader knowledge and continuous learning/iu, "AWS 发布 Amazon Bedrock AgentCore 新功能，原文标题强调可构建拥有更广知识和持续学习能力的 Agent。"],
    [/voicerun-launches-full-stack-voice-ai-platform|VoiceRun Launches Full-Stack Voice AI Platform|VoiceRun gets \$5\.5M/iu, "VoiceRun 宣布推出企业级全栈语音 AI 平台，并完成 550 万美元种子轮融资；资金用于扩展语音 AI 解决方案和 go-to-market，面向从 demo / pilot 进入规模化部署的企业客户。"],
    [/applied-ai-case-studies|Applied AI Case Studies and Real-World Success Stories/iu, "GoGloby 汇总应用 AI 在客户运营、销售、内容和工作流中的案例，用于观察 AI 是否已经进入真实业务流程和可衡量成效。"],
    [/Ontora: AI agents that interviews every employee|ycombinator\.com\/companies\/ontora/iu, "Y Combinator 公司 Ontora 提供 AI Agent，用于访谈每位员工并把组织上下文交给企业 AI 工具，核心信号是企业内部知识采集和上下文传递流程的产品化。"],
    [/What a Claude-First Healthcare FDE Pod Actually Does|claude-first-healthcare-fde-pod/iu, "Genzeon Platforms 的 field note 描述 Claude 优先的医疗 FDE pod：由 Domain Operator 和 Forward Deployed Engineer 组成 2 人客户嵌入团队，把 agentic AI 交付到受监管支付方工作流。"],
    [/A Framework for Finding A Design Partner|a-framework-for-finding-a-design-partner/iu, "Andreessen Horowitz 发布寻找设计伙伴的框架，材料重点是创业公司在产品设计、用户反馈和早期客户验证中的协作机制。"],
    [/Introducing Amazon Bedrock Managed Knowledge Base|bedrock-managed-knowledge-base/iu, "AWS 发布 Amazon Bedrock Managed Knowledge Base，帮助开发者用企业自有数据更快构建生成式 AI 应用，并降低自建 RAG 管线、连接器和权限处理的复杂度。"],
    [/Enterprise AI Rollout Failures: Causes and Case Studies|enterprise-ai-rollout-failures/iu, "Intuition Labs 分析企业 AI 推广失败原因与案例，指出数据准备、系统集成、治理、组织变更和 ROI 预期是企业 AI 项目落地失败的关键约束。"],
    [/Governed AI Agents: How to Deploy and Scale with Confidence|ai-agents-deployment-and-governance/iu, "Boomi 讨论受治理 AI Agent 的部署与规模化，重点是企业在可靠性、安全、治理和集成要求下如何把 Agent 从试点推进到生产环境。"],
    [/blogs\.nvidia\.com\/blog\/2026-ces-special-presentation|NVIDIA Rubin Platform|open models|autonomous driving/iu, "NVIDIA 在 CES 展示 Rubin 平台、开放模型与自动驾驶路线，材料聚焦其下一代 AI 基础设施与落地能力布局。"],
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
  rules.push(
    [/Bill Joplin.*ServiceTitan AI Voice Agent/iu, "Bill Joplin's Air Conditioning and Heating 在旺季前使用 ServiceTitan AI Voice Agent 处理预约来电，公开标题称该 AI 语音 Agent 预订了 90% 以上来电。"],
    [/Mercury 2, the first reasoning diffusion LLM, is now on Baseten/iu, "Baseten 上线 Mercury 2 推理扩散大模型，材料重点是把新的推理模型部署到 Baseten 平台供开发和推理工作负载使用。"],
    [/F2 Raises \$24M to Build AI for Private Credit/iu, "F2 完成 2400 万美元融资，产品方向是面向私募信贷市场构建 AI 平台。"],
    [/Notch Raises \$30 Million to Build the AI Operating System for Regulated Industries/iu, "Notch 完成 3000 万美元融资，计划建设面向受监管行业的 AI 操作系统。"],
    [/Poetic Raises \$50M Series A/iu, "Poetic 完成 5000 万美元 A 轮融资，方向是用可靠 AI 自动化复杂企业流程。"],
    [/github-devops-agenticai|GitHub.*DevOps.*agentic/iu, "LinkedIn 帖子讨论 GitHub、DevOps 与 Agentic AI 结合的企业工作流场景，属于开发运维流程中的 Agent 应用线索。"]
  );
  const match = rules.find(([pattern]) => pattern.test(source));
  if (match) return match[1];
  // Fallback: if the title already has Chinese content, use it as a basic fact
  const cjkChars = (text.match(/[\u4e00-\u9fff]/gu) || []).length;
  if (cjkChars >= 8) return short(text, 320);
  return fallbackChineseFactForEnglish(text, sourceUrl);
}

function frontstageChineseTitle(title = "", sourceUrl = "") {
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const rules = [
    [/blogs\.nvidia\.com\/blog\/2026-ces-special-presentation/u, "NVIDIA 在 CES 展示 Rubin 平台、开放模型与自动驾驶蓝图"],
    [/hpcwire\.com.*tensormesh-raises-20m-launches-ai-inference-platform/u, "Tensormesh \u5728 HPCwire \u53d1\u5e03 2000 \u4e07\u7f8e\u5143\u878d\u8d44\u4e0e AI \u63a8\u7406\u5e73\u53f0"],
    [/happyrobot\.ai\/customer-story\/kuehne-nagel/u, "Kuehne+Nagel \u4e0e HappyRobot\uff1aAI \u8fdb\u5165\u7269\u6d41\u8ba2\u5355\u548c\u90ae\u4ef6\u5904\u7406"],
    [/mariothomas\.com\/blog\/inference-migration/u, "Mario Thomas\uff1a\u6d88\u8d39\u7ea7 Agent \u7ecf\u9a8c\u8fdb\u5165\u4f01\u4e1a AI \u4e0b\u4e00\u9636\u6bb5"],
    [/mindstudio\.ai\/blog\/build-saas-with-ai-agents-1m-arr-case-study/u, "MindStudio\uff1a\u7528 AI Agent \u6784\u5efa\u5730\u4ea7\u5f00\u53d1\u4e0e\u5efa\u7b51\u8bbe\u8ba1 SaaS \u4ea7\u54c1"],
    [/saastr\.com\/the-wave-of-ai-agent-churn-to-come-prompts-are-portable/u, "SaaStr\uff1aAgent \u63d0\u793a\u53ef\u8fc1\u79fb\u5e26\u6765\u5ba2\u6237\u6d41\u5931\u98ce\u9669"],
    [/instagram\.com\/reel\/dzdwa08yixg/u, "Instagram\uff1aAI \u65f6\u4ee3\u4f01\u4e1a\u5185\u90e8\u77e5\u8bc6\u6210\u4e3a\u5173\u952e\u8d44\u4ea7"],
    [/foundra\.ai\/key-reads\/why-vertical-ai-is-the-real-moat/u, "Time Founders\uff1a\u5782\u76f4 AI \u6210\u4e3a\u9996\u6b21\u521b\u4e1a\u8005\u62a4\u57ce\u6cb3"],
    [/latent\.space\/p\/cuspai/u, "Latent Space\uff1aCuspAI \u7528 AI \u641c\u7d22\u6f5c\u5728\u6750\u6599\u7a7a\u95f4"],
    [/latent\.space\/p\/video-agents/u, "Latent Space\uff1a\u89c6\u9891 Agent \u6a21\u578b\u6210\u4e3a\u591a\u6a21\u6001\u5e94\u7528\u65b0\u65b9\u5411"],
    [/blog\.mean\.ceo\/vertical-ai-startup-statistics-by-industry/u, "Mean CEO\uff1a\u6309\u884c\u4e1a\u62c6\u89e3\u5782\u76f4 AI \u521b\u4e1a\u516c\u53f8\u7edf\u8ba1"],
    [/vntr\.vc\/media\/the-vertical-software-window/u, "VNTR\uff1a\u884c\u4e1a\u5782\u76f4 AI \u5de5\u5177\u5438\u5f15\u6218\u7565\u8d44\u672c"],
    [/bizdata360\.com\/benefit-most-from-ai-workflow-automation/u, "Bizdata360\uff1a5 \u4e2a\u884c\u4e1a\u6700\u53ef\u80fd\u53d7\u76ca\u4e8e AI \u5de5\u4f5c\u6d41\u81ea\u52a8\u5316"],
    [/databricks\.com\/blog\/state-ai-enterprise-adoption-growth-trends/u, "Databricks\uff1a\u4f01\u4e1a AI \u91c7\u7528\u4e0e\u589e\u957f\u8d8b\u52bf"],
    [/sycamore\.so\/press-releases\/sycamore-raises-65m-seed/u, "Sycamore 融资 6500 万美元，建设企业 Agent 操作系统"],
    [/infoworld\.com.*github-launches-agent-hq/u, "GitHub 推出 Agent HQ，统一管理 AI 编码代理"],
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
    [/a16z\.com\/announcement\/investing-in-lio/u, "a16z 投资 Lio，押注垂直 AI 基础设施"],
    [/gist\.github\.com\/anthonyalcaraz\/7b2e6e454cdbbb2a02d99a435e9a68d9/u, "Agent 基础设施：访问权限成为真正前沿"],
    [/linkedin\.com\/pulse\/vertical-ai-investing-foundations-future/u, "Vertical AI：投资未来的基础设施"],
    [/growthlist\.co\/ai-startups/u, "GrowthList：2026 年已融资 AI 创业公司数据库"],
    [/partners\.wsj\.com\/broadcom\/powering-the-ai-revolution/u, "WSJ / Broadcom：下一代企业 AI 基础设施"],
    [/partners\.wsj\.com\/capgemini\/the-business-of-ai/u, "WSJ / Capgemini：生成式 AI 如何改变软件工程"],
    [/heliad\.com\/highlights\/lio-technologies-raises-30m/u, "Lio Technologies 融资 3000 万美元，用 Agentic AI 改造企业采购"],
    [/tech\.eu.*archestraai-raises-10m/u, "Archestra.AI 融资 1000 万美元，解锁下一代 Agentic 用例"],
    [/market\.us\/report\/voice-ai-agents-market/u, "语音 AI Agent 市场预计以 34.8% 年复合增长率扩张"],
    [/cfodive\.com.*bristol-myers-ai-powered-procurement/u, "Bristol Myers 用 AI 改造采购流程"],
    [/activantcapital\.com\/research\/voice-agents-2-0/u, "Activant：语音 Agent 2.0 正进入客户工作流"],
    [/techtarget\.com.*merck-home-depot-tap-gemini-enterprise/u, "Merck 和 Home Depot 使用 Gemini Enterprise 开发 AI Agent"],
    [/linkedin\.com\/posts\/ningz_/u, "用 VSCode 和 GitHub 进行 AI 软件开发"],
    [/ithome\.com\/0\/961\/868/u, "Cursor 欧洲总部落子伦敦，SpaceX 获 600 亿美元收购选择权"],
    [/x\.com\/testingcatalog\/status\/2064410031144014090/u, "Creatify Agent Wave 2：从广告制作到全自动跨平台发布"],
    [/aarushgupta\.io\/posts\/kan-fpga/u, "基于 KAN 的 FPGA 超高速机器学习方案"],
    [/sievo\.com\/resources\/ai-in-procurement/u, "Sievo：企业 AI 采购实战指南"],
    [/the-decoder\.com\/apple-intelligence-gets-a-second-go/u, "Apple Intelligence 借助 Google 和 Nvidia 再获新生"],
    [/huggingface\.co\/blog\/mishig\/spaces-agents-md/u, "Hugging Face：Agent 链式调用两个 Space 构建 3D 巴黎画廊"],
    [/techcrunch\.com.*token-bill-comes-due/u, "AI token 账单压力迫使行业管理推理成本"],
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
    [/blogs\.nvidia\.com\/blog\/2026-ces-special-presentation/u, "NVIDIA"],
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
    [/bidnetdirect\.com\/public\/supplier\/solicitations\/statewide\/2668201217/u, "NIST / AI model hosting"],
    [/a16z\.com\/announcement\/investing-in-lio/u, "Lio"],
    [/linkedin\.com\/posts\/sunita-verma/u, "Sunita Verma"],
    [/anthropic\.com\/research\/agents-in-biology/u, "Anthropic / Biology Agents"],
    [/gist\.github\.com\/AnthonyAlcaraz\/7b2e6e454cdbbb2a02d99a435e9a68d9/u, "Agentic Access Infrastructure"],
    [/ithome\.com\/0\/961\/576/u, "欧菲光 / Dex400R"],
    [/ithome\.com\/0\/961\/600/u, "Arm / AppReady for Windows"],
    [/ithome\.com\/0\/961\/640/u, "天工3.0 / 地瓜机器人"],
    [/ithome\.com\/0\/961\/659/u, "小米 / MiMo"],
    [/ithome\.com\/0\/961\/691/u, "Apple / Siri AI"],
    [/ithome\.com\/0\/961\/680/u, "Apple / Siri AI"],
    [/ithome\.com\/0\/961\/675/u, "Apple / Siri AI"],
    [/ithome\.com\/0\/961\/669/u, "Apple / Siri AI"],
    [/ithome\.com\/0\/961\/724/u, "Meta"],
    [/ithome\.com\/0\/961\/730/u, "华为 / Apple / Moonshot AI"],
    [/marktechpost\.com.*google-research-adds-agentic-rag/u, "Google Research / Gemini Enterprise"],
    [/marktechpost\.com.*microsoft-ai-introduces-mai-transcribe/u, "Microsoft AI"],
    [/marktechpost\.com.*xiaomi-mimo-and-tilert/u, "小米 / MiMo"],
    [/partners\.wsj\.com\/broadcom/u, "Broadcom / WSJ"],
    [/partners\.wsj\.com\/capgemini/u, "WSJ / Capgemini"],
    [/bidnetdirect\.com.*2668201217/u, "NIST"],
    [/a16z\.com\/announcement\/investing-in-lio/u, "Lio / a16z"],
    [/linkedin\.com.*sunita-verma/u, "Sunita Verma"],
    [/anthropic\.com\/research\/agents-in-biology/u, "Anthropic / Biology Agents"],
    [/gist\.github\.com\/AnthonyAlcaraz/u, "Anthony Alcaraz"],
    [/heliad\.com\/highlights\/lio-technologies-raises-30m/u, "Lio"],
    [/tech\.eu.*archestraai-raises-10m/u, "Archestra.AI"],
    [/market\.us\/report\/voice-ai-agents-market/u, "语音 AI Agent"],
    [/cfodive\.com.*bristol-myers-ai-powered-procurement/u, "Bristol Myers Squibb"],
    [/activantcapital\.com\/research\/voice-agents-2-0/u, "Activant / Voice Agents"],
    [/techtarget\.com.*merck-home-depot-tap-gemini-enterprise/u, "Merck / Home Depot / Google Gemini"],
    [/linkedin\.com\/posts\/ningz_/u, "VSCode / GitHub"],
    [/blog\.mean\.ceo\/vertical-ai-startup-statistics-by-industry/u, "Vertical AI startup statistics"],
    [/ithome\.com\/0\/961\/868/u, "Cursor / SpaceX"],
    [/x\.com\/testingcatalog\/status\/2064410031144014090/u, "Creatify"],
    [/aarushgupta\.io\/posts\/kan-fpga/u, "KAN / FPGA"],
    [/sievo\.com\/resources\/ai-in-procurement/u, "Sievo"],
    [/the-decoder\.com\/apple-intelligence-gets-a-second-go/u, "Apple Intelligence / Google / Nvidia"],
    [/huggingface\.co\/blog\/mishig\/spaces-agents-md/u, "Hugging Face Spaces Agent"],
    [/huggingface\.co\/blog\/coherelabs\/introducing-north-mini-code/u, "Cohere / North Mini Code"],
    [/arstechnica\.com.*gemini-3-5-live-translate/u, "Google Gemini Live Translate"],
    [/techcrunch\.com.*token-bill-comes-due/u, "AI token costs"],
    [/mindstudio\.ai.*build-saas-with-ai-agents/u, "MindStudio"],
    [/github\.com\/resources\/insights\/enterprise-content-roundup/u, "GitHub Enterprise"],
    [/ithome\.com\/0\/963\/999/u, "三星 / 海上 AI 数据中心"],
    [/ithome\.com\/0\/963\/986/u, "KPMG"],
    [/ithome\.com\/0\/963\/998/u, "三星 / AI 数据中心"],
    [/ithome\.com\/0\/963\/907/u, "科大讯飞 / 星火 X2-VL"],
    [/ithome\.com\/0\/963\/924/u, "京东健康 / 友谊医院消化大模型"],
    [/the-decoder\.com.*moonshots-open-model-kimi/u, "Moonshot AI / Kimi K2.7 Code"],
    [/the-decoder\.com.*claude-fable-5-outpaces/u, "Anthropic / Claude Fable 5"],
    [/the-decoder\.com.*us-government-forces-anthropic/u, "Anthropic / Claude Fable 5"],
  ];
  const match = rules.find(([pattern]) => pattern.test(normalized));
  if (match) return match[1];
  if (/^京东健康与北京友谊医院/u.test(title)) return "京东健康 / 北京友谊医院";
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
  const titleSubject = normalizeSubject(subjectFromTitle(title) || subjectFromTitle(rawTitle));
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
  const titleSubject = normalizeSubject(subjectFromTitle(title) || subjectFromTitle(rawTitle));
  if (urlSubject) return urlSubject;
  if (
    explicit
    && !subjectLooksLikeTitle(explicit)
    && !subjectMatchesDisplayTitle(explicit, title, rawTitle)
  ) return explicit;
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
      rawTitle = sourceTitleFromFullText(fullText, json.title || "");
      visibleFragment = short(fullText, 360);
      businessElements = json.business_elements || {};
      evidenceSeed = json.evidence_seed || {};
    } catch {
      // Keep the card usable even if a raw snapshot is malformed.
    }
  }

  if (rawArchive && fs.existsSync(rawArchive)) {
    const snapshot = read(rawArchive);
    if (!visibleFragment) visibleFragment = short(snapshot.replace(/^---[\s\S]*?---/u, ""), 360);
    rawTitle = sourceTitleFromFullText(snapshot, rawTitle);
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
    .filter((item) => !isUntranslatedPublicEnglish(item))
    .filter((item) => !textRepeatsAny(item, existing));
  if (!candidates.length) {
    const fallback = fallbackChineseFactForEnglish(rawDisplayTitle || raw.rawTitle, sourceUrl);
    if (fallback && !textRepeatsAny(fallback, existing)) candidates.push(fallback);
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
  if (isSubstantiveSourceFragment(visible) && !isUntranslatedPublicEnglish(visible)) return visible;
  const highlightExcerpt = highlights.find((item) => hasCjk(item) && !/^原始来源|本地 Raw\/Pool/u.test(item) && !/原题为/u.test(item) && isSubstantiveSourceFragment(item));
  if (highlightExcerpt) return highlightExcerpt;
  return fallbackChineseFactForEnglish(rawDisplayTitle || raw.rawTitle, raw.sourceUrl);
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
  ["amazon", /\bAWS\b|\bAmazon\b|\bAmazon\s+Bedrock\b/iu],
  ["meta", /\bMeta\b|\bLlama\b/iu],
  ["apple", /\bApple\b/iu],
  ["oracle", /\bOracle\b/iu],
  ["ibm", /\bIBM\b/iu],
  ["salesforce", /\bSalesforce\b/iu],
  ["alibaba", /\bAlibaba\b|\bQwen\b|\bTongyi\b|阿里巴巴|通义千问/iu],
];

const FRONTSTAGE_TOP10_LIMIT = 10;
const FRONTSTAGE_LARGE_COMPANY_TOTAL_LIMIT = 3;
const FRONTSTAGE_LARGE_COMPANY_PER_COMPANY_LIMIT = 1;

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

function isGenericSourceFallback(value = "") {
  const text = String(value || "");
  if (/公开材料提供了一条可追踪的\s*AI\s*商业信号|需继续核对客户、产品和业务结果/iu.test(text)) return true;
  return /公开材料提供了一条可追踪的 AI 商业信号|需继续核对客户、产品和业务结果|鍏紑鏉愭枡鎻愪緵浜嗕竴鏉″彲杩借釜/iu.test(String(value || ""));
}

function isSourceLinkOnlyFact(value = "") {
  return /^原始来源链接：?https?:\/\//iu.test(String(value || "").trim());
}

function hasSourceBackedFrontstageFact(card = {}) {
  const facts = [
    card.translatedFact,
    card.visibleFragment,
    ...(card.originalHighlights || []),
  ].filter(Boolean);
  return facts.some((item) => (
    isSubstantiveSourceFragment(item)
    && !isGenericSourceFallback(item)
    && !isSourceLinkOnlyFact(item)
  ));
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

function buildDailyFrontstageSelection(
  cards = [],
  limit = FRONTSTAGE_TOP10_LIMIT,
  largeVendorTotalLimit = FRONTSTAGE_LARGE_COMPANY_TOTAL_LIMIT,
  largeVendorPerCompanyLimit = FRONTSTAGE_LARGE_COMPANY_PER_COMPANY_LIMIT
) {
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
      .filter(hasSourceBackedFrontstageFact)
      .filter(publicCandidateIsDisplayReady)
      .sort((a, b) => b.frontstageRankScore - a.frontstageRankScore || a.id.localeCompare(b.id));
    const preferredIds = new Set(preferred.map((card) => card.id));
    const fallback = coreCandidates
      .filter((card) => !preferredIds.has(card.id))
      .filter(hasSourceBackedFrontstageFact)
      .filter(publicCandidateIsDisplayReady)
      .sort((a, b) => b.frontstageRankScore - a.frontstageRankScore || a.id.localeCompare(b.id));
    const ranked = [...preferred, ...fallback];
    const rankedIds = new Set(ranked.map((card) => card.id));
    const nonLargeCoreFill = coreCandidates
      .filter((card) => !rankedIds.has(card.id))
      .filter((card) => !card.largeVendorKey)
      .filter((card) => !card.frontstageGenericCandidate)
      .filter((card) => card.sourceUrl && card.translatedFact && card.frontstageEvidenceScore >= 20)
      .filter(publicCandidateIsDisplayReady)
      .sort((a, b) => b.frontstageRankScore - a.frontstageRankScore || a.id.localeCompare(b.id));
    const rejected = [];
    const selectedForDate = [];
    const selectedIds = new Set();
    let nonLargeCoreFillCount = 0;
    const largeCompanyCandidateCount = annotated.filter((card) => card.largeVendorKey).length;
    const canSelectUnderLargeCompanyCap = (card, stage) => {
      if (!card.largeVendorKey) return true;
      const vendorCount = largeVendorCounts.get(card.largeVendorKey) || 0;
      if (largeVendorTotal >= largeVendorTotalLimit) {
        rejected.push({ id: card.id, reason: "large-company total cap", stage });
        return false;
      }
      if (vendorCount >= largeVendorPerCompanyLimit) {
        rejected.push({ id: card.id, reason: `same large-company cap: ${card.largeVendorKey}`, stage });
        return false;
      }
      return true;
    };
    const noteLargeCompanySelection = (card) => {
      if (!card.largeVendorKey) return;
      const vendorCount = largeVendorCounts.get(card.largeVendorKey) || 0;
      largeVendorTotal += 1;
      largeVendorCounts.set(card.largeVendorKey, vendorCount + 1);
    };
    const selectCard = (card, selectionTier) => {
      noteLargeCompanySelection(card);
      const selectedCard = {
        ...card,
        summary: card.frontstageValueDescription,
        frontstageSelectionTier: selectionTier,
        frontstageSupplyFill: selectionTier !== "editorial",
      };
      selected.push(selectedCard);
      selectedForDate.push(selectedCard);
      selectedIds.add(card.id);
      datePicked += 1;
    };
    for (const card of ranked) {
      if (datePicked >= limit) break;
      if (isDuplicateFrontstageEvent(card, selectedForDate)) {
        rejected.push({ id: card.id, reason: "duplicate event already selected" });
        continue;
      }
      if (!canSelectUnderLargeCompanyCap(card, "editorial-selection")) continue;
      const selectionTier = preferredIds.has(card.id) ? "editorial" : "supply-fill";
      selectCard(card, selectionTier);
    }
    for (const card of ranked) {
      if (datePicked >= limit) break;
      if (selectedIds.has(card.id)) continue;
      if (isDuplicateFrontstageEvent(card, selectedForDate)) {
        rejected.push({ id: card.id, reason: "duplicate event already selected in relaxed fill" });
        continue;
      }
      if (!canSelectUnderLargeCompanyCap(card, "quota-safe-fill")) continue;
      selectCard(card, "quota-safe-fill");
    }
    for (const card of nonLargeCoreFill) {
      if (datePicked >= limit) break;
      if (selectedIds.has(card.id)) continue;
      if (isDuplicateFrontstageEvent(card, selectedForDate)) {
        rejected.push({ id: card.id, reason: "duplicate event already selected in non-large core fill" });
        continue;
      }
      selectCard(card, "non-large-core-fill");
      nonLargeCoreFillCount += 1;
    }
    reports.push({
      date,
      target: limit,
      candidateCount: items.length,
      coreCandidateCount: coreCandidates.length,
      qualifiedCount: preferred.length,
      selectedCount: datePicked,
      supplyConstrained: preferred.length < limit,
      largeCompanyTotalLimit: largeVendorTotalLimit,
      largeCompanyPerCompanyLimit: largeVendorPerCompanyLimit,
      largeCompanyCandidateCount,
      largeCompanySelectedCount: largeVendorTotal,
      largeCompanySelectedByVendor: Object.fromEntries([...largeVendorCounts.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
      nonLargeCoreFillCount,
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
  if (/source_auditability/iu.test(issue)) return "来源不可审计，需要补齐原文或来源等级";
  if (/evidence_quality:stale_source_date/iu.test(issue)) return "来源时间过旧，适合保留为背景证据";
  if (/evidence_quality/iu.test(issue)) return "原文证据质量不完整，需要补采全文、摘录或哈希";
  if (/business_signal_scope/iu.test(issue)) return "不属于产品、融资或案例类商业信号";
  if (/valid_page_type/iu.test(issue)) return "页面类型不适合直接成卡，需要回到具体事件页";
  if (/commercial_importance/iu.test(issue)) return "商业重要性不足，暂留为候选池证据";
  if (/fact_type_constraints:.*funding_not_single_company_round/iu.test(issue)) return "融资信息不是单一公司轮次事件";
  if (/fact_type_constraints/iu.test(issue)) return "事实类型不满足正式商业信号卡约束";
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
  if (/source_auditability/iu.test(text)) return "补齐可审计原文链接、来源等级，避免只依赖搜索入口或聚合页。";
  if (/evidence_quality:stale_source_date/iu.test(text)) return "补充同一事件的近期来源；否则仅作为背景证据保留。";
  if (/evidence_quality/iu.test(text)) return "修复 Raw 采集，补齐原文链接、全文、摘录、哈希和抽取方法。";
  if (/business_signal_scope/iu.test(text)) return "只把产品/服务、融资、客户案例或垂直部署事件推进为 Signal Card。";
  if (/valid_page_type/iu.test(text)) return "回到有日期、主体、动作的单一公司事件页后再晋级。";
  if (/commercial_importance/iu.test(text)) return "保留为 Pool 证据；除非补到清晰商业动作、客户、融资或部署信号。";
  if (/fact_type_constraints:.*funding_not_single_company_round/iu.test(text)) return "补齐单一公司的融资金额、轮次、投资方和日期。";
  if (/fact_type_constraints/iu.test(text)) return "用原始报道、公司公告或一手材料替代评论、反馈或非商业政策材料。";
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

function corePoolCandidateEventKey(item = {}) {
  const text = [
    item.title,
    item.originalTitle,
    item.summary,
    item.sourceUrl,
    item.subject,
  ].filter(Boolean).join(" ").toLowerCase();
  if (/minimax/iu.test(text) && /\bm3\b/iu.test(text)) return `${item.date}|candidate|minimax|m3`;
  if (/mistral/iu.test(text) && /(funding|financing|valuation|round|融资|估值|欧元|billion|30亿|200亿)/iu.test(text)) {
    return `${item.date}|candidate|mistral|funding`;
  }
  const amount = text.match(/(?:\$|€|eur|usd)?\s?\d+(?:\.\d+)?\s?(?:m|b|million|billion|亿|万)?/iu)?.[0] || "";
  const subject = normalizedComparableText(item.subject || item.title || item.originalTitle).slice(0, 56);
  const title = normalizedComparableText(item.originalTitle || item.title).slice(0, 92);
  return `${item.date}|candidate|${item.category}|${subject}|${amount || title}`;
}

function corePoolCandidateQuality(item = {}) {
  let score = Number(item.frontstageRankScore) || 0;
  if (item.promotionStatus === "promoted_to_signal_card") score += 100000;
  if (item.sourceUrl && !isSocialOrCommunitySourceUrl(item.sourceUrl)) score += 1000;
  if (item.originalHighlights?.length) score += 100;
  if (item.translatedFact || item.summary) score += 40;
  return score;
}

function dedupeCorePoolCandidateItems(items = []) {
  const byKey = new Map();
  for (const item of items) {
    const key = corePoolCandidateEventKey(item);
    const current = byKey.get(key);
    if (!current || corePoolCandidateQuality(item) > corePoolCandidateQuality(current)) {
      byKey.set(key, item);
    }
  }
  return [...byKey.values()];
}

function buildCorePoolCandidateItems(cards = [], activeDate = "") {
  const cardsByUrl = new Map(cards.map((card) => [canonicalUrl(card.sourceUrl), card]).filter(([url]) => url));
  const notPromotedByRef = corePoolNotPromotedMap(activeDate);
  const items = poolCandidateSectionsForDate(activeDate)
    .filter((section) => splitCsv(poolValue(section, "pool_routes")).includes("core_pool"))
    .filter((section) => isPublicBusinessSignalEligible({
      title: poolTitle(section),
      originalTitle: poolTitle(section),
      sourceUrl: poolValue(section, "source_url"),
      sourceTitle: poolTitle(section),
    }))
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
      const item = {
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
      if (!hasSourceBackedFrontstageFact(item)) return null;
      return item;
    })
    .filter(Boolean);
  return dedupeCorePoolCandidateItems(items)
    .sort((a, b) => (Number(b.frontstageRankScore) || 0) - (Number(a.frontstageRankScore) || 0) || String(a.sourceRef || a.id).localeCompare(String(b.sourceRef || b.id)));
}

function isEnterpriseAiLensPoolSection(section = "") {
  const text = [
    poolTitle(section),
    poolValue(section, "source_url"),
    poolValue(section, "source"),
    poolValue(section, "search_path"),
    poolValue(section, "search_intent"),
    poolValue(section, "key_excerpts"),
    poolValue(section, "evidence_seed"),
    poolValue(section, "missing_information"),
  ].filter(Boolean).join(" ");
  const implementation = /FDE|forward deployed|customer-embedded|domain operator|production environment|regulated payer workflow|implementation|workflow|deployment|rollout|customer adoption|case study|business process|pilot|procurement|technical scoping|系统设计|客户嵌入|生产环境|生产上线|业务流程|实施|部署|落地|试点|采购|交付/iu.test(text);
  const broadGovernance = /world leaders|turn it off|G7|sovereign AI|national security|国家安全|峰会|领导人|关闭模型访问/iu.test(text);
  return implementation && (!broadGovernance || /workflow|deployment|customer|production|business process|业务流程|部署|客户|生产/iu.test(text));
}

function buildEnterpriseAiLensCandidateItems(cards = [], activeDate = "") {
  const cardsByUrl = new Map(cards.map((card) => [canonicalUrl(card.sourceUrl), card]).filter(([url]) => url));
  return poolCandidateSectionsForDate(activeDate)
    .filter((section) => {
      const routes = splitCsv(poolValue(section, "pool_routes"));
      const supportText = [
        poolValue(section, "supporting_signals"),
        poolValue(section, "evidence_level"),
      ].join(" ");
      return routes.includes("core_pool") || /enterprise_ai_transformation_lens|core_evidence_candidate/iu.test(supportText);
    })
    .filter(isEnterpriseAiLensPoolSection)
    .map((section) => {
      const ref = poolRef(section);
      const sourceUrl = poolValue(section, "source_url");
      const card = cardsByUrl.get(canonicalUrl(sourceUrl));
      if (card) return card;
      const rawTitle = poolTitle(section);
      const title = frontstageChineseTitle(rawTitle, sourceUrl) || translateEnglishTitle(rawTitle, sourceUrl) || rawTitle;
      const category = poolCandidateCategory(section);
      const fact = corePoolCandidateFact(section, rawTitle, sourceUrl);
      const importanceScore = Number(poolValue(section, "importance_score")) || 0;
      const score = Number(poolValue(section, "score")) || 0;
      const poolRoutes = splitCsv(poolValue(section, "pool_routes"));
      const item = {
        id: `POOL-${activeDate}-${ref}`,
        type: "enterprise_ai_lens_candidate",
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
        poolRoutes,
        publishedAt: "",
        tags: {},
        flatTags: ["track-enterprise-workflow", "customer-enterprise"],
        displayTags: sanitizeDisplayTags([{ id: category, label: categoryLabels[category] || category }]),
        summary: fact,
        translatedFact: fact,
        originalHighlights: [fact].filter(Boolean),
        visibleFragment: fact,
        sourceLinks: [sourceUrl].filter(Boolean),
        status: "pooled",
        assetLevel: "enterprise_ai_lens",
        promotionStatus: "enterprise_ai_lens_only",
        evidenceGate: poolValue(section, "evidence_level") || "core_evidence_candidate",
        stage: "",
        evidence: "",
        track: "",
        largeVendorKey: largeVendorKeyForCard({ title: rawTitle, sourceUrl }),
        largeVendor: Boolean(largeVendorKeyForCard({ title: rawTitle, sourceUrl })),
        frontstageRankScore: score * 100 + importanceScore * 10 + 150,
        frontstageEditorialScore: score * 100 + importanceScore * 10 + 150,
        frontstageEvidenceScore: Number(poolValue(section, "readability_score")) || 0,
        frontstageSelectionReasons: ["企业AI化 / FDE 镜头候选", "保留为实施、部署和工作流证据"],
        frontstageValueDescription: "该条目用于企业AI化 / FDE 镜头，不改变正式 Top10 Signal Card 类型。",
        frontstageQualityWarnings: [],
        frontstageGenericCandidate: false,
        fromCorePool: poolRoutes.includes("core_pool"),
        enterpriseAiLensPriority: true,
        sourceRef: ref,
      };
      if (!hasSourceBackedFrontstageFact(item)) return null;
      return item;
    })
    .filter(Boolean)
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
  const [newsFactSection = "", originalPointsSection = "", valueSection = "", visibleFragmentSection = ""] = orderedSectionBodies(text);
  const markdownFact = short(sectionLines(newsFactSection).join(" "), 320);
  const markdownHighlights = uniqueNonRepeatingLines(
    sectionLines(originalPointsSection)
      .filter((line) => !/鍘熸枃鏈彁渚涙洿澶氬彲鎷嗗垎浜嬪疄鐐?/u.test(line)),
    [],
    8
  );
  const markdownValue = short(sectionLines(valueSection).join(" "), 260);
  const markdownVisibleFragment = short(sectionLines(visibleFragmentSection).join(" "), 320);
  const rawTitle = sourceTitleFromFullText(raw.fullText, raw.rawTitle || rawTitleFromArchive || "");
  const sourceUrl = primarySourceUrl || raw.sourceUrl;
  const explicitSourceName = scalar(fm, "source_name") || raw.sourceName || "";
  const sourceName = explicitSourceName && !isDiscoveryLabel(explicitSourceName)
    ? explicitSourceName
    : domain(sourceUrl) || explicitSourceName || "未标注来源";

  const sourceLevel = String(nestedScalar(fm, "primary_raw", "source_level") || scalar(fm, "source_level") || "").toUpperCase();
  const importanceScore = Number(nestedScalar(fm, "primary_raw", "importance_score") || scalar(fm, "importance_score") || 0) || 0;
  const explicitDisplayTitle = nestedScalar(fm, "frontend", "displayTitle") || scalar(fm, "title") || "";
  const rawDisplayTitle = frontstageTitle(rawTitle || explicitDisplayTitle || path.basename(file, ".md"), rawTitle);
  const title = frontstageChineseTitle(explicitDisplayTitle || rawDisplayTitle, sourceUrl)
    || safeFrontstageTitle(explicitDisplayTitle || rawDisplayTitle, sourceUrl)
    || explicitDisplayTitle
    || rawDisplayTitle;
  const titleFact = sourceTitleDerivedFact(rawDisplayTitle || title, sourceUrl);
  let originalHighlights = buildOriginalHighlights(raw, rawDisplayTitle, sourceUrl, [titleFact]);
  if (!originalHighlights.length) originalHighlights = markdownHighlights;
  if (!originalHighlights.length) originalHighlights = fallbackSourcePoints(rawDisplayTitle, sourceUrl, rawRef);
  const sourceEvidenceExcerpt = buildSourceExcerpt(raw, originalHighlights, rawDisplayTitle);
  const evidenceFact = originalHighlights.find((item) => (
    isSubstantiveSourceFragment(item)
    && !isGenericSourceFallback(item)
    && !isSourceLinkOnlyFact(item)
    && !isInternalEvidenceDump(item)
    && !textRepeatsAny(item, [title], 0.9)
  )) || "";
  const translatedFact = evidenceFact
    || (markdownFact && !publicFactLooksLikeTemplateFallback(markdownFact) ? markdownFact : "")
    || (!isGenericSourceFallback(sourceEvidenceExcerpt) && !isSourceLinkOnlyFact(sourceEvidenceExcerpt) && !isInternalEvidenceDump(sourceEvidenceExcerpt) ? sourceEvidenceExcerpt : "")
    || (markdownVisibleFragment && !publicFactLooksLikeTemplateFallback(markdownVisibleFragment) ? markdownVisibleFragment : "")
    || titleFact;
  const sourceFact = translatedFact || originalHighlights.find((item) => !/^关键数字|原始来源|本地 Raw\/Pool/u.test(item)) || "";
  originalHighlights = uniqueNonRepeatingLines(
    originalHighlights.filter((item) => !/^原始来源标题|原始来源链接|本地 Raw\/Pool/u.test(item)),
    [sourceFact, title],
    8
  );
  const sourceExcerpt = buildSourceExcerpt(raw, originalHighlights, rawDisplayTitle);
  const visibleFragment = sourceExcerpt && !textRepeatsAny(sourceExcerpt, [sourceFact, title, ...originalHighlights], 0.72)
    ? sourceExcerpt
    : (markdownVisibleFragment && !textRepeatsAny(markdownVisibleFragment, [sourceFact, title, ...originalHighlights], 0.72) ? markdownVisibleFragment : "");
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
    summary: short(sourceValue || markdownValue || sourceFact, 260),
    translatedFact: short(sourceFact, 320),
    originalHighlights,
    visibleFragment,
    sourceLinks: [...new Set(sourceLinks)],
    sourceTitle: rawTitle || rawDisplayTitle,
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

function enterpriseTransformationText(card = {}) {
  return [
    card.title,
    card.displayTitle,
    card.originalTitle,
    card.subject,
    card.sourceName,
    card.sourceUrl,
    card.translatedFact,
    card.visibleFragment,
    ...(card.originalHighlights || []),
    ...(card.flatTags || []),
    ...(card.displayTags || []).map((tag) => tag.label || tag.id || tag),
  ].filter(Boolean).join(" ");
}

function enterpriseTransformationStage(card = {}, text = "") {
  const explicit = card.enterpriseAiTransformationStage || card.enterprise_ai_transformation_stage || "";
  if (explicit) return explicit;
  if (/governance|guardrail|security|compliance|risk|permission|identity|audit|合规|安全|权限|审计|治理|风险/iu.test(text)) return "governance";
  if (/deployed|deployment|rollout|production|at scale|customer adoption|case study|adopts|uses|上线|部署|落地|采用|规模化|客户案例/iu.test(text)) return "production_rollout";
  if (/pilot|poc|proof of concept|trial|prototype|beta|试点|验证|概念验证|内测/iu.test(text)) return "pilot";
  if (/platform|enterprise|copilot|gemini|bedrock|databricks|snowflake|api|agentcore|starter|平台|企业版|接入|集成|底座/iu.test(text)) return "platform_enablement";
  if (card.category === "case") return "production_rollout";
  if (card.category === "product-service") return "platform_enablement";
  return "ai_transformation";
}

function enterpriseTransformationStageLabel(stage = "") {
  return ({
    pilot: "试点验证",
    production_rollout: "生产上线",
    platform_enablement: "平台使能",
    governance: "治理边界",
    ai_transformation: "AI化进程",
  })[stage] || "AI化进程";
}

function enterpriseTransformationScenario(text = "", tags = []) {
  const source = `${text} ${tags.join(" ")}`;
  if (/red team|security testing|prompt injection|jailbreak|红队|安全测试|提示注入|越狱/iu.test(source)) return "安全与治理";
  if (/cms|content management|content operation|content workflow|内容管理|内容运营|内容创建|发布系统|本地化/iu.test(source)) return "内容运营";
  if (/notetaker|meeting|transcription|minutes|memo|shared memory|记事本|会议|笔记|转录|共享记忆/iu.test(source)) return "知识工作与协作";
  if (/procurement|purchase|supplier|supply chain|bidding|采购|供应商|供应链|招投标/iu.test(source)) return "采购与供应链";
  if (/support|customer service|contact center|sales|crm|客服|客户支持|销售|CRM|工单/iu.test(source)) return "客户服务与销售";
  if (/developer|github|code|software|engineering|devops|开发者|代码|软件研发|工程团队/iu.test(source)) return "软件研发";
  if (/legal|court|police|government|health|finance|insurance|regulat|司法|法院|警察|政务|医疗|金融|保险|监管/iu.test(source)) return "高合规行业";
  if (/data|warehouse|analytics|snowflake|databricks|knowledge|rag|数据|分析|知识库|检索/iu.test(source)) return "数据与知识工作";
  if (/retail|store|restaurant|manufacturing|factory|门店|零售|制造|工厂|餐饮/iu.test(source)) return "一线运营";
  return "企业工作流";
}

function enterpriseTransformationWorkflow(text = "", category = "") {
  if (/red team|security testing|prompt injection|jailbreak|红队|安全测试|提示注入|越狱/iu.test(text)) return "模型、Agent 与应用安全测试";
  if (/cms|content management|content operation|content workflow|内容管理|内容运营|内容创建|发布系统|本地化/iu.test(text)) return "内容生产、发布与治理流程";
  if (/notetaker|meeting|transcription|minutes|memo|shared memory|记事本|会议|笔记|转录|共享记忆/iu.test(text)) return "会议记录、知识沉淀与团队协作";
  if (/procurement|purchase|supplier|supply chain|bidding|采购|供应商|供应链|招投标/iu.test(text)) return "采购流程自动化与合规校验";
  if (/support|customer service|contact center|sales|crm|客服|客户支持|销售|CRM|工单/iu.test(text)) return "客服响应、线索跟进与知识检索";
  if (/insurance|underwriting|claims|risk underwriting|capital allocation|保险|承保|理赔|资本配置/iu.test(text)) return "承保、理赔与风险控制流程";
  if (/developer|github|code|software|engineering|devops|开发者|代码|软件研发|工程团队/iu.test(text)) return "代码、审查与交付流程";
  if (/data|warehouse|analytics|knowledge|rag|数据|分析|知识库|检索/iu.test(text)) return "企业数据接入与决策支持";
  if (/governance|security|compliance|permission|合规|安全|权限|治理/iu.test(text)) return "权限、合规与风险控制";
  if (category === "funding") return "预算、采购与供应商选择";
  return "把 Agent 或模型接入业务系统";
}

function enterpriseTransformationBoundary(card = {}) {
  const fact = cardSourceFact(card);
  if (!fact) return "仅确认存在公开信号，暂缺投入、ROI 与长期运行效果。";
  return short(`已确认：${fact}；未确认：内部投入、ROI 与长期运行效果。`, 190);
}

function enterpriseTransformationScore(card = {}) {
  const text = enterpriseTransformationText(card);
  const tags = new Set(card.flatTags || []);
  let score = Number(card.frontstageEvidenceScore) || 0;
  if (card.category === "case") score += 28;
  if (card.category === "product-service") score += 16;
  if (card.category === "funding") score += 8;
  if (tags.has("track-enterprise-workflow")) score += 24;
  if (tags.has("customer-enterprise")) score += 18;
  if (tags.has("evidence-customer-adoption")) score += 18;
  if (tags.has("evidence-customer-metric")) score += 12;
  if (tags.has("evidence-product-launch")) score += 8;
  if (card.enterpriseAiLensPriority) score += 400;
  if (/FDE|forward deployed|customer-embedded|domain operator|production environment|regulated payer workflow|implementation|workflow|deployment|rollout|customer adoption|business process|技术实施|客户嵌入|生产环境|业务流程|实施|部署|落地/iu.test(text)) score += 48;
  if (/enterprise|workflow|customer|deployment|procurement|governance|integration|automation|agent|企业|流程|客户|部署|采购|治理|集成|自动化|智能体/iu.test(text)) score += 24;
  if (/cms|content management|red team|security testing|business workflow|内容管理|内容运营|红队|安全测试|业务流程/iu.test(text)) score += 16;
  if (/world leaders|turn it off|G7|sovereign AI|national security|国家安全|峰会|领导人|关闭模型访问/iu.test(text)) score -= 80;
  if (/developer hub|cloud tpu|colab|xla|pytorch|kv cache|benchmark|wildchat|public chat|research|paper|dataset|开发者中心|数据集|研究|论文/iu.test(text)) score -= 34;
  if (/原文 AI 事件|该来源披露的是/u.test(text)) score -= 28;
  if (/report|guide|top\s+\d+|榜单|指南|报告|清单/iu.test(text)) score -= 18;
  return score;
}

function hasEnterpriseImplementationSignal(card = {}) {
  const text = enterpriseTransformationText(card);
  if (!hasSourceBackedFrontstageFact(card)) return false;
  if (/design partner|brand design|visual identity|launch sequence|设计伙伴|品牌设计|视觉识别/iu.test(text) && !/deployment|production|rollout|FDE|forward deployed|生产|部署|落地/iu.test(text)) return false;
  const aiRelated = /\bAI\b|agentic|agents?|LLM|model|Claude|Bedrock|智能体|模型|人工智能/u.test(text);
  if (!aiRelated) return false;
  const implementation = /FDE|forward deployed|customer-embedded|domain operator|production environment|regulated payer workflow|implementation|workflow|deployment|rollout|customer adoption|case study|business process|pilot|procurement|technical scoping|系统设计|客户嵌入|生产环境|生产上线|业务流程|实施|部署|落地|试点|采购|交付/iu.test(text);
  if (!implementation) return false;
  const broadGovernance = /world leaders|turn it off|G7|sovereign AI|national security|国家安全|峰会|领导人|关闭模型访问/iu.test(text);
  return !broadGovernance || /workflow|deployment|customer|production|business process|业务流程|部署|客户|生产/iu.test(text);
}

function hasEnterpriseTransformationSubstance(card = {}) {
  const text = enterpriseTransformationText(card);
  if (!hasSourceBackedFrontstageFact(card)) return false;
  if (/design partner|brand design|visual identity|launch sequence|设计伙伴|品牌设计|视觉识别/iu.test(text) && !/deployment|production|rollout|FDE|forward deployed|生产|部署|落地/iu.test(text)) return false;
  if (!/\bAI\b|agentic|agents?|LLM|model|Claude|Bedrock|智能体|模型|人工智能/u.test(text)) return false;
  return hasEnterpriseImplementationSignal(card)
    || /workflow|customer|deployment|adoption|procurement|cms|content management|red team|security testing|agentic ai.*business|enterprise system|企业|流程|客户|部署|采用|采购|内容管理|内容运营|红队|安全测试|业务系统/iu.test(text);
}

function enterpriseTransformationItem(card = {}) {
  const text = enterpriseTransformationText(card);
  const tags = card.flatTags || [];
  const stage = enterpriseTransformationStage(card, text);
  return {
    id: `enterprise-ai:${card.linkedCardId || card.id}`,
    cardId: card.linkedCardId || card.id,
    date: card.date,
    category: card.category,
    categoryLabel: card.categoryLabel || categoryLabels[card.category] || card.category,
    title: card.displayTitle || card.title,
    subject: card.subject,
    sourceName: card.sourceName,
    sourceUrl: card.sourceUrl,
    stage,
    stageLabel: enterpriseTransformationStageLabel(stage),
    scenario: enterpriseTransformationScenario(text, tags),
    workflow: enterpriseTransformationWorkflow(text, card.category),
    evidenceBoundary: enterpriseTransformationBoundary(card),
  };
}

function buildEnterpriseAiTransformation(cards = [], corePoolCandidates = [], activeDate = "", limit = 5) {
  const seen = new Set();
  return [...cards, ...corePoolCandidates]
    .filter((card) => card.date === activeDate)
    .filter((card) => {
      const id = card.linkedCardId || card.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((card) => ({
      card,
      score: enterpriseTransformationScore(card),
    }))
    .filter((row) => row.score >= 36)
    .filter((row) => hasEnterpriseTransformationSubstance(row.card))
    .sort((a, b) => b.score - a.score || String(a.card.id).localeCompare(String(b.card.id)))
    .slice(0, limit)
    .map((row) => enterpriseTransformationItem(row.card));
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
  const todayTop10 = Array.isArray(payload.top10) && payload.top10.length
    ? payload.top10
    : (payload.frontstageCards || []).filter((card) => card.date === activeDate);
  const top10Ids = new Set(todayTop10.map((card) => card.id));
  const corePoolCandidates = payload.corePoolCandidates || [];
  const linkedCoreCount = corePoolCandidates.filter((card) => card.linkedCardId || card.type === "signal_card").length;
  const enterpriseAiTransformation = payload.enterpriseAiTransformation || [];
  const tagAssociations = payload.tagAssociations || [];
  const relationshipDirections = payload.relationshipDirections || [];
  const trendLinks = payload.trendLinks || [];

  return {
    meta: {
      version: "V3.3.6.3-business-source-artifact-aggregation",
      siteVersion,
      businessSignalsColumnVersion,
      enterpriseAiLensVersion,
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
      enterpriseAiTransformation: enterpriseAiTransformation.length,
      tagAssociations: tagAssociations.length,
      trendLinks: trendLinks.length,
      trendCandidates: (payload.trendCandidates || []).length,
    },
    dailyLens: {
      top10CardIds: [...top10Ids],
      corePoolCardIds: corePoolCandidates.map((card) => card.linkedCardId || card.id),
      enterpriseAiTransformationCardIds: enterpriseAiTransformation.map((item) => item.cardId).filter(Boolean),
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
const cards = ensureUniqueCardIds(dedupeFrontstageCards(rawCards).filter(isPublicBusinessSignalEligible))
  .map(normalizeFrontstageDisplay)
  .filter(hasSourceFacingEvidence)
  .filter((card) => card.title && card.date && card.sourceName)
  .map(annotateFrontstageCandidate)
  .sort((a, b) => dateValue(b.date) - dateValue(a.date) || a.category.localeCompare(b.category));
const frontstageSelection = buildDailyFrontstageSelection(cards);
const frontstageCards = frontstageSelection.cards;

const activeDate = cards.map((card) => card.date).filter(Boolean).sort().at(-1) || "";
const top10 = frontstageCards
  .filter((card) => card.date === activeDate)
  .slice(0, 10)
  .map(top10CompatCard);
const corePoolCandidates = buildCorePoolCandidateItems(cards, activeDate)
  .map(normalizeFrontstageDisplay)
  .filter(publicCandidateIsDisplayReady)
  .filter((card) => !isWeakSubject(card.subject));
const enterpriseAiLensCandidates = buildEnterpriseAiLensCandidateItems(cards, activeDate)
  .map(normalizeFrontstageDisplay)
  .map((card) => ({
    ...card,
    summary: (
      card.summary
      && !publicContentNeedsTranslation(card.summary)
      && !publicFactLooksLikeTemplateFallback(card.summary)
    ) ? card.summary : card.translatedFact,
    visibleFragment: (
      card.visibleFragment
      && !publicContentNeedsTranslation(card.visibleFragment)
      && !publicFactLooksLikeTemplateFallback(card.visibleFragment)
    ) ? card.visibleFragment : card.translatedFact,
  }))
  .filter(publicCandidateIsDisplayReady)
  .filter(hasEnterpriseImplementationSignal)
  .filter((card) => !isWeakSubject(card.subject));
const enterpriseAiTransformation = buildEnterpriseAiTransformation(cards, [...enterpriseAiLensCandidates, ...corePoolCandidates], activeDate);
const trendAssets = buildTrendAssets(activeDate, cards);
const payload = {
  meta: {
    version: "V3.3.6.3-business-source-artifact-aggregation",
    siteVersion,
    businessSignalsColumnVersion,
    enterpriseAiLensVersion,
    generatedAt: new Date().toISOString(),
    activeDate,
    top10Count: top10.length,
    source: "Signal Cards",
    tagPolicy: "formal_tags filtered by agent-workflow/product/tag-taxonomy.md",
    allowedTagCount: allowedTagIds.size,
  },
  categories: Object.entries(categoryLabels).map(([category, label]) => ({ category, label })),
  stats: buildStats(cards, activeDate),
  cards,
  top10,
  frontstageCards,
  corePoolCandidates,
  enterpriseAiLensCandidates,
  enterpriseAiTransformation,
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
