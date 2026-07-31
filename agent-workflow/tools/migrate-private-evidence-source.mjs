#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { buildPrivateEvidenceBackup } from "./lib/private-evidence-backup.mjs";
import { evidenceRef, loadPrivateEvidenceStore } from "./lib/private-evidence-store.mjs";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";

const root = process.cwd();
const originalsRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
const publicIndexFile = path.join(root, "01-SiteV2/content/01-raw/source-index.jsonl");
const dataCenterRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeLines(file, values) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    values.length ? `${values.map((value) => JSON.stringify(value)).join("\n")}\n` : "",
    "utf8",
  );
}

function safeInside(parent, candidate) {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate));
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function publicIndex(store) {
  return store.catalog.map((entry) => {
    const metadata = readJson(path.join(store.backupRoot, entry.record_ref));
    return {
      schema_version: "PUBLIC-EVIDENCE-LOCATOR-V1.0",
      source_id: `SRC-${crypto.createHash("sha256").update(entry.snapshot_ref).digest("hex").slice(0, 16)}`,
      data_date: entry.data_date,
      title_original: String(metadata.title || metadata.title_zh || "").trim(),
      title_zh: String(metadata.title_zh || "").trim(),
      title_translation_status: String(metadata.title_translation_status || "").trim(),
      title_translation_method: String(metadata.title_translation_method || "").trim(),
      title_translation_model: String(metadata.title_translation_model || "").trim(),
      source_url: String(
        metadata.canonical_url
        || metadata.original_url
        || metadata.source_url
        || entry.source_url
        || "",
      ).trim(),
      publisher: String(metadata.source_name || "").trim(),
      author: String(metadata.author || "").trim(),
      published_at: String(metadata.published_at || "").trim(),
      captured_at: String(metadata.collected_at || metadata.last_seen_at || entry.collected_at || "").trim(),
      language: String(metadata.language || "").trim(),
      document_type: String(metadata.source_type || "article").trim(),
      content_hash: entry.content_hash,
      body_length: Number(entry.body_length || metadata.private_evidence?.body_length || 0),
      evidence_ref: entry.evidence_ref || evidenceRef(entry.content_hash),
    };
  });
}

function migrateIntakeFile(file) {
  const payload = readJson(file);
  payload.schema_version = "SOURCE-INTAKE-V1.1";
  for (const source of payload.source_artifacts || []) {
    source.snapshot_refs = source.content_hash ? [evidenceRef(source.content_hash)] : source.snapshot_refs;
  }
  for (const raw of payload.raw_documents || []) {
    if (raw.content_hash) {
      raw.schema_version = "RAW-V4.0";
      raw.body_ref = evidenceRef(raw.content_hash);
      raw.body_storage = "private_evidence_store";
    }
    const diagnostics = raw.intake_diagnostics || {};
    diagnostics.key_excerpts = (diagnostics.key_excerpts || [])
      .map((excerpt) => ({
        type: String(excerpt?.type || "").trim(),
        text: String(excerpt?.text || "").trim(),
        confidence: String(excerpt?.confidence || "").trim(),
      }))
      .filter((excerpt) => excerpt.text);
    diagnostics.eligible_for_v4_extraction = Boolean(
      diagnostics.eligible_for_v4_extraction ?? diagnostics.pooled,
    );
    delete diagnostics.pool_routes;
    delete diagnostics.pooled;
    raw.intake_diagnostics = diagnostics;
  }
  payload.counts = {
    ...(payload.counts || {}),
    eligible_documents: (payload.raw_documents || [])
      .filter((raw) => raw.intake_diagnostics?.eligible_for_v4_extraction).length,
  };
  delete payload.counts.pooled_documents;
  writeJson(file, payload);
}

function migrateBundleDirectory(directory, store) {
  const rawFile = path.join(directory, "raw-documents.json");
  const sourceFile = path.join(directory, "source-artifacts.json");
  const manifestFile = path.join(directory, "manifest.json");
  if (!fs.existsSync(rawFile) || !fs.existsSync(sourceFile) || !fs.existsSync(manifestFile)) return null;

  const raws = readJson(rawFile);
  const sources = readJson(sourceFile);
  const manifest = readJson(manifestFile);
  const currentAuxiliaryTables = {
    "fde-observations.json": [],
    "hardware-facts.json": [],
    "hardware-snapshots.json": [],
    "monitoring-funnel.json": [],
  };
  let strippedBodyBytes = 0;
  for (const raw of raws) {
    const body = String(raw.body_clean || raw.body_original || "");
    strippedBodyBytes += Buffer.byteLength(body, "utf8");
    raw.schema_version = "RAW-V4.0";
    raw.body_ref = evidenceRef(raw.content_hash);
    raw.body_length = body.length
      || Number(store.byContentHash.get(String(raw.content_hash || "").toLowerCase())?.[0]?.body_length || 0);
    raw.body_storage = "private_evidence_store";
    delete raw.body_original;
    delete raw.body_clean;
  }
  for (const source of sources) {
    source.snapshot_refs = source.content_hash ? [evidenceRef(source.content_hash)] : source.snapshot_refs;
  }
  manifest.raw_version = "RAW-V4.0";
  manifest.fde_observation_version = "FDE-OBSERVATION-V1.0";
  manifest.hardware_fact_version = "HARDWARE-FACT-V1.0";
  manifest.hardware_snapshot_version = "HARDWARE-SNAPSHOT-V1.0";
  manifest.monitoring_funnel_version = "LENS-FUNNEL-V1.0";
  for (const [name, fallback] of Object.entries(currentAuxiliaryTables)) {
    const file = path.join(directory, name);
    if (!fs.existsSync(file)) writeJson(file, fallback);
    const countKey = name.replace(/\.json$/u, "").replaceAll("-", "_");
    manifest.counts[countKey] = readJson(file).length;
  }
  writeJson(rawFile, raws);
  writeJson(sourceFile, sources);
  writeJson(manifestFile, manifest);
  return { date: path.basename(directory), raw_documents: raws.length, stripped_body_bytes: strippedBodyBytes };
}

function main() {
  const date = arg("date", "");
  if (date && !/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
    throw new Error(`Invalid --date=${date}`);
  }
  const deletePublicOriginals = arg("delete-public-originals", "false") === "true";
  const backupRoot = resolvePrivateEvidenceBackupRoot(root);
  buildPrivateEvidenceBackup({ root, backupRoot });
  const store = loadPrivateEvidenceStore(root);
  writeLines(publicIndexFile, publicIndex(store));

  const intakeRoot = path.join(dataCenterRoot, "intake-v1");
  const intakeFiles = fs.existsSync(intakeRoot)
    ? fs.readdirSync(intakeRoot)
      .filter((name) => name.endsWith(".json"))
      .filter((name) => !date || name === `${date}.json`)
      .map((name) => path.join(intakeRoot, name))
    : [];
  intakeFiles.forEach(migrateIntakeFile);

  const bundles = fs.readdirSync(dataCenterRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .filter((entry) => !date || entry.name === date)
    .map((entry) => migrateBundleDirectory(path.join(dataCenterRoot, entry.name), store))
    .filter(Boolean);

  const publicOriginalsTarget = date ? path.join(originalsRoot, date) : originalsRoot;
  if (deletePublicOriginals && fs.existsSync(publicOriginalsTarget)) {
    if (!safeInside(root, publicOriginalsTarget) || path.resolve(publicOriginalsTarget) === path.resolve(root)) {
      throw new Error(`Refusing to delete unsafe public originals path: ${publicOriginalsTarget}`);
    }
    fs.rmSync(publicOriginalsTarget, { recursive: true, force: false });
  }

  console.log(JSON.stringify({
    ok: true,
    private_store: backupRoot,
    public_index: path.relative(root, publicIndexFile).replaceAll("\\", "/"),
    public_index_entries: store.catalog.length,
    intake_files: intakeFiles.length,
    bundle_dates: bundles.length,
    raw_documents: bundles.reduce((sum, bundle) => sum + bundle.raw_documents, 0),
    stripped_body_bytes: bundles.reduce((sum, bundle) => sum + bundle.stripped_body_bytes, 0),
    scoped_date: date || "all",
    public_originals_target: path.relative(root, publicOriginalsTarget).replaceAll("\\", "/"),
    public_originals_deleted: deletePublicOriginals && !fs.existsSync(publicOriginalsTarget),
  }, null, 2));
}

main();
