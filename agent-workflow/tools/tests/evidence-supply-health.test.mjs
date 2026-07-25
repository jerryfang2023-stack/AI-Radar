import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildEvidenceSupplyHealth } from "../write-evidence-supply-health-report.mjs";

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value), "utf8");
}

test("FDE rates use observed bundle days and preserve undisclosed outcomes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-supply-"));
  const database = path.join(root, "01-SiteV2", "content", "11-databases");
  writeJson(path.join(database, "source-registry-v2.json"), {
    sources: [{ source_level: "S", endpoint_or_url: "https://vendor.example/news" }],
  });
  for (const date of ["2026-07-24", "2026-07-25"]) {
    writeJson(path.join(database, "data-center-v4", date, "canonical-events.json"), []);
    writeJson(path.join(database, "data-center-v4", date, "source-artifacts.json"), []);
  }
  writeJson(path.join(database, "data-center-v4", "2026-07-24", "fde-records.json"), [{
    fde_id: "FDE-1",
    reported_outcomes: [],
    undisclosed_fields: ["reported_outcomes"],
  }]);
  writeJson(path.join(database, "data-center-v4", "2026-07-25", "fde-records.json"), []);

  const result = buildEvidenceSupplyHealth(root, "2026-07-25");
  assert.equal(result.fde_output_rate.trailing_7_days.observed_days, 2);
  assert.equal(result.fde_output_rate.trailing_7_days.days_with_records, 1);
  assert.equal(result.fde_output_rate.trailing_7_days.observed_day_output_rate, 0.5);
  assert.equal(result.fde_output_rate.trailing_7_days.records_without_reported_outcomes, 1);
});
