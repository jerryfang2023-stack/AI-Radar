import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {PROFILE_FILE,atomicJson,canonicalUrl,digest,readJson,today} from './profile-collection.mjs';
import {ingestPrivateEvidenceRecords} from './private-evidence-backup.mjs';
import {resolvePrivateEvidenceBackupRoot} from '../private-evidence-backup-paths.mjs';

export function buildProfileBatch(repo){
  for(const script of ['build-public-entity-profile-coverage-v1.mjs','apply-public-entity-profiles-v1.mjs','assert-public-entity-profiles-v1.mjs','assert-investment-institutions-v1.mjs']){
    const result=spawnSync(process.execPath,[path.join(repo,'agent-workflow/tools',script)],{cwd:repo,encoding:'utf8',windowsHide:true,maxBuffer:16000000});
    if(result.error||result.status!==0)throw new Error(`Profile stage failed: ${script}\n${result.stderr||result.stdout||result.error}`);
  }
}

export function integrateProfileBatch(queue,{batchSize=30,flush=false,reviewer,build=buildProfileBatch,archive}={}){
  if(!Number.isInteger(batchSize)||batchSize<1||batchSize>50)throw new Error('Batch size must be 1..50');
  if(reviewer!==undefined&&(!String(reviewer).trim()||String(reviewer).length>120))throw new Error('Reviewer filter must be a non-empty name of at most 120 characters');
  const token=queue.lock('integrate');const planFile=path.join(queue.stateDir,'integration.json');
  try{
    let plan=fs.existsSync(planFile)?readJson(planFile):null;
    if(plan?.stage==='done')plan=null;
    if(plan&&reviewer&&(plan.reviewer||undefined)!==reviewer)throw new Error(`Unfinished integration belongs to reviewer ${plan.reviewer||'the unfiltered shared queue'}; resume it with the same reviewer scope`);
    if(!plan){
      const jobs=reviewer
        ?queue.db.prepare("SELECT * FROM jobs WHERE state='accepted' AND reviewer=? ORDER BY updated,key LIMIT ?").all(reviewer,batchSize)
        :queue.db.prepare("SELECT * FROM jobs WHERE state='accepted' ORDER BY updated,key LIMIT ?").all(batchSize);
      if(!jobs.length||(!flush&&jobs.length<batchSize))return {status:'waiting_for_batch',accepted:jobs.length,batchSize,...(reviewer?{reviewer}:{})};
      const source=queue.source();const problems=[];
      for(const job of jobs){const profile=JSON.parse(job.result);queue.checkCandidate(job,profile);
        if(digest(source[job.collection]?.[job.id])!==job.base_hash&&digest(source[job.collection]?.[job.id])!==digest(profile))problems.push(job.key);
      }
      if(problems.length)throw new Error(`Source changed after claim; re-review these IDs: ${problems.join(',')}`);
      const next=structuredClone(source);for(const job of jobs)next[job.collection][job.id]=JSON.parse(job.result);next.as_of=[source.as_of,...jobs.map(j=>JSON.parse(j.result).last_verified_at)].sort().at(-1);
      plan={id:`profiles-${today()}-${token.slice(0,8)}`,repo:queue.repo,reviewer:reviewer||null,stage:'prepared',jobs:jobs.map(j=>({key:j.key,id:j.id,collection:j.collection,result:j.result})),beforeHash:digest(source),afterHash:digest(next),startedAt:queue.clock(),before:source,next};
      atomicJson(planFile,plan);queue.event(null,'batch_prepared',{id:plan.id,count:jobs.length,reviewer:plan.reviewer});
    }
    if(plan.repo!==queue.repo)throw new Error('Resume integration in its original isolated checkout');
    if(plan.stage==='prepared'){
      const currentHash=digest(queue.source());if(currentHash!==plan.beforeHash&&currentHash!==plan.afterHash)throw new Error('Integration source changed; preserve the plan and review the diff');
      // Only the integrator writes the accepted private evidence catalog.
      const records=[];const seen=new Set();
      for(const job of plan.jobs)for(const source of JSON.parse(job.result).sources){const url=canonicalUrl(source.source_url),identity=digest([url,source.source_content_hash]);if(seen.has(identity))continue;seen.add(identity);const capture=queue.evidenceCapture(url,source.source_content_hash);if(!capture)throw new Error(`Accepted original missing: ${source.source_id}`);
        records.push({body:fs.readFileSync(queue.evidenceFile(source.source_content_hash),'utf8'),contentHash:source.source_content_hash,sourceUrl:url,collectedAt:new Date(capture.captured_at).toISOString(),dataDate:today(),snapshotRef:`profiles/${identity}.json`,metadata:{source_title:source.source_title,source_url:url,content_hash:source.source_content_hash}});
      }
      if(archive)archive(records);else ingestPrivateEvidenceRecords({root:queue.repo,backupRoot:resolvePrivateEvidenceBackupRoot(queue.repo),records});
      if(currentHash!==plan.afterHash)atomicJson(path.join(queue.repo,PROFILE_FILE),plan.next);
      plan.stage='building';atomicJson(planFile,plan);
    }
    if(digest(queue.source())!==plan.afterHash)throw new Error('Accepted batch changed during recovery; review source before rebuilding');
    const buildStarted=queue.clock();build(queue.repo);
    queue.transaction(()=>{for(const job of plan.jobs){queue.db.prepare("UPDATE jobs SET state='integrated',updated=? WHERE key=? AND state='accepted'").run(queue.clock(),job.key);queue.event(job.key,'integrated',{batch:plan.id});}
      queue.event(null,'batch_built',{id:plan.id,count:plan.jobs.length,milliseconds:queue.clock()-buildStarted});});
    plan.stage='done';plan.completedAt=queue.clock();atomicJson(planFile,plan);atomicJson(path.join(queue.stateDir,'batches',`${plan.id}.json`),{...plan,before:undefined,next:undefined});
    return {status:'integrated',batch:plan.id,count:plan.jobs.length,reviewer:plan.reviewer||undefined,publication:'awaiting_commit_and_publish'};
  }catch(error){queue.event(null,'integration_failed',{reason:error.message});throw error;}finally{queue.unlock('integrate',token);}
}
