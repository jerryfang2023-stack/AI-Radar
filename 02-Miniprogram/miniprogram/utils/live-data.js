const bundledFundingIndex = require("../data/funding-index.js");
const bundledFundingDetails = require("../data/funding-details.js");
const bundledReportIndex = require("../data/report-index.js");
const bundledReportDetails = require("../data/report-details.js");
const bundledFundingDetailIds = new Set(Object.keys(bundledFundingDetails));

const PUBLIC_ORIGIN = "https://www.zkdlj.vip";
const API_ROOT = `${PUBLIC_ORIGIN}/data`;
const LIVE_ROOT = `${API_ROOT}/mini`;
const CACHE_KEYS = {
  fundingManifest: "guanlan_live_funding_manifest_v1",
  fundingIndex: "guanlan_live_funding_index_v1",
  fundingEntities: "guanlan_live_funding_entities_v1",
  fundingDetails: "guanlan_live_funding_detail_cache_v1",
  reportManifest: "guanlan_live_report_manifest_v1",
  reportIndex: "guanlan_live_report_index_v1",
  communityDetails: "guanlan_live_community_detail_cache_v1",
};
const DAY_MS = 24 * 60 * 60 * 1000;
const chinaMarkers = [
  "china", "中国", "beijing", "北京", "shanghai", "上海", "shenzhen", "深圳", "hangzhou", "杭州",
  "guangzhou", "广州", "chengdu", "成都", "suzhou", "苏州", "wuhan", "武汉", "hong kong", "香港",
];

let fundingState = { index: bundledFundingIndex, details: bundledFundingDetails, source: "bundled" };
let reportState = { index: bundledReportIndex, details: bundledReportDetails, source: "bundled" };
let fundingRequest = null;
let fundingEntityRequest = null;
let reportRequest = null;
let fundingManifest = null;
let reportManifest = null;

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

function cnyAmountDisplay(value = "") {
  return text(value)
    .replace(/元\s*(?:人民币|CNY|RMB)/giu, "元")
    .replace(/\s*(?:人民币|CNY|RMB)/giu, "元");
}

function amountDisplay(value = {}, original = "", marketRegion = "") {
  const display = text(value.display_zh) || text(original) || "未披露";
  const isCny = text(value.currency).toUpperCase() === "CNY"
    || (marketRegion === "china" && /人民币|CNY|RMB/iu.test(display));
  return isCny ? cnyAmountDisplay(display) : display;
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
  const products = list(card.productDetails).map((item) => text(item.name)).filter(Boolean);
  const headquarters = text(company.headquarters);
  const marketRegion = card.marketRegion === "CN" ? "china" : "global";
  const amount = amountDisplay(financing.amountNormalized, financing.amountOriginal || financing.amount, marketRegion);
  const cumulativeAmount = amountDisplay(financing.cumulativeAmount?.normalized, financing.cumulativeAmount?.original || financing.totalRaised, marketRegion);
  const lead = investors.find((item) => item.role.includes("领投")) || investors[0];
  const summary = {
    id: text(card.id),
    company: companyName,
    initial: companyName.slice(0, 1).toUpperCase(),
    summary: shorten(company.summary) || "公司介绍暂未披露",
    products,
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
    marketLabel: marketRegion === "china" ? "中国" : "全球其他",
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
      founders: list(company.founders).map((item) => ({ id: text(item.entityId || item.entity_id || item.id), name: text(item.name), role: text(item.role) })).filter((item) => item.name),
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
        amount: amountDisplay(item.amountNormalized, item.amountOriginal, marketRegion),
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
    if (/^---+$/.test(line)) { flush(); return; }
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
      timeout: 12000,
      success: (response) => response.statusCode === 200 ? resolve(response.data) : reject(new Error(`HTTP ${response.statusCode}`)),
      fail: reject,
    });
  });
}

function readStorage(key) {
  try { return typeof wx !== "undefined" && wx.getStorageSync ? wx.getStorageSync(key) : null; } catch { return null; }
}

function writeStorage(key, value) {
  try { if (typeof wx !== "undefined" && wx.setStorageSync) wx.setStorageSync(key, value); } catch { /* cache failure must not block content */ }
}

function assertFundingManifest(payload) {
  if (!payload || !text(payload.version) || !/^\d{4}-\d{2}-\d{2}$/.test(text(payload.latestDate))) throw new Error("融资清单无效");
  if (versionIsOlder(payload.fundingVersion, bundledFundingIndex.meta.fundingVersion)) throw new Error("融资清单版本回退");
  if (payload.latestDate < bundledFundingIndex.meta.latestDate || Number(payload.cardCount) < bundledFundingIndex.meta.cardCount) throw new Error("融资清单数据回退");
}

function assertFundingIndex(payload, manifest) {
  if (!payload?.meta || !Array.isArray(payload.cards) || payload.cards.length !== Number(manifest.cardCount)) throw new Error("融资索引无效");
  if (payload.meta.latestDate !== manifest.latestDate || payload.meta.fundingVersion !== manifest.fundingVersion) throw new Error("融资索引版本不一致");
  if (new Set(payload.cards.map((item) => item.id)).size !== payload.cards.length) throw new Error("融资索引存在重复 ID");
}

function assertReportManifest(payload) {
  if (!payload || !text(payload.version) || !/^\d{4}-\d{2}-\d{2}$/.test(text(payload.latestDate))) throw new Error("报告清单无效");
  if (payload.latestDate < bundledReportIndex.meta.latestDate || Number(payload.reportCount) < bundledReportIndex.meta.reportCount) throw new Error("报告清单数据回退");
  if (Number(payload.communityCount) > 0 && !text(payload.communityDetailBasePath)) throw new Error("社群精华详情地址缺失");
}

function assertReportIndex(payload, manifest) {
  if (!payload?.meta || !Array.isArray(payload.reports) || payload.reports.length !== Number(manifest.reportCount)) throw new Error("报告索引无效");
  if (payload.meta.latestDate !== manifest.latestDate) throw new Error("报告索引版本不一致");
  if (new Set(payload.reports.map((item) => item.id)).size !== payload.reports.length) throw new Error("报告索引存在重复 ID");
}

function mergeFundingIndex(index, details = {}) {
  const completeDetails = Object.fromEntries(Object.entries(fundingState.details).filter(([id, detail]) => bundledFundingDetailIds.has(id) || detail?.detailComplete));
  fundingState = { index, details: { ...fundingState.details, ...details, ...completeDetails }, source: "live" };
  return fundingState;
}

function readDetailCache(key, version, id) {
  const cache = readStorage(key);
  return cache?.version === version ? cache.items?.[id] || null : null;
}

function writeDetailCache(key, version, id, detail, limit) {
  const current = readStorage(key);
  const cache = current?.version === version ? current : { version, order: [], items: {} };
  cache.order = [id, ...(cache.order || []).filter((item) => item !== id)].slice(0, limit);
  cache.items = { ...(cache.items || {}), [id]: detail };
  Object.keys(cache.items).forEach((item) => { if (!cache.order.includes(item)) delete cache.items[item]; });
  writeStorage(key, cache);
}

function refreshFundingData() {
  if (fundingRequest) return fundingRequest;
  fundingRequest = requestJson(`${LIVE_ROOT}/funding-manifest.json?refresh=${Date.now()}`).then((manifest) => {
    assertFundingManifest(manifest);
    fundingManifest = manifest;
    const cachedManifest = readStorage(CACHE_KEYS.fundingManifest);
    const cachedIndex = readStorage(CACHE_KEYS.fundingIndex);
    if (cachedManifest?.version === manifest.version && cachedIndex) {
      assertFundingIndex(cachedIndex, manifest);
      return mergeFundingIndex(cachedIndex);
    }
    return requestJson(`${PUBLIC_ORIGIN}${manifest.indexPath}?v=${encodeURIComponent(manifest.version)}`).then((index) => {
      assertFundingIndex(index, manifest);
      writeStorage(CACHE_KEYS.fundingManifest, manifest);
      writeStorage(CACHE_KEYS.fundingIndex, index);
      return mergeFundingIndex(index);
    });
  }).catch(() => fundingState).then((value) => {
    fundingRequest = null;
    return value;
  });
  return fundingRequest;
}

function refreshFundingEntities() {
  if (fundingEntityRequest) return fundingEntityRequest;
  fundingEntityRequest = refreshFundingData().then(() => {
    if (!fundingManifest?.entityPath) return fundingState;
    const cached = readStorage(CACHE_KEYS.fundingEntities);
    if (cached?.version === fundingManifest.version && cached.details) return mergeFundingIndex(fundingState.index, cached.details);
    return requestJson(`${PUBLIC_ORIGIN}${fundingManifest.entityPath}?v=${encodeURIComponent(fundingManifest.version)}`).then((payload) => {
      if (payload?.version !== fundingManifest.version || !payload.details) throw new Error("主体索引无效");
      writeStorage(CACHE_KEYS.fundingEntities, payload);
      return mergeFundingIndex(fundingState.index, payload.details);
    });
  }).catch(() => fundingState).then((value) => {
    fundingEntityRequest = null;
    return value;
  });
  return fundingEntityRequest;
}

function getFundingDetail(id) {
  const fallback = fundingState.details[id] || null;
  if (!fundingManifest?.detailBasePath) return Promise.resolve(fallback);
  const cached = readDetailCache(CACHE_KEYS.fundingDetails, fundingManifest.version, id);
  if (cached) {
    fundingState.details[id] = cached;
    return Promise.resolve(cached);
  }
  return requestJson(`${PUBLIC_ORIGIN}${fundingManifest.detailBasePath}/${encodeURIComponent(id)}.json?v=${encodeURIComponent(fundingManifest.version)}`).then((detail) => {
    if (detail?.id !== id || !detail.detailComplete) throw new Error("融资详情无效");
    fundingState.details[id] = detail;
    writeDetailCache(CACHE_KEYS.fundingDetails, fundingManifest.version, id, detail, 16);
    return detail;
  }).catch(() => fallback);
}

function getFundingDetails(ids) {
  return Promise.all(list(ids).map((id) => getFundingDetail(id))).then((details) => details.filter(Boolean));
}

function refreshReportData() {
  if (reportRequest) return reportRequest;
  reportRequest = requestJson(`${LIVE_ROOT}/report-manifest.json?refresh=${Date.now()}`).then((manifest) => {
    assertReportManifest(manifest);
    reportManifest = manifest;
    const cachedManifest = readStorage(CACHE_KEYS.reportManifest);
    const cachedIndex = readStorage(CACHE_KEYS.reportIndex);
    if (cachedManifest?.version === manifest.version && cachedIndex) {
      assertReportIndex(cachedIndex, manifest);
      reportState = { index: cachedIndex, details: reportState.details, source: "live" };
      return reportState;
    }
    return requestJson(`${PUBLIC_ORIGIN}${manifest.indexPath}?v=${encodeURIComponent(manifest.version)}`).then((index) => {
      assertReportIndex(index, manifest);
      writeStorage(CACHE_KEYS.reportManifest, manifest);
      writeStorage(CACHE_KEYS.reportIndex, index);
      reportState = { index, details: reportState.details, source: "live" };
      return reportState;
    });
  }).catch(() => reportState).then((value) => {
    reportRequest = null;
    return value;
  });
  return reportRequest;
}

function loadCommunityDetail(id) {
  const fallback = reportState.details[id] || null;
  if (!reportManifest?.communityDetailBasePath) return Promise.resolve(fallback);
  const cached = readDetailCache(CACHE_KEYS.communityDetails, reportManifest.version, id);
  if (cached) {
    reportState.details[id] = cached;
    return Promise.resolve(cached);
  }
  return requestJson(`${PUBLIC_ORIGIN}${reportManifest.communityDetailBasePath}/${encodeURIComponent(id)}.json?v=${encodeURIComponent(reportManifest.version)}`).then((detail) => {
    if (detail?.id !== id || detail.contentType !== "community-essay" || detail.type !== "community" || !detail.detailComplete) throw new Error("社群精华详情无效");
    reportState.details[id] = detail;
    writeDetailCache(CACHE_KEYS.communityDetails, reportManifest.version, id, detail, 8);
    return detail;
  }).catch(() => fallback);
}

function getCommunityDetail(id) {
  if (!/^community-essay-[a-z0-9-]+$/i.test(text(id))) return Promise.resolve(null);
  const ready = reportManifest ? Promise.resolve(reportState) : refreshReportData();
  return ready.then(() => loadCommunityDetail(id)).catch(() => reportState.details[id] || null);
}

function hydrateStoredIndexes() {
  try {
    const storedFundingManifest = readStorage(CACHE_KEYS.fundingManifest);
    const storedFundingIndex = readStorage(CACHE_KEYS.fundingIndex);
    if (storedFundingManifest && storedFundingIndex) {
      assertFundingManifest(storedFundingManifest);
      assertFundingIndex(storedFundingIndex, storedFundingManifest);
      fundingManifest = storedFundingManifest;
      fundingState = { index: storedFundingIndex, details: bundledFundingDetails, source: "cache" };
    }
  } catch { /* retain bundled funding data */ }
  try {
    const storedReportManifest = readStorage(CACHE_KEYS.reportManifest);
    const storedReportIndex = readStorage(CACHE_KEYS.reportIndex);
    if (storedReportManifest && storedReportIndex) {
      assertReportManifest(storedReportManifest);
      assertReportIndex(storedReportIndex, storedReportManifest);
      reportManifest = storedReportManifest;
      reportState = { index: storedReportIndex, details: bundledReportDetails, source: "cache" };
    }
  } catch { /* retain bundled report data */ }
}

hydrateStoredIndexes();

function getFundingData() { return fundingState; }
function getReportData() { return reportState; }

module.exports = {
  API_ROOT,
  getFundingData,
  getReportData,
  refreshFundingData,
  refreshFundingEntities,
  getFundingDetail,
  getFundingDetails,
  refreshReportData,
  getCommunityDetail,
  projectPortalFundingData,
  projectPortalReportData,
  parseBlocks,
};
