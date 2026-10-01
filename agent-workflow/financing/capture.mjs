import crypto from 'node:crypto';
import { isFundingDiscovery } from '../tools/lib/aihot-feed.mjs';
import { config } from './discovery.mjs';
import { financingScope } from './scope.mjs';

const decode = value => String(value || '').replace(/&nbsp;/giu,' ').replace(/&amp;/giu,'&').replace(/&quot;/giu,'"').replace(/&#39;|&apos;/giu,"'").replace(/&#(x[0-9a-f]+|\d+);/giu, (_, n) => {
  const code = n[0].toLowerCase() === 'x' ? parseInt(n.slice(1),16) : +n;
  return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : '';
}).replace(/&lt;/giu,'<').replace(/&gt;/giu,'>');
const text = html => decode(html.replace(/<(script|style|nav|footer|header|form|aside|svg)\b[\s\S]*?<\/\1>/giu,' ').replace(/<\/(?:p|div|li|h[1-6]|section|article)>|<br\s*\/?\s*>/giu,'\n').replace(/<[^>]*>/gu,' ')).replace(/[ \t]+/gu,' ').replace(/\n\s*\n/gu,'\n').trim();
const attr = (tag, key) => decode(tag.match(new RegExp(`\\b${key}\\s*=\\s*["']([^"']*)["']`, 'iu'))?.[1] || '');
export function parseOriginal(html) {
  const nodes = [];
  const visit = value => { if (!value || typeof value !== 'object') return; if (!Array.isArray(value)) nodes.push(value); Object.values(value).forEach(visit); };
  for (const block of html.matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu)) {
    try { visit(JSON.parse(block[1])); } catch { /* visible original remains usable */ }
  }
  const article = nodes.find(node => /Article|NewsArticle|BlogPosting/u.test(String(node['@type'] || '')));
  const meta = {};
  for (const match of html.matchAll(/<meta\b[^>]*>/giu)) meta[attr(match[0], 'property') || attr(match[0], 'name')] = attr(match[0], 'content');
  const title = decode(article?.headline || meta['og:title'] || text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/iu)?.[1] || '') || text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/iu)?.[1] || ''));
  // Descriptions/search excerpts never masquerade as original article bodies.
  const body = article?.articleBody ? text(article.articleBody) : text(html.match(/<(article|main)\b[^>]*>([\s\S]*?)<\/\1>/iu)?.[2] || html);
  const published = article?.datePublished || meta['article:published_time'] || meta['datePublished'] || meta['pubdate'] || html.match(/<time\b[^>]*datetime=["']([^"']+)["']/iu)?.[1] || '';
  const date = /^\d{4}-\d{2}-\d{2}/u.test(published) && Number.isFinite(Date.parse(published)) ? published.slice(0,10) : '';
  return { title, body, date };
}

export async function captureOriginal(lead, { date, fetcher = fetch } = {}) {
  const response = await fetcher(lead.url, { signal: AbortSignal.timeout(config.capture_timeout_ms), headers: { accept: 'text/html,application/xhtml+xml', 'user-agent': 'Mozilla/5.0 (compatible; WaveSightFinancing/1.0)' } });
  if (!response.ok) throw new Error(`original_http_${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  if (bytes.length > 8 * 1024 * 1024) throw new Error('original_too_large');
  const charset = response.headers.get('content-type')?.match(/charset=([^;\s]+)/iu)?.[1] || 'utf-8';
  const html = new TextDecoder(charset).decode(bytes);
  const parsed = parseOriginal(html);
  if (parsed.body.length < 300 || /\ufffd/u.test(parsed.body) || /^(?:Just a moment|Access denied|Verify you are human)/iu.test(parsed.title)) throw new Error('original_unreadable');
  if (!isFundingDiscovery({ title: parsed.title, summary: parsed.body.slice(0,3000) })) return { status: 'excluded', reason: 'original_not_financing' };
  const scope = financingScope(parsed);
  if (!scope.included) return { status: scope.pending ? 'pending' : 'excluded', reason: scope.reason };
  if (!parsed.date) return { status: 'pending', reason: 'original_date_missing' };
  const age = (+new Date(`${date}T00:00:00Z`) - +new Date(`${parsed.date}T00:00:00Z`)) / 86400000;
  if (age < 0 || age > config.window_days) return { status: 'excluded', reason: 'outside_daily_window', original_date: parsed.date };
  const hash = crypto.createHash('sha256').update(parsed.body).digest('hex');
  return { status: 'accepted', record: {
    title: parsed.title, original_url: lead.url, canonical_url: response.url || lead.url,
    source_name: new URL(lead.url).hostname, source_type: 'article', acquisition_channel: 'financing',
    published_at: parsed.date, collected_at: new Date().toISOString(), language: /[\u3400-\u9fff]/u.test(parsed.body) ? 'zh' : 'en',
    content_hash: hash, clean_text: parsed.body, full_text: parsed.body, has_full_text: true,
    extraction_method: 'original_http', extraction_quality: 'high', evidence_object_type: 'original_full_text', evidence_object_usable: true,
    origin_fetch_status: 'success', raw_qc_decision: 'accepted', raw_qc_downstream_use: 'v4_claim_extraction',
  } };
}
