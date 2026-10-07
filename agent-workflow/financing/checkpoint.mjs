#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { read, write, digest } from './state.mjs';
import { mergeSourceIntakes } from '../tools/lib/source-intake-v1.mjs';
import { publicIndexPath } from './evidence-index.mjs';

export function allowedCheckpointPath(file, date) {
  if (file.includes('\\') || file.split('/').includes('..') || path.isAbsolute(file)) return false;
  if (file === publicIndexPath) return true;
  return (/^01-SiteV2\/(?:content\/(?:11-databases|12-applications\/(?:funding-insights|financing-taxonomy))|site\/data)\/.*\.json$/u.test(file)
    || (file.startsWith(`agent-workflow/reports/financing/${date}/`) && /\.json$/u.test(file)))
    && !/\/(?:recheck-)?search-cache\/|\/aihot\//u.test(file);
}
export function snapshot(root, directory, date) {
  const result = spawnSync('git', ['status','--porcelain=v1','-z','--untracked-files=all'], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (result.status !== 0) throw new Error('checkpoint_git_status_failed');
  const files = result.stdout.split('\0').filter(Boolean).map(row => row.slice(3)).filter(file => allowedCheckpointPath(file, date) && fs.existsSync(path.join(root,file)));
  // Always include accepted intake/receipts, even when already committed.
  const intake = `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`;
  if (fs.existsSync(path.join(root,intake))) files.push(intake);
  const visit = dir => { if (!fs.existsSync(dir)) return; for (const entry of fs.readdirSync(dir,{ withFileTypes:true })) { const file = path.join(dir,entry.name); if(entry.isDirectory()) visit(file); else { const rel = path.relative(root,file).replaceAll('\\','/'); if(allowedCheckpointPath(rel,date)) files.push(rel); } } };
  visit(path.join(root,`agent-workflow/reports/financing/${date}`));
  const entries = [...new Set(files)].map(file => {
    const body = fs.readFileSync(path.join(root,file),'utf8');
    const destination = path.join(directory,'files',file); fs.mkdirSync(path.dirname(destination),{recursive:true}); fs.writeFileSync(destination,body);
    return { file, hash: digest(body) };
  });
  const head = spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'});
  if(head.status !== 0) throw new Error('checkpoint_base_commit_missing');
  write(path.join(directory,'manifest.json'), { version: 'FINANCING-CHECKPOINT-1', date, base_commit:head.stdout.trim(), entries });
  return entries;
}
export function restore(root, directory, date) {
  const manifest = read(path.join(directory,'manifest.json'));
  if (manifest?.version !== 'FINANCING-CHECKPOINT-1' || manifest.date !== date) throw new Error('invalid_checkpoint_identity');
  for (const entry of manifest.entries) {
    if (!allowedCheckpointPath(entry.file,date)) throw new Error('checkpoint_path_rejected');
    const body = fs.readFileSync(path.join(directory,'files',entry.file),'utf8');
    if (digest(body) !== entry.hash) throw new Error('checkpoint_hash_mismatch');
    if(entry.file === publicIndexPath) body.split(/\r?\n/u).filter(Boolean).forEach(line=>JSON.parse(line));
    else JSON.parse(body);
  }
  const head = spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'});
  const changedBase = manifest.base_commit && head.stdout?.trim() !== manifest.base_commit;
  const intakePath = `01-SiteV2/content/11-databases/data-center-v4/intake-v1/${date}.json`;
  const researchPath = `01-SiteV2/content/12-applications/funding-insights/${date}.json`;
  const modelPath = `01-SiteV2/content/11-databases/model-assist-v1/${date}.json`;
  const union = (older, newer, key) => [...new Map([...(older || []), ...(newer || [])].map(row => [row[key], row])).values()];
  for (const entry of manifest.entries) {
    // On a newer main, reuse only this run's inputs/results. Old global indexes
    // and registries must never overwrite financing accepted after the artifact.
    if(changedBase && !entry.file.startsWith(`agent-workflow/reports/financing/${date}/`)
      && ![intakePath, researchPath, modelPath].includes(entry.file)) continue;
    const file = path.join(root,entry.file), source = path.join(directory,'files',entry.file);
    // Accepted main owns responsible dispositions. An older artifact must not
    // restore an exclusion over a newer pending review on the same run date.
    if(changedBase && fs.existsSync(file) && ['pending247-review.json','lead-review.json','disposition-review.json']
      .some(name=>entry.file===`agent-workflow/reports/financing/${date}/${name}`)) continue;
    fs.mkdirSync(path.dirname(file),{recursive:true});
    if (entry.file === intakePath && fs.existsSync(file)) {
      write(file, changedBase ? mergeSourceIntakes(read(source),read(file)) : mergeSourceIntakes(read(file),read(source)));
    } else if (changedBase && fs.existsSync(file) && entry.file === researchPath) {
      const current=read(file), incoming=read(source);
      const eventIds=card=>[card.triggered_by_event_id,...(card.source_event_ids || [])].filter(Boolean);
      const acceptedEvents=new Set((current.cards || []).flatMap(eventIds));
      const additions=(incoming.cards || []).filter(card=>!eventIds(card).some(id=>acceptedEvents.has(id)));
      write(file,{...current,cards:union(additions,current.cards,'funding_insight_id'),queue:union(incoming.queue,current.queue,'event_id')});
    } else if (changedBase && fs.existsSync(file) && entry.file === modelPath) {
      const current=read(file), incoming=read(source);
      write(file,{...current,candidates:union(incoming.candidates,current.candidates,'candidate_id')});
    }
    else fs.copyFileSync(source,file);
  }
  if(changedBase) {
    const file=path.join(root,`agent-workflow/reports/financing/${date}/stages.json`),state=read(file);
    if(state) { state.stages={};state.status='resume_on_new_main';write(file,state); }
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode,date,directory] = process.argv.slice(2);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date) || !directory || !['save','restore'].includes(mode)) throw new Error('usage: checkpoint.mjs save|restore YYYY-MM-DD DIRECTORY');
  (mode === 'save' ? snapshot : restore)(process.cwd(),path.resolve(directory),date);
}
