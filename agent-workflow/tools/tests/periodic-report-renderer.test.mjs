import assert from "node:assert/strict";
import test from "node:test";
import { escapeHtml, parseFrontmatter, renderBody } from "../render-periodic-report-pages.mjs";

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
