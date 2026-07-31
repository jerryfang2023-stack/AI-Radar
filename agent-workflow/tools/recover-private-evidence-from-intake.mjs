#!/usr/bin/env node

import { ingestPrivateEvidenceRecords } from "./lib/private-evidence-backup.mjs";
import { loadPrivateEvidenceStore } from "./lib/private-evidence-store.mjs";
import fs from "node:fs";
import path from "node:path";
import { readSourceIntake } from "./lib/source-intake-v1.mjs";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";
import { fetchSourceSnapshot } from "./run-guanlan-daily-monitor.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = String(args.get("date") || "").trim();
const dropMismatches = args.get("drop-mismatches") === "true";
if (!/^\d{4}-\d{2}-\d{2}$/u.test(date)) {
  throw new Error("Usage: recover-private-evidence-from-intake.mjs --date=YYYY-MM-DD");
}

const intake = readSourceIntake(root, date);
if (!intake) throw new Error(`Structured source intake is missing for ${date}`);
const store = loadPrivateEvidenceStore(root);
const missing = intake.payload.raw_documents.filter(
  (document) => !store.byContentHash.has(String(document.content_hash || "").toLowerCase()),
);
const recovered = await Promise.all(missing.map(async (document) => {
  const snapshot = await fetchSourceSnapshot({
    url: document.source_url,
    title: document.title_original,
    summary: document.intake_diagnostics?.key_excerpts?.[0]?.text || document.title_original,
    acquisition_channel: document.intake_diagnostics?.acquisition_channel || "recovery",
  });
  return { document, snapshot };
}));
const mismatches = recovered.filter(
  ({ document, snapshot }) => snapshot.hash !== document.content_hash,
);
if (mismatches.length && !dropMismatches) {
  throw new Error(mismatches.map(({ document, snapshot }) =>
    `${document.raw_id}: recovered content hash ${snapshot.hash} does not match ${document.content_hash}`
  ).join("\n"));
}
const fetched = recovered
  .filter(({ document, snapshot }) => snapshot.hash === document.content_hash)
  .map(({ document, snapshot }) => ({
    body: snapshot.text,
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
      content_hash: document.content_hash,
      key_excerpts: document.intake_diagnostics?.key_excerpts || [],
    },
  }));

if (mismatches.length) {
  const removedRawIds = new Set(mismatches.map(({ document }) => document.raw_id));
  intake.payload.raw_documents = intake.payload.raw_documents.filter(
    (document) => !removedRawIds.has(document.raw_id),
  );
  const retainedSourceIds = new Set(
    intake.payload.raw_documents.map((document) => document.source_artifact_id),
  );
  intake.payload.source_artifacts = intake.payload.source_artifacts.filter(
    (artifact) => retainedSourceIds.has(artifact.source_artifact_id),
  );
  intake.payload.counts = {
    source_artifacts: intake.payload.source_artifacts.length,
    raw_documents: intake.payload.raw_documents.length,
    eligible_documents: intake.payload.raw_documents.filter(
      (document) => document.intake_diagnostics?.eligible_for_v4_extraction,
    ).length,
  };
  fs.writeFileSync(intake.file, `${JSON.stringify(intake.payload, null, 2)}\n`, "utf8");
}
const monitorLog = path.join(
  root,
  "agent-workflow",
  "reports",
  `${date}-guanlan-daily-monitor-log.md`,
);
if (fs.existsSync(monitorLog)) {
  const reconciled = fs.readFileSync(monitorLog, "utf8")
    .replace(/^(-\s+)?raw_count:\s*\d+/gmu, (_, prefix = "") =>
      `${prefix}raw_count: ${intake.payload.counts.raw_documents}`
    )
    .replace(/^(-\s+)?pool_count:\s*\d+/gmu, (_, prefix = "") =>
      `${prefix}pool_count: ${intake.payload.counts.eligible_documents}`
    );
  fs.writeFileSync(monitorLog, reconciled, "utf8");
}

const result = fetched.length
  ? ingestPrivateEvidenceRecords({
    root,
    backupRoot: resolvePrivateEvidenceBackupRoot(root),
    records: fetched,
  })
  : { ingested: 0 };

console.log(JSON.stringify({
  ok: true,
  date,
  missing: missing.length,
  ingested: result.ingested,
  dropped_mismatches: mismatches.map(({ document, snapshot }) => ({
    raw_id: document.raw_id,
    expected_hash: document.content_hash,
    recovered_hash: snapshot.hash,
  })),
}, null, 2));
