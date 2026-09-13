import assert from 'node:assert/strict';
import test from 'node:test';
import {sharedRecords, skillIdentity, workspaceRegistry} from '../lib/workspace-contract.mjs';

test('shared identities survive labels and values changing without merging kinds or sources', () => {
  const s = {name:'a',sourceKind:'project',sourcePath:'skills/a'};
  assert.equal(skillIdentity(s),skillIdentity({...s,name:'renamed',version:'2'}));
  assert.notEqual(skillIdentity(s),skillIdentity({...s,sourceKind:'plugin'}));
  const result = sharedRecords({versions:[{key:'OPS',kind:'source',value:'1'},{key:'OPS',kind:'deployed',value:'1'}]},[s],{meta:{data_date:'2026-09-13'},stages:[{id:'collection',status:'partial'}]});
  assert.notEqual(result.versions[0].id,result.versions[1].id);
  assert.equal(result.batches[0].id,'data-center:2026-09-13');
  assert.equal(result.batches[0].stages[0].status,'partial');
  assert.equal(result.batches[0].observedAt,null);
  assert.deepEqual(sharedRecords({versions:[]},[],{meta:{}}).batches,[]);
});
test('public registry covers existing bindings exactly once and has no local machine paths', () => {
  assert.equal(new Set(workspaceRegistry.projects.map(p=>p.id)).size,workspaceRegistry.projects.length);
  assert.equal(new Set(workspaceRegistry.projects.map(p=>p.managerModuleId)).size,workspaceRegistry.projects.length);
  assert.ok(!/[A-Z]:[\\/]|Users[\\/]/u.test(JSON.stringify(workspaceRegistry)));
});
