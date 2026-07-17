#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const queueFile = path.join(root, "01-SiteV2/content/11-databases/targeted-backfill-v1/queue.json");
const schemaFile = path.join(root, "agent-workflow/product/targeted-backfill-v1.schema.json");
const reportFile = path.join(root, "agent-workflow/reports/targeted-backfill-v1-gate.json");
const canonicalRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function canonicalIndex() {
  const index = { dates: [], entities: new Map(), events: new Set(), fde: new Set(), claims: new Set(), sources: new Set() };
  if (!fs.existsSync(canonicalRoot)) return index;
  index.dates = fs.readdirSync(canonicalRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const files = [
    ["entities.json", "entity_id", index.entities],
    ["canonical-events.json", "event_id", index.events],
    ["fde-records.json", "fde_id", index.fde],
    ["claims.json", "claim_id", index.claims],
    ["source-artifacts.json", "source_artifact_id", index.sources]
  ];
  for (const date of index.dates) {
    for (const [name, key, target] of files) {
      const file = path.join(canonicalRoot, date, name);
      if (!fs.existsSync(file)) continue;
      for (const row of readJson(file)) {
        if (!row[key]) continue;
        if (target instanceof Map) target.set(row[key], row);
        else target.add(row[key]);
      }
    }
  }
  return index;
}

function evaluate(queue, canonical) {
  const problems = [];
  const tasks = queue.tasks || [];
  const allTasks = [...tasks, ...(queue.resolvedTasks || []), ...(queue.retiredTasks || [])];
  const ids = allTasks.map((task) => task.taskId);
  if (new Set(ids).size !== ids.length) problems.push("task IDs are not unique across active and resolved queues");
  const ajv = new Ajv2020({ allErrors: true, strict: false, formats: { date: /^\d{4}-\d{2}-\d{2}$/u } });
  const validate = ajv.compile(readJson(schemaFile));
  if (!validate(queue)) for (const error of validate.errors || []) problems.push(`schema ${error.instancePath || "/"} ${error.message}`);

  const requiredTypes = ["company_history", "product_history", "funding_detail", "deployment_case"];
  const latestCanonicalDate = canonical.dates.at(-1) || "";
  if (queue.manifest?.coverageWindow?.endDate !== latestCanonicalDate) problems.push(`queue coverage end ${queue.manifest?.coverageWindow?.endDate || "missing"} does not match latest canonical bundle ${latestCanonicalDate || "missing"}`);
  for (const type of requiredTypes) if (!tasks.some((task) => task.taskType === type)) problems.push(`initial queue has no ${type} task`);
  for (const task of tasks) {
    if (task.target.kind === "entity") {
      const entity = canonical.entities.get(task.target.id);
      if (!entity) problems.push(`${task.taskId} target entity does not resolve`);
      else if (entity.verification_status !== "verified") problems.push(`${task.taskId} targets an unverified entity`);
    }
    if (task.target.kind === "event" && !canonical.events.has(task.target.eventId || task.target.id)) problems.push(`${task.taskId} target event does not resolve`);
    if (task.target.fdeId && !canonical.fde.has(task.target.fdeId)) problems.push(`${task.taskId} target FDE record does not resolve`);
    for (const ref of task.detection.detectedFromRefs) {
      const resolves = ref.startsWith("EV-") ? canonical.events.has(ref)
        : ref.startsWith("FDE-") ? canonical.fde.has(ref)
          : ref.startsWith("CL-") ? canonical.claims.has(ref)
            : ref.startsWith("SA-") ? canonical.sources.has(ref)
              : ref.startsWith("EN-") ? canonical.entities.has(ref)
                : true;
      if (!resolves) problems.push(`${task.taskId} detection reference does not resolve: ${ref}`);
    }
    if (!task.searchPlan.queries.length) problems.push(`${task.taskId} has no search query`);
    if (!task.searchPlan.queries.some((query) => query.includes(`"${task.target.name.replace(/"/gu, "")}"`)) && task.taskType !== "deployment_case") problems.push(`${task.taskId} has no exact target-name query`);
    if (task.detection.gapKind === "missing_fields" && !task.detection.missingFields.length) problems.push(`${task.taskId} is a fact-gap task without missing fields`);
    if (task.detection.gapKind === "coverage_sweep" && task.detection.missingFields.length) problems.push(`${task.taskId} treats a coverage sweep as a factual missing field`);
    if (!task.completion.requiredArtifacts.includes("SourceArtifact") || !task.completion.requiredArtifacts.includes("RawDocument") || !task.completion.requiredArtifacts.includes("Claim")) problems.push(`${task.taskId} can complete without the V4 evidence chain`);
    if (task.state.status === "in_progress" && (!task.state.worker || !task.state.leaseExpiresAt)) problems.push(`${task.taskId} has an invalid lease`);
    for (const candidate of task.state.candidateSources) {
      if (!/^https?:\/\//u.test(candidate.url || "")) problems.push(`${task.taskId} has an invalid candidate URL`);
      if ("snippet" in candidate || "summary" in candidate) problems.push(`${task.taskId} persists discovery copy as candidate evidence`);
    }
  }

  const serialized = JSON.stringify(queue);
  for (const field of ["business_meaning", "why_watch", "importance_score", "opportunity_score", "recommendation"]) {
    if (serialized.includes(`\"${field}\"`)) problems.push(`forbidden judgment field entered backfill queue: ${field}`);
  }
  const counts = queue.manifest?.counts || {};
  if (counts.active !== tasks.length) problems.push("manifest active count does not match tasks");
  if (counts.resolved !== (queue.resolvedTasks || []).length) problems.push("manifest resolved count does not match resolved tasks");
  if (counts.retired !== (queue.retiredTasks || []).length) problems.push("manifest retired count does not match retired tasks");
  for (const task of queue.resolvedTasks || []) if (task.state.status !== "resolved") problems.push(`${task.taskId} is in resolvedTasks without resolved status`);
  for (const task of queue.retiredTasks || []) if (task.state.status !== "retired" || task.state.retirementReason !== "target_no_longer_canonical") problems.push(`${task.taskId} has an invalid retirement record`);
  for (const type of requiredTypes) if ((counts.byType?.[type] || 0) !== tasks.filter((task) => task.taskType === type).length) problems.push(`manifest ${type} count is stale`);
  return { ok: problems.length === 0, checkedAt: new Date().toISOString(), queueVersion: queue.manifest?.queueVersion || "", coverageWindow: queue.manifest?.coverageWindow || {}, counts, problems };
}

if (!fs.existsSync(queueFile)) {
  console.error(JSON.stringify({ ok: false, problems: ["targeted backfill queue is missing; run npm run build:targeted-backfill"] }, null, 2));
  process.exit(1);
}
const report = evaluate(readJson(queueFile), canonicalIndex());
fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, report: path.relative(root, reportFile).replace(/\\/gu, "/") }, null, 2));
if (!report.ok) process.exit(1);
