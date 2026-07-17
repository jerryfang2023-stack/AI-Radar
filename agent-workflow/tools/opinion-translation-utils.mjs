import fs from "node:fs/promises";
import path from "node:path";
import {
  opinionTranslationProblems,
  sourceTextHash,
  translateOpinionWithDeepSeek,
} from "./deepseek-translation-client.mjs";

const cacheFile = (root) => path.join(root, "agent-workflow", "cache", "opinion-translations.json");

export async function loadTranslationCache(root) {
  try {
    return JSON.parse(await fs.readFile(cacheFile(root), "utf8"));
  } catch {
    return {};
  }
}

export async function saveTranslationCache(root, cache) {
  pruneLegacyTranslationCache(cache);
  await fs.mkdir(path.dirname(cacheFile(root)), { recursive: true });
  await fs.writeFile(cacheFile(root), `${JSON.stringify(cache, null, 2)}\n`, "utf8");
}

export function pruneLegacyTranslationCache(cache = {}) {
  let removed = 0;
  for (const [key, entry] of Object.entries(cache)) {
    const method = String(entry?.method || "");
    if (method === "deepseek_translation" || method === "manual_reviewed_translation") continue;
    delete cache[key];
    removed += 1;
  }
  return removed;
}

export function visibleChineseTranslation(text = "") {
  const value = String(text || "").trim();
  if (!value) return "";
  const chineseChars = value.match(/[\u4e00-\u9fff]/gu) || [];
  if (chineseChars.length >= Math.max(4, Math.floor(value.length * 0.1))) return value;
  return "";
}

export function completeOpinionTranslation(source = "", translation = "", { preferFullTranslation = false } = {}) {
  return opinionTranslationProblems(source, translation, { preferFullTranslation }).length
    ? ""
    : String(translation || "").trim();
}

export { opinionTranslationProblems };

function normalizeText(text = "") {
  return String(text || "")
    .replace(/閳ユ獨/g, "'s")
    .replace(/閳ユ獩/g, "n't")
    .replace(/閳ユ獫/g, "'ve")
    .replace(/閳ユ獧/g, "'re")
    .replace(/閳ユ獡/g, "'m")
    .replace(/閳?/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanOpinionSource(text = "") {
  return normalizeText(text)
    .replace(/\blikes=\d+;?\s*/giu, "")
    .replace(/\bretweets=\d+;?\s*/giu, "")
    .replace(/\breplies=\d+;?\s*/giu, "")
    .replace(/\s*\|\s*Join\s+\d+[KMB]?\+?\s+readers.*$/iu, "")
    .replace(/\s*\|\s*Product at .+$/iu, "")
    .replace(/\s*\|\s*Practical AI tutorials.*$/iu, "")
    .replace(/\s+/gu, " ")
    .trim();
}

function approvedCachedTranslation(entry = {}, source = "", preferFullTranslation = false) {
  const approvedMethod = entry?.method === "deepseek_translation"
    || entry?.method === "manual_reviewed_translation";
  return approvedMethod
    && entry?.sourceHash === sourceTextHash(source)
    && completeOpinionTranslation(source, entry?.translation || "", { preferFullTranslation });
}

export async function translateOpinionText(text = "", {
  cache = {},
  cacheKey = "",
  allowNetwork = true,
  preferFullTranslation = false,
  preferPro = false,
} = {}) {
  const existing = visibleChineseTranslation(text);
  if (existing) {
    return {
      translation: existing,
      status: "translated",
      method: "source_chinese",
      sourceHash: sourceTextHash(existing),
      qualityStatus: "passed",
    };
  }

  const source = cleanOpinionSource(text);
  if (!source) return { translation: "", status: "pending_translation", method: "empty_source" };
  const key = cacheKey || source;
  const cached = approvedCachedTranslation(cache[key], source, preferFullTranslation);
  if (cached) return { ...cache[key], translation: cached, status: "translated" };

  if (!allowNetwork) {
    const result = {
      translation: "",
      status: "pending_translation",
      method: "translation_network_disabled",
      sourceHash: sourceTextHash(source),
    };
    cache[key] = result;
    return result;
  }

  try {
    const result = await translateOpinionWithDeepSeek(source, {
      preferFullTranslation,
      preferPro: preferPro || (preferFullTranslation && source.length > 600),
    });
    cache[key] = result;
    return result;
  } catch (error) {
    const result = {
      translation: "",
      status: "pending_translation",
      method: "deepseek_translation_request_failed",
      sourceHash: sourceTextHash(source),
      error: String(error?.message || error).slice(0, 240),
    };
    cache[key] = result;
    return result;
  }
}

export function replaceBodyTranslation(body = "", translation = "") {
  if (!translation) return body;
  const label = "中文翻译：";
  const translationBlock = `${label}\n${translation}`;
  const pattern = /^\s*中文(?:翻译|转述)[：:]\s*[\s\S]*?(?=\n##\s|\n#\s|$)/mu;
  if (pattern.test(body)) return body.replace(pattern, translationBlock);
  return `${body.trimEnd()}\n\n${translationBlock}\n`;
}
