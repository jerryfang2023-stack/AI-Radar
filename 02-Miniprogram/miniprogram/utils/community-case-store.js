const { bounties } = require("./community-data.js");
const { readExperience, saveExperience } = require("./experience.js");

const SELF = "experience-self";
function state() {
  const value = readExperience();
  if (!value) throw new Error("当前仅开放查看，互动服务尚未上线");
  if (value.status !== "joined") throw new Error("请先切换为已入群体验身份");
  if (!value.cases) value.cases = bounties.map((item) => ({ ...item, owner: "sample-founder", responses: [], joined: [], allocations: [] }));
  return value;
}
function listCases() { return state().cases; }
function saveDraft(key, draft) { const value = state(); value.drafts[key] = draft; saveExperience(value); }
function getDraft(key) { return state().drafts[key] || {}; }
function createCase(form) {
  const value = state(); const question = String(form.question || "").trim(); const summary = String(form.summary || "").trim(); const points = Number(form.points);
  if (question.length < 8 || !summary) throw new Error("请填写完整问题（至少8字）及背景");
  if (![10, 20, 30].includes(points)) throw new Error("请选择10、20或30积分");
  const item = { id: `EXP-${Date.now()}`, owner: SELF, founder: value.profile.name || "体验用户", role: "Founder", category: "决策求助", mode: form.mode === "社群共创" ? "社群共创" : "线上回答", question, summary, points, status: "待审核", time: "本机体验 · 待审核", answers: 0, participants: 0, responses: [], joined: [], allocations: [] };
  value.cases.unshift(item); delete value.drafts.create; saveExperience(value); return item;
}
function mutate(id, action) {
  const value = state(); const item = value.cases.find((entry) => entry.id === id);
  if (!item) throw new Error("未找到此悬赏令");
  action(item, value); saveExperience(value); return item;
}
function approveCase(id) { return mutate(id, (item) => { if (item.owner !== SELF || item.status !== "待审核") throw new Error("不能模拟审核此问题"); item.status = "进行中"; item.time = "本机体验 · 进行中"; }); }
function answerCase(id, form) {
  return mutate(id, (item, value) => {
    if (item.status !== "进行中") throw new Error("当前问题不接受回答");
    if (item.owner === SELF) throw new Error("不能回答自己发起的问题");
    if (["judgement", "reason", "steps"].some((key) => !String(form[key] || "").trim())) throw new Error("请填写判断、依据与行动建议");
    const response = { id: SELF, name: value.profile.name || "体验用户", judgement: form.judgement.trim(), reason: form.reason.trim(), steps: form.steps.trim(), help: String(form.help || "").trim() };
    const index = item.responses.findIndex((entry) => entry.id === SELF);
    if (index < 0) { item.responses.push(response); item.answers += 1; } else item.responses[index] = response;
    delete value.drafts[id];
  });
}
function joinCase(id) { return mutate(id, (item) => { if (item.status !== "进行中" || item.mode !== "社群共创") throw new Error("当前不能参加共创"); if (!item.joined.includes(SELF)) { item.joined.push(SELF); item.participants += 1; } }); }
function addSampleResponse(id) {
  return mutate(id, (item) => {
    if (item.owner !== SELF || item.status !== "进行中") throw new Error("仅本人体验问题可添加示例回答");
    if (!item.responses.some((answer) => answer.id === "sample-helper")) {
      item.responses.push({ id: "sample-helper", name: "示例参与者", judgement: "先做最小范围验证，再决定投入。", reason: "先明确本次决策的验证标准与可用资源。", steps: "1. 明确目标用户\n2. 完成小范围验证\n3. 根据结果安排下一步", help: "可参与一次需求讨论。" }); item.answers += 1;
    }
    item.status = "待结案";
  });
}
function closeCase(id, allocations) {
  return mutate(id, (item, value) => {
    if (item.owner !== SELF) throw new Error("仅发起人可以结案");
    if (item.status !== "待结案") throw new Error("当前问题不可结案或已经结案");
    if (!allocations.length || new Set(allocations.map((entry) => entry.id)).size !== allocations.length) throw new Error("请检查积分分配对象");
    if (allocations.some((entry) => !item.responses.some((answer) => answer.id === entry.id) || !Number.isInteger(entry.points) || entry.points < 0)) throw new Error("积分必须为非负整数且分配给回答者");
    if (allocations.reduce((sum, entry) => sum + entry.points, 0) !== item.points) throw new Error(`分配总和须为${item.points}积分`);
    item.allocations = allocations; item.status = "已结案"; item.time = "本机体验 · 已结案";
    value.settlements = [...(value.settlements || []), { caseId: id, allocations, at: Date.now() }];
  });
}
module.exports = { SELF, listCases, saveDraft, getDraft, createCase, approveCase, answerCase, joinCase, addSampleResponse, closeCase };
