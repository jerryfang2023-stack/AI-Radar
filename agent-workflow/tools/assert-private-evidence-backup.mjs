#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { resolveGuanlanVaultRoot } from "./guanlan-vault-paths.mjs";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = String(args.get("date") || "").trim();
const backupRoot = resolvePrivateEvidenceBackupRoot(root);
const vaultRoot = resolveGuanlanVaultRoot(root, { required: false });
const problems = [];

function lines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/u).filter(Boolean);
}

function isInside(parent, candidate) {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

if (isInside(root, backupRoot) || (vaultRoot && isInside(vaultRoot, backupRoot))) {
  problems.push("private evidence backup is inside a production repository or the Guanlan Vault");
}

let manifest = {};
try {
  manifest = JSON.parse(fs.readFileSync(path.join(backupRoot, "manifest.json"), "utf8"));
  if (manifest.schemaVersion !== "PRIVATE-EVIDENCE-STORE-V2.0") {
    problems.push("private evidence store schema version is invalid");
  }
  if (manifest.sourcePolicy !== "private_store_is_authoritative") {
    problems.push("private evidence store is not authoritative");
  }
  if (manifest.discoveryPolicy !== "private_store_is_outside_public_repository_and_v4_discovery") {
    problems.push("private evidence store discovery policy is invalid");
  }
} catch (error) {
  problems.push(`invalid private evidence backup manifest: ${error.message}`);
}

const catalog = lines(path.join(backupRoot, "catalog.jsonl"));
const historical = lines(path.join(
  backupRoot,
  "manifests/non-production-historical-sources.jsonl",
));
const originalRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
const originalJsonFiles = [];
if (fs.existsSync(originalRoot)) {
  const stack = [originalRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) originalJsonFiles.push(file);
    }
  }
}
if (catalog.length !== manifest.snapshots) {
  problems.push(`catalog snapshot count mismatch: expected ${manifest.snapshots}, got ${catalog.length}`);
}
if (historical.length !== manifest.nonProductionHistoricalSources) {
  problems.push(
    `historical migration count mismatch: expected ${manifest.nonProductionHistoricalSources}, got ${historical.length}`,
  );
}

const objectRefs = new Set();
const recordRefs = new Set();
const snapshotRefs = new Set();
const contentHashes = new Set();
for (const line of catalog) {
  try {
    const entry = JSON.parse(line);
    if (!entry.object_ref || !entry.record_ref || !entry.content_hash || !entry.evidence_ref) {
      problems.push("private evidence catalog contains an entry without content_hash/evidence_ref/object_ref/record_ref");
      continue;
    }
    objectRefs.add(entry.object_ref);
    recordRefs.add(entry.record_ref);
    snapshotRefs.add(entry.snapshot_ref);
    contentHashes.add(String(entry.content_hash).toLowerCase());
    if (entry.body_available && !fs.existsSync(path.join(backupRoot, entry.object_ref))) {
      problems.push(`private evidence object is missing: ${entry.object_ref}`);
    }
    const recordFile = path.join(backupRoot, entry.record_ref);
    if (!fs.existsSync(recordFile)) {
      problems.push(`private evidence metadata record is missing: ${entry.record_ref}`);
    } else if (/"(?:body_clean|body_original|clean_text|full_text|markdown_snapshot)"\s*:/u.test(fs.readFileSync(recordFile, "utf8"))) {
      problems.push(`private evidence metadata record embeds a full body: ${entry.record_ref}`);
    }
  } catch (error) {
    problems.push(`invalid private evidence catalog line: ${error.message}`);
  }
}
if (snapshotRefs.size !== catalog.length) {
  problems.push("private evidence catalog contains duplicate snapshot_ref entries");
}
if (objectRefs.size !== manifest.uniqueContents) {
  problems.push(`unique content count mismatch: expected ${manifest.uniqueContents}, got ${objectRefs.size}`);
}
if (recordRefs.size !== catalog.length) {
  problems.push("private evidence catalog contains duplicate metadata record refs");
}
if (manifest.missingBodies !== 0) {
  problems.push(`private evidence backup has ${manifest.missingBodies} snapshot(s) without a body`);
}

let intakeEvidenceGaps = [];
if (date) {
  const intakeFile = path.join(
    root,
    "01-SiteV2/content/11-databases/data-center-v4/intake-v1",
    `${date}.json`,
  );
  if (!fs.existsSync(intakeFile)) {
    problems.push(`structured intake is missing for private evidence coverage: ${date}`);
  } else {
    const intake = JSON.parse(fs.readFileSync(intakeFile, "utf8").replace(/^\uFEFF/u, ""));
    intakeEvidenceGaps = (intake.raw_documents || [])
      .map((document) => String(document.content_hash || "").toLowerCase())
      .filter((contentHash) => !contentHash || !contentHashes.has(contentHash));
    if (intakeEvidenceGaps.length) {
      problems.push(
        `private evidence backup is missing ${intakeEvidenceGaps.length} RawDocument content hash(es) for ${date}`,
      );
    }
  }
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  backupRoot,
  date: date || null,
  manifest,
  catalogEntries: catalog.length,
  intakeEvidenceGaps: intakeEvidenceGaps.length,
  repositorySnapshotsWaitingForIngest: originalJsonFiles.length,
  historicalEntries: historical.length,
  problems,
}, null, 2));

if (problems.length) process.exit(1);
