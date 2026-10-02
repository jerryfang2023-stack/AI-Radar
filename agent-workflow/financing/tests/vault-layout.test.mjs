import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {rewriteVaultLinks} from '../../tools/lib/guanlan-vault-layout.mjs';
import {planMigration,applyMigration} from '../../tools/migrate-guanlan-vault-layout.mjs';
import {buildVaultDomains,verifyVaultDomains} from '../../tools/build-guanlan-vault-domains.mjs';
test('moving generated notes changes link targets while preserving user text, aliases and anchors',()=>{
 const text='My words [[30-应用中心/融资洞察#来源|融资]] [[企业 AI 与 FDE]] [[60-知识资产/融资研究/example]] remain.';
 assert.equal(rewriteVaultLinks(text),'My words [[20-融资情报/融资总览#来源|融资]] [[30-专题研究/FDE/企业 AI 与 FDE]] [[60-知识资产/融资/融资研究/example]] remain.');
});

test('a failed migration preserves an intervening user edit instead of rolling it back',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'vault-rollback-')),target=path.join(root,'target'),staging=path.join(root,'staging');
 const write=(base,file,body)=>{const dest=path.join(base,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,body);};
 const rename=fs.renameSync;
 try {
  write(target,'.guanlan-generated.json',JSON.stringify({generatedFiles:['.guanlan-generated.json']}));
  write(staging,'.guanlan-generated.json',JSON.stringify({layoutVersion:'GUANLAN-VAULT-LAYOUT-2',generatedFiles:['.guanlan-generated.json']}));
  write(target,'90-工作区/a.md','A [[30-应用中心/融资洞察]]');write(target,'90-工作区/b.md','B [[30-应用中心/融资洞察]]');
  const plan=planMigration({target,staging});
  fs.renameSync=(from,to)=>{
   const result=rename(from,to);
   if(to===path.join(target,'90-工作区/a.md')) {
    write(target,'90-工作区/a.md','Concurrent user text [[20-融资情报/融资总览]]');
    write(target,'90-工作区/b.md','Another concurrent edit');
   }
   return result;
  };
  assert.throws(()=>applyMigration(plan,path.join(root,'backup')),/vault_changed_during_migration/);
  assert.equal(fs.readFileSync(path.join(target,'90-工作区/a.md'),'utf8'),'Concurrent user text [[20-融资情报/融资总览]]');
  assert.equal(fs.readFileSync(path.join(target,'90-工作区/b.md'),'utf8'),'Another concurrent edit');
  const rollback=JSON.parse(fs.readFileSync(path.join(root,'backup/rollback.json')));
  assert.equal(rollback.status,'partial');assert.equal(rollback.conflicts[0].path,'90-工作区/a.md');
 } finally {fs.renameSync=rename;fs.rmSync(root,{recursive:true,force:true});}
});

test('generated update dates do not revise financing while a community edit does',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'vault-domains-'));
 const funding='20-融资情报/融资总览.md',community='30-专题研究/社群监测/社群情报.md';
 const write=(file,body)=>{const dest=path.join(root,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,body);};
 try {
  write('.guanlan-generated.json',JSON.stringify({layoutVersion:'GUANLAN-VAULT-LAYOUT-2',generatedFiles:[funding,community]}));
  write(funding,'---\nupdated: 2026-10-02\n---\n# Financing\nUnchanged facts\n');
  write(community,'---\nupdated: 2026-10-02\n---\n# Community\nFirst essay\n');
  const first=buildVaultDomains(root);
  write(funding,'---\nupdated: 2026-10-03\n---\n# Financing\nUnchanged facts\n');
  write(community,'---\nupdated: 2026-10-03\n---\n# Community\nSecond essay\n');
  const next=buildVaultDomains(root);
  assert.equal(next.financing.contentHash,first.financing.contentHash);
  assert.notEqual(next.community.contentHash,first.community.contentHash);
  assert.notEqual(next.financing.files[0].sha256,first.financing.files[0].sha256);
  assert.doesNotThrow(()=>verifyVaultDomains(root));
  write(funding,'---\nupdated: 2026-10-04\n---\n# Financing\nUnchanged facts\n');
  assert.throws(()=>verifyVaultDomains(root),/asset_mismatch/);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
test('migration backs up replaced projections and changed personal links, and rejects a late writer',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'vault-layout-')),target=path.join(root,'target'),staging=path.join(root,'staging');
 const write=(base,file,body)=>{const dest=path.join(base,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,body);};
 try {
  write(target,'old.md','old projection');write(target,'.guanlan-generated.json',JSON.stringify({generatedFiles:['old.md','.guanlan-generated.json']}));write(target,'90-工作区/note.md','Personal [[30-应用中心/融资洞察]]');
  write(staging,'20-融资情报/融资总览.md','new projection');write(staging,'.guanlan-generated.json',JSON.stringify({layoutVersion:'GUANLAN-VAULT-LAYOUT-2',generatedFiles:['20-融资情报/融资总览.md','.guanlan-generated.json']}));
  const first=planMigration({target,staging});write(target,'old.md','late writer');assert.throws(()=>applyMigration(first,path.join(root,'backup-conflict')),/changed_since/);assert.equal(fs.readFileSync(path.join(target,'old.md'),'utf8'),'late writer');
  const plan=planMigration({target,staging}),backup=path.join(root,'backup');applyMigration(plan,backup);
  assert.equal(fs.existsSync(path.join(target,'old.md')),false);assert.equal(fs.readFileSync(path.join(backup,'old.md'),'utf8'),'late writer');
  assert.equal(fs.readFileSync(path.join(target,'90-工作区/note.md'),'utf8'),'Personal [[20-融资情报/融资总览]]');
  assert.equal(fs.readFileSync(path.join(backup,'90-工作区/note.md'),'utf8'),'Personal [[30-应用中心/融资洞察]]');
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
