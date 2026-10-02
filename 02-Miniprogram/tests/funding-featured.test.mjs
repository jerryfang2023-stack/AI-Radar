import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const {selectFeatured,chinaDate}=require('../miniprogram/utils/funding-featured.js');
const card=(id,extra={})=>({id,company:id,marketRegion:'global',date:'2026-09-28',products:['Product'],category:'数据',...extra});
const feed=(ids,extra={})=>({schemaVersion:1,windows:[{startsAt:'2026-09-01T00:00:00Z',endsAt:'2026-11-01T00:00:00Z',markets:{global:ids.map(id=>({fundingId:id,date:'2026-09-28'})),china:[]},...extra}]});
const obs={a:'已审核观点',b:'投资机构：已审核观点',c:'已审核观点'};
const select=(cards,selection,observations=obs)=>selectFeatured(cards,'global','2026-10-02',observations,selection,Date.parse('2026-10-02T01:00:00Z'));
test('backend order overrides recency; no latest-three fallback without approved selection',()=>{
 assert.deepEqual(select([card('a'),card('b')],feed(['b','a'])).cards.map(c=>c.id),['b','a']);
 for(const f of [null,feed([]),feed(['removed'])])assert.deepEqual(select([card('a')],f).cards,[]);
 assert.deepEqual(selectFeatured([card('a')],'global').cards,[]);
});
test('client rejects cross-market, hidden, robots, changed round, future and missing observations',()=>{
 const invalid=[{marketRegion:'china'},{hidden:true},{productForm:'机器人系统'},{date:'2026-09-29'},{date:'2026-11-01'},{category:'未分类'}];
 for(const extra of invalid)assert.deepEqual(select([card('a',extra)],feed(['a'])).cards,[]);
 assert.deepEqual(select([card('a')],feed(['a']),{}).cards,[]);
 assert.equal(select([card('a')],feed(['a','a'])).cards.length,1);
});
test('exact window boundaries remove expired selections and activate replacement',()=>{
 const f=feed(['a']);f.windows[0].endsAt='2026-10-02T01:00:00Z';
 assert.deepEqual(select([card('a')],f).cards,[]);
 f.windows.push({...feed(['b']).windows[0],startsAt:'2026-10-02T01:00:00Z'});
 assert.equal(select([card('a'),card('b')],f).cards[0].id,'b');
});
test('missing facts explicit; day uses China time',()=>{
 const result=select([card('a',{products:[]})],feed(['a'])).cards[0];
 assert.equal(result.product,'');assert.equal(result.amount,'金额未披露');assert.equal(result.round,'轮次未披露');assert.equal(chinaDate(new Date('2026-09-27T16:01:00Z')),'2026-09-28');
});
test('page preserves chosen slide after refresh, resets removed selection, taps existing detail',()=>{
 let page,url;
 vm.runInNewContext(fs.readFileSync(new URL('../miniprogram/pages/terminal/index.js',import.meta.url),'utf8'),{Page:p=>page=p,wx:{navigateTo:o=>url=o.url},require:p=>p.includes('funding-featured')?{selectFeatured,chinaDate}:p.includes('live-data')?{getFundingData:()=>({index:{meta:{},cards:[]}})}:{}});
 page.setData=function(patch,cb){Object.assign(this.data,patch);cb?.();};page.refreshCards=()=>{};
 page.featuredSelection=feed(['a','b','c'],{startsAt:'2000-01-01T00:00:00Z',endsAt:'2100-01-01T00:00:00Z'});page.featuredObservations=obs;
 const input={cards:[card('a'),card('b'),card('c')],meta:{latestDate:'2026-09-28'}};
 page.updateMetrics(input);page.changeFeatured({detail:{current:2}});page.updateMetrics(input);
 assert.equal(page.data.featuredCurrent,2);page.openFeatured({currentTarget:{dataset:{id:'c'}}});assert.equal(url,'/pages/detail/index?id=c');
 page.openFeatured({currentTarget:{dataset:{id:'removed'}}});assert.equal(url,'/pages/detail/index?id=c');
 page.applyFundingData({cards:[],meta:input.meta});assert.equal(page.data.featuredCards.length,0);assert.equal(page.data.featuredCurrent,0);
});
test('foreground boundary refreshes and hidden/unloaded pages cancel timer work',()=>{
 let page,callback,delay,cleared=0,updates=0;
 vm.runInNewContext(fs.readFileSync(new URL('../miniprogram/pages/terminal/index.js',import.meta.url),'utf8'),{Page:p=>page=p,Date,setTimeout:(fn,ms)=>{callback=fn;delay=ms;return 1;},clearTimeout:()=>cleared++,require:p=>p.includes('live-data')?{getFundingData:()=>({index:{meta:{},cards:[]}})}:{}});
 const now=Date.now();page.featuredVisible=true;page.featuredSelection={windows:[{startsAt:new Date(now-1000).toISOString(),endsAt:new Date(now+1000).toISOString()}]};page.updateMetrics=()=>updates++;
 page.scheduleFeaturedBoundary();assert.ok(delay>0&&delay<=1025);callback();assert.equal(updates,1);
 page.onHide();callback();assert.equal(updates,1);assert.ok(cleared>=2);page.onUnload();assert.equal(page.featuredDisposed,true);
});
