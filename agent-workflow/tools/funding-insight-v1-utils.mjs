import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const FUNDING_INSIGHT_VERSION = "FUNDING-INSIGHT-V1.0";
export const FUNDING_INSIGHT_FRONTSTAGE_VERSION = "FUNDING-INSIGHT-FRONTSTAGE-V1.0";
export const FUNDING_INSIGHT_PROMPT_VERSION = "FUNDING-INSIGHT-DEEPSEEK-V1.1";

export function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
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
    rawDocuments: readJson(path.join(dir, "raw-documents.json"), []),
    sourceArtifacts: readJson(path.join(dir, "source-artifacts.json"), []),
  };
}

function normalizedName(value = "") {
  return clean(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
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

export function subjectCompanyForEvent(event, entities) {
  const byId = new Map(entities.map((entity) => [entity.entity_id, entity]));
  const title = normalizedName(event.display_title_zh);
  const candidates = (event.entities || [])
    .map((id, index) => ({ entity: byId.get(id), index }))
    .filter(({ entity }) => entity?.entity_type === "organization_candidate")
    .map(({ entity, index }) => ({
      entity,
      score: title.includes(normalizedName(entity.canonical_name)) ? 20 : 0,
      index,
    }))
    .sort((left, right) => right.score - left.score || left.index - right.index);
  return candidates[0]?.entity || null;
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
      .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
      .filter((item) => clean(item.name) && item.evidence_refs.length);
  }
  sanitized.products = (sanitized.products || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => clean(item.name) && clean(item.description) && item.evidence_refs.length);
  sanitized.customers = (sanitized.customers || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => clean(item.name) && item.evidence_refs.length);
  sanitized.comparisons = (sanitized.comparisons || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => (
      clean(item.name)
      && clean(item.product || item.positioning || item.scenario)
      && item.evidence_refs.length
    ));
  sanitized.metrics = (sanitized.metrics || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => clean(item.label) && item.evidence_refs.length);
  sanitized.quotes = (sanitized.quotes || [])
    .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
    .filter((item) => clean(item.speaker) && clean(item.quote) && item.evidence_refs.length);
  if (sanitized.analysis) {
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
  if (!payload.financing || payload.financing.evidence_refs?.length) return payload;
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
      && source.body_clean.includes(quote)
    ) {
      payload.financing.evidence_refs = [{ source_id: source.source_id, quote }];
      break;
    }
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
    problems.push("investors_missing");
  } else {
    for (const [index, investor] of payload.financing.investors.entries()) {
      if (!clean(investor?.name)) problems.push(`investor_${index + 1}_name_missing`);
      if (!clean(investor?.role) || !containsChinese(investor.role)) problems.push(`investor_${index + 1}_role_not_chinese`);
      problems.push(...evidenceProblems(investor?.evidence_refs, sourceById, `investor_${index + 1}_evidence`));
    }
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
  if (!Array.isArray(card.financing?.investors) || !card.financing.investors.length) problems.push("investors_missing");
  if ((card.financing?.investors || []).some((investor) => !investor.name || !investor.evidence_refs?.length)) {
    problems.push("investor_detail_incomplete");
  }
  if ((card.financing?.investors || []).some((investor) => !containsChinese(investor.role))) problems.push("investor_role_not_chinese");
  if (!Array.isArray(card.products) || !card.products.length) problems.push("products_missing");
  if ((card.products || []).some((product) => !product.name || !product.evidence_refs?.length)) problems.push("product_detail_incomplete");
  if ((card.products || []).some((product) => !containsChinese(product.description))) problems.push("product_description_not_chinese");
  if (!Array.isArray(card.research_sources) || card.research_sources.length < 2) problems.push("research_sources_insufficient");
  if (!Array.isArray(card.entity_links)) problems.push("entity_links_missing");
  if (!Array.isArray(card.funding_history)) problems.push("funding_history_missing");
  if (!card.analysis?.capital_judgment) problems.push("capital_judgment_missing");
  if (!containsChinese(card.analysis?.capital_judgment) || !containsChinese(card.analysis?.sector)) problems.push("analysis_not_chinese");
  if (!Array.isArray(card.analysis?.investment_rationale)) problems.push("investment_rationale_missing");
  if ((card.analysis?.investment_rationale || []).some((item) => (
    !item.institution || !item.rationale || !item.quote || !item.evidence_refs?.length
  ))) problems.push("investment_rationale_incomplete");
  if ((card.analysis?.risks || []).some((risk) => !containsChinese(risk))) problems.push("risks_not_chinese");
  if (card.publication_status !== "auto_published") problems.push("publication_status_invalid");
  if (!card.auto_publish_gate?.passed || card.auto_publish_gate?.problems?.length) problems.push("auto_publish_gate_invalid");
  return [...new Set(problems)];
}
