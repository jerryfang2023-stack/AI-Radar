import test from 'node:test';
import assert from 'node:assert/strict';
import {foundationQuality,dashboardHtml} from '../foundation-dashboard.mjs';
test('dashboard separates source compatibility, upload evidence and device performance evidence',()=>{
  const data={source:{inputHash:'new',taxonomyVersion:'taxonomy',subjectCount:2,latestDate:'2026-10-03'},readModel:{ok:true,inputHash:'old'},portal:{ok:true,funding:{taxonomyVersion:'taxonomy',cardCount:2,latestDate:'2026-10-03'}},client:{ok:true,version:'1.2.7'},performance:{desktop:{ok:true},realDevice:{status:'pending'}}};
  const result=foundationQuality(data);assert.equal(result.readModelCompatible,false);assert.equal(result.portalSchemaAndCountsCompatible,true);assert.ok(result.gaps.some(v=>v.includes('真机')));
  data.readModel.inputHash='new';assert.equal(foundationQuality(data).readModelCompatible,true);
  data.portal.funding.cardCount=3;assert.equal(foundationQuality(data).portalSchemaAndCountsCompatible,false);
});
test('offline/missing evidence is visible and report HTML escapes source metadata',()=>{
  const data={generatedAt:'now',source:{acceptedCommit:'<script>alert(1)</script>'},readModel:{ok:false},portal:{ok:false,error:'timeout'},vault:{ok:false},client:{ok:false},performance:{},quality:{gaps:['<unsafe>']}};
  const result=foundationQuality(data);assert.equal(result.portalSchemaAndCountsCompatible,false);assert.equal(result.gaps.length,4);
  const html=dashboardHtml(data);assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('timeout'));
});
