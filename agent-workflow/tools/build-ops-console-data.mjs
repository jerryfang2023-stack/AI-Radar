import fs from "node:fs";
import path from "node:path";
import { isProductionIncidentFilename } from "./incident-filename-utils.mjs";
import { buildPortfolio } from "./lib/ops-platforms.mjs";
import { OPS_VERSION } from "./lib/collection-telemetry-v1.mjs";
import { buildOpsSourceQuality } from "./lib/ops-source-quality.mjs";

const root = process.cwd();
const VERSION = OPS_VERSION;

const rel = (...parts) => path.join(...parts).replaceAll("\\", "/");
const abs = (...parts) => path.join(root, ...parts);

function readText(file) {
  try {
    return fs.readFileSync(abs(file), "utf8");
  } catch {
    return "";
  }
}

function readJson(file, fallback = {}) {
  const raw = readText(file);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonAndJs(fileBase, data) {
  const jsonPath = abs(`${fileBase}.json`);
  const jsPath = abs(`${fileBase}.js`);
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  fs.writeFileSync(jsPath, `window.WaveSightOpsConsole = ${JSON.stringify(data, null, 2)};\n`, "utf8");
}

function parseInboxFields(markdown) {
  const fields = {};
  for (const line of markdown.split(/\r?\n/).slice(0, 80)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) fields[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

function parseIncidentInbox() {
  const dirs = [["agent-workflow", "inbox", "production-incidents"]];
  return dirs.flatMap((parts) => {
    const dir = abs(...parts);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter(isProductionIncidentFilename)
      .sort()
      .map((name) => {
      const markdown = fs.readFileSync(path.join(dir, name), "utf8");
      const fields = parseInboxFields(markdown);
      const date = fields.date || name.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || "";
      const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() || name.replace(/\.md$/, "");
      const status = (fields.status || "open").toLowerCase();
      const isResolved = ["resolved", "manual_archive", "closed", "done"].includes(status);
      return {
        id: name.replace(/\.md$/, ""),
        date,
        title,
        status,
        state: isResolved ? "resolved" : "open",
        priority: fields.priority || "normal",
        laneId: fields.lane || "unknown",
        category: fields.category || fields.failed_gate || "uncategorized",
        failedGate: fields.failed_gate || "",
        reportPath: fields.report_path || "",
        dataGenerated: fields.data_generated || "",
        neededAction: fields.needed_action || "",
        createdAt: fields.created_at || date,
        updatedAt: fields.updated_at || "",
        resolvedAt: fields.resolved_at || "",
        resolver: fields.resolver || "",
        fixCommit: fields.fix_commit || "",
        validation: fields.validation || "",
        prevention: fields.prevention_added || "",
        sourceFile: rel(...parts, name),
      };
    });
  });
}

function statusText(status) {
  const map = {
    passed: "已通过",
    success: "已通过",
    completed: "已完成",
    manual_required: "需人工处理",
    waiting: "等待中",
    failed: "失败",
    open: "未解决",
    resolved: "已解决",
  };
  return map[status] || status || "未知";
}

function severityToPriority(severity) {
  if (["failed", "error", "urgent"].includes(severity)) return "urgent";
  if (["manual_required", "waiting"].includes(severity)) return "high";
  return "normal";
}

function currentSchedule(value) {
  return String(value || "")
    .replace(
      "08:30 local RSS collection + page build + Obsidian sync",
      "08:30 local RSS collection + page build",
    );
}

function buildSupervisionIssues(supervision) {
  const date = supervision.date || "";
  return (supervision.lanes || []).flatMap((lane) => {
    const problems = (lane.problems || []).map((problem, index) => ({
      id: `supervision-${date}-${lane.id}-problem-${index}`,
      date,
      title: problem.message || String(problem),
      status: lane.status || "open",
      state: lane.status === "passed" ? "resolved" : "open",
      priority: severityToPriority(problem.severity || lane.status),
      laneId: lane.id,
      lane: lane.label || lane.id,
      category: problem.severity || lane.status || "problem",
      source: "daily-supervision",
      reportPath: "agent-workflow/reports/daily-supervision-report-latest.json",
      neededAction: (lane.actions || [])[0] || "",
      evidence: currentSchedule(lane.schedule),
    }));
    const warnings = (lane.warnings || []).map((warning, index) => ({
      id: `supervision-${date}-${lane.id}-warning-${index}`,
      date,
      title: warning,
      status: "warning",
      state: "open",
      priority: "normal",
      laneId: lane.id,
      lane: lane.label || lane.id,
      category: "warning",
      source: "daily-supervision",
      reportPath: "agent-workflow/reports/daily-supervision-report-latest.json",
      neededAction: (lane.actions || [])[0] || "",
      evidence: currentSchedule(lane.schedule),
    }));
    return [...problems, ...warnings];
  });
}

function inRecentDays(item, days, now = new Date()) {
  const value = item.date || item.createdAt || item.updatedAt;
  if (!value) return false;
  const date = new Date(`${value.slice(0, 10)}T00:00:00+08:00`);
  if (Number.isNaN(date.getTime())) return false;
  return (now.getTime() - date.getTime()) / 86400000 <= days;
}

function aggregateIssues(items, days) {
  const now = new Date();
  const recent = items.filter((item) => inRecentDays(item, days, now));
  const byLane = {};
  const byCategory = {};
  for (const item of recent) {
    byLane[item.laneId || "unknown"] = (byLane[item.laneId || "unknown"] || 0) + 1;
    byCategory[item.category || "uncategorized"] = (byCategory[item.category || "uncategorized"] || 0) + 1;
  }
  return {
    windowDays: days,
    total: recent.length,
    open: recent.filter((item) => item.state !== "resolved").length,
    resolved: recent.filter((item) => item.state === "resolved").length,
    byLane,
    byCategory,
    recurring: Object.entries(byCategory)
      .filter(([, count]) => count > 1)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count })),
    latest: recent.slice().sort((a, b) => String(b.updatedAt || b.createdAt || b.date).localeCompare(String(a.updatedAt || a.createdAt || a.date))).slice(0, 12),
  };
}

function isRetiredV3CompatibilityIssue(item) {
  return item.state === "resolved"
    && item.laneId === "business_signals"
    && String(item.date || "") < "2026-07-29";
}

function laneToTask(lane, telemetry = {}) {
  const evidence = lane.evidence || {};
  const counts = lane.id === "business_signals"
    ? [
        ["Sources", telemetry.collection?.discovered],
        ["Claims", telemetry.fact_build?.accepted_claims],
        ["Events", telemetry.fact_build?.canonical_events],
        ["QA", telemetry.fact_build?.qa_queue],
      ].filter(([, value]) => value != null)
    : [
        ["Items", evidence.items || evidence.remarks || evidence.itemCount],
      ].filter(([, value]) => value != null);
  return {
    id: lane.id,
    label: lane.label || lane.id,
    schedule: currentSchedule(lane.schedule),
    status: lane.status || "unknown",
    statusText: statusText(lane.status),
    problemCount: (lane.problems || []).length,
    warningCount: (lane.warnings || []).length,
    actions: lane.actions || [],
    evidence: counts.map(([label, value]) => ({ label, value })),
  };
}

function parseVersionLedger() {
  const text = readText("context/version-ledger.md");
  const fields = {};
  let inCurrentVersion = false;
  for (const line of text.split(/\r?\n/)) {
    if (line.trim() === "## Current Version") {
      inCurrentVersion = true;
      continue;
    }
    if (inCurrentVersion && line.startsWith("## ")) break;
    if (!inCurrentVersion) continue;
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/);
    if (match && match[1] !== "---" && match[1] !== "Field") {
      fields[match[1].trim()] = match[2].trim();
    }
  }
  const wanted = [
    ["DATA-CENTER", "Data Center Git baseline"],
    ["SITE", "Main website version"],
    ["OPS", "Operations backend version"],
    ["BSIG", "Business Signals column version"],
    ["TAG", "Tag taxonomy version"],
    ["FLV", "First-Line Viewpoints column version"],
    ["CINT", "Community Intelligence column version"],
    ["FDE", "Enterprise AI / FDE data contract"],
    ["HARDWARE", "AI Hardware data version"],
    ["REPORTS", "Guanlan Research column version"],
    ["OMAP", "Opportunity Map column version"],
    ["TRADAR", "Trend Radar column version"],
    ["RAW", "Data Center Raw contract"],
    ["EVENT", "Canonical event contract"],
    ["ENTITY", "Entity history contract"],
    ["PERSON", "Person-account review contract"],
    ["RELATION", "Factual relationship contract"],
    ["BACKFILL", "Targeted historical collection contract"],
    ["SKILL", "Skill Store version"],
  ];
  return wanted.map(([key, field]) => ({
    key,
    label: field.replace(" column version", "").replace(" version", ""),
    value: key === "OPS" ? VERSION : fields[field] || "",
  }));
}

function buildSyncStatus(supervision, pipeline) {
  const business = (supervision.lanes || []).find((lane) => lane.id === "business_signals") || {};
  const publication = business.evidence?.publicationClosure || {};
  const localSync = publication.localSync || {};
  return [
    {
      label: "GitHub Pages",
      status: publication.pagesSuccess ? "passed" : publication.pagesActive ? "waiting" : "unknown",
      detail: publication.pagesRunUrl || "未读取到 Pages 运行链接",
    },
    {
      label: "Business Signals PR",
      status: publication.businessPrMerged ? "passed" : "waiting",
      detail: publication.businessPrUrl || "当前监督报告显示未合并或等待中",
    },
    {
      label: "本地观澜 Vault 同步准备度",
      status: localSync.clean ? "passed" : "manual_required",
      detail: localSync.clean ? "工作区干净" : `${localSync.dirtyFiles ?? 0} 个本地变更阻塞自动判断`,
    },
    {
      label: "Pipeline Dashboard",
      status: pipeline.meta?.generatedAt ? "passed" : "unknown",
      detail: pipeline.meta?.generatedAt || "未读取到生产漏斗更新时间",
    },
    {
      label: "Daily Supervision",
      status: supervision.ok ? "passed" : supervision.status || "manual_required",
      detail: supervision.generated_at || "",
    },
  ];
}

const supervisionFile = "agent-workflow/reports/daily-supervision-report-latest.json";
const pipelineFile = "01-SiteV2/site/data/pipeline-dashboard.json";
const telemetryFile = "01-SiteV2/site/data/collection-telemetry-v1.json";
const ledgerFile = "context/version-ledger.md";
const supervision = readJson(supervisionFile, { lanes: [] });
const pipeline = readJson(pipelineFile, {});
const telemetry = readJson(telemetryFile, {});
const inbox = parseIncidentInbox().filter((item) => !isRetiredV3CompatibilityIssue(item));
const supervisionIssues = buildSupervisionIssues(supervision);
const allIssues = [...supervisionIssues, ...inbox];
const openIssues = allIssues.filter((item) => item.state !== "resolved");
const resolvedIssues = allIssues.filter((item) => item.state === "resolved");
const latestDay = pipeline.latest || (pipeline.days || [])[0] || {};
const dailyDate = telemetry.meta?.data_date || supervision.date || latestDay.date || latestDay.label || "";
const dailyBundle = dailyDate
  ? `01-SiteV2/content/11-databases/data-center-v4/${dailyDate}`
  : "";
const sourceIntake = dailyDate
  ? readJson(`01-SiteV2/content/11-databases/data-center-v4/intake-v1/${dailyDate}.json`, {})
  : {};
const sourceQuality = buildOpsSourceQuality({
  rawDocuments: sourceIntake.raw_documents || [],
  claims: dailyBundle ? readJson(`${dailyBundle}/claims.json`, []) : [],
  canonicalEvents: dailyBundle ? readJson(`${dailyBundle}/canonical-events.json`, []) : [],
});

const portfolio = buildPortfolio(root, parseVersionLedger(), readJson("agent-workflow/reports/ops-platform-versions.json"));

const data = {
  portfolio,
  meta: {
    version: VERSION,
    generatedAt: new Date().toISOString(),
    date: dailyDate,
    sources: [supervisionFile, pipelineFile, telemetryFile, ledgerFile, "agent-workflow/inbox/production-incidents/*.md"],
  },
  navigation: [
    { id: "overview", label: "总览" },
    { id: "analytics", label: "运营统计" },
    { id: "quality", label: "数据质量" },
    { id: "governance", label: "版本治理" },
    { id: "skills", label: "Skill Store" },
    { id: "settings", label: "系统设置" },
  ],
  daily: {
    date: dailyDate,
    status: supervision.status || "unknown",
    statusText: statusText(supervision.status),
    issueSummary: {
      total: allIssues.length,
      daily: supervisionIssues.length,
      open: openIssues.length,
      resolved: resolvedIssues.length,
      urgent: openIssues.filter((item) => item.priority === "urgent").length,
    },
    issues: supervisionIssues,
  },
  periods: {
    weekly: aggregateIssues(allIssues, 7),
    monthly: aggregateIssues(allIssues, 30),
  },
  inbox: {
    open: openIssues.slice().sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 30),
    resolved: resolvedIssues.slice().sort((a, b) => String(b.resolvedAt || b.updatedAt || b.date).localeCompare(String(a.resolvedAt || a.updatedAt || a.date))).slice(0, 30),
  },
  tasks: {
    lanes: (supervision.lanes || []).map((lane) => laneToTask(lane, telemetry)),
    stages: Array.isArray(telemetry.stages) ? telemetry.stages : [],
    latestProduction: {
      date: latestDay.date || latestDay.label || "",
      discovered: latestDay.discovered || telemetry.collection?.discovered || 0,
      captured: latestDay.captured || telemetry.collection?.capture_succeeded || 0,
      claims: latestDay.claims || telemetry.fact_build?.accepted_claims || 0,
      events: latestDay.events || telemetry.fact_build?.canonical_events || 0,
      entities: latestDay.entities || telemetry.fact_build?.entities || 0,
      relationships: latestDay.relationships || telemetry.fact_build?.relationships || 0,
    },
    sync: buildSyncStatus(supervision, pipeline),
  },
  quality: {
    telemetry: {
      meta: telemetry.meta || {},
      collection: telemetry.collection || {},
      factBuild: telemetry.fact_build || {},
      v4Gate: telemetry.v4_gate || {},
      applicationProjection: telemetry.application_projection || {},
      publication: telemetry.publication || {},
      compatibility: telemetry.deprecated_compatibility || {},
    },
    pipelineMeta: pipeline.meta || {},
    latest: latestDay,
    totals: pipeline.totals || {},
    days: (pipeline.days || []).slice(0, 7),
    sourceQuality,
  },
  governance: {
    versions: portfolio.versions,
    principles: [
      "独立产品独立版本；源码、数据契约与线上版本分开登记",
      "公开端点核验只代表检查时刻；小程序审核与未接入部署不推断",
      "Skill 统一登记来源与摘要，原文归所属项目；登记不等于安装或认证",
      "免密页面只展示允许公开的聚合；会员、账号与管理写操作继续鉴权",
    ],
  },
};

writeJsonAndJs("01-SiteV2/site/data/ops-console", data);
console.log(`ops-console data written: ${data.meta.version} / ${data.meta.generatedAt}`);
