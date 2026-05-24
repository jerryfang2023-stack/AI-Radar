import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const input =
  args.get("input") || path.join(root, "agent-workflow", "reports", `${date}-manual-raw-items.json`);

const contentRoot = path.join(root, "01-SiteV2", "content");
const rawDir = path.join(contentRoot, "01-raw");
const originalDir = path.join(rawDir, "originals", date);
const rawFile = path.join(rawDir, `${date}-raw-candidates.md`);

const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/giu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function pad3(value) {
  return String(value).padStart(3, "0");
}

function loadJson(file) {
  const text = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  return JSON.parse(text);
}

const payload = loadJson(input);
const items = Array.isArray(payload.items) ? payload.items : [];
const acquisitionChannel = payload.acquisition_channel || "keyword-search";
const generatedAt = new Date().toISOString();

ensure(originalDir);

const header = [
  "---",
  `date: ${date}`,
  "stage: raw",
  "status: v2-source-router-manual-backfill",
  `raw_count: ${items.length}`,
  "aihot_count: 0",
  `keyword_search_count: ${items.length}`,
  "follow_builders_count: 0",
  "keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json",
  `generated_at: ${generatedAt}`,
  "---",
  "",
  `# ${date} Raw Candidates`,
  "",
  "说明：本文件由 `agent-workflow/tools/manual-backfill-raw-from-json.mjs` 生成，用于在 source-router fetch 失败时手工回填候选清单。",
  "注意：本清单的每条仅作为线索；进入 Pool、商业信号、变化短专题、趋势报告或今日观察前必须回看原始 URL 并重新判定 S/A/B/C/D。",
  "",
].join("\n");

const lines = [header];

items.forEach((item, index) => {
  const id = `R-${pad3(index + 1)}`;
  const title = item.title || `Untitled ${id}`;
  const url = item.url || "";
  const source = item.source || "manual-websearch";
  const sourceLevel = item.source_level || "B";
  const sourceType = item.source_type || "industry";
  const theme = item.theme || "uncategorized";
  const publishedAt = item.published_at || "unknown";
  const slug = slugify(`${title}`) || `item-${pad3(index + 1)}`;
  const originalFile = `r-${pad3(index + 1)}-${slug}.md`;
  const originalPath = path.join(originalDir, originalFile);

  const original = [
    "---",
    `id: ${id}`,
    `date: ${date}`,
    "stage: raw-original",
    `title: ${JSON.stringify(title)}`,
    `url: ${url}`,
    `source: ${source}`,
    `acquisition_channel: ${acquisitionChannel}`,
    `source_type: ${sourceType}`,
    `source_level: ${sourceLevel}`,
    `theme: ${theme}`,
    `published_at: ${publishedAt}`,
    `captured_at: ${generatedAt}`,
    "fetch_status: not-fetched",
    "note: |",
    "  本条为手工回填（source-router fetch 失败）。仅保留标题/URL/来源等级与主题线索；后续进入 Structured/Front 前需回看原始页面并补齐增量事实与证据链。",
    "---",
    "",
    `# ${title}`,
    "",
    `- url: ${url}`,
    `- source: ${source}`,
    `- source_level: ${sourceLevel}`,
    `- published_at: ${publishedAt}`,
    "",
  ].join("\n");

  fs.writeFileSync(originalPath, original, "utf8");

  lines.push(
    [
      `### ${id}｜${title}`,
      "",
      `- 原文档案：\`01-SiteV2/content/01-raw/originals/${date}/${originalFile}\``,
      `- 出处：manual-backfill｜${url}`,
      `- 采集通道：${acquisitionChannel}`,
      `- 来源类型：${sourceType}`,
      `- 来源等级：${sourceLevel}`,
      `- 发布时间：${publishedAt}`,
      `- 主题：${theme}`,
      `- 采集理由：手工回填（source-router fetch 失败），保留为候选线索，待二搜补证。`,
      "",
    ].join("\n")
  );
});

ensure(path.dirname(rawFile));
fs.writeFileSync(rawFile, lines.join("\n"), "utf8");

console.log(
  JSON.stringify(
    {
      date,
      input: path.relative(root, input).replace(/\\/g, "/"),
      rawFile: path.relative(root, rawFile).replace(/\\/g, "/"),
      originalsDir: path.relative(root, originalDir).replace(/\\/g, "/"),
      raw_count: items.length,
    },
    null,
    2
  )
);
