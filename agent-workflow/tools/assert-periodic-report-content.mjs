#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const kind = args.get("kind") || "weekly";
const date = args.get("date") || "";
const windowStart = args.get("window-start") || "";
const windowEnd = args.get("window-end") || "";
const fixtureMode = args.get("fixtures") === "true";

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function frontmatter(text = "") {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u);
  if (!match) return {};
  return Object.fromEntries(match[1].split(/\r?\n/u).map((line) => {
    const hit = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/u);
    return hit ? [hit[1], hit[2].replace(/^['"]|['"]$/gu, "").trim()] : null;
  }).filter(Boolean));
}

function numberedSections(text = "") {
  return new Set([...text.matchAll(/^##\s+([0-9]+)[.\u3001]/gmu)].map((match) => Number(match[1])));
}

function hasPlaceholder(text = "") {
  return /(?:TODO|TBD|\u5f85\u8865\u5145|\u5f85\u751f\u6210|placeholder|lorem ipsum)/iu.test(text);
}

function checkWeekly(content, archive, options) {
  const failures = [];
  const fm = frontmatter(content);
  const sections = numberedSections(content);
  if (!content) failures.push("weekly content source is missing");
  if (!archive) failures.push("weekly workflow archive is missing");
  if (fm.content_type !== "weekly-report") failures.push("weekly content_type must be weekly-report");
  if (fm.date !== options.date) failures.push(`weekly date must be ${options.date}`);
  if (fm.window !== `${options.windowStart} to ${options.windowEnd}`) failures.push("weekly window does not match the previous complete Monday-Sunday window");
  if (!/^\d{4}-W\d{2}$/u.test(fm.week || "")) failures.push("weekly ISO week is missing");
  if (!fm.slug) failures.push("weekly slug is missing");
  if (fm.status !== "draft") failures.push("weekly status must be draft before page acceptance");
  if (fm.model_provider !== "deepseek" || !fm.model) failures.push("weekly DeepSeek model provenance is missing");
  for (let index = 0; index <= 8; index += 1) if (!sections.has(index)) failures.push(`weekly section ${index} is missing`);
  for (const label of ["Signals", "Opinions", "Community"]) {
    if (!new RegExp(`${label}[^\\d]{0,80}\\d+`, "iu").test(content)) failures.push(`${label} exact count is missing`);
  }
  if (!/(?:100\s*\u5206|\/\s*100|100-point)/iu.test(content)) failures.push("weekly opportunity scoring evidence is missing");
  if (!/\[(?:E|O|C):[^\]]+\]/u.test(content)) failures.push("weekly source ID citations are missing");
  if (hasPlaceholder(content) || hasPlaceholder(archive)) failures.push("weekly report contains placeholders");
  return { ok: failures.length === 0, failures, metadata: fm, sections: [...sections].sort((a, b) => a - b) };
}

function checkMonthly(content, options) {
  const failures = [];
  const fm = frontmatter(content);
  const sections = numberedSections(content);
  if (!content) failures.push("monthly content source is missing");
  if (fm.content_type !== "monthly-report") failures.push("monthly content_type must be monthly-report");
  if (fm.date !== options.date) failures.push(`monthly report date must be ${options.date}`);
  if (fm.month !== options.windowStart.slice(0, 7)) failures.push("monthly report month does not match the previous calendar month");
  if (fm.window !== `${options.windowStart} to ${options.windowEnd}`) failures.push("monthly window does not match the previous calendar month");
  if (!fm.slug) failures.push("monthly slug is missing");
  if (fm.status !== "draft") failures.push("monthly status must be draft before page acceptance");
  if (fm.model_provider !== "deepseek" || !fm.model) failures.push("monthly DeepSeek model provenance is missing");
  if (sections.size < 8) failures.push("monthly report must contain at least eight numbered sections");
  const requiredConcepts = [
    ["data boundary", /\u6570\u636e\u8fb9\u754c|\u6570\u636e\u8303\u56f4|data boundary/iu],
    ["structure judgment", /\u7ed3\u6784\u5224\u65ad|\u7ed3\u6784\u53d8\u5316|structure/iu],
    ["trend adjudication", /\u8d8b\u52bf\u88c1\u51b3|\u8d8b\u52bf\u5224\u65ad|trend adjudication/iu],
    ["opportunity map", /\u673a\u4f1a\u5730\u56fe|opportunity map/iu],
    ["contradictions", /\u77db\u76fe|\u53cd\u8bc1|contradiction/iu],
    ["next-month verification", /\u4e0b\u6708\u9a8c\u8bc1|next[- ]month verification/iu],
  ];
  for (const [label, pattern] of requiredConcepts) if (!pattern.test(content)) failures.push(`monthly ${label} section is missing`);
  if (hasPlaceholder(content)) failures.push("monthly report contains placeholders");
  if (!/\[(?:E|O|C):[^\]]+\]/u.test(content)) failures.push("monthly source ID citations are missing");
  return { ok: failures.length === 0, failures, metadata: fm, sections: [...sections].sort((a, b) => a - b) };
}

export function evaluatePeriodicContent(input) {
  if (input.kind === "weekly") return checkWeekly(input.content, input.archive, input);
  if (input.kind === "monthly") return checkMonthly(input.content, input);
  return { ok: false, failures: [`unsupported report kind: ${input.kind}`], metadata: {}, sections: [] };
}

function pathsForInput() {
  if (kind === "weekly") {
    return {
      content: path.join(root, "01-SiteV2", "content", "08-report", `${date}--weekly-report--ai-business-change-radar.md`),
      archive: path.join(root, "agent-workflow", "reports", `${date}-weekly-ai-business-change-radar.md`),
    };
  }
  return {
    content: path.join(root, "01-SiteV2", "content", "08-report", "monthly", `${date}--monthly-report--ai-business-structure-and-opportunity.md`),
    archive: "",
  };
}

function writeReport(result, inputPaths) {
  const reports = path.join(root, "agent-workflow", "reports");
  fs.mkdirSync(reports, { recursive: true });
  const base = `${date}-${kind}-content-gate`;
  const jsonPath = path.join(reports, `${base}.json`);
  const mdPath = path.join(reports, `${base}.md`);
  const payload = {
    ...result,
    kind,
    date,
    window: { start: windowStart, end: windowEnd },
    generated_at: new Date().toISOString(),
    content_path: path.relative(root, inputPaths.content).replace(/\\/gu, "/"),
    archive_path: inputPaths.archive ? path.relative(root, inputPaths.archive).replace(/\\/gu, "/") : "",
  };
  const md = [
    `# ${kind === "weekly" ? "Weekly" : "Monthly"} Report Content Gate - ${date}`,
    "",
    `- status: ${result.ok ? "passed" : "failed"}`,
    `- window: ${windowStart} to ${windowEnd}`,
    `- content: ${payload.content_path}`,
    "",
    "## Failures",
    "",
    ...(result.failures.length ? result.failures.map((item) => `- ${item}`) : ["- none"]),
    "",
  ].join("\n");
  fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, md, "utf8");
  return { jsonPath, mdPath };
}

function runFixtures() {
  const weeklyFrontmatter = [
    "---", "title: Weekly", "date: 2026-07-13", "week: 2026-W28",
    "window: 2026-07-06 to 2026-07-12", "content_type: weekly-report", "slug: weekly-2026-w28", "status: draft", "model_provider: deepseek", "model: deepseek-v4-pro", "---",
  ].join("\n");
  const weeklyBody = `${weeklyFrontmatter}\n${Array.from({ length: 9 }, (_, index) => `## ${index}. Section ${index}`).join("\n")}\nSignals: 10\nOpinions: 3\nCommunity: 4\nScore: 82 / 100 [E:EVT-test]`;
  const weekly = evaluatePeriodicContent({ kind: "weekly", content: weeklyBody, archive: weeklyBody, date: "2026-07-13", windowStart: "2026-07-06", windowEnd: "2026-07-12" });
  const monthlyBody = [
    "---", "title: Monthly", "date: 2026-06-30", "month: 2026-06",
    "window: 2026-06-01 to 2026-06-30", "content_type: monthly-report", "slug: monthly-2026-06", "status: draft", "model_provider: deepseek", "model: deepseek-v4-pro", "---",
    ...Array.from({ length: 9 }, (_, index) => `## ${index + 1}. Section ${index + 1}`),
    "\u6570\u636e\u8fb9\u754c \u7ed3\u6784\u5224\u65ad \u8d8b\u52bf\u88c1\u51b3 \u673a\u4f1a\u5730\u56fe \u5173\u952e\u77db\u76fe \u4e0b\u6708\u9a8c\u8bc1 [E:EVT-test]",
  ].join("\n");
  const monthly = evaluatePeriodicContent({ kind: "monthly", content: monthlyBody, date: "2026-06-30", windowStart: "2026-06-01", windowEnd: "2026-06-30" });
  if (!weekly.ok || !monthly.ok) throw new Error(`periodic content fixtures failed: ${JSON.stringify({ weekly, monthly })}`);
  console.log(JSON.stringify({ ok: true, fixture: "periodic-report-content" }, null, 2));
}

function main() {
  if (fixtureMode) return runFixtures();
  if (!new Set(["weekly", "monthly"]).has(kind) || !date || !windowStart || !windowEnd) {
    throw new Error("kind, date, window-start, and window-end are required");
  }
  const inputPaths = pathsForInput();
  const result = evaluatePeriodicContent({
    kind,
    date,
    windowStart,
    windowEnd,
    content: read(inputPaths.content),
    archive: inputPaths.archive ? read(inputPaths.archive) : "",
  });
  const report = writeReport(result, inputPaths);
  console.log(JSON.stringify({
    ok: result.ok,
    kind,
    date,
    report: path.relative(root, report.jsonPath).replace(/\\/gu, "/"),
    failures: result.failures,
  }, null, 2));
  if (!result.ok) process.exit(1);
}

main();
