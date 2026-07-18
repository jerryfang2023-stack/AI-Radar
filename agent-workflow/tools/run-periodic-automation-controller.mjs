#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const phase = args.get("phase") || "weekly-report";
const date = args.get("date") || shanghaiDate();
const dryRun = args.get("dry-run") === "true";
const worker = args.get("worker") === "true";
const force = args.get("force") === "true";
const reportsDir = path.join(root, "agent-workflow", "reports");

function shanghaiDate(value = new Date()) {
  const parsed = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(parsed);
}

function addDays(dateText, offset) {
  const value = new Date(`${dateText}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
}

function weeklyWindow(anchor) {
  const value = new Date(`${anchor}T00:00:00Z`);
  const day = value.getUTCDay();
  const end = addDays(anchor, -(day === 0 ? 7 : day));
  return { start: addDays(end, -6), end, reportDate: anchor };
}

function monthlyWindow(anchor) {
  const value = new Date(`${anchor}T00:00:00Z`);
  const end = new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 0));
  const start = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1));
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10), reportDate: end.toISOString().slice(0, 10) };
}

function firstBusinessDay(anchor) {
  const value = new Date(`${anchor.slice(0, 7)}-01T00:00:00Z`);
  while ([0, 6].includes(value.getUTCDay())) value.setUTCDate(value.getUTCDate() + 1);
  return value.toISOString().slice(0, 10);
}

function rel(file, base = root) {
  return path.relative(base, file).replace(/\\/gu, "/");
}

function run(label, command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd || root,
    encoding: "utf8",
    input: options.input,
    timeout: options.timeoutMs || 300_000,
    windowsHide: true,
  });
  return {
    label,
    ok: !result.error && result.status === 0,
    status: result.status,
    command: [command, ...commandArgs].join(" "),
    stdout: String(result.stdout || "").trim().slice(0, 16000),
    stderr: String(result.stderr || result.error?.message || "").trim().slice(0, 16000),
  };
}

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}

function writeText(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, "utf8");
}

function pageGate(cwd) {
  const actions = [];
  actions.push(run("build Industry Reports projection", process.execPath, ["01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs"], { cwd }));
  if (actions.at(-1).ok) actions.push(run("Industry Reports tests", process.execPath, ["--test", "agent-workflow/tools/tests/industry-reports-frontstage.test.mjs"], { cwd }));
  if (actions.at(-1).ok) actions.push(run("frontstage regression gate", process.execPath, ["agent-workflow/tools/frontstage-regression-gate.mjs"], { cwd, timeoutMs: 600_000 }));
  if (actions.at(-1).ok) actions.push(run("V4 visual smoke", "npm", ["run", "test:v4-frontstage-smoke"], { cwd, timeoutMs: 900_000 }));
  return { ok: actions.every((item) => item.ok), actions };
}

function workerRun(kind) {
  const window = kind === "weekly" ? weeklyWindow(date) : monthlyWindow(date);
  const actions = [];
  if (kind === "monthly") {
    actions.push(run("monthly maintenance", process.execPath, ["agent-workflow/tools/write-monthly-maintenance-report.mjs", `--date=${date}`, "--days=30"]));
    if (!actions.at(-1).ok) return { ok: false, status: "monthly_maintenance_failed", window, actions };
  }

  if (kind === "weekly") {
    actions.push(run("refresh weekly opportunity signals", process.execPath, [
      "agent-workflow/tools/backfill-opportunity-signals.mjs", "--write=true", `--from=${window.start}`, `--to=${window.end}`,
    ]));
    if (actions.at(-1).ok) actions.push(run("rebuild weekly compatibility projection", process.execPath, [
      "01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs", `--date=${date}`,
    ]));
    if (!actions.at(-1).ok) return { ok: false, status: "opportunity_refresh_failed", window, actions };
  }

  const content = run("DeepSeek Pro report draft", process.execPath, [
    "agent-workflow/tools/generate-periodic-report-deepseek.mjs", `--kind=${kind}`, `--date=${window.reportDate}`,
    `--window-start=${window.start}`, `--window-end=${window.end}`,
  ], { timeoutMs: 600_000 });
  actions.push(content);
  if (!content.ok) return { ok: false, status: "content_generation_failed", window, actions };

  const contentGate = run("content acceptance gate", process.execPath, [
    "agent-workflow/tools/assert-periodic-report-content.mjs", `--kind=${kind}`, `--date=${window.reportDate}`,
    `--window-start=${window.start}`, `--window-end=${window.end}`,
  ]);
  actions.push(contentGate);
  if (!contentGate.ok) return { ok: false, status: "content_gate_failed", window, actions };

  const page = run("deterministic report page renderer", process.execPath, [
    "agent-workflow/tools/render-periodic-report-pages.mjs", `--kind=${kind}`, `--date=${window.reportDate}`,
  ]);
  actions.push(page);
  if (!page.ok) return { ok: false, status: "page_generation_failed", window, actions };
  const gate = pageGate(root);
  actions.push(...gate.actions);
  return { ok: gate.ok, status: gate.ok ? "page_gate_passed" : "page_gate_failed", window, actions };
}

function writeWeeklyEscalation(payload) {
  const escalations = payload?.loopEscalations || [];
  if (!escalations.length) return "";
  const inbox = path.join(root, "agent-workflow", "inbox", "hermes-to-codex", `${date}-skill_ops-weekly-learning-loop.md`);
  if (/^status:\s*resolved$/imu.test(fs.existsSync(inbox) ? fs.readFileSync(inbox, "utf8") : "")) return rel(inbox);
  writeText(inbox, [
    "status: open", "priority: medium", "lane: skill_ops", `created_at: ${new Date().toISOString()}`,
    "failed_gate: weekly_learning_loop", `report_path: agent-workflow/reports/${date}-weekly-health.md`,
    "data_generated: not_applicable", "needed_action: add or tighten gate / eval / MEMORY prevention", "",
    `# Weekly Learning Loop - ${date}`, "", "## Repeated Problems", "", ...escalations.map((item) => `- ${item}`), "",
    "## Completion Rule", "", "Codex must implement the smallest durable gate, eval, or MEMORY prevention, rerun the failed check, and record validation before resolving this item.", "",
  ].join("\n"));
  return rel(inbox);
}

function weeklyHealth() {
  const health = run("weekly health", process.execPath, ["agent-workflow/tools/write-weekly-health-report.mjs", `--date=${date}`, "--days=7"], { timeoutMs: 600_000 });
  const payload = readJson(path.join(reportsDir, `${date}-weekly-health.json`), null);
  const inbox = health.ok && payload ? writeWeeklyEscalation(payload) : "";
  return { ok: health.ok, status: health.ok ? (inbox ? "gate_eval_handoff_created" : "passed") : "failed", actions: [health], inbox, window: { start: addDays(date, -6), end: date, reportDate: date } };
}

function changedPaths(cwd) {
  const tracked = run("changed files", "git", ["diff", "--name-only", "HEAD"], { cwd });
  const untracked = run("untracked files", "git", ["ls-files", "--others", "--exclude-standard"], { cwd });
  if (!tracked.ok || !untracked.ok) return { ok: false, paths: [], actions: [tracked, untracked] };
  return { ok: true, paths: [...new Set(`${tracked.stdout}\n${untracked.stdout}`.split(/\r?\n/u).filter(Boolean))], actions: [tracked, untracked] };
}

function allowedPath(file, kind) {
  const common = ["agent-workflow/reports/", "01-SiteV2/content/08-report/", "01-SiteV2/site/data/industry-reports-frontstage.json", "01-SiteV2/site/intelligence-map.html"];
  const weekly = ["01-SiteV2/knowledge/01-Signal-Cards/", "01-SiteV2/site/data/v3-data-observation-desk.json", "01-SiteV2/site/data/intelligence-graph-index.json", "01-SiteV2/site/data/enterprise-ai-fde.json", "01-SiteV2/site/weekly-ai-business-change-radar", "01-SiteV2/site/assets/weekly-report.css", "01-SiteV2/site/assets/data-center-v4.css", "01-SiteV2/site/assets/v4-report-shell.js"];
  const monthly = ["01-SiteV2/site/monthly-business-structure-", "01-SiteV2/site/assets/reports.css", "01-SiteV2/site/assets/data-center-v4.css", "01-SiteV2/site/assets/v4-report-shell.js"];
  return [...common, ...(kind === "weekly" ? weekly : monthly)].some((prefix) => file === prefix || file.startsWith(prefix));
}

function ephemeralPath(file) {
  return /-periodic-(?:weekly-report|monthly)-(?:content|page)-(?:prompt|last-message)\.md$/u.test(file);
}

function isolatedReportRun(kind) {
  const branch = `codex/automation-${kind}-report-${date}`;
  const branchExists = run("branch check", "git", ["show-ref", "--verify", "--quiet", `refs/heads/${branch}`]);
  if (branchExists.ok) return { ok: true, status: "already_prepared", branch, actions: [branchExists], window: kind === "weekly" ? weeklyWindow(date) : monthlyWindow(date) };
  const worktree = path.join(os.tmpdir(), `wavesight-${kind}-report-${date}`);
  if (fs.existsSync(worktree)) return { ok: false, status: "existing_worktree_requires_review", branch, worktree, actions: [], window: kind === "weekly" ? weeklyWindow(date) : monthlyWindow(date) };
  const add = run("create isolated worktree", "git", ["worktree", "add", "-b", branch, worktree, "HEAD"], { timeoutMs: 900_000 });
  if (!add.ok) return { ok: false, status: "worktree_create_failed", branch, worktree, actions: [add] };
  const install = run("install dependencies", "npm", ["ci"], { cwd: worktree, timeoutMs: 900_000 });
  if (!install.ok) return { ok: false, status: "dependency_install_failed", branch, worktree, actions: [add, install] };
  const execute = run("periodic worker", process.execPath, [
    "agent-workflow/tools/run-periodic-automation-controller.mjs", `--phase=${phase}`, `--date=${date}`, "--worker=true", `--force=${force}`,
  ], { cwd: worktree, timeoutMs: 7_200_000 });
  if (!execute.ok) return { ok: false, status: "worker_failed", branch, worktree, actions: [add, install, execute] };
  const changes = changedPaths(worktree);
  const materialPaths = changes.paths.filter((file) => !ephemeralPath(file));
  const unexpected = materialPaths.filter((file) => !allowedPath(file, kind));
  if (!changes.ok || unexpected.length) return { ok: false, status: "unexpected_changes", branch, worktree, unexpected, actions: [add, install, execute, ...changes.actions] };
  if (!materialPaths.length) return { ok: false, status: "no_generated_changes", branch, worktree, actions: [add, install, execute, ...changes.actions] };
  const stage = run("stage periodic outputs", "git", ["add", "--", ...materialPaths], { cwd: worktree });
  const commit = stage.ok ? run("commit periodic outputs", "git", ["commit", "-m", `${kind === "weekly" ? "Generate weekly report and opportunity map" : "Generate monthly structure report"} for ${date}`], { cwd: worktree, timeoutMs: 300_000 }) : null;
  if (!stage.ok || !commit?.ok) return { ok: false, status: "local_commit_failed", branch, worktree, actions: [add, install, execute, ...changes.actions, stage, ...(commit ? [commit] : [])] };
  const temporaryRoot = `${path.resolve(os.tmpdir())}${path.sep}`;
  if (!path.resolve(worktree).startsWith(temporaryRoot)) return { ok: false, status: "unsafe_worktree_cleanup_target", branch, worktree, actions: [add, install, execute, ...changes.actions, stage, commit] };
  const remove = run("remove isolated worktree", "git", ["worktree", "remove", "--force", worktree], { timeoutMs: 900_000 });
  return { ok: remove.ok, status: remove.ok ? "local_branch_ready" : "worktree_cleanup_failed", branch, worktree, changed: materialPaths, actions: [add, install, execute, ...changes.actions, stage, commit, remove], window: kind === "weekly" ? weeklyWindow(date) : monthlyWindow(date) };
}

function writeControllerReport(result) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-periodic-automation-${phase}.json`);
  const mdPath = path.join(reportsDir, `${date}-periodic-automation-${phase}.md`);
  const payload = { ...result, phase, date, dry_run: dryRun, report_provider: "deepseek", generated_at: new Date().toISOString() };
  const md = [
    `# Periodic Automation ${phase} - ${date}`, "", `- status: ${result.status}`, `- ok: ${result.ok}`,
    `- branch: ${result.branch || "n/a"}`, `- worktree: ${result.worktree || "n/a"}`, `- inbox: ${result.inbox || "n/a"}`, "",
    "## Actions", "", "| Action | Result |", "|---|---|", ...(result.actions || []).map((item) => `| ${item.label} | ${item.ok ? "passed" : "failed"} |`), "",
    ...(result.unexpected?.length ? ["## Unexpected Changes", "", ...result.unexpected.map((item) => `- ${item}`), ""] : []),
  ].join("\n");
  writeText(jsonPath, `${JSON.stringify(payload, null, 2)}\n`);
  writeText(mdPath, md);
  return { jsonPath, mdPath };
}

function main() {
  if (!new Set(["weekly-report", "weekly-health", "monthly"]).has(phase)) throw new Error(`Unsupported phase: ${phase}`);
  if (phase === "monthly" && !force && date !== firstBusinessDay(date)) {
    const result = { ok: true, status: "not_first_business_day", actions: [], window: monthlyWindow(date) };
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (dryRun) {
    const window = phase === "monthly"
      ? monthlyWindow(date)
      : phase === "weekly-health"
        ? { start: addDays(date, -6), end: date, reportDate: date }
        : weeklyWindow(date);
    const result = { ok: true, status: "dry_run", actions: [], window, first_business_day: phase === "monthly" ? firstBusinessDay(date) : "" };
    writeControllerReport(result);
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  const result = worker
    ? workerRun(phase === "weekly-report" ? "weekly" : "monthly")
    : phase === "weekly-health" ? weeklyHealth() : isolatedReportRun(phase === "weekly-report" ? "weekly" : "monthly");
  const report = writeControllerReport(result);
  console.log(JSON.stringify({ ok: result.ok, status: result.status, phase, date, branch: result.branch || "", report: rel(report.jsonPath) }, null, 2));
  if (!result.ok) process.exit(1);
}

main();
