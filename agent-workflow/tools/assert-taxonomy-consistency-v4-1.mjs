#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  facetAssertionsForClaim,
  facetMatchers,
  tagAssertionsForClaim,
  taxonomyEvidenceSegmentRelevant,
  taxonomyMatchers,
} from "./build-data-center-v4.mjs";
import { acceptedFundingCompanyIdentityDecisions } from "./funding-insight-v1-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const retiredValues = new Set([
  "ai_market_category.ai_infrastructure",
  "ai_market_category.horizontal_ai",
  "ai_market_category.vertical_ai",
  "product_form.api_service",
  "product_form.ai_application",
  "product_form.enterprise_platform",
  "product_form.data_infrastructure",
  "product_form.security_product",
  "product_form.robot",
  "product_form.compute_system",
  "product_form.compute_service",
  "use_case.customer_service",
  "use_case.sales_marketing",
  "use_case.research_science",
  "use_case.cybersecurity",
  "use_case.enterprise_operations",
  "use_case.robotics_automation",
  "industry.technology",
  "target_user.enterprise",
  "target_user.government",
  "target_user.researcher_education",
]);

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function datedFiles(name, rootDir = root) {
  const targetRoot = path.join(rootDir, "01-SiteV2/content/11-databases/data-center-v4");
  return fs.readdirSync(targetRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => path.join(targetRoot, entry.name, name))
    .filter((file) => fs.existsSync(file));
}

function fundingCards(rootDir = root) {
  const targetRoot = path.join(rootDir, "01-SiteV2/content/12-applications/funding-insights");
  return fs.readdirSync(targetRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /^\d{4}-\d{2}-\d{2}\.json$/u.test(entry.name))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => readJson(path.join(targetRoot, entry.name), { cards: [] }).cards || []);
}

function expectedRows(decision) {
  return [
    ["ai_market_category", decision.market_category_id],
    ["ai_market_subcategory", decision.market_subcategory_id],
    ["ai_market_application", decision.market_application_id],
    ["product_form", decision.product_form_id],
    ...(decision.use_case_ids || []).map((value) => ["use_case", value]),
    ...(decision.industry_ids || []).map((value) => ["industry", value]),
    ...(decision.target_user_ids || []).map((value) => ["target_user", value]),
  ].filter(([, value]) => value);
}

function cardEventIds(card) {
  return new Set([
    card.triggered_by_event_id,
    ...(card.source_event_ids || []),
    ...(card.financing?.disclosures || []).map((item) => item.event_id),
  ].filter(Boolean));
}

function assertKnownClassification(item, validValues, owner, failures) {
  const dimension = item.dimensionId || item.dimension_id || item.dimension;
  const value = item.id || item.value_id;
  if (!dimension || !value) return;
  if (!validValues.get(dimension)?.has(value)) failures.push(`${owner}: unknown taxonomy value ${dimension}.${value}`);
  if (retiredValues.has(`${dimension}.${value}`)) failures.push(`${owner}: retired taxonomy value ${dimension}.${value}`);
}

function classificationKey(item) {
  const dimension = item.dimensionId || item.dimension_id || item.dimension;
  const value = item.id || item.value_id;
  const provenance = item.provenance || "";
  const entities = [...new Set(item.entityIds || item.entity_ids || (item.entity_id ? [item.entity_id] : []))].sort();
  return `${dimension}|${value}|${provenance}|${entities.join(",")}`;
}

function assertConsumerMatchesDataCenter(name, eventId, items, expectedItems, failures) {
  const actual = new Set((items || []).map(classificationKey));
  const expected = new Set((expectedItems || []).map(classificationKey));
  for (const key of expected) if (!actual.has(key)) failures.push(`${name} ${eventId}: classification missing ${key}`);
  for (const key of actual) if (!expected.has(key)) failures.push(`${name} ${eventId}: unexpected classification ${key}`);
}

function assertEntityScope(item, owner, failures) {
  const entities = [...new Set(item.entityIds || item.entity_ids || (item.entity_id ? [item.entity_id] : []))];
  if (item.provenance === "reviewed_funding_insight" && entities.length !== 1) {
    failures.push(`${owner}: reviewed classification must have exactly one target entity`);
  }
  if (item.provenance === "claim_assertion" && entities.length > 1) {
    failures.push(`${owner}: claim classification cannot target multiple linked entities`);
  }
}

function fundingCardHasClassification(card, row) {
  const scalarField = {
    ai_market_category: "market_category_id",
    ai_market_subcategory: "market_subcategory_id",
    ai_market_application: "market_application_id",
    product_form: "product_form_id",
  }[row.dimension_id];
  if (scalarField) return card.analysis?.[scalarField] === row.value_id;
  const arrayField = {
    use_case: "use_case_ids",
    industry: "industry_ids",
    target_user: "target_user_ids",
  }[row.dimension_id];
  return arrayField ? (card.analysis?.[arrayField] || []).includes(row.value_id) : false;
}

export function taxonomyConsistencyProblems(rootDir = root) {
  const failures = [];
  const taxonomy = readJson(path.join(rootDir, "agent-workflow/product/tag-taxonomy-v4.json"), {});
  const validValues = new Map([
    ["technology", new Set((taxonomy.tags || []).map((item) => item.id))],
    ...(taxonomy.facets || []).map((facet) => [facet.id, new Set((facet.values || []).map((item) => item.id))]),
  ]);
  const ledger = readJson(path.join(rootDir, "01-SiteV2/content/12-applications/funding-insights/taxonomy-decisions-v4-1.json"), { decisions: [] });
  const companyIdentityReview = readJson(path.join(rootDir, "01-SiteV2/content/12-applications/funding-insights/company-identity-decisions.json"), {});
  const reviewedCompanies = acceptedFundingCompanyIdentityDecisions(companyIdentityReview);
  const reviewed = datedFiles("reviewed-event-classifications.json", rootDir).flatMap((file) => readJson(file, []));
  const canonicalEntityIndex = readJson(path.join(rootDir, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), { companies: [] });
  const canonicalCompanyByName = new Map();
  for (const entity of canonicalEntityIndex.companies || []) for (const value of [entity.name, ...(entity.aliases || [])]) {
    const key = String(value || "").normalize("NFKC").toLocaleLowerCase().trim();
    if (key && !canonicalCompanyByName.has(key)) canonicalCompanyByName.set(key, entity.id);
  }
  const reviewedByDecisionEvent = new Map();
  for (const row of reviewed) {
    const key = row.decision_event_id || row.event_id;
    if (!reviewedByDecisionEvent.has(key)) reviewedByDecisionEvent.set(key, []);
    reviewedByDecisionEvent.get(key).push(row);
    assertKnownClassification(row, validValues, `reviewed ${row.reviewed_classification_id}`, failures);
    if (row.taxonomy_version !== "TAG-V4.1" || row.assignment_method !== "reviewed_funding_insight") {
      failures.push(`${row.reviewed_classification_id}: reviewed provenance drift`);
    }
    if (!row.entity_id || !row.evidence_refs?.length || row.evidence_refs.some((ref) => !ref.source_url || !ref.quote || !ref.quote_hash)) {
      failures.push(`${row.reviewed_classification_id}: reviewed evidence incomplete`);
    }
    if (row.evidence_refs?.some((ref) => !taxonomyEvidenceSegmentRelevant(ref.quote))) {
      failures.push(`${row.reviewed_classification_id}: biography, investor, or secondary-party evidence cannot support company classification`);
    }
  }

  const cards = fundingCards(rootDir);
  const cardByEvent = new Map();
  for (const card of cards) for (const eventId of cardEventIds(card)) {
    if (!cardByEvent.has(eventId)) cardByEvent.set(eventId, card);
  }
  for (const decision of ledger.decisions || []) {
    const rows = reviewedByDecisionEvent.get(decision.event_id) || [];
    const actual = new Set(rows.map((row) => `${row.dimension_id}.${row.value_id}`));
    const expected = expectedRows(decision).map(([dimension, value]) => `${dimension}.${value}`);
    if (!rows.length) failures.push(`${decision.event_id}: reviewed event classification missing`);
    for (const key of expected) if (!actual.has(key)) failures.push(`${decision.event_id}: reviewed classification missing ${key}`);
    for (const key of actual) if (!expected.includes(key)) failures.push(`${decision.event_id}: unexpected reviewed classification ${key}`);
    if (new Set(rows.map((row) => row.entity_id)).size !== 1) failures.push(`${decision.event_id}: reviewed target entity is not singular`);
    const card = cardByEvent.get(decision.event_id);
    if (!card) {
      failures.push(`${decision.event_id}: Funding Insight card missing`);
      continue;
    }
    const targetEntityId = rows[0]?.entity_id || "";
    const sourceCardNameKey = String(card.company?.full_name || card.company?.name || "").normalize("NFKC").toLocaleLowerCase().trim();
    const sourceCardEntityId = canonicalCompanyByName.get(sourceCardNameKey)
      || reviewedCompanies.get(card.company?.entity_id)?.id
      || card.company?.entity_id;
    if (sourceCardEntityId !== targetEntityId) failures.push(`${decision.event_id}: Funding Insight target entity drift`);
    for (const [field, expectedValue] of [
      ["market_category_id", decision.market_category_id],
      ["market_subcategory_id", decision.market_subcategory_id],
      ["market_application_id", decision.market_application_id],
      ["product_form_id", decision.product_form_id],
    ]) if (card.analysis?.[field] !== expectedValue) failures.push(`${decision.event_id}: card ${field} drift`);
    for (const field of ["use_case_ids", "industry_ids", "target_user_ids"]) {
      const left = [...new Set(card.analysis?.[field] || [])].sort().join("|");
      const right = [...new Set(decision[field] || [])].sort().join("|");
      if (left !== right) failures.push(`${decision.event_id}: card ${field} drift`);
    }
  }
  const decisionEventIds = new Set((ledger.decisions || []).map((decision) => decision.event_id));
  for (const eventId of reviewedByDecisionEvent.keys()) {
    if (!decisionEventIds.has(eventId)) failures.push(`${eventId}: reviewed classification has no taxonomy decision`);
  }
  if (reviewedByDecisionEvent.size !== decisionEventIds.size) {
    failures.push(`reviewed funding coverage mismatch: ${decisionEventIds.size} decisions/${reviewedByDecisionEvent.size} events`);
  }

  const claims = new Map(datedFiles("claims.json", rootDir).flatMap((file) => readJson(file, [])).map((item) => [item.claim_id, item]));
  const tagMatchers = taxonomyMatchers(taxonomy);
  const structuredMatchers = facetMatchers(taxonomy);
  for (const name of ["tag-assertions.json", "facet-assertions.json"]) {
    for (const assertion of datedFiles(name, rootDir).flatMap((file) => readJson(file, []))) {
      if (assertion.status && assertion.status !== "active") continue;
      const claim = claims.get(assertion.evidence_ref || assertion.asset_id);
      if (!claim) {
        failures.push(`${assertion.assertion_id}: evidence Claim missing`);
        continue;
      }
      const expected = name === "tag-assertions.json"
        ? tagAssertionsForClaim(claim, tagMatchers).some((item) => item.tag_id === assertion.tag_id)
        : facetAssertionsForClaim(claim, structuredMatchers).some((item) => (
          item.dimension_id === assertion.dimension_id && item.value_id === assertion.value_id
        ));
      if (!expected) failures.push(`${assertion.assertion_id}: assertion cannot be regenerated from sentence-local target evidence`);
    }
  }

  const frontstage = readJson(path.join(rootDir, "01-SiteV2/site/data/data-center-v4-frontstage.json"), {});
  if (frontstage.meta?.taxonomyVersion !== "TAG-V4.1") failures.push("data-center application taxonomy version drift");
  const eventById = new Map((frontstage.events || []).map((item) => [item.id, item]));
  const profileById = new Map((frontstage.entityProfiles || []).map((item) => [item.id, item]));
  for (const row of reviewed) {
    const event = eventById.get(row.event_id);
    const classification = event?.classifications?.find((item) => (
      item.dimensionId === row.dimension_id
      && item.id === row.value_id
      && item.provenance === "reviewed_funding_insight"
      && item.entityIds?.includes(row.entity_id)
    ));
    if (!classification) failures.push(`${row.reviewed_classification_id}: data-center application projection missing`);
    const profile = profileById.get(row.entity_id);
    if (!profile?.classificationRefs?.includes(`TX-${row.dimension_id}-${row.value_id}`)) {
      failures.push(`${row.reviewed_classification_id}: entity aggregation missing`);
    }
  }
  for (const event of frontstage.events || []) for (const item of event.classifications || []) {
    assertKnownClassification(item, validValues, `data-center ${event.id}`, failures);
    assertEntityScope(item, `data-center ${event.id}`, failures);
  }

  const funding = readJson(path.join(rootDir, "01-SiteV2/site/data/funding-insights-v1.json"), {});
  if (funding.meta?.taxonomy_version !== "TAG-V4.1") failures.push("funding application taxonomy version drift");
  const fundingByEvent = new Map();
  for (const card of funding.cards || []) if (card.triggered_by_event_id) {
    fundingByEvent.set(card.triggered_by_event_id, card);
  }
  for (const card of funding.cards || []) for (const eventId of cardEventIds(card)) {
    if (!fundingByEvent.has(eventId)) fundingByEvent.set(eventId, card);
  }
  for (const card of funding.cards || []) {
    for (const item of [card.market_category, card.market_subcategory, card.market_application, card.product_form]) {
      if (item) assertKnownClassification(item, validValues, `funding ${card.funding_insight_id}`, failures);
    }
  }
  for (const row of reviewed) {
    const card = fundingByEvent.get(row.decision_event_id);
    if (!card) {
      failures.push(`${row.reviewed_classification_id}: funding application card missing`);
      continue;
    }
    if (card.triggered_by_event_id !== row.decision_event_id) continue;
    if (card.company?.entity_id !== row.entity_id) failures.push(`${row.reviewed_classification_id}: funding application target entity drift`);
    if (!fundingCardHasClassification(card, row)) failures.push(`${row.reviewed_classification_id}: funding application classification missing`);
  }

  const opportunity = readJson(path.join(rootDir, "01-SiteV2/site/data/opportunity-evidence-v2.json"), {});
  if (opportunity.meta?.taxonomyVersion !== "TAG-V4.1") failures.push("opportunity application taxonomy version drift");
  for (const record of opportunity.evidence || []) {
    if (record.taxonomy_version !== "TAG-V4.1") failures.push(`${record.event_id}: opportunity taxonomy version drift`);
    for (const item of record.classifications || []) {
      assertKnownClassification(item, validValues, `opportunity ${record.event_id}`, failures);
      assertEntityScope(item, `opportunity ${record.event_id}`, failures);
    }
    const dataCenterEvent = eventById.get(record.event_id);
    if (dataCenterEvent) {
      assertConsumerMatchesDataCenter("opportunity", record.event_id, record.classifications, dataCenterEvent.classifications || [], failures);
    }
  }

  const trend = readJson(path.join(rootDir, "01-SiteV2/site/data/trend-radar-v1.json"), {});
  if (trend.meta?.taxonomyVersion !== "TAG-V4.1") failures.push("trend application taxonomy version drift");
  for (const event of Object.values(trend.events || {})) for (const item of event.classifications || []) {
    assertKnownClassification(item, validValues, `trend ${event.id}`, failures);
    assertEntityScope(item, `trend ${event.id}`, failures);
  }
  for (const event of Object.values(trend.events || {})) {
    const expected = eventById.get(event.id)?.classifications || [];
    assertConsumerMatchesDataCenter("trend", event.id, event.classifications, expected, failures);
  }
  return failures;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const failures = taxonomyConsistencyProblems();
  if (failures.length) {
    console.error(JSON.stringify({ ok: false, count: failures.length, failures: failures.slice(0, 100) }, null, 2));
    process.exit(1);
  }
  const ledger = readJson(path.join(root, "01-SiteV2/content/12-applications/funding-insights/taxonomy-decisions-v4-1.json"), { decisions: [] });
  console.log(JSON.stringify({
    ok: true,
    taxonomy_version: "TAG-V4.1",
    reviewed_funding_events: (ledger.decisions || []).length,
  }, null, 2));
}
