import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {localVpsTransport} from '../../tools/lib/local-vps-transport.mjs';
test('remote publication stays unchanged without explicit local opt-in',()=>{
  assert.equal(localVpsTransport('ssh',['hermes-vps','echo ok'],{},()=>{throw new Error('must not execute');},{enabled:false}),null);
});
test('local copy refuses existing files and symlinks',{skip:process.platform==='win32'},()=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'guanlan-transport-'));
  const source=path.join(directory,'source');
  const target=path.join(os.tmpdir(),`guanlan-copy-test-${process.pid}`);
  fs.writeFileSync(source,'accepted release');
  try {
    localVpsTransport('scp',[source,`hermes-vps:${target}`],{},()=>{throw new Error('must not spawn');},{enabled:true});
    assert.equal(fs.readFileSync(target,'utf8'),'accepted release');
    assert.throws(()=>localVpsTransport('scp',[source,`hermes-vps:${target}`],{},()=>{}, {enabled:true}),/EEXIST/);
    fs.unlinkSync(target); fs.symlinkSync(source,target);
    assert.throws(()=>localVpsTransport('scp',[source,`hermes-vps:${target}`],{},()=>{}, {enabled:true}),/symlink_rejected/);
  } finally {
    if(fs.existsSync(target)||fs.lstatSync(target,{throwIfNoEntry:false}))fs.unlinkSync(target);
    fs.unlinkSync(source); fs.rmdirSync(directory);
  }
});
test('local transport preserves stdin and rejects host/path redirection',{skip:process.platform==='win32'},()=>{
  const options={input:'nginx -t\n'};
  const result=localVpsTransport('ssh',['hermes-vps','sudo -n sh -s'],options,(name,args,passed)=>({name,args,passed}),{enabled:true});
  assert.deepEqual(result,{name:'/bin/sh',args:['-c','sudo -n sh -s'],passed:options});
  assert.throws(()=>localVpsTransport('ssh',['other','echo bad'],{},()=>{}, {enabled:true}),/host_rejected/);
  for(const target of ['hermes-vps:/etc/cron.d/task','other:/tmp/a','hermes-vps:/tmp/../etc/x'])assert.throws(()=>localVpsTransport('scp',['file',target],{},()=>{}, {enabled:true}),/destination_rejected/);
});
