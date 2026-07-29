#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");
const file = path.join(reportsDir, `${date}-github-automation-readiness-report.md`);
const steps = [
  ["Collect structured source intake", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"],
  ["Gate SourceArtifact / RawDocument intake", "agent-workflow/tools/assert-daily-production-chain.mjs"],
  ["Build the Data Center V4 factual bundle", "agent-workflow/tools/build-data-center-v4.mjs"],
  ["Run the V4 integrity gate", "agent-workflow/tools/assert-data-center-v4.mjs"],
  ["Materialize V4 serving tables", "agent-workflow/tools/sync-light-data-lake.mjs"],
  ["Build Opportunity Map projection", "01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs"],
  ["Build Trend Radar projection", "01-SiteV2/site/scripts/build-trend-radar-frontstage.mjs"],
  ["Build Funding Insights projection", "01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs"],
  ["Sync operations data", "01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs"],
  ["Assert compatibility writers remain disabled", "agent-workflow/tools/assert-no-active-v3-compat.mjs"],
];
const exists = (target) => fs.existsSync(path.join(root, target));
const missing = steps.filter(([, script]) => !exists(script));
const status = missing.length ? "blocked_missing_scripts" : "ready_for_v4_native_chain";

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(file, [
  `# ${date} GitHub Automation Readiness Report`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  `- status: ${status}`,
  "- current_chain: structured intake -> V4 factual core -> application projections -> operations -> publication",
  "- compatibility_write: disabled",
  "- compatibility_archive: read_only",
  "",
  "## Step Readiness",
  "",
  "| Step | Status | Script |",
  "|---|---|---|",
  ...steps.map(([name, script]) => `| ${name} | ${exists(script) ? "ready" : "missing"} | \`${script}\` |`),
  "",
  "## Required Gates",
  "",
  "- Structured intake integrity and historical duplicate gate.",
  "- V4 Claim, Event, Entity, relationship, and materialization gates.",
  "- Opportunity Map, Trend Radar, and Funding Insights projection gates.",
  "- Operations telemetry and final pre-commit gate.",
  "- No active compatibility writer or consumer.",
  "",
  "## Boundaries",
  "",
  "- First-line viewpoints and community material remain independent from canonical facts.",
  "- Archived compatibility data is read-only and cannot be discovered by production.",
  "- Historical report HTML is immutable.",
  "",
  "## Missing / Blocked",
  "",
  ...(missing.length ? missing.map(([, script]) => `- Missing script: \`${script}\``) : ["- none"]),
  "",
].join("\n"), "utf8");
console.log(`Wrote ${path.relative(root, file).replace(/\\/gu, "/")}`);
if (missing.length) process.exit(1);
