#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const inboxDir = path.join(root, "agent-workflow", "inbox", "hermes-to-codex");
const workflowFile = "daily-persistent-assets-pr.yml";
const workflowName = "WaveSight Business Signals PR";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const dryRun = args.get("dry-run") === "true";
const failureThreshold = Number.parseInt(args.get("failure-threshold") || "2", 10);
const maxAttempts = Number.parseInt(args.get("max-attempts") || "3", 10);
const forceAfter = args.get("force-after") || "09:55";
const passScore = args.get("pass-score") || "85";

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

function shanghaiTimestamp(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(dateValue);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}+08:00`;
}

function shanghaiMinutes(value = new Date()) {
  if (typeof value === "string" && /^\d{2}:\d{2}$/u.test(value)) {
    const [hour, minute] = value.split(":").map(Number);
    return hour * 60 + minute;
  }
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateValue).split(":").map(Number);
  return parts[0] * 60 + parts[1];
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
    ...options,
  });
  if (result.error || result.status !== 0) {
    const detail = [result.stdout, result.stderr, result.error?.message].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${commandArgs.join(" ")} failed${detail ? `:\n${detail}` : ""}`);
  }
  return result.stdout.trim();
}

function tryRun(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  return {
    ok: !result.error && result.status === 0,
    status: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || result.error?.message || "",
  };
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function workflowRuns() {
  const output = run("gh", [
    "run",
    "list",
    "--workflow",
    workflowFile,
    "--limit",
    "40",
    "--json",
    "databaseId,status,conclusion,event,createdAt,updatedAt,url,headBranch,displayTitle",
  ]);
  return JSON.parse(output);
}

function sameDateRuns(runs) {
  return runs.filter((run) => shanghaiDate(run.createdAt) === date);
}

function primaryWindowRun(run) {
  const minutes = shanghaiMinutes(run.createdAt);
  if (minutes === null) return false;
  return minutes >= shanghaiMinutes("09:00") && minutes < shanghaiMinutes("09:45");
}

function dispatchBusinessSignals() {
  const commandArgs = [
    "workflow",
    "run",
    workflowFile,
    "-f",
    `date=${date}`,
    "-f",
    `pass_score=${passScore}`,
  ];
  if (dryRun) return { ok: true, output: `dry-run: gh ${commandArgs.join(" ")}` };
  const result = tryRun("gh", commandArgs);
  return {
    ok: result.ok,
    output: result.ok ? result.stdout.trim() : [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
  };
}

function signalAssetsReady() {
  const data = readJson(path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json"), {});
  const activeDate = data?.meta?.activeDate || "";
  const top10 = Array.isArray(data.top10) ? data.top10.length : 0;
  const selection = Array.isArray(data.frontstageSelection)
    ? data.frontstageSelection.find((item) => item.date === date)
    : null;
  return {
    ready: activeDate === date && top10 === 10,
    activeDate,
    top10,
    selectedCount: selection?.selectedCount ?? null,
  };
}

function summarizeRuns(runs) {
  return runs.map((run) => ({
    id: run.databaseId,
    event: run.event,
    status: run.status,
    conclusion: run.conclusion || "",
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    url: run.url,
    displayTitle: run.displayTitle || "",
    primaryWindow: primaryWindowRun(run),
  }));
}

function writeInbox(payload, reportPath) {
  if (!["manual_required", "dispatch_failed"].includes(payload.action)) return "";
  fs.mkdirSync(inboxDir, { recursive: true });
  const file = path.join(inboxDir, `${date}-business_signals-early-handoff.md`);
  const failedRuns = payload.failed_runs.map((run) => `- ${run.conclusion || run.status}: ${run.url}`).join("\n") || "- none";
  const content = [
    "status: open",
    "priority: urgent",
    "lane: business_signals",
    "category: morning_handoff_failure",
    `failed_gate: ${rel(reportPath)}`,
    `report_path: ${rel(reportPath)}`,
    "data_generated: unknown",
    "needed_action: repair rule",
    `created_at: ${shanghaiTimestamp()}`,
    `updated_at: ${shanghaiTimestamp()}`,
    "source: hermes-early-handoff",
    "",
    "# Hermes Repair Request: Business Signals Early Handoff",
    "",
    "## Evidence",
    "",
    `- action: ${payload.action}`,
    `- reason: ${payload.reason}`,
    `- primary_window_failures: ${payload.primary_window_failures}`,
    `- same_date_failures: ${payload.same_date_failures}`,
    `- report: \`${rel(reportPath)}\``,
    "",
    "## Failed Runs",
    "",
    failedRuns,
    "",
    "## Expected Codex Action",
    "",
    "- Inspect the failed Business Signals workflow run logs and artifacts.",
    "- Repair the earliest failing stage: monitor startup, Raw / Pool capture, post-monitor gate, Card generation, Top10 selection, PR, or merge.",
    "- Add or tighten the relevant Business Signals / Daily Monitor eval or example before closing this item.",
    "- Close with `npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>`.",
    "",
    "## User Escalation Needed",
    "",
    "- no, unless GitHub permission or external credentials are missing.",
    "",
  ].join("\n");
  fs.writeFileSync(file, content, "utf8");
  return rel(file);
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonFile = path.join(reportsDir, `${date}-hermes-business-signals-early-handoff.json`);
  const mdFile = path.join(reportsDir, `${date}-hermes-business-signals-early-handoff.md`);
  const latestJsonFile = path.join(reportsDir, "hermes-business-signals-early-handoff-latest.json");
  const latestMdFile = path.join(reportsDir, "hermes-business-signals-early-handoff-latest.md");
  const runRows = payload.runs.length
    ? payload.runs.map((run) => `| ${run.id} | ${run.event} | ${run.status} | ${run.conclusion || ""} | ${run.primaryWindow ? "yes" : "no"} | ${run.url} |`)
    : ["| none | none | none | none | no | none |"];
  const md = [
    `# Hermes Business Signals Early Handoff - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- ok: ${payload.ok}`,
    `- dry_run: ${payload.dry_run}`,
    `- action: ${payload.action}`,
    `- reason: ${payload.reason}`,
    `- primary_window_failures: ${payload.primary_window_failures}`,
    `- same_date_failures: ${payload.same_date_failures}`,
    `- active_run: ${payload.active_run?.url || "none"}`,
    `- successful_run: ${payload.successful_run?.url || "none"}`,
    `- inbox: ${payload.inbox || "none"}`,
    "",
    "## Same-Date Runs",
    "",
    "| Run | Event | Status | Conclusion | Primary window | URL |",
    "|---|---|---|---|---|---|",
    ...runRows,
    "",
    "## Required Follow-Up",
    "",
    payload.action === "dispatched" || payload.action === "dry_run_dispatch"
      ? "- Hermes triggered the Business Signals workflow. Inspect the dispatched run if it does not complete before 10:00 Asia/Shanghai."
      : "- No dispatch was needed or allowed. Use the reason above as the handoff state.",
    "",
  ].join("\n");
  fs.writeFileSync(jsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdFile, `${md}\n`, "utf8");
  fs.writeFileSync(latestJsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdFile, `${md}\n`, "utf8");
  return { jsonFile, mdFile };
}

function main() {
  if (!date) throw new Error("Unable to resolve production date.");
  const runs = sameDateRuns(workflowRuns());
  const success = runs.find((run) => run.conclusion === "success") || null;
  const active = runs.find((run) => run.status === "queued" || run.status === "in_progress") || null;
  const failures = runs.filter((run) => run.status === "completed" && run.conclusion !== "success");
  const primaryFailures = failures.filter(primaryWindowRun);
  const assets = signalAssetsReady();
  const today = shanghaiDate();
  const forceWindowPassed = date < today || (date === today && shanghaiMinutes() >= shanghaiMinutes(forceAfter));

  let action = "wait";
  let reason = "waiting for the 09:07 / 09:37 primary windows";
  let dispatch = null;
  let ok = true;

  if (assets.ready || success) {
    action = "skipped";
    reason = assets.ready
      ? `same-date Business Signals Top10 already exists (activeDate=${assets.activeDate}, top10=${assets.top10})`
      : `same-date successful workflow already exists: ${success.url}`;
  } else if (active) {
    action = "skipped";
    reason = `same-date Business Signals workflow is already ${active.status}: ${active.url}`;
  } else if (failures.length >= maxAttempts) {
    action = "manual_required";
    reason = `failed attempts ${failures.length} reached max ${maxAttempts}; stop looping and hand off to Codex`;
    ok = false;
  } else if (primaryFailures.length >= failureThreshold || forceWindowPassed) {
    dispatch = dispatchBusinessSignals();
    action = dryRun ? "dry_run_dispatch" : dispatch.ok ? "dispatched" : "dispatch_failed";
    reason = dispatch.ok
      ? `Hermes triggered Business Signals after ${primaryFailures.length} primary-window failure(s)`
      : `Hermes failed to dispatch Business Signals: ${dispatch.output || "unknown error"}`;
    ok = dispatch.ok;
  }

  const payload = {
    ok,
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    workflow: workflowName,
    workflow_file: workflowFile,
    action,
    reason,
    force_after: forceAfter,
    failure_threshold: failureThreshold,
    max_attempts: maxAttempts,
    primary_window_failures: primaryFailures.length,
    same_date_failures: failures.length,
    signal_assets: assets,
    active_run: active ? summarizeRuns([active])[0] : null,
    successful_run: success ? summarizeRuns([success])[0] : null,
    failed_runs: summarizeRuns(failures),
    runs: summarizeRuns(runs),
    dispatch_output: dispatch?.output || "",
    inbox: "",
  };
  const reports = writeReports(payload);
  payload.inbox = writeInbox(payload, reports.mdFile);
  writeReports(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    date,
    action: payload.action,
    reason: payload.reason,
    report: rel(reports.jsonFile),
    markdown: rel(reports.mdFile),
    inbox: payload.inbox,
  }, null, 2));
  if (!payload.ok) process.exitCode = 1;
}

main();
