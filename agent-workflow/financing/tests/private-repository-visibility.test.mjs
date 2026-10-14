import test from 'node:test';
import assert from 'node:assert/strict';
import {anonymousRepositoryVisibility} from '../../tools/lib/private-repository-visibility.mjs';

test('API throttling requires an independent anonymous 404, never accepts 403 itself',async()=>{
  const calls=[];
  const result=await anonymousRepositoryVisibility('owner/private',{
    wait:async()=>{},fetchImpl:async(url,options)=>{
      calls.push(url);
      assert.equal(options.headers.authorization,undefined);
      assert.equal(options.redirect,'error');
      return {status:url.includes('api.github.com')?403:404};
    },
  });
  assert.equal(result.private,true);
  assert.equal(calls.length,4);
  assert.equal(result.probes.at(-1).status,404);
  const denied=await anonymousRepositoryVisibility('owner/private',{wait:async()=>{},fetchImpl:async()=>({status:403})});
  assert.equal(denied.private,false);
  assert.equal(denied.probes.length,6);
});

test('public visibility fails immediately and transport failures stay closed',async()=>{
  let calls=0;
  const visible=await anonymousRepositoryVisibility('owner/public',{wait:async()=>{},fetchImpl:async()=>{calls++;return {status:200};}});
  assert.equal(visible.private,false);
  assert.equal(calls,1);
  const unavailable=await anonymousRepositoryVisibility('owner/private',{wait:async()=>{},fetchImpl:async()=>{throw new TypeError('network unavailable');}});
  assert.equal(unavailable.private,false);
  assert.equal(unavailable.probes.length,6);
});

test('transient network failure can recover without changing the privacy criterion',async()=>{
  let calls=0;
  const result=await anonymousRepositoryVisibility('owner/private',{wait:async()=>{},fetchImpl:async()=>{if(++calls===1)throw new TypeError('reset');return {status:404};}});
  assert.equal(result.private,true);
  assert.equal(calls,2);
});
