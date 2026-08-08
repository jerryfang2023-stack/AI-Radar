(() => {
  const formatNumber = new Intl.NumberFormat("zh-CN");

  function escapeHtml(value = "") {
    return String(value).replace(/[&<>'"]/gu, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[character]);
  }

  function safeInternalUrl(value = "") {
    try {
      const url = new URL(value, window.location.href);
      return url.origin === window.location.origin ? `${url.pathname.split("/").at(-1)}${url.search}${url.hash}` : "";
    } catch {
      return "";
    }
  }

  function renderMetrics(metrics = {}) {
    document.querySelectorAll("[data-metric]").forEach((element) => {
      const value = Number(metrics[element.dataset.metric]);
      element.textContent = Number.isFinite(value) ? formatNumber.format(value) : "—";
    });
  }

  function renderChart(rows = []) {
    const chart = document.querySelector("[data-weekly-chart]");
    if (!rows.length) {
      chart.innerHTML = '<div class="home-empty">暂无近八周融资披露</div>';
      return;
    }
    const max = Math.max(1, ...rows.map((row) => Number(row.count) || 0));
    chart.innerHTML = `<ol class="home-chart-list" aria-label="近八周融资事件数量">
      ${rows.map((row, index) => {
        const count = Math.max(0, Number(row.count) || 0);
        const ratio = Math.max(.025, count / max);
        return `<li title="${escapeHtml(row.start)} 至 ${escapeHtml(row.end)}：${count} 个融资事件">
          <span class="home-chart-value">${count}</span>
          <span class="home-chart-bar" style="--ratio:${ratio};--index:${index}" aria-hidden="true"></span>
          <span class="home-chart-date">${escapeHtml(row.label)}</span>
        </li>`;
      }).join("")}
    </ol>`;
  }

  function investorText(deal) {
    if (!deal.investors?.length) return deal.investor_disclosure_status === "not_disclosed" ? "投资方未披露" : "具体投资方待核验";
    const names = deal.investors.map((item) => `${item.name}（${item.role}）`);
    if (deal.additional_investor_count) names.push(`另有 ${deal.additional_investor_count} 家`);
    return names.join("、");
  }

  function renderDeals(deals = []) {
    const list = document.querySelector("[data-deal-list]");
    if (!deals.length) {
      list.innerHTML = '<div class="home-empty">暂无可公开的融资事件</div>';
      return;
    }
    list.innerHTML = deals.map((deal) => {
      const url = safeInternalUrl(deal.link);
      return `<a class="home-deal" href="${escapeHtml(url || "funding-insights.html")}">
        <div class="home-deal-date">${escapeHtml(deal.announced_at || "日期未披露")}<br><span class="home-deal-source">${formatNumber.format(Number(deal.source_count) || 0)} 个来源</span></div>
        <div class="home-deal-company"><strong>${escapeHtml(deal.company)}</strong><span>${escapeHtml(deal.market_category || "待分类")} · ${escapeHtml(deal.round)}</span></div>
        <div class="home-deal-amount"><strong>${escapeHtml(deal.amount_display)}</strong><span>原文：${escapeHtml(deal.amount_original || "未披露")}</span></div>
        <div class="home-deal-investors"><span>${escapeHtml(investorText(deal))}</span></div>
        <span class="home-deal-arrow" aria-hidden="true">→</span>
      </a>`;
    }).join("");
  }

  function renderInvestors(investors = []) {
    const list = document.querySelector("[data-investor-list]");
    if (!investors.length) {
      list.innerHTML = '<div class="home-empty">暂无证据完整的投资主体</div>';
      return;
    }
    list.innerHTML = investors.map((investor) => {
      const url = safeInternalUrl(investor.link);
      return `<a class="home-investor" href="${escapeHtml(url || "data-center.html?view=index")}">
        <span class="home-investor-meta">${escapeHtml(investor.investor_kind || "投资方")} · ${escapeHtml(investor.latest_disclosed_at || "")}</span>
        <h3>${escapeHtml(investor.name)}</h3>
        <p>${formatNumber.format(Number(investor.current_round_count) || 0)} 条本轮活动 · ${formatNumber.format(Number(investor.portfolio_company_count) || 0)} 家被投公司</p>
      </a>`;
    }).join("");
  }

  async function init() {
    const response = await fetch("data/homepage-v1.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    renderMetrics(data.metrics);
    renderChart(data.weekly_financing_counts);
    renderDeals(data.latest_deals);
    renderInvestors(data.featured_investors);
    const asof = document.querySelector("[data-asof]");
    asof.textContent = data.meta?.latest_date
      ? `数据更新至 ${data.meta.latest_date} · 所有公开条目通过来源与引文门禁`
      : "当前没有可公开的数据日期";
  }

  init().catch((error) => {
    document.querySelector("[data-weekly-chart]").innerHTML = '<div class="home-empty">融资趋势暂时无法读取</div>';
    document.querySelector("[data-deal-list]").innerHTML = '<div class="home-empty">最新融资暂时无法读取，请稍后重试</div>';
    document.querySelector("[data-investor-list]").innerHTML = '<div class="home-empty">投资主体暂时无法读取，请稍后重试</div>';
    document.querySelector("[data-asof]").textContent = `数据加载失败：${error.message}`;
  });
})();
