import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { collectDataCenterRows } from "../sync-light-data-lake.mjs";

test("entity materialization retains historical aliases without changing daily evidence or latest status", () => {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-entity-alias-history-"));
  const bundleRoot = path.join(fixtureRoot, "01-SiteV2/content/11-databases/data-center-v4");
  const oldRow = { entity_id: "EN-google", canonical_name: "Google", entity_type: "organization_candidate", aliases: ["谷歌"], verification_status: "verified" };
  const newRow = { ...oldRow, aliases: [], verification_status: "candidate" };
  try {
    for (const [date, row] of [["2026-09-07", oldRow], ["2026-09-08", newRow]]) {
      const dir = path.join(bundleRoot, date);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, "entities.json"), JSON.stringify([row]));
    }
    const rows = collectDataCenterRows("entities", "entity_id", fixtureRoot);
    assert.equal(rows.length, 1);
    assert.deepEqual(rows[0].aliases, ["谷歌"]);
    assert.equal(rows[0].verification_status, "candidate");
    assert.equal(rows[0].data_date, "2026-09-08");
    const newest = path.join(bundleRoot, "2026-09-08/entities.json");
    assert.deepEqual(JSON.parse(fs.readFileSync(newest, "utf8")), [newRow]);
    for (const correction of [
      { verification_status: "quarantined" },
      { entity_type: "product_candidate" },
      { canonical_name: "Different identity" },
    ]) {
      fs.writeFileSync(newest, JSON.stringify([{ ...newRow, ...correction }]));
      assert.deepEqual(collectDataCenterRows("entities", "entity_id", fixtureRoot)[0].aliases, []);
    }
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

const root = process.cwd();
const assertRunner = path.join(root, "agent-workflow", "tools", "assert-data-lake-v4.mjs");
const syncRunner = path.join(root, "agent-workflow", "tools", "sync-light-data-lake.mjs");
const expectedTables = [
  "source_artifacts",
  "raw_documents",
  "claims",
  "entities",
  "entity_mentions",
  "canonical_events",
  "event_sources",
  "event_claims",
  "event_conflicts",
  "relationships",
  "tag_assertions",
  "facet_assertions",
  "reviewed_event_classifications",
  "fde_records",
  "fde_observations",
  "hardware_records",
  "hardware_facts",
  "hardware_snapshots",
  "monitoring_funnel",
  "entity_registry",
  "entity_profiles",
  "taxonomy_nodes",
  "entity_relationships",
  "qa_queue",
];

function createLake() {
  const lakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-data-lake-v4-"));
  const tablesDir = path.join(lakeDir, "tables");
  fs.mkdirSync(tablesDir, { recursive: true });
  for (const table of expectedTables) {
    fs.writeFileSync(path.join(tablesDir, `${table}.jsonl`), "", "utf8");
  }
  fs.writeFileSync(path.join(lakeDir, "manifest.json"), `${JSON.stringify({
    schema_version: "DATA-LAKE-MANIFEST-V1",
    contract_version: "DATA-LAKE-V4.1",
    generated_at: "2026-07-30T00:00:00.000Z",
    git_commit: "a".repeat(40),
    table_count: expectedTables.length,
    tables: expectedTables.map((name) => ({ name, row_count: 0 })),
  })}\n`, "utf8");
  return { lakeDir, tablesDir };
}

test("V4 data-lake gate rejects a stale compatibility JSONL table", () => {
  const { lakeDir, tablesDir } = createLake();
  fs.writeFileSync(path.join(tablesDir, "signal_cards.jsonl"), "{}\n", "utf8");

  const result = spawnSync(process.execPath, [
    assertRunner,
    `--lake-dir=${lakeDir}`,
    "--duckdb=skip",
  ], { cwd: root, encoding: "utf8" });

  assert.equal(result.status, 1);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, false);
  assert.deepEqual(output.extra_jsonl_tables, ["signal_cards"]);
  assert.match(JSON.stringify(output.issues), /signal_cards/u);
});

test("V4 data-lake gate accepts the exact 24-table JSONL contract", () => {
  const { lakeDir } = createLake();

  const result = spawnSync(process.execPath, [
    assertRunner,
    `--lake-dir=${lakeDir}`,
    "--duckdb=skip",
  ], { cwd: root, encoding: "utf8" });

  assert.equal(result.status, 0, result.stderr);
  const output = JSON.parse(result.stdout);
  assert.equal(output.ok, true);
  assert.equal(output.expected_table_count, 24);
  assert.equal(output.jsonl_table_count, 24);
  assert.deepEqual(output.issues, []);
});

test("V4 data-lake sync removes stale JSONL and writes a traceable 24-table manifest", () => {
  const lakeDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-data-lake-sync-"));
  const tablesDir = path.join(lakeDir, "tables");
  fs.mkdirSync(tablesDir, { recursive: true });
  for (const table of [
    "builders_daily",
    "community_items",
    "fde_items",
    "frontstage_cards",
    "pool_daily",
    "raw_items",
    "signal_cards",
  ]) {
    fs.writeFileSync(path.join(tablesDir, `${table}.jsonl`), "{}\n", "utf8");
  }

  const result = spawnSync(process.execPath, [
    syncRunner,
    `--lake-dir=${lakeDir}`,
    "--duckdb=skip",
  ], { cwd: root, encoding: "utf8", timeout: 120_000 });

  assert.equal(result.status, 0, result.stderr);
  const actualTables = fs.readdirSync(tablesDir)
    .filter((name) => name.endsWith(".jsonl"))
    .map((name) => name.slice(0, -".jsonl".length))
    .sort();
  assert.deepEqual(actualTables, [...expectedTables].sort());
  const manifest = JSON.parse(fs.readFileSync(path.join(lakeDir, "manifest.json"), "utf8"));
  assert.equal(manifest.schema_version, "DATA-LAKE-MANIFEST-V1");
  assert.equal(manifest.contract_version, "DATA-LAKE-V4.1");
  assert.equal(manifest.table_count, 24);
  assert.match(manifest.generated_at, /^\d{4}-\d{2}-\d{2}T/u);
  assert.match(manifest.git_commit, /^[0-9a-f]{40}$/u);
  assert.deepEqual(manifest.tables.map((item) => item.name).sort(), [...expectedTables].sort());
});
