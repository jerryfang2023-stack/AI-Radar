import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import {assertWorkspaceCapacity, MIN_WORKSPACE_BYTES} from '../storage-capacity.mjs';

test('uses space available to the execution user, excluding reserved blocks',()=>{
  assert.throws(()=>assertWorkspaceCapacity('/runtime',{statfs:()=>({bsize:4096,bavail:1,bfree:10000000})}),/insufficient_workspace_storage/);
});
test('accepts exactly the reserve and reports usable bytes',()=>{
  const result=assertWorkspaceCapacity('/runtime',{statfs:()=>({bsize:4096,bavail:MIN_WORKSPACE_BYTES/4096})});
  assert.equal(result.available_bytes,6*1024**3);
});
test('rejects an unknown or invalid capacity instead of assuming space exists',()=>{
  for(const data of [{bsize:0,bavail:1},{bsize:4096,bavail:NaN},{bsize:4096,bavail:-1}])
    assert.throws(()=>assertWorkspaceCapacity('/runtime',{statfs:()=>data}),/workspace_storage_unavailable/);
  assert.throws(()=>assertWorkspaceCapacity('/runtime',{statfs:()=>{throw new Error('EACCES');}}),/workspace_storage_unavailable/);
});
test('reads the actual filesystem without creating files',()=>{
  const dir=os.tmpdir(),stat=fs.statfsSync(dir);
  const available=assertWorkspaceCapacity(dir,{requiredBytes:0}).available_bytes;
  assert.ok(available>=0 && available<=stat.blocks*stat.bsize);
});
