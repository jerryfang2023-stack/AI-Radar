import { enrichFundingHistory } from '../../01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs';
// The public list is one card per reviewed funding subject. Event records remain
// independent inputs for histories and capital-flow statistics.
const normalized = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const unique = (rows, key) => [...new Map(rows.map(row => [key(row), row])).values()];
export function fundingSubjectKey(card, review = {}) {
  const id = card.company?.application_entity_id || card.company?.entity_id;
  const match = Object.entries(review.subjects || {}).find(([,row]) => row.application_ids?.includes(id));
  return match?.[0] || id || `name:${normalized(card.company?.full_name || card.company?.name)}`;
}
const latestFirst = (a,b) => String(b.financing?.announced_at || '').localeCompare(String(a.financing?.announced_at || ''))
  || String(a.funding_insight_id).localeCompare(String(b.funding_insight_id));

export function buildFundingSubjects(input, review = {}) {
  if (review.version && review.version !== 'FINANCING-CARD-REVIEW-1') throw new Error('invalid_financing_card_review');
  const originals = new Map(input.map(c => [c.funding_insight_id, c]));
  const duplicateIds = new Set();
  const events = new Map(input.map(c => [c.funding_insight_id, structuredClone(c)]));
  for (const row of review.duplicate_rounds || []) {
    if (!row.reason || !row.source_url || !row.canonical_id || !row.duplicate_ids?.length) throw new Error('invalid_reviewed_duplicate_round');
    const canonical = events.get(row.canonical_id);
    if (!canonical) continue;
    for (const id of row.duplicate_ids) {
      const duplicate = originals.get(id);if (!duplicate) continue;
      if (fundingSubjectKey(duplicate,review) !== fundingSubjectKey(canonical,review)) throw new Error('duplicate_round_subject_mismatch');
      canonical.source_event_ids = [...new Set([canonical.triggered_by_event_id,...canonical.source_event_ids||[],duplicate.triggered_by_event_id,...duplicate.source_event_ids||[]])];
      canonical.source_card_ids = [...new Set([canonical.funding_insight_id,...canonical.source_card_ids||[],id])];
      canonical.research_sources = unique([...canonical.research_sources||[],...duplicate.research_sources||[]],s=>s.source_id);
      canonical.products = [...canonical.products||[],...duplicate.products||[]];
      canonical.financing.disclosures = unique([...canonical.financing.disclosures||[],...duplicate.financing.disclosures||[]],r=>r.event_id);
      canonical.financing.evidence_refs = unique([...canonical.financing.evidence_refs||[],...duplicate.financing.evidence_refs||[]],r=>`${r.source_id}:${r.quote}`);
      duplicateIds.add(id);
    }
  }
  const eventCards = [...events.values()].filter(c=>!duplicateIds.has(c.funding_insight_id));
  const groups = new Map();
  for (const card of eventCards) {
    const key=fundingSubjectKey(card,review),decision=review.subjects?.[key];
    card.company.entity_id=key;
    card.company.application_entity_id=key;
    if(decision?.display_name){
      if(!decision.source_url || !decision.quote)throw new Error('display_name_requires_evidence');
      card.company.name=decision.display_name;
    }
    if(!groups.has(key))groups.set(key,[]);groups.get(key).push(card);
  }
  const subjects=[];
  for(const [key,group] of groups){
    group.sort(latestFirst);const card=structuredClone(enrichFundingHistory(group)[0]);
    const decision=review.subjects?.[key]||{};
    const productAliases=decision.product_aliases||{};
    const products=new Map();
    for(const product of group.flatMap(c=>c.products||[])){
      const name=productAliases[product.name]||product.name,k=normalized(name);
      if(!k)continue;
      const previous=products.get(k);
      if(!previous)products.set(k,{...structuredClone(product),name});
      else previous.evidence_refs=unique([...previous.evidence_refs||[],...product.evidence_refs||[]],r=>`${r.source_id}:${r.quote}`);
    }
    card.products=[...products.values()];
    card.company.application_entity_id=key;
    card.source_event_ids=[...new Set(group.flatMap(c=>[c.triggered_by_event_id,...c.source_event_ids||[]]).filter(Boolean))];
    card.source_card_ids=[...new Set(group.flatMap(c=>[c.funding_insight_id,...c.source_card_ids||[]]))];
    card.research_sources=unique(group.flatMap(c=>c.research_sources||[]),s=>s.source_id);
    card.historical_rounds=group.map(c=>({funding_insight_id:c.funding_insight_id,event_ids:[c.triggered_by_event_id,...c.source_event_ids||[]],round:c.financing.round,round_code:c.financing.round_code,round_original:c.financing.round_original,amount_original:c.financing.amount_original,amount_normalized:c.financing.amount_normalized,announced_at:c.financing.announced_at,disclosure_status:c.financing.disclosure_status,is_summary:c.financing.round_code==='multi_round',counts_toward_known_total:c.financing.round_code!=='multi_round',is_current:c.funding_insight_id===card.funding_insight_id,investors:c.financing.investors||[],evidence_refs:c.financing.evidence_refs||[]}));
    card.aggregation={...card.aggregation,strategy:'reviewed_funding_subject',subject_id:key,event_count:group.length,source_card_count:card.source_card_ids.length};
    for(const event of group){
      event.subject_card_id=card.funding_insight_id;
      event.company.name=card.company.name;
    }
    subjects.push(card);
  }
  subjects.sort(latestFirst);
  const currentSubjectIds=new Set(subjects.map(c=>c.company.application_entity_id));
  const oldSubjectIds=new Map();
  for(const original of input){
    const key=fundingSubjectKey(original,review);
    for(const id of [original.company?.entity_id,original.company?.application_entity_id].filter(Boolean)){
      if(!oldSubjectIds.has(id))oldSubjectIds.set(id,new Set());oldSubjectIds.get(id).add(key);
    }
  }
  const companyAliases=Object.fromEntries([...oldSubjectIds].filter(([id,targets])=>!currentSubjectIds.has(id)&&targets.size===1).map(([id,targets])=>[id,[...targets][0]]));
  // Event statistics need factual round fields, not a second copy of full research.
  const compactEvents=eventCards.sort(latestFirst).map(c=>({
    funding_insight_id:c.funding_insight_id,triggered_by_event_id:c.triggered_by_event_id,source_event_ids:c.source_event_ids,
    subject_card_id:c.subject_card_id,as_of_date:c.as_of_date,market_scope:c.market_scope,
    company:Object.fromEntries(['entity_id','application_entity_id','name','full_name','summary','website','headquarters','founders'].map(k=>[k,c.company[k]])),
    financing:Object.fromEntries(['round','round_code','round_original','amount','amount_original','amount_normalized','announced_at','disclosure_status','investor_disclosure_status','investors'].map(k=>[k,c.financing[k]])),
    financing_tags:c.financing_tags,market_category:c.market_category,market_subcategory:c.market_subcategory,product_form:c.product_form,
    products:(c.products||[]).map(p=>({name:p.name})),
  }));
  return {cards:subjects,event_cards:compactEvents,company_aliases:companyAliases,aliases:Object.fromEntries(subjects.flatMap(c=>c.source_card_ids.filter(id=>id!==c.funding_insight_id).map(id=>[id,c.funding_insight_id]))),duplicate_rounds_removed:duplicateIds.size};
}
