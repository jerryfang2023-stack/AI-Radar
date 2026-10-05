import { canonicalSearchUrl } from "./search-gateway.mjs";

export function isFundingDiscovery(item) {
  const title = `${item.title || ""} ${item.originalTitle || ""}`;
  const text = `${title} ${item.summary || ""}`;
  if (/融资融券|融资余额|融资买入|基金.{0,10}(?:募资|募集)|(?:fund|funds)\s+(?:closes|raises)\b/iu.test(title)) return false;
  // High recall discovery: uncertain/rumored rounds remain leads for the original-source gate.
  return /融资|获投|领投|跟投|投资.{0,18}(?:公司|创业)|(?:向|对).{0,80}(?:公司|企业).{0,30}(?:投资|注资)|\b(?:funding|fundraise|fundraising|raised|raises|series\s+[a-z]|seed\s+round|investing\s+in|investment\s+in)\b|\binvest(?:s|ed|ing)?\b.{0,100}\b(?:million|billion|USD)\b.{0,40}\bin\b|\bcommits?\b.{0,50}\b(?:million|billion|USD)\b.{0,50}\bto\b/iu.test(text);
}

export function aihotCandidate(item) {
  const url = canonicalSearchUrl(item.links?.original || item.url);
  if (!url || !item.id || !item.title) return null;
  return { acquisition_channel: "aihot", aihot_lane: "all", original_id: item.id, url,
    title: item.originalTitle || item.title, summary: item.summary || "", published_at: item.publishedAt || "",
    source: item.source?.name || "AIHOT", category: "funding", query_theme: "important_funding", keyword_group: "important_funding",
    discovery_source: "AIHOT", discovery_url: item.links?.aihot || "", discovery_title: item.title,
    discovery_record: { discovery_title: item.title, discovery_summary: item.summary || "", origin_url: url, source_name: item.source?.name || "AIHOT", discovery_status: "discovered", discovered_at: item.discoveredAt || "" },
    evidence_role: "discovery_only", raw_entry_decision: "raw_candidate", raw_entry_reason: "funding_discovery_original_required" };
}

export async function collectAIHotFeed({ fetcher = fetch, baseUrl = "https://aihot.news", window = "7d", maxPages = 100, timeoutMs = 20000, onPage = () => {} } = {}) {
  if (!["24h", "7d"].includes(window)) throw new Error("unsupported_aihot_window");
  const items = [], failures = [], seen = new Set(), cursors = new Set();
  let cursor = "", pages = 0, discovered = 0, duplicates = 0, complete = false;
  for (; pages < maxPages;) {
    const url = new URL("/api/v1/items", baseUrl);
    for (const [key, value] of Object.entries({ mode: "all", window, by: "timeline", limit: "100", ...(cursor ? { cursor } : {}) })) url.searchParams.set(key, value);
    try {
      const response = await fetcher(url.href, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(timeoutMs) });
      if (!response.ok) throw new Error(`http_${response.status}`);
      const data = await response.json();
      if (data.schemaVersion !== 1 || !Array.isArray(data.items) || typeof data.page?.hasMore !== "boolean") throw new Error("invalid_aihot_contract");
      pages += 1;
      await onPage({ page: pages, items: data.items, next_cursor: data.page.nextCursor, fetched_at: new Date().toISOString() });
      for (const item of data.items) {
        if (!item.id) throw new Error("missing_aihot_item_id");
        if (seen.has(item.id)) { duplicates += 1; continue; }
        seen.add(item.id); discovered += 1;
        if (isFundingDiscovery(item)) { const candidate = aihotCandidate(item); if (candidate) items.push(candidate); }
      }
      if (!data.page.hasMore) { complete = true; break; }
      const next = data.page.nextCursor;
      if (!next || cursors.has(next) || !data.items.length) throw new Error("aihot_cursor_stalled");
      cursors.add(next); cursor = next;
    } catch (error) { failures.push(`AIHOT:${error.message}`); break; }
  }
  if (!complete && !failures.length) failures.push("AIHOT:page_budget_exhausted_incomplete");
  return { items, failures, complete, pages, duplicates, discovered_count: discovered, discovered_count_all: discovered,
    discovered_count_daily: 0, included_count_daily: 0, rejected_count: discovered - items.length,
    mode: "all", window, since: "", next_cursor: complete ? null : cursor, history_limit: "public rolling window; not all-time archive" };
}
