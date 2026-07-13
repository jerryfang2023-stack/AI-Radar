import fs from "node:fs";
import path from "node:path";

export function hasCjk(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

export function sourceTitleNeedsChineseTranslation(value = "") {
  const text = String(value || "").trim();
  if (!text || hasCjk(text)) return false;
  return /[A-Za-z]{3}/u.test(text);
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
  return decodeHtmlEntities(value)
    .replace(/^["'`]+|["'`]+$/gu, "")
    .replace(/^(?:\u4e2d\u6587\u6807\u9898|\u8bd1\u6587|\u7ffb\u8bd1)[:\uff1a]\s*/u, "")
    .replace(/\s+/gu, " ")
    .trim();
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
  if (/\bAI agents?\b/iu.test(source) && !/AI\s*(?:智能体|代理)|智能体/iu.test(value)) return false;
  return true;
}

function generatedTitleTranslationLooksUsable(sourceTitle = "", translation = "") {
  if (!titleTranslationLooksUsable(sourceTitle, translation)) return false;
  const lowerWords = stripGeneratorNoise(translation).match(/\b[a-z]{3,}\b/gu) || [];
  const allowed = new Set(["api", "sdk", "mcp", "llm", "gpu", "cpu", "npu", "xai"]);
  return lowerWords.every((word) => allowed.has(word.toLowerCase()));
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
    if (entry?.generatedBy === "mymemory_title_translation") continue;
    if (!sourceTitle || !titleTranslationLooksUsable(sourceTitle, zhTitle)) continue;
    map.set(titleTranslationKey(sourceTitle), stripGeneratorNoise(zhTitle));
  }
  return map;
}

export function upsertSourceTitleTranslation(file, { sourceTitle = "", zhTitle = "", method = "", sourceUrl = "" } = {}) {
  const cleanSourceTitle = decodeHtmlEntities(sourceTitle).replace(/\s+/gu, " ").trim();
  const cleanZhTitle = stripGeneratorNoise(zhTitle);
  if (!titleTranslationLooksUsable(cleanSourceTitle, cleanZhTitle)) return false;

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

  const key = titleTranslationKey(cleanSourceTitle);
  const existing = payload.translations.find((entry) => titleTranslationKey(entry?.sourceTitle || "") === key);
  if (existing) {
    const existingZh = String(existing.zhTitle || existing.translation || "").trim();
    if (titleTranslationLooksUsable(cleanSourceTitle, existingZh)) return false;
    existing.sourceTitle = cleanSourceTitle;
    existing.zhTitle = cleanZhTitle;
    existing.generatedBy = method || "source_title_translation_generator";
    existing.generatedAt = new Date().toISOString();
    if (sourceUrl) existing.sourceUrl = sourceUrl;
  } else {
    const entry = {
      sourceTitle: cleanSourceTitle,
      zhTitle: cleanZhTitle,
      generatedBy: method || "source_title_translation_generator",
      generatedAt: new Date().toISOString(),
    };
    if (sourceUrl) entry.sourceUrl = sourceUrl;
    payload.translations.push(entry);
  }

  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return true;
}

async function translateTitleWithOpenAI(sourceTitle = "", {
  apiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_TITLE_TRANSLATION_API_KEY || "",
  model = process.env.TITLE_TRANSLATION_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini",
  timeoutMs = 12000,
} = {}) {
  if (!apiKey) return "";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content: [
            "Translate business-news source titles into concise Simplified Chinese.",
            "Preserve company names, product names, funding amounts, round names, dates, and named customers exactly.",
            "Do not add facts that are not present in the source title.",
            "Return only the translated title.",
          ].join(" "),
        },
        { role: "user", content: sourceTitle },
      ],
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) return "";
  const data = await response.json();
  return stripGeneratorNoise(data?.choices?.[0]?.message?.content || "");
}

function translateMoneyAmount(value = "") {
  const raw = String(value || "").replace(/,/gu, "").trim();
  const match = raw.match(/\$?\s*([\d.]+)\s*(billion|million|bn|m|b|k)?/iu);
  if (!match) return raw;
  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) return raw;
  const unit = String(match[2] || "").toLowerCase();
  const usd = /\$/u.test(raw) || /billion|million|bn|m|b|k/iu.test(raw);
  if (unit === "billion" || unit === "bn" || unit === "b") return `${formatNumber(amount * 10)} 亿${usd ? "美元" : ""}`;
  if (unit === "million" || unit === "m") {
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
  const directRules = [
    [/^help enterprises build their own ai agents$/iu, "帮助企业构建自有 AI 智能体"],
    [/^help companies automate repetitive work with ai teammates$/iu, "帮助企业用 AI 队友自动化重复工作"],
    [/^expand enterprise agent platform$/iu, "扩展企业智能体平台"],
    [/^scale ai platform modernizing public and private sector tendering$/iu, "扩展面向公共和私营部门招投标现代化的 AI 平台"],
    [/^power the future of restaurant hospitality$/iu, "支撑餐厅接待服务的未来"],
    [/^build ai that actually knows your organization$/iu, "打造真正了解组织的 AI"],
    [/^(?:its\s+)?ai training platform$/iu, "AI 训练平台"],
    [/^secure the growing swarm of ai agents in the enterprise$/iu, "保护企业不断增长的 AI 智能体集群"],
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

function translateTitleWithBusinessRules(sourceTitle = "") {
  const title = decodeHtmlEntities(sourceTitle)
    .replace(/\s+\|\s+[^|]+$/u, "")
    .replace(/\s+-\s+(?:TechCrunch|SiliconANGLE|AP News|Bloomberg|Reuters|Fortune)$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
  if (/^hot french startup zml releases free product to speed inference across lots of ai chips$/iu.test(title)) {
    return "法国初创公司 ZML 发布免费产品，用于提升多种 AI 芯片上的推理速度";
  }
  if (/^introducing taskade tsk-1:\s*the taskade system kernel(?:\s*\(2026\))?$/iu.test(title)) {
    return "Taskade 发布 TSK-1 系统内核，为工作区应用提供统一智能运行层";
  }
  if (/^announcing stigg 2\.0\s*[-–—:]\s*the usage runtime for ai products$/iu.test(title)) {
    return "Stigg 发布 2.0：面向 AI 产品的用量运行时";
  }
  const valuationFunding = title.match(/^(.+?)\s+(?:raises?|raised)\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|m|b|k)?)\s+at\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|m|b|k)?)\s+valuation(?:\s+(?:to|for)\s+(.+))?$/iu);
  if (valuationFunding) {
    const company = titleCaseName(valuationFunding[1]);
    const amount = translateMoneyAmount(valuationFunding[2]);
    const valuation = translateMoneyAmount(valuationFunding[3]);
    const purpose = translateBusinessPhrase(valuationFunding[4] || "");
    return `${company} 完成 ${amount}融资，估值 ${valuation}${purpose ? `，用于${purpose}` : ""}`;
  }
  const fundingPatterns = [
    /^(.+?)\s+(?:raises?|raised|secures?|secured|closes?|closed|lands?|landed|nabs?|nabbed)\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|m|b|k)?)\s*(?:(series\s+[a-z]|pre[-\s]?seed|seed|strategic investment)\s*)?(?:round|funding)?(?:\s+(?:to|for)\s+(.+))?$/iu,
    /^(.+?)\s+launches\s+with\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|m|b|k)?)\s*(?:(series\s+[a-z]|pre[-\s]?seed|seed)\s*)?(?:funding)?(?:\s+(?:to|for)\s+(.+))?$/iu,
    /^(.+?)\s+emerged?\s+from\s+stealth\s+with\s+(\$?\s*[\d,.]+\s*(?:billion|million|bn|m|b|k)?)\s*(?:(series\s+[a-z]|pre[-\s]?seed|seed)\s*)?(?:funding)?(?:\s+(?:to|for)\s+(.+))?$/iu,
  ];
  for (const pattern of fundingPatterns) {
    const match = title.match(pattern);
    if (!match) continue;
    const company = titleCaseName(match[1]);
    const amount = translateMoneyAmount(match[2]);
    const round = translateRound(match[3] || "");
    const purpose = translateBusinessPhrase(match[4] || "");
    const roundText = round ? `${round}融资` : "融资";
    return `${company} 完成 ${amount}${round ? ` ${roundText}` : roundText}${purpose ? `，用于${purpose}` : ""}`;
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

async function translateTitleWithMyMemory(sourceTitle = "", { timeoutMs = 12000 } = {}) {
  const text = decodeHtmlEntities(sourceTitle).replace(/\s+/gu, " ").trim();
  if (!text) return "";
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`;
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) return "";
  const data = await response.json();
  return stripGeneratorNoise(data?.responseData?.translatedText || "");
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

  // Generic public machine translation has repeatedly mistranslated protected
  // product names (for example LLM, Cursor and Anthropic). In production auto
  // mode, use the controlled model prompt when configured, then deterministic
  // business-event rules. An unresolved title must remain blocking instead of
  // being persisted as a plausible-looking but wrong Chinese title.
  const providers = provider === "auto" ? ["openai", "business-rule"] : [provider];
  for (const item of providers) {
    try {
      const translated = item === "openai"
        ? await translateTitleWithOpenAI(title, { timeoutMs })
        : item === "business-rule"
          ? translateTitleWithBusinessRules(title)
        : item === "mymemory"
          ? await translateTitleWithMyMemory(title, { timeoutMs })
          : "";
      if (generatedTitleTranslationLooksUsable(title, translated)) {
        return { titleZh: stripGeneratorNoise(translated), status: "translated", method: `${item}_title_translation` };
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
