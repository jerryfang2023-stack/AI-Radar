#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateTaxonomy } from "./assert-tag-taxonomy-v4.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const bundleRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v4.json");
const reportPath = path.join(root, "agent-workflow/reports/tag-v4-migration-report.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function dates() {
  return fs.readdirSync(bundleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
}

function increment(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function main() {
  const taxonomy = readJson(taxonomyPath);
  const validation = validateTaxonomy(taxonomy);
  const tagCounts = new Map();
  const facetCounts = new Map();
  const eventClaimRefs = new Map();
  const claimTags = new Map();
  const claimFacets = new Map();
  let tagAssertions = 0;
  let facetAssertions = 0;
  let events = 0;

  for (const date of dates()) {
    const dir = path.join(bundleRoot, date);
    const eventRows = readJson(path.join(dir, "canonical-events.json"));
    const tagRows = readJson(path.join(dir, "tag-assertions.json"));
    const facetRows = readJson(path.join(dir, "facet-assertions.json"));
    events += eventRows.length;
    tagAssertions += tagRows.length;
    facetAssertions += facetRows.length;
    for (const event of eventRows) eventClaimRefs.set(`${date}:${event.event_id}`, event.claim_refs || []);
    for (const item of tagRows) {
      increment(tagCounts, item.tag_id);
      if (!claimTags.has(item.evidence_ref)) claimTags.set(item.evidence_ref, new Set());
      claimTags.get(item.evidence_ref).add(item.tag_id);
    }
    for (const item of facetRows) {
      increment(facetCounts, `${item.dimension_id}.${item.value_id}`);
      if (!claimFacets.has(item.evidence_ref)) claimFacets.set(item.evidence_ref, new Set());
      claimFacets.get(item.evidence_ref).add(`${item.dimension_id}.${item.value_id}`);
    }
  }

  const classifiedEvents = [...eventClaimRefs.values()].filter((refs) => refs.some((id) => claimTags.has(id) || claimFacets.has(id))).length;
  const technicalTaggedEvents = [...eventClaimRefs.values()].filter((refs) => refs.some((id) => claimTags.has(id))).length;
  const facetedEvents = [...eventClaimRefs.values()].filter((refs) => refs.some((id) => claimFacets.has(id))).length;
  const activeTags = taxonomy.tags.filter((item) => item.status === "active").map((item) => item.id);
  const activeFacetValues = taxonomy.facets.flatMap((facet) => facet.values.filter((item) => item.status === "active").map((item) => `${facet.id}.${item.id}`));
  const unusedTags = activeTags.filter((id) => !tagCounts.has(id));
  const unusedFacetValues = activeFacetValues.filter((id) => !facetCounts.has(id));
  const dominantTag = [...tagCounts.entries()].sort((a, b) => b[1] - a[1])[0] || ["", 0];
  const warnings = [];
  if (tagAssertions && dominantTag[1] / tagAssertions > 0.75) warnings.push(`technical tag concentration is high: ${dominantTag[0]} ${(dominantTag[1] / tagAssertions * 100).toFixed(1)}%`);
  if (classifiedEvents / Math.max(events, 1) < 0.4) warnings.push(`classified event coverage is below 40%: ${(classifiedEvents / Math.max(events, 1) * 100).toFixed(1)}%`);

  const lines = [
    "# TAG-V4.0 Migration and Coverage Report",
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- taxonomy_status: ${validation.ok ? "passed" : "failed"}`,
    `- dates: ${dates().join(", ")}`,
    `- canonical_events: ${events}`,
    `- technical_tag_assertions: ${tagAssertions}`,
    `- facet_assertions: ${facetAssertions}`,
    `- classified_event_coverage: ${(classifiedEvents / Math.max(events, 1) * 100).toFixed(1)}%`,
    `- technical_tag_event_coverage: ${(technicalTaggedEvents / Math.max(events, 1) * 100).toFixed(1)}%`,
    `- structured_facet_event_coverage: ${(facetedEvents / Math.max(events, 1) * 100).toFixed(1)}%`,
    "",
    "## Technical Tag Distribution",
    "",
    ...([...tagCounts.entries()].sort((a, b) => b[1] - a[1]).map(([id, count]) => `- ${id}: ${count}`)),
    "",
    "## Structured Facet Distribution",
    "",
    ...([...facetCounts.entries()].sort((a, b) => b[1] - a[1]).map(([id, count]) => `- ${id}: ${count}`)),
    "",
    "## Unused Active Definitions",
    "",
    `- technical_tags: ${unusedTags.join(", ") || "none"}`,
    `- facet_values: ${unusedFacetValues.join(", ") || "none"}`,
    "",
    "## Warnings",
    "",
    ...(warnings.length ? warnings.map((warning) => `- ${warning}`) : ["- none"]),
    ""
  ];
  fs.writeFileSync(reportPath, lines.join("\n"), "utf8");
  console.log(JSON.stringify({
    ok: validation.ok,
    taxonomy: validation.counts,
    events,
    tagAssertions,
    facetAssertions,
    classifiedEventCoverage: classifiedEvents / Math.max(events, 1),
    technicalTagEventCoverage: technicalTaggedEvents / Math.max(events, 1),
    structuredFacetEventCoverage: facetedEvents / Math.max(events, 1),
    unusedTags,
    unusedFacetValues,
    warnings,
    report: path.relative(root, reportPath).replace(/\\/gu, "/")
  }, null, 2));
  if (!validation.ok) process.exit(1);
}

main();
