// Use the reviewed public index only; no protected detail or demo copy.
const { isFundingVisible } = require("./funding-visibility.js");
const { companyDisplayName } = require('./company-display.js');
function chinaDate(now = new Date()) {
  return new Date(now.getTime() + 8 * 3600000).toISOString().slice(0, 10);
}
function selectFeatured(cards, market, today = chinaDate(), observations = {}) {
  const visible = cards.filter(c => c.marketRegion === market && isFundingVisible(c) && !["", "未分类", "未披露"].includes(c.subcategory || c.category || "") && /^\d{4}-\d{2}-\d{2}$/.test(c.date || "") && c.date <= today);
  const latest = visible.reduce((date, c) => c.date > date ? c.date : date, "");
  const seen = new Set();
  const selected = [...visible].sort((a,b) => b.date.localeCompare(a.date) || String(a.id).localeCompare(String(b.id))).filter(c => {
    if (!c.id || seen.has(c.id)) return false;
    seen.add(c.id); return true;
  }).slice(0, 3).map(c => {
    const product = (c.products || []).find(p => typeof p === "string" && p.trim() && p !== c.company) || "";
    const sector = c.subcategory || c.category || "";
    const observation = observations[c.id] || "";
    return { id: c.id, date:c.date, dateShort:c.date.slice(5), company: companyDisplayName(c.company,c.marketRegion), product: product.startsWith(c.company + " ") ? product.slice(c.company.length).trim() : product, amount: c.amount || "金额未披露", round: c.round || "轮次未披露", sector, observation };
  });
  return { cards: selected, date: latest, label: latest && latest !== today ? `最近披露 · ${latest.slice(5)}` : "" };
}
module.exports = { selectFeatured, chinaDate };
