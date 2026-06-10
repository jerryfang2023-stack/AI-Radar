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
const githubMode = args.get("github") || "auto";
const taskMode = args.get("scheduled-task") || "auto";

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

function shanghaiTime(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateValue);
}

function minutesSinceMidnight(value = shanghaiTime()) {
  const [hour, minute] = String(value).split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readText(file, fallback = "") {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return fallback;
  }
}

function statusFromGate(file) {
  const text = readText(file);
  if (!text) return "missing";
  const match = text.match(/^- status:\s*([^\r\n]+)/mu);
  return match ? match[1].trim() : "unknown";
}

function countFiles(dir, pattern) {
  if (!exists(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return count + countFiles(file, pattern);
    return count + (pattern.test(entry.name) ? 1 : 0);
  }, 0);
}

function laneStatus(problems, warnings) {
  if (problems.some((item) => item.severity === "manual_required")) return "manual_required";
  if (problems.length) return "failed";
  if (warnings.length) return "warning";
  return "passed";
}

function addProblem(list, message, severity = "failed") {
  list.push({ message, severity });
}

function markdownList(items) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${typeof item === "string" ? item : item.message}`).join("\n");
}

function isTodayOrPast(targetDate) {
  return targetDate <= shanghaiDate();
}

function hasWindowPassed(targetDate, hhmm) {
  if (targetDate < shanghaiDate()) return true;
  if (targetDate > shanghaiDate()) return false;
  const current = minutesSinceMidnight();
  const target = minutesSinceMidnight(hhmm);
  return current !== null && target !== null && current >= target;
}

function runOptional(command, argsList, timeoutMs = 8000) {
  const result = spawnSync(command, argsList, {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true,
  });
  if (result.error || result.status !== 0) {
    return {
      ok: false,
      stdout: result.stdout || "",
      stderr: result.stderr || result.error?.message || "",
    };
  }
  return { ok: true, stdout: result.stdout || "", stderr: result.stderr || "" };
}

function parseGhJson(result, fallback) {
  if (!result.ok) return fallback;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return fallback;
  }
}

function githubWorkflowState(workflowFile, branchHead) {
  if (githubMode === "false" || githubMode === "off") {
    return { available: false, skipped: true, warning: "GitHub check skipped by flag" };
  }

  const runResult = runOptional("gh", [
    "run",
    "list",
    "--workflow",
    workflowFile,
    "--limit",
    "20",
    "--json",
    "databaseId,status,conclusion,event,createdAt,updatedAt,url,headBranch",
  ]);
  if (!runResult.ok) {
    return { available: false, warning: `GitHub CLI unavailable or unauthenticated: ${runResult.stderr.trim() || "unknown error"}` };
  }

  const runs = parseGhJson(runResult, []);
  const sameDateRuns = runs.filter((run) => shanghaiDate(run.createdAt) === date);
  const latest = sameDateRuns[0] || null;

  const prResult = runOptional("gh", [
    "pr",
    "list",
    "--state",
    "all",
    "--head",
    branchHead,
    "--json",
    "number,state,isDraft,mergedAt,url,updatedAt",
    "--limit",
    "5",
  ]);
  const prs = parseGhJson(prResult, []);

  return {
    available: true,
    latest_run: latest,
    same_date_run_count: sameDateRuns.length,
    prs,
    pr_warning: prResult.ok ? "" : `PR check unavailable: ${prResult.stderr.trim() || "unknown error"}`,
  };
}

function scheduledTaskState(taskName) {
  if (taskMode === "false" || taskMode === "off") {
    return { available: false, skipped: true, warning: "Scheduled task check skipped by flag" };
  }
  if (process.platform !== "win32") {
    return { available: false, warning: "Scheduled task check is Windows-only" };
  }
  const command = [
    "$taskName = '",
    taskName.replace(/'/gu, "''"),
    "';",
    "$task = Get-ScheduledTask -TaskName $taskName -ErrorAction Stop;",
    "$info = Get-ScheduledTaskInfo -TaskName $taskName -ErrorAction Stop;",
    "[pscustomobject]@{",
    "State=$task.State;",
    "LastTaskResult=$info.LastTaskResult;",
    "LastRunTime=$info.LastRunTime;",
    "NextRunTime=$info.NextRunTime",
    "} | ConvertTo-Json -Compress",
  ].join("");
  const result = runOptional("powershell", ["-NoProfile", "-Command", command], 8000);
  if (!result.ok) {
    return { available: false, warning: `Scheduled task unavailable: ${result.stderr.trim() || "unknown error"}` };
  }
  return { available: true, task: parseGhJson(result, null) };
}

function scheduledTaskStateName(value) {
  const map = new Map([
    [0, "Unknown"],
    [1, "Disabled"],
    [2, "Queued"],
    [3, "Ready"],
    [4, "Running"],
  ]);
  const numeric = Number(value);
  if (map.has(numeric)) return map.get(numeric);
  return String(value || "");
}

function buildBusinessSignalsLane() {
  const problems = [];
  const warnings = [];
  const evidence = {};
  const actions = [];

  const dataFile = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
  const graphFile = path.join(root, "01-SiteV2", "site", "data", "intelligence-graph-index.json");
  const manifestFile = path.join(reportsDir, `${date}-persistent-asset-manifest.json`);
  const qualityGateFile = path.join(reportsDir, `${date}-guanlan-monitor-quality-gate.md`);
  const readinessFile = path.join(reportsDir, `${date}-daily-production-chain-readiness.md`);
  const data = readJson(dataFile, {});
  const activeDate = data?.meta?.activeDate || "";
  const selection = Array.isArray(data.frontstageSelection)
    ? data.frontstageSelection.find((item) => item.date === date)
    : null;
  const sameDateCards = Array.isArray(data.frontstageCards)
    ? data.frontstageCards.filter((card) => card.date === date)
    : [];
  const cardFiles = countFiles(path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards"), new RegExp(`^${date}--signal--.*\\.md$`, "u"));
  const gh = githubWorkflowState("daily-persistent-assets-pr.yml", `automation/business-signals-${date}`);

  evidence.activeDate = activeDate;
  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.frontstageSelected = selection?.selectedCount ?? sameDateCards.length;
  evidence.supplyConstrained = selection?.supplyConstrained ?? null;
  evidence.coreCandidateCount = selection?.coreCandidateCount ?? null;
  evidence.qualifiedCount = selection?.qualifiedCount ?? null;
  evidence.signalCardFiles = cardFiles;
  evidence.manifest = exists(manifestFile) ? rel(manifestFile) : "missing";
  evidence.qualityGateStatus = statusFromGate(qualityGateFile);
  evidence.readinessReport = exists(readinessFile) ? rel(readinessFile) : "missing";
  evidence.github = gh;

  if (!exists(dataFile)) addProblem(problems, `missing business-signal data file: ${rel(dataFile)}`);
  if (activeDate !== date) addProblem(problems, `business-signal activeDate is ${activeDate || "missing"}, expected ${date}`);
  if (!exists(graphFile)) addProblem(problems, `missing intelligence map data: ${rel(graphFile)}`);
  if ((selection?.selectedCount ?? sameDateCards.length) !== 10) {
    addProblem(problems, `Top10 selected count is ${selection?.selectedCount ?? sameDateCards.length}, expected 10`);
  }
  if (selection?.supplyConstrained) addProblem(problems, "frontstage selection is supply constrained");
  if (cardFiles < 10) addProblem(problems, `signal card files ${cardFiles} below 10`);
  if (!exists(manifestFile)) warnings.push(`missing same-date persistent asset manifest: ${rel(manifestFile)}`);
  if (evidence.qualityGateStatus === "failed") addProblem(problems, `quality gate failed: ${rel(qualityGateFile)}`);
  if (evidence.qualityGateStatus === "missing") warnings.push(`missing quality gate report: ${rel(qualityGateFile)}`);
  if (evidence.readinessReport === "missing") warnings.push(`missing readiness report: ${rel(readinessFile)}`);

  if (gh.available) {
    if (!gh.latest_run && hasWindowPassed(date, "09:20")) {
      addProblem(problems, "no same-date Business Signals GitHub run after 09:20 watchdog", "manual_required");
      actions.push("manual dispatch `.github/workflows/daily-persistent-assets-pr.yml` for the production date");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addProblem(problems, `Business Signals workflow is ${gh.latest_run.status}; downstream tasks should wait`, "manual_required");
      actions.push("wait for Business Signals workflow completion before declaring data missing");
    } else if (gh.latest_run?.conclusion && gh.latest_run.conclusion !== "success") {
      addProblem(problems, `Business Signals workflow conclusion is ${gh.latest_run.conclusion}`);
    }
    if (gh.pr_warning) warnings.push(gh.pr_warning);
  } else if (isTodayOrPast(date)) {
    warnings.push(gh.warning || "GitHub workflow state unavailable");
  }

  if (problems.length) {
    actions.push("send Codex a business_signals repair request with failed gate and report path");
  }

  return {
    id: "business_signals",
    label: "Business Signals / Intelligence Map / Dashboard",
    schedule: "09:07 Asia/Shanghai; watchdog 09:20",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function buildFirstLineLane() {
  const problems = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json");
  const gateFile = path.join(reportsDir, `${date}-follow-builders-data-gate.md`);
  const data = readJson(dataFile, {});
  const generatedDate = shanghaiDate(data?.meta?.generatedAt || "");
  const gh = githubWorkflowState("daily-first-line-viewpoints-pr.yml", `automation/first-line-viewpoints-${date}`);

  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.generatedDate = generatedDate;
  evidence.feedGeneratedAt = data?.meta?.feedGeneratedAt || "";
  evidence.remarks = data?.stats?.remarks ?? (Array.isArray(data.remarks) ? data.remarks.length : 0);
  evidence.builders = data?.stats?.builders ?? (Array.isArray(data.builders) ? data.builders.length : 0);
  evidence.gateStatus = statusFromGate(gateFile);
  evidence.gateReport = exists(gateFile) ? rel(gateFile) : "missing";
  evidence.github = gh;

  if (!exists(dataFile)) addProblem(problems, `missing first-line data file: ${rel(dataFile)}`);
  if (generatedDate !== date) addProblem(problems, `first-line data date is ${generatedDate || "missing"}, expected ${date}`);
  if (Number(evidence.remarks) < 12) addProblem(problems, `remarks count ${evidence.remarks} below 12`);
  if (Number(evidence.builders) < 6) addProblem(problems, `builders count ${evidence.builders} below 6`);
  if (evidence.gateStatus === "failed") addProblem(problems, `follow-builders gate failed: ${rel(gateFile)}`);
  if (evidence.gateStatus === "missing") warnings.push(`missing follow-builders gate report: ${rel(gateFile)}`);

  if (gh.available) {
    if (!gh.latest_run && hasWindowPassed(date, "09:30")) {
      addProblem(problems, "no same-date First-Line Viewpoints GitHub run after 09:30 watchdog", "manual_required");
      actions.push("manual dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` for the production date");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addProblem(problems, `First-Line Viewpoints workflow is ${gh.latest_run.status}`, "manual_required");
      actions.push("wait for First-Line Viewpoints workflow completion");
    } else if (gh.latest_run?.conclusion && gh.latest_run.conclusion !== "success") {
      addProblem(problems, `First-Line Viewpoints workflow conclusion is ${gh.latest_run.conclusion}`);
    }
    if (gh.pr_warning) warnings.push(gh.pr_warning);
  } else if (isTodayOrPast(date)) {
    warnings.push(gh.warning || "GitHub workflow state unavailable");
  }

  if (problems.length) {
    actions.push("send Codex a first_line_viewpoints repair request with gate report path");
  }

  return {
    id: "first_line_viewpoints",
    label: "First-Line Viewpoints",
    schedule: "09:17 Asia/Shanghai; watchdog 09:30",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function buildCommunityLane() {
  const problems = [];
  const warnings = [];
  const evidence = {};
  const actions = [];
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");
  const gateFile = path.join(reportsDir, `${date}-community-intelligence-gate.md`);
  const data = readJson(dataFile, {});
  const generatedDate = shanghaiDate(data?.meta?.generatedAt || "");
  const task = scheduledTaskState("WaveSight Community Intelligence Daily");
  const gh = githubWorkflowState("daily-community-intelligence-pr.yml", `automation/community-intelligence-${date}`);

  evidence.generatedAt = data?.meta?.generatedAt || "";
  evidence.generatedDate = generatedDate;
  evidence.items = Array.isArray(data.items) ? data.items.length : 0;
  evidence.links = Array.isArray(data.links) ? data.links.length : 0;
  evidence.selectedKeywords = Array.isArray(data?.meta?.selectedKeywords) ? data.meta.selectedKeywords.length : 0;
  evidence.collectorErrors = Array.isArray(data?.meta?.errors) ? data.meta.errors.length : 0;
  evidence.gateStatus = statusFromGate(gateFile);
  evidence.gateReport = exists(gateFile) ? rel(gateFile) : "missing";
  evidence.scheduledTask = task;
  evidence.github = gh;

  if (!exists(dataFile)) addProblem(problems, `missing community data file: ${rel(dataFile)}`);
  if (generatedDate !== date) addProblem(problems, `community data date is ${generatedDate || "missing"}, expected ${date}`);
  if (evidence.items < 12) addProblem(problems, `community item count ${evidence.items} below 12`);
  if (evidence.links < 3) addProblem(problems, `community deduped links ${evidence.links} below 3`);
  if (evidence.collectorErrors > 0) addProblem(problems, `community collector recorded ${evidence.collectorErrors} blocking error(s)`);
  if (evidence.gateStatus === "failed") addProblem(problems, `community gate failed: ${rel(gateFile)}`);
  if (evidence.gateStatus === "missing") warnings.push(`missing community gate report: ${rel(gateFile)}`);

  if (task.available) {
    const lastResult = Number(task.task?.LastTaskResult);
    const state = scheduledTaskStateName(task.task?.State);
    evidence.scheduledTask.stateName = state;
    if (!["Ready", "Running"].includes(state)) {
      addProblem(problems, `community scheduled task state is ${state || "unknown"}`, "manual_required");
    }
    if (Number.isFinite(lastResult) && lastResult !== 0) {
      addProblem(problems, `community scheduled task last result is ${lastResult}`, "manual_required");
    }
  } else {
    warnings.push(task.warning || "scheduled task state unavailable");
  }

  if (gh.available) {
    if (!gh.latest_run && hasWindowPassed(date, "08:55")) {
      addProblem(problems, "no same-date Community Intelligence publish workflow after 08:55 watchdog", "manual_required");
      actions.push("manual dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass");
    } else if (gh.latest_run?.status === "in_progress" || gh.latest_run?.status === "queued") {
      addProblem(problems, `Community Intelligence publish workflow is ${gh.latest_run.status}`, "manual_required");
      actions.push("wait for Community Intelligence publish workflow completion");
    } else if (gh.latest_run?.conclusion && gh.latest_run.conclusion !== "success") {
      addProblem(problems, `Community Intelligence publish workflow conclusion is ${gh.latest_run.conclusion}`);
    }
    if (gh.pr_warning) warnings.push(gh.pr_warning);
  } else if (isTodayOrPast(date)) {
    warnings.push(gh.warning || "GitHub workflow state unavailable");
  }

  if (hasWindowPassed(date, "08:45") && generatedDate !== date) {
    actions.push("rerun `agent-workflow/tools/run-community-intelligence.ps1` locally");
  }
  if (problems.length) {
    actions.push("send Codex a community_intelligence repair request with log and gate report path");
  }

  return {
    id: "community_intelligence",
    label: "Community Intelligence",
    schedule: "08:30 local task; watchdog 08:45; publish watchdog 08:55",
    status: laneStatus(problems, warnings),
    evidence,
    problems,
    warnings,
    actions: [...new Set(actions)],
  };
}

function aggregateStatus(lanes) {
  if (lanes.some((lane) => lane.status === "failed")) return "failed";
  if (lanes.some((lane) => lane.status === "manual_required")) return "manual_required";
  if (lanes.some((lane) => lane.status === "warning")) return "warning";
  return "passed";
}

function repairRequest(lane) {
  if (!lane.problems.length && !lane.actions.length) return "none";
  const gate = lane.evidence.gateReport || lane.evidence.qualityGateStatus || "unknown";
  const action = lane.actions[0] || "inspect and classify";
  return [
    `lane: ${lane.id}`,
    `failed_gate: ${gate}`,
    `data_generated: ${lane.problems.some((item) => /date is|missing .*data file/u.test(item.message)) ? "no_or_stale" : "yes"}`,
    `needed_action: ${action}`,
  ].join("\n");
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-daily-supervision-report.json`);
  const mdPath = path.join(reportsDir, `${date}-daily-supervision-report.md`);
  const latestJsonPath = path.join(reportsDir, "daily-supervision-report-latest.json");
  const latestMdPath = path.join(reportsDir, "daily-supervision-report-latest.md");

  const tableRows = payload.lanes.map((lane) => (
    `| ${lane.label} | ${lane.schedule} | ${lane.status} | ${lane.problems.length} | ${lane.warnings.length} |`
  ));
  const laneBlocks = payload.lanes.map((lane) => [
    `## ${lane.label}`,
    "",
    `- status: ${lane.status}`,
    `- schedule: ${lane.schedule}`,
    "",
    "### Problems",
    "",
    markdownList(lane.problems),
    "",
    "### Warnings",
    "",
    markdownList(lane.warnings),
    "",
    "### Actions",
    "",
    markdownList(lane.actions),
    "",
    "### Repair Request",
    "",
    "```text",
    repairRequest(lane),
    "```",
  ].join("\n"));

  const md = [
    `# WaveSight Daily Supervision - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- github_mode: ${githubMode}`,
    `- scheduled_task_mode: ${taskMode}`,
    "",
    "| Lane | Timeline | Status | Problems | Warnings |",
    "|---|---|---|---:|---:|",
    ...tableRows,
    "",
    ...laneBlocks,
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function main() {
  const lanes = [
    buildCommunityLane(),
    buildBusinessSignalsLane(),
    buildFirstLineLane(),
  ];
  const status = aggregateStatus(lanes);
  const payload = {
    ok: status === "passed" || status === "warning",
    status,
    date,
    generated_at: new Date().toISOString(),
    timezone: "Asia/Shanghai",
    lanes,
  };
  const { jsonPath, mdPath } = writeReports(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status,
    report: rel(jsonPath),
    markdown: rel(mdPath),
  }, null, 2));
  if (status === "failed") process.exit(1);
}

main();
