import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const funding = require("../miniprogram/utils/funding.js");

test("category picker intersects search and market, resets pagination and supports all", () => {
  let page;
  const index = { meta: { latestDate: "2026-09-12" }, cards: [] };
  vm.runInNewContext(fs.readFileSync(new URL("../miniprogram/pages/terminal/index.js", import.meta.url), "utf8"), {
    Page(value) { page = value; }, wx: { setStorageSync() {} },
    require(name) {
      if (name.endsWith("/funding.js")) return funding;
      if (name.endsWith("/live-data.js")) return { getFundingData: () => ({ index }) };
      if (name.endsWith("/analytics.js")) return { track() {} };
      return {};
    },
  });
  page.setData = (patch, done) => { for (const [key, value] of Object.entries(patch)) {
    if (key.startsWith("filters.")) page.data.filters[key.slice(8)] = value;
    else page.data[key] = value;
  } done?.(); };
  page.renderSlice = limit => { page.limit = limit; };
  page.updateMetrics = () => {};
  page.pageSize = 36;
  page.allCards = [
    { id: "a", company: "Alpha", categoryId: "app", category: "行业应用", marketRegion: "global", date: "2026-09-12" },
    { id: "b", company: "Beta", categoryId: "infra", category: "基础设施与算力", marketRegion: "global", date: "2026-09-12" },
    { id: "c", company: "Alpha中国", categoryId: "app", category: "行业应用", marketRegion: "china", date: "2026-09-12" },
  ];
  page.refreshCards(true);
  page.changeCategory({ detail: { value: "1" } });
  assert.deepEqual(page.filteredCards.map(card => card.id), ["a"]);
  assert.equal(page.limit, 36);
  page.onSearchInput({ detail: { value: "Beta" } });
  assert.equal(page.filteredCards.length, 0);
  page.changeCategory({ detail: { value: "0" } });
  assert.deepEqual(page.filteredCards.map(card => card.id), ["b"]);
  page.clearSearch();
  page.changeCategory({ detail: { value: "2" } });
  page.changeMarketRegion({ currentTarget: { dataset: { region: "china" } } });
  assert.equal(page.data.filters.categoryId, "all");
  assert.deepEqual(page.filteredCards.map(card => card.id), ["c"]);
});
