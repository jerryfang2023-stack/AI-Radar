(function () {
  const state = {
    payload: null,
    activeCategory: "all",
    filters: {
      date: "",
      category: "all",
      track: "all",
      evidence: "all",
      stage: "all",
      source: "all",
      query: "",
    },
    relationshipFilters: {
      category: "all",
      tag: "all",
    },
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const safe = (value = "") => String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  const fmtDate = (date = "") => String(date).replaceAll("-", ".");

  function daysBetween(activeDate, date) {
    const active = Date.parse(`${activeDate}T00:00:00Z`);
    const current = Date.parse(`${date}T00:00:00Z`);
    if (!Number.isFinite(active) || !Number.isFinite(current)) return 9999;
    return Math.round((active - current) / 86400000);
  }

  function availableDates() {
    return [...new Set((state.payload?.cards || []).map((card) => card.date).filter(Boolean))]
      .sort((a, b) => b.localeCompare(a));
  }

  function selectedDate() {
    return state.filters.date || state.payload.meta.activeDate;
  }

  function visibleCategories() {
    return (state.payload?.categories || []).filter((item) => item.category !== "opinion");
  }

  function categoryLabel(category) {
    return visibleCategories().find((item) => item.category === category)?.label || category;
  }

  function cardsOnDate(date) {
    return state.payload.cards.filter((card) => card.date === date);
  }

  function countByDateAndCategory(date, category) {
    return state.payload.cards.filter((card) => card.date === date && card.category === category).length;
  }

  function countLast7ByCategory(date, category) {
    return countWindowByCategory(date, category, 0, 6);
  }

  function countWindowByCategory(date, category, startDay, endDay) {
    return state.payload.cards.filter((card) => {
      const diff = daysBetween(date, card.date);
      return card.category === category && diff >= startDay && diff <= endDay;
    }).length;
  }

  function tagPills(tags = [], limit = 6) {
    const visible = tags.slice(0, limit);
    if (!visible.length) return "<span>暂无标签</span>";
    return visible.map((tag) => `<span>${safe(tag.label || tag.name || tag.id || tag)}</span>`).join("");
  }

  function compactText(value = "", limit = 260) {
    const text = String(value || "").replace(/\s+/g, " ").trim();
    if (text.length <= limit) return text;
    return `${text.slice(0, limit - 1)}…`;
  }

  function hasCjk(value = "") {
    return /[\u4e00-\u9fff]/u.test(String(value || ""));
  }

  function cleanJudgmentText(value = "") {
    return String(value || "")
      .replace(/^这条变化值得看，是因为/u, "")
      .replace(/^这条变化值得看，/u, "")
      .replace(/^值得看，是因为/u, "")
      .replace(/^它把竞争点放到了/u, "相关变化涉及")
      .replace(/客户是否买单，要看/u, "可观察信息包括")
      .trim();
  }

  function isWeakFact(value = "") {
    const text = String(value || "");
    return !text
      || /把 AI 用进/u.test(text)
      || /值得看/u.test(text)
      || /客户是否买单/u.test(text)
      || /相关变化涉及/u.test(text)
      || /可观察信息包括/u.test(text)
      || /流程结果、交付速度/u.test(text)
      || /^Bcg\b/u.test(text);
  }

  function titleFact(card) {
    const source = card.sourceName || card.subject || "公开来源";
    const original = card.originalTitle ? `，原始标题为「${card.originalTitle}」` : "";
    return `${source} 在 ${fmtDate(card.date)} 形成一条公开材料：${card.title}${original}。`;
  }

  function factText(card) {
    const candidates = [
      card.translatedFact,
      ...(card.originalHighlights || []),
      card.visibleFragment,
      card.summary,
    ].map(cleanJudgmentText).filter((item) => !isWeakFact(item));
    return compactText(candidates[0] || titleFact(card), 320);
  }

  function valueText(card) {
    const text = cleanJudgmentText(card.summary || "");
    if (!text || isWeakFact(text)) return "这条材料可用于补充当日 AI 商业变化的来源和背景。";
    return compactText(text, 220);
  }

  function sourceText(card) {
    return [card.sourceName, card.publishedAt ? fmtDate(String(card.publishedAt).slice(0, 10)) : ""]
      .filter(Boolean)
      .join(" · ");
  }

  function options(values, label = "全部") {
    const unique = [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
    return [`<option value="all">${safe(label)}</option>`, ...unique.map((value) => `<option value="${safe(value)}">${safe(value)}</option>`)].join("");
  }

  function fallbackRelationshipGraph(date) {
    const nodes = [];
    const edges = [];
    const nodeIds = new Set();
    function addNode(id, label, type, extra = {}) {
      if (!id || nodeIds.has(id)) return;
      nodeIds.add(id);
      nodes.push({ id, label, type, weight: 1, ...extra });
    }
    function addEdge(from, to, label) {
      if (from && to && from !== to) edges.push({ from, to, label, weight: 1 });
    }
    for (const card of cardsOnDate(date).filter((item) => item.category !== "opinion")) {
      const categoryId = `category:${card.category}`;
      const subject = card.subject || card.sourceName || card.title;
      const subjectId = `subject:${subject}`;
      addNode(categoryId, categoryLabel(card.category), "category", { category: card.category });
      addNode(subjectId, subject, "subject", { category: card.category });
      addEdge(categoryId, subjectId, categoryLabel(card.category));
      for (const tag of (card.displayTags || card.flatTags || []).slice(0, 2)) {
        const label = tag.label || tag.name || tag.id || tag;
        const tagId = `signal:${label}`;
        addNode(tagId, label, "signal");
        addEdge(subjectId, tagId, "关联");
      }
    }
    return { date, nodes, edges, clusters: state.payload.relationshipDirections || [] };
  }

  function relationshipGraphForDate(date) {
    const graph = state.payload.relationshipGraph;
    if (graph?.date === date) return graph;
    return fallbackRelationshipGraph(date);
  }

  function graphColumn(nodes, type) {
    return nodes.filter((node) => node.type === type).slice(0, type === "subject" ? 10 : 6);
  }

  function graphLayout(graph) {
    const columns = [
      { type: "category", x: 116, nodes: graphColumn(graph.nodes || [], "category") },
      { type: "subject", x: 475, nodes: graphColumn(graph.nodes || [], "subject") },
      { type: "signal", x: 835, nodes: graphColumn(graph.nodes || [], "signal") },
    ];
    const positions = new Map();
    for (const column of columns) {
      const step = 330 / Math.max(column.nodes.length, 1);
      column.nodes.forEach((node, index) => {
        positions.set(node.id, {
          x: column.x,
          y: 54 + step * index + Math.min(step, 42) / 2,
          type: node.type,
        });
      });
    }
    return positions;
  }

  function renderRelationshipSvg(graph) {
    const nodes = graph.nodes || [];
    if (!nodes.length) return "<div class=\"empty-state compact-empty\">当日暂无可绘制关系。</div>";
    const positions = graphLayout(graph);
    const edges = (graph.edges || []).filter((edge) => positions.has(edge.from) && positions.has(edge.to));
    const edgeMarkup = edges.map((edge) => {
      const from = positions.get(edge.from);
      const to = positions.get(edge.to);
      const mid = (from.x + to.x) / 2;
      return `
        <path class="graph-edge" d="M ${from.x + 86} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${to.x - 86} ${to.y}"></path>
        <text class="graph-edge-label" x="${mid}" y="${(from.y + to.y) / 2 - 4}" text-anchor="middle">${safe(edge.weight > 1 ? edge.weight : "")}</text>
      `;
    }).join("");
    const nodeMarkup = nodes
      .filter((node) => positions.has(node.id))
      .map((node) => {
        const pos = positions.get(node.id);
        const width = node.type === "subject" ? 230 : 170;
        const height = 42;
        return `
          <g class="graph-node graph-node-${safe(node.type)}" transform="translate(${pos.x - width / 2} ${pos.y - height / 2})">
            <rect width="${width}" height="${height}" rx="4"></rect>
            <text x="${width / 2}" y="26" text-anchor="middle">${safe(compactText(node.label, node.type === "subject" ? 22 : 14))}</text>
            <title>${safe(node.label)}</title>
          </g>
        `;
      }).join("");
    return `
      <svg class="relationship-svg" viewBox="0 0 960 420" role="img" aria-label="当日商业信号关系图谱">
        <g class="graph-columns">
          <text x="116" y="24" text-anchor="middle">类型</text>
          <text x="475" y="24" text-anchor="middle">主体</text>
          <text x="835" y="24" text-anchor="middle">关联</text>
        </g>
        ${edgeMarkup}
        ${nodeMarkup}
      </svg>
    `;
  }

  function cardTagItems(card) {
    const tags = card.displayTags?.length
      ? card.displayTags
      : (card.flatTags || []).map((tag) => ({ id: tag, label: tag }));
    return tags.filter((tag) => tag?.id || tag?.label || tag?.name);
  }

  function cardTagLabel(tag) {
    return tag?.label || tag?.name || tag?.id || tag;
  }

  function isRelationshipVariableTag(tag) {
    const id = String(tag?.id || tag || "");
    const excludedIds = new Set(["scenario-sales-briefing", "scenario-frontier-opinion", "customer-developer-team"]);
    if (excludedIds.has(id)) return false;
    return id.startsWith("track-") || id.startsWith("scenario-") || id.startsWith("customer-");
  }

  function relationshipVariableTags(card, limit = 6) {
    return cardTagItems(card).filter(isRelationshipVariableTag).slice(0, limit);
  }

  function relationshipWindowCards() {
    const activeDate = selectedDate();
    return state.payload.cards
      .filter((card) => card.category !== "opinion")
      .filter((card) => {
        const diff = daysBetween(activeDate, card.date);
        return diff >= 0 && diff <= 29;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function relationshipFilteredCards() {
    const filters = state.relationshipFilters;
    return relationshipWindowCards().filter((card) => {
      if (filters.category !== "all" && card.category !== filters.category) return false;
      if (filters.tag !== "all" && !relationshipVariableTags(card, 8).some((tag) => tag.id === filters.tag || cardTagLabel(tag) === filters.tag)) return false;
      return true;
    });
  }

  function relationshipGraphCards(cards) {
    const today = cards.filter((card) => card.date === selectedDate());
    return (today.length ? today : cards).slice(0, 14);
  }

  function relationshipTagOptions() {
    const counts = new Map();
    for (const card of relationshipWindowCards()) {
      for (const tag of relationshipVariableTags(card, 6)) {
        const id = tag.id || cardTagLabel(tag);
        if (!id) continue;
        const current = counts.get(id) || { id, label: cardTagLabel(tag), count: 0 };
        current.count += 1;
        counts.set(id, current);
      }
    }
    return [...counts.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)).slice(0, 8);
  }

  function relationshipNodeKind(card) {
    if (card.category === "funding") return "company";
    if (card.category === "case") return "customer";
    return "product";
  }

  function relationshipNodeKindLabel(kind) {
    const labels = {
      focus: "FOCUS VARIABLE",
      action: "BUSINESS ACTION",
      company: "COMPANY / ACTOR",
      product: "PRODUCT / SERVICE",
      customer: "CUSTOMER / INDUSTRY",
      tag: "COMMERCIAL VARIABLE",
    };
    return labels[kind] || kind.toUpperCase();
  }

  function relationshipAction(card) {
    if (card.category === "funding") return { id: "action:funding", label: "融资" };
    if (card.category === "case") return { id: "action:case", label: "采用 / 部署" };
    return { id: "action:product", label: "发布 / 推出" };
  }

  function relationshipTopTags(cards, limit = 6) {
    return relationshipTagCards(cards).slice(0, limit).map((row) => ({
      id: `tag:${row.id}`,
      label: row.label,
      cardCount: row.cards.length,
      categoryCount: row.categories.size,
    }));
  }

  function buildRelationshipModel(cards) {
    const nodes = new Map();
    const edges = new Map();
    const center = { x: 50, y: 50 };
    function addNode(id, label, kind, x, y, meta = "") {
      if (!id || nodes.has(id)) return;
      nodes.set(id, { id, label, kind, x, y, meta });
    }
    function addEdge(from, to, cardId) {
      if (!from || !to || from === to) return;
      const id = `${from}->${to}`;
      const edge = edges.get(id) || { from, to, weight: 0, cardIds: new Set() };
      edge.weight += 1;
      if (cardId) edge.cardIds.add(cardId);
      edges.set(id, edge);
    }
    function orbitPoint(angle, radiusX, radiusY) {
      const radians = angle * Math.PI / 180;
      return {
        x: center.x + Math.cos(radians) * radiusX,
        y: center.y + Math.sin(radians) * radiusY,
      };
    }

    const topTags = relationshipTopTags(cards, 7);
    const selectedTag = state.relationshipFilters.tag;
    const isAllTags = selectedTag === "all";
    const selectedFocusTag = topTags.find((tag) => tag.id === `tag:${selectedTag}`)
      || topTags.find((tag) => tag.id === selectedTag);
    const focusTag = isAllTags
      ? { id: "focus:all-tags", label: "全部变量", cardCount: cards.length, isAllTags: true }
      : selectedFocusTag;
    if (focusTag) addNode(focusTag.id, focusTag.label, "focus", center.x, center.y, focusTag.isAllTags ? `${topTags.length} Tags` : `${focusTag.cardCount} Cards`);
    const topTagIds = new Set(topTags.map((tag) => tag.id));
    const tagPoints = [
      { x: 80, y: 22 },
      { x: 88, y: 44 },
      { x: 82, y: 66 },
      { x: 72, y: 84 },
      { x: 90, y: 82 },
    ];
    topTags.filter((tag) => tag.id !== focusTag?.id).slice(0, isAllTags ? 6 : 5).forEach((tag, index) => {
      const point = tagPoints[index] || orbitPoint(index * 58, 36, 31);
      addNode(tag.id, tag.label, "tag", point.x, point.y, `${tag.cardCount} Cards`);
    });

    const actionRows = [
      { id: "action:funding", label: "融资", y: 26 },
      { id: "action:product", label: "发布 / 推出", y: 50 },
      { id: "action:case", label: "采用 / 部署", y: 74 },
    ];
    const activeActionIds = new Set(cards.map((card) => relationshipAction(card).id));
    actionRows.filter((action) => activeActionIds.has(action.id)).forEach((action, index) => {
      const actionAngles = [-88, 26, 142];
      const point = orbitPoint(actionAngles[index] || 0, 18, 15);
      addNode(action.id, action.label, "action", point.x, point.y);
    });

    const subjectCounts = new Map();
    cards.forEach((card) => {
      const subject = card.subject || card.sourceName || card.title;
      const subjectId = `subject:${subject}`;
      const subjectRow = subjectCounts.get(subjectId) || {
        id: subjectId,
        label: subject,
        kind: relationshipNodeKind(card),
        count: 0,
        categories: new Set(),
      };
      subjectRow.count += 1;
      subjectRow.categories.add(card.category);
      subjectCounts.set(subjectId, subjectRow);
    });

    const subjects = [...subjectCounts.values()]
      .sort((a, b) => b.count - a.count || b.categories.size - a.categories.size)
      .slice(0, 7);
    const subjectPoints = [
      { x: 17, y: 22 },
      { x: 36, y: 18 },
      { x: 17, y: 47 },
      { x: 26, y: 70 },
      { x: 42, y: 84 },
      { x: 63, y: 18 },
      { x: 15, y: 82 },
    ];
    subjects.forEach((subject, index) => {
      const point = subjectPoints[index] || orbitPoint(index * 38, 35, 34);
      addNode(subject.id, subject.label, subject.kind, point.x, point.y, `${subject.count} Card${subject.count > 1 ? "s" : ""}`);
    });
    const subjectIds = new Set(subjects.map((subject) => subject.id));

    cards.forEach((card) => {
      const subject = card.subject || card.sourceName || card.title;
      const subjectId = `subject:${subject}`;
      if (!subjectIds.has(subjectId)) return;
      const action = relationshipAction(card);
      addEdge(subjectId, action.id, card.id);
      if (focusTag && (focusTag.isAllTags || relationshipVariableTags(card, 8).some((tag) => `tag:${tag.id || cardTagLabel(tag)}` === focusTag.id))) {
        addEdge(action.id, focusTag.id, card.id);
      }
      for (const tag of relationshipVariableTags(card, 3)) {
        const label = cardTagLabel(tag);
        const tagId = `tag:${tag.id || label}`;
        if (topTagIds.has(tagId) && tagId !== focusTag?.id) addEdge(action.id, tagId, card.id);
      }
    });

    const connected = new Set();
    for (const edge of edges.values()) {
      connected.add(edge.from);
      connected.add(edge.to);
    }
    if (focusTag) connected.add(focusTag.id);
    return {
      nodes: [...nodes.values()].filter((node) => connected.has(node.id)),
      edges: [...edges.values()].map((edge) => ({ ...edge, cardIds: [...edge.cardIds] })),
    };
  }

  function renderRelationshipNetwork(cards) {
    const model = buildRelationshipModel(relationshipGraphCards(cards));
    if (!model.nodes.length) return "<div class=\"empty-state compact-empty\">当前筛选下暂无可绘制关系。</div>";
    const lines = model.edges.map((edge) => {
      const from = model.nodes.find((node) => node.id === edge.from);
      const to = model.nodes.find((node) => node.id === edge.to);
      if (!from || !to) return "";
      const strength = Math.min(edge.weight, 5);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const length = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const bend = Math.min(length * .16, 5);
      const c1 = {
        x: from.x + dx * .34 - dy / length * bend,
        y: from.y + dy * .34 + dx / length * bend,
      };
      const c2 = {
        x: from.x + dx * .66 - dy / length * bend,
        y: from.y + dy * .66 + dx / length * bend,
      };
      return `
        <path class="relation-workbench-line ${edge.weight > 1 ? "is-strong" : ""}"
          data-weight="${safe(strength)}"
          d="M ${from.x * 10} ${from.y * 6} C ${c1.x * 10} ${c1.y * 6}, ${c2.x * 10} ${c2.y * 6}, ${to.x * 10} ${to.y * 6}">
        </path>
      `;
    }).join("");
    const nodes = model.nodes.map((node) => `
      <div class="relation-workbench-node" data-kind="${safe(node.kind)}" style="left:${safe(node.x)}%;top:${safe(node.y)}%">
        <strong>${safe(compactText(node.label, node.kind === "evidence" ? 16 : 24))}</strong>
        ${node.meta ? `<em>${safe(node.meta)}</em>` : ""}
        <span>${safe(relationshipNodeKindLabel(node.kind))}</span>
      </div>
    `).join("");
    return `
      <div class="relation-network-canvas">
        <div class="relation-network-legend">
          <span>主体</span>
          <span>商业动作</span>
          <span>关键变量</span>
        </div>
        <svg class="relation-network-lines" viewBox="0 0 1000 600" aria-hidden="true">${lines}</svg>
        <div class="relation-network-nodes">${nodes}</div>
      </div>
    `;
  }

  function renderRelationshipSignalList(cards) {
    const visible = cards.slice(0, 12);
    if (!visible.length) return "<div class=\"empty-state compact-empty\">当前筛选下暂无 Card 证据。</div>";
    return visible.map((card) => `
      <article class="relation-signal-card">
        <div class="relation-signal-meta">
          <span class="type-pill" data-type="${safe(card.category)}">${safe(card.categoryLabel || categoryLabel(card.category))}</span>
          <span class="date-pill">${safe(card.date)}</span>
          <span class="evidence-pill">${safe(card.id)}</span>
        </div>
        <h3>${safe(card.title)}</h3>
        <p>${safe(factText(card))}</p>
        <div class="inline-tags">${tagPills(relationshipVariableTags(card, 4), 4)}</div>
        <button class="detail-link relation-detail-link" type="button" data-open-detail="${safe(card.id)}">查看 Card 详情</button>
      </article>
    `).join("");
  }

  function renderRelationshipTimeline(cards) {
    if (!cards.length) return "<div class=\"empty-state compact-empty\">当前筛选下暂无时间记录。</div>";
    const groups = cards.slice(0, 18).reduce((acc, card) => {
      acc[card.date] = acc[card.date] || [];
      acc[card.date].push(card);
      return acc;
    }, {});
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a)).map(([date, items]) => `
      <div class="relation-timeline-row">
        <div class="relation-timeline-date">${safe(date)}</div>
        <div class="relation-timeline-items">
          ${items.map((item) => `
            <div class="relation-timeline-item">
              <strong>${safe(item.title)}</strong>
              <span>${safe(item.categoryLabel || categoryLabel(item.category))} · ${safe(item.id)}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  function relationshipTagCards(cards) {
    const tags = new Map();
    for (const card of cards) {
      for (const tag of relationshipVariableTags(card, 6)) {
        const id = tag.id || cardTagLabel(tag);
        if (!id) continue;
        const row = tags.get(id) || {
          id,
          label: cardTagLabel(tag),
          cards: [],
          categories: new Set(),
          latest: card.date,
        };
        row.cards.push(card);
        row.categories.add(card.category);
        if (card.date > row.latest) row.latest = card.date;
        tags.set(id, row);
      }
    }
    return [...tags.values()].sort((a, b) => b.cards.length - a.cards.length || b.categories.size - a.categories.size).slice(0, 8);
  }

  function renderRelationshipTagAggregation(cards) {
    const rows = relationshipTagCards(cards);
    if (!rows.length) return "<div class=\"empty-state compact-empty\">当前筛选下暂无 tag 聚合。</div>";
    const maxCount = Math.max(...rows.map((row) => row.cards.length), 1);
    return rows.map((row) => {
      const counts = visibleCategories().map((category) => ({
        label: category.label,
        count: row.cards.filter((card) => card.category === category.category).length,
      }));
      const totalWidth = Math.max(8, Math.round(row.cards.length / maxCount * 100));
      const typeCounts = counts.map((item) => `
        <span class="${item.count ? "" : "is-empty"}">
          <b>${safe(item.label)}</b>
          <em>${safe(item.count)}</em>
        </span>
      `).join("");
      return `
        <article class="relation-tag-card">
          <div class="relation-tag-head">
            <strong>${safe(row.label)}</strong>
            <em>${safe(row.cards.length)} cards · ${safe(row.categories.size)} types</em>
          </div>
          <div class="relation-type-bars" aria-label="类型构成">
            <span class="relation-total-fill" style="width:${safe(totalWidth)}%"></span>
            ${typeCounts}
          </div>
        </article>
      `;
    }).join("");
  }

  function relationshipCandidates(cards) {
    const fromTags = relationshipTagCards(cards)
      .filter((row) => row.cards.length >= 2)
      .map((row) => ({
        id: `tag:${row.id}`,
        title: `${row.label} 出现多条商业信号`,
        summary: `当前 30 日窗口内，${row.cards.length} 张 Card 围绕该变量聚集，覆盖 ${row.categories.size} 类信号。`,
        boundary: row.categories.size >= 2 ? "已出现多类型证据，仍需继续观察客户、产品或资金动作是否延续。" : "目前主要来自同一类型 Card，不能直接形成趋势结论。",
        evidenceCount: row.cards.length,
        categoryCount: row.categories.size,
      }));
    const visibleIds = new Set(cards.map((card) => card.id));
    const fromDirections = (state.payload.relationshipDirections || [])
      .map((item) => {
        const supporting = (item.supportingCards || []).filter((card) => visibleIds.has(card.id));
        return {
          ...item,
          supportingCards: supporting,
          evidenceCount: supporting.length,
          categoryCount: new Set(supporting.map((card) => card.categoryLabel || card.category)).size,
        };
      })
      .filter((item) => item.evidenceCount >= 2)
      .map((item) => ({
        id: item.id,
        title: item.title || item.direction,
        summary: item.summary || item.evidenceMeta || "保留为关系方向候选。",
        boundary: item.categoryCount >= 2 ? "由多类型 Card 支撑，可继续观察变量是否扩散。" : "当前仍偏同一类型证据，不作为正式趋势结论。",
        evidenceCount: item.evidenceCount,
        categoryCount: item.categoryCount,
        source: "direction",
      }));
    return [...fromTags, ...fromDirections]
      .sort((a, b) => b.categoryCount - a.categoryCount || b.evidenceCount - a.evidenceCount)
      .slice(0, 4);
  }

  function renderRelationshipCandidates(cards) {
    const candidates = relationshipCandidates(cards);
    if (!candidates.length) return "<div class=\"empty-state compact-empty\">当前筛选下暂无多张 Card 支撑的迹象候选。</div>";
    return candidates.map((item) => `
      <article class="relation-candidate-card ${item.categoryCount < 2 ? "is-quiet" : ""}" ${item.source === "direction" ? `data-open-relationship="${safe(item.id)}"` : ""}>
        <div class="relation-signal-meta">
          <span class="evidence-pill">${safe(item.evidenceCount)} evidence</span>
          <span class="date-pill">${safe(item.categoryCount)} types</span>
        </div>
        <h3>${safe(compactText(item.title, 58))}</h3>
        <p>${safe(compactText(item.summary, 150))}</p>
        <p>${safe(item.boundary)}</p>
      </article>
    `).join("");
  }

  function renderStats() {
    const root = $("[data-relationship-overview]");
    if (!root) return;
    const date = selectedDate();
    const cards = relationshipFilteredCards();
    const activeCategory = state.relationshipFilters.category;
    const activeTag = state.relationshipFilters.tag;
    const typeButtons = [{ category: "all", label: "全部" }, ...visibleCategories()].map((item) => `
      <button type="button" class="relation-filter-button ${activeCategory === item.category ? "is-active" : ""}" data-rel-category="${safe(item.category)}">${safe(item.label)}</button>
    `).join("");
    const tagButtons = [
      `<button type="button" class="relation-tag-button ${activeTag === "all" ? "is-active" : ""}" data-rel-tag="all">all tags</button>`,
      ...relationshipTagOptions().map((tag) => `
        <button type="button" class="relation-tag-button ${activeTag === tag.id ? "is-active" : ""}" data-rel-tag="${safe(tag.id)}">${safe(tag.label)}</button>
      `),
    ].join("");
    root.innerHTML = `
      <section class="relationship-workbench">
        <div class="relationship-control-strip" aria-label="关系图谱筛选">
          <div class="relationship-type-filters">${typeButtons}</div>
          <div class="relationship-tag-filters">${tagButtons}</div>
        </div>
        <div class="relationship-workbench-grid">
          <div class="relation-network-panel">
            <div class="relationship-panel-head">
              <div>
                <p class="desk-kicker">Network</p>
                <h3>关系网络</h3>
              </div>
              <span>${safe(fmtDate(date))} · 30 日窗口</span>
            </div>
            ${renderRelationshipNetwork(cards)}
          </div>
          <aside class="relation-evidence-panel">
            <div class="relationship-panel-head">
              <div>
                <p class="desk-kicker">Evidence Cards</p>
                <h3>证据列表</h3>
              </div>
              <span>${safe(cards.length)} cards</span>
            </div>
            <div class="relation-signal-list">${renderRelationshipSignalList(cards)}</div>
          </aside>
        </div>
        <div class="relationship-insight-grid">
          <div class="relationship-insight-panel">
            <div class="relationship-panel-head">
              <div>
                <p class="desk-kicker">Timeline</p>
                <h3>时间聚集</h3>
              </div>
            </div>
            <div class="relation-timeline">${renderRelationshipTimeline(cards)}</div>
          </div>
          <div class="relationship-insight-panel">
            <div class="relationship-panel-head">
              <div>
                <p class="desk-kicker">Tags</p>
                <h3>Tag 聚合</h3>
              </div>
            </div>
            <div class="relation-tag-list">${renderRelationshipTagAggregation(cards)}</div>
          </div>
          <div class="relationship-insight-panel">
            <div class="relationship-panel-head">
              <div>
                <p class="desk-kicker">Signal Candidates</p>
                <h3>迹象候选</h3>
              </div>
            </div>
            <div class="relation-candidate-list">${renderRelationshipCandidates(cards)}</div>
          </div>
        </div>
      </section>
    `;
    root.onclick = (event) => {
      const typeButton = event.target.closest("[data-rel-category]");
      if (typeButton) {
        state.relationshipFilters.category = typeButton.dataset.relCategory || "all";
        renderAll();
        return;
      }
      const tagButton = event.target.closest("[data-rel-tag]");
      if (tagButton) {
        state.relationshipFilters.tag = tagButton.dataset.relTag || "all";
        renderAll();
        return;
      }
      const detailButton = event.target.closest("[data-open-detail]");
      if (detailButton) {
        const card = state.payload.cards.find((item) => item.id === detailButton.dataset.openDetail);
        if (card) renderDetail(card);
        return;
      }
      const relationshipCard = event.target.closest("[data-open-relationship]");
      if (relationshipCard) {
        const item = (state.payload.relationshipDirections || []).find((relationship) => relationship.id === relationshipCard.dataset.openRelationship);
        if (item) renderRelationshipDetail(item);
      }
    };
    const graphSummaryPanel = $("[data-day-summary]");
    if (graphSummaryPanel) graphSummaryPanel.textContent = fmtDate(date);
    return;
    const graphStats = visibleCategories().map((item) => ({
      ...item,
      today: countByDateAndCategory(date, item.category),
      last7: countLast7ByCategory(date, item.category),
      growth: countLast7ByCategory(date, item.category) - countWindowByCategory(date, item.category, 7, 13),
    }));
    const graph = relationshipGraphForDate(date);
    const total = cardsOnDate(date).filter((item) => item.category !== "opinion").length;
    root.innerHTML = `
      <section class="relationship-graph-panel">
        <div class="relationship-graph-head">
          <div>
            <strong>商业信号关系图</strong>
            <span>${safe(fmtDate(date))} · ${safe(total)} 张</span>
          </div>
          <div class="relationship-mini-stats" aria-label="分类统计">
            ${graphStats.map((item) => `
              <span title="${safe(growthLabel(item.growth))}">
                ${safe(item.label)} <b>${safe(item.today)}</b>
              </span>
            `).join("")}
          </div>
        </div>
        ${renderRelationshipSvg(graph)}
      </section>
    `;
    const graphSummary = $("[data-day-summary]");
    if (graphSummary) graphSummary.textContent = fmtDate(date);
    return;
    const stats = visibleCategories().map((item) => {
      const last7 = countLast7ByCategory(date, item.category);
      const prev7 = countWindowByCategory(date, item.category, 7, 13);
      const last30 = countWindowByCategory(date, item.category, 0, 29);
      const growth = last7 - prev7;
      return {
        ...item,
        today: countByDateAndCategory(date, item.category),
        last7,
        last30,
        prev7,
        growth,
      };
    });
    root.innerHTML = stats.map((item) => `
      <article class="relation-stat-card">
        <div class="relation-stat-head">
          <h3>${safe(item.label)}</h3>
          <span class="category-delta ${safe(growthClass(item.growth))}" aria-label="${safe(growthLabel(item.growth))}">
            ${safe(growthIcon(item.growth))}${safe(Math.abs(item.growth))}
          </span>
        </div>
        <div class="relation-stat-line" aria-label="${safe(item.label)}统计">
          <span title="当日">●<b>${safe(item.today)}</b></span>
          <span title="近 7 天">⑦<b>${safe(item.last7)}</b></span>
          <span title="近 30 天">30<b>${safe(item.last30)}</b></span>
        </div>
      </article>
    `).join("");
    const summary = $("[data-day-summary]");
    if (summary) {
      summary.textContent = fmtDate(date);
    }
  }

  function growthClass(value) {
    if (value > 0) return "is-up";
    if (value < 0) return "is-down";
    return "is-flat";
  }

  function growthIcon(value) {
    if (value > 0) return "↑";
    if (value < 0) return "↓";
    return "→";
  }

  function growthLabel(value) {
    if (value > 0) return `近 7 天 +${value}`;
    if (value < 0) return `近 7 天 ${value}`;
    return "近 7 天持平";
  }

  function renderTabs() {
    const tabs = $("[data-category-tabs]");
    if (!tabs) return;
    const items = [{ category: "all", label: "全部" }, ...visibleCategories()];
    tabs.innerHTML = items.map((item) => `
      <button type="button" class="${state.activeCategory === item.category ? "is-active" : ""}" data-tab="${safe(item.category)}">
        ${safe(item.label)}
      </button>
    `).join("");
    tabs.onclick = (event) => {
      const button = event.target.closest("[data-tab]");
      if (!button) return;
      state.activeCategory = button.dataset.tab;
      state.filters.category = state.activeCategory;
      const categoryFilter = $("[data-category-filter]");
      if (categoryFilter) categoryFilter.value = state.activeCategory;
      renderAll();
    };
  }

  function setupDateControls() {
    const root = $("[data-date-controls]");
    if (!root) return;
    const years = $("[data-date-year]");
    const months = $("[data-date-month]");
    const days = $("[data-date-day]");
    if (!years || !months || !days) return;

    const dates = availableDates();
    const parts = dates.map((date) => {
      const [year, month, day] = date.split("-");
      return { date, year, month, day };
    });
    const selected = selectedDate();
    const [selectedYear, selectedMonth, selectedDay] = selected.split("-");

    years.innerHTML = [...new Set(parts.map((item) => item.year))]
      .map((year) => `<option value="${safe(year)}">${safe(year)}</option>`).join("");
    years.value = selectedYear;

    function renderMonthDay() {
      const year = years.value;
      const currentMonth = months.value || selectedMonth;
      const currentDay = days.value || selectedDay;
      const availableMonths = [...new Set(parts.filter((item) => item.year === year).map((item) => item.month))];
      months.innerHTML = availableMonths.map((month) => `<option value="${safe(month)}">${Number(month)}月</option>`).join("");
      if (availableMonths.includes(currentMonth)) months.value = currentMonth;

      const month = months.value;
      const availableDays = [...new Set(parts.filter((item) => item.year === year && item.month === month).map((item) => item.day))];
      days.innerHTML = availableDays.map((day) => `<option value="${safe(day)}">${Number(day)}日</option>`).join("");
      if (availableDays.includes(currentDay)) days.value = currentDay;
    }

    renderMonthDay();

    root.onchange = () => {
      renderMonthDay();
      state.filters.date = `${years.value}-${months.value}-${days.value}`;
      renderAll();
    };
  }

  function setupFilters() {
    const form = $("[data-filters]");
    const categoryFilter = $("[data-category-filter]");
    if (categoryFilter) {
      categoryFilter.innerHTML = options(visibleCategories().map((item) => item.category), "全部分类");
      for (const option of categoryFilter.options) {
        const match = visibleCategories().find((item) => item.category === option.value);
        if (match) option.textContent = match.label;
      }
    }
    if (!form) return;
    for (const [key, value] of Object.entries(state.filters)) {
      const field = form.elements[key];
      if (field) field.value = value;
    }
    form.addEventListener("input", () => {
      const data = new FormData(form);
      state.filters = {
        range: data.get("range") || "all",
        category: data.get("category") || "all",
        track: data.get("track") || "all",
        evidence: data.get("evidence") || "all",
        stage: data.get("stage") || "all",
        source: data.get("source") || "all",
        query: String(data.get("query") || "").trim().toLowerCase(),
      };
      state.activeCategory = state.filters.category;
      renderAll();
    });
  }

  function filteredCards() {
    const activeDate = selectedDate();
    return state.payload.cards.filter((card) => {
      const filters = state.filters;
      const rangeDiff = daysBetween(activeDate, card.date);
      const queryText = [
        card.title,
        card.subject,
        card.summary,
        ...(card.flatTags || []),
        ...(card.displayTags || []).map((tag) => tag.label),
      ].join(" ").toLowerCase();
      if (filters.category !== "all" && card.category !== filters.category) return false;
      if (filters.date && card.date !== filters.date) return false;
      if (filters.range === "7" && (rangeDiff < 0 || rangeDiff > 6)) return false;
      if (filters.range === "30" && (rangeDiff < 0 || rangeDiff > 29)) return false;
      if (filters.track !== "all" && !(card.tags?.track || []).includes(filters.track)) return false;
      if (filters.evidence !== "all" && !(card.tags?.evidence || []).includes(filters.evidence)) return false;
      if (filters.stage !== "all" && !(card.tags?.stage || []).includes(filters.stage)) return false;
      if (filters.source !== "all" && !(card.tags?.source || []).includes(filters.source)) return false;
      if (filters.query && !queryText.includes(filters.query)) return false;
      return true;
    });
  }

  function renderTable(cards) {
    const root = $("[data-table-body]");
    if (!root) return;
    root.innerHTML = cards.length ? cards.map((card) => `
      <tr class="card-summary-row" data-card-row="${safe(card.id)}">
        <td><strong>${safe(card.title)}</strong></td>
        <td>${safe(card.subject)}</td>
        <td><div class="row-tags">${tagPills(card.displayTags || card.flatTags, 4)}</div></td>
      </tr>
      <tr class="card-preview-row" data-card-preview="${safe(card.id)}">
        <td colspan="3">
          <div class="inline-preview">
            <p>${safe(factText(card))}</p>
            <button class="detail-link" type="button" data-open-detail="${safe(card.id)}">查看完整详情</button>
          </div>
        </td>
      </tr>
    `).join("") : "<tr><td colspan=\"3\">当前筛选条件下没有 Card。请放宽时间范围或标签筛选。</td></tr>";
  }

  function renderList(cards) {
    const count = $("[data-result-count]");
    if (count) count.textContent = "";
  }

  function renderRelationshipLinks() {
    const root = $("[data-relationship-links]");
    if (!root) return;
    root.innerHTML = "";
    root.onclick = null;
    return;
    const links = (state.payload.relationshipDirections || []).slice(0, 6);
    root.innerHTML = links.length ? `
      <div class="relationship-cluster-list">
        ${links.map((item) => `
          <button class="relationship-cluster" type="button" data-open-relationship="${safe(item.id)}">
            <span>${safe(item.direction)}</span>
            <strong>${safe(item.title)}</strong>
            <em>${(item.relation || []).map((node) => safe(node)).join(" → ")}</em>
          </button>
        `).join("")}
      </div>
    ` : "<div class=\"empty-state compact-empty\">当日暂无可追溯关系簇。</div>";
    root.onclick = (event) => {
      const button = event.target.closest("[data-open-relationship]");
      const id = button?.dataset.openRelationship;
      if (!id) return;
      const item = links.find((relationship) => relationship.id === id);
      if (item) renderRelationshipDetail(item);
    };
    return;
    root.innerHTML = links.length ? links.map((item) => `
      <article class="trend-card" data-relationship-card="${safe(item.id)}">
        <span class="direction-label">${safe(item.direction)}</span>
        <strong>${safe(item.title)}</strong>
        <p>${safe(item.summary)}</p>
        <div class="direction-path" aria-label="关系链">
          ${(item.relation || []).map((node, index) => `${index ? "<i>→</i>" : ""}<span>${safe(node)}</span>`).join("")}
        </div>
        <div class="direction-meta">${safe(item.evidenceMeta || `当日 ${item.todayCount} 张 · 近 7 天 ${item.last7Count} 张`)}</div>
        <button class="detail-link trend-detail-link" type="button" data-open-relationship="${safe(item.id)}">查看方向详情</button>
      </article>
    `).join("") : "<div class=\"empty-state\">当日暂无足够的关系方向证据，只保留商业信号事实。</div>";
    root.onclick = (event) => {
      const button = event.target.closest("[data-open-relationship]");
      const card = event.target.closest("[data-relationship-card]");
      const id = button?.dataset.openRelationship || card?.dataset.relationshipCard;
      if (!id) return;
      const item = links.find((relationship) => relationship.id === id);
      if (item) renderRelationshipDetail(item);
    };
  }

  function trendText(item, keys, fallback) {
    for (const key of keys) {
      const value = item[key];
      if (value) return compactText(value, 180);
    }
    return fallback;
  }

  function trendAssetCard(item, mode = "candidate") {
    const status = mode === "history" ? "历史候选" : (mode === "recent-candidate" ? "继续观察" : "趋势候选");
    const what = trendText(item, ["hypothesis", "title"], "暂无趋势描述。");
    const where = trendText(item, ["relationSummary", "evidenceMeta"], "暂无可展示的表现位置。");
    const boundary = trendText(item, ["boundary", "evidenceBoundary"], "暂无证据边界说明。");
    return `
      <article class="trend-card trend-asset-card trend-evidence-card" data-trend-asset="${safe(item.id)}" data-trend-mode="${safe(mode)}">
        <div class="trend-evidence-head">
          <span class="direction-label">${safe(status)}</span>
          <strong>${safe(item.title)}</strong>
        </div>
        <dl class="trend-evidence-grid">
          <div>
            <dt>是什么</dt>
            <dd>${safe(what)}</dd>
          </div>
          <div>
            <dt>表现在哪里</dt>
            <dd>${safe(where)}</dd>
          </div>
          <div>
            <dt>证据边界</dt>
            <dd>${safe(boundary)}</dd>
          </div>
        </dl>
        <button class="detail-link trend-detail-link" type="button" data-open-trend-asset="${safe(item.id)}" data-trend-mode="${safe(mode)}">查看详情</button>
      </article>
    `;
    return `
      <article class="trend-card trend-asset-card" data-trend-asset="${safe(item.id)}" data-trend-mode="${safe(mode)}">
        <span class="direction-label">${safe(item.stageLabel || "趋势资产")}</span>
        <strong>${safe(item.title)}</strong>
        <p>${safe(item.relationSummary || item.hypothesis || "暂无公开摘要。")}</p>
        <div class="trend-card-block">
          <b>证据边界</b>
          <div class="direction-support">
            <em>${safe(item.boundary || "暂无边界说明。")}</em>
          </div>
        </div>
        <button class="detail-link trend-detail-link" type="button" data-open-trend-asset="${safe(item.id)}" data-trend-mode="${safe(mode)}">查看趋势详情</button>
      </article>
    `;
  }

  function renderTrendCandidates() {
    const root = $("[data-trend-candidates]");
    if (!root) return;
    const today = state.payload.trendCandidates || [];
    const recent = (state.payload.recentTrendCandidates || []).filter((item) => !today.some((candidate) => candidate.id === item.id));
    const items = today.length ? today : recent.slice(0, 2);
    const note = today.length
      ? ""
      : `<div class="trend-note">今日暂无新增趋势候选。以下保留最近候选，用于继续观察证据是否增加。</div>`;
    root.innerHTML = `${note}${items.length
      ? items.map((item) => trendAssetCard(item, today.length ? "candidate" : "recent-candidate")).join("")
      : "<div class=\"empty-state\">暂无趋势候选资产。</div>"}`;
    root.onclick = handleTrendAssetClick;
  }

  function renderHistoricalTrends() {
    const root = $("[data-historical-trends]");
    if (!root) return;
    const items = state.payload.historicalTrends || [];
    root.innerHTML = items.length
      ? items.map((item) => trendAssetCard(item, "history")).join("")
      : "<div class=\"empty-state\">暂无已沉淀历史趋势资产。</div>";
    root.onclick = handleTrendAssetClick;
  }

  function allTrendAssets() {
    return [
      ...(state.payload.trendCandidates || []),
      ...(state.payload.recentTrendCandidates || []),
      ...(state.payload.historicalTrends || []),
    ];
  }

  function handleTrendAssetClick(event) {
    const button = event.target.closest("[data-open-trend-asset]");
    const card = event.target.closest("[data-trend-asset]");
    const id = button?.dataset.openTrendAsset || card?.dataset.trendAsset;
    if (!id) return;
    const item = allTrendAssets().find((asset) => asset.id === id);
    if (item) renderTrendAssetDetail(item);
  }

  function detailField(label, value, isLink = false) {
    const text = value || "暂无公开信息";
    return `
      <div class="detail-field">
        <span>${safe(label)}</span>
        ${isLink && value ? `<a href="${safe(value)}" target="_blank" rel="noreferrer">${safe(value)}</a>` : `<strong>${safe(text)}</strong>`}
      </div>
    `;
  }

  function renderRelationshipDetail(item) {
    const root = $("[data-detail-content]");
    const dialog = $("[data-detail-dialog]");
    if (!root || !dialog) return;
    const support = item.supportingCards || [];
    root.innerHTML = `
      <h2 class="detail-title">${safe(item.title)}</h2>
      <div class="detail-source-row">
        <span>关系簇 · ${safe(fmtDate(selectedDate()))}</span>
        <strong>${safe(item.direction || "商业关系")}</strong>
      </div>
      <div class="detail-fact-card">
        <h3>可见事实</h3>
        <p>${safe(item.summary || item.detailFocus || "暂无可见事实。")}</p>
      </div>
      <div class="detail-block">
        <h3>关系链</h3>
        <div class="direction-path direction-path-detail" aria-label="关系链">
          ${(item.relation || []).map((node, index) => `${index ? "<i>→</i>" : ""}<span>${safe(node)}</span>`).join("")}
        </div>
      </div>
      <div class="detail-block">
        <h3>支撑材料</h3>
        ${support.length ? `
          <div class="relationship-support-list">
            ${support.map((card) => `
              <article>
                <span>${safe(card.categoryLabel)} · ${safe(card.subject || card.sourceName || "未标注主体")}</span>
                <strong>${safe(card.title)}</strong>
                ${card.sourceUrl ? `<a href="${safe(card.sourceUrl)}" target="_blank" rel="noreferrer">查看来源</a>` : ""}
              </article>
            `).join("")}
          </div>
        ` : "<p>暂无支撑材料。</p>"}
      </div>
    `;
    dialog.showModal();
    return;
    root.innerHTML = `
      <h2 class="detail-title">${safe(item.title)}</h2>
      <div class="detail-source-row">
        <span>关系方向 · ${safe(fmtDate(state.payload.meta.activeDate))}</span>
        <strong>${safe(item.evidenceMeta || "素材来自当日商业信号")}</strong>
      </div>
      <div class="detail-fact-card">
        <h3>可见事实</h3>
        <p>${safe(item.summary)}</p>
      </div>
      <div class="detail-main-grid">
        <div class="detail-block">
          <h3>关系链</h3>
          <div class="direction-path direction-path-detail" aria-label="关系链">
            ${(item.relation || []).map((node, index) => `${index ? "<i>→</i>" : ""}<span>${safe(node)}</span>`).join("")}
          </div>
          <p>${safe(item.detailFocus || "暂无补充说明。")}</p>
        </div>
      </div>
      <div class="detail-block">
        <h3>支撑材料</h3>
        ${support.length ? `
          <div class="relationship-support-list">
            ${support.map((card) => `
              <article>
                <span>${safe(card.categoryLabel)} · ${safe(card.subject || card.sourceName || "未标注主体")}</span>
                <strong>${safe(card.title)}</strong>
                ${card.sourceUrl ? `<a href="${safe(card.sourceUrl)}" target="_blank" rel="noreferrer">查看来源</a>` : ""}
              </article>
            `).join("")}
          </div>
        ` : "<p>暂无支撑材料。</p>"}
      </div>
    `;
    dialog.showModal();
  }

  function renderTrendAssetDetail(item) {
    const root = $("[data-detail-content]");
    const dialog = $("[data-detail-dialog]");
    if (!root || !dialog) return;
    const signals = item.relatedSignals || [];
    root.innerHTML = `
      <h2 class="detail-title">${safe(item.title)}</h2>
      <div class="detail-source-row">
        <span>${safe(item.stageLabel || "趋势候选")} · ${safe(fmtDate(item.date))}</span>
        <strong>${safe(item.evidenceMeta || "来自商业信号卡片")}</strong>
      </div>
      <div class="detail-fact-card">
        <h3>是什么趋势</h3>
        <p>${safe(item.hypothesis || item.title || "暂无趋势描述。")}</p>
      </div>
      <div class="detail-main-grid">
        <div class="detail-block">
          <h3>表现在哪里</h3>
          <p>${safe(item.relationSummary || "暂无可展示的表现位置。")}</p>
        </div>
        <div class="detail-block">
          <h3>证据边界</h3>
          <p>${safe(item.boundary || item.evidenceBoundary || "暂无证据边界说明。")}</p>
        </div>
      </div>
      <div class="detail-block">
        <h3>来源卡片</h3>
        <div class="relationship-support-list">
          <article>
            <span>商业信号</span>
            <strong>${safe(signals.length ? signals.join(" / ") : "暂无关联信号")}</strong>
          </article>
        </div>
      </div>
    `;
    dialog.showModal();
    return;
    root.innerHTML = `
      <h2 class="detail-title">${safe(item.title)}</h2>
      <div class="detail-source-row">
        <span>${safe(item.stageLabel || "趋势资产")} · ${safe(fmtDate(item.date))}</span>
        <strong>${safe(item.stageLabel || "继续观察")}</strong>
      </div>
      <div class="detail-fact-card">
        <h3>趋势描述</h3>
        <p>${safe(item.hypothesis || "暂无公开说明。")}</p>
      </div>
      <div class="detail-main-grid">
        <div class="detail-block">
          <h3>关系摘要</h3>
          <p>${safe(item.relationSummary || "暂无关系摘要。")}</p>
        </div>
      </div>
      <div class="detail-block">
        <h3>证据边界</h3>
        <p>${safe(item.boundary || "暂无边界说明。")}</p>
      </div>
      <div class="detail-block">
        <h3>下一步观察</h3>
        <p>${safe(item.nextObservation || "暂无下一步观察。")}</p>
      </div>
      <div class="detail-block">
        <h3>关联资产</h3>
        <div class="relationship-support-list">
          <article>
            <span>支撑信号</span>
            <strong>${safe(signals.length ? signals.join(" / ") : "暂无关联信号")}</strong>
          </article>

        </div>
      </div>
      <details class="detail-aux">
        <summary>辅助信息</summary>
        <div class="detail-tags">${tagPills(item.displayTags || [], 12)}</div>
      </details>
    `;
    dialog.showModal();
  }

  function renderDetail(card) {
    const root = $("[data-detail-content]");
    const dialog = $("[data-detail-dialog]");
    if (!root || !dialog) return;
    const fact = factText(card);
    const value = valueText(card);
    const highlights = (card.originalHighlights || []).map(cleanJudgmentText).filter((item) => hasCjk(item) && item !== fact && !isWeakFact(item)).slice(0, 8);
    const sourceLinks = card.sourceLinks || [];
    root.innerHTML = `
      <h2 class="detail-title">${safe(card.title)}</h2>
      <div class="detail-source-row">
        <span>${safe(card.categoryLabel)} · ${safe(fmtDate(card.date))}</span>
        <strong>${safe(sourceText(card) || card.sourceName || "暂无公开来源")}</strong>
        ${card.sourceUrl ? `<a href="${safe(card.sourceUrl)}" target="_blank" rel="noreferrer">查看原文</a>` : ""}
      </div>
      <div class="detail-fact-card">
        <h3>新闻事实</h3>
        <p>${safe(fact)}</p>
      </div>
      <div class="detail-main-grid">
        <div class="detail-block">
        <h3>原文要点</h3>
        ${highlights.length
          ? `<ul>${highlights.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>`
          : "<p>暂无公开信息。</p>"}
        </div>
        <div class="detail-block">
          <h3>简要价值描述</h3>
          <p>${safe(value)}</p>
        </div>
      </div>
      <div class="detail-block">
        <h3>可见原文片段</h3>
        <p>${safe(card.visibleFragment || "该 Card 暂缺完整证据链，请回到原始资产文件复核。")}</p>
      </div>
      <details class="detail-aux">
        <summary>辅助信息</summary>
        <div class="detail-tags">${tagPills(card.displayTags || card.flatTags, 12)}</div>
        <div class="detail-grid">
          ${detailField("主体", card.subject)}
          ${detailField("发布时间", card.publishedAt)}
        </div>
        ${sourceLinks.length ? `
          <div class="detail-source-list">
            ${sourceLinks.map((item) => `<a href="${safe(item)}" target="_blank" rel="noreferrer">${safe(item)}</a>`).join("")}
          </div>
        ` : ""}
      </details>
    `;
    dialog.showModal();
  }

  function bindListActions() {
    const table = $("[data-table-body]");
    if (table) table.onclick = (event) => {
      const detailButton = event.target.closest("[data-open-detail]");
      if (detailButton) {
        const card = state.payload.cards.find((item) => item.id === detailButton.dataset.openDetail);
        if (card) renderDetail(card);
        return;
      }
      const row = event.target.closest("[data-card-row]");
      if (!row) return;
      const isOpen = row.classList.contains("is-selected");
      for (const item of $$("[data-card-row]")) item.classList.remove("is-selected");
      for (const item of $$("[data-card-preview]")) item.classList.remove("is-open");
      if (!isOpen) {
        row.classList.add("is-selected");
        $(`[data-card-preview="${CSS.escape(row.dataset.cardRow)}"]`)?.classList.add("is-open");
      }
    };
  }

  function renderAll() {
    const cards = filteredCards();
    renderTabs();
    renderStats();
    renderTable(cards);
    renderList(cards);
    renderRelationshipLinks();
    renderTrendCandidates();
    renderHistoricalTrends();
  }

  async function init() {
    const response = await fetch("data/v3-data-observation-desk.json");
    state.payload = await response.json();
    $$("[data-active-date]").forEach((date) => {
      date.textContent = fmtDate(state.payload.meta.activeDate);
    });
    state.filters.date = state.payload.meta.activeDate;
    setupDateControls();
    setupFilters();
    bindListActions();
    renderAll();
    const close = $("[data-detail-close]");
    const dialog = $("[data-detail-dialog]");
    if (close && dialog) close.addEventListener("click", () => dialog.close());
  }

  init().catch((error) => {
    const shell = $(".desk-shell");
    if (shell) shell.insertAdjacentHTML("beforeend", `<div class="empty-state">数据观察台加载失败：${safe(error.message)}</div>`);
  });
}());
