#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_FRONTSTAGE_VERSION,
  FUNDING_INSIGHT_VERSION,
  buildFundingEntityReviewQueue,
  fundingInsightProblems,
  normalizeFundingInsightCard,
  normalizeFundingAmount,
  normalizeFundingRound,
  readJson,
  writeJson,
} from "../../../agent-workflow/tools/funding-insight-v1-utils.mjs";
import { investmentInstitutionId } from "../../../agent-workflow/product/investment-institution-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

export function fundingProductFormDecision(card) {
  const explicitId = String(card.analysis?.product_form_id || "").trim();
  if (explicitId) return { id: explicitId, method: "card_explicit", decision_id: "" };
  throw new Error(`Funding card is missing explicit product_form_id: ${card.triggered_by_event_id || "unknown"}`);
}

export function fundingProductFormId(card) {
  return fundingProductFormDecision(card).id;
}

export function fundingMarketCategoryDecision(card) {
  const explicitId = String(card.analysis?.market_category_id || "").trim();
  if (explicitId) return { id: explicitId, method: "card_explicit", decision_id: "" };
  throw new Error(`Funding card is missing explicit market_category_id: ${card.triggered_by_event_id || "unknown"}`);
}

function listBundles(projectRoot) {
  const dir = path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
    .sort()
    .map((file) => readJson(path.join(dir, file)))
    .filter(Boolean);
}

function directionById(projectRoot) {
  const data = readJson(path.join(projectRoot, "01-SiteV2/site/data/opportunity-evidence-v2.json"), {});
  return new Map((data.directionCards || []).map((card) => [card.id, { id: card.id, title: card.title }]));
}

function facetValueNames(projectRoot, facetId) {
  const taxonomy = readJson(path.join(projectRoot, "agent-workflow/product/tag-taxonomy-v4.json"), {});
  const facet = (taxonomy.facets || []).find((item) => item.id === facetId);
  return new Map((facet?.values || [])
    .filter((value) => value.status === "active")
    .map((value) => [value.id, value.name]));
}

function productFormNames(projectRoot) {
  return facetValueNames(projectRoot, "product_form");
}

function normalizedListKey(value = "") {
  return String(value || "").normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function uniqueObjects(items = [], keyFor = (item) => JSON.stringify(item)) {
  const seen = new Set();
  const output = [];
  for (const item of items.filter(Boolean)) {
    const key = keyFor(item);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function amountFingerprint(card) {
  const amount = card.financing?.amount_normalized
    || normalizeFundingAmount(card.financing?.amount_original || card.financing?.amount || "");
  return [
    amount.currency || "",
    amount.status || "",
    amount.value ?? "",
    amount.min_value ?? "",
    amount.max_value ?? "",
    amount.status === "unparsed" ? normalizedListKey(card.financing?.amount_original || card.financing?.amount) : "",
  ].join(":");
}

function aggregationFingerprint(card) {
  const companyKey = card.company?.application_entity_id
    || card.company?.entity_id
    || normalizedListKey(card.company?.name);
  const round = normalizeFundingRound(card.financing?.round_original || card.financing?.round);
  return `${companyKey}|${round.code}|${amountFingerprint(card)}`;
}

function aggregationKey(card) {
  return `${aggregationFingerprint(card)}|${card.financing?.announced_at || "undated"}`;
}

function datesRepresentSameDisclosure(left = "", right = "") {
  if (!left || !right) return left === right;
  const leftTime = Date.parse(`${left}T00:00:00Z`);
  const rightTime = Date.parse(`${right}T00:00:00Z`);
  return Number.isFinite(leftTime) && Number.isFinite(rightTime)
    && Math.abs(leftTime - rightTime) <= 3 * 24 * 60 * 60 * 1000;
}

function cardCompleteness(card) {
  return (card.research_sources || []).length * 2
    + (card.financing?.investors || []).length
    + (card.financing?.other_round_investors || []).length
    + (card.company?.founders || []).length
    + (card.products || []).length
    + (card.customers || []).length;
}

function selectBestCumulativeDisclosure(group) {
  return [...group]
    .filter((card) => card.financing?.total_raised_normalized?.currency)
    .sort((left, right) => {
      const leftAmount = left.financing.total_raised_normalized;
      const rightAmount = right.financing.total_raised_normalized;
      const comparable = leftAmount.currency === rightAmount.currency;
      const leftValue = leftAmount.value ?? leftAmount.min_value ?? -1;
      const rightValue = rightAmount.value ?? rightAmount.min_value ?? -1;
      return (comparable ? rightValue - leftValue : 0)
        || String(right.published_at || "").localeCompare(String(left.published_at || ""));
    })[0] || null;
}

function mergeFundingCardGroup(group, entityIndex, entityDecisions, companyIdentityReview) {
  const ranked = [...group].sort((left, right) => (
    cardCompleteness(right) - cardCompleteness(left)
    || String(right.published_at || "").localeCompare(String(left.published_at || ""))
    || String(left.triggered_by_event_id || "").localeCompare(String(right.triggered_by_event_id || ""))
  ));
  const base = structuredClone(ranked[0]);
  const sourceEventIds = uniqueObjects(
    group.flatMap((card) => card.source_event_ids || [card.triggered_by_event_id]),
    (value) => value,
  );
  const named = (items) => uniqueObjects(items, (item) => normalizedListKey(item?.name));
  base.company.founders = named(group.flatMap((card) => card.company?.founders || []));
  base.financing.investors = named(group.flatMap((card) => card.financing?.investors || []));
  base.financing.other_round_investors = named(
    group.flatMap((card) => card.financing?.other_round_investors || []),
  );
  base.financing.disclosures = uniqueObjects(group.map((card) => ({
    event_id: card.triggered_by_event_id,
    round_original: card.financing?.round_original || card.financing?.round || "",
    amount: card.financing?.amount || "",
    announced_at: card.financing?.announced_at || "",
    evidence_refs: card.financing?.evidence_refs || [],
  })), (item) => item.event_id);
  const disclosedDates = group.map((card) => card.financing?.announced_at || "").filter(Boolean).sort();
  if (disclosedDates.length) base.financing.announced_at = disclosedDates[0];
  const bestCumulative = selectBestCumulativeDisclosure(group);
  if (bestCumulative) {
    base.financing.total_raised = bestCumulative.financing.total_raised;
    base.financing.total_raised_original = bestCumulative.financing.total_raised_original;
    base.financing.total_raised_normalized = bestCumulative.financing.total_raised_normalized;
  }
  base.products = named(group.flatMap((card) => card.products || []));
  base.customers = named(group.flatMap((card) => card.customers || []));
  base.comparisons = named(group.flatMap((card) => card.comparisons || []));
  base.metrics = uniqueObjects(
    group.flatMap((card) => card.metrics || []),
    (item) => `${normalizedListKey(item?.label)}|${normalizedListKey(item?.value)}`,
  );
  base.quotes = uniqueObjects(
    group.flatMap((card) => card.quotes || []),
    (item) => `${normalizedListKey(item?.speaker)}|${normalizedListKey(item?.quote)}`,
  );
  base.analysis.investment_rationale = uniqueObjects(
    group.flatMap((card) => card.analysis?.investment_rationale || []),
    (item) => `${normalizedListKey(item?.institution)}|${normalizedListKey(item?.quote)}`,
  );
  base.analysis.validated_signals = uniqueObjects(
    group.flatMap((card) => card.analysis?.validated_signals || []),
    (item) => normalizedListKey(item),
  );
  base.analysis.risks = uniqueObjects(
    group.flatMap((card) => card.analysis?.risks || []),
    (item) => normalizedListKey(item),
  );
  base.funding_history = uniqueObjects(
    group.flatMap((card) => card.funding_history || []),
    (item) => item?.event_id,
  );
  base.research_sources = uniqueObjects(
    group.flatMap((card) => card.research_sources || []),
    (item) => item?.source_id,
  );
  base.source_event_ids = sourceEventIds;
  const stableKey = aggregationKey(base);
  base.funding_insight_id = `FI-${crypto.createHash("sha1").update(stableKey).digest("hex").slice(0, 16)}`;
  base.aggregation = {
    key: stableKey,
    event_count: sourceEventIds.length,
    strategy: "reviewed_company_round_date_and_normalized_amount",
  };
  return normalizeFundingInsightCard(base, entityIndex, entityDecisions, companyIdentityReview);
}

export function aggregateFundingRoundCards(
  inputCards = [],
  entityIndex = {},
  entityDecisions = {},
  companyIdentityReview = {},
) {
  const groups = new Map();
  const cards = [...inputCards]
    .sort((left, right) => String(right.published_at || "").localeCompare(String(left.published_at || "")))
    .map((card) => normalizeFundingInsightCard(card, entityIndex, entityDecisions, companyIdentityReview));
  for (const card of cards) {
    const fingerprint = aggregationFingerprint(card);
    if (!groups.has(fingerprint)) groups.set(fingerprint, []);
    const clusters = groups.get(fingerprint);
    const eventIds = new Set(card.source_event_ids || [card.triggered_by_event_id].filter(Boolean));
    const cluster = clusters.find((items) => items.some((item) => (
      datesRepresentSameDisclosure(item.financing?.announced_at, card.financing?.announced_at)
      || (item.source_event_ids || [item.triggered_by_event_id].filter(Boolean)).some((id) => eventIds.has(id))
    )));
    if (cluster) cluster.push(card);
    else clusters.push([card]);
  }
  return [...groups.values()].flat().map((group) => (
    mergeFundingCardGroup(group, entityIndex, entityDecisions, companyIdentityReview)
  ));
}

export function dedupeFundingRounds(inputCards = []) {
  return aggregateFundingRoundCards(inputCards);
}

function cumulativeKnownRoundAmounts(companyCards = []) {
  const totals = new Map();
  for (const card of companyCards) {
    if (card.financing?.round_code === "multi_round") continue;
    const amount = card.financing?.amount_normalized;
    const pointValue = Number.isFinite(amount?.value) ? amount.value : null;
    const minValue = Number.isFinite(amount?.min_value) ? amount.min_value : pointValue;
    const maxValue = Number.isFinite(amount?.max_value) ? amount.max_value : pointValue;
    if (!amount?.currency || !Number.isFinite(minValue) || !["exact", "approximate", "lower_bound", "range"].includes(amount.status)) continue;
    if (!totals.has(amount.currency)) totals.set(amount.currency, {
      value: 0,
      min_value: 0,
      max_value: 0,
      round_count: 0,
      has_lower_bound: false,
      has_range: false,
      has_approximate: false,
    });
    const total = totals.get(amount.currency);
    total.value += pointValue || 0;
    total.min_value += minValue;
    total.max_value = Number.isFinite(total.max_value) && Number.isFinite(maxValue)
      ? total.max_value + maxValue
      : null;
    total.round_count += 1;
    total.has_lower_bound ||= amount.status === "lower_bound";
    total.has_range ||= amount.status === "range";
    total.has_approximate ||= amount.status === "approximate";
    if (amount.status === "lower_bound") total.max_value = null;
  }
  const symbols = { USD: "$", EUR: "€", GBP: "£", CNY: "￥", JPY: "" };
  return [...totals.entries()].map(([currency, total]) => {
    const suffix = currency === "JPY" ? "日元" : "";
    const amountText = (value, prefix = "") => normalizeFundingAmount(`${prefix}${symbols[currency] || ""}${value}${suffix}`).display_zh;
    const status = total.has_lower_bound
      ? "lower_bound"
      : total.has_range
        ? "range"
        : total.has_approximate
          ? "approximate"
          : "exact";
    const displayZh = status === "range"
      ? `${amountText(total.min_value)}–${amountText(total.max_value)}`
      : amountText(total.min_value, status === "lower_bound" ? "超过 " : status === "approximate" ? "约 " : "");
    return {
      currency,
      value: ["exact", "approximate"].includes(status) ? total.min_value : null,
      min_value: status === "exact" ? null : total.min_value,
      max_value: status === "range" ? total.max_value : null,
      unit: "base",
      round_count: total.round_count,
      status,
      display_zh: displayZh,
    };
  });
}

export function enrichFundingHistory(cards = []) {
  const byCompany = new Map();
  for (const card of cards) {
    const key = card.company?.application_entity_id
      || card.company?.entity_id
      || normalizedListKey(card.company?.name);
    if (!byCompany.has(key)) byCompany.set(key, []);
    byCompany.get(key).push(card);
  }
  return cards.map((card) => {
    const key = card.company?.application_entity_id
      || card.company?.entity_id
      || normalizedListKey(card.company?.name);
    const companyCards = byCompany.get(key) || [card];
    const historicalRounds = companyCards.map((entry) => ({
      funding_insight_id: entry.funding_insight_id,
      event_ids: entry.source_event_ids || [entry.triggered_by_event_id].filter(Boolean),
      round: entry.financing?.round || "",
      round_code: entry.financing?.round_code || "",
      round_original: entry.financing?.round_original || "",
      amount_original: entry.financing?.amount_original || entry.financing?.amount || "",
      amount_normalized: entry.financing?.amount_normalized || null,
      announced_at: entry.financing?.announced_at || "",
      disclosure_status: entry.financing?.disclosure_status || "unknown",
      is_summary: entry.financing?.round_code === "multi_round",
      counts_toward_known_total: entry.financing?.round_code !== "multi_round",
      is_current: entry.funding_insight_id === card.funding_insight_id,
    })).sort((left, right) => right.announced_at.localeCompare(left.announced_at));
    const companyEventIds = new Set(companyCards.flatMap((entry) => (
      entry.source_event_ids || [entry.triggered_by_event_id].filter(Boolean)
    )));
    const fundingHistory = uniqueObjects(
      companyCards
        .flatMap((entry) => entry.funding_history || [])
        .filter((entry) => companyEventIds.has(entry?.event_id)),
      (entry) => entry?.event_id,
    );
    const sourceTotal = card.financing?.total_raised_normalized;
    return {
      ...card,
      funding_history: fundingHistory,
      financing: {
        ...card.financing,
        cumulative_amount: {
          original: card.financing?.total_raised_original || card.financing?.total_raised || "",
          normalized: sourceTotal || normalizeFundingAmount(""),
          basis: sourceTotal?.currency ? "source_disclosed" : "known_rounds_only",
          known_round_totals: cumulativeKnownRoundAmounts(companyCards),
          historical_round_count: historicalRounds.length,
        },
        investors: (card.financing?.investors || []).map((item) => ({
          ...item,
          institution_id: investmentInstitutionId(item.name, item.entity_id || ""),
        })),
        other_round_investors: (card.financing?.other_round_investors || []).map((item) => ({
          ...item,
          institution_id: investmentInstitutionId(item.name, item.entity_id || ""),
        })),
      },
      historical_rounds: historicalRounds,
    };
  });
}

export function buildFundingInsightsFrontstage(projectRoot = root) {
  const bundles = listBundles(projectRoot);
  const directions = directionById(projectRoot);
  const productForms = productFormNames(projectRoot);
  const marketCategories = facetValueNames(projectRoot, "ai_market_category");
  const marketSubcategories = facetValueNames(projectRoot, "ai_market_subcategory");
  const marketApplications = facetValueNames(projectRoot, "ai_market_application");
  const entityIndex = readJson(path.join(projectRoot, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), {});
  const entityDecisions = readJson(
    path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights/entity-link-decisions.json"),
    {},
  );
  const companyIdentityReview = readJson(path.join(
    projectRoot,
    "01-SiteV2/content/12-applications/funding-insights/company-identity-decisions.json",
  ), {});
  const relationshipEntityIds = new Set([
    ...(entityIndex.companies || []),
    ...(entityIndex.products || []),
    ...(entityIndex.people || []),
  ].map((entity) => entity.id));
  const cardByEvent = new Map();
  for (const bundle of bundles) {
    for (const card of bundle.cards || []) {
      if (fundingInsightProblems(card).length) continue;
      const current = cardByEvent.get(card.triggered_by_event_id);
      if (!current || card.published_at > current.published_at) cardByEvent.set(card.triggered_by_event_id, card);
    }
  }
  const cards = enrichFundingHistory(aggregateFundingRoundCards(
    [...cardByEvent.values()],
    entityIndex,
    entityDecisions,
    companyIdentityReview,
  ))
    .sort((left, right) => {
      return String(right.as_of_date || "").localeCompare(String(left.as_of_date || ""))
        || String(right.financing?.announced_at || "").localeCompare(String(left.financing?.announced_at || ""))
        || String(right.published_at || "").localeCompare(String(left.published_at || ""));
    })
    .map((card) => {
      const productFormDecision = fundingProductFormDecision(card);
      const productFormId = productFormDecision.id;
      const productFormName = productForms.get(productFormId);
      if (!productFormName) throw new Error(`Unknown TAG-V4 product_form value: ${productFormId}`);
      const marketCategoryDecision = fundingMarketCategoryDecision(card);
      const marketCategoryName = marketCategories.get(marketCategoryDecision.id);
      if (!marketCategoryName) {
        throw new Error(`Unknown TAG-V4 ai_market_category value: ${marketCategoryDecision.id}`);
      }
      const marketSubcategoryId = String(card.analysis?.market_subcategory_id || "").trim();
      const marketApplicationId = String(card.analysis?.market_application_id || "").trim();
      const marketSubcategoryName = marketSubcategoryId ? marketSubcategories.get(marketSubcategoryId) : "";
      const marketApplicationName = marketApplicationId ? marketApplications.get(marketApplicationId) : "";
      if (marketSubcategoryId && !marketSubcategoryName) {
        throw new Error(`Unknown TAG-V4 ai_market_subcategory value: ${marketSubcategoryId}`);
      }
      if (marketApplicationId && !marketApplicationName) {
        throw new Error(`Unknown TAG-V4 ai_market_application value: ${marketApplicationId}`);
      }
      return {
        ...card,
        product_form: {
          dimension: "product_form",
          id: productFormId,
          name: productFormName,
          method: productFormDecision.method,
          decision_id: productFormDecision.decision_id,
        },
        market_category: {
          dimension: "ai_market_category",
          id: marketCategoryDecision.id,
          name: marketCategoryName,
          method: marketCategoryDecision.method,
          decision_id: marketCategoryDecision.decision_id,
        },
        market_subcategory: marketSubcategoryId ? {
          dimension: "ai_market_subcategory",
          id: marketSubcategoryId,
          name: marketSubcategoryName,
          method: "card_explicit",
        } : null,
        market_application: marketApplicationId ? {
          dimension: "ai_market_application",
          id: marketApplicationId,
          name: marketApplicationName,
          method: "card_explicit",
        } : null,
        analysis: {
          ...card.analysis,
          related_direction: directions.get(card.analysis?.related_direction_id) || null,
        },
        links: {
          company: card.company.canonical_entity_consistent && relationshipEntityIds.has(card.company.entity_id)
            ? `data-center.html?view=index&detail=entity&id=${encodeURIComponent(card.company.entity_id)}`
            : "",
          relation_map: card.company.canonical_entity_consistent && relationshipEntityIds.has(card.company.entity_id)
            ? `data-center.html?view=relations&entity=${encodeURIComponent(card.company.entity_id)}`
            : "",
          funding_event: `data-center.html?view=events&detail=event&id=${encodeURIComponent(card.triggered_by_event_id)}`,
          direction: card.analysis?.related_direction_id ? "opportunity-map.html#direction-cards" : "",
        },
      };
    });
  const latestDate = bundles.map((bundle) => bundle.meta?.date || "").sort().at(-1) || "";
  const generatedAt = [
    ...bundles.map((bundle) => bundle.meta?.generated_at || ""),
    ...cards.map((card) => card.published_at || ""),
  ].filter(Boolean).sort().at(-1) || "";
  const usedProductFormIds = new Set(cards.map((card) => card.product_form?.id).filter(Boolean));
  const productFormFilters = [...productForms.entries()]
    .filter(([id]) => usedProductFormIds.has(id))
    .map(([id, name]) => ({ dimension: "product_form", id, name }));
  const marketCategoryFilters = [...marketCategories.entries()]
    .filter(([id]) => cards.some((card) => card.market_category?.id === id))
    .map(([id, name]) => ({ dimension: "ai_market_category", id, name }));
  const marketSubcategoryFilters = [...marketSubcategories.entries()]
    .filter(([id]) => cards.some((card) => card.market_subcategory?.id === id))
    .map(([id, name]) => ({ dimension: "ai_market_subcategory", id, name }));
  const marketApplicationFilters = [...marketApplications.entries()]
    .filter(([id]) => cards.some((card) => card.market_application?.id === id))
    .map(([id, name]) => ({ dimension: "ai_market_application", id, name }));
  return {
    meta: {
      schema_version: FUNDING_INSIGHT_FRONTSTAGE_VERSION,
      funding_insight_version: FUNDING_INSIGHT_VERSION,
      site_version: "SITE-V4.6.1-research-retirement",
      column_version: "FUNDING-INSIGHT-V1.4.0-financing-fields",
      taxonomy_version: "TAG-V4.1",
      latest_date: latestDate,
      generated_at: generatedAt,
      card_count: cards.length,
      duplicate_rounds_removed: cardByEvent.size - cards.length,
      automatic_publication: true,
      market_category_framework: {
        name: "CB Insights AI 100 2026",
        url: "https://www.cbinsights.com/research/report/artificial-intelligence-top-startups-2026/",
        categories: ["Infrastructure & compute", "Enterprise applications", "Industry applications", "Physical AI"],
      },
    },
    filters: {
      rounds: [...new Set(cards.map((card) => card.financing.round).filter(Boolean))].sort(),
      market_categories: marketCategoryFilters,
      market_subcategories: marketSubcategoryFilters,
      market_applications: marketApplicationFilters,
      product_forms: productFormFilters,
      directions: [...new Map(cards
        .map((card) => card.analysis?.related_direction)
        .filter(Boolean)
        .map((item) => [item.id, item])).values()],
    },
    cards,
  };
}

export function writeFundingInsightsFrontstage(projectRoot = root) {
  const data = buildFundingInsightsFrontstage(projectRoot);
  const output = path.join(projectRoot, "01-SiteV2/site/data/funding-insights-v1.json");
  const entityIndex = readJson(
    path.join(projectRoot, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"),
    {},
  );
  const entityDecisions = readJson(
    path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights/entity-link-decisions.json"),
    {},
  );
  const companyIdentityReview = readJson(path.join(
    projectRoot,
    "01-SiteV2/content/12-applications/funding-insights/company-identity-decisions.json",
  ), {});
  const entityReviewQueue = buildFundingEntityReviewQueue(listBundles(projectRoot)
    .flatMap((bundle) => bundle.cards || [])
    .map((card) => normalizeFundingInsightCard(
      card,
      entityIndex,
      entityDecisions,
      companyIdentityReview,
    )));
  const entityReviewOutput = path.join(
    projectRoot,
    "01-SiteV2/content/12-applications/funding-insights/entity-review-queue.json",
  );
  writeJson(output, data);
  writeJson(entityReviewOutput, entityReviewQueue);
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(projectRoot, output).replace(/\\/gu, "/"),
    cards: data.cards.length,
    entity_review_candidates: entityReviewQueue.meta.candidate_count,
    latest_date: data.meta.latest_date,
  }, null, 2));
  return data;
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) writeFundingInsightsFrontstage(root);
