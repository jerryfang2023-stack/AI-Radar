import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {collect} from '../collect.mjs';
import {captureOriginal} from '../capture.mjs';
import {verifyPending,finishVerification} from '../verify.mjs';
import {dispositionResolver,reconcileDispositions} from '../verification-dispositions.mjs';
import {read,write,digest} from '../state.mjs';

const date='2026-10-07',previousDate='2026-10-06',url='https://example.com/source';
const forbidden=()=>{throw new Error('unexpected source request');};
async function fixture(t) {
  const base=fs.mkdtempSync(path.join(os.tmpdir(),'financing-disposition-'));t.after(()=>fs.rmSync(base,{recursive:true,force:true}));
  const root=path.join(base,'repo');fs.mkdirSync(root);
  const options={root,backupRoot:path.join(base,'private'),directory:path.join(root,'agent-workflow/reports/financing',date),date};
  const body='Acme develops enterprise AI software and raised $5 million in seed funding. '.repeat(12);
  await collect({...options,supplements:[],gateway:{search:async()=>[{url,title:'AI software raises seed funding'}]},
    feed:async()=>({complete:true,items:[],discovered_count:0,pages:1,failures:[]}),
    capture:lead=>captureOriginal(lead,{date,fetcher:async()=>new Response(`<meta property="article:published_time" content="${previousDate}"><article><h1>AI software raises seed funding</h1>${body}</article>`)})});
  const collection=read(path.join(options.directory,'collection.json'));
  const receipt=collection.captures[url],hash=receipt.content_hash;
  const queueFile=path.join(options.backupRoot,'financing-monitor-state/verification-queue.json');
  write(queueFile,{version:'FINANCING-VERIFICATION-QUEUE-1',entries:{[url]:{source_url:url,status:'pending',reason:'previous_verification_attempt_requires_review',origin_date:previousDate,rounds:0,next_due_date:date,stop_after_date:'2026-10-13'}}});
  const review={id:1,url,status:'not_financing',reason:'fixture source disposition',reviewed_at:`${previousDate}T10:00:00Z`,review_basis:'original_text_and_review',original_capture:{status:'captured',content_hash:hash}};
  const oldFile=path.join(root,'agent-workflow/reports/financing',previousDate,'lead-review.json');
  write(oldFile,{version:'FINANCING-LEAD-REVIEW-1',date:previousDate,reviewer:'Responsible fixture reviewer',rows:[review]});
  return {options,receipt,hash,queueFile,review,oldFile,body};
}
const resolve=f=>dispositionResolver(f.options)(url,f.receipt,read(f.queueFile).entries[url]);

test('only same URL and same captured body inherit a bounded responsible exclusion',async t=>{
  const f=await fixture(t);const result=resolve(f);
  assert.equal(result.action,'close');assert.equal(result.reason,'inherited_source_disposition');
  assert.equal(result.proof.reviewed_at,f.review.reviewed_at);
  assert.equal(dispositionResolver(f.options)('https://example.com/same-company-other-round',f.receipt).action,'retain');
  assert.equal(dispositionResolver({...f.options,date:'2026-10-14'})(url,f.receipt).action,'retain');
});
test('changed or missing current original never borrows an old queue hash',async t=>{
  const f=await fixture(t);const resolver=dispositionResolver(f.options);
  assert.equal(resolver(url,{...f.receipt,content_hash:digest('changed')}).reason,'reviewed_original_changed');
  assert.equal(resolver(url,{}, {content_hash:f.hash}).reason,'current_original_hash_missing');
});
test('unresolvable evidence and source binding failure retain the queue',async t=>{
  const f=await fixture(t);fs.renameSync(path.join(f.options.backupRoot,'catalog.jsonl'),path.join(f.options.backupRoot,'catalog.saved'));
  assert.equal(resolve(f).reason,'disposition_private_evidence_missing_or_invalid');
  assert.equal(reconcileDispositions(f.options).closed_count,0);
});
test('newer private review or conflicting private body prevents stale public closure',async t=>{
  const f=await fixture(t),resolver=dispositionResolver(f.options);
  assert.equal(resolver(url,f.receipt,{prior_review:{reviewed_at:`${date}T01:00:00Z`,status:'pending_company_identity'}}).reason,'newer_private_review_preserved');
  assert.equal(resolver(url,f.receipt,{content_hash:digest('new private body')}).reason,'private_evidence_conflicts_with_collection');
});
test('latest pending review blocks historical exclusion and accepted original is never financing approval',async t=>{
  const f=await fixture(t);
  const currentFile=path.join(f.options.directory,'lead-review.json');
  write(currentFile,{version:'FINANCING-LEAD-REVIEW-1',date,reviewer:'Responsible fixture reviewer',rows:[{...f.review,status:'pending_ai_scope',reviewed_at:`${date}T01:00:00Z`}]});
  assert.equal(resolve(f).reason,'responsible_disposition_still_pending');
  write(currentFile,{version:'FINANCING-LEAD-REVIEW-1',date,reviewer:'Responsible fixture reviewer',rows:[{...f.review,status:'accepted_original',reviewed_at:`${date}T01:00:00Z`}]});
  assert.equal(resolve(f).reason,'original_acceptance_requires_fact_and_funding_gates');
  const collection=read(path.join(f.options.directory,'collection.json'));collection.captures[url].status='pending';write(path.join(f.options.directory,'collection.json'),collection);
  const result=await verifyPending({...f.options,capture:forbidden,search:forbidden});
  assert.equal(result.entries[url].status,'pending');
  assert.ok(read(f.queueFile).entries[url]);
});
test('historical same-company or duplicate assertions require event binding',async t=>{
  const f=await fixture(t),ledger=read(f.oldFile);ledger.rows[0].status='already_covered';write(f.oldFile,ledger);
  assert.equal(resolve(f).reason,'disposition_requires_event_or_duplicate_binding');
});
test('QA exclusion alone cannot close a lead; strict review requires all exact source spans',async t=>{
  const f=await fixture(t);fs.unlinkSync(f.oldFile);
  write(path.join(f.options.root,`01-SiteV2/content/11-databases/data-center-v4/${date}/qa-queue.json`),[{asset_id:'RAW-any',reason:'event_not_ai_relevant',status:'review_optional'}]);
  assert.equal(resolve(f).action,'retain');
  const file=path.join(f.options.directory,'disposition-review.json');
  const ledger={version:'FINANCING-DISPOSITION-REVIEW-1',date,reviewer:'Responsible fixture reviewer',rows:[{...f.review,content_hash:f.hash,reviewed_at:`${date}T01:00:00Z`,evidence_sources:[{source_url:url,content_hash:f.hash,quote:'Acme develops enterprise AI software'}]}]};
  write(file,ledger);assert.equal(resolve(f).reason,'responsible_source_disposition');
  ledger.rows[0].evidence_sources[0].quote='invented quote';write(file,ledger);
  assert.equal(resolve(f).reason,'disposition_quote_not_in_original');
});
test('offline reconciliation uses compare-and-set, preserves other entries and survives receipt interruption',async t=>{
  const f=await fixture(t),q=read(f.queueFile);q.entries.other={status:'pending',reason:'newer private work',origin_date:date};write(f.queueFile,q);
  const plan=reconcileDispositions(f.options);assert.equal(plan.closed_count,1);assert.deepEqual(read(f.queueFile),q);
  assert.throws(()=>reconcileDispositions({...f.options,apply:true,expectedQueueHash:'stale'}),/queue_changed/);
  const applied=reconcileDispositions({...f.options,apply:true,expectedQueueHash:digest(q)});assert.equal(applied.after_count,1);
  assert.deepEqual(read(f.queueFile).entries,{other:q.entries.other});
  const auditDir=path.join(f.options.backupRoot,'financing-monitor-state/verification-reconciliations'),file=path.join(auditDir,fs.readdirSync(auditDir)[0]);
  const audit=read(file);audit.status='prepared';write(file,audit);
  assert.equal(reconcileDispositions({...f.options,apply:true}).closed_count,0);
  assert.equal(read(file).status,'applied');assert.deepEqual(read(f.queueFile).entries,{other:q.entries.other});
});
test('daily verify inherits without network and finish does not reopen the responsible exclusion',async t=>{
  const f=await fixture(t);
  const prepared=await verifyPending({...f.options,capture:forbidden,search:forbidden});
  assert.equal(prepared.entries[url].status,'excluded');assert.deepEqual(read(f.queueFile).entries,{});
  assert.equal(finishVerification(f.options).counts.excluded,1);
  await verifyPending({...f.options,capture:forbidden,search:forbidden});
  assert.equal(finishVerification(f.options).counts.excluded,1);
});
test('finish restores a held item if evidence disappears and preserves a newer private decision',async t=>{
  for(const newer of [false,true]){
    const f=await fixture(t);await verifyPending({...f.options,capture:forbidden,search:forbidden});
    if(newer){const q=read(f.queueFile);q.entries[url]={status:'pending',reason:'new responsible review',prior_review:{reviewed_at:`${date}T02:00:00Z`}};write(f.queueFile,q);}
    else fs.renameSync(path.join(f.options.backupRoot,'catalog.jsonl'),path.join(f.options.backupRoot,'catalog.saved'));
    assert.equal(finishVerification(f.options).counts.excluded,0);
    assert.equal(read(f.queueFile).entries[url].reason,newer?'new responsible review':'disposition_evidence_changed_restore_review');
  }
});

test('daily integration respects a newer strict pending review over older same-day exclusion',async t=>{
  const f=await fixture(t);
  write(path.join(f.options.directory,'lead-review.json'),{version:'FINANCING-LEAD-REVIEW-1',date,reviewer:'Responsible fixture reviewer',rows:[{...f.review,reviewed_at:`${date}T01:00:00Z`}]});
  write(path.join(f.options.directory,'disposition-review.json'),{version:'FINANCING-DISPOSITION-REVIEW-1',date,reviewer:'Responsible fixture reviewer',rows:[{...f.review,status:'pending_ai_scope',reason:'new scope evidence needed',reviewed_at:`${date}T02:00:00Z`}]});
  const result=await verifyPending({...f.options,capture:forbidden,search:forbidden});
  assert.equal(result.entries[url].status,'awaiting_fact_review');
  assert.equal(result.entries[url].prior_reason,'new scope evidence needed');
  assert.ok(read(f.queueFile).entries[url]);assert.equal(finishVerification(f.options).counts.excluded,0);
});

test('invalid strict exclusion evidence cannot fall back to an older unbound current review',async t=>{
  const f=await fixture(t);
  write(path.join(f.options.directory,'lead-review.json'),{version:'FINANCING-LEAD-REVIEW-1',date,reviewer:'Responsible fixture reviewer',rows:[{...f.review,reviewed_at:`${date}T01:00:00Z`}]});
  write(path.join(f.options.directory,'disposition-review.json'),{version:'FINANCING-DISPOSITION-REVIEW-1',date,reviewer:'Responsible fixture reviewer',rows:[{...f.review,content_hash:digest('changed'),reviewed_at:`${date}T02:00:00Z`,evidence_sources:[]}]});
  const before=read(f.queueFile),result=await verifyPending({...f.options,capture:forbidden,search:forbidden});
  assert.equal(result.entries[url].status,'pending');assert.equal(result.entries[url].disposition.reason,'reviewed_original_changed');
  assert.deepEqual(read(f.queueFile),before);
});
