import fs from "node:fs";
import path from "node:path";

const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const root = process.cwd();
const date = args.get("date") || new Date().toISOString().slice(0, 10);

const contentRoot = path.join(root, "01-SiteV2", "content");
const originalDir = path.join(contentRoot, "01-raw", "originals", date);
const pointsDir = path.join(contentRoot, "07-points");
const outputFile = path.join(pointsDir, `${date}-builders-viewpoints.md`);

const ensure = (dir) => fs.mkdirSync(dir, { recursive: true });
const readText = (file) => fs.readFileSync(file, "utf8");
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

function withoutFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]*?---\s*/u, "");
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---/u);
  if (!match) return {};
  const lines = match[1].split(/\r?\n/u);
  const obj = {};
  for (const line of lines) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/u);
    if (!m) continue;
    obj[m[1]] = m[2];
  }
  return obj;
}

function normalizeDay(dateValue = "") {
  const match = String(dateValue).match(/\d{4}-\d{2}-\d{2}/u);
  return match ? match[0] : "unknown";
}

function firstNonEmptyParagraph(text = "") {
  const blocks = String(text)
    .split(/\n{2,}/u)
    .map((item) => item.trim())
    .filter(Boolean);
  const cleaned = blocks.find((block) => !/^#{1,6}\s+/u.test(block) && !/^---/u.test(block));
  return cleaned || blocks[0] || "";
}

function main() {
  if (!fs.existsSync(originalDir)) {
    console.error(`originals not found: ${rel(originalDir)}`);
    process.exit(1);
  }

  const originals = fs
    .readdirSync(originalDir)
    .filter((name) => name.endsWith(".md"))
    .map((name) => path.join(originalDir, name))
    .map((file) => ({ file, text: readText(file) }))
    .map(({ file, text }) => {
      const fm = parseFrontmatter(text);
      const body = withoutFrontmatter(text);
      return {
        file,
        raw_id: fm.raw_id || "",
        acquisition_channel: fm.acquisition_channel || "",
        source_url: fm.source_url || "",
        source_name: fm.source_name || "",
        source_level: fm.source_level || "",
        theme: fm.theme || "",
        captured_at: fm.captured_at || "",
        original_date: normalizeDay(fm.captured_at || ""),
        title: body.match(/^#\s+(.+)$/mu)?.[1]?.trim() || fm.source_name || path.basename(file),
        excerpt: firstNonEmptyParagraph(body.replace(/^#\s+.+$/mu, "").trim()),
      };
    })
    .filter((item) => item.acquisition_channel === "follow-builders");

  ensure(pointsDir);

  const lines = [
    "---",
    `date: ${date}`,
    "stage: builders-viewpoints",
    "status: v2-source-router-collected",
    `builder_items_count: ${originals.length}`,
    `generated_at: ${new Date().toISOString()}`,
    "---",
    "",
    `# ${date} Builders Viewpoints (All)`,
    "",
    "说明：本文件从 `01-raw/originals/<date>/` 中回收 follow-builders 的全量条目，作为前沿观点/实践线索沉淀。",
    "注意：社媒/X 观点为观点线索，不作为事实主证据；进入商业信号、变化短专题、趋势报告或今日观察的事实结论仍需补足 S/A/B 原始来源。",
    "",
  ];

  originals.forEach((item, index) => {
    const id = `BP-${date.replaceAll("-", "")}-${String(index + 1).padStart(2, "0")}`;
    lines.push(
      `## ${id}｜${item.title}`,
      "",
      `- stable_id: \`${id}\``,
      "- source_path: `follow-builders`",
      `- source_url: \`${item.source_url || "no-url"}\``,
      `- source_name: ${item.source_name || "follow-builders"}`,
      `- original_date: ${item.original_date}`,
      `- captured_at: ${item.captured_at || "unknown"}`,
      item.theme ? `- theme: ${item.theme}` : "- theme: unknown",
      item.raw_id ? `- raw_ref: ${item.raw_id}` : "- raw_ref: unknown",
      "",
      item.excerpt ? `原始观点/摘要：${item.excerpt}` : "原始观点/摘要：本轮原文档案未保存可用文本摘要。",
      ""
    );
  });

  fs.writeFileSync(outputFile, `${lines.join("\n")}\n`, "utf8");
  console.log(`generated: ${rel(outputFile)} (${originals.length} items)`);
}

main();
