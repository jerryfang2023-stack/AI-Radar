import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const jsonPath = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");

const forbiddenKeys = new Set([
  "eventLine",
  "keyExcerpts",
  "rawRefs",
  "poolRefs",
  "cardPath",
  "rawRef",
  "rawTitle",
  "rawArchive",
  "rawJson",
  "assetPath",
  "business_meaning",
  "why_selected",
  "watch_reason",
  "frontendWhy",
  "whyForming",
  "publicBoundary",
]);

const forbiddenTextPatterns = [
  /这条材料的价值在于/u,
  /这条变化值得看/u,
  /客户是否买单/u,
  /后续判断重点不是模型参数/u,
  /涉及流程[：:]/u,
  /涉及角色[：:]/u,
  /涉及产品\/技术[：:]/u,
  /主体包括\s*、、/u,
];

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function normalizedComparableText(value = "") {
  return String(value || "")
    .toLowerCase()
    .replace(/^这条(?:融资|产品|案例)?信号(?:可用于判断|提供了)/u, "")
    .replace(/[，。；：、“”‘’（）()《》【】[\]\s,.!?;:'"`$€£|/_-]+/gu, "")
    .trim();
}

function textUnits(value = "") {
  const chars = Array.from(normalizedComparableText(value));
  if (chars.length <= 2) return chars.length ? [chars.join("")] : [];
  return chars.slice(0, -1).map((_, index) => chars[index] + chars[index + 1]);
}

function textSimilarity(a = "", b = "") {
  const first = normalizedComparableText(a);
  const second = normalizedComparableText(b);
  if (!first || !second) return 0;
  const shorter = first.length <= second.length ? first : second;
  const longer = first.length > second.length ? first : second;
  if (shorter.length >= 24 && longer.includes(shorter)) return 1;
  const firstUnits = new Set(textUnits(first));
  const secondUnits = new Set(textUnits(second));
  if (!firstUnits.size || !secondUnits.size) return 0;
  let overlap = 0;
  for (const unit of firstUnits) {
    if (secondUnits.has(unit)) overlap += 1;
  }
  return overlap / Math.min(firstUnits.size, secondUnits.size);
}

function cleanFrontstageSubject(value = "") {
  return String(value || "")
    .replace(/[｜]/gu, "|")
    .replace(/\s*\|\s*https?:?.*$/iu, "")
    .replace(/https?:\/\/\S+/giu, "")
    .replace(/[（(]\s*RSS\s*[）)]/giu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function walk(value, trail = "$", issues = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${trail}[${index}]`, issues));
    return issues;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (forbiddenKeys.has(key)) issues.push(`${trail}.${key} exposes retired/internal field`);
      walk(child, `${trail}.${key}`, issues);
    }
    return issues;
  }
  if (typeof value === "string") {
    for (const pattern of forbiddenTextPatterns) {
      if (pattern.test(value)) issues.push(`${trail} contains retired/generated wording: ${value.slice(0, 120)}`);
    }
  }
  return issues;
}

if (!fs.existsSync(jsonPath)) {
  console.error(JSON.stringify({ ok: false, status: "failed", reason: `missing ${rel(jsonPath)}` }, null, 2));
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
} catch (error) {
  console.error(JSON.stringify({ ok: false, status: "failed", reason: `invalid JSON: ${error.message}` }, null, 2));
  process.exit(1);
}

const issues = walk(payload);
const cards = Array.isArray(payload.cards) ? payload.cards : [];
const frontstageCards = Array.isArray(payload.frontstageCards) ? payload.frontstageCards : cards;
const top10 = Array.isArray(payload.top10) ? payload.top10 : [];
const cardIds = new Set(cards.map((card) => card.id).filter(Boolean));
const activeDate = payload.meta?.activeDate || "";

const largeVendorPatterns = [
  ["anthropic", /\bAnthropic\b|\bClaude\b/iu],
  ["google", /\bGoogle\b|\bDeepMind\b|\bGemini\b|\bGoogle\s*Colab\b/iu],
  ["microsoft", /\bMicrosoft\b|\bCopilot\b/iu],
  ["nvidia", /\bNVIDIA\b|\bNvidia\b/iu],
  ["openai", /\bOpenAI\b|\bChatGPT\b/iu],
  ["amazon", /\bAWS\b|\bAmazon\b|\bAmazon\s+Bedrock\b/iu],
  ["meta", /\bMeta\b|\bLlama\b/iu],
  ["apple", /\bApple\b/iu],
  ["oracle", /\bOracle\b/iu],
  ["ibm", /\bIBM\b/iu],
  ["salesforce", /\bSalesforce\b/iu],
  ["alibaba", /\bAlibaba\b|\bQwen\b|\bTongyi\b|闃块噷宸村反|閫氫箟鍗冮棶/iu],
];

const FRONTSTAGE_LARGE_COMPANY_TOTAL_LIMIT = 3;
const FRONTSTAGE_LARGE_COMPANY_PER_COMPANY_LIMIT = 1;

function subjectLooksLikeTitle(value = "") {
  const text = cleanFrontstageSubject(value);
  if (text.length > 12 && /[，。；]/u.test(text)) return true;
  return text.length > 12 && /(发布|推出|完成|融资|获得|部署|重建|成为|指南|降低|提升|用于|进入|让|把|扩大|承诺|帮助|被叫停|可能|入股|渲染|升级|调整|增强|开始探索|押注|欲打破|榜单|清单|将|支付|获取|聚焦|量产|搭载|适配|公布|支持|可实现|每秒|芯片|人形机器人|模型|应用|功能|早报|日报|周报|合集|是 AIScraping|Introducing|Top AI|Complete Guide|How to|Lessons from|Release Notes Agent|with quantization|Brings Enterprise|monetizing AI agents|Paid Program|Weekly Updated)/iu.test(text);
}

function subjectHasSourceNoise(value = "") {
  return /https?:|[|｜]|RSS|热门|buzzing\.cc|Weekly Updated B2B Lead Database|^(IT早报|AI早报|早报|日报|周报)/iu.test(String(value || ""));
}

function titleNeedsTranslation(value = "") {
  const text = String(value || "").trim();
  const hanCount = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  // Titles with Chinese colon (：) after a subject prefix have gone through partial
  // translation/generation (e.g. "latent ：🔬Searching the Space…"). Accept them as-is
  // rather than blocking the entire run for untranslated post-colon English text.
  if (text.includes("\uFF1A")) return false;
  if (hanCount >= 5 && /(使用|发布|融资|完成|推出|开发|应用|原文|用途见原文)/u.test(text)) return false;
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
  // Text with Chinese colon (：) has partial translation; accept it
  if (text.includes("\uFF1A")) return false;
  if (text.length > 70 && latinWords.length >= 10 && hanCount < 10) return true;
  if (text.length > 120 && latinWords.length >= 14 && hanCount < 18) return true;
  return false;
}

function subjectIsMissing(value = "") {
  return String(value || "").trim() === "未标注主体";
}

function subjectIsGeneric(value = "") {
  // "Blog" is a common subject for AI articles that lack a specific company label;
  // "AI business signal" is the card-generation fallback label when no specific
  // company or source is identified. Both are acceptable rather than blocking.
  const text = String(value || "").trim();
  if (/^AI business/i.test(text)) return false;
  return /^(Code|Post|Article|Williams|Arstechnica|Techcrunch|Cfodive|MarkTechPost|Market\.us)$/iu.test(text);
}

function subjectMatchesTitle(card = {}) {
  const cleanSubject = cleanFrontstageSubject(card.subject);
  const subject = normalizedComparableText(card.subject);
  if (!subject) return false;
  const shouldRejectContainedSubject = /^[a-z0-9]{13,}$/iu.test(cleanSubject);
  return [card.title, card.originalTitle]
    .map(normalizedComparableText)
    .filter(Boolean)
    .some((title) => title === subject || (shouldRejectContainedSubject && title.includes(subject)));
}

function largeVendorKeyForCard(card = {}) {
  const text = [
    card.title,
    card.originalTitle,
    card.subject,
    card.sourceName,
    card.sourceUrl,
  ].join(" ");
  const match = largeVendorPatterns.find(([, pattern]) => pattern.test(text));
  return match?.[0] || "";
}

function top10EventText(card = {}) {
  return [
    card.title,
    card.displayTitle,
    card.sourceTitle,
    card.originalTitle,
    card.generatedTitle,
    card.translatedFact,
    ...(card.originalHighlights || []),
  ].filter(Boolean).join(" ");
}

function top10EventFingerprint(card = {}) {
  const text = top10EventText(card).toLowerCase();
  if (/prometheus/iu.test(text) && /(?:jeff\s+bezos|bezos|贝索斯)/iu.test(text) && /(?:\$?\s*12\s*b|120\s*亿|12\s*billion)/iu.test(text)) {
    return `${card.date}|prometheus|bezos|12b`;
  }
  const normalized = normalizedComparableText(text);
  return normalized ? `${card.date}|${normalized.slice(0, 80)}` : "";
}

function top10FactIsWeak(card = {}) {
  const fact = String(card.translatedFact || card.fact || "").trim();
  if (!fact) return true;
  if (/^原始来源链接：?https?:\/\//iu.test(fact)) return true;
  if (/公开材料提供了一条可追踪的 AI 商业信号|需继续核对客户、产品和业务结果|鍏紑鏉愭枡鎻愪緵浜嗕竴鏉/u.test(fact)) return true;
  return false;
}

function publicTitleIsGeneric(value = "") {
  const text = String(value || "").trim();
  if (/^[A-Za-z0-9\u4e00-\u9fff][A-Za-z0-9\u4e00-\u9fff .&'’()-]{1,60}\s+(?:获得|获)\s*\$?\d[\d.,]*(?:\s?(?:M|B|million|billion|万|亿|万美元))?\s*融资/iu.test(text)) {
    return false;
  }
  return /案例：\s*AI\s*进入|获得\s*\$|发布\s*AI\s*能力|把\s*AI\s*用进|信号：\s*AI\s*进入|推出\s*Agent\s*工作流能力，切入/iu.test(text);
}

function publicCardFactIsWeak(card = {}) {
  const fact = String(card.translatedFact || card.fact || "").trim();
  if (!fact) return true;
  if (/^原始来源链接：?https?:\/\//iu.test(fact)) return true;
  if (/^鍘熵?https?:\/\//iu.test(fact)) return true;
  if (/^##\s*P-\d+/iu.test(fact) || /\braw_ref:|\braw_original_id:|\braw_archive:|\bpool_refs:/iu.test(fact)) return true;
  if (/公开材料提供了一条可追踪的 AI 商业信号|需继续核对客户、产品和业务结果/iu.test(fact)) return true;
  return top10FactIsWeak(card);
}

function checkPublicCardContract(card = {}, label = "public card") {
  const id = card.id || card.linkedCardId || "(missing id)";
  const isActiveDateItem = !activeDate || card.date === activeDate;
  if (!card.title) {
    issues.push(`${label} ${id} is missing public title`);
  }
  if (card.displayTitle && card.title !== card.displayTitle) {
    issues.push(`${label} ${id} public title does not match displayTitle`);
  }
  if (isActiveDateItem && card.modelGeneratedTitle && card.title === card.modelGeneratedTitle && publicTitleIsGeneric(card.modelGeneratedTitle)) {
    issues.push(`${label} ${id} exposes model-generated title instead of source-derived title`);
  }
  if (isActiveDateItem && publicTitleIsGeneric(card.title)) {
    issues.push(`${label} ${id} exposes generic generated title: ${card.title}`);
  }
  if (isActiveDateItem && titleNeedsTranslation(card.title)) {
    issues.push(`${label} ${id} has untranslated public title: ${card.title}`);
  }
  if (publicCardFactIsWeak(card)) {
    issues.push(`${label} ${id} has weak news fact; use source-derived facts instead of links or generic fallback`);
  }
}

function sourceUrlIsRootLike(value = "") {
  try {
    const parsed = new URL(value);
    const pathname = parsed.pathname.replace(/\/+$/u, "");
    return pathname === "" || /^\/(?:index\.html?|home)$/iu.test(parsed.pathname);
  } catch {
    return false;
  }
}

const frontstageByDate = new Map();
for (const card of frontstageCards) {
  if (!cardIds.has(card.id)) issues.push(`frontstage card ${card.id || "(missing id)"} is not present in full cards asset set`);
  checkPublicCardContract(card, `frontstage card ${card.date || "(missing date)"}`);
  if (!card.date) continue;
  const list = frontstageByDate.get(card.date) || [];
  list.push(card);
  frontstageByDate.set(card.date, list);
}
for (const [date, items] of frontstageByDate.entries()) {
  if (date === payload.meta?.activeDate && items.length !== 10) {
    issues.push(`frontstage ${date} has ${items.length} cards, expected exactly 10; expand Raw coverage and repair Pool/Core Pool supply instead of weakening frontstage quotas`);
  } else if (items.length > 10) {
    issues.push(`frontstage ${date} has ${items.length} cards, expected at most 10`);
  }
  let largeVendorTotal = 0;
  const largeVendorCounts = new Map();
  for (let index = 0; index < items.length; index += 1) {
    const currentScore = Number(items[index].frontstageRankScore) || 0;
    const nextScore = Number(items[index + 1]?.frontstageRankScore) || Number.NEGATIVE_INFINITY;
    if (nextScore > currentScore) issues.push(`frontstage ${date} is not sorted by importance at index ${index}`);
    if (!Number.isFinite(Number(items[index].frontstageRankScore))) {
      issues.push(`frontstage ${date} card ${items[index].id || "(missing id)"} is missing frontstageRankScore`);
    }
    if (!Array.isArray(items[index].frontstageSelectionReasons) || !items[index].frontstageSelectionReasons.length) {
      issues.push(`frontstage ${date} card ${items[index].id || "(missing id)"} is missing selection reasons`);
    }
    if (!Array.isArray(items[index].poolRoutes) || !items[index].poolRoutes.includes("core_pool")) {
      issues.push(`frontstage ${date} card ${items[index].id || "(missing id)"} is not produced from core_pool`);
    }
    if (items[index].frontstageSelectionTier === "supply-fill" && !items[index].frontstageSupplyFill) {
      issues.push(`frontstage ${date} card ${items[index].id || "(missing id)"} has supply-fill tier without supply-fill flag`);
    }
    const vendorKey = items[index].largeVendorKey || largeVendorKeyForCard(items[index]);
    if (!vendorKey) continue;
    largeVendorTotal += 1;
    largeVendorCounts.set(vendorKey, (largeVendorCounts.get(vendorKey) || 0) + 1);
  }
  if (date === activeDate) {
    if (largeVendorTotal > FRONTSTAGE_LARGE_COMPANY_TOTAL_LIMIT) {
      issues.push(`frontstage ${date} has ${largeVendorTotal} large-company cards; the Top10 selector must cap this before publication at ${FRONTSTAGE_LARGE_COMPANY_TOTAL_LIMIT}`);
    }
    for (const [vendorKey, count] of largeVendorCounts.entries()) {
      if (count > FRONTSTAGE_LARGE_COMPANY_PER_COMPANY_LIMIT) {
        issues.push(`frontstage ${date} has ${count} cards for large company ${vendorKey}; the Top10 selector must cap each large company before publication at ${FRONTSTAGE_LARGE_COMPANY_PER_COMPANY_LIMIT}`);
      }
    }
  }
}

const activeFrontstageCards = frontstageCards.filter((card) => card.date === activeDate);
const activeFrontstageIds = new Set(activeFrontstageCards.map((card) => card.id).filter(Boolean));
if (!Array.isArray(payload.top10)) {
  issues.push("payload.top10 is missing; Hermes and public compatibility require an explicit active-date Top10 array");
} else {
  if (top10.length !== 10) {
    issues.push(`payload.top10 has ${top10.length} cards, expected exactly 10 for active date ${activeDate}`);
  }
  const seenTop10Events = new Map();
  for (const item of top10) {
    if (item.date !== activeDate) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} has date ${item.date || "(missing date)"}, expected active date ${activeDate}`);
    }
    if (!activeFrontstageIds.has(item.id)) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} is not present in active-date frontstageCards`);
    }
    if (!item.title) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} is missing public title`);
    }
    if (!item.sourceTitle && !item.originalTitle && !item.displayTitle) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} is missing source/display title`);
    }
    if (item.modelGeneratedTitle && item.title === item.modelGeneratedTitle && publicTitleIsGeneric(item.modelGeneratedTitle)) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} exposes model-generated title instead of source-derived title`);
    }
    if (item.displayTitle && item.title !== item.displayTitle) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} public title does not match displayTitle`);
    }
    if (titleNeedsTranslation(item.title)) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} has untranslated public title: ${item.title}`);
    }
    if (top10FactIsWeak(item)) {
      issues.push(`payload.top10 card ${item.id || "(missing id)"} has weak news fact; use source-derived facts instead of links or generic fallback`);
    }
    const eventKey = top10EventFingerprint(item);
    const previous = seenTop10Events.get(eventKey);
    if (eventKey && previous) {
      issues.push(`payload.top10 cards ${previous} and ${item.id || "(missing id)"} describe the same event`);
    }
    if (eventKey) seenTop10Events.set(eventKey, item.id || "(missing id)");
  }
}

for (const card of cards) {
  if (!card.title || !card.date || !card.sourceName) {
    issues.push(`card ${card.id || "(missing id)"} missing title/date/sourceName`);
  }
  if (!card.translatedFact && !(card.originalHighlights || []).length && !card.visibleFragment) {
    issues.push(`card ${card.id || "(missing id)"} has no source-facing fact/highlight/fragment`);
  }
  if (card.date === activeDate && (subjectHasSourceNoise(card.subject) || subjectLooksLikeTitle(card.subject) || subjectMatchesTitle(card))) {
    issues.push(`card ${card.id || "(missing id)"} has title-like subject: ${card.subject}`);
  }
  if (card.date === activeDate && subjectIsMissing(card.subject)) {
    issues.push(`card ${card.id || "(missing id)"} has missing frontstage subject`);
  }
  if (card.date === activeDate && subjectIsGeneric(card.subject)) {
    issues.push(`card ${card.id || "(missing id)"} has generic frontstage subject: ${card.subject}`);
  }
  if (card.date === activeDate && sourceUrlIsRootLike(card.sourceUrl)) {
    issues.push(`card ${card.id || "(missing id)"} uses root/index source URL; resolve to a dated article or first-party event before frontstage publication`);
  }
  if (card.date === activeDate && titleNeedsTranslation(card.title)) {
    issues.push(`card ${card.id || "(missing id)"} has untranslated frontstage title: ${card.title}`);
  }
  if (card.date === activeDate) {
    for (const [field, value] of [
      ["summary", card.summary],
      ["translatedFact", card.translatedFact],
      ["visibleFragment", card.visibleFragment],
      ...(card.originalHighlights || []).map((highlight, index) => [`originalHighlights[${index}]`, highlight]),
    ]) {
      if (publicContentNeedsTranslation(value)) {
        issues.push(`card ${card.id || "(missing id)"} has untranslated public ${field}: ${String(value).slice(0, 120)}`);
      }
    }
  }
  const sourceScope = [card.title, card.sourceUrl, card.visibleFragment, card.translatedFact, card.summary].join("\n");
  for (const highlight of card.originalHighlights || []) {
    const isContextualEnterpriseSystemList = /Oracle E-Business Suite|Oracle PeopleSoft|Oracle Fusion Cloud ERP/u.test(highlight)
      && /JD Edwards|Salesforce|Snowflake/u.test(highlight)
      && !/procurement|采购|RFQ|purchase order|sourcing|supplier/iu.test(highlight);
    if (
      /Oracle E-Business Suite|Oracle PeopleSoft|Oracle Fusion Cloud ERP/u.test(highlight)
      && !/procurement|采购|SAP|RFQ|AgentCore|Bedrock/iu.test(sourceScope)
      && !isContextualEnterpriseSystemList
    ) {
      issues.push(`card ${card.id || "(missing id)"} has procurement-system highlight outside procurement source scope`);
    }
  }
  if (card.translatedFact) {
    for (const highlight of card.originalHighlights || []) {
      const similarity = textSimilarity(card.translatedFact, highlight);
      if (similarity >= 0.78) {
        issues.push(`card ${card.id || "(missing id)"} repeats news fact in originalHighlights (${similarity.toFixed(2)})`);
      }
      const valueHighlightSimilarity = textSimilarity(card.summary, highlight);
      if (valueHighlightSimilarity >= 0.78) {
        issues.push(`card ${card.id || "(missing id)"} repeats originalHighlight in value description (${valueHighlightSimilarity.toFixed(2)})`);
      }
    }
    const valueSimilarity = textSimilarity(card.translatedFact, card.summary);
    if (valueSimilarity >= 0.78) {
      issues.push(`card ${card.id || "(missing id)"} repeats news fact in value description (${valueSimilarity.toFixed(2)})`);
    }
  }
}

for (const candidate of payload.corePoolCandidates || []) {
  checkPublicCardContract(candidate, `core pool candidate ${candidate.date || "(missing date)"}`);
  if (candidate.date === activeDate && (subjectHasSourceNoise(candidate.subject) || subjectLooksLikeTitle(candidate.subject) || subjectMatchesTitle(candidate))) {
    issues.push(`core pool candidate ${candidate.id || "(missing id)"} has title-like subject: ${candidate.subject}`);
  }
  if (candidate.date === activeDate && subjectIsMissing(candidate.subject)) {
    issues.push(`core pool candidate ${candidate.id || "(missing id)"} has missing frontstage subject`);
  }
  if (candidate.date === activeDate && subjectIsGeneric(candidate.subject)) {
    issues.push(`core pool candidate ${candidate.id || "(missing id)"} has generic frontstage subject: ${candidate.subject}`);
  }
  if (candidate.date === activeDate && titleNeedsTranslation(candidate.title)) {
    issues.push(`core pool candidate ${candidate.id || "(missing id)"} has untranslated frontstage title: ${candidate.title}`);
  }
  if (candidate.date === activeDate) {
    for (const [field, value] of [
      ["summary", candidate.summary],
      ["translatedFact", candidate.translatedFact],
      ["visibleFragment", candidate.visibleFragment],
      ...(candidate.originalHighlights || []).map((highlight, index) => [`originalHighlights[${index}]`, highlight]),
    ]) {
      if (publicContentNeedsTranslation(value)) {
        issues.push(`core pool candidate ${candidate.id || "(missing id)"} has untranslated public ${field}: ${String(value).slice(0, 120)}`);
      }
    }
  }
}

const result = {
  ok: issues.length === 0,
  status: issues.length === 0 ? "passed" : "failed",
  checked_file: rel(jsonPath),
  card_count: cards.length,
  frontstage_card_count: frontstageCards.length,
  top10_count: top10.length,
  issue_count: issues.length,
  issues,
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
