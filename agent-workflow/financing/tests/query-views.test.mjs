import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {buildReadModel,QUERY_VIEWS} from '../read-model.mjs';
import {writeVaultIfChanged} from '../../tools/lib/incremental-vault-write.mjs';
test('query views reconcile events and investors, keep currencies separate and never sum lower bounds as exact',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'financing-query-'));
  try {
    const company={entity_id:'EN-A',name:'A'},subject={funding_insight_id:'FI-A',company};
    const events=[['USD',10,'exact'],['CNY',20,'exact'],['USD',100,'lower_bound'],['',null,'unparsed']].map(([currency,value,status],i)=>({funding_insight_id:`FI-${i}`,subject_card_id:'FI-A',company,financing:{announced_at:`2026-01-0${i+1}`,amount_normalized:{currency,value,status},investors:[{name:'Unknown',institution_id:null}]}}));
    const input=path.join(dir,'input.json');fs.writeFileSync(input,JSON.stringify({meta:{card_count:1,event_count:4},cards:[subject],event_cards:events}));
    const result=buildReadModel({root:fileURLToPath(new URL('../../../',import.meta.url)),input,output:dir,duckdb:process.env.DUCKDB_BIN || 'duckdb'});
    const query=sql=>JSON.parse(execFileSync(process.env.DUCKDB_BIN || 'duckdb',[path.join(dir,'releases',result.releaseId,'finance.duckdb'),'-readonly','-json','-c',sql],{encoding:'utf8'}));
    assert.deepEqual(result.views,Object.keys(QUERY_VIEWS));assert.equal(query('SELECT * FROM company_round_history').length,4);assert.equal(query('SELECT * FROM investment_relationships').length,4);
    const stats=query('SELECT * FROM market_sector_statistics');assert.equal(stats.reduce((n,r)=>n+r.event_count,0),4);
    assert.equal(stats.find(r=>r.currency==='USD'&&r.amount_status==='exact').exact_amount_total,10);assert.equal(stats.find(r=>r.currency==='CNY').exact_amount_total,20);assert.equal(stats.find(r=>r.amount_status==='lower_bound').exact_amount_total,null);assert.equal(stats.find(r=>r.currency==='').exact_amount_total,null);
    assert.equal(query('SELECT * FROM financing_query_quality')[0].unknown_numeric_amount_count,1);
  } finally {fs.rmSync(dir,{recursive:true,force:true});}
});
test('generated notes preserve original update date and mtime until semantic content changes',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'incremental-vault-')),file=path.join(dir,'note.md');
  try {const previous='---\nupdated: 2026-10-02\n---\nEvidence\n';fs.writeFileSync(file,previous);fs.utimesSync(file,100,100);assert.equal(writeVaultIfChanged(file,previous.replace('2026-10-02','2026-10-03')),false);assert.equal(fs.readFileSync(file,'utf8'),previous);assert.equal(fs.statSync(file).mtimeMs,100000);assert.equal(writeVaultIfChanged(file,previous.replace('Evidence','Changed evidence')),true);}finally{fs.rmSync(dir,{recursive:true,force:true});}
});
