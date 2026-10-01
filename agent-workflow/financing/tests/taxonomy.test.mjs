import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { taxonomy,classificationInput,classificationProblems,displayClassification } from '../taxonomy.mjs';

test('consumer companion devices survive scope migration; mixed robot portfolios remain reviewable',()=>{
  const registry=JSON.parse(fs.readFileSync(new URL('../../../01-SiteV2/content/12-applications/financing-taxonomy/decisions.json',import.meta.url))).decisions;
  assert.equal(registry['EV-41e71ae12a730f23'].scope,'included');
  assert.equal(registry['EV-41e71ae12a730f23'].subsector_id,'toys');
  assert.equal(registry['EV-86838cc774b85116'].scope,'review');
  assert.equal(registry['EV-47f16317cc2d62e2'].scope,'excluded');
});
test('financing taxonomy separates sectors from delivery and removes implementation/robotics tags',()=>{
  assert.equal(taxonomy.sectors.length,7);
  const ids=taxonomy.sectors.flatMap(row=>[row.id,...row.subsectors.map(child=>child.id)]);
  assert.equal(ids.length,new Set(ids).size);
  assert.ok(taxonomy.sectors.find(row=>row.id==='consumer-devices').subsectors.length===6);
  assert.ok(taxonomy.sectors.find(row=>row.id==='industry').subsectors.some(row=>row.id==='healthcare'));
  assert.doesNotMatch(ids.join(' '),/fde|physical_ai|robotic|deployment|mcp|rag/u);
});
test('classification cannot use stale legacy labels or invented evidence and parent combinations',()=>{
  const card={triggered_by_event_id:'EV-test',company:{name:'Example',evidence_refs:[{source_id:'S1',quote:'An AI developer platform'}]},products:[],analysis:{market_category_id:'physical_ai'}};
  const input=classificationInput(card);
  assert.equal(JSON.stringify(input).includes('physical_ai'),false);
  const good={id:input.id,scope:'included',sector_id:'developer-data',subsector_id:'agent-platforms',product_form_id:'developer-platform',customer_ids:['developer'],evidence_indices:[0],rationale:'原文明示开发者平台'};
  assert.deepEqual(classificationProblems(good,input),[]);
  assert.ok(classificationProblems({...good,sector_id:'consumer'},input).includes('invalid_sector_tuple'));
  assert.ok(classificationProblems({...good,evidence_indices:[5]},input).includes('invalid_evidence_index'));
  assert.ok(classificationProblems({...good,scope:'excluded',exclusion_reason:'medical'},input).includes('invalid_exclusion_reason'));
  assert.equal(displayClassification(good).sector.name,'AI 开发与数据');
  assert.notEqual(classificationInput({...card,company:{...card.company,evidence_refs:[{source_id:'S1',quote:'Changed company evidence'}]}}).input_hash,input.input_hash);
});
