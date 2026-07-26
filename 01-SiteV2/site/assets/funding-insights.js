(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = (value = "") => String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
  const safeUrl = (value = "") => {
    if (!String(value || "").trim()) return "";
    try {
      const url = new URL(value, window.location.href);
      return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
      return "";
    }
  };
  const state = { cards: [], filtered: [], companyId: "" };
  const form = $("[data-filter-form]");
  const list = $("[data-list]");
  const status = $("[data-status]");
  const dialog = $("[data-dialog]");
  const dialogContent = $("[data-dialog-content]");

  function fillSelect(name, values) {
    const select = form.elements.namedItem(name);
    for (const value of values) select.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`);
  }

  function cardSearchText(card) {
    return [
      card.company?.name,
      card.company?.full_name,
      card.company?.summary,
      ...(card.products || []).flatMap((item) => [item.name, item.description, item.target_customers]),
      ...(card.financing?.investors || []).map((item) => item.name),
      ...(card.customers || []).map((item) => item.name),
      ...(card.comparisons || []).map((item) => item.name),
      card.analysis?.capital_judgment,
      card.analysis?.sector,
    ].join(" ").toLowerCase();
  }

  function render() {
    const query = String(form.elements.namedItem("query").value || "").trim().toLowerCase();
    const round = form.elements.namedItem("round").value;
    const sector = form.elements.namedItem("sector").value;
    state.filtered = state.cards.filter((card) => (
      (!state.companyId || card.company?.entity_id === state.companyId)
      && (!query || cardSearchText(card).includes(query))
      && (!round || card.financing?.round === round)
      && (!sector || card.analysis?.sector === sector)
    ));
    status.textContent = `显示 ${state.filtered.length} / ${state.cards.length} 个自动发布融资项目`;
    if (!state.filtered.length) {
      list.innerHTML = '<div class="fi-empty">当前筛选条件下暂无融资透视</div>';
      return;
    }
    list.innerHTML = state.filtered.map((card) => `
      <article class="fi-card">
        <div class="fi-card-round">
          <strong>${escapeHtml(card.financing?.amount || "金额未披露")}</strong>
          <span>${escapeHtml(card.financing?.round || "")}</span>
          <span>${escapeHtml(card.financing?.announced_at || card.as_of_date)}</span>
        </div>
        <div class="fi-card-body">
          <p class="fi-card-label">${escapeHtml(card.analysis?.sector || "Funding Insight")}</p>
          <h2>${escapeHtml(card.company?.name)}</h2>
          <p class="fi-card-summary">${escapeHtml(card.company?.summary)}</p>
          <p class="fi-card-products"><strong>产品：</strong>${(card.products || []).map((item) => linkedResearchName(card, item.name)).join("、")}</p>
        </div>
        <div class="fi-card-side">
          <p class="fi-card-investors"><strong>投资方：</strong>${(card.financing?.investors || []).map((item) => linkedResearchName(card, item.name)).join("、")}</p>
          <button type="button" data-open-id="${escapeHtml(card.funding_insight_id)}">查看融资透视与证据</button>
        </div>
      </article>
    `).join("");
    list.querySelectorAll("[data-open-id]").forEach((button) => {
      button.addEventListener("click", () => openDetail(button.dataset.openId));
    });
  }

  function entityLink(link, label) {
    return link ? `<a href="${escapeHtml(link)}">${escapeHtml(label)}</a>` : "";
  }

  function linkedResearchName(card, name, suffix = "") {
    const link = (card.entity_links || []).find((item) => (
      item.research_name === name && item.canonical_entity_id
    ));
    const label = `${name}${suffix}`;
    return link
      ? `<a href="data-center.html?view=index&detail=entity&id=${encodeURIComponent(link.canonical_entity_id)}">${escapeHtml(label)}</a>`
      : escapeHtml(label);
  }

  function detailHtml(card) {
    const links = [
      entityLink(safeUrl(card.company?.website), "公司官网"),
      entityLink(card.links?.company, "产业档案"),
      entityLink(card.links?.relation_map, "关系图谱"),
      entityLink(card.links?.funding_event, "融资事件"),
      card.analysis?.related_direction ? entityLink(card.links?.direction, `相关方向：${card.analysis.related_direction.title}`) : "",
    ].filter(Boolean).join("");
    const investors = (card.financing?.investors || []).map((item) => linkedResearchName(card, item.name, item.role ? `（${item.role}）` : "")).join("、");
    const founders = (card.company?.founders || []).map((item) => linkedResearchName(card, item.name, item.role ? `（${item.role}）` : "")).join("、") || "未披露";
    const teamSize = card.company?.team_size?.value || "未披露";
    const products = (card.products || []).map((item) => `
      <article class="fi-product">
        <h4>${linkedResearchName(card, item.name)}</h4>
        <p>${escapeHtml(item.description)}</p>
        ${item.target_customers ? `<p><strong>目标客户：</strong>${escapeHtml(item.target_customers)}</p>` : ""}
        ${(item.features || []).length ? `<p><strong>关键能力：</strong>${escapeHtml(item.features.join("、"))}</p>` : ""}
      </article>
    `).join("");
    const customers = (card.customers || []).map((item) => `
      <article class="fi-customer">
        <h4>${linkedResearchName(card, item.name)}${item.industry ? `｜${escapeHtml(item.industry)}` : ""}</h4>
        <p>${escapeHtml(item.use_case || "公开使用场景未披露")}</p>
      </article>
    `).join("") || '<div class="fi-empty">当前来源未确认公开客户案例</div>';
    const metrics = (card.metrics || []).map((item) => `
      <article class="fi-metric"><p><strong>${escapeHtml(item.label)}：</strong>${escapeHtml(item.value)}${item.observed_at ? `｜观察于 ${escapeHtml(item.observed_at)}` : ""}</p></article>
    `).join("") || '<div class="fi-empty">当前来源未披露可验证经营数据</div>';
    const quotes = (card.quotes || []).map((item) => `
      <blockquote class="fi-quote"><p>${escapeHtml(item.quote)}</p><cite>${escapeHtml(item.speaker || "公开来源")}</cite></blockquote>
    `).join("");
    const fundingHistory = (card.funding_history || []).map((item) => `
      <a class="fi-history-item" href="data-center.html?view=events&detail=event&id=${encodeURIComponent(item.event_id)}">
        <time>${escapeHtml(item.date || "日期未披露")}</time>
        <span>${escapeHtml(item.title || item.event_id)}</span>
        <strong>${escapeHtml(item.amount || "")}</strong>
      </a>
    `).join("") || '<div class="fi-empty">当前数据中心暂无更早融资事件</div>';
    const comparisons = (card.comparisons || []).map((item) => `
      <tr><td>${linkedResearchName(card, item.name)}</td><td>${escapeHtml(item.positioning)}</td><td>${escapeHtml(item.target_customer)}</td><td>${escapeHtml(item.funding_summary)}</td><td>${escapeHtml(item.core_difference)}</td></tr>
    `).join("");
    const sources = (card.research_sources || []).map((source) => `
      <div class="fi-source">
        <a href="${escapeHtml(safeUrl(source.source_url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title || source.publisher)}</a>
        <span>${escapeHtml(source.source_class)}</span>
      </div>
    `).join("");
    return `
      <div class="fi-detail">
        <p class="fi-detail-kicker">${escapeHtml(card.financing?.round)} · ${escapeHtml(card.financing?.amount)}</p>
        <h2 id="fi-dialog-title">${escapeHtml(card.company?.full_name || card.company?.name)}</h2>
        <p class="fi-detail-deck">${escapeHtml(card.company?.summary)}</p>
        <div class="fi-detail-links">${links}</div>
        <div class="fi-fact-grid">
          <div class="fi-fact"><span>融资披露</span><strong>${escapeHtml(card.financing?.amount)}｜${escapeHtml(card.financing?.round)}${card.financing?.total_raised ? `；累计 ${escapeHtml(card.financing.total_raised)}` : ""}</strong></div>
          <div class="fi-fact"><span>投资方</span><strong>${investors}</strong></div>
          <div class="fi-fact"><span>总部 / 团队</span><strong>${escapeHtml(card.company?.headquarters || "未披露")}｜${escapeHtml(teamSize)}</strong></div>
          <div class="fi-fact"><span>创始人</span><strong>${founders}</strong></div>
        </div>
        <section class="fi-section">
          <div class="fi-section-head"><h3>产品与买方</h3><span class="fi-section-note">关联主体与产品</span></div>
          <div class="fi-product-list">${products}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head"><h3>客户与关键数据</h3><span class="fi-section-note">按来源观察日期呈现</span></div>
          <div class="fi-customer-list">${customers}</div>
          <div class="fi-metric-list">${metrics}</div>
          ${quotes ? `<div class="fi-quote-list">${quotes}</div>` : ""}
        </section>
        ${comparisons ? `<section class="fi-section">
          <div class="fi-section-head"><h3>竞争比较</h3><span class="fi-section-note">应用层比较，不写入事实关系图谱</span></div>
          <table class="fi-compare"><thead><tr><th>产品</th><th>定位</th><th>目标客户</th><th>融资</th><th>与主体的差异</th></tr></thead><tbody>${comparisons}</tbody></table>
        </section>` : ""}
        <section class="fi-section">
          <div class="fi-section-head"><h3>融资历史</h3><span class="fi-section-note">关联数据中心正式融资事件</span></div>
          <div class="fi-history-list">${fundingHistory}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head"><h3>资本判断</h3><span class="fi-section-note">DeepSeek V4 Pro自动研究</span></div>
          <p class="fi-judgment">${escapeHtml(card.analysis?.capital_judgment)}</p>
          <div class="fi-risk-list">${(card.analysis?.risks || []).map((risk) => `<article class="fi-risk"><p>${escapeHtml(risk)}</p></article>`).join("")}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head"><h3>来源证据</h3><span class="fi-section-note">${card.research_sources?.length || 0} 个已抓取来源</span></div>
          <div class="fi-source-list">${sources}</div>
        </section>
      </div>
    `;
  }

  function openDetail(id) {
    const card = state.cards.find((item) => item.funding_insight_id === id);
    if (!card) return;
    dialogContent.innerHTML = detailHtml(card);
    dialog.showModal();
    const next = new URLSearchParams(window.location.search);
    next.set("id", id);
    window.history.replaceState({}, "", `funding-insights.html?${next.toString()}`);
  }

  function closeDetail() {
    dialog.close();
    const next = new URLSearchParams(window.location.search);
    next.delete("id");
    window.history.replaceState({}, "", next.size ? `funding-insights.html?${next.toString()}` : "funding-insights.html");
  }

  async function init() {
    const response = await fetch("data/funding-insights-v1.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.cards = data.cards || [];
    const searchParams = new URLSearchParams(window.location.search);
    state.companyId = searchParams.get("company") || "";
    if (state.companyId) {
      const companyCard = state.cards.find((card) => card.company?.entity_id === state.companyId);
      if (companyCard) form.elements.namedItem("query").value = companyCard.company.name;
    }
    $("[data-latest-date]").textContent = data.meta?.latest_date ? `更新于 ${data.meta.latest_date}` : "暂无更新";
    fillSelect("round", data.filters?.rounds || []);
    fillSelect("sector", data.filters?.sectors || []);
    form.addEventListener("input", render);
    form.addEventListener("change", render);
    $("[data-dialog-close]").addEventListener("click", closeDetail);
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) closeDetail();
    });
    render();
    const requested = searchParams.get("id");
    if (requested) openDetail(requested);
  }

  init().catch((error) => {
    status.textContent = `融资透视数据读取失败：${error.message}`;
    list.innerHTML = '<div class="fi-empty">暂时无法读取融资透视，请稍后重试。</div>';
  });
})();
