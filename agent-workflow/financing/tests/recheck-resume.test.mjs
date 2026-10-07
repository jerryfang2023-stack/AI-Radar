import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {collect} from '../collect.mjs';import {verifyPending} from '../verify.mjs';
import {read,write,digest} from '../state.mjs';import {config} from '../discovery.mjs';
import {buildSourceIntake,sourceIntakePath} from '../../tools/lib/source-intake-v1.mjs';
const date='2026-10-07',url='https://example.com/pending';
function fixture(t) {
 const base=fs.mkdtempSync(path.join(os.tmpdir(),'recheck-resume-'));t.after(()=>fs.rmSync(base,{recursive:true,force:true}));
 const options={root:path.join(base,'repo'),directory:path.join(base,'reports'),backupRoot:path.join(base,'private'),date};
 fs.mkdirSync(options.root,{recursive:true});
 const collection={version:config.version,date,accepted:true,raw_ids:[],captures:{[url]:{status:'pending',title:'Acme funding',reason:'original_unreadable'}}};
 write(path.join(options.directory,'collection.json'),collection);
 write(sourceIntakePath(options.root,date),buildSourceIntake({root:options.root,date,entries:[]}));
 const verification={version:'FINANCING-VERIFICATION-1',date,collection_hash:digest(collection),entries:{}};
 write(path.join(options.directory,'verification.json'),verification);
 return {options,collection,verification};
}
test('explicit recheck preserves prepared review evidence and resumes verification against the new inputs',async t=>{
 const {options,verification}=fixture(t);let captures=0;
 const result=await collect({...options,recheck:true,gateway:{search:()=>{throw Error('discovery forbidden');}},reviewSearch:async()=>[],capture:async()=>{captures++;return {status:'pending',reason:'original_unreadable'};}});
 assert.equal(captures,1);assert.equal(result.accepted,true);assert.equal(fs.existsSync(path.join(options.directory,'verification.json')),false);
 const archived=path.join(options.backupRoot,'financing-monitor-state/recheck-checkpoints',date);
 assert.deepEqual(read(path.join(archived,fs.readdirSync(archived)[0])),verification);
 const resumed=await verifyPending({...options,search:()=>{throw Error('search replay forbidden');},capture:()=>{throw Error('capture replay forbidden');}});
 assert.equal(resumed.collection_hash,digest(result));assert.equal(resumed.entries[url].status,'pending');
});
test('foreign prepared verification checkpoint stops recheck before any request',async t=>{
 const {options,verification}=fixture(t);const file=path.join(options.directory,'verification.json');
 write(file,{...verification,collection_hash:'foreign'});let calls=0;
 await assert.rejects(collect({...options,recheck:true,reviewSearch:async()=>{calls++;return [];},capture:async()=>{calls++;return {status:'pending'};}}),/verification_checkpoint_identity_mismatch/);
 assert.equal(calls,0);assert.equal(read(file).collection_hash,'foreign');
});
