#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {read,write,digest} from './state.mjs';
import {allowedCheckpointPath} from './checkpoint.mjs';
import {loadPrivateEvidenceRecord} from '../tools/lib/private-evidence-store.mjs';

export function checkpointEvidenceHashes(root,directory,date) {
  const manifest=read(path.join(directory,'manifest.json'));
  if(manifest?.date!==date || !Array.isArray(manifest.entries))throw new Error('invalid_evidence_checkpoint');
  const hashes=new Set();
  for(const entry of manifest.entries) {
    if(!allowedCheckpointPath(entry.file,date))throw new Error('invalid_evidence_checkpoint_path');
    const body=fs.readFileSync(path.join(directory,'files',entry.file),'utf8');
    if(digest(body)!==entry.hash)throw new Error('checkpoint_hash_mismatch');
    for(const match of body.matchAll(/evidence:\/\/([a-f0-9]{64})/gu))hashes.add(match[1]);
    if(entry.file===`agent-workflow/reports/financing/${date}/collection.json`)for(const capture of Object.values(JSON.parse(body).captures || {}))
      if(capture.status==='accepted' && /^[a-f0-9]{64}$/u.test(capture.content_hash || ''))hashes.add(capture.content_hash);
  }
  return [...hashes];
}

export function recoverEvidence({root,backupRoot,directory,date,git}) {
  const hashes=checkpointEvidenceHashes(root,directory,date);
  const missing=hashes.filter(hash=>!loadPrivateEvidenceRecord(root,`evidence://${hash}`,hash,{backupRoot,required:false}));
  const sync=read(path.join(directory,'files',`agent-workflow/reports/financing/${date}/evidence-sync.json`));
  if(!missing.length && (!sync || sync.status==='confirmed'))return {status:'confirmed',hashes:hashes.length};
  if(sync?.date!==date || !/^[a-f0-9]{40}$/u.test(sync.commit || '') || !new RegExp(`^recovery/financing-${date}-[0-9]+-[0-9]+$`,'u').test(sync.recovery_ref || ''))
    throw new Error('checkpoint_private_evidence_unconfirmed');
  let alreadyMerged=false;
  try {git(['merge-base','--is-ancestor',sync.commit,'HEAD']);alreadyMerged=true;}catch {}
  if(!alreadyMerged) {
    git(['fetch','origin',sync.recovery_ref]);
    if(git(['rev-parse','FETCH_HEAD']).trim()!==sync.commit)throw new Error('private_recovery_commit_changed');
    try {git(['merge','--no-edit',sync.commit]);}
    catch {try {git(['merge','--abort']);}catch {} throw new Error('private_recovery_ledger_conflict_requires_review:'+sync.recovery_ref);}
  }
  // Merge complete private receipts as well as originals. Never replay requests
  // using an older ledger, or choose one side of a concurrent review conflict.
  for(const hash of hashes)if(!loadPrivateEvidenceRecord(root,`evidence://${hash}`,hash,{backupRoot,required:false}))throw new Error('private_evidence_restore_incomplete');
  return {status:'recovered_private_commit',source_commit:sync.commit};
}

export function persistEvidence({root,backupRoot,date,runId,attempt='1',execute=spawnSync,pause=ms=>Atomics.wait(new Int32Array(new SharedArrayBuffer(4)),0,0,ms)}) {
  if(!/^\d{4}-\d{2}-\d{2}$/u.test(date) || !/^[0-9]+$/u.test(runId) || !/^[0-9]+$/u.test(attempt))throw new Error('invalid_evidence_sync_identity');
  const call=args=>execute('git',['-C',backupRoot,...args],{encoding:'utf8',timeout:120000,maxBuffer:8*1024*1024});
  const required=args=>{const r=call(args);if(r.error || r.status!==0)throw new Error(`private_git_failed:${args[0]}`);return r.stdout.trim();};
  const file=path.join(root,`agent-workflow/reports/financing/${date}/evidence-sync.json`);
  const recovery_ref=`recovery/financing-${date}-${runId}-${attempt}`;
  let receipt={date,status:'unconfirmed',recovery_ref};write(file,receipt);
  required(['config','user.name','github-actions[bot]']);required(['config','user.email','41898282+github-actions[bot]@users.noreply.github.com']);
  required(['add','-A']);
  const diff=call(['diff','--cached','--quiet']);if(diff.status!==0 && diff.status!==1)throw new Error('private_diff_failed');
  if(diff.status===1)required(['commit','-m',`Financing evidence ${date}`]);
  receipt={...receipt,commit:required(['rev-parse','HEAD'])};write(file,receipt);
  for(let n=0;n<3;n++) {
    if(n)pause(n*2000);
    const pushed=call(['push','origin','HEAD:main']);
    if(!pushed.error && pushed.status===0){receipt={...receipt,status:'confirmed',commit:required(['rev-parse','HEAD'])};write(file,receipt);return receipt;}
    const fetched=call(['fetch','origin','main']);
    if(fetched.status===0) {
      const rebased=call(['rebase','origin/main']);
      if(rebased.status!==0){
        // A failed fetch/rebase may not have started a rebase. Abort when present,
        // then preserve the last committed receipts even if abort is unnecessary.
        call(['rebase','--abort']);break;
      }
    }
  }
  // A concurrent private queue edit must not erase completed originals. Keep
  // the immutable recovery commit in the same private repo, never public CI.
  receipt={...receipt,commit:required(['rev-parse','HEAD'])};write(file,receipt);
  const saved=call(['push','origin',`HEAD:refs/heads/${recovery_ref}`]);
  receipt={...receipt,status:!saved.error && saved.status===0?'recovery_branch':'unconfirmed'};write(file,receipt);
  return receipt;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const [mode,date,directory]=process.argv.slice(2),root=process.cwd(),backupRoot=process.env.GUANLAN_EVIDENCE_BACKUP_ROOT;
  if(!backupRoot)throw new Error('private_evidence_root_required');
  if(mode==='persist') {const result=persistEvidence({root,backupRoot,date,runId:process.env.GITHUB_RUN_ID,attempt:process.env.GITHUB_RUN_ATTEMPT || '1'});console.log(JSON.stringify(result));if(result.status!=='confirmed')process.exitCode=1;}
  else if(mode==='recover')console.log(JSON.stringify(recoverEvidence({root,backupRoot,directory:path.resolve(directory),date,git:args=>{
    const r=spawnSync('git',['-C',backupRoot,...args],{encoding:'utf8',timeout:120000,maxBuffer:64*1024*1024});if(r.error || r.status!==0)throw new Error(`private_recovery_git_failed:${args[0]}`);return r.stdout;
  }})));
  else throw new Error('invalid_evidence_sync_mode');
}
