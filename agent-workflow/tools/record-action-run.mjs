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

const actionIndex = path.join(root, "context", "09-v3-3-current-action-index.md");
const logsDir = path.join(root, "agent-workflow", "logs", "action-runs");
const date = args.get("date") || beijingDate();
const action = clean(args.get("action") || args.get("name") || "Unspecified action");
const status = clean(args.get("status") || "unknown");
const summary = clean(args.get("summary") || "");
const trigger = clean(args.get("trigger") || "manual");
const explicitClass = clean(args.get("action-status") || args.get("classification") || "");
const issues = splitList(args.get("issues") || args.get("problems") || "");
const risks = splitList(args.get("risks") || args.get("risk") || "");
const lessons = splitList(args.get("lessons") || args.get("lesson") || "");
const reusableRules = splitList(args.get("rules") || args.get("reusable-rules") || "");
const changedFiles = splitList(args.get("changed") || args.get("changed-files") || "");
const outputs = splitList(args.get("outputs") || "");
const checks = splitList(args.get("checks") || args.get("validation") || "");
const contexts = splitList(args.get("contexts") || args.get("read") || "");
const notes = splitList(args.get("notes") || "");
const actionSets = readActionSets();
const actionStatus = explicitClass || classifyAction(action, actionSets);
const retiredFlags = detectRetiredFlags([
  action,
  summary,
  ...issues,
  ...risks,
  ...lessons,
  ...reusableRules,
  ...changedFiles,
  ...outputs,
  ...notes,
]);
const recordLevel = args.get("record-level") || inferRecordLevel({
  actionStatus,
  status,
  issues,
  risks,
  retiredFlags,
  changedFiles,
});

if (recordLevel === "skip" && args.get("force") !== "true") {
  console.log("Skipped action record because record_level=skip. Use --force=true to write it.");
  process.exit(0);
}

const record = {
  schema_version: 1,
  generated_at: new Date().toISOString(),
  date,
  action,
  action_status: actionStatus,
  record_level: recordLevel,
  trigger,
  status,
  summary,
  contexts,
  changed_files: changedFiles,
  outputs,
  checks,
  issues,
  risks,
  lessons,
  reusable_rules: reusableRules,
  retired_flags: retiredFlags,
  notes,
};

fs.mkdirSync(logsDir, { recursive: true });
const logFile = path.join(logsDir, `${date}.jsonl`);
fs.appendFileSync(logFile, `${JSON.stringify(record)}\n`, "utf8");
fs.writeFileSync(path.join(logsDir, "latest.json"), `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log(`Recorded action: ${rel(logFile)}`);

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

function clean(value = "") {
  return String(value).trim();
}

function splitList(value = "") {
  return String(value)
    .split(/[|,]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function normalize(value = "") {
  return String(value).trim().toLowerCase();
}

function readActionSets() {
  const text = read(actionIndex);
  const sets = {
    current: new Set(),
    manualArchive: new Set(),
    retired: new Set(),
  };

  for (const line of text.split(/\r?\n/u)) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*`(current|manual\/archive|retired)`\s*\|/u);
    if (!match) continue;
    const name = normalize(match[1]);
    if (match[2] === "current") sets.current.add(name);
    else if (match[2] === "manual/archive") sets.manualArchive.add(name);
    else if (match[2] === "retired") sets.retired.add(name);
  }

  return sets;
}

function classifyAction(name, sets) {
  const normalized = normalize(name);
  if (sets.current.has(normalized)) return "current";
  if (sets.manualArchive.has(normalized)) return "manual/archive";
  if (sets.retired.has(normalized)) return "retired";
  return "unregistered";
}

function inferRecordLevel({ actionStatus, status, issues, risks, retiredFlags, changedFiles }) {
  const result = normalize(status);
  if (["failed", "failure", "blocked", "partial", "warning"].includes(result)) return "required";
  if (issues.length || risks.length || retiredFlags.length) return "required";
  if (actionStatus === "current" || actionStatus === "retired" || actionStatus === "unregistered") return "required";
  if (changedFiles.some(isCriticalFile)) return "required";
  return "exception_only";
}

function isCriticalFile(file = "") {
  return /^(AGENTS\.md|context\/|\.github\/workflows\/|agent-workflow\/tools\/|01-SiteV2\/site\/scripts\/)/u.test(file.replace(/\\/g, "/"));
}

function detectRetiredFlags(values) {
  const haystack = values.join("\n").toLowerCase();
  const terms = [
    "legacy-output-lane",
    "legacy-publication-gate",
    "legacy-frontstage",
  ];
  return terms.filter((term) => haystack.includes(term));
}
