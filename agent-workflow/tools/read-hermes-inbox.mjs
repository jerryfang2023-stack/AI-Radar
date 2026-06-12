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

const statusFilter = args.get("status") || "open";
const latestOnly = args.has("latest") ? args.get("latest") !== "false" : false;
const outputFormat = args.get("format") || "json";
const includePrompt = args.get("prompt") !== "false";
const priorityRank = new Map([
  ["urgent", 0],
  ["high", 1],
  ["normal", 2],
  ["low", 3],
]);

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
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

function parseTitle(text) {
  const heading = text.split(/\r?\n/u).find((line) => /^#\s+/u.test(line));
  return heading ? heading.replace(/^#\s+/u, "").trim() : "";
}

function parseEvidence(text) {
  const lines = text.split(/\r?\n/u);
  const evidence = [];
  let inEvidence = false;

  for (const line of lines) {
    if (/^##\s+Evidence/u.test(line)) {
      inEvidence = true;
      continue;
    }
    if (inEvidence && /^##\s+/u.test(line)) break;
    if (inEvidence && /^-\s+/u.test(line.trim())) evidence.push(line.trim().replace(/^-\s+/u, ""));
  }

  return evidence.slice(0, 6);
}

function dateValue(value, fallback) {
  const parsed = Date.parse(value || fallback || "");
  return Number.isNaN(parsed) ? 0 : parsed;
}

function priorityValue(message) {
  const value = (message.fields.priority || "normal").toLowerCase();
  return priorityRank.has(value) ? priorityRank.get(value) : priorityRank.get("normal");
}

function repairPrompt(messages) {
  if (!messages.length) {
    return "Hermes inbox has no matching repair requests.";
  }

  const lines = [
    "Hermes repair queue:",
    "",
  ];

  messages.forEach((message, index) => {
    const fields = message.fields;
    lines.push(`${index + 1}. ${fields.priority || "normal"} | ${fields.lane || "unknown lane"} | ${message.name}`);
    lines.push(`   file: ${message.file}`);
    lines.push(`   failed_gate: ${fields.failed_gate || "unknown"}`);
    lines.push(`   report_path: ${fields.report_path || "unknown"}`);
    lines.push(`   data_generated: ${fields.data_generated || "unknown"}`);
    lines.push(`   needed_action: ${fields.needed_action || "inspect and repair"}`);
    if (message.evidence.length) {
      lines.push(`   evidence: ${message.evidence.join(" | ")}`);
    }
    lines.push("");
  });

  lines.push("Codex repair loop:");
  lines.push("1. Read the listed report_path first, then inspect the failed gate or lane script.");
  lines.push("2. Fix the smallest system path that caused the incident; do not only patch same-day data for recurring failures.");
  lines.push("3. Rerun the exact failed gate or the smallest relevant validation.");
  lines.push("4. Add a prevention artifact when the issue can recur: gate, eval, memory, or context rule.");
  lines.push("5. Record the repair action, then close the inbox item with:");
  lines.push("   npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=<gate|eval|memory|context|not-needed>");

  return lines.join("\n");
}

function listMessages() {
  if (!fs.existsSync(inboxDir)) return [];
  return fs.readdirSync(inboxDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md" && entry.name !== "TEMPLATE.md")
    .map((entry) => {
      const file = path.join(inboxDir, entry.name);
      const text = readText(file);
      const stat = fs.statSync(file);
      return {
        file: rel(file),
        name: entry.name,
        title: parseTitle(text),
        evidence: parseEvidence(text),
        modified_at: stat.mtime.toISOString(),
        fields: parseFields(text),
      };
    })
    .filter((message) => !statusFilter || statusFilter === "all" || (message.fields.status || "open") === statusFilter)
    .sort((a, b) => {
      const priorityDelta = priorityValue(a) - priorityValue(b);
      if (priorityDelta !== 0) return priorityDelta;

      const aUpdated = dateValue(a.fields.updated_at || a.fields.created_at, a.modified_at);
      const bUpdated = dateValue(b.fields.updated_at || b.fields.created_at, b.modified_at);
      return bUpdated - aUpdated;
    });
}

const messages = listMessages();
const outputMessages = latestOnly ? messages.slice(0, 1) : messages;

const result = {
  ok: true,
  status: messages.length ? "found" : "empty",
  filter: {
    status: statusFilter,
    latest: latestOnly,
  },
  count: messages.length,
  messages: outputMessages,
};

if (includePrompt) {
  result.repair_prompt = repairPrompt(outputMessages);
}

if (outputFormat === "prompt") {
  console.log(result.repair_prompt || repairPrompt(outputMessages));
} else {
  console.log(JSON.stringify(result, null, 2));
}
