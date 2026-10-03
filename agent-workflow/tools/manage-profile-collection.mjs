#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {ProfileQueue,captureBatch,readJson,today} from './lib/profile-collection.mjs';
import {integrateProfileBatch} from './lib/profile-batch-integration.mjs';
import {resolvePrivateEvidenceBackupRoot} from './private-evidence-backup-paths.mjs';

const args=new Map();const values=process.argv.slice(2);const command=values.shift()||'status';
for(let i=0;i<values.length;i++){if(!values[i].startsWith('--'))throw new Error('Use named arguments');const [key,...inline]=values[i].slice(2).split('=');args.set(key,inline.length?inline.join('='):values[i+1]&&!values[i+1].startsWith('--')?values[++i]:'true');}
const repo=path.resolve(args.get('repo')||fileURLToPath(new URL('../../',import.meta.url)));
const localConfig=path.join(repo,'.profile-collection.json');
const localState=fs.existsSync(localConfig)?readJson(localConfig).stateDir:'';
const common=spawnSync('git',['rev-parse','--path-format=absolute','--git-common-dir'],{cwd:repo,encoding:'utf8',windowsHide:true});
const primary=common.status===0?path.dirname(common.stdout.trim()):repo;
const primaryConfig=path.join(primary,'.profile-collection.json');
const sharedState=fs.existsSync(primaryConfig)?readJson(primaryConfig).stateDir:'';
const evidenceRoot=resolvePrivateEvidenceBackupRoot(fs.existsSync(path.join(repo,'.evidence-backup.json'))?repo:primary,{required:false});
const stateDir=args.get('state-dir')||process.env.GUANLAN_PROFILE_STATE_DIR||localState||sharedState||(evidenceRoot?path.join(evidenceRoot,'runtime/profile-collection'):'');
if(!stateDir)throw new Error('Set GUANLAN_PROFILE_STATE_DIR to one shared private runtime directory, or pass --state-dir');
const queue=new ProfileQueue(repo,path.resolve(stateDir));
const backlogFile=path.join(repo,'01-SiteV2/content/11-databases/public-entity-profile-backlog-v1.json');
const readBacklog=()=>readJson(backlogFile);
const need=key=>{const value=args.get(key);if(!value)throw new Error(`Missing --${key}`);return value;};
let result,alreadyPrinted=false;
try{
 switch(command){
  case 'seed':result=queue.seed(readBacklog());break;
  case 'status':result=queue.status(readBacklog());break;
  case 'claim':result=queue.claim(need('worker'),{limit:Number(args.get('limit')||10),lane:args.get('lane')||'research',leaseMs:Number(args.get('lease-ms')||900000)});break;
  case 'heartbeat':{if(args.has('input')){const claims=readJson(args.get('input'));if(!Array.isArray(claims))throw new Error('Heartbeat input must be the claim array');result=queue.heartbeatClaims(claims);}else result=queue.heartbeat(need('key'),need('token'));break;}
  case 'watch':{
    const claims=readJson(need('input'));if(!Array.isArray(claims))throw new Error('Watch input must be the claim array');
    let intervalMs=Number(args.get('interval-ms')||300000);if(!Number.isInteger(intervalMs)||intervalMs<100||intervalMs>3600000)throw new Error('Watch interval must be 100..3600000 ms');
    const shortestLease=Math.min(...claims.map(claim=>Number(claim?.lease_ms)||900000));if(claims.length&&intervalMs>Math.floor(shortestLease/3))throw new Error(`Watch interval must be at most one third of the active lease (${Math.floor(shortestLease/3)} ms)`);
    let active=claims,latest=[];const pulse=()=>{latest=queue.heartbeatClaims(active);active=active.filter((claim,index)=>latest[index]?.status==='renewed');return latest;};
    const initial=pulse();console.log(JSON.stringify({event:'heartbeat',at:new Date().toISOString(),claims:initial},null,2));alreadyPrinted=true;
    if(args.get('once')!=='true')while(active.length){
      const continueWatching=await new Promise(resolve=>{let done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop);resolve(value);};const stop=()=>finish(false);const timer=setTimeout(()=>finish(true),intervalMs);process.once('SIGINT',stop);process.once('SIGTERM',stop);});
      if(!continueWatching)break;
      const checked=pulse();console.log(JSON.stringify({event:'heartbeat',at:new Date().toISOString(),claims:checked},null,2));
    }
    result={status:active.length?'watching':'claims_inactive',renewed:latest.filter(item=>item.status==='renewed').length,intervalMs};break;
  }
  case 'fail':result=queue.fail(need('key'),need('token'),need('reason'),{retry:args.get('retry')==='true'})||{status:'recorded'};break;
  case 'retry':result=queue.retry(need('key'))||{status:'retry'};break;
  case 'capture':{const urls=readJson(need('input'));if(!Array.isArray(urls))throw new Error('Capture input is a JSON array of canonical URLs');result=await captureBatch(queue,urls,{concurrency:Number(args.get('concurrency')||6),perHost:2});break;}
  case 'import-capture':{const input=readJson(need('input'));const capturedAt=Date.parse(input.captured_at);if(!input.title||!Number.isFinite(capturedAt)||capturedAt>Date.now())throw new Error('Capture metadata requires title and the actual captured_at');result=queue.remember(input.url,fs.readFileSync(path.resolve(need('body')),'utf8'),input.title,capturedAt);break;}
  case 'complete':result=queue.complete(need('key'),need('token'),readJson(need('input')))||{status:'candidate'};break;
  case 'approve':result=queue.approve(need('key'),need('reviewer'))||{status:'accepted'};break;
  case 'reopen':result=queue.reopen(need('key'),need('reason'));break;
  case 'integrate':result=integrateProfileBatch(queue,{batchSize:Number(args.get('batch-size')||30),flush:args.get('flush')==='true',reviewer:args.get('reviewer')||undefined,backupRoot:evidenceRoot||undefined});break;
  case 'report':{result={date:today(),...queue.status(readBacklog())};break;}
  default:throw new Error('Commands: seed, claim, heartbeat, watch, capture, import-capture, complete, approve, reopen, fail, retry, integrate, status, report');
 }
 if(args.get('output')){const target=path.resolve(args.get('output'));const relative=path.relative(repo,target);if(!relative||(!relative.startsWith('..')&&!path.isAbsolute(relative)))throw new Error('Worker results and queue reports must stay outside the public repository');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,JSON.stringify(result,null,2)+'\n');}
 if(!alreadyPrinted)console.log(JSON.stringify(result,null,2));
}finally{queue.close();}
