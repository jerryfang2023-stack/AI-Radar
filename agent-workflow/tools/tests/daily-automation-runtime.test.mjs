import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (name) => fs.readFileSync(path.join(root, "agent-workflow", "tools", name), "utf8");

test("scheduled controllers keep runtime reports outside the repository", () => {
  const installer = read("install-daily-automation-controller-tasks.ps1");
  assert.match(installer, /LOCALAPPDATA[^\n]+WaveSight\\runtime/u);
  assert.match(installer, /--runtime-dir=/u);
  assert.match(read("install-hermes-control-plane-watchdog-task.ps1"), /--reports-dir=/u);
  assert.match(read("install-community-intelligence-task.ps1"), /-RuntimePath/u);
  assert.match(read("install-follow-builders-skill-task.ps1"), /-RuntimePath/u);
  assert.match(read("run-community-intelligence.ps1"), /LOCALAPPDATA[^\n]+WaveSight\\runtime/u);
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
  assert.match(installer, /npm install --prefix \$managedRoot "@openai\/codex"/u);
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
});
