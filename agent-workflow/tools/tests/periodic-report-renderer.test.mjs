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
  reportPortalId,
  SITE_VERSION,
  REPORTS_CENTER_VERSION,
} from "../render-periodic-report-pages.mjs";

test("periodic renderer owns the report-center release version", () => {
  assert.equal(SITE_VERSION, "SITE-V4.6.1-research-retirement");
  assert.equal(REPORTS_CENTER_VERSION, "REPORTS-V1.3.0-funding-portal");
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

test("periodic renderer removes all inline source annotations without harming readability", () => {
  const source = "---\ntitle: Test\nstatus: draft\nwindow: 2026-07-06 to 2026-07-12\n---\n## 0. 数据边界\n\n- 事件 [E:EVT-1]、观点 [O:OP-1]、社群 [C:CM-1]、未解析 [E:MISSING]";
  const parsed = parseFrontmatter(source);
  assert.equal(parsed.values.status, "draft");
  const html = renderBody(parsed.body);
  assert.match(html, /id="section-0"/u);
  assert.match(html, /事件、观点、社群、未解析/u);
  assert.doesNotMatch(html, /查看(?:事件|观点|社群)来源|report-evidence-link|href=|\[(?:E|O|C):|EVT-1|OP-1|CM-1|MISSING/u);
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

test("all published periodic report pages omit inline source annotations", () => {
  const site = path.join(process.cwd(), "01-SiteV2", "site");
  const routes = [
    ...discoverPublishedReports(process.cwd(), "weekly").map((report) => report.route),
    ...discoverPublishedReports(process.cwd(), "monthly").map((report) => report.route),
    "weekly-ai-business-change-radar.html",
  ];
  for (const route of routes) {
    const html = fs.readFileSync(path.join(site, route), "utf8");
    assert.doesNotMatch(html, /查看(?:事件|观点|社群)来源|report-evidence-link|\[(?:E|O|C):/u, route);
  }
});

test("monthly reports preserve prose and render editorial tables for mobile", () => {
  const markdown = [
    "## 0. 数据边界",
    "",
    "边界说明。",
    "",
    "## 1. 本月核心结论",
    "",
    "交付责任成为稀缺资源。",
    "",
    "## 2. 结构判断",
    "",
    "**1. 部署层：从卖工具转向卖结果**",
    "",
    "结果定价开始出现。",
    "",
    "## 3. 趋势裁决",
    "",
    "**裁决一：交付能力升级**",
    "",
    "仍需验证续约。",
    "",
    "## 4. 证据完整性",
    "",
    "| 趋势链 | 完整性 | 裁决 |",
    "|---|---|---|",
    "| 部署交付 | 基本完整 | 升级 |",
    "",
    "## 5. 下游机会假设（机会地图）",
    "",
    "**机会一：部署服务（机会评分：85/100）**",
    "",
    "这段机会正文必须完整保留。",
  ].join("\n");
  const html = renderBody(markdown, { reportKind: "monthly" });
  assert.match(html, /weekly-trend-stack/u);
  assert.match(html, /<table class="weekly-report-table">/u);
  assert.match(html, /data-label="趋势链"/u);
  assert.match(html, /weekly-opportunity-prose/u);
  assert.match(html, /这段机会正文必须完整保留/u);
  assert.ok(html.indexOf('id="section-0"') > html.indexOf('id="section-5"'));
  assert.doesNotMatch(html, /^\|[-:| ]+\|/mu);
});

test("report center and report routes redirect to stable funding portal hashes", () => {
  const root = process.cwd();
  const html = fs.readFileSync(path.join(root, "01-SiteV2", "site", "intelligence-map.html"), "utf8");
  assert.match(html, /https:\/\/www\.zkdlj\.vip\/#reports/u);
  for (const reportKind of ["weekly", "monthly"]) {
    for (const report of discoverPublishedReports(root, reportKind)) {
      const route = fs.readFileSync(path.join(root, "01-SiteV2", "site", report.route), "utf8");
      assert.match(route, new RegExp(`https://www\\.zkdlj\\.vip/#report/${reportPortalId(reportKind, report)}`, "u"));
      assert.doesNotMatch(route, /weekly-report-reader|dc-sidebar/u);
    }
  }
});
