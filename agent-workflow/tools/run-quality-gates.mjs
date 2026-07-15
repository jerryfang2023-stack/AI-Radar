#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const rawArgs = process.argv.slice(2);
const mode = rawArgs.find((arg) => !arg.startsWith("--")) || "syntax";
const flags = new Map(
  rawArgs
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || "true"];
    })
);

const reportsDir = path.join(root, "agent-workflow", "reports");
const now = new Date();
const date = flags.get("date") || now.toISOString().slice(0, 10);
const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
const node = process.platform === "win32" ? "node" : process.execPath;
const rel = (file) => path.relative(root, file).replace(/\\/gu, "/");

const knownModes = new Set(["syntax", "site", "automation", "business", "regression", "tags", "rules", "all"]);

if (!knownModes.has(mode)) {
  console.error(`Unknown quality gate mode: ${mode}`);
  console.error(`Use one of: ${[...knownModes].join(", ")}`);
  process.exit(1);
}

const syntaxCommands = [
  [node, ["--check", "agent-workflow/tools/run-quality-gates.mjs"], "run-quality-gates syntax"],
  [node, ["--check", "agent-workflow/tools/guanlan-monitor-quality-gate.mjs"], "monitor quality gate syntax"],
  [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor.mjs"], "daily monitor syntax"],
  [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"], "daily monitor with qc syntax"],
  [node, ["--check", "agent-workflow/tools/assert-daily-production-chain.mjs"], "daily production chain syntax"],
  [node, ["--check", "agent-workflow/tools/generate-asset-cards-from-pool.mjs"], "asset card generation syntax"],
  [node, ["--check", "agent-workflow/tools/assert-pool-to-card-dedupe.mjs"], "pool-to-card dedupe syntax"],
  [node, ["--check", "agent-workflow/tools/assert-business-signals-frontstage.mjs"], "business frontstage gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-business-signals-three-block-contract.mjs"], "Business Signals three-block contract syntax"],
  [node, ["--check", "agent-workflow/tools/assert-signal-card-editorial-quality.mjs"], "signal Card editorial gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "Business Signals pipeline policy syntax"],
  [node, ["--check", "agent-workflow/tools/run-business-signals-health-dispatch.mjs"], "Business Signals health dispatch syntax"],
  [node, ["--check", "agent-workflow/tools/classify-business-signals-production-state.mjs"], "Business Signals production-state syntax"],
  [node, ["--check", "agent-workflow/tools/assert-v3-source-first-frontstage.mjs"], "source-first frontstage syntax"],
  [node, ["--check", "agent-workflow/tools/frontstage-regression-gate.mjs"], "frontstage regression syntax"],
  [node, ["--check", "agent-workflow/tools/assert-current-rule-hygiene.mjs"], "current rule hygiene syntax"],
  [node, ["--check", "agent-workflow/tools/check-tags.mjs"], "tag quality gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-follow-builders-data.mjs"], "first-line data gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-community-intelligence-data.mjs"], "community data gate syntax"],
  [node, ["--check", "01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs"], "business frontstage builder syntax"],
  [node, ["--check", "01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs"], "operations data sync syntax"],
  [node, ["--check", "01-SiteV2/site/assets/v3-data-observation-desk.js"], "business frontstage JS syntax"],
  [node, ["--check", "01-SiteV2/site/assets/follow-builders.js"], "first-line frontstage JS syntax"],
  [node, ["--check", "01-SiteV2/site/assets/community-intelligence.js"], "community frontstage JS syntax"],
];

const commandSets = {
  syntax: syntaxCommands,
  site: [
    [node, ["--check", "01-SiteV2/site/assets/v3-data-observation-desk.js"], "business frontstage JS syntax"],
    [node, ["--check", "01-SiteV2/site/assets/follow-builders.js"], "first-line frontstage JS syntax"],
    [node, ["--check", "01-SiteV2/site/assets/community-intelligence.js"], "community frontstage JS syntax"],
    [node, ["--check", "01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs"], "business frontstage builder syntax"],
  ],
  automation: [
    [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor.mjs"], "daily monitor syntax"],
    [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"], "daily monitor with qc syntax"],
    [node, ["--check", "agent-workflow/tools/guanlan-monitor-quality-gate.mjs"], "monitor quality gate syntax"],
    [node, ["--check", "agent-workflow/tools/assert-daily-production-chain.mjs"], "daily production chain syntax"],
    [node, ["--check", "agent-workflow/tools/generate-asset-cards-from-pool.mjs"], "asset card generation syntax"],
    [node, ["--check", "agent-workflow/tools/assert-pool-to-card-dedupe.mjs"], "pool-to-card dedupe syntax"],
    [node, ["--check", "agent-workflow/tools/assert-business-signals-frontstage.mjs"], "business frontstage gate syntax"],
    [node, ["--check", "agent-workflow/tools/assert-business-signals-three-block-contract.mjs"], "Business Signals three-block contract syntax"],
    [node, ["--check", "agent-workflow/tools/assert-signal-card-editorial-quality.mjs"], "signal Card editorial gate syntax"],
    [node, ["--check", "agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "Business Signals pipeline policy syntax"],
    [node, ["agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "Business Signals pipeline policy"],
    [node, ["--check", "agent-workflow/tools/run-business-signals-health-dispatch.mjs"], "Business Signals health dispatch syntax"],
    [node, ["--check", "agent-workflow/tools/classify-business-signals-production-state.mjs"], "Business Signals production-state syntax"],
    [node, ["--check", "agent-workflow/tools/frontstage-regression-gate.mjs"], "frontstage regression syntax"],
  ],
  business: [
    [node, ["agent-workflow/tools/assert-business-signals-frontstage.mjs", `--date=${date}`], "run Business Signals frontstage gate"],
    [node, ["agent-workflow/tools/assert-daily-production-chain.mjs", `--date=${date}`, "--stage=pre-commit", "--block-stale=true"], "run daily production chain pre-commit gate"],
  ],
  regression: [
    [node, ["agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "run Business Signals pipeline policy regression"],
    [node, ["agent-workflow/tools/run-business-signals-health-dispatch.mjs", "--policy-fixtures=true"], "run Business Signals health-state fixtures"],
    [node, ["agent-workflow/tools/classify-business-signals-production-state.mjs", "--fixtures=true"], "run Business Signals production-state fixtures"],
    [node, ["agent-workflow/tools/generate-asset-cards-from-pool.mjs", "--date=2026-07-11", "--quality-regression-fixtures=true"], "run Business Signal Card editorial regression fixtures"],
    [node, ["agent-workflow/tools/frontstage-regression-gate.mjs", `--date=${date}`], "run frontstage regression gate"],
  ],
  tags: [
    [node, ["--check", "agent-workflow/tools/check-tags.mjs"], "tag quality gate syntax"],
    [node, ["agent-workflow/tools/check-tags.mjs"], "run tag quality gate"],
  ],
  rules: [
    [node, ["agent-workflow/tools/assert-current-rule-hygiene.mjs", `--date=${date}`], "run current rule hygiene gate"],
  ],
};

function buildCommands() {
  if (mode === "all") {
    return [
      ...commandSets.syntax,
      ...commandSets.rules,
      ...commandSets.regression,
      ...commandSets.tags,
    ];
  }
  return commandSets[mode] || [];
}

function runCommand([cmd, commandArgs, label]) {
  const startedAt = new Date();
  const target = commandArgs.find((arg) => /\.(mjs|js|json)$/iu.test(arg));
  if (target && !fs.existsSync(path.join(root, target))) {
    return {
      label,
      command: [cmd, ...commandArgs].join(" "),
      status: 1,
      stdout: "",
      stderr: `missing active target: ${target}`,
      startedAt,
      endedAt: new Date(),
    };
  }

  const result = spawnSync(cmd, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });

  return {
    label,
    command: [cmd, ...commandArgs].join(" "),
    status: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || result.error?.message || "",
    startedAt,
    endedAt: new Date(),
  };
}

function tail(text = "") {
  const lines = String(text)
    .trim()
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.slice(-6).join(" / ") || "-";
}

function writeReport(runs) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const failed = runs.filter((run) => run.status !== 0);
  const status = failed.length ? "failed" : "passed";
  const commandLines = runs
    .map((run, index) => [
      `### ${index + 1}. ${run.label}`,
      "",
      `- command: \`${run.command}\``,
      `- status: ${run.status === 0 ? "passed" : "failed"} (${run.status})`,
      `- stdout: ${tail(run.stdout)}`,
      `- stderr: ${tail(run.stderr)}`,
      "",
    ].join("\n"))
    .join("\n");

  const report = [
    "# Quality Gates Report",
    "",
    `- generated_at: ${now.toISOString()}`,
    `- mode: ${mode}`,
    `- date: ${date}`,
    `- status: ${status}`,
    `- check_count: ${runs.length}`,
    `- failed_count: ${failed.length}`,
    "",
    "## Checks",
    "",
    commandLines || "- none",
    "",
    "## Current Scope",
    "",
    "- SITE-V3.4.5 only.",
    "- Retired V1/V2 daily observation, business brief, publiccopy, cardcopy, writer-style, V2 typography, and V2 raw/source gates are not active quality gates.",
    "- Use Business Signals V3 monitor hard gates plus Card, source-first, frontstage, and freshness gates for the current production lane.",
    "",
  ].join("\n");

  const datedPath = path.join(reportsDir, `quality-gates-${mode}-${date}-${stamp}.md`);
  const latestPath = path.join(reportsDir, `quality-gates-${mode}-latest.md`);
  fs.writeFileSync(datedPath, report, "utf8");
  fs.writeFileSync(latestPath, report, "utf8");
  return { status, failed, report, datedPath };
}

const runs = buildCommands().map(runCommand);
const { status, failed, report, datedPath } = writeReport(runs);

console.log(report);
console.log(`Report: ${rel(datedPath)}`);

if (status !== "passed") {
  process.exitCode = failed[0]?.status || 1;
}
