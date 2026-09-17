import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
for (const state of ['joined','not_joined','none']) {
 test(`successful login with ${state} identity never loops back to registration`,async()=>{
  let component;const calls=[],events=[],toasts=[];
  vm.runInNewContext(fs.readFileSync('miniprogram/components/registration-sheet/index.js','utf8'),{
   Component:c=>component=c,
   require:id=>id.includes('payment.js')?{login:async options=>{calls.push(options);return {token:'signed',profile:{nickname:'贝琳达'},membership:{active:true,activeUntil:'2026-12-01'},community:{status:state}}}}:id.includes('analytics.js')?{track:()=>{},flush:()=>{}}:{saveProfile:()=>{},syncBehaviorQueue:async()=>{},syncCommunity:()=>{},syncMembership:v=>v,syncWallet:()=>{}},
   wx:{showToast:p=>toasts.push(p)},getCurrentPages:()=>[]
  });
  const instance={...component.methods,data:{...component.data,nickname:'贝琳达',avatarSelected:true},properties:{},setData(p){Object.assign(this.data,p)},triggerEvent:(...args)=>events.push(args)};
  await instance.linkExistingMember({detail:{code:'one-use'}});
  assert.equal(calls.length,1);assert.equal(calls[0].nickname,'贝琳达');assert.equal(calls[0].avatarSelected,true);
  assert.equal(instance.data.registered,true);assert.equal(events[0][0],'registered');assert.equal(events[0][1].linkedCommunity,state==='joined');assert.equal(toasts.length,0);
 });
}
