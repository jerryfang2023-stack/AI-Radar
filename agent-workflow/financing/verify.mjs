import path from 'node:path';
import { legacyOriginals, legacyCapture, createFollowupSearch, followupDue, deferredFollowup } from './verification-followup.mjs';
import { captureOriginal } from './capture.mjs';
import { config } from './discovery.mjs';
import { read, write, digest } from './state.mjs';
import { createOriginalReader } from './original-reader.mjs';
import { ingestPrivateEvidenceRecords } from '../tools/lib/private-evidence-backup.mjs';
import { loadPrivateEvidenceRecord } from '../tools/lib/private-evidence-store.mjs';
import { buildSourceIntake, mergeSourceIntakes, readSourceIntake, sourceIntakePath } from '../tools/lib/source-intake-v1.mjs';
import { indexFinancingEvidence } from './evidence-index.mjs';
import { classificationInput, classificationProblems } from './taxonomy.mjs';

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
  search ||= createFollowupSearch({directory:path.join(privateDir, date), collection});
  const discovered = new Map(Object.values(collection.receipts || {}).flatMap(receipt => receipt.items || []).map(item => [item.url, item]));
  const reader = createOriginalReader({ directory: path.join(privateDir, 'original-reader'), date });
  // Follow-up HTTP attempts share the existing capture ceiling; model and search
  // limits are unchanged. Same URL is never retried automatically on another day.
  let remaining = Math.max(0, config.max_capture_attempts - Object.keys(collection.captures || {}).length - legacy.attempts
    - Math.max(Object.values(state.entries).filter(row => row.attempted).length,
      Object.values(history.entries).filter(row => row.date === date && row.attempted).length));
  const processLead = async ([url, receipt]) => {
    if (receipt.status !== 'pending') return;
    let row = state.entries[url];
    const priorReview = reviewed.get(url) || receipt.prior_review;
    const queued = queue.entries[url];
    if (!row || (priorReview && row.review_hash !== digest(priorReview))) {
      row = state.entries[url] = { source_url: url, original_reason: receipt.reason, status: 'pending', reason: receipt.reason, checks: pendingChecks(),
        title: priorReview?.title || receipt.title || discovered.get(url)?.title || '',
        origin_date: queued?.origin_date || date, rounds: queued?.rounds || 0,
        stop_after_date: queued?.stop_after_date || new Date(Date.parse(date)+7*86400000).toISOString().slice(0,10) };
      if (queued && !followupDue(queued,date) && (!priorReview || queued.review_hash === digest(priorReview))) {
        Object.assign(row, {reason:queued.reason,followup:queued});
        if(queued.raw_ids?.length && queued.last_processed_date===date)Object.assign(row,{raw_ids:queued.raw_ids,content_hash:queued.content_hash,status:'awaiting_fact_review'});
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
          history.entries[url] ||= { date, status: 'reviewed', reason: row.reason, content_hash: row.content_hash };
          write(historyFile, history); write(file, state); return;
        }
        // A prior pending disposition is input to actual follow-up, not a skip.
        row.prior_reason = priorReview.reason;
      }
      if (row.raw_ids?.length) { write(file,state); return; }
      const cachedOriginal = legacy.originals.get(url) || legacy.originals.get(priorReview?.additional_source) || legacy.byId.get(String(priorReview?.id));
      if (cachedOriginal) {
        const recovered = legacyCapture(cachedOriginal, date);
        if (recovered.record) {
          const record = recovered.record, sourceUrl = record.original_url;
          ingestPrivateEvidenceRecords({root,backupRoot,records:[{snapshotRef:`financing/${date}/${digest(sourceUrl).slice(0,16)}.json`,sourceUrl,dataDate:date,contentHash:record.content_hash,body:record.clean_text,metadata:record}]});
          Object.assign(row,{content_hash:record.content_hash,evidence_source_url:sourceUrl,status:'captured',reason:'original_recovered',used_existing_original:true,alternate_source:sourceUrl!==url});
        } else {row.reason = recovered.reason;row.evidence_problem = recovered.reason;}
      }
      if(row.status !== 'captured') {
      const previous = history.entries[url];
      if (!queued && receipt.content_hash && previous && previous.date !== date && previous.content_hash === receipt.content_hash) {
        Object.assign(row, { reason: 'unchanged_original_previously_reviewed', previous_date: previous.date });
      } else if (previous?.date === date && previous.content_hash && ['captured', 'awaiting_fact_review'].includes(previous.status)) {
        Object.assign(row, { content_hash: previous.content_hash, status: 'captured', reason: previous.reason || 'original_recovered' });
      } else if (receipt.content_hash && !priorReview && !queued) {
        Object.assign(row, { content_hash: receipt.content_hash, status: 'captured' });
      } else if (previous && !priorReview && !receipt.backlog && !queued) {
        Object.assign(row, { reason: 'previous_verification_attempt_requires_review', previous_date: previous.date });
      } else if (!remaining) {
        row.reason = 'capture_budget_exhausted';
      } else {
        // Reserve BEFORE network I/O. An interrupted/unknown attempt is held,
        // never silently billed or fetched again on a checkpoint restore.
        remaining--;
        Object.assign(row, { attempted: true, reason: 'attempt_interrupted_or_unknown' });
        history.entries[url] = { date, status: 'started', attempted: true };
        write(historyFile, history); write(file, state);
        let targetUrl = url;
        if(priorReview || receipt.backlog || queued) {
          const hints = [priorReview?.accepted_source, priorReview?.additional_source].filter(Boolean);
          targetUrl = hints.find(target => !history.entries[target]?.attempted) || '';
          if(!targetUrl) {
            const found = await search(row.title);
            row.search_status = found.status; row.search_reason = found.reason || '';
            targetUrl = (found.items || []).map(item=>item.url).find(target=>target!==url && !history.entries[target]?.attempted && !collection.captures?.[target]) || '';
          }
          if(!targetUrl) { row.reason = row.search_reason || 'no_alternate_original_found'; write(file,state); return; }
        }
        row.evidence_source_url = targetUrl;
        row.alternate_source = targetUrl !== url;
        history.entries[targetUrl] = {date,status:'started',attempted:true};write(historyFile,history);
        let result;
        try { result = await capture({ url:targetUrl }, { date, reader }); }
        catch { result = { status: 'pending', reason: 'original_capture_failed' }; }
        if (result.record) {
          const record = result.record;
          ingestPrivateEvidenceRecords({ root, backupRoot, records: [{ snapshotRef: `financing/${date}/${digest(targetUrl).slice(0,16)}.json`, sourceUrl: targetUrl, dataDate: date, contentHash: record.content_hash, body: record.clean_text, metadata: record }] });
          Object.assign(row, { content_hash: record.content_hash, status: 'captured', reason: result.reason || 'original_recovered' });
        } else Object.assign(row, { status: result.status === 'excluded' && targetUrl===url ? 'excluded' : 'pending', reason: targetUrl===url ? result.reason : `alternate_original_unusable:${result.reason}` });
        history.entries[url] = { ...history.entries[url], date, status: row.status, reason: row.reason, content_hash: row.content_hash };
        write(historyFile, history);
      }
      }
      write(file, state);
    }
    if (row.status !== 'captured') return;
    const sourceUrl = row.evidence_source_url || url;
    let loaded;
    try { loaded = loadPrivateEvidenceRecord(root, `evidence://${row.content_hash}`, row.content_hash, { backupRoot, sourceUrl, dataDate: date }); }
    catch { row.status='pending';row.reason='private_original_missing_restore_evidence';write(file,state);return; }
    // Only structurally usable, dated originals reach the existing semantic
    // extraction/research gates. Scope ambiguity is NOT a scope approval.
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
    history.entries[url] = { ...history.entries[url], date, status: row.status, reason: 'original_recovered', content_hash: row.content_hash };
    write(historyFile, history); write(file, state);
  };
  const leads = Object.entries(collection.captures || {});
  const currentUrls = new Set(leads.map(([url])=>url));
  for(const [url,item] of Object.entries(queue.entries)) {
    if(item.status==='pending' && item.stop_after_date < date)queue.entries[url]=deferredFollowup(item,date,{reason:item.reason});
    if(!currentUrls.has(url) && followupDue(item,date)) leads.push([url,{status:'pending',reason:item.reason,title:item.title,prior_review:item.prior_review,backlog:true}]);
  }
  for (let i = 0; i < leads.length; i += config.capture_concurrency) {
    const results = await Promise.allSettled(leads.slice(i, i + config.capture_concurrency).map(processLead));
    const failed = results.find(result => result.status === 'rejected');
    if (failed) throw failed.reason;
  }
  for(const [url,row] of Object.entries(state.entries)) {
    if(row.status === 'reviewed' || row.status === 'excluded' || row.status === 'verified') { delete queue.entries[url];continue; }
    if(!row.followup) {
      row.followup=deferredFollowup({...row,status:'pending',last_processed_date:date,prior_review:reviewed.get(url) || queue.entries[url]?.prior_review}, date,
        {attempted:row.status==='awaiting_fact_review' || row.attempted === true,reason:row.reason});
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
  for (const row of Object.values(state.entries)) {
    if (!row.raw_ids?.length) continue;
    const sourceIds = new Set(rawDocuments.filter(raw => row.raw_ids.includes(raw.raw_id) && raw.content_hash === row.content_hash).map(raw => raw.source_artifact_id));
    const eventIds = new Set(eventSources.filter(link => sourceIds.has(link.source_artifact_id)).map(link => link.event_id));
    const cardEvents = card => [card.triggered_by_event_id, ...(card.source_event_ids || [])];
    const cards = (research.cards || []).filter(card => cardEvents(card).some(id => eventIds.has(id)) || (card.research_sources || []).some(source => row.raw_ids.includes(source.raw_id) && source.content_hash === row.content_hash));
    row.unresolved_event_ids = [...eventIds].filter(id => !cards.some(card => cardEvents(card).includes(id)));
    row.pending_reasons = [...new Set([
      ...qa.filter(item => row.raw_ids.includes(item.asset_id) || sourceIds.has(item.source_ref) || eventIds.has(item.asset_id)).map(item => item.reason),
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
    const complete = !row.alternate_source && !row.unresolved_event_ids.length && row.results.length > 0 && row.results.every(result => result.accepted || result.scope === 'excluded');
    row.status = complete ? row.results.some(result => result.accepted) ? 'verified' : 'excluded' : 'pending';
    row.reason = row.alternate_source && cards.length ? 'alternate_event_requires_original_lead_identity_review' : complete ? 'existing_gates_reconciled' : cards.length ? 'funding_or_taxonomy_gate_pending' : 'no_accepted_financing_event_manual_review_required';
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
      if(['verified','excluded','reviewed'].includes(row.status))delete queue.entries[url];
      else if(queue.entries[url]) {queue.entries[url].reason=row.reason;row.followup=queue.entries[url];}
    }
    write(queueFile,queue);
  }
  write(file, state);
  return { version, status: state.status, counts: state.counts, ledger: 'verification.json' };
}
