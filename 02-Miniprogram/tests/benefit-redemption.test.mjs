import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

function fixture({signed=true,balance=1200,fail=false}={}) {
 let modal; const calls=[]; const sync=[]; const urls=[]; let release;
 const pending=new Promise(resolve=>release=resolve);
 const growth={wallet:{balance},benefits:[{id:"membership_7d",title:"7 天会员权益",cost:300,days:7,affordable:balance>=300},{id:"membership_30d",title:"30 天会员权益",cost:1000,days:30,affordable:balance>=1000}]};
 const context={module:{exports:{}},require:id=>id.includes("member.js")?{getGrowthSnapshot:()=>growth,syncWallet:v=>sync.push(["wallet",v]),syncMembership:v=>sync.push(["membership",v])}:{hasAuthToken:()=>signed,redeemPoints:async id=>{calls.push(id);await pending;if(fail)throw Error("积分不足");return {wallet:{balance:200},membership:{active:true}};}},wx:{navigateTo:v=>urls.push(v.url),showModal:v=>{modal=v;},showLoading(){},hideLoading(){},showToast(){}}};
 vm.runInNewContext(fs.readFileSync("miniprogram/utils/benefit-redemption.js","utf8"),context);
 const page={data:{},setData:v=>Object.assign(page.data,v)};
 return {redeem:id=>context.module.exports.redeemOnPage(page,{currentTarget:{dataset:{id}}}),confirm:v=>modal.success({confirm:v}),calls,sync,urls,page,release};
}
test("profile redeems both durations through server and blocks repeat taps",async()=>{
 for(const id of ["membership_7d","membership_30d"]){
  const h=fixture();const first=h.redeem(id);await h.redeem(id);assert.equal(h.calls.length,0);
  h.confirm(true);await Promise.resolve();await h.redeem(id);assert.deepEqual(h.calls,[id]);assert.equal(h.sync.length,0);
  h.release();await first;assert.equal(h.sync.length,2);assert.equal(h.page.data.redeeming,"");assert.equal(h.page._redemptionPending,false);
 }
});
test("cancel, insufficient points, missing auth and server failure never grant locally",async()=>{
 const cancel=fixture();const done=cancel.redeem("membership_7d");cancel.confirm(false);await done;assert.equal(cancel.calls.length,0);assert.equal(cancel.page._redemptionPending,false);
 const short=fixture({balance:1});await short.redeem("membership_7d");assert.equal(short.calls.length,0);
 const guest=fixture({signed:false});await guest.redeem("membership_7d");assert.deepEqual(guest.urls,["/pages/membership/index"]);
 const fail=fixture({fail:true});const pending=fail.redeem("membership_30d");fail.confirm(true);fail.release();await pending;assert.equal(fail.sync.length,0);assert.equal(fail.page._redemptionPending,false);
});
test("profile invitation is in tasks and redemption stays on the page without all-benefits link",()=>{
 const source=fs.readFileSync("miniprogram/pages/profile/index.wxml","utf8");
 assert.match(source,/class="action-row" bindtap="openInvite"/);
 assert.match(source,/权益兑换/);assert.match(source,/data-id="\{\{item.id\}\}" bindtap="redeem"/);
 assert.doesNotMatch(source,/invite-card|全部权益|我的权益/);
});
