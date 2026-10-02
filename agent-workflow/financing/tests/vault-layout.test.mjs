import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {rewriteVaultLinks} from '../../tools/lib/guanlan-vault-layout.mjs';
import {planMigration,applyMigration} from '../../tools/migrate-guanlan-vault-layout.mjs';
test('moving generated notes changes link targets while preserving user text, aliases and anchors',()=>{
 const text='My words [[30-应用中心/融资洞察#来源|融资]] [[企业 AI 与 FDE]] [[60-知识资产/融资研究/example]] remain.';
 assert.equal(rewriteVaultLinks(text),'My words [[20-融资情报/融资总览#来源|融资]] [[30-专题研究/FDE/企业 AI 与 FDE]] [[60-知识资产/融资/融资研究/example]] remain.');
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
