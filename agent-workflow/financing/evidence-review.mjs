import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {evidenceQuoteHash} from '../tools/funding-insight-v1-utils.mjs';

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const fields=new Set(['amount','currency','round','investors','investor_roles','announced_at']);
export function financingEvidenceAudit(cards) {
 const issues=[];
 for(const c of cards){
  const sources=new Map((c.research_sources||[]).map(s=>[s.source_id,s]));
  for(const ref of c.financing?.evidence_refs||[]) {
   if(!sources.has(ref.source_id))issues.push({event_id:c.triggered_by_event_id,kind:'missing_source',source_id:ref.source_id});
   if(ref.quote_hash&&evidenceQuoteHash(ref.quote||'')!==ref.quote_hash)issues.push({event_id:c.triggered_by_event_id,kind:'quote_hash_mismatch',source_id:ref.source_id});
  }
  for(const s of sources.values()){
   if(!s.published_at)issues.push({event_id:c.triggered_by_event_id,kind:'publication_date_unrecorded',source_id:s.source_id});
   if(s.content_hash&&!/^[a-f0-9]{64}$/.test(s.content_hash))issues.push({event_id:c.triggered_by_event_id,kind:'legacy_content_hash_requires_review',source_id:s.source_id});
  }
  const a=c.financing?.amount_normalized||{};
  if(a.status==='exact'&&(!Number.isFinite(a.value)||a.value<0))issues.push({event_id:c.triggered_by_event_id,kind:'invalid_exact_amount'});
 }
 return {records:cards.length,issues,counts:Object.fromEntries([...new Set(issues.map(r=>r.kind))].map(k=>[k,issues.filter(r=>r.kind===k).length]))};
}

// A reviewed overlay follows normalization so accepted URLs/IDs and raw bundles
// remain immutable. Guarded before/after values fail closed on upstream drift.
export function applyFinancingEvidenceReview(input,registry={version:'FINANCING-EVIDENCE-REVIEW-1',entries:[]},{rollback=false}={}) {
 if(registry.version!=='FINANCING-EVIDENCE-REVIEW-1'||!Array.isArray(registry.entries))throw Error('invalid_financing_evidence_review');
 const cards=structuredClone(input),changes=[],sourceChanges=[];
 for(const row of registry.entries){
  if(row.status==='disabled')continue;
  if(!row.event_id||!row.reviewed_at||!row.reason||!row.reviewer||!row.sources?.length)throw Error('incomplete_evidence_review');
  const targets=cards.filter(c=>c.triggered_by_event_id===row.event_id);
  if(targets.length!==1)throw Error('review_event_missing_or_ambiguous:'+row.event_id);
  const c=targets[0];
  if(row.card_id&&c.funding_insight_id!==row.card_id)throw Error('review_stable_id_changed:'+row.event_id);
  for(const [key,patch]of Object.entries(row.financing_changes||{})){
   if(!['announced_at','amount','amount_original','amount_normalized'].includes(key))throw Error('unsupported_financing_patch');
   const before=rollback?patch.after:patch.before,after=rollback?patch.before:patch.after;
   if(!same(c.financing[key],before)&&!same(c.financing[key],after))throw Error('review_precondition_changed:'+row.event_id+':'+key);
   if(!same(c.financing[key],after))changes.push({event_id:row.event_id,card_id:c.funding_insight_id,field:key,old_value:c.financing[key],new_value:after,reason:row.reason,reviewed_at:row.reviewed_at,source_ids:row.sources.filter(s=>s.purpose==='current_round').map(s=>s.source_id)});
   c.financing[key]=structuredClone(after);
  }
  if(rollback){
   c.research_sources=(c.research_sources||[]).filter(s=>!row.sources.some(r=>r.added&&r.source_id===s.source_id)).map(s=>structuredClone(row.sources.find(r=>r.source_id===s.source_id)?.previous||s));
   if(row.previous_evidence_refs)c.financing.evidence_refs=structuredClone(row.previous_evidence_refs);
   delete c.financing.evidence_review;
   continue;
  }
  for(const s of row.sources){
   if(!s.source_id||!s.source_url||!['current_round','historical_round','company_background','unverified'].includes(s.purpose))throw Error('invalid_reviewed_source');
   if((s.supports_fields||[]).some(f=>!fields.has(f))||s.purpose!=='current_round'&&(s.supports_fields||[]).length)throw Error('historical_source_cannot_support_current_round');
   if(!/^[a-f0-9]{64}$/.test(s.verification_hash||s.content_hash||''))throw Error('reviewed_source_requires_content_hash');
   const existing=(c.research_sources||[]).find(v=>v.source_id===s.source_id);
   if(existing&&existing.source_url!==s.source_url)throw Error('source_id_url_changed');
   const safe=Object.fromEntries(Object.entries(s).filter(([k])=>!['added','previous'].includes(k)));
   if(existing)for(const key of ['published_at','content_hash']){
    const actual=existing[key]??null,before=s.previous?.[key]??null,after=safe[key]??before;
    if(!same(actual,before)&&!same(actual,after))throw Error('source_review_precondition_changed:'+s.source_id+':'+key);
   }
   const changedFields=Object.keys(safe).filter(k=>!same(existing?.[k],safe[k]));
   if(changedFields.length)sourceChanges.push({event_id:row.event_id,source_id:s.source_id,reviewed_at:row.reviewed_at,reason:row.reason,fields:changedFields.map(field=>({field,old_value:existing?.[field]??null,new_value:safe[field]}))});
   if(existing)Object.assign(existing,safe);else(c.research_sources||=[]).push(safe);
  }
  c.financing.evidence_refs=[...new Map([...(c.financing.evidence_refs||[]),...(row.financing_evidence||[])].map(r=>[r.source_id+':'+r.quote,r])).values()];
  c.financing.evidence_review={reviewed_at:row.reviewed_at,correction_id:row.id,reason:row.public_note,reason_en:row.public_note_en,
   first_public_disclosure:row.first_public_disclosure||null,media_disclosures:row.media_disclosures||[],conflicts:row.conflicts||[],
   changes:Object.entries(row.financing_changes||{}).map(([field,p])=>({field,old_value:p.before,new_value:p.after})),
   field_sources:Object.fromEntries([...fields].map(f=>[f,row.sources.filter(s=>s.purpose==='current_round'&&s.supports_fields?.includes(f)).map(s=>s.source_id)]))};
 }
 for(const c of cards){
  const current=new Set((c.financing?.evidence_refs||[]).map(r=>r.source_id));
  const historical=new Set((c.financing?.other_round_investors||[]).flatMap(i=>(i.evidence_refs||[]).map(r=>r.source_id)));
  c.research_sources=(c.research_sources||[]).map(s=>({...s,purpose:s.purpose||(current.has(s.source_id)?'current_round':historical.has(s.source_id)?'historical_round':'unverified')}));
  // Historical refs stay in research/history, never in the round's supporting refs.
  const allowed=new Set(c.research_sources.filter(s=>s.purpose==='current_round').map(s=>s.source_id));
  c.financing.evidence_refs=(c.financing.evidence_refs||[]).filter(r=>allowed.has(r.source_id));
  c.financing.current_source_ids=[...new Set([...c.financing.evidence_refs.map(r=>r.source_id),...Object.values(c.financing.evidence_review?.field_sources||{}).flat()])];
 }
 return {cards,changes,sourceChanges};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=path.resolve(process.argv.find(s=>s.startsWith('--root='))?.slice(7)||process.cwd());
 const source=JSON.parse(fs.readFileSync(path.join(root,'01-SiteV2/site/data/funding-insights-v1.json'),'utf8'));
 const file=path.join(root,'01-SiteV2/content/12-applications/funding-insights/evidence-review.json');
 const registry=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):undefined;
 const result=applyFinancingEvidenceReview(source.cards,registry);
 const report={mode:'dry-run',audit:financingEvidenceAudit(source.cards),changes:result.changes,sourceChanges:result.sourceChanges};
 const output=process.argv.find(s=>s.startsWith('--output='))?.slice(9);
 if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({mode:report.mode,records:report.audit.records,counts:report.audit.counts,changes:report.changes}));
}
