import crypto from "node:crypto";
import fs from "node:fs";

// Public, path-free identities. Local bindings remain in the private manager.
export const workspaceRegistry = JSON.parse(fs.readFileSync(new URL("../../harness/workspace-registry.json", import.meta.url), "utf8"));
export const skillIdentity = (skill) => "skill:" + crypto.createHash("sha256").update(JSON.stringify([skill.sourceKind || "unknown", skill.sourcePath || skill.name])).digest("hex").slice(0, 24);
export function sharedRecords(portfolio, skills, telemetry) {
  const date = telemetry.meta?.data_date;
  const batchId = /^\d{4}-\d{2}-\d{2}$/u.test(date || "") ? `data-center:${date}` : null;
  return {
    schema: 1,
    registry: workspaceRegistry,
    skills: skills.map(s => ({id: skillIdentity(s), name: s.name, sourceKind: s.sourceKind, sourcePath: s.sourcePath, sourceDigest: s.sourceDigest, platformIds: s.platformIds, version: s.version, status: s.status, lifecycle: s.lifecycle, syncState: s.syncState})),
    versions: portfolio.versions.map(v => ({...v, id: `version:${v.kind}:${v.key}`})),
    batches: batchId ? [{id: batchId, observedAt: telemetry.meta?.generated_at || null, sourceSnapshot: telemetry.meta?.source_snapshot || null, stages: (telemetry.stages || []).map(s => ({...s, id: `${batchId}:${s.id}`}))}] : [],
  };
}
