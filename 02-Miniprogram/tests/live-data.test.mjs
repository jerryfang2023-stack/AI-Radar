import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { projectPortalFundingData, projectPortalReportData } = require("../miniprogram/utils/live-data.js");
const fallbackFunding = require("../miniprogram/data/funding-index.js");
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
  assert.equal(result.details["FI-test"].institutionRationales[0].rationale, "机构理由");
  assert.equal(result.details["FI-test"].products[0].features[0], "自动化");
});

test("projects live report index and Markdown body", () => {
  const result = projectPortalReportData({
    reports: [{
      id: "weekly-2026-w32",
      contentType: "weekly-report",
      typeLabel: "周报",
      date: "2026-08-10",
      window: "2026-08-03 至 2026-08-09",
      title: "测试周报",
      summary: "摘要",
      stats: ["商业事件 10 条", "一线观点 2 条", "社群观察 3 条"],
    }],
  }, {
    bodies: { "weekly-2026-w32": { markdown: "## 一句话结论\n\n这是正文。\n\n- 第一条" } },
  });
  assert.equal(result.index.meta.reportCount, 1);
  assert.equal(result.index.reports[0].id, "weekly-2026-08-10");
  assert.equal(result.details["weekly-2026-08-10"].blocks[0].type, "heading");
  assert.equal(result.index.reports[0].counts.signals, 10);
});
