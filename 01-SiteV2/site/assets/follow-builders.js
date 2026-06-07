(function () {
  const state = {
    payload: null,
    activeBuilder: "all",
    filters: {
      query: "",
      date: "all",
      topic: "all",
      source: "all",
    },
  };

  const $ = (selector) => document.querySelector(selector);
  const safe = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

  function fmtDate(value = "") {
    if (!value) return "未知日期";
    return String(value).slice(0, 10).replaceAll("-", ".");
  }

  function compact(value = "", limit = 220) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (text.length <= limit) return text;
    return `${text.slice(0, limit - 1)}…`;
  }

  function allRemarks() {
    return state.payload?.remarks || [];
  }

  function filteredRemarks(options = {}) {
    const query = state.filters.query.toLowerCase();
    return allRemarks().filter((item) => {
      const haystack = [
        item.name,
        item.handle,
        item.role,
        item.text,
        item.translation,
        item.topic,
        ...(item.formalTags || []).flatMap((tag) => [tag.name, tag.group]),
      ].join(" ").toLowerCase();
      if (!options.ignoreBuilder && state.activeBuilder !== "all" && item.handle !== state.activeBuilder) return false;
      if (state.filters.date !== "all" && item.date !== state.filters.date) return false;
      if (state.filters.topic !== "all" && item.topic !== state.filters.topic) return false;
      if (state.filters.source !== "all" && item.source !== state.filters.source) return false;
      if (query && !haystack.includes(query)) return false;
      return true;
    });
  }

  function latestTime(remarks = []) {
    return Math.max(...remarks.map((item) => Date.parse(item.createdAt) || 0), 0);
  }

  function groupedRemarks() {
    const groups = new Map();
    for (const item of filteredRemarks()) {
      const key = `${item.handle}::${item.date}`;
      if (!groups.has(key)) {
        groups.set(key, {
          id: key,
          name: item.name,
          handle: item.handle,
          role: item.role,
          date: item.date,
          items: [],
        });
      }
      groups.get(key).items.push(item);
    }
    return [...groups.values()].map((group) => ({
      ...group,
      items: group.items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))),
      latestAt: latestTime(group.items),
    })).sort((a, b) => b.latestAt - a.latestAt);
  }

  function renderMeta() {
    const root = $("[data-meta-panel]");
    if (!root) return;
    const meta = state.payload.meta || {};
    root.innerHTML = [
      ["最近生成", fmtDate(meta.generatedAt)],
      ["Feed 时间", fmtDate(meta.feedGeneratedAt)],
      ["Skill 来源", "follow-builders"],
      ["平台", meta.platform || "other"],
    ].map(([label, value]) => `
      <div class="meta-chip">
        <span>${safe(label)}</span>
        <strong>${safe(value)}</strong>
      </div>
    `).join("");
  }

  function renderStats() {
    const root = $("[data-stats]");
    if (!root) return;
    const stats = state.payload.stats || {};
    root.innerHTML = [
      ["Builders", stats.builders || 0, "今日有公开言论的人物"],
      ["Remarks", stats.remarks || 0, "进入观察台的言论条数"],
      ["Podcasts", stats.podcasts || 0, "可阅读的长访谈"],
      ["Tracked", stats.trackedSources || 0, "中心源列表跟踪对象"],
    ].map(([label, value, note]) => `
      <article class="stat-card">
        <span>${safe(label)}</span>
        <strong>${safe(value)}</strong>
        <p>${safe(note)}</p>
      </article>
    `).join("");
  }

  function renderPageTitle() {
    const date = $("[data-viewpoint-date]");
    if (!date) return;
    const latestRemarkDate = allRemarks()
      .map((item) => item.date)
      .filter(Boolean)
      .sort((a, b) => b.localeCompare(a))[0];
    date.textContent = fmtDate(latestRemarkDate || state.payload?.meta?.generatedAt);
  }

  function isGenericBuilderTopic(value = "") {
    return /^Builder\s/iu.test(String(value || ""));
  }

  function renderFilters() {
    const date = $("[data-date-filter]");
    const topic = $("[data-topic-filter]");
    if (date) {
      const dates = [...new Set(allRemarks().map((item) => item.date).filter(Boolean))].sort((a, b) => b.localeCompare(a));
      date.innerHTML = [
        "<option value=\"all\">全部日期</option>",
        ...dates.map((item) => `<option value="${safe(item)}">${safe(fmtDate(item))}</option>`),
      ].join("");
    }
    if (topic) {
      const topics = [...new Set(allRemarks().map((item) => item.topic).filter((item) => item && !isGenericBuilderTopic(item)))].sort((a, b) => a.localeCompare(b));
      topic.innerHTML = [
        "<option value=\"all\">全部主题</option>",
        ...topics.map((item) => `<option value="${safe(item)}">${safe(item)}</option>`),
      ].join("");
    }
  }

  function renderBuilders() {
    const root = $("[data-builder-list]");
    if (!root) return;
    const visibleRemarks = filteredRemarks({ ignoreBuilder: true });
    const allCount = visibleRemarks.length;
    const builders = [...new Map(visibleRemarks.map((item) => [item.handle, item])).values()]
      .map((item) => {
        const items = visibleRemarks.filter((remark) => remark.handle === item.handle);
        return {
          name: item.name,
          handle: item.handle,
          role: item.role,
          count: items.length,
          latestAt: latestTime(items),
        };
      })
      .sort((a, b) => b.latestAt - a.latestAt || a.name.localeCompare(b.name));
    root.innerHTML = `
      <button class="builder-item ${state.activeBuilder === "all" ? "is-active" : ""}" type="button" data-builder="all">
        <strong>全部 Builders</strong>
        <span>${safe(allCount)}</span>
        <em>查看所有公开言论</em>
      </button>
      ${builders.map((builder) => `
        <button class="builder-item ${state.activeBuilder === builder.handle ? "is-active" : ""}" type="button" data-builder="${safe(builder.handle)}">
          <strong>${safe(builder.name)}</strong>
          <span>${safe(builder.count)}</span>
          <em>${safe(compact(builder.role || builder.handle, 72))}</em>
        </button>
      `).join("")}
    `;
    root.onclick = (event) => {
      const button = event.target.closest("[data-builder]");
      if (!button) return;
      state.activeBuilder = button.dataset.builder;
      renderAll();
    };
  }

  function fmtTime(value = "") {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function tagChips(item, limit = 4) {
    const tags = (item.formalTags || []).filter((tag) => tag?.name).slice(0, limit);
    if (!tags.length) return "";
    return `
      <div class="formal-tag-row" aria-label="观澜标签">
        ${tags.map((tag) => `<span class="formal-tag formal-tag-${safe(tag.group || "asset")}">${safe(tag.name)}</span>`).join("")}
      </div>
    `;
  }

  function remarkTimelineItem(item) {
    return `
      <section class="timeline-item">
        <div class="timeline-head">
          <span class="timeline-time">${safe(fmtTime(item.createdAt))}</span>
        </div>
        ${tagChips(item)}
        <p class="remark-text">${safe(compact(item.translation || item.text, 320))}</p>
        <div class="metric-row">
          <span class="metric">Likes ${safe(item.likes || 0)}</span>
          <span class="metric">Reposts ${safe(item.retweets || 0)}</span>
          <span class="metric">Replies ${safe(item.replies || 0)}</span>
        </div>
        <div class="card-actions">
          <button class="text-button" type="button" data-open-remark="${safe(item.id)}">查看全文</button>
          <a class="source-link" href="${safe(item.url)}" target="_blank" rel="noreferrer">打开原帖</a>
        </div>
      </section>
    `;
  }

  function remarkCard(group) {
    return `
      <article class="remark-card">
        <div class="remark-head">
          <div class="remark-person">
            <strong>${safe(group.name)}</strong>
            <span>${safe(group.role || `${group.handle} on X`)}</span>
          </div>
          <span class="remark-date">${safe(fmtDate(group.date))}</span>
        </div>
        <div class="timeline-list">
          ${group.items.map(remarkTimelineItem).join("")}
        </div>
      </article>
    `;
  }

  function estimateGroupHeight(group) {
    const roleWeight = Math.ceil(String(group.role || "").length / 42) * 20;
    const itemWeight = group.items.reduce((sum, item) => {
      const text = item.translation || item.text || "";
      return sum + 122 + Math.ceil(String(text).length / 42) * 24;
    }, 0);
    return 72 + roleWeight + itemWeight;
  }

  function distributeGroups(groups) {
    const columns = [[], []];
    const heights = [0, 0];
    for (const group of groups) {
      const target = heights[0] <= heights[1] ? 0 : 1;
      columns[target].push(group);
      heights[target] += estimateGroupHeight(group);
    }
    return columns;
  }

  function renderRemarks() {
    const root = $("[data-remark-grid]");
    const count = $("[data-result-count]");
    if (!root) return;
    const groups = groupedRemarks();
    const remarkCount = groups.reduce((sum, group) => sum + group.items.length, 0);
    if (count) count.textContent = `${groups.length} 组 / ${remarkCount} 条`;
    const columns = distributeGroups(groups);
    root.innerHTML = groups.length
      ? columns.map((column) => `
        <div class="masonry-column">
          ${column.map(remarkCard).join("")}
        </div>
      `).join("")
      : "<div class=\"empty-state\">当前筛选下没有可展示的 builder 言论。可以放宽日期、主题或关键词。</div>";
    root.onclick = (event) => {
      const button = event.target.closest("[data-open-remark]");
      if (!button) return;
      const item = allRemarks().find((remark) => remark.id === button.dataset.openRemark);
      if (item) openRemark(item);
    };
  }

  function renderPodcasts() {
    const root = $("[data-podcast-grid]");
    if (!root) return;
    const podcasts = state.payload.podcasts || [];
    root.innerHTML = podcasts.length ? podcasts.map((item) => `
      <article class="podcast-card">
        <span class="topic-chip">Podcast</span>
        <h3>${safe(item.title)}</h3>
        <p>${safe(item.name)} · ${safe(fmtDate(item.publishedAt))}</p>
        <p>${safe(compact(item.excerpt, 360))}</p>
        <div class="card-actions">
          <a class="source-link" href="${safe(item.url)}" target="_blank" rel="noreferrer">打开节目</a>
        </div>
      </article>
    `).join("") : "<div class=\"empty-state\">今天没有新的长访谈素材。</div>";
  }

  function openRemark(item) {
    const dialog = $("[data-dialog]");
    const root = $("[data-dialog-content]");
    if (!dialog || !root) return;
    root.innerHTML = `
      <h2 class="dialog-title">${safe(item.name)}</h2>
      <div class="dialog-meta">
        <span>${safe(item.role || `${item.handle} on X`)}</span>
        <span>${safe(fmtDate(item.createdAt))}</span>
      </div>
      ${tagChips(item, 8)}
      <p class="dialog-quote">${safe(item.translation || item.text)}</p>
      <div class="dialog-block">
        <h3>原文</h3>
        <p>${safe(item.text)}</p>
      </div>
      <div class="dialog-block">
        <a class="source-link" href="${safe(item.url)}" target="_blank" rel="noreferrer">查看原始链接</a>
      </div>
    `;
    dialog.showModal();
  }

  function bindControls() {
    const search = $("[data-search]");
    const date = $("[data-date-filter]");
    const topic = $("[data-topic-filter]");
    const source = $("[data-source-filter]");
    if (search) search.addEventListener("input", () => {
      state.filters.query = search.value.trim();
      renderAll();
    });
    if (date) date.addEventListener("change", () => {
      state.filters.date = date.value;
      renderAll();
    });
    if (topic) topic.addEventListener("change", () => {
      state.filters.topic = topic.value;
      renderAll();
    });
    if (source) source.addEventListener("change", () => {
      state.filters.source = source.value;
      renderAll();
    });
    const close = $("[data-dialog-close]");
    const dialog = $("[data-dialog]");
    if (close && dialog) close.addEventListener("click", () => dialog.close());
  }

  function renderAll() {
    renderPageTitle();
    renderMeta();
    renderStats();
    renderBuilders();
    renderRemarks();
    renderPodcasts();
  }

  async function init() {
    const response = await fetch("data/follow-builders-daily.json");
    state.payload = await response.json();
    renderFilters();
    bindControls();
    renderAll();
  }

  init().catch((error) => {
    const shell = $(".builder-shell");
    if (shell) shell.insertAdjacentHTML("beforeend", `<div class="empty-state">Builder 言论观察台加载失败：${safe(error.message)}</div>`);
  });
}());
