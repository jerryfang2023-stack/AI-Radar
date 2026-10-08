import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const funding=require('../miniprogram/data/funding-index.js');
const reports=require('../miniprogram/data/report-index.js');
function fixture(){
 const storage=new Map(),requests=[];
 global.wx={getStorageSync:k=>storage.get(k),setStorageSync:(k,v)=>storage.set(k,v),request:r=>requests.push(r)};
 delete require.cache[require.resolve('../miniprogram/utils/live-data.js')];
 const live=require('../miniprogram/utils/live-data.js');
 const answer=(r,data)=>r.success({statusCode:200,data});
 const fm=v=>({version:v,latestDate:funding.meta.latestDate,fundingVersion:funding.meta.fundingVersion,taxonomyVersion:funding.meta.taxonomyVersion,cardCount:funding.cards.length,indexPath:'/funding-index',entityPath:'/entities'});
 const rm=v=>({version:v,latestDate:reports.meta.latestDate,reportCount:reports.reports.length,communityCount:1,indexPath:'/report-index',communityDetailBasePath:'/community-details'});
 return {storage,requests,live,answer,fm,rm};
}
const tick=()=>new Promise(r=>setImmediate(r));
test('a failed report index leaves the accepted manifest and corrupt cache recovers from network',async()=>{
 const {live,requests,answer,rm,storage}=fixture();
 try{
  let load=live.refreshReportData();answer(requests.shift(),rm('accepted'));await tick();answer(requests.shift(),reports);await load;
  load=live.refreshReportData();answer(requests.shift(),rm('broken'));await tick();requests.shift().fail(new Error('offline'));await load;
  const id='community-essay-remote-audit';const detail=live.getCommunityDetail(id);await tick();
  assert.ok(requests[0].url.endsWith('v=accepted'));answer(requests.shift(),{id,type:'community',contentType:'community-essay',detailComplete:true,blocks:[]});await detail;
  storage.set('guanlan_live_report_index_v1',{meta:reports.meta,reports:[]});
  load=live.refreshReportData();answer(requests.shift(),rm('accepted'));await tick();
  assert.equal(requests.length,1,'invalid cached index must be replaced from the network');
  answer(requests.shift(),reports);assert.equal((await load).refreshFailed,false);
 }finally{delete global.wx;}
});
test('a community detail from an older report version cannot enter the current cache',async()=>{
 const {live,requests,answer,rm,storage}=fixture();
 try{
  let load=live.refreshReportData();answer(requests.shift(),rm('old'));await tick();answer(requests.shift(),reports);await load;
  const id='community-essay-remote-audit',detail=live.getCommunityDetail(id);await tick();const stale=requests.shift();
  load=live.refreshReportData();answer(requests.shift(),rm('new'));await tick();answer(requests.shift(),reports);await load;
  answer(stale,{id,type:'community',contentType:'community-essay',detailComplete:true,blocks:[{text:'stale body'}]});
  assert.equal(await detail,null);assert.equal(storage.get('guanlan_live_community_detail_cache_v1'),undefined);
 }finally{delete global.wx;}
});
test('an entity response bound to an older funding version cannot replace new public data',async()=>{
 const {live,requests,answer,fm,storage}=fixture();
 try{
  const old=live.refreshFundingEntities();answer(requests.shift(),fm('old'));await tick();answer(requests.shift(),funding);await tick();const stale=requests.shift();
  const current=live.refreshFundingData();answer(requests.shift(),fm('new'));await tick();answer(requests.shift(),funding);await current;
  answer(stale,{version:'old',details:{[funding.cards[0].id]:{...funding.cards[0],summary:'stale'}}});await old;
  assert.equal(storage.get('guanlan_live_funding_entities_v3'),undefined);
 }finally{delete global.wx;}
});
