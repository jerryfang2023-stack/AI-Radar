import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { captureOriginal } from '../capture.mjs';
import { collectHistory, existingFundingSourceUrls, historyUrlKey } from '../history-collect.mjs';
import { read } from '../state.mjs';

const body='Acme is an AI software company. Acme raised $20 million in Series A funding led by Example Ventures. '.repeat(5);
const response=date=>async()=>new Response(`<html><head><meta property="article:published_time" content="${date}"></head><article><h1>Acme AI raises Series A</h1><p>${body}</p></article></html>`);

test('explicit historical range admits original dates without weakening the daily window',async()=>{
  const lead={url:'https://example.com/round',published_at:'2026-10-01'},options={date:'2026-10-02',fetcher:response('2026-02-04')};
  assert.equal((await captureOriginal(lead,options)).reason,'outside_daily_window');
  const result=await captureOriginal(lead,{...options,historicalRange:{from:'2026-01-01',to:'2026-10-02'}});
  assert.equal(result.status,'accepted');assert.equal(result.record.published_at,'2026-02-04');
});

test('historical duplicate URLs require financing citations, not a product-page link',()=>{
  const cards=[{financing:{evidence_refs:[{source_id:'finance'}]},research_sources:[{source_id:'finance',source_url:'https://www.example.com/round/?utm_source=x'},{source_id:'product',source_url:'https://example.com/product'}]}];
  const known=existingFundingSourceUrls(cards);assert.ok(known.has(historyUrlKey('https://example.com/round')));assert.ok(!known.has(historyUrlKey('https://example.com/product')));
});

test('history capture resumes privately and finalizes scoped sources separately from daily collection',async t=>{
  const base=fs.mkdtempSync(path.join(os.tmpdir(),'financing-history-'));t.after(()=>fs.rmSync(base,{recursive:true,force:true}));
  const root=path.join(base,'repo'),directory=path.join(base,'history'),backupRoot=path.join(base,'private');fs.mkdirSync(root);
  const input={processed:1,total:2,complete:false,items:[{id:'fixture',title:'AI financing',links:{original:'https://example.com/round'}}]};
  const options={root,directory,backupRoot,date:'2026-10-02',from:'2026-01-01',to:'2026-10-02',input};let captures=0;
  await assert.rejects(collectHistory({...options,directory:path.join(root,'agent-workflow/reports/financing/2026-10-02')}),/must_not_use_daily_directory/);
  const capture=async(lead,opts)=>{captures++;return captureOriginal(lead,{...opts,fetcher:response('2026-02-04')});};
  const first=await collectHistory({...options,capture});assert.equal(first.counts.accepted,1);assert.equal(first.accepted,false);
  const intakeFile=path.join(root,'01-SiteV2/content/11-databases/data-center-v4/intake-v1/2026-10-02.json');assert.equal(fs.existsSync(intakeFile),false);
  await assert.rejects(collectHistory({...options,capture,finalize:true}),/still_running/);
  const final=await collectHistory({...options,capture,finalize:true,input:{...input,processed:1,total:1,complete:true}});assert.equal(captures,1);assert.equal(final.accepted,true);
  const intake=read(intakeFile),policy=read(path.join(root,'01-SiteV2/content/11-databases/data-center-v4/2026-10-02/targeted-funding-authorization.json'));
  assert.equal(policy.source_refs.length,1);assert.equal(policy.source_refs[0],intake.source_artifacts[0].source_artifact_id);assert.ok(!JSON.stringify(intake).includes(body));
  const policyFile=path.join(root,'01-SiteV2/content/11-databases/data-center-v4/2026-10-02/targeted-funding-authorization.json');
  policy.round_identity_source_refs=[policy.source_refs[0]];
  policy.event_date_reviews={[policy.source_refs[0]]:{status:'accepted',reviewer:'fixture',date:'2026-02-04',source_ref:policy.source_refs[0],quote:body}};
  fs.writeFileSync(policyFile,JSON.stringify(policy));
  await collectHistory({...options,capture,finalize:true,input:{...input,processed:1,total:1,complete:true}});
  assert.deepEqual(read(policyFile).round_identity_source_refs,policy.round_identity_source_refs);
  assert.deepEqual(read(policyFile).event_date_reviews,policy.event_date_reviews);
  assert.equal(captures,1);
  assert.equal(fs.existsSync(path.join(root,'agent-workflow/reports/financing/2026-10-02/collection.json')),false);
});

test('historical capture rejects dates outside the approved range and refuses invalid ranges',async()=>{
  const lead={url:'https://example.com/round'},options={date:'2026-10-02',historicalRange:{from:'2026-01-01',to:'2026-10-02'}};
  for(const date of ['2025-12-31','2026-10-03'])assert.equal((await captureOriginal(lead,{...options,fetcher:response(date)})).reason,'outside_historical_range');
  assert.equal((await captureOriginal(lead,{...options,fetcher:response('')})).reason,'original_date_missing');
  for(const range of [{from:'2026-02-31',to:'2026-10-02'},{from:'2026-01-01',to:'2026-10-03'},{from:'2026-10-02',to:'2026-01-01'},{from:'',to:''}]){
    await assert.rejects(captureOriginal(lead,{...options,historicalRange:range,fetcher:()=>{throw Error('must_validate_before_fetch');}}),/invalid_historical_financing_range/);
  }
});
