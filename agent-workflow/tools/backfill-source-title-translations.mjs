#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  generateSourceTitleTranslation,
  generatedTitleTranslationLooksUsable,
  hasCjk,
  loadSourceTitleTranslations,
  sourceTitleNeedsChineseTranslation,
  titleTranslationKey,
  titleTranslationLooksUsable,
  upsertSourceTitleTranslations,
} from "./source-title-translation-generator.mjs";

const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const translationFile = path.join(root, "01-SiteV2", "content", "11-databases", "source-title-translations.json");
const legacyMappingFile = path.join(bundleRoot, "legacy-card-event-mappings.json");
const reportRoot = path.join(root, "agent-workflow", "reports");
const write = process.argv.includes("--write=true");
const concurrency = Math.max(1, Math.min(6, Number(arg("concurrency", "3")) || 3));

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalizeUrl(value = "") {
  try {
    const url = new URL(String(value || ""));
    url.hash = "";
    url.search = "";
    url.hostname = url.hostname.replace(/^www\./u, "");
    return url.toString().replace(/\/+$/u, "").toLowerCase();
  } catch {
    return String(value || "").trim().replace(/\/+$/u, "").toLowerCase();
  }
}

function dates() {
  return fs.readdirSync(bundleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function yamlValue(value) {
  return JSON.stringify(String(value || ""));
}

function replaceOrInsertFrontmatterField(text, field, value) {
  const pattern = new RegExp(`^${field}:.*$`, "mu");
  if (pattern.test(text)) return text.replace(pattern, `${field}: ${yamlValue(value)}`);
  const closing = text.indexOf("\n---", 4);
  if (!text.startsWith("---") || closing < 0) return text;
  return `${text.slice(0, closing)}\n${field}: ${yamlValue(value)}${text.slice(closing)}`;
}

function updateRawMarkdown(file, result) {
  if (!file || !fs.existsSync(file)) return false;
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  text = replaceOrInsertFrontmatterField(text, "title_zh", result.titleZh);
  text = replaceOrInsertFrontmatterField(text, "title_translation_status", result.status);
  text = replaceOrInsertFrontmatterField(text, "title_translation_method", result.method);
  text = replaceOrInsertFrontmatterField(text, "title_translation_model", result.model || "not_applicable");
  if (text !== before) fs.writeFileSync(file, text, "utf8");
  return text !== before;
}

function updateLegacyCard(file, title) {
  if (!file || !fs.existsSync(file)) return false;
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  text = text.replace(/^title:.*$/mu, `title: ${yamlValue(title)}`);
  text = text.replace(/^(\s{2}displayTitle:)\s*.*$/mu, (_match, field) => `${field} ${yamlValue(title)}`);
  const frontmatterEnd = text.indexOf("\n---", 4);
  const headingStart = text.indexOf("\n# ", frontmatterEnd > 0 ? frontmatterEnd + 4 : 0);
  if (headingStart >= 0) {
    const headingEnd = text.indexOf("\n", headingStart + 3);
    text = `${text.slice(0, headingStart)}\n# ${title}${headingEnd >= 0 ? text.slice(headingEnd) : "\n"}`;
  }
  if (text !== before) fs.writeFileSync(file, text, "utf8");
  return text !== before;
}

async function mapConcurrent(items, worker, limit) {
  const results = new Array(items.length);
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return results;
}

async function main() {
  const rawById = new Map();
  const rawPathById = new Map();
  const rawBySourceArtifact = new Map();
  const eventTargetRawIds = new Set();
  const availableDates = dates();

  for (const date of availableDates) {
    const dir = path.join(bundleRoot, date);
    const raws = readJson(path.join(dir, "raw-documents.json"));
    const mappings = readJson(path.join(dir, "legacy-asset-mappings.json"));
    const events = readJson(path.join(dir, "canonical-events.json"));
    for (const raw of raws) {
      rawById.set(raw.raw_id, { ...raw, data_date: date });
      rawBySourceArtifact.set(raw.source_artifact_id, raw.raw_id);
    }
    for (const mapping of mappings) rawPathById.set(mapping.raw_id, mapping.legacy_path);
    for (const event of events) {
      for (const sourceRef of event.source_refs || []) {
        const rawId = rawBySourceArtifact.get(sourceRef);
        if (rawId) eventTargetRawIds.add(rawId);
      }
    }
  }

  const legacy = readJson(legacyMappingFile);
  const targetRawIds = new Set(eventTargetRawIds);
  for (const mapping of legacy.mappings || []) {
    for (const rawId of mapping.raw_ids || []) targetRawIds.add(rawId);
  }

  const jobsByPath = new Map();
  for (const rawId of targetRawIds) {
    const relativePath = rawPathById.get(rawId);
    if (!relativePath) continue;
    const file = path.join(root, relativePath);
    if (!fs.existsSync(file)) continue;
    const payload = readJson(file);
    const sourceTitle = String(payload.title || payload.title_original || payload.title_zh || "").trim();
    if (!sourceTitle) continue;
    jobsByPath.set(relativePath, {
      rawId,
      relativePath,
      file,
      payload,
      sourceTitle,
      sourceUrl: payload.original_url || payload.canonical_url || payload.source_url || "",
    });
  }

  const cachedTranslations = loadSourceTitleTranslations(translationFile);
  const uniqueTitles = new Map();
  for (const job of jobsByPath.values()) {
    const key = titleTranslationKey(job.sourceTitle);
    if (!uniqueTitles.has(key)) uniqueTitles.set(key, job);
  }
  const translationResults = new Map();
  const missingJobs = [];
  for (const [key, job] of uniqueTitles) {
    const hanCount = (job.sourceTitle.match(/[\u3400-\u9fff]/gu) || []).length;
    if (!sourceTitleNeedsChineseTranslation(job.sourceTitle)) {
      translationResults.set(key, { titleZh: job.sourceTitle, status: "not_required", method: "source_title", model: "" });
      continue;
    }
    const cached = cachedTranslations.get(key) || "";
    if (generatedTitleTranslationLooksUsable(job.sourceTitle, cached)) {
      translationResults.set(key, { titleZh: cached, status: "translated", method: "source_title_translation_db", model: "" });
    } else {
      missingJobs.push(job);
    }
  }

  if (write && missingJobs.length && !process.env.DEEPSEEK_API_KEY) {
    throw new Error("deepseek_key_missing_for_required_translation");
  }

  const generated = write
    ? await mapConcurrent(missingJobs, async (job) => {
      const result = await generateSourceTitleTranslation(job.sourceTitle, {
        provider: "deepseek",
        timeoutMs: Number(process.env.TITLE_TRANSLATION_TIMEOUT_MS || 30000),
        allowNetwork: true,
      });
      return { job, result };
    }, concurrency)
    : missingJobs.map((job) => ({ job, result: { status: "needs_ingestion_translation", titleZh: "", method: "dry_run_missing" } }));

  const failures = [];
  for (const { job, result } of generated) {
    if (result.status !== "translated" || !generatedTitleTranslationLooksUsable(job.sourceTitle, result.titleZh)) {
      failures.push({ raw_id: job.rawId, path: job.relativePath, title: job.sourceTitle, method: result.method });
      continue;
    }
    translationResults.set(titleTranslationKey(job.sourceTitle), result);
  }

  if (write) {
    const updates = generated.flatMap(({ job, result }) => {
      if (result.status !== "translated" || !generatedTitleTranslationLooksUsable(job.sourceTitle, result.titleZh)) return [];
      return [{
        sourceTitle: job.sourceTitle,
        zhTitle: result.titleZh,
        method: result.method,
        model: result.model || "",
        sourceUrl: job.sourceUrl,
      }];
    });
    upsertSourceTitleTranslations(translationFile, updates);
  }

  const report = {
    generated_at: new Date().toISOString(),
    mode: write ? "write" : "dry-run",
    dates: availableDates.length,
    event_target_raws: eventTargetRawIds.size,
    legacy_cards: legacy.mappings?.length || 0,
    target_raws: jobsByPath.size,
    unique_titles: uniqueTitles.size,
    cached_or_chinese: uniqueTitles.size - missingJobs.length,
    generated: generated.length - failures.length,
    unresolved: failures.length,
    failures,
  };

  fs.mkdirSync(reportRoot, { recursive: true });
  const suffix = write ? "write" : "dry-run";
  const reportFile = path.join(reportRoot, `source-title-translation-backfill-${suffix}.json`);
  writeJson(reportFile, report);
  if (failures.length) {
    console.log(JSON.stringify({
      ok: false,
      report: path.relative(root, reportFile),
      mode: report.mode,
      target_raws: report.target_raws,
      unique_titles: report.unique_titles,
      unresolved: report.unresolved,
      failure_examples: failures.slice(0, 10),
    }, null, 2));
    if (write) process.exitCode = 1;
    return;
  }
  if (!write) {
    console.log(JSON.stringify({
      ok: true,
      report: path.relative(root, reportFile),
      mode: report.mode,
      target_raws: report.target_raws,
      unique_titles: report.unique_titles,
      cached_or_chinese: report.cached_or_chinese,
      unresolved: report.unresolved,
    }, null, 2));
    return;
  }

  let rawJsonUpdated = 0;
  let rawMarkdownUpdated = 0;
  for (const job of jobsByPath.values()) {
    const result = translationResults.get(titleTranslationKey(job.sourceTitle));
    const before = JSON.stringify(job.payload);
    job.payload.title_zh = result.titleZh;
    job.payload.title_translation_status = result.status;
    job.payload.title_translation_method = result.method;
    job.payload.title_translation_model = result.model || "not_applicable";
    if (JSON.stringify(job.payload) !== before) {
      writeJson(job.file, job.payload);
      rawJsonUpdated += 1;
    }
    const markdownPath = job.payload.markdown_snapshot_path ? path.join(root, job.payload.markdown_snapshot_path) : "";
    if (updateRawMarkdown(markdownPath, result)) rawMarkdownUpdated += 1;
  }

  let cardsUpdated = 0;
  for (const mapping of legacy.mappings || []) {
    const sourceUrls = new Set((mapping.source_urls || []).map(normalizeUrl));
    const candidates = (mapping.raw_ids || []).map((rawId) => rawById.get(rawId)).filter(Boolean);
    const raw = candidates.find((item) => sourceUrls.has(normalizeUrl(item.source_url || item.canonical_url)))
      || (!sourceUrls.size ? candidates.find((item) => item.data_date === mapping.card_date) || candidates[0] : null);
    if (!raw) continue;
    const sourcePath = rawPathById.get(raw.raw_id);
    const job = jobsByPath.get(sourcePath);
    const result = job ? translationResults.get(titleTranslationKey(job.sourceTitle)) : null;
    if (!result?.titleZh) throw new Error(`No source title resolved for ${mapping.legacy_path}`);
    if (sourceTitleNeedsChineseTranslation(job.sourceTitle) && !hasCjk(result.titleZh)) {
      throw new Error(`No Chinese source title resolved for ${mapping.legacy_path}`);
    }
    if (updateLegacyCard(path.join(root, mapping.legacy_path), result.titleZh)) cardsUpdated += 1;
  }

  report.raw_json_updated = rawJsonUpdated;
  report.raw_markdown_updated = rawMarkdownUpdated;
  report.cards_updated = cardsUpdated;
  writeJson(reportFile, report);
  console.log(JSON.stringify({
    ok: true,
    report: path.relative(root, reportFile),
    mode: report.mode,
    target_raws: report.target_raws,
    unique_titles: report.unique_titles,
    generated: report.generated,
    raw_json_updated: report.raw_json_updated,
    raw_markdown_updated: report.raw_markdown_updated,
    cards_updated: report.cards_updated,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
