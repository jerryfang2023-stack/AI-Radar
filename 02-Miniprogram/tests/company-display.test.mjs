import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import fs from 'node:fs';
const require=createRequire(import.meta.url);
const {companyDisplayName}=require('../miniprogram/utils/company-display.js');
const {buildEntityLibrary,companyEntityKey}=require('../miniprogram/utils/entity-library.js');
const {selectFeatured}=require('../miniprogram/utils/funding-featured.js');
const {filterCards}=require('../miniprogram/utils/funding.js');
test('reviewed Chinese abbreviations retain full identity, links and search without guessing unknown names',()=>{
 const entries=JSON.parse(fs.readFileSync('data-input/company-display-names.json')).entries;
 for(const row of entries){
  assert.ok(row.quote.includes(row.name));assert.match(row.sourceUrl,/^https?:\/\//);
  const card={id:'stable',company:row.fullName,companyFullName:row.fullName,marketRegion:'china',date:'2026-10-01',category:'数据',products:['产品'],summary:''};
  const entity=buildEntityLibrary([card]).companies[0];
  assert.equal(entity.displayName,row.name);assert.equal(entity.name,row.fullName);assert.equal(entity.key,companyEntityKey(row.fullName));
  assert.equal(selectFeatured([card],'china','2026-10-02').cards[0].company,row.name);
  for(const keyword of [row.fullName,row.name])assert.equal(filterCards([card],{keyword,period:'all',region:'all',roundGroup:'all',categoryId:'all',evidenceId:'all'},card.date).length,1);
  assert.equal(companyDisplayName(row.fullName,'global'),row.fullName);
 }
 assert.equal(companyDisplayName('上海未知科技有限公司','china'),'上海未知科技有限公司');
});
