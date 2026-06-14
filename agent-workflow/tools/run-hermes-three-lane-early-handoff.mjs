#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const inboxDir = path.join(root, "agent-workflow", "inbox", "hermes-to-codex");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || shanghaiDate();
const dryRun = args.get("dry-run") === "true";
const passScore = args.get("pass-score") || "85";
const handoffSchedule = ["09:30", "09:45", "09:55"];
const handoffStage = args.get("handoff-stage") || args.get("slot") || currentHandoffStage();
const businessTakeoverAfter = args.get("business-takeover-after") || args.get("force-after") || "09:45";

const lanes = [
  {
    id: "business_signals",
    label: "Business Signals",
    workflowFile: "daily-persistent-assets-pr.yml",
    workflowName: "WaveSight Business Signals PR",
    primaryWindow: "08:57 primary production / 09:27 conditional health dispatch",
    primaryStart: "08:57",
    primaryEnd: "09:45",
    failureThreshold: 1,
    maxAttempts: 3,
    takeoverAfter: businessTakeoverAfter,
    dispatchStages: ["09:45"],
    dispatchInputs: () => ({ date, pass_score: passScore }),
    assetsReady: businessSignalAssetsReady,
    goodExample: "A formal Signal Card keeps a source-backed original event, an accurate title, and a first-party or reporting URL.",
    badExample: "A LinkedIn repost, GitHub repo tree, or generic funding list is promoted as a Top10 business fact.",
  },
  {
    id: "first_line_viewpoints",
    label: "First-Line Viewpoints",
    workflowFile: "daily-first-line-viewpoints-pr.yml",
    workflowName: "WaveSight First-Line Viewpoints PR",
    primaryWindow: "08:30 local Codex RSS collection + sync / 09:17 GitHub fallback",
    primaryStart: "08:30",
    primaryEnd: "09:30",
    failureThreshold: 1,
    maxAttempts: 3,
    takeoverAfter: "09:30",
    dispatchStages: ["09:30"],
    dispatchInputs: () => ({ date }),
    assetsReady: firstLineAssetsReady,
    goodExample: "Builder viewpoints publish same-date Chinese data and sync person/date Obsidian timeline files.",
    badExample: "A builders run finishes but leaves no same-date timeline file or leaves untranslated English as primary display text.",
  },
  {
    id: "community_intelligence",
    label: "Community Intelligence",
    workflowFile: "daily-community-intelligence-pr.yml",
    workflowName: "WaveSight Community Intelligence PR",
    primaryWindow: "08:30 local collection / 08:45 GitHub publish; 10:45 publish fallback",
    primaryStart: "08:30",
    primaryEnd: "09:30",
    failureThreshold: 1,
    maxAttempts: 3,
    takeoverAfter: "09:30",
    dispatchStages: ["09:30"],
    dispatchInputs: () => ({ date }),
    assetsReady: communityAssetsReady,
    canDispatch: (assets) => assets.localCollectionReady,
    limitation: "GitHub can verify and publish community files, but cannot run the logged-in local Chrome collector.",
    goodExample: "Local Chrome collection writes same-date items/links/errors=0, archive files exist, then GitHub publishes them.",
    badExample: "GitHub publish runs without same-date local collector output and cannot create fresh community data by itself.",
  },
];

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
  const [hour, minute] = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateValue).split(":").map(Number);
  return hour * 60 + minute;
}

function currentHandoffStage(value = new Date()) {
  const minutes = shanghaiMinutes(value);
  if (minutes === null) return "09:55";
  if (minutes < shanghaiMinutes("09:45")) return "09:30";
  if (minutes < shanghaiMinutes("09:55")) return "09:45";
  return "09:55";
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
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

function workflowRuns(workflowFile) {
  const result = tryRun("gh", [
    "run",
    "list",
    "--workflow",
    workflowFile,
    "--limit",
    "50",
    "--json",
    "databaseId,status,conclusion,event,createdAt,updatedAt,url,headBranch,displayTitle",
  ]);
  if (!result.ok) {
    throw new Error([result.stdout, result.stderr].filter(Boolean).join("\n").trim() || `gh run list failed for ${workflowFile}`);
  }
  return JSON.parse(result.stdout);
}

function sameDateRuns(runs) {
  return runs.filter((run) => shanghaiDate(run.createdAt) === date);
}

function primaryWindowRun(run, lane = {}) {
  const minutes = shanghaiMinutes(run.createdAt);
  if (minutes === null) return false;
  return minutes >= shanghaiMinutes(lane.primaryStart || "08:30") && minutes < shanghaiMinutes(lane.primaryEnd || "09:45");
}

function summarizeRuns(runs, lane = {}) {
  return runs.map((run) => ({
    id: run.databaseId,
    event: run.event,
    status: run.status,
    conclusion: run.conclusion || "",
    createdAt: run.createdAt,
    updatedAt: run.updatedAt,
    url: run.url,
    displayTitle: run.displayTitle || "",
    primaryWindow: primaryWindowRun(run, lane),
  }));
}

function dispatchWorkflow(lane) {
  const commandArgs = ["workflow", "run", lane.workflowFile];
  for (const [key, value] of Object.entries(lane.dispatchInputs())) {
    commandArgs.push("-f", `${key}=${value}`);
  }
  if (dryRun) return { ok: true, output: `dry-run: gh ${commandArgs.join(" ")}` };
  const result = tryRun("gh", commandArgs);
  return {
    ok: result.ok,
    output: result.ok ? result.stdout.trim() : [result.stdout, result.stderr].filter(Boolean).join("\n").trim(),
  };
}

function badBusinessTitle(title = "") {
  return /用途见原文|原文所述|原文 AI 事件|原文事件标题|的原文业务场景|linkedin\s+(?:的原文|融资)|github\s+的原文|devblogs\s+应用|angelinvestorsnetwork\s+融资/iu.test(String(title || ""));
}

function businessSignalAssetsReady() {
  const data = readJson(path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json"), {});
  const activeDate = data?.meta?.activeDate || "";
  const top10 = Array.isArray(data.top10) ? data.top10 : [];
  const badTitleCount = top10.filter((item) => badBusinessTitle(item.title || item.displayTitle || "")).length;
  return {
    ready: activeDate === date && top10.length === 10 && badTitleCount === 0,
    activeDate,
    top10: top10.length,
    badTitleCount,
  };
}

function firstLineAssetsReady() {
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json");
  const data = readJson(dataFile, {});
  const dataDate = shanghaiDate(data?.meta?.generatedAt || data?.generatedAt || "");
  const builders = Array.isArray(data.builders) ? data.builders.length : 0;
  const itemCount = Array.isArray(data.items) ? data.items.length : 0;
  const timelineRoot = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Timelines", "people");
  const timelineFiles = walkFiles(timelineRoot).filter((file) => path.basename(file) === `${date}.md`);
  return {
    ready: dataDate === date && (builders > 0 || itemCount > 0) && timelineFiles.length > 0,
    dataDate,
    builders,
    items: itemCount,
    timelineFiles: timelineFiles.length,
  };
}

function communityAssetsReady() {
  const dataFile = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");
  const data = readJson(dataFile, {});
  const dataDate = shanghaiDate(data?.meta?.generatedAt || data?.generatedAt || "");
  const items = Array.isArray(data.items) ? data.items.length : 0;
  const links = Array.isArray(data.links) ? data.links.length : 0;
  const errors = Array.isArray(data?.meta?.errors) ? data.meta.errors.length : 0;
  const dailySnapshot = path.join(root, "01-SiteV2", "site", "data", "community-intelligence-daily", `${date}.json`);
  const archiveFile = path.join(root, "01-SiteV2", "content", "07-community-intelligence", "daily", `${date} Community Intelligence.md`);
  return {
    ready: dataDate === date && items >= 12 && links >= 3 && errors === 0 && fs.existsSync(dailySnapshot) && fs.existsSync(archiveFile),
    localCollectionReady: dataDate === date && items >= 12 && links >= 3 && errors === 0,
    dataDate,
    items,
    links,
    errors,
    dailySnapshot: fs.existsSync(dailySnapshot) ? "present" : "missing",
    archive: fs.existsSync(archiveFile) ? "present" : "missing",
  };
}

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function superviseLane(lane) {
  const assets = lane.assetsReady();
  const today = shanghaiDate();
  const primaryWindowPassed = date < today || (date === today && shanghaiMinutes() >= shanghaiMinutes(lane.primaryEnd));
  const takeoverWindowPassed = date < today || (date === today && shanghaiMinutes() >= shanghaiMinutes(lane.takeoverAfter));
  let runs = [];
  let ghError = "";
  try {
    runs = sameDateRuns(workflowRuns(lane.workflowFile));
  } catch (error) {
    ghError = error.message;
  }

  const success = runs.find((run) => run.conclusion === "success") || null;
  const active = runs.find((run) => run.status === "queued" || run.status === "in_progress") || null;
  const failures = runs.filter((run) => run.status === "completed" && run.conclusion !== "success");
  const primaryFailures = failures.filter((run) => primaryWindowRun(run, lane));
  const shouldTakeOver = (primaryWindowPassed && primaryFailures.length >= lane.failureThreshold) || takeoverWindowPassed;
  const dispatchAllowed = (lane.dispatchStages || []).includes(handoffStage);
  let action = "wait";
  let reason = `waiting for ${lane.primaryWindow}`;
  let dispatch = null;
  let ok = true;

  if (ghError) {
    action = "manual_required";
    reason = `GitHub run inspection failed: ${ghError}`;
    ok = false;
  } else if (assets.ready || success) {
    action = "skipped";
    reason = assets.ready
      ? "same-date lane assets are already healthy"
      : `same-date successful workflow already exists: ${success.url}`;
  } else if (active) {
    action = "waiting";
    reason = `same-date workflow is already ${active.status}: ${active.url}`;
  } else if (failures.length >= lane.maxAttempts) {
    action = "manual_required";
    reason = `failed attempts ${failures.length} reached max ${lane.maxAttempts}; stop looping and hand off to Codex`;
    ok = false;
  } else if (!shouldTakeOver) {
    action = "wait";
    reason = `waiting until ${lane.takeoverAfter}; primary_window=${lane.primaryWindow}`;
  } else if (failures.length > 0 && !dispatchAllowed) {
    action = "dispatch_failed";
    reason = `${lane.label} recheck found a failed same-date workflow after its dispatch window; stop reruns and hand off to Codex`;
    ok = false;
  } else if (!dispatchAllowed) {
    action = "manual_required";
    reason = `${lane.label} ${handoffStage} is a recheck/final-review stage, not a new dispatch stage; no healthy assets, success, or active run is visible`;
    ok = false;
  } else if (lane.canDispatch && !lane.canDispatch(assets)) {
    action = "manual_required";
    reason = `${lane.label} primary local output is missing or invalid; Hermes cannot replace the local collector and should hand off to Codex / human operator`;
    ok = false;
  } else {
    dispatch = dispatchWorkflow(lane);
    action = dryRun ? "dry_run_dispatch" : dispatch.ok ? "dispatched" : "dispatch_failed";
    reason = dispatch.ok
      ? `Hermes triggered ${lane.label} after primary scheduled monitoring was exhausted or failed; primary_failures=${primaryFailures.length}; assets_ready=${assets.ready}`
      : `Hermes failed to dispatch ${lane.label}: ${dispatch.output || "unknown error"}`;
    ok = dispatch.ok;
  }

  return {
    ok,
    lane: lane.id,
    label: lane.label,
    workflow: lane.workflowName,
    workflow_file: lane.workflowFile,
    primary_window: lane.primaryWindow,
    primary_start: lane.primaryStart,
    primary_end: lane.primaryEnd,
    action,
    reason,
    handoff_stage: handoffStage,
    takeover_after: lane.takeoverAfter,
    dispatch_allowed: dispatchAllowed,
    primary_window_passed: primaryWindowPassed,
    takeover_window_passed: takeoverWindowPassed,
    should_take_over: shouldTakeOver,
    failure_threshold: lane.failureThreshold,
    max_attempts: lane.maxAttempts,
    same_date_failures: failures.length,
    primary_window_failures: primaryFailures.length,
    assets,
    active_run: active ? summarizeRuns([active], lane)[0] : null,
    successful_run: success ? summarizeRuns([success], lane)[0] : null,
    failed_runs: summarizeRuns(failures, lane),
    runs: summarizeRuns(runs, lane),
    dispatch_output: dispatch?.output || "",
    limitation: lane.limitation || "",
    examples: {
      good: lane.goodExample,
      bad: lane.badExample,
    },
    inbox: "",
  };
}

function writeInbox(laneResult, reportPath) {
  if (!["manual_required", "dispatch_failed"].includes(laneResult.action)) return "";
  fs.mkdirSync(inboxDir, { recursive: true });
  const file = path.join(inboxDir, `${date}-${laneResult.lane}-early-handoff.md`);
  const failedRuns = laneResult.failed_runs.map((run) => `- ${run.conclusion || run.status}: ${run.url}`).join("\n") || "- none";
  const content = [
    "status: open",
    "priority: urgent",
    `lane: ${laneResult.lane}`,
    "category: three_lane_early_handoff_failure",
    `failed_gate: ${rel(reportPath)}`,
    `report_path: ${rel(reportPath)}`,
    "data_generated: unknown",
    "needed_action: repair rule",
    `created_at: ${shanghaiTimestamp()}`,
    `updated_at: ${shanghaiTimestamp()}`,
    "source: hermes-three-lane-early-handoff",
    "",
    `# Hermes Repair Request: ${laneResult.label} Early Handoff`,
    "",
    "## Evidence",
    "",
    `- action: ${laneResult.action}`,
    `- reason: ${laneResult.reason}`,
    `- primary_window_failures: ${laneResult.primary_window_failures}`,
    `- same_date_failures: ${laneResult.same_date_failures}`,
    `- report: \`${rel(reportPath)}\``,
    laneResult.limitation ? `- limitation: ${laneResult.limitation}` : "",
    "",
    "## Failed Runs",
    "",
    failedRuns,
    "",
    "## Required Codex Action",
    "",
    "- Inspect the failed workflow logs and the early handoff report.",
    "- Repair the earliest failing stage instead of blindly rerunning.",
    "- Add or tighten the relevant lane skill eval / example before closing this item.",
    "- Close with `npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>`.",
    "",
  ].filter(Boolean).join("\n");
  fs.writeFileSync(file, content, "utf8");
  return rel(file);
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonFile = path.join(reportsDir, `${date}-hermes-three-lane-early-handoff.json`);
  const mdFile = path.join(reportsDir, `${date}-hermes-three-lane-early-handoff.md`);
  const latestJsonFile = path.join(reportsDir, "hermes-three-lane-early-handoff-latest.json");
  const latestMdFile = path.join(reportsDir, "hermes-three-lane-early-handoff-latest.md");
  const laneSections = payload.lanes.flatMap((lane) => [
    `## ${lane.label}`,
    "",
    `- ok: ${lane.ok}`,
    `- action: ${lane.action}`,
    `- reason: ${lane.reason}`,
    `- workflow: ${lane.workflow_file}`,
    `- primary_window: ${lane.primary_window}`,
    `- primary_end: ${lane.primary_end}`,
    `- handoff_stage: ${lane.handoff_stage}`,
    `- takeover_after: ${lane.takeover_after}`,
    `- dispatch_allowed: ${lane.dispatch_allowed}`,
    `- active_run: ${lane.active_run?.url || "none"}`,
    `- successful_run: ${lane.successful_run?.url || "none"}`,
    `- same_date_failures: ${lane.same_date_failures}`,
    `- assets: \`${JSON.stringify(lane.assets)}\``,
    lane.limitation ? `- limitation: ${lane.limitation}` : "",
    `- good_example: ${lane.examples.good}`,
    `- bad_example: ${lane.examples.bad}`,
    `- inbox: ${lane.inbox || "none"}`,
    "",
  ].filter(Boolean));
  const md = [
    `# Hermes Three-Lane Early Handoff - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- ok: ${payload.ok}`,
    `- dry_run: ${payload.dry_run}`,
    `- schedule: ${handoffSchedule.join(" / ")} Asia/Shanghai`,
    `- handoff_stage: ${payload.handoff_stage}`,
    `- lanes: ${payload.lanes.map((lane) => lane.lane).join(", ")}`,
    "",
    ...laneSections,
    "## Operating Notes",
    "",
    "- Scheduled GitHub / local lane monitors run first. Hermes takes over only after primary monitoring fails, healthy same-date output is missing after the lane's takeover window, and no same-date run is active.",
    "- 09:30 can dispatch Community Intelligence publish and First-Line Viewpoints RSS; Business Signals waits.",
    "- 09:45 can dispatch Business Signals and only rechecks Community / First-Line state.",
    "- 09:55 is final review only: wait for active runs, record dispatch failures, or mark manual_required. It must not start a new routine dispatch.",
    "- Hermes starts the relevant workflow or publish path; lane workflows push automation branches / PRs and Pages deploys after main updates. Hermes does not push directly to main.",
    "- Community Intelligence still depends on the local logged-in Chrome collector; GitHub can only publish validated local output.",
    "- Repeated failures must become Codex repair items with a report path and a prevention artifact.",
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
  const laneResults = lanes.map(superviseLane);
  const initialPayload = {
    ok: laneResults.every((lane) => lane.ok),
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    schedule: handoffSchedule,
    handoff_stage: handoffStage,
    lanes: laneResults,
  };
  const reports = writeReports(initialPayload);
  for (const lane of laneResults) {
    lane.inbox = writeInbox(lane, reports.mdFile);
  }
  const payload = {
    ...initialPayload,
    ok: laneResults.every((lane) => lane.ok),
    lanes: laneResults,
  };
  writeReports(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    date,
    report: rel(reports.jsonFile),
    markdown: rel(reports.mdFile),
    lanes: payload.lanes.map((lane) => ({
      lane: lane.lane,
      action: lane.action,
      ok: lane.ok,
      reason: lane.reason,
      inbox: lane.inbox,
    })),
  }, null, 2));
  if (!payload.ok) process.exitCode = 1;
}

main();
