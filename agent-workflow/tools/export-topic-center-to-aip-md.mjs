#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

function argValue(name, fallback = "") {
  const exact = `--${name}`;
  const prefix = `${exact}=`;
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(exact);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function text(value) {
  return value == null ? "" : String(value).trim();
}

function line(value) {
  return text(value).replace(/\s+/gu, " ");
}

function yamlString(value) {
  return `"${line(value).replace(/\\/gu, "\\\\").replace(/"/gu, '\\"')}"`;
}

function escapeMd(value) {
  return line(value).replace(/\|/gu, "\\|");
}

function normalizeDate(value) {
  const clean = text(value);
  return clean.match(/^\d{4}-\d{2}-\d{2}/u)?.[0] || "";
}

function latestDate(data) {
  const dates = [
    ...(Array.isArray(data.topics) ? data.topics.map((topic) => normalizeDate(topic.date)) : []),
    normalizeDate(data.meta?.date),
  ].filter(Boolean);
  return [...new Set(dates)].sort((a, b) => b.localeCompare(a))[0] || "";
}

function sourceItems(topic) {
  const items = [];
  if (Array.isArray(topic.rawMaterials)) items.push(...topic.rawMaterials);
  const inputs = topic.sourceInputs || {};
  for (const [group, list] of Object.entries(inputs)) {
    if (!Array.isArray(list)) continue;
    list.forEach((item) => items.push({ kind: group, ...item }));
  }
  const seen = new Set();
  return items.filter((item) => {
    const key = [item.url, item.id, item.title].map(text).join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return text(item.title) || text(item.url) || text(item.note);
  });
}

function formatSource(item) {
  const label = text(item.role || item.kind || "material");
  const title = text(item.title || item.note || item.url || "原始资料");
  const source = text(item.source);
  const url = text(item.url);
  const note = text(item.note);
  const linkedTitle = url ? `[${escapeMd(title)}](${url})` : escapeMd(title);
  const sourceText = source ? `（${escapeMd(source)}）` : "";
  const noteText = note && note !== title ? `：${escapeMd(note)}` : "";
  return `- ${escapeMd(label)}：${linkedTitle}${sourceText}${noteText}`;
}

function scoreLine(topic) {
  const grade = text(topic.grade);
  const score = Number.isFinite(Number(topic.score)) ? Number(topic.score) : "";
  return [grade, score].filter((item) => item !== "").join(" / ");
}

function formatTopic(topic, index) {
  const sources = sourceItems(topic);
  const angles = Array.isArray(topic.angles) ? topic.angles : [];
  const structure = Array.isArray(topic.writingStructure) ? topic.writingStructure : [];
  const parts = [
    `### ${index + 1}. ${line(topic.title || topic.spreadTitle || "未命名选题")}`,
    "",
    `- 类型：${line(topic.sourceName || topic.sourceId || "未分类")}`,
    `- 评分：${scoreLine(topic) || "-"}`,
    `- 优先级：${line(topic.priority || "-")}`,
    `- 适合人群：${line(topic.audience || "-")}`,
    `- 核心判断：${line(topic.core || "-")}`,
    `- 老板痛点：${line(topic.bossPain || "-")}`,
    `- 钱线：${line(topic.moneyLine || "-")}`,
    `- 行动提示：${line(topic.actionHint || "-")}`,
    `- 旧框架：${line(topic.oldFrame || "-")}`,
    `- 新框架：${line(topic.newFrame || "-")}`,
    `- 禁写：${line(topic.forbiddenFrame || "-")}`,
    `- 证据边界：${line(topic.evidenceBoundary || "-")}`,
    "",
  ];

  if (angles.length) {
    parts.push("#### 写作角度", "");
    angles.forEach((angle) => {
      parts.push(`- ${line(angle.title || "角度")}：${line(angle.note || "")}`);
    });
    parts.push("");
  }

  if (structure.length) {
    parts.push("#### 结构提示", "");
    structure.forEach((item) => parts.push(`- ${line(item)}`));
    parts.push("");
  }

  if (sources.length) {
    parts.push("#### 原始资料", "");
    sources.forEach((item) => parts.push(formatSource(item)));
    parts.push("");
  }

  return parts.join("\n");
}

function buildMarkdown(data, date, topics) {
  const meta = data.meta || {};
  const sourceCounts = Object.entries(meta.inputCounts || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join(" / ");
  return [
    "---",
    `title: ${yamlString(`${date} 每日选题`)}`,
    `date: ${date}`,
    "type: aip-daily-topic-pool",
    "status: draft",
    "source: WaveSight Topic Center",
    `topic_center_version: ${yamlString(meta.version || "")}`,
    `topic_count: ${topics.length}`,
    "tags:",
    "  - 选题库",
    "  - 每日选题",
    "  - 观澜AI",
    "---",
    "",
    `# ${date} 每日选题`,
    "",
    "> 面向老板的 AI 选题池。先看钱、人、流程、风险，再决定内容形态。",
    "",
    "## 今日概览",
    "",
    `- 选题日期：${date}`,
    `- 选题机制：${line(meta.ruleLabel || meta.rule || "老板决策型选题机制")}`,
    `- 数据版本：${line(meta.version || "-")}`,
    `- 生成时间：${line(meta.generatedAt || "-")}`,
    `- 输入素材：${sourceCounts || "-"}`,
    `- 选题数量：${topics.length}`,
    "- 运营后台： [选题中心](https://jerryfang2023-stack.github.io/AI-Radar/operations-console.html#topics)",
    "",
    "## 选题清单",
    "",
    ...topics.map((topic, index) => formatTopic(topic, index)),
  ].join("\n").replace(/\n{3,}/gu, "\n\n") + "\n";
}

function main() {
  const sourcePath = path.resolve(root, argValue("source", path.join("01-SiteV2", "site", "data", "topic-center.json")));
  const vaultRoot = path.resolve(argValue("vault-root", process.env.WAVESIGHT_VAULT_ROOT || path.join(root, "..")));
  const outDir = path.resolve(argValue("out-dir", path.join(vaultRoot, "04-AIP", "01-选题库")));
  const data = readJson(sourcePath);
  const date = normalizeDate(argValue("date", "")) || latestDate(data);
  if (!date) throw new Error("Cannot determine topic date from topic-center data.");

  const topics = (Array.isArray(data.topics) ? data.topics : [])
    .filter((topic) => normalizeDate(topic.date || data.meta?.date) === date)
    .sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));

  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${date}-每日选题.md`);
  fs.writeFileSync(outPath, buildMarkdown(data, date, topics), "utf8");

  console.log(JSON.stringify({
    ok: true,
    date,
    topic_count: topics.length,
    source: sourcePath,
    output: outPath,
  }, null, 2));
}

main();
