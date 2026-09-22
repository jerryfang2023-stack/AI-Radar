import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../../../',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
test('Sep23 reviewed Chinese companies stay in China across funding rounds',()=>{
 const data=read('01-SiteV2/site/data/funding-insights-v1.json');
 const registry=read('01-SiteV2/content/11-databases/china-market-entity-aliases-v1.json');
 for(const name of ['弋途科技','无问智科','元点科技（SCALEFORCE）','丘脑智能']){
  assert.ok(registry.entities.some(e=>e.aliases.includes(name)&&e.market_review?.sources.length));
  const cards=data.cards.filter(c=>c.company.name===name);assert.ok(cards.length);
  for(const c of cards){assert.equal(c.market_scope.market_region,'CN');assert.equal(c.market_scope.china_market_match,true);}
 }
});
