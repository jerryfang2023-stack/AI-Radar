import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function clean(value) {
  return String(value ?? "").replace(/^\uFEFF/u, "").trim();
}

function rel(root, file) {
  return path.relative(root, file).replaceAll("\\", "/");
}

function listFiles(root, extension) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const stack = [root];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) files.push(file);
    }
  }
  return files.sort();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function readLines(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function latestProductionSnapshotRefs(root) {
  const databaseRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
  if (!fs.existsSync(databaseRoot)) return { date: "", refs: new Set() };
  const dates = fs.readdirSync(databaseRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const date = dates.at(-1) || "";
  if (!date) return { date, refs: new Set() };
  const sourceFile = path.join(databaseRoot, date, "source-artifacts.json");
  const sources = fs.existsSync(sourceFile) ? readJson(sourceFile) : [];
  return {
    date,
    refs: new Set((Array.isArray(sources) ? sources : [])
      .flatMap((source) => source.snapshot_refs || [])
      .map((value) => String(value).replaceAll("\\", "/"))),
  };
}

function bodyForSnapshot(jsonFile, record) {
  const embedded = clean(record.clean_text || record.full_text || record.body_original);
  if (embedded) return embedded;
  const markdownFile = jsonFile.replace(/\.json$/iu, ".md");
  if (fs.existsSync(markdownFile)) return fs.readFileSync(markdownFile, "utf8");
  return "";
}

function stableHash(record, body) {
  const declared = clean(record.content_hash || record.full_text_hash).toLowerCase();
  if (declared) return declared.replace(/[^a-z0-9_-]/gu, "-");
  return crypto.createHash("sha256").update(body, "utf8").digest("hex");
}

const PRIVATE_BODY_FIELDS = new Set([
  "body_clean",
  "body_original",
  "body_original_html",
  "clean_text",
  "full_text",
  "markdown_snapshot",
]);

function privateRecord(record, entry, body) {
  const metadata = Object.fromEntries(
    Object.entries(record).filter(([key]) => !PRIVATE_BODY_FIELDS.has(key)),
  );
  return {
    ...metadata,
    private_evidence: {
      schema_version: "PRIVATE-EVIDENCE-RECORD-V1.0",
      evidence_ref: entry.evidence_ref,
      object_ref: entry.object_ref,
      snapshot_ref: entry.snapshot_ref,
      markdown_snapshot_ref: entry.markdown_snapshot_ref,
      content_hash: entry.content_hash,
      body_length: body.length,
    },
  };
}

function recordRefForSnapshot(snapshotRef) {
  const suffix = snapshotRef.split("/originals/")[1] || path.basename(snapshotRef);
  return `records/${suffix}`;
}

function writeLines(file, records) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(
    file,
    records.length ? `${records.map((record) => JSON.stringify(record)).join("\n")}\n` : "",
    "utf8",
  );
}

function isInside(parent, candidate) {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function finalizePrivateEvidenceStore({
  backupRoot,
  catalog,
  productionDate = "",
  generatedAt = new Date().toISOString(),
}) {
  const historical = catalog
    .filter((entry) => (
      entry.data_date
      && productionDate
      && entry.data_date < productionDate
      && !entry.production_ref_latest
    ))
    .map((entry) => ({
      ...entry,
      migration_status: "isolated_private_store",
      discovery_policy: "excluded_from_v4_automatic_discovery",
    }));
  const uniqueHashes = new Set(catalog.map((entry) => entry.content_hash));
  const missingBodies = catalog.filter((entry) => !entry.body_available).length;

  writeLines(path.join(backupRoot, "catalog.jsonl"), catalog);
  writeLines(
    path.join(backupRoot, "manifests/non-production-historical-sources.jsonl"),
    historical,
  );
  const catalogDigest = crypto.createHash("sha256")
    .update(JSON.stringify(catalog), "utf8")
    .digest("hex");
  const manifestFile = path.join(backupRoot, "manifest.json");
  const previousManifest = fs.existsSync(manifestFile)
    ? (() => {
        try {
          return readJson(manifestFile);
        } catch {
          return {};
        }
      })()
    : {};
  const effectiveGeneratedAt = previousManifest.catalogDigest === catalogDigest
    ? previousManifest.generatedAt
    : generatedAt;
  const summary = {
    schemaVersion: "PRIVATE-EVIDENCE-STORE-V2.0",
    generatedAt: effectiveGeneratedAt,
    catalogDigest,
    sourceRoot: "private-evidence-store",
    productionReferenceDate: productionDate,
    objectPolicy: "one_body_per_content_hash",
    sourcePolicy: "private_store_is_authoritative",
    discoveryPolicy: "private_store_is_outside_public_repository_and_v4_discovery",
    snapshots: catalog.length,
    uniqueContents: uniqueHashes.size,
    duplicateSnapshots: Math.max(0, catalog.length - uniqueHashes.size),
    nonProductionHistoricalSources: historical.length,
    missingBodies,
  };
  fs.writeFileSync(
    manifestFile,
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  );
  return summary;
}

export function ingestPrivateEvidenceRecords({
  root,
  backupRoot,
  records = [],
  generatedAt = new Date().toISOString(),
}) {
  const resolvedRoot = path.resolve(root);
  const resolvedBackupRoot = path.resolve(backupRoot);
  if (isInside(resolvedRoot, resolvedBackupRoot) || isInside(resolvedBackupRoot, resolvedRoot)) {
    throw new Error("Private evidence backup must be physically outside the WaveSight repository");
  }
  fs.mkdirSync(resolvedBackupRoot, { recursive: true });
  const manifestFile = path.join(resolvedBackupRoot, "manifest.json");
  const previousManifest = fs.existsSync(manifestFile) ? readJson(manifestFile) : {};
  const existingCatalog = readLines(path.join(resolvedBackupRoot, "catalog.jsonl"));
  const catalogBySnapshot = new Map(existingCatalog.map((entry) => [entry.snapshot_ref, entry]));

  for (const input of records) {
    const body = String(input.body || "");
    if (!body) throw new Error("Cannot ingest a private evidence record without a body");
    const metadata = input.metadata && typeof input.metadata === "object" ? input.metadata : {};
    const contentHash = clean(input.contentHash || metadata.content_hash || stableHash(metadata, body))
      .toLowerCase()
      .replace(/[^a-z0-9_-]/gu, "-");
    const snapshotRef = clean(input.snapshotRef).replaceAll("\\", "/");
    if (!snapshotRef || path.isAbsolute(snapshotRef) || snapshotRef.split("/").includes("..")) {
      throw new Error(`Invalid private evidence snapshot_ref: ${snapshotRef || "missing"}`);
    }
    const prefix = contentHash.slice(0, 2).padEnd(2, "_");
    const objectRef = `objects/${prefix}/${contentHash}.txt`;
    const recordRef = `records/${snapshotRef}`;
    const objectFile = path.join(resolvedBackupRoot, objectRef);
    if (fs.existsSync(objectFile) && fs.readFileSync(objectFile, "utf8") !== body) {
      throw new Error(`Detected content_hash collision while ingesting ${snapshotRef}`);
    }
    fs.mkdirSync(path.dirname(objectFile), { recursive: true });
    if (!fs.existsSync(objectFile)) fs.writeFileSync(objectFile, body, "utf8");
    const entry = {
      snapshot_ref: snapshotRef,
      markdown_snapshot_ref: "",
      content_hash: contentHash,
      evidence_ref: `evidence://${contentHash}`,
      object_ref: objectRef,
      record_ref: recordRef,
      source_url: clean(input.sourceUrl || metadata.source_url || metadata.canonical_url),
      collected_at: clean(input.collectedAt || metadata.captured_at || metadata.collected_at),
      data_date: clean(input.dataDate || "").slice(0, 10),
      body_length: body.length,
      body_available: true,
      production_ref_latest: false,
    };
    catalogBySnapshot.set(snapshotRef, entry);
    const recordFile = path.join(resolvedBackupRoot, recordRef);
    fs.mkdirSync(path.dirname(recordFile), { recursive: true });
    fs.writeFileSync(
      recordFile,
      `${JSON.stringify(privateRecord(metadata, entry, body), null, 2)}\n`,
      "utf8",
    );
  }

  const catalog = [...catalogBySnapshot.values()]
    .sort((left, right) => left.snapshot_ref.localeCompare(right.snapshot_ref));
  if (!catalog.length) throw new Error("Private evidence store has no catalog entries");
  const summary = finalizePrivateEvidenceStore({
    backupRoot: resolvedBackupRoot,
    catalog,
    productionDate: clean(previousManifest.productionReferenceDate),
    generatedAt,
  });
  return { ...summary, ingested: records.length };
}

export function buildPrivateEvidenceBackup({
  root,
  backupRoot,
  generatedAt = new Date().toISOString(),
}) {
  const resolvedRoot = path.resolve(root);
  const resolvedBackupRoot = path.resolve(backupRoot);
  if (isInside(resolvedRoot, resolvedBackupRoot) || isInside(resolvedBackupRoot, resolvedRoot)) {
    throw new Error("Private evidence backup must be physically outside the WaveSight repository");
  }

  const originalsRoot = path.join(resolvedRoot, "01-SiteV2/content/01-raw/originals");
  fs.mkdirSync(resolvedBackupRoot, { recursive: true });
  const production = latestProductionSnapshotRefs(resolvedRoot);
  const existingCatalog = readLines(path.join(resolvedBackupRoot, "catalog.jsonl"));
  const catalogBySnapshot = new Map(existingCatalog.map((entry) => [entry.snapshot_ref, entry]));
  const collisions = [];

  for (const jsonFile of listFiles(originalsRoot, ".json")) {
    let record;
    try {
      record = readJson(jsonFile);
    } catch {
      continue;
    }
    const body = bodyForSnapshot(jsonFile, record);
    const contentHash = stableHash(record, body);
    const prefix = contentHash.slice(0, 2).padEnd(2, "_");
    const objectRef = `objects/${prefix}/${contentHash}.txt`;
    const snapshotRef = rel(resolvedRoot, jsonFile);
    const markdownSnapshotRef = fs.existsSync(jsonFile.replace(/\.json$/iu, ".md"))
      ? rel(resolvedRoot, jsonFile.replace(/\.json$/iu, ".md"))
      : "";
    const recordRef = recordRefForSnapshot(snapshotRef);
    const evidenceRef = `evidence://${contentHash}`;
    const objectFile = path.join(resolvedBackupRoot, objectRef);
    if (body && fs.existsSync(objectFile)) {
      const existing = fs.readFileSync(objectFile, "utf8");
      if (existing !== body) {
        collisions.push({
          content_hash: contentHash,
          snapshot_ref: rel(resolvedRoot, jsonFile),
          object_ref: objectRef,
        });
      }
    } else if (body) {
      fs.mkdirSync(path.dirname(objectFile), { recursive: true });
      fs.writeFileSync(objectFile, body, "utf8");
    }
    const date = snapshotRef.match(/\/originals\/(\d{4}-\d{2}-\d{2})\//u)?.[1] || "";
    const entry = {
      snapshot_ref: snapshotRef,
      markdown_snapshot_ref: markdownSnapshotRef,
      content_hash: contentHash,
      evidence_ref: evidenceRef,
      object_ref: objectRef,
      record_ref: recordRef,
      source_url: clean(record.canonical_url || record.original_url || record.source_url || record.url),
      collected_at: clean(record.collected_at || record.captured_at || record.last_seen_at),
      data_date: date,
      body_length: body.length,
      body_available: Boolean(body),
      production_ref_latest: production.refs.has(snapshotRef),
    };
    catalogBySnapshot.set(snapshotRef, entry);
    fs.mkdirSync(path.dirname(path.join(resolvedBackupRoot, recordRef)), { recursive: true });
    fs.writeFileSync(
      path.join(resolvedBackupRoot, recordRef),
      `${JSON.stringify(privateRecord(record, entry, body), null, 2)}\n`,
      "utf8",
    );
  }

  const catalog = [...catalogBySnapshot.values()]
    .sort((left, right) => left.snapshot_ref.localeCompare(right.snapshot_ref));
  if (!catalog.length) {
    throw new Error("Private evidence store has no catalog entries and no repository snapshots to ingest");
  }
  if (collisions.length) {
    writeLines(path.join(resolvedBackupRoot, "manifests/content-hash-collisions.jsonl"), collisions);
    throw new Error(`Detected ${collisions.length} content_hash collision(s); backup was not finalized`);
  }

  return finalizePrivateEvidenceStore({
    backupRoot: resolvedBackupRoot,
    catalog,
    productionDate: production.date,
    generatedAt,
  });
}
