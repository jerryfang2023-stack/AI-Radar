import fs from 'node:fs';
import { collectAIHotFeed, isFundingDiscovery } from '../tools/lib/aihot-feed.mjs';
import { canonicalSearchUrl } from '../tools/lib/search-gateway.mjs';

export const config = JSON.parse(fs.readFileSync(new URL('./config.json', import.meta.url), 'utf8'));
export function queryPlan(date) {
  const start = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(+start) || start.toISOString().slice(0, 10) !== date) throw new Error('invalid_date');
  start.setUTCDate(start.getUTCDate() - config.window_days);
  const suffix = ` after:${start.toISOString().slice(0, 10)} before:${new Date(+new Date(`${date}T00:00:00Z`) + 86400000).toISOString().slice(0,10)}`;
  return config.markets.flatMap(market => [
    ...config.general_queries[market].map((q, i) => ({ id: `${market}:general:${i}`, market, category: 'general', query: q + suffix })),
    ...config.sector_queries.map(row => ({ id: `${market}:sector:${row.id}`, market, category: row.id, query: row[market === 'domestic' ? 'zh' : 'en'] + suffix })),
    ...config.hardware.map(row => ({ id: `${market}:${row.id}`, market, category: row.id, query: row[market === 'domestic' ? 'zh' : 'en'] + suffix })),
  ]);
}

// URL dedupe removes duplicate capture only. Company/round dedupe belongs to
// canonical events after original evidence; brands are never merged here.
export function uniqueLeads(rows) {
  const unique = new Map();
  for (const row of rows) {
    const url = canonicalSearchUrl(row.url);
    if (!url || !isFundingDiscovery({ ...row, summary: row.summary || row.snippet })) continue;
    const previous = unique.get(url);
    const coverage = [...new Set([...(previous?.coverage || []), ...(row.coverage || [])])];
    unique.set(url, { ...previous, ...row, url, coverage, evidence_role: 'discovery_only' });
  }
  return [...unique.values()];
}

export async function discover({ date, search, feed = collectAIHotFeed, onPage, previous = {}, save = () => {} }) {
  const receipts = { ...previous };
  if (!receipts.aihot?.ok) {
    const data = await feed({ window: '7d', onPage });
    receipts.aihot = { ok: data.complete, items: data.items, count: data.discovered_count, pages: data.pages, errors: data.failures };
    await save(receipts);
  }
  // Every category owns its query. Failures resume individually; no global
  // first-N query slice can silently exclude domestic or hardware coverage.
  for (const entry of queryPlan(date)) {
    if (receipts[entry.id]?.ok) continue;
    try {
      const rows = await search(entry.query, config.search_results);
      receipts[entry.id] = { ...entry, ok: true, status: rows.length ? 'results' : 'empty', items: rows.map(row => ({ ...row, coverage: [entry.id] })) };
    } catch (error) {
      receipts[entry.id] = { ...entry, ok: false, status: 'failed', error: error.message, items: [] };
    }
    await save(receipts);
  }
  const failed = ['aihot', ...queryPlan(date).map(row => row.id)].filter(id => !receipts[id]?.ok);
  return { version: config.version, date, complete: failed.length === 0, failed, receipts,
    leads: uniqueLeads(Object.values(receipts).flatMap(row => row.items || [])) };
}
