#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const problems = [];

function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    problems.push(`missing required file: ${relative}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

let contract = {};
try {
  contract = JSON.parse(read("agent-workflow/product/compatibility-retirement-v1.json"));
} catch (error) {
  problems.push(`invalid compatibility retirement contract: ${error.message}`);
}

if (contract.schema_version !== "COMPATIBILITY-RETIREMENT-V1.0") {
  problems.push(`unexpected compatibility retirement schema: ${contract.schema_version || "missing"}`);
}
if (contract.release !== "SITE-V4.3.0-compatibility-retired") {
  problems.push(`unexpected compatibility retirement release: ${contract.release || "missing"}`);
}
if (contract.observation?.state !== "superseded_by_explicit_retirement") {
  problems.push("compatibility observation exception is not recorded");
}
if (!String(contract.observation?.final_interface_removal || "").includes("explicit user-directed")) {
  problems.push("early final-interface removal must record explicit user direction");
}

const assets = new Map((contract.assets || []).map((asset) => [asset.id, asset]));
for (const id of [
  "raw_pool_card",
  "v3_data_observation_desk",
  "intelligence_graph_index",
  "v3_relationship_graph",
  "v3_frontstage_site_content",
  "trend_candidates",
  "opportunity_map_projection",
  "industry_reports",
  "trend_radar",
]) {
  const asset = assets.get(id);
  if (!asset) {
    problems.push(`missing compatibility asset decision: ${id}`);
    continue;
  }
  for (const field of ["status", "module", "interface", "implementation", "replacement"]) {
    if (!String(asset[field] || "").trim()) problems.push(`${id} is missing ${field}`);
  }
  if (!Array.isArray(asset.current_consumers)) problems.push(`${id} current_consumers must be an array`);
  if (!asset.exit_conditions?.length) problems.push(`${id} has no exit conditions`);
}

for (const id of ["raw_pool_card", "v3_data_observation_desk", "intelligence_graph_index", "v3_relationship_graph", "v3_frontstage_site_content", "trend_candidates"]) {
  const asset = assets.get(id);
  if (asset?.status !== "retired_git_history") problems.push(`${id} must be retired_git_history`);
  if (asset?.current_consumers?.length) problems.push(`${id} still has active consumers`);
}

const retiredTrend = assets.get("trend_candidates") || {};
for (const file of contract.daily_execution_files || []) {
  const text = read(file);
  for (const pattern of retiredTrend.forbidden_in_daily_execution || []) {
    if (text.includes(pattern)) problems.push(`${file} contains retired daily trend pattern: ${pattern}`);
  }
}

const opportunityBuilder = read("01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs");
for (const forbidden of ["v3-data-observation-desk.json", "01-SiteV2/knowledge/01-Signal-Cards"]) {
  if (opportunityBuilder.includes(forbidden)) problems.push(`Opportunity Map still references ${forbidden}`);
}
if (!opportunityBuilder.includes("opportunity-evidence-v2.mjs")) {
  problems.push("Opportunity Map does not declare the V4 evidence adapter");
}

const noActiveGate = spawnSync(
  process.execPath,
  [path.join(root, "agent-workflow/tools/assert-no-active-v3-compat.mjs")],
  { cwd: root, encoding: "utf8", shell: false },
);
if (noActiveGate.status !== 0) {
  problems.push(`no-active-v3 gate failed: ${(noActiveGate.stderr || noActiveGate.stdout).trim()}`);
}

const result = {
  ok: problems.length === 0,
  schema_version: contract.schema_version || null,
  release: contract.release || null,
  assets: assets.size,
  observation: contract.observation || null,
  problems,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
