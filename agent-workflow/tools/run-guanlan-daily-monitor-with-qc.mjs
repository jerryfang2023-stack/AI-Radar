import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { runGuanlanMonitorQualityGate } from "./guanlan-monitor-quality-gate.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");
const configPath = args.get("quality-config") || path.join(root, "01-SiteV2", "content", "11-databases", "business-signals-gate-v3.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const limits = config.monitor_limits || {};
const diagnosticScoreReference = Number(args.get("pass-score") || config.diagnostic_score_reference || 85);
const monitorTimeoutMs = Math.max(60_000, Number(args.get("monitor-timeout-ms") || 900_000));
const node = process.platform === "win32" ? "node" : process.execPath;

function numberArg(name, fallback) {
  const value = Number(args.get(name));
  return Number.isFinite(value) ? value : fallback;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function parseMonitorJson(stdout = "") {
  const content = String(stdout || "").trim();
  if (!content) return {};
  try {
    return JSON.parse(content);
  } catch {
    const start = content.lastIndexOf("\n{");
    if (start < 0) return {};
    try {
      return JSON.parse(content.slice(start + 1));
    } catch {
      return {};
    }
  }
}

function readLogValue(key) {
  const file = path.join(reportsDir, `${date}-guanlan-daily-monitor-log.md`);
  if (!fs.existsSync(file)) return "unknown";
  const match = fs.readFileSync(file, "utf8").match(new RegExp(`^- ${key}:\\s*(.*)$`, "mu"));
  return match?.[1]?.trim() || "unknown";
}

function monitorArgs() {
  const values = [
    ["search-limit", numberArg("search-limit", Number(limits.search_limit || 200))],
    ["search-path-query-limit", numberArg("search-path-query-limit", Number(limits.search_path_query_limit || 5))],
    ["gdelt-query-limit", numberArg("gdelt-query-limit", Number(limits.gdelt_query_limit || 12))],
    ["hn-limit", numberArg("hn-limit", Number(limits.hn_limit || 8))],
    ["raw-dedupe-buffer", numberArg("raw-dedupe-buffer", Number(limits.raw_dedupe_buffer || 140))],
    ["raw-max", numberArg("raw-max", Number(limits.raw_max || 360))],
    ["fetch-timeout-ms", numberArg("fetch-timeout-ms", 20_000)],
    ["snapshot-timeout-ms", numberArg("snapshot-timeout-ms", 16_000)],
  ];
  const result = [`--date=${date}`, ...values.map(([key, value]) => `--${key}=${value}`)];
  for (const passthrough of ["raw-min", "raw-target"]) {
    if (args.has(passthrough)) result.push(`--${passthrough}=${args.get(passthrough)}`);
  }
  if (args.get("use-source-artifacts") === "true" || args.has("source-artifact-dir")) result.push("--use-source-artifacts=true");
  if (args.has("source-artifact-dir")) result.push(`--source-artifact-dir=${args.get("source-artifact-dir")}`);
  return result;
}

function writeReport(result) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${date}-guanlan-daily-monitor-quality-loop.md`);
  const latestPath = path.join(reportsDir, "guanlan-daily-monitor-quality-loop-latest.md");
  const attempt = result.cycles[0];
  const text = [
    `# ${date} Guanlan Monitor Quality Loop`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- status: ${result.status}`,
    `- diagnostic_score_reference: ${diagnosticScoreReference}`,
    "- score_mode: diagnostic_only",
    "- max_cycles: 1",
    "- final_cycle: 1",
    `- manual_intervention_required: ${result.manualInterventionRequired}`,
    `- downstream_action: ${result.downstreamAction || "none"}`,
    `- downstream_reasons: ${(result.downstreamReasons || []).join(" | ") || "none"}`,
    "",
    "## Single Monitor Attempt",
    "",
    `- monitor_status: ${attempt.monitorStatus}`,
    `- failed_stage: ${attempt.monitorStage}`,
    `- monitor_raw_count: ${attempt.monitorRawCount}`,
    `- quality_status: ${attempt.qualityStatus}`,
    `- quality_score: ${attempt.qualityScore}`,
    `- hard_failed: ${attempt.hardFailed.join(", ") || "none"}`,
    `- failed_sources: ${attempt.failedSources}`,
    `- fallback_used: ${attempt.fallbackUsed}`,
    `- evidence_gaps: ${attempt.evidenceGaps}`,
    `- report: ${attempt.qualityReport ? rel(attempt.qualityReport) : "missing"}`,
    "",
    "## Retry Policy",
    "",
    "- The production wrapper does not recollect all source lanes or rerun the full monitor automatically.",
    "- Supply diagnostics remain in the report. A hard evidence-supply failure routes to targeted repair.",
    "",
  ].join("\n");
  fs.writeFileSync(reportPath, `${text}\n`, "utf8");
  fs.writeFileSync(latestPath, `${text}\n`, "utf8");
  return reportPath;
}

function main() {
  const commandArgs = ["agent-workflow/tools/run-guanlan-daily-monitor.mjs", ...monitorArgs()];
  const run = spawnSync(node, commandArgs, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    timeout: monitorTimeoutMs,
    killSignal: "SIGTERM",
    shell: false,
  });
  const timedOut = Boolean(run.error && (String(run.error.code || "").toUpperCase() === "ETIMEDOUT" || /timed out/iu.test(String(run.error.message || ""))));
  const parsed = parseMonitorJson(run.stdout || "");
  const quality = runGuanlanMonitorQualityGate({ date, configPath, passScore: diagnosticScoreReference, attempt: 1, maxAttempts: 1 });
  const monitorStatus = run.status === 0 ? "collected" : timedOut ? "timeout" : "failed";
  const hardFailed = Array.isArray(quality.hard_failed) ? quality.hard_failed.map((item) => item.key) : [];
  const passed = run.status === 0 && quality.passed;
  const result = {
    date,
    status: passed ? "passed" : "failed",
    diagnosticScoreReference,
    maxCycles: 1,
    finalCycle: 1,
    manualInterventionRequired: !passed,
    cycles: [{
      cycle: 1,
      monitorStatus,
      monitorRawCount: Number(parsed.raw_count || quality.metrics?.raw_count || 0),
      qualityStatus: quality.status,
      qualityScore: quality.total_score,
      hardFailed,
      qualityReport: quality.report_path,
      monitorArgs: commandArgs.slice(1),
      monitorFailure: run.status === 0 ? "" : String(run.stderr || run.error?.message || "monitor command failed").trim(),
      monitorStage: run.status === 0 ? "completed" : timedOut ? "monitor_collection_timeout" : "monitor_collection_failed",
      evidenceGaps: quality.metrics?.importance_coverage_gaps || "unknown",
      fallbackUsed: readLogValue("fallback_used"),
      failedSources: readLogValue("failed_sources"),
    }],
    skillFeedback: quality.skill_feedback || [],
    downstreamAction: quality.downstream?.action || "",
    downstreamReasons: quality.downstream?.reasons || [],
  };
  const reportPath = writeReport(result);
  console.log(JSON.stringify({ ...result, reportPath: rel(reportPath) }, null, 2));
  console.log(`Report: ${rel(reportPath)}`);
  if (!passed) process.exit(2);
}

main();
