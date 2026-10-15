import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {reconcileDispatchAttempts,dispatchRecoveryAllowed,completedReview,nextReviewAttempt,reviewRetryDue} from '../recovery-policy.mjs';
import {persistEvidence,recoverEvidence,checkpointEvidenceHashes} from '../evidence-sync.mjs';
import {registerPublicationHolds,mayResearchHeldEvent} from '../publication-holds.mjs';
import {read,write,digest} from '../state.mjs';

const date='2026-10-16',now=Date.parse(date+'T01:00:00Z');
function fixture(t){const dir=fs.mkdtempSync(path.join(os.tmpdir(),'recovery-guards-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;}
test('unknown dispatch is reconciled before retry, with two absent observations',()=>{
  const attempts=[{status:'unknown',started_at:new Date(now-60000).toISOString()}];
  const first=reconcileDispatchAttempts(attempts,[],date,now);
  assert.equal(first[0].status,'unknown');
  assert.equal(reconcileDispatchAttempts(first,[],date,now+599999)[0].status,'unknown');
  assert.equal(reconcileDispatchAttempts(first,[],date,now+600000)[0].status,'not_submitted');
  const run={id:9,display_title:`Financing ${date}`,event:'workflow_dispatch',head_branch:'main',created_at:new Date(now).toISOString()};
  assert.deepEqual(reconcileDispatchAttempts(first,[run],date,now)[0].observed_run_ids,[9]);
  assert.equal(reconcileDispatchAttempts(first,[{...run,head_branch:'untrusted'}],date,now)[0].status,'unknown');
});
test('accepted recovery uses cooldown independently of discovery attempts',()=>{
  const discovery=Array(3).fill({status:'submitted',started_at:new Date(now-86400000).toISOString()});
  assert.equal(dispatchRecoveryAllowed({dispatch_attempts:discovery},{status:'planned'},now),false);
  assert.equal(dispatchRecoveryAllowed({dispatch_attempts:discovery},{status:'planned',resume_run_id:1},now),true);
  const recovery={status:'submitted',resume_run_id:1,started_at:new Date(now-1000).toISOString()};
  assert.equal(dispatchRecoveryAllowed({dispatch_attempts:[...discovery,recovery]},{status:'planned',resume_run_id:2},now),false);
  assert.equal(dispatchRecoveryAllowed({dispatch_attempts:[...discovery,recovery]},{status:'planned',resume_run_id:2},now+600000),true);
});
test('execution failure can retry; substantive holds remain completed decisions',()=>{
  const identity={date,head:'a'.repeat(40)},hold={date,head_sha:identity.head,verdict:'hold',checks:{sources:false,facts:false,scope:false,classification:false,preservation:true},evidence:[],issues:['missing evidence']};
  assert.equal(completedReview(hold,identity),true);
  assert.equal(completedReview({...hold,verdict:'unknown'},identity),false);
  assert.equal(completedReview({...hold,head_sha:'b'.repeat(40)},identity),false);
  const retry=nextReviewAttempt({count:5},now);assert.equal(retry.count,6);
  assert.equal(reviewRetryDue(retry,now+3599999),false);assert.equal(reviewRetryDue(retry,now+3600000),true);
});
test('private push conflicts preserve an immutable private recovery branch and receipt',t=>{
  const root=fixture(t),calls=[],sha='a'.repeat(40);
  const execute=(_cmd,args)=>{
    const operation=args.slice(2);calls.push(operation);
    if(operation[0]==='rev-parse')return {status:0,stdout:sha+'\n'};
    if(operation[0]==='push' && operation.at(-1)==='HEAD:main')return {status:1};
    if(operation[0]==='rebase' && operation[1]!=='--abort')return {status:1};
    return {status:0,stdout:''};
  };
  const result=persistEvidence({root,backupRoot:path.join(root,'private'),date,runId:'12',execute,pause:()=>{}});
  assert.equal(result.status,'recovery_branch');assert.equal(result.commit,sha);
  assert.ok(calls.some(a=>a.join(' ')==='rebase --abort'));
  assert.ok(calls.some(a=>a.at(-1)==='HEAD:refs/heads/recovery/financing-2026-10-16-12-1'));
  assert.equal(read(path.join(root,`agent-workflow/reports/financing/${date}/evidence-sync.json`)).status,'recovery_branch');
  assert.ok(!calls.some(a=>['reset','clean'].includes(a[0])));
});
test('checkpoint hashes are checked before private recovery and missing originals never approve resume',t=>{
  const temp=fixture(t),root=path.join(temp,'repo'),directory=path.join(temp,'artifact'),file=`agent-workflow/reports/financing/${date}/collection.json`;
  const value={captures:{url:{status:'accepted',content_hash:'a'.repeat(64)}}};
  write(path.join(directory,'files',file),value);
  const body=fs.readFileSync(path.join(directory,'files',file),'utf8');
  write(path.join(directory,'manifest.json'),{date,entries:[{file,hash:digest(body)}]});
  assert.deepEqual(checkpointEvidenceHashes(root,directory,date),['a'.repeat(64)]);
  assert.throws(()=>recoverEvidence({root,backupRoot:path.join(temp,'missing'),directory,date,git:()=>{throw Error('must not call');}}),/private_evidence_unconfirmed/);
  fs.appendFileSync(path.join(directory,'files',file),' ');
  assert.throws(()=>checkpointEvidenceHashes(root,directory,date),/hash_mismatch/);
});
test('only bound evidence shortages enter daily follow-up; other holds and existing queue stay intact',t=>{
  const dir=fixture(t),root=path.join(dir,'repo'),backupRoot=path.join(dir,'private');
  const funding=path.join(root,'01-SiteV2/content/12-applications/funding-insights'),facts=path.join(root,'01-SiteV2/content/11-databases/data-center-v4',date);
  const hold={event_id:'EV-a',source_url:'https://example.com/a',status:'pending',reason:'research_independent_sources_insufficient'};
  write(path.join(funding,'publication-review.json'),{version:'FINANCING-PUBLICATION-REVIEW-1',holds:[hold,{event_id:'EV-b',source_url:'https://example.com/b',status:'pending',reason:'not a financing company'}]});
  write(path.join(funding,date+'.json'),{cards:[],queue:[{event_id:'EV-a',company_name:'Example AI',status:'blocked',problems:['research_independent_sources_insufficient']}]});
  write(path.join(facts,'canonical-events.json'),[{event_id:'EV-a',event_type:'funding',publication_status:'verified',source_refs:['SA-a']}]);
  write(path.join(facts,'raw-documents.json'),[{raw_id:'RAW-a',source_artifact_id:'SA-a',source_url:hold.source_url,content_hash:'a'.repeat(64)}]);
  const queueFile=path.join(backupRoot,'financing-monitor-state/verification-queue.json');
  const preserved={status:'needs_attention',rounds:2,reason:'responsible_review'};write(queueFile,{entries:{'https://example.com/c':preserved}});
  const result=registerPublicationHolds({root,backupRoot,date});assert.equal(result.added,1);assert.equal(result.responsible_review,1);
  const q=read(queueFile);assert.deepEqual(q.entries['https://example.com/c'],preserved);assert.equal(q.entries['https://example.com/b'],undefined);
  assert.equal(q.entries[hold.source_url].status,'pending');assert.equal(mayResearchHeldEvent(hold,q.entries[hold.source_url]),true);
  assert.equal(mayResearchHeldEvent({...hold,reason:'facts conflict'},q.entries[hold.source_url]),false);
  assert.equal(registerPublicationHolds({root,backupRoot,date}).added,0);
});

test('closed responsible triage is not reactivated by publication holds',t=>{
  const dir=fixture(t),root=path.join(dir,'repo'),backupRoot=path.join(dir,'private');
  const source_url='https://example.com/closed';
  write(path.join(root,'01-SiteV2/content/12-applications/funding-insights/publication-review.json'),
    {version:'FINANCING-PUBLICATION-REVIEW-1',holds:[{event_id:'EV-closed',source_url,status:'pending',reason:'research_sources_insufficient'}]});
  write(path.join(backupRoot,'financing-monitor-state/value-triage/closed.json'),
    {version:'FINANCING-QUEUE-VALUE-TRIAGE-1',status:'applied',date,reviewed_at:date+'T00:00:00Z',reviewer:'responsible-reviewer',rows:[{id:'closed',source_url,decision:'archive_already_published_same_event',reason:'verified same round'}]});
  assert.deepEqual(registerPublicationHolds({root,backupRoot,date}),{added:0,evidence_followup:0,responsible_review:0});
});
test('private recovery merges the recorded commit and never resolves ledger conflicts by overwrite',t=>{
  const dir=fixture(t),root=path.join(dir,'repo'),backupRoot=path.join(dir,'private'),directory=path.join(dir,'artifact');
  const file=`agent-workflow/reports/financing/${date}/evidence-sync.json`,commit='b'.repeat(40),ref=`recovery/financing-${date}-42-1`;
  write(path.join(directory,'files',file),{date,status:'recovery_branch',commit,recovery_ref:ref});
  write(path.join(directory,'manifest.json'),{date,entries:[{file,hash:digest(fs.readFileSync(path.join(directory,'files',file),'utf8'))}]});
  const calls=[],git=args=>{calls.push(args);if(args[0]==='merge-base')throw Error('not merged');if(args[0]==='rev-parse')return commit;if(args[0]==='merge' && args[1]!=='--abort')throw Error('ledger conflict');return '';};
  assert.throws(()=>recoverEvidence({root,backupRoot,directory,date,git}),/ledger_conflict_requires_review/);
  assert.ok(calls.some(a=>a.join(' ')==='merge --abort'));
  assert.ok(!calls.some(a=>['reset','checkout','clean'].includes(a[0])));
});
test('workflow saves metadata after private sync failure while publication requires confirmed sync',()=>{
  const workflow=fs.readFileSync(new URL('../../../.github/workflows/funding-daily-pr.yml',import.meta.url),'utf8');
  assert.match(workflow,/id: checkpoint\s+if: always\(\) && \(steps.collection.outcome == 'success' \|\| steps.collection.outcome == 'failure'\)/u);
  assert.match(workflow,/if: always\(\) && steps.checkpoint.outcome == 'success'/u);
  assert.match(workflow,/steps.produce.outcome == 'success' && steps.research_evidence.outcome == 'success'/u);
});
