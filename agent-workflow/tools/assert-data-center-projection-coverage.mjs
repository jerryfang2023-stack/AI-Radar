#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyEntityReviewDecisions, publicCatalogEntityIds } from "../product/entity-history-v1.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || shanghaiDate();
const fixtureMode = args.get("fixtures") === "true";
const reportsDir = path.resolve(root, args.get("reports-dir") || path.join("agent-workflow", "reports"));

function shanghaiDate(value = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value);
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function ratio(numerator, denominator) {
  return denominator ? numerator / denominator : 1;
}

export function evaluateProjectionCoverage(bundle, frontstage, expectedDate, reviewLedger = {}) {
  const failures = [];
  const warnings = [];
  if (!bundle || !frontstage) {
    return {
      ok: false,
      failures: [!bundle ? "daily V4 bundle is missing" : "V4 frontstage projection is missing"],
      warnings,
      counts: {},
      metrics: {},
    };
  }

  const entities = Array.isArray(bundle.entities) ? bundle.entities : [];
  const mentions = Array.isArray(bundle.entity_mentions) ? bundle.entity_mentions : [];
  const events = Array.isArray(bundle.canonical_events) ? bundle.canonical_events : [];
  const fde = Array.isArray(bundle.fde_records) ? bundle.fde_records : [];
  const hardware = Array.isArray(bundle.hardware_records) ? bundle.hardware_records : [];
  const fdeObservations = Array.isArray(bundle.fde_observations) ? bundle.fde_observations : [];
  const hardwareFacts = Array.isArray(bundle.hardware_facts) ? bundle.hardware_facts : [];
  const hardwareSnapshots = Array.isArray(bundle.hardware_snapshots) ? bundle.hardware_snapshots : [];
  const monitoringFunnel = Array.isArray(bundle.monitoring_funnel) ? bundle.monitoring_funnel : [];
  const entityIds = new Set(entities.map((item) => item.entity_id).filter(Boolean));
  const mentionedEntityIds = new Set(mentions.map((item) => item.entity_id).filter(Boolean));
  const acceptedEvents = events.filter((item) => ["verified", "partial"].includes(item.publication_status));
  const reviewed = applyEntityReviewDecisions(entities, acceptedEvents.map((event) => ({
    entityIds: event.entities || [],
    claims: (event.claim_refs || []).map((id) => ({ id })),
  })), reviewLedger);
  const eventEntityIds = new Set(reviewed.events.flatMap((item) => item.entityIds || []));
  const catalogIds = publicCatalogEntityIds(reviewLedger);
  const participatingEntities = reviewed.entityRows.filter((item) => eventEntityIds.has(item.entity_id));
  const pendingCatalogEntities = participatingEntities.filter((item) => (
    ["organization_candidate", "product_candidate"].includes(item.entity_type)
    && !catalogIds.has(item.entity_id)
  ));
  const participatingVerifiedOrganizations = participatingEntities.filter((item) => (
    item.entity_type === "organization_candidate"
    && item.verification_status === "verified"
    && catalogIds.has(item.entity_id)
  ));
  const participatingVerifiedProducts = participatingEntities.filter((item) => (
    item.entity_type === "product_candidate"
    && item.verification_status === "verified"
    && catalogIds.has(item.entity_id)
  ));

  const companyIds = new Set((frontstage.companies || []).map((item) => item.id).filter(Boolean));
  const productIds = new Set((frontstage.products || []).map((item) => item.id).filter(Boolean));
  const frontstageFde = new Map((frontstage.fde || []).map((item) => [item.id, item]));
  const frontstageHardware = new Map((frontstage.hardware || []).map((item) => [item.id, item]));
  const frontstageFdeDossiers = new Map((frontstage.fdeDossiers || []).map((item) => [item.implementationKey, item]));
  const frontstageHardwareCatalog = new Map((frontstage.hardwareCatalog || []).map((item) => [item.snapshotKey, item]));
  const frontstageFunnel = new Map((frontstage.monitoringFunnel || []).map((item) => [item.lens, item]));
  const frontstageDate = frontstage.meta?.currentDate || frontstage.meta?.latestDataDate || "";

  if (frontstageDate !== expectedDate) failures.push(`frontstage projection date is ${frontstageDate || "missing"}; expected ${expectedDate}`);

  for (const mention of mentions) {
    if (!entityIds.has(mention.entity_id)) failures.push(`${mention.mention_id || "entity mention"}: entity_id does not resolve`);
  }
  for (const event of acceptedEvents) {
    if (!(event.entities || []).length) failures.push(`${event.event_id}: accepted event has no entity reference`);
    for (const entityId of event.entities || []) {
      if (!entityIds.has(entityId)) failures.push(`${event.event_id}: entity ${entityId} does not resolve`);
    }
  }

  const unmentionedEntities = entities.filter((item) => !mentionedEntityIds.has(item.entity_id));
  if (unmentionedEntities.length) failures.push(`${unmentionedEntities.length} entity record(s) have no EntityMention evidence`);

  const missingCompanies = participatingVerifiedOrganizations.filter((item) => !companyIds.has(item.entity_id));
  const missingProducts = participatingVerifiedProducts.filter((item) => !productIds.has(item.entity_id));
  const missingFde = fde.filter((item) => {
    const projected = frontstageFde.get(item.fde_id);
    return !projected || projected.dataDate !== expectedDate;
  });
  const missingHardware = hardware.filter((item) => {
    const projected = frontstageHardware.get(item.hardware_record_id);
    return !projected || projected.dataDate !== expectedDate;
  });
  const missingFdeObservations = fdeObservations.filter((item) => {
    const projected = frontstageFdeDossiers.get(item.implementation_key);
    return !projected || projected.dataDate !== expectedDate;
  });
  const missingHardwareSnapshots = hardwareSnapshots.filter((item) => {
    const projected = frontstageHardwareCatalog.get(item.snapshot_key);
    return !projected || projected.dataDate !== expectedDate;
  });
  const projectedHardwareFactCount = [...frontstageHardwareCatalog.values()]
    .reduce((total, item) => total + Number(item.factCount || 0), 0);
  const missingFunnelLenses = monitoringFunnel
    .filter((item) => item.date === expectedDate)
    .filter((item) => frontstageFunnel.get(item.lens)?.date !== expectedDate);

  if (missingCompanies.length) failures.push(`Entity Index is missing ${missingCompanies.length} verified organization(s): ${missingCompanies.slice(0, 8).map((item) => item.canonical_name).join(", ")}`);
  if (missingProducts.length) failures.push(`Entity Index is missing ${missingProducts.length} verified product(s): ${missingProducts.slice(0, 8).map((item) => item.canonical_name).join(", ")}`);
  if (missingFde.length) failures.push(`frontstage FDE projection is missing ${missingFde.length} current-batch record(s)`);
  if (missingHardware.length) failures.push(`frontstage hardware projection is missing ${missingHardware.length} current-batch record(s)`);
  if (missingFdeObservations.length) failures.push(`frontstage FDE dossier projection is missing ${missingFdeObservations.length} current-batch observation(s)`);
  if (missingHardwareSnapshots.length) failures.push(`frontstage hardware catalog is missing ${missingHardwareSnapshots.length} current-batch snapshot(s)`);
  if (projectedHardwareFactCount < hardwareFacts.length) failures.push(`frontstage hardware catalog represents ${projectedHardwareFactCount}/${hardwareFacts.length} current-batch fact(s)`);
  if (missingFunnelLenses.length) failures.push(`frontstage monitoring funnel is missing lens(es): ${missingFunnelLenses.map((item) => item.lens).join(", ")}`);
  if (pendingCatalogEntities.length) warnings.push(`${pendingCatalogEntities.length} participating entity/entities await public catalog review: ${pendingCatalogEntities.map((item) => item.canonical_name).join(", ")}`);
  if (!fde.length) warnings.push("No source-bounded FDE record was produced for the daily batch.");
  if (!hardware.length) warnings.push("No source-bounded hardware record was produced for the daily batch.");
  if (!fdeObservations.length) warnings.push("No Claim-native FDE observation was produced for the daily batch.");
  if (!hardwareFacts.length) warnings.push("No Claim-native hardware fact was produced for the daily batch.");

  const mentionedEntities = entities.filter((item) => mentionedEntityIds.has(item.entity_id)).length;
  const acceptedEventsWithEntities = acceptedEvents.filter((item) => (item.entities || []).length > 0).length;
  const projectedCompanies = participatingVerifiedOrganizations.length - missingCompanies.length;
  const projectedProducts = participatingVerifiedProducts.length - missingProducts.length;
  const projectedFde = fde.length - missingFde.length;
  const projectedHardware = hardware.length - missingHardware.length;
  const projectedFdeObservations = fdeObservations.length - missingFdeObservations.length;
  const projectedHardwareSnapshots = hardwareSnapshots.length - missingHardwareSnapshots.length;
  const projectedFunnelLenses = monitoringFunnel.filter((item) => item.date === expectedDate).length - missingFunnelLenses.length;
  const currentFunnelLenses = monitoringFunnel.filter((item) => item.date === expectedDate).length;

  return {
    ok: failures.length === 0,
    failures,
    warnings,
    counts: {
      entities: entities.length,
      entity_mentions: mentions.length,
      accepted_events: acceptedEvents.length,
      verified_event_organizations: participatingVerifiedOrganizations.length,
      verified_event_products: participatingVerifiedProducts.length,
      pending_catalog_entities: pendingCatalogEntities.length,
      fde_records: fde.length,
      hardware_records: hardware.length,
      fde_observations: fdeObservations.length,
      hardware_facts: hardwareFacts.length,
      hardware_snapshots: hardwareSnapshots.length,
      monitoring_funnel_lenses: currentFunnelLenses,
    },
    metrics: {
      entity_mention_coverage: ratio(mentionedEntities, entities.length),
      accepted_event_entity_coverage: ratio(acceptedEventsWithEntities, acceptedEvents.length),
      entity_index_organization_coverage: ratio(projectedCompanies, participatingVerifiedOrganizations.length),
      entity_index_product_coverage: ratio(projectedProducts, participatingVerifiedProducts.length),
      fde_frontstage_coverage: ratio(projectedFde, fde.length),
      hardware_frontstage_coverage: ratio(projectedHardware, hardware.length),
      fde_observation_frontstage_coverage: ratio(projectedFdeObservations, fdeObservations.length),
      hardware_fact_frontstage_coverage: ratio(Math.min(projectedHardwareFactCount, hardwareFacts.length), hardwareFacts.length),
      hardware_snapshot_frontstage_coverage: ratio(projectedHardwareSnapshots, hardwareSnapshots.length),
      monitoring_funnel_frontstage_coverage: ratio(projectedFunnelLenses, currentFunnelLenses),
    },
  };
}

function loadBundle() {
  const dir = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", date);
  const names = [
    "manifest",
    "entities",
    "entity-mentions",
    "canonical-events",
    "fde-records",
    "hardware-records",
    "fde-observations",
    "hardware-facts",
    "hardware-snapshots",
    "monitoring-funnel",
  ];
  const loaded = Object.fromEntries(names.map((name) => [name.replace(/-/gu, "_"), readJson(path.join(dir, `${name}.json`), null)]));
  if (names.some((name) => loaded[name.replace(/-/gu, "_")] === null)) return null;
  return loaded;
}

function writeReport(result) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-data-center-projection-coverage.json`);
  const mdPath = path.join(reportsDir, `${date}-data-center-projection-coverage.md`);
  const payload = { ...result, date, generated_at: new Date().toISOString() };
  const metricLines = Object.entries(result.metrics || {}).map(([key, value]) => `- ${key}: ${(value * 100).toFixed(1)}%`);
  const md = [
    `# Data Center Projection Coverage - ${date}`,
    "",
    `- status: ${result.ok ? "passed" : "failed"}`,
    "",
    "## Counts",
    "",
    ...Object.entries(result.counts || {}).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Coverage",
    "",
    ...(metricLines.length ? metricLines : ["- none"]),
    "",
    "## Failures",
    "",
    ...(result.failures.length ? result.failures.map((item) => `- ${item}`) : ["- none"]),
    "",
    "## Warnings",
    "",
    ...(result.warnings.length ? result.warnings.map((item) => `- ${item}`) : ["- none"]),
    "",
  ].join("\n");
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function runFixtures() {
  const entity = { entity_id: "EN-1", canonical_name: "Example", entity_type: "organization_candidate", verification_status: "verified" };
  const bundle = {
    entities: [entity],
    entity_mentions: [{ mention_id: "EM-1", entity_id: "EN-1" }],
    canonical_events: [{ event_id: "EV-1", entities: ["EN-1"], publication_status: "verified" }],
    fde_records: [{ fde_id: "FDE-1" }],
    hardware_records: [{ hardware_record_id: "HW-1" }],
    fde_observations: [{ observation_id: "FDEO-1", implementation_key: "implementation-1" }],
    hardware_facts: [{ hardware_fact_id: "HWF-1" }],
    hardware_snapshots: [{ hardware_snapshot_id: "HWS-1", snapshot_key: "snapshot-1" }],
    monitoring_funnel: [{ funnel_id: "LF-1", lens: "fde", date: "2026-07-17" }],
  };
  const frontstage = {
    meta: { currentDate: "2026-07-17" },
    companies: [{ id: "EN-1" }], products: [],
    fde: [{ id: "FDE-1", dataDate: "2026-07-17" }],
    hardware: [{ id: "HW-1", dataDate: "2026-07-17" }],
    fdeDossiers: [{ id: "FDED-1", implementationKey: "implementation-1", dataDate: "2026-07-17" }],
    hardwareCatalog: [{ id: "HWC-1", snapshotKey: "snapshot-1", dataDate: "2026-07-17", factCount: 1 }],
    monitoringFunnel: [{ funnel_id: "LF-1", lens: "fde", date: "2026-07-17" }],
  };
  const review = { decisions: [{ entity_id: "EN-1", review_status: "accepted", reviewer: "fixture", action: "confirm", canonical: { catalog_type: "company" } }] };
  const passed = evaluateProjectionCoverage(bundle, frontstage, "2026-07-17", review);
  const failed = evaluateProjectionCoverage(bundle, { ...frontstage, companies: [] }, "2026-07-17", review);
  const quarantined = evaluateProjectionCoverage({
    ...bundle,
    entities: [{ ...entity, entity_type: "product_candidate" }],
  }, { ...frontstage, companies: [], products: [] }, "2026-07-17", {
    decisions: [{ entity_id: "EN-1", review_status: "accepted", reviewer: "fixture", action: "quarantine", canonical: { catalog_type: "other" } }],
  });
  if (!passed.ok || failed.ok || !quarantined.ok) throw new Error("projection coverage fixtures failed");
  console.log(JSON.stringify({ ok: true, fixture: "data-center-projection-coverage" }, null, 2));
}

function main() {
  if (fixtureMode) return runFixtures();
  const bundle = loadBundle();
  const frontstage = readJson(path.join(root, "01-SiteV2", "site", "data", "data-center-v4-frontstage.json"), null);
  const reviewLedger = readJson(path.join(root, "01-SiteV2", "content", "11-databases", "entity-history-v1", "entity-catalog-review-decisions.json"), {});
  const result = evaluateProjectionCoverage(bundle, frontstage, date, reviewLedger);
  const report = writeReport(result);
  console.log(JSON.stringify({
    ok: result.ok,
    date,
    report: path.relative(root, report.jsonPath).replace(/\\/gu, "/"),
    markdown: path.relative(root, report.mdPath).replace(/\\/gu, "/"),
    failures: result.failures.length,
    warnings: result.warnings.length,
    metrics: result.metrics,
  }, null, 2));
  if (!result.ok) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
