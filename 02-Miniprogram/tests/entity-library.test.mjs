import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import test from "node:test";

const require = createRequire(import.meta.url);
const { buildEntityLibrary, filterEntities, companyEntityKey, investorEntityKey, personEntityKey } = require("../miniprogram/utils/entity-library.js");

const cards = [
  { id: "new", company: "星河智能", headquarters: "上海", products: ["工业机器人"], category: "Physical AI", subcategory: "机器人", amount: "2 亿元", round: "A轮", date: "2026-08-10", leadInvestor: "远见资本" },
  { id: "old", company: "星河智能", headquarters: "上海", products: ["具身模型"], category: "Physical AI", subcategory: "机器人", amount: "5000 万元", round: "天使轮", date: "2026-05-01", leadInvestor: "启明基金" },
];
const details = {
  new: { founders: [{ name: "林川", role: "创始人兼 CEO" }], investors: [{ name: "远见资本", role: "领投" }, { name: "启明基金", role: "跟投" }] },
  old: { founders: [{ name: "林川", role: "创始人兼 CEO" }], investors: [{ name: "启明基金", role: "领投" }] },
};

test("builds company and investor libraries from financing records", () => {
  const library = buildEntityLibrary(cards, details);
  assert.equal(library.companies.length, 1);
  assert.equal(library.companies[0].roundCount, 2);
  assert.equal(library.companies[0].rounds[0].id, "new");
  assert.equal(library.investors.find((item) => item.name === "启明基金").roundCount, 2);
  assert.equal(library.people.length, 1);
  assert.equal(library.people[0].roundCount, 2);
});

test("searches the same entity fields exposed by the PC portal", () => {
  const library = buildEntityLibrary(cards, details);
  assert.equal(filterEntities(library.companies, "工业机器人").length, 1);
  assert.equal(filterEntities(library.investors, "星河智能").length, 2);
  assert.equal(filterEntities(library.people, "创始人").length, 1);
  assert.equal(filterEntities(library.companies, "不存在").length, 0);
});

test("builds stable links across funding, company, institution and person views", () => {
  const library = buildEntityLibrary(cards, details);
  assert.equal(library.companies[0].investorLinks[0].key, investorEntityKey(library.companies[0].investorLinks[0].name));
  assert.equal(library.companies[0].founders[0].key, personEntityKey(library.companies[0].founders[0], "星河智能"));
  assert.equal(library.investors[0].companyLinks[0].key, companyEntityKey(library.investors[0].companyLinks[0].name));
  assert.match(fs.readFileSync("miniprogram/pages/detail/index.wxml", "utf8"), /openCompany|openInvestor|openPerson/u);
  assert.match(fs.readFileSync("miniprogram/pages/entity-detail/index.wxml", "utf8"), /bindtap="openEntity"/u);
});

test("related-company taps resolve by visible company name instead of protected canonical relation IDs", () => {
  const source = fs.readFileSync("miniprogram/pages/entity-detail/index.wxml", "utf8");
  const logic = fs.readFileSync("miniprogram/pages/entity-detail/index.js", "utf8");
  assert.match(source, /data-name="\{\{item\.name\}\}"[\s\S]*data-type="companies"/u);
  assert.match(logic, /type === "companies" && name \? companyEntityKey\(name\) : key/u);
  assert.match(logic, /nameQuery[\s\S]*encodeURIComponent\(name\)/u);
  assert.match(logic, /this\.type === "companies" && this\.name/u);
  assert.doesNotMatch(logic, /主体档案不存在/u);
  assert.equal(companyEntityKey("  DeepSeek  "), "deepseek");
  assert.equal(companyEntityKey("极佳视界"), "极佳视界");
  assert.equal(companyEntityKey("助擎科技"), "助擎科技");
});
