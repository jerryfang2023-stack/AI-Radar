import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { hydrateRawDocument } from "./lib/private-evidence-store.mjs";

export const FUNDING_INSIGHT_VERSION = "FUNDING-INSIGHT-V1.3";
export const FUNDING_INSIGHT_FRONTSTAGE_VERSION = "FUNDING-INSIGHT-FRONTSTAGE-V1.5";
export const FUNDING_INSIGHT_PROMPT_VERSION = "FUNDING-INSIGHT-DEEPSEEK-V1.7";
export const FUNDING_INSIGHT_GATE_VERSION = "FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.1";
export const INVESTORS_MISSING_RISK = "本轮具体投资方未披露，投资人结构与背书强度无法核验。";
export const FUNDING_PRODUCT_FORM_IDS = new Set([
  "model",
  "model_api_service",
  "developer_tool",
  "end_user_application",
  "enterprise_software_platform",
  "ai_infrastructure_software",
  "security_software",
  "ai_device",
  "robotic_system",
  "chip_accelerator",
  "ai_compute_system",
  "compute_cloud_service",
]);
export const FUNDING_MARKET_CATEGORY_IDS = new Set([
  "infrastructure_compute",
  "enterprise_applications",
  "industry_applications",
  "physical_ai",
]);
export const FUNDING_MARKET_SUBCATEGORY_IDS = new Set([
  "", "data", "development_deployment", "hardware_computing", "observability_evaluation",
  "customer_support", "cyber_physical_security", "hr", "marketing", "productivity_enterprise_workflows",
  "sales", "software_development_coding", "financial_services", "healthcare_life_sciences",
  "industrials", "legal", "consumer_retail",
]);
export const FUNDING_MARKET_APPLICATION_IDS = new Set([
  "", "synthetic_data", "data_preparation_curation", "vector_databases", "models",
  "ai_development_orchestration", "model_deployment", "monetization", "chips", "servers",
  "computing_infrastructure", "ai_observability_governance", "model_agent_security", "fine_tuning",
  "llm_benchmarking_routing",
]);
export const FUNDING_USE_CASE_IDS = new Set([
  "software_development", "customer_support", "sales", "marketing", "content_creation",
  "knowledge_search", "data_analysis", "research_discovery", "education_learning", "security_operations",
  "productivity_enterprise_workflows", "physical_automation", "hr_workforce", "finance_accounting",
  "legal_compliance", "procurement_supply_chain", "design_engineering",
]);
export const FUNDING_INDUSTRY_IDS = new Set([
  "financial_services", "healthcare_life_sciences", "retail_ecommerce", "manufacturing",
  "media_entertainment", "education", "government_public_sector", "energy_utilities",
  "telecommunications", "automotive_transportation", "professional_services",
  "construction_real_estate", "food_hospitality", "aerospace_defense", "agriculture",
  "logistics_supply_chain", "legal_services",
]);
export const FUNDING_TARGET_USER_IDS = new Set([
  "developer", "business_user", "consumer", "public_sector_user", "researcher", "educator", "student",
]);
export const FUNDING_MARKET_SUBCATEGORY_PARENTS = new Map([
  ...["data", "development_deployment", "hardware_computing", "observability_evaluation"].map((id) => [id, "infrastructure_compute"]),
  ...["customer_support", "cyber_physical_security", "hr", "marketing", "productivity_enterprise_workflows", "sales", "software_development_coding"].map((id) => [id, "enterprise_applications"]),
  ...["financial_services", "healthcare_life_sciences", "industrials", "legal", "consumer_retail"].map((id) => [id, "industry_applications"]),
]);
export const FUNDING_MARKET_APPLICATION_PARENTS = new Map([
  ...["synthetic_data", "data_preparation_curation", "vector_databases"].map((id) => [id, "data"]),
  ...["models", "ai_development_orchestration", "model_deployment", "monetization"].map((id) => [id, "development_deployment"]),
  ...["chips", "servers", "computing_infrastructure"].map((id) => [id, "hardware_computing"]),
  ...["ai_observability_governance", "model_agent_security", "fine_tuning", "llm_benchmarking_routing"].map((id) => [id, "observability_evaluation"]),
]);

function unknownListValues(value, allowed) {
  if (!Array.isArray(value)) return ["not_array"];
  return [...new Set(value.filter((item) => !allowed.has(clean(item))))];
}

function marketHierarchyProblems(analysis = {}) {
  const category = clean(analysis.market_category_id);
  const subcategory = clean(analysis.market_subcategory_id);
  const application = clean(analysis.market_application_id);
  const problems = [];
  if (category === "physical_ai") {
    if (subcategory || application) problems.push("physical_ai_hierarchy_not_empty");
    if (clean(analysis.product_form_id) !== "robotic_system") problems.push("physical_ai_product_form_mismatch");
    return problems;
  }
  if (clean(analysis.product_form_id) === "robotic_system") problems.push("robotic_system_market_category_mismatch");
  if (FUNDING_MARKET_SUBCATEGORY_PARENTS.get(subcategory) !== category) problems.push("market_subcategory_parent_mismatch");
  if (category === "infrastructure_compute") {
    if (FUNDING_MARKET_APPLICATION_PARENTS.get(application) !== subcategory) problems.push("market_application_parent_mismatch");
  } else if (application) problems.push("market_application_not_infrastructure");
  return problems;
}

export function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

const FUNDING_CURRENCY_LABELS = {
  USD: "美元",
  CNY: "人民币",
  EUR: "欧元",
  GBP: "英镑",
  JPY: "日元",
};

function amountMultiplier(unit = "") {
  const value = clean(unit).toLowerCase();
  if (/万亿|trillion|\bT\b/iu.test(value)) return 1e12;
  if (/billion|\bB\b/iu.test(value)) return 1e9;
  if (/千万/iu.test(value)) return 1e7;
  if (/亿/iu.test(value)) return 1e8;
  if (/million|百万|\bM\b/iu.test(value)) return 1e6;
  if (/thousand|\bK\b/iu.test(value)) return 1e3;
  if (/万/iu.test(value)) return 1e4;
  return 1;
}

function currencyFrom(symbol = "", suffix = "") {
  if (symbol === "$" || /美元|美金|usd/iu.test(suffix)) return "USD";
  if (symbol === "€" || /欧元|eur/iu.test(suffix)) return "EUR";
  if (symbol === "£" || /英镑|gbp/iu.test(suffix)) return "GBP";
  if (/日元|jpy/iu.test(suffix)) return "JPY";
  if (["¥", "￥"].includes(symbol) || /人民币|元人民币|^元$|cny|rmb/iu.test(suffix)) return "CNY";
  return "";
}

function roundAmountNumber(value) {
  if (!Number.isFinite(value)) return null;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function fundingAmountDisplay(currency, value, status) {
  if (!currency || !Number.isFinite(value)) return "";
  const label = FUNDING_CURRENCY_LABELS[currency] || currency;
  const scaled = value >= 1e8
    ? `${Number((value / 1e8).toFixed(4))} 亿${label}`
    : value >= 1e4
      ? `${Number((value / 1e4).toFixed(4))} 万${label}`
      : `${new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value)} ${label}`;
  if (status === "approximate") return `约 ${scaled}`;
  if (status === "lower_bound") return `超过 ${scaled}`;
  return scaled;
}

export function normalizeFundingAmount(value = "") {
  const original = clean(value).normalize("NFKC");
  const empty = {
    currency: "",
    value: null,
    min_value: null,
    max_value: null,
    unit: "base",
    status: original ? "unparsed" : "undisclosed",
    display_zh: original,
  };
  if (!original || /未披露|未公布|undisclosed|not disclosed/iu.test(original)) return empty;

  const compact = original.replace(/,/gu, "");
  const fuzzyCny = compact.match(/^(数)?(千万元|亿元|千万|亿)(?:级)?$/u);
  if (fuzzyCny) {
    const several = Boolean(fuzzyCny[1]);
    const scale = /亿/u.test(fuzzyCny[2]) ? 1e8 : 1e7;
    const minValue = several ? 2 * scale : scale;
    const maxValue = several ? 9 * scale : 10 * scale;
    return {
      currency: "CNY",
      value: null,
      min_value: minValue,
      max_value: maxValue,
      unit: "base",
      status: "range",
      display_zh: `${fundingAmountDisplay("CNY", minValue, "exact")}–${fundingAmountDisplay("CNY", maxValue, "exact")}`,
    };
  }
  const symbolMatch = compact.match(/([$€£¥￥])\s*(\d+(?:\.\d+)?)\s*(万亿|千万|亿|万|trillion|billion|million|thousand|[TBMK])?/iu);
  const suffixMatch = compact.match(/(\d+(?:\.\d+)?)\s*(万亿|千万|亿|万|trillion|billion|million|thousand|[TBMK])?\s*(美元|美金|人民币|元人民币|欧元|英镑|日元|元|USD|CNY|RMB|EUR|GBP|JPY)/iu);
  const match = symbolMatch || suffixMatch;
  if (!match) return empty;

  const symbol = symbolMatch?.[1] || "";
  const numberText = symbolMatch?.[2] || suffixMatch?.[1] || "";
  const unitText = symbolMatch?.[3] || suffixMatch?.[2] || "";
  const suffix = suffixMatch?.[3] || "";
  const currency = currencyFrom(symbol, suffix);
  const numeric = Number(numberText) * amountMultiplier(unitText);
  if (!currency || !Number.isFinite(numeric)) return empty;

  const approximate = /(?:^|\s)(?:about|approximately|approx\.?|nearly)|约|近|级|数(?:十|百|千|万|亿)/iu.test(compact);
  const lowerBound = /(?:^|\s)(?:over|more than|at least|just over)|超过|超|以上|至少|\+/iu.test(compact);
  const status = lowerBound ? "lower_bound" : approximate ? "approximate" : "exact";
  const normalizedValue = roundAmountNumber(numeric);
  return {
    currency,
    value: normalizedValue,
    min_value: status === "lower_bound" ? normalizedValue : null,
    max_value: null,
    unit: "base",
    status,
    display_zh: fundingAmountDisplay(currency, normalizedValue, status),
  };
}

export function canonicalFundingEventAmount(event = {}) {
  const metrics = (event.metrics || []).map(clean).filter(Boolean);
  if (!metrics.length) return "";
  const primary = metrics[0];
  const truncated = primary.normalize("NFKC").match(/^([$€£¥￥])\s*(\d{1,3})$/u);
  if (!truncated) return primary;
  const expanded = metrics.slice(1).find((candidate) => {
    const normalized = candidate.normalize("NFKC");
    const match = normalized.match(/^([$€£¥￥])\s*(\d{1,3})(?:,\d{3})+\s*$/u);
    return match && match[1] === truncated[1] && match[2] === truncated[2];
  });
  return expanded || primary;
}

export function fundingDisclosureStatus(financing = {}) {
  const amount = financing.amount_normalized || normalizeFundingAmount(financing.amount_original || financing.amount);
  const roundCode = clean(financing.round_code || normalizeFundingRound(financing.round_original || financing.round).code);
  const investorStatus = clean(financing.investor_disclosure_status);
  const hasDate = /^\d{4}-\d{2}-\d{2}$/u.test(clean(financing.announced_at));
  if (amount.status === "undisclosed" && roundCode === "undisclosed" && investorStatus === "not_disclosed") {
    return "not_disclosed";
  }
  if (
    ["undisclosed", "unparsed"].includes(amount.status)
    || roundCode === "undisclosed"
    || investorStatus !== "disclosed"
    || !hasDate
  ) return "partially_disclosed";
  return "disclosed";
}

const FUNDING_ROUND_LABELS = {
  pre_seed: "预种子轮",
  seed: "种子轮",
  angel: "天使轮",
  early_stage: "早期融资",
  first_external: "首次外部融资",
  growth: "成长轮",
  pre_ipo: "Pre-IPO",
  ipo: "IPO",
  follow_on: "后续发行",
  strategic: "战略融资",
  debt: "债务融资",
  infrastructure: "基础设施融资",
  government: "政府及产业融资",
  undisclosed: "轮次未披露",
  multi_round: "多轮融资",
  other: "其他融资",
};

function roundSeriesToken(value = "") {
  const text = clean(value).normalize("NFKC").toLowerCase();
  const match = text.match(
    /(?:(?:pre[-\s]*)?series\s*([a-g])(?:[-\s]?(\d+))?|(?:pre[-\s]*)?([a-g])(?:[-\s]?(\d+))?\s*轮)/iu,
  );
  if (!match) return null;
  const letter = (match[1] || match[3]).toLowerCase();
  const suffix = match[2] || match[4] || "";
  const isPre = /\bpre[-\s]*(?:series\s*)?[a-g]\b|pre[-\s]*[a-g]轮/iu.test(text);
  const isExtension = /extension|extend|扩展|延伸|追加|加注/iu.test(text);
  return {
    code: `${isPre ? "pre_" : ""}series_${letter}${suffix}${isExtension ? "_extension" : ""}`,
    label: `${isPre ? "Pre-" : ""}${letter.toUpperCase()}${suffix}轮${isExtension ? "扩展" : ""}`,
  };
}

export function normalizeFundingRound(value = "") {
  const original = clean(value);
  const text = original.normalize("NFKC").toLowerCase();
  const compact = text.replace(/[\s_]+/gu, "").replace(/[－—–]/gu, "-");
  const signals = new Set();
  if (/pre[-\s]?seed|种子轮前|预种子/iu.test(text)) signals.add("pre_seed");
  if (/(?:^|[^a-z])seed(?:[^a-z]|$)|种子轮|种子扩展/iu.test(text) && !signals.has("pre_seed")) signals.add("seed");
  if (/天使/iu.test(text)) signals.add("angel");
  const seriesMatches = [...text.matchAll(
    /(?:(?:pre[-\s]*)?series\s*[a-g](?:[-\s]?\d+)?|(?:pre[-\s]*)?[a-g](?:[-\s]?\d+)?\s*轮)/giu,
  )];
  for (const match of seriesMatches) {
    const token = roundSeriesToken(match[0]);
    if (token) {
      const code = seriesMatches.length === 1 && /extension|extend|扩展|延伸|追加|加注/iu.test(text)
        ? `${token.code}_extension`
        : token.code;
      signals.add(code);
    }
  }
  const materialRounds = [...signals].filter((code) => code !== "early_stage");
  if (
    materialRounds.length > 1
    || /多轮|(?:seed|种子).{0,12}(?:and|\+|、|和|及).{0,12}(?:series|[a-g]\s*轮)/iu.test(text)
  ) {
    return { code: "multi_round", label: FUNDING_ROUND_LABELS.multi_round, original };
  }
  if (materialRounds.length === 1) {
    const code = materialRounds[0];
    const series = code.match(/^(pre_)?series_([a-g])(\d+)?(_extension)?$/u);
    const label = series
      ? `${series[1] ? "Pre-" : ""}${series[2].toUpperCase()}${series[3] || ""}轮${series[4] ? "扩展" : ""}`
      : FUNDING_ROUND_LABELS[code];
    return { code, label, original };
  }
  let code = "other";
  if (/首次外部|首轮外部|firstexternal/iu.test(compact)) code = "first_external";
  else if (/early[-\s]?stage|早期/iu.test(text)) code = "early_stage";
  else if (/growth|成长/iu.test(text)) code = "growth";
  else if (/pre[-\s]?ipo/iu.test(text)) code = "pre_ipo";
  else if (/\bipo\b/iu.test(text)) code = "ipo";
  else if (/follow[-\s]?on|后续发行/iu.test(text)) code = "follow_on";
  else if (/战略/iu.test(text)) code = "strategic";
  else if (/债务/iu.test(text)) code = "debt";
  else if (/基础设施/iu.test(text)) code = "infrastructure";
  else if (/政府资金|政府及企业|产业投资/iu.test(text)) code = "government";
  else if (!original || /未披露|新一轮|latestfundinground|融资轮次/iu.test(compact)) code = "undisclosed";
  return { code, label: FUNDING_ROUND_LABELS[code], original };
}

export function partitionRoundInvestors(investors = [], roundValue = "", announcedAt = "") {
  const targetRound = typeof roundValue === "object" && roundValue?.code
    ? roundValue
    : normalizeFundingRound(roundValue);
  const current = [];
  const other = [];
  for (const investor of Array.isArray(investors) ? investors : []) {
    const role = clean(investor?.role);
    const roleRound = normalizeFundingRound(role);
    const explicitCurrent = /本轮|此轮|该轮|current\s+round|this\s+round/iu.test(role);
    const genericCurrentRole = /领投|参投|联合投资|共同投资|co-?lead|led\s+the\s+round|participat/iu.test(role);
    const explicitOther = /既有|原有|历史|此前|上一轮|previous|existing|prior/iu.test(role);
    const datedDisclosure = role.match(/\b(20\d{2})[年/-](0?[1-9]|1[0-2])(?:月|\b)/u);
    const currentMonth = clean(announcedAt).slice(0, 7);
    const roleMonth = datedDisclosure
      ? `${datedDisclosure[1]}-${String(datedDisclosure[2]).padStart(2, "0")}`
      : "";
    const explicitHistoricalDisclosure = /首次披露|initially disclosed|first disclosed/iu.test(role)
      && roleMonth
      && currentMonth
      && roleMonth !== currentMonth;
    const specifiedRound = !["other", "undisclosed"].includes(roleRound.code);
    const matchesTarget = specifiedRound && (
      targetRound.code === "multi_round"
      || roleRound.code === targetRound.code
    );
    if (
      !explicitHistoricalDisclosure
      && (explicitCurrent
        || matchesTarget
        || (!explicitOther && !specifiedRound && genericCurrentRole))
    ) {
      current.push(investor);
      continue;
    }
    other.push({
      ...investor,
      round_context: specifiedRound
        ? roleRound
        : { code: "undisclosed", label: FUNDING_ROUND_LABELS.undisclosed, original: role },
      classification_reason: explicitHistoricalDisclosure
        ? "historical_disclosure_date"
        : explicitOther
        ? "historical_role"
        : specifiedRound
          ? "different_round"
          : "round_unspecified",
    });
  }
  return { current, other };
}

function entityCoverage(items = []) {
  const unresolved = items.filter((item) => !item.entity_id).map((item) => clean(item.name)).filter(Boolean);
  return {
    linked: items.length - unresolved.length,
    total: items.length,
    unresolved_names: [...new Set(unresolved)].sort(),
  };
}

function entityItemsById(entityIndex = {}) {
  return new Map([
    ...(entityIndex.companies || []),
    ...(entityIndex.products || []),
    ...(entityIndex.people || []),
  ].map((entity) => [entity.id, entity]));
}

export function acceptedFundingEntityDecisions(entityIndex = {}, decisionFile = {}) {
  const byId = entityItemsById(entityIndex);
  const accepted = new Map();
  for (const decision of decisionFile.decisions || []) {
    if (decision.status !== "accepted") continue;
    const entity = byId.get(decision.canonical_entity_id);
    const expectedType = decision.candidate_kind === "product" ? "产品/服务" : "人物";
    if (!entity || entity.type !== expectedType) continue;
    accepted.set(`${decision.candidate_kind}|${normalizedName(decision.research_name)}`, entity);
  }
  return accepted;
}

export function acceptedFundingCompanyIdentityDecisions(reviewFile = {}) {
  const accepted = new Map();
  const reviewDecisions = reviewFile.decisions || [];
  const decisions = new Map();
  for (const decision of reviewDecisions) {
    if (decision.review_status !== "accepted") continue;
    const decisionKey = clean(decision.decision_id)
      || `${clean(decision.entity_id)}|${normalizedName(decision.current?.name)}`;
    if (!decision.entity_id || decisions.has(decisionKey)) {
      throw new Error(`Duplicate or missing funding company identity decision: ${decisionKey || "missing"}`);
    }
    if (!new Set(["correct", "merge"]).has(decision.action)) {
      throw new Error(`Unknown funding company identity action for ${decision.entity_id}: ${decision.action || "missing"}`);
    }
    if (decision.current?.catalog_type !== "company" || decision.canonical?.catalog_type !== "company") {
      throw new Error(`Funding company identity decision must resolve company entities: ${decision.entity_id}`);
    }
    if (!clean(decision.current?.name) || !clean(decision.canonical?.name)) {
      throw new Error(`Funding company identity decision is missing a company name: ${decision.entity_id}`);
    }
    if (!clean(decision.evidence?.source_url) || !clean(decision.evidence?.quote) || !clean(decision.rationale)) {
      throw new Error(`Funding company identity decision is missing evidence or rationale: ${decision.entity_id}`);
    }
    if (decision.action === "merge" && !clean(decision.merge_into_entity_id)) {
      throw new Error(`Funding company identity merge target is missing: ${decision.entity_id}`);
    }
    decisions.set(decisionKey, decision);
  }
  const acceptedByEntityId = new Map();
  for (const decision of decisions.values()) {
    const target = decision.action === "merge"
      ? [...decisions.values()].find((item) => item.entity_id === decision.merge_into_entity_id)
      : decision;
    if (!target) {
      throw new Error(`Funding company identity merge target is not accepted: ${decision.merge_into_entity_id}`);
    }
    if (decision.action === "merge" && clean(target.canonical?.name) !== clean(decision.canonical?.name)) {
      throw new Error(`Funding company identity canonical name mismatch: ${decision.entity_id}`);
    }
    const resolved = {
      id: clean(decision.application_entity_id)
        || (decision.action === "merge" ? decision.merge_into_entity_id : decision.entity_id),
      name: target.canonical.name,
    };
    for (const name of [decision.current?.name, ...(decision.match_names || [])]) {
      const key = normalizedName(name);
      if (!key) continue;
      const existing = accepted.get(`name|${key}`);
      if (existing && existing.id !== resolved.id) {
        throw new Error(`Conflicting funding company identity name decision: ${name}`);
      }
      accepted.set(`name|${key}`, resolved);
    }
    if (!(decision.match_names || []).length) {
      if (!acceptedByEntityId.has(decision.entity_id)) acceptedByEntityId.set(decision.entity_id, []);
      acceptedByEntityId.get(decision.entity_id).push(resolved);
    }
  }
  for (const [entityId, values] of acceptedByEntityId) {
    const ids = new Set(values.map((item) => item.id));
    if (ids.size === 1) accepted.set(entityId, values[0]);
  }
  return accepted;
}

function resolvedFundingEntity(name, kind, resolver, acceptedDecisions) {
  const allowed = kind === "product" ? ["产品/服务"] : kind === "person" ? ["人物"] : ["公司/机构"];
  return resolver(name, allowed)
    || acceptedDecisions.get(`${kind}|${normalizedName(name)}`)
    || null;
}

function resolvedResearchItem(item, kind, resolver, acceptedDecisions) {
  const resolved = resolvedFundingEntity(item?.name, kind, resolver, acceptedDecisions);
  return {
    ...item,
    entity_id: resolved?.id || null,
  };
}

function fundingEntityLink(kind, relationType, item, resolver, acceptedDecisions) {
  const resolved = resolvedFundingEntity(item?.name, kind, resolver, acceptedDecisions);
  return {
    relation_type: relationType,
    target_kind: kind,
    research_name: clean(item?.name),
    canonical_entity_id: resolved?.id || null,
    canonical_name: resolved?.name || "",
  };
}

export function evidenceQuoteHash(quote = "") {
  return crypto.createHash("sha256").update(clean(quote)).digest("hex");
}

export function attachFundingEvidenceProofs(inputCard = {}) {
  const card = structuredClone(inputCard);
  const sourceHashById = new Map((card.research_sources || [])
    .map((source) => [source.source_id, clean(source.content_hash).toLowerCase()]));
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (value.source_id && value.quote) {
      value.source_content_hash = sourceHashById.get(value.source_id) || "";
      value.quote_hash = evidenceQuoteHash(value.quote);
    }
    for (const item of Object.values(value)) visit(item);
  };
  visit(card);
  return card;
}

export function fundingEvidenceProofProblems(card = {}) {
  const problems = [];
  const sourceHashById = new Map((card.research_sources || [])
    .map((source) => [source.source_id, clean(source.content_hash).toLowerCase()]));
  const visit = (value, location = "card") => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, `${location}[${index}]`));
      return;
    }
    if (value.source_id && value.quote) {
      const expectedSourceHash = sourceHashById.get(value.source_id);
      if (!expectedSourceHash) problems.push(`${location}:evidence_source_hash_missing`);
      else if (clean(value.source_content_hash).toLowerCase() !== expectedSourceHash) {
        problems.push(`${location}:evidence_source_hash_mismatch`);
      }
      if (clean(value.quote_hash).toLowerCase() !== evidenceQuoteHash(value.quote)) {
        problems.push(`${location}:evidence_quote_hash_mismatch`);
      }
    }
    for (const [key, item] of Object.entries(value)) visit(item, `${location}.${key}`);
  };
  visit(card);
  return [...new Set(problems)];
}

export function normalizeFundingInsightCard(
  inputCard = {},
  entityIndex = {},
  decisionFile = {},
  companyIdentityReview = {},
) {
  const card = structuredClone(inputCard);
  const resolve = entityResolver(entityIndex);
  const acceptedDecisions = acceptedFundingEntityDecisions(entityIndex, decisionFile);
  const reviewedCompanies = acceptedFundingCompanyIdentityDecisions(companyIdentityReview);
  const reviewedCompany = reviewedCompanies.get(`name|${normalizedName(card.company?.full_name)}`)
    || reviewedCompanies.get(`name|${normalizedName(card.company?.name)}`)
    || reviewedCompanies.get(card.company?.entity_id);
  const companyFullName = clean(card.company?.full_name);
  const companyDisplayName = clean(card.company?.name);
  const resolvedCompany = reviewedCompany
    || resolvedFundingEntity(companyFullName, "organization", resolve, acceptedDecisions)
    || ((!companyFullName || normalizedName(companyFullName) === normalizedName(companyDisplayName))
      ? resolvedFundingEntity(companyDisplayName, "organization", resolve, acceptedDecisions)
      : null);
  const indexedCompany = entityItemsById(entityIndex).get(card.company?.entity_id);
  const indexedNameMatches = indexedCompany && (
    !clean(indexedCompany.name)
    || organizationNamesEquivalent(companyFullName || companyDisplayName, indexedCompany.name)
  );
  const projectedCompanyName = clean(card.company?.full_name)
    || descriptiveCompanyTail(card.company?.name)
    || clean(card.company?.name);
  const reviewedApplicationId = resolvedCompany?.id || "";
  const applicationEntityId = reviewedApplicationId
    || (indexedCompany && !indexedNameMatches
      ? stableId("FICO", normalizedName(projectedCompanyName))
      : card.company?.entity_id || stableId("FICO", normalizedName(projectedCompanyName)));
  const reviewedCanonicalId = reviewedApplicationId && !reviewedApplicationId.startsWith("FICO-")
    ? reviewedApplicationId
    : "";
  const companyEntityId = reviewedCanonicalId || card.company?.entity_id || applicationEntityId;
  const canonicalEntityConsistent = Boolean(
    reviewedCanonicalId
    || (indexedCompany && indexedNameMatches && applicationEntityId === companyEntityId),
  );
  const storedOriginalRound = clean(card.financing?.round_original);
  const storedRound = clean(card.financing?.round);
  const normalizedOriginalRound = normalizeFundingRound(storedOriginalRound);
  const round = normalizeFundingRound(
    storedOriginalRound && storedRound === normalizedOriginalRound.label
      ? storedOriginalRound
      : storedRound || storedOriginalRound,
  );
  const partitioned = partitionRoundInvestors(
    card.financing?.investors || [],
    round,
    card.financing?.announced_at || "",
  );
  const founders = (card.company?.founders || []).map(
    (item) => resolvedResearchItem(item, "person", resolve, acceptedDecisions),
  );
  const products = (card.products || []).map(
    (item) => resolvedResearchItem(item, "product", resolve, acceptedDecisions),
  );
  const currentInvestors = partitioned.current.map(
    (item) => resolvedResearchItem(item, "organization", resolve, acceptedDecisions),
  );
  const otherInvestors = [
    ...(card.financing?.other_round_investors || []),
    ...partitioned.other,
  ].map((item) => resolvedResearchItem(item, "organization", resolve, acceptedDecisions));
  const customers = (card.customers || []).map(
    (item) => resolvedResearchItem(item, "organization", resolve, acceptedDecisions),
  );
  const comparisons = (card.comparisons || []).map(
    (item) => resolvedResearchItem(item, "organization", resolve, acceptedDecisions),
  );
  const currentInvestorNames = new Set(currentInvestors.map((item) => normalizedName(item.name)));
  const investmentRationale = (card.analysis?.investment_rationale || [])
    .filter((item) => currentInvestorNames.has(normalizedName(item.institution)));
  const investorDisclosureStatus = currentInvestors.length
    ? "disclosed"
    : clean(card.financing?.investor_disclosure_status) === "not_disclosed"
      ? "not_disclosed"
      : "unknown";
  const investorRiskMarkers = [...new Set([
    ...(card.financing?.risk_markers || []),
    ...(investorDisclosureStatus === "not_disclosed" ? ["investors_missing"] : []),
  ])];
  card.company = {
    ...(card.company || {}),
    entity_id: companyEntityId,
    application_entity_id: applicationEntityId,
    canonical_entity_consistent: canonicalEntityConsistent,
    name: resolvedCompany?.name || projectedCompanyName,
    full_name: card.company?.full_name || card.company?.name,
    founders,
  };
  card.financing = {
    ...(card.financing || {}),
    round: round.label,
    round_code: round.code,
    round_original: round.original,
    amount_original: clean(card.financing?.amount),
    amount_normalized: normalizeFundingAmount(card.financing?.amount),
    total_raised_original: clean(card.financing?.total_raised),
    total_raised_normalized: normalizeFundingAmount(card.financing?.total_raised),
    investors: currentInvestors,
    investor_disclosure_status: investorDisclosureStatus,
    risk_markers: investorRiskMarkers,
    other_round_investors: otherInvestors,
    disclosures: card.financing?.disclosures?.length
      ? card.financing.disclosures
      : [{
          event_id: card.triggered_by_event_id,
          round_original: round.original,
          amount: card.financing?.amount || "",
          announced_at: card.financing?.announced_at || "",
          evidence_refs: card.financing?.evidence_refs || [],
        }],
  };
  card.financing.disclosure_status = fundingDisclosureStatus(card.financing);
  card.products = products;
  card.customers = customers;
  card.comparisons = comparisons;
  card.customer_research = {
    status: customers.length ? "verified_customers_found" : "no_verified_customer_found",
    verified_customer_count: customers.length,
    searched_source_count: (card.research_sources || []).length,
  };
  card.analysis = {
    ...(card.analysis || {}),
    risks: [...new Set([
      ...(card.analysis?.risks || []),
      ...(investorDisclosureStatus === "not_disclosed" ? [INVESTORS_MISSING_RISK] : []),
    ])],
    investment_rationale: investmentRationale,
    investment_thesis: {
      statement: clean(card.analysis?.capital_judgment),
      evidence_signals: card.analysis?.validated_signals || [],
      risks: card.analysis?.risks || [],
      institutional_rationale_status: investmentRationale.length ? "disclosed" : "not_disclosed",
    },
  };
  card.entity_link_coverage = {
    products: entityCoverage(products),
    founders: entityCoverage(founders),
  };
  card.entity_links = [
    ...products.map((item) => fundingEntityLink("product", "product_of", item, resolve, acceptedDecisions)),
    ...founders.map((item) => fundingEntityLink("person", "founded_by", item, resolve, acceptedDecisions)),
    ...currentInvestors.map((item) => fundingEntityLink("organization", "invested_in_round", item, resolve, acceptedDecisions)),
    ...otherInvestors.map((item) => fundingEntityLink("organization", "invested_in_other_round", item, resolve, acceptedDecisions)),
    ...customers.map((item) => fundingEntityLink("organization", "public_customer_case", item, resolve, acceptedDecisions)),
    ...comparisons.map((item) => fundingEntityLink("organization", "compared_with", item, resolve, acceptedDecisions)),
  ];
  card.schema_version = FUNDING_INSIGHT_VERSION;
  const existingSourceEventIds = card.source_event_ids || [];
  card.source_event_ids = card.aggregation?.event_count > 1 || existingSourceEventIds.length > 1
    ? [...new Set([card.triggered_by_event_id, ...existingSourceEventIds].filter(Boolean))]
    : [card.triggered_by_event_id].filter(Boolean);
  card.aggregation = card.aggregation || {
    key: `${card.company?.entity_id || normalizedName(card.company?.name)}|${round.code}`,
    event_count: card.source_event_ids.length,
    strategy: "company_and_normalized_round",
  };
  card.auto_publish_gate = {
    ...(card.auto_publish_gate || {}),
    gate_version: FUNDING_INSIGHT_GATE_VERSION,
  };
  return attachFundingEvidenceProofs(card);
}

export function buildFundingEntityReviewQueue(cards = []) {
  const candidates = new Map();
  for (const card of cards) {
    for (const [kind, items] of [
      ["product", card.products || []],
      ["person", card.company?.founders || []],
    ]) {
      for (const item of items) {
        if (item.entity_id || !clean(item.name)) continue;
        const key = `${kind}|${normalizedName(item.name)}`;
        if (!candidates.has(key)) {
          candidates.set(key, {
            candidate_id: stableId("FIER", key),
            candidate_kind: kind,
            research_name: clean(item.name),
            status: "pending_canonical_review",
            reason: "canonical_exact_match_missing",
            company_entity_ids: [],
            funding_insight_ids: [],
            source_event_ids: [],
            evidence_refs: [],
          });
        }
        const candidate = candidates.get(key);
        candidate.company_entity_ids.push(card.company?.entity_id);
        candidate.funding_insight_ids.push(card.funding_insight_id);
        candidate.source_event_ids.push(...(card.source_event_ids || [card.triggered_by_event_id]));
        candidate.evidence_refs.push(...(item.evidence_refs || []));
      }
    }
  }
  const rows = [...candidates.values()]
    .map((candidate) => ({
      ...candidate,
      company_entity_ids: [...new Set(candidate.company_entity_ids.filter(Boolean))].sort(),
      funding_insight_ids: [...new Set(candidate.funding_insight_ids.filter(Boolean))].sort(),
      source_event_ids: [...new Set(candidate.source_event_ids.filter(Boolean))].sort(),
      evidence_refs: [...new Map(candidate.evidence_refs.map((item) => [
        `${item.source_id}|${item.quote}`,
        item,
      ])).values()].slice(0, 3),
    }))
    .sort((left, right) => (
      left.candidate_kind.localeCompare(right.candidate_kind, "en")
      || left.research_name.localeCompare(right.research_name, "en")
    ));
  return {
    meta: {
      schema_version: "FUNDING-INSIGHT-ENTITY-REVIEW-V1.0",
      funding_insight_version: FUNDING_INSIGHT_VERSION,
      candidate_count: rows.length,
      product_candidates: rows.filter((item) => item.candidate_kind === "product").length,
      person_candidates: rows.filter((item) => item.candidate_kind === "person").length,
      rule: "Application evidence never mutates canonical V4 entities automatically.",
    },
    candidates: rows,
  };
}

export function stableId(prefix, value) {
  return `${prefix}-${crypto.createHash("sha256").update(String(value || "")).digest("hex").slice(0, 16)}`;
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function latestDataDate(root) {
  const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
  return fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .sort()
    .at(-1) || "";
}

export function loadDailyBundle(root, date) {
  const dir = path.join(root, "01-SiteV2/content/11-databases/data-center-v4", date);
  const required = [
    "canonical-events.json",
    "claims.json",
    "entities.json",
    "raw-documents.json",
    "source-artifacts.json",
  ];
  for (const file of required) {
    if (!fs.existsSync(path.join(dir, file))) throw new Error(`funding_insight_input_missing:${date}:${file}`);
  }
  return {
    date,
    dir,
    events: readJson(path.join(dir, "canonical-events.json"), []),
    claims: readJson(path.join(dir, "claims.json"), []),
    entities: readJson(path.join(dir, "entities.json"), []),
    rawDocuments: readJson(path.join(dir, "raw-documents.json"), [])
      .map((raw) => hydrateRawDocument(root, raw, { required: false })),
    sourceArtifacts: readJson(path.join(dir, "source-artifacts.json"), []),
  };
}

function normalizedName(value = "") {
  return clean(value)
    .replace(/[®™]/gu, "")
    .normalize("NFKC")
    .replace(/\((?:co-?founder|founder|chief executive officer|ceo|cto|cpo|president)\)$/iu, "")
    .replace(/（(?:联合创始人|创始人|首席执行官|首席技术官|CEO|CTO|CPO|总裁)）$/iu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function organizationNamesEquivalent(left = "", right = "") {
  const stripLegalSuffix = (value) => normalizedName(value)
    .replace(/(?:incorporated|corporation|company|limited|holdings|inc|corp|llc|ltd|plc|gmbh|co)$/u, "");
  const leftName = stripLegalSuffix(left);
  const rightName = stripLegalSuffix(right);
  if (!leftName || !rightName) return false;
  if (leftName === rightName) return true;
  const shorter = leftName.length <= rightName.length ? leftName : rightName;
  const longer = shorter === leftName ? rightName : leftName;
  return shorter.length >= 4 && longer.includes(shorter);
}

function fundingAmountsEquivalent(left = "", right = "") {
  const a = normalizeFundingAmount(left);
  const b = normalizeFundingAmount(right);
  const comparableValue = (amount) => Number.isFinite(amount.value)
    ? amount.value
    : Number.isFinite(amount.min_value)
      ? amount.min_value
      : null;
  const aValue = comparableValue(a);
  const bValue = comparableValue(b);
  return Boolean(
    a.currency
      && b.currency
      && a.currency === b.currency
      && Number.isFinite(aValue)
      && Number.isFinite(bValue)
      && aValue === bValue,
  );
}

export function fundingEventCardConsistencyProblems(card = {}, event = {}, claims = [], entities = []) {
  if (!card?.company?.entity_id || !event?.event_id) return [];
  // A single canonical event may mention several companies. Only apply the
  // claim-to-card amount check to that ambiguous shape; older single-company
  // events use legacy claim subject conventions that are not always exact.
  if ((event.entities || []).length < 2) return [];
  const entity = entities.find((item) => item.entity_id === card.company.entity_id);
  const companyNames = [card.company.name, card.company.full_name, entity?.canonical_name, ...(entity?.aliases || [])]
    .map(clean)
    .filter(Boolean);
  const eventClaims = (event.claim_refs || [])
    .map((claimId) => claims.find((claim) => claim.claim_id === claimId))
    .filter(Boolean);
  const companyClaims = eventClaims.filter((claim) => companyNames.some((name) => (
    organizationNamesEquivalent(claim.subject, name)
      || (
        normalizedName(name).length >= 4
        && normalizedName(claim.source_quote).includes(normalizedName(name))
      )
  )));
  if (!companyClaims.length) return ["funding_event_company_claim_missing"];
  const eventHasComparableAmount = companyClaims.some((claim) => (
    normalizeFundingAmount(claim.object).currency
      || normalizeFundingAmount(claim.source_quote).currency
  ));
  if (!eventHasComparableAmount) return [];
  // Some legacy deterministic claims retain a truncated object label (for
  // example, a title suffix such as "00M in funding"). The exact source span
  // is authoritative for amount consistency, so accept it when the normalized
  // claim object is incomplete but the source quote contains the disclosed
  // company amount.
  if (!companyClaims.some((claim) => (
    fundingAmountsEquivalent(card.financing?.amount, claim.object)
      || fundingAmountsEquivalent(card.financing?.amount, claim.source_quote)
  ))) {
    return ["funding_event_company_amount_mismatch"];
  }
  return [];
}

function containsChinese(value = "") {
  return /[\u3400-\u9fff]/u.test(clean(value));
}

export function entityResolver(entityIndex = {}) {
  const all = [
    ...(entityIndex.companies || []),
    ...(entityIndex.products || []),
    ...(entityIndex.people || []),
  ];
  const exact = new Map();
  for (const entity of all) {
    for (const name of [entity.name, ...(entity.aliases || [])]) {
      const key = normalizedName(name);
      if (!key) continue;
      if (!exact.has(key)) exact.set(key, []);
      exact.get(key).push(entity);
    }
  }
  return (name, allowedTypes = []) => {
    const candidates = exact.get(normalizedName(name)) || [];
    const filtered = allowedTypes.length
      ? candidates.filter((entity) => allowedTypes.includes(entity.type))
      : candidates;
    return filtered.length === 1 ? filtered[0] : null;
  };
}

function subjectSignalScore(text = "", name = "") {
  const haystack = clean(text).toLowerCase();
  const needle = clean(name).toLowerCase();
  if (!haystack || !needle || !haystack.includes(needle)) return 0;
  const escapedName = needle.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const leftBoundary = /^[a-z0-9]/u.test(needle) ? "(?<![a-z0-9])" : "";
  const rightBoundary = /[a-z0-9]$/u.test(needle) ? "(?![a-z0-9])" : "";
  const escaped = `${leftBoundary}${escapedName}${rightBoundary}`;
  let score = 0;
  if (new RegExp(`(?:^|[\\s:：|｜—-])${escaped}`, "iu").test(haystack)) score += 20;
  if (new RegExp(`${escaped}[^|]{0,24}(?:获|获得|完成|宣布|融资|再融|筹集|募资|估值|ipo|raises?|raised|funding|series|seed|round)`, "iu").test(haystack)) {
    score += 45;
  }
  if (new RegExp(`(?:投资|领投|跟投|参投|back(?:ed)?|invest(?:s|ed|ment)?)[^|]{0,36}${escaped}`, "iu").test(haystack)) {
    score += 55;
  }
  if (new RegExp(`${escaped}[^|]{0,12}(?:投资|领投|跟投|参投|back(?:ed)?|invest(?:s|ed|ment)?)`, "iu").test(haystack)) {
    score -= 35;
  }
  if (new RegExp(`(?:获|获得|得到|backed by)[^|]{0,36}${escaped}[^|]{0,16}(?:支持|背书|backing)`, "iu").test(haystack)) {
    score -= 60;
  }
  return score;
}

function descriptiveCompanyTail(name = "") {
  const match = clean(name).match(
    /\b(?:company|startup|firm|platform|provider)\s+([A-Z][\p{L}\p{N}.&'-]*(?:\s+[A-Z][\p{L}\p{N}.&'-]*){0,3})$/u,
  );
  return clean(match?.[1]);
}

function fundedStartupNameFromClaims(claims = []) {
  const acceptedQuotes = claims
    .filter((claim) => claim?.claim_type === "funding" && claim?.verification_status === "accepted")
    .map((claim) => clean(claim.source_quote))
    .filter((quote) => /(?:raises?|raised|funding|series|seed|round|financing)/iu.test(quote));
  for (const quote of acceptedQuotes) {
    const match = quote.match(
      /\b(?:new\s+|their\s+|its\s+)?(?:startup|company|firm)\s*,\s*([A-Z][\p{L}\p{N}.&'-]*(?:\s+[A-Z][\p{L}\p{N}.&'-]*){0,3})\s*[\s.，,]*(?=(?:The company|the company|it|has|had|raised|raises|announced|said)\b)/u,
    );
    const name = clean(match?.[1]);
    if (name && !["Now", "The", "Company"].includes(name)) return name;
  }
  return "";
}

function subjectCandidate(entity, index, eventText) {
  const canonicalName = entity.canonical_name || entity.name;
  const inferredName = descriptiveCompanyTail(canonicalName);
  const names = [canonicalName, ...(entity.aliases || []), inferredName].filter(Boolean);
  const scores = names.map((name) => {
    const normalized = normalizedName(name);
    const lexical = subjectSignalScore(eventText.raw, name) > 0 ? Math.min(30, normalized.length) : 0;
    return lexical + subjectSignalScore(eventText.raw, name);
  });
  const fragmentPenalty = /[：，、“”"'!！?？|｜]|(?:融资|估值|累计|完成|宣布|再融|获\s*\d)|(?:已|将|再)$/u.test(clean(canonicalName)) ? 80 : 0;
  const verificationBonus = entity.verification_status === "verified" ? 60 : 0;
  const bestScore = Math.max(0, ...scores) + verificationBonus - fragmentPenalty;
  return {
    entity: inferredName
      ? { ...entity, canonical_name: inferredName }
      : entity,
    index,
    score: bestScore,
    has_subject_signal: scores.some((score) => score >= 45),
  };
}

export function subjectCompanyForEvent(event, entities, entityIndex = {}, claims = []) {
  const byId = new Map(entities.map((entity) => [entity.entity_id, entity]));
  const claimById = new Map(claims.map((claim) => [claim.claim_id, claim]));
  const eventClaims = (event.claim_refs || []).map((id) => claimById.get(id)).filter(Boolean);
  const acceptedFundingSubjects = eventClaims
    .filter((claim) => claim?.claim_type === "funding" && claim?.verification_status === "accepted")
    .map((claim) => normalizedName(claim.subject))
    .filter(Boolean);
  const claimInferredCompanyName = fundedStartupNameFromClaims(eventClaims);
  if (acceptedFundingSubjects.length) {
    const subjectMatches = (event.entities || [])
      .map((id, index) => ({ entity: byId.get(id), index }))
      .filter(({ entity }) => entity?.entity_type === "organization_candidate")
      .map(({ entity, index }) => ({
        entity,
        index,
        matched: acceptedFundingSubjects.some((subject) => {
          const canonical = normalizedName(entity.canonical_name);
          const aliases = (entity.aliases || []).map(normalizedName);
          return canonical && (subject === canonical || aliases.includes(subject));
        }),
      }))
      .filter((candidate) => candidate.matched);
    if (subjectMatches.length === 1) {
      const entity = subjectMatches[0].entity;
      return claimInferredCompanyName
        ? {
            ...entity,
            canonical_name: claimInferredCompanyName,
            aliases: [...new Set([...(entity.aliases || []), entity.canonical_name].filter(Boolean))],
          }
        : entity;
    }
  }
  const eventParts = [
    event.display_title_zh,
    event.action,
    event.object,
    ...eventClaims.flatMap((claim) => [claim.subject, claim.source_quote]),
  ].filter(Boolean);
  const eventText = {
    raw: clean(eventParts.join(" | ")),
    normalized: normalizedName(eventParts.join(" ")),
  };
  const rejectedNames = new Set(["new", "weve", "whywe", "backedbyanthropic"]);
  const daily = (event.entities || [])
    .map((id, index) => ({ entity: byId.get(id), index }))
    .filter(({ entity }) => entity?.entity_type === "organization_candidate")
    .filter(({ entity }) => !rejectedNames.has(normalizedName(entity.canonical_name)))
    .map(({ entity, index }) => subjectCandidate(entity, index, eventText));
  const linkedIds = new Set(daily.map(({ entity }) => entity.entity_id));
  const global = (entityIndex.companies || [])
    .filter((entity) => !linkedIds.has(entity.id))
    .map((entity, index) => ({
      entity: {
        entity_id: entity.id,
        canonical_name: entity.name,
        entity_type: entity.sourceType || "organization_candidate",
        aliases: entity.aliases || [],
      },
      index: daily.length + index,
    }))
    .map(({ entity, index }) => subjectCandidate(entity, index, eventText))
    .filter((candidate) => candidate.score > 0);
  const candidates = [...daily, ...global]
    .filter((candidate) => candidate.score > 0)
    .sort((left, right) => right.score - left.score || left.index - right.index);
  if (!candidates.length) return null;
  if (!candidates[0].has_subject_signal) {
    const lexicalMatches = candidates.filter((candidate) => candidate.score >= 6);
    const eventHasFundingSignal = Boolean((event.metrics || []).length)
      && /(?:融资|筹集|募资|估值|ipo|raises?|raised|funding|series|seed|round)/iu.test(eventText.raw);
    return lexicalMatches.length === 1 && eventHasFundingSignal ? lexicalMatches[0].entity : null;
  }
  if (
    candidates[1]
    && candidates[0].score === candidates[1].score
    && candidates[0].entity.entity_id !== candidates[1].entity.entity_id
  ) return null;
  return candidates[0].entity;
}

export function isEligibleFundingInsightEvent(event = {}) {
  return event.event_type === "funding"
    && (!event.event_status || ["announced", "completed"].includes(event.event_status))
    && event.publication_status === "verified"
    && Boolean(event.display_title_zh);
}

export function evidenceProblems(evidenceRefs = [], sourceById = new Map(), prefix = "evidence") {
  const problems = [];
  if (!Array.isArray(evidenceRefs) || !evidenceRefs.length) return [`${prefix}_missing`];
  for (const [index, evidence] of evidenceRefs.entries()) {
    const source = sourceById.get(evidence?.source_id);
    const quote = clean(evidence?.quote);
    if (!source) problems.push(`${prefix}_${index + 1}_source_unknown`);
    else if (!quote || !source.body_clean.includes(quote)) problems.push(`${prefix}_${index + 1}_quote_mismatch`);
  }
  return problems;
}

function exactInvestorEvidence(name = "", sources = []) {
  const investorName = clean(name);
  if (!investorName) return [];
  const escaped = investorName.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const relation = new RegExp(
    `(?:由|投资方|投资人).{0,220}${escaped}.{0,100}(?:领投|跟投|参投|共同投资|入股)|${escaped}.{0,120}(?:领投|跟投|参投|共同投资|入股)`,
    "iu",
  );
  for (const source of sources) {
    const body = String(source?.body_clean || "");
    let from = 0;
    while (from < body.length) {
      const index = body.indexOf(investorName, from);
      if (index < 0) break;
      const start = Math.max(
        body.lastIndexOf("。", index - 1),
        body.lastIndexOf("！", index - 1),
        body.lastIndexOf("？", index - 1),
        body.lastIndexOf("\n", index - 1),
      ) + 1;
      const ends = ["。", "！", "？", "\n"]
        .map((marker) => body.indexOf(marker, index + investorName.length))
        .filter((value) => value >= 0);
      const end = ends.length ? Math.min(...ends) + 1 : Math.min(body.length, index + investorName.length + 240);
      const quote = body.slice(start, end).trim();
      if (quote.length <= 500 && relation.test(quote)) {
        return [{ source_id: source.source_id, quote }];
      }
      from = index + investorName.length;
    }
  }
  return [];
}

export function ensureNamedCompanyEvidence(payload = {}, company = {}, sources = []) {
  if (!payload.company || payload.company.evidence_refs?.length) return payload;
  const names = [...new Set([payload.company.full_name, company.canonical_name]
    .map(clean)
    .filter(Boolean))];
  for (const source of sources) {
    const body = String(source?.body_clean || "");
    for (const name of names) {
      const index = body.indexOf(name);
      if (index < 0) continue;
      const start = Math.max(
        body.lastIndexOf("。", index - 1),
        body.lastIndexOf("！", index - 1),
        body.lastIndexOf("？", index - 1),
        body.lastIndexOf("\n", index - 1),
      ) + 1;
      const ends = ["。", "！", "？", "\n"]
        .map((marker) => body.indexOf(marker, index + name.length))
        .filter((value) => value >= 0);
      const end = ends.length ? Math.min(...ends) + 1 : Math.min(body.length, index + name.length + 240);
      const quote = body.slice(start, end).trim();
      if (quote && quote.length <= 500 && /(?:公司|企业|融资|机器人|人工智能|AI|模型|平台|产品)/iu.test(quote)) {
        payload.company.evidence_refs = [{ source_id: source.source_id, quote }];
        return payload;
      }
    }
  }
  return payload;
}

export function sanitizeResearchPayload(payload = {}, sources = []) {
  const sanitized = structuredClone(payload);
  const sourceById = new Map(sources.map((source) => [source.source_id, source]));
  const cleanRefs = (refs = []) => (Array.isArray(refs) ? refs : []).filter((evidence) => {
    const source = sourceById.get(evidence?.source_id);
    const quote = clean(evidence?.quote);
    return Boolean(source && quote && source.body_clean.includes(quote));
  });
  if (sanitized.company) sanitized.company.evidence_refs = cleanRefs(sanitized.company.evidence_refs);
  if (sanitized.financing) {
    sanitized.financing.evidence_refs = cleanRefs(sanitized.financing.evidence_refs);
    sanitized.financing.investors = (sanitized.financing.investors || [])
      .map((item) => {
        const evidenceRefs = cleanRefs(item.evidence_refs);
        return { ...item, evidence_refs: evidenceRefs.length ? evidenceRefs : exactInvestorEvidence(item.name, sources) };
      })
      .filter((item) => clean(item.name) && item.evidence_refs.length);
    sanitized.financing.other_round_investors = (sanitized.financing.other_round_investors || [])
      .map((item) => {
        const evidenceRefs = cleanRefs(item.evidence_refs);
        return { ...item, evidence_refs: evidenceRefs.length ? evidenceRefs : exactInvestorEvidence(item.name, sources) };
      })
      .filter((item) => clean(item.name) && item.evidence_refs.length);
  }
  sanitized.products = (sanitized.products || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => clean(item.name) && clean(item.description) && item.evidence_refs.length);
  sanitized.customers = (sanitized.customers || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => (
      clean(item.name)
      && item.evidence_refs.length
      && (!clean(item.use_case) || containsChinese(item.use_case))
    ));
  sanitized.comparisons = (sanitized.comparisons || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => (
      clean(item.name)
      && clean(item.product || item.positioning || item.scenario)
      && item.evidence_refs.length
      && containsChinese([
        item.product || item.positioning,
        item.scenario,
        item.target_customer,
        item.core_difference,
      ].filter(Boolean).join(" "))
    ));
  sanitized.metrics = (sanitized.metrics || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => clean(item.label) && containsChinese(item.label) && item.evidence_refs.length);
  sanitized.quotes = (sanitized.quotes || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => clean(item.speaker) && clean(item.quote) && item.evidence_refs.length);
  if (sanitized.analysis) {
    for (const [field, allowed] of [
      ["use_case_ids", FUNDING_USE_CASE_IDS],
      ["industry_ids", FUNDING_INDUSTRY_IDS],
      ["target_user_ids", FUNDING_TARGET_USER_IDS],
    ]) {
      if (Array.isArray(sanitized.analysis[field])) {
        sanitized.analysis[field] = [...new Set(sanitized.analysis[field]
          .map(clean)
          .filter((value) => allowed.has(value)))];
      }
    }
    const marketCategory = clean(sanitized.analysis.market_category_id);
    const marketApplication = clean(sanitized.analysis.market_application_id);
    const applicationParent = FUNDING_MARKET_APPLICATION_PARENTS.get(marketApplication);
    if (marketCategory === "infrastructure_compute" && applicationParent) {
      sanitized.analysis.market_subcategory_id = applicationParent;
    } else if (marketCategory !== "infrastructure_compute") {
      sanitized.analysis.market_application_id = "";
    }
    if (marketCategory === "physical_ai") {
      sanitized.analysis.market_subcategory_id = "";
      sanitized.analysis.market_application_id = "";
    }
    const investorNames = new Set((sanitized.financing?.investors || [])
      .map((item) => clean(item.name).toLowerCase())
      .filter(Boolean));
    sanitized.analysis.investment_rationale = (sanitized.analysis.investment_rationale || [])
      .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
      .filter((item) => (
        investorNames.has(clean(item.institution).toLowerCase())
        && clean(item.rationale)
        && clean(item.quote)
        && item.evidence_refs.some((evidence) => clean(evidence.quote).includes(clean(item.quote)))
      ));
  }
  return sanitized;
}

export function ensureCanonicalFundingEvidence(payload = {}, bundle = {}, event = {}, sources = []) {
  payload.financing = payload.financing || {};
  const claimById = new Map((bundle.claims || []).map((claim) => [claim.claim_id, claim]));
  const sourceByRawId = new Map(sources
    .filter((source) => source.raw_id)
    .map((source) => [source.raw_id, source]));
  for (const claimId of event.claim_refs || []) {
    const claim = claimById.get(claimId);
    const quote = clean(claim?.source_quote);
    const source = sourceByRawId.get(claim?.raw_id);
    if (
      claim?.claim_type === "funding"
      && claim?.verification_status === "accepted"
      && source
      && quote
    ) {
      // The accepted V4 claim was extracted from this raw document and keeps
      // the authoritative source span even when later body normalization
      // changes punctuation or whitespace.
      payload.financing.evidence_refs = [...new Map([
        { source_id: source.source_id, quote },
        ...(payload.financing.evidence_refs || []),
      ].map((item) => [`${item.source_id}|${item.quote}`, item])).values()];
      break;
    }
  }
  const eventAmount = canonicalFundingEventAmount(event);
  const suppliedAmount = clean(payload.financing.amount);
  const eventNormalized = normalizeFundingAmount(eventAmount);
  const suppliedNormalized = normalizeFundingAmount(suppliedAmount);
  if (eventNormalized.currency) {
    payload.financing.amount = eventAmount;
  } else if (!suppliedNormalized.currency) {
    const claimAmount = (event.claim_refs || [])
      .map((claimId) => claimById.get(claimId))
      .filter((claim) => claim?.claim_type === "funding" && claim?.verification_status === "accepted")
      .map((claim) => normalizeFundingAmount(claim.source_quote))
      .find((amount) => amount.currency);
    if (claimAmount) payload.financing.amount = claimAmount.display_zh;
  }
  if (/^\d{4}-\d{2}-\d{2}/u.test(clean(event.event_time))) {
    payload.financing.announced_at = clean(event.event_time).slice(0, 10);
  }
  const roundEvidence = [
    event.display_title_zh,
    event.object,
    ...(event.claim_refs || []).map((claimId) => claimById.get(claimId)?.source_quote),
  ].filter(Boolean).join(" ");
  const canonicalRound = normalizeFundingRound(roundEvidence);
  if (!["other", "undisclosed"].includes(canonicalRound.code)) {
    payload.financing.round = canonicalRound.label;
  }
  return payload;
}

export function referencedSourceIds(payload = {}) {
  const ids = new Set();
  const visit = (value) => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (typeof value.source_id === "string" && value.source_id) ids.add(value.source_id);
    for (const item of Object.values(value)) visit(item);
  };
  visit(payload);
  return ids;
}

export function researchPayloadProblems(payload = {}, sources = [], directionIds = []) {
  const problems = [];
  const sourceById = new Map(sources.map((source) => [source.source_id, source]));
  if (!clean(payload?.company?.full_name)) problems.push("company_full_name_missing");
  if (!clean(payload?.company?.summary)) problems.push("company_summary_missing");
  else if (!containsChinese(payload.company.summary)) problems.push("company_summary_not_chinese");
  problems.push(...evidenceProblems(payload?.company?.evidence_refs, sourceById, "company_evidence"));
  if (!clean(payload?.financing?.round)) problems.push("funding_round_missing");
  if (!clean(payload?.financing?.amount)) problems.push("funding_amount_missing");
  problems.push(...evidenceProblems(payload?.financing?.evidence_refs, sourceById, "financing_evidence"));
  if (!Array.isArray(payload?.financing?.investors) || !payload.financing.investors.length) {
    if (clean(payload?.financing?.investor_disclosure_status) !== "not_disclosed") {
      problems.push("investors_missing");
    }
  } else {
    for (const [index, investor] of payload.financing.investors.entries()) {
      if (!clean(investor?.name)) problems.push(`investor_${index + 1}_name_missing`);
      if (!clean(investor?.role) || !containsChinese(investor.role)) problems.push(`investor_${index + 1}_role_not_chinese`);
      problems.push(...evidenceProblems(investor?.evidence_refs, sourceById, `investor_${index + 1}_evidence`));
    }
    if (!partitionRoundInvestors(payload.financing.investors, payload.financing.round).current.length) {
      problems.push("current_round_investors_missing");
    }
  }
  for (const [index, investor] of (payload?.financing?.other_round_investors || []).entries()) {
    if (!clean(investor?.name)) problems.push(`other_round_investor_${index + 1}_name_missing`);
    if (!clean(investor?.role) || !containsChinese(investor.role)) {
      problems.push(`other_round_investor_${index + 1}_role_not_chinese`);
    }
    problems.push(...evidenceProblems(
      investor?.evidence_refs,
      sourceById,
      `other_round_investor_${index + 1}_evidence`,
    ));
  }
  if (!Array.isArray(payload?.products) || !payload.products.length) {
    problems.push("products_missing");
  } else {
    for (const [index, product] of payload.products.entries()) {
      if (!clean(product?.name) || !clean(product?.description)) problems.push(`product_${index + 1}_incomplete`);
      else if (!containsChinese(product.description)) problems.push(`product_${index + 1}_description_not_chinese`);
      problems.push(...evidenceProblems(product?.evidence_refs, sourceById, `product_${index + 1}_evidence`));
    }
  }
  for (const [group, items] of [
    ["customer", payload?.customers],
    ["comparison", payload?.comparisons],
    ["metric", payload?.metrics],
  ]) {
    if (!Array.isArray(items)) problems.push(`${group}s_must_be_array`);
    for (const [index, item] of (items || []).entries()) {
      if (!clean(item?.name || item?.label)) problems.push(`${group}_${index + 1}_name_missing`);
      const narrative = group === "customer"
        ? item?.use_case
        : group === "comparison"
          ? `${item?.product || item?.positioning || ""}${item?.scenario || ""}${item?.target_customer || ""}${item?.core_difference || ""}`
          : item?.label;
      if (clean(narrative) && !containsChinese(narrative)) problems.push(`${group}_${index + 1}_narrative_not_chinese`);
      if (group === "comparison" && !clean(item?.product || item?.positioning) && !clean(item?.scenario)) {
        problems.push(`comparison_${index + 1}_specifics_missing`);
      }
      problems.push(...evidenceProblems(item?.evidence_refs, sourceById, `${group}_${index + 1}_evidence`));
    }
  }
  if (!Array.isArray(payload?.analysis?.investment_rationale)) {
    problems.push("investment_rationale_must_be_array");
  } else {
    const investorNames = new Set((payload?.financing?.investors || []).map((item) => clean(item.name).toLowerCase()));
    for (const [index, item] of payload.analysis.investment_rationale.entries()) {
      if (!clean(item?.institution) || !investorNames.has(clean(item.institution).toLowerCase())) {
        problems.push(`investment_rationale_${index + 1}_institution_not_in_round`);
      }
      if (!clean(item?.rationale) || !containsChinese(item.rationale)) {
        problems.push(`investment_rationale_${index + 1}_rationale_not_chinese`);
      }
      if (!clean(item?.quote)) problems.push(`investment_rationale_${index + 1}_quote_missing`);
      else if (!(item.evidence_refs || []).some((evidence) => clean(evidence.quote).includes(clean(item.quote)))) {
        problems.push(`investment_rationale_${index + 1}_quote_not_cited`);
      }
      problems.push(...evidenceProblems(item?.evidence_refs, sourceById, `investment_rationale_${index + 1}_evidence`));
    }
  }
  if (!clean(payload?.analysis?.capital_judgment)) problems.push("capital_judgment_missing");
  else if (!containsChinese(payload.analysis.capital_judgment)) problems.push("capital_judgment_not_chinese");
  if (!clean(payload?.analysis?.product_form_id)) problems.push("product_form_id_missing");
  else if (!FUNDING_PRODUCT_FORM_IDS.has(clean(payload.analysis.product_form_id))) {
    problems.push("product_form_id_unknown");
  }
  if (!clean(payload?.analysis?.market_category_id)) problems.push("market_category_id_missing");
  else if (!FUNDING_MARKET_CATEGORY_IDS.has(clean(payload.analysis.market_category_id))) {
    problems.push("market_category_id_unknown");
  }
  if (payload?.analysis?.taxonomy_version !== "TAG-V4.1") problems.push("taxonomy_version_invalid");
  if (!FUNDING_MARKET_SUBCATEGORY_IDS.has(clean(payload?.analysis?.market_subcategory_id))) {
    problems.push("market_subcategory_id_unknown");
  }
  if (!FUNDING_MARKET_APPLICATION_IDS.has(clean(payload?.analysis?.market_application_id))) {
    problems.push("market_application_id_unknown");
  }
  if (clean(payload?.analysis?.market_category_id) !== "physical_ai" && !clean(payload?.analysis?.market_subcategory_id)) {
    problems.push("market_subcategory_id_missing");
  }
  if (clean(payload?.analysis?.market_category_id) === "infrastructure_compute" && !clean(payload?.analysis?.market_application_id)) {
    problems.push("market_application_id_missing");
  }
  problems.push(...marketHierarchyProblems(payload?.analysis));
  for (const [field, allowed] of [
    ["use_case_ids", FUNDING_USE_CASE_IDS],
    ["industry_ids", FUNDING_INDUSTRY_IDS],
    ["target_user_ids", FUNDING_TARGET_USER_IDS],
  ]) {
    const unknown = unknownListValues(payload?.analysis?.[field], allowed);
    if (unknown.length) problems.push(`${field}_${unknown[0] === "not_array" ? "missing" : "unknown"}`);
  }
  if (!payload?.analysis?.target_user_ids?.length) problems.push("target_user_ids_empty");
  if (!Array.isArray(payload?.analysis?.risks) || !payload.analysis.risks.length) problems.push("risks_missing");
  else if (payload.analysis.risks.some((risk) => !containsChinese(risk))) problems.push("risks_not_chinese");
  if (!containsChinese(payload?.analysis?.sector)) problems.push("sector_not_chinese");
  if (referencedSourceIds(payload).size < 2) problems.push("cited_research_sources_insufficient");
  if (payload?.analysis?.related_direction_id && !directionIds.includes(payload.analysis.related_direction_id)) {
    problems.push("related_direction_unknown");
  }
  return [...new Set(problems)];
}

export function fundingInsightProblems(card = {}) {
  const problems = [];
  if (card.schema_version !== FUNDING_INSIGHT_VERSION) problems.push("schema_version_invalid");
  if (!card.funding_insight_id) problems.push("funding_insight_id_missing");
  if (!card.triggered_by_event_id) problems.push("trigger_event_missing");
  if (!card.company?.entity_id || !card.company?.name) problems.push("company_entity_missing");
  if (!containsChinese(card.company?.summary)) problems.push("company_summary_not_chinese");
  if (!card.financing?.round || !card.financing?.amount) problems.push("financing_incomplete");
  const round = normalizeFundingRound(card.financing?.round_original || card.financing?.round);
  if (card.financing?.round_code !== round.code || card.financing?.round !== round.label) {
    problems.push("funding_round_not_normalized");
  }
  const normalizedAmount = normalizeFundingAmount(card.financing?.amount);
  if (card.financing?.amount_original !== card.financing?.amount) problems.push("funding_amount_original_mismatch");
  if (JSON.stringify(card.financing?.amount_normalized) !== JSON.stringify(normalizedAmount)) {
    problems.push("funding_amount_not_normalized");
  }
  const normalizedTotalRaised = normalizeFundingAmount(card.financing?.total_raised);
  if (card.financing?.total_raised_original !== clean(card.financing?.total_raised)) {
    problems.push("funding_total_raised_original_mismatch");
  }
  if (JSON.stringify(card.financing?.total_raised_normalized) !== JSON.stringify(normalizedTotalRaised)) {
    problems.push("funding_total_raised_not_normalized");
  }
  if (card.financing?.disclosure_status !== fundingDisclosureStatus(card.financing)) {
    problems.push("funding_disclosure_status_invalid");
  }
  if (!Array.isArray(card.financing?.investors) || !card.financing.investors.length) {
    if (card.financing?.investor_disclosure_status !== "not_disclosed") problems.push("investors_missing");
    if (!(card.financing?.risk_markers || []).includes("investors_missing")) {
      problems.push("investors_missing_risk_marker_missing");
    }
  } else if (
    card.financing?.investor_disclosure_status
    && card.financing.investor_disclosure_status !== "disclosed"
  ) {
    problems.push("investor_disclosure_status_invalid");
  }
  if ((card.financing?.investors || []).some((investor) => !investor.name || !investor.evidence_refs?.length)) {
    problems.push("investor_detail_incomplete");
  }
  if ((card.financing?.investors || []).some((investor) => !containsChinese(investor.role))) problems.push("investor_role_not_chinese");
  if (partitionRoundInvestors(card.financing?.investors || [], round).other.length) {
    problems.push("historical_investor_in_current_round");
  }
  if (!Array.isArray(card.financing?.other_round_investors)) problems.push("other_round_investors_missing");
  if (!Array.isArray(card.financing?.disclosures) || !card.financing.disclosures.length) problems.push("round_disclosures_missing");
  if (!Array.isArray(card.products) || !card.products.length) problems.push("products_missing");
  if ((card.products || []).some((product) => !product.name || !product.evidence_refs?.length)) problems.push("product_detail_incomplete");
  if ((card.products || []).some((product) => !containsChinese(product.description))) problems.push("product_description_not_chinese");
  if (!Array.isArray(card.research_sources) || card.research_sources.length < 2) problems.push("research_sources_insufficient");
  if (!Array.isArray(card.entity_links)) problems.push("entity_links_missing");
  if (!Array.isArray(card.funding_history)) problems.push("funding_history_missing");
  if (!card.analysis?.capital_judgment) problems.push("capital_judgment_missing");
  if (!containsChinese(card.analysis?.capital_judgment) || !containsChinese(card.analysis?.sector)) problems.push("analysis_not_chinese");
  if (card.analysis?.product_form_id && !FUNDING_PRODUCT_FORM_IDS.has(clean(card.analysis.product_form_id))) {
    problems.push("product_form_id_unknown");
  }
  if (card.analysis?.market_category_id && !FUNDING_MARKET_CATEGORY_IDS.has(clean(card.analysis.market_category_id))) {
    problems.push("market_category_id_unknown");
  }
  if (card.analysis?.taxonomy_version !== "TAG-V4.1") problems.push("taxonomy_version_invalid");
  if (!FUNDING_MARKET_SUBCATEGORY_IDS.has(clean(card.analysis?.market_subcategory_id))) problems.push("market_subcategory_id_unknown");
  if (!FUNDING_MARKET_APPLICATION_IDS.has(clean(card.analysis?.market_application_id))) problems.push("market_application_id_unknown");
  if (clean(card.analysis?.market_category_id) !== "physical_ai" && !clean(card.analysis?.market_subcategory_id)) {
    problems.push("market_subcategory_id_missing");
  }
  if (clean(card.analysis?.market_category_id) === "infrastructure_compute" && !clean(card.analysis?.market_application_id)) {
    problems.push("market_application_id_missing");
  }
  problems.push(...marketHierarchyProblems(card.analysis));
  for (const [field, allowed] of [
    ["use_case_ids", FUNDING_USE_CASE_IDS],
    ["industry_ids", FUNDING_INDUSTRY_IDS],
    ["target_user_ids", FUNDING_TARGET_USER_IDS],
  ]) {
    const unknown = unknownListValues(card.analysis?.[field], allowed);
    if (unknown.length) problems.push(`${field}_${unknown[0] === "not_array" ? "missing" : "unknown"}`);
  }
  if (!card.analysis?.target_user_ids?.length) problems.push("target_user_ids_empty");
  if (!Array.isArray(card.analysis?.investment_rationale)) problems.push("investment_rationale_missing");
  if ((card.analysis?.investment_rationale || []).some((item) => (
    !item.institution || !item.rationale || !item.quote || !item.evidence_refs?.length
  ))) problems.push("investment_rationale_incomplete");
  if (
    !card.analysis?.investment_thesis?.statement
    || !Array.isArray(card.analysis?.investment_thesis?.evidence_signals)
    || !Array.isArray(card.analysis?.investment_thesis?.risks)
    || !["disclosed", "not_disclosed"].includes(card.analysis?.investment_thesis?.institutional_rationale_status)
  ) problems.push("investment_thesis_incomplete");
  const customerStatus = card.customers?.length ? "verified_customers_found" : "no_verified_customer_found";
  if (
    card.customer_research?.status !== customerStatus
    || card.customer_research?.verified_customer_count !== (card.customers || []).length
  ) problems.push("customer_research_status_invalid");
  for (const key of ["products", "founders"]) {
    const coverage = card.entity_link_coverage?.[key];
    if (
      !coverage
      || !Number.isInteger(coverage.linked)
      || !Number.isInteger(coverage.total)
      || !Array.isArray(coverage.unresolved_names)
    ) problems.push(`${key}_entity_link_coverage_invalid`);
  }
  if (!Array.isArray(card.source_event_ids) || !card.source_event_ids.includes(card.triggered_by_event_id)) {
    problems.push("source_event_ids_invalid");
  }
  if (![
    "company_and_normalized_round",
    "reviewed_company_round_date_and_normalized_amount",
  ].includes(card.aggregation?.strategy)) problems.push("aggregation_contract_invalid");
  if ((card.analysis?.risks || []).some((risk) => !containsChinese(risk))) problems.push("risks_not_chinese");
  if (card.publication_status !== "auto_published") problems.push("publication_status_invalid");
  if (
    !card.auto_publish_gate?.passed
    || card.auto_publish_gate?.problems?.length
    || card.auto_publish_gate?.gate_version !== FUNDING_INSIGHT_GATE_VERSION
  ) problems.push("auto_publish_gate_invalid");
  return [...new Set(problems)];
}

export function verifiedFundingEventCardCoverageProblems(events = [], cards = [], queue = []) {
  const coveredEventIds = new Set(
    cards
      .filter((card) => (
        fundingInsightProblems(card).length === 0
        && fundingEvidenceProofProblems(card).length === 0
      ))
      .flatMap((card) => card.source_event_ids || [card.triggered_by_event_id])
      .filter(Boolean),
  );
  for (const item of queue) {
    if (item.status === "deduplicated" && item.event_id) coveredEventIds.add(item.event_id);
  }
  return [...new Set(
    events
      .filter((event) => event.event_type === "funding")
      .filter((event) => event.publication_status === "verified")
      .filter((event) => event.display_title_zh)
      .map((event) => event.event_id)
      .filter(Boolean),
  )]
    .filter((eventId) => !coveredEventIds.has(eventId))
    .map((eventId) => `${eventId}:verified_funding_event_without_valid_card`);
}
