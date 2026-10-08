import test from 'node:test';
import assert from 'node:assert/strict';
import {recheckPending} from '../recheck.mjs';
const policy={search_queries_per_lead:4,search_results:8,capture_attempts_per_lead:6,capture_attempts_per_run:480};
test('unknown initial capture is held while independent alternative originals remain reviewable',async()=>{
  const state={captures:{'https://example.com/unknown':{status:'pending',reason:'collection_capture_interrupted_or_unknown'}}},seen=[];
  await recheckPending({state,policy,date:'2026-10-07',save:()=>{},search:async()=>[{url:'https://example.com/alternative'}],capture:async lead=>{seen.push(lead.url);return {status:'pending'};},accept:()=>{}});
  assert.deepEqual(seen,['https://example.com/alternative']);
});
test('each pending lead receives independent review; completed work never replays on recovery',async()=>{
  const state={captures:{'https://example.com/a':{status:'pending',title:'Acme AI raises funding'},'https://example.com/b':{status:'pending',title:'Other AI funding'},'https://example.com/accepted':{status:'accepted'}}};
  const queries=[],attempts=[];
  const options={state,policy,date:'2026-10-07',save:()=>{},search:async(query,limit,{leadUrl})=>{queries.push(leadUrl);return Array.from({length:8},(_,i)=>({url:`${leadUrl}/${i}`,provider_body:'private provider full text'}));},capture:async lead=>{attempts.push(lead.url);return{status:'pending',reason:'no_original'};},accept:()=>{throw Error('no accepted fixture');}};
  await recheckPending(options);
  assert.equal(queries.filter(url=>url==='https://example.com/a').length,1);
  assert.equal(queries.filter(url=>url==='https://example.com/b').length,1);
  assert.equal(attempts.length,12);assert.ok(!attempts.includes('https://example.com/accepted'));
  assert.ok(!JSON.stringify(state).includes('private provider full text'));
  const counts=[queries.length,attempts.length];await recheckPending(options);assert.deepEqual([queries.length,attempts.length],counts);
  assert.equal(state.rechecks['https://example.com/a'].review_status,'awaiting_agent_review');
});
test('batch limit leaves continuation and next run reaches remaining leads',async()=>{
  const state={captures:{'https://example.com/a':{status:'pending'},'https://example.com/b':{status:'pending'}}},seen=[];
  const options={state,policy:{...policy,capture_attempts_per_run:1},date:'2026-10-07',save:()=>{},search:async()=>[],capture:async lead=>{seen.push(lead.url);return{status:'pending'};},accept:()=>{}};
  await recheckPending(options);assert.equal(state.recheck_summary.continuation_required,1);
  await recheckPending(options);assert.deepEqual(seen,['https://example.com/a','https://example.com/b']);
});
test('alternative original capture keeps the unresolved lead pending for identity review',async()=>{
  const state={captures:{'https://example.com/a':{status:'pending'}}};
  await recheckPending({state,policy,date:'2026-10-07',save:()=>{},search:async()=>[{url:'https://example.com/official'}],capture:async lead=>lead.url.endsWith('official')?{status:'accepted',record:{content_hash:'fixture'}}:{status:'pending'},accept:async(lead,result)=>{state.captures[lead.url]={status:result.status};}});
  assert.equal(state.captures['https://example.com/a'].status,'pending');assert.equal(state.captures['https://example.com/official'].status,'accepted');
  assert.equal(state.rechecks['https://example.com/a'].review_status,'awaiting_agent_review');
});
