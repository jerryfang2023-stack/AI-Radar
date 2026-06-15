import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const businessSignalsPath = path.join(siteDataDir, "v3-data-observation-desk.json");
const firstLinePath = path.join(siteDataDir, "follow-builders-daily.json");
const communityPath = path.join(siteDataDir, "community-intelligence.json");
const topicCenterJsonPath = path.join(siteDataDir, "topic-center.json");
const topicCenterJsPath = path.join(siteDataDir, "topic-center.js");
const topicCenterHermesJsonPath = path.join(siteDataDir, "topic-center-hermes.json");
const topicCenterHermesMdPath = path.join(siteDataDir, "topic-center-hermes.md");
const topicCenterVersion = "V2.2.0-daily-topic-refresh";

const engines = [
  {
    id: "money_leak",
    title: "漏钱型",
    desc: "订单入口、转化漏斗、线索流失",
    question: "老板每天哪里在流失收入？",
  },
  {
    id: "save_headcount",
    title: "省人型",
    desc: "少招人、少返工、少加班",
    question: "哪些重复岗位可以先被 AI 接管一部分？",
  },
  {
    id: "peer_pressure",
    title: "同行压力型",
    desc: "同行已做、对手先跑、老板焦虑",
    question: "哪些同行动作会让老板产生紧迫感？",
  },
  {
    id: "pitfall",
    title: "避坑型",
    desc: "工具乱买、权限失控、流程没拆",
    question: "老板最容易把 AI 钱花错在哪里？",
  },
  {
    id: "counterintuitive",
    title: "反常识型",
    desc: "推翻流行说法，形成可传播判断",
    question: "哪个流行说法需要被刺穿？",
  },
  {
    id: "small_role",
    title: "小岗位型",
    desc: "客服、销售、财务、标书、运营",
    question: "哪个具体岗位最适合先 AI 化？",
  },
  {
    id: "big_small_contrast",
    title: "大小对照型",
    desc: "大融资对照小生意，大模型对照小岗位",
    question: "大新闻背后，普通老板能抓哪一层机会？",
  },
  {
    id: "person_story",
    title: "人物故事型",
    desc: "具体人、具体场景、具体结果",
    question: "有没有一个人能讲清楚一个趋势？",
  },
];

const engineById = new Map(engines.map((engine) => [engine.id, engine]));

function argValue(name, fallback = "") {
  const exact = `--${name}`;
  const prefix = `${exact}=`;
  const args = process.argv.slice(2);
  const inline = args.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = args.indexOf(exact);
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback;
}

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function text(value) {
  return value == null ? "" : String(value).trim();
}

function list(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return value ? [value] : [];
}

function clip(value, length = 220) {
  const clean = text(value).replace(/\s+/gu, " ");
  return clean.length > length ? `${clean.slice(0, length - 1)}…` : clean;
}

function slug(value) {
  return text(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 64) || "topic";
}

function todayStr() {
  const now = new Date();
  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function dateKey(value) {
  return text(value).match(/^\d{4}-\d{2}-\d{2}/u)?.[0] || "";
}

function scoreGrade(score) {
  if (score >= 90) return "S";
  if (score >= 80) return "A";
  if (score >= 70) return "B";
  return "C";
}

function priorityLabel(score) {
  if (score >= 85) return "公众号主稿";
  if (score >= 75) return "可写短文";
  if (score >= 65) return "选题池观察";
  return "暂缓";
}

function normalizeBusinessSignal(signal, index) {
  const title = text(signal.displayTitle || signal.generatedTitle || signal.title || signal.originalTitle || `商业信号 ${index + 1}`);
  const fact = text(signal.translatedFact || signal.summary || signal.frontstageValueDescription || "");
  return {
    id: text(signal.id || `business-${index + 1}`),
    title,
    fact,
    category: text(signal.categoryLabel || signal.category || signal.type || "商业信号"),
    source: text(signal.sourceName || signal.source || ""),
    url: text(signal.sourceUrl || list(signal.sourceLinks)[0] || ""),
    score: Number(signal.frontstageEditorialScore || signal.importanceScore || 0),
    raw: signal,
    searchText: `${title} ${fact} ${signal.sourceName || ""} ${JSON.stringify(signal.tags || {})}`,
  };
}

function normalizeViewpoint(item, index) {
  const body = text(item.translation || item.text || item.contentTranslation || item.content || "");
  return {
    id: text(item.id || `viewpoint-${index + 1}`),
    date: dateKey(item.date || item.originalDate || item.original_date || item.publishedAt || item.createdAt || item.captured_at),
    title: text(item.translation || item.text || `一线观点 ${index + 1}`),
    body,
    author: text(item.name || item.handle || item.source || ""),
    topic: text(item.topic || ""),
    url: text(item.url || ""),
    engagement: Number(item.likes || 0) + Number(item.retweets || 0) * 3 + Number(item.replies || 0),
    raw: item,
    searchText: `${item.name || ""} ${item.handle || ""} ${item.text || ""} ${item.translation || ""} ${item.contentTranslation || ""} ${item.topic || ""}`,
  };
}

function normalizeCommunity(item, index) {
  const painPoints = list(item.painPoints).map(text).filter(Boolean);
  const tools = list(item.tools).map(text).filter(Boolean);
  return {
    id: text(item.id || `community-${index + 1}`),
    title: text(item.title || `社群情报 ${index + 1}`),
    summary: text(item.summary || item.excerpt || item.evidence || ""),
    scene: text(item.scene || ""),
    industry: text(item.industry || ""),
    tools,
    monetization: text(item.monetization || ""),
    painPoints,
    resultSignal: text(item.resultSignal || ""),
    source: text(item.sourceName || item.source || ""),
    url: text(item.url || ""),
    valueScore: Number(item.valueScore || 0),
    opportunityScore: Number(item.opportunityScore || 0),
    metrics: text(item.metrics || ""),
    raw: item,
    searchText: `${item.title || ""} ${item.summary || ""} ${item.excerpt || ""} ${item.evidence || ""} ${item.scene || ""} ${item.industry || ""} ${tools.join(" ")} ${painPoints.join(" ")} ${item.resultSignal || ""}`,
  };
}

function keywordScore(item, keywords) {
  const haystack = text(item.searchText || item.title || item.summary || item.fact).toLowerCase();
  return keywords.reduce((score, keyword) => {
    const normalized = keyword.toLowerCase();
    if (haystack.includes(normalized)) return score + 3;
    return score;
  }, 0);
}

function rank(items, keywords, extra = () => 0) {
  return [...items]
    .map((item) => ({
      item,
      score: keywordScore(item, keywords) + extra(item),
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item);
}

function firstRanked(items, keywords, fallback = null, extra) {
  return rank(items, keywords, extra)[0] || fallback || items[0] || null;
}

function numberHint(value) {
  const clean = text(value);
  const match = clean.match(/[$￥]\s*\d+(?:\.\d+)?\s*(?:M|B|万美元|亿美元|万美金)?/iu)
    || clean.match(/\d+(?:\.\d+)?\s*(?:%|亿美元|万美元|万美金|M|B|万|亿|人|个|条|小时|天|倍)/iu);
  return match ? match[0].replace(/\s+/gu, "") : "";
}

function cleanSubject(value, fallback = "这条信号", length = 26) {
  const clean = text(value || fallback)
    .replace(/&amp;/gu, "&")
    .replace(/&#39;/gu, "'")
    .replace(/&quot;/gu, '"')
    .replace(/^[^：:]{1,14}[：:]\s*/u, "")
    .replace(/\s+/gu, " ");
  return clip(clean, length).replace(/[，,。；;：:、\s]+$/u, "") || fallback;
}

function subjectOf(item, fallback = "这条信号", length = 26) {
  return cleanSubject(item?.title || item?.summary || item?.body || item?.fact, fallback, length);
}

function detailOf(item, fallback = "这条材料") {
  return clip(item?.fact || item?.summary || item?.body || item?.resultSignal || item?.scene || item?.title || fallback, 120);
}

function metricOf(item, fallback = "") {
  return numberHint(`${item?.title || ""} ${item?.fact || ""} ${item?.summary || ""} ${item?.body || ""}`) || fallback;
}

function evidenceItem(kind, item) {
  if (!item) return null;
  return {
    kind,
    id: item.id,
    title: clip(item.title, 120),
    source: item.source || item.author || "",
    url: item.url || "",
    note: clip(item.fact || item.summary || item.body || item.resultSignal || item.scene || "", 180),
  };
}

function scoreTopic({ pain = 18, money = 18, buzz = 14, spread = 10, action = 7, style = 4 }) {
  const scoreBreakdown = {
    bossPain: Math.min(25, pain),
    moneyRelation: Math.min(25, money),
    talkability: Math.min(20, buzz),
    spreadability: Math.min(15, spread),
    actionability: Math.min(10, action),
    styleFit: Math.min(5, style),
  };
  const score = Object.values(scoreBreakdown).reduce((sum, value) => sum + value, 0);
  return { score, scoreBreakdown };
}

function topicPayload(input) {
  const engine = engineById.get(input.engineId) || engines[0];
  const { score, scoreBreakdown } = scoreTopic(input.scoreParts || {});
  const businessSignals = list(input.businessSignals).filter(Boolean).map((item) => evidenceItem("business_signal", item)).filter(Boolean);
  const viewpoints = list(input.viewpoints).filter(Boolean).map((item) => evidenceItem("first_line_viewpoint", item)).filter(Boolean);
  const communityItems = list(input.communityItems).filter(Boolean).map((item) => evidenceItem("community_intelligence", item)).filter(Boolean);
  const sourceInputs = { businessSignals, viewpoints, communityItems };
  const evidenceBase = [...businessSignals, ...viewpoints, ...communityItems];

  return {
    id: `${engine.id}-${slug(input.title)}`,
    sourceId: engine.id,
    sourceName: engine.title,
    sourceDesc: engine.desc,
    type: input.type || "boss_decision_topic",
    title: input.title,
    spreadTitle: input.spreadTitle || input.title,
    audience: "企业老板 / 创业者 / 业务负责人",
    core: input.core,
    relevance: input.relevance,
    bossPain: input.bossPain,
    moneyLine: input.moneyLine,
    oldFrame: input.oldFrame,
    newFrame: input.newFrame,
    actionHint: input.actionHint,
    evidence: input.evidence || evidenceBase.map((item) => item.title).slice(0, 3).join("；"),
    evidenceBoundary: input.evidenceBoundary || "商业信号用于事实底座；一线观点和社群情报只作为传播线索与需求线索，写稿前不得把社群结果直接写成行业事实。",
    sourceInputs,
    source: evidenceBase[0]?.source || engine.title,
    url: evidenceBase[0]?.url || "",
    date: input.date,
    score,
    grade: scoreGrade(score),
    priority: priorityLabel(score),
    scoreBreakdown,
    angles: input.angles,
    writingStructure: input.writingStructure || [
      "开头 3 句内给冲突或数字",
      "中段按现象 -> 算账 -> 坑 -> 解法推进",
      "结尾给一句新判断，不复述要点",
    ],
    forbiddenFrame: input.forbiddenFrame || "不要写成 AI 功能介绍、工具教程或泛泛趋势分析。",
  };
}

function buildTopicSet({ date, signals, viewpoints, community }) {
  const serviceSignal = firstRanked(signals, ["客服", "电话", "来电", "订单", "搜索", "agentic", "运营", "产权", "rocket close", "case", "案例", "服务"], null, (item) => metricOf(item) ? 4 : 0);
  const workflowSignal = firstRanked(signals, ["rippling", "deep agents", "langsmith", "工作流", "流程", "automation", "agentic", "fireworks", "swe-bench", "工程师", "software"], null, (item) => metricOf(item) ? 3 : 0);
  const governanceSignal = firstRanked(signals, ["治理", "幻觉", "法官", "罚单", "禁止", "policy", "risk", "anthropic", "权限", "安全", "guardrails", "律师"], null, (item) => metricOf(item) ? 3 : 0);
  const fundingSignal = firstRanked(signals, ["融资", "$", "上市", "ipo", "cuspai", "willow", "材料", "capital", "funding", "ai公司"], null, (item) => metricOf(item) ? 5 : 0);
  const searchSignal = firstRanked(signals, ["搜索", "google", "seo", "流量", "search", "出海", "uv", "pv"]);
  const skillSignal = firstRanked(signals, ["工程师", "取代", "软件", "swe-bench", "evals", "评估", "coding", "developer"]);

  const salesCommunity = firstRanked(community, ["销售", "商单", "成交", "客户", "订单", "转化", "gmv", "roi", "获客", "线索", "带货"], null, (item) => item.valueScore / 20 + item.opportunityScore / 30);
  const contentCommunity = firstRanked(community, ["公众号", "小红书", "内容", "视频", "seo", "uv", "pv", "起号", "带货", "流量"], null, (item) => item.opportunityScore / 20 + (metricOf(item) ? 5 : 0));
  const productCommunity = firstRanked(community, ["产品", "独立开发者", "小程序", "红利", "调研", "ai服务", "tob", "商单"], null, (item) => item.valueScore / 25 + item.opportunityScore / 25);
  const workflowCommunity = firstRanked(community, ["sop", "知识库", "飞书", "流程", "标准化", "怎么做", "该做什么", "避坑"], null, (item) => item.valueScore / 20);
  const storyCommunity = firstRanked(community, ["销售能力", "普通人", "1000万", "采访", "过程", "结果", "新手", "30天"], null, (item) => item.valueScore / 20 + (metricOf(item) ? 5 : 0));

  const governanceViewpoint = firstRanked(viewpoints, ["governance", "治理", "guardrails", "policy", "accountable", "agi"], null, (item) => item.engagement / 500);
  const skillViewpoint = firstRanked(viewpoints, ["工程师", "software", "developer", "coding", "取代", "codex", "swe"], null, (item) => item.engagement / 500);
  const workflowViewpoint = firstRanked(viewpoints, ["work", "workflow", "complex", "agent", "流程", "一致"], null, (item) => item.engagement / 500);

  const moneySubject = subjectOf(searchSignal || serviceSignal || salesCommunity, "订单入口");
  const serviceSubject = subjectOf(serviceSignal, "岗位级 AI");
  const workflowSubject = subjectOf(workflowSignal || workflowCommunity, "企业流程 AI");
  const governanceSubject = subjectOf(governanceSignal || governanceViewpoint, "AI 治理");
  const fundingSubject = subjectOf(fundingSignal, "AI 融资");
  const contentSubject = subjectOf(contentCommunity || searchSignal, "内容流量");
  const productSubject = subjectOf(productCommunity || workflowSignal, "AI 服务机会");
  const storySubject = subjectOf(storyCommunity || skillViewpoint, "一线故事");
  const fundingMetric = metricOf(fundingSignal, "一笔新钱");
  const contentMetric = metricOf(contentCommunity, "");

  return [
    topicPayload({
      engineId: "money_leak",
      date,
      title: `${moneySubject}背后：老板先查订单入口有没有漏钱`,
      core: "流量、搜索、来电、表单和私信，本质上都是订单入口。AI 先改变的不是工具栏，而是客户从看见你到联系你的路径。",
      relevance: `${detailOf(searchSignal || serviceSignal)}；社群里也出现了“${subjectOf(contentCommunity || salesCommunity, "获客案例")}”这类一线反馈。`,
      bossPain: "老板最容易忽略的不是没有用 AI，而是客户已经换了入口，公司还在用旧流程接单。",
      moneyLine: "先算入口漏损，再算模型能力；能把曝光、咨询、跟进接住，AI 才和收入有关。",
      oldFrame: "AI 是一个提效工具。",
      newFrame: "AI 正在改写客户入口，入口漏掉就是收入漏掉。",
      actionHint: "今天先盘点 3 个入口：搜索入口、内容入口、咨询入口，各看一次转化和跟进断点。",
      businessSignals: [searchSignal || serviceSignal],
      viewpoints: [],
      communityItems: [contentCommunity || salesCommunity],
      scoreParts: { pain: 25, money: 25, buzz: 19, spread: 14, action: 9, style: 5 },
      angles: [
        { title: "开头直接问漏钱", note: `不要先讲 ${moneySubject} 多新，先问老板：这个入口今天带来多少咨询、漏掉多少跟进？` },
        { title: "中段拆入口链路", note: "看见、点击、咨询、记录、跟进、成交，每一步都能放 AI，但先看哪里漏。" },
        { title: "结尾落到老板动作", note: "让老板今天就拉一张入口表，而不是收藏一堆工具。" },
      ],
    }),
    topicPayload({
      engineId: "save_headcount",
      date,
      title: `${workflowSubject}给老板的提醒：别急着裁员，先少招重复岗位`,
      core: "AI 进入企业的第一步，不是替代一个完整的人，而是接住岗位里反复发生、规则清楚、结果可验收的动作。",
      relevance: `${detailOf(workflowSignal || workflowViewpoint)}；这类信号比“AI 很强”更接近老板的组织账。`,
      bossPain: "人越招越多，流程没有变短，管理成本反而被重复动作拖住。",
      moneyLine: "少招一个重复岗位，或让一个岗位少返工 30%，老板才会觉得 AI 是投入，不是玩具。",
      oldFrame: "AI 上线就是裁员。",
      newFrame: "AI 上线的第一阶段，是把岗位动作拆小，让公司少招重复岗位。",
      actionHint: "选一个岗位，列出每天重复最多的 5 个动作，先交给 AI 试跑其中 1 个。",
      businessSignals: [workflowSignal || serviceSignal],
      viewpoints: [workflowViewpoint || skillViewpoint],
      communityItems: [workflowCommunity],
      scoreParts: { pain: 23, money: 23, buzz: 16, spread: 13, action: 10, style: 5 },
      angles: [
        { title: "用岗位动作替代岗位名称", note: "不要写 AI 替代某个人，写 AI 先替代接听、归档、质检、催办、汇总这类动作。" },
        { title: "把省人写成管理账", note: "老板关心的不是炫技，是少招人、少返工、少培训。" },
        { title: "给一个当天可做的小动作", note: `用 ${workflowSubject} 做例子，把大流程拆成一个可验收动作。` },
      ],
    }),
    topicPayload({
      engineId: "peer_pressure",
      date,
      title: `从${contentSubject}${contentMetric ? `的${contentMetric}` : ""}到${subjectOf(searchSignal || workflowSignal, "今天的商业信号")}：同行压力不在技术，在速度`,
      core: "最能触发老板的不是技术解释，而是别人已经把 AI 用到获客、内容、交付、产品试错里，并且开始看到结果。",
      relevance: `${detailOf(contentCommunity || productCommunity)}；这类社群信号代表一线老板和操盘手已经在算产出。`,
      bossPain: "当同行用 AI 降低试错成本时，你还在用人工流程慢慢排队。",
      moneyLine: "同行压力真正影响的是获客成本、内容成本和试错周期，而不是老板的技术焦虑。",
      oldFrame: "AI 是员工自己研究的新工具。",
      newFrame: "AI 是同行正在重做经营速度的生产系统。",
      actionHint: "每周只问团队一个问题：同行哪一个动作已经被 AI 缩短了，我们要不要跟？",
      businessSignals: [searchSignal || workflowSignal],
      viewpoints: [skillViewpoint],
      communityItems: [contentCommunity || productCommunity],
      scoreParts: { pain: 22, money: 22, buzz: 19, spread: 15, action: 8, style: 5 },
      angles: [
        { title: "用同行压力开头", note: "标题和开头都不要讲 AI 多强，要讲别人已经开始用 AI 跑出结果。" },
        { title: "拆获客、交付、产品三个场景", note: "每个场景只写一个真实动作，避免变成工具列表。" },
        { title: "落到老板的例会问题", note: "建议老板每周让团队汇报一个被 AI 缩短的动作，而不是汇报又试了什么工具。" },
      ],
    }),
    topicPayload({
      engineId: "pitfall",
      date,
      title: `${governanceSubject}背后：老板必须补上责任边界`,
      core: "AI 从生成内容走向执行动作后，企业问题从“会不会用”变成“谁审核、谁授权、谁负责”。",
      relevance: `${detailOf(governanceSignal || governanceViewpoint)}；这类信号适合写给老板看，因为它直接关系到业务风险。`,
      bossPain: "AI 一旦能读文件、写内容、调工具、改数据，错误就不只是内容不好，而可能变成业务事故。",
      moneyLine: "权限没管住，省下的人力钱可能被一次合规、法务或数据事故吃掉。",
      oldFrame: "AI 越自主越好。",
      newFrame: "AI 越自主，越要先设计权限、复核和责任人。",
      actionHint: "先把 AI 员工分成三级：只读、建议、可执行；每一级都写清谁复核。",
      businessSignals: [governanceSignal],
      viewpoints: [governanceViewpoint],
      communityItems: [workflowCommunity || productCommunity],
      scoreParts: { pain: 22, money: 21, buzz: 18, spread: 13, action: 9, style: 5 },
      angles: [
        { title: "不要写安全科普，写老板责任", note: "老板不关心分类器模型，关心 AI 搞错后谁背锅。" },
        { title: "把权限拆成人话", note: "只读、建议、执行三个等级，比讲治理框架更容易传播。" },
        { title: "用当天案例推进", note: `用 ${governanceSubject} 做钩子，落到企业内部的授权和复核表。` },
      ],
    }),
    topicPayload({
      engineId: "counterintuitive",
      date,
      title: `${subjectOf(skillSignal || skillViewpoint, "AI 没有替代人")}背后：老板真正该买的不是工具，是任务拆解能力`,
      core: "反常识点在于：AI 越强，越不是所有人都被替代，而是会拆任务、会验收结果的人更值钱。",
      relevance: `${detailOf(skillSignal || skillViewpoint)}；社群里“${subjectOf(workflowCommunity || productCommunity, "该做什么")}”的讨论也在提醒老板，问题不再只是怎么做。`,
      bossPain: "工具买了一堆，员工不会拆任务；老板看到结果差，最后误判 AI 不行。",
      moneyLine: "工具是支出，任务拆解和验收标准是资产。支出会过期，资产能复用。",
      oldFrame: "追最新 AI 工具。",
      newFrame: "先沉淀任务、语料、步骤和验收标准，再让 AI 接手。",
      actionHint: "今天先选一个业务动作，写清输入、步骤、验收标准，再接任何 AI 工具。",
      businessSignals: [skillSignal || workflowSignal],
      viewpoints: [skillViewpoint || workflowViewpoint],
      communityItems: [workflowCommunity],
      scoreParts: { pain: 24, money: 23, buzz: 18, spread: 15, action: 10, style: 5 },
      angles: [
        { title: "先打脸工具崇拜", note: "开头写：买工具不是 AI 转型，能稳定交付结果才算。" },
        { title: "中段讲任务拆解", note: "把提示词、流程、知识库和验收标准放在同一张图里讲。" },
        { title: "结尾给金句", note: "AI 工具不是资产，能反复跑通的任务系统才是资产。" },
      ],
    }),
    topicPayload({
      engineId: "small_role",
      date,
      title: `${serviceSubject}背后：小公司先做一个小岗位 AI 员工`,
      core: "普通老板和服务商的机会，不在宏大平台，而在一个具体岗位、一个明确动作、一个可验收结果里。",
      relevance: `${detailOf(serviceSignal || workflowSignal)}；这类材料说明岗位级 AI 比大而全平台更容易落地。`,
      bossPain: "老板最怕 AI 项目太大、太贵、太慢，最后没人用。",
      moneyLine: "一个岗位先打穿，比一个平台讲 100 个功能更容易收钱，也更容易复购。",
      oldFrame: "做一个什么都能干的 AI 平台。",
      newFrame: "做一个只干一件事但能交付的小岗位 AI 员工。",
      actionHint: "先从客服、销售跟进、内容分发、资料整理、流程复核里选一个岗位动作。",
      businessSignals: [serviceSignal, workflowSignal].filter(Boolean),
      viewpoints: [],
      communityItems: [productCommunity || salesCommunity],
      scoreParts: { pain: 25, money: 24, buzz: 18, spread: 15, action: 10, style: 5 },
      angles: [
        { title: "用小岗位对抗大平台", note: "这是最适合你现有表达的主线：不做大而全，先做小而深。" },
        { title: "每个岗位给一个可验收结果", note: "客服看接通率，销售看跟进率，内容看线索，流程看错误率。" },
        { title: "避免写成创业方向清单", note: "要写一个岗位打穿逻辑，不要罗列 10 个机会。" },
      ],
    }),
    topicPayload({
      engineId: "big_small_contrast",
      date,
      title: `${fundingSubject}${fundingMetric ? `拿到${fundingMetric}` : "又有新钱"}：普通老板该看见哪一层机会？`,
      core: "大新闻负责告诉你资本往哪里押，小机会负责告诉你老板明天愿意为什么付钱。",
      relevance: `${detailOf(fundingSignal)}；同时社群里的“${productSubject}”说明一线需求还在配置、流程和交付。`,
      bossPain: "老板看不懂大融资，但能理解谁帮他把一个具体业务动作跑起来。",
      moneyLine: "大公司赚基础设施的钱，小服务商赚落地第一公里的钱。",
      oldFrame: "AI 创业只能跟大模型和融资有关。",
      newFrame: "普通人的 AI 机会在帮老板跨过配置、流程和交付门槛。",
      actionHint: "把服务产品化：诊断一个流程、配置一套工具、交付一个可复用动作。",
      businessSignals: [fundingSignal],
      viewpoints: [workflowViewpoint || skillViewpoint],
      communityItems: [productCommunity],
      scoreParts: { pain: 21, money: 24, buzz: 20, spread: 15, action: 8, style: 5 },
      angles: [
        { title: "用大钱和小钱制造冲突", note: "大融资负责制造注意力，小服务负责让老板觉得和自己有关。" },
        { title: "写出两套赚钱逻辑", note: "资本逻辑：长期技术押注；服务逻辑：帮老板完成第一公里。" },
        { title: "落到可卖服务包", note: "流程诊断、工具配置、知识库搭建、首个工作流，这是老板可理解的产品。" },
      ],
    }),
    topicPayload({
      engineId: "person_story",
      date,
      title: `${storySubject}撞上${subjectOf(skillSignal || workflowSignal, "今天的 AI 信号")}：老板更愿意转发有场景的 AI 故事`,
      core: "人物故事的价值不在鸡汤，而在把一个抽象趋势压缩成老板能看懂的场景、成本和选择。",
      relevance: `${detailOf(storyCommunity || skillViewpoint)}；这类材料适合做传播入口，再回到老板的业务判断。`,
      bossPain: "老板不是不关心 AI，而是不愿意看一篇没有人、没有场景、没有结果的技术说明。",
      moneyLine: "一个具体人、一件具体事、一个具体结果，比十个工具功能更容易带来咨询和信任。",
      oldFrame: "写 AI 就要讲技术和趋势。",
      newFrame: "写给老板的 AI 内容，要先有人、有场景、有结果。",
      actionHint: "从当天素材里挑一个具体人或具体业务场景，按“处境-动作-结果-老板判断”写。",
      businessSignals: [skillSignal || workflowSignal],
      viewpoints: [skillViewpoint],
      communityItems: [storyCommunity || salesCommunity],
      scoreParts: { pain: 23, money: 21, buzz: 20, spread: 14, action: 9, style: 5 },
      angles: [
        { title: "用人物场景开头", note: `不要先讲 AI 趋势，先讲 ${storySubject} 这类具体处境。` },
        { title: "把故事转成商业判断", note: "重点不是感动，而是这个故事说明老板该改哪个流程、补哪个能力。" },
        { title: "结尾回到老板动作", note: "让老板知道明天可以拿哪个人、哪个岗位、哪个场景做试点。" },
      ],
    }),
  ];
}

function dedupeTopics(topics) {
  const seen = new Set();
  return topics.filter((topic) => {
    const key = slug(topic.title);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sourceCounts(topics) {
  return Object.fromEntries(engines.map((engine) => [engine.id, topics.filter((topic) => topic.sourceId === engine.id).length]));
}

function materialRole(kind) {
  if (kind === "business_signal") return "fact_base";
  if (kind === "first_line_viewpoint") return "viewpoint_lead";
  if (kind === "community_intelligence") return "community_lead";
  return "supporting_material";
}

function materialPath(kind, id, date) {
  const suffix = id ? `#id=${id}` : "";
  if (kind === "business_signal") return `01-SiteV2/site/data/v3-data-observation-desk.json${suffix}`;
  if (kind === "first_line_viewpoint") return `01-SiteV2/site/data/follow-builders-daily.json${suffix}`;
  if (kind === "community_intelligence") return `01-SiteV2/site/data/community-intelligence-daily/${date}.json${suffix}`;
  return "";
}

function compactEvidence(items, date) {
  return list(items).map((item) => ({
    kind: item.kind || "",
    id: item.id || "",
    role: materialRole(item.kind || ""),
    title: item.title || "",
    source: item.source || "",
    url: item.url || "",
    note: item.note || "",
    localDataPath: materialPath(item.kind || "", item.id || "", date),
    verificationUse: item.kind === "business_signal"
      ? "fact_base"
      : "lead_only_not_verified_fact",
  }));
}

function rawMaterials(topic, date) {
  const grouped = [
    ...compactEvidence(topic.sourceInputs?.businessSignals, date),
    ...compactEvidence(topic.sourceInputs?.viewpoints, date),
    ...compactEvidence(topic.sourceInputs?.communityItems, date),
  ];
  return grouped.map((item, index) => ({
    materialId: `${topic.id}-material-${index + 1}`,
    ...item,
  }));
}

function compactTopic(topic, index) {
  const materials = rawMaterials(topic, topic.date);
  return {
    rank: index + 1,
    id: topic.id,
    date: topic.date,
    score: topic.score,
    grade: topic.grade,
    sourceId: topic.sourceId,
    sourceName: topic.sourceName,
    priority: topic.priority,
    title: topic.spreadTitle || topic.title,
    originalTitle: topic.title,
    core: topic.core,
    bossPain: topic.bossPain,
    moneyLine: topic.moneyLine,
    oldFrame: topic.oldFrame,
    newFrame: topic.newFrame,
    actionHint: topic.actionHint,
    evidenceBoundary: topic.evidenceBoundary,
    scoreBreakdown: topic.scoreBreakdown || {},
    angles: list(topic.angles).map((angle) => ({
      title: angle.title || "",
      note: angle.note || "",
    })),
    rawMaterialSummary: {
      total: materials.length,
      businessSignals: materials.filter((item) => item.kind === "business_signal").length,
      firstLineViewpoints: materials.filter((item) => item.kind === "first_line_viewpoint").length,
      communityIntelligence: materials.filter((item) => item.kind === "community_intelligence").length,
    },
    rawMaterials: materials,
    sources: {
      businessSignals: materials.filter((item) => item.kind === "business_signal"),
      firstLineViewpoints: materials.filter((item) => item.kind === "first_line_viewpoint"),
      communityIntelligence: materials.filter((item) => item.kind === "community_intelligence"),
    },
  };
}

function buildHermesTopicTable(data, topics) {
  return {
    meta: {
      version: data.meta.version,
      date: data.meta.date,
      generatedAt: data.meta.generatedAt,
      source: "topic-center.json",
      rule: "hermes_all_topic_table",
      readMode: "all_topics",
      topicCount: topics.length,
      githubPath: "01-SiteV2/site/data/topic-center-hermes.json",
      markdownPath: "01-SiteV2/site/data/topic-center-hermes.md",
      pagesJsonPath: "/data/topic-center-hermes.json",
      pagesMarkdownPath: "/data/topic-center-hermes.md",
    },
    topics: topics.map(compactTopic),
  };
}

function mdCell(value) {
  return text(value).replace(/\s+/gu, " ").replace(/\|/gu, "/");
}

function topicTableMarkdown(payload) {
  const rows = payload.topics.map((topic) => [
    topic.rank,
    topic.date,
    topic.score,
    topic.sourceName,
    topic.title,
    topic.bossPain,
    topic.moneyLine,
    topic.actionHint,
  ].map(mdCell));
  return [
    `# Hermes Topic Table - ${payload.meta.date}`,
    "",
    `- version: ${payload.meta.version}`,
    `- read_mode: ${payload.meta.readMode}`,
    `- topic_count: ${payload.meta.topicCount}`,
    `- json: ${payload.meta.githubPath}`,
    "",
    "| Rank | Date | Score | Type | Topic | Boss Pain | Money Line | Action |",
    "|---:|---|---:|---|---|---|---|---|",
    ...rows.map((row) => `| ${row.join(" | ")} |`),
    "",
    "## Raw Materials",
    "",
    ...payload.topics.flatMap((topic) => [
      `### ${topic.rank}. ${topic.title}`,
      "",
      ...list(topic.rawMaterials).map((material) => [
        `- ${material.role} / ${material.kind}: ${mdCell(material.title)}`,
        `  - source: ${mdCell(material.source || "-")}`,
        `  - url: ${mdCell(material.url || "-")}`,
        `  - local: ${mdCell(material.localDataPath || "-")}`,
        `  - note: ${mdCell(material.note || "-")}`,
      ].join("\n")),
      "",
    ]),
    "",
    "## Evidence Boundary",
    "",
    "Business signals are the factual base. First-line viewpoints and community intelligence are leads for demand, scenes, and spreadability; do not treat them as verified industry facts without separate source-first verification.",
    "",
  ].join("\n");
}

function main() {
  const businessData = readJson(businessSignalsPath, {});
  const firstLineData = readJson(firstLinePath, {});
  const date = argValue("date", text(businessData.meta?.activeDate || businessData.meta?.date || todayStr()));
  const communityDailyPath = path.join(siteDataDir, "community-intelligence-daily", `${date}.json`);
  const communityData = readJson(communityDailyPath, readJson(communityPath, {}));

  const businessSource = list(businessData.cards).length ? list(businessData.cards) : list(businessData.top10 || businessData.frontstageCards);
  const sameDateSignals = businessSource
    .map(normalizeBusinessSignal)
    .filter((item) => !businessData.meta?.activeDate || date === text(item.raw.date || businessData.meta.activeDate || date));
  const signals = sameDateSignals.length ? sameDateSignals : list(businessData.top10 || businessData.frontstageCards).map(normalizeBusinessSignal);

  const allViewpoints = list(firstLineData.remarks)
    .map(normalizeViewpoint)
    .sort((a, b) => b.engagement - a.engagement);
  const sameDateViewpoints = allViewpoints.filter((item) => !item.date || item.date === date);
  const viewpoints = sameDateViewpoints.length ? sameDateViewpoints : allViewpoints;

  const community = list(communityData.items)
    .map(normalizeCommunity)
    .sort((a, b) => (b.valueScore + b.opportunityScore) - (a.valueScore + a.opportunityScore));

  const currentTopics = dedupeTopics(buildTopicSet({ date, signals, viewpoints, community }))
    .sort((a, b) => b.score - a.score);
  const existingData = readJson(topicCenterJsonPath, {});
  const historicalTopics = list(existingData.topics).filter((topic) => text(topic.date) !== date);
  const topics = [...currentTopics, ...historicalTopics]
    .sort((a, b) => text(b.date).localeCompare(text(a.date)) || (Number(b.score) || 0) - (Number(a.score) || 0));

  const data = {
    meta: {
      version: topicCenterVersion,
      date,
      generatedAt: new Date().toISOString(),
      source: "business-signals + first-line-viewpoints + community-intelligence",
      rule: "boss_decision_topic_engine",
      ruleLabel: "老板决策型选题机制",
      updateMechanism: "每日 Business Signals 链路第 9 步运行，读取本地三类日更数据，确定性生成选题。",
      scoring: {
        bossPain: 25,
        moneyRelation: 25,
        talkability: 20,
        spreadability: 15,
        actionability: 10,
        styleFit: 5,
      },
      inputCounts: {
        businessSignals: signals.length,
        firstLineViewpoints: viewpoints.length,
        communityItems: community.length,
      },
      sources: sourceCounts(currentTopics),
      leadTopicId: currentTopics[0]?.id || "",
    },
    sources: engines,
    topics,
    grouped: {
      lead: currentTopics[0] || null,
      byEngine: Object.fromEntries(engines.map((engine) => [engine.id, currentTopics.filter((topic) => topic.sourceId === engine.id)])),
    },
  };
  const hermesTopicTable = buildHermesTopicTable(data, topics);

  writeJson(topicCenterJsonPath, data);
  fs.writeFileSync(topicCenterJsPath, `window.WaveSightTopicCenter = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  writeJson(topicCenterHermesJsonPath, hermesTopicTable);
  fs.writeFileSync(topicCenterHermesMdPath, topicTableMarkdown(hermesTopicTable), "utf8");
  console.log(`topic-center generated: ${topics.length} boss topics -> ${path.relative(root, topicCenterJsonPath)}`);
  console.log(`hermes topic table -> ${path.relative(root, topicCenterHermesJsonPath)}`);
  console.log(JSON.stringify(data.meta.inputCounts));
}

main();
