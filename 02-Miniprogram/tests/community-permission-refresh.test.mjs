import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('403 refresh uses reading entitlement regardless of group status', async()=>{
 for(const active of [true,false]){
  const context={module:{exports:{}},setTimeout,clearTimeout,require:(id)=>id.includes('payment')?{fetchMembership:async()=>({community:{status:'none'},membership:{active}})}:id.includes('metered-access')?{contentLockReason:e=>e.accessState}:{syncCommunity(){},syncMembership(){}}};
  vm.runInNewContext(fs.readFileSync('miniprogram/utils/community-loading.js','utf8'),context);
  const page={data:{},setData(p){Object.assign(this.data,p)}};let count=0;
  await context.module.exports.readCommunityPage(page,async()=>{count++;if(count===1)throw Object.assign(Error('拒绝'),{statusCode:403})},()=>{});
  assert.equal(count,active?2:1);
  if(active)assert.equal(page.data.error,'');else {assert.match(page.data.error,/阅读权限已到期/);assert.equal(page.data.lockReason,'expired');assert.equal(page.data.communityAccessBlocked,true);}
 }
});
function harness({active=true,token=true,registered=true,status='none'}={}){
 const state={active,token,registered,status,calls:0,logins:0,memberships:0};
 const member={getMembership:()=>({registered:state.registered}),syncMembership(){},syncWallet(){},syncCommunity(){},saveProfile(){}};
 const payment={hasAuthToken:()=>state.token,fetchMembership:async()=>{state.calls++;return {membership:{active:state.active},community:{status:state.status}}},login:async()=>{state.logins++;state.token=true;return {membership:{active:state.active}}}};
 const shared={module:{exports:{}},wx:{showToast(){}},require:id=>id.includes('payment')?payment:id.includes('member.js')?member:{getAccessState:()=>state.registered?'active':'unregistered',openMembership:()=>state.memberships++}};
 vm.runInNewContext(fs.readFileSync('miniprogram/utils/metered-access.js','utf8'),shared);
 const ctx={module:{exports:{}},wx:{showToast(){}},require:id=>id.includes('experience')?{readExperience:()=>null}:id.includes('payment')?payment:id.includes('metered-access')?shared.module.exports:member};
 vm.runInNewContext(fs.readFileSync('miniprogram/utils/community-access.js','utf8'),ctx);
 const page={data:{},setData(p){Object.assign(this.data,p)},...ctx.module.exports.communityGate};
 return {state,page,guard:ctx.module.exports.requireCommunityMember};
}
test('community reads depend only on unified reading entitlement, regardless of group approval',async()=>{
 for(const status of ['none','pending','rejected','joined'])for(const active of [true,false]){
  const h=harness({status,active});let called=0;
  assert.equal(await h.guard(()=>called++,h.page),active);
  assert.equal(called,active?1:0);assert.equal(h.state.calls,1);
  assert.equal(h.state.memberships,0);
  if(!active){assert.equal(h.page.data.lockReason,'expired');await h.page.unlockCommunity();assert.equal(h.state.memberships,1);}
 }
});
test('guest direct entry waits for explicit action and uses the shared registration sheet',async()=>{
 const h=harness({token:false,registered:false});let visits=0;
 await h.guard(()=>visits++,h.page);
 assert.equal(h.state.calls,0);assert.equal(h.page.data.registrationOpen,undefined);
 await h.page.unlockCommunity();assert.equal(h.page.data.registrationOpen,true);
 h.page.closeRegistration();assert.equal(h.page.data.registrationOpen,false);assert.equal(visits,0);
 await h.guard(()=>visits++,h.page,true);assert.equal(h.page.data.registrationOpen,true);
 h.state.token=true;h.state.registered=true;
 await h.page.continueAfterRegistration();assert.equal(visits,1);assert.equal(h.page.data.communityAccessBlocked,false);
});
test('registered expired session restores login and original destination without asking to register',async()=>{
 const h=harness({token:false});let visits=0;
 await h.guard(()=>visits++,h.page,true);
 assert.equal(h.state.logins,1);assert.equal(visits,1);assert.equal(h.page.data.registrationOpen,undefined);
});
