(function () {
  const state = {
    payload: null,
    activeCategory: "all",
    displayMode: "cards",
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
    relationshipZoom: 0.85,
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

  function cardDisplayTitle(card = {}) {
    return card.displayTitle
      || card.sourceTitle
      || card.originalTitle
      || card.title
      || "Untitled signal";
  }

  function cardTitleAliases(card = {}) {
    return [
      cardDisplayTitle(card),
      card.title,
      card.generatedTitle,
      card.sourceTitle,
      card.originalTitle,
    ].filter(Boolean);
  }

  function daysBetween(activeDate, date) {
    const active = Date.parse(`${activeDate}T00:00:00Z`);
    const current = Date.parse(`${date}T00:00:00Z`);
    if (!Number.isFinite(active) || !Number.isFinite(current)) return 9999;
    return Math.round((active - current) / 86400000);
  }

  function frontstageCards() {
    const cards = state.payload?.frontstageCards || state.payload?.cards || [];
    return [...cards].sort((a, b) => {
      const dateDiff = String(b.date || "").localeCompare(String(a.date || ""));
      if (dateDiff) return dateDiff;
      return (Number(b.frontstageRankScore) || 0) - (Number(a.frontstageRankScore) || 0) || String(a.id || "").localeCompare(String(b.id || ""));
    });
  }

  function displayCards() {
    return frontstageCards();
  }

  function displayModeLabel() {
    const date = selectedDate();
    const items = frontstageCards().filter((card) => card.date === date);
    return `今日 Card ${items.length}`;
  }

  function availableDates() {
    return [...new Set(displayCards().map((card) => card.date).filter(Boolean))]
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
    return displayCards().filter((card) => card.date === date);
  }

  function countByDateAndCategory(date, category) {
    return displayCards().filter((card) => card.date === date && card.category === category).length;
  }

  function countLast7ByCategory(date, category) {
    return countWindowByCategory(date, category, 0, 6);
  }

  function countWindowByCategory(date, category, startDay, endDay) {
    return displayCards().filter((card) => {
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

  function normalizedComparableText(value = "") {
    return String(value || "")
      .toLowerCase()
      .replace(/^这条(?:融资|产品)?信号(?:可用于判断|提供了)/u, "")
      .replace(/^(新闻事实|原文要点|价值描述|可见原文片段)[:：]/u, "")
      .replace(/[，。；：、“”‘’（）()《》【】[\]\s,.!?;:'"`$€£|/_-]+/gu, "")
      .trim();
  }

  function textUnits(value = "") {
    const normalized = normalizedComparableText(value);
    if (!normalized) return [];
    const chars = Array.from(normalized);
    if (chars.length <= 2) return [normalized];
    const units = [];
    for (let index = 0; index < chars.length - 1; index += 1) {
      units.push(`${chars[index]}${chars[index + 1]}`);
    }
    return units;
  }

  function textSimilarity(left = "", right = "") {
    const a = normalizedComparableText(left);
    const b = normalizedComparableText(right);
    if (!a || !b) return 0;
    const shorter = a.length <= b.length ? a : b;
    const longer = a.length > b.length ? a : b;
    if (shorter.length >= 24 && longer.includes(shorter)) return 1;
    const aUnits = new Set(textUnits(a));
    const bUnits = new Set(textUnits(b));
    if (!aUnits.size || !bUnits.size) return 0;
    let intersection = 0;
    for (const unit of aUnits) {
      if (bUnits.has(unit)) intersection += 1;
    }
    return intersection / Math.min(aUnits.size, bUnits.size);
  }

  function textRepeatsAny(value = "", existing = [], threshold = 0.78) {
    return existing.some((item) => textSimilarity(value, item) >= threshold);
  }

  function uniqueDetailLines(lines = [], existing = [], limit = 8) {
    const accepted = [];
    for (const line of lines.map(cleanJudgmentText).filter(Boolean)) {
      if (!hasCjk(line) || isWeakFact(line)) continue;
      if (textRepeatsAny(line, existing.concat(accepted))) continue;
      accepted.push(line);
      if (accepted.length >= limit) break;
    }
    return accepted;
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
      || /原文关键数字包括/u.test(text)
      || /^关键数字：/u.test(text)
      || /把 AI 用进/u.test(text)
      || /值得看/u.test(text)
      || /客户是否买单/u.test(text)
      || /相关变化涉及/u.test(text)
      || /可观察信息包括/u.test(text)
      || /流程结果、交付速度/u.test(text)
      || /^原始来源标题(?:显示)?[：:]/u.test(text)
      || /^Bcg\b/u.test(text);
  }

  function titleFact(card) {
    const source = card.sourceName || card.subject || "公开来源";
    const original = card.originalTitle ? `，原始标题为「${card.originalTitle}」` : "";
    return `${source} 在 ${fmtDate(card.date)} 形成一条公开材料：${cardDisplayTitle(card)}${original}。`;
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

  function valueText(card, fact = "") {
    const text = cleanJudgmentText(card.frontstageValueDescription || card.summary || "");
    if (!text || isWeakFact(text)) return "";
    if (fact && textRepeatsAny(text, [fact])) return "";
    return compactText(text, 220);
  }

  function visibleFragmentText(card, existing = []) {
    const text = cleanJudgmentText(card.visibleFragment || "");
    if (!text || isWeakFact(text)) return "";
    if (textRepeatsAny(text, existing.filter(Boolean), 0.72)) return "";
    return compactText(text, 420);
  }

  function findDetailCard(id = "") {
    return [
      ...(state.payload.cards || []),
      ...(state.payload.enterpriseAiFdePool || []),
      ...(state.payload.enterpriseAiLensCandidates || []),
      ...(state.payload.aiHardwareSignals || []),
    ].find((item) => item.id === id || item.linkedCardId === id);
  }

  function findEnterpriseAiItem(id = "") {
    return enterpriseAiTransformationItems()
      .find((item) => item.id === id || item.cardId === id || item.linkedCardId === id);
  }

  function aiHardwareItems() {
    const date = selectedDate();
    const items = Array.isArray(state.payload?.aiHardwareSignals)
      ? state.payload.aiHardwareSignals
      : [];
    return items
      .filter((item) => item.date === date)
      .sort((a, b) => (Number(b.frontstageRankScore) || 0) - (Number(a.frontstageRankScore) || 0) || String(a.id || "").localeCompare(String(b.id || "")));
  }

  function findAiHardwareItem(id = "") {
    return aiHardwareItems().find((item) => item.id === id || item.linkedCardId === id);
  }

  function sourceText(card) {
    return [card.sourceName, card.publishedAt ? fmtDate(String(card.publishedAt).slice(0, 10)) : ""]
      .filter(Boolean)
      .join(" · ");
  }

  function enterpriseLensText(card = {}) {
    return [
      ...cardTitleAliases(card),
      card.subject,
      card.sourceName,
      card.sourceUrl,
      card.translatedFact,
      card.visibleFragment,
      ...(card.originalHighlights || []),
      ...(card.flatTags || []),
      ...(card.displayTags || []).map((tag) => tag.label || tag.id || tag),
    ].filter(Boolean).join(" ");
  }

  function enterpriseStageFromText(text = "", category = "") {
    if (/governance|guardrail|security|compliance|risk|permission|identity|audit|合规|安全|权限|审计|治理|风险/iu.test(text)) return "governance";
    if (/deployed|deployment|rollout|production|at scale|customer adoption|case study|adopts|uses|上线|部署|落地|采用|规模化|客户案例/iu.test(text)) return "production_rollout";
    if (/pilot|poc|proof of concept|trial|prototype|beta|试点|验证|概念验证|内测/iu.test(text)) return "pilot";
    if (/platform|enterprise|copilot|gemini|bedrock|databricks|snowflake|api|agentcore|starter|平台|企业版|接入|集成|底座/iu.test(text)) return "platform_enablement";
    if (category === "case") return "production_rollout";
    if (category === "product-service") return "platform_enablement";
    return "ai_transformation";
  }

  function enterpriseStageLabel(stage = "") {
    return ({
      pilot: "试点验证",
      production_rollout: "生产上线",
      platform_enablement: "平台使能",
      governance: "治理边界",
      ai_transformation: "AI化进程",
    })[stage] || "AI化进程";
  }

  function enterpriseScenarioFromText(text = "", tags = []) {
    const tagText = tags.join(" ");
    const source = `${text} ${tagText}`;
    if (/red team|security testing|prompt injection|jailbreak|红队|安全测试|提示注入|越狱/iu.test(source)) return "安全与治理";
    if (/cms|content management|content operation|content workflow|内容管理|内容运营|内容创建|发布系统|本地化/iu.test(source)) return "内容运营";
    if (/notetaker|meeting|transcription|minutes|memo|shared memory|记事本|会议|笔记|转录|共享记忆/iu.test(source)) return "知识工作与协作";
    if (/procurement|purchase|supplier|supply chain|bidding|采购|供应商|供应链|招投标/iu.test(source)) return "采购与供应链";
    if (/support|customer service|contact center|sales|crm|客服|客户支持|销售|CRM|工单/iu.test(source)) return "客户服务与销售";
    if (/developer|github|code|software|engineering|devops|开发者|代码|软件研发|工程团队/iu.test(source)) return "软件研发";
    if (/legal|court|police|government|health|finance|insurance|regulat|司法|法院|警察|政务|医疗|金融|保险|监管/iu.test(source)) return "高合规行业";
    if (/data|warehouse|analytics|snowflake|databricks|knowledge|rag|数据|分析|知识库|检索/iu.test(source)) return "数据与知识工作";
    if (/retail|store|restaurant|manufacturing|factory|门店|零售|制造|工厂|餐饮/iu.test(source)) return "一线运营";
    return "企业工作流";
  }

  function enterpriseWorkflowFromText(text = "", category = "") {
    if (/red team|security testing|prompt injection|jailbreak|红队|安全测试|提示注入|越狱/iu.test(text)) return "模型、Agent 与应用安全测试";
    if (/cms|content management|content operation|content workflow|内容管理|内容运营|内容创建|发布系统|本地化/iu.test(text)) return "内容生产、发布与治理流程";
    if (/notetaker|meeting|transcription|minutes|memo|shared memory|记事本|会议|笔记|转录|共享记忆/iu.test(text)) return "会议记录、知识沉淀与团队协作";
    if (/procurement|purchase|supplier|supply chain|bidding|采购|供应商|供应链|招投标/iu.test(text)) return "采购流程自动化与合规校验";
    if (/support|customer service|contact center|sales|crm|客服|客户支持|销售|CRM|工单/iu.test(text)) return "客服响应、线索跟进与知识检索";
    if (/insurance|underwriting|claims|risk underwriting|capital allocation|保险|承保|理赔|资本配置/iu.test(text)) return "承保、理赔与风险控制流程";
    if (/developer|github|code|software|engineering|devops|开发者|代码|软件研发|工程团队/iu.test(text)) return "代码、审查与交付流程";
    if (/data|warehouse|analytics|knowledge|rag|数据|分析|知识库|检索/iu.test(text)) return "企业数据接入与决策支持";
    if (/governance|security|compliance|permission|合规|安全|权限|治理/iu.test(text)) return "权限、合规与风险控制";
    if (category === "funding") return "预算、采购与供应商选择";
    return "把 Agent 或模型接入业务系统";
  }

  function enterpriseBoundaryFromCard(card = {}) {
    const fact = factText(card);
    if (!fact || isWeakFact(fact)) return "仅确认存在公开信号，暂缺投入、ROI 与长期运行效果。";
    return compactText(`已确认：${fact}；未确认：内部投入、ROI 与长期运行效果。`, 190);
  }

  function fallbackEnterpriseAiTransformationItems(date = "") {
    const seen = new Set();
    const candidates = [
      ...(state.payload.cards || []),
    ].filter((card) => card.date === date)
      .filter((card) => {
        const id = card.linkedCardId || card.id;
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      })
      .map((card) => {
        const text = enterpriseLensText(card);
        const tags = card.flatTags || [];
        let score = Number(card.frontstageEvidenceScore) || 0;
        if (card.category === "case") score += 28;
        if (card.category === "product-service") score += 16;
        if (tags.includes("track-enterprise-workflow")) score += 24;
        if (tags.includes("customer-enterprise")) score += 18;
        if (tags.includes("evidence-customer-adoption")) score += 18;
        if (/FDE|forward deployed|customer-embedded|domain operator|production environment|regulated payer workflow|implementation|workflow|deployment|rollout|customer adoption|business process|技术实施|客户嵌入|生产环境|业务流程|实施|部署|落地/iu.test(text)) score += 48;
        if (/enterprise|workflow|customer|deployment|procurement|governance|integration|automation|企业|流程|客户|部署|采购|治理|集成|自动化/iu.test(text)) score += 24;
        if (/cms|content management|red team|security testing|business workflow|内容管理|内容运营|红队|安全测试|业务流程/iu.test(text)) score += 16;
        if (/world leaders|turn it off|G7|sovereign AI|national security|国家安全|峰会|领导人|关闭模型访问/iu.test(text)) score -= 80;
        if (/developer hub|cloud tpu|colab|xla|pytorch|kv cache|benchmark|wildchat|public chat|research|paper|dataset|开发者中心|数据集|研究|论文/iu.test(text)) score -= 34;
        if (/原文 AI 事件|该来源披露的是/u.test(text)) score -= 28;
        if (/report|guide|top\s+\d+|榜单|指南|报告|清单/iu.test(text)) score -= 18;
        const stage = enterpriseStageFromText(text, card.category);
        return {
          card,
          score,
          item: {
            id: `enterprise-ai:${card.linkedCardId || card.id}`,
            cardId: card.linkedCardId || card.id,
            date: card.date,
            category: card.category,
            categoryLabel: card.categoryLabel || categoryLabel(card.category),
            title: cardDisplayTitle(card),
            subject: card.subject,
            sourceName: card.sourceName,
            sourceUrl: card.sourceUrl,
            stage,
            stageLabel: enterpriseStageLabel(stage),
            scenario: enterpriseScenarioFromText(text, tags),
            workflow: enterpriseWorkflowFromText(text, card.category),
            evidenceBoundary: enterpriseBoundaryFromCard(card),
          },
        };
      });
    return candidates
      .filter((row) => row.score >= 36)
      .filter((row) => {
        const text = enterpriseLensText(row.card);
        if (/design partner|brand design|visual identity|launch sequence|设计伙伴|品牌设计|视觉识别/iu.test(text) && !/deployment|production|rollout|FDE|forward deployed|生产|部署|落地/iu.test(text)) return false;
        if (!/\bAI\b|agentic|agents?|LLM|model|Claude|Bedrock|智能体|模型|人工智能/u.test(text)) return false;
        const implementation = /FDE|forward deployed|customer-embedded|domain operator|production environment|regulated payer workflow|implementation|workflow|deployment|rollout|customer adoption|case study|business process|pilot|procurement|technical scoping|系统设计|客户嵌入|生产环境|生产上线|业务流程|实施|部署|落地|试点|采购|交付/iu.test(text);
        const broadGovernance = /world leaders|turn it off|G7|sovereign AI|national security|国家安全|峰会|领导人|关闭模型访问/iu.test(text);
        if (implementation && (!broadGovernance || /workflow|deployment|customer|production|business process|业务流程|部署|客户|生产/iu.test(text))) return true;
        return /workflow|customer|deployment|adoption|procurement|cms|content management|red team|security testing|agentic ai.*business|enterprise system|企业|流程|客户|部署|采用|采购|内容管理|内容运营|红队|安全测试|业务系统/iu.test(text);
      })
      .sort((a, b) => b.score - a.score || String(a.item.id).localeCompare(String(b.item.id)))
      .slice(0, 5)
      .map((row) => row.item);
  }

  function enterpriseAiTransformationItems() {
    const date = selectedDate();
    const published = Array.isArray(state.payload?.enterpriseAiTransformation)
      ? state.payload.enterpriseAiTransformation
      : [];
    const items = published.length
      ? published.filter((item) => item.date === date)
      : fallbackEnterpriseAiTransformationItems(date);
    return items.filter((item) => state.filters.category === "all" || item.category === state.filters.category);
  }

  function renderEnterpriseAiDetail(item = {}) {
    const root = $("[data-detail-content]");
    const dialog = $("[data-detail-dialog]");
    if (!root || !dialog) return;
    const analysis = item.implementationAnalysis || {};
    root.innerHTML = `
      <h2 class="detail-title">${safe(item.title)}</h2>
      <div class="detail-source-row">
        <span>${safe(item.categoryLabel || "企业AI化")} · ${safe(fmtDate(item.date || selectedDate()))}</span>
        <strong>${safe(item.subject || item.sourceName || "FDE lens")}</strong>
        ${item.sourceUrl ? `<a href="${safe(item.sourceUrl)}" target="_blank" rel="noreferrer">查看原文</a>` : ""}
      </div>
      <div class="detail-fact-card">
        <h3>AI化动作</h3>
        <p>${safe(item.workflow || "把 Agent 或模型接入业务系统")}</p>
      </div>
      <div class="detail-main-grid">
        <div class="detail-block">
          <h3>发现的需求</h3>
          <p>${safe(analysis.demand || "原文未提供足够信息判断具体需求。")}</p>
        </div>
        <div class="detail-block">
          <h3>提供的服务</h3>
          <p>${safe(analysis.services || "原文未提供足够信息判断具体服务。")}</p>
        </div>
        <div class="detail-block">
          <h3>实施结果</h3>
          <p>${safe(analysis.result || "原文未披露最终实施结果。")}</p>
        </div>
        <div class="detail-block">
          <h3>阶段与场景</h3>
          <p>${safe([item.stageLabel || enterpriseStageLabel(item.stage), item.scenario].filter(Boolean).join(" / ") || "暂无公开说明。")}</p>
        </div>
        <div class="detail-block">
          <h3>证据边界</h3>
          <p>${safe(item.evidenceBoundary || "已保留为 FDE lens 线索；如未生成正式 Signal Card，则说明它只适合做企业 AI 化观察，不作为正式商业信号卡片。")}</p>
        </div>
      </div>
      <details class="detail-aux">
        <summary>辅助信息</summary>
        <div class="detail-grid">
          ${detailField("主体", item.subject)}
          ${detailField("来源", item.sourceName || item.sourceUrl)}
          ${detailField("来源依据", analysis.sourceBasis)}
          ${detailField("Card ID", item.cardId || item.id)}
        </div>
      </details>
    `;
    dialog.showModal();
  }

  function renderEnterpriseAiTransformation() {
    const root = $("[data-enterprise-ai-transformation]");
    if (!root) return;
    const items = enterpriseAiTransformationItems();
    const count = $("[data-enterprise-ai-count]");
    if (count) count.textContent = `${items.length} 条`;
    root.innerHTML = items.length ? `
      <div class="enterprise-ai-list-head" aria-hidden="true">
        <span>案例</span>
        <span>AI化动作</span>
        <span>Tags</span>
        <span>入口</span>
      </div>
      ${items.map((item) => `
      <article class="enterprise-ai-card">
        <div class="enterprise-ai-title-block">
          <h3>${safe(item.title)}</h3>
        </div>
        <p class="enterprise-ai-cell" data-label="AI化动作">${safe(item.workflow || "把 Agent 或模型接入业务系统")}</p>
        <div class="enterprise-ai-tag-list" data-label="Tags">
          <span class="enterprise-ai-stage">${safe(item.stageLabel || enterpriseStageLabel(item.stage))}</span>
          <span>${safe(item.scenario || "企业工作流")}</span>
        </div>
        <div class="enterprise-ai-actions">
          ${item.cardId ? `<button class="detail-link" type="button" data-open-enterprise-detail="${safe(item.cardId)}">详情</button>` : ""}
          ${item.sourceUrl ? `<a class="detail-link" href="${safe(item.sourceUrl)}" target="_blank" rel="noreferrer">原文</a>` : ""}
        </div>
      </article>
    `).join("")}
    ` : "<div class=\"empty-state\">等待今日合格信号形成。</div>";
    root.onclick = (event) => {
      const detailButton = event.target.closest("[data-open-enterprise-detail]");
      if (!detailButton) return;
      const id = detailButton.dataset.openEnterpriseDetail;
      const item = findEnterpriseAiItem(id);
      if (item) {
        renderEnterpriseAiDetail(item);
        return;
      }
      const card = findDetailCard(id);
      if (card) {
        renderDetail(card);
        return;
      }
    };
  }

  function renderAiHardwareDetail(item = {}) {
    const root = $("[data-detail-content]");
    const dialog = $("[data-detail-dialog]");
    if (!root || !dialog) return;
    root.innerHTML = `
      <h2 class="detail-title">${safe(item.title || cardDisplayTitle(item))}</h2>
      <div class="detail-source-row">
        <span>${safe(item.hardwareTrackLabel || "AI Hardware")} · ${safe(fmtDate(item.date || selectedDate()))}</span>
        <strong>${safe(item.subject || item.sourceName || "AI hardware signal")}</strong>
        ${item.sourceUrl ? `<a href="${safe(item.sourceUrl)}" target="_blank" rel="noreferrer">查看原文</a>` : ""}
      </div>
      <div class="detail-fact-card">
        <h3>硬件商业事件</h3>
        <p>${safe(factText(item))}</p>
      </div>
      <div class="detail-main-grid">
        <div class="detail-block">
          <h3>观察分组</h3>
          <p>${safe(item.hardwareTrackLabel || "趋势创新")}</p>
        </div>
        <div class="detail-block">
          <h3>展示边界</h3>
          <p>${safe(item.promotionStatus === "ai_hardware_lens_only" ? "该条保留在 AI 硬件观察模块，不进入当前正式 Card 混排。" : "该条已有正式 Card，同时被 AI 硬件观察模块引用。")}</p>
        </div>
        <div class="detail-block">
          <h3>来源</h3>
          <p>${safe(item.sourceName || item.sourceUrl || "公开来源")}</p>
        </div>
        <div class="detail-block">
          <h3>证据片段</h3>
          <p>${safe(visibleFragmentText(item, [factText(item)]) || item.visibleFragment || item.summary || "原文未提供更多可公开展示片段。")}</p>
        </div>
      </div>
    `;
    dialog.showModal();
  }

  function renderAiHardwareSignals() {
    const root = $("[data-ai-hardware-signals]");
    if (!root) return;
    const items = aiHardwareItems();
    const count = $("[data-ai-hardware-count]");
    if (count) count.textContent = `${items.length} 条`;
    root.innerHTML = items.length ? `
      <div class="enterprise-ai-list-head" aria-hidden="true">
        <span>事件</span>
        <span>硬件线索</span>
        <span>分组</span>
        <span>入口</span>
      </div>
      ${items.map((item) => {
        const fact = factText(item);
        return `
        <article class="enterprise-ai-card ai-hardware-card">
          <div class="enterprise-ai-title-block">
            <h3>${safe(item.title || cardDisplayTitle(item))}</h3>
          </div>
          <p class="enterprise-ai-cell" data-label="硬件线索">${safe(fact)}</p>
          <div class="enterprise-ai-tag-list" data-label="分组">
            <span class="enterprise-ai-stage">${safe(item.hardwareTrackLabel || "趋势创新")}</span>
            <span>${safe(item.promotionStatus === "ai_hardware_lens_only" ? "独立观察" : "已关联 Card")}</span>
          </div>
          <div class="enterprise-ai-actions">
            <button class="detail-link" type="button" data-open-ai-hardware-detail="${safe(item.id)}">详情</button>
            ${item.sourceUrl ? `<a class="detail-link" href="${safe(item.sourceUrl)}" target="_blank" rel="noreferrer">原文</a>` : ""}
          </div>
        </article>
      `}).join("")}
    ` : "<div class=\"empty-state\">等待今日 AI 硬件投资、场景服务或趋势创新信号形成。</div>";
    root.onclick = (event) => {
      const detailButton = event.target.closest("[data-open-ai-hardware-detail]");
      if (!detailButton) return;
      const item = findAiHardwareItem(detailButton.dataset.openAiHardwareDetail);
      if (item) renderAiHardwareDetail(item);
    };
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
      const subject = card.subject || card.sourceName || cardDisplayTitle(card);
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
      const subject = card.subject || card.sourceName || cardDisplayTitle(card);
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
      const subject = card.subject || card.sourceName || cardDisplayTitle(card);
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
      <div class="relation-network-canvas" style="--relation-network-scale:${safe(state.relationshipZoom)}">
        <div class="relation-network-legend">
          <span>主体</span>
          <span>商业动作</span>
          <span>关键变量</span>
        </div>
        <div class="relation-network-stage">
          <svg class="relation-network-lines" viewBox="0 0 1000 600" aria-hidden="true">${lines}</svg>
          <div class="relation-network-nodes">${nodes}</div>
        </div>
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
        <h3>${safe(cardDisplayTitle(card))}</h3>
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
              <strong>${safe(cardDisplayTitle(item))}</strong>
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

  const opportunityLabels = {
    enterprise_ai_owner: "企业 AI 负责人",
    sales_team: "销售团队",
    engineering_team: "开发团队",
    customer_support_team: "客服团队",
    legal_team: "法务团队",
    procurement_team: "采购部门",
    healthcare_provider: "医疗机构",
    finance_team: "财务团队",
    insurance_team: "保险机构",
    internal_tool_building: "内部工具构建",
    sales_lead_research: "销售线索整理",
    customer_ticket_triage: "客服质检",
    contract_review: "合同审查",
    rfp_response: "投标响应",
    knowledge_base_qa: "知识库问答",
    medical_documentation: "医疗文书",
    insurance_claim_review: "保险理赔",
    workflow_integration: "集成难",
    api_cost_spike: "成本",
    security_compliance: "合规",
    evaluation_gap: "评测困难",
    context_management: "上下文不足",
    latency_sensitive: "延迟",
    data_silo: "数据",
    hallucination_risk: "幻觉",
    permission_boundary: "权限",
    agent_workbench: "Agent",
    copilot: "Copilot",
    rag_knowledge_base: "RAG",
    model_gateway: "模型网关",
    api: "API",
    developer_tool: "工作台",
    workflow_automation: "自动化脚本",
    vertical_saas: "垂直 SaaS",
    fde_service: "FDE 服务",
    evaluation_platform: "评测平台",
    customer_metric: "增长数字",
    deployment_scale: "部署规模",
    procurement_contract: "合同 / 采购",
    case_study: "案例页面",
    partnership_announcement: "合作公告",
    third_party_report: "第三方报道",
  };

  const painProductRows = [
    { label: "成本", values: ["api_cost_spike"] },
    { label: "权限", values: ["permission_boundary", "audit_log_required"] },
    { label: "数据", values: ["data_silo", "context_management"] },
    { label: "幻觉", values: ["hallucination_risk"] },
    { label: "延迟", values: ["latency_sensitive"] },
    { label: "集成", values: ["workflow_integration", "model_routing_complexity"] },
    { label: "评测", values: ["evaluation_gap"] },
    { label: "人工复核", values: ["human_review_required"] },
  ];

  const painProductColumns = [
    { label: "Agent", values: ["agent_workbench"] },
    { label: "Copilot", values: ["copilot"] },
    { label: "RAG", values: ["rag_knowledge_base"] },
    { label: "网关", values: ["model_gateway", "api"] },
    { label: "工作台", values: ["developer_tool", "browser_or_desktop_tool"] },
    { label: "FDE 服务", values: ["fde_service"] },
    { label: "垂直 SaaS", values: ["vertical_saas", "workflow_automation"] },
  ];

  function opportunityValues(card, field) {
    const values = card.opportunitySignals?.[field] || [];
    return Array.isArray(values) ? values : [];
  }

  function opportunityLabel(value) {
    return opportunityLabels[value] || value || "";
  }

  function hasOpportunityValue(card, field, values) {
    const wanted = new Set(values);
    return opportunityValues(card, field).some((value) => wanted.has(value));
  }

  function opportunityWindowCards(days = 30) {
    const activeDate = selectedDate();
    return state.payload.cards
      .filter((card) => card.category !== "opinion")
      .filter((card) => card.opportunitySignals)
      .filter((card) => {
        const diff = daysBetween(activeDate, card.date);
        return diff >= 0 && diff <= days - 1;
      });
  }

  const entryPointRows = [
    { label: "客服", fields: ["buyerOrUser", "teamOrFunction"], values: ["customer_support_team", "customer_support"] },
    { label: "销售", fields: ["buyerOrUser", "teamOrFunction"], values: ["sales_team", "sales"] },
    { label: "法务", fields: ["buyerOrUser", "teamOrFunction"], values: ["legal_team", "legal_compliance"] },
    { label: "研发", fields: ["buyerOrUser", "teamOrFunction"], values: ["engineering_team", "engineering"] },
    { label: "采购", fields: ["buyerOrUser", "teamOrFunction"], values: ["procurement_team", "procurement"] },
    { label: "医疗", fields: ["buyerOrUser", "teamOrFunction"], values: ["healthcare_provider", "healthcare_operations"] },
    { label: "金融", fields: ["buyerOrUser", "teamOrFunction"], values: ["finance_team", "finance", "insurance_team", "insurance_operations"] },
    { label: "内容团队", fields: ["buyerOrUser", "teamOrFunction"], values: ["content_team", "marketing_content"] },
  ];

  const entryPointColumns = [
    { label: "问答", values: ["knowledge_base_qa", "data_analysis_query"] },
    { label: "审查", values: ["contract_review", "code_review", "insurance_claim_review", "permission_audit"] },
    { label: "生成", values: ["sales_briefing", "rfp_response", "content_workflow"] },
    { label: "质检", values: ["customer_ticket_triage"] },
    { label: "检索", values: ["sales_lead_research", "procurement_supplier_screening"] },
    { label: "自动执行", values: ["internal_tool_building", "model_deployment", "logistics_coordination"] },
    { label: "预测", values: ["cost_monitoring"] },
    { label: "工作流编排", values: ["medical_documentation", "call_transcription"] },
  ];

  function hasOpportunityAny(card, fields, values) {
    return fields.some((field) => hasOpportunityValue(card, field, values));
  }

  function renderEntryPointMap(cards) {
    const cells = entryPointRows.flatMap((row) => entryPointColumns.map((column) => {
      const cellCards = cards.filter((card) => hasOpportunityAny(card, row.fields, row.values)
        && hasOpportunityValue(card, "specificTask", column.values));
      return { row, column, cards: cellCards };
    }));
    const maxCount = Math.max(...cells.map((cell) => cell.cards.length), 1);
    return `
      <div class="entry-point-grid" style="--entry-cols:${safe(entryPointColumns.length)}">
        <div class="entry-point-corner">买方</div>
        ${entryPointColumns.map((column) => `<div class="entry-point-col">${safe(column.label)}</div>`).join("")}
        ${entryPointRows.map((row) => `
          <div class="entry-point-row">${safe(row.label)}</div>
          ${entryPointColumns.map((column) => {
            const cell = cells.find((item) => item.row === row && item.column === column);
            const count = cell?.cards.length || 0;
            const heat = count ? Math.max(.12, count / maxCount) : 0;
            return `<div class="entry-point-cell ${count ? "has-signal" : ""}" style="--heat:${safe(heat.toFixed(2))}"><strong>${safe(count || "")}</strong></div>`;
          }).join("")}
        `).join("")}
      </div>
    `;
  }

  function renderProductPainMap(cards) {
    const cells = painProductRows.flatMap((row) => painProductColumns.map((column) => {
      const cellCards = cards.filter((card) => hasOpportunityValue(card, "painOrConstraint", row.values)
        && (hasOpportunityValue(card, "productForm", column.values) || hasOpportunityValue(card, "deliveryModel", column.values)));
      return { row, column, cards: cellCards };
    }));
    const maxCount = Math.max(...cells.map((cell) => cell.cards.length), 1);
    return `
      <div class="product-pain-grid" style="--pain-cols:${safe(painProductColumns.length)}">
        <div class="product-pain-corner">痛点</div>
        ${painProductColumns.map((column) => `<div class="product-pain-col">${safe(column.label)}</div>`).join("")}
        ${painProductRows.map((row) => `
          <div class="product-pain-row">${safe(row.label)}</div>
          ${painProductColumns.map((column) => {
            const cell = cells.find((item) => item.row === row && item.column === column);
            const count = cell?.cards.length || 0;
            const heat = count ? Math.max(.12, count / maxCount) : 0;
            return `<div class="product-pain-cell ${count ? "has-signal" : ""}" style="--heat:${safe(heat.toFixed(2))}"><strong>${safe(count || "")}</strong></div>`;
          }).join("")}
        `).join("")}
      </div>
    `;
  }

  function renderOpportunityPanels() {
    const root = $("[data-opportunity-panels]");
    if (!root) return;
    const cards = opportunityWindowCards(30);
    root.innerHTML = `
      <section class="opportunity-panels" aria-label="切入点图与产品痛点图">
        <div class="opportunity-panel">
          <div class="relationship-panel-head">
            <div>
              <p class="desk-kicker">Entry Point Map</p>
              <h3>切入点图</h3>
            </div>
            <span>买方 × 具体任务</span>
          </div>
          <div class="entry-point-scroll">${renderEntryPointMap(cards)}</div>
        </div>
        <div class="opportunity-panel">
          <div class="relationship-panel-head">
            <div>
              <p class="desk-kicker">Product Pain Map</p>
              <h3>产品痛点图</h3>
            </div>
            <span>痛点 × 产品形态</span>
          </div>
          <div class="product-pain-scroll">${renderProductPainMap(cards)}</div>
        </div>
      </section>
    `;
  }

  function renderStats() {
    const date = selectedDate();
    const summary = $("[data-day-summary]");
    if (summary) summary.textContent = `${fmtDate(date)} · ${displayModeLabel()}`;

    const root = $("[data-relationship-overview]");
    if (!root) return;
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
    const zoomPercent = Math.round(state.relationshipZoom * 100);
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
              <div class="relationship-panel-tools">
                <span>${safe(fmtDate(date))} · 30 日窗口</span>
                <div class="relation-zoom-controls" aria-label="关系网络缩放">
                  <button type="button" data-network-zoom="-">-</button>
                  <output>${safe(zoomPercent)}%</output>
                  <button type="button" data-network-zoom="+">+</button>
                  <button type="button" data-network-zoom="reset">重置</button>
                </div>
              </div>
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
      </section>
    `;
    root.onclick = (event) => {
      const zoomButton = event.target.closest("[data-network-zoom]");
      if (zoomButton) {
        const action = zoomButton.dataset.networkZoom;
        if (action === "reset") {
          state.relationshipZoom = 0.85;
        } else {
          const delta = action === "+" ? 0.1 : -0.1;
          state.relationshipZoom = Math.min(1.2, Math.max(0.6, Number((state.relationshipZoom + delta).toFixed(2))));
        }
        renderAll();
        return;
      }
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
        const card = findDetailCard(detailButton.dataset.openDetail);
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
    if (graphSummaryPanel) graphSummaryPanel.textContent = `${fmtDate(date)} · ${displayModeLabel()}`;
    renderOpportunityPanels();
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
    if (graphSummary) graphSummary.textContent = `${fmtDate(date)} · ${displayModeLabel()}`;
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
    const daySummary = $("[data-day-summary]");
    if (daySummary) {
      daySummary.textContent = `${fmtDate(date)} · ${displayModeLabel()}`;
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

  function renderDisplayModeToggle() {
    const root = $("[data-display-mode-toggle]");
    if (!root) return;
    root.innerHTML = "";
    root.onclick = null;
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
    return displayCards().filter((card) => {
      const filters = state.filters;
      const rangeDiff = daysBetween(activeDate, card.date);
      const queryText = [
        ...cardTitleAliases(card),
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
        <td>
          <strong>${safe(cardDisplayTitle(card))}</strong>
        </td>
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
    root.innerHTML = today.length
      ? today.map((item) => trendAssetCard(item, "candidate")).join("")
      : "<div class=\"empty-state\">暂无新增趋势候选资产。</div>";
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
                <strong>${safe(cardDisplayTitle(card))}</strong>
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
                <strong>${safe(cardDisplayTitle(card))}</strong>
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
    const titleAliases = cardTitleAliases(card);
    const highlights = uniqueDetailLines(card.originalHighlights || [], [fact, ...titleAliases], 8);
    const value = valueText(card, fact);
    const visibleFragment = visibleFragmentText(card, [fact, value, ...titleAliases, ...highlights]);
    const evidenceLines = uniqueDetailLines([...highlights, visibleFragment], [fact, value, ...titleAliases], 6);
    const sourceLinks = card.sourceLinks || [];
    const detailMainBlocks = [
      value ? `
        <div class="detail-block">
          <h3>观察价值</h3>
          <p>${safe(value)}</p>
        </div>
      ` : "",
      evidenceLines.length ? `
        <div class="detail-block">
          <h3>原文证据</h3>
          <ul>${evidenceLines.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>
        </div>
      ` : "",
    ].filter(Boolean).join("");
    root.innerHTML = `
      <h2 class="detail-title">${safe(cardDisplayTitle(card))}</h2>
      <div class="detail-source-row">
        <span>${safe(card.categoryLabel)} · ${safe(fmtDate(card.date))}</span>
        <strong>${safe(sourceText(card) || card.sourceName || "暂无公开来源")}</strong>
        ${card.sourceUrl ? `<a href="${safe(card.sourceUrl)}" target="_blank" rel="noreferrer">查看原文</a>` : ""}
      </div>
      <div class="detail-fact-card">
        <h3>新闻事实</h3>
        <p>${safe(fact)}</p>
      </div>
      ${detailMainBlocks ? `<div class="detail-main-grid">${detailMainBlocks}</div>` : ""}
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
        const card = findDetailCard(detailButton.dataset.openDetail);
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
    renderDisplayModeToggle();
    renderTabs();
    renderStats();
    renderTable(cards);
    renderList(cards);
    renderAiHardwareSignals();
    renderEnterpriseAiTransformation();
    renderRelationshipLinks();
    renderTrendCandidates();
    renderHistoricalTrends();
  }

  async function init() {
    const response = await fetch("data/v3-data-observation-desk.json", { cache: "no-store" });
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
