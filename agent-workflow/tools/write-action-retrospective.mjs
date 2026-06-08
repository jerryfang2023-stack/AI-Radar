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

const date = args.get("date") || beijingDate();
const logsDir = path.join(root, "agent-workflow", "logs", "action-runs");
const reportsDir = path.join(root, "agent-workflow", "reports");
const logFile = path.join(logsDir, `${date}.jsonl`);
const reportFile = path.join(reportsDir, `${date}-action-retrospective.md`);
const records = readRecords(logFile).filter((record) => record.record_level !== "skip");
const generatedAt = new Date().toISOString();
const failed = records.filter((record) => /failed|failure|blocked|partial|warning/iu.test(record.status || ""));
const retired = records.filter((record) => record.action_status === "retired" || list(record.retired_flags).length);
const unregistered = records.filter((record) => record.action_status === "unregistered");
const risks = records.flatMap((record) => list(record.risks).map((risk) => [record, risk]));
const issues = records.flatMap((record) => list(record.issues).map((issue) => [record, issue]));
const lessons = unique(records.flatMap((record) => list(record.lessons)));
const reusableRules = unique(records.flatMap((record) => list(record.reusable_rules)));
const status = statusFor({ records, failed, retired, unregistered, issues, risks });

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(reportFile, renderReport(), "utf8");

console.log(`Wrote ${rel(reportFile)}`);
if (status === "needs_review") process.exitCode = 1;

function renderReport() {
  return [
    `# ${date} Action Retrospective`,
    "",
    `- generated_at: ${generatedAt}`,
    `- status: ${status}`,
    `- action_records: ${records.length}`,
    `- failed_or_partial: ${failed.length}`,
    `- retired_flags: ${retired.length}`,
    `- unregistered_actions: ${unregistered.length}`,
    "",
    "## Current Actions Run",
    "",
    actionTable(records.filter((record) => record.action_status === "current")),
    "",
    "## Mistakes / Problems",
    "",
    issueList(issues, failed),
    "",
    "## Insufficiencies / Risks",
    "",
    pairList(risks),
    "",
    "## What Went Right",
    "",
    whatWentRight(records),
    "",
    "## Reusable Experience",
    "",
    markdownList(lessons),
    "",
    "## Rules To Consider",
    "",
    markdownList(reusableRules),
    "",
    "## Action Status Warnings",
    "",
    warningsList({ retired, unregistered }),
    "",
    "## Next Suggestions",
    "",
    suggestionsList({ records, failed, retired, unregistered, issues, risks, lessons, reusableRules }),
    "",
  ].join("\n");
}

function beijingDate() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function readRecords(file) {
  if (!fs.existsSync(file)) return [];
  return fs.readFileSync(file, "utf8")
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return {
          action: "invalid action log line",
          action_status: "unregistered",
          record_level: "required",
          status: "failed",
          issues: ["invalid JSONL record"],
          raw_line: line,
        };
      }
    });
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function list(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function unique(items) {
  return [...new Set(items.map((item) => String(item).trim()).filter(Boolean))];
}

function statusFor({ records, failed, retired, unregistered, issues, risks }) {
  if (!records.length) return "no_records";
  if (failed.length || retired.length || unregistered.length) return "needs_review";
  if (issues.length || risks.length) return "completed_with_notes";
  return "completed";
}

function actionTable(rows) {
  if (!rows.length) return "- none";
  return [
    "| Action | Status | Summary | Checks | Outputs |",
    "|---|---|---|---|---|",
    ...rows.map((record) => [
      record.action || "unknown",
      record.status || "unknown",
      oneLine(record.summary || ""),
      list(record.checks).join("<br>") || "none",
      list(record.outputs).join("<br>") || "none",
    ].map(escapeTable).join(" | ")).map((line) => `| ${line} |`),
  ].join("\n");
}

function issueList(issues, failed) {
  const rows = [
    ...issues.map(([record, issue]) => `- ${record.action}: ${issue}`),
    ...failed.filter((record) => !list(record.issues).length).map((record) => `- ${record.action}: status=${record.status}`),
  ];
  return rows.length ? rows.join("\n") : "- none recorded";
}

function pairList(pairs) {
  return pairs.length ? pairs.map(([record, value]) => `- ${record.action}: ${value}`).join("\n") : "- none recorded";
}

function whatWentRight(records) {
  const rows = records
    .filter((record) => /success|passed|completed/iu.test(record.status || ""))
    .map((record) => {
      const checks = list(record.checks).length ? ` Checks: ${list(record.checks).join(", ")}.` : "";
      const outputs = list(record.outputs).length ? ` Outputs: ${list(record.outputs).join(", ")}.` : "";
      return `- ${record.action}: ${record.summary || "completed successfully."}${checks}${outputs}`;
    });
  return rows.length ? rows.join("\n") : "- none recorded";
}

function markdownList(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- none recorded";
}

function warningsList({ retired, unregistered }) {
  const rows = [];
  for (const record of retired) {
    const flags = list(record.retired_flags).join(", ") || "retired action";
    rows.push(`- ${record.action}: retired flag detected (${flags}).`);
  }
  for (const record of unregistered) {
    rows.push(`- ${record.action}: action is not registered in current action index.`);
  }
  return rows.length ? rows.join("\n") : "- none";
}

function suggestionsList({ records, failed, retired, unregistered, issues, risks, lessons, reusableRules }) {
  if (!records.length) return "- Add action records before running the retrospective.";
  const rows = [];
  if (failed.length) rows.push("- Fix failed or partial actions before running downstream production.");
  if (retired.length) rows.push("- Remove or reroute any retired-action dependency before it contaminates current production.");
  if (unregistered.length) rows.push("- Classify unregistered actions as current, manual/archive, or retired before repeating them.");
  if (issues.length || risks.length) rows.push("- Convert repeated issues or risks into explicit gates or context rules.");
  if (!lessons.length && !reusableRules.length) rows.push("- Add human/Codex review notes so successful work turns into reusable experience.");
  return rows.length ? rows.join("\n") : "- No immediate follow-up suggested.";
}

function oneLine(value) {
  return String(value).replace(/\s+/gu, " ").trim();
}

function escapeTable(value) {
  return String(value || "none").replace(/\|/gu, "\\|").replace(/\r?\n/gu, "<br>");
}
