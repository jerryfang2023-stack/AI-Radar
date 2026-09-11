import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
test('community denial refreshes identity once; never grants missing membership',async()=>{
 for(const status of ['joined','not_joined']){
  const context={module:{exports:{}},setTimeout,clearTimeout,require:id=>id.includes('payment')?{fetchMembership:async()=>({community:{status}})}:{syncCommunity:c=>assert.equal(c.status,status)}};
  vm.runInNewContext(fs.readFileSync('miniprogram/utils/community-loading.js','utf8'),context);
  const page={data:{},setData(p){Object.assign(this.data,p)}};let count=0;
  await context.module.exports.readCommunityPage(page,async()=>{count++;if(count===1)throw Object.assign(Error('拒绝'),{statusCode:403})},()=>{});
  assert.equal(count,status==='joined'?2:1);
  if(status==='joined')assert.equal(page.data.error,'');else assert.match(page.data.error,/登记入群日期/);
 }
});
