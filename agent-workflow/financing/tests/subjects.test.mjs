import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {buildFundingSubjects} from '../subjects.mjs';
test('reviewed product alias excerpts retain matching quote hashes',()=>{
 const review=JSON.parse(fs.readFileSync(new URL('../../../01-SiteV2/content/12-applications/funding-insights/card-review.json',import.meta.url)));
 for(const subject of Object.values(review.subjects))for(const product of subject.product_alias_evidence||[])for(const ref of product.evidence_refs||[]){
  if(ref.quote_hash)assert.equal(ref.quote_hash,crypto.createHash('sha256').update(ref.quote).digest('hex'),product.name);
 }
});
function card(id,subject,date,round,value){return {funding_insight_id:id,triggered_by_event_id:`EV-${id}`,company:{name:subject,full_name:`${subject} Inc.`,application_entity_id:subject,entity_id:'stale-shared-id'},financing:{round,round_code:round,announced_at:date,amount_original:`$${value}`,amount_normalized:{currency:'USD',value,status:'exact'},investors:[{name:`Investor-${id}`}],evidence_refs:[{source_id:id,quote:'Financing announcement'}]},products:[{name:'Product',evidence_refs:[{source_id:id,quote:'Product description'}]}],research_sources:[{source_id:id,source_url:`https://example.org/${id}`} ]};}
test('one subject card preserves separate rounds, sources, products, investors and event statistics',()=>{
 const old=card('old','Acme','2026-01-01','seed',10),latest=card('latest','Acme','2026-03-01','series_a',20),other=card('other','Different','2026-02-01','seed',8);
 const input=[old,latest,other],snapshot=structuredClone(input),out=buildFundingSubjects(input);
 assert.equal(out.cards.length,2);assert.equal(out.event_cards.length,3);
 const subject=out.cards.find(c=>c.company.name==='Acme');
 assert.equal(subject.funding_insight_id,'latest');assert.equal(subject.financing.amount_normalized.value,20);
 assert.equal(subject.historical_rounds.length,2);assert.equal(subject.historical_rounds[1].investors[0].name,'Investor-old');
 assert.equal(subject.products.length,1);assert.equal(subject.products[0].evidence_refs.length,2);
 assert.equal(subject.financing.cumulative_amount.known_round_totals[0].value,30);
 assert.equal(out.aliases.old,'latest');assert.deepEqual(new Set(subject.source_event_ids),new Set(['EV-old','EV-latest']));
 assert.deepEqual(input,snapshot);assert.equal(out.event_cards.find(c=>c.funding_insight_id==='old').subject_card_id,'latest');
});
test('reviewed duplicate reports retain provenance but cannot inflate the round count or amount',()=>{
 const first=card('first','Acme','2026-01-01','seed',10),copy=card('copy','Acme','2026-02-01','seed',10);
 const review={version:'FINANCING-CARD-REVIEW-1',duplicate_rounds:[{canonical_id:'first',duplicate_ids:['copy'],reason:'Same announcement retold',source_url:'https://example.org/first'}]};
 const out=buildFundingSubjects([first,copy],review);
 assert.equal(out.cards.length,1);assert.equal(out.event_cards.length,1);assert.equal(out.cards[0].historical_rounds.length,1);
 assert.equal(out.cards[0].financing.cumulative_amount.known_round_totals[0].value,10);assert.equal(out.aliases.copy,'first');assert.equal(out.cards[0].research_sources.length,2);
 assert.throws(()=>buildFundingSubjects([first,{...copy,company:{...copy.company,application_entity_id:'Other'}}],review),/subject_mismatch/);
});
test('explicit subject aliases join old identities; unrelated businesses sharing a legacy ID remain separate',()=>{
 const a=card('a','old-app','2026-01-01','seed',10),b=card('b','new-app','2026-02-01','series_a',20),c=card('c','unrelated','2026-03-01','seed',5);
 const review={subjects:{'new-app':{application_ids:['old-app','new-app'],display_name:'Brand',source_url:'https://example.org/brand',quote:'Brand legal identity'}}};
 const out=buildFundingSubjects([a,b,c],review);
 assert.equal(out.cards.length,2);assert.equal(out.cards.find(c=>c.company.name==='Brand').historical_rounds.length,2);
 assert.deepEqual(out.event_cards.filter(c=>c.company.application_entity_id==='new-app').map(c=>c.company.name),['Brand','Brand']);
});
