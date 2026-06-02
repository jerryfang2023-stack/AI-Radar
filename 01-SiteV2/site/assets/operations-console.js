(function () {
  const root = document.querySelector("[data-ops-console]");
  if (!root) return;

  const content = window.WaveSightContent || {};
  const pipeline = window.WaveSightPipelineDashboard || {};
  const latest = pipeline.latest || {};
  const totals = pipeline.totals || {};
  const state = {
    panel: location.hash ? location.hash.slice(1) : "overview",
    topicSource: "raw_pool_pitch",
    topicOpenId: "",
    factorySource: "raw_pool_pitch",
    factoryTopicId: "",
    output: "podcast",
    railCollapsed: localStorage.getItem("wavesight-rail-collapsed") === "1",
  };

  const $ = (selector, node = document) => node.querySelector(selector);
  const $$ = (selector, node = document) => Array.from(node.querySelectorAll(selector));
  const text = (value) => value == null ? "" : String(value);
  const html = (value) => text(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
  const list = (value) => Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value) : value ? [value] : [];
  const pct = (value) => Number.isFinite(Number(value)) ? `${Math.round(Number(value))}%` : "-";

  function setPanel(id) {
    state.panel = id || "overview";
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
    frame.style.height = `${Math.max(760, measured + 24)}px`;
  }

  function row(label, value, percent) {
    const width = Math.max(3, Math.min(100, Number(percent) || 0));
    return `<div class="row"><span>${html(label)}</span><span class="bar"><i style="width:${width}%"></i></span><b>${html(value)}</b></div>`;
  }

  function metric(label, value, note, extra = "") {
    return `<article class="card metric ${extra}"><span class="label">${html(label)}</span><strong>${html(value)}</strong><em>${html(note)}</em></article>`;
  }

  function scoreGrade(score) {
    if (score >= 92) return "S";
    if (score >= 86) return "A";
    if (score >= 78) return "B";
    return "C";
  }

  function normalizeSignal(signal, index) {
    const title = signal.frontend?.displayTitle || signal.editorialTitle || signal.title || "未命名信号";
    const sourceHost = (() => {
      try { return signal.sourceUrl ? new URL(signal.sourceUrl).host.replace(/^www\./, "") : ""; } catch { return ""; }
    })();
    return {
      raw: signal,
      baseId: signal.id || `signal-${index}`,
      title,
      type: signal.signalType || "signal",
      audience: signal.audience || "企业老板 / 业务负责人",
      core: signal.judgment || signal.frontend?.whyWatch || signal.brief || "",
      relevance: signal.businessMeaning || signal.frontend?.businessMeaning || signal.brief || "",
      evidence: signal.frontend?.evidenceNote || signal.counter || signal.sourceTitle || sourceHost || "",
      source: sourceHost || signal.sourceTitle || "content asset",
      url: signal.sourceUrl || "",
      date: signal.date || content.meta?.date || "",
      score: 88 + Math.max(0, 5 - index),
    };
  }

  const baseSignals = Array.isArray(content.signals) ? content.signals.map(normalizeSignal) : [];
  if (content.daily?.title) {
    baseSignals.unshift({
      raw: content.daily,
      baseId: "daily-observation",
      title: content.daily.title,
      type: "daily",
      audience: "企业老板",
      core: content.daily.judgment || content.daily.dek || content.daily.summary || "",
      relevance: content.daily.homeSummary || content.daily.summary || "",
      evidence: content.daily.dek || "",
      source: "今日观察",
      url: content.daily.link || "",
      date: content.meta?.date || "",
      score: 94,
    });
  }
  if (content.trendReport?.title) {
    baseSignals.push({
      raw: content.trendReport,
      baseId: "trend-report",
      title: content.trendReport.title,
      type: "trend",
      audience: "行业操盘手",
      core: content.trendReport.oneLine || content.trendReport.summary || "",
      relevance: content.trendReport.stage || content.trendReport.summary || "",
      evidence: list(content.trendReport.evidenceGaps).join("；"),
      source: "趋势追踪",
      url: content.trendReport.link || "",
      date: content.trendReport.updated || "",
      score: Number(content.trendReport.score) || 90,
    });
  }
  if (content.brief?.title) {
    baseSignals.push({
      raw: content.brief,
      baseId: "brief",
      title: content.brief.title,
      type: "brief",
      audience: "资源型合伙人",
      core: content.brief.subhead || content.brief.summary || "",
      relevance: content.brief.summary || "",
      evidence: list(content.brief.evidence).join("；"),
      source: "商业内参",
      url: content.brief.link || "",
      date: content.brief.period || "",
      score: 89,
    });
  }

  if (!baseSignals.length) {
    baseSignals.push(
      {
        raw: {},
        baseId: "nvidia-cosmos-3",
        title: "英伟达把 AI 从聊天框推向工厂和道路",
        type: "daily",
        audience: "企业老板",
        core: "NVIDIA 推出 Cosmos 3，把“物理 AI”从屏幕交互推向机器人、自动驾驶车辆和智能空间。",
        relevance: "企业评估 AI 投入时，判断重点会从聊天助手转向真实流程、设备运行和责任边界。",
        evidence: "NVIDIA Cosmos 3 发布；Axios 披露训练使用 20 万亿个多模态 token。",
        source: "NVIDIA / Axios",
        url: "",
        date: "2026-06-01",
        score: 94,
      },
      {
        raw: {},
        baseId: "taiwan-ai-infra",
        title: "台湾产业巨头借助 NVIDIA 加速世界 AI 基础设施建设",
        type: "signal",
        audience: "行业操盘手",
        core: "AI 基础设施不只由芯片公司推动，服务器、代工、散热、组装和渠道企业正在一起重排供应链位置。",
        relevance: "这类题目适合判断 AI 预算向硬件、机房、能源和集成服务扩散的速度。",
        evidence: "NVIDIA 生态发布与台湾供应链企业合作信息。",
        source: "NVIDIA / 产业链公开信息",
        url: "",
        date: "2026-06-01",
        score: 92,
      },
      {
        raw: {},
        baseId: "minimax-m3",
        title: "MiniMax 发布 M3，国产模型继续争夺开发者场景",
        type: "product-service",
        audience: "产品负责人",
        core: "国产模型竞争正在从参数和榜单，转向开发者是否愿意把模型嵌进产品和业务流程。",
        relevance: "可观察企业在客服、内容、代码和智能体入口上的模型替换成本。",
        evidence: "MiniMax M3 发布信息与开发者侧产品更新。",
        source: "MiniMax / 开发者社区",
        url: "",
        date: "2026-06-01",
        score: 90,
      },
      {
        raw: {},
        baseId: "cosmos-physical-ai",
        title: "使用 NVIDIA Cosmos 3 开发物理 AI 推理、世界与行动模型",
        type: "builders",
        audience: "开发者与技术管理者",
        core: "物理 AI 的关键不再是生成文本，而是理解环境、预测动作和服务真实设备。",
        relevance: "这会影响机器人、自动驾驶、工业视觉和仿真工具链的采购判断。",
        evidence: "NVIDIA Cosmos 3 技术资料与开发者说明。",
        source: "NVIDIA Docs",
        url: "",
        date: "2026-06-01",
        score: 89,
      },
      {
        raw: {},
        baseId: "rtx-spark",
        title: "英伟达发布 RTX Spark，称其为史上最高效的 PC 芯片",
        type: "product-service",
        audience: "企业老板 / 硬件渠道",
        core: "本地 AI 计算能力继续下沉到个人设备，可能改变企业采购云端推理与端侧部署的比例。",
        relevance: "适合判断哪些 AI 工作负载会从云端回到本地设备或边缘场景。",
        evidence: "NVIDIA RTX Spark 发布信息。",
        source: "NVIDIA",
        url: "",
        date: "2026-06-01",
        score: 88,
      }
    );
  }

  const topicSources = [
    { id: "raw_pool_pitch", title: "Raw-Pool-Pitch", desc: "每日 Raw / Pool / Card 产物" },
    { id: "industry_chain", title: "产业链分析", desc: "产业节点与资产结构" },
    { id: "builders", title: "Builders 文章", desc: "开发者与产品实践" },
    { id: "viral_rewrite", title: "爆款改编", desc: "AI 热点内容与传播结构" },
  ];

  function strictAngles(topic) {
    const subject = topic.title.replace(/[｜|].*$/, "").slice(0, 28);
    const actor = subject.split(/[，,：:]/u)[0] || subject;
    const businessLine = topic.relevance || topic.core || "企业预算、流程责任和组织分工正在被重新划分。";
    const evidenceLine = topic.evidence || "需要用官方发布、客户案例或真实采用数据把判断钉住。";
    if (topic.sourceId === "industry_chain") {
      return [
        { title: `从 ${actor} 看 AI 预算正流向哪一段产业链`, note: `切口：先写事件，再判断钱会落在算力、工具、集成、渠道还是客户现场。可用事实：${evidenceLine}` },
        { title: `${actor} 会先影响谁的采购单`, note: `切口：把读者带到一个具体买方岗位，比如 CIO、工厂负责人、客服负责人或销售运营负责人，写他们为什么要重新比较供应商。` },
        { title: `这不是技术升级，而是责任边界重画`, note: `切口：写清楚系统出错时谁负责、谁复核、谁买单。商业落点：${businessLine}` },
      ];
    }
    if (topic.sourceId === "builders") {
      return [
        { title: `${actor} 背后的开发者真实需求`, note: "切口：不写工具测评，写开发者为什么愿意换流程、接插件、改团队协作方式，尤其看它是否减少等待、返工或上下文切换。" },
        { title: `从演示走向日常工作，差的是哪一步`, note: "切口：拆一个真实任务链：需求进入、代码生成、测试、审阅、上线。只抓其中最容易卡住的一步写。" },
        { title: `企业读者该看哪些采用信号`, note: "切口：看文档更新频率、GitHub issue、客户引用、招聘岗位、生态插件，而不是看发布口号和点赞数。" },
      ];
    }
    if (topic.sourceId === "viral_rewrite") {
      return [
        { title: `${actor} 为什么会刺中企业焦虑`, note: "切口：找一个明确情绪钩子，比如岗位替代、预算失控、客户流失、安全责任或老板看不懂投入产出。" },
        { title: `把热闹改写成一个商业冲突`, note: "切口：标题必须回答“谁的利益被改变”。例如供应商拿走预算、员工失去入口、平台获得控制权。" },
        { title: `爆款改编前必须补哪条事实`, note: `切口：先补一条可验证来源，再写观点。当前可用证据边界：${evidenceLine}` },
      ];
    }
    return [
      { title: `${actor} 改变的是哪一类企业决策`, note: `切口：从老板是否加预算、换供应商、调岗位或重做流程写起。不要写“AI 更强了”，要写哪张经营账变了。` },
      { title: `这件事为什么不是普通新闻`, note: `切口：找一个可验证动作，比如官方发布、客户采用、融资金额、采购入口或产品上线。当前证据：${evidenceLine}` },
      { title: `可以写成哪种文章标题`, note: `切口示例：《${actor} 把 AI 带进真实流程，企业该看的是成本还是责任》《${actor} 背后，AI 采购正在从工具账变成流程账》。` },
    ];
  }

  function buildTopics() {
    return topicSources.flatMap((source, sourceIndex) => baseSignals.slice(0, 5).map((base, index) => {
      const score = Math.max(72, Math.min(99, base.score - sourceIndex * 3 - index));
      const topic = {
        ...base,
        id: `${source.id}-${base.baseId}`,
        sourceId: source.id,
        sourceName: source.title,
        sourceDesc: source.desc,
        score,
        grade: scoreGrade(score),
        priority: score >= 90 ? "S级选题" : score >= 84 ? "优先观察" : "候选",
      };
      topic.angles = strictAngles(topic);
      return topic;
    }));
  }

  const topics = buildTopics();

  function visibleTopics() {
    const query = text($("[data-topic-search]")?.value).trim().toLowerCase();
    const type = $("[data-topic-type]")?.value || "all";
    const sort = $("[data-topic-sort]")?.value || "score";
    let items = topics.filter((topic) => topic.sourceId === state.topicSource);
    if (type !== "all") items = items.filter((topic) => topic.type === type);
    if (query) items = items.filter((topic) => `${topic.title} ${topic.core} ${topic.relevance} ${topic.evidence}`.toLowerCase().includes(query));
    return items.sort((a, b) => sort === "source" ? a.title.localeCompare(b.title, "zh-CN") : b.score - a.score);
  }

  function renderOverview() {
    const cards = $("[data-overview-status]");
    if (cards) {
      cards.innerHTML = [
        metric("运行摘要", `${latest.raw || 0} / ${latest.pool || 0} / ${latest.cards || 0}`, `最新生产日 ${latest.label || latest.date || "-"}`, "hero-card"),
        metric("选题池", topics.length, "4 类来源 · 每类 5 条"),
        metric("发布准备", "待推进", "内容工厂 → 发布队列"),
      ].join("");
    }
    const opinion = latest.cards ? Math.round((latest.assets?.opinion || 0) / latest.cards * 100) : 0;
    const official = latest.raw ? Math.round((latest.sourceTypes?.official || 0) / latest.raw * 100) : 0;
    const discovery = latest.pool ? Math.round((latest.evidenceLevels?.discovery_only || 0) / latest.pool * 100) : 0;
    const actions = $("[data-overview-actions]");
    if (actions) {
      actions.innerHTML = `<span class="label">Next Actions</span><h3>今日处理顺序</h3><div class="action-list">
        <button type="button" data-tab="dashboard">看生产质量 <span>风险 / 来源 / 资产</span></button>
        <button type="button" data-tab="topics">定今日选题 <span>${topics.length} 条候选</span></button>
        <button type="button" data-tab="factory">进入内容工厂 <span>播客 / 文章 / PPT</span></button>
      </div>`;
    }
    const risks = $("[data-overview-risks]");
    if (risks) {
      risks.innerHTML = [
        { level: "WARN", value: `${opinion}%`, title: "观点信号偏重", body: "事实型信号卡不足时，前台判断会更依赖观点材料。", action: "补官方发布、客户案例、产品更新类证据。" },
        { level: "WARN", value: `${discovery}%`, title: "证据链偏浅", body: "发现型证据占比偏高，进入发布前需要二次核验。", action: "优先补原始产品页、开发者文档和客户案例。" },
        { level: "INFO", value: `${official}%`, title: "高可信来源占比", body: "官方源不足会影响商业信号的确定性。", action: "增加 IR、Blog、Docs、SEC 与 Marketplace 抓取。" },
      ].map((risk) => `<article class="card risk-card risk-${risk.level.toLowerCase()}"><div class="risk-top"><span class="badge">${risk.level}</span><span class="label">PRIMARY</span></div><div class="risk-value">${risk.value}</div><b>${risk.title}</b><p>${risk.body}</p><div class="suggestion"><b>建议动作：</b>${risk.action}</div></article>`).join("");
    }
    const funnel = $("[data-overview-funnel]");
    if (funnel) {
      const max = Math.max(latest.raw || 1, latest.pool || 1, latest.cards || 1);
      funnel.innerHTML = [
        row("Raw", latest.raw || 0, (latest.raw || 0) / max * 100),
        row("Pool", latest.pool || 0, (latest.pool || 0) / max * 100),
        row("Cards", latest.cards || 0, (latest.cards || 0) / max * 100),
      ].join("");
    }
    const queue = $("[data-work-queue]");
    if (queue) {
      queue.innerHTML = [
        row("Draft Assets", latest.assetStatus?.opinion?.draft || 0, 72),
        row("Candidate Assets", latest.assetLevels?.opinion?.candidate || 0, 68),
        row("Copy Gate Pending", latest.assetCopyGates?.opinion?.skipped_intake_pending_rating || 0, 26),
        row("Unknown Level", latest.assetLevels?.opinion?.unknown || 0, 8),
      ].join("");
    }
    const routing = $("[data-overview-routing]");
    if (routing) {
      routing.innerHTML = [
        row("运营仪表盘", official < 25 ? "补来源" : "巡检", Math.max(22, official)),
        row("选题中心", `${topics.length} 候选`, Math.min(100, topics.length * 3)),
        row("内容工厂", "待生产", 42),
        row("发布队列", "待确认", 34),
      ].join("");
    }
  }

  function renderDashboard() {
    const timeline = $("[data-daily-timeline]");
    if (timeline) {
      const days = Array.isArray(pipeline.days) ? pipeline.days.slice(0, 4) : [];
      timeline.innerHTML = days.map((day, index) => {
        const assets = day.assets || {};
        const assetRows = Object.entries(assets).slice(0, 4).map(([key, value]) => row(key, value, Math.min(100, Number(value) * 4))).join("");
        return `<article class="card day-card ${index === 0 ? "is-latest" : ""}"><div class="day-date"><span>${html(day.label || day.date)}</span><b>${index === 0 ? "最新生产日" : "资产链运行"}</b></div><div class="day-numbers"><span>RAW<b>${html(day.raw || 0)}</b></span><span>POOL<b>${html(day.pool || 0)}</b></span><span>CARDS<b>${html(day.cards || 0)}</b></span></div><div class="rows">${assetRows}</div></article>`;
      }).join("");
    }
    const sourceQuality = $("[data-source-quality]");
    if (sourceQuality) {
      const rows = Array.isArray(pipeline.engineQuality?.rows) ? pipeline.engineQuality.rows : [];
      sourceQuality.innerHTML = rows.map((item) => {
        const score = Math.round(((item.conversionRate || 0) * .36) + ((item.officialRate || 0) * .24) + ((100 - (item.duplicateRate || 0)) * .22) + ((item.freshnessRate ?? 50) * .18));
        return `<div class="source-row"><div class="source-name"><strong>${html(item.label || item.id)}</strong><em>${item.total || 0} samples</em></div><div class="mini-kpi"><span>样本量</span><b>${html(item.total || 0)}</b></div><div class="mini-kpi"><span>新鲜度</span><b>${html(pct(item.freshnessRate))}</b></div><div class="mini-kpi"><span>重复率</span><b>${html(pct(item.duplicateRate))}</b></div><div class="mini-kpi"><span>官方源</span><b>${html(pct(item.officialRate))}</b></div><div class="mini-kpi"><span>转卡率</span><b>${html(pct(item.conversionRate))}</b></div><div class="score-pill">${score}</div></div>`;
      }).join("");
    }
    const matrix = $("[data-asset-matrix]");
    if (matrix) {
      const assets = totals.assets || latest.assets || {};
      const important = ["opinion", "case", "funding", "product-service"];
      const cards = important.map((key, index) => `<article class="card asset-card ${index === 0 ? "asset-main" : ""}"><span class="label">${html(key)}</span><strong>${html(assets[key] || 0)}</strong><p>${index === 0 ? "观点资产占比需要持续压低，用事实型资产托住判断。" : "重点资产类型，进入前台前需确认证据边界。"}</p></article>`).join("");
      const rest = Object.entries(assets).filter(([key]) => !important.includes(key)).map(([key, value]) => `<span>${html(key)} ${html(value)}</span>`).join("");
      matrix.innerHTML = `${cards}<article class="card span-4"><span class="label">Other Assets</span><div class="tag-cloud" style="margin-top:12px">${rest || "<span>暂无其他类型</span>"}</div></article>`;
    }
  }

  function renderTopicControls() {
    const tabs = $("[data-topic-tabs]");
    if (tabs) {
      tabs.innerHTML = topicSources.map((source) => `<button type="button" data-topic-source-tab="${source.id}" aria-current="${String(source.id === state.topicSource)}">${html(source.title)}<span>${html(source.desc)} · ${topics.filter((topic) => topic.sourceId === source.id).length}</span></button>`).join("");
    }
    const typeSelect = $("[data-topic-type]");
    if (typeSelect && !typeSelect.dataset.ready) {
      const types = [...new Set(topics.map((topic) => topic.type).filter(Boolean))];
      typeSelect.innerHTML = `<option value="all">全部类型</option>${types.map((type) => `<option value="${html(type)}">${html(type)}</option>`).join("")}`;
      typeSelect.dataset.ready = "1";
    }
  }

  function renderTopics() {
    renderTopicControls();
    const listEl = $("[data-topic-list]");
    if (!listEl) return;
    const items = visibleTopics();
    listEl.innerHTML = items.length ? items.map((topic) => {
      const open = topic.id === state.topicOpenId;
      return `<article class="topic-item ${open ? "is-open" : ""}">
        <div class="topic-summary">
          <span class="grade">${html(topic.grade)}<small>${html(topic.score)}</small></span>
          <button type="button" class="topic-title-toggle" data-topic-id="${html(topic.id)}" aria-expanded="${String(open)}"><strong>${html(topic.title)}</strong><span>${html(topic.core || topic.relevance)}</span></button>
          <span class="topic-meta"><span>${html(topic.sourceName)}</span><span>${html(topic.priority)}</span><span>${html(topic.type)}</span></span>
        </div>
        <div class="topic-detail">
          <div class="score-box"><span class="label">Score Table</span><div class="rows" style="margin-top:12px">${row("新鲜度", 19, 95)}${row("商业价值", 20, 100)}${row("判断新意", 18, 90)}${row("证据强度", 17, 85)}${row("观澜适配", 19, 95)}</div></div>
          <div><span class="label">可写角度</span><div class="angle-list" style="margin-top:12px">${topic.angles.map((angle) => `<article class="angle"><h3>${html(angle.title)}</h3><p>${html(angle.note)}</p></article>`).join("")}</div></div>
        </div>
      </article>`;
    }).join("") : `<article class="card"><p>没有匹配选题。</p></article>`;
  }

  function factoryTopic() {
    const items = factoryTopics();
    return items.find((topic) => topic.id === state.factoryTopicId) || items[0] || topics[0];
  }

  function factoryTopics() {
    return topics.filter((topic) => topic.sourceId === state.factorySource);
  }

  function renderFactory() {
    const tabs = $("[data-factory-source-tabs]");
    if (tabs) {
      tabs.innerHTML = topicSources.map((source) => `<button type="button" data-factory-source-tab="${source.id}" aria-current="${String(source.id === state.factorySource)}"><strong>${html(source.title)}</strong><span>${topics.filter((topic) => topic.sourceId === source.id).length}</span></button>`).join("");
    }
    const items = factoryTopics();
    const listEl = $("[data-factory-topic-list]");
    if (listEl) {
      if (!items.some((topic) => topic.id === state.factoryTopicId)) state.factoryTopicId = items[0]?.id || "";
      listEl.innerHTML = items.map((topic) => `<button type="button" class="factory-topic" data-factory-topic-id="${html(topic.id)}" aria-current="${String(topic.id === state.factoryTopicId)}"><strong>${html(topic.title)}</strong><p>${html(topic.sourceName)} · ${html(topic.score)}分</p></button>`).join("");
    }
    $$("[data-output]").forEach((button) => button.setAttribute("aria-current", String(button.dataset.output === state.output)));
    const selected = factoryTopic();
    const selectedEl = $("[data-selected-topic]");
    if (selectedEl && selected) {
      selectedEl.innerHTML = `<span class="label">Selected Topic</span><h3>${html(selected.title)}</h3><p>${html(selected.core || selected.relevance)}</p><div class="muted-list">${selected.angles.slice(0, 2).map((angle) => `<span>${html(angle.title)}</span>`).join("")}</div>`;
    }
  }

  function renderPublishing() {
    const container = $("[data-publish-cards]");
    if (!container) return;
    const platforms = [
      { name: "微信公众号", status: "待授权", note: "文章与长图文入口，发布前确认标题、封面和摘要。" },
      { name: "小红书", status: "待选择账号", note: "适合观点卡、短图文和选题拆条。" },
      { name: "Bilibili / 抖音", status: "待上传", note: "适合播客切片、口播视频和 PPT 视频。" },
      { name: "发布结果", status: "未返回", note: "生成任务完成后，在这里核对平台回执和失败原因。" },
    ];
    container.innerHTML = [
      `<article class="card publish-card feature"><span class="label">Publication Control</span><h2>发布总控</h2><strong>0 / 4</strong><p>内容工厂生成后，先确认平台、账号、素材和状态，再进入正式发布。</p><div class="publish-steps"><span>待选平台<b>3</b></span><span>待授权账号<b>2</b></span><span>待查看结果<b>0</b></span></div></article>`,
      ...platforms.map((item) => `<article class="card publish-card"><span class="label">Publish</span><h2>${html(item.name)}</h2><strong>${html(item.status)}</strong><p>${html(item.note)}</p><div class="actions"><button type="button">选择平台</button><button type="button">账号授权</button><button class="primary" type="button">查看结果</button></div></article>`),
    ].join("");
  }

  function renderSettings() {
    const dataStatus = $("[data-data-status]");
    if (dataStatus) {
      dataStatus.classList.add("data-status-list");
      dataStatus.innerHTML = [
        ["site-content", content.meta?.generatedAt || "-"],
        ["pipeline", pipeline.meta?.generatedAt || "-"],
        ["topic candidates", topics.length],
      ].map(([label, value]) => `<div class="data-status-item"><span>${html(label)}</span><b>${html(value)}</b></div>`).join("");
    }
  }

  function setStatus(selector, stateName, title, note) {
    const status = $(selector);
    if (!status) return;
    status.dataset.state = stateName;
    status.innerHTML = `<strong>${html(title)}</strong><p>${html(note || "")}</p>`;
  }

  async function checkAuth(selector) {
    setStatus(selector, "running", "正在检查授权", "后台正在确认 NotebookLM token 是否可用。");
    const response = await fetch("/api/notebooklm/auth", { method: "POST" });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.stderr || data.error || "授权检查失败");
    setStatus(selector, "done", "授权可用", "NotebookLM token 可用，可以直接生成。");
  }

  async function startGeneration() {
    const topic = factoryTopic();
    if (!topic) return;
    setStatus("[data-status]", "running", "正在启动生成", "后台将创建 NotebookLM 笔记、写入材料并启动生成。");
    const response = await fetch("/api/notebooklm/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ output: state.output, topic }),
    });
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "生成任务启动失败");
    $("[data-log]").textContent = `job: ${data.job.id}\nstage: ${data.job.stage}`;
    pollJob(data.job.id);
  }

  async function pollJob(id) {
    const response = await fetch(`/api/notebooklm/jobs/${id}`);
    const data = await response.json();
    if (!response.ok || !data.ok) throw new Error(data.error || "任务状态读取失败");
    const job = data.job;
    $("[data-log]").textContent = JSON.stringify({ id: job.id, status: job.status, stage: job.stage, artifactId: job.artifactId, error: job.error }, null, 2);
    if (job.status === "done") {
      setStatus("[data-status]", "done", "生成完成", job.artifactId ? `NotebookLM 已生成内容资产：${job.artifactId}` : "NotebookLM 已完成生成。");
      return;
    }
    if (job.status === "error") throw new Error(job.error || "生成失败");
    setStatus("[data-status]", "running", job.stage || "生成中", "任务仍在后台执行。");
    setTimeout(() => pollJob(id).catch((error) => setStatus("[data-status]", "error", "生成失败", error.message)), 5000);
  }

  function renderAll() {
    renderOverview();
    renderDashboard();
    renderTopics();
    renderFactory();
    renderPublishing();
    renderSettings();
    setRailCollapsed(state.railCollapsed);
    setPanel(state.panel);
    resizeSkillFrame();
  }

  root.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (tab) setPanel(tab.dataset.tab);
    const source = event.target.closest("[data-topic-source-tab]");
    if (source) {
      state.topicSource = source.dataset.topicSourceTab;
      state.topicOpenId = "";
      renderTopics();
    }
    const topicButton = event.target.closest("[data-topic-id]");
    if (topicButton) {
      state.topicOpenId = state.topicOpenId === topicButton.dataset.topicId ? "" : topicButton.dataset.topicId;
      renderTopics();
    }
    const railToggle = event.target.closest("[data-rail-toggle]");
    if (railToggle) setRailCollapsed(!state.railCollapsed);
    const factorySource = event.target.closest("[data-factory-source-tab]");
    if (factorySource) {
      state.factorySource = factorySource.dataset.factorySourceTab;
      state.factoryTopicId = "";
      renderFactory();
    }
    const factoryButton = event.target.closest("[data-factory-topic-id]");
    if (factoryButton) {
      state.factoryTopicId = factoryButton.dataset.factoryTopicId;
      renderFactory();
    }
    const output = event.target.closest("[data-output]");
    if (output) {
      state.output = output.dataset.output;
      renderFactory();
    }
  });

  $("[data-topic-search]")?.addEventListener("input", () => { state.topicOpenId = ""; renderTopics(); });
  $("[data-topic-type]")?.addEventListener("change", () => { state.topicOpenId = ""; renderTopics(); });
  $("[data-topic-sort]")?.addEventListener("change", renderTopics);
  $("[data-auth]")?.addEventListener("click", () => checkAuth("[data-status]").catch((error) => setStatus("[data-status]", "error", "授权不可用", error.message)));
  $("[data-auth-settings]")?.addEventListener("click", () => checkAuth("[data-settings-status]").catch((error) => setStatus("[data-settings-status]", "error", "授权不可用", error.message)));
  $("[data-generate]")?.addEventListener("click", () => startGeneration().catch((error) => setStatus("[data-status]", "error", "生成失败", error.message)));
  $(".skill-frame")?.addEventListener("load", () => resizeSkillFrame());
  window.addEventListener("message", (event) => {
    if (event.data?.type === "wavesight-skill-store-height") resizeSkillFrame(event.data.height);
  });

  renderAll();
})();
