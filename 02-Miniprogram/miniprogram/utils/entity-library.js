function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function appendUnique(items, value) {
  const next = String(value || "").trim();
  if (next && !items.includes(next)) items.push(next);
}

function buildEntityLibrary(cards = [], details = {}) {
  const companies = new Map();
  const investors = new Map();
  const sortedCards = [...cards].sort((left, right) => String(right.date || "").localeCompare(String(left.date || "")));

  sortedCards.forEach((card) => {
    const companyName = String(card.company || "未披露公司").trim();
    const company = companies.get(companyName) || {
      key: companyName,
      name: companyName,
      initial: companyName.slice(0, 1).toUpperCase(),
      headquarters: card.headquarters || "总部未披露",
      products: [],
      categories: [],
      roundCount: 0,
      latestAmount: card.amount || "金额未披露",
      latestDate: card.date || "",
      latestRound: card.round || "轮次未披露",
      latestId: card.id,
    };
    company.roundCount += 1;
    (card.products || []).forEach((item) => appendUnique(company.products, item));
    appendUnique(company.categories, card.category);
    appendUnique(company.categories, card.subcategory);
    companies.set(companyName, company);

    const names = (details[card.id]?.investors || []).map((item) => item.name).filter(Boolean);
    const investorNames = names.length ? names : [card.leadInvestor].filter(Boolean);
    investorNames.forEach((investorName) => {
      const investor = investors.get(investorName) || {
        key: investorName,
        name: investorName,
        initial: investorName.slice(0, 1).toUpperCase(),
        companies: [],
        categories: [],
        roundCount: 0,
        leadCount: 0,
        latestDate: card.date || "",
        latestId: card.id,
      };
      investor.roundCount += 1;
      if (investorName === card.leadInvestor) investor.leadCount += 1;
      appendUnique(investor.companies, companyName);
      appendUnique(investor.categories, card.category);
      appendUnique(investor.categories, card.subcategory);
      investors.set(investorName, investor);
    });
  });

  return {
    companies: Array.from(companies.values()).map((item) => ({
      ...item,
      secondary: [item.headquarters, item.products.slice(0, 2).join("、")].filter(Boolean).join(" · "),
      categoriesText: item.categories.slice(0, 2).join(" · "),
      searchText: normalize([item.name, item.headquarters, ...item.products, ...item.categories].join(" ")),
    })).sort((left, right) => String(right.latestDate).localeCompare(String(left.latestDate))),
    investors: Array.from(investors.values()).map((item) => ({
      ...item,
      companiesText: item.companies.slice(0, 3).join("、") || "已投企业未披露",
      categoriesText: item.categories.slice(0, 2).join(" · "),
      searchText: normalize([item.name, ...item.companies, ...item.categories].join(" ")),
    })).sort((left, right) => right.roundCount - left.roundCount || String(right.latestDate).localeCompare(String(left.latestDate))),
  };
}

function filterEntities(items, keyword) {
  const query = normalize(keyword);
  return query ? items.filter((item) => item.searchText.includes(query)) : items;
}

module.exports = { buildEntityLibrary, filterEntities };
