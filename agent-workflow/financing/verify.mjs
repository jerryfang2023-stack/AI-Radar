import path from 'node:path';
import { legacyOriginals, legacyCapture, followupDue, deferredFollowup } from './verification-followup.mjs';
import { captureOriginal } from './capture.mjs';
import { config } from './discovery.mjs';
import { read, write, digest } from './state.mjs';
import { createOriginalReader } from './original-reader.mjs';
import { ingestPrivateEvidenceRecords } from '../tools/lib/private-evidence-backup.mjs';
import { loadPrivateEvidenceRecord } from '../tools/lib/private-evidence-store.mjs';
import { buildSourceIntake, mergeSourceIntakes, readSourceIntake, sourceIntakePath } from '../tools/lib/source-intake-v1.mjs';
import { indexFinancingEvidence } from './evidence-index.mjs';
import { classificationInput, classificationProblems } from './taxonomy.mjs';
import { createLeadFollowupSearch } from './lead-followup-search.mjs';
import { dispositionResolver } from './verification-dispositions.mjs';

const version = 'FINANCING-VERIFICATION-1';
const semanticReasons = new Set(['ai_relevance_unverified', 'robotics_core_business_review', 'embodied_or_robotics_core_business_review']);
const dimensions = ['company_identity', 'ai_relevance', 'date', 'amount', 'round', 'deduplication'];
const pendingChecks = () => Object.fromEntries(dimensions.map(key => [key, 'pending']));

// This is a bounded follow-up of the existing queue, never discovery. The caller
// holds the daily run lock; the owning workflow holds the global publication slot.
export async function verifyPending({ root, directory, backupRoot, date, capture = captureOriginal, search }) {
  const collection = read(path.join(directory, 'collection.json'));
  if (!collection?.accepted || collection.date !== date) throw new Error('accepted_financing_collection_required');
  const file = path.join(directory, 'verification.json');
  const state = read(file, { version, date, collection_hash: digest(collection), entries: {} });
  if (state.version !== version || state.date !== date || state.collection_hash !== digest(collection)) throw new Error('verification_checkpoint_identity_mismatch');
  const supplementalFile = path.join(directory, 'supplemental.json');
  const supplemental = read(supplementalFile, { version: 'FINANCING-SUPPLEMENT-1', date, accepted: true, raw_ids: [] });
  if (supplemental.version !== 'FINANCING-SUPPLEMENT-1' || supplemental.date !== date || supplemental.accepted !== true) throw new Error('accepted_financing_supplement_required');
  // Explicitly supported responsible-agent ledgers (including the one-time
  // PR1191 batch). Preserve prior dispositions; they are not new approvals.
  const reviewed = new Map();
  for (const name of ['pending247-review.json', 'lead-review.json']) {
    const review = read(path.join(directory, name));
    if (!review) continue;
    if (review.version !== 'FINANCING-LEAD-REVIEW-1' || review.date !== date || !Array.isArray(review.rows)) throw new Error('lead_review_identity_mismatch');
    for (const item of review.rows) {
      if (!item.url || !item.status || !item.reason || !item.reviewed_at) throw new Error('lead_review_incomplete');
      reviewed.set(item.url, { ...item, ledger: name });
    }
  }
  const privateDir = path.join(backupRoot, 'financing-monitor-state');
  const historyFile = path.join(privateDir, 'verification-attempts.json');
  const history = read(historyFile, { entries: {} });
  const queueFile = path.join(privateDir, 'verification-queue.json');
  const queue = read(queueFile, {version:'FINANCING-VERIFICATION-QUEUE-1', entries:{}});
  const legacy = legacyOriginals(backupRoot, date);
  const leadSearches = new Map();
  const searchFor = url => {
    if (search) return search;
    if (!leadSearches.has(url)) leadSearches.set(url,createLeadFollowupSearch({directory:path.join(privateDir,date),date,leadUrl:url,policy:config.secondary_review}));
    return leadSearches.get(url);
  };
  const discovered = new Map(Object.values(collection.receipts || {}).flatMap(receipt => receipt.items || []).map(item => [item.url, item]));
  // Secondary review has its own run allowance, independent of discovery.
  // Reservations remain durable; an unknown URL is never silently replayed.
  let remaining = Math.max(0, config.secondary_review.capture_attempts_per_run - Object.values(history.entries).filter(row=>row.date===date && row.attempted).length);
  const processed = new Set();
  const pendingReviews=new Map();
  const resolveDisposition=dispositionResolver({root,backupRoot,directory,date});
  const processLead = async ([url, receipt]) => {
    const queued = queue.entries[url];
    const disposition=resolveDisposition(url,receipt,queued);
    if(disposition.pending_review)pendingReviews.set(url,disposition.pending_review);
    if(disposition.action==='close') {
      processed.add(url);
      state.entries[url]={...state.entries[url],source_url:url,origin_date:queued?.origin_date || date,
        status:'excluded',reason:disposition.reason,checks:pendingChecks(),disposition};
      write(file,state);return;
    }
    if((disposition.strict && !disposition.pending_review)
      || ['newer_private_review_preserved','private_evidence_conflicts_with_collection'].includes(disposition.reason)) {
      processed.add(url);
      state.entries[url]={...state.entries[url],source_url:url,origin_date:queued?.origin_date || date,
        status:'pending',reason:queued?.reason || disposition.reason,checks:pendingChecks(),disposition,
        ...(queued ? {followup:queued} : {})};
      write(file,state);return;
    }
    const currentReview = pendingReviews.get(url) || reviewed.get(url);
    if (currentReview && (receipt.status !== 'accepted' || !currentReview.status.startsWith('pending'))) receipt = {...receipt,status:'pending'};
    // A current collection disposition must reconcile an existing queue item,
    // even when its next retry is not due. Accepted originals still need gates.
    if (queued && ['excluded','accepted'].includes(receipt.status)) {
      if (state.entries[url]?.collection_reconciled && (!currentReview || state.entries[url].review_hash === digest(currentReview))) return;
      processed.add(url);
      const rawIds = receipt.status === 'accepted' ? (readSourceIntake(root,date)?.payload.raw_documents || [])
        .filter(raw => raw.source_url === url && raw.content_hash === receipt.content_hash && collection.raw_ids.includes(raw.raw_id)).map(raw => raw.raw_id) : [];
      state.entries[url] = {source_url:url, origin_date:queued.origin_date, rounds:queued.rounds || 0,
        stop_after_date:queued.stop_after_date, title:queued.title || '', checks:pendingChecks(),
        status:receipt.status === 'excluded' ? 'excluded' : rawIds.length ? 'awaiting_fact_review' : 'pending',
        reason:receipt.status === 'excluded' ? `current_collection:${receipt.reason}` : rawIds.length ? 'existing_fact_research_and_taxonomy_gates_required' : 'accepted_source_missing_restore_intake',
        collection_reconciled:receipt.status === 'excluded' || rawIds.length > 0, collection_date:date, original_date:receipt.original_date,
        content_hash:receipt.content_hash, raw_ids:rawIds, evidence_source_url:url, alternate_source:false,
        ...(currentReview ? {review_hash:digest(currentReview),reviewed_status:currentReview.status,prior_reason:currentReview.reason,review_ref:`${currentReview.ledger}#${currentReview.id}`} : {}),
        resumed_fact_review:true};
      write(file,state);return;
    }
    if (receipt.status !== 'pending') return;
    let row = state.entries[url];
    if (row && row.status !== 'captured' && !currentReview && queued?.last_processed_date >= date && !followupDue(queued,date)) return;
    const priorReview = currentReview || receipt.prior_review;
    if (!row || (priorReview && row.review_hash !== digest(priorReview))) {
      processed.add(url);
      row = state.entries[url] = { source_url: url, original_reason: receipt.reason, status: 'pending', reason: receipt.reason, checks: pendingChecks(),
        title: priorReview?.title || receipt.title || discovered.get(url)?.title || '',
        origin_date: queued?.origin_date || date, rounds: queued?.rounds || 0,
        stop_after_date: queued?.stop_after_date || new Date(Date.parse(date)+7*86400000).toISOString().slice(0,10) };
      if (queued && !followupDue(queued,date) && (!priorReview || queued.review_hash === digest(priorReview))) {
        Object.assign(row, {reason:queued.reason,followup:queued});
        if(queued.raw_ids?.length && queued.last_processed_date===date)Object.assign(row,{raw_ids:queued.raw_ids,content_hash:queued.content_hash,status:'awaiting_fact_review',
          evidence_source_url:queued.evidence_source_url || url,alternate_source:queued.alternate_source ?? true,source_identity_reviewed:queued.source_identity_reviewed,source_binding:queued.source_binding});
        write(file,state); return;
      }
      if (priorReview) {
        Object.assign(row, { status: priorReview.status.startsWith('pending') ? 'pending' : 'reviewed',
          reason: priorReview.reason, reviewed_status: priorReview.status,
          review_ref: `${priorReview.ledger}#${priorReview.id}`, review_hash: digest(priorReview), review_basis: priorReview.review_basis || '',
          additional_source: priorReview.accepted_source || priorReview.additional_source || '',
          content_hash: priorReview.content_hash || priorReview.original_capture?.content_hash || null });
        if (priorReview.raw_id && supplemental.raw_ids.includes(priorReview.raw_id)) {
          Object.assign(row, { status: 'awaiting_fact_review', raw_ids: [priorReview.raw_id], evidence_ref: `evidence://${row.content_hash}` });
        }
        if (priorReview.status === 'accepted_original' && !row.raw_ids?.length) {
          row.status = 'pending'; row.reason = 'accepted_source_missing_restore_supplement';
        }
        if (!priorReview.status.startsWith('pending')) {
          history.entries[url] ||= { date, status: 'reviewed', reason: row.reason, content_hash: row.content_hash, evidence_source_url:row.evidence_source_url,alternate_source:row.alternate_source };
          write(historyFile, history); write(file, state); return;
        }
        // A prior pending disposition is input to actual follow-up, not a skip.
        row.prior_reason = priorReview.reason;
      }
      if (row.raw_ids?.length) { write(file,state); return; }
      let cachedOriginal = legacy.originals.get(url) || legacy.originals.get(priorReview?.additional_source) || legacy.byId.get(String(priorReview?.id));
      if(!cachedOriginal && queued?.content_hash && queued.fact_review_completed !== true) {
        try {
          const saved=loadPrivateEvidenceRecord(root,`evidence://${queued.content_hash}`,queued.content_hash,{backupRoot,sourceUrl:queued.evidence_source_url || url});
          cachedOriginal={url:saved.entry.source_url,title:saved.raw.title,body:saved.body,date:saved.raw.published_at,date_evidence:saved.raw.publication_date_evidence,article_like:saved.raw.source_type==='article',content_hash:saved.entry.content_hash};
        } catch {row.evidence_problem='private_original_missing_restore_evidence';}
      }
      if (cachedOriginal) {
        const recovered = legacyCapture(cachedOriginal, queued?.content_hash === cachedOriginal.content_hash && queued.fact_review_completed !== true ? queued.origin_date || date : date);
        if (recovered.record) {
          const record = recovered.record, sourceUrl = record.original_url;
          ingestPrivateEvidenceRecords({root,backupRoot,records:[{snapshotRef:`financing/${date}/${digest(sourceUrl).slice(0,16)}.json`,sourceUrl,dataDate:date,contentHash:record.content_hash,body:record.clean_text,metadata:record}]});
          Object.assign(row,{content_hash:record.content_hash,evidence_source_url:sourceUrl,status:'captured',reason:'original_recovered',used_existing_original:true,alternate_source:sourceUrl!==url,
            resumed_fact_review:Boolean(queued?.content_hash === record.content_hash && queued.fact_review_completed !== true)});
        } else {row.reason = recovered.reason;row.evidence_problem = recovered.reason;}
      }
      if(row.status !== 'captured') {
      const previous = history.entries[url];
      if (!queued && receipt.content_hash && previous && previous.date !== date && previous.content_hash === receipt.content_hash) {
        Object.assign(row, { reason: 'unchanged_original_previously_reviewed', previous_date: previous.date });
      } else if (previous?.date === date && previous.content_hash && ['captured', 'awaiting_fact_review'].includes(previous.status)) {
        Object.assign(row, { content_hash: previous.content_hash, status: 'captured', reason: previous.reason || 'original_recovered',evidence_source_url:previous.evidence_source_url,alternate_source:previous.alternate_source });
      } else if (receipt.content_hash && !priorReview && !queued) {
        Object.assign(row, { content_hash: receipt.content_hash, status: 'captured' });
      } else if (previous && !priorReview && !receipt.backlog && !queued) {
        Object.assign(row, { reason: 'previous_verification_attempt_requires_review', previous_date: previous.date });
      } else if (receipt.reason === 'collection_capture_interrupted_or_unknown') {
        row.reason = receipt.reason;
      } else if (collection.rechecks?.[url]?.status === 'evidence_attempted') {
        row.reason = 'secondary_evidence_attempted_awaiting_agent_review';
      } else if (!remaining) {
        row.reason = 'capture_budget_exhausted';
      } else {
        // Reserve BEFORE network I/O. An interrupted/unknown attempt is held,
        // never silently billed or fetched again on a checkpoint restore.
        Object.assign(row, { attempted: true, reason: 'attempt_interrupted_or_unknown' });
        history.entries[url] = { date, status: 'started', attempted: true };
        write(historyFile, history); write(file, state);
        const candidates = new Set();
        if (!(priorReview || receipt.backlog || queued)) candidates.add(url);
        for (const target of [priorReview?.accepted_source,priorReview?.additional_source].filter(Boolean)) candidates.add(target);
        const found = (priorReview?.accepted_source || priorReview?.additional_source) ? {status:'hinted_original',items:[]} : await searchFor(url)(row.title);
        row.search_status = found.status; row.search_reason = found.reason || '';
        for (const item of found.items || []) if(item.url!==url) candidates.add(item.url);
        const reader = createOriginalReader({directory:path.join(privateDir,'original-reader'),date,
          maxRequests:config.secondary_review.capture_attempts_per_lead,budgetKey:url});
        row.capture_attempts ||= [];
        for (const targetUrl of candidates) {
          if (row.capture_attempts.length>=config.secondary_review.capture_attempts_per_lead || !remaining) break;
          if (targetUrl!==url && (history.entries[targetUrl]?.attempted || collection.captures?.[targetUrl])) continue;
          remaining--;
          row.evidence_source_url=targetUrl;row.alternate_source=targetUrl!==url;
          const attempt={url:targetUrl,status:'started'};row.capture_attempts.push(attempt);
          history.entries[targetUrl]={date,status:'started',attempted:true};write(historyFile,history);write(file,state);
          let result;
          try { result=await capture({url:targetUrl},{date,reader}); }
          catch {result={status:'pending',reason:'original_capture_failed'};}
          Object.assign(attempt,{status:result.status,reason:result.reason});
          if(result.record) {
            const record=result.record;
            ingestPrivateEvidenceRecords({root,backupRoot,records:[{snapshotRef:`financing/${date}/${digest(targetUrl).slice(0,16)}.json`,sourceUrl:targetUrl,dataDate:date,contentHash:record.content_hash,body:record.clean_text,metadata:record}]});
            Object.assign(row,{content_hash:record.content_hash,status:'captured',reason:result.reason || 'original_recovered'});
            write(file,state);break;
          }
          Object.assign(row,{status:result.status==='excluded' && targetUrl===url?'excluded':'pending',reason:targetUrl===url?result.reason:`alternate_original_unusable:${result.reason}`});
          write(file,state);
        }
        if(!row.capture_attempts.length)row.reason=row.search_reason || 'no_alternate_original_found';
        history.entries[url] = { ...history.entries[url], date, status: row.status, reason: row.reason, content_hash: row.content_hash, evidence_source_url:row.evidence_source_url,alternate_source:row.alternate_source };
        write(historyFile, history);
      }
      }
      write(file, state);
    }
    if (row.status !== 'captured') return;
    processed.add(url);
    const sourceUrl = row.evidence_source_url || url;
    let loaded;
    try { loaded = loadPrivateEvidenceRecord(root, `evidence://${row.content_hash}`, row.content_hash, { backupRoot, sourceUrl, dataDate: date }); }
    catch { row.status='pending';row.reason='private_original_missing_restore_evidence';write(file,state);return; }
    // Only structurally usable, dated originals reach the existing semantic
    // extraction/research gates. Scope ambiguity is NOT a scope approval.
    row.evidence_source_url = loaded.entry.source_url;
    row.alternate_source = row.alternate_source === true || loaded.entry.source_url !== url;
    const binding = priorReview?.source_binding;
    row.source_identity_reviewed = binding?.source_url === loaded.entry.source_url && Boolean(binding.reviewed_by && binding.reviewed_at && binding.reason);
    if(row.source_identity_reviewed)row.source_binding={...binding};
    if(row.alternate_source && !row.source_identity_reviewed) {
      row.status='pending';row.reason='alternate_original_requires_identity_review';
      row.evidence_ref=`evidence://${row.content_hash}`;
      history.entries[url]={...history.entries[url],date,status:'captured',content_hash:row.content_hash,evidence_source_url:row.evidence_source_url,alternate_source:true};
      write(historyFile,history);write(file,state);return;
    }
    const record = loaded.raw;
    if (!record.published_at || (row.reason !== 'original_recovered' && !semanticReasons.has(row.original_reason) && !semanticReasons.has(row.reason))) {
      row.status = 'pending'; row.reason = 'original_requires_manual_review'; write(file, state); return;
    }
    const intake = buildSourceIntake({ root, date, entries: [{ record, jsonPath: path.join(root, loaded.entry.snapshot_ref), pooled: true }] });
    intake.source_artifacts.forEach(item => { item.snapshot_refs = [`evidence://${item.content_hash}`]; });
    intake.raw_documents.forEach(item => { item.body_ref = `evidence://${item.content_hash}`; });
    write(sourceIntakePath(root, date), mergeSourceIntakes(readSourceIntake(root, date)?.payload, intake));
    supplemental.raw_ids = [...new Set([...supplemental.raw_ids, ...intake.raw_documents.map(item => item.raw_id)])];
    write(supplementalFile, supplemental);
    indexFinancingEvidence({ root, backupRoot, date, collection: { captures: { [url]: { status: 'accepted', source_url: sourceUrl, content_hash: row.content_hash } } } });
    Object.assign(row, { status: 'awaiting_fact_review', reason: 'existing_fact_research_and_taxonomy_gates_required', raw_ids: intake.raw_documents.map(item => item.raw_id), evidence_ref: `evidence://${row.content_hash}` });
    history.entries[url] = { ...history.entries[url], date, status: row.status, reason: 'original_recovered', content_hash: row.content_hash, evidence_source_url:row.evidence_source_url,alternate_source:row.alternate_source };
    write(historyFile, history); write(file, state);
  };
  const leads = Object.entries(collection.captures || {}).map(([url,receipt]) => [url,
    queue.entries[url] ? {...receipt,prior_review:queue.entries[url].prior_review,backlog:true} : receipt]);
  const currentUrls = new Set(leads.map(([url])=>url));
  for(const [url,item] of Object.entries(queue.entries)) {
    if(item.status==='pending' && item.stop_after_date < date)queue.entries[url]=deferredFollowup(item,date,{reason:item.reason});
    if(!currentUrls.has(url) && followupDue(item,date)) leads.push([url,{status:'pending',reason:item.reason,title:item.title,prior_review:item.prior_review,backlog:true}]);
  }
  leads.sort(([a],[b]) => {
    const qa=queue.entries[a], qb=queue.entries[b];
    const dueA=Boolean(qa && followupDue(qa,date)), dueB=Boolean(qb && followupDue(qb,date));
    return Number(dueB)-Number(dueA) || (dueA && dueB ? String(qa.origin_date || '').localeCompare(String(qb.origin_date || '')) || a.localeCompare(b) : 0);
  });
  for (let i = 0; i < leads.length; i += config.capture_concurrency) {
    const results = await Promise.allSettled(leads.slice(i, i + config.capture_concurrency).map(processLead));
    const failed = results.find(result => result.status === 'rejected');
    if (failed) throw failed.reason;
  }
  for(const [url,row] of Object.entries(state.entries)) {
    // Restored public checkpoints may predate a successful private fact review.
    // Only this invocation's changed rows may replace the latest queue state.
    if (!processed.has(url) && queue.entries[url]?.last_processed_date >= date) {
      row.followup=queue.entries[url];
      row.reason=queue.entries[url].reason;
      row.fact_review_completed=queue.entries[url].fact_review_completed;
      continue;
    }
    if(row.status === 'reviewed' || row.status === 'excluded' || row.status === 'verified') { delete queue.entries[url];continue; }
    if(row.reason==='alternate_original_requires_identity_review') {
      row.followup={...row,status:'needs_attention',next_due_date:null,last_processed_date:date,
        prior_review:pendingReviews.get(url) || reviewed.get(url) || queue.entries[url]?.prior_review,owner:'responsible_financing_reviewer',
        next_action:'review_original_company_and_round_binding_before_supplement'};
    }
    if(!row.followup) {
      row.followup=deferredFollowup({...row,status:'pending',last_processed_date:date,prior_review:pendingReviews.get(url) || reviewed.get(url) || queue.entries[url]?.prior_review}, date,
        {attempted:(row.status==='awaiting_fact_review' && !row.resumed_fact_review) || row.attempted === true,reason:row.reason});
    }
    queue.entries[url]=row.followup;
  }
  state.followup_queue={pending:Object.values(queue.entries).filter(item=>item.status==='pending').length,needs_attention:Object.values(queue.entries).filter(item=>item.status==='needs_attention').length};
  write(queueFile,queue);
  state.prepared = true;
  write(file, state);
  return state;
}

// Reconcile only after the normal release gates succeed. This writes receipts,
// never cards, selected-source approvals, entity decisions or classification.
export function finishVerification({ root, directory, date, backupRoot }) {
  const file = path.join(directory, 'verification.json'), state = read(file);
  if (!state?.prepared || state.date !== date) throw new Error('prepared_verification_required');
  const research = read(path.join(root, `01-SiteV2/content/12-applications/funding-insights/${date}.json`), {});
  const decisions = read(path.join(root, '01-SiteV2/content/12-applications/financing-taxonomy/decisions.json'), {}).decisions || {};
  const factDir = path.join(root, `01-SiteV2/content/11-databases/data-center-v4/${date}`);
  const rawDocuments = read(path.join(factDir, 'raw-documents.json'), []);
  const eventSources = read(path.join(factDir, 'event-sources.json'), []);
  const qa = read(path.join(factDir, 'qa-queue.json'), []);
  const collection=read(path.join(directory,'collection.json'),{captures:{}});
  const resolveDisposition=backupRoot ? dispositionResolver({root,backupRoot,directory,date}) : null;
  const privateQueue=backupRoot ? read(path.join(backupRoot,'financing-monitor-state/verification-queue.json'),{entries:{}}) : {entries:{}};
  const protectedPrivate=new Set();
  for (const row of Object.values(state.entries)) {
    if(row.disposition?.action==='close') {
      const current=resolveDisposition?.(row.source_url,collection.captures[row.source_url],privateQueue.entries[row.source_url]);
      if(current?.action==='close' && current.proof_hash===row.disposition.proof_hash)continue;
      if(['newer_private_review_preserved','private_evidence_conflicts_with_collection'].includes(current?.reason)) {
        row.status='pending';row.reason=privateQueue.entries[row.source_url].reason;row.disposition=current;protectedPrivate.add(row.source_url);continue;
      }
      row.status='pending';row.reason='disposition_evidence_changed_restore_review';row.disposition={action:'retain',reason:row.reason};continue;
    }
    if (!row.raw_ids?.length) continue;
    const sourceIds = new Set(rawDocuments.filter(raw => row.raw_ids.includes(raw.raw_id) && raw.content_hash === row.content_hash).map(raw => raw.source_artifact_id));
    row.fact_review_completed = sourceIds.size > 0;
    const eventIds = new Set(eventSources.filter(link => sourceIds.has(link.source_artifact_id)).map(link => link.event_id));
    const cardEvents = card => [card.triggered_by_event_id, ...(card.source_event_ids || [])];
    const cards = (research.cards || []).filter(card => cardEvents(card).some(id => eventIds.has(id)) || (card.research_sources || []).some(source => row.raw_ids.includes(source.raw_id) && source.content_hash === row.content_hash));
    row.unresolved_event_ids = [...eventIds].filter(id => !cards.some(card => cardEvents(card).includes(id)));
    const matchingQa = qa.filter(item => row.raw_ids.includes(item.asset_id) || sourceIds.has(item.source_ref) || eventIds.has(item.asset_id));
    row.qa_hints = [...new Set(matchingQa.filter(item => item.status === 'review_optional').map(item => item.reason))];
    row.pending_reasons = [...new Set([
      ...matchingQa.filter(item => item.status !== 'review_optional').map(item => item.reason),
      ...(research.queue || []).filter(item => eventIds.has(item.event_id) && item.status !== 'deduplicated').flatMap(item => item.problems?.length ? item.problems : [`research_${item.status}`]),
    ])];
    row.results = cards.map(card => {
      const input = classificationInput(card), decision = decisions[input.id];
      const classified = decision?.input_hash === input.input_hash && !classificationProblems(decision, input).length;
      const accepted = card.auto_publish_gate?.passed === true && classified && decision.scope === 'included';
      return { card_id: card.funding_insight_id, event_id: card.triggered_by_event_id, accepted,
        scope: classified ? decision.scope : 'review', reason: accepted ? 'existing_gates_passed' : classified && decision.scope === 'excluded' ? decision.exclusion_reason : 'funding_or_taxonomy_gate_pending',
        company: card.company?.name || '', announced_at: card.financing?.announced_at || '',
        amount: card.financing?.amount || '', round: card.financing?.round || '',
        disclosure_status: card.financing?.disclosure_status || 'see_gated_card',
        // No total_raised fallback. References point to gated exact-span evidence.
        evidence_refs: [...(card.company?.evidence_refs || []), ...(card.financing?.evidence_refs || [])].map(({source_id, quote_hash}) => ({source_id, quote_hash})) };
    });
    const complete = (!row.alternate_source || row.source_identity_reviewed) && !row.unresolved_event_ids.length && row.results.length > 0 && row.results.every(result => result.accepted || result.scope === 'excluded');
    row.status = complete ? row.results.some(result => result.accepted) ? 'verified' : 'excluded' : 'pending';
    row.reason = row.alternate_source && !row.source_identity_reviewed && cards.length ? 'alternate_event_requires_original_lead_identity_review' : complete ? 'existing_gates_reconciled' : cards.length ? 'funding_or_taxonomy_gate_pending' : 'no_accepted_financing_event_manual_review_required';
    row.checks = Object.fromEntries(dimensions.map(key => [key, row.status === 'verified' ? 'accepted_by_existing_gates_not_full_disclosure' : 'pending']));
    row.review_refs = [`01-SiteV2/content/11-databases/data-center-v4/${date}/qa-queue.json`, `01-SiteV2/content/12-applications/funding-insights/${date}.json`];
  }
  state.status = 'completed'; // The bounded pass completed; unresolved facts did not.
  state.counts = { total: Object.keys(state.entries).length, verified: 0, excluded: 0, reviewed: 0, pending: 0 };
  for (const row of Object.values(state.entries)) state.counts[row.status === 'verified' ? 'verified' : row.status === 'excluded' ? 'excluded' : row.status === 'reviewed' ? 'reviewed' : 'pending']++;
  if(backupRoot) {
    const queueFile=path.join(backupRoot,'financing-monitor-state/verification-queue.json');
    const queue=read(queueFile,{version:'FINANCING-VERIFICATION-QUEUE-1',entries:{}});
    for(const [url,row] of Object.entries(state.entries)) {
      if(protectedPrivate.has(url))continue;
      if(['verified','excluded','reviewed'].includes(row.status))delete queue.entries[url];
      else if(queue.entries[url]) {queue.entries[url].reason=row.reason;queue.entries[url].fact_review_completed=row.fact_review_completed;row.followup=queue.entries[url];}
      else if(row.reason==='disposition_evidence_changed_restore_review')queue.entries[url]=deferredFollowup({...row,last_processed_date:date},date,{reason:row.reason});
    }
    write(queueFile,queue);
  }
  write(file, state);
  return { version, status: state.status, counts: state.counts, ledger: 'verification.json' };
}
