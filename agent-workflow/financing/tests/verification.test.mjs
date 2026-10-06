import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { verifyPending, finishVerification } from '../verify.mjs';
import { captureOriginal } from '../capture.mjs';
import { collect } from '../collect.mjs';
import { read, write, digest } from '../state.mjs';
import { config } from '../discovery.mjs';
import { classificationInput } from '../taxonomy.mjs';
import { acceptedPublicationStatus } from '../dispatch-state.mjs';
import { selectRunDate } from '../vps-supervisor.mjs';
const date = '2026-10-06', url = 'https://example.com/round';
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'financing-verification-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const repo = path.join(root, 'repo'); fs.mkdirSync(repo);
  return { root: repo, directory: path.join(repo, 'reports'), backupRoot: path.join(root, 'private'), date };
}
function seed(options, captures = { [url]: { status: 'pending', reason: 'original_unreadable' } }) {
  write(path.join(options.directory, 'collection.json'), { version: config.version, date, accepted: true, captures, raw_ids: [], counts: { pending: Object.values(captures).filter(row => row.status === 'pending').length } });
}
const html = '<meta property="article:published_time" content="2026-10-05"><article><h1>AI software serving robotics startups raises funding</h1>' + 'Acme develops AI software for enterprises and raises $5 million in a seed round. '.repeat(12) + '</article>';
const capture = lead => captureOriginal(lead, { date, fetcher: async () => new Response(html) });
const forbidden = () => { throw new Error('unexpected network call'); };

test('pending follow-up recovers only its original, preserves collection, merges supplement and resumes without I/O', async t => {
  const options = fixture(t); seed(options);
  write(path.join(options.directory, 'supplemental.json'), { version: 'FINANCING-SUPPLEMENT-1', date, accepted: true, raw_ids: ['RAW-existing'] });
  const before = fs.readFileSync(path.join(options.directory, 'collection.json'), 'utf8');
  let calls = 0;
  const result = await verifyPending({ ...options, capture: async lead => { calls++; return capture(lead); } });
  const row = result.entries[url];
  assert.equal(row.status, 'awaiting_fact_review');
  assert.equal(row.checks.amount, 'pending');
  assert.equal(read(path.join(options.directory, 'supplemental.json')).raw_ids.length, 2);
  await verifyPending({ ...options, capture: forbidden });
  assert.equal(calls, 1);
  assert.equal(fs.readFileSync(path.join(options.directory, 'collection.json'), 'utf8'), before);
  assert.ok(!JSON.stringify(result).includes('Acme develops'));
  const summary = finishVerification(options);
  assert.equal(summary.counts.pending, 1);
  assert.equal(summary.counts.verified, 0);
});

test('scope-ambiguous originals are stored privately during collection and reused for semantic review', async t => {
  const options = fixture(t);
  const body = html.replace('AI software serving robotics startups', 'Humanoid robot maker');
  await collect({ ...options, gateway: { search: async () => [{ url, title: 'AI company raises funding' }] }, feed: async () => ({ complete: true, items: [], discovered_count: 0, pages: 1, failures: [] }), supplements: [], capture: lead => captureOriginal(lead, { date, fetcher: async () => new Response(body) }) });
  const collection = read(path.join(options.directory, 'collection.json'));
  assert.equal(collection.captures[url].status, 'pending');
  assert.ok(collection.captures[url].content_hash);
  assert.deepEqual(collection.raw_ids, []);
  const state = await verifyPending({ ...options, capture: forbidden });
  assert.equal(state.entries[url].status, 'awaiting_fact_review');
  assert.equal(finishVerification(options).counts.verified, 0);
});

test('unknown attempt survives interruption and cross-day restart without automatic retry', async t => {
  const options = fixture(t); seed(options);
  write(path.join(options.backupRoot, 'financing-monitor-state/verification-attempts.json'), { entries: { [url]: { date: '2026-10-05', status: 'started' } } });
  const state = await verifyPending({ ...options, capture: forbidden });
  assert.equal(state.entries[url].status, 'pending');
  assert.match(state.entries[url].reason, /previous/);
  await verifyPending({ ...options, capture: forbidden });
});

test('HTTP follow-up shares capture ceiling and leaves explicit budget reason', async t => {
  const options = fixture(t);
  seed(options, { ...Object.fromEntries(Array.from({ length: config.max_capture_attempts - 1 }, (_, i) => [`https://example.com/${i}`, { status: 'excluded' }])), [url]: { status: 'pending', reason: 'fetch_failed' } });
  const state = await verifyPending({ ...options, capture: forbidden });
  assert.equal(state.entries[url].reason, 'capture_budget_exhausted');
});

test('missing date, failed original and excluded original never become verified financing', async t => {
  for (const reason of ['original_date_missing', 'original_http_403', 'outside_daily_window']) {
    const options = fixture(t); seed(options);
    const state = await verifyPending({ ...options, capture: async () => ({ status: reason === 'outside_daily_window' ? 'excluded' : 'pending', reason }) });
    assert.equal(state.entries[url].reason, reason);
    assert.equal(finishVerification(options).counts.verified, 0);
    await verifyPending({ ...options, capture: forbidden });
  }
});

test('PR1191 reuses completed dispositions and admits pending accepted raw to actual fact review', async t => {
  const options = fixture(t);
  const source = new URL('../../reports/financing/2026-10-06/', import.meta.url);
  for (const name of ['collection.json', 'pending247-review.json', 'supplemental.json']) write(path.join(options.directory, name), JSON.parse(fs.readFileSync(new URL(name, source), 'utf8')));
  const state = await verifyPending({ ...options, capture: forbidden, search:async()=>({status:'held',reason:'test_no_provider',items:[]}) });
  assert.equal(Object.keys(state.entries).length, 247);
  assert.equal(Object.values(state.entries).filter(row => row.status === 'pending').length, 31);
  assert.equal(Object.values(state.entries).filter(row => row.status === 'awaiting_fact_review').length, 8);
  assert.equal(Object.values(state.entries).filter(row => row.status === 'reviewed').length, 208);
  await verifyPending({ ...options, capture: forbidden });
});

test('reconciliation requires current classification and funding gates and never substitutes cumulative amount', async t => {
  const options = fixture(t); seed(options);
  const state = await verifyPending({ ...options, capture });
  const row = state.entries[url];
  const card = { funding_insight_id: 'FI-1', triggered_by_event_id: 'EV-1', company: { name: 'Acme', evidence_refs: [{ source_id: 'S1', quote: 'AI software for enterprises', quote_hash: 'quote' }] }, financing: { round: 'Seed', amount: 'undisclosed', total_raised: '$100 million', announced_at: '2026-10-05' }, research_sources: [{ raw_id: row.raw_ids[0], content_hash: row.content_hash }], auto_publish_gate: { passed: true } };
  const researchFile = path.join(options.root, `01-SiteV2/content/12-applications/funding-insights/${date}.json`);
  const decisionFile = path.join(options.root, '01-SiteV2/content/12-applications/financing-taxonomy/decisions.json');
  write(researchFile, { cards: [card] });
  write(decisionFile, { decisions: { 'EV-1': { id: 'EV-1', input_hash: 'stale', scope: 'excluded', exclusion_reason: 'embodied_robotics', evidence_indices: [0], rationale: 'evidence' } } });
  assert.equal(finishVerification(options).counts.pending, 1);
  assert.equal(read(path.join(options.directory, 'verification.json')).entries[url].results[0].amount, 'undisclosed');
  const decision = read(decisionFile); decision.decisions['EV-1'].input_hash = classificationInput(card).input_hash; write(decisionFile, decision);
  assert.equal(finishVerification(options).counts.excluded, 1);
  card.auto_publish_gate.passed = false; write(researchFile, { cards: [card] });
  assert.equal(finishVerification(options).counts.verified, 0);
});

test('tampered collection and foreign supplemental checkpoint fail before capture', async t => {
  const options = fixture(t); seed(options);
  await verifyPending({ ...options, capture: async () => ({ status: 'pending', reason: 'unreadable' }) });
  const file = path.join(options.directory, 'collection.json'), collection = read(file);
  collection.counts.pending++; write(file, collection);
  await assert.rejects(verifyPending({ ...options, capture: forbidden }), /checkpoint_identity/);
  const other = fixture(t); seed(other);
  write(path.join(other.directory, 'supplemental.json'), { version: 'FINANCING-SUPPLEMENT-1', date: '2026-10-05', accepted: true, raw_ids: [] });
  await assert.rejects(verifyPending({ ...other, capture: forbidden }), /supplement_required/);
});

test('legacy pending is not a completed supervisor state; bounded pending does not loop forever', () => {
  const clock = { date, minute: 500 };
  assert.equal(selectRunDate([{ date: '2026-10-05', status: 'pending_verification' }], clock), '2026-10-05');
  assert.equal(selectRunDate([{ date: '2026-10-05', status: 'pending_verification', verification: { status: 'completed' } }], clock), date);
  assert.equal(acceptedPublicationStatus({ date, status: 'pending_verification' }, date), 'verification_required');
  assert.equal(acceptedPublicationStatus({ date, status: 'pending_verification', verification: { status: 'completed' } }, date), 'pending_verification');
});

test('durable private capture receipt restores lost public checkpoint without refetching', async t => {
  const options = fixture(t); seed(options);
  const first = await verifyPending({ ...options, capture });
  fs.unlinkSync(path.join(options.directory, 'verification.json'));
  const resumed = await verifyPending({ ...options, capture: forbidden });
  assert.deepEqual(resumed.entries[url].raw_ids, first.entries[url].raw_ids);
  assert.equal(resumed.entries[url].status, 'awaiting_fact_review');
  assert.equal(read(path.join(options.directory, 'supplemental.json')).raw_ids.length, 1);
});

test('daily workflow orders capture, follow-up, private persistence, then existing gates', () => {
  const workflow = fs.readFileSync(new URL('../../../.github/workflows/funding-daily-pr.yml', import.meta.url), 'utf8');
  const stages = ['--phase=collect', '--phase=verify', 'Persist evidence before dependent work', '--phase=produce'];
  for (let i = 1; i < stages.length; i++) assert.ok(workflow.indexOf(stages[i - 1]) < workflow.indexOf(stages[i]));
  assert.match(workflow, /steps\.verification\.outcome == 'success'/);
  const runner = fs.readFileSync(new URL('../run.mjs', import.meta.url), 'utf8');
  assert.ok(runner.indexOf('await verifyPending(') < runner.indexOf('await runStages('));
  assert.match(runner, /digest\(\[intake, extractionScope\]\)/);
});

test('private attempt reservations still consume capture budget when public checkpoint is missing', async t => {
  const options = fixture(t); seed(options);
  write(path.join(options.backupRoot, 'financing-monitor-state/verification-attempts.json'), { entries: Object.fromEntries(Array.from({ length: config.max_capture_attempts - 1 }, (_, i) => [`https://example.com/earlier-${i}`, { date, status: 'started', attempted: true }])) });
  const state = await verifyPending({ ...options, capture: forbidden });
  assert.equal(state.entries[url].reason, 'capture_budget_exhausted');
});

test('pending legacy lead captures one alternative but requires identity binding before fact admission', async t => {
  const options=fixture(t);seed(options);
  write(path.join(options.directory,'lead-review.json'),{version:'FINANCING-LEAD-REVIEW-1',date,rows:[{id:1,url,title:'Acme AI raises seed funding',status:'pending_ai_scope',reason:'AI product unclear',reviewed_at:'2026-10-06T00:00:00Z'}]});
  let searches=0,captures=0;
  const alternative='https://example.com/issuer-announcement';
  const state=await verifyPending({...options,search:async title=>{searches++;assert.match(title,/Acme/);return{status:'completed',items:[{url:alternative}]};},capture:async lead=>{captures++;assert.equal(lead.url,alternative);return capture(lead);}});
  assert.equal(searches,1);assert.equal(captures,1);
  assert.equal(state.entries[url].status,'pending');
  assert.equal(state.entries[url].reason,'alternate_original_requires_identity_review');
  assert.equal(read(path.join(options.directory,'supplemental.json')),null);
  assert.equal(state.entries[url].evidence_source_url,alternative);
  assert.equal(state.entries[url].alternate_source,true);
  await verifyPending({...options,search:forbidden,capture:forbidden});
});

test('next existing daily verification consumes due backlog and stops after two bounded passes', async t => {
  const options=fixture(t);seed(options);
  const first=await verifyPending({...options,capture:async()=>({status:'pending',reason:'original_unreadable'})});
  assert.equal(first.entries[url].followup.next_due_date,'2026-10-07');
  const later={...options,date:'2026-10-07',directory:path.join(options.root,'next-day')};
  write(path.join(later.directory,'collection.json'),{version:config.version,date:later.date,accepted:true,captures:{},raw_ids:[],counts:{pending:0}});
  let searched=0;
  const second=await verifyPending({...later,search:async()=>{searched++;return{status:'completed',items:[]};},capture:forbidden});
  assert.equal(searched,1);
  assert.equal(second.entries[url].followup.status,'needs_attention');
  assert.equal(second.entries[url].followup.next_due_date,null);
  assert.equal(second.entries[url].followup.rounds,2);
  await verifyPending({...later,search:forbidden,capture:forbidden});
});

test('new responsible review evidence changes reactivate only that lead, preserving earlier request receipts', async t => {
  const options=fixture(t);seed(options);
  const file=path.join(options.directory,'lead-review.json');
  const review={version:'FINANCING-LEAD-REVIEW-1',date,rows:[{id:1,url,title:'Acme AI raises funding',status:'pending_ai_scope',reason:'unknown',reviewed_at:'2026-10-06'}]};write(file,review);
  await verifyPending({...options,search:async()=>({status:'completed',items:[]}),capture:forbidden});
  review.rows[0].additional_source='https://example.com/new-original';review.rows[0].source_binding={source_url:'https://example.com/new-original',reviewed_by:'test reviewer',reviewed_at:date,reason:'same company and round confirmed'};review.rows[0].reason='new issuer evidence supplied';write(file,review);
  let calls=0;
  const state=await verifyPending({...options,search:forbidden,capture:async lead=>{calls++;return capture(lead);}});
  assert.equal(calls,1);assert.equal(state.entries[url].status,'awaiting_fact_review');
});

test('alternate source identity survives missing public checkpoint with and without queue', async t => {
  for(const removeQueue of [false,true]) {
    const options=fixture(t);seed(options);
    const alternative='https://example.com/alternate';
    write(path.join(options.directory,'lead-review.json'),{version:'FINANCING-LEAD-REVIEW-1',date,rows:[{id:1,url,title:'Acme AI financing',status:'pending_ai_scope',reason:'unknown',reviewed_at:date,additional_source:alternative,source_binding:{source_url:alternative,reviewed_by:'test reviewer',reviewed_at:date,reason:'same company and round confirmed'}}]});
    const first=await verifyPending({...options,capture});
    assert.equal(first.entries[url].alternate_source,true);
    fs.unlinkSync(path.join(options.directory,'verification.json'));
    if(removeQueue)fs.unlinkSync(path.join(options.backupRoot,'financing-monitor-state/verification-queue.json'));
    const resumed=await verifyPending({...options,search:forbidden,capture:forbidden});
    assert.equal(resumed.entries[url].alternate_source,true);
    assert.equal(resumed.entries[url].evidence_source_url,alternative);
  }
});

test('cross-day prepare-only interruption reuses private original without search or another round', async t => {
  const options=fixture(t);seed(options);
  const first=await verifyPending({...options,capture});
  assert.equal(first.entries[url].followup.rounds,1);
  for(const nextDate of ['2026-10-07','2026-10-12']) {
    const later={...options,date:nextDate,directory:path.join(options.root,nextDate)};
    write(path.join(later.directory,'collection.json'),{version:config.version,date:nextDate,accepted:true,captures:{},raw_ids:[],counts:{pending:0}});
    const resumed=await verifyPending({...later,search:forbidden,capture:forbidden});
    assert.equal(resumed.entries[url].status,'awaiting_fact_review');
    assert.equal(resumed.entries[url].followup.rounds,1);
    assert.equal(resumed.entries[url].content_hash,first.entries[url].content_hash);
    assert.equal(read(path.join(later.directory,'supplemental.json')).raw_ids.length,1);
    assert.equal(resumed.entries[url].followup.status,'pending');
  }
});

test('fact completion is explicit and only recorded for raw present in gated fact output', async t => {
  const options=fixture(t);seed(options);
  const first=await verifyPending({...options,capture});
  finishVerification(options);
  const queueFile=path.join(options.backupRoot,'financing-monitor-state/verification-queue.json');
  assert.equal(read(queueFile).entries[url].fact_review_completed,false);
  write(path.join(options.root,`01-SiteV2/content/11-databases/data-center-v4/${date}/raw-documents.json`),[{raw_id:first.entries[url].raw_ids[0],content_hash:first.entries[url].content_hash,source_artifact_id:'S-real'}]);
  finishVerification(options);
  assert.equal(read(queueFile).entries[url].fact_review_completed,true);
  const later={...options,date:'2026-10-07',directory:path.join(options.root,'next-day')};
  write(path.join(later.directory,'collection.json'),{version:config.version,date:later.date,accepted:true,captures:{},raw_ids:[],counts:{pending:0}});
  let searches=0;
  const next=await verifyPending({...later,search:async()=>{searches++;return{status:'completed',items:[]};},capture:forbidden});
  assert.equal(searches,1);
  assert.equal(next.entries[url].followup.rounds,2);
  assert.equal(next.entries[url].followup.status,'needs_attention');
});


test('cross-day recovery keeps reviewed alternate source binding before admission', async t => {
  const options=fixture(t);seed(options);
  const alternative='https://example.com/issuer';
  write(path.join(options.directory,'lead-review.json'),{version:'FINANCING-LEAD-REVIEW-1',date,rows:[{id:1,url,title:'Acme AI financing',status:'pending_ai_scope',reason:'unknown',reviewed_at:date,additional_source:alternative,source_binding:{source_url:alternative,reviewed_by:'responsible reviewer',reviewed_at:date,reason:'same issuer and round'}}]});
  await verifyPending({...options,capture});
  const later={...options,date:'2026-10-07',directory:path.join(options.root,'next-day')};
  write(path.join(later.directory,'collection.json'),{version:config.version,date:later.date,accepted:true,captures:{},raw_ids:[],counts:{pending:0}});
  const resumed=await verifyPending({...later,search:forbidden,capture:forbidden});
  assert.equal(resumed.entries[url].evidence_source_url,alternative);
  assert.equal(resumed.entries[url].alternate_source,true);
  assert.equal(resumed.entries[url].source_identity_reviewed,true);
  assert.equal(resumed.entries[url].followup.rounds,1);
});
