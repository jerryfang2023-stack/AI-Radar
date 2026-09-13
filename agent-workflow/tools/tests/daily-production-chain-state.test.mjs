import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  isCollectionTelemetryReady,
  isV4ManifestReady,
  matchesCollectionCounts,
} from "../lib/daily-production-chain-state.mjs";

const date = "2026-07-30";

test("resumed collection counts require complete, valid composite provenance", () => {
  const intake = { raw_documents: ["a", "b", "c"].map((raw_id) => ({ raw_id, intake_diagnostics: { eligible_for_v4_extraction: raw_id !== "b" } })), collection_batches: [
    { raw_ids: ["a", "b"], eligible_raw_ids: ["a"] },
    { raw_ids: ["c"], eligible_raw_ids: ["c"] },
  ] };
  assert.equal(matchesCollectionCounts(intake, 2, 1), true);
  assert.equal(matchesCollectionCounts(intake, 3, 2), true);
  assert.equal(matchesCollectionCounts(intake, 2, 2), false);
  assert.equal(matchesCollectionCounts({ ...intake, collection_batches: intake.collection_batches.slice(0, 1) }, 2, 1), false);
  assert.equal(matchesCollectionCounts({ ...intake, collection_batches: [{ raw_ids: ["a", "missing", "c"], eligible_raw_ids: ["a", "c"] }] }, 2, 1), false);
  assert.equal(matchesCollectionCounts({ ...intake, collection_batches: undefined }, 2, 1), false);
});

test("bulk generated-data PRs cannot suppress production checks through path filters", () => {
  const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/production-code-checks.yml"), "utf8");
  const trigger = workflow.slice(workflow.indexOf("  pull_request:"), workflow.indexOf("  workflow_dispatch:"));
  assert.match(trigger, /pull_request:/u);
  assert.doesNotMatch(trigger, /paths(?:-ignore)?:/u);
  assert.match(workflow, /os: \[ubuntu-latest, windows-latest\]/u);
});

test("failed-run artifacts retain accepted model decisions and projection diagnostics", () => {
  const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/daily-persistent-assets-pr.yml"), "utf8");
  const artifactPaths = workflow.slice(workflow.indexOf("retention-days: 14"), workflow.indexOf("- name: Commit Data Center V4 assets"));
  assert.ok(artifactPaths.includes("model-assist-v1/${{ steps.run-date.outputs.date }}.json"));
  assert.ok(artifactPaths.includes("model-assist-v1/checkpoint.json"));
  assert.ok(artifactPaths.includes("-data-center-projection-coverage.*"));
});

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
