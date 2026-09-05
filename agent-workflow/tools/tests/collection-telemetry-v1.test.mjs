import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { buildCollectionTelemetry, OPS_VERSION } from "../lib/collection-telemetry-v1.mjs";
import { buildOpsSourceQuality } from "../lib/ops-source-quality.mjs";
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
  fs.writeFileSync(path.join(root, `agent-workflow/reports/${date}-guanlan-daily-monitor-log.md`), "- unrecovered_failed_sources_count: 10\n", "utf8");
  fs.writeFileSync(path.join(root, `agent-workflow/reports/${date}-guanlan-monitor-quality-gate.md`), [
    "- source_provider_recovery_status: recovered_by_fallback",
    "- recovered_failed_sources_count: 18",
    "- unrecovered_failed_sources_count: 0",
    "",
  ].join("\n"), "utf8");

  const result = buildCollectionTelemetry({
    root,
    date,
    outcomes: { opportunity: "success", trend: "success", funding: "skipped", lenses: "success" },
  });

  assert.equal(result.meta.ops_version, OPS_VERSION);
  assert.equal(result.v4_gate.status, "passed");
  assert.equal(result.fact_build.canonical_events, 0);
  assert.equal(result.stages.find((item) => item.id === "fact_build").status, "passed");
  assert.equal(result.stages.find((item) => item.id === "collection").status, "passed");
  assert.equal(result.collection.capture_failed, 0);
  assert.equal(result.collection.recovered_source_failures, 18);
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

test("runtime telemetry uses the new gate without overwriting published files", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-telemetry-runtime-"));
  const date = "2026-09-05";
  const runtime = path.join(root, "runtime");
  const gate = `${date}-data-center-v4-integrity-gate.json`;
  const published = "01-SiteV2/site/data/collection-telemetry-v1.json";
  try {
    writeJson(root, `01-SiteV2/content/11-databases/data-center-v4/${date}/manifest.json`, { date });
    writeJson(root, `agent-workflow/reports/${gate}`, { date, ok: false, failures: ["old failure"] });
    writeJson(root, `runtime/${gate}`, { date, ok: true, failures: [] });
    writeJson(root, published, { preserved: true });
    const before = fs.readFileSync(path.join(root, published));
    const output = path.join(runtime, `${date}-collection-telemetry-v1.json`);
    execFileSync(process.execPath, [path.resolve("agent-workflow/tools/build-collection-telemetry-v1.mjs"),
      `--root=${root}`, `--date=${date}`, `--reports-dir=${runtime}`, `--output=${output}`,
    ], { encoding: "utf8", timeout: 10000 });
    assert.equal(JSON.parse(fs.readFileSync(output)).v4_gate.status, "passed");
    assert.deepEqual(fs.readFileSync(path.join(root, published)), before);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("application projection is not passed while any projection outcome is unknown", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-telemetry-partial-"));
  const date = "2026-07-29";
  const bundle = `01-SiteV2/content/11-databases/data-center-v4/${date}`;
  writeJson(root, `${bundle}/manifest.json`, { date });
  for (const name of [
    "source-artifacts",
    "raw-documents",
    "claims",
    "canonical-events",
    "event-conflicts",
    "qa-queue",
    "entities",
    "relationships",
  ]) writeJson(root, `${bundle}/${name}.json`, []);
  writeJson(root, `agent-workflow/reports/${date}-data-center-v4-integrity-gate.json`, {
    date,
    ok: true,
    failures: [],
    warnings: [],
  });

  const result = buildCollectionTelemetry({
    root,
    date,
    outcomes: { trend: "success", funding: "success" },
  });

  assert.equal(result.application_projection.opportunity_map, "unknown");
  assert.equal(result.application_projection.fde_hardware_sync, "unknown");
  assert.equal(result.stages.find((item) => item.id === "application_projection").status, "partial");
  assert.equal(result.publication.authoritative, false);
  assert.equal(result.publication.finalization, "github_pages_artifact");
});

test("daily workflow keeps OPS telemetry independent and does not write a local Vault in GitHub Actions", () => {
  const workflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/daily-persistent-assets-pr.yml"), "utf8");
  const dryRunWorkflow = fs.readFileSync(path.join(process.cwd(), ".github/workflows/daily-production-chain-dry-run.yml"), "utf8");
  const opsBlock = workflow.match(/- name: Sync operations data after V4 production[\s\S]*?(?=\n\s+- name:)/u)?.[0] || "";
  const dryRunOpsBlock = dryRunWorkflow.match(/- name: Build operations data after V4 materialization[\s\S]*?(?=\n\s+- name:)/u)?.[0] || "";
  assert.doesNotMatch(workflow, /Sync FDE and AI hardware Obsidian archives|sync-(?:enterprise-ai-fde|ai-hardware)-to-obsidian/u);
  assert.match(opsBlock, /build-collection-telemetry-v1\.mjs/u);
  assert.match(opsBlock, /steps\.data-center-v4-materialize\.outcome == 'success'/u);
  assert.match(opsBlock, /--lenses="\$\{\{ steps\.data-center-v4-materialize\.outcome \}\}"/u);
  assert.match(dryRunOpsBlock, /--lenses="\$\{\{ steps\.data-center-v4-materialize\.outcome \}\}"/u);
  assert.doesNotMatch(opsBlock, /if:.*business-frontstage-gate/u);
});

test("operations console renders the four V4 production stages instead of the V3 funnel", () => {
  const html = fs.readFileSync(path.join(process.cwd(), "01-SiteV2/site/operations-console.html"), "utf8");
  const client = fs.readFileSync(path.join(process.cwd(), "01-SiteV2/site/assets/operations-console.js"), "utf8");
  assert.ok(html.includes(OPS_VERSION.replace("OPS-V", "OPS V").split("-")[0]));
  assert.match(html, /Production Stages/u);
  assert.match(client, /application_projection/u);
  assert.match(client, /fact_build/u);
  assert.doesNotMatch(client, /row\("Raw"[\s\S]*row\("Pool"[\s\S]*row\("Cards"/u);
  assert.doesNotMatch(client, />RAW<|>POOL<|>CARDS</u);
  assert.match(client, />SOURCES<[\s\S]*>CLAIMS<[\s\S]*>EVENTS</u);
  assert.match(client, /const pct =/u);
  assert.match(client, /quality\.sourceQuality\?\.rows/u);
  const data = JSON.parse(fs.readFileSync(path.join(process.cwd(), "01-SiteV2/site/data/ops-console.json"), "utf8"));
  // A provider with zero captured documents is legitimately absent on a day.
  // Test stable channel ordering with fixtures, not a changing daily snapshot.
  assert.ok(Array.isArray(data.quality?.sourceQuality?.rows));
  assert.deepEqual(buildOpsSourceQuality({
    rawDocuments: ["gdelt", "keyword-search", "rss-feed", "aihot"].map((id) => ({
      intake_diagnostics: { acquisition_channel: id },
    })),
  }).rows.map((item) => item.id), ["aihot", "rss-feed", "keyword-search", "gdelt"]);
  const publishedIssues = [...(data.inbox?.open || []), ...(data.inbox?.resolved || [])];
  assert.equal(
    publishedIssues.some((item) => item.laneId === "business_signals" && item.state === "resolved" && item.date < "2026-07-29"),
    false,
  );
});

test("operations console source quality keeps per-channel V4 values and diagnostic grades", () => {
  const quality = buildOpsSourceQuality({
    rawDocuments: [
      {
        raw_id: "RAW-1",
        source_artifact_id: "SA-1",
        intake_diagnostics: {
          acquisition_channel: "aihot",
          eligible_for_v4_extraction: true,
          has_full_text: true,
          extraction_quality: "high",
          readability_score: 90,
        },
      },
      {
        raw_id: "RAW-2",
        source_artifact_id: "SA-2",
        intake_diagnostics: {
          acquisition_channel: "gdelt",
          eligible_for_v4_extraction: false,
          has_full_text: false,
          extraction_quality: "low",
          readability_score: 20,
        },
      },
    ],
    claims: [
      { raw_id: "RAW-1", verification_status: "accepted" },
      { raw_id: "RAW-2", verification_status: "rejected" },
    ],
    canonicalEvents: [{ source_refs: ["SA-1"] }],
  });

  assert.deepEqual(quality.rows.map((row) => row.id), ["aihot", "gdelt"]);
  assert.deepEqual(quality.rows[0], {
    id: "aihot",
    label: "AI HOT",
    total: 1,
    eligibleRate: 100,
    fullTextRate: 100,
    highQualityRate: 100,
    readabilityScore: 90,
    factHitRate: 100,
    acceptedClaims: 1,
    canonicalEvents: 1,
    score: 99,
    grade: "优",
  });
  assert.equal(quality.rows[1].score, 3);
  assert.equal(quality.rows[1].grade, "待改善");
  assert.match(quality.metricNote, /不参与来源准入、排序或事实门禁/u);
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
      pipelineMeta: {},
      latest: { publication: { status: "waiting" } },
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
  assert.equal(telemetry.publication.phase, "artifact_ready_for_deployment");
  assert.equal(telemetry.publication.authoritative, false);
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
  assert.equal(ops.quality.pipelineMeta.deployment.commit, "abc123");
  assert.equal(ops.quality.latest.publication.commit, "abc123");
  assert.deepEqual(ops.quality.telemetry.compatibility, {
    status: "retired_archive",
    production_write: "disabled",
    active_consumers: 0,
    blocking: false,
    warnings: [],
  });
  assert.match(fs.readFileSync(path.join(dataDir, "ops-console.js"), "utf8"), /abc123/u);
});
