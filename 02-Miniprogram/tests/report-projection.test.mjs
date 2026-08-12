import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { cleanInline, parseBlocks, projectReportData } from "../scripts/build-report-data.mjs";

const sourceDir = path.resolve("..", "01-SiteV2", "content", "12-applications", "industry-reports");
const projected = projectReportData(sourceDir);

test("projects accepted weekly and monthly reports", () => {
  assert.ok(projected.index.meta.weeklyCount >= 1);
  assert.ok(projected.index.meta.monthlyCount >= 1);
  assert.equal(projected.index.reports.length, Object.keys(projected.details).length);
  assert.ok(projected.index.reports.every((report) => report.title && report.date && report.summary));
});

test("keeps report reading blocks but removes internal citation tokens", () => {
  const serialized = JSON.stringify(projected);
  assert.doesNotMatch(serialized, /model_provider|deepseek|\[(?:E|O|C):/u);
  assert.ok(Object.values(projected.details).every((report) => report.blocks.some((block) => block.type === "heading")));
});

test("normalizes markdown into readable mobile text", () => {
  assert.equal(cleanInline("**判断** [E:EV-123]"), "判断");
  assert.deepEqual(parseBlocks("## 结论\n\n- 第一项\n- 第二项").map((item) => item.type), ["heading", "list", "list"]);
});
