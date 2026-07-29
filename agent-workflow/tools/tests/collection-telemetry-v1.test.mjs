import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildCollectionTelemetry, OPS_VERSION } from "../lib/collection-telemetry-v1.mjs";
import { finalizeOpsPublicationData } from "../finalize-ops-publication-for-pages.mjs";

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
  assert.equal(result.deprecated_compatibility.status, "retired_archive");
  assert.equal(result.deprecated_compatibility.production_write, "disabled");
  assert.equal(result.deprecated_compatibility.active_consumers, 0);
  assert.equal(result.deprecated_compatibility.blocking, false);
  assert.deepEqual(result.stages.map((item) => item.id), [
    "collection",
    "fact_build",
    "application_projection",
    "publication",
  ]);
  const evidence = result.stages.flatMap((item) => item.evidence);
  assert.ok(evidence.length > 0);
  assert.ok(evidence.every((item) => !path.isAbsolute(item)));
  assert.ok(evidence.every((item) => !item.includes("\\")));
  assert.ok(evidence.every((item) => item.startsWith("01-SiteV2/") || item.startsWith("agent-workflow/")));
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

test("operations console renders the four V4 production stages instead of the V3 funnel", () => {
  const html = fs.readFileSync(path.join(process.cwd(), "01-SiteV2/site/operations-console.html"), "utf8");
  const client = fs.readFileSync(path.join(process.cwd(), "01-SiteV2/site/assets/operations-console.js"), "utf8");
  assert.match(html, /OPS V2\.0\.0/u);
  assert.match(html, /Production Stages/u);
  assert.match(client, /application_projection/u);
  assert.match(client, /fact_build/u);
  assert.doesNotMatch(client, /row\("Raw"[\s\S]*row\("Pool"[\s\S]*row\("Cards"/u);
  assert.doesNotMatch(client, />RAW<|>POOL<|>CARDS</u);
  assert.match(client, />SOURCES<[\s\S]*>CLAIMS<[\s\S]*>EVENTS</u);
});

test("Pages artifact finalization marks publication passed with deployment evidence", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-pages-ops-"));
  const dataDir = path.join(root, "01-SiteV2/site/data");
  const stages = [{ id: "publication", status: "waiting" }];
  writeJson(root, "01-SiteV2/site/data/collection-telemetry-v1.json", {
    publication: { status: "waiting" },
    stages,
    deprecated_compatibility: {
      status: "deprecated_non_blocking",
      v3_desk_present: true,
      intelligence_graph_present: true,
      signal_card_directory_present: true,
    },
  });
  writeJson(root, "01-SiteV2/site/data/pipeline-dashboard.json", {
    meta: {},
    stages,
    latest: { publication: { status: "waiting" } },
  });
  writeJson(root, "01-SiteV2/site/data/ops-console.json", {
    meta: {},
    tasks: { stages },
    quality: {
      telemetry: {
        publication: { status: "waiting" },
        compatibility: {
          status: "deprecated_non_blocking",
          v3_desk_present: true,
          intelligence_graph_present: true,
          signal_card_directory_present: true,
        },
      },
    },
  });

  finalizeOpsPublicationData({
    root,
    commit: "abc123",
    runUrl: "https://example.test/actions/runs/1",
    deployedAt: "2026-07-29T00:00:00.000Z",
  });

  const telemetry = JSON.parse(fs.readFileSync(path.join(dataDir, "collection-telemetry-v1.json"), "utf8"));
  const pipeline = JSON.parse(fs.readFileSync(path.join(dataDir, "pipeline-dashboard.json"), "utf8"));
  const ops = JSON.parse(fs.readFileSync(path.join(dataDir, "ops-console.json"), "utf8"));
  assert.equal(telemetry.publication.status, "passed");
  assert.equal(telemetry.stages[0].status, "passed");
  assert.deepEqual(telemetry.deprecated_compatibility, {
    status: "retired_archive",
    production_write: "disabled",
    active_consumers: 0,
    blocking: false,
    warnings: [],
  });
  assert.equal(pipeline.latest.publication.commit, "abc123");
  assert.equal(ops.tasks.stages[0].status, "passed");
  assert.deepEqual(ops.quality.telemetry.compatibility, {
    status: "retired_archive",
    production_write: "disabled",
    active_consumers: 0,
    blocking: false,
    warnings: [],
  });
  assert.match(fs.readFileSync(path.join(dataDir, "ops-console.js"), "utf8"), /abc123/u);
});
