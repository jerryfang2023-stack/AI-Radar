import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';import {fileURLToPath} from 'node:url';import {execFileSync,spawnSync} from 'node:child_process';
test('a newer accepted main rejects the old requested source before touching the Vault',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'vault-source-pin-')),root=path.join(dir,'source'),remote=path.join(dir,'remote.git'),vault=path.join(dir,'vault'),runtime=path.join(dir,'runtime');
  try{
    fs.mkdirSync(root);fs.mkdirSync(vault);fs.writeFileSync(path.join(vault,'sentinel.md'),'user content');
    const git=(...args)=>execFileSync('git',args,{cwd:root,windowsHide:true,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
    git('init','--bare',remote);git('init','-b','main');git('config','user.name','Fixture');git('config','user.email','fixture@example.test');git('remote','add','origin',remote);
    fs.writeFileSync(path.join(root,'source.txt'),'old');git('add','.');git('commit','-m','old');const old=git('rev-parse','HEAD');
    fs.writeFileSync(path.join(root,'source.txt'),'new');git('add','.');git('commit','-m','new');git('push','origin','main');
    const result=spawnSync(process.execPath,[fileURLToPath(new URL('../../tools/sync-guanlan-vault-from-main.mjs',import.meta.url)),`--source-commit=${old}`,`--runtime-dir=${runtime}`,'--date=2026-10-03'],{cwd:root,env:{...process.env,GUANLAN_VAULT_ROOT:vault},encoding:'utf8',windowsHide:true});
    assert.equal(result.status,1);const receipt=JSON.parse(fs.readFileSync(path.join(runtime,'2026-10-03-guanlan-vault-sync.json')));assert.match(receipt.error,/accepted_main_changed_before_vault_projection/);assert.equal(fs.readFileSync(path.join(vault,'sentinel.md'),'utf8'),'user content');assert.deepEqual(fs.readdirSync(vault),['sentinel.md']);assert.ok(!fs.existsSync(path.join(runtime,'worktrees')));
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});
