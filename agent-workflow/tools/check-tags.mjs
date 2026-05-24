import fs from "node:fs";
import path from "node:path";
import { readTagTaxonomy, tagGroups, tagIdPattern } from "./tag-taxonomy-utils.mjs";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");
const siteContentPath = path.join(root, "01-SiteV2", "site", "data", "site-content.json");

const scriptTargets = [
  "agent-workflow/tools/run-guanlan-daily-monitor.mjs",
  "agent-workflow/tools/generate-asset-cards-from-pool.mjs",
  "agent-workflow/tools/regenerate-v2-assets-from-existing-raw.mjs",
  "01-SiteV2/site/scripts/sync-v2-site-data.mjs",
  "agent-workflow/tools/v2-content-gate.mjs",
  "agent-workflow/tools/card-copy-style-gate.mjs",
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
  "source-router",
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
    "change_candidate",
    "scene_candidate",
    "trend_candidate",
    "trend_report",
    "brief_issue",
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

function collectSiteTags(value, rows = [], pathParts = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectSiteTags(item, rows, [...pathParts, String(index)]));
    return rows;
  }
  if (!value || typeof value !== "object") return rows;

  if (typeof value.id === "string" && tagGroups.some((group) => value.id.startsWith(`${group}-`))) {
    rows.push({ path: pathParts.join("."), tag: value.id });
  }
  if (Array.isArray(value.tags)) {
    value.tags.forEach((tag, index) => {
      if (typeof tag === "string") rows.push({ path: [...pathParts, "tags", String(index)].join("."), tag });
      if (tag && typeof tag === "object" && typeof tag.id === "string") rows.push({ path: [...pathParts, "tags", String(index)].join("."), tag: tag.id });
    });
  }

  for (const [key, next] of Object.entries(value)) {
    if (key === "tags") continue;
    collectSiteTags(next, rows, [...pathParts, key]);
  }
  return rows;
}

function scanSiteContent(knownIds, taxonomyIds) {
  if (!fs.existsSync(siteContentPath)) {
    return { rows: [], taxonomyUnknown: [], taxonomyMissing: [...taxonomyIds] };
  }
  const json = JSON.parse(fs.readFileSync(siteContentPath, "utf8"));
  const siteTaxonomyIds = new Set((Array.isArray(json.tagTaxonomy) ? json.tagTaxonomy : []).map((tag) => tag.id).filter(Boolean));
  const rows = collectSiteTags(json)
    .filter((row) => !row.path.startsWith("tagTaxonomy"))
    .map((row) => ({ ...row, known: knownIds.has(row.tag) }));

  return {
    rows,
    taxonomyUnknown: [...siteTaxonomyIds].filter((id) => !knownIds.has(id)),
    taxonomyMissing: [...taxonomyIds].filter((id) => !siteTaxonomyIds.has(id)),
  };
}

function table(headers, rows) {
  if (!rows.length) return "无。";
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
  const site = scanSiteContent(knownIds, taxonomyIds);

  const unknownScriptTags = scriptRows.filter((row) => !row.known);
  const unknownFormalTags = markdown.rows.filter((row) => !row.known);
  const unknownSiteTags = site.rows.filter((row) => !row.known);
  const unknownCandidateTags = markdown.candidateTags.filter((row) => !row.known);
  const failed = [
    ...duplicateIds.map((id) => `duplicate taxonomy id: ${id}`),
    ...unknownScriptTags.map((row) => `script unknown tag: ${row.tag} (${row.file}:${row.line})`),
    ...unknownFormalTags.map((row) => `formal_tags unknown tag: ${row.tag} (${row.file}:${row.line})`),
    ...unknownSiteTags.map((row) => `site-content unknown tag: ${row.tag} (${row.path})`),
    ...site.taxonomyUnknown.map((id) => `site tagTaxonomy unknown id: ${id}`),
    ...site.taxonomyMissing.map((id) => `site tagTaxonomy missing id: ${id}`),
  ];

  const status = failed.length ? "failed" : "passed";
  const now = new Date();
  const report = `# Tag Quality Gate

生成时间：${now.toLocaleString("zh-CN", { hour12: false })}

## 结论

- 状态：${status}
- 正式 taxonomy tag 数：${taxonomy.length}
- 脚本 hardcoded unknown tags：${unknownScriptTags.length}
- Markdown formal_tags unknown tags：${unknownFormalTags.length}
- site-content tags unknown 数：${unknownSiteTags.length}
- site tagTaxonomy unknown / missing：${site.taxonomyUnknown.length} / ${site.taxonomyMissing.length}
- candidate_tags 中未登记 tag：${unknownCandidateTags.length}（只报告，不阻塞）
- 缺 formal_tags 的正式资产：${markdown.missingFormalTags.length}（只报告，不阻塞本次 unknown gate）

## 脚本未知 tag

${table(["file", "line", "tag"], unknownScriptTags)}

## Markdown formal_tags 未知 tag

${table(["file", "line", "tag"], unknownFormalTags)}

## Site content 未知 tag

${table(["path", "tag"], unknownSiteTags)}

## Site tagTaxonomy 漂移

${table(["tag"], [...site.taxonomyUnknown.map((tag) => ({ tag: `unknown:${tag}` })), ...site.taxonomyMissing.map((tag) => ({ tag: `missing:${tag}` }))])}

## candidate_tags 观察项

${table(["file", "line", "tag"], unknownCandidateTags.slice(0, 80))}

## 缺 formal_tags 的正式资产

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
