import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildOverview } = require("../miniprogram/utils/ecosystem-insights.js");
const funding = require("../miniprogram/data/funding-index.js");
const reports = require("../miniprogram/data/report-index.js");
function loadPage(file, dependencies, wx = {}) {
  let page;
  vm.runInNewContext(fs.readFileSync(new URL(`../miniprogram/pages/${file}/index.js`, import.meta.url), "utf8"), {
    require: (name) => dependencies[name], wx, Page: (value) => { page = value; },
  });
  page.data = { ...page.data };
  page.setData = (patch, callback) => { Object.assign(page.data, patch); callback?.(); };
  return page;
}

test("every ecosystem entry revalidates, keeps filters, coalesces requests and stops pull refresh", async () => {
  let calls = 0, stopped = 0, release;
  const page = loadPage("market", {
    "../../utils/live-data.js": {
      getFundingData: () => ({ index: funding }), getReportData: () => ({ index: reports }),
      refreshFundingData: () => { calls++; return new Promise((resolve) => { release = resolve; }); },
      refreshReportData: async () => ({ index: reports }),
    },
    "../../utils/ecosystem-insights.js": { buildOverview },
    "../../utils/community-essays.js": { mergeCommunityEssays: () => [] },
    "../../utils/tab-bar.js": { syncTabBar() {} }, "../../utils/analytics.js": { track() {} },
  }, { getStorageSync: () => "", stopPullDownRefresh: () => { stopped++; } });
  page.onLoad();
  assert.equal(calls, 0, "onLoad renders cache; onShow owns revalidation");
  page.data.activeType = "monthly";
  const first = page.onShow();
  const pull = page.onPullDownRefresh();
  assert.equal(calls, 1);
  release({ index: funding });
  await Promise.all([first, pull]);
  assert.equal(stopped, 1);
  assert.equal(page.data.activeType, "monthly");
  const second = page.onShow();
  assert.equal(calls, 2, "same tab instance must revalidate on a later entry");
  release({ index: funding, refreshFailed: true });
  await second;
  assert.equal(page.data.refreshFailed, true);
  assert.ok(page.data.signals.length);
});

test("source check date is distinct from funding disclosure and follows market scope", () => {
  const index = { meta: { latestDate: "2026-08-30" }, cards: [
    { date: "2026-08-26", marketRegion: "global" }, { date: "2026-08-25", marketRegion: "china" },
  ] };
  assert.equal(buildOverview(index).systemCheckDate, "2026-08-30");
  assert.equal(buildOverview(index).latestFundingDate, "2026-08-26");
  assert.equal(buildOverview(index, "china").latestFundingDate, "2026-08-25");
  assert.equal(buildOverview({ ...index, cards: [] }).latestFundingDate, "暂无");
});

test("report reader rejects empty server bodies, retains preview, retries and rechecks after registration", async () => {
  let response = { pc: { markdown: "body" }, mini: null }, calls = 0;
  const page = loadPage("report-detail", {
    "../../utils/member.js": { recordBehavior() {} },
    "../../utils/live-data.js": { getReportData: () => ({ index: reports }) },
    "../../utils/community-essays.js": { getCommunityEssays: () => ({ details: {} }) },
    "../../utils/access.js": { getAccessState: () => "active" },
    "../../utils/metered-access.js": { resolveDetailAccess: () => ({}), requestLockedContent() {} },
    "../../utils/payment.js": { fetchProtectedContent: async () => { calls++; if (response instanceof Error) throw response; return response; } },
  });
  page.reportId = "monthly-2026-08-29";
  page.data.report = { title: "八月月报" };
  await page.verifyServerAccess();
  assert.equal(page.data.report.title, "八月月报");
  assert.equal(page.data.loadError, "正文暂时无法读取");
  assert.equal(page.data.loading, false);
  response = { id: page.reportId, title: "八月月报", blocks: [{ text: "完整正文" }] };
  await page.verifyServerAccess();
  assert.equal(page.data.report.blocks.length, 1);
  response = Object.assign(new Error("unauthorized"), { statusCode: 401 });
  await page.verifyServerAccess();
  assert.equal(page.data.contentLocked, true);
  page.pendingAction = "content";
  response = { id: page.reportId, title: "八月月报", blocks: [{ text: "完整正文" }] };
  await page.continueAfterRegistration();
  assert.equal(calls, 4);
  assert.equal(page.data.contentLocked, false);
});
