import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const bundled=require('../miniprogram/data/funding-index.js');
const {currentFinancingIndex}=require('../miniprogram/utils/financing-taxonomy.js');

test('published fallback uses valid new sector tuples; old names cannot pass with a new version marker',()=>{
  assert.ok(currentFinancingIndex(bundled));
  const wrong=structuredClone(bundled);
  wrong.cards[0].subcategory='开发与部署';
  assert.equal(currentFinancingIndex(wrong),false);
  delete wrong.meta.taxonomyVersion;
  assert.equal(currentFinancingIndex(wrong),false);
});

test('obsolete same-version cache is fetched again; later old-taxonomy response cannot replace accepted data',async()=>{
  const manifest={version:'current',latestDate:bundled.meta.latestDate,fundingVersion:bundled.meta.fundingVersion,taxonomyVersion:bundled.meta.taxonomyVersion,cardCount:bundled.cards.length,indexPath:'/data/mini/funding-index.json'};
  const obsolete=structuredClone(bundled);delete obsolete.meta.taxonomyVersion;
  const storage=new Map([['guanlan_live_funding_manifest_v3',manifest],['guanlan_live_funding_index_v3',obsolete]]);
  let outdated=false,indexRequests=0;
  global.wx={getStorageSync:k=>storage.get(k),setStorageSync:(k,v)=>storage.set(k,v),request:({url,success})=>{
    if(url.includes('manifest'))success({statusCode:200,data:outdated?{...manifest,version:'old',taxonomyVersion:'TAG-V4.1'}:manifest});
    else {indexRequests++;success({statusCode:200,data:bundled});}
  }};
  delete require.cache[require.resolve('../miniprogram/utils/live-data.js')];
  const live=require('../miniprogram/utils/live-data.js');
  try {
    assert.ok(currentFinancingIndex(live.getFundingData().index));
    assert.equal((await live.refreshFundingData()).refreshFailed,false);
    assert.equal(indexRequests,1);
    assert.ok(currentFinancingIndex(storage.get('guanlan_live_funding_index_v3')));
    outdated=true;
    assert.equal((await live.refreshFundingData()).refreshFailed,true);
    assert.ok(currentFinancingIndex(live.getFundingData().index));
    assert.equal(indexRequests,1);
  } finally {delete global.wx;}
});
