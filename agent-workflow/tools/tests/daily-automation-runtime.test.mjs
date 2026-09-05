import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { resolveAutomationNetworkEnv } from "../lib/automation-network-env.mjs";
import { runLoggedCommand, CODEX_REPAIR_TIMEOUT_MS, CODEX_REPAIR_HANDOFF_TIMEOUT_MS } from "../lib/logged-command.mjs";
import { refreshRepairWorktree } from "../lib/repair-worktree.mjs";
import { successfulPagesDeployment } from "../wait-for-pages-deployment.mjs";
import { writeRecurringIncidents } from "../write-recurring-production-incidents.mjs";
import {
  controllerRecoveryOwnershipReason,
  inspectControllerReportLiveness,
} from "../lib/controller-report-liveness.mjs";

const root = process.cwd();
const read = (name) => fs.readFileSync(path.join(root, "agent-workflow", "tools", name), "utf8");

test("agent output above the default pipe limit is retained without ENOBUFS", () => {
  const logDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-command-log-"));
  try {
    const result = runLoggedCommand(process.execPath, ["-e", `
      const fs = require('node:fs');
      fs.writeSync(1, 'x'.repeat(2 * 1024 * 1024) + 'stdout-end');
      fs.writeSync(2, 'y'.repeat(2 * 1024 * 1024) + 'stderr-end');
      fs.writeSync(1, fs.readFileSync(0, 'utf8'));
    `], { logDir, input: "-input", timeout: 10000, maxOutputBytes: 1024 });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0);
    assert.equal(result.stdout.length, 1024);
    assert.match(result.stdout, /stdout-end-input$/u);
    assert.match(result.stderr, /stderr-end$/u);
    assert.ok(fs.statSync(result.stdout_log).size > 2 * 1024 * 1024);
    const failed = runLoggedCommand(process.execPath, ["-e", "process.exit(7)"], { logDir, timeout: 10000 });
    assert.equal(failed.status, 7);
    const timedOut = runLoggedCommand(process.execPath, ["-e", "setInterval(() => {}, 1000)"], { logDir, timeout: 200 });
    assert.equal(timedOut.error?.code, "ETIMEDOUT");
    assert.equal(timedOut.status, null);
  } finally {
    fs.rmSync(logDir, { recursive: true, force: true });
  }
});

test("the handoff budget outlives the Codex budget and report finalization", () => {
  assert.ok(CODEX_REPAIR_HANDOFF_TIMEOUT_MS >= CODEX_REPAIR_TIMEOUT_MS + 180000);
  assert.match(read("run-daily-automation-controller.mjs"), /\], CODEX_REPAIR_HANDOFF_TIMEOUT_MS\)/u);
});

test("Pages supersession requires a successful deployment of the target or its descendant", async () => {
  const source = "a".repeat(40);
  const descendant = "b".repeat(40);
  const old = "c".repeat(40);
  const run = (sha, conclusion = "success", databaseId = 1) => ({
    headBranch: "main", event: "workflow_dispatch", status: "completed", conclusion, databaseId,
    displayTitle: `Deploy Frontstage to GitHub Pages ${sha}`, headSha: descendant,
  });
  const ancestry = async (base, head) => base === source && head === descendant;
  assert.equal(await successfulPagesDeployment([run(source, "cancelled"), run(old)], source, ancestry), null);
  assert.equal((await successfulPagesDeployment([run(source, "cancelled"), run(descendant, "success", 2)], source, ancestry)).databaseId, 2);
  assert.equal((await successfulPagesDeployment([run(source)], source, ancestry)).deployedSha, source);
  assert.equal(await successfulPagesDeployment([{ ...run(source), headBranch: "unmerged" }], source, ancestry), null);
});

test("final-closure incident drafts do not dirty the canonical repository", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-incident-runtime-"));
  const repo = path.join(fixture, "repo");
  const inbox = path.join(fixture, "runtime", "production-incidents");
  fs.mkdirSync(repo);
  try {
    const issues = [{ lane: "business_signals", kind: "problem", fingerprint: "abc123",
      count: 2, dates: ["2026-09-04", "2026-09-05"], report_paths: ["runtime://daily-supervision/2026-09-05"], message: "fixture failure" }];
    const result = writeRecurringIncidents(repo, "2026-09-05", issues, inbox);
    assert.equal(result.created.length, 1);
    assert.deepEqual(fs.readdirSync(repo), []);
    assert.equal(writeRecurringIncidents(repo, "2026-09-05", issues, inbox).existing.length, 1);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test("clean stale repair worktrees fast-forward, while unique and dirty work are preserved", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-repair-base-"));
  const repo = path.join(fixture, "repo");
  const repair = path.join(fixture, "repair");
  const remote = path.join(fixture, "remote.git");
  fs.mkdirSync(repo);
  const git = (cwd, args) => {
    const result = spawnSync("git", args, { cwd, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  try {
    git(repo, ["init", "-b", "main"]);
    git(repo, ["config", "user.name", "Fixture"]);
    git(repo, ["config", "user.email", "fixture@example.invalid"]);
    git(repo, ["commit", "--allow-empty", "-m", "base"]);
    git(fixture, ["clone", "--bare", repo, remote]);
    git(repo, ["remote", "add", "origin", remote]);
    git(repo, ["worktree", "add", "-b", "repair", repair]);
    git(repo, ["commit", "--allow-empty", "-m", "new main"]);
    git(repo, ["push", "origin", "main"]);
    const refreshed = refreshRepairWorktree(repo, repair, "repair");
    assert.equal(refreshed.ok, true, refreshed.reason);
    assert.equal(refreshed.base_sha, git(repo, ["rev-parse", "HEAD"]));
    fs.writeFileSync(path.join(repair, "user-note.txt"), "preserve");
    assert.equal(refreshRepairWorktree(repo, repair, "repair").ok, false);
    assert.equal(fs.readFileSync(path.join(repair, "user-note.txt"), "utf8"), "preserve");
    git(repair, ["add", "user-note.txt"]);
    git(repair, ["commit", "-m", "unique work"]);
    const unique = git(repair, ["rev-parse", "HEAD"]);
    assert.equal(refreshRepairWorktree(repo, repair, "repair").ok, false);
    assert.equal(git(repair, ["rev-parse", "HEAD"]), unique);
    assert.equal(refreshRepairWorktree(repo, repo, "main").ok, false);
    assert.equal(refreshRepairWorktree(repo, repair, "wrong-branch").ok, false);
  } finally {
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});

test("scheduled controllers keep runtime reports outside the repository", () => {
  const installer = read("install-daily-automation-controller-tasks.ps1");
  assert.match(installer, /LOCALAPPDATA[^\n]+WaveSight\\runtime/u);
  assert.match(installer, /--runtime-dir=/u);
  assert.match(installer, /--scheduled=true/u);
  assert.match(read("install-hermes-control-plane-watchdog-task.ps1"), /--reports-dir=/u);
  assert.match(read("install-community-intelligence-task.ps1"), /-RuntimePath/u);
  assert.match(read("install-follow-builders-skill-task.ps1"), /-RuntimePath/u);
  assert.match(read("run-community-intelligence.ps1"), /LOCALAPPDATA[^\n]+WaveSight\\runtime/u);
  assert.match(read("run-community-intelligence.ps1"), /publish-community-intelligence-local\.mjs[^]*--reports-dir=\$RuntimePath/u);
  assert.match(read("run-community-intelligence.ps1"), /assert:community-intelligence[^]*--reports-dir=\$RuntimePath/u);
  const communityPublisher = read("publish-community-intelligence-local.mjs");
  assert.match(communityPublisher, /args\.get\("reports-dir"\)/u);
  assert.match(communityPublisher, /assert-community-intelligence-data\.mjs[^]*--reports-dir=/u);
  assert.doesNotMatch(communityPublisher, /stageIfExists\(`agent-workflow\/reports/u);
  assert.match(read("run-follow-builders-skill.ps1"), /--output-dir=\$RuntimePath/u);
  const controller = read("run-daily-automation-controller.mjs");
  assert.match(controller, /run-business-signals-health-dispatch\.mjs[^]*--reports-dir=/u);
  assert.match(controller, /assert-follow-builders-data\.mjs[^]*--reports-dir=/u);
  assert.match(controller, /assert-community-intelligence-data\.mjs[^]*--reports-dir=/u);
  assert.match(controller, /assert-data-center-projection-coverage\.mjs[^]*--reports-dir=/u);
  assert.equal(
    (controller.match(/build-skill-store-dashboard\.mjs[^]*?--output=/gu) || []).length,
    2,
    "morning and final-closure Skill dashboard refreshes must write to runtime",
  );
  assert.match(read("build-skill-store-dashboard.mjs"), /startsWith\("--output="\)/u);
  assert.match(read("run-business-signals-health-dispatch.mjs"), /args\.get\("reports-dir"\)/u);
  assert.match(read("assert-community-intelligence-data.mjs"), /args\.get\("reports-dir"\)/u);
  assert.match(read("assert-data-center-projection-coverage.mjs"), /args\.get\("reports-dir"\)/u);
  assert.match(read("assert-data-center-v4.mjs"), /--reports-dir=/u);
  const selfCheck = read("run-daily-self-check.mjs");
  assert.match(selfCheck, /assert:community-intelligence[^]*--reports-dir=/u);
  assert.match(selfCheck, /assert-follow-builders-data\.mjs[^]*--reports-dir=/u);
  assert.match(selfCheck, /assert:data-center[^]*--reports-dir=/u);
});

test("late scheduled controller phases are superseded instead of colliding", () => {
  const controller = read("run-daily-automation-controller.mjs");
  const watchdog = read("run-hermes-control-plane-watchdog.mjs");
  assert.match(controller, /const scheduledRun = args\.get\("scheduled"\) === "true"/u);
  assert.match(controller, /morning: \{ minute: 9 \* 60 \+ 15, next: "recovery" \}/u);
  assert.match(controller, /recovery: \{ minute: 9 \* 60 \+ 50, next: "closure" \}/u);
  assert.match(controller, /closure: \{ minute: 16 \* 60 \+ 45, next: "final-closure" \}/u);
  assert.match(controller, /status: "superseded"/u);
  assert.match(watchdog, /args\.get\("grace-ms"\) \|\| "15000"/u);
  assert.match(watchdog, /inspectControllersWithGrace/u);
  assert.match(controller, /inspectControllerReportLiveness\(recoveryReport/u);
  assert.match(controller, /controllerRecoveryOwnershipReason/u);
  assert.match(controller, /const laneRecovery = ownsLaneRecovery \? recovery\(\) : null/u);
  assert.match(controller, /actions: \[\.\.\.\(laneRecovery\?\.actions \|\| \[\]\), runtimeSync, coverageAction, selfCheck, codex\]/u);
  assert.match(controller, /status: "running"[^]*internal: controller running/u);
});

test("Closure records the exact reason when it takes Recovery ownership", () => {
  const date = "2026-08-27";
  const report = {
    ok: true,
    status: "running",
    phase: "recovery",
    date,
    generated_at: "2026-08-27T00:00:00.000Z",
    actions: [{ label: "recovery", ok: true }],
  };
  const liveness = inspectControllerReportLiveness(report, {
    phase: "recovery",
    date,
    now: Date.parse("2026-08-27T01:00:00.000Z"),
  });
  assert.equal(
    controllerRecoveryOwnershipReason({ scheduledRun: true, report, liveness }),
    "expired or clock-skewed Recovery running marker",
  );
  assert.equal(
    controllerRecoveryOwnershipReason({
      scheduledRun: true,
      report: { ...report, status: "superseded" },
      liveness: { ...liveness, runningFresh: true, observable: true },
    }),
    "superseded Recovery report",
  );
});

test("late scheduled morning execution writes an observable superseded report", () => {
  const reportsDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-controller-catchup-"));
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  const result = spawnSync(process.execPath, [
    path.join(root, "agent-workflow", "tools", "run-daily-automation-controller.mjs"),
    "--phase=morning",
    "--scheduled=true",
    `--date=${date}`,
    `--now=${date}T17:20:00+08:00`,
    `--runtime-dir=${reportsDir}`,
  ], { cwd: root, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const report = JSON.parse(fs.readFileSync(path.join(reportsDir, `${date}-daily-automation-morning.json`), "utf8"));
  assert.equal(report.status, "superseded");
  assert.equal(report.scheduled_run, true);
  assert.equal(report.actions.length, 1);
});

test("scheduled automation bypasses loopback services and falls back from an unavailable local proxy", () => {
  const controller = read("run-daily-automation-controller.mjs");
  const hermes = read("run-hermes-control-plane-cycle.mjs");
  const community = read("run-community-intelligence.ps1");
  const followBuilders = read("run-follow-builders-skill.ps1");
  const network = read("Set-WaveSightAutomationNetwork.ps1");
  assert.match(controller, /resolveAutomationNetworkEnv/u);
  assert.match(controller, /env: automationNetwork\.env/u);
  assert.match(hermes, /resolveAutomationNetworkEnv/u);
  assert.match(hermes, /env: automationNetwork\.env/u);
  assert.match(community, /Set-WaveSightAutomationNetwork\.ps1/u);
  assert.match(followBuilders, /Set-WaveSightAutomationNetwork\.ps1/u);
  assert.match(network, /localhost[^]*127\.0\.0\.1[^]*::1/u);
  assert.match(network, /using direct fallback for this run/u);
});

test("network preflight removes only unavailable loopback proxies", async () => {
  const fallback = await resolveAutomationNetworkEnv({
    HTTP_PROXY: "http://127.0.0.1:8889",
    HTTPS_PROXY: "https://proxy.example.com:443",
    NO_PROXY: "internal.example.com",
  }, { canConnect: async () => false });
  assert.equal(fallback.mode, "direct_fallback");
  assert.equal(fallback.env.HTTP_PROXY, undefined);
  assert.equal(fallback.env.HTTPS_PROXY, "https://proxy.example.com:443");
  assert.match(fallback.env.NO_PROXY, /internal\.example\.com/u);
  assert.match(fallback.env.NO_PROXY, /127\.0\.0\.1/u);

  const configured = await resolveAutomationNetworkEnv({
    ALL_PROXY: "socks5://localhost:8889",
  }, { canConnect: async () => true });
  assert.equal(configured.mode, "configured");
  assert.equal(configured.env.ALL_PROXY, "socks5://localhost:8889");
});

test("follow-builders generation and publication run from an isolated worktree", () => {
  const runner = read("run-follow-builders-skill.ps1");
  assert.match(runner, /worktree add -b \$runBranch \$runWorktree origin\/main/u);
  assert.match(runner, /Join-Path \$runWorktree "agent-workflow\\tools\\publish-follow-builders-skill-local\.mjs"/u);
  assert.match(runner, /Push-Location \$runWorktree/u);
  assert.match(runner, /worktree remove --force -- \$runWorktree/u);
  assert.match(runner, /git pull --ff-only origin main/u);
});

test("community collection restarts only its dedicated Chrome after a CDP timeout", () => {
  const runner = read("run-community-intelligence.ps1");
  assert.match(runner, /function Stop-DedicatedCommunityChrome/u);
  assert.match(runner, /\.codex-browser-profile\\community-scan/u);
  assert.match(runner, /connectOverCDP\[\\s\\S\]\*Timeout[^]*Stop-DedicatedCommunityChrome/u);
  assert.match(runner, /Retrying immediately after the dedicated browser restart/u);
  assert.match(runner, /CommandLine\.ToLowerInvariant\(\)\.Contains\(\$profileLower\)/u);
});

test("community collection stops immediately when output reports expired login", () => {
  const runner = read("run-community-intelligence.ps1");
  const loginCheck = runner.indexOf('$detail -match "COMMUNITY_LOGIN_REQUIRED"');
  const exitCheck = runner.indexOf("if ($exitCode -ne 0)");
  assert.ok(loginCheck >= 0, "runner must inspect collector output for the login marker");
  assert.ok(loginCheck < exitCheck, "login marker must be handled even when the collector exits zero");
  assert.match(runner, /if \(\$lastError -match "COMMUNITY_LOGIN_REQUIRED"\)[^]*MANUAL_ACTION_REQUIRED[^]*break/u);
});

test("closure reuses its self-check instead of running it twice", () => {
  const controller = read("run-daily-automation-controller.mjs");
  const repair = read("run-codex-self-repair.mjs");
  assert.match(controller, /--reuse-self-check=true/u);
  assert.match(repair, /reuseSelfCheck \? reusedSelfCheckCommand\(\) : runDailySelfCheck\(\)/u);
  assert.match(controller, /same_date_production_waiting/u);
  assert.match(controller, /lane\.id === "business_signals" && lane\.status === "waiting"/u);
  assert.match(controller, /status: ok \? waiting \? "waiting" : "closed"/u);
  assert.match(controller, /write-evidence-supply-health-report\.mjs[^]*--output-dir=/u);
  assert.match(controller, /write-recurring-production-incidents\.mjs[^]*--reports-dir=/u);
  assert.match(controller, /sync-guanlan-vault-from-main\.mjs[^]*--runtime-dir=/u);
  assert.match(controller, /Guanlan-Funding-Portal[^]*publish-from-wavesight\.mjs/u);
  assert.match(controller, /executionOk = [^\n]*fundingPortal\.ok/u);
});

test("closure resolves and forwards an absolute Codex executable", () => {
  const installer = read("install-daily-automation-controller-tasks.ps1");
  const controller = read("run-daily-automation-controller.mjs");
  assert.match(installer, /function Resolve-CodexExecutable/u);
  assert.match(installer, /WaveSight\\codex-cli/u);
  assert.match(installer, /npm install --prefix \$managedRoot "@openai\/codex@latest"/u);
  assert.match(installer, /MinimumVersion \(\[version\]"0\.151\.0"\)/u);
  assert.match(installer, /Test-CodexExecutable -Candidate \$command\.Source -MinimumVersion/u);
  assert.match(installer, /Test-CodexExecutable -Candidate \$managedExecutable/u);
  assert.match(installer, /--codex-command="' \+ \$CodexExecutable/u);
  assert.match(controller, /const codexCommand = args\.get\("codex-command"\) \|\| "codex"/u);
  assert.match(controller, /`--codex-command=\$\{codexCommand\}`/u);
});

test("Vault refresh uses an isolated origin/main worktree and leaves supervision evidence", () => {
  const sync = read("sync-guanlan-vault-from-main.mjs");
  const supervision = read("write-daily-supervision-report.mjs");
  const vaultGate = read("assert-guanlan-vault.mjs");
  assert.match(sync, /git[^]*worktree[^]*add[^]*--detach[^]*origin\/main/u);
  assert.match(sync, /build-guanlan-vault\.mjs/u);
  assert.match(sync, /sync-guanlan-evidence\.mjs/u);
  assert.match(sync, /assert-guanlan-vault\.mjs/u);
  assert.doesNotMatch(sync, /copyLocalConfig\("\.evidence-backup\.json"\)/u);
  assert.match(sync, /worktree[^]*remove[^]*--force/u);
  assert.match(sync, /guanlan-vault-sync\.json/u);
  assert.match(supervision, /vaultSync\.current/u);
  assert.match(vaultGate, /function directoryContainsFiles[^]*retiredVaultRootHasContent[^]*directoryContainsFiles\(retiredVaultRoot\)/u);
  assert.match(vaultGate, /VAULT_SCAN_SKIP_DIRECTORIES[^]*node_modules[^]*!VAULT_SCAN_SKIP_DIRECTORIES\.has\(entry\.name\.toLowerCase\(\)\)/u);
});

test("morning controller repairs derived repo Skill runtime before auditing it", () => {
  const controller = read("run-daily-automation-controller.mjs");
  const syncIndex = controller.indexOf('"agent-workflow/tools/sync-repo-skills.mjs"');
  const discoveryIndex = controller.indexOf('"agent-workflow/tools/build-skill-store-dashboard.mjs"');
  const checkIndex = controller.indexOf('"agent-workflow/tools/check-skill-ops.mjs"');
  assert.ok(syncIndex >= 0, "morning controller must sync the derived repo Skill runtime");
  assert.ok(discoveryIndex > syncIndex, "Skill discovery summary must refresh after runtime synchronization");
  assert.ok(checkIndex > discoveryIndex, "Skill Ops audit must run after discovery refresh");
  assert.match(controller.slice(discoveryIndex, checkIndex), /--output=/u);
  assert.match(controller, /actions: \[runtimeSync, discoveryRefresh, preflight, business\]/u);
});

test("closure resyncs the derived repo Skill runtime after same-day main updates", () => {
  const controller = read("run-daily-automation-controller.mjs");
  const closure = controller.slice(
    controller.indexOf("function closure()"),
    controller.indexOf("function finalClosure()"),
  );
  const syncIndex = closure.indexOf('"agent-workflow/tools/sync-repo-skills.mjs"');
  const selfCheckIndex = closure.indexOf('"agent-workflow/tools/run-daily-self-check.mjs"');
  assert.ok(syncIndex >= 0, "closure must rematerialize runtime Skills after publication updates main");
  assert.ok(selfCheckIndex > syncIndex, "closure must sync runtime Skills before the daily self-check");
  assert.match(closure, /const ok = runtimeSync\.ok && coverageAction\.ok && selfCheck\.ok && codex\.ok/u);
  assert.match(closure, /actions: \[\.\.\.\(laneRecovery\?\.actions \|\| \[\]\), runtimeSync, coverageAction, selfCheck, codex\]/u);
});

test("final closure refreshes Skill discovery immediately before supervision", () => {
  const controller = read("run-daily-automation-controller.mjs");
  assert.match(
    controller,
    /const discoveryRefresh = run\("Refresh Skill discovery summary before final supervision"[^]*const supervision = run\("Final daily supervision"/u,
  );
  assert.match(
    controller,
    /Refresh Skill discovery summary before final supervision[^]*build-skill-store-dashboard\.mjs[^]*--output=/u,
  );
  assert.match(controller, /fundingPortal\.ok && discoveryRefresh\.ok && supervisionReported/u);
  assert.match(controller, /fundingPortal, discoveryRefresh, supervisionAction/u);
});

test("periodic reports tolerate slower cloud generation and expose failed child diagnostics", () => {
  const generator = read("generate-periodic-report-deepseek.mjs");
  const controller = read("run-periodic-automation-controller.mjs");
  assert.match(generator, /DEEPSEEK_PERIODIC_REPORT_TIMEOUT_MS \|\| 300000/u);
  assert.match(generator, /timeoutMs: reportTimeoutMs/u);
  assert.match(controller, /filter\(\(item\) => !item\.ok\)/u);
  assert.match(controller, /\{ label: item\.label, status: item\.status, stdout: item\.stdout, stderr: item\.stderr \}/u);
});

test("Codex repair runs from a clean isolated worktree", () => {
  const repair = read("run-codex-self-repair.mjs");
  assert.match(repair, /\["worktree", "add", "-b", branch, repairRoot, "origin\/main"\]/u);
  assert.match(repair, /--cd "\$\{repairWorktree\.path\}"/u);
  assert.match(repair, /enforceRepairWorktree\(parseArgList/u);
  assert.match(repair, /`--ask-for-approval never exec --sandbox danger-full-access/u);
  assert.doesNotMatch(repair, /`exec [^`]*--ask-for-approval/u);
  assert.doesNotMatch(repair, /--allow-dirty/u);
});

test("supervision separates immutable evidence inputs from runtime outputs", () => {
  const supervision = read("write-daily-supervision-report.mjs");
  assert.match(supervision, /const reportsDir = path\.join\(root, "agent-workflow", "reports"\)/u);
  assert.match(supervision, /const outputDir = path\.resolve/u);
  assert.match(supervision, /path\.join\(outputDir, `\$\{date\}-daily-supervision-report\.json`\)/u);
  const communityLane = supervision.slice(
    supervision.indexOf("function buildCommunityLane("),
    supervision.indexOf("function buildSkillOpsLane()"),
  );
  assert.match(communityLane, /path\.join\(outputDir, `\$\{date\}-community-intelligence-gate\.md`\)/u);
  assert.match(communityLane, /path\.join\(\s*outputDir,\s*"community-intelligence"/u);
});
