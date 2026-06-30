import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { runGuanlanMonitorQualityGate } from "./guanlan-monitor-quality-gate.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");
const configPath =
  args.get("quality-config") ||
  path.join(root, "01-SiteV2", "content", "11-databases", "monitor-quality-gate-v2.json");
const config = (() => {
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    return {};
  }
})();

const diagnosticScoreReference = Number(args.get("pass-score") || config.diagnostic_score_reference || config.pass_score || 85);
const maxCycles = Math.max(1, Number(args.get("max-cycles") || config.max_retry_cycles || 3));
const monitorTimeoutMs = Math.max(60_000, Number(args.get("monitor-timeout-ms") || 420_000));
const sourceRefreshTimeoutMs = Math.min(monitorTimeoutMs, Math.max(60_000, Number(args.get("source-refresh-timeout-ms") || 420_000)));
const node = process.platform === "win32" ? "node" : process.execPath;
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

function toNumber(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function parseMonitorJson(stdout = "") {
  const content = String(stdout || "").trim();
  if (!content) return {};
  try {
    return JSON.parse(content);
  } catch {
    const index = content.lastIndexOf("{");
    if (index < 0) return {};
    try {
      return JSON.parse(content.slice(index));
    } catch {
      return {};
    }
  }
}

function buildMonitorArgsForCycle(cycle) {
  const retryTuning = config.retry_tuning || {};
  const searchLimitBase = toNumber(args.get("search-limit"), 150);
  const searchPathBase = toNumber(args.get("search-path-query-limit"), 5);
  const gdeltBase = toNumber(args.get("gdelt-query-limit"), 8);
  const hnBase = toNumber(args.get("hn-limit"), 8);
  const rawDedupeBufferBase = toNumber(args.get("raw-dedupe-buffer"), toNumber(retryTuning.raw_dedupe_buffer_base, 40));
  const rawMaxBase = toNumber(args.get("raw-max"), toNumber(retryTuning.raw_max_base, 220));
  const fetchTimeout = toNumber(args.get("fetch-timeout-ms"), 20000);
  const snapshotTimeout = toNumber(args.get("snapshot-timeout-ms"), 16000);
  const useSourceArtifacts = args.get("use-source-artifacts") === "true" || args.has("source-artifact-dir");
  const sourceArtifactDir = args.get("source-artifact-dir");
  const searchLimitStep = toNumber(retryTuning.search_limit_step, 10);
  const searchPathStep = toNumber(retryTuning.search_path_query_limit_step, 1);
  const gdeltStep = toNumber(retryTuning.gdelt_query_limit_step, 1);
  const hnStep = toNumber(retryTuning.hn_limit_step, 0);
  const rawDedupeBufferStep = toNumber(retryTuning.raw_dedupe_buffer_step, 0);
  const rawMaxStep = toNumber(retryTuning.raw_max_step, 0);
  const searchLimitMax = toNumber(retryTuning.search_limit_max, 220);
  const searchPathMax = toNumber(retryTuning.search_path_query_limit_max, 5);
  const gdeltMax = toNumber(retryTuning.gdelt_query_limit_max, 15);
  const hnMax = toNumber(retryTuning.hn_limit_max, 8);
  const rawDedupeBufferMax = toNumber(retryTuning.raw_dedupe_buffer_max, rawDedupeBufferBase);
  const rawMaxMax = toNumber(retryTuning.raw_max_max, rawMaxBase);

  const round = Math.max(0, cycle - 1);
  const searchLimit = Math.min(searchLimitMax, searchLimitBase + round * searchLimitStep);
  const searchPathLimit = Math.min(searchPathMax, searchPathBase + round * searchPathStep);
  const gdeltLimit = Math.min(gdeltMax, gdeltBase + round * gdeltStep);
  const hnLimit = Math.min(hnMax, hnBase + round * hnStep);
  const rawDedupeBuffer = Math.min(rawDedupeBufferMax, rawDedupeBufferBase + round * rawDedupeBufferStep);
  const rawMax = Math.min(rawMaxMax, rawMaxBase + round * rawMaxStep);

  const monitorArgs = [
    `--date=${date}`,
    `--search-limit=${searchLimit}`,
    `--search-path-query-limit=${searchPathLimit}`,
    `--gdelt-query-limit=${gdeltLimit}`,
    `--hn-limit=${hnLimit}`,
    `--raw-dedupe-buffer=${rawDedupeBuffer}`,
    `--raw-max=${rawMax}`,
    `--fetch-timeout-ms=${fetchTimeout}`,
    `--snapshot-timeout-ms=${snapshotTimeout}`,
  ];
  for (const passthrough of ["raw-min", "raw-target"]) {
    if (args.has(passthrough)) monitorArgs.push(`--${passthrough}=${args.get(passthrough)}`);
  }
  if (useSourceArtifacts) monitorArgs.push("--use-source-artifacts=true");
  if (sourceArtifactDir) monitorArgs.push(`--source-artifact-dir=${sourceArtifactDir}`);
  return monitorArgs;
}

function runSourceArtifactRefresh(source, baseArgs, sourceArtifactDir) {
  const sourceArgs = [
    "agent-workflow/tools/run-guanlan-daily-monitor.mjs",
    ...baseArgs,
    `--source-only=${source}`,
    `--source-artifact-dir=${sourceArtifactDir}`,
  ];

  return new Promise((resolve) => {
    const child = spawn(node, sourceArgs, {
      cwd: root,
      windowsHide: true,
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    let settled = false;
    const maxOutputLength = 20 * 1024 * 1024;

    const appendOutput = (target, chunk) => {
      if (target.length >= maxOutputLength) return target;
      return `${target}${String(chunk)}`.slice(-maxOutputLength);
    };
    const finish = (status, errorMessage = "") => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve({
        source,
        status: status ?? (timedOut ? 124 : 1),
        stdout,
        stderr,
        timedOut,
        message: String(stderr || errorMessage || (timedOut ? "source artifact refresh timed out" : "source artifact refresh failed")).trim(),
      });
    };
    const timeout = setTimeout(() => {
      timedOut = true;
      child.kill("SIGTERM");
    }, sourceRefreshTimeoutMs);

    child.stdout?.on("data", (chunk) => {
      stdout = appendOutput(stdout, chunk);
    });
    child.stderr?.on("data", (chunk) => {
      stderr = appendOutput(stderr, chunk);
    });
    child.on("error", (error) => finish(1, error?.message || String(error)));
    child.on("close", (status) => finish(status));
  });
}

async function refreshSourceArtifactsForCycle(cycle, monitorArgs) {
  const sourceArtifactDir = args.get("source-artifact-dir");
  if (cycle <= 1 || !sourceArtifactDir) return { refreshed: false, failures: [] };

  fs.mkdirSync(path.resolve(root, sourceArtifactDir), { recursive: true });
  const baseArgs = monitorArgs.filter(
    (arg) => !arg.startsWith("--use-source-artifacts") && !arg.startsWith("--source-artifact-dir=")
  );
  const sources = ["aihot", "keyword", "gdelt", "rss"];
  const results = await Promise.all(
    sources.map((source) => runSourceArtifactRefresh(source, baseArgs, sourceArtifactDir))
  );
  const failures = [];

  for (const run of results) {
    if (run.status === 0) continue;

    const { source } = run;
    const message = run.message || "source artifact refresh failed";
    failures.push(`${source}: ${message}`);
    const failedArtifact = path.join(root, sourceArtifactDir, `${source}-raw-source-candidates.json`);
    if (fs.existsSync(failedArtifact)) continue;
    fs.writeFileSync(
      failedArtifact,
      `${JSON.stringify(
        {
          date,
          generated_at: new Date().toISOString(),
          mode: "business_source_raw",
          source_id: source,
          source_label: source,
          status: "failed",
          discovered_count: 0,
          source_item_count: 0,
          raw_candidate_count: 0,
          failures: [`source artifact refresh failed on retry cycle ${cycle}; ${message}`],
          items: [],
        },
        null,
        2
      )}\n`,
      "utf8"
    );
  }

  return { refreshed: true, failures };
}

function appendAutomationMemory(text) {
  const userHome = process.env.USERPROFILE || process.env.HOME || "";
  if (!userHome) return;
  const memoryPath = path.join(userHome, ".codex", "automations", "guanlan-daily-monitor", "memory.md");
  if (!fs.existsSync(memoryPath)) return;
  fs.appendFileSync(memoryPath, `\n\n${text}\n`, "utf8");
}

function writeLoopReport(loopResult) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, `${date}-guanlan-daily-monitor-quality-loop.md`);
  const latestPath = path.join(reportsDir, "guanlan-daily-monitor-quality-loop-latest.md");
  const cycleLines = loopResult.cycles
    .map(
      (cycle) => [
        `### Cycle ${cycle.cycle}`,
        `- monitor_status: ${cycle.monitorStatus}`,
        `- failed_stage: ${cycle.monitorStage}`,
        `- monitor_raw_count: ${cycle.monitorRawCount}`,
        `- quality_status: ${cycle.qualityStatus}`,
        `- quality_score: ${cycle.qualityScore}`,
        `- hard_failed: ${cycle.hardFailed.join(", ") || "none"}`,
        `- source_artifacts_refreshed: ${cycle.sourceRefresh?.refreshed ? "yes" : "no"}`,
        `- source_artifact_refresh_failures: ${(cycle.sourceRefresh?.failures || []).join(" | ") || "none"}`,
        `- failed_sources: ${cycle.failedSources || "none"}`,
        `- fallback_used: ${cycle.fallbackUsed || "unknown"}`,
        `- evidence_gaps: ${cycle.evidenceGaps || "unknown"}`,
        `- report: ${cycle.qualityReport ? rel(cycle.qualityReport) : "missing"}`,
      ].join("\n")
    )
    .join("\n\n");

  const text = [
    `# ${date} Guanlan Monitor Quality Loop`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- status: ${loopResult.status}`,
    `- diagnostic_score_reference: ${diagnosticScoreReference}`,
    "- score_mode: diagnostic_only",
    `- max_cycles: ${maxCycles}`,
    `- final_cycle: ${loopResult.finalCycle}`,
    `- manual_intervention_required: ${loopResult.manualInterventionRequired}`,
    `- downstream_action: ${loopResult.downstreamAction || "none"}`,
    `- downstream_reasons: ${(loopResult.downstreamReasons || []).join(" | ") || "none"}`,
    "",
    "## Cycle Details",
    "",
    cycleLines || "- none",
    "",
    "## Skill Optimization Feedback",
    "",
    ...(loopResult.skillFeedback.length
      ? loopResult.skillFeedback.map((item) => `- ${item}`)
      : ["- none"]),
    "",
  ].join("\n");
  fs.writeFileSync(reportPath, `${text}\n`, "utf8");
  fs.writeFileSync(latestPath, `${text}\n`, "utf8");
  return { reportPath, latestPath };
}

async function runMonitorCycle(cycle) {
  const monitorArgs = buildMonitorArgsForCycle(cycle);
  const sourceRefresh = await refreshSourceArtifactsForCycle(cycle, monitorArgs);
  const commandArgs = ["agent-workflow/tools/run-guanlan-daily-monitor.mjs", ...monitorArgs];
  const run = spawnSync(node, commandArgs, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
    timeout: monitorTimeoutMs,
    killSignal: "SIGTERM",
    shell: false,
  });
  const timedOut = Boolean(
    run.error &&
      (String(run.error.message || "").toLowerCase().includes("timed out") ||
        String(run.error.code || "").toUpperCase() === "ETIMEDOUT")
  );
  const parsed = parseMonitorJson(run.stdout || "");
  return {
    status: run.status ?? (timedOut ? 124 : 1),
    stdout: run.stdout || "",
    stderr: run.stderr || (run.error ? String(run.error.message || run.error) : ""),
    timedOut,
    args: monitorArgs,
    sourceRefresh,
    parsed,
  };
}

async function main() {
  const cycles = [];
  const mergedSkillFeedback = new Set();
  let finalStatus = "failed";
  let finalDownstream = null;
  let finalCycle = maxCycles;

  for (let cycle = 1; cycle <= maxCycles; cycle += 1) {
    const monitorRun = await runMonitorCycle(cycle);
    const quality = runGuanlanMonitorQualityGate({
      date,
      configPath,
      passScore: diagnosticScoreReference,
      attempt: cycle,
      maxAttempts: maxCycles,
    });

    for (const item of quality.skill_feedback || []) mergedSkillFeedback.add(item);
    finalDownstream = quality.downstream;
    finalCycle = cycle;
    const monitorStatus = monitorRun.status === 0 ? "collected" : monitorRun.timedOut ? "timeout" : "failed";
    const monitorRawCount = Number(monitorRun.parsed.raw_count || quality.metrics?.raw_count || 0);
    const hardFailed = Array.isArray(quality.hard_failed) ? quality.hard_failed.map((item) => item.key) : [];

    cycles.push({
      cycle,
      monitorStatus,
      monitorRawCount,
      qualityStatus: quality.status,
      qualityScore: quality.total_score,
      hardFailed,
      qualityReport: quality.report_path,
      monitorArgs: monitorRun.args,
      monitorFailure: monitorRun.status === 0 ? "" : String(monitorRun.stderr || "monitor command failed").trim(),
      sourceRefresh: monitorRun.sourceRefresh,
      monitorStage: monitorRun.status === 0 ? "completed" : monitorRun.timedOut ? "monitor_collection_timeout" : "monitor_collection_failed",
      evidenceGaps: quality.metrics?.importance_coverage_gaps || "unknown",
      fallbackUsed: readFallbackUsedFromLog(date),
      failedSources: readFailedSourcesFromLog(date),
    });

    appendAutomationMemory(
      [
        `## QC Loop ${new Date().toLocaleString("zh-CN", { hour12: false })}`,
        `- date: ${date}`,
        `- cycle: ${cycle}/${maxCycles}`,
        `- monitor_status: ${monitorStatus}`,
        `- quality_status: ${quality.status}`,
        `- quality_score: ${quality.total_score}`,
        `- hard_failed: ${hardFailed.join(", ") || "none"}`,
        `- tuned_args: ${monitorRun.args.join(" ")}`,
      ].join("\n")
    );

    if (monitorRun.status === 0 && quality.passed) {
      finalStatus = "passed";
      break;
    }
  }

  const manualInterventionRequired = finalStatus !== "passed" && finalCycle >= maxCycles;
  const loopResult = {
    date,
    status: finalStatus,
    diagnosticScoreReference,
    maxCycles,
    finalCycle,
    manualInterventionRequired,
    cycles,
    skillFeedback: [...mergedSkillFeedback],
    downstreamAction: finalDownstream?.action || "",
    downstreamReasons: finalDownstream?.reasons || [],
  };
  const { reportPath } = writeLoopReport(loopResult);

  const output = {
    ...loopResult,
    reportPath: rel(reportPath),
  };
  console.log(JSON.stringify(output, null, 2));
  console.log(`Report: ${rel(reportPath)}`);

  if (manualInterventionRequired) process.exit(2);
  if (finalStatus !== "passed") process.exitCode = 1;
}

function readFailedSourcesFromLog(targetDate) {
  const logFileCandidates = [
    path.join(root, "agent-workflow", "reports", `${targetDate}-guanlan-daily-monitor-log.md`),
  ];
  for (const file of logFileCandidates) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const matched = text.match(/^- failed_sources:\s*(.*)$/mu);
    if (matched) return matched[1].trim();
  }
  return "unknown";
}

function readFallbackUsedFromLog(targetDate) {
  const logFileCandidates = [
    path.join(root, "agent-workflow", "reports", `${targetDate}-guanlan-daily-monitor-log.md`),
  ];
  for (const file of logFileCandidates) {
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const matched = text.match(/^- fallback_used:\s*(.*)$/mu);
    if (matched) return matched[1].trim();
  }
  return "unknown";
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exitCode = 1;
});
