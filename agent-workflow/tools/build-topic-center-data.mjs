import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteDataDir = path.join(root, "01-SiteV2", "site", "data");
const businessSignalsPath = path.join(siteDataDir, "v3-data-observation-desk.json");
const firstLinePath = path.join(siteDataDir, "follow-builders-daily.json");
const communityPath = path.join(siteDataDir, "community-intelligence.json");
const topicCenterJsonPath = path.join(siteDataDir, "topic-center.json");
const topicCenterJsPath = path.join(siteDataDir, "topic-center.js");
const topicCenterVersion = "V2.0.0-boss-topic-engine";

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
  const match = text(value).match(/\d+(?:\.\d+)?\s*(?:%|亿美元|万美元|万美金|万|亿|人|个|条|小时|天|倍)/u);
  return match ? match[0].replace(/\s+/gu, "") : "";
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
  const serviceCallSignal = firstRanked(signals, ["90%", "来电", "电话", "voice agent", "servicetitan", "预约", "客服"], null, (item) => numberHint(`${item.title} ${item.fact}`) ? 5 : 0);
  const paymentSignal = firstRanked(signals, ["visa", "chatgpt", "零售", "购买", "支付", "doordash", "订单", "预订"]);
  const governanceSignal = firstRanked(signals, ["auto-review", "治理", "权限", "risk", "github enterprise", "cursor", "分类器", "guardrails"]);
  const workflowSignal = firstRanked(signals, ["perplexity", "deep research", "computer", "codex", "datasette", "报告", "演示文稿", "工作流"]);
  const fundingSignal = firstRanked(signals, ["120亿美元", "融资", "410亿美元", "prometheus", "theker", "poetic", "notch", "f2"]);
  const trainingSignal = firstRanked(signals, ["claude corps", "1000", "培训", "奖学金", "年薪", "非营利"]);

  const salesCommunity = firstRanked(community, ["客服", "销售", "订单", "成交", "gmv", "roi", "获客", "线索", "预约"], null, (item) => item.valueScore / 20 + item.opportunityScore / 30);
  const sopCommunity = firstRanked(community, ["sop", "知识库", "obsidian", "飞书", "skills", "skill", "流程", "标准化", "复购"], null, (item) => item.valueScore / 20);
  const codexCommunity = firstRanked(community, ["codex", "claude code", "做产品", "产品", "月入", "工作流", "一人公司"], null, (item) => item.opportunityScore / 20);
  const infraCommunity = firstRanked(community, ["1000块", "基建", "codex", "vps", "gmail", "mac mini", "工具配置", "老板"], null, (item) => item.valueScore / 25);
  const storyCommunity = firstRanked(community, ["75岁", "13岁", "05后", "父亲", "存款", "月入", "ai第一课", "诊所", "工作室"], null, (item) => item.valueScore / 20 + (numberHint(`${item.title} ${item.summary}`) ? 5 : 0));
  const contentCommunity = firstRanked(community, ["内容agent工厂", "内容工程化", "虚拟电商", "公众号", "小红书", "出单", "搜索占比"], null, (item) => item.opportunityScore / 20);

  const codexViewpoint = firstRanked(viewpoints, ["codex", "token consumption", "48 hours", "coding", "claude code", "cursor", "fortune 500", "60%"], null, (item) => item.engagement / 500);
  const modelWorkViewpoint = firstRanked(viewpoints, ["fable", "complex work", "financial services", "healthcare", "legal", "多步", "一致"], null, (item) => item.engagement / 500);
  const governanceViewpoint = firstRanked(viewpoints, ["governance", "accountable", "guardrails", "policy", "sabotaged", "security", "cluster"], null, (item) => item.engagement / 500);

  const callNumber = numberHint(`${serviceCallSignal?.title || ""} ${serviceCallSignal?.fact || ""}`) || "90%";
  const fundingNumber = numberHint(`${fundingSignal?.title || ""} ${fundingSignal?.fact || ""}`) || "120亿美元";

  return [
    topicPayload({
      engineId: "money_leak",
      date,
      title: `一个空调公司用 AI 接住 ${callNumber} 电话，老板们该醒醒了`,
      core: "老板最该先看的不是模型参数，而是公司每天有没有订单入口在漏钱。",
      relevance: "电话、客服、预约、销售跟进这类小岗位，直接连接收入，比泛泛 AI 工具更容易算账。",
      bossPain: "旺季电话漏接、线索忘跟、预约登记错，都会变成真实订单损失。",
      moneyLine: "先算少漏几个客户，再谈 AI 转型；接得住、记得准、转得动，就是收入入口的第一张账。",
      oldFrame: "AI 是客服聊天机器人。",
      newFrame: "AI 是能接住订单入口的小岗位员工。",
      actionHint: "先盘点公司 3 个最容易漏单的入口：电话、表单、私信。",
      businessSignals: [serviceCallSignal],
      viewpoints: [],
      communityItems: [salesCommunity],
      scoreParts: { pain: 25, money: 25, buzz: 19, spread: 14, action: 9, style: 5 },
      angles: [
        { title: "开头用订单入口，不用 AI 功能", note: `第一句就写：电话不是电话，是订单入口。用 ${callNumber} 把老板拉进来。` },
        { title: "中段拆一个预约岗位", note: "把接听、识别需求、确认地址、排师傅、同步订单拆成 5 步，说明 AI 为什么能先干这部分。" },
        { title: "结尾落到小岗位 AI 员工", note: "不要喊智能化转型，落到“先少漏几个订单”。" },
      ],
    }),
    topicPayload({
      engineId: "save_headcount",
      date,
      title: "不是裁员，而是少招 3 个重复岗位：老板该先改造这些活",
      core: "AI 真正进入企业，第一步不是替代整个人，而是接管岗位里的重复动作。",
      relevance: "客服质检、资料整理、会议任务、报价初审这类工作，适合用 SOP 和知识库先跑起来。",
      bossPain: "人越招越多，杂活没有变少，管理成本反而上来。",
      moneyLine: "能少招一个重复岗位，或者让一个人少返工 30%，老板就愿意继续投入。",
      oldFrame: "AI 上线就是裁员。",
      newFrame: "AI 上线的第一阶段，是让公司少招重复岗位。",
      actionHint: "把一个岗位每天重复超过 20 次的动作列出来，先挑 3 个标准动作交给 AI。",
      businessSignals: [workflowSignal || serviceCallSignal],
      viewpoints: [modelWorkViewpoint],
      communityItems: [sopCommunity],
      scoreParts: { pain: 23, money: 23, buzz: 16, spread: 13, action: 10, style: 5 },
      angles: [
        { title: "用岗位动作替代岗位名称", note: "不要写 AI 替代客服，写 AI 先替代接听、归档、质检、催办。" },
        { title: "把省人写成管理账", note: "老板关心的不是炫技，是少招人、少返工、少培训。" },
        { title: "给一个 10 步拆 3 步的方法", note: "结尾给老板一个小动作，方便转给团队执行。" },
      ],
    }),
    topicPayload({
      engineId: "peer_pressure",
      date,
      title: "你的同行已经用 AI 跑流程了，你还在让员工手动搬砖",
      core: "最能触发老板的不是技术解释，而是同行已经把 AI 用在获客、内容、交付和产品上。",
      relevance: "社群里的内容工厂、Codex 做产品、虚拟电商案例，说明 AI 正在从学习工具变成经营系统。",
      bossPain: "对手开始用 AI 降低生产成本时，你还在用人工流程硬扛。",
      moneyLine: "同行压力的核心不是焦虑，而是获客成本、交付成本和试错成本正在被重新定价。",
      oldFrame: "AI 是员工自己研究的新工具。",
      newFrame: "AI 是同行正在重做流程的生产系统。",
      actionHint: "每天只问一个问题：同行哪一个流程已经被 AI 缩短了？",
      businessSignals: [workflowSignal],
      viewpoints: [codexViewpoint],
      communityItems: [contentCommunity || codexCommunity],
      scoreParts: { pain: 22, money: 22, buzz: 19, spread: 15, action: 8, style: 5 },
      angles: [
        { title: "用同行压力开头", note: "标题和开头都不要讲 AI 多强，要讲别人已经开始用 AI 跑流程。" },
        { title: "拆获客、交付、产品三个场景", note: "每个场景只写一个真实动作，避免变成工具列表。" },
        { title: "落到老板的例会问题", note: "建议老板每周让团队汇报一个被 AI 缩短的流程。" },
      ],
    }),
    topicPayload({
      engineId: "pitfall",
      date,
      title: "AI 员工不能先上岗后管理：老板最容易漏掉的是权限",
      core: "Agent 能替你执行动作后，企业的核心问题从“会不会用”变成“谁来管”。",
      relevance: "Cursor Auto-review、GitHub Enterprise Agent 治理和安全观点都指向同一件事：AI 员工需要权限、审计和责任边界。",
      bossPain: "AI 一旦能读文件、调工具、改数据，错误不再只是内容不好，而是可能直接影响业务系统。",
      moneyLine: "权限没管住，省下的人力钱可能会被一次数据事故吃掉。",
      oldFrame: "AI 越自主越好。",
      newFrame: "AI 越自主，越需要先设计权限和复核。",
      actionHint: "先给 AI 员工分三级权限：只读、建议、可执行。",
      businessSignals: [governanceSignal],
      viewpoints: [governanceViewpoint],
      communityItems: [infraCommunity || sopCommunity],
      scoreParts: { pain: 22, money: 21, buzz: 18, spread: 13, action: 9, style: 5 },
      angles: [
        { title: "不要写安全科普，写老板责任", note: "老板不关心分类器模型，关心 AI 搞错后谁背锅。" },
        { title: "把权限拆成人话", note: "只读、建议、执行三个等级，比讲治理框架更容易传播。" },
        { title: "用反问推进", note: "难道 AI 能替你操作系统，你还不给它设边界？" },
      ],
    }),
    topicPayload({
      engineId: "counterintuitive",
      date,
      title: "真正值钱的不是 AI 工具，而是老板自己的工作流",
      core: "同一个 AI 工具，放在清楚流程里是员工，放在混乱流程里就是玩具。",
      relevance: "社群高价值案例集中在 Skill、Obsidian、飞书、知识库和 SOP，说明老板的私有流程资产正在变成核心生产资料。",
      bossPain: "工具买了一堆，员工不用；员工用了，效果差；最后老板误判 AI 不行。",
      moneyLine: "工具是支出，工作流是资产。支出会过期，资产能复用。",
      oldFrame: "追最新 AI 工具。",
      newFrame: "沉淀自己的流程、语料、SOP 和验收标准。",
      actionHint: "先选一个业务动作，写清输入、步骤、验收标准，再接工具。",
      businessSignals: [workflowSignal || trainingSignal],
      viewpoints: [codexViewpoint],
      communityItems: [sopCommunity],
      scoreParts: { pain: 24, money: 23, buzz: 18, spread: 15, action: 10, style: 5 },
      angles: [
        { title: "先打脸工具崇拜", note: "开头写：买工具不是 AI 转型，能稳定交付结果才算。" },
        { title: "中段用社群案例证明", note: "写 Skill、知识库、SOP 为什么比单个工具更耐用。" },
        { title: "结尾给金句", note: "AI 工具不是资产，能反复跑通的流程才是资产。" },
      ],
    }),
    topicPayload({
      engineId: "small_role",
      date,
      title: "别做大平台，先做一个小岗位的 AI 员工",
      core: "普通老板和服务商的机会，不在宏大平台，而在一个具体岗位的具体痛点里。",
      relevance: "今天的信号从 AI 语音客服、复杂企业流程自动化到受监管行业 AI 操作系统，都在证明岗位级 AI 正在成型。",
      bossPain: "老板最怕 AI 项目太大、太贵、太慢，最后没人用。",
      moneyLine: "一个岗位先打穿，比一个平台讲 100 个功能更容易收钱。",
      oldFrame: "做一个什么都能干的 AI 平台。",
      newFrame: "做一个只干一件事但能交付的小岗位 AI 员工。",
      actionHint: "先从客服、招投标、财务对账、销售跟进、会议催办里选一个。",
      businessSignals: [serviceCallSignal, fundingSignal].filter(Boolean),
      viewpoints: [],
      communityItems: [sopCommunity || salesCommunity],
      scoreParts: { pain: 25, money: 24, buzz: 18, spread: 15, action: 10, style: 5 },
      angles: [
        { title: "用小岗位对抗大平台", note: "这是最适合你现有表达的主线：不做大而全，先做小而深。" },
        { title: "每个岗位给一个可验收结果", note: "客服看接通率，标书看漏项率，对账看差异报告，会议看任务闭环。" },
        { title: "避免写成创业方向清单", note: "要写一个岗位打穿逻辑，不要罗列 10 个机会。" },
      ],
    }),
    topicPayload({
      engineId: "big_small_contrast",
      date,
      title: `有人 ${fundingNumber} 押注物理 AI，有人 1000 块帮老板装 Codex`,
      core: "AI 赚钱分两层：顶层拼资本和研发，底层拼老板现场的配置、流程和交付。",
      relevance: "大融资说明资本在押注长期方向；社群里的 AI 基建服务说明普通人可以从老板的第一步配置开始收钱。",
      bossPain: "老板看不懂大融资，但愿意为“帮我把 AI 用起来”付第一笔小钱。",
      moneyLine: "大厂赚基础设施的钱，小服务商赚落地第一公里的钱。",
      oldFrame: "AI 创业只能跟大模型和融资有关。",
      newFrame: "普通人的 AI 机会在帮老板跨过工具配置和流程落地门槛。",
      actionHint: "把 AI 基建服务产品化：账号、网络、工具、知识库、一个工作流。",
      businessSignals: [fundingSignal],
      viewpoints: [codexViewpoint],
      communityItems: [infraCommunity],
      scoreParts: { pain: 21, money: 24, buzz: 20, spread: 15, action: 8, style: 5 },
      angles: [
        { title: "用大钱和小钱制造冲突", note: "大融资负责制造注意力，小服务负责让老板觉得和自己有关。" },
        { title: "写出两套赚钱逻辑", note: "资本逻辑：长期技术押注；服务逻辑：帮老板完成第一公里。" },
        { title: "落到可卖服务包", note: "账号配置、工具安装、知识库搭建、首个工作流，这是老板可理解的产品。" },
      ],
    }),
    topicPayload({
      engineId: "person_story",
      date,
      title: "75 岁 ISO 专家遇上 AI，我看到传统行业最大的机会",
      core: "AI 普及不是让所有人学会新工具，而是把老专家几十年的经验变成可复用系统。",
      relevance: "社群故事里的 200G 文件、15 万文档、认证材料和标准更新，比泛泛讲知识库更有传播画面。",
      bossPain: "很多传统行业老板最大的资产不是软件，而是老员工、老专家、老资料，但这些资产正在散落和流失。",
      moneyLine: "把经验沉淀成知识库和 SOP，等于把个人能力变成公司资产。",
      oldFrame: "年纪大的人学不会 AI。",
      newFrame: "AI 最该先服务那些经验很深、资料很多、流程很重的人。",
      actionHint: "先把老专家的资料、模板、常见问题和交付流程整理成一个可问答知识库。",
      businessSignals: [trainingSignal || workflowSignal],
      viewpoints: [],
      communityItems: [storyCommunity || sopCommunity],
      scoreParts: { pain: 23, money: 21, buzz: 20, spread: 14, action: 9, style: 5 },
      angles: [
        { title: "用人物场景开头", note: "不要先讲知识库，先写 75 岁老专家还在手动整理认证文件。" },
        { title: "把温情转成商业判断", note: "重点不是感动，而是传统行业的经验资产终于能系统化。" },
        { title: "结尾回到老板资产", note: "老员工脑子里的经验，不沉淀就是个人能力，沉淀出来才是公司资产。" },
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

  const viewpoints = list(firstLineData.remarks)
    .map(normalizeViewpoint)
    .sort((a, b) => b.engagement - a.engagement);

  const community = list(communityData.items)
    .map(normalizeCommunity)
    .sort((a, b) => (b.valueScore + b.opportunityScore) - (a.valueScore + a.opportunityScore));

  const topics = dedupeTopics(buildTopicSet({ date, signals, viewpoints, community }))
    .sort((a, b) => b.score - a.score);

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
      sources: sourceCounts(topics),
      leadTopicId: topics[0]?.id || "",
    },
    sources: engines,
    topics,
    grouped: {
      lead: topics[0] || null,
      byEngine: Object.fromEntries(engines.map((engine) => [engine.id, topics.filter((topic) => topic.sourceId === engine.id)])),
    },
  };

  writeJson(topicCenterJsonPath, data);
  fs.writeFileSync(topicCenterJsPath, `window.WaveSightTopicCenter = ${JSON.stringify(data, null, 2)};\n`, "utf8");
  console.log(`topic-center generated: ${topics.length} boss topics -> ${path.relative(root, topicCenterJsonPath)}`);
  console.log(JSON.stringify(data.meta.inputCounts));
}

main();
