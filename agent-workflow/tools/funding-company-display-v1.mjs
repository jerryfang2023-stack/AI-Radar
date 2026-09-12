const compact = value => String(value || "").replace(/\s+/gu, "").trim();
const legalName = value => /(?:有限公司|有限责任公司|股份公司)$/u.test(value);

export function fundingCompanyDisplayName(card, aliases = []) {
  const company = card.company || {};
  const current = String(company.name || company.full_name || "").trim();
  if (!legalName(current)) return current;
  const names = [...new Set([company.full_name, company.name].map(compact).filter(Boolean))];
  const quotes = [...(company.evidence_refs || []), ...(card.financing?.evidence_refs || [])].map(ref => compact(ref.quote));
  for (const quote of quotes) {
    for (const name of names) {
      const at = quote.indexOf(name);
      if (at < 0) continue;
      const match = quote.slice(at + name.length).match(/^[（(](?:以下简称|简称|下称)[:：为]?[“"'「『]?([^”"'」』)）]{1,30})[”"'」』]?[)）]/u);
      const short = match?.[1]?.trim();
      if (short && short.length < current.length && !legalName(short)) return short;
    }
  }
  const entry = aliases.find(item => [item.canonical_name, ...(item.aliases || []), ...(item.legal_names || [])].some(name => names.includes(compact(name))));
  if (entry) {
    const candidates = [entry.canonical_name, ...(entry.aliases || [])].filter(name => name && !legalName(name) && name.length < current.length);
    return candidates.find(name => /[\u3400-\u9fff]/u.test(name)) || candidates[0] || current;
  }
  return current;
}
