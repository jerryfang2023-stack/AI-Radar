import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';const require=createRequire(import.meta.url);const {directory}=require('../miniprogram/utils/directory.js');
const cards=[{id:'cn',company:'中国企业',products:['助手'],category:'企业服务',marketRegion:'china',date:'2026-09-14',leadInvestor:'共同基金'},{id:'us',company:'Global Co',products:['助手'],category:'开发工具',marketRegion:'global',date:'2026-09-13',leadInvestor:'共同基金'}];
const state={index:{cards},details:{cn:{founders:[{name:'甲',role:'创始人'}]},us:{founders:[{name:'乙',role:'创始人'}]}}};
test('directory partitions markets, scopes product identity to owner and combines filters',()=>{const cn=directory(state,{type:'products',market:'china'});const us=directory(state,{type:'products',market:'global'});assert.equal(cn.total,1);assert.equal(us.total,1);assert.notEqual(cn.items[0].key,us.items[0].key);assert.equal(directory(state,{market:'china',type:'investors'}).total,1);assert.equal(directory(state,{market:'global',type:'investors'}).total,1);assert.equal(directory(state,{market:'global',query:'中国企业'}).total,0);assert.equal(directory(state,{market:'china',type:'people'}).total,1);});
test('directory paginates without losing filters and resets invalid category',()=>{const first=directory(state,{market:'china',limit:2});assert.equal(first.items.length,2);assert.equal(first.hasMore,true);assert.equal(directory(state,{market:'china',limit:20}).total,4);assert.equal(directory(state,{market:'global',category:'企业服务'}).category,'全部赛道');});

test('product listing uses owner-scoped purpose even when latest financing omitted it',()=>{
 const records=[{...cards[1],id:'new',date:'2026-10-02'},{...cards[1],id:'older',date:'2026-10-01'},cards[0]];
 const result=directory({index:{cards:records},details:{older:{products:[{name:'助手',description:'为开发者审查代码并运行测试'}]},cn:{products:[{name:'助手',description:'国内公司的独立用途'}]}}},{type:'products',market:'global'});
 assert.equal(result.total,1);assert.equal(result.items[0].subtitle,'为开发者审查代码并运行测试');
});
