// Discovery only. Snippets never become source bodies or accepted Claims.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export function searchScope(query) {
  const include = [], exclude = [];
  const text = String(query).replace(/(-?)site:([a-z0-9.-]+)/giu, (_, negative, host) => {
    (negative ? exclude : include).push(host.toLowerCase());
    return " ";
  }).replace(/\bOR\s*(?=\)|$)/giu, "").replace(/\(\s*\)/gu, "").replace(/\s+/gu, " ").trim();
  return { text, include: [...new Set(include)], exclude: [...new Set(exclude)] };
}

export function canonicalSearchUrl(value) {
  try {
    const url = new URL(value);
    if (!/^https?:$/u.test(url.protocol) || url.username || url.password) return "";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) if (/^(?:utm_|fbclid$|gclid$)/iu.test(key)) url.searchParams.delete(key);
    return url.href;
  } catch { return ""; }
}

function allowed(url, scope) {
  const host = new URL(url).hostname;
  const matches = (domain) => host === domain || host.endsWith(`.${domain}`);
  return (!scope.include.length || scope.include.some(matches)) && !scope.exclude.some(matches);
}

export function providerRequest(provider, query, limit, env, options = {}) {
  const scope = searchScope(query);
  const headers = { accept: "application/json", "content-type": "application/json" };
  let endpoint, body, method = "POST";
  if (provider === "anysearch") {
    endpoint = "https://api.anysearch.com/v1/search";
    headers.authorization = `Bearer ${env.ANYSEARCH_API_KEY}`;
    // Do not force English/intl on Chinese queries or undocumented domain filters.
    body = { query, max_results: Math.min(limit, 10) };
  } else if (provider === "tavily") {
    endpoint = "https://api.tavily.com/search";
    headers.authorization = `Bearer ${env.TAVILY_API_KEY}`;
    body = { query: scope.text, max_results: Math.min(limit, 10), topic: "general", search_depth: "basic", include_answer: false, include_raw_content: false,
      ...(scope.include.length ? { include_domains: scope.include } : {}), ...(scope.exclude.length ? { exclude_domains: scope.exclude } : {}) };
  } else if (provider === "exa") {
    endpoint = "https://api.exa.ai/search";
    headers["x-api-key"] = env.EXA_API_KEY;
    body = { query: scope.text, type: "auto", numResults: Math.min(limit, 10), contents: { highlights: true },
      ...(scope.include.length ? { includeDomains: scope.include } : {}), ...(scope.exclude.length ? { excludeDomains: scope.exclude } : {}),
      ...(options.since ? { startPublishedDate: options.since } : {}) };
  } else if (provider === "brave") {
    const url = new URL("https://api.search.brave.com/res/v1/web/search");
    url.searchParams.set("q", query); url.searchParams.set("count", String(Math.min(limit, 20)));
    if (options.freshness) url.searchParams.set("freshness", options.freshness);
    headers["X-Subscription-Token"] = env.BRAVE_SEARCH_API_KEY;
    endpoint = url.href; method = "GET";
  } else throw new Error(`unsupported_search_provider:${provider}`);
  return { endpoint, init: { method, headers, ...(body ? { body: JSON.stringify(body) } : {}) } };
}

export function normalizeSearchResults(data, provider, query) {
  const rows = data.results || data.web?.results || data.data?.results || data.items || data.data?.items || (Array.isArray(data.data) ? data.data : null);
  if (!Array.isArray(rows)) throw new Error("invalid_search_response");
  const scope = searchScope(query), seen = new Set();
  return rows.map((row) => {
    const url = canonicalSearchUrl(row.url || row.link || row.original_url);
    const title = String(row.title || row.name || row.headline || "").trim();
    return { id: row.id || url, url, title, snippet: String(row.snippet || row.description || row.summary || row.content || row.highlights?.join(" ") || "").slice(0, 2000),
      published_at: row.published_at || row.publishedAt || row.publishedDate || row.published_date || row.datePublished || "",
      provider, source: typeof row.source === "string" ? row.source : `search / ${provider}`, evidence_role: "discovery_only", provider_body: "" };
  }).filter((row) => row.url && row.title && allowed(row.url, scope) && !seen.has(row.url) && seen.add(row.url));
}

export async function searchBingRss(query, limit = 8, fetcher = fetch) {
  const url = new URL("https://www.bing.com/search");
  url.searchParams.set("format", "rss"); url.searchParams.set("q", query);
  const response = await fetcher(url.href, { signal: AbortSignal.timeout(20000), headers: { accept: "application/rss+xml" } });
  if (!response.ok) throw new Error(`bing_rss_http_${response.status}`);
  const xml = await response.text();
  if (!/<rss[\s>]/iu.test(xml)) throw new Error("bing_rss_invalid_or_challenge");
  const field = (block, name) => (block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "iu"))?.[1] || "")
    .replace(/<!\[CDATA\[|\]\]>/gu, "").replace(/&amp;/gu, "&").replace(/&quot;/gu, '"').replace(/&lt;/gu, "<").replace(/&gt;/gu, ">");
  return [...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/giu)].slice(0, limit).map((match) => ({
    title: field(match[1], "title"), url: field(match[1], "link"), snippet: field(match[1], "description"), source: "Bing RSS discovery",
  }));
}

export function createSearchGateway({ env = process.env, fetcher = fetch, fallback = (query, limit) => searchBingRss(query, limit, fetcher), fallbackName = "bing_rss", cacheDir = "", now = Date.now, maxRequests = 200, timeoutMs = 20000, providers, healthFile = "", beforeRequest } = {}) {
  const keys = { anysearch: "ANYSEARCH_API_KEY", brave: "BRAVE_SEARCH_API_KEY", tavily: "TAVILY_API_KEY", exa: "EXA_API_KEY" };
  const order = providers || ["anysearch", "brave", "tavily", "exa"];
  const disabled = new Map(), attempts = [], memory = new Map(), inflight = new Map();
  let requests = 0;
  const configured = (provider) => Boolean(env[keys[provider]]) && !(provider === "tavily" && env.TAVILY_DISABLED === "true");
  const fingerprint = provider => crypto.createHash('sha256').update(env[keys[provider]] || '').digest('hex');
  const health = () => { if (!healthFile) return {}; try {return JSON.parse(fs.readFileSync(healthFile,'utf8'));} catch(error) {if(error.code==='ENOENT')return {};throw error;} };
  const unavailable = provider => {
    if (!healthFile) return disabled.has(provider);
    const row=health()[provider];
    return row?.fingerprint===fingerprint(provider) && row.until>now();
  };
  const disable = (provider, response) => {
    disabled.set(provider, `http_${response.status}`);
    if (!healthFile) return;
    const state=health(), retry=response.headers?.get('retry-after') || '';
    const delay=response.status===429 ? Math.max(60000, /^\d+$/u.test(retry)?Number(retry)*1000:Date.parse(retry)-now() || 60000) : 24*3600000;
    state[provider]={reason:`http_${response.status}`,until:now()+delay,fingerprint:fingerprint(provider)};
    fs.mkdirSync(path.dirname(healthFile),{recursive:true});
    const temp=`${healthFile}.${process.pid}.${crypto.randomUUID()}.tmp`;
    fs.writeFileSync(temp,JSON.stringify(state));fs.renameSync(temp,healthFile);
  };
  async function search(query, limit = 5, options = {}) {
    query = String(query).trim();
    if (!query) throw new Error("empty_search_query");
    limit = Math.max(1, Math.min(20, Number(limit) || 5));
    const key = crypto.createHash("sha256").update(JSON.stringify([query, limit, options, order, order.map(configured), fallbackName])).digest("hex");
    if (inflight.has(key)) return inflight.get(key);
    const operation = async () => {
      const file = cacheDir ? path.join(cacheDir, `${key}.json`) : "";
      let cached = memory.get(key);
      if (!cached && file) { try { cached = JSON.parse(fs.readFileSync(file, "utf8")); } catch {} }
      if (cached && now() - cached.at < (cached.results.length ? 6 * 3600000 : 15 * 60000)) {
        attempts.push({ provider: "cache", query, status: "cached", count: cached.results.length });
        return cached.results;
      }
      const collected = new Map(); let successes = 0, paidSuccesses = 0;
      for (const provider of order) {
        if (!configured(provider) || unavailable(provider)) continue;
        if (requests >= maxRequests) { attempts.push({ provider, query, status: "budget_exhausted" }); break; }
        beforeRequest?.({provider,query});
        requests += 1;
        try {
          const request = providerRequest(provider, query, limit, env, options);
          const response = await fetcher(request.endpoint, { ...request.init, signal: AbortSignal.timeout(timeoutMs) });
          if (!response.ok) {
            const status = response.status;
            if ([401, 402, 403, 429].includes(status)) disable(provider,response);
            attempts.push({ provider, query, status: [401,403].includes(status) ? "auth_failed" : status === 402 ? "quota_exhausted" : status === 429 ? "rate_limited" : "failed", http_status: status, retry_after: response.headers?.get("retry-after") || "" });
            continue;
          }
          const data = await response.json();
          if (data.error || (typeof data.code === "number" && data.code !== 0)) throw new Error("provider_error_payload");
          const rows = normalizeSearchResults(data, provider, query);
          successes += 1; paidSuccesses += 1;
          rows.forEach((row) => { if (!collected.has(row.url)) collected.set(row.url, row); });
          attempts.push({ provider, query, status: rows.length ? "completed" : "empty", count: rows.length });
          if (collected.size >= limit || paidSuccesses >= (options.maxSuccessfulProviders || 2)) break;
        } catch (error) {
          // Record classes, never provider bodies/headers or credentials.
          attempts.push({ provider, query, status: "failed", error: error?.name === "TimeoutError" ? "timeout" : "invalid_response_or_network" });
        }
      }
      if (collected.size < limit && fallback) {
        try {
          const rows = normalizeSearchResults({ results: await fallback(query, limit) }, fallbackName, query);
          rows.forEach((row) => { if (!collected.has(row.url)) collected.set(row.url, row); });
          successes += 1; attempts.push({ provider: fallbackName, query, status: rows.length ? "completed" : "empty", count: rows.length });
        } catch { attempts.push({ provider: fallbackName, query, status: "failed", error: "network_or_challenge" }); }
      }
      if (!successes) throw new Error(requests >= maxRequests ? "search_budget_exhausted" : "search_providers_unavailable");
      const results = [...collected.values()].slice(0, limit);
      const payload = { at: now(), results };
      memory.set(key, payload);
      if (file) {
        fs.mkdirSync(cacheDir, { recursive: true });
        const temporary = `${file}.${process.pid}.${crypto.randomUUID()}.tmp`;
        fs.writeFileSync(temporary, JSON.stringify(payload)); fs.renameSync(temporary, file);
      }
      return results;
    };
    const promise = operation().finally(() => inflight.delete(key)); inflight.set(key, promise); return promise;
  }
  return { search, attempts, status: () => ({ requests, max_requests: maxRequests, providers: order.map((id) => ({ id, configured: configured(id),
    disabled:unavailable(id) ? (healthFile ? health()[id]?.reason : disabled.get(id)) || '' : '',
    ...(healthFile && unavailable(id)?{retry_at:health()[id].until}:{}) })) }) };
}
