import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { projectReadModel, buildReadModel } from '../read-model.mjs';

function fixture() {
  const company={entity_id:'EN-a',application_entity_id:'EN-a',name:'Acme',founders:[{name:'Unknown identity',role:'Founder',entity_id:null}]};
  const event=(id,amount,date)=>({funding_insight_id:id,subject_card_id:'FI-new',triggered_by_event_id:`EV-${id}`,company,financing:{round:'seed',announced_at:date,amount_normalized:{currency:'USD',value:amount,status:amount===null?'undisclosed':'exact'},investors:[{name:'Investor',entity_id:null,institution_id:null}]}});
  return {meta:{card_count:1,event_count:2},cards:[{funding_insight_id:'FI-new',company,triggered_by_event_id:'EV-FI-new',analysis:{capital_judgment:'Research only'},research_sources:[{source_id:'S-a',source_url:'https://example.org',body:'must never be copied'}],financing:{evidence_refs:[{source_id:'S-a',quote:'Exact quote'}]}}],event_cards:[event('FI-old',10,'2026-01-01'),event('FI-new',null,'2026-02-01')],card_aliases:{'FI-old':'FI-new'},company_aliases:{'EN-old':'EN-a'}};
}
test('multiple rounds preserve event amounts, unknown identities and old routes without polluting facts with research',()=>{
  const source=fixture(),snapshot=structuredClone(source),tables=projectReadModel(source);
  assert.equal(tables.funding_subjects.length,1);assert.equal(tables.funding_events.length,2);
  assert.deepEqual(tables.funding_events.map(e=>e.amount_value),[10,null]);
  assert.equal(tables.investment_participations[0].institution_id,null);
  assert.equal(tables.people_affiliations[0].person_id,null);
  assert.ok(!JSON.stringify(tables.source_references).includes('must never'));
  assert.ok(!JSON.stringify(tables.funding_events).includes('Research only'));
  assert.ok(tables.application_research[0].analysis_json.includes('Research only'));
  assert.equal(tables.id_aliases[0].target_id,'FI-new');assert.deepEqual(source,snapshot);
});
test('dangling event, evidence and alias joins stop the projection',()=>{
  const a=fixture();a.event_cards[0].subject_card_id='missing';assert.throws(()=>projectReadModel(a),/event_join/);
  const b=fixture();b.cards[0].financing.evidence_refs[0].source_id='missing';assert.throws(()=>projectReadModel(b),/unresolved_financing_evidence/);
  const c=fixture();c.company_aliases['EN-old']='missing';assert.throws(()=>projectReadModel(c),/unresolved_financing_alias/);
});
test('failed database build keeps the previous accepted release pointer intact',()=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'financing-read-model-'));
  try {
    const input=path.join(tmp,'input.json'),output=path.join(tmp,'output');fs.writeFileSync(input,JSON.stringify(fixture()));
    const root=fileURLToPath(new URL('../../../',import.meta.url));
    buildReadModel({root,input,output,database:false});
    const previous=fs.readFileSync(path.join(output,'current.json'),'utf8');
    assert.throws(()=>buildReadModel({root,input,output,duckdb:'missing-duckdb-command'}),/duckdb_build_failed/);
    assert.equal(fs.readFileSync(path.join(output,'current.json'),'utf8'),previous);
    assert.equal(fs.existsSync(path.join(output,'build.lock')),false);
  } finally {fs.rmSync(tmp,{recursive:true,force:true});}
});
