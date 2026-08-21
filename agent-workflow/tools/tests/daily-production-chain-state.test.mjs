import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  isCollectionTelemetryReady,
  isV4ManifestReady,
} from "../lib/daily-production-chain-state.mjs";

const date = "2026-07-30";

test("pre-commit state accepts the current V4 manifest and collection telemetry contracts", () => {
  assert.equal(isV4ManifestReady({
    product_version: "SITE-V4.0-data-center",
    date,
    compatibility_state: "retired",
    counts: { canonical_events: 31 },
  }, date), true);
  assert.equal(isCollectionTelemetryReady({
    meta: {
      version: "COLLECTION-TELEMETRY-V1.0",
      data_date: date,
    },
    v4_gate: {
      status: "passed",
      manifest_date: date,
      gate_date: date,
    },
  }, date), true);
});

test("pre-commit state rejects stale dates and obsolete top-level status fields", () => {
  assert.equal(isV4ManifestReady({
    status: "passed",
    date,
    counts: {},
  }, date), false);
  assert.equal(isCollectionTelemetryReady({
    schema_version: "COLLECTION-TELEMETRY-V1.0",
    meta: { data_date: "2026-07-29" },
    v4_gate: { status: "passed" },
  }, date), false);
});

test("daily production rebuilds from a validated partial model-assist result", () => {
  const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/daily-persistent-assets-pr.yml"), "utf8");
  assert.match(workflow, /model_assist_status=\$\{PIPESTATUS\[0\]\}/u);
  assert.match(workflow, /assert-data-center-model-assist\.mjs --date="\$\{RUN_DATE\}"[\s\S]*isolated candidate failures; rebuilding from the validated accepted subset/u);
  assert.match(workflow, /if: steps\.data-center-v4-model-assist\.outcome == 'success'/u);
});
