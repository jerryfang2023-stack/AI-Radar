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
  release: "V4.6.1-china-market-scope",
  packageVersion: "4.6.1",
  productVersion: "V4.6",
  gitTag: "v4.6.1-china-market-scope",
  site: "SITE-V4.4.1-china-market-scope",
  ops: "OPS-V2.0.0-v4-telemetry",
  reports: "REPORTS-V1.2.0-research-hub",
  opportunity: "OMAP-V2.0.0-v4-evidence",
  trendRadar: "TRADAR-V1.0.1-china-market-filter",
  fundingInsights: "FUNDING-INSIGHT-V1.1.0-card-integrity",
  person: "PERSON-REVIEW-V1.1",
  skillStore: "v2.0.1 GPT-5.6 full-audit corrections",
  vault: "GUANLAN-VAULT-V1.2-private-evidence-linked (external)",
  dataLake: "DATA-LAKE-V4.0-23-table",
  privateEvidence: "PRIVATE-EVIDENCE-STORE-V2.0",
  windowsAutomation: "WINDOWS-AUTOMATION-V1.0-seven-task",
};

const ledgerChecks = [
  ["Current version", expected.release],
  ["Product version", expected.productVersion],
  ["Main website version", expected.site],
  ["Operations backend version", expected.ops],
  ["Guanlan Research column version", expected.reports],
  ["Opportunity Map column version", expected.opportunity],
  ["Trend Radar column version", expected.trendRadar],
  ["Funding Insights column version", expected.fundingInsights],
  ["Person-account review contract", expected.person],
  ["Weekly report page-generator Skill", "guanlan-weekly-report-page-generator v1.2.0"],
  ["Monthly report page-generator Skill", "guanlan-monthly-report-page-generator v1.2.0"],
  ["Data Center supervisor Skill", "guanlan-data-center-supervisor v1.3.1"],
  ["Opportunity Map updater Skill", "guanlan-opportunity-radar-updater v1.5.0"],
  ["Trend Radar updater Skill", "guanlan-trend-radar-updater v1.1.0"],
  ["Funding Insight generator Skill", "guanlan-funding-insight-generator v1.2.1"],
  ["First-Line Viewpoints monitor Skill", "guanlan-first-line-viewpoints-monitor v1.2.1"],
  ["Community Intelligence monitor Skill", "guanlan-community-intelligence-monitor v1.1.0"],
  ["Follow-builders support Skill", "follow-builders v2.1.1"],
  ["Weekly business-change content Skill", "guanlan-weekly-business-change-radar v1.3.0"],
  ["Monthly business-structure content Skill", "guanlan-monthly-business-structure-report v1.0.0"],
  ["Daily source monitor Skill", "guanlan-daily-monitor v1.3.0"],
  ["Source-intake quality gate Skill", "guanlan-monitor-quality-gate v1.3.0"],
  ["Source-intake QC Skill", "guanlan-daily-monitor-qc v1.3.0"],
  ["Skill governance editor", "guanlan-skill-editor v2.0.1"],
  ["Code and rule auditor", "guanlan-code-rule-auditor v1.2.1"],
  ["Skill Store version", expected.skillStore],
  ["Local Obsidian knowledge base", expected.vault],
  ["Data lake contract", expected.dataLake],
  ["Private evidence store", expected.privateEvidence],
  ["Local Windows automation", expected.windowsAutomation],
  ["Git tag", expected.gitTag],
];
for (const [field, value] of ledgerChecks) {
  if (versions.get(field) !== value) fail(`version ledger ${field} expected ${value}, found ${versions.get(field) || "missing"}`);
}
expectText("AGENTS.md", "Current Skill Store version: `v2.0.1`");
expectText(".agents/README.md", "Skill Store version: `v2.0.1`");
expectText("docs/agent-handoff.md", "Current Skill governance: Skill Store `v2.0.1`");
expectText("context/version-ledger.md", "`guanlan-code-rule-auditor` v1.2.1 audits V4 facts");
const packageVersion = readJson("package.json").version;
const packageLockVersion = readJson("package-lock.json").version;
if (packageVersion !== expected.packageVersion) fail(`package.json expected ${expected.packageVersion}, found ${packageVersion || "missing"}`);
if (packageLockVersion !== expected.packageVersion) fail(`package-lock.json expected ${expected.packageVersion}, found ${packageLockVersion || "missing"}`);

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
  "01-SiteV2/site/pipeline-dashboard.html",
];
for (const file of new Set([...sitePages, ...redirectPages])) expectText(file, expected.site, "current SITE version");
expectText("01-SiteV2/site/operations-console.html", expected.ops, "current Operations Backend version");
expectText("01-SiteV2/site/intelligence-map.html", expected.reports);
expectText("01-SiteV2/site/weekly-ai-business-change-radar.html", expected.reports);
expectText("01-SiteV2/site/opportunity-map.html", expected.opportunity);
expectText("01-SiteV2/site/trend-radar.html", expected.trendRadar);
for (const file of new Set(sitePages)) expectText(file, 'href="trend-radar.html"', "Trend Radar navigation entry");
const historicalReportPages = fs.readdirSync(path.join(root, "01-SiteV2/site"))
  .filter((name) => /^(weekly-ai-business-change-radar-\d{4}-\d{2}-\d{2}|monthly-business-structure-\d{4}-\d{2})\.html$/u.test(name))
  .map((name) => `01-SiteV2/site/${name}`);
for (const file of historicalReportPages) {
  const html = read(file);
  if (!/REPORTS-V1\.(?:0\.0-periodic-report-center|1\.0-lane-independent|2\.0-research-hub)/u.test(html)) {
    fail(`${file} missing supported Guanlan Research version`);
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

const fundingInsights = readJson("01-SiteV2/site/data/funding-insights-v1.json");
if (fundingInsights.meta?.site_version !== expected.site) {
  fail(`Funding Insights site version expected ${expected.site}, found ${fundingInsights.meta?.site_version || "missing"}`);
}

const personReview = readJson("01-SiteV2/content/11-databases/entity-history-v1/person-account-review-decisions.json");
if (personReview.review_version !== "PERSON-REVIEW-V1.0") fail("base person/account review must remain PERSON-REVIEW-V1.0");
if (personReview.summary?.candidates !== 37 || personReview.summary?.expected_public_natural_people !== 31 || personReview.summary?.quarantined !== 6) {
  fail("person review summary must remain 37 candidates / 31 public natural people / 6 quarantined accounts");
}
const founderReview = readJson("01-SiteV2/content/11-databases/entity-history-v1/funding-founder-review-decisions.json");
if (founderReview.review_version !== expected.person) fail("funding founder review version does not match ledger");
if (founderReview.summary?.accepted_founder_profiles !== 30 || founderReview.decisions?.length !== 30) {
  fail("funding founder review must publish exactly 30 accepted profiles");
}

const skillVersions = [
  ["agent-workflow/skills/guanlan-data-center-supervisor/SKILL.md", 'version: "1.3.1"'],
  ["agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md", 'version: "1.5.0"'],
  ["agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md", 'version: "1.2.1"'],
  ["agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md", 'version: "1.1.0"'],
  ["agent-workflow/skills/follow-builders/SKILL.md", 'version: "2.1.1"'],
  ["agent-workflow/skills/guanlan-funding-insight-generator/SKILL.md", 'version: "1.2.1"'],
  ["agent-workflow/skills/guanlan-weekly-report-page-generator/SKILL.md", 'version: "1.2.0"'],
  ["agent-workflow/skills/guanlan-monthly-business-structure-report/SKILL.md", 'version: "1.0.0"'],
  ["agent-workflow/skills/guanlan-skill-editor/SKILL.md", 'version: "2.0.1"'],
  ["agent-workflow/skills/guanlan-code-rule-auditor/SKILL.md", 'version: "1.2.1"'],
  ["agent-workflow/skills/guanlan-weekly-business-change-radar/SKILL.md", 'version: "1.3.0"'],
  ["agent-workflow/skills/guanlan-daily-monitor/SKILL.md", 'version: "1.3.0"'],
  ["agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md", 'version: "1.3.0"'],
  ["agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md", 'version: "1.3.0"'],
  ["agent-workflow/skills/guanlan-trend-radar-updater/SKILL.md", 'version: "1.1.0"'],
];
for (const [file, version] of skillVersions) expectText(file, version);
expectText("agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md", expected.opportunity);
expectText("agent-workflow/skills/guanlan-trend-radar-updater/SKILL.md", expected.trendRadar);
rejectText("agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md", "Industry Reports page's two", "nested Industry Reports ownership");
rejectText("agent-workflow/skills/guanlan-community-intelligence-monitor/SKILL.md", "current SITE-V3.4.5", "current V3 site claim");
expectText("agent-workflow/product/column-tag-taxonomy-v1.json", '"canonical_fact_input": false');
expectText("context/frontstage-page-contracts.md", expected.site, "current SITE version");
expectText("context/project-memory.md", "SITE-V4.4.1", "current SITE major/minor version");
rejectText("context/frontstage-page-contracts.md", "The legacy Business Signals Card set remains an internal compatibility dataset", "active Card compatibility contract");
rejectText("context/project-memory.md", "Business Signals is an internal compatibility chain for Raw / Pool / Card", "active Raw/Pool/Card operating model");

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
  release_version: expected.release,
  package_version: expected.packageVersion,
  git_tag: expected.gitTag,
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
