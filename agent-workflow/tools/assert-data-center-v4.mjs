#!/usr/bin/env node

import fs from "fs";
import path from "path";
import crypto from "node:crypto";
import { fileURLToPath } from "url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { eventAiRelevanceEvidence, forbiddenKeys, publicEventSourceTitleIssue, publicEventSourceUrlIssue } from "./build-data-center-v4.mjs";
import { buildEventDisplayTitle } from "./event-public-title.mjs";
import { validateTaxonomy } from "./assert-tag-taxonomy-v4.mjs";
import { hydrateRawDocument } from "./lib/private-evidence-store.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const reportRoot = path.join(root, "agent-workflow/reports");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v4.json");
const schemaPath = path.join(root, "agent-workflow/product/data-center-v4.schema.json");
const BOILERPLATE = /^(?:most popular|loading the next article|error loading the next article|register now|cookie settings|when you purchase through links|스크롤 이동|상태바|기사본문|the body content)\b/iu;
let schemaValidator = null;

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

function sourceBackedPublicTitle(raw = {}) {
  return buildEventDisplayTitle({ rawDocument: raw });
}

function normalizeUrl(value) {
  const text = normalize(value);
  if (!text) return "";
  try {
    const url = new URL(text);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase().replace(/^www\./u, "");
    url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
    return url.toString().replace(/\/$/u, "");
  } catch {
    return text.replace(/#.*$/u, "").replace(/\/$/u, "");
  }
}

function relativeWorkspacePath(workspaceRoot, file) {
  return path.relative(workspaceRoot, file).replace(/\\/gu, "/");
}

function resolveWorkspaceRef(workspaceRoot, ref) {
  const text = normalize(ref);
  if (!text) return { ok: false, reason: "empty" };
  const file = path.resolve(workspaceRoot, text.replace(/\//gu, path.sep));
  const relative = path.relative(workspaceRoot, file);
  if (relative === "" || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    return { ok: false, reason: "outside workspace", file };
  }
  return { ok: true, file, relative: relative.replace(/\\/gu, "/") };
}

function validateSchema(bundle) {
  if (!schemaValidator) {
    const ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true, strict: false });
    addFormats(ajv);
    schemaValidator = ajv.compile(readJson(schemaPath));
  }
  if (schemaValidator(bundle)) return [];
  return (schemaValidator.errors || []).map((error) => {
    const location = error.instancePath || "/";
    return `schema ${location}: ${error.message}`;
  });
}

function duplicateIds(rows, key, label) {
  const seen = new Set();
  const duplicates = new Set();
  for (const row of rows) {
    const id = normalize(row?.[key]);
    if (!id) continue;
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  return [...duplicates].map((id) => `${label}: duplicate ${key} ${id}`);
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
    "canonical-events", "event-sources", "event-claims", "event-conflicts", "relationships", "tag-assertions",
    "facet-assertions", "reviewed-event-classifications", "fde-records", "fde-observations", "hardware-records", "hardware-facts",
    "hardware-snapshots", "monitoring-funnel", "qa-queue", "legacy-asset-mappings"
  ];
  return Object.fromEntries(names.flatMap((name) => {
    const file = path.join(dir, `${name}.json`);
    if (name === "legacy-asset-mappings" && !fs.existsSync(file)) return [];
    return [[name.replace(/-/gu, "_"), readJson(file)]];
  }));
}

export function evaluateBundle(bundle, taxonomy, options = {}) {
  const failures = [];
  const warnings = [];
  failures.push(...validateSchema(bundle));
  failures.push(...duplicateIds(bundle.source_artifacts, "source_artifact_id", "source_artifacts"));
  failures.push(...duplicateIds(bundle.raw_documents, "raw_id", "raw_documents"));
  failures.push(...duplicateIds(bundle.claims, "claim_id", "claims"));
  failures.push(...duplicateIds(bundle.entities, "entity_id", "entities"));
  failures.push(...duplicateIds(bundle.entity_mentions, "mention_id", "entity_mentions"));
  failures.push(...duplicateIds(bundle.canonical_events, "event_id", "canonical_events"));
  const sourceIds = new Set(bundle.source_artifacts.map((item) => item.source_artifact_id));
  const hydratedRawDocuments = options.hydratedRawDocuments
    || bundle.raw_documents.map((item) => hydrateRawDocument(root, item, { required: false }));
  const rawById = new Map(hydratedRawDocuments.map((item) => [item.raw_id, item]));
  const rawBySourceId = new Map(hydratedRawDocuments.map((item) => [item.source_artifact_id, item]));
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
  if (bundle.manifest.raw_version !== "RAW-V4.0") failures.push("manifest raw_version mismatch");
  if (bundle.manifest.event_version !== "EVENT-V1.1") failures.push("manifest event_version mismatch");
  if (bundle.manifest.fde_version !== "FDE-V2.0") failures.push("manifest fde_version mismatch");
  if (bundle.manifest.fde_observation_version !== "FDE-OBSERVATION-V1.0") failures.push("manifest fde_observation_version mismatch");
  if (bundle.manifest.hardware_version !== "HARDWARE-V1.0") failures.push("manifest hardware_version mismatch");
  if (bundle.manifest.hardware_fact_version !== "HARDWARE-FACT-V1.0") failures.push("manifest hardware_fact_version mismatch");
  if (bundle.manifest.hardware_snapshot_version !== "HARDWARE-SNAPSHOT-V1.0") failures.push("manifest hardware_snapshot_version mismatch");
  if (bundle.manifest.monitoring_funnel_version !== "LENS-FUNNEL-V1.0") failures.push("manifest monitoring_funnel_version mismatch");
  if (bundle.manifest.tag_version !== "TAG-V4.1") failures.push("manifest tag_version mismatch");

  const forbidden = forbiddenKeys(Object.fromEntries(Object.entries(bundle).filter(([name]) => name !== "manifest")));
  if (forbidden.length) failures.push(`forbidden judgment fields: ${forbidden.slice(0, 20).join(", ")}`);

  for (const raw of hydratedRawDocuments) {
    if (!sourceIds.has(raw.source_artifact_id)) failures.push(`${raw.raw_id}: source_artifact_id does not resolve`);
    if (!raw.source_url && raw.extraction_status !== "quarantined") failures.push(`${raw.raw_id}: source_url missing`);
    if (raw.extraction_status === "accepted" && String(raw.body_clean || "").length < 80) {
      failures.push(`${raw.raw_id}: accepted private body is unavailable or too short`);
    }
    for (const claimId of raw.claim_ids) if (!claimById.has(claimId)) failures.push(`${raw.raw_id}: claim ${claimId} does not resolve`);
  }

  for (const claim of bundle.claims) {
    const raw = rawById.get(claim.raw_id);
    if (!raw) {
      failures.push(`${claim.claim_id}: raw_id does not resolve`);
      continue;
    }
    const { start, end } = claim.source_span || {};
    const bodyClean = String(raw.body_clean || "");
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end > bodyClean.length) {
      failures.push(`${claim.claim_id}: invalid source span`);
      continue;
    }
    if (normalize(bodyClean.slice(start, end)) !== normalize(claim.source_quote)) failures.push(`${claim.claim_id}: quote does not match private body span`);
    if (BOILERPLATE.test(claim.source_quote)) failures.push(`${claim.claim_id}: boilerplate entered a claim`);
    if (!claim.subject || !claim.predicate || !claim.object) failures.push(`${claim.claim_id}: subject/predicate/object incomplete`);
  }

  for (const mention of bundle.entity_mentions) {
    if (!entityById.has(mention.entity_id)) failures.push(`${mention.mention_id}: entity mention entity_id does not resolve`);
    if (!rawById.has(mention.raw_id)) failures.push(`${mention.mention_id}: entity mention raw_id does not resolve`);
  }

  let aiIndustryEventCount = 0;
  for (const event of bundle.canonical_events) {
    if (!event.source_refs.length || event.source_refs.some((id) => !sourceIds.has(id))) failures.push(`${event.event_id}: invalid source_refs`);
    if (!event.claim_refs.length || event.claim_refs.some((id) => !claimById.has(id))) failures.push(`${event.event_id}: invalid claim_refs`);
    if (["verified", "partial"].includes(event.publication_status) && event.claim_refs.some((id) => claimById.get(id)?.verification_status === "disputed")) {
      failures.push(`${event.event_id}: disputed claim published as ${event.publication_status}`);
    }
    const sourceTitles = event.source_refs
      .map((sourceId) => sourceBackedPublicTitle(rawBySourceId.get(sourceId)))
      .filter(Boolean);
    if (normalize(event.display_title_zh) && !sourceTitles.some((title) => normalize(title) === normalize(event.display_title_zh))) {
      failures.push(`${event.event_id}: display_title_zh is not an exact source-title translation`);
    }
    const sourceRaw = rawBySourceId.get(event.source_refs[0]);
    const sourceUrlIssue = publicEventSourceUrlIssue(sourceRaw?.source_url || sourceRaw?.canonical_url);
    if (sourceUrlIssue) failures.push(`${event.event_id}: canonical event uses an ineligible source URL (${sourceUrlIssue})`);
    const titleIssue = publicEventSourceTitleIssue(sourceRaw?.title_original || sourceRaw?.title_zh || event.display_title_zh);
    if (titleIssue) failures.push(`${event.event_id}: canonical event uses an ineligible source title (${titleIssue})`);
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

  for (const link of bundle.event_sources) {
    if (!eventById.has(link.event_id)) failures.push(`${link.event_id}: event source event_id does not resolve`);
    if (!sourceIds.has(link.source_artifact_id)) failures.push(`${link.event_id}: event source source_artifact_id does not resolve`);
  }

  for (const link of bundle.event_claims) {
    if (!eventById.has(link.event_id)) failures.push(`${link.event_id}: event claim event_id does not resolve`);
    if (!claimById.has(link.claim_id)) failures.push(`${link.event_id}: event claim claim_id does not resolve`);
  }

  for (const conflict of bundle.event_conflicts) {
    if (!eventById.has(conflict.event_id)) failures.push(`${conflict.conflict_id}: event conflict event_id does not resolve`);
    if (!conflict.source_refs.length || conflict.source_refs.some((id) => !sourceIds.has(id))) failures.push(`${conflict.conflict_id}: event conflict source_refs invalid`);
  }

  for (const assertion of bundle.tag_assertions) {
    const claim = claimById.get(assertion.evidence_ref);
    if (!tagIds.has(assertion.tag_id)) failures.push(`${assertion.asset_id}: unknown or deprecated tag ${assertion.tag_id}`);
    if (!claim) failures.push(`${assertion.asset_id}: tag evidence_ref does not resolve`);
    if (assertion.asset_id !== assertion.evidence_ref) failures.push(`${assertion.asset_id}: tag asset must be the accepted claim`);
    if (claim && JSON.stringify(assertion.source_span) !== JSON.stringify(claim.source_span)) failures.push(`${assertion.asset_id}: tag source_span differs from claim span`);
    if (assertion.taxonomy_version !== "TAG-V4.1") failures.push(`${assertion.asset_id}: tag taxonomy_version mismatch`);
  }

  for (const assertion of bundle.facet_assertions) {
    const claim = claimById.get(assertion.evidence_ref);
    if (!facetValues.has(assertion.dimension_id)) failures.push(`${assertion.asset_id}: unknown facet ${assertion.dimension_id}`);
    else if (!facetValues.get(assertion.dimension_id).has(assertion.value_id)) failures.push(`${assertion.asset_id}: unknown or deprecated facet value ${assertion.dimension_id}.${assertion.value_id}`);
    if (!claim) failures.push(`${assertion.asset_id}: facet evidence_ref does not resolve`);
    if (assertion.asset_id !== assertion.evidence_ref) failures.push(`${assertion.asset_id}: facet asset must be the accepted claim`);
    if (claim && JSON.stringify(assertion.source_span) !== JSON.stringify(claim.source_span)) failures.push(`${assertion.asset_id}: facet source_span differs from claim span`);
    if (assertion.taxonomy_version !== "TAG-V4.1") failures.push(`${assertion.asset_id}: facet taxonomy_version mismatch`);
  }

  const reviewedEventClassifications = bundle.reviewed_event_classifications || [];
  failures.push(...duplicateIds(reviewedEventClassifications, "reviewed_classification_id", "reviewed_event_classifications"));
  for (const assertion of reviewedEventClassifications) {
    if (!eventById.has(assertion.event_id)) failures.push(`${assertion.reviewed_classification_id}: reviewed event_id does not resolve`);
    if (!facetValues.has(assertion.dimension_id)) failures.push(`${assertion.reviewed_classification_id}: unknown reviewed facet ${assertion.dimension_id}`);
    else if (!facetValues.get(assertion.dimension_id).has(assertion.value_id)) failures.push(`${assertion.reviewed_classification_id}: unknown reviewed facet value ${assertion.dimension_id}.${assertion.value_id}`);
    if (assertion.taxonomy_version !== "TAG-V4.1") failures.push(`${assertion.reviewed_classification_id}: reviewed taxonomy_version mismatch`);
    if (assertion.assignment_method !== "reviewed_funding_insight" || assertion.review_status !== "accepted") {
      failures.push(`${assertion.reviewed_classification_id}: reviewed classification lacks accepted review provenance`);
    }
    for (const evidence of assertion.evidence_refs || []) {
      const quoteHash = crypto.createHash("sha256").update(String(evidence.quote || "")).digest("hex");
      if (quoteHash !== evidence.quote_hash) failures.push(`${assertion.reviewed_classification_id}: reviewed evidence quote hash mismatch`);
    }
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
    if (record.claim_refs.some((id) => !claimById.has(id) || !event?.claim_refs.includes(id))) failures.push(`${record.fde_id}: FDE claim_refs invalid`);
    if (record.source_refs.some((id) => !sourceIds.has(id) || !event?.source_refs.includes(id))) failures.push(`${record.fde_id}: FDE source_refs invalid`);
  }

  failures.push(...duplicateIds(bundle.fde_observations, "observation_id", "fde_observations"));
  for (const observation of bundle.fde_observations) {
    if (!observation.claim_refs.length || observation.claim_refs.some((id) => !claimById.has(id))) failures.push(`${observation.observation_id}: FDE observation claim_refs invalid`);
    if (!observation.source_refs.length || observation.source_refs.some((id) => !sourceIds.has(id))) failures.push(`${observation.observation_id}: FDE observation source_refs invalid`);
    if (observation.event_refs.some((id) => !eventById.has(id))) failures.push(`${observation.observation_id}: FDE observation event_refs invalid`);
    if (observation.completeness.resolved_fields + observation.completeness.missing_fields.length !== observation.completeness.total_fields) {
      failures.push(`${observation.observation_id}: FDE observation completeness counts inconsistent`);
    }
  }

  for (const record of bundle.hardware_records) {
    const event = eventById.get(record.event_id);
    if (!event) failures.push(`${record.hardware_record_id}: event_id does not resolve`);
    else if (!["verified", "partial"].includes(event.publication_status)) failures.push(`${record.hardware_record_id}: disputed/quarantined event projected to hardware`);
    if (!record.component_type) failures.push(`${record.hardware_record_id}: component_type missing`);
    if (!record.claim_refs.length || !record.source_refs.length) failures.push(`${record.hardware_record_id}: evidence refs missing`);
    if (record.claim_refs.some((id) => !claimById.has(id) || !event?.claim_refs.includes(id))) failures.push(`${record.hardware_record_id}: hardware claim_refs invalid`);
    if (record.source_refs.some((id) => !sourceIds.has(id) || !event?.source_refs.includes(id))) failures.push(`${record.hardware_record_id}: hardware source_refs invalid`);
  }

  failures.push(...duplicateIds(bundle.hardware_facts, "hardware_fact_id", "hardware_facts"));
  const hardwareFactIds = new Set(bundle.hardware_facts.map((item) => item.hardware_fact_id));
  for (const fact of bundle.hardware_facts) {
    if (!claimById.has(fact.claim_ref)) failures.push(`${fact.hardware_fact_id}: hardware fact claim_ref invalid`);
    if (!fact.source_refs.length || fact.source_refs.some((id) => !sourceIds.has(id))) failures.push(`${fact.hardware_fact_id}: hardware fact source_refs invalid`);
    if (fact.event_refs.some((id) => !eventById.has(id))) failures.push(`${fact.hardware_fact_id}: hardware fact event_refs invalid`);
    const claim = claimById.get(fact.claim_ref);
    if (claim && normalize(claim.source_quote) !== normalize(fact.source_quote)) failures.push(`${fact.hardware_fact_id}: hardware fact quote differs from Claim`);
  }

  failures.push(...duplicateIds(bundle.hardware_snapshots, "hardware_snapshot_id", "hardware_snapshots"));
  for (const snapshot of bundle.hardware_snapshots) {
    if (snapshot.fact_refs.some((id) => !hardwareFactIds.has(id))) failures.push(`${snapshot.hardware_snapshot_id}: snapshot fact_refs invalid`);
    if (snapshot.claim_refs.some((id) => !claimById.has(id))) failures.push(`${snapshot.hardware_snapshot_id}: snapshot claim_refs invalid`);
    if (snapshot.source_refs.some((id) => !sourceIds.has(id))) failures.push(`${snapshot.hardware_snapshot_id}: snapshot source_refs invalid`);
    if (snapshot.event_refs.some((id) => !eventById.has(id))) failures.push(`${snapshot.hardware_snapshot_id}: snapshot event_refs invalid`);
  }

  failures.push(...duplicateIds(bundle.monitoring_funnel, "funnel_id", "monitoring_funnel"));
  for (const funnel of bundle.monitoring_funnel) {
    if (funnel.original_sources > funnel.raw_documents) failures.push(`${funnel.funnel_id}: original_sources exceeds raw_documents`);
    for (const [name, value] of Object.entries(funnel.rates)) {
      if (!Number.isFinite(value) || value < 0 || value > 1) failures.push(`${funnel.funnel_id}: invalid ${name}`);
    }
  }

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
      facet_evidence_coverage: bundle.facet_assertions.length ? bundle.facet_assertions.filter((item) => item.evidence_ref && item.source_span).length / bundle.facet_assertions.length : 1,
      reviewed_classification_evidence_coverage: reviewedEventClassifications.length ? reviewedEventClassifications.filter((item) => item.evidence_refs?.length && item.decision_ref).length / reviewedEventClassifications.length : 1,
      fde_observation_traceability: bundle.fde_observations.length ? bundle.fde_observations.filter((item) => item.claim_refs.length && item.source_refs.length).length / bundle.fde_observations.length : 1,
      hardware_fact_traceability: bundle.hardware_facts.length ? bundle.hardware_facts.filter((item) => item.claim_ref && item.source_refs.length).length / bundle.hardware_facts.length : 1
    }
  };
}

export function evaluateBundleFiles(bundle, options = {}) {
  const workspaceRoot = path.resolve(options.workspaceRoot || root);
  const date = normalize(options.date || bundle?.manifest?.date);
  const rawRoot = path.join(workspaceRoot, "01-SiteV2/content/01-raw/originals", date);
  const sourceIndexFile = path.join(workspaceRoot, "01-SiteV2/content/01-raw/source-index.jsonl");
  const sourceIndex = fs.existsSync(sourceIndexFile)
    ? fs.readFileSync(sourceIndexFile, "utf8").split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line))
    : [];
  const indexedEvidenceRefs = new Set(sourceIndex.map((entry) => normalize(entry.evidence_ref)).filter(Boolean));
  const failures = [];
  const warnings = [];
  const sourceUrls = new Set();
  const contentHashes = new Set();
  const snapshotRefs = new Set();

  for (const artifact of bundle.source_artifacts || []) {
    const refs = Array.isArray(artifact.snapshot_refs) ? artifact.snapshot_refs.filter((value) => normalize(value)) : [];
    if (!refs.length) failures.push(`${artifact.source_artifact_id}: snapshot_refs missing`);
    for (const ref of refs) {
      if (String(ref).startsWith("evidence://")) {
        snapshotRefs.add(ref);
        if (!indexedEvidenceRefs.has(normalize(ref))) {
          failures.push(`${artifact.source_artifact_id}: private evidence locator is absent from the public index: ${ref}`);
        }
        continue;
      }
      const resolved = resolveWorkspaceRef(workspaceRoot, ref);
      if (!resolved.ok) {
        failures.push(`${artifact.source_artifact_id}: snapshot_ref ${ref} is ${resolved.reason}`);
        continue;
      }
      snapshotRefs.add(resolved.relative);
      if (!fs.existsSync(resolved.file)) failures.push(`${artifact.source_artifact_id}: snapshot_ref does not exist: ${resolved.relative}`);
    }
    for (const value of [artifact.source_url, artifact.canonical_url]) {
      const normalized = normalizeUrl(value);
      if (normalized) sourceUrls.add(normalized);
    }
    if (normalize(artifact.content_hash)) contentHashes.add(normalize(artifact.content_hash));
  }

  for (const raw of bundle.raw_documents || []) {
    for (const value of [raw.source_url, raw.canonical_url]) {
      const normalized = normalizeUrl(value);
      if (normalized) sourceUrls.add(normalized);
    }
    for (const value of [raw.content_hash, raw.evidence_hash]) {
      if (normalize(value)) contentHashes.add(normalize(value));
    }
  }

  const rawFiles = fs.existsSync(rawRoot)
    ? fs.readdirSync(rawRoot, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith(".json")).map((entry) => path.join(rawRoot, entry.name)).sort()
    : [];
  let representedRawSnapshots = 0;
  for (const file of rawFiles) {
    const relative = relativeWorkspacePath(workspaceRoot, file);
    if (snapshotRefs.has(relative)) {
      representedRawSnapshots += 1;
      continue;
    }
    let raw;
    try {
      raw = readJson(file);
    } catch (error) {
      failures.push(`${relative}: invalid Raw JSON (${error.message})`);
      continue;
    }
    const urls = [raw.original_url, raw.source_url, raw.canonical_url].map(normalizeUrl).filter(Boolean);
    const hashes = [raw.content_hash, raw.evidence_hash, raw.evidence_completeness?.evidence_hash].map(normalize).filter(Boolean);
    if (urls.some((value) => sourceUrls.has(value)) || hashes.some((value) => contentHashes.has(value))) {
      representedRawSnapshots += 1;
      continue;
    }
    failures.push(`${relative}: current Raw snapshot is not represented in the V4 bundle`);
  }

  if (!rawFiles.length) {
    for (const raw of bundle.raw_documents || []) {
      if (indexedEvidenceRefs.has(normalize(raw.body_ref))) representedRawSnapshots += 1;
      else failures.push(`${raw.raw_id}: private body_ref is absent from the public evidence index`);
    }
  }
  const effectiveRawCount = rawFiles.length || (bundle.raw_documents || []).length;
  return {
    ok: failures.length === 0,
    failures,
    warnings,
    metrics: {
      current_raw_snapshot_count: effectiveRawCount,
      represented_raw_snapshot_count: representedRawSnapshots,
      current_raw_snapshot_coverage: effectiveRawCount ? representedRawSnapshots / effectiveRawCount : 1,
      existing_snapshot_ref_count: [...snapshotRefs].filter((ref) => (
        ref.startsWith("evidence://")
          ? indexedEvidenceRefs.has(ref)
          : fs.existsSync(path.join(workspaceRoot, ref.replace(/\//gu, path.sep)))
      )).length
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
    `- reviewed_event_classifications: ${result.counts.reviewed_event_classifications || 0}`,
    `- fde_records: ${result.counts.fde_records}`,
    `- fde_observations: ${result.counts.fde_observations}`,
    `- hardware_records: ${result.counts.hardware_records}`,
    `- hardware_facts: ${result.counts.hardware_facts}`,
    `- hardware_snapshots: ${result.counts.hardware_snapshots}`,
    `- event_source_traceability: ${(result.metrics.canonical_event_source_traceability * 100).toFixed(1)}%`,
    `- event_claim_traceability: ${(result.metrics.canonical_event_claim_traceability * 100).toFixed(1)}%`,
    `- ai_industry_scope_coverage: ${(result.metrics.ai_industry_scope_coverage * 100).toFixed(1)}%`,
    `- tag_evidence_coverage: ${(result.metrics.tag_evidence_coverage * 100).toFixed(1)}%`,
    `- facet_evidence_coverage: ${(result.metrics.facet_evidence_coverage * 100).toFixed(1)}%`,
    `- reviewed_classification_evidence_coverage: ${(result.metrics.reviewed_classification_evidence_coverage * 100).toFixed(1)}%`,
    `- fde_observation_traceability: ${(result.metrics.fde_observation_traceability * 100).toFixed(1)}%`,
    `- hardware_fact_traceability: ${(result.metrics.hardware_fact_traceability * 100).toFixed(1)}%`,
    `- current_raw_snapshot_coverage: ${((result.metrics.current_raw_snapshot_coverage ?? 1) * 100).toFixed(1)}%`,
    `- current_raw_snapshots: ${result.metrics.current_raw_snapshot_count ?? "not checked"}`,
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
  const dataResult = evaluateBundle(bundle, taxonomy);
  const fileResult = evaluateBundleFiles(bundle, { date });
  const result = {
    ...dataResult,
    ok: dataResult.ok && fileResult.ok,
    failures: [...dataResult.failures, ...fileResult.failures],
    warnings: [...dataResult.warnings, ...fileResult.warnings],
    metrics: { ...dataResult.metrics, ...fileResult.metrics }
  };
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
