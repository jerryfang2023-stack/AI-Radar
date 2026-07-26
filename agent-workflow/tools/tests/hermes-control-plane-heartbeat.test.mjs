import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const runner = path.join(root, "agent-workflow", "tools", "publish-hermes-control-plane-heartbeat.mjs");
const date = "2026-07-26";

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value)}\n`, "utf8");
}

function createReports({ missingPhase = "" } = {}) {
  const reportsDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-heartbeat-"));
  for (const phase of ["morning", "recovery", "closure"]) {
    if (phase === missingPhase) continue;
    writeJson(path.join(reportsDir, `${date}-daily-automation-${phase}.json`), {
      ok: phase !== "closure",
      status: phase === "closure" ? "repair_required" : "passed",
      phase,
      date,
      generated_at: `2026-07-26T0${phase === "morning" ? "0" : phase === "recovery" ? "1" : "2"}:00:00.000Z`,
      actions: [{ label: phase, command: "private command", stdout: "private output" }],
    });
  }
  writeJson(path.join(reportsDir, `${date}-hermes-control-plane-watchdog.json`), {
    ok: !missingPhase,
    status: missingPhase ? "manual_required" : "passed",
    date,
    generated_at: "2026-07-26T02:20:02.148Z",
  });
  return reportsDir;
}

function runDry(reportsDir) {
  return spawnSync(process.execPath, [
    runner,
    `--date=${date}`,
    `--reports-dir=${reportsDir}`,
    "--repo=jerryfang2023-stack/AI-Radar",
    "--dry-run=true",
  ], { cwd: root, encoding: "utf8" });
}

test("heartbeat publishes only sanitized controller metadata", () => {
  const reportsDir = createReports();
  const result = runDry(reportsDir);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.heartbeat.status, "passed");
  assert.deepEqual(output.heartbeat.controllers.map((item) => item.observable), [true, true, true]);
  assert.equal(output.heartbeat.controllers[2].status, "repair_required");
  assert.doesNotMatch(result.stdout, /private command|private output|reportsDir|command|stdout/u);
  assert.doesNotMatch(result.stdout, new RegExp(reportsDir.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
});

test("heartbeat reports manual_required when a controller report is missing", () => {
  const reportsDir = createReports({ missingPhase: "closure" });
  const result = runDry(reportsDir);
  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.heartbeat.status, "manual_required");
  assert.equal(output.heartbeat.controllers.find((item) => item.phase === "closure").observable, false);
});
