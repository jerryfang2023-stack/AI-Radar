import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {researchDeferral,validResearchDeferral} from '../research-deferral.mjs';
import {githubRead} from '../github-read.mjs';
import {finishVerification} from '../verify.mjs';
import {write,read} from '../state.mjs';
import {deepSeekJsonCompletion} from '../../tools/deepseek-translation-client.mjs';
import {generateSourceTitleTranslation} from '../../tools/source-title-translation-generator.mjs';

const event={event_id:'EV-a',event_type:'funding',publication_status:'verified',source_refs:['SA-a']};
const raw={raw_id:'RAW-a',source_artifact_id:'SA-a',source_url:'https://example.com/funding',content_hash:'a'.repeat(64),title_original:'Acme AI raises funding'};
const bundle={rawDocuments:[raw],claims:[{raw_id:'RAW-a',claim_id:'CL-a',source_quote:'Acme raises one million.'}]};
const blocked={event_id:'EV-a',status:'blocked',problems:['research_independent_sources_insufficient']};

test('interrupted cloud extraction preserves completed candidates and resumes only the missing job',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'cloud-model-checkpoint-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const date='2026-10-15',base=path.join(root,'01-SiteV2/content/11-databases/data-center-v4',date);
  const quote='Acme develops artificial intelligence software for enterprises.';
  write(path.join(base,'raw-documents.json'),[{raw_id:'RAW-1',source_artifact_id:'SA-1',body_clean:quote.repeat(10),title_original:'Acme AI software',extraction_status:'accepted'}]);
  write(path.join(base,'entities.json'),['a','b'].map(id=>({entity_id:'EN-'+id,canonical_name:'Acme '+id,entity_type:'organization',verification_status:'candidate'})));
  write(path.join(base,'entity-mentions.json'),['a','b'].map(id=>({entity_id:'EN-'+id,raw_id:'RAW-1'})));
  const preload=path.join(root,'provider.mjs');
  fs.writeFileSync(preload,`import fs from 'node:fs';let calls=0;globalThis.fetch=async(url,options)=>{calls++;if(process.env.INTERRUPT==='true'&&calls===2)process.exit(79);fs.appendFileSync('requests.txt',JSON.parse(options.body).messages[0].content+'\\n');return {ok:true,json:async()=>({choices:[{message:{content:JSON.stringify({decision:'unknown',canonical_name:'',rationale:'requires responsible identity review',quote:${JSON.stringify(quote)}})}}]})};};`);
  const script=fileURLToPath(new URL('../../tools/generate-data-center-model-assist.mjs',import.meta.url));
  const args=['--import',pathToFileURL(preload).href,script,`--date=${date}`,'--tasks=entity_resolution','--write=true','--reuse-existing=true','--concurrency=1'];
  const env={...process.env,DEEPSEEK_API_KEY:'fixture-key',MODEL_ASSIST_MODEL:'fixture-deepseek',GUANLAN_EVIDENCE_BACKUP_ROOT:path.join(root,'private')};
  delete env.MODEL_ASSIST_SOURCE_REFS_FILE;delete env.MODEL_ASSIST_PROVIDER;
  const interrupted=spawnSync(process.execPath,args,{cwd:root,env:{...env,INTERRUPT:'true'},encoding:'utf8'});
  assert.equal(interrupted.status,79,interrupted.stderr);
  const output=path.join(root,'01-SiteV2/content/11-databases/model-assist-v1',date+'.json');
  assert.equal(read(output).candidates.length,1);
  fs.writeFileSync(path.join(root,'requests.txt'),'');
  const resumed=spawnSync(process.execPath,args,{cwd:root,env,encoding:'utf8'});
  assert.equal(resumed.status,0,resumed.stderr);
  assert.equal(read(output).candidates.length,2);
  const requests=fs.readFileSync(path.join(root,'requests.txt'),'utf8');
  assert.match(requests,/EN-b/u);assert.doesNotMatch(requests,/EN-a/u);
});

test('only new cardless evidence shortages can be deferred with current source and fact binding',()=>{
  const row={...blocked,deferral:researchDeferral(event,bundle,blocked)};
  assert.equal(validResearchDeferral(event,bundle,row),true);
  assert.equal(row.deferral.fact_approval,false);
  assert.equal(validResearchDeferral({...event,event_time:'changed'},bundle,row),false);
  assert.equal(validResearchDeferral(event,{...bundle,claims:[{raw_id:'RAW-a',source_quote:'changed'}]},row),false);
  assert.equal(validResearchDeferral(event,{...bundle,rawDocuments:[{...raw,content_hash:'b'.repeat(64)}]},row),false);
  for(const problems of [['amount_conflict'],['subject_company_unresolved'],['research_sources_insufficient','unknown_error'],[]])
    assert.equal(researchDeferral(event,bundle,{...blocked,problems}),null);
  assert.equal(researchDeferral(event,bundle,blocked,[{triggered_by_event_id:event.event_id}]),null);
  assert.equal(researchDeferral(event,{...bundle,rawDocuments:[]},blocked),null);
});

test('deferred discovery originals enter the private queue and remain pending on replay',t=>{
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'research-deferral-'));
  t.after(()=>fs.rmSync(tmp,{recursive:true,force:true}));
  const root=path.join(tmp,'repo'),directory=path.join(root,'reports'),backupRoot=path.join(tmp,'private'),date='2026-10-15';
  const fact=path.join(root,'01-SiteV2/content/11-databases/data-center-v4',date);
  write(path.join(fact,'raw-documents.json'),bundle.rawDocuments);
  write(path.join(fact,'canonical-events.json'),[event]);
  write(path.join(fact,'claims.json'),bundle.claims);
  write(path.join(fact,'event-sources.json'),[{event_id:event.event_id,source_artifact_id:'SA-a'}]);
  write(path.join(directory,'verification.json'),{prepared:true,date,entries:{}});
  write(path.join(directory,'collection.json'),{accepted:true,date,captures:{[raw.source_url]:{status:'accepted',content_hash:raw.content_hash}}});
  write(path.join(root,'01-SiteV2/content/12-applications/funding-insights',date+'.json'),{cards:[],queue:[{...blocked,deferral:researchDeferral(event,bundle,blocked)}]});
  const unrelated={status:'needs_attention',reason:'responsible_hold',rounds:2};
  const queueFile=path.join(backupRoot,'financing-monitor-state/verification-queue.json');
  write(queueFile,{entries:{'https://example.com/other':unrelated}});
  const result=finishVerification({root,directory,backupRoot,date});
  assert.equal(result.counts.pending,1);
  assert.equal(result.counts.verified,0);
  const queued=read(queueFile).entries[raw.source_url];
  assert.equal(queued.status,'pending');
  assert.equal(queued.next_due_date,'2026-10-16');
  assert.equal(queued.content_hash,raw.content_hash);
  finishVerification({root,directory,backupRoot,date});
  assert.equal(read(queueFile).entries[raw.source_url].rounds,queued.rounds);
  assert.deepEqual(read(queueFile).entries['https://example.com/other'],unrelated);
  const newer={status:'needs_attention',content_hash:'b'.repeat(64),reason:'newer_responsible_review',rounds:2};
  write(queueFile,{entries:{[raw.source_url]:newer}});
  write(path.join(directory,'verification.json'),{prepared:true,date,entries:{}});
  finishVerification({root,directory,backupRoot,date});
  assert.deepEqual(read(queueFile).entries[raw.source_url],newer);
});

test('GitHub reads retry transient failures only and reject write operations',()=>{
  let calls=0;const pauses=[];
  const result=githubRead(['api','repos/owner/repo'],{pause:ms=>pauses.push(ms),execute:()=>++calls<3?{status:1,stderr:'gh: API rate limit exceeded (HTTP 403)'}:{status:0,stdout:'{}'}});
  assert.equal(result.attempts,3);assert.equal(pauses.length,2);
  for(const status of [401,403,404]) {
    let count=0;
    const denied=githubRead(['pr','view','1'],{execute:()=>{count++;return {status:1,stderr:`gh: denied (HTTP ${status})`};}});
    assert.equal(count,1);assert.equal(denied.failure.reason,`http_${status}`);
  }
  for(const args of [['api','repos/owner/repo','--method=POST'],['pr','merge','1'],['workflow','run','daily']])
    assert.throws(()=>githubRead(args),/readonly/);
});

test('JSON model timeout retries the same job; title failures expose transport reasons',async t=>{
  const key=process.env.DEEPSEEK_API_KEY,originalFetch=globalThis.fetch;
  t.after(()=>{globalThis.fetch=originalFetch;if(key===undefined)delete process.env.DEEPSEEK_API_KEY;else process.env.DEEPSEEK_API_KEY=key;});
  process.env.DEEPSEEK_API_KEY='fixture-key';
  let calls=0;
  const result=await deepSeekJsonCompletion({fetchImpl:async()=>{if(++calls===1)throw new DOMException('timed out','TimeoutError');return {ok:true,json:async()=>({choices:[{message:{content:'{"claims":[]}'}}]})};}});
  assert.equal(result.attempts,2);assert.equal(calls,2);
  let titleCalls=0;
  globalThis.fetch=async()=>{titleCalls++;return {ok:false,status:401};};
  const title=await generateSourceTitleTranslation('Acme raises $5 million in funding',{provider:'deepseek'});
  assert.equal(title.status,'needs_ingestion_translation');
  assert.equal(title.failures[0].reason,'deepseek_http_401');
  assert.equal(titleCalls,1);
});
