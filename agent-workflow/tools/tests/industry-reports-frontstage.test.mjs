import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildIndustryReportsData } from "../../../01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");

test("industry reports projection isolates the public application from the V3 desk", () => {
  const data = buildIndustryReportsData(root);
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/intelligence-map.html"), "utf8");

  assert.equal(data.meta.siteVersion, "SITE-V4.2.0-entity-history");
  assert.equal(data.meta.applicationVersion, "IMAP-V2.1.0-v4-unified-frontstage");
  assert.match(data.meta.activeDate, /^\d{4}-\d{2}-\d{2}$/u);
  assert.ok(data.cards.length > 0);
  assert.ok(data.cards.every((card) => card.id && card.title && card.date));
  assert.ok(data.cards.every((card) => Object.keys(card.opportunitySignals.labels).length === 7));
  assert.doesNotMatch(html, /data\/v3-data-observation-desk\.json/u);
  assert.match(html, /data\/industry-reports-frontstage\.json/u);
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
    assert.match(html, /assets\/data-center-v4\.css/u);
    assert.match(html, /class="dc-sidebar"/u);
    assert.match(html, /href="intelligence-map\.html" aria-current="page">行业报告/u);
    assert.doesNotMatch(html, /wavesight-nav\.css|wavesight-topbar|v3-data-observation\.html|follow-builders\.html|community-intelligence\.html/u);
  }
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
