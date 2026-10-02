import crypto from 'node:crypto';
import { isFundingDiscovery } from '../tools/lib/aihot-feed.mjs';
import { config } from './discovery.mjs';
import { financingScope } from './scope.mjs';

import { originalDate, readOriginalPage } from './original-page.mjs';
export { parseOriginal } from './original-page.mjs';

export async function captureOriginal(lead, { date, fetcher = fetch, reader = null, historicalRange = null } = {}) {
  if (historicalRange && (originalDate(historicalRange.from) !== historicalRange.from
    || originalDate(historicalRange.to) !== historicalRange.to || !historicalRange.from || !historicalRange.to
    || historicalRange.from > historicalRange.to || historicalRange.to > date)) throw new Error('invalid_historical_financing_range');
  const parsed = await readOriginalPage(lead.url,{fetcher,reader,timeoutMs:config.capture_timeout_ms});
  if(!parsed.article_like)return {status:'pending',reason:'original_article_required'};
  if (!isFundingDiscovery({ title: parsed.title, summary: parsed.body.slice(0,3000) })) return { status: 'excluded', reason: 'original_not_financing' };
  const scope = financingScope(parsed);
  if (!scope.included) return { status: scope.pending ? 'pending' : 'excluded', reason: scope.reason };
  if (!parsed.date) return { status: 'pending', reason: 'original_date_missing' };
  const age = (+new Date(`${date}T00:00:00Z`) - +new Date(`${parsed.date}T00:00:00Z`)) / 86400000;
  if (historicalRange ? parsed.date < historicalRange.from || parsed.date > historicalRange.to : age < 0 || age > config.window_days) {
    return { status: 'excluded', reason: historicalRange ? 'outside_historical_range' : 'outside_daily_window', original_date: parsed.date };
  }
  const hash = crypto.createHash('sha256').update(parsed.body).digest('hex');
  return { status: 'accepted', record: {
    title: parsed.title, original_url: lead.url, canonical_url: parsed.url,
    source_name: new URL(lead.url).hostname, source_type: 'article', source_role: 'original_source', acquisition_channel: 'financing',
    published_at: parsed.date, publication_date_evidence: parsed.date_evidence, outbound_links: parsed.links || [], collected_at: new Date().toISOString(), language: /[\u3400-\u9fff]/u.test(parsed.body) ? 'zh' : 'en',
    content_hash: hash, clean_text: parsed.body, full_text: parsed.body, has_full_text: true,
    // Raw acceptance is structural; it is not a reviewed financing or scope decision.
    extraction_method: parsed.method, extraction_quality: 'medium', evidence_object_type: 'original_full_text', evidence_object_usable: true,
    origin_fetch_status: 'success', raw_qc_decision: 'accepted', raw_qc_downstream_use: 'v4_claim_extraction',
  } };
}
