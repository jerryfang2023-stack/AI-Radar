import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildOverview, buildSector } = require("../miniprogram/utils/ecosystem-insights.js");

const cards = [
  { id: "1", company: "Alpha", initial: "A", subcategory: "AI 智能体", marketRegion: "global", date: "2026-08-10", amount: "100 万美元" },
  { id: "2", company: "Beta", initial: "B", subcategory: "AI 智能体", marketRegion: "global", date: "2026-07-10", amount: "200 万美元" },
  { id: "3", company: "Gamma", initial: "G", subcategory: "医疗 AI", marketRegion: "global", date: "2026-06-10", amount: "300 万美元" },
  { id: "4", company: "中国企业", initial: "中", subcategory: "机器人", marketRegion: "china", date: "2026-08-12", amount: "1 亿元" },
];
const index = { meta: { latestDate: "2026-08-16" }, cards };

test("builds live ecosystem signals, ranking and six-month heatmap by market", () => {
  const overview = buildOverview(index, "global");
  assert.equal(overview.signals.length, 3);
  assert.equal(overview.ranking[0].sector, "AI 智能体");
  assert.equal(overview.months.length, 6);
  assert.equal(overview.heatmap[0].cells.length, 6);
  assert.ok(overview.ranking.every((item) => item.width >= 12 && item.width <= 100));
  assert.deepEqual(buildOverview(index, "china").ranking.map((item) => item.sector), ["机器人"]);
});

test("builds a complete public sector company list and active investors", () => {
  const details = {
    1: { investors: [{ name: "Fund A" }] },
    2: { investors: [{ name: "Fund A" }, { name: "Fund B" }] },
  };
  const sector = buildSector(index, details, "AI 智能体", "global");
  assert.equal(sector.eventCount, 2);
  assert.equal(sector.companyCount, 2);
  assert.equal(sector.investorCount, 2);
  assert.deepEqual(sector.companies.map((item) => item.company), ["Alpha", "Beta"]);
});
