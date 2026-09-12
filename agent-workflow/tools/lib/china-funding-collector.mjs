import fs from "node:fs";
import path from "node:path";

export const CHINA_FUNDING_CONFIG = "01-SiteV2/content/11-databases/china-funding-monitor-v1.json";
export const fundingPattern = /融资|获投|获.{0,8}投资|完成.{0,10}轮|\b(?:funding|raised|raises|series [a-z])\b/iu;
const noisePattern = /投?融资(?:周报|月报|日报|盘点)|融资融券|融资买入|融资余额|融券|基金.{0,12}(?:募资|募集|首关)|(?:母基金|子基金).{0,12}(?:设立|遴选|招募)/u;

export function articleUrl(value, domains) {
  try {
    const url = new URL(value);
    if (!/^https?:$/u.test(url.protocol) || !domains.some((domain) => url.hostname === domain || url.hostname.endsWith(`.${domain}`))) return "";
    if (/\/(?:user|users|author|tag|topic|search|category)\//iu.test(url.pathname)) return "";
    if (!/\/(?:p|news|article|first|detail|post|posts|a)\/|\/\d{4}\/|\/\d{5,}/u.test(url.pathname)) return "";
    if (/\/(?:news|article)\/(?:f\d+|index|list)\/?$/u.test(url.pathname)) return "";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) if (/^(?:utm_|from|spm|ref)/iu.test(key)) url.searchParams.delete(key);
    return url.href;
  } catch { return ""; }
}

export function normalizeChinaFundingLead(item, source) {
  const url = articleUrl(item.url, source.domains);
  const title = String(item.title || "").trim().slice(0, 300);
  const summary = String(item.snippet || item.summary || "").slice(0, 500);
  if (!url || title.length < 6 || !fundingPattern.test(`${title} ${summary}`) || noisePattern.test(title)) return null;
  return {
    acquisition_channel: "china-funding", original_id: url, url, title, summary,
    source: source.name, source_region: "CN", source_registry_id: source.registry_id,
    published_at: item.published_at || item.publishedAt || "",
    category: "funding", query_theme: "china-funding-independent", keyword_group: "important_funding",
    // Source geography routes capture; company geography is derived from original evidence later.
  };
}

export function listPageLeads(html, entry, source) {
  const items = [];
  for (const match of String(html).matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/giu)) {
    const title = match[2].replace(/<[^>]+>/gu, " ").replace(/&nbsp;|&#160;/gu, " ").replace(/&amp;/gu, "&").replace(/\s+/gu, " ").trim();
    let url;
    try { url = new URL(match[1].replace(/&amp;/gu, "&"), entry).href; } catch { continue; }
    const item = normalizeChinaFundingLead({ url, title }, source);
    if (item) items.push(item);
  }
  return items;
}

export async function collectChinaFunding({ root, date, search, fetcher = fetch, now = () => new Date().toISOString() }) {
  const config = JSON.parse(fs.readFileSync(path.join(root, CHINA_FUNDING_CONFIG), "utf8"));
  const items = [], diagnostics = [], failures = [];
  // Each publisher owns a budget: no global first-N query truncation.
  for (const source of config.sources.filter((source) => source.enabled !== false)) {
    const started = Date.now();
    const row = { source_id: source.id, registry_id: source.registry_id, name: source.name, attempted_at: now(), query_count: 0, successful_queries: 0, list_pages_ok: 0, candidates: 0, failures: [], entry_urls: source.entry_urls };
    const found = [];
    for (const entry of source.entry_urls) {
      try {
        const response = await fetcher(entry, { signal: AbortSignal.timeout(config.timeout_ms), headers: { "User-Agent": "Mozilla/5.0 (compatible; WaveSightFunding/1.0)", Accept: "text/html" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const body = await response.text();
        const leads = listPageLeads(body, entry, source);
        if (!leads.length) throw new Error("no readable funding article links");
        row.list_pages_ok += 1;
        found.push(...leads.slice(0, config.per_source_limit));
      } catch (error) { row.failures.push(`list ${entry}: ${error.message}`); }
    }
    for (const terms of config.query_terms) {
      row.query_count += 1;
      const query = `site:${source.domains[0]} ${terms} ${date.slice(0, 7)}`;
      try {
        const results = await search(query, config.results_per_query);
        row.successful_queries += 1;
        for (const result of results) {
          const lead = normalizeChinaFundingLead(result, source);
          if (lead) found.push(lead);
        }
      } catch (error) { row.failures.push(`search ${query}: ${error.message}`); }
    }
    const unique = [...new Map(found.map((item) => [item.url, item])).values()];
    row.discovered = unique.length;
    row.candidates = Math.min(unique.length, config.per_source_limit);
    row.capped = Math.max(0, unique.length - row.candidates);
    row.status = row.successful_queries === 0 && row.list_pages_ok === 0 ? "failed" : row.failures.length ? "partial" : unique.length ? "collected" : "empty";
    row.response_ms = Date.now() - started;
    row.completed_at = now();
    diagnostics.push(row);
    items.push(...unique.slice(0, config.per_source_limit));
    failures.push(...row.failures.map((message) => `${source.id}: ${message}`));
  }
  return { items: [...new Map(items.map((item) => [item.url, item])).values()], failures, diagnostics };
}
