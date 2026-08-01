#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadSourceTitleTranslations,
  sourceTitleNeedsChineseTranslation,
  titleTranslationKey,
  titleTranslationLooksUsable,
} from "./source-title-translation-generator.mjs";

const modulePath = fileURLToPath(import.meta.url);
const projectRoot = path.resolve(path.dirname(modulePath), "../..");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function normalizeSourceIntakeTitles(root, date) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) throw new Error(`Invalid date: ${date}`);
  const intakeFile = path.join(
    root,
    "01-SiteV2/content/11-databases/data-center-v4/intake-v1",
    `${date}.json`,
  );
  const translationFile = path.join(
    root,
    "01-SiteV2/content/11-databases/source-title-translations.json",
  );
  const sourceIndexFile = path.join(root, "01-SiteV2/content/01-raw/source-index.jsonl");
  const intake = readJson(intakeFile);
  const translations = loadSourceTitleTranslations(translationFile);
  const repairedByTitle = new Map();

  for (const raw of intake.raw_documents || []) {
    const original = String(raw.title_original || "").trim();
    if (!sourceTitleNeedsChineseTranslation(original)
        || titleTranslationLooksUsable(original, raw.title_zh || "")) continue;
    const translated = translations.get(titleTranslationKey(original)) || "";
    if (!titleTranslationLooksUsable(original, translated)) continue;
    raw.title_zh = translated;
    raw.title_translation_status = "translated";
    raw.title_translation_method = "source_title_translation_db";
    raw.title_translation_model = "";
    repairedByTitle.set(original, translated);
  }

  if (repairedByTitle.size) writeJson(intakeFile, intake);

  let sourceIndexRepairs = 0;
  if (repairedByTitle.size && fs.existsSync(sourceIndexFile)) {
    const rows = fs.readFileSync(sourceIndexFile, "utf8")
      .split(/\r?\n/u)
      .filter(Boolean)
      .map((line) => JSON.parse(line.replace(/^\uFEFF/u, "")));
    for (const row of rows) {
      if (String(row.data_date || "") !== date) continue;
      const translated = repairedByTitle.get(String(row.title_original || "").trim());
      if (!translated) continue;
      row.title_zh = translated;
      row.title_translation_status = "translated";
      row.title_translation_method = "source_title_translation_db";
      row.title_translation_model = "";
      sourceIndexRepairs += 1;
    }
    fs.writeFileSync(sourceIndexFile, `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`, "utf8");
  }

  return {
    date,
    repaired_documents: repairedByTitle.size,
    repaired_source_index_rows: sourceIndexRepairs,
    intake_file: path.relative(root, intakeFile).replace(/\\/gu, "/"),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === modulePath) {
  const date = process.argv.find((value) => value.startsWith("--date="))?.slice("--date=".length) || "";
  console.log(JSON.stringify({ ok: true, ...normalizeSourceIntakeTitles(projectRoot, date) }, null, 2));
}
