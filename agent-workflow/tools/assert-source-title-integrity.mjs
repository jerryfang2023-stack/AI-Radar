#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  generatedTitleTranslationLooksUsable,
  sourceTitleNeedsChineseTranslation,
  titleTranslationLooksUsable,
} from "./source-title-translation-generator.mjs";

const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const sourceIndexFile = path.join(root, "01-SiteV2", "content", "01-raw", "source-index.jsonl");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

const rawById = new Map();
const rawBySourceArtifact = new Map();
const locatorsByContentHash = new Map();
const eventTargetRawIds = new Set();
const eventChecks = [];
for (const line of fs.readFileSync(sourceIndexFile, "utf8").split(/\r?\n/u).filter(Boolean)) {
  const locator = JSON.parse(line);
  const contentHash = String(locator.content_hash || "").trim().toLowerCase();
  if (!locatorsByContentHash.has(contentHash)) locatorsByContentHash.set(contentHash, []);
  locatorsByContentHash.get(contentHash).push(locator);
}
const dates = fs.readdirSync(bundleRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
  .map((entry) => entry.name)
  .sort();

for (const date of dates) {
  const dir = path.join(bundleRoot, date);
  const raws = readJson(path.join(dir, "raw-documents.json"));
  const events = readJson(path.join(dir, "canonical-events.json"));
  const dateRawByArtifact = new Map();
  for (const raw of raws) {
    rawById.set(raw.raw_id, raw);
    rawBySourceArtifact.set(raw.source_artifact_id, raw.raw_id);
    dateRawByArtifact.set(raw.source_artifact_id, raw);
  }
  for (const event of events) {
    const sources = (event.source_refs || []).map((ref) => dateRawByArtifact.get(ref)).filter(Boolean);
    for (const ref of event.source_refs || []) {
      const rawId = rawBySourceArtifact.get(ref);
      if (rawId) eventTargetRawIds.add(rawId);
    }
    const allowed = new Set(sources.map((raw) => String(raw.title_zh || raw.title_original || raw.title || "").trim()).filter(Boolean));
    eventChecks.push({ date, event, allowed });
  }
}

const targetRawIds = new Set(eventTargetRawIds);

const violations = [];
for (const rawId of targetRawIds) {
  const raw = rawById.get(rawId);
  if (!raw) {
    violations.push({ type: "raw_document_missing", raw_id: rawId });
    continue;
  }
  const original = String(raw.title || raw.title_original || "").trim();
  const chinese = String(raw.title_zh || "").trim();
  const rawUrl = String(raw.canonical_url || raw.source_url || "").replace(/\/+$/u, "");
  const locatorCandidates = locatorsByContentHash.get(String(raw.content_hash || "").toLowerCase()) || [];
  const locator = locatorCandidates.find((entry) => (
    String(entry.source_url || "").replace(/\/+$/u, "") === rawUrl
  )) || locatorCandidates.find((entry) => entry.title_translation_method) || locatorCandidates[0] || {};
  const method = String(raw.title_translation_method || locator.title_translation_method || "").trim();
  const translationLooksUsable = ["manual_reviewed_source_title_translation", "source_title_translation_db"].includes(method)
    ? titleTranslationLooksUsable(original, chinese)
    : generatedTitleTranslationLooksUsable(original, chinese);
  if (sourceTitleNeedsChineseTranslation(original) && !translationLooksUsable) {
    violations.push({
      type: "raw_title_invalid",
      raw_id: rawId,
      evidence_ref: raw.body_ref || "",
      original,
      title_zh: chinese,
    });
  }
}

for (const { date, event, allowed } of eventChecks) {
  const actual = String(event.display_title_zh || "").trim();
  if (actual && !allowed.has(actual)) {
    violations.push({ type: "event_title_not_from_raw", date, event_id: event.event_id, actual: event.display_title_zh, allowed: [...allowed] });
  }
}

console.log(JSON.stringify({
  ok: violations.length === 0,
  dates: dates.length,
  target_raws: targetRawIds.size,
  canonical_events: eventChecks.length,
  violations: violations.length,
  examples: violations.slice(0, 20),
}, null, 2));

if (violations.length) process.exit(1);
