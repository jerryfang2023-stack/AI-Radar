import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
import vm from 'node:vm';
const require=createRequire(import.meta.url);
const capital=require('../miniprogram/utils/capital-map.js');
const taxonomy=require('../miniprogram/data/financing-taxonomy.js');
const card=(id,date,extra={})=>({id,date,marketRegion:'global',categoryId:'subcategory:operations',parentCategoryId:'enterprise',...extra});
const index=(cards,date='2026-10-01')=>({meta:{taxonomyVersion:taxonomy.version,latestDate:date},cards});

test('two independent rounds in one subject remain two events in the capital map',()=>{
  const events=[card('seed','2026-08-01',{subjectCardId:'latest'}),card('latest','2026-09-01')];
  const grouped={...index([events[1]]),events};
  assert.equal(capital.build(grouped,taxonomy).count,2);
  assert.equal(grouped.cards.length,1);
});
test('all 7 parents and 45 children remain discoverable; correct distinct market totals and share denominators',()=>{
  const a=card('a','2026-09-01');
  const m=capital.build(index([a,a,card('b','2026-09-02',{categoryId:'subcategory:general-models',parentCategoryId:'models'}),card('cn','2026-09-02',{marketRegion:'china'}),card('unknown','2026-09-02',{marketRegion:'unknown'}),card('future','2026-10-02'),card('bad-date','2026-09-31')]),taxonomy,{unit:'share'});
  assert.equal(m.parents.length,7);assert.equal(m.rows.length,52);assert.equal(m.count,2);
  assert.equal(m.rows.filter(r=>!r.child).reduce((s,r)=>s+r.count,0),m.count);
  for(const p of m.parents)assert.equal(m.rows.find(r=>r.id===p.id).count,m.rows.filter(r=>r.parentId===p.id).reduce((s,r)=>s+r.count,0));
  assert.equal(m.rows.find(r=>r.id==='operations').cells[4].label,'50.0%');
  assert.equal(capital.build(index([a,card('cn','2026-09-02',{marketRegion:'china'})]),taxonomy,{market:'china'}).count,1);
});
test('cross-year and partial-month windows use complete months, including leap-day end',()=>{
  const m=capital.build(index([card('nov','2025-11-01'),card('dec','2025-12-01'),card('jan','2026-01-01')],'2026-01-02'),taxonomy,{range:3});
  assert.deepEqual(m.keys,['2025-11','2025-12','2026-01']);assert.equal(m.current,'2025-12');assert.equal(m.previous,'2025-11');assert.equal(m.focus.delta,0);
  const end=capital.build(index([],'2024-02-29'),taxonomy);assert.equal(end.partial,false);assert.equal(end.current,'2024-02');
});
test('stale taxonomy fails closed, invalid pairs stay outside aggregate, and drills match the exact selected cell',()=>{
  const data=index([card('a','2026-09-01'),card('b','2026-08-01'),card('bad','2026-09-02',{parentCategoryId:'models'})]);
  const m=capital.build(data,taxonomy);
  assert.equal(m.unclassified,1);assert.equal(m.count,2);
  assert.deepEqual(capital.details(m,'enterprise','2026-09').cards.map(c=>c.id),['a']);
  assert.equal(capital.details(m,'unknown'),null);
  assert.equal(capital.build({...data,meta:{...data.meta,taxonomyVersion:'old'}},taxonomy).ready,false);
  assert.equal(capital.build(index([]),taxonomy).count,0);
});
test('native controls retain 52 rows, route real financing IDs and restore tab bar after refresh',()=>{
  let page,navigation,hidden;
  const source=fs.readFileSync(new URL('../miniprogram/pages/market/index.js',import.meta.url),'utf8');
  const data={index:index([card('one & two','2026-09-01')])};
  vm.runInNewContext(source,{Page:p=>page=p,wx:{getStorageSync:()=>'',navigateTo:p=>navigation=p.url},require:name=>({
    '../../utils/capital-map.js':capital,'../../data/financing-taxonomy.js':taxonomy,
    '../../utils/directory-page.js':{data:{},applyDirectory(){}},'../../utils/live-data.js':{getFundingData:()=>data},
    '../../utils/community-essays.js':{},'../../utils/tab-bar.js':{},'../../utils/analytics.js':{track(){}}
  })[name]});
  page.setData=(v,cb)=>{Object.assign(page.data,v);cb?.();};page.getTabBar=()=>({setData:v=>hidden=v.hidden});
  page.onLoad();page.toggleMapAll();assert.equal(page.data.mapRows.length,52);
  page.changeMapRange({currentTarget:{dataset:{range:3}}});assert.equal(page.data.mapRows[0].cells.length,3);
  page.openMapDetail({currentTarget:{dataset:{id:'operations',month:'2026-09'}}});assert.equal(hidden,true);
  page.applyFunding(data);assert.equal(hidden,false);assert.equal(page.data.mapSheet,null);
  page.openMapFunding({currentTarget:{dataset:{id:'one & two'}}});assert.equal(navigation,'/pages/detail/index?id=one%20%26%20two');
});

test('native chart redraws cannot race an open financing sheet or hidden page',()=>{
 let page,queued=[],draws=0;
 vm.runInNewContext(fs.readFileSync(new URL('../miniprogram/pages/market/index.js',import.meta.url),'utf8'),{Page:p=>page=p,wx:{createCanvasContext(){},nextTick:fn=>queued.push(fn),getWindowInfo:()=>({windowWidth:390})},require:name=>name.includes('directory-page')?{data:{}}:{}});
 page.setData=(v,cb)=>{Object.assign(page.data,v);cb?.();};page.capitalModel={focus:{}};page.paintMapChart=()=>draws++;
 page.drawMapCharts();page.data.mapSheet={};queued.shift()();assert.equal(draws,0);
 page.closeMapDetail();queued.shift()();assert.equal(draws,1);
 page.drawMapCharts();page.onHide();queued.shift()();assert.equal(draws,1);
 const markup=fs.readFileSync(new URL('../miniprogram/pages/market/index.wxml',import.meta.url),'utf8');
 for(const canvas of markup.matchAll(/<canvas[^>]*>/g))assert.match(canvas[0],/wx:if="{{!mapSheet}}"/);
});
