#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");

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
  const github = collectGithubWorkflowHealth();
  const conflicts = collectConflictSignals();
  const actions = [];

  if (daily.missingReports.length) {
    actions.push(`Backfill or intentionally skip missing daily supervision reports: ${daily.missingReports.join(", ")}`);
  }
  if (Object.values(daily.recurringProblems).some((count) => count >= 2)) {
    actions.push("Convert recurring production problems into monitor skill evals, gates, or recovery rules.");
  }
  if (github.some((item) => item.failures > 0 || item.in_progress > 0)) {
    actions.push("Review GitHub Actions runs that failed, queued, or remained in progress during the weekly window.");
  }
  if (conflicts.count > 0) {
    actions.push("Review historical / conflicting wording matches and clean only the ones that contradict current V3.3 rules.");
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
    github,
    conflicts,
    actions,
  };

  const { jsonPath, mdPath } = writeReports(payload);
  console.log(JSON.stringify({ ok: true, status, report: rel(jsonPath), markdown: rel(mdPath) }, null, 2));
}

main();
