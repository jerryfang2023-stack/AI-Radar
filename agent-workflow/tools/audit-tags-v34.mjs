#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { readTagTaxonomy } from "./tag-taxonomy-utils.mjs";
import { OPPORTUNITY_SIGNAL_FIELDS } from "./opportunity-signals-utils.mjs";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const reportMd = path.join(reportsDir, "tag-v34-audit-latest.md");
const reportJson = path.join(reportsDir, "tag-v34-audit-latest.json");
const signalRoots = [
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "case"),
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "funding"),
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "product-service"),
];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") out.push(full);
  }
  return out;
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function frontmatter(text = "") {
  return text.match(/^---\s*\n([\s\S]*?)\n---/u)?.[1] || "";
}

function unquote(value = "") {
  const text = String(value || "").trim();
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return text.slice(1, -1).trim();
  }
  return text;
}

function scalar(fm = "", key = "") {
  return unquote(fm.match(new RegExp(`^${key}:\\s*(.*)$`, "mu"))?.[1] || "");
}

function block(fm = "", key = "") {
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

function parseArrayText(value = "") {
  const text = value.trim();
  if (!text.startsWith("[") || !text.endsWith("]")) return [];
  return text
    .slice(1, -1)
    .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/u)
    .map(unquote)
    .map((item) => item.trim())
    .filter(Boolean);
}

function nestedList(fm = "", section = "", key = "") {
  const text = block(fm, section);
  const inline = text.match(new RegExp(`^\\s{2}${key}:\\s*(\\[[^\\n]*\\])`, "mu"));
  if (inline) return parseArrayText(inline[1]);
  const lines = text.split(/\r?\n/u);
  const start = lines.findIndex((line) => line.trim() === `${key}:`);
  if (start < 0) return [];
  const collected = [];
  for (const line of lines.slice(start + 1)) {
    if (/^\s{2}\S/u.test(line)) break;
    collected.push(line);
  }
  return collected
    .map((line) => line.match(/^\s*-\s*(.*)$/u)?.[1])
    .filter(Boolean)
    .map(unquote);
}

function nestedScalar(fm = "", section = "", key = "") {
  const text = block(fm, section);
  return unquote(text.match(new RegExp(`^\\s{2}${key}:\\s*(.*)$`, "mu"))?.[1] || "");
}

function increment(map, key, count = 1) {
  if (!key) return;
  map.set(key, (map.get(key) || 0) + count);
}

function topEntries(map, limit = 30) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function table(headers, rows) {
  if (!rows.length) return "None.";
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${headers.map((header) => String(row[header] ?? "")).join(" | ")} |`),
  ].join("\n");
}

function loadSignalCards() {
  const cards = [];
  for (const file of signalRoots.flatMap(walk)) {
    const text = read(file);
    const fm = frontmatter(text);
    if (!fm || scalar(fm, "type") !== "signal_card") continue;
    const tags = {};
    for (const group of ["track", "function", "scenario", "customer", "evidence", "stage", "region", "source"]) {
      tags[group] = nestedList(fm, "formal_tags", group);
    }
    const opportunitySignals = {};
    for (const field of OPPORTUNITY_SIGNAL_FIELDS) {
      opportunitySignals[field] = nestedList(fm, "opportunity_signals", field);
    }
    opportunitySignals.missing_fields = nestedList(fm, "opportunity_signals", "missing_fields");
    opportunitySignals.evidence_basis = nestedScalar(fm, "opportunity_signals", "evidence_basis");
    opportunitySignals.source_excerpt = nestedScalar(fm, "opportunity_signals", "source_excerpt");
    cards.push({
      file: rel(file),
      id: scalar(fm, "id"),
      signalType: scalar(fm, "signal_type"),
      title: scalar(fm, "title"),
      date: scalar(fm, "date"),
      tags,
      opportunitySignals,
    });
  }
  return cards;
}

function preferredTrack(tags = []) {
  const priority = [
    "track-professional-services-ai",
    "track-medical-ai",
    "track-embodied-ai",
    "track-ai-customer-service",
    "track-ai-marketing",
    "track-ai-coding",
    "track-enterprise-data",
    "track-ai-governance",
    "track-ai-infra",
    "track-enterprise-workflow",
    "track-ai-agent",
  ];
  return [...tags].sort((a, b) => priority.indexOf(a) - priority.indexOf(b))[0] || "";
}

function signalCardAudit(cards) {
  const counts = new Map();
  const groupCounts = new Map();
  const missing = { track: 0, evidence: 0, source: 0 };
  const multiTrack = [];
  const stageOnSignalCards = [];
  const trackTrimDryRun = [];

  for (const card of cards) {
    for (const [group, values] of Object.entries(card.tags)) {
      increment(groupCounts, group, values.length);
      for (const tag of values) increment(counts, tag);
    }
    if (!card.tags.track.length) missing.track += 1;
    if (!card.tags.evidence.length) missing.evidence += 1;
    if (!card.tags.source.length) missing.source += 1;
    if (card.tags.track.length >= 4) multiTrack.push(card);
    if (card.tags.stage.length) stageOnSignalCards.push(card);
    if (card.tags.track.length > 3 || (card.tags.track.includes("track-ai-agent") && card.tags.track.length > 1)) {
      const primary = preferredTrack(card.tags.track);
      const suggested = [primary, ...card.tags.track.filter((tag) => tag !== primary && tag !== "track-ai-agent")].slice(0, 3);
      if (suggested.length && suggested.join("|") !== card.tags.track.join("|")) {
        trackTrimDryRun.push({
          file: card.file,
          id: card.id,
          title: card.title,
          current: card.tags.track.join(", "),
          suggested: suggested.join(", "),
        });
      }
    }
  }

  const highCoverageTags = topEntries(counts, 80)
    .filter((row) => row.count / Math.max(cards.length, 1) >= 0.25)
    .map((row) => ({ ...row, coverage: Number((row.count / Math.max(cards.length, 1)).toFixed(3)) }));

  return {
    total: cards.length,
    missing,
    groupTotals: Object.fromEntries(groupCounts),
    topTags: topEntries(counts, 40),
    highCoverageTags,
    multiTrackCount: multiTrack.length,
    multiTrackSamples: multiTrack.slice(0, 20).map((card) => ({
      file: card.file,
      id: card.id,
      title: card.title,
      tracks: card.tags.track.join(", "),
    })),
    stageOnSignalCardsCount: stageOnSignalCards.length,
    stageOnSignalCardsSamples: stageOnSignalCards.slice(0, 20).map((card) => ({
      file: card.file,
      id: card.id,
      title: card.title,
      stage: card.tags.stage.join(", "),
    })),
    trackTrimDryRunCount: trackTrimDryRun.length,
    trackTrimDryRun: trackTrimDryRun.slice(0, 80),
  };
}

function opportunityAudit(cards) {
  const fieldCounts = {};
  const missingCounts = new Map();
  const broadRows = [];
  for (const field of OPPORTUNITY_SIGNAL_FIELDS) fieldCounts[field] = new Map();
  for (const card of cards) {
    for (const field of OPPORTUNITY_SIGNAL_FIELDS) {
      for (const value of card.opportunitySignals[field] || []) increment(fieldCounts[field], value);
    }
    for (const field of card.opportunitySignals.missing_fields || []) increment(missingCounts, field);
    const valuesPerField = OPPORTUNITY_SIGNAL_FIELDS
      .filter((field) => (card.opportunitySignals[field] || []).length > 3)
      .map((field) => `${field}:${card.opportunitySignals[field].length}`);
    if (valuesPerField.length) {
      broadRows.push({
        file: card.file,
        id: card.id,
        title: card.title,
        fields: valuesPerField.join(", "),
      });
    }
  }
  return {
    fieldCounts: Object.fromEntries(Object.entries(fieldCounts).map(([field, map]) => [field, topEntries(map, 20)])),
    missingCounts: topEntries(missingCounts, 20),
    broadRowsCount: broadRows.length,
    broadRows: broadRows.slice(0, 80),
  };
}

function currentSiteAudit() {
  const file = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
  if (!fs.existsSync(file)) return {};
  const data = JSON.parse(read(file));
  const flatCounts = new Map();
  for (const card of data.cards || []) {
    for (const tag of card.flatTags || []) increment(flatCounts, tag);
  }
  return {
    file: rel(file),
    activeDate: data.meta?.activeDate || "",
    cards: data.cards?.length || 0,
    top10: data.top10?.length || 0,
    allowedTagCount: data.meta?.allowedTagCount || 0,
    topFlatTags: topEntries(flatCounts, 30),
    tagAssociations: (data.tagAssociations || []).map((item) => ({
      tag: item.object,
      label: item.label,
      todayCount: item.todayCount,
      last30Count: item.last30Count,
    })),
    trendLinks: (data.trendLinks || []).map((item) => ({
      window: item.window,
      tag: item.object,
      label: item.label,
      cardCount: item.cardCount,
    })),
  };
}

function followBuildersAudit() {
  const file = path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json");
  if (!fs.existsSync(file)) return {};
  const data = JSON.parse(read(file));
  const counts = new Map();
  for (const remark of data.remarks || []) {
    for (const tag of remark.formalTags || []) increment(counts, tag.id || tag.name || "");
  }
  return {
    file: rel(file),
    remarks: data.remarks?.length || 0,
    topFormalTags: topEntries(counts, 30),
  };
}

function communityAudit() {
  const file = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");
  if (!fs.existsSync(file)) return {};
  const data = JSON.parse(read(file));
  const placeholders = new Map();
  const fields = ["scene", "industry", "monetization"];
  for (const item of data.items || []) {
    for (const field of fields) {
      const value = item[field];
      if (/待确认|未识别|未分类|未知/u.test(String(value || ""))) increment(placeholders, `${field}:${value}`);
    }
  }
  return {
    file: rel(file),
    items: data.items?.length || 0,
    placeholderValues: topEntries(placeholders, 30),
  };
}

function taxonomyAudit() {
  const tags = readTagTaxonomy(root);
  const groups = new Map();
  for (const tag of tags) increment(groups, tag.group);
  return {
    total: tags.length,
    groups: Object.fromEntries([...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))),
  };
}

function renderMarkdown(payload) {
  const highCoverageRows = payload.signalCards.highCoverageTags.map((row) => ({
    tag: row.key,
    count: row.count,
    coverage: `${Math.round(row.coverage * 100)}%`,
  }));
  return `# V3.4 Tag System Audit

Generated at: ${payload.generatedAt}

## Result

- Taxonomy tags: ${payload.taxonomy.total}
- Signal Cards audited: ${payload.signalCards.total}
- Multi-track Signal Cards: ${payload.signalCards.multiTrackCount}
- Signal Cards carrying stage tags: ${payload.signalCards.stageOnSignalCardsCount}
- Track cleanup dry-run rows: ${payload.signalCards.trackTrimDryRunCount}
- Opportunity rows with overly broad fields: ${payload.opportunitySignals.broadRowsCount}

## High Coverage Tags

${table(["tag", "count", "coverage"], highCoverageRows)}

## Signal Card Missing Required Tag Groups

${table(["group", "count"], Object.entries(payload.signalCards.missing).map(([group, count]) => ({ group, count })))}

## Multi-Track Samples

${table(["file", "id", "title", "tracks"], payload.signalCards.multiTrackSamples)}

## Stage Tags On Signal Cards

${table(["file", "id", "title", "stage"], payload.signalCards.stageOnSignalCardsSamples)}

## Track Cleanup Dry Run

${table(["file", "id", "title", "current", "suggested"], payload.signalCards.trackTrimDryRun)}

## Opportunity Missing Fields

${table(["key", "count"], payload.opportunitySignals.missingCounts)}

## Opportunity Broad Rows

${table(["file", "id", "title", "fields"], payload.opportunitySignals.broadRows)}

## Current Site Aggregation

- File: ${payload.currentSite.file || "missing"}
- Active date: ${payload.currentSite.activeDate || ""}
- Cards: ${payload.currentSite.cards || 0}
- Top10: ${payload.currentSite.top10 || 0}
- Allowed tag count: ${payload.currentSite.allowedTagCount || 0}

### Current Tag Associations

${table(["tag", "label", "todayCount", "last30Count"], payload.currentSite.tagAssociations || [])}

### Current Trend Links

${table(["window", "tag", "label", "cardCount"], payload.currentSite.trendLinks || [])}

## First-Line Viewpoints Tags

${table(["key", "count"], payload.followBuilders.topFormalTags || [])}

## Community Placeholder Values

${table(["key", "count"], payload.community.placeholderValues || [])}

## Recommended Cleanup Policy

- Treat track-ai-agent as domain background when it appears with a more specific track.
- Keep no more than 3 track tags per Signal Card; prefer the most specific vertical or workflow track.
- Keep stage tags out of ordinary Signal Card frontstage display and aggregation.
- Keep Reports Center opportunity maps on source-backed opportunity_signals, not formal_tags.
- Review opportunity rows with more than 3 values in any field before using them for map cells.
`;
}

function main() {
  const cards = loadSignalCards();
  const payload = {
    generatedAt: new Date().toISOString(),
    taxonomy: taxonomyAudit(),
    signalCards: signalCardAudit(cards),
    opportunitySignals: opportunityAudit(cards),
    currentSite: currentSiteAudit(),
    followBuilders: followBuildersAudit(),
    community: communityAudit(),
  };
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportJson, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(reportMd, renderMarkdown(payload), "utf8");
  console.log(`Wrote ${rel(reportMd)}`);
  console.log(`Wrote ${rel(reportJson)}`);
}

main();
