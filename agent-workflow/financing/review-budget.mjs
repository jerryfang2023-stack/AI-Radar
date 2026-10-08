import path from 'node:path';
import fs from 'node:fs';
import {read, write, digest} from './state.mjs';

export function reviewCapacity(policy, leads) {
  const margin = 1 + (policy.capacity_margin ?? 0.2);
  return {
    captures: Math.max(policy.capture_attempts_per_run, Math.ceil(leads * policy.capture_attempts_per_lead * margin)),
    searches: Math.max(policy.search_requests_per_run || 0, Math.ceil(leads * policy.search_requests_per_lead * margin)),
  };
}

// The caller owns the shared private review lock. A lead registration is never
// a network request. Reservations survive recovery, including unknown outcomes.
export function createReviewBudget({directory, date, policy, collection = {}, verification = {}, queue = {}, history = {}}) {
  const file = path.join(directory, date, 'review-budget.json');
  const state = read(file, {version:'FINANCING-REVIEW-BUDGET-1', date, leads:{}, captures:{}, search_requests:0});
  if (state.date !== date || state.version !== 'FINANCING-REVIEW-BUDGET-1') throw new Error('review_budget_identity_mismatch');
  const register = url => {state.leads[digest(url)] ||= {capture_requests:0, search_requests:0};};
  for (const [url,row] of Object.entries(collection.captures || {})) if (row.status === 'pending') register(url);
  for (const [url,row] of Object.entries(queue.entries || {})) if (!['verified','excluded','reviewed'].includes(row.status)) register(url);
  const importAttempts = (url, rows) => {
    register(url);
    for (const row of rows || []) {
      const key = digest(row.url);
      if (!state.captures[key]) {
        state.captures[key] = {lead:digest(url), status:row.status || 'unknown', reason:row.reason || '', content_hash:row.content_hash};
        state.leads[digest(url)].capture_requests++;
      }
    }
  };
  for (const [url,row] of Object.entries(collection.rechecks || {})) importAttempts(url,row.captures);
  for (const [url,row] of Object.entries(verification.entries || {})) importAttempts(url,row.capture_attempts);
  // Orphaned pre-I/O source reservations remain conservatively spent. Do not
  // import completed parent-lead bookkeeping as additional source requests.
  for(const [url,row] of Object.entries(history.entries || {})) if(row.date===date && row.attempted && row.status==='started') {
    state.captures[digest(url)] ||= {status:'unknown',reason:'legacy_request_requires_reconciliation'};
  }
  const requestsDir=path.join(directory,date);
  if(fs.existsSync(requestsDir)) for(const name of fs.readdirSync(requestsDir)) {
    const key=name.match(/^verification-search-([a-f0-9]{64})\.json$/u)?.[1];
    if(!key)continue;
    const prior=read(path.join(requestsDir,name));
    if(prior.date!==date)throw new Error('review_search_date_mismatch');
    state.leads[key] ||= {capture_requests:0,search_requests:0};
    state.leads[key].search_requests=Math.max(state.leads[key].search_requests,prior.requests || 0);
  }
  state.search_requests=Object.values(state.leads).reduce((sum,row)=>sum+row.search_requests,0);
  const capacity = () => reviewCapacity(policy, Object.keys(state.leads).length);
  const save = () => {state.capacity = capacity(); write(file,state);};
  save();
  return {
    hasCapture: url => Boolean(state.captures[digest(url)]),
    captureReceipt: url => state.captures[digest(url)],
    remainingCapture: leadUrl => Math.max(0,policy.capture_attempts_per_lead-(state.leads[digest(leadUrl)]?.capture_requests || 0)),
    reserveCapture(leadUrl, url) {
      register(leadUrl);
      if (state.captures[digest(url)]) return false;
      const lead=state.leads[digest(leadUrl)];
      if (lead.capture_requests >= policy.capture_attempts_per_lead || Object.keys(state.captures).length >= capacity().captures) return false;
      lead.capture_requests++;
      state.captures[digest(url)]={lead:digest(leadUrl),status:'started'};
      save(); return true;
    },
    finishCapture(url, result) {
      const row=state.captures[digest(url)];
      if (!row) throw new Error('review_capture_reservation_missing');
      Object.assign(row,{status:result.status,reason:result.reason || '',content_hash:result.record?.content_hash}); save();
    },
    reserveSearch(leadUrl) {
      register(leadUrl);
      const lead=state.leads[digest(leadUrl)];
      if (lead.search_requests >= policy.search_requests_per_lead) throw new Error('review_lead_search_budget_exhausted');
      if (state.search_requests >= capacity().searches) throw new Error('review_search_budget_exhausted');
      lead.search_requests++; state.search_requests++; save();
    },
    summary: () => ({leads:Object.keys(state.leads).length, capture_requests:Object.keys(state.captures).length, search_requests:state.search_requests, capacity:capacity()}),
  };
}

export function reviewStage(row) {
  if (row.fact_review_completed) return 'fact_conflict_review';
  if (row.raw_ids?.length) return 'fact_review';
  if (row.content_hash) return row.alternate_source ? 'source_identity_review' : 'evidence_review';
  if (/unknown|interrupted/u.test(row.reason || '')) return 'request_reconciliation';
  if (row.reason === 'secondary_evidence_attempted_awaiting_agent_review') return 'evidence_review';
  return 'needs_original';
}

export function reviewQueueSummary(queue) {
  const stages={};
  for (const row of Object.values(queue.entries || {})) {const stage=reviewStage(row); stages[stage]=(stages[stage] || 0)+1;}
  return {total:Object.keys(queue.entries || {}).length, stages};
}
