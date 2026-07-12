#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();

function read(relative) {
  return fs.readFileSync(path.join(root, relative), "utf8");
}

function includesAny(text, patterns) {
  return patterns.some((pattern) => pattern.test(text));
}

const config = JSON.parse(read("01-SiteV2/content/11-databases/business-signals-gate-v3.json"));
const workflow = read(".github/workflows/daily-persistent-assets-pr.yml");
const dryRunWorkflow = read(".github/workflows/daily-production-chain-dry-run.yml");
const monitorWrapper = read("agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs");
const monitor = read("agent-workflow/tools/run-guanlan-daily-monitor.mjs");
const cardGenerator = read("agent-workflow/tools/generate-asset-cards-from-pool.mjs");
const editorialGate = read("agent-workflow/tools/assert-signal-card-editorial-quality.mjs");
const healthDispatch = read("agent-workflow/tools/run-business-signals-health-dispatch.mjs");
const stateClassifier = read("agent-workflow/tools/classify-business-signals-production-state.mjs");
const dailySkill = read("agent-workflow/skills/guanlan-daily-monitor/SKILL.md");
const preGateSkill = read("agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md");
const qcSkill = read("agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md");
const preGateEvals = read("agent-workflow/skills/guanlan-monitor-quality-gate/evals/monitor-quality-gate-evals.md");
const dailyEvals = read("agent-workflow/skills/guanlan-daily-monitor/evals/daily-monitor-evals.md");

const problems = [];
const policy = config.pipeline_policy || {};
const monitorStartup = spawnSync(
  process.execPath,
  [path.join(root, "agent-workflow", "tools", "run-guanlan-daily-monitor.mjs"), "--source-only=invalid", "--dry-run=true"],
  { cwd: root, encoding: "utf8" }
);
const monitorStartupOutput = `${monitorStartup.stdout || ""}\n${monitorStartup.stderr || ""}`;
const monitorMetadataFixture = spawnSync(
  process.execPath,
  [path.join(root, "agent-workflow", "tools", "run-guanlan-daily-monitor.mjs"), "--metadata-regression-fixtures=true"],
  { cwd: root, encoding: "utf8" }
);
const monitorMetadataOutput = `${monitorMetadataFixture.stdout || ""}\n${monitorMetadataFixture.stderr || ""}`;

if (!monitorStartupOutput.includes("Unknown --source-only=invalid")) {
  const firstFailureLine = monitorStartupOutput.split(/\r?\n/u).find((line) => line.trim()) || "no diagnostic output";
  problems.push(`daily monitor startup smoke failed before source routing: ${firstFailureLine}`);
}
if (monitorMetadataFixture.status !== 0 || !monitorMetadataOutput.includes('"fixture": "source-publication-metadata"')) {
  const firstFailureLine = monitorMetadataOutput.split(/\r?\n/u).find((line) => line.trim()) || "no diagnostic output";
  problems.push(`daily monitor publication-metadata fixture failed: ${firstFailureLine}`);
}

if (Number(policy.monitor_attempts) !== 1) problems.push("pipeline_policy.monitor_attempts must be 1");
if (Number(policy.targeted_supply_refill_cycles) !== 1) problems.push("pipeline_policy.targeted_supply_refill_cycles must be 1");
if (policy.raw_volume_refill !== false) problems.push("pipeline_policy.raw_volume_refill must be false");
if (Object.hasOwn(config.hard_gates || {}, "unrecovered_failed_sources_max")) {
  problems.push("provider/channel failure must not be an independent hard gate");
}

for (const [name, text] of [["production workflow", workflow], ["dry-run workflow", dryRunWorkflow]]) {
  if (/--max-cycles=3/u.test(text)) problems.push(`${name} still requests three monitor cycles`);
  if (/id:\s*monitor-readiness/u.test(text)) problems.push(`${name} still runs the duplicate monitor-readiness gate`);
}

if (includesAny(monitorWrapper, [/refreshSourceArtifactsForCycle/u, /max_retry_cycles\s*\|\|\s*3/u])) {
  problems.push("monitor wrapper still recollects all source artifacts across retry cycles");
}
if (/targeted raw-volume refill cycle/u.test(monitor)) problems.push("monitor still refills solely to reach the Raw diagnostic target");
if (/cycle\s*<=\s*3/u.test(monitor)) problems.push("monitor still performs three targeted Pool/Core refill cycles");
if (/sourceArtifactsNeedSupplement/u.test(monitor)) problems.push("unified monitor recollects peer source lanes after source artifacts were already collected");
if (/assert-guanlan-automation-readiness/u.test(cardGenerator)) problems.push("Card generator still re-runs the retired duplicate readiness gate");
if (!/no formal Signal Cards generated/u.test(editorialGate)) problems.push("Card editorial gate does not block an empty active-date Card set");

if (/--max-cycles=3/u.test(dailySkill) || /--max-cycles=3/u.test(preGateSkill)) {
  problems.push("current monitor skills still prescribe three full monitor cycles");
}
if (includesAny(qcSkill, [/Active Raw count is below 150/u, /Do not report the daily monitor as complete until both conditions are true/u])) {
  problems.push("daily-monitor QC still treats diagnostic quantity/final QC as mandatory release blockers");
}
if (/pending_qc/u.test(preGateEvals) || /at most 3 bounded refetch cycles/u.test(preGateEvals)) {
  problems.push("monitor-quality evals still require the retired pending-QC/three-cycle model");
}
if (/source_artifact_retry_refresh/u.test(dailyEvals)) problems.push("daily-monitor evals still require full source-artifact retry refresh");

if (!/publication_waiting/u.test(workflow)) problems.push("production workflow does not classify merge conflicts as publication_waiting");
if (!/publication_waiting/u.test(healthDispatch)) problems.push("health dispatch does not recognize an open publication branch/PR as waiting");
if (!/classify-business-signals-production-state\.mjs/u.test(workflow) || !/classify-business-signals-production-state\.mjs/u.test(dryRunWorkflow)) {
  problems.push("production workflows do not share the stage-owned result classifier");
}
if (!/evidence_supply/u.test(stateClassifier) || !/card_quality/u.test(stateClassifier) || !/frontstage_contract/u.test(stateClassifier) || !/publication/u.test(stateClassifier)) {
  problems.push("production-state classifier is missing a current owning stage");
}
if (/build-follow-builders|run-trend-candidate/u.test(dryRunWorkflow)) problems.push("Business Signals dry-run still executes another lane");
for (const [name, text] of [["production workflow", workflow], ["dry-run workflow", dryRunWorkflow]]) {
  if (!/id:\s*card-editorial-gate/u.test(text) || !/--skip-editorial=true/u.test(text)) {
    problems.push(`${name} does not own editorial quality before the frontstage contract`);
  }
}

const result = {
  ok: problems.length === 0,
  policy_version: config.schema_version || "unknown",
  checks: 16,
  problems,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
