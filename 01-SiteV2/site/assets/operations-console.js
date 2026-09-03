(function () {
  const root = document.querySelector("[data-ops-console]");
  if (!root) return;
  const ops = window.WaveSightOpsConsole || {};
  const pipeline = window.WaveSightPipelineDashboard || {};
  const quality = ops.quality || {};
  const portfolio = ops.portfolio || {};
  const $ = (selector, node = document) => node.querySelector(selector);
  const $$ = (selector, node = document) => Array.from(node.querySelectorAll(selector));
  const html = (value) => String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const list = (value) => Array.isArray(value) ? value : [];
  const pct = (value) => value != null && Number.isFinite(Number(value)) ? Math.round(Number(value)) + "%" : "—";
  const storage = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } },
  };
  const validPanels = new Set(["overview", "analytics", "membership", "quality", "governance", "skills", "settings"]);
  const defaults = { landing: "overview", compact: false, staleHours: 72 };
  let preferences = { ...defaults };
  try {
    const saved = JSON.parse(storage.get("guanlan-ops-preferences") || "{}");
    preferences = { landing: validPanels.has(saved.landing) ? saved.landing : defaults.landing, compact: saved.compact === true, staleHours: [24, 48, 72].includes(saved.staleHours) ? saved.staleHours : 72 };
  } catch { /* Corrupt or unavailable storage must not prevent opening the console. */ }
  const state = { panel: location.hash.slice(1) || preferences.landing, railCollapsed: storage.get("wavesight-rail-collapsed") === "1" };
  const timestamp = (value) => {
    const date = new Date(value);
    return value && Number.isFinite(date.getTime()) ? date.toLocaleString("zh-CN", { hour12: false }) : "未记录";
  };
  const stale = (value) => !value || !Number.isFinite(Date.parse(value)) || Date.now() - Date.parse(value) > preferences.staleHours * 3600000;
  const badge = (label, good = false) => '<span class="badge ' + (good ? "is-green" : "is-blue") + '">' + html(label) + "</span>";
  const safeLink = (url, label) => /^(https:\/\/(www\.zkdlj\.vip|members\.zkdlj\.vip)\/|data-center\.html$)/u.test(url || "")
    ? '<a href="' + html(url) + '" target="_blank" rel="noopener noreferrer">' + html(label) + ' ↗</a>' : html(label);
  const metric = (label, value, note) => '<article class="card metric"><span class="label">' + html(label) + "</span><strong>" + html(value ?? "—") + "</strong><em>" + html(note) + "</em></article>";
  const row = (label, value, percent) => '<div class="row"><span>' + html(label) + '</span><span class="bar"><i style="width:' + Math.max(3, Math.min(100, Number(percent) || 0)) + '%"></i></span><b>' + html(value) + "</b></div>";
  function versionStatus(item) {
    if (item.kind === "deployed" && stale(item.checkedAt)) return "核验已过期 · 需刷新";
    return item.status || "未接入";
  }
  function setPanel(id) {
    state.panel = validPanels.has(id) ? id : "overview";
    $$("[data-tab]").forEach((button) => button.setAttribute("aria-current", String(button.dataset.tab === state.panel)));
    $$("[data-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === state.panel));
    history.replaceState(null, "", "#" + state.panel);
    if (state.panel === "analytics") $("[data-application-analytics]")?.dispatchEvent(new Event("analytics:open"));
    if (state.panel === "membership") $("[data-member-operations]")?.dispatchEvent(new Event("membership:open"));
    if (state.panel === "skills") resizeSkillFrame();
  }
  function setRailCollapsed(collapsed) {
    state.railCollapsed = collapsed;
    root.classList.toggle("is-rail-collapsed", collapsed);
    storage.set("wavesight-rail-collapsed", collapsed ? "1" : "0");
    const toggle = $("[data-rail-toggle]");
    if (toggle) { toggle.textContent = collapsed ? "展开" : "收起"; toggle.setAttribute("aria-expanded", String(!collapsed)); }
  }
  function resizeSkillFrame(height) {
    const frame = $(".skill-frame");
    if (!frame) return;
    let measured = Number(height) || 0;
    if (!measured) try { measured = frame.contentDocument?.documentElement?.scrollHeight || 0; } catch { /* Isolated frame. */ }
    frame.style.height = Math.max(720, measured + 24) + "px";
  }
  function renderOverview() {
    const platforms = list(portfolio.platforms);
    const versions = list(ops.governance?.versions);
    const sourceRows = list(quality.sourceQuality?.rows);
    $("[data-overview-status]").innerHTML = [
      metric("运营平台", platforms.length || null, "数据中心 / 融资站 / 小程序 / H5 / 社群"),
      metric("最新批次事实", quality.telemetry?.factBuild?.canonical_events, ops.meta?.date || "未读取到数据批次"),
      metric("来源质量", sourceRows.length || null, "逐来源数量、可用率与质量评分"),
      metric("Skill 目录", portfolio.skills?.total, "登记数量 ≠ 全局启用数量"),
    ].join("");
    $("[data-platform-cards]").innerHTML = platforms.map((platform) => {
      const version = platform.version || {};
      return '<article class="card platform-card"><div class="platform-top"><span class="label">' + html(platform.id) + "</span>" + badge(versionStatus(version), version.verified && !stale(version.checkedAt)) + "</div><h2>" + html(platform.label) + "</h2><p>" + html(platform.scope) + '</p><strong class="platform-version">' + html(version.value || "未登记") + '</strong><p class="platform-note">' + html(platform.analytics) + '</p><div class="platform-bottom">' + (platform.url ? safeLink(platform.url, "打开平台") : "<span>独立客户端 / 部署待接入</span>") + '<button class="text-button" type="button" data-version-key="' + html(platform.versionKey) + '">版本详情 →</button></div></article>';
    }).join("") || '<div class="empty">跨平台清单尚未生成，请检查系统设置中的快照状态。</div>';
    const gaps = [
      ["线上核验", versions.filter((item) => item.kind === "deployed" && (!item.verified || stale(item.checkedAt))).length + " 项公开版本需要重新核验；小程序审核版本、融资 H5 部署版本尚未接入。", "governance"],
      ["会员与权益", "社群申请审批、参与和应用会员权益均已接入；社群续费、线下核销仍待接入，两套系统不合并计数。", "membership"],
      ["规则同步", list(portfolio.skills?.sources).filter((source) => source.required === false && !source.available).length + " 个平台目录尚未接入。共享规则与独立来源分开计数，完整状态见 Skill Store。", "skills"],
    ];
    $("[data-coverage-gaps]").innerHTML = gaps.map(([title, detail, panel]) => '<article class="card"><h3>' + html(title) + "</h3><p>" + html(detail) + '</p><button class="text-button" type="button" data-tab="' + panel + '">查看详情 →</button></article>').join("");
    $("[data-overview-stamp]").textContent = "后台快照 " + timestamp(ops.meta?.generatedAt) + " · " + (stale(ops.meta?.generatedAt) ? "已超过本机时效阈值" : "在本机时效阈值内") + "；并非实时在线监控";
  }

  function renderDashboard() {
    const timeline = $("[data-daily-timeline]");
    if (timeline) {
      const days = list(quality.days || pipeline.days).slice(0, 4);
      timeline.innerHTML = days.map((day, index) => {
        const detailRows = [
          row("Entities", day.entities || 0, Math.min(100, Number(day.entities || 0))),
          row("Relationships", day.relationships || 0, Math.min(100, Number(day.relationships || 0))),
          row("Conflicts", day.conflicts || 0, Math.min(100, Number(day.conflicts || 0) * 20)),
          row("QA Queue", day.qaQueue || 0, Math.min(100, Number(day.qaQueue || 0))),
        ].join("");
        return `<article class="card day-card ${index === 0 ? "is-latest" : ""}"><div class="day-date"><span>${html(day.label || day.date)}</span><b>${index === 0 ? "最新数据批次" : "V4 数据批次"}</b></div><div class="day-numbers"><span>SOURCES<b>${html(day.discovered || 0)}</b></span><span>CLAIMS<b>${html(day.claims || 0)}</b></span><span>EVENTS<b>${html(day.events || 0)}</b></span></div><div class="rows">${detailRows}</div></article>`;
      }).join("");
    }
    const sourceQuality = $("[data-source-quality]");
    if (sourceQuality) {
      const collection = quality.telemetry?.collection || {};
      const facts = quality.telemetry?.factBuild || {};
      const discovered = Number(collection.discovered || 0);
      const captured = Number(collection.capture_succeeded || 0);
      const sourceRows = list(quality.sourceQuality?.rows);
      const summary = `<div class="source-summary">
        <span>发现<b>${html(discovered)}</b></span>
        <span>抓取成功<b>${html(captured)}</b></span>
        <span>抓取失败<b>${html(collection.capture_failed || 0)}</b></span>
        <span>Accepted Claims<b>${html(facts.accepted_claims || 0)}</b></span>
        <span>QA Queue<b>${html(facts.qa_queue || 0)}</b></span>
      </div>`;
      const detail = sourceRows.length ? sourceRows.map((item) => `
        <div class="source-row">
          <div class="source-name"><strong>${html(item.label || item.id)}</strong><em>${html(item.acceptedClaims || 0)} Claims · ${html(item.canonicalEvents || 0)} Events</em></div>
          <div class="mini-kpi"><span>样本量</span><b>${html(item.total || 0)}</b></div>
          <div class="mini-kpi"><span>可用率</span><b>${html(pct(item.eligibleRate))}</b></div>
          <div class="mini-kpi"><span>全文率</span><b>${html(pct(item.fullTextRate))}</b></div>
          <div class="mini-kpi"><span>高质提取</span><b>${html(pct(item.highQualityRate))}</b></div>
          <div class="mini-kpi"><span>事实命中</span><b>${html(pct(item.factHitRate))}</b></div>
          <div class="score-pill" title="诊断质量分，不参与来源准入或事实门禁">${html(item.grade)} · ${html(item.score)}</div>
        </div>`).join("") : `<div class="empty">未读取到逐来源 V4 质量数据。</div>`;
      const note = quality.sourceQuality?.metricNote
        ? `<p class="source-quality-note">${html(quality.sourceQuality.metricNote)}</p>`
        : "";
      sourceQuality.innerHTML = `${summary}${detail}${note}`;
    }
    const matrix = $("[data-asset-matrix]");
    if (matrix) {
      const facts = quality.telemetry?.factBuild || {};
      matrix.innerHTML = [
        ["Canonical Events", facts.canonical_events],
        ["Entities", facts.entities],
        ["Relationships", facts.relationships],
        ["Conflicts", facts.conflicts],
        ["QA Queue", facts.qa_queue],
      ].map(([label, value], index) => `<article class="card asset-card ${index === 0 ? "asset-main" : ""}"><span class="label">${html(label)}</span><strong>${html(value || 0)}</strong><p>来自 COLLECTION-TELEMETRY-V1，不读取 V3 Card 或旧 graph。</p></article>`).join("");
    }
  }


  function renderProduction() {
    const labels = { collection: "采集", fact_build: "事实构建", application_projection: "应用投影", publication: "发布" };
    $("[data-production-stages]").innerHTML = list(ops.tasks?.stages).map((stage) => '<article class="card"><span class="label">' + html(stage.id) + '</span><h3>' + html(labels[stage.id] || stage.label) + '</h3>' + badge(stage.status || "unknown", ["passed", "success", "completed"].includes(stage.status)) + '</article>').join("") || '<div class="empty">尚无生产阶段遥测。</div>';
  }
  function renderGovernance() {
    const versions = list(ops.governance?.versions);
    const category = $("[data-version-category]").value;
    const query = $("[data-version-search]").value.trim().toLowerCase();
    const filtered = versions.filter((item) => (!category || item.category === category) && (!query || [item.key, item.label, item.value, item.source].join(" ").toLowerCase().includes(query)));
    $("[data-version-count]").textContent = filtered.length + " / " + versions.length + " 项；源码与线上核验独立标注";
    $("[data-version-cards]").innerHTML = filtered.map((item) => '<article class="card version-card"><div class="platform-top"><span class="label">' + html(item.category + " / " + item.key) + "</span>" + badge(versionStatus(item), item.verified && !stale(item.checkedAt)) + "</div><h3>" + html(item.label) + '</h3><strong class="platform-version">' + html(item.value || "未登记") + '</strong><p class="version-source">来源：' + safeLink(item.source, item.source) + "</p><p>上次核验：" + (item.kind === "source" ? "仓库构建时读取 · 非线上证明" : timestamp(item.checkedAt)) + "</p></article>").join("") || '<div class="empty">没有匹配的版本，请调整分类或搜索词。</div>';
    $("[data-governance-principles]").innerHTML = list(ops.governance?.principles).map((item) => '<li>' + html(item) + '</li>').join("");
  }
  function renderSettings() {
    const rows = [
      ["后台快照", timestamp(ops.meta?.generatedAt), "随仓库构建与 Pages 发布更新"],
      ["数据质量批次", ops.meta?.date || "未接入", "V4 逐来源采集与事实构建快照"],
      ["Skill 同步", timestamp(portfolio.skills?.generatedAt), "本地构建扫描已登记平台目录，发布后可见；网页不安装 Skill"],
      ["运营聚合 API", portfolio.analytics?.url || "未接入", portfolio.analytics?.scope || ""],
      ["社群会员汇总", "https://members.zkdlj.vip/api/v1/operations/membership-summary", "按需只读 · 正式入群、分享参与、累计积分分布"],
      ["应用会员汇总", "https://www.zkdlj.vip/ops/application-membership-summary", "登录后只读 · 会员到期、未退款订单、积分兑换"],
      ...list(portfolio.platforms).filter((item) => item.version?.kind === "deployed").map((item) => [item.label, item.version.source, versionStatus(item.version) + " · " + timestamp(item.version.checkedAt)]),
    ];
    $("[data-data-status]").innerHTML = rows.map(([label, value, detail]) => '<div class="data-status-item"><span>' + html(label) + '</span><div><b>' + safeLink(value, value) + '</b><p>' + html(detail) + '</p></div></div>').join("");
    $("[data-setting-landing]").value = preferences.landing;
    $("[data-setting-compact]").checked = preferences.compact;
    $("[data-setting-stale]").value = String(preferences.staleHours);
    root.classList.toggle("is-compact", preferences.compact);
  }
  root.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) setPanel(tab.dataset.tab);
    if (event.target.closest("[data-rail-toggle]")) setRailCollapsed(!state.railCollapsed);
    const version = event.target.closest("[data-version-key]");
    if (version) {
      $("[data-version-category]").value = "";
      $("[data-version-search]").value = version.dataset.versionKey;
      renderGovernance();
      setPanel("governance");
    }
    if (event.target.closest("[data-reload-snapshot]")) location.reload();
    if (event.target.closest("[data-reset-preferences]")) {
      preferences = { ...defaults };
      const saved = storage.set("guanlan-ops-preferences", JSON.stringify(preferences));
      renderSettings(); renderOverview(); renderGovernance();
      $("[data-setting-status]").textContent = saved ? "已恢复本机默认设置。" : "已临时恢复；浏览器不允许保存设置。";
    }
  });
  $("[data-preferences-form]").addEventListener("submit", (event) => {
    event.preventDefault();
    preferences = { landing: $("[data-setting-landing]").value, compact: $("[data-setting-compact]").checked, staleHours: Number($("[data-setting-stale]").value) };
    const saved = storage.set("guanlan-ops-preferences", JSON.stringify(preferences));
    renderSettings(); renderOverview(); renderGovernance();
    $("[data-setting-status]").textContent = saved ? "已保存，仅对本机浏览器生效。" : "已临时应用；浏览器不允许保存设置。";
  });
  $("[data-version-category]").addEventListener("change", renderGovernance);
  $("[data-version-search]").addEventListener("input", renderGovernance);
  $(".skill-frame")?.addEventListener("load", () => resizeSkillFrame());
  window.addEventListener("message", (event) => {
    if (event.origin === location.origin && event.source === $(".skill-frame")?.contentWindow && event.data?.type === "wavesight-skill-store-height") resizeSkillFrame(event.data.height);
  });
  window.addEventListener("hashchange", () => setPanel(location.hash.slice(1) || preferences.landing));
  let initialized = false;
  document.addEventListener("operations:authenticated", () => {
    if (initialized) return;
    initialized = true;
    renderOverview(); renderDashboard(); renderProduction(); renderGovernance(); renderSettings();
    setRailCollapsed(state.railCollapsed);
    setPanel(state.panel);
  });
})();
