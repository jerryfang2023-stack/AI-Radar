import fs from "node:fs";
import path from "node:path";
import { readTagTaxonomy, tagGroups, tagIdPattern } from "./tag-taxonomy-utils.mjs";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");

const currentSiteDataPaths = [
  path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json"),
  path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json"),
];

const scriptTargets = [
  "agent-workflow/tools/run-guanlan-daily-monitor.mjs",
  "agent-workflow/tools/generate-asset-cards-from-pool.mjs",
  "01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs",
  "01-SiteV2/site/scripts/build-follow-builders-page-data.mjs",
  "01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs",
];

const markdownRoots = [
  "01-SiteV2/content",
  "01-SiteV2/knowledge",
];

const scriptNonTagLiterals = new Set([
  "opinion-candidates",
  "opinion-cards",
  "opinion-index",
  "opinion-intake",
  "opinion-translation",
  "source-artifact-dir",
  "source-artifacts",
  "source-backed-fill",
  "source-elastic-agrees-to-buy-crv-backed-deductiveai",
  "source-only",
  "source-router",
  "source-runs",
  "source-title-translations-v1",
]);

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(file, predicate);
    return predicate(file) ? [file] : [];
  });
}

function unique(items) {
  return [...new Set(items)];
}

function tagIdsIn(text) {
  tagIdPattern.lastIndex = 0;
  return unique(String(text || "").match(tagIdPattern) || []);
}

function quotedTagIdsIn(text) {
  const pattern = new RegExp(`["'\`]((?:${tagGroups.join("|")})-[a-z0-9-]+)["'\`]`, "gu");
  return unique([...String(text || "").matchAll(pattern)].map((match) => match[1]));
}

function lineFor(text, needle) {
  const index = String(text || "").indexOf(needle);
  if (index < 0) return 1;
  return String(text || "").slice(0, index).split(/\r?\n/u).length;
}

function scanScriptTags(knownIds) {
  const rows = [];
  for (const target of scriptTargets) {
    const file = path.join(root, target);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const tag of quotedTagIdsIn(text).filter((id) => !scriptNonTagLiterals.has(id))) {
      rows.push({
        file: target,
        line: lineFor(text, tag),
        tag,
        known: knownIds.has(tag),
      });
    }
  }
  return rows;
}

function extractFrontmatter(text) {
  return String(text || "").match(/^---\s*\n([\s\S]*?)\n---/u)?.[1] || "";
}

function extractNamedBlock(frontmatter, name) {
  const lines = frontmatter.split(/\r?\n/u);
  const start = lines.findIndex((line) => new RegExp(`^${name}:\\s*$`, "u").test(line));
  if (start < 0) return "";
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^\S/u.test(line)) break;
    block.push(line);
  }
  return block.join("\n");
}

function hasFormalTags(frontmatter) {
  return /^formal_tags:\s*$/mu.test(frontmatter) || /^tags:\s*\[/mu.test(frontmatter);
}

function frontmatterValue(frontmatter, key) {
  return frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "mu"))?.[1]?.replace(/^["']|["']$/gu, "").trim() || "";
}

function scanMarkdownTags(knownIds) {
  const files = markdownRoots.flatMap((dir) => walk(path.join(root, dir), (file) => file.endsWith(".md")));
  const rows = [];
  const missingFormalTags = [];
  const candidateTags = [];
  const formalRequiredTypes = new Set([
    "signal_card",
    "opinion_card",
    "trend_candidate",
  ]);

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const frontmatter = extractFrontmatter(text);
    if (!frontmatter) continue;

    const type = frontmatterValue(frontmatter, "type") || frontmatterValue(frontmatter, "asset_type");
    const formalBlock = extractNamedBlock(frontmatter, "formal_tags");
    const genericTags = frontmatter.match(/^tags:\s*(.+)$/mu)?.[1] || "";
    const formalIds = tagIdsIn(`${formalBlock}\n${genericTags}`);

    for (const tag of formalIds) {
      rows.push({
        file: rel(file),
        line: lineFor(text, tag),
        tag,
        known: knownIds.has(tag),
      });
    }

    const candidateBlock = extractNamedBlock(frontmatter, "candidate_tags");
    const candidateIds = tagIdsIn(candidateBlock);
    for (const tag of candidateIds) {
      candidateTags.push({
        file: rel(file),
        line: lineFor(text, tag),
        tag,
        known: knownIds.has(tag),
      });
    }

    if (formalRequiredTypes.has(type) && !hasFormalTags(frontmatter)) {
      missingFormalTags.push({ file: rel(file), type });
    }
  }

  return { rows, missingFormalTags, candidateTags };
}

function isTagId(value = "") {
  return typeof value === "string" && tagGroups.some((group) => value.startsWith(`${group}-`));
}

function collectSiteTags(value, rows = [], pathParts = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectSiteTags(item, rows, [...pathParts, String(index)]));
    return rows;
  }
  if (!value || typeof value !== "object") return rows;

  if (isTagId(value.id)) rows.push({ path: pathParts.join("."), tag: value.id });
  if (isTagId(value.tag)) rows.push({ path: [...pathParts, "tag"].join("."), tag: value.tag });
  if (isTagId(value.filter)) rows.push({ path: [...pathParts, "filter"].join("."), tag: value.filter });

  if (Array.isArray(value.tags)) {
    value.tags.forEach((tag, index) => {
      if (isTagId(tag)) rows.push({ path: [...pathParts, "tags", String(index)].join("."), tag });
      if (tag && typeof tag === "object" && isTagId(tag.id)) {
        rows.push({ path: [...pathParts, "tags", String(index)].join("."), tag: tag.id });
      }
    });
  }

  for (const [key, next] of Object.entries(value)) {
    if (key === "tags") continue;
    collectSiteTags(next, rows, [...pathParts, key]);
  }
  return rows;
}

function scanCurrentSiteData(knownIds) {
  const rows = [];
  for (const file of currentSiteDataPaths) {
    if (!fs.existsSync(file)) continue;
    const json = JSON.parse(fs.readFileSync(file, "utf8"));
    rows.push(...collectSiteTags(json).map((row) => ({
      file: rel(file),
      path: row.path,
      tag: row.tag,
      known: knownIds.has(row.tag),
    })));
  }
  return rows;
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
  const taxonomy = readTagTaxonomy(root);
  const taxonomyIds = taxonomy.map((tag) => tag.id);
  const knownIds = new Set(taxonomyIds);
  const duplicateIds = taxonomyIds.filter((id, index) => taxonomyIds.indexOf(id) !== index);

  const scriptRows = scanScriptTags(knownIds);
  const markdown = scanMarkdownTags(knownIds);
  const siteRows = scanCurrentSiteData(knownIds);

  const unknownScriptTags = scriptRows.filter((row) => !row.known);
  const unknownFormalTags = markdown.rows.filter((row) => !row.known);
  const unknownSiteTags = siteRows.filter((row) => !row.known);
  const unknownCandidateTags = markdown.candidateTags.filter((row) => !row.known);
  const failed = [
    ...duplicateIds.map((id) => `duplicate taxonomy id: ${id}`),
    ...unknownScriptTags.map((row) => `script unknown tag: ${row.tag} (${row.file}:${row.line})`),
    ...unknownFormalTags.map((row) => `formal_tags unknown tag: ${row.tag} (${row.file}:${row.line})`),
    ...unknownSiteTags.map((row) => `current site data unknown tag: ${row.tag} (${row.file}:${row.path})`),
  ];

  const status = failed.length ? "failed" : "passed";
  const now = new Date();
  const report = `# Tag Quality Gate

Generated at: ${now.toLocaleString("zh-CN", { hour12: false })}

## Result

- Status: ${status}
- Active taxonomy tags: ${taxonomy.length}
- Script hardcoded unknown tags: ${unknownScriptTags.length}
- Markdown formal_tags unknown tags: ${unknownFormalTags.length}
- Current site data unknown tags: ${unknownSiteTags.length}
- Unregistered candidate_tags: ${unknownCandidateTags.length} (reported only)
- Formal assets missing formal_tags: ${markdown.missingFormalTags.length} (reported only)

## Script Unknown Tags

${table(["file", "line", "tag"], unknownScriptTags)}

## Markdown Formal Tags Unknown

${table(["file", "line", "tag"], unknownFormalTags)}

## Current Site Data Unknown Tags

${table(["file", "path", "tag"], unknownSiteTags)}

## Candidate Tags Watchlist

${table(["file", "line", "tag"], unknownCandidateTags.slice(0, 80))}

## Formal Assets Missing formal_tags

${table(["file", "type"], markdown.missingFormalTags.slice(0, 120))}
`;

  fs.mkdirSync(reportsDir, { recursive: true });
  const reportPath = path.join(reportsDir, "tag-quality-gate-latest.md");
  fs.writeFileSync(reportPath, report, "utf8");
  console.log(report);
  console.log(`Report: ${rel(reportPath)}`);

  if (status !== "passed") process.exitCode = 1;
}

main();
