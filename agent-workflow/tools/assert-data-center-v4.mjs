#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { eventAiRelevanceEvidence, forbiddenKeys } from "./build-data-center-v4.mjs";
import { validateTaxonomy } from "./assert-tag-taxonomy-v4.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const reportRoot = path.join(root, "agent-workflow/reports");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v4.json");
const BOILERPLATE = /(?:most popular|loading the next article|error loading the next article|register now|cookie settings|when you purchase through links|스크롤 이동|상태바|기사본문|the body content)/iu;

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function normalize(value) {
  return String(value ?? "").replace(/\s+/gu, " ").trim();
}

function availableDates() {
  if (!fs.existsSync(dataRoot)) return [];
  return fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name).sort();
}

export function readBundle(date) {
  const dir = path.join(dataRoot, date);
  const names = [
    "manifest", "source-artifacts", "raw-documents", "claims", "entities", "entity-mentions",
    "canonical-events", "compatibility-cards", "event-sources", "event-claims", "event-conflicts", "relationships", "tag-assertions",
    "facet-assertions", "fde-records", "hardware-records", "qa-queue", "legacy-asset-mappings"
  ];
  return Object.fromEntries(names.map((name) => [name.replace(/-/gu, "_"), readJson(path.join(dir, `${name}.json`))]));
}

export function evaluateBundle(bundle, taxonomy) {
  const failures = [];
  const warnings = [];
  const sourceIds = new Set(bundle.source_artifacts.map((item) => item.source_artifact_id));
  const rawById = new Map(bundle.raw_documents.map((item) => [item.raw_id, item]));
  const rawBySourceId = new Map(bundle.raw_documents.map((item) => [item.source_artifact_id, item]));
  const claimById = new Map(bundle.claims.map((item) => [item.claim_id, item]));
  const entityById = new Map(bundle.entities.map((item) => [item.entity_id, item]));
  const eventById = new Map(bundle.canonical_events.map((item) => [item.event_id, item]));
  const tagIds = new Set(taxonomy.tags.filter((tag) => tag.status === "active").map((tag) => tag.id));
  const facetValues = new Map(taxonomy.facets.map((facet) => [
    facet.id,
    new Set(facet.values.filter((value) => value.status === "active").map((value) => value.id))
  ]));
  const taxonomyResult = validateTaxonomy(taxonomy);
  failures.push(...taxonomyResult.failures.map((failure) => `taxonomy: ${failure}`));

  if (bundle.manifest.product_version !== "SITE-V4.0-data-center") failures.push("manifest product_version mismatch");
  if (bundle.manifest.raw_version !== "RAW-V3.0") failures.push("manifest raw_version mismatch");
  if (bundle.manifest.event_version !== "EVENT-V1.0") failures.push("manifest event_version mismatch");
  if (bundle.manifest.tag_version !== "TAG-V4.0") failures.push("manifest tag_version mismatch");

  const forbidden = forbiddenKeys(Object.fromEntries(Object.entries(bundle).filter(([name]) => name !== "manifest")));
  if (forbidden.length) failures.push(`forbidden judgment fields: ${forbidden.slice(0, 20).join(", ")}`);

  for (const raw of bundle.raw_documents) {
    if (!sourceIds.has(raw.source_artifact_id)) failures.push(`${raw.raw_id}: source_artifact_id does not resolve`);
    if (!raw.source_url && raw.extraction_status !== "quarantined") failures.push(`${raw.raw_id}: source_url missing`);
    if (raw.extraction_status === "accepted" && raw.body_clean.length < 80) failures.push(`${raw.raw_id}: accepted body_clean too short`);
    for (const claimId of raw.claim_ids) if (!claimById.has(claimId)) failures.push(`${raw.raw_id}: claim ${claimId} does not resolve`);
  }

  for (const claim of bundle.claims) {
    const raw = rawById.get(claim.raw_id);
    if (!raw) {
      failures.push(`${claim.claim_id}: raw_id does not resolve`);
      continue;
    }
    const { start, end } = claim.source_span || {};
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end > raw.body_clean.length) {
      failures.push(`${claim.claim_id}: invalid source span`);
      continue;
    }
    if (normalize(raw.body_clean.slice(start, end)) !== normalize(claim.source_quote)) failures.push(`${claim.claim_id}: quote does not match body_clean span`);
    if (BOILERPLATE.test(claim.source_quote)) failures.push(`${claim.claim_id}: boilerplate entered a claim`);
    if (!claim.subject || !claim.predicate || !claim.object) failures.push(`${claim.claim_id}: subject/predicate/object incomplete`);
  }

  let aiIndustryEventCount = 0;
  for (const event of bundle.canonical_events) {
    if (!event.source_refs.length || event.source_refs.some((id) => !sourceIds.has(id))) failures.push(`${event.event_id}: invalid source_refs`);
    if (!event.claim_refs.length || event.claim_refs.some((id) => !claimById.has(id))) failures.push(`${event.event_id}: invalid claim_refs`);
    if (["verified", "partial"].includes(event.publication_status) && event.claim_refs.some((id) => claimById.get(id)?.verification_status === "disputed")) {
      failures.push(`${event.event_id}: disputed claim published as ${event.publication_status}`);
    }
    const sourceRaw = rawBySourceId.get(event.source_refs[0]);
    const relevance = eventAiRelevanceEvidence({
      title: sourceRaw?.title_zh || sourceRaw?.title_original || event.object,
      claims: event.claim_refs.map((id) => claimById.get(id)).filter(Boolean),
      entityNames: event.entities.map((id) => entityById.get(id)?.canonical_name).filter(Boolean),
      eventType: event.event_type
    });
    if (!relevance.accepted) {
      failures.push(`${event.event_id}: canonical event fails AI industry scope gate (${relevance.basis})`);
    } else {
      aiIndustryEventCount += 1;
    }
  }

  for (const card of bundle.compatibility_cards) {
    const event = eventById.get(card.event_id);
    if (!event) failures.push(`${card.card_id}: compatibility card event_id does not resolve`);
    if (!card.title || !card.fact) failures.push(`${card.card_id}: compatibility card title/fact missing`);
    if (normalize(card.title) === normalize(card.fact)) failures.push(`${card.card_id}: compatibility card fact duplicates title`);
    if (!card.claim_refs.length || !card.source_refs.length) failures.push(`${card.card_id}: compatibility card evidence refs missing`);
  }

  for (const assertion of bundle.tag_assertions) {
    const claim = claimById.get(assertion.evidence_ref);
    if (!tagIds.has(assertion.tag_id)) failures.push(`${assertion.asset_id}: unknown or deprecated tag ${assertion.tag_id}`);
    if (!claim) failures.push(`${assertion.asset_id}: tag evidence_ref does not resolve`);
    if (assertion.asset_id !== assertion.evidence_ref) failures.push(`${assertion.asset_id}: tag asset must be the accepted claim`);
    if (claim && JSON.stringify(assertion.source_span) !== JSON.stringify(claim.source_span)) failures.push(`${assertion.asset_id}: tag source_span differs from claim span`);
    if (assertion.taxonomy_version !== "TAG-V4.0") failures.push(`${assertion.asset_id}: tag taxonomy_version mismatch`);
  }

  for (const assertion of bundle.facet_assertions) {
    const claim = claimById.get(assertion.evidence_ref);
    if (!facetValues.has(assertion.dimension_id)) failures.push(`${assertion.asset_id}: unknown facet ${assertion.dimension_id}`);
    else if (!facetValues.get(assertion.dimension_id).has(assertion.value_id)) failures.push(`${assertion.asset_id}: unknown or deprecated facet value ${assertion.dimension_id}.${assertion.value_id}`);
    if (!claim) failures.push(`${assertion.asset_id}: facet evidence_ref does not resolve`);
    if (assertion.asset_id !== assertion.evidence_ref) failures.push(`${assertion.asset_id}: facet asset must be the accepted claim`);
    if (claim && JSON.stringify(assertion.source_span) !== JSON.stringify(claim.source_span)) failures.push(`${assertion.asset_id}: facet source_span differs from claim span`);
    if (assertion.taxonomy_version !== "TAG-V4.0") failures.push(`${assertion.asset_id}: facet taxonomy_version mismatch`);
  }

  for (const relationship of bundle.relationships) {
    if (!eventById.has(relationship.event_id)) failures.push(`${relationship.relationship_id}: relationship event_id does not resolve`);
    if (!claimById.has(relationship.claim_ref)) failures.push(`${relationship.relationship_id}: relationship claim_ref does not resolve`);
    if (!relationship.source_refs.length || relationship.source_refs.some((id) => !sourceIds.has(id))) failures.push(`${relationship.relationship_id}: relationship source_refs invalid`);
  }

  for (const record of bundle.fde_records) {
    const event = eventById.get(record.event_id);
    if (!event) failures.push(`${record.fde_id}: event_id does not resolve`);
    else if (!["verified", "partial"].includes(event.publication_status)) failures.push(`${record.fde_id}: disputed/quarantined event projected to FDE`);
    if (!record.claim_refs.length || !record.source_refs.length) failures.push(`${record.fde_id}: evidence refs missing`);
  }

  for (const record of bundle.hardware_records) {
    const event = eventById.get(record.event_id);
    if (!event) failures.push(`${record.hardware_record_id}: event_id does not resolve`);
    else if (!["verified", "partial"].includes(event.publication_status)) failures.push(`${record.hardware_record_id}: disputed/quarantined event projected to hardware`);
    if (!record.component_type) failures.push(`${record.hardware_record_id}: component_type missing`);
    if (!record.claim_refs.length || !record.source_refs.length) failures.push(`${record.hardware_record_id}: evidence refs missing`);
  }

  const mappedEvents = bundle.legacy_asset_mappings.filter((item) => item.event_id).map((item) => item.event_id);
  for (const eventId of mappedEvents) if (!eventById.has(eventId)) failures.push(`legacy mapping event ${eventId} does not resolve`);
  if (!bundle.canonical_events.length) warnings.push("No canonical event was produced; Raw data remains available and the day requires coverage review.");
  if (!bundle.fde_records.length) warnings.push("No source-bounded FDE projection was produced.");
  if (!bundle.hardware_records.length) warnings.push("No source-bounded hardware projection was produced.");

  return {
    ok: failures.length === 0,
    failures,
    warnings,
    counts: bundle.manifest.counts,
    metrics: {
      canonical_event_source_traceability: bundle.canonical_events.length ? bundle.canonical_events.filter((event) => event.source_refs.length).length / bundle.canonical_events.length : 1,
      canonical_event_claim_traceability: bundle.canonical_events.length ? bundle.canonical_events.filter((event) => event.claim_refs.length).length / bundle.canonical_events.length : 1,
      ai_industry_scope_coverage: bundle.canonical_events.length ? aiIndustryEventCount / bundle.canonical_events.length : 1,
      tag_evidence_coverage: bundle.tag_assertions.length ? bundle.tag_assertions.filter((item) => item.evidence_ref && item.source_span).length / bundle.tag_assertions.length : 1,
      facet_evidence_coverage: bundle.facet_assertions.length ? bundle.facet_assertions.filter((item) => item.evidence_ref && item.source_span).length / bundle.facet_assertions.length : 1
    }
  };
}

function markdownReport(date, result) {
  const lines = [
    `# Data Center V4 Integrity Gate — ${date}`,
    "",
    `- status: ${result.ok ? "passed" : "failed"}`,
    `- canonical_events: ${result.counts.canonical_events}`,
    `- claims: ${result.counts.claims}`,
    `- tag_assertions: ${result.counts.tag_assertions}`,
    `- facet_assertions: ${result.counts.facet_assertions}`,
    `- fde_records: ${result.counts.fde_records}`,
    `- hardware_records: ${result.counts.hardware_records}`,
    `- event_source_traceability: ${(result.metrics.canonical_event_source_traceability * 100).toFixed(1)}%`,
    `- event_claim_traceability: ${(result.metrics.canonical_event_claim_traceability * 100).toFixed(1)}%`,
    `- ai_industry_scope_coverage: ${(result.metrics.ai_industry_scope_coverage * 100).toFixed(1)}%`,
    `- tag_evidence_coverage: ${(result.metrics.tag_evidence_coverage * 100).toFixed(1)}%`,
    `- facet_evidence_coverage: ${(result.metrics.facet_evidence_coverage * 100).toFixed(1)}%`,
    "",
    "## Failures",
    "",
    ...(result.failures.length ? result.failures.map((item) => `- ${item}`) : ["- none"]),
    "",
    "## Warnings",
    "",
    ...(result.warnings.length ? result.warnings.map((item) => `- ${item}`) : ["- none"]),
    ""
  ];
  return lines.join("\n");
}

function main() {
  const date = arg("date", availableDates().at(-1));
  if (!date) throw new Error("No Data Center V4 bundle found. Pass --date=YYYY-MM-DD.");
  const bundle = readBundle(date);
  const taxonomy = readJson(taxonomyPath);
  const result = evaluateBundle(bundle, taxonomy);
  const reportJson = path.join(reportRoot, `${date}-data-center-v4-integrity-gate.json`);
  const reportMd = path.join(reportRoot, `${date}-data-center-v4-integrity-gate.md`);
  writeJson(reportJson, { date, generated_at: new Date().toISOString(), ...result });
  fs.writeFileSync(reportMd, markdownReport(date, result), "utf8");
  console.log(JSON.stringify({ date, report: path.relative(root, reportMd).replace(/\\/gu, "/"), ...result }, null, 2));
  if (!result.ok) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}
