import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {createLeadFollowupSearch} from '../lead-followup-search.mjs';
import {config} from '../discovery.mjs';

test('backlog leads get independent secondary queries and unknown requests never replay',async t=>{
  const directory=fs.mkdtempSync(path.join(os.tmpdir(),'lead-followup-'));t.after(()=>fs.rmSync(directory,{recursive:true,force:true}));
  let calls=0;const options={directory,date:'2026-10-07',policy:config.secondary_review,env:{ANYSEARCH_API_KEY:'test'},fetcher:async()=>{calls++;throw new Error('unknown');}};
  await createLeadFollowupSearch({...options,leadUrl:'https://example.com/a'})('Acme funding');
  const first=calls;assert.ok(first>=1 && first<=12);
  await createLeadFollowupSearch({...options,leadUrl:'https://example.com/a'})('Acme funding');assert.equal(calls,first);
  await createLeadFollowupSearch({...options,leadUrl:'https://example.com/b'})('Other funding');assert.equal(calls,first*2);
});
