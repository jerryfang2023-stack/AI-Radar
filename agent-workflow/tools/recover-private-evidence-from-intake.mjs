#!/usr/bin/env node

import crypto from "node:crypto";
import { ingestPrivateEvidenceRecords } from "./lib/private-evidence-backup.mjs";
import { loadPrivateEvidenceStore } from "./lib/private-evidence-store.mjs";
import { readSourceIntake } from "./lib/source-intake-v1.mjs";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";
import { fetchSourceSnapshot } from "./run-guanlan-daily-monitor.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = String(args.get("date") || "").trim();
if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
  throw new Error("Usage: recover-private-evidence-from-intake.mjs --date=YYYY-MM-DD");
}

const intake = readSourceIntake(root, date);
if (!intake) throw new Error(`Structured source intake is missing for ${date}`);
const store = loadPrivateEvidenceStore(root);
const missing = intake.payload.raw_documents.filter(
  (document) => !store.byContentHash.has(String(document.content_hash || "").toLowerCase()),
);

function contentHash(body) {
  return crypto.createHash("sha256")
    .update(String(body || ""), "utf8")
    .digest("hex")
    .slice(0, 16);
}

function exactRecovery(document, snapshot) {
  const expectedHash = String(document.content_hash || "").toLowerCase();
  if (snapshot.hash === expectedHash) {
    return { body: snapshot.text, mode: "source_refetch" };
  }
  const metadataCandidates = [
    ...(document.intake_diagnostics?.key_excerpts || []).map((excerpt) => excerpt?.text),
    document.title_original,
    document.title_zh,
  ].map((value) => String(value || "")).filter(Boolean);
  const body = metadataCandidates.find((candidate) => contentHash(candidate) === expectedHash);
  return body ? { body, mode: "intake_exact_hash" } : null;
}

const recovered = await Promise.all(missing.map(async (document) => {
  const snapshot = await fetchSourceSnapshot({
    url: document.source_url,
    title: document.title_original,
    summary: document.intake_diagnostics?.key_excerpts?.[0]?.text || document.title_original,
    acquisition_channel: document.intake_diagnostics?.acquisition_channel || "recovery",
  });
  return { document, snapshot, exact: exactRecovery(document, snapshot) };
}));
const mismatches = recovered.filter(
  ({ exact }) => !exact,
);
const fetched = recovered
  .filter(({ exact }) => exact)
  .map(({ document, snapshot, exact }) => ({
    body: exact.body,
    contentHash: document.content_hash,
    snapshotRef: `01-SiteV2/content/01-raw/originals/${date}/recovered-${document.raw_id}.json`,
    sourceUrl: document.source_url,
    collectedAt: document.captured_at,
    dataDate: date,
    metadata: {
      original_url: document.source_url,
      canonical_url: document.canonical_url,
      source_name: document.publisher,
      title: document.title_original,
      title_zh: document.title_zh,
      author: document.author,
      published_at: document.published_at,
      collected_at: document.captured_at,
      language: document.language,
      source_type: document.document_type,
      extraction_method: document.capture_method,
      recovery_mode: exact.mode,
      recovery_status: snapshot.status,
      content_hash: document.content_hash,
      key_excerpts: document.intake_diagnostics?.key_excerpts || [],
    },
  }));

const result = fetched.length
  ? ingestPrivateEvidenceRecords({
    root,
    backupRoot: resolvePrivateEvidenceBackupRoot(root),
    records: fetched,
  })
  : { ingested: 0 };

console.log(JSON.stringify({
  ok: mismatches.length === 0,
  date,
  missing: missing.length,
  ingested: result.ingested,
  recovery_modes: fetched.reduce((counts, record) => {
    const mode = record.metadata.recovery_mode;
    counts[mode] = (counts[mode] || 0) + 1;
    return counts;
  }, {}),
  unresolved_mismatches: mismatches.map(({ document, snapshot }) => ({
    raw_id: document.raw_id,
    expected_hash: document.content_hash,
    recovered_hash: snapshot.hash,
    recovery_status: snapshot.status,
    extraction_method: snapshot.extraction_method,
  })),
}, null, 2));

if (mismatches.length) process.exitCode = 1;
