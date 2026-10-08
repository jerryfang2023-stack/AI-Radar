import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {reviewStateDirectory} from '../review-state.mjs';
import {read,write,acquireLock} from '../state.mjs';
import {createReviewBudget} from '../review-budget.mjs';
import {createLeadFollowupSearch} from '../lead-followup-search.mjs';
import {createOriginalReader} from '../original-reader.mjs';

const temporary=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'review-shared-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
const policy={capture_attempts_per_run:480,capture_attempts_per_lead:6,search_requests_per_lead:12,search_queries_per_lead:4,search_results:8};
const date='2026-10-08';

test('linked private worktrees share owner, request budget, query and reader receipts',async t=>{
  const dir=temporary(t),first=path.join(dir,'first'),second=path.join(dir,'second');
  const git=(...args)=>{const r=spawnSync('git',args,{encoding:'utf8',windowsHide:true});assert.equal(r.status,0,r.stderr);};
  git('init',first);write(path.join(first,'seed.json'),{});git('-C',first,'add','seed.json');
  git('-C',first,'-c','user.name=Test','-c','user.email=test@example.com','commit','-m','fixture');
  git('-C',first,'worktree','add','--detach',second);
  const shared=reviewStateDirectory(first);assert.equal(shared,reviewStateDirectory(second));
  const release=acquireLock(path.join(shared,'review-owner'));
  assert.throws(()=>acquireLock(path.join(reviewStateDirectory(second),'review-owner')),/already_active/);release();
  const a=path.join(first,'financing-monitor-state'),b=path.join(second,'financing-monitor-state');
  const budgetA=createReviewBudget({directory:a,sharedDirectory:shared,date,policy});
  assert.equal(budgetA.reserveCapture('lead','https://example.com/original'),true);
  const budgetB=createReviewBudget({directory:b,sharedDirectory:shared,date,policy});
  assert.equal(budgetB.reserveCapture('lead','https://example.com/original'),false);
  assert.equal(budgetB.summary().capture_requests,1);
  let searches=0;
  const query=directory=>createLeadFollowupSearch({directory:path.join(directory,date),sharedDirectory:path.join(shared,date),date,policy,leadUrl:'lead',env:{ANYSEARCH_API_KEY:'fixture'},fetcher:async()=>{searches++;return Response.json({results:[{url:'https://example.com/source',title:'Acme'}]});}});
  await query(a).query('Acme',1);await query(b).query('Acme',1);assert.equal(searches,1);
  let captures=0;
  const reader=directory=>createOriginalReader({directory:path.join(directory,'reader'),sharedDirectory:path.join(shared,'reader'),date,env:{JINA_API_KEY:'fixture'},fetcher:async()=>{captures++;return new Response('Title: Acme\nURL Source: https://example.com/original\nPublished Time: 2026-10-08\nMarkdown Content:\n'+'Acme original financing. '.repeat(30));}});
  await reader(a)('https://example.com/original');await reader(b)('https://example.com/original');assert.equal(captures,1);
});

test('atomic checkpoint replacement recovers a temporary Windows-style file lock',t=>{
  const dir=temporary(t),file=path.join(dir,'checkpoint.json');write(file,{previous:true});
  const rename=fs.renameSync;let attempts=0;
  t.mock.method(fs,'renameSync',(...args)=>{if(attempts++<2)throw Object.assign(new Error('temporarily occupied'),{code:'EPERM'});return rename(...args);});
  write(file,{accepted:true});assert.equal(attempts,3);assert.deepEqual(read(file),{accepted:true});
  assert.deepEqual(fs.readdirSync(dir),['checkpoint.json']);
});

test('permanent I/O error preserves old checkpoint and the pending temporary file',t=>{
  const dir=temporary(t),file=path.join(dir,'checkpoint.json');write(file,{previous:true});
  t.mock.method(fs,'renameSync',()=>{throw Object.assign(new Error('disk error'),{code:'EIO'});});
  assert.throws(()=>write(file,{accepted:true}),/disk error/);assert.deepEqual(read(file),{previous:true});
  assert.ok(fs.readdirSync(dir).some(name=>name.endsWith('.tmp')));
});
