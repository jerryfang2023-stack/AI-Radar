#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { upsertSourceTitleTranslations } from "./source-title-translation-generator.mjs";

const root = process.cwd();
const date = process.argv.find((value) => value.startsWith("--date="))?.slice("--date=".length) || "";
if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new Error("--date=YYYY-MM-DD is required");

const rawDirectory = path.join(root, "01-SiteV2", "content", "01-raw", "originals", date);
const translationFile = path.join(root, "01-SiteV2", "content", "11-databases", "source-title-translations.json");
if (!fs.existsSync(rawDirectory)) throw new Error(`raw originals are missing for ${date}`);

const updates = fs.readdirSync(rawDirectory, { withFileTypes: true })
  .filter((entry) => entry.isFile() && path.extname(entry.name) === ".json")
  .flatMap((entry) => {
    const payload = JSON.parse(fs.readFileSync(path.join(rawDirectory, entry.name), "utf8").replace(/^\uFEFF/u, ""));
    if (payload.title_translation_status !== "translated"
      || payload.title_translation_method !== "deepseek_title_translation"
      || !payload.title
      || !payload.title_zh) return [];
    return [{
      sourceTitle: payload.title,
      zhTitle: payload.title_zh,
      method: payload.title_translation_method,
      model: payload.title_translation_model || "",
      sourceUrl: payload.original_url || payload.canonical_url || ""
    }];
  });

const changed = upsertSourceTitleTranslations(translationFile, updates);
console.log(JSON.stringify({
  ok: true,
  date,
  eligible: updates.length,
  changed,
  output: path.relative(root, translationFile).replace(/\\/gu, "/")
}, null, 2));
