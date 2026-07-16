#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildBundle, writeBundle } from "./build-data-center-v4.mjs";
import { evaluateBundle, readBundle } from "./assert-data-center-v4.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const rawRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
const reportRoot = path.join(root, "agent-workflow/reports");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v4.json");

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function availableDates() {
  return fs.readdirSync(rawRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function rawEntries(date) {
  const dir = path.join(rawRoot, date);
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => {
      const file = path.join(dir, name);
      return { file, raw: readJson(file) };
    });
}

function selectedDates() {
  const from = arg("from", "");
  const to = arg("to", "");
  return availableDates().filter((date) => (!from || date >= from) && (!to || date <= to));
}

function reportMarkdown(report) {
  const lines = [
    "# Data Center V4 Historical Backfill",
    "",
    `- generated_at: ${report.generated_at}`,
    `- mode: ${report.write ? "write" : "dry-run"}`,
    `- from: ${report.from}`,
    `- to: ${report.to}`,
    `- dates: ${report.dates}`,
    `- raw_documents: ${report.totals.raw_documents}`,
    `- canonical_events: ${report.totals.canonical_events}`,
    `- claims: ${report.totals.claims}`,
    `- quarantined_raw: ${report.totals.quarantined_raw}`,
    `- status: ${report.ok ? "passed" : "failed"}`,
    "",
    "| Date | Raw | Events | Claims | Quarantined | Gate |",
    "|---|---:|---:|---:|---:|---|",
    ...report.results.map((row) => `| ${row.date} | ${row.raw_documents} | ${row.canonical_events} | ${row.claims} | ${row.quarantined_raw} | ${row.ok ? "passed" : "failed"} |`),
    ""
  ];
  return lines.join("\n");
}

function main() {
  const dates = selectedDates();
  if (!dates.length) throw new Error("No Raw dates matched the requested backfill range.");
  const taxonomy = readJson(taxonomyPath);
  const generatedAt = new Date().toISOString();
  const write = arg("write", "false") === "true";
  const results = [];

  for (const date of dates) {
    const bundle = buildBundle(rawEntries(date), taxonomy, date, generatedAt);
    const gate = evaluateBundle(bundle, taxonomy);
    results.push({
      date,
      ok: gate.ok,
      failures: gate.failures,
      warnings: gate.warnings,
      raw_documents: bundle.raw_documents.length,
      canonical_events: bundle.canonical_events.length,
      claims: bundle.claims.length,
      quarantined_raw: bundle.raw_documents.filter((item) => item.extraction_status === "quarantined").length
    });
  }

  const failures = results.filter((row) => !row.ok);
  if (failures.length) {
    throw new Error(`Historical backfill gate failed: ${failures.map((row) => `${row.date} (${row.failures.join("; ")})`).join(", ")}`);
  }

  if (write) {
    for (const date of dates) {
      const bundle = buildBundle(rawEntries(date), taxonomy, date, generatedAt);
      writeBundle(bundle, date);
      const persistedGate = evaluateBundle(readBundle(date), taxonomy);
      if (!persistedGate.ok) {
        throw new Error(`Persisted historical bundle failed after write: ${date} (${persistedGate.failures.join("; ")})`);
      }
    }
  }

  const report = {
    ok: true,
    write,
    generated_at: generatedAt,
    from: dates[0],
    to: dates.at(-1),
    dates: dates.length,
    totals: {
      raw_documents: results.reduce((sum, row) => sum + row.raw_documents, 0),
      canonical_events: results.reduce((sum, row) => sum + row.canonical_events, 0),
      claims: results.reduce((sum, row) => sum + row.claims, 0),
      quarantined_raw: results.reduce((sum, row) => sum + row.quarantined_raw, 0)
    },
    results
  };
  fs.mkdirSync(reportRoot, { recursive: true });
  const suffix = write ? "write" : "dry-run";
  const jsonFile = path.join(reportRoot, `data-center-v4-history-backfill-${suffix}.json`);
  const markdownFile = path.join(reportRoot, `data-center-v4-history-backfill-${suffix}.md`);
  fs.writeFileSync(jsonFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  fs.writeFileSync(markdownFile, reportMarkdown(report), "utf8");
  console.log(JSON.stringify({
    ok: true,
    mode: suffix,
    report: path.relative(root, markdownFile).replace(/\\/gu, "/"),
    ...report.totals,
    dates: report.dates
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}
