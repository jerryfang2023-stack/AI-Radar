import test from 'node:test';
import assert from 'node:assert/strict';
import {failureRecovery, reviewFailure} from '../failure-policy.mjs';
import {supervise} from '../vps-supervisor.mjs';
import {researchDeferral,validResearchDeferral} from '../research-deferral.mjs';

test('retryable review transport and format failures are bounded; fact and identity errors stop',()=>{
  for(const code of ['hermes_review_ambiguous_or_incomplete_json','hermes_review_incomplete','hermes_review_submission_missing']) {
    const error=reviewFailure({error_code:code,retryable:true},{});
    const first=failureRecovery(error,{},1000);
    assert.equal(first.status,'retry_pending');
    assert.ok(first.retry.next_retry_at);
    assert.equal(failureRecovery(error,{recovery_attempts:{[first.retry.key]:{count:3}}},1000),null);
  }
  for(const error of [new Error('unknown_bug'),reviewFailure({error_code:'hermes_review_identity_mismatch:head_sha',retryable:true},{}),new Error('fact_conflict')])
    assert.equal(failureRecovery(error,{},1000),null);
  assert.equal(failureRecovery(Object.assign(new Error('github_read_failed:network_error'),{retryable:true,recovery_key:'github_read'}),{},1000).status,'retry_pending');
});

test('a new identity/amount candidate can be withheld, but history, stale bindings and unknown bugs block',()=>{
  const event={event_id:'EV-new',event_type:'funding',publication_status:'verified',entities:['EN-new'],claim_refs:['CL-new'],source_refs:['SA-new']};
  const bundle={entities:[{entity_id:'EN-new',canonical_name:'Acme AI',aliases:['Acme Labs']}],
    rawDocuments:[{raw_id:'RAW-new',source_artifact_id:'SA-new',content_hash:'a'.repeat(64),source_url:'https://example.com/new'}],
    claims:[{claim_id:'CL-new',raw_id:'RAW-new',claim_type:'funding',verification_status:'accepted',source_quote:'Acme AI has raised €1.5 million in a pre-Seed round.'}]};
  for(const reason of ['subject_company_unresolved','funding_current_round_amount_mismatch']) {
    const blocked={event_id:event.event_id,status:'blocked',problems:[reason]};
    const deferral=researchDeferral(event,bundle,blocked,[]);
    assert.equal(deferral.fact_approval,false);assert.equal(deferral.isolation,'new_candidate_only');
    const row={...blocked,deferral};assert.equal(validResearchDeferral(event,bundle,row,[]),true);
    assert.equal(validResearchDeferral(event,{...bundle,claims:[{...bundle.claims[0],source_quote:'Different quote'}]},row,[]),false);
    assert.equal(validResearchDeferral(event,{...bundle,entities:[{...bundle.entities[0],canonical_name:'Changed'}]},row,[]),false);
    assert.equal(validResearchDeferral(event,{...bundle,rawDocuments:[{...bundle.rawDocuments[0],content_hash:'b'.repeat(64)}]},row,[]),false);
    for(const card of [{triggered_by_event_id:event.event_id},{company:{entity_id:'EN-new'}},{company:{name:'Acme Labs'}}])
      assert.equal(researchDeferral(event,bundle,blocked,[card]),null);
    assert.equal(researchDeferral(event,{...bundle,claims:[]},blocked,[]),null);
  }
  for(const reason of ['unknown_error','evidence_source_hash_mismatch','schema_version_invalid'])
    assert.equal(researchDeferral(event,bundle,{event_id:event.event_id,status:'blocked',problems:[reason]},[]),null);
});

test('the watch loop continues the same date after a recoverable failure without another discovery',async()=>{
  const args=new Map([['watch','true']]),calls=[],waits=[];
  const results=[{date:'2026-11-01',status:'retry_pending'},{date:'2026-11-01',status:'review_retry_pending'},{date:'2026-11-01',status:'published'}];
  await supervise(args,{runCycle:async input=>{calls.push(input.get('date'));return results.shift();},wait:async ms=>waits.push(ms)});
  assert.deepEqual(calls,[undefined,'2026-11-01','2026-11-01']);assert.equal(waits.length,2);
});
