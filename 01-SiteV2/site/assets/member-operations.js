(function () {
  const root = document.querySelector("[data-member-operations]");
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const endpoints = {
    community: "https://members.zkdlj.vip/api/v1/operations/membership-summary",
    application: "/ops/application-membership-summary",
    adminUsers: "/ops/member-api/users",
    communityApprovals: "/ops/member-api/community-members",
    communityDirectory: "/ops/member-api/community-directory",
    communitySchedule: "/ops/member-api/community-schedule",
  };
  const definitions = {
    community: [
      ["joinedMembers", "正式入群"],
      ["newJoinedMembers", "新增入群"],
      ["awaitingJoin", "审核通过待入群"],
      ["participants", "分享参与成员"],
      ["speakers", "分享者"],
      ["participations", "参与人次"],
      ["issues", "分享期数"],
      ["expiring7d", "即将到期"],
      ["renewals", "社群续费"],
    ],
    application: [
      ["accounts", "应用账户"],
      ["activeEntitlements", "有效会员权益"],
      ["expiring7d", "7 天内到期"],
      ["newAccounts", "新增账户"],
      ["firstPaidAccounts", "首次付费"],
      ["repeatPaidAccounts", "再次购买"],
      ["engagedAccounts", "有行为记录账户"],
      ["trialAccounts", "试用中"],
      ["redemptions", "积分兑换次数"],
      ["redeemingAccounts", "兑换账户"],
      ["redeemedPoints", "已兑换积分"],
      ["offlineClaims", "线下权益核销"],
    ],
  };
  let days = 30, generation = 0, loaded = false, activeView = "membership";
  let adminCsrfToken = "", adminPage = 1, adminPages = 1, adminUsers = [], selectedUserId = null, adminLoaded = false;
  let approvalPage = 1, approvalPages = 1, approvalMembers = [], selectedApprovalId = null, approvalsLoaded = false;
  let communityPage = 1, communityPages = 1, communityMembers = [], selectedCommunityId = null, communityLoaded = false;
  let scheduleSessions = [], scheduleLoaded = false, selectedScheduleId = null;
  const controllers = new Map();
  const number = (value) => value == null ? "待接入" : new Intl.NumberFormat("zh-CN").format(value);
  const count = (value) => Number.isSafeInteger(value) && value >= 0;
  function valid(payload, source, selectedDays) {
    return payload?.schemaVersion === "MEMBER-OPS-V1.0" && payload.source === source && payload.dataSource === "production"
      && payload.window?.days === selectedDays && Number.isFinite(Date.parse(payload.generatedAt))
      && definitions[source].every(([key]) => Object.hasOwn(payload.metrics || {}, key) && (payload.metrics[key] === null || count(payload.metrics[key])))
      && ["zero", "low", "mid", "high"].every((key) => count(payload.pointBuckets?.[key]))
      && (source !== "community" || count(payload.metrics.unresolvedParticipants))
      && (source !== "application" || ["monthly", "half_year", "annual", "other"].every((key) => count(payload.tiers?.[key])));
  }
  function distribution(title, values) {
    return '<article class="mo-distribution"><h3>' + title + '</h3><dl>' + values.map(([label, value]) => '<div><dt>' + label + '</dt><dd>' + number(value) + '</dd></div>').join("") + '</dl></article>';
  }
  function render(source, payload) {
    const metrics = payload.metrics;
    let content = '<div class="mo-grid">' + definitions[source].map(([key, label]) => '<article class="mo-metric"><h3>' + label + '</h3><strong' + (metrics[key] == null ? ' class="mo-missing"' : '') + '>' + number(metrics[key]) + '</strong></article>').join("") + '</div>';
    const buckets = payload.pointBuckets;
    content += '<div class="mo-distributions">' + distribution(source === "community" ? "社群累计积分分布" : "应用可用积分分布", [
      [source === "community" ? "≤ 0 分" : "0 分", buckets.zero], [source === "community" ? "1–29 分" : "1–299 分", buckets.low],
      [source === "community" ? "30–99 分" : "300–999 分", buckets.mid], [source === "community" ? "≥ 100 分" : "≥ 1,000 分", buckets.high],
    ]);
    if (source === "application") content += distribution("有效权益账户 · 最近付费套餐", [["月度", payload.tiers.monthly], ["半年", payload.tiers.half_year], ["年度", payload.tiers.annual], ["兑换 / 其他", payload.tiers.other]]);
    content += '</div>';
    $('[data-mo-content="' + source + '"]').innerHTML = content;
    $('[data-mo-status="' + source + '"]').textContent = "已连接 · " + days + " 天窗口 · 更新于 " + new Date(payload.generatedAt).toLocaleString("zh-CN", { hour12: false });
  }
  async function read(source, current, selectedDays) {
    const status = $('[data-mo-status="' + source + '"]');
    const content = $('[data-mo-content="' + source + '"]');
    status.textContent = "正在读取近 " + selectedDays + " 天汇总…";
    content.innerHTML = '<div class="mo-empty">正在连接只读数据源…</div>';
    controllers.get(source)?.abort();
    const controller = new AbortController();
    controllers.set(source, controller);
    const timer = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(endpoints[source] + "?days=" + selectedDays, { method: "GET", credentials: source === "application" ? "same-origin" : "omit", cache: "no-store", signal: controller.signal });
      if (!response.ok) throw new Error("unavailable");
      const payload = await response.json();
      if (current !== generation) return;
      if (!valid(payload, source, selectedDays)) throw new Error("invalid aggregate");
      render(source, payload);
    } catch {
      if (current !== generation) return;
      status.textContent = "暂未取得可核验汇总 · 可点击刷新重试";
      content.innerHTML = '<div class="mo-empty">此数据源暂不可用，不代表人数为零。其他数据源仍可独立查看。</div>';
    } finally { clearTimeout(timer); }
  }
  function refresh() {
    loaded = true;
    generation += 1;
    for (const source of ["community", "application"]) void read(source, generation, days);
  }
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const date = (value) => value && Number.isFinite(Date.parse(value)) ? new Date(value).toLocaleString("zh-CN", { hour12: false }) : "—";
  const money = (cents) => "¥" + (Number(cents || 0) / 100).toLocaleString("zh-CN", { minimumFractionDigits: 2 });
  const statusLabels = { member: "正式会员", trial: "试用中", expired: "已到期" };
  function safeAdminUser(item) {
    if (!Number.isSafeInteger(item?.id) || item.id < 1 || typeof item.displayName !== "string" || typeof item.phoneMasked !== "string" || !Object.hasOwn(statusLabels, item.membership?.status)) return null;
    const integers = [item.points?.balance, item.points?.lifetime, item.points?.community, item.payment?.paidOrders, item.payment?.paidCents];
    if (!integers.every(Number.isSafeInteger)) return null;
    return {
      id: item.id, displayName: item.displayName.slice(0, 40), phoneMasked: item.phoneMasked.slice(0, 32),
      community: { name: String(item.community?.name || "").slice(0, 40), status: String(item.community?.status || "none").slice(0, 20) },
      membership: { status: item.membership.status, trialEndsAt: String(item.membership?.trialEndsAt || ""), memberEndsAt: String(item.membership?.memberEndsAt || ""), activeUntil: String(item.membership?.activeUntil || "") },
      points: { balance: item.points.balance, lifetime: item.points.lifetime, community: item.points.community },
      payment: { paidOrders: item.payment.paidOrders, paidCents: item.payment.paidCents, lastPaidAt: String(item.payment?.lastPaidAt || "") },
      activity: { lastBehaviorAt: String(item.activity?.lastBehaviorAt || "") }, createdAt: String(item.createdAt || ""), updatedAt: String(item.updatedAt || ""),
      recentAdjustments: Array.isArray(item.recentAdjustments) ? item.recentAdjustments.slice(0, 5).map((entry) => ({ action: entry?.action === "extend_membership" ? "延长权益" : "调整积分", reason: String(entry?.reason || "").slice(0, 120), createdAt: String(entry?.createdAt || "") })) : [],
    };
  }
  function adminHeaders(json = false, write = false) { return { ...(write ? { "X-CSRF-Token": adminCsrfToken } : {}), ...(json ? { "Content-Type": "application/json" } : {}) }; }
  function resetAdminSession() {
    adminCsrfToken = ""; adminUsers = []; selectedUserId = null; adminLoaded = false;
    approvalMembers = []; selectedApprovalId = null; approvalsLoaded = false;
    communityMembers = []; selectedCommunityId = null; communityLoaded = false;
    scheduleSessions = []; selectedScheduleId = null; scheduleLoaded = false;
    $("[data-mo-admin-detail]").innerHTML = "";
    $("[data-mo-admin-state]").textContent = "";
    $("[data-mo-admin-users]").innerHTML = "";
    $("[data-mo-approval-detail]").innerHTML = "";
    $("[data-mo-approval-state]").textContent = "";
    $("[data-mo-approval-members]").innerHTML = "";
    $("[data-mo-community-detail]").innerHTML = "";
    $("[data-mo-community-status]").textContent = "";
    $("[data-mo-community-members]").innerHTML = "";
    $("[data-mo-schedule-list]").innerHTML = "";
    $("[data-mo-schedule-editor]").innerHTML = "";
    $("[data-mo-schedule-state]").textContent = "";
  }
  function adminFailure(message, expired = false) {
    $("[data-mo-admin-state]").textContent = message;
    $("[data-mo-admin-users]").innerHTML = '<tr><td colspan="6"><div class="mo-empty">' + escape(message) + '</div></td></tr>';
    if (expired) {
      resetAdminSession();
      document.dispatchEvent(new CustomEvent("operations:session-expired", { detail: { message } }));
    }
  }
  function renderAdminUsers() {
    const body = $("[data-mo-admin-users]");
    body.innerHTML = adminUsers.length ? adminUsers.map((user) => '<tr><td><span class="mo-user-name">' + escape(user.displayName) + '</span><span class="mo-user-meta">#' + user.id + ' · ' + escape(user.phoneMasked) + '</span></td><td><span class="mo-badge">' + statusLabels[user.membership.status] + '</span><span class="mo-user-meta">至 ' + date(user.membership.activeUntil) + '</span></td><td>' + number(user.points.balance) + '<span class="mo-user-meta">累计 ' + number(user.points.lifetime) + '</span></td><td>' + user.payment.paidOrders + ' 单<span class="mo-user-meta">' + money(user.payment.paidCents) + '</span></td><td>' + date(user.activity.lastBehaviorAt) + '</td><td><button type="button" data-mo-user-id="' + user.id + '">管理</button></td></tr>').join("") : '<tr><td colspan="6"><div class="mo-empty">没有符合条件的小程序用户。</div></td></tr>';
    $("[data-mo-admin-page]").textContent = "第 " + adminPage + " / " + adminPages + " 页";
    $("[data-mo-admin-prev]").disabled = adminPage <= 1; $("[data-mo-admin-next]").disabled = adminPage >= adminPages;
  }
  function renderAdminDetail(user) {
    selectedUserId = user.id;
    const audits = user.recentAdjustments.length ? '<ul class="mo-audit-list">' + user.recentAdjustments.map((item) => '<li><span>' + escape(item.action) + ' · ' + escape(item.reason) + '</span><time>' + date(item.createdAt) + '</time></li>').join("") + '</ul>' : '<p class="mo-user-meta">暂无人工调整记录。</p>';
    $("[data-mo-admin-detail]").innerHTML = '<section class="mo-user-detail"><header><div><span class="kicker">USER #' + user.id + '</span><h2>' + escape(user.displayName) + '</h2></div><span class="mo-badge">' + statusLabels[user.membership.status] + '</span></header><dl class="mo-user-facts"><div><dt>脱敏手机号</dt><dd>' + escape(user.phoneMasked) + '</dd></div><div><dt>权益有效至</dt><dd>' + date(user.membership.activeUntil) + '</dd></div><div><dt>可用 / 累计积分</dt><dd>' + number(user.points.balance) + ' / ' + number(user.points.lifetime) + '</dd></div><div><dt>社群关联</dt><dd>' + escape(user.community.name || "未关联") + '</dd></div><div><dt>付费订单</dt><dd>' + user.payment.paidOrders + ' 单 · ' + money(user.payment.paidCents) + '</dd></div><div><dt>最近付费</dt><dd>' + date(user.payment.lastPaidAt) + '</dd></div><div><dt>最近活跃</dt><dd>' + date(user.activity.lastBehaviorAt) + '</dd></div><div><dt>注册时间</dt><dd>' + date(user.createdAt) + '</dd></div></dl><div class="mo-adjustments"><form class="mo-adjustment" data-mo-adjust="membership"><h3>延长会员权益</h3><label>增加时长<select name="membershipDays"><option value="7">7 天</option><option value="30" selected>30 天</option><option value="90">90 天</option><option value="180">180 天</option><option value="365">365 天</option></select></label><label>调整原因<input name="reason" maxlength="120" required placeholder="如：客户补偿、活动奖励"></label><button type="submit">确认延长权益</button></form><form class="mo-adjustment" data-mo-adjust="points"><h3>调整可用积分</h3><label>增减积分<input name="pointsDelta" type="number" min="-100000" max="100000" required placeholder="正数增加，负数扣减"></label><label>调整原因<input name="reason" maxlength="120" required placeholder="如：线下活动奖励、误发修正"></label><button type="submit">确认调整积分</button></form></div><p class="mo-admin-state" data-mo-adjust-state role="status" aria-live="polite"></p><h3>最近人工调整</h3>' + audits + '</section>';
  }
  async function loadAdminUsers() {
    if (!adminCsrfToken) return;
    const query = encodeURIComponent($("[data-mo-admin-query]").value || ""), status = encodeURIComponent($("[data-mo-admin-status]").value || "all");
    $("[data-mo-admin-state]").textContent = "正在读取小程序用户…"; $("[data-mo-admin-users]").innerHTML = '<tr><td colspan="6"><div class="mo-empty">正在加载受保护的用户明细…</div></td></tr>';
    try {
      const response = await fetch(endpoints.adminUsers + "?query=" + query + "&status=" + status + "&page=" + adminPage + "&pageSize=20", { method: "GET", headers: adminHeaders(), credentials: "same-origin", cache: "no-store" });
      if (response.status === 401 || response.status === 503) return adminFailure("管理员会话已失效或服务未配置，请重新验证。", true);
      if (!response.ok) throw new Error("用户明细暂不可用");
      const payload = await response.json();
      if (payload?.schemaVersion !== "MEMBER-ADMIN-V1.0" || payload.dataSource !== "production" || !Array.isArray(payload.users) || !Number.isSafeInteger(payload.page?.totalPages)) throw new Error("用户数据校验失败");
      const users = payload.users.map(safeAdminUser); if (users.some((item) => !item)) throw new Error("用户数据校验失败");
      adminUsers = users; adminPage = payload.page.number; adminPages = Math.max(1, payload.page.totalPages); adminLoaded = true;
      $("[data-mo-admin-state]").textContent = "已授权 · 共 " + payload.page.total + " 位小程序用户 · 更新于 " + date(payload.generatedAt); renderAdminUsers();
      if (selectedUserId) { const selected = adminUsers.find((user) => user.id === selectedUserId); $("[data-mo-admin-detail]").innerHTML = ""; if (selected) renderAdminDetail(selected); }
    } catch (error) { adminFailure(error.message || "用户明细暂不可用"); }
  }
  async function submitAdjustment(form) {
    const state = $("[data-mo-adjust-state]"), data = new FormData(form), reason = String(data.get("reason") || "").trim();
    const operationId = globalThis.crypto?.randomUUID?.() || (Date.now().toString(36) + "-" + Math.random().toString(36).slice(2));
    const body = form.dataset.moAdjust === "membership" ? { operationId, membershipDays: Number(data.get("membershipDays")), reason } : { operationId, pointsDelta: Number(data.get("pointsDelta")), reason };
    if (reason.length < 2) { state.textContent = "请填写至少 2 个字的调整原因。"; return; }
    const button = form.querySelector("button"); button.disabled = true; state.textContent = "正在提交调整…";
    try {
      const response = await fetch(endpoints.adminUsers + "/" + selectedUserId + "/adjustments", { method: "POST", headers: adminHeaders(true, true), credentials: "same-origin", cache: "no-store", body: JSON.stringify(body) });
      const payload = await response.json(); if (response.status === 401 || response.status === 403 || response.status === 503) return adminFailure("管理员会话已失效，请重新验证。", true);
      if (!response.ok) throw new Error(String(payload?.error?.message || "调整未成功").slice(0, 120));
      const user = safeAdminUser(payload?.user); if (payload?.schemaVersion !== "MEMBER-ADMIN-V1.0" || !user) throw new Error("调整结果校验失败");
      adminUsers = adminUsers.map((item) => item.id === user.id ? user : item);
      renderAdminUsers();
      selectedUserId = null;
      $("[data-mo-admin-detail]").innerHTML = "";
      $("[data-mo-admin-state]").textContent = "调整已保存，用户编辑已收起。";
    } catch (error) { state.textContent = error.message || "调整未成功"; } finally { button.disabled = false; }
  }
  const communityStateLabels = { not_joined: "未入群", joined: "已入群", eliminated: "已淘汰" };
  const cohortLabel = (value) => (["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][value] ? ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"][value] + "期" : "第 " + value + " 期");
  function safeCommunityMember(item) {
    if (!Number.isSafeInteger(item?.id) || item.id < 1 || typeof item.name !== "string" || !Number.isSafeInteger(item.cohort) || !Object.hasOwn(communityStateLabels, item.communityState) || !Number.isSafeInteger(item.points) || typeof item.miniProgram?.accountOpened !== "boolean") return null;
    return {
      ...item,
      name: item.name.slice(0, 80), city: String(item.city || "").slice(0, 100), company: String(item.company || "").slice(0, 200), role: String(item.role || "").slice(0, 80),
      joinedOn: String(item.joinedOn || ""), eliminatedOn: String(item.eliminatedOn || ""), eliminationReason: String(item.eliminationReason || "").slice(0, 300), updatedAt: String(item.updatedAt || ""),
      miniProgram: { accountOpened: item.miniProgram.accountOpened, userId: Number.isSafeInteger(item.miniProgram.userId) ? item.miniProgram.userId : null },
    };
  }
  function communityFailure(message, expired = false) {
    $("[data-mo-community-status]").textContent = message;
    $("[data-mo-community-members]").innerHTML = '<tr><td colspan="7"><div class="mo-empty">' + escape(message) + '</div></td></tr>';
    if (expired) {
      resetAdminSession();
      document.dispatchEvent(new CustomEvent("operations:session-expired", { detail: { message } }));
    }
  }
  function renderCommunityMembers() {
    $("[data-mo-community-members]").innerHTML = communityMembers.length ? communityMembers.map((member) => '<tr><td><span class="mo-user-name">' + escape(member.name) + '</span><span class="mo-user-meta">#' + member.id + ' · ' + escape(member.city || member.role) + '</span></td><td><span class="mo-badge">' + cohortLabel(member.cohort) + '</span></td><td><span class="mo-badge mo-state-' + member.communityState + '">' + communityStateLabels[member.communityState] + '</span><span class="mo-user-meta">' + (member.communityState === "eliminated" ? escape(member.eliminationReason || "未记录原因") : member.joinedOn ? "入群 " + escape(member.joinedOn) : "") + '</span></td><td><span class="mo-badge">' + (member.miniProgram.accountOpened ? "已开通" : "未开通") + '</span><span class="mo-user-meta">' + (member.miniProgram.userId ? "用户 #" + member.miniProgram.userId : "") + '</span></td><td>' + number(member.points) + '</td><td>' + date(member.updatedAt) + '</td><td><button type="button" data-mo-community-id="' + member.id + '">管理</button></td></tr>').join("") : '<tr><td colspan="7"><div class="mo-empty">没有符合条件的社群成员。</div></td></tr>';
    $("[data-mo-community-page]").textContent = "第 " + communityPage + " / " + communityPages + " 页";
    $("[data-mo-community-prev]").disabled = communityPage <= 1;
    $("[data-mo-community-next]").disabled = communityPage >= communityPages;
  }
  function renderCohortOptions(cohorts) {
    const select = $("[data-mo-community-cohort]"), current = select.value;
    select.innerHTML = '<option value="all">全部期数</option>' + cohorts.map((value) => '<option value="' + value + '">' + cohortLabel(value) + '</option>').join("");
    select.value = current === "all" || cohorts.map(String).includes(current) ? current : "all";
  }
  async function loadCommunityMembers() {
    if (!adminCsrfToken) return;
    const query = encodeURIComponent($("[data-mo-community-query]").value || ""), cohort = encodeURIComponent($("[data-mo-community-cohort]").value || "all"), state = encodeURIComponent($("[data-mo-community-state]").value || "all");
    $("[data-mo-community-status]").textContent = "正在读取社群成员…";
    $("[data-mo-community-members]").innerHTML = '<tr><td colspan="7"><div class="mo-empty">正在加载成员数据…</div></td></tr>';
    try {
      const response = await fetch(endpoints.communityDirectory + "?query=" + query + "&cohort=" + cohort + "&state=" + state + "&page=" + communityPage + "&pageSize=20", { method: "GET", headers: adminHeaders(), credentials: "same-origin", cache: "no-store" });
      if (response.status === 401 || response.status === 503) return communityFailure("管理员会话已失效或社群服务未配置，请重新验证。", true);
      const payload = await response.json();
      if (!response.ok) throw new Error(String(payload?.error?.message || "社群成员暂不可用").slice(0, 120));
      if (payload?.schemaVersion !== "COMMUNITY-MEMBER-ADMIN-V1.0" || !Array.isArray(payload.members) || !Array.isArray(payload.cohorts) || !Number.isSafeInteger(payload.page?.totalPages)) throw new Error("成员数据校验失败");
      const members = payload.members.map(safeCommunityMember); if (members.some((item) => !item)) throw new Error("成员数据校验失败");
      communityMembers = members; communityPage = payload.page.number; communityPages = Math.max(1, payload.page.totalPages); communityLoaded = true;
      renderCohortOptions(payload.cohorts.filter((value) => Number.isSafeInteger(value) && value > 0));
      $("[data-mo-community-status]").textContent = "共 " + payload.page.total + " 人 · 已入群 " + Number(payload.stateCounts?.joined || 0) + " · 未入群 " + Number(payload.stateCounts?.not_joined || 0) + " · 已淘汰 " + Number(payload.stateCounts?.eliminated || 0);
      renderCommunityMembers();
    } catch (error) { communityFailure(error.message || "社群成员暂不可用"); }
  }
  function renderCommunityDetail(member) {
    selectedCommunityId = member.id;
    const profile = [
      ["城市", member.city], ["角色", member.role], ["公司", member.company], ["微信", member.wechat], ["联系方式", member.contact],
      ["行业", member.industry], ["核心能力", member.skills], ["当前项目", member.project], ["核心诉求", member.needs], ["创业方向", member.direction],
    ].map(([label, value]) => detailValue(label, value)).join("");
    $("[data-mo-community-detail]").innerHTML = '<section class="mo-approval-detail"><header><div><span class="kicker">MEMBER #' + member.id + '</span><h2>' + escape(member.name) + '</h2></div><div class="mo-detail-badges"><span class="mo-badge">' + cohortLabel(member.cohort) + '</span><span class="mo-badge mo-state-' + member.communityState + '">' + communityStateLabels[member.communityState] + '</span><span class="mo-badge">小程序' + (member.miniProgram.accountOpened ? "已开通" : "未开通") + '</span></div></header><dl class="mo-approval-profile">' + profile + '</dl><form class="mo-community-form" data-mo-community-manage><div class="mo-review-row"><label>期数<input type="number" name="cohort" min="1" max="99" value="' + member.cohort + '" required></label><label>社群状态<select name="state"><option value="not_joined">未入群</option><option value="joined">已入群</option><option value="eliminated">已淘汰</option></select></label><label>入群日期<input type="date" name="joinedOn" max="' + new Date().toISOString().slice(0, 10) + '" value="' + escape(member.joinedOn) + '"></label></div><label>淘汰原因<textarea name="eliminationReason" maxlength="300" placeholder="仅标记淘汰时必填">' + escape(member.eliminationReason) + '</textarea></label><div class="mo-review-actions"><button type="submit">保存成员状态</button></div><p class="mo-admin-state" data-mo-community-manage-state role="status" aria-live="polite"></p></form></section>';
    $("[data-mo-community-manage] [name=state]").value = member.communityState;
  }
  async function loadCommunityDetail(memberId) {
    $("[data-mo-community-detail]").innerHTML = '<div class="mo-empty">正在读取成员资料…</div>';
    try {
      const response = await fetch(endpoints.communityDirectory + "/" + memberId, { method: "GET", headers: adminHeaders(), credentials: "same-origin", cache: "no-store" });
      const payload = await response.json();
      if (response.status === 401 || response.status === 503) return communityFailure("管理员会话已失效，请重新验证。", true);
      if (!response.ok) throw new Error(String(payload?.error?.message || "成员资料暂不可用").slice(0, 120));
      const member = safeCommunityMember(payload.member);
      if (payload?.schemaVersion !== "COMMUNITY-MEMBER-ADMIN-V1.0" || !member || typeof member.contact !== "string") throw new Error("成员资料校验失败");
      renderCommunityDetail(member);
    } catch (error) { $("[data-mo-community-detail]").innerHTML = '<div class="mo-empty">' + escape(error.message || "成员资料暂不可用") + '</div>'; }
  }
  async function submitCommunityManagement(form) {
    const stateNode = $("[data-mo-community-manage-state]"), data = new FormData(form), button = form.querySelector("button");
    const body = {
      operationId: globalThis.crypto?.randomUUID?.() || ("community-manage-" + Date.now().toString(36)),
      cohort: Number(data.get("cohort")), state: String(data.get("state") || "not_joined"), joinedOn: String(data.get("joinedOn") || ""), eliminationReason: String(data.get("eliminationReason") || "").trim(),
    };
    if (body.state === "joined" && !body.joinedOn) { stateNode.textContent = "标记已入群时，请填写入群日期。"; return; }
    if (body.state === "eliminated" && body.eliminationReason.length < 2) { stateNode.textContent = "标记淘汰时，请填写原因。"; return; }
    button.disabled = true; stateNode.textContent = "正在保存…";
    try {
      const response = await fetch(endpoints.communityDirectory + "/" + selectedCommunityId + "/management", { method: "POST", headers: adminHeaders(true, true), credentials: "same-origin", cache: "no-store", body: JSON.stringify(body) });
      const payload = await response.json();
      if (response.status === 401 || response.status === 403 || response.status === 503) return communityFailure("管理员会话已失效，请重新验证。", true);
      if (!response.ok) throw new Error(String(payload?.error?.message || "成员状态未保存").slice(0, 120));
      const member = safeCommunityMember(payload.member); if (payload?.schemaVersion !== "COMMUNITY-MEMBER-ADMIN-V1.0" || !member) throw new Error("保存结果校验失败");
      await loadCommunityMembers(); renderCommunityDetail(member); $("[data-mo-community-manage-state]").textContent = "成员状态已保存。";
    } catch (error) { stateNode.textContent = error.message || "成员状态未保存"; } finally { button.disabled = false; }
  }
  const approvalStatusLabels = { pending: "待审核", approved: "已通过", waitlist: "候补", rejected: "暂不邀请" };
  function safeApprovalMember(item) {
    if (!Number.isSafeInteger(item?.id) || item.id < 1 || typeof item.name !== "string" || typeof item.city !== "string" || !Object.hasOwn(approvalStatusLabels, item.status) || !Number.isSafeInteger(item.totalScore)) return null;
    return { id: item.id, name: item.name.slice(0, 80), city: item.city.slice(0, 100), company: String(item.company || "").slice(0, 200), role: String(item.role || "").slice(0, 80), status: item.status, cohort: Number.isSafeInteger(item.cohort) ? item.cohort : 1, totalScore: item.totalScore, joinedOn: String(item.joinedOn || ""), createdAt: String(item.createdAt || ""), updatedAt: String(item.updatedAt || "") };
  }
  function approvalFailure(message, expired = false) {
    $("[data-mo-approval-state]").textContent = message;
    $("[data-mo-approval-members]").innerHTML = '<tr><td colspan="6"><div class="mo-empty">' + escape(message) + '</div></td></tr>';
    if (expired) {
      resetAdminSession();
      document.dispatchEvent(new CustomEvent("operations:session-expired", { detail: { message } }));
    }
  }
  function renderApprovalMembers() {
    $("[data-mo-approval-members]").innerHTML = approvalMembers.length ? approvalMembers.map((member) => '<tr><td><span class="mo-user-name">' + escape(member.name) + '</span><span class="mo-user-meta">#' + member.id + ' · ' + escape(member.city) + '</span></td><td>' + escape(member.role) + '<span class="mo-user-meta">' + escape(member.company || "未填写公司") + '</span></td><td><span class="mo-badge">' + approvalStatusLabels[member.status] + '</span></td><td>' + member.totalScore + ' / 100</td><td>' + date(member.createdAt) + '</td><td><button type="button" data-mo-approval-id="' + member.id + '">审批</button></td></tr>').join("") : '<tr><td colspan="6"><div class="mo-empty">没有符合条件的会员申请。</div></td></tr>';
    $("[data-mo-approval-page]").textContent = "第 " + approvalPage + " / " + approvalPages + " 页";
    $("[data-mo-approval-prev]").disabled = approvalPage <= 1;
    $("[data-mo-approval-next]").disabled = approvalPage >= approvalPages;
  }
  async function loadApprovals() {
    if (!adminCsrfToken) return;
    const query = encodeURIComponent($("[data-mo-approval-query]").value || ""), status = encodeURIComponent($("[data-mo-approval-status]").value || "pending");
    $("[data-mo-approval-state]").textContent = "正在读取会员申请…";
    $("[data-mo-approval-members]").innerHTML = '<tr><td colspan="6"><div class="mo-empty">正在加载受保护的审批数据…</div></td></tr>';
    try {
      const response = await fetch(endpoints.communityApprovals + "?query=" + query + "&status=" + status + "&page=" + approvalPage + "&pageSize=20", { method: "GET", headers: adminHeaders(), credentials: "same-origin", cache: "no-store" });
      if (response.status === 401 || response.status === 503) return approvalFailure("管理员会话已失效或社群服务未配置，请重新验证。", true);
      if (!response.ok) throw new Error("会员审批暂不可用");
      const payload = await response.json();
      if (payload?.schemaVersion !== "COMMUNITY-APPROVAL-V1.0" || !Array.isArray(payload.members) || !Number.isSafeInteger(payload.page?.totalPages)) throw new Error("审批数据校验失败");
      const members = payload.members.map(safeApprovalMember); if (members.some((item) => !item)) throw new Error("审批数据校验失败");
      approvalMembers = members; approvalPage = payload.page.number; approvalPages = Math.max(1, payload.page.totalPages); approvalsLoaded = true;
      $("[data-mo-approval-state]").textContent = "共 " + payload.page.total + " 项 · 待审核 " + Number(payload.statusCounts?.pending || 0) + " 项";
      renderApprovalMembers();
    } catch (error) { approvalFailure(error.message || "会员审批暂不可用"); }
  }
  function detailValue(label, value) { return '<div><dt>' + label + '</dt><dd>' + escape(value || "—") + '</dd></div>'; }
  function renderApprovalDetail(member) {
    selectedApprovalId = member.id;
    const scores = member.scores;
    const profile = [
      ["微信", member.wechat], ["联系方式", member.contact], ["邀请线索", member.inviterHint], ["AI 方向", member.aiDirections],
      ["行业", member.industry], ["核心能力", member.skills], ["当前项目", member.project], ["可交流资源", member.resources],
      ["核心诉求", member.needs], ["希望交流对象", member.connectTargets], ["创业方向", member.direction], ["创业判断", member.perspective],
      ["参与意愿", member.activities], ["补充", member.extra],
    ].map(([label, value]) => detailValue(label, value)).join("");
    const cohort = member.status === "pending" ? 2 : member.cohort;
    $("[data-mo-approval-detail]").innerHTML = '<section class="mo-approval-detail"><header><div><span class="kicker">APPLICATION #' + member.id + '</span><h2>' + escape(member.name) + '</h2><p>' + escape(member.city + " · " + member.role + (member.company ? " · " + member.company : "")) + '</p></div><span class="mo-badge">' + approvalStatusLabels[member.status] + '</span></header><form class="mo-review-form" data-mo-review><div class="mo-decision-bar" aria-label="审批操作"><button type="submit" name="decision" value="approved" class="mo-approve">通过申请</button><button type="submit" name="decision" value="rejected" class="mo-reject">不通过</button><button type="submit" name="decision" value="waitlist" class="mo-secondary">转为候补</button></div><div class="mo-review-row mo-review-row-compact"><label>归属期数<input type="number" name="cohort" min="1" max="99" value="' + cohort + '" required></label><label>审核备注<textarea name="reviewNotes" maxlength="3000" placeholder="可选：记录判断与后续事项">' + escape(member.reviewNotes) + '</textarea></label></div><details class="mo-review-more"><summary>评分与展示设置</summary><div class="mo-score-fields"><label>AI 能力 / 30<input type="number" name="ai" min="0" max="30" value="' + scores.ai + '" required></label><label>行业资源 / 25<input type="number" name="industry" min="0" max="25" value="' + scores.industry + '" required></label><label>创业意愿 / 25<input type="number" name="entrepreneurship" min="0" max="25" value="' + scores.entrepreneurship + '" required></label><label>贡献潜力 / 15<input type="number" name="contribution" min="0" max="15" value="' + scores.contribution + '" required></label><label>社群契合 / 5<input type="number" name="fit" min="0" max="5" value="' + scores.fit + '" required></label></div><label class="mo-review-check"><input type="checkbox" name="hideCompanyInDirectory" ' + (member.hideCompanyInDirectory ? "checked" : "") + '>在会员公开页面隐藏公司</label></details><p class="mo-admin-state" data-mo-review-state role="status" aria-live="polite"></p></form><dl class="mo-approval-profile">' + profile + '</dl></section>';
    $("[data-mo-approval-detail]").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function loadApprovalDetail(memberId) {
    $("[data-mo-approval-detail]").innerHTML = '<div class="mo-empty">正在读取申请详情…</div>';
    try {
      const response = await fetch(endpoints.communityApprovals + "/" + memberId, { method: "GET", headers: adminHeaders(), credentials: "same-origin", cache: "no-store" });
      if (response.status === 401 || response.status === 503) return approvalFailure("管理员会话已失效，请重新验证。", true);
      const payload = await response.json();
      const member = payload?.member;
      if (!response.ok) throw new Error(String(payload?.error?.message || "申请详情暂不可用").slice(0, 120));
      if (payload?.schemaVersion !== "COMMUNITY-APPROVAL-V1.0" || !safeApprovalMember(member) || !member.scores || typeof member.contact !== "string") throw new Error("申请详情校验失败");
      renderApprovalDetail(member);
    } catch (error) { $("[data-mo-approval-detail]").innerHTML = '<div class="mo-empty">' + escape(error.message || "申请详情暂不可用") + '</div>'; }
  }
  async function submitApprovalReview(form, decision) {
    const state = $("[data-mo-review-state]"), data = new FormData(form), buttons = [...form.querySelectorAll("button[type=submit]")];
    const body = {
      operationId: globalThis.crypto?.randomUUID?.() || ("community-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2)),
      status: String(decision || "pending"), cohort: Number(data.get("cohort")), reviewNotes: String(data.get("reviewNotes") || "").trim(),
      hideCompanyInDirectory: data.get("hideCompanyInDirectory") === "on",
      scores: { ai: Number(data.get("ai")), industry: Number(data.get("industry")), entrepreneurship: Number(data.get("entrepreneurship")), contribution: Number(data.get("contribution")), fit: Number(data.get("fit")) },
    };
    buttons.forEach((button) => { button.disabled = true; }); state.textContent = "正在提交审批…";
    try {
      const response = await fetch(endpoints.communityApprovals + "/" + selectedApprovalId + "/reviews", { method: "POST", headers: adminHeaders(true, true), credentials: "same-origin", cache: "no-store", body: JSON.stringify(body) });
      const payload = await response.json();
      if (response.status === 401 || response.status === 403 || response.status === 503) return approvalFailure("管理员会话已失效，请重新验证。", true);
      if (!response.ok) throw new Error(String(payload?.error?.message || "审批未保存").slice(0, 120));
      if (payload?.schemaVersion !== "COMMUNITY-APPROVAL-V1.0" || !safeApprovalMember(payload.member)) throw new Error("审批结果校验失败");
      selectedApprovalId = null; $("[data-mo-approval-detail]").innerHTML = "";
      $("[data-mo-approval-query]").value = ""; $("[data-mo-approval-status]").value = "all"; approvalPage = 1;
      await loadApprovals();
      $("[data-mo-approval-state]").textContent = "审批已完成，已返回全部用户。";
      $("[data-mo-approval-search-form]").scrollIntoView({ behavior: "smooth", block: "start" });
      $("[data-mo-approval-query]").focus();
    } catch (error) { state.textContent = error.message || "审批未保存"; } finally { buttons.forEach((button) => { button.disabled = false; }); }
  }
  const scheduleStatusLabels = { pending: "待确认", confirmed: "已确认", completed: "已完成", cancelled: "已取消" };
  function safeScheduleSession(item) {
    if (typeof item?.id !== "string" || !Object.hasOwn(scheduleStatusLabels, item.status) || typeof item.title !== "string" || !Array.isArray(item.speakers)) return null;
    const speakers = item.speakers.map((speaker) => ({ name: String(speaker?.name || "").slice(0, 60), focus: String(speaker?.focus || "").slice(0, 120) })).filter((speaker) => speaker.name);
    return { id: item.id.slice(0, 16), date: String(item.date || ""), status: item.status, title: item.title.slice(0, 120), category: String(item.category || "").slice(0, 60), notes: String(item.notes || "").slice(0, 1000), speakers, updatedAt: String(item.updatedAt || "") };
  }
  function renderScheduleList() {
    $("[data-mo-schedule-list]").innerHTML = scheduleSessions.length ? '<div class="mo-schedule-list">' + scheduleSessions.map((session) => '<article class="mo-schedule-item"><div><span class="mo-badge">' + scheduleStatusLabels[session.status] + '</span><time>' + escape(session.date || "日期待定") + '</time><h3>' + escape(session.title) + '</h3><p>' + escape(session.speakers.map((speaker) => speaker.name).join("、") || "嘉宾待定") + '</p></div><button type="button" class="mo-secondary" data-mo-schedule-id="' + escape(session.id) + '">编辑</button></article>').join("") + '</div>' : '<div class="mo-empty">二期尚未创建排期。</div>';
  }
  function renderScheduleEditor(session = null) {
    selectedScheduleId = session?.id || null;
    const speakers = session?.speakers?.map((speaker) => speaker.name + (speaker.focus ? "｜" + speaker.focus : "")).join("\n") || "";
    $("[data-mo-schedule-editor]").innerHTML = '<form class="mo-schedule-editor" data-mo-schedule-form><header><h2>' + (session ? "编辑 " + escape(session.id) : "新增二期排期") + '</h2><button type="button" class="mo-secondary" data-mo-schedule-cancel>取消</button></header><div class="mo-schedule-fields"><label>日期<input type="date" name="date" value="' + escape(session?.date || "") + '"></label><label>状态<select name="status"><option value="pending">待确认</option><option value="confirmed">已确认</option><option value="completed">已完成</option><option value="cancelled">已取消</option></select></label><label>标题<input name="title" maxlength="120" required value="' + escape(session?.title || "") + '" placeholder="如：二期首场主题分享"></label><label>分类<input name="category" maxlength="60" value="' + escape(session?.category || "") + '" placeholder="可选"></label></div><label>嘉宾<textarea name="speakers" placeholder="每行一位：姓名｜分享方向">' + escape(speakers) + '</textarea></label><label>备注<textarea name="notes" maxlength="1000" placeholder="可选">' + escape(session?.notes || "") + '</textarea></label><div class="mo-review-actions"><button type="submit">保存排期</button></div><p class="mo-admin-state" data-mo-schedule-save-state role="status" aria-live="polite"></p></form>';
    $("[data-mo-schedule-form] [name=status]").value = session?.status || "pending";
    $("[data-mo-schedule-form] [name=title]").focus();
  }
  async function loadSchedule() {
    if (!adminCsrfToken) return;
    $("[data-mo-schedule-state]").textContent = "正在读取排期…";
    $("[data-mo-schedule-list]").innerHTML = '<div class="mo-empty">正在加载二期排期…</div>';
    try {
      const response = await fetch(endpoints.communitySchedule, { method: "GET", headers: adminHeaders(), credentials: "same-origin", cache: "no-store" });
      const payload = await response.json();
      if (response.status === 401 || response.status === 503) return communityFailure("管理员会话已失效或社群服务未配置，请重新验证。", true);
      if (!response.ok) throw new Error(String(payload?.error?.message || "排期暂不可用").slice(0, 120));
      if (payload?.schemaVersion !== "COMMUNITY-SCHEDULE-V1.0" || !Array.isArray(payload.seasons)) throw new Error("排期数据校验失败");
      const seasonOne = payload.seasons.find((season) => season.season === 1), seasonTwo = payload.seasons.find((season) => season.season === 2);
      if (!seasonOne || !seasonTwo || !Array.isArray(seasonTwo.sessions)) throw new Error("排期数据校验失败");
      const sessions = seasonTwo.sessions.map(safeScheduleSession); if (sessions.some((item) => !item)) throw new Error("排期数据校验失败");
      scheduleSessions = sessions; scheduleLoaded = true;
      $("[data-mo-schedule-summary]").innerHTML = '<article><span class="kicker">一期</span><strong>已完成</strong><p>' + Number(seasonOne.completedCount || 0) + ' 场</p></article>';
      $("[data-mo-schedule-state]").textContent = "共 " + scheduleSessions.length + " 场";
      renderScheduleList();
      if (selectedScheduleId) { const selected = scheduleSessions.find((item) => item.id === selectedScheduleId); if (selected) renderScheduleEditor(selected); }
    } catch (error) {
      $("[data-mo-schedule-state]").textContent = error.message || "排期暂不可用";
      $("[data-mo-schedule-list]").innerHTML = '<div class="mo-empty">' + escape(error.message || "排期暂不可用") + '</div>';
    }
  }
  async function submitSchedule(form) {
    const data = new FormData(form), stateNode = $("[data-mo-schedule-save-state]"), button = form.querySelector("button[type=submit]");
    const speakers = String(data.get("speakers") || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => { const parts = line.split(/[｜|]/, 2); return { name: parts[0].trim(), focus: (parts[1] || "").trim() }; });
    const body = { operationId: globalThis.crypto?.randomUUID?.() || ("schedule-" + Date.now().toString(36)), date: String(data.get("date") || ""), status: String(data.get("status") || "pending"), title: String(data.get("title") || "").trim(), category: String(data.get("category") || "").trim(), notes: String(data.get("notes") || "").trim(), speakers };
    if (["confirmed", "completed"].includes(body.status) && !body.date) { stateNode.textContent = "确认或完成排期时，请填写日期。"; return; }
    button.disabled = true; stateNode.textContent = "正在保存…";
    const target = endpoints.communitySchedule + "/season-2/sessions" + (selectedScheduleId ? "/" + encodeURIComponent(selectedScheduleId) : "");
    try {
      const response = await fetch(target, { method: "POST", headers: adminHeaders(true, true), credentials: "same-origin", cache: "no-store", body: JSON.stringify(body) });
      const payload = await response.json();
      if (response.status === 401 || response.status === 403 || response.status === 503) return communityFailure("管理员会话已失效，请重新验证。", true);
      if (!response.ok) throw new Error(String(payload?.error?.message || "排期未保存").slice(0, 120));
      if (payload?.schemaVersion !== "COMMUNITY-SCHEDULE-V1.0" || !safeScheduleSession(payload.session)) throw new Error("排期结果校验失败");
      selectedScheduleId = null; $("[data-mo-schedule-editor]").innerHTML = ""; await loadSchedule(); $("[data-mo-schedule-state]").textContent = "排期已保存。";
    } catch (error) { stateNode.textContent = error.message || "排期未保存"; } finally { button.disabled = false; }
  }
  $("[data-mo-days]").addEventListener("change", (event) => {
    const value = Number(event.target.value);
    days = [7, 30, 90].includes(value) ? value : 30;
    refresh();
  });
  $("[data-mo-refresh]").addEventListener("click", refresh);
  $("[data-mo-admin-search-form]").addEventListener("submit", (event) => { event.preventDefault(); adminPage = 1; void loadAdminUsers(); });
  $("[data-mo-admin-status]").addEventListener("change", () => { adminPage = 1; void loadAdminUsers(); });
  $("[data-mo-admin-prev]").addEventListener("click", () => { if (adminPage > 1) { adminPage -= 1; void loadAdminUsers(); } });
  $("[data-mo-admin-next]").addEventListener("click", () => { if (adminPage < adminPages) { adminPage += 1; void loadAdminUsers(); } });
  $("[data-mo-admin-users]").addEventListener("click", (event) => { const button = event.target.closest("[data-mo-user-id]"); if (!button) return; const user = adminUsers.find((item) => item.id === Number(button.dataset.moUserId)); if (user) renderAdminDetail(user); });
  $("[data-mo-admin-detail]").addEventListener("submit", (event) => { const form = event.target.closest("[data-mo-adjust]"); if (!form) return; event.preventDefault(); void submitAdjustment(form); });
  $("[data-mo-community-search-form]").addEventListener("submit", (event) => { event.preventDefault(); communityPage = 1; void loadCommunityMembers(); });
  $("[data-mo-community-cohort]").addEventListener("change", () => { communityPage = 1; void loadCommunityMembers(); });
  $("[data-mo-community-state]").addEventListener("change", () => { communityPage = 1; void loadCommunityMembers(); });
  $("[data-mo-community-prev]").addEventListener("click", () => { if (communityPage > 1) { communityPage -= 1; void loadCommunityMembers(); } });
  $("[data-mo-community-next]").addEventListener("click", () => { if (communityPage < communityPages) { communityPage += 1; void loadCommunityMembers(); } });
  $("[data-mo-community-members]").addEventListener("click", (event) => { const button = event.target.closest("[data-mo-community-id]"); if (button) void loadCommunityDetail(Number(button.dataset.moCommunityId)); });
  $("[data-mo-community-detail]").addEventListener("submit", (event) => { const form = event.target.closest("[data-mo-community-manage]"); if (!form) return; event.preventDefault(); void submitCommunityManagement(form); });
  $("[data-mo-approval-search-form]").addEventListener("submit", (event) => { event.preventDefault(); approvalPage = 1; void loadApprovals(); });
  $("[data-mo-approval-status]").addEventListener("change", () => { approvalPage = 1; void loadApprovals(); });
  $("[data-mo-approval-prev]").addEventListener("click", () => { if (approvalPage > 1) { approvalPage -= 1; void loadApprovals(); } });
  $("[data-mo-approval-next]").addEventListener("click", () => { if (approvalPage < approvalPages) { approvalPage += 1; void loadApprovals(); } });
  $("[data-mo-approval-members]").addEventListener("click", (event) => { const button = event.target.closest("[data-mo-approval-id]"); if (button) void loadApprovalDetail(Number(button.dataset.moApprovalId)); });
  $("[data-mo-approval-detail]").addEventListener("submit", (event) => { const form = event.target.closest("[data-mo-review]"); if (!form) return; event.preventDefault(); void submitApprovalReview(form, event.submitter?.value); });
  $("[data-mo-schedule-new]").addEventListener("click", () => renderScheduleEditor());
  $("[data-mo-schedule-list]").addEventListener("click", (event) => { const button = event.target.closest("[data-mo-schedule-id]"); if (!button) return; const session = scheduleSessions.find((item) => item.id === button.dataset.moScheduleId); if (session) renderScheduleEditor(session); });
  $("[data-mo-schedule-editor]").addEventListener("click", (event) => { if (event.target.closest("[data-mo-schedule-cancel]")) { selectedScheduleId = null; $("[data-mo-schedule-editor]").innerHTML = ""; } });
  $("[data-mo-schedule-editor]").addEventListener("submit", (event) => { const form = event.target.closest("[data-mo-schedule-form]"); if (!form) return; event.preventDefault(); void submitSchedule(form); });
  root.addEventListener("membership:open", (event) => {
    activeView = ["membership", "membership-community", "membership-approval", "membership-users", "membership-schedule", "membership-token"].includes(event?.detail?.view) ? event.detail.view : "membership";
    if (activeView === "membership" && !loaded) refresh();
    if (activeView === "membership-users" && adminCsrfToken && !adminLoaded) void loadAdminUsers();
    if (activeView === "membership-community" && adminCsrfToken && !communityLoaded) void loadCommunityMembers();
    if (activeView === "membership-approval" && adminCsrfToken && !approvalsLoaded) void loadApprovals();
    if (activeView === "membership-schedule" && adminCsrfToken && !scheduleLoaded) void loadSchedule();
  });
  document.addEventListener("operations:authenticated", (event) => {
    const token = String(event.detail?.csrfToken || "");
    if (token.length < 20) return;
    adminCsrfToken = token; adminPage = 1; adminLoaded = false; approvalPage = 1; approvalsLoaded = false; communityPage = 1; communityLoaded = false; scheduleLoaded = false;
    if (activeView === "membership-users") void loadAdminUsers();
    if (activeView === "membership-community") void loadCommunityMembers();
    if (activeView === "membership-approval") void loadApprovals();
    if (activeView === "membership-schedule") void loadSchedule();
  });
  document.addEventListener("operations:logout", resetAdminSession);
})();


// Token management uses the same OPS session; no standalone public admin surface.
(function () {
  const root = document.querySelector("[data-mo-token]");
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const escape = (value) => String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
  const endpoint = "/ops/member-api/token-benefits";
  let csrf = "", active = false, payload = null, preview = null, generation = 0, busy = false, dirty = false, editing = true;
  const operations = new Map();
  const selected = () => $("[data-token-season]").value;
  const status = (value) => { $("[data-token-status]").textContent = value; };
  const actionLabel = { configure: "修改配置", confirm: "确认分配", receipt: "登记发放" };
  const distributionMode = (config) => config.distributionMode || (config.eligibleTypes.length ? "custom" : "season_total");
  function totalRules(config) {
    const limit = Number(config.rewardRankLimit) || 0;
    const scope = limit ? "仅激励赛季总积分排名前 " + limit + " 名的成员；第 " + limit + " 名同分者全部纳入，实际人数可能超过 " + limit + " 人。" : "";
    const period = (config.start || "历史起始日期") + "至" + (config.end || "待确定结束日期") + (config.endInclusive ? "（含开始日和结束日）" : "（含开始日，不含结束日）");
    return config.label + "按赛季总积分分配。计分期间：" + period + "。奖励由" + (config.provider || "待确认赞助商") + "提供，激励池共 " + config.amount + " " + (config.model ? config.model + " " : "") + config.unit + "。\n" +
      "赛季结束后，结算时有效且本赛季总积分大于 0 的社群成员参与排名。" + scope + "个人额度 = 激励池额度 × 个人赛季总积分 ÷ 所有参与成员的赛季总积分之和。\n" +
      "个人额度按整数最小单位向下取整，余量保留在激励池。积分不扣减，不计入小程序钱包积分。分配确认后锁定，实际发放另行登记。";
  }
  function formConfig(form) {
    const data = new FormData(form), mode = data.get("distributionMode");
    return { start: data.get("start"), end: data.get("end"), endInclusive: data.has("endInclusive"), provider: data.get("provider"), model: (data.get("model") || "").trim(), unit: data.get("unit"), amount: Number(data.get("amount")), rewardRankLimit: Number(data.get("rewardRankLimit") || 0), distributionMode: mode, eligibleTypes: mode === "custom" ? data.getAll("type") : [], rules: data.get("rules"), rulesCustomized: data.get("rulesCustomized") === "true", enabled: data.has("enabled") };
  }
  function fitRules() {
    const rules = $('[name="rules"]');
    if (rules?.style) { rules.style.height = "auto"; rules.style.height = (rules.scrollHeight + rules.offsetHeight - rules.clientHeight) + "px"; }
  }
  function reset() {
    generation += 1; csrf = ""; payload = null; preview = null; operations.clear();
    for (const name of ["content", "preview", "records", "audits"]) $("[data-token-" + name + "]").innerHTML = "";
    status("登录后可管理");
  }
  async function request(path = "", body) {
    const response = await fetch(endpoint + path, {
      method: body ? "POST" : "GET", credentials: "same-origin", cache: "no-store",
      headers: body ? { "Content-Type": "application/json", "X-CSRF-Token": csrf } : {},
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const result = await response.json();
    if (response.status === 401 || response.status === 403) { reset(); throw new Error("会话或权限已变化，请重新登录"); }
    if (!response.ok) throw new Error(result.error?.message || "请求失败，请重试");
    return result;
  }
  function table(rows, unit, receipts = false) {
    return '<div class="mo-token-table"><table><thead><tr><th>成员</th><th>有效积分</th><th>' + escape(unit) + '</th>' + (receipts ? '<th>发放记录</th>' : '') + '</tr></thead><tbody>' + rows.map((row) => '<tr><td>' + escape(row.name) + '</td><td>' + row.points + '</td><td>' + row.amount + '</td>' + (receipts ? '<td>' + (row.receipt ? '已登记 · ' + escape(row.receipt.receipt) : row.amount > 0 ? '<form data-token-receipt="' + row.memberId + '"><input name="receipt" minlength="4" maxlength="200" required aria-label="发放凭据编号" placeholder="实际发放凭据编号"><button type="submit">登记发放</button></form>' : '未分配额度') + '</td>' : '') + '</tr>').join("") + '</tbody></table></div>';
  }
  function render() {
    if (!payload) return;
    preview = null; dirty = false; $("[data-token-preview]").innerHTML = "";
    const config = payload.seasons.find((item) => item.id === selected());
    if (!config) throw new Error("赛季不存在");
    const batch = payload.batches.find((item) => item.config.id === selected());
    const total = distributionMode(config) === "season_total";
    $("[data-token-content]").innerHTML = '<form class="mo-token-editor" data-token-config ' + (editing ? '' : 'hidden') + '><h2>赛季与激励池设置</h2><fieldset ' + (batch ? 'disabled' : '') + '><label>Token 模型<input name="model" maxlength="100" placeholder="填写模型名称" value="' + escape(config.model || '') + '"></label><div class="mo-token-fields">' +
      '<label>Token 额度<input name="amount" type="number" min="0" max="1000000000000" step="1" required value="' + config.amount + '"></label>' +
      '<label>计量单位<input name="unit" maxlength="40" required value="' + escape(config.unit) + '"></label><label>赞助商<input name="provider" maxlength="100" value="' + escape(config.provider) + '"></label>' +
      '<label>开始日期<input type="date" name="start" value="' + escape(config.start) + '"></label><label>结束日期<input type="date" name="end" value="' + escape(config.end) + '"></label>' +
      '</div><label class="mo-token-check"><input type="checkbox" name="endInclusive" ' + (config.endInclusive ? 'checked' : '') + '>计入结束日当天积分</label><div class="mo-token-allocation"><label>分配方式<select name="distributionMode"><option value="season_total" ' + (total ? 'selected' : '') + '>赛季总积分（默认）</option><option value="custom" ' + (!total ? 'selected' : '') + '>自定义计分类别</option></select></label><label>激励名次上限<input name="rewardRankLimit" type="number" min="0" max="1000" step="1" required value="' + (config.rewardRankLimit || 0) + '"></label><p>0 表示不限名次；按所选计分方式排名，边界同分者全部纳入。仅以入选成员积分总和分配，积分不扣减。</p></div>' +
      '<div data-token-custom ' + (total ? 'hidden' : '') + '><h3>参与分配的计分类别</h3><div class="mo-token-types">' + payload.activityTypes.map((type) => '<label><input type="checkbox" name="type" value="' + escape(type.id) + '" ' + (config.eligibleTypes.includes(type.id) ? 'checked' : '') + '>' + escape(type.label) + '</label>').join("") + '</div></div>' +
      '<label><span data-token-rules-label>' + '分配规则（可编辑）' + '</span><textarea name="rules" maxlength="2000" >' + escape(total && !batch && !config.rulesCustomized ? totalRules(config) : config.rules) + '</textarea></label><input type="hidden" name="rulesCustomized" value="' + Boolean(config.rulesCustomized) + '"><div><button type="button" class="mo-secondary" data-token-regenerate>重新生成规则</button><p>说明文字可编辑，不改变实际分配参数。重新生成会替换当前说明。</p></div>' +
      '<div class="mo-token-actions"><label class="mo-token-check"><input type="checkbox" name="enabled" ' + (config.enabled ? 'checked' : '') + '>公布激励池和规则</label><div><button type="submit">保存设置</button>' +
      (batch ? '' : '<button class="mo-secondary" type="button" data-token-calculate>预览分配</button>') + '</div></div></fieldset>' +
      (batch ? '<p class="mo-token-note">本季已确认分配，配置与积分快照已锁定。</p>' : '') + '</form>';
    if (!editing) $("[data-token-content]").innerHTML = '<section class="mo-token-editor"><h2>' + escape(config.label) + ' · ' + escape(config.provider || '赞助商待定') + '</h2><p><strong>' + config.amount + ' ' + escape((config.model ? config.model + ' ' : '') + config.unit) + '</strong></p><p>时间：' + escape(config.start || '待定') + '至' + escape(config.end || '待定') + (config.endInclusive ? '（含首尾两天）' : '（不含结束日）') + '</p><p>' + (config.enabled ? '已公布' : '未公布') + ' · ' + (total ? '赛季总积分' : '自定义计分') + ' · ' + (config.rewardRankLimit ? '前 ' + config.rewardRankLimit + ' 名，边界同分全部纳入' : '不限名次') + '</p><p style="white-space:pre-wrap;overflow-wrap:anywhere">' + escape(config.rules) + '</p><div class="mo-token-actions"><button type="button" data-token-edit>' + (batch ? '查看设置' : '编辑设置') + '</button>' + (batch ? '' : '<button type="button" data-token-calculate>预览分配</button>') + '</div></section>' + $("[data-token-content]").innerHTML;
    $("[data-token-records]").innerHTML = batch ? '<h2>发放记录</h2><p>只登记已实际完成的发放，不会自动发放。请勿填写 API 密钥。</p>' + table(batch.allocations, batch.config.unit, true) + '<p>未分配余量：' + batch.remaining + ' ' + escape(batch.config.unit) + '</p>' : "";
    $("[data-token-audits]").innerHTML = '<details><summary>最近操作记录</summary>' + payload.audits.map((audit) => '<p>' + escape(audit.created_at) + ' · ' + escape(audit.action.split("/")[0]) + ' · ' + escape(actionLabel[audit.action.split("/")[1]] || audit.action) + ' · ' + escape(audit.actor) + '</p>').join("") + '</details>';
    fitRules();
  }
  async function load() {
    if (!csrf) return;
    const current = ++generation;
    status("正在读取…");
    try {
      const result = await request();
      if (current !== generation || !csrf) return;
      payload = result; render(); status("已读取");
    } catch (error) { if (current === generation) status(error.message); }
  }
  async function act(action, body) {
    if (!csrf || busy) return;
    if (dirty && action !== "configure") { status("设置已修改，请先保存再预览分配"); return; }
    const key = selected(), current = generation;
    const signature = JSON.stringify({ key, action, body });
    const operationId = operations.get(signature) || globalThis.crypto.randomUUID();
    operations.set(signature, operationId);
    busy = true; root.setAttribute("aria-busy", "true"); status("正在提交…");
    try {
      const result = await request("/" + key + "/" + action, { ...body, operationId });
      if (current !== generation || !csrf || selected() !== key) return;
      operations.delete(signature);
      if (action === "preview") {
        preview = result;
        $("[data-token-preview]").innerHTML = '<h2>分配预览</h2>' + table(result.allocations, result.config.unit) + '<p>余量：' + result.remaining + '。确认后锁定本季配置与分配名单；此操作不会实际发放。</p><button type="button" data-token-confirm>确认本季分配</button>';
        status("请核对分配名单和额度");
      } else { if (action === "configure") editing = false; await load(); status(action === "receipt" ? "已登记发放凭据" : action === "confirm" ? "分配已锁定，尚未发放" : "设置已保存"); }
    } catch (error) { if (current === generation) status(error.message); }
    finally { busy = false; root.removeAttribute("aria-busy"); }
  }
  root.addEventListener("click", (event) => {
    if (busy) return;
    if (event.target.closest("[data-token-edit]")) { editing = true; render(); return; }
    regenerateRules(event);
    if (event.target.closest("[data-token-refresh]")) void load();
    if (event.target.closest("[data-token-calculate]")) void act("preview", {});
    if (event.target.closest("[data-token-confirm]") && preview && window.confirm("确认锁定本季分配名单和额度？确认后不可修改本季配置，尚不会实际发放。")) void act("confirm", { previewHash: preview.previewHash });
  });
  root.addEventListener("submit", (event) => {
    const form = event.target.closest("form");
    if (!form) return;
    event.preventDefault();
    if (busy || !payload) return;
    const data = new FormData(form);
    if (form.matches("[data-token-config]")) {
      const config = payload.seasons.find((item) => item.id === selected());
      const candidate = formConfig(form);
      if (candidate.distributionMode === "custom" && !candidate.eligibleTypes.length) { status("请至少选择一个计分类别"); return; }
      if (candidate.distributionMode === "season_total" && !candidate.rulesCustomized) candidate.rules = totalRules({ ...candidate, label: config.label });
      void act("configure", { revision: config.revision, config: candidate });
    } else if (form.matches("[data-token-receipt]") && window.confirm("确认已在供应商处完成真实发放？这里只登记凭据，不自动发放。")) {
      void act("receipt", { memberId: Number(form.dataset.tokenReceipt), receipt: data.get("receipt") });
    }
  });
  function editConfig(event) {
    const form = event.target.closest("[data-token-config]");
    if (!form || busy) return;
    dirty = true; preview = null; $("[data-token-preview]").innerHTML = "";
    if (event.target.name === "rules") form.querySelector('[name="rulesCustomized"]').value = "true";
    const config = formConfig(form), total = config.distributionMode === "season_total";
    $("[data-token-custom]").hidden = total;
    $("[data-token-rules-label]").textContent = "分配规则（可编辑）";
    const rules = form.querySelector('[name="rules"]');
    rules.readOnly = false;
    if (total && !config.rulesCustomized) rules.value = totalRules({ ...config, label: payload.seasons.find((item) => item.id === selected()).label });
    else if (!config.rulesCustomized && event.target.name === "distributionMode") rules.value = "按所选计分类别的有效积分占比分配，个人额度按整数最小单位向下取整，余量留在激励池，积分不扣减。";
    fitRules();
    status("设置已修改，请保存");
  }
  function regenerateRules(event) {
    if (!event.target.closest("[data-token-regenerate]") || busy) return;
    const form = root.querySelector("[data-token-config]");
    if (!form || form.querySelector("fieldset").disabled) return;
    if (!window.confirm("重新生成会替换当前规则说明，是否继续？")) return;
    form.querySelector('[name="rulesCustomized"]').value = "false";
    editConfig({ target: form.querySelector('[name="distributionMode"]') });
  }
  root.addEventListener("input", editConfig);
  root.addEventListener("change", editConfig);
  window.addEventListener?.("resize", fitRules);
  $("[data-token-season]").addEventListener("change", () => { generation += 1; if (payload) render(); });
  document.querySelector("[data-member-operations]").addEventListener("membership:open", (event) => {
    active = event?.detail?.view === "membership-token";
    if (active && csrf) void load();
  });
  document.addEventListener("operations:authenticated", (event) => {
    generation += 1; csrf = String(event.detail?.csrfToken || ""); if (active) void load();
  });
  document.addEventListener("operations:logout", reset);
})();
