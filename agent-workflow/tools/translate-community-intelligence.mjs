#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sourceTextHash, translateOpinionWithDeepSeek } from "./deepseek-translation-client.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const dataFile = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");
const dailyRoot = path.join(root, "01-SiteV2", "site", "data", "community-intelligence-daily");
const concurrency = Math.max(1, Number(args.get("concurrency") || 2));

export function needsChineseTranslation(value = "") {
  const text = String(value || "").trim();
  const chinese = (text.match(/[\u3400-\u9fff]/gu) || []).length;
  const latinWords = (text.match(/\b[A-Za-z][A-Za-z'-]{1,}\b/gu) || []).length;
  return text.length >= 12 && chinese < 4 && latinWords >= 3;
}

function writeJson(file, value) {
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, file);
}

async function translateItem(item) {
  const fields = ["title", "summary", "excerpt"].filter((field) => item[`${field}Original`] || needsChineseTranslation(item[field]));
  if (!fields.length) return item.translationStatus === "not_required" ? item : { ...item, translationStatus: "not_required" };
  const source = fields.map((field) => `${field}:\n${item[`${field}Original`] || item[field]}`).join("\n\n");
  if (item.translationStatus === "translated" && item.translationProvider === "deepseek" && item.translationSourceHash === sourceTextHash(source)
      && fields.every((field) => !needsChineseTranslation(item[field]))) return item;
  const output = { ...item };
  const models = new Set();
  for (const field of fields) {
    const originalKey = `${field}Original`;
    output[originalKey] = output[originalKey] || output[field];
    const result = await translateOpinionWithDeepSeek(output[originalKey], { preferFullTranslation: field === "excerpt" });
    if (result.status !== "translated") throw new Error(`${item.id}:${field}:${result.method}:${(result.qualityProblems || []).join("|")}`);
    output[field] = result.translation;
    models.add(result.model);
  }
  return {
    ...output,
    translationStatus: "translated",
    translationMethod: "deepseek_translation",
    translationProvider: "deepseek",
    translationModel: [...models].join(","),
    translationSourceHash: sourceTextHash(source),
    translatedAt: new Date().toISOString(),
  };
}

async function mapConcurrent(items, worker, size) {
  const output = new Array(items.length);
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      output[current] = await worker(items[current]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, Math.max(1, items.length)) }, run));
  return output;
}

async function main() {
  if (!fs.existsSync(dataFile)) throw new Error(`community data missing: ${dataFile}`);
  const payload = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  const items = await mapConcurrent(payload.items || [], translateItem, concurrency);
  const translated = items.filter((item) => item.translationStatus === "translated").length;
  const changed = JSON.stringify(items) !== JSON.stringify(payload.items || []);
  const result = {
    ...payload,
    meta: {
      ...payload.meta,
      translation: changed || !payload.meta?.translation
        ? { provider: "deepseek", required: translated, translated, completedAt: new Date().toISOString() }
        : payload.meta.translation,
    },
    items,
  };
  if (changed || !payload.meta?.translation) writeJson(dataFile, result);
  const date = args.get("date") || payload.meta?.date || "";
  const dailyFile = date ? path.join(dailyRoot, `${date}.json`) : "";
  if ((changed || !payload.meta?.translation) && dailyFile && fs.existsSync(dailyFile)) writeJson(dailyFile, result);
  console.log(JSON.stringify({ ok: true, date, items: items.length, translated, changed }, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exit(1);
  });
}
