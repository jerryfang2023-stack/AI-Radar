#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || shanghaiDate();
const fixtureMode = args.get("fixtures") === "true";

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

function normalizeName(value = "") {
  return String(value).normalize("NFKC").toLocaleLowerCase().replace(/\s+/gu, " ").trim();
}

export function evaluateProjectionCoverage(bundle, frontstage, expectedDate) {
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
  const entityIds = new Set(entities.map((item) => item.entity_id).filter(Boolean));
  const mentionedEntityIds = new Set(mentions.map((item) => item.entity_id).filter(Boolean));
  const acceptedEvents = events.filter((item) => ["verified", "partial"].includes(item.publication_status));
  const eventEntityIds = new Set(acceptedEvents.flatMap((item) => item.entities || []).filter(Boolean));
  const participatingVerifiedOrganizations = entities.filter((item) => (
    item.entity_type === "organization_candidate"
    && item.verification_status === "verified"
    && eventEntityIds.has(item.entity_id)
  ));
  const participatingVerifiedProducts = entities.filter((item) => (
    item.entity_type === "product_candidate"
    && item.verification_status === "verified"
    && eventEntityIds.has(item.entity_id)
  ));

  const companyIds = new Set((frontstage.companies || []).map((item) => item.id).filter(Boolean));
  const productNames = new Set((frontstage.products || []).map((item) => normalizeName(item.name)).filter(Boolean));
  const frontstageFde = new Map((frontstage.fde || []).map((item) => [item.id, item]));
  const frontstageHardware = new Map((frontstage.hardware || []).map((item) => [item.id, item]));
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
  const missingProducts = participatingVerifiedProducts.filter((item) => !productNames.has(normalizeName(item.canonical_name)));
  const missingFde = fde.filter((item) => {
    const projected = frontstageFde.get(item.fde_id);
    return !projected || projected.dataDate !== expectedDate;
  });
  const missingHardware = hardware.filter((item) => {
    const projected = frontstageHardware.get(item.hardware_record_id);
    return !projected || projected.dataDate !== expectedDate;
  });

  if (missingCompanies.length) failures.push(`Entity Index is missing ${missingCompanies.length} verified organization(s): ${missingCompanies.slice(0, 8).map((item) => item.canonical_name).join(", ")}`);
  if (missingProducts.length) failures.push(`Entity Index is missing ${missingProducts.length} verified product(s): ${missingProducts.slice(0, 8).map((item) => item.canonical_name).join(", ")}`);
  if (missingFde.length) failures.push(`frontstage FDE projection is missing ${missingFde.length} current-batch record(s)`);
  if (missingHardware.length) failures.push(`frontstage hardware projection is missing ${missingHardware.length} current-batch record(s)`);
  if (!fde.length) warnings.push("No source-bounded FDE record was produced for the daily batch.");
  if (!hardware.length) warnings.push("No source-bounded hardware record was produced for the daily batch.");

  const mentionedEntities = entities.filter((item) => mentionedEntityIds.has(item.entity_id)).length;
  const acceptedEventsWithEntities = acceptedEvents.filter((item) => (item.entities || []).length > 0).length;
  const projectedCompanies = participatingVerifiedOrganizations.length - missingCompanies.length;
  const projectedProducts = participatingVerifiedProducts.length - missingProducts.length;
  const projectedFde = fde.length - missingFde.length;
  const projectedHardware = hardware.length - missingHardware.length;

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
      fde_records: fde.length,
      hardware_records: hardware.length,
    },
    metrics: {
      entity_mention_coverage: ratio(mentionedEntities, entities.length),
      accepted_event_entity_coverage: ratio(acceptedEventsWithEntities, acceptedEvents.length),
      entity_index_organization_coverage: ratio(projectedCompanies, participatingVerifiedOrganizations.length),
      entity_index_product_coverage: ratio(projectedProducts, participatingVerifiedProducts.length),
      fde_frontstage_coverage: ratio(projectedFde, fde.length),
      hardware_frontstage_coverage: ratio(projectedHardware, hardware.length),
    },
  };
}

function loadBundle() {
  const dir = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", date);
  const names = ["manifest", "entities", "entity-mentions", "canonical-events", "fde-records", "hardware-records"];
  const loaded = Object.fromEntries(names.map((name) => [name.replace(/-/gu, "_"), readJson(path.join(dir, `${name}.json`), null)]));
  if (names.some((name) => loaded[name.replace(/-/gu, "_")] === null)) return null;
  return loaded;
}

function writeReport(result) {
  const reports = path.join(root, "agent-workflow", "reports");
  fs.mkdirSync(reports, { recursive: true });
  const jsonPath = path.join(reports, `${date}-data-center-projection-coverage.json`);
  const mdPath = path.join(reports, `${date}-data-center-projection-coverage.md`);
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
  };
  const frontstage = {
    meta: { currentDate: "2026-07-17" },
    companies: [{ id: "EN-1" }], products: [],
    fde: [{ id: "FDE-1", dataDate: "2026-07-17" }],
    hardware: [{ id: "HW-1", dataDate: "2026-07-17" }],
  };
  const passed = evaluateProjectionCoverage(bundle, frontstage, "2026-07-17");
  const failed = evaluateProjectionCoverage(bundle, { ...frontstage, companies: [] }, "2026-07-17");
  if (!passed.ok || failed.ok) throw new Error("projection coverage fixtures failed");
  console.log(JSON.stringify({ ok: true, fixture: "data-center-projection-coverage" }, null, 2));
}

function main() {
  if (fixtureMode) return runFixtures();
  const bundle = loadBundle();
  const frontstage = readJson(path.join(root, "01-SiteV2", "site", "data", "data-center-v4-frontstage.json"), null);
  const result = evaluateProjectionCoverage(bundle, frontstage, date);
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

main();
