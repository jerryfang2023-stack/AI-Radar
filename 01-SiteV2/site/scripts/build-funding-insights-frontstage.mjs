#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_FRONTSTAGE_VERSION,
  FUNDING_INSIGHT_VERSION,
  fundingInsightProblems,
  readJson,
  writeJson,
} from "../../../agent-workflow/tools/funding-insight-v1-utils.mjs";
import { extractMoneyAmounts } from "../../../agent-workflow/tools/source-title-translation-generator.mjs";

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

export function fundingProductFormId(card) {
  const searchText = [
    card.analysis?.sector,
    card.company?.summary,
    ...(card.products || []).flatMap((item) => [item.name, item.description]),
  ].filter(Boolean).join(" ");
  return PRODUCT_FORM_RULES.find(([, pattern]) => pattern.test(searchText))?.[0] || "ai_application";
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

function productFormNames(projectRoot) {
  const taxonomy = readJson(path.join(projectRoot, "agent-workflow/product/tag-taxonomy-v4.json"), {});
  const productForm = (taxonomy.facets || []).find((facet) => facet.id === "product_form");
  return new Map((productForm?.values || [])
    .filter((value) => value.status === "active")
    .map((value) => [value.id, value.name]));
}

function fundingRoundKey(value = "") {
  const text = String(value || "").toLowerCase().replace(/[\s_-]+/gu, "");
  if (/preseed|种子前/u.test(text)) return "pre_seed";
  if (/seed|种子|天使/u.test(text)) return "seed";
  if (/growth|成长/u.test(text)) return "growth";
  if (/preipo/u.test(text)) return "pre_ipo";
  if (/\bipo\b/u.test(text)) return "ipo";
  const series = text.match(/^(?:series)?([a-f])(\d+)?(?:round|轮)?/iu);
  if (series) return `series_${series[1].toLowerCase()}${series[2] || ""}`;
  return text;
}

function fundingAmountKey(value = "") {
  const amount = extractMoneyAmounts(value)[0];
  return amount ? `${amount.currency || "UNKNOWN"}:${amount.value}` : "";
}

export function dedupeFundingRounds(inputCards = []) {
  const cards = [...inputCards].sort((left, right) => (
    String(right.published_at || "").localeCompare(String(left.published_at || ""))
  ));
  const accepted = [];
  for (const card of cards) {
    const companyKey = card.company?.entity_id || String(card.company?.name || "").trim().toLowerCase();
    const roundKey = fundingRoundKey(card.financing?.round);
    const amountKey = fundingAmountKey(card.financing?.amount);
    const announcedAt = Date.parse(card.financing?.announced_at || "");
    const duplicate = accepted.some((current) => {
      const currentCompanyKey = current.company?.entity_id || String(current.company?.name || "").trim().toLowerCase();
      const currentAnnouncedAt = Date.parse(current.financing?.announced_at || "");
      return companyKey
        && companyKey === currentCompanyKey
        && roundKey
        && roundKey === fundingRoundKey(current.financing?.round)
        && amountKey
        && amountKey === fundingAmountKey(current.financing?.amount)
        && Number.isFinite(announcedAt)
        && Number.isFinite(currentAnnouncedAt)
        && Math.abs(announcedAt - currentAnnouncedAt) <= 7 * 24 * 60 * 60 * 1000;
    });
    if (!duplicate) accepted.push(card);
  }
  return accepted;
}

export function buildFundingInsightsFrontstage(projectRoot = root) {
  const bundles = listBundles(projectRoot);
  const directions = directionById(projectRoot);
  const productForms = productFormNames(projectRoot);
  const entityIndex = readJson(path.join(projectRoot, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), {});
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
  const cards = dedupeFundingRounds([...cardByEvent.values()])
    .sort((left, right) => {
      return String(right.as_of_date || "").localeCompare(String(left.as_of_date || ""))
        || String(right.financing?.announced_at || "").localeCompare(String(left.financing?.announced_at || ""))
        || String(right.published_at || "").localeCompare(String(left.published_at || ""));
    })
    .map((card) => {
      const productFormId = fundingProductFormId(card);
      const productFormName = productForms.get(productFormId);
      if (!productFormName) throw new Error(`Unknown TAG-V4 product_form value: ${productFormId}`);
      return {
        ...card,
        application_category: {
          dimension: "product_form",
          id: productFormId,
          name: productFormName,
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
  const usedProductFormIds = new Set(cards.map((card) => card.application_category?.id).filter(Boolean));
  const productFormFilters = [...productForms.entries()]
    .filter(([id]) => usedProductFormIds.has(id))
    .map(([id, name]) => ({ dimension: "product_form", id, name }));
  return {
    meta: {
      schema_version: FUNDING_INSIGHT_FRONTSTAGE_VERSION,
      funding_insight_version: FUNDING_INSIGHT_VERSION,
      site_version: "SITE-V4.2.0-entity-history",
      column_version: "FUNDING-INSIGHT-V1.0-auto-published-research",
      latest_date: latestDate,
      generated_at: generatedAt,
      card_count: cards.length,
      duplicate_rounds_removed: cardByEvent.size - cards.length,
      automatic_publication: true,
    },
    filters: {
      rounds: [...new Set(cards.map((card) => card.financing.round).filter(Boolean))].sort(),
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
  writeJson(output, data);
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(projectRoot, output).replace(/\\/gu, "/"),
    cards: data.cards.length,
    latest_date: data.meta.latest_date,
  }, null, 2));
  return data;
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) writeFundingInsightsFrontstage(root);
