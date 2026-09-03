#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildEntityHistoryService,
  mergeEntityReviewDecisionSets
} from "../../../agent-workflow/product/entity-history-v1.mjs";
import { productEntityDisplayType } from "../../../agent-workflow/product/product-entity-normalizer.mjs";
import { classificationEntityIds } from "../../../agent-workflow/product/classification-entity-scope.mjs";
import { investmentInstitutionIndexItem } from "../../../agent-workflow/product/investment-institution-v1.mjs";
import { isCompletePublicEventTitle as isCompleteDataTitle } from "../../../agent-workflow/tools/event-public-title.mjs";
import {
  applyPublicZhTranslations,
  readPublicTranslationRegistry,
} from "../../../agent-workflow/tools/public-zh-translation-v1.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const defaultRoot = path.resolve(__dirname, "../../..");

const eventTypeLabels = {
  model_release: { exact: "模型发布", group: "模型、产品与服务" },
  product_release: { exact: "产品发布", group: "模型、产品与服务" },
  service_change: { exact: "服务变更", group: "模型、产品与服务" },
  pricing_change: { exact: "定价变更", group: "模型、产品与服务" },
  funding: { exact: "融资", group: "融资与并购" },
  acquisition: { exact: "并购", group: "融资与并购" },
  ipo_listing: { exact: "IPO 与上市", group: "融资与并购" },
  capital_investment: { exact: "资本性投资", group: "融资与并购" },
  financial_performance: { exact: "财务表现", group: "融资与并购" },
  partnership: { exact: "合作", group: "商业合作" },
  procurement_contract: { exact: "采购合同", group: "商业合作" },
  deployment: { exact: "部署", group: "部署与案例" },
  market_expansion: { exact: "市场扩张", group: "组织、政策与法律" },
  organization_people: { exact: "组织与人员", group: "组织、政策与法律" },
  organization_restructuring: { exact: "组织重组", group: "组织、政策与法律" },
  policy_regulation: { exact: "政策监管", group: "组织、政策与法律" },
  lawsuit_settlement: { exact: "诉讼与和解", group: "组织、政策与法律" },
  certification_compliance: { exact: "认证合规", group: "组织、政策与法律" },
  standard_specification: { exact: "技术标准", group: "组织、政策与法律" },
  security_incident: { exact: "安全事件", group: "组织、政策与法律" },
  research_result: { exact: "研究结果", group: "研究结果" },
  hardware_product: { exact: "硬件产品", group: "AI 硬件" },
  hardware_capacity: { exact: "硬件产能", group: "AI 硬件" },
  hardware_supply: { exact: "硬件供应", group: "AI 硬件" },
  hardware_deployment: { exact: "硬件部署", group: "AI 硬件" }
};

const tagNameOverrides = {
  agentic_execution: "智能体",
  tool_use: "工具调用",
  multimodal: "多模态",
  open_weights: "开放权重",
  on_device: "端侧",
  human_in_loop: "人在回路",
  retrieval_augmented_generation: "RAG"
};

const stageLabels = {
  announced: "已公布",
  planned: "计划中",
  pilot: "试点",
  in_progress: "进行中",
  completed: "已完成",
  disputed: "存在争议",
  withdrawn: "已撤回"
};

function readJson(file, fallback = null) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function readJsonl(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/u)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function writeUtf8(file, content) {
  for (let attempt = 0; attempt < 25; attempt += 1) {
    try {
      fs.writeFileSync(file, content, "utf8");
      return;
    } catch (error) {
      if (!["UNKNOWN", "EBUSY", "EPERM"].includes(error.code) || attempt === 24) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 100);
    }
  }
}

function requireMaterializedTables(tables) {
  const required = [
    "canonical_events.jsonl",
    "claims.jsonl",
    "raw_documents.jsonl",
    "source_artifacts.jsonl",
    "entities.jsonl",
    "tag_assertions.jsonl",
    "facet_assertions.jsonl",
    "reviewed_event_classifications.jsonl",
    "fde_records.jsonl",
    "fde_observations.jsonl",
    "hardware_records.jsonl",
    "hardware_facts.jsonl",
    "hardware_snapshots.jsonl",
    "monitoring_funnel.jsonl",
  ];
  const missing = required.filter((name) => !fs.existsSync(path.join(tables, name)));
  const canonicalEvents = path.join(tables, "canonical_events.jsonl");
  if (!missing.length && fs.statSync(canonicalEvents).size > 0) return;
  const detail = missing.length ? `missing ${missing.join(", ")}` : "canonical_events.jsonl is empty";
  throw new Error(`Data Center V4 materialized tables are unavailable (${detail}). Run npm run sync:data-lake -- --v4-only=true --duckdb=skip before building the frontstage.`);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function stableId(prefix, value) {
  return `${prefix}-${crypto.createHash("sha1").update(String(value)).digest("hex").slice(0, 14)}`;
}

function dateOnly(value = "") {
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/u);
  return match?.[0] || "";
}

export function sourceDateOnly(value = "") {
  const text = String(value || "");
  const directDate = dateOnly(text);
  if (directDate && !text.includes("T")) return directDate;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return directDate;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(parsed);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function containsChinese(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value));
}

function compactText(value = "", max = 240) {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

function exactMentionPositions(text = "", name = "") {
  const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const pattern = new RegExp(`(?:^|[^\\p{L}\\p{N}_])(${escaped})(?=$|[^\\p{L}\\p{N}_])`, "giu");
  return [...String(text).matchAll(pattern)].map((match) => (match.index || 0) + match[0].indexOf(match[1]));
}

function publicSourceName(publisher = "", sourceUrl = "") {
  const name = compactText(publisher, 100);
  if (name && !/\b(?:search|anysearch|gdelt)\b|关键词搜索/iu.test(name)) return name;
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./iu, "") || "来源未披露";
  } catch {
    return name || "来源未披露";
  }
}

export function isCompletePublicEventTitle(value = "") {
  return isCompleteDataTitle(value);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

export function buildEventRecords({
  events,
  claims,
  rawDocuments,
  sourceArtifacts,
  entities,
  tagAssertions,
  facetAssertions,
  reviewedEventClassifications = [],
  tagNames,
  facetNames
}) {
  const claimsById = new Map(claims.map((item) => [item.claim_id, item]));
  const rawById = new Map(rawDocuments.map((item) => [item.raw_id, item]));
  const sourceById = new Map(sourceArtifacts.map((item) => [item.source_artifact_id, item]));
  const entityById = new Map(entities.map((item) => [item.entity_id, item]));
  const tagsByClaim = new Map();
  const facetsByClaim = new Map();
  const reviewedByEvent = new Map();

  for (const assertion of tagAssertions) {
    if (assertion.status && assertion.status !== "active") continue;
    const claimId = assertion.asset_id || assertion.evidence_ref;
    if (!tagsByClaim.has(claimId)) tagsByClaim.set(claimId, []);
    tagsByClaim.get(claimId).push(assertion);
  }
  for (const assertion of facetAssertions) {
    if (assertion.status && assertion.status !== "active") continue;
    const claimId = assertion.asset_id || assertion.evidence_ref;
    if (!facetsByClaim.has(claimId)) facetsByClaim.set(claimId, []);
    facetsByClaim.get(claimId).push(assertion);
  }
  for (const classification of reviewedEventClassifications) {
    if (classification.status && classification.status !== "active") continue;
    if (!reviewedByEvent.has(classification.event_id)) reviewedByEvent.set(classification.event_id, []);
    reviewedByEvent.get(classification.event_id).push(classification);
  }

  return events.map((event) => {
    const eventClaims = safeArray(event.claim_refs).map((id) => claimsById.get(id)).filter(Boolean);
    const acceptedClaimIds = new Set(eventClaims
      .filter((claim) => !claim.verification_status || claim.verification_status === "accepted")
      .map((claim) => claim.claim_id));
    const primaryClaim = eventClaims[0] || null;
    const rawCandidates = unique(eventClaims.map((claim) => claim.raw_id))
      .map((id) => rawById.get(id))
      .filter(Boolean);
    const primaryRaw = rawCandidates.find((item) => item.title_zh)
      || rawCandidates.find((item) => item.title_original)
      || null;
    const sources = safeArray(event.source_refs).map((id) => sourceById.get(id)).filter(Boolean);
    const primarySource = sources[0] || null;
    const eventReviewed = reviewedByEvent.get(event.event_id) || [];
    const reviewedEntities = eventReviewed.map((item) => ({
      entity_id: item.entity_id,
      canonical_name: item.company_name,
      entity_type: "organization_candidate",
      verification_status: "verified"
    }));
    const allEntityIds = unique([
      ...safeArray(event.entities),
      ...reviewedEntities.map((item) => item.entity_id)
    ]);
    const eventEntities = allEntityIds
      .map((id) => entityById.get(id) || reviewedEntities.find((item) => item.entity_id === id))
      .filter(Boolean);
    const scopedEntityIds = (claimIds = []) => classificationEntityIds(
      claimIds.map((id) => claimsById.get(id)).filter(Boolean),
      eventEntities,
    );
    const technicalTags = safeArray(event.claim_refs)
      .filter((claimId) => acceptedClaimIds.has(claimId))
      .flatMap((claimId) => (tagsByClaim.get(claimId) || []).map((assertion) => ({
        dimensionId: "technology",
        dimensionName: "技术",
        id: assertion.tag_id,
        name: tagNames.get(assertion.tag_id) || assertion.tag_id,
        entityIds: scopedEntityIds([claimId]),
        provenance: "claim_assertion",
        assertionId: assertion.assertion_id || ""
      })));
    const assertedFacets = safeArray(event.claim_refs)
      .filter((claimId) => acceptedClaimIds.has(claimId))
      .flatMap((claimId) => (facetsByClaim.get(claimId) || []).map((assertion) => ({
        dimensionId: assertion.dimension_id,
        dimensionName: facetNames.get(assertion.dimension_id)?.name || assertion.dimension_id,
        id: assertion.value_id,
        name: facetNames.get(assertion.dimension_id)?.values.get(assertion.value_id) || assertion.value_id,
        entityIds: scopedEntityIds([claimId]),
        provenance: "claim_assertion",
        assertionId: assertion.assertion_id || ""
      })));
    const reviewedFacets = eventReviewed.map((item) => ({
      dimensionId: item.dimension_id,
      dimensionName: facetNames.get(item.dimension_id)?.name || item.dimension_id,
      id: item.value_id,
      name: facetNames.get(item.dimension_id)?.values.get(item.value_id) || item.value_id,
      entityIds: [item.entity_id],
      provenance: "reviewed_funding_insight",
      reviewRef: item.reviewed_classification_id,
      fundingInsightId: item.funding_insight_id
    }));
    const classifications = [...reviewedFacets, ...technicalTags, ...assertedFacets]
      .filter((item, index, list) => list.findIndex((entry) => (
        entry.dimensionId === item.dimensionId
        && entry.id === item.id
        && safeArray(entry.entityIds).join("|") === safeArray(item.entityIds).join("|")
      )) === index);
    const organizationEntities = eventEntities.filter((entity) => entity.entity_type === "organization_candidate" && entity.verification_status === "verified");
    const productEntities = eventEntities.filter((entity) => entity.entity_type === "product_candidate");
    const label = eventTypeLabels[event.event_type] || { exact: event.event_type, group: event.event_type };
    const originalTitle = compactText(primaryRaw?.title_original || "", 180);
    const translatedTitle = compactText(primaryRaw?.title_zh || "", 180);
    const ownershipTitle = translatedTitle || originalTitle || primaryClaim?.subject || "";
    const organizationPositions = organizationEntities.flatMap((owner) =>
      exactMentionPositions(ownershipTitle, owner.canonical_name).map((position) => ({
        name: owner.canonical_name,
        position
      })));
    const products = productEntities.map((entity) => ({
      name: entity.canonical_name,
      type: productEntityDisplayType(event.event_type),
      ownerNames: (() => {
        const productPosition = exactMentionPositions(ownershipTitle, entity.canonical_name).at(-1) ?? ownershipTitle.length;
        const nearestOwner = organizationPositions
          .filter((owner) => owner.position <= productPosition)
          .sort((a, b) => b.position - a.position)[0]
          || organizationPositions.sort((a, b) => a.position - b.position)[0];
        return nearestOwner ? [nearestOwner.name] : organizationEntities.slice(0, 1).map((owner) => owner.canonical_name);
      })()
    }));
    const title = compactText(event.display_title_zh || "", 180)
      || translatedTitle
      || (containsChinese(originalTitle) ? originalTitle : "")
      || event.event_id;
    const sourceUrl = primarySource?.canonical_url || primarySource?.source_url || primaryRaw?.canonical_url || primaryRaw?.source_url || "";

    return {
      id: event.event_id,
      dataDate: event.data_date,
      date: sourceDateOnly(event.event_time) || sourceDateOnly(event.disclosed_at) || sourceDateOnly(event.data_date),
      updatedDate: sourceDateOnly(primaryRaw?.updated_at) || sourceDateOnly(event.disclosed_at) || sourceDateOnly(event.data_date),
      eventType: event.event_type,
      eventTypeLabel: label.exact,
      eventGroup: label.group,
      status: event.event_status || "",
      statusLabel: stageLabels[event.event_status] || event.event_status || "未披露",
      publicationStatus: event.publication_status || "",
      title,
      originalTitle: originalTitle && originalTitle !== title ? originalTitle : "",
      subject: primaryClaim?.subject || eventEntities.map((item) => item.canonical_name).join("、") || "未披露",
      action: event.action || "未披露",
      object: event.object || "未披露",
      metrics: safeArray(event.metrics),
      locations: safeArray(event.locations),
      ...(event.market_scope?.china_market_match ? { marketScope: event.market_scope } : {}),
      missingFields: safeArray(event.missing_fields),
      conflicts: safeArray(event.conflicts),
      tags: technicalTags,
      facets: Object.fromEntries([...facetNames.keys()].map((dimensionId) => [
        dimensionId,
        classifications.filter((item) => item.dimensionId === dimensionId)
      ])),
      classifications,
      displayTags: [
        ...classifications.filter((item) => item.dimensionId === "ai_market_category"),
        ...classifications.filter((item) => item.dimensionId === "ai_market_subcategory"),
        ...classifications.filter((item) => item.dimensionId === "ai_market_application"),
        ...classifications.filter((item) => item.dimensionId === "product_form"),
        ...classifications.filter((item) => item.dimensionId === "use_case"),
        ...classifications.filter((item) => item.dimensionId === "technology"),
        ...classifications.filter((item) => ![
          "ai_market_category",
          "ai_market_subcategory",
          "ai_market_application",
          "product_form",
          "use_case",
          "technology"
        ].includes(item.dimensionId))
      ],
      entityIds: allEntityIds,
      entityNames: eventEntities.map((item) => item.canonical_name),
      productName: products[0]?.name || "",
      products,
      claims: eventClaims.map((claim) => ({
        id: claim.claim_id,
        subject: claim.subject || "",
        object: claim.object || "",
        quote: compactText(claim.source_quote || "", 700)
      })),
      sources: sources.map((source) => ({
        id: source.source_artifact_id,
        publisher: publicSourceName(source.publisher, source.canonical_url || source.source_url || ""),
        url: source.canonical_url || source.source_url || ""
      })),
      sourceUrl,
      publisher: publicSourceName(primarySource?.publisher || primaryRaw?.publisher || "", sourceUrl),
      sourceExcerpt: compactText(primaryClaim?.source_quote || "", 700)
    };
  }).sort((a, b) => {
    const priority = {
      funding: 0,
      acquisition: 0,
      deployment: 1,
      hardware_deployment: 1,
      procurement_contract: 1,
      partnership: 2,
      model_release: 3,
      product_release: 3,
      service_change: 3,
      pricing_change: 3,
      hardware_product: 3
    };
    return (priority[a.eventType] ?? 9) - (priority[b.eventType] ?? 9)
      || b.date.localeCompare(a.date)
      || b.updatedDate.localeCompare(a.updatedDate)
      || a.id.localeCompare(b.id);
  });
}

function buildFdeRecords(rows, eventsById) {
  return rows.filter((row) => eventsById.has(row.event_id)).map((row) => {
    const event = eventsById.get(row.event_id);
    return {
      id: row.fde_id,
      eventId: row.event_id,
      dataDate: row.data_date || "",
      date: event?.date || dateOnly(row.timeline || row.data_date),
      title: event?.title || compactText(`${row.customer || row.vendor || "企业"} FDE 实施`, 150),
      stage: row.deployment_stage || "",
      stageLabel: stageLabels[row.deployment_stage] || row.deployment_stage || "未披露",
      customer: row.customer || "未披露",
      vendor: row.vendor || "未披露",
      industry: row.industry || "未披露",
      useCase: row.use_case || "未披露",
      reportedNeed: row.reported_need || "未披露",
      deliveryComponents: safeArray(row.reported_delivery_components),
      outcomes: safeArray(row.reported_outcomes),
      metrics: safeArray(row.reported_metrics),
      undisclosedFields: safeArray(row.undisclosed_fields),
      tags: event?.tags || [],
      sourceUrl: event?.sourceUrl || "",
      entityIds: event?.entityIds || []
    };
  }).sort((a, b) => b.dataDate.localeCompare(a.dataDate) || b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

function buildHardwareRecords(rows, eventsById) {
  return rows.filter((row) => eventsById.has(row.event_id)).map((row) => {
    const event = eventsById.get(row.event_id);
    return {
      id: row.hardware_record_id,
      eventId: row.event_id,
      dataDate: row.data_date || "",
      date: event?.date || dateOnly(row.shipment_date || row.data_date),
      title: event?.title || compactText(`${row.supplier || row.customer || "AI 硬件"} ${row.component_type || "记录"}`, 150),
      hardwareType: row.component_type || "未披露",
      eventType: row.hardware_event_type || "",
      eventTypeLabel: eventTypeLabels[row.hardware_event_type]?.exact || row.hardware_event_type || "未披露",
      computeLayer: row.compute_layer || "未披露",
      supplier: row.supplier || "未披露",
      customer: row.customer || "未披露",
      processNode: row.process_node || "未披露",
      capacity: row.capacity ?? "未披露",
      capacityUnit: row.capacity_unit || "",
      site: row.deployment_site || "未披露",
      region: row.region || "未披露",
      contractValue: row.contract_value || "未披露",
      shipmentDate: dateOnly(row.shipment_date) || "未披露",
      tags: event?.tags || [],
      sourceUrl: event?.sourceUrl || "",
      sourceName: publicSourceName(event?.publisher, event?.sourceUrl),
      sourceDate: event?.date || dateOnly(row.data_date),
      entityIds: event?.entityIds || []
    };
  }).sort((a, b) => b.dataDate.localeCompare(a.dataDate) || b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

function buildFdeDossiers(rows, eventsById) {
  const groups = new Map();
  for (const row of rows) {
    if (!groups.has(row.implementation_key)) groups.set(row.implementation_key, []);
    groups.get(row.implementation_key).push(row);
  }
  return [...groups.entries()].map(([implementationKey, observations]) => {
    const sorted = [...observations].sort((a, b) => (
      String(b.observed_at || b.data_date).localeCompare(String(a.observed_at || a.data_date))
      || String(b.data_date).localeCompare(String(a.data_date))
    ));
    const latest = sorted[0];
    const eventIds = unique(sorted.flatMap((item) => item.event_refs || []));
    const events = eventIds.map((id) => eventsById.get(id)).filter(Boolean);
    const customer = sorted.find((item) => item.customer)?.customer || "未披露";
    const vendor = sorted.find((item) => item.vendor)?.vendor || "未披露";
    const useCase = sorted.find((item) => item.use_case)?.use_case || "实施场景未披露";
    const stage = sorted.find((item) => item.lifecycle_stage)?.lifecycle_stage || "";
    const missingFields = unique(sorted.flatMap((item) => item.completeness?.missing_fields || []));
    const completeness = sorted.reduce((best, item) => Math.max(best, Number(item.completeness?.ratio || 0)), 0);
    return {
      id: `FDED-${implementationKey}`,
      implementationKey,
      eventId: eventIds[0] || "",
      eventIds,
      dataDate: sorted.map((item) => item.data_date).filter(Boolean).sort().at(-1) || "",
      date: dateOnly(latest.observed_at || latest.data_date),
      title: compactText(`${customer} × ${vendor}：${useCase}`, 160),
      stage,
      stageLabel: stageLabels[stage] || stage || "未披露",
      customer,
      vendor,
      industry: sorted.find((item) => item.industry)?.industry || "未披露",
      useCase,
      workflow: sorted.find((item) => item.workflow)?.workflow || "未披露",
      systems: unique(sorted.flatMap((item) => item.systems_integrated || [])),
      outcomes: unique(sorted.flatMap((item) => item.reported_outcomes || [])),
      observationCount: sorted.length,
      completeness,
      completenessPercent: Math.round(completeness * 100),
      missingFields,
      timeline: sorted.map((item) => {
        const eventId = item.event_refs?.[0] || "";
        const event = eventsById.get(eventId);
        return {
          observationId: item.observation_id,
          type: item.observation_type,
          stage: item.lifecycle_stage,
          date: dateOnly(item.observed_at || item.data_date),
          dataDate: item.data_date,
          eventId,
          eventTitle: event?.title || "",
          claimCount: item.claim_refs?.length || 0,
          sourceCount: item.source_refs?.length || 0
        };
      }),
      tags: unique(events.flatMap((event) => event.tags || [])),
      sourceUrl: events.find((event) => event.sourceUrl)?.sourceUrl || "",
      entityIds: unique(events.flatMap((event) => event.entityIds || []))
    };
  }).sort((a, b) => b.dataDate.localeCompare(a.dataDate) || b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

function buildHardwareCatalog(snapshotRows, factRows, eventsById) {
  const factsById = new Map(factRows.map((item) => [item.hardware_fact_id, item]));
  const groups = new Map();
  for (const snapshot of snapshotRows) {
    if (!groups.has(snapshot.snapshot_key)) groups.set(snapshot.snapshot_key, []);
    groups.get(snapshot.snapshot_key).push(snapshot);
  }
  return [...groups.entries()].map(([snapshotKey, snapshots]) => {
    const sorted = [...snapshots].sort((a, b) => String(b.as_of || b.data_date).localeCompare(String(a.as_of || a.data_date)));
    const latest = sorted[0];
    const latestFacts = (latest.fact_refs || []).map((id) => factsById.get(id)).filter(Boolean);
    const eventIds = unique(sorted.flatMap((item) => item.event_refs || []));
    const events = eventIds.map((id) => eventsById.get(id)).filter(Boolean);
    const productNames = unique(sorted.flatMap((item) => item.product_names || []));
    const factTypes = unique(sorted.flatMap((item) => (item.fact_refs || []).map((id) => factsById.get(id)?.fact_type).filter(Boolean)));
    const changes = [];
    for (let index = 0; index < sorted.length - 1; index += 1) {
      const current = sorted[index];
      const previous = sorted[index + 1];
      if (JSON.stringify(current.latest_values) === JSON.stringify(previous.latest_values)) continue;
      changes.push({
        date: current.as_of || current.data_date,
        previousDate: previous.as_of || previous.data_date,
        snapshotId: current.hardware_snapshot_id,
        previousSnapshotId: previous.hardware_snapshot_id,
        changedFacts: Object.keys(current.latest_values || {}).filter((key) => JSON.stringify(current.latest_values?.[key]) !== JSON.stringify(previous.latest_values?.[key]))
      });
    }
    return {
      id: `HWC-${snapshotKey}`,
      snapshotKey,
      snapshotId: latest.hardware_snapshot_id,
      eventId: eventIds[0] || "",
      eventIds,
      dataDate: latest.as_of || latest.data_date || "",
      date: latest.as_of || latest.data_date || "",
      title: productNames.join(" / ") || latest.subject_name || latest.component_types?.join(" / ") || "AI 硬件",
      subject: latest.subject_name,
      productNames,
      hardwareType: latest.component_types?.join(" / ") || "未披露",
      factTypes,
      latestValues: latest.latest_values || {},
      factCount: latestFacts.length,
      snapshotCount: sorted.length,
      changes,
      capacityFacts: latestFacts.filter((item) => item.fact_type === "capacity"),
      supplyFacts: latestFacts.filter((item) => ["supply", "oem_odm", "shipment_deployment"].includes(item.fact_type)),
      specificationFacts: latestFacts.filter((item) => ["product", "specification"].includes(item.fact_type)),
      capexFacts: latestFacts.filter((item) => item.fact_type === "capex"),
      tags: unique(events.flatMap((event) => event.tags || [])),
      sourceUrl: events.find((event) => event.sourceUrl)?.sourceUrl || "",
      entityIds: unique(events.flatMap((event) => event.entityIds || []))
    };
  })
    .filter((item) => item.factCount > 0 && item.sourceUrl)
    .sort((a, b) => b.dataDate.localeCompare(a.dataDate) || a.title.localeCompare(b.title, "zh-CN"));
}

function buildCommunity(root) {
  const file = path.join(root, "01-SiteV2/site/data/community-intelligence.json");
  const data = readJson(file, { meta: {}, items: [] });
  const generatedDate = dateOnly(data.meta?.generatedAt);
  return safeArray(data.items).map((item, index) => ({
    id: item.id || stableId("CM", `${item.url || item.title}-${index}`),
    date: dateOnly(item.publishedAt) || generatedDate,
    title: compactText(item.title || "未命名社群情报", 180),
    author: item.author || "未披露",
    community: item.sourceName || item.source || "未披露",
    content: compactText(item.evidence || item.excerpt || item.summary || item.title || "", 1800),
    tags: unique([...(item.matchedKeywords || []), item.scene, item.industry].filter(Boolean)).slice(0, 5),
    sourceUrl: item.url || "",
    companyNames: [],
    productNames: []
  })).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export function buildViewpoints(root, entityProfiles = []) {
  const file = path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json");
  const data = readJson(file, { meta: {}, remarks: [] });
  const peopleByKey = new Map();
  for (const person of entityProfiles.filter((item) => item.entityType === "person_candidate")) {
    for (const value of [person.handle, person.name, ...(person.aliases || [])]) {
      if (value) peopleByKey.set(String(value).toLocaleLowerCase(), person.id);
    }
  }
  return safeArray(data.remarks).map((item, index) => ({
    id: stableId("VP", item.id || item.url || `${item.name}-${index}`),
    date: dateOnly(item.date || item.createdAt),
    title: compactText(item.translation || item.text || "未命名一线观点", 180),
    translatedContent: compactText(item.contentTranslation || item.translation || "", 2200),
    originalContent: compactText(item.content || item.text || "", 2200),
    person: item.name || item.handle || "未披露",
    personEntityId: peopleByKey.get(String(item.handle || item.name || "").toLocaleLowerCase()) || "",
    handle: item.handle || "",
    role: item.role || "未披露",
    organization: item.organization || item.name || "未披露",
    tags: unique(safeArray(item.columnTags).map((tag) => tag.name || tag.id).concat(item.topic || [])).slice(0, 5),
    sourceUrl: item.url || item.id || ""
  })).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export function buildEntityCollections(service, eventsById, reviewDecisions = null) {
  const enforceCatalogReview = reviewDecisions !== null;
  const reviewedCatalogIds = new Set((Array.isArray(reviewDecisions) ? reviewDecisions : reviewDecisions?.decisions || [])
    .filter((decision) => decision.review_status === "accepted")
    .filter((decision) => ["confirm", "correct"].includes(decision.action))
    .filter((decision) => ["company", "product"].includes(decision.canonical?.catalog_type))
    .map((decision) => decision.entity_id));
  const nodeById = new Map(service.taxonomyNodes.map((item) => [item.id, item]));
  const nameById = new Map(service.profiles.map((item) => [item.id, item.name]));
  const profileById = new Map(service.profiles.map((item) => [item.id, item]));
  const productOwnerIds = new Map();
  for (const relation of service.relationships) {
    if (relation.predicate !== "publishes" || relation.object_type !== "entity") continue;
    if (profileById.get(relation.subject_ref)?.entityType !== "organization_candidate") continue;
    if (!productOwnerIds.has(relation.object_ref)) productOwnerIds.set(relation.object_ref, []);
    productOwnerIds.get(relation.object_ref).push(relation.subject_ref);
  }
  const common = (profile) => {
    const marketScopes = unique((profile.eventIds || []).flatMap((id) => (
      eventsById.get(id)?.marketScope?.china_market_basis || []
    )));
    return ({
    id: profile.id,
    name: profile.name,
    sourceType: profile.entityType,
    aliases: profile.aliases || [],
    tags: (profile.classificationRefs || []).map((id) => nodeById.get(id)?.name).filter(Boolean).slice(0, 5),
    eventIds: profile.eventIds || [],
    firstSeen: profile.firstSeen || "",
    lastSeen: profile.lastSeen || "",
    relatedEntityIds: profile.relatedEntityIds || [],
    relationIds: profile.relationIds || [],
    ...(marketScopes.length ? { marketScopes, chinaMarketMatch: true } : {}),
    ...(profile.organizationFamilyId ? {
      organizationFamilyId: profile.organizationFamilyId,
      organizationFamilyEntityIds: profile.organizationFamilyEntityIds || [],
      organizationRole: profile.organizationRole || "",
      parentEntityId: profile.parentEntityId || "",
      parentEntityName: profile.parentEntityName || "",
      hierarchyEvidence: profile.hierarchyEvidence || []
    } : {})
    });
  };
  const companies = service.profiles
    .filter((profile) => profile.entityType === "organization_candidate" && profile.verificationStatus === "verified" && profile.eventIds.length && (!enforceCatalogReview || reviewedCatalogIds.has(profile.id)))
    .map((profile) => ({
      ...common(profile),
      type: "公司/机构",
      productIds: service.relationships
        .filter((relation) => relation.predicate === "publishes" && relation.subject_ref === profile.id)
        .map((relation) => relation.object_ref)
    }));
  const products = service.profiles
    .filter((profile) => profile.entityType === "product_candidate" && profile.verificationStatus === "verified" && profile.eventIds.length && (!enforceCatalogReview || reviewedCatalogIds.has(profile.id)))
    .map((profile) => {
      const companyIds = unique(productOwnerIds.get(profile.id) || []);
      const firstEvent = profile.eventIds.map((id) => eventsById.get(id)).find(Boolean);
      return {
        ...common(profile),
        legacyIds: [stableId("PD", profile.name.toLowerCase())],
        companyIds,
        companyNames: companyIds.map((id) => nameById.get(id)).filter(Boolean),
        type: productEntityDisplayType(firstEvent?.eventType || "product_release")
      };
    });
  const people = service.profiles
    .filter((profile) => profile.entityType === "person_candidate"
      && profile.verificationStatus === "verified"
      && (profile.eventIds.length || profile.viewpointIds.length || profile.fundingInsightIds?.length))
    .map((profile) => ({
      ...common(profile),
      type: "人物",
      handle: profile.handle || "",
      role: profile.role || "",
      roleTitle: profile.roleTitle || "",
      organization: profile.organization || "",
      organizationNames: profile.organizationNames || [],
      affiliationEvidence: profile.affiliationEvidence || [],
      viewpointIds: profile.viewpointIds || [],
      fundingInsightIds: profile.fundingInsightIds || [],
      founderCompanies: profile.founderCompanies || [],
      founderEvidence: profile.founderEvidence || []
    }));
  return { companies, products, people };
}

export function buildFrontstageData(root = defaultRoot) {
  const tables = path.join(root, "data-lake/tables");
  requireMaterializedTables(tables);
  const taxonomy = readJson(path.join(root, "agent-workflow/product/tag-taxonomy-v4.json"), { tags: [], facets: [] });
  const tagNames = new Map(safeArray(taxonomy.tags).map((tag) => [
    tag.id,
    tagNameOverrides[tag.id] || tag.name || tag.id
  ]));
  const facetNames = new Map(safeArray(taxonomy.facets).map((facet) => [
    facet.id,
    {
      name: facet.name || facet.id,
      values: new Map(safeArray(facet.values).map((value) => [value.id, value.name || value.id]))
    }
  ]));

  const reviewedEventClassifications = readJsonl(path.join(tables, "reviewed_event_classifications.jsonl"));
  const sourceEntityRows = readJsonl(path.join(tables, "entities.jsonl"));
  const allEventRecords = buildEventRecords({
    events: readJsonl(path.join(tables, "canonical_events.jsonl")),
    claims: readJsonl(path.join(tables, "claims.jsonl")),
    rawDocuments: readJsonl(path.join(tables, "raw_documents.jsonl")),
    sourceArtifacts: readJsonl(path.join(tables, "source_artifacts.jsonl")),
    entities: sourceEntityRows,
    tagAssertions: readJsonl(path.join(tables, "tag_assertions.jsonl")),
    facetAssertions: readJsonl(path.join(tables, "facet_assertions.jsonl")),
    reviewedEventClassifications,
    tagNames,
    facetNames
  });
  const invalidTitles = allEventRecords.filter((item) => !isCompletePublicEventTitle(item.title));
  const eventRecords = allEventRecords.filter((item) => isCompletePublicEventTitle(item.title));
  const latestDataDate = eventRecords.map((item) => item.dataDate).filter(Boolean).sort().at(-1) || "";
  const currentDate = latestDataDate;
  const entityRows = [...sourceEntityRows];
  const existingEntityIds = new Set(entityRows.map((item) => item.entity_id));
  for (const row of reviewedEventClassifications) {
    if (existingEntityIds.has(row.entity_id)) continue;
    entityRows.push({
      schema_version: "4.0.0",
      entity_id: row.entity_id,
      entity_type: "organization_candidate",
      canonical_name: row.company_name,
      aliases: [],
      mention_refs: [],
      first_seen: "",
      last_seen: "",
      confidence: row.confidence || 1,
      verification_status: "verified",
      merged_into: ""
    });
    existingEntityIds.add(row.entity_id);
  }
  const eventsById = new Map(eventRecords.map((item) => [item.id, item]));
  const fde = buildFdeRecords(readJsonl(path.join(tables, "fde_records.jsonl")), eventsById);
  const fdeDossiers = buildFdeDossiers(readJsonl(path.join(tables, "fde_observations.jsonl")), eventsById);
  const hardware = buildHardwareRecords(readJsonl(path.join(tables, "hardware_records.jsonl")), eventsById);
  const hardwareFacts = readJsonl(path.join(tables, "hardware_facts.jsonl"));
  const hardwareCatalog = buildHardwareCatalog(readJsonl(path.join(tables, "hardware_snapshots.jsonl")), hardwareFacts, eventsById);
  const monitoringFunnel = readJsonl(path.join(tables, "monitoring_funnel.jsonl"))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const viewpointData = readJson(path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json"), { meta: {}, builders: [], remarks: [] });
  const reviewDecisions = mergeEntityReviewDecisionSets(
    readJson(path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/entity-catalog-review-decisions.json"), { decisions: [] }),
    readJson(path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/person-account-review-decisions.json"), { decisions: [] }),
    readJson(path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/funding-founder-review-decisions.json"), { decisions: [] })
  );
  const entityHistory = buildEntityHistoryService({
    entityRows,
    events: eventRecords,
    fdeRecords: fde,
    hardwareRecords: hardware,
    viewpointData,
    reviewDecisions,
    generatedAt: process.env.WAVESIGHT_ENTITY_HISTORY_GENERATED_AT || ""
  });
  const entityCollections = buildEntityCollections(entityHistory, eventsById, reviewDecisions);
  const viewpoints = buildViewpoints(root, entityHistory.profiles);
  const investmentInstitutionRegistry = readJson(
    path.join(root, "01-SiteV2/content/11-databases/investment-institutions-v1.json"),
    { meta: {}, institutions: [] },
  );
  const investors = safeArray(investmentInstitutionRegistry.institutions).map(investmentInstitutionIndexItem);
  const translationRegistry = readPublicTranslationRegistry(root);
  const translatedCompanies = entityCollections.companies.map((item) => applyPublicZhTranslations(item, translationRegistry, { entityType: "company" }));
  const translatedProducts = entityCollections.products.map((item) => applyPublicZhTranslations(item, translationRegistry, { entityType: "product" }));
  const translatedPeople = entityCollections.people.map((item) => applyPublicZhTranslations(item, translationRegistry, { entityType: "person" }));
  const translatedInvestors = investors.map((item) => applyPublicZhTranslations(item, translationRegistry, { entityType: "institution" }));
  const translatedEntityProfiles = entityHistory.profiles.map((item) => applyPublicZhTranslations(item, translationRegistry, { entityType: item.entityType || "entity" }));
  const translatedInstitutionRegistry = {
    ...investmentInstitutionRegistry,
    institutions: safeArray(investmentInstitutionRegistry.institutions)
      .map((item) => applyPublicZhTranslations(item, translationRegistry, { entityType: "institution" })),
  };

  return {
    meta: {
      productVersion: "SITE-V4.2.0-entity-history",
      dataVersion: "SITE-V4.0-data-center",
      entityVersion: entityHistory.manifest.entityVersion,
      relationshipVersion: entityHistory.manifest.relationshipVersion,
      taxonomyVersion: "TAG-V4.1",
      generatedAt: process.env.WAVESIGHT_FRONTSTAGE_GENERATED_AT || new Date().toISOString(),
      latestDataDate,
      currentDate,
      eventCount: eventRecords.length,
      quarantinedEventCount: invalidTitles.length
    },
    eventTypes: eventTypeLabels,
    events: eventRecords,
    companies: translatedCompanies,
    products: translatedProducts,
    people: translatedPeople,
    investors: translatedInvestors,
    investmentInstitutionRegistry: translatedInstitutionRegistry,
    taxonomyNodes: entityHistory.taxonomyNodes,
    entityProfiles: translatedEntityProfiles,
    entityRelationships: entityHistory.relationships,
    entityHistoryManifest: entityHistory.manifest,
    fde,
    fdeDossiers,
    hardware,
    hardwareCatalog,
    monitoringFunnel: monitoringFunnel.filter((item) => item.date === currentDate),
    community: buildCommunity(root),
    viewpoints
  };
}

export function writeFrontstageData(root = defaultRoot) {
  const data = buildFrontstageData(root);
  const output = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const { investmentInstitutionRegistry, ...publicData } = data;
  writeUtf8(output, `${JSON.stringify(publicData, null, 2)}\n`);
  const splitRoot = path.join(root, "01-SiteV2/site/data/data-center-v4");
  const indexesDir = path.join(splitRoot, "indexes");
  const detailsDir = path.join(splitRoot, "details");
  const entitiesDir = path.join(splitRoot, "entities");
  const investorsDir = path.join(splitRoot, "investors");
  const taxonomyDir = path.join(splitRoot, "taxonomy");
  fs.rmSync(splitRoot, { recursive: true, force: true });
  for (const dir of [splitRoot, indexesDir, detailsDir, entitiesDir, investorsDir, taxonomyDir]) fs.mkdirSync(dir, { recursive: true });
  const writeJson = (file, value) => writeUtf8(file, `${JSON.stringify(value, null, 2)}\n`);
  const compactEvents = data.events.map(({ claims, sources, sourceExcerpt, ...event }) => event);
  writeJson(path.join(indexesDir, "events.json"), { meta: data.meta, eventTypes: data.eventTypes, events: compactEvents });
  writeJson(path.join(indexesDir, "entities.json"), {
    meta: { ...data.meta, entityHistory: data.entityHistoryManifest },
    companies: data.companies,
    products: data.products,
    people: data.people,
    investors: data.investors,
    taxonomyNodes: data.taxonomyNodes
  });
  const relationLabels = {
    publishes: "发布",
    partners_with: "合作",
    acquires: "收购",
    serves: "服务",
    deployed_in: "部署于",
    supplies_hardware_to: "供应硬件",
    joins: "加入",
    leaves: "离开",
    founds: "创立"
  };
  const relationEndpointName = (ref, type) => type === "taxonomy"
    ? data.taxonomyNodes.find((node) => node.id === ref)?.name || ref
    : data.entityProfiles.find((profile) => profile.id === ref)?.name || ref;
  const relationshipIndex = data.entityRelationships.map((relation) => {
    const event = compactEvents.find((item) => item.id === relation.event_id);
    return {
      ...relation,
      subjectName: relationEndpointName(relation.subject_ref, relation.subject_type),
      objectName: relationEndpointName(relation.object_ref, relation.object_type),
      predicateLabel: relationLabels[relation.predicate] || relation.predicate,
      title: `${relationEndpointName(relation.subject_ref, relation.subject_type)} ${relationLabels[relation.predicate] || relation.predicate} ${relationEndpointName(relation.object_ref, relation.object_type)}`,
      eventTitle: event?.title || "",
      eventDate: event?.date || "",
      sourceCount: relation.source_refs.length
    };
  });
  writeJson(path.join(indexesDir, "relationships.json"), { meta: data.meta, relationships: relationshipIndex });
  const eventDetailById = new Map(data.events.map((event) => [event.id, event]));
  const relationshipDetails = relationshipIndex.map((relation) => {
    const event = eventDetailById.get(relation.event_id);
    const claimRefs = new Set(relation.claim_refs || []);
    const sourceRefs = new Set(relation.source_refs || []);
    return {
      ...relation,
      claims: (event?.claims || []).filter((claim) => claimRefs.has(claim.id)),
      sources: (event?.sources || []).filter((source) => sourceRefs.has(source.id)),
      sourceExcerpt: event?.sourceExcerpt || "",
      event: event ? {
        id: event.id,
        title: event.title,
        originalTitle: event.originalTitle,
        date: event.date,
        dataDate: event.dataDate,
        eventTypeLabel: event.eventTypeLabel
      } : null
    };
  });
  writeJson(path.join(indexesDir, "fde.json"), {
    meta: data.meta,
    fde: data.fde,
    fdeDossiers: data.fdeDossiers,
    monitoringFunnel: data.monitoringFunnel.filter((item) => item.lens === "fde")
  });
  writeJson(path.join(indexesDir, "hardware.json"), {
    meta: data.meta,
    hardware: data.hardware,
    hardwareCatalog: data.hardwareCatalog,
    monitoringFunnel: data.monitoringFunnel.filter((item) => item.lens === "hardware")
  });
  writeJson(path.join(detailsDir, "events.json"), { meta: data.meta, events: data.events });
  writeJson(path.join(detailsDir, "relationships.json"), { meta: data.meta, relationships: relationshipDetails });
  writeJson(path.join(detailsDir, "fde.json"), { meta: data.meta, fde: data.fde, fdeDossiers: data.fdeDossiers, events: compactEvents });
  writeJson(path.join(detailsDir, "hardware.json"), { meta: data.meta, hardware: data.hardware, hardwareCatalog: data.hardwareCatalog, events: compactEvents });

  const profileById = new Map(data.entityProfiles.map((profile) => [profile.id, profile]));
  const nodeById = new Map(data.taxonomyNodes.map((node) => [node.id, node]));
  const relationById = new Map(data.entityRelationships.map((relation) => [relation.relationship_id, relation]));
  for (const profile of data.entityProfiles) {
    const payload = {
      meta: data.meta,
      entity: profile,
      relatedEntities: (profile.relatedEntityIds || []).map((id) => profileById.get(id)).filter(Boolean).map(({ timeline, viewpoints, groupedEventIds, relationIds, ...item }) => item),
      ...(profile.organizationFamilyEntityIds?.length ? {
        organizationFamilyEntities: profile.organizationFamilyEntityIds.map((id) => profileById.get(id)).filter(Boolean).map(({ timeline, viewpoints, groupedEventIds, relationIds, ...item }) => item)
      } : {}),
      relationships: (profile.relationIds || []).map((id) => relationById.get(id)).filter(Boolean),
      taxonomyNodes: (profile.classificationRefs || []).map((id) => nodeById.get(id)).filter(Boolean),
      fde: data.fde.filter((item) => item.entityIds.includes(profile.id)),
      hardware: data.hardware.filter((item) => item.entityIds.includes(profile.id))
    };
    const fdeDossiers = data.fdeDossiers.filter((item) => item.entityIds.includes(profile.id));
    const hardwareCatalog = data.hardwareCatalog.filter((item) => item.entityIds.includes(profile.id));
    if (fdeDossiers.length) payload.fdeDossiers = fdeDossiers;
    if (hardwareCatalog.length) payload.hardwareCatalog = hardwareCatalog;
    writeJson(path.join(entitiesDir, `${profile.id}.json`), payload);
  }
  for (const institution of investmentInstitutionRegistry.institutions || []) {
    writeJson(path.join(investorsDir, `${institution.id}.json`), {
      meta: data.meta,
      institution,
    });
  }
  for (const node of data.taxonomyNodes) {
    const payload = {
      meta: data.meta,
      node,
      events: node.eventIds.map((id) => compactEvents.find((event) => event.id === id)).filter(Boolean),
      entities: node.entityIds.map((id) => profileById.get(id)).filter(Boolean).map(({ timeline, viewpoints, groupedEventIds, relationIds, ...item }) => item),
      fde: data.fde.filter((item) => node.fdeIds.includes(item.id)),
      hardware: data.hardware.filter((item) => node.hardwareIds.includes(item.id))
    };
    const fdeDossiers = data.fdeDossiers.filter((item) => item.eventIds.some((id) => node.eventIds.includes(id)));
    const hardwareCatalog = data.hardwareCatalog.filter((item) => item.eventIds.some((id) => node.eventIds.includes(id)));
    if (fdeDossiers.length) payload.fdeDossiers = fdeDossiers;
    if (hardwareCatalog.length) payload.hardwareCatalog = hardwareCatalog;
    writeJson(path.join(taxonomyDir, `${node.id}.json`), payload);
  }
  const manifest = {
    productVersion: data.meta.productVersion,
    dataVersion: data.meta.dataVersion,
    entityVersion: data.meta.entityVersion,
    relationshipVersion: data.meta.relationshipVersion,
    generatedAt: data.meta.generatedAt,
    currentDate: data.meta.currentDate,
    coverage: data.entityHistoryManifest.coverage,
    counts: {
      events: data.events.length,
      companies: data.companies.length,
      products: data.products.length,
      people: data.people.length,
      investors: data.investors.length,
      taxonomyNodes: data.taxonomyNodes.length,
      relationships: data.entityRelationships.length,
      fde: data.fde.length,
      fdeDossiers: data.fdeDossiers.length,
      hardware: data.hardware.length,
      hardwareCatalog: data.hardwareCatalog.length
    },
    paths: {
      eventsIndex: "data/data-center-v4/indexes/events.json",
      entitiesIndex: "data/data-center-v4/indexes/entities.json",
      relationshipsIndex: "data/data-center-v4/indexes/relationships.json",
      fdeIndex: "data/data-center-v4/indexes/fde.json",
      hardwareIndex: "data/data-center-v4/indexes/hardware.json",
      eventsDetail: "data/data-center-v4/details/events.json",
      relationshipsDetail: "data/data-center-v4/details/relationships.json",
      fdeDetail: "data/data-center-v4/details/fde.json",
      hardwareDetail: "data/data-center-v4/details/hardware.json",
      entityDetailPattern: "data/data-center-v4/entities/{id}.json",
      investorDetailPattern: "data/data-center-v4/investors/{id}.json",
      taxonomyDetailPattern: "data/data-center-v4/taxonomy/{id}.json"
    }
  };
  writeJson(path.join(splitRoot, "manifest.json"), manifest);
  return { output, manifest: path.join(splitRoot, "manifest.json"), data };
}

function main() {
  const { output, data } = writeFrontstageData();
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(defaultRoot, output).replace(/\\/gu, "/"),
    currentDate: data.meta.currentDate,
    rows: {
      events: data.events.length,
      companies: data.companies.length,
      products: data.products.length,
      investors: data.investors.length,
      fde: data.fde.length,
      fdeDossiers: data.fdeDossiers.length,
      hardware: data.hardware.length,
      hardwareCatalog: data.hardwareCatalog.length,
      community: data.community.length,
      viewpoints: data.viewpoints.length
    }
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) main();
