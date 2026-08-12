import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { buildEntityLibrary, filterEntities } = require("../miniprogram/utils/entity-library.js");

const cards = [
  { id: "new", company: "星河智能", headquarters: "上海", products: ["工业机器人"], category: "Physical AI", subcategory: "机器人", amount: "2 亿元", round: "A轮", date: "2026-08-10", leadInvestor: "远见资本" },
  { id: "old", company: "星河智能", headquarters: "上海", products: ["具身模型"], category: "Physical AI", subcategory: "机器人", amount: "5000 万元", round: "天使轮", date: "2026-05-01", leadInvestor: "启明基金" },
];
const details = {
  new: { investors: [{ name: "远见资本", role: "领投" }, { name: "启明基金", role: "跟投" }] },
  old: { investors: [{ name: "启明基金", role: "领投" }] },
};

test("builds company and investor libraries from financing records", () => {
  const library = buildEntityLibrary(cards, details);
  assert.equal(library.companies.length, 1);
  assert.equal(library.companies[0].roundCount, 2);
  assert.equal(library.companies[0].latestId, "new");
  assert.equal(library.investors.find((item) => item.name === "启明基金").roundCount, 2);
});

test("searches the same entity fields exposed by the PC portal", () => {
  const library = buildEntityLibrary(cards, details);
  assert.equal(filterEntities(library.companies, "工业机器人").length, 1);
  assert.equal(filterEntities(library.investors, "星河智能").length, 2);
  assert.equal(filterEntities(library.companies, "不存在").length, 0);
});
