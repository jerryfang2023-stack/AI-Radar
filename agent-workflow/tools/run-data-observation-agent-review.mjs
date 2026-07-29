#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const trialStart = args.get("trial-start") || "";
const trialDays = Number.parseInt(args.get("trial-days") || "0", 10);

function readJson(relative, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
  } catch {
    return fallback;
  }
}

function addDays(value, days) {
  const parsed = new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(parsed.getTime())) return "";
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

function inTrialWindow() {
  if (!trialStart || !Number.isFinite(trialDays) || trialDays <= 0) return true;
  return date >= trialStart && date <= addDays(trialStart, trialDays - 1);
}

function finding(severity, code, message, evidence = {}) {
  return { severity, code, message, evidence };
}

function buildReview() {
  const entityPath = "01-SiteV2/site/data/data-center-v4/indexes/entities.json";
  const relationPath = "01-SiteV2/site/data/data-center-v4/indexes/relationships.json";
  const eventPath = "01-SiteV2/site/data/data-center-v4/indexes/events.json";
  const telemetryPath = "01-SiteV2/site/data/collection-telemetry-v1.json";
  const entityIndex = readJson(entityPath, null);
  const relationIndex = readJson(relationPath, null);
  const eventIndex = readJson(eventPath, null);
  const telemetry = readJson(telemetryPath, {});
  const findings = [];

  if (!entityIndex) findings.push(finding("blocker", "entity_index_missing", "ENTITY-V1 index is missing or unreadable.", { path: entityPath }));
  if (!relationIndex) findings.push(finding("blocker", "relationship_index_missing", "RELATION-V2.1 index is missing or unreadable.", { path: relationPath }));
  if (entityIndex?.meta?.entityVersion !== "ENTITY-V1.0") {
    findings.push(finding("blocker", "entity_version_mismatch", "Entity index is not ENTITY-V1.0.", { version: entityIndex?.meta?.entityVersion || "missing" }));
  }
  if (relationIndex?.meta?.relationshipVersion !== "RELATION-V2.1") {
    findings.push(finding("blocker", "relationship_version_mismatch", "Relationship index is not RELATION-V2.1.", { version: relationIndex?.meta?.relationshipVersion || "missing" }));
  }

  const entityIds = new Set([
    ...(entityIndex?.companies || []),
    ...(entityIndex?.products || []),
    ...(entityIndex?.people || []),
    ...(entityIndex?.taxonomyNodes || []),
  ].map((item) => item.id || item.entity_id || item.taxonomy_id).filter(Boolean));
  const events = Array.isArray(eventIndex?.events) ? eventIndex.events : [];
  const eventIds = new Set(events.map((item) => item.event_id || item.id).filter(Boolean));
  const relationships = Array.isArray(relationIndex?.relationships) ? relationIndex.relationships : [];
  const broken = relationships.filter((item) => (
    !item.relationship_id?.startsWith("REL2-")
    || !entityIds.has(item.subject_ref)
    || !entityIds.has(item.object_ref)
    || (eventIds.size > 0 && !eventIds.has(item.event_id))
    || !Array.isArray(item.claim_refs)
    || item.claim_refs.length === 0
    || !Array.isArray(item.source_refs)
    || item.source_refs.length === 0
  ));
  if (broken.length) {
    findings.push(finding("blocker", "relationship_evidence_chain_invalid", "Some RELATION-V2.1 rows have unresolved endpoints or evidence references.", {
      count: broken.length,
      relationship_ids: broken.slice(0, 20).map((item) => item.relationship_id || "missing"),
    }));
  }
  if (telemetry?.deprecated_compatibility?.status !== "deprecated_non_blocking") {
    findings.push(finding("warning", "ops_compatibility_status_missing", "OPS telemetry does not mark V3 assets as non-blocking deprecated compatibility.", {
      status: telemetry?.deprecated_compatibility?.status || "missing",
    }));
  }

  const blockers = findings.filter((item) => item.severity === "blocker");
  return {
    status: blockers.length ? "fail" : findings.length ? "warning" : "pass",
    findings,
    metrics: {
      entities: entityIds.size,
      events: eventIds.size,
      relationships: relationships.length,
      broken_relationships: broken.length,
      qa_queue: Number(telemetry?.fact_build?.qa_queue || 0),
      conflicts: Number(telemetry?.fact_build?.conflicts || 0),
    },
    sources: [entityPath, relationPath, eventPath, telemetryPath],
  };
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-data-observation-agent-review.json`);
  const mdPath = path.join(reportsDir, `${date}-data-observation-agent-review.md`);
  const latestJson = path.join(reportsDir, "data-observation-agent-review-latest.json");
  const latestMd = path.join(reportsDir, "data-observation-agent-review-latest.md");
  const md = [
    `# Data Observation Agent Review - ${date}`,
    "",
    `- contract: ${payload.contract}`,
    `- status: ${payload.status}`,
    `- generated_at: ${payload.generated_at}`,
    "- evidence_boundary: ENTITY-V1.0 and RELATION-V2.1 only; V3 Cards and intelligence graph are not review inputs",
    "- lane_boundary: O (viewpoints), C (community), and OPS reports cannot create Entity, Event, Claim, or RELATION rows",
    "",
    "## Metrics",
    "",
    ...Object.entries(payload.metrics).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Findings",
    "",
    ...(payload.findings.length
      ? payload.findings.map((item) => `- [${item.severity}] ${item.code}: ${item.message}`)
      : ["- none"]),
    "",
  ].join("\n");
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJson, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMd, md, "utf8");
  return { jsonPath, mdPath };
}

if (!inTrialWindow()) {
  console.log(JSON.stringify({ ok: true, status: "trial_inactive", date }, null, 2));
  process.exit(0);
}

const review = buildReview();
const payload = {
  ok: review.status !== "fail",
  contract: "OPS-AGENT-REVIEW-V2.0-entity-relation",
  date,
  generated_at: new Date().toISOString(),
  ...review,
};
const reports = writeReports(payload);
console.log(JSON.stringify({
  ok: payload.ok,
  status: payload.status,
  report: path.relative(root, reports.jsonPath).replace(/\\/gu, "/"),
  markdown: path.relative(root, reports.mdPath).replace(/\\/gu, "/"),
}, null, 2));
if (!payload.ok) process.exit(1);
