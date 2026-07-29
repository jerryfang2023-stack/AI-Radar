#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const problems = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const workflows = [
  ".github/workflows/daily-persistent-assets-pr.yml",
  ".github/workflows/daily-production-chain-dry-run.yml",
];
const retiredCommands = [
  "generate-asset-cards-from-pool.mjs",
  "assert-pool-to-card-dedupe.mjs",
  "assert-signal-card-editorial-quality.mjs",
  "build-v3-data-observation-desk.mjs",
  "assert-business-signals-frontstage.mjs",
  "build-legacy-card-event-mappings.mjs",
];
const retiredStagePaths = [
  "01-SiteV2/knowledge/01-Signal-Cards",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/intelligence-graph-index.json",
];

for (const workflow of workflows) {
  const text = read(workflow);
  for (const command of retiredCommands) {
    if (text.includes(command)) problems.push(`${workflow} still invokes retired compatibility command ${command}`);
  }
  for (const retiredPath of retiredStagePaths) {
    if (text.includes(retiredPath)) problems.push(`${workflow} still stages or inspects retired compatibility path ${retiredPath}`);
  }
  if (!text.includes("data-center-v4/intake-v1/${RUN_DATE}.json")
    && !text.includes("data-center-v4/intake-v1/${{ steps.run-date.outputs.date }}.json")) {
    problems.push(`${workflow} does not persist the structured source intake`);
  }
  if (!text.includes("--compatibilityRetired=true")) {
    problems.push(`${workflow} does not declare compatibility-retired classification`);
  }
}

const persistent = read(workflows[0]);
if (!/id:\s*pre-commit-gate[\s\S]*steps\.data-center-v4-materialize\.outcome == 'success' && steps\.operations-data\.outcome == 'success'/u.test(persistent)) {
  problems.push("persistent workflow pre-commit gate is not owned by V4 materialization and operations data");
}
if (/pre-commit-gate[\s\S]{0,400}(?:business-frontstage|card-editorial|pool-to-card)/u.test(persistent)) {
  problems.push("persistent pre-commit gate still depends on a retired compatibility stage");
}

const monitor = read("agent-workflow/tools/run-guanlan-daily-monitor.mjs");
if (/writeFile\([^)]*(?:raw-candidates|pool-candidates)\.md/u.test(monitor)) {
  problems.push("source monitor still writes candidate Markdown");
}
if (!monitor.includes("buildSourceIntake") || !monitor.includes("sourceIntakePath")) {
  problems.push("source monitor does not write structured SourceArtifact / RawDocument intake");
}
if (/01-Signal-Cards|existingFormalCardSourceItems/u.test(monitor)) {
  problems.push("source monitor still discovers compatibility Cards");
}
if (monitor.includes("resetGeneratedDir(originalDir")) {
  problems.push("source monitor still deletes same-date immutable source snapshots on rerun");
}
if (!monitor.includes("fs.readdirSync(originalDir)")) {
  problems.push("source monitor does not carry existing same-date snapshots into structured intake");
}

const builder = read("agent-workflow/tools/build-data-center-v4.mjs");
if (!builder.includes("loadSourceIntakeEntries")) {
  problems.push("Data Center V4 builder does not consume structured source intake");
}

const schema = JSON.parse(read("agent-workflow/product/data-center-v4.schema.json"));
if ("compatibility_cards" in (schema.properties || {}) || "compatibilityCard" in (schema.$defs || {})) {
  problems.push("compatibility_cards remains in the retired V4 schema surface");
}
if (/compatibility_cards|compatibilityCardType/u.test(builder)) {
  problems.push("Data Center V4 builder still emits the retired compatibility projection");
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  policy: "SITE-V4.3.0-compatibility-retired",
  workflows_checked: workflows.length,
  problems,
}, null, 2));
if (problems.length) process.exit(1);
