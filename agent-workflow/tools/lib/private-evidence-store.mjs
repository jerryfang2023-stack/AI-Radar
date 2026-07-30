import fs from "node:fs";
import path from "node:path";
import { resolvePrivateEvidenceBackupRoot } from "../private-evidence-backup-paths.mjs";
import { normalizeEvidenceBody } from "./evidence-body-normalizer.mjs";

const STORE_CACHE = new Map();

function clean(value) {
  return String(value ?? "").replace(/^\uFEFF/u, "").trim();
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

export function evidenceRef(contentHash) {
  const normalized = clean(contentHash).toLowerCase();
  if (!normalized) throw new Error("Cannot create a private evidence reference without content_hash");
  return `evidence://${normalized}`;
}

export function loadPrivateEvidenceStore(root, options = {}) {
  const backupRoot = resolvePrivateEvidenceBackupRoot(root, { required: options.required !== false });
  if (!backupRoot) return null;
  const manifestFile = path.join(backupRoot, "manifest.json");
  const catalogFile = path.join(backupRoot, "catalog.jsonl");
  if (!fs.existsSync(manifestFile) || !fs.existsSync(catalogFile)) {
    if (options.required === false) return null;
    throw new Error(`Private evidence store is incomplete: ${backupRoot}`);
  }
  const cacheKey = path.resolve(backupRoot);
  const manifestStat = fs.statSync(manifestFile);
  const catalogStat = fs.statSync(catalogFile);
  const cacheVersion = [
    manifestStat.mtimeMs,
    manifestStat.size,
    catalogStat.mtimeMs,
    catalogStat.size,
  ].join(":");
  const cached = STORE_CACHE.get(cacheKey);
  if (cached?.version === cacheVersion) return cached.store;
  const manifest = readJson(manifestFile);
  if (manifest.schemaVersion !== "PRIVATE-EVIDENCE-STORE-V2.0") {
    if (options.required === false) return null;
    throw new Error(`Private evidence store schema is not V2: ${manifest.schemaVersion || "missing"}`);
  }
  const catalog = readLines(catalogFile);
  const bySnapshotRef = new Map();
  const byEvidenceRef = new Map();
  const byContentHash = new Map();
  const byDate = new Map();
  for (const entry of catalog) {
    bySnapshotRef.set(clean(entry.snapshot_ref).replaceAll("\\", "/"), entry);
    const evidenceKey = clean(entry.evidence_ref);
    const hashKey = clean(entry.content_hash).toLowerCase();
    if (!byEvidenceRef.has(evidenceKey)) byEvidenceRef.set(evidenceKey, []);
    if (!byContentHash.has(hashKey)) byContentHash.set(hashKey, []);
    byEvidenceRef.get(evidenceKey).push(entry);
    byContentHash.get(hashKey).push(entry);
    if (!byDate.has(entry.data_date)) byDate.set(entry.data_date, []);
    byDate.get(entry.data_date).push(entry);
  }
  for (const entries of byDate.values()) {
    entries.sort((left, right) => left.snapshot_ref.localeCompare(right.snapshot_ref));
  }
  const store = {
    backupRoot,
    manifest,
    catalog,
    bySnapshotRef,
    byEvidenceRef,
    byContentHash,
    byDate,
  };
  STORE_CACHE.set(cacheKey, { version: cacheVersion, store });
  return store;
}

export function availablePrivateEvidenceDates(root) {
  const store = loadPrivateEvidenceStore(root, { required: false });
  return store ? [...store.byDate.keys()].filter(Boolean).sort() : [];
}

function resolveEntry(store, locator, contentHash = "", sourceUrl = "") {
  const normalizedLocator = clean(locator).replaceAll("\\", "/");
  const normalizedHash = clean(contentHash).toLowerCase();
  const directSnapshot = store.bySnapshotRef.get(normalizedLocator);
  if (directSnapshot) return directSnapshot;
  const candidates = [
    ...(store.byEvidenceRef.get(normalizedLocator) || []),
    ...(store.byContentHash.get(normalizedHash) || []),
  ];
  if (!candidates.length) return null;
  const normalizedUrl = clean(sourceUrl).replace(/\/+$/u, "");
  return candidates.find((entry) => clean(entry.source_url).replace(/\/+$/u, "") === normalizedUrl)
    || candidates[0];
}

export function loadPrivateEvidenceRecord(root, locator, contentHash = "", options = {}) {
  const store = loadPrivateEvidenceStore(root, { required: options.required !== false });
  if (!store) return null;
  const entry = resolveEntry(store, locator, contentHash, options.sourceUrl);
  if (!entry) {
    if (options.required === false) return null;
    throw new Error(`Private evidence locator is not cataloged: ${locator || contentHash || "missing"}`);
  }
  const recordFile = path.join(store.backupRoot, entry.record_ref || "");
  const objectFile = path.join(store.backupRoot, entry.object_ref || "");
  if (!entry.record_ref || !fs.existsSync(recordFile)) {
    if (options.required === false) return null;
    throw new Error(`Private evidence metadata record is missing: ${entry.record_ref || entry.snapshot_ref}`);
  }
  if (!entry.object_ref || !fs.existsSync(objectFile)) {
    if (options.required === false) return null;
    throw new Error(`Private evidence body object is missing: ${entry.object_ref || entry.snapshot_ref}`);
  }
  const metadata = readJson(recordFile);
  const body = fs.readFileSync(objectFile, "utf8");
  return {
    entry,
    file: recordFile,
    logicalFile: path.resolve(root, entry.snapshot_ref),
    metadata,
    raw: {
      ...metadata,
      full_text: body,
      clean_text: body,
    },
    body,
  };
}

export function loadPrivateEvidenceEntries(root, date) {
  const store = loadPrivateEvidenceStore(root);
  return (store.byDate.get(date) || []).map((entry) => {
    const loaded = loadPrivateEvidenceRecord(root, entry.snapshot_ref, entry.content_hash, {
      sourceUrl: entry.source_url,
    });
    return {
      raw: loaded.raw,
      file: loaded.logicalFile,
      evidence_entry: entry,
    };
  });
}

export function privateEvidenceBodyForRaw(root, raw, options = {}) {
  const loaded = loadPrivateEvidenceRecord(
    root,
    raw?.body_ref,
    raw?.content_hash,
    { required: options.required !== false },
  );
  return loaded?.body || "";
}

export function hydrateRawDocument(root, raw, options = {}) {
  if (clean(raw?.body_clean || raw?.body_original)) return raw;
  const body = normalizeEvidenceBody(privateEvidenceBodyForRaw(root, raw, options));
  if (!body) return raw;
  return {
    ...raw,
    body_original: body,
    body_clean: body,
  };
}

export function hydrateBundleRawDocuments(root, bundle, options = {}) {
  return {
    ...bundle,
    raw_documents: (bundle?.raw_documents || [])
      .map((raw) => hydrateRawDocument(root, raw, options)),
  };
}
