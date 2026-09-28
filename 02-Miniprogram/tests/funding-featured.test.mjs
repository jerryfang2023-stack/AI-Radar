import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const {selectFeatured,chinaDate}=require('../miniprogram/utils/funding-featured.js');
const card=(id,extra={})=>({id,company:id,marketRegion:'global',date:'2026-09-28',products:['Product'],category:'数据',...extra});
test('featured partitions market and rejects hidden, robotic and future financing',()=>{
 const result=selectFeatured([card('valid'),card('unknown',{category:'未分类'}),card('cn',{marketRegion:'china'}),card('hidden',{hidden:true}),card('robot',{productForm:'机器人系统'}),card('future',{date:'2026-09-29'})],'global','2026-09-28');
 assert.deepEqual(result.cards.map(c=>c.id),['valid']);assert.equal(result.label,'');
});
test('dated fallback is bounded, deduplicated, and clears for empty index',()=>{
 const cards=Array.from({length:8},(_,i)=>card(String(i),{date:'2026-09-27'}));
 const result=selectFeatured([cards[0],...cards],'global','2026-09-28');
 assert.equal(result.cards.length,5);assert.equal(result.label,'最近披露 · 09-27');assert.equal(selectFeatured([],'china').cards.length,0);
});
test('missing facts stay explicit, observation uses supplied facts and day uses China time',()=>{
 const result=selectFeatured([card('a',{products:[],subcategory:'数据',leadInvestor:'投资方未披露'})],'global','2026-09-28').cards[0];
 assert.equal(result.product,'');assert.equal(result.amount,'金额未披露');assert.equal(result.round,'轮次未披露');assert.equal(result.observation,'');assert.equal(chinaDate(new Date('2026-09-27T16:01:00Z')),'2026-09-28');
});
test('empty refresh clears featured and taps use encoded existing detail route',()=>{
 let page,url;
 vm.runInNewContext(fs.readFileSync(new URL('../miniprogram/pages/terminal/index.js',import.meta.url),'utf8'),{Page:p=>page=p,wx:{navigateTo:o=>url=o.url},require:p=>p.includes('funding-featured')?{selectFeatured,chinaDate}:p.includes('live-data')?{getFundingData:()=>({index:{meta:{},cards:[]}})}:{}});
 page.setData=function(patch,cb){Object.assign(this.data,patch);cb?.();};page.refreshCards=()=>{};
 page.applyFundingData({cards:[],meta:{latestDate:'2026-09-28'}});assert.equal(page.data.featuredCards.length,0);
 page.data.featuredCards=[card('a&b')];page.openFeatured({currentTarget:{dataset:{id:'a&b'}}});assert.equal(url,'/pages/detail/index?id=a%26b');
 page.openFeatured({currentTarget:{dataset:{id:'removed'}}});assert.equal(url,'/pages/detail/index?id=a%26b');
});
