#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { inferOpportunitySignals, opportunitySignalsYaml } from "./opportunity-signals-utils.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const writeMode = args.get("write") === "true";
const limit = args.has("limit") ? Number.parseInt(args.get("limit"), 10) : Number.POSITIVE_INFINITY;
const categories = ["case", "funding", "product-service"];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function signalCardFiles() {
  return categories.flatMap((category) => {
    const dir = path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", category);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir)
      .filter((name) => name.endsWith(".md") && name !== "README.md")
      .sort()
      .map((name) => ({ category, file: path.join(dir, name) }));
  });
}

function frontmatterMatch(text = "") {
  return text.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
}

function unquote(value = "") {
  let next = String(value || "").trim();
  if ((next.startsWith('"') && next.endsWith('"')) || (next.startsWith("'") && next.endsWith("'"))) next = next.slice(1, -1);
  return next.replace(/\\"/gu, '"').trim();
}

function scalar(fm, key) {
  const match = fm.match(new RegExp(`^${key}:\\s*(.*)$`, "mu"));
  if (!match) return "";
  const value = match[1].trim();
  if (!value || value === "[]" || value === "{}") return "";
  return unquote(value);
}

function block(fm, key) {
  const lines = fm.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) return "";
  const collected = [];
  for (const line of lines.slice(start + 1)) {
    if (line && !/^\s/u.test(line)) break;
    collected.push(line);
  }
  return collected.join("\n");
}

function nestedScalar(fm, section, key) {
  const text = block(fm, section);
  const match = text.match(new RegExp(`^\\s{2}${key}:\\s*(.*)$`, "mu"));
  if (!match) return "";
  const value = match[1].trim();
  if (!value || value === "[]" || value === "{}") return "";
  return unquote(value);
}

function resolvedWorkspacePath(relativePath = "") {
  if (!relativePath) return "";
  const resolved = path.resolve(root, relativePath.replace(/^`|`$/gu, ""));
  return resolved.startsWith(root) ? resolved : "";
}

function readRawJson(fm) {
  const rawJsonPath = resolvedWorkspacePath(nestedScalar(fm, "primary_raw", "raw_json"));
  if (!rawJsonPath || !fs.existsSync(rawJsonPath)) return {};
  try {
    return JSON.parse(read(rawJsonPath));
  } catch {
    return {};
  }
}

function readRawArchive(fm, rawJson = {}) {
  const rawArchivePath = resolvedWorkspacePath(nestedScalar(fm, "primary_raw", "raw_archive"))
    || resolvedWorkspacePath(rawJson.markdown_snapshot_path || "");
  return rawArchivePath && fs.existsSync(rawArchivePath) ? read(rawArchivePath) : "";
}

function compactRawText(rawJson = {}, rawArchive = "") {
  const excerpts = Array.isArray(rawJson.key_excerpts)
    ? rawJson.key_excerpts.map(excerptText).filter(Boolean)
    : [];
  if (excerpts.join(" ").length >= 80) return excerpts.join("\n");
  return [
    clip(rawJson.clean_text, 1200),
    clip(rawJson.full_text, 1200),
    clip(rawJson.markdown, 1200),
    clip(rawJson.text, 1200),
    clip(rawArchive, 1200),
  ].filter(Boolean).join("\n");
}

function excerptText(item) {
  if (!item) return "";
  if (typeof item === "string") return item;
  if (typeof item !== "object") return String(item);
  return item.text || item.excerpt || item.quote || item.content || item.summary || "";
}

function clip(text = "", limit = 1200) {
  const clean = String(text || "").replace(/\s+/gu, " ").trim();
  return clean.length > limit ? clean.slice(0, limit) : clean;
}

function removeYamlBlock(fm, key) {
  const lines = fm.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) return fm;
  let end = start + 1;
  while (end < lines.length && (lines[end] === "" || /^\s/u.test(lines[end]))) end += 1;
  lines.splice(start, end - start);
  return lines.join("\n").replace(/\n{3,}/gu, "\n\n").trimEnd();
}

function insertAfterBlock(fm, anchorKey, yamlBlock) {
  const lines = fm.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `${anchorKey}:`);
  let insertAt = lines.findIndex((line) => line.trim() === "signal_owner:");
  if (start >= 0) {
    insertAt = start + 1;
    while (insertAt < lines.length && (lines[insertAt] === "" || /^\s/u.test(lines[insertAt]))) insertAt += 1;
  }
  if (insertAt < 0) insertAt = lines.length;
  while (insertAt > 0 && lines[insertAt - 1] === "") insertAt -= 1;
  lines.splice(insertAt, 0, "", yamlBlock, "");
  return lines.join("\n").replace(/\n{3,}/gu, "\n\n").trimEnd();
}

function upsertOpportunitySignals(text, yamlBlock) {
  const match = frontmatterMatch(text);
  if (!match) return text;
  const without = removeYamlBlock(match[1], "opportunity_signals");
  const nextFm = insertAfterBlock(without, "formal_tags", yamlBlock);
  return text.replace(match[0], `---\n${nextFm}\n---`);
}

function cardInput({ category, text, fm }) {
  const rawJson = readRawJson(fm);
  const rawArchive = readRawArchive(fm, rawJson);
  return {
    category,
    signalType: scalar(fm, "signal_type"),
    title: scalar(fm, "title"),
    sourceTitle: scalar(fm, "source_title") || rawJson.title || rawJson.source_title || "",
    sourceUrl: nestedScalar(fm, "primary_raw", "source_url") || rawJson.original_url || rawJson.canonical_url || "",
    sourceLevel: nestedScalar(fm, "primary_raw", "source_level"),
    keyExcerpts: Array.isArray(rawJson.key_excerpts) ? rawJson.key_excerpts : [],
    rawText: compactRawText(rawJson, rawArchive),
    cardText: text.replace(/^---\r?\n[\s\S]*?\r?\n---/u, ""),
  };
}

function main() {
  let scanned = 0;
  let changed = 0;
  let skipped = 0;
  const samples = [];
  for (const item of signalCardFiles()) {
    if (scanned >= limit) break;
    scanned += 1;
    const text = read(item.file);
    const match = frontmatterMatch(text);
    if (!match) {
      skipped += 1;
      continue;
    }
    const signals = inferOpportunitySignals(cardInput({ ...item, text, fm: match[1] }));
    const next = upsertOpportunitySignals(text, opportunitySignalsYaml(signals));
    if (next !== text) {
      changed += 1;
      if (writeMode) fs.writeFileSync(item.file, next, "utf8");
      if (samples.length < 8) {
        samples.push({
          file: rel(item.file),
          buyer_or_user: signals.buyer_or_user,
          specific_task: signals.specific_task,
          business_action: signals.business_action,
          product_form: signals.product_form,
          adoption_evidence: signals.adoption_evidence,
        });
      }
    }
  }
  console.log(JSON.stringify({ mode: writeMode ? "write" : "dry-run", scanned, changed, skipped, samples }, null, 2));
}

main();
