#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const problems = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");
const workflows = [
  ".github/workflows/funding-daily-pr.yml",
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
}

const producer = read("agent-workflow/financing/run.mjs");
const collector = read("agent-workflow/financing/collect.mjs");
const checkpoint = read("agent-workflow/financing/checkpoint.mjs");
const financing = read(workflows[0]);
for (const text of [producer, collector, financing]) {
  if (/run-guanlan-daily-monitor|run-china-funding-pipeline|classify-business-signals-production-state/u.test(text)) {
    problems.push("current financing execution depends on a retired monitor/controller");
  }
}
if (!collector.includes("buildSourceIntake") || !collector.includes("mergeSourceIntakes")) {
  problems.push("financing collector must persist structured intake and preserve accepted same-date evidence");
}
if (!checkpoint.includes("/intake-v1/${date}.json") || !financing.includes("manifest.entries")) {
  problems.push("financing publication must persist accepted intake through its checked manifest");
}
if (!financing.includes("steps.produce.outcome == 'success'") || !producer.includes("release_gate")) {
  problems.push("financing publication must follow successful production gates");
}
if (!financing.includes("wait-for-production-code-checks.mjs") || !financing.includes('--match-head-commit "$merge_head"')) {
  problems.push("financing merge must require current-head production checks");
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
