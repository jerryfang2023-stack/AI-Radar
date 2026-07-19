import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const file = path.join(root, "01-SiteV2/site/data/trend-radar-v1.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const errors = [];
const forbidden = new Set(["importance", "value", "opportunity", "score", "recommendation", "advice", "why_watch", "business_meaning", "trend_maturity", "maturity", "heat", "judgment"]);

const fail = (message) => errors.push(message);
const idsResolve = (ids = []) => ids.every((id) => Boolean(data.events[id]));
const allEvents = Object.values(data.events || {});
const trackedEvents = allEvents.filter((event) => event.category !== "other");
const setEquals = (left, right) => left.length === right.length && [...left].sort().every((value, index) => value === [...right].sort()[index]);
const categoryCounts = (events) => Object.fromEntries((data.meta.categoryOrder || []).map((category) => [category, events.filter((event) => event.category === category).length]));

if (data.meta?.schemaVersion !== "TRADAR-DATA-V1") fail("schemaVersion must be TRADAR-DATA-V1");
if (data.meta?.columnVersion !== "TRADAR-V1.0.0-factual-change-explorer") fail("columnVersion mismatch");
if (data.meta?.siteVersion !== "SITE-V4.2.0-entity-history") fail("siteVersion mismatch");
if (data.meta?.dateBasis !== "dataDate") fail("date basis must be dataDate");
if (data.periods?.day?.defaultKey !== data.meta?.latestDataDate) fail("default day must match latestDataDate");

for (const event of Object.values(data.events || {})) {
  if (!event.id || !event.dataDate || !event.title) fail(`event missing identity fields: ${event.id || "unknown"}`);
  if (!data.meta.acceptedPublicationStates.includes(event.publicationStatus)) fail(`event has rejected publication state: ${event.id}`);
  if (!event.claimIds?.length || !event.sourceIds?.length || !event.sourceUrl) fail(`event missing evidence lineage: ${event.id}`);
  if (!/^https?:\/\//u.test(event.sourceUrl)) fail(`event source URL is not HTTP(S): ${event.id}`);
  if (!data.meta.acceptedPublicationStates?.length) fail("accepted publication states missing");
}

for (const [key, record] of Object.entries(data.periods?.day?.records || {})) {
  if (!idsResolve(record.eventIds)) fail(`day ${key} has unresolved events`);
  const expected = Object.values(data.events).filter((event) => event.dataDate === key && event.category !== "other");
  if (expected.length !== record.eventIds.length) fail(`day ${key} tracked count mismatch`);
  for (const category of data.meta.categoryOrder || []) {
    if (record.counts[category] !== expected.filter((event) => event.category === category).length) fail(`day ${key} ${category} count mismatch`);
  }
}

for (const [key, record] of Object.entries(data.periods?.week?.records || {})) {
  const periodEvents = trackedEvents.filter((event) => event.dataDate >= record.start && event.dataDate <= record.end);
  const expectedCounts = categoryCounts(periodEvents);
  for (const category of data.meta.categoryOrder || []) if (record.counts[category] !== expectedCounts[category]) fail(`week ${key} ${category} count mismatch`);
  if (!idsResolve(record.deploymentEventIds)) fail(`week ${key} deployment references unresolved`);
  const expectedDeployments = periodEvents.filter((event) => event.category === "deployment" || event.eventType === "hardware_deployment").map((event) => event.id);
  if (!setEquals(record.deploymentEventIds, expectedDeployments)) fail(`week ${key} deployment index mismatch`);
  for (const item of record.activeEntities || []) {
    const evidence = item.eventIds.map((id) => data.events[id]).filter(Boolean);
    const categories = new Set(evidence.map((event) => event.category));
    if (!data.entities[item.entityId] || data.entities[item.entityId].entityType !== "organization" || evidence.some((event) => event.dataDate < record.start || event.dataDate > record.end) || evidence.length < 2 || categories.size < 2 || item.categoryCount !== categories.size) fail(`week ${key} invalid active entity`);
  }
  for (const item of record.productsEnteringUse || []) if (data.entities[item.entityId]?.entityType !== "product" || !data.entities[item.customerEntityId] || !data.events[item.eventId] || !item.claimIds?.length || !item.sourceIds?.length || item.dataDate < record.start || item.dataDate > record.end) fail(`week ${key} invalid product-use relation`);
  for (const item of record.newClassifications || []) if (!data.entities[item.entityId] || !data.events[item.eventId]) fail(`week ${key} invalid classification evidence`);
}

for (const [key, record] of Object.entries(data.periods?.month?.records || {})) {
  const periodEvents = trackedEvents.filter((event) => event.dataDate.startsWith(`${key}-`));
  const expectedCounts = categoryCounts(periodEvents);
  for (const category of data.meta.categoryOrder || []) if (record.counts[category] !== expectedCounts[category]) fail(`month ${key} ${category} count mismatch`);
  if (!idsResolve(record.financing?.eventIds) || !idsResolve(record.deploymentEventIds)) fail(`month ${key} unresolved event index`);
  const expectedFinancing = periodEvents.filter((event) => event.category === "financing").map((event) => event.id);
  const expectedDeployments = periodEvents.filter((event) => event.category === "deployment" || event.eventType === "hardware_deployment").map((event) => event.id);
  if (!setEquals(record.financing.eventIds, expectedFinancing)) fail(`month ${key} financing index mismatch`);
  if (!setEquals(record.deploymentEventIds, expectedDeployments)) fail(`month ${key} deployment index mismatch`);
  for (const item of [...record.newCompanies, ...record.newProducts]) {
    if (!data.entities[item.entityId] || !item.eventIds?.length || !idsResolve(item.eventIds)) fail(`month ${key} new entity lacks evidence`);
    const firstDate = trackedEvents.filter((event) => event.entityIds.includes(item.entityId)).map((event) => event.dataDate).sort()[0];
    if (!firstDate?.startsWith(`${key}-`) || item.eventIds.some((id) => data.events[id].dataDate !== firstDate)) fail(`month ${key} new entity is not first-observed`);
  }
  for (const list of Object.values(record.distributions || {})) for (const item of list) {
    if (!item.eventIds?.length || !idsResolve(item.eventIds) || item.count !== new Set(item.eventIds).size) fail(`month ${key} invalid distribution evidence`);
  }
  if (!record.comparisonAvailable && Object.values(record.deltas).some((value) => value !== null)) fail(`month ${key} fabricates comparison without baseline`);
  if (record.comparisonAvailable) {
    const endDay = record.comparisonWindow?.currentEndDay;
    const priorEvents = trackedEvents.filter((event) => event.dataDate.startsWith(`${record.previousMonth}-`) && Number(event.dataDate.slice(8, 10)) <= endDay);
    const priorCounts = categoryCounts(priorEvents);
    for (const category of data.meta.categoryOrder || []) {
      if (record.previousCounts[category] !== priorCounts[category] || record.deltas[category] !== record.counts[category] - priorCounts[category]) fail(`month ${key} incomparable or incorrect ${category} delta`);
    }
  }
}

function walk(value, trail = []) {
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (forbidden.has(key.toLowerCase())) fail(`forbidden judgment field: ${[...trail, key].join(".")}`);
    if (["community", "viewpoints", "cards", "trendCandidates", "opportunitySignals"].includes(key)) fail(`forbidden input/output field: ${[...trail, key].join(".")}`);
    walk(child, [...trail, key]);
  }
}
walk(data);

if (errors.length) {
  console.error(`Trend Radar gate failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Trend Radar gate passed: ${Object.keys(data.events).length} evidence-backed events, ${data.periods.day.options.length} days, ${data.periods.week.options.length} weeks, ${data.periods.month.options.length} months.`);
