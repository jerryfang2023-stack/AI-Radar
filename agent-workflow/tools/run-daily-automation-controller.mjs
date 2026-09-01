#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { formatRecordedCommand } from "./lib/report-command.mjs";
import { resolveAutomationNetworkEnv } from "./lib/automation-network-env.mjs";
import {
  controllerRecoveryOwnershipReason,
  inspectControllerReportLiveness,
} from "./lib/controller-report-liveness.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);
const reportsDir = path.resolve(root, args.get("runtime-dir") || path.join("agent-workflow", "reports"));

const phase = args.get("phase") || "morning";
const date = args.get("date") || shanghaiDate();
const currentTime = args.has("now") ? new Date(args.get("now")) : new Date();
const dryRun = args.get("dry-run") === "true";
const scheduledRun = args.get("scheduled") === "true";
const invokeCodex = args.get("invoke-codex") !== "false";
const codexCommand = args.get("codex-command") || "codex";
const automationNetwork = await resolveAutomationNetworkEnv();

function shanghaiDate(value = new Date()) {
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

function shanghaiMinuteOfDay(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Shanghai",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(value);
  const hour = Number(parts.find((item) => item.type === "hour")?.value || 0);
  const minute = Number(parts.find((item) => item.type === "minute")?.value || 0);
  return hour * 60 + minute;
}

function scheduledSupersession(currentPhase, value = currentTime) {
  if (!scheduledRun || shanghaiDate(value) !== date) return null;
  const minute = shanghaiMinuteOfDay(value);
  const thresholds = {
    morning: { minute: 9 * 60 + 15, next: "recovery" },
    recovery: { minute: 9 * 60 + 50, next: "closure" },
    closure: { minute: 16 * 60 + 45, next: "final-closure" },
  };
  const threshold = thresholds[currentPhase];
  if (!threshold || minute < threshold.minute) return null;
  return {
    ok: true,
    healthOk: true,
    status: "superseded",
    actions: [{
      label: `Skip stale scheduled ${currentPhase} phase`,
      ok: true,
      status: 0,
      command: `internal: superseded by ${threshold.next}`,
      stdout: "",
      stderr: "",
    }],
    notes: [`Late Task Scheduler catch-up skipped ${currentPhase}; ${threshold.next} owns the current recovery window.`],
  };
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readControllerReport(currentPhase) {
  try {
    return JSON.parse(fs.readFileSync(
      path.join(reportsDir, `${date}-daily-automation-${currentPhase}.json`),
      "utf8",
    ));
  } catch {
    return null;
  }
}

function run(label, command, commandArgs, timeoutMs = 180_000) {
  const startedAt = new Date().toISOString();
  const result = spawnSync(command, commandArgs, {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true,
    env: automationNetwork.env,
  });
  return {
    label,
    ok: !result.error && result.status === 0,
    status: result.status,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    command: formatRecordedCommand(command, commandArgs),
    stdout: String(result.stdout || "").trim(),
    stderr: String(result.stderr || result.error?.message || "").trim(),
  };
}

function workflowRuns(workflow) {
  const result = run("inspect workflow", "gh", [
    "run", "list", "--workflow", workflow, "--limit", "30",
    "--json", "databaseId,status,conclusion,createdAt,url",
  ]);
  if (!result.ok) return { available: false, result, runs: [] };
  try {
    const runs = JSON.parse(result.stdout || "[]")
      .filter((item) => shanghaiDate(item.createdAt) === date);
    return { available: true, result, runs };
  } catch (error) {
    return { available: false, result: { ...result, ok: false, stderr: error.message }, runs: [] };
  }
}

function dispatchWorkflow(workflow) {
  const commandArgs = ["workflow", "run", workflow, "-f", `date=${date}`];
  if (dryRun) {
    return {
      label: `dispatch ${workflow}`,
      ok: true,
      status: 0,
      command: `dry-run: gh ${commandArgs.join(" ")}`,
      stdout: "",
      stderr: "",
    };
  }
  return run(`dispatch ${workflow}`, "gh", commandArgs);
}

function morning() {
  const runtimeSync = run("Sync repo Skill runtime", process.execPath, [
    "agent-workflow/tools/sync-repo-skills.mjs",
  ]);
  const discoveryRefresh = run("Refresh Skill discovery summary", process.execPath, [
    "agent-workflow/tools/build-skill-store-dashboard.mjs",
    `--output=${path.join(reportsDir, "local-skill-store-data.js")}`,
  ]);
  const preflight = run("Skill Ops preflight", process.execPath, [
    "agent-workflow/tools/check-skill-ops.mjs",
    `--dashboard=${path.join(reportsDir, "local-skill-store-data.js")}`,
  ]);
  const business = run("Data Center V4 production dispatch", process.execPath, [
    "agent-workflow/tools/run-business-signals-health-dispatch.mjs",
    `--date=${date}`,
    `--reports-dir=${reportsDir}`,
    ...(dryRun ? ["--dry-run=true"] : []),
  ]);
  const skillOpsHealthy = runtimeSync.ok && discoveryRefresh.ok && preflight.ok;
  return {
    ok: business.ok,
    status: business.ok ? (skillOpsHealthy ? "passed" : "passed_with_preflight_warning") : "failed",
    actions: [runtimeSync, discoveryRefresh, preflight, business],
    notes: skillOpsHealthy ? [] : ["Repo Skill runtime sync or Skill Ops preflight failed but did not block production dispatch."],
  };
}

function firstLineRecovery() {
  const gate = run("First-Line Viewpoints gate", process.execPath, [
    "agent-workflow/tools/assert-follow-builders-data.mjs",
    `--date=${date}`,
    `--reports-dir=${reportsDir}`,
  ]);
  if (gate.ok) return { ok: true, status: "healthy", actions: [gate] };

  const workflow = "daily-first-line-viewpoints-pr.yml";
  const inspected = workflowRuns(workflow);
  const active = inspected.runs.find((item) => ["queued", "in_progress"].includes(item.status));
  const successful = inspected.runs.find((item) => item.conclusion === "success");
  if (!inspected.available) return { ok: false, status: "inspection_failed", actions: [gate, inspected.result] };
  if (active) return { ok: true, status: "waiting", actions: [gate, inspected.result], run: active };
  if (successful) {
    return {
      ok: false,
      status: "publication_repair_required",
      actions: [gate, inspected.result],
      run: successful,
    };
  }
  const dispatch = dispatchWorkflow(workflow);
  return {
    ok: dispatch.ok,
    status: dispatch.ok ? "fallback_dispatched" : "dispatch_failed",
    actions: [gate, inspected.result, dispatch],
  };
}

function communityRecovery() {
  const gate = run("Community Intelligence gate", process.execPath, [
    "agent-workflow/tools/assert-community-intelligence-data.mjs",
    `--date=${date}`,
    `--reports-dir=${reportsDir}`,
  ]);
  return {
    ok: gate.ok,
    status: gate.ok ? "healthy" : "local_repair_required",
    actions: [gate],
    note: gate.ok ? "" : "GitHub cannot replace the local logged-in collector; repair the local collection stage only.",
  };
}

function recovery() {
  const business = run("Data Center V4 recovery router", process.execPath, [
    "agent-workflow/tools/run-business-signals-health-dispatch.mjs",
    `--date=${date}`,
    `--reports-dir=${reportsDir}`,
    ...(dryRun ? ["--dry-run=true"] : []),
  ]);
  const firstLine = firstLineRecovery();
  const community = communityRecovery();
  const healthOk = business.ok && firstLine.ok && community.ok;
  return {
    ok: true,
    healthOk,
    status: healthOk ? "passed_or_waiting" : "targeted_repair_required",
    lanes: { business, first_line_viewpoints: firstLine, community_intelligence: community },
    actions: [business, ...firstLine.actions, ...community.actions],
    notes: [
      community.note,
      healthOk ? "" : "Each lane completed its own check; one unhealthy lane did not block the others.",
    ].filter(Boolean),
  };
}

function closure() {
  const recoveryReport = readControllerReport("recovery");
  const recoveryLiveness = inspectControllerReportLiveness(recoveryReport, {
    phase: "recovery",
    date,
  });
  const recoveryOwnershipReason = controllerRecoveryOwnershipReason({
    scheduledRun,
    report: recoveryReport,
    liveness: recoveryLiveness,
  });
  const ownsLaneRecovery = Boolean(recoveryOwnershipReason);
  const laneRecovery = ownsLaneRecovery ? recovery() : null;
  const runtimeSync = run("Sync repo Skill runtime before closure", process.execPath, [
    "agent-workflow/tools/sync-repo-skills.mjs",
  ]);
  const coverage = run("Data Center projection coverage", process.execPath, [
    "agent-workflow/tools/assert-data-center-projection-coverage.mjs",
    `--date=${date}`,
    `--reports-dir=${reportsDir}`,
  ]);
  const selfCheck = run("Daily self-check and safe repair", process.execPath, [
    "agent-workflow/tools/run-daily-self-check.mjs",
    `--date=${date}`,
    "--repair=safe",
    `--runtime-dir=${reportsDir}`,
  ], 300_000);
  const codex = run("Codex targeted repair handoff", process.execPath, [
    "agent-workflow/tools/run-codex-self-repair.mjs",
    `--date=${date}`,
    "--repair=safe",
    `--invoke=${invokeCodex ? "on" : "off"}`,
    `--codex-command=${codexCommand}`,
    `--runtime-dir=${reportsDir}`,
    "--reuse-self-check=true",
  ], 900_000);
  const selfCheckPayload = (() => {
    try {
      return JSON.parse(fs.readFileSync(path.join(reportsDir, `${date}-daily-self-check.json`), "utf8"));
    } catch {
      return null;
    }
  })();
  const supervisionPayload = (() => {
    try {
      return JSON.parse(fs.readFileSync(path.join(reportsDir, `${date}-daily-supervision-report.json`), "utf8"));
    } catch {
      return null;
    }
  })();
  const businessWaiting = supervisionPayload?.lanes?.some((lane) => lane.id === "business_signals" && lane.status === "waiting");
  const waiting = selfCheck.ok && (selfCheckPayload?.status === "waiting" || businessWaiting);
  const coverageAction = waiting && !coverage.ok
    ? { ...coverage, ok: true, observed_ok: false, resolution: "same_date_production_waiting" }
    : coverage;
  const ok = runtimeSync.ok && coverageAction.ok && selfCheck.ok && codex.ok;
  return {
    ok,
    healthOk: !waiting && Boolean(selfCheckPayload?.ok) && coverage.ok,
    status: ok ? waiting ? "waiting" : "closed" : "repair_required",
    actions: [...(laneRecovery?.actions || []), runtimeSync, coverageAction, selfCheck, codex],
    notes: [
      ...(ownsLaneRecovery
        ? [`Closure owns deterministic lane recovery: ${recoveryOwnershipReason}.`]
        : ["The completed Recovery controller retains lane ownership for this scheduled Closure run."]),
      ...(waiting ? ["Same-date production is active; Closure recorded waiting instead of a false missing-data failure."] : []),
    ],
  };
}

function finalClosure() {
  const dataLake = run("Refresh V4 data lake", process.execPath, [
    "agent-workflow/tools/sync-light-data-lake.mjs",
    "--v4-only=true",
  ], 600_000);
  const dataLakeGate = run("Assert V4 data lake", process.execPath, [
    "agent-workflow/tools/assert-data-lake-v4.mjs",
  ], 180_000);
  const vaultSync = run("Refresh Guanlan Vault from origin/main", process.execPath, [
    "agent-workflow/tools/sync-guanlan-vault-from-main.mjs",
    `--date=${date}`,
    `--runtime-dir=${reportsDir}`,
    ...(dryRun ? ["--dry-run=true"] : []),
  ], 600_000);
  const fundingPortal = run("Publish Funding Portal to VPS", process.execPath, [
    path.resolve(root, "..", "Guanlan-Funding-Portal", "scripts", "publish-from-wavesight.mjs"),
    `--wavesight-repo=${root}`,
    ...(dryRun ? ["--dry-run=true"] : []),
  ], 900_000);
  const discoveryRefresh = run("Refresh Skill discovery summary before final supervision", process.execPath, [
    "agent-workflow/tools/build-skill-store-dashboard.mjs",
    `--output=${path.join(reportsDir, "local-skill-store-data.js")}`,
  ]);
  const supervision = run("Final daily supervision", process.execPath, [
    "agent-workflow/tools/write-daily-supervision-report.mjs",
    `--date=${date}`,
    "--hermes=off",
    "--force-afternoon-window=true",
    `--output-dir=${reportsDir}`,
    ...(dryRun ? ["--github=false", "--scheduled-task=false"] : []),
  ], 300_000);
  const evidenceSupply = run("Evidence supply health", process.execPath, [
    "agent-workflow/tools/write-evidence-supply-health-report.mjs",
    `--date=${date}`,
    `--output-dir=${reportsDir}`,
  ]);
  const recurringIncidents = run("Recurring issue repair tasks", process.execPath, [
    "agent-workflow/tools/write-recurring-production-incidents.mjs",
    `--date=${date}`,
    "--days=7",
    "--threshold=2",
    `--reports-dir=${reportsDir}`,
  ]);
  const supervisionPayload = (() => {
    try {
      return JSON.parse(fs.readFileSync(
        path.join(reportsDir, `${date}-daily-supervision-report.json`),
        "utf8",
      ));
    } catch {
      return null;
    }
  })();
  const supervisionReported = Boolean(supervisionPayload);
  const supervisionAction = {
    ...supervision,
    ok: supervisionReported,
    health_status: supervisionPayload?.status || "report_missing",
  };
  const executionOk = dataLake.ok && dataLakeGate.ok && vaultSync.ok && fundingPortal.ok && discoveryRefresh.ok && supervisionReported && evidenceSupply.ok && recurringIncidents.ok;
  return {
    ok: executionOk,
    healthOk: Boolean(supervisionPayload?.ok),
    status: executionOk
      ? supervisionPayload?.status === "passed" ? "closed" : "closed_with_lane_findings"
      : "closure_execution_failed",
    lanes: supervisionPayload?.lanes || [],
    actions: [dataLake, dataLakeGate, vaultSync, fundingPortal, discoveryRefresh, supervisionAction, evidenceSupply, recurringIncidents],
    notes: [
      "This is the final closure after the 16:10 First-Line Viewpoints window.",
      "The local V4 JSONL and DuckDB serving layer is rebuilt here; no independent data-lake task is supported.",
      "Accepted Funding Insights changes are validated, committed to the independent portal repository, and atomically deployed to the VPS here.",
      "Lane findings remain isolated; the report records them without suppressing other lane results.",
    ],
  };
}

function writeReport(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const base = `${date}-daily-automation-${phase}`;
  const jsonPath = path.join(reportsDir, `${base}.json`);
  const mdPath = path.join(reportsDir, `${base}.md`);
  const laneValues = Array.isArray(payload.lanes)
    ? payload.lanes
    : Object.entries(payload.lanes || {}).map(([id, lane]) => ({ id, ...lane }));
  const lines = [
    `# WaveSight Daily Automation ${phase} - ${date}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- ok: ${payload.ok}`,
    `- dry_run: ${dryRun}`,
    "",
    "## Actions",
    "",
    "| Action | Status | Command |",
    "|---|---|---|",
    ...payload.actions.map((item) => `| ${item.label} | ${item.ok ? "passed" : "failed"} | \`${item.command}\` |`),
    "",
    "## Notes",
    "",
    ...(payload.notes?.length ? payload.notes.map((item) => `- ${item}`) : ["- none"]),
    "",
    ...(laneValues.length ? [
      "## Lane Closure",
      "",
      "| Lane | Status |",
      "|---|---|",
      ...laneValues.map((lane) => `| ${lane.label || lane.id || "unknown"} | ${lane.status || (lane.ok ? "passed" : "failed")} |`),
      "",
    ] : []),
  ];
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, lines.join("\n"), "utf8");
  return { jsonPath, mdPath };
}

function main() {
  if (!date) throw new Error("Unable to resolve Asia/Shanghai production date.");
  if (!new Set(["morning", "recovery", "closure", "final-closure"]).has(phase)) {
    throw new Error(`Unsupported phase: ${phase}`);
  }
  writeReport({
    ok: true,
    healthOk: false,
    status: "running",
    phase,
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    scheduled_run: scheduledRun,
    network_mode: automationNetwork.mode,
    actions: [{
      label: `${phase} controller started`,
      ok: true,
      status: 0,
      command: "internal: controller running",
      stdout: "",
      stderr: "",
    }],
    notes: ["The final report will replace this liveness marker when the controller exits."],
  });
  const result = scheduledSupersession(phase) || (phase === "morning"
    ? morning()
    : phase === "recovery"
      ? recovery()
      : phase === "closure" ? closure() : finalClosure());
  const payload = {
    ...result,
    phase,
    date,
    generated_at: new Date().toISOString(),
    dry_run: dryRun,
    scheduled_run: scheduledRun,
    network_mode: automationNetwork.mode,
  };
  const report = writeReport(payload);
  console.log(JSON.stringify({
    ok: payload.ok,
    status: payload.status,
    phase,
    date,
    report: rel(report.jsonPath),
    markdown: rel(report.mdPath),
  }, null, 2));
  if (!payload.ok) process.exit(1);
}

main();
