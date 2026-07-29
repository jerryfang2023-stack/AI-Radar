#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildOpportunityEvidenceData } from "./opportunity-evidence-v2.mjs";
import { deepSeekJsonCompletion, deepSeekModels } from "./deepseek-translation-client.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const output = path.resolve(args.get("output")
  || path.join(root, "agent-workflow/product/opportunity-direction-card-candidates.json"));
const requestedDate = args.get("date") || "";
const maxEvidence = Number(args.get("max-evidence") || 90);
const strongActions = new Set([
  "customer_deployment",
  "funding_round",
  "partnership_integration",
  "procurement_signal",
  "pricing_change",
  "governance_requirement",
]);
const genericTitlePattern = /^(?:企业|行业|垂直|智能|AI|人工智能)?(?:智能体|安全|合规|客服|模型|路由|成本|工具|平台|解决方案|基础设施|应用|服务|机会|方向|赛道){1,5}$/u;
const judgmentPattern = /不再|正在|转向|取决于|真正|关键|瓶颈|预算|价值|入口|边界|先于|晚于|从.+到|不是.+而是/u;
const hypePattern = /压至极限|巨大机会|必然(?:爆发|增长|取代)|彻底颠覆|万亿市场|创业赛道|独立赛道/u;

function compact(value = "", limit = 260) {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
}

function dateDistance(later, earlier) {
  const end = Date.parse(`${later}T00:00:00Z`);
  const start = Date.parse(`${earlier}T00:00:00Z`);
  return Number.isFinite(end) && Number.isFinite(start) ? Math.floor((end - start) / 86400000) : Number.POSITIVE_INFINITY;
}

function signalList(card, field) {
  const value = card?.opportunitySignals?.labels?.[field]
    || card?.opportunitySignals?.[field]
    || [];
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function evidenceScore(card) {
  const fields = ["buyer_or_user", "team_or_function", "specific_task", "pain_or_constraint", "product_form", "delivery_model", "business_action"];
  const fieldScore = fields.filter((field) => signalList(card, field).length).length;
  const actionScore = signalList(card, "business_action").some((item) => strongActions.has(item)) ? 6 : 0;
  return fieldScore + actionScore + (card.sourceExcerpt ? 3 : 0);
}

export function buildDirectionEvidenceManifest(projectRoot = root, {
  asOf = requestedDate,
  limit = maxEvidence,
} = {}) {
  const data = buildOpportunityEvidenceData(projectRoot, {
    asOf,
    directionFile: "",
  });
  const activeDate = data.meta.activeDate;
  const selected = data.evidence
    .filter((card) => dateDistance(activeDate, card.date) >= 0 && dateDistance(activeDate, card.date) < 30)
    .filter((card) => card.sourceUrl && card.sourceExcerpt)
    .sort((a, b) => evidenceScore(b) - evidenceScore(a) || b.date.localeCompare(a.date))
    .slice(0, limit)
    .map((card) => ({
      id: card.id,
      date: card.date,
      title: compact(card.title, 120),
      actor: compact(card.subject, 80),
      type: card.category,
      source_url: card.sourceUrl,
      source_excerpt: compact(card.sourceExcerpt),
      claim_refs: card.claim_refs,
      source_refs: card.source_refs,
      buyer_or_user: signalList(card, "buyer_or_user"),
      team_or_function: signalList(card, "team_or_function"),
      specific_task: signalList(card, "specific_task"),
      pain_or_constraint: signalList(card, "pain_or_constraint"),
      product_form: signalList(card, "product_form"),
      delivery_model: signalList(card, "delivery_model"),
      business_action: signalList(card, "business_action"),
    }));
  return { active_date: activeDate, window_days: 30, evidence: selected };
}

function chineseLength(value = "") {
  return (String(value).match(/[\u3400-\u9fff]/gu) || []).length;
}

function factualNumbers(value = "") {
  const withoutEvidenceIds = String(value || "").replace(/(?:SIG|EV|CL|SA)-[A-Z0-9-]+/giu, " ");
  return [...withoutEvidenceIds.matchAll(/\d+(?:[.,]\d+)*(?:\s*(?:%|％|美元|万美元|亿元|亿|万|人|家|天|周|月|年|小时|分钟|倍|个|条|以上|以下))?/gu)]
    .map((match) => match[0].replace(/[\s,]/gu, "").toLowerCase());
}

export function directionCardEditorialProblems(card = {}) {
  const problems = [];
  const required = [
    "title", "judgment", "hypothesis", "buyer", "task", "pain", "product_wedge",
    "current_alternatives", "why_now", "counter_signal", "validation_action",
  ];
  for (const field of required) if (!String(card[field] || "").trim()) problems.push(`missing_${field}`);
  if (chineseLength(card.title) < 6 || chineseLength(card.title) > 48) problems.push("title_length_out_of_range");
  if (genericTitlePattern.test(String(card.title || "").replace(/[·：:，,\s]/gu, ""))) problems.push("title_is_generic_category");
  if (hypePattern.test(`${card.title || ""}${card.judgment || ""}${card.hypothesis || ""}`)) problems.push("hype_or_absolute_claim");
  if (!judgmentPattern.test(`${card.title || ""}${card.judgment || ""}`)) problems.push("judgment_language_missing");
  if (chineseLength(card.judgment) < 24) problems.push("judgment_depth_out_of_range");
  if (chineseLength(card.hypothesis) < 25) problems.push("hypothesis_depth_out_of_range");
  if (chineseLength(card.why_now) < 30) problems.push("why_now_depth_out_of_range");
  if (chineseLength(card.counter_signal) < 20) problems.push("counter_signal_depth_out_of_range");
  if (!Array.isArray(card.unknowns) || card.unknowns.length !== 2 || card.unknowns.some((item) => chineseLength(item) < 12)) problems.push("unknowns_require_two_specific_questions");
  if (!Array.isArray(card.evidence_refs) || card.evidence_refs.length < 2 || card.evidence_refs.length > 5) problems.push("evidence_refs_must_be_2_to_5");
  const eventIds = new Set((card.evidence_refs || []).map((reference) => reference?.event_id).filter(Boolean));
  if (eventIds.size !== (card.evidence_refs || []).length) problems.push("evidence_refs_require_unique_event_ids");
  if ((card.evidence_refs || []).some((reference) => !reference?.claim_refs?.length || !reference?.source_refs?.length)) {
    problems.push("evidence_refs_require_claim_and_source_refs");
  }
  if (Number(card.minimum_evidence) !== eventIds.size) problems.push("minimum_evidence_must_match_refs");
  return problems;
}

export function directionCandidatePayloadProblems(payload = {}, manifest = { evidence: [] }) {
  const problems = [];
  const candidates = payload?.candidates;
  if (!Array.isArray(candidates) || candidates.length < 2 || candidates.length > 3) return ["candidate_count_must_be_2_to_3"];
  const evidenceById = new Map(manifest.evidence.map((item) => [item.id, item]));
  const seenIds = new Set();
  candidates.forEach((card, index) => {
    const prefix = `candidate_${index + 1}`;
    for (const issue of directionCardEditorialProblems(card)) problems.push(`${prefix}:${issue}`);
    if (!card.id || seenIds.has(card.id)) problems.push(`${prefix}:missing_or_duplicate_id`);
    seenIds.add(card.id);
    const references = card.evidence_refs || [];
    const evidence = references.map((reference) => evidenceById.get(reference.event_id)).filter(Boolean);
    if (evidence.length !== references.length) problems.push(`${prefix}:unknown_evidence_id`);
    for (const reference of references) {
      const item = evidenceById.get(reference.event_id);
      if (!item) continue;
      if ((reference.claim_refs || []).some((id) => !item.claim_refs.includes(id))) problems.push(`${prefix}:unknown_claim_ref`);
      if ((reference.source_refs || []).some((id) => !item.source_refs.includes(id))) problems.push(`${prefix}:unknown_source_ref`);
    }
    if (new Set(evidence.map((item) => item.actor).filter(Boolean)).size < 2) problems.push(`${prefix}:evidence_requires_two_actors`);
    if (evidence.length && evidence.every((item) => item.type === "funding")) problems.push(`${prefix}:funding_only_evidence`);
    const evidenceNumbers = new Set(factualNumbers(evidence.map((item) => `${item.title} ${item.source_excerpt}`).join(" ")));
    const factualText = ["title", "judgment", "hypothesis", "current_alternatives", "why_now"]
      .map((field) => card[field] || "")
      .join(" ");
    for (const number of factualNumbers(factualText)) {
      if (!evidenceNumbers.has(number)) problems.push(`${prefix}:unsupported_number:${number}`);
    }
  });
  return [...new Set(problems)];
}

export function directionCardPrompt(manifest) {
  return [
    "你是观澜 AI 的创业方向主编。只可使用 EVIDENCE_MANIFEST 中的事实，不得补充外部事实、市场规模、收入预测或投资建议。",
    "任务不是概括新闻，而是提出 2–3 个可被证伪的创业判断。每个方向必须引用 2–5 条、至少两个不同主体的证据，且不能全部是融资新闻。minimum_evidence 必须等于 evidence_refs 中不同 event_id 的数量。",
    "标题必须是一句简洁、有立场的结构判断。不要写“某某平台/某某解决方案/某某赛道”式品类名；应指出价值、预算、入口、瓶颈或竞争边界正在如何迁移。",
    "judgment 必须解释：旧均衡是什么、什么变量正在改变、价值会迁移到哪里、判断边界是什么。深刻不等于夸张；禁止“压至极限、巨大机会、必然爆发、彻底颠覆、万亿市场、创业赛道、独立赛道”等宣传语或绝对判断。",
    "hypothesis 必须写清买方、具体任务、产品切口与付费理由；why_now 必须比较至少两条证据呈现的共同变化；counter_signal 必须说明出现什么事实就推翻该判断。",
    "title、judgment、hypothesis、current_alternatives、why_now 中不得写 EVIDENCE_MANIFEST 原文摘录没有出现的数字、比例、金额、效率提升或时间缩短。没有数字证据时用定性语言。validation_action 与 counter_signal 可以自行定义未来验证阈值。",
    "unknowns 必须恰好两条；validation_action 必须是两周内可执行并能形成取舍的验证动作。",
    "status 只能是 validation_ready、forming、tracking。evidence_refs 必须复制清单中的 event_id、claim_refs 和 source_refs，不得改写或省略。",
    "返回一个 JSON 对象，不要代码围栏：",
    '{"candidates":[{"id":"DIR-YYYYMMDD-01","title":string,"judgment":string,"hypothesis":string,"status":"validation_ready|forming|tracking","buyer":string,"task":string,"pain":string,"product_wedge":string,"current_alternatives":string,"why_now":string,"counter_signal":string,"unknowns":[string,string],"validation_action":string,"minimum_evidence":number,"evidence_refs":[{"event_id":string,"claim_refs":[string],"source_refs":[string]}]}]}',
    `分析截止日：${manifest.active_date}；观察窗口：最近 ${manifest.window_days} 天。`,
    `EVIDENCE_MANIFEST:\n${JSON.stringify(manifest.evidence)}`,
  ].join("\n\n");
}

async function main() {
  const manifest = buildDirectionEvidenceManifest(root);
  if (!manifest.active_date || manifest.evidence.length < 6) throw new Error("direction_evidence_manifest_too_small");
  const result = await deepSeekJsonCompletion({
    model: deepSeekModels().pro,
    messages: [
      { role: "system", content: "你输出的是受证据约束、可被证伪的创业判断，不是新闻摘要或营销文案。" },
      { role: "user", content: directionCardPrompt(manifest) },
    ],
    maxTokens: 6000,
    temperature: 0.2,
    timeoutMs: 180000,
    validate: (payload) => directionCandidatePayloadProblems(payload, manifest),
  });
  const value = {
    schema_version: "direction-card-candidates-v2-v4-evidence",
    generated_at: result.generatedAt,
    as_of: manifest.active_date,
    window_days: manifest.window_days,
    review_status: "pending_human_review",
    generator: {
      provider: result.provider,
      model: result.model,
      attempts: result.attempts,
      prompt_version: "DIRECTION-EDITORIAL-V2.0-v4-evidence",
    },
    evidence_count: manifest.evidence.length,
    candidates: result.payload.candidates,
  };
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(root, output).replace(/\\/gu, "/"),
    model: result.model,
    candidates: value.candidates.length,
    review_status: value.review_status,
  }, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error?.stack || error?.message || String(error));
    process.exit(1);
  });
}
