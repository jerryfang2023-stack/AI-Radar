#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { loadPrivateEvidenceStore } from "./lib/private-evidence-store.mjs";

const root = process.cwd();
const originalsRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
const indexFile = path.join(root, "01-SiteV2/content/01-raw/source-index.jsonl");
const dataCenterRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const problems = [];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function lines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/u).filter(Boolean);
}

function trackedDataFiles(directory) {
  const output = [];
  const stack = [directory];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory() && [".git", "node_modules"].includes(entry.name)) continue;
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (entry.isFile() && /\.(?:json|jsonl)$/iu.test(entry.name)) output.push(file);
    }
  }
  return output;
}

if (fs.existsSync(originalsRoot)) {
  problems.push("public repository still contains full original snapshots");
}

const publicBodyField = /"(?:body_clean|body_original|body_original_html|clean_text|full_text|markdown_snapshot)"\s*:/u;
for (const file of trackedDataFiles(root)) {
  if (publicBodyField.test(fs.readFileSync(file, "utf8"))) {
    problems.push(`${path.relative(root, file).replaceAll("\\", "/")}: exposes a private body field`);
  }
}

const indexLines = lines(indexFile);
if (!indexLines.length) problems.push("public evidence locator index is missing or empty");
const indexEntries = [];
for (const [index, line] of indexLines.entries()) {
  try {
    const entry = JSON.parse(line);
    indexEntries.push(entry);
    if (entry.schema_version !== "PUBLIC-EVIDENCE-LOCATOR-V1.0") {
      problems.push(`source-index line ${index + 1} has an invalid schema version`);
    }
    if (!entry.content_hash || !String(entry.evidence_ref || "").startsWith("evidence://")) {
      problems.push(`source-index line ${index + 1} is missing content_hash/evidence_ref`);
    }
    if (/(?:body_clean|body_original|clean_text|full_text|markdown_snapshot)/u.test(line)) {
      problems.push(`source-index line ${index + 1} exposes a private body field`);
    }
  } catch (error) {
    problems.push(`source-index line ${index + 1} is invalid JSON: ${error.message}`);
  }
}

let bundleDates = 0;
let rawDocuments = 0;
const intakeRoot = path.join(dataCenterRoot, "intake-v1");
if (fs.existsSync(intakeRoot)) {
  for (const file of fs.readdirSync(intakeRoot).filter((name) => name.endsWith(".json"))) {
    const payload = fs.readFileSync(path.join(intakeRoot, file), "utf8");
    if (!/"schema_version"\s*:\s*"SOURCE-INTAKE-V1\.1"/u.test(payload)) {
      problems.push(`${file}: source intake schema is not SOURCE-INTAKE-V1.1`);
    }
    if (/"(?:pool_routes|pooled|pooled_documents|importance)"\s*:|signal_card_candidate|trend_candidate_context|relationship_graph_input/u.test(payload)) {
      problems.push(`${file}: source intake contains retired V3 routing or judgment fields`);
    }
  }
}
for (const entry of fs.readdirSync(dataCenterRoot, { withFileTypes: true })) {
  if (!entry.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/u.test(entry.name)) continue;
  const directory = path.join(dataCenterRoot, entry.name);
  const rawFile = path.join(directory, "raw-documents.json");
  const sourceFile = path.join(directory, "source-artifacts.json");
  const manifestFile = path.join(directory, "manifest.json");
  if (!fs.existsSync(rawFile) || !fs.existsSync(sourceFile) || !fs.existsSync(manifestFile)) continue;
  bundleDates += 1;
  const raws = readJson(rawFile);
  const sources = readJson(sourceFile);
  const manifest = readJson(manifestFile);
  rawDocuments += raws.length;
  if (manifest.raw_version !== "RAW-V4.0") {
    problems.push(`${entry.name}: manifest is not RAW-V4.0`);
  }
  for (const raw of raws) {
    if (raw.schema_version !== "RAW-V4.0") problems.push(`${raw.raw_id}: schema is not RAW-V4.0`);
    if ("body_original" in raw || "body_clean" in raw) problems.push(`${raw.raw_id}: public RawDocument contains a full body`);
    if (!String(raw.body_ref || "").startsWith("evidence://")) problems.push(`${raw.raw_id}: body_ref is not a private evidence locator`);
    if (raw.body_storage !== "private_evidence_store") problems.push(`${raw.raw_id}: body_storage is not private`);
  }
  for (const source of sources) {
    if (!(source.snapshot_refs || []).every((ref) => String(ref).startsWith("evidence://"))) {
      problems.push(`${source.source_artifact_id}: public snapshot_refs contain a repository body path`);
    }
  }
}

let privateStore = null;
try {
  privateStore = loadPrivateEvidenceStore(root);
  const missingPrivateLocators = indexEntries
    .filter((entry) => !(privateStore.byEvidenceRef.get(String(entry.evidence_ref || "")) || []).length);
  if (missingPrivateLocators.length) {
    problems.push(`${missingPrivateLocators.length} public evidence locator(s) are absent from the private store`);
  }
  if (privateStore.manifest.sourcePolicy !== "private_store_is_authoritative") {
    problems.push("private evidence store is not marked authoritative");
  }
} catch (error) {
  problems.push(`authoritative private evidence store is unavailable: ${error.message}`);
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  public_originals_present: fs.existsSync(originalsRoot),
  public_index_entries: indexEntries.length,
  bundle_dates: bundleDates,
  raw_documents: rawDocuments,
  private_store_checked: Boolean(privateStore),
  problems,
}, null, 2));

if (problems.length) process.exit(1);
