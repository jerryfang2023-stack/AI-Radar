import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const settle=()=>new Promise(resolve=>setImmediate(resolve));
function harness(){
 let page,identity='member';const requests=[],profiles=deferred(),frames=[];
 vm.runInNewContext(fs.readFileSync('miniprogram/pages/entity-detail/index.js','utf8'),{
  Page:p=>page=p,wx:{showShareMenu(){}},require:p=>{
   if(p.includes('payment'))return {getSessionIdentity:()=>identity,hasAuthToken:()=>true,entityFollows:async()=>({items:[]}),fetchProtectedContent:()=>{const r=deferred();requests.push(r);return r.promise;}};
   if(p.includes('research-profiles'))return {getResearchProfiles:()=>[],refreshResearchProfiles:()=>profiles.promise};
   if(p.includes('live-data'))return {getFundingData:()=>({index:{cards:[]},details:{}})};
   if(p.includes('metered-access'))return {resolveDetailAccess:()=>({contentLocked:true,lockReason:'unregistered'}),contentLockReason:e=>e.accessState,protectedResourceId:x=>x};
   if(p.includes('entity-library'))return require('../miniprogram/utils/entity-library.js');
   if(p.includes('company-display'))return require('../miniprogram/utils/company-display.js');
   return {};
  }
 });
 page.setData=p=>{Object.assign(page.data,p);frames.push(JSON.parse(JSON.stringify(page.data)));};
 return {page,frames,requests,profiles,identity:v=>identity=v};
}
const gate=f=>f.contentLocked&&!f.accessPending&&f.lockReason!=='error';
test('stale guest cache and repeated onShow never flash registration during successful member verification',async()=>{
 const h=harness();h.page.onLoad({type:'products',key:'product'});h.page.onShow();
 assert.ok(h.page.data.accessPending);assert.ok(h.frames.every(f=>!gate(f)));
 h.requests[0].resolve({name:'NPO光引擎',summary:'完整用途',rounds:[{id:'funding'}]});await settle();
 assert.equal(h.page.data.contentLocked,false);
 h.profiles.resolve([]);await settle();assert.equal(h.page.data.entity.summary,'完整用途','late public profile refresh must not replace verified product details');
 h.page.onShow();assert.ok(h.page.data.accessPending);assert.ok(h.frames.every(f=>!gate(f)));
 h.requests[1].resolve({name:'NPO光引擎',rounds:[]});await settle();assert.ok(h.frames.every(f=>!gate(f)));
 const template=fs.readFileSync('miniprogram/pages/entity-detail/index.wxml','utf8');
 assert.match(template,/contentLocked && !accessPending && lockReason !== 'error'/);
 assert.match(template,/!contentLocked && !accessPending/);
});
test('only authoritative access denial shows registration, renewal or session recovery; network failure stays retryable',async()=>{
 for(const reason of ['unregistered','expired','session','network']){
  const h=harness();h.page.onLoad({type:'products',key:'product'});
  h.requests[0].reject(reason==='network'?Error('offline'):{statusCode:403,accessState:reason});await settle();
  assert.equal(h.page.data.accessPending,false);assert.equal(h.page.data.contentLocked,true);
  assert.equal(gate(h.page.data),reason!=='network');assert.equal(h.page.data.lockReason,reason==='network'?'error':reason);
  assert.equal(h.page.data.registrationOpen,false);
 }
});
test('superseded account response cannot unlock another account pending view',async()=>{
 const h=harness();h.page.onLoad({type:'products',key:'product'});h.page.onShow();h.identity('new-member');h.page.onShow();
 h.requests[0].resolve({name:'old secret'});await settle();assert.equal(h.page.data.accessPending,true);assert.notEqual(h.page.data.entity.name,'old secret');
 h.requests[1].resolve({name:'new visible'});await settle();assert.equal(h.page.data.entity.name,'new visible');assert.equal(h.page.data.contentLocked,false);
});
