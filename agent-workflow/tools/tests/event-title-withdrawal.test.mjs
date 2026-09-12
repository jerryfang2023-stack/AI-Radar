import test from 'node:test';
import assert from 'node:assert/strict';
import { publicEventSourceTitleIssue, withdrawInvalidTitleEvents } from '../build-data-center-v4.mjs';
test('commentary, roundups and body fragments cannot become completed funding events', () => {
  for (const title of ['奉劝各位AI视频玩家，要融资要上市赶紧的','139笔过亿融资，超600亿真金白银，砸向这些AI公司-36氪','谁拥有DeepSeek？所有权、控制权与中国持股','本轮融资由高投集团领投']) assert.ok(publicEventSourceTitleIssue(title));
  assert.equal(publicEventSourceTitleIssue('智谱完成新一轮融资，由多家机构联合投资'), '');
});
test('withdrawal preserves evidence, removes dependent event rows and is idempotent', () => {
  const bundle = { canonical_events:[{event_id:'EV-bad', display_title_zh:'奉劝各位AI视频玩家，要融资要上市赶紧的',source_refs:['SA-1']},{event_id:'EV-good',display_title_zh:'智谱完成新一轮融资',source_refs:['SA-2']}],raw_documents:[{raw_id:'RAW-1',body_ref:'evidence://preserved',event_candidate_ids:['EV-bad']}],claims:[{claim_id:'CL-1',source_quote:'原文不变'}],relationships:[{event_id:'EV-bad'}],qa_queue:[],manifest:{counts:{canonical_events:2,raw_documents:1,claims:1,relationships:1,qa_queue:0}}};
  assert.deepEqual(withdrawInvalidTitleEvents(bundle).withdrawn_event_ids,['EV-bad']);
  assert.equal(bundle.raw_documents[0].body_ref,'evidence://preserved');
  assert.equal(bundle.claims[0].source_quote,'原文不变');
  assert.equal(bundle.relationships.length,0);
  assert.equal(bundle.qa_queue[0].source_ref,'SA-1');
  assert.equal(bundle.manifest.counts.canonical_events,1);
  assert.deepEqual(withdrawInvalidTitleEvents(bundle).withdrawn_event_ids,[]);
  assert.equal(bundle.qa_queue.length,1);
});
