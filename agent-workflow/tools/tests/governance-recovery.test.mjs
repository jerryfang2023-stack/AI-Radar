import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { auditNavigationContracts } from "../lib/navigation-contracts.mjs";
import { runControllerPhase, inspectControllerReportLiveness } from "../lib/controller-report-liveness.mjs";

test("navigation accepts source links and rejects drift after source versions change", () => {
  const current = { actionIndex: "version-ledger.md#current-version OPS-V3.7.1", experienceRules: "../agent-workflow/skills/skill-registry.md all 24 active governed Skills", opsVersion: "OPS-V3.7.1", governedCount: 24 };
  assert.deepEqual(auditNavigationContracts(current), []);
  const drift = auditNavigationContracts({ ...current, opsVersion: "OPS-V3.8.0", governedCount: 25 });
  assert.equal(drift.length, 2);
  assert.match(drift.join(";"), /stale OPS version/u);
  assert.match(drift.join(";"), /stale governed Skill count/u);
});

test("a controller exception produces a failed terminal result; successful phases retain their result", () => {
  const failure = runControllerPhase(() => { throw new Error("fixture command log cannot be opened"); });
  assert.equal(failure.status, "failed");
  assert.equal(failure.ok, false);
  assert.match(failure.actions[0].stderr, /command log/u);
  const passed = { ok: true, status: "passed", actions: [] };
  assert.equal(runControllerPhase(() => passed), passed);
});

test("an old Final Closure running marker is not completion or current liveness", () => {
  const report = { phase: "final-closure", date: "2026-09-12", status: "running", ok: true, generated_at: "2026-09-12T08:45:02Z", actions: [{}] };
  const result = inspectControllerReportLiveness(report, { phase: report.phase, date: report.date, now: Date.parse("2026-09-12T16:00:00Z") });
  assert.equal(result.observable, false);
  assert.equal(result.runningFresh, false);
});

test("Vault rebuild preserves an existing human workspace entry", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "guanlan-vault-governance-"));
  const vault = path.join(root, "vault-output");
  const repo = path.join(root, "repo");
  fs.mkdirSync(repo);
  const workspace = path.join(vault, "90-工作区/README.md");
  fs.mkdirSync(path.dirname(workspace), { recursive: true });
  fs.writeFileSync(workspace, "# 我的工作区\n[统一管理](00-统一管理/README.md)\n");
  const script = fileURLToPath(new URL("../build-guanlan-vault.mjs", import.meta.url));
  try {
    const result = spawnSync(process.execPath, [script], { cwd: repo, encoding: "utf8", env: { ...process.env, GUANLAN_VAULT_ROOT: vault } });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.equal(fs.readFileSync(workspace, "utf8"), "# 我的工作区\n[统一管理](00-统一管理/README.md)\n");
    const manifest = JSON.parse(fs.readFileSync(path.join(vault, ".guanlan-generated.json"), "utf8"));
    assert.ok(!manifest.generatedFiles.includes("90-工作区/README.md"));
    fs.mkdirSync(path.join(repo, "01-SiteV2/content/12-applications/industry-reports"), { recursive: true });
    fs.appendFileSync(workspace, "Historical path: AI热点/retired\n[[missing-human-note]]\n");
    fs.writeFileSync(path.join(vault, "AGENTS.md"), "Old AI热点/ is retired.\n");
    fs.appendFileSync(path.join(vault, "00-总览/观澜 AI.md"), "\n[[missing-generated-note]]\n");
    const gate = fileURLToPath(new URL("../assert-guanlan-vault.mjs", import.meta.url));
    const gateRun = spawnSync(process.execPath, [gate], { cwd: repo, encoding: "utf8", env: { ...process.env, GUANLAN_VAULT_ROOT: vault } });
    const resultGate = JSON.parse(gateRun.stdout);
    assert.ok(resultGate.problems.some((p) => p.includes("missing-generated-note")));
    assert.ok(!resultGate.problems.some((p) => p.includes("missing-human-note") || p.includes("AGENTS.md")));
    assert.ok(resultGate.workspaceWarnings.some((p) => p.includes("missing-human-note")));
  } finally {
    // root is the exact directory returned by mkdtemp under os.tmpdir().
    fs.rmSync(root, { recursive: true, force: true });
  }
});
