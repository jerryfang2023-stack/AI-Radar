import fs from 'node:fs';
import path from 'node:path';
import {read, write, digest} from './state.mjs';
import {config} from './discovery.mjs';
import {captureParsedOriginal} from './capture.mjs';
import {createSearchGateway, canonicalSearchUrl} from '../tools/lib/search-gateway.mjs';

export const nextDay = date => new Date(Date.parse(`${date}T00:00:00Z`) + 86400000).toISOString().slice(0,10);
export const followupDue = (item, date) => item.status === 'pending' && (!item.next_due_date || item.next_due_date <= date) && (item.rounds || 0) < 2 && (!(item.rounds || 0) || !item.stop_after_date || date <= item.stop_after_date);
export function deferredFollowup(item, date, {attempted = false, reason = ''} = {}) {
  const rounds = (item.rounds || 0) + Number(attempted);
  // Waiting for capacity or a provider does not use a substantive review round
  // and cannot expire an item that has never received its first fact review.
  const expired = rounds > 0 && date >= item.stop_after_date;
  return {...item, rounds, status: rounds >= 2 || expired ? 'needs_attention' : 'pending',
    next_due_date: rounds >= 2 || expired ? null : nextDay(date), reason,
    owner: 'responsible_financing_reviewer', next_action: rounds >= 2 || expired ? 'supply_new_original_and_review_without_clearing_attempt_receipts' : 'next_existing_daily_verify'};
}

// Import the already captured PR1191 originals without fetching them again.
// This compatibility path is fixed, never derived from a source URL or filename.
export function legacyOriginals(backupRoot, date) {
  const directory = path.join(backupRoot, 'supplementary-reviews', `${date}-pending247`);
  const originals = new Map(), byId = new Map(); let attempts = 0;
  if (!fs.existsSync(directory)) return {originals, byId, attempts};
  for (const name of fs.readdirSync(directory).filter(name => /^[a-zA-Z0-9_-]+\.json$/u.test(name))) {
    const file = read(path.join(directory,name));
    if (!file?.url || !['captured','failed'].includes(file.status)) continue;
    attempts++;
    if (file.status !== 'captured' || !file.body || digest(file.body) !== file.content_hash) continue;
    originals.set(canonicalSearchUrl(file.url), file);
    if(file.id && file.date && file.article_like)byId.set(String(file.id),file);
  }
  return {originals, byId, attempts};
}
export function legacyCapture(record, date) {
  return captureParsedOriginal({url:record.url}, {...record, url:record.final_url || record.url, method:'reused_private_original'}, {date});
}

// One focused query uses the existing discovery ceiling, not a new allowance.
// Count provider HTTP calls durably before I/O. Unknown query outcomes are never
// repeated; responses contain leads only and must be captured before factual use.
export function createFollowupSearch({directory, collection, env=process.env, fetcher=fetch}) {
  const file = path.join(directory,'verification-search.json');
  const state = read(file,{date:collection.date, requests:0, queries:{}});
  if(state.date !== collection.date) throw new Error('verification_search_date_mismatch');
  const used = Math.max(Number(collection.search_health?.requests || 0), (collection.search_attempts || []).filter(row => !['cache','bing_rss'].includes(row.provider) && row.status !== 'budget_exhausted').length);
  return async title => {
    const query = `"${String(title || '').replace(/["\r\n]/gu,' ').slice(0,220)}"`;
    if(query.length < 8) return {status:'held',reason:'specific_financing_title_required',items:[]};
    const key=digest(query), previous=state.queries[key];
    if(previous) return previous.status==='completed' ? previous : {status:'held',reason:'search_previous_unknown_or_failed',items:[]};
    if(used + state.requests >= config.max_search_requests) return {status:'deferred',reason:'search_budget_exhausted',items:[]};
    const configured=['ANYSEARCH_API_KEY','BRAVE_SEARCH_API_KEY','TAVILY_API_KEY','EXA_API_KEY'].some(key=>env[key]);
    if(!configured) return {status:'held',reason:'search_provider_unavailable',items:[]};
    state.queries[key]={status:'started',items:[]};write(file,state);
    const gateway=createSearchGateway({env, fallback:null, maxRequests:1, fetcher:async (...args)=>{
      if(used + state.requests >= config.max_search_requests)throw new Error('search_budget_exhausted');
      state.requests++; write(file,state); return fetcher(...args);
    }});
    try {
      const results=await gateway.search(query,3);
      state.queries[key]={status:'completed',items:results.map(row=>({url:row.url,title:row.title})),attempts:gateway.attempts};
    } catch {state.queries[key]={status:'failed',reason:'search_unavailable_or_unknown',items:[],attempts:gateway.attempts};}
    write(file,state);return state.queries[key];
  };
}
