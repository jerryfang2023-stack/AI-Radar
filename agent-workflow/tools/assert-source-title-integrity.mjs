#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  generatedTitleTranslationLooksUsable,
  sourceTitleNeedsChineseTranslation,
} from "./source-title-translation-generator.mjs";

const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const legacyMappingFile = path.join(bundleRoot, "legacy-card-event-mappings.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
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

function frontmatterValue(text, field) {
  const match = text.match(new RegExp(`^\\s*${field}:\\s*(.+)$`, "mu"));
  if (!match) return "";
  const value = match[1].trim();
  try {
    return JSON.parse(value);
  } catch {
    return value.replace(/^['"]|['"]$/gu, "");
  }
}

function firstHeading(text) {
  const frontmatterEnd = text.indexOf("\n---", 4);
  return text.slice(frontmatterEnd > 0 ? frontmatterEnd + 4 : 0).match(/^#\s+(.+)$/mu)?.[1]?.trim() || "";
}

const rawById = new Map();
const rawPathById = new Map();
const rawBySourceArtifact = new Map();
const eventTargetRawIds = new Set();
const eventChecks = [];
const dates = fs.readdirSync(bundleRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
  .map((entry) => entry.name)
  .sort();

for (const date of dates) {
  const dir = path.join(bundleRoot, date);
  const raws = readJson(path.join(dir, "raw-documents.json"));
  const mappings = readJson(path.join(dir, "legacy-asset-mappings.json"));
  const events = readJson(path.join(dir, "canonical-events.json"));
  const dateRawByArtifact = new Map();
  for (const raw of raws) {
    rawById.set(raw.raw_id, { ...raw, data_date: date });
    rawBySourceArtifact.set(raw.source_artifact_id, raw.raw_id);
    dateRawByArtifact.set(raw.source_artifact_id, raw);
  }
  for (const mapping of mappings) rawPathById.set(mapping.raw_id, mapping.legacy_path);
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

const legacy = readJson(legacyMappingFile);
const targetRawIds = new Set(eventTargetRawIds);
for (const mapping of legacy.mappings || []) {
  for (const rawId of mapping.raw_ids || []) targetRawIds.add(rawId);
}

const violations = [];
for (const rawId of targetRawIds) {
  const relativePath = rawPathById.get(rawId);
  if (!relativePath || !fs.existsSync(path.join(root, relativePath))) {
    violations.push({ type: "raw_path_missing", raw_id: rawId, path: relativePath || "" });
    continue;
  }
  const raw = readJson(path.join(root, relativePath));
  const original = String(raw.title || raw.title_original || "").trim();
  const chinese = String(raw.title_zh || "").trim();
  if (!chinese || (sourceTitleNeedsChineseTranslation(original) && !generatedTitleTranslationLooksUsable(original, chinese))) {
    violations.push({ type: "raw_title_invalid", raw_id: rawId, path: relativePath, original, title_zh: chinese });
  }
}

for (const mapping of legacy.mappings || []) {
  const sourceUrls = new Set((mapping.source_urls || []).map(normalizeUrl));
  const candidates = (mapping.raw_ids || []).map((rawId) => rawById.get(rawId)).filter(Boolean);
  const raw = candidates.find((item) => sourceUrls.has(normalizeUrl(item.source_url || item.canonical_url)))
    || (!sourceUrls.size ? candidates.find((item) => item.data_date === mapping.card_date) || candidates[0] : null);
  const rawPath = raw ? rawPathById.get(raw.raw_id) : "";
  const source = rawPath && fs.existsSync(path.join(root, rawPath)) ? readJson(path.join(root, rawPath)) : null;
  const expected = String(source?.title_zh || "").trim();
  const cardFile = path.join(root, mapping.legacy_path);
  if (!fs.existsSync(cardFile)) {
    violations.push({ type: "card_source_missing", path: mapping.legacy_path });
    continue;
  }
  if (!expected) continue;
  const text = fs.readFileSync(cardFile, "utf8");
  const values = {
    title: frontmatterValue(text, "title"),
    heading: firstHeading(text),
  };
  if (/^\s*displayTitle:/mu.test(text)) values.displayTitle = frontmatterValue(text, "displayTitle");
  for (const [field, actual] of Object.entries(values)) {
    if (actual !== expected) violations.push({ type: "card_title_mismatch", path: mapping.legacy_path, field, expected, actual });
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
  legacy_cards: legacy.mappings?.length || 0,
  canonical_events: eventChecks.length,
  violations: violations.length,
  examples: violations.slice(0, 20),
}, null, 2));

if (violations.length) process.exit(1);
