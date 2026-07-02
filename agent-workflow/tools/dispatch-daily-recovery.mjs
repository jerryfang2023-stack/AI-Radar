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

const WORKFLOWS = {
  business_signals: {
    label: "Business Signals",
    workflow: "daily-persistent-assets-pr.yml",
    workflowName: "WaveSight Business Signals PR",
    maxAttempts: 4,
    dispatchArgs: (date) => ["-f", `date=${date}`, "-f", "pass_score=85"],
  },
  first_line_viewpoints: {
    label: "First-Line Viewpoints",
    workflow: "daily-first-line-viewpoints-pr.yml",
    workflowName: "WaveSight First-Line Viewpoints PR",
    maxAttempts: 4,
    dispatchArgs: (date) => ["-f", `date=${date}`],
  },
  community_publish: {
    label: "Community Intelligence Publish",
    workflow: "daily-community-intelligence-pr.yml",
    workflowName: "WaveSight Community Intelligence PR",
    maxAttempts: 2,
    dispatchArgs: (date) => ["-f", `date=${date}`],
    ready: communityPublishReady,
  },
};

const WORKFLOW_NAME_TO_LANE = new Map(
  Object.entries(WORKFLOWS).map(([lane, config]) => [config.workflowName, lane])
);

const mode = args.get("mode") || "manual";
const sourceWorkflow = args.get("source-workflow") || "";
const sourceConclusion = args.get("source-conclusion") || "";
const date = args.get("date") || shanghaiDate(args.get("source-created-at") || new Date());
const defaultMaxAttempts = Number.parseInt(args.get("max-attempts") || "0", 10);
const requestedLanes = resolveRequestedLanes();
const dryRun = args.get("dry-run") === "true";
const inboxDir = path.join(root, "agent-workflow", "inbox", "hermes-to-codex");

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

function resolveRequestedLanes() {
  const lanes = args.get("lanes") || "";
  if (lanes && lanes !== "auto") {
    return lanes.split(",").map((lane) => lane.trim()).filter(Boolean);
  }

  if (mode === "workflow_run" && sourceWorkflow) {
    const lane = WORKFLOW_NAME_TO_LANE.get(sourceWorkflow);
    return lane ? [lane] : [];
  }

  return ["business_signals", "first_line_viewpoints", "community_publish"];
}

function workflowRuns(config) {
  const result = run("gh", [
    "run",
    "list",
    "--workflow",
    config.workflow,
    "--limit",
    "40",
    "--json",
    "databaseId,status,conclusion,event,createdAt,updatedAt,url,headBranch,displayTitle",
  ]);
  return JSON.parse(result);
}

function sameDateRuns(runs) {
  return runs.filter((run) => shanghaiDate(run.createdAt) === date);
}

function communityPublishReady(targetDate) {
  const data = readJson(path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json"), {});
  const generatedDate = shanghaiDate(data?.meta?.generatedAt || "");
  const items = Array.isArray(data.items) ? data.items.length : 0;
  const links = Array.isArray(data.links) ? data.links.length : 0;
  const errors = Array.isArray(data?.meta?.errors) ? data.meta.errors.length : 0;
  const archive = path.join(root, "01-SiteV2", "content", "07-community-intelligence", "daily", `${targetDate} Community Intelligence.md`);
  const ready = generatedDate === targetDate && items >= 12 && links >= 3 && errors === 0 && fs.existsSync(archive);
  return {
    ready,
    reason: ready
      ? "same-date local community data is present in checkout"
      : `community publish skipped because local collected data is not present in checkout (generatedDate=${generatedDate || "missing"}, items=${items}, links=${links}, errors=${errors})`,
  };
}

function inspectLane(lane) {
  const config = WORKFLOWS[lane];
  if (!config) {
    return { lane, ok: false, action: "skipped", reason: "unknown lane" };
  }

  if (mode === "workflow_run" && sourceConclusion === "success") {
    return { lane, ok: true, action: "skipped", reason: "source workflow succeeded" };
  }

  const ready = config.ready ? config.ready(date) : { ready: true, reason: "" };
  if (!ready.ready) {
    return { lane, ok: true, action: "skipped", reason: ready.reason };
  }

  const runs = sameDateRuns(workflowRuns(config));
  const successful = runs.find((run) => run.conclusion === "success");
  if (successful) {
    return {
      lane,
      ok: true,
      action: "skipped",
      reason: `same-date successful run already exists: ${successful.url}`,
    };
  }

  const active = runs.find((run) => run.status === "queued" || run.status === "in_progress");
  if (active) {
    return {
      lane,
      ok: true,
      action: "skipped",
      reason: `same-date run is already ${active.status}: ${active.url}`,
    };
  }

  const failedAttempts = runs.filter((run) => run.status === "completed" && run.conclusion !== "success").length;
  const maxAttempts = defaultMaxAttempts > 0 ? defaultMaxAttempts : config.maxAttempts;
  if (failedAttempts >= maxAttempts) {
    return {
      lane,
      ok: false,
      action: "manual_required",
      reason: `failed attempts ${failedAttempts} reached max ${maxAttempts}; daily problem watchdog will not dispatch recovery`,
      failedAttempts,
      maxAttempts,
    };
  }

  if (failedAttempts > 0 || mode === "workflow_run") {
    return {
      lane,
      ok: false,
      action: "inbox_required",
      reason: `same-date healthy output is not visible after ${failedAttempts} failed attempt(s); record inbox and wait for targeted repair`,
      failedAttempts,
      maxAttempts,
    };
  }

  return {
    lane,
    ok: true,
    action: "observed",
    reason: "no failed same-date run found; no recovery dispatch is allowed from this watchdog",
    failedAttempts,
    maxAttempts,
  };
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonFile = path.join(reportsDir, `${date}-daily-recovery-watchdog.json`);
  const mdFile = path.join(reportsDir, `${date}-daily-recovery-watchdog.md`);
  const rows = payload.results.map((item) => (
    `| ${item.lane} | ${item.action} | ${item.ok ? "yes" : "no"} | ${item.reason || ""} |`
  ));
  const md = [
    `# WaveSight Daily Problem Watchdog - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- mode: ${payload.mode}`,
    `- source_workflow: ${payload.source_workflow || "none"}`,
    `- source_conclusion: ${payload.source_conclusion || "none"}`,
    "",
    "| Lane | Action | OK | Reason |",
    "|---|---|---|---|",
    ...rows,
    "",
  ].join("\n");
  fs.writeFileSync(jsonFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdFile, `${md}\n`, "utf8");
  return { jsonFile, mdFile };
}

function priorityForLane(lane) {
  return lane === "business_signals" ? "urgent" : "high";
}

function writeInbox(payload, reportPath) {
  fs.mkdirSync(inboxDir, { recursive: true });
  const created = [];
  const problemResults = payload.results.filter((item) => !item.ok || ["manual_required", "inbox_required"].includes(item.action));

  for (const item of problemResults) {
    const file = path.join(inboxDir, `${date}-${item.lane}-daily-problem-watchdog.md`);
    const laneConfig = WORKFLOWS[item.lane] || {};
    const md = [
      `status: open`,
      `priority: ${priorityForLane(item.lane)}`,
      `lane: ${item.lane}`,
      `failed_gate: daily_problem_watchdog`,
      `report_path: ${rel(reportPath)}`,
      `data_generated: unknown`,
      `needed_action: inspect failed production report and repair the smallest responsible stage; do not dispatch a full rerun from Hermes`,
      `created_at: ${payload.generated_at}`,
      `source: daily_problem_watchdog`,
      `source_workflow: ${payload.source_workflow || laneConfig.workflowName || "unknown"}`,
      `source_run_id: ${payload.source_run_id || "unknown"}`,
      `source_conclusion: ${payload.source_conclusion || "unknown"}`,
      "",
      `# ${laneConfig.label || item.lane} Daily Problem Watchdog (${date})`,
      "",
      "## Evidence",
      "",
      `- action: ${item.action}`,
      `- reason: ${item.reason || "unknown"}`,
      `- failed_attempts: ${item.failedAttempts ?? "unknown"}`,
      `- max_attempts_reference: ${item.maxAttempts ?? "unknown"}`,
      `- source_workflow: ${payload.source_workflow || laneConfig.workflowName || "unknown"}`,
      `- source_run_id: ${payload.source_run_id || "unknown"}`,
      `- source_conclusion: ${payload.source_conclusion || "unknown"}`,
      "",
      "## Expected Codex Action",
      "",
      "1. Read the report_path and the failed production workflow artifact first.",
      "2. Classify the earliest responsible stage before running anything.",
      "3. Repair the smallest script, gate, rule, or data build path that caused the incident.",
      "4. Rerun only the exact failed gate or the smallest relevant validation.",
      "5. Close with `npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>`.",
      "",
    ].join("\n");
    fs.writeFileSync(file, `${md}\n`, "utf8");
    created.push(rel(file));
  }

  return created;
}

function main() {
  if (!date) throw new Error("Unable to resolve recovery date.");
  const results = requestedLanes.map(inspectLane);
  const payload = {
    ok: results.every((item) => item.ok),
    date,
    generated_at: new Date().toISOString(),
    mode,
    source_workflow: sourceWorkflow,
    source_conclusion: sourceConclusion,
    source_run_id: args.get("source-run-id") || "",
    lanes: requestedLanes,
    results,
  };
  const reports = writeReports(payload);
  const inboxFiles = writeInbox(payload, reports.mdFile);
  console.log(JSON.stringify({
    ok: true,
    problem_count: inboxFiles.length,
    date,
    reports: {
      json: rel(reports.jsonFile),
      markdown: rel(reports.mdFile),
    },
    inbox: inboxFiles,
    results,
  }, null, 2));
}

main();
