import path from "node:path";

function normalizedRef(value = "") {
  return String(value || "").trim().replace(/\\/gu, "/");
}

export function sourceSnapshotRefForRaw(raw = {}, sourceArtifact = {}) {
  const bodyRef = normalizedRef(raw.body_ref);
  if (bodyRef) return bodyRef;
  const refs = (sourceArtifact.snapshot_refs || []).map(normalizedRef).filter(Boolean);
  return refs.find((ref) => path.posix.extname(ref).toLowerCase() === ".json") || refs[0] || "";
}

export function sourceSnapshotRefsByRawId(sourceArtifacts = [], rawDocuments = []) {
  const artifactsById = new Map(sourceArtifacts.map((artifact) => [artifact.source_artifact_id, artifact]));
  return new Map(rawDocuments.map((raw) => [
    raw.raw_id,
    sourceSnapshotRefForRaw(raw, artifactsById.get(raw.source_artifact_id)),
  ]));
}
