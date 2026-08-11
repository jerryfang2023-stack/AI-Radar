const DAY_MS = 24 * 60 * 60 * 1000;

function normalize(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function dateThreshold(latestDate, period) {
  if (period === "all") return "";
  const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const anchor = new Date(`${latestDate}T00:00:00Z`);
  return new Date(anchor.getTime() - days * DAY_MS).toISOString().slice(0, 10);
}

function filterCards(cards, filters, latestDate) {
  const keyword = normalize(filters.keyword);
  const threshold = dateThreshold(latestDate, filters.period);
  return cards.filter((card) => {
    if (keyword) {
      const haystack = normalize([card.company, card.summary, card.category, card.subcategory, card.productForm, card.leadInvestor, card.investorsText].join(" "));
      if (!haystack.includes(keyword)) return false;
    }
    if (threshold && card.date < threshold) return false;
    if (filters.region !== "all" && card.region !== filters.region) return false;
    if (filters.roundGroup !== "all" && card.roundGroup !== filters.roundGroup) return false;
    if (filters.categoryId !== "all" && card.categoryId !== filters.categoryId) return false;
    if (filters.evidenceId !== "all" && card.evidenceId !== filters.evidenceId) return false;
    return true;
  });
}

function sortCards(cards, sort) {
  const result = [...cards];
  if (sort === "amount") result.sort((a, b) => b.amountValue - a.amountValue || b.date.localeCompare(a.date));
  else if (sort === "company") result.sort((a, b) => a.company.localeCompare(b.company, "zh-CN"));
  else result.sort((a, b) => b.date.localeCompare(a.date) || b.amountValue - a.amountValue);
  return result;
}

function activeFilterCount(filters) {
  return [filters.period !== "all", filters.region !== "all", filters.roundGroup !== "all", filters.categoryId !== "all", filters.evidenceId !== "all"].filter(Boolean).length;
}

function exportSummary(cards) {
  return ["公司,轮次,金额,日期,领投/首位投资方,市场类别", ...cards.map((card) => [card.company, card.round, card.amount, card.date, card.leadInvestor, card.category].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))].join("\n");
}

module.exports = { filterCards, sortCards, activeFilterCount, exportSummary, dateThreshold };
