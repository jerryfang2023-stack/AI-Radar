import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {applyFinancingEvidenceReview,financingEvidenceAudit} from '../evidence-review.mjs';
import {buildFundingSubjects} from '../subjects.mjs';
import {evidenceQuoteHash} from '../../tools/funding-insight-v1-utils.mjs';
const data=JSON.parse(fs.readFileSync(new URL('../../../01-SiteV2/site/data/funding-insights-v1.json',import.meta.url)));
const registry=JSON.parse(fs.readFileSync(new URL('../../../01-SiteV2/content/12-applications/funding-insights/evidence-review.json',import.meta.url)));
const targetIds=registry.entries.map(r=>r.event_id);
const input=structuredClone(data.cards.filter(c=>targetIds.includes(c.triggered_by_event_id)));
// Reconstruct accepted pre-review input even after the generated projection is rebuilt.
for(const c of input){const row=registry.entries.find(r=>r.event_id===c.triggered_by_event_id);
 for(const [field,patch]of Object.entries(row.financing_changes||{}))c.financing[field]=structuredClone(patch.before);
 if(row.previous_evidence_refs)c.financing.evidence_refs=structuredClone(row.previous_evidence_refs);
 c.research_sources=c.research_sources.filter(s=>!row.sources.some(r=>r.added&&r.source_id===s.source_id)).map(s=>structuredClone(row.sources.find(r=>r.source_id===s.source_id)?.previous||s));
 delete c.financing.evidence_review;delete c.financing.current_source_ids;
}
test('audit uses the repository normalized quote-hash contract, including whitespace',()=>{
 const quote='  Amount: $65M\nRound: Series A  ';
 const result=financingEvidenceAudit([{triggered_by_event_id:'x',research_sources:[{source_id:'s'}],financing:{evidence_refs:[{source_id:'s',quote,quote_hash:evidenceQuoteHash(quote)}]}}]);
 assert.equal(result.counts.quote_hash_mismatch,undefined);
});
test('source review preserves IDs, correct Karta facts, and raw inputs; repeat is idempotent',()=>{
 const snapshot=structuredClone(input),out=applyFinancingEvidenceReview(input,registry);
 assert.deepEqual(input,snapshot);
 const cc=out.cards.find(c=>c.company.name==='Cognitive Credit'),ka=out.cards.find(c=>c.company.name==='Karta AI');
 assert.equal(cc.funding_insight_id,'FI-d8fd29312f7415a9');assert.equal(ka.funding_insight_id,'FI-e57481409918a342');
 assert.equal(cc.financing.amount_normalized.currency,'USD');assert.equal(cc.financing.amount_normalized.value,40000000);assert.equal(cc.financing.announced_at,'2026-10-22');
 for(const field of ['amount','amount_normalized','announced_at','round','investors'])assert.deepEqual(ka.financing[field],snapshot.find(c=>c.company.name==='Karta AI').financing[field]);
 assert.deepEqual(applyFinancingEvidenceReview(out.cards,registry).cards,out.cards);
 assert.equal(applyFinancingEvidenceReview(out.cards,registry).changes.length,0);
 const back=applyFinancingEvidenceReview(out.cards,registry,{rollback:true});
 for(const c of back.cards)for(const field of ['amount','amount_original','amount_normalized','announced_at'])assert.deepEqual(c.financing[field],snapshot.find(r=>r.funding_insight_id===c.funding_insight_id).financing[field]);
});
test('historical announcement cannot bind any current-round field; upstream drift blocks mutation',()=>{
 const bad=structuredClone(registry);bad.entries[0].sources.find(s=>s.purpose==='historical_round').supports_fields=['amount'];
 assert.throws(()=>applyFinancingEvidenceReview(input,bad),/historical_source/);
 const drift=structuredClone(input);drift.find(c=>c.company.name==='Cognitive Credit').financing.amount='unknown';
 assert.throws(()=>applyFinancingEvidenceReview(drift,registry),/precondition/);
 const cc=applyFinancingEvidenceReview(input,registry).cards.find(c=>c.company.name==='Cognitive Credit');
 assert.ok(!Object.values(cc.financing.evidence_review.field_sources).flat().includes('FISRC-da6b709a9554b865'));
});
test('new sources and currency expressions cannot inflate event counts or company totals',()=>{
 const before=buildFundingSubjects(input),after=buildFundingSubjects(applyFinancingEvidenceReview(input,registry).cards);
 assert.equal(after.event_cards.length,before.event_cards.length);
 const cc=after.cards.find(c=>c.company.name==='Cognitive Credit');
 assert.equal(cc.historical_rounds.length,1);
 assert.equal(cc.financing.cumulative_amount.known_round_totals.find(v=>v.currency==='USD').value,40000000);
 assert.ok(after.event_cards.find(c=>c.company.name==='Cognitive Credit').research_sources.some(s=>s.purpose==='historical_round'));
});
test('missing, uncertain and conflicting values remain explicit and are never repaired by guessing',()=>{
 const original=structuredClone(input);original[0].financing.amount_normalized={status:'lower_bound',currency:'USD',value:null,min_value:100};
 const out=applyFinancingEvidenceReview(original);
 assert.deepEqual(out.cards[0].financing.amount_normalized,original[0].financing.amount_normalized);
 assert.ok(out.cards.some(c=>c.research_sources.some(s=>!s.published_at)));
 assert.equal(financingEvidenceAudit([{triggered_by_event_id:'x',research_sources:[],financing:{amount_normalized:{status:'exact',value:null}}}]).counts.invalid_exact_amount,1);
 const review=structuredClone(registry);review.entries[1].conflicts=[{field:'valuation',status:'unresolved',claims:[]}];
 assert.deepEqual(applyFinancingEvidenceReview(input,review).cards.find(c=>c.company.name==='Karta AI').financing.evidence_review.conflicts,review.entries[1].conflicts);
});
