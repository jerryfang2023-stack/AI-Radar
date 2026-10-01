import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import test from "node:test";

const source = fs.readFileSync(new URL("../run-daily-automation-controller.mjs", import.meta.url), "utf8");
const functions = source.slice(source.indexOf("function morning()"), source.indexOf("function recovery()"));

function runMorning({ gateOk = false, businessOk = true, available = true, runs = [] } = {}) {
  const dispatched = [];
  const calls = [];
  const result = vm.runInNewContext(`${functions}\nmorning()`, {
    path, process: { execPath: "node" }, date: "2026-09-13", reportsDir: "runtime", dryRun: false,
    run(label) {
      calls.push(label);
      const ok = label === "Data Center V4 production dispatch" ? businessOk : true;
      return { label, ok, status: ok ? 0 : 1 };
    },
    workflowRuns() { return { available, runs, result: { ok: available } }; },
    dispatchWorkflow(workflow) { dispatched.push(workflow); return { ok: true, label: workflow }; },
  });
  return { result, dispatched, calls };
}

test("08:10 funding dispatch no longer inspects or dispatches the independent weekly Builders lane", () => {
  const { result, dispatched, calls } = runMorning();
  assert.equal(result.ok, true);
  assert.deepEqual(Object.keys(result.lanes), ["business"]);
  assert.equal(dispatched.length, 0);
  assert.ok(!calls.some((label) => /First-Line Viewpoints|Community Intelligence/u.test(label)));
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
