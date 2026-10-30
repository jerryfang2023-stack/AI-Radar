import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

test('VPS runner isolates temporary caches from inherited shared directories', {skip:process.platform==='win32'}, () => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'financing-temp-test-'));
  try {
    const source=fs.readFileSync(new URL('../vps/run.sh',import.meta.url),'utf8');
    const initialization=source.slice(source.indexOf('export GUANLAN_FINANCING_RUNTIME='),source.indexOf('export GUANLAN_EVIDENCE_BACKUP_ROOT='));
    const shared=path.join(root,'shared');fs.mkdirSync(shared);fs.writeFileSync(path.join(shared,'existing'),'keep');
    const actual=[];
    for(const name of ['first','second']) {
      const runtime=path.join(root,name);fs.mkdirSync(runtime);
      const script='umask 077\n'+initialization.replace('/srv/guanlan-financing/runtime',runtime)+'\nprintf "%s" "$TMPDIR"';
      const temp=execFileSync('bash',['-c',script],{env:{...process.env,TMPDIR:shared},encoding:'utf8'});
      assert.notEqual(temp,shared);assert.equal(path.dirname(temp),runtime);
      assert.equal(fs.statSync(temp).mode&0o777,0o700);
      fs.writeFileSync(path.join(temp,'gh-cache'),'owned');actual.push(temp);
    }
    assert.notEqual(actual[0],actual[1]);assert.equal(fs.readFileSync(path.join(shared,'existing'),'utf8'),'keep');
    assert.deepEqual(fs.readdirSync(shared),['existing']);
  } finally {fs.rmSync(root,{recursive:true,force:true});}
});
