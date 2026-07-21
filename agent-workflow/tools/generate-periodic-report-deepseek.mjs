#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepSeekJsonCompletion, deepSeekModels } from "./deepseek-translation-client.mjs";
import { periodicReportTitleProblems, periodicReportTitlePromptRules } from "./periodic-report-title.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const kind = args.get("kind") || "weekly";
const date = args.get("date") || "";
const windowStart = args.get("window-start") || "";
const windowEnd = args.get("window-end") || "";
const ACCEPTED_EVENT_STATES = new Set(["verified", "partial"]);

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
    .filter((item) => ACCEPTED_EVENT_STATES.has(item.publication_status))
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
    ? ["数据边界", "一句话结论", "趋势热力图 Top 5", "三条趋势链", "行业、角色与工作流影响热力图", "机会卡", "反共识判断", "下周观察清单", "分角色行动结论"]
    : ["数据边界", "本月核心结论", "结构判断", "趋势裁决", "机会地图", "关键矛盾与反证", "下月验证清单", "结论"];
  return [
    "你是 WaveSight AI 行业研究报告编辑。只可使用 EVIDENCE_MANIFEST，不得补充外部事实。",
    "商业事件是事实证据；一线观点和社群材料只能分别作为观点与社群观察，不得写成事实。",
    "每个具体判断末尾必须引用至少一个原始 ID，格式为 [E:事件ID]、[O:观点ID] 或 [C:社群ID]。事件 ID 必须保留清单中的完整 EV- 前缀，例如 [E:EV-abc123]。不得伪造 ID。",
    "没有足够交叉证据时明确写证据不足。机会评分使用 100 分制并说明它是下游研究判断，不进入 V4 事实表。",
    ...(kind === "weekly" ? [
      "周报硬规则：第 1 节必须用 E/O/C 三类证据互证；第 2 节必须列出按变化速度排序的 Top 5，并标明 ↑/→/↓；第 3 节必须恰好三条趋势链，每条都依次写技术能力、产品形态、用户行为、商业模式、创业机会五步，并至少引用 2 个 E、1 个 O、1 个 C。",
      "第 5 节只写 2–3 张机会卡；每张必须至少引用 1 个 C 类社群需求信号，并包含目标用户、触发信号、当前替代、供给缺口、MVP、变现方式、风险，以及痛点强度/25、支付意愿/20、供给缺口/20、时机变化/15、获客路径/10、团队可行性/10、风险扣分/20 的逐项评分与总分。",
      "先按证据阈值选主题：如果某个趋势链或机会卡找不到足够的 E/O/C 清单项，必须更换主题或明确不写，不能用缺证据的主题占位，也不能引用清单外 ID。返回前逐条核对三条趋势链和每张机会卡。",
      "第 6 节必须点名被挑战的主流观点，并引用至少两类证据；第 8 节必须分别给企业老板、创业者、内容团队、技术团队、观澜 AI 五类角色不同的行动。每个具体判断都要就近带证据 ID。",
    ] : []),
    `标题规则：\n${periodicReportTitlePromptRules}`,
    `报告类型：${kind}；窗口：${windowStart} to ${windowEnd}；精确计数：${JSON.stringify(manifest.counts)}。`,
    `返回 JSON：{"title":string,"sections":[${sectionNames.map((name, index) => `{"number":${index},"title":"${name}","content":string}`).join(",")}]}`,
    "content 使用简体中文 Markdown，可包含短列表；不要返回 frontmatter，不要返回代码围栏。",
    `EVIDENCE_MANIFEST:\n${JSON.stringify({ ...manifest, events: manifest.events.slice(0, 180), opinions: manifest.opinions.slice(0, 100), community: manifest.community.slice(0, 100) })}`,
  ].join("\n\n");
}

function normalizeEvidenceReferences(payload, allowedIds) {
  for (const section of payload?.sections || []) {
    section.content = String(section.content || "").replace(/\[E:([^\]]+)\]/gu, (citation, id) => {
      if (allowedIds.has(id)) return citation;
      const canonicalId = `EV-${id}`;
      return allowedIds.has(canonicalId) ? `[E:${canonicalId}]` : citation;
    });
  }
}

function citationCount(text, kind) {
  return [...String(text || "").matchAll(new RegExp(`\\[${kind}:[^\\]]+\\]`, "gu"))].length;
}

function validateWeeklySections(payload) {
  const problems = [];
  const sections = Object.fromEntries((payload?.sections || []).map((section) => [section.number, String(section.content || "") ]));
  for (const kind of ["E", "O", "C"]) if (citationCount(sections[1], kind) < 1) problems.push(`section_1_missing_${kind}_evidence`);
  if ([...sections[2].matchAll(/[↑→↓]/gu)].length < 5) problems.push("section_2_top5_or_direction_missing");
  for (const label of ["技术能力", "产品形态", "用户行为", "商业模式", "创业机会"]) if (!sections[3].includes(label)) problems.push(`section_3_missing_${label}`);
  const chains = sections[3].split(/(?=\*\*趋势链[一二三1-3])/u).filter((item) => /^\*\*趋势链/u.test(item.trim()));
  if (chains.length !== 3) problems.push("section_3_requires_exactly_three_chains");
  chains.forEach((chain, index) => {
    if (citationCount(chain, "E") < 2 || citationCount(chain, "O") < 1 || citationCount(chain, "C") < 1) problems.push(`section_3_chain_${index + 1}_cross_evidence_threshold_missing`);
  });
  const opportunities = sections[5].split(/(?=\*\*机会卡[一二三1-3])/u).filter((item) => /^\*\*机会卡/u.test(item.trim()));
  const opportunityCount = opportunities.length;
  if (opportunityCount < 2 || opportunityCount > 3) problems.push("section_5_requires_2_to_3_opportunity_cards");
  opportunities.forEach((opportunity, index) => {
    if (citationCount(opportunity, "C") < 1) problems.push(`section_5_opportunity_${index + 1}_community_evidence_missing`);
  });
  for (const label of ["目标用户", "触发信号", "当前替代", "供给缺口", "MVP", "变现", "风险", "痛点强度", "支付意愿", "时机变化", "获客路径", "团队可行性", "风险扣分", "总分"]) if (!sections[5].includes(label)) problems.push(`section_5_missing_${label}`);
  if (!/主流(?:观点|叙事|认知)/u.test(sections[6])) problems.push("section_6_mainstream_view_missing");
  if (["E", "O", "C"].filter((kind) => citationCount(sections[6], kind) > 0).length < 2) problems.push("section_6_requires_two_evidence_types");
  for (const label of ["企业老板", "创业者", "内容团队", "技术团队", "观澜 AI"]) if (!sections[8].includes(label)) problems.push(`section_8_missing_${label}`);
  return problems;
}

function validateReport(payload, allowedIds, sectionCount) {
  const problems = [];
  normalizeEvidenceReferences(payload, allowedIds);
  if (!payload?.title || !Array.isArray(payload?.sections) || payload.sections.length !== sectionCount) problems.push("report_shape_invalid");
  problems.push(...periodicReportTitleProblems(payload?.title));
  for (let index = 0; index < sectionCount; index += 1) {
    const section = payload?.sections?.[index];
    if (section?.number !== index || !section?.title || !section?.content) problems.push(`section_${index}_invalid`);
  }
  const references = [...JSON.stringify(payload).matchAll(/\[(?:E|O|C):([^\]]+)\]/gu)].map((match) => match[1]);
  for (const id of references) if (!allowedIds.has(id)) problems.push(`unknown_evidence_id:${id}`);
  if (!references.length) problems.push("missing_evidence_references");
  if (kind === "weekly") problems.push(...validateWeeklySections(payload));
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
