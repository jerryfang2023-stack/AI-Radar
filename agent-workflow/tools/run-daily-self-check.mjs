#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const repairMode = args.get("repair") || "off";
const githubMode = args.get("github") || "auto";
const taskMode = args.get("scheduled-task") || "auto";
const allowSkillStoreSync = ["true", "1", "yes"].includes(String(args.get("allow-skill-store-sync") || "").toLowerCase());

function shanghaiDate(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateValue);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function exists(file) {
  return fs.existsSync(path.isAbsolute(file) ? file : path.join(root, file));
}

function runCommand(label, command, argsList, timeoutMs = 120000) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, argsList, {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true,
  });
  return {
    label,
    command: [command, ...argsList].join(" "),
    ok: !result.error && result.status === 0,
    status: result.status,
    error: result.error?.message || "",
    stdout: String(result.stdout || "").trim().slice(0, 8000),
    stderr: String(result.stderr || "").trim().slice(0, 8000),
    started_at: startedAt,
    finished_at: new Date().toISOString(),
  };
}

function runNpm(label, script, extraArgs = [], timeoutMs = 120000) {
  const npmArgs = ["run", script];
  if (extraArgs.length) npmArgs.push("--", ...extraArgs);
  if (process.platform === "win32") {
    return runCommand(label, process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", ["npm", ...npmArgs].join(" ")], timeoutMs);
  }
  return runCommand(label, "npm", npmArgs, timeoutMs);
}

function runSupervision() {
  const result = runCommand("daily supervision without Hermes", process.execPath, [
    "agent-workflow/tools/write-daily-supervision-report.mjs",
    `--date=${date}`,
    `--github=${githubMode}`,
    `--scheduled-task=${taskMode}`,
    "--hermes=off",
  ], 120000);
  const reportPath = path.join(reportsDir, `${date}-daily-supervision-report.json`);
  return {
    command: result,
    report: readJson(reportPath, null),
    reportPath,
  };
}

function flattenIssues(report) {
  const issues = [];
  for (const lane of report?.lanes || []) {
    for (const problem of lane.problems || []) {
      issues.push({
        lane: lane.id,
        lane_label: lane.label,
        severity: problem.severity || "failed",
        kind: "problem",
        message: problem.message || String(problem),
        failed_gate: lane.evidence?.gateReport || lane.evidence?.readinessReport || lane.evidence?.qualityGateStatus || "",
        action: lane.actions?.[0] || "",
      });
    }
    for (const warning of lane.warnings || []) {
      issues.push({
        lane: lane.id,
        lane_label: lane.label,
        severity: "warning",
        kind: "warning",
        message: warning.message || String(warning),
        failed_gate: "",
        action: lane.actions?.[0] || "",
      });
    }
  }
  return issues;
}

function hasLaneProblem(report, laneId, pattern = /./u) {
  const lane = (report?.lanes || []).find((item) => item.id === laneId);
  if (!lane) return false;
  return (lane.problems || []).some((item) => pattern.test(item.message || String(item)));
}

function hasLaneWarning(report, laneId, pattern = /./u) {
  const lane = (report?.lanes || []).find((item) => item.id === laneId);
  if (!lane) return false;
  return (lane.warnings || []).some((item) => pattern.test(item.message || String(item)));
}

function runSafeRepairs(report) {
  const attempts = [];
  if (!["safe", "on", "true", "1"].includes(String(repairMode).toLowerCase())) return attempts;
  const businessLane = (report?.lanes || []).find((lane) => lane.id === "business_signals");

  if (hasLaneProblem(report, "skill_ops", /skill-registry|registry|skill ops|skill-store|drift/iu)) {
    attempts.push(runNpm("repair skill registry", "build:skill-registry", [], 120000));
    attempts.push(runNpm("check skill ops after registry repair", "check:skill-ops", [], 120000));
    if (!attempts.at(-1)?.ok && allowSkillStoreSync) {
      attempts.push(runNpm("sync skill store after explicit opt-in", "sync:skill-store", [], 120000));
      attempts.push(runNpm("check skill ops after skill-store sync", "check:skill-ops", [], 120000));
    }
  }

  if (hasLaneProblem(report, "community_intelligence", /gate report|missing community gate|community data date|archive|items|links/iu)
    || hasLaneWarning(report, "community_intelligence", /missing community gate/iu)) {
    if (exists("01-SiteV2/site/data/community-intelligence.json")) {
      attempts.push(runNpm("rerun community data gate", "assert:community-intelligence", [`--date=${date}`], 120000));
    }
  }

  if (hasLaneProblem(report, "first_line_viewpoints", /gate report|follow-builders|first-line data|builders data/iu)) {
    if (exists("01-SiteV2/site/data/follow-builders-daily.json")) {
      attempts.push(runCommand("rerun first-line data gate", process.execPath, [
        "agent-workflow/tools/assert-follow-builders-data.mjs",
        `--date=${date}`,
      ], 120000));
    }
  }

  if (businessLane?.status !== "waiting" && (
    hasLaneProblem(report, "business_signals", /frontstage|public Card|source-first|regression|gate|activeDate|signal Card/iu)
    || hasLaneWarning(report, "business_signals", /frontstage|public Card|source-first|regression|gate/iu)
  )) {
    if (exists("01-SiteV2/site/data/v3-data-observation-desk.json")) {
      attempts.push(runNpm("rerun Business Signals frontstage gate", "assert:business-frontstage", [`--date=${date}`], 120000));
    }
  }

  return attempts;
}

function unresolvedRepairTasks(report, repairAttempts) {
  const tasks = [];
  const blocking = flattenIssues(report).filter((issue) => issue.kind === "problem");
  const lanes = new Map();
  for (const issue of blocking) {
    if (!lanes.has(issue.lane)) lanes.set(issue.lane, []);
    lanes.get(issue.lane).push(issue);
  }
  for (const [lane, laneIssues] of lanes) {
    const failedGates = [...new Set(laneIssues.map((issue) => issue.failed_gate).filter(Boolean))];
    tasks.push({
      lane,
      severity: laneIssues.some((issue) => issue.severity === "manual_required") ? "manual_required" : "failed",
      failed_gate: failedGates.join("; "),
      report_path: `agent-workflow/reports/${date}-daily-supervision-report.md`,
      instruction: [
        "Read AGENTS.md and current context rules.",
        `Read agent-workflow/reports/${date}-daily-supervision-report.md.`,
        failedGates.length ? `Inspect failed gate/report: ${failedGates.join("; ")}.` : "Inspect the lane evidence in the supervision report.",
        `Resolve these issue(s): ${laneIssues.map((issue) => issue.message).join(" | ")}.`,
        "Classify the earliest responsible stage.",
        "Repair the smallest script, gate, rule, eval, or generated-report path.",
        "Rerun the exact failed gate or smallest validation.",
        "Do not lower evidence gates, do not use builders/community material as Business Signal facts, and do not blindly rerun the full Business Signals chain.",
      ].join(" "),
    });
  }

  for (const attempt of repairAttempts.filter((item) => !item.ok)) {
    tasks.push({
      lane: "self_repair",
      severity: "manual_required",
      failed_gate: attempt.label,
      report_path: `agent-workflow/reports/${date}-daily-self-check.md`,
      instruction: `Self-repair command failed: ${attempt.command}. Inspect stdout/stderr in the self-check report and repair the smallest failing path.`,
    });
  }

  return tasks;
}

function markdownList(items, formatter = (item) => String(item)) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${formatter(item)}`).join("\n");
}

function writeSelfCheckReport(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-daily-self-check.json`);
  const mdPath = path.join(reportsDir, `${date}-daily-self-check.md`);
  const latestJsonPath = path.join(reportsDir, "daily-self-check-latest.json");
  const latestMdPath = path.join(reportsDir, "daily-self-check-latest.md");
  const issueRows = payload.issues.map((issue) => (
    `| ${issue.lane} | ${issue.kind} | ${issue.severity} | ${String(issue.message).replace(/\|/gu, "\\|")} |`
  ));
  const attemptRows = payload.repair_attempts.map((attempt) => (
    `| ${attempt.label} | ${attempt.ok ? "passed" : "failed"} | \`${attempt.command.replace(/\|/gu, "\\|")}\` |`
  ));
  const md = [
    `# WaveSight Daily Self Check - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- repair_mode: ${payload.repair_mode}`,
    `- supervision_report: ${payload.supervision_report}`,
    "",
    "## Issues",
    "",
    "| Lane | Kind | Severity | Message |",
    "|---|---|---|---|",
    ...(issueRows.length ? issueRows : ["| none | none | none | none |"]),
    "",
    "## Safe Repair Attempts",
    "",
    "| Attempt | Status | Command |",
    "|---|---|---|",
    ...(attemptRows.length ? attemptRows : ["| none | none | none | none |"]),
    "",
    "## Codex Repair Tasks",
    "",
    markdownList(payload.codex_repair_tasks, (task) => `${task.lane}: ${task.instruction}`),
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function main() {
  const first = runSupervision();
  let report = first.report;
  const repairAttempts = report ? runSafeRepairs(report) : [];
  let second = null;
  if (repairAttempts.length) {
    second = runSupervision();
    report = second.report || report;
  }

  const issues = flattenIssues(report);
  const blockingIssues = issues.filter((issue) => issue.kind === "problem");
  const codexRepairTasks = unresolvedRepairTasks(report, repairAttempts);
  const status = !report
    ? "failed"
    : blockingIssues.length || repairAttempts.some((attempt) => !attempt.ok)
      ? "repair_required"
      : report.status === "waiting"
        ? "waiting"
      : issues.some((issue) => issue.kind === "warning")
        ? "warning"
        : "passed";

  const payload = {
    ok: status === "passed" || status === "warning" || status === "waiting",
    status,
    date,
    generated_at: new Date().toISOString(),
    repair_mode: repairMode,
    github_mode: githubMode,
    scheduled_task_mode: taskMode,
    supervision_report: first.reportPath ? rel(first.reportPath).replace(/\.json$/u, ".md") : "",
    supervision_command: first.command,
    post_repair_supervision_command: second?.command || null,
    issues,
    repair_attempts: repairAttempts,
    codex_repair_tasks: codexRepairTasks,
  };
  const { jsonPath, mdPath } = writeSelfCheckReport(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status,
    report: rel(jsonPath),
    markdown: rel(mdPath),
    repair_attempts: repairAttempts.length,
    codex_repair_tasks: codexRepairTasks.length,
  }, null, 2));
  if (!payload.ok) process.exit(1);
}

main();
