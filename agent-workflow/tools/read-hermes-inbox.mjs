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
const latestOnly = args.get("latest") !== "false";

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
    const match = line.match(/^([a-z_]+):\s*(.*)$/u);
    if (!match) break;
    fields[match[1]] = match[2].trim();
  }
  return fields;
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
        modified_at: stat.mtime.toISOString(),
        fields: parseFields(text),
      };
    })
    .filter((message) => !statusFilter || statusFilter === "all" || (message.fields.status || "open") === statusFilter)
    .sort((a, b) => {
      const aCreated = Date.parse(a.fields.created_at || a.modified_at);
      const bCreated = Date.parse(b.fields.created_at || b.modified_at);
      return bCreated - aCreated;
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

console.log(JSON.stringify(result, null, 2));
