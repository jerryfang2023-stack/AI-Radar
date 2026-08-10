import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  collectRecurringIssues,
  writeRecurringIncidents,
} from "../write-recurring-production-incidents.mjs";

function report(root, date, warning) {
  const dir = path.join(root, "agent-workflow", "reports");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${date}-daily-supervision-report.json`), JSON.stringify({
    lanes: [{
      id: "community_intelligence",
      problems: [],
      warnings: [warning],
    }],
  }), "utf8");
}

test("a repeated warning creates one stable open repair incident", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-recurring-"));
  report(root, "2026-07-24", "task last result is 123, but same-date data is healthy");
  report(root, "2026-07-25", "task last result is 456, but same-date data is healthy");
  const issues = collectRecurringIssues(root, "2026-07-25", 7, 2);
  assert.equal(issues.length, 1);
  const first = writeRecurringIncidents(root, "2026-07-25", issues);
  const second = writeRecurringIncidents(root, "2026-07-25", issues);
  assert.equal(first.created.length, 1);
  assert.equal(second.created.length, 0);
  assert.equal(second.existing.length, 1);
});

test("a resolved incident suppresses only occurrence dates already covered by its repair", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-recurring-resolved-"));
  report(root, "2026-07-24", "task last result is 123, but same-date data is healthy");
  report(root, "2026-07-25", "task last result is 456, but same-date data is healthy");
  const originalIssues = collectRecurringIssues(root, "2026-07-25", 7, 2);
  const first = writeRecurringIncidents(root, "2026-07-25", originalIssues);
  const incident = path.join(root, first.created[0]);
  fs.writeFileSync(
    incident,
    fs.readFileSync(incident, "utf8").replace("status: open", "status: resolved"),
    "utf8",
  );

  const covered = writeRecurringIncidents(root, "2026-07-26", originalIssues);
  assert.equal(covered.created.length, 0);
  assert.deepEqual(covered.coveredByResolved, [first.created[0]]);

  report(root, "2026-07-26", "task last result is 789, but same-date data is healthy");
  const recurringAfterRepair = collectRecurringIssues(root, "2026-07-26", 7, 2);
  const reopened = writeRecurringIncidents(root, "2026-07-26", recurringAfterRepair);
  assert.equal(reopened.created.length, 1);
  assert.equal(reopened.coveredByResolved.length, 0);
});
