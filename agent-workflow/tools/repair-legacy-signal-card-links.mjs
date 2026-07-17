#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const cardRoot = path.join(root, "01-SiteV2/knowledge/01-Signal-Cards");
const rawRoot = path.join(root, "01-SiteV2/content/01-raw/originals");

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function normalize(value) {
  return String(value ?? "").replace(/^['"]|['"]$/gu, "").trim();
}

function normalizeUrl(value) {
  const text = normalize(value);
  if (!text) return "";
  try {
    const url = new URL(text);
    url.hash = "";
    url.hostname = url.hostname.toLowerCase().replace(/^www\./u, "");
    url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
    return url.toString().replace(/\/$/u, "");
  } catch {
    return text.replace(/#.*$/u, "").replace(/\/$/u, "");
  }
}

function relative(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function listFiles(dir, extension) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(file, extension);
    return entry.isFile() && entry.name.endsWith(extension) ? [file] : [];
  }).sort();
}

function frontmatter(text) {
  return text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/u)?.[1] || "";
}

function values(block, key) {
  return [...block.matchAll(new RegExp(`^\\s*${key}:\\s*(.+)$`, "gmu"))].map((match) => normalize(match[1])).filter(Boolean);
}

function addIndex(map, key, file) {
  if (!key) return;
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(file);
}

function existingWorkspacePath(value) {
  const file = path.resolve(root, normalize(value).replace(/\//gu, path.sep));
  const rel = path.relative(root, file);
  return rel && !rel.startsWith(`..${path.sep}`) && !path.isAbsolute(rel) && fs.existsSync(file);
}

function chooseCandidate(candidates, rawRef) {
  const files = [...candidates];
  if (files.length <= 1) return files[0] || "";
  const number = normalize(rawRef).match(/R-(\d+)/iu)?.[1];
  if (number) {
    const exact = files.filter((file) => new RegExp(`^r-${number}-`, "iu").test(path.basename(file)));
    if (exact.length === 1) return exact[0];
  }
  return "";
}

function replaceNestedPath(text, key, value) {
  const escaped = value.replace(/\\/gu, "/");
  const expression = new RegExp(`^(\\s+${key}:\\s*)[^\\r\\n]+`, "mu");
  if (expression.test(text)) return text.replace(expression, `$1"${escaped}"`);
  return text;
}

function upsertLegacySourceStatus(text, status) {
  if (/^\s+legacy_source_status:/mu.test(text)) {
    return text.replace(/^(\s+legacy_source_status:\s*)[^\r\n]+/mu, `$1${status}`);
  }
  return text.replace(/^(\s+raw_json:\s*[^\r\n]+)$/mu, `$1\n  legacy_source_status: ${status}`);
}

function main() {
  const write = arg("write", "false") === "true";
  const byDatedUrl = new Map();
  for (const file of listFiles(rawRoot, ".json")) {
    let raw;
    try {
      raw = JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
    } catch {
      continue;
    }
    const date = relative(file).match(/originals\/(\d{4}-\d{2}-\d{2})\//u)?.[1] || "";
    for (const value of [raw.original_url, raw.source_url, raw.canonical_url]) addIndex(byDatedUrl, `${date}::${normalizeUrl(value)}`, file);
  }

  const report = { write, card_files: 0, broken_before: 0, repaired: 0, externalized: 0, failures: [], ambiguous_sources: [] };
  const cardFiles = listFiles(cardRoot, ".md").filter((file) => path.basename(file).toLowerCase() !== "readme.md");
  report.card_files = cardFiles.length;
  for (const file of cardFiles) {
    const text = fs.readFileSync(file, "utf8");
    const fm = frontmatter(text);
    const archives = values(fm, "raw_archive");
    const jsonPaths = values(fm, "raw_json");
    const legacySourceStatus = normalize(fm.match(/^\s+legacy_source_status:\s*(.+)$/mu)?.[1] || "");
    if (["external_only", "ambiguous_source"].includes(legacySourceStatus) && !archives.length && !jsonPaths.length) continue;
    const archiveOk = archives.length && archives.every(existingWorkspacePath);
    const jsonOk = jsonPaths.length && jsonPaths.every(existingWorkspacePath);
    if (archiveOk && jsonOk) continue;
    report.broken_before += 1;

    const date = normalize(fm.match(/^date:\s*(.+)$/mu)?.[1] || path.basename(file).slice(0, 10));
    const sourceUrls = [...new Set(values(fm, "source_url").map(normalizeUrl).filter(Boolean))];
    const rawRef = normalize(fm.match(/^\s*raw_ref:\s*(.+)$/mu)?.[1] || "");
    const candidates = new Set();
    for (const url of sourceUrls) for (const candidate of byDatedUrl.get(`${date}::${url}`) || []) candidates.add(candidate);
    const candidate = chooseCandidate(candidates, rawRef);
    if (!candidate) {
      const status = candidates.size > 1 ? "ambiguous_source" : "external_only";
      const updated = upsertLegacySourceStatus(replaceNestedPath(replaceNestedPath(text, "raw_archive", ""), "raw_json", ""), status);
      if (updated === text || !/^\s+raw_archive:\s*""/mu.test(updated) || !/^\s+raw_json:\s*""/mu.test(updated)) {
        report.failures.push({ card: relative(file), reason: "broken paths could not be retired" });
        continue;
      }
      report.externalized += 1;
      if (candidates.size > 1) report.ambiguous_sources.push({ card: relative(file), candidate_count: candidates.size, source_urls: sourceUrls });
      if (write) fs.writeFileSync(file, updated, "utf8");
      continue;
    }

    const markdown = candidate.replace(/\.json$/iu, ".md");
    if (!fs.existsSync(markdown)) {
      report.failures.push({ card: relative(file), candidate_count: 1, reason: "matching Raw Markdown is missing" });
      continue;
    }
    const updated = upsertLegacySourceStatus(replaceNestedPath(replaceNestedPath(text, "raw_archive", relative(markdown)), "raw_json", relative(candidate)), "local_snapshot");
    if (updated === text || !frontmatter(updated).includes(relative(candidate))) {
      report.failures.push({ card: relative(file), candidate_count: 1, reason: "primary_raw path fields could not be updated" });
      continue;
    }
    report.repaired += 1;
    if (write) fs.writeFileSync(file, updated, "utf8");
  }

  console.log(JSON.stringify(report, null, 2));
  if (report.failures.length) process.exit(1);
}

main();
