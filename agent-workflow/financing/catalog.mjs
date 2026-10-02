#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { taxonomy, classificationInput, classificationProblems, displayClassification } from './taxonomy.mjs';
import { read,write } from './state.mjs';
import { buildFundingSubjects } from './subjects.mjs';

export function publicationHold(card, review) {
  if (!review) return null;
  if (review.version !== 'FINANCING-PUBLICATION-REVIEW-1' || !Array.isArray(review.holds)) throw new Error('invalid_financing_publication_review');
  const events = new Set([card.triggered_by_event_id, ...(card.source_event_ids || [])]);
  return review.holds.find(row => {
    if (!row.event_id || !row.reason || !row.source_url || row.status !== 'pending') throw new Error('invalid_financing_publication_hold');
    return events.has(row.event_id);
  }) || null;
}

export function buildFinancingCatalog(root) {
  const source=read(path.join(root,'01-SiteV2/site/data/funding-insights-v1.json'));
  const registry=read(path.join(root,'01-SiteV2/content/12-applications/financing-taxonomy/decisions.json'));
  if(!source || registry?.version!==taxonomy.version) throw new Error('financing_catalog_inputs_missing');
  const funding=path.join(root,'01-SiteV2/content/12-applications/funding-insights');
  const inputs=new Map();
  for(const file of fs.readdirSync(funding).filter(file=>/^\d{4}-\d{2}-\d{2}\.json$/u.test(file)).sort()) for(const card of read(path.join(funding,file)).cards || []) inputs.set(card.triggered_by_event_id,classificationInput(card));
  const excluded=[],pending=[],eligible=[];
  const publicationPending=[];
  const review=read(path.join(funding,'publication-review.json'));
  for(const card of source.cards){
    const hold=publicationHold(card,review);
    if(hold){publicationPending.push({event_id:hold.event_id,company:card.company.name,reason:hold.reason,source_url:hold.source_url});continue;}
    const id=card.triggered_by_event_id,input=inputs.get(id),decision=registry.decisions[id];
    if(!input || !decision || decision.input_hash!==input.input_hash || classificationProblems(decision,input).length) throw new Error(`financing_classification_missing_or_stale:${id}`);
    if(decision.scope==='excluded'){excluded.push({event_id:id,company:card.company.name,reason:decision.exclusion_reason});continue;}
    if(decision.scope==='review'){pending.push({event_id:id,company:card.company.name,reason:decision.rationale});continue;}
    const tags=displayClassification(decision);
    // Public financing output carries only its own taxonomy. Old canonical
    // labels remain in the factual archive, never in current filters or search.
    const copy=structuredClone(card);
    for(const key of Object.keys(copy.analysis || {})) if(/(?:market_|product_form|use_case_ids|industry_ids|target_user_ids|related_direction|taxonomy)/u.test(key)) delete copy.analysis[key];
    copy.analysis.sector=tags.subsector.name;
    delete copy.links?.direction;
    copy.financing_tags=tags;
    copy.market_category={...tags.sector,dimension:'financing_sector'};
    copy.market_subcategory={...tags.subsector,dimension:'financing_subsector'};
    copy.market_application=null;
    copy.product_form=tags.product_form?{...tags.product_form,dimension:'financing_product_form'}:null;
    eligible.push(copy);
  }
  const subjects=buildFundingSubjects(eligible,read(path.join(funding,'card-review.json')) || {});
  const cards=subjects.cards;
  const used=(items,get)=>items.filter(row=>cards.some(card=>get(card)===row.id));
  return {
    meta:{...source.meta,taxonomy_version:taxonomy.version,card_count:cards.length,event_count:subjects.event_cards.length,aggregation_strategy:'reviewed_funding_subject',duplicate_rounds_removed:subjects.duplicate_rounds_removed,china_market_card_count:cards.filter(card=>card.market_scope?.market_region==='CN').length,
      scope:'all_ai_financing_except_embodied_and_robotics',excluded_count:excluded.length,pending_classification_count:pending.length,
      pending_publication_count:publicationPending.length,
      market_category_framework:{name:'观澜 AI 融资分类',version:taxonomy.version,sources:taxonomy.sources.map(row=>({name:row.name,url:row.url}))}},
    taxonomy,
    filters:{market_regions:source.filters.market_regions,rounds:[...new Set(cards.map(card=>card.financing.round).filter(Boolean))].sort(),
      market_categories:used(taxonomy.sectors,card=>card.financing_tags.sector.id).map(({id,name})=>({id,name})),
      market_subcategories:taxonomy.sectors.flatMap(sector=>used(sector.subsectors,card=>card.financing_tags.subsector.id).map(row=>({...row,parent_id:sector.id}))),
      product_forms:used(taxonomy.product_forms,card=>card.financing_tags.product_form?.id),customers:taxonomy.customers},
    cards,event_cards:subjects.event_cards,card_aliases:subjects.aliases,company_aliases:subjects.company_aliases,review:{excluded,pending,publication_pending:publicationPending},
  };
}
if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const root=path.resolve(process.argv.find(arg=>arg.startsWith('--root='))?.slice(7) || process.cwd());
  const data=buildFinancingCatalog(root),output=path.join(root,'01-SiteV2/site/data/financing-catalog-v1.json');
  write(output,data);console.log(JSON.stringify({cards:data.cards.length,excluded:data.review.excluded.length,pending:data.review.pending.length,output}));
}
