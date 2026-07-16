#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);
const reportsDir = path.join(root, "agent-workflow", "reports");
const expectedDate = args.get("date") || "";
const expectedVersion = "V3.3.6.3-business-source-artifact-aggregation";
const expectedSiteVersion = "SITE-V3.4.5";
const expectedBusinessSignalsColumnVersion = "BSIG-V2.2.0-pipeline-stage-ownership";
const expectedEnterpriseAiLensVersion = "EAI-V1.2.0-raw-card-ingestion-boundary";
const expectedIntelligenceMapColumnVersion = "IMAP-V2.0.0-report-center-opportunity-system";
const rolloverAcceptedVersions = new Map([
  ["V3.3.6-business-title-hermes-handoff", new Set(["2026-06-16"])],
]);

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const frontstageFiles = [
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/v3-data-observation.html",
  "01-SiteV2/site/intelligence-map.html",
  "01-SiteV2/site/weekly-ai-business-change-radar.html",
  "01-SiteV2/site/follow-builders.html",
  "01-SiteV2/site/community-intelligence.html",
  "01-SiteV2/site/assets/wavesight-nav.css",
  "01-SiteV2/site/assets/weekly-report.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.js",
  "01-SiteV2/site/assets/follow-builders.css",
  "01-SiteV2/site/assets/follow-builders.js",
  "01-SiteV2/site/assets/community-intelligence.css",
  "01-SiteV2/site/assets/community-intelligence.js",
  "01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs",
  "01-SiteV2/site/scripts/build-follow-builders-page-data.mjs",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/intelligence-graph-index.json",
  "01-SiteV2/site/data/follow-builders-daily.json",
  "01-SiteV2/site/data/community-intelligence.json",
].map((file) => path.join(root, file));

const publicFrontstageTextFiles = [
  "01-SiteV2/site/index.html",
  "01-SiteV2/site/v3-data-observation.html",
  "01-SiteV2/site/intelligence-map.html",
  "01-SiteV2/site/weekly-ai-business-change-radar.html",
  "01-SiteV2/site/follow-builders.html",
  "01-SiteV2/site/community-intelligence.html",
  "01-SiteV2/site/assets/wavesight-nav.css",
  "01-SiteV2/site/assets/weekly-report.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.css",
  "01-SiteV2/site/assets/v3-data-observation-desk.js",
  "01-SiteV2/site/assets/follow-builders.css",
  "01-SiteV2/site/assets/follow-builders.js",
  "01-SiteV2/site/assets/community-intelligence.css",
  "01-SiteV2/site/assets/community-intelligence.js",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/intelligence-graph-index.json",
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
  for (const file of requiredOperationalPages) {
    if (!fs.existsSync(file)) issues.push(issue(file, "missing_required_operational_page"));
  }
  return issues;
}

function collectUnifiedNavigationIssues() {
  const issues = [];
  const legacyPageFiles = [
    path.join(root, "01-SiteV2/site/v3-data-observation.html"),
    path.join(root, "01-SiteV2/site/follow-builders.html"),
    path.join(root, "01-SiteV2/site/community-intelligence.html"),
  ];
  const legacyRequired = [
    "assets/wavesight-nav.css",
    "v3-data-observation.html",
    "intelligence-map.html",
    "follow-builders.html",
    "community-intelligence.html",
    "商业信号",
    "行业报告",
    "一线观点",
    "社群情报",
  ];
  const forbidden = [
    "operations-console.html#dashboard",
    "仪表盘",
    "Dashboard",
  ];
  for (const file of legacyPageFiles) {
    const text = read(file);
    for (const token of legacyRequired) {
      if (!text.includes(token)) issues.push(issue(file, "missing_unified_navigation_token", token));
    }
    for (const token of forbidden) {
      if (text.includes(token)) issues.push(issue(file, "public_navigation_exposes_dashboard", token));
    }
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
  return issues;
}

function latestContentDate() {
  const roots = [
    path.join(root, "01-SiteV2", "content", "01-raw"),
    path.join(root, "01-SiteV2", "content", "02-pool"),
    path.join(root, "01-SiteV2", "content", "04-business-signals", "signals"),
    path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards"),
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
    if (!isAcceptedDataVersion(data?.meta?.version, data?.meta?.activeDate)) {
      issues.push(issue(dataFile, "v3_data_version_mismatch", `${data?.meta?.version || "missing"}; expected ${expectedVersion}`));
    }
    if (data?.meta?.siteVersion !== expectedSiteVersion) {
      issues.push(issue(dataFile, "v3_data_site_version_mismatch", `${data?.meta?.siteVersion || "missing"}; expected ${expectedSiteVersion}`));
    }
    if (data?.meta?.businessSignalsColumnVersion !== expectedBusinessSignalsColumnVersion) {
      issues.push(issue(dataFile, "v3_data_business_signals_column_version_mismatch", `${data?.meta?.businessSignalsColumnVersion || "missing"}; expected ${expectedBusinessSignalsColumnVersion}`));
    }
    if (data?.meta?.enterpriseAiLensVersion !== expectedEnterpriseAiLensVersion) {
      issues.push(issue(dataFile, "v3_data_enterprise_ai_lens_version_mismatch", `${data?.meta?.enterpriseAiLensVersion || "missing"}; expected ${expectedEnterpriseAiLensVersion}`));
    }
    if (data?.meta?.intelligenceMapColumnVersion !== expectedIntelligenceMapColumnVersion) {
      issues.push(issue(dataFile, "v3_data_intelligence_map_column_version_mismatch", `${data?.meta?.intelligenceMapColumnVersion || "missing"}; expected ${expectedIntelligenceMapColumnVersion}`));
    }
    const activeDate = data?.meta?.activeDate || "";
    if (expectedDate && activeDate !== expectedDate) {
      issues.push(issue(dataFile, "v3_data_active_date_unexpected", `${activeDate || "missing"} != ${expectedDate}`));
    }
    const latestDate = latestContentDate();
    if (latestDate && activeDate !== latestDate) {
      issues.push(issue(dataFile, "v3_data_active_date_stale", `${activeDate || "missing"} != ${latestDate}`));
    }
    const activeCards = (data?.frontstageCards || data?.cards || []).filter((item) => item.date === activeDate);
    if (!activeCards.length) {
      issues.push(issue(dataFile, "v3_active_date_has_no_cards", activeDate || "missing"));
    }
    const detailItems = [
      ...(Array.isArray(data?.cards) ? data.cards : []),
      ...(Array.isArray(data?.enterpriseAiFdePool) ? data.enterpriseAiFdePool : []),
      ...(Array.isArray(data?.enterpriseAiLensCandidates) ? data.enterpriseAiLensCandidates : []),
    ];
    const detailById = new Map();
    for (const item of detailItems) {
      for (const key of [item.id, item.cardId, item.linkedCardId].filter(Boolean)) {
        if (!detailById.has(key)) detailById.set(key, item);
      }
    }
    const enterpriseItems = Array.isArray(data?.enterpriseAiTransformation) ? data.enterpriseAiTransformation : [];
    const aiHardwareItems = Array.isArray(data?.aiHardwareSignals) ? data.aiHardwareSignals : [];
    const hasHistoricalCards = (data?.cards || []).some((item) => item.date && item.date !== activeDate);
    const hasHistoricalLensItems = [...enterpriseItems, ...aiHardwareItems]
      .some((item) => item.date && item.date !== activeDate);
    if (hasHistoricalCards && data?.meta?.lensHistoryMode !== "all_available_dates") {
      issues.push(issue(dataFile, "business_lens_history_mode_missing", data?.meta?.lensHistoryMode || "missing"));
    }
    if (hasHistoricalCards && !hasHistoricalLensItems) {
      issues.push(issue(dataFile, "business_lens_history_missing", "FDE and AI Hardware arrays contain active-date items only"));
    }
    for (const item of enterpriseItems) {
      const detail = detailById.get(item.cardId);
      if (!detail) {
        issues.push(issue(dataFile, "enterprise_ai_fde_detail_missing", item.cardId || item.title || "missing"));
        continue;
      }
      const evidenceText = enterpriseItemEvidenceText(item, detail);
      if (!hasConcreteEnterpriseImplementationEvidence(evidenceText)) {
        issues.push(issue(dataFile, "enterprise_ai_fde_lens_imprecise", `${item.title || item.cardId || "untitled"} lacks concrete implementation evidence`));
      }
      const analysis = item.implementationAnalysis || {};
      if (!analysis.demand || !analysis.services || !analysis.result) {
        issues.push(issue(dataFile, "enterprise_ai_fde_analysis_missing", item.cardId || item.title || "missing"));
      }
    }
  } catch (error) {
    issues.push(issue(dataFile, "v3_data_json_parse_failed", error.message));
  }
  return issues;
}

function isAcceptedDataVersion(version, activeDate) {
  if (version === expectedVersion) return true;
  return rolloverAcceptedVersions.get(version)?.has(activeDate) || false;
}

function enterpriseItemEvidenceText(item = {}, detail = {}) {
  return [
    item.title,
    item.subject,
    item.sourceName,
    item.sourceUrl,
    item.stage,
    item.scenario,
    item.workflow,
    item.evidenceBoundary,
    item.implementationAnalysis?.demand,
    item.implementationAnalysis?.services,
    item.implementationAnalysis?.result,
    item.implementationAnalysis?.sourceBasis,
    detail.title,
    detail.displayTitle,
    detail.originalTitle,
    detail.translatedFact,
    detail.visibleFragment,
    detail.summary,
    ...(detail.originalHighlights || []),
    ...(detail.flatTags || []),
  ].filter(Boolean).join(" ");
}

function hasConcreteEnterpriseImplementationEvidence(text = "") {
  const source = String(text || "");
  if (!source) return false;

  const explicitFde = /\bFDE\b|forward deployed|customer-embedded|domain operator|regulated payer workflow/iu.test(source);
  const productionDelivery = /production (?:deployment|rollout|environment|workflow|workload)|deploys?|deployed|deployment|rollout|go[- ]?live|at scale|scale[sd]? deployment|customer adoption|case study|customer story|implemented|implementation|pilot|poc|proof of concept|procurement|technical scoping|launched (?:a |an )?(?:conversational,?\s*)?AI-powered digital experience|部署|上线|落地|规模化|采用|试点|采购|合作协议|用例|工作流/iu.test(source);
  const customerOrVertical = /customer|client|enterprise|bank|insurer|insurance|hospital|healthcare|payer|retail|store|manufactur|factory|financial|wealth management|financial crime|claims|underwriting|loan|contact center|support|sales|crm|procurement|supply chain|inventory|shelf|transaction|workflow|企业|客户|银行|金融|保险|医疗|零售|门店|制造|工厂|财富管理|金融犯罪|交易|库存|货架|客服|销售|采购|供应链|工作流/iu.test(source);
  const businessMetric = /\b\d+(?:\.\d+)?\s?(?:%|percent|x|times|use cases?|transactions?|calls?|bookings?|stores?|employees?|customers?|million|billion|hours?|days?)\b|\d+(?:\.\d+)?\s*(?:个|项|笔|次|家|名|倍|%|亿美元|万美元|万|亿)|超\d+/iu.test(source);
  const adoptionTag = /evidence-customer-adoption|evidence-customer-metric|evidence-partnership-integration/iu.test(source);

  const researchOnly = /benchmark|evaluation|evals?|research|paper|dataset|alignment|reinforcement learning|HealthBench|AA-Briefcase|MLCR|Elo|leaderboard|model capability|model capabilities|open source benchmark|基准|评测|研究|论文|数据集|强化学习|排行榜/iu.test(source);
  const consumerOnly = /iMessage|App Store|consumer app|AR character|interactive AR|game character|mobile game|social app|消费级|互动角色|移动应用/iu.test(source);
  const platformOnly = /OAuth|authorization|memory layer|knowledge base|SDK|API|protocol|specification|release notes|developer tool|framework|library|runtime|benchmark/iu.test(source)
    && !/(customer adoption|customer story|case study|deployed by|used by|implemented by|signed|partnership|procurement|pilot|poc|proof of concept|production deployment|at scale)/iu.test(source);
  const broadGovernance = /world leaders|turn it off|G7|sovereign AI|national security/iu.test(source);

  const weakPlaceholder = /原文未提供更多可拆分事实点|是否进入具体企业工作流|signal value is to observe|need to continue verifying/iu.test(source);
  if (weakPlaceholder && !explicitFde && !(productionDelivery && customerOrVertical)) return false;
  if (!explicitFde && (researchOnly || consumerOnly || platformOnly || broadGovernance)) return false;
  return explicitFde || (productionDelivery && customerOrVertical) || (adoptionTag && productionDelivery && customerOrVertical && businessMetric);
}

function collectVersionMetaIssues() {
  const issues = [];
  const businessFile = path.join(root, "01-SiteV2/site/v3-data-observation.html");
  const businessHtml = read(businessFile);
  const requiredBusinessMeta = [
    `name="wavesight-version" content="${expectedSiteVersion}"`,
    `name="wavesight-column-version" content="${expectedBusinessSignalsColumnVersion}"`,
    `name="enterprise-ai-lens-version" content="${expectedEnterpriseAiLensVersion}"`,
  ];
  for (const token of requiredBusinessMeta) {
    if (!businessHtml.includes(token)) issues.push(issue(businessFile, "business_signals_version_meta_missing", token));
  }

  const publicPages = [
    "v3-data-observation.html",
    "intelligence-map.html",
    "weekly-ai-business-change-radar.html",
    "follow-builders.html",
    "community-intelligence.html",
  ].map((file) => path.join(root, "01-SiteV2/site", file));
  for (const file of publicPages) {
    const html = read(file);
    const token = `name="wavesight-version" content="${expectedSiteVersion}"`;
    if (!html.includes(token)) issues.push(issue(file, "site_version_meta_missing", token));
  }
  const intelligenceMapPages = [
    "intelligence-map.html",
    "weekly-ai-business-change-radar.html",
    "weekly-ai-business-change-radar-2026-06-15.html",
  ].map((file) => path.join(root, "01-SiteV2/site", file));
  for (const file of intelligenceMapPages) {
    const html = read(file);
    const token = `name="wavesight-column-version" content="${expectedIntelligenceMapColumnVersion}"`;
    if (!html.includes(token)) issues.push(issue(file, "intelligence_map_column_version_meta_missing", token));
  }
  const graphIndexFile = path.join(root, "01-SiteV2/site/data/intelligence-graph-index.json");
  try {
    const graphIndex = JSON.parse(read(graphIndexFile));
    if (graphIndex?.meta?.siteVersion !== expectedSiteVersion) {
      issues.push(issue(graphIndexFile, "intelligence_graph_site_version_mismatch", `${graphIndex?.meta?.siteVersion || "missing"}; expected ${expectedSiteVersion}`));
    }
    if (graphIndex?.meta?.intelligenceMapColumnVersion !== expectedIntelligenceMapColumnVersion) {
      issues.push(issue(graphIndexFile, "intelligence_graph_column_version_mismatch", `${graphIndex?.meta?.intelligenceMapColumnVersion || "missing"}; expected ${expectedIntelligenceMapColumnVersion}`));
    }
  } catch (error) {
    issues.push(issue(graphIndexFile, "intelligence_graph_json_parse_failed", error.message));
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
    `- rollover_accepted_versions: ${[...rolloverAcceptedVersions.keys()].join(", ") || "none"}`,
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
