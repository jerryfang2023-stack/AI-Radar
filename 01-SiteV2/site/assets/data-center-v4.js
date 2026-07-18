(() => {
  "use strict";

  const root = document.querySelector("[data-page-root]");
  const loading = document.querySelector("[data-loading]");
  const params = new URLSearchParams(window.location.search);
  const legacyView = params.get("view");
  if (legacyView === "companies" || legacyView === "products") {
    params.set("view", "index");
    if (!params.get("detail") && !params.get("type")) {
      params.set("type", legacyView === "companies" ? "company" : "product");
    }
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }
  const knownViews = new Set(["events", "index", "fde", "hardware", "community", "viewpoints", "tag"]);
  const view = knownViews.has(params.get("view")) ? params.get("view") : "events";
  document.body.dataset.dcView = view;
  const pageSize = 20;
  const eventGroupOrder = [
    "模型、产品与服务",
    "融资与并购",
    "商业合作",
    "部署与案例",
    "组织、政策与法律",
    "研究结果",
    "AI 硬件"
  ];
  const eventDisplayPriority = new Map([
    ["融资与并购", 0],
    ["部署与案例", 1],
    ["商业合作", 2],
    ["模型、产品与服务", 3]
  ]);

  const viewConfig = {
    events: { title: "商业事件", description: "AI 行业商业事件数据库", detail: "event", dataKey: "events", placeholder: "搜索商业事件标题、公司、产品或关键词" },
    index: { title: "实体索引", description: "公司、产品、人物、技术、场景与行业", placeholder: "搜索实体、技术、场景或行业" },
    fde: { title: "FDE 实施", description: "企业 AI 实施记录", detail: "fde", dataKey: "fde", placeholder: "搜索客户、服务商、行业或场景" },
    hardware: { title: "AI 硬件", description: "硬件产品、供应与部署记录", detail: "hardware", dataKey: "hardware", placeholder: "搜索硬件、供应方或客户" },
    community: { title: "社群情报", description: "社群来源的一线材料", detail: "community", dataKey: "community", placeholder: "搜索标题、正文关键词或作者" },
    viewpoints: { title: "一线观点", description: "建设者与从业者公开观点", detail: "viewpoint", dataKey: "viewpoints", placeholder: "搜索观点、人物或机构" }
  };
  const communityPageSize = 12;
  const communityViewConfig = {
    all: { label: "全部", rail: "场景索引", empty: "没有匹配的社群情报" },
    industry_case: { label: "行业案例", rail: "商业场景", empty: "没有匹配的行业案例" },
    tool_tip: { label: "工具技巧", rail: "工具与方法", empty: "没有匹配的工具技巧" },
    opportunity: { label: "商业机会", rail: "机会场景", empty: "没有匹配的商业机会" },
    links: { label: "资料链接", rail: "资料场景", empty: "没有匹配的资料链接" }
  };
  const communityState = {
    manifest: [],
    payload: null,
    selectedDate: "",
    activeView: "all",
    activeScene: "all",
    page: 1,
    filters: {
      query: "",
      source: "all",
      scene: "all"
    }
  };
  const viewpointPageSize = 16;
  const viewpointState = {
    payload: null,
    entityIndex: null,
    mode: params.get("mode") === "people" ? "people" : "feed",
    person: params.get("person") || "",
    page: Math.max(Number(params.get("page") || 1), 1),
    filters: {
      query: (params.get("q") || "").trim(),
      topic: params.get("topic") || "",
      source: params.get("source") || "",
      date: params.get("date") || ""
    }
  };

  const escapeHtml = (value = "") => String(value)
    .replace(/&/gu, "&amp;")
    .replace(/</gu, "&lt;")
    .replace(/>/gu, "&gt;")
    .replace(/"/gu, "&quot;")
    .replace(/'/gu, "&#039;");

  const safeExternalUrl = (value = "") => {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };

  const currentParams = (overrides = {}, remove = []) => {
    const next = new URLSearchParams(params);
    for (const key of remove) next.delete(key);
    for (const [key, value] of Object.entries(overrides)) {
      if (value === "" || value === null || value === undefined) next.delete(key);
      else next.set(key, value);
    }
    return `data-center.html?${next.toString()}`;
  };

  const viewLink = (targetView, extras = {}) => {
    const next = new URLSearchParams({ view: targetView, ...extras });
    return `data-center.html?${next.toString()}`;
  };

  const detailLink = (targetView, kind, id) => viewLink(targetView, { detail: kind, id });
  const splitDataUrl = (section, id = "") => id
    ? `data/data-center-v4/${section}/${encodeURIComponent(id)}.json`
    : `data/data-center-v4/${section}.json`;
  const normalizeTags = (tags = []) => tags.map((tag) => typeof tag === "string" ? { id: tag, name: tag } : tag).filter((tag) => tag?.name);
  const taxonomyToken = (tag = {}) => tag.dimensionId && tag.id ? `${tag.dimensionId}:${tag.id}` : tag.id || tag.name || "";
  const tagLink = (tag) => {
    const normalized = typeof tag === "string" ? { id: tag, name: tag } : tag;
    return viewLink("tag", { tag: taxonomyToken(normalized), label: normalized.name || "", sourceView: view });
  };
  const matchesTaxonomy = (item, selected) => {
    if (!selected) return true;
    const values = normalizeTags(item.classifications?.length ? item.classifications : item.tags);
    return values.some((entry) => [taxonomyToken(entry), entry.id, entry.name].includes(selected));
  };

  const renderTags = (tags = [], limit = 2) => {
    const items = normalizeTags(tags).slice(0, limit);
    if (!items.length) return "";
    return `<span class="dc-tags">${items.map((tag) => `<a class="dc-tag" href="${escapeHtml(tagLink(tag))}" data-stop-row>${escapeHtml(tag.name)}</a>`).join("")}</span>`;
  };

  const optionList = (items, selected, emptyLabel) => [
    `<option value="">${escapeHtml(emptyLabel)}</option>`,
    ...items.map((item) => {
      const value = typeof item === "string" ? item : item.value;
      const label = typeof item === "string" ? item : item.label;
      return `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
    })
  ].join("");

  const uniqueSorted = (items) => [...new Set(items.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b), "zh-CN"));

  function setActiveNavigation() {
    document.querySelectorAll("[data-view-link]").forEach((link) => {
      if (link.dataset.viewLink === view || (view === "tag" && link.dataset.viewLink === params.get("sourceView"))) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function matchesQuery(item, fields, query) {
    if (!query) return true;
    const haystack = fields.flatMap((field) => {
      const value = item[field];
      if (Array.isArray(value)) return value.map((entry) => typeof entry === "object" ? JSON.stringify(entry) : entry);
      return typeof value === "object" && value ? JSON.stringify(value) : value;
    }).filter(Boolean).join(" ").toLocaleLowerCase();
    const terms = query.toLocaleLowerCase().split(/\s+/u).filter(Boolean);
    return terms.every((term) => haystack.includes(term));
  }

  function eventCurrentBatchMode(targetView = view) {
    return targetView === "events" && !["from", "to"].some((key) => params.get(key));
  }

  function monthlyProjectionMode(targetView = view) {
    return ["fde", "hardware"].includes(targetView) && !["from", "to"].some((key) => params.get(key));
  }

  function currentDataMonth(data) {
    return String(data.meta.currentDate || "").slice(0, 7);
  }

  function entityIndexItems(data) {
    return [
      ...(data.companies || []).map((item) => ({
        ...item,
        indexType: "company",
        indexKind: "公司 / 机构",
        indexSub: (item.aliases || []).join("、"),
        detailKind: "entity"
      })),
      ...(data.products || []).map((item) => ({
        ...item,
        indexType: "product",
        indexKind: item.type || "产品 / 模型",
        indexSub: (item.companyNames || []).join("、") || "所属公司未披露",
        detailKind: "entity"
      })),
      ...(data.people || []).map((item) => ({
        ...item,
        indexType: "person",
        indexKind: "人物",
        indexSub: [item.organization, item.role].filter(Boolean).join(" · "),
        detailKind: "entity"
      })),
      ...(data.taxonomyNodes || []).map((item) => ({
        ...item,
        aliases: [],
        tags: [],
        indexType: item.nodeType === "technology" ? "technology" : "context",
        indexKind: item.nodeType === "technology" ? "AI 技术" : item.nodeType === "use_case" ? "使用场景" : "行业",
        indexSub: `${item.eventIds.length} 条关联事件`,
        detailKind: "taxonomy"
      }))
    ].sort((a, b) => a.name.localeCompare(b.name, "zh-CN") || a.indexType.localeCompare(b.indexType));
  }

  function sortEventsForDisplay(items) {
    return items
      .map((item, index) => ({ item, index }))
      .sort((a, b) => (
        (eventDisplayPriority.get(a.item.eventGroup) ?? 4)
        - (eventDisplayPriority.get(b.item.eventGroup) ?? 4)
        || a.index - b.index
      ))
      .map(({ item }) => item);
  }

  function collectionForView(data, targetView = view) {
    if (targetView === "index") return entityIndexItems(data);
    const config = viewConfig[targetView];
    return config ? data[config.dataKey] || [] : [];
  }

  function filteredItems(data, targetView = view) {
    const query = (params.get("q") || "").trim();
    const type = params.get("type") || "";
    const tag = params.get("tag") || "";
    const person = params.get("person") || "";
    const stage = params.get("stage") || "";
    const industry = params.get("industry") || "";
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    let items = [...collectionForView(data, targetView)];

    if (targetView === "events") {
      if (eventCurrentBatchMode()) items = items.filter((item) => item.dataDate === data.meta.currentDate);
      items = items.filter((item) => (
        matchesQuery(item, [
          "title",
          "originalTitle",
          "subject",
          "action",
          "object",
          "entityNames",
          "productName",
          "eventTypeLabel",
          "eventGroup",
          "publisher",
          "metrics",
          "locations",
          "tags",
          "classifications",
          "claims",
          "sources",
          "sourceExcerpt"
        ], query)
        && (!type || item.eventGroup === type || item.eventType === type)
        && matchesTaxonomy(item, tag)
        && (!from || item.dataDate >= from)
        && (!to || item.dataDate <= to)
      ));
      items = sortEventsForDisplay(items);
    } else if (targetView === "index") {
      items = items.filter((item) => (
        matchesQuery(item, ["name", "aliases", "companyNames", "type", "indexKind", "indexSub", "tags"], query)
        && (!type || item.indexType === type)
        && (!tag || normalizeTags(item.tags).some((itemTag) => itemTag.name === tag || itemTag.id === tag))
      ));
    } else if (targetView === "fde") {
      if (monthlyProjectionMode(targetView)) items = items.filter((item) => item.dataDate.startsWith(`${currentDataMonth(data)}-`));
      items = items.filter((item) => (
        matchesQuery(item, ["title", "customer", "vendor", "industry", "useCase", "reportedNeed"], query)
        && (!stage || item.stage === stage)
        && (!industry || item.industry === industry)
        && (!tag || normalizeTags(item.tags).some((itemTag) => itemTag.name === tag || itemTag.id === tag))
        && (!from || item.dataDate >= from)
        && (!to || item.dataDate <= to)
      ));
    } else if (targetView === "hardware") {
      if (monthlyProjectionMode(targetView)) items = items.filter((item) => item.dataDate.startsWith(`${currentDataMonth(data)}-`));
      items = items.filter((item) => (
        matchesQuery(item, ["title", "hardwareType", "supplier", "customer", "region"], query)
        && (!type || item.hardwareType === type)
        && (!tag || normalizeTags(item.tags).some((itemTag) => itemTag.name === tag || itemTag.id === tag))
        && (!from || item.dataDate >= from)
        && (!to || item.dataDate <= to)
      ));
    } else if (targetView === "community") {
      items = items.filter((item) => (
        matchesQuery(item, ["title", "content", "author", "community", "tags"], query)
        && (!tag || item.tags.includes(tag))
        && (!from || item.date >= from)
        && (!to || item.date <= to)
      ));
    } else if (targetView === "viewpoints") {
      items = items.filter((item) => (
        matchesQuery(item, ["title", "translatedContent", "originalContent", "person", "handle", "role", "organization", "tags"], query)
        && (!person || item.person === person)
        && (!tag || item.tags.includes(tag))
        && (!from || item.date >= from)
        && (!to || item.date <= to)
      ));
    }

    return items;
  }

  function toolbarFilters(data, targetView) {
    const selectedType = params.get("type") || "";
    const selectedTag = params.get("tag") || "";
    const selectedPerson = params.get("person") || "";
    const selectedStage = params.get("stage") || "";
    const items = collectionForView(data, targetView);
    const allTags = uniqueSorted(items.flatMap((item) => normalizeTags(item.tags).map((tag) => tag.name)));
    const pieces = [];

    if (targetView === "events") {
      pieces.push(`<select class="dc-select" name="type" aria-label="商业事件类型" data-auto-submit>${optionList(eventGroupOrder, selectedType, "全部商业事件类型")}</select>`);
      const classifications = new Map(items.flatMap((item) => normalizeTags(item.classifications)).map((entry) => [
        taxonomyToken(entry),
        `${entry.dimensionName || "分类"} · ${entry.name}`
      ]));
      pieces.push(`<select class="dc-select" name="tag" aria-label="技术、场景与产品分类" data-auto-submit>${optionList([...classifications].map(([value, label]) => ({ value, label })).sort((a, b) => a.label.localeCompare(b.label, "zh-CN")), selectedTag, "技术 / 场景 / 产品")}</select>`);
    } else if (targetView === "fde") {
      pieces.push(`<select class="dc-select" name="stage" aria-label="实施阶段" data-auto-submit>${optionList(uniqueSorted(items.map((item) => item.stage).filter(Boolean)).map((value) => ({ value, label: items.find((item) => item.stage === value)?.stageLabel || value })), selectedStage, "全部实施阶段")}</select>`);
    } else if (targetView === "hardware") {
      pieces.push(`<select class="dc-select" name="type" aria-label="硬件类型" data-auto-submit>${optionList(uniqueSorted(items.map((item) => item.hardwareType)), selectedType, "全部硬件类型")}</select>`);
    } else if (targetView === "viewpoints") {
      pieces.push(`<select class="dc-select" name="person" aria-label="人物" data-auto-submit>${optionList(uniqueSorted(items.map((item) => item.person)), selectedPerson, "全部人物")}</select>`);
    }

    if (targetView !== "events") pieces.push(`<select class="dc-select" name="tag" aria-label="Tag" data-auto-submit>${optionList(allTags, selectedTag, "Tag")}</select>`);
    return pieces.join("");
  }

  function renderToolbar(data, targetView) {
    const config = viewConfig[targetView];
    const query = params.get("q") || "";
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const industry = params.get("industry") || "";
    const industries = targetView === "fde" ? uniqueSorted(data.fde.map((item) => item.industry).filter((value) => value && value !== "未披露")) : [];
    const dates = collectionForView(data, targetView).map((item) => ["events", "fde", "hardware"].includes(targetView) ? item.dataDate : item.date).filter(Boolean).sort();
    const minimumDate = dates[0] || "";
    const maximumDate = dates.at(-1) || "";
    const moreActive = Boolean(from || to || industry);
    const isIndex = targetView === "index";

    return `
      <form class="dc-toolbar${isIndex ? " dc-toolbar-index" : ""}" method="get" action="data-center.html" data-filter-form>
        <input type="hidden" name="view" value="${escapeHtml(targetView)}">
        ${isIndex && params.get("type") ? `<input type="hidden" name="type" value="${escapeHtml(params.get("type"))}">` : ""}
        <label class="dc-search">
          <span class="sr-only">关键词</span>
          <input class="dc-input" name="q" value="${escapeHtml(query)}" placeholder="${escapeHtml(config.placeholder)}" autocomplete="off">
        </label>
        <button class="dc-button" type="submit">搜索</button>
        ${toolbarFilters(data, targetView)}
        ${isIndex ? "" : `<details class="dc-more"${moreActive ? " open" : ""}>
          <summary class="dc-filter-summary"${moreActive ? " data-active=true" : ""}>更多筛选</summary>
          <div class="dc-more-panel">
            <label class="dc-field">开始日期<input type="date" name="from" value="${escapeHtml(from)}" min="${escapeHtml(minimumDate)}" max="${escapeHtml(to || maximumDate)}"></label>
            <label class="dc-field">结束日期<input type="date" name="to" value="${escapeHtml(to)}" min="${escapeHtml(from || minimumDate)}" max="${escapeHtml(maximumDate)}"></label>
            ${targetView === "fde" ? `<label class="dc-field">行业<select name="industry">${optionList(industries, industry, "全部行业")}</select></label>` : ""}
            <button class="dc-filter-apply" type="submit">应用筛选</button>
          </div>
        </details>`}
        <a class="dc-clear" href="${escapeHtml(viewLink(targetView))}">清除条件</a>
      </form>
    `;
  }

  function renderIndexSwitch(data) {
    const query = (params.get("q") || "").trim();
    const tag = params.get("tag") || "";
    const selectedType = params.get("type") || "";
    const matching = entityIndexItems(data).filter((item) => (
      matchesQuery(item, ["name", "aliases", "companyNames", "type", "indexKind", "indexSub", "tags"], query)
      && (!tag || normalizeTags(item.tags).some((itemTag) => itemTag.name === tag || itemTag.id === tag))
    ));
    const choices = [
      { value: "", label: "全部", count: matching.length },
      { value: "company", label: "公司与机构", count: matching.filter((item) => item.indexType === "company").length },
      { value: "product", label: "产品模型服务", count: matching.filter((item) => item.indexType === "product").length },
      { value: "person", label: "人物", count: matching.filter((item) => item.indexType === "person").length },
      { value: "technology", label: "AI 技术", count: matching.filter((item) => item.indexType === "technology").length },
      { value: "context", label: "场景与行业", count: matching.filter((item) => item.indexType === "context").length }
    ];
    return `
      <nav class="dc-index-switch" aria-label="实体索引类型">
        ${choices.map((choice) => `
          <a href="${escapeHtml(currentParams({ type: choice.value, page: "" }))}"${selectedType === choice.value ? ` aria-current="page"` : ""}>
            <span>${escapeHtml(choice.label)}</span>
            <strong>${choice.count}</strong>
          </a>
        `).join("")}
      </nav>
    `;
  }

  function pageHead(data, targetView, count) {
    const config = viewConfig[targetView];
    const auxiliaryDate = eventCurrentBatchMode(targetView)
      ? `<span class="dc-data-date">数据日期 ${escapeHtml(data.meta.currentDate || "未披露")}</span>`
      : monthlyProjectionMode(targetView)
        ? `<span class="dc-data-date">数据月份 ${escapeHtml(currentDataMonth(data) || "未披露")}</span>`
        : "";
    return `
      <div class="dc-page-head">
        <h1>${escapeHtml(config.title)}</h1>
        <span class="dc-page-description">${escapeHtml(config.description)}</span>
        ${auxiliaryDate}
        <span class="dc-result-count">${count} 条</span>
      </div>
    `;
  }

  function rowData(item, targetView, showDate) {
    if (targetView === "events") {
      return {
        kind: item.eventGroup,
        date: showDate ? item.dataDate : "",
        title: item.title,
        sub: "",
        tags: item.displayTags || item.tags,
        href: detailLink("events", "event", item.id)
      };
    }
    if (targetView === "index") {
      return { kind: item.indexKind, date: "", title: item.name, sub: item.indexSub, tags: item.tags, href: detailLink("index", item.detailKind, item.id) };
    }
    if (targetView === "fde") {
      return { kind: item.stageLabel, date: item.date, title: item.title, sub: "", tags: item.tags, href: detailLink("fde", "fde", item.id) };
    }
    if (targetView === "hardware") {
      return {
        kind: item.hardwareType,
        date: item.date,
        title: item.title,
        sub: `来源：${item.sourceName || "来源未披露"}`,
        tags: item.tags,
        href: detailLink("hardware", "hardware", item.id)
      };
    }
    if (targetView === "community") {
      return { kind: item.community, date: item.date, title: item.title, sub: "", tags: item.tags, href: detailLink("community", "community", item.id) };
    }
    return { kind: item.person, date: item.date, title: item.title, sub: "", tags: item.tags, href: detailLink("viewpoints", "viewpoint", item.id) };
  }

  function renderRows(items, targetView, showDate = true) {
    if (!items.length) {
      const query = params.get("q");
      const message = query
        ? `未找到“${escapeHtml(query)}”相关数据`
        : targetView === "events" && eventCurrentBatchMode()
          ? "当日暂无商业事件"
          : monthlyProjectionMode(targetView)
            ? `本月暂无${targetView === "fde" ? " FDE 实施" : " AI 硬件"}记录`
            : "未找到符合当前条件的数据";
      return `<div class="dc-empty">${message}<a href="${escapeHtml(viewLink(targetView))}">返回全部</a></div>`;
    }
    return `<div class="dc-list">${items.map((item) => {
      const row = rowData(item, targetView, showDate);
      return `
        <div class="dc-list-row">
          <a class="dc-row-hit" href="${escapeHtml(row.href)}" aria-label="${escapeHtml(row.title)}"></a>
          <span class="dc-row-kind">${escapeHtml(row.kind || "未披露")}${row.date ? `<small class="dc-row-date">${escapeHtml(row.date)}</small>` : ""}</span>
          <span class="dc-row-title">${escapeHtml(row.title)}${row.sub ? `<small>${escapeHtml(row.sub)}</small>` : ""}</span>
          ${renderTags(row.tags, 2)}
        </div>
      `;
    }).join("")}</div>`;
  }

  function renderPagination(total, targetView) {
    const pages = Math.ceil(total / pageSize);
    if (pages <= 1) return "";
    const current = Math.min(Math.max(Number(params.get("page") || 1), 1), pages);
    const pageNumbers = uniqueSorted([1, current - 1, current, current + 1, pages].filter((number) => number >= 1 && number <= pages)).sort((a, b) => a - b);
    let previous = 0;
    const numbers = [];
    for (const number of pageNumbers) {
      if (number - previous > 1) numbers.push("<span>…</span>");
      numbers.push(number === current
        ? `<span aria-current="page">${number}</span>`
        : `<a href="${escapeHtml(currentParams({ page: number }))}">${number}</a>`);
      previous = number;
    }
    return `
      <nav class="dc-pagination" aria-label="数字分页">
        ${current > 1 ? `<a href="${escapeHtml(currentParams({ page: current - 1 }))}">上一页</a>` : ""}
        ${numbers.join("")}
        ${current < pages ? `<a href="${escapeHtml(currentParams({ page: current + 1 }))}">下一页</a>` : ""}
      </nav>
    `;
  }

  function renderListPage(data, targetView) {
    const allItems = filteredItems(data, targetView);
    const isCurrentEventBatch = targetView === "events" && eventCurrentBatchMode();
    const current = Math.max(Number(params.get("page") || 1), 1);
    const items = allItems.slice((current - 1) * pageSize, current * pageSize);
    root.innerHTML = `
      ${pageHead(data, targetView, allItems.length)}
      ${renderToolbar(data, targetView)}
      ${targetView === "index" ? renderIndexSwitch(data) : ""}
      ${renderRows(items, targetView, !isCurrentEventBatch)}
      ${renderPagination(allItems.length, targetView)}
    `;
  }

  function communityTidy(value = "") {
    return String(value || "").replace(/\s+/gu, " ").trim();
  }

  function communityCompact(value = "", limit = 220) {
    const text = communityTidy(value);
    return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
  }

  function communityDateLabel(value = "") {
    return String(value || "").slice(0, 10).replaceAll("-", ".");
  }

  function communityPublishedAt(item, baseValue = communityState.payload?.meta?.generatedAt) {
    const publishedAt = communityTidy(item.publishedAt);
    if (publishedAt) {
      const normalized = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/u.test(publishedAt)
        ? `${publishedAt.replace(/\s+/u, "T")}${publishedAt.length === 16 ? ":00" : ""}+08:00`
        : publishedAt;
      const parsed = Date.parse(normalized);
      if (Number.isFinite(parsed)) return parsed;
    }
    const base = Date.parse(baseValue || "") || Date.now();
    const relative = communityTidy(item.relativeTime);
    const amount = Number.parseFloat(relative.match(/\d+(?:\.\d+)?/u)?.[0] || "");
    if (/刚刚|刚才|今天/u.test(relative)) return base;
    if (/分钟|分钟前/u.test(relative) && Number.isFinite(amount)) return base - amount * 60 * 1000;
    if (/小时|小时前/u.test(relative) && Number.isFinite(amount)) return base - amount * 60 * 60 * 1000;
    if (/昨天/u.test(relative)) return base - 24 * 60 * 60 * 1000;
    if (/天前/u.test(relative) && Number.isFinite(amount)) return base - amount * 24 * 60 * 60 * 1000;
    return 0;
  }

  function communityDisplayTitle(item) {
    const title = communityTidy(item.title || item.detailTitle || "未命名社群材料");
    const cutMarkers = [" 阅读本文你将获得", " 本文你将获得", " 你将获得", " 我叫", " 从事"];
    const cutAt = cutMarkers
      .map((marker) => title.indexOf(marker))
      .filter((index) => index > 12)
      .sort((a, b) => a - b)[0];
    const sentenceEnd = title.search(/[。！？!?]/u);
    const boundary = [cutAt, sentenceEnd > 18 ? sentenceEnd + 1 : -1]
      .filter((index) => index > 0)
      .sort((a, b) => a - b)[0];
    return communityCompact(boundary ? title.slice(0, boundary) : title, 72);
  }

  function communityDisplaySummary(item, title = communityDisplayTitle(item), limit = 210) {
    const rawTitle = communityTidy(item.title || item.detailTitle || "");
    let body = communityTidy(item.summary || item.evidence || item.excerpt || "");
    if (rawTitle && body.startsWith(rawTitle)) body = body.slice(rawTitle.length);
    else if (title && body.startsWith(title)) body = body.slice(title.length);
    body = body.replace(/^[\s,.;:!?，。；：！？、+\-—]+/u, "").trim();
    return communityCompact(body || item.evidence || item.excerpt || "", limit);
  }

  function communityLinks(item) {
    const links = Array.isArray(item.links) ? item.links : [];
    const seen = new Set();
    return links.filter((link) => {
      const href = safeExternalUrl(link?.href || "");
      if (!href || seen.has(href)) return false;
      seen.add(href);
      return true;
    }).map((link) => ({ ...link, href: safeExternalUrl(link.href) }));
  }

  function communityCanonicalItemUrl(item) {
    const url = safeExternalUrl(item.url || "");
    if (!url) return "";
    const sourceUrl = safeExternalUrl(communityState.payload?.sources?.[item.source]?.url || "");
    if (url === sourceUrl) return "";
    if (item.source === "scys" && /^https:\/\/scys\.com\/?(?:\?.*)?$/u.test(url)) return "";
    if (item.source === "aipoju" && /^https:\/\/aipoju\.com\/(?:index|search)?(?:\?.*)?$/u.test(url)) return "";
    return url;
  }

  function communityDedupeKey(item) {
    const url = communityCanonicalItemUrl(item);
    if (url) return `${item.source}:url:${url}`;
    const normalized = communityTidy(communityDisplayTitle(item))
      .toLocaleLowerCase()
      .replace(/[^\p{Script=Han}\p{Letter}\p{Number}]+/gu, "")
      .slice(0, 96);
    return `${item.source}:title:${normalized || item.id}`;
  }

  function communityUnique(values = []) {
    return [...new Set(values.flat().map(communityTidy).filter(Boolean))];
  }

  function communityItems() {
    const groups = new Map();
    for (const item of communityState.payload?.items || []) {
      const key = communityDedupeKey(item);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(item);
    }
    return [...groups.values()].map((group) => {
      const sorted = [...group].sort((a, b) => communityPublishedAt(b) - communityPublishedAt(a));
      const base = { ...sorted[0] };
      base.links = communityUnique(group.flatMap((item) => communityLinks(item).map((link) => link.href)))
        .map((href) => group.flatMap(communityLinks).find((link) => link.href === href) || { href, text: href });
      base.tools = communityUnique(group.flatMap((item) => item.tools || []));
      base.painPoints = communityUnique(group.flatMap((item) => item.painPoints || []));
      base.reusableMethod = communityUnique(group.flatMap((item) => item.reusableMethod || []));
      base.matchedKeywords = communityUnique(group.flatMap((item) => item.matchedKeywords || item.collection?.keywords || []));
      base.duplicateCount = group.length;
      return base;
    });
  }

  function communitySourceLabel(item) {
    return item.sourceName || communityState.payload?.sources?.[item.source]?.name || item.source || "未知来源";
  }

  function communityMatchesView(item, targetView = communityState.activeView) {
    return targetView === "all"
      || (targetView === "links" ? communityLinks(item).length > 0 : item.insightType === targetView);
  }

  function communityMatchesQuery(item, query) {
    if (!query) return true;
    const haystack = [
      item.title,
      item.author,
      item.role,
      item.scene,
      item.industry,
      item.summary,
      item.evidence,
      item.excerpt,
      item.monetization,
      item.resultSignal,
      item.collection?.keyword,
      ...(item.tools || []),
      ...(item.painPoints || []),
      ...(item.reusableMethod || []),
      ...(item.matchedKeywords || []),
      ...communityLinks(item).flatMap((link) => [link.href, link.text])
    ].filter(Boolean).join(" ").toLocaleLowerCase();
    return query.split(/\s+/u).filter(Boolean).every((term) => haystack.includes(term));
  }

  function communityFilteredItems({ ignoreScene = false } = {}) {
    const query = communityState.filters.query.trim().toLocaleLowerCase();
    return communityItems()
      .filter((item) => {
        const scene = communityState.filters.scene !== "all" ? communityState.filters.scene : communityState.activeScene;
        return communityMatchesView(item)
          && (communityState.filters.source === "all" || item.source === communityState.filters.source)
          && (ignoreScene || scene === "all" || item.scene === scene)
          && communityMatchesQuery(item, query);
      })
      .sort((a, b) => communityPublishedAt(b) - communityPublishedAt(a));
  }

  function communityItemTags(item) {
    const hidden = new Set(["待确认", "未识别", "未识别行业", "未分类", "未知"]);
    return communityUnique([item.scene, item.industry, ...(item.tools || []), item.monetization])
      .filter((tag) => !hidden.has(tag));
  }

  function communityRenderTabs() {
    const items = communityItems();
    return `
      <nav class="dc-community-tabs" aria-label="社群情报分类">
        ${Object.entries(communityViewConfig).map(([key, config]) => {
          const count = items.filter((item) => communityMatchesView(item, key)).length;
          return `<button type="button" data-community-view="${escapeHtml(key)}"${communityState.activeView === key ? ' aria-current="page"' : ""}><span>${escapeHtml(config.label)}</span><strong>${count}</strong></button>`;
        }).join("")}
      </nav>
    `;
  }

  function communityRenderScenes() {
    const items = communityFilteredItems({ ignoreScene: true });
    const groups = [...items.reduce((map, item) => {
      const scene = item.scene || "未分类";
      map.set(scene, (map.get(scene) || 0) + 1);
      return map;
    }, new Map()).entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"));
    return `
      <aside class="dc-community-rail">
        <div class="dc-community-section-head"><h2>${escapeHtml(communityViewConfig[communityState.activeView].rail)}</h2><span>${groups.length} 类</span></div>
        <div class="dc-community-scene-list">
          <button type="button" data-community-scene="all"${communityState.activeScene === "all" ? ' aria-current="page"' : ""}><strong>全部</strong><span>${items.length} 条</span></button>
          ${groups.map(([scene, count]) => `<button type="button" data-community-scene="${escapeHtml(scene)}"${communityState.activeScene === scene ? ' aria-current="page"' : ""}><strong>${escapeHtml(scene)}</strong><span>${count} 条</span></button>`).join("")}
        </div>
      </aside>
    `;
  }

  function communityCard(item) {
    const originalUrl = communityCanonicalItemUrl(item);
    const links = communityLinks(item);
    const title = communityDisplayTitle(item);
    const date = item.publishedAt || item.relativeTime || communityState.selectedDate;
    return `
      <article class="dc-community-card">
        <div class="dc-community-card-meta">
          <span>${escapeHtml(communitySourceLabel(item))}</span>
          <span>${escapeHtml(item.author || "作者未披露")}</span>
          <time>${escapeHtml(date || "日期未披露")}</time>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(communityDisplaySummary(item, title))}</p>
        ${communityItemTags(item).length ? `<div class="dc-community-card-tags">${communityItemTags(item).slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        <div class="dc-community-card-actions">
          <button type="button" data-community-open="${escapeHtml(item.id)}">查看详情</button>
          ${links.length ? `<span>${links.length} 个资料链接</span>` : ""}
          ${originalUrl ? `<a href="${escapeHtml(originalUrl)}" target="_blank" rel="noopener noreferrer">打开原帖</a>` : ""}
        </div>
      </article>
    `;
  }

  function communityRenderPagination(total) {
    const pages = Math.ceil(total / communityPageSize);
    if (pages <= 1) return "";
    communityState.page = Math.min(Math.max(communityState.page, 1), pages);
    const candidates = [1, communityState.page - 1, communityState.page, communityState.page + 1, pages]
      .filter((number) => number >= 1 && number <= pages);
    const numbers = [...new Set(candidates)].sort((a, b) => a - b);
    let previous = 0;
    return `
      <nav class="dc-pagination" aria-label="社群情报数字分页">
        ${communityState.page > 1 ? `<button type="button" data-community-page="${communityState.page - 1}">上一页</button>` : ""}
        ${numbers.map((number) => {
          const gap = number - previous > 1 ? "<span>…</span>" : "";
          previous = number;
          return `${gap}<button type="button" data-community-page="${number}"${number === communityState.page ? ' aria-current="page"' : ""}>${number}</button>`;
        }).join("")}
        ${communityState.page < pages ? `<button type="button" data-community-page="${communityState.page + 1}">下一页</button>` : ""}
      </nav>
    `;
  }

  function communityRender() {
    const items = communityFilteredItems();
    const start = (communityState.page - 1) * communityPageSize;
    const pageItems = items.slice(start, start + communityPageSize);
    const sources = Object.entries(communityState.payload?.sources || {});
    const scenes = [...new Set(communityFilteredItems({ ignoreScene: true }).map((item) => item.scene).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "zh-CN"));
    root.innerHTML = `
      <div class="dc-page-head">
        <h1>社群情报</h1>
        <span class="dc-page-description">社群来源的一线材料</span>
        <span class="dc-data-date">数据日期 ${escapeHtml(communityState.selectedDate || "未披露")}</span>
        <span class="dc-result-count">${items.length} 条</span>
      </div>
      <form class="dc-toolbar dc-community-toolbar" data-community-filter-form>
        <label class="dc-search"><span class="sr-only">关键词</span><input class="dc-input" name="q" value="${escapeHtml(communityState.filters.query)}" placeholder="搜索场景、案例、工具或链接" autocomplete="off"></label>
        <button class="dc-button" type="submit">搜索</button>
        <select class="dc-select" name="date" aria-label="数据日期">
          ${communityState.manifest.map((entry) => `<option value="${escapeHtml(entry.date)}"${entry.date === communityState.selectedDate ? " selected" : ""}>${escapeHtml(communityDateLabel(entry.date))}</option>`).join("")}
        </select>
        <select class="dc-select" name="source" aria-label="来源">
          <option value="all">全部来源</option>
          ${sources.map(([key, source]) => `<option value="${escapeHtml(key)}"${key === communityState.filters.source ? " selected" : ""}>${escapeHtml(source.name || key)}</option>`).join("")}
        </select>
        <select class="dc-select" name="scene" aria-label="场景">
          <option value="all">全部场景</option>
          ${scenes.map((scene) => `<option value="${escapeHtml(scene)}"${scene === communityState.filters.scene ? " selected" : ""}>${escapeHtml(scene)}</option>`).join("")}
        </select>
        <button class="dc-clear" type="button" data-community-clear>清除条件</button>
      </form>
      ${communityRenderTabs()}
      <div class="dc-community-layout">
        ${communityRenderScenes()}
        <section class="dc-community-stage">
          <div class="dc-community-section-head"><h2>${escapeHtml(communityViewConfig[communityState.activeView].label)}</h2><span>${items.length} 条</span></div>
          <div class="dc-community-grid">
            ${pageItems.length ? pageItems.map(communityCard).join("") : `<div class="dc-empty">${escapeHtml(communityViewConfig[communityState.activeView].empty)}</div>`}
          </div>
          ${communityRenderPagination(items.length)}
        </section>
      </div>
    `;
    communityBindInteractions();
  }

  function communityOpenDialog(id) {
    const item = communityItems().find((entry) => String(entry.id) === String(id));
    const dialog = document.querySelector("[data-community-dialog]");
    const content = document.querySelector("[data-community-dialog-content]");
    if (!item || !dialog || !content) return;
    const title = communityDisplayTitle(item);
    const originalUrl = communityCanonicalItemUrl(item);
    const links = communityLinks(item);
    content.innerHTML = `
      <div class="dc-community-dialog-meta">
        <span>${escapeHtml(communitySourceLabel(item))}</span>
        <span>${escapeHtml(item.author || "作者未披露")}</span>
        <span>${escapeHtml(item.publishedAt || item.relativeTime || communityState.selectedDate)}</span>
      </div>
      <h2>${escapeHtml(title)}</h2>
      ${communityItemTags(item).length ? `<div class="dc-community-card-tags">${communityItemTags(item).slice(0, 6).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
      <section><h3>内容摘录</h3><p>${escapeHtml(item.evidence || item.excerpt || item.summary || "未披露")}</p></section>
      <section>
        <h3>原始入口与资料链接</h3>
        <div class="dc-community-link-list">
          ${originalUrl ? `<a href="${escapeHtml(originalUrl)}" target="_blank" rel="noopener noreferrer"><strong>原始帖子</strong><span>${escapeHtml(originalUrl)}</span></a>` : ""}
          ${links.map((link, index) => `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer"><strong>资料 ${index + 1}</strong><span>${escapeHtml(link.text || link.href)}</span></a>`).join("")}
          ${!originalUrl && !links.length ? "<p>当前记录没有识别到原帖或外部资料链接。</p>" : ""}
        </div>
      </section>
    `;
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function communitySetUrlDate(date) {
    const next = new URL(window.location.href);
    next.searchParams.set("view", "community");
    next.searchParams.set("date", date);
    window.history.replaceState({}, "", next);
  }

  async function communityFetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  async function communityLoadDate(date) {
    const entry = communityState.manifest.find((item) => item.date === date) || communityState.manifest[0];
    const href = entry?.href ? `data/community-intelligence-daily/${entry.href}` : "data/community-intelligence.json";
    communityState.payload = await communityFetchJson(href);
    communityState.selectedDate = entry?.date || communityState.payload?.meta?.date || "";
    communityState.page = 1;
    communitySetUrlDate(communityState.selectedDate);
  }

  function communityBindInteractions() {
    const form = root.querySelector("[data-community-filter-form]");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      communityState.filters.query = String(new FormData(form).get("q") || "").trim();
      communityState.page = 1;
      communityRender();
    });
    form?.elements.namedItem("date")?.addEventListener("change", async (event) => {
      loading.hidden = false;
      try {
        await communityLoadDate(event.target.value);
        communityRender();
      } finally {
        loading.hidden = true;
      }
    });
    form?.elements.namedItem("source")?.addEventListener("change", (event) => {
      communityState.filters.source = event.target.value;
      communityState.activeScene = "all";
      communityState.filters.scene = "all";
      communityState.page = 1;
      communityRender();
    });
    form?.elements.namedItem("scene")?.addEventListener("change", (event) => {
      communityState.filters.scene = event.target.value;
      communityState.activeScene = "all";
      communityState.page = 1;
      communityRender();
    });
    root.querySelector("[data-community-clear]")?.addEventListener("click", () => {
      communityState.filters = { query: "", source: "all", scene: "all" };
      communityState.activeScene = "all";
      communityState.page = 1;
      communityRender();
    });
    root.querySelectorAll("[data-community-view]").forEach((button) => button.addEventListener("click", () => {
      communityState.activeView = button.dataset.communityView;
      communityState.activeScene = "all";
      communityState.filters.scene = "all";
      communityState.page = 1;
      communityRender();
    }));
    root.querySelectorAll("[data-community-scene]").forEach((button) => button.addEventListener("click", () => {
      communityState.activeScene = button.dataset.communityScene;
      communityState.filters.scene = "all";
      communityState.page = 1;
      communityRender();
    }));
    root.querySelectorAll("[data-community-page]").forEach((button) => button.addEventListener("click", () => {
      communityState.page = Number(button.dataset.communityPage) || 1;
      communityRender();
      document.querySelector(".dc-page-head")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }));
    root.querySelectorAll("[data-community-open]").forEach((button) => button.addEventListener("click", () => communityOpenDialog(button.dataset.communityOpen)));
  }

  async function renderCommunityPage() {
    const manifest = await communityFetchJson("data/community-intelligence-daily/index.json").catch(() => ({ dates: [] }));
    communityState.manifest = (manifest.dates || []).filter((item) => item?.date)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const requestedDate = params.get("date") || communityState.manifest[0]?.date || "";
    await communityLoadDate(requestedDate);
    communityRender();
    const dialog = document.querySelector("[data-community-dialog]");
    document.querySelector("[data-community-dialog-close]")?.addEventListener("click", () => dialog?.close());
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  function viewpointTidy(value = "") {
    return String(value || "").replace(/\s+/gu, " ").trim();
  }

  function viewpointCompact(value = "", limit = 260) {
    const text = viewpointTidy(value);
    return text.length <= limit ? text : `${text.slice(0, limit - 1)}…`;
  }

  function viewpointDate(item = {}) {
    if (/^\d{4}-\d{2}-\d{2}$/u.test(item.date || "")) return item.date;
    const timestamp = Date.parse(item.createdAt || "");
    if (!Number.isFinite(timestamp)) return "";
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(new Date(timestamp));
  }

  function viewpointDateLabel(value = "") {
    return String(value || "").slice(0, 10).replaceAll("-", ".");
  }

  function viewpointPersonKey(item = {}) {
    return viewpointTidy(item.handle || item.name);
  }

  function viewpointSourceLabel(item = {}) {
    if (item.source === "x") return "X";
    if (item.source === "blog") return "博客";
    if (item.source === "podcast") return "播客";
    return viewpointTidy(item.sourceType || item.source || "公开来源");
  }

  function viewpointCoverageLabel(item = {}) {
    const lanes = Array.isArray(item.laneCoverage) ? item.laneCoverage : [];
    return lanes.includes("morning-rss") && lanes.includes("afternoon-skill") ? "双源" : "早间门禁";
  }

  function viewpointTagNames(item = {}) {
    return [...new Set([
      viewpointTidy(item.topic),
      ...(item.columnTags || []).map((tag) => viewpointTidy(tag?.name || tag?.id))
    ].filter(Boolean))];
  }

  function viewpointInitials(name = "") {
    const tidy = viewpointTidy(name);
    const han = tidy.match(/[\p{Script=Han}]/gu) || [];
    if (han.length) return han.slice(0, 2).join("");
    return tidy.split(/\s+/u).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toLocaleUpperCase() || "AI";
  }

  function viewpointAvatar(name, size = "") {
    return `<span class="dc-viewpoint-avatar${size ? ` ${escapeHtml(size)}` : ""}" aria-hidden="true">${escapeHtml(viewpointInitials(name))}</span>`;
  }

  function viewpointChineseText(item = {}) {
    if (item.source === "blog" && viewpointTidy(item.contentTranslation)) return viewpointTidy(item.contentTranslation);
    return viewpointTidy(item.translation);
  }

  function viewpointTitle(item = {}) {
    if (item.source === "blog") return viewpointTidy(item.translation || item.text || "未命名文章");
    return "";
  }

  function viewpointRemarks() {
    return (viewpointState.payload?.remarks || [])
      .filter((item) => (
        item.translationStatus === "translated"
        && item.aiRelevant === true
        && /[\u3400-\u9fff]/u.test(viewpointChineseText(item))
        && safeExternalUrl(item.url || "")
      ))
      .sort((a, b) => (
        viewpointDate(b).localeCompare(viewpointDate(a))
        || String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
      ));
  }

  function viewpointFilteredRemarks(options = {}) {
    const query = viewpointState.filters.query.toLocaleLowerCase();
    return viewpointRemarks().filter((item) => {
      const tags = viewpointTagNames(item);
      const haystack = [
        item.name,
        item.handle,
        item.role,
        item.translation,
        item.contentTranslation,
        item.text,
        item.content,
        item.topic,
        ...tags
      ].filter(Boolean).join(" ").toLocaleLowerCase();
      if (!options.ignorePerson && viewpointState.person && viewpointPersonKey(item) !== viewpointState.person) return false;
      if (viewpointState.filters.topic && item.topic !== viewpointState.filters.topic && !tags.includes(viewpointState.filters.topic)) return false;
      if (viewpointState.filters.source && item.source !== viewpointState.filters.source) return false;
      if (viewpointState.filters.date && viewpointDate(item) !== viewpointState.filters.date) return false;
      return !query || query.split(/\s+/u).filter(Boolean).every((term) => haystack.includes(term));
    });
  }

  function viewpointPeople(items = viewpointFilteredRemarks({ ignorePerson: true })) {
    const builderMap = new Map((viewpointState.payload?.builders || []).map((builder) => [viewpointPersonKey(builder), builder]));
    const grouped = new Map();
    for (const item of items) {
      const key = viewpointPersonKey(item);
      if (!key) continue;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(item);
    }
    return [...grouped.entries()].map(([key, remarks]) => {
      const builder = builderMap.get(key) || {};
      const latest = remarks[0];
      const entity = (viewpointState.entityIndex?.people || []).find((item) => [item.handle, item.name].filter(Boolean).some((value) => viewpointTidy(value).toLocaleLowerCase() === key.toLocaleLowerCase()));
      return {
        key,
        entityId: entity?.id || "",
        name: latest?.name || builder.name || key,
        handle: latest?.handle || builder.handle || key,
        role: latest?.role || builder.role || "角色未披露",
        count: remarks.length,
        latestDate: viewpointDate(latest),
        earliestDate: remarks.map(viewpointDate).filter(Boolean).sort()[0] || "",
        topics: [...new Set(remarks.flatMap(viewpointTagNames))].slice(0, 5),
        remarks
      };
    }).sort((a, b) => b.latestDate.localeCompare(a.latestDate) || b.count - a.count || a.name.localeCompare(b.name, "zh-CN"));
  }

  function viewpointUrl(overrides = {}, remove = []) {
    const next = new URLSearchParams({ view: "viewpoints" });
    const base = {
      mode: viewpointState.mode === "people" ? "people" : "",
      person: viewpointState.person,
      q: viewpointState.filters.query,
      topic: viewpointState.filters.topic,
      source: viewpointState.filters.source,
      date: viewpointState.filters.date,
      page: viewpointState.page > 1 ? viewpointState.page : ""
    };
    for (const [key, value] of Object.entries({ ...base, ...overrides })) {
      if (value !== "" && value !== null && value !== undefined) next.set(key, value);
    }
    for (const key of remove) next.delete(key);
    return `data-center.html?${next.toString()}`;
  }

  function viewpointTopicOptions() {
    return uniqueSorted(viewpointRemarks().flatMap(viewpointTagNames));
  }

  function viewpointDateOptions() {
    return uniqueSorted(viewpointRemarks().map(viewpointDate)).sort((a, b) => b.localeCompare(a));
  }

  function viewpointModeSwitch(items) {
    const people = viewpointPeople(items);
    return `
      <nav class="dc-viewpoint-switch" aria-label="一线观点视图">
        <a href="${escapeHtml(viewpointUrl({ mode: "", person: "", page: "" }, ["mode", "person", "page"]))}"${!viewpointState.person && viewpointState.mode === "feed" ? ' aria-current="page"' : ""}>
          <span>观点流</span><strong>${items.length}</strong>
        </a>
        <a href="${escapeHtml(viewpointUrl({ mode: "people", person: "", page: "" }, ["person", "page"]))}"${!viewpointState.person && viewpointState.mode === "people" ? ' aria-current="page"' : ""}>
          <span>人物索引</span><strong>${people.length}</strong>
        </a>
      </nav>
    `;
  }

  function viewpointToolbar() {
    return `
      <form class="dc-toolbar dc-viewpoint-toolbar" method="get" action="data-center.html">
        <input type="hidden" name="view" value="viewpoints">
        ${viewpointState.mode === "people" ? '<input type="hidden" name="mode" value="people">' : ""}
        <label class="dc-search"><span class="sr-only">关键词</span><input class="dc-input" name="q" value="${escapeHtml(viewpointState.filters.query)}" placeholder="搜索人物、观点、主题或机构" autocomplete="off"></label>
        <button class="dc-button" type="submit">搜索</button>
        <select class="dc-select" name="topic" aria-label="主题" data-auto-submit>${optionList(viewpointTopicOptions(), viewpointState.filters.topic, "全部主题")}</select>
        <select class="dc-select" name="source" aria-label="来源" data-auto-submit>${optionList([{ value: "x", label: "X" }, { value: "blog", label: "博客" }], viewpointState.filters.source, "全部来源")}</select>
        <select class="dc-select" name="date" aria-label="日期" data-auto-submit>${optionList(viewpointDateOptions().map((date) => ({ value: date, label: viewpointDateLabel(date) })), viewpointState.filters.date, "全部日期")}</select>
        <a class="dc-clear" href="${escapeHtml(viewLink("viewpoints", viewpointState.mode === "people" ? { mode: "people" } : {}))}">清除条件</a>
      </form>
    `;
  }

  function viewpointTags(item, limit = 4) {
    const tags = viewpointTagNames(item).slice(0, limit);
    return tags.length ? `<div class="dc-viewpoint-tags">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>` : "";
  }

  function viewpointMetrics(item) {
    if (item.source !== "x") return "";
    const values = [
      ["赞", Number(item.likes || 0)],
      ["转发", Number(item.retweets || 0)],
      ["回复", Number(item.replies || 0)]
    ].filter(([, value]) => value > 0);
    return values.length ? `<span class="dc-viewpoint-metrics">${values.map(([label, value]) => `${label} ${value}`).join(" · ")}</span>` : "";
  }

  function viewpointFeedItem(item) {
    const personKey = viewpointPersonKey(item);
    const title = viewpointTitle(item);
    const sourceUrl = safeExternalUrl(item.url);
    return `
      <article class="dc-viewpoint-item">
        <header class="dc-viewpoint-person">
          ${viewpointAvatar(item.name)}
          <div>
            <strong>${escapeHtml(item.name || personKey)}</strong>
            <span>${escapeHtml(item.handle ? `@${item.handle}` : "")}${item.role ? ` · ${escapeHtml(viewpointCompact(item.role, 88))}` : ""}</span>
          </div>
          <div class="dc-viewpoint-source"><span>${escapeHtml(viewpointSourceLabel(item))} · ${escapeHtml(viewpointCoverageLabel(item))}</span><time>${escapeHtml(viewpointDateLabel(viewpointDate(item)))}</time></div>
        </header>
        <div class="dc-viewpoint-copy">
          ${title ? `<h2>${escapeHtml(title)}</h2>` : ""}
          <p>${escapeHtml(viewpointCompact(viewpointChineseText(item), title ? 420 : 520))}</p>
        </div>
        ${viewpointTags(item)}
        <footer class="dc-viewpoint-actions">
          <button type="button" data-viewpoint-open="${escapeHtml(String(item.id))}">查看全文</button>
          <a href="${escapeHtml(viewpointUrl({ person: personKey, mode: "", page: "" }, ["mode", "page"]))}">人物时间线</a>
          ${viewpointMetrics(item)}
          <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${item.source === "blog" ? "阅读原文" : "打开原帖"}</a>
        </footer>
      </article>
    `;
  }

  function viewpointPagination(total) {
    const pages = Math.ceil(total / viewpointPageSize);
    if (pages <= 1) return "";
    const current = Math.min(Math.max(viewpointState.page, 1), pages);
    const candidates = [1, current - 1, current, current + 1, pages].filter((number) => number >= 1 && number <= pages);
    const numbers = [...new Set(candidates)].sort((a, b) => a - b);
    let previous = 0;
    return `
      <nav class="dc-pagination" aria-label="一线观点数字分页">
        ${current > 1 ? `<a href="${escapeHtml(viewpointUrl({ page: current - 1 }))}">上一页</a>` : ""}
        ${numbers.map((number) => {
          const gap = number - previous > 1 ? "<span>…</span>" : "";
          previous = number;
          return `${gap}${number === current ? `<span aria-current="page">${number}</span>` : `<a href="${escapeHtml(viewpointUrl({ page: number }))}">${number}</a>`}`;
        }).join("")}
        ${current < pages ? `<a href="${escapeHtml(viewpointUrl({ page: current + 1 }))}">下一页</a>` : ""}
      </nav>
    `;
  }

  function viewpointRenderFeed(items) {
    const start = (viewpointState.page - 1) * viewpointPageSize;
    const pageItems = items.slice(start, start + viewpointPageSize);
    return `
      <section class="dc-viewpoint-feed" aria-label="公开观点流">
        ${pageItems.length ? pageItems.map(viewpointFeedItem).join("") : '<div class="dc-empty">当前条件下没有可展示的一线观点。<a href="data-center.html?view=viewpoints">返回全部</a></div>'}
      </section>
      ${viewpointPagination(items.length)}
    `;
  }

  function viewpointPersonRow(person) {
    return `
      <article class="dc-viewpoint-person-row">
        ${viewpointAvatar(person.name, "is-medium")}
        <div class="dc-viewpoint-person-main">
          <h2>${escapeHtml(person.name)}</h2>
          <span>${escapeHtml(person.handle ? `@${person.handle}` : "")}</span>
          <p>${escapeHtml(viewpointCompact(person.role, 130))}</p>
          <div class="dc-viewpoint-tags">${person.topics.slice(0, 4).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        </div>
        <dl>
          <div><dt>观点</dt><dd>${person.count}</dd></div>
          <div><dt>最近</dt><dd>${escapeHtml(viewpointDateLabel(person.latestDate))}</dd></div>
        </dl>
        <div class="dc-viewpoint-person-actions">
          <a class="dc-viewpoint-person-link" href="${escapeHtml(viewpointUrl({ person: person.key, mode: "", page: "" }, ["mode", "page"]))}">查看时间线</a>
          ${person.entityId ? `<a class="dc-viewpoint-person-link is-secondary" href="${escapeHtml(detailLink("index", "entity", person.entityId))}">实体档案</a>` : ""}
        </div>
      </article>
    `;
  }

  function viewpointRenderPeople(items) {
    const people = viewpointPeople(items);
    const start = (viewpointState.page - 1) * viewpointPageSize;
    const pageItems = people.slice(start, start + viewpointPageSize);
    return `
      <section class="dc-viewpoint-people" aria-label="人物索引">
        ${pageItems.length ? pageItems.map(viewpointPersonRow).join("") : '<div class="dc-empty">当前条件下没有匹配人物。<a href="data-center.html?view=viewpoints&mode=people">返回全部</a></div>'}
      </section>
      ${viewpointPagination(people.length)}
    `;
  }

  function viewpointTimelineItem(item) {
    const title = viewpointTitle(item);
    const original = viewpointTidy(item.content || item.text);
    const sourceUrl = safeExternalUrl(item.url);
    return `
      <article class="dc-viewpoint-timeline-item">
        <div class="dc-viewpoint-timeline-meta">
          <span>${escapeHtml(viewpointSourceLabel(item))} · ${escapeHtml(viewpointCoverageLabel(item))}</span>
          ${viewpointMetrics(item)}
        </div>
        ${title ? `<h3>${escapeHtml(title)}</h3>` : ""}
        <p>${escapeHtml(viewpointChineseText(item))}</p>
        ${viewpointTags(item, 5)}
        <div class="dc-viewpoint-timeline-actions">
          ${original ? `<details><summary>查看原文</summary><p>${escapeHtml(original)}</p></details>` : ""}
          <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${item.source === "blog" ? "阅读原文" : "打开原帖"}</a>
        </div>
      </article>
    `;
  }

  function viewpointRenderPerson(items) {
    const person = viewpointPeople(viewpointRemarks()).find((entry) => entry.key === viewpointState.person);
    if (!person) {
      return '<div class="dc-empty">未找到该人物的观点记录。<a href="data-center.html?view=viewpoints&mode=people">返回人物索引</a></div>';
    }
    const filtered = items.filter((item) => viewpointPersonKey(item) === person.key);
    const groups = [...filtered.reduce((map, item) => {
      const date = viewpointDate(item) || "日期未披露";
      if (!map.has(date)) map.set(date, []);
      map.get(date).push(item);
      return map;
    }, new Map()).entries()].sort((a, b) => b[0].localeCompare(a[0]));
    return `
      <nav class="dc-breadcrumb" aria-label="面包屑"><a href="data-center.html?view=viewpoints">数据中心 / 一线观点</a> / <a href="data-center.html?view=viewpoints&mode=people">人物索引</a> / ${escapeHtml(person.name)}</nav>
      <header class="dc-viewpoint-profile">
        ${viewpointAvatar(person.name, "is-large")}
        <div>
          <h1>${escapeHtml(person.name)}</h1>
          <span>${escapeHtml(person.handle ? `@${person.handle}` : "")}</span>
          <p>${escapeHtml(person.role)}</p>
          <div class="dc-viewpoint-tags">${person.topics.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
          ${person.entityId ? `<a class="dc-viewpoint-profile-entity" href="${escapeHtml(detailLink("index", "entity", person.entityId))}">打开统一人物档案</a>` : ""}
        </div>
        <dl>
          <div><dt>观点记录</dt><dd>${filtered.length}</dd></div>
          <div><dt>日期范围</dt><dd>${escapeHtml(viewpointDateLabel(filtered.map(viewpointDate).filter(Boolean).sort()[0] || ""))} — ${escapeHtml(viewpointDateLabel(filtered.map(viewpointDate).filter(Boolean).sort().at(-1) || ""))}</dd></div>
        </dl>
      </header>
      <section class="dc-viewpoint-timeline" aria-label="${escapeHtml(person.name)}观点时间线">
        ${groups.length ? groups.map(([date, remarks]) => `
          <section class="dc-viewpoint-day">
            <header><time>${escapeHtml(viewpointDateLabel(date))}</time><span>${remarks.length} 条</span></header>
            <div>${remarks.map(viewpointTimelineItem).join("")}</div>
          </section>
        `).join("") : '<div class="dc-empty">当前筛选条件下没有观点记录。</div>'}
      </section>
    `;
  }

  function viewpointOpenDialog(id) {
    const item = viewpointRemarks().find((remark) => String(remark.id) === String(id));
    const dialog = document.querySelector("[data-viewpoint-dialog]");
    const content = document.querySelector("[data-viewpoint-dialog-content]");
    if (!item || !dialog || !content) return;
    const title = viewpointTitle(item);
    const sourceUrl = safeExternalUrl(item.url);
    content.innerHTML = `
      <header class="dc-viewpoint-dialog-person">
        ${viewpointAvatar(item.name)}
        <div><strong>${escapeHtml(item.name)}</strong><span>${escapeHtml(item.handle ? `@${item.handle}` : "")} · ${escapeHtml(viewpointSourceLabel(item))} · ${escapeHtml(viewpointCoverageLabel(item))} · ${escapeHtml(viewpointDateLabel(viewpointDate(item)))}</span></div>
      </header>
      ${title ? `<h2>${escapeHtml(title)}</h2>` : ""}
      ${viewpointTags(item, 6)}
      <section><h3>中文内容</h3><p>${escapeHtml(viewpointChineseText(item))}</p></section>
      <section><h3>原文</h3><p>${escapeHtml(item.content || item.text || "未披露")}</p></section>
      <div class="dc-viewpoint-dialog-actions">
        <a href="${escapeHtml(viewpointUrl({ person: viewpointPersonKey(item), mode: "", page: "" }, ["mode", "page"]))}">查看人物时间线</a>
        <a href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${item.source === "blog" ? "阅读原文" : "打开原帖"}</a>
      </div>
    `;
    if (typeof dialog.showModal === "function") dialog.showModal();
  }

  function viewpointBindInteractions() {
    root.querySelectorAll("[data-viewpoint-open]").forEach((button) => button.addEventListener("click", () => viewpointOpenDialog(button.dataset.viewpointOpen)));
    root.querySelectorAll("[data-auto-submit]").forEach((control) => {
      control.addEventListener("change", () => control.form?.requestSubmit());
    });
  }

  async function renderViewpointsPage() {
    [viewpointState.payload, viewpointState.entityIndex] = await Promise.all([
      communityFetchJson("data/first-line-viewpoints-v4.json"),
      communityFetchJson(splitDataUrl("indexes/entities")).catch(() => ({ people: [] }))
    ]);
    const items = viewpointFilteredRemarks();
    const latestDate = viewpointRemarks().map(viewpointDate).filter(Boolean).sort().at(-1) || "";
    if (viewpointState.person) {
      root.innerHTML = viewpointRenderPerson(items);
    } else {
      root.innerHTML = `
        <div class="dc-page-head">
          <h1>一线观点</h1>
          <span class="dc-page-description">建设者与从业者公开观点</span>
          <span class="dc-data-date">数据日期 ${escapeHtml(latestDate || "未披露")}</span>
          <span class="dc-result-count">${items.length} 条</span>
        </div>
        ${viewpointToolbar()}
        ${viewpointModeSwitch(items)}
        ${viewpointState.mode === "people" ? viewpointRenderPeople(items) : viewpointRenderFeed(items)}
      `;
    }
    viewpointBindInteractions();
    const dialog = document.querySelector("[data-viewpoint-dialog]");
    document.querySelector("[data-viewpoint-dialog-close]")?.addEventListener("click", () => dialog?.close());
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  }

  const fact = (label, value) => `<div class="dc-fact"><dt>${escapeHtml(label)}</dt><dd>${value === "" || value === null || value === undefined ? "未披露" : escapeHtml(Array.isArray(value) ? value.join("、") || "未披露" : value)}</dd></div>`;

  function breadcrumb(targetView, current) {
    return `<nav class="dc-breadcrumb" aria-label="面包屑"><a href="${escapeHtml(viewLink(targetView))}">数据中心 / ${escapeHtml(viewConfig[targetView].title)}</a> / ${escapeHtml(current)}</nav>`;
  }

  function relatedRows(items, targetView, limit = 3) {
    if (!items.length) return "";
    return renderRows(items.slice(0, limit), targetView, true);
  }

  function renderClassificationGroups(classifications = []) {
    const grouped = normalizeTags(classifications).reduce((map, item) => {
      const key = item.dimensionName || "分类";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
      return map;
    }, new Map());
    if (!grouped.size) return "";
    return `
      <section class="dc-detail-section">
        <h2>数据分类</h2>
        <div class="dc-classification-groups">
          ${[...grouped].map(([name, items]) => `
            <div>
              <strong>${escapeHtml(name)}</strong>
              <span>${items.map((item) => `<a href="${escapeHtml(tagLink(item))}">${escapeHtml(item.name)}</a>`).join("")}</span>
            </div>
          `).join("")}
        </div>
      </section>
    `;
  }

  function eventDetail(data, event) {
    const companies = data.companies.filter((item) => event.entityIds.includes(item.id));
    const products = data.products.filter((item) => item.eventIds.includes(event.id));
    const fde = data.fde.filter((item) => item.eventId === event.id);
    const hardware = data.hardware.filter((item) => item.eventId === event.id);
    const eventTagNames = normalizeTags(event.tags).map((tag) => tag.name);
    const community = data.community.filter((item) => item.tags.some((tag) => eventTagNames.includes(tag))).slice(0, 3);
    const viewpoints = data.viewpoints.filter((item) => item.tags.some((tag) => eventTagNames.includes(tag))).slice(0, 3);
    const related = data.events.filter((item) => item.id !== event.id && (
      item.entityIds.some((id) => event.entityIds.includes(id))
      || normalizeTags(item.tags).some((tag) => eventTagNames.includes(tag.name))
    )).slice(0, 5);
    const sourceUrl = safeExternalUrl(event.sourceUrl);

    return `
      ${breadcrumb("events", event.title)}
      <header class="dc-detail-head">
        <h1>${escapeHtml(event.title)}</h1>
        ${event.originalTitle ? `<p class="dc-original-title">${escapeHtml(event.originalTitle)}</p>` : ""}
        <div class="dc-detail-meta">
          <span>${escapeHtml(event.date || "日期未披露")}</span>
          <span>${escapeHtml(event.eventTypeLabel)}</span>
          <span>${escapeHtml(event.statusLabel)}</span>
          ${renderTags(event.displayTags || event.tags, 5)}
        </div>
      </header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main">
          <section class="dc-detail-section">
            <h2>事件事实</h2>
            <dl class="dc-facts">
              ${fact("主体", event.subject)}
              ${fact("动作", event.action)}
              ${fact("对象", event.object)}
              ${event.metrics.length ? fact("披露数据", event.metrics) : ""}
              ${event.locations.length ? fact("地点", event.locations) : ""}
            </dl>
          </section>
          ${renderClassificationGroups(event.classifications)}
          ${sourceUrl ? `<section class="dc-detail-section"><h2>原始来源</h2><a class="dc-source-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(event.publisher || "打开原始来源")}</a></section>` : ""}
        </article>
        <aside class="dc-detail-side">
          ${companies.length ? `<section class="dc-side-block"><h2>相关公司</h2><div class="dc-side-list">${companies.map((item) => `<a href="${escapeHtml(detailLink("index", "company", item.id))}">${escapeHtml(item.name)}</a>`).join("")}</div></section>` : ""}
          ${products.length ? `<section class="dc-side-block"><h2>相关产品</h2><div class="dc-side-list">${products.map((item) => `<a href="${escapeHtml(detailLink("index", "product", item.id))}">${escapeHtml(item.name)}</a>`).join("")}</div></section>` : ""}
          ${fde.length ? `<section class="dc-side-block"><h2>相关 FDE</h2><div class="dc-side-list">${fde.map((item) => `<a href="${escapeHtml(detailLink("fde", "fde", item.id))}">${escapeHtml(item.title)}</a>`).join("")}</div></section>` : ""}
          ${hardware.length ? `<section class="dc-side-block"><h2>相关 AI 硬件</h2><div class="dc-side-list">${hardware.map((item) => `<a href="${escapeHtml(detailLink("hardware", "hardware", item.id))}">${escapeHtml(item.title)}</a>`).join("")}</div></section>` : ""}
        </aside>
      </div>
      ${community.length ? `<section class="dc-related-section"><h2>相关社群情报</h2>${relatedRows(community, "community")}</section>` : ""}
      ${viewpoints.length ? `<section class="dc-related-section"><h2>相关一线观点</h2>${relatedRows(viewpoints, "viewpoints")}</section>` : ""}
      ${related.length ? `<section class="dc-related-section"><h2>相关事件</h2>${relatedRows(related, "events", 5)}</section>` : ""}
    `;
  }

  function companyDetail(data, company) {
    const events = data.events.filter((item) => company.eventIds.includes(item.id));
    const products = data.products.filter((item) => company.productIds.includes(item.id));
    const fde = data.fde.filter((item) => item.entityIds.includes(company.id));
    const hardware = data.hardware.filter((item) => item.entityIds.includes(company.id));
    return `
      ${breadcrumb("index", company.name)}
      <header class="dc-detail-head">
        <h1>${escapeHtml(company.name)}</h1>
        <div class="dc-detail-meta"><span>${escapeHtml(company.type)}</span>${renderTags(company.tags, 5)}</div>
      </header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main"><section class="dc-detail-section"><h2>相关事件</h2>${relatedRows(events, "events", events.length)}</section></article>
        <aside class="dc-detail-side">
          <section class="dc-side-block"><h2>基本身份</h2><dl class="dc-facts">${fact("类型", company.type)}${fact("别名", company.aliases)}</dl></section>
          ${products.length ? `<section class="dc-side-block"><h2>相关产品</h2><div class="dc-side-list">${products.map((item) => `<a href="${escapeHtml(detailLink("index", "product", item.id))}">${escapeHtml(item.name)}</a>`).join("")}</div></section>` : ""}
        </aside>
      </div>
      ${fde.length ? `<section class="dc-related-section"><h2>FDE 实施</h2>${relatedRows(fde, "fde")}</section>` : ""}
      ${hardware.length ? `<section class="dc-related-section"><h2>AI 硬件</h2>${relatedRows(hardware, "hardware")}</section>` : ""}
    `;
  }

  function productDetail(data, product) {
    const events = data.events.filter((item) => product.eventIds.includes(item.id));
    const companies = data.companies.filter((item) => product.companyIds.includes(item.id));
    const fde = data.fde.filter((item) => item.eventId && product.eventIds.includes(item.eventId));
    return `
      ${breadcrumb("index", product.name)}
      <header class="dc-detail-head">
        <h1>${escapeHtml(product.name)}</h1>
        <div class="dc-detail-meta"><span>${escapeHtml(product.type)}</span>${renderTags(product.tags, 5)}</div>
      </header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main"><section class="dc-detail-section"><h2>相关事件</h2>${relatedRows(events, "events", events.length)}</section></article>
        <aside class="dc-detail-side">
          <section class="dc-side-block"><h2>产品信息</h2><dl class="dc-facts">${fact("类型", product.type)}${fact("所属公司", product.companyNames)}</dl></section>
          ${companies.length ? `<section class="dc-side-block"><h2>相关公司</h2><div class="dc-side-list">${companies.map((item) => `<a href="${escapeHtml(detailLink("index", "company", item.id))}">${escapeHtml(item.name)}</a>`).join("")}</div></section>` : ""}
        </aside>
      </div>
      ${fde.length ? `<section class="dc-related-section"><h2>FDE 实施</h2>${relatedRows(fde, "fde")}</section>` : ""}
    `;
  }

  const relationshipLabels = {
    publishes: "发布",
    partners_with: "商业合作",
    acquires: "收购",
    serves: "服务",
    deployed_in: "部署于",
    supplies_hardware_to: "供应硬件"
  };

  function entityProfileDetail(payload) {
    const entity = payload.entity;
    const relatedById = new Map((payload.relatedEntities || []).map((item) => [item.id, item]));
    const timeline = entity.timeline || [];
    const relationRows = (payload.relationships || []).map((relation) => {
      const otherId = relation.subject_ref === entity.id ? relation.object_ref : relation.subject_ref;
      const other = relatedById.get(otherId);
      const target = other
        ? `<a href="${escapeHtml(detailLink("index", "entity", other.id))}">${escapeHtml(other.name)}</a>`
        : relation.object_type === "taxonomy"
          ? `<a href="${escapeHtml(detailLink("index", "taxonomy", relation.object_ref))}">${escapeHtml((payload.taxonomyNodes || []).find((item) => item.id === relation.object_ref)?.name || relation.object_ref)}</a>`
          : escapeHtml(otherId);
      return `<li><span>${escapeHtml(relationshipLabels[relation.predicate] || relation.predicate)}</span>${target}</li>`;
    });
    const aliases = (entity.aliases || []).join("、");
    const viewpoints = entity.viewpoints || [];
    return `
      ${breadcrumb("index", entity.name)}
      <header class="dc-detail-head dc-entity-head">
        <h1>${escapeHtml(entity.name)}</h1>
        <div class="dc-detail-meta">
          <span>${escapeHtml(entity.typeLabel)}</span>
          ${entity.firstSeen ? `<span>${escapeHtml(entity.firstSeen)} — ${escapeHtml(entity.lastSeen || entity.firstSeen)}</span>` : ""}
        </div>
      </header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main">
          <section class="dc-detail-section">
            <h2>历史时间线</h2>
            ${timeline.length ? relatedRows(timeline, "events", timeline.length) : '<p class="dc-prose">当前没有正式商业事件记录。</p>'}
          </section>
        </article>
        <aside class="dc-detail-side">
          <section class="dc-side-block"><h2>基本信息</h2><dl class="dc-facts">
            ${fact("类型", entity.typeLabel)}
            ${aliases ? fact("别名", aliases) : ""}
            ${entity.handle ? fact("账号", `@${entity.handle}`) : ""}
            ${entity.role ? fact("公开角色", entity.role) : ""}
            ${entity.organization ? fact("公开机构", entity.organization) : ""}
          </dl></section>
          ${relationRows.length ? `<section class="dc-side-block"><h2>事实关系</h2><ul class="dc-entity-relations">${relationRows.join("")}</ul></section>` : ""}
          ${(payload.taxonomyNodes || []).length ? `<section class="dc-side-block"><h2>关联分类</h2><div class="dc-side-list">${payload.taxonomyNodes.map((node) => `<a href="${escapeHtml(detailLink("index", "taxonomy", node.id))}">${escapeHtml(node.name)}</a>`).join("")}</div></section>` : ""}
        </aside>
      </div>
      ${(payload.fde || []).length ? `<section class="dc-related-section"><h2>FDE 实施</h2>${relatedRows(payload.fde, "fde")}</section>` : ""}
      ${(payload.hardware || []).length ? `<section class="dc-related-section"><h2>AI 硬件</h2>${relatedRows(payload.hardware, "hardware")}</section>` : ""}
      ${viewpoints.length ? `<section class="dc-related-section dc-entity-viewpoints"><h2>一线观点</h2><div class="dc-list">${viewpoints.map((item) => `<div class="dc-list-row"><span class="dc-row-kind">${escapeHtml(item.date)}</span><span class="dc-row-title">${escapeHtml(item.title)}</span></div>`).join("")}</div></section>` : ""}
    `;
  }

  function taxonomyNodeDetail(payload) {
    const node = payload.node;
    const entities = payload.entities || [];
    return `
      ${breadcrumb("index", node.name)}
      <header class="dc-detail-head dc-entity-head">
        <h1>${escapeHtml(node.name)}</h1>
        <div class="dc-detail-meta"><span>${escapeHtml(node.typeLabel)}</span><span>${escapeHtml(node.firstSeen)} — ${escapeHtml(node.lastSeen)}</span></div>
      </header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main"><section class="dc-detail-section"><h2>相关事件</h2>${relatedRows(payload.events || [], "events", (payload.events || []).length)}</section></article>
        <aside class="dc-detail-side">
          ${entities.length ? `<section class="dc-side-block"><h2>相关实体</h2><div class="dc-side-list">${entities.slice(0, 30).map((item) => `<a href="${escapeHtml(detailLink("index", "entity", item.id))}">${escapeHtml(item.name)}</a>`).join("")}</div></section>` : ""}
        </aside>
      </div>
      ${(payload.fde || []).length ? `<section class="dc-related-section"><h2>FDE 实施</h2>${relatedRows(payload.fde, "fde")}</section>` : ""}
      ${(payload.hardware || []).length ? `<section class="dc-related-section"><h2>AI 硬件</h2>${relatedRows(payload.hardware, "hardware")}</section>` : ""}
    `;
  }

  async function renderSplitEntityDetail(kind, id) {
    let resolvedId = id;
    if ((kind === "company" || kind === "product") && /^PD-/u.test(id)) {
      const indexData = await communityFetchJson(splitDataUrl("indexes/entities"));
      resolvedId = (indexData.products || []).find((item) => (item.legacyIds || []).includes(id))?.id || id;
    }
    const section = kind === "taxonomy" ? "taxonomy" : "entities";
    const payload = await communityFetchJson(splitDataUrl(section, resolvedId));
    root.innerHTML = kind === "taxonomy" ? taxonomyNodeDetail(payload) : entityProfileDetail(payload);
  }

  function fdeDetail(data, item) {
    const event = data.events.find((entry) => entry.id === item.eventId);
    const sourceUrl = safeExternalUrl(item.sourceUrl);
    return `
      ${breadcrumb("fde", item.title)}
      <header class="dc-detail-head"><h1>${escapeHtml(item.title)}</h1><div class="dc-detail-meta"><span>${escapeHtml(item.date)}</span><span>${escapeHtml(item.stageLabel)}</span>${renderTags(item.tags, 5)}</div></header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main">
          <section class="dc-detail-section"><h2>实施事实</h2><dl class="dc-facts">
            ${fact("客户", item.customer)}${fact("服务商", item.vendor)}${fact("行业", item.industry)}${fact("使用场景", item.useCase)}
            ${fact("已披露需求", item.reportedNeed)}${fact("交付组成", item.deliveryComponents)}${fact("已披露结果", item.outcomes)}
            ${fact("披露指标", item.metrics)}
          </dl></section>
          ${sourceUrl ? `<section class="dc-detail-section"><h2>原始来源</h2><a class="dc-source-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">打开原始来源</a></section>` : ""}
        </article>
        <aside class="dc-detail-side">${event ? `<section class="dc-side-block"><h2>原始事件</h2><div class="dc-side-list"><a href="${escapeHtml(detailLink("events", "event", event.id))}">${escapeHtml(event.title)}</a></div></section>` : ""}</aside>
      </div>
    `;
  }

  function hardwareDetail(data, item) {
    const event = data.events.find((entry) => entry.id === item.eventId);
    const sourceUrl = safeExternalUrl(item.sourceUrl);
    return `
      ${breadcrumb("hardware", item.title)}
      <header class="dc-detail-head"><h1>${escapeHtml(item.title)}</h1><div class="dc-detail-meta"><span>${escapeHtml(item.date)}</span><span>${escapeHtml(item.eventTypeLabel)}</span>${renderTags(item.tags, 5)}</div></header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main">
          <section class="dc-detail-section"><h2>硬件事实</h2><dl class="dc-facts">
            ${fact("部件", item.hardwareType)}${fact("算力层级", item.computeLayer)}${fact("供应方", item.supplier)}${fact("客户", item.customer)}
            ${fact("制程", item.processNode)}${fact("容量", item.capacity === "未披露" ? item.capacity : `${item.capacity} ${item.capacityUnit}`.trim())}
            ${fact("地点", item.site)}${fact("区域", item.region)}${fact("金额", item.contractValue)}${fact("出货日期", item.shipmentDate)}
          </dl></section>
          <section class="dc-detail-section">
            <h2>原始来源</h2>
            ${sourceUrl
              ? `<a class="dc-source-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.sourceName || "打开原始来源")} · 查看原文</a>`
              : `<p class="dc-prose">来源未披露</p>`}
          </section>
        </article>
        <aside class="dc-detail-side">${event ? `<section class="dc-side-block"><h2>原始事件</h2><div class="dc-side-list"><a href="${escapeHtml(detailLink("events", "event", event.id))}">${escapeHtml(event.title)}</a></div></section>` : ""}</aside>
      </div>
    `;
  }

  function communityDetail(item) {
    const sourceUrl = safeExternalUrl(item.sourceUrl);
    return `
      ${breadcrumb("community", item.title)}
      <header class="dc-detail-head"><h1>${escapeHtml(item.title)}</h1><div class="dc-detail-meta"><span>${escapeHtml(item.date || "日期未披露")}</span>${renderTags(item.tags, 5)}</div></header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main"><section class="dc-detail-section"><h2>原始内容</h2><p class="dc-prose">${escapeHtml(item.content || "未披露")}</p></section>${sourceUrl ? `<section class="dc-detail-section"><h2>原始入口</h2><a class="dc-source-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">打开原始入口</a></section>` : ""}</article>
        <aside class="dc-detail-side"><section class="dc-side-block"><h2>来源信息</h2><dl class="dc-facts">${fact("作者", item.author)}${fact("社群", item.community)}</dl></section></aside>
      </div>
    `;
  }

  function viewpointDetail(item) {
    const sourceUrl = safeExternalUrl(item.sourceUrl);
    return `
      ${breadcrumb("viewpoints", item.title)}
      <header class="dc-detail-head"><h1>${escapeHtml(item.title)}</h1><div class="dc-detail-meta"><span>${escapeHtml(item.date || "日期未披露")}</span>${renderTags(item.tags, 5)}</div></header>
      <div class="dc-detail-grid">
        <article class="dc-detail-main">
          <section class="dc-detail-section"><h2>中文翻译</h2><p class="dc-prose">${escapeHtml(item.translatedContent || "未披露")}</p></section>
          <section class="dc-detail-section"><h2>原文</h2><p class="dc-prose">${escapeHtml(item.originalContent || "未披露")}</p></section>
          ${sourceUrl ? `<section class="dc-detail-section"><h2>原始入口</h2><a class="dc-source-link" href="${escapeHtml(sourceUrl)}" target="_blank" rel="noopener noreferrer">打开原始入口</a></section>` : ""}
        </article>
        <aside class="dc-detail-side"><section class="dc-side-block"><h2>人物信息</h2><dl class="dc-facts">${fact("人物", item.person)}${fact("角色", item.role)}${fact("机构", item.organization)}${fact("账号", item.handle)}</dl></section></aside>
      </div>
    `;
  }

  function renderDetail(data) {
    const kind = params.get("detail");
    const id = params.get("id");
    const maps = {
      event: ["events", eventDetail],
      company: ["companies", companyDetail],
      product: ["products", productDetail],
      fde: ["fde", fdeDetail],
      hardware: ["hardware", hardwareDetail],
      community: ["community", (_data, item) => communityDetail(item)],
      viewpoint: ["viewpoints", (_data, item) => viewpointDetail(item)]
    };
    const definition = maps[kind];
    if (!definition) return false;
    const item = data[definition[0]].find((entry) => entry.id === id);
    if (!item) {
      root.innerHTML = `<div class="dc-error">未找到该数据记录。<a href="${escapeHtml(viewLink(view))}">返回列表</a></div>`;
      return true;
    }
    root.innerHTML = definition[1](data, item);
    return true;
  }

  function itemsWithTag(data, targetView, tag, query) {
    return collectionForView(data, targetView).filter((item) => {
      const tagMatch = matchesTaxonomy(item, tag);
      return tagMatch && (!query || matchesQuery(item, Object.keys(item), query));
    });
  }

  function renderTagPage(data) {
    const tag = params.get("tag") || "";
    const label = params.get("label") || tag;
    const query = params.get("q") || "";
    const sections = ["events", "index", "fde", "hardware", "community", "viewpoints"]
      .map((targetView) => ({ targetView, items: itemsWithTag(data, targetView, tag, query) }))
      .filter((section) => section.items.length);
    root.innerHTML = `
      <div class="dc-page-head">
        <h1>分类：${escapeHtml(label || "未指定")}</h1>
        <span class="dc-page-description">技术标签与结构化分类关联结果</span>
      </div>
      <form class="dc-toolbar" method="get" action="data-center.html">
        <input type="hidden" name="view" value="tag">
        <input type="hidden" name="tag" value="${escapeHtml(tag)}">
        <input type="hidden" name="label" value="${escapeHtml(label)}">
        <label class="dc-search"><span class="sr-only">关键词</span><input class="dc-input" name="q" value="${escapeHtml(query)}" placeholder="在当前分类结果中搜索"></label>
        <button class="dc-button" type="submit">搜索</button>
        <a class="dc-clear" href="${escapeHtml(viewLink("events"))}">返回商业事件</a>
      </form>
      ${sections.length ? sections.map(({ targetView, items }) => `
        <section class="dc-result-section">
          <div class="dc-result-section-head"><h2>${escapeHtml(viewConfig[targetView].title)}</h2><a href="${escapeHtml(viewLink(targetView, { tag, label }))}">查看全部</a></div>
          ${renderRows(items.slice(0, 5), targetView, true)}
        </section>
      `).join("") : `<div class="dc-empty">未找到当前分类相关数据</div>`}
    `;
  }

  function bindInteractions() {
    document.querySelectorAll("[data-stop-row]").forEach((tag) => {
      tag.addEventListener("click", (event) => event.stopPropagation());
    });
    document.querySelectorAll("[data-filter-form]").forEach((form) => {
      const applyFilters = () => {
        const next = new URLSearchParams();
        for (const [key, rawValue] of new FormData(form).entries()) {
          const value = String(rawValue).trim();
          if (value) next.set(key, value);
        }
        window.location.assign(`data-center.html?${next.toString()}`);
      };
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (form.reportValidity()) applyFilters();
      });
      form.querySelectorAll("[data-auto-submit]").forEach((control) => {
        control.addEventListener("change", applyFilters);
      });
      const fromInput = form.elements.namedItem("from");
      const toInput = form.elements.namedItem("to");
      fromInput?.addEventListener("change", () => {
        if (toInput && fromInput.value) toInput.min = fromInput.value;
      });
      toInput?.addEventListener("change", () => {
        if (fromInput && toInput.value) fromInput.max = toInput.value;
      });
    });
  }

  async function loadColumnData(targetView) {
    const detail = params.get("detail");
    if (targetView === "events" && detail === "event") {
      const [eventData, entityData, fdeData, hardwareData] = await Promise.all([
        communityFetchJson(splitDataUrl("details/events")),
        communityFetchJson(splitDataUrl("indexes/entities")),
        communityFetchJson(splitDataUrl("indexes/fde")),
        communityFetchJson(splitDataUrl("indexes/hardware"))
      ]);
      return { ...eventData, ...entityData, ...fdeData, ...hardwareData, community: [], viewpoints: [] };
    }
    if (targetView === "fde" && detail === "fde") return { ...(await communityFetchJson(splitDataUrl("details/fde"))), companies: [], products: [], hardware: [], community: [], viewpoints: [] };
    if (targetView === "hardware" && detail === "hardware") return { ...(await communityFetchJson(splitDataUrl("details/hardware"))), companies: [], products: [], fde: [], community: [], viewpoints: [] };
    if (targetView === "events" && !detail) return { ...(await communityFetchJson(splitDataUrl("indexes/events"))), companies: [], products: [], people: [], taxonomyNodes: [], fde: [], hardware: [], community: [], viewpoints: [] };
    if (targetView === "index" && !detail) return { ...(await communityFetchJson(splitDataUrl("indexes/entities"))), events: [], fde: [], hardware: [], community: [], viewpoints: [] };
    if (targetView === "fde" && !detail) return { ...(await communityFetchJson(splitDataUrl("indexes/fde"))), events: [], companies: [], products: [], people: [], taxonomyNodes: [], hardware: [], community: [], viewpoints: [] };
    if (targetView === "hardware" && !detail) return { ...(await communityFetchJson(splitDataUrl("indexes/hardware"))), events: [], companies: [], products: [], people: [], taxonomyNodes: [], fde: [], community: [], viewpoints: [] };
    return communityFetchJson("data/data-center-v4-frontstage.json");
  }

  async function start() {
    setActiveNavigation();
    try {
      if (view === "community" && !params.get("detail")) {
        await renderCommunityPage();
        loading.hidden = true;
        document.title = "社群情报｜观澜 AI";
        return;
      }
      if (view === "viewpoints" && !params.get("detail")) {
        await renderViewpointsPage();
        loading.hidden = true;
        document.title = `${viewpointState.person ? "人物观点时间线" : viewpointState.mode === "people" ? "人物索引" : "一线观点"}｜观澜 AI`;
        return;
      }
      if (view === "index" && ["entity", "taxonomy", "company", "product"].includes(params.get("detail"))) {
        const detailKind = params.get("detail");
        await renderSplitEntityDetail(detailKind, params.get("id") || "");
        loading.hidden = true;
        document.title = `${detailKind === "taxonomy" ? "分类档案" : "实体档案"}｜观澜 AI`;
        return;
      }
      const data = await loadColumnData(view);
      loading.hidden = true;

      if (view === "tag") renderTagPage(data);
      else if (!renderDetail(data)) renderListPage(data, view);
      bindInteractions();
      document.title = `${view === "tag" ? `分类：${params.get("label") || params.get("tag") || ""}` : viewConfig[view]?.title || "数据中心"}｜观澜 AI`;
    } catch (error) {
      loading.hidden = true;
      root.innerHTML = `<div class="dc-error">数据加载失败。<button type="button" data-retry>重新加载</button><p>${escapeHtml(error.message)}</p></div>`;
      root.querySelector("[data-retry]")?.addEventListener("click", () => window.location.reload());
    }
  }

  const navToggle = document.querySelector("[data-nav-toggle]");
  const sidebar = document.querySelector("[data-sidebar]");
  navToggle?.addEventListener("click", () => {
    const open = sidebar.dataset.open !== "true";
    sidebar.dataset.open = String(open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  sidebar?.addEventListener("click", (event) => {
    if (event.target.closest("a") && window.matchMedia("(max-width: 780px)").matches) {
      sidebar.dataset.open = "false";
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });

  start();
})();
