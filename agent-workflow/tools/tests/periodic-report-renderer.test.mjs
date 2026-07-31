import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { REPOSITORY_CONTENT_PATHS } from "../guanlan-vault-paths.mjs";
import { periodicReportTitleProblems } from "../periodic-report-title.mjs";
import {
  buildEvidenceSourceIndex,
  discoverPublishedReports,
  escapeHtml,
  formatReportWindow,
  parseFrontmatter,
  renderBody,
  SITE_VERSION,
  REPORTS_CENTER_VERSION,
} from "../render-periodic-report-pages.mjs";

test("periodic renderer owns the report-center release version", () => {
  assert.equal(SITE_VERSION, "SITE-V4.4.0-two-center-focus");
  assert.equal(REPORTS_CENTER_VERSION, "REPORTS-V1.2.0-research-hub");
});

test("periodic report titles carry tension and a business consequence", () => {
  assert.deepEqual(periodicReportTitleProblems("AI Coding 越便宜，软件需求反而越多：真正稀缺的是交付责任"), []);
  assert.deepEqual(periodicReportTitleProblems("企业真正采购的不是模型能力，而是流程结果与交付责任"), []);
  assert.ok(periodicReportTitleProblems("企业 AI 进入组织级工作流，Agent 从能力演示转向流程接管").length > 0);
  assert.ok(periodicReportTitleProblems("2026年6月 AI 商业结构与机会月报").length > 0);
});

test("June monthly title records DeepSeek title provenance", () => {
  const source = fs.readFileSync(path.join(process.cwd(), REPOSITORY_CONTENT_PATHS.industryReportsRoot, "monthly", "2026-06-30--monthly-report--ai-business-structure-and-opportunity.md"), "utf8");
  const metadata = parseFrontmatter(source).values;
  assert.equal(metadata.title, "企业真正采购的不是模型能力，而是流程结果与交付责任");
  assert.equal(metadata.title_generation_skill, "guanlan-monthly-business-structure-report@0.2.1");
  assert.equal(metadata.title_model_provider, "deepseek");
  assert.equal(metadata.title_model, "deepseek-v4-pro");
  assert.match(metadata.title_generated_at, /^2026-07-18T/u);
});

test("periodic renderer turns resolvable evidence IDs into understandable links and hides unresolved IDs", () => {
  const source = "---\ntitle: Test\nstatus: draft\nwindow: 2026-07-06 to 2026-07-12\n---\n## 0. 数据边界\n\n- 事件 [E:EVT-1]、观点 [O:OP-1]、社群 [C:CM-1]、未解析 [E:MISSING]";
  const parsed = parseFrontmatter(source);
  assert.equal(parsed.values.status, "draft");
  const html = renderBody(parsed.body, {
    evidenceSources: new Map([
      ["E:EVT-1", "https://example.com/event?a=1&b=2"],
      ["O:OP-1", "https://example.com/opinion"],
      ["C:CM-1", "https://example.com/community"],
    ]),
  });
  assert.match(html, /id="section-0"/u);
  assert.match(html, /href="https:\/\/example\.com\/event\?a=1&amp;b=2"[^>]*>查看事件来源<\/a>/u);
  assert.match(html, />查看观点来源<\/a>/u);
  assert.match(html, />查看社群来源<\/a>/u);
  assert.doesNotMatch(html, /\[(?:E|O|C):|EVT-1|OP-1|CM-1|MISSING|report-evidence-ref/u);
});

test("public evidence index resolves event, viewpoint, and historical community sources", () => {
  const evidence = buildEvidenceSourceIndex(process.cwd());
  assert.match(evidence.get("E:EV-db82b90cad1e7c14") || "", /^https?:\/\//u);
  assert.match(evidence.get("O:2081223709755650054") || "", /^https?:\/\//u);
  assert.match(evidence.get("C:28a9c526fc924e") || "", /^https?:\/\//u);
});

test("public evidence index keeps historical viewpoint sources after current snapshots are rebuilt", (t) => {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-report-evidence-"));
  t.after(() => fs.rmSync(fixtureRoot, { recursive: true, force: true }));
  const siteData = path.join(fixtureRoot, "01-SiteV2", "site", "data");
  const archiveDir = path.join(fixtureRoot, "01-SiteV2", "content", "07-points");
  fs.mkdirSync(siteData, { recursive: true });
  fs.mkdirSync(archiveDir, { recursive: true });
  fs.writeFileSync(path.join(siteData, "data-center-v4-frontstage.json"), JSON.stringify({ events: [], entityProfiles: [] }));
  fs.writeFileSync(
    path.join(archiveDir, "2026-07-26-builders-viewpoints.md"),
    "## Archived viewpoint\n\n- stable_id: `BP-20260726-24`\n- source_url: `https://x.com/example/status/2081223709755650054`\n",
  );

  const evidence = buildEvidenceSourceIndex(fixtureRoot);
  assert.equal(evidence.get("O:BP-20260726-24"), "https://x.com/example/status/2081223709755650054");
  assert.equal(evidence.get("O:2081223709755650054"), "https://x.com/example/status/2081223709755650054");
});

test("periodic renderer escapes model-supplied HTML", () => {
  assert.equal(escapeHtml('<script>alert("x")</script>'), "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  assert.doesNotMatch(renderBody("## 1. <img src=x onerror=alert(1)>"), /<img/u);
});

test("recent weekly reports render as editorial modules with evidence last", () => {
  for (const date of ["2026-07-13", "2026-07-20"]) {
    const source = fs.readFileSync(path.join(process.cwd(), REPOSITORY_CONTENT_PATHS.industryReportsRoot, `${date}--weekly-report--ai-business-change-radar.md`), "utf8");
    const html = renderBody(parseFrontmatter(source).body);
    for (const moduleClass of [
      "weekly-trend-stack",
      "weekly-chain-list",
      "weekly-impact-grid",
      "weekly-opportunity-list",
      "weekly-watch-grid",
      "weekly-action-grid",
      "weekly-report-method",
    ]) assert.match(html, new RegExp(`class="[^"]*${moduleClass}`, "u"), `${date} must render ${moduleClass}`);
    assert.ok(html.indexOf('id="section-0"') > html.indexOf('id="section-8"'), `${date} evidence section must render last`);
    assert.doesNotMatch(html, /<table|^\|[-:| ]+\|/mu);
  }
});

test("report center feature cards always match the latest published sources", () => {
  const root = process.cwd();
  const html = fs.readFileSync(path.join(root, "01-SiteV2", "site", "intelligence-map.html"), "utf8");
  for (const reportKind of ["weekly", "monthly"]) {
    const latest = discoverPublishedReports(root, reportKind)[0];
    assert.ok(latest, `latest ${reportKind} report must exist`);
    const feature = html.match(new RegExp(`<article class="report-feature-card is-${reportKind}">[\\s\\S]*?<\\/article>`, "u"))?.[0] || "";
    assert.ok(feature.includes(escapeHtml(latest.title)), `${reportKind} feature title must be current`);
    assert.ok(feature.includes(`href="${latest.route}"`), `${reportKind} feature route must be current`);
    assert.ok(feature.includes(formatReportWindow(latest)), `${reportKind} feature window must be current`);
  }
});
