import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { getCommunityEssays } = require("../miniprogram/utils/community-essays.js");

test("publishes the verified 同频者计划 community essays", () => {
  const { index, details } = getCommunityEssays();
  const id = "community-essay-2026-08-12-ai-scarcity";
  const summary = index.find((item) => item.id === id);
  const detail = details[id];
  const yangxu = details["community-essay-2026-08-18-yangxu-judgment"];
  const fengge = details["community-essay-2026-08-18-fengge-financial-agent"];

  assert.equal(index.length, 3);
  assert.deepEqual(Object.keys(details), [
    "community-essay-2026-08-18-yangxu-judgment",
    "community-essay-2026-08-18-fengge-financial-agent",
    id,
  ]);
  assert.equal(summary?.title, "当 AI 能力越来越普及，真正稀缺的是什么？");
  assert.equal(summary?.issue, "第一期");
  assert.equal(summary?.sectionCount, 4);
  assert.ok(detail.blocks.length >= 70);
  assert.ok(detail.blocks.some((block) => block.text.includes("23 个人")));
  assert.ok(detail.blocks.some((block) => block.text.includes("单月收入一度接近 100 万元")));
  assert.ok(detail.blocks.some((block) => block.text.includes("AI 可以参与决策，但责任不能被自动化")));
  assert.ok(detail.blocks.some((block) => block.text.includes("观 AI 之澜，识商业之势")));
  assert.ok(detail.blocks.every((block) => block.text !== "---"));
  assert.ok(yangxu.blocks.some((block) => block.text.includes("复权价格 629 元")));
  assert.ok(yangxu.blocks.some((block) => block.text.includes("生产”的门槛降到了零")));
  assert.ok(fengge.blocks.some((block) => block.text.includes("谁使用谁负责")));
  assert.ok(fengge.blocks.some((block) => block.text.includes("责任关口不能只依赖")));
  assert.doesNotMatch(JSON.stringify({ yangxu, fengge }), /报名请点击|#AI|欢迎加入我们/u);
  assert.equal("blocks" in summary, false);
  assert.equal("markdown" in detail, false);
  assert.doesNotMatch(JSON.stringify({ index, details }), /AI 判断力、企业服务与垂直赛道|从一个下午的交付|医疗、制造和零售中的 AI 落地/u);
});
