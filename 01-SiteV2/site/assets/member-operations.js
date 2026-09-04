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
      adminUsers = adminUsers.map((item) => item.id === user.id ? user : item); renderAdminUsers(); renderAdminDetail(user); $("[data-mo-adjust-state]").textContent = "调整已保存并写入审计记录。";
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
    activeView = ["membership", "membership-community", "membership-approval", "membership-users", "membership-schedule"].includes(event?.detail?.view) ? event.detail.view : "membership";
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
