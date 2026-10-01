// Identity first, then independent round confirmation and product/investor gaps.
// Amount is a hint, never required on every query: translated/undisclosed amounts
// and company aliases otherwise make an exact-query intersection lose the event.
export function planFundingResearch({ company, event = {}, amountHint = "", officialHost = "", chinese = false, maxQueries = 6 }) {
  const clean = (value) => String(value || "").replace(/["\r\n]/gu, " ").replace(/\s+/gu, " ").trim();
  const name = clean(company.canonical_name || company.name);
  if (name.length < 2) throw new Error("research_company_identity_required");
  const aliases = (company.aliases || []).map(clean).filter((alias) => alias.length > 1 && alias !== name);
  const short = name.replace(/(?:科技)?(?:有限责任公司|股份有限公司|有限公司)$/u, "");
  if (short.length > 1 && short !== name) aliases.unshift(short);
  const year = clean(event.disclosed_at || event.event_time).slice(0, 4);
  const dateHint = /^\d{4}$/u.test(year) ? year : "";
  const site = /^[a-z0-9.-]+\.[a-z]{2,}$/iu.test(officialHost) ? `site:${officialHost} ` : "";
  const rows = chinese ? [
    ["event_discovery", `"${name}" ${dateHint} 融资 投资方`],
    ["funding", `"${aliases[0] || name}" ${clean(amountHint)} 融资 领投 跟投`],
    ["product", `${site}"${name}" 官网 产品 服务`],
    ["investor_rationale", `"${name}" 投资机构 融资用途`],
    ["funding", `"${aliases[0] || name}" ${dateHint} 本轮融资 公告`],
    ["product", `"${name}" 客户 创始人 总部`],
  ] : [
    ["event_discovery", `"${name}" ${dateHint} funding round investors`],
    ["funding", `"${aliases[0] || name}" ${clean(amountHint)} funding announcement`],
    ["product", `${site}"${name}" official product customers`],
    ["investor_rationale", `"${name}" "why we invested"`],
    ["funding", `"${aliases[0] || name}" ${dateHint} raises led by`],
    ["product", `"${name}" founders headquarters product`],
  ];
  const seen = new Set();
  return rows.map(([intent, query]) => ({ intent, query: query.replace(/\s+/gu, " ").trim() }))
    .filter((row) => !seen.has(row.query) && seen.add(row.query)).slice(0, Math.max(1, Math.min(6, maxQueries)));
}
