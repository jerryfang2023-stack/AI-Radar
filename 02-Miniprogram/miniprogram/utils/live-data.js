const bundledFundingIndex = require("../data/funding-index.js");
const bundledFundingDetails = require("../data/funding-details.js");
const bundledReportIndex = require("../data/report-index.js");
const bundledReportDetails = require("../data/report-details.js");

const API_ROOT = "https://www.zkdlj.vip/data";
const DAY_MS = 24 * 60 * 60 * 1000;
const chinaMarkers = [
  "china", "中国", "beijing", "北京", "shanghai", "上海", "shenzhen", "深圳", "hangzhou", "杭州",
  "guangzhou", "广州", "chengdu", "成都", "suzhou", "苏州", "wuhan", "武汉", "hong kong", "香港",
];

let fundingState = { index: bundledFundingIndex, details: bundledFundingDetails, source: "bundled" };
let reportState = { index: bundledReportIndex, details: bundledReportDetails, source: "bundled" };
let fundingRequest = null;
let reportRequest = null;

const text = (value) => String(value == null ? "" : value).trim();
const list = (value) => (Array.isArray(value) ? value : []);
const shorten = (value, limit = 90) => {
  const normalized = text(value).replace(/\s+/g, " ");
  return normalized.length > limit ? `${normalized.slice(0, limit - 1)}…` : normalized;
};

function roundGroup(roundCode = "", roundLabel = "") {
  const value = `${roundCode} ${roundLabel}`.toLowerCase();
  if (/pre[_ -]?seed|seed|angel|种子|天使/.test(value)) return "early";
  if (/series[_ -]?[abc]|[abc]轮/.test(value)) return "growth";
  if (/series[_ -]?[defghij]|[defghij]轮|late|ipo/.test(value)) return "late";
  return "other";
}

function headquartersRegion(headquarters = "") {
  const value = text(headquarters).toLowerCase();
  if (!value) return "undisclosed";
  return chinaMarkers.some((marker) => value.includes(marker)) ? "china" : "overseas";
}

function amountDisplay(value = {}, original = "") {
  return text(value.display_zh) || text(original) || "未披露";
}

function versionParts(value = "") {
  const match = text(value).match(/V(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : [];
}

function versionIsOlder(candidate, baseline) {
  const left = versionParts(candidate);
  const right = versionParts(baseline);
  if (!left.length || !right.length) return true;
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    if ((left[index] || 0) !== (right[index] || 0)) return (left[index] || 0) < (right[index] || 0);
  }
  return false;
}

function projectPortalCard(card) {
  const financing = card.financing || {};
  const company = card.company || {};
  const investors = list(financing.investors).map((item) => ({ name: text(item.name), role: text(item.role) }));
  const sources = list(card.sources).filter((item) => /^https?:\/\//.test(text(item.url))).slice(0, 8).map((item) => ({
    id: text(item.id),
    title: text(item.title) || "原始来源",
    publisher: text(item.publisher) || "来源未标注",
    url: text(item.url),
    quotes: [],
  }));
  const sourceCount = Number(card.sourceCount) || sources.length;
  const evidenceId = sourceCount >= 2 ? "multi" : "single";
  const evidenceLabel = sourceCount >= 2 ? "多源已核验" : "单源披露";
  const companyName = text(company.name || company.fullName) || "未披露公司";
  const headquarters = text(company.headquarters);
  const marketRegion = card.marketRegion === "CN" ? "china" : "global";
  const amount = amountDisplay(financing.amountNormalized, financing.amountOriginal || financing.amount);
  const cumulativeAmount = amountDisplay(financing.cumulativeAmount?.normalized, financing.cumulativeAmount?.original || financing.totalRaised);
  const lead = investors.find((item) => item.role.includes("领投")) || investors[0];
  const summary = {
    id: text(card.id),
    company: companyName,
    initial: companyName.slice(0, 1).toUpperCase(),
    summary: shorten(company.summary) || "公司介绍暂未披露",
    categoryId: text(card.categoryId),
    category: text(card.category) || "未分类",
    subcategory: text(card.subcategory),
    productForm: text(card.productForm),
    round: text(financing.round) || "轮次未披露",
    roundCode: text(financing.roundCode),
    roundGroup: roundGroup(financing.roundCode, financing.round),
    amount,
    amountCurrency: text(financing.amountNormalized?.currency),
    amountValue: Number(financing.amountNormalized?.value) || 0,
    date: text(financing.announcedAt || card.asOfDate),
    leadInvestor: lead ? lead.name : "投资方未披露",
    investorsText: investors.map((item) => item.name).join(" "),
    headquarters: headquarters || "未披露",
    region: headquartersRegion(headquarters),
    marketRegion,
    marketLabel: marketRegion === "china" ? "中国区" : "全球其他",
    evidenceId,
    evidenceLabel,
    sourceCount,
  };
  return {
    summary,
    detail: {
      ...summary,
      companySummary: text(company.summary) || "公司介绍暂未披露",
      website: text(company.website),
      founders: list(company.founders).map((item) => ({ name: text(item.name), role: text(item.role) })).filter((item) => item.name),
      cumulativeAmount,
      disclosureStatus: text(financing.disclosureStatus || financing.investorDisclosureStatus) || "未披露",
      investors,
      signals: list(card.analysis?.investmentThesis?.evidenceSignals),
      risks: list(card.analysis?.investmentThesis?.risks),
      capitalJudgment: text(card.analysis?.investmentThesis?.statement || card.analysis?.capitalJudgment),
      institutionRationales: list(card.analysis?.investmentRationale).slice(0, 8).map((item) => ({
        institution: text(item.institution),
        speaker: text(item.speaker),
        speakerRole: text(item.speakerRole),
        rationale: text(item.rationale),
      })).filter((item) => item.institution || item.rationale),
      products: list(card.productDetails).slice(0, 8).map((item) => ({
        name: text(item.name),
        description: text(item.description),
        targetCustomers: text(item.targetCustomers),
        features: list(item.features).slice(0, 8).map(text).filter(Boolean),
      })).filter((item) => item.name),
      customers: list(card.customers).slice(0, 8).map((item) => ({
        name: text(item.name),
        description: text(item.description || item.relationship),
      })).filter((item) => item.name),
      metrics: list(card.metrics).slice(0, 8).map((item) => ({
        label: text(item.label), value: text(item.value), observedAt: text(item.observedAt),
      })).filter((item) => item.label || item.value),
      comparisons: list(card.comparisons).slice(0, 8).map((item) => ({
        name: text(item.name || item.product),
        scenario: text(item.scenario),
        difference: text(item.coreDifference),
      })).filter((item) => item.name || item.difference),
      history: list(card.historicalRounds).slice(0, 12).map((item) => ({
        round: text(item.round || item.roundOriginal) || "轮次未披露",
        amount: amountDisplay(item.amountNormalized, item.amountOriginal),
        date: text(item.announcedAt),
        current: Boolean(item.isCurrent),
      })),
      sources,
    },
  };
}

function assertFundingPayload(data) {
  const cards = list(data?.cards);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text(data?.meta?.latestDate))) throw new Error("远端融资日期无效");
  if (!cards.length || data.meta.cardCount !== cards.length) throw new Error("远端融资数量无效");
  if (new Set(cards.map((item) => item.id)).size !== cards.length) throw new Error("远端融资存在重复 ID");
  if (versionIsOlder(data.meta.sourceColumnVersion, bundledFundingIndex.meta.fundingVersion)) throw new Error("远端融资版本回退");
  if (data.meta.latestDate < bundledFundingIndex.meta.latestDate) throw new Error("远端融资日期回退");
}

function projectPortalFundingData(data) {
  assertFundingPayload(data);
  const projected = list(data.cards).map(projectPortalCard).filter((item) => item.summary.id);
  projected.sort((a, b) => b.summary.date.localeCompare(a.summary.date) || a.summary.company.localeCompare(b.summary.company, "zh-CN"));
  const cards = projected.map((item) => item.summary);
  const categories = [...new Set(cards.map((item) => item.categoryId).filter(Boolean))].map((id) => {
    const match = cards.find((item) => item.categoryId === id);
    return { id, name: match?.category || "未分类", count: cards.filter((item) => item.categoryId === id).length };
  }).sort((a, b) => b.count - a.count);
  const rounds = Object.entries(cards.reduce((result, item) => {
    result[item.round] = (result[item.round] || 0) + 1;
    return result;
  }, {})).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  return {
    index: {
      meta: {
        schemaVersion: "GUANLAN-MINIPROGRAM-DATA-V1.1",
        sourceSchemaVersion: text(data.meta.sourceSchemaVersion),
        fundingVersion: text(data.meta.sourceColumnVersion),
        latestDate: text(data.meta.latestDate),
        generatedAt: text(data.meta.generatedAt),
        cardCount: cards.length,
        categoryCount: categories.length,
        multiSourceRate: cards.length ? Math.round((cards.filter((item) => item.evidenceId === "multi").length / cards.length) * 100) : 0,
        disclosedAmountCount: cards.filter((item) => item.amountValue > 0).length,
        chinaMarketCardCount: cards.filter((item) => item.marketRegion === "china").length,
        live: true,
      },
      categories,
      rounds,
      cards,
    },
    details: Object.fromEntries(projected.map((item) => [item.detail.id, item.detail])),
  };
}

function cleanInline(value) {
  return text(value)
    .replace(/\[(?:E|O|C):[^\]]+\]/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+([，。；：！？、])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function parseBlocks(markdown = "") {
  const blocks = [];
  let paragraph = [];
  const flush = () => {
    const value = cleanInline(paragraph.join(" "));
    if (value) blocks.push({ type: "paragraph", text: value });
    paragraph = [];
  };
  text(markdown).split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) { flush(); return; }
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) { flush(); blocks.push({ type: heading[1].length === 2 ? "heading" : "subheading", text: cleanInline(heading[2]) }); return; }
    const quote = line.match(/^>\s*(.+)$/);
    if (quote) { flush(); blocks.push({ type: "quote", text: cleanInline(quote[1]) }); return; }
    const listItem = line.match(/^(?:[-*]|\d+[.)])\s+(.+)$/);
    if (listItem) { flush(); blocks.push({ type: "list", text: cleanInline(listItem[1]) }); return; }
    if (/^\|.*\|$/.test(line)) {
      flush();
      const cells = line.split("|").map(cleanInline).filter(Boolean);
      if (cells.length && !cells.every((cell) => /^:?-{3,}:?$/.test(cell))) blocks.push({ type: "table", text: cells.join(" · ") });
      return;
    }
    paragraph.push(line);
  });
  flush();
  return blocks.map((block, index) => ({ ...block, id: `block_${index}` }));
}

function reportType(report) {
  return report.contentType === "monthly-report" ? "monthly" : "weekly";
}

function reportCounts(stats) {
  const joined = list(stats).join(" ");
  const valueFor = (label) => Number(joined.match(new RegExp(`${label}\\s*(\\d+)`))?.[1]) || 0;
  const counts = { signals: valueFor("商业事件"), opinions: valueFor("一线观点"), community: valueFor("社群观察") };
  return Object.values(counts).some(Boolean) ? counts : null;
}

function projectPortalReportData(indexPayload, bodiesPayload) {
  const reports = list(indexPayload?.reports);
  const bodies = bodiesPayload?.bodies || {};
  if (!reports.length) throw new Error("远端报告为空");
  const projected = reports.map((report) => {
    const type = reportType(report);
    const id = `${type}-${report.date}`;
    const blocks = parseBlocks(bodies[report.id]?.markdown || "");
    const issue = type === "weekly" ? text(report.id).split("-").slice(-2).join("-").toUpperCase() : text(report.date).slice(0, 7);
    const summary = {
      id,
      type,
      typeLabel: text(report.typeLabel) || (type === "weekly" ? "周报" : "月报"),
      title: text(report.title),
      date: text(report.date),
      dateShort: text(report.date).slice(5).replace("-", "."),
      issue,
      window: text(report.window),
      summary: text(report.summary),
      counts: reportCounts(report.stats),
      sectionCount: blocks.filter((block) => block.type === "heading").length,
    };
    return { summary, detail: { ...summary, blocks } };
  }).sort((a, b) => b.summary.date.localeCompare(a.summary.date));
  const summaries = projected.map((item) => item.summary);
  if (summaries[0].date < bundledReportIndex.meta.latestDate) throw new Error("远端报告日期回退");
  return {
    index: {
      meta: {
        schemaVersion: "GUANLAN-MINIPROGRAM-REPORTS-V1.1",
        reportVersion: "REPORTS-V1.3.0-funding-portal",
        latestDate: summaries[0].date,
        reportCount: summaries.length,
        weeklyCount: summaries.filter((item) => item.type === "weekly").length,
        monthlyCount: summaries.filter((item) => item.type === "monthly").length,
        live: true,
      },
      reports: summaries,
    },
    details: Object.fromEntries(projected.map((item) => [item.detail.id, item.detail])),
  };
}

function requestJson(url) {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: "GET",
      timeout: 20000,
      success: (response) => response.statusCode === 200 ? resolve(response.data) : reject(new Error(`HTTP ${response.statusCode}`)),
      fail: reject,
    });
  });
}

function refreshFundingData() {
  if (fundingRequest) return fundingRequest;
  fundingRequest = requestJson(`${API_ROOT}/funding-portal.json`).then((payload) => {
    const projected = projectPortalFundingData(payload);
    fundingState = { ...projected, source: "live" };
    return fundingState;
  }).catch(() => fundingState).then((value) => {
    fundingRequest = null;
    return value;
  });
  return fundingRequest;
}

function refreshReportData() {
  if (reportRequest) return reportRequest;
  reportRequest = Promise.all([
    requestJson(`${API_ROOT}/reports.json`),
    requestJson(`${API_ROOT}/report-bodies.json`),
  ]).then(([indexPayload, bodiesPayload]) => {
    const projected = projectPortalReportData(indexPayload, bodiesPayload);
    reportState = { ...projected, source: "live" };
    return reportState;
  }).catch(() => reportState).then((value) => {
    reportRequest = null;
    return value;
  });
  return reportRequest;
}

function getFundingData() { return fundingState; }
function getReportData() { return reportState; }

module.exports = {
  API_ROOT,
  getFundingData,
  getReportData,
  refreshFundingData,
  refreshReportData,
  projectPortalFundingData,
  projectPortalReportData,
  parseBlocks,
};
