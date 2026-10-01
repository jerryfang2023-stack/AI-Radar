import fs from 'node:fs';
import path from 'node:path';
import { discover, config } from './discovery.mjs';
import { captureOriginal } from './capture.mjs';
import { read, write, digest } from './state.mjs';
import { createSearchGateway } from '../tools/lib/search-gateway.mjs';
import { ingestPrivateEvidenceRecords } from '../tools/lib/private-evidence-backup.mjs';
import { loadPrivateEvidenceRecord } from '../tools/lib/private-evidence-store.mjs';
import { buildSourceIntake, mergeSourceIntakes, readSourceIntake, sourceIntakePath } from '../tools/lib/source-intake-v1.mjs';

export async function collect({ root, directory, backupRoot, date, gateway, feed, capture = captureOriginal }) {
  const file = path.join(directory, 'collection.json');
  const previous = read(file);
  if (previous && (previous.date !== date || previous.version !== config.version)) throw new Error('collection_checkpoint_identity_mismatch');
  // Downstream recovery has no authority to re-run accepted collection.
  if (previous?.accepted) {
    const intake = readSourceIntake(root, date);
    if (!intake || !previous.raw_ids.every(id => intake.payload.raw_documents.some(row => row.raw_id === id))) throw new Error('accepted_intake_missing_restore_checkpoint');
    return previous;
  }
  gateway ||= createSearchGateway({ cacheDir: path.join(directory, 'search-cache'), maxRequests: config.max_search_requests });
  const state = previous || { version: config.version, date, captures: {} };
  const discovered = await discover({ date, search: gateway.search, feed, previous: state.receipts,
    onPage: page => write(path.join(directory, 'aihot', `${page.page}.json`), page),
    save: receipts => { state.receipts = receipts; write(file, state); },
  });
  state.discovery_complete = discovered.complete; state.failed_queries = discovered.failed;
  state.search_health = gateway.status?.() || {}; state.search_attempts = gateway.attempts || [];
  const remaining = discovered.leads.filter(lead => !state.captures[lead.url]);
  const batch = remaining.slice(0, config.max_capture_attempts);
  for (let i = 0; i < batch.length; i += config.capture_concurrency) {
    const results = await Promise.all(batch.slice(i, i + config.capture_concurrency).map(async lead => {
      try { return { lead, result: await capture(lead, { date }) }; }
      catch (error) { return { lead, result: { status: 'pending', reason: error.message } }; }
    }));
    const records = results.filter(({ result }) => result.status === 'accepted').map(({ lead, result }) => ({
      snapshotRef: `financing/${date}/${digest(lead.url).slice(0,16)}.json`,
      sourceUrl: lead.url, dataDate: date, contentHash: result.record.content_hash, body: result.record.clean_text, metadata: result.record,
    }));
    // Persist originals before their accepted receipts. Public receipts contain no bodies.
    if (records.length) ingestPrivateEvidenceRecords({ root, backupRoot, records });
    for (const { lead, result } of results) {
      const { record, ...receipt } = result;
      state.captures[lead.url] = { ...receipt, coverage: lead.coverage || [],
        ...(record ? { content_hash: record.content_hash, source_url: lead.url } : {}) };
    }
    write(file, state);
  }
  const entries = Object.values(state.captures).filter(row => row.status === 'accepted').map(row => {
    const loaded = loadPrivateEvidenceRecord(root, `evidence://${row.content_hash}`, row.content_hash, { backupRoot, sourceUrl: row.source_url, dataDate: date });
    return { record: loaded.raw, jsonPath: path.join(root, loaded.entry.snapshot_ref), pooled: true };
  });
  const intake = buildSourceIntake({ root, date, entries });
  intake.source_artifacts.forEach(row => { row.snapshot_refs = [`evidence://${row.content_hash}`]; });
  intake.raw_documents.forEach(row => { row.body_ref = `evidence://${row.content_hash}`; });
  write(sourceIntakePath(root, date), mergeSourceIntakes(readSourceIntake(root, date)?.payload, intake));
  state.raw_ids = intake.raw_documents.map(row => row.raw_id);
  state.unattempted = Math.max(0, remaining.length - batch.length);
  state.counts = { leads: discovered.leads.length, accepted_originals: entries.length, pending: Object.values(state.captures).filter(row => row.status === 'pending').length, excluded: Object.values(state.captures).filter(row => row.status === 'excluded').length };
  state.accepted = discovered.complete && state.unattempted === 0;
  state.status = state.accepted ? entries.length ? 'accepted' : 'no_verified_new_financing' : 'incomplete';
  write(file, state);
  if (!state.accepted) throw new Error(`collection_incomplete:${state.failed_queries.join(',')};remaining=${state.unattempted}`);
  return state;
}
