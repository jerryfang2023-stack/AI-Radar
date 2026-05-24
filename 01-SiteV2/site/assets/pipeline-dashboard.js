(function () {
  const payload = window.WaveSightPipelineDashboard;
  if (!payload || !Array.isArray(payload.days)) return;

  const $ = (selector) => document.querySelector(selector);
  const safe = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  const fmt = (date = "") => String(date).replaceAll("-", ".");
  const shortDate = (date = "") => String(date).slice(5).replace("-", ".");
  const sum = (obj = {}) => Object.values(obj).reduce((total, value) => total + (Number(value) || 0), 0);
  const topEntries = (obj = {}, limit = 4) => Object.entries(obj)
    .filter(([, value]) => Number(value) > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);

  function bar(label, value, base) {
    const width = base ? Math.max(8, Math.round((Number(value) / base) * 100)) : 0;
    return `<span style="--bar:${width}"><i>${safe(label)} ${safe(value)}</i></span>`;
  }

  const assetPriority = ["case", "funding", "product-service", "opinion", "change", "trend"];
  const assetLabels = {
    case: "CASE",
    funding: "FUNDING",
    "product-service": "PRODUCT / SERVICE",
    opinion: "OPINION",
    change: "CHANGE",
    trend: "TREND",
  };

  function assetLabel(type) {
    return assetLabels[type] || String(type || "unknown").replaceAll("-", " ").toUpperCase();
  }

  function assetEntries(assets = {}, limit = 99) {
    return Object.entries(assets)
      .filter(([, value]) => Number(value) > 0)
      .sort((a, b) => {
        const rankA = assetPriority.includes(a[0]) ? assetPriority.indexOf(a[0]) : 99;
        const rankB = assetPriority.includes(b[0]) ? assetPriority.indexOf(b[0]) : 99;
        return rankA === rankB ? b[1] - a[1] : rankA - rankB;
      })
      .slice(0, limit);
  }

  function fieldSummary(fields = {}, emptyText = "暂无字段") {
    const rows = Object.entries(fields)
      .filter(([, value]) => Number(value) > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    return rows.length
      ? rows.map(([label, value]) => `${value} ${label}`).join(" / ")
      : emptyText;
  }

  function metricCell(value, caption, risk = false) {
    const numeric = Number(value);
    const hasValue = Number.isFinite(numeric);
    const label = hasValue ? `${numeric}%` : "--";
    return `
      <div class="pipeline-engine-cell ${risk ? "is-risk" : ""}">
        <strong>${safe(label)}</strong>
        <i style="--metric:${hasValue ? Math.max(2, Math.min(100, numeric)) : 0}"></i>
        <small>${safe(caption)}</small>
      </div>
    `;
  }

  function renderEngineQuality() {
    const root = $(".pipeline-engine-board");
    const rows = payload.engineQuality?.rows || [];
    if (!root || !rows.length) return;
    root.innerHTML = `
      <div class="pipeline-engine-table">
        <div class="pipeline-engine-row is-head">
          <span>入口</span>
          <span>样本</span>
          <span>新鲜度</span>
          <span>重复率</span>
          <span>官方源</span>
          <span>Raw Card 候选</span>
        </div>
        ${rows.map((row) => `
          <div class="pipeline-engine-row">
            <div class="pipeline-engine-name">
              <strong>${safe(row.label)}</strong>
              <small>${row.total ? "已命中 Raw" : "暂无样本"}</small>
            </div>
            <div class="pipeline-engine-cell">
              <strong>${safe(row.total || 0)}</strong>
              <small>${safe(row.freshKnown || 0)} 条有发布时间</small>
            </div>
            ${metricCell(row.freshnessRate, "48h 内")}
            ${metricCell(row.duplicateRate, "越低越好", true)}
            ${metricCell(row.officialRate, "S / official")}
            ${metricCell(row.conversionRate, "可转化")}
          </div>
        `).join("")}
      </div>
      <div class="pipeline-engine-note">${safe(payload.engineQuality.metricNote || payload.engineQuality.sampleNote || "")}</div>
    `;
  }

  function renderDayCards() {
    const root = $(".pipeline-day-grid");
    if (!root) return;
    root.innerHTML = payload.days.slice(0, 3).map((day, index) => {
      const base = Math.max(day.raw || 0, 1);
      const status = index === 0 ? "最新生产日" : (day.pool ? "资产链运行" : "低样本日");
      return `
        <article class="pipeline-day-card ${index === 0 ? "is-featured" : ""}">
          <div class="pipeline-day-head">
            <span>${safe(fmt(day.date))}</span>
            <strong>${safe(status)}</strong>
          </div>
          <div class="pipeline-metric-row">
            <div><span>RAW</span><strong>${safe(day.raw || 0)}</strong></div>
            <div><span>POOL</span><strong>${safe(day.pool || 0)}</strong></div>
            <div><span>CARDS</span><strong>${safe(day.cards || 0)}</strong></div>
          </div>
          <div class="pipeline-funnel-bars" aria-label="${safe(fmt(day.date))} 漏斗">
            ${bar("Raw", day.raw || 0, base)}
            ${bar("Pool", day.pool || 0, base)}
            ${assetEntries(day.assets, 5).map(([type, value]) => bar(assetLabel(type), value, base)).join("")}
          </div>
        </article>
      `;
    }).join("");
  }

  function renderSources() {
    const root = $(".pipeline-source-board");
    if (!root) return;
    root.innerHTML = payload.days.slice(0, 3).map((day) => `
      <div class="pipeline-source-day">
        <span>${safe(shortDate(day.date))}</span>
        <div><strong>${safe(day.rawChannels?.aihot || 0)}</strong><em>AI HOT</em></div>
        <div><strong>${safe(day.rawChannels?.keyword_search || 0)}</strong><em>关键词搜索</em></div>
        <div><strong>${safe(day.rawChannels?.follow_builders || 0)}</strong><em>Builder 观点</em></div>
      </div>
    `).join("");
  }

  function renderRoutes() {
    const root = $(".pipeline-route-list");
    const latest = payload.latest || payload.days[0] || {};
    if (!root || !latest) return;
    const rows = [
      ...topEntries(latest.poolRoutes, 3).map(([label, value]) => [label, value, `${shortDate(latest.date)} Pool 分流`]),
      ...topEntries(latest.evidenceLevels, 2).map(([label, value]) => [label, value, `${shortDate(latest.date)} 证据层级`]),
    ].slice(0, 4);
    const max = Math.max(...rows.map(([, value]) => Number(value) || 0), 1);
    root.innerHTML = rows.map(([label, value, note]) => `
      <div>
        <span>${safe(label)}</span>
        <strong>${safe(value)}</strong>
        <i style="--route:${Math.max(8, Math.round((Number(value) / max) * 100))}"></i>
        <em>${safe(note)}</em>
      </div>
    `).join("");
  }

  function renderAssetsLegacy() {
    const root = $(".pipeline-asset-grid");
    const totals = payload.totals?.assets || {};
    const latest = payload.latest || {};
    if (!root) return;
    const latestStatus = latest.assetStatus?.change || {};
    const statusText = Object.entries(latestStatus)
      .map(([status, value]) => `${value} ${status}`)
      .join("，") || "等待资产门禁";
    const cards = [
      ["CHANGE", totals.change || 0, `变化卡：最新日 ${latest.assets?.change || 0} 张，状态为 ${statusText}。`],
      ["CASE", totals.case || 0, "案例卡：承接公司动作、客户采用、产品落地或相邻案例。"],
      ["OPINION", totals.opinion || 0, "观点卡：多来自 Builder / VC / 技术作者，只作校准，不替代事实证据。"],
      ["TREND", totals.trend || 0, "趋势卡：当变化簇达到门槛后，进入趋势追踪或报告候选。"],
    ];
    root.innerHTML = cards.map(([label, value, text]) => `
      <article>
        <span>${safe(label)}</span>
        <strong>${safe(value)}</strong>
        <p>${safe(text)}</p>
      </article>
    `).join("");
  }

  function renderAssets() {
    const root = $(".pipeline-asset-grid");
    const latest = payload.latest || {};
    if (!root) return;
    const rows = assetEntries(latest.assets || {});
    if (!rows.length) {
      root.innerHTML = "<article><span>CARDS</span><strong>0</strong><p>最新生产日暂未识别到卡片资产。</p></article>";
      return;
    }
    root.innerHTML = rows.map(([type, value]) => {
      const status = fieldSummary(latest.assetStatus?.[type], "status 待写入");
      const level = fieldSummary(latest.assetLevels?.[type], "asset_level 待写入");
      const evidence = fieldSummary(latest.assetEvidenceGates?.[type], "evidence_gate 待写入");
      return `
        <article>
          <span>${safe(assetLabel(type))}</span>
          <strong>${safe(value)}</strong>
          <p>${safe(shortDate(latest.date))} 最新生产日；status: ${safe(status)}；asset_level: ${safe(level)}；gate: ${safe(evidence)}。</p>
        </article>
      `;
    }).join("");
  }

  function renderRelations() {
    const latest = payload.latest || payload.days[0] || {};
    const map = $(".pipeline-relation-map");
    if (map) {
      map.innerHTML = `
        <div class="pipeline-node source">
          <span>01</span>
          <strong>Raw</strong>
          <p>${safe(latest.raw || 0)} 条广泛监测候选，保留来源、快照、摘录和可用方向。</p>
        </div>
        <div class="pipeline-link"><span>筛选</span></div>
        <div class="pipeline-node pool">
          <span>02</span>
          <strong>Pool</strong>
          <p>${safe(latest.pool || 0)} 条候选池，按 core、emerging、user_feedback 等路径分流。</p>
        </div>
        <div class="pipeline-link"><span>生成</span></div>
        <div class="pipeline-node asset">
          <span>03</span>
          <strong>Asset Cards</strong>
          <p>${safe(latest.cards || 0)} 张当日资产卡建立 raw_refs / pool_refs / related_*。</p>
        </div>
        <div class="pipeline-link"><span>索引</span></div>
        <div class="pipeline-node publish">
          <span>04</span>
          <strong>Publication</strong>
          <p>今日观察、商业信号、趋势追踪、商业内参读取已过门禁资产。</p>
        </div>
      `;
    }
    if (false) {
      detail.innerHTML = `
        <article>
          <span>${safe(shortDate(relation.date || latest.date))} 主线</span>
          <strong>${safe(relation.mainLine || "当日关系主线待生成")}</strong>
          <p>关系索引来自 knowledge/00-MOC，连接今日观察、变化簇、趋势候选、变化卡、案例卡和观点卡。</p>
        </article>
        <article>
          <span>证据边界</span>
          <strong>${safe(relation.evidenceBoundary || "证据边界待补充")}</strong>
          <p>Raw 是事实底座；社媒与社区材料只作为热度、观点和早期线索。</p>
        </article>
      `;
    }
  }

  function renderMeta() {
    const subtitle = $(".pipeline-hero p");
    if (!subtitle || !payload.meta?.dateRange) return;
    subtitle.textContent = `自动读取 ${payload.meta.source}；当前范围 ${fmt(payload.meta.dateRange.start)} - ${fmt(payload.meta.dateRange.end)}。`;
  }

  renderMeta();
  renderDayCards();
  renderSources();
  renderRoutes();
  renderEngineQuality();
  renderAssets();
  renderRelations();
}());
