import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {publicationReviewDelta,writePublicationReviewContext,originalLocators} from '../review-context.mjs';
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
  assert.equal(summary.pending_publication.length,1);assert.equal(summary.files.length,2);
  assert.ok(fs.existsSync(path.join(directory,'publication-delta/subjects-added-FI-new.json')));
  assert.equal(JSON.parse(fs.readFileSync(path.join(directory,'base-financing-catalog.json'))).cards.length,1);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
