import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { presentReport } = require("../miniprogram/utils/report-reader.js");

test("presentation preserves source, existing chapter numbers and long prose", () => {
  const report = { type: "weekly", blocks: [
    { id: "a", type: "heading", text: "0. 数据边界" },
    { id: "b", type: "list", text: "产品形态：原始正文" },
    { id: "c", type: "paragraph", text: "没有标签的原始正文。" },
  ] };
  const before = JSON.stringify(report);
  const result = presentReport(report);
  assert.equal(JSON.stringify(report), before);
  assert.equal(result.blocks[0].number, "00");
  assert.equal(result.blocks[0].title, "数据边界");
  assert.equal(result.blocks[1].lead + result.blocks[1].body, report.blocks[1].text);
  assert.equal(result.blocks[2].text, report.blocks[2].text);
  assert.equal(presentReport({ type: "monthly" }).blocks.length, 0);
});

test("table cards retain all headers and values; ambiguous legacy rows remain verbatim", () => {
  const rows = ["公司 · 金额", "甲 · 未披露", "乙 · 一亿元"];
  const result = presentReport({ type: "monthly", blocks: rows.map((text, id) => ({ id, type: "table", text })) });
  assert.deepEqual(result.blocks[0].rows.map(row => row.fields.map(field => field.value)), [["甲", "未披露"], ["乙", "一亿元"]]);
  assert.deepEqual(result.blocks[0].rows[0].fields.map(field => field.label), ["公司", "金额"]);
  const blocks = [{ id: "a", type: "table", text: "公司 · 金额" }, { id: "b", type: "table", text: "甲" }];
  assert.deepEqual(presentReport({ type: "weekly", blocks }).blocks, blocks);
});

test("community essays keep their original rendering contract", () => {
  const report = { type: "community", blocks: [{ type: "list", text: "标签：文章" }] };
  assert.equal(presentReport(report), report);
});
