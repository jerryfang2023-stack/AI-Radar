import test from 'node:test';
import assert from 'node:assert/strict';
import {chinaClock, selectRunDate, acceptedReview, assertDataOnly,dispatchAllowed,assertApprovalRun,validPublishedReceipt} from '../vps-supervisor.mjs';
test('Shanghai daily start and recovery survive midnight and blocked yesterday',()=>{
  const before=chinaClock(new Date('2026-10-03T00:09:59Z'));
  assert.equal(selectRunDate([],before),null);
  const start=chinaClock(new Date('2026-10-03T00:10:00Z'));
  assert.equal(selectRunDate([],start),'2026-10-03');
  assert.equal(selectRunDate([{date:'2026-10-02',status:'awaiting_portal'}],before),'2026-10-02');
  assert.equal(selectRunDate([{date:'2026-10-02',status:'needs_attention'}],start),'2026-10-03');
  assert.equal(selectRunDate([{date:'2026-10-02',status:'published'}],start),'2026-10-03');
  assert.throws(()=>selectRunDate([],start,'2026-10-04'),/invalid_vps_run_date/);
  assert.throws(()=>selectRunDate([],start,'2026-02-31'),/invalid_vps_run_date/);
});
test('old publication recovery cannot starve today; dispatch attempts stop at three and preserve unknown',()=>{
  const clock=chinaClock(new Date('2026-10-12T00:10:00Z'));
  assert.equal(selectRunDate([{date:'2026-10-11',status:'awaiting_portal'}],clock),'2026-10-12');
  assert.equal(dispatchAllowed({dispatch_attempts:[{status:'unknown'}]},{status:'planned'}),false);
  assert.equal(dispatchAllowed({dispatch_attempts:Array(3).fill({status:'submitted'})},{status:'planned'}),false);
  assert.equal(dispatchAllowed({dispatch_attempts:Array(2).fill({status:'submitted'})},{status:'planned'}),true);
  assert.equal(dispatchAllowed({dispatch_attempts:[{status:'unknown'}]},{status:'running'}),true);
});
test('CI approval binds known workflow, same repo, finance branch and reviewed head',()=>{
  const identity={date:'2026-10-12',head:'a'.repeat(40),workflowId:123};
  const run={head_sha:identity.head,path:'.github/workflows/production-code-checks.yml',event:'pull_request',head_repository:{full_name:'jerryfang2023-stack/AI-Radar'},head_branch:'automation/financing-2026-10-12',workflow_id:123,conclusion:'action_required'};
  assert.doesNotThrow(()=>assertApprovalRun(run,identity));
  for(const patch of [{head_sha:'b'.repeat(40)},{event:'push'},{path:'.github/workflows/other.yml'},{workflow_id:124},{head_branch:'other'},{head_repository:{full_name:'attacker/fork'}},{conclusion:'success'}])assert.throws(()=>assertApprovalRun({...run,...patch},identity),/untrusted_ci/);
});
test('published receipts require website and Mini dates and full accepted SHA',()=>{
  const receipt={date:'2026-10-12',status:'published',website_date:'2026-10-12',mini_date:'2026-10-12',source_commit:'a'.repeat(40)};
  assert.equal(validPublishedReceipt(receipt,'2026-10-12'),true);
  assert.equal(validPublishedReceipt({...receipt,mini_date:'2026-10-11'},'2026-10-12'),false);
  assert.equal(validPublishedReceipt({...receipt,source_commit:'short'},'2026-10-12'),false);
  assert.equal(validPublishedReceipt({...receipt,website_date:'2026-10-13',mini_date:'2026-10-13'},'2026-10-12'),true);
  assert.equal(validPublishedReceipt({...receipt,website_date:'bad',mini_date:'bad'},'2026-10-12'),false);
});
test('acceptance binds reviewed date and SHA, all checks, actual evidence and no open issues',()=>{
  const identity={date:'2026-10-03',head:'a'.repeat(40)};
  const approved={date:identity.date,head_sha:identity.head,verdict:'approved',checks:{sources:true,facts:true,scope:true,classification:true,preservation:true},evidence:['source: confirmed round'],issues:[]};
  assert.equal(acceptedReview(approved,identity),true);
  for(const bad of [{head_sha:'b'.repeat(40)},{date:'2026-10-02'},{verdict:'unknown'},{evidence:[]},{issues:['unverified investor']},{checks:{...approved.checks,preservation:false}}])assert.equal(acceptedReview({...approved,...bad},identity),false);
});
test('financing reviewer never auto-merges executable or workflow changes',()=>{
  const date='2026-10-03';
  assert.doesNotThrow(()=>assertDataOnly([`agent-workflow/reports/financing/${date}/publication.json`,'01-SiteV2/site/data/financing-catalog-v1.json'],date));
  for(const files of [[],['agent-workflow/financing/run.mjs'],['.github/workflows/funding-daily-pr.yml'],['01-SiteV2/site/data/../../evil.json']])assert.throws(()=>assertDataOnly(files,date),/unapproved_paths/);
});
