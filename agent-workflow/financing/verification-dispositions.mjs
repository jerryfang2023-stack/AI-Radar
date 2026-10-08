import fs from 'node:fs';
import path from 'node:path';
import {read, write, digest} from './state.mjs';
import {config} from './discovery.mjs';
import {loadPrivateEvidenceRecord} from '../tools/lib/private-evidence-store.mjs';

const exclusions = new Set(['not_financing','excluded_robotics','not_ai_evidence','historical_before_2026','index_or_roundup','excluded_outside_daily_window']);
const day = value => /^\d{4}-\d{2}-\d{2}$/u.test(value || '') && Number.isFinite(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0,10) === value;
const normalizeSourceUrl = value => String(value || '').replace(/\/+$/u,'');

// Read only bounded, explicitly governed review ledgers. A newer pending
// decision blocks an older exclusion; QA keywords are never review decisions.
export function dispositionResolver({root, backupRoot, directory, date}) {
  if (!day(date)) throw new Error('invalid_disposition_date');
  const reviews = new Map();
  for(let age=config.window_days;age>=0;age--) {
    const reviewDate=new Date(Date.parse(date)-age*86400000).toISOString().slice(0,10);
    const dir=age===0 ? directory : path.join(root,'agent-workflow/reports/financing',reviewDate);
    for(const name of ['pending247-review.json','lead-review.json','disposition-review.json','secondary-evidence-review.json']) {
      const file=path.join(dir,name), ledger=read(file);
      if(!ledger || !['FINANCING-LEAD-REVIEW-1','FINANCING-DISPOSITION-REVIEW-1'].includes(ledger.version) || ledger.date!==reviewDate || !Array.isArray(ledger.rows)) continue;
      for(const row of ledger.rows) {
        if(!row.url || !row.reviewed_at || !row.reason || !row.status) continue;
        const candidate={...row,reviewer:row.reviewed_by || ledger.reviewer,review_date:reviewDate,
          ledger:path.relative(root,file).replaceAll('\\','/'),strict:ledger.version==='FINANCING-DISPOSITION-REVIEW-1'};
        const previous=reviews.get(row.url);
        if(!previous || candidate.reviewed_at>=previous.reviewed_at) reviews.set(row.url,candidate);
      }
    }
  }
  return (url, receipt={}, queued) => {
    const review=reviews.get(url);
    const hold=(reason, extra={})=>({action:'retain',reason,...(review ? {review_ref:`${review.ledger}#${review.id}`,reviewed_status:review.status,strict:review.strict} : {}),...extra});
    if(!review) return hold('no_responsible_disposition');
    if(!review.reviewer || !Number.isFinite(Date.parse(review.reviewed_at)) || review.reviewed_at.slice(0,10)>date || review.reviewed_at.slice(0,10)<review.review_date) return hold('disposition_review_identity_or_time_invalid');
    if(queued?.last_processed_date>date || (queued?.prior_review?.reviewed_at && queued.prior_review.reviewed_at>review.reviewed_at)
      || (queued?.reviewed_at && queued.reviewed_at>review.reviewed_at)
      || (queued?.status==='needs_attention' && review.review_date<date)) return hold('newer_private_review_preserved');
    if(queued?.content_hash && receipt.content_hash && queued.content_hash!==receipt.content_hash) return hold('private_evidence_conflicts_with_collection');
    if(review.status.startsWith('pending')) return hold('responsible_disposition_still_pending',{pending_review:review});
    if(review.status==='accepted_original') return hold('original_acceptance_requires_fact_and_funding_gates');
    const alreadyCovered=review.status==='already_covered';
    if(!exclusions.has(review.status) && !alreadyCovered) return hold('disposition_requires_event_or_duplicate_binding');
    if(alreadyCovered && (!review.event_binding?.event_id || !review.event_binding?.company || !review.event_binding?.announced_at
      || !review.event_binding?.round_code || !review.event_binding?.reason)) return hold('disposition_requires_event_or_duplicate_binding');
    // A failed current fetch does not prove that a historical page is unchanged.
    // In particular, never substitute the queue's old hash for current evidence.
    const currentHash=receipt.content_hash;
    const reviewHash=review.content_hash || review.original_capture?.content_hash;
    if(!review.strict && (!currentHash || !reviewHash)) return hold(currentHash ? 'review_original_hash_missing' : 'current_original_hash_missing');
    if(!review.strict && currentHash!==reviewHash) return hold('reviewed_original_changed');
    if(!review.strict && (review.review_basis!=='original_text_and_review' || review.original_capture?.status!=='captured')) return hold('source_bound_responsible_review_required');
    if(review.strict) {
      if(!Array.isArray(review.evidence_sources) || !review.evidence_sources.length) return hold('disposition_source_binding_missing');
      if(currentHash && review.content_hash && review.content_hash!==currentHash) return hold('reviewed_original_changed');
      const currentSourceBound=Boolean(currentHash && review.evidence_sources.some(source=>normalizeSourceUrl(source.source_url)===normalizeSourceUrl(url) && source.content_hash===currentHash));
      const alternateSourceBound=review.alternate_source_basis==='responsible_alternate_source_review'
        && Boolean(review.reason?.trim())
        && review.evidence_sources.some(source=>normalizeSourceUrl(source.source_url)!==normalizeSourceUrl(url));
      if(!currentSourceBound && !alternateSourceBound) return hold(currentHash ? 'disposition_source_binding_missing' : 'current_original_hash_missing');
    }
    const sources=review.strict ? review.evidence_sources : [{source_url:url,content_hash:currentHash}];
    try {
      for(const source of sources) {
        if(!/^[a-f0-9]{64}$/u.test(source.content_hash || '')) return hold('invalid_disposition_evidence_hash');
        const loaded=loadPrivateEvidenceRecord(root,`evidence://${source.content_hash}`,source.content_hash,{backupRoot,sourceUrl:source.source_url});
        if(normalizeSourceUrl(loaded.entry.source_url)!==normalizeSourceUrl(source.source_url) || digest(loaded.body)!==source.content_hash) return hold('disposition_evidence_binding_mismatch');
        if(review.strict && (!source.quote || !loaded.body.includes(source.quote))) return hold('disposition_quote_not_in_original');
      }
    } catch { return hold('disposition_private_evidence_missing_or_invalid'); }
    let duplicateEvent=null;
    if(alreadyCovered) {
      const binding=review.event_binding;
      const catalog=read(path.join(root,'01-SiteV2/site/data/financing-catalog-v1.json'),{});
      duplicateEvent=(catalog.event_cards||[]).find(event=>
        event.triggered_by_event_id===binding?.event_id || (event.source_event_ids||[]).includes(binding?.event_id));
      if(!binding?.event_id || !binding.company || !binding.announced_at || !binding.round_code || !binding.reason
        || !duplicateEvent || duplicateEvent.company?.name!==binding.company
        || duplicateEvent.financing?.announced_at!==binding.announced_at
        || duplicateEvent.financing?.round_code!==binding.round_code) return hold('duplicate_event_binding_missing_or_mismatched');
    }
    const proof={review_ref:`${review.ledger}#${review.id}`,reviewer:review.reviewer,reviewed_at:review.reviewed_at,
      reviewed_status:review.status,review_reason:review.reason,review_hash:digest(review),source_url:url,content_hash:currentHash,
      ...(review.alternate_source_basis ? {evidence_basis:review.alternate_source_basis} : {}),
      ...(duplicateEvent ? {duplicate_event_id:review.event_binding.event_id} : {}),
      evidence_sources:sources,valid_through:new Date(Date.parse(review.review_date)+config.window_days*86400000).toISOString().slice(0,10)};
    return {action:'close',reason:duplicateEvent ? 'duplicate_event_already_published' : review.review_date===date ? 'responsible_source_disposition' : 'inherited_source_disposition',proof,proof_hash:digest(proof)};
  };
}

// Offline, source-bound reconciliation. No discovery, model, publication, or
// attempt-counter changes. The caller owns the normal financing writer lock.
export function reconcileDispositions({root,backupRoot,directory,date,apply=false,expectedQueueHash,onlyUrls}) {
  const file=path.join(backupRoot,'financing-monitor-state/verification-queue.json');
  const queue=read(file);
  if(!queue?.entries)throw new Error('verification_queue_required');
  const beforeHash=digest(queue);
  if(expectedQueueHash && expectedQueueHash!==beforeHash)throw new Error('verification_queue_changed_replan_required');
  const collection=read(path.join(directory,'collection.json'));
  if(!collection?.accepted || collection.date!==date)throw new Error('accepted_financing_collection_required');
  const resolve=dispositionResolver({root,backupRoot,directory,date});
  const scope=onlyUrls ? new Set(onlyUrls) : null;
  const rows=Object.entries(queue.entries).filter(([url])=>!scope || scope.has(url))
    .map(([url,item])=>({url,...resolve(url,collection.captures[url],item)}));
  const after=structuredClone(queue), closed=rows.filter(row=>row.action==='close');
  for(const row of closed)delete after.entries[row.url];
  const plan={version:'FINANCING-DISPOSITION-RECONCILIATION-1',date,status:apply?'applied':'dry_run',
    collection_hash:digest(collection),before_hash:beforeHash,after_hash:digest(after),before_count:Object.keys(queue.entries).length,
    after_count:Object.keys(after.entries).length,closed_count:closed.length,network_calls:0,
    ...(scope ? {scope_url_count:scope.size} : {}),rows};
  if(apply) {
    const auditDir=path.join(backupRoot,'financing-monitor-state/verification-reconciliations');
    // Finish a receipt interrupted after the atomic queue write, without
    // repeating any source work or overwriting a newer private queue.
    if(fs.existsSync(auditDir))for(const name of fs.readdirSync(auditDir).filter(name=>name.endsWith('.json'))) {
      const previousFile=path.join(auditDir,name), previous=read(previousFile);
      if(previous?.version===plan.version && previous.status==='prepared' && previous.after_hash===beforeHash) write(previousFile,{...previous,status:'applied'});
    }
    if(closed.length) {
      const auditFile=path.join(auditDir,`${date}-dispositions-${beforeHash.slice(0,16)}.json`);
      const receipt={...plan,previous_entries:Object.fromEntries(closed.map(row=>[row.url,queue.entries[row.url]]))};
      if(digest(read(file))!==beforeHash)throw new Error('verification_queue_changed_replan_required');
      write(auditFile,{...receipt,status:'prepared'});
      write(file,after);
      write(auditFile,receipt);
    }
  }
  return plan;
}
