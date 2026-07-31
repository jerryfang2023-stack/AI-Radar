import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildPrivateEvidenceBackup,
  ingestPrivateEvidenceRecords,
} from "../lib/private-evidence-backup.mjs";

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

test("private evidence backup assertion supports cloud runs without a local Vault", () => {
  const assertion = fs.readFileSync(
    path.join(process.cwd(), "agent-workflow/tools/assert-private-evidence-backup.mjs"),
    "utf8",
  );

  assert.match(assertion, /resolveGuanlanVaultRoot\(root, \{ required: false \}\)/u);
  assert.match(assertion, /vaultRoot && isInside\(vaultRoot, backupRoot\)/u);
  assert.match(assertion, /private evidence backup is missing \$\{intakeEvidenceGaps\.length\} RawDocument content hash/u);
});

test("private evidence backup deduplicates bodies by content_hash and isolates historical sources", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-private-evidence-root-"));
  const backupRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-private-evidence-backup-"));
  const originals = path.join(root, "01-SiteV2/content/01-raw/originals");
  const currentPath = "01-SiteV2/content/01-raw/originals/2026-07-30/current.json";
  const historicalPath = "01-SiteV2/content/01-raw/originals/2026-07-01/historical.json";
  const body = "One immutable original body shared by two snapshot records.";

  writeJson(path.join(root, currentPath), {
    canonical_url: "https://example.test/current",
    content_hash: "same-content-hash",
    clean_text: body,
  });
  writeJson(path.join(root, historicalPath), {
    canonical_url: "https://example.test/historical-alias",
    content_hash: "same-content-hash",
    clean_text: body,
  });
  fs.writeFileSync(path.join(originals, "2026-07-30/current.md"), body, "utf8");
  fs.writeFileSync(path.join(originals, "2026-07-01/historical.md"), body, "utf8");
  writeJson(
    path.join(root, "01-SiteV2/content/11-databases/data-center-v4/2026-07-30/source-artifacts.json"),
    [{
      source_artifact_id: "SA-current",
      snapshot_refs: [currentPath, currentPath.replace(/\.json$/u, ".md")],
      content_hash: "same-content-hash",
    }],
  );

  const result = buildPrivateEvidenceBackup({
    root,
    backupRoot,
    generatedAt: "2026-07-30T03:00:00.000Z",
  });

  assert.equal(result.snapshots, 2);
  assert.equal(result.uniqueContents, 1);
  assert.equal(result.duplicateSnapshots, 1);
  assert.equal(result.nonProductionHistoricalSources, 1);

  const objectFiles = fs.readdirSync(
    path.join(backupRoot, "objects", "sa"),
    { withFileTypes: true },
  ).filter((entry) => entry.isFile());
  assert.equal(objectFiles.length, 1);
  assert.equal(
    fs.readFileSync(path.join(backupRoot, "objects", "sa", objectFiles[0].name), "utf8"),
    body,
  );

  const migration = fs.readFileSync(
    path.join(backupRoot, "manifests/non-production-historical-sources.jsonl"),
    "utf8",
  );
  assert.match(migration, /2026-07-01\/historical\.json/u);
  assert.doesNotMatch(migration, /2026-07-30\/current\.json/u);

  const catalogLines = fs.readFileSync(path.join(backupRoot, "catalog.jsonl"), "utf8")
    .trim()
    .split(/\r?\n/u);
  assert.equal(catalogLines.length, 2);
  assert.equal(new Set(catalogLines.map((line) => JSON.parse(line).object_ref)).size, 1);
  const firstCatalog = JSON.parse(catalogLines[0]);
  const privateMetadata = fs.readFileSync(path.join(backupRoot, firstCatalog.record_ref), "utf8");
  assert.doesNotMatch(
    privateMetadata,
    /"(?:body_clean|body_original|clean_text|full_text|markdown_snapshot)"\s*:/u,
  );

  const firstManifest = fs.readFileSync(path.join(backupRoot, "manifest.json"), "utf8");
  const repeated = buildPrivateEvidenceBackup({
    root,
    backupRoot,
    generatedAt: "2026-07-30T04:00:00.000Z",
  });
  assert.equal(repeated.generatedAt, "2026-07-30T03:00:00.000Z");
  assert.equal(repeated.schemaVersion, "PRIVATE-EVIDENCE-STORE-V2.0");
  assert.equal(
    fs.readFileSync(path.join(backupRoot, "manifest.json"), "utf8"),
    firstManifest,
  );
});

test("private evidence backup ingests research bodies without embedding them in metadata", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-private-research-root-"));
  const backupRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-private-research-backup-"));
  const body = "A captured research source body that remains private.";

  const result = ingestPrivateEvidenceRecords({
    root,
    backupRoot,
    generatedAt: "2026-07-30T05:00:00.000Z",
    records: [{
      body,
      contentHash: "research-content-hash",
      snapshotRef: "research/entity-catalog/SRC-1-research-content-hash.json",
      sourceUrl: "https://example.test/research",
      collectedAt: "2026-07-30T04:30:00.000Z",
      dataDate: "2026-07-30",
      metadata: {
        source_id: "SRC-1",
        source_url: "https://example.test/research",
        body_clean: body,
      },
    }],
  });

  assert.equal(result.ingested, 1);
  assert.equal(result.snapshots, 1);
  assert.equal(result.uniqueContents, 1);
  assert.equal(result.missingBodies, 0);
  const [catalogLine] = fs.readFileSync(path.join(backupRoot, "catalog.jsonl"), "utf8")
    .trim()
    .split(/\r?\n/u);
  const entry = JSON.parse(catalogLine);
  assert.equal(fs.readFileSync(path.join(backupRoot, entry.object_ref), "utf8"), body);
  const metadata = fs.readFileSync(path.join(backupRoot, entry.record_ref), "utf8");
  assert.doesNotMatch(
    metadata,
    /"(?:body_clean|body_original|clean_text|full_text|markdown_snapshot)"\s*:/u,
  );
});
