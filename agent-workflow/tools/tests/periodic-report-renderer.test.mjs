import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { periodicReportTitleProblems } from "../periodic-report-title.mjs";
import { escapeHtml, parseFrontmatter, renderBody, REPORTS_CENTER_VERSION } from "../render-periodic-report-pages.mjs";

test("periodic renderer owns the report-center release version", () => {
  assert.equal(REPORTS_CENTER_VERSION, "REPORTS-V1.0.0-periodic-report-center");
});

test("periodic report titles carry tension and a business consequence", () => {
  assert.deepEqual(periodicReportTitleProblems("AI Coding 越便宜，软件需求反而越多：真正稀缺的是交付责任"), []);
  assert.deepEqual(periodicReportTitleProblems("企业真正采购的不是模型能力，而是流程结果与交付责任"), []);
  assert.ok(periodicReportTitleProblems("企业 AI 进入组织级工作流，Agent 从能力演示转向流程接管").length > 0);
  assert.ok(periodicReportTitleProblems("2026年6月 AI 商业结构与机会月报").length > 0);
});

test("June monthly title records DeepSeek title provenance", () => {
  const source = fs.readFileSync(path.join(process.cwd(), "01-SiteV2", "content", "08-report", "monthly", "2026-06-30--monthly-report--ai-business-structure-and-opportunity.md"), "utf8");
  const metadata = parseFrontmatter(source).values;
  assert.equal(metadata.title, "企业真正采购的不是模型能力，而是流程结果与交付责任");
  assert.equal(metadata.title_generation_skill, "guanlan-monthly-business-structure-report@0.2.1");
  assert.equal(metadata.title_model_provider, "deepseek");
  assert.equal(metadata.title_model, "deepseek-v4-pro");
  assert.match(metadata.title_generated_at, /^2026-07-18T/u);
});

test("periodic renderer parses accepted metadata and preserves evidence IDs", () => {
  const source = "---\ntitle: Test\nstatus: draft\nwindow: 2026-07-06 to 2026-07-12\n---\n## 0. 数据边界\n\n- 判断 [E:EVT-1]";
  const parsed = parseFrontmatter(source);
  assert.equal(parsed.values.status, "draft");
  const html = renderBody(parsed.body);
  assert.match(html, /id="section-0"/u);
  assert.match(html, /\[E:EVT-1\]/u);
});

test("periodic renderer escapes model-supplied HTML", () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  assert.doesNotMatch(renderBody("## 1. <img src=x onerror=alert(1)>"), /<img/u);
});
