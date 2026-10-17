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
