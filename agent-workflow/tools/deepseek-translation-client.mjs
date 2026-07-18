import crypto from "node:crypto";

export function deepSeekModels(env = process.env) {
  return {
    flash: env.DEEPSEEK_FLASH_MODEL
      || env.DEEPSEEK_TITLE_TRANSLATION_MODEL
      || env.DEEPSEEK_MODEL
      || "deepseek-v4-flash",
    pro: env.DEEPSEEK_PRO_MODEL || "deepseek-v4-pro",
  };
}

export function sourceTextHash(value = "") {
  return crypto.createHash("sha256").update(String(value || "").trim()).digest("hex").slice(0, 16);
}

export function selectDeepSeekModel(source = "", { preferPro = false, env = process.env } = {}) {
  const text = String(source || "").trim();
  const paragraphCount = text.split(/\n\s*\n/gu).filter(Boolean).length;
  const models = deepSeekModels(env);
  return preferPro || text.length > 600 || paragraphCount >= 3 ? models.pro : models.flash;
}

export async function deepSeekChatCompletion({
  messages = [],
  model = "",
  maxTokens = 1200,
  temperature = 0.1,
  timeoutMs = 30000,
  apiKey = process.env.DEEPSEEK_API_KEY || "",
  baseUrl = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!apiKey || !baseUrl || !model || typeof fetchImpl !== "function") return "";
  const response = await fetchImpl(`${baseUrl.replace(/\/+$/u, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      temperature,
      max_tokens: maxTokens,
      thinking: { type: "disabled" },
      messages,
    }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) return "";
  const data = await response.json();
  return String(data?.choices?.[0]?.message?.content || "").trim();
}

export function parseDeepSeekJson(value = "") {
  const text = String(value || "").trim()
    .replace(/^```(?:json)?\s*/iu, "")
    .replace(/\s*```$/u, "")
    .trim();
  if (!text) throw new Error("deepseek_empty_json_response");
  try {
    return JSON.parse(text);
  } catch {
    const start = Math.min(...[text.indexOf("{"), text.indexOf("[")].filter((index) => index >= 0));
    const objectEnd = text.lastIndexOf("}");
    const arrayEnd = text.lastIndexOf("]");
    const end = Math.max(objectEnd, arrayEnd);
    if (!Number.isFinite(start) || start < 0 || end <= start) throw new Error("deepseek_invalid_json_response");
    return JSON.parse(text.slice(start, end + 1));
  }
}

export async function deepSeekJsonCompletion({
  messages = [],
  model = deepSeekModels().pro,
  maxTokens = 4096,
  temperature = 0,
  timeoutMs = 60000,
  validate = () => [],
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!process.env.DEEPSEEK_API_KEY) throw new Error("deepseek_key_missing_for_required_model_task");
  let lastProblems = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const retry = attempt
      ? [{ role: "user", content: `The previous JSON failed validation: ${lastProblems.join(", ")}. Return one corrected JSON value only.` }]
      : [];
    const raw = await deepSeekChatCompletion({
      messages: [...messages, ...retry],
      model: attempt ? deepSeekModels().pro : model,
      maxTokens,
      temperature,
      timeoutMs: attempt ? Math.max(timeoutMs, 90000) : timeoutMs,
      fetchImpl,
    });
    let payload;
    try {
      payload = parseDeepSeekJson(raw);
    } catch (error) {
      lastProblems = [error.message];
      continue;
    }
    lastProblems = [...new Set(validate(payload).filter(Boolean))];
    if (!lastProblems.length) {
      return {
        payload,
        provider: "deepseek",
        model: attempt ? deepSeekModels().pro : model,
        attempts: attempt + 1,
        generatedAt: new Date().toISOString(),
      };
    }
  }
  throw new Error(`deepseek_json_quality_failed:${lastProblems.join("|")}`);
}

function protectedUrls(value = "") {
  return [...String(value || "").matchAll(/https?:\/\/[^\s)\]}]+/giu)].map((match) => match[0]);
}

function protectedHandles(value = "") {
  return [...String(value || "").matchAll(/(?:^|\s)([@#][A-Za-z0-9_]+)/gu)].map((match) => match[1]);
}

function protectedNumbers(value = "") {
  const withoutUrls = protectedUrls(value).reduce((text, url) => text.replaceAll(url, " "), String(value || ""));
  return [...withoutUrls.matchAll(/(?:[$€£₹¥]\s*)?\d+(?:[.,]\d+)*(?:\s*(?:%|x|k|m|mn|bn|b|million|billion|cr|hours?|days?|weeks?|months?|years?))?/giu)]
    .map((match) => match[0].toLowerCase().replace(/[\s,]/gu, ""));
}

export function opinionTranslationProblems(source = "", translation = "", { preferFullTranslation = false } = {}) {
  const original = String(source || "").trim();
  const translated = String(translation || "").trim();
  const problems = [];
  const chineseCount = (translated.match(/[\u3400-\u9fff]/gu) || []).length;
  if (!translated || chineseCount < 4) problems.push("missing_chinese_translation");
  if (original && translated === original) problems.push("translation_equals_source");
  for (const url of protectedUrls(original)) {
    if (!translated.includes(url)) problems.push(`missing_url:${url}`);
  }
  for (const token of protectedHandles(original)) {
    if (!translated.includes(token)) problems.push(`missing_handle:${token}`);
  }
  const translatedNumbers = protectedNumbers(translated);
  for (const number of protectedNumbers(original)) {
    if (!translatedNumbers.includes(number)) problems.push(`missing_number:${number}`);
  }
  if (preferFullTranslation && original.length >= 500) {
    const minimumLength = Math.min(320, Math.floor(original.length * 0.25));
    if (translated.length < minimumLength) problems.push("translation_truncated");
  }
  return [...new Set(problems)];
}

function translationMessages(source, retryInstruction = "") {
  return [
    {
      role: "system",
      content: [
        "Translate the supplied builder viewpoint into faithful, natural Simplified Chinese.",
        "Preserve company names, product and model names, numbers, amounts, versions, dates, @handles, hashtags, and URLs exactly.",
        "Translate idioms by meaning rather than word by word. Do not summarize, omit, embellish, or add commentary.",
        "Keep paragraph and list structure. Return only the translation.",
      ].join(" "),
    },
    {
      role: "user",
      content: [`SOURCE:\n${source}`, retryInstruction].filter(Boolean).join("\n\n"),
    },
  ];
}

export async function translateOpinionWithDeepSeek(source = "", {
  preferFullTranslation = false,
  preferPro = false,
  timeoutMs = Number(process.env.DEEPSEEK_TRANSLATION_TIMEOUT_MS || 30000),
  fetchImpl = globalThis.fetch,
} = {}) {
  const text = String(source || "").trim();
  const sourceHash = sourceTextHash(text);
  if (!text) return { translation: "", status: "pending_translation", method: "empty_source", sourceHash };
  if (!process.env.DEEPSEEK_API_KEY) {
    return {
      translation: "",
      status: "pending_translation",
      method: "deepseek_key_missing_for_required_translation",
      sourceHash,
    };
  }

  const models = deepSeekModels();
  const firstModel = selectDeepSeekModel(text, { preferPro });
  const first = await deepSeekChatCompletion({
    messages: translationMessages(text),
    model: firstModel,
    maxTokens: Math.min(4096, Math.max(400, Math.ceil(text.length * 1.8))),
    timeoutMs,
    fetchImpl,
  });
  const firstProblems = opinionTranslationProblems(text, first, { preferFullTranslation });
  if (!firstProblems.length) {
    return {
      translation: first,
      status: "translated",
      method: "deepseek_translation",
      provider: "deepseek",
      model: firstModel,
      sourceHash,
      generatedAt: new Date().toISOString(),
      qualityStatus: "passed",
    };
  }

  const retry = await deepSeekChatCompletion({
    messages: translationMessages(text, `The previous translation failed these checks: ${firstProblems.join(", ")}. Translate the complete source again and copy every listed URL, handle, hashtag, number, amount, percentage, and version exactly into the translation.`),
    model: models.pro,
    maxTokens: Math.min(4096, Math.max(400, Math.ceil(text.length * 1.8))),
    timeoutMs: Math.max(timeoutMs, 45000),
    fetchImpl,
  });
  const retryProblems = opinionTranslationProblems(text, retry, { preferFullTranslation });
  if (!retryProblems.length) {
    return {
      translation: retry,
      status: "translated",
      method: "deepseek_translation",
      provider: "deepseek",
      model: models.pro,
      sourceHash,
      generatedAt: new Date().toISOString(),
      qualityStatus: "passed_after_pro_retry",
    };
  }
  return {
    translation: "",
    status: "pending_translation",
    method: "deepseek_translation_quality_failed",
    provider: "deepseek",
    model: firstModel,
    sourceHash,
    generatedAt: new Date().toISOString(),
    qualityStatus: "failed",
    qualityProblems: retryProblems,
  };
}
