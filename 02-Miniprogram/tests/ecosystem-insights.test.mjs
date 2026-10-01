import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { buildOverview, buildSector } = require("../miniprogram/utils/ecosystem-insights.js");

const cards = [
  { id: "1", company: "Alpha", initial: "A", subcategory: "业务流程与企业智能体", marketRegion: "global", date: "2026-08-10", amount: "100 万美元" },
  { id: "2", company: "Beta", initial: "B", subcategory: "业务流程与企业智能体", marketRegion: "global", date: "2026-07-10", amount: "200 万美元" },
  { id: "3", company: "Gamma", initial: "G", subcategory: "医疗服务与临床", marketRegion: "global", date: "2026-06-10", amount: "300 万美元" },
  { id: "4", company: "中国企业", initial: "中", subcategory: "AI 玩具与陪伴设备", marketRegion: "china", date: "2026-08-12", amount: "1 亿元" },
];
const index = { meta: { taxonomyVersion: "AI-FUNDING-TAGS-1.0", latestDate: "2026-08-16" }, cards };

test('legacy taxonomy cannot populate capital-flow charts or sector details', () => {
  const old = { ...index, meta: { latestDate: index.meta.latestDate } };
  assert.equal(buildOverview(old).ranking.length, 0);
  assert.equal(buildSector(old, {}, cards[0].subcategory).eventCount, 0);
});

test('counts distinct accepted events and excludes future dates consistently', () => {
  const polluted = { ...index, cards: [...cards, cards[0], { ...cards[0], id: 'future', date: '2026-08-17' }] };
  assert.deepEqual(buildOverview(polluted), buildOverview(index));
  assert.deepEqual(buildSector(polluted, {}, cards[0].subcategory), buildSector(index, {}, cards[0].subcategory));
});

test("builds live ecosystem signals, ranking and six-month heatmap by market", () => {
  const overview = buildOverview(index, "global");
  assert.equal(overview.signals.length, 3);
  assert.equal(overview.ranking[0].sector, "业务流程与企业智能体");
  assert.equal(overview.months.length, 6);
  assert.equal(overview.heatmap[0].cells.length, 6);
  assert.ok(overview.ranking.every((item) => item.width >= 12 && item.width <= 100));
  assert.deepEqual(buildOverview(index, "china").ranking.map((item) => item.sector), ["AI 玩具与陪伴设备"]);
});

test("builds a complete public sector company list and active investors", () => {
  const details = {
    1: { investors: [{ name: "Fund A" }] },
    2: { investors: [{ name: "Fund A" }, { name: "Fund B" }] },
  };
  const sector = buildSector(index, details, "业务流程与企业智能体", "global");
  assert.equal(sector.eventCount, 2);
  assert.equal(sector.companyCount, 2);
  assert.equal(sector.investorCount, 2);
  assert.deepEqual(sector.companies.map((item) => item.company), ["Alpha", "Beta"]);
});

test("global ecosystem excludes China from signals, heatmap, companies and investors", () => {
  const mixed = { ...index, cards: [...cards, { ...cards[3], id: "5", subcategory: "业务流程与企业智能体" }] };
  const overview = buildOverview(mixed, "global");
  assert.equal(overview.ranking.reduce((n, item) => n + item.count, 0), 3);
  assert.equal(overview.heatmap.flatMap(item => item.cells).reduce((n, cell) => n + cell.count, 0), 3);
  assert.equal(overview.latestFundingDate, "2026-08-10");
  assert.equal(overview.signals[0].value, 2);
  const details = { 1: { investors: [{ name: "Global Fund" }] }, 5: { investors: [{ name: "China Fund" }] } };
  const globalSector = buildSector(mixed, details, "业务流程与企业智能体", "global");
  const chinaSector = buildSector(mixed, details, "业务流程与企业智能体", "china");
  assert.deepEqual(globalSector.companies.map(c => c.id), ["1", "2"]);
  assert.deepEqual(globalSector.investors.map(i => i.name), ["Global Fund"]);
  assert.equal(globalSector.eventCount + chinaSector.eventCount, 3);
  assert.deepEqual(chinaSector.companies.map(c => c.id), ["5"]);
});
