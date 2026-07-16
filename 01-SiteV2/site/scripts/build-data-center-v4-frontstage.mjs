#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { isCompletePublicEventTitle as isCompleteDataTitle } from "../../../agent-workflow/tools/event-public-title.mjs";

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
  partnership: { exact: "合作", group: "商业合作" },
  procurement_contract: { exact: "采购合同", group: "商业合作" },
  deployment: { exact: "部署", group: "部署与案例" },
  organization_people: { exact: "组织与人员", group: "组织、政策与法律" },
  policy_regulation: { exact: "政策监管", group: "组织、政策与法律" },
  lawsuit_settlement: { exact: "诉讼与和解", group: "组织、政策与法律" },
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
  if (!text.includes("T")) return dateOnly(text);
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return dateOnly(text);
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

function publicSourceName(publisher = "", sourceUrl = "") {
  const name = compactText(publisher, 100);
  if (name && !/\b(?:search|anysearch|gdelt)\b|关键词搜索/iu.test(name)) return name;
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./iu, "") || "来源未披露";
  } catch {
    return name || "来源未披露";
  }
}

const namedProductRules = [
  { name: "ABot-WorldStudio", type: "模型", owners: ["Gaode"], patterns: [/\bABot-WorldStudio\b/iu] },
  { name: "AI Overviews", type: "产品/服务", owners: ["Google"], patterns: [/\bAI Overviews\b/iu] },
  { name: "AI-RAN 平台", type: "产品/服务", owners: ["Nokia", "NVIDIA"], patterns: [/\bAI-?RAN\b/iu] },
  { name: "Bonsai 27B", type: "模型", owners: ["PrismML"], patterns: [/\bBonsai 27B\b/iu] },
  { name: "Claude Code", type: "产品/服务", owners: ["Anthropic"], patterns: [/\bClaude Code(?:\s+v?\d+(?:\.\d+)+)?\b/iu] },
  { name: "Claude for Teachers", type: "产品/服务", owners: ["Anthropic"], patterns: [/\bClaude for Teachers\b/iu] },
  { name: "Codex Micro", type: "AI 硬件", owners: ["OpenAI", "Work Louder"], patterns: [/\bCodex Micro\b/iu, /\$230 keyboard for Codex/iu, /hardware…?\s+for Codex/iu] },
  { name: "Crusoe Serverless Fine-Tuning", type: "产品/服务", owners: ["Crusoe"], patterns: [/\bServerless Fine-Tuning\b/iu] },
  { name: "Crusoe Self-Serve Inference", type: "产品/服务", owners: ["Crusoe"], patterns: [/\bSelf-Serve Inference\b/iu] },
  { name: "Gemini Enterprise", type: "产品/服务", owners: ["Google"], patterns: [/\bGemini Enterprise\b/iu] },
  { name: "GLM-5.2 NVFP4", type: "模型", owners: [], patterns: [/\bGLM-5\.2 NVFP4\b/iu] },
  { name: "Google Images", type: "产品/服务", owners: ["Google"], patterns: [/\bGoogle Images\b/iu, /谷歌图片服务/iu] },
  { name: "Grok Build", type: "产品/服务", owners: ["xAI"], patterns: [/\bGrok Build\b|xai-org\/grok-build/iu] },
  { name: "Help Agent", type: "产品/服务", owners: ["Salesforce"], patterns: [/\bHelp Agent\b/iu] },
  { name: "Hy3", type: "模型", owners: ["Tencent"], patterns: [/\bHy3\b/iu] },
  { name: "IBM Power 自主运维 AI 智能体", type: "产品/服务", owners: ["IBM"], patterns: [/\bPower\b.{0,12}自主运维 AI 智能体/iu] },
  { name: "Inkling", type: "模型", owners: ["Thinking Machines Lab"], patterns: [/\bInkling\b/iu] },
  { name: "Jetson Thor", type: "AI 硬件", owners: ["NVIDIA"], patterns: [/\bJetson Thor\b/iu] },
  { name: "LiteRT.js", type: "产品/服务", owners: ["Google"], patterns: [/\bLiteRT\.js\b/iu] },
  { name: "MacWhisper 14", type: "产品/服务", owners: [], patterns: [/\bMacWhisper 14\b/iu] },
  { name: "Nano Banana", type: "产品/服务", owners: ["Google"], patterns: [/\bNano Banana\b/iu] },
  { name: "Nitrode", type: "产品/服务", owners: [], patterns: [/\bNitrode\b/iu] },
  { name: "Orthogonal Agentic Payments", type: "产品/服务", owners: ["Orthogonal"], patterns: [/\bAgentic Payments for APIs\b/iu] },
  { name: "Qwen-Audio-3.0-Realtime", type: "模型", owners: ["Alibaba"], patterns: [/\bQwen-Audio-3\.0-Realtime\b/iu] },
  { name: "Robostral Navigate", type: "模型", owners: ["Mistral AI"], patterns: [/\bRobostral Navigate\b/iu] },
  { name: "Seedance 2.5", type: "产品/服务", owners: ["Volcano Engine"], patterns: [/\bSeedance 2\.5\b/iu] },
  { name: "Soofi S 30B-A3B", type: "模型", owners: ["Soofi"], patterns: [/\bSoofi S 30B-A3B\b/iu] },
  { name: "SoulX", type: "模型", owners: ["Soul"], patterns: [/\bSoulX\b/iu] },
  { name: "WPS Comate", type: "产品/服务", owners: ["Kingsoft Office"], patterns: [/\bWPS Comate\b/iu] },
  { name: "天工短剧工作台", type: "产品/服务", owners: [], patterns: [/天工短剧工作台/iu] },
  { name: "豆包 AI 智能体手机", type: "AI 硬件", owners: ["ByteDance", "ZTE", "Nubia"], patterns: [/豆包 AI 智能体手机/iu] },
  { name: "灵犀专业版", type: "产品/服务", owners: ["Kingsoft Office"], patterns: [/灵犀专业版/iu] },
  { name: "水风光一体化智慧运营大模型", type: "模型", owners: [], patterns: [/水风光一体化智慧运营大模型/iu] },
  { name: "启元 T1", type: "AI 硬件", owners: ["上纬新材"], patterns: [/启元 T1/iu] }
];

function extractNamedProducts(...values) {
  const text = values.filter(Boolean).join(" ");
  return namedProductRules
    .filter((rule) => rule.patterns.some((pattern) => pattern.test(text)))
    .map((rule) => ({ name: rule.name, type: rule.type, ownerNames: rule.owners }));
}

export function isCompletePublicEventTitle(value = "") {
  return isCompleteDataTitle(value);
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function buildEventRecords({ events, claims, rawDocuments, sourceArtifacts, entities, tagAssertions, facetAssertions, tagNames, facetNames }) {
  const claimsById = new Map(claims.map((item) => [item.claim_id, item]));
  const rawById = new Map(rawDocuments.map((item) => [item.raw_id, item]));
  const sourceById = new Map(sourceArtifacts.map((item) => [item.source_artifact_id, item]));
  const entityById = new Map(entities.map((item) => [item.entity_id, item]));
  const tagsByClaim = new Map();
  const facetsByClaim = new Map();

  for (const assertion of tagAssertions) {
    if (assertion.status && assertion.status !== "active") continue;
    const claimId = assertion.asset_id || assertion.evidence_ref;
    if (!tagsByClaim.has(claimId)) tagsByClaim.set(claimId, []);
    tagsByClaim.get(claimId).push(assertion.tag_id);
  }
  for (const assertion of facetAssertions) {
    if (assertion.status && assertion.status !== "active") continue;
    const claimId = assertion.asset_id || assertion.evidence_ref;
    if (!facetsByClaim.has(claimId)) facetsByClaim.set(claimId, []);
    facetsByClaim.get(claimId).push({
      dimensionId: assertion.dimension_id,
      id: assertion.value_id
    });
  }

  return events.map((event) => {
    const eventClaims = safeArray(event.claim_refs).map((id) => claimsById.get(id)).filter(Boolean);
    const primaryClaim = eventClaims[0] || null;
    const rawCandidates = unique(eventClaims.map((claim) => claim.raw_id))
      .map((id) => rawById.get(id))
      .filter(Boolean);
    const primaryRaw = rawCandidates.find((item) => item.title_zh)
      || rawCandidates.find((item) => item.title_original)
      || null;
    const sources = safeArray(event.source_refs).map((id) => sourceById.get(id)).filter(Boolean);
    const primarySource = sources[0] || null;
    const assertedTagIds = unique(safeArray(event.claim_refs).flatMap((id) => tagsByClaim.get(id) || []));
    const assertedFacets = safeArray(event.claim_refs)
      .flatMap((id) => facetsByClaim.get(id) || [])
      .filter((item, index, list) => list.findIndex((entry) => entry.dimensionId === item.dimensionId && entry.id === item.id) === index)
      .map((item) => ({
        ...item,
        dimensionName: facetNames.get(item.dimensionId)?.name || item.dimensionId,
        name: facetNames.get(item.dimensionId)?.values.get(item.id) || item.id
      }));
    const technicalTags = assertedTagIds.map((id) => ({
      dimensionId: "technology",
      dimensionName: "技术",
      id,
      name: tagNames.get(id) || id
    }));
    const classifications = [...technicalTags, ...assertedFacets];
    const eventEntities = safeArray(event.entities).map((id) => entityById.get(id)).filter(Boolean);
    const label = eventTypeLabels[event.event_type] || { exact: event.event_type, group: event.event_type };
    const originalTitle = compactText(primaryRaw?.title_original || "", 180);
    const translatedTitle = compactText(primaryRaw?.title_zh || "", 180);
    const products = [
      "model_release",
      "product_release",
      "service_change",
      "pricing_change",
      "hardware_product"
    ].includes(event.event_type) ? extractNamedProducts(
      translatedTitle,
      originalTitle,
      event.object,
      ...eventClaims.map((claim) => claim.source_quote)
    ) : [];
    const title = compactText(event.display_title_zh || "", 180)
      || translatedTitle
      || (containsChinese(originalTitle) ? originalTitle : "")
      || event.event_id;

    return {
      id: event.event_id,
      dataDate: event.data_date,
      date: sourceDateOnly(event.event_time || event.disclosed_at || event.data_date),
      updatedDate: sourceDateOnly(primaryRaw?.updated_at || event.disclosed_at || event.data_date),
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
      missingFields: safeArray(event.missing_fields),
      conflicts: safeArray(event.conflicts),
      tags: technicalTags,
      facets: Object.fromEntries([...facetNames.keys()].map((dimensionId) => [
        dimensionId,
        assertedFacets.filter((item) => item.dimensionId === dimensionId)
      ])),
      classifications,
      displayTags: [
        ...assertedFacets.filter((item) => item.dimensionId === "product_form"),
        ...assertedFacets.filter((item) => item.dimensionId === "use_case"),
        ...technicalTags,
        ...assertedFacets.filter((item) => !["product_form", "use_case"].includes(item.dimensionId))
      ],
      entityIds: safeArray(event.entities),
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
        publisher: source.publisher || "",
        url: source.canonical_url || source.source_url || ""
      })),
      sourceUrl: primarySource?.canonical_url || primarySource?.source_url || primaryRaw?.canonical_url || primaryRaw?.source_url || "",
      publisher: primarySource?.publisher || primaryRaw?.publisher || "",
      sourceExcerpt: compactText(primaryClaim?.source_quote || "", 700)
    };
  }).sort((a, b) => b.date.localeCompare(a.date) || b.updatedDate.localeCompare(a.updatedDate) || a.id.localeCompare(b.id));
}

function buildCompanies(entityRows, eventRecords) {
  const eventsByEntity = new Map();
  for (const event of eventRecords) {
    for (const entityId of event.entityIds) {
      if (!eventsByEntity.has(entityId)) eventsByEntity.set(entityId, []);
      eventsByEntity.get(entityId).push(event);
    }
  }

  return entityRows.filter((entity) => entity.verification_status === "verified").map((entity) => {
    const relatedEvents = eventsByEntity.get(entity.entity_id) || [];
    return {
      id: entity.entity_id,
      name: entity.canonical_name || entity.entity_id,
      type: "公司/机构",
      sourceType: entity.entity_type || "",
      aliases: safeArray(entity.aliases),
      tags: unique(relatedEvents.flatMap((event) => event.tags.map((tag) => tag.name))).slice(0, 5),
      eventIds: relatedEvents.map((event) => event.id),
      productIds: []
    };
  }).filter((item) => item.name && item.eventIds.length > 0).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

function buildProducts(eventRecords, companies) {
  const companyById = new Map(companies.map((item) => [item.id, item]));
  const companyByName = new Map(companies.map((item) => [item.name.toLocaleLowerCase(), item]));
  const products = new Map();

  for (const event of eventRecords) {
    for (const productDefinition of safeArray(event.products)) {
      const id = stableId("PD", productDefinition.name.toLowerCase());
      if (!products.has(id)) {
        products.set(id, {
          id,
          name: productDefinition.name,
          companyIds: [],
          companyNames: [],
          type: productDefinition.type,
          tags: [],
          eventIds: []
        });
      }
      const product = products.get(id);
      const owners = safeArray(productDefinition.ownerNames)
        .map((name) => companyByName.get(name.toLocaleLowerCase()))
        .filter(Boolean);
      product.eventIds.push(event.id);
      product.tags.push(...event.tags.map((tag) => tag.name));
      product.companyIds.push(...owners.map((item) => item.id));
      product.companyNames.push(...safeArray(productDefinition.ownerNames));
    }
  }

  for (const product of products.values()) {
    product.eventIds = unique(product.eventIds);
    product.tags = unique(product.tags).slice(0, 5);
    product.companyIds = unique(product.companyIds);
    product.companyNames = unique(product.companyNames);
    for (const companyId of product.companyIds) {
      const company = companyById.get(companyId);
      if (company) company.productIds.push(product.id);
    }
  }

  for (const company of companies) company.productIds = unique(company.productIds);
  return [...products.values()].sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

function buildFdeRecords(rows, eventsById) {
  return rows.map((row) => {
    const event = eventsById.get(row.event_id);
    return {
      id: row.fde_id,
      eventId: row.event_id,
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
  }).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

function buildHardwareRecords(rows, eventsById) {
  return rows.map((row) => {
    const event = eventsById.get(row.event_id);
    return {
      id: row.hardware_record_id,
      eventId: row.event_id,
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
  }).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
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

function buildViewpoints(root) {
  const file = path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json");
  const data = readJson(file, { meta: {}, remarks: [] });
  return safeArray(data.remarks).map((item, index) => ({
    id: stableId("VP", item.id || item.url || `${item.name}-${index}`),
    date: dateOnly(item.date || item.createdAt),
    title: compactText(item.translation || item.text || "未命名一线观点", 180),
    translatedContent: compactText(item.contentTranslation || item.translation || "", 2200),
    originalContent: compactText(item.content || item.text || "", 2200),
    person: item.name || item.handle || "未披露",
    handle: item.handle || "",
    role: item.role || "未披露",
    organization: item.organization || item.name || "未披露",
    tags: unique(safeArray(item.columnTags).map((tag) => tag.name || tag.id).concat(item.topic || [])).slice(0, 5),
    sourceUrl: item.url || item.id || ""
  })).sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
}

export function buildFrontstageData(root = defaultRoot) {
  const tables = path.join(root, "data-lake/tables");
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

  const eventRecords = buildEventRecords({
    events: readJsonl(path.join(tables, "canonical_events.jsonl")),
    claims: readJsonl(path.join(tables, "claims.jsonl")),
    rawDocuments: readJsonl(path.join(tables, "raw_documents.jsonl")),
    sourceArtifacts: readJsonl(path.join(tables, "source_artifacts.jsonl")),
    entities: readJsonl(path.join(tables, "entities.jsonl")),
    tagAssertions: readJsonl(path.join(tables, "tag_assertions.jsonl")),
    facetAssertions: readJsonl(path.join(tables, "facet_assertions.jsonl")),
    tagNames,
    facetNames
  });
  const latestDataDate = eventRecords.map((item) => item.dataDate).filter(Boolean).sort().at(-1) || "";
  const currentDate = latestDataDate;
  const invalidTitles = eventRecords.filter((item) => !isCompletePublicEventTitle(item.title));
  if (invalidTitles.length) {
    throw new Error(`Frontstage event title gate failed: ${invalidTitles.map((item) => `${item.id}:${item.title}`).join("; ")}`);
  }
  const companies = buildCompanies(readJsonl(path.join(tables, "entities.jsonl")), eventRecords);
  const products = buildProducts(eventRecords, companies);
  const eventsById = new Map(eventRecords.map((item) => [item.id, item]));

  return {
    meta: {
      productVersion: "SITE-V4.0-data-center-frontstage-v1.0",
      dataVersion: "SITE-V4.0-data-center",
      generatedAt: new Date().toISOString(),
      latestDataDate,
      currentDate,
      eventCount: eventRecords.length
    },
    eventTypes: eventTypeLabels,
    events: eventRecords,
    companies,
    products,
    fde: buildFdeRecords(readJsonl(path.join(tables, "fde_records.jsonl")), eventsById),
    hardware: buildHardwareRecords(readJsonl(path.join(tables, "hardware_records.jsonl")), eventsById),
    community: buildCommunity(root),
    viewpoints: buildViewpoints(root)
  };
}

export function writeFrontstageData(root = defaultRoot) {
  const data = buildFrontstageData(root);
  const output = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return { output, data };
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
      fde: data.fde.length,
      hardware: data.hardware.length,
      community: data.community.length,
      viewpoints: data.viewpoints.length
    }
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) main();
