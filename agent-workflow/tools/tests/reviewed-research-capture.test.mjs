import test from 'node:test';
import assert from 'node:assert/strict';
import { reusableResearchCapture, capturePage } from '../generate-funding-insights-deepseek.mjs';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { sourceTextHash } from '../deepseek-translation-client.mjs';
test('reviewed original excerpts require URL binding, reviewer and intact content', () => {
  const url='https://example.com/article',body='Verified original page excerpt. '.repeat(15);
  const capture={source_url:url,body_clean:body,content_hash:sourceTextHash(body),capture_method:'web_open_excerpt',review:{tool:'web.run.open',source_url:url,reviewer:'Responsible editor',reviewed_at:'2026-10-02T04:00:00Z'}};
  assert.equal(reusableResearchCapture(capture,url),true);
  assert.equal(reusableResearchCapture({...capture,capture_method:'search_snippet'},url),false);
  assert.equal(reusableResearchCapture({...capture,review:{}},url),false);
  assert.equal(reusableResearchCapture({...capture,body_clean:body+' changed'},url),false);
  assert.equal(reusableResearchCapture(capture,'https://example.com/other'),false);
  assert.equal(reusableResearchCapture({...capture,capture_method:'direct_fetch',review:undefined},url),true);
});

test('daily research without seed flags persists originals privately and reuses them without fetching', async () => {
  const backupRoot=fs.mkdtempSync(path.join(os.tmpdir(),'financing-capture-'));
  try {
    let calls=0;
    const result={url:'https://example.com/financing',title:'Financing',source_class:'independent'};
    const readPage=async()=>{ calls++; return {title:'Original financing',body:'A verified original financing article. '.repeat(20),method:'original_http',date_evidence:{date:'2026-10-03'}}; };
    const first=await capturePage(result,{backupRoot,readPage});
    const files=fs.readdirSync(path.join(backupRoot,'funding-research'));
    assert.equal(files.length,1);
    assert.deepEqual(JSON.parse(fs.readFileSync(path.join(backupRoot,'funding-research',files[0]))),first);
    assert.deepEqual(await capturePage(result,{backupRoot,readPage}),first);
    assert.equal(calls,1);
    const file=path.join(backupRoot,'funding-research',files[0]);
    fs.writeFileSync(file,JSON.stringify({...first,body_clean:first.body_clean+' tampered'}));
    await capturePage(result,{backupRoot,readPage});
    assert.equal(calls,2);
  } finally { fs.rmSync(backupRoot,{recursive:true,force:true}); }
});
