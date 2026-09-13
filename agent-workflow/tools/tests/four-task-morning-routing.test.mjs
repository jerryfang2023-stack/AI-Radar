import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";

const source = fs.readFileSync(new URL("../run-daily-automation-controller.mjs", import.meta.url), "utf8");
const functions = source.slice(source.indexOf("function morning()"), source.indexOf("function communityRecovery()"));

function runMorning({ gateOk = false, businessOk = true, available = true, runs = [] } = {}) {
  const dispatched = [];
  const result = vm.runInNewContext(`${functions}\nmorning()`, {
    path, process: { execPath: "node" }, date: "2026-09-13", reportsDir: "runtime", dryRun: false,
    run(label) {
      const ok = label === "First-Line Viewpoints gate" ? gateOk
        : label === "Data Center V4 production dispatch" ? businessOk : true;
      return { label, ok, status: ok ? 0 : 1 };
    },
    workflowRuns() { return { available, runs, result: { ok: available } }; },
    dispatchWorkflow(workflow) { dispatched.push(workflow); return { ok: true, label: workflow }; },
  });
  return { result, dispatched };
}

test("08:10 supplies missing RSS production without a recovery timer", () => {
  const { result, dispatched } = runMorning();
  assert.equal(result.ok, true);
  assert.deepEqual(dispatched, ["daily-first-line-viewpoints-pr.yml"]);
  assert.equal(result.lanes.first_line_viewpoints.status, "fallback_dispatched");
});

test("accepted same-date RSS data skips workflow dispatch", () => {
  const { result, dispatched } = runMorning({ gateOk: true });
  assert.equal(result.lanes.first_line_viewpoints.status, "healthy");
  assert.equal(dispatched.length, 0);
});

test("queued or running RSS production is not dispatched twice", () => {
  for (const status of ["queued", "in_progress"]) {
    const { result, dispatched } = runMorning({ runs: [{ status }] });
    assert.equal(result.lanes.first_line_viewpoints.status, "waiting");
    assert.equal(dispatched.length, 0);
  }
});

test("successful workflow with missing accepted output leaves publication repair to the operator", () => {
  const { result, dispatched } = runMorning({ runs: [{ status: "completed", conclusion: "success" }] });
  assert.equal(result.ok, false);
  assert.equal(result.lanes.first_line_viewpoints.status, "publication_repair_required");
  assert.equal(dispatched.length, 0);
});

test("Business Signals failure does not suppress independent RSS production", () => {
  const { result, dispatched } = runMorning({ businessOk: false });
  assert.equal(result.ok, false);
  assert.equal(dispatched.length, 1);
});

test("failed workflow inspection stops RSS dispatch instead of risking duplicate production", () => {
  const { result, dispatched } = runMorning({ available: false });
  assert.equal(result.ok, false);
  assert.equal(result.lanes.first_line_viewpoints.status, "inspection_failed");
  assert.equal(dispatched.length, 0);
});

test("late morning catch-up still runs after retired 09:15 and 09:50 windows", () => {
  const clockFunctions = source.slice(source.indexOf("function shanghaiDate("), source.indexOf("function rel("));
  for (const time of ["09:16", "10:01", "16:44"]) {
    const result = vm.runInNewContext(`${clockFunctions}\nscheduledSupersession("morning", new Date("2026-09-13T${time}:00+08:00"))`, {
      scheduledRun: true, date: "2026-09-13",
    });
    assert.equal(result, null);
  }
  const final = vm.runInNewContext(`${clockFunctions}\nscheduledSupersession("morning", new Date("2026-09-13T16:45:00+08:00"))`, {
    scheduledRun: true, date: "2026-09-13",
  });
  assert.equal(final.status, "superseded");
});
