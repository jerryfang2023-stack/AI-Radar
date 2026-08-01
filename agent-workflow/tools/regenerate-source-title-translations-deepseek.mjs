#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateSourceTitleTranslation,
  generatedTitleTranslationLooksUsable,
} from "./source-title-translation-generator.mjs";

const defaultRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function regenerateSourceTitleTranslations({
  file,
  fromMethod = "manual_reviewed_source_title_translation",
  generator = generateSourceTitleTranslation,
  write = false,
  concurrency = 4,
} = {}) {
  const payload = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
  const translations = Array.isArray(payload) ? payload : payload.translations;
  if (!Array.isArray(translations)) throw new Error("source_title_translation_database_invalid");
  const targets = translations.filter((entry) => String(entry?.generatedBy || "").trim() === fromMethod);
  const results = new Array(targets.length);
  let cursor = 0;
  const worker = async () => {
    while (cursor < targets.length) {
      const index = cursor;
      cursor += 1;
      const entry = targets[index];
      const generated = await generator(entry.sourceTitle, { provider: "deepseek", allowNetwork: true });
      if (
        generated.status !== "translated"
        || generated.method !== "deepseek_title_translation"
        || !generated.model
        || !generatedTitleTranslationLooksUsable(entry.sourceTitle, generated.titleZh)
      ) throw new Error(`deepseek_title_regeneration_failed:${entry.sourceTitle}`);
      results[index] = { entry, generated };
    }
  };
  await Promise.all(Array.from({ length: Math.max(1, Math.min(concurrency, targets.length || 1)) }, worker));
  const generatedAt = new Date().toISOString();
  for (const { entry, generated } of results) {
    entry.zhTitle = generated.titleZh;
    entry.generatedBy = generated.method;
    entry.generatedModel = generated.model;
    entry.generatedAt = generatedAt;
  }
  if (write && results.length) fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return { eligible: targets.length, regenerated: results.length, written: Boolean(write && results.length) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const valueFor = (name, fallback = "") => process.argv.find((item) => item.startsWith(`--${name}=`))?.slice(name.length + 3) || fallback;
  const write = valueFor("write", "false") === "true";
  if (write && !process.env.DEEPSEEK_API_KEY) throw new Error("DEEPSEEK_API_KEY is required");
  const file = path.resolve(valueFor(
    "file",
    path.join(defaultRoot, "01-SiteV2", "content", "11-databases", "source-title-translations.json"),
  ));
  const result = await regenerateSourceTitleTranslations({
    file,
    fromMethod: valueFor("from-method", "manual_reviewed_source_title_translation"),
    write,
    concurrency: Number(valueFor("concurrency", "4")),
  });
  console.log(JSON.stringify({ ok: true, file: path.relative(defaultRoot, file).replace(/\\/gu, "/"), ...result }, null, 2));
}
