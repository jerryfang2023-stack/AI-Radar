import test from 'node:test';
import assert from 'node:assert/strict';
import {chinaClock, selectRunDate, acceptedReview, assertDataOnly} from '../vps-supervisor.mjs';
test('Shanghai daily start and recovery survive midnight and blocked yesterday',()=>{
  const before=chinaClock(new Date('2026-10-03T00:09:59Z'));
  assert.equal(selectRunDate([],before),null);
  const start=chinaClock(new Date('2026-10-03T00:10:00Z'));
  assert.equal(selectRunDate([],start),'2026-10-03');
  assert.equal(selectRunDate([{date:'2026-10-02',status:'awaiting_portal'}],before),'2026-10-02');
  assert.equal(selectRunDate([{date:'2026-10-02',status:'needs_attention'}],start),'2026-10-03');
  assert.equal(selectRunDate([{date:'2026-10-02',status:'published'}],start),'2026-10-03');
  assert.throws(()=>selectRunDate([],start,'2026-10-04'),/invalid_vps_run_date/);
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
