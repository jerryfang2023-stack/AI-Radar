#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { resolveGuanlanVaultRoot } from "./guanlan-vault-paths.mjs";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";

const root = process.cwd();
const backupRoot = resolvePrivateEvidenceBackupRoot(root);
const vaultRoot = resolveGuanlanVaultRoot(root);
const problems = [];

function lines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8").split(/\r?\n/u).filter(Boolean);
}

function isInside(parent, candidate) {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

if (isInside(root, backupRoot) || isInside(vaultRoot, backupRoot)) {
  problems.push("private evidence backup is inside a production repository or the Guanlan Vault");
}

let manifest = {};
try {
  manifest = JSON.parse(fs.readFileSync(path.join(backupRoot, "manifest.json"), "utf8"));
  if (manifest.schemaVersion !== "PRIVATE-EVIDENCE-BACKUP-V1.0") {
    problems.push("private evidence backup schema version is invalid");
  }
  if (manifest.discoveryPolicy !== "backup_is_outside_repository_and_v4_discovery") {
    problems.push("private evidence backup discovery policy is invalid");
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
if (originalJsonFiles.length !== manifest.snapshots) {
  problems.push(
    `backup is stale: private store has ${originalJsonFiles.length} JSON snapshots, backup has ${manifest.snapshots}`,
  );
}
if (historical.length !== manifest.nonProductionHistoricalSources) {
  problems.push(
    `historical migration count mismatch: expected ${manifest.nonProductionHistoricalSources}, got ${historical.length}`,
  );
}

const objectRefs = new Set();
const snapshotRefs = new Set();
for (const line of catalog) {
  try {
    const entry = JSON.parse(line);
    if (!entry.object_ref || !entry.content_hash) {
      problems.push("private evidence catalog contains an entry without content_hash/object_ref");
      continue;
    }
    objectRefs.add(entry.object_ref);
    snapshotRefs.add(entry.snapshot_ref);
    if (entry.body_available && !fs.existsSync(path.join(backupRoot, entry.object_ref))) {
      problems.push(`private evidence object is missing: ${entry.object_ref}`);
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
if (manifest.missingBodies !== 0) {
  problems.push(`private evidence backup has ${manifest.missingBodies} snapshot(s) without a body`);
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  backupRoot,
  manifest,
  catalogEntries: catalog.length,
  historicalEntries: historical.length,
  problems,
}, null, 2));

if (problems.length) process.exit(1);
