import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{unpackIndex}=require('../miniprogram/utils/compact-index.js');
test('native compact decoder preserves missing, null, numeric, array and string fields',()=>{
 const payload={schemaVersion:'GUANLAN-COMPACT-INDEX-1',index:{meta:{cardCount:2}},collections:{cards:{columns:['id','amount','products','extra'],dictionaries:{id:['a','b']},rows:[[0,0,['Product'],null],[1,null,[],null]],omitted:{0:[3]}}}};
 assert.deepEqual(unpackIndex(payload),{meta:{cardCount:2},cards:[{id:'a',amount:0,products:['Product']},{id:'b',amount:null,products:[],extra:null}]});
 const bad=structuredClone(payload);bad.collections.cards.rows[1][0]=99;assert.throws(()=>unpackIndex(bad),/字典/);
 const polluted=structuredClone(payload);polluted.collections.cards.columns[0]='__proto__';assert.throws(()=>unpackIndex(polluted),/列/);
});
