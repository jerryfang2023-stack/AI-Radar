(() => {
  const API_URL = "https://www.zkdlj.vip/api/v1/admin/analytics/summary";
  const TOKEN_KEY = "wavesight_analytics_admin_token";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const state = { days: 7, platform: "all", token: sessionStorage.getItem(TOKEN_KEY) || "" };
  const number = (value) => new Intl.NumberFormat("zh-CN").format(Number(value || 0));
  const currency = (value) => new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 0 }).format(Number(value || 0) / 100);
  const percent = (value) => `${(Number(value || 0) * 100).toFixed(1)}%`;
  const duration = (seconds) => seconds >= 60 ? `${Math.floor(seconds / 60)}分${Math.round(seconds % 60)}秒` : `${Math.round(seconds || 0)}秒`;
  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));

  function setLoading(loading) {
    $("[data-skeleton]").hidden = !loading;
    $("[data-content]").hidden = loading;
    $("[data-refresh]").disabled = loading;
    if (loading) $("[data-status]").textContent = "正在读取运营数据…";
  }
  function showError(message) {
    setLoading(false);
    $("[data-content]").hidden = true;
    const status = $("[data-status]");
    status.textContent = message;
    status.classList.add("is-error");
  }
  function renderKpis(data) {
    const value = data.overview;
    const items = [
      ["访客数", number(value.visitors), "周期内去重访客"],
      ["会话数", number(value.sessions), "30 分钟无操作切分"],
      ["页面浏览", number(value.pageViews), `跳出率 ${percent(value.bounceRate)}`],
      ["新注册", number(value.newRegistrations), `注册转化 ${percent(value.registrationRate)}`],
      ["付费订单", number(value.paidOrders), `付费转化 ${percent(value.paymentRate)}`],
      ["净收入", currency(value.netRevenueCents), `退款 ${currency(value.refundAmountCents)}`],
      ["平均会话", duration(value.averageSessionSeconds), "反映访问深度"],
      ["近 30 分钟", number(value.activeVisitors30m), "当前活跃访客"],
    ];
    $("[data-kpis]").innerHTML = items.map(([label, amount, note]) => `<article class="aa-kpi"><span>${escapeHtml(label)}</span><strong>${escapeHtml(amount)}</strong><small>${escapeHtml(note)}</small></article>`).join("");
    $("[data-active-now]").textContent = number(value.activeVisitors30m);
  }
  function points(values, width, height, padding, maximum) {
    const max = Math.max(1, maximum || 0);
    const step = values.length > 1 ? (width - padding * 2) / (values.length - 1) : 0;
    return values.map((value, index) => `${padding + index * step},${height - padding - (value / max) * (height - padding * 2)}`).join(" ");
  }
  function renderTrend(data) {
    const rows = data.trend || [];
    if (!rows.length) { $("[data-trend-chart]").innerHTML = '<p class="aa-empty">当前周期暂无数据，监测接入后会自动更新。</p>'; return; }
    const width = 760, height = 220, padding = 28;
    const maximum = Math.max(1, ...rows.flatMap((item) => [item.visitors, item.pageViews]));
    const labels = rows.filter((_, index) => index === 0 || index === rows.length - 1 || index % Math.max(1, Math.ceil(rows.length / 5)) === 0);
    const labelHtml = labels.map((row) => {
      const index = rows.indexOf(row);
      const x = padding + (rows.length > 1 ? index * (width - padding * 2) / (rows.length - 1) : 0);
      return `<text class="aa-chart-label" x="${x}" y="214" text-anchor="middle">${escapeHtml(row.date.slice(5))}</text>`;
    }).join("");
    $("[data-trend-chart]").innerHTML = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="每日访客与页面浏览趋势"><line class="aa-chart-grid" x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}"/><line class="aa-chart-grid" x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}"/><polyline class="aa-chart-line" points="${points(rows.map((item) => item.visitors), width, height, padding, maximum)}"/><polyline class="aa-chart-line views" points="${points(rows.map((item) => item.pageViews), width, height, padding, maximum)}"/>${labelHtml}</svg><div class="aa-chart-legend"><span><i></i>访客</span><span><i class="views"></i>页面浏览</span></div>`;
  }
  function renderFunnel(data) {
    const funnel = data.funnel || [];
    const base = Math.max(1, funnel[0]?.count || 0);
    $("[data-funnel]").innerHTML = funnel.map((item) => `<div class="aa-funnel-row"><span>${escapeHtml(item.label)}</span><div class="aa-funnel-bar"><i style="width:${Math.max(0, Math.min(100, item.count / base * 100))}%"></i></div><small>${number(item.count)}</small></div>`).join("") || '<p class="aa-empty">当前周期暂无漏斗数据。</p>';
  }
  function renderTable(selector, rows, content = false) {
    $(selector).innerHTML = rows.length ? rows.map((item) => `<div class="aa-table-row"><strong title="${escapeHtml(content ? item.title : item.page)}">${escapeHtml(content ? item.title : item.page)}</strong><span>${number(item.views)} 次</span><span>${number(item.visitors)} 人</span></div>`).join("") : '<p class="aa-empty">当前周期暂无数据，监测接入后会自动更新。</p>';
  }
  function renderPlatforms(data) {
    const labels = { miniprogram: "小程序", pc: "PC 融资站" };
    $("[data-platforms]").innerHTML = (data.platforms || []).map((item) => `<article class="aa-platform"><span>${labels[item.platform] || item.platform}</span><strong>${number(item.visitors)} 位访客</strong></article>`).join("");
  }
  function render(data) {
    renderKpis(data);
    renderTrend(data);
    renderFunnel(data);
    renderTable("[data-top-pages]", data.topPages || []);
    renderTable("[data-top-content]", data.topContent || [], true);
    renderPlatforms(data);
    $("[data-generated-at]").textContent = `更新于 ${new Date(data.generatedAt).toLocaleString("zh-CN", { hour12: false })}`;
    $("[data-status]").textContent = "";
    $("[data-status]").classList.remove("is-error");
    setLoading(false);
    $("[data-content]").hidden = false;
  }
  async function load() {
    if (!state.token) return;
    setLoading(true);
    try {
      const url = `${API_URL}?days=${state.days}&platform=${encodeURIComponent(state.platform)}`;
      const response = await fetch(url, { headers: { Authorization: `Bearer ${state.token}` }, cache: "no-store" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error?.message || "数据读取失败");
      render(payload);
    } catch (error) {
      if (/令牌|访问/.test(error.message)) {
        sessionStorage.removeItem(TOKEN_KEY);
        state.token = "";
        $("[data-dashboard]").hidden = true;
        $("[data-auth-panel]").hidden = false;
        $("[data-auth-error]").textContent = error.message;
      } else showError(`${error.message}，请检查服务状态后重试。`);
    }
  }
  $("[data-auth-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    state.token = new FormData(event.currentTarget).get("token").trim();
    sessionStorage.setItem(TOKEN_KEY, state.token);
    $("[data-auth-error]").textContent = "";
    $("[data-auth-panel]").hidden = true;
    $("[data-dashboard]").hidden = false;
    load();
  });
  $$('[data-days]').forEach((button) => button.addEventListener("click", () => {
    state.days = Number(button.dataset.days);
    $$('[data-days]').forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    load();
  }));
  $("[data-platform]").addEventListener("change", (event) => { state.platform = event.target.value; load(); });
  $("[data-refresh]").addEventListener("click", load);
  $("[data-exit]").addEventListener("click", () => {
    sessionStorage.removeItem(TOKEN_KEY);
    state.token = "";
    $("[data-dashboard]").hidden = true;
    $("[data-auth-panel]").hidden = false;
    $("#analytics-token").value = "";
  });
  const navToggle = $("[data-nav-toggle]");
  navToggle.addEventListener("click", () => {
    const open = $("[data-sidebar]").classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  if (state.token) {
    $("[data-auth-panel]").hidden = true;
    $("[data-dashboard]").hidden = false;
    load();
  }
})();
