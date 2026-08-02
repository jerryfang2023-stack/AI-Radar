#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dataCenterRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const fundingRoot = path.join(root, "01-SiteV2/content/12-applications/funding-insights");
const decisionFile = path.join(fundingRoot, "taxonomy-decisions-v4-1.json");
const outputName = "reviewed-event-classifications.json";
const canonicalEventAliases = new Map([
  ["EV-5f3ccb941a2fe5d7", "EV-2a78dd5feb40a78a"],
  ["EV-df789745fb926bfd", "EV-ecc12e5ec883b7e7"],
  ["EV-2dff32c1b6f813e4", "EV-b2d94511e4b4dfc8"],
  ["EV-305ec93673f4f12e", "EV-82e77abb1a77f81c"],
]);

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function nameKey(value = "") {
  return clean(value)
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\b(?:incorporated|inc|limited|ltd|llc|corp(?:oration)?|company|co|plc|gmbh|pte)\b\.?/giu, " ")
    .replace(/[^\p{L}\p{N}]+/gu, "")
    .trim();
}

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 16);
}

function uniqueBy(values, keyFn) {
  const out = [];
  const seen = new Set();
  for (const value of values) {
    const key = keyFn(value);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out;
}

function fundingCards() {
  return fs.readdirSync(fundingRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{4}-\d{2}-\d{2}\.json$/u.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => readJson(path.join(fundingRoot, entry.name), { cards: [] }).cards || []);
}

function datedBundles() {
  return fs.readdirSync(dataCenterRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => ({ date: entry.name, dir: path.join(dataCenterRoot, entry.name) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function dimensionRows(decision) {
  return [
    ["ai_market_category", decision.market_category_id],
    ["ai_market_subcategory", decision.market_subcategory_id],
    ["ai_market_application", decision.market_application_id],
    ["product_form", decision.product_form_id],
    ...(decision.use_case_ids || []).map((value) => ["use_case", value]),
    ...(decision.industry_ids || []).map((value) => ["industry", value]),
    ...(decision.target_user_ids || []).map((value) => ["target_user", value]),
  ].filter(([, value]) => clean(value));
}

function evidenceForCard(card) {
  const sourceById = new Map((card.research_sources || []).map((source) => [source.source_id, source]));
  const refs = [
    ...(card.company?.evidence_refs || []),
    ...(card.products || []).flatMap((product) => product.evidence_refs || []),
  ];
  return uniqueBy(refs.map((ref) => {
    const source = sourceById.get(ref.source_id) || {};
    return {
      source_id: clean(ref.source_id),
      source_url: clean(source.source_url),
      quote: clean(ref.quote),
      source_content_hash: clean(ref.source_content_hash || source.content_hash),
      quote_hash: clean(ref.quote_hash),
    };
  }).filter((ref) => ref.source_id && ref.source_url && ref.quote && ref.source_content_hash && ref.quote_hash), (ref) => (
    `${ref.source_id}|${ref.quote_hash}`
  )).slice(0, 4);
}

function resolveReviewedCompany(card, entitiesById, entityIdByName) {
  const fullName = clean(card.company?.full_name);
  const displayName = clean(card.company?.name);
  const canonicalName = fullName || displayName;
  const declaredId = clean(card.company?.entity_id);
  const declared = entitiesById.get(declaredId);
  const acceptedKeys = new Set([nameKey(fullName), nameKey(displayName)].filter(Boolean));
  if (declared && acceptedKeys.has(nameKey(declared.canonical_name))) {
    return { entity_id: declaredId, company_name: canonicalName, resolution: "declared_entity_exact" };
  }
  const resolvedId = entityIdByName.get(nameKey(fullName)) || entityIdByName.get(nameKey(displayName));
  if (resolvedId) return { entity_id: resolvedId, company_name: canonicalName, resolution: "catalog_name_exact" };
  return {
    entity_id: `EN-${hash(`funding-reviewed-company|${nameKey(canonicalName)}`)}`,
    company_name: canonicalName,
    resolution: "reviewed_funding_entity",
  };
}

export function buildReviewedEventClassifications({ decisions, cards, events, entities }) {
  const eventById = new Map(events.map((event) => [event.event_id, event]));
  const entitiesById = new Map(entities.map((entity) => [entity.entity_id, entity]));
  const entityIdByName = new Map();
  for (const entity of entities) {
    for (const value of [entity.canonical_name, ...(entity.aliases || [])]) {
      const key = nameKey(value);
      if (key && !entityIdByName.has(key)) entityIdByName.set(key, entity.entity_id);
    }
  }
  const cardByEvent = new Map();
  for (const card of cards) {
    for (const eventId of new Set([
      card.triggered_by_event_id,
      ...(card.source_event_ids || []),
      ...(card.financing?.disclosures || []).map((item) => item.event_id),
    ].filter(Boolean))) {
      if (!cardByEvent.has(eventId)) cardByEvent.set(eventId, card);
    }
  }
  const rows = [];
  for (const decision of decisions) {
    const canonicalEventId = canonicalEventAliases.get(decision.event_id) || decision.event_id;
    const event = eventById.get(canonicalEventId);
    if (!event) throw new Error(`Reviewed taxonomy decision has no canonical event: ${decision.event_id}`);
    const card = cardByEvent.get(decision.event_id);
    if (!card) throw new Error(`Reviewed taxonomy decision has no Funding Insight card: ${decision.event_id}`);
    const evidenceRefs = evidenceForCard(card);
    if (!evidenceRefs.length) throw new Error(`Reviewed taxonomy decision has no exact research evidence: ${decision.event_id}`);
    const company = resolveReviewedCompany(card, entitiesById, entityIdByName);
    for (const [dimensionId, valueId] of dimensionRows(decision)) {
      rows.push({
        reviewed_classification_id: `REC-${hash(`${canonicalEventId}|${company.entity_id}|${dimensionId}|${valueId}`)}`,
        event_id: canonicalEventId,
        decision_event_id: decision.event_id,
        entity_id: company.entity_id,
        company_name: company.company_name,
        company_resolution: company.resolution,
        funding_insight_id: card.funding_insight_id,
        decision_ref: `taxonomy-decisions-v4-1.json#${decision.event_id}`,
        dimension_id: dimensionId,
        value_id: valueId,
        evidence_refs: evidenceRefs,
        assignment_method: "reviewed_funding_insight",
        confidence: decision.confidence,
        taxonomy_version: "TAG-V4.1",
        review_status: "accepted",
        status: "active",
      });
    }
  }
  return rows.sort((a, b) => a.event_id.localeCompare(b.event_id)
    || a.dimension_id.localeCompare(b.dimension_id)
    || a.value_id.localeCompare(b.value_id));
}

export function projectFundingTaxonomy(rootDir = root) {
  if (rootDir !== root) throw new Error("Custom roots are not supported by the write command");
  const bundles = datedBundles();
  const events = [];
  const entities = [];
  const dateByEvent = new Map();
  for (const bundle of bundles) {
    for (const event of readJson(path.join(bundle.dir, "canonical-events.json"), [])) {
      events.push(event);
      dateByEvent.set(event.event_id, bundle.date);
    }
    entities.push(...readJson(path.join(bundle.dir, "entities.json"), []));
  }
  const ledger = readJson(decisionFile, { decisions: [] });
  if (ledger.meta?.taxonomy_version !== "TAG-V4.1") throw new Error("Funding taxonomy ledger must use TAG-V4.1");
  const rows = buildReviewedEventClassifications({
    decisions: ledger.decisions || [],
    cards: fundingCards(),
    events,
    entities,
  });
  const byDate = new Map(bundles.map((bundle) => [bundle.date, []]));
  for (const row of rows) {
    const date = dateByEvent.get(row.event_id);
    if (!date) throw new Error(`Reviewed classification cannot resolve event bundle: ${row.event_id}`);
    byDate.get(date).push(row);
  }
  for (const bundle of bundles) {
    const dateRows = byDate.get(bundle.date) || [];
    writeJson(path.join(bundle.dir, outputName), dateRows);
    const manifestFile = path.join(bundle.dir, "manifest.json");
    const manifest = readJson(manifestFile);
    manifest.counts = { ...manifest.counts, reviewed_event_classifications: dateRows.length };
    writeJson(manifestFile, manifest);
  }
  return {
    taxonomy_version: "TAG-V4.1",
    decisions: ledger.decisions.length,
    assertions: rows.length,
    classified_events: new Set(rows.map((row) => row.event_id)).size,
    classified_entities: new Set(rows.map((row) => row.entity_id)).size,
    synthetic_reviewed_entities: new Set(rows.filter((row) => row.company_resolution === "reviewed_funding_entity").map((row) => row.entity_id)).size,
    dates: bundles.length,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify({ ok: true, ...projectFundingTaxonomy() }, null, 2));
}
