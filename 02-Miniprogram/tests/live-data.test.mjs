import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { projectPortalFundingData, projectPortalReportData, refreshFundingData, getFundingDetail, refreshReportData, getCommunityDetail } = require("../miniprogram/utils/live-data.js");
const fallbackFunding = require("../miniprogram/data/funding-index.js");
const fallbackReports = require("../miniprogram/data/report-index.js");
const fixtureDate = fallbackFunding.meta.latestDate;

test("projects the VPS funding contract into the native mini program contract", () => {
  const source = {
    meta: {
      latestDate: fixtureDate,
      generatedAt: `${fixtureDate}T12:00:00.000Z`,
      cardCount: 1,
      sourceSchemaVersion: "FUNDING-INSIGHT-FRONTSTAGE-V1.5",
      sourceColumnVersion: "FUNDING-INSIGHT-V1.5.0-china-market",
      chinaMarketCardCount: 1,
    },
    cards: [{
      id: "FI-test",
      asOfDate: fixtureDate,
      marketRegion: "CN",
      company: { name: "测试公司", summary: "测试公司介绍", headquarters: "上海", founders: [{ name: "张三", role: "创始人" }] },
      financing: {
        round: "A轮",
        roundCode: "series_a",
        announcedAt: fixtureDate,
        amountNormalized: { currency: "CNY", value: 100000000, display_zh: "1 亿元人民币" },
        cumulativeAmount: { normalized: { display_zh: "1 亿元人民币" } },
        investors: [{ name: "测试资本", role: "本轮领投" }],
      },
      categoryId: "enterprise_applications",
      category: "企业级应用",
      subcategory: "销售",
      productForm: "企业软件平台",
      productDetails: [{ name: "测试产品", description: "产品说明", targetCustomers: "企业", features: ["自动化"] }],
      customers: [{ name: "测试客户" }],
      metrics: [{ label: "客户数", value: "10 家" }],
      comparisons: [{ name: "人工流程", coreDifference: "效率更高" }],
      analysis: {
        investmentThesis: { statement: "投资逻辑", evidenceSignals: ["验证信号"], risks: ["验证风险"] },
        investmentRationale: [{ institution: "测试资本", rationale: "机构理由" }],
      },
      historicalRounds: [{ round: "A轮", announcedAt: fixtureDate, amountNormalized: { display_zh: "1 亿元人民币" }, isCurrent: true }],
      sources: [{ id: "source-1", title: "测试来源", publisher: "测试媒体", url: "https://example.com/a" }],
      sourceCount: 1,
    }],
  };
  const result = projectPortalFundingData(source);
  assert.equal(result.index.meta.cardCount, 1);
  assert.equal(result.index.meta.chinaMarketCardCount, 1);
  assert.equal(result.index.cards[0].marketRegion, "china");
  assert.equal(result.index.cards[0].marketLabel, "中国");
  assert.equal(result.index.cards[0].amount, "1 亿元");
  assert.equal(result.details["FI-test"].cumulativeAmount, "1 亿元");
  assert.equal(result.details["FI-test"].history[0].amount, "1 亿元");
  assert.equal(result.details["FI-test"].institutionRationales[0].rationale, "机构理由");
  assert.equal(result.details["FI-test"].products[0].features[0], "自动化");
});

test("projects live report index and Markdown body", () => {
  const result = projectPortalReportData({
    reports: [{
      id: "weekly-2026-w33",
      contentType: "weekly-report",
      typeLabel: "周报",
      date: "2026-08-17",
      window: "2026-08-10 至 2026-08-16",
      title: "测试周报",
      summary: "摘要",
      stats: ["商业事件 10 条", "一线观点 2 条", "社群观察 3 条"],
    }],
  }, {
    bodies: { "weekly-2026-w33": { markdown: "## 一句话结论\n\n这是正文。\n\n- 第一条" } },
  });
  assert.equal(result.index.meta.reportCount, 1);
  assert.equal(result.index.reports[0].id, "weekly-2026-08-17");
  assert.equal(result.details["weekly-2026-08-17"].blocks[0].type, "heading");
  assert.equal(result.index.reports[0].counts.signals, 10);
});

test("refreshes the lightweight index and loads one funding detail on demand", async () => {
  const storage = new Map();
  const requests = [];
  const id = fallbackFunding.cards[0].id;
  global.wx = {
    getStorageSync: (key) => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    request: ({ url, success }) => {
      requests.push(url);
      if (url.includes("funding-manifest.json")) {
        success({ statusCode: 200, data: {
          version: `test:${fixtureDate}:${fallbackFunding.meta.cardCount}`,
          latestDate: fixtureDate,
          fundingVersion: fallbackFunding.meta.fundingVersion,
          cardCount: fallbackFunding.meta.cardCount,
          indexPath: "/data/mini/funding-index.json",
          detailBasePath: "/data/mini/funding-details",
        } });
      } else if (url.includes("funding-index.json")) {
        success({ statusCode: 200, data: fallbackFunding });
      } else {
        success({ statusCode: 200, data: { ...fallbackFunding.cards[0], detailComplete: true } });
      }
    },
  };
  try {
    const state = await refreshFundingData();
    const detail = await getFundingDetail(id);
    assert.equal(state.index.meta.cardCount, fallbackFunding.meta.cardCount);
    assert.equal(detail.id, id);
    assert.ok(requests.some((url) => url.includes("/data/mini/funding-index.json")));
    assert.ok(requests.some((url) => url.includes(`/data/mini/funding-details/${id}.json`)));
    assert.ok(requests.every((url) => !url.includes("funding-portal.json")));
  } finally {
    delete global.wx;
  }
});

test("refreshes remote community essays and only loads their public detail route", async () => {
  const storage = new Map();
  const requests = [];
  const id = "community-essay-2026-08-18-remote-test";
  const community = {
    id, contentType: "community-essay", type: "community", typeLabel: "社群精华", title: "远程精华",
    date: "2026-08-18", dateShort: "08.18", summary: "远程摘要", author: "观澜编辑部", readingTime: "3 分钟",
  };
  const index = {
    meta: {
      ...fallbackReports.meta,
      latestDate: "2026-08-18",
      reportCount: fallbackReports.reports.length + 1,
      communityCount: 1,
    },
    reports: [community, ...fallbackReports.reports],
  };
  global.wx = {
    getStorageSync: (key) => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    request: ({ url, success }) => {
      requests.push(url);
      if (url.includes("report-manifest.json")) {
        success({ statusCode: 200, data: {
          version: "reports:test:community",
          latestDate: "2026-08-18",
          reportCount: index.reports.length,
          communityCount: 1,
          indexPath: "/data/mini/report-index.json",
          communityDetailBasePath: "/data/mini/community-details",
        } });
      } else if (url.includes("report-index.json")) {
        success({ statusCode: 200, data: index });
      } else {
        success({ statusCode: 200, data: { ...community, detailComplete: true, blocks: [{ id: "block_0", type: "paragraph", text: "公开正文" }] } });
      }
    },
  };
  try {
    const detail = await getCommunityDetail(id);
    const state = await refreshReportData();
    const paidAttempt = await getCommunityDetail("weekly-2026-08-17");
    assert.equal(state.index.reports[0].id, id);
    assert.equal(detail.blocks[0].text, "公开正文");
    assert.equal(paidAttempt, null);
    assert.ok(requests.some((url) => url.includes(`/data/mini/community-details/${id}.json`)));
    assert.ok(requests.every((url) => !url.includes("report-details")));
  } finally {
    delete global.wx;
  }
});
