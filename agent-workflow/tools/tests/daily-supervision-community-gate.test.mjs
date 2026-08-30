import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

test("missing and malformed community gates remain upstream failures after the window", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const script = pathToFileURL(path.join(originalCwd, "agent-workflow/tools/write-daily-supervision-report.mjs"));
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-community-gate-"));
  try {
    const dataFile = path.join(fixture, "01-SiteV2/site/data/community-intelligence.json");
    const reports = path.join(fixture, "reports");
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.mkdirSync(reports);
    fs.writeFileSync(dataFile, JSON.stringify({
      meta: { generatedAt: "2020-01-01T01:00:00Z", errors: [] },
      items: Array.from({ length: 12 }, (_, id) => ({ id })),
      links: [1, 2, 3],
    }));
    process.chdir(fixture);
    process.argv = [process.execPath, "test-harness.mjs", "--date=2020-01-01", "--output-dir=reports", "--github=off", "--scheduled-task=off"];
    const supervisor = await import(`${script.href}?community-gate-test`);
    const input = {
      scheduledTask: { available: true, task: { State: "Ready", LastTaskResult: 0 } },
      github: { available: true, prs: [], latest_run: null },
    };
    for (const [status, body] of [["missing", null], ["unknown", "truncated report"], ["failed", "- status: failed"]]) {
      if (body !== null) fs.writeFileSync(path.join(reports, "2020-01-01-community-intelligence-gate.md"), body);
      const lane = supervisor.buildCommunityLane(input);
      assert.equal(lane.status, "failed");
      assert.equal(lane.evidence.stageStatus.data, "failed");
      assert.equal(lane.evidence.stageStatus.publication, "blocked_on_data");
      assert.ok(lane.problems.some((problem) => JSON.stringify(problem).includes(`community gate ${status}`)));
      assert.ok(lane.actions.some((action) => action.includes("repair the local community gate")));
      assert.ok(!lane.problems.some((problem) => JSON.stringify(problem).includes("no same-date Community Intelligence publish workflow")));
    }
    fs.writeFileSync(path.join(reports, "2020-01-01-community-intelligence-gate.md"), "- status: passed");
    assert.ok(supervisor.buildCommunityLane(input).problems.some((problem) => JSON.stringify(problem).includes("no same-date Community Intelligence publish workflow")));
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixture, { recursive: true, force: true });
  }
});
