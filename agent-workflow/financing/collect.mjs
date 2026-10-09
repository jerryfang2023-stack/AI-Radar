import fs from 'node:fs';
import path from 'node:path';
import { discover, config } from './discovery.mjs';
import { captureOriginal } from './capture.mjs';
import { read, write, digest } from './state.mjs';
import { createSearchGateway } from '../tools/lib/search-gateway.mjs';
import { ingestPrivateEvidenceRecords } from '../tools/lib/private-evidence-backup.mjs';
import { loadPrivateEvidenceRecord } from '../tools/lib/private-evidence-store.mjs';
import { buildSourceIntake, mergeSourceIntakes, readSourceIntake, sourceIntakePath } from '../tools/lib/source-intake-v1.mjs';
import { indexFinancingEvidence } from './evidence-index.mjs';
import { collectSubscriptions } from './subscriptions.mjs';
import { syncAIHotSelected } from './aihot-selected.mjs';
import { createOriginalReader } from './original-reader.mjs';
import { captureAllowance, backlogReserve, collectionAttempts } from './capture-budget.mjs';
import { recheckPending } from './recheck.mjs';
import {createReviewBudget} from './review-budget.mjs';
import {createLeadFollowupSearch} from './lead-followup-search.mjs';
import {reviewStateDirectory} from './review-state.mjs';

export async function collect({ root, directory, backupRoot, date, gateway, feed, supplements, capture = captureOriginal, recheck = false, reviewSearch }) {
  const file = path.join(directory, 'collection.json');
  const previous = read(file);
  const previousHash=previous?digest(previous):null;
  if (previous && (previous.date !== date || previous.version !== config.version)) throw new Error('collection_checkpoint_identity_mismatch');
  const verificationFile=path.join(directory,'verification.json');
  const verificationBefore=recheck && fs.existsSync(verificationFile)?fs.readFileSync(verificationFile,'utf8'):null;
  if(verificationBefore) {
    const verification=JSON.parse(verificationBefore);
    if(verification.date!==date || verification.version!=='FINANCING-VERIFICATION-1' || verification.collection_hash!==previousHash)throw new Error('verification_checkpoint_identity_mismatch');
  }
  // Downstream recovery has no authority to re-run accepted collection.
  if (previous?.accepted) {
    const intake = readSourceIntake(root, date);
    if (!intake || !previous.raw_ids.every(id => intake.payload.raw_documents.some(row => row.raw_id === id))) throw new Error('accepted_intake_missing_restore_checkpoint');
    if (!recheck) {
      indexFinancingEvidence({root, backupRoot, date, collection:previous});
      return previous;
    }
  }
  gateway ||= createSearchGateway({ cacheDir: path.join(directory, 'search-cache'), maxRequests: config.max_search_requests });
  const state = previous || { version: config.version, date, captures: {} };
  const sourceState = path.join(backupRoot,'financing-monitor-state');
  const sharedState=reviewStateDirectory(backupRoot);
  if (recheck && !previous?.accepted) throw new Error('accepted_collection_required_for_recheck');
  const discovered = recheck ? {complete:true,failed:[],supplementalFailures:state.supplemental_failures || [],leads:[]} : await discover({ date, search: gateway.search, feed, previous: state.receipts,
    supplements: supplements || [
      {id:'subscriptions',run:()=>collectSubscriptions({date,stateFile:path.join(sourceState,'subscriptions.json'),search:gateway.search})},
      {id:'aihot_selected',run:()=>syncAIHotSelected({date,stateFile:path.join(sourceState,'aihot-selected.json')})},
    ],
    onPage: page => write(path.join(directory, 'aihot', `${page.page}.json`), page),
    save: receipts => { state.receipts = receipts; write(file, state); },
  });
  const captureCapacity = Math.max(
    config.max_capture_attempts,
    Math.ceil(discovered.leads.length * (1 + config.discovery_capacity_margin)),
    collectionAttempts(state),
  );
  const reader=createOriginalReader({directory:path.join(sourceState,'original-reader'),sharedDirectory:path.join(sharedState,'original-reader'),date,maxRequests:Math.max(config.original_reader_requests,captureCapacity)});
  state.discovery_complete = discovered.complete; state.failed_queries = discovered.failed;
  state.supplemental_failures = discovered.supplementalFailures;
  state.capture_capacity = { discovered_leads: discovered.leads.length, max_attempts: captureCapacity, margin: config.discovery_capacity_margin };
  state.search_health = gateway.status?.() || {}; state.search_attempts = gateway.attempts || [];
  const remaining = discovered.leads.filter(lead => !state.captures[lead.url]);
  const considered = remaining.slice(0, captureCapacity);
  const reserve = backlogReserve({backupRoot,date});
  const available = captureAllowance({collection:state,maxAttempts:captureCapacity,backupRoot,date});
  const batch = considered.slice(0, Math.max(0, available - reserve));
  for (const lead of considered.slice(batch.length)) state.captures[lead.url] = {
    status:'pending', reason:reserve ? 'capture_budget_reserved_for_verification' : 'capture_budget_exhausted',
    attempted:false, title:lead.title || '', coverage:lead.coverage || [],
  };
  write(file,state);
  for (let i = 0; i < batch.length; i += config.capture_concurrency) {
    const group = batch.slice(i, i + config.capture_concurrency);
    // Persist reservations before I/O: an unknown interrupted capture is held.
    for (const lead of group) state.captures[lead.url] = {status:'pending',reason:'collection_capture_interrupted_or_unknown',attempted:true,title:lead.title || '',coverage:lead.coverage || []};
    write(file,state);
    const results = await Promise.all(group.map(async lead => {
      try { return { lead, result: await capture(lead, { date, reader }) }; }
      catch (error) { return { lead, result: { status: 'pending', reason: error.message } }; }
    }));
    const records = results.filter(({ result }) => result.record).map(({ lead, result }) => ({
      snapshotRef: `financing/${date}/${digest(lead.url).slice(0,16)}.json`,
      sourceUrl: lead.url, dataDate: date, contentHash: result.record.content_hash, body: result.record.clean_text, metadata: result.record,
    }));
    // Persist originals before their accepted receipts. Public receipts contain no bodies.
    if (records.length) ingestPrivateEvidenceRecords({ root, backupRoot, records });
    for (const { lead, result } of results) {
      const { record, ...receipt } = result;
      state.captures[lead.url] = { ...receipt, attempted:true, title:lead.title || '', coverage: lead.coverage || [],
        ...(record ? { content_hash: record.content_hash, source_url: lead.url } : {}) };
    }
    write(file, state);
  }
  const reviewGateways = new Map();
  const budget=createReviewBudget({directory:sourceState,sharedDirectory:sharedState,date,policy:config.secondary_review,collection:state,
    verification:read(verificationFile,{}),queue:read(path.join(sourceState,'verification-queue.json'),{}),history:read(path.join(sourceState,'verification-attempts.json'),{})});
  await recheckPending({state,date,policy:config.secondary_review,
    budget,
    search:reviewSearch || ((query,limit,{leadUrl}) => {
      // Each lead's four queries retain a separate provider request allowance.
      const leadKey = leadUrl;
      if (!reviewGateways.has(leadKey)) reviewGateways.set(leadKey,createLeadFollowupSearch({directory:path.join(sourceState,date),sharedDirectory:path.join(sharedState,date),date,leadUrl,policy:config.secondary_review,budget}));
      return reviewGateways.get(leadKey).query(query,limit);
    }),
    capture:(lead,options)=>capture(lead,{...options,reader:createOriginalReader({directory:path.join(sourceState,'original-reader'),sharedDirectory:path.join(sharedState,'original-reader'),date,maxRequests:config.secondary_review.capture_attempts_per_lead,budgetKey:options.recheckLeadUrl})}),
    accept:async (lead,result,{leadUrl})=>{
      ingestPrivateEvidenceRecords({root,backupRoot,records:[{snapshotRef:`financing/${date}/${digest(lead.url).slice(0,16)}.json`,sourceUrl:lead.url,dataDate:date,contentHash:result.record.content_hash,body:result.record.clean_text,metadata:result.record}]});
      const {record,...receipt}=result;
      // An alternative is evidence for its originating lead, not a newly
      // approved unrelated discovery. Verify binds company/round before intake.
      if(lead.url===leadUrl)state.captures[lead.url]={...receipt,title:lead.title || '',coverage:lead.coverage || [],content_hash:record.content_hash,source_url:lead.url};
    },save:()=>write(file,state)});
  const entries = Object.values(state.captures).filter(row => row.status === 'accepted').map(row => {
    const loaded = loadPrivateEvidenceRecord(root, `evidence://${row.content_hash}`, row.content_hash, { backupRoot, sourceUrl: row.source_url, dataDate: date });
    return { record: loaded.raw, jsonPath: path.join(root, loaded.entry.snapshot_ref), pooled: true };
  });
  const intake = buildSourceIntake({ root, date, entries });
  intake.source_artifacts.forEach(row => { row.snapshot_refs = [`evidence://${row.content_hash}`]; });
  intake.raw_documents.forEach(row => { row.body_ref = `evidence://${row.content_hash}`; });
  write(sourceIntakePath(root, date), mergeSourceIntakes(readSourceIntake(root, date)?.payload, intake));
  indexFinancingEvidence({root, backupRoot, date, collection:state});
  state.raw_ids = intake.raw_documents.map(row => row.raw_id);
  state.capture_capacity.attempts_used = collectionAttempts(state);
  state.unattempted = Math.max(0, remaining.length - considered.length);
  state.counts = { leads: recheck ? Object.keys(state.captures).length : discovered.leads.length, accepted_originals: entries.length, pending: Object.values(state.captures).filter(row => row.status === 'pending').length, excluded: Object.values(state.captures).filter(row => row.status === 'excluded').length };
  state.accepted = discovered.complete && state.unattempted === 0;
  state.status = state.accepted ? entries.length ? 'accepted' : 'no_verified_new_financing' : 'incomplete';
  write(file, state);
  if (!state.accepted) throw new Error(`collection_incomplete:${state.failed_queries.join(',')};remaining=${state.unattempted}`);
  if(verificationBefore && previousHash!==digest(state)) {
    // New originals change verification inputs. Preserve the prepared receipt
    // privately, then rebuild from the existing source-bound queue and reviews.
    const archived=path.join(backupRoot,'financing-monitor-state','recheck-checkpoints',date,`${digest(verificationBefore)}.json`);
    write(archived,JSON.parse(verificationBefore));
    if(fs.readFileSync(verificationFile,'utf8')!==verificationBefore)throw new Error('verification_checkpoint_changed_during_recheck');
    fs.unlinkSync(verificationFile);
  }
  return state;
}
