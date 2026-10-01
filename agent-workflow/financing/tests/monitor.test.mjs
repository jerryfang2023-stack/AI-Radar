import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { config, discover, queryPlan, uniqueLeads } from '../discovery.mjs';
import { captureOriginal, parseOriginal } from '../capture.mjs';
import { collect } from '../collect.mjs';
import { runStages, read, acquireLock, write, digest } from '../state.mjs';
import { productionPlan } from '../run.mjs';
import { allowedCheckpointPath, restore } from '../checkpoint.mjs';
import { financingScope } from '../scope.mjs';

const date='2026-10-01';
test('all AI sectors allowed, robotics core business excluded, consumer companions preserved',()=>{
  for(const title of ['AI chip company raises Series A','AI drug discovery raises funding','AI enterprise software raises funding','AI toy startup raises $5M','AI companion robot startup raises $5M']) assert.equal(financingScope({title}).included,true,title);
  for(const title of ['Embodied AI startup raises $10M','Humanoid robot maker raises $1B','Robotics company raises $50M','具身智能企业完成融资','机器人核心部件企业获投']) assert.equal(financingScope({title}).included,false,title);
  assert.equal(financingScope({title:'AI cloud company raises $10M',body:'Its customers include humanoid robot companies.'}).included,true);
  assert.equal(financingScope({title:'Acme raises $10M',body:'Acme is a leading humanoid robot manufacturer using AI.'}).included,false);
});
const temporary=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'financing-test-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
const emptyFeed=async()=>({complete:true,items:[],discovered_count:0,pages:1,failures:[]});
test('every market has independent coverage for all six hardware categories and general AI financing',()=>{
  const plan=queryPlan(date);
  for(const market of config.markets){for(const category of config.hardware) assert.ok(plan.some(row=>row.id===`${market}:${category.id}`));assert.ok(plan.some(row=>row.id.startsWith(`${market}:general:`)));}
  assert.ok(plan.every(row=>/融资|funding|raises/iu.test(row.query)));
  assert.throws(()=>queryPlan('2026-02-31'),/invalid_date/u);
});
test('failed search differs from zero and only failed queries resume',async()=>{
  let calls=0;
  const first=await discover({date,feed:emptyFeed,search:async()=>{calls++;if(calls===3)throw new Error('offline');return[];}});
  assert.equal(first.complete,false);assert.equal(first.failed.length,1);
  let retried=0;
  const second=await discover({date,feed:()=>{throw new Error('must reuse feed');},previous:first.receipts,search:async()=>{retried++;return[];}});
  assert.equal(retried,1);assert.equal(second.complete,true);assert.equal(second.leads.length,0);
});
test('URL dedupe merges coverage; product launch and FDE deployment cannot enter financing intake',()=>{
  const leads=uniqueLeads([{url:'https://example.com/a?utm_source=x',title:'AI startup raises $10M',coverage:['overseas:general:0']},{url:'https://example.com/a',title:'AI startup raises $10M',coverage:['overseas:glasses']},{url:'https://example.com/b',title:'New AI glasses launch'},{url:'https://example.com/c',title:'FDE enterprise deployment customer case'}]);
  assert.equal(leads.length,1);assert.equal(leads[0].coverage.length,2);assert.equal(leads[0].evidence_role,'discovery_only');
});
const html=({date='2026-09-30',body='An AI company raises $20 million in Series A financing. '.repeat(12)}={})=>`<html><head><meta property="article:published_time" content="${date}"><meta property="og:title" content="AI startup raises Series A"></head><article>${body}</article></html>`;
test('original body and original date required; search date and descriptions cannot replace them',async()=>{
  const lead={url:'https://example.com/round',published_at:'2026-09-30',summary:'AI financing snippet'};
  const response=source=>async()=>new Response(source,{headers:{'content-type':'text/html; charset=utf-8'}});
  const good=await captureOriginal(lead,{date,fetcher:response(html())});assert.equal(good.status,'accepted');assert.equal(good.record.published_at,'2026-09-30');
  const missing=await captureOriginal(lead,{date,fetcher:response(html({date:''}))});assert.equal(missing.status,'pending');assert.equal(missing.reason,'original_date_missing');
  const stale=await captureOriginal(lead,{date,fetcher:response(html({date:'2025-01-01'}))});assert.equal(stale.status,'excluded');
  const parsed=parseOriginal('<script type="application/ld+json">'+JSON.stringify({'@type':'NewsArticle',description:'AI raises funding '.repeat(30)})+'</script>');assert.equal(parsed.body,'');
});
test('accepted collection stores body privately and downstream retry does not recollect',async t=>{
  const base=temporary(t),root=path.join(base,'repo'),backupRoot=path.join(base,'private'),directory=path.join(root,'reports');fs.mkdirSync(root);
  const gateway={search:async()=>[{url:'https://example.com/round',title:'AI startup raises Series A'}],status:()=>({}),attempts:[]};
  let captures=0;
  const capture=async lead=>{captures++;return captureOriginal(lead,{date,fetcher:async()=>new Response(html(),{headers:{'content-type':'text/html'}})});};
  const first=await collect({root,directory,backupRoot,date,gateway,feed:emptyFeed,capture});assert.equal(first.accepted,true);assert.equal(captures,1);
  const intake=read(path.join(root,`01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`));
  assert.match(intake.raw_documents[0].body_ref,/^evidence:\/\//u);assert.ok(!JSON.stringify(intake).includes('An AI company raises'));assert.ok(fs.existsSync(path.join(backupRoot,'catalog.jsonl')));
  await collect({root,directory,backupRoot,date,gateway:{search:()=>{throw new Error('recollection forbidden');}},feed:emptyFeed,capture:()=>{throw new Error('recapture forbidden');}});
  assert.equal(captures,1);
});
test('failed stages resume without replaying successful prerequisites and lock prevents duplicate execution',async t=>{
  const dir=temporary(t),file=path.join(dir,'state.json'),seen=[];
  const stages=['facts','research','publish'].map(id=>({id,commands:[id],valid:()=>true}));
  await assert.rejects(runStages({date,file,stages,codeVersion:'v1',execute:async stage=>{seen.push(stage.id);if(stage.id==='research')throw new Error('quota');}}));
  await runStages({date,file,stages,codeVersion:'v1',execute:async stage=>seen.push(stage.id)});
  assert.deepEqual(seen,['facts','research','research','publish']);
  stages[1].version='fixed-research';
  seen.length=0;
  await runStages({date,file,stages,codeVersion:'v1',execute:async stage=>seen.push(stage.id)});
  assert.deepEqual(seen,['research','publish']);
  const release=acquireLock(dir);assert.throws(()=>acquireLock(dir),/already_active/u);release();
});
test('new execution graph has no comprehensive-monitor, quota, opinion or historical refill dependencies',()=>{
  const commands=productionPlan(date,'runtime').flatMap(stage=>stage.commands).flat().join('\n');
  assert.doesNotMatch(commands,/run-guanlan|quality-gate|pool|follow-builders|community|opportunity|trend|backfill-china/u);
  assert.ok(productionPlan(date,'runtime').some(stage=>stage.id==='research'));
});
test('artifact restore cannot execute code or traverse paths',t=>{
  assert.equal(allowedCheckpointPath('../stolen.json',date),false);assert.equal(allowedCheckpointPath('agent-workflow/financing/run.mjs',date),false);
  assert.equal(allowedCheckpointPath('01-SiteV2/site/data/a.js',date),false);
  const dir=temporary(t);write(path.join(dir,'manifest.json'),{version:'FINANCING-CHECKPOINT-1',date,entries:[{file:'../escape.json',hash:'x'}]});
  assert.throws(()=>restore(dir,dir,date),/path_rejected/u);
});
test('restoring on a newer main preserves global data and invalidates dependent receipts',t=>{
  const root=temporary(t),artifact=temporary(t),global='01-SiteV2/site/data/funding-insights-v1.json';
  const receipt=`agent-workflow/reports/financing/${date}/stages.json`;
  write(path.join(root,global),{cards:['newer']});
  const rows=[[global,{cards:['older']}],[receipt,{stages:{projections:{ok:true}}}]];
  const entries=rows.map(([file,data])=>{write(path.join(artifact,'files',file),data);return{file,hash:digest(fs.readFileSync(path.join(artifact,'files',file),'utf8'))};});
  write(path.join(artifact,'manifest.json'),{version:'FINANCING-CHECKPOINT-1',date,base_commit:'old',entries});
  restore(root,artifact,date);
  assert.deepEqual(read(path.join(root,global)).cards,['newer']);
  assert.deepEqual(read(path.join(root,receipt)).stages,{});
});
