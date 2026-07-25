#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

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

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function normalizeMessage(message = "") {
  return String(message)
    .replace(/\d{4}-\d{2}-\d{2}/gu, "<date>")
    .replace(/\b\d+\b/gu, "<n>")
    .replace(/\s+/gu, " ")
    .trim();
}

function slug(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 48) || "recurring-issue";
}

export function collectRecurringIssues(root, endDate, days = 7, threshold = 2) {
  const reportsDir = path.join(root, "agent-workflow", "reports");
  const dates = Array.from({ length: days }, (_, index) => addDays(endDate, index - days + 1));
  const occurrences = new Map();

  for (const date of dates) {
    const report = readJson(path.join(reportsDir, `${date}-daily-supervision-report.json`));
    for (const lane of report?.lanes || []) {
      for (const [kind, values] of [["problem", lane.problems || []], ["warning", lane.warnings || []]]) {
        for (const value of values) {
          const message = normalizeMessage(value.message || value);
          if (!message) continue;
          const key = `${lane.id || lane.label}|${kind}|${message}`;
          const item = occurrences.get(key) || {
            lane: lane.id || lane.label || "unknown",
            kind,
            message,
            dates: [],
            report_paths: [],
          };
          item.dates.push(date);
          item.report_paths.push(`agent-workflow/reports/${date}-daily-supervision-report.json`);
          occurrences.set(key, item);
        }
      }
    }
  }

  return [...occurrences.entries()]
    .filter(([, item]) => item.dates.length >= threshold)
    .map(([key, item]) => ({
      ...item,
      count: item.dates.length,
      fingerprint: crypto.createHash("sha256").update(key).digest("hex").slice(0, 16),
    }));
}

export function writeRecurringIncidents(root, endDate, issues) {
  const inboxDir = path.join(root, "agent-workflow", "inbox", "production-incidents");
  fs.mkdirSync(inboxDir, { recursive: true });
  const existingOpen = new Map();
  for (const entry of fs.readdirSync(inboxDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".md")) continue;
    const file = path.join(inboxDir, entry.name);
    const text = fs.readFileSync(file, "utf8");
    if (!/^status:\s*open\s*$/imu.test(text)) continue;
    const fingerprint = text.match(/^fingerprint:\s*(.+)$/imu)?.[1]?.trim();
    if (fingerprint) existingOpen.set(fingerprint, file);
  }

  const created = [];
  const existing = [];
  for (const issue of issues) {
    if (existingOpen.has(issue.fingerprint)) {
      existing.push(path.relative(root, existingOpen.get(issue.fingerprint)).replace(/\\/gu, "/"));
      continue;
    }
    const file = path.join(
      inboxDir,
      `${endDate}-${slug(issue.lane)}-recurring-${issue.fingerprint}.md`,
    );
    const body = [
      "status: open",
      "priority: normal",
      `created_at: ${new Date().toISOString()}`,
      `lane: ${issue.lane}`,
      "category: recurring_automation_issue",
      `fingerprint: ${issue.fingerprint}`,
      `occurrences: ${issue.count}`,
      `occurrence_dates: ${issue.dates.join(", ")}`,
      `report_path: ${issue.report_paths.at(-1)}`,
      "failed_gate: repeated daily supervision signal",
      "data_generated: inspect linked daily reports",
      "needed_action: repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
      "validation_required: rerun the owning lane and daily final closure",
      "prevention_required: gate|eval|memory|context",
      "",
      `# Recurring ${issue.kind}: ${issue.lane}`,
      "",
      `- normalized_signal: ${issue.message}`,
      `- occurrences: ${issue.count}`,
      `- dates: ${issue.dates.join(", ")}`,
      "",
      "## Required closeout",
      "",
      "- Record the causal fix commit.",
      "- Record the validation command and result.",
      "- Record the prevention artifact before resolving the incident.",
      "",
    ].join("\n");
    fs.writeFileSync(file, body, "utf8");
    created.push(path.relative(root, file).replace(/\\/gu, "/"));
  }
  return { created, existing };
}

function main() {
  const root = process.cwd();
  const date = args.get("date") || shanghaiDate();
  const days = Math.max(2, Number(args.get("days") || 7));
  const threshold = Math.max(2, Number(args.get("threshold") || 2));
  const issues = collectRecurringIssues(root, date, days, threshold);
  const files = writeRecurringIncidents(root, date, issues);
  console.log(JSON.stringify({
    ok: true,
    date,
    window_days: days,
    threshold,
    recurring_issues: issues.length,
    created: files.created,
    existing: files.existing,
  }, null, 2));
}

const isDirectRun = process.argv[1]
  && path.resolve(process.argv[1]).toLowerCase() === path.resolve(fileURLToPath(import.meta.url)).toLowerCase();
if (isDirectRun) main();
