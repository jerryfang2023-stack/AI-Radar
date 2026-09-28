import test from 'node:test';import assert from 'node:assert/strict';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const entry={fundingId:'FI-abc',institution:'机构',summary:'看重可复制的产品交付能力。',sourceUrl:'https://example.com/source'};
test('reviewed observations validate attribution, source, length and duplicates',()=>{
 const {parseObservations}=require('../miniprogram/utils/featured-observations.js');
 assert.equal(parseObservations({schemaVersion:1,entries:[entry]})['FI-abc'],'机构：看重可复制的产品交付能力。');
 for(const entries of [[{...entry,sourceUrl:''}],[entry,entry],[{...entry,summary:'长'.repeat(81)}]]) assert.throws(()=>parseObservations({schemaVersion:1,entries}));
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
