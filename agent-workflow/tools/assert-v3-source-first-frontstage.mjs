import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);
const jsonPath = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
const sourceTitleTranslationsFile = path.join(root, "01-SiteV2", "content", "11-databases", "source-title-translations.json");
const signalCardRoots = [
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "funding"),
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "case"),
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "product-service"),
];
const expectedDate = args.get("date") || "";

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

function titleTranslationKey(value = "") {
  return cleanOriginalTitle(cleanOriginalTitle(value)).toLowerCase().replace(/\s+/gu, " ").trim();
}

function loadSourceTitleTranslations() {
  if (!fs.existsSync(sourceTitleTranslationsFile)) return new Map();
  try {
    const json = JSON.parse(fs.readFileSync(sourceTitleTranslationsFile, "utf8"));
    const entries = Array.isArray(json) ? json : (Array.isArray(json.translations) ? json.translations : []);
    const map = new Map();
    for (const entry of entries) {
      if (!["openai_title_translation", "business-rule_title_translation", "controlled_model_prompt_title_translation", "manual_reviewed_source_title_translation"].includes(entry?.generatedBy)) continue;
      const sourceTitle = String(entry?.sourceTitle || "").trim();
      const zhTitle = String(entry?.zhTitle || entry?.translation || "").trim();
      if (!sourceTitle || !zhTitle || publicTextLooksGarbled(zhTitle)) continue;
      map.set(titleTranslationKey(sourceTitle), zhTitle);
    }
    return map;
  } catch (error) {
    console.error(JSON.stringify({ ok: false, status: "failed", reason: `invalid ${rel(sourceTitleTranslationsFile)}: ${error.message}` }, null, 2));
    process.exit(1);
  }
}

const sourceTitleTranslations = loadSourceTitleTranslations();

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

function frontmatterBlock(markdown = "") {
  return String(markdown || "").match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] || "";
}

function frontmatterScalar(fm = "", key = "") {
  const match = String(fm || "").match(new RegExp(`^${key}:\\s*(.+)$`, "mu"));
  if (!match) return "";
  const raw = match[1].trim();
  try {
    return JSON.parse(raw);
  } catch {
    return raw.replace(/^["']|["']$/gu, "").trim();
  }
}

function assetHasRequiredSourceTitleTranslation(fm = "") {
  const sourceTitle = frontmatterScalar(fm, "source_title");
  if (!sourceTitle || !sourceTitleNeedsChineseTranslation(sourceTitle)) return true;
  const titleZh = frontmatterScalar(fm, "title_zh");
  if (titleZh && hasCjk(titleZh) && !publicTextLooksGarbled(titleZh)) return true;
  return Boolean(sourceTitleTranslations.get(titleTranslationKey(sourceTitle)));
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
const cardIds = new Set(cards.map((card) => card.id).filter(Boolean));
const publicAssetIds = new Set(cards.map((card) => card.id).filter(Boolean));
const activeDate = payload.meta?.activeDate || "";
if (expectedDate && activeDate !== expectedDate) {
  issues.push(`payload activeDate is ${activeDate || "(missing)"}, expected ${expectedDate}`);
}
const assetDateForTranslationCheck = expectedDate || activeDate;
if (assetDateForTranslationCheck) {
  for (const file of signalCardRoots.flatMap(listMarkdownFiles)) {
    const fm = frontmatterBlock(fs.readFileSync(file, "utf8"));
    if (!fm) continue;
    if (frontmatterScalar(fm, "type") !== "signal_card") continue;
    if (frontmatterScalar(fm, "date") !== assetDateForTranslationCheck) continue;
    if (frontmatterScalar(fm, "status") !== "published") continue;
    if (!assetHasRequiredSourceTitleTranslation(fm)) {
      issues.push(`${rel(file)} has English source_title but no title_zh or exact source-title translation entry`);
    }
  }
}

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

function subjectLooksLikeTitle(value = "") {
  const text = cleanFrontstageSubject(value);
  if (text.length > 12 && /[，。；]/u.test(text)) return true;
  return text.length > 12 && /(发布|推出|完成|融资|获得|部署|重建|成为|指南|降低|提升|用于|进入|让|把|扩大|承诺|帮助|被叫停|可能|入股|渲染|升级|调整|增强|开始探索|押注|欲打破|榜单|清单|将|支付|获取|聚焦|量产|搭载|适配|公布|支持|可实现|每秒|芯片|人形机器人|模型|应用|功能|早报|日报|周报|合集|是 AIScraping|Introducing|Top AI|Complete Guide|How to|Lessons from|Release Notes Agent|with quantization|Brings Enterprise|monetizing AI agents|Paid Program|Weekly Updated)/iu.test(text);
}

function subjectHasSourceNoise(value = "") {
  return /https?:|[|｜]|RSS|热门|buzzing\.cc|Weekly Updated B2B Lead Database|^(IT早报|AI早报|早报|日报|周报)/iu.test(String(value || ""));
}

function subjectHasBusinessDisplayNoise(value = "") {
  return /^(AI business signal|Artificialintelligence-News|Today[’']s Hottest Role|From the Customer[’']s Side of the Table|Ltd\.?|Blog|Article|Post)$/iu.test(String(value || "").trim())
    || /^(TechCrunch|Techcrunch|Arstechnica|Ars Technica|MarkTechPost|Cfodive|Artificial Intelligence News)$/iu.test(String(value || "").trim());
}


function publicContentNeedsTranslation(value = "") {
  const text = String(value || "").trim();
  const hanCount = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  if (text.length > 70 && latinWords.length >= 10 && hanCount < 10) return true;
  if (text.length > 120 && latinWords.length >= 14 && hanCount < 18) return true;
  return false;
}

function publicTextLooksGarbled(value = "") {
  const text = String(value || "");
  const controlCount = text.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/gu)?.length || 0;
  const replacementCount = text.match(/[\uFFFD\u951F]/gu)?.length || 0;
  const mojibakeMarkers = [
    "\u947e\u5cf0\u7df1",
    "\u93c9\u30e6\u7c2e",
    "\u93c4\u5267\u305a",
    "\u6d7c\u4f77\u7b1f",
    "\u935f\u55d5\u7b1f",
    "\u93af\u546e",
    "\u5bf0\u546f",
    "\u9359\u621d\u7af7",
    "\u94fb\u5d88\u796b",
    "\u7039\u5c7e\u579a",
    "\u934f\ue100\u7d11",
    "\u6769\u501f\u91dc",
    "\u9358\u71b8\u6783",
    "\u9422\u3129\u20ac",
    "\u6d93\u6c2c\u59df",
    "\u6d5c\u0443\u6427",
    "\u59af\u2033\u7037",
    "\u93ba\u3125\u56ad",
    "\u5bee\u20ac\u9359",
    "\u93c5\u9e3f\u5158",
  ];
  const mojibakeCount = mojibakeMarkers.filter((marker) => text.includes(marker)).length;
  return controlCount > 0 || replacementCount >= 2 || mojibakeCount > 0;
}

function subjectIsMissing(value = "") {
  return String(value || "").trim() === "未标注主体";
}

function subjectIsGeneric(value = "") {
  const text = String(value || "").trim();
  return /^(AI business signal|Code|Post|Article|Williams|Arstechnica|Techcrunch|Cfodive|MarkTechPost|Market\.us)$/iu.test(text);
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

function publicCardEventText(card = {}) {
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

function isLowValueConsumerOrPlatformPolicySignal(card = {}) {
  const text = publicCardEventText(card);
  const consumerEntertainment = /Just Dance|舞力全开|mobile game|手游|游戏快报|玩家|曲库|K-POP|音舞|体感音乐|育碧|腾讯游戏/iu.test(text);
  const minorPlatformPolicy = /肖像保护|仿冒带货|带货达人|达人账号|素材盗用|侵权账号|侵权内容|平台治理|内容安全|相似内容阻断|举报|处置侵权/iu.test(text);
  const roundupOrExplainer = /更新汇总|月度更新|latest AI news|monthly update|roundup|weekly digest|why we built|我们为何构建/iu.test(text);
  const marketCommentary = /瑞银|UBS|分析师|研报|调研|开支|支出|spending|budget|cost concern|analyst/iu.test(text)
    && !/announces|launches|released|customer deployment|funding round|raises|closed|正式发布|推出|上线|客户部署|融资轮|完成融资/iu.test(text);
  const ventureFormation = /离开.*VC基金|创办.*VC基金|launch new VC firm|start a separate VC fund|new VC fund/iu.test(text)
    && !/raises|raised|closed|closes|fund size|\$\s?\d|完成.*募资|基金规模/iu.test(text);
  const businessAiSignal = /enterprise|B2B|customer deployment|production rollout|procurement|workflow|case study|SaaS|API|SDK|developer platform|paid enterprise|企业|客户|部署|采购|工作流|生产环境|融资|收购|合作伙伴|营收|合同|招标/iu.test(text);
  return ((consumerEntertainment || minorPlatformPolicy) && !businessAiSignal) || roundupOrExplainer || marketCommentary || ventureFormation;
}

function publicCardEventFingerprint(card = {}) {
  const text = publicCardEventText(card).toLowerCase();
  if (/prometheus/iu.test(text) && /(?:jeff\s+bezos|bezos|贝索斯)/iu.test(text) && /(?:\$?\s*12\s*b|120\s*亿|12\s*billion)/iu.test(text)) {
    return `${card.date}|prometheus|bezos|12b`;
  }
  const normalized = normalizedComparableText(text);
  return normalized ? `${card.date}|${normalized.slice(0, 80)}` : "";
}

function publicFactLooksLikeTemplateFallback(value = "") {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (!text) return true;
  if (/^[A-Z][A-Za-z0-9&.' -]+ customer story$/iu.test(text)) return true;
  if (/^(?:Ltd\.?|Inc\.?|LLC|Corp\.?|Company)\s*(?:\u83b7\u5f97|\u83b7|\u5b8c\u6210)\s*\$?\s*\d/iu.test(text)) return true;
  if (/来源材料显示，.+涉及.+流程|原文同时出现.+等数字/u.test(text)) return true;
  if (/原文称|的公开案例显示|公开案例显示.*AI\s*正在进入|AI 正在进入客户、采购、商品内容或内部工作流/iu.test(text)) return true;
  return /\u539f\u6587\u6240\u8ff0(?:\u80fd\u529b|\u573a\u666f)/u.test(text)
    || /\u539f\u6587\s*AI\s*\u4e8b\u4ef6/u.test(text)
    || /\u516c\u5f00\u6750\u6599\u63d0\u4f9b\u4e86\u4e00\u6761\u53ef\u8ffd\u8e2a\u7684\s*AI\s*\u5546\u4e1a\u4fe1\u53f7/u.test(text)
    || /\u9700\u7ee7\u7eed\u6838\u5bf9\u5ba2\u6237/u.test(text)
    || /\u5ba2\u6237\u3001\u4ea7\u54c1\u548c\u4e1a\u52a1\u7ed3\u679c/u.test(text)
    || /\u8fd9\u6761(?:\u6848\u4f8b|\u878d\u8d44|\u4ea7\u54c1)\u4fe1\u53f7\u53ef\u7528\u4e8e/u.test(text)
    || /\u4fe1\u53f7\u4ef7\u503c\u5728\u4e8e\u89c2\u5bdf/u.test(text)
    || /\u5177\u4f53\s*AI\s*\u5546\u4e1a\u4e8b\u4ef6/u.test(text)
    || (/\.\.\./u.test(text) && text.length < 140);
}

function publicFrontstageFactIsWeak(card = {}) {
  const fact = String(card.translatedFact || card.fact || "").trim();
  if (!fact) return true;
  if (publicTextLooksGarbled(fact)) return true;
  if (publicFactLooksLikeTemplateFallback(fact)) return true;
  if (/^原始来源链接：?https?:\/\//iu.test(fact)) return true;
  if (/公开材料提供了一条可追踪的 AI 商业信号|需继续核对客户、产品和业务结果/u.test(fact)) return true;
  return false;
}

function publicTitleIsGeneric(value = "") {
  const text = String(value || "").trim();
  if (/\b(?:AI business signal|Artificialintelligence-News|Ltd\.)\b/iu.test(text)) return true;
  if (titleLooksLikeGeneratedTemplate(text)) return true;
  if (/的公开案例显示|公开材料显示|原文称|AI 正在进入客户、采购、商品内容或内部工作流/iu.test(text)) return true;
  if (/^[A-Za-z0-9\u4e00-\u9fff][A-Za-z0-9\u4e00-\u9fff .&'’()/-]{1,80}\s+(?:获得|完成|宣布|携|启动).*(?:[$€£]\s?\d+(?:\.\d+)?|\d+(?:\.\d+)?\s?(?:M|B|K|m|b|k|million|billion|万美元|亿美元|万元|亿元)).*(?:融资|轮|启动|AI)/iu.test(text)) {
    return false;
  }
  if (/^[A-Za-z0-9\u4e00-\u9fff][A-Za-z0-9\u4e00-\u9fff .&'’()-]{1,60}\s+(?:获得|获)\s*\$?\d[\d.,]*(?:\s?(?:M|B|million|billion|万|亿|万美元))?\s*融资/iu.test(text)) {
    return false;
  }
  return /案例：\s*AI\s*进入|获得\s*\$|发布\s*AI\s*能力|把\s*AI\s*用进|信号：\s*AI\s*进入|推出\s*Agent\s*工作流能力，切入/iu.test(text);
}

function titleLooksLikeGeneratedTemplate(title = "") {
  return /\u8bb0\u5f55\u4f01\u4e1a\u5e94\u7528\u573a\u666f|\u516c\u5f00\u6750\u6599\u663e\u793a|\u5546\u4e1a\u4fe1\u53f7/iu.test(String(title || ""));
}

function cleanOriginalTitle(value = "") {
  return String(value || "")
    .replace(/\s*\|\s*[^|]{2,60}$/u, "")
    .replace(/\s+-\s*(TechCrunch|SiliconANGLE|BusinessWire|PR Newswire|Markets Insider|CFO Dive|Google Cloud Press Corner)$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function hasCjk(value = "") {
  return /[\u4e00-\u9fff]/u.test(String(value || ""));
}

function sourceTitleNeedsChineseTranslation(value = "") {
  const text = cleanOriginalTitle(value);
  const hanCount = text.match(/[\u4e00-\u9fff]/gu)?.length || 0;
  const latinWords = text.match(/\b[A-Za-z][A-Za-z0-9&.'-]*\b/gu) || [];
  if (hanCount > 0 && /(?:发布|上线|推出|更新|完成|获得|宣布|融资|合作|部署|采用|收购|获批)/u.test(text)) return false;
  return text.length > 12 && hanCount < 4 && latinWords.length >= 2;
}

function translatedSourceTitle(value = "") {
  return cleanOriginalTitle(sourceTitleTranslations.get(titleTranslationKey(value)) || "");
}

function confirmedFundingSourceTitle(title = "") {
  const text = cleanOriginalTitle(title);
  if (!text) return false;
  if (/(?:rumou?red|reportedly|in talks to|plans to|may raise|could raise|is seeking|will complete|消息称|据悉|拟|将完成|有望完成|寻求融资|计划融资)/iu.test(text)) return false;
  if (/(?:top .*investors|ranked by funding|funding tracker|funding roundup|weekly funding|list of|融资汇总|融资清单|投资人榜单|融资榜单)/iu.test(text)) return false;
  const amount = /(?:[$€£]\s?\d+(?:\.\d+)?\s?(?:M|B|K|m|b|k|million|billion)?|\d+(?:\.\d+)?\s?(?:million|billion|万美元|亿美元|万人民币|亿人民币|万元|亿元))/iu.test(text);
  const fundingTerm = /\b(?:funding|financing|round|seed|series|valuation|investment|launches with|emerged from stealth with)\b|融资|估值|轮|投资/iu.test(text);
  const fundingAction = /\b(?:raises?|raised|lands|secures|closes?|closed|announces?|announcing|launched with|launches with|emerged from stealth with)\b|完成|获得|宣布|融资/iu.test(text);
  const directRaiseOrLaunch = /\b(?:raises?|raised|lands|secures|launches with|emerged from stealth with)\b|融资/iu.test(text);
  return amount && ((fundingTerm && fundingAction) || directRaiseOrLaunch);
}

function fundingFallbackTitleBackedByOriginalSource(card = {}, title = "") {
  const cleanTitle = cleanOriginalTitle(title);
  if (card.category !== "funding" || !cleanTitle) return false;
  if ([card.sourceTitle, card.originalTitle].some((value) => sourceTitleNeedsChineseTranslation(value))) return false;
  if (publicTextLooksGarbled(cleanTitle) || titleLooksLikeGeneratedTemplate(cleanTitle)) return false;
  if (/来源标题|原始来源|公开材料显示|商业信号/iu.test(cleanTitle)) return false;
  if (/押注|资金流向|业务信号|基础设施能力|可用于观察|值得关注/u.test(cleanTitle)) return false;
  if (!/(?:获得|完成|宣布|融资|携|启动)|\b(?:launches with|launched with|raises?|raised|lands|secures|closes?)\b/iu.test(cleanTitle)) return false;
  if (!/(?:[$€£]\s?\d+(?:\.\d+)?|\d+(?:\.\d+)?\s?(?:M|B|K|m|b|k|million|billion|万美元|亿美元|万元|亿元))/iu.test(cleanTitle)) return false;
  return [card.sourceTitle, card.originalTitle]
    .map(cleanOriginalTitle)
    .filter(Boolean)
    .some(confirmedFundingSourceTitle);
}

function titleBackedByOriginalSource(card = {}) {
  const title = cleanOriginalTitle(card.title || card.displayTitle);
  if (!title || titleLooksLikeGeneratedTemplate(title) || publicTextLooksGarbled(title)) return false;
  if (fundingFallbackTitleBackedByOriginalSource(card, title)) return true;
  return [card.sourceTitle, card.originalTitle]
    .map(cleanOriginalTitle)
    .filter((value) => value && !titleLooksLikeGeneratedTemplate(value))
    .some((sourceTitle) => {
      if (sourceTitleNeedsChineseTranslation(sourceTitle)) {
        const translated = translatedSourceTitle(sourceTitle);
        return translated && hasCjk(title) && title === translated;
      }
      return title === sourceTitle;
    });
}

function publicCardFactIsWeak(card = {}) {
  const fact = String(card.translatedFact || card.fact || "").trim();
  if (!fact) return true;
  if (publicFactLooksLikeTemplateFallback(fact)) return true;
  if (/^原始来源链接：?https?:\/\//iu.test(fact)) return true;
  if (/^鍘熵?https?:\/\//iu.test(fact)) return true;
  if (/^##\s*P-\d+/iu.test(fact) || /\braw_ref:|\braw_original_id:|\braw_archive:|\bpool_refs:/iu.test(fact)) return true;
  if (/公开材料提供了一条可追踪的 AI 商业信号|需继续核对客户、产品和业务结果/iu.test(fact)) return true;
  return publicFrontstageFactIsWeak(card);
}

function checkPublicCardContract(card = {}, label = "public card") {
  const id = card.id || card.linkedCardId || "(missing id)";
  const isActiveDateItem = !activeDate || card.date === activeDate;
  if (isActiveDateItem && Array.isArray(card.notPromotedIssues) && card.notPromotedIssues.length) {
    issues.push(`${label} ${id} was rejected by Card semantic gate but still appears in public frontstage: ${card.notPromotedIssues.join("; ")}`);
  }
  if (isActiveDateItem && Object.prototype.hasOwnProperty.call(card, "modelGeneratedTitle")) {
    issues.push(`${label} ${id} exposes modelGeneratedTitle; public titles must come from source title translation only`);
  }
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
  if (isActiveDateItem && !titleBackedByOriginalSource(card)) {
    issues.push(`${label} ${id} public title is not backed by original source title translation: ${card.title}`);
  }
  if (isActiveDateItem && /^这条(?:融资|案例|产品)?信号可用于/u.test(String(card.summary || "").trim())) {
    issues.push(`${label} ${id} exposes category boilerplate instead of the Card asset value/evidence summary`);
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
  if (!publicAssetIds.has(card.id)) issues.push(`frontstage card ${card.id || "(missing id)"} is not present in the public Card set`);
  if (/^POOL-/u.test(String(card.id || "")) || card.cardSource !== "signal_card") {
    issues.push(`frontstage card ${card.id || "(missing id)"} is not a formal Signal Card asset`);
  }
  checkPublicCardContract(card, `frontstage card ${card.date || "(missing date)"}`);
  if (!card.date) continue;
  const list = frontstageByDate.get(card.date) || [];
  list.push(card);
  frontstageByDate.set(card.date, list);
}
for (const [date, items] of frontstageByDate.entries()) {
  if (date === payload.meta?.activeDate && items.length < 1) {
    issues.push(`frontstage ${date} has no public Cards`);
  }
  for (let index = 0; index < items.length; index += 1) {
    const currentScore = Number(items[index].frontstageRankScore) || 0;
    const nextScore = Number(items[index + 1]?.frontstageRankScore) || Number.NEGATIVE_INFINITY;
    if (nextScore > currentScore) issues.push(`frontstage ${date} is not sorted by importance at index ${index}`);
    if (!Number.isFinite(Number(items[index].frontstageRankScore))) {
      issues.push(`frontstage ${date} card ${items[index].id || "(missing id)"} is missing frontstageRankScore`);
    }
    if (!items[index].sourceUrl && (!Array.isArray(items[index].sourceLinks) || !items[index].sourceLinks.length)) {
      issues.push(`frontstage ${date} card ${items[index].id || "(missing id)"} is missing source URL references`);
    }
  }
}

const activeFrontstageCards = frontstageCards.filter((card) => card.date === activeDate);
if (!activeFrontstageCards.length) {
  issues.push(`payload has no active-date frontstage Cards for ${activeDate}`);
}

for (const card of cards) {
  if (!card.title || !card.date || !card.sourceName) {
    issues.push(`card ${card.id || "(missing id)"} missing title/date/sourceName`);
  }
  if (card.date === activeDate && (subjectHasSourceNoise(card.subject) || subjectHasBusinessDisplayNoise(card.subject) || subjectLooksLikeTitle(card.subject) || subjectMatchesTitle(card))) {
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
