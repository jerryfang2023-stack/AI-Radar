#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const readJson = (file) => JSON.parse(read(file));
const problems = [];

function fail(message) {
  problems.push(message);
}

function expectText(file, expected, label = expected) {
  const text = read(file);
  if (!text.includes(expected)) fail(`${file} missing ${label}`);
}

function rejectText(file, forbidden, label = forbidden) {
  const text = read(file);
  if (text.includes(forbidden)) fail(`${file} contains retired ${label}`);
}

function parseCurrentVersions() {
  const text = read("context/version-ledger.md");
  const section = text.match(/## Current Version\s+([\s\S]*?)(?=\n## )/u)?.[1] || "";
  const fields = new Map();
  for (const match of section.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gmu)) {
    const key = match[1].trim();
    if (key !== "Field" && key !== "---") fields.set(key, match[2].trim().replaceAll("`", ""));
  }
  return fields;
}

const versions = parseCurrentVersions();
const expected = {
  site: "SITE-V4.3.0-compatibility-write-disabled",
  ops: "OPS-V2.0.0-v4-telemetry",
  reports: "REPORTS-V1.1.0-lane-independent",
  opportunity: "OMAP-V2.0.0-v4-evidence",
  trendRadar: "TRADAR-V1.0.0-factual-change-explorer",
  person: "PERSON-REVIEW-V1.0",
  skillStore: "v1.7.0 Funding Insights generation lane",
};

const ledgerChecks = [
  ["Main website version", expected.site],
  ["Operations backend version", expected.ops],
  ["Reports Center column version", expected.reports],
  ["Opportunity Map column version", expected.opportunity],
  ["Trend Radar column version", expected.trendRadar],
  ["Person-account review contract", expected.person],
  ["Weekly report page-generator Skill", "guanlan-weekly-report-page-generator v1.1.1"],
  ["Monthly report page-generator Skill", "guanlan-monthly-report-page-generator v1.1.0"],
  ["Opportunity Map updater Skill", "guanlan-opportunity-radar-updater v1.4.0"],
  ["Trend Radar updater Skill", "guanlan-trend-radar-updater v1.0.0"],
  ["Funding Insight generator Skill", "guanlan-funding-insight-generator v1.0.0"],
  ["Community Intelligence monitor Skill", "guanlan-community-intelligence-monitor v1.0.6"],
  ["Monthly business-structure content Skill", "guanlan-monthly-business-structure-report v0.2.1"],
  ["Skill governance editor", "guanlan-skill-editor v1.0.2"],
  ["Code and rule auditor", "guanlan-code-rule-auditor v1.0.2"],
  ["Skill Store version", expected.skillStore],
  ["Git tag", "v4.3.0-compatibility-write-disabled"],
];
for (const [field, value] of ledgerChecks) {
  if (versions.get(field) !== value) fail(`version ledger ${field} expected ${value}, found ${versions.get(field) || "missing"}`);
}

const sitePages = [
  "01-SiteV2/site/data-center.html",
  "01-SiteV2/site/intelligence-map.html",
  "01-SiteV2/site/opportunity-map.html",
  "01-SiteV2/site/trend-radar.html",
  "01-SiteV2/site/funding-insights.html",
  "01-SiteV2/site/weekly-ai-business-change-radar.html",
];
const redirectPages = [
  "01-SiteV2/site/v3-data-observation.html",
  "01-SiteV2/site/follow-builders.html",
  "01-SiteV2/site/community-intelligence.html",
  "01-SiteV2/site/reports.html",
];
for (const file of new Set([...sitePages, ...redirectPages])) expectText(file, expected.site, "current SITE version");
expectText("01-SiteV2/site/operations-console.html", expected.ops, "current Operations Backend version");
expectText("01-SiteV2/site/intelligence-map.html", expected.reports);
expectText("01-SiteV2/site/opportunity-map.html", expected.opportunity);
expectText("01-SiteV2/site/trend-radar.html", expected.trendRadar);
for (const file of new Set(sitePages)) expectText(file, 'href="trend-radar.html"', "Trend Radar navigation entry");
const historicalReportPages = fs.readdirSync(path.join(root, "01-SiteV2/site"))
  .filter((name) => /^(weekly-ai-business-change-radar-\d{4}-\d{2}-\d{2}|monthly-business-structure-\d{4}-\d{2})\.html$/u.test(name))
  .map((name) => `01-SiteV2/site/${name}`);
for (const file of historicalReportPages) {
  const html = read(file);
  if (!/REPORTS-V1\.(?:0\.0-periodic-report-center|1\.0-lane-independent)/u.test(html)) {
    fail(`${file} missing supported Reports Center version`);
  }
  rejectText(file, expected.opportunity, "Opportunity Map column version");
}
for (const file of ["01-SiteV2/site/intelligence-map.html", "01-SiteV2/site/opportunity-map.html", ...historicalReportPages]) {
  rejectText(file, "IMAP-V2.1.0", "shared IMAP metadata");
}

const ops = readJson("01-SiteV2/site/data/ops-console.json");
const opsVersions = new Map((ops.governance?.versions || []).map((item) => [item.key, item.value]));
const opsChecks = [
  ["SITE", expected.site],
  ["OPS", expected.ops],
  ["REPORTS", expected.reports],
  ["OMAP", expected.opportunity],
  ["TRADAR", expected.trendRadar],
  ["PERSON", expected.person],
  ["SKILL", expected.skillStore],
];
for (const [key, value] of opsChecks) {
  if (opsVersions.get(key) !== value) fail(`ops console ${key} expected ${value}, found ${opsVersions.get(key) || "missing"}`);
}
if (opsVersions.has("IMAP")) fail("ops console still exposes retired IMAP version row");

const personReview = readJson("01-SiteV2/content/11-databases/entity-history-v1/person-account-review-decisions.json");
if (personReview.review_version !== expected.person) fail("person review version does not match ledger");
if (personReview.summary?.candidates !== 37 || personReview.summary?.expected_public_natural_people !== 31 || personReview.summary?.quarantined !== 6) {
  fail("person review summary must remain 37 candidates / 31 public natural people / 6 quarantined accounts");
}

const skillVersions = [
  ["agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md", 'version: "1.4.0"'],
  ["agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md", 'version: "1.0.6"'],
  ["agent-workflow/skills/guanlan-weekly-report-page-generator/SKILL.md", 'version: "1.1.1"'],
  ["agent-workflow/skills/guanlan-monthly-business-structure-report/SKILL.md", 'version: "0.2.1"'],
  ["agent-workflow/skills/guanlan-skill-editor/SKILL.md", 'version: "1.0.2"'],
  ["agent-workflow/skills/guanlan-code-rule-auditor/SKILL.md", 'version: "1.0.2"'],
  ["agent-workflow/skills/guanlan-trend-radar-updater/SKILL.md", 'version: "1.0.0"'],
];
for (const [file, version] of skillVersions) expectText(file, version);
expectText("agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md", expected.opportunity);
expectText("agent-workflow/skills/guanlan-trend-radar-updater/SKILL.md", expected.trendRadar);
rejectText("agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md", "Industry Reports page's two", "nested Industry Reports ownership");
rejectText("agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md", "current SITE-V3.4.5", "current V3 site claim");
expectText("agent-workflow/product/tag-taxonomy.md", "Data Center V4 uses `tag-taxonomy-v4.json`");

const legacySkillFiles = fs.existsSync(path.join(root, "skills"))
  ? fs.readdirSync(path.join(root, "skills"), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name === "SKILL.md")
  : [];
if (legacySkillFiles.length) fail(`root skills directory contains ${legacySkillFiles.length} duplicate SKILL.md files`);

if (problems.length) {
  console.error(`version_consistency_failed:\n- ${problems.join("\n- ")}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  site_version: expected.site,
  operations_version: expected.ops,
  reports_version: expected.reports,
  opportunity_version: expected.opportunity,
  trend_radar_version: expected.trendRadar,
  person_review_version: expected.person,
  skill_store_version: expected.skillStore,
  public_pages_checked: new Set([...sitePages, ...redirectPages, ...historicalReportPages]).size,
  ops_version_rows: opsVersions.size,
}, null, 2));
