(function () {
  const viewConfig = {
    industry_case: {
      label: "行业案例",
      kicker: "Cases",
      rail: "商业场景",
      empty: "没有匹配的行业案例",
    },
    tool_tip: {
      label: "工具技巧",
      kicker: "Tools",
      rail: "工具/方法",
      empty: "没有匹配的工具技巧",
    },
    opportunity: {
      label: "商业机会",
      kicker: "Opportunities",
      rail: "机会场景",
      empty: "没有匹配的商业机会",
    },
    links: {
      label: "资料链接",
      kicker: "Links",
      rail: "资料场景",
      empty: "没有匹配的资料链接",
    },
  };

  const state = {
    payload: null,
    snapshots: [],
    selectedDate: "",
    activeView: "industry_case",
    activeScene: "all",
    filters: {
      query: "",
      source: "all",
      scene: "all",
    },
  };

  const $ = (selector) => document.querySelector(selector);
  const safe = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  function compact(value = "", limit = 220) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (text.length <= limit) return text;
    return `${text.slice(0, limit - 1)}…`;
  }

  function tidyText(value = "") {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function stripLeadSeparators(value = "") {
    return tidyText(value).replace(/^[\s,.;:!?，。；：！？、+\-—]+/, "").trim();
  }

  function displayTitle(item) {
    const rawTitle = tidyText(item.title || item.detailTitle || "未命名案例");
    const cutMarkers = [
      " 阅读本文你将获得",
      " 本文你将获得",
      " 你将获得",
      " 我叫",
      " 从事",
    ];
    const cutAt = cutMarkers
      .map((marker) => rawTitle.indexOf(marker))
      .filter((index) => index > 12)
      .sort((a, b) => a - b)[0];
    const sentenceEnd = rawTitle.search(/[\u3002\uff01\uff1f!?]/);
    const boundary = [cutAt, sentenceEnd > 18 ? sentenceEnd + 1 : -1]
      .filter((index) => index > 0)
      .sort((a, b) => a - b)[0];
    return compact(boundary ? rawTitle.slice(0, boundary) : rawTitle, 64);
  }

  function displaySummary(item, title = displayTitle(item), limit = 190) {
    const rawTitle = tidyText(item.title || item.detailTitle || "");
    let body = tidyText(item.summary || item.evidence || item.excerpt || "");
    let titleRemainder = "";

    if (rawTitle.startsWith(title) && rawTitle.length > title.length + 12) {
      titleRemainder = stripLeadSeparators(rawTitle.slice(title.length));
    }
    if (rawTitle && body.startsWith(rawTitle)) {
      body = body.slice(rawTitle.length);
    } else if (title && body.startsWith(title)) {
      body = body.slice(title.length);
    }

    const summary = stripLeadSeparators([titleRemainder, body].filter(Boolean).join(" "));
    return compact(summary || body || item.evidence || "", limit);
  }

  function fmtDate(value = "") {
    if (!value) return "未知时间";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
    return date.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  function snapshotDate(value = "") {
    const date = value ? new Date(value) : new Date();
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  }

  function fmtSnapshotLabel(value = "") {
    return String(value || "").slice(0, 10).replaceAll("-", ".");
  }

  function payloadDate(payload) {
    return payload?.meta?.date || snapshotDate(payload?.meta?.generatedAt);
  }

  function itemLinks(item) {
    return Array.isArray(item.links) ? item.links : [];
  }

  function normalizeForDedupe(value = "") {
    return tidyText(value)
      .toLowerCase()
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[^\p{Script=Han}\p{Letter}\p{Number}]+/gu, "")
      .slice(0, 96);
  }

  function canonicalItemUrl(item) {
    const url = tidyText(item.url);
    if (!url) return "";
    const sourceUrl = state.payload?.sources?.[item.source]?.url || "";
    if (url === sourceUrl) return "";
    if (item.source === "scys" && /^https:\/\/scys\.com\/?(?:\?.*)?$/.test(url)) return "";
    if (item.source === "aipoju" && /^https:\/\/aipoju\.com\/(?:index|search)?(?:\?.*)?$/.test(url)) return "";
    try {
      const parsed = new URL(url);
      parsed.hash = "";
      parsed.search = "";
      return parsed.toString().replace(/\/$/, "");
    } catch {
      return url;
    }
  }

  function itemDedupeKey(item) {
    const url = canonicalItemUrl(item);
    if (url) return `${item.source}:url:${url}`;
    const titleKey = normalizeForDedupe(displayTitle(item) || item.title);
    if (titleKey.length > 12) return `${item.source}:title:${titleKey}`;
    return `${item.source}:body:${normalizeForDedupe([item.summary, item.evidence, item.excerpt].join(" "))}`;
  }

  function uniqValues(values = []) {
    return [...new Set(values.flat().map(tidyText).filter(Boolean))];
  }

  function itemValueScore(item) {
    if (Number.isFinite(Number(item.valueScore))) return Number(item.valueScore);
    const text = [
      item.title,
      item.summary,
      item.evidence,
      item.resultSignal,
      ...(item.painPoints || []),
      ...(item.reusableMethod || []),
    ].join(" ");
    let score = 18;
    score += Math.min(18, itemLinks(item).length * 7);
    score += Math.min(16, (item.tools || []).length * 4);
    score += Math.min(12, (item.painPoints || []).length * 5);
    score += Math.min(18, (item.reusableMethod || []).length * 7);
    if (item.resultSignal) score += 16;
    if (/月入|收入|营收|订单|成交|GMV|付费|复购|省下|降本|提效|增长|线索/i.test(text)) score += 14;
    if (/SOP|流程|模板|参数|清单|复盘|实操|教程|案例|方法论|开源|提示词/i.test(text)) score += 12;
    if (/求助|需求|怎么做|有没有|痛点|卡点|招募|合作|资源对接/i.test(text)) score += 8;
    if (item.insightType === "opportunity") score += 8;
    if (item.insightType === "tool_tip") score += 5;
    if (/预告一下|即将上线|待确认/.test(text) && !itemLinks(item).length && !item.resultSignal) score -= 10;
    if (tidyText(text).length < 80) score -= 8;
    return Math.max(0, Math.min(score, 100));
  }

  function publishedTimeMs(item, baseValue = state.payload?.meta?.generatedAt) {
    const publishedAt = tidyText(item.publishedAt);
    if (publishedAt) {
      const normalized = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/u.test(publishedAt)
        ? `${publishedAt.replace(/\s+/u, "T")}${publishedAt.length === 16 ? ":00" : ""}+08:00`
        : publishedAt;
      const parsed = Date.parse(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }

    const base = baseValue ? Date.parse(baseValue) : Date.now();
    const safeBase = Number.isFinite(base) ? base : Date.now();
    const relative = tidyText(item.relativeTime);
    const number = Number.parseFloat(relative.match(/\d+(?:\.\d+)?/u)?.[0] || "");
    if (/刚刚|刚才|今天/u.test(relative)) return safeBase;
    if (/分钟|分钟前/u.test(relative) && Number.isFinite(number)) return safeBase - number * 60 * 1000;
    if (/小时|小时前/u.test(relative) && Number.isFinite(number)) return safeBase - number * 60 * 60 * 1000;
    if (/昨天/u.test(relative)) return safeBase - 24 * 60 * 60 * 1000;
    if (/天前/u.test(relative) && Number.isFinite(number)) return safeBase - number * 24 * 60 * 60 * 1000;
    return 0;
  }

  function comparePublishedDesc(a, b) {
    return publishedTimeMs(b) - publishedTimeMs(a);
  }

  function mergeDisplayItems(items = []) {
    const groups = new Map();
    for (const item of items) {
      const key = itemDedupeKey(item);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    return [...groups.values()].map((group) => {
      const sorted = [...group].sort((a, b) => {
        const publishedDelta = comparePublishedDesc(a, b);
        if (publishedDelta) return publishedDelta;
        const valueDelta = itemValueScore(b) - itemValueScore(a);
        if (valueDelta) return valueDelta;
        return itemLinks(b).length - itemLinks(a).length;
      });
      const base = { ...sorted[0] };
      const linkMap = new Map();
      for (const item of group) {
        for (const link of itemLinks(item)) {
          if (link?.href) linkMap.set(link.href, link);
        }
      }
      const keywords = uniqValues(group.flatMap((item) => item.matchedKeywords || item.collection?.keywords || item.collection?.keyword || []));
      base.links = [...linkMap.values()];
      base.tools = uniqValues(group.flatMap((item) => item.tools || []));
      base.painPoints = uniqValues(group.flatMap((item) => item.painPoints || []));
      base.reusableMethod = uniqValues(group.flatMap((item) => item.reusableMethod || []));
      base.matchedKeywords = keywords;
      base.duplicateCount = group.length;
      base.valueScore = Math.min(100, Math.max(...group.map(itemValueScore)) + Math.min(10, Math.max(0, keywords.length - 1) * 2));
      base.collection = {
        ...base.collection,
        keyword: keywords.length > 1 ? keywords.join(" / ") : (keywords[0] || base.collection?.keyword || ""),
        keywords,
      };
      return base;
    });
  }

  function allItems() {
    return state.payload?.items || [];
  }

  function sourceLabel(value = "") {
    return state.payload?.sources?.[value]?.name || value || "未知来源";
  }

  function itemView(item) {
    if (state.activeView === "links") return itemLinks(item).length > 0;
    return item.insightType === state.activeView;
  }

  function queryMatch(item, query) {
    if (!query) return true;
    const haystack = [
      item.title,
      item.author,
      item.scene,
      item.industry,
      item.summary,
      item.evidence,
      item.monetization,
      item.resultSignal,
      item.collection?.keyword,
      ...(item.tools || []),
      ...(item.painPoints || []),
      ...(item.reusableMethod || []),
      ...itemLinks(item).flatMap((link) => [link.href, link.text]),
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  }

  function baseFilteredItems({ ignoreScene = false } = {}) {
    const query = state.filters.query.trim().toLowerCase();
    return allItems().filter((item) => {
      const sceneFilter = state.filters.scene !== "all" ? state.filters.scene : state.activeScene;
      if (!itemView(item)) return false;
      if (state.filters.source !== "all" && item.source !== state.filters.source) return false;
      if (!ignoreScene && sceneFilter !== "all" && item.scene !== sceneFilter) return false;
      return queryMatch(item, query);
    });
  }

  function sortedItems(items) {
    const copy = [...items];
    if (state.activeView === "opportunity") {
      return copy.sort((a, b) => comparePublishedDesc(a, b) || itemValueScore(b) - itemValueScore(a) || (b.opportunityScore || 0) - (a.opportunityScore || 0));
    }
    if (state.activeView === "tool_tip") {
      return copy.sort((a, b) => comparePublishedDesc(a, b) || itemValueScore(b) - itemValueScore(a) || (b.tools || []).length - (a.tools || []).length);
    }
    if (state.activeView === "links") {
      return copy.sort((a, b) => comparePublishedDesc(a, b) || itemValueScore(b) - itemValueScore(a) || itemLinks(b).length - itemLinks(a).length);
    }
    if (state.activeView === "industry_case") {
      return copy.sort((a, b) => {
        const publishedDelta = comparePublishedDesc(a, b);
        if (publishedDelta) return publishedDelta;
        const valueDelta = itemValueScore(b) - itemValueScore(a);
        if (valueDelta) return valueDelta;
        const aKnown = a.industry && a.industry !== "未识别行业" ? 1 : 0;
        const bKnown = b.industry && b.industry !== "未识别行业" ? 1 : 0;
        return bKnown - aKnown || (b.opportunityScore || 0) - (a.opportunityScore || 0);
      });
    }
    return copy;
  }

  function renderTitle() {
    const target = $("[data-generated-at]");
    if (!target) return;
    target.textContent = fmtSnapshotLabel(state.selectedDate || payloadDate(state.payload));
  }

  function renderSnapshotDateFilter() {
    const date = $("[data-date-filter]");
    if (!date) return;
    const snapshots = state.snapshots.length
      ? state.snapshots
      : [{
        date: payloadDate(state.payload),
        items: (state.payload?.items || []).length,
        links: (state.payload?.links || []).length,
      }];
    date.innerHTML = snapshots.map((item) => {
      return `<option value="${safe(item.date)}">${safe(fmtSnapshotLabel(item.date))}</option>`;
    }).join("");
    date.value = state.selectedDate || snapshots[0]?.date || "";
  }

  function renderViewTabs() {
    const root = $("[data-view-tabs]");
    if (!root) return;
    root.innerHTML = Object.entries(viewConfig).map(([key, config]) => {
      const count = allItems().filter((item) => key === "links" ? itemLinks(item).length : item.insightType === key).length;
      return `
        <button class="insight-tab ${state.activeView === key ? "is-active" : ""}" type="button" data-view="${safe(key)}">
          <strong>${safe(config.label)}</strong>
          <span>${safe(count)} 条</span>
        </button>
      `;
    }).join("");
    root.onclick = (event) => {
      const button = event.target.closest("[data-view]");
      if (!button) return;
      state.activeView = button.dataset.view;
      state.activeScene = "all";
      state.filters.scene = "all";
      renderAll();
    };
  }

  function renderFilters() {
    const source = $("[data-source-filter]");
    const scene = $("[data-scene-filter]");
    if (source) {
      const sources = Object.entries(state.payload?.sources || {});
      source.innerHTML = [
        '<option value="all">全部来源</option>',
        ...sources.map(([key, value]) => `<option value="${safe(key)}">${safe(value.name || key)}</option>`),
      ].join("");
      source.value = state.filters.source;
    }
    if (scene) {
      const scenes = [...new Set(baseFilteredItems({ ignoreScene: true }).map((item) => item.scene).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, "zh-CN"));
      scene.innerHTML = [
        '<option value="all">全部场景</option>',
        ...scenes.map((item) => `<option value="${safe(item)}">${safe(item)}</option>`),
      ].join("");
      scene.value = state.filters.scene;
    }
  }

  function renderScenes() {
    const root = $("[data-scene-list]");
    const count = $("[data-scene-count]");
    const title = $("[data-rail-title]");
    if (!root) return;
    const items = baseFilteredItems({ ignoreScene: true });
    const groups = [...items.reduce((map, item) => {
      const scene = item.scene || "未分类";
      const current = map.get(scene) || { scene, count: 0, links: 0, score: 0 };
      current.count += 1;
      current.links += itemLinks(item).length;
      current.score = Math.max(current.score, item.opportunityScore || 0);
      map.set(scene, current);
      return map;
    }, new Map()).values()].sort((a, b) => {
      if (state.activeView === "opportunity") return b.score - a.score || b.count - a.count;
      return b.count - a.count || a.scene.localeCompare(b.scene, "zh-CN");
    });
    if (title) title.textContent = viewConfig[state.activeView].rail;
    if (count) count.textContent = `${groups.length} 类`;
    root.innerHTML = `
      <button class="scene-item ${state.activeScene === "all" ? "is-active" : ""}" type="button" data-scene="all">
        <strong>全部${safe(viewConfig[state.activeView].rail)}</strong>
        <span>${items.length} 条帖子 · ${items.reduce((sum, item) => sum + itemLinks(item).length, 0)} 个链接</span>
      </button>
      ${groups.map((group) => `
        <button class="scene-item ${state.activeScene === group.scene ? "is-active" : ""}" type="button" data-scene="${safe(group.scene)}">
          <strong>${safe(group.scene)}</strong>
          <span>${safe(group.count)} 条帖子 · ${safe(group.links)} 个链接</span>
        </button>
      `).join("")}
    `;
    root.onclick = (event) => {
      const button = event.target.closest("[data-scene]");
      if (!button) return;
      state.activeScene = button.dataset.scene;
      state.filters.scene = "all";
      renderAll();
    };
  }

  function linkChips(item, limit = 3) {
    const links = itemLinks(item).slice(0, limit);
    if (!links.length) return "";
    return `
      <div class="case-links" aria-label="资料链接">
        ${links.map((link, index) => `<a href="${safe(link.href)}" target="_blank" rel="noreferrer">资料 ${index + 1}</a>`).join("")}
      </div>
    `;
  }

  function keywordChip(item) {
    const keyword = item.collection?.keyword;
    if (!keyword) return "";
    return `<span class="source-chip source-search">搜索：${safe(keyword)}</span>`;
  }

  function insightRows(item) {
    const rows = [];
    if (state.activeView === "opportunity") {
      rows.push(["机会分", `${item.opportunityScore || 0}`]);
      if (item.resultSignal) rows.push(["结果", item.resultSignal]);
      if ((item.painPoints || []).length) rows.push(["痛点", item.painPoints.join(" / ")]);
      if ((item.reusableMethod || []).length) rows.push(["可做", item.reusableMethod.join(" / ")]);
    } else if (state.activeView === "tool_tip") {
      if ((item.tools || []).length) rows.push(["工具", item.tools.join(" / ")]);
      if ((item.reusableMethod || []).length) rows.push(["方法", item.reusableMethod.join(" / ")]);
      rows.push(["场景", item.scene || "未识别"]);
    } else if (state.activeView === "links") {
      rows.push(["链接", `${itemLinks(item).length} 个资料链接`]);
      rows.push(["场景", item.scene || "未识别"]);
    } else {
      rows.push(["行业", item.industry || "未识别"]);
      if (item.resultSignal) rows.push(["结果", item.resultSignal]);
    }
    return `
      <div class="case-insights">
        ${rows.map(([label, value]) => `
          <div>
            <span>${safe(label)}</span>
            <strong>${safe(value)}</strong>
          </div>
        `).join("")}
      </div>
    `;
  }

  function itemTags(item) {
    const hiddenTags = new Set(["待确认", "未识别", "未识别行业", "未分类", "未知"]);
    return [
      item.scene,
      item.industry,
      ...(item.tools || []),
      item.monetization,
    ].map(tidyText).filter((tag) => tag && !hiddenTags.has(tag));
  }

  function caseCard(item) {
    const sourceClass = item.source === "aipoju" ? "source-aipoju" : "source-scys";
    const tags = itemTags(item).slice(0, 5);
    const title = displayTitle(item);
    const summary = displaySummary(item, title);
    return `
      <article class="case-card view-${safe(state.activeView)}">
        <div class="case-meta">
          <span class="source-chip ${sourceClass}">${safe(sourceLabel(item.source))}</span>
          <span class="source-chip">${safe(item.publishedAt || item.relativeTime || "未知时间")}</span>
          ${keywordChip(item)}
        </div>
        <h3>${safe(title)}</h3>
        <p>${safe(summary)}</p>
        <div class="case-tags">
          ${tags.map((tag) => `<span>${safe(tag)}</span>`).join("")}
        </div>
        ${linkChips(item)}
        <div class="case-actions">
          ${item.url ? `<a href="${safe(item.url)}" target="_blank" rel="noreferrer">打开原帖</a>` : "<span></span>"}
          <button type="button" data-open-case="${safe(item.id)}">详情</button>
        </div>
      </article>
    `;
  }

  function renderCases() {
    const root = $("[data-case-grid]");
    const count = $("[data-result-count]");
    const title = $("[data-stage-title]");
    if (!root) return;
    const items = sortedItems(baseFilteredItems());
    if (title) title.textContent = viewConfig[state.activeView].label;
    if (count) count.textContent = `${items.length} 条`;
    root.innerHTML = items.length
      ? items.map(caseCard).join("")
      : `<div class="empty-state">${safe(viewConfig[state.activeView].empty)}</div>`;
    root.onclick = (event) => {
      const button = event.target.closest("[data-open-case]");
      if (!button) return;
      openDialog(button.dataset.openCase);
    };
  }

  function openDialog(id) {
    const item = allItems().find((entry) => entry.id === id);
    const dialog = $("[data-dialog]");
    const content = $("[data-dialog-content]");
    if (!item || !dialog || !content) return;
    const title = displayTitle(item);
    const summary = displaySummary(item, title, 360);
    content.innerHTML = `
      <div class="case-meta">
        <span class="source-chip ${item.source === "aipoju" ? "source-aipoju" : "source-scys"}">${safe(sourceLabel(item.source))}</span>
        <span class="source-chip">${safe(item.scene || "未分类")}</span>
        ${keywordChip(item)}
      </div>
      <h3>${safe(title)}</h3>
      <p>${safe(summary)}</p>
      <div class="dialog-section">
        <h4>证据摘录</h4>
        <p>${safe(item.evidence || item.excerpt || "")}</p>
      </div>
      <div class="dialog-section">
        <h4>资料链接</h4>
        <div class="link-list">
          ${itemLinks(item).length ? itemLinks(item).map((link) => `
            <div class="link-row">
              <a href="${safe(link.href)}" target="_blank" rel="noreferrer">${safe(link.href)}</a>
              <span>${safe(link.text || "正文链接")}</span>
            </div>
          `).join("") : "<p>当前帖子没有识别到飞书或外部资料链接。</p>"}
        </div>
      </div>
    `;
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function bindEvents() {
    const search = $("[data-search]");
    const date = $("[data-date-filter]");
    const source = $("[data-source-filter]");
    const scene = $("[data-scene-filter]");
    if (search) {
      search.addEventListener("input", () => {
        state.filters.query = search.value;
        renderScenes();
        renderCases();
      });
    }
    if (date) {
      date.addEventListener("change", async () => {
        await loadSnapshot(date.value, { updateUrl: true });
        state.activeScene = "all";
        state.filters.scene = "all";
        renderAll();
      });
    }
    if (source) {
      source.addEventListener("change", () => {
        state.filters.source = source.value;
        state.activeScene = "all";
        state.filters.scene = "all";
        renderAll();
      });
    }
    if (scene) {
      scene.addEventListener("change", () => {
        state.filters.scene = scene.value;
        state.activeScene = "all";
        renderAll();
      });
    }
    const dialog = $("[data-dialog]");
    const close = $("[data-dialog-close]");
    if (dialog && close) close.addEventListener("click", () => dialog.close());
  }

  function renderAll() {
    renderTitle();
    renderSnapshotDateFilter();
    renderViewTabs();
    renderFilters();
    renderScenes();
    renderCases();
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  function snapshotHref(entry) {
    if (!entry?.href) return "data/community-intelligence.json";
    return entry.href.startsWith("data/")
      ? entry.href
      : `data/community-intelligence-daily/${entry.href}`;
  }

  function setDateUrl(date) {
    if (!date) return;
    const url = new URL(window.location.href);
    url.searchParams.set("date", date);
    window.history.replaceState({}, "", url);
  }

  async function loadSnapshot(date, { updateUrl = false } = {}) {
    const entry = state.snapshots.find((item) => item.date === date) || state.snapshots[0];
    const payload = await fetchJson(snapshotHref(entry));
    state.payload = payload;
    state.selectedDate = entry?.date || payloadDate(payload);
    if (updateUrl) setDateUrl(state.selectedDate);
  }

  async function boot() {
    try {
      const params = new URLSearchParams(window.location.search);
      const requestedDate = params.get("date") || "";
      const manifest = await fetchJson("data/community-intelligence-daily/index.json").catch(() => null);
      state.snapshots = (manifest?.dates || [])
        .filter((item) => item?.date)
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));
      if (state.snapshots.length) {
        const initialDate = state.snapshots.some((item) => item.date === requestedDate)
          ? requestedDate
          : state.snapshots[0].date;
        await loadSnapshot(initialDate, { updateUrl: Boolean(requestedDate) });
      } else {
        state.payload = await fetchJson("data/community-intelligence.json");
        state.selectedDate = payloadDate(state.payload);
      }
      bindEvents();
      renderAll();
    } catch (error) {
      const root = $("[data-case-grid]");
      if (root) root.innerHTML = `<div class="empty-state">社群情报数据读取失败：${safe(error.message)}</div>`;
    }
  }

  boot();
})();
