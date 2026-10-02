import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

export const PROFILE_FILE='01-SiteV2/content/11-databases/public-entity-profiles-v1.json';
const normalize=value=>String(value||'').replace(/\s+/gu,' ').trim();
const stable=value=>Array.isArray(value)?value.map(stable):value&&typeof value==='object'?Object.fromEntries(Object.keys(value).sort().map(k=>[k,stable(value[k])])):value;
export const digest=value=>crypto.createHash('sha256').update(typeof value==='string'?value:JSON.stringify(stable(value??null))).digest('hex');
export const today=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
export function canonicalUrl(value){const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)throw new Error('Source must use public HTTPS');url.hash='';return url.href;}
export const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/u,''));
export function atomicJson(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=`${file}.${crypto.randomUUID()}.tmp`;fs.writeFileSync(tmp,JSON.stringify(value,null,2)+'\n');fs.renameSync(tmp,file);}

export class ProfileQueue {
  constructor(repo,stateDir,{clock=()=>Date.now()}={}){
    this.repo=fs.realpathSync(repo);fs.mkdirSync(stateDir,{recursive:true});this.stateDir=fs.realpathSync(stateDir);
    const relative=path.relative(this.repo,this.stateDir);
    if(!relative||(!relative.startsWith('..')&&!path.isAbsolute(relative)))throw new Error('Queue and original bodies must stay outside the public repository');
    for(let parent=this.stateDir; ; parent=path.dirname(parent)){
      if(fs.existsSync(path.join(parent,'.git')))throw new Error('Private queue cannot live in any Git checkout');
      if(path.dirname(parent)===parent)break;
    }
    this.clock=clock;this.db=new DatabaseSync(path.join(this.stateDir,'queue.sqlite'));
    this.db.exec(`PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS jobs (key TEXT PRIMARY KEY, id TEXT NOT NULL, collection TEXT NOT NULL, lane TEXT NOT NULL, payload TEXT NOT NULL, priority INTEGER NOT NULL, base_hash TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'pending', worker TEXT, token TEXT, lease_until INTEGER, attempts INTEGER NOT NULL DEFAULT 0, result TEXT, reviewer TEXT, error TEXT, updated INTEGER NOT NULL);
      CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY, at INTEGER NOT NULL, job_key TEXT, event TEXT NOT NULL, detail TEXT);
      CREATE TABLE IF NOT EXISTS captures (url TEXT PRIMARY KEY, content_hash TEXT, captured_at INTEGER, title TEXT, lease_until INTEGER, token TEXT);
      CREATE TABLE IF NOT EXISTS capture_versions (url TEXT NOT NULL, content_hash TEXT NOT NULL, captured_at INTEGER NOT NULL, title TEXT NOT NULL, PRIMARY KEY(url,content_hash));
      INSERT OR IGNORE INTO capture_versions SELECT url,content_hash,captured_at,title FROM captures WHERE content_hash IS NOT NULL AND captured_at IS NOT NULL AND title IS NOT NULL;
      CREATE TABLE IF NOT EXISTS locks (name TEXT PRIMARY KEY, token TEXT NOT NULL, lease_until INTEGER NOT NULL);`);
    const ajv=new Ajv({allErrors:true,strict:false});addFormats(ajv);this.validate=ajv.compile(readJson(path.join(this.repo,'agent-workflow/product/public-entity-profiles-v1.schema.json')));
  }
  close(){this.db.close();}
  transaction(fn){this.db.exec('BEGIN IMMEDIATE');try{const value=fn();this.db.exec('COMMIT');return value;}catch(e){this.db.exec('ROLLBACK');throw e;}}
  event(key,event,detail={}){this.db.prepare('INSERT INTO events(at,job_key,event,detail) VALUES(?,?,?,?)').run(this.clock(),key,event,JSON.stringify(detail));}
  source(){return readJson(path.join(this.repo,PROFILE_FILE));}
  seed(backlog){const source=this.source();return this.transaction(()=>{
    let added=0;
    const lanes=[['pending_investor_research','institutions','research'],['pending_people_research','people','research'],['pending_identity_verification','institutions','identity']];
    for(const [field,collection,lane] of lanes)for(const row of backlog[field]||[]){
      const current=source[collection]?.[row.id];if(current?.coverage_status==='researched')continue;
      const key=`${collection}:${row.id}`;const priority=lane==='research'?1000+(row.website?100:0)+Math.min(row.activity_count||0,500):0;
      const result=this.db.prepare(`INSERT INTO jobs(key,id,collection,lane,payload,priority,base_hash,updated) VALUES(?,?,?,?,?,?,?,?) ON CONFLICT(key) DO UPDATE SET payload=excluded.payload,priority=excluded.priority,base_hash=excluded.base_hash,updated=excluded.updated WHERE jobs.state='pending'`).run(key,row.id,collection,lane,JSON.stringify(row),priority,digest(current),this.clock());added+=Number(result.changes);
    }
    for(const row of this.db.prepare("SELECT key,id,collection FROM jobs WHERE state IN ('pending','retry','leased','blocked')").all()){
      const profile=source[row.collection]?.[row.id];
      if(profile?.coverage_status==='researched')this.db.prepare("UPDATE jobs SET state='integrated',result=?,token=NULL,worker=NULL,lease_until=NULL,updated=? WHERE key=?").run(JSON.stringify(profile),this.clock(),row.key);
    }
    this.event(null,'seed',{rows:added});return this.status();
  });}
  claim(worker,{limit=10,leaseMs=900000,lane='research'}={}){
    if(!worker||!Number.isInteger(limit)||limit<1||limit>30||leaseMs<1000||leaseMs>3600000||!['research','identity','all'].includes(lane))throw new Error('Invalid claim options');
    return this.transaction(()=>{
      this.db.prepare("UPDATE jobs SET state='retry',error='lease_expired',worker=NULL,token=NULL,lease_until=NULL WHERE state='leased' AND lease_until<=?").run(this.clock());
      this.db.prepare("UPDATE jobs SET state='blocked',error='retry_limit_reached',updated=? WHERE state='retry' AND attempts>=3").run(this.clock());
      const rows=this.db.prepare("SELECT * FROM jobs WHERE state IN ('pending','retry') AND (?='all' OR lane=?) ORDER BY priority DESC,key LIMIT ?").all(lane,lane,limit);
      for(const row of rows){row.token=crypto.randomUUID();row.worker=worker;row.lease_until=this.clock()+leaseMs;row.attempts++;
        this.db.prepare("UPDATE jobs SET state='leased',worker=?,token=?,lease_until=?,attempts=?,updated=? WHERE key=?").run(worker,row.token,row.lease_until,row.attempts,this.clock(),row.key);this.event(row.key,'claim',{worker,attempt:row.attempts});}
      return rows.map(row=>({...row,payload:JSON.parse(row.payload),state:'leased'}));
    });
  }
  lease(key,token){const job=this.db.prepare('SELECT * FROM jobs WHERE key=?').get(key);if(!job||job.state!=='leased'||job.token!==token||job.lease_until<=this.clock())throw new Error('Claim expired or belongs to another worker');return job;}
  heartbeat(key,token){return this.transaction(()=>{this.lease(key,token);this.db.prepare('UPDATE jobs SET lease_until=?,updated=? WHERE key=?').run(this.clock()+900000,this.clock(),key);return {key,lease_until:this.clock()+900000};});}
  fail(key,token,reason,{retry=false}={}){if(!reason)throw new Error('Record the blocking reason');return this.transaction(()=>{this.lease(key,token);this.db.prepare('UPDATE jobs SET state=?,error=?,worker=NULL,token=NULL,lease_until=NULL,updated=? WHERE key=?').run(retry?'retry':'blocked',reason,this.clock(),key);this.event(key,retry?'retry':'blocked',{reason});});}
  retry(key){return this.transaction(()=>{const job=this.db.prepare("SELECT * FROM jobs WHERE key=? AND state='blocked'").get(key);if(!job)throw new Error('Only blocked jobs can be explicitly retried');const source=this.source();this.db.prepare("UPDATE jobs SET state='retry',error=NULL,result=NULL,reviewer=NULL,attempts=0,base_hash=?,updated=? WHERE key=?").run(digest(source[job.collection]?.[job.id]),this.clock(),key);this.event(key,'retry');});}
  evidenceFile(hash){if(!/^[a-f0-9]{64}$/u.test(hash))throw new Error('Invalid capture hash');return path.join(this.stateDir,'evidence',hash+'.txt');}
  remember(url,body,title,capturedAt=this.clock()){
    url=canonicalUrl(url);if(!String(body).trim())throw new Error('Empty capture');if(!title||!Number.isFinite(capturedAt)||capturedAt>this.clock())throw new Error('Invalid capture metadata');const contentHash=digest(body);const file=this.evidenceFile(contentHash);fs.mkdirSync(path.dirname(file),{recursive:true});
    try{fs.writeFileSync(file,body,{flag:'wx'});}catch(e){if(e.code!=='EEXIST')throw e;if(fs.readFileSync(file,'utf8')!==body)throw new Error('Capture hash collision');}
    this.transaction(()=>{
      this.db.prepare('INSERT INTO capture_versions(url,content_hash,captured_at,title) VALUES(?,?,?,?) ON CONFLICT(url,content_hash) DO UPDATE SET captured_at=max(captured_at,excluded.captured_at)').run(url,contentHash,capturedAt,title);
      this.db.prepare('INSERT INTO captures(url,content_hash,captured_at,title) VALUES(?,?,?,?) ON CONFLICT(url) DO UPDATE SET content_hash=excluded.content_hash,captured_at=excluded.captured_at,title=excluded.title,lease_until=NULL,token=NULL').run(url,contentHash,capturedAt,title);
      this.event(null,'captured',{url,contentHash});
    });return {url,contentHash,title,capturedAt,bodyRef:`evidence://${contentHash}`};
  }
  evidenceCapture(url,hash){const row=this.db.prepare('SELECT * FROM capture_versions WHERE url=? AND content_hash=?').get(canonicalUrl(url),hash);if(!row)return null;const file=this.evidenceFile(hash);return fs.existsSync(file)&&digest(fs.readFileSync(file,'utf8'))===hash?row:null;}
  cached(url,maxAgeMs=86400000){const row=this.db.prepare('SELECT * FROM captures WHERE url=?').get(canonicalUrl(url));if(!row?.content_hash||this.clock()-row.captured_at>maxAgeMs)return null;const file=this.evidenceFile(row.content_hash);if(!fs.existsSync(file)||digest(fs.readFileSync(file,'utf8'))!==row.content_hash)return null;return row;}
  async capture(url,{fetcher=fetch,maxAgeMs=86400000}={}){
    url=canonicalUrl(url);const started=this.clock();const token=crypto.randomUUID();
    for(let tries=0;tries<150;tries++){
      const cached=this.cached(url,maxAgeMs);if(cached){this.event(null,'cache_hit',{url});return cached;}
      const own=this.transaction(()=>{
        const row=this.db.prepare('SELECT * FROM captures WHERE url=?').get(url);if(row?.lease_until>this.clock())return false;
        this.db.prepare('INSERT INTO captures(url,token,lease_until) VALUES(?,?,?) ON CONFLICT(url) DO UPDATE SET token=excluded.token,lease_until=excluded.lease_until').run(url,token,this.clock()+60000);return true;
      });
      if(!own){await new Promise(resolve=>setTimeout(resolve,200));continue;}
      try{
        const response=await fetcher(url,{signal:AbortSignal.timeout(20000),redirect:'follow'});if(!response.ok)throw new Error(`Source HTTP ${response.status}`);
        if(response.url)canonicalUrl(response.url);const html=await response.text();if(html.length>4000000)throw new Error('Source exceeds capture limit');
        const body=html.replace(/<!--[\s\S]*?-->/gu,' ').replace(/<(script|style|svg|noscript|iframe)\b[\s\S]*?<\/\1>/giu,' ').replace(/<[^>]+>/gu,' ').replace(/&nbsp;/giu,' ').replace(/&amp;/giu,'&').replace(/&lt;/giu,'<').replace(/&gt;/giu,'>').replace(/&quot;/giu,'"').replace(/&#39;/gu,"'").replace(/&#(\d+);/gu,(_,n)=>String.fromCodePoint(Number(n))).replace(/\s+/gu,' ').trim();
        if(body.length<80)throw new Error('Insufficient original body; use a captured original file or browser');
        const title=normalize(html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1])||new URL(url).hostname;
        const result=this.remember(url,body,title);this.event(null,'capture_time',{milliseconds:this.clock()-started});return result;
      }catch(error){this.db.prepare('UPDATE captures SET token=NULL,lease_until=NULL WHERE url=? AND token=?').run(url,token);this.event(null,'capture_failed',{url,reason:error.message});throw error;}
    }
    throw new Error('Source capture already running; retry this URL only');
  }
  checkCandidate(job,profile,{requireFresh=false}={}){
    const data={schema_version:'PUBLIC-ENTITY-PROFILES-V1.0',as_of:profile.last_verified_at,institutions:{},people:{}};data[job.collection][job.id]=profile;
    if(!this.validate(data))throw new Error(JSON.stringify(this.validate.errors));
    if(!['researched','activity_only','self_declared_affiliation'].includes(profile.coverage_status)||profile.identity_status!=='verified'||!profile.summary?.trim())throw new Error('Candidate must have a verified identity and supported coverage status');
    if(job.collection==='institutions'&&(!['organization','person'].includes(profile.profile_type)||profile.identity_status!=='verified'))throw new Error('Investor identity and profile type must be explicit');
    const sources=new Map();
    for(const source of profile.sources){
      if(sources.has(source.source_id))throw new Error('Duplicate source ID');sources.set(source.source_id,source);
      const cached=this.evidenceCapture(source.source_url,source.source_content_hash);if(!cached||(requireFresh&&this.clock()-cached.captured_at>86400000))throw new Error(`Capture missing or expired: ${source.source_id}`);
      const body=fs.readFileSync(this.evidenceFile(cached.content_hash),'utf8');
      if(!normalize(body).includes(normalize(source.quote))||digest(normalize(source.quote))!==source.quote_hash)throw new Error(`Quote is not an exact captured span: ${source.source_id}`);
      const capturedDate=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(cached.captured_at));
      if(profile.last_verified_at>capturedDate||profile.last_verified_at>today())throw new Error('Verification date exceeds source capture');
    }
    for(const field of ['facts','milestones','track_record','contacts','current_roles','career','education'])for(const row of profile[field]||[]){if(!sources.has(row.source_id))throw new Error(`Missing field source: ${field}`);if(row.url&&!/^https:\/\//u.test(row.url))throw new Error('Contact URL must use HTTPS');}
    return true;
  }
  complete(key,token,profile){const job=this.lease(key,token);this.checkCandidate(job,profile,{requireFresh:true});return this.transaction(()=>{this.lease(key,token);this.db.prepare("UPDATE jobs SET state='candidate',result=?,token=NULL,lease_until=NULL,updated=? WHERE key=?").run(JSON.stringify(profile),this.clock(),key);const claim=this.db.prepare("SELECT at FROM events WHERE job_key=? AND event='claim' ORDER BY seq DESC LIMIT 1").get(key);this.event(key,'candidate',{worker:job.worker,milliseconds:claim?this.clock()-claim.at:null});});}
  reopen(key,reason){if(!reason)throw new Error('Record why re-review is needed');return this.transaction(()=>{
    const planFile=path.join(this.stateDir,'integration.json');const plan=fs.existsSync(planFile)?readJson(planFile):null;
    if(plan&&plan.stage!=='done'&&plan.jobs.some(job=>job.key===key))throw new Error('Resume the existing integration before reopening its candidates');
    const job=this.db.prepare("SELECT * FROM jobs WHERE key=? AND state IN ('candidate','accepted')").get(key);if(!job)throw new Error('Only a candidate or accepted profile can be reopened');
    this.db.prepare("UPDATE jobs SET state='candidate',reviewer=NULL,base_hash=?,updated=? WHERE key=?").run(digest(this.source()[job.collection]?.[job.id]),this.clock(),key);this.event(key,'reopened',{reason});return {key,status:'candidate',profile:JSON.parse(job.result)};
  });}
  approve(key,reviewer){if(!reviewer)throw new Error('Responsible reviewer required');return this.transaction(()=>{const row=this.db.prepare("SELECT * FROM jobs WHERE key=? AND state='candidate'").get(key);if(!row)throw new Error('No candidate to review');this.checkCandidate(row,JSON.parse(row.result));this.db.prepare("UPDATE jobs SET state='accepted',reviewer=?,updated=? WHERE key=?").run(reviewer,this.clock(),key);this.event(key,'accepted',{reviewer});});}
  lock(name,ttl=1800000){return this.transaction(()=>{const previous=this.db.prepare('SELECT * FROM locks WHERE name=?').get(name);if(previous?.lease_until>this.clock())throw new Error(`Stage already running: ${name}`);const token=crypto.randomUUID();this.db.prepare('INSERT INTO locks(name,token,lease_until) VALUES(?,?,?) ON CONFLICT(name) DO UPDATE SET token=excluded.token,lease_until=excluded.lease_until').run(name,token,this.clock()+ttl);return token;});}
  unlock(name,token){this.db.prepare('DELETE FROM locks WHERE name=? AND token=?').run(name,token);}
  status(){const counts=Object.fromEntries(this.db.prepare('SELECT state,count(*) AS count FROM jobs GROUP BY state').all().map(r=>[r.state,r.count]));const lanes=this.db.prepare('SELECT lane,state,count(*) AS count FROM jobs GROUP BY lane,state').all();const hours=this.db.prepare("SELECT strftime('%Y-%m-%dT%H:00:00',at/1000,'unixepoch','+8 hours') AS hour,event,count(*) AS count,sum(json_extract(detail,'$.milliseconds')) AS milliseconds FROM events GROUP BY hour,event ORDER BY hour DESC LIMIT 80").all();const completed=this.db.prepare("SELECT collection,COALESCE(json_extract(result,'$.profile_type'),'person') AS profile_type,state,count(*) AS count FROM jobs WHERE state IN ('candidate','accepted','integrated') GROUP BY collection,profile_type,state").all();return {counts,lanes,completed,hours,cacheHits:this.db.prepare("SELECT count(*) AS count FROM events WHERE event='cache_hit'").get().count,blocked:this.db.prepare("SELECT key,error,attempts FROM jobs WHERE state='blocked'").all()};}
}

export async function captureBatch(queue,urls,{concurrency=6,perHost=2,fetcher=fetch}={}){
  if(!Number.isInteger(concurrency)||concurrency<1||concurrency>8||!Number.isInteger(perHost)||perHost<1||perHost>2)throw new Error('Capture concurrency must be 1..8, per-host 1..2');
  const waiting=[...new Set(urls.map(canonicalUrl))];const results=[];const active=new Map();const promises=new Set();
  while(waiting.length||promises.size){
    while(promises.size<concurrency){const i=waiting.findIndex(url=>(active.get(new URL(url).hostname)||0)<perHost);if(i<0)break;const url=waiting.splice(i,1)[0],host=new URL(url).hostname;active.set(host,(active.get(host)||0)+1);
      const promise=queue.capture(url,{fetcher}).then(value=>results.push({url,ok:true,...value}),error=>results.push({url,ok:false,error:error.message})).finally(()=>{active.set(host,active.get(host)-1);promises.delete(promise);});promises.add(promise);
    }
    if(promises.size)await Promise.race(promises);
  }
  return results;
}
