#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  DATA_LAKE_MANIFEST_VERSION,
  DATA_LAKE_V4_CONTRACT_VERSION,
  DATA_LAKE_V4_TABLES,
} from "./lib/data-lake-v4-contract.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((value) => {
    const [key, ...rest] = value.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }),
);
const lakeDir = path.resolve(root, args.get("lake-dir") || "data-lake");
const tablesDir = path.join(lakeDir, "tables");
const dbPath = path.join(lakeDir, "wavesight.duckdb");
const expected = [...DATA_LAKE_V4_TABLES].sort();

function listJsonlTables() {
  if (!fs.existsSync(tablesDir)) return [];
  return fs.readdirSync(tablesDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"))
    .map((entry) => entry.name.slice(0, -".jsonl".length))
    .sort();
}

function countJsonlRows(file) {
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, "utf8").trim();
  if (!text) return 0;
  const lines = text.split(/\r?\n/u);
  for (const [index, line] of lines.entries()) {
    try {
      JSON.parse(line);
    } catch (error) {
      throw new Error(`${path.basename(file)} line ${index + 1}: ${error.message}`);
    }
  }
  return lines.length;
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function listFiles(dir, predicate) {
  if (!dir || !fs.existsSync(dir)) return [];
  const found = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (entry.isFile() && predicate(full)) found.push(full);
    }
  }
  return found;
}

function findDuckDb() {
  if (process.env.DUCKDB_BIN && fs.existsSync(process.env.DUCKDB_BIN)) return process.env.DUCKDB_BIN;
  const direct = spawnSync("duckdb", ["-version"], { encoding: "utf8", windowsHide: true });
  if (direct.status === 0) return "duckdb";
  const candidates = [
    path.join(process.env.LOCALAPPDATA || "", "Microsoft", "WinGet", "Packages"),
    path.join(process.env.PROGRAMFILES || "", "DuckDB"),
  ].filter(Boolean);
  for (const dir of candidates) {
    const match = listFiles(dir, (file) => path.basename(file).toLowerCase() === "duckdb.exe")[0];
    if (match) return match;
  }
  return "";
}

function listDuckDbTables() {
  if (!fs.existsSync(dbPath)) return { ok: false, tables: [], issue: "DuckDB database is missing" };
  const duckdb = findDuckDb();
  if (!duckdb) return { ok: false, tables: [], issue: "DuckDB CLI is unavailable" };
  const sql = "select table_name from information_schema.tables where table_schema='main' order by table_name;";
  const result = spawnSync(duckdb, [dbPath, "-json", "-c", sql], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  if (result.status !== 0) {
    return { ok: false, tables: [], issue: `DuckDB table query failed: ${(result.stderr || result.stdout || "").trim()}` };
  }
  try {
    return {
      ok: true,
      tables: JSON.parse(result.stdout || "[]").map((item) => item.table_name).sort(),
      issue: "",
    };
  } catch (error) {
    return { ok: false, tables: [], issue: `DuckDB table query returned invalid JSON: ${error.message}` };
  }
}

function difference(left, right) {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item));
}

function main() {
  const issues = [];
  const jsonlTables = listJsonlTables();
  const missingJsonl = difference(expected, jsonlTables);
  const extraJsonl = difference(jsonlTables, expected);
  const forbiddenTables = jsonlTables.filter((name) => /card|pool|compatibility|legacy.*mapping/iu.test(name));
  if (missingJsonl.length) issues.push(`Missing V4 JSONL tables: ${missingJsonl.join(", ")}`);
  if (extraJsonl.length) issues.push(`Unexpected JSONL tables: ${extraJsonl.join(", ")}`);
  if (forbiddenTables.length) issues.push(`Forbidden legacy JSONL tables: ${forbiddenTables.join(", ")}`);

  const rowCounts = {};
  for (const table of jsonlTables.filter((name) => expected.includes(name))) {
    try {
      rowCounts[table] = countJsonlRows(path.join(tablesDir, `${table}.jsonl`));
    } catch (error) {
      issues.push(error.message);
    }
  }

  const manifest = readJson(path.join(lakeDir, "manifest.json"));
  if (!manifest) {
    issues.push("Data-lake manifest is missing or unreadable");
  } else {
    if (manifest.schema_version !== DATA_LAKE_MANIFEST_VERSION) issues.push("Manifest schema version mismatch");
    if (manifest.contract_version !== DATA_LAKE_V4_CONTRACT_VERSION) issues.push("Manifest contract version mismatch");
    if (manifest.table_count !== DATA_LAKE_V4_TABLES.length) issues.push("Manifest table count mismatch");
    const manifestTables = Array.isArray(manifest.tables) ? manifest.tables : [];
    if (manifestTables.length !== DATA_LAKE_V4_TABLES.length) issues.push("Manifest table entry count mismatch");
    const manifestNames = manifestTables.map((item) => item.name).sort();
    if (difference(expected, manifestNames).length || difference(manifestNames, expected).length) {
      issues.push("Manifest table set does not match the V4 contract");
    }
    for (const item of manifestTables) {
      if (Object.hasOwn(rowCounts, item.name) && rowCounts[item.name] !== item.row_count) {
        issues.push(`Manifest row count mismatch for ${item.name}`);
      }
    }
    if (typeof manifest.generated_at !== "string" || !manifest.generated_at) issues.push("Manifest generated_at is missing");
    if (typeof manifest.git_commit !== "string" || !manifest.git_commit) issues.push("Manifest git_commit is missing");
  }

  let duckDbTables = [];
  if (args.get("duckdb") !== "skip") {
    const duckDb = listDuckDbTables();
    duckDbTables = duckDb.tables;
    if (!duckDb.ok) issues.push(duckDb.issue);
    else if (difference(expected, duckDbTables).length || difference(duckDbTables, expected).length) {
      issues.push("DuckDB table set does not match the JSONL V4 table set");
    }
  }

  const output = {
    ok: issues.length === 0,
    contract_version: DATA_LAKE_V4_CONTRACT_VERSION,
    expected_table_count: DATA_LAKE_V4_TABLES.length,
    jsonl_table_count: jsonlTables.length,
    jsonl_tables: jsonlTables,
    missing_jsonl_tables: missingJsonl,
    extra_jsonl_tables: extraJsonl,
    forbidden_tables: forbiddenTables,
    duckdb_tables: duckDbTables,
    row_counts: rowCounts,
    issues,
  };
  console.log(JSON.stringify(output, null, 2));
  if (!output.ok) process.exit(1);
}

main();
