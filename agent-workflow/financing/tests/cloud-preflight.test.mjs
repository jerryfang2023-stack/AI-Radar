import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {activeProductionRun} from '../dispatch-state.mjs';
test('simultaneously queued triggers let only the earliest run collect; recovery ignores itself',()=>{
  const runs=[{databaseId:12,status:'queued'},{databaseId:11,status:'in_progress'},{databaseId:10,status:'completed'}];
  assert.equal(activeProductionRun(runs).databaseId,11);
  assert.equal(activeProductionRun(runs,'11'),undefined);
  assert.equal(activeProductionRun(runs,'12').databaseId,11);
  assert.equal(activeProductionRun([{...runs[1],status:'completed'},runs[0]],'12'),undefined);
});
test('production rechecks ownership before evidence setup and resolves late checkpoints before collect',()=>{
  const flow=fs.readFileSync(new URL('../../../.github/workflows/funding-daily-pr.yml',import.meta.url),'utf8');
  assert.ok(flow.indexOf('id: preflight')<flow.indexOf('name: Validate inputs and prepare private storage'));
  assert.match(flow,/--dry-run=true --preflight-run="\$GITHUB_RUN_ID"/u);
  assert.match(flow,/RESUME_RUN: \$\{\{ inputs\.resume_run_id \|\| steps\.preflight\.outputs\.resume_run_id \}\}/u);
  for(const step of ['Discover financing and capture originals','Verify pending financing leads using existing sources']) {
    const section=flow.slice(flow.indexOf('name: '+step)).split('      - name: ')[0];
    assert.match(section,/if: steps\.preflight\.outputs\.proceed == 'true'/u);
  }
});
