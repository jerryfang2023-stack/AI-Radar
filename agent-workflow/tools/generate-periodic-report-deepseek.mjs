#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepSeekJsonCompletion, deepSeekModels } from "./deepseek-translation-client.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const kind = args.get("kind") || "weekly";
const date = args.get("date") || "";
const windowStart = args.get("window-start") || "";
const windowEnd = args.get("window-end") || "";

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return fallback; }
}

function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value, "utf8");
}

function datesBetween(start, end) {
  const dates = [];
  for (let value = new Date(`${start}T00:00:00Z`); value <= new Date(`${end}T00:00:00Z`); value.setUTCDate(value.getUTCDate() + 1)) dates.push(value.toISOString().slice(0, 10));
  return dates;
}

function compact(value = "", limit = 360) {
  return String(value || "").replace(/\s+/gu, " ").trim().slice(0, limit);
}

function evidenceManifest() {
  const days = datesBetween(windowStart, windowEnd);
  const events = days.flatMap((day) => (readJson(path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", day, "canonical-events.json"), []) || []))
    .filter((item) => item.publication_status === "published")
    .map((item) => ({ id: item.event_id, date: item.event_time || item.disclosed_at || "", title: item.display_title_zh || `${item.action} ${item.object}`, type: item.event_type, source_refs: item.source_refs }));
  const viewpointData = readJson(path.join(root, "01-SiteV2", "site", "data", "first-line-viewpoints-v4.json"), {});
  const opinions = (viewpointData.remarks || []).filter((item) => item.date >= windowStart && item.date <= windowEnd && item.publicationStatus === "published")
    .map((item) => ({ id: item.id, date: item.date, name: item.name, text: compact(item.translation || item.text), url: item.url }));
  const community = [...new Map(days.flatMap((day) => (readJson(path.join(root, "01-SiteV2", "site", "data", "community-intelligence-daily", `${day}.json`), {})?.items || []))
    .map((item) => [item.id, { id: item.id, date: item.publishedAt || "", title: compact(item.title), summary: compact(item.summary), url: item.url }])).values()];
  return { counts: { Signals: events.length, Opinions: opinions.length, Community: community.length }, events, opinions, community };
}

function isoWeek(dateText) {
  const value = new Date(`${dateText}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 4 - (value.getUTCDay() || 7));
  const first = new Date(Date.UTC(value.getUTCFullYear(), 0, 1));
  return `${value.getUTCFullYear()}-W${String(Math.ceil((((value - first) / 86400000) + 1) / 7)).padStart(2, "0")}`;
}

function prompt(manifest) {
  const sectionNames = kind === "weekly"
    ? ["数据边界", "一句话结论", "本周结构变化", "证据链", "影响热区", "机会地图", "反证与不确定性", "下周观察清单", "结论"]
    : ["数据边界", "本月核心结论", "结构判断", "趋势裁决", "机会地图", "关键矛盾与反证", "下月验证清单", "结论"];
  return [
    "你是 WaveSight AI 行业研究报告编辑。只可使用 EVIDENCE_MANIFEST，不得补充外部事实。",
    "商业事件是事实证据；一线观点和社群材料只能分别作为观点与社群观察，不得写成事实。",
    "每个具体判断末尾必须引用至少一个原始 ID，格式为 [E:事件ID]、[O:观点ID] 或 [C:社群ID]。不得伪造 ID。",
    "没有足够交叉证据时明确写证据不足。机会评分使用 100 分制并说明它是下游研究判断，不进入 V4 事实表。",
    `报告类型：${kind}；窗口：${windowStart} to ${windowEnd}；精确计数：${JSON.stringify(manifest.counts)}。`,
    `返回 JSON：{"title":string,"sections":[${sectionNames.map((name, index) => `{"number":${index},"title":"${name}","content":string}`).join(",")}]}`,
    "content 使用简体中文 Markdown，可包含短列表；不要返回 frontmatter，不要返回代码围栏。",
    `EVIDENCE_MANIFEST:\n${JSON.stringify({ ...manifest, events: manifest.events.slice(0, 180), opinions: manifest.opinions.slice(0, 100), community: manifest.community.slice(0, 100) })}`,
  ].join("\n\n");
}

function validateReport(payload, allowedIds, sectionCount) {
  const problems = [];
  if (!payload?.title || !Array.isArray(payload?.sections) || payload.sections.length !== sectionCount) problems.push("report_shape_invalid");
  for (let index = 0; index < sectionCount; index += 1) {
    const section = payload?.sections?.[index];
    if (section?.number !== index || !section?.title || !section?.content) problems.push(`section_${index}_invalid`);
  }
  const references = [...JSON.stringify(payload).matchAll(/\[(?:E|O|C):([^\]]+)\]/gu)].map((match) => match[1]);
  for (const id of references) if (!allowedIds.has(id)) problems.push(`unknown_evidence_id:${id}`);
  if (!references.length) problems.push("missing_evidence_references");
  return [...new Set(problems)];
}

async function main() {
  if (!new Set(["weekly", "monthly"]).has(kind) || !date || !windowStart || !windowEnd) throw new Error("kind, date, window-start, and window-end are required");
  const manifest = evidenceManifest();
  const allowedIds = new Set([...manifest.events, ...manifest.opinions, ...manifest.community].map((item) => item.id));
  const sectionCount = kind === "weekly" ? 9 : 8;
  const result = await deepSeekJsonCompletion({
    model: deepSeekModels().pro,
    messages: [{ role: "user", content: prompt(manifest) }],
    maxTokens: 7000,
    timeoutMs: 180000,
    validate: (payload) => validateReport(payload, allowedIds, sectionCount),
  });
  const frontmatter = kind === "weekly"
    ? ["---", `title: "${result.payload.title.replaceAll('"', "'")}"`, `date: ${date}`, `week: ${isoWeek(windowEnd)}`, `window: ${windowStart} to ${windowEnd}`, "content_type: weekly-report", `slug: weekly-${isoWeek(windowEnd).toLowerCase()}`, "status: draft", "model_provider: deepseek", `model: ${result.model}`, "---"]
    : ["---", `title: "${result.payload.title.replaceAll('"', "'")}"`, `date: ${date}`, `month: ${windowStart.slice(0, 7)}`, `window: ${windowStart} to ${windowEnd}`, "content_type: monthly-report", `slug: monthly-${windowStart.slice(0, 7)}`, "status: draft", "model_provider: deepseek", `model: ${result.model}`, "---"];
  const counts = `Signals: ${manifest.counts.Signals} | Opinions: ${manifest.counts.Opinions} | Community: ${manifest.counts.Community}`;
  const body = `${frontmatter.join("\n")}\n\n${counts}\n\n${result.payload.sections.map((section) => `## ${section.number}. ${section.title}\n\n${section.content}`).join("\n\n")}\n`;
  const contentFile = kind === "weekly"
    ? path.join(root, "01-SiteV2", "content", "08-report", `${date}--weekly-report--ai-business-change-radar.md`)
    : path.join(root, "01-SiteV2", "content", "08-report", "monthly", `${date}--monthly-report--ai-business-structure-and-opportunity.md`);
  write(contentFile, body);
  if (kind === "weekly") write(path.join(root, "agent-workflow", "reports", `${date}-weekly-ai-business-change-radar.md`), body);
  const provenance = { schema_version: "PERIODIC-REPORT-MODEL-V1.0", kind, date, window: { start: windowStart, end: windowEnd }, provider: result.provider, model: result.model, generated_at: result.generatedAt, counts: manifest.counts, evidence_ids: [...allowedIds] };
  write(path.join(root, "agent-workflow", "reports", `${date}-${kind}-model-provenance.json`), `${JSON.stringify(provenance, null, 2)}\n`);
  console.log(JSON.stringify({ ok: true, kind, date, content: path.relative(root, contentFile).replace(/\\/gu, "/"), counts: manifest.counts }, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error?.stack || error?.message || String(error)); process.exit(1); });
}
