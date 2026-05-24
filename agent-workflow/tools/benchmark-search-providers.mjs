import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, "utf8");
  for (const line of text.split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/u);
    if (!match) continue;
    const key = match[1];
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

const query = args.get("query") || "AI agents enterprise workflow automation";
const limit = Math.min(Math.max(Number(args.get("limit") || 10), 1), 20);
const reportDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const outputPath = args.get("output") || `agent-workflow/reports/${reportDate}-search-provider-quality-benchmark.md`;
const fetchTimeoutMs = Number(args.get("fetch-timeout-ms") || 20000);

const anysearchApiKey = process.env.ANYSEARCH_API_KEY || "";
const tavilyApiKey = process.env.TAVILY_API_KEY || "";
const exaApiKey = process.env.EXA_API_KEY || "";
const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || "";

function normalizeUrl(url = "") {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/u, "").toLowerCase();
  } catch {
    return String(url || "").trim().toLowerCase();
  }
}

function hostOf(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./u, "").toLowerCase();
  } catch {
    return "";
  }
}

function parseDate(value = "") {
  const date = value ? new Date(value) : null;
  return date && Number.isFinite(date.getTime()) ? date : null;
}

function normalizePublishedAt(...values) {
  for (const value of values.flat()) {
    const raw = String(value || "").trim();
    if (!raw) continue;
    const compact = raw.match(/(?:^|[^\d])(\d{4})(\d{2})(\d{2})(?:T?(\d{2})(\d{2})(\d{2})?)?/u);
    if (compact) {
      const [, year, month, day, hour = "00", minute = "00", second = "00"] = compact;
      if (!validDateParts(year, month, day)) continue;
      if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return `${year}-${month}-${day}T00:00:00Z`;
      return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
    }
    const looksLikeDate = /^\d{4}-\d{1,2}-\d{1,2}/u.test(raw)
      || /^[A-Z][a-z]{2,9}\s+\d{1,2},\s+\d{4}/u.test(raw)
      || /^\d{1,2}\s+[A-Z][a-z]{2,9}\s+\d{4}/u.test(raw);
    if (looksLikeDate) {
      const parsed = new Date(raw);
      if (Number.isFinite(parsed.getTime())) return parsed.toISOString();
    }
    const dateOnly = raw.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/u);
    if (dateOnly) {
      const [, year, month, day] = dateOnly;
      if (!validDateParts(year, month, day)) continue;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`;
    }
  }
  return "";
}

function validDateParts(year, month, day) {
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  return y >= 2000 && y <= 2099 && m >= 1 && m <= 12 && d >= 1 && d <= 31;
}

function resultText(item = {}) {
  return [item.title, item.snippet, item.summary, item.source, item.url].filter(Boolean).join(" ");
}

function isLikelyOfficialSource(item = {}) {
  const host = hostOf(item.url);
  const text = resultText(item).toLowerCase();
  if (!host) return false;
  if (/reuters\.com|bloomberg\.com|ft\.com|wsj\.com|techcrunch\.com|theinformation\.com|axios\.com|venturebeat\.com|forbes\.com|businesswire\.com|prnewswire\.com|globenewswire\.com|medium\.com|substack\.com|news\.ycombinator\.com|reddit\.com|x\.com|twitter\.com/iu.test(host)) {
    return false;
  }
  if (/\/blog\/|\/news\/|\/press|\/changelog|\/docs|\/developers|\/api|\/sdk|\/customers|\/case-stud|\/release|github\.com/iu.test(item.url || "")) {
    return true;
  }
  return /official|announced|launch|release|changelog|customer story|case study|docs|api|sdk/iu.test(text);
}

function isPotentialRawCard(item = {}) {
  const text = resultText(item);
  if (!item.url || !item.title) return false;
  if (/\/search|\/tag\/|\/tags\/|\/category\/|directory|tool directory|best ai tools|login|signup|pricing plans|jobs\/salaries|\/jobs\//iu.test(item.url)) return false;
  if (/salary distribution|job listings|glassdoor|indeed\.com|adzuna\.com|ziprecruiter|simplyhired/iu.test(text)) return false;
  if (/dictionary|translation|pronunciation|tutorial|what is html|tag-pre/iu.test(text)) return false;
  const aiAnchor = /\bAI\b|artificial intelligence|LLM|agentic|agent|copilot|OpenAI|Anthropic|Claude|Gemini|workflow automation|enterprise/iu.test(text);
  const businessAnchor = /enterprise|workflow|customer|funding|launch|release|partnership|pricing|procurement|case study|automation|operations|SaaS|startup|developer|API|platform/iu.test(text);
  return aiAnchor && businessAnchor;
}

function metricsFor(provider, status, items = [], error = "") {
  const now = Date.now();
  const uniqueUrls = new Set();
  let duplicateCount = 0;
  let datedCount = 0;
  let freshCount = 0;
  let officialCount = 0;
  let rawCardCount = 0;
  for (const item of items) {
    const key = normalizeUrl(item.url) || String(item.title || "").toLowerCase();
    if (uniqueUrls.has(key)) duplicateCount += 1;
    else uniqueUrls.add(key);
    const date = parseDate(item.published_at || item.publishedAt || item.date || "");
    if (date) {
      datedCount += 1;
      if (now - date.getTime() <= 48 * 60 * 60 * 1000) freshCount += 1;
    }
    if (isLikelyOfficialSource(item)) officialCount += 1;
    if (isPotentialRawCard(item)) rawCardCount += 1;
  }
  const count = items.length;
  const pct = (value, denominator = count) => (denominator ? Math.round((value / denominator) * 100) : 0);
  return {
    provider,
    status,
    count,
    fresh_rate: datedCount ? pct(freshCount, datedCount) : null,
    dated_count: datedCount,
    duplicate_rate: pct(duplicateCount),
    official_source_hit_rate: pct(officialCount),
    raw_card_potential_rate: pct(rawCardCount),
    error,
    examples: items.slice(0, 5).map((item) => ({
      title: item.title || "",
      url: item.url || "",
      source: item.source || "",
      published_at: item.published_at || "",
    })),
  };
}

async function postJson(url, body, headers = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(fetchTimeoutMs),
  });
  const text = await response.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (error) {
    throw new Error(`invalid JSON: ${error.message}`);
  }
  if (!response.ok) throw new Error(data?.error || data?.message || `${response.status} ${response.statusText}`);
  return data;
}

function pickArray(data = {}) {
  if (Array.isArray(data.results)) return data.results;
  if (Array.isArray(data.items)) return data.items;
  if (data.data && !Array.isArray(data.data) && Array.isArray(data.data.results)) return data.data.results;
  if (data.data && !Array.isArray(data.data) && Array.isArray(data.data.items)) return data.data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

function normalizeGeneric(item = {}, source = "") {
  return {
    title: item.title || item.name || item.headline || "",
    url: item.url || item.link || item.original_url || item.source_url || "",
    snippet: item.snippet || item.summary || item.description || item.content || item.text || "",
    source: item.source || item.source_name || item.publisher || source,
    published_at: normalizePublishedAt(
      item.published_at,
      item.publishedAt,
      item.published_date,
      item.publishedDate,
      item.datePublished,
      item.date_published,
      item.created_at,
      item.updated_at,
      item.published,
      item.date,
    ),
  };
}

async function searchAnysearch() {
  if (!anysearchApiKey) return metricsFor("Anysearch", "skipped", [], "ANYSEARCH_API_KEY is not configured");
  const data = await postJson("https://api.anysearch.com/v1/search", {
    query,
    max_results: limit,
    domains: ["tech", "business"],
    content_types: ["web", "news"],
    zone: "intl",
    language: "en",
    constraint: { freshness: "day" },
  }, { authorization: `Bearer ${anysearchApiKey}` });
  return pickArray(data).map((item) => normalizeGeneric(item, "Anysearch")).filter((item) => item.url && item.title).slice(0, limit);
}

async function searchTavily() {
  if (!tavilyApiKey) return metricsFor("Tavily", "skipped", [], "TAVILY_API_KEY is not configured");
  const data = await postJson("https://api.tavily.com/search", {
    query,
    topic: "general",
    search_depth: "basic",
    max_results: Math.min(limit, 10),
    include_answer: false,
    include_raw_content: false,
  }, { authorization: `Bearer ${tavilyApiKey}` });
  return pickArray(data).map((item) => normalizeGeneric(item, "Tavily")).filter((item) => item.url && item.title).slice(0, limit);
}

async function searchExa() {
  if (!exaApiKey) return metricsFor("Exa", "skipped", [], "EXA_API_KEY is not configured");
  const data = await postJson("https://api.exa.ai/search", {
    query,
    type: "auto",
    numResults: Math.min(limit, 10),
    contents: {
      highlights: { numSentences: 2, highlightsPerUrl: 1 },
      text: false,
    },
  }, { "x-api-key": exaApiKey });
  return pickArray(data).map((item) => {
    const highlights = Array.isArray(item.highlights) ? item.highlights.filter(Boolean).join(" ") : "";
    return normalizeGeneric({ ...item, snippet: highlights || item.text || item.summary || "" }, "Exa");
  }).filter((item) => item.url && item.title).slice(0, limit);
}

async function searchFirecrawl() {
  if (!firecrawlApiKey) return metricsFor("Firecrawl", "skipped", [], "FIRECRAWL_API_KEY is not configured");
  const data = await postJson("https://api.firecrawl.dev/v1/search", {
    query,
    limit: Math.min(limit, 10),
    scrapeOptions: { formats: ["markdown"] },
  }, { authorization: `Bearer ${firecrawlApiKey}` });
  return pickArray(data).map((item) => normalizeGeneric(item, "Firecrawl")).filter((item) => item.url && item.title).slice(0, limit);
}

async function searchAIHot() {
  const url = new URL("https://aihot.virxact.com/api/public/items");
  url.searchParams.set("mode", "all");
  url.searchParams.set("since", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
  url.searchParams.set("take", String(Math.min(Math.max(limit, 10), 100)));
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 10), 100)));
  const response = await fetch(url.toString(), {
    headers: { accept: "application/json", "user-agent": "WaveSightAI/2.1 provider-benchmark" },
    signal: AbortSignal.timeout(fetchTimeoutMs),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  if (!response.ok) throw new Error(data?.message || `${response.status} ${response.statusText}`);
  return pickArray(data).map((item) => normalizeGeneric({
    title: item.title || item.headline || item.name,
    url: item.url || item.link || item.original_url,
    snippet: item.summary || item.description || item.snippet,
    source: item.source || item.sourceName || "AI HOT",
    published_at: item.publishedAt || item.published_at || item.date,
  }, "AI HOT")).filter((item) => item.url && item.title).slice(0, limit);
}

async function collectProvider(name, fn) {
  try {
    const result = await fn();
    if (result && !Array.isArray(result) && result.status === "skipped") return result;
    return metricsFor(name, "ok", result);
  } catch (error) {
    return metricsFor(name, "error", [], error.message);
  }
}

const results = [];
results.push(await collectProvider("Anysearch", searchAnysearch));
results.push(await collectProvider("AI HOT", searchAIHot));
results.push(await collectProvider("Tavily", searchTavily));
results.push(await collectProvider("Exa", searchExa));
results.push(await collectProvider("Firecrawl", searchFirecrawl));

const lines = [
  "---",
  "title: Search Provider Quality Benchmark",
  `date: ${reportDate}`,
  "status: report",
  "owner: Intelligence Engine / Build & Release",
  "---",
  "",
  "# Search Provider Quality Benchmark",
  "",
  `Query: \`${query}\``,
  `Limit: ${limit}`,
  "",
  "All providers are evaluated only as discovery entrances. A high score here does not allow direct `core_pool` promotion without original evidence capture and Raw QC.",
  "",
  "| Provider | Status | Results | Freshness | Duplicate Rate | Official Source Hit | Raw Card Potential | Notes |",
  "|---|---|---:|---:|---:|---:|---:|---|",
  ...results.map((row) => [
    row.provider,
    row.status,
    String(row.count),
    row.fresh_rate === null ? "n/a" : `${row.fresh_rate}% (${row.dated_count} dated)`,
    `${row.duplicate_rate}%`,
    `${row.official_source_hit_rate}%`,
    `${row.raw_card_potential_rate}%`,
    row.error ? row.error.replace(/\|/gu, "/") : "",
  ].join(" | ").replace(/^/u, "| ").replace(/$/u, " |")),
  "",
  "## Examples",
  "",
];

for (const row of results) {
  lines.push(`### ${row.provider}`);
  if (row.error) lines.push(`- ${row.error}`);
  for (const example of row.examples) {
    lines.push(`- ${example.title} — ${example.url}`);
  }
  lines.push("");
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");

console.log(JSON.stringify({ outputPath, results }, null, 2));
