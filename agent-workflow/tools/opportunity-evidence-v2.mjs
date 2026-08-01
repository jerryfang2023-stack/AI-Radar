#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(__dirname, "../..");
const mapFields = [
  "buyer_or_user",
  "team_or_function",
  "specific_task",
  "pain_or_constraint",
  "product_form",
  "delivery_model",
  "business_action",
];
const acceptedEventStates = new Set(["verified", "partial", "disputed"]);
const acceptedClaimStates = new Set(["accepted"]);
const eventCategory = new Map([
  ["funding", "funding"],
  ["capital_investment", "funding"],
  ["deployment", "case"],
  ["procurement_contract", "case"],
  ["partnership", "case"],
  ["market_expansion", "case"],
  ["certification_compliance", "case"],
  ["product_release", "product-service"],
  ["model_release", "product-service"],
  ["service_change", "product-service"],
  ["pricing_change", "product-service"],
  ["hardware_product", "product-service"],
  ["research_result", "product-service"],
  ["standard_specification", "product-service"],
  ["security_incident", "product-service"],
]);
const businessActionByEventType = new Map([
  ["product_release", "product_launch"],
  ["model_release", "product_launch"],
  ["hardware_product", "product_launch"],
  ["service_change", "product_launch"],
  ["deployment", "customer_deployment"],
  ["funding", "funding_round"],
  ["capital_investment", "funding_round"],
  ["partnership", "partnership_integration"],
  ["procurement_contract", "procurement_signal"],
  ["pricing_change", "pricing_change"],
  ["acquisition", "acquisition"],
  ["research_result", "research_benchmark"],
  ["policy_regulation", "governance_requirement"],
  ["certification_compliance", "governance_requirement"],
  ["standard_specification", "governance_requirement"],
  ["security_incident", "failure_postmortem"],
]);
const facetMappings = {
  target_user: {
    developer: [
      ["buyer_or_user", "engineering_team"],
      ["team_or_function", "engineering"],
    ],
    enterprise: [["buyer_or_user", "enterprise_ai_owner"]],
    government: [
      ["buyer_or_user", "procurement_team"],
      ["team_or_function", "procurement"],
    ],
  },
  use_case: {
    software_development: [["specific_task", "internal_tool_building"]],
    customer_support: [
      ["buyer_or_user", "customer_support_team"],
      ["team_or_function", "customer_support"],
      ["specific_task", "customer_ticket_triage"],
    ],
    sales: [
      ["buyer_or_user", "sales_team"],
      ["team_or_function", "sales"],
      ["specific_task", "sales_lead_research"],
    ],
    marketing: [
      ["buyer_or_user", "sales_team"],
      ["team_or_function", "sales"],
      ["specific_task", "content_workflow"],
    ],
    content_creation: [
      ["buyer_or_user", "content_team"],
      ["team_or_function", "marketing_content"],
      ["specific_task", "content_workflow"],
    ],
    knowledge_search: [["specific_task", "knowledge_base_qa"]],
    data_analysis: [["specific_task", "data_analysis_query"]],
    security_operations: [
      ["buyer_or_user", "it_security_team"],
      ["team_or_function", "it_security"],
      ["specific_task", "permission_audit"],
      ["pain_or_constraint", "security_compliance"],
    ],
  },
  product_form: {
    developer_tool: [["product_form", "developer_tool"]],
    model_api_service: [["product_form", "api"]],
    enterprise_software_platform: [["product_form", "workflow_automation"]],
  },
};
const claimRules = [
  ["buyer_or_user", "engineering_team", /开发者|工程师|研发|developer|engineering/iu],
  ["team_or_function", "engineering", /开发者|工程师|研发|developer|engineering/iu],
  ["buyer_or_user", "it_security_team", /安全团队|安全工程师|security team|cybersecurity/iu],
  ["team_or_function", "it_security", /安全团队|安全工程师|security team|cybersecurity/iu],
  ["buyer_or_user", "customer_support_team", /客服|联络中心|客户支持|contact center|customer support/iu],
  ["team_or_function", "customer_support", /客服|联络中心|客户支持|contact center|customer support/iu],
  ["buyer_or_user", "sales_team", /销售团队|销售人员|sales team|sales rep/iu],
  ["team_or_function", "sales", /销售团队|销售人员|sales team|sales rep/iu],
  ["specific_task", "internal_tool_building", /编程|编码|软件开发|代码|developer|coding|software development/iu],
  ["specific_task", "customer_ticket_triage", /客服|工单|联络中心|customer support|contact center|ticket/iu],
  ["specific_task", "knowledge_base_qa", /知识库|检索|搜索|knowledge base|retrieval|search/iu],
  ["specific_task", "cost_monitoring", /成本|定价|价格|Token|token|cost|pricing/iu],
  ["specific_task", "permission_audit", /权限|审计|漏洞|安全|permission|audit|vulnerability|security/iu],
  ["specific_task", "data_analysis_query", /数据分析|查询|analytics|data analysis|query/iu],
  ["pain_or_constraint", "api_cost_spike", /成本|定价|价格|Token|token|cost|pricing/iu],
  ["pain_or_constraint", "model_routing_complexity", /模型路由|模型切换|router|routing|switching models/iu],
  ["pain_or_constraint", "permission_boundary", /权限|未经认证|任意文件|permission|unauthenticated|arbitrary files/iu],
  ["pain_or_constraint", "audit_log_required", /审计|日志|audit|logging/iu],
  ["pain_or_constraint", "security_compliance", /安全|合规|漏洞|security|compliance|vulnerability/iu],
  ["pain_or_constraint", "latency_sensitive", /延迟|实时|latency|real-time/iu],
  ["pain_or_constraint", "evaluation_gap", /评测|评估|基准|evaluation|benchmark/iu],
  ["product_form", "model_gateway", /模型路由|模型网关|router|model gateway/iu],
  ["product_form", "developer_tool", /开发者工具|编程工具|developer tool|coding tool/iu],
  ["product_form", "api", /\bAPI\b|接口/iu],
  ["product_form", "workflow_automation", /工作流|自动化|workflow|automation/iu],
  ["delivery_model", "open_source_commercial", /开源|open source/iu],
  ["delivery_model", "api_usage_based", /\bAPI\b|按量|usage-based/iu],
  ["delivery_model", "enterprise_subscription", /企业版|企业订阅|enterprise subscription/iu],
  ["delivery_model", "managed_service", /托管服务|managed service/iu],
];

function readJson(file, fallback = []) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function dateDistance(later, earlier) {
  const end = Date.parse(`${later}T00:00:00Z`);
  const start = Date.parse(`${earlier}T00:00:00Z`);
  return Number.isFinite(end) && Number.isFinite(start)
    ? Math.floor((end - start) / 86_400_000)
    : Number.POSITIVE_INFINITY;
}

function sourceName(sourceUrl = "") {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./u, "");
  } catch {
    return "";
  }
}

function categoryLabel(category) {
  return {
    "product-service": "产品",
    funding: "融资",
    case: "案例",
  }[category] || "";
}

function dailyDirectories(root, asOf = "", windowDays = 30) {
  const base = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
  if (!fs.existsSync(base)) return { activeDate: "", directories: [] };
  const dates = fs.readdirSync(base, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort();
  const activeDate = asOf || dates.at(-1) || "";
  return {
    activeDate,
    directories: dates
      .filter((date) => dateDistance(activeDate, date) >= 0 && dateDistance(activeDate, date) < windowDays)
      .map((date) => ({ date, dir: path.join(base, date) })),
  };
}

function aggregateV4(root, options = {}) {
  const { activeDate, directories } = dailyDirectories(root, options.asOf, options.windowDays || 30);
  const maps = Object.fromEntries([
    "events", "claims", "sources", "entities", "rawDocuments", "facets",
  ].map((name) => [name, new Map()]));
  for (const { date, dir } of directories) {
    for (const event of readJson(path.join(dir, "canonical-events.json"))) {
      maps.events.set(event.event_id, { ...event, data_date: date });
    }
    for (const claim of readJson(path.join(dir, "claims.json"))) maps.claims.set(claim.claim_id, claim);
    for (const source of readJson(path.join(dir, "source-artifacts.json"))) maps.sources.set(source.source_artifact_id, source);
    for (const entity of readJson(path.join(dir, "entities.json"))) maps.entities.set(entity.entity_id, entity);
    for (const raw of readJson(path.join(dir, "raw-documents.json"))) maps.rawDocuments.set(raw.raw_id, raw);
    for (const facet of readJson(path.join(dir, "facet-assertions.json"))) {
      maps.facets.set(`${facet.asset_id}|${facet.dimension_id}|${facet.value_id}`, facet);
    }
  }
  return { activeDate, ...maps };
}

function assertionKey(assertion) {
  return assertion.value_id;
}

function addAssertion(target, field, valueId, claim, sourceRefs, provenance) {
  if (!mapFields.includes(field) || !valueId || !claim?.claim_id) return;
  const rawSource = sourceRefs(claim);
  const assertion = {
    value_id: valueId,
    claim_ref: claim.claim_id,
    source_refs: rawSource,
    provenance,
  };
  const current = target[field];
  if (!current.some((item) => assertionKey(item) === assertionKey(assertion))) current.push(assertion);
}

function applicationAssertions(event, claims, facets, rawDocuments, publicSourceRefs) {
  const target = Object.fromEntries(mapFields.map((field) => [field, []]));
  const eventSourceRefs = [...new Set(publicSourceRefs || [])];
  const sourceRefs = (claim) => {
    const sourceId = rawDocuments.get(claim.raw_id)?.source_artifact_id || "";
    return sourceId && eventSourceRefs.includes(sourceId) ? [sourceId] : eventSourceRefs;
  };
  const primaryClaim = claims[0];
  const action = businessActionByEventType.get(event.event_type);
  if (action && primaryClaim) addAssertion(target, "business_action", action, primaryClaim, sourceRefs, "event_type_rule");

  const claimById = new Map(claims.map((claim) => [claim.claim_id, claim]));
  for (const facet of facets) {
    const claim = claimById.get(facet.evidence_ref || facet.asset_id);
    if (!claim) continue;
    for (const [field, valueId] of facetMappings[facet.dimension_id]?.[facet.value_id] || []) {
      addAssertion(target, field, valueId, claim, sourceRefs, "v4_facet_projection");
    }
  }
  for (const claim of claims) {
    const text = `${claim.subject || ""} ${claim.predicate || ""} ${claim.object || ""} ${claim.source_quote || ""}`;
    for (const [field, valueId, pattern] of claimRules) {
      if (pattern.test(text)) addAssertion(target, field, valueId, claim, sourceRefs, "exact_claim_rule");
    }
  }
  return target;
}

function buildEvidenceRecords(root, options = {}) {
  const aggregate = aggregateV4(root, options);
  const records = [];
  for (const event of aggregate.events.values()) {
    const category = eventCategory.get(event.event_type);
    if (!category || !acceptedEventStates.has(event.publication_status)) continue;
    const claims = [...new Set(event.claim_refs || [])]
      .map((id) => aggregate.claims.get(id))
      .filter((claim) => claim && acceptedClaimStates.has(claim.verification_status));
    if (!claims.length) continue;
    const sources = [...new Set(event.source_refs || [])]
      .map((id) => aggregate.sources.get(id))
      .filter(Boolean);
    const publicSources = sources.filter((source) => source.source_url);
    if (!publicSources.length) continue;
    const entities = [...new Set(event.entities || [])]
      .map((id) => aggregate.entities.get(id))
      .filter(Boolean);
    const facets = [...aggregate.facets.values()]
      .filter((facet) => claims.some((claim) => claim.claim_id === facet.evidence_ref || claim.claim_id === facet.asset_id))
      .filter((facet) => facet.status === "active");
    const assertions = applicationAssertions(
      event,
      claims,
      facets,
      aggregate.rawDocuments,
      publicSources.map((source) => source.source_artifact_id),
    );
    const subject = entities.find((entity) => entity.entity_type === "organization_candidate")?.canonical_name
      || entities[0]?.canonical_name
      || publicSources[0].publisher
      || sourceName(publicSources[0].source_url);
    records.push({
      id: event.event_id,
      event_id: event.event_id,
      event_type: event.event_type,
      publication_status: event.publication_status,
      title: event.display_title_zh || `${event.action || ""} ${event.object || ""}`.trim(),
      category,
      categoryLabel: categoryLabel(category),
      date: event.data_date,
      event_time: event.event_time || "",
      sourceUrl: publicSources[0].source_url,
      sourceName: publicSources[0].publisher || sourceName(publicSources[0].source_url),
      subject,
      sourceExcerpt: claims[0].source_quote,
      entity_refs: entities.map((entity) => ({
        entity_id: entity.entity_id,
        canonical_name: entity.canonical_name,
        entity_type: entity.entity_type,
        verification_status: entity.verification_status,
      })),
      claim_refs: claims.map((claim) => claim.claim_id),
      source_refs: publicSources.map((source) => source.source_artifact_id),
      application_assertions: assertions,
      opportunitySignals: {
        labels: Object.fromEntries(mapFields.map((field) => [
          field,
          [...new Set(assertions[field].map((assertion) => assertion.value_id))],
        ])),
      },
    });
  }
  return {
    activeDate: aggregate.activeDate,
    records: records.sort((left, right) => (
      right.date.localeCompare(left.date)
      || left.category.localeCompare(right.category)
      || left.event_id.localeCompare(right.event_id)
    )),
  };
}

function readDirectionCards(file) {
  if (!file || !fs.existsSync(file)) return { schema_version: "direction-cards-v3", cards: [] };
  return readJson(file, { schema_version: "direction-cards-v3", cards: [] });
}

function resolveDirectionCards(file, evidence) {
  const config = readDirectionCards(file);
  const evidenceById = new Map(evidence.map((item) => [item.event_id, item]));
  return (config.cards || []).flatMap((direction) => {
    const resolved = (direction.evidence_refs || []).flatMap((reference) => {
      const item = evidenceById.get(reference.event_id);
      if (!item) return [];
      const claimRefs = [...new Set(reference.claim_refs || [])];
      const sourceRefs = [...new Set(reference.source_refs || [])];
      if (
        !claimRefs.length
        || !sourceRefs.length
        || claimRefs.some((id) => !item.claim_refs.includes(id))
        || sourceRefs.some((id) => !item.source_refs.includes(id))
      ) return [];
      return [{
        id: item.event_id,
        eventId: item.event_id,
        claimRefs,
        sourceRefs,
        title: item.title,
        category: item.category,
        categoryLabel: item.categoryLabel,
        date: item.date,
        sourceUrl: item.sourceUrl,
        sourceName: item.sourceName,
        subject: item.subject,
        sourceExcerpt: item.sourceExcerpt,
      }];
    });
    const minimum = Number(direction.minimum_evidence || 2);
    if (!direction.id || !direction.title || resolved.length < minimum) return [];
    return [{
      id: direction.id,
      title: direction.title,
      judgment: direction.judgment || "",
      hypothesis: direction.hypothesis || "",
      status: direction.status,
      buyer: direction.buyer || "",
      task: direction.task || "",
      pain: direction.pain || "",
      productWedge: direction.product_wedge || "",
      currentAlternatives: direction.current_alternatives || "",
      whyNow: direction.why_now || "",
      counterSignal: direction.counter_signal || "",
      unknowns: direction.unknowns || [],
      validationAction: direction.validation_action || "",
      reviewedAt: direction.reviewed_at || "",
      evidenceCount: resolved.length,
      actorCount: new Set(resolved.map((item) => item.subject).filter(Boolean)).size,
      evidence: resolved,
    }];
  });
}

export function buildOpportunityEvidenceData(
  root = defaultRoot,
  {
    asOf = "",
    windowDays = 30,
    directionFile = path.join(root, "agent-workflow/product/opportunity-direction-cards.json"),
  } = {},
) {
  const { activeDate, records } = buildEvidenceRecords(root, { asOf, windowDays });
  const directionCards = resolveDirectionCards(directionFile, records);
  return {
    meta: {
      schemaVersion: "OPPORTUNITY-EVIDENCE-V2.0",
      siteVersion: "SITE-V4.2.0-entity-history",
      applicationVersion: "OMAP-V2.0.0-v4-evidence",
      opportunityMapVersion: "OMAP-V2.0.0-v4-evidence",
      directionCardVersion: "DIRECTION-CARD-V2.0-v4-evidence",
      activeDate,
      generatedAt: activeDate ? `${activeDate}T00:00:00.000Z` : "",
      windowDays,
      evidenceCount: records.length,
      directionCardCount: directionCards.length,
      sourceAdapter: "data-center-v4-canonical",
    },
    evidence: records,
    directionCards,
  };
}

export function opportunityEvidenceProblems(data = {}) {
  const problems = [];
  if (data.meta?.schemaVersion !== "OPPORTUNITY-EVIDENCE-V2.0") problems.push("schema_version_invalid");
  if (data.meta?.sourceAdapter !== "data-center-v4-canonical") problems.push("source_adapter_invalid");
  if (!Array.isArray(data.evidence) || !data.evidence.length) problems.push("evidence_missing");
  for (const item of data.evidence || []) {
    if (!item.event_id || !item.title || !item.date) problems.push(`${item.event_id || "unknown"}:identity_missing`);
    if (!item.claim_refs?.length || !item.source_refs?.length) problems.push(`${item.event_id}:evidence_refs_missing`);
    if (!item.sourceUrl || !item.sourceExcerpt) problems.push(`${item.event_id}:public_source_missing`);
    for (const field of mapFields) {
      for (const assertion of item.application_assertions?.[field] || []) {
        if (!assertion.claim_ref || !assertion.source_refs?.length) {
          problems.push(`${item.event_id}:${field}:${assertion.value_id || "unknown"}:assertion_evidence_missing`);
        }
      }
    }
  }
  for (const direction of data.directionCards || []) {
    if (direction.evidence.length < 2) problems.push(`${direction.id}:direction_evidence_insufficient`);
    if (direction.evidence.some((item) => !item.claimRefs?.length || !item.sourceRefs?.length)) {
      problems.push(`${direction.id}:direction_evidence_refs_missing`);
    }
  }
  return [...new Set(problems)];
}

export function writeOpportunityEvidenceData(root = defaultRoot, options = {}) {
  const data = buildOpportunityEvidenceData(root, options);
  const problems = opportunityEvidenceProblems(data);
  if (problems.length) throw new Error(`Opportunity Evidence V2 gate failed: ${problems.join(", ")}`);
  const output = path.join(root, "01-SiteV2/site/data/opportunity-evidence-v2.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  return { output, data };
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const args = new Map(process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }));
  const root = args.get("root") ? path.resolve(args.get("root")) : defaultRoot;
  const { output, data } = writeOpportunityEvidenceData(root, {
    asOf: args.get("date") || "",
    windowDays: Number(args.get("window-days") || 30),
  });
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(root, output).replace(/\\/gu, "/"),
    activeDate: data.meta.activeDate,
    evidence: data.evidence.length,
    directionCards: data.directionCards.length,
  }, null, 2));
}
