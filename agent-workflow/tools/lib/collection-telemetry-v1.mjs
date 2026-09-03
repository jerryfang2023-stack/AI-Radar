import fs from "node:fs";
import path from "node:path";

export const COLLECTION_TELEMETRY_VERSION = "COLLECTION-TELEMETRY-V1.0";
export const OPS_VERSION = "OPS-V3.5.0-membership-management";
export const V3_RETIRED_COMPATIBILITY = Object.freeze({
  status: "retired_archive",
  production_write: "disabled",
  active_consumers: 0,
  blocking: false,
});

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function reportNumber(text, key) {
  const match = text.match(new RegExp(`^- ${key}:\\s*(\\d+)\\s*$`, "mu"));
  return match ? Number(match[1]) : 0;
}

function countBy(items, selector) {
  const counts = {};
  for (const item of items) {
    const key = selector(item) || "unknown";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

function normalizedOutcome(value, fallback = "unknown") {
  const outcome = String(value || "").toLowerCase();
  if (["success", "passed", "completed"].includes(outcome)) return "passed";
  if (["failure", "failed", "cancelled", "timed_out"].includes(outcome)) return "failed";
  if (["skipped", "waiting", "queued", "in_progress", "partial"].includes(outcome)) return outcome;
  return fallback;
}

function repoRelative(root, file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function stage(id, label, status, counts = {}, evidence = []) {
  return { id, label, status, counts, evidence: evidence.filter(Boolean) };
}

export function buildCollectionTelemetry({
  root,
  date,
  generatedAt = new Date().toISOString(),
  outcomes = {},
}) {
  const bundleDir = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", date);
  const reportDir = path.join(root, "agent-workflow", "reports");
  const manifestFile = path.join(bundleDir, "manifest.json");
  const gateFile = path.join(reportDir, `${date}-data-center-v4-integrity-gate.json`);
  const persistentManifestFile = path.join(reportDir, `${date}-persistent-asset-manifest.json`);
  const monitorReportFile = path.join(reportDir, `${date}-guanlan-daily-monitor-log.md`);
  const monitorQualityReportFile = path.join(reportDir, `${date}-guanlan-monitor-quality-gate.md`);
  const manifest = readJson(manifestFile, {});
  const gate = readJson(gateFile, {});
  const persistentManifest = readJson(persistentManifestFile, {});
  const sourceArtifacts = readJson(path.join(bundleDir, "source-artifacts.json"), []);
  const rawDocuments = readJson(path.join(bundleDir, "raw-documents.json"), []);
  const claims = readJson(path.join(bundleDir, "claims.json"), []);
  const events = readJson(path.join(bundleDir, "canonical-events.json"), []);
  const conflicts = readJson(path.join(bundleDir, "event-conflicts.json"), []);
  const qaQueue = readJson(path.join(bundleDir, "qa-queue.json"), []);
  const entities = readJson(path.join(bundleDir, "entities.json"), []);
  const relationships = readJson(path.join(bundleDir, "relationships.json"), []);
  const monitorReport = readText(monitorReportFile);
  const monitorQualityReport = readText(monitorQualityReportFile);

  const capturedSourceIds = new Set(rawDocuments.map((item) => item.source_artifact_id).filter(Boolean));
  const captureSucceeded = sourceArtifacts.filter((item) => capturedSourceIds.has(item.source_artifact_id)).length;
  const qualityRecoveryRecorded = /- source_provider_recovery_status:\s*\S+/mu.test(monitorQualityReport);
  const recoveredSourceFailures = qualityRecoveryRecorded
    ? reportNumber(monitorQualityReport, "recovered_failed_sources_count")
    : 0;
  const captureFailed = qualityRecoveryRecorded
    ? reportNumber(monitorQualityReport, "unrecovered_failed_sources_count")
    : reportNumber(monitorReport, "unrecovered_failed_sources_count")
      || Math.max(0, sourceArtifacts.length - captureSucceeded);
  const discovered = reportNumber(monitorReport, "adaptive_raw_fetched_candidates")
    || sourceArtifacts.length + captureFailed;
  const acceptedClaims = claims.filter((item) => item.verification_status === "accepted").length;
  const rejectedClaims = claims.filter((item) => item.verification_status === "rejected").length;
  const pendingClaims = Math.max(0, claims.length - acceptedClaims - rejectedClaims);
  const qaByStatus = countBy(qaQueue, (item) => item.status);
  const gatePassed = manifest.date === date
    && gate.date === date
    && gate.ok === true
    && Array.isArray(gate.failures)
    && gate.failures.length === 0;

  const projectionOutcomes = {
    opportunity_map: normalizedOutcome(outcomes.opportunity || persistentManifest?.outcomes?.opportunity_map_v4),
    trend_radar: normalizedOutcome(outcomes.trend || persistentManifest?.outcomes?.trend_radar_projection),
    funding_insights: normalizedOutcome(outcomes.funding || persistentManifest?.outcomes?.funding_insights),
    fde_hardware_sync: normalizedOutcome(outcomes.lenses),
  };
  const knownProjectionStates = Object.values(projectionOutcomes).filter((value) => value !== "unknown");
  const projectionStatus = knownProjectionStates.includes("failed")
    ? "partial"
    : knownProjectionStates.length === Object.keys(projectionOutcomes).length
      && knownProjectionStates.every((value) => value === "passed" || value === "skipped")
      ? "passed"
      : knownProjectionStates.length ? "partial" : "unknown";

  const publicationOutcome = normalizedOutcome(outcomes.publication || persistentManifest?.outcomes?.pre_commit_gate);
  const publicationSnapshot = {
    status: publicationOutcome,
    phase: publicationOutcome === "waiting" ? "pre_deploy_snapshot" : "build_snapshot",
    authoritative: false,
    finalization: "github_pages_artifact",
  };
  const compatibilityWarnings = [];

  const stages = [
    stage("collection", "采集", gatePassed && captureFailed === 0 ? "passed" : captureSucceeded ? "partial" : "failed", {
      discovered,
      capture_succeeded: captureSucceeded,
      capture_failed: captureFailed,
      recovered_source_failures: recoveredSourceFailures,
      raw_documents: rawDocuments.length,
    }, [repoRelative(root, manifestFile), repoRelative(root, monitorReportFile), repoRelative(root, monitorQualityReportFile)]),
    stage("fact_build", "事实构建", gatePassed ? "passed" : "failed", {
      accepted_claims: acceptedClaims,
      rejected_claims: rejectedClaims,
      accepted: acceptedClaims,
      rejected: rejectedClaims,
      pending_claims: pendingClaims,
      canonical_events: events.length,
      entities: entities.length,
      relationships: relationships.length,
      conflicts: conflicts.length,
      qa_queue: qaQueue.length,
    }, [repoRelative(root, manifestFile), repoRelative(root, gateFile)]),
    stage("application_projection", "应用投影", projectionStatus, projectionOutcomes, [repoRelative(root, persistentManifestFile)]),
    stage("publication", "发布", publicationOutcome, {
      v4_bundle_ready: gatePassed,
      snapshot_phase: publicationSnapshot.phase,
      authoritative: publicationSnapshot.authoritative,
    }, [repoRelative(root, persistentManifestFile)]),
  ];

  return {
    meta: {
      version: COLLECTION_TELEMETRY_VERSION,
      ops_version: OPS_VERSION,
      data_date: date,
      generated_at: generatedAt,
      scope: "OPS",
      canonical_writeback: false,
      source_of_truth: "Data Center V4 manifest and integrity gate",
    },
    collection: stages[0].counts,
    fact_build: {
      ...stages[1].counts,
      qa_by_status: qaByStatus,
    },
    v4_gate: {
      status: gatePassed ? "passed" : "failed",
      manifest_date: manifest.date || "",
      gate_date: gate.date || "",
      failures: Array.isArray(gate.failures) ? gate.failures : ["integrity gate report missing or invalid"],
      warnings: Array.isArray(gate.warnings) ? gate.warnings : [],
    },
    application_projection: projectionOutcomes,
    publication: publicationSnapshot,
    stages,
    deprecated_compatibility: {
      ...V3_RETIRED_COMPATIBILITY,
      warnings: compatibilityWarnings,
    },
  };
}
