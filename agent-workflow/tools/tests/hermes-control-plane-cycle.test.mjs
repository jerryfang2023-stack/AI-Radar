import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const runner = path.join(root, "agent-workflow", "tools", "run-hermes-control-plane-cycle.mjs");
const date = "2026-07-30";

function writeController(reportsDir, phase) {
  fs.writeFileSync(
    path.join(reportsDir, `${date}-daily-automation-${phase}.json`),
    `${JSON.stringify({
      ok: true,
      status: "passed",
      phase,
      date,
      generated_at: "2026-07-30T01:00:00.000Z",
      actions: [{ label: phase, ok: true }],
    })}\n`,
    "utf8",
  );
}

function runCycle(reportsDir, incidentDir) {
  return spawnSync(process.execPath, [
    runner,
    `--date=${date}`,
    "--force=true",
    `--reports-dir=${reportsDir}`,
    `--incident-dir=${incidentDir}`,
    "--repo=jerryfang2023-stack/AI-Radar",
    "--dry-run=true",
  ], { cwd: root, encoding: "utf8" });
}

test("control-plane cycle publishes manual_required heartbeat after watchdog reports a missing controller", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-hermes-cycle-"));
  const reportsDir = path.join(temp, "reports");
  const incidentDir = path.join(temp, "incidents");
  fs.mkdirSync(reportsDir, { recursive: true });
  writeController(reportsDir, "morning");
  writeController(reportsDir, "recovery");

  const result = runCycle(reportsDir, incidentDir);

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, true);
  assert.equal(output.status, "manual_required");
  assert.equal(output.watchdog.exit_status, 1);
  assert.equal(output.watchdog.report_valid, true);
  assert.equal(output.heartbeat.exit_status, 0);
  assert.equal(output.heartbeat.status, "manual_required");
  assert.equal(output.heartbeat.dispatched, false);
});

test("control-plane cycle publishes passed heartbeat when all controllers are observable", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-hermes-cycle-pass-"));
  const reportsDir = path.join(temp, "reports");
  const incidentDir = path.join(temp, "incidents");
  fs.mkdirSync(reportsDir, { recursive: true });
  for (const phase of ["morning", "recovery", "closure"]) writeController(reportsDir, phase);

  const result = runCycle(reportsDir, incidentDir);

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, true);
  assert.equal(output.status, "passed");
  assert.equal(output.watchdog.exit_status, 0);
  assert.equal(output.watchdog.report_valid, true);
  assert.equal(output.heartbeat.exit_status, 0);
  assert.equal(output.heartbeat.status, "passed");
  assert.equal(output.heartbeat.dispatched, false);
});
