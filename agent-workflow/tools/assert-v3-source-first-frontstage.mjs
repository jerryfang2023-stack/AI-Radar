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
];

function subjectLooksLikeTitle(value = "") {
  const text = String(value || "").trim();
  return text.length > 12 && /(发布|推出|完成|融资|获得|部署|扩大|承诺|帮助|被叫停|可能|入股|渲染|升级|调整|增强|开始探索|押注|欲打破|榜单|指南|清单|将|支付|获取|聚焦|是 AIScraping|Introducing|Top AI|Complete Guide|Release Notes Agent|with quantization|Brings Enterprise|monetizing AI agents)/iu.test(text);
}

function subjectMatchesTitle(card = {}) {
  const subject = normalizedComparableText(card.subject);
  if (!subject) return false;
  return [card.title, card.originalTitle]
    .map(normalizedComparableText)
    .filter(Boolean)
    .some((title) => title === subject || (subject.length > 14 && title.includes(subject)));
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

const frontstageByDate = new Map();
for (const card of frontstageCards) {
  if (!cardIds.has(card.id)) issues.push(`frontstage card ${card.id || "(missing id)"} is not present in full cards asset set`);
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
  if (largeVendorTotal > 3) issues.push(`frontstage ${date} has ${largeVendorTotal} large-company cards, expected at most 3`);
  for (const [vendorKey, count] of largeVendorCounts.entries()) {
    if (count > 1) issues.push(`frontstage ${date} has ${count} cards for large company ${vendorKey}, expected at most 1`);
  }
}

for (const card of cards) {
  if (!card.title || !card.date || !card.sourceName) {
    issues.push(`card ${card.id || "(missing id)"} missing title/date/sourceName`);
  }
  if (!card.translatedFact && !(card.originalHighlights || []).length && !card.visibleFragment) {
    issues.push(`card ${card.id || "(missing id)"} has no source-facing fact/highlight/fragment`);
  }
  if (card.date === activeDate && (subjectLooksLikeTitle(card.subject) || subjectMatchesTitle(card))) {
    issues.push(`card ${card.id || "(missing id)"} has title-like subject: ${card.subject}`);
  }
  const sourceScope = [card.title, card.sourceUrl, card.visibleFragment, card.translatedFact].join("\n");
  for (const highlight of card.originalHighlights || []) {
    if (
      /Oracle E-Business Suite|Oracle PeopleSoft|Oracle Fusion Cloud ERP/u.test(highlight)
      && !/procurement|采购|SAP|RFQ|AgentCore|Bedrock/iu.test(sourceScope)
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
  if (candidate.date === activeDate && (subjectLooksLikeTitle(candidate.subject) || subjectMatchesTitle(candidate))) {
    issues.push(`core pool candidate ${candidate.id || "(missing id)"} has title-like subject: ${candidate.subject}`);
  }
}

const result = {
  ok: issues.length === 0,
  status: issues.length === 0 ? "passed" : "failed",
  checked_file: rel(jsonPath),
  card_count: cards.length,
  frontstage_card_count: frontstageCards.length,
  issue_count: issues.length,
  issues,
};

console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
