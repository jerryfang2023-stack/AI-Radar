import test from 'node:test';
import assert from 'node:assert/strict';
import {failedRunLog} from '../github-failure-log.mjs';
import {deterministicProductionFailure} from '../failure-diagnostics.mjs';
const failure=JSON.stringify({date:'2026-10-30',failure_kind:'quality_gate',command:'assert-funding-insights-v1.mjs',problems:['verified_funding_event_without_valid_card']});
test('usable CLI logs avoid redundant API requests',()=>{
  let calls=0;assert.equal(failedRunLog('owner/repo',123,{read:()=>{calls++;return {status:0,stdout:failure};}}),failure);assert.equal(calls,1);
});
for(const primary of [{status:1,stderr:'permission denied'},{status:1,stderr:'temporary CLI error'},{status:0,stdout:''}])test('failed or empty CLI logs recover exact failed-job diagnostics '+JSON.stringify(primary),()=>{
  const calls=[];const read=args=>{calls.push(args);if(args[0]==='run')return primary;if(args[1].includes('/runs/'))return {status:0,stdout:JSON.stringify([{jobs:[{id:456,conclusion:'success'}]},{jobs:[{id:789,conclusion:'failure'}]}])};assert.deepEqual(args,['api','repos/owner/repo/actions/jobs/789/logs','--allow-escape-sequences']);return {status:0,stdout:failure};};
  const log=failedRunLog('owner/repo',123,{read});assert.equal(deterministicProductionFailure(log,{date:'2026-10-30',head:'same',runHead:'same'}).failure_kind,'quality_gate');assert.equal(calls.length,3);
});
test('missing jobs and inaccessible or empty API logs cannot become permission to retry production',()=>{
  for(const jobs of [[],[{id:789,conclusion:'failure'}]])for(const result of [{status:1,stdout:''},{status:0,stdout:''}])assert.throws(()=>failedRunLog('owner/repo',123,{read:args=>args[0]==='run'?{status:1}:args[1].includes('/runs/')?{status:0,stdout:JSON.stringify([{jobs}])}:result}),/failed_run_(?:jobs|log_evidence)_unavailable/);
});
