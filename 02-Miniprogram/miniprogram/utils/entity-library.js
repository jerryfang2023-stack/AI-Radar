function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function appendUnique(items, value) {
  const next = String(value || "").trim();
  if (next && !items.includes(next)) items.push(next);
}

function entityKey(value) {
  return normalize(value);
}

function companyEntityKey(name) {
  return entityKey(name);
}

function investorEntityKey(name) {
  return entityKey(name);
}

function personEntityKey(founder, companyName) {
  return founder.id ? `id:${founder.id}` : `${entityKey(founder.name)}|${companyEntityKey(companyName)}`;
}

function buildEntityLibrary(cards = [], details = {}) {
  const companies = new Map();
  const investors = new Map();
  const people = new Map();
  const sortedCards = [...cards].sort((left, right) => String(right.date || "").localeCompare(String(left.date || "")));

  sortedCards.forEach((card) => {
    const detail = details[card.id] || {};
    const companyName = String(card.company || "未披露公司").trim();
    const companyId = companyEntityKey(companyName);
    const company = companies.get(companyId) || {
      key: companyId,
      type: "companies",
      name: companyName,
      initial: companyName.slice(0, 1).toUpperCase(),
      summary: detail.companySummary || card.summary || "企业介绍暂未披露",
      website: detail.website || "",
      headquarters: card.headquarters || "总部未披露",
      products: [],
      categories: [],
      investors: [],
      founders: [],
      rounds: [],
      latestAmount: card.amount || "金额未披露",
      latestDate: card.date || "",
      latestRound: card.round || "轮次未披露",
    };
    company.rounds.push({ id: card.id, date: card.date, round: card.round, amount: card.amount });
    (card.products || []).forEach((item) => appendUnique(company.products, item));
    (detail.investors || []).forEach((item) => appendUnique(company.investors, item.name));
    (detail.founders || []).forEach((item) => {
      if (!company.founders.some((founder) => founder.name === item.name)) company.founders.push({ id: item.id || "", name: item.name, role: item.role || "创始团队" });
    });
    appendUnique(company.categories, card.category);
    appendUnique(company.categories, card.subcategory);
    companies.set(companyId, company);

    const detailInvestors = (detail.investors || []).filter((item) => item.name);
    const investorRows = detailInvestors.length ? detailInvestors : card.leadInvestor && card.leadInvestor !== "投资方未披露" ? [{ name: card.leadInvestor, role: "" }] : [];
    const seenInvestors = new Set();
    investorRows.forEach((row) => {
      const investorName = String(row.name || "").trim();
      const investorId = investorEntityKey(investorName);
      if (!investorId || seenInvestors.has(investorId)) return;
      seenInvestors.add(investorId);
      const investor = investors.get(investorId) || {
        key: investorId,
        type: "investors",
        name: investorName,
        initial: investorName.slice(0, 1).toUpperCase(),
        companies: [],
        categories: [],
        rounds: [],
        leadCount: 0,
        latestDate: card.date || "",
      };
      investor.rounds.push({ id: card.id, company: companyName, date: card.date, round: card.round, amount: card.amount, role: row.role || "参投" });
      if (/领投|lead/i.test(row.role || "") || investorName === card.leadInvestor) investor.leadCount += 1;
      appendUnique(investor.companies, companyName);
      appendUnique(investor.categories, card.category);
      appendUnique(investor.categories, card.subcategory);
      investors.set(investorId, investor);
    });

    (detail.founders || []).forEach((founderRow) => {
      const personName = String(founderRow.name || "").trim();
      const personId = personEntityKey(founderRow, companyName);
      if (!personId) return;
      const person = people.get(personId) || {
        key: personId,
        type: "people",
        name: personName,
        initial: personName.slice(0, 1).toUpperCase(),
        roles: [],
        companies: [],
        categories: [],
        rounds: [],
        latestDate: card.date || "",
      };
      appendUnique(person.roles, founderRow.role || "创始团队");
      appendUnique(person.companies, companyName);
      appendUnique(person.categories, card.category);
      appendUnique(person.categories, card.subcategory);
      if (!person.rounds.some((round) => round.id === card.id)) person.rounds.push({ id: card.id, company: companyName, date: card.date, round: card.round, amount: card.amount });
      people.set(personId, person);
    });
  });

  const companyItems = Array.from(companies.values()).map((item) => ({
    ...item,
    roundCount: item.rounds.length,
    investorCount: item.investors.length,
    founderCount: item.founders.length,
    productsText: item.products.join("、") || "暂未披露",
    categoriesFullText: item.categories.join("、") || "暂未分类",
    investorsText: item.investors.join("、"),
    investorLinks: item.investors.map((name) => ({ name, key: investorEntityKey(name) })),
    founders: item.founders.map((founder) => ({ ...founder, key: personEntityKey(founder, item.name) })),
    secondary: [item.headquarters, item.products.slice(0, 2).join("、")].filter(Boolean).join(" · "),
    categoriesText: item.categories.slice(0, 2).join(" · "),
    searchText: normalize([item.name, item.summary, item.headquarters, ...item.products, ...item.categories].join(" ")),
  })).sort((left, right) => String(right.latestDate).localeCompare(String(left.latestDate)));

  const investorItems = Array.from(investors.values()).map((item) => ({
    ...item,
    roundCount: item.rounds.length,
    companyCount: item.companies.length,
    companiesText: item.companies.slice(0, 3).join("、") || "已投企业未披露",
    companyLinks: item.companies.map((name) => ({ name, key: companyEntityKey(name) })),
    categoriesFullText: item.categories.join("、") || "暂未分类",
    categoriesText: item.categories.slice(0, 2).join(" · "),
    categoriesFullText: item.categories.join("、") || "暂未分类",
    searchText: normalize([item.name, ...item.companies, ...item.categories].join(" ")),
  })).sort((left, right) => right.roundCount - left.roundCount || right.leadCount - left.leadCount || String(right.latestDate).localeCompare(String(left.latestDate)));

  const peopleItems = Array.from(people.values()).map((item) => ({
    ...item,
    roundCount: item.rounds.length,
    companyCount: item.companies.length,
    roleText: item.roles.join("、") || "创始团队",
    companiesText: item.companies.join("、"),
    companyLinks: item.companies.map((name) => ({ name, key: companyEntityKey(name) })),
    categoriesText: item.categories.slice(0, 2).join(" · "),
    searchText: normalize([item.name, ...item.roles, ...item.companies, ...item.categories].join(" ")),
  })).sort((left, right) => right.companyCount - left.companyCount || String(right.latestDate).localeCompare(String(left.latestDate)) || left.name.localeCompare(right.name));

  return { companies: companyItems, investors: investorItems, people: peopleItems };
}

function filterEntities(items, keyword) {
  const query = normalize(keyword);
  return query ? items.filter((item) => item.searchText.includes(query)) : items;
}

function findEntity(library, type, key) {
  return (library[type] || []).find((item) => item.key === normalize(key));
}

module.exports = { buildEntityLibrary, filterEntities, findEntity, companyEntityKey, investorEntityKey, personEntityKey };
