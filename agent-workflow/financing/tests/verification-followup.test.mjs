import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {createFollowupSearch,deferredFollowup,followupDue} from '../verification-followup.mjs';
import {read,write} from '../state.mjs';
const fixture=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'verification-budget-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
test('follow-up shares remaining discovery requests and unknown provider outcomes never replay',async t=>{
 const directory=fixture(t),collection={date:'2026-10-06',search_health:{requests:159}},env={ANYSEARCH_API_KEY:'test'};
 let calls=0;const fetcher=async()=>{calls++;throw new Error('unknown');};
 const search=createFollowupSearch({directory,collection,env,fetcher});
 assert.equal((await search('Acme AI funding')).status,'failed');assert.equal(calls,1);
 const resumed=createFollowupSearch({directory,collection,env,fetcher});
 assert.equal((await resumed('Acme AI funding')).reason,'search_previous_unknown_or_failed');
 assert.equal((await resumed('Other AI funding')).reason,'search_budget_exhausted');assert.equal(calls,1);
 assert.equal(read(path.join(directory,'verification-search.json')).requests,1);
});
test('zero remaining budget and absent provider perform no request',async t=>{
 const fetcher=()=>{throw Error('must not call');};
 assert.equal((await createFollowupSearch({directory:fixture(t),collection:{date:'2026-10-06',search_health:{requests:160}},env:{ANYSEARCH_API_KEY:'test'},fetcher})('Acme AI funding')).reason,'search_budget_exhausted');
 assert.equal((await createFollowupSearch({directory:fixture(t),collection:{date:'2026-10-06'},env:{},fetcher})('Acme AI funding')).reason,'search_provider_unavailable');
});
test('expiry after substantive review has a named owner and remains bounded',()=>{
 const item={status:'pending',rounds:1,stop_after_date:'2026-10-07'};
 const stopped=deferredFollowup(item,'2026-10-07',{reason:'budget_unavailable'});
 assert.equal(stopped.status,'needs_attention');assert.equal(stopped.owner,'responsible_financing_reviewer');
 assert.equal(followupDue(stopped,'2026-10-08'),false);
});
