import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchAIHotPage} from '../aihot-request.mjs';
import {syncAIHotSelected} from '../aihot-selected.mjs';
import {collectAIHotFeed} from '../../tools/lib/aihot-feed.mjs';

const ok=data=>({status:200,ok:true,json:async()=>data});
test('transient page failures retry with fresh signals and bounded backoff',async()=>{
  let calls=0;const waits=[],signals=[];
  const response=await fetchAIHotPage('https://example.test',{}, {wait:async n=>waits.push(n),fetcher:async(u,o)=>{
    signals.push(o.signal);calls++;
    if(calls===1)throw new DOMException('timeout','TimeoutError');
    if(calls===2)return {status:503,ok:false};
    return ok({cursor:'accepted'});
  }});
  assert.deepEqual(await response.json(),{cursor:'accepted'});
  assert.equal(calls,3);assert.deepEqual(waits,[1000,2000]);assert.equal(new Set(signals).size,3);
});
test('body timeouts recover, persistent 429 stops at four; client/JSON errors are not retried',async()=>{
  let calls=0;
  const recovered=await fetchAIHotPage('https://example.test',{}, {wait:async()=>{},fetcher:async()=>{
    calls++;return calls===1?{status:200,ok:true,json:async()=>{throw new DOMException('body timeout','TimeoutError');}}:ok({done:true});
  }});
  assert.deepEqual(await recovered.json(),{done:true});assert.equal(calls,2);
  for(const code of [429,400]) {
    calls=0;const value=await fetchAIHotPage('https://example.test',{}, {wait:async()=>{},fetcher:async()=>{calls++;return {status:code,ok:false};}});
    assert.equal(value.status,code);assert.equal(calls,code===429?4:1);
  }
  calls=0;
  await assert.rejects(fetchAIHotPage('https://example.test',{}, {wait:async()=>{},fetcher:async()=>{
    calls++;return {status:200,ok:true,json:async()=>{throw new SyntaxError('bad json');}};
  }}),SyntaxError);assert.equal(calls,1);
});
test('public feed retries only the failed second page; selected contract failure remains incomplete',async()=>{
  const urls=[];let nextCalls=0;
  const data={schemaVersion:1,items:[{id:'one',title:'AI funding raised',url:'https://example.test/one'}],page:{hasMore:true,nextCursor:'next'}};
  const result=await collectAIHotFeed({fetcher:(u,o)=>fetchAIHotPage(u,o,{wait:async()=>{},fetcher:async url=>{
    urls.push(url);
    if(!url.includes('cursor=next'))return ok(data);
    if(++nextCalls===1)return {status:502,ok:false};
    return ok({...data,items:[],page:{hasMore:false}});
  }})});
  assert.equal(result.complete,true);assert.equal(result.pages,2);assert.equal(urls.length,3);
  assert.equal(urls.filter(u=>!u.includes('cursor=next')).length,1);
  let calls=0;
  const selected=await syncAIHotSelected({date:'2026-10-12',wait:async()=>{},save:async()=>{},fetcher:async()=>{calls++;return ok({schemaVersion:99});}});
  assert.equal(selected.complete,false);assert.equal(calls,1);assert.match(selected.failures[0],/invalid_contract/);
});
