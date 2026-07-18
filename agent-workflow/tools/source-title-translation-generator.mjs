import fs from "node:fs";
import path from "node:path";
import { deepSeekChatCompletion, deepSeekModels } from "./deepseek-translation-client.mjs";

export function hasCjk(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

const approvedTranslationMethods = new Set([
  "deepseek_title_translation",
  "manual_reviewed_source_title_translation",
]);

export function isApprovedSourceTitleTranslation(entry = {}) {
  return approvedTranslationMethods.has(String(entry?.generatedBy || "").trim());
}

export function sourceTitleNeedsChineseTranslation(value = "") {
  const text = String(value || "").trim();
  if (!text) return false;
  const hanCount = (text.match(/[\u4e00-\u9fff]/gu) || []).length;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  const hasChineseEventAction = /(?:发布|上线|推出|更新|完成|获得|宣布|融资|合作|部署|采购|采用|收购|获批|关停|开放|扩展|发布会)/u.test(text);
  if (hanCount >= 4 || (hanCount >= 2 && hasChineseEventAction)) return false;
  if (hanCount >= 1 && /\s(?:和|与|及)\s/u.test(text)) return false;
  const productListParts = text.split(/\s*[,，、]\s*/u).map((part) => part.replace(/\p{Extended_Pictographic}|\uFE0F|\u200D/gu, "").trim());
  if (productListParts.length >= 2 && productListParts.every((part) => /^[A-Za-z][A-Za-z0-9_.+-]*(?:\s+\d+(?:\.\d+)*)?$/u.test(part))) return false;
  return text.length > 12 && latinWords.length >= 2;
}

export function titleTranslationKey(value = "") {
  return decodeHtmlEntities(String(value || ""))
    .replace(/\s+/gu, " ")
    .trim()
    .toLowerCase();
}

function decodeHtmlEntities(value = "") {
  return String(value || "")
    .replace(/&amp;/giu, "&")
    .replace(/&quot;/giu, "\"")
    .replace(/&#39;|&apos;/giu, "'")
    .replace(/&nbsp;/giu, " ")
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function stripGeneratorNoise(value = "") {
  let text = decodeHtmlEntities(value)
    .replace(/^["'`]+|["'`]+$/gu, "")
    .replace(/^(?:\u4e2d\u6587\u6807\u9898|\u8bd1\u6587|\u7ffb\u8bd1)[:\uff1a]\s*/u, "")
    .replace(/^SOURCE TITLE:\s*/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
  const pipe = text.match(/^(.*)\s+[|｜]\s+([^|｜]+)$/u);
  if (pipe) {
    const before = pipe[1].trim();
    const suffix = pipe[2].trim();
    const beforeWords = before.match(/\b[A-Za-z][A-Za-z0-9.'-]*\b/gu) || [];
    const suffixWords = suffix.match(/\b[A-Za-z][A-Za-z0-9.'-]*\b/gu) || [];
    if ((hasCjk(before) || beforeWords.length >= 3) && suffixWords.length <= 4 && suffix.length <= 50) text = before;
  }
  return text;
}

export function normalizeSourceTitleTranslation(value = "") {
  return stripGeneratorNoise(value);
}

const moneyUnitFactors = new Map([
  ["trillion", 1e12],
  ["billion", 1e9],
  ["bn", 1e9],
  ["b", 1e9],
  ["million", 1e6],
  ["mn", 1e6],
  ["m", 1e6],
  ["k", 1e3],
  ["万亿", 1e12],
  ["亿", 1e8],
  ["万", 1e4],
  ["千", 1e3],
]);

function moneyCurrency(value = "") {
  const text = String(value || "").toLowerCase();
  if (/us\$|\$|usd|dollars?|美元|美金/u.test(text)) return "USD";
  if (/€|eur|euros?|欧元/u.test(text)) return "EUR";
  if (/£|gbp|pounds?|英镑/u.test(text)) return "GBP";
  if (/₹|inr|rupees?|卢比/u.test(text)) return "INR";
  if (/¥|jpy|yen|日元/u.test(text)) return "JPY";
  if (/rmb|cny|yuan|人民币|元/u.test(text)) return "CNY";
  return "";
}

export function extractMoneyAmounts(value = "") {
  const text = String(value || "");
  const pattern = /(?:(?:US\$|\$|€|£|¥|₹|USD|EUR|GBP|RMB|CNY|JPY|INR)\s*)?(\d[\d,]*(?:\.\d+)?)\s*(trillion|billion|million|bn|mn|m|b|k|万亿|亿|万|千)?(?![A-Za-z])\s*(?:US\s*)?(?:dollars?|euros?|pounds?|rupees?|yuan|yen|美元|美金|欧元|英镑|卢比|人民币|日元|元)?/giu;
  const results = [];
  for (const match of text.matchAll(pattern)) {
    const raw = match[0];
    const unit = String(match[2] || "").toLowerCase();
    const currency = moneyCurrency(raw);
    const context = text.slice(Math.max(0, (match.index || 0) - 40), (match.index || 0) + raw.length + 40);
    if (!currency && (!unit || !/(?:rais|fund|financ|valuation|revenue|round|融资|估值|募资|营收)/iu.test(context))) continue;
    const number = Number(String(match[1] || "").replace(/,/gu, ""));
    if (!Number.isFinite(number)) continue;
    results.push({
      raw,
      currency,
      value: number * (moneyUnitFactors.get(unit) || 1),
      start: match.index,
      end: match.index + raw.length,
    });
  }
  for (const match of text.matchAll(/\bhalf[- ](?:a[- ]?)?(billion|million)\s+dollars?\b/giu)) {
    results.push({
      raw: match[0],
      currency: "USD",
      value: match[1].toLowerCase() === "billion" ? 5e8 : 5e5,
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  results.sort((a, b) => a.start - b.start);
  return results;
}

export function sourceTitleNumericFacts(value = "") {
  const text = String(value || "");
  const amounts = extractMoneyAmounts(text);
  const otherNumbers = withoutSpans(text, amounts).match(/\d[\d,]*(?:\.\d+)?/gu) || [];
  return [...amounts.map((item) => item.raw.trim()), ...otherNumbers];
}

function withoutSpans(value = "", spans = []) {
  const characters = String(value || "").split("");
  for (const span of spans) {
    for (let index = span.start; index < span.end; index += 1) characters[index] = " ";
  }
  return characters.join("");
}

function sameNumericValue(first, second) {
  const scale = Math.max(1, Math.abs(first), Math.abs(second));
  return Math.abs(first - second) / scale < 1e-9;
}

function normalizeDateTokens(value) {
  return String(value || "")
    .replace(/'([0-9]{2})\b/gu, (_, year) => ` 20${year} `)
    .replace(/\bQ([1-4])\b/giu, (_, quarter) => ` QUARTER_${["ONE", "TWO", "THREE", "FOUR"][Number(quarter) - 1]} `)
    .replace(/第?([一二三四1-4])季度/gu, (_, quarter) => {
      const index = { 一: 0, 二: 1, 三: 2, 四: 3, 1: 0, 2: 1, 3: 2, 4: 3 }[quarter];
      return ` QUARTER_${["ONE", "TWO", "THREE", "FOUR"][index]} `;
    })
    .replace(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/giu, (_, month) => ` MONTH_${month.slice(0, 3).toUpperCase()} `)
    .replace(/(?:^|\D)(1[0-2]|[1-9])月/gu, (match, month) => `${match.startsWith(month) ? "" : match[0]} MONTH_${["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"][Number(month) - 1]} `);
}

function normalizeChineseQuantifiers(value) {
  return String(value || "")
    .replace(/([一二三四五六七八九十])(?=(?:年|个月|月|周|天|小时|分钟|倍|大))/gu, (match) => ({ 一: "1", 二: "2", 三: "3", 四: "4", 五: "5", 六: "6", 七: "7", 八: "8", 九: "9", 十: "10" }[match]));
}

function normalizeComparableScales(value) {
  const englishNumbers = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };
  const chineseNumbers = { 一: 1, 二: 2, 两: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
  return String(value || "")
    .replace(/\b(?:doubles?|doubled)\b/giu, " 2 ")
    .replace(/\b(?:triples?|tripled)\b/giu, " 3 ")
    .replace(/\b(?:quadruples?|quadrupled)\b/giu, " 4 ")
    .replace(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\s+times?\b/giu, (_, number) => ` ${englishNumbers[number.toLowerCase()]} `)
    .replace(/([一二两三四五六七八九十])\s*倍/gu, (_, number) => ` ${chineseNumbers[number]} `)
    .replace(/(\d[\d,]*(?:\.\d+)?)\s*(trillion|billion|million)\b/giu, (_, number, unit) => {
      const factor = { trillion: 1e12, billion: 1e9, million: 1e6 }[unit.toLowerCase()];
      return ` ${Number(number.replace(/,/gu, "")) * factor} `;
    })
    .replace(/(\d[\d,]*(?:\.\d+)?)\s*万亿/gu, (_, number) => ` ${Number(number.replace(/,/gu, "")) * 1e12} `)
    .replace(/(\d[\d,]*(?:\.\d+)?)\s*亿/gu, (_, number) => ` ${Number(number.replace(/,/gu, "")) * 1e8} `)
    .replace(/(\d[\d,]*(?:\.\d+)?)\s*万/gu, (_, number) => ` ${Number(number.replace(/,/gu, "")) * 1e4} `)
    .replace(/(\d[\d,]*(?:\.\d+)?)\s*(?:x|倍)\b/giu, (_, number) => ` ${number} `);
}

export function comparableNumericFacts(value = "", spans = []) {
  const remainder = withoutSpans(value, spans);
  const normalized = normalizeComparableScales(normalizeChineseQuantifiers(normalizeDateTokens(remainder)))
    .replace(/(\d[\d,]*(?:\.\d+)?)\s*lakh\b/giu, (_, number) => `${Number(number.replace(/,/gu, "")) * 100} k`);
  return [...normalized.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*(k|m|b|万|亿)?(?![A-Za-z])/giu)].map((match) => {
    const number = Number(match[1].replace(/,/gu, ""));
    const factor = moneyUnitFactors.get(String(match[2] || "").toLowerCase()) || 1;
    return String(number * factor);
  });
}

export function sourceTitleFactsPreserved(sourceTitle = "", translation = "") {
  const source = stripGeneratorNoise(sourceTitle);
  const target = stripGeneratorNoise(translation);
  const sourceAmounts = extractMoneyAmounts(source);
  const targetAmounts = extractMoneyAmounts(target);
  if (sourceAmounts.length !== targetAmounts.length) return false;

  const unusedTargetAmounts = [...targetAmounts];
  for (const sourceAmount of sourceAmounts) {
    const matchIndex = unusedTargetAmounts.findIndex((targetAmount) => {
      const yenSymbolIsAmbiguous = /¥/u.test(sourceAmount.raw)
        && ["JPY", "CNY"].includes(targetAmount.currency);
      const currencyMatches = !sourceAmount.currency || sourceAmount.currency === targetAmount.currency || yenSymbolIsAmbiguous;
      return currencyMatches && sameNumericValue(sourceAmount.value, targetAmount.value);
    });
    if (matchIndex === -1) return false;
    unusedTargetAmounts.splice(matchIndex, 1);
  }

  const sourceNumbers = comparableNumericFacts(source, sourceAmounts);
  const targetNumbers = comparableNumericFacts(target, targetAmounts);
  const normalizeNumbers = (items) => items.map((item) => item.replace(/,/gu, "")).sort();
  return JSON.stringify(normalizeNumbers(sourceNumbers)) === JSON.stringify(normalizeNumbers(targetNumbers));
}

function looksGarbled(value = "") {
  const text = String(value || "");
  const markers = ["\uFFFD", "锛", "鈥", "鎴", "鏄", "涓", "瀹", "绾", "鐨", "鍙", "闇"];
  return markers.some((marker) => text.includes(marker));
}

export function titleTranslationLooksUsable(sourceTitle = "", translation = "") {
  const source = stripGeneratorNoise(sourceTitle);
  const value = stripGeneratorNoise(translation);
  if (!source || !value || !hasCjk(value) || looksGarbled(value)) return false;
  if (/needs_ingestion_translation|missing_translation_db|pending translation/iu.test(value)) return false;
  if (value.toLowerCase() === source.toLowerCase()) return false;
  const cjkCount = (value.match(/[\u3400-\u9fff]/gu) || []).length;
  if (cjkCount < 2) return false;
  const latinOnly = /^[A-Za-z0-9\s.,:;'"!?$%&|/()[\]\-+]+$/u.test(value);
  if (latinOnly) return false;
  const protectedTerms = [
    ["LLM", /\bLLM\b|大语言模型/iu],
    ["Anthropic", /\bAnthropic\b/iu],
    ["Cursor", /\bCursor\b/iu],
    ["Perplexity", /\bPerplexity\b/iu],
    ["Fable", /\bFable\b/iu],
  ];
  for (const [term, translatedPattern] of protectedTerms) {
    if (new RegExp(`\\b${term}\\b`, "iu").test(source) && !translatedPattern.test(value)) return false;
  }
  if (/(?:^|[\s(])AI(?:$|[\s),:;/])/iu.test(source) && !/\bAI\b|人工智能|智能/iu.test(value)) return false;
  if (/\bAI agents?\b/iu.test(source) && !/AI\s*(?:智能体|代理)|智能体/iu.test(value)) return false;
  const repositoryPath = source.match(/^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)(?:\s+-\s+GitHub)?$/u)?.[1];
  if (repositoryPath && !value.includes(repositoryPath)) return false;
  return true;
}

export function generatedTitleTranslationLooksUsable(sourceTitle = "", translation = "") {
  if (!titleTranslationLooksUsable(sourceTitle, translation)) return false;
  if (!sourceTitleFactsPreserved(sourceTitle, translation)) return false;
  const residualConnectors = stripGeneratorNoise(translation)
    .match(/\b(?:the|and|to|for|with|from|into|across|after|before|as|at|by|is|are|of)\b/giu) || [];
  return residualConnectors.length < 2;
}

export function loadSourceTitleTranslations(file) {
  let payload = { translations: [] };
  try {
    payload = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return new Map();
  }
  const entries = Array.isArray(payload) ? payload : (Array.isArray(payload.translations) ? payload.translations : []);
  const map = new Map();
  for (const entry of entries) {
    const sourceTitle = String(entry?.sourceTitle || "").trim();
    const zhTitle = String(entry?.zhTitle || entry?.translation || "").trim();
    if (!isApprovedSourceTitleTranslation(entry)) continue;
    if (!sourceTitle || !titleTranslationLooksUsable(sourceTitle, zhTitle)) continue;
    map.set(titleTranslationKey(sourceTitle), stripGeneratorNoise(zhTitle));
  }
  return map;
}

export function upsertSourceTitleTranslations(file, updates = []) {
  let payload = {
    version: "source-title-translations-v1",
    description: "Business Signals frontstage title translations. Keys are original source titles only; do not add URL, keyword, company-name, or AI-generated title rules here.",
    translations: [],
  };
  try {
    if (fs.existsSync(file)) payload = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    // Keep the Raw path deterministic: rebuild the translation file shape if it was unreadable.
  }
  if (Array.isArray(payload)) payload = { version: "source-title-translations-v1", translations: payload };
  if (!Array.isArray(payload.translations)) payload.translations = [];
  let changed = 0;
  for (const { sourceTitle = "", zhTitle = "", method = "", model = "", sourceUrl = "" } of updates) {
    const cleanSourceTitle = decodeHtmlEntities(sourceTitle).replace(/\s+/gu, " ").trim();
    const cleanZhTitle = stripGeneratorNoise(zhTitle);
    if (!generatedTitleTranslationLooksUsable(cleanSourceTitle, cleanZhTitle)) continue;
    const key = titleTranslationKey(cleanSourceTitle);
    const existing = payload.translations.find((entry) => titleTranslationKey(entry?.sourceTitle || "") === key);
    if (existing) {
      const existingZh = String(existing.zhTitle || existing.translation || "").trim();
      if (isApprovedSourceTitleTranslation(existing) && generatedTitleTranslationLooksUsable(cleanSourceTitle, existingZh)) continue;
      existing.sourceTitle = cleanSourceTitle;
      existing.zhTitle = cleanZhTitle;
      existing.generatedBy = method || "source_title_translation_generator";
      if (model) existing.generatedModel = model;
      existing.generatedAt = new Date().toISOString();
      if (sourceUrl) existing.sourceUrl = sourceUrl;
    } else {
      const entry = {
        sourceTitle: cleanSourceTitle,
        zhTitle: cleanZhTitle,
        generatedBy: method || "source_title_translation_generator",
        generatedAt: new Date().toISOString(),
      };
      if (model) entry.generatedModel = model;
      if (sourceUrl) entry.sourceUrl = sourceUrl;
      payload.translations.push(entry);
    }
    changed += 1;
  }
  if (!changed) return 0;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return changed;
}

export function upsertSourceTitleTranslation(file, update = {}) {
  return upsertSourceTitleTranslations(file, [update]) > 0;
}

async function translateTitleWithDeepSeek(sourceTitle = "", {
  apiKey = process.env.DEEPSEEK_API_KEY || process.env.DEEPSEEK_TITLE_TRANSLATION_API_KEY || "",
  baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
  model = process.env.DEEPSEEK_TITLE_TRANSLATION_MODEL || deepSeekModels().flash,
  timeoutMs = 12000,
} = {}) {
  const messages = (retryInstruction = "") => [
    {
      role: "system",
      content: [
        "Translate business-news source titles into concise Simplified Chinese.",
        "Preserve company names, product names, funding amounts, round names, dates, and named customers exactly.",
        "Never calculate, round, change, omit, or add any number or monetary amount.",
        "Keep numbered phrases such as Day 1, Q1, and model versions with their original digits; do not rewrite Day 1 as 首日.",
        "Translate AI agent as AI 智能体. Remove publisher and website suffixes such as Company Announcement, FT.com, TechCrunch, or PYMNTS.com.",
        "Translate generic product-category words even when the title is mostly brand names; for example, translate Marketplace as 市场 while preserving NVIDIA AI Enterprise exactly.",
        "For a repository-only title such as owner/repository, preserve the exact path and translate it as GitHub 仓库：owner/repository.",
        "Do not add facts that are not present in the source title. Return only the translated title.",
      ].join(" "),
    },
    {
      role: "user",
      content: [
        `SOURCE TITLE:\n${sourceTitle}`,
        sourceTitleNumericFacts(sourceTitle).length
          ? `NUMERIC FACTS THAT MUST REMAIN EQUIVALENT:\n${sourceTitleNumericFacts(sourceTitle).join("; ")}`
          : "",
        retryInstruction,
      ].filter(Boolean).join("\n\n"),
    },
  ];
  const first = stripGeneratorNoise(await deepSeekChatCompletion({
    apiKey,
    baseUrl,
    model,
    timeoutMs,
    maxTokens: 120,
    messages: messages(),
  }));
  if (generatedTitleTranslationLooksUsable(sourceTitle, first)) return { text: first, model };
  const retryModel = deepSeekModels().pro;
  const retry = stripGeneratorNoise(await deepSeekChatCompletion({
    apiKey,
    baseUrl,
    model: retryModel,
    timeoutMs: Math.max(timeoutMs, 30000),
    maxTokens: 120,
    messages: messages("A previous translation was rejected. Preserve every amount, date, quarter, version, and count. If an amount such as $12.5 has no unit, keep the literal $12.5 and never infer million or billion. Keep tokens such as Q1 and model versions semantically exact."),
  }));
  return { text: retry, model: retryModel };
}

function translateMoneyAmount(value = "") {
  const raw = String(value || "").replace(/,/gu, "").trim();
  const match = raw.match(/\$?\s*([\d.]+)\s*(billion|million|bn|mn|m|b|k)?/iu);
  if (!match) return raw;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return raw;
  const unit = String(match[2] || "").toLowerCase();
  const usd = /\$/u.test(raw) || /billion|million|bn|m|b|k/iu.test(raw);
  if (unit === "billion" || unit === "bn" || unit === "b") return `${formatNumber(amount * 10)} 亿${usd ? "美元" : ""}`;
  if (unit === "million" || unit === "mn" || unit === "m") {
    if (amount >= 100) return `${formatNumber(amount / 100)} 亿${usd ? "美元" : ""}`;
    return `${formatNumber(amount * 100)} 万${usd ? "美元" : ""}`;
  }
  if (unit === "k") return `${formatNumber(amount / 10)} 万${usd ? "美元" : ""}`;
  return `${raw}${usd && !/美元/u.test(raw) ? "" : ""}`;
}

function formatNumber(value) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2))).replace(/\.0+$/u, "");
}

function translateRound(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  const series = text.match(/series\s+([a-z])/iu);
  if (series) return `${series[1].toUpperCase()} 轮`;
  if (/pre[-\s]?seed/iu.test(text)) return "Pre-seed 轮";
  if (/seed/iu.test(text)) return "种子轮";
  if (/strategic/iu.test(text)) return "战略投资";
  return text;
}

function titleCaseName(value = "") {
  return String(value || "")
    .replace(/\s+/gu, " ")
    .replace(/\s+(?:inc\.?|ltd\.?|llc|corp\.?|corporation)$/iu, "")
    .trim();
}

function translateBusinessPhrase(value = "") {
  let text = String(value || "")
    .replace(/\s+/gu, " ")
    .replace(/^to\s+/iu, "")
    .trim();
  if (!text) return "";
  const americanManufacturingScale = text.match(/^scale american manufacturing of (.+)$/iu);
  if (americanManufacturingScale) {
    const subject = translateBusinessPhrase(americanManufacturingScale[1]);
    return `扩大 ${subject}在美国的制造规模`;
  }
  const directRules = [
    [/^build ai hardware interfaces?$/iu, "打造 AI 硬件界面"],
    [/^help enterprises build their own ai agents$/iu, "帮助企业构建自有 AI 智能体"],
    [/^help companies automate repetitive work with ai teammates$/iu, "帮助企业用 AI 队友自动化重复工作"],
    [/^expand enterprise agent platform$/iu, "扩展企业智能体平台"],
    [/^scale ai platform modernizing public and private sector tendering$/iu, "扩展面向公共和私营部门招投标现代化的 AI 平台"],
    [/^power the future of restaurant hospitality$/iu, "支撑餐厅接待服务的未来"],
    [/^build ai that actually knows your organization$/iu, "打造真正了解组织的 AI"],
    [/^(?:its\s+)?ai training platform$/iu, "AI 训练平台"],
    [/^secure the growing swarm of ai agents in the enterprise$/iu, "保护企业不断增长的 AI 智能体集群"],
    [/^simulate customers with ai personas$/iu, "通过 AI 虚拟用户模拟客户反应"],
    [/^redefine the go-to-market architecture for revenue teams$/iu, "重塑收入团队的市场进入架构"],
  ];
  for (const [pattern, translation] of directRules) {
    if (pattern.test(text)) return translation;
  }
  const replacements = [
    [/\bpublic and private sector\b/giu, "公共和私营部门"],
    [/\benterprise\b/giu, "企业"],
    [/\benterprises\b/giu, "企业"],
    [/\bcompanies\b/giu, "企业"],
    [/\bai agents?\b/giu, "AI 智能体"],
    [/\bagentic\b/giu, "智能体"],
    [/\bagent platform\b/giu, "智能体平台"],
    [/\bplatform\b/giu, "平台"],
    [/\bworkflow\b/giu, "工作流"],
    [/\bworkflows\b/giu, "工作流"],
    [/\bautomation\b/giu, "自动化"],
    [/\bautomate\b/giu, "自动化"],
    [/\brepetitive work\b/giu, "重复工作"],
    [/\btendering\b/giu, "招投标"],
    [/\bprocurement\b/giu, "采购"],
    [/\brestaurant hospitality\b/giu, "餐厅接待服务"],
    [/\binference\b/giu, "推理"],
    [/\bai supercomputers?\b/giu, "AI 超级计算机"],
    [/\bsupercomputers?\b/giu, "超级计算机"],
    [/\brobots?\b/giu, "机器人"],
    [/\bproduction lines?\b/giu, "生产线"],
    [/\bai infrastructure factories\b/giu, "AI 基础设施工厂"],
    [/\bfree product\b/giu, "免费产品"],
    [/\bproduct\b/giu, "产品"],
    [/\btheir own\b/giu, "自有"],
    [/\bspeed\b/giu, "提升速度"],
    [/\bacross lots of\b/giu, "跨多种"],
    [/\bchips\b/giu, "芯片"],
    [/\bchip\b/giu, "芯片"],
    [/\bdeveloper\b/giu, "开发者"],
    [/\bdevelopers\b/giu, "开发者"],
    [/\bsecurity\b/giu, "安全"],
    [/\bdata\b/giu, "数据"],
    [/\bcloud\b/giu, "云"],
    [/\bbuild\b/giu, "构建"],
    [/\bmodernizing\b/giu, "现代化"],
    [/\bexpand\b/giu, "扩展"],
    [/\bscale\b/giu, "扩展"],
    [/\bpower\b/giu, "支撑"],
    [/\bhelp\b/giu, "帮助"],
    [/\bwith\b/giu, "用"],
    [/\bfor\b/giu, "面向"],
    [/\band\b/giu, "和"],
    [/\bthe future of\b/giu, ""],
  ];
  for (const [pattern, replacement] of replacements) text = text.replace(pattern, replacement);
  return text.replace(/\s+/gu, " ").trim();
}

function fundingPurposeClause(purpose = "") {
  const value = String(purpose || "").trim();
  if (!value) return "";
  return `，用于${/^[A-Za-z0-9]/u.test(value) ? " " : ""}${value}`;
}

function translateFundingSources(value = "") {
  return String(value || "")
    .replace(/,?\s+(?:and\s+)?others\b/iu, " 等投资方")
    .replace(/\s+/gu, " ")
    .trim();
}

function translateTitleWithBusinessRules(sourceTitle = "") {
  const title = decodeHtmlEntities(sourceTitle)
    .replace(/\s+\|\s+[^|]+$/u, "")
    .replace(/\s+-\s+(?:TechCrunch|SiliconANGLE|AP News|Bloomberg|Reuters|Fortune)$/iu, "")
    .replace(/\s+[—–-]\s+TFN$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
  if (/^hot french startup zml releases free product to speed inference across lots of ai chips$/iu.test(title)) {
    return "法国初创公司 ZML 发布免费产品，用于提升多种 AI 芯片上的推理速度";
  }
  if (/^introducing taskade tsk-1:\s*the taskade system kernel(?:\s*\(2026\))?$/iu.test(title)) {
    return "Taskade 发布 TSK-1：Taskade 系统内核（2026）";
  }
  if (/^announcing stigg 2\.0\s*[-–—:]\s*the usage runtime for ai products$/iu.test(title)) {
    return "Stigg 发布 2.0：面向 AI 产品的用量运行时";
  }
  if (/^meet talp:.*raising \$20m pre-seed valuation to simulate customers with ai personas$/iu.test(title)) {
    return "Talp 以 2000 万美元估值完成种子前轮融资，用于通过 AI 虚拟用户模拟客户反应";
  }
  if (/^how github used secret scanning to reach inbox zero$/iu.test(title)) {
    return "GitHub 使用秘密扫描清零安全告警积压";
  }
  if (/^claude code now has a built-in browser that lets the ai read, click, and type on external websites$/iu.test(title)) {
    return "Claude Code 新增内置浏览器，可直接读取、点击并操作外部网页";
  }
  if (/^meta removes controversial ai feature on instagram after backlash$/iu.test(title)) {
    return "Meta 在用户反弹后下线 Instagram 争议 AI 图片生成功能";
  }
  if (/^supermicro simplifies edge ai deployments with validated kubernetes appliances with red hat and everpure(?:\s+[—–-]\s+company announcement(?:\s+-\s+ft\.com)?)?$/iu.test(title)) {
    return "Supermicro 联合 Red Hat 和 Everpure 推出经验证的边缘 AI Kubernetes 一体机";
  }
  const expandedPartnership = title.match(/^(.+?)\s+and\s+(.+?)\s+expand partnership to\s+(.+)$/iu);
  if (expandedPartnership) {
    const firstCompany = titleCaseName(expandedPartnership[1]);
    const secondCompany = titleCaseName(expandedPartnership[2]);
    const purpose = translateBusinessPhrase(expandedPartnership[3]);
    return `${firstCompany} 与 ${secondCompany} 扩大合作，用于${purpose}`;
  }
  const productionShipment = title.match(/^(.+?)\s+ships\s+(\d+)\s+(.+?)\s+to production lines(?:\s+at\s+(\d+)\s+months old)?,\s+deploys at\s+(.+)$/iu);
  if (productionShipment) {
    const company = titleCaseName(productionShipment[1]);
    const count = productionShipment[2];
    const product = translateBusinessPhrase(productionShipment[3]);
    const companyAge = productionShipment[4] ? `成立 ${productionShipment[4]} 个月即` : "";
    const deployment = translateBusinessPhrase(productionShipment[5]).replace(/\s+和\s+/gu, " 与 ");
    return `${company} ${companyAge}向生产线交付 ${count} 台 ${product}，并部署于 ${deployment}`;
  }
  if (/^lyzr used its own ai agent to help raise a \$100mn round$/iu.test(title)) {
    return "Lyzr 使用自研 AI 智能体协助推进 1 亿美元融资";
  }
  if (/^lyzr['’]s ai agent ran its own \$100m series b fundraise(?:\s+[—–-]\s+ai chat daily)?$/iu.test(title)) {
    return "Lyzr 的 AI 智能体参与其 1 亿美元 B 轮融资流程";
  }
  if (/^lyzr ai raises \$100 million series b after its own ai agent sivaclaw fielded 130-plus investors and generated \$400 million in interest$/iu.test(title)) {
    return "Lyzr AI 完成 1 亿美元 B 轮融资，其 AI 智能体 SivaClaw 接洽 130 多名投资者并获得 4 亿美元投资意向";
  }
  const sourcedFunding = title.match(/^(.+?)\s+(?:raises?|raised|secures?|secured|closes?|closed|lands?|landed|nabs?|nabbed)\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|mn|m|b|k)?)\s+from\s+(.+?)(?:\s+to\s+(.+))?$/iu);
  if (sourcedFunding) {
    const company = titleCaseName(sourcedFunding[1]);
    const amount = translateMoneyAmount(sourcedFunding[2]);
    const sources = translateFundingSources(sourcedFunding[3]);
    const purpose = translateBusinessPhrase(sourcedFunding[4] || "");
    return `${company} 从 ${sources}获得 ${amount}融资${fundingPurposeClause(purpose)}`;
  }
  const valuationRound = title.match(/^meet\s+([^:]+):.+?\braising\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|mn|m|b|k)?)\s+(pre[-\s]?seed|seed|series\s+[a-z])\s+valuation(?:\s+round)?(?:\s+to\s+(.+))?$/iu);
  if (valuationRound) {
    const company = titleCaseName(valuationRound[1]);
    const valuation = translateMoneyAmount(valuationRound[2]);
    const round = translateRound(valuationRound[3]);
    const purpose = translateBusinessPhrase(valuationRound[4] || "");
    return `${company} 以 ${valuation}估值完成${round}融资${purpose ? `，用于${purpose}` : ""}`;
  }
  const valuationFunding = title.match(/^(.+?)\s+(?:raises?|raised)\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|mn|m|b|k)?)\s+at\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|mn|m|b|k)?)\s+valuation(?:\s+(?:to|for)\s+(.+))?$/iu);
  if (valuationFunding) {
    const company = titleCaseName(valuationFunding[1]);
    const amount = translateMoneyAmount(valuationFunding[2]);
    const valuation = translateMoneyAmount(valuationFunding[3]);
    const purpose = translateBusinessPhrase(valuationFunding[4] || "");
    return `${company} 完成 ${amount}融资，估值 ${valuation}${fundingPurposeClause(purpose)}`;
  }
  const fundingPatterns = [
    /^(.+?)\s+(?:raises?|raised|secures?|secured|closes?|closed|lands?|landed|nabs?|nabbed)\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|mn|m|b|k)?)\s*(?:(series\s+[a-z]|pre[-\s]?seed|seed|strategic investment)\s*)?(?:round|funding)?(?:(?:\s+(?:to|for)\s+(.+))|(?:\s+((?:after|as|while|with|and)\s+.+)))?$/iu,
    /^(.+?)\s+launches\s+with\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|mn|m|b|k)?)\s*(?:(series\s+[a-z]|pre[-\s]?seed|seed)\s*)?(?:funding)?(?:\s+(?:to|for)\s+(.+))?$/iu,
    /^(.+?)\s+emerged?\s+from\s+stealth\s+with\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|mn|m|b|k)?)\s*(?:(series\s+[a-z]|pre[-\s]?seed|seed)\s*)?(?:funding)?(?:\s+(?:to|for)\s+(.+))?$/iu,
  ];
  for (const pattern of fundingPatterns) {
    const match = title.match(pattern);
    if (!match) continue;
    const company = titleCaseName(match[1]);
    const amount = translateMoneyAmount(match[2]);
    const round = translateRound(match[3] || "");
    const purpose = translateBusinessPhrase(match[4] || "");
    const contextClause = /\bai agents?\b/iu.test(match[5] || "") ? "，其 AI 智能体参与融资流程" : "";
    const roundText = round ? `${round}融资` : "融资";
    return `${company} 完成 ${amount}${round ? ` ${roundText}` : roundText}${fundingPurposeClause(purpose)}${contextClause}`;
  }

  const launch = title.match(/^(.+?)\s+(?:launches|releases|introduces|unveils)\s+(.+?)(?:\s+(?:to|for)\s+(.+))?$/iu);
  if (launch) {
    const company = titleCaseName(launch[1]);
    const product = translateBusinessPhrase(launch[2]) || launch[2];
    const purpose = translateBusinessPhrase(launch[3] || "");
    return `${company} 发布 ${product}${purpose ? `，用于${purpose}` : ""}`;
  }

  return "";
}

export async function generateSourceTitleTranslation(sourceTitle = "", {
  provider = process.env.TITLE_TRANSLATION_PROVIDER || "auto",
  timeoutMs = Number(process.env.TITLE_TRANSLATION_TIMEOUT_MS || 12000),
  allowNetwork = true,
} = {}) {
  const title = decodeHtmlEntities(sourceTitle).replace(/\s+/gu, " ").trim();
  if (!sourceTitleNeedsChineseTranslation(title)) {
    return { titleZh: title, status: "not_required", method: "source_title" };
  }
  if (!allowNetwork || provider === "none") {
    return { titleZh: "", status: "needs_ingestion_translation", method: "title_translation_disabled" };
  }

  // Production translation is DeepSeek-only. Deterministic rules remain
  // validators and protected-fact repair helpers, never translation providers.
  const providers = provider === "auto" ? ["deepseek"] : [provider];
  for (const item of providers) {
    try {
      const generated = item === "deepseek"
        ? await translateTitleWithDeepSeek(title, { timeoutMs })
        : "";
      const translated = typeof generated === "object" ? generated.text : generated;
      if (generatedTitleTranslationLooksUsable(title, translated)) {
        return {
          titleZh: stripGeneratorNoise(translated),
          status: "translated",
          method: `${item}_title_translation`,
          model: typeof generated === "object" ? generated.model || "" : "",
        };
      }
    } catch {
      // Try the next provider. The caller records a failed status only after all providers fail.
    }
  }

  return { titleZh: "", status: "needs_ingestion_translation", method: "title_translation_generator_failed" };
}

export async function resolveSourceTitleTranslation(sourceTitle = "", {
  translationFile = "",
  sourceUrl = "",
  provider = "auto",
  timeoutMs = 12000,
  allowNetwork = true,
  generator = generateSourceTitleTranslation,
} = {}) {
  const title = decodeHtmlEntities(sourceTitle).replace(/\s+/gu, " ").trim();
  if (!title) return { titleZh: "", status: "missing_source_title", method: "none" };
  if (!sourceTitleNeedsChineseTranslation(title)) return { titleZh: title, status: "not_required", method: "source_title" };

  const translations = translationFile ? loadSourceTitleTranslations(translationFile) : new Map();
  const cached = translations.get(titleTranslationKey(title)) || "";
  if (titleTranslationLooksUsable(title, cached)) {
    return { titleZh: cached, status: "translated", method: "source_title_translation_db" };
  }

  const generated = await generator(title, { provider, timeoutMs, allowNetwork });
  if (generated.status === "translated" && titleTranslationLooksUsable(title, generated.titleZh)) {
    if (translationFile) {
      upsertSourceTitleTranslation(translationFile, {
        sourceTitle: title,
        zhTitle: generated.titleZh,
        method: generated.method,
        model: generated.model || "",
        sourceUrl,
      });
    }
    return generated;
  }

  return {
    titleZh: "",
    status: "needs_ingestion_translation",
    method: generated.method || "title_translation_generator_failed",
  };
}
