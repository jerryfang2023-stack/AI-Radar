import test from 'node:test';import assert from 'node:assert/strict';
import {syncAIHotSelected} from '../aihot-selected.mjs';

const ok=(body,status=200)=>({status,ok:status<400,json:async()=>body});
const snapshot=(items=[],hasMore=false,nextPage=null,cursor='cur-1')=>({schemaVersion:1,fields:'default',cursor,hasMore,nextPage,items,count:items.length});
const changes=(rows=[],hasMore=false,cursor='cur-2')=>({schemaVersion:1,fields:'default',cursor,hasMore,changes:rows,count:rows.length});
const page=url=>String(url).includes('/snapshot')?ok(snapshot()):ok(changes());

test('a transient timeout is retried and the page budget still completes',async()=>{
 let calls=0;
 const fetcher=async url=>{calls++;if(calls===1)throw Error('The operation was aborted due to timeout');return page(url);};
 const result=await syncAIHotSelected({date:'2026-10-12',fetcher,save:async()=>{}});
 assert.equal(result.complete,true);
 assert.deepEqual(result.failures,[]);
 assert.equal(calls,3); // one failed attempt, then snapshot, then changes
});

test('a 5xx page is retried without aborting the collection phase',async()=>{
 let calls=0;
 const fetcher=async url=>{calls++;if(calls===1)return {status:503,ok:false,json:async()=>({})};return page(url);};
 const result=await syncAIHotSelected({date:'2026-10-12',fetcher,save:async()=>{}});
 assert.equal(result.complete,true);
 assert.equal(calls,3);
});

test('a persistent 5xx still fails the page budget instead of looping forever',async()=>{
 let calls=0;
 const fetcher=async()=>{calls++;return {status:502,ok:false,json:async()=>({})};};
 const result=await syncAIHotSelected({date:'2026-10-12',fetcher,save:async()=>{}});
 assert.equal(result.complete,false);
 assert.match(result.failures.join(','),/aihot_selected_http_502/);
 assert.equal(calls,4); // attempts exhausted, then the loop stops
});

test('a 4xx client error is not retried',async()=>{
 let calls=0;
 const fetcher=async()=>{calls++;return {status:400,ok:false,json:async()=>({})};};
 const result=await syncAIHotSelected({date:'2026-10-12',fetcher,save:async()=>{}});
 assert.equal(result.complete,false);
 assert.match(result.failures.join(','),/aihot_selected_http_400/);
 assert.equal(calls,1);
});
