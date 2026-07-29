import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCollectionTelemetry, OPS_VERSION } from "../lib/collection-telemetry-v1.mjs";

function writeJson(root, relative, data) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data)}\n`, "utf8");
}

test("V4 telemetry passes without V3 desk, graph, or Signal Cards", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-telemetry-"));
  const date = "2026-07-29";
  const bundle = `01-SiteV2/content/11-databases/data-center-v4/${date}`;
  writeJson(root, `${bundle}/manifest.json`, { date, counts: { canonical_events: 0 } });
  writeJson(root, `${bundle}/source-artifacts.json`, [{ source_artifact_id: "SA-1" }]);
  writeJson(root, `${bundle}/raw-documents.json`, [{ raw_id: "RAW-1", source_artifact_id: "SA-1" }]);
  writeJson(root, `${bundle}/claims.json`, [{ claim_id: "CL-1", verification_status: "accepted" }]);
  writeJson(root, `${bundle}/canonical-events.json`, []);
  writeJson(root, `${bundle}/event-conflicts.json`, []);
  writeJson(root, `${bundle}/qa-queue.json`, [{ qa_id: "QA-1", status: "review_optional" }]);
  writeJson(root, `${bundle}/entities.json`, [{ entity_id: "EN-1" }]);
  writeJson(root, `${bundle}/relationships.json`, []);
  writeJson(root, `agent-workflow/reports/${date}-data-center-v4-integrity-gate.json`, {
    date,
    ok: true,
    failures: [],
    warnings: [],
  });

  const result = buildCollectionTelemetry({
    root,
    date,
    outcomes: { opportunity: "success", trend: "success", funding: "skipped", lenses: "success" },
  });

  assert.equal(result.meta.ops_version, OPS_VERSION);
  assert.equal(result.v4_gate.status, "passed");
  assert.equal(result.fact_build.canonical_events, 0);
  assert.equal(result.stages.find((item) => item.id === "fact_build").status, "passed");
  assert.equal(result.deprecated_compatibility.status, "deprecated_non_blocking");
  assert.equal(result.deprecated_compatibility.v3_desk_present, false);
  assert.equal(result.deprecated_compatibility.intelligence_graph_present, false);
  assert.deepEqual(result.stages.map((item) => item.id), [
    "collection",
    "fact_build",
    "application_projection",
    "publication",
  ]);
});

test("daily workflow keeps lens sync and OPS telemetry independent from the V3 frontstage gate", () => {
  const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/daily-persistent-assets-pr.yml"), "utf8");
  const lensBlock = workflow.match(/- name: Sync FDE and AI hardware Obsidian archives[\s\S]*?(?=\n\s+- name:)/u)?.[0] || "";
  const opsBlock = workflow.match(/- name: Sync operations data after V4 production[\s\S]*?(?=\n\s+- name:)/u)?.[0] || "";
  assert.match(lensBlock, /if: always\(\) && steps\.data-center-v4-materialize\.outcome == 'success'/u);
  assert.doesNotMatch(lensBlock, /business-frontstage-gate/u);
  assert.match(opsBlock, /build-collection-telemetry-v1\.mjs/u);
  assert.match(opsBlock, /steps\.data-center-v4-materialize\.outcome == 'success'/u);
  assert.doesNotMatch(opsBlock, /if:.*business-frontstage-gate/u);
});
