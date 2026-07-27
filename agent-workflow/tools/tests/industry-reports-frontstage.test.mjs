import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildIndustryReportsData } from "../../../01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

test("Opportunity Map projection reads accepted Signal Cards on its weekly cadence without the V3 desk", () => {
  const data = buildIndustryReportsData(root);
  const dataCenter = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json"), "utf8"));
  const reportsHtml = fs.readFileSync(path.join(root, "01-SiteV2/site/intelligence-map.html"), "utf8");
  const opportunityHtml = fs.readFileSync(path.join(root, "01-SiteV2/site/opportunity-map.html"), "utf8");

  assert.equal(data.meta.siteVersion, "SITE-V4.2.0-entity-history");
  assert.equal(data.meta.schemaVersion, "OPPORTUNITY-MAP-FRONTSTAGE-V1.1");
  assert.equal(data.meta.applicationVersion, "OMAP-V1.1.0-direction-cards");
  assert.equal(data.meta.opportunityMapVersion, "OMAP-V1.1.0-direction-cards");
  assert.equal(data.meta.directionCardVersion, "DIRECTION-CARD-V1.1-deepseek-pro-reviewed");
  assert.equal(data.meta.sourceAdapter, "accepted-signal-card-assets");
  assert.match(data.meta.activeDate, /^\d{4}-\d{2}-\d{2}$/u);
  const cadenceLagDays = Math.round(
    (Date.parse(`${dataCenter.meta.currentDate}T00:00:00Z`) - Date.parse(`${data.meta.activeDate}T00:00:00Z`))
      / 86_400_000,
  );
  assert.ok(
    cadenceLagDays >= 0 && cadenceLagDays <= 7,
    `Opportunity Map must not be newer than Data Center or lag its weekly cadence: ${cadenceLagDays} days`,
  );
  assert.ok(data.cards.length > 0);
  assert.ok(data.cards.every((card) => card.id && card.title && card.date));
  assert.ok(data.cards.every((card) => Object.keys(card.opportunitySignals.labels).length === 7));
  assert.equal(data.directionCards.length, 2);
  assert.ok(data.directionCards.every((card) => card.judgment && card.counterSignal));
  assert.ok(data.directionCards.every((card) => card.evidenceCount >= 2));
  assert.ok(data.directionCards.every((card) => card.evidence.every((item) => item.sourceUrl)));
  assert.doesNotMatch(reportsHtml, /data\/v3-data-observation-desk\.json|data\/industry-reports-frontstage\.json/u);
  assert.match(reportsHtml, /REPORTS-V1\.0\.0-periodic-report-center/u);
  assert.doesNotMatch(opportunityHtml, /data\/v3-data-observation-desk\.json/u);
  assert.match(opportunityHtml, /data\/industry-reports-frontstage\.json/u);
  assert.match(opportunityHtml, /OMAP-V1\.1\.0-direction-cards/u);
  assert.match(opportunityHtml, /data-direction-cards|查看方向|创业假设/u);
  assert.doesNotMatch(opportunityHtml, /data-map-toggle|Cell Evidence|Relation Paths/u);
});

test("Opportunity Map projection has no hidden dependency on generated V3 JSON", () => {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-opportunity-"));
  const cardDir = path.join(fixtureRoot, "01-SiteV2/knowledge/01-Signal-Cards/case");
  fs.mkdirSync(cardDir, { recursive: true });
  fs.writeFileSync(path.join(cardDir, "2026-07-25--signal--fixture.md"), [
    "---",
    "id: SIG-FIXTURE-1",
    "type: signal_card",
    "signal_type: case",
    "title: \"Fixture deployment\"",
    "date: 2026-07-25",
    "status: published",
    "asset_level: frontstage",
    "primary_raw:",
    "  source_url: \"https://example.com/deployment\"",
    "opportunity_signals:",
    "  buyer_or_user: [\"engineering_team\"]",
    "  team_or_function: [\"engineering\"]",
    "  specific_task: [\"internal_tool_building\"]",
    "  pain_or_constraint: [\"workflow_integration\"]",
    "  product_form: [\"developer_tool\"]",
    "  delivery_model: [\"enterprise_subscription\"]",
    "  business_action: [\"customer_deployment\"]",
    "signal_owner: \"Fixture Company\"",
    "---",
    "",
  ].join("\n"), "utf8");
  try {
    const data = buildIndustryReportsData(fixtureRoot, {
      taxonomyFile: path.join(root, "agent-workflow/product/opportunity-signal-taxonomy.json"),
    });
    assert.equal(data.meta.activeDate, "2026-07-25");
    assert.equal(data.meta.cardCount, 1);
    assert.equal(data.meta.directionCardCount, 0);
    assert.deepEqual(data.directionCards, []);
    assert.equal(data.cards[0].sourceName, "example.com");
    assert.deepEqual(data.cards[0].opportunitySignals.labels.specific_task, ["internal_tool_building"]);
    assert.equal(fs.existsSync(path.join(fixtureRoot, "01-SiteV2/site/data/v3-data-observation-desk.json")), false);
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("legacy public routes are redirects and report detail pages use the V4 shell", () => {
  const redirects = new Map([
    ["v3-data-observation.html", "data-center.html?view=events"],
    ["follow-builders.html", "data-center.html?view=viewpoints"],
    ["community-intelligence.html", "data-center.html?view=community"],
    ["reports.html", "intelligence-map.html"],
  ]);
  for (const [file, target] of redirects) {
    const html = fs.readFileSync(path.join(root, "01-SiteV2/site", file), "utf8");
    assert.match(html, new RegExp(`url=${target.replace(/[?]/gu, "\\?")}`, "u"));
    assert.match(html, /SITE-V4\.2\.0-entity-history/u);
    assert.doesNotMatch(html, /wavesight-nav\.css|wavesight-topbar/u);
  }

  const reportPages = fs.readdirSync(path.join(root, "01-SiteV2/site"))
    .filter((file) => /^(?:weekly-ai-business-change-radar.*|monthly-business-structure.*)\.html$/u.test(file));
  assert.ok(reportPages.length >= 2);
  for (const file of reportPages) {
    const html = fs.readFileSync(path.join(root, "01-SiteV2/site", file), "utf8");
    assert.match(html, /SITE-V4\.2\.0-entity-history/u);
    assert.match(html, /REPORTS-V1\.0\.0-periodic-report-center/u);
    assert.match(html, /assets\/data-center-v4\.css/u);
    assert.match(html, /class="dc-sidebar"/u);
    assert.match(html, /href="intelligence-map\.html" aria-current="page">行业报告/u);
    assert.match(html, /href="funding-insights\.html">融资透视/u);
    assert.match(html, /href="opportunity-map\.html">机会地图/u);
    assert.doesNotMatch(html, /wavesight-nav\.css|wavesight-topbar|v3-data-observation\.html|follow-builders\.html|community-intelligence\.html/u);
  }
});

test("the two latest weekly issues have independent editorial pages", () => {
  const weeklySources = fs.readdirSync(path.join(root, "01-SiteV2/content/08-report"))
    .filter((file) => /^\d{4}-\d{2}-\d{2}--weekly-report--ai-business-change-radar\.md$/u.test(file))
    .map((file) => ({
      file,
      markdown: fs.readFileSync(path.join(root, "01-SiteV2/content/08-report", file), "utf8"),
    }))
    .filter(({ markdown }) => /^status:\s*published$/mu.test(markdown))
    .map(({ file, markdown }) => ({
      file,
      date: markdown.match(/^date:\s*(\d{4}-\d{2}-\d{2})$/mu)?.[1] || "",
    }))
    .sort((left, right) => right.date.localeCompare(left.date));
  assert.ok(weeklySources.length >= 2, "at least two published weekly sources must exist");
  for (const { date } of weeklySources.slice(0, 2)) {
    const file = path.join(root, "01-SiteV2", "site", `weekly-ai-business-change-radar-${date}.html`);
    assert.ok(fs.existsSync(file), `${date} weekly detail page must exist`);
    const html = fs.readFileSync(file, "utf8");
    assert.match(html, /data-periodic-report-selector/u);
    assert.match(html, /weekly-fast-read/u);
    assert.match(html, /weekly-trend-stack/u);
    assert.match(html, /weekly-chain-list/u);
    assert.match(html, /weekly-opportunity-list/u);
    assert.match(html, /weekly-watch-grid/u);
    assert.doesNotMatch(html, /<table/u);
  }
  const latest = fs.readFileSync(path.join(root, "01-SiteV2", "site", "weekly-ai-business-change-radar.html"), "utf8");
  assert.match(latest, new RegExp(weeklySources[0].file.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "u"));
});

test("retired V3 page assets are deleted and internal compatibility datasets stay private", () => {
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/github-pages.yml"), "utf8");
  for (const retired of [
    "assets/wavesight-nav.css",
    "assets/v3-data-observation-desk.css",
    "assets/v3-data-observation-desk.js",
    "assets/follow-builders.css",
    "assets/follow-builders.js",
    "assets/community-intelligence.css",
    "assets/community-intelligence.js",
  ]) {
    assert.equal(fs.existsSync(path.join(root, "01-SiteV2/site", retired)), false, `${retired} must stay deleted`);
  }
  for (const internal of [
    "data/v3-data-observation-desk.json",
    "data/intelligence-graph-index.json",
    "data/follow-builders-daily.json",
  ]) {
    assert.ok(workflow.includes(`--exclude="${internal}"`), `${internal} must be excluded from Pages`);
  }
});
