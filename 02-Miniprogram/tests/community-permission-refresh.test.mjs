import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('403 refresh uses reading entitlement regardless of group status', async()=>{
 for(const active of [true,false]){
  const context={module:{exports:{}},setTimeout,clearTimeout,require:(id)=>id.includes('payment')?{fetchMembership:async()=>({community:{status:'none'},membership:{active}})}:{syncCommunity(){},syncMembership(){}}};
  vm.runInNewContext(fs.readFileSync('miniprogram/utils/community-loading.js','utf8'),context);
  const page={data:{},setData(p){Object.assign(this.data,p)}};let count=0;
  await context.module.exports.readCommunityPage(page,async()=>{count++;if(count===1)throw Object.assign(Error('拒绝'),{statusCode:403})},()=>{});
  assert.equal(count,active?2:1);
  if(active)assert.equal(page.data.error,'');else assert.match(page.data.error,/阅读权限已到期/);
 }
});
test('community access fetches fresh entitlement and never redirects to group application',async()=>{
 for(const active of [true,false]){
  let called=0; const urls=[];
  const context={module:{exports:{}},wx:{navigateTo:v=>urls.push(v.url)},require:id=>id.includes('experience')?{readExperience:()=>null}:id.includes('payment')?{fetchMembership:async()=>({membership:{active},community:{status:'none'}})}:{syncMembership(){}}};
  vm.runInNewContext(fs.readFileSync('miniprogram/utils/community-access.js','utf8'),context);
  assert.equal(await context.module.exports.requireCommunityMember(()=>called++),active);
  assert.equal(called,active?1:0);
  assert.deepEqual(urls,active?[]:['/pages/membership/index']);
 }
});
