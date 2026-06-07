const typeLabels = {
  all: "全部",
  product_service: "产品",
  funding: "融资",
  case: "案例",
};

const cards = [
  {
    id: "C-061",
    date: "2026-05-18",
    type: "funding",
    title: "Northstar AI 完成 B 轮融资",
    subject: "Northstar AI",
    relation: "Northbank Capital 投资企业级 Agent 编排方向。",
    tags: ["agent infra", "enterprise workflow"],
    nodeIds: ["northstar", "northbank", "agent-infra", "enterprise-workflow"],
  },
  {
    id: "C-064",
    date: "2026-05-23",
    type: "product_service",
    title: "Northstar AI 发布工作流执行平台",
    subject: "Northstar AI",
    relation: "新产品面向企业审批、客服和运营流程。",
    tags: ["agent infra", "enterprise workflow"],
    nodeIds: ["northstar", "orchestrator", "agent-infra", "enterprise-workflow"],
  },
  {
    id: "C-069",
    date: "2026-06-01",
    type: "case",
    title: "AlphaCare 将 AI 助手接入病案审核流程",
    subject: "AlphaCare",
    relation: "医疗机构把助手用于病案初审和人工复核前置。",
    tags: ["healthcare AI", "enterprise workflow"],
    nodeIds: ["alphacare", "care-assistant", "healthcare-ai", "enterprise-workflow"],
  },
  {
    id: "C-071",
    date: "2026-06-03",
    type: "product_service",
    title: "MediFlow 推出面向临床记录的语音模型",
    subject: "MediFlow",
    relation: "产品聚焦医生记录、摘要和医保编码前置。",
    tags: ["healthcare AI", "voice model"],
    nodeIds: ["mediflow", "clinical-voice", "healthcare-ai", "voice-model"],
  },
  {
    id: "C-073",
    date: "2026-06-04",
    type: "funding",
    title: "MediFlow 获得增长轮融资",
    subject: "MediFlow",
    relation: "资金用于扩大医院客户和合规部署团队。",
    tags: ["healthcare AI", "voice model"],
    nodeIds: ["mediflow", "northbank", "healthcare-ai", "voice-model"],
  },
  {
    id: "C-076",
    date: "2026-06-05",
    type: "case",
    title: "Harbor Retail 部署智能客服质检系统",
    subject: "Harbor Retail",
    relation: "零售客户把质检从抽样改为全量自动预筛。",
    tags: ["customer support", "enterprise workflow"],
    nodeIds: ["harbor", "support-qa", "customer-support", "enterprise-workflow"],
  },
  {
    id: "C-077",
    date: "2026-06-05",
    type: "product_service",
    title: "DeskPilot 发布客服 Agent 监控模块",
    subject: "DeskPilot",
    relation: "模块追踪回复质量、升级路径和人工接管节点。",
    tags: ["customer support", "agent infra"],
    nodeIds: ["deskpilot", "support-monitor", "customer-support", "agent-infra"],
  },
];

const nodes = [
  { id: "northstar", label: "Northstar AI", kind: "company", x: 18, y: 23 },
  { id: "mediflow", label: "MediFlow", kind: "company", x: 73, y: 22 },
  { id: "deskpilot", label: "DeskPilot", kind: "company", x: 84, y: 56 },
  { id: "northbank", label: "Northbank Capital", kind: "investor", x: 47, y: 12 },
  { id: "alphacare", label: "AlphaCare", kind: "customer", x: 27, y: 74 },
  { id: "harbor", label: "Harbor Retail", kind: "customer", x: 73, y: 82 },
  { id: "orchestrator", label: "工作流执行平台", kind: "product", x: 36, y: 42 },
  { id: "care-assistant", label: "病案审核助手", kind: "product", x: 40, y: 68 },
  { id: "clinical-voice", label: "临床语音模型", kind: "product", x: 62, y: 43 },
  { id: "support-qa", label: "客服质检系统", kind: "product", x: 61, y: 68 },
  { id: "support-monitor", label: "Agent 监控模块", kind: "product", x: 86, y: 35 },
  { id: "agent-infra", label: "agent infra", kind: "tag", x: 18, y: 50 },
  { id: "healthcare-ai", label: "healthcare AI", kind: "tag", x: 51, y: 86 },
  { id: "enterprise-workflow", label: "enterprise workflow", kind: "tag", x: 49, y: 55 },
  { id: "voice-model", label: "voice model", kind: "tag", x: 70, y: 10 },
  { id: "customer-support", label: "customer support", kind: "tag", x: 88, y: 74 },
];

const candidateRules = [
  {
    title: "企业流程 Agent 从融资走向部署",
    summary: "30 天内同时出现融资、产品发布和客户流程案例，且围绕 agent infra 与 enterprise workflow。",
    tags: ["agent infra", "enterprise workflow"],
    cardIds: ["C-061", "C-064", "C-076", "C-077"],
  },
  {
    title: "医疗 AI 从文档能力进入运营流程",
    summary: "同一窗口内出现医疗客户案例、语音模型产品和增长融资，商业变量集中在病案与临床记录流程。",
    tags: ["healthcare AI", "voice model"],
    cardIds: ["C-069", "C-071", "C-073"],
  },
  {
    title: "客服场景开始要求可监控的 Agent 执行",
    summary: "案例与产品信号同时指向质检、升级路径和人工接管，可作为客户支持场景的候选迹象。",
    tags: ["customer support", "agent infra"],
    cardIds: ["C-076", "C-077"],
  },
];

let activeType = "all";
let activeTag = "all";

const els = {
  typeFilters: document.querySelector("[data-type-filters]"),
  tagFilters: document.querySelector("[data-tag-filters]"),
  status: document.querySelector("[data-filter-status]"),
  cardCount: document.querySelector("[data-card-count]"),
  signalList: document.querySelector("[data-signal-list]"),
  timeline: document.querySelector("[data-timeline]"),
  tagCards: document.querySelector("[data-tag-cards]"),
  candidateList: document.querySelector("[data-candidate-list]"),
  lines: document.querySelector("[data-network-lines]"),
  nodes: document.querySelector("[data-network-nodes]"),
  canvas: document.querySelector("[data-network-canvas]"),
  metricCards: document.querySelector("[data-metric-cards]"),
  metricEntities: document.querySelector("[data-metric-entities]"),
  metricCandidates: document.querySelector("[data-metric-candidates]"),
};

const allTags = [...new Set(cards.flatMap((card) => card.tags))];

function getVisibleCards() {
  return cards.filter((card) => {
    const typeMatch = activeType === "all" || card.type === activeType;
    const tagMatch = activeTag === "all" || card.tags.includes(activeTag);
    return typeMatch && tagMatch;
  });
}

function makeButton(label, active, onClick, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `${className}${active ? " is-active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function renderFilters() {
  els.typeFilters.innerHTML = "";
  Object.entries(typeLabels).forEach(([type, label]) => {
    els.typeFilters.appendChild(makeButton(label, activeType === type, () => {
      activeType = type;
      render();
    }, "filter-button"));
  });

  els.tagFilters.innerHTML = "";
  els.tagFilters.appendChild(makeButton("all tags", activeTag === "all", () => {
    activeTag = "all";
    render();
  }, "tag-button"));
  allTags.forEach((tag) => {
    els.tagFilters.appendChild(makeButton(tag, activeTag === tag, () => {
      activeTag = tag;
      render();
    }, "tag-button"));
  });
}

function renderMetrics(visibleCards) {
  const visibleNodeIds = new Set(visibleCards.flatMap((card) => card.nodeIds));
  const visibleCandidates = candidateRules.filter((item) => (
    item.cardIds.some((id) => visibleCards.some((card) => card.id === id))
  ));
  els.metricCards.textContent = visibleCards.length;
  els.metricEntities.textContent = visibleNodeIds.size;
  els.metricCandidates.textContent = visibleCandidates.length;
  els.cardCount.textContent = `${visibleCards.length} cards`;
  els.status.textContent = `${typeLabels[activeType]} · ${activeTag === "all" ? "全部 tags" : activeTag}`;
}

function renderSignalList(visibleCards) {
  els.signalList.innerHTML = visibleCards.map((card) => `
    <article class="signal-card">
      <div class="signal-meta">
        <span class="type-pill" data-type="${card.type}">${typeLabels[card.type]}</span>
        <span class="date-pill">${card.date}</span>
        <span class="evidence-pill">${card.id}</span>
      </div>
      <h3>${card.title}</h3>
      <p>${card.relation}</p>
      <div class="inline-tags">${card.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
    </article>
  `).join("");
}

function renderNetwork(visibleCards) {
  const visibleNodeIds = new Set(visibleCards.flatMap((card) => card.nodeIds));
  const canvasRect = els.canvas.getBoundingClientRect();
  const width = Math.max(canvasRect.width < 760 ? 760 : canvasRect.width, 1);
  const height = Math.max(canvasRect.height, 1);

  els.lines.setAttribute("viewBox", `0 0 ${width} ${height}`);
  els.lines.style.width = `${width}px`;
  els.lines.style.height = `${height}px`;
  els.nodes.style.width = `${width}px`;
  els.nodes.style.height = `${height}px`;
  els.nodes.innerHTML = nodes.map((node) => {
    const visible = visibleNodeIds.has(node.id);
    return `
      <div class="network-node ${visible ? "is-active" : "is-muted"}"
        data-kind="${node.kind}"
        style="left:${node.x}%;top:${node.y}%">
        <strong>${node.label}</strong>
        <span>${node.kind}</span>
      </div>
    `;
  }).join("");

  const lines = [];
  visibleCards.forEach((card) => {
    const source = nodes.find((node) => node.id === card.nodeIds[0]);
    card.nodeIds.slice(1).forEach((targetId) => {
      const target = nodes.find((node) => node.id === targetId);
      if (!source || !target) return;
      lines.push(`
        <line class="network-line is-strong"
          x1="${source.x / 100 * width}" y1="${source.y / 100 * height}"
          x2="${target.x / 100 * width}" y2="${target.y / 100 * height}" />
      `);
    });
  });
  els.lines.innerHTML = lines.join("");
}

function renderTimeline(visibleCards) {
  const groups = visibleCards.reduce((acc, card) => {
    acc[card.date] = acc[card.date] || [];
    acc[card.date].push(card);
    return acc;
  }, {});

  els.timeline.innerHTML = Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => `
      <div class="timeline-row">
        <div class="timeline-date">${date}</div>
        <div class="timeline-items">
          ${items.map((item) => `
            <div class="timeline-item">
              <strong>${item.title}</strong>
              <span>${typeLabels[item.type]} · ${item.tags.join(" / ")}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
}

function renderTagCards(visibleCards) {
  const rows = allTags.map((tag) => {
    const related = visibleCards.filter((card) => card.tags.includes(tag));
    const counts = {
      product_service: related.filter((card) => card.type === "product_service").length,
      funding: related.filter((card) => card.type === "funding").length,
      case: related.filter((card) => card.type === "case").length,
    };
    const latest = related.map((card) => card.date).sort().pop() || "-";
    return { tag, related, counts, latest };
  }).filter((row) => row.related.length > 0);

  els.tagCards.innerHTML = rows.map((row) => `
    <article class="tag-card">
      <div class="tag-card-top">
        <strong>${row.tag}</strong>
        <em>${row.related.length} cards · ${row.latest}</em>
      </div>
      <div class="type-bars" aria-label="类型构成">
        <span style="opacity:${row.counts.product_service ? 1 : .18}"></span>
        <span style="opacity:${row.counts.funding ? 1 : .18}"></span>
        <span style="opacity:${row.counts.case ? 1 : .18}"></span>
      </div>
    </article>
  `).join("");
}

function renderCandidates(visibleCards) {
  const visibleIds = new Set(visibleCards.map((card) => card.id));
  els.candidateList.innerHTML = candidateRules.map((candidate) => {
    const evidenceCount = candidate.cardIds.filter((id) => visibleIds.has(id)).length;
    const quiet = evidenceCount === 0;
    return `
      <article class="candidate-card ${quiet ? "is-quiet" : ""}">
        <div class="candidate-meta">
          <span class="evidence-pill">${evidenceCount}/${candidate.cardIds.length} evidence</span>
          <span class="date-pill">${candidate.tags.join(" / ")}</span>
        </div>
        <h3>${candidate.title}</h3>
        <p>${candidate.summary}</p>
      </article>
    `;
  }).join("");
}

function render() {
  const visibleCards = getVisibleCards();
  renderFilters();
  renderMetrics(visibleCards);
  renderSignalList(visibleCards);
  renderNetwork(visibleCards);
  renderTimeline(visibleCards);
  renderTagCards(visibleCards);
  renderCandidates(visibleCards);
}

window.addEventListener("resize", () => renderNetwork(getVisibleCards()));
render();
