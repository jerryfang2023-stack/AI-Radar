#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const expectedSiteVersion = "SITE-V4.3.0-compatibility-write-disabled";
const expectedDataCenterProductVersion = "SITE-V4.2.0-entity-history";
const expectedOpportunityEvidenceSiteVersion = "SITE-V4.2.0-entity-history";
const expectedReportsCenterColumnVersion = "REPORTS-V1.1.0-lane-independent";
const expectedOpportunityMapColumnVersion = "OMAP-V2.0.0-v4-evidence";
const expectedFundingInsightsColumnVersion = "FUNDING-INSIGHT-V1.0-auto-published-research";

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const frontstageFiles = [
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/data-center.html",
  "01-SiteV2/site/v3-data-observation.html",
  "01-SiteV2/site/intelligence-map.html",
  "01-SiteV2/site/funding-insights.html",
  "01-SiteV2/site/opportunity-map.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-07-20.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-07-13.html",
  "01-SiteV2/site/weekly-ai-business-change-radar.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-07-06.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-06-29.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-06-22.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-06-15.html",
  "01-SiteV2/site/monthly-business-structure-2026-06.html",
  "01-SiteV2/site/follow-builders.html",
  "01-SiteV2/site/community-intelligence.html",
  "01-SiteV2/site/reports.html",
  "01-SiteV2/site/pipeline-dashboard.html",
  "01-SiteV2/site/assets/data-center-v4.css",
  "01-SiteV2/site/assets/data-center-v4.js",
  "01-SiteV2/site/assets/funding-insights.css",
  "01-SiteV2/site/assets/funding-insights.js",
  "01-SiteV2/site/assets/v4-report-shell.js",
  "01-SiteV2/site/assets/weekly-report.css",
  "01-SiteV2/site/assets/reports.css",
  "01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs",
  "01-SiteV2/site/scripts/build-industry-reports-frontstage.mjs",
  "01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs",
  "01-SiteV2/site/data/data-center-v4-frontstage.json",
  "01-SiteV2/site/data/opportunity-evidence-v2.json",
  "01-SiteV2/site/data/funding-insights-v1.json",
  "01-SiteV2/site/data/first-line-viewpoints-v4.json",
  "01-SiteV2/site/data/community-intelligence.json",
].map((file) => path.join(root, file));

const publicFrontstageTextFiles = [
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/data-center.html",
  "01-SiteV2/site/v3-data-observation.html",
  "01-SiteV2/site/intelligence-map.html",
  "01-SiteV2/site/funding-insights.html",
  "01-SiteV2/site/opportunity-map.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-07-20.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-07-13.html",
  "01-SiteV2/site/weekly-ai-business-change-radar.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-07-06.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-06-29.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-06-22.html",
  "01-SiteV2/site/weekly-ai-business-change-radar-2026-06-15.html",
  "01-SiteV2/site/monthly-business-structure-2026-06.html",
  "01-SiteV2/site/follow-builders.html",
  "01-SiteV2/site/community-intelligence.html",
  "01-SiteV2/site/reports.html",
  "01-SiteV2/site/pipeline-dashboard.html",
  "01-SiteV2/site/assets/data-center-v4.css",
  "01-SiteV2/site/assets/data-center-v4.js",
  "01-SiteV2/site/assets/funding-insights.css",
  "01-SiteV2/site/assets/funding-insights.js",
  "01-SiteV2/site/assets/v4-report-shell.js",
  "01-SiteV2/site/assets/weekly-report.css",
  "01-SiteV2/site/assets/reports.css",
].map((file) => path.join(root, file));

const retiredFrontstagePages = [
  "01-SiteV2/site/daily.html",
  "01-SiteV2/site/daily-detail.html",
  "01-SiteV2/site/signals.html",
  "01-SiteV2/site/signal-detail.html",
  "01-SiteV2/site/trend-tracking.html",
  "01-SiteV2/site/trend-detail.html",
  "01-SiteV2/site/brief.html",
  "01-SiteV2/site/opinion.html",
  "01-SiteV2/site/opinion-detail.html",
  "01-SiteV2/site/builders.html",
  "01-SiteV2/site/builder-detail.html",
].map((file) => path.join(root, file));

const retiredV3PageAssets = [
  "01-SiteV2/site/assets/wavesight-nav.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.js",
  "01-SiteV2/site/assets/follow-builders.css",
  "01-SiteV2/site/assets/follow-builders.js",
  "01-SiteV2/site/assets/community-intelligence.css",
  "01-SiteV2/site/assets/community-intelligence.js",
].map((file) => path.join(root, file));

const requiredOperationalPages = [
  "01-SiteV2/site/admin.html",
  "01-SiteV2/site/operations-console.html",
].map((file) => path.join(root, file));

const retiredPatterns = [
  { pattern: /\bSITE-V2\.[01]\b/u, label: "retired_version_marker" },
  { pattern: /home-v2|page-index|今日观察|趋势追踪|商业内参/u, label: "retired_v2_frontstage_copy" },
  { pattern: /今日判断/u, label: "retired_daily_judgment_copy" },
  { pattern: /dailySummaryCard/u, label: "retired_daily_summary_component" },
  { pattern: /legacyPerspectiveCard/u, label: "retired_legacy_perspective_component" },
  { pattern: /trendLabFocusMarkupLegacy/u, label: "retired_trend_focus_component" },
  { pattern: /mountTrendReportLegacy/u, label: "retired_trend_page_mount" },
  { pattern: /trendLabStatsMarkupLegacy/u, label: "retired_trend_stats_component" },
  { pattern: /今天的趋势判断还在观察/u, label: "retired_home_trend_placeholder" },
  { pattern: /TRD-WATCH-/u, label: "synthetic_trend_report_id" },
  { pattern: /fallbackTrendReportFromDay/u, label: "synthetic_trend_report_fallback" },
  { pattern: /历史内容已完成/u, label: "historical_completion_placeholder" },
  { pattern: /Generated from 01-SiteV2\/content .*V2\.1/u, label: "retired_generated_source_label" },
  { pattern: /Raw\s*->\s*Pool|threshold_pending|threshold_passed|eligible|index_only/u, label: "internal_production_language" },
];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/u).length;
}

function issue(file, label, value = "", line = 1) {
  return { file: rel(file), line, label, value };
}

function collectRetiredPatternIssues() {
  const issues = [];
  for (const file of frontstageFiles) {
    const text = read(file);
    if (!text) {
      issues.push(issue(file, "missing_frontstage_file"));
      continue;
    }
  }
  for (const file of publicFrontstageTextFiles) {
    const text = read(file);
    for (const rule of retiredPatterns) {
      const match = rule.pattern.exec(text);
      if (match) issues.push(issue(file, rule.label, match[0], lineOf(text, match.index)));
    }
  }
  return issues;
}

function collectRetiredPageIssues() {
  const issues = [];
  for (const file of retiredFrontstagePages) {
    if (fs.existsSync(file)) issues.push(issue(file, "retired_v2_frontstage_page_still_exists"));
  }
  for (const file of retiredV3PageAssets) {
    if (fs.existsSync(file)) issues.push(issue(file, "retired_v3_page_asset_still_exists"));
  }
  for (const file of requiredOperationalPages) {
    if (!fs.existsSync(file)) issues.push(issue(file, "missing_required_operational_page"));
  }
  return issues;
}

function collectUnifiedNavigationIssues() {
  const issues = [];
  const redirects = new Map([
    ["v3-data-observation.html", "data-center.html?view=events"],
    ["follow-builders.html", "data-center.html?view=viewpoints"],
    ["community-intelligence.html", "data-center.html?view=community"],
    ["reports.html", "intelligence-map.html"],
    ["pipeline-dashboard.html", "operations-console.html"],
  ]);
  for (const [name, target] of redirects) {
    const file = path.join(root, "01-SiteV2/site", name);
    const text = read(file);
    if (!text.includes(`url=${target}`) || !text.includes(`rel="canonical" href="${target}"`)) {
      issues.push(issue(file, "legacy_route_redirect_missing", target));
    }
    if (/wavesight-nav\.css|wavesight-topbar/u.test(text)) issues.push(issue(file, "legacy_route_loads_v3_shell"));
  }

  const reportsCenterFile = path.join(root, "01-SiteV2/site/intelligence-map.html");
  const reportsCenterHtml = read(reportsCenterFile);
  const reportsCenterRequired = [
    "assets/data-center-v4.css",
    "dc-sidebar",
    "data-center.html?view=events",
    "data-center.html?view=community",
    "data-center.html?view=viewpoints",
    "data-center.html?view=index",
    "应用中心",
    "行业报告",
    "funding-insights.html",
    "opportunity-map.html",
  ];
  for (const token of reportsCenterRequired) {
    if (!reportsCenterHtml.includes(token)) issues.push(issue(reportsCenterFile, "missing_v4_sidebar_navigation_token", token));
  }
  if (reportsCenterHtml.includes("wavesight-topbar") || reportsCenterHtml.includes("wavesight-nav")) {
    issues.push(issue(reportsCenterFile, "retired_reports_center_top_navigation_present"));
  }
  if (reportsCenterHtml.includes("data-center.html?view=companies") || reportsCenterHtml.includes("data-center.html?view=products")) {
    issues.push(issue(reportsCenterFile, "retired_company_product_sidebar_entries_present"));
  }
  if (/报告中心|Reports Center|关联路径|Relation Paths|data-network-list|renderNetwork/u.test(reportsCenterHtml)) {
    issues.push(issue(reportsCenterFile, "retired_industry_reports_copy_or_module_present"));
  }
  if (reportsCenterHtml.includes("data/v3-data-observation-desk.json") || reportsCenterHtml.includes("data/industry-reports-frontstage.json")) {
    issues.push(issue(reportsCenterFile, "industry_reports_data_dependency_present"));
  }
  if (/data-map-panel|data-cell-modal|id="maps-title"/u.test(reportsCenterHtml)) {
    issues.push(issue(reportsCenterFile, "opportunity_map_module_still_inside_industry_reports"));
  }

  const opportunityMapFile = path.join(root, "01-SiteV2/site/opportunity-map.html");
  const opportunityMapHtml = read(opportunityMapFile);
  const opportunityMapRequired = [
    "assets/data-center-v4.css",
    "dc-sidebar",
    "href=\"intelligence-map.html\">行业报告",
    "href=\"funding-insights.html\">融资透视",
    "href=\"opportunity-map.html\" aria-current=\"page\">机会地图",
    "data-map-panel=\"entry\"",
    "data-map-panel=\"pain\"",
    "data-direction-cards",
    "data-cell-modal",
  ];
  for (const token of opportunityMapRequired) {
    if (!opportunityMapHtml.includes(token)) issues.push(issue(opportunityMapFile, "opportunity_map_required_token_missing", token));
  }
  if (!opportunityMapHtml.includes("data/opportunity-evidence-v2.json") || opportunityMapHtml.includes("data/v3-data-observation-desk.json")) {
    issues.push(issue(opportunityMapFile, "opportunity_map_projection_dependency_invalid"));
  }

  const fundingInsightsFile = path.join(root, "01-SiteV2/site/funding-insights.html");
  const fundingInsightsHtml = read(fundingInsightsFile);
  const fundingInsightsRequired = [
    "assets/data-center-v4.css",
    "assets/funding-insights.css",
    "assets/funding-insights.js",
    "href=\"trend-radar.html\">变化雷达",
    "href=\"funding-insights.html\" aria-current=\"page\">融资透视",
    "href=\"opportunity-map.html\">机会地图",
    "href=\"intelligence-map.html\">行业报告",
  ];
  for (const token of fundingInsightsRequired) {
    if (!fundingInsightsHtml.includes(token)) issues.push(issue(fundingInsightsFile, "funding_insights_required_token_missing", token));
  }
  const fundingInsightsScript = path.join(root, "01-SiteV2/site/assets/funding-insights.js");
  if (!read(fundingInsightsScript).includes("data/funding-insights-v1.json")) {
    issues.push(issue(fundingInsightsScript, "funding_insights_projection_dependency_missing"));
  }

  const reportDetailPages = [
    "weekly-ai-business-change-radar.html",
    "weekly-ai-business-change-radar-2026-07-20.html",
    "weekly-ai-business-change-radar-2026-07-13.html",
    "weekly-ai-business-change-radar-2026-07-06.html",
    "weekly-ai-business-change-radar-2026-06-29.html",
    "weekly-ai-business-change-radar-2026-06-22.html",
    "weekly-ai-business-change-radar-2026-06-15.html",
    "monthly-business-structure-2026-06.html",
  ];
  const requiredV4Tokens = [
    "assets/data-center-v4.css",
    "class=\"dc-sidebar\"",
    "data-center.html?view=events",
    "data-center.html?view=community",
    "data-center.html?view=viewpoints",
    "data-center.html?view=index",
    "href=\"funding-insights.html\">融资透视",
    "href=\"intelligence-map.html\" aria-current=\"page\">行业报告",
    "href=\"opportunity-map.html\">机会地图",
    "assets/v4-report-shell.js",
  ];
  for (const name of reportDetailPages) {
    const file = path.join(root, "01-SiteV2/site", name);
    const text = read(file);
    for (const token of requiredV4Tokens) {
      if (!text.includes(token)) issues.push(issue(file, "report_detail_v4_shell_token_missing", token));
    }
    if (/wavesight-nav\.css|wavesight-topbar|v3-data-observation\.html|follow-builders\.html|community-intelligence\.html/u.test(text)) {
      issues.push(issue(file, "report_detail_legacy_shell_present"));
    }
  }
  return issues;
}

function latestContentDate() {
  const roots = [
    path.join(root, "01-SiteV2", "content", "01-raw"),
    path.join(root, "01-SiteV2", "content", "02-pool"),
    path.join(root, "01-SiteV2", "content", "04-business-signals", "signals"),
  ];
  const dates = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      const match = entry.name.match(/^(20\d{2}-\d{2}-\d{2})/u);
      if (match) dates.push(match[1]);
    }
  };
  roots.forEach(walk);
  return dates.sort().at(-1) || "";
}

function collectIndustryReportsDataIssues() {
  const file = path.join(root, "01-SiteV2/site/data/opportunity-evidence-v2.json");
  const text = read(file);
  if (!text) return [issue(file, "missing_industry_reports_frontstage_data")];
  const issues = [];
  try {
    const data = JSON.parse(text);
    if (data?.meta?.siteVersion !== expectedOpportunityEvidenceSiteVersion) {
      issues.push(issue(file, "industry_reports_site_version_mismatch", `${data?.meta?.siteVersion || "missing"}; expected ${expectedOpportunityEvidenceSiteVersion}`));
    }
    if (data?.meta?.applicationVersion !== expectedOpportunityMapColumnVersion || data?.meta?.opportunityMapVersion !== expectedOpportunityMapColumnVersion) {
      issues.push(issue(file, "opportunity_map_application_version_mismatch", `${data?.meta?.opportunityMapVersion || data?.meta?.applicationVersion || "missing"}; expected ${expectedOpportunityMapColumnVersion}`));
    }
    if (!Array.isArray(data?.evidence) || !data.evidence.length) {
      issues.push(issue(file, "industry_reports_cards_missing"));
    }
    for (const card of data?.evidence || []) {
      if (
        !card.id?.startsWith("EV-")
        || !card.title
        || !card.date
        || !card.opportunitySignals?.labels
        || !card.claim_refs?.length
        || !card.source_refs?.length
      ) {
        issues.push(issue(file, "industry_reports_card_incomplete", card.id || card.title || "missing"));
      }
      for (const assertion of Object.values(card.application_assertions || {}).flat()) {
        if (!card.claim_refs.includes(assertion.claim_ref) || assertion.source_refs?.some((id) => !card.source_refs.includes(id))) {
          issues.push(issue(file, "opportunity_assertion_evidence_invalid", card.id || card.title || "missing"));
        }
      }
    }
    if (!Array.isArray(data?.directionCards) || !data.directionCards.length) {
      issues.push(issue(file, "direction_cards_missing"));
    }
    for (const card of data?.directionCards || []) {
      if (!card.id || !card.title || !card.judgment || !card.hypothesis || !card.counterSignal || !["validation_ready", "forming", "tracking"].includes(card.status)) {
        issues.push(issue(file, "direction_card_incomplete", card.id || card.title || "missing"));
      }
      if (!Array.isArray(card.unknowns) || !card.unknowns.length || !card.validationAction) {
        issues.push(issue(file, "direction_card_validation_boundary_missing", card.id || card.title || "missing"));
      }
      if (!Array.isArray(card.evidence) || card.evidence.length < 2 || card.evidence.some((item) => (
        !item.eventId?.startsWith("EV-") || !item.claimRefs?.length || !item.sourceRefs?.length || !item.sourceUrl
      ))) {
        issues.push(issue(file, "direction_card_evidence_invalid", card.id || card.title || "missing"));
      }
    }
  } catch (error) {
    issues.push(issue(file, "industry_reports_json_parse_failed", error.message));
  }
  return issues;
}

function collectV4FrontstageDataIssues() {
  const file = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");
  const text = read(file);
  if (!text) return [issue(file, "missing_data_center_v4_frontstage_data")];
  const issues = [];
  try {
    const data = JSON.parse(text);
    if (data?.meta?.productVersion !== expectedDataCenterProductVersion) {
      issues.push(issue(file, "data_center_public_version_mismatch", `${data?.meta?.productVersion || "missing"}; expected ${expectedDataCenterProductVersion}`));
    }
    const latestDate = latestContentDate();
    if (latestDate && data?.meta?.currentDate !== latestDate) {
      issues.push(issue(file, "data_center_current_date_stale", `${data?.meta?.currentDate || "missing"} != ${latestDate}`));
    }
    const currentEvents = (data?.events || []).filter((event) => event.dataDate === data?.meta?.currentDate);
    if (!currentEvents.length) issues.push(issue(file, "data_center_current_date_has_no_events", data?.meta?.currentDate || "missing"));
  } catch (error) {
    issues.push(issue(file, "data_center_v4_json_parse_failed", error.message));
  }
  return issues;
}

function collectV4EntityRelationIssues() {
  const issues = [];
  const entityFile = path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json");
  const relationshipFile = path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/relationships.json");
  try {
    const data = JSON.parse(read(entityFile));
    if (data?.meta?.entityVersion !== "ENTITY-V1.0") {
      issues.push(issue(entityFile, "entity_index_version_mismatch", data?.meta?.entityVersion || "missing"));
    }
    const entityCount = ["companies", "products", "people"].reduce(
      (sum, key) => sum + (Array.isArray(data?.[key]) ? data[key].length : 0),
      0,
    );
    if (!entityCount) issues.push(issue(entityFile, "entity_index_empty"));
  } catch (error) {
    issues.push(issue(entityFile, "entity_index_json_parse_failed", error.message));
  }
  try {
    const data = JSON.parse(read(relationshipFile));
    if (data?.meta?.relationshipVersion !== "RELATION-V2.1") {
      issues.push(issue(relationshipFile, "relationship_index_version_mismatch", data?.meta?.relationshipVersion || "missing"));
    }
    for (const relation of data?.relationships || []) {
      if (
        !relation.relationship_id?.startsWith("REL2-")
        || !relation.event_id?.startsWith("EV-")
        || !relation.claim_refs?.length
        || !relation.source_refs?.length
      ) {
        issues.push(issue(relationshipFile, "relationship_evidence_chain_invalid", relation.relationship_id || "missing"));
        break;
      }
    }
  } catch (error) {
    issues.push(issue(relationshipFile, "relationship_index_json_parse_failed", error.message));
  }
  return issues;
}

function collectVersionMetaIssues() {
  const issues = [];
  const currentPages = [
    "data-center.html",
    "v3-data-observation.html",
    "intelligence-map.html",
    "funding-insights.html",
    "opportunity-map.html",
    "weekly-ai-business-change-radar.html",
    "follow-builders.html",
    "community-intelligence.html",
    "reports.html",
    "pipeline-dashboard.html",
  ].map((file) => path.join(root, "01-SiteV2/site", file));
  for (const file of currentPages) {
    const html = read(file);
    const token = `name="wavesight-version" content="${expectedSiteVersion}"`;
    if (!html.includes(token)) issues.push(issue(file, "site_version_meta_missing", token));
  }
  const currentReportCenterPages = [
    "intelligence-map.html",
  ].map((file) => path.join(root, "01-SiteV2/site", file));
  for (const file of currentReportCenterPages) {
    const html = read(file);
    const token = `name="wavesight-column-version" content="${expectedReportsCenterColumnVersion}"`;
    if (!html.includes(token)) issues.push(issue(file, "reports_center_column_version_meta_missing", token));
  }
  const historicalReportPages = fs.readdirSync(path.join(root, "01-SiteV2/site"))
    .filter((name) => /^(?:weekly-ai-business-change-radar-\d{4}-\d{2}-\d{2}|monthly-business-structure-\d{4}-\d{2})\.html$/u.test(name))
    .map((file) => path.join(root, "01-SiteV2/site", file));
  for (const file of historicalReportPages) {
    const html = read(file);
    if (!/name="wavesight-column-version" content="REPORTS-V1\.(?:0\.0-periodic-report-center|1\.0-lane-independent)"/u.test(html)) {
      issues.push(issue(file, "reports_center_column_version_meta_missing"));
    }
  }
  const opportunityMapFile = path.join(root, "01-SiteV2/site/opportunity-map.html");
  const opportunityMapToken = `name="wavesight-column-version" content="${expectedOpportunityMapColumnVersion}"`;
  if (!read(opportunityMapFile).includes(opportunityMapToken)) issues.push(issue(opportunityMapFile, "opportunity_map_column_version_meta_missing", opportunityMapToken));
  const fundingInsightsFile = path.join(root, "01-SiteV2/site/funding-insights.html");
  const fundingInsightsToken = `name="wavesight-column-version" content="${expectedFundingInsightsColumnVersion}"`;
  if (!read(fundingInsightsFile).includes(fundingInsightsToken)) issues.push(issue(fundingInsightsFile, "funding_insights_column_version_meta_missing", fundingInsightsToken));
  return issues;
}

function writeReport(issues) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const report = path.join(reportsDir, `frontstage-regression-gate-${stamp}.md`);
  const body = [
    "# Frontstage Regression Gate",
    "",
    `- status: ${issues.length ? "failed" : "passed"}`,
    `- expected_public_site_version: ${expectedSiteVersion}`,
    `- latest_content_date: ${latestContentDate() || "unknown"}`,
    `- issue_count: ${issues.length}`,
    "",
    "## Issues",
    "",
    issues.length
      ? issues.map((item) => `- ${item.file}:${item.line} -> ${item.label} -> ${item.value}`).join("\n")
      : "- none",
    "",
  ].join("\n");
  fs.writeFileSync(report, body, "utf8");
  return report;
}

const issues = [
  ...collectRetiredPatternIssues(),
  ...collectRetiredPageIssues(),
  ...collectUnifiedNavigationIssues(),
  ...collectV4FrontstageDataIssues(),
  ...collectV4EntityRelationIssues(),
  ...collectIndustryReportsDataIssues(),
  ...collectVersionMetaIssues(),
];
const report = writeReport(issues);

console.log(JSON.stringify({
  ok: issues.length === 0,
  status: issues.length ? "failed" : "passed",
  issue_count: issues.length,
  report: rel(report),
}, null, 2));

if (issues.length) process.exit(1);
