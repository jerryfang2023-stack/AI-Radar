import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const defaultInput = path.resolve(projectRoot, "..", "01-SiteV2", "site", "data", "funding-insights-v1.json");
const dataDir = path.resolve(projectRoot, "miniprogram", "data");

const chinaMarkers = [
  "china", "中国", "beijing", "北京", "shanghai", "上海", "shenzhen", "深圳", "hangzhou", "杭州",
  "guangzhou", "广州", "chengdu", "成都", "suzhou", "苏州", "wuhan", "武汉", "hong kong", "香港",
];

const text = (value) => String(value ?? "").trim();
const list = (value) => (Array.isArray(value) ? value : []);
const unique = (values) => [...new Set(values.filter(Boolean))];
const shorten = (value, limit = 88) => {
  const normalized = text(value).replace(/\s+/gu, " ");
  return normalized.length > limit ? `${normalized.slice(0, limit - 1)}…` : normalized;
};

export function roundGroup(roundCode = "", roundLabel = "") {
  const value = `${roundCode} ${roundLabel}`.toLowerCase();
  if (/pre[_ -]?seed|seed|angel|种子|天使/u.test(value)) return "early";
  if (/series[_ -]?[abc]|[abc]轮/u.test(value)) return "growth";
  if (/series[_ -]?[defghij]|[defghij]轮|late|ipo/u.test(value)) return "late";
  return "other";
}

export function regionFor(headquarters = "") {
  const value = text(headquarters).toLowerCase();
  if (!value) return "undisclosed";
  return chinaMarkers.some((marker) => value.includes(marker)) ? "china" : "overseas";
}

function evidenceStatus(card) {
  const sources = list(card.research_sources);
  if (sources.length >= 2) return { id: "multi", label: "多源已核验" };
  if (sources.some((source) => /official|公司|投资方/u.test(`${source.source_class} ${source.publisher}`))) {
    return { id: "official", label: "官方单源" };
  }
  return { id: "single", label: "单源披露" };
}

function leadInvestor(card) {
  const investors = list(card.financing?.investors);
  return investors.find((item) => text(item.role).includes("领投")) || investors[0] || null;
}

function collectEvidenceQuotes(value, output = [], seen = new Set()) {
  if (!value || typeof value !== "object") return output;
  if (Array.isArray(value)) {
    value.forEach((item) => collectEvidenceQuotes(item, output, seen));
    return output;
  }
  if (value.source_id && value.quote) {
    const key = `${value.source_id}|${value.quote}`;
    if (!seen.has(key)) {
      seen.add(key);
      output.push({ sourceId: text(value.source_id), quote: shorten(value.quote, 220) });
    }
  }
  Object.values(value).forEach((item) => collectEvidenceQuotes(item, output, seen));
  return output;
}

function projectCard(card) {
  const financing = card.financing || {};
  const company = card.company || {};
  const evidence = evidenceStatus(card);
  const lead = leadInvestor(card);
  const headquarters = text(company.headquarters);
  const marketRegion = card.market_scope?.market_region === "CN" ? "china" : "global";
  const investors = list(financing.investors).map((item) => ({ name: text(item.name), role: text(item.role) }));
  const companyName = text(company.name || company.full_name) || "未披露公司";
  const products = unique(list(card.products).map((item) => text(item.name)).filter(Boolean));
  const amount = financing.amount_normalized?.display_zh || financing.amount_original || financing.amount || "未披露";
  const cumulative = financing.cumulative_amount?.normalized?.display_zh || financing.cumulative_amount?.original
    || financing.total_raised_normalized?.display_zh || financing.total_raised_original || financing.total_raised || "未披露";
  const sourceQuotes = collectEvidenceQuotes(card);
  const sources = list(card.research_sources)
    .slice(0, 6)
    .map((source) => ({
      id: text(source.source_id),
      title: text(source.title) || "原始来源",
      publisher: text(source.publisher) || "来源未标注",
      url: text(source.source_url),
      quotes: sourceQuotes.filter((item) => item.sourceId === text(source.source_id)).slice(0, 2).map((item) => item.quote),
    }))
    .filter((source) => /^https?:\/\//.test(source.url));

  const summary = {
    id: text(card.funding_insight_id),
    company: companyName,
    initial: companyName.slice(0, 1).toUpperCase(),
    summary: shorten(company.summary, 90) || "公司介绍暂未披露",
    products,
    categoryId: text(card.market_category?.id),
    category: text(card.market_category?.name) || "未分类",
    subcategory: text(card.market_subcategory?.name),
    productForm: text(card.product_form?.name),
    round: text(financing.round) || "轮次未披露",
    roundCode: text(financing.round_code),
    roundGroup: roundGroup(financing.round_code, financing.round),
    amount,
    amountCurrency: text(financing.amount_normalized?.currency),
    amountValue: Number(financing.amount_normalized?.value) || 0,
    date: text(financing.announced_at || card.as_of_date),
    leadInvestor: lead ? text(lead.name) : "投资方未披露",
    investorsText: investors.map((item) => item.name).join(" "),
    headquarters: headquarters || "未披露",
    region: regionFor(headquarters),
    marketRegion,
    marketLabel: marketRegion === "china" ? "中国区" : "全球其他",
    evidenceId: evidence.id,
    evidenceLabel: evidence.label,
    sourceCount: sources.length,
  };

  const detail = {
    ...summary,
    companySummary: text(company.summary) || "公司介绍暂未披露",
    website: text(company.website),
    cumulativeAmount: cumulative,
    disclosureStatus: text(financing.disclosure_status || financing.investor_disclosure_status) || "未披露",
    investors,
    signals: unique(list(card.analysis?.validated_signals).map(text)).slice(0, 8),
    risks: unique(list(card.analysis?.risks).map(text)).slice(0, 8),
    capitalJudgment: text(card.analysis?.capital_judgment),
    products: list(card.products).slice(0, 8).map((item) => ({ name: text(item.name), description: text(item.description || item.summary) })).filter((item) => item.name),
    customers: list(card.customers).slice(0, 8).map((item) => ({ name: text(item.name), description: text(item.description || item.relationship) })).filter((item) => item.name),
    history: list(card.historical_rounds).slice(0, 12).map((item) => ({
      round: text(item.round || item.round_original) || "轮次未披露",
      amount: item.amount_normalized?.display_zh || text(item.amount_original) || "未披露",
      date: text(item.announced_at),
      current: Boolean(item.is_current),
    })),
    sources,
  };

  return { summary, detail };
}

export function projectFundingData(source) {
  const projected = list(source.cards).map(projectCard).filter((item) => item.summary.id);
  projected.sort((a, b) => b.summary.date.localeCompare(a.summary.date) || a.summary.company.localeCompare(b.summary.company));
  const cards = projected.map((item) => item.summary);
  const details = Object.fromEntries(projected.map((item) => [item.detail.id, item.detail]));
  const categories = unique(cards.map((item) => item.categoryId)).map((id) => {
    const match = cards.find((item) => item.categoryId === id);
    return { id, name: match?.category || "未分类", count: cards.filter((item) => item.categoryId === id).length };
  }).sort((a, b) => b.count - a.count);
  const rounds = Object.entries(cards.reduce((acc, item) => {
    acc[item.round] = (acc[item.round] || 0) + 1;
    return acc;
  }, {})).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  const multiCount = cards.filter((item) => item.evidenceId === "multi").length;
  const meta = {
    schemaVersion: "GUANLAN-MINIPROGRAM-DATA-V1.0",
    sourceSchemaVersion: text(source.meta?.schema_version),
    fundingVersion: text(source.meta?.column_version || source.meta?.funding_insight_version),
    taxonomyVersion: text(source.meta?.taxonomy_version),
    latestDate: text(source.meta?.latest_date),
    generatedAt: text(source.meta?.generated_at),
    cardCount: cards.length,
    categoryCount: categories.length,
    multiSourceRate: cards.length ? Math.round((multiCount / cards.length) * 100) : 0,
    disclosedAmountCount: cards.filter((item) => item.amountValue > 0).length,
    chinaMarketCardCount: cards.filter((item) => item.marketRegion === "china").length,
  };
  return { index: { meta, categories, rounds, cards }, details };
}

function writeModule(file, value, banner) {
  fs.writeFileSync(file, `${banner}\nmodule.exports = ${JSON.stringify(value)};\n`, "utf8");
}

export function build(inputFile = defaultInput) {
  const source = JSON.parse(fs.readFileSync(inputFile, "utf8"));
  const projected = projectFundingData(source);
  fs.mkdirSync(dataDir, { recursive: true });
  writeModule(path.join(dataDir, "funding-index.js"), projected.index, "// Generated by scripts/build-funding-data.mjs. Do not edit.");
  writeModule(path.join(dataDir, "funding-details.js"), projected.details, "// Generated by scripts/build-funding-data.mjs. Do not edit.");
  return projected;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const input = process.argv[2] ? path.resolve(process.argv[2]) : defaultInput;
  const result = build(input);
  console.log(JSON.stringify({ cards: result.index.meta.cardCount, latestDate: result.index.meta.latestDate, output: dataDir }, null, 2));
}
