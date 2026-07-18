#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import {
  cleanOpinionSource,
  completeOpinionTranslation,
  loadTranslationCache,
  saveTranslationCache,
  translateOpinionText,
} from "./opinion-translation-utils.mjs";
import { sourceTextHash } from "./deepseek-translation-client.mjs";
import { buildTagIndex, readTagTaxonomy } from "./tag-taxonomy-utils.mjs";

const root = process.cwd();
const sourceRelative = "01-SiteV2/site/data/follow-builders-daily.json";
const sourceFile = path.join(root, sourceRelative);
const outputFile = path.join(root, "01-SiteV2", "site", "data", "first-line-viewpoints-history.json");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const allowNetwork = args.get("translate") === "true";
const concurrency = Math.max(1, Math.min(8, Number(args.get("concurrency") || 4)));
const approvedMethods = new Set(["deepseek_translation", "manual_reviewed_translation", "source_chinese"]);
const tagIndex = buildTagIndex(readTagTaxonomy(root));

function runGit(params) {
  return execFileSync("git", params, { cwd: root, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, windowsHide: true });
}

function readJsonText(text, fallback = {}) {
  try { return JSON.parse(text); } catch { return fallback; }
}

function clean(value = "", limit = 10000) {
  return String(value || "").replace(/\s+/gu, " ").trim().slice(0, limit);
}

function validUrl(value = "") {
  try { return /^https?:$/u.test(new URL(value).protocol); } catch { return false; }
}

function shanghaiDate(value = "") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(date);
}

function sourceSnapshots() {
  const snapshots = [];
  if (fs.existsSync(sourceFile)) {
    snapshots.push({ hash: "working-tree", payload: readJsonText(fs.readFileSync(sourceFile, "utf8")) });
  }
  const hashes = runGit(["log", "--format=%H", "--", sourceRelative]).trim().split(/\r?\n/u).filter(Boolean);
  for (const hash of hashes) {
    try {
      snapshots.push({ hash, payload: readJsonText(runGit(["show", `${hash}:${sourceRelative}`])) });
    } catch {
      // A malformed or removed historical snapshot is not publication evidence.
    }
  }
  return { snapshots, hashes };
}

function tagById(id) {
  const tag = tagIndex.byId.get(id);
  return tag ? { id: tag.id, name: tag.name, group: tag.group } : null;
}

function derivedTagIds(topic = "") {
  if (topic === "AI 编程") return ["opinion-ai-coding", "track-ai-coding"];
  if (topic === "Agent") return ["opinion-agent-workflow", "track-ai-agent"];
  if (topic === "AI 基础设施") return ["opinion-model-infra", "track-ai-infra"];
  return ["opinion-product-strategy", "track-ai-applications"];
}

function normalizedTags(item = {}) {
  const supplied = [...(item.columnTags || []), ...(item.formalTags || [])]
    .map((tag) => typeof tag === "string" ? tag : tag?.id)
    .filter((id) => /^(?:opinion|track)-/u.test(id || ""));
  const ids = supplied.length ? supplied : derivedTagIds(item.topic);
  return [...new Set(ids)].map(tagById).filter(Boolean);
}

function isAiRelevant(item = {}) {
  if (["Agent", "AI 编程", "AI 基础设施"].includes(item.topic)) return true;
  const text = [item.text, item.content, item.topic].filter(Boolean).join(" ");
  return /\b(?:AI|AGI|LLM|GPT|Claude|Codex|Gemini|OpenAI|Anthropic|xAI|agent(?:ic|s)?|model(?:s)?|MCP|prompt(?:ing|s)?|inference|GPU|compute|token(?:s)?|sandbox|multimodal|open weights?|machine learning|deep learning|neural|vibe coding)\b|人工智能|大模型|智能体|模型推理|算力|多模态|提示词|机器学习|深度学习|AI编程|AI 编程/iu.test(text);
}

function approvedTranslation(source, translation, status, method, model, preferFull = false) {
  return status === "translated"
    && approvedMethods.has(method)
    && (method !== "deepseek_translation" || Boolean(model))
    && Boolean(completeOpinionTranslation(source, translation, { preferFullTranslation: preferFull }));
}

function normalizeRecord(item = {}, snapshotHash = "") {
  const titleSource = cleanOpinionSource(item.text);
  const contentSource = cleanOpinionSource(item.content);
  return {
    id: clean(item.id || item.url, 500),
    source: clean(item.source || item.sourceType, 100),
    name: clean(item.name, 200),
    handle: clean(item.handle, 200),
    role: clean(item.role, 1000),
    text: titleSource,
    content: contentSource,
    contentTranslation: clean(item.contentTranslation, 10000),
    contentTranslationStatus: item.contentTranslationStatus || (contentSource ? "pending_translation" : "unavailable"),
    contentTranslationMethod: item.contentTranslationMethod || "",
    contentTranslationModel: item.contentTranslationModel || "",
    contentTranslationSourceHash: contentSource ? sourceTextHash(contentSource) : "",
    translation: clean(item.translation, 10000),
    translationStatus: item.translationStatus || "pending_translation",
    translationMethod: item.translationMethod || "",
    translationModel: item.translationModel || "",
    translationSourceHash: titleSource ? sourceTextHash(titleSource) : "",
    topic: clean(item.topic, 100),
    columnTags: normalizedTags(item),
    sourceType: clean(item.sourceType || item.source, 100),
    observation: clean(item.observation, 2000),
    createdAt: item.createdAt || "",
    date: /^\d{4}-\d{2}-\d{2}$/u.test(item.date || "") ? item.date : shanghaiDate(item.createdAt),
    url: item.url || "",
    likes: Number(item.likes || 0),
    retweets: Number(item.retweets || 0),
    replies: Number(item.replies || 0),
    aiRelevant: true,
    historical: true,
    historySource: sourceRelative,
    historySnapshot: snapshotHash,
  };
}

function applyCached(record, cache) {
  const title = cache[`first-line-history:title:${record.url}`];
  if (title?.sourceHash === record.translationSourceHash
    && approvedTranslation(record.text, title.translation, title.status, title.method, title.model, true)) {
    Object.assign(record, {
      translation: title.translation,
      translationStatus: "translated",
      translationMethod: title.method,
      translationModel: title.model || "",
    });
  }
  if (record.content) {
    const content = cache[`first-line-history:content:${record.url}`];
    if (content?.sourceHash === record.contentTranslationSourceHash
      && approvedTranslation(record.content, content.translation, content.status, content.method, content.model, true)) {
      Object.assign(record, {
        contentTranslation: content.translation,
        contentTranslationStatus: "translated",
        contentTranslationMethod: content.method,
        contentTranslationModel: content.model || "",
      });
    }
  }
  return record;
}

function publicReady(item = {}) {
  if (!validUrl(item.url) || !item.name || !item.date || !isAiRelevant(item)) return false;
  if (!approvedTranslation(item.text, item.translation, item.translationStatus, item.translationMethod, item.translationModel, true)) return false;
  if (item.content && !approvedTranslation(item.content, item.contentTranslation, item.contentTranslationStatus, item.contentTranslationMethod, item.contentTranslationModel, true)) return false;
  return item.columnTags.some((tag) => tag.group === "opinion");
}

async function translateRecord(item, cache) {
  const title = await translateOpinionText(item.text, {
    cache, cacheKey: `first-line-history:title:${item.url}`, allowNetwork,
    preferFullTranslation: true, preferPro: item.text.length > 600,
  });
  Object.assign(item, {
    translation: title.translation || "",
    translationStatus: title.status,
    translationMethod: title.method,
    translationModel: title.model || "",
  });
  if (item.content) {
    const content = await translateOpinionText(item.content, {
      cache, cacheKey: `first-line-history:content:${item.url}`, allowNetwork,
      preferFullTranslation: true, preferPro: item.content.length > 600,
    });
    Object.assign(item, {
      contentTranslation: content.translation || "",
      contentTranslationStatus: content.status,
      contentTranslationMethod: content.method,
      contentTranslationModel: content.model || "",
    });
  }
  return item;
}

async function mapConcurrent(items, worker) {
  const output = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await worker(items[index], index);
    }
  }));
  return output;
}

async function main() {
  const { snapshots, hashes } = sourceSnapshots();
  const cache = await loadTranslationCache(root);
  const previous = fs.existsSync(outputFile) ? readJsonText(fs.readFileSync(outputFile, "utf8")) : {};
  const discoveredByUrl = new Map();
  for (const snapshot of snapshots) {
    for (const item of snapshot.payload?.remarks || []) {
      if (!discoveredByUrl.has(item.url) && validUrl(item.url)) {
        discoveredByUrl.set(item.url, normalizeRecord(item, snapshot.hash));
      }
    }
  }

  const discovered = [...discoveredByUrl.values()];
  const relevant = discovered.filter(isAiRelevant).map((item) => applyCached(item, cache));
  const alreadyApproved = relevant.filter(publicReady);
  const needsTranslation = relevant.filter((item) => !publicReady(item));
  const translated = allowNetwork ? await mapConcurrent(needsTranslation, (item) => translateRecord(item, cache)) : needsTranslation;
  if (allowNetwork) await saveTranslationCache(root, cache);

  const accepted = [...alreadyApproved, ...translated.filter(publicReady)]
    .sort((a, b) => b.date.localeCompare(a.date) || String(b.createdAt).localeCompare(String(a.createdAt)) || a.url.localeCompare(b.url));
  const pending = translated.filter((item) => !publicReady(item));
  const pendingReasons = !allowNetwork && previous.stats?.pendingReasons
    ? previous.stats.pendingReasons
    : {};
  if (allowNetwork || !previous.stats?.pendingReasons) {
    for (const item of pending) {
      const titleApproved = approvedTranslation(item.text, item.translation, item.translationStatus, item.translationMethod, item.translationModel, true);
      const reason = titleApproved && item.content
        ? item.contentTranslationMethod
        : item.translationMethod;
      pendingReasons[reason || "translation_gate_failed"] = (pendingReasons[reason || "translation_gate_failed"] || 0) + 1;
    }
  }
  const dates = accepted.map((item) => item.date).filter(Boolean).sort();
  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      sourceFile: sourceRelative,
      sourceCommits: hashes.length,
      sourceSnapshots: snapshots.length,
      earliestDate: dates[0] || "",
      latestDate: dates.at(-1) || "",
      dedupeKey: "original_url",
      sourcePolicy: "Historical records are reconstructed from committed morning-lane snapshots and retain their original URL and source snapshot.",
      translationPolicy: "Only complete approved Chinese translations with matching source hashes are published.",
    },
    stats: {
      discovered: discovered.length,
      aiRelevant: relevant.length,
      alreadyApproved: alreadyApproved.length,
      translatedThisRun: translated.filter(publicReady).length,
      pendingTranslation: pending.length,
      published: accepted.length,
      pendingReasons,
    },
    remarks: accepted,
  };
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    ok: pending.length === 0,
    output: path.relative(root, outputFile).replace(/\\/gu, "/"),
    ...payload.stats,
    earliestDate: payload.meta.earliestDate,
    latestDate: payload.meta.latestDate,
    ...(args.get("debug") === "true" ? { pendingSample: pending.map((item) => ({
      url: item.url,
      sourceType: item.sourceType,
      text: item.text.slice(0, 80),
      title: [item.translationStatus, item.translationMethod, item.translationModel],
      content: [item.contentTranslationStatus, item.contentTranslationMethod, item.contentTranslationModel],
    })).slice(0, 30) } : {}),
  }, null, 2));
  if (allowNetwork && pending.length) process.exitCode = 1;
}

await main();
