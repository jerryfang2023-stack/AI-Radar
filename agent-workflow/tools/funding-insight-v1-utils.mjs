import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { hydrateRawDocument } from "./lib/private-evidence-store.mjs";

export const FUNDING_INSIGHT_VERSION = "FUNDING-INSIGHT-V1.1";
export const FUNDING_INSIGHT_FRONTSTAGE_VERSION = "FUNDING-INSIGHT-FRONTSTAGE-V1.1";
export const FUNDING_INSIGHT_PROMPT_VERSION = "FUNDING-INSIGHT-DEEPSEEK-V1.2";
export const FUNDING_INSIGHT_GATE_VERSION = "FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.1";
export const INVESTORS_MISSING_RISK = "本轮具体投资方未披露，投资人结构与背书强度无法核验。";

export function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
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

export function partitionRoundInvestors(investors = [], roundValue = "") {
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
    const specifiedRound = !["other", "undisclosed"].includes(roleRound.code);
    const matchesTarget = specifiedRound && (
      targetRound.code === "multi_round"
      || roleRound.code === targetRound.code
    );
    if (
      explicitCurrent
      || matchesTarget
      || (!explicitOther && !specifiedRound && genericCurrentRole)
    ) {
      current.push(investor);
      continue;
    }
    other.push({
      ...investor,
      round_context: specifiedRound
        ? roleRound
        : { code: "undisclosed", label: FUNDING_ROUND_LABELS.undisclosed, original: role },
      classification_reason: explicitOther
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

export function normalizeFundingInsightCard(inputCard = {}, entityIndex = {}, decisionFile = {}) {
  const card = structuredClone(inputCard);
  const resolve = entityResolver(entityIndex);
  const acceptedDecisions = acceptedFundingEntityDecisions(entityIndex, decisionFile);
  const storedOriginalRound = clean(card.financing?.round_original);
  const storedRound = clean(card.financing?.round);
  const normalizedOriginalRound = normalizeFundingRound(storedOriginalRound);
  const round = normalizeFundingRound(
    storedOriginalRound && storedRound === normalizedOriginalRound.label
      ? storedOriginalRound
      : storedRound || storedOriginalRound,
  );
  const partitioned = partitionRoundInvestors(card.financing?.investors || [], round);
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
    founders,
  };
  card.financing = {
    ...(card.financing || {}),
    round: round.label,
    round_code: round.code,
    round_original: round.original,
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
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  let score = 0;
  if (new RegExp(`(?:^|[\\s:：|｜—-])${escaped}`, "iu").test(haystack)) score += 20;
  if (new RegExp(`${escaped}.{0,24}(?:获|完成|宣布|融资|筹集|募资|估值|ipo|raises?|raised|funding|series|seed|round)`, "iu").test(haystack)) {
    score += 45;
  }
  if (new RegExp(`(?:投资|领投|back(?:ed)?|invest(?:s|ed|ment)?).{0,36}${escaped}`, "iu").test(haystack)) {
    score += 55;
  }
  if (new RegExp(`${escaped}.{0,12}(?:投资|领投|back(?:ed)?|invest(?:s|ed|ment)?)`, "iu").test(haystack)) {
    score -= 35;
  }
  if (new RegExp(`(?:获|得到|backed by).{0,36}${escaped}.{0,16}(?:支持|背书|backing)`, "iu").test(haystack)) {
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

function subjectCandidate(entity, index, eventText) {
  const canonicalName = entity.canonical_name || entity.name;
  const inferredName = descriptiveCompanyTail(canonicalName);
  const names = [canonicalName, ...(entity.aliases || []), inferredName].filter(Boolean);
  const scores = names.map((name) => {
    const normalized = normalizedName(name);
    const lexical = eventText.normalized.includes(normalized) ? Math.min(30, normalized.length) : 0;
    return lexical + subjectSignalScore(eventText.raw, name);
  });
  const bestScore = Math.max(0, ...scores);
  const bestName = names[scores.indexOf(bestScore)];
  return {
    entity: inferredName && bestName === inferredName
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
    sanitized.financing.other_round_investors = (sanitized.financing.other_round_investors || [])
      .map((item) => ({ ...item, evidence_refs: cleanRefs(item.evidence_refs) }))
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
  if (card.aggregation?.strategy !== "company_and_normalized_round") problems.push("aggregation_contract_invalid");
  if ((card.analysis?.risks || []).some((risk) => !containsChinese(risk))) problems.push("risks_not_chinese");
  if (card.publication_status !== "auto_published") problems.push("publication_status_invalid");
  if (
    !card.auto_publish_gate?.passed
    || card.auto_publish_gate?.problems?.length
    || card.auto_publish_gate?.gate_version !== FUNDING_INSIGHT_GATE_VERSION
  ) problems.push("auto_publish_gate_invalid");
  return [...new Set(problems)];
}

export function verifiedFundingEventCardCoverageProblems(events = [], cards = []) {
  const coveredEventIds = new Set(
    cards
      .filter((card) => (
        fundingInsightProblems(card).length === 0
        && fundingEvidenceProofProblems(card).length === 0
      ))
      .flatMap((card) => card.source_event_ids || [card.triggered_by_event_id])
      .filter(Boolean),
  );
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
