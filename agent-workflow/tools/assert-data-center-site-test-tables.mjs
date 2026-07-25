#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const tablesArg = process.argv.find((value) => value.startsWith("--tables-dir="));
const tablesDir = path.resolve(root, tablesArg ? tablesArg.slice("--tables-dir=".length) : path.join("data-lake", "tables"));
const requiredTables = [
  "canonical_events.jsonl",
  "claims.jsonl",
  "raw_documents.jsonl",
  "source_artifacts.jsonl",
  "entities.jsonl",
  "tag_assertions.jsonl",
  "facet_assertions.jsonl",
  "fde_records.jsonl",
  "hardware_records.jsonl",
];

const missing = requiredTables.filter((name) => !fs.existsSync(path.join(tablesDir, name)));
const canonicalEvents = path.join(tablesDir, "canonical_events.jsonl");
const emptyCanonicalEvents = !missing.includes("canonical_events.jsonl")
  && fs.statSync(canonicalEvents).size === 0;

if (missing.length || emptyCanonicalEvents) {
  const reason = missing.length
    ? `missing: ${missing.join(", ")}`
    : "canonical_events.jsonl is empty";
  console.error([
    "Data Center site tests require prepared V4 JSONL tables.",
    `Reason: ${reason}`,
    "Run the complete test entry instead:",
    "  npm run test:data-center-site",
  ].join("\n"));
  process.exit(2);
}

console.log(`Data Center site test tables are ready: ${path.relative(root, tablesDir).replace(/\\/gu, "/")}`);
