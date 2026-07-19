#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const actionLogDir = path.join(root, "agent-workflow", "logs", "action-runs");
const hermesInboxDir = path.join(root, "agent-workflow", "inbox", "hermes-to-codex");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const endDate = args.get("date") || shanghaiDate();
const days = Number(args.get("days") || 7);
const windowDays = Number.isFinite(days) && days > 0 ? Math.floor(days) : 7;
const dates = Array.from({ length: windowDays }, (_, index) => addDays(endDate, index - windowDays + 1));

function shanghaiDate(value = new Date()) {
  const dateValue = value instanceof Date ? value : new Date(`${value}T00:00:00+08:00`);
  if (Number.isNaN(dateValue.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateValue);
}

function addDays(dateText, offset) {
  const value = new Date(`${dateText}T00:00:00+08:00`);
  value.setUTCDate(value.getUTCDate() + offset);
  return shanghaiDate(value);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function readText(file, fallback = "") {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return fallback;
  }
}

function runOptional(command, argsList, timeoutMs = 10000) {
  const result = spawnSync(command, argsList, {
    cwd: root,
    encoding: "utf8",
    timeout: timeoutMs,
    windowsHide: true,
  });
  return {
    ok: !result.error && result.status === 0,
    stdout: result.stdout || "",
    stderr: result.stderr || result.error?.message || "",
  };
}

function parseGhJson(result, fallback) {
  if (!result.ok) return fallback;
  try {
    return JSON.parse(result.stdout);
  } catch {
    return fallback;
  }
}

function increment(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function normalizeMessage(message) {
  return String(message)
    .replace(/\d{4}-\d{2}-\d{2}/gu, "<date>")
    .replace(/\d+/gu, "<n>")
    .replace(/\s+/gu, " ")
    .trim();
}

function normalizeCategory(value) {
  return String(value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, "_")
    .replace(/^_+|_+$/gu, "") || "unknown";
}

function inWindow(dateText) {
  return dates.includes(dateText);
}

function parseKeyValueHeader(text = "") {
  const fields = {};
  for (const line of text.split(/\r?\n/u)) {
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/u);
    if (!match) {
      if (line.trim().startsWith("#")) break;
      continue;
    }
    fields[match[1]] = match[2].trim();
  }
  return fields;
}

function incidentCategories(text = "", fields = {}) {
  const incidentText = String(text).split(/^## Resolution\s*$/imu)[0] || text;
  const haystack = [
    incidentText,
    fields.failed_gate,
    fields.report_path,
    fields.needed_action,
  ].filter(Boolean).join("\n").toLowerCase();
  const categories = new Set();

  if (/top\s*10|top10|frontstage\s*selected|selectedcount|selected count/iu.test(haystack)
    && /empty|missing|0 items|no `?top10|not exactly 10|为空|缺失/iu.test(haystack)) {
    categories.add("business_signals_top10_missing");
  }
  if (/source[_ -]?first|source_first_frontstage_gate|frontstage gate/iu.test(haystack)) {
    categories.add("source_first_frontstage_gate");
  }
  if (/title|标题|mojibake|乱码|untranslated|未翻译|translation/iu.test(haystack)) {
    categories.add("raw_card_ingestion_title_fact");
  }
  if (/detail|详情|frontstage details|visible fragment|source-backed|内容不对|wrong content/iu.test(haystack)) {
    categories.add("frontstage_detail_content");
  }
  if (/monitor|监测|quality gate|raw_count_min|pool_count_min|gate failure|failed_gate/iu.test(haystack)) {
    categories.add("monitor_or_gate_failure");
  }
  if (/obsidian|timeline/iu.test(haystack) && /fail|missing|stale|blocked|sync/iu.test(haystack)) {
    categories.add("obsidian_sync");
  }

  if (!categories.size && fields.failed_gate) categories.add(normalizeCategory(fields.failed_gate));
  return [...categories];
}

function collectDailyReports() {
  const laneTotals = new Map();
  const recurringProblems = new Map();
  const recurringWarnings = new Map();
  const reportRows = [];
  const missingReports = [];

  for (const date of dates) {
    const file = path.join(reportsDir, `${date}-daily-supervision-report.json`);
    const report = readJson(file);
    if (!report) {
      missingReports.push(date);
      reportRows.push({ date, status: "missing", lanes: [] });
      continue;
    }

    reportRows.push({
      date,
      status: report.status || "unknown",
      lanes: Array.isArray(report.lanes) ? report.lanes : [],
    });

    for (const lane of reportRows.at(-1).lanes) {
      const key = `${lane.id || lane.label}:${lane.status || "unknown"}`;
      increment(laneTotals, key);
      for (const problem of lane.problems || []) {
        increment(recurringProblems, `${lane.id || lane.label}: ${normalizeMessage(problem.message || problem)}`);
      }
      for (const warning of lane.warnings || []) {
        increment(recurringWarnings, `${lane.id || lane.label}: ${normalizeMessage(warning.message || warning)}`);
      }
    }
  }

  return { laneTotals, recurringProblems, recurringWarnings, reportRows, missingReports };
}

function collectHermesIncidents() {
  const incidents = [];
  const categoryCounts = new Map();
  const laneCounts = new Map();
  const unresolved = [];

  if (!fs.existsSync(hermesInboxDir)) {
    return { incidents, categoryCounts, laneCounts, unresolved };
  }

  for (const entry of fs.readdirSync(hermesInboxDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    if (/^(README|TEMPLATE)\.md$/iu.test(entry.name)) continue;

    const file = path.join(hermesInboxDir, entry.name);
    const text = readText(file);
    const fields = parseKeyValueHeader(text);
    const date = entry.name.match(/^(\d{4}-\d{2}-\d{2})/u)?.[1]
      || fields.created_at?.slice(0, 10)
      || "";
    if (!inWindow(date)) continue;

    const categories = incidentCategories(text, fields);
    const incident = {
      date,
      file: rel(file),
      status: fields.status || "unknown",
      priority: fields.priority || "",
      lane: fields.lane || "unknown",
      failed_gate: fields.failed_gate || "",
      report_path: fields.report_path || "",
      data_generated: fields.data_generated || "",
      needed_action: fields.needed_action || "",
      categories,
      resolved: /^resolved$/iu.test(fields.status || ""),
    };

    incidents.push(incident);
    increment(laneCounts, incident.lane);
    for (const category of categories) increment(categoryCounts, `${incident.lane}: ${category}`);
    if (!incident.resolved) unresolved.push(incident);
  }

  return { incidents, categoryCounts, laneCounts, unresolved };
}

function collectActionLogs() {
  const records = [];
  const issueCounts = new Map();
  const riskCounts = new Map();
  const unregistered = [];
  const failed = [];

  for (const date of dates) {
    const file = path.join(actionLogDir, `${date}.jsonl`);
    const text = readText(file);
    if (!text) continue;

    for (const line of text.split(/\r?\n/u).map((item) => item.trim()).filter(Boolean)) {
      let record;
      try {
        record = JSON.parse(line);
      } catch {
        record = {
          date,
          action: "invalid action log line",
          status: "failed",
          action_status: "unregistered",
          issues: ["invalid JSONL record"],
        };
      }
      records.push(record);

      const action = record.action || "unknown action";
      if (/failed|failure|blocked|partial|warning/iu.test(record.status || "")) failed.push(record);
      if (record.action_status === "unregistered") unregistered.push(record);
      for (const issue of record.issues || []) {
        increment(issueCounts, `${action}: ${normalizeMessage(issue)}`);
      }
      for (const risk of record.risks || []) {
        increment(riskCounts, `${action}: ${normalizeMessage(risk)}`);
      }
    }
  }

  return { records, issueCounts, riskCounts, failed, unregistered };
}

function buildLoopEscalations({ daily, hermes, actionLogs }) {
  const escalations = [];
  const repeatedDailyProblems = Object.entries(daily.recurringProblems || {}).filter(([, count]) => count >= 2);
  const repeatedDailyWarnings = Object.entries(daily.recurringWarnings || {}).filter(([, count]) => count >= 2);
  const repeatedHermesCategories = [...hermes.categoryCounts.entries()].filter(([, count]) => count >= 2);
  const repeatedActionIssues = [...actionLogs.issueCounts.entries()].filter(([, count]) => count >= 2);
  const repeatedActionRisks = [...actionLogs.riskCounts.entries()].filter(([, count]) => count >= 2);

  for (const [key, count] of repeatedDailyProblems) {
    escalations.push(`Daily supervision recurring problem (${count}x): ${key}. Add or tighten the owning lane gate/eval.`);
  }
  for (const [key, count] of repeatedDailyWarnings) {
    escalations.push(`Daily supervision recurring warning (${count}x): ${key}. Decide whether it should stay warning or become a gate.`);
  }
  for (const [key, count] of repeatedHermesCategories) {
    escalations.push(`Hermes incident category repeated (${count}x): ${key}. Add a regression eval and durable MEMORY entry if not already present.`);
  }
  for (const [key, count] of repeatedActionIssues) {
    escalations.push(`Action log issue repeated (${count}x): ${key}. Convert it into a reusable rule or validation check.`);
  }
  for (const [key, count] of repeatedActionRisks) {
    escalations.push(`Action log risk repeated (${count}x): ${key}. Add a guardrail before the next production run.`);
  }
  for (const incident of hermes.unresolved) {
    escalations.push(`Unresolved Hermes incident: ${incident.file}. Repair and rerun the failed gate before closing.`);
  }
  if (hermes.incidents.length && !actionLogs.records.some((record) => /repair|incident|failure|business-signal|business signal|source-first|top10/iu.test([record.action, record.summary].filter(Boolean).join(" ")))) {
    escalations.push("Hermes incidents exist but action logs do not capture the repair loop. Record repair actions with `npm run record:action`.");
  }

  return escalations;
}

function collectGithubWorkflowHealth() {
  const workflows = [
    "daily-persistent-assets-pr.yml",
    "daily-first-line-viewpoints-pr.yml",
    "github-pages.yml",
  ];
  return workflows.map((workflow) => {
    const result = runOptional("gh", [
      "run",
      "list",
      "--workflow",
      workflow,
      "--limit",
      "20",
      "--json",
      "databaseId,status,conclusion,createdAt,url",
    ], 15000);
    const runs = parseGhJson(result, []);
    const recent = runs.filter((run) => dates.includes(shanghaiDate(run.createdAt)));
    return {
      workflow,
      available: result.ok,
      error: result.ok ? "" : result.stderr.trim(),
      runs: recent.length,
      failures: recent.filter((run) => run.conclusion && run.conclusion !== "success").length,
      in_progress: recent.filter((run) => ["queued", "in_progress"].includes(run.status)).length,
      latest: recent[0] || null,
    };
  });
}

function collectConflictSignals() {
  const result = runOptional("rg", [
    "-n",
    "-i",
    "netlify|daily observation|business brief|trend report|05-frontier-opinions|V2 four-column",
    "context",
    ".github",
    "package.json",
    "AGENTS.md",
  ], 10000);

  const matches = result.stdout
    .split(/\r?\n/u)
    .filter(Boolean)
    .filter((line) => !/Must Not Return|Not Done|retired|Netlify is retired|must not be used/iu.test(line))
    .slice(0, 40);

  return {
    available: result.ok || Boolean(result.stdout),
    count: matches.length,
    matches,
  };
}

function markdownMap(map, minCount = 1) {
  const entries = map instanceof Map ? [...map.entries()] : Object.entries(map || {});
  const rows = entries
    .filter(([, count]) => count >= minCount)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  if (!rows.length) return "- none";
  return rows.map(([key, count]) => `- ${key}: ${count}`).join("\n");
}

function markdownList(items) {
  if (!items.length) return "- none";
  return items.map((item) => `- ${item}`).join("\n");
}

function incidentTable(items) {
  if (!items.length) return "- none";
  return [
    "| Date | Lane | Status | Failed Gate | Categories | File |",
    "|---|---|---|---|---|---|",
    ...items.map((item) => `| ${item.date} | ${item.lane} | ${item.status} | ${item.failed_gate || "n/a"} | ${item.categories.join("<br>") || "n/a"} | \`${item.file}\` |`),
  ].join("\n");
}

function actionLogTable(items) {
  if (!items.length) return "- none";
  return [
    "| Date | Action | Status | Summary |",
    "|---|---|---|---|",
    ...items.map((item) => `| ${item.date || ""} | ${item.action || "unknown"} | ${item.status || "unknown"} | ${String(item.summary || "").replace(/\|/gu, "\\|")} |`),
  ].join("\n");
}

function writeReports(payload) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${endDate}-weekly-health.json`);
  const mdPath = path.join(reportsDir, `${endDate}-weekly-health.md`);
  const latestJsonPath = path.join(reportsDir, "weekly-health-latest.json");
  const latestMdPath = path.join(reportsDir, "weekly-health-latest.md");

  const dailyRows = payload.daily.reportRows.map((row) => (
    `| ${row.date} | ${row.status} | ${row.lanes.map((lane) => `${lane.id}:${lane.status}`).join("<br>") || "none"} |`
  ));
  const workflowRows = payload.github.map((item) => (
    `| ${item.workflow} | ${item.available ? "yes" : "no"} | ${item.runs} | ${item.failures} | ${item.in_progress} |`
  ));

  const md = [
    `# WaveSight Weekly Health - ${payload.window.start} to ${payload.window.end}`,
    "",
    `- generated_at: ${payload.generated_at}`,
    `- status: ${payload.status}`,
    `- days: ${payload.window.days}`,
    "",
    "## Daily Supervision Coverage",
    "",
    "| Date | Status | Lane statuses |",
    "|---|---|---|",
    ...dailyRows,
    "",
    "## Lane Status Totals",
    "",
    markdownMap(payload.daily.laneTotals),
    "",
    "## Recurring Problems",
    "",
    markdownMap(payload.daily.recurringProblems, 2),
    "",
    "## Recurring Warnings",
    "",
    markdownMap(payload.daily.recurringWarnings, 2),
    "",
    "## Hermes Incident Loop",
    "",
    `- incidents_in_window: ${payload.hermes.incidents.length}`,
    `- unresolved_incidents: ${payload.hermes.unresolved.length}`,
    "",
    incidentTable(payload.hermes.incidents),
    "",
    "## Repeated Incident Categories",
    "",
    markdownMap(payload.hermes.categoryCounts, 2),
    "",
    "## Action Log Loop",
    "",
    `- action_records_in_window: ${payload.actionLogs.records.length}`,
    `- failed_or_partial_records: ${payload.actionLogs.failed.length}`,
    `- unregistered_records: ${payload.actionLogs.unregistered.length}`,
    "",
    actionLogTable(payload.actionLogs.failed),
    "",
    "## Repeated Action Log Issues",
    "",
    markdownMap(payload.actionLogs.issueCounts, 2),
    "",
    "## Learning Loop Escalations",
    "",
    markdownList(payload.loopEscalations),
    "",
    "## GitHub Workflow Health",
    "",
    "| Workflow | Available | Runs | Failures | In progress |",
    "|---|---:|---:|---:|---:|",
    ...workflowRows,
    "",
    "## Historical / Conflict Signals To Review",
    "",
    `- suspicious_match_count: ${payload.conflicts.count}`,
    "",
    markdownList(payload.conflicts.matches),
    "",
    "## Recommended Actions",
    "",
    markdownList(payload.actions),
    "",
  ].join("\n");

  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  fs.writeFileSync(latestJsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(latestMdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function main() {
  const dailyMaps = collectDailyReports();
  const daily = {
    ...dailyMaps,
    laneTotals: Object.fromEntries(dailyMaps.laneTotals),
    recurringProblems: Object.fromEntries(dailyMaps.recurringProblems),
    recurringWarnings: Object.fromEntries(dailyMaps.recurringWarnings),
  };
  const hermesMaps = collectHermesIncidents();
  const hermes = {
    ...hermesMaps,
    categoryCounts: Object.fromEntries(hermesMaps.categoryCounts),
    laneCounts: Object.fromEntries(hermesMaps.laneCounts),
  };
  const actionLogMaps = collectActionLogs();
  const actionLogs = {
    ...actionLogMaps,
    issueCounts: Object.fromEntries(actionLogMaps.issueCounts),
    riskCounts: Object.fromEntries(actionLogMaps.riskCounts),
  };
  const github = collectGithubWorkflowHealth();
  const conflicts = collectConflictSignals();
  const loopEscalations = buildLoopEscalations({ daily, hermes: hermesMaps, actionLogs: actionLogMaps });
  const actions = [];

  if (daily.missingReports.length) {
    actions.push(`Backfill or intentionally skip missing daily supervision reports: ${daily.missingReports.join(", ")}`);
  }
  if (Object.values(daily.recurringProblems).some((count) => count >= 2)) {
    actions.push("Convert recurring production problems into monitor skill evals, gates, or recovery rules.");
  }
  if (loopEscalations.length) {
    actions.push("Review Learning Loop Escalations and convert repeated incidents into gate / eval / MEMORY changes.");
  }
  if (github.some((item) => item.failures > 0 || item.in_progress > 0)) {
    actions.push("Review GitHub Actions runs that failed, queued, or remained in progress during the weekly window.");
  }
  if (conflicts.count > 0) {
    actions.push("Review historical / conflicting wording matches and clean only the ones that contradict current V4 rules or the documented V3 compatibility boundary.");
  }
  if (!actions.length) actions.push("No weekly maintenance action required.");

  const status = actions.length === 1 && actions[0].startsWith("No ") ? "passed" : "review";
  const payload = {
    ok: true,
    status,
    generated_at: new Date().toISOString(),
    window: {
      start: dates[0],
      end: endDate,
      days: windowDays,
    },
    daily,
    hermes,
    actionLogs,
    loopEscalations,
    github,
    conflicts,
    actions,
  };

  const { jsonPath, mdPath } = writeReports(payload);
  console.log(JSON.stringify({ ok: true, status, report: rel(jsonPath), markdown: rel(mdPath) }, null, 2));
}

main();
