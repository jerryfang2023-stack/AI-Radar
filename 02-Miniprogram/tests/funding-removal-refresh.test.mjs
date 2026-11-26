import assert from 'node:assert/strict';
import test from 'node:test';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const bundled=require('../miniprogram/data/funding-index.js');
test('reviewed removals replace larger index, prune details, retain accepted manifest on failure', async () => {
 const storage=new Map([['guanlan_live_funding_index_v1',{cards:[{id:'old-hidden'}]}]]);
 let version='initial', index=bundled, bad=false;
 const calls=[];
 global.wx={getStorageSync:k=>storage.get(k),setStorageSync:(k,v)=>storage.set(k,v),request:({url,success})=>{
  calls.push(url);
  success({statusCode:200,data:url.includes('manifest')?{version,latestDate:index.meta.latestDate,fundingVersion:index.meta.fundingVersion,taxonomyVersion:index.meta.taxonomyVersion,cardCount:index.cards.length+(bad?1:0),indexPath:'/index',detailBasePath:'/details'}:url.includes('/details/')?{...index.cards[0],detailComplete:true}:index});
 }};
 delete require.cache[require.resolve('../miniprogram/utils/live-data.js')];
 const live=require('../miniprogram/utils/live-data.js');
 try {
  assert.equal(live.getFundingData().index.cards.some(c=>c.id==='old-hidden'),false);
  await live.refreshFundingData();
  const removed=index.cards[0].id;
  await live.getFundingDetail(removed);
  assert.ok(live.getFundingData().details[removed]);
  version='reviewed'; index={...bundled,cards:bundled.cards.slice(1),meta:{...bundled.meta,cardCount:bundled.cards.length-1}};
  const result=await live.refreshFundingData();
  assert.equal(result.refreshFailed,false);assert.equal(result.index.cards.length,bundled.cards.length-1);
  assert.equal(result.details[removed],undefined);assert.equal(await live.getFundingDetail(removed),null);
  version='broken';bad=true;
  assert.equal((await live.refreshFundingData()).refreshFailed,true);
  await live.getFundingDetail(index.cards[0].id);
  assert.ok(calls.at(-1).endsWith('v=reviewed'));
  bad=false;version='empty';index={...index,cards:[],meta:{...index.meta,cardCount:0}};
  assert.equal((await live.refreshFundingData()).index.cards.length,0);
 } finally {delete global.wx;}
});
test('hidden detail refreshes then returns to funding list', async()=>{
 let page,refreshes=0,route;
 vm.runInNewContext(fs.readFileSync(new URL('../miniprogram/pages/detail/index.js',import.meta.url),'utf8'),{
  Page:p=>page=p,wx:{switchTab:o=>{route=o.url;},showToast:()=>{}},
  require:p=>p.includes('funding-visibility')?{isFundingVisible:card=>!card.hidden}:p.includes('live-data')?{refreshFundingData:()=>{refreshes++;return Promise.resolve();}}:{}
 });
 page.setData=()=>{};page.renderCard({id:'removed',hidden:true});await Promise.resolve();
 assert.equal(refreshes,1);assert.equal(route,'/pages/terminal/index');
});

test("historical financing previews and shares the requested round with the original company saved key", async () => {
  let page;
  const requests = [];
  const latest = { id: "FI-latest", company: "星河智能", round: "B轮" };
  const earlier = { ...latest, id: "FI-earlier", subjectCardId: latest.id, round: "A轮", amount: "5000万元", products: ["星河助手"] };
  const index = { cards: [latest], events: [latest, earlier] };
  vm.runInNewContext(fs.readFileSync(new URL("../miniprogram/pages/detail/index.js", import.meta.url), "utf8"), {
    Page: definition => { page = definition; }, wx: {},
    require: file => ({
      "company-display.js": { companyDisplayName: name => name },
      "funding-visibility.js": { isFundingVisible: () => true },
      "live-data.js": { getFundingData: () => ({ index }) },
      "storage.js": { isWatched: () => false, isCompared: () => false },
      "access.js": { getAccessState: () => "unregistered" },
      "metered-access.js": { resolveDetailAccess: () => ({ contentLocked: true }) },
      "payment.js": { fetchProtectedContent: async (type, id) => { requests.push([type, id]); return { ...earlier, id: latest.id }; } },
    })[file.split("/").at(-1)] || {},
  });
  page.setData = state => Object.assign(page.data, state);
  page.onLoad({ id: "round-FI-earlier" });
  assert.equal(page.data.card.round, "A轮");
  assert.equal(page.data.card.products[0].name, "星河助手");
  await Promise.resolve();
  assert.deepEqual(requests, [["funding", "round-FI-earlier"]]);
  assert.equal(page.data.card.id, latest.id);
  assert.match(page.onShareAppMessage().path, /id=round-FI-earlier/u);
  assert.match(page.onShareTimeline().query, /id=round-FI-earlier/u);
});
