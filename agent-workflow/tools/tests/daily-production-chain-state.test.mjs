import assert from "node:assert/strict";
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
