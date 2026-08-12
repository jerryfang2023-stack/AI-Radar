import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { filterCards, sortCards, activeFilterCount, exportSummary } = require("../miniprogram/utils/funding.js");
const cards = [
  { id: "1", company: "Centralize", summary: "企业销售", category: "企业级应用", categoryId: "enterprise", subcategory: "销售", productForm: "平台", products: ["Sales AI"], leadInvestor: "NEA", investorsText: "NEA", date: "2026-07-29", region: "overseas", marketRegion: "global", roundGroup: "growth", evidenceId: "multi", amountValue: 15 },
  { id: "2", company: "测试中国公司", summary: "具身智能", category: "具身智能", categoryId: "physical", subcategory: "机器人", productForm: "机器人", leadInvestor: "测试基金", investorsText: "测试基金", date: "2026-08-08", region: "china", marketRegion: "china", roundGroup: "early", evidenceId: "single", amountValue: 5 },
];
const defaults = { keyword: "", period: "all", marketRegion: "all", region: "all", roundGroup: "all", categoryId: "all", evidenceId: "all" };

test("filters keyword and structured dimensions", () => {
  assert.deepEqual(filterCards(cards, { ...defaults, keyword: "NEA" }, "2026-08-10").map((item) => item.id), ["1"]);
  assert.deepEqual(filterCards(cards, { ...defaults, keyword: "Sales AI" }, "2026-08-10").map((item) => item.id), ["1"]);
  assert.deepEqual(filterCards(cards, { ...defaults, region: "china" }, "2026-08-10").map((item) => item.id), ["2"]);
  assert.deepEqual(filterCards(cards, { ...defaults, marketRegion: "china" }, "2026-08-10").map((item) => item.id), ["2"]);
  assert.deepEqual(filterCards(cards, { ...defaults, categoryId: "enterprise" }, "2026-08-10").map((item) => item.id), ["1"]);
});

test("sorts, counts filters and exports deterministic CSV", () => {
  assert.deepEqual(sortCards(cards, "amount").map((item) => item.id), ["1", "2"]);
  assert.equal(activeFilterCount({ ...defaults, marketRegion: "china", region: "china", period: "30d" }), 3);
  assert.match(exportSummary(cards), /Centralize/);
});
