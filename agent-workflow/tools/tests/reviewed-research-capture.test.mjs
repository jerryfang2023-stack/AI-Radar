import test from 'node:test';
import assert from 'node:assert/strict';
import { reusableResearchCapture } from '../generate-funding-insights-deepseek.mjs';
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
