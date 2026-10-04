// Identity first, then independent round confirmation and product/investor gaps.
// Amount is a hint, never required on every query: translated/undisclosed amounts
// and company aliases otherwise make an exact-query intersection lose the event.
export function planFundingResearch({ company, event = {}, amountHint = "", officialHost = "", chinese = false, maxQueries = 6, coverage = {} }) {
  const clean = (value) => String(value || "").replace(/["\r\n]/gu, " ").replace(/\s+/gu, " ").trim();
  const name = clean(company.canonical_name || company.name);
  if (name.length < 2) throw new Error("research_company_identity_required");
  const aliases = (company.aliases || []).map(clean).filter((alias) => alias.length > 1 && alias !== name);
  const short = name.replace(/[（(][^()（）]{1,12}[)）](?=(?:科技)?(?:有限责任公司|股份有限公司|有限公司)$)/u, "")
    .replace(/(?:科技)?(?:有限责任公司|股份有限公司|有限公司)$/u, "");
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
    .filter(row => !coverage[row.intent])
    .filter((row) => !seen.has(row.query) && seen.add(row.query)).slice(0, Math.max(1, Math.min(6, maxQueries)));
}

// Search planning hints only. They never become financial facts or source quotes.
// Same publisher and substantially identical syndicated bodies share one origin.
export function independentResearchSources(sources = []) {
  const groups=[];
  const normalized=s=>String(s.body_clean||s.body||'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
  for(const source of sources) {
    let host='';try{host=new URL(source.source_url||source.url).hostname.replace(/^www\./u,'');}catch{}
    const body=normalized(source);
    const matches=groups.filter(g=>g.some(previous=>{
      let previousHost='';try{previousHost=new URL(previous.source_url||previous.url).hostname.replace(/^www\./u,'');}catch{}
      const other=normalized(previous),shorter=body.length<other.length?body:other,longer=body.length<other.length?other:body;
      const chunks=shorter.length>=600?Array.from({length:Math.floor(shorter.length/80)},(_,i)=>shorter.slice(i*80,i*80+80)):[];
      const syndicated=chunks.length>=6&&chunks.filter(chunk=>longer.includes(chunk)).length/chunks.length>=0.85;
      return (host&&host===previousHost)||(shorter.length>=300&&longer.includes(shorter))||syndicated||(source.origin_url&&source.origin_url===previous.origin_url);
    }));
    if(matches.length) {const merged=[source,...matches.flat()];for(const group of matches)groups.splice(groups.indexOf(group),1);groups.push(merged);}else groups.push([source]);
  }
  return groups;
}
export function fundingResearchCoverage(sources=[],company={}) {
  const names=[company.canonical_name,...(company.aliases||[])].filter(Boolean).map(s=>s.toLowerCase());
  const related=sources.filter(s=>names.some(name=>(s.body_clean||'').toLowerCase().includes(name)));
  const funding=related.filter(s=>/融资|获投|\b(?:raises|raised|funding|series\s+[a-z]|seed round)\b/iu.test(s.body_clean));
  const confirmed=independentResearchSources(funding).length>=2;
  const official=related.filter(s=>s.source_class==='official_candidate');
  return {
    event_discovery:confirmed, funding:confirmed,
    product:official.some(s=>/\b(?:product|platform|customers?|provides|develops)\b|产品|平台|客户/iu.test(s.body_clean))
      && related.some(s=>/\b(?:founder|founded|headquarter)\b|创始人|成立于|总部/iu.test(s.body_clean)),
    investor_rationale:related.some(s=>/why we invested|why we are investing|投资理由|投资逻辑|领投.{0,80}表示/iu.test(s.body_clean)),
  };
}
