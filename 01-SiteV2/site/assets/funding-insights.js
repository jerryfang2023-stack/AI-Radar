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
  const disclosureLabels = {
    disclosed: "已披露",
    partially_disclosed: "部分披露",
    not_disclosed: "未披露",
    unknown: "状态未知",
  };

  function cumulativeAmountDisplay(financing = {}) {
    const cumulative = financing.cumulative_amount || {};
    if (cumulative.normalized?.currency) return cumulative.normalized.display_zh;
    return (cumulative.known_round_totals || []).map((item) => item.display_zh).filter(Boolean).join(" + ") || "未披露";
  }
  const form = $("[data-filter-form]");
  const list = $("[data-list]");
  const dialog = $("[data-dialog]");
  const dialogContent = $("[data-dialog-content]");

  function fillSelect(name, values) {
    const select = form.elements.namedItem(name);
    for (const item of values) {
      const value = typeof item === "string" ? item : item.id;
      const label = typeof item === "string" ? item : item.name;
      select.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(value)}">${escapeHtml(label)}</option>`);
    }
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
      card.market_category?.name,
      card.market_subcategory?.name,
      card.market_application?.name,
      card.product_form?.name,
    ].join(" ").toLowerCase();
  }

  function render() {
    const query = String(form.elements.namedItem("query").value || "").trim().toLowerCase();
    const round = form.elements.namedItem("round").value;
    const marketCategory = form.elements.namedItem("market_category").value;
    const marketSubcategory = form.elements.namedItem("market_subcategory").value;
    state.filtered = state.cards.filter((card) => (
      (!state.companyId || [card.company?.entity_id, card.company?.application_entity_id].includes(state.companyId))
      && (!query || cardSearchText(card).includes(query))
      && (!round || card.financing?.round === round)
      && (!marketCategory || card.market_category?.id === marketCategory)
      && (!marketSubcategory || card.market_subcategory?.id === marketSubcategory)
    ));
    if (!state.filtered.length) {
      list.innerHTML = '<div class="fi-empty">当前筛选条件下暂无融资透视</div>';
      return;
    }
    list.innerHTML = state.filtered.map((card) => {
      const investors = card.financing?.investors || [];
      const visibleInvestors = investors.slice(0, 4).map((item) => linkedInvestorName(card, item, true)).join("、");
      const remainingInvestors = Math.max(0, investors.length - 4);
      return `
        <article class="fi-card">
          <header class="fi-card-head">
            <div class="fi-card-meta">
              <span>${escapeHtml([card.market_category?.name, card.market_subcategory?.name, card.market_application?.name].filter(Boolean).join(" · ") || "AI 市场")} · ${escapeHtml(card.product_form?.name || "产品形态未分类")}</span>
              <time>融资 ${escapeHtml(card.financing?.announced_at || "日期未披露")} · ${escapeHtml(disclosureLabels[card.financing?.disclosure_status] || "状态未知")} · 收录于 ${escapeHtml(card.as_of_date || "日期未披露")}</time>
            </div>
            <div class="fi-card-title-row">
              <h2>${escapeHtml(card.company?.name)}</h2>
              <span class="fi-card-round">${escapeHtml(card.financing?.round || "轮次未披露")}</span>
            </div>
          </header>
          <div class="fi-card-product">
            <span>产品</span>
            <p>${(card.products || []).map((item) => linkedResearchName(card, item.name)).join("、") || "产品信息未披露"}</p>
          </div>
          <div class="fi-card-capital">
            <div class="fi-card-amount">
              <span>本轮融资</span>
              <strong>${escapeHtml(card.financing?.amount_normalized?.display_zh || card.financing?.amount || "金额未披露")}</strong>
              ${card.financing?.amount_normalized?.currency !== "CNY" && card.financing?.amount_original && card.financing.amount_original !== card.financing?.amount_normalized?.display_zh ? `<small>原文 ${escapeHtml(card.financing.amount_original)}</small>` : ""}
            </div>
            <div class="fi-card-investors">
              <div class="fi-card-investor-head">
                <span>投资方</span>
                <span>${investors.length} 家</span>
              </div>
              <p>${visibleInvestors || "投资方未披露"}${remainingInvestors ? `<span class="fi-card-investor-more">等 ${remainingInvestors} 家</span>` : ""}</p>
              <small>累计 ${escapeHtml(cumulativeAmountDisplay(card.financing))} · ${card.historical_rounds?.length || 0} 个已知轮次</small>
            </div>
          </div>
          <button type="button" data-open-id="${escapeHtml(card.funding_insight_id)}">
            查看完整融资透视
            <span aria-hidden="true">→</span>
          </button>
        </article>
      `;
    }).join("");
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

  function linkedInvestorName(card, item, showRole = false) {
    const label = `${item.name}${showRole && item.role ? `（${item.role}）` : ""}`;
    if (item.institution_id) {
      return `<a href="data-center.html?view=index&detail=investor&id=${encodeURIComponent(item.institution_id)}">${escapeHtml(label)}</a>`;
    }
    return linkedResearchName(card, item.name, showRole && item.role ? `（${item.role}）` : "");
  }

  function detailHtml(card) {
    const links = [
      entityLink(safeUrl(card.company?.website), "公司官网"),
      entityLink(card.links?.company, "产业档案"),
      entityLink(card.links?.relation_map, "关系图谱"),
      entityLink(card.links?.funding_event, "融资事件"),
      card.analysis?.related_direction ? entityLink(card.links?.direction, `相关方向：${card.analysis.related_direction.title}`) : "",
    ].filter(Boolean).join("");
    const investorItems = card.financing?.investors || [];
    const historicalInvestorItems = card.financing?.other_round_investors || [];
    const leadInvestors = investorItems.filter((item) => /领投/u.test(item.role || ""));
    const otherInvestors = investorItems.filter((item) => !/领投/u.test(item.role || ""));
    const investorNames = (items) => items.map((item) => linkedInvestorName(card, item, true)).join("、") || "未披露";
    const founders = (card.company?.founders || []).map((item) => `
      <div class="fi-founder">
        <strong>${linkedResearchName(card, item.name)}</strong>
        <span>${escapeHtml(item.role || "联合创始人")}</span>
      </div>
    `).join("") || '<div class="fi-field-empty">当前来源未披露创始团队</div>';
    const teamSize = card.company?.team_size?.value || "未披露";
    const targetCustomers = [...new Set((card.products || []).map((item) => item.target_customers).filter(Boolean))];
    const productNames = (card.products || []).map((item) => linkedResearchName(card, item.name)).join("、") || "产品信息未披露";
    const products = (card.products || []).map((item) => `
      <article class="fi-product">
        <h4>${linkedResearchName(card, item.name)}</h4>
        <p>${escapeHtml(item.description)}</p>
        ${(item.features || []).length ? `<ul>${item.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul>` : ""}
      </article>
    `).join("");
    const targets = targetCustomers.map((target) => `<p>${escapeHtml(target)}</p>`).join("")
      || '<div class="fi-field-empty">当前来源未披露目标客户</div>';
    const customerResearch = card.customer_research || {};
    const customers = (card.customers || []).map((item) => `
      <article class="fi-customer">
        <div class="fi-customer-head">
          <h4>${linkedResearchName(card, item.name)}</h4>
          ${item.industry ? `<span>${escapeHtml(item.industry)}</span>` : ""}
        </div>
        <p>${escapeHtml(item.use_case || "公开使用场景未披露")}</p>
      </article>
    `).join("") || `
      <div class="fi-field-empty">
        已检查 ${escapeHtml(customerResearch.searched_source_count || card.research_sources?.length || 0)}
        个抓取来源，暂未发现可核验并公开点名的客户案例。
      </div>
    `;
    const metrics = (card.metrics || []).map((item) => `
      <article class="fi-metric">
        <span>${escapeHtml(item.label)}</span>
        <strong>${escapeHtml(item.value)}</strong>
        ${item.observed_at ? `<time>${escapeHtml(item.observed_at)}</time>` : ""}
      </article>
    `).join("") || '<div class="fi-field-empty">当前来源未披露可验证经营数据</div>';
    const fundingHistory = (card.historical_rounds || []).map((item) => `
      <a class="fi-history-item" href="funding-insights.html?id=${encodeURIComponent(item.funding_insight_id)}">
        <time>${escapeHtml(item.announced_at || "日期未披露")}</time>
        <span>${escapeHtml(item.round || "轮次未披露")}${item.round_original && item.round_original !== item.round ? ` · 原文 ${escapeHtml(item.round_original)}` : ""}</span>
        <strong>${escapeHtml(item.amount_normalized?.display_zh || item.amount_original || "金额未披露")}</strong>
      </a>
    `).join("") || '<div class="fi-field-empty">当前数据中心暂无历史融资轮次</div>';
    const comparisons = (card.comparisons || []).map((item) => `
      <tr>
        <th scope="row">${linkedResearchName(card, item.name)}</th>
        <td>${escapeHtml(item.product || item.positioning || "未披露")}</td>
        <td>${escapeHtml(item.scenario || "未披露")}</td>
        <td>${escapeHtml(item.target_customer || "未披露")}</td>
        <td>${escapeHtml(item.funding_summary || "未披露")}</td>
        <td>${escapeHtml(item.core_difference || "未披露")}</td>
      </tr>
    `).join("");
    const primaryProduct = card.products?.[0];
    const primaryScenario = (primaryProduct?.features || []).slice(0, 2).join("；") || primaryProduct?.description || "未披露";
    const investmentThesis = card.analysis?.investment_thesis || {};
    const rationale = (card.analysis?.investment_rationale || []).map((item) => {
      const sourceId = item.evidence_refs?.[0]?.source_id;
      const source = (card.research_sources || []).find((candidate) => candidate.source_id === sourceId);
      const sourceLink = source ? `
        <a href="${escapeHtml(safeUrl(source.source_url))}" target="_blank" rel="noopener noreferrer">查看机构原文</a>
      ` : "";
      return `
        <article class="fi-institution-view">
          <div class="fi-institution-head">
            <strong>${escapeHtml(item.institution)}</strong>
            <span>${escapeHtml([item.speaker, item.speaker_role].filter(Boolean).join(" · "))}</span>
          </div>
          <p>${escapeHtml(item.rationale)}</p>
          <blockquote lang="en">${escapeHtml(item.quote)}</blockquote>
          ${sourceLink}
        </article>
      `;
    }).join("") || `
      <div class="fi-thesis-empty">
        当前已抓取来源未发现投资机构公开原话，因此不以模型推断替代机构判断。
      </div>
    `;
    const signals = (investmentThesis.evidence_signals || []).map((signal) => `<li>${escapeHtml(signal)}</li>`).join("")
      || "<li>当前来源未形成可独立验证的业务信号。</li>";
    const risks = (investmentThesis.risks || []).map((risk) => `<li>${escapeHtml(risk)}</li>`).join("");
    const sources = (card.research_sources || []).map((source) => `
      <div class="fi-source">
        <a href="${escapeHtml(safeUrl(source.source_url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title || source.publisher)}</a>
        <span>${escapeHtml(source.source_class)}</span>
      </div>
    `).join("");
    const amountNormalized = card.financing?.amount_normalized?.display_zh || "";
    const amountOriginal = card.financing?.amount_original || card.financing?.amount || "";
    const cumulative = card.financing?.cumulative_amount || {};
    const cumulativeDisplay = cumulativeAmountDisplay(card.financing);
    return `
      <div class="fi-detail">
        <header class="fi-detail-hero">
          <div class="fi-detail-main">
            <div class="fi-detail-kicker">
              <span>${escapeHtml(card.application_category?.name || card.analysis?.sector || "AI 应用")}</span>
              <time>融资 ${escapeHtml(card.financing?.announced_at || "日期未披露")} · 收录 ${escapeHtml(card.as_of_date || "日期未披露")}</time>
            </div>
            <h2 id="fi-dialog-title">${escapeHtml(card.company?.full_name || card.company?.name)}</h2>
            <p class="fi-detail-deck">${escapeHtml(card.company?.summary)}</p>
            <div class="fi-detail-links">${links}</div>
            <div class="fi-hero-fields">
              <div class="fi-hero-field">
                <span>产品</span>
                <strong>${productNames}</strong>
              </div>
              <div class="fi-hero-field">
                <span>目标客户</span>
                <strong>${escapeHtml(targetCustomers.join("；") || "未披露")}</strong>
              </div>
            </div>
            <div class="fi-founder-block">
              <span>创始团队</span>
              <div class="fi-founder-list">${founders}</div>
            </div>
          </div>
          <aside class="fi-funding-brief" aria-label="本轮融资摘要">
            <span class="fi-funding-label">本轮融资</span>
            <strong class="fi-funding-amount">${escapeHtml(amountNormalized || amountOriginal || "金额未披露")}</strong>
            ${card.financing?.amount_normalized?.currency !== "CNY" && amountNormalized && amountOriginal && amountNormalized !== amountOriginal ? `<small>金额原文 ${escapeHtml(amountOriginal)}</small>` : ""}
            <div class="fi-funding-round">
              <span>${escapeHtml(card.financing?.round || "轮次未披露")}</span>
              ${card.financing?.round_original && card.financing.round_original !== card.financing.round ? `<span>轮次原文 ${escapeHtml(card.financing.round_original)}</span>` : ""}
              <span>融资日期 ${escapeHtml(card.financing?.announced_at || "未披露")}</span>
              <span>披露状态 ${escapeHtml(disclosureLabels[card.financing?.disclosure_status] || "状态未知")}</span>
              <span>累计金额 ${escapeHtml(cumulativeDisplay)}</span>
              ${cumulative.basis === "known_rounds_only" ? "<small>按已知轮次合计，不代表公司完整累计融资</small>" : ""}
            </div>
            <div class="fi-investor-group">
              <span>领投</span>
              <strong>${investorNames(leadInvestors)}</strong>
            </div>
            <div class="fi-investor-group">
              <span>本轮其他投资方</span>
              <strong>${investorNames(otherInvestors)}</strong>
            </div>
            ${historicalInvestorItems.length ? `
              <div class="fi-investor-group">
                <span>历史或轮次未明</span>
                <strong>${investorNames(historicalInvestorItems)}</strong>
                <small>不计入本轮</small>
              </div>
            ` : ""}
          </aside>
        </header>
        <div class="fi-company-strip">
          <div><span>总部</span><strong>${escapeHtml(card.company?.headquarters || "未披露")}</strong></div>
          <div><span>团队规模</span><strong>${escapeHtml(teamSize)}</strong></div>
          <div><span>投资方</span><strong>${investorItems.length} 家</strong></div>
        </div>
        <section class="fi-section fi-investment-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">01</span><h3>投资逻辑</h3></div>
            <span class="fi-section-note">机构原话与证据边界分开呈现</span>
          </div>
          <div class="fi-thesis-layout">
            <div class="fi-thesis-main">
              <span class="fi-subhead">观澜判断</span>
              <p class="fi-judgment">${escapeHtml(investmentThesis.statement)}</p>
              <span class="fi-subhead">已验证信号</span>
              <ul class="fi-signal-list">${signals}</ul>
              ${risks ? `<div class="fi-risk-boundary"><span>风险边界</span><ul>${risks}</ul></div>` : ""}
            </div>
            <aside class="fi-institution-panel">
              <span class="fi-subhead">机构公开理由</span>
              <div class="fi-institution-list" data-rationale-status="${escapeHtml(investmentThesis.institutional_rationale_status)}">${rationale}</div>
            </aside>
          </div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">02</span><h3>产品</h3></div>
            <span class="fi-section-note">产品形态与关键能力</span>
          </div>
          <div class="fi-product-list">${products}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">03</span><h3>目标客户</h3></div>
            <span class="fi-section-note">谁会采购或部署</span>
          </div>
          <div class="fi-target-list">${targets}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">04</span><h3>客户案例</h3></div>
            <span class="fi-section-note">仅呈现已公开确认的使用场景</span>
          </div>
          <div class="fi-customer-list">${customers}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">05</span><h3>关键数据</h3></div>
            <span class="fi-section-note">保留观察日期与证据</span>
          </div>
          <div class="fi-metric-list">${metrics}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">06</span><h3>竞争坐标</h3></div>
            <span class="fi-section-note">具体比较产品、场景、客户与融资</span>
          </div>
          <div class="fi-compare-wrap">
            <table class="fi-compare">
              <thead><tr><th>公司</th><th>产品 / 方案</th><th>应用场景</th><th>目标客户</th><th>融资</th><th>已证实差异</th></tr></thead>
              <tbody>
                <tr class="fi-compare-primary">
                  <th scope="row">${escapeHtml(card.company?.name)}</th>
                  <td>${productNames}</td>
                  <td>${escapeHtml(primaryScenario)}</td>
                  <td>${escapeHtml(targetCustomers.join("；") || "未披露")}</td>
                  <td>${escapeHtml(card.financing?.amount || "未披露")} · ${escapeHtml(card.financing?.round || "未披露")}</td>
                  <td>当前研究主体</td>
                </tr>
                ${comparisons}
              </tbody>
            </table>
            ${comparisons ? "" : '<div class="fi-compare-empty">当前来源不足以支持逐字段竞品比较，因此不生成概括性套话。</div>'}
          </div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">07</span><h3>融资历史</h3></div>
            <span class="fi-section-note">关联数据中心正式融资事件</span>
          </div>
          <div class="fi-history-list">${fundingHistory}</div>
        </section>
        <section class="fi-section">
          <div class="fi-section-head">
            <div><span class="fi-section-index">08</span><h3>来源证据</h3></div>
            <span class="fi-section-note">${card.research_sources?.length || 0} 个已抓取来源</span>
          </div>
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
    dialog.scrollTop = 0;
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
      const companyCard = state.cards.find((card) => (
        [card.company?.entity_id, card.company?.application_entity_id].includes(state.companyId)
      ));
      if (companyCard) form.elements.namedItem("query").value = companyCard.company.name;
    }
    $("[data-latest-date]").textContent = data.meta?.latest_date ? `更新于 ${data.meta.latest_date}` : "暂无更新";
    fillSelect("round", data.filters?.rounds || []);
    fillSelect("market_category", data.filters?.market_categories || []);
    fillSelect("market_subcategory", data.filters?.market_subcategories || []);
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
    list.innerHTML = `<div class="fi-empty">暂时无法读取融资透视，请稍后重试。<small>${escapeHtml(error.message)}</small></div>`;
  });
})();
