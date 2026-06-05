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

function hasCjk(value = "") {
  return /[\u4e00-\u9fff]/u.test(String(value || ""));
}

function translateEnglishTitle(title = "", sourceUrl = "") {
  const text = String(title || "").trim();
  const normalized = canonicalUrl(sourceUrl).toLowerCase();
  const byUrl = [
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
      rawTitle = json.title || "";
      sourceUrl = json.original_url || json.canonical_url || "";
      publishedAt = json.published_at || "";
      keyExcerpts = Array.isArray(json.key_excerpts)
        ? json.key_excerpts.map((item) => ({
          type: item?.type || "",
          text: short(item?.text || "", 260),
        })).filter((item) => item.text).slice(0, 8)
        : [];
      fullText = json.full_text || json.clean_text || "";
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

function readPoolEvidence(date = "", poolRef = "") {
  if (!date || !poolRef) return null;
  const poolFile = path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`);
  if (!fs.existsSync(poolFile)) return null;
  const section = sectionByHeading(read(poolFile), `## ${poolRef}`);
  if (!section) return null;
  const keyExcerptObjects = parseJsonLine(section, "key_excerpts") || [];
  const evidenceSeed = parseJsonLine(section, "evidence_seed") || {};
  return {
    sourceName: "",
    sourceUrl: "",
    publishedAt: "",
    rawTitle: "",
    keyExcerpts: Array.isArray(keyExcerptObjects)
      ? keyExcerptObjects.map((item) => ({ type: item?.type || "", text: short(item?.text || "", 260) })).filter((item) => item.text)
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
  return /发布 AI 能力|把 AI 用进|这条变化值得看|客户是否买单|流程结果、交付速度|团队协作有没有实际改善|面向销售和收入团队流程|面向地产开发和建筑设计流程|面向模型部署和算力调用|面向企业智能体协作流程/u.test(String(value || ""));
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
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  if (match) return match[1];
  const numbers = meaningfulNumbers(extractNumbers(text));
  if (numbers.length && type) return `${excerptTypeLabel(type)}：原文关键数字包括 ${numbers.slice(0, 5).join("、")}。`;
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
    viewpoint: "观点信息",
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
    [/Oracle E-Business Suite|Oracle JD Edwards|Oracle PeopleSoft|Oracle Fusion Cloud ERP|Salesforce|Snowflake/iu, "原文称该架构可扩展到 Oracle E-Business Suite、JD Edwards、PeopleSoft、Oracle Fusion Cloud ERP、Salesforce、Snowflake 等系统。"],
    [/directly create Requests for Quotation.*same interface/iu, "采购人员可在同一对话界面中创建 RFQ，减少系统切换。"],
    [/eight specialized tools/iu, "方案包含 8 个专用工具，覆盖数据结构查询、SQL 查询、财务分析、质量指标、合规验证、RFQ 校验、RFQ 创建和数据可视化。"],
    [/RFQ Creation Tool.*SAP systems through OData/iu, "RFQ 创建工具通过 OData 调用 SAP API，在 SAP 系统中创建询价请求。"],
    [/accelerates decision-making.*reducing procurement cycle times/iu, "原文把业务结果描述为缩短采购周期、提升供应商评估和支出可见性。"],
  ];
  const match = rules.find(([pattern]) => pattern.test(text));
  if (match) return match[1];
  const numbers = meaningfulNumbers(extractNumbers(text));
  if (numbers.length) return `${excerptTypeLabel(type)}：原文关键数字包括 ${numbers.slice(0, 5).join("、")}。`;
  if (hasCjk(text)) return short(text, 220);
  return "";
}

function genericRawCorePoints(raw) {
  const points = [];
  const seed = raw.evidenceSeed || {};
  const excerptNumbers = raw.keyExcerpts.flatMap((item) => extractNumbers(item.text));
  const fullTextNumbers = extractNumbers(raw.fullText).slice(0, 10);
  const numbers = meaningfulNumbers([
    ...excerptNumbers,
    ...fullTextNumbers,
  ]);
  if (numbers.length) points.push(`关键数字：${numbers.slice(0, 6).join("、")}。`);

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

function buildOriginalHighlights(raw, rawDisplayTitle = "", sourceUrl = "") {
  const specific = [
    ...procurementUseCaseHighlights(raw.fullText),
    ...archestraHighlights(raw.fullText),
  ];
  if (specific.length) return specific.slice(0, 8);
  const translated = raw.keyExcerpts
    .map((item) => translateKnownRawExcerpt(item.text, item.type))
    .filter(Boolean);
  return [...new Set([...translated, ...genericRawCorePoints(raw)])]
    .filter((item) => item && !isMechanicalFrontstageText(item))
    .slice(0, 8);
}

function buildSourceExcerpt(raw, highlights = []) {
  const rawExcerpt = raw.keyExcerpts
    .map((item) => translatedSourcePoint(item.text, item.type))
    .find(Boolean);
  if (rawExcerpt) return rawExcerpt;
  const sentenceExcerpt = sourceSentences(raw.fullText)
    .map((item) => translatedSourcePoint(item))
    .find(Boolean);
  if (sentenceExcerpt) return sentenceExcerpt;
  const visible = publicVisibleFragment(raw.visibleFragment);
  if (visible) return visible;
  return highlights.find((item) => hasCjk(item) && !/^原始来源|本地 Raw\/Pool/u.test(item)) || "";
}

function sourceValueFromEvidence(category, highlights = [], rawDisplayTitle = "") {
  const concrete = highlights
    .filter((item) => !/^关键数字：/u.test(item))
    .filter((item) => !/^原始来源|本地 Raw\/Pool|原文关键数字/u.test(item))
    .slice(0, 2);
  const base = concrete.length ? concrete.join("；") : frontstageChineseTitle(rawDisplayTitle);
  if (!base) return "";
  if (category === "funding") return `可观察融资金额、资金用途或赛道线索：${base}`;
  if (category === "case") return `可观察真实客户、业务流程或结果指标：${base}`;
  if (category === "product-service") return `可观察产品能力进入具体业务流程的方式：${base}`;
  if (category === "opinion") return `可观察观点来源的原始判断：${base}`;
  return base;
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
  if (rawRef) points.push(`本地 Raw/Pool 要点缺失：需恢复 ${rawRef} 后补齐核心数据、案例或观点。`);
  return points.filter(Boolean).slice(0, 3);
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
  const poolRefs = arrayValue(fm, "pool_refs");
  const raw = mergeEvidence(readRawEvidence(rawJson, rawArchive, primarySourceUrl), readPoolEvidence(scalar(fm, "date"), poolRefs[0]));
  const rawTitle = rawTitleFromArchive || raw.rawTitle || "";
  const sourceUrl = primarySourceUrl || raw.sourceUrl;
  const sourceName = scalar(fm, "source_name") || raw.sourceName || domain(sourceUrl) || "未标注来源";

  const rawDisplayTitle = frontstageTitle(rawTitle || scalar(fm, "title") || path.basename(file, ".md"), rawTitle);
  const title = frontstageChineseTitle(rawDisplayTitle, sourceUrl);
  const translatedFact = chineseFactFromSource(rawDisplayTitle || title, sourceUrl);
  let originalHighlights = buildOriginalHighlights(raw, rawDisplayTitle, sourceUrl);
  if (!originalHighlights.length) originalHighlights = fallbackSourcePoints(rawDisplayTitle, sourceUrl, rawRef);
  const sourceFact = translatedFact || originalHighlights.find((item) => !/^关键数字|原始来源|本地 Raw\/Pool/u.test(item)) || "";
  const sourceExcerpt = buildSourceExcerpt(raw, originalHighlights);
  const sourceValue = sourceValueFromEvidence(category, originalHighlights, rawDisplayTitle);

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
    summary: short(sourceValue || sourceFact, 260),
    translatedFact: short(sourceFact, 320),
    originalHighlights: originalHighlights.length
      ? originalHighlights
      : [
        nestedScalar(fm, "frontend", "originalQuote"),
        headingSection(text, "发生了什么"),
      ].filter((item) => item && !isMechanicalFrontstageText(item)).map((item) => short(item, 260)).slice(0, 3),
    visibleFragment: sourceExcerpt || "",
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
  const sourceTypes = arrayValue(fm, "source_types");
  const relatedSignals = arrayValue(fm, "related_signal_cards")
    .concat(arrayValue(fm, "related_change_cards"))
    .concat(arrayValue(fm, "related_case_cards"));
  const relatedOpinions = arrayValue(fm, "related_opinion_cards");
  const relatedIds = new Set([...relatedSignals, ...relatedOpinions].filter(Boolean));
  const relatedCards = cards.filter((card) => relatedIds.has(card.id));
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
    relatedOpinions: [...new Set(relatedOpinions)].filter(Boolean),
    tags,
    displayTags: displayTags(tags),
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

function cleanTrendNarrative(value = "") {
  return String(value || "")
    .replace(/\s+/gu, " ")
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
  if (/淘汰风险|可观察观点来源的原始判断/u.test(text)) return true;
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
  if (spec.id === "customer-service-proof") {
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
const trendAssets = buildTrendAssets(activeDate, cards);
const payload = {
  meta: {
    version: "V3.1.1-source-first-frontstage",
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
