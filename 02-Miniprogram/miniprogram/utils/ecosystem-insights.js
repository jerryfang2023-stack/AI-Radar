const DAY_MS = 24 * 60 * 60 * 1000;

const text = (value) => String(value == null ? "" : value).trim();

function marketCards(cards, marketRegion) {
  return (cards || []).filter((card) => marketRegion === "china" ? card.marketRegion === "china" : card.marketRegion === "global");
}

function sectorName(card) {
  return text(card.subcategory) || text(card.category) || "其他 AI";
}

function monthKey(value) { return text(value).slice(0, 7); }

function monthKeys(latestDate, count = 6) {
  const anchor = new Date(`${latestDate}T00:00:00Z`);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - (count - index - 1), 1));
    return date.toISOString().slice(0, 7);
  });
}

function threshold(latestDate, days) {
  const anchor = new Date(`${latestDate}T00:00:00Z`);
  return new Date(anchor.getTime() - days * DAY_MS).toISOString().slice(0, 10);
}

function groupSectors(cards) {
  const groups = new Map();
  cards.forEach((card) => {
    const name = sectorName(card);
    if (!groups.has(name)) groups.set(name, []);
    groups.get(name).push(card);
  });
  return [...groups.entries()].map(([name, items]) => ({ name, cards: items, count: items.length }));
}

function share(count, total) { return total ? (count / total) * 100 : 0; }

function signalCard(kind, group, value, note) {
  return {
    kind,
    sector: group?.name || "暂无数据",
    value,
    note,
    eyebrow: kind === "primary" ? "最热 · 近 6 个月" : kind === "rise" ? "近 90 天升温" : "近 90 天降温",
  };
}

function buildSignals(cards, latestDate) {
  const sixMonthStart = monthKeys(latestDate, 6)[0];
  const recentStart = threshold(latestDate, 89);
  const priorStart = threshold(latestDate, 179);
  const sixMonthCards = cards.filter((card) => monthKey(card.date) >= sixMonthStart);
  const currentCards = cards.filter((card) => card.date >= recentStart);
  const priorCards = cards.filter((card) => card.date >= priorStart && card.date < recentStart);
  const hottest = groupSectors(sixMonthCards).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"))[0];
  const names = new Set([...groupSectors(currentCards).map((item) => item.name), ...groupSectors(priorCards).map((item) => item.name)]);
  const changes = [...names].map((name) => {
    const current = currentCards.filter((card) => sectorName(card) === name).length;
    const prior = priorCards.filter((card) => sectorName(card) === name).length;
    const currentShare = share(current, currentCards.length);
    const priorShare = share(prior, priorCards.length);
    return { name, cards: cards.filter((card) => sectorName(card) === name), current, prior, currentShare, priorShare, delta: currentShare - priorShare };
  });
  const rising = [...changes].sort((a, b) => b.delta - a.delta)[0];
  const cooling = [...changes].sort((a, b) => a.delta - b.delta)[0];
  return [
    signalCard("primary", hottest, hottest?.count || 0, `${share(hottest?.count || 0, sixMonthCards.length).toFixed(1)}% · 近 6 个月`),
    signalCard("rise", rising, `${rising?.delta >= 0 ? "+" : ""}${(rising?.delta || 0).toFixed(1)}`, `近期 ${rising?.currentShare.toFixed(1) || "0.0"}% · 前期 ${rising?.priorShare.toFixed(1) || "0.0"}%`),
    signalCard("cool", cooling, `${(cooling?.delta || 0).toFixed(1)}`, `近期 ${cooling?.currentShare.toFixed(1) || "0.0"}% · 前期 ${cooling?.priorShare.toFixed(1) || "0.0"}%`),
  ];
}

function buildOverview(index, marketRegion = "global") {
  const cards = marketCards(index.cards, marketRegion);
  const months = monthKeys(index.meta.latestDate, 6);
  const rangeCards = cards.filter((card) => months.includes(monthKey(card.date)));
  const ranking = groupSectors(rangeCards)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "zh-CN"))
    .slice(0, 5)
    .map((group, index) => ({
      rank: String(index + 1).padStart(2, "0"),
      sector: group.name,
      count: group.count,
      width: 0,
    }));
  const max = ranking[0]?.count || 1;
  ranking.forEach((item) => { item.width = Math.max(12, Math.round((item.count / max) * 100)); });
  const heatmap = ranking.map((item) => ({
    sector: item.sector,
    cells: months.map((month) => rangeCards.filter((card) => sectorName(card) === item.sector && monthKey(card.date) === month).length),
  }));
  const heatMax = Math.max(1, ...heatmap.flatMap((row) => row.cells));
  heatmap.forEach((row) => {
    row.cells = row.cells.map((count, index) => ({ key: `${row.sector}:${months[index]}`, count, level: count ? Math.max(1, Math.min(5, Math.ceil((count / heatMax) * 5))) : 0 }));
  });
  return {
    latestDate: index.meta.latestDate,
    marketRegion,
    signals: buildSignals(cards, index.meta.latestDate),
    ranking,
    months: months.map((item) => item.slice(5)),
    heatmap,
  };
}

function buildSector(index, details, sector, marketRegion = "global") {
  const cards = marketCards(index.cards, marketRegion).filter((card) => sectorName(card) === sector);
  const companyMap = new Map();
  cards.forEach((card) => {
    const current = companyMap.get(card.company);
    if (!current || card.date > current.date) companyMap.set(card.company, card);
  });
  const companies = [...companyMap.values()].sort((a, b) => b.date.localeCompare(a.date));
  const investors = new Map();
  cards.forEach((card) => {
    const detail = details?.[card.id];
    (detail?.investors || []).forEach((item) => investors.set(item.name, (investors.get(item.name) || 0) + 1));
  });
  return {
    sector,
    marketRegion,
    eventCount: cards.length,
    companyCount: companies.length,
    investorCount: investors.size,
    companies,
    investors: [...investors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count })),
  };
}

module.exports = { buildOverview, buildSector, marketCards, sectorName, monthKeys };
