import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const runner = path.join(root, "agent-workflow", "tools", "run-hermes-control-plane-watchdog.mjs");
const date = "2026-07-25";

function writeController(reportsDir, phase, status = "passed") {
  fs.writeFileSync(
    path.join(reportsDir, `${date}-daily-automation-${phase}.json`),
    `${JSON.stringify({ ok: true, status, phase, date, actions: [{ label: phase, ok: true }] })}\n`,
    "utf8",
  );
}

function runWatchdog(reportsDir, incidentDir) {
  return spawnSync(process.execPath, [
    runner,
    `--date=${date}`,
    "--force=true",
    `--reports-dir=${reportsDir}`,
    `--incident-dir=${incidentDir}`,
  ], { cwd: root, encoding: "utf8" });
}

test("Hermes watchdog passes when all controller reports are observable", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-hermes-pass-"));
  const reportsDir = path.join(temp, "reports");
  const incidentDir = path.join(temp, "incidents");
  fs.mkdirSync(reportsDir, { recursive: true });
  for (const phase of ["morning", "recovery", "closure"]) writeController(reportsDir, phase);

  const result = runWatchdog(reportsDir, incidentDir);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(incidentDir, `${date}-automation-control-plane-liveness.md`)), false);
  const report = fs.readFileSync(path.join(reportsDir, `${date}-hermes-control-plane-watchdog.md`), "utf8");
  assert.match(report, /\n$/u);
  assert.doesNotMatch(report, /\n\n$/u);
});

test("Hermes watchdog creates one control-plane incident for a missing controller report", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-hermes-fail-"));
  const reportsDir = path.join(temp, "reports");
  const incidentDir = path.join(temp, "incidents");
  fs.mkdirSync(reportsDir, { recursive: true });
  writeController(reportsDir, "morning");
  writeController(reportsDir, "recovery");

  const result = runWatchdog(reportsDir, incidentDir);
  assert.equal(result.status, 1);
  const incident = fs.readFileSync(path.join(incidentDir, `${date}-automation-control-plane-liveness.md`), "utf8");
  assert.match(incident, /closure controller report is missing or unreadable/u);
  assert.doesNotMatch(incident, /business_signals|public Card count/u);
  assert.match(incident, /\n$/u);
  assert.doesNotMatch(incident, /\n\n$/u);
});
