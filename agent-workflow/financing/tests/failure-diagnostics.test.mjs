import test from 'node:test';
import assert from 'node:assert/strict';
import {assertionProblems,deterministicProductionFailure} from '../failure-diagnostics.mjs';

test('preserve assertion problems without arbitrary source or log content',()=>{
  assert.deepEqual(assertionProblems('private source\n{"ok":false,"files":1,"problems":["EV-123:subject_unresolved"]}\n'),['EV-123:subject_unresolved']);
  assert.deepEqual(assertionProblems('provider 429 or subprocess timeout'),[]);
  assert.deepEqual(assertionProblems('{"ok":true,"problems":[]}'),[]);
});
test('same-head factual failure requires a repair; network errors and changed code may retry',()=>{
  const date='2026-10-17',head='a'.repeat(40);
  const failure={date,failure_kind:'quality_gate',command:'assert-funding-insights-v1.mjs',problems:['EV-1:invalid']};
  const log='financing\tstage\t2026-10-17T00:00:00Z '+JSON.stringify(failure);
  assert.deepEqual(deterministicProductionFailure(log,{date,head,runHead:head}),failure);
  assert.equal(deterministicProductionFailure(log,{date,head:'b'.repeat(40),runHead:head}),null);
  assert.equal(deterministicProductionFailure(log,{date:'2026-10-18',head,runHead:head}),null);
  assert.equal(deterministicProductionFailure(JSON.stringify({...failure,failure_kind:'execution'}),{date,head,runHead:head}),null);
});

test('exhausted translation fact rejections stop same-head redispatch without masking provider recovery',()=>{
 const date='2026-11-03',head='a'.repeat(40),failure={date,command:'backfill-source-title-translations.mjs',failure_kind:'execution',problems:[],translation:{unresolved:1,blocking_unresolved:1,failures:[{failures:[{provider:'deepseek',reason:'title_facts_or_quality_rejected',attempt:1}]}]}};
 const inspect=x=>deterministicProductionFailure(JSON.stringify(x),{date,head,runHead:head});
 assert.deepEqual(inspect(failure),failure);
 assert.equal(deterministicProductionFailure(JSON.stringify(failure),{date,head:'b'.repeat(40),runHead:head}),null);
 for(const reasons of [['TimeoutError'],['deepseek_http_429'],['title_facts_or_quality_rejected','TimeoutError'],[]]){
  const x=structuredClone(failure);x.translation.failures[0].failures=reasons.map(reason=>({reason}));assert.equal(inspect(x),null);
 }
 const optional=structuredClone(failure);optional.translation.blocking_unresolved=0;assert.equal(inspect(optional),null);
});
