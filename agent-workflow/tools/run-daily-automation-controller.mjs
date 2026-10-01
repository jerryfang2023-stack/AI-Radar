#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { createStageCheckpoint } from "./lib/daily-stage-checkpoint.mjs";
import { runLoggedCommand, defaultRuntimeDirectory } from "./lib/logged-command.mjs";
import { formatRecordedCommand } from "./lib/report-command.mjs";
import { resolveAutomationNetworkEnv } from "./lib/automation-network-env.mjs";
import {
  runControllerPhase,
  isFreshSupervisionReport,
} from "./lib/controller-report-liveness.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);
const reportsDir = path.resolve(root, args.get("runtime-dir") || defaultRuntimeDirectory());

const phase = args.get("phase") || "daily";
const date = args.get("date") || shanghaiDate();
const dryRun = args.get("dry-run") === "true";
const scheduledRun = args.get("scheduled") === "true";
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

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function run(label, command, commandArgs, timeoutMs = 180_000, cwd = root) {
  if (dryRun) return { label, ok: true, status: "planned", command: formatRecordedCommand(command, commandArgs), stdout: "", stderr: "" };
  const startedAt = new Date().toISOString();
  const result = runLoggedCommand(command, commandArgs, {
    logDir: path.join(reportsDir, "command-logs"),
    label,
    cwd,
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
    stdout_log: result.stdout_log,
    stderr_log: result.stderr_log,
  };
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
  // RSS production remains independent of Business Signals and manual repair.
  const productionOk = business.ok;
  return {
    ok: productionOk,
    status: productionOk ? (skillOpsHealthy ? "passed" : "passed_with_preflight_warning") : "failed",
    lanes: { business },
    actions: [runtimeSync, discoveryRefresh, preflight, business],
    notes: skillOpsHealthy ? [] : ["Repo Skill runtime sync or Skill Ops preflight failed but did not block production dispatch."],
  };
}

// A late launch follows the same state machine; retired clock windows have no authority.
function daily() {
  const dispatch = morning();
  if (dryRun) return { ...dispatch, status: "planned", healthOk: false };
  if (!dispatch.ok) return dispatch;
  let health;
  try { health = JSON.parse(fs.readFileSync(path.join(reportsDir, `${date}-business-signals-health-dispatch.json`), "utf8")); } catch {}
  if (!(health?.date === date && (health.v4?.ready || health.completion_v4?.ready))) {
    return { ...dispatch, healthOk: false, status: health?.action || "waiting", notes: ["Dispatch is not completion. Resume this daily entry after accepted production and publication are ready."] };
  }
  const closure = finalClosure();
  return { ...closure, actions: [...dispatch.actions, ...closure.actions] };
}

function git(args, cwd = root) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true, timeout: 120000 });
  if (result.error || result.status !== 0) throw new Error(`git ${args[0]} failed: ${result.stderr || result.error?.message}`);
  return result.stdout.trim();
}

function finalClosure() {
  if (dryRun) return { ok: true, healthOk: false, status: "planned", actions: [], notes: ["Accepted-main isolation, stage resume, and publication verification will run without fixed clock windows."] };
  git(["fetch", "origin", "+refs/heads/main:refs/remotes/origin/main", "--quiet"]);
  const sourceCommit = git(["rev-parse", "origin/main"]);
  const codeCommit = git(["rev-parse", "HEAD"]);
  const codeDiff = crypto.createHash("sha256").update(git(["diff", "HEAD", "--", "agent-workflow/tools", "package-lock.json"])).digest("hex");
  const primaryRoot = path.dirname(path.resolve(root, git(["rev-parse", "--git-common-dir"])));
  const portalRepo = path.resolve(args.get("portal-repo") || process.env.GUANLAN_FUNDING_PORTAL_REPO || path.join(primaryRoot, "..", "Guanlan-Funding-Portal"));
  const worktree = path.join(reportsDir, "worktrees", `daily-accepted-${process.pid}`);
  const checkpoint = createStageCheckpoint({ file: path.join(reportsDir, `${date}-daily-stages.json`),
    identity: { date, sourceCommit, codeCommit, portalRepo, primaryRoot, codeDiff }, dryRun });
  fs.mkdirSync(path.dirname(worktree), { recursive: true });
  git(["worktree", "add", "--detach", worktree, sourceCommit]);
  let linkedDependencies = false;
  try {
    const dependencyRoot = [root, primaryRoot].find((candidate) => fs.existsSync(path.join(candidate, "node_modules", "ajv"))
      && fs.readFileSync(path.join(candidate, "package-lock.json"), "utf8") === fs.readFileSync(path.join(worktree, "package-lock.json"), "utf8"));
    if (!dependencyRoot) throw new Error("accepted_dependencies_missing: run npm ci in the controller checkout with the accepted package-lock.json");
    fs.symlinkSync(path.join(dependencyRoot, "node_modules"), path.join(worktree, "node_modules"), process.platform === "win32" ? "junction" : "dir");
    linkedDependencies = true;
    for (const name of [".guanlan-vault.json"]) {
      const source = path.join(primaryRoot, name);
      if (fs.existsSync(source)) fs.copyFileSync(source, path.join(worktree, name));
    }
    return closeAccepted({ worktree, primaryRoot, portalRepo, checkpoint, sourceCommit });
  } finally {
    // Unlink the task-owned junction before Git cleans the checkout; never
    // traverse or delete the dependency directory in the primary repository.
    if (linkedDependencies) fs.unlinkSync(path.join(worktree, "node_modules"));
    // Only our just-created checkout is removed. Failed command logs and receipts remain outside it.
    git(["worktree", "remove", "--force", "--", worktree]);
  }
}

function closeAccepted({ worktree, primaryRoot, portalRepo, checkpoint, sourceCommit }) {
  const actions = [];
  const step = (id, label, command, commandArgs, timeout = 180000, always = false) => {
    if (actions.some((item) => !item.ok)) return { label, ok: false, status: "blocked_dependency", command: "not executed" };
    const result = checkpoint.run(id, () => {
      const value = run(label, command, commandArgs, timeout, worktree);
      // Child publishers can refresh origin/main. Never cache a receipt under
      // an older source identity if a newer accepted batch appeared mid-run.
      if (git(["rev-parse", "origin/main"]) !== sourceCommit) return { ...value, ok: false, status: "source_changed_resume_required" };
      return value;
    }, { always });
    actions.push(result); return result;
  };
  const lake = `--lake-dir=${path.join(primaryRoot, "data-lake")}`;
  const dataLake = step("data_lake", "Refresh V4 data lake", process.execPath, [
    "agent-workflow/tools/sync-light-data-lake.mjs", "--v4-only=true", lake,
  ], 600000);
  const dataLakeGate = step("data_lake_gate", "Assert V4 data lake", process.execPath, [
    "agent-workflow/tools/assert-data-lake-v4.mjs", lake,
  ]);
  const vaultSync = step("vault", "Refresh Guanlan Vault from origin/main", process.execPath, [
    "agent-workflow/tools/sync-guanlan-vault-from-main.mjs", `--date=${date}`, `--runtime-dir=${reportsDir}`,
  ], 600000);
  const fundingGate = step("funding_gate", "Assert accepted funding cards", process.execPath, [
    "agent-workflow/tools/assert-funding-insights-v1.mjs", `--date=${date}`,
  ]);
  const fundingPortal = step("portal", "Publish Funding Portal to VPS", process.execPath, [
    path.join(portalRepo, "scripts", "publish-from-wavesight.mjs"), `--wavesight-repo=${worktree}`,
  ], 900000);
  const opsPublication = step("ops", "Publish protected OPS from accepted main", process.execPath, [
    "agent-workflow/tools/publish-ops-console.mjs",
  ], 300000);
  const discoveryRefresh = step("skills", "Refresh Skill discovery summary before final supervision", process.execPath, [
    "agent-workflow/tools/build-skill-store-dashboard.mjs", `--output=${path.join(reportsDir, "local-skill-store-data.js")}`,
  ]);
  const supervision = step("supervision", "Final daily supervision", process.execPath, [
    "agent-workflow/tools/write-daily-supervision-report.mjs", `--date=${date}`, "--hermes=off",
    `--output-dir=${reportsDir}`,
  ], 300000, true);
  const evidenceSupply = step("evidence_health", "Evidence supply health", process.execPath, [
    "agent-workflow/tools/write-evidence-supply-health-report.mjs", `--date=${date}`, `--output-dir=${reportsDir}`,
  ], 180000, true);
  const recurringIncidents = step("incidents", "Recurring issue repair tasks", process.execPath, [
    "agent-workflow/tools/write-recurring-production-incidents.mjs", `--date=${date}`, "--days=7", "--threshold=2",
    `--reports-dir=${reportsDir}`, `--inbox-dir=${path.join(reportsDir, "production-incidents")}`,
  ], 180000, true);
  let report;
  try { report = JSON.parse(fs.readFileSync(path.join(reportsDir, `${date}-daily-supervision-report.json`), "utf8")); } catch {}
  const fresh = isFreshSupervisionReport(report, supervision, date);
  const ok = [dataLake, dataLakeGate, vaultSync, fundingGate, fundingPortal, opsPublication, discoveryRefresh, supervision, evidenceSupply, recurringIncidents].every((item) => item.ok) && fresh;
  return { ok, healthOk: ok && Boolean(report?.ok), status: ok ? report?.ok ? "closed" : "closed_with_lane_findings" : "closure_execution_failed",
    source_commit: sourceCommit, lanes: fresh ? report.lanes : [], actions,
    notes: ["Only accepted main is published. Successful stages are reused for the same source/code/config; failed stages resume without recollection.",
      "Consumer AI hardware is part of domestic and overseas funding production. Builders and Community keep independent weekly schedules."] };
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
  if (!new Set(["daily", "morning", "recovery", "closure", "final-closure"]).has(phase)) {
    throw new Error(`Unsupported phase: ${phase}`);
  }
  writeReport({
    ok: false,
    healthOk: false,
    status: "running",
    pid: process.pid,
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
  const result = runControllerPhase(() => {
    // Old Windows timers cannot resurrect duplicate execution after migration.
    if (scheduledRun && phase !== "daily") return { ok: true, healthOk: false, status: "retired_schedule", actions: [], notes: ["Use the unified Codex daily task. This legacy timer is retired."] };
    if (phase === "daily" || phase === "recovery") return daily();
    if (phase === "morning") return morning();
    return finalClosure();
  });
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
