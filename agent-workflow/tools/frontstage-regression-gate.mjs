#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const expectedVersion = "V3.3.2.1-public-frontstage-polish";

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const frontstageFiles = [
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/v3-data-observation.html",
  "01-SiteV2/site/intelligence-map.html",
  "01-SiteV2/site/follow-builders.html",
  "01-SiteV2/site/community-intelligence.html",
  "01-SiteV2/site/assets/wavesight-nav.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.js",
  "01-SiteV2/site/assets/follow-builders.css",
  "01-SiteV2/site/assets/follow-builders.js",
  "01-SiteV2/site/assets/community-intelligence.css",
  "01-SiteV2/site/assets/community-intelligence.js",
  "01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs",
  "01-SiteV2/site/scripts/build-follow-builders-page-data.mjs",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/follow-builders-daily.json",
  "01-SiteV2/site/data/community-intelligence.json",
].map((file) => path.join(root, file));

const publicFrontstageTextFiles = [
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/v3-data-observation.html",
  "01-SiteV2/site/intelligence-map.html",
  "01-SiteV2/site/follow-builders.html",
  "01-SiteV2/site/community-intelligence.html",
  "01-SiteV2/site/assets/wavesight-nav.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.js",
  "01-SiteV2/site/assets/follow-builders.css",
  "01-SiteV2/site/assets/follow-builders.js",
  "01-SiteV2/site/assets/community-intelligence.css",
  "01-SiteV2/site/assets/community-intelligence.js",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/follow-builders-daily.json",
  "01-SiteV2/site/data/community-intelligence.json",
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

const requiredOperationalPages = [
  "01-SiteV2/site/admin.html",
  "01-SiteV2/site/operations-console.html",
  "01-SiteV2/site/pipeline-dashboard.html",
].map((file) => path.join(root, file));

const retiredPatterns = [
  { pattern: /\bV2\.[01]\b/u, label: "retired_version_marker" },
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
  for (const file of requiredOperationalPages) {
    if (!fs.existsSync(file)) issues.push(issue(file, "missing_required_operational_page"));
  }
  return issues;
}

function collectUnifiedNavigationIssues() {
  const issues = [];
  const pageFiles = [
    path.join(root, "01-SiteV2/site/v3-data-observation.html"),
    path.join(root, "01-SiteV2/site/intelligence-map.html"),
    path.join(root, "01-SiteV2/site/follow-builders.html"),
    path.join(root, "01-SiteV2/site/community-intelligence.html"),
  ];
  const required = [
    "assets/wavesight-nav.css",
    "v3-data-observation.html",
    "intelligence-map.html",
    "follow-builders.html",
    "community-intelligence.html",
    "商业信号",
    "情报地图",
    "一线观点",
    "社群情报",
  ];
  const forbidden = [
    "operations-console.html#dashboard",
    "仪表盘",
    "Dashboard",
  ];
  for (const file of pageFiles) {
    const text = read(file);
    for (const token of required) {
      if (!text.includes(token)) issues.push(issue(file, "missing_unified_navigation_token", token));
    }
    for (const token of forbidden) {
      if (text.includes(token)) issues.push(issue(file, "public_navigation_exposes_dashboard", token));
    }
  }
  return issues;
}

function latestContentDate() {
  const roots = [
    path.join(root, "01-SiteV2", "content", "01-raw"),
    path.join(root, "01-SiteV2", "content", "02-pool"),
    path.join(root, "01-SiteV2", "content", "03-daily-observation"),
    path.join(root, "01-SiteV2", "content", "04-business-signals", "signals"),
    path.join(root, "01-SiteV2", "content", "05-frontier-opinions"),
    path.join(root, "01-SiteV2", "content", "06-asset-candidates", "trend"),
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

function collectGeneratedDataIssues() {
  const issues = [];
  const dataFile = path.join(root, "01-SiteV2/site/data/v3-data-observation-desk.json");
  const text = read(dataFile);
  if (!text) return [issue(dataFile, "missing_v3_site_data")];
  try {
    const data = JSON.parse(text);
    if (data?.meta?.version !== expectedVersion) {
      issues.push(issue(dataFile, "v3_data_version_mismatch", data?.meta?.version || "missing"));
    }
    const activeDate = data?.meta?.activeDate || "";
    const latestDate = latestContentDate();
    if (latestDate && activeDate !== latestDate) {
      issues.push(issue(dataFile, "v3_data_active_date_stale", `${activeDate || "missing"} != ${latestDate}`));
    }
    const activeCards = (data?.cards || []).filter((item) => item.date === activeDate);
    if (!activeCards.length) {
      issues.push(issue(dataFile, "v3_active_date_has_no_cards", activeDate || "missing"));
    }
  } catch (error) {
    issues.push(issue(dataFile, "v3_data_json_parse_failed", error.message));
  }
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
    `- expected_version: ${expectedVersion}`,
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
  ...collectGeneratedDataIssues(),
];
const report = writeReport(issues);

console.log(JSON.stringify({
  ok: issues.length === 0,
  status: issues.length ? "failed" : "passed",
  issue_count: issues.length,
  report: rel(report),
}, null, 2));

if (issues.length) process.exit(1);
