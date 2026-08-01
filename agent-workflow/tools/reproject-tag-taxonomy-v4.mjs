#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  VERSION,
  facetAssertionsForClaim,
  facetMatchers,
  tagAssertionsForClaim,
  taxonomyMatchers,
} from "./build-data-center-v4.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const taxonomyPath = path.join(root, "agent-workflow", "product", "tag-taxonomy-v4.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function serialized(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function stageJson(file, value) {
  const staged = `${file}.tag-reproject-${process.pid}.tmp`;
  fs.writeFileSync(staged, serialized(value), "utf8");
  readJson(staged);
  return { staged, file };
}

function dates() {
  return fs.readdirSync(bundleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function main() {
  const taxonomy = readJson(taxonomyPath);
  if (taxonomy.taxonomy_version !== VERSION.tag) throw new Error(`Expected ${VERSION.tag}, received ${taxonomy.taxonomy_version}`);
  const tagMatchers = taxonomyMatchers(taxonomy);
  const structuredMatchers = facetMatchers(taxonomy);
  let claims = 0;
  let tagAssertions = 0;
  let facetAssertions = 0;
  const projectedDates = [];
  const projectionPlan = [];

  for (const date of dates()) {
    const dir = path.join(bundleRoot, date);
    const claimsFile = path.join(dir, "claims.json");
    const manifestFile = path.join(dir, "manifest.json");
    if (!fs.existsSync(claimsFile) || !fs.existsSync(manifestFile)) continue;
    const claimRows = readJson(claimsFile);
    const tags = claimRows.flatMap((claim) => tagAssertionsForClaim(claim, tagMatchers));
    const facets = claimRows.flatMap((claim) => facetAssertionsForClaim(claim, structuredMatchers));
    const manifest = readJson(manifestFile);
    manifest.tag_version = VERSION.tag;
    manifest.counts = { ...manifest.counts, tag_assertions: tags.length, facet_assertions: facets.length };
    delete manifest.tag_reprojected_at;
    const claimIds = new Set(claimRows.map((claim) => claim.claim_id));
    for (const assertion of [...tags, ...facets]) {
      if (!claimIds.has(assertion.evidence_ref)) throw new Error(`${date}: unresolved taxonomy evidence_ref ${assertion.evidence_ref}`);
    }
    projectionPlan.push({ dir, manifestFile, manifest, tags, facets });
    claims += claimRows.length;
    tagAssertions += tags.length;
    facetAssertions += facets.length;
    projectedDates.push(date);
  }

  const stagedFiles = [];
  try {
    for (const item of projectionPlan) {
      stagedFiles.push(stageJson(path.join(item.dir, "tag-assertions.json"), item.tags));
      stagedFiles.push(stageJson(path.join(item.dir, "facet-assertions.json"), item.facets));
      stagedFiles.push(stageJson(item.manifestFile, item.manifest));
    }
    for (const item of stagedFiles) fs.renameSync(item.staged, item.file);
  } finally {
    for (const item of stagedFiles) if (fs.existsSync(item.staged)) fs.rmSync(item.staged, { force: true });
  }

  console.log(JSON.stringify({
    ok: true,
    taxonomy_version: VERSION.tag,
    dates: projectedDates.length,
    first_date: projectedDates[0] || "",
    last_date: projectedDates.at(-1) || "",
    claims,
    tag_assertions: tagAssertions,
    facet_assertions: facetAssertions,
  }, null, 2));
}

main();
