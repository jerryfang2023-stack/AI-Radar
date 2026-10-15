import fs from 'node:fs';
import path from 'node:path';
import {read,write,digest} from './state.mjs';
import {researchDeferral} from './research-deferral.mjs';
import {dispositionResolver} from './verification-dispositions.mjs';
import {valueTriageResolver} from './value-triage.mjs';

export function registerPublicationHolds({root,backupRoot,date}) {
  const funding=path.join(root,'01-SiteV2/content/12-applications/funding-insights');
  const review=read(path.join(funding,'publication-review.json'));
  if(!review)return {added:0,evidence_followup:0,responsible_review:0};
  if(review.version!=='FINANCING-PUBLICATION-REVIEW-1' || !Array.isArray(review.holds))throw new Error('invalid_financing_publication_review');
  const file=path.join(backupRoot,'financing-monitor-state/verification-queue.json');
  const queue=read(file,{version:'FINANCING-VERIFICATION-QUEUE-1',entries:{}});
  const known=new Set(Object.keys(queue.entries).map(url=>url.replace(/\/+$/u,'')));
  const unresolved=review.holds.filter(h=>h.status==='pending' && !known.has(h.source_url?.replace(/\/+$/u,'')));
  if(!unresolved.length)return {added:0,evidence_followup:0,responsible_review:0};
  const research=fs.readdirSync(funding).filter(n=>/^\d{4}-\d{2}-\d{2}\.json$/u.test(n)).sort().reverse().map(n=>({date:n.slice(0,10),...read(path.join(funding,n))}));
  const cards=research.flatMap(r=>r.cards || []),bundles=new Map();
  const result={added:0,evidence_followup:0,responsible_review:0},attention=[];
  const disposition=dispositionResolver({root,backupRoot,directory:path.join(root,'agent-workflow/reports/financing',date),date});
  const triage=valueTriageResolver({backupRoot,date});
  for(const hold of unresolved) {
    if(!/^https?:\/\//u.test(hold.source_url || '') || !hold.event_id || !hold.reason)throw new Error('invalid_financing_publication_hold');
    if(disposition(hold.source_url,{},{}).action==='close' || triage(hold.source_url,{},{}).action==='skip')continue;
    const prior=research.find(r=>(r.queue || []).some(q=>q.event_id===hold.event_id));
    let deferral=null;
    if(prior && /research_(?:independent_)?sources_insufficient/u.test(hold.reason)) {
      if(!bundles.has(prior.date)) {
        const dir=path.join(root,'01-SiteV2/content/11-databases/data-center-v4',prior.date);
        bundles.set(prior.date,{events:read(path.join(dir,'canonical-events.json'),[]),claims:read(path.join(dir,'claims.json'),[]),rawDocuments:read(path.join(dir,'raw-documents.json'),[])});
      }
      const bundle=bundles.get(prior.date),event=bundle.events.find(e=>e.event_id===hold.event_id);
      deferral=researchDeferral(event,bundle,prior.queue.find(q=>q.event_id===hold.event_id),cards);
      if(!deferral?.sources.some(s=>s.source_url.replace(/\/+$/u,'')===hold.source_url.replace(/\/+$/u,'')))deferral=null;
    }
    const source=deferral?.sources.find(s=>s.source_url.replace(/\/+$/u,'')===hold.source_url.replace(/\/+$/u,''));
    const mode=deferral?'evidence_followup':'responsible_review';
    // Existing factual exclusions/holds must not be reactivated as network
    // searches. Surface them separately for the responsible reviewer.
    if(!deferral){result.responsible_review++;attention.push({event_id:hold.event_id,source_url:hold.source_url,reason:hold.reason,hold_hash:digest(hold)});continue;}
    queue.entries[hold.source_url]={source_url:hold.source_url,evidence_source_url:hold.source_url,
      origin_date:prior?.date || date,status:deferral?'pending':'needs_attention',next_due_date:deferral?date:null,rounds:0,
      reason:hold.reason,title:prior?.queue.find(q=>q.event_id===hold.event_id)?.company_name || '',
      ...(source?{content_hash:source.content_hash}:{}),fact_review_completed:false,
      publication_hold:{event_id:hold.event_id,hold_hash:digest(hold),mode,registered_at:date},
      owner:'responsible_financing_reviewer',next_action:deferral?'supplement_evidence_then_review_publication_hold':'review_existing_hold_without_recollecting'};
    result.added++;result[mode]++;
  }
  write(file,queue);
  write(path.join(backupRoot,'financing-monitor-state/publication-hold-review.json'),{date,rows:attention});
  return result;
}

export function mayResearchHeldEvent(hold,entry) {
  return Boolean(hold && entry?.publication_hold?.mode==='evidence_followup'
    && entry.publication_hold.event_id===hold.event_id && entry.publication_hold.hold_hash===digest(hold));
}
