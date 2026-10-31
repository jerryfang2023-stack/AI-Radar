import test from 'node:test';
import assert from 'node:assert/strict';
import {chinaClock, selectRunDate, acceptedReview, assertDataOnly,dispatchAllowed,assertApprovalRun,validPublishedReceipt,completedDispatch,sourceHash,mergeReviewedPull} from '../vps-supervisor.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {digest} from '../state.mjs';

test('published receipts never hide a new PR or changed catalog',()=>{
  const state={status:'published',catalog_hash:'accepted'};
  assert.equal(completedDispatch(state,{status:'awaiting_portal',accepted_on_main:true},'accepted'),true);
  assert.equal(completedDispatch(state,{status:'awaiting_portal',accepted_on_main:true},'changed'),false);
  for(const status of ['checks_pending','awaiting_approval','ready_for_review'])
    assert.equal(completedDispatch(state,{status,pr_url:'https://github.com/owner/repo/pull/1'},'accepted'),false);
  assert.equal(completedDispatch({status:'no_new_financing'},{status:'planned'},null),false);
});

test('catalog hashes preserve the receipt digest above the former 32 MiB subprocess limit',async()=>{
  const cwd=fs.mkdtempSync(path.join(os.tmpdir(),'financing-hash-'));
  try {
    execFileSync('git',['init','--quiet',cwd]);
    const file='01-SiteV2/site/data/financing-catalog-v1.json';
    fs.mkdirSync(path.dirname(path.join(cwd,file)),{recursive:true});
    const body='  {"company":"观澜","padding":"'+'x'.repeat(33*1024*1024)+'"}\n';
    fs.writeFileSync(path.join(cwd,file),body);
    execFileSync('git',['add',file],{cwd});
    const tree=execFileSync('git',['write-tree'],{cwd,encoding:'utf8'}).trim();
    assert.equal(await sourceHash(tree,cwd),digest(body.trim()));
    await assert.rejects(sourceHash('missing-ref',cwd),/catalog_hash_git_failed/);
  } finally {fs.rmSync(cwd,{recursive:true,force:true});}
});
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
test('acceptance binds reviewed date and SHA, all checks, actual evidence and only non-blocking notes',()=>{
  const identity={date:'2026-10-03',head:'a'.repeat(40)};
  const approved={date:identity.date,head_sha:identity.head,verdict:'approved',checks:{sources:true,facts:true,scope:true,classification:true,preservation:true},evidence:['source: confirmed round'],issues:[]};
  assert.equal(acceptedReview(approved,identity),true);
  for(const note of ['Non-blocking: stale team-size profile field','Observation: source date reconciled in publication.json','Note: profile role label needs a later refresh','非准入批次问题（不影响本次五张卡）：研究卡与公开卡不一致','数据质量提示（不阻断发布）：待核验队列仍在运行','Sonilo 的日期冲突已按公告日处置并留档，不属于未解决的事实冲突'])assert.equal(acceptedReview({...approved,issues:[note]},identity),true);
  for(const bad of [{head_sha:'b'.repeat(40)},{date:'2026-10-02'},{verdict:'unknown'},{evidence:[]},{issues:['unverified investor']},{issues:['Scope violation: robotics company published']},{issues:['Non-blocking: stale profile','Fact inconsistency: malformed amount']},{checks:{...approved.checks,preservation:false}}])assert.equal(acceptedReview({...approved,...bad},identity),false);
});
test('financing reviewer never auto-merges executable or workflow changes',()=>{
  const date='2026-10-03';
  assert.doesNotThrow(()=>assertDataOnly([`agent-workflow/reports/financing/${date}/publication.json`,'01-SiteV2/site/data/financing-catalog-v1.json'],date));
  for(const files of [[],['agent-workflow/financing/run.mjs'],['.github/workflows/funding-daily-pr.yml'],['01-SiteV2/site/data/../../evil.json']])assert.throws(()=>assertDataOnly(files,date),/unapproved_paths/);
});

const mergeIdentity={url:'https://github.com/jerryfang2023-stack/AI-Radar/pull/1315',head:'a'.repeat(40),date:'2026-10-31'};
const confirmedMerge={url:mergeIdentity.url,state:'MERGED',headRefOid:mergeIdentity.head,headRefName:'automation/financing-2026-10-31',baseRefName:'main',mergeCommit:{oid:'b'.repeat(40)}};
test('merge response 502 after a committed write is reconciled without repeating the merge',()=>{
  const failure=Object.assign(new Error('merge_502'),{private_stderr:'502 Bad Gateway'}),writes=[],reads=[],commands=[],unknown=[];
  const result=mergeReviewedPull(mergeIdentity,{merge:args=>{writes.push(args);throw failure;},inspect:args=>{reads.push(args);return confirmedMerge;},git:args=>commands.push(args),recordUnknown:error=>unknown.push(error)});
  assert.equal(result.status,'confirmed_after_command_error');assert.equal(result.merge_commit,confirmedMerge.mergeCommit.oid);
  assert.deepEqual(writes,[['pr','merge',mergeIdentity.url,'--repo','jerryfang2023-stack/AI-Radar','--merge','--match-head-commit',mergeIdentity.head]]);
  assert.equal(reads.length,1);assert.deepEqual(unknown,[failure]);
  assert.deepEqual(commands,[['fetch','--quiet','origin','main'],['merge-base','--is-ancestor',mergeIdentity.head,confirmedMerge.mergeCommit.oid],['merge-base','--is-ancestor',confirmedMerge.mergeCommit.oid,'origin/main']]);
});
test('an ordinary successful merge does not add reconciliation reads',()=>{
  assert.equal(mergeReviewedPull(mergeIdentity,{merge:()=>{},inspect:()=>assert.fail('unexpected read'),git:()=>assert.fail('unexpected git'),recordUnknown:()=>assert.fail('unexpected error')}).status,'command_succeeded');
});
test('unconfirmed or mismatched merge state preserves the original failure and never repeats a write',()=>{
  for(const patch of [{state:'OPEN'},{state:'CLOSED'},{url:'https://github.com/other/repo/pull/1315'},{headRefOid:'c'.repeat(40)},{headRefName:'automation/financing-2026-10-30'},{baseRefName:'other'},{mergeCommit:null},{mergeCommit:{oid:'short'}}]) {
    const failure=new Error('unknown_merge_result');let writes=0;
    assert.throws(()=>mergeReviewedPull(mergeIdentity,{merge:()=>{writes++;throw failure;},inspect:()=>({...confirmedMerge,...patch}),git:()=>assert.fail('identity must be checked first')}),error=>error===failure);
    assert.equal(writes,1);
  }
});
test('read failure and missing main ancestry fail closed with no replay',()=>{
  for(const failedStep of ['read','fetch','head_ancestry','main_ancestry']) {
    const failure=new Error('merge_response_unknown');let writes=0,commands=0;
    assert.throws(()=>mergeReviewedPull(mergeIdentity,{merge:()=>{writes++;throw failure;},inspect:()=>{if(failedStep==='read')throw Error('read_503');return confirmedMerge;},git:()=>{commands++;if(commands===({fetch:1,head_ancestry:2,main_ancestry:3}[failedStep]))throw Error('not_confirmed');}}),error=>error===failure);
    assert.equal(writes,1);
  }
});
