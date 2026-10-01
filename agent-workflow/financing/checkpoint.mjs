#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { read, write, digest } from './state.mjs';
import { mergeSourceIntakes } from '../tools/lib/source-intake-v1.mjs';

export function allowedCheckpointPath(file, date) {
  if (file.includes('\\') || file.split('/').includes('..') || path.isAbsolute(file)) return false;
  return (/^01-SiteV2\/(?:content\/(?:11-databases|12-applications\/(?:funding-insights|financing-taxonomy))|site\/data)\/.*\.json$/u.test(file)
    || (file.startsWith(`agent-workflow/reports/financing/${date}/`) && /\.json$/u.test(file)))
    && !/\/search-cache\/|\/aihot\//u.test(file);
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
  write(path.join(directory,'manifest.json'), { version: 'FINANCING-CHECKPOINT-1', date, entries });
  return entries;
}
export function restore(root, directory, date) {
  const manifest = read(path.join(directory,'manifest.json'));
  if (manifest?.version !== 'FINANCING-CHECKPOINT-1' || manifest.date !== date) throw new Error('invalid_checkpoint_identity');
  for (const entry of manifest.entries) {
    if (!allowedCheckpointPath(entry.file,date)) throw new Error('checkpoint_path_rejected');
    const body = fs.readFileSync(path.join(directory,'files',entry.file),'utf8');
    if (digest(body) !== entry.hash) throw new Error('checkpoint_hash_mismatch');
    JSON.parse(body);
  }
  for (const entry of manifest.entries) {
    const file = path.join(root,entry.file), source = path.join(directory,'files',entry.file);
    fs.mkdirSync(path.dirname(file),{recursive:true});
    if (entry.file.endsWith(`/intake-v1/${date}.json`) && fs.existsSync(file)) write(file, mergeSourceIntakes(read(file),read(source)));
    else fs.copyFileSync(source,file);
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [mode,date,directory] = process.argv.slice(2);
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(date) || !directory || !['save','restore'].includes(mode)) throw new Error('usage: checkpoint.mjs save|restore YYYY-MM-DD DIRECTORY');
  (mode === 'save' ? snapshot : restore)(process.cwd(),path.resolve(directory),date);
}
