(() => {
  const DATA_URL = "data/trend-radar-v1.json";
  const labels = { financing: "融资与并购", deployment: "部署与案例", partnership: "商业合作", product: "产品与服务", hardware: "AI 硬件" };
  const state = { data: null, period: "day", key: "", category: "all" };
  const content = document.querySelector("[data-content]");
  const status = document.querySelector("[data-status]");
  const select = document.querySelector("[data-period-key]");

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
  const event = (id) => state.data.events[id];
  const entity = (id) => state.data.entities[id];
  const formatWeek = (record) => `${record.start} — ${record.end}`;
  const formatOption = (period, key) => period === "day" ? key : period === "week" ? formatWeek(state.data.periods.week.records[key]) : key;
  const eventRow = (item) => `<div class="tr-row"><span class="tr-row-type">${escapeHtml(labels[item.category] || item.eventTypeLabel)}</span><div class="tr-row-main"><a href="${escapeHtml(item.detailUrl)}">${escapeHtml(item.title)}</a></div><a class="tr-source" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(item.publisher || "原始来源")} ↗</a></div>`;
  const eventList = (ids) => ids.length ? `<div class="tr-list">${ids.map((id) => event(id)).filter(Boolean).map(eventRow).join("")}</div>` : `<div class="tr-empty">当前观察期没有对应记录。</div>`;
  const summary = (counts, active = "all", interactive = false) => `<div class="tr-summary">${Object.entries(labels).map(([key, label]) => interactive ? `<button class="tr-stat${active === key ? " is-active" : ""}" type="button" data-category="${key}"><span>${label}</span><strong>${counts[key] || 0}</strong></button>` : `<div class="tr-stat"><span>${label}</span><strong>${counts[key] || 0}</strong></div>`).join("")}</div>`;

  function renderDay(record) {
    const ids = record.eventIds.filter((id) => state.category === "all" || event(id)?.category === state.category);
    return `${summary(record.counts, state.category, true)}<section class="tr-section"><div class="tr-section-head"><h2>${state.category === "all" ? "当日变化" : labels[state.category]}</h2><span class="tr-section-note">${ids.length} 条</span></div>${eventList(ids)}</section><p class="tr-coverage">${escapeHtml(record.coverage)} 另有 ${record.otherCount} 条已接受事件不属于五类变化，未混入本栏目。</p>`;
  }

  function entityItems(items) {
    return items.length ? `<ul class="tr-card-list">${items.map((item) => { const value = entity(item.entityId); const sourceEvent = event(item.eventIds[0]); return value && sourceEvent ? `<li><a href="${escapeHtml(value.detailUrl)}">${escapeHtml(value.name)}</a><small>${item.eventIds.length} 条变化 · ${item.categoryCount} 类 · <a href="${escapeHtml(sourceEvent.detailUrl)}">关联事件</a> · <a href="${escapeHtml(sourceEvent.sourceUrl)}" target="_blank" rel="noopener">原始来源 ↗</a></small></li>` : ""; }).join("")}</ul>` : `<p>当前观察期没有满足“至少两条且跨两类变化”的实体。</p>`;
  }

  function simpleEventItems(ids) {
    return ids.length ? `<ul class="tr-card-list">${ids.slice(0, 12).map((id) => { const item = event(id); return item ? `<li><a href="${escapeHtml(item.detailUrl)}">${escapeHtml(item.title)}</a><small><a href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(item.publisher || "原始来源")} ↗</a></small></li>` : ""; }).join("")}</ul>` : `<p>当前观察期没有对应记录。</p>`;
  }

  function renderWeek(record) {
    const productItems = record.productsEnteringUse.map((item) => ({ ...item, value: entity(item.entityId), customer: entity(item.customerEntityId), event: event(item.eventId) })).filter((item) => item.value && item.event);
    const classifications = record.newClassifications.slice(0, 12);
    return `${summary(record.counts)}<section class="tr-section"><div class="tr-section-head"><h2>本周结构变化</h2><span class="tr-section-note">观测 ${record.observedDataDays.length} 个数据批次日</span></div><div class="tr-grid"><article class="tr-card"><h3>连续变化实体</h3>${entityItems(record.activeEntities)}</article><article class="tr-card"><h3>新增部署</h3>${simpleEventItems(record.deploymentEventIds)}</article><article class="tr-card"><h3>产品进入客户使用</h3>${productItems.length ? `<ul class="tr-card-list">${productItems.map((item) => `<li><a href="${escapeHtml(item.value.detailUrl)}">${escapeHtml(item.value.name)}</a>${item.customer ? ` → <a href="${escapeHtml(item.customer.detailUrl)}">${escapeHtml(item.customer.name)}</a>` : ""}<small><a href="${escapeHtml(item.event.detailUrl)}">关联事件</a> · <a href="${escapeHtml(item.event.sourceUrl)}" target="_blank" rel="noopener">原始来源 ↗</a></small></li>`).join("")}</ul>` : `<p>当前观察期没有经过 RELATION-V2 验证的产品服务客户关系。</p>`}</article><article class="tr-card"><h3>新增分类关联</h3>${classifications.length ? `<ul class="tr-card-list">${classifications.map((item) => { const value = entity(item.entityId); const sourceEvent = event(item.eventId); return value && sourceEvent ? `<li><a href="${escapeHtml(value.detailUrl)}">${escapeHtml(value.name)}</a> · ${escapeHtml(item.classification.name)}<small><a href="${escapeHtml(sourceEvent.detailUrl)}">关联事件</a> · <a href="${escapeHtml(sourceEvent.sourceUrl)}" target="_blank" rel="noopener">原始来源 ↗</a></small></li>` : ""; }).join("")}</ul>` : `<p>当前观察期没有新的分类关联。</p>`}</article></div></section><p class="tr-coverage">${escapeHtml(record.coverage)} 覆盖日期：${escapeHtml(record.observedDataDays.join("、"))}</p>`;
  }

  function distribution(title, items) {
    return `<article class="tr-card"><h3>${title}</h3>${items.length ? `<ul class="tr-card-list">${items.slice(0, 10).map((item) => `<li>${escapeHtml(item.name)}<small>${item.count} 条事件 · <a href="${escapeHtml(event(item.eventIds[0]).detailUrl)}">查看证据</a></small></li>`).join("")}</ul>` : `<p>当前观察期没有对应分类记录。</p>`}</article>`;
  }

  function renderMonth(record) {
    const rows = Object.entries(labels).map(([key, label]) => `<tr><td>${label}</td><td>${record.counts[key]}</td><td>${record.comparisonAvailable ? record.previousCounts[key] : "—"}</td><td class="tr-delta">${record.comparisonAvailable ? `${record.deltas[key] > 0 ? "+" : ""}${record.deltas[key]}` : "—"}</td></tr>`).join("");
    return `${summary(record.counts)}<section class="tr-section"><div class="tr-section-head"><h2>市场结构快照</h2><span class="tr-section-note">${record.comparisonAvailable ? `对比 ${escapeHtml(record.previousMonth)} 同期` : "无完整同期基线"}</span></div><table class="tr-table"><thead><tr><th>变化类型</th><th>本期</th><th>上月同期</th><th>差额</th></tr></thead><tbody>${rows}</tbody></table></section><section class="tr-section"><div class="tr-grid"><article class="tr-card"><h3>融资披露</h3><p>${record.financing.eventIds.length} 条融资与并购事件，其中 ${record.financing.disclosedMetricCount} 条披露数值信息。</p>${simpleEventItems(record.financing.eventIds)}</article><article class="tr-card"><h3>新增实体</h3><p>公司与机构 ${record.newCompanies.length} 个，产品 ${record.newProducts.length} 个。</p><ul class="tr-card-list">${[...record.newCompanies, ...record.newProducts].slice(0, 16).map((item) => { const value = entity(item.entityId); const sourceEvent = event(item.eventIds[0]); return value && sourceEvent ? `<li><a href="${escapeHtml(value.detailUrl)}">${escapeHtml(value.name)}</a><small>${escapeHtml(value.typeLabel)} · <a href="${escapeHtml(sourceEvent.detailUrl)}">首次关联事件</a> · <a href="${escapeHtml(sourceEvent.sourceUrl)}" target="_blank" rel="noopener">原始来源 ↗</a></small></li>` : ""; }).join("")}</ul></article>${distribution("技术分类", record.distributions.technology)}${distribution("使用场景", record.distributions.useCase)}${distribution("行业分布", record.distributions.industry)}<article class="tr-card"><h3>部署事件索引</h3>${simpleEventItems(record.deploymentEventIds)}</article></div></section><p class="tr-coverage">${escapeHtml(record.coverage)} 本期观测 ${record.observedDataDays.length} 个数据批次日。${record.comparisonAvailable ? `上月同期观测 ${record.comparisonWindow.previousObservedDataDays.length} 日。` : "同期覆盖不完整，因此不计算差额。"}</p>`;
  }

  function writeUrl() {
    const url = new URL(location.href);
    url.searchParams.set("period", state.period);
    url.searchParams.set("key", state.key);
    if (state.period === "day" && state.category !== "all") url.searchParams.set("category", state.category); else url.searchParams.delete("category");
    history.replaceState(null, "", url);
  }

  function render() {
    const block = state.data.periods[state.period];
    const record = block.records[state.key] || block.records[block.defaultKey];
    if (!record) { content.innerHTML = `<div class="tr-empty">暂无可用数据。</div>`; return; }
    state.key = record.key;
    document.querySelectorAll("[data-period]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.period === state.period)));
    select.innerHTML = block.options.map((key) => `<option value="${escapeHtml(key)}"${key === state.key ? " selected" : ""}>${escapeHtml(formatOption(state.period, key))}</option>`).join("");
    content.innerHTML = state.period === "day" ? renderDay(record) : state.period === "week" ? renderWeek(record) : renderMonth(record);
    status.textContent = "";
    writeUrl();
  }

  document.addEventListener("click", (click) => {
    const period = click.target.closest("[data-period]")?.dataset.period;
    if (period) { state.period = period; state.key = state.data.periods[period].defaultKey; state.category = "all"; render(); }
    const category = click.target.closest("[data-category]")?.dataset.category;
    if (category) { state.category = state.category === category ? "all" : category; render(); }
  });
  select?.addEventListener("change", () => { state.key = select.value; state.category = "all"; render(); });

  fetch(DATA_URL).then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); }).then((data) => {
    state.data = data;
    const url = new URL(location.href);
    const period = url.searchParams.get("period");
    state.period = ["day", "week", "month"].includes(period) ? period : "day";
    state.key = url.searchParams.get("key") || data.periods[state.period].defaultKey;
    state.category = url.searchParams.get("category") || "all";
    document.querySelector("[data-latest-date]").textContent = `数据更新至 ${data.meta.latestDataDate}`;
    render();
  }).catch((error) => { status.textContent = `数据读取失败：${error.message}`; });
})();
