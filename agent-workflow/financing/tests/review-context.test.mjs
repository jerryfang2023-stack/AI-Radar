import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {publicationReviewDelta,writePublicationReviewContext,originalLocators,publicationQuoteAudit,publicationProjectionAudit} from '../review-context.mjs';
const card=(id,amount=10)=>({funding_insight_id:id,company:{name:id},financing:{amount},financing_tags:{sector:'ai'},products:[]});
test('private original hints bind the exact captured hash and omit stale research cache',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'financing-original-hints-'));
 try {
  fs.mkdirSync(path.join(root,'funding-research'));fs.mkdirSync(path.join(root,'objects'));
  fs.writeFileSync(path.join(root,'funding-research/FISRC-abc.json'),JSON.stringify({content_hash:'old',body_clean:'Old article'}));
  fs.writeFileSync(path.join(root,'objects/source.txt'),'Accepted article');
  const c={research_sources:[{source_id:'FISRC-abc',source_url:'https://example.org',content_hash:'accepted'}]};
  const rows=[{source_url:'https://example.org',content_hash:'accepted',object_ref:'objects/source.txt'},{source_url:'https://other.org',content_hash:'accepted',object_ref:'objects/source.txt'}];
  assert.deepEqual(originalLocators(c,root,rows).map(r=>r.path),['objects/source.txt']);
  assert.deepEqual(originalLocators(c,root,[]),[]);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
test('publication comparison separates additions, changes and removals from queue counts',()=>{
 const before={cards:[card('FI-old'),card('FI-removed')],event_cards:[card('FI-old')]};
 const after={cards:[card('FI-old',20),card('FI-new')],event_cards:[card('FI-old'),card('FI-new')]};
 const d=publicationReviewDelta(before,after);
 assert.equal(d.subjects.added.length,1);assert.equal(d.subjects.removed.length,1);assert.equal(d.subjects.changed.length,1);
 assert.equal(d.events.added.length,1);assert.equal(d.events.changed.length,0);
});
test('review context reads immutable baseline and exposes new cards despite zero queue approvals',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'financing-review-context-'));
 try {
  execFileSync('git',['init','--quiet',root]);
  const file='01-SiteV2/site/data/financing-catalog-v1.json',old={cards:[card('FI-old')],event_cards:[card('FI-old')]};
  fs.mkdirSync(path.dirname(path.join(root,file)),{recursive:true});fs.writeFileSync(path.join(root,file),JSON.stringify(old));
  execFileSync('git',['add',file],{cwd:root});const base=execFileSync('git',['write-tree'],{cwd:root,encoding:'utf8'}).trim();
  fs.writeFileSync(path.join(root,file),JSON.stringify({cards:[...old.cards,card('FI-new')],event_cards:[...old.event_cards,card('FI-new')],review:{publication_pending:[{event_id:'held'}]}}));
  const report=path.join(root,'agent-workflow/reports/financing/2026-10-16/publication.json');fs.mkdirSync(path.dirname(report),{recursive:true});fs.writeFileSync(report,JSON.stringify({verification:{counts:{verified:0}}}));
  const directory=path.join(root,'review'),summary=writePublicationReviewContext({checkout:root,directory,base,head:'reviewed-head',date:'2026-10-16'});
  assert.equal(summary.delta.subjects.added,1);assert.equal(summary.verification_queue_counts.verified,0);
  assert.equal(summary.projection_audit.counts.public_subjects,2);
  assert.equal(summary.projection_audit.lineage[0].public_event_card_id,'FI-new');
  assert.equal(summary.pending_publication.length,1);assert.equal(summary.files.length,2);
  assert.ok(fs.existsSync(path.join(directory,'publication-delta/subjects-added-FI-new.json')));
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'base-financing-catalog.json'))).cards.length,1);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});


test('quote audit binds each citation to its own captured source without approving its meaning',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'financing-quote-audit-'));
 try {
  fs.writeFileSync(path.join(root,'one.json'),JSON.stringify({body_clean:'Original Alpha quote.\nSecond paragraph.'}));
  fs.writeFileSync(path.join(root,'two.txt'),'Original Beta quote.');
  const sources=[{source_id:'FISRC-a',source_url:'https://a.test',content_hash:'aaa'},{source_id:'FISRC-b',source_url:'https://b.test',content_hash:'bbb'}];
  const locators=[{path:'one.json',source_url:'https://a.test',content_hash:'aaa'},{path:'two.txt',source_url:'https://b.test',content_hash:'bbb'}];
  const refs=[{source_id:'FISRC-a',quote:'Alpha quote. Second paragraph.'},{source_id:'FISRC-b',quote:'Alpha quote.'},{source_id:'FISRC-b',quote:'Beta quote.'}];
  const audit=publicationQuoteAudit({research_sources:sources,evidence_refs:refs},root,locators);
  assert.deepEqual(audit.map(row=>row.matched),[true,false,true]);
  assert.equal(audit[0].original_path,'one.json');assert.equal(audit[2].original_path,'two.txt');
  assert.equal(audit[0].quote_sha256.length,64);assert.ok(audit.every(row=>!Object.hasOwn(row,'fact_approval')));
  assert.equal(publicationQuoteAudit({research_sources:sources,evidence_refs:[refs[0]]},root,[{...locators[0],content_hash:'stale'}])[0].matched,false);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});


test('review projection audit distinguishes research, public events, subjects and person candidates',()=>{
 const raw={funding_insight_id:'FI-research',triggered_by_event_id:'EV-new',company:{name:'Alpha AI',entity_id:'EN-alpha',application_entity_id:'EN-alpha'},financing:{announced_at:'2026-11-12',round:'A',amount_original:'$1B'}};
 const published={...raw,funding_insight_id:'FI-event',subject_card_id:'FI-event'};
 const before={cards:[],event_cards:[]},after={cards:[published],event_cards:[published]};
 const research={meta:{counts:{funding_events:3,auto_published:1,pending:1,deduplicated:1}},cards:[raw]};
 const audit=publicationProjectionAudit(before,after,{research,candidates:[{candidate_id:'person',candidate_kind:'person',research_name:'Behnam',funding_insight_ids:['FI-research'],company_entity_ids:['EN-alpha'],status:'pending_canonical_review'}]});
 assert.equal(audit.counts.research_stored_cards,1);assert.equal(audit.counts.research_selected_events,3);
 assert.equal(audit.lineage[0].research_cards[0].research_card_id,'FI-research');
 assert.equal(audit.lineage[0].public_event_card_id,'FI-event');assert.equal(audit.lineage[0].public_subject_card_ids.length,1);
 assert.equal(audit.lineage[0].pending_identity_candidates[0].candidate_kind,'person');
 assert.deepEqual(audit.duplicate_public_subject_applications,[]);assert.deepEqual(audit.duplicate_public_funding_events,[]);
 assert.equal(Object.hasOwn(audit,'approved'),false);
});
test('review projection audit exposes actual public duplicates and lost or changed historical events',()=>{
 const company={name:'Alpha AI',application_entity_id:'EN-alpha'};
 const old={funding_insight_id:'FI-old',triggered_by_event_id:'EV-old',company,financing:{amount:1}};
 const current={funding_insight_id:'FI-new',triggered_by_event_id:'EV-new',company,financing:{amount:2}};
 const dup={...current,funding_insight_id:'FI-duplicate'};
 const audit=publicationProjectionAudit({cards:[old],event_cards:[old]},{cards:[current,dup],event_cards:[current,dup]});
 assert.equal(audit.duplicate_public_subject_applications[0].application_entity_id,'EN-alpha');
 assert.equal(audit.duplicate_public_funding_events[0].event_id,'EV-new');
 assert.deepEqual(audit.missing_historical_event_cards,['FI-old']);
 const changed=publicationProjectionAudit({cards:[old],event_cards:[old]},{cards:[old],event_cards:[{...old,financing:{amount:999}}]});
 assert.deepEqual(changed.changed_historical_event_cards,['FI-old']);
});


test('research result marked auto_published remains visibly unadmitted when classification is pending',()=>{
 const raw={...card('FI-research'),triggered_by_event_id:'EV-pending',publication_status:'auto_published',company:{name:'Lab AI',application_entity_id:'EN-lab'}};
 const audit=publicationProjectionAudit({cards:[],event_cards:[]},{cards:[],event_cards:[],review:{pending:[{event_id:'EV-pending',reason:'robotics boundary unclear'}]}},{research:{cards:[raw]}});
 assert.equal(audit.non_admitted_research.length,1);assert.equal(audit.non_admitted_research[0].publication_disposition,'pending_classification');
 assert.equal(audit.non_admitted_research[0].is_publicly_admitted,false);assert.equal(audit.non_admitted_research[0].research_result_status,'auto_published');
 assert.equal(audit.counts.public_event_cards,0);assert.deepEqual(audit.lineage,[]);
});


test('zero public delta still supplies canonical candidates and originals for withheld research',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'financing-pending-context-'));
 const put=(file,data)=>{const p=path.join(root,file);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof data==='string'?data:JSON.stringify(data));};
 try{
  execFileSync('git',['init','--quiet',root]);const file='01-SiteV2/site/data/financing-catalog-v1.json',catalog={cards:[],event_cards:[]};put(file,catalog);execFileSync('git',['add',file],{cwd:root});const base=execFileSync('git',['write-tree'],{cwd:root,encoding:'utf8'}).trim();
  const date='2026-11-15';put(file,{...catalog,review:{pending:[{event_id:'EV-pending',reason:'scope unclear'}]}});
  put(`agent-workflow/reports/financing/${date}/publication.json`,{verification:{counts:{pending:99}}});
  put(`01-SiteV2/content/11-databases/data-center-v4/${date}/canonical-events.json`,[{event_id:'EV-pending',event_type:'funding'}]);
  put(`01-SiteV2/content/12-applications/funding-insights/${date}.json`,{cards:[{...card('FI-research'),triggered_by_event_id:'EV-pending',publication_status:'auto_published',research_sources:[{source_id:'FISRC-abc',content_hash:'body-hash',source_url:'https://example.org/story'}]}]});
  put('evidence/catalog.jsonl','');put('evidence/funding-research/FISRC-abc.json',{content_hash:'body-hash',body_clean:'Original financing article'});
  const out=writePublicationReviewContext({checkout:root,directory:path.join(root,'review'),base,head:'head',date,evidenceRoot:path.join(root,'evidence')});
  assert.equal(out.delta.events.added,0);assert.deepEqual(out.required_originals,{});assert.deepEqual(out.factual_layer_delta.added,['EV-pending']);
  assert.equal(out.non_admitted_originals['EV-pending'][0].path,'funding-research/FISRC-abc.json');assert.equal(out.projection_audit.non_admitted_research[0].is_publicly_admitted,false);
  assert.ok(out.files.includes('factual-delta/EV-pending.json'));assert.ok(out.files.includes('non-admitted-research/FI-research.json'));
 }finally{fs.rmSync(root,{recursive:true,force:true});}
});

test('currency lineage exposes source disclosures and actual public events without granting approval',()=>{
 const canonical={...card('FI-existing'),triggered_by_event_id:'EV-existing',source_event_ids:['EV-existing','EV-equivalent'],
  financing:{amount:'$2.2 million',cumulative_amount:{historical_round_count:1},
   disclosures:[{event_id:'EV-existing',amount:'$2.2 million',announced_at:'2026-11-18'},{event_id:'EV-equivalent',amount:'€2 million',announced_at:'2026-11-18'}]}};
 const before={cards:[canonical],event_cards:[canonical]};
 const after={cards:[canonical],event_cards:[canonical],review:{cross_currency_duplicates:[{canonical_id:'FI-existing',duplicate_id:'FI-equivalent',reason:'same_round_explicit_source_currency_equivalence',evidence:{quote:'Company raised €2 million ($2.2 million) in seed funding.'}}]}};
 const audit=publicationProjectionAudit(before,after);
 assert.equal(audit.same_round_currency_lineage[0].disclosures.length,2);
 assert.deepEqual(audit.same_round_currency_lineage[0].public_event_card_ids,['FI-existing']);
 assert.equal(audit.same_round_currency_lineage[0].historical_round_count,1);
 assert.equal(Object.hasOwn(audit.same_round_currency_lineage[0],'fact_approval'),false);
 const duplicated={...after,event_cards:[canonical,{...card('FI-equivalent'),triggered_by_event_id:'EV-equivalent'}]};
 assert.deepEqual(publicationProjectionAudit(before,duplicated).same_round_currency_lineage[0].public_event_card_ids,['FI-existing','FI-equivalent']);
});
