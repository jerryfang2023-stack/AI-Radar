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
  [node, ["--check", "agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "Business Signals pipeline policy syntax"],
  [node, ["--check", "agent-workflow/tools/assert-data-center-v4.mjs"], "Data Center V4 integrity gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-no-active-v3-compat.mjs"], "V3 retirement gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-compatibility-retirement.mjs"], "compatibility retirement gate syntax"],
  [node, ["--check", "agent-workflow/tools/run-business-signals-health-dispatch.mjs"], "Business Signals health dispatch syntax"],
  [node, ["--check", "agent-workflow/tools/classify-business-signals-production-state.mjs"], "Business Signals production-state syntax"],
  [node, ["--check", "agent-workflow/tools/frontstage-regression-gate.mjs"], "frontstage regression syntax"],
  [node, ["--check", "agent-workflow/tools/assert-current-rule-hygiene.mjs"], "current rule hygiene syntax"],
  [node, ["--check", "agent-workflow/tools/assert-tag-taxonomy-v4.mjs"], "TAG-V4 quality gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-follow-builders-data.mjs"], "first-line data gate syntax"],
  [node, ["--check", "agent-workflow/tools/assert-community-intelligence-data.mjs"], "community data gate syntax"],
  [node, ["--check", "01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs"], "Data Center V4 builder syntax"],
  [node, ["--check", "01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs"], "Opportunity Map builder syntax"],
  [node, ["--check", "01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs"], "operations data sync syntax"],
  [node, ["--check", "01-SiteV2/site/assets/data-center-v4.js"], "Data Center V4 frontstage JS syntax"],
  [node, ["--check", "01-SiteV2/site/assets/v4-report-shell.js"], "V4 report shell JS syntax"],
];

const commandSets = {
  syntax: syntaxCommands,
  site: [
    [node, ["--check", "01-SiteV2/site/assets/data-center-v4.js"], "Data Center V4 frontstage JS syntax"],
    [node, ["--check", "01-SiteV2/site/assets/v4-report-shell.js"], "V4 report shell JS syntax"],
    [node, ["--check", "01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs"], "Data Center V4 builder syntax"],
    [node, ["--check", "01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs"], "Opportunity Map builder syntax"],
  ],
  automation: [
    [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor.mjs"], "daily monitor syntax"],
    [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"], "daily monitor with qc syntax"],
    [node, ["--check", "agent-workflow/tools/guanlan-monitor-quality-gate.mjs"], "monitor quality gate syntax"],
    [node, ["--check", "agent-workflow/tools/assert-daily-production-chain.mjs"], "daily production chain syntax"],
    [node, ["--check", "agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "Business Signals pipeline policy syntax"],
    [node, ["agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "Business Signals pipeline policy"],
    [node, ["agent-workflow/tools/assert-no-active-v3-compat.mjs"], "V3 retirement gate"],
    [node, ["agent-workflow/tools/assert-compatibility-retirement.mjs"], "compatibility retirement gate"],
    [node, ["--check", "agent-workflow/tools/run-business-signals-health-dispatch.mjs"], "Business Signals health dispatch syntax"],
    [node, ["--check", "agent-workflow/tools/classify-business-signals-production-state.mjs"], "Business Signals production-state syntax"],
    [node, ["--check", "agent-workflow/tools/frontstage-regression-gate.mjs"], "frontstage regression syntax"],
  ],
  business: [
    [node, ["agent-workflow/tools/assert-data-center-v4.mjs", `--date=${date}`], "run Data Center V4 integrity gate"],
    [node, ["agent-workflow/tools/assert-daily-production-chain.mjs", `--date=${date}`, "--stage=pre-commit", "--block-stale=true"], "run daily production chain pre-commit gate"],
  ],
  regression: [
    [node, ["agent-workflow/tools/assert-business-signals-pipeline-policy.mjs"], "run Business Signals pipeline policy regression"],
    [node, ["agent-workflow/tools/assert-compatibility-retirement.mjs"], "run compatibility retirement gate"],
    [node, ["agent-workflow/tools/run-business-signals-health-dispatch.mjs", "--policy-fixtures=true"], "run Business Signals health-state fixtures"],
    [node, ["agent-workflow/tools/classify-business-signals-production-state.mjs", "--fixtures=true"], "run Business Signals production-state fixtures"],
    [node, ["agent-workflow/tools/assert-no-active-v3-compat.mjs"], "run V3 retirement regression"],
    [node, ["agent-workflow/tools/frontstage-regression-gate.mjs", `--date=${date}`], "run frontstage regression gate"],
  ],
  tags: [
    [node, ["--check", "agent-workflow/tools/assert-tag-taxonomy-v4.mjs"], "TAG-V4 quality gate syntax"],
    [node, ["agent-workflow/tools/assert-tag-taxonomy-v4.mjs"], "run TAG-V4 taxonomy gate"],
    [node, ["agent-workflow/tools/assert-data-center-v4.mjs", `--date=${date}`], "run TAG-V4 Data Center integrity gate"],
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
    "- SITE-V4.3.0 public frontstage and production are V4-native.",
    "- V1/V2/V3 compatibility producers, payloads, and gates are retired.",
    "- Use Data Center V4 integrity, materialization, application projection, and frontstage gates.",
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
