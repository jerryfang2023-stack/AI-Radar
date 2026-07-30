import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = process.cwd();
const runner = path.join(root, "agent-workflow", "tools", "assert-data-center-site-test-tables.mjs");
const requiredTables = [
  "canonical_events.jsonl",
  "claims.jsonl",
  "raw_documents.jsonl",
  "source_artifacts.jsonl",
  "entities.jsonl",
  "tag_assertions.jsonl",
  "facet_assertions.jsonl",
  "fde_records.jsonl",
  "fde_observations.jsonl",
  "hardware_records.jsonl",
  "hardware_facts.jsonl",
  "hardware_snapshots.jsonl",
  "monitoring_funnel.jsonl",
];

function run(tablesDir) {
  return spawnSync(process.execPath, [runner, `--tables-dir=${tablesDir}`], {
    cwd: root,
    encoding: "utf8",
  });
}

test("site-test preflight reports one actionable error when V4 tables are missing", (t) => {
  const tablesDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-site-test-missing-"));
  t.after(() => fs.rmSync(tablesDir, { recursive: true, force: true }));
  const result = run(tablesDir);
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Data Center site tests require prepared V4 JSONL tables/u);
  assert.match(result.stderr, /npm run test:data-center-site/u);
  assert.equal((result.stderr.match(/Data Center site tests require prepared V4 JSONL tables/gu) || []).length, 1);
});

test("site-test preflight passes when all required V4 tables exist", (t) => {
  const tablesDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-site-test-ready-"));
  t.after(() => fs.rmSync(tablesDir, { recursive: true, force: true }));
  for (const name of requiredTables) {
    fs.writeFileSync(path.join(tablesDir, name), name === "canonical_events.jsonl" ? "{}\n" : "", "utf8");
  }
  const result = run(tablesDir);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /test tables are ready/u);
});
