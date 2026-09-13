#!/usr/bin/env node
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export function unionPublishedRows(restored, published, key) {
  const rows = new Map();
  for (const row of [...restored, ...published]) {
    const identity = key(row);
    if (!identity) throw new Error("Checkpoint row has no stable identity");
    rows.set(identity, row);
  }
  return [...rows.values()];
}

function main() {
  const ref = process.argv.find((arg) => arg.startsWith("--git-ref="))?.slice(10) || "HEAD";
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/u.test(ref)) throw new Error("Invalid published checkpoint ref");
  const readPublished = (file) => execFileSync("git", ["show", `${ref}:${file}`], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, windowsHide: true });
  const taxonomyFile = "01-SiteV2/content/12-applications/funding-insights/taxonomy-decisions-v4-1.json";
  const restored = JSON.parse(fs.readFileSync(taxonomyFile, "utf8"));
  const published = JSON.parse(readPublished(taxonomyFile));
  restored.decisions = unionPublishedRows(restored.decisions, published.decisions, (row) => row.event_id);
  restored.meta.decision_count = restored.decisions.length;
  fs.writeFileSync(taxonomyFile, `${JSON.stringify(restored, null, 2)}\n`);
  const translationsFile = "01-SiteV2/content/11-databases/public-zh-translations-v1.json";
  const translations = JSON.parse(fs.readFileSync(translationsFile, "utf8"));
  translations.entries = { ...translations.entries, ...JSON.parse(readPublished(translationsFile)).entries };
  fs.writeFileSync(translationsFile, `${JSON.stringify(translations, null, 2)}\n`);
  const sourceFile = "01-SiteV2/content/01-raw/source-index.jsonl";
  const lines = (text) => text.split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
  const sources = unionPublishedRows(lines(fs.readFileSync(sourceFile, "utf8")), lines(readPublished(sourceFile)),
    (row) => row.source_id && row.content_hash && `${row.data_date}|${row.source_id}|${row.content_hash}`);
  fs.writeFileSync(sourceFile, `${sources.map((row) => JSON.stringify(row)).join("\n")}\n`);
  console.log(JSON.stringify({ ok: true, published_ref: ref, taxonomy_decisions: restored.decisions.length, source_locators: sources.length }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
