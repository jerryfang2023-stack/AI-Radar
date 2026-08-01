#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_FRONTSTAGE_VERSION,
  FUNDING_INSIGHT_VERSION,
  buildFundingEntityReviewQueue,
  fundingInsightProblems,
  normalizeFundingInsightCard,
  normalizeFundingRound,
  readJson,
  writeJson,
} from "../../../agent-workflow/tools/funding-insight-v1-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

const PRODUCT_FORM_RULES = [
  ["chip_accelerator", /(?:芯片|半导体|加速器|ASIC|GPU\s*IP|EDA)/iu],
  ["compute_system", /(?:算力|推理云|新云|Neocloud|数据中心|GPU\s*集群|计算系统)/iu],
  ["robot", /(?:机器人|具身|Physical\s*AI|物理\s*AI|仓库自动化)/iu],
  ["ai_device", /(?:AI\s*设备|AI\s*硬件|消费硬件|智能硬件|家居设计)/iu],
  ["security_product", /(?:AI\s*安全|智能体安全|安全与治理|网络安全|邮件安全|身份与访问|隐私增强)/iu],
  ["developer_tool", /(?:开发者|编程|编码|代码|软件开发|软件交付|IDE|低代码|无代码|CAD|设计工具)/iu],
  ["model", /(?:基础模型|大模型|前沿模型|世界模型|视觉推理|语音.*模型|模型与能力)/iu],
  ["api_service", /(?:\bAPI\b|模型服务)/iu],
  ["data_infrastructure", /(?:AI\s*基础设施|人工智能基础设施|推理优化|模型路由|模型推理|MLOps|数据平台|网络基础设施|记忆与成本)/iu],
  ["enterprise_platform", /(?:企业|工作流|智能体|自动化|销售|营销|客服|供应链|采购|投标|法律|合规|金融|保险|医疗|教育|政府|建筑|工业|制药)/iu],
];

const INFRASTRUCTURE_PRODUCT_FORMS = new Set([
  "model",
  "api_service",
  "data_infrastructure",
  "chip_accelerator",
  "compute_system",
  "compute_service",
]);

function legacyFundingProductFormId(card) {
  const searchText = [
    card.analysis?.sector,
    card.company?.summary,
    ...(card.products || []).flatMap((item) => [item.name, item.description]),
  ].filter(Boolean).join(" ");
  return PRODUCT_FORM_RULES.find(([, pattern]) => pattern.test(searchText))?.[0] || "ai_application";
}

export function fundingProductFormDecision(card, manualDecisions = new Map()) {
  const explicitId = String(card.analysis?.product_form_id || "").trim();
  if (explicitId) return { id: explicitId, method: "card_explicit", decision_id: "" };

  const eventIds = [...new Set([
    card.triggered_by_event_id,
    ...(card.source_event_ids || []),
  ].filter(Boolean))];
  const matches = eventIds.map((eventId) => manualDecisions.get(eventId)).filter(Boolean);
  const productFormIds = [...new Set(matches.map((item) => item.product_form_id))];
  if (productFormIds.length > 1) {
    throw new Error(`Conflicting product-form decisions for ${eventIds.join(", ")}`);
  }
  if (matches.length) {
    return {
      id: matches[0].product_form_id,
      method: "manual_review",
      decision_id: matches[0].decision_id,
    };
  }
  return { id: legacyFundingProductFormId(card), method: "legacy_heuristic", decision_id: "" };
}

export function fundingProductFormId(card, manualDecisions = new Map()) {
  return fundingProductFormDecision(card, manualDecisions).id;
}

export function fundingMarketCategoryDecision(card, manualDecisions = new Map(), productFormId = "") {
  const explicitId = String(card.analysis?.market_category_id || "").trim();
  if (explicitId) return { id: explicitId, method: "card_explicit", decision_id: "" };
  const eventIds = [...new Set([
    card.triggered_by_event_id,
    ...(card.source_event_ids || []),
  ].filter(Boolean))];
  const matches = eventIds.map((eventId) => manualDecisions.get(eventId)).filter(Boolean);
  const categoryIds = [...new Set(matches.map((item) => item.market_category_id))];
  if (categoryIds.length > 1) {
    throw new Error(`Conflicting market-category decisions for ${eventIds.join(", ")}`);
  }
  if (matches.length) {
    return {
      id: matches[0].market_category_id,
      method: "manual_review",
      decision_id: matches[0].decision_id,
    };
  }
  if (INFRASTRUCTURE_PRODUCT_FORMS.has(productFormId)) {
    return { id: "ai_infrastructure", method: "product_form_fallback", decision_id: "" };
  }
  if (productFormId === "robot") {
    return { id: "vertical_ai", method: "product_form_fallback", decision_id: "" };
  }
  return { id: "horizontal_ai", method: "product_form_fallback", decision_id: "" };
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

export function productFormDecisionMap(
  projectRoot,
  productForms = productFormNames(projectRoot),
  marketCategories = facetValueNames(projectRoot, "ai_market_category"),
) {
  const file = path.join(
    projectRoot,
    "01-SiteV2/content/12-applications/funding-insights/product-form-decisions.json",
  );
  if (!fs.existsSync(file)) return new Map();
  const ledger = readJson(file, {});
  const decisions = ledger.decisions || [];
  if (ledger.meta?.decision_count !== decisions.length) {
    throw new Error("Funding product-form decision count does not match metadata");
  }
  const decisionIds = new Set();
  const byEventId = new Map();
  for (const decision of decisions) {
    if (!decision.decision_id || decisionIds.has(decision.decision_id)) {
      throw new Error(`Duplicate or missing product-form decision id: ${decision.decision_id || "missing"}`);
    }
    decisionIds.add(decision.decision_id);
    if (!productForms.has(decision.product_form_id)) {
      throw new Error(`Unknown product_form in ${decision.decision_id}: ${decision.product_form_id}`);
    }
    if (!marketCategories.has(decision.market_category_id)) {
      throw new Error(`Unknown market_category in ${decision.decision_id}: ${decision.market_category_id}`);
    }
    if (!decision.company_name || !decision.rationale) {
      throw new Error(`Missing company_name or rationale in ${decision.decision_id}`);
    }
    if (!Array.isArray(decision.event_ids) || !decision.event_ids.length) {
      throw new Error(`Missing event_ids in ${decision.decision_id}`);
    }
    for (const eventId of decision.event_ids) {
      if (byEventId.has(eventId)) throw new Error(`Duplicate product-form event decision: ${eventId}`);
      byEventId.set(eventId, decision);
    }
  }
  return byEventId;
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

function aggregationKey(card) {
  const companyKey = card.company?.entity_id || normalizedListKey(card.company?.name);
  const round = normalizeFundingRound(card.financing?.round_original || card.financing?.round);
  return `${companyKey}|${round.code}`;
}

function mergeFundingCardGroup(group, entityIndex, entityDecisions, companyIdentityReview) {
  const base = structuredClone(group[0]);
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
  base.aggregation = {
    key: aggregationKey(base),
    event_count: sourceEventIds.length,
    strategy: "company_and_normalized_round",
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
    const key = aggregationKey(card);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(card);
  }
  return [...groups.values()].map((group) => (
    mergeFundingCardGroup(group, entityIndex, entityDecisions, companyIdentityReview)
  ));
}

export function dedupeFundingRounds(inputCards = []) {
  return aggregateFundingRoundCards(inputCards);
}

export function buildFundingInsightsFrontstage(projectRoot = root) {
  const bundles = listBundles(projectRoot);
  const directions = directionById(projectRoot);
  const productForms = productFormNames(projectRoot);
  const marketCategories = facetValueNames(projectRoot, "ai_market_category");
  const productFormDecisions = productFormDecisionMap(projectRoot, productForms, marketCategories);
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
  const cards = aggregateFundingRoundCards(
    [...cardByEvent.values()],
    entityIndex,
    entityDecisions,
    companyIdentityReview,
  )
    .sort((left, right) => {
      return String(right.as_of_date || "").localeCompare(String(left.as_of_date || ""))
        || String(right.financing?.announced_at || "").localeCompare(String(left.financing?.announced_at || ""))
        || String(right.published_at || "").localeCompare(String(left.published_at || ""));
    })
    .map((card) => {
      const productFormDecision = fundingProductFormDecision(card, productFormDecisions);
      const productFormId = productFormDecision.id;
      const productFormName = productForms.get(productFormId);
      if (!productFormName) throw new Error(`Unknown TAG-V4 product_form value: ${productFormId}`);
      const marketCategoryDecision = fundingMarketCategoryDecision(
        card,
        productFormDecisions,
        productFormId,
      );
      const marketCategoryName = marketCategories.get(marketCategoryDecision.id);
      if (!marketCategoryName) {
        throw new Error(`Unknown TAG-V4 ai_market_category value: ${marketCategoryDecision.id}`);
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
        analysis: {
          ...card.analysis,
          related_direction: directions.get(card.analysis?.related_direction_id) || null,
        },
        links: {
          company: `data-center.html?view=index&detail=entity&id=${encodeURIComponent(card.company.entity_id)}`,
          relation_map: relationshipEntityIds.has(card.company.entity_id)
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
  return {
    meta: {
      schema_version: FUNDING_INSIGHT_FRONTSTAGE_VERSION,
      funding_insight_version: FUNDING_INSIGHT_VERSION,
      site_version: "SITE-V4.4.1-china-market-scope",
      column_version: "FUNDING-INSIGHT-V1.2.0-market-category",
      latest_date: latestDate,
      generated_at: generatedAt,
      card_count: cards.length,
      duplicate_rounds_removed: cardByEvent.size - cards.length,
      automatic_publication: true,
      market_category_framework: {
        name: "CB Insights AI 100",
        url: "https://www.cbinsights.com/research/report/artificial-intelligence-top-startups-2025/",
        categories: ["AI Infrastructure", "Horizontal AI", "Vertical AI"],
      },
    },
    filters: {
      rounds: [...new Set(cards.map((card) => card.financing.round).filter(Boolean))].sort(),
      market_categories: marketCategoryFilters,
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
