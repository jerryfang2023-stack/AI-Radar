#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const problems = [];

const retiredCommands = [
  "generate-asset-cards-from-pool.mjs",
  "assert-pool-to-card-generation.mjs",
  "assert-business-signals-editorial.mjs",
  "build-v3-data-observation-desk.mjs",
  "assert-business-signals-frontstage.mjs",
  "assert-business-signals-compatibility-contract.mjs",
  "build-legacy-card-event-mappings.mjs",
];

const retiredActivePaths = [
  "01-SiteV2/knowledge/01-Signal-Cards",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/intelligence-graph-index.json",
  "01-SiteV2/content/11-databases/data-center-v4/legacy-card-event-mappings.json",
  "01-SiteV2/content/11-databases/data-center-v4/legacy-card-event-mappings.md",
  "01-SiteV2/site/data/site-content.json",
  "01-SiteV2/site/data/site-content.js",
];
const retiredBasenames = [
  "01-Signal-Cards",
  "v3-data-observation-desk.json",
  "intelligence-graph-index.json",
  "legacy-card-event-mappings.json",
  "legacy-card-event-mappings.md",
  "site-content.json",
  "site-content.js",
];

const requiredArchivePaths = [
  "archive/v3-compat/README.md",
  "archive/v3-compat/signal-cards",
  "archive/v3-compat/frontstage/v3-data-observation-desk.json",
  "archive/v3-compat/frontstage/intelligence-graph-index.json",
  "archive/v3-compat/legacy-mappings/legacy-card-event-mappings.json",
  "archive/v3-compat/legacy-mappings/legacy-card-event-mappings.md",
  "archive/v3-compat/frontstage/site-content.json",
  "archive/v3-compat/frontstage/site-content.js",
];

function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    problems.push(`missing required file: ${relative}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function filesUnder(relative, extensions) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return extensions.has(path.extname(target)) ? [target] : [];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "archive") return [];
    const child = path.join(target, entry.name);
    return entry.isDirectory()
      ? filesUnder(path.relative(root, child), extensions)
      : extensions.has(path.extname(entry.name)) ? [child] : [];
  });
}

for (const relative of retiredActivePaths) {
  if (fs.existsSync(path.join(root, relative))) problems.push(`retired asset remains active: ${relative}`);
}
for (const relative of requiredArchivePaths) {
  if (!fs.existsSync(path.join(root, relative))) problems.push(`retired asset is not in the read-only archive: ${relative}`);
}

const workflowFiles = filesUnder(".github/workflows", new Set([".yml", ".yaml"]));
for (const file of workflowFiles) {
  const relative = path.relative(root, file).replace(/\\/gu, "/");
  const text = fs.readFileSync(file, "utf8");
  for (const command of retiredCommands) {
    if (text.includes(command)) problems.push(`${relative} invokes retired producer: ${command}`);
  }
  if (relative !== ".github/workflows/github-pages.yml") {
    for (const retiredName of retiredBasenames) {
      if (text.includes(retiredName)) problems.push(`${relative} references retired active asset: ${retiredName}`);
    }
  }
}

const packageText = read("package.json");
for (const command of retiredCommands) {
  if (packageText.includes(command)) problems.push(`package.json exposes retired producer: ${command}`);
}

const productionTools = [
  "agent-workflow/tools/run-guanlan-daily-monitor.mjs",
  "agent-workflow/tools/build-data-center-v4.mjs",
  "agent-workflow/tools/assert-daily-production-chain.mjs",
  "agent-workflow/tools/write-daily-supervision-report.mjs",
  "agent-workflow/tools/run-business-signals-health-dispatch.mjs",
  "agent-workflow/tools/write-automation-readiness-report.mjs",
  "agent-workflow/tools/sync-local-obsidian-assets.mjs",
  "agent-workflow/tools/build-data-center-v4-obsidian-index.mjs",
  "agent-workflow/tools/backfill-source-title-translations.mjs",
];
for (const relative of productionTools) {
  const text = read(relative);
  for (const retiredName of retiredBasenames) {
    if (text.includes(retiredName)) problems.push(`${relative} references retired active asset: ${retiredName}`);
  }
}

const publicPages = filesUnder("01-SiteV2/site", new Set([".html"]))
  .filter((file) => !/(?:weekly-ai-business-change-radar-\d{4}-\d{2}-\d{2}|monthly-business-structure-\d{4}-\d{2})\.html$/u.test(file));
const publicFetch = /(?:fetch|loadJson)\(\s*["']data\/(?:v3-data-observation-desk|intelligence-graph-index)\.json["']/u;
const publicV3Copy = /01-Signal-Cards|Raw\s*(?:→|->)\s*Pool|Signal Cards?/iu;
for (const file of publicPages) {
  const text = fs.readFileSync(file, "utf8");
  if (publicFetch.test(text)) {
    problems.push(`${path.relative(root, file).replace(/\\/gu, "/")} loads a retired V3 dataset`);
  }
  if (publicV3Copy.test(text)) {
    problems.push(`${path.relative(root, file).replace(/\\/gu, "/")} exposes retired V3 production copy`);
  }
}

const monitor = read("agent-workflow/tools/run-guanlan-daily-monitor.mjs");
for (const candidate of ["-raw-candidates.md", "-pool-candidates.md"]) {
  if (monitor.includes(candidate)) problems.push(`daily monitor still writes compatibility candidate Markdown: ${candidate}`);
}
if (!monitor.includes("source-intake-v1.mjs")) {
  problems.push("daily monitor does not write SOURCE-INTAKE-V1");
}

const pages = read(".github/workflows/github-pages.yml");
if (!pages.includes("01-SiteV2/site")) problems.push("Pages source is not restricted to the site directory");
if (pages.includes("archive/v3-compat")) problems.push("Pages workflow discovers the V3 archive");

const schema = JSON.parse(read("agent-workflow/product/data-center-v4.schema.json") || "{}");
if ((schema.required || []).includes("compatibility_cards")) {
  problems.push("compatibility_cards remains required by the V4 schema");
}
const compatibility = schema.properties?.compatibility_cards;
if (!compatibility?.deprecated || !compatibility?.readOnly) {
  problems.push("compatibility_cards must remain read-only and deprecated during the observation release");
}

const result = {
  ok: problems.length === 0,
  schema_version: "NO-ACTIVE-V3-COMPAT-V1.0",
  active_v3_consumers: problems.filter((problem) => problem.includes("references retired") || problem.includes("invokes retired")).length,
  archived_assets_checked: requiredArchivePaths.length,
  problems,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
