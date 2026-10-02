#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {isMainModule} from './lib/module-entry.mjs';
import {GUANLAN_VAULT_LAYOUT_VERSION} from './guanlan-vault-paths.mjs';
import {rewriteVaultLinks} from './lib/guanlan-vault-layout.mjs';
import {VAULT_SCAN_SKIP_DIRECTORIES} from './lib/guanlan-vault-scan.mjs';
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const safe=(root,relative)=>{const file=path.resolve(root,relative),rel=path.relative(root,file);if(!rel||rel.startsWith('..')||path.isAbsolute(rel))throw Error('vault_migration_path_escape');return file;};
export function planMigration({target,staging}) {
  target=fs.realpathSync(target);staging=fs.realpathSync(staging);
  if(target===staging || !path.relative(target,staging).startsWith('..') || !path.relative(staging,target).startsWith('..'))throw Error('independent_vault_staging_required');
  const before=JSON.parse(fs.readFileSync(path.join(target,'.guanlan-generated.json'),'utf8')),after=JSON.parse(fs.readFileSync(path.join(staging,'.guanlan-generated.json'),'utf8'));
  if(after.layoutVersion!==GUANLAN_VAULT_LAYOUT_VERSION)throw Error('new_vault_layout_required');
  const old=new Set(before.generatedFiles),next=new Set(after.generatedFiles),changes=[];
  for(const relative of next) {
    if(relative.startsWith('90-工作区/') || (relative==='.obsidian/app.json'&&fs.existsSync(safe(target,relative))))continue;
    const current=safe(target,relative),source=safe(staging,relative);
    if(!fs.existsSync(source))throw Error(`staging_asset_missing:${relative}`);
    if(fs.existsSync(current)&&!old.has(relative))throw Error(`unmanaged_vault_target_collision:${relative}`);
    const oldBytes=fs.existsSync(current)?fs.readFileSync(current):null,newBytes=fs.readFileSync(source);
    if(oldBytes && digest(oldBytes)===digest(newBytes))continue;
    changes.push({path:relative,kind:'write',previousHash:oldBytes?digest(oldBytes):null,newHash:digest(newBytes),body:newBytes});
  }
  for(const relative of old)if(!next.has(relative)&&!relative.startsWith('90-工作区/')) {const file=safe(target,relative);if(fs.existsSync(file))changes.push({path:relative,kind:'remove',previousHash:digest(fs.readFileSync(file))});}
  const stack=[target];
  while(stack.length){const directory=stack.pop();for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    if(VAULT_SCAN_SKIP_DIRECTORIES.has(entry.name)||['_归档','发布记录','repos','tmp','output','outputs'].includes(entry.name)||entry.isSymbolicLink())continue;
    const file=path.join(directory,entry.name);if(entry.isDirectory()){stack.push(file);continue;}
    const relative=path.relative(target,file).replaceAll('\\','/');if(!entry.isFile()||!relative.endsWith('.md')||old.has(relative)||relative==='AGENTS.md'||relative.endsWith('/AGENTS.md'))continue;
    const bytes=fs.readFileSync(file),content=bytes.toString('utf8'),updated=rewriteVaultLinks(content);
    if(updated!==content)changes.push({path:relative,kind:'link-update',previousHash:digest(bytes),newHash:digest(updated),body:Buffer.from(updated)});
  }}
  return{target,staging,layoutVersion:GUANLAN_VAULT_LAYOUT_VERSION,changes};
}
export function applyMigration(plan,backup) {
  backup=path.resolve(backup);if(fs.existsSync(backup))throw Error('fresh_vault_backup_directory_required');
  if(!path.relative(plan.target,backup).startsWith('..'))throw Error('vault_backup_must_be_external');
  const lock=path.join(plan.target,'.guanlan-layout-migration.lock');let fd;
  try{fd=fs.openSync(lock,'wx');}catch(error){if(error.code==='EEXIST')throw Error('vault_layout_migration_busy');throw error;}
  const done=[];
  try {
    fs.mkdirSync(backup,{recursive:true});
    for(const change of plan.changes){const file=safe(plan.target,change.path),current=fs.existsSync(file)?digest(fs.readFileSync(file)):null;if(current!==change.previousHash)throw Error(`vault_changed_since_migration_plan:${change.path}`);if(current){const copy=safe(backup,change.path);fs.mkdirSync(path.dirname(copy),{recursive:true});fs.copyFileSync(file,copy);}}
    fs.writeFileSync(path.join(backup,'migration.json'),JSON.stringify({...plan,changes:plan.changes.map(({body,...change})=>change)},null,2)+'\n');
    for(const change of plan.changes){const file=safe(plan.target,change.path),current=fs.existsSync(file)?digest(fs.readFileSync(file)):null;if(current!==change.previousHash)throw Error(`vault_changed_during_migration:${change.path}`);if(change.kind==='remove')fs.unlinkSync(file);else{fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=`${file}.${process.pid}.tmp`;fs.writeFileSync(tmp,change.body);fs.renameSync(tmp,file);}done.push(change);}
    return{applied:done.length,backup};
  }catch(error){
    const conflicts=[];
    for(const change of done.reverse()) {
      const file=safe(plan.target,change.path),copy=safe(backup,change.path);
      const current=fs.existsSync(file)?digest(fs.readFileSync(file)):null;
      const owned=change.kind==='remove'?null:change.newHash;
      if(current!==owned){conflicts.push({path:change.path,reason:'changed_after_migration',currentHash:current});continue;}
      try {if(change.previousHash)fs.copyFileSync(copy,file);else if(fs.existsSync(file))fs.unlinkSync(file);}
      catch(restoreError){conflicts.push({path:change.path,reason:restoreError.message});}
    }
    fs.writeFileSync(path.join(backup,'rollback.json'),JSON.stringify({status:conflicts.length?'partial':'restored',error:error.message,conflicts},null,2)+'\n');
    if(conflicts.length)error.message+=`; vault_rollback_conflicts:${conflicts.map(c=>c.path).join(',')}; recovery:${backup}`;
    throw error;
  }
  finally{fs.closeSync(fd);fs.unlinkSync(lock);}
}
if(isMainModule(import.meta.url)){const args=new Map(process.argv.slice(2).map(arg=>{const [key,...v]=arg.replace(/^--/,'').split('=');return[key,v.join('=')];}));try{if(!args.get('target')||!args.get('staging'))throw Error('target_and_staging_required');const plan=planMigration({target:args.get('target'),staging:args.get('staging')});console.log(JSON.stringify(args.get('apply')==='true'?applyMigration(plan,args.get('backup')):{target:plan.target,staging:plan.staging,changes:plan.changes.map(({body,...change})=>change)},null,2));}catch(error){console.error(error.message);process.exitCode=1;}}
