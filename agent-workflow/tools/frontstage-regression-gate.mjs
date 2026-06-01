#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const expectedVersion = "V2.2.1";
const minCacheVersion = "20260601";

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const frontstageFiles = [
  "01-SiteV2/site/assets/app.js",
  "01-SiteV2/site/assets/styles.css",
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/trend-tracking.html",
  "01-SiteV2/site/trend-detail.html",
  "01-SiteV2/site/scripts/sync-v2-site-data.mjs",
  "01-SiteV2/site/data/site-content.json",
  "01-SiteV2/site/data/site-content.js",
].map((file) => path.join(root, file));

const htmlFiles = [
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/trend-tracking.html",
  "01-SiteV2/site/trend-detail.html",
].map((file) => path.join(root, file));

const retiredPatterns = [
  { pattern: /\bV2\.[01]\b/u, label: "retired_version_marker" },
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
    for (const rule of retiredPatterns) {
      const match = rule.pattern.exec(text);
      if (match) issues.push(issue(file, rule.label, match[0], lineOf(text, match.index)));
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
  const dataFile = path.join(root, "01-SiteV2/site/data/site-content.json");
  const text = read(dataFile);
  if (!text) return [issue(dataFile, "missing_site_data")];
  try {
    const data = JSON.parse(text);
    if (data?.meta?.version !== expectedVersion) {
      issues.push(issue(dataFile, "site_data_version_mismatch", data?.meta?.version || "missing"));
    }
    const activeDate = data?.contentIndex?.activeDate || "";
    const latestDate = latestContentDate();
    if (latestDate && activeDate !== latestDate) {
      issues.push(issue(dataFile, "site_data_active_date_stale", `${activeDate || "missing"} != ${latestDate}`));
    }
    if (activeDate && data?.contentIndex?.dates?.length) {
      const active = data.contentIndex.dates.find((item) => item.date === activeDate);
      if (!active) issues.push(issue(dataFile, "active_date_missing_from_date_index", activeDate));
    }
  } catch (error) {
    issues.push(issue(dataFile, "site_data_json_parse_failed", error.message));
  }
  return issues;
}

function collectCacheIssues() {
  const issues = [];
  for (const file of htmlFiles) {
    const text = read(file);
    const scriptMatches = [...text.matchAll(/<script\s+src="(data\/site-content\.js|assets\/app\.js)\?v=([^"]+)"/gu)];
    for (const match of scriptMatches) {
      const value = match[2];
      if (value < minCacheVersion) issues.push(issue(file, "stale_frontstage_cache_buster", `${match[1]}?v=${value}`, lineOf(text, match.index)));
    }
  }
  return issues;
}

function functionBody(text, name) {
  const start = text.indexOf(`function ${name}`);
  if (start < 0) return "";
  const braceStart = text.indexOf("{", start);
  if (braceStart < 0) return "";
  let depth = 0;
  for (let index = braceStart; index < text.length; index += 1) {
    if (text[index] === "{") depth += 1;
    if (text[index] === "}") depth -= 1;
    if (depth === 0) return text.slice(start, index + 1);
  }
  return "";
}

function collectTrendRelationIssues() {
  const issues = [];
  const appFile = path.join(root, "01-SiteV2/site/assets/app.js");
  const app = read(appFile);
  const signalsBody = functionBody(app, "trendRadarSignals");
  const pointsBody = functionBody(app, "trendRadarPoints");
  const sourcesBody = functionBody(app, "trendReportSources");
  const reportDetailBody = functionBody(app, "mountTrendReportDetail");

  if (!signalsBody) issues.push(issue(appFile, "missing_trend_radar_signals"));
  if (signalsBody && /trendRadarOverlapScore|fallback|data\.contentIndex\?\.signals|data\.signals/u.test(signalsBody)) {
    issues.push(issue(appFile, "trend_signals_must_not_use_tag_or_global_fallback", "trendRadarSignals"));
  }
  if (!pointsBody) issues.push(issue(appFile, "missing_trend_radar_points"));
  if (pointsBody && /trendRadarOverlapScore|data\.contentIndex\?\.points/u.test(pointsBody)) {
    issues.push(issue(appFile, "trend_points_must_not_use_tag_or_global_fallback", "trendRadarPoints"));
  }
  if (sourcesBody && /\|\|\s*data\.(signals|contentIndex)/u.test(sourcesBody)) {
    issues.push(issue(appFile, "trend_sources_must_not_fallback_to_global_assets", "trendReportSources"));
  }
  if (reportDetailBody && /\?\s*related\.[a-z]+\.length\s*:\s*data\.contentIndex/u.test(reportDetailBody)) {
    issues.push(issue(appFile, "trend_detail_must_not_fallback_to_global_assets", "mountTrendReportDetail"));
  }

  const dataFile = path.join(root, "01-SiteV2/site/data/site-content.json");
  try {
    const data = JSON.parse(read(dataFile));
    const activeDate = data?.contentIndex?.activeDate;
    const activeTrends = (data?.contentIndex?.trends || []).filter((item) => item.date === activeDate);
    const signalIds = new Set((data?.contentIndex?.signals || []).map((item) => item.id).filter(Boolean));
    for (const trend of activeTrends) {
      const directSignals = (trend.relations || [])
        .filter((token) => token.startsWith("signal:"))
        .map((token) => token.slice("signal:".length));
      if (!directSignals.length) {
        issues.push(issue(dataFile, "active_trend_missing_direct_signal_relations", trend.id || trend.title));
      }
      const missing = directSignals.filter((id) => !signalIds.has(id));
      if (missing.length) {
        issues.push(issue(dataFile, "active_trend_relation_points_to_missing_signal", `${trend.id || trend.title}: ${missing.join(",")}`));
      }
    }
  } catch {
    // JSON parse is reported by collectGeneratedDataIssues.
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
  ...collectGeneratedDataIssues(),
  ...collectCacheIssues(),
  ...collectTrendRelationIssues(),
];
const report = writeReport(issues);

console.log(JSON.stringify({
  ok: issues.length === 0,
  status: issues.length ? "failed" : "passed",
  issue_count: issues.length,
  report: rel(report),
}, null, 2));

if (issues.length) process.exit(1);
