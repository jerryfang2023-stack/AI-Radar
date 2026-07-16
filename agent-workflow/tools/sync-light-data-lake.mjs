#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const lakeDir = path.join(root, "data-lake");
const tablesDir = path.join(lakeDir, "tables");
const dbPath = path.join(lakeDir, "wavesight.duckdb");

const mojibakePattern = /(?:锛|鈥|鎴|鏄|涓|瀹|绾|鐨|鍙|闇|€|\ufffd)/gu;

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

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function safeBool(value) {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

function contaminationScore(...values) {
  const text = values.map(safeString).join("\n");
  return (text.match(mojibakePattern) || []).length;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) return {};
  const data = {};
  const lines = match[1].split(/\r?\n/u);
  let lastKey = "";
  for (const line of lines) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/u);
    if (top) {
      lastKey = top[1];
      data[lastKey] = parseScalar(top[2]);
      continue;
    }
    const nested = line.match(/^\s+([A-Za-z0-9_-]+):\s*(.*)$/u);
    if (nested && lastKey) {
      if (!data[lastKey] || typeof data[lastKey] !== "object" || Array.isArray(data[lastKey])) {
        data[lastKey] = {};
      }
      data[lastKey][nested[1]] = parseScalar(nested[2]);
    }
  }
  return data;
}

function parseScalar(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed === "null") return null;
  if (/^-?\d+(?:\.\d+)?$/u.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed.replace(/'/gu, '"'));
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

function extractDateFromPath(file) {
  return rel(file).match(/\d{4}-\d{2}-\d{2}/u)?.[0] || "";
}

function headingCount(text, level = 2) {
  const marker = "#".repeat(level);
  const re = new RegExp(`^${marker} `, "gmu");
  return (text.match(re) || []).length;
}

function writeJsonl(name, rows) {
  ensureDir(tablesDir);
  const file = path.join(tablesDir, `${name}.jsonl`);
  fs.writeFileSync(file, rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""), "utf8");
  return file;
}

function collectRawItems() {
  const rawRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
  return listFiles(rawRoot, (file) => file.endsWith(".json")).map((file) => {
    let item = {};
    try {
      item = readJson(file);
    } catch (error) {
      return {
        date: extractDateFromPath(file),
        raw_id: "",
        title: "",
        original_url: "",
        source_name: "",
        source_type: "",
        source_level: "",
        acquisition_channel: "",
        evidence_object_type: "",
        extraction_quality: "",
        fetch_status: "json_parse_failed",
        raw_qc_decision: "",
        raw_status: "",
        pool_routes: "",
        score: null,
        readability_score: null,
        content_length: null,
        has_full_text: null,
        mojibake_score: 1,
        path: rel(file),
        error: error.message
      };
    }
    const score = item.guanlan_scores?.emerging_signal_score ?? item.guanlan_scores?.importance_score ?? item.score;
    return {
      date: extractDateFromPath(file),
      raw_id: safeString(item.raw_id),
      title: safeString(item.title),
      original_url: safeString(item.original_url || item.canonical_url),
      source_name: safeString(item.source_name),
      source_type: safeString(item.source_type),
      source_level: safeString(item.source_level),
      acquisition_channel: safeString(item.acquisition_channel),
      evidence_object_type: safeString(item.evidence_object_type),
      extraction_quality: safeString(item.extraction_quality),
      fetch_status: safeString(item.fetch_status),
      raw_qc_decision: safeString(item.raw_qc_decision),
      raw_status: safeString(item.raw_status),
      pool_routes: safeString(item.pool_routes),
      score: safeNumber(score),
      readability_score: safeNumber(item.readability_score),
      content_length: safeNumber(item.content_length || item.clean_text?.length || item.full_text?.length),
      has_full_text: safeBool(item.has_full_text),
      mojibake_score: contaminationScore(item.title, item.search_path_label, item.visible_range, item.clean_text, item.full_text),
      path: rel(file),
      error: ""
    };
  });
}

function collectPoolDaily() {
  const poolRoot = path.join(root, "01-SiteV2/content/02-pool");
  return listFiles(poolRoot, (file) => file.endsWith(".md")).map((file) => {
    const text = readText(file);
    const fm = parseFrontmatter(text);
    return {
      date: safeString(fm.date || extractDateFromPath(file)),
      status: safeString(fm.status),
      pool_count: safeNumber(fm.pool_count),
      pool_target: safeNumber(fm.pool_target),
      routed_pool_target: safeNumber(fm.routed_pool_target),
      core_pool_target: safeNumber(fm.core_pool_target),
      candidate_headings: headingCount(text, 2),
      mojibake_score: contaminationScore(text.slice(0, 20000)),
      path: rel(file)
    };
  });
}

function collectSignalCards() {
  const cardRoot = path.join(root, "01-SiteV2/knowledge/01-Signal-Cards");
  return listFiles(cardRoot, (file) => file.endsWith(".md") && !file.endsWith("README.md")).map((file) => {
    const text = readText(file);
    const fm = parseFrontmatter(text);
    const relativeParts = rel(file).split("/");
    const cardKind = relativeParts[3] || "";
    return {
      date: safeString(fm.date || extractDateFromPath(file)),
      id: safeString(fm.id),
      card_kind: cardKind,
      type: safeString(fm.type),
      title: safeString(fm.title),
      status: safeString(fm.status),
      evidence_gate: safeString(fm.evidence_gate),
      company_name: safeString(fm.company_name || fm.organization),
      product_name: safeString(fm.product_name),
      website: safeString(fm.website || fm.primary_raw?.source_url),
      raw_ref: safeString(Array.isArray(fm.raw_refs) ? fm.raw_refs[0] : fm.primary_raw?.raw_ref),
      raw_json: safeString(fm.primary_raw?.raw_json),
      mojibake_score: contaminationScore(fm.title, fm.company_name, fm.product_name, text.slice(0, 12000)),
      path: rel(file)
    };
  });
}

function collectBuildersDaily() {
  const pointsRoot = path.join(root, "01-SiteV2/content/07-points");
  return listFiles(pointsRoot, (file) => file.endsWith(".md")).map((file) => {
    const text = readText(file);
    const fm = parseFrontmatter(text);
    return {
      date: safeString(fm.date || extractDateFromPath(file)),
      status: safeString(fm.status),
      builder_items_count: safeNumber(fm.builder_items_count),
      generated_at: safeString(fm.generated_at),
      item_headings: headingCount(text, 2),
      mojibake_score: contaminationScore(text.slice(0, 20000)),
      path: rel(file)
    };
  });
}

function collectCommunityItems() {
  const file = path.join(root, "01-SiteV2/site/data/community-intelligence.json");
  if (!exists(file)) return [];
  const data = readJson(file);
  const date = safeString(data.meta?.date || data.date || "");
  return (data.items || []).map((item, index) => ({
    date,
    id: safeString(item.id || item.stable_id || `community-${index + 1}`),
    title: safeString(item.title),
    source_name: safeString(item.source_name || item.sourceName || item.source),
    source_url: safeString(item.source_url || item.url || item.link),
    category: safeString(item.category || item.group || item.type),
    score: safeNumber(item.score || item.heat || item.importance),
    mojibake_score: contaminationScore(item.title, item.summary, item.description),
    path: rel(file)
  }));
}

function collectFrontstageCards() {
  const file = path.join(root, "01-SiteV2/site/data/v3-data-observation-desk.json");
  if (!exists(file)) return [];
  const data = readJson(file);
  return (data.frontstageCards || data.cards || []).map((card, index) => ({
    date: safeString(card.date || card.published_at || data.meta?.date || ""),
    id: safeString(card.id || card.card_id || `frontstage-${index + 1}`),
    title: safeString(card.title),
    card_type: safeString(card.type || card.cardType || card.category),
    company: safeString(card.company || card.company_name || card.signal_owner),
    source_url: safeString(card.source_url || card.url || card.original_url),
    score: safeNumber(card.score || card.importance_score),
    is_top10: Boolean((data.top10 || []).some((top) => (top.id || top.card_id || top.title) === (card.id || card.card_id || card.title))),
    mojibake_score: contaminationScore(card.title, card.company, card.signal_owner, card.summary, card.fact),
    path: rel(file)
  }));
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

function collectFdeItems() {
  const rows = [];
  const fdeFile = path.join(root, "01-SiteV2/site/data/enterprise-ai-fde.json");
  if (exists(fdeFile)) {
    const data = readJson(fdeFile);
    for (const [index, item] of [...(data.fdePool || []), ...(data.items || [])].entries()) {
      rows.push({
        date: safeString(item.date || data.meta?.date || ""),
        id: safeString(item.id || item.stable_id || `fde-${index + 1}`),
        title: safeString(item.title),
        company: safeString(item.company || item.company_name || item.customer),
        source_url: safeString(item.source_url || item.url),
        stage: safeString(item.stage || item.implementation_stage),
        mojibake_score: contaminationScore(item.title, item.company, item.summary),
        path: rel(fdeFile)
      });
    }
  }
  const deskFile = path.join(root, "01-SiteV2/site/data/v3-data-observation-desk.json");
  if (exists(deskFile)) {
    const data = readJson(deskFile);
    for (const [index, item] of [
      ...(data.enterpriseAiFdePool || []),
      ...(data.enterpriseAiLensCandidates || []),
      ...(data.enterpriseAiTransformation || [])
    ].entries()) {
      rows.push({
        date: safeString(item.date || data.meta?.date || ""),
        id: safeString(item.id || item.raw_id || `desk-fde-${index + 1}`),
        title: safeString(item.title),
        company: safeString(item.company || item.company_name || item.signal_owner),
        source_url: safeString(item.source_url || item.original_url || item.url),
        stage: safeString(item.stage || item.enterprise_ai_transformation_stage),
        mojibake_score: contaminationScore(item.title, item.company, item.summary, item.reason),
        path: rel(deskFile)
      });
    }
  }
  return rows;
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

function main() {
  ensureDir(lakeDir);
  ensureDir(tablesDir);
  const legacyTables = {
    raw_items: collectRawItems(),
    pool_daily: collectPoolDaily(),
    signal_cards: collectSignalCards(),
    builders_daily: collectBuildersDaily(),
    community_items: collectCommunityItems(),
    frontstage_cards: collectFrontstageCards(),
    fde_items: collectFdeItems()
  };
  const v4Tables = {
    source_artifacts: collectDataCenterRows("source-artifacts", "source_artifact_id"),
    raw_documents: collectDataCenterRows("raw-documents", "raw_id"),
    claims: collectDataCenterRows("claims", "claim_id"),
    entities: collectDataCenterRows("entities", "entity_id"),
    entity_mentions: collectDataCenterRows("entity-mentions", "mention_id"),
    canonical_events: collectDataCenterRows("canonical-events", "event_id"),
    compatibility_cards: collectDataCenterRows("compatibility-cards", "card_id"),
    event_sources: collectDataCenterRows("event-sources"),
    event_claims: collectDataCenterRows("event-claims"),
    event_conflicts: collectDataCenterRows("event-conflicts", "conflict_id"),
    relationships: collectDataCenterRows("relationships", "relationship_id"),
    tag_assertions: collectDataCenterRows("tag-assertions"),
    facet_assertions: collectDataCenterRows("facet-assertions"),
    fde_records: collectDataCenterRows("fde-records", "fde_id"),
    hardware_records: collectDataCenterRows("hardware-records", "hardware_record_id"),
    qa_queue: collectDataCenterRows("qa-queue", "qa_id"),
    legacy_asset_mappings: collectDataCenterRows("legacy-asset-mappings")
  };
  const tables = arg("v4-only", "false") === "true" ? v4Tables : { ...legacyTables, ...v4Tables };
  for (const [name, rows] of Object.entries(tables)) writeJsonl(name, rows);
  if (arg("duckdb", "required") === "skip") {
    console.log(JSON.stringify({ ok: true, duckdb: "skipped", database: rel(dbPath), generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])) }, null, 2));
    return;
  }
  const build = rebuildDuckDb(tables);
  if (!build.ok) {
    if (arg("duckdb", "required") === "optional") {
      console.log(JSON.stringify({ ok: true, duckdb: "skipped", database: rel(dbPath), generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])), warning: build.error }, null, 2));
      return;
    }
    console.error(JSON.stringify({ ok: false, generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])), error: build.error }, null, 2));
    process.exit(1);
  }
  const summary = querySummary(build.duckdb, Object.keys(tables));
  console.log(JSON.stringify({
    ok: true,
    duckdb: build.duckdb,
    database: rel(dbPath),
    generated_tables: Object.fromEntries(Object.entries(tables).map(([k, v]) => [k, v.length])),
    summary: summary ? JSON.parse(summary) : []
  }, null, 2));
}

main();
