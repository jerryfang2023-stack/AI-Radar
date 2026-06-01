import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || "true"];
    })
);

const date = args.get("date") || "";
const strict = args.get("strict") !== "false";
const includeMarkdown = args.get("markdown") === "true" || args.get("history") === "true";
const scanHistory = args.get("history") === "true";
const reportsDir = path.join(root, "agent-workflow", "reports");
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const bannedPhrases = [
  "材料把资金用途指向",
  "材料显示它",
  "这条材料把 AI",
  "后续判断重点不是模型参数",
  "可以观察客户是否愿意为流程结果",
  "当前材料保留了原始链接",
  "真实客户规模、长期留存",
  "公开材料给了",
  "这件事的商业含义",
  "部署 AI 到",
  "押注",
  "Raw",
  "Pool",
  "core_pool",
  "入库",
  "证据链",
  "强证据",
  "usable_for",
  "pool_routes",
  "gate",
];

const publicJsonKeys = /^(title|dek|brief|judgment|oneLine|interpretation|calibrates|usage|event|businessMeaning|whyWatch|displayTitle|editorialTitle|sourceTitle|eventLine|evidenceBoundary|watchWindow|summary|risk|publicSample|loginPreview|fullNote|stage|score|speakerLine|originalTranslation|selectionReason|analysis|counter|calibration|sources)$/u;
const skipJsonKeys = /^(id|slug|date|label|link|sourceUrl|source_url|url|sourcePath|sourceLinks|tags|relations|relationFields|rawRefs|structuredRefs|formalTags|generatedAt|contentRoot|version|originalQuote|originalView|originalDate|publishedAt)$/u;
const markdownTargets = [
  "01-SiteV2/content/03-daily-observation",
  "01-SiteV2/content/04-business-signals/signals",
  "01-SiteV2/content/05-frontier-opinions",
  "01-SiteV2/knowledge/01-Signal-Cards",
  "01-SiteV2/knowledge/02-Opinion-Cards",
];

const protectedFrontmatterKeys = /^(id|type|date|status|created_at|updated_at|source_|raw_|pool_|usable_for|pool_routes|evidence_level|source_level|capture_scope|markdown_snapshot|full_text_hash|content_hash|canonical_url|original_url|url|tags|formal_tags|primary_raw|source_evidence|opinion_capture|fact_claim_support|originalQuote|sourceLinks)/u;
const ignoredHeading = /^(原始出处与证据|数据来源|关联资产|证据缺口|事实主张校验|Tags|后台结构化主张|人物 \/ 机构|发表时间与出处|原文摘录|可信边界|Raw|Pool|usable_for|pool_routes)/u;

function matchingPhrases(value = "") {
  return bannedPhrases.filter((phrase) => {
    if (phrase === "Raw" || phrase === "Pool" || phrase === "gate") {
      return new RegExp(`\\b${phrase}\\b`, "u").test(value);
    }
    return value.includes(phrase);
  });
}

function collectJsonIssues(value, pointer = "$", issues = []) {
  if (value == null) return issues;
  if (typeof value === "string") {
    for (const phrase of matchingPhrases(value)) {
      issues.push({ source: "site-data", pointer, phrase, value: value.slice(0, 180) });
    }
    return issues;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectJsonIssues(item, `${pointer}[${index}]`, issues));
    return issues;
  }
  if (typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (skipJsonKeys.test(key)) continue;
      const nextPointer = `${pointer}.${key}`;
      if (typeof item === "string") {
        if (publicJsonKeys.test(key)) collectJsonIssues(item, nextPointer, issues);
      } else {
        collectJsonIssues(item, nextPointer, issues);
      }
    }
  }
  return issues;
}

function readSiteContent() {
  const file = path.join(root, "01-SiteV2", "site", "data", "site-content.json");
  if (!fs.existsSync(file)) return { file, data: null };
  return { file, data: JSON.parse(fs.readFileSync(file, "utf8")) };
}

function listMarkdownFiles(target) {
  const abs = path.join(root, target);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return abs.endsWith(".md") ? [abs] : [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "10-Templates" || entry.name === "99-Archive") continue;
      const next = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(next);
      } else if (entry.name.endsWith(".md") && entry.name.toLowerCase() !== "readme.md") {
        if (!date || entry.name.startsWith(date)) files.push(next);
      }
    }
  };
  walk(abs);
  return files;
}

function markdownPublicLines(text) {
  const lines = text.replace(/^\uFEFF/u, "").split(/\r?\n/u);
  const output = [];
  let inFrontmatter = false;
  let inPublicYamlBlock = false;
  let skipSection = false;

  lines.forEach((line, index) => {
    const lineNo = index + 1;
    if (index === 0 && line.trim() === "---") {
      inFrontmatter = true;
      return;
    }
    if (inFrontmatter) {
      if (line.trim() === "---") {
        inFrontmatter = false;
        inPublicYamlBlock = false;
        return;
      }
      const topKey = line.match(/^([A-Za-z0-9_]+):/u)?.[1] || "";
      if (topKey) inPublicYamlBlock = ["frontend", "title", "event", "business_meaning", "why_selected", "watch_reason", "evidence_boundary", "selection_reason"].includes(topKey);
      if (protectedFrontmatterKeys.test(line.trim()) && !inPublicYamlBlock) return;
      if (!inPublicYamlBlock && !/^(title|event|business_meaning|why_selected|watch_reason|evidence_boundary|selection_reason):/u.test(line.trim())) return;
      output.push({ lineNo, text: line });
      return;
    }

    const heading = line.match(/^#{1,3}\s+(.+)$/u)?.[1]?.trim();
    if (heading) {
      skipSection = ignoredHeading.test(heading);
      if (!skipSection) output.push({ lineNo, text: line });
      return;
    }
    if (!skipSection) output.push({ lineNo, text: line });
  });
  return output;
}

function collectMarkdownIssues(file) {
  const text = fs.readFileSync(file, "utf8");
  return markdownPublicLines(text).flatMap(({ lineNo, text: value }) => matchingPhrases(value).map((phrase) => ({
    source: "markdown",
    file: rel(file),
    line: lineNo,
    phrase,
    value: value.trim().slice(0, 180),
  })));
}

function writeReport(issues) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 15);
  const reportPath = path.join(reportsDir, `public-copy-gate-${date || "all"}-${stamp}.md`);
  const status = issues.length ? "failed" : "passed";
  const body = [
    "# Public Copy Gate Report",
    "",
    `- date: ${date || "all"}`,
    `- status: ${status}`,
    `- issue_count: ${issues.length}`,
    `- markdown_scan: ${includeMarkdown ? "on" : "off"}`,
    "",
    "## Issues",
    "",
    issues.length
      ? issues.map((issue) => {
        const where = issue.source === "markdown" ? `${issue.file}:${issue.line}` : issue.pointer;
        return `- ${where}｜${issue.phrase}｜${issue.value}`;
      }).join("\n")
      : "- none",
    "",
  ].join("\n");
  fs.writeFileSync(reportPath, body, "utf8");
  return { reportPath, status };
}

const site = readSiteContent();
const issues = [];
if (site.data) {
  const publicData = {
    signals: site.data.signals,
    daily: site.data.daily,
    brief: site.data.brief,
    trendReport: site.data.trendReport,
    contentIndex: scanHistory ? site.data.contentIndex : undefined,
  };
  collectJsonIssues(publicData, "$", issues);
}

if (includeMarkdown) {
  const files = [...new Set(markdownTargets.flatMap(listMarkdownFiles))].sort();
  for (const file of files) issues.push(...collectMarkdownIssues(file));
}

const { reportPath, status } = writeReport(issues);
console.log(JSON.stringify({
  ok: status === "passed",
  status,
  date: date || "all",
  issue_count: issues.length,
  report: rel(reportPath),
}, null, 2));

if (strict && issues.length) process.exit(1);
