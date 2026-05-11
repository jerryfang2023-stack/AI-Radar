const seedData = window.AI_RADAR_DATA || { signals: [], scoring: { rows: [] }, trends: [], points: [], pointTopics: [], opportunities: [] };
const storageKey = "ai-business-radar-state-v2";
const accessKey = "ai-business-radar-access";
const userKey = "wavesight-users";
const sessionKey = "wavesight-session";
const settingsKey = "wavesight-membership-settings";
const ordersKey = "wavesight-orders";
const invitesKey = "wavesight-invite-codes";
const inviteRequestsKey = "wavesight-invite-requests";
const analyticsKey = "wavesight-analytics";
const visitorKey = "wavesight-visitor-id";
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

function getInvites() {
  try {
    return JSON.parse(localStorage.getItem(invitesKey) || "[]");
  } catch {
    return [];
  }
}

function saveInvites(invites) {
  localStorage.setItem(invitesKey, JSON.stringify(invites));
}

function getInviteRequests() {
  try {
    return JSON.parse(localStorage.getItem(inviteRequestsKey) || "[]");
  } catch {
    return [];
  }
}

function saveInviteRequests(requests) {
  localStorage.setItem(inviteRequestsKey, JSON.stringify(requests));
}

function normalizeInviteCode(code = "") {
  return String(code).trim().toUpperCase().replace(/\s+/g, "");
}

function inviteStatus(invite = {}) {
  if (invite.status === "paused") return "paused";
  if (invite.expiresAt && invite.expiresAt < todayDate()) return "expired";
  if (Number(invite.usedCount || 0) >= Number(invite.maxUses || 1)) return "used";
  return "active";
}

function generateInviteCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "WS-";
  for (let index = 0; index < 8; index += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

function createInvite({ maxUses = 1, days = 30, note = "", requestId = "", email = "" } = {}) {
  const existing = new Set(getInvites().map((invite) => normalizeInviteCode(invite.code)));
  let code = generateInviteCode();
  while (existing.has(code)) code = generateInviteCode();
  return {
    id: `invite-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    code,
    status: "active",
    maxUses: Math.max(1, Number(maxUses || 1)),
    usedCount: 0,
    usedBy: [],
    note,
    requestId,
    email,
    expiresAt: addDays(todayDate(), Math.max(1, Number(days || 30))),
    createdAt: new Date().toISOString(),
  };
}

function consumeInviteCode(code, contact) {
  const normalized = normalizeInviteCode(code);
  const invites = getInvites();
  const index = invites.findIndex((invite) => normalizeInviteCode(invite.code) === normalized);
  if (index === -1) return { ok: false, message: "邀请码不存在，请检查后重试。" };
  const invite = invites[index];
  const status = inviteStatus(invite);
  if (status === "paused") return { ok: false, message: "这个邀请码已暂停使用。" };
  if (status === "expired") return { ok: false, message: "这个邀请码已过期，请联系观澜AI团队。" };
  if (status === "used") return { ok: false, message: "这个邀请码已被使用完。" };
  const usedBy = Array.isArray(invite.usedBy) ? invite.usedBy : [];
  invites[index] = {
    ...invite,
    usedCount: Number(invite.usedCount || 0) + 1,
    usedBy: [...usedBy, { contact, usedAt: new Date().toISOString() }],
    updatedAt: new Date().toISOString(),
  };
  saveInvites(invites);
  return { ok: true, invite: invites[index] };
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

function pageAnalyticsMeta() {
  const map = {
    home: { key: "home", label: "首页", group: "入口" },
    daily: { key: "daily", label: "Daily Brief", group: "栏目" },
    "daily-detail": { key: "daily", label: "Daily Brief", group: "栏目详情" },
    signals: { key: "signals", label: "Signals", group: "栏目" },
    "signal-detail": { key: "signals", label: "Signals", group: "栏目详情" },
    "the-point": { key: "point", label: "The Point", group: "栏目" },
    "point-detail": { key: "point", label: "The Point", group: "栏目详情" },
    "point-daily": { key: "point", label: "The Point", group: "栏目详情" },
    "point-source": { key: "point", label: "The Point", group: "栏目详情" },
    opportunities: { key: "opportunities", label: "Opportunities", group: "栏目" },
    "opportunity-detail": { key: "opportunities", label: "Opportunities", group: "栏目详情" },
    trends: { key: "trends", label: "Trends", group: "栏目" },
    "trend-detail": { key: "trends", label: "Trends", group: "栏目详情" },
    pricing: { key: "pricing", label: "Pricing", group: "转化" },
    register: { key: "register", label: "注册", group: "转化" },
    login: { key: "login", label: "登录", group: "转化" },
    account: { key: "account", label: "账户", group: "会员" },
    checkout: { key: "checkout", label: "Checkout", group: "转化" },
  };
  return map[page] || { key: page || "unknown", label: page || "未知页面", group: "其他" };
}

function getVisitorId() {
  let id = localStorage.getItem(visitorKey);
  if (!id) {
    id = `visitor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(visitorKey, id);
  }
  return id;
}

function getAnalytics() {
  try {
    const parsed = JSON.parse(localStorage.getItem(analyticsKey) || "{}") || {};
    return {
      totalPv: Number(parsed.totalPv || 0),
      visitors: Array.isArray(parsed.visitors) ? parsed.visitors : [],
      days: parsed.days || {},
      columns: parsed.columns || {},
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
    };
  } catch {
    return { totalPv: 0, visitors: [], days: {}, columns: {}, recent: [] };
  }
}

function saveAnalytics(analytics) {
  localStorage.setItem(analyticsKey, JSON.stringify(analytics));
}

function trackPageView() {
  if (page === "admin") return;
  const visitorId = getVisitorId();
  const meta = pageAnalyticsMeta();
  const today = todayDate();
  const analytics = getAnalytics();
  const visitors = new Set(analytics.visitors || []);
  visitors.add(visitorId);
  const day = analytics.days[today] || { pv: 0, visitors: [] };
  const dayVisitors = new Set(day.visitors || []);
  dayVisitors.add(visitorId);
  const column = analytics.columns[meta.key] || { label: meta.label, group: meta.group, pv: 0, visitors: [] };
  const columnVisitors = new Set(column.visitors || []);
  columnVisitors.add(visitorId);
  analytics.totalPv += 1;
  analytics.visitors = [...visitors];
  analytics.days[today] = { pv: Number(day.pv || 0) + 1, visitors: [...dayVisitors] };
  analytics.columns[meta.key] = {
    ...column,
    label: meta.label,
    group: meta.group,
    pv: Number(column.pv || 0) + 1,
    visitors: [...columnVisitors],
    updatedAt: new Date().toISOString(),
  };
  analytics.recent = [{ page, key: meta.key, label: meta.label, at: new Date().toISOString() }, ...(analytics.recent || [])].slice(0, 100);
  saveAnalytics(analytics);
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
  const text = clean(title);
  if (/WebVNC|桌面\/浏览器租赁|浏览器租赁/i.test(text)) return "浏览器租赁成为 Agent 执行入口";
  if (/graph|图谱/i.test(text) && /记忆|代码|检索/.test(text)) return "记忆、代码与检索统一成 Agent 图谱";
  const claim = text.split(/[：:]/).slice(1).join("：").trim() || text;
  const normalized = claim
    .replace(/(AI)\s*从[^，。；：:]{2,18}进入/, "$1 进入")
    .replace(/^(发布|上线|推出|宣布|完成|新增)[：:\s]*/, "")
    .replace(/[，,；;。].*$/, "")
    .replace(/\s+/g, " ")
    .trim();
  return shortText(normalized || claim, 20);
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
  if (/priority_verify|优先/.test(raw)) return "优先验证";
  if (/active_watch|持续|观察|跟踪|中性/.test(raw)) return "持续观察";
  if (/early_watch|早期/.test(raw)) return "早期观察";
  if (/cautious|谨慎/.test(raw)) return "谨慎观察";
  if (/downgrade|回避|暂缓/.test(raw)) return "暂缓关注";
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

function signalLabData() {
  return window.SIGNAL_LAB_DATA || { summary: {}, frontSignals: [], trends: [], excludedStructured: [] };
}

function renderSignalLabPage() {
  const lab = signalLabData();
  const summary = lab.summary || {};
  const stages = [
    ["Raw", summary.rawCount || 0, "原始采集"],
    ["Pool", summary.poolCount || 0, "初筛入池"],
    ["Structured", summary.structuredCount || 0, "结构化入库"],
    ["Front", summary.frontCount || 0, "测试展示"],
    ["Deep", summary.deepDiveCount || 0, "深挖机会卡"],
  ];

  if ($("#signalLabDate")) $("#signalLabDate").textContent = lab.date || "";
  const stats = $("#signalLabStats");
  if (stats) {
    stats.innerHTML = stages
      .map(
        ([label, value, note]) => `
          <article>
            <span>${escapeHtml(label)}</span>
            <strong>${escapeHtml(String(value))}</strong>
            <small>${escapeHtml(note)}</small>
          </article>
        `
      )
      .join("");
  }

  const signals = $("#signalLabSignals");
  if (signals) {
    signals.innerHTML = (lab.frontSignals || [])
      .map(
        (signal) => `
          <article class="signal-lab-card">
            <div class="signal-lab-rank">${escapeHtml(signal.rank || "")}</div>
            <div class="signal-lab-card-main">
              <div class="signal-lab-card-head">
                <div>
                  <p class="eyebrow">${escapeHtml(signal.track || "Signal")}</p>
                  <h3>${escapeHtml(signal.title || "")}</h3>
                </div>
                <div class="signal-lab-score"><strong>${escapeHtml(String(signal.score || ""))}</strong><span>/100</span><small>${escapeHtml(signal.scoreLabel || "")}</small></div>
              </div>
              <p>${escapeHtml(signal.summary || "")}</p>
              <div class="signal-lab-reading">
                <strong>观澜解读</strong>
                <p>${escapeHtml(signal.interpretation || "")}</p>
              </div>
              <div class="signal-lab-dimensions">
                ${(signal.sixDimensions || [])
                  .map((item, index) => `<span><b>${index + 1}</b>${escapeHtml(item)}</span>`)
                  .join("")}
              </div>
              <div class="signal-lab-sources">
                ${(signal.secondarySearch || [])
                  .map((source) => `<a href="${escapeHtml(source.url || "#")}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.label || "来源")}<span>${escapeHtml(source.tier || "")}</span></a>`)
                  .join("")}
              </div>
            </div>
          </article>
        `
      )
      .join("");
  }

  const opportunity = $("#signalLabOpportunity");
  const deep = lab.deepDive || {};
  if (opportunity) {
    opportunity.innerHTML = `
      <div class="signal-lab-opportunity-head">
        <div>
          <p class="eyebrow">${escapeHtml(deep.id || "Opportunity")}</p>
          <h3>${escapeHtml(deep.title || "")}</h3>
          <p>${escapeHtml(deep.definition || "")}</p>
        </div>
        <div class="signal-lab-score large"><strong>${escapeHtml(String(deep.score || ""))}</strong><span>/100</span><small>观察价值</small></div>
      </div>
      <div class="signal-lab-opportunity-grid">
        ${renderSignalLabList("目标客户", deep.customers)}
        ${renderSignalLabList("付费方式", deep.businessModel)}
        ${renderSignalLabList("进入壁垒", deep.barriers)}
        ${renderSignalLabList("反证与风险", deep.risks)}
      </div>
      <div class="signal-lab-action-map">
        <h4>行动地图</h4>
        ${renderSignalLabList("可验证问题", deep.actionMap?.questions)}
        ${renderSignalLabList("应访谈客户", deep.actionMap?.interviews)}
        ${renderSignalLabList("应观察指标", deep.actionMap?.metrics)}
        <div class="signal-lab-watch">
          <span>7 天：${escapeHtml(deep.actionMap?.watch7d || "")}</span>
          <span>30 天：${escapeHtml(deep.actionMap?.watch30d || "")}</span>
          <span>90 天：${escapeHtml(deep.actionMap?.watch90d || "")}</span>
        </div>
      </div>
    `;
  }

  const trends = $("#signalLabTrends");
  if (trends) {
    trends.innerHTML = (lab.trends || [])
      .map(
        (trend) => `
          <article>
            <div><strong>${escapeHtml(trend.name || "")}</strong><small>${escapeHtml(trend.status || "")}</small></div>
            <span style="--heat:${Number(trend.heat || 0)}%"><b></b></span>
            <p>${escapeHtml(trend.note || "")}</p>
          </article>
        `
      )
      .join("");
  }

  const excluded = $("#signalLabExcluded");
  if (excluded) {
    excluded.innerHTML = (lab.excludedStructured || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  }
}

function renderSignalLabList(title, items = []) {
  return `
    <div>
      <strong>${escapeHtml(title)}</strong>
      <ul>${(items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </div>
  `;
}

function init() {
  renderAuthControls();
  trackPageView();
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
  if (page === "signal-lab") renderSignalLabPage();
  if (page === "register") renderRegisterPage();
  if (page === "invite-request") renderInviteRequestPage();
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
    if (page === "admin" && !window.confirm("清除本机编辑缓存后，未写入网站数据文件的改动会丢失。确认继续？")) return;
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
  renderHomeDesk();
  renderHomeHighlights();
}

function renderStats() {
  const scores = state.signals.map(scoreOf).filter(Boolean);
  if ($("#statSignals")) $("#statSignals").textContent = state.signals.length;
  if ($("#statLong")) $("#statLong").textContent = scores.filter((score) => score.priorityStatusV2 === "priority_verify" || score.total >= 25).length;
  if ($("#statTopScore")) $("#statTopScore").textContent = Math.max(0, ...scores.map((score) => score.total));
  if ($("#statTrends")) $("#statTrends").textContent = state.trends.length;
  if ($("#statOpportunities")) $("#statOpportunities").textContent = state.opportunities.length;
}

function renderHomeDesk() {
  const desk = $("#homeDesk");
  if (!desk) return;
  const thesisBox = $(".desk-thesis");
  const signalList = $(".desk-signal-list");
  const opportunityBox = $(".desk-opportunity");
  const trendBox = $(".desk-trend");
  if (!thesisBox && !signalList && !opportunityBox && !trendBox) return;
  const latestDate = latestSignalDate();
  const signals = getNonRepeatedSignals(state.signals.filter((signal) => signal.date === latestDate))
    .sort((a, b) => (b.signalScore || scoreOf(b)?.total || 0) - (a.signalScore || scoreOf(a)?.total || 0))
    .slice(0, 2);
  const opportunity = [...state.opportunities].sort((a, b) => (b.priorityScore || b.urgency || 0) - (a.priorityScore || a.urgency || 0))[0] || {};
  const trend = [...state.trends].sort((a, b) => (b.latestScore || 0) - (a.latestScore || 0))[0] || {};
  const leadSignal = signals[0] || state.signals[0] || {};
  const thesis = leadSignal.id
    ? shortText(signalMeaningText(leadSignal), 48)
    : "从今日 AI 变化中筛出可继续观察的商业信号。";
  const opportunityMeta = [opportunity.industry, opportunity.evidenceLevel ? `${opportunity.evidenceLevel}` : "", opportunity.relatedTrendTracks?.[0]].filter(Boolean).join(" · ");
  const trendMeta = [trend.statusLabel || trendStatusMeta(trend.status).label, trend.relatedSignalIds?.length ? `${trend.relatedSignalIds.length} Signals` : ""].filter(Boolean).join(" · ");

  if (thesisBox) thesisBox.textContent = thesis;
  if (signalList) {
    signalList.innerHTML = signals.length
      ? signals
          .map(
            (signal, index) => `
              <a class="desk-signal" href="${signalUrl(signal)}">
                <span>${String(index + 1).padStart(2, "0")} Signal</span>
                <strong>${escapeHtml(shortText(signalHeadline(signal), 34))}</strong>
                <small>${escapeHtml(shortText(signalMeaningText(signal), 48))}</small>
              </a>
            `
          )
          .join("")
      : `<p class="desk-empty">暂无新的高强度 Signal。</p>`;
  }
  if (opportunityBox) {
    opportunityBox.innerHTML = opportunity.title
      ? `
        <span>Opportunity Watch</span>
        <strong>${escapeHtml(shortText(opportunity.title, 28))}</strong>
        <p>${escapeHtml(homeOpportunityInsight(opportunity))}</p>
        <small>${escapeHtml(opportunityMeta || "持续观察")}</small>
      `
      : `<span>Opportunity Watch</span><strong>机会观察</strong><p>暂无可展示机会卡。</p>`;
  }
  if (trendBox) {
    trendBox.innerHTML = trend.track
      ? `
        <span>Trend Status</span>
        <strong>${escapeHtml(shortText(trend.track, 28))}</strong>
        <p>${escapeHtml(homeTrendInsight(trend))}</p>
        <small>${escapeHtml(trendMeta || "持续观察")}</small>
      `
      : `<span>Trend Status</span><strong>趋势状态</strong><p>暂无可展示趋势。</p>`;
  }
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

function publicPoints() {
  return (state.points || []).filter((point) => !["hidden", "needs_review"].includes(String(point.status || "").toLowerCase()));
}

function pointSourceTypeLabel(point = {}) {
  const source = clean(point.source || point.sourceType || "");
  if (/youtube/i.test(source)) return "YouTube";
  if (/\bx\b|twitter/i.test(source)) return "X";
  if (/podcast/i.test(source)) return "Podcast";
  if (/blog|official/i.test(source)) return "Blog";
  return source.split("/")[0]?.trim() || "Source";
}

function pointSourceDisplay(point = {}) {
  return [pointPersonDisplay(point), pointSourceTypeLabel(point)].filter(Boolean).join(" · ");
}

function pointReadableQuote(point = {}, max = 180) {
  return pointReadableText(point, max) || pointOriginal(point, max) || shortText(point.pointSummary || pointTitle(point), max);
}

function pointHomeTitle(point = {}, max = 40) {
  const title = pointTitle(point)
    .replace(/[“”"]/g, "")
    .replace(/ 的工程量会创造更多工作，而不是一键替代/, "：工程量会创造更多工作")
    .replace(/ 的体验在 12 月后出现跃迁式变化/, "：体验出现跃迁式变化")
    .replace(/ 更擅长自动化可验证的工作，能力锯齿化会长期存在/, "：更擅长可验证工作")
    .replace(/^把 AI 当作公用事业，而不是生命体$/, "把 AI 当作公用事业")
    .replace(/^全网最强并行 Agent 工厂正在发生在在线 IDE 里$/, "并行 Agent 工厂正在进入在线 IDE");
  return shortText(title, max);
}

function pointStatusKind(point = {}, topicCounts = new Map()) {
  const text = normalizeText([point.stance, point.boundary, point.interpretation, point.commercialMeaning, point.title].join(" "));
  if (/cautious|critical|skeptical|debate|risk|谨慎|分歧|风险|反证|边界|不确定/.test(text)) return "debate";
  const repeatedTopic = (point.topics || []).some((topic) => (topicCounts.get(topic) || 0) > 1);
  if (repeatedTopic) return "consensus";
  return "early";
}

function pointStatusLabel(kind = "") {
  return {
    consensus: "正在形成共识",
    debate: "出现分歧",
    early: "早期信号",
  }[kind] || "早期信号";
}

function pointStatusCopy(kind = "") {
  return {
    consensus: "多位高质量来源正在反复谈到同一方向。",
    debate: "观点提示了路径差异、风险或采用边界。",
    early: "单条观点质量较高，但还需要继续观察。",
  }[kind] || "单条观点质量较高，但还需要继续观察。";
}

function latestPublicPointDate() {
  return [...new Set(publicPoints().map((point) => point.date).filter(Boolean))].sort().at(-1) || "";
}

function publicPointsForDate(date = "") {
  return publicPoints()
    .filter((point) => !date || point.date === date)
    .sort((a, b) => (b.pointScore || 0) - (a.pointScore || 0) || (a.rank || 99) - (b.rank || 99));
}

function pointTopicCounts(points = []) {
  const counts = new Map();
  points.forEach((point) => (point.topics || []).forEach((topic) => counts.set(topic, (counts.get(topic) || 0) + 1)));
  return counts;
}

function uniqueBy(items = [], keyFn = (item) => item.id) {
  const map = new Map();
  items.forEach((item) => {
    const key = keyFn(item);
    if (key && !map.has(key)) map.set(key, item);
  });
  return [...map.values()];
}

function relatedSignalsForPoint(point = {}, max = 3) {
  const ids = new Set(point.relatedSignalIds || []);
  return (state.signals || []).filter((signal) => ids.has(signal.id)).slice(0, max);
}

function relatedTrendsForPoint(point = {}, max = 3) {
  const ids = new Set(point.relatedTrendIds || []);
  return (state.trends || []).filter((trend) => ids.has(trend.track) || ids.has(trend.id)).slice(0, max);
}

function relatedOpportunitiesForPoint(point = {}, max = 3) {
  const ids = new Set(point.relatedOpportunityIds || []);
  return (state.opportunities || []).filter((opp) => ids.has(opp.id) || ids.has(opp.opportunityId)).slice(0, max);
}

function renderPointRelationLinks(point = {}) {
  return point?.id ? `<div class="point-relation-links"><a href="${pointUrl(point)}">查看观点</a></div>` : "";
}

function renderPointSourceActions(point = {}) {
  return `
    <div class="point-source-actions">
      <a href="${pointUrl(point)}">查看观点</a>
    </div>
  `;
}

function renderPointHomeCard(point = {}, topicCounts = new Map(), compact = false) {
  const kind = pointStatusKind(point, topicCounts);
  return `
    <article class="${compact ? "point-judgment-card" : "point-home-row"}">
      <div class="point-home-row-meta">
        <span>${escapeHtml(pointStatusLabel(kind))}</span>
        <strong>${escapeHtml(pointSourceDisplay(point))}</strong>
        <small>${escapeHtml([point.date, pointTopicLabel(point)].filter(Boolean).join(" · "))}</small>
      </div>
      <div class="point-home-row-body">
        <h3><a href="${pointUrl(point)}">${escapeHtml(pointHomeTitle(point, compact ? 32 : 42))}</a></h3>
        <p class="point-original-summary">${escapeHtml(pointReadableQuote(point, compact ? 118 : 176))}</p>
        <p class="point-guanlan-note"><b>观澜解读</b>${escapeHtml(pointBrief(point, compact ? 90 : 132))}</p>
      </div>
      ${renderPointSourceActions(point)}
    </article>
  `;
}

function renderPointJudgmentGroups(points = []) {
  const topicCounts = pointTopicCounts(points);
  const grouped = { consensus: [], debate: [], early: [] };
  points.forEach((point) => grouped[pointStatusKind(point, topicCounts)].push(point));
  const fallback = points.slice(0, 3);
  const groups = [
    ["consensus", grouped.consensus.length ? grouped.consensus : fallback],
    ["debate", grouped.debate.length ? grouped.debate : fallback.slice(0, 2)],
    ["early", grouped.early.length ? grouped.early : fallback.slice(1, 3)],
  ];
  return `
    <section class="point-judgment-grid" aria-label="The Point 判断分组">
      ${groups
        .map(([kind, items]) => {
          const point = items[0];
          return `
            <article class="point-judgment-panel ${kind}">
              <span>${escapeHtml(pointStatusLabel(kind))}</span>
              <p>${escapeHtml(pointStatusCopy(kind))}</p>
              ${point ? renderPointHomeCard(point, topicCounts, true) : `<div class="empty-state">暂无可展示观点。</div>`}
            </article>
          `;
        })
        .join("")}
    </section>
  `;
}

function collectPointRelatedAssets(points = []) {
  const signals = uniqueBy(points.flatMap((point) => relatedSignalsForPoint(point, 2)), (item) => item.id).slice(0, 4);
  const trends = uniqueBy(points.flatMap((point) => relatedTrendsForPoint(point, 2)), (item) => item.track || item.id).slice(0, 4);
  const opportunities = uniqueBy(points.flatMap((point) => relatedOpportunitiesForPoint(point, 2)), (item) => item.id || item.opportunityId).slice(0, 4);
  return { signals, trends, opportunities };
}

function renderPointRelatedLane(title, eyebrow, items = [], renderItem) {
  return `
    <section class="point-related-lane">
      <div class="point-related-lane-head">
        <span>${escapeHtml(eyebrow)}</span>
        <h3>${escapeHtml(title)}</h3>
      </div>
      <div class="point-related-list">
        ${items.length ? items.map((item, index) => renderItem(item, index)).join("") : `<p>暂无关联内容。</p>`}
      </div>
    </section>
  `;
}

function renderPointRelatedAssets(points = []) {
  const assets = collectPointRelatedAssets(points);
  return `
    <section class="point-related-assets">
      <header class="point-related-head">
        <div>
          <p class="eyebrow">Related Judgment</p>
          <h2>相关判断</h2>
        </div>
        <p>从今日一线观点延展出的事实、趋势与机会方向。</p>
      </header>
      <div class="point-related-frame">
        ${renderPointRelatedLane("相关信号", "Signals", assets.signals, (signal, index) => `
          <a class="point-related-item" href="${signalUrl(signal)}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div><strong>${escapeHtml(shortText(signalHeadline(signal), 46))}</strong><small>${escapeHtml(signalMeaningText(signal))}</small></div>
          </a>
        `)}
        ${renderPointRelatedLane("相关趋势", "Trends", assets.trends, (trend, index) => `
          <a class="point-related-item" href="${trendUrl(trend)}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div><strong>${escapeHtml(shortText(trend.track, 30))}</strong><small>${escapeHtml(shortText(trend.verdict || trend.thirtyDay || trend.sevenDay, 64))}</small></div>
          </a>
        `)}
        ${renderPointRelatedLane("相关机会", "Opportunities", assets.opportunities, (opp, index) => `
          <a class="point-related-item" href="${opportunityUrl(opp)}">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <div><strong>${escapeHtml(shortText(opp.title, 32))}</strong><small>${escapeHtml(shortText(opportunityBrief(opp), 64))}</small></div>
          </a>
        `)}
      </div>
    </section>
  `;
}

function renderPointDates() {
  const box = $("#pointDates");
  if (!box) return;
  const dates = [...new Set(publicPoints().map((point) => point.date).filter(Boolean))].sort().reverse().slice(0, 8);
  box.innerHTML = dates.length
    ? dates
        .map((date) => {
          const points = publicPointsForDate(date);
          const people = groupPointsByPerson(points).length;
          return `<a href="${pointDailyUrl(date)}"><strong>${escapeHtml(date)}</strong><span>${escapeHtml(`${points.length} 条观点 · ${people} 位来源`)}</span></a>`;
        })
        .join("")
    : `<div class="empty-state">暂无往期观点。</div>`;
}

function pointTopicUrl(topic = "") {
  return `./the-point.html?topic=${encodeURIComponent(topic)}`;
}

function topicPoints(topic = "") {
  const target = normalizeText(topic);
  if (!target) return [];
  return publicPoints()
    .filter((point) => (point.topics || []).some((item) => normalizeText(item) === target))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || (b.pointScore || 0) - (a.pointScore || 0));
}

function renderPointTopicCollection(topic = "") {
  const points = topicPoints(topic).slice(0, 12);
  if (!topic || !points.length) return "";
  const topicCounts = pointTopicCounts(points);
  return `
    <section class="point-topic-collection">
      <header class="point-topic-collection-head">
        <div>
          <p class="eyebrow">Topic Collection</p>
          <h2>${escapeHtml(topic)}</h2>
        </div>
        <a href="./the-point.html">返回最新观点</a>
      </header>
      <div class="point-topic-collection-list">
        ${points.map((point) => renderPointHomeCard(point, topicCounts)).join("")}
      </div>
    </section>
  `;
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
  const latestDate = latestPublicPointDate();
  const latestPoints = publicPointsForDate(latestDate);
  const topicCounts = pointTopicCounts(latestPoints);
  const lead = latestPoints[0];
  const todayRows = latestPoints.slice(0, 10);
  const selectedTopic = params.get("topic") || "";
  const topicCollection = renderPointTopicCollection(selectedTopic);
  archive.innerHTML = lead
    ? topicCollection || `
      <section class="point-home-lead">
        <div class="point-lead-copy">
          <div class="point-lead-meta">
            <span>${escapeHtml(pointStatusLabel(pointStatusKind(lead, topicCounts)))}</span>
            <strong>${escapeHtml(pointSourceDisplay(lead))}</strong>
            <small>${escapeHtml([pointSourceTypeLabel(lead), lead.date].filter(Boolean).join(" · "))}</small>
          </div>
          <h2>${escapeHtml(pointHomeTitle(lead, 34))}</h2>
          <blockquote>${escapeHtml(pointReadableQuote(lead, 210))}</blockquote>
          <div class="point-lead-interpretation">
            <span>观澜解读</span>
            <p>${escapeHtml(pointBrief(lead, 156))}</p>
          </div>
          ${renderPointSourceActions(lead)}
        </div>
        <div class="point-lead-lines">
          ${["consensus", "debate", "early"].map((kind) => `<article><span>${escapeHtml(pointStatusLabel(kind))}</span><p>${escapeHtml(pointStatusCopy(kind))}</p></article>`).join("")}
        </div>
      </section>
      ${renderPointJudgmentGroups(latestPoints)}
      <section class="point-today-section">
        <div class="point-home-section-head">
          <p class="eyebrow">Today</p>
          <h2>${escapeHtml(latestDate)} 今日一线观点</h2>
        </div>
        <div class="point-home-list">
          ${todayRows.map((point) => renderPointHomeCard(point, topicCounts)).join("")}
        </div>
      </section>
    `
    : `<div class="empty-state">暂无一线观点。下一次内容发布后会在这里呈现。</div>`;
  renderPointDates();
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
  const renderGroupCards = (items, startIndex = 0) =>
    items
      .map(
          (group, index) => {
            const primary = group.points[0];
            return `
            <article class="point-card point-person-card">
              <a href="${pointUrl(primary)}">
                <span class="point-rank">${String(startIndex + index + 1).padStart(2, "0")}</span>
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
            ${remainingGroups.length ? renderGroupCards(remainingGroups, topGroups.length) : `<div class="empty-state">今日暂无更多观点。</div>`}
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
              <a href="${pointTopicUrl(topic.name)}">
                <span>${escapeHtml(topic.momentum === "rising" ? "升温" : "观察")}</span>
                <strong>${escapeHtml(topic.name)}</strong>
                <small>7日热度 ${escapeHtml(topic.heat_7d || 0)} · 30日热度 ${escapeHtml(topic.heat_30d || 0)}</small>
              </a>
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
  const personTitle = personGroup.title || point.source || "";
  const titleMeta = [
    personTitle && !sameProductName(personTitle, personGroup.person) ? personTitle : "",
    point.date,
    point.pointScore ? `${point.pointScore}/100` : "",
  ].filter(Boolean).join(" · ");
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
      <p class="eyebrow">The Point · 人物观点</p>
      <h1>${escapeHtml(personGroup.person)}</h1>
      <p class="point-title-meta">${escapeHtml(titleMeta)}</p>
      <p class="point-title-topic">${escapeHtml(pointTitle(point))}</p>
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
                  ${pointSourceLink(item, "阅读原文")}
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
                    `<p><strong>${escapeHtml(item.date || "")}</strong><span>${pointSourceLink(item, personSources.length > 1 ? `阅读原文 ${index + 1}` : "阅读原文")}</span></p>`
                )
                .join("")}</section>`
            : ""
        }
      </article>
      <aside class="point-detail-side">
        <section class="point-person-summary">
          <h2>人物档案</h2>
          <p><strong>${escapeHtml(personGroup.person)}</strong>${personTitle && !sameProductName(personTitle, personGroup.person) ? ` · ${escapeHtml(personTitle)}` : ""}</p>
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
  if (form) form.addEventListener("submit", (event) => {
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
    const inviteCode = normalizeInviteCode(form.inviteCode?.value || "");
    if (!inviteCode) {
      setStatusMessage(status, "请填写邀请码。");
      return;
    }
    const users = getUsers();
    const existing = users.find((user) => String(user.contact || "").trim().toLowerCase() === contact);
    if (existing) {
      if (existing.password) {
        setStatusMessage(status, "这个邮箱已经注册，请直接登录。");
        return;
      }
    }
    const inviteResult = consumeInviteCode(inviteCode, contact);
    if (!inviteResult.ok) {
      setStatusMessage(status, inviteResult.message);
      return;
    }
    const settings = getMembershipSettings();
    const now = todayDate();
    if (existing) {
      const updatedUser = updateUser(existing.id, {
        name: form.name.value.trim() || existing.name,
        contact,
        password,
        company: form.company?.value?.trim() || existing.company,
        roleTitle: form.roleTitle?.value?.trim() || existing.roleTitle,
        inviteCode,
        status: existing.status || "trial",
        plan: existing.plan || "trial",
        trialStart: existing.trialStart || now,
        accessUntil: existing.accessUntil || addDays(now, settings.trialDays),
      });
      setCurrentUser(updatedUser);
      setStatusMessage(status, "密码已设置，正在进入账户。");
      window.setTimeout(() => {
        location.href = params.get("return") || "./daily.html";
      }, 400);
      return;
    }
    const user = {
      id: `user-${Date.now()}`,
      name: form.name.value.trim(),
      contact,
      password,
      company: form.company?.value?.trim() || "",
      roleTitle: form.roleTitle?.value?.trim() || "",
      role: "user",
      status: "trial",
      plan: "trial",
      inviteCode,
      trialStart: now,
      accessUntil: addDays(now, settings.trialDays),
      createdAt: new Date().toISOString(),
    };
    saveUsers([user, ...users]);
    setCurrentUser(user);
    setStatusMessage(status, `注册成功，阅读权限有效期至 ${formatDate(user.accessUntil)}。`);
    window.setTimeout(() => {
      location.href = params.get("return") || "./daily.html";
    }, 400);
  });
}

function renderInviteRequestPage() {
  const requestForm = $("#inviteRequestForm");
  const requestStatus = $("#inviteRequestStatus");
  if (requestForm) requestForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = requestForm.requestEmail.value.trim().toLowerCase();
    const company = requestForm.requestCompany.value.trim();
    const roleTitle = requestForm.requestRoleTitle.value.trim();
    const reason = requestForm.requestReason.value.trim();
    if (!email || !company || !roleTitle || !reason) {
      setStatusMessage(requestStatus, "请补充邮箱、公司、身份和申请理由。");
      return;
    }
    const requests = getInviteRequests();
    const existingIndex = requests.findIndex((request) => String(request.email || "").trim().toLowerCase() === email && request.status !== "sent");
    const nextRequest = {
      id: existingIndex >= 0 ? requests[existingIndex].id : `invite-request-${Date.now()}`,
      email,
      company,
      roleTitle,
      reason,
      status: "pending",
      createdAt: existingIndex >= 0 ? requests[existingIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (existingIndex >= 0) {
      requests[existingIndex] = nextRequest;
      saveInviteRequests(requests);
    } else {
      saveInviteRequests([nextRequest, ...requests]);
    }
    requestForm.reset();
    setStatusMessage(requestStatus, "已提交。审核后，邀请码会通过邮箱发放。");
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
    location.href = params.get("return") || (isPermissionActive(user) ? "./daily.html" : "./account.html");
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
      <aside class="account-side">
        <p class="eyebrow">Reading Layers</p>
        <h2>登录后继续阅读</h2>
        <ul>
          <li>每日商业变化主线。</li>
          <li>信号、趋势与机会之间的关系。</li>
          <li>账号有效期和阅读权限。</li>
        </ul>
      </aside>
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
      <aside class="checkout-side">
        <p class="eyebrow">Selected Plan</p>
        <h2>${escapeHtml(plan.name)}</h2>
        <ul>${plan.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </aside>
    `;
    return;
  }
  box.innerHTML = `
    <article class="checkout-card">
      <p class="eyebrow">Payment</p>
      <h2>${escapeHtml(plan.name)}</h2>
      <strong>￥${escapeHtml(plan.price)}</strong>
      <p>${escapeHtml(plan.note)}。确认后将更新当前账号的阅读有效期。</p>
      <button id="completePaymentBtn" class="primary-btn">确认开通</button>
      <div id="checkoutStatus" class="sync-status"></div>
    </article>
    <aside class="checkout-side">
      <p class="eyebrow">Included</p>
      <h2>订阅包含</h2>
      <ul>${plan.includes.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </aside>
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
    <aside class="auth-side">
      <p class="eyebrow">Reading Access</p>
      <h2>新的阅读路径</h2>
      <ul>
        <li>注册账号后进入每日内参。</li>
        <li>订阅后阅读完整 Signals、Trends 与 Opportunities。</li>
        <li>账号页可查看当前阅读有效期。</li>
      </ul>
    </aside>
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
  renderAdminWorkbench();
  bindSyncButton();
  bindAdminContentManager();
  renderAdminMembership();
  renderAdminInvites();
  renderAdminOrders();
  bindAdminViews();
}

function adminCurrentView() {
  const allowed = new Set(["dashboard", "content", "content-edit", "members", "invites", "orders", "quality", "settings"]);
  const view = String(location.hash || "#dashboard").replace("#", "") || "dashboard";
  return allowed.has(view) ? view : "dashboard";
}

const adminViewMeta = {
  dashboard: { eyebrow: "Operations Dashboard", title: "项目运营仪表盘", summary: "查看网站访问、会员、收入、邀请转化、栏目热度和发布风险。" },
  content: { eyebrow: "Content Manager", title: "内容管理", summary: "按栏目和主题快速定位内容，再处理具体条目。" },
  "content-edit": { eyebrow: "Content Editor", title: "稿件编辑", summary: "用表单和预览处理单条内容，JSON 仅作为高级模式保留。" },
  members: { eyebrow: "Members", title: "用户与权限", summary: "查看阅读有效期、到期状态和权限调整。" },
  invites: { eyebrow: "Invite Codes", title: "邀请码", summary: "生成和管理邀请注册使用的邀请码。" },
  orders: { eyebrow: "Orders", title: "订阅与订单", summary: "管理套餐订单、支付状态和手动确认。" },
  quality: { eyebrow: "Quality", title: "质量检查", summary: "集中查看发布前风险、检查入口和待复核项。" },
  settings: { eyebrow: "Settings", title: "系统设置", summary: "管理本地服务、缓存、备份与自动化边界。" },
};

function bindAdminViews() {
  if (document.body.dataset.adminViewsBound !== "true") {
    document.body.dataset.adminViewsBound = "true";
    window.addEventListener("hashchange", renderAdminView);
    document.addEventListener("click", (event) => {
      const link = event.target.closest("[data-admin-target]");
      if (!link) return;
      const target = link.dataset.adminTarget;
      if (!target) return;
      event.preventDefault();
      if (location.hash === `#${target}`) renderAdminView();
      else location.hash = target;
    });
  }
  renderAdminView();
}

function renderAdminView() {
  const active = adminCurrentView();
  const meta = adminViewMeta[active] || adminViewMeta.dashboard;
  const eyebrow = $("#adminModuleEyebrow");
  const title = $("#adminModuleTitle");
  const summary = $("#adminModuleSummary");
  if (eyebrow) eyebrow.textContent = meta.eyebrow;
  if (title) title.textContent = meta.title;
  if (summary) summary.textContent = meta.summary;
  document.querySelectorAll("[data-admin-view]").forEach((section) => {
    section.hidden = section.dataset.adminView !== active;
  });
  document.querySelectorAll("[data-admin-target]").forEach((link) => {
    link.classList.toggle("active", link.dataset.adminTarget === (active === "content-edit" ? "content" : active));
  });
  if (active === "content-edit") renderAdminContentEditor();
  window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0 }));
}

function adminServiceLabel() {
  if (canWriteSiteData()) return "本地管理服务可写入";
  if (location.protocol === "file:") return "文件模式，仅保存到浏览器";
  return "浏览器模式，仅保存到浏览器";
}

function adminStatusTone(value) {
  if (value === "ok") return "ok";
  if (value === "warn") return "warn";
  return "muted";
}

function renderAdminWorkbench() {
  const service = $("#adminServiceStatus");
  if (service) {
    service.textContent = adminServiceLabel();
    service.dataset.tone = canWriteSiteData() ? "ok" : "warn";
  }
  const users = getUsers();
  const orders = getOrders();
  const invites = getInvites();
  const inviteRequests = getInviteRequests();
  const analytics = getAnalytics();
  const todayStats = analytics.days[todayDate()] || { pv: 0, visitors: [] };
  const activeUsers = users.filter((user) => isPermissionActive(user)).length;
  const expiredUsers = users.filter((user) => !isPermissionActive(user)).length;
  const activeInvites = invites.filter((invite) => inviteStatus(invite) === "active").length;
  const usedInvites = invites.filter((invite) => Number(invite.usedCount || 0) > 0).length;
  const pendingInviteRequests = inviteRequests.filter((request) => (request.status || "pending") === "pending").length;
  const paidOrders = orders.filter((order) => ["paid", "manual_confirmed"].includes(order.status || "paid"));
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  const contentCount = (state.signals?.length || 0) + (state.scoring?.rows?.length || 0) + (state.trends?.length || 0) + (state.opportunities?.length || 0) + (state.points?.length || 0);
  const statusGrid = $("#adminStatusGrid");
  if (statusGrid) {
    const cards = [
      { label: "累计 PV / UV", value: `${analytics.totalPv} / ${analytics.visitors.length}`, note: "本地记录的公开网站访问量和独立访客", tone: analytics.totalPv ? "ok" : "warn" },
      { label: "今日 PV / UV", value: `${todayStats.pv || 0} / ${(todayStats.visitors || []).length}`, note: "今天的访问热度，后台访问不计入", tone: todayStats.pv ? "ok" : "warn" },
      { label: "会员 / 邀请", value: `${activeUsers} / ${activeInvites}`, note: `有效会员与可用邀请码；待审批 ${pendingInviteRequests}，已使用 ${usedInvites}`, tone: expiredUsers || !activeInvites || pendingInviteRequests ? "warn" : "ok" },
      { label: "收入 / 订单", value: `￥${revenue}`, note: `${paidOrders.length} 个已支付或手动确认订单`, tone: revenue ? "ok" : "warn" },
    ];
    statusGrid.innerHTML = cards
      .map(
        (card) => `
          <article class="admin-status-card" data-tone="${adminStatusTone(card.tone)}">
            <span>${escapeHtml(card.label)}</span>
            <strong>${escapeHtml(card.value)}</strong>
            <small>${escapeHtml(card.note)}</small>
          </article>`
      )
      .join("");
  }
  const publishStatus = $("#adminPublishStatus");
  const publishSummary = $("#adminPublishSummary");
  const trafficSignal = analytics.totalPv ? `累计 ${analytics.totalPv} PV / ${analytics.visitors.length} UV` : "暂无访问记录";
  if (publishStatus) publishStatus.textContent = `${trafficSignal}，${activeUsers} 个有效会员`;
  if (publishSummary) publishSummary.textContent = `今日 ${todayStats.pv || 0} PV / ${(todayStats.visitors || []).length} UV；收入 ￥${revenue}；可用邀请码 ${activeInvites}，待审批 ${pendingInviteRequests}；到期用户 ${expiredUsers}。`;
  renderAdminFunnel();
  renderAdminMetrics();
}

function adminMetricCards() {
  const analytics = getAnalytics();
  const columns = Object.entries(analytics.columns || {})
    .map(([key, item]) => ({ key, ...item, uv: (item.visitors || []).length }))
    .sort((a, b) => b.pv - a.pv)
    .slice(0, 6);
  if (!columns.length) {
    return [
      { label: "栏目热度", value: "暂无", note: "访问公开页面后会开始记录 PV / UV" },
    ];
  }
  return columns.map((column, index) => ({
    label: `${index + 1}. ${column.label}`,
    value: `${column.pv} PV`,
    note: `${column.uv} UV · 最近 ${formatDate(column.updatedAt)}`,
  }));
}

function renderAdminMetrics() {
  const grid = $("#adminMetricGrid");
  if (!grid) return;
  grid.innerHTML = adminMetricCards()
    .map(
      (card) => `
        <article class="admin-metric-card">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.value)}</strong>
          <small>${escapeHtml(card.note)}</small>
        </article>`
    )
    .join("");
}

function renderAdminFunnel() {
  const grid = $("#adminFunnelGrid");
  if (!grid) return;
  const analytics = getAnalytics();
  const users = getUsers();
  const invites = getInvites();
  const orders = getOrders();
  const activeUsers = users.filter((user) => isPermissionActive(user)).length;
  const usedInvites = invites.filter((invite) => Number(invite.usedCount || 0) > 0).length;
  const paidOrders = orders.filter((order) => ["paid", "manual_confirmed"].includes(order.status || "paid"));
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.price || 0), 0);
  const cards = [
    { title: "访问", value: `${analytics.totalPv} PV`, note: `${analytics.visitors.length} UV，衡量网站触达规模`, href: "#content" },
    { title: "注册", value: `${users.length} 用户`, note: `${usedInvites}/${invites.length} 个邀请码已使用`, href: "#invites" },
    { title: "付费", value: `￥${revenue}`, note: `${paidOrders.length}/${orders.length} 个订单已确认`, href: "#orders" },
    { title: "权限", value: `${activeUsers} 有效`, note: `${users.length - activeUsers} 个用户待续期或未开通`, href: "#members" },
  ];
  grid.innerHTML = cards
    .map(
      (card) => `
        <a href="${escapeHtml(card.href)}" data-admin-target="${escapeHtml(card.href.replace("#", ""))}" class="admin-ops-card">
          <span>${escapeHtml(card.title)}</span>
          <strong>${escapeHtml(card.value)}</strong>
          <small>${escapeHtml(card.note)}</small>
        </a>`
    )
    .join("");
}

function renderAdminTodos() {
  const list = $("#adminTodoList");
  if (!list) return;
  const users = getUsers();
  const analytics = getAnalytics();
  const expiredUsers = users.filter((user) => !isPermissionActive(user)).length;
  const activeInvites = getInvites().filter((invite) => inviteStatus(invite) === "active").length;
  const pendingInviteRequests = getInviteRequests().filter((request) => (request.status || "pending") === "pending").length;
  const todayStats = analytics.days[todayDate()] || { pv: 0, visitors: [] };
  const todos = [
    { title: todayStats.pv ? `今日 ${todayStats.pv} PV` : "暂无今日访问", note: todayStats.pv ? "观察今日访问来自哪些栏目。" : "先通过前台预览检查访问记录。", tone: todayStats.pv ? "ok" : "warn" },
    { title: pendingInviteRequests ? `审批 ${pendingInviteRequests} 条邀请申请` : activeInvites ? `${activeInvites} 个邀请码可用` : "补充可用邀请码", note: pendingInviteRequests ? "进入邀请码模块通过或拒绝申请。" : activeInvites ? "新用户可通过邀请码注册。" : "进入邀请码模块生成邀请批次。", tone: pendingInviteRequests || !activeInvites ? "warn" : "ok" },
    { title: expiredUsers ? `复核 ${expiredUsers} 个到期用户` : "用户权限无到期积压", note: expiredUsers ? "进入用户与权限处理延期或到期状态。" : "当前没有到期用户积压。", tone: expiredUsers ? "warn" : "ok" },
    { title: canWriteSiteData() ? "发布服务可写入" : "启动本地管理服务", note: canWriteSiteData() ? "同步和保存可写入网站数据。" : "当前仅保存到浏览器，不建议发布。", tone: canWriteSiteData() ? "ok" : "warn" },
  ];
  list.innerHTML = todos
    .map(
      (todo) => `
        <article data-tone="${escapeHtml(todo.tone)}">
          <strong>${escapeHtml(todo.title)}</strong>
          <span>${escapeHtml(todo.note)}</span>
        </article>`
    )
    .join("");
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
  const filter = $("#memberFilter");
  if (filter && !filter.dataset.bound) {
    filter.dataset.bound = "true";
    filter.addEventListener("change", renderAdminMembership);
  }
  const selectedFilter = filter?.value || "all";
  const filteredUsers = users.filter((user) => {
    if (selectedFilter === "active") return isPermissionActive(user) && user.role !== "admin";
    if (selectedFilter === "admin") return user.role === "admin";
    if (selectedFilter === "expired") return !isPermissionActive(user);
    if (selectedFilter === "expiring") {
      if (!isPermissionActive(user) || user.role === "admin") return false;
      const daysLeft = Math.ceil((new Date(user.accessUntil) - new Date(todayDate())) / 86400000);
      return daysLeft <= 7;
    }
    return true;
  });
  list.innerHTML = filteredUsers.length
    ? filteredUsers
        .map(
          (user) => `
            <article class="member-card" data-status="${isPermissionActive(user) ? "active" : "expired"}">
              <div>
                <h3>${escapeHtml(user.name || "未命名用户")}</h3>
                <p>${escapeHtml(user.contact || "-")} · ${escapeHtml(user.company || "-")} · ${escapeHtml(user.roleTitle || "-")}</p>
                <span class="badge">${escapeHtml(userAccessLabel(user))}</span>
                <small>注册：${escapeHtml(formatDate(user.createdAt))} · 更新：${escapeHtml(formatDate(user.updatedAt || user.createdAt))}</small>
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
      if (!window.confirm("这会缩短该用户的阅读权限，并立即设为到期。确认继续？")) return;
      updateUser(userId, { accessUntil: addDays(todayDate(), -1), status: "expired" });
    } else if (extend) {
      const user = getUsers().find((item) => item.id === userId);
      const baseDate = user.accessUntil && user.accessUntil >= todayDate() ? user.accessUntil : todayDate();
      const nextDate = extend === "week" ? addDays(baseDate, 7) : addMonths(baseDate, extend === "quarter" ? 3 : 1);
      updateUser(userId, { accessUntil: nextDate, status: "member" });
    }
    renderAdminMembership();
    renderAdminWorkbench();
  };
}

function renderAdminInvites() {
  const form = $("#adminInviteForm");
  const list = $("#inviteList");
  const status = $("#inviteStatus");
  const filter = $("#inviteFilter");
  if (!list) return;
  if (form && !form.dataset.bound) {
    form.dataset.bound = "true";
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const count = Math.min(50, Math.max(1, Number($("#inviteCountInput")?.value || 1)));
      const days = Math.max(1, Number($("#inviteDaysInput")?.value || 30));
      const maxUses = Math.max(1, Number($("#inviteMaxUsesInput")?.value || 1));
      const note = $("#inviteNoteInput")?.value?.trim() || "";
      const next = [];
      while (next.length < count) {
        const invite = createInvite({ maxUses, days, note });
        if (next.some((item) => normalizeInviteCode(item.code) === normalizeInviteCode(invite.code))) continue;
        next.push(invite);
      }
      saveInvites([...next, ...getInvites()]);
      setStatusMessage(status, `已生成 ${next.length} 个邀请码。`);
      renderAdminInvites();
      renderAdminInviteRequests();
    });
  }
  if (filter && !filter.dataset.bound) {
    filter.dataset.bound = "true";
    filter.addEventListener("change", renderAdminInvites);
  }
  const selected = filter?.value || "all";
  const invites = getInvites();
  const filtered = invites.filter((invite) => selected === "all" || inviteStatus(invite) === selected);
  list.innerHTML = filtered.length
    ? filtered
        .map((invite) => {
          const statusText = inviteStatus(invite);
          const usedBy = (invite.usedBy || []).map((usage) => usage.contact).filter(Boolean).join("，") || "-";
          return `
            <article class="admin-invite-card" data-status="${escapeHtml(statusText)}">
              <div>
                <strong>${escapeHtml(invite.code)}</strong>
                <p>${escapeHtml(invite.note || "未填写备注")}</p>
                <small>有效期：${escapeHtml(formatDate(invite.expiresAt))} · 使用：${Number(invite.usedCount || 0)} / ${Number(invite.maxUses || 1)} · 使用者：${escapeHtml(usedBy)}</small>
              </div>
              <span>${escapeHtml(statusText === "active" ? "可用" : statusText === "used" ? "已用完" : statusText === "paused" ? "已暂停" : "已过期")}</span>
              <div class="admin-invite-actions">
                <button class="ghost-btn" data-copy-invite="${escapeHtml(invite.code)}">复制</button>
                <button class="ghost-btn" data-toggle-invite="${escapeHtml(invite.id)}">${statusText === "paused" ? "启用" : "暂停"}</button>
                <button class="danger-btn" data-delete-invite="${escapeHtml(invite.id)}">删除</button>
              </div>
            </article>`;
        })
        .join("")
    : `<div class="empty-state">暂无邀请码。</div>`;
  list.onclick = async (event) => {
    const copyCode = event.target.dataset.copyInvite;
    const toggleId = event.target.dataset.toggleInvite;
    const deleteId = event.target.dataset.deleteInvite;
    if (copyCode) {
      try {
        await navigator.clipboard.writeText(copyCode);
        setStatusMessage(status, `已复制邀请码：${copyCode}`);
      } catch {
        setStatusMessage(status, `请手动复制邀请码：${copyCode}`);
      }
      return;
    }
    if (toggleId) {
      const next = getInvites().map((invite) => (invite.id === toggleId ? { ...invite, status: invite.status === "paused" ? "active" : "paused", updatedAt: new Date().toISOString() } : invite));
      saveInvites(next);
      renderAdminInvites();
      return;
    }
    if (deleteId) {
      if (!window.confirm("删除这个邀请码后无法恢复。确认继续？")) return;
      saveInvites(getInvites().filter((invite) => invite.id !== deleteId));
      renderAdminInvites();
    }
  };
  renderAdminInviteRequests();
}

function renderAdminInviteRequests() {
  const list = $("#inviteRequestList");
  const status = $("#inviteStatus");
  if (!list) return;
  const statusLabel = {
    pending: "待审批",
    approved: "已通过",
    rejected: "已拒绝",
    sent: "已发放",
  };
  const requests = getInviteRequests().sort((a, b) => {
    const order = { pending: 0, approved: 1, rejected: 2, sent: 3 };
    return (order[a.status || "pending"] ?? 9) - (order[b.status || "pending"] ?? 9) || String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
  });
  list.innerHTML = requests.length
    ? requests
        .map(
          (request) => {
            const currentStatus = request.status || "pending";
            const code = request.approvedInviteCode || "";
            const approvedActions =
              currentStatus === "approved" || currentStatus === "sent"
                ? `<button class="ghost-btn" data-copy-invite="${escapeHtml(code)}">复制码</button>
                   ${currentStatus === "approved" ? `<button class="ghost-btn" data-mark-request-sent="${escapeHtml(request.id)}">标记发放</button>` : ""}`
                : "";
            const pendingActions =
              currentStatus === "pending"
                ? `<button class="primary-btn" data-approve-request="${escapeHtml(request.id)}">通过生成码</button>
                   <button class="danger-btn" data-reject-request="${escapeHtml(request.id)}">拒绝</button>`
                : "";
            return `
              <article class="admin-invite-card admin-request-card" data-status="${escapeHtml(currentStatus)}">
                <div>
                  <strong>${escapeHtml(request.email || "-")}</strong>
                  <p>${escapeHtml(request.company || "-")} · ${escapeHtml(request.roleTitle || "-")}</p>
                  <small>${escapeHtml(request.reason || "-")} · 提交：${escapeHtml(formatDate(request.createdAt))}${code ? ` · 邀请码：${escapeHtml(code)}` : ""}</small>
                </div>
                <span>${escapeHtml(statusLabel[currentStatus] || "待处理")}</span>
                <div class="admin-invite-actions">
                  <button class="ghost-btn" data-copy-request-email="${escapeHtml(request.email || "")}">复制邮箱</button>
                  ${pendingActions}
                  ${approvedActions}
                  <button class="danger-btn" data-delete-request="${escapeHtml(request.id)}">删除</button>
                </div>
              </article>
            `;
          }
        )
        .join("")
    : `<div class="empty-state">暂无邀请码申请。</div>`;
  list.onclick = async (event) => {
    const email = event.target.dataset.copyRequestEmail;
    const approveId = event.target.dataset.approveRequest;
    const rejectId = event.target.dataset.rejectRequest;
    const sentId = event.target.dataset.markRequestSent;
    const deleteId = event.target.dataset.deleteRequest;
    const copyCode = event.target.dataset.copyInvite;
    if (email) {
      try {
        await navigator.clipboard.writeText(email);
        setStatusMessage(status, `已复制邮箱：${email}`);
      } catch {
        setStatusMessage(status, `请手动复制邮箱：${email}`);
      }
      return;
    }
    if (copyCode) {
      try {
        await navigator.clipboard.writeText(copyCode);
        setStatusMessage(status, `已复制邀请码：${copyCode}`);
      } catch {
        setStatusMessage(status, `请手动复制邀请码：${copyCode}`);
      }
      return;
    }
    if (approveId) {
      const requests = getInviteRequests();
      const request = requests.find((item) => item.id === approveId);
      if (!request) return;
      let code = request.approvedInviteCode;
      if (!code) {
        const invite = createInvite({
          maxUses: 1,
          days: 30,
          note: `审批通过：${request.company || request.email || "邀请码申请"}`,
          requestId: request.id,
          email: request.email,
        });
        code = invite.code;
        saveInvites([invite, ...getInvites()]);
      }
      saveInviteRequests(
        requests.map((item) =>
          item.id === approveId
            ? { ...item, status: "approved", approvedInviteCode: code, approvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            : item
        )
      );
      setStatusMessage(status, `已通过申请并生成邀请码：${code}`);
      renderAdminInvites();
      return;
    }
    if (rejectId) {
      if (!window.confirm("确认拒绝这条邀请码申请？")) return;
      saveInviteRequests(getInviteRequests().map((request) => (request.id === rejectId ? { ...request, status: "rejected", rejectedAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : request)));
      renderAdminInviteRequests();
      return;
    }
    if (sentId) {
      saveInviteRequests(getInviteRequests().map((request) => (request.id === sentId ? { ...request, status: "sent", sentAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : request)));
      renderAdminInviteRequests();
      return;
    }
    if (deleteId) {
      saveInviteRequests(getInviteRequests().filter((request) => request.id !== deleteId));
      renderAdminInviteRequests();
    }
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
          const status = order.status || "paid";
          return `
            <article class="order-card" data-status="${escapeHtml(status)}">
              <div>
                <h3>${escapeHtml(plan.name || order.plan || "未命名套餐")}</h3>
                <p>${escapeHtml(user.name || "-")} · ${escapeHtml(user.contact || "-")}</p>
                <small>${escapeHtml(order.id || "-")} · ${escapeHtml(formatDate(order.createdAt))}</small>
              </div>
              <strong>￥${escapeHtml(order.price || "-")}</strong>
              <span>${escapeHtml(status === "manual_confirmed" ? "手动确认" : status === "paid" ? "已支付" : status)}</span>
              <button class="ghost-btn" data-confirm-order="${escapeHtml(order.id || "")}">手动确认支付</button>
            </article>`;
        })
        .join("")
    : `<div class="empty-state">暂无订阅记录。</div>`;
  list.onclick = (event) => {
    const orderId = event.target.dataset.confirmOrder;
    if (!orderId) return;
    if (!window.confirm("确认该订单已完成支付，并同步更新用户阅读权限？")) return;
    const nextOrders = getOrders().map((order) => (order.id === orderId ? { ...order, status: "manual_confirmed", paidAt: new Date().toISOString(), updatedAt: new Date().toISOString() } : order));
    const order = nextOrders.find((item) => item.id === orderId);
    if (order?.userId) updateUser(order.userId, { status: "member", plan: order.plan, accessUntil: order.accessUntil });
    saveOrders(nextOrders);
    renderAdminOrders();
    renderAdminMembership();
    renderAdminWorkbench();
  };
}

const adminContentGroups = {
  column: [
    { value: "signals", label: "Signals" },
    { value: "scoring", label: "Priority Engine" },
    { value: "points", label: "The Point" },
    { value: "trends", label: "Trends" },
    { value: "opportunities", label: "Opportunities" },
  ],
  topic: [
    { value: "trends", label: "趋势主题" },
    { value: "pointTopics", label: "The Point 主题" },
  ],
};

function adminPageModules() {
  return [
    { id: "page-home", title: "首页", status: "published", route: "./index.html", editRoute: "./index.html", summary: "品牌首屏、项目入口和代表性判断。首页不承载具体内容编辑，适合从这里检查项目第一印象。", tags: ["首页", "统计入口"] },
    { id: "page-daily", title: "Daily Brief", status: "protected", route: "./daily.html", editRoute: "./daily.html", summary: "每日判断内参列表和详情页。内容来自 Signals、Trends、Opportunities 和 The Point 的同步数据。", tags: ["栏目", "每日简报"] },
    { id: "page-signals", title: "Signals", status: "protected", route: "./signals.html", editRoute: "./signals.html?admin=1", summary: "商业信号筛选与详情入口，可进入显式 Admin 模式调整 Signal 卡片。", tags: ["栏目", "可视化编辑"] },
    { id: "page-point", title: "The Point", status: "protected", route: "./the-point.html", editRoute: "./the-point.html", summary: "一线观点判断入口。内容来自 The Point 数据层，主题和观点可在栏目 / 主题分类中管理。", tags: ["栏目", "观点"] },
    { id: "page-opportunities", title: "Opportunities", status: "protected", route: "./opportunities.html", editRoute: "./opportunities.html?admin=1", summary: "机会库和 Priority Engine 承接页，可进入显式 Admin 模式调整机会卡。", tags: ["栏目", "可视化编辑"] },
    { id: "page-trends", title: "Trends", status: "protected", route: "./trends.html", editRoute: "./trends.html?admin=1", summary: "趋势判断模型入口，可进入显式 Admin 模式调整趋势卡片。", tags: ["栏目", "可视化编辑"] },
  ];
}

function getAdminCollection(type) {
  if (type.startsWith("page-")) return adminPageModules().filter((item) => item.id === type);
  if (type === "signals") return state.signals;
  if (type === "scoring") return state.scoring.rows || [];
  if (type === "points") return state.points || [];
  if (type === "pointTopics") return state.pointTopics || [];
  if (type === "trends") return state.trends || [];
  if (type === "opportunities") return state.opportunities || [];
  return [];
}

function setAdminCollection(type, items) {
  if (type.startsWith("page-")) return;
  if (type === "signals") state.signals = items;
  if (type === "scoring") state.scoring = { ...state.scoring, rows: items };
  if (type === "points") state.points = items;
  if (type === "pointTopics") state.pointTopics = items;
  if (type === "trends") state.trends = items;
  if (type === "opportunities") state.opportunities = items;
}

function adminItemLabel(item = {}, index = 0) {
  return item.product || item.title || item.topic || item.name || item.person || item.track || item.id || `条目 ${index + 1}`;
}

function adminItemMeta(type, item = {}) {
  const meta = [];
  if (type.startsWith("page-")) {
    meta.push("页面");
    meta.push(item.route || "page");
  } else if (type === "signals") {
    meta.push(item.date || item.eventType || "Signal");
    meta.push(item.sourceTier || item.sourceName || item.source || "信源待补");
  } else if (type === "scoring") {
    meta.push("Priority Engine");
    meta.push(item.track || item.market || "赛道待补");
  } else if (type === "points") {
    meta.push(item.date || "The Point");
    meta.push(item.person || item.sourceType || item.sourceTitle || "来源待补");
  } else if (type === "pointTopics") {
    meta.push("The Point 主题");
    meta.push(item.count ? `${item.count} 条观点` : "主题集合");
  } else if (type === "trends") {
    meta.push(item.statusLabel || item.status || "趋势状态");
    meta.push(item.track || item.name || "Trend");
  } else {
    meta.push(item.priorityRank ? `Rank ${item.priorityRank}` : "Opportunity");
    meta.push(item.status || item.evidenceLevel || "状态待补");
  }
  return meta.filter(Boolean).join(" · ");
}

function adminItemSummary(type, item = {}) {
  return item.summary || item.description || item.commercialMeaning || item.original || item.interpretation || item.signal || item.reason || item.thesis || item.opportunity || item.definition || adminItemMeta(type, item);
}

function adminContentScopeLabel(scope) {
  return { page: "页面", column: "栏目", topic: "主题" }[scope] || "内容";
}

function adminContentTypeLabel(type) {
  return Object.values(adminContentGroups)
    .flat()
    .find((option) => option.value === type)?.label || type;
}

function adminItemStatusText(item = {}) {
  return String(item.status || item.statusLabel || "active");
}

function adminItemDateText(item = {}) {
  return String(item.date || item.publishedAt || item.createdAt || item.updatedAt || "-").slice(0, 10);
}

function adminContentEditUrl(scope, type, index) {
  const params = new URLSearchParams();
  params.set("scope", scope || "column");
  params.set("type", type || "signals");
  params.set("index", String(Math.max(0, Number(index) || 0)));
  params.set("v", "admin-editor-wysiwyg-20260504");
  return `./admin.html?${params.toString()}#content-edit`;
}

function adminContentEditParams() {
  const params = new URLSearchParams(location.search);
  return {
    scope: params.get("scope") || "column",
    type: params.get("type") || "signals",
    index: Math.max(0, Number(params.get("index") || 0)),
  };
}

function adminEditableFields(type, item = {}) {
  const base = [
    { key: "title", label: "标题", placeholder: "用于列表和详情页展示的标题" },
    { key: "product", label: "标题 / 产品名", placeholder: "Signal 或机会卡主标题" },
    { key: "name", label: "名称", placeholder: "趋势、主题或条目名称" },
    { key: "topic", label: "主题", placeholder: "主题名称" },
    { key: "date", label: "日期", type: "date" },
    { key: "status", label: "状态", type: "select", options: ["active", "published", "review", "needs_review", "draft", "archived", "protected"] },
    { key: "statusLabel", label: "状态文字" },
    { key: "track", label: "赛道 / 方向" },
    { key: "market", label: "市场" },
    { key: "sourceName", label: "来源名称" },
    { key: "source", label: "来源" },
    { key: "sourceTier", label: "来源层级" },
    { key: "person", label: "人物 / 机构" },
    { key: "sourceTitle", label: "来源标题" },
    { key: "summary", label: "摘要", type: "textarea", wide: true },
    { key: "description", label: "描述", type: "textarea", wide: true },
    { key: "commercialMeaning", label: "商业含义", type: "textarea", wide: true },
    { key: "definition", label: "机会定义", type: "textarea", wide: true },
    { key: "thesis", label: "判断 / Thesis", type: "textarea", wide: true },
    { key: "reason", label: "理由", type: "textarea", wide: true },
    { key: "original", label: "原文 / 引用", type: "textarea", wide: true },
    { key: "interpretation", label: "观澜解读", type: "textarea", wide: true },
    { key: "opportunity", label: "机会描述", type: "textarea", wide: true },
    { key: "evidenceLevel", label: "证据等级" },
    { key: "priorityRank", label: "优先级", type: "number" },
    { key: "total", label: "总分", type: "number" },
    { key: "count", label: "数量", type: "number" },
    { key: "tags", label: "标签", type: "tags", wide: true, placeholder: "用逗号分隔，例如：AI Agent, 企业服务" },
  ];
  const preferred = {
    signals: ["product", "date", "status", "eventType", "sourceName", "sourceTier", "summary", "commercialMeaning", "opportunity", "tags"],
    scoring: ["product", "track", "market", "status", "priorityRank", "total", "reason", "tags"],
    points: ["title", "date", "person", "sourceTitle", "status", "original", "interpretation", "tags"],
    trends: ["name", "track", "status", "statusLabel", "summary", "thesis", "tags"],
    opportunities: ["title", "definition", "status", "evidenceLevel", "priorityRank", "summary", "thesis", "tags"],
    pointTopics: ["topic", "name", "count", "summary", "tags"],
  }[type] || ["title", "name", "date", "status", "summary", "description", "tags"];
  const known = new Map(base.map((field) => [field.key, field]));
  const keys = [...new Set([...preferred, ...Object.keys(item).filter((key) => ["title", "product", "name", "topic", "date", "status", "summary", "description", "tags"].includes(key))])];
  return keys.map((key) => known.get(key) || { key, label: key }).filter((field) => field.key in item || preferred.includes(field.key));
}

function adminFormValue(item, field) {
  const value = item?.[field.key];
  if (field.type === "tags") return Array.isArray(value) ? value.join(", ") : String(value || "");
  return value == null ? "" : String(value);
}

function renderAdminField(field, item = {}) {
  const value = adminFormValue(item, field);
  const common = `data-admin-form-field="${escapeHtml(field.key)}"`;
  if (field.type === "select") {
    const options = field.options || [];
    return `<label class="field${field.wide ? " wide" : ""}"><span>${escapeHtml(field.label)}</span><select ${common}>${options.map((option) => `<option value="${escapeHtml(option)}" ${value === option ? "selected" : ""}>${escapeHtml(option)}</option>`).join("")}</select></label>`;
  }
  if (field.type === "textarea") {
    return `<label class="field wide"><span>${escapeHtml(field.label)}</span><textarea ${common} rows="5" placeholder="${escapeHtml(field.placeholder || "")}">${escapeHtml(value)}</textarea></label>`;
  }
  return `<label class="field${field.wide ? " wide" : ""}"><span>${escapeHtml(field.label)}</span><input ${common} type="${escapeHtml(field.type || "text")}" value="${escapeHtml(value)}" placeholder="${escapeHtml(field.placeholder || "")}" /></label>`;
}

function readAdminEditorForm(item, container) {
  const next = { ...item };
  container.querySelectorAll("[data-admin-form-field]").forEach((input) => {
    const key = input.dataset.adminFormField;
    const raw = input.value;
    if (Array.isArray(item[key])) next[key] = raw.split(/[,，]/).map((tag) => tag.trim()).filter(Boolean);
    else if (typeof item[key] === "number") next[key] = Number(raw || 0);
    else next[key] = raw;
  });
  return next;
}

function renderAdminContentPreview(type, item = {}, index = 0) {
  const preview = $("#adminContentPreview");
  if (!preview) return;
  if (!item || !Object.keys(item).length) {
    preview.innerHTML = `<div class="empty-state">暂无可编辑条目。</div>`;
    return;
  }
  const title = adminItemLabel(item, index);
  const meta = adminItemMeta(type, item);
  const summary = shortText(adminItemSummary(type, item), 520);
  const tags = Array.isArray(item.tags) ? item.tags.slice(0, 6) : [];
  const pageActions = type.startsWith("page-")
    ? `<div class="admin-preview-actions"><a class="primary-btn as-link" href="${escapeHtml(item.route || "./index.html")}">打开页面</a><a class="ghost-btn as-link" href="${escapeHtml(item.editRoute || item.route || "./index.html")}">打开编辑入口</a></div>`
    : "";
  preview.innerHTML = `
    <div class="admin-preview-head">
      <div>
        <p class="eyebrow">${escapeHtml(type === "scoring" ? "Priority Engine" : type)}</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(meta)}</p>
      </div>
      <span class="badge">${escapeHtml(item.status || item.statusLabel || "active")}</span>
    </div>
    <p>${escapeHtml(summary)}</p>
    ${pageActions}
    <dl class="admin-preview-facts">
      <div><dt>ID</dt><dd>${escapeHtml(item.id || item.slug || item.opportunityId || "-")}</dd></div>
      <div><dt>关联机会</dt><dd>${escapeHtml([...(item.relatedOpportunityNames || []), item.opportunityTitle].filter(Boolean).slice(0, 2).join(" / ") || "-")}</dd></div>
      <div><dt>标签</dt><dd>${tags.length ? tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("") : "-"}</dd></div>
    </dl>
  `;
}

function bindAdminContentManager() {
  const scopeSelect = $("#adminContentScope");
  const typeSelect = $("#adminContentType");
  const itemSelect = $("#adminContentItem");
  const jsonBox = $("#adminContentJson");
  const status = $("#adminContentStatus");
  const search = $("#adminContentSearch");
  const statusFilter = $("#adminContentStatusFilter");
  const dateFilter = $("#adminContentDateFilter");
  const count = $("#adminContentCount");
  const list = $("#adminContentList");
  const scopeTabs = $("#adminContentScopeTabs");
  const typeNav = $("#adminContentTypeList");
  const resetBtn = $("#adminContentResetBtn");
  if (!scopeSelect || !typeSelect || !itemSelect || typeSelect.dataset.bound) return;
  typeSelect.dataset.bound = "true";

  const renderScopeTabs = () => {
    scopeTabs?.querySelectorAll("[data-admin-scope]").forEach((button) => {
      button.classList.toggle("active", button.dataset.adminScope === scopeSelect.value);
    });
  };

  const renderTypeOptions = () => {
    const options = adminContentGroups[scopeSelect.value] || adminContentGroups.column;
    const previous = typeSelect.value;
    typeSelect.innerHTML = options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`).join("");
    if (options.some((option) => option.value === previous)) typeSelect.value = previous;
    if (typeNav) {
      typeNav.innerHTML = options
        .map((option) => {
          const total = getAdminCollection(option.value).length;
          return `<button type="button" data-admin-type="${escapeHtml(option.value)}"><span>${escapeHtml(option.label)}</span><small>${total}</small></button>`;
        })
        .join("");
    }
    renderScopeTabs();
  };

  const filteredItems = () => {
    const query = String(search?.value || "").trim().toLowerCase();
    const selectedStatus = statusFilter?.value || "all";
    const selectedDate = String(dateFilter?.value || "").trim();
    return getAdminCollection(typeSelect.value)
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        const statusText = String(item.status || item.statusLabel || "active").toLowerCase();
        const dateText = String(item.date || item.publishedAt || item.createdAt || "").slice(0, 10);
        const statusMatch =
          selectedStatus === "all" ||
          (selectedStatus === "active" && ["active", "published", ""].includes(statusText)) ||
          (selectedStatus === "review" && ["review", "needs_review"].includes(statusText)) ||
          statusText === selectedStatus;
        const dateMatch = !selectedDate || dateText.includes(selectedDate);
        if (!statusMatch || !dateMatch) return false;
        if (!query) return true;
        return [adminItemLabel(item), adminItemMeta(typeSelect.value, item), adminItemSummary(typeSelect.value, item), item.status, item.statusLabel, dateText, ...(item.tags || [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  };

  const renderItems = () => {
    const items = filteredItems();
    const previous = itemSelect.value;
    itemSelect.innerHTML = items.map(({ item, index }) => `<option value="${index}">${escapeHtml(adminItemLabel(item, index))}</option>`).join("");
    if (items.some(({ index }) => String(index) === previous)) itemSelect.value = previous;
    else if (items.length) itemSelect.value = String(items[0].index);
    const total = getAdminCollection(typeSelect.value).length;
    if (count) count.textContent = `${items.length} / ${total} 条`;
    typeNav?.querySelectorAll("[data-admin-type]").forEach((button) => {
      button.classList.toggle("active", button.dataset.adminType === typeSelect.value);
    });
    if (list) {
      list.innerHTML = items.length
        ? `
          <div class="admin-cms-table-head" role="row">
            <span>选</span><span>标题</span><span>频道</span><span>状态</span><span>日期</span><span>操作</span>
          </div>
          ${items
            .slice(0, 80)
            .map(({ item, index }) => {
              const isActive = String(index) === itemSelect.value;
              const statusText = adminItemStatusText(item);
              return `
                <div class="admin-cms-row${isActive ? " active" : ""}" data-admin-select="${index}" role="row" tabindex="0">
                  <input type="radio" name="adminContentCurrent" ${isActive ? "checked" : ""} aria-label="选择 ${escapeHtml(adminItemLabel(item, index))}" />
                  <div class="admin-cms-title-cell">
                    <strong>${escapeHtml(adminItemLabel(item, index))}</strong>
                    <span>${escapeHtml(shortText(adminItemSummary(typeSelect.value, item), 96))}</span>
                  </div>
                  <small>${escapeHtml(adminContentTypeLabel(typeSelect.value))}</small>
                  <span class="admin-cms-status" data-tone="${escapeHtml(statusText.toLowerCase())}">${escapeHtml(statusText)}</span>
                  <small>${escapeHtml(adminItemDateText(item))}</small>
                  <a class="admin-cms-edit-link" href="${escapeHtml(adminContentEditUrl(scopeSelect.value, typeSelect.value, index))}">编辑</a>
                </div>`;
            })
            .join("")}`
        : `<div class="admin-cms-table-head" role="row"><span>选</span><span>标题</span><span>频道</span><span>状态</span><span>日期</span><span>操作</span></div><div class="empty-state">没有匹配条目。</div>`;
    }
    renderJson();
  };

  const renderJson = () => {
    const items = getAdminCollection(typeSelect.value);
    if (!itemSelect.options.length) {
      jsonBox.value = "{}";
      renderAdminContentPreview(typeSelect.value, {}, 0);
      if (status) status.textContent = "没有匹配条目。";
      return;
    }
    const item = items[Number(itemSelect.value)] || items[0] || {};
    if (jsonBox) {
      jsonBox.value = JSON.stringify(item, null, 2);
      jsonBox.disabled = typeSelect.value.startsWith("page-");
    }
    renderAdminContentPreview(typeSelect.value, item, Number(itemSelect.value));
    if (status) status.textContent = Object.keys(item).length ? `${adminContentScopeLabel(scopeSelect.value)} / ${adminContentTypeLabel(typeSelect.value)} / ${adminItemLabel(item)}` : "暂无条目。";
  };

  scopeSelect.addEventListener("change", () => {
    renderTypeOptions();
    if (search) search.value = "";
    renderItems();
  });
  typeSelect.addEventListener("change", renderItems);
  itemSelect.addEventListener("change", renderJson);
  search?.addEventListener("input", renderItems);
  statusFilter?.addEventListener("change", renderItems);
  dateFilter?.addEventListener("input", renderItems);
  resetBtn?.addEventListener("click", () => {
    if (search) search.value = "";
    if (statusFilter) statusFilter.value = "all";
    if (dateFilter) dateFilter.value = "";
    renderItems();
  });
  scopeTabs?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-admin-scope]");
    if (!button) return;
    scopeSelect.value = button.dataset.adminScope;
    scopeSelect.dispatchEvent(new Event("change"));
  });
  typeNav?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-admin-type]");
    if (!button) return;
    typeSelect.value = button.dataset.adminType;
    renderItems();
  });
  list?.addEventListener("click", (event) => {
    const row = event.target.closest("[data-admin-select]");
    if (!row) return;
    if (event.target.closest("a")) return;
    itemSelect.value = row.dataset.adminSelect;
    location.href = adminContentEditUrl(scopeSelect.value, typeSelect.value, row.dataset.adminSelect);
  });
  list?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const row = event.target.closest("[data-admin-select]");
    if (!row) return;
    event.preventDefault();
    itemSelect.value = row.dataset.adminSelect;
    location.href = adminContentEditUrl(scopeSelect.value, typeSelect.value, row.dataset.adminSelect);
  });
  $("#adminSaveContentBtn")?.addEventListener("click", async () => {
    if (typeSelect.value.startsWith("page-")) {
      if (status) status.textContent = "页面类内容请进入对应页面或显式编辑入口处理。";
      return;
    }
    try {
      const parsed = JSON.parse(jsonBox?.value || "{}");
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
    if (typeSelect.value.startsWith("page-")) {
      if (status) status.textContent = "页面类内容不支持复制为数据条目。";
      return;
    }
    try {
      const source = getAdminCollection(typeSelect.value)[Number(itemSelect.value)] || {};
      const parsed = jsonBox?.value ? JSON.parse(jsonBox.value) : source;
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
    if (typeSelect.value.startsWith("page-")) {
      if (status) status.textContent = "页面类内容不支持从数据管理器删除。";
      return;
    }
    const items = [...getAdminCollection(typeSelect.value)];
    const index = Number(itemSelect.value);
    if (!items.length || index < 0) return;
    if (!window.confirm(`删除「${adminItemLabel(items[index], index)}」后将写入当前数据状态。确认继续？`)) return;
    items.splice(index, 1);
    setAdminCollection(typeSelect.value, items);
    renderItems();
    await persistState(status, "已删除并写入数据文件。");
  });
  renderTypeOptions();
  renderItems();
}

function renderAdminContentEditor() {
  const shell = $("#adminContentEditShell");
  if (!shell) return;
  const params = adminContentEditParams();
  const items = getAdminCollection(params.type);
  const item = items[params.index] || {};
  const typeLabel = adminContentTypeLabel(params.type);
  const scopeLabel = adminContentScopeLabel(params.scope);
  if (!Object.keys(item).length) {
    shell.innerHTML = `
      <div class="empty-state">
        没有找到这条内容。<a href="./admin.html?v=admin-editor-wysiwyg-20260504#content">返回内容列表</a>
      </div>`;
    return;
  }
  const isPage = params.type.startsWith("page-");
  const fields = adminEditableFields(params.type, item);
  const title = adminItemLabel(item, params.index);
  const meta = shortText(adminItemMeta(params.type, item), 180);
  shell.innerHTML = `
    <div class="admin-editor-headline">
      <div>
        <p class="eyebrow">${escapeHtml(scopeLabel)} / ${escapeHtml(typeLabel)}</p>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(meta)}</p>
      </div>
      <div class="admin-editor-headline-actions">
        ${isPage ? `<a class="primary-btn as-link" href="${escapeHtml(item.route || "./index.html")}">打开页面</a>` : ""}
        <a class="ghost-btn as-link" href="./admin.html?v=admin-editor-wysiwyg-20260504#content">返回列表</a>
      </div>
    </div>
    <div class="admin-visual-editor-grid">
      <form id="adminContentEditForm" class="admin-form-editor">
        ${fields.map((field) => renderAdminField(field, item)).join("")}
      </form>
      <aside class="admin-live-preview">
        <p class="eyebrow">Preview</p>
        <h4 id="adminEditPreviewTitle">${escapeHtml(title)}</h4>
        <p id="adminEditPreviewMeta">${escapeHtml(meta)}</p>
        <div id="adminEditPreviewBody">${escapeHtml(shortText(adminItemSummary(params.type, item), 700))}</div>
      </aside>
    </div>
    <details class="admin-json-details admin-editor-json">
      <summary>高级 JSON</summary>
      <label class="field"><span>JSON 内容</span><textarea id="adminContentEditJson" rows="16">${escapeHtml(JSON.stringify(item, null, 2))}</textarea></label>
    </details>
    <div class="admin-editor-actions">
      <button id="adminSaveVisualContentBtn" class="primary-btn" type="button" ${isPage ? "disabled" : ""}>保存表单修改</button>
      <button id="adminSyncJsonToFormBtn" class="ghost-btn" type="button" ${isPage ? "disabled" : ""}>用 JSON 覆盖表单</button>
      <button id="adminDuplicateEditContentBtn" class="ghost-btn" type="button" ${isPage ? "disabled" : ""}>复制为新条目</button>
      <button id="adminDeleteEditContentBtn" class="danger-btn" type="button" ${isPage ? "disabled" : ""}>删除条目</button>
    </div>
    <div id="adminContentEditStatus" class="sync-status">${isPage ? "页面类内容请从对应页面或显式编辑入口处理。" : "表单可直接编辑；JSON 仅用于高级修正。"}</div>
  `;

  const form = $("#adminContentEditForm");
  const jsonBox = $("#adminContentEditJson");
  const status = $("#adminContentEditStatus");
  const updatePreview = () => {
    const draft = readAdminEditorForm(item, form);
    const nextTitle = adminItemLabel(draft, params.index);
    const titleEl = $("#adminEditPreviewTitle");
    const metaEl = $("#adminEditPreviewMeta");
    const bodyEl = $("#adminEditPreviewBody");
    if (titleEl) titleEl.textContent = nextTitle;
    if (metaEl) metaEl.textContent = adminItemMeta(params.type, draft);
    if (bodyEl) bodyEl.textContent = shortText(adminItemSummary(params.type, draft), 700);
    if (jsonBox && document.activeElement !== jsonBox) jsonBox.value = JSON.stringify(draft, null, 2);
  };
  form?.addEventListener("input", updatePreview);
  $("#adminSyncJsonToFormBtn")?.addEventListener("click", () => {
    try {
      const parsed = JSON.parse(jsonBox.value);
      const items = [...getAdminCollection(params.type)];
      items[params.index] = parsed;
      setAdminCollection(params.type, items);
      renderAdminContentEditor();
    } catch (error) {
      if (status) status.textContent = `JSON 格式错误：${error.message}`;
    }
  });
  $("#adminSaveVisualContentBtn")?.addEventListener("click", async () => {
    try {
      const draft = jsonBox?.value ? JSON.parse(jsonBox.value) : readAdminEditorForm(item, form);
      const items = [...getAdminCollection(params.type)];
      items[params.index] = draft;
      setAdminCollection(params.type, items);
      await persistState(status, "已保存表单修改到网站数据文件。");
      renderAdminWorkbench();
    } catch (error) {
      if (status) status.textContent = `保存失败：${error.message}`;
    }
  });
  $("#adminDuplicateEditContentBtn")?.addEventListener("click", async () => {
    try {
      const draft = jsonBox?.value ? JSON.parse(jsonBox.value) : readAdminEditorForm(item, form);
      const copy = { ...draft, id: `${draft.id || params.type}-${Date.now()}`, slug: localSlug(`${draft.slug || draft.title || draft.product || draft.name || params.type}-${Date.now()}`) };
      const nextItems = [...getAdminCollection(params.type), copy];
      setAdminCollection(params.type, nextItems);
      await persistState(status, "已复制为新条目。");
      location.href = adminContentEditUrl(params.scope, params.type, nextItems.length - 1);
    } catch (error) {
      if (status) status.textContent = `复制失败：${error.message}`;
    }
  });
  $("#adminDeleteEditContentBtn")?.addEventListener("click", async () => {
    if (!window.confirm(`删除「${adminItemLabel(item, params.index)}」后将写入当前数据状态。确认继续？`)) return;
    const nextItems = [...getAdminCollection(params.type)];
    nextItems.splice(params.index, 1);
    setAdminCollection(params.type, nextItems);
    await persistState(status, "已删除条目。");
    location.href = "./admin.html?v=admin-editor-wysiwyg-20260504#content";
  });
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
