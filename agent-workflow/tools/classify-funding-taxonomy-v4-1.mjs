#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { deepSeekJsonCompletion, deepSeekModels, sourceTextHash } from "./deepseek-translation-client.mjs";

const root = process.cwd();
const fundingRoot = path.join(root, "01-SiteV2", "content", "12-applications", "funding-insights");
const taxonomyPath = path.join(root, "agent-workflow", "product", "tag-taxonomy-v4.json");
const decisionPath = path.join(fundingRoot, "taxonomy-decisions-v4-1.json");
const overridePath = path.join(fundingRoot, "taxonomy-overrides-v4-1.json");
const reportPath = path.join(root, "agent-workflow", "reports", "funding-taxonomy-v4-1-review.json");
const checkpointPath = path.join(root, "agent-workflow", "reports", "funding-taxonomy-v4-1-checkpoint.json");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const write = args.get("write") === "true";
const apply = args.get("apply") === "true";
const batchSize = Math.max(1, Math.min(10, Number(args.get("batch-size") || 6)));
const concurrency = Math.max(1, Math.min(4, Number(args.get("concurrency") || 3)));
const configuredModel = args.get("model") || process.env.DEEPSEEK_PRO_MODEL || deepSeekModels().pro;
const promptVersion = "FUNDING-TAXONOMY-V4.1-CB-2026-V1.0";

if (!process.env.DEEPSEEK_PRO_MODEL) process.env.DEEPSEEK_PRO_MODEL = configuredModel;

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, "")); }
  catch { return fallback; }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function datedFiles() {
  return fs.readdirSync(fundingRoot).filter((name) => /^2026-\d{2}-\d{2}\.json$/u.test(name)).sort();
}

function evidenceQuotes(refs = [], limit = 3) {
  return [...new Set((refs || []).map((item) => clean(item?.quote)).filter(Boolean))].slice(0, limit);
}

function cardInput(card) {
  return {
    event_id: card.triggered_by_event_id,
    funding_insight_id: card.funding_insight_id,
    company_name: clean(card.company?.name),
    company_full_name: clean(card.company?.full_name),
    website: clean(card.company?.website),
    current_sector: clean(card.analysis?.sector),
    company_evidence_quotes: evidenceQuotes(card.company?.evidence_refs),
    products: (card.products || []).slice(0, 3).map((product) => ({
      name: clean(product?.name),
      evidence_quotes: evidenceQuotes(product?.evidence_refs, 2),
    })),
    customer_names: (card.customers || []).slice(0, 5).map((customer) => clean(customer?.name)).filter(Boolean),
    current_classification: {
      product_form_id: clean(card.analysis?.product_form_id),
      market_category_id: clean(card.analysis?.market_category_id),
    },
  };
}

function loadEventInputs() {
  const byEvent = new Map();
  for (const file of datedFiles()) {
    const payload = readJson(path.join(fundingRoot, file), {});
    for (const card of payload.cards || []) {
      const item = cardInput(card);
      const score = JSON.stringify(item).length;
      if (!byEvent.has(item.event_id) || score > byEvent.get(item.event_id).score) byEvent.set(item.event_id, { item, score });
    }
  }
  return [...byEvent.values()].map((row) => row.item).sort((a, b) => a.company_name.localeCompare(b.company_name) || a.event_id.localeCompare(b.event_id));
}

function facetIds(taxonomy, facetId) {
  return new Set((taxonomy.facets.find((facet) => facet.id === facetId)?.values || []).map((value) => value.id));
}

const taxonomy = readJson(taxonomyPath, {});
const allowed = {
  category: facetIds(taxonomy, "ai_market_category"),
  subcategory: new Set(["", ...facetIds(taxonomy, "ai_market_subcategory")]),
  application: new Set(["", ...facetIds(taxonomy, "ai_market_application")]),
  product: facetIds(taxonomy, "product_form"),
  useCase: facetIds(taxonomy, "use_case"),
  industry: facetIds(taxonomy, "industry"),
  targetUser: facetIds(taxonomy, "target_user"),
};

const subcategoryParents = {
  data: "infrastructure_compute",
  development_deployment: "infrastructure_compute",
  hardware_computing: "infrastructure_compute",
  observability_evaluation: "infrastructure_compute",
  customer_support: "enterprise_applications",
  cyber_physical_security: "enterprise_applications",
  hr: "enterprise_applications",
  marketing: "enterprise_applications",
  productivity_enterprise_workflows: "enterprise_applications",
  sales: "enterprise_applications",
  software_development_coding: "enterprise_applications",
  financial_services: "industry_applications",
  healthcare_life_sciences: "industry_applications",
  industrials: "industry_applications",
  legal: "industry_applications",
  consumer_retail: "industry_applications",
};

const applicationParents = {
  synthetic_data: "data",
  data_preparation_curation: "data",
  vector_databases: "data",
  models: "development_deployment",
  ai_development_orchestration: "development_deployment",
  model_deployment: "development_deployment",
  monetization: "development_deployment",
  chips: "hardware_computing",
  servers: "hardware_computing",
  computing_infrastructure: "hardware_computing",
  ai_observability_governance: "observability_evaluation",
  model_agent_security: "observability_evaluation",
  fine_tuning: "observability_evaluation",
  llm_benchmarking_routing: "observability_evaluation",
};

function uniqueStrings(values = []) {
  return [...new Set((Array.isArray(values) ? values : []).map(clean).filter(Boolean))];
}

function normalizeHierarchyFields(decision = {}) {
  const application = clean(decision.market_application_id);
  const subcategory = clean(decision.market_subcategory_id);
  const category = clean(decision.market_category_id);
  if (applicationParents[application]) {
    decision.market_subcategory_id = applicationParents[application];
    decision.market_category_id = subcategoryParents[decision.market_subcategory_id];
  } else if (subcategoryParents[subcategory]) {
    decision.market_category_id = subcategoryParents[subcategory];
    if (decision.market_category_id !== "infrastructure_compute") decision.market_application_id = "";
  } else if (category === "physical_ai") {
    decision.market_subcategory_id = "";
    decision.market_application_id = "";
  }
  return decision;
}

function normalizeControlledListFields(decision = {}) {
  for (const [field, ids] of [
    ["use_case_ids", allowed.useCase],
    ["industry_ids", allowed.industry],
    ["target_user_ids", allowed.targetUser],
  ]) {
    if (Array.isArray(decision[field])) {
      decision[field] = uniqueStrings(decision[field]).filter((value) => ids.has(value));
    }
  }
  return decision;
}

function decisionProblems(decision, expectedEventId = "") {
  const problems = [];
  if (clean(decision?.event_id) !== expectedEventId) problems.push(`event_id:${expectedEventId}`);
  if (!allowed.category.has(clean(decision?.market_category_id))) problems.push(`market_category_id:${expectedEventId}`);
  if (!allowed.subcategory.has(clean(decision?.market_subcategory_id))) problems.push(`market_subcategory_id:${expectedEventId}`);
  if (!allowed.application.has(clean(decision?.market_application_id))) problems.push(`market_application_id:${expectedEventId}`);
  if (!allowed.product.has(clean(decision?.product_form_id))) problems.push(`product_form_id:${expectedEventId}`);
  const category = clean(decision?.market_category_id);
  const subcategory = clean(decision?.market_subcategory_id);
  const application = clean(decision?.market_application_id);
  const productForm = clean(decision?.product_form_id);
  if (category === "physical_ai" && (subcategory || application)) problems.push(`physical_hierarchy:${expectedEventId}`);
  if (category === "physical_ai" && productForm !== "robotic_system") problems.push(`physical_product_form:${expectedEventId}`);
  if (productForm === "robotic_system" && category !== "physical_ai") problems.push(`robotic_market_category:${expectedEventId}`);
  if (category !== "physical_ai" && subcategoryParents[subcategory] !== category) problems.push(`subcategory_parent:${expectedEventId}`);
  if (category === "infrastructure_compute" && applicationParents[application] !== subcategory) problems.push(`application_parent:${expectedEventId}`);
  if (category !== "infrastructure_compute" && application) problems.push(`application_not_infrastructure:${expectedEventId}`);
  for (const [field, ids, requireOne] of [
    ["use_case_ids", allowed.useCase, false],
    ["industry_ids", allowed.industry, false],
    ["target_user_ids", allowed.targetUser, true],
  ]) {
    const values = uniqueStrings(decision?.[field]);
    if (requireOne && !values.length) problems.push(`${field}_empty:${expectedEventId}`);
    if (values.some((id) => !ids.has(id))) problems.push(`${field}_unknown:${expectedEventId}`);
  }
  if (!clean(decision?.rationale)) problems.push(`rationale:${expectedEventId}`);
  const confidence = Number(decision?.confidence);
  if (!(confidence >= 0 && confidence <= 1)) problems.push(`confidence:${expectedEventId}`);
  return problems;
}

function modelCorrectionProblems(problems = []) {
  return problems.map((problem) => problem.startsWith("physical_product_form:")
    ? `${problem}:ai_device_must_copy_a_non_physical_hierarchy_tuple`
    : problem);
}

function promptFor(items) {
  return [
    "Classify each supplied AI funding card using the external market taxonomy below. Use only the supplied evidence; do not classify a familiar brand from memory.",
    "The hierarchy is CB Insights AI 100 2026. It is an exclusive market-position hierarchy, separate from product form, use case, industry, and target user.",
    "Choose market category in this order: (1) physical_ai only if the current product senses, decides, and acts in the physical world through robots, vehicles, or autonomous machines; a world model or future robotics plan alone is not Physical AI. (2) infrastructure_compute if the company supplies data, models, development/deployment, hardware/compute, observability/evaluation, or security infrastructure to builders of other AI products. (3) industry_applications if the product is built around one industry's specialist data, regulation, or workflow. (4) otherwise enterprise_applications for cross-industry business functions.",
    "Allowed hierarchy: infrastructure_compute > data > synthetic_data|data_preparation_curation|vector_databases; infrastructure_compute > development_deployment > models|ai_development_orchestration|model_deployment|monetization; infrastructure_compute > hardware_computing > chips|servers|computing_infrastructure; infrastructure_compute > observability_evaluation > ai_observability_governance|model_agent_security|fine_tuning|llm_benchmarking_routing.",
    "Enterprise subcategories: customer_support, cyber_physical_security, hr, marketing, productivity_enterprise_workflows, sales, software_development_coding. Industry subcategories: financial_services, healthcare_life_sciences, industrials, legal, consumer_retail. Physical AI has empty subcategory and application. Non-infrastructure categories have empty application.",
    "Product form describes what a customer directly buys: model, model_api_service, developer_tool, end_user_application, enterprise_software_platform, ai_infrastructure_software, security_software, ai_device, robotic_system, chip_accelerator, ai_compute_system, compute_cloud_service.",
    "Use cases must come from: software_development, customer_support, sales, marketing, content_creation, knowledge_search, data_analysis, research_discovery, education_learning, security_operations, productivity_enterprise_workflows, physical_automation, hr_workforce, finance_accounting, legal_compliance, procurement_supply_chain, design_engineering. Include every supported value and do not add a generic default.",
    "Industries must come from: financial_services, healthcare_life_sciences, retail_ecommerce, manufacturing, media_entertainment, education, government_public_sector, energy_utilities, telecommunications, automotive_transportation, professional_services, construction_real_estate, food_hospitality, aerospace_defense, agriculture, logistics_supply_chain, legal_services. Include every supported value. Do not use a technology/software industry default.",
    "Target users must come from: developer, business_user, consumer, public_sector_user, researcher, educator, student. Include every supported value and at least one.",
    "Return one JSON object only. Include exactly one decision per input event_id, in input order. Rationale must be concise Simplified Chinese and explain the evidence-backed category boundary, not repeat labels. Confidence is 0 to 1. Set needs_review true when the evidence cannot resolve the primary product or hierarchy.",
    "Schema: {\"decisions\":[{\"event_id\":string,\"market_category_id\":string,\"market_subcategory_id\":string,\"market_application_id\":string,\"product_form_id\":string,\"use_case_ids\":string[],\"industry_ids\":string[],\"target_user_ids\":string[],\"confidence\":number,\"needs_review\":boolean,\"rationale\":string}]}",
    `FUNDING_CARDS:\n${JSON.stringify(items)}`,
  ].join("\n\n");
}

function strictSinglePrompt(item) {
  const hierarchyTuples = [
    ...Object.entries(applicationParents).map(([application, subcategory]) => ["infrastructure_compute", subcategory, application]),
    ...Object.entries(subcategoryParents)
      .filter(([, category]) => category !== "infrastructure_compute")
      .map(([subcategory, category]) => [category, subcategory, ""]),
    ["physical_ai", "", ""],
  ];
  return [
    "Classify this one funding card. For the three market fields, copy exactly one complete tuple from ALLOWED_HIERARCHY_TUPLES. Do not alter, translate, shorten, or invent any tuple value.",
    "Physical AI requires a current robot, vehicle, or autonomous machine acting in the physical world. A model or future plan is not enough.",
    "An AI interface, wearable, headset, or other user-operated AI device is ai_device, never physical_ai; copy a valid non-physical hierarchy tuple for it.",
    `ALLOWED_HIERARCHY_TUPLES:${JSON.stringify(hierarchyTuples)}`,
    `ALLOWED_PRODUCT_FORMS:${JSON.stringify([...allowed.product])}`,
    `ALLOWED_USE_CASES:${JSON.stringify([...allowed.useCase])}`,
    `ALLOWED_INDUSTRIES:${JSON.stringify([...allowed.industry])}`,
    `ALLOWED_TARGET_USERS:${JSON.stringify([...allowed.targetUser])}`,
    "Return JSON only: {\"decisions\":[{\"event_id\":string,\"market_category_id\":string,\"market_subcategory_id\":string,\"market_application_id\":string,\"product_form_id\":string,\"use_case_ids\":string[],\"industry_ids\":string[],\"target_user_ids\":string[],\"confidence\":number,\"needs_review\":boolean,\"rationale\":string}]}",
    `CARD:${JSON.stringify(item)}`,
  ].join("\n\n");
}

async function classifySingleStrict(item) {
  return deepSeekJsonCompletion({
    messages: [
      { role: "system", content: "Return one valid JSON object and copy one allowed tuple exactly." },
      { role: "user", content: strictSinglePrompt(item) },
    ],
    model: configuredModel,
    maxTokens: 1800,
    temperature: 0,
    timeoutMs: 120000,
    validate(payload) {
      const decisions = Array.isArray(payload?.decisions) ? payload.decisions : [];
      if (decisions.length !== 1) return [`decision_count:${decisions.length}/1`];
      normalizeHierarchyFields(decisions[0]);
      normalizeControlledListFields(decisions[0]);
      return modelCorrectionProblems(decisionProblems(decisions[0], item.event_id));
    },
  });
}

async function classifyBatch(items) {
  try {
    return await deepSeekJsonCompletion({
      messages: [
        { role: "system", content: "You are a precise market-taxonomy analyst. Return valid JSON only and never invent a label outside the allowed lists." },
        { role: "user", content: promptFor(items) },
      ],
      model: configuredModel,
      maxTokens: 6000,
      temperature: 0,
      timeoutMs: 120000,
      validate(payload) {
        const decisions = Array.isArray(payload?.decisions) ? payload.decisions : [];
        const problems = decisions.length === items.length ? [] : [`decision_count:${decisions.length}/${items.length}`];
        for (const [index, item] of items.entries()) {
          normalizeHierarchyFields(decisions[index]);
          normalizeControlledListFields(decisions[index]);
          problems.push(...decisionProblems(decisions[index], item.event_id));
        }
        return modelCorrectionProblems(problems);
      },
    });
  } catch (error) {
    if (items.length === 1) return classifySingleStrict(items[0]);
    const midpoint = Math.ceil(items.length / 2);
    const [left, right] = await Promise.all([
      classifyBatch(items.slice(0, midpoint)),
      classifyBatch(items.slice(midpoint)),
    ]);
    return {
      payload: { decisions: [...left.payload.decisions, ...right.payload.decisions] },
      provider: "deepseek",
      model: [...new Set([left.model, right.model])].join("+"),
      attempts: left.attempts + right.attempts,
      generatedAt: new Date().toISOString(),
    };
  }
}

async function runPool(batches, onResult = () => {}) {
  const results = new Array(batches.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, batches.length) }, async () => {
    while (next < batches.length) {
      const index = next;
      next += 1;
      process.stderr.write(`classifying batch ${index + 1}/${batches.length}\n`);
      results[index] = await classifyBatch(batches[index]);
      onResult(results[index]);
    }
  }));
  return results;
}

function normalizeDecision(decision) {
  normalizeHierarchyFields(decision);
  normalizeControlledListFields(decision);
  const normalized = {
    event_id: clean(decision.event_id),
    market_category_id: clean(decision.market_category_id),
    market_subcategory_id: clean(decision.market_subcategory_id),
    market_application_id: clean(decision.market_application_id),
    product_form_id: clean(decision.product_form_id),
    use_case_ids: uniqueStrings(decision.use_case_ids),
    industry_ids: uniqueStrings(decision.industry_ids),
    target_user_ids: uniqueStrings(decision.target_user_ids),
    confidence: Number(decision.confidence),
    needs_review: decision.needs_review === true,
    rationale: clean(decision.rationale),
  };
  const canonicalEventId = clean(decision.canonical_event_id);
  if (canonicalEventId && canonicalEventId !== normalized.event_id) {
    normalized.canonical_event_id = canonicalEventId;
  }
  return normalized;
}

function applyDecisions(ledger) {
  const byEvent = new Map(ledger.decisions.map((decision) => [decision.event_id, decision]));
  let changedCards = 0;
  for (const file of datedFiles()) {
    const fullPath = path.join(fundingRoot, file);
    const payload = readJson(fullPath, {});
    let changed = payload.meta?.schema_version !== "FUNDING-INSIGHT-V1.2"
      || payload.meta?.taxonomy_version !== "TAG-V4.1";
    for (const card of payload.cards || []) {
      const decision = byEvent.get(card.triggered_by_event_id);
      if (!decision) throw new Error(`taxonomy_decision_missing:${card.triggered_by_event_id}`);
      card.schema_version = "FUNDING-INSIGHT-V1.2";
      card.analysis = {
        ...card.analysis,
        taxonomy_version: "TAG-V4.1",
        market_category_id: decision.market_category_id,
        market_subcategory_id: decision.market_subcategory_id,
        market_application_id: decision.market_application_id,
        product_form_id: decision.product_form_id,
        use_case_ids: decision.use_case_ids,
        industry_ids: decision.industry_ids,
        target_user_ids: decision.target_user_ids,
      };
      card.model_provenance = {
        ...card.model_provenance,
        taxonomy_classification: {
          taxonomy_version: "TAG-V4.1",
          method: "deepseek_evidence_review",
          prompt_version: promptVersion,
          decision_event_id: decision.event_id,
          confidence: decision.confidence,
          needs_review: decision.needs_review,
        },
      };
      changed = true;
      changedCards += 1;
    }
    payload.meta = { ...payload.meta, schema_version: "FUNDING-INSIGHT-V1.2", taxonomy_version: "TAG-V4.1" };
    if (changed) {
      writeJson(fullPath, payload);
    }
  }
  return changedCards;
}

const inputs = loadEventInputs();
let ledger = readJson(decisionPath, null);
const ledgerEventIds = new Set((ledger?.decisions || []).map((decision) => decision.event_id));
const incrementalInputs = inputs.filter((input) => !ledgerEventIds.has(input.event_id));
if (
  !ledger
  || !Array.isArray(ledger.decisions)
  || args.get("refresh") === "true"
  || (write && incrementalInputs.length)
) {
  const inputHash = sourceTextHash(JSON.stringify(inputs));
  const overrideLedger = readJson(overridePath, { decisions: [] });
  const overrides = (overrideLedger.decisions || []).map(normalizeDecision);
  for (const decision of overrides) {
    const problems = decisionProblems(decision, decision.event_id);
    if (problems.length) throw new Error(`funding_taxonomy_override_invalid:${problems.join("|")}`);
  }
  const checkpoint = readJson(checkpointPath, {});
  const cached = checkpoint.prompt_version === promptVersion && checkpoint.input_hash === inputHash
    ? (checkpoint.decisions || []).map(normalizeDecision)
    : [];
  const incremental = args.get("refresh") !== "true" && Array.isArray(ledger?.decisions);
  const existing = incremental ? ledger.decisions : [];
  const accumulated = new Map([...existing, ...cached, ...overrides].map((decision) => [decision.event_id, decision]));
  const missingInputs = inputs.filter((input) => !accumulated.has(input.event_id));
  const batches = [];
  for (let index = 0; index < missingInputs.length; index += batchSize) batches.push(missingInputs.slice(index, index + batchSize));
  const models = new Set([...(ledger?.meta?.models || []), ...(checkpoint.models || [])]);
  const results = await runPool(batches, (result) => {
    models.add(result.model);
    for (const decision of result.payload.decisions.map(normalizeDecision)) accumulated.set(decision.event_id, decision);
    writeJson(checkpointPath, {
      prompt_version: promptVersion,
      input_hash: inputHash,
      models: [...models],
      decisions: [...accumulated.values()].sort((a, b) => a.event_id.localeCompare(b.event_id)),
    });
  });
  const inputIds = new Set(inputs.map((input) => input.event_id));
  const existingOrder = existing.map((decision) => decision.event_id).filter((eventId) => inputIds.has(eventId));
  const existingIds = new Set(existingOrder);
  const orderedEventIds = [
    ...existingOrder,
    ...inputs.map((input) => input.event_id).filter((eventId) => !existingIds.has(eventId)),
  ];
  const decisions = orderedEventIds.map((eventId) => accumulated.get(eventId));
  const byEvent = new Map(decisions.map((decision) => [decision.event_id, decision]));
  const problems = inputs.flatMap((input) => decisionProblems(byEvent.get(input.event_id), input.event_id));
  if (problems.length) throw new Error(`funding_taxonomy_decisions_invalid:${problems.join("|")}`);
  ledger = {
    meta: {
      schema_version: "FUNDING-TAXONOMY-DECISION-V1.0",
      taxonomy_version: "TAG-V4.1",
      prompt_version: promptVersion,
      external_framework: "CB Insights AI 100 2026",
      external_framework_url: "https://www.cbinsights.com/research/report/artificial-intelligence-top-startups-2026/",
      generated_at: new Date().toISOString(),
      model_provider: "deepseek",
      models: [...new Set([...models, ...results.map((result) => result.model)])],
      decision_count: decisions.length,
      input_hash: inputHash,
      override_count: overrides.length,
      needs_review_count: decisions.filter((decision) => decision.needs_review).length,
      low_confidence_count: decisions.filter((decision) => decision.confidence < 0.8).length,
    },
    decisions,
  };
  const report = { ...ledger, inputs };
  writeJson(reportPath, report);
  if (write) {
    writeJson(decisionPath, ledger);
    if (fs.existsSync(checkpointPath)) fs.rmSync(checkpointPath, { force: true });
  }
}

const finalOverrides = (readJson(overridePath, { decisions: [] }).decisions || []).map(normalizeDecision);
if (ledger && finalOverrides.length) {
  const overrideByEvent = new Map(finalOverrides.map((decision) => [decision.event_id, decision]));
  ledger.decisions = ledger.decisions.map((decision) => overrideByEvent.get(decision.event_id) || decision);
  ledger.meta = {
    ...ledger.meta,
    override_count: finalOverrides.length,
    needs_review_count: ledger.decisions.filter((decision) => decision.needs_review).length,
    low_confidence_count: ledger.decisions.filter((decision) => decision.confidence < 0.8).length,
  };
  if (write) writeJson(decisionPath, ledger);
}

const knownEvents = new Set(ledger.decisions.map((decision) => decision.event_id));
const missingEvents = inputs.filter((input) => !knownEvents.has(input.event_id)).map((input) => input.event_id);
if (missingEvents.length) throw new Error(`funding_taxonomy_coverage_missing:${missingEvents.join(",")}`);
const invalid = ledger.decisions.flatMap((decision) => decisionProblems(decision, decision.event_id));
if (invalid.length) throw new Error(`funding_taxonomy_ledger_invalid:${invalid.join("|")}`);
const changedCards = apply ? applyDecisions(ledger) : 0;

const categoryCounts = Object.fromEntries([...allowed.category].map((id) => [id, ledger.decisions.filter((decision) => decision.market_category_id === id).length]));
console.log(JSON.stringify({
  ok: true,
  taxonomy_version: "TAG-V4.1",
  inputs: inputs.length,
  decisions: ledger.decisions.length,
  changed_cards: changedCards,
  needs_review: ledger.decisions.filter((decision) => decision.needs_review).length,
  low_confidence: ledger.decisions.filter((decision) => decision.confidence < 0.8).length,
  category_counts: categoryCounts,
  decision_path: path.relative(root, decisionPath).replace(/\\/gu, "/"),
  report_path: path.relative(root, reportPath).replace(/\\/gu, "/"),
}, null, 2));
