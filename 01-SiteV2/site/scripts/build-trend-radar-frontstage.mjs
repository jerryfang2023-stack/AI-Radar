import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const COLUMN_VERSION = "TRADAR-V1.0.0-factual-change-explorer";
const ACCEPTED = new Set(["verified", "partial"]);
const CATEGORY_ORDER = ["financing", "deployment", "partnership", "product", "hardware"];
const CATEGORY_LABELS = {
  financing: "融资与并购",
  deployment: "部署与案例",
  partnership: "商业合作",
  product: "产品与服务",
  hardware: "AI 硬件",
};
const CATEGORY_TYPES = {
  financing: new Set(["funding", "acquisition", "ipo_listing", "capital_investment"]),
  deployment: new Set(["deployment"]),
  partnership: new Set(["partnership", "procurement_contract"]),
  product: new Set(["model_release", "product_release", "service_change", "pricing_change"]),
  hardware: new Set(["hardware_product", "hardware_capacity", "hardware_supply", "hardware_deployment"]),
};

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(here, "../../..");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function categoryFor(eventType) {
  return CATEGORY_ORDER.find((key) => CATEGORY_TYPES[key].has(eventType)) || "other";
}

function entityKind(entityType) {
  if (entityType === "organization_candidate") return "organization";
  if (entityType === "product_candidate") return "product";
  if (entityType === "person_candidate") return "person";
  return entityType;
}

function mondayKey(dateText) {
  const date = new Date(`${dateText}T00:00:00Z`);
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() - day + 1);
  return date.toISOString().slice(0, 10);
}

function plusDays(dateText, days) {
  const date = new Date(`${dateText}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function monthKey(dateText) {
  return dateText.slice(0, 7);
}

function previousMonth(key) {
  const date = new Date(`${key}-01T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() - 1);
  return date.toISOString().slice(0, 7);
}

function emptyCounts() {
  return Object.fromEntries(CATEGORY_ORDER.map((key) => [key, 0]));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function groupBy(values, keyFn) {
  const result = new Map();
  for (const value of values) {
    const key = keyFn(value);
    if (!result.has(key)) result.set(key, []);
    result.get(key).push(value);
  }
  return result;
}

function countCategories(events) {
  const counts = emptyCounts();
  for (const event of events) if (event.category !== "other") counts[event.category] += 1;
  return counts;
}

function classificationDistribution(events, dimensionId) {
  const index = new Map();
  for (const event of events) {
    for (const item of event.classifications.filter((value) => value.dimensionId === dimensionId)) {
      const key = `${item.dimensionId}:${item.id}`;
      if (!index.has(key)) index.set(key, { id: item.id, name: item.name, eventIds: [] });
      index.get(key).eventIds.push(event.id);
    }
  }
  return [...index.values()]
    .map((item) => ({ ...item, eventIds: unique(item.eventIds), count: unique(item.eventIds).length }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
}

export function buildTrendRadarData(root = defaultRoot) {
  const input = readJson(path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json"));
  const verifiedEntities = new Map(
    (input.entityProfiles || [])
      .filter((entity) => entity.verificationStatus === "verified")
      .map((entity) => [entity.id, entity]),
  );
  const accepted = (input.events || []).filter((event) => ACCEPTED.has(event.publicationStatus));
  const events = {};

  for (const event of accepted) {
    events[event.id] = {
      id: event.id,
      dataDate: event.dataDate,
      occurrenceDate: event.date || "",
      eventType: event.eventType,
      eventTypeLabel: event.eventTypeLabel,
      publicationStatus: event.publicationStatus,
      category: categoryFor(event.eventType),
      title: event.title,
      entityIds: (event.entityIds || []).filter((id) => verifiedEntities.has(id)),
      entityNames: event.entityNames || [],
      productNames: event.products || [],
      classifications: event.classifications || [],
      claimIds: (event.claims || []).map((claim) => claim.id),
      sourceIds: (event.sources || []).map((source) => source.id),
      sourceUrl: event.sourceUrl,
      publisher: event.publisher || "",
      metricDisclosed: (event.metrics || []).length > 0,
      detailUrl: `data-center.html?view=events&detail=event&id=${encodeURIComponent(event.id)}`,
    };
  }

  const eventList = Object.values(events).sort((a, b) => b.dataDate.localeCompare(a.dataDate) || a.id.localeCompare(b.id));
  const entities = Object.fromEntries([...verifiedEntities.values()].map((entity) => [entity.id, {
    id: entity.id,
    name: entity.name,
    entityType: entityKind(entity.entityType),
    sourceEntityType: entity.entityType,
    typeLabel: entity.typeLabel,
    detailUrl: `data-center.html?view=index&detail=entity&id=${encodeURIComponent(entity.id)}`,
  }]));
  const acceptedEventIds = new Set(eventList.map((event) => event.id));
  const verifiedRelationships = (input.entityRelationships || [])
    .filter((rel) => rel.status === "verified" && acceptedEventIds.has(rel.event_id));

  const dayRecords = {};
  for (const [key, periodEvents] of groupBy(eventList, (event) => event.dataDate)) {
    const tracked = periodEvents.filter((event) => event.category !== "other");
    dayRecords[key] = {
      key,
      counts: countCategories(tracked),
      eventIds: tracked.map((event) => event.id),
      otherCount: periodEvents.length - tracked.length,
      totalAccepted: periodEvents.length,
      coverage: `数据中心于 ${key} 接受的事件；事件发生日期可能不同。`,
    };
  }

  const firstUseByProduct = new Map();
  const firstClassificationSeen = new Map();
  for (const event of [...eventList].filter((item) => item.category !== "other").sort((a, b) => a.dataDate.localeCompare(b.dataDate) || a.id.localeCompare(b.id))) {
    for (const classification of event.classifications) {
      for (const entityId of event.entityIds) {
        const pairKey = `${entityId}|${classification.dimensionId}|${classification.id}`;
        if (!firstClassificationSeen.has(pairKey)) {
          firstClassificationSeen.set(pairKey, { entityId, classification, dataDate: event.dataDate, eventId: event.id });
        }
      }
    }
  }
  for (const relation of [...verifiedRelationships].filter((item) => item.predicate === "serves").sort((a, b) => a.data_date.localeCompare(b.data_date) || a.relationship_id.localeCompare(b.relationship_id))) {
    if (entities[relation.subject_ref]?.entityType !== "product" || !entities[relation.object_ref]) continue;
    if (!firstUseByProduct.has(relation.subject_ref)) firstUseByProduct.set(relation.subject_ref, {
      entityId: relation.subject_ref,
      customerEntityId: relation.object_ref,
      relationshipId: relation.relationship_id,
      dataDate: relation.data_date,
      eventId: relation.event_id,
      claimIds: relation.claim_refs || [],
      sourceIds: relation.source_refs || [],
    });
  }

  const weekRecords = {};
  const weekGroups = groupBy(eventList, (event) => mondayKey(event.dataDate));
  for (const [key, periodEvents] of weekGroups) {
    const tracked = periodEvents.filter((event) => event.category !== "other");
    const entityActivity = new Map();
    for (const event of tracked) for (const entityId of event.entityIds) {
      const entity = entities[entityId];
      if (!entity || !["organization", "company"].includes(entity.entityType)) continue;
      if (!entityActivity.has(entityId)) entityActivity.set(entityId, { entityId, eventIds: [], categories: new Set() });
      const record = entityActivity.get(entityId);
      record.eventIds.push(event.id);
      record.categories.add(event.category);
    }
    const activeEntities = [...entityActivity.values()]
      .filter((item) => unique(item.eventIds).length >= 2 && item.categories.size >= 2)
      .map((item) => ({ entityId: item.entityId, eventIds: unique(item.eventIds), categoryCount: item.categories.size }))
      .sort((a, b) => b.eventIds.length - a.eventIds.length);
    const end = plusDays(key, 6);
    weekRecords[key] = {
      key,
      start: key,
      end,
      observedDataDays: unique(periodEvents.map((event) => event.dataDate)).sort(),
      counts: countCategories(tracked),
      totalAccepted: periodEvents.length,
      trackedCount: tracked.length,
      otherCount: periodEvents.length - tracked.length,
      activeEntities,
      deploymentEventIds: tracked.filter((event) => event.category === "deployment" || event.eventType === "hardware_deployment").map((event) => event.id),
      productsEnteringUse: [...firstUseByProduct.values()].filter((item) => item.dataDate >= key && item.dataDate <= end),
      newClassifications: [...firstClassificationSeen.values()].filter((item) => item.dataDate >= key && item.dataDate <= end),
      coverage: "按数据中心接受日期汇总；仅观测到的批次日期计入覆盖天数。",
    };
  }

  const monthRecords = {};
  const monthGroups = groupBy(eventList, (event) => monthKey(event.dataDate));
  const firstEntitySeen = new Map();
  for (const event of [...eventList].filter((item) => item.category !== "other").sort((a, b) => a.dataDate.localeCompare(b.dataDate))) {
    for (const entityId of event.entityIds) {
      if (!firstEntitySeen.has(entityId)) firstEntitySeen.set(entityId, { dataDate: event.dataDate, eventIds: [event.id] });
      else if (firstEntitySeen.get(entityId).dataDate === event.dataDate) firstEntitySeen.get(entityId).eventIds.push(event.id);
    }
  }
  for (const [key, periodEvents] of monthGroups) {
    const tracked = periodEvents.filter((event) => event.category !== "other");
    const counts = countCategories(tracked);
    const currentObservedDays = unique(periodEvents.map((event) => event.dataDate)).sort();
    const currentEndDay = Number(currentObservedDays.at(-1)?.slice(8, 10) || 0);
    const priorKey = previousMonth(key);
    const priorWindowEvents = (monthGroups.get(priorKey) || []).filter((event) => Number(event.dataDate.slice(8, 10)) <= currentEndDay);
    const priorObservedDays = unique(priorWindowEvents.map((event) => event.dataDate)).sort();
    const expectedPriorDays = Array.from({ length: currentEndDay }, (_, index) => `${priorKey}-${String(index + 1).padStart(2, "0")}`);
    const comparisonAvailable = currentEndDay > 0 && expectedPriorDays.every((date) => priorObservedDays.includes(date));
    const priorEvents = priorWindowEvents.filter((event) => event.category !== "other");
    const priorCounts = countCategories(priorEvents);
    const financingEvents = tracked.filter((event) => event.category === "financing");
    const newEntityItems = [...firstEntitySeen.entries()]
      .filter(([, first]) => monthKey(first.dataDate) === key)
      .map(([entityId, first]) => ({ entityId, eventIds: unique(first.eventIds) }));
    monthRecords[key] = {
      key,
      start: `${key}-01`,
      end: [...periodEvents.map((event) => event.dataDate)].sort().at(-1),
      observedDataDays: currentObservedDays,
      counts,
      previousMonth: previousMonth(key),
      comparisonAvailable,
      comparisonWindow: comparisonAvailable ? { currentEndDay, previousObservedDataDays: priorObservedDays } : null,
      previousCounts: priorCounts,
      deltas: Object.fromEntries(CATEGORY_ORDER.map((category) => [category, comparisonAvailable ? counts[category] - priorCounts[category] : null])),
      totalAccepted: periodEvents.length,
      trackedCount: tracked.length,
      otherCount: periodEvents.length - tracked.length,
      newCompanies: newEntityItems.filter((item) => ["organization", "company"].includes(entities[item.entityId]?.entityType)),
      newProducts: newEntityItems.filter((item) => entities[item.entityId]?.entityType === "product"),
      financing: {
        eventIds: financingEvents.map((event) => event.id),
        disclosedMetricCount: financingEvents.filter((event) => event.metricDisclosed).length,
      },
      distributions: {
        technology: classificationDistribution(tracked, "technology"),
        useCase: classificationDistribution(tracked, "use_case"),
        industry: classificationDistribution(tracked, "industry"),
      },
      deploymentEventIds: tracked.filter((event) => event.category === "deployment" || event.eventType === "hardware_deployment").map((event) => event.id),
      coverage: "按数据中心接受日期汇总；分类分布按唯一事件计数，未观测日期不得解释为零活动。",
    };
  }

  const dayOptions = Object.keys(dayRecords).sort().reverse();
  const weekOptions = Object.keys(weekRecords).sort().reverse();
  const monthOptions = Object.keys(monthRecords).sort().reverse();

  return {
    meta: {
      schemaVersion: "TRADAR-DATA-V1",
      columnVersion: COLUMN_VERSION,
      siteVersion: input.meta.productVersion,
      eventVersion: "EVENT-V1.1",
      entityVersion: input.meta.entityVersion,
      relationshipVersion: input.meta.relationshipVersion,
      generatedAt: new Date().toISOString(),
      latestDataDate: input.meta.latestDataDate,
      timezone: "Asia/Shanghai",
      dateBasis: "dataDate",
      boundary: "accepted-canonical-events-only; no viewpoints, community, scores or recommendations",
      acceptedPublicationStates: [...ACCEPTED],
      categoryOrder: CATEGORY_ORDER,
      categoryLabels: CATEGORY_LABELS,
      sourceCounts: { events: eventList.length, entities: Object.keys(entities).length, relationships: verifiedRelationships.length },
    },
    events,
    entities,
    periods: {
      day: { defaultKey: dayOptions[0] || "", options: dayOptions, records: dayRecords },
      week: { defaultKey: weekOptions[0] || "", options: weekOptions, records: weekRecords },
      month: { defaultKey: monthOptions[0] || "", options: monthOptions, records: monthRecords },
    },
  };
}

export function writeTrendRadarData(root = defaultRoot) {
  const output = buildTrendRadarData(root);
  const target = path.join(root, "01-SiteV2/site/data/trend-radar-v1.json");
  fs.writeFileSync(target, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  return { target, output };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { target, output } = writeTrendRadarData();
  console.log(`Trend Radar built: ${path.relative(defaultRoot, target)} (${output.meta.sourceCounts.events} accepted events)`);
}
