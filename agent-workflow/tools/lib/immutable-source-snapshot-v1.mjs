import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

export function sourceSnapshotIdentity(record = {}) {
  const sourceUrl = String(record.canonical_url || record.original_url || record.source_url || "").trim();
  const bodyHash = String(record.content_hash || record.full_text_hash || "").trim();
  return `${sourceUrl}|${bodyHash}`;
}

export function selectImmutableSourceSnapshot({ directory, baseName, record }) {
  const identity = sourceSnapshotIdentity(record);
  if (!identity || identity === "|") throw new Error(`${baseName}: immutable snapshot identity is empty`);
  const candidate = (name) => ({
    jsonPath: path.join(directory, `${name}.json`),
    markdownPath: path.join(directory, `${name}.md`),
  });
  const base = candidate(baseName);
  if (!fs.existsSync(base.jsonPath)) return { ...base, reused: false, existingRecord: null };

  const baseRecord = readJson(base.jsonPath);
  if (sourceSnapshotIdentity(baseRecord) === identity) {
    return { ...base, reused: true, existingRecord: baseRecord };
  }

  const suffix = crypto.createHash("sha256").update(identity).digest("hex").slice(0, 16);
  const versioned = candidate(`${baseName}-${suffix}`);
  if (!fs.existsSync(versioned.jsonPath)) return { ...versioned, reused: false, existingRecord: null };
  const versionedRecord = readJson(versioned.jsonPath);
  if (sourceSnapshotIdentity(versionedRecord) !== identity) {
    throw new Error(`${baseName}: immutable snapshot hash collision at ${path.basename(versioned.jsonPath)}`);
  }
  return { ...versioned, reused: true, existingRecord: versionedRecord };
}
