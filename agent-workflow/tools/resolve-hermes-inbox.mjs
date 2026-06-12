#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const inboxDir = path.join(root, "agent-workflow", "inbox", "hermes-to-codex");

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const orderedFields = [
  "status",
  "priority",
  "lane",
  "category",
  "failed_gate",
  "report_path",
  "data_generated",
  "needed_action",
  "created_at",
  "updated_at",
  "resolved_at",
  "resolver",
  "fix_commit",
  "validation",
  "prevention_added",
  "source",
];

const priorityRank = new Map([
  ["urgent", 0],
  ["high", 1],
  ["normal", 2],
  ["low", 3],
]);

function fail(message) {
  console.error(JSON.stringify({ ok: false, error: message }, null, 2));
  process.exit(2);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function isInside(parent, file) {
  const relative = path.relative(parent, file);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function parseFields(text) {
  const fields = {};
  for (const line of text.split(/\r?\n/u)) {
    if (!line.trim()) break;
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/u);
    if (!match) break;
    fields[match[1]] = match[2].trim();
  }
  return fields;
}

function splitHeader(text) {
  const lines = text.split(/\r?\n/u);
  const fields = {};
  let index = 0;

  for (; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) {
      index += 1;
      break;
    }
    const match = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/u);
    if (!match) break;
    fields[match[1]] = match[2].trim();
  }

  return {
    fields,
    body: lines.slice(index).join("\n").trimEnd(),
  };
}

function serializeFields(fields) {
  const used = new Set();
  const lines = [];

  for (const key of orderedFields) {
    if (Object.prototype.hasOwnProperty.call(fields, key)) {
      lines.push(`${key}: ${fields[key]}`);
      used.add(key);
    }
  }

  for (const [key, value] of Object.entries(fields)) {
    if (!used.has(key)) lines.push(`${key}: ${value}`);
  }

  return lines.join("\n");
}

function shanghaiTimestamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date).reduce((acc, part) => {
    acc[part.type] = part.value;
    return acc;
  }, {});

  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`;
}

function dateValue(value, fallback) {
  const parsed = Date.parse(value || fallback || "");
  return Number.isNaN(parsed) ? 0 : parsed;
}

function priorityValue(fields) {
  const priority = (fields.priority || "normal").toLowerCase();
  return priorityRank.has(priority) ? priorityRank.get(priority) : priorityRank.get("normal");
}

function openCandidates() {
  if (!fs.existsSync(inboxDir)) return [];

  return fs.readdirSync(inboxDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md" && entry.name !== "TEMPLATE.md")
    .map((entry) => {
      const file = path.join(inboxDir, entry.name);
      const text = readText(file);
      const fields = parseFields(text);
      const stat = fs.statSync(file);
      return {
        file,
        fields,
        modified_at: stat.mtime.toISOString(),
      };
    })
    .filter((candidate) => (candidate.fields.status || "open") === "open")
    .sort((a, b) => {
      const priorityDelta = priorityValue(a.fields) - priorityValue(b.fields);
      if (priorityDelta !== 0) return priorityDelta;
      const aUpdated = dateValue(a.fields.updated_at || a.fields.created_at, a.modified_at);
      const bUpdated = dateValue(b.fields.updated_at || b.fields.created_at, b.modified_at);
      return bUpdated - aUpdated;
    });
}

function resolveFile() {
  if (args.get("latest") === "true") {
    const [latest] = openCandidates();
    if (!latest) fail("No open Hermes inbox item found.");
    return latest.file;
  }

  const fileArg = args.get("file") || args.get("name");
  if (!fileArg) fail("Pass --file=<inbox-file> or --latest=true.");

  const file = path.isAbsolute(fileArg)
    ? path.resolve(fileArg)
    : path.resolve(root, fileArg.includes("/") || fileArg.includes("\\") ? fileArg : path.join("agent-workflow", "inbox", "hermes-to-codex", fileArg));

  if (!isInside(inboxDir, file)) fail(`Inbox file must be inside ${rel(inboxDir)}.`);
  if (!fs.existsSync(file)) fail(`Inbox file not found: ${rel(file)}`);
  return file;
}

function requiredArg(name) {
  const value = args.get(name);
  if (!value || value === "true") fail(`Missing required --${name}=...`);
  return value;
}

const file = resolveFile();
const fixCommit = requiredArg("fix-commit");
const validation = requiredArg("validation");
const prevention = requiredArg("prevention");
const status = args.get("status") || "resolved";
const dryRun = args.get("dry-run") === "true";
const force = args.get("force") === "true";
const notes = args.get("notes") || "";

if (!["resolved", "manual_archive"].includes(status)) {
  fail("--status must be resolved or manual_archive.");
}

const original = readText(file);
const { fields, body } = splitHeader(original);

if ((fields.status || "open") !== "open" && !force) {
  fail(`Inbox item is already ${fields.status || "not open"}. Pass --force=true to update it.`);
}

const resolvedAt = shanghaiTimestamp();
const updatedFields = {
  ...fields,
  status,
  updated_at: resolvedAt,
  resolved_at: resolvedAt,
  resolver: args.get("resolver") || "codex",
  fix_commit: fixCommit,
  validation,
  prevention_added: prevention,
};

const resolutionLines = [
  `## Resolution - ${resolvedAt}`,
  "",
  `- fix_commit: ${fixCommit}`,
  `- validation: ${validation}`,
  `- prevention_added: ${prevention}`,
];

if (notes) resolutionLines.push(`- notes: ${notes}`);

const nextText = [
  serializeFields(updatedFields),
  "",
  body,
  "",
  resolutionLines.join("\n"),
  "",
].join("\n");

if (!dryRun) fs.writeFileSync(file, nextText, "utf8");

console.log(JSON.stringify({
  ok: true,
  dry_run: dryRun,
  file: rel(file),
  status,
  fix_commit: fixCommit,
  validation,
  prevention_added: prevention,
}, null, 2));
