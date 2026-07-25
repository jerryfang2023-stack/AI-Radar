#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  attachTargetedBackfillEvidence,
  claimTargetedBackfillTask,
  recordTargetedBackfillRun
} from "../product/targeted-backfill-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const queueDir = path.join(root, "01-SiteV2/content/11-databases/targeted-backfill-v1");
const queueFile = path.join(queueDir, "queue.json");
const runsDir = path.join(queueDir, "runs");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJsonAtomic(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, file);
}

function refreshCounts(queue) {
  const byType = {};
  const byTier = {};
  const byStatus = {};
  for (const task of queue.tasks || []) {
    byType[task.taskType] = (byType[task.taskType] || 0) + 1;
    byTier[task.priority.tier] = (byTier[task.priority.tier] || 0) + 1;
    byStatus[task.state.status] = (byStatus[task.state.status] || 0) + 1;
  }
  queue.manifest.counts = { active: queue.tasks.length, resolved: queue.resolvedTasks.length, retired: queue.retiredTasks.length, byType, byTier, byStatus };
}

if (!fs.existsSync(queueFile)) throw new Error("Targeted backfill queue is missing. Run npm run build:targeted-backfill first.");
const queue = readJson(queueFile);
const action = args.get("action") || "next";
const taskId = args.get("task") || "";
const at = args.get("at") || new Date().toISOString();
let result;

if (action === "next") {
  result = queue.tasks.find((task) => task.state.status === "open" && task.priority.tier === "core")
    || queue.tasks.find((task) => task.state.status === "open")
    || null;
  console.log(JSON.stringify({ ok: true, task: result }, null, 2));
  process.exit(0);
}

if (action === "claim") {
  result = claimTargetedBackfillTask(queue, { taskId, worker: args.get("worker"), at, leaseHours: Number(args.get("lease-hours") || 4) });
} else if (action === "record") {
  const input = path.resolve(root, args.get("input") || "");
  if (!args.get("input") || !fs.existsSync(input)) throw new Error("A readable --input discovery-run JSON file is required.");
  const recorded = recordTargetedBackfillRun(queue, { taskId, report: readJson(input), at });
  const runFile = path.join(runsDir, `${recorded.run.runId}.json`);
  if (fs.existsSync(runFile)) throw new Error(`Discovery run already exists: ${recorded.run.runId}`);
  writeJsonAtomic(runFile, recorded.run);
  result = { task: recorded.task, run: recorded.run, runFile: path.relative(root, runFile).replace(/\\/gu, "/") };
} else if (action === "record-batch") {
  const input = path.resolve(root, args.get("input") || "");
  if (!args.get("input") || !fs.existsSync(input)) throw new Error("A readable --input discovery-run batch JSON file is required.");
  const payload = readJson(input);
  const reports = Array.isArray(payload) ? payload : payload.runs;
  if (!Array.isArray(reports) || !reports.length) throw new Error("A discovery-run batch must contain a non-empty runs array.");
  const duplicateTaskIds = reports.map((report) => report.taskId).filter((id, index, values) => values.indexOf(id) !== index);
  if (duplicateTaskIds.length) throw new Error(`Duplicate task IDs in discovery-run batch: ${[...new Set(duplicateTaskIds)].join(", ")}`);
  const worker = args.get("worker") || "targeted-backfill-batch";
  const pendingRuns = reports.map((report, index) => {
    const reportTaskId = report.taskId;
    const reportAt = report.at || new Date(Date.parse(at) + index).toISOString();
    claimTargetedBackfillTask(queue, { taskId: reportTaskId, worker: report.worker || worker, at: reportAt, leaseHours: Number(args.get("lease-hours") || 4) });
    const recorded = recordTargetedBackfillRun(queue, { taskId: reportTaskId, report, at: reportAt });
    const runFile = path.join(runsDir, `${recorded.run.runId}.json`);
    if (fs.existsSync(runFile)) throw new Error(`Discovery run already exists: ${recorded.run.runId}`);
    return { reportTaskId, recorded, runFile };
  });
  const batchResults = pendingRuns.map(({ reportTaskId, recorded, runFile }) => {
    writeJsonAtomic(runFile, recorded.run);
    return {
      taskId: reportTaskId,
      status: recorded.task.state.status,
      candidateCount: recorded.run.candidates.length,
      runId: recorded.run.runId,
      runFile: path.relative(root, runFile).replace(/\\/gu, "/")
    };
  });
  result = {
    recorded: batchResults.length,
    candidatesFound: batchResults.filter((item) => item.status === "candidates_found").length,
    noFindings: batchResults.filter((item) => item.status === "no_findings").length,
    items: batchResults
  };
} else if (action === "attach") {
  result = attachTargetedBackfillEvidence(queue, {
    taskId,
    sourceArtifactId: args.get("source-artifact-id"),
    rawId: args.get("raw-id"),
    claimIds: String(args.get("claim-ids") || "").split(",").map((value) => value.trim()).filter(Boolean),
    at
  });
} else {
  throw new Error(`Unsupported targeted backfill action: ${action}`);
}

refreshCounts(queue);
writeJsonAtomic(queueFile, queue);
console.log(JSON.stringify({ ok: true, action, result }, null, 2));
