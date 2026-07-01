#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const reportPath = path.join(reportsDir, "tag-v34-cleanup-latest.md");
const signalRoots = [
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "case"),
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "funding"),
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards", "product-service"),
];

const trackPriority = [
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

const opportunitySignalFields = [
  "buyer_or_user",
  "team_or_function",
  "specific_task",
  "business_action",
  "product_form",
  "delivery_model",
  "pain_or_constraint",
  "adoption_evidence",
  "source_evidence_type",
];

const opportunitySignalLimit = 3;
const opportunitySignalValuePriority = {
  business_action: [
    "customer_deployment",
    "funding_round",
    "product_launch",
    "partnership_integration",
    "procurement_signal",
    "pricing_change",
    "acquisition",
    "open_source_release",
    "governance_requirement",
    "research_benchmark",
    "failure_postmortem",
    "hiring_fde",
  ],
  source_evidence_type: [
    "first_party_case",
    "first_party_announcement",
    "funding_news",
    "business_media",
    "regulatory_or_procurement",
    "industry_report",
    "technical_blog",
    "research_paper",
    "community_post",
  ],
};

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

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

function frontmatterBounds(text = "") {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---/u);
  if (!match) return null;
  return {
    start: match.index,
    end: match[0].length,
    body: match[1],
  };
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

function uniq(items = []) {
  return [...new Set(items.filter(Boolean))];
}

function sortedTracks(tracks = []) {
  return uniq(tracks).sort((a, b) => {
    const aIndex = trackPriority.includes(a) ? trackPriority.indexOf(a) : 999;
    const bIndex = trackPriority.includes(b) ? trackPriority.indexOf(b) : 999;
    return aIndex - bIndex || a.localeCompare(b);
  });
}

function cleanupTracks(tracks = []) {
  const unique = uniq(tracks);
  if (unique.length <= 1) return unique;
  const withoutBackground = unique.filter((tag) => tag !== "track-ai-agent");
  const candidates = withoutBackground.length ? withoutBackground : unique;
  return sortedTracks(candidates).slice(0, 3);
}

function cleanupOpportunityValues(field = "", values = []) {
  const priority = opportunitySignalValuePriority[field] || [];
  return uniq(values)
    .sort((a, b) => {
      const aIndex = priority.includes(a) ? priority.indexOf(a) : 999;
      const bIndex = priority.includes(b) ? priority.indexOf(b) : 999;
      return aIndex - bIndex || a.localeCompare(b);
    })
    .slice(0, opportunitySignalLimit);
}

function yamlList(items = []) {
  return `[${items.map((item) => JSON.stringify(item)).join(", ")}]`;
}

function replaceInlineList(fm = "", group = "", values = []) {
  const pattern = new RegExp(`^(\\s{2}${group}:\\s*)\\[[^\\n]*\\]`, "mu");
  if (pattern.test(fm)) return fm.replace(pattern, `$1${yamlList(values)}`);
  const marker = "formal_tags:\n";
  const insert = `  ${group}: ${yamlList(values)}\n`;
  return fm.includes(marker) ? fm.replace(marker, `${marker}${insert}`) : fm;
}

function changedArray(a = [], b = []) {
  return a.join("\u0000") !== b.join("\u0000");
}

function cleanupFile(file) {
  const text = read(file);
  const bounds = frontmatterBounds(text);
  if (!bounds) return null;
  const fm = bounds.body;
  if (scalar(fm, "type") !== "signal_card") return null;

  const beforeTracks = nestedList(fm, "formal_tags", "track");
  const beforeStage = nestedList(fm, "formal_tags", "stage");
  const afterTracks = cleanupTracks(beforeTracks);
  const afterStage = [];
  const opportunityChanges = [];

  let nextFm = fm;
  nextFm = replaceInlineList(nextFm, "track", afterTracks);
  nextFm = replaceInlineList(nextFm, "stage", afterStage);
  for (const field of opportunitySignalFields) {
    const before = nestedList(fm, "opportunity_signals", field);
    const after = cleanupOpportunityValues(field, before);
    if (changedArray(before, after)) {
      nextFm = replaceInlineList(nextFm, field, after);
      opportunityChanges.push(`${field}:${before.length}->${after.length}`);
    }
  }

  const trackChanged = changedArray(beforeTracks, afterTracks);
  const stageChanged = changedArray(beforeStage, afterStage);
  const opportunityChanged = opportunityChanges.length > 0;
  if (!trackChanged && !stageChanged && !opportunityChanged) return null;

  const nextText = `${text.slice(0, bounds.start)}---\n${nextFm}\n---${text.slice(bounds.end)}`;
  fs.writeFileSync(file, nextText, "utf8");
  return {
    file: rel(file),
    id: scalar(fm, "id"),
    title: scalar(fm, "title"),
    beforeTracks: beforeTracks.join(", "),
    afterTracks: afterTracks.join(", "),
    removedStage: beforeStage.join(", "),
    opportunityChanges: opportunityChanges.join(", "),
    trackChanged,
    stageChanged,
    opportunityChanged,
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

function renderReport(rows) {
  const trackRows = rows.filter((row) => row.trackChanged);
  const stageRows = rows.filter((row) => row.stageChanged);
  const opportunityRows = rows.filter((row) => row.opportunityChanged);
  return `# V3.4 Tag Cleanup

Generated at: ${new Date().toISOString()}

## Result

- Files changed: ${rows.length}
- Track groups changed: ${trackRows.length}
- Stage groups cleared: ${stageRows.length}
- Opportunity signal rows narrowed: ${opportunityRows.length}

## Track Cleanup Samples

${table(["file", "id", "title", "beforeTracks", "afterTracks"], trackRows.slice(0, 120))}

## Stage Cleanup Samples

${table(["file", "id", "title", "removedStage"], stageRows.slice(0, 120))}

## Opportunity Signal Cleanup Samples

${table(["file", "id", "title", "opportunityChanges"], opportunityRows.slice(0, 120))}
`;
}

function main() {
  const rows = signalRoots.flatMap(walk).map(cleanupFile).filter(Boolean);
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportPath, renderReport(rows), "utf8");
  console.log(`Changed ${rows.length} Signal Card file(s).`);
  console.log(`Report: ${rel(reportPath)}`);
}

main();
