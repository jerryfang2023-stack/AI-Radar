import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, "..");
const defaultInput = path.resolve(projectRoot, "..", "01-SiteV2", "content", "12-applications", "industry-reports");
const dataDir = path.resolve(projectRoot, "miniprogram", "data");

const text = (value) => String(value ?? "").trim();
const shorten = (value, limit = 150) => {
  const normalized = text(value).replace(/\s+/gu, " ");
  return normalized.length > limit ? `${normalized.slice(0, limit - 1)}…` : normalized;
};

function stripQuotes(value) {
  return text(value).replace(/^(?:"|')|(?:"|')$/gu, "");
}

export function cleanInline(value) {
  return text(value)
    .replace(/\[(?:E|O|C):[^\]]+\]/gu, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/gu, "$1")
    .replace(/\*\*([^*]+)\*\*/gu, "$1")
    .replace(/__([^_]+)__/gu, "$1")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/所有判断均严格引用清单内 ID，未补充外部事实。/gu, "所有判断均受本期证据清单约束，未补充外部事实。")
    .replace(/所有具体判断均标注原始证据 ID。/gu, "所有具体判断均来自报告证据清单。")
    .replace(/\s+([，。；：！？、])/gu, "$1")
    .replace(/\s{2,}/gu, " ")
    .trim();
}

export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) return { attributes: {}, body: markdown };
  const attributes = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    attributes[line.slice(0, separator).trim()] = stripQuotes(line.slice(separator + 1));
  }
  return { attributes, body: markdown.slice(match[0].length) };
}

export function parseBlocks(markdown) {
  const blocks = [];
  let paragraph = [];
  const flush = () => {
    const value = cleanInline(paragraph.join(" "));
    if (value) blocks.push({ type: "paragraph", text: value });
    paragraph = [];
  };

  for (const rawLine of markdown.split(/\r?\n/u)) {
    const line = rawLine.trim();
    if (!line) { flush(); continue; }
    if (/^Signals:\s*\d+/iu.test(line)) { flush(); continue; }
    if (/^\|?\s*:?-{3,}/u.test(line)) { flush(); continue; }
    const heading = line.match(/^(#{2,4})\s+(.+)$/u);
    if (heading) {
      flush();
      blocks.push({ type: heading[1].length === 2 ? "heading" : "subheading", text: cleanInline(heading[2]) });
      continue;
    }
    const quote = line.match(/^>\s*(.+)$/u);
    if (quote) { flush(); blocks.push({ type: "quote", text: cleanInline(quote[1]) }); continue; }
    const listItem = line.match(/^(?:[-*]|\d+[.)])\s+(.+)$/u);
    if (listItem) { flush(); blocks.push({ type: "list", text: cleanInline(listItem[1]) }); continue; }
    if (/^\|.*\|$/u.test(line)) {
      flush();
      const cells = line.split("|").map(cleanInline).filter(Boolean);
      if (cells.length) blocks.push({ type: "table", text: cells.join(" · ") });
      continue;
    }
    paragraph.push(line);
  }
  flush();
  return blocks.map((block, index) => ({ ...block, id: `block_${index}` }));
}

function evidenceCounts(body) {
  const match = body.match(/Signals:\s*(\d+)\s*\|\s*Opinions:\s*(\d+)\s*\|\s*Community:\s*(\d+)/iu);
  return match ? { signals: Number(match[1]), opinions: Number(match[2]), community: Number(match[3]) } : null;
}

function summaryFrom(blocks) {
  const preferred = blocks.findIndex((block) => block.type === "heading" && /一句话结论|本月核心结论|核心结论/u.test(block.text));
  const start = preferred >= 0 ? preferred + 1 : 0;
  const match = blocks.slice(start).find((block) => block.type === "paragraph" && !/本期报告基于|本报告基于/u.test(block.text));
  return shorten(match?.text || "打开报告查看完整研究结论。", 150);
}

export function projectReport(file, type) {
  const markdown = fs.readFileSync(file, "utf8");
  const { attributes, body } = parseFrontmatter(markdown);
  if (attributes.status !== "published") return null;
  const blocks = parseBlocks(body);
  const id = `${type}-${attributes.date}`;
  const issue = type === "weekly" ? text(attributes.week) : text(attributes.month);
  const counts = evidenceCounts(body);
  const summary = {
    id,
    type,
    typeLabel: type === "weekly" ? "周报" : "月报",
    title: text(attributes.title),
    date: text(attributes.date),
    dateShort: text(attributes.date).slice(5).replace("-", "."),
    issue,
    window: text(attributes.window),
    summary: summaryFrom(blocks),
    counts,
    sectionCount: blocks.filter((block) => block.type === "heading").length,
  };
  return { summary, detail: { ...summary, blocks } };
}

export function projectReportData(inputDir = defaultInput) {
  const weeklyFiles = fs.readdirSync(inputDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}--weekly-report--.+\.md$/u.test(name))
    .map((name) => path.join(inputDir, name));
  const monthlyDir = path.join(inputDir, "monthly");
  const monthlyFiles = fs.readdirSync(monthlyDir)
    .filter((name) => /^\d{4}-\d{2}-\d{2}--monthly-report--.+\.md$/u.test(name) && !name.includes("-merged"))
    .map((name) => path.join(monthlyDir, name));
  const projected = [
    ...weeklyFiles.map((file) => projectReport(file, "weekly")),
    ...monthlyFiles.map((file) => projectReport(file, "monthly")),
  ].filter(Boolean).sort((a, b) => b.summary.date.localeCompare(a.summary.date));
  const reports = projected.map((item) => item.summary);
  return {
    index: {
      meta: {
        schemaVersion: "GUANLAN-MINIPROGRAM-REPORTS-V1.0",
        reportVersion: "REPORTS-V1.3.0-funding-portal",
        latestDate: reports[0]?.date || "",
        reportCount: reports.length,
        weeklyCount: reports.filter((item) => item.type === "weekly").length,
        monthlyCount: reports.filter((item) => item.type === "monthly").length,
      },
      reports,
    },
    details: Object.fromEntries(projected.map((item) => [item.detail.id, item.detail])),
  };
}

function writeModule(file, value) {
  fs.writeFileSync(file, `// Generated by scripts/build-report-data.mjs. Do not edit.\nmodule.exports = ${JSON.stringify(value)};\n`, "utf8");
}

export function build(inputDir = defaultInput) {
  const projected = projectReportData(inputDir);
  fs.mkdirSync(dataDir, { recursive: true });
  writeModule(path.join(dataDir, "report-index.js"), projected.index);
  writeModule(path.join(dataDir, "report-details.js"), projected.details);
  return projected;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const input = process.argv[2] ? path.resolve(process.argv[2]) : defaultInput;
  const result = build(input);
  console.log(JSON.stringify({
    reports: result.index.meta.reportCount,
    weekly: result.index.meta.weeklyCount,
    monthly: result.index.meta.monthlyCount,
    latestDate: result.index.meta.latestDate,
    output: dataDir,
  }, null, 2));
}
