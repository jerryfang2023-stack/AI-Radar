import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {spawn,spawnSync} from 'node:child_process';
import {DatabaseSync} from 'node:sqlite';
import {fileURLToPath} from 'node:url';
import {ProfileQueue,PROFILE_FILE,digest,atomicJson,captureBatch,today} from '../lib/profile-collection.mjs';
import {integrateProfileBatch} from '../lib/profile-batch-integration.mjs';

const root=fileURLToPath(new URL('../../../',import.meta.url));
function fixture(t,count=3){
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'profile-queue-')),repo=path.join(dir,'repo'),state=path.join(dir,'private');
 fs.mkdirSync(path.join(repo,'agent-workflow/product'),{recursive:true});fs.copyFileSync(path.join(root,'agent-workflow/product/public-entity-profiles-v1.schema.json'),path.join(repo,'agent-workflow/product/public-entity-profiles-v1.schema.json'));
 atomicJson(path.join(repo,PROFILE_FILE),{schema_version:'PUBLIC-ENTITY-PROFILES-V1.0',as_of:today(),institutions:{},people:{}});
 let now=Date.now();const queue=new ProfileQueue(repo,state,{clock:()=>now});
 queue.seed({pending_investor_research:Array.from({length:count},(_,i)=>({id:`INV-${i.toString(16).padStart(14,'0')}`,name:`Fund ${i}`,website:'https://fund.example',activity_count:i}))});
 t.after(()=>{queue.close();fs.rmSync(dir,{recursive:true,force:true});});return {repo,state,queue,advance:ms=>{now+=ms;},now:()=>now};
}
function profile(q,job){const url=`https://fund.example/${job.id}`,body='Official fund invests in early stage technology companies. '+job.id;const capture=q.remember(url,body,'Official');return {profile_type:'organization',identity_status:'verified',coverage_status:'researched',summary:'Official fund invests in technology.',facts:[{field:'focus',label:'Focus',value:'early stage technology',source_id:'official'}],milestones:[],track_record:[],contacts:[],last_verified_at:today(),sources:[{source_id:'official',source_url:url,source_title:'Official',source_content_hash:capture.contentHash,quote:body,quote_hash:digest(body)}]};}
function accept(q,job){q.complete(job.key,job.token,profile(q,job));q.approve(job.key,'responsible-editor');}

test('separate processes atomically claim disjoint jobs from one queue',async t=>{
 const f=fixture(t,8),module=fileURLToPath(new URL('../lib/profile-collection.mjs',import.meta.url));
 const run=worker=>new Promise((resolve,reject)=>{const code=`import {ProfileQueue} from ${JSON.stringify('file:///'+module.replaceAll('\\','/'))};const q=new ProfileQueue(${JSON.stringify(f.repo)},${JSON.stringify(f.state)});console.log(JSON.stringify(q.claim(${JSON.stringify(worker)},{limit:4}).map(x=>x.key)));q.close();`;const child=spawn(process.execPath,['--input-type=module','-e',code],{windowsHide:true});let out='',err='';child.stdout.on('data',x=>out+=x);child.stderr.on('data',x=>err+=x);child.on('error',reject);child.on('exit',status=>status===0?resolve(JSON.parse(out)):reject(new Error(err)));});
 const [a,b]=await Promise.all([run('one'),run('two')]);assert.equal(a.length,4);assert.equal(b.length,4);assert.equal(new Set([...a,...b]).size,8);
});
test('expired claims reject late writes, heartbeat retains claims, retries stop after three attempts',t=>{
 const {queue:q,advance}=fixture(t,1);const a=q.claim('one',{leaseMs:1000})[0];advance(1001);const b=q.claim('two',{leaseMs:10000})[0];assert.notEqual(a.token,b.token);assert.throws(()=>q.fail(a.key,a.token,'late'),/expired/);q.heartbeat(b.key,b.token);advance(1500);assert.equal(q.claim('three').length,0);q.fail(b.key,b.token,'timeout',{retry:true});const c=q.claim('three')[0];q.fail(c.key,c.token,'timeout',{retry:true});assert.equal(q.claim('four').length,0);assert.equal(q.status().blocked[0].error,'retry_limit_reached');q.retry(c.key);assert.equal(q.claim('five').length,1);
});
test('heartbeat watcher renews live claims for their configured lease and ignores stale or completed claims',t=>{
 const {queue:q,advance,now}=fixture(t,1),job=q.claim('one',{leaseMs:60000})[0];advance(30000);
 const renewed=q.heartbeatClaims([job,{key:job.key,token:'old-token'},{key:'institutions:missing',token:'token'}]);
 assert.equal(renewed[0].status,'renewed');assert.equal(renewed[0].lease_until-now(),60000);
 assert.equal(renewed[1].status,'inactive');assert.equal(renewed[2].status,'inactive');
 q.complete(job.key,job.token,profile(q,job));assert.equal(q.heartbeatClaims([job])[0].status,'inactive');
});
test('watch command renews claims from the shared private claim file',t=>{
 const {queue:q,repo,state}=fixture(t,1),job=q.claim('one')[0],claimFile=path.join(state,'worker-one.json');atomicJson(claimFile,[job]);
 const command=path.join(root,'agent-workflow/tools/manage-profile-collection.mjs');
 const run=spawnSync(process.execPath,[command,'watch',`--repo=${repo}`,`--state-dir=${state}`,`--input=${claimFile}`,'--once=true'],{encoding:'utf8',windowsHide:true});
 assert.equal(run.status,0,run.stderr);assert.match(run.stdout,/"status": "renewed"/);
});
test('existing shared queue databases gain the lease duration column on open',t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'profile-queue-migration-')),repo=path.join(dir,'repo'),state=path.join(dir,'private');
 let q;t.after(()=>{q?.close();fs.rmSync(dir,{recursive:true,force:true});});
 fs.mkdirSync(path.join(repo,'agent-workflow/product'),{recursive:true});fs.copyFileSync(path.join(root,'agent-workflow/product/public-entity-profiles-v1.schema.json'),path.join(repo,'agent-workflow/product/public-entity-profiles-v1.schema.json'));atomicJson(path.join(repo,PROFILE_FILE),{schema_version:'PUBLIC-ENTITY-PROFILES-V1.0',as_of:today(),institutions:{},people:{}});fs.mkdirSync(state,{recursive:true});
 const oldDb=new DatabaseSync(path.join(state,'queue.sqlite'));oldDb.exec("CREATE TABLE jobs (key TEXT PRIMARY KEY,id TEXT NOT NULL,collection TEXT NOT NULL,lane TEXT NOT NULL,payload TEXT NOT NULL,priority INTEGER NOT NULL,base_hash TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',worker TEXT,token TEXT,lease_until INTEGER,attempts INTEGER NOT NULL DEFAULT 0,result TEXT,reviewer TEXT,error TEXT,updated INTEGER NOT NULL)");oldDb.close();
 q=new ProfileQueue(repo,state);assert.ok(q.db.prepare('PRAGMA table_info(jobs)').all().some(row=>row.name==='lease_ms'));q.close();q=null;
});
test('two windows can open and migrate the same legacy queue concurrently',async t=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'profile-queue-concurrent-migration-')),repo=path.join(dir,'repo'),state=path.join(dir,'private');
 t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));
 fs.mkdirSync(path.join(repo,'agent-workflow/product'),{recursive:true});fs.copyFileSync(path.join(root,'agent-workflow/product/public-entity-profiles-v1.schema.json'),path.join(repo,'agent-workflow/product/public-entity-profiles-v1.schema.json'));atomicJson(path.join(repo,PROFILE_FILE),{schema_version:'PUBLIC-ENTITY-PROFILES-V1.0',as_of:today(),institutions:{},people:{}});fs.mkdirSync(state,{recursive:true});
 const oldDb=new DatabaseSync(path.join(state,'queue.sqlite'));oldDb.exec("CREATE TABLE jobs (key TEXT PRIMARY KEY,id TEXT NOT NULL,collection TEXT NOT NULL,lane TEXT NOT NULL,payload TEXT NOT NULL,priority INTEGER NOT NULL,base_hash TEXT NOT NULL,state TEXT NOT NULL DEFAULT 'pending',worker TEXT,token TEXT,lease_until INTEGER,attempts INTEGER NOT NULL DEFAULT 0,result TEXT,reviewer TEXT,error TEXT,updated INTEGER NOT NULL)");oldDb.close();
 const module=new URL('../lib/profile-collection.mjs',import.meta.url).href,code=`import {ProfileQueue} from ${JSON.stringify(module)};const q=new ProfileQueue(${JSON.stringify(repo)},${JSON.stringify(state)});q.close();`;
 const open=()=>new Promise((resolve,reject)=>{const child=spawn(process.execPath,['--input-type=module','-e',code],{windowsHide:true});let stderr='';child.stderr.on('data',chunk=>stderr+=chunk);child.on('error',reject);child.on('exit',status=>status===0?resolve():reject(new Error(stderr||`exit ${status}`)));});
 await Promise.all([open(),open()]);const check=new ProfileQueue(repo,state);assert.ok(check.db.prepare('PRAGMA table_info(jobs)').all().some(row=>row.name==='lease_ms'));check.close();
});
test('candidate validation blocks invented quotes, missing sources, identity gaps and future verification',t=>{
 const {queue:q}=fixture(t);const job=q.claim('research')[0],p=profile(q,job);
 assert.throws(()=>q.complete(job.key,job.token,{...p,sources:[{...p.sources[0],quote:'invented',quote_hash:digest('invented')}]}),/exact/);
 assert.throws(()=>q.complete(job.key,job.token,{...p,facts:[{...p.facts[0],source_id:'absent'}]}),/Missing field source/);
  assert.throws(()=>q.complete(job.key,job.token,{...p,identity_status:'pending_verification'}),/verified identity/);
 assert.throws(()=>q.complete(job.key,job.token,{...p,last_verified_at:'2099-01-01'}),/Verification date/);
 q.complete(job.key,job.token,p);assert.equal(q.status().counts.candidate,1);assert.equal(q.status().counts.accepted,undefined);q.approve(job.key,'editor');assert.equal(q.status().counts.accepted,1);
});
test('capture reuses the accepted original, deduplicates URLs and bounds per-host concurrency',async t=>{
 const {queue:q}=fixture(t);let calls=0,active=0,max=0;const fetcher=async url=>{calls++;active++;max=Math.max(max,active);await new Promise(r=>setTimeout(r,15));active--;return {ok:true,url,text:async()=>'<title>Official fund</title><p>'+('Original company information. '.repeat(12))+'</p>'};};
 const urls=Array.from({length:6},(_,i)=>`https://fund.example/${i}`);
 const result=await captureBatch(q,[...urls,urls[0]],{concurrency:6,fetcher});assert.equal(result.length,6);assert.ok(result.every(x=>x.ok));assert.ok(max<=2);await captureBatch(q,urls,{fetcher});assert.equal(calls,6);assert.equal(q.status().cacheHits,6);
 const hash=q.cached(urls[0]).content_hash;fs.writeFileSync(q.evidenceFile(hash),'corrupted');assert.equal(q.cached(urls[0]),null);
});
test('two workers share a single in-flight capture and refetch only after expiry',async t=>{
 const {queue:q,repo,state,advance}=fixture(t);const other=new ProfileQueue(repo,state);let calls=0;
 const fetcher=async url=>{calls++;await new Promise(r=>setTimeout(r,30));return {ok:true,url,text:async()=>'<p>'+('Verified original body. '.repeat(12))+'</p>'};};
 try{await Promise.all([q.capture('https://fund.example/shared',{fetcher}),other.capture('https://fund.example/shared',{fetcher})]);assert.equal(calls,1);advance(86400001);await q.capture('https://fund.example/shared',{fetcher});assert.equal(calls,2);}finally{other.close();}
});
test('thirty accepted fragments produce one batch build and one archive write',t=>{
 const {queue:q}=fixture(t,30);for(const job of q.claim('research',{limit:30}))accept(q,job);let builds=0,archives=0;
 const result=integrateProfileBatch(q,{archive:records=>{archives++;assert.equal(records.length,30);},build:()=>builds++});assert.equal(result.count,30);assert.equal(builds,1);assert.equal(archives,1);assert.equal(q.status().counts.integrated,30);
});
test('integration writes private evidence to the shared backup root supplied by a worktree-aware caller',t=>{
 const {queue:q,repo}=fixture(t,1),job=q.claim('research')[0],backupRoot=path.join(path.dirname(repo),'shared-private-evidence');accept(q,job);
 const result=integrateProfileBatch(q,{batchSize:1,backupRoot,build:()=>{}});
 assert.equal(result.status,'integrated');assert.ok(fs.existsSync(path.join(backupRoot,'manifest.json')));assert.equal(q.status().counts.integrated,1);
});
test('batch threshold avoids rebuilds; a failed build resumes accepted data without recollection or repeat archiving',t=>{
 const {queue:q,repo}=fixture(t);for(const job of q.claim('research',{limit:3}))accept(q,job);
 let builds=0,archives=0;assert.equal(integrateProfileBatch(q,{batchSize:30,archive:()=>archives++,build:()=>builds++}).status,'waiting_for_batch');assert.equal(builds,0);
 assert.throws(()=>integrateProfileBatch(q,{batchSize:3,archive:()=>archives++,build:()=>{builds++;throw new Error('gate failed');}}),/gate failed/);
 const source=fs.readFileSync(path.join(repo,PROFILE_FILE),'utf8');assert.equal(q.status().counts.accepted,3);
 const result=integrateProfileBatch(q,{batchSize:3,archive:()=>archives++,build:()=>builds++});assert.equal(result.count,3);assert.equal(builds,2);assert.equal(archives,1);assert.equal(q.status().counts.integrated,3);assert.equal(fs.readFileSync(path.join(repo,PROFILE_FILE),'utf8'),source);
});
test('newer source content blocks integration and competing integrators cannot overwrite it',t=>{
 const {queue:q,repo}=fixture(t,1),job=q.claim('research')[0];accept(q,job);const source=q.source();source.institutions[job.id]={...profile(q,job),summary:'Updated by another window'};atomicJson(path.join(repo,PROFILE_FILE),source);
 assert.throws(()=>integrateProfileBatch(q,{batchSize:1,archive:()=>{},build:()=>{}}),/Source changed/);assert.equal(q.source().institutions[job.id].summary,'Updated by another window');
 const token=q.lock('integrate');assert.throws(()=>integrateProfileBatch(q,{batchSize:1}),/already running/);q.unlock('integrate',token);
});
test('queue rejects public repository storage and reseeding preserves accepted work',t=>{
 const {queue:q,repo}=fixture(t,1);assert.throws(()=>new ProfileQueue(repo,path.join(repo,'runtime')),/outside/);const job=q.claim('research')[0];accept(q,job);q.seed({pending_investor_research:[{id:job.id,name:'New label'}]});assert.equal(q.status().counts.accepted,1);assert.equal(q.db.prepare('SELECT result FROM jobs WHERE key=?').get(job.key).result,JSON.stringify(profile(q,job)));
});
test('status reconciles missing backlog rows and seed requeues integrated profiles that still need research',t=>{
 const {queue:q,repo}=fixture(t,1),id='INV-00000000000000',backlog={pending_investor_research:[{id,name:'Fund 0',website:'https://fund.example'}],pending_people_research:[{id:'PERSON-00000000000001',name:'Person'}]};
 const source=q.source();source.institutions[id]={coverage_status:'activity_only'};atomicJson(path.join(repo,PROFILE_FILE),source);
 q.db.prepare("UPDATE jobs SET state='integrated' WHERE key=?").run(`institutions:${id}`);
 const before=q.status(backlog).reconciliation;assert.equal(before.remainingBacklog,2);assert.equal(before.missingCount,1);assert.equal(before.incompleteIntegratedCount,1);
 const seeded=q.seed(backlog);assert.equal(seeded.counts.pending,2);assert.equal(seeded.reconciliation.missingCount,0);assert.equal(seeded.reconciliation.incompleteIntegratedCount,0);
});

test('accepted originals remain usable after cache expiry and a newer page capture',t=>{
 const {queue:q,advance}=fixture(t,1),job=q.claim('research')[0],p=profile(q,job);
 q.complete(job.key,job.token,p);advance(86400001);q.remember(p.sources[0].source_url,'New official source body. '.repeat(10),'Changed website');
 q.approve(job.key,'editor');let archived;
 integrateProfileBatch(q,{batchSize:1,archive:records=>archived=records,build:()=>{}});
 assert.equal(archived[0].contentHash,p.sources[0].source_content_hash);assert.ok(archived[0].body.includes(job.id));assert.equal(q.status().counts.integrated,1);
 fs.writeFileSync(q.evidenceFile(p.sources[0].source_content_hash),'corrupted');assert.throws(()=>q.checkCandidate(job,p),/missing/);
});

test('source conflicts require explicit re-review; in-progress batches cannot be reopened',t=>{
 const {queue:q,repo}=fixture(t,1),job=q.claim('research')[0];accept(q,job);
 const source=q.source();source.institutions[job.id]={...profile(q,job),summary:'Other window improvement'};atomicJson(path.join(repo,PROFILE_FILE),source);
 assert.throws(()=>integrateProfileBatch(q,{batchSize:1,archive:()=>{},build:()=>{}}),/Source changed/);
 q.reopen(job.key,'Reviewed the other window diff');assert.equal(q.status().counts.candidate,1);assert.equal(q.status().counts.accepted,undefined);
 q.approve(job.key,'editor');assert.throws(()=>integrateProfileBatch(q,{batchSize:1,archive:()=>{},build:()=>{throw new Error('gate');}}),/gate/);
 assert.throws(()=>q.reopen(job.key,'another attempt'),/existing integration/);
 integrateProfileBatch(q,{batchSize:1,archive:()=>{},build:()=>{}});assert.equal(q.status().counts.integrated,1);
});

test('externally completed work keeps its organization/person type in progress reports',t=>{
 const {queue:q,repo}=fixture(t,1),job=q.claim('research')[0],source=q.source();source.institutions[job.id]=profile(q,job);atomicJson(path.join(repo,PROFILE_FILE),source);
 q.seed({});assert.equal(q.status().completed[0].profile_type,'organization');assert.equal(q.status().completed[0].state,'integrated');
});
