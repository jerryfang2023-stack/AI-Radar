import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const script=fs.readFileSync('01-SiteV2/site/assets/search-growth.js','utf8');
const parsers=script.slice(script.indexOf('  function parseCsv('),script.indexOf('  function download('));
const context=vm.createContext({});vm.runInContext(parsers+'\nthis.convert=csvReport;',context);
test('CSV reads quoted commas/newlines and preserves unknown values',()=>{
  const data=context.convert('\uFEFFQuery,Clicks,Impressions,Position\r\n"融资,\"\"AI\"\"\n数据",2,10,-\r\n','google_search','query','2026-10-01','2026-10-02');
  assert.equal(data.rows[0].query,'融资,"AI"\n数据');assert.equal(data.rows[0].position,null);
  assert.equal(data.rows[0].clicks,2);
});
test('CSV infers date range, supports Chinese export names and rejects malformed fields',()=>{
  const data=context.convert('日期,点击量,展现量\n2026-10-02,1,10\n2026-10-01,0,-\n','baidu_search','date','','');
  assert.equal(data.startDate,'2026-10-01');assert.equal(data.endDate,'2026-10-02');assert.equal(data.rows[1].impressions,null);
  for(const text of ['Date\n2026-10-02\n','Date,Impressions\n2026-10-02,NaN\n','Date,Impressions\n"broken,2\n'])assert.throws(()=>context.convert(text,'google_ai','date','',''));
});
test('growth assets are published privately and routes require existing session/CSRF',()=>{
  const edge=fs.readFileSync('deploy/nginx/wavesight-operations-console.locations.conf','utf8');
  const pages=fs.readFileSync('.github/workflows/github-pages.yml','utf8');
  const publisher=fs.readFileSync('agent-workflow/tools/publish-ops-console.mjs','utf8');
  assert.match(edge,/location \^~ \/ops\/growth-api\/[^]*?auth_request \/ops-auth-check/);
  for(const asset of ['assets/search-growth.js','assets/search-growth.css']){assert.ok(pages.includes(`--exclude="${asset}"`));assert.ok(publisher.includes(`"${asset}"`));}
  assert.match(script,/'X-CSRF-Token':state.csrf/);
  assert.doesNotMatch(script,/localStorage|sessionStorage|sessionToken|adminToken/);
});
