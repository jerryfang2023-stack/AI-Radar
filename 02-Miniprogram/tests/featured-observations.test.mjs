import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const entry={fundingId:'FI-abc',institution:'机构',summary:'看重可复制的产品交付能力。',sourceUrl:'https://example.com/source'};
test('reviewed observations validate attribution, source, length and duplicates',()=>{
 const {parseObservations}=require('../miniprogram/utils/featured-observations.js');
 assert.equal(parseObservations({schemaVersion:1,entries:[entry]})['FI-abc'],'机构：看重可复制的产品交付能力。');
 for(const entries of [[{...entry,sourceUrl:''}],[entry,entry],[{...entry,summary:'长'.repeat(81)}]]) assert.throws(()=>parseObservations({schemaVersion:1,entries}));
});

test('editorial explanation displays its text directly while investor attribution stays visible',()=>{
 const {parseObservations}=require('../miniprogram/utils/featured-observations.js');
 for(const kind of [undefined,'editorial']) {
  assert.equal(parseObservations({schemaVersion:1,entries:[{...entry,institution:'观澜分析',kind}]})['FI-abc'],entry.summary);
 }
 assert.equal(parseObservations({schemaVersion:1,entries:[{...entry,kind:'institution'}]})['FI-abc'],'机构：'+entry.summary);
 assert.throws(()=>parseObservations({schemaVersion:1,entries:[{...entry,institution:'观澜分析',summary:'长'.repeat(80)}]}));
});
test('same-day content updates and removal need no funding manifest change; failures retain accepted data',async()=>{
 delete require.cache[require.resolve('../miniprogram/utils/featured-observations.js')];
 const service=require('../miniprogram/utils/featured-observations.js');let callback;
 global.wx={request:o=>{callback=o;}};
 try {
  const first=service.refreshObservations();assert.equal(service.refreshObservations(),first);
  callback.success({statusCode:200,data:{schemaVersion:1,entries:[entry]}});assert.ok((await first)['FI-abc']);
  const second=service.refreshObservations();callback.success({statusCode:200,data:{schemaVersion:1,entries:[{...entry,summary:'更新后的投资观点。'}]}});assert.equal((await second)['FI-abc'],'机构：更新后的投资观点。');
  const failure=service.refreshObservations();callback.fail();assert.equal((await failure)['FI-abc'],'机构：更新后的投资观点。');
  const removed=service.refreshObservations();callback.success({statusCode:200,data:{schemaVersion:1,entries:[]}});assert.deepEqual(await removed,{});
 } finally {delete global.wx;}
});

const selection={schemaVersion:1,windows:[{startsAt:'2026-10-02T00:00:00Z',endsAt:'2026-10-03T00:00:00Z',markets:{global:[{fundingId:entry.fundingId,date:'2026-10-01'}],china:[]}}]};
test('selection rejects overlaps, invalid dates, duplicate IDs and overfull markets',()=>{
 const {parseSelection}=require('../miniprogram/utils/featured-observations.js');
 assert.equal(parseSelection(undefined),null);assert.equal(parseSelection(selection).windows.length,1);
 for(const bad of [
  {...selection,windows:[selection.windows[0],selection.windows[0]]},
  {...selection,windows:[{...selection.windows[0],endsAt:'invalid'}]},
  {...selection,windows:[{...selection.windows[0],markets:{global:Array(4).fill(selection.windows[0].markets.global[0]),china:[]}}]},
 ])assert.throws(()=>parseSelection(bad));
});
test('feed accepts copy and selection atomically; valid empty clears, malformed update retains',async()=>{
 delete require.cache[require.resolve('../miniprogram/utils/featured-observations.js')];
 const service=require('../miniprogram/utils/featured-observations.js');let callback;global.wx={request:o=>{callback=o;}};
 try {
  const first=service.refreshFeatured();callback.success({statusCode:200,data:{schemaVersion:1,entries:[entry],selection}});const accepted=await first;
  const bad=service.refreshFeatured();callback.success({statusCode:200,data:{schemaVersion:1,entries:[],selection:{}}});assert.deepEqual(await bad,accepted);
  const empty=service.refreshFeatured();callback.success({statusCode:200,data:{schemaVersion:1,entries:[],selection:{schemaVersion:1,windows:[]}}});assert.deepEqual(await empty,{observations:{},selection:{schemaVersion:1,windows:[]}});
 }finally{delete global.wx;}
});
