#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");
const file = path.join(reportsDir, `${date}-github-automation-readiness-report.md`);

const steps = [
  ["Run Raw / Pool monitor with QC", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"],
  ["Confirm Raw / Pool counts and stale state", "agent-workflow/tools/assert-daily-production-chain.mjs"],
  ["Generate qualified Signal Card assets and frontstage Cards", "agent-workflow/tools/generate-asset-cards-from-pool.mjs"],
  ["Run Pool-to-Card duplicate gate", "agent-workflow/tools/assert-pool-to-card-dedupe.mjs"],
  ["Build V3 data observation desk", "01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs"],
  ["Build Opportunity Map projection from accepted Signal Cards", "01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs"],
  ["Sync operations dashboard data", "01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs"],
];

function exists(target) {
  return fs.existsSync(path.join(root, target));
}

const missing = steps.filter(([, script]) => !exists(script));
const status = missing.length ? "blocked_missing_scripts" : "ready_for_v3_asset_chain";

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(file, [
  `# ${date} GitHub Automation Readiness Report`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  `- status: ${status}`,
  "- current_chain: V4 factual core plus internal Raw / Pool / Signal Card compatibility adapters",
  "- active_outputs: V4 canonical facts, Raw candidates, Pool evidence, Signal Card assets, relationship graph inputs, and the Opportunity Map projection",
  "- frontstage_goal: update V4 pages and the source-backed Opportunity Map projection after PR merge",
  "",
  "## Step Readiness",
  "",
  "| Step | Status | Script |",
  "|---|---|---|",
  ...steps.map(([name, script]) => `| ${name} | ${exists(script) ? "ready" : "missing"} | \`${script}\` |`),
  "",
  "## Required Gates",
  "",
  "- Raw / Pool count and historical duplicate gate.",
  "- Pool-to-Card duplicate gate.",
  "- V3 source-first frontstage gate.",
  "- Frontstage regression gate.",
  "- Pre-commit gate before PR update.",
  "",
  "## Current Boundaries",
  "",
  "- Only current Business Signals assets are executed in this chain.",
  "- Publishing uses source-first, frontstage regression, Pool-to-Card dedupe, and freshness gates.",
  "- No opinion / follow-builders material enters business-signal generation.",
  "- Card details must be generated from original source text, not old summaries or backend fields.",
  "- Trend candidates and no-decision shells are historical/manual research artifacts and are not part of daily production.",
  "",
  "## Missing / Blocked",
  "",
  ...(missing.length ? missing.map(([, script]) => `- Missing script: \`${script}\``) : ["- none"]),
  "",
].join("\n"), "utf8");

console.log(`Wrote ${path.relative(root, file).replace(/\\/g, "/")}`);
if (missing.length) process.exit(1);
