#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";
import {
  DATA_LAKE_MANIFEST_VERSION,
  DATA_LAKE_V4_CONTRACT_VERSION,
  DATA_LAKE_V4_TABLES,
} from "./lib/data-lake-v4-contract.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const lakeDir = path.resolve(root, arg("lake-dir", "data-lake"));
const tablesDir = path.join(lakeDir, "tables");
const dbPath = path.join(lakeDir, "wavesight.duckdb");

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function exists(file) {
  return fs.existsSync(file);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readText(file) {
  return fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, "");
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function listFiles(dir, predicate = () => true) {
  if (!exists(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && predicate(full)) out.push(full);
    }
  }
  return out.sort((a, b) => rel(a).localeCompare(rel(b)));
}

function safeString(value) {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(safeString).filter(Boolean).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function writeJsonl(name, rows) {
  ensureDir(tablesDir);
  const file = path.join(tablesDir, `${name}.jsonl`);
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""), "utf8");
  return file;
}

function cleanStaleJsonl() {
  ensureDir(tablesDir);
  const expected = new Set(DATA_LAKE_V4_TABLES);
  const removed = [];
  for (const entry of fs.readdirSync(tablesDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;
    const table = entry.name.slice(0, -".jsonl".length);
    if (expected.has(table)) continue;
    fs.rmSync(path.join(tablesDir, entry.name), { force: true });
    removed.push(table);
  }
  return removed.sort();
}

function currentGitCommit() {
  const result = spawnSync("git", ["rev-parse", "HEAD"], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) {
    throw new Error(`Unable to resolve Git commit for data-lake manifest: ${(result.stderr || result.stdout || "").trim()}`);
  }
  return result.stdout.trim();
}

function writeManifest(tables, { removedStaleTables, duckdbStatus, duckdbTables = [] }) {
  const manifest = {
    schema_version: DATA_LAKE_MANIFEST_VERSION,
    contract_version: DATA_LAKE_V4_CONTRACT_VERSION,
    generated_at: new Date().toISOString(),
    git_commit: currentGitCommit(),
    table_count: DATA_LAKE_V4_TABLES.length,
    tables: DATA_LAKE_V4_TABLES.map((name) => ({
      name,
      row_count: tables[name].length,
      jsonl: rel(path.join(tablesDir, `${name}.jsonl`)),
    })),
    removed_stale_tables: removedStaleTables,
    database: {
      path: rel(dbPath),
      status: duckdbStatus,
      tables: duckdbTables,
    },
  };
  fs.writeFileSync(path.join(lakeDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

function collectEntityHistoryRows(field) {
  const file = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");
  if (!exists(file)) return [];
  const data = readJson(file);
  return Array.isArray(data[field]) ? data[field] : [];
}

function collectEntityRegistryRows() {
  return collectEntityHistoryRows("entityProfiles").map(({ timeline, viewpoints, groupedEventIds, relationIds, ...entity }) => entity);
}

function collectDataCenterRows(fileName, idKey = "") {
  const dataCenterRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
  if (!exists(dataCenterRoot)) return [];
  const rows = [];
  for (const dateEntry of fs.readdirSync(dataCenterRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name)).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(dataCenterRoot, dateEntry.name, `${fileName}.json`);
    if (!exists(file)) continue;
    const values = readJson(file);
    if (!Array.isArray(values)) continue;
    for (const value of values) rows.push({ data_date: dateEntry.name, ...value, bundle_path: rel(file) });
  }
  if (!idKey) return rows;
  const deduped = new Map();
  for (const row of rows) deduped.set(safeString(row[idKey]) || JSON.stringify(row), row);
  return [...deduped.values()];
}

function findDuckDb() {
  if (process.env.DUCKDB_BIN && exists(process.env.DUCKDB_BIN)) return process.env.DUCKDB_BIN;
  const direct = spawnSync("duckdb", ["-version"], { encoding: "utf8", shell: false });
  if (direct.status === 0) return "duckdb";
  const candidates = [
    path.join(process.env.LOCALAPPDATA || "", "Microsoft/WinGet/Packages"),
    path.join(process.env.PROGRAMFILES || "", "DuckDB")
  ].filter(Boolean);
  for (const dir of candidates) {
    const matches = listFiles(dir, (file) => path.basename(file).toLowerCase() === "duckdb.exe");
    if (matches.length) return matches[0];
  }
  return "";
}

function sqlString(value) {
  return String(value).replace(/'/gu, "''").replace(/\\/gu, "/");
}

function rebuildDuckDb(tables) {
  const duckdb = findDuckDb();
  if (!duckdb) {
    return { ok: false, duckdb: "", error: "DuckDB CLI not found. Set DUCKDB_BIN or restart the shell after winget install." };
  }
  if (exists(dbPath)) fs.rmSync(dbPath, { force: true });
  const statements = [
    "install json;",
    "load json;"
  ];
  for (const [table, rows] of Object.entries(tables)) {
    const file = path.join(tablesDir, `${table}.jsonl`);
    if (rows.length) statements.push(`create or replace table ${table} as select * from read_json_auto('${sqlString(file)}', format='newline_delimited');`);
    else statements.push(`create or replace table ${table} as select cast(null as varchar) as _empty where false;`);
  }
  const result = spawnSync(duckdb, [dbPath, "-c", statements.join("\n")], {
    cwd: root,
    encoding: "utf8",
    shell: false
  });
  return {
    ok: result.status === 0,
    duckdb,
    error: result.status === 0 ? "" : `${result.stdout || ""}\n${result.stderr || ""}`.trim()
  };
}

function querySummary(duckdb, tableNames) {
  const sql = tableNames.map((table, index) => `${index ? "union all " : ""}select '${table}' as table_name, count(*) as rows from ${table}`).join("\n") + ";";
  const result = spawnSync(duckdb, [dbPath, "-json", "-c", sql], { cwd: root, encoding: "utf8", shell: false });
  return result.status === 0 ? result.stdout.trim() : "";
}

function queryDuckDbTables(duckdb) {
  const sql = "select table_name from information_schema.tables where table_schema='main' order by table_name;";
  const result = spawnSync(duckdb, [dbPath, "-json", "-c", sql], { cwd: root, encoding: "utf8", shell: false });
  if (result.status !== 0) return [];
  try {
    return JSON.parse(result.stdout || "[]").map((item) => item.table_name).sort();
  } catch {
    return [];
  }
}

function main() {
  ensureDir(lakeDir);
  ensureDir(tablesDir);
  const v4Tables = {
    source_artifacts: collectDataCenterRows("source-artifacts", "source_artifact_id"),
    raw_documents: collectDataCenterRows("raw-documents", "raw_id"),
    claims: collectDataCenterRows("claims", "claim_id"),
    entities: collectDataCenterRows("entities", "entity_id"),
    entity_mentions: collectDataCenterRows("entity-mentions", "mention_id"),
    canonical_events: collectDataCenterRows("canonical-events", "event_id"),
    event_sources: collectDataCenterRows("event-sources"),
    event_claims: collectDataCenterRows("event-claims"),
    event_conflicts: collectDataCenterRows("event-conflicts", "conflict_id"),
    relationships: collectDataCenterRows("relationships", "relationship_id"),
    tag_assertions: collectDataCenterRows("tag-assertions"),
    facet_assertions: collectDataCenterRows("facet-assertions"),
    reviewed_event_classifications: collectDataCenterRows("reviewed-event-classifications", "reviewed_classification_id"),
    fde_records: collectDataCenterRows("fde-records", "fde_id"),
    fde_observations: collectDataCenterRows("fde-observations", "observation_id"),
    hardware_records: collectDataCenterRows("hardware-records", "hardware_record_id"),
    hardware_facts: collectDataCenterRows("hardware-facts", "hardware_fact_id"),
    hardware_snapshots: collectDataCenterRows("hardware-snapshots", "hardware_snapshot_id"),
    monitoring_funnel: collectDataCenterRows("monitoring-funnel", "funnel_id"),
    entity_registry: collectEntityRegistryRows(),
    entity_profiles: collectEntityHistoryRows("entityProfiles"),
    taxonomy_nodes: collectEntityHistoryRows("taxonomyNodes"),
    entity_relationships: collectEntityHistoryRows("entityRelationships"),
    qa_queue: collectDataCenterRows("qa-queue", "qa_id")
  };
  const tables = v4Tables;
  const tableNames = Object.keys(tables);
  if (tableNames.length !== DATA_LAKE_V4_TABLES.length
    || tableNames.some((name, index) => name !== DATA_LAKE_V4_TABLES[index])) {
    throw new Error(`V4 data-lake table contract mismatch: ${tableNames.join(", ")}`);
  }
  const removedStaleTables = cleanStaleJsonl();
  for (const [name, rows] of Object.entries(tables)) writeJsonl(name, rows);
  if (arg("duckdb", "required") === "skip") {
    const manifest = writeManifest(tables, {
      removedStaleTables,
      duckdbStatus: "skipped",
    });
    console.log(JSON.stringify({
      ok: true,
      contract_version: DATA_LAKE_V4_CONTRACT_VERSION,
      duckdb: "skipped",
      database: rel(dbPath),
      manifest: rel(path.join(lakeDir, "manifest.json")),
      removed_stale_tables: removedStaleTables,
      generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])),
      table_count: manifest.table_count,
    }, null, 2));
    return;
  }
  const build = rebuildDuckDb(tables);
  if (!build.ok) {
    if (arg("duckdb", "required") === "optional") {
      const manifest = writeManifest(tables, {
        removedStaleTables,
        duckdbStatus: "unavailable",
      });
      console.log(JSON.stringify({
        ok: true,
        contract_version: DATA_LAKE_V4_CONTRACT_VERSION,
        duckdb: "skipped",
        database: rel(dbPath),
        manifest: rel(path.join(lakeDir, "manifest.json")),
        removed_stale_tables: removedStaleTables,
        generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])),
        table_count: manifest.table_count,
        warning: build.error,
      }, null, 2));
      return;
    }
    console.error(JSON.stringify({ ok: false, generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])), error: build.error }, null, 2));
    process.exit(1);
  }
  const duckdbTables = queryDuckDbTables(build.duckdb);
  if (duckdbTables.length !== DATA_LAKE_V4_TABLES.length
    || duckdbTables.some((name, index) => name !== [...DATA_LAKE_V4_TABLES].sort()[index])) {
    throw new Error(`DuckDB table contract mismatch after rebuild: ${duckdbTables.join(", ")}`);
  }
  const manifest = writeManifest(tables, {
    removedStaleTables,
    duckdbStatus: "rebuilt",
    duckdbTables,
  });
  const summary = querySummary(build.duckdb, Object.keys(tables));
  console.log(JSON.stringify({
    ok: true,
    contract_version: DATA_LAKE_V4_CONTRACT_VERSION,
    duckdb: build.duckdb,
    database: rel(dbPath),
    manifest: rel(path.join(lakeDir, "manifest.json")),
    removed_stale_tables: removedStaleTables,
    generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])),
    table_count: manifest.table_count,
    summary: summary ? JSON.parse(summary) : []
  }, null, 2));
}

main();
