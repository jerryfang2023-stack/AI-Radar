#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  completeOpinionTranslation,
  cleanOpinionSource,
  loadTranslationCache,
  opinionTranslationProblems,
  saveTranslationCache,
  translateOpinionText,
  visibleChineseTranslation,
} from "./opinion-translation-utils.mjs";

const root = process.cwd();
const timelineRoot = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Timelines", "people");
const write = process.argv.includes("--write=true");
const concurrency = Math.max(1, Math.min(4, Number(process.argv.find((arg) => arg.startsWith("--concurrency="))?.split("=")[1] || 2)));

function listMarkdown(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdown(file);
    return entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md" ? [file] : [];
  });
}

function quoteText(value = "") {
  return String(value || "").split(/\r?\n/u).map((line) => `> ${line}`).join("\n");
}

function blockText(value = "", { stripProfile = false } = {}) {
  const cleaned = String(value || "")
    .replace(/^(?:>\s*)+/gmu, "")
    .replace(/\blikes=\d+;?\s*/giu, "")
    .replace(/\bretweets=\d+;?\s*/giu, "")
    .replace(/\breplies=\d+;?\s*/giu, "")
    .replace(/\s+/gu, " ")
    .trim();
  if (!stripProfile) return cleaned;
  const profile = cleaned.match(/\s+(?:ceo|founder|co[-‑–—]?founder|general partner|vp|investor|achieve ambition|affiliations:|product at|software engineer|partner at)\b/iu);
  return profile && profile.index > cleaned.length * 0.3 ? cleaned.slice(0, profile.index).trim() : cleaned;
}

async function mapConcurrent(items, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const index = next++;
      results[index] = await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

const jobs = [];
for (const file of listMarkdown(timelineRoot)) {
  const text = fs.readFileSync(file, "utf8");
  for (const match of text.matchAll(/^###\s+[\s\S]*?(?=^###\s+|(?![\s\S]))/gmu)) {
    const section = match[0];
    const originalMatch = section.match(/\*\*\u539f\u6587\u6458\u5f55\*\*\s*([\s\S]*?)(?=<!-- opinion-card-detail:end -->)/u);
    if (!originalMatch) continue;
    const source = cleanOpinionSource(blockText(originalMatch[1], { stripProfile: true }));
    if (visibleChineseTranslation(source.replace(/^\u539f\u59cb\u89c2\u70b9\/\u6458\u8981\uff1a\s*/u, ""))) continue;
    const translationMatch = section.match(/\*\*\u4e2d\u6587\u7ffb\u8bd1\*\*\s*([\s\S]*?)(?=\*\*\u539f\u6587\u6458\u5f55\*\*)/u);
    const translation = blockText(translationMatch?.[1] || "");
    if (!source || completeOpinionTranslation(source, translation, { preferFullTranslation: true })) continue;
    const url = section.match(/https?:\/\/[^\s`)>&]+/u)?.[0] || "";
    jobs.push({ file, start: match.index, length: section.length, section, source, url, existingTranslation: translation, existingProblems: opinionTranslationProblems(source, translation, { preferFullTranslation: true }) });
  }
}

if (write && jobs.length && !process.env.DEEPSEEK_API_KEY) throw new Error("deepseek_key_missing_for_required_translation");
const cache = await loadTranslationCache(root);
const results = await mapConcurrent(jobs, async (job) => {
  if (!write) return { job, result: { status: "pending_translation" } };
  const linguisticWords = job.source
    .replace(/https?:\/\/\S+/giu, " ")
    .replace(/[@#][A-Za-z0-9_]+/gu, " ")
    .match(/[A-Za-z]{2,}/gu) || [];
  if (linguisticWords.length <= 2) {
    return { job, result: { translation: `\u539f\u6587\u4e3a\u94fe\u63a5\u3001\u8d26\u53f7\u6216\u7b26\u53f7\uff0c\u65e0\u9700\u7ffb\u8bd1\uff1a${job.source}`, status: "translated", method: "source_structure_preserved" } };
  }
  let activeJob = job;
  let result = await translateOpinionText(activeJob.source, {
    cache,
    cacheKey: `timeline:${activeJob.url || activeJob.source}`,
    preferFullTranslation: true,
  });
  if (result.method === "source_chinese") {
    const stripped = activeJob.source.replace(/^\u539f\u59cb\u89c2\u70b9\/\u6458\u8981\uff1a\s*/u, "").trim();
    if (stripped !== activeJob.source) {
      activeJob = { ...activeJob, source: stripped };
      result = await translateOpinionText(activeJob.source, {
        cache,
        cacheKey: `timeline:${activeJob.url || activeJob.source}`,
        preferFullTranslation: true,
      });
    }
  }
  return { job: activeJob, result, skip: result.method === "source_chinese" };
});

if (write) await saveTranslationCache(root, cache);
const byFile = new Map();
const unresolved = [];
for (const item of results) {
  if (item.skip) continue;
  if (!completeOpinionTranslation(item.job.source, item.result.translation || "", { preferFullTranslation: true })) {
    unresolved.push({ file: path.relative(root, item.job.file), url: item.job.url, method: item.result.method });
    continue;
  }
  if (!byFile.has(item.job.file)) byFile.set(item.job.file, []);
  byFile.get(item.job.file).push(item);
}

let updated = 0;
if (write && !unresolved.length) {
  for (const [file, items] of byFile) {
    let text = fs.readFileSync(file, "utf8");
    for (const { job, result } of items.sort((a, b) => b.job.start - a.job.start)) {
      let replacement = job.section;
      const translatedBlock = `**\u4e2d\u6587\u7ffb\u8bd1**\n\n${quoteText(result.translation)}\n\n`;
      if (/\*\*\u4e2d\u6587\u7ffb\u8bd1\*\*/u.test(replacement)) {
        replacement = replacement.replace(/\*\*\u4e2d\u6587\u7ffb\u8bd1\*\*\s*[\s\S]*?(?=\*\*\u539f\u6587\u6458\u5f55\*\*)/u, translatedBlock);
      } else {
        replacement = replacement.replace(/\*\*\u539f\u6587\u6458\u5f55\*\*/u, `${translatedBlock}**\u539f\u6587\u6458\u5f55**`);
      }
      text = `${text.slice(0, job.start)}${replacement}${text.slice(job.start + job.length)}`;
      updated += 1;
    }
    fs.writeFileSync(file, text, "utf8");
  }
}

console.log(JSON.stringify({ ok: unresolved.length === 0, mode: write ? "write" : "dry-run", candidates: jobs.length, updated, unresolved: unresolved.length, examples: (write ? unresolved : jobs.map((job) => ({ file: path.relative(root, job.file), url: job.url, problems: job.existingProblems }))).slice(0, 10) }, null, 2));
if (unresolved.length) process.exit(1);
