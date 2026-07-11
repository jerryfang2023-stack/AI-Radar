#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { formalTagGroups, isDeprecatedTagId } from "./tag-taxonomy-utils.mjs";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const reportPath = path.join(reportsDir, "tag-cleanup-latest.md");
const assetRoots = [
  path.join(root, "01-SiteV2", "content"),
  path.join(root, "01-SiteV2", "knowledge"),
];

const trackPriority = [
  "track-professional-services-ai",
  "track-ai-science-research",
  "track-creative-media-ai",
  "track-medical-ai",
  "track-embodied-ai",
  "track-ai-customer-service",
  "track-ai-marketing",
  "track-ai-coding",
  "track-enterprise-data",
  "track-ai-governance",
  "track-ai-infra",
  "track-ai-models",
  "track-ai-applications",
  "track-enterprise-workflow",
  "track-ai-agent",
];

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(file);
    return entry.isFile() && entry.name.endsWith(".md") ? [file] : [];
  });
}

function frontmatterBounds(text = "") {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/u);
  if (!match) return null;
  return { start: match.index, end: match[0].length, body: match[1] };
}

function scalar(fm = "", key = "") {
  return fm.match(new RegExp(`^${key}:\\s*["']?([^"'\\n]+)`, "mu"))?.[1]?.trim() || "";
}

function parseInlineList(value = "") {
  const text = String(value || "").trim();
  if (!text.startsWith("[") || !text.endsWith("]")) return [];
  return text.slice(1, -1)
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/u)
    .map((item) => item.trim().replace(/^["']|["']$/gu, ""))
    .filter(Boolean);
}

function namedBlock(fm = "", name = "") {
  const lines = fm.split(/\r?\n/u);
  const start = lines.findIndex((line) => line === `${name}:`);
  if (start < 0) return { start: -1, end: -1, lines: [], values: {} };
  let end = start + 1;
  while (end < lines.length && (!lines[end] || /^\s/u.test(lines[end]))) end += 1;
  const blockLines = lines.slice(start + 1, end);
  const values = {};
  for (const line of blockLines) {
    const match = line.match(/^\s{2}([a-z_]+):\s*(\[[^\n]*\])\s*$/u);
    if (match) values[match[1]] = parseInlineList(match[2]);
  }
  return { start, end, lines, values };
}

function uniq(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function sortTracks(values = []) {
  return uniq(values).sort((a, b) => {
    const ai = trackPriority.includes(a) ? trackPriority.indexOf(a) : 999;
    const bi = trackPriority.includes(b) ? trackPriority.indexOf(b) : 999;
    return ai - bi || a.localeCompare(b);
  });
}

function cleanFormalValues(group, values, { cap = false } = {}) {
  let next = uniq(values).filter((tag) => !isDeprecatedTagId(tag));
  if (group === "track") {
    if (next.length > 1) next = next.filter((tag) => tag !== "track-ai-agent");
    next = sortTracks(next);
  }
  if (group === "customer") next = next.filter((tag) => tag !== "customer-enterprise");
  return cap ? next.slice(0, 2) : next;
}

function yamlList(values = []) {
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

function replaceBlock(fm, oldName, newName, groups, values) {
  const lines = fm.split(/\r?\n/u);
  const block = namedBlock(fm, oldName);
  if (block.start < 0) return fm;
  const next = [
    `${newName}:`,
    ...groups.map((group) => `  ${group}: ${yamlList(values[group] || [])}`),
  ];
  return [...lines.slice(0, block.start), ...next, ...lines.slice(block.end)].join("\n");
}

function upsertScalarBefore(fm, marker, key, value) {
  const line = `${key}: ${value}`;
  const pattern = new RegExp(`^${key}:.*$`, "mu");
  if (pattern.test(fm)) return fm.replace(pattern, line);
  return fm.replace(new RegExp(`^${marker}:$`, "mu"), `${line}\n${marker}:`);
}

function migrateFile(file) {
  const text = fs.readFileSync(file, "utf8");
  const bounds = frontmatterBounds(text);
  if (!bounds) return null;
  const type = scalar(bounds.body, "type") || scalar(bounds.body, "asset_type");
  const formal = namedBlock(bounds.body, "formal_tags");
  if (formal.start < 0) return null;

  const cap = true;
  const formalValues = Object.fromEntries(
    formalTagGroups.map((group) => [group, cleanFormalValues(group, formal.values[group] || [], { cap })]),
  );
  const removed = [
    ...(formal.values.stage || []),
    ...(formal.values.region || []),
    ...(formal.values.source || []),
    ...(formal.values.customer || []).filter((tag) => tag === "customer-enterprise"),
  ];

  let nextFm;
  if (type === "opinion_card") {
    const columnValues = {
      track: cleanFormalValues("track", formal.values.track || [], { cap: true }),
      opinion: uniq(formal.values.opinion || []).slice(0, 2),
    };
    nextFm = replaceBlock(bounds.body, "formal_tags", "column_tags", ["track", "opinion"], columnValues);
    const sourceType = (formal.values.source || [])[0]?.replace(/^source-/u, "").replace("first-party", "first_party").replace("business-media", "business_media").replace("industry-data", "industry_data");
    if (sourceType) nextFm = upsertScalarBefore(nextFm, "column_tags", "source_type", sourceType);
  } else {
    nextFm = replaceBlock(bounds.body, "formal_tags", "formal_tags", formalTagGroups, formalValues);
    if (type === "trend_candidate") {
      const states = formal.values.stage || [];
      if (states.length) {
        const state = states.includes("stage-rising") ? "rising" : states[0].replace(/^stage-/u, "");
        nextFm = upsertScalarBefore(nextFm, "formal_tags", "trend_state", state);
      }
      const regions = uniq((formal.values.region || []).map((value) => value.replace(/^region-/u, "")).filter((value) => value !== "global"));
      if (regions.length) nextFm = upsertScalarBefore(nextFm, "formal_tags", "market_regions", yamlList(regions));
    }
  }

  if (nextFm === bounds.body) return null;
  const nextText = `${text.slice(0, bounds.start)}---\n${nextFm}\n---${text.slice(bounds.end)}`;
  fs.writeFileSync(file, nextText, "utf8");
  return {
    file: rel(file),
    type,
    removed: uniq(removed).join(", "),
    tracksBefore: (formal.values.track || []).join(", "),
    tracksAfter: (formalValues.track || []).join(", "),
  };
}

function table(headers, rows) {
  if (!rows.length) return "None.";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${headers.map((header) => String(row[header] ?? "")).join(" | ")} |`),
  ].join("\n");
}

function main() {
  const rows = assetRoots.flatMap(walk).map(migrateFile).filter(Boolean);
  const firstLineFile = path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json");
  let firstLineRows = 0;
  if (fs.existsSync(firstLineFile)) {
    const data = JSON.parse(fs.readFileSync(firstLineFile, "utf8"));
    for (const remark of data.remarks || []) {
      let changed = false;
      if (Array.isArray(remark.formalTags)) {
        const sourceTag = remark.formalTags.find((tag) => tag?.group === "source" || String(tag?.id || "").startsWith("source-"));
        remark.columnTags = remark.formalTags.filter((tag) => tag?.group === "track" || tag?.group === "opinion");
        remark.sourceType = String(sourceTag?.id || "source-social").replace(/^source-/u, "").replace("first-party", "first_party").replace("business-media", "business_media").replace("industry-data", "industry_data");
        delete remark.formalTags;
        changed = true;
      }
      if (
        Array.isArray(remark.columnTags)
        && remark.columnTags.some((tag) => tag?.id === "opinion-product-strategy")
        && remark.columnTags.some((tag) => tag?.id === "track-enterprise-workflow")
      ) {
        remark.columnTags = remark.columnTags.map((tag) => tag?.id === "track-enterprise-workflow"
          ? { id: "track-ai-applications", name: "AI 应用与平台", group: "track" }
          : tag);
        changed = true;
      }
      if (changed) firstLineRows += 1;
    }
    if (firstLineRows) fs.writeFileSync(firstLineFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }
  const byType = Object.fromEntries([...new Set(rows.map((row) => row.type))].sort().map((type) => [type, rows.filter((row) => row.type === type).length]));
  const report = `# Tag Cleanup\n\nGenerated at: ${new Date().toISOString()}\n\n## Result\n\n- Markdown files changed: ${rows.length}\n- First-Line rows migrated: ${firstLineRows}\n- By type: ${JSON.stringify(byType)}\n- Files with retired values removed: ${rows.filter((row) => row.removed).length}\n- Files with track normalization: ${rows.filter((row) => row.tracksBefore !== row.tracksAfter).length}\n\n## Samples\n\n${table(["file", "type", "removed", "tracksBefore", "tracksAfter"], rows.slice(0, 160))}\n`;
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportPath, report, "utf8");
  console.log(`Changed ${rows.length} asset file(s).`);
  console.log(`Report: ${rel(reportPath)}`);
}

main();
