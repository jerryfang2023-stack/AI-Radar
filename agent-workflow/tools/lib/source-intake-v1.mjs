import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadPrivateEvidenceRecord } from "./private-evidence-store.mjs";

export const SOURCE_INTAKE_VERSION = "SOURCE-INTAKE-V1.1";
export const RAW_VERSION = "RAW-V4.0";

export function hasActiveHistoricalDuplicate(record = {}) {
  return clean(record.duplicate_status) === "duplicate";
}

function hash(value, length = 16) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex").slice(0, length);
}

function clean(value) {
  return String(value ?? "").replace(/^\uFEFF/u, "").trim();
}

function rel(root, file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function existingSnapshotRefs(root, refs = []) {
  return [...new Set(refs
    .map((ref) => clean(ref))
    .filter(Boolean)
    .map((ref) => path.resolve(path.isAbsolute(ref) ? ref : path.join(root, ref)))
    .filter((resolved) => resolved.startsWith(`${path.resolve(root)}${path.sep}`) && fs.existsSync(resolved))
    .map((resolved) => rel(root, resolved)))];
}

function extractionStatus(record = {}) {
  const body = clean(record.clean_text || record.full_text);
  if (!clean(record.original_url || record.canonical_url) || body.length < 20 || /\ufffd/gu.test(body)) return "quarantined";
  return body.length < 300 ? "partial" : "accepted";
}

function sourceBoundedExcerpts(record = {}) {
  if (!Array.isArray(record.key_excerpts)) return [];
  return record.key_excerpts
    .map((excerpt) => ({
      type: clean(excerpt?.type),
      text: clean(excerpt?.text),
      confidence: clean(excerpt?.confidence),
    }))
    .filter((excerpt) => excerpt.text);
}

export function buildSourceIntake({ root, date, entries, generatedAt = new Date().toISOString() }) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(String(date || ""))) {
    throw new Error(`Invalid source intake date: ${date || "missing"}`);
  }
  const sourceArtifacts = [];
  const rawDocuments = [];
  const seenSourceIds = new Set();
  const seenRawIds = new Set();

  for (const entry of entries || []) {
    const record = entry?.record || {};
    const sourceUrl = clean(record.original_url || record.canonical_url || record.source_url || record.url);
    const contentHash = clean(record.content_hash || record.full_text_hash || hash(record.clean_text || record.full_text));
    const bodyRef = rel(root, path.resolve(entry.jsonPath));
    const sourceIdentity = sourceUrl || bodyRef;
    const sourceArtifactId = `SA-${hash(`${sourceIdentity}|${contentHash}`)}`;
    const rawId = `RAW-${hash(`${date}|${sourceArtifactId}`)}`;
    const snapshotRefs = existingSnapshotRefs(root, [
      entry.markdownPath,
      entry.jsonPath,
      record.markdown_snapshot_path,
      record.json_snapshot_path,
      record.html_snapshot_path,
      record.screenshot_path,
    ]);

    if (!seenSourceIds.has(sourceArtifactId)) {
      sourceArtifacts.push({
        source_artifact_id: sourceArtifactId,
        source_url: sourceUrl,
        canonical_url: clean(record.canonical_url || sourceUrl),
        publisher: clean(record.source_name),
        capture_method: clean(record.extraction_method || record.fetch_status),
        captured_at: clean(record.collected_at || record.last_seen_at),
        snapshot_refs: snapshotRefs,
        content_hash: contentHash,
      });
      seenSourceIds.add(sourceArtifactId);
    }

    if (seenRawIds.has(rawId)) continue;
    rawDocuments.push({
      schema_version: RAW_VERSION,
      raw_id: rawId,
      source_artifact_id: sourceArtifactId,
      source_url: sourceUrl,
      canonical_url: clean(record.canonical_url || sourceUrl),
      publisher: clean(record.source_name),
      author: clean(record.author),
      published_at: clean(record.published_at),
      captured_at: clean(record.collected_at || record.last_seen_at),
      language: clean(record.language),
      document_type: clean(record.source_type || "article"),
      title_original: clean(record.title || record.title_zh),
      title_zh: clean(record.title_zh),
      body_ref: bodyRef,
      content_hash: contentHash,
      capture_method: clean(record.extraction_method || record.fetch_status),
      extraction_status: extractionStatus(record),
      intake_diagnostics: {
        acquisition_channel: clean(record.acquisition_channel),
        search_path: clean(record.search_path),
        evidence_object_type: clean(record.evidence_object_type),
        evidence_object_usable: Boolean(record.evidence_object_usable),
        evidence_strength: clean(record.evidence_strength),
        raw_qc_decision: clean(record.raw_qc_decision),
        raw_qc_downstream_use: clean(record.raw_qc_downstream_use),
        extraction_quality: clean(record.extraction_quality),
        readability_score: Number(record.readability_score || 0),
        has_full_text: Boolean(record.has_full_text),
        origin_fetch_status: clean(record.origin_fetch_status),
        key_excerpts: sourceBoundedExcerpts(record),
        eligible_for_v4_extraction: Boolean(entry.pooled),
      },
    });
    seenRawIds.add(rawId);
  }

  return {
    schema_version: SOURCE_INTAKE_VERSION,
    data_date: date,
    generated_at: generatedAt,
    source_artifacts: sourceArtifacts,
    raw_documents: rawDocuments,
    counts: {
      source_artifacts: sourceArtifacts.length,
      raw_documents: rawDocuments.length,
      eligible_documents: rawDocuments
        .filter((item) => item.intake_diagnostics.eligible_for_v4_extraction).length,
    },
  };
}

export function sourceIntakePath(root, date) {
  return path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", "intake-v1", `${date}.json`);
}

export function readSourceIntake(root, date) {
  const file = sourceIntakePath(root, date);
  if (!fs.existsSync(file)) return null;
  const payload = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
  if (payload.schema_version !== SOURCE_INTAKE_VERSION || payload.data_date !== date) {
    throw new Error(`Invalid structured source intake: ${rel(root, file)}`);
  }
  return { file, payload };
}

export function loadSourceIntakeEntries(root, date) {
  const intake = readSourceIntake(root, date);
  if (!intake) return null;
  const entries = intake.payload.raw_documents.map((document) => {
    const bodyRef = clean(document.body_ref);
    if (!bodyRef.startsWith("evidence://")) {
      const file = path.resolve(root, bodyRef);
      if (!file.startsWith(`${path.resolve(root)}${path.sep}`)) {
        throw new Error(`${document.raw_id}: source intake body_ref does not resolve inside the repository`);
      }
      if (fs.existsSync(file)) {
        const raw = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
        return { raw, file, intake_document: document };
      }
    }
    const privateEvidence = loadPrivateEvidenceRecord(root, bodyRef, document.content_hash, {
      sourceUrl: document.canonical_url || document.source_url,
    });
    return {
      raw: privateEvidence.raw,
      file: privateEvidence.logicalFile,
      evidence_entry: privateEvidence.entry,
      intake_document: document,
    };
  });
  return { ...intake, entries };
}
