(function () {
  const root = document.querySelector("[data-member-operations]");
  if (!root) return;
  const $ = (selector) => root.querySelector(selector);
  const endpoints = {
    community: "https://members.zkdlj.vip/api/v1/operations/membership-summary",
    application: "https://www.zkdlj.vip/api/v1/analytics/membership/summary",
    adminAuth: "https://www.zkdlj.vip/api/v1/admin/auth",
    adminUsers: "https://www.zkdlj.vip/api/v1/admin/analytics/membership/users",
  };
  const definitions = {
    community: [
      ["joinedMembers", "正式入群", "当前审核通过且已登记入群日期"],
      ["newJoinedMembers", "新增入群", "所选期间入群的当前正式成员"],
      ["awaitingJoin", "审核通过待入群", "尚未登记有效入群日期"],
      ["participants", "分享参与成员", "当期活动记录匹配到的正式成员去重"],
      ["speakers", "分享者", "当期嘉宾匹配到的正式成员去重"],
      ["participations", "参与人次", "同一期每位成员只计一次"],
      ["issues", "分享期数", "按期号去重；不含未来排期"],
      ["expiring7d", "即将到期", "社群尚无会员到期字段"],
      ["renewals", "社群续费", "社群尚无续费记录"],
    ],
    application: [
      ["accounts", "应用账户", "小程序 / PC 共用账户；剔除被合并账户"],
      ["activeEntitlements", "有效会员权益", "当前会员期限未到；含付费与积分兑换"],
      ["expiring7d", "7 天内到期", "有效会员权益中，未来 7 天到期账户"],
      ["newAccounts", "新增账户", "所选期间创建；不等于新增付费会员"],
      ["firstPaidAccounts", "首次付费", "首笔未退款的服务端确认订单在当期"],
      ["repeatPaidAccounts", "再次购买", "当期存在第二笔及以后未退款订单；非自动续费"],
      ["engagedAccounts", "有行为记录账户", "当期签到 / 阅读 / 收藏任务记录去重"],
      ["trialAccounts", "试用中", "试用未到期且无有效会员权益"],
      ["redemptions", "积分兑换次数", "当期已入账的积分兑换记录"],
      ["redeemingAccounts", "兑换账户", "当期兑换账户去重"],
      ["redeemedPoints", "已兑换积分", "当期兑换实际扣减积分；非社群积分总额"],
      ["offlineClaims", "线下权益核销", "线下领取、核销记录待接入"],
    ],
  };
  let days = 30, generation = 0, loaded = false;
  let adminSessionToken = "", adminCsrfToken = "", adminChallengeId = "", adminPage = 1, adminPages = 1, adminUsers = [], selectedUserId = null;
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
    let content = '<div class="mo-grid">' + definitions[source].map(([key, label, note]) => '<article class="mo-metric"><h3>' + label + '</h3><strong' + (metrics[key] == null ? ' class="mo-missing"' : '') + '>' + number(metrics[key]) + '</strong><p>' + note + '</p></article>').join("") + '</div>';
    const buckets = payload.pointBuckets;
    content += '<div class="mo-distributions">' + distribution(source === "community" ? "社群累计积分分布" : "应用可用积分分布", [
      [source === "community" ? "≤ 0 分" : "0 分", buckets.zero], [source === "community" ? "1–29 分" : "1–299 分", buckets.low],
      [source === "community" ? "30–99 分" : "300–999 分", buckets.mid], [source === "community" ? "≥ 100 分" : "≥ 1,000 分", buckets.high],
    ]);
    if (source === "application") content += distribution("有效权益账户 · 最近付费套餐", [["月度", payload.tiers.monthly], ["半年", payload.tiers.half_year], ["年度", payload.tiers.annual], ["兑换 / 其他", payload.tiers.other]]);
    content += '</div>';
    if (source === "community") content += '<p class="mo-note">当期有 ' + number(metrics.unresolvedParticipants) + ' 个活动昵称未能唯一匹配正式成员，未计入参与人数。积分排除已退出积分统计的成员；同一期活动取最高分，再加人工加减分，不改变业务积分账本。</p>';
    else content += '<p class="mo-note">套餐按当前有效权益账户最近一笔未退款订单分类，并非当前权益来源拆账。首次付费 / 再次购买均排除已退款订单；此页不提供自动续费。应用可用积分可能包含社群同步值，不与社群积分相加。</p>';
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
      const response = await fetch(endpoints[source] + "?days=" + selectedDays, { method: "GET", credentials: "omit", cache: "no-store", signal: controller.signal });
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
  function adminHeaders(json = false, write = false) { return { Authorization: "Bearer " + adminSessionToken, ...(write ? { "X-CSRF-Token": adminCsrfToken } : {}), ...(json ? { "Content-Type": "application/json" } : {}) }; }
  function setAdminConnected(connected) { $("[data-mo-admin-auth]").hidden = connected; $("[data-mo-admin-console]").hidden = !connected; }
  function setChallengeActive(active) { $("[data-mo-admin-email-form]").hidden = active; $("[data-mo-admin-code-form]").hidden = !active; }
  function resetAdminSession(message) {
    adminSessionToken = ""; adminCsrfToken = ""; adminChallengeId = ""; adminUsers = []; selectedUserId = null;
    $("[data-mo-admin-code]").value = ""; $("[data-mo-admin-detail]").innerHTML = "";
    setChallengeActive(false); setAdminConnected(false); $("[data-mo-admin-auth-status]").textContent = message;
  }
  function adminFailure(message, reset = false) {
    $("[data-mo-admin-state]").textContent = message;
    $("[data-mo-admin-users]").innerHTML = '<tr><td colspan="6"><div class="mo-empty">' + escape(message) + '</div></td></tr>';
    if (reset) resetAdminSession(message);
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
  async function requestAdminCode(event) {
    event.preventDefault();
    const input = $("[data-mo-admin-email]"), button = $("[data-mo-admin-send]");
    const email = String(input.value || "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $("[data-mo-admin-auth-status]").textContent = "请输入有效的管理员邮箱。"; return; }
    button.disabled = true; $("[data-mo-admin-auth-status]").textContent = "正在发送邮箱验证码…";
    try {
      const response = await fetch(endpoints.adminAuth + "/challenges", { method: "POST", credentials: "omit", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(String(payload?.error?.message || "验证码发送失败").slice(0, 120));
      if (payload?.schemaVersion !== "OPS-AUTH-V1.0" || typeof payload.challengeId !== "string" || payload.challengeId.length < 20) throw new Error("登录响应校验失败");
      adminChallengeId = payload.challengeId; input.value = ""; setChallengeActive(true);
      $("[data-mo-admin-auth-status]").textContent = "验证码已发送至 " + String(payload.emailMasked || "管理员邮箱") + "，10 分钟内有效。";
    } catch (error) { $("[data-mo-admin-auth-status]").textContent = error.message || "验证码发送失败"; }
    finally { button.disabled = false; }
  }
  async function verifyAdminCode(event) {
    event.preventDefault();
    const input = $("[data-mo-admin-code]"), button = $("[data-mo-admin-verify]");
    const code = String(input.value || "").trim(); input.value = "";
    if (!adminChallengeId || !/^\d{6}$/.test(code)) { $("[data-mo-admin-auth-status]").textContent = "请输入 6 位邮箱验证码。"; return; }
    button.disabled = true; $("[data-mo-admin-auth-status]").textContent = "正在建立安全会话…";
    try {
      const response = await fetch(endpoints.adminAuth + "/challenges/" + encodeURIComponent(adminChallengeId) + "/verify", { method: "POST", credentials: "omit", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(String(payload?.error?.message || "验证码验证失败").slice(0, 120));
      if (payload?.schemaVersion !== "OPS-AUTH-V1.0" || typeof payload.sessionToken !== "string" || payload.sessionToken.length < 32 || typeof payload.csrfToken !== "string" || payload.csrfToken.length < 20) throw new Error("登录响应校验失败");
      adminSessionToken = payload.sessionToken; adminCsrfToken = payload.csrfToken; adminChallengeId = ""; adminPage = 1;
      setAdminConnected(true); await loadAdminUsers();
    } catch (error) { $("[data-mo-admin-auth-status]").textContent = error.message || "验证码验证失败"; }
    finally { button.disabled = false; }
  }
  async function disconnectAdmin() {
    const token = adminSessionToken, csrf = adminCsrfToken;
    resetAdminSession("已退出用户明细，浏览器内存中的管理员会话已清除。");
    if (!token || !csrf) return;
    try { await fetch(endpoints.adminAuth + "/logout", { method: "POST", credentials: "omit", cache: "no-store", headers: { Authorization: "Bearer " + token, "X-CSRF-Token": csrf } }); } catch { /* Local session is cleared even if remote revocation is temporarily unavailable. */ }
  }
  async function loadAdminUsers() {
    const query = encodeURIComponent($("[data-mo-admin-query]").value || ""), status = encodeURIComponent($("[data-mo-admin-status]").value || "all");
    $("[data-mo-admin-state]").textContent = "正在读取小程序用户…"; $("[data-mo-admin-users]").innerHTML = '<tr><td colspan="6"><div class="mo-empty">正在加载受保护的用户明细…</div></td></tr>';
    try {
      const response = await fetch(endpoints.adminUsers + "?query=" + query + "&status=" + status + "&page=" + adminPage + "&pageSize=20", { method: "GET", headers: adminHeaders(), credentials: "omit", cache: "no-store" });
      if (response.status === 401 || response.status === 503) return adminFailure("管理员会话已失效或服务未配置，请重新验证。", true);
      if (!response.ok) throw new Error("用户明细暂不可用");
      const payload = await response.json();
      if (payload?.schemaVersion !== "MEMBER-ADMIN-V1.0" || payload.dataSource !== "production" || !Array.isArray(payload.users) || !Number.isSafeInteger(payload.page?.totalPages)) throw new Error("用户数据校验失败");
      const users = payload.users.map(safeAdminUser); if (users.some((item) => !item)) throw new Error("用户数据校验失败");
      adminUsers = users; adminPage = payload.page.number; adminPages = Math.max(1, payload.page.totalPages);
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
      const response = await fetch(endpoints.adminUsers + "/" + selectedUserId + "/adjustments", { method: "POST", headers: adminHeaders(true, true), credentials: "omit", cache: "no-store", body: JSON.stringify(body) });
      const payload = await response.json(); if (response.status === 401 || response.status === 403 || response.status === 503) return adminFailure("管理员会话已失效，请重新验证。", true);
      if (!response.ok) throw new Error(String(payload?.error?.message || "调整未成功").slice(0, 120));
      const user = safeAdminUser(payload?.user); if (payload?.schemaVersion !== "MEMBER-ADMIN-V1.0" || !user) throw new Error("调整结果校验失败");
      adminUsers = adminUsers.map((item) => item.id === user.id ? user : item); renderAdminUsers(); renderAdminDetail(user); $("[data-mo-adjust-state]").textContent = "调整已保存并写入审计记录。";
    } catch (error) { state.textContent = error.message || "调整未成功"; } finally { button.disabled = false; }
  }
  $("[data-mo-days]").addEventListener("change", (event) => {
    const value = Number(event.target.value);
    days = [7, 30, 90].includes(value) ? value : 30;
    refresh();
  });
  $("[data-mo-refresh]").addEventListener("click", refresh);
  $("[data-mo-admin-email-form]").addEventListener("submit", requestAdminCode);
  $("[data-mo-admin-code-form]").addEventListener("submit", verifyAdminCode);
  $("[data-mo-admin-restart]").addEventListener("click", () => { adminChallengeId = ""; $("[data-mo-admin-code]").value = ""; setChallengeActive(false); $("[data-mo-admin-auth-status]").textContent = "请输入已授权的管理员邮箱。"; });
  $("[data-mo-admin-search-form]").addEventListener("submit", (event) => { event.preventDefault(); adminPage = 1; void loadAdminUsers(); });
  $("[data-mo-admin-status]").addEventListener("change", () => { adminPage = 1; void loadAdminUsers(); });
  $("[data-mo-admin-prev]").addEventListener("click", () => { if (adminPage > 1) { adminPage -= 1; void loadAdminUsers(); } });
  $("[data-mo-admin-next]").addEventListener("click", () => { if (adminPage < adminPages) { adminPage += 1; void loadAdminUsers(); } });
  $("[data-mo-admin-disconnect]").addEventListener("click", () => { void disconnectAdmin(); });
  $("[data-mo-admin-users]").addEventListener("click", (event) => { const button = event.target.closest("[data-mo-user-id]"); if (!button) return; const user = adminUsers.find((item) => item.id === Number(button.dataset.moUserId)); if (user) renderAdminDetail(user); });
  $("[data-mo-admin-detail]").addEventListener("submit", (event) => { const form = event.target.closest("[data-mo-adjust]"); if (!form) return; event.preventDefault(); void submitAdjustment(form); });
  root.addEventListener("membership:open", () => { if (!loaded) refresh(); });
  setChallengeActive(false);
  if (root.classList.contains("is-active")) refresh();
})();
