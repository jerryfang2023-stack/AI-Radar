#!/usr/bin/env node
import { readdir, readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { completeOpinionTranslation, loadTranslationCache, replaceBodyTranslation, saveTranslationCache, translateOpinionText } from "./opinion-translation-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..", "..");
const opinionDir = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Cards");
const contentDir = path.join(root, "01-SiteV2", "content", "05-frontier-opinions");
const duplicateArchiveDir = path.join(root, "01-SiteV2", "knowledge", "99-Archive", "Opinion-Duplicates");
const dateArg = process.argv.find((arg) => arg.startsWith("--date="))?.split("=")[1];
const targetDates = dateArg ? new Set([dateArg]) : null;

const FEATURE_IDS = new Set([
  "OPN-20260520-01",
  "OPN-20260521-01",
  "OPN-FB-20260522-07",
]);

const FEATURE_REF_IDS = new Set([
  "BP-20260520-33",
  "BP-20260521-42",
]);

const SIDEBAR_IDS = new Set([
  "OPN-FB-20260522-02",
  "OPN-FB-20260522-10",
  "OPN-FB-20260522-11",
  "OPN-FB-20260522-18",
  "OPN-FB-20260522-26",
]);

const authorityPeople = [
  "sam altman",
  "aaron levie",
  "andrej karpathy",
  "nikunj kothari",
  "swyx",
  "garry tan",
  "zara zhang",
  "dan shipper",
  "kevin weil",
  "matt turck",
  "aditya agarwal",
  "josh woodward",
  "peter steinberger",
  "guillermo rauch",
  "anthropic engineering",
  "claude blog",
  "google labs",
  "peter yang",
  "training data",
  "ryo lu",
  "ai & i",
];

const businessSignals = [
  "enterprise",
  "cio",
  "customer",
  "capacity",
  "token",
  "cost",
  "pricing",
  "workload",
  "agent",
  "agents",
  "ai-native team",
  "delegate",
  "verify output",
  "trusted for all my agents",
  "search the web",
  "exa",
  "yc",
  "stainless",
  "api",
  "sdk",
  "mcp server",
  "mcp servers",
  "business copilots",
  "developer tools",
  "model performance",
  "agent lab",
  "google i/o",
  "managed agents",
  "sandbox",
  "mcp",
  "eval",
  "workflow",
  "sdlc",
  "autonomous workers",
  "coworker",
  "claude code",
  "gemini",
  "box ai",
  "complex work",
  "cdn pricing",
  "backlog",
  "jira",
  "computational discovery",
];

const noiseSignals = [
  "glad you like it",
  "wow",
  "breakfast",
  "hot sauce",
  "flowermaxxing",
  "earthquake",
  "future is bright",
  "tired:",
  "still absolutely amazed",
  "what should i ask",
  "https://t.co/ivleaxrbsl",
  "rsi is here",
  "sainthood",
  "alternate take",
  "glad you're liking",
  "you found it",
  "apply to",
  "can't recommend",
  "pod link",
  "youtube:",
  "spotify:",
  "this is a really big deal",
  "when kendall buys",
  "idea fusion",
  "maybe not working at a company",
  "being a founder is so",
  "it was amazing to have",
  "we love seeing",
  "the next in a series of firsts",
  "if you don't have time to read",
];

function normalizeText(text = "") {
  return String(text)
    .replace(/鈥檚/g, "'s")
    .replace(/鈥檛/g, "n't")
    .replace(/鈥檝/g, "'v")
    .replace(/鈥檙/g, "'r")
    .replace(/鈥檓/g, "'m")
    .replace(/鈥\?/g, "'")
    .replace(/锛\?/g, ":")
    .replace(/锝\?/g, "｜")
    .replace(/\s+/g, " ")
    .trim();
}

function short(text = "", limit = 150) {
  const value = normalizeText(text).replace(/^["']|["']$/g, "");
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
}

function frontmatter(text = "") {
  return text.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
}

function body(text = "") {
  return text.replace(/^---\s*[\s\S]*?---\s*/u, "");
}

function field(text = "", name) {
  const raw = frontmatter(text);
  const match = raw.match(new RegExp(`^${name}:\\s*(.+)$`, "mu"));
  return decodeScalar(match?.[1] || "");
}

function nestedField(text = "", name) {
  const raw = frontmatter(text);
  const match = raw.match(new RegExp(`^\\s+${name}:\\s*(.+)$`, "mu"));
  return decodeScalar(match?.[1] || "");
}

function decodeScalar(value = "") {
  const raw = String(value || "").trim();
  if (!raw) return "";
  try {
    if (/^["']/.test(raw)) return normalizeText(JSON.parse(raw));
  } catch {
    // Fall through to a permissive scalar cleanup.
  }
  return normalizeText(raw.replace(/^["']|["']$/g, "").replace(/\\n/gu, "\n"));
}

function pendingTranslationText(value = "") {
  return /^(?:\u5f85\u8865|\u6682\u65e0|\u672a\u8865|pending|todo)/iu.test(normalizeText(value));
}

function bodyOriginalQuote(text = "") {
  const content = body(text);
  const quoteBlock = content.match(/^(>\s*.+(?:\r?\n>\s*.+)*)/mu)?.[1];
  if (quoteBlock) return normalizeText(quoteBlock.replace(/^>\s*/gmu, ""));
  const unicodeInline = content.match(/\u539f\u6587\u8bf4\u4e86\u4ec0\u4e48[\uff1a:](.+)$/mu)?.[1];
  if (unicodeInline) return normalizeText(unicodeInline);
  const section = content.match(/##\s*(?:\u539f\u6587\u6458\u5f55|original excerpt)[^\n]*\n([\s\S]*?)(?=\n##\s|\n#\s|$)/iu)?.[1] || "";
  if (section) {
    const originalOnly = section.split(/^\s*\u4e2d\u6587(?:\u7ffb\u8bd1|\u8f6c\u8ff0)[\uff1a:]/mu)[0] || "";
    const cleaned = originalOnly.split(/\r?\n/u).filter((line) => line.trim() && !line.trim().startsWith("-")).join("\n");
    if (cleaned.trim()) return normalizeText(cleaned);
  }
  const quote = content.match(/^>\s*(.+)$/mu)?.[1];
  if (quote) return normalizeText(quote);
  const inlineOriginal = content.match(/原文说了什么：(.+)$/mu)?.[1];
  if (inlineOriginal) return normalizeText(inlineOriginal);
  const oneLine = content.match(/(?:原文摘录|original excerpt|原文).*?\n+([^#\n][\s\S]*?)(?:\n##|\n#|$)/iu)?.[1] || "";
  return normalizeText(oneLine.split(/\r?\n/u).find((line) => line.trim() && !line.trim().startsWith("-")) || "");
}

function bodyOriginalTranslation(text = "") {
  const raw = frontmatter(text);
  const frontendMatch = raw.match(/^\s+originalTranslation:\s*(.+)$/mu);
  if (frontendMatch?.[1]) {
    const decoded = decodeScalar(frontendMatch[1]);
    if (pendingTranslationText(decoded)) return "";
    return decoded;
    const value = normalizeText(frontendMatch[1].trim().replace(/^["']|["']$/g, ""));
    if (/^(待补|暂无|未补|pending|todo)/iu.test(value)) return "";
    return value;
  }
  const topLevel = field(text, "original_translation");
  if (topLevel) return pendingTranslationText(topLevel) ? "" : topLevel;
  const unicodeBodyMatch = body(text).match(/^\s*\u4e2d\u6587(?:\u7ffb\u8bd1|\u8f6c\u8ff0)[\uff1a:]\s*([\s\S]*?)(?=\n##\s|\n#\s|$)/mu);
  if (unicodeBodyMatch?.[1]) {
    const translated = normalizeText(unicodeBodyMatch[1]);
    return pendingTranslationText(translated) ? "" : translated;
  }
  if (topLevel) return /^(待补|暂无|未补|pending|todo)/iu.test(topLevel) ? "" : topLevel;
  const content = body(text);
  const bodyMatch = content.match(/^中文(?:翻译|转述)[：:]\s*(.+)$/mu);
  const value = normalizeText(bodyMatch?.[1] || "");
  return /^(待补|暂无|未补|pending|todo)/iu.test(value) ? "" : value;
}

function scoreCard(card) {
  const haystack = `${card.title} ${card.person} ${card.organization} ${card.originalQuote} ${card.body}`.toLowerCase();
  let score = 0;
  const reasons = [];
  const isFollowBuilder = card.id.startsWith("OPN-FB-") || /follow-builders/i.test(card.organization);
  const hasNoise = noiseSignals.some((word) => haystack.includes(word));

  if (FEATURE_IDS.has(card.id) || FEATURE_REF_IDS.has(card.rawRef)) {
    return { tier: "feature", lane: "daily_feature", score: 100, reason: "人工精选观点，直接支撑当日观察主线。" };
  }

  if (SIDEBAR_IDS.has(card.id)) {
    return { tier: "sidebar", lane: "signal_sidebar", score: 80, reason: "人工指定侧栏观点，具备当日前台参照价值。" };
  }

  if (isFollowBuilder) {
    score += 1;
    reasons.push("follow-builders 人物池来源");
  }
  if (authorityPeople.some((name) => haystack.includes(name))) {
    score += 2;
    reasons.push("高价值人物或机构");
  }
  const signalHits = businessSignals.filter((word) => haystack.includes(word));
  if (signalHits.length) {
    score += Math.min(4, signalHits.length);
    reasons.push(`商业/产品变量：${signalHits.slice(0, 3).join(", ")}`);
  }
  if (/\d/.test(haystack) || /\bpp\b|%|million|billion|fortune 500/i.test(haystack)) {
    score += 1;
    reasons.push("包含数据、客户或业务量级线索");
  }
  if (hasNoise) {
    score -= 5;
    reasons.push("含社交噪音或弱表达");
  }
  if (card.originalQuote.length < 60) {
    score -= 1;
    reasons.push("原文信息量偏短");
  }
  if (!card.sourceUrl) {
    score -= 3;
    reasons.push("缺原文链接");
  }

  if (score >= 4) return { tier: "sidebar", lane: "signal_sidebar", score, reason: reasons.join("；") || "具备商业判断参照价值。" };
  if (score >= 1) return { tier: "archive", lane: "archive_only", score, reason: reasons.join("；") || "保留为人物观点时间线。" };
  return { tier: "discard", lane: "hidden", score, reason: reasons.join("；") || "缺少足够商业判断价值。" };
}

function interpretationFor(card, rating) {
  const haystack = `${card.title} ${card.originalQuote}`.toLowerCase();
  if (/capacity|certainty/.test(haystack)) {
    return "这条观点把企业 AI 采购从单次调用价格推向容量承诺和供给保障。";
  }
  if (/token|cost|cio|workload/.test(haystack)) {
    return "这条观点把企业 AI 采用拉回预算、用量治理和模型分配问题。";
  }
  if (/managed agents|sandbox|mcp|claude/.test(haystack)) {
    return "这条观点提示 Agent 落地会先遇到运行环境、权限边界和工具连接问题。";
  }
  if (/eval|customer conversations|complex work|box ai/.test(haystack)) {
    return "这条观点强调企业 AI 能否进入真实流程，取决于任务评测、客户语料和行业场景。";
  }
  if (/autonomous workers|coworker|assistant/.test(haystack)) {
    return "这条观点用于观察 AI 从助手走向协作者时，组织和岗位会如何重新分工。";
  }
  if (/sdlc|claude code|cursor|backlog|jira|coding/.test(haystack)) {
    return "这条观点说明 AI 编程正在从单点工具转向开发流程、测试和任务管理。";
  }
  if (/pricing|cdn/.test(haystack)) {
    return "这条观点可用于观察基础设施公司如何把不稳定用量转成更可预测的价格模型。";
  }
  if (rating.tier === "sidebar") {
    return "这条观点有独立参照价值，可帮助判断产品路线、客户采用或工作流变化。";
  }
  return "保留为人物观点时间线；涉及事实判断时仍需公司材料或可靠报道支持。";
}

function yamlValue(value = "") {
  return JSON.stringify(short(value, 260));
}

function yamlLongValue(value = "") {
  return JSON.stringify(short(value, 8000));
}

function setTopField(fm, key, value) {
  const line = `${key}: ${value}`;
  const pattern = new RegExp(`^${key}:.*$`, "mu");
  return pattern.test(fm) ? fm.replace(pattern, line) : `${fm.trimEnd()}\n${line}`;
}

function removeFrontend(fm) {
  return fm.replace(/^frontend:\s*\n(?:\s{2,}.+\n?)*/mu, "").trimEnd();
}

function setNestedField(fm, section, key, value) {
  const line = `  ${key}: ${value}`;
  const sectionPattern = new RegExp(`^${section}:\\s*\\n([\\s\\S]*?)(?=^\\S|$)`, "mu");
  const sectionMatch = fm.match(sectionPattern);
  if (!sectionMatch) return `${fm.trimEnd()}\n${section}:\n${line}`;
  const block = sectionMatch[0];
  const fieldPattern = new RegExp(`^\\s+${key}:.*$`, "mu");
  const nextBlock = fieldPattern.test(block) ? block.replace(fieldPattern, line) : `${block.trimEnd()}\n${line}\n`;
  return fm.replace(block, nextBlock);
}

function isXSourceUrl(value = "") {
  return /\bx\.com\b|\btwitter\.com\b/iu.test(String(value || ""));
}

function frontstageQuote(value = "") {
  const fullText = normalizeText(value).replace(/https?:\/\/\S+/gu, "").trim();
  if (fullText) return short(fullText, 8000);
  const text = normalizeText(value).replace(/https?:\/\/\S+/gu, "").trim();
  const englishWords = text.match(/[A-Za-z][A-Za-z0-9'’,-]*/gu) || [];
  if (englishWords.length >= 8) return "见正文原文摘录";
  return short(text, 96);
}

function frontendBlockFor(card, rating) {
  const organization = cleanOrganization(card.organization);
  const speakerParts = [card.person, organization].filter(Boolean).filter((part, index, parts) => {
    const value = part.toLowerCase();
    const person = card.person.toLowerCase();
    return parts.findIndex((item) => item.toLowerCase() === value) === index
      && (!person || value === person || !value.includes(person));
  });
  const speaker = speakerParts.join(" / ");
  const original = frontstageQuote(card.originalQuote || card.title);
  return [
    "frontend:",
    `  displayTitle: ${yamlValue(card.displayTitle)}`,
    `  speakerLine: ${yamlValue(speaker || card.person || "前沿观点来源")}`,
    `  originalQuote: ${yamlLongValue(original)}`,
    `  originalTranslation: ${yamlLongValue(card.originalTranslation || "")}`,
    `  interpretation: ${yamlValue(interpretationFor(card, rating))}`,
    `  factBoundary: ${yamlValue("这是人物或机构观点，不单独证明公司动作、客户采用、收入、融资或市场规模；涉及事实判断时，仍需公司材料或可靠报道支持。")}`,
    card.sourceUrl ? `  sourceLinks:\n    - ${yamlValue(card.sourceUrl)}` : "  sourceLinks: []",
  ].join("\n");
}

function cleanOrganization(value = "") {
  return normalizeText(value)
    .replace(/^follow-builders\s*\/\s*/i, "")
    .replace(/^X\s*\/\s*/i, "")
    .replace(/^blog\s*\/\s*/i, "")
    .replace(/^\/\s*/, "");
}

function escapeRegExp(value = "") {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanDisplayTitle(title = "", speaker = "") {
  let value = normalizeText(title)
    .replace(/Verce…/gu, "Vercel 沙盒")
    .replace(/Verce$/gu, "Vercel 沙盒")
    .replace(/…$/gu, "");
  if (speaker) {
    const repeated = new RegExp(`^${escapeRegExp(speaker)}[：:｜|\\s]+${escapeRegExp(speaker)}[：:｜|\\s]+`, "u");
    value = value.replace(repeated, `${speaker}：`);
  }
  return value.trim();
}

function displayTitleFor(card) {
  const haystack = `${card.title} ${card.originalQuote} ${card.originalTranslation || ""}`.toLowerCase();
  const speaker = card.person || cleanOrganization(card.organization) || "前沿观点";
  if (/more here/u.test(haystack)) {
    return `${speaker}: 更多信息见原文`;
  }
  if (/dangerously-skip-git|dangerously skip git/u.test(haystack)) {
    return `${speaker}: 跳过 Git 的自动化工作流需要边界`;
  }
  if (/localfirst|local-first/u.test(haystack)) {
    return `${speaker}: local-first 技术栈正在形成优势`;
  }
  const rules = [
    [/more here|intentionality|intensity|completeness|insanity/u, "更多信息见原文"],
    [/fde|directly impact.*workflows|change management/u, "Agent 落地需要技术交付和变更管理"],
    [/exa.*trust.*agents|trusted for all my agents|search the web/u, "Exa 正成为 Agent 搜索基础设施"],
    [/benefits of ai are real|cede its lead/u, "AI 红利需要留住关键人才"],
    [/stainless|mcp servers?|api.*sdk|sdk.*api/u, "MCP 设计要少而准，才能服务 Agent"],
    [/ai-native team|delegate tasks to agents|verify output/u, "AI-native 团队需要重新分配人和 Agent 的任务"],
    [/models get better|model performance|agent lab/u, "模型能力提升会改变 Agent 产品的商业回报"],
    [/from playing the games to designing the games|choose your characters|set the scene/u, "AI 工具把游戏设计压缩到分钟级"],
    [/agi accelerating research|agi accelerating companies|things we are most excited/u, "AGI 优先加速科研、公司和个人创造"],
    [/general-purpose model solved|major open problem in mathematics/u, "通用模型开始攻克开放数学问题"],
    [/42% of the web|every model, every provider, every modality/u, "AI 能力将进入更大规模 Web 工作流"],
    [/bake off of exa|exa vs competitors|unanimously converge/u, "Exa 在 Agent 搜索评测中胜出"],
    [/gemini.*flash|flash.*gemini/u, "Gemini Flash 能力跃升"],
    [/programs.*new finance teams|technology solutions to manage this all|manage this all/u, "企业需要建立 AI 成本治理机制"],
    [/token.*(cost|成本)|(cost|成本).*token|cio.*workload/u, "企业会重新计算 AI token 成本"],
    [/certainty.*capacity|capacity.*certainty/u, "客户开始要求提前锁定算力容量"],
    [/computational discovery|alphaevolve|empirical research agent/u, "AlphaEvolve 推进计算发现"],
    [/managed agents.*vercel|vercel.*sandbox|claude managed agents|claude agent.*(verce|沙盒)/u, "Claude Agent 接入 Vercel 沙盒"],
    [/cdn pricing|traffic spikes|viral events/u, "用定价缓冲流量峰值"],
    [/priced in|bay area/u, "AI 变化尚未被充分定价"],
    [/backlog.*jira|cursor.*jira/u, "用 Cursor 把 Jira backlog 变成实现"],
    [/self-hosted sandboxes|mcp tunnels/u, "Claude Managed Agents 补齐运行环境"],
    [/customer conversations|build evals/u, "用真实客户会话建立 evals"],
    [/sdlc|claude code|tests in place/u, "AI 编程进入开发流程管理"],
    [/how does one engineer become a 1000x founder/u, "工程师如何成长为高杠杆创始人"],
    [/why ai progress suddenly feels real/u, "AI 进展正在变得可验证"],
    [/ex founders are the driving force helping scale/u, "前创始人正在帮助头部公司扩张"],
    [/dangerously-skip-git|dangerously skip git/u, "跳过 Git 的自动化工作流需要边界"],
    [/speaker 1\s*\|\s*00:00|you need to reach this level of reliability/u, "企业级 AI 必须稳定承接真实流程"],
  ];
  const match = rules.find(([pattern]) => pattern.test(haystack));
  if (match) return cleanDisplayTitle(`${speaker}：${match[1]}`, speaker);

  const translatedTitle = titleFromTranslation(card.originalTranslation);
  if (translatedTitle) return cleanDisplayTitle(`${speaker}：${translatedTitle}`, speaker);

  const quote = short(card.originalQuote || card.title, 54)
    .replace(/https?:\/\/\S+/gu, "")
    .replace(/\s+/gu, " ")
    .replace(new RegExp(`^${escapeRegExp(speaker)}[：:｜|\\s]+`, "u"), "")
    .trim();
  if (!quote) return `${speaker}：前沿观点参照`;
  if (!card.person && quote.length <= 36) return quote;
  return cleanDisplayTitle(`${speaker}：${quote}`, speaker);
}

function titleFromTranslation(text = "") {
  const value = normalizeText(text)
    .replace(/https?:\/\/\S+/gu, "")
    .replace(/（.*?）/gu, "")
    .replace(/\(.*?\)/gu, "")
    .trim();
  if (!value || !/[\u4e00-\u9fff]/u.test(value)) return "";
  const first = value.split(/[。！？!?；;]/u).find(Boolean) || value;
  return short(first.replace(/^(我认为|我觉得|这是|这条观点认为)[，,：:\s]*/u, ""), 34);
}

function finalDisplayTitle(title = "", person = "") {
  let value = normalizeText(title).trim();
  if (person) {
    const duplicate = new RegExp(`^${escapeRegExp(person)}[：:｜|\\s]+${escapeRegExp(person)}[：:｜|\\s]+`, "u");
    while (duplicate.test(value)) value = value.replace(duplicate, `${person}：`);
  }
  if (/Claude Agent 接入 Verce|Claude Agent 接入 Vercel/u.test(value)) {
    return person ? `${person}：Claude Agent 接入 Vercel 沙盒` : "Claude Agent 接入 Vercel 沙盒";
  }
  return value.replace(/…$/u, "");
}

function canonicalOpinionUrl(value = "") {
  try {
    const parsed = new URL(value);
    parsed.hash = "";
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^m\./u, "").replace(/^www\./u, "");
    for (const param of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "ref", "s", "t"]) {
      parsed.searchParams.delete(param);
    }
    return parsed.toString().replace(/\/$/u, "");
  } catch {
    return normalizeText(value).trim();
  }
}

function opinionSourceUrl(text = "") {
  return canonicalOpinionUrl(field(text, "canonical_url") || field(text, "original_url") || field(text, "source_url") || nestedField(text, "source_url"));
}

function opinionRank(row = {}) {
  const tierScore = { feature: 500, sidebar: 400, archive: 200, discard: 100 };
  const statusScore = /frontstage_feature/u.test(row.publishStatus) ? 80 : /frontstage_sidebar/u.test(row.publishStatus) ? 60 : 0;
  const manualScore = /^OPN-\d/u.test(row.id || "") ? 30 : 0;
  const ratingScore = Number(row.ratingScore || 0);
  const translationScore = row.translationStatus === "translated" ? 10 : 0;
  return (tierScore[row.tier] || 0) + statusScore + manualScore + ratingScore + translationScore;
}

function mergeNoteFor(duplicates = []) {
  return [
    "",
    "## Merge Updates",
    "",
    ...duplicates.map((item) => `- ${item.date || "unknown"}: merged duplicate opinion capture ${item.id || "no-id"} from ${item.name}.`),
    "",
  ].join("\n");
}

function moveMergeUpdatesToEnd(content = "") {
  const pattern = /\n## Merge Updates\n\n(?:- .+\n)+/u;
  const match = content.match(pattern);
  if (!match) return content;
  const without = content.replace(pattern, "\n").trimEnd();
  return `${without}\n${match[0].trimEnd()}\n`;
}

async function mergeDuplicateOpinionCards(names = []) {
  const rows = [];
  for (const name of names) {
    if (name.includes("index") || name === ".gitkeep") continue;
    const file = path.join(opinionDir, name);
    const text = await readFile(file, "utf8");
    const sourceUrl = opinionSourceUrl(text);
    if (!sourceUrl) continue;
    rows.push({
      name,
      file,
      text,
      sourceUrl,
      date: name.match(/^(\d{4}-\d{2}-\d{2})/u)?.[1] || "",
      id: field(text, "id"),
      tier: field(text, "opinion_tier"),
      publishStatus: field(text, "publish_status"),
      ratingScore: field(text, "opinion_rating_score"),
      translationStatus: field(text, "translation_status"),
    });
  }

  const byUrl = new Map();
  for (const row of rows) {
    if (!byUrl.has(row.sourceUrl)) byUrl.set(row.sourceUrl, []);
    byUrl.get(row.sourceUrl).push(row);
  }

  const archiveDate = new Date().toISOString().slice(0, 10);
  const archiveDir = path.join(duplicateArchiveDir, archiveDate);
  await mkdir(archiveDir, { recursive: true });
  let mergedGroups = 0;
  let movedFiles = 0;

  for (const group of byUrl.values()) {
    if (group.length < 2) continue;
    group.sort((a, b) => opinionRank(b) - opinionRank(a) || a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
    const keeper = group[0];
    const duplicates = group.slice(1);
    let fm = frontmatter(keeper.text);
    const existingCount = Number(field(keeper.text, "merged_duplicate_count") || 0);
    fm = setTopField(fm, "merged_duplicate_count", String(existingCount + duplicates.length));
    fm = setTopField(fm, "merged_duplicate_refs", yamlValue(duplicates.map((item) => item.id || item.name).join(", ")));
    const existingBody = body(keeper.text).trimEnd();
    const missing = duplicates.filter((item) => !existingBody.includes(item.id || item.name));
    const nextBody = missing.length ? `${existingBody}\n${mergeNoteFor(missing)}` : existingBody;
    await writeFile(keeper.file, `---\n${fm.trimEnd()}\n---\n\n${nextBody}\n`, "utf8");

    for (const duplicate of duplicates) {
      const destination = path.join(archiveDir, duplicate.name);
      await rename(duplicate.file, destination);
      movedFiles += 1;
    }
    mergedGroups += 1;
  }

  return { mergedGroups, movedFiles };
}

async function markdownNames(dir) {
  return (await readdir(dir)).filter((name) => name.endsWith(".md"));
}

async function main() {
  const mergeStats = await mergeDuplicateOpinionCards(await markdownNames(opinionDir));
  const names = await markdownNames(opinionDir);
  const rows = [];
  const translationCache = await loadTranslationCache(root);
  await mkdir(contentDir, { recursive: true });

  for (const name of names) {
    if (name.includes("index") || name === ".gitkeep") continue;
    const date = name.match(/^(\d{4}-\d{2}-\d{2})/u)?.[1];
    if (!date || (targetDates && !targetDates.has(date))) continue;
    const file = path.join(opinionDir, name);
    const text = await readFile(file, "utf8");
    const type = field(text, "type");
    if (type && !["opinion_card", "opinion_intake"].includes(type)) continue;
    const card = {
      name,
      file,
      date,
      id: field(text, "id"),
      rawRef: nestedField(text, "raw_ref"),
      title: field(text, "title"),
      person: field(text, "person_name"),
      organization: field(text, "organization") || field(text, "source_name"),
      sourceUrl: field(text, "canonical_url") || field(text, "original_url") || field(text, "source_url") || nestedField(text, "source_url"),
      originalQuote: bodyOriginalQuote(text),
      originalTranslation: bodyOriginalTranslation(text),
      body: body(text),
    };
    const preferFullTranslation = isXSourceUrl(card.sourceUrl);
    const existingCompleteTranslation = completeOpinionTranslation(card.originalQuote || card.title, card.originalTranslation, { preferFullTranslation });
    if (!existingCompleteTranslation) {
      card.originalTranslation = "";
    }
    const translated = await translateOpinionText(card.originalQuote || card.title, {
      cache: translationCache,
      cacheKey: `${card.id}:${card.sourceUrl || card.name}`,
      preferFullTranslation,
    });
    if (!card.originalTranslation && translated.translation) {
      card.originalTranslation = translated.translation || "";
      card.translationStatus = card.originalTranslation ? "translated" : translated.status;
      card.translationMethod = translated.method || "unknown";
    } else {
      card.translationStatus = "translated";
      card.translationMethod = "existing";
    }
    card.displayTitle = finalDisplayTitle(displayTitleFor(card), card.person);

    const suggestedRating = scoreCard(card);
    let rating = suggestedRating;
    if ((rating.tier === "feature" || rating.tier === "sidebar") && !card.originalTranslation) {
      rating = {
        tier: "archive",
        lane: "archive_only",
        score: Math.min(rating.score, 40),
        reason: `${rating.reason} 已尝试补译但未成功，暂不进入前台。`,
      };
    }
    let fm = frontmatter(text);
    fm = removeFrontend(fm);
    const frontstage = rating.tier === "feature" || rating.tier === "sidebar";
    fm = setTopField(fm, "type", frontstage ? "opinion_card" : "opinion_intake");
    fm = setTopField(fm, "opinion_tier", rating.tier);
    fm = setTopField(fm, "display_lane", rating.lane);
    fm = setTopField(fm, "selection_reason", yamlValue(rating.reason));
    fm = setTopField(fm, "intake_suggested_tier", suggestedRating.tier);
    fm = setTopField(fm, "opinion_rating_score", String(rating.score));
    fm = setTopField(fm, "opinion_rating_version", "2026-05-22-v1");
    fm = setTopField(fm, "publish_status", rating.tier === "feature" ? "frontstage_feature" : rating.tier === "sidebar" ? "frontstage_sidebar" : rating.tier === "archive" ? "internal_archive" : "hidden");
    fm = setTopField(fm, "translation_status", card.translationStatus || (card.originalTranslation ? "translated" : "pending_translation"));
    fm = setTopField(fm, "translation_method", card.translationMethod || "unknown");
    fm = setTopField(fm, "frontend_copy_gate", card.originalTranslation ? "passed" : "pending");
    fm = setTopField(fm, "cardcopy_gate", frontstage ? "passed" : card.originalTranslation ? "skipped_intake_pending_rating" : "skipped_intake_translation_pending");
    if (isXSourceUrl(card.sourceUrl)) {
      fm = setTopField(fm, "capture_scope", "x_full_visible_text");
      fm = setNestedField(fm, "opinion_capture", "capture_scope", "x_full_visible_text");
    }
    if (frontstage) {
      fm = setTopField(fm, "title", yamlValue(card.displayTitle));
      fm = `${fm.trimEnd()}\n${frontendBlockFor(card, rating)}`;
    }

    let nextBody = body(text).trimStart();
    nextBody = replaceBodyTranslation(nextBody, card.originalTranslation);
    nextBody = moveMergeUpdatesToEnd(nextBody);
    if (frontstage) {
      nextBody = nextBody.replace(/^# .+$/mu, `# ${card.displayTitle}`);
    }
    const next = `---\n${fm.trimEnd()}\n---\n\n${nextBody}`;
    await writeFile(file, next.endsWith("\n") ? next : `${next}\n`, "utf8");
    rows.push({ ...card, ...rating });
  }

  const byDate = new Map();
  rows.forEach((row) => {
    if (!byDate.has(row.date)) byDate.set(row.date, []);
    byDate.get(row.date).push(row);
  });

  for (const [date, items] of byDate) {
    items.sort((a, b) => {
      const tierOrder = { feature: 0, sidebar: 1, archive: 2, discard: 3 };
      return (tierOrder[a.tier] - tierOrder[b.tier]) || b.score - a.score || a.id.localeCompare(b.id);
    });
    const counts = items.reduce((acc, item) => {
      acc[item.tier] = (acc[item.tier] || 0) + 1;
      return acc;
    }, {});
    const summary = [
      "---",
      `date: ${date}`,
      "stage: frontier-opinions",
      "status: governed-by-opinion-rating",
      `opinion_count: ${items.length}`,
      `feature_count: ${counts.feature || 0}`,
      `sidebar_count: ${counts.sidebar || 0}`,
      `archive_count: ${counts.archive || 0}`,
      `discard_count: ${counts.discard || 0}`,
      `generated_at: ${new Date().toISOString()}`,
      "---",
      "",
      `# ${date} 前沿观点分级`,
      "",
      "分级说明：feature 进入今日观察精选；sidebar 进入商业信号栏目观点模块；archive 只入观点库；discard 不进入前台。",
      "",
      ...items.map((item) => `- ${item.tier}｜${item.display_lane || item.lane}｜${item.id}｜${short(item.displayTitle, 96)}｜${item.sourceUrl || "no-url"}`),
      "",
    ].join("\n");
    await writeFile(path.join(contentDir, `${date}-opinion-cards.md`), summary, "utf8");

    const index = [
      "---",
      `date: ${date}`,
      "type: frontier_opinion_daily_index",
      "status: governed",
      `opinion_count: ${items.length}`,
      `feature_count: ${counts.feature || 0}`,
      `sidebar_count: ${counts.sidebar || 0}`,
      `archive_count: ${counts.archive || 0}`,
      `discard_count: ${counts.discard || 0}`,
      `generated_at: ${new Date().toISOString()}`,
      "---",
      "",
      `# ${date} 前沿观点全量索引`,
      "",
      ...items.map((item) => `- ${item.tier}｜${item.id}｜[${short(item.displayTitle, 120)}](01-SiteV2/knowledge/02-Opinion-Cards/${item.name})｜${item.person || "unknown"}｜${item.sourceUrl || "no-url"}`),
      "",
    ].join("\n");
    await writeFile(path.join(opinionDir, `${date}--frontier-opinion-index.md`), index, "utf8");
  }

  const totals = rows.reduce((acc, item) => {
    acc[item.tier] = (acc[item.tier] || 0) + 1;
    return acc;
  }, {});
  await saveTranslationCache(root, translationCache);
  console.log(JSON.stringify({ governed: rows.length, totals, duplicate_merge: mergeStats }, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
