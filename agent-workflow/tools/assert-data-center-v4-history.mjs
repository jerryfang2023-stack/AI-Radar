#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { evaluateBundle, evaluateBundleFiles, readBundle } from "./assert-data-center-v4.mjs";

const root = process.cwd();
const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const taxonomy = JSON.parse(fs.readFileSync(
  path.join(root, "agent-workflow/product/tag-taxonomy-v4.json"),
  "utf8",
));
const dates = fs.readdirSync(dataRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
  .map((entry) => entry.name)
  .sort();
const failures = [];
let rawDocuments = 0;
let claims = 0;
let canonicalEvents = 0;

for (const date of dates) {
  const bundle = readBundle(date);
  const dataResult = evaluateBundle(bundle, taxonomy);
  const fileResult = evaluateBundleFiles(bundle, { date });
  rawDocuments += bundle.raw_documents.length;
  claims += bundle.claims.length;
  canonicalEvents += bundle.canonical_events.length;
  for (const problem of [...dataResult.failures, ...fileResult.failures]) {
    failures.push(`${date}: ${problem}`);
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  bundle_dates: dates.length,
  raw_documents: rawDocuments,
  claims,
  canonical_events: canonicalEvents,
  failures,
}, null, 2));

if (failures.length) process.exit(1);
