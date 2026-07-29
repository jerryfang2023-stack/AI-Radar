#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  generateSourceTitleTranslation,
  generatedTitleTranslationLooksUsable,
  loadSourceTitleTranslations,
  sourceTitleFromCapturedPayload,
  sourceTitleNeedsChineseTranslation,
  titleTranslationKey,
  titleTranslationLooksUsable,
  upsertSourceTitleTranslations,
} from "./source-title-translation-generator.mjs";
import { sourceSnapshotRefsByRawId } from "./lib/source-snapshot-ref-v1.mjs";

const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const translationFile = path.join(root, "01-SiteV2", "content", "11-databases", "source-title-translations.json");
const reportRoot = path.join(root, "agent-workflow", "reports");
const write = process.argv.includes("--write=true");
const concurrency = Math.max(1, Math.min(6, Number(arg("concurrency", "3")) || 3));
const selectedRawIds = new Set(arg("raw-ids").split(",").map((value) => value.trim()).filter(Boolean));

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

function updateRawMarkdown(file, result, sourceTitle = "") {
  if (!file || !fs.existsSync(file)) return false;
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  if (sourceTitle) text = replaceOrInsertFrontmatterField(text, "title", sourceTitle);
  text = replaceOrInsertFrontmatterField(text, "title_zh", result.titleZh);
  text = replaceOrInsertFrontmatterField(text, "title_translation_status", result.status);
  text = replaceOrInsertFrontmatterField(text, "title_translation_method", result.method);
  text = replaceOrInsertFrontmatterField(text, "title_translation_model", result.model || "not_applicable");
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
  const rawPathById = new Map();
  const rawBySourceArtifact = new Map();
  const eventTargetRawIds = new Set();
  const availableDates = dates();

  for (const date of availableDates) {
    const dir = path.join(bundleRoot, date);
    const raws = readJson(path.join(dir, "raw-documents.json"));
    const sourceArtifacts = readJson(path.join(dir, "source-artifacts.json"));
    const events = readJson(path.join(dir, "canonical-events.json"));
    for (const raw of raws) {
      rawBySourceArtifact.set(raw.source_artifact_id, raw.raw_id);
    }
    for (const [rawId, snapshotRef] of sourceSnapshotRefsByRawId(sourceArtifacts, raws)) rawPathById.set(rawId, snapshotRef);
    for (const event of events) {
      for (const sourceRef of event.source_refs || []) {
        const rawId = rawBySourceArtifact.get(sourceRef);
        if (rawId) eventTargetRawIds.add(rawId);
      }
    }
  }

  const targetRawIds = new Set(eventTargetRawIds);

  const jobsByPath = new Map();
  for (const rawId of targetRawIds) {
    if (selectedRawIds.size && !selectedRawIds.has(rawId)) continue;
    const relativePath = rawPathById.get(rawId);
    if (!relativePath) continue;
    const file = path.join(root, relativePath);
    if (!fs.existsSync(file)) continue;
    const payload = readJson(file);
    const storedSourceTitle = String(payload.title || payload.title_original || "").trim();
    const sourceTitle = sourceTitleFromCapturedPayload(payload);
    if (!sourceTitle) continue;
    jobsByPath.set(relativePath, {
      rawId,
      relativePath,
      file,
      payload,
      sourceTitle,
      sourceTitleRepaired: sourceTitle !== storedSourceTitle,
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
    if (titleTranslationLooksUsable(job.sourceTitle, cached)) {
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
    selected_raw_ids: [...selectedRawIds],
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
  let sourceTitlesRepaired = 0;
  for (const job of jobsByPath.values()) {
    const result = translationResults.get(titleTranslationKey(job.sourceTitle));
    const before = JSON.stringify(job.payload);
    if (job.sourceTitleRepaired) {
      job.payload.title = job.sourceTitle;
      sourceTitlesRepaired += 1;
    }
    job.payload.title_zh = result.titleZh;
    job.payload.title_translation_status = result.status;
    job.payload.title_translation_method = result.method;
    job.payload.title_translation_model = result.model || "not_applicable";
    if (JSON.stringify(job.payload) !== before) {
      writeJson(job.file, job.payload);
      rawJsonUpdated += 1;
    }
    const markdownPath = job.payload.markdown_snapshot_path ? path.join(root, job.payload.markdown_snapshot_path) : "";
    if (updateRawMarkdown(markdownPath, result, job.sourceTitleRepaired ? job.sourceTitle : "")) rawMarkdownUpdated += 1;
  }

  report.raw_json_updated = rawJsonUpdated;
  report.raw_markdown_updated = rawMarkdownUpdated;
  report.source_titles_repaired = sourceTitlesRepaired;
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
    source_titles_repaired: report.source_titles_repaired,
  }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
