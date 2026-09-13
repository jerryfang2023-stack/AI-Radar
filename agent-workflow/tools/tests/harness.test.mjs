import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { auditHarness, safeTarget, layers, auditSharedCopies } from '../assert-harness.mjs';
import { createHash } from 'node:crypto';

test('shared runtime copies detect edits, missing files and unsafe paths without a private checkout', () => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'shared-harness-'));
  try {
    fs.mkdirSync(path.join(root,'agent-workflow/harness'),{recursive:true});
    fs.writeFileSync(path.join(root,'rule.md'),'shared\r\n');
    const row={path:'rule.md',source:'manager:Harness/01/rule.md',sourceSha256:'a'.repeat(64),mirrorSha256:createHash('sha256').update('shared\n').digest('hex')};
    const index=path.join(root,'agent-workflow/harness/shared-sources.json');
    const write=()=>fs.writeFileSync(index,JSON.stringify({schemaVersion:1,files:[row]}));write();
    assert.equal(auditSharedCopies(root).ok,true);
    fs.writeFileSync(path.join(root,'rule.md'),'independent edit');
    assert.equal(auditSharedCopies(root).ok,false);
    fs.unlinkSync(path.join(root,'rule.md'));assert.equal(auditSharedCopies(root).ok,false);
    row.path='../outside';write();assert.equal(auditSharedCopies(root).ok,false);
  }finally{fs.rmSync(root,{recursive:true,force:true})}
});

const entry = () => ({ id:'H-example', moduleId:'example', title:'Example', lifecycle:'current', acceptance:'Verify behavior',
  recovery:'Restore accepted version', evidenceRequirement:'Exact commit and result', tracking:[],
  check:{command:'DO NOT EXECUTE THIS',cwd:'wavesight:.',mode:'explicit-only'},
  refs: layers.map(layer => ({root:'wavesight',path:'present.md',layer,kind:'source'})) });
const manifest = entries => ({schemaVersion:1,rootIds:['wavesight','external'],entries});
test('unavailable external roots are explicit and cannot become verified business acceptance', () => {
  const item = entry(); item.refs.forEach(r => r.root='external');
  const result = auditHarness(manifest([item]), {roots:{}});
  assert.equal(result.ok,true); assert.equal(result.entries[0].status,'外部待核验');
  assert.equal(result.entries[0].acceptanceStatus,'业务验收需查证据'); assert.ok(result.warnings.length);
});
test('duplicate IDs, missing layer and unknown modules fail; historical evidence never overrides failure', () => {
  const item=entry(); item.refs.pop();
  const result=auditHarness(manifest([item,item]),{roots:{},modules:[],evidence:{'H-example':[{root:'external',path:'old.json',status:'passed'}]}});
  assert.equal(result.ok,false); assert.match(result.errors.join(' '),/duplicate ID/); assert.match(result.errors.join(' '),/Missing closure/);
});
test('absolute paths and traversal are rejected on every platform', () => {
  for(const p of ['../secret','a/../../secret','C:/secret','/secret','..\\secret']) assert.throws(()=>safeTarget('.',p));
});
test('a newly registered module without a mapping is reported', () => {
  const item=entry(); item.refs.forEach(r => r.root='external');
  const result=auditHarness(manifest([item]),{modules:[{id:'example',owner:'Maintainer'},{id:'new-module',owner:'Owner'}]});
  assert.equal(result.ok,false); assert.match(result.errors.join(' '),/new-module/);
});
test('present references pass and removed source files fail without running registered commands', () => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'guanlan-harness-'));
  try {
    fs.writeFileSync(path.join(root,'present.md'),'fixture');
    const opts={roots:{wavesight:root},modules:[{id:'example',owner:'Maintainer'}]};
    assert.equal(auditHarness(manifest([entry()]),opts).ok,true);
    fs.unlinkSync(path.join(root,'present.md'));
    assert.equal(auditHarness(manifest([entry()]),opts).ok,false);
  } finally { fs.rmSync(root,{recursive:true,force:true}); }
});
