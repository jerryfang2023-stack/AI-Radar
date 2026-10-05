import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {productionPlan} from '../run.mjs';
import {buildInvestmentInstitutionRegistry,investmentInstitutionId} from '../../product/investment-institution-v1.mjs';

test('a card admitted by final classification has materialized investor links before release',()=>{
  const card={funding_insight_id:'FI-new',triggered_by_event_id:'EV-new',company:{name:'AI Example',entity_id:'EN-example'},financing:{announced_at:'2026-10-05',round:'种子轮',investors:[{name:'New Fund',role:'本轮参投',evidence_refs:[]}]}};
  let classified=false,cards=[],registry={institutions:[]},details=new Set(),checked=false;
  for(const stage of productionPlan('2026-10-05','reports'))for(const [command] of stage.commands){
    switch(path.basename(command)){
      case 'classify.mjs':classified=true;break;
      case 'build-funding-insights-frontstage.mjs':cards=classified?[card]:[];break;
      case 'build-investment-institutions-v1.mjs':registry=buildInvestmentInstitutionRegistry(cards,{},'2026-10-05T00:00:00Z');break;
      case 'build-data-center-v4-frontstage.mjs':details=new Set(registry.institutions.map(i=>i.id));break;
      case 'frontstage-regression-gate.mjs':
        for(const c of cards)for(const investor of c.financing.investors)assert.ok(details.has(investmentInstitutionId(investor.name)),`dangling investor: ${investor.name}`);
        checked=true;break;
    }
  }
  assert.ok(checked,'public link integrity must be checked before PR creation');
  assert.ok(details.has(investmentInstitutionId('New Fund')));
});
