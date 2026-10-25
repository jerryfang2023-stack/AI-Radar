import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {researchDeferral,pendingResearchEvents} from '../research-deferral.mjs';
import {buildEventRecords} from '../../../01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs';

test('only a current, bound, cardless deferral changes the visible completion status', t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'financing-deferral-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
 const date='2026-10-25',base=path.join(root,'01-SiteV2/content/11-databases/data-center-v4',date),daily=path.join(root,'01-SiteV2/content/12-applications/funding-insights',date+'.json');
 const write=(p,v)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,JSON.stringify(v));};
 const event={event_id:'EV-A',event_type:'funding',event_status:'completed',publication_status:'verified',entities:[],claim_refs:['CL-A'],source_refs:['SA-A'],display_title_zh:'示例公司完成融资'};
 const claims=[{claim_id:'CL-A',raw_id:'RAW-A',subject:'示例公司',source_quote:'示例公司完成融资'}];
 const rawDocuments=[{raw_id:'RAW-A',source_artifact_id:'SA-A',content_hash:'a'.repeat(64),source_url:'https://example.com/funding',title_original:'示例公司完成融资'}];
 const bundle={events:[event],claims,rawDocuments};const row={event_id:'EV-A',status:'blocked',problems:['research_sources_insufficient']};row.deferral=researchDeferral(event,bundle,row,[]);
 write(path.join(base,'canonical-events.json'),[event]);write(path.join(base,'claims.json'),claims);write(path.join(base,'raw-documents.json'),rawDocuments);write(daily,{cards:[],queue:[row]});
 const options={events:[event],claims,rawDocuments,sourceArtifacts:[],entities:[],tagAssertions:[],facetAssertions:[],tagNames:new Map(),facetNames:new Map()};
 const pending=pendingResearchEvents(root);assert.equal(pending.size,1);
 const [record]=buildEventRecords({...options,pendingResearch:pending});assert.equal(record.statusLabel,'待核验');assert.equal(record.status,'pending_verification');assert.equal(record.reportedStatus,'completed');assert.equal(event.event_status,'completed');
 const [normal]=buildEventRecords(options);assert.equal(normal.statusLabel,'已完成');assert.equal(normal.publicationStatus,'verified');
 write(daily,{cards:[{triggered_by_event_id:'EV-A'}],queue:[row]});assert.equal(pendingResearchEvents(root).size,0);
 write(daily,{cards:[],queue:[row]});write(path.join(base,'raw-documents.json'),[{...rawDocuments[0],content_hash:'b'.repeat(64)}]);assert.equal(pendingResearchEvents(root).size,0);
});
