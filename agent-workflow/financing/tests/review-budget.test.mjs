import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createReviewBudget,reviewCapacity,reviewQueueSummary} from '../review-budget.mjs';
import {recheckPending} from '../recheck.mjs';
import {createLeadFollowupSearch} from '../lead-followup-search.mjs';
import {createSearchGateway} from '../../tools/lib/search-gateway.mjs';
import {followupDue,deferredFollowup} from '../verification-followup.mjs';

const date='2026-10-08';
const policy={concurrency:4,search_queries_per_lead:4,search_results:8,search_requests_per_lead:12,capture_attempts_per_lead:6,capture_attempts_per_run:480,search_requests_per_run:960,capacity_margin:0.2};
const temp=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'review-budget-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};

test('queue sized reservation covers every lead above the old 480 ceiling',t=>{
  const collection={captures:Object.fromEntries(Array.from({length:100},(_,i)=>[`https://example.com/lead/${i}`,{status:'pending'}]))};
  const budget=createReviewBudget({directory:temp(t),date,policy,collection});
  for(const url of Object.keys(collection.captures))for(let j=0;j<6;j++)assert.equal(budget.reserveCapture(url,`${url}/source/${j}`),true);
  assert.equal(budget.summary().capture_requests,600);
  assert.deepEqual(budget.summary().capacity,{captures:720,searches:1440});
  assert.deepEqual(reviewCapacity(policy,174),{captures:1253,searches:2506});
});

test('lead bookkeeping never counts twice and capture unknown survives restoration',t=>{
  const directory=temp(t),url='https://example.com/lead',target='https://example.com/original';
  const options={directory,date,policy,collection:{captures:{[url]:{status:'pending'}}},verification:{entries:{[url]:{attempted:true,capture_attempts:[{url:target,status:'started'}]}}},history:{entries:{[url]:{date,status:'pending',attempted:true},[target]:{date,status:'started',attempted:true}}}};
  const first=createReviewBudget(options);assert.equal(first.summary().capture_requests,1);
  assert.equal(first.reserveCapture(url,target),false);
  const next=createReviewBudget(options);assert.equal(next.summary().capture_requests,1);assert.equal(next.reserveCapture(url,target),false);
});

test('original acquisition stops before searches when existing original is usable',async t=>{
  const state={captures:{'https://example.com/lead':{status:'pending'}}};
  await recheckPending({state,policy,date,budget:createReviewBudget({directory:temp(t),date,policy,collection:state}),save:()=>{},
    search:()=>{throw Error('unnecessary search');},capture:async()=>({status:'accepted',record:{content_hash:'fixture'}}),accept:()=>{}});
  assert.equal(state.rechecks['https://example.com/lead'].captures.length,1);
  assert.equal(Object.keys(state.rechecks['https://example.com/lead'].queries).length,0);
});

test('same query shares cache across leads and completed recovery has no billed request',async t=>{
  const directory=temp(t),env={ANYSEARCH_API_KEY:'fixture'},budget=createReviewBudget({directory,date,policy});let calls=0;
  const make=leadUrl=>createLeadFollowupSearch({directory:path.join(directory,date),date,policy,leadUrl,env,budget,fetcher:async()=>{calls++;return Response.json({results:[{url:'https://example.com/source',title:'Acme original'}]});}});
  await make('lead-a').query('Acme original',1);
  await make('lead-b').query('Acme original',1);
  await make('lead-a').query('Acme original',1);
  assert.equal(calls,1);assert.equal(budget.summary().search_requests,1);
});

test('account quota circuit persists across instances; rate limit expires without clearing request receipts',async t=>{
  const healthFile=path.join(temp(t),'health.json'),env={ANYSEARCH_API_KEY:'fixture'};let now=1000,calls=0,status=429;
  const make=()=>createSearchGateway({env,healthFile,now:()=>now,fallback:null,fetcher:async()=>{calls++;return new Response('',{status});}});
  await assert.rejects(make().search('a'));await assert.rejects(make().search('b'));assert.equal(calls,1);
  now+=61000;status=402;await assert.rejects(make().search('c'));await assert.rejects(make().search('d'));assert.equal(calls,2);
});

test('known provider rate limit resumes after cooldown and retains charged attempt history',async t=>{
  const directory=temp(t),env={ANYSEARCH_API_KEY:'fixture'};let now=1000,calls=0;
  const make=()=>createLeadFollowupSearch({directory,date,leadUrl:'lead',policy,env,now:()=>now,fetcher:async()=>{
    calls++;return calls===1?new Response('',{status:429}):Response.json({results:[{url:'https://example.com/source',title:'Acme original'}]});
  }});
  await assert.rejects(make().query('Acme',1));await assert.rejects(make().query('Acme',1));assert.equal(calls,1);
  now+=61000;assert.equal((await make().query('Acme',1)).length,1);assert.equal(calls,2);
  const file=fs.readdirSync(directory).find(name=>name.startsWith('verification-search-'));
  const state=JSON.parse(fs.readFileSync(path.join(directory,file)));assert.equal(state.requests,2);
  assert.equal(Object.values(state.queries)[0].attempts.length,1);
});

test('unreviewed resource deferrals stay eligible beyond seven days; actual reviews remain bounded',()=>{
  const item={status:'pending',rounds:0,stop_after_date:'2026-10-01',next_due_date:date};
  assert.equal(followupDue(item,date),true);
  assert.equal(deferredFollowup(item,date,{reason:'capture_budget_exhausted'}).status,'pending');
  assert.equal(deferredFollowup({...item,rounds:1,stop_after_date:'2026-10-15'},date,{attempted:true}).status,'needs_attention');
  assert.deepEqual(reviewQueueSummary({entries:{a:{content_hash:'hash',alternate_source:true},b:{raw_ids:['RAW']},c:{reason:'capture_budget_exhausted'}}}).stages,{source_identity_review:1,fact_review:1,needs_original:1});
});
