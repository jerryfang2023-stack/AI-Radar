import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const repositoryRoot = process.cwd();
const scriptFile = path.join(repositoryRoot, "agent-workflow", "tools", "write-daily-supervision-report.mjs");

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value), "utf8");
}

test("Business supervision passes V4 telemetry with no V3 desk, graph, Cards, or canonical events", async () => {
  const originalCwd = process.cwd();
  const originalArgv = process.argv;
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-business-v4-supervision-"));
  const date = "2026-07-28";
  try {
    writeJson(path.join(fixtureRoot, "01-SiteV2", "site", "data", "data-center-v4", "manifest.json"), {
      currentDate: date,
      counts: { events: 0 },
    });
    writeJson(path.join(fixtureRoot, "01-SiteV2", "site", "data", "collection-telemetry-v1.json"), {
      meta: { version: "COLLECTION-TELEMETRY-V1.0", data_date: date },
      v4_gate: { status: "passed" },
      deprecated_compatibility: {
        status: "retired_archive",
        production_write: "disabled",
        active_consumers: 0,
        blocking: false,
      },
    });
    writeJson(path.join(fixtureRoot, "agent-workflow", "reports", `${date}-data-center-v4-integrity-gate.json`), {
      date,
      ok: true,
      failures: [],
      counts: { canonical_events: 0 },
    });
    writeJson(path.join(fixtureRoot, "agent-workflow", "reports", `${date}-persistent-asset-manifest.json`), {
      date,
      outcomes: {
        data_center_v4_build: "success",
        data_center_v4_gate: "success",
        data_center_v4_materialize: "success",
        business_frontstage_data: "skipped",
      },
    });
    fs.writeFileSync(
      path.join(fixtureRoot, "agent-workflow", "reports", `${date}-daily-production-chain-readiness.md`),
      "# Ready\n",
      "utf8",
    );

    process.chdir(fixtureRoot);
    process.argv = [
      process.execPath,
      path.join(fixtureRoot, "test-harness.mjs"),
      `--date=${date}`,
      "--github=off",
      "--scheduled-task=off",
      "--hermes=off",
    ];
    const supervisor = await import(`${pathToFileURL(scriptFile).href}?test=business-v4`);
    const lane = supervisor.buildBusinessSignalsLane();

    assert.equal(lane.evidence.dataHealth.healthy, true);
    assert.equal(lane.evidence.dataHealth.contract, "SITE-V4.3.0 / Data Center V4 canonical production");
    assert.equal(lane.evidence.compatibility.status, "retired_archive");
    assert.equal(lane.evidence.compatibility.production_write, "disabled");
    assert.equal(lane.evidence.compatibility.active_consumers, 0);
    assert.equal(lane.problems.length, 0);
    assert.ok(lane.warnings.every((message) => !/V3 observation desk|Signal Card directory/u.test(message)));
  } finally {
    process.chdir(originalCwd);
    process.argv = originalArgv;
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
