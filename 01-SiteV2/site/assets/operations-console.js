(function () {
  const root = document.querySelector("[data-ops-console]");
  if (!root) return;

  const ops = window.WaveSightOpsConsole || {};
  const pipeline = window.WaveSightPipelineDashboard || {};
  const quality = ops.quality || {};
  const latest = quality.latest || pipeline.latest || {};
  const totals = quality.totals || pipeline.totals || {};
  const state = {
    panel: location.hash ? location.hash.slice(1) : "overview",
    railCollapsed: localStorage.getItem("wavesight-rail-collapsed") === "1",
  };
  const validPanels = new Set(["overview", "issues", "tasks", "quality", "governance", "skills", "settings"]);

  const $ = (selector, node = document) => node.querySelector(selector);
  const $$ = (selector, node = document) => Array.from(node.querySelectorAll(selector));
  const text = (value) => value == null ? "" : String(value);
  const html = (value) => text(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  const pct = (value) => Number.isFinite(Number(value)) ? `${Math.round(Number(value))}%` : "-";
  const list = (value) => Array.isArray(value) ? value : [];

  function setPanel(id) {
    state.panel = validPanels.has(id) ? id : "overview";
    $$("[data-tab]").forEach((button) => button.setAttribute("aria-current", String(button.dataset.tab === state.panel)));
    $$("[data-panel]").forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === state.panel));
    history.replaceState(null, "", `#${state.panel}`);
  }

  function setRailCollapsed(collapsed) {
    state.railCollapsed = collapsed;
    root.classList.toggle("is-rail-collapsed", collapsed);
    localStorage.setItem("wavesight-rail-collapsed", collapsed ? "1" : "0");
    const toggle = $("[data-rail-toggle]");
    if (toggle) toggle.textContent = collapsed ? "展开" : "收起";
  }

  function resizeSkillFrame(height) {
    const frame = $(".skill-frame");
    if (!frame) return;
    const measured = Number(height) || (() => {
      try {
        const doc = frame.contentDocument;
        return Math.max(doc?.body?.scrollHeight || 0, doc?.documentElement?.scrollHeight || 0);
      } catch {
        return 0;
      }
    })();
    frame.style.height = `${Math.max(720, measured + 24)}px`;
  }

  function row(label, value, percent) {
    const width = Math.max(3, Math.min(100, Number(percent) || 0));
    return `<div class="row"><span>${html(label)}</span><span class="bar"><i style="width:${width}%"></i></span><b>${html(value)}</b></div>`;
  }

  function metric(label, value, note, extra = "") {
    return `<article class="card metric ${extra}"><span class="label">${html(label)}</span><strong>${html(value)}</strong><em>${html(note)}</em></article>`;
  }

  function statusBadge(status) {
    const value = text(status || "unknown");
    const lower = value.toLowerCase();
    const isGood = ["passed", "success", "completed", "resolved"].includes(lower);
    const isBad = ["failed", "manual_required", "urgent", "error", "open"].includes(lower);
    const cls = isGood ? "is-green" : isBad ? "is-red" : "is-blue";
    const label = {
      passed: "已通过",
      success: "已通过",
      completed: "已完成",
      resolved: "已解决",
      failed: "失败",
      manual_required: "需人工",
      waiting: "等待中",
      warning: "提醒",
      open: "未解决",
      unknown: "未知",
    }[lower] || value;
    return `<span class="badge ${cls}">${html(label)}</span>`;
  }

  function percentOf(value, max) {
    return max ? Number(value || 0) / max * 100 : 0;
  }

  function renderOverview() {
    const summary = ops.daily?.issueSummary || {};
    const production = ops.tasks?.latestProduction || latest;
    const status = $("[data-overview-status]");
    if (status) {
      status.innerHTML = [
        metric("今日监督", ops.daily?.statusText || "未生成", ops.daily?.date || ops.meta?.date || "-", "hero-card"),
        metric("未解决", summary.open || 0, "Hermes + 每日监督"),
        metric("已解决", summary.resolved || 0, "保留验证和预防记录"),
      ].join("");
    }
    const actions = $("[data-overview-actions]");
    if (actions) {
      actions.innerHTML = `<span class="label">Next Actions</span><h3>今日处理顺序</h3><div class="action-list">
        <button type="button" data-tab="issues">看问题中心<span>发现 / 关闭 / 复盘</span></button>
        <button type="button" data-tab="tasks">看任务链路<span>执行 / 等待 / 接管</span></button>
        <button type="button" data-tab="governance">看版本治理<span>冻结点 / 责任边界</span></button>
      </div>`;
    }
    const risks = $("[data-overview-risks]");
    if (risks) {
      const weekly = ops.periods?.weekly || {};
      const monthly = ops.periods?.monthly || {};
      const recurring = list(monthly.recurring)[0];
      risks.innerHTML = [
        {
          status: ops.daily?.status,
          value: summary.urgent || 0,
          title: "紧急问题",
          body: summary.urgent ? "存在需要优先接管的问题。" : "当前没有紧急问题。",
          action: summary.urgent ? "先处理阻塞上线和数据缺失的问题。" : "继续看周/月重复问题。",
        },
        {
          status: weekly.open ? "warning" : "passed",
          value: weekly.open || 0,
          title: "本周未关闭",
          body: "本周仍未解决的问题越多，说明闭环不够快。",
          action: "按责任链路处理，关闭时记录验证和预防动作。",
        },
        {
          status: recurring ? "warning" : "passed",
          value: recurring ? recurring.count : 0,
          title: "重复问题",
          body: recurring ? `重复类别：${recurring.category}` : "本月没有明显重复类别。",
          action: recurring ? "沉淀为门禁、评估或自动化修复。" : "保持周/月复盘。",
        },
      ].map((item) => `<article class="card"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center">${statusBadge(item.status)}<span class="label">PRIMARY</span></div><div style="margin-top:10px;color:var(--blue);font-family:var(--mono);font-size:24px;font-weight:700">${html(item.value)}</div><h3 style="margin-top:5px">${html(item.title)}</h3><p>${html(item.body)}</p><div class="issue-meta"><span>${html(item.action)}</span></div></article>`).join("");
    }
    const funnel = $("[data-overview-funnel]");
    if (funnel) {
      const max = Math.max(production.raw || 1, production.pool || 1, production.cards || 1);
      funnel.innerHTML = [
        row("Raw", production.raw || 0, percentOf(production.raw, max)),
        row("Pool", production.pool || 0, percentOf(production.pool, max)),
        row("Cards", production.cards || 0, percentOf(production.cards, max)),
      ].join("");
    }
    const queue = $("[data-work-queue]");
    if (queue) {
      queue.innerHTML = [
        row("Daily Issues", summary.daily || 0, Math.min(100, (summary.daily || 0) * 18)),
        row("Open Inbox", summary.open || 0, Math.min(100, (summary.open || 0) * 5)),
        row("Resolved", summary.resolved || 0, Math.min(100, (summary.resolved || 0) * 6)),
      ].join("");
    }
    const routing = $("[data-overview-routing]");
    if (routing) {
      routing.innerHTML = list(ops.tasks?.sync).slice(0, 4).map((item) => row(item.label, item.status, item.status === "passed" ? 100 : item.status === "waiting" ? 55 : 28)).join("");
    }
  }

  function issueCard(issue) {
    return `<article class="card issue-card">
      <div>
        <h3>${html(issue.title || issue.category || "未命名问题")}</h3>
        <p>${html(issue.neededAction || issue.evidence || "暂无下一步动作")}</p>
        <div class="issue-meta">
          <span>${html(issue.lane || issue.laneId || "unknown")}</span>
          <span>${html(issue.category || "uncategorized")}</span>
          <span>${html(issue.source || "hermes")}</span>
        </div>
      </div>
      <div class="issue-side">
        ${statusBadge(issue.state === "resolved" ? "resolved" : issue.status)}
        <span>${html(issue.date || issue.createdAt || "-")}</span>
        <span>${html(issue.reportPath || issue.sourceFile || "")}</span>
      </div>
    </article>`;
  }

  function renderIssueRows(container, aggregate) {
    if (!container) return;
    const recurring = list(aggregate.recurring);
    const rows = [
      row("问题总数", aggregate.total || 0, Math.min(100, (aggregate.total || 0) * 4)),
      row("未解决", aggregate.open || 0, Math.min(100, (aggregate.open || 0) * 7)),
      row("已解决", aggregate.resolved || 0, Math.min(100, (aggregate.resolved || 0) * 7)),
      row("重复类别", recurring.length, Math.min(100, recurring.length * 18)),
    ];
    container.innerHTML = rows.join("");
  }

  function renderIssues() {
    const summaryEl = $("[data-issue-summary]");
    const summary = ops.daily?.issueSummary || {};
    if (summaryEl) {
      summaryEl.innerHTML = [
        metric("今日问题", summary.daily || 0, ops.daily?.date || "-"),
        metric("未解决", summary.open || 0, "需要继续处理"),
        metric("已解决", summary.resolved || 0, "有关闭证据"),
        metric("紧急", summary.urgent || 0, "优先接管"),
      ].join("");
    }
    const dailyList = $("[data-issue-list]");
    if (dailyList) {
      const items = list(ops.daily?.issues);
      dailyList.innerHTML = items.length ? items.map(issueCard).join("") : `<div class="empty">今日监督没有发现问题。</div>`;
    }
    renderIssueRows($("[data-weekly-issues]"), ops.periods?.weekly || {});
    renderIssueRows($("[data-monthly-issues]"), ops.periods?.monthly || {});
    const resolved = $("[data-resolved-issues]");
    if (resolved) {
      const items = list(ops.inbox?.resolved).slice(0, 8);
      resolved.innerHTML = items.length ? items.map(issueCard).join("") : `<div class="empty">还没有读取到已解决问题单。</div>`;
    }
  }

  function renderDashboard() {
    const timeline = $("[data-daily-timeline]");
    if (timeline) {
      const days = list(quality.days || pipeline.days).slice(0, 4);
      timeline.innerHTML = days.map((day, index) => {
        const assets = day.assets || {};
        const assetRows = Object.entries(assets).slice(0, 4).map(([key, value]) => row(key, value, Math.min(100, Number(value) * 4))).join("");
        return `<article class="card day-card ${index === 0 ? "is-latest" : ""}"><div class="day-date"><span>${html(day.label || day.date)}</span><b>${index === 0 ? "最新生产日" : "资产链运行"}</b></div><div class="day-numbers"><span>RAW<b>${html(day.raw || 0)}</b></span><span>POOL<b>${html(day.pool || 0)}</b></span><span>CARDS<b>${html(day.cards || 0)}</b></span></div><div class="rows">${assetRows}</div></article>`;
      }).join("");
    }
    const sourceQuality = $("[data-source-quality]");
    if (sourceQuality) {
      const rows = list(quality.engineQuality?.rows || pipeline.engineQuality?.rows);
      sourceQuality.innerHTML = rows.length ? rows.map((item) => {
        const score = Math.round(((item.conversionRate || 0) * .36) + ((item.officialRate || 0) * .24) + ((100 - (item.duplicateRate || 0)) * .22) + ((item.freshnessRate ?? 50) * .18));
        return `<div class="source-row"><div class="source-name"><strong>${html(item.label || item.id)}</strong><em>${item.total || 0} samples</em></div><div class="mini-kpi"><span>样本量</span><b>${html(item.total || 0)}</b></div><div class="mini-kpi"><span>新鲜度</span><b>${html(pct(item.freshnessRate))}</b></div><div class="mini-kpi"><span>重复率</span><b>${html(pct(item.duplicateRate))}</b></div><div class="mini-kpi"><span>官方源</span><b>${html(pct(item.officialRate))}</b></div><div class="mini-kpi"><span>转卡率</span><b>${html(pct(item.conversionRate))}</b></div><div class="score-pill">${score}</div></div>`;
      }).join("") : `<div class="empty">未读取到来源质量数据。</div>`;
    }
    const matrix = $("[data-asset-matrix]");
    if (matrix) {
      const assets = totals.assets || latest.assets || {};
      const important = ["opinion", "case", "funding", "product-service"];
      const cards = important.map((key, index) => `<article class="card asset-card ${index === 0 ? "asset-main" : ""}"><span class="label">${html(key)}</span><strong>${html(assets[key] || 0)}</strong><p>${index === 0 ? "观点资产占比需要持续压低，用事实型资产托住判断。" : "重点资产类型，进入前台前需要确认来源边界。"}</p></article>`).join("");
      const rest = Object.entries(assets).filter(([key]) => !important.includes(key)).map(([key, value]) => `<span>${html(key)} ${html(value)}</span>`).join("");
      matrix.innerHTML = `${cards}<article class="card span-all"><span class="label">Other Assets</span><div class="tag-cloud" style="margin-top:12px">${rest || "<span>暂无其他类型</span>"}</div></article>`;
    }
  }

  function renderTasks() {
    const lanes = $("[data-task-lanes]");
    if (lanes) {
      const items = list(ops.tasks?.lanes);
      lanes.innerHTML = items.length ? items.map((lane) => {
        const evidence = list(lane.evidence).map((item) => row(item.label, item.value, Math.min(100, Number(item.value) || 0))).join("");
        const action = list(lane.actions)[0] || "暂无人工动作";
        return `<article class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center">${statusBadge(lane.status)}<span class="label">${html(lane.id)}</span></div><h2 style="margin-top:10px">${html(lane.label)}</h2><p>${html(lane.schedule)}</p><div class="rows">${evidence || row("Evidence", "-", 3)}</div><div class="issue-meta"><span>问题 ${html(lane.problemCount || 0)}</span><span>提醒 ${html(lane.warningCount || 0)}</span><span>${html(action)}</span></div></article>`;
      }).join("") : `<div class="empty">未读取到任务链路数据。</div>`;
    }
    const sync = $("[data-sync-status]");
    if (sync) {
      const items = list(ops.tasks?.sync);
      sync.innerHTML = items.map((item) => `<article class="card"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center">${statusBadge(item.status)}<span class="label">SYNC</span></div><h2 style="margin-top:10px">${html(item.label)}</h2><p>${html(item.detail)}</p></article>`).join("");
    }
  }

  function renderGovernance() {
    const versions = $("[data-version-cards]");
    if (versions) {
      versions.innerHTML = list(ops.governance?.versions).map((item) => `<article class="card"><span class="label">${html(item.key)}</span><h2>${html(item.value || "-")}</h2><p>${html(item.label)}</p></article>`).join("");
    }
    const principles = $("[data-governance-principles]");
    if (principles) {
      principles.innerHTML = list(ops.governance?.principles).map((item, index) => `<article class="card"><span class="label">Rule ${index + 1}</span><h2>${html(item)}</h2></article>`).join("");
    }
  }

  function renderSettings() {
    const dataStatus = $("[data-data-status]");
    if (!dataStatus) return;
    dataStatus.classList.add("data-status-list");
    const sources = list(ops.meta?.sources);
    dataStatus.innerHTML = [
      ["ops-console", ops.meta?.version || "OPS-V1.2.3-content-factory-cleanout"],
      ["generated", ops.meta?.generatedAt || "-"],
      ["date", ops.meta?.date || "-"],
      ["pipeline", quality.pipelineMeta?.generatedAt || pipeline.meta?.generatedAt || "-"],
      ["sources", sources.join(" / ") || "-"],
    ].map(([label, value]) => `<div class="data-status-item"><span>${html(label)}</span><b>${html(value)}</b></div>`).join("");
  }

  function renderAll() {
    renderOverview();
    renderIssues();
    renderDashboard();
    renderTasks();
    renderGovernance();
    renderSettings();
    setRailCollapsed(state.railCollapsed);
    setPanel(state.panel);
    resizeSkillFrame();
  }

  root.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) setPanel(tab.dataset.tab);
    const railToggle = event.target.closest("[data-rail-toggle]");
    if (railToggle) setRailCollapsed(!state.railCollapsed);
  });
  $(".skill-frame")?.addEventListener("load", () => resizeSkillFrame());
  window.addEventListener("message", (event) => {
    if (event.data?.type === "wavesight-skill-store-height") resizeSkillFrame(event.data.height);
  });
  window.addEventListener("hashchange", () => setPanel(location.hash ? location.hash.slice(1) : "overview"));

  renderAll();
})();
