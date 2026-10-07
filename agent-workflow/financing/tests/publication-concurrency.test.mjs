import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {runStages,read,acquireLock} from '../state.mjs';
import {publicationInputs,publicationCheckpointCommands,publicationCodeInputs} from '../publication-plan.mjs';

const temporary=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'publication-concurrency-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
test('release cannot delete a changed owner receipt and legacy dead locks can be recovered',t=>{
  const directory=temporary(t),file=path.join(directory,'run.lock');
  const release=acquireLock(directory);fs.writeFileSync(file,JSON.stringify({pid:process.pid,token:'new-owner'}));release();assert.ok(fs.existsSync(file));fs.unlinkSync(file);
  const dead=spawnSync(process.execPath,['-e','process.exit(0)'],{windowsHide:true});fs.writeFileSync(file,String(dead.pid));
  const recovered=acquireLock(directory);assert.equal(read(file).pid,process.pid);recovered();assert.ok(!fs.existsSync(file));
});
test('independent local targets overlap; all in-flight work settles before failure; resume only failed target',async t=>{
  const file=path.join(temporary(t),'state.json'),seen=[];
  let started=0,release;
  const barrier=new Promise(resolve=>{release=resolve;});
  const stages=['lake','vault','portal'].map(id=>({id,dependsOn:[],commands:[id],valid:()=>true}));
  await assert.rejects(runStages({file,date:'2026-10-07',codeVersion:'v2',stages,parallelGroups:[['lake','vault'],['portal']],execute:async stage=>{
    seen.push(stage.id);started++;
    if(started===2)release();
    await barrier;
    if(stage.id==='lake')throw Error('lake_failed');
  }}),/lake_failed/);
  assert.equal(read(file).stages.vault.ok,true);
  assert.deepEqual(seen.sort(),['lake','vault']);
  seen.length=0;
  await runStages({file,date:'2026-10-07',codeVersion:'v2',stages,parallelGroups:[['lake','vault'],['portal']],execute:async stage=>seen.push(stage.id)});
  assert.deepEqual(seen,['lake','portal']);
  stages[0].version='lake-repair';seen.length=0;
  await runStages({file,date:'2026-10-07',codeVersion:'v2',stages,execute:async stage=>seen.push(stage.id)});
  assert.deepEqual(seen,['lake']);
});
test('an unrelated commit preserves scoped publication inputs; a catalog edit changes them',t=>{
  const repo=temporary(t),git=argv=>execFileSync('git',argv,{cwd:repo,encoding:'utf8',windowsHide:true}).trim();
  git(['init','-q']);git(['config','user.name','Fixture']);git(['config','user.email','fixture@example.invalid']);
  const catalog=path.join(repo,publicationInputs.financing_read_model[0]);fs.mkdirSync(path.dirname(catalog),{recursive:true});fs.writeFileSync(catalog,'{}');
  git(['add','.']);git(['commit','-qm','initial']);
  const key=()=>git(['ls-tree','HEAD','--',...publicationInputs.financing_read_model]);
  const first=key();fs.writeFileSync(path.join(repo,'README.md'),'documentation');git(['add','.']);git(['commit','-qm','docs']);assert.equal(key(),first);
  fs.writeFileSync(catalog,'{"changed":true}');git(['add','.']);git(['commit','-qm','catalog']);assert.notEqual(key(),first);
  assert.deepEqual(publicationCheckpointCommands([['publish','--source-sha=abc','/tmp/first']],'/tmp/first','abc'),[['publish','--source-sha=<accepted-sha>','<accepted-checkout>']]);
});
test('publication fingerprints include transitive script and JSON dependencies',t=>{
  const repo=temporary(t);
  fs.writeFileSync(path.join(repo,'publish.mjs'),"import './gate.mjs';");
  fs.writeFileSync(path.join(repo,'gate.mjs'),"import './rule.json' with {type:'json'};");
  fs.writeFileSync(path.join(repo,'rule.json'),'{}');
  assert.deepEqual(publicationCodeInputs(repo,[['publish.mjs']]),['gate.mjs','publish.mjs','rule.json']);
});
test('Vault refresh remains bound to the accepted commit after main advances and preserves editor changes',t=>{
  const base=temporary(t),repo=path.join(base,'editor'),remote=path.join(base,'remote.git'),vault=path.join(base,'vault'),runtime=path.join(base,'runtime');
  fs.mkdirSync(repo);fs.mkdirSync(vault);
  const git=(cwd,argv)=>execFileSync('git',argv,{cwd,encoding:'utf8',windowsHide:true}).trim();
  git(base,['init','--bare','-q',remote]);git(repo,['init','-q']);git(repo,['checkout','-qb','main']);git(repo,['config','user.name','Fixture']);git(repo,['config','user.email','fixture@example.invalid']);git(repo,['remote','add','origin',remote]);
  fs.mkdirSync(path.join(repo,'agent-workflow/tools'),{recursive:true});
  for(const script of ['build-guanlan-vault','sync-guanlan-evidence','assert-guanlan-vault'])fs.writeFileSync(path.join(repo,`agent-workflow/tools/${script}.mjs`),script==='build-guanlan-vault'?`import fs from 'node:fs';import path from 'node:path';fs.writeFileSync(path.join(process.env.GUANLAN_VAULT_ROOT,'snapshot.txt'),fs.readFileSync('version.txt'));`:'');
  fs.writeFileSync(path.join(repo,'version.txt'),'accepted');git(repo,['add','.']);git(repo,['commit','-qm','accepted']);git(repo,['push','-q','origin','main']);const accepted=git(repo,['rev-parse','HEAD']);
  fs.writeFileSync(path.join(repo,'version.txt'),'new main');git(repo,['commit','-qam','newer']);git(repo,['push','-q','origin','main']);fs.writeFileSync(path.join(repo,'version.txt'),'unsaved editor');
  const entry=path.resolve('agent-workflow/tools/sync-guanlan-vault-from-main.mjs');
  execFileSync(process.execPath,[entry,'--date=2026-10-07',`--runtime-dir=${runtime}`,`--source-sha=${accepted}`],{cwd:repo,encoding:'utf8',windowsHide:true,env:{...process.env,GUANLAN_VAULT_ROOT:vault}});
  assert.equal(fs.readFileSync(path.join(vault,'snapshot.txt'),'utf8'),'accepted');assert.equal(fs.readFileSync(path.join(repo,'version.txt'),'utf8'),'unsaved editor');
  assert.equal(read(path.join(runtime,'2026-10-07-guanlan-vault-sync.json')).source_commit,accepted);
  assert.equal(git(repo,['worktree','list','--porcelain']).match(/^worktree /gm).length,1);
});
