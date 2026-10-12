import fs from 'node:fs';
import path from 'node:path';
import {read,digest} from './state.mjs';

const closedDecisions=new Set(['archive_low_verification_value','archive_historical_event','archive_already_published_same_event']);
const title=value=>String(value||'').trim();

// Responsible lead triage is a private scheduling decision, never a financing
// approval. Reuse it until the source/evidence changes or a reviewer reopens it.
export function valueTriageResolver({backupRoot,date}) {
  const directory=path.join(backupRoot,'financing-monitor-state/value-triage');
  const reviews=new Map();
  if(fs.existsSync(directory))for(const name of fs.readdirSync(directory).filter(name=>name.endsWith('.json')).sort()) {
    const ledger=read(path.join(directory,name));
    if(ledger?.version!=='FINANCING-QUEUE-VALUE-TRIAGE-1' || ledger.status!=='applied' || ledger.date>date || !Array.isArray(ledger.rows))continue;
    for(const row of ledger.rows) {
      const reviewedAt=row.reviewed_at || ledger.reviewed_at;
      const reviewer=row.reviewed_by || ledger.reviewer;
      if(!row.source_url || !row.reason || !reviewer || !Number.isFinite(Date.parse(reviewedAt)) || reviewedAt.slice(0,10)>date)continue;
      const review={...row,reviewed_at:reviewedAt,reviewed_by:reviewer,ledger:`financing-monitor-state/value-triage/${name}`};
      if(!reviews.has(row.source_url) || reviews.get(row.source_url).reviewed_at<=reviewedAt)reviews.set(row.source_url,review);
    }
  }
  return (url,receipt={},queued={})=>{
    const review=reviews.get(url);
    const retain=reason=>({action:'retain',reason});
    if(!review || !closedDecisions.has(review.decision))return retain('no_closed_value_triage');
    const newer=[queued.reviewed_at,queued.prior_review?.reviewed_at,receipt.prior_review?.reviewed_at].filter(Boolean).some(at=>at>review.reviewed_at);
    if(newer)return retain('newer_responsible_review_preserved');
    if(receipt.title && review.title && title(receipt.title)!==title(review.title))return retain('triaged_source_title_changed');
    const currentHash=receipt.content_hash;
    if(currentHash && (!review.content_hash || currentHash!==review.content_hash || (review.evidence_source_url && review.evidence_source_url!==url)))return retain('triaged_source_evidence_changed');
    if(queued.content_hash && review.content_hash && queued.content_hash!==review.content_hash)return retain('new_queue_evidence_preserved');
    const proof={source_url:url,review_ref:`${review.ledger}#${review.id}`,decision:review.decision,
      reason:review.reason,reviewed_at:review.reviewed_at,reviewed_by:review.reviewed_by,
      content_hash:review.content_hash || null,evidence_source_url:review.evidence_source_url || url,
      evidence_basis:'responsible_lead_triage_not_fact_approval'};
    return {action:'skip',reason:'responsible_value_triage_reused',proof,proof_hash:digest(proof)};
  };
}
