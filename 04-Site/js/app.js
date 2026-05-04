const seedData = window.AI_RADAR_DATA || { signals: [], scoring: { rows: [] }, trends: [], points: [], pointTopics: [], opportunities: [] };
const storageKey = "ai-business-radar-state-v2";
const accessKey = "ai-business-radar-access";
const userKey = "wavesight-users";
const sessionKey = "wavesight-session";
const settingsKey = "wavesight-membership-settings";
const ordersKey = "wavesight-orders";
const defaultQuestions = ["解决什么具体问题？", "目标客户是谁？", "替代或优化什么流程？", "商业模式（怎么赚钱）", "为什么现在值得关注？", "是否可迁移中国市场？"];
const planCatalog = {
  monthly: {
    id: "monthly",
    name: "月度会员",
    months: 1,
    price: 199,
    note: "适合先建立观察节奏，快速判断观澜AI是否能减少你的信息筛选成本。",
    bestFor: "适合短期观察、项目调研和临时选题判断。",
    includes: ["每日商业变化主线", "完整 Signals 脉络", "机会卡与趋势观察"],
  },
  quarterly: {
    id: "quarterly",
    name: "季度会员",
    months: 3,
    price: 499,
    note: "适合连续跟踪一个业务方向，看信号是否从单点新闻变成可复盘的商业趋势。",
    bestFor: "适合业务负责人、投资观察者和资源连接方。",
    includes: ["连续 90 天趋势观察", "Priority Engine 机会排序", "机会卡验证线索"],
  },
  yearly: {
    id: "yearly",
    name: "年度会员",
    months: 12,
    price: 1680,
    note: "适合把观澜AI作为长期情报层，持续跟踪 AI 在行业、客户和收入侧的真实变化。",
    bestFor: "适合长期经营规划、年度选题和团队内部情报复盘。",
    includes: ["全年 Daily Brief 与历史回看", "Signals / Trends / Opportunities 全量阅读", "适合沉淀团队 AI 商业观察库"],
  },
};

let state = loadState();
let selectedId = state.signals[0]?.id || null;
let editingId = null;
let visualEditing = false;

const $ = (selector) => document.querySelector(selector);
const page = document.body.dataset.page || "home";
const params = new URLSearchParams(location.search);
const hiddenSignalDates = new Set(["2026-04-28", "2026/04/28", "2026.04.28", "04-28", "04/28", "4.28"]);

function loadState() {
  const saved = localStorage.getItem(storageKey);
  const base = structuredClone(seedData);
  if (!saved) return base;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.sourceGeneratedAt !== seedData.generatedAt) return base;
    const savedSignals = Array.isArray(parsed.signals) ? parsed.signals : [];
    const savedSignalMap = new Map(savedSignals.map((signal) => [signal.id, signal]));
    const baseSignalIds = new Set(base.signals.map((signal) => signal.id));
    const mergedSignals = [
      ...base.signals.map((signal) => {
        if (!savedSignalMap.has(signal.id)) return signal;
        const savedSignal = savedSignalMap.get(signal.id);
        return {
          ...signal,
          ...savedSignal,
          relatedOpportunityIds: signal.relatedOpportunityIds || [],
          relatedOpportunityNames: signal.relatedOpportunityNames || [],
          relatedTrendNames: signal.relatedTrendNames || [],
        };
      }),
      ...savedSignals.filter((signal) => signal.id && !baseSignalIds.has(signal.id)),
    ];
    const merged = { ...base, ...parsed, signals: mergedSignals };
    merged.scoring = parsed.scoring?.rows ? parsed.scoring : base.scoring;
    merged.trends = Array.isArray(parsed.trends) ? parsed.trends : base.trends;
    merged.points = Array.isArray(parsed.points) ? parsed.points : base.points || [];
    merged.pointTopics = Array.isArray(parsed.pointTopics) ? parsed.pointTopics : base.pointTopics || [];
    merged.opportunities = Array.isArray(parsed.opportunities) ? parsed.opportunities : base.opportunities || [];
    return merged;
  } catch {
    return base;
  }
}

function saveState() {
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      signals: state.signals,
      scoring: state.scoring,
      trends: state.trends,
      points: state.points || [],
      pointTopics: state.pointTopics || [],
      opportunities: state.opportunities,
      sourceGeneratedAt: seedData.generatedAt,
    })
  );
}

function setStatusMessage(target, message) {
  const element = typeof target === "string" ? $(target) : target;
  if (element) element.textContent = message;
}

function canWriteSiteData() {
  return location.protocol !== "file:" && ["localhost", "127.0.0.1"].includes(location.hostname);
}

async function persistState(statusTarget = null, successText = "已保存到数据文件，刷新后仍会保留。") {
  saveState();
  if (!canWriteSiteData()) {
    setStatusMessage(statusTarget, "已保存到当前浏览器。要写入网站数据文件，请通过 http://localhost:8787/admin.html 打开管理页。");
    return false;
  }
  try {
    setStatusMessage(statusTarget, "正在写入网站数据文件...");
    const response = await fetch("/api/save-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) throw new Error(result.message || "写入失败。");
    state.generatedAt = result.generatedAt || state.generatedAt;
    localStorage.removeItem(storageKey);
    setStatusMessage(statusTarget, successText);
    return true;
  } catch (error) {
    setStatusMessage(statusTarget, `已保存到当前浏览器，但写入数据文件失败：${error.message}`);
    return false;
  }
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + Number(days || 0));
  return next.toISOString().slice(0, 10);
}

function addMonths(date, months) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + Number(months || 0));
  return next.toISOString().slice(0, 10);
}

function formatDate(value = "") {
  return value ? String(value).slice(0, 10) : "-";
}

function getMembershipSettings() {
  try {
    return { trialDays: 7, ...(JSON.parse(localStorage.getItem(settingsKey) || "{}") || {}) };
  } catch {
    return { trialDays: 7 };
  }
}

function saveMembershipSettings(settings) {
  localStorage.setItem(settingsKey, JSON.stringify({ trialDays: 7, ...settings }));
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(userKey) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(userKey, JSON.stringify(users));
}

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ordersKey) || "[]");
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ordersKey, JSON.stringify(orders));
}

function currentSessionId() {
  return localStorage.getItem(sessionKey) || "";
}

function currentUser() {
  const id = currentSessionId();
  return getUsers().find((user) => user.id === id) || null;
}

function setCurrentUser(user) {
  localStorage.setItem(sessionKey, user.id);
}

function clearCurrentUser() {
  localStorage.removeItem(sessionKey);
}

function updateUser(userId, patch) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index === -1) return null;
  users[index] = { ...users[index], ...patch, updatedAt: new Date().toISOString() };
  saveUsers(users);
  return users[index];
}

function isPermissionActive(user = currentUser()) {
  if (!user) return false;
  if (user.role === "admin") return true;
  return String(user.accessUntil || "") >= todayDate();
}

function isAdminSession() {
  return localStorage.getItem(accessKey) === "approved" || currentUser()?.role === "admin";
}

function hasAccess() {
  return isAdminSession() || isPermissionActive();
}

function currentReturnPath() {
  return encodeURIComponent(`${location.pathname.split("/").pop() || "index.html"}${location.search || ""}`);
}

function userAccessLabel(user = currentUser()) {
  if (!user) return "未登录";
  if (user.role === "admin") return "管理员";
  if (isPermissionActive(user)) return `有效期至 ${formatDate(user.accessUntil)}`;
  return "阅读权限已到期";
}

function requireAccess() {
  if (!document.body.dataset.protected || hasAccess()) return true;
  const main = $("main");
  const user = currentUser();
  const expired = Boolean(user) && !isPermissionActive(user);
  if (main) {
    main.innerHTML = `
      <section class="locked-screen">
        <p class="eyebrow">Member Access</p>
        <h1>${expired ? "阅读权限已到期" : "登录后查看完整信号脉络"}</h1>
        <p>${expired ? "你的阅读权限已结束。续订后可继续查看 Daily Brief、Signals、Trends 和 Opportunities 的完整内容。" : "注册后可查看完整信号脉络、趋势复盘和机会拆解。"}</p>
        <div class="hero-actions">
          <a class="primary-btn as-link" href="${expired ? "./pricing.html" : `./register.html?return=${currentReturnPath()}`}">${expired ? "查看订阅方案" : "注册"}</a>
          <a class="ghost-btn as-link" href="./login.html">登录</a>
          <a class="ghost-btn as-link" href="./index.html">返回首页</a>
        </div>
      </section>
    `;
  }
  return false;
}

function clean(text = "") {
  return String(text).replace(/[🔥👀📈📊⬆➡⚠]/g, "").trim();
}

function isHiddenSignal(signal = {}) {
  const date = String(signal.date || signal.publishedAt || "").trim();
  return isHiddenDailyDate(date);
}

function isHiddenDailyDate(value = "") {
  const date = String(value || "").trim();
  return hiddenSignalDates.has(date) || /^2026[-/.]0?4[-/.]28$/.test(date);
}

function publicSignals() {
  return state.signals.filter((signal) => !isHiddenSignal(signal));
}

function markdownToText(value = "") {
  return String(value)
    .replace(/\(\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)\)/g, "$1")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g, "$1");
}

function renderInlineMarkdown(value = "") {
  const text = String(value || "");
  const linkPattern = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g;
  let html = "";
  let lastIndex = 0;
  for (const match of text.matchAll(linkPattern)) {
    let start = match.index;
    let end = start + match[0].length;
    let before = text.slice(lastIndex, start);
    const wrappedByParens = before.endsWith("(") && text[end] === ")";
    if (wrappedByParens) {
      before = before.slice(0, -1);
      end += 1;
    }
    html += escapeHtml(before);
    html += `<a class="external-link" href="${escapeHtml(match[2])}" target="_blank" rel="noopener noreferrer">${escapeHtml(match[1])}</a>`;
    lastIndex = end;
  }
  html += escapeHtml(text.slice(lastIndex));
  return html;
}

function stripSourceLinks(value = "") {
  return clean(
    String(value || "")
      .replace(/(?:^|\s)(?:补充|来源|新闻来源|原始来源)[：:][\s\S]*?(?:\[[^\]]+\]\((?:https?:\/\/)[^)]*\)|https?:\/\/\S+)[\s\S]*$/g, "")
      .replace(/\s*[（(]?\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)[）)]?/g, "")
      .replace(/\s*https?:\/\/[^\s)]+/g, "")
      .replace(/\s{2,}/g, " ")
  );
}

function normalizeText(text = "") {
  return clean(text).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function aliasesOf(text = "") {
  const value = clean(text);
  const aliases = [value, value.replace(/[（(][^）)]+[）)]/g, "")];
  aliases.push(...[...value.matchAll(/[（(]([^）)]+)[）)]/g)].map((match) => match[1]));
  return aliases.map(normalizeText).filter(Boolean);
}

function sameProductName(left = "", right = "") {
  const leftAliases = aliasesOf(left);
  const rightAliases = aliasesOf(right);
  return leftAliases.some((a) => rightAliases.some((b) => a.includes(b) || b.includes(a)));
}

function textValue(value = "") {
  if (typeof value === "string") return clean(markdownToText(value));
  if (!value || typeof value !== "object") return "";
  return clean(markdownToText(value["一句话机会定义"] || value["为什么是现在"] || Object.values(value).find(Boolean) || ""));
}

function shortText(value = "", max = 46) {
  const text = clean(textValue(value)).replace(/\s+/g, " ");
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

function scoreOf(signal = {}) {
  if (signal.score && (!signal.date || !signal.score.date || signal.score.date === signal.date)) return signal.score;
  const rows = state.scoring.rows || [];
  const matches = (row) => sameProductName(row.product, signal.product) || sameProductName(row.product, signal.title);
  return rows.find((row) => row.date === signal.date && matches(row)) || rows.find(matches) || null;
}

function signalBrief(signal = {}) {
  return shortText(signal.summary || signal.title || signal.evidence || signal.newsType, 44);
}

function signalHeadline(signal = {}) {
  return clean(signal.title || signal.product || "Signal");
}

function signalLead(signal = {}, max = 120) {
  const text = clean(textValue(signal.summary || signal.evidence || signal.analysis || ""));
  if (!text) return signalHeadline(signal);
  const sentences = text
    .split(/(?<=[。！？!?])\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
  const lead = sentences.slice(0, 2).join("");
  return shortText(lead || text, max);
}

function signalLeadBody(signal = {}) {
  return stripSourceLinks(signal.summary || "暂无简介。") || "暂无简介。";
}

function signalSentences(signal = {}) {
  const text = clean(textValue(signal.summary || signal.evidence || signal.analysis || ""));
  return text
    .split(/(?<=[。！？!?])\s*/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function signalEventText(signal = {}) {
  return shortText(signalSentences(signal)[0] || signalHeadline(signal), 78);
}

function signalNewsDetail(signal = {}) {
  const text = stripSourceLinks(signal.summary || "");
  const blocks = text
    .split(/补充[:：]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const meaningMarkers = ["它的商业含义", "其核心价值", "核心商业意义", "商业意义在于", "这说明", "这意味着"];
  const facts = blocks
    .map((block) => {
      const cutIndex = meaningMarkers.reduce((best, marker) => {
        const index = block.indexOf(marker);
        return index >= 0 && (best < 0 || index < best) ? index : best;
      }, -1);
      return clean(cutIndex >= 0 ? block.slice(0, cutIndex) : block);
    })
    .filter(Boolean);
  return [...new Set(facts)].join("\n\n") || signalEventText(signal);
}

function signalNewsSourceMeta(signal = {}) {
  const source = markdownSourceLinks(signal.source || "")[0];
  const urls = Array.isArray(signal.urls) ? signal.urls : urlsFromText(signal.urls || "");
  const url = source?.url || urls[0] || "";
  return {
    sourceName: source?.label || (url ? sourceHostLabel(url, 0) : "原始来源"),
    url,
    date: signal.publishedAt || signal.date || "",
  };
}

function signalMeaningText(signal = {}) {
  const sentences = signalSentences(signal);
  return shortText(sentences[1] || sentences[0] || signalBrief(signal), 92);
}

function signalDecisionTitle(signal = {}) {
  const title = signalHeadline(signal);
  const claim = title.split(/[：:]/).slice(1).join("：").trim();
  return shortText(claim || title, 28);
}

function signalDetailTitle(signal = {}) {
  const title = signalHeadline(signal);
  const claim = title.split(/[：:]/).slice(1).join("：").trim() || title;
  return shortText(claim.replace(/(AI)\s*从[^，。；：:]{2,18}进入/, "$1 进入"), 24);
}

function dailyEvidenceStrength(signals = []) {
  const tiers = [...new Set(signals.map((signal) => clean(signal.sourceTier)).filter(Boolean))].slice(0, 3);
  return tiers.length ? `${tiers.join(" / ")} 级来源` : "来源待补";
}

const eventTypeRules = [
  { label: "融资", pattern: /融资|投资|领投|估值|资本|轮\b|Series/i },
  { label: "客户采用", pattern: /企业采用|客户采用|客户案例|部署|签约|落地|央国企|医院|金融机构/ },
  { label: "收入验证", pattern: /收入|营收|ARR|续费|复购|付费|商业化|盈利/ },
  { label: "平台数据", pattern: /平台数据|每周|日活|月活|注册|对话|使用量|规模证据/ },
  { label: "产品发布", pattern: /产品发布|发布|推出|上线|API|模型发布|功能发布/ },
  { label: "监管/政策", pattern: /监管|政策|合规|身份治理|安全治理|受阻|限制/ },
  { label: "采购/招标", pattern: /采购|招标|投标|中标|政府采购/ },
  { label: "并购整合", pattern: /并购|收购|合并|整合|退出/ },
];

const eventTypePriority = new Map(eventTypeRules.map((rule, index) => [rule.label, index]));

function normalizedEventTypes(signal = {}) {
  const stored = Array.isArray(signal.eventTypes) ? signal.eventTypes : [];
  const storedTypes = stored.filter((item) => eventTypePriority.has(item));
  if (storedTypes.length) return storedTypes.slice(0, 1);
  const explicitTerms = String(signal.newsType || "")
    .split(/[\/｜|,，、;；\n]/)
    .map(clean)
    .filter(Boolean);
  for (const term of explicitTerms) {
    const hit = eventTypeRules.find((rule) => rule.pattern.test(term));
    if (hit) return [hit.label];
  }
  const text = textValue([signal.title, signal.summary, signal.evidence, signal.analysis].filter(Boolean).join(" "));
  const hit = eventTypeRules.find((rule) => rule.pattern.test(text));
  return hit ? [hit.label] : [];
}

function dailyChangeType(signals = []) {
  const counts = new Map();
  for (const signal of signals) {
    for (const type of normalizedEventTypes(signal)) counts.set(type, (counts.get(type) || 0) + 1);
  }
  const types = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || eventTypePriority.get(a[0]) - eventTypePriority.get(b[0]))
    .map(([type]) => type)
    .slice(0, 2);
  return types.length ? types.join(" / ") : "商业信号";
}

function dailyTrendStatus(trends = []) {
  const trend = trends[0];
  if (!trend) return "暂无关联趋势";
  const status = clean(trend.statusLabel || trendStatusMeta(trend.status).label);
  return `${trend.track}：${status || "观察中"}`;
}

function signalContext(signal = {}) {
  const score = scoreOf(signal);
  return [signal.product, signal.track || score?.track, signal.date, score?.total ? `${score.total}/30` : ""].filter(Boolean).join(" · ");
}

function trendBrief(trend = {}) {
  return shortText(trend.summary || trend.verdict || trend.thirtyDay || trend.sevenDay, 58);
}

function trendStatusMeta(status = "") {
  return {
    rising: { label: "持续升温", group: "升温中" },
    splitting: { label: "分化观察", group: "分化中" },
    cooling: { label: "降温观察", group: "降温观察" },
    emerging: { label: "新出现", group: "新出现" },
    mature: { label: "成熟化", group: "成熟化" },
    risk: { label: "风险变量", group: "风险变量" },
    invalidating: { label: "反证增强", group: "反证增强" },
  }[status] || { label: "观察中", group: "观察中" };
}

function trendScoringRows(trend = {}) {
  const ids = new Set(trend.relatedScoringIds || []);
  return (state.scoring.rows || []).filter((row) => ids.has(row.id));
}

function trendOpportunities(trend = {}) {
  const ids = new Set(trend.relatedOpportunityIds || []);
  return (state.opportunities || []).filter((opp) => ids.has(opp.id));
}

function renderTrendBars(trend = {}, height = 70) {
  const scores = trend.scores?.length ? trend.scores : trendScoringRows(trend).map((row) => ({ date: row.date, score: row.total }));
  const max = Math.max(1, ...scores.map((item) => item.score || 0));
  return `<div class="trend-line">${scores.map((item) => `<span title="${escapeHtml(item.date || "-")} ${escapeHtml(item.score || "-")}" style="height:${Math.max(12, ((item.score || 1) / max) * height)}px"></span>`).join("")}</div>`;
}

function renderEvidenceLadder(trend = {}) {
  const ladder = trend.evidenceLadder || [];
  return `<ol class="evidence-ladder">${ladder.map((item) => `<li class="${item.active ? "active" : ""}"><span></span>${escapeHtml(item.label)}</li>`).join("")}</ol>`;
}

function renderTemperature(trend = {}) {
  const temp = trend.opportunityTemperature || {};
  const labels = [
    ["资金温度", temp.funding],
    ["客户温度", temp.customer],
    ["产品成熟", temp.product],
    ["竞争缓冲", temp.competitionRoom],
    ["监管可控", temp.regulation],
    ["中国适配", temp.chinaFit],
  ];
  return `<div class="temperature-grid">${labels.map(([label, value]) => renderMiniScore(label, value)).join("")}</div>`;
}

function opportunityBrief(opp = {}) {
  return shortText(opp.summary || opp.coreProblem || opp.targetCustomer || opp.industry, 44);
}

function homeTrendMeta(trend = {}) {
  return [
    trend.statusLabel || trendStatusMeta(trend.status).label,
    trend.latestScore ? `评分 ${trend.latestScore}/30` : "",
    trend.relatedSignalIds?.length ? `${trend.relatedSignalIds.length} Signals` : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function homeTrendInsight(trend = {}) {
  const text = clean(trend.summary || trend.verdict || trend.thirtyDay || trend.sevenDay);
  if (text) return shortText(text, 56);
  if ((trend.latestScore || 0) >= 26) return "评分较高，后续重点看客户采用和收入迹象是否延续。";
  return "仍属早期趋势，先看相关迹象是否连续出现。";
}

function homeOpportunityMeta(opp = {}) {
  return [
    opp.priorityScore ? `评分 ${opp.priorityScore}/30` : opp.priority || "",
    opp.evidenceLevel ? `来源 ${opp.evidenceLevel}` : "",
    opp.relatedTrendTracks?.[0] || opp.industry || "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function homeOpportunityInsight(opp = {}) {
  const definition = opp.summary?.["一句话机会定义"] || opp.summary?.["为什么是现在"] || opportunityBrief(opp);
  return shortText(definition, 58);
}

function scoreOpportunityName(row = {}) {
  if (row.opportunityTitle) return clean(row.opportunityTitle);
  if (row.opportunityName) return clean(row.opportunityName);
  const product = clean(row.product || "");
  const known = [
    [/Hightouch/i, "AI营销平台"],
    [/Avoca/i, "AI客服/语音Agent"],
    [/Parallel Web Systems/i, "AI Agent基础设施"],
    [/OpenAI Workspace Agents/i, "企业Agent工作流"],
    [/Cognizant|Astreya/i, "AI基础设施服务并购"],
    [/LeapMind/i, "AI增长Agent"],
    [/Vanta/i, "企业AI治理"],
    [/中数睿智/i, "企业级Agent操作系统"],
    [/Box Automate/i, "企业文档AI Agent"],
    [/MemoraX/i, "AI记忆层基础设施"],
    [/Netomi/i, "AI客服Agent"],
    [/Factory/i, "AI编程Agent"],
    [/Mizzen/i, "AI用户研究"],
    [/星动纪元/i, "具身智能物流"],
    [/JuliaHub/i, "AI工程仿真"],
    [/Loopit/i, "AI Native互动内容"],
  ];
  const hit = known.find(([pattern]) => pattern.test(product));
  if (hit) return hit[1];
  return product.replace(/[（(][^）)]+[）)]/g, "").trim() || clean(row.track || "机会方向");
}

function scoreSourceName(row = {}) {
  if (row.representativeCase) return clean(row.representativeCase);
  const product = clean(row.product || "");
  const source = product.match(/[（(]([^）)]+)[）)]/)?.[1] || product;
  return source === scoreOpportunityName(row) ? "" : source;
}

function scoreTrackFallback(row = {}) {
  const name = scoreOpportunityName(row);
  return (state.scoring.rows || []).find((item) => scoreOpportunityName(item) === name && item.track)?.track || "";
}

function verdictLabel(value = "") {
  const raw = clean(typeof value === "object" ? value.verdict : value);
  if (/做多|优先/.test(raw)) return "优先验证";
  if (/观察|跟踪|中性/.test(raw)) return "持续观察";
  if (/谨慎|回避|暂缓|做空/.test(raw)) return "暂缓投入";
  return raw || "-";
}

function scoreLevelClass(row = {}) {
  const total = Number(row.total || 0);
  if (total >= 26) return "score-high";
  if (total >= 22) return "score-mid";
  return "score-low";
}

function scoreRowsForDisplay(rows = state.scoring.rows || []) {
  const latestByOpportunity = new Map();
  for (const row of rows) {
    const key = row.opportunityId || normalizeText(scoreOpportunityName(row));
    const existing = latestByOpportunity.get(key);
    if (!existing || String(row.date || "") > String(existing.date || "") || (String(row.date || "") === String(existing.date || "") && (row.total || 0) > (existing.total || 0))) {
      latestByOpportunity.set(key, { ...row, track: row.track || existing?.track || scoreTrackFallback(row) });
    } else if (!existing.track && (row.track || scoreTrackFallback(existing))) {
      latestByOpportunity.set(key, { ...existing, track: row.track || scoreTrackFallback(existing) });
    }
  }
  return [...latestByOpportunity.values()].sort((a, b) => (b.total || 0) - (a.total || 0) || String(b.date || "").localeCompare(String(a.date || "")));
}

function visibleTags(tags = [], limit = 8) {
  const list = (tags || []).filter(Boolean);
  const visible = list.slice(0, limit);
  const rest = list.length - visible.length;
  return visible.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("") + (rest > 0 ? `<span class="chip muted-chip">+${rest}</span>` : "");
}

function normalizedOpportunity(signal = {}) {
  const current = Array.isArray(signal.opportunity) ? signal.opportunity : [];
  return defaultQuestions.map((question, index) => {
    const existing = current[index] || current.find((item) => clean(item.question) === question);
    return {
      id: index + 1,
      question: existing?.question || question,
      answer: existing?.answer || "",
    };
  });
}

function localSlug(value = "", fallback = "item") {
  const slug = clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || fallback;
}

function signalSlug(signal = {}) {
  return signal.slug || localSlug(`${signal.date || ""}-${signal.product || ""}-${signal.track || ""}`, signal.id || "signal");
}

function opportunitySlug(item = {}) {
  return item.slug || localSlug(`${item.opportunityId || "opportunity"}-${item.title || ""}`, item.id || "opportunity");
}

function trendSlug(item = {}) {
  return item.slug || localSlug(item.track || item.id || "trend", item.id || "trend");
}

function signalUrl(signal = {}) {
  return `./signal.html?slug=${encodeURIComponent(signalSlug(signal))}`;
}

function opportunityUrl(item = {}) {
  return `./opportunity.html?slug=${encodeURIComponent(opportunitySlug(item))}`;
}

function trendUrl(item = {}) {
  return `./trend.html?slug=${encodeURIComponent(trendSlug(item))}`;
}

function pointSlug(item = {}) {
  return item.slug || localSlug(item.title || item.id || "point", item.id || "point");
}

function pointUrl(item = {}) {
  return `./point.html?slug=${encodeURIComponent(pointSlug(item))}`;
}

function pointSourceUrl(item = {}) {
  return `./point-source.html?slug=${encodeURIComponent(item.slug || item.id || "")}`;
}

function pointDailyUrl(date = "") {
  return `./point-daily.html?date=${encodeURIComponent(date)}`;
}

function dailyUrl(date = "") {
  return `./daily-detail.html?date=${encodeURIComponent(date)}`;
}

function init() {
  renderAuthControls();
  if (!requireAccess()) return;
  if (page === "home") renderHome();
  if (page === "daily") renderDailyPage();
  if (page === "daily-detail") renderDailyDetailPage();
  if (page === "the-point") renderThePointPage();
  if (page === "point-daily") renderPointDailyPage();
  if (page === "point-detail") renderPointDetailPage();
  if (page === "point-source") renderPointSourcePage();
  if (page === "signals") renderSignalsPage();
  if (page === "signal-detail") renderSignalDetailPage();
  if (page === "scoring") renderScoring();
  if (page === "trends") renderTrends();
  if (page === "trend-detail") renderTrendDetailPage();
  if (page === "opportunities") renderOpportunitiesPage();
  if (page === "opportunity-detail") renderOpportunityDetailPage();
  if (page === "tags") renderTagsPage();
  if (page === "register") renderRegisterPage();
  if (page === "login") renderLoginPage();
  if (page === "account") renderAccountPage();
  if (page === "pricing") renderPricingPage();
  if (page === "checkout") renderCheckoutPage();
  if (page === "apply") renderLegacyAccessPage();
  if (page === "admin") renderAdminPage();
  bindGlobalEvents();
}

function bindGlobalEvents() {
  $("#resetBtn")?.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    state = structuredClone(seedData);
    selectedId = state.signals[0]?.id || null;
    location.reload();
  });
  $("#syncHelpBtn")?.addEventListener("click", () => $("#helpDialog")?.showModal());
  installVisualEditToolbar();
}

function renderAuthControls() {
  const toolbar = $(".toolbar");
  if (!toolbar || page === "admin") return;
  toolbar.querySelectorAll("[data-auth-control]").forEach((node) => node.remove());
  const user = currentUser();
  if (user) {
    toolbar.insertAdjacentHTML(
      "beforeend",
      `<a data-auth-control class="ghost-btn as-link" href="./account.html">账户</a>
       <a data-auth-control class="primary-btn as-link" href="./pricing.html">${isPermissionActive(user) ? "订阅" : "续订"}</a>
       <button data-auth-control id="logoutBtn" class="ghost-btn">退出</button>`
    );
  } else {
    toolbar.insertAdjacentHTML(
      "beforeend",
      `<a data-auth-control class="ghost-btn as-link" href="./login.html">登录</a>
       <a data-auth-control class="primary-btn as-link" href="./register.html">注册</a>`
    );
  }
  $("#logoutBtn")?.addEventListener("click", () => {
    clearCurrentUser();
    location.href = "./index.html";
  });
}

function renderHome() {
  renderStats();
  renderHomeHighlights();
  drawRadar();
}

function renderStats() {
  const scores = state.signals.map(scoreOf).filter(Boolean);
  if ($("#statSignals")) $("#statSignals").textContent = state.signals.length;
  if ($("#statLong")) $("#statLong").textContent = scores.filter((score) => score.verdict === "做多").length;
  if ($("#statTopScore")) $("#statTopScore").textContent = Math.max(0, ...scores.map((score) => score.total));
  if ($("#statTrends")) $("#statTrends").textContent = state.trends.length;
  if ($("#statOpportunities")) $("#statOpportunities").textContent = state.opportunities.length;
}

function pointsForDate(date = "") {
  return (state.points || [])
    .filter((point) => !date || point.date === date)
    .sort((a, b) => (b.pointScore || 0) - (a.pointScore || 0) || (a.rank || 99) - (b.rank || 99));
}

function latestPointDate() {
  return [...new Set((state.points || []).map((point) => point.date).filter(Boolean))].sort().at(-1) || "";
}

function pointTitle(point = {}) {
  return clean(point.title || point.pointSummary || "The Point");
}

function pointBrief(point = {}, max = 72) {
  return shortText(point.interpretation || point.commercialMeaning || point.pointSummary || pointTitle(point), max);
}

function stripTranscriptMarkers(text = "") {
  return String(text || "")
    .replace(/(^|\n)\s*(?:Speaker\s+\d+|Host|Guest|Interviewer|主持人|嘉宾)\s*\|\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}\s*\n?/gi, "$1")
    .replace(/\s*(?:Speaker\s+\d+|Host|Guest|Interviewer|主持人|嘉宾)\s*\|\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}\s*/gi, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function pointDisplayText(text = "") {
  return clean(stripTranscriptMarkers(text).replace(/\s*https?:\/\/t\.co\/\S+/gi, ""));
}

function pointOriginal(point = {}, max = 150) {
  const text = pointDisplayText(point.originalText || "");
  return max === Infinity ? text : shortText(text, max);
}

function isMostlyEnglish(value = "") {
  const text = clean(value);
  if (!text) return false;
  const latin = (text.match(/[A-Za-z]/g) || []).length;
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  return latin > 18 && latin > cjk * 2;
}

function pointTranslation(point = {}, max = 180) {
  if (!isMostlyEnglish(point.originalText || "")) return "";
  const text = pointDisplayText(point.originalTranslation || "");
  return max === Infinity ? text : shortText(text, max);
}

function pointReadableText(point = {}, max = 96) {
  const translated = pointTranslation(point, Infinity);
  return translated ? shortText(translated, max) : "";
}

function pointTranslatedPreview(point = {}, max = 96) {
  return pointReadableText(point, max) || "查看原文";
}

function pointComment(point = {}, max = 58) {
  return shortText(point.interpretation || point.commercialMeaning || "", max);
}

function pointMeta(point = {}) {
  return [point.person, point.source, point.pointScore ? `${point.pointScore}/100` : "", point.date].filter(Boolean).join(" · ");
}

function pointPerson(point = {}) {
  return clean(point.person || point.source || "一线观点");
}

function pointPersonTitle(point = {}) {
  const source = clean(point.source || "");
  const person = pointPerson(point);
  if (!source) return "";
  const parts = source.split("/").map((part) => clean(part)).filter(Boolean);
  const tail = parts.length > 1 ? parts.at(-1) : "";
  if (tail && !sameProductName(tail, person) && !/^x$/i.test(tail)) return tail;
  if (/claude blog/i.test(source)) return "Claude 官方博客";
  if (/anthropic engineering/i.test(source)) return "Anthropic Engineering";
  if (/claude$/i.test(source)) return "Claude 官方账号";
  return "";
}

function pointPersonDisplay(point = {}) {
  const title = pointPersonTitle(point);
  return [pointPerson(point), title].filter(Boolean).join("｜");
}

function pointSourceMeta(point = {}) {
  return [point.pointScore ? `${point.pointScore}/100` : "", point.date].filter(Boolean).join(" · ");
}

function groupPointsByPerson(points = []) {
  const groups = new Map();
  points.forEach((point) => {
    const key = normalizeText(pointPerson(point)) || point.id || pointTitle(point);
    if (!groups.has(key)) {
      groups.set(key, {
        person: pointPerson(point),
        title: pointPersonTitle(point),
        date: point.date,
        points: [],
        topScore: 0,
      });
    }
    const group = groups.get(key);
    group.points.push(point);
    group.topScore = Math.max(group.topScore, point.pointScore || 0);
  });
  return [...groups.values()].sort((a, b) => b.topScore - a.topScore || a.person.localeCompare(b.person));
}

function groupOriginals(group = {}, maxItems = 3) {
  return (group.points || []).slice(0, maxItems).map((point) => pointOriginal(point, 260));
}

function renderPointOriginalList(points = [], maxItems = 4, maxChars = 420) {
  return points
    .slice(0, maxItems)
    .map((point, index) => {
      const translation = pointTranslation(point, maxChars);
      return `
        <div class="point-original-item">
          <blockquote><span>${index + 1}</span>${escapeHtml(pointOriginal(point, maxChars))}</blockquote>
          ${translation ? `<div class="point-translation"><strong>中文译文</strong><p>${escapeHtml(translation)}</p></div>` : ""}
        </div>
      `;
    })
    .join("");
}

function pointEvidenceText(point = {}, max = 72) {
  return shortText(pointComment(point, max) || pointTitle(point), max);
}

function samePointPerson(a = {}, b = {}) {
  return normalizeText(pointPerson(a)) === normalizeText(pointPerson(b));
}

function pointPersonGroup(point = {}) {
  const items = (state.points || [])
    .filter((item) => samePointPerson(item, point))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (b.pointScore || 0) - (a.pointScore || 0));
  const groupedItems = items.length ? items : [point];
  return {
    person: pointPerson(point),
    title: pointPersonTitle(point),
    date: point.date || "",
    points: groupedItems,
    topScore: Math.max(...groupedItems.map((item) => item.pointScore || 0)),
  };
}

function groupPrimaryUrl(group = {}) {
  return (group.points || []).find((point) => point.originalUrl)?.originalUrl || "";
}

function pointSourceLink(point = {}, label = "查看原文") {
  return point.originalUrl
    ? `<a class="source-text-link" href="${escapeHtml(point.originalUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    : "";
}

function urlsFromText(value = "") {
  return [...String(value || "").matchAll(/https?:\/\/[^\s)\]]+/g)].map((match) => match[0].replace(/[),.，。；;]+$/, ""));
}

function markdownSourceLinks(value = "") {
  return [...String(value || "").matchAll(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)(?:\s+"[^"]*")?\)/g)].map((match) => ({
    label: clean(match[1]),
    url: match[2],
  }));
}

function sourceHostLabel(url = "", index = 0) {
  try {
    return new URL(url).hostname.replace(/^www\./, "") || `来源 ${index + 1}`;
  } catch {
    return `来源 ${index + 1}`;
  }
}

function signalSourceLinks(signal = {}) {
  const markdownLinks = markdownSourceLinks(signal.source || "");
  const labelByUrl = new Map(markdownLinks.map((item) => [item.url, item.label]));
  const storedUrls = Array.isArray(signal.urls) ? signal.urls : urlsFromText(signal.urls || "");
  const urls = [...new Set([...storedUrls, ...markdownLinks.map((item) => item.url), ...urlsFromText(signal.source || "")])]
    .filter(Boolean)
    .slice(0, 4);

  if (!urls.length) return "";
  return `<div class="signal-source-links"><span>原始来源</span>${urls
    .map((url, index) => {
      const label = labelByUrl.get(url) || sourceHostLabel(url, index);
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(shortText(label, 28))}</a>`;
    })
    .join("")}</div>`;
}

function pointSourceNote(point = {}) {
  return (state.pointSources || []).find(
    (source) =>
      (point.sourceNoteId && source.id === point.sourceNoteId) ||
      (source.relatedPointIds || []).includes(point.id) ||
      (source.sourceUrl && point.originalUrl && source.sourceUrl === point.originalUrl)
  );
}

function pointSourceNoteLink(point = {}, label = "站内阅读") {
  const note = pointSourceNote(point);
  return note ? `<a class="source-text-link" href="${pointSourceUrl(note)}">${escapeHtml(label)}</a>` : "";
}

function pointTopicLabel(point = {}) {
  return (point.topics || []).slice(0, 3).join(" / ") || "Builder Point";
}

function pointsForTrend(trend = {}) {
  return (state.points || [])
    .filter((point) => (point.relatedTrendIds || []).includes(trend.track) || (point.topics || []).some((topic) => sameProductName(topic, trend.track)))
    .sort((a, b) => (b.pointScore || 0) - (a.pointScore || 0))
    .slice(0, 5);
}

function pointsForOpportunity(opp = {}) {
  return (state.points || [])
    .filter(
      (point) =>
        (point.relatedOpportunityIds || []).includes(opp.id) ||
        sameProductName(point.commercialMeaning || point.pointSummary || point.title, opp.title) ||
        (point.topics || []).some((topic) => sameProductName(topic, opp.title) || sameProductName(topic, opp.industry || ""))
    )
    .sort((a, b) => (b.pointScore || 0) - (a.pointScore || 0))
    .slice(0, 5);
}

function renderHomeHighlights() {
  const box = $("#homeHighlights");
  if (!box) return;
  const latestDate = latestSignalDate();
  const latestPointGroups = groupPointsByPerson(pointsForDate(latestPointDate())).slice(0, 3);
  const topSignals = getNonRepeatedSignals(state.signals.filter((signal) => signal.date === latestDate))
    .sort((a, b) => (b.signalScore || scoreOf(b)?.total || 0) - (a.signalScore || scoreOf(a)?.total || 0))
    .slice(0, 3);
  const topOpps = [...state.opportunities]
    .sort((a, b) => (b.priorityScore || b.urgency || 0) - (a.priorityScore || a.urgency || 0))
    .slice(0, 3);
  if ($("#decisionTitle")) $("#decisionTitle").textContent = topSignals[0] ? signalDecisionTitle(topSignals[0]) : "今日关键信号";
  const emptySignals = `<p class="muted-note">今日暂无新的高强度 Signal。</p>`;
  const emptyPoints = `<p class="muted-note">今日暂无新的一线观点。</p>`;
  const emptyOpps = `<p class="muted-note">今日暂无高紧迫度机会卡。</p>`;
  box.innerHTML = `
    <article class="highlight-panel">
      <p class="eyebrow">Signals</p>
      <h3>商业信号</h3>
      ${topSignals.length ? topSignals.map((signal) => `<a href="${signalUrl(signal)}"><strong>${escapeHtml(signalHeadline(signal))}</strong><span class="item-meta">${escapeHtml([signal.track, signal.signalScore ? `Signal ${signal.signalScore}` : "", signal.sourceTier ? `来源 ${signal.sourceTier}` : ""].filter(Boolean).join(" · "))}</span><small class="item-desc">${escapeHtml(signalMeaningText(signal))}</small></a>`).join("") : emptySignals}
    </article>
    <article class="highlight-panel">
      <p class="eyebrow">The Point</p>
      <h3>一线观点</h3>
      ${latestPointGroups.length ? latestPointGroups.map((group) => {
        const point = group.points[0];
        const meta = [group.points.length > 1 ? `${group.points.length} 条观点` : "", pointSourceMeta(point)].filter(Boolean).join(" · ");
        return `<a class="home-point-link" href="${pointUrl(point)}"><span class="point-person">${escapeHtml([group.person, group.title].filter(Boolean).join("｜"))}</span><strong>${escapeHtml(pointTranslatedPreview(point, 96))}</strong><span class="item-meta">${escapeHtml(meta)}</span></a>`;
      }).join("") : emptyPoints}
    </article>
    <article class="highlight-panel">
      <p class="eyebrow">Opportunity Watch</p>
      <h3>机会方向</h3>
      ${topOpps.length ? topOpps.map((opp) => `<a href="${opportunityUrl(opp)}"><strong>${escapeHtml(opp.title)}</strong><span class="item-meta">${escapeHtml(homeOpportunityMeta(opp))}</span><small class="item-desc">${escapeHtml(homeOpportunityInsight(opp))}</small></a>`).join("") : emptyOpps}
    </article>
  `;
}

function latestSignalDate() {
  return [...new Set(publicSignals().map((signal) => signal.date).filter(Boolean))].sort().at(-1) || "";
}

function signalRepeatKey(signal = {}) {
  return normalizeText(signal.product || signal.title || "");
}

function isRepeatedSignal(signal = {}) {
  if (!signalRepeatKey(signal)) return false;
  return state.signals.some(
    (item) =>
      item.id !== signal.id &&
      (sameProductName(item.product, signal.product) || sameProductName(item.title, signal.title) || signalRepeatKey(item) === signalRepeatKey(signal)) &&
      String(item.date || "") < String(signal.date || "")
  );
}

function getNonRepeatedSignals(signals = []) {
  return signals.filter((signal) => !isRepeatedSignal(signal));
}

function renderThePointPage() {
  const archive = $("#pointArchive");
  const topicBox = $("#pointTopics");
  if (!archive) return;
  const dates = [...new Set((state.points || []).map((point) => point.date).filter(Boolean))].sort().reverse();
  archive.innerHTML = dates.length
    ? dates
        .map((date) => {
          const points = pointsForDate(date);
          const groups = groupPointsByPerson(points);
          return `
            <section class="point-date-section">
              <a class="point-date-head" href="${pointDailyUrl(date)}">
                <strong>${escapeHtml(date)}</strong>
                <span>${escapeHtml(String(points.length))} 条观点 · ${escapeHtml(String(groups.length))} 位人物</span>
              </a>
              <div class="point-person-grid">
                ${groups.map((group) => {
                  const primary = group.points[0];
                  return `<article class="point-person-mini">
                    <a class="point-person-main" href="${pointUrl(primary)}">
                      <div class="point-person-identity">
                        <strong>${escapeHtml(group.person)}</strong>
                        ${group.title ? `<span>${escapeHtml(group.title)}</span>` : ""}
                      </div>
                      <p>${escapeHtml(pointTranslatedPreview(primary, 150))}</p>
                      <small>${escapeHtml([group.points.length > 1 ? `${group.points.length} 条观点` : "1 条观点", pointTopicLabel(primary)].filter(Boolean).join(" · "))}</small>
                    </a>
                    ${groupPrimaryUrl(group) ? `<div class="point-mini-source">${pointSourceLink({ originalUrl: groupPrimaryUrl(group) })}</div>` : ""}
                  </article>`;
                }).join("")}
              </div>
            </section>
          `;
        })
        .join("")
    : `<div class="empty-state">暂无 The Point。内容更新后，这里会按日期呈现。</div>`;
  renderPointTopics(topicBox);
}

function renderPointDailyPage() {
  const box = $("#pointDaily");
  if (!box) return;
  const dates = [...new Set((state.points || []).map((point) => point.date).filter(Boolean))].sort().reverse();
  const selectedDate = params.get("date") || dates[0] || "";
  const allPoints = pointsForDate(selectedDate);
  const groups = groupPointsByPerson(allPoints);
  const topGroups = groups.slice(0, 10);
  const remainingGroups = groups.slice(10);
  const renderGroupCards = (items) =>
    items
      .map(
          (group, index) => {
            const primary = group.points[0];
            return `
            <article class="point-card point-person-card">
              <a href="${pointUrl(primary)}">
                <span class="point-rank">${String(index + 1).padStart(2, "0")}</span>
                <div>
                  <p class="eyebrow">${escapeHtml(pointTopicLabel(primary))}</p>
                  <div class="point-person-row">
                    <strong>${escapeHtml([group.person, group.title].filter(Boolean).join("｜"))}</strong>
                    <span>${escapeHtml([group.points.length > 1 ? `${group.points.length} 条观点` : "", pointSourceMeta(primary)].filter(Boolean).join(" · "))}</span>
                  </div>
                  <div class="point-original-list">
                    ${renderPointOriginalList(group.points, 4)}
                  </div>
                  <p>${escapeHtml(pointBrief(primary, 76))}</p>
                </div>
              </a>
              ${groupPrimaryUrl(group) ? `<div class="point-card-source">${pointSourceLink({ originalUrl: groupPrimaryUrl(group) })}</div>` : ""}
            </article>
          `
          }
        )
      .join("");
  document.title = `${selectedDate || "The Point"}｜The Point｜观澜AI`;
  box.innerHTML = allPoints.length
    ? `
      <section class="page-title point-daily-title">
        <p class="eyebrow">The Point</p>
        <h1>${escapeHtml(selectedDate)} 一线观点</h1>
      </section>
      <section class="section point-daily-layout">
        <div class="point-daily-main">
          <section class="point-section">
            ${renderGroupCards(topGroups)}
          </section>
          <section class="point-section">
            ${remainingGroups.length ? renderGroupCards(remainingGroups) : `<div class="empty-state">今日暂无更多观点。</div>`}
          </section>
        </div>
        <aside class="point-ranking-panel">
          <div class="section-head compact"><div><p class="eyebrow">Ranking</p><h2>今日 Top10</h2></div></div>
          <div class="point-ranking-list">
            ${topGroups.map((group, index) => `<a href="${pointUrl(group.points[0])}"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml([group.person, group.title].filter(Boolean).join("｜"))}</strong><small>${escapeHtml(pointOriginal(group.points[0], 62))}${group.points.length > 1 ? ` · ${group.points.length} 条` : ""}</small></a>`).join("")}
          </div>
        </aside>
      </section>
    `
    : `<div class="empty-state">暂无当日观点。</div>`;
}

function renderPointTopics(topicBox) {
  if (topicBox) {
    const topics = (state.pointTopics || []).slice(0, 8);
    topicBox.innerHTML = topics.length
      ? topics
          .map(
            (topic) => `
              <article>
                <span>${escapeHtml(topic.momentum === "rising" ? "升温" : "观察")}</span>
                <strong>${escapeHtml(topic.name)}</strong>
                <small>7日热度 ${escapeHtml(topic.heat_7d || 0)} · 30日热度 ${escapeHtml(topic.heat_30d || 0)}</small>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state">暂无长期热度。</div>`;
  }
}

function renderPointDetailPage() {
  const box = $("#pointDetail");
  if (!box) return;
  const targetId = params.get("id") || "";
  const targetSlug = params.get("slug") || "";
  const point = (state.points || []).find((item) => item.id === targetId || pointSlug(item) === targetSlug) || (state.points || [])[0];
  if (!point) {
    box.innerHTML = `<div class="empty-state">暂无观点详情。</div>`;
    return;
  }
  document.title = `${pointPersonDisplay(point)}｜The Point｜观澜AI`;
  const signals = (state.signals || []).filter((signal) => (point.relatedSignalIds || []).includes(signal.id)).slice(0, 5);
  const trends = (state.trends || []).filter((trend) => (point.relatedTrendIds || []).includes(trend.track)).slice(0, 5);
  const opportunities = (state.opportunities || []).filter((opp) => (point.relatedOpportunityIds || []).includes(opp.id)).slice(0, 5);
  const topic = (state.pointTopics || []).find((item) => (point.topics || []).includes(item.name));
  const personGroup = pointPersonGroup(point);
  const displayName = [personGroup.person, personGroup.title].filter(Boolean).join("｜");
  const personSources = [];
  const seenSources = new Set();
  for (const item of personGroup.points) {
    const key = item.originalUrl || item.sourceNoteId || item.id;
    if (!key || seenSources.has(key)) continue;
    seenSources.add(key);
    personSources.push(item);
  }
  box.innerHTML = `
    <section class="page-title point-detail-title">
      <p class="eyebrow">The Point · 观点人物</p>
      <h1>${escapeHtml(displayName)}</h1>
    </section>
    <section class="point-detail-layout">
      <article class="point-detail-main">
        <section class="detail-section point-person-timeline">
          <h2>观点脉络</h2>
          ${personGroup.points
            .map((item, index) => {
              const translation = pointTranslation(item, Infinity);
              return `<article>
                <span>${String(index + 1).padStart(2, "0")}</span>
                <div class="point-timeline-meta"><strong>${escapeHtml(item.date || "")}</strong><em>${escapeHtml(pointTopicLabel(item))}</em></div>
                <blockquote>${escapeHtml(pointOriginal(item, Infinity))}</blockquote>
                ${translation ? `<div class="point-translation"><strong>中文译文</strong><p>${escapeHtml(translation)}</p></div>` : ""}
                <p>${escapeHtml(pointComment(item, 110))}</p>
                <div class="point-timeline-source">
                  ${pointSourceNoteLink(item, "站内阅读")}
                  ${pointSourceLink(item, "查看原文")}
                </div>
              </article>`;
            })
            .join("")}
        </section>
        ${renderDetailSection("延续与变化", personGroup.points.length > 1 ? `已收录 ${personGroup.points.length} 条 ${personGroup.person} 的公开观点，可按日期观察其关注主题的延续、转向和分化。` : `当前收录 1 条 ${personGroup.person} 的公开观点，后续内容会继续归入本页。`)}
        ${renderDetailSection("观点摘要", point.pointSummary)}
        ${renderDetailSection("商业含义", point.commercialMeaning)}
        ${renderDetailSection("观点边界", point.boundary)}
        ${
          personSources.length
            ? `<section class="detail-section point-source-list"><h2>来源</h2>${personSources
                .map(
                  (item, index) =>
                    `<p><strong>${escapeHtml(item.date || "")}</strong><span>${pointSourceNoteLink(item, "站内阅读")}${pointSourceLink(item, `查看原文 ${index + 1}`)}</span></p>`
                )
                .join("")}</section>`
            : ""
        }
      </article>
      <aside class="point-detail-side">
        <section class="point-person-summary">
          <h2>人物档案</h2>
          <p><strong>${escapeHtml(personGroup.person)}</strong>${personGroup.title ? ` · ${escapeHtml(personGroup.title)}` : ""}</p>
          <small>${escapeHtml(`已收录 ${personGroup.points.length} 条观点`)}</small>
        </section>
        <section>
          <h2>观点热度</h2>
          <div class="point-score"><strong>${escapeHtml(point.pointScore || "-")}</strong><span>/100</span></div>
          <p>${topic ? `主题「${escapeHtml(topic.name)}」近 7 日热度 ${escapeHtml(topic.heat_7d || 0)}，近 30 日热度 ${escapeHtml(topic.heat_30d || 0)}。` : "暂无长期热度数据。"}</p>
        </section>
        <section>
          <h2>关联 Signals</h2>
          ${signals.map((signal) => `<a class="brief-link" href="${signalUrl(signal)}"><strong>${escapeHtml(signalHeadline(signal))}</strong><span>${escapeHtml(signalContext(signal))}</span><small>${escapeHtml(signalBrief(signal))}</small></a>`).join("") || `<p>暂无关联 Signal。</p>`}
        </section>
        <section>
          <h2>关联 Trends</h2>
          ${trends.map((trend) => `<a class="brief-link" href="${trendUrl(trend)}"><strong>${escapeHtml(trend.track)}</strong><span>${escapeHtml(trend.statusLabel || trendStatusMeta(trend.status).label)}</span><small>${escapeHtml(trendBrief(trend))}</small></a>`).join("") || `<p>暂无关联趋势。</p>`}
        </section>
        <section>
          <h2>关联 Opportunities</h2>
          ${opportunities.map((opp) => `<a class="brief-link" href="${opportunityUrl(opp)}"><strong>${escapeHtml(opp.title)}</strong><span>${escapeHtml(homeOpportunityMeta(opp))}</span><small>${escapeHtml(opportunityBrief(opp))}</small></a>`).join("") || `<p>暂无关联机会卡。</p>`}
        </section>
      </aside>
    </section>
  `;
}

function renderPointSourceText(value = "") {
  const text = pointDisplayText(value);
  if (!text) return `<p>暂无站内素材。</p>`;
  return text
    .split(/\n{2,}/)
    .map((part) => `<p>${escapeHtml(part).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

function renderPointSourceSection(title, value, className = "") {
  const text = clean(value);
  if (!text) return "";
  return `<section class="detail-section ${className}"><h2>${escapeHtml(title)}</h2>${renderPointSourceText(text)}</section>`;
}

function sourceTypeLabel(value = "") {
  const type = String(value || "").toLowerCase();
  if (type === "youtube" || type === "podcast") return "访谈";
  if (type === "blog") return "博客";
  if (type === "x" || type === "twitter") return "X";
  return value || "素材";
}

function sourceReadStatus(source = {}) {
  if (clean(source.fullText || source.fullTranslation)) return "全文已入库";
  return "结构化阅读";
}

function renderPointSourcePage() {
  const box = $("#pointSource");
  if (!box) return;
  const targetId = params.get("id") || "";
  const targetSlug = params.get("slug") || "";
  const source =
    (state.pointSources || []).find((item) => item.id === targetId || item.slug === targetSlug) ||
    (state.pointSources || [])[0];
  if (!source) {
    box.innerHTML = `<div class="empty-state">暂无站内素材。</div>`;
    return;
  }
  const relatedPoints = (state.points || []).filter(
    (point) =>
      (source.relatedPointIds || []).includes(point.id) ||
      point.sourceNoteId === source.id ||
      (source.sourceUrl && point.originalUrl === source.sourceUrl)
  );
  const hasFullDocument = clean(source.fullText || source.fullTranslation);
  const sourceMeta = [source.date, sourceTypeLabel(source.sourceType), sourceReadStatus(source)].filter(Boolean).join(" · ");
  document.title = `${source.title}｜The Point 素材｜观澜AI`;
  box.innerHTML = `
    <section class="page-title point-source-title">
      <p class="eyebrow">The Point · 站内素材</p>
      <h1>${escapeHtml(source.title)}</h1>
    </section>
    <section class="point-source-page">
      <article class="point-source-main">
        ${renderPointSourceSection("来源与版权", source.sourcePolicy, "point-source-policy")}
        ${
          hasFullDocument
            ? `
                ${renderPointSourceSection("原文全文", source.fullText, "point-source-fulltext")}
                ${renderPointSourceSection("中文全文", source.fullTranslation, "point-source-fulltext point-source-translation")}
              `
            : `
                ${renderPointSourceSection("站内阅读摘要", source.readingSummary)}
                ${renderPointSourceSection("内容结构", source.structure)}
                ${renderPointSourceSection("高价值原文段", source.keySegments)}
              `
        }
        ${renderPointSourceSection("长期知识沉淀", source.interpretation)}
      </article>
      <aside class="point-detail-side">
        <section class="point-source-status">
          <h2>素材状态</h2>
          <p><strong>${escapeHtml(sourceReadStatus(source))}</strong></p>
          <small>${escapeHtml(sourceMeta)}</small>
        </section>
        <section>
          <h2>来源</h2>
          <p>${escapeHtml(source.sourceName || source.sourceType || "The Point Source")}</p>
          ${source.sourceUrl ? `<p><a class="source-text-link" href="${escapeHtml(source.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看外部原文</a></p>` : ""}
        </section>
        <section>
          <h2>关联观点</h2>
          ${
            relatedPoints
              .map((point) => `<a class="brief-link" href="${pointUrl(point)}"><strong>${escapeHtml(pointPersonDisplay(point))}</strong><span>${escapeHtml(point.title)}</span><small>${escapeHtml(pointTranslatedPreview(point, 88))}</small></a>`)
              .join("") || `<p>暂无关联观点。</p>`
          }
        </section>
      </aside>
    </section>
  `;
}

function renderSignalsPage() {
  const slug = params.get('slug');
  const signals = publicSignals();
  const target = slug ? signals.find((signal) => signalSlug(signal) === slug) : signals.find((signal) => signal.id === params.get('signal'));
  selectedId = target?.id || selectedId || signals[0]?.id || null;
  $('#newSignalBtn')?.classList.toggle('hidden', !isAdminVisualEditMode());
  renderFilters();
  renderSignalStats();
  renderSignalList();
  renderDetail();

  ['searchInput', 'dateFilter', 'eventTypeFilter', 'evidenceFilter', 'trackFilter', 'relationFilter'].forEach((id) => {
    $(`#${id}`)?.addEventListener(id === 'searchInput' ? 'input' : 'change', () => {
      renderSignalStats();
      renderSignalList();
      renderDetail();
    });
  });

  $('#newSignalBtn')?.addEventListener('click', () => {
    if (isAdminVisualEditMode()) openEditor(null);
  });
  $('#deleteSignalBtn')?.addEventListener('click', () => {
    if (isAdminVisualEditMode()) deleteSelected();
  });
  $('#editorForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    saveEditor();
    $('#editorDialog')?.close();
  });

  document.addEventListener('click', (event) => {
    const eventFilterButton = event.target.closest('[data-filter-event]');
    if (eventFilterButton) {
      const select = $('#eventTypeFilter');
      if (select) select.value = eventFilterButton.dataset.filterEvent || '';
      renderSignalStats();
      renderSignalList();
      renderDetail();
      return;
    }
    const selectButton = event.target.closest('.signal-card-select');
    const item = event.target.closest('.signal-item');
    if ((selectButton || item) && !event.target.closest('a')) {
      selectedId = (selectButton || item).dataset.id;
      renderSignalList();
      renderDetail();
    }
    if (event.target.id === 'editSignalBtn' && isAdminVisualEditMode()) openEditor(state.signals.find((signal) => signal.id === selectedId));
  });
}

function signalDateKey(signal = {}) {
  return String(signal.date || signal.publishedAt || '').slice(0, 10) || '未标日期';
}

function signalDateBuckets(signals = []) {
  const groups = new Map();
  for (const signal of signals) {
    const key = signalDateKey(signal);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(signal);
  }
  return [...groups.entries()].sort((a, b) => String(b[0]).localeCompare(String(a[0])));
}

function signalDateBucket(signal = {}) {
  return signalDateKey(signal);
}

function signalDateLabel(value = '') {
  if (!value || value === '未标日期') return '未标日期';
  const [year, month, day] = String(value).split('-');
  return year && month && day ? `${year}.${month}.${day}` : value;
}

function signalEvidenceBand(signal = {}) {
  const urlCount = (signal.urls || []).filter(Boolean).length;
  if (urlCount >= 2) return 'strong';
  if (urlCount === 1 || clean(signal.source) || clean(signal.sourceTier)) return 'medium';
  return 'watch';
}

function signalEvidenceLabel(signal = {}) {
  return { strong: '多信源', medium: '单信源', watch: '待补充' }[signalEvidenceBand(signal)] || '待补充';
}

function signalOpportunityLinks(signal = {}) {
  const primaryIds = new Set((signal.relatedOpportunityIds || []).map((item) => clean(item)).filter(Boolean));
  const fallbackNames = new Set((signal.relatedOpportunityNames || []).map((item) => clean(item)).filter(Boolean));
  const useFallbackNames = primaryIds.size === 0;
  const titleText = clean([signal.product, signal.title, signal.track].filter(Boolean).join(' '));
  return (state.opportunities || []).filter((item) => {
    const relatedIds = item.relatedSignalIds || [];
    const relatedTracks = item.relatedTrendTracks || [];
    const hasPrimaryMatch = primaryIds.has(clean(item.id)) || primaryIds.has(clean(item.opportunityId));
    if (primaryIds.size) return hasPrimaryMatch;
    const hasFallbackNameMatch = useFallbackNames && fallbackNames.has(clean(item.title));
    return relatedIds.includes(signal.id) || hasPrimaryMatch || hasFallbackNameMatch || relatedTracks.includes(signal.track) || (useFallbackNames && titleText && clean(item.title || '').includes(clean(signal.track || '')));
  });
}

function signalTrendLinks(signal = {}) {
  const names = new Set([...(signal.relatedTrendNames || [])].map((item) => clean(item)));
  return (state.trends || []).filter((item) => {
    const relatedIds = item.relatedSignalIds || [];
    return relatedIds.includes(signal.id) || item.track === signal.track || names.has(clean(item.track));
  });
}

function signalRelationCounts(signal = {}) {
  return {
    opportunities: signalOpportunityLinks(signal).length,
    trends: signalTrendLinks(signal).length,
  };
}

function signalEventLabel(signal = {}) {
  return normalizedEventTypes(signal)[0] || clean(signal.newsType) || '商业变化';
}

function relationSummary(signal = {}) {
  const counts = signalRelationCounts(signal);
  const parts = [];
  if (counts.opportunities) parts.push(`${counts.opportunities} 个机会`);
  if (counts.trends) parts.push(`${counts.trends} 条趋势`);
  return parts.length ? parts.join(' / ') : '待关联';
}

function signalPrimarySourceLabel(signal = {}) {
  const urls = Array.isArray(signal.urls) ? signal.urls : urlsFromText(signal.urls || '');
  if (urls[0]) return sourceHostLabel(urls[0], 0);
  const link = markdownSourceLinks(signal.source || '')[0];
  return link?.label || clean(signal.sourceTier) || '来源待补';
}

function renderSignalStats() {
  const box = $('#signalStats');
  if (!box) return;
  const signals = getFilteredSignals();
  const strongCount = signals.filter((signal) => signalEvidenceBand(signal) === 'strong').length;
  const linkedCount = signals.filter((signal) => {
    const counts = signalRelationCounts(signal);
    return counts.opportunities || counts.trends;
  }).length;
  const latestDate = signalDateBuckets(signals)[0]?.[0] || '未标日期';
  box.innerHTML = `
    <article><span>本组信号</span><strong>${signals.length}</strong><small>${escapeHtml(signalDateLabel(latestDate))} 最新更新</small></article>
    <article><span>多信源</span><strong>${strongCount}</strong><small>含两条及以上来源记录</small></article>
    <article><span>已形成连接</span><strong>${linkedCount}</strong><small>能继续追到机会或趋势</small></article>`;
}

function getFilteredSignals() {
  const query = $('#searchInput')?.value.trim().toLowerCase() || '';
  const date = $('#dateFilter')?.value || '';
  const eventType = $('#eventTypeFilter')?.value || '';
  const evidence = $('#evidenceFilter')?.value || '';
  const track = $('#trackFilter')?.value || '';
  const relation = $('#relationFilter')?.value || '';
  return publicSignals().filter((signal) => {
    const score = scoreOf(signal);
    const counts = signalRelationCounts(signal);
    const haystack = [signal.product, signal.entity, signal.track, signal.title, signal.displayTitle, signal.summary, signal.evidence, signal.tags?.join(' '), score?.verdict, signalEventLabel(signal)].join(' ').toLowerCase();
    if (date && signalDateKey(signal) !== date) return false;
    if (eventType && signalEventLabel(signal) !== eventType) return false;
    if (evidence && signalEvidenceBand(signal) !== evidence) return false;
    if (track && signal.track !== track && score?.track !== track) return false;
    if (relation === 'linked' && !counts.opportunities && !counts.trends) return false;
    if (relation === 'unlinked' && (counts.opportunities || counts.trends)) return false;
    return !query || haystack.includes(query);
  });
}

function renderFilters() {
  const controls = {
    date: $('#dateFilter'),
    eventType: $('#eventTypeFilter'),
    evidence: $('#evidenceFilter'),
    track: $('#trackFilter'),
    relation: $('#relationFilter'),
  };
  const current = Object.fromEntries(Object.entries(controls).map(([key, el]) => [key, el?.value || '']));
  const signals = publicSignals();
  const dates = signalDateBuckets(signals).map(([date]) => date);
  const eventTypes = [...new Set(signals.map(signalEventLabel).filter(Boolean))].sort((a, b) => (eventTypePriority.get(a) ?? 99) - (eventTypePriority.get(b) ?? 99) || a.localeCompare(b));
  const tracks = [...new Set(signals.map((signal) => signal.track).filter(Boolean))].sort();
  if (controls.date) {
    controls.date.innerHTML = `<option value="">全部日期</option>${dates.map((date) => `<option value="${escapeHtml(date)}">${escapeHtml(signalDateLabel(date))}</option>`).join('')}`;
    controls.date.value = dates.includes(current.date) ? current.date : '';
  }
  if (controls.eventType) {
    controls.eventType.innerHTML = `<option value="">全部变化</option>${eventTypes.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(type)}</option>`).join('')}`;
    controls.eventType.value = eventTypes.includes(current.eventType) ? current.eventType : '';
  }
  if (controls.evidence) {
    controls.evidence.innerHTML = '<option value="">全部信源</option><option value="strong">多信源</option><option value="medium">单信源</option><option value="watch">待补充</option>';
    controls.evidence.value = ['strong', 'medium', 'watch'].includes(current.evidence) ? current.evidence : '';
  }
  if (controls.track) {
    controls.track.innerHTML = `<option value="">全部赛道</option>${tracks.map((track) => `<option value="${escapeHtml(track)}">${escapeHtml(track)}</option>`).join('')}`;
    controls.track.value = tracks.includes(current.track) ? current.track : '';
  }
  if (controls.relation) {
    controls.relation.innerHTML = '<option value="">全部关系</option><option value="linked">已关联</option><option value="unlinked">待关联</option>';
    controls.relation.value = ['linked', 'unlinked'].includes(current.relation) ? current.relation : '';
  }
}

function signalGroupSummary(signals = []) {
  const strong = signals.filter((signal) => signalEvidenceBand(signal) === 'strong').length;
  const linked = signals.filter((signal) => {
    const counts = signalRelationCounts(signal);
    return counts.opportunities || counts.trends;
  }).length;
  const events = [...new Set(signals.map(signalEventLabel).filter(Boolean))].slice(0, 3);
  return [`${signals.length} 条`, strong ? `${strong} 条多信源` : '', linked ? `${linked} 条已关联` : '', events.join(' / ')].filter(Boolean).join(' · ');
}

function renderSignalCard(signal = {}) {
  const counts = signalRelationCounts(signal);
  const sourceLabel = signalPrimarySourceLabel(signal);
  const selected = signal.id === selectedId;
  return `
    <article class="signal-item signal-card ${selected ? 'active' : ''}" data-id="${escapeHtml(signal.id)}">
      <a class="signal-card-select signal-card-link" href="${signalUrl(signal)}" data-id="${escapeHtml(signal.id)}">
        <span class="signal-card-kicker"><b>${escapeHtml(signalEventLabel(signal))}</b><em>${escapeHtml(signalEvidenceLabel(signal))}</em></span>
        <span class="signal-card-main"><strong>${escapeHtml(signalHeadline(signal))}</strong><span class="signal-card-meaning">${escapeHtml(signalMeaningText(signal))}</span><small>来源 ${escapeHtml(sourceLabel)}</small></span>
        <span class="signal-card-links"><span>${escapeHtml(signal.track || '未分赛道')}</span><span>${counts.opportunities ? `${counts.opportunities} 个机会` : '机会待观察'}</span><span>${counts.trends ? `${counts.trends} 条趋势` : '趋势观察中'}</span></span>
        <span class="signal-card-arrow">查看信号</span>
      </a>
    </article>`;
}

function renderSignalList() {
  const list = $('#signalList');
  if (!list) return;
  const signals = getFilteredSignals();
  const visibleSignals = publicSignals();
  if (!signals.some((signal) => signal.id === selectedId)) selectedId = signals[0]?.id || visibleSignals[0]?.id || null;
  if (!signals.length) {
    list.innerHTML = '<div class="empty-state">当前筛选下暂无 Signal。</div>';
    return;
  }
  const latestDate = signalDateBuckets(publicSignals())[0]?.[0];
  list.innerHTML = signalDateBuckets(signals)
    .map(([date, items]) => `
      <section class="signal-date-group">
        <header><div><span>${escapeHtml(signalDateLabel(date))}</span><h2>${escapeHtml(date === latestDate ? '最新信号' : '历史信号')}</h2></div><p>${escapeHtml(signalGroupSummary(items))}</p></header>
        <div class="signal-ledger-head"><span>变化</span><span>信号与事实</span><span>关系</span><span>详情</span></div>
        <div class="signal-card-grid">${items.map(renderSignalCard).join('')}</div>
      </section>`)
    .join('');
}

function renderDetail() {
  const panel = $('#signalDetail');
  if (!panel) return;
  const signals = getFilteredSignals();
  const signal = signals.find((item) => item.id === selectedId) || signals[0] || publicSignals()[0];
  if (!signal) {
    panel.innerHTML = '<div class="empty-state">暂无可展示的商业信号。</div>';
    return;
  }
  selectedId = signal.id;
  const strongCount = signals.filter((item) => signalEvidenceBand(item) === 'strong').length;
  const mediumCount = signals.filter((item) => signalEvidenceBand(item) === 'medium').length;
  const watchCount = Math.max(0, signals.length - strongCount - mediumCount);
  const linkedCount = signals.filter((item) => {
    const counts = signalRelationCounts(item);
    return counts.opportunities || counts.trends;
  }).length;
  const eventRows = [...signals.reduce((map, item) => {
    const type = signalEventLabel(item);
    map.set(type, (map.get(type) || 0) + 1);
    return map;
  }, new Map()).entries()].sort((a, b) => b[1] - a[1] || (eventTypePriority.get(a[0]) ?? 99) - (eventTypePriority.get(b[0]) ?? 99)).slice(0, 6);
  const opportunityLinks = signalOpportunityLinks(signal);
  const trendLinks = signalTrendLinks(signal);
  const total = Math.max(signals.length, 1);
  const mainEvent = eventRows[0]?.[0] || signalEventLabel(signal);
  panel.innerHTML = `
    <section class="signals-insight-panel">
      <div class="signals-insight-head">
        <span>本组信号</span>
        <strong>${signals.length} 条信号</strong>
      </div>
      <p class="signals-insight-copy">当前更值得先看的，是${escapeHtml(mainEvent)}中来源记录更完整、且能继续追到机会或趋势的变化。</p>
      <div class="signals-insight-stats">
        <span><b>${strongCount}</b> 多信源</span>
        <span><b>${linkedCount}</b> 已形成连接</span>
        <span><b>${watchCount}</b> 仍需观察</span>
      </div>
      <div class="signal-distribution">${eventRows.map(([type, count]) => `<button type="button" data-filter-event="${escapeHtml(type)}"><span>${escapeHtml(type)}</span><strong>${count}</strong></button>`).join('') || '<p>暂无变化类型。</p>'}</div>
    </section>
    <section class="signals-selected-preview">
      <p class="eyebrow">当前选中</p>
      <h2>${escapeHtml(signalHeadline(signal))}</h2>
      <p>${escapeHtml(signalMeaningText(signal))}</p>
      <div class="signals-preview-meta">
        <span>${escapeHtml(signalDateLabel(signalDateKey(signal)))}</span>
        <span>${escapeHtml(signalEventLabel(signal))}</span>
        <span>${escapeHtml(opportunityLinks.length ? `${opportunityLinks.length} 个机会` : '机会待观察')}</span>
        <span>${escapeHtml(trendLinks.length ? `${trendLinks.length} 条趋势` : '趋势观察中')}</span>
      </div>
      <a class="primary-btn as-link" href="${signalUrl(signal)}">查看信号</a>
    </section>`;
}

function renderSignalDetailPage() {
  const box = $('#signalDetailPage');
  if (!box) return;
  const targetSlug = params.get('slug') || '';
  const targetId = params.get('id') || params.get('signal') || '';
  const signal = publicSignals().find((item) => signalSlug(item) === targetSlug || item.id === targetId) || publicSignals()[0];
  if (!signal) {
    box.innerHTML = '<section class="empty-state">暂无可展示的商业信号。</section>';
    return;
  }
  document.title = `${signalHeadline(signal)}｜观澜AI｜WaveSight AI`;
  selectedId = signal.id;
  const score = scoreOf(signal);
  const trendLinks = signalTrendLinks(signal);
  const opportunityLinks = signalOpportunityLinks(signal);
  const opportunity = normalizedOpportunity(signal);
  const detail = signal.scoringDetail || {};
  const sourceLinks = signalSourceLinks(signal);
  const upside = detail.upside || [];
  const downside = detail.downside || [];
  const sideOpportunities = opportunityLinks.slice(0, 5);
  const sideTrends = trendLinks.slice(0, 3);
  const newsMeta = signalNewsSourceMeta(signal);
  const relatedSignals = publicSignals()
    .filter((item) => item.id !== signal.id && (item.track === signal.track || normalizedEventTypes(item).some((type) => normalizedEventTypes(signal).includes(type))))
    .slice(0, 5);
  box.innerHTML = `
    <section class="page-title signal-detail-title">
      <p class="eyebrow">Signal</p>
      <h1>${escapeHtml(signalDetailTitle(signal))}</h1>
      <p class="signal-detail-date">${escapeHtml([signalDateLabel(signalDateKey(signal)), signalEventLabel(signal), signal.track || score?.track || '', signalEvidenceLabel(signal)].filter(Boolean).join(' · '))}</p>
    </section>
    <section class="signal-detail-layout">
      <article class="signal-detail-main">
        <section class="signal-detail-thesis">
          <span>新闻详情源</span>
          <h2>${escapeHtml(signalHeadline(signal))}</h2>
          <div class="signal-news-meta">
            <span>${escapeHtml(newsMeta.sourceName)}</span>
            <span>${escapeHtml(signalDateLabel(newsMeta.date))}</span>
            <span>${escapeHtml(signalEventLabel(signal))}</span>
          </div>
          <p>${escapeHtml(signalNewsDetail(signal))}</p>
          ${sourceLinks}
        </section>
        <section class="detail-section">
          <h2>为什么这是 Signal</h2>
          <div class="signal-reason-list">
            <article><span>事实</span><p>${escapeHtml(signalEventText(signal))}</p></article>
            <article><span>含义</span><p>${escapeHtml(signalMeaningText(signal))}</p></article>
          </div>
        </section>
        <section class="detail-section">
          <h2>来源与事实</h2>
          <p>${escapeHtml(clean(signal.evidence) || '当前信息仍需结合后续客户采用、收入和产品落地继续观察。')}</p>
        </section>
        <section class="detail-section">
          <h2>机会拆解</h2>
          <ol class="signal-opportunity-list">${opportunity.map((item) => `<li><strong>${escapeHtml(item.question)}</strong><p>${escapeHtml(item.answer || '待补充')}</p></li>`).join('')}</ol>
        </section>
        <section class="detail-section">
          <h2>评分依据</h2>
          <div class="signal-score-notes">
            <article><h4>支撑信息</h4><ul>${upside.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>暂无</li>'}</ul></article>
            <article><h4>保留观察</h4><ul>${downside.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>暂无</li>'}</ul></article>
          </div>
        </section>
      </article>
      <aside class="signal-detail-side">
        <section>
          <h2>信号摘要</h2>
          <div class="summary-grid signal-detail-metrics">
            <div class="metric"><span>变化类型</span><strong>${escapeHtml(signalEventLabel(signal))}</strong></div>
            <div class="metric"><span>信源状态</span><strong>${escapeHtml(signalEvidenceLabel(signal))}</strong></div>
            <div class="metric"><span>指向机会</span><strong>${escapeHtml(opportunityLinks.length ? `${opportunityLinks.length} 个` : '待关联')}</strong></div>
            <div class="metric"><span>关联趋势</span><strong>${escapeHtml(trendLinks.length ? `${trendLinks.length} 条` : '观察中')}</strong></div>
          </div>
        </section>
        <section>
          <h2>指向的 Opportunity</h2>
          <div class="brief-stack">${sideOpportunities.map((item) => item.id ? `<a class="brief-link" href="${opportunityUrl(item)}"><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.evidenceLevel ? `来源 ${item.evidenceLevel}` : '机会卡')}</span><small>${escapeHtml(opportunityBrief(item))}</small></a>` : `<div class="brief-link"><strong>${escapeHtml(item.title || '待命名机会')}</strong><span>待补充机会卡</span></div>`).join('') || '<p>暂无已关联机会。</p>'}</div>
        </section>
        <section>
          <h2>关联 Trend</h2>
          <div class="brief-stack">${sideTrends.map((item) => `<a class="brief-link" href="${trendUrl(item)}"><strong>${escapeHtml(item.track)}</strong><span>${escapeHtml(item.statusLabel || '观察中')}</span><small>${escapeHtml(trendBrief(item))}</small></a>`).join('') || '<p>暂无已关联趋势。</p>'}</div>
        </section>
        <section>
          <h2>相关 Signals</h2>
          <div class="brief-stack">${relatedSignals.map((item) => `<a class="brief-link" href="${signalUrl(item)}"><strong>${escapeHtml(signalHeadline(item))}</strong><span>${escapeHtml([signalDateLabel(signalDateKey(item)), signalEventLabel(item), item.track].filter(Boolean).join(' · '))}</span><small>${escapeHtml(signalMeaningText(item))}</small></a>`).join('') || '<p>暂无相关 Signal。</p>'}</div>
        </section>
      </aside>
    </section>`;
}

function openEditor(signal) {
  editingId = signal?.id || null;
  const form = $("#editorForm");
  if (!form) return;
  form.product.value = signal?.product || "";
  form.track.value = signal?.track || "";
  form.title.value = signal?.title || "";
  form.date.value = signal?.date || new Date().toISOString().slice(0, 10);
  form.verdict.value = scoreOf(signal || {})?.verdict || "";
  form.total.value = scoreOf(signal || {})?.total || "";
  form.tags.value = (signal?.tags || []).join("｜");
  form.newsType.value = signal?.newsType || "";
  form.summary.value = signal?.summary || "";
  const opportunity = normalizedOpportunity(signal || {});
  $("#opportunityEditor").innerHTML = opportunity
    .map(
      (item, index) => `
        <article class="analysis-card">
          <label class="field"><span>模块 ${index + 1} 标题</span><input name="oppQuestion${index}" value="${escapeHtml(item.question)}" /></label>
          <label class="field"><span>模块 ${index + 1} 内容</span><textarea name="oppAnswer${index}" rows="5">${escapeHtml(item.answer)}</textarea></label>
        </article>`
    )
    .join("");
  $("#deleteSignalBtn").style.display = signal ? "inline-block" : "none";
  $("#editorTitle").textContent = signal ? "编辑 Signal" : "新增 Signal";
  $("#editorDialog").showModal();
}

function saveEditor() {
  const form = $("#editorForm");
  const score = {
    product: form.product.value.trim(),
    track: form.track.value.trim(),
    total: Number(form.total.value) || 0,
    verdict: form.verdict.value.trim() || "待判断",
  };
  const opportunity = defaultQuestions.map((question, index) => ({
    id: index + 1,
    question: form[`oppQuestion${index}`]?.value.trim() || question,
    answer: form[`oppAnswer${index}`]?.value.trim() || "",
  }));
  const signal = {
    id: editingId || `local-${Date.now()}`,
    number: state.signals.length + 1,
    date: form.date.value,
    product: score.product,
    track: score.track,
    title: form.title.value.trim(),
    slug: localSlug(`${form.date.value}-${score.product}-${score.track}`, editingId || `local-${Date.now()}`),
    tags: form.tags.value.split("｜").map((tag) => tag.trim()).filter(Boolean),
    newsType: form.newsType.value.trim(),
    summary: form.summary.value.trim(),
    opportunity,
    score,
  };
  const index = state.signals.findIndex((item) => item.id === editingId);
  if (index >= 0) state.signals[index] = { ...state.signals[index], ...signal };
  else state.signals.unshift(signal);
  selectedId = signal.id;
  persistState();
  renderSignalList();
  renderDetail();
}

function deleteSelected() {
  if (!editingId) return;
  state.signals = state.signals.filter((signal) => signal.id !== editingId);
  selectedId = state.signals[0]?.id || null;
  persistState();
  $("#editorDialog")?.close();
  renderSignalList();
  renderDetail();
}

function renderScoring() {
  const table = $("#scoreTable");
  if (!table) return;
  const rows = scoreRowsForDisplay();
  table.innerHTML = `
    <table class="score-priority-table">
      <thead><tr><th>优先级</th><th>机会 / 赛道</th><th>代表证据</th><th>机会强度</th><th>行动判断</th><th>关键依据</th><th class="inline-edit-col">编辑</th></tr></thead>
      <tbody>${rows
        .map(
          (row, index) => `<tr class="${scoreLevelClass(row)}"><td><span class="rank-pill">${String(index + 1).padStart(2, "0")}</span></td><td><strong class="score-opportunity">${escapeHtml(scoreOpportunityName(row))}</strong><span class="score-track">${escapeHtml(row.track || "待补充赛道")}</span></td><td><span class="score-source">${escapeHtml(scoreSourceName(row) || "综合信号")}</span><small>${escapeHtml(row.date || "")}</small></td><td><div class="score-total">${row.total}/30</div><div class="score-bar"><span style="width:${Math.min(100, (row.total / 30) * 100)}%"></span></div></td><td><span class="verdict-pill">${escapeHtml(verdictLabel(row))}</span></td><td><div class="score-tags">${[
            ["资金", row.funding],
            ["商业化", row.commercialization],
            ["增长", row.growth],
            ["需求", row.demand],
            ["复制", row.replicability],
            ["竞争", row.competition],
          ].map(([label, value]) => `<span>${label} ${value || "-"}</span>`).join("")}</div></td><td class="inline-edit-col">${visualEditButton("scoring", state.scoring.rows.findIndex((item) => item.id === row.id))}</td></tr>`
        )
        .join("")}</tbody>
    </table>`;
}

function renderDailyPage() {
  const box = $("#dailyBrief");
  if (!box) return;
  const groups = getDailyGroups();
  box.innerHTML = groups.length
    ? groups.map(renderDailyCard).join("")
    : `<div class="empty-state">暂无每日简报。内容更新后，这里会按日期呈现。</div>`;
}

function getDailyGroups() {
  const map = new Map();
  const ensure = (date) => {
    const key = date || "未标注日期";
    if (!map.has(key)) map.set(key, { date: key, signals: [], scores: [], points: [], opportunities: [] });
    return map.get(key);
  };

  publicSignals().forEach((signal) => ensure(signal.date || signal.publishedAt).signals.push(signal));
  (state.points || []).forEach((point) => {
    if (!isHiddenDailyDate(point.date)) ensure(point.date).points.push(point);
  });
  (state.scoring.rows || []).forEach((row) => {
    if (!isHiddenDailyDate(row.date)) ensure(row.date).scores.push(row);
  });

  // Daily Brief 的机会卡优先按「Signal -> 主机会」口径聚合（否则会因 Opportunity 的 updated/created 与当天不一致导致当天无机会卡）。
  const opportunityById = new Map((state.opportunities || []).map((opp) => [opp.id, opp]));
  for (const group of map.values()) {
    const ids = new Set();
    (group.signals || []).forEach((signal) => {
      (signal.relatedOpportunityIds || []).filter(Boolean).forEach((id) => ids.add(id));
      if (signal.relatedOpportunityId) ids.add(signal.relatedOpportunityId);
    });
    ids.forEach((id) => {
      const opp = opportunityById.get(id);
      if (opp) group.opportunities.push(opp);
    });
  }

  // Fallback：仍保留按 Opportunity 自身日期归档的入口，用于“机会卡更新但当天无新 Signal”的场景。
  (state.opportunities || []).forEach((opp) => {
    const date = opp.date || opp.updated || opp.createdAt || opp.nextReview || opp.created;
    if (!isHiddenDailyDate(date)) ensure(date).opportunities.push(opp);
  });

  return [...map.values()]
    .filter((group) => !isHiddenDailyDate(group.date))
    .map((group) => ({
      ...group,
      signals: group.signals.sort((a, b) => (scoreOf(b)?.total || 0) - (scoreOf(a)?.total || 0)),
      points: group.points.sort((a, b) => (b.pointScore || 0) - (a.pointScore || 0)),
      scores: group.scores.sort((a, b) => (b.total || 0) - (a.total || 0)),
      opportunities: [...new Map(group.opportunities.map((item) => [item.id, item])).values()].sort((a, b) => (b.urgency || 0) - (a.urgency || 0)),
    }))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function renderDailyCard(group) {
  const topSignals = getNonRepeatedSignals(group.signals)
    .sort((a, b) => (b.signalScore || scoreOf(b)?.total || 0) - (a.signalScore || scoreOf(a)?.total || 0))
    .slice(0, 3);
  const topPointGroups = groupPointsByPerson(group.points || []).slice(0, 3);
  const topOpps = group.opportunities.slice(0, 3);
  const tracks = [...new Set(group.signals.map((item) => item.track).filter(Boolean))].slice(0, 6);
  const trendItems = state.trends.filter((trend) => tracks.includes(trend.track)).slice(0, 3);
  const leadSignal = topSignals[0];
  const avgSignalScore = topSignals.filter((signal) => signal.signalScore != null).length
    ? Math.round(topSignals.reduce((sum, signal) => sum + Number(signal.signalScore || 0), 0) / topSignals.filter((signal) => signal.signalScore != null).length)
    : "-";
  const decisionTitle = leadSignal ? signalHeadline(leadSignal) : "今天暂无新的高强度信号";
  const decisionText = leadSignal
    ? signalLead(leadSignal, 96)
    : "适合回看已有趋势和机会卡的信号变化。";
  return `
    <article class="daily-card daily-card-link">
      <a href="${dailyUrl(group.date)}">
        <div class="daily-card-head">
          <div>
            <p class="eyebrow">Daily Brief</p>
            <h2>${escapeHtml(group.date)}</h2>
          </div>
          <div class="daily-metrics">
            <span><strong>${group.signals.length}</strong> Signals</span>
            <span><strong>${group.points.length}</strong> Points</span>
            <span><strong>${avgSignalScore}</strong> Avg Signal</span>
            <span><strong>${topOpps.length}</strong> Opportunity Cards</span>
          </div>
        </div>
        <div class="daily-decision">
          <span>今日主线</span>
          <strong>${escapeHtml(decisionTitle)}</strong>
          <small>${escapeHtml(decisionText)}</small>
        </div>
        <div class="daily-card-preview">
          <section><h3>关键 Signals</h3>${topSignals.map((signal) => `<p><strong>${escapeHtml(signalHeadline(signal))}</strong><small>${escapeHtml(signalBrief(signal))}</small></p>`).join("") || `<p><small>暂无 Signals。</small></p>`}</section>
          <section><h3>The Point</h3>${topPointGroups.map((pointGroup) => {
            const point = pointGroup.points[0];
            return `<p><strong>${escapeHtml([pointGroup.person, pointGroup.title].filter(Boolean).join("｜"))}</strong><small>${escapeHtml(pointTranslatedPreview(point, 88))}</small></p>`;
          }).join("") || `<p><small>暂无一线观点。</small></p>`}</section>
          <section><h3>机会卡</h3>${topOpps.map((opp) => `<p><strong>${escapeHtml(opp.title)}</strong><small>${escapeHtml(opportunityBrief(opp))}</small></p>`).join("") || `<p><small>暂无机会卡。</small></p>`}</section>
        </div>
      </a>
    </article>
  `;
}

function renderDailyDetailPage() {
  const box = $("#dailyDetail");
  if (!box) return;
  const groups = getDailyGroups();
  const targetDate = params.get("date") || groups[0]?.date || "";
  const group = groups.find((item) => item.date === targetDate) || groups[0];
  if (!group) {
    box.innerHTML = `<div class="empty-state">暂无 Daily Brief。内容更新后，这里会呈现当天简报。</div>`;
    return;
  }
  document.title = `${group.date} Daily Brief｜观澜AI｜WaveSight AI`;
  const signals = getNonRepeatedSignals(group.signals)
    .sort((a, b) => (b.signalScore || scoreOf(b)?.total || 0) - (a.signalScore || scoreOf(a)?.total || 0))
    .slice(0, 8);
  const opportunities = group.opportunities.slice(0, 8);
  const pointGroups = groupPointsByPerson(group.points || []).slice(0, 5);
  const points = pointGroups.map((item) => item.points[0]);
  const tracks = [...new Set(group.signals.map((signal) => signal.track).filter(Boolean))].slice(0, 8);
  const trends = state.trends.filter((trend) => tracks.includes(trend.track)).slice(0, 6);
  const leadSignal = signals[0];
  const briefLead = leadSignal ? signalHeadline(leadSignal) : "今天暂无新的高强度信号";
  const briefSummary = leadSignal
    ? signalLead(leadSignal, 170)
    : "适合回看已有机会卡和趋势线的信号变化。";
  const trackLine = tracks.length ? tracks.slice(0, 4).join(" / ") : "待观察赛道";
  const changeTypeLine = dailyChangeType(signals);
  const evidenceLine = dailyEvidenceStrength(signals);
  const trendLine = dailyTrendStatus(trends);
  box.innerHTML = `
    <section class="page-title daily-detail-title">
      <p class="eyebrow">Daily Brief</p>
      <h1>观澜简报</h1>
      <p class="daily-detail-date">${escapeHtml(group.date)}</p>
    </section>
    <section class="daily-detail-hero">
      <div>
        <p class="eyebrow">今日主线</p>
        <h2>${escapeHtml(briefLead)}</h2>
        <p>${escapeHtml(briefSummary)}</p>
      </div>
      <div class="daily-detail-metrics">
        <span><strong>${group.signals.length}</strong> Signals</span>
        <span><strong>${opportunities.length}</strong> 机会卡</span>
        <span><strong>${trends.length}</strong> 趋势</span>
      </div>
    </section>
    <section class="daily-newsletter-strip">
      <div>
        <span>变化类型</span>
        <strong>${escapeHtml(changeTypeLine)}</strong>
      </div>
      <div>
        <span>信源状态</span>
        <strong>${escapeHtml(evidenceLine)}</strong>
      </div>
      <div>
        <span>趋势状态</span>
        <strong>${escapeHtml(trendLine)}</strong>
      </div>
    </section>
    <section class="daily-detail-layout">
      <article class="daily-detail-primary">
        <div class="daily-detail-section-head">
          <p class="eyebrow">Signals</p>
          <h2>${escapeHtml(trackLine)} 的商业信号</h2>
        </div>
        ${signals.length ? signals.map((signal, index) => `<a class="daily-signal-row ${index === 0 ? "lead" : ""}" href="${signalUrl(signal)}"><span class="daily-signal-index">${String(index + 1).padStart(2, "0")}</span><div class="daily-signal-body"><div class="daily-signal-topline"><strong>${escapeHtml(signalHeadline(signal))}</strong>${signal.signalScore ? `<span>Signal ${escapeHtml(signal.signalScore)}</span>` : ""}</div><div class="daily-signal-insight"><p><b>发生了什么</b>${escapeHtml(signalEventText(signal))}</p><p><b>商业含义</b>${escapeHtml(signalMeaningText(signal))}</p></div><em>${escapeHtml([signal.track, signal.sourceTier ? `来源 ${signal.sourceTier}` : ""].filter(Boolean).join(" · "))}</em></div></a>`).join("") : `<p>暂无 Signals。</p>`}
      </article>
      <aside class="daily-detail-side">
        <section>
          <div class="daily-detail-section-head">
            <p class="eyebrow">The Point</p>
            <h2>今日一线观点</h2>
          </div>
          ${pointGroups.slice(0, 3).map((pointGroup) => {
            const point = pointGroup.points[0];
            return `<a class="brief-link" href="${pointUrl(point)}"><strong>${escapeHtml([pointGroup.person, pointGroup.title].filter(Boolean).join("｜"))}</strong><span>${escapeHtml(pointGroup.points.length > 1 ? `${pointGroup.points.length} 条观点` : pointTitle(point))}</span><small>${escapeHtml(pointTranslatedPreview(point, 96))}</small></a>`;
          }).join("") || `<p>暂无一线观点。</p>`}
        </section>
        <section>
          <div class="daily-detail-section-head">
            <p class="eyebrow">Opportunity Watch</p>
            <h2>可继续观察的机会</h2>
          </div>
          ${opportunities.slice(0, 5).map((opp) => `<a class="brief-link" href="${opportunityUrl(opp)}"><strong>${escapeHtml(opp.title)}</strong><span>${escapeHtml(opp.industry || "Opportunity")}</span><small>${escapeHtml(opportunityBrief(opp))}</small></a>`).join("") || `<p>暂无机会卡。</p>`}
        </section>
        <section>
          <div class="daily-detail-section-head">
            <p class="eyebrow">Trend Watch</p>
            <h2>趋势是否仍在升温</h2>
          </div>
          ${trends.slice(0, 5).map((trend) => `<a class="brief-link" href="${trendUrl(trend)}"><strong>${escapeHtml(trend.track)}</strong><span>${escapeHtml(clean(trend.thirtyDay || trend.sevenDay) || "-")}</span><small>${escapeHtml(trendBrief(trend))}</small></a>`).join("") || `<p>暂无关联趋势。</p>`}
        </section>
        <section class="daily-detail-note">
          <div class="daily-detail-section-head">
            <p class="eyebrow">Watch Boundary</p>
            <h2>判断边界</h2>
          </div>
          <p>如果后续看不到客户采用、预算投入、产品集成或收入迹象，当前变化仍应视为早期信号，而不是确定机会。</p>
        </section>
      </aside>
    </section>
  `;
}

function renderTrends() {
  const grid = $("#trendGrid");
  if (!grid) return;
  const selectedTrack = params.get("track") || "";
  const statusOrder = ["rising", "emerging", "mature", "splitting", "risk", "cooling", "invalidating"];
  const trends = [...state.trends].sort(
    (a, b) =>
      (a.track === selectedTrack ? -1 : 0) - (b.track === selectedTrack ? -1 : 0) ||
      statusOrder.indexOf(a.status || "splitting") - statusOrder.indexOf(b.status || "splitting") ||
      (b.latestScore || 0) - (a.latestScore || 0)
  );
  const counts = statusOrder
    .map((status) => ({ status, label: trendStatusMeta(status).label, count: trends.filter((trend) => (trend.status || "splitting") === status).length }))
    .filter((item) => item.count);
  const renderCard = (trend) => {
    const index = state.trends.findIndex((item) => item.track === trend.track);
    const oppCount = trend.relatedOpportunityIds?.length || 0;
    const signalCount = trend.relatedSignalIds?.length || 0;
    const score = trend.latestScore ? `${trend.latestScore}/30` : "-";
    return `<article class="trend-card trend-card-link ${trend.track === selectedTrack ? "selected-card" : ""}">${visualEditButton("trends", index)}<a href="${trendUrl(trend)}"><div class="trend-card-top"><span class="trend-status ${escapeHtml(trend.status || "splitting")}">${escapeHtml(trend.statusLabel || trendStatusMeta(trend.status).label)}</span><span>${escapeHtml(trend.adoptionStage || "观察中")}</span></div><h3>${escapeHtml(trend.track)}</h3><p class="trend-claim">${escapeHtml(trendBrief(trend))}</p>${renderTrendBars(trend)}<div class="trend-card-meta"><span>最新评分 ${escapeHtml(score)}</span><span>${signalCount} Signals</span><span>${oppCount} 机会卡</span></div><div class="trend-card-evidence">${(trend.topScoringRows || []).slice(0, 2).map((row) => `<span>${escapeHtml([row.opportunityTitle, row.score ? `${row.score}/30` : ""].filter(Boolean).join(" · "))}</span>`).join("")}</div><span class="card-link-label">查看趋势</span></a></article>`;
  };
  grid.innerHTML = `
    <section class="trend-overview">
      ${counts.map((item) => `<article><span>${escapeHtml(item.label)}</span><strong>${item.count}</strong></article>`).join("")}
    </section>
    ${statusOrder
      .map((status) => {
        const group = trends.filter((trend) => (trend.status || "splitting") === status);
        if (!group.length) return "";
        return `<section class="trend-group"><div class="trend-group-head"><h2>${escapeHtml(trendStatusMeta(status).label)}</h2><span>${group.length} 条趋势</span></div><div class="trend-grid">${group.map(renderCard).join("")}</div></section>`;
      })
      .join("")}
  `;
}

function renderTrendDetailPage() {
  const targetSlug = params.get("slug") || "";
  const targetTrack = params.get("track") || "";
  const trend = state.trends.find((item) => trendSlug(item) === targetSlug || item.track === targetTrack) || state.trends[0];
  const box = $("#trendDetail");
  if (!box) return;
  if (!trend) {
    box.innerHTML = `<div class="empty-state">暂无趋势数据。</div>`;
    return;
  }
  document.title = `${trend.track}｜观澜AI｜WaveSight AI`;
  const relatedSignals = (trend.relatedSignalIds?.length ? state.signals.filter((signal) => trend.relatedSignalIds.includes(signal.id)) : state.signals.filter((signal) => signal.track === trend.track || scoreOf(signal)?.track === trend.track)).slice(0, 8);
  const relatedOpps = trendOpportunities(trend).slice(0, 6);
  const scoreRows = trendScoringRows(trend).slice(0, 8);
  const relatedPoints = pointsForTrend(trend);
  box.innerHTML = `
    <section class="page-title trend-detail-title">
      <p class="eyebrow">Trend Detail</p>
      <h1>${escapeHtml(trend.track)}</h1>
    </section>
    <section class="trend-detail-layout">
      <article class="trend-detail-main">
        <section class="trend-thesis">
          <span class="trend-status ${escapeHtml(trend.status || "splitting")}">${escapeHtml(trend.statusLabel || trendStatusMeta(trend.status).label)}</span>
          <h2>${escapeHtml(trend.summary || trendBrief(trend))}</h2>
          <p>${escapeHtml(clean(trend.verdict) || "仍需结合后续 Signals、评分变化和机会卡信息继续观察。")}</p>
        </section>
        <section class="detail-section"><h2>评分变化</h2>${renderTrendBars(trend, 120)}<p>${escapeHtml(clean(trend.sevenDay) || "-")} / ${escapeHtml(clean(trend.thirtyDay) || "-")}</p></section>
        <section class="detail-section"><h2>信号阶梯</h2>${renderEvidenceLadder(trend)}</section>
        <section class="detail-section"><h2>机会温度</h2>${renderTemperature(trend)}</section>
        <section class="detail-section"><h2>The Point 观点</h2>${relatedPoints.map((point) => `<a class="brief-link" href="${pointUrl(point)}"><strong>${escapeHtml(pointPersonDisplay(point))}</strong><span>${escapeHtml(pointTitle(point))}</span><small>${escapeHtml(pointEvidenceText(point, 86))}</small></a>`).join("") || `<p>暂无关联一线观点。</p>`}</section>
        <section class="detail-section"><h2>每日评分</h2>${scoreRows.map((row) => `<a class="brief-link" href="${row.opportunitySlug ? `./opportunity.html?slug=${encodeURIComponent(row.opportunitySlug)}` : "./opportunities.html"}"><strong>${escapeHtml(scoreOpportunityName(row))}</strong><span>${escapeHtml([row.date, row.total ? `${row.total}/30` : "", verdictLabel(row)].filter(Boolean).join(" · "))}</span><small>${escapeHtml(scoreNote(row))}</small></a>`).join("") || `<p>暂无关联评分。</p>`}</section>
      </article>
      <aside class="trend-detail-side">
        <h2>关联机会</h2>
        ${relatedOpps.map((opp) => `<a class="brief-link" href="${opportunityUrl(opp)}"><strong>${escapeHtml(opp.title)}</strong><span>${escapeHtml([opp.priorityScore ? `${opp.priorityScore}/30` : "", opp.priorityVerdict || opp.priority, opp.evidenceLevel ? `来源 ${opp.evidenceLevel}` : ""].filter(Boolean).join(" · "))}</span><small>${escapeHtml(opportunityBrief(opp))}</small></a>`).join("") || `<p>暂无关联机会卡。</p>`}
        <h2>关联 Signals</h2>
        ${relatedSignals.map((signal) => `<a class="brief-link" href="${signalUrl(signal)}"><strong>${escapeHtml(signalHeadline(signal))}</strong><span>${escapeHtml(signalContext(signal))}</span><small>${escapeHtml(signalBrief(signal))}</small></a>`).join("") || `<p>暂无关联 Signal。</p>`}
        <h2>保留观察</h2>
        ${(trend.counterEvidence || []).map((item) => `<p class="counter-item">${escapeHtml(item)}</p>`).join("") || `<p>仍需继续观察客户采用和收入迹象。</p>`}
      </aside>
    </section>
  `;
}

function renderOpportunitiesPage() {
  renderPriorityEngine();
  renderOpportunityFilters();
  renderOpportunities();
  $("#opportunitySearch")?.addEventListener("input", renderOpportunities);
  $("#opportunityIndustry")?.addEventListener("change", renderOpportunities);
  $("#opportunityPriority")?.addEventListener("change", renderOpportunities);
}

function renderPriorityEngine() {
  const box = $("#priorityEngine");
  if (!box) return;
  const rows = scoreRowsForDisplay();
  box.innerHTML = rows.length
    ? rows
        .map((row, index) => {
          const href = row.opportunitySlug ? ` href="./opportunity.html?slug=${encodeURIComponent(row.opportunitySlug)}"` : "";
          const tag = href ? "a" : "article";
          return `<${tag} class="priority-engine-card ${scoreLevelClass(row)}"${href}>
          <span class="rank-pill">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>${escapeHtml(scoreOpportunityName(row))}</strong>
            <small>${escapeHtml([row.track, scoreSourceName(row)].filter(Boolean).join(" · ") || "综合信号")}</small>
          </div>
          <div class="priority-engine-score">
            <b>${escapeHtml(row.total || "-")}/30</b>
            <span>${escapeHtml(verdictLabel(row))}</span>
          </div>
          <p>${escapeHtml(scoreNote(row))}</p>
        </${tag}>`;
        })
        .join("")
    : `<div class="empty-state">暂无优先级评分。同步评分文档后，这里会自动生成。</div>`;
}

function renderOpportunityFilters() {
  const industrySelect = $("#opportunityIndustry");
  const prioritySelect = $("#opportunityPriority");
  if (!industrySelect || !prioritySelect) return;
  const currentIndustry = industrySelect.value;
  const currentPriority = prioritySelect.value;
  const industries = [...new Set((state.opportunities || []).map((item) => item.industry).filter(Boolean))].sort();
  const priorities = [...new Set((state.opportunities || []).map((item) => item.priority).filter(Boolean))].sort((a, b) => ({ 高: 1, 中: 2, 低: 3 }[a] - { 高: 1, 中: 2, 低: 3 }[b]));
  industrySelect.innerHTML = `<option value="">全部行业</option>${industries.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}`;
  prioritySelect.innerHTML = `<option value="">全部行动优先级</option>${priorities.map((item) => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}`;
  industrySelect.value = industries.includes(currentIndustry) ? currentIndustry : "";
  prioritySelect.value = priorities.includes(currentPriority) ? currentPriority : "";
}

function renderOpportunities() {
  const list = $("#opportunityList");
  if (!list) return;
  const search = $("#opportunitySearch")?.value.trim().toLowerCase() || "";
  const industry = $("#opportunityIndustry")?.value || "";
  const priority = $("#opportunityPriority")?.value || "";
  const items = (state.opportunities || []).filter((item) => {
    const haystack = [item.title, item.industry, item.businessFunction, item.scenario, item.priority, item.evidenceLevel, item.summary?.["一句话机会定义"], item.tags?.join(" ")].join(" ").toLowerCase();
    return (!industry || item.industry === industry) && (!priority || item.priority === priority) && (!search || haystack.includes(search));
  });
  renderOpportunityStats(items);
  list.innerHTML = items.length ? items.map(renderOpportunityCard).join("") : `<div class="empty-state">暂无匹配机会。</div>`;
}

function renderOpportunityStats(items) {
  const stat = $("#opportunityStats");
  if (!stat) return;
  const all = state.opportunities || [];
  const avg = (key) => {
    const nums = all.map((item) => item[key]).filter(Boolean);
    return nums.length ? (nums.reduce((sum, value) => sum + value, 0) / nums.length).toFixed(1) : "-";
  };
  stat.innerHTML = `<article><span>机会卡</span><strong>${items.length}/${all.length}</strong></article><article><span>高行动优先级</span><strong>${all.filter((item) => item.priority === "高").length}</strong></article><article><span>平均成熟度</span><strong>${avg("maturity")}</strong></article><article><span>平均适配度</span><strong>${avg("chinaFit")}</strong></article>`;
}

function renderOpportunityCard(item) {
  const definition = item.summary?.["一句话机会定义"] || "";
  const index = state.opportunities.findIndex((opp) => opp.id === item.id);
  return `<article class="opportunity-card opportunity-card-link">${visualEditButton("opportunities", index)}<a href="${opportunityUrl(item)}"><div class="opportunity-card-head"><div><p class="eyebrow">${escapeHtml(item.industry || "AI Opportunity")}</p><h3>${escapeHtml(item.title)}</h3></div><div class="opportunity-badges">${item.priorityScore ? `<span class="badge strong">评分 ${escapeHtml(item.priorityScore)}/30</span>` : item.priority ? `<span class="badge strong">${escapeHtml(item.priority)}</span>` : ""}${item.evidenceLevel ? `<span class="badge">证据 ${escapeHtml(item.evidenceLevel)}</span>` : ""}</div></div><p class="opportunity-definition">${escapeHtml(definition)}</p><div class="opportunity-meta"><span>职能：${escapeHtml(item.businessFunction || "-")}</span><span>规模：${escapeHtml(item.enterpriseSize || "-")}</span><span>回本：${escapeHtml(item.estimatedRoi || "-")}</span><span>复盘：${escapeHtml(item.nextReview || "-")}</span></div><div class="opportunity-score-row">${renderMiniScore("成熟度", item.maturity)}${renderMiniScore("中国适配", item.chinaFit)}${renderMiniScore("紧迫度", item.urgency)}</div><div class="chips">${(item.tags || []).slice(0, 9).map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div><span class="card-link-label">查看完整机会拆解</span></a></article>`;
}

function renderOpportunityDetailPage() {
  const targetId = params.get("id") || "";
  const targetSlug = params.get("slug") || "";
  const item = state.opportunities.find((opp) => opp.id === targetId || opportunitySlug(opp) === targetSlug) || state.opportunities[0];
  const box = $("#opportunityDetail");
  if (!box) return;
  if (!item) {
    box.innerHTML = `<div class="empty-state">暂无机会卡。</div>`;
    return;
  }
  document.title = `${item.title}｜观澜AI｜WaveSight AI`;
  const relatedPoints = pointsForOpportunity(item);
  box.innerHTML = `
    <section class="page-title opportunity-detail-title">
      <p class="eyebrow">Opportunity Card · ${escapeHtml(item.industry || "机会卡")}</p>
      <h1>${escapeHtml(item.title)}</h1>
    </section>
    <div class="opportunity-detail-layout">
      <aside class="opportunity-detail-aside">
        <div class="opportunity-badges">
          ${item.priorityScore ? `<span class="badge strong">评分 ${escapeHtml(item.priorityScore)}/30</span>` : ""}
          ${item.priority ? `<span class="badge strong">${escapeHtml(item.priority)}</span>` : ""}
          ${item.evidenceLevel ? `<span class="badge">证据 ${escapeHtml(item.evidenceLevel)}</span>` : ""}
        </div>
        <div class="opportunity-score-row stacked">
          ${renderMiniScore("成熟度", item.maturity)}
          ${renderMiniScore("中国适配", item.chinaFit)}
          ${renderMiniScore("紧迫度", item.urgency)}
        </div>
        <div class="opportunity-meta detail-meta">
          <span>职能：${escapeHtml(item.businessFunction || "-")}</span>
          <span>规模：${escapeHtml(item.enterpriseSize || "-")}</span>
          <span>回本：${escapeHtml(item.estimatedRoi || "-")}</span>
          <span>复盘：${escapeHtml(item.nextReview || "-")}</span>
        </div>
        <div class="chips">${(item.tags || []).slice(0, 14).map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join("")}</div>
      </aside>
      <article class="opportunity-detail-main">
        ${renderDetailSection("一句话机会定义", item.summary?.["一句话机会定义"])}
        ${renderDetailSection("为什么是现在", item.summary?.["为什么是现在"])}
        ${renderDetailSection("这是谁的问题", item.summary?.["这是谁的问题"])}
        ${renderDetailSection("不做的代价", item.summary?.["不做的代价"])}
        ${renderDetailSection("原始痛点", item.problem?.["原始痛点"])}
        ${renderDetailSection("当前替代方案", item.problem?.["当前替代方案"])}
        ${renderDetailSection("AI 解决方案类型", item.problem?.["AI解决方案类型"])}
        ${renderDetailSection("实施路径", item.problem?.["典型实施路径"])}
        ${renderDetailSection("ROI 假设", item.roi?.["可能提升的收入"] || item.roi?.["可能节省的成本"])}
        ${renderDetailSection("代表性案例", item.cases?.["案例公司"] || item.cases?.["发生了什么"])}
        ${relatedPoints.length ? `<section class="detail-section"><h2>The Point 观点证据</h2>${relatedPoints.map((point) => `<a class="brief-link" href="${pointUrl(point)}"><strong>${escapeHtml(pointPersonDisplay(point))}</strong><span>${escapeHtml(pointTitle(point))}</span><small>${escapeHtml(pointEvidenceText(point, 86))}</small></a>`).join("")}</section>` : ""}
        ${renderDetailSection("最大风险", item.risks?.["最大风险"])}
        ${renderDetailSection("下一步最小验证动作", item.actions?.["下一步最小验证动作"])}
      </article>
    </div>`;
}

function renderDetailSection(title, body) {
  return body ? `<section class="detail-section"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p></section>` : "";
}

function renderMiniScore(label, value) {
  const width = value ? Math.min(100, (value / 5) * 100) : 0;
  return `<div class="mini-score"><span>${escapeHtml(label)}</span><strong>${value || "-"}/5</strong><div class="score-bar"><span style="width:${width}%"></span></div></div>`;
}

function renderTagsPage() {
  const tags = buildTagIndex();
  const searchInput = $("#tagSearch");
  const typeFilter = $("#tagTypeFilter");
  const query = searchInput?.value.trim().toLowerCase() || "";
  const type = typeFilter?.value || "";
  const filtered = tags.filter((tag) => (!type || tag.categories.includes(type)) && (!query || tag.label.toLowerCase().includes(query)));
  const requested = params.get("tag") || "";
  const selected = filtered.some((tag) => tag.label === requested) ? requested : filtered[0]?.label || tags[0]?.label || "";
  renderTagCloud(filtered, selected);
  renderTagResults(tags.find((tag) => tag.label === selected) || filtered[0] || null);
  if (searchInput && !searchInput.dataset.bound) {
    searchInput.dataset.bound = "true";
    searchInput.addEventListener("input", renderTagsPage);
  }
  if (typeFilter && !typeFilter.dataset.bound) {
    typeFilter.dataset.bound = "true";
    typeFilter.addEventListener("change", renderTagsPage);
  }
}

function buildTagIndex() {
  const map = new Map();
  const categoryMap = {
    tracks: "track",
    industries: "industry",
    functions: "function",
    scenarios: "scenario",
    capabilities: "capability",
    stages: "stage",
    geos: "geo",
    signals: "signal",
    actions: "action",
    priorities: "priority",
    scoreBands: "score",
    topics: "topic",
    products: "product",
  };
  const itemKey = (type, item) => [type, item.id || item.slug || item.track || item.product || item.title || JSON.stringify(item)].join("::");
  const add = (label, type, item, category = "topic") => {
    const key = clean(label || "");
    if (!key) return;
    if (!map.has(key)) map.set(key, { label: key, categories: new Set(), signals: [], scoring: [], trends: [], opportunities: [], keys: new Set() });
    const entry = map.get(key);
    entry.categories.add(category);
    const uniqueKey = itemKey(type, item);
    if (!entry.keys.has(uniqueKey)) {
      entry.keys.add(uniqueKey);
      entry[type].push(item);
    }
  };
  const addTaxonomy = (taxonomy, type, item) => {
    Object.entries(taxonomy || {}).forEach(([key, values]) => {
      (values || []).forEach((value) => add(value, type, item, categoryMap[key] || "topic"));
    });
  };

  state.signals.forEach((signal) => {
    add(signal.track, "signals", signal, "track");
    add(signal.product, "signals", signal, "product");
    (signal.tags || []).forEach((tag) => add(tag, "signals", signal, "topic"));
    add(signal.newsType, "signals", signal, "topic");
    addTaxonomy(signal.taxonomy, "signals", signal);
  });
  scoreRowsForDisplay().forEach((row) => {
    add(scoreOpportunityName(row), "scoring", row, "topic");
    add(scoreSourceName(row), "scoring", row, "product");
    add(row.track, "scoring", row, "track");
    add(verdictLabel(row), "scoring", row, "action");
    (row.tags || []).forEach((tag) => add(tag, "scoring", row, "topic"));
    addTaxonomy(row.taxonomy, "scoring", row);
  });
  state.trends.forEach((trend) => {
    add(trend.track, "trends", trend, "track");
    (trend.products || []).forEach((product) => add(product.product, "trends", trend, "product"));
    (trend.tags || []).forEach((tag) => add(tag, "trends", trend, "topic"));
    addTaxonomy(trend.taxonomy, "trends", trend);
  });
  (state.opportunities || []).forEach((opp) => {
    add(opp.industry, "opportunities", opp, "industry");
    add(opp.businessFunction, "opportunities", opp, "function");
    add(opp.scenario, "opportunities", opp, "scenario");
    add(opp.priority ? `${opp.priority}优先级` : "", "opportunities", opp, "priority");
    (opp.tags || []).forEach((tag) => add(tag, "opportunities", opp, "topic"));
    addTaxonomy(opp.taxonomy, "opportunities", opp);
  });

  return [...map.values()]
    .map((tag) => ({
      label: tag.label,
      categories: [...tag.categories],
      signals: tag.signals,
      scoring: tag.scoring,
      trends: tag.trends,
      opportunities: tag.opportunities,
      total: tag.signals.length + tag.scoring.length + tag.trends.length + tag.opportunities.length,
    }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label, "zh-CN"));
}

function renderTagCloud(tags, selected) {
  const box = $("#tagCloud");
  if (!box) return;
  const visible = tags.slice(0, 80);
  box.innerHTML = tags.length
    ? visible
        .map((tag) => `<a class="tag-pill ${tag.label === selected ? "active" : ""}" href="./tags.html?tag=${encodeURIComponent(tag.label)}"><span>${escapeHtml(tag.label)}</span><strong>${tag.total}</strong></a>`)
        .join("") + (tags.length > visible.length ? `<p class="tag-limit-note">已显示前 ${visible.length} 个高关联标签，可继续搜索定位更细标签。</p>` : "")
    : `<div class="empty-state">暂无匹配标签。</div>`;
}

function renderTagResults(tag) {
  const box = $("#tagResults");
  if (!box) return;
  if (!tag) {
    box.innerHTML = `<div class="empty-state">暂无标签数据。</div>`;
    return;
  }
  const unique = (items, key) => [...new Map(items.map((item) => [item[key] || item.id || item.track, item])).values()];
  const signalsAll = unique(tag.signals, "id");
  const scoringAll = unique(tag.scoring, "id");
  const trendsAll = unique(tag.trends, "track");
  const opportunitiesAll = unique(tag.opportunities, "id");
  const signals = signalsAll.slice(0, 10);
  const scoring = scoringAll.slice(0, 10);
  const trends = trendsAll.slice(0, 10);
  const opportunities = opportunitiesAll.slice(0, 10);
  box.innerHTML = `
    <div class="tag-results-head">
      <p class="eyebrow">Selected Tag</p>
      <h2>${escapeHtml(tag.label)}</h2>
      <p>这个标签正在连接 ${tag.total} 条内容：信号、优先级、趋势和机会卡会在这里合并成一条可追踪的判断线。</p>
      <div class="tag-stat-row">
        <span><strong>${signalsAll.length}</strong> Signals</span>
        <span><strong>${scoringAll.length}</strong> Priorities</span>
        <span><strong>${trendsAll.length}</strong> Trends</span>
        <span><strong>${opportunitiesAll.length}</strong> Opportunities</span>
      </div>
      <div class="chips">${tag.categories.map((item) => `<span class="chip">${escapeHtml(tagCategoryText(item))}</span>`).join("")}</div>
    </div>
    <div class="tag-result-grid">
      <section class="tag-column">
        <h3>Signals</h3>
        ${signals.map((signal) => `<a class="brief-link" href="${signalUrl(signal)}"><strong>${escapeHtml(signalHeadline(signal))}</strong><span>${escapeHtml(signalContext(signal))}</span><small>${escapeHtml(shortText(signal.summary || signal.newsType || signal.title, 58))}</small></a>`).join("") || `<p>暂无关联 Signal。</p>`}
      </section>
      <section class="tag-column">
        <h3>Priorities</h3>
        ${scoring.map((row) => `<a class="brief-link" href="./scoring.html"><strong>${escapeHtml(scoreOpportunityName(row))}</strong><span>${escapeHtml(row.track || "-")} · ${escapeHtml(row.total || "-")}/30 · ${escapeHtml(verdictLabel(row))}</span><small>${escapeHtml(scoreNote(row))}</small></a>`).join("") || `<p>暂无关联优先级判断。</p>`}
      </section>
      <section class="tag-column">
        <h3>Trends</h3>
        ${trends.map((trend) => `<a class="brief-link" href="${trendUrl(trend)}"><strong>${escapeHtml(trend.track)}</strong><span>${escapeHtml(clean(trend.thirtyDay || trend.sevenDay) || "-")}</span><small>${escapeHtml(shortText(trend.verdict || trend.thirtyDay || trend.sevenDay, 58))}</small></a>`).join("") || `<p>暂无关联趋势。</p>`}
      </section>
      <section class="tag-column">
        <h3>Opportunities</h3>
        ${opportunities.map((opp) => `<a class="brief-link" href="${opportunityUrl(opp)}"><strong>${escapeHtml(opp.title)}</strong><span>${escapeHtml(opp.industry || "-")} · ${escapeHtml(opp.priority || "-")}</span><small>${escapeHtml(opportunityBrief(opp))}</small></a>`).join("") || `<p>暂无关联机会卡。</p>`}
      </section>
    </div>
  `;
}

function tagCategoryText(category) {
  return {
    track: "赛道",
    industry: "行业",
    function: "职能",
    scenario: "场景",
    capability: "能力",
    stage: "阶段",
    geo: "地区",
    signal: "信号类型",
    action: "行动判断",
    score: "优先级层级",
    topic: "主题",
    product: "代表证据",
    priority: "行动优先级",
  }[category] || category;
}

function scoreNote(row = {}) {
  if (!row.total) return "等待补充机会强度。";
  if (row.total >= 27) return "高强度机会信号，证据密度和商业相关性较高。";
  if (row.total >= 24) return "中高强度方向，需要继续结合趋势和商业化证据观察。";
  return "观察型方向，当前证据仍需补充，保留反证视角。";
}

function renderOpportunityColumn(title, body) {
  return body ? `<section><h4>${escapeHtml(title)}</h4><p>${escapeHtml(body)}</p></section>` : "";
}

const adminVisualEditPages = new Set(["signals", "scoring", "trends", "trend-detail", "opportunities", "opportunity-detail"]);

function isAdminVisualEditMode() {
  return adminVisualEditPages.has(page) && (params.get("admin") === "1" || params.get("edit") === "1");
}

function visualEditButton(type, index) {
  if (!isAdminVisualEditMode() || index < 0 || index === undefined) return "";
  return `<button class="inline-edit-btn" type="button" data-edit-type="${escapeHtml(type)}" data-edit-index="${index}">编辑</button>`;
}

function installVisualEditToolbar() {
  if (!isAdminVisualEditMode() || document.querySelector(".visual-edit-toolbar")) return;
  if (!hasAccess()) return;
  const bar = document.createElement("div");
  bar.className = "visual-edit-toolbar";
  bar.innerHTML = `<button class="ghost-btn" id="visualEditToggle">页面编辑</button>`;
  document.body.appendChild(bar);
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest(".inline-edit-btn");
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    openVisualEditor(button.dataset.editType, Number(button.dataset.editIndex));
  });
  $("#visualEditToggle")?.addEventListener("click", () => {
    visualEditing = !visualEditing;
    document.body.classList.toggle("visual-editing", visualEditing);
    $("#visualEditToggle").textContent = visualEditing ? "退出编辑" : "页面编辑";
    if (visualEditing) ensureVisualEditDialog();
  });
}

function ensureVisualEditDialog() {
  if ($("#visualEditDialog")) return;
  const dialog = document.createElement("dialog");
  dialog.id = "visualEditDialog";
  dialog.className = "dialog wide visual-edit-dialog";
  dialog.innerHTML = `
    <form method="dialog" id="visualEditForm">
      <div class="section-head compact">
        <div><p class="eyebrow">Visual Edit</p><h2 id="visualEditTitle">编辑内容</h2></div>
        <button class="icon-btn" value="cancel" aria-label="关闭">x</button>
      </div>
      <div id="visualEditFields" class="form-grid"></div>
      <div class="dialog-actions">
        <span id="visualEditStatus"></span>
        <button class="ghost-btn" value="cancel">取消</button>
        <button class="primary-btn" id="visualEditSaveBtn" value="default">保存</button>
      </div>
    </form>`;
  document.body.appendChild(dialog);
}

function getVisualItem(type, index) {
  return getAdminCollection(type)[index] || null;
}

function fieldTemplate(name, label, value = "", wide = false, textarea = false) {
  const escaped = escapeHtml(value ?? "");
  return `<label class="field ${wide ? "wide" : ""}"><span>${escapeHtml(label)}</span>${textarea ? `<textarea name="${name}" rows="5">${escaped}</textarea>` : `<input name="${name}" value="${escaped}" />`}</label>`;
}

function openVisualEditor(type, index) {
  ensureVisualEditDialog();
  const item = getVisualItem(type, index);
  if (!item) return;
  const fields = $("#visualEditFields");
  const title = $("#visualEditTitle");
  const form = $("#visualEditForm");
  form.dataset.type = type;
  form.dataset.index = String(index);
  title.textContent = `编辑 ${adminItemLabel(item, index)}`;
  if (type === "trends") {
    fields.innerHTML = [
      fieldTemplate("track", "赛道", item.track),
      fieldTemplate("sevenDay", "7天趋势", item.sevenDay, true, true),
      fieldTemplate("thirtyDay", "30天趋势", item.thirtyDay, true, true),
      fieldTemplate("verdict", "趋势判断", item.verdict, true, true),
    ].join("");
  } else if (type === "opportunities") {
    fields.innerHTML = [
      fieldTemplate("title", "机会标题", item.title, true),
      fieldTemplate("industry", "行业", item.industry),
      fieldTemplate("businessFunction", "业务职能", item.businessFunction),
      fieldTemplate("scenario", "场景", item.scenario, true),
      fieldTemplate("priority", "优先级", item.priority),
      fieldTemplate("evidenceLevel", "证据等级", item.evidenceLevel),
      fieldTemplate("definition", "一句话机会定义", item.summary?.["一句话机会定义"] || "", true, true),
      fieldTemplate("nextAction", "下一步最小验证动作", item.actions?.["下一步最小验证动作"] || "", true, true),
    ].join("");
  } else if (type === "scoring") {
    fields.innerHTML = [
      fieldTemplate("product", "产品", item.product),
      fieldTemplate("track", "赛道", item.track),
      fieldTemplate("total", "总分", item.total),
      fieldTemplate("verdict", "判断", item.verdict),
      fieldTemplate("funding", "资金", item.funding),
      fieldTemplate("commercialization", "商业化", item.commercialization),
      fieldTemplate("growth", "增长", item.growth),
      fieldTemplate("demand", "需求", item.demand),
      fieldTemplate("replicability", "可复制", item.replicability),
      fieldTemplate("competition", "竞争", item.competition),
    ].join("");
  } else {
    fields.innerHTML = [
      fieldTemplate("product", "产品", item.product),
      fieldTemplate("track", "赛道", item.track),
      fieldTemplate("title", "标题", item.title, true),
      fieldTemplate("date", "日期", item.date),
      fieldTemplate("tags", "标签，用 ｜ 分隔", (item.tags || []).join("｜"), true),
      fieldTemplate("summary", "简介", item.summary, true, true),
    ].join("");
  }
  $("#visualEditDialog").showModal();
}

document.addEventListener("submit", async (event) => {
  if (event.target?.id !== "visualEditForm") return;
  event.preventDefault();
  const form = event.target;
  const type = form.dataset.type;
  const index = Number(form.dataset.index);
  const items = [...getAdminCollection(type)];
  const item = { ...items[index] };
  if (!item) return;
  const value = (name) => form.elements[name]?.value?.trim() || "";
  if (type === "trends") {
    Object.assign(item, { track: value("track"), sevenDay: value("sevenDay"), thirtyDay: value("thirtyDay"), verdict: value("verdict"), slug: trendSlug({ ...item, track: value("track") }) });
  } else if (type === "opportunities") {
    item.title = value("title");
    item.industry = value("industry");
    item.businessFunction = value("businessFunction");
    item.scenario = value("scenario");
    item.priority = value("priority");
    item.evidenceLevel = value("evidenceLevel");
    item.summary = { ...(item.summary || {}), "一句话机会定义": value("definition") };
    item.actions = { ...(item.actions || {}), "下一步最小验证动作": value("nextAction") };
    item.slug = opportunitySlug(item);
  } else if (type === "scoring") {
    ["product", "track", "verdict"].forEach((key) => (item[key] = value(key)));
    ["total", "funding", "commercialization", "growth", "demand", "replicability", "competition"].forEach((key) => (item[key] = Number(value(key)) || 0));
  } else {
    item.product = value("product");
    item.track = value("track");
    item.title = value("title");
    item.date = value("date");
    item.tags = value("tags").split("｜").map((tag) => tag.trim()).filter(Boolean);
    item.summary = value("summary");
    item.slug = signalSlug(item);
  }
  items[index] = item;
  setAdminCollection(type, items);
  await persistState($("#visualEditStatus"), "已保存到数据文件。");
  $("#visualEditDialog")?.close();
  refreshCurrentPage();
});

function refreshCurrentPage() {
  if (page === "home") renderHome();
  if (page === "daily") renderDailyPage();
  if (page === "the-point") renderThePointPage();
  if (page === "point-daily") renderPointDailyPage();
  if (page === "point-detail") renderPointDetailPage();
  if (page === "point-source") renderPointSourcePage();
  if (page === "scoring") renderScoring();
  if (page === "trends") renderTrends();
  if (page === "trend-detail") renderTrendDetailPage();
  if (page === "opportunities") renderOpportunities();
  if (page === "opportunity-detail") renderOpportunityDetailPage();
  if (page === "tags") renderTagsPage();
  if (page === "signals") {
    renderSignalList();
    renderDetail();
  }
  document.body.classList.toggle("visual-editing", visualEditing);
}

function renderRegisterPage() {
  const form = $("#registerForm");
  const status = $("#authStatus");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const contact = form.contact.value.trim().toLowerCase();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    if (password.length < 6) {
      setStatusMessage(status, "密码至少需要 6 位。");
      return;
    }
    if (password !== confirmPassword) {
      setStatusMessage(status, "两次输入的密码不一致。");
      return;
    }
    const users = getUsers();
    const existing = users.find((user) => String(user.contact || "").trim().toLowerCase() === contact);
    if (existing) {
      if (existing.password) {
        setStatusMessage(status, "这个邮箱已经注册，请直接登录。");
        return;
      }
      const updatedUser = updateUser(existing.id, {
        name: form.name.value.trim() || existing.name,
        contact,
        password,
        company: form.company.value.trim() || existing.company,
        roleTitle: form.roleTitle.value.trim() || existing.roleTitle,
      });
      setCurrentUser(updatedUser);
      setStatusMessage(status, "密码已设置，正在进入账户。");
      window.setTimeout(() => {
        location.href = params.get("return") || "./account.html";
      }, 400);
      return;
    }
    const settings = getMembershipSettings();
    const now = todayDate();
    const user = {
      id: `user-${Date.now()}`,
      name: form.name.value.trim(),
      contact,
      password,
      company: form.company.value.trim(),
      roleTitle: form.roleTitle.value.trim(),
      role: "user",
      status: "trial",
      plan: "trial",
      trialStart: now,
      accessUntil: addDays(now, settings.trialDays),
      createdAt: new Date().toISOString(),
    };
    saveUsers([user, ...users]);
    setCurrentUser(user);
    setStatusMessage(status, `注册成功，阅读权限有效期至 ${formatDate(user.accessUntil)}。`);
    window.setTimeout(() => {
      location.href = params.get("return") || "./account.html";
    }, 400);
  });
}

function renderLoginPage() {
  const form = $("#loginForm");
  const status = $("#authStatus");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const contact = form.contact.value.trim().toLowerCase();
    const password = form.password.value;
    const user = getUsers().find((item) => String(item.contact || "").trim().toLowerCase() === contact);
    if (!user) {
      setStatusMessage(status, "没有找到这个账号。可以先注册，再查看完整信号脉络。");
      return;
    }
    if (!user.password) {
      setStatusMessage(status, "这个账号还没有设置密码，请前往注册页补设密码。");
      return;
    }
    if (user.password !== password) {
      setStatusMessage(status, "密码不正确，请重新输入。");
      return;
    }
    setCurrentUser(user);
    location.href = params.get("return") || "./account.html";
  });
}

function renderAccountPage() {
  const box = $("#accountPanel");
  if (!box) return;
  const user = currentUser();
  if (!user) {
    box.innerHTML = `
      <article class="auth-card">
        <p class="eyebrow">Account</p>
        <h2>先登录或注册</h2>
        <p>注册后查看 Daily Brief、Signals、Trends 与 Opportunities 的完整内容。</p>
        <div class="hero-actions"><a class="primary-btn as-link" href="./register.html">注册</a><a class="ghost-btn as-link" href="./login.html">登录</a></div>
      </article>
    `;
    return;
  }
  box.innerHTML = `
    <article class="account-summary">
      <p class="eyebrow">Membership</p>
      <h2>${escapeHtml(userAccessLabel(user))}</h2>
      <dl>
        <div><dt>姓名</dt><dd>${escapeHtml(user.name || "-")}</dd></div>
        <div><dt>账号</dt><dd>${escapeHtml(user.contact || "-")}</dd></div>
        <div><dt>公司/机构</dt><dd>${escapeHtml(user.company || "-")}</dd></div>
        <div><dt>身份</dt><dd>${escapeHtml(user.roleTitle || "-")}</dd></div>
      </dl>
      <div class="hero-actions"><a class="primary-btn as-link" href="./pricing.html">${isPermissionActive(user) ? "管理订阅" : "续订阅读权限"}</a><button id="accountLogoutBtn" class="ghost-btn">退出登录</button></div>
    </article>
    <aside class="account-side">
      <p class="eyebrow">Readable Layers</p>
      <h2>当前可阅读内容</h2>
      <ul>
        <li>Daily Brief：每日商业变化主线</li>
        <li>Signals：信号证据与产品事件</li>
        <li>Trends：趋势状态与证据阶梯</li>
        <li>Opportunities：机会卡与验证线索</li>
      </ul>
    </aside>
  `;
  $("#accountLogoutBtn")?.addEventListener("click", () => {
    clearCurrentUser();
    location.href = "./index.html";
  });
}

function renderPricingPage() {
  const box = $("#pricingPlans");
  if (!box) return;
  box.innerHTML = Object.values(planCatalog)
    .map(
      (plan) => `
        <article class="plan-card">
          <p class="eyebrow">${escapeHtml(plan.id)}</p>
          <h2>${escapeHtml(plan.name)}</h2>
          <strong>￥${escapeHtml(plan.price)}<small> / ${plan.months === 1 ? "月" : `${plan.months}个月`}</small></strong>
          <p>${escapeHtml(plan.note)}</p>
          <div class="plan-fit">${escapeHtml(plan.bestFor)}</div>
          <ul>${plan.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          <a class="primary-btn as-link" href="./checkout.html?plan=${escapeHtml(plan.id)}">选择${escapeHtml(plan.name)}</a>
        </article>
      `
    )
    .join("");
}

function renderCheckoutPage() {
  const box = $("#checkoutPanel");
  if (!box) return;
  const plan = planCatalog[params.get("plan")] || planCatalog.monthly;
  const user = currentUser();
  if (!user) {
    box.innerHTML = `
      <article class="auth-card">
        <p class="eyebrow">Checkout</p>
        <h2>请先登录</h2>
        <p>登录或注册后即可开通订阅。</p>
        <div class="hero-actions"><a class="primary-btn as-link" href="./register.html?return=checkout.html?plan=${escapeHtml(plan.id)}">注册</a><a class="ghost-btn as-link" href="./login.html?return=checkout.html?plan=${escapeHtml(plan.id)}">登录</a></div>
      </article>
    `;
    return;
  }
  box.innerHTML = `
    <article class="checkout-card">
      <p class="eyebrow">Payment</p>
      <h2>${escapeHtml(plan.name)}</h2>
      <strong>￥${escapeHtml(plan.price)}</strong>
      <p>${escapeHtml(plan.note)}。当前演示环境会在本地直接模拟支付完成，云端部署时再接入真实支付网关。</p>
      <button id="completePaymentBtn" class="primary-btn">确认开通</button>
      <div id="checkoutStatus" class="sync-status"></div>
    </article>
  `;
  $("#completePaymentBtn")?.addEventListener("click", () => {
    const freshUser = currentUser();
    const baseDate = freshUser.accessUntil && freshUser.accessUntil >= todayDate() ? freshUser.accessUntil : todayDate();
    const accessUntil = addMonths(baseDate, plan.months);
    updateUser(freshUser.id, { status: "member", plan: plan.id, accessUntil });
    saveOrders([
      { id: `order-${Date.now()}`, userId: freshUser.id, plan: plan.id, price: plan.price, accessUntil, createdAt: new Date().toISOString() },
      ...getOrders(),
    ]);
    setStatusMessage($("#checkoutStatus"), `已开通，有效期至 ${formatDate(accessUntil)}。`);
    window.setTimeout(() => {
      location.href = "./account.html";
    }, 700);
  });
}

function renderLegacyAccessPage() {
  const box = $("#legacyAccessPanel");
  if (!box) return;
  box.innerHTML = `
    <article class="auth-card">
      <p class="eyebrow">Access Updated</p>
      <h2>访问方式已更新</h2>
      <p>观澜AI现在采用注册与订阅权限，旧入口已经停用。</p>
      <div class="hero-actions"><a class="primary-btn as-link" href="./register.html">注册</a><a class="ghost-btn as-link" href="./login.html">登录</a></div>
    </article>
  `;
}

function renderAdminPage() {
  const grantButton = $("#grantLocalAccessBtn");
  if (grantButton && !grantButton.dataset.bound) {
    grantButton.dataset.bound = "true";
    grantButton.addEventListener("click", () => {
      localStorage.setItem(accessKey, "approved");
      renderAdminPage();
    });
  }
  bindSyncButton();
  bindAdminContentManager();
  renderAdminMembership();
  renderAdminOrders();
}

function renderAdminMembership() {
  const settings = getMembershipSettings();
  const trialInput = $("#trialDaysInput");
  if (trialInput) trialInput.value = String(settings.trialDays);
  const saveTrialButton = $("#saveTrialSettingsBtn");
  if (saveTrialButton && !saveTrialButton.dataset.bound) {
    saveTrialButton.dataset.bound = "true";
    saveTrialButton.addEventListener("click", () => {
      const days = Math.max(1, Number(trialInput?.value || 7));
      saveMembershipSettings({ trialDays: days });
      setStatusMessage($("#memberStatus"), `新注册用户默认阅读有效期已调整为 ${days} 天。`);
    });
  }
  const list = $("#memberList");
  if (!list) return;
  const users = getUsers();
  list.innerHTML = users.length
    ? users
        .map(
          (user) => `
            <article class="member-card">
              <div>
                <h3>${escapeHtml(user.name || "未命名用户")}</h3>
                <p>${escapeHtml(user.contact || "-")} · ${escapeHtml(user.company || "-")} · ${escapeHtml(user.roleTitle || "-")}</p>
                <span class="badge">${escapeHtml(userAccessLabel(user))}</span>
              </div>
              <div class="member-actions">
                <button class="ghost-btn" data-extend="week" data-user="${escapeHtml(user.id)}">加一周</button>
                <button class="ghost-btn" data-extend="month" data-user="${escapeHtml(user.id)}">加一月</button>
                <button class="ghost-btn" data-extend="quarter" data-user="${escapeHtml(user.id)}">加一季</button>
                <button class="danger-btn" data-expire="${escapeHtml(user.id)}">设为到期</button>
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty-state">暂无注册用户。</div>`;
  list.onclick = (event) => {
    const extend = event.target.dataset.extend;
    const expire = event.target.dataset.expire;
    const userId = event.target.dataset.user || expire;
    if (!userId) return;
    if (expire) {
      updateUser(userId, { accessUntil: addDays(todayDate(), -1), status: "expired" });
    } else if (extend) {
      const user = getUsers().find((item) => item.id === userId);
      const baseDate = user.accessUntil && user.accessUntil >= todayDate() ? user.accessUntil : todayDate();
      const nextDate = extend === "week" ? addDays(baseDate, 7) : addMonths(baseDate, extend === "quarter" ? 3 : 1);
      updateUser(userId, { accessUntil: nextDate, status: "member" });
    }
    renderAdminMembership();
  };
}

function renderAdminOrders() {
  const list = $("#orderList");
  if (!list) return;
  const users = getUsers();
  const userMap = new Map(users.map((user) => [user.id, user]));
  const orders = getOrders();
  list.innerHTML = orders.length
    ? orders
        .map((order) => {
          const user = userMap.get(order.userId) || {};
          const plan = planCatalog[order.plan] || {};
          return `<article class="order-card"><div><h3>${escapeHtml(plan.name || order.plan)}</h3><p>${escapeHtml(user.name || "-")} · ${escapeHtml(user.contact || "-")}</p></div><strong>￥${escapeHtml(order.price || "-")}</strong><span>${escapeHtml(formatDate(order.accessUntil))}</span></article>`;
        })
        .join("")
    : `<div class="empty-state">暂无订阅记录。</div>`;
}

function getAdminCollection(type) {
  if (type === "signals") return state.signals;
  if (type === "scoring") return state.scoring.rows || [];
  if (type === "trends") return state.trends || [];
  if (type === "opportunities") return state.opportunities || [];
  return [];
}

function setAdminCollection(type, items) {
  if (type === "signals") state.signals = items;
  if (type === "scoring") state.scoring = { ...state.scoring, rows: items };
  if (type === "trends") state.trends = items;
  if (type === "opportunities") state.opportunities = items;
}

function adminItemLabel(item = {}, index = 0) {
  return item.product || item.title || item.track || item.id || `条目 ${index + 1}`;
}

function bindAdminContentManager() {
  const typeSelect = $("#adminContentType");
  const itemSelect = $("#adminContentItem");
  const jsonBox = $("#adminContentJson");
  const status = $("#adminContentStatus");
  if (!typeSelect || !itemSelect || !jsonBox || typeSelect.dataset.bound) return;
  typeSelect.dataset.bound = "true";

  const renderItems = () => {
    const items = getAdminCollection(typeSelect.value);
    itemSelect.innerHTML = items.map((item, index) => `<option value="${index}">${escapeHtml(adminItemLabel(item, index))}</option>`).join("");
    renderJson();
  };

  const renderJson = () => {
    const items = getAdminCollection(typeSelect.value);
    const item = items[Number(itemSelect.value)] || items[0] || {};
    jsonBox.value = JSON.stringify(item, null, 2);
    if (status) status.textContent = item.id ? `正在编辑：${adminItemLabel(item)}` : "暂无条目。";
  };

  typeSelect.addEventListener("change", renderItems);
  itemSelect.addEventListener("change", renderJson);
  $("#adminSaveContentBtn")?.addEventListener("click", async () => {
    try {
      const parsed = JSON.parse(jsonBox.value);
      const items = [...getAdminCollection(typeSelect.value)];
      const index = Number(itemSelect.value);
      items[index] = parsed;
      setAdminCollection(typeSelect.value, items);
      renderItems();
      itemSelect.value = String(index);
      renderJson();
      await persistState(status, "已保存到数据文件，刷新后仍会保留。");
    } catch (error) {
      if (status) status.textContent = `JSON 格式错误：${error.message}`;
    }
  });
  $("#adminDuplicateContentBtn")?.addEventListener("click", async () => {
    try {
      const parsed = JSON.parse(jsonBox.value);
      const copy = { ...parsed, id: `${parsed.id || typeSelect.value}-${Date.now()}`, slug: localSlug(`${parsed.slug || parsed.title || parsed.product || parsed.track || typeSelect.value}-${Date.now()}`) };
      const items = [...getAdminCollection(typeSelect.value), copy];
      setAdminCollection(typeSelect.value, items);
      renderItems();
      itemSelect.value = String(items.length - 1);
      renderJson();
      await persistState(status, "已复制并写入数据文件。");
    } catch (error) {
      if (status) status.textContent = `JSON 格式错误：${error.message}`;
    }
  });
  $("#adminDeleteContentBtn")?.addEventListener("click", async () => {
    const items = [...getAdminCollection(typeSelect.value)];
    const index = Number(itemSelect.value);
    if (!items.length || index < 0) return;
    items.splice(index, 1);
    setAdminCollection(typeSelect.value, items);
    renderItems();
    await persistState(status, "已删除并写入数据文件。");
  });
  renderItems();
}

function bindSyncButton() {
  const button = $("#runSyncBtn");
  const status = $("#syncStatus");
  if (!button || !status || button.dataset.bound) return;
  button.dataset.bound = "true";
  if (location.protocol === "file:") {
    status.innerHTML = `当前是直接打开文件模式。请先运行 <code>node 04-Site/scripts/admin-server.mjs</code>，再访问 <code>http://localhost:8787/admin.html</code> 使用一键同步。`;
  }
  button.addEventListener("click", async () => {
    if (location.protocol === "file:") {
      status.innerHTML = `浏览器文件模式不能执行本地脚本。请先启动本地管理服务：<code>node 04-Site/scripts/admin-server.mjs</code>`;
      return;
    }
    button.disabled = true;
    status.textContent = "正在同步 Markdown 数据...";
    try {
      const response = await fetch("/api/sync", { method: "POST" });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.message || "同步失败。");
      localStorage.removeItem(storageKey);
      status.textContent = `${result.message} 页面将在 1 秒后刷新。`;
      window.setTimeout(() => location.reload(), 1000);
    } catch (error) {
      status.textContent = `同步失败：${error.message}`;
      button.disabled = false;
    }
  });
}

function drawRadar() {
  const canvas = $("#radarCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fffdfa";
  ctx.fillRect(0, 0, w, h);
  const scores = [...state.scoring.rows].sort((a, b) => b.total - a.total).slice(0, 6);
  const cx = w / 2;
  const cy = h / 2 + 8;
  const maxR = Math.min(w, h) * 0.34;
  ctx.strokeStyle = "#ded8cd";
  for (let r = 1; r <= 4; r += 1) {
    ctx.beginPath();
    ctx.arc(cx, cy, (maxR * r) / 4, 0, Math.PI * 2);
    ctx.stroke();
  }
  scores.forEach((row, index) => {
    const angle = (index / Math.max(1, scores.length)) * Math.PI * 2 - Math.PI / 2;
    const radius = (row.total / 30) * maxR;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * maxR, cy + Math.sin(angle) * maxR);
    ctx.strokeStyle = "rgba(31, 41, 38, 0.16)";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = index < 3 ? "#0f8b78" : "#c76a38";
    ctx.fill();
    ctx.fillStyle = "#1d2422";
    ctx.font = "12px Segoe UI, Microsoft YaHei, sans-serif";
    ctx.fillText(row.product.slice(0, 18), cx + Math.cos(angle) * (maxR + 12) - 42, cy + Math.sin(angle) * (maxR + 12));
  });
  ctx.fillStyle = "#1d2422";
  ctx.font = "700 18px Segoe UI, Microsoft YaHei, sans-serif";
  ctx.fillText("Opportunity Map", 18, 30);
}

function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}

init();
