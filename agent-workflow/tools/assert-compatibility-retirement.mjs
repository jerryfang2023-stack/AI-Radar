#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contractFile = path.join(root, "agent-workflow/product/compatibility-retirement-v1.json");
const problems = [];

function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    problems.push(`missing required file: ${relative}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function publicPageFiles() {
  const site = path.join(root, "01-SiteV2/site");
  if (!fs.existsSync(site)) return [];
  return fs.readdirSync(site)
    .filter((name) => name.endsWith(".html"))
    .map((name) => path.join(site, name));
}

const contractText = read("agent-workflow/product/compatibility-retirement-v1.json");
let contract = {};
try {
  contract = JSON.parse(contractText);
} catch (error) {
  problems.push(`invalid compatibility retirement contract: ${error.message}`);
}

if (contract.schema_version !== "COMPATIBILITY-RETIREMENT-V1.0") {
  problems.push(`unexpected compatibility retirement schema: ${contract.schema_version || "missing"}`);
}

const assets = new Map((contract.assets || []).map((asset) => [asset.id, asset]));
for (const id of [
  "raw_pool_card",
  "v3_data_observation_desk",
  "intelligence_graph_index",
  "v3_relationship_graph",
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
  if (!asset.current_consumers?.length && asset.status !== "deprecated_non_blocking") {
    problems.push(`${id} has no named current consumers`);
  }
  if (!asset.exit_conditions?.length) problems.push(`${id} has no exit conditions`);
}

const retiredTrend = assets.get("trend_candidates") || {};
if (retiredTrend.status !== "manual_archive") {
  problems.push("trend_candidates must remain manual_archive");
}
for (const file of contract.daily_execution_files || []) {
  const text = read(file);
  for (const pattern of retiredTrend.forbidden_in_daily_execution || []) {
    if (text.includes(pattern)) problems.push(`${file} still contains retired daily trend pattern: ${pattern}`);
  }
}

const opportunityBuilder = read("01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs");
if (opportunityBuilder.includes("v3-data-observation-desk.json")) {
  problems.push("Opportunity Map projection still reads the V3 desk");
}
if (!opportunityBuilder.includes("opportunity-evidence-v2.mjs")) {
  problems.push("Opportunity Map projection does not declare its V4 CanonicalEvent/Claim adapter");
}
if (opportunityBuilder.includes("01-SiteV2/knowledge/01-Signal-Cards")) {
  problems.push("Opportunity Map projection still reads accepted Signal Cards");
}

const periodicController = read("agent-workflow/tools/run-periodic-automation-controller.mjs");
if (periodicController.includes("\"01-SiteV2/site/data/v3-data-observation-desk.json\"")) {
  problems.push("periodic report controller still allows V3 desk changes");
}
if (periodicController.includes("\"01-SiteV2/site/data/intelligence-graph-index.json\"")) {
  problems.push("periodic report controller still allows legacy intelligence graph changes");
}

const pagesWorkflow = read(".github/workflows/github-pages.yml");
for (const internal of [
  "data/v3-data-observation-desk.json",
  "data/intelligence-graph-index.json",
]) {
  if (!pagesWorkflow.includes(`--exclude="${internal}"`)) {
    problems.push(`GitHub Pages does not exclude internal compatibility dataset: ${internal}`);
  }
}

const publicFetchPattern = /fetch\(\s*["']data\/(?:v3-data-observation-desk|intelligence-graph-index)\.json["']/u;
for (const file of publicPageFiles()) {
  const text = fs.readFileSync(file, "utf8");
  if (publicFetchPattern.test(text)) {
    problems.push(`${path.relative(root, file).replace(/\\/gu, "/")} fetches an internal compatibility dataset`);
  }
}

const result = {
  ok: problems.length === 0,
  schema_version: contract.schema_version || null,
  assets: assets.size,
  retired_daily_modules: [...assets.values()].filter((asset) => asset.status === "manual_archive").map((asset) => asset.id),
  problems,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
