import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readJson = async (name) => JSON.parse(await readFile(new URL(`../public/data/${name}`, import.meta.url), "utf8"));

test("H5 contains all four confirmed columns", async () => {
  const source = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  for (const label of ["融资", "市场", "观察", "我的"]) assert.match(source, new RegExp(`label: \"${label}\"`));
});

test("funding and report datasets are available", async () => {
  const fundingIndex = await readJson("funding-index.json");
  const fundingDetails = await readJson("funding-details.json");
  const reportIndex = await readJson("report-index.json");
  const reportDetails = await readJson("report-details.json");

  assert.ok(fundingIndex.cards.length > 0);
  assert.ok(Object.keys(fundingDetails).length > 0);
  assert.ok(reportIndex.reports.some((item) => item.type === "weekly"));
  assert.ok(reportIndex.reports.some((item) => item.type === "monthly"));
  assert.ok(Object.keys(reportDetails).length > 0);
});

test("profile capabilities are present", async () => {
  const source = await readFile(new URL("../src/Prototype.tsx", import.meta.url), "utf8");
  for (const capability of ["浏览记录", "我的收藏", "我的关注", "成长与权益", "邀请好友", "个人资料"]) {
    assert.ok(source.includes(capability), `missing capability: ${capability}`);
  }
});
