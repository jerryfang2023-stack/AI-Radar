import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildIndustryReportsData } from "../../../01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

test("Opportunity Map projection reads accepted V4 evidence without Signal Cards", () => {
  const data = buildIndustryReportsData(root);
  const dataCenter = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json"), "utf8"));
  const reportsHtml = fs.readFileSync(path.join(root, "01-SiteV2/site/intelligence-map.html"), "utf8");
  const opportunityHtml = fs.readFileSync(path.join(root, "01-SiteV2/site/opportunity-map.html"), "utf8");

  assert.equal(data.meta.siteVersion, "SITE-V4.2.0-entity-history");
  assert.equal(data.meta.schemaVersion, "OPPORTUNITY-EVIDENCE-V2.0");
  assert.equal(data.meta.applicationVersion, "OMAP-V2.0.0-v4-evidence");
  assert.equal(data.meta.opportunityMapVersion, "OMAP-V2.0.0-v4-evidence");
  assert.equal(data.meta.directionCardVersion, "DIRECTION-CARD-V2.0-v4-evidence");
  assert.equal(data.meta.sourceAdapter, "data-center-v4-canonical");
  assert.match(data.meta.activeDate, /^\d{4}-\d{2}-\d{2}$/u);
  const cadenceLagDays = Math.round(
    (Date.parse(`${dataCenter.meta.currentDate}T00:00:00Z`) - Date.parse(`${data.meta.activeDate}T00:00:00Z`))
      / 86_400_000,
  );
  assert.ok(
    cadenceLagDays >= 0 && cadenceLagDays <= 7,
    `Opportunity Map must not be newer than Data Center or lag its weekly cadence: ${cadenceLagDays} days`,
  );
  assert.ok(data.evidence.length > 0);
  assert.ok(data.evidence.every((card) => card.id.startsWith("EV-") && card.title && card.date));
  assert.ok(data.evidence.every((card) => card.claim_refs.length && card.claim_refs.every((id) => id.startsWith("CL-"))));
  assert.ok(data.evidence.every((card) => card.source_refs.length && card.source_refs.every((id) => id.startsWith("SA-"))));
  assert.ok(data.evidence.every((card) => Object.values(card.application_assertions).flat()
    .every((item) => card.claim_refs.includes(item.claim_ref) && item.source_refs.every((id) => card.source_refs.includes(id)))));
  assert.ok(data.evidence.every((card) => Object.keys(card.opportunitySignals.labels).length === 7));
  assert.equal(data.directionCards.length, 2);
  assert.ok(data.directionCards.every((card) => card.judgment && card.counterSignal));
  assert.ok(data.directionCards.every((card) => card.evidenceCount >= 2));
  assert.ok(data.directionCards.every((card) => card.evidence.every((item) => (
    item.eventId.startsWith("EV-")
    && item.claimRefs.every((id) => id.startsWith("CL-"))
    && item.sourceRefs.every((id) => id.startsWith("SA-"))
    && item.sourceUrl
  ))));
  assert.equal(JSON.stringify(data).includes("evidence_card_ids"), false);
  assert.doesNotMatch(reportsHtml, /data\/v3-data-observation-desk\.json|data\/industry-reports-frontstage\.json/u);
  assert.match(reportsHtml, /REPORTS-V1\.1\.0-lane-independent/u);
  assert.doesNotMatch(opportunityHtml, /data\/v3-data-observation-desk\.json/u);
  assert.match(opportunityHtml, /data\/opportunity-evidence-v2\.json/u);
  assert.match(opportunityHtml, /OMAP-V2\.0\.0-v4-evidence/u);
  assert.match(opportunityHtml, /data-direction-cards|查看方向|创业假设/u);
  assert.doesNotMatch(opportunityHtml, /data-map-toggle|Cell Evidence|Relation Paths/u);
});

test("Opportunity Map projection builds from V4 fixtures when all V3 assets are absent", () => {
  const fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-opportunity-"));
  const dateDir = path.join(fixtureRoot, "01-SiteV2/content/11-databases/data-center-v4/2026-07-25");
  fs.mkdirSync(dateDir, { recursive: true });
  const write = (name, value) => fs.writeFileSync(path.join(dateDir, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
  write("source-artifacts.json", [{
    source_artifact_id: "SA-FIXTURE",
    source_url: "https://example.com/deployment",
    publisher: "Example",
    content_hash: "fixture",
  }]);
  write("raw-documents.json", [{
    raw_id: "RAW-FIXTURE",
    source_artifact_id: "SA-FIXTURE",
    body_clean: "Fixture Company deployed a developer workflow tool.",
  }]);
  write("claims.json", [{
    claim_id: "CL-FIXTURE",
    raw_id: "RAW-FIXTURE",
    subject: "Fixture Company",
    predicate: "deployed",
    object: "developer workflow tool",
    source_quote: "Fixture Company deployed a developer workflow tool.",
    source_span: { raw_id: "RAW-FIXTURE", start: 0, end: 51 },
    verification_status: "accepted",
  }]);
  write("entities.json", [{
    entity_id: "EN-FIXTURE",
    canonical_name: "Fixture Company",
    entity_type: "organization_candidate",
    verification_status: "verified",
  }]);
  write("canonical-events.json", [{
    event_id: "EV-FIXTURE",
    event_type: "deployment",
    publication_status: "verified",
    display_title_zh: "Fixture Company 部署开发者工作流工具",
    event_time: "2026-07-25T00:00:00.000Z",
    entities: ["EN-FIXTURE"],
    claim_refs: ["CL-FIXTURE"],
    source_refs: ["SA-FIXTURE"],
  }]);
  write("facet-assertions.json", []);
  try {
    const data = buildIndustryReportsData(fixtureRoot, {
      directionFile: "",
    });
    assert.equal(data.meta.activeDate, "2026-07-25");
    assert.equal(data.meta.evidenceCount, 1);
    assert.equal(data.meta.directionCardCount, 0);
    assert.deepEqual(data.directionCards, []);
    assert.equal(data.evidence[0].event_id, "EV-FIXTURE");
    assert.deepEqual(data.evidence[0].claim_refs, ["CL-FIXTURE"]);
    assert.deepEqual(data.evidence[0].source_refs, ["SA-FIXTURE"]);
    for (const legacy of [
      "01-SiteV2/knowledge/01-Signal-Cards",
      "01-SiteV2/site/data/v3-data-observation-desk.json",
      "01-SiteV2/site/data/intelligence-graph-index.json",
    ]) {
      assert.equal(fs.existsSync(path.join(fixtureRoot, legacy)), false);
    }
  } finally {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("Opportunity Map evidence excludes viewpoints, community material, and OPS reports", () => {
  const adapter = fs.readFileSync(path.join(root, "agent-workflow/tools/opportunity-evidence-v2.mjs"), "utf8");
  assert.doesNotMatch(adapter, /07-points|first-line|follow-builders|community-intelligence|pipeline-dashboard|agent-workflow\/reports/u);
  assert.match(adapter, /canonical-events\.json/u);
  assert.match(adapter, /claims\.json/u);
  assert.match(adapter, /source-artifacts\.json/u);
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
    assert.doesNotMatch(html, /\[(?:E|O|C):[^\]]+\]|report-evidence-ref/u, `${file} must not expose internal evidence IDs`);
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
