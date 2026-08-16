import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const analyticsPath = require.resolve("../miniprogram/utils/analytics.js");

function loadAnalytics() {
  const storage = new Map();
  const requests = [];
  globalThis.wx = {
    getStorageSync(key) { return storage.get(key); },
    setStorageSync(key, value) { storage.set(key, value); },
    getSystemInfoSync() { return { platform: "ios", model: "iPhone", system: "iOS", version: "8.0" }; },
    request(options) {
      requests.push(options);
      options.success({ statusCode: 200, data: { accepted: options.data.events.length } });
      options.complete();
    },
  };
  globalThis.getCurrentPages = () => [{ route: "pages/terminal/index" }];
  globalThis.Page = (config) => config;
  delete globalThis.__guanlanAnalyticsPageInstalled;
  delete require.cache[analyticsPath];
  return { analytics: require(analyticsPath), storage, requests };
}

test("analytics queues privacy-safe page events and flushes a batch", async () => {
  const { analytics, storage, requests } = loadAnalytics();
  analytics.track("page_view", { contentId: "funding-1" });
  const queued = storage.get("guanlan_analytics_queue_v1");
  assert.equal(queued.length, 1);
  assert.equal(queued[0].platform, "miniprogram");
  assert.equal(queued[0].page, "/pages/terminal/index");
  assert.equal(queued[0].properties.contentId, "funding-1");
  await analytics.flush();
  assert.equal(requests.length, 1);
  assert.equal(storage.get("guanlan_analytics_queue_v1").length, 0);
});

test("page tracking wraps lifecycle without replacing original handlers", () => {
  const { analytics, storage, requests } = loadAnalytics();
  let shown = 0;
  analytics.installPageTracking();
  const page = globalThis.Page({
    onShow() { shown += 1; },
  });
  page.route = "pages/detail/index";
  page.onLoad({ id: "funding-42" });
  page.onShow();
  assert.equal(shown, 1);
  const recorded = [
    ...(storage.get("guanlan_analytics_queue_v1") || []),
    ...requests.flatMap((request) => request.data.events),
  ];
  assert.ok(recorded.some((item) => item.event === "page_view"));
  assert.ok(recorded.some((item) => item.event === "content_view" && item.properties.contentId === "funding-42"));
});
