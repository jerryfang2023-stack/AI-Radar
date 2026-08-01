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
});

test("Codex repair runs from a clean isolated worktree", () => {
  const repair = read("run-codex-self-repair.mjs");
  assert.match(repair, /\["worktree", "add", "-b", branch, repairRoot, "origin\/main"\]/u);
  assert.match(repair, /--cd "\$\{repairWorktree\.path\}"/u);
  assert.match(repair, /enforceRepairWorktree\(parseArgList/u);
  assert.doesNotMatch(repair, /--allow-dirty/u);
});

test("supervision separates immutable evidence inputs from runtime outputs", () => {
  const supervision = read("write-daily-supervision-report.mjs");
  assert.match(supervision, /const reportsDir = path\.join\(root, "agent-workflow", "reports"\)/u);
  assert.match(supervision, /const outputDir = path\.resolve/u);
  assert.match(supervision, /path\.join\(outputDir, `\$\{date\}-daily-supervision-report\.json`\)/u);
});
