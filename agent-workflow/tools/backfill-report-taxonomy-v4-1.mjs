#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const reportRoot = path.join(root, "01-SiteV2", "content", "12-applications", "industry-reports");
const fundingDecisionPath = path.join(root, "01-SiteV2", "content", "12-applications", "funding-insights", "taxonomy-decisions-v4-1.json");
const write = process.argv.includes("--write=true");

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, "")); }
  catch { return fallback; }
}

function datedDirs() {
  return fs.readdirSync(bundleRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => path.join(bundleRoot, entry.name))
    .sort();
}

function reportFiles(dir = reportRoot) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return reportFiles(full);
    return entry.isFile() && entry.name.endsWith(".md") && entry.name.toLowerCase() !== "readme.md" ? [full] : [];
  }).sort();
}

function addToMapSet(map, key, value) {
  if (!key || !value) return;
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function buildEventTaxonomyIndex() {
  const claimToEvents = new Map();
  const eventTags = new Map();
  const eventFacets = new Map();
  for (const dir of datedDirs()) {
    for (const event of readJson(path.join(dir, "canonical-events.json"), [])) {
      for (const claimId of event.claim_refs || []) addToMapSet(claimToEvents, claimId, event.event_id);
    }
    for (const assertion of readJson(path.join(dir, "tag-assertions.json"), [])) {
      for (const eventId of claimToEvents.get(assertion.evidence_ref) || []) addToMapSet(eventTags, eventId, assertion.tag_id);
    }
    for (const assertion of readJson(path.join(dir, "facet-assertions.json"), [])) {
      for (const eventId of claimToEvents.get(assertion.evidence_ref) || []) {
        if (!eventFacets.has(eventId)) eventFacets.set(eventId, new Map());
        addToMapSet(eventFacets.get(eventId), assertion.dimension_id, assertion.value_id);
      }
    }
  }
  return { eventTags, eventFacets };
}

function inlineArray(values) {
  return JSON.stringify([...new Set(values)].sort());
}

function updateFrontMatter(source, fields) {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) return null;
  const normalized = source.replace(/\r\n/gu, "\n");
  const end = normalized.indexOf("\n---\n", 4);
  if (end < 0) return null;
  let header = normalized.slice(4, end);
  for (const [key, value] of Object.entries(fields)) {
    const line = `${key}: ${value}`;
    const pattern = new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}:.*$`, "mu");
    header = pattern.test(header) ? header.replace(pattern, line) : `${header}\n${line}`;
  }
  return `---\n${header}\n---\n${normalized.slice(end + 5)}`;
}

const { eventTags, eventFacets } = buildEventTaxonomyIndex();
const fundingDecisions = new Map((readJson(fundingDecisionPath, {})?.decisions || []).map((decision) => [decision.event_id, decision]));
const summaries = [];

for (const file of reportFiles()) {
  const source = fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, "");
  const eventIds = [...new Set([...source.matchAll(/\[E:(EV-[a-z0-9]+)\]/giu)].map((match) => match[1]))];
  const tags = eventIds.flatMap((eventId) => [...(eventTags.get(eventId) || [])]);
  const facetValues = (dimension) => eventIds.flatMap((eventId) => [...(eventFacets.get(eventId)?.get(dimension) || [])]);
  const funding = eventIds.map((eventId) => fundingDecisions.get(eventId)).filter(Boolean);
  const updated = updateFrontMatter(source, {
    taxonomy_version: "TAG-V4.1",
    technical_tag_ids: inlineArray(tags),
    market_category_ids: inlineArray(funding.map((decision) => decision.market_category_id)),
    market_subcategory_ids: inlineArray(funding.map((decision) => decision.market_subcategory_id).filter(Boolean)),
    product_form_ids: inlineArray([...facetValues("product_form"), ...funding.map((decision) => decision.product_form_id)]),
    use_case_ids: inlineArray([...facetValues("use_case"), ...funding.flatMap((decision) => decision.use_case_ids || [])]),
    industry_ids: inlineArray([...facetValues("industry"), ...funding.flatMap((decision) => decision.industry_ids || [])]),
  });
  if (!updated) {
    summaries.push({ file: path.relative(root, file).replace(/\\/gu, "/"), status: "skipped_no_front_matter" });
    continue;
  }
  const changed = updated !== source.replace(/\r\n/gu, "\n");
  if (write && changed) fs.writeFileSync(file, updated, "utf8");
  summaries.push({
    file: path.relative(root, file).replace(/\\/gu, "/"),
    status: changed ? (write ? "updated" : "would_update") : "unchanged",
    cited_event_count: eventIds.length,
    technical_tag_count: new Set(tags).size,
  });
}

console.log(JSON.stringify({
  ok: true,
  taxonomy_version: "TAG-V4.1",
  write,
  report_count: summaries.length,
  changed_count: summaries.filter((item) => ["updated", "would_update"].includes(item.status)).length,
  skipped_count: summaries.filter((item) => item.status.startsWith("skipped")).length,
  reports: summaries,
}, null, 2));
