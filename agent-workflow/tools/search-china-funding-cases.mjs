#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { historicalSearch } from "./collect-china-funding-history.mjs";
import { CHINA_FUNDING_CONFIG, normalizeChinaFundingLead } from "./lib/china-funding-collector.mjs";

const args = new Map(process.argv.slice(2).map((arg) => arg.replace(/^--/u, "").split("=")));
const root = process.cwd();
const provider = args.get("provider") || "anysearch";
async function search(query) {
  if (provider === "anysearch") return historicalSearch(query, 10);
  if (provider !== "exa" || !process.env.EXA_API_KEY) throw new Error("Configured discovery provider unavailable");
  const response = await fetch("https://api.exa.ai/search", { method: "POST", headers: { "x-api-key": process.env.EXA_API_KEY, "content-type": "application/json" }, body: JSON.stringify({ query, type: "auto", numResults: 8 }), signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`Exa HTTP ${response.status}`);
  return ((await response.json()).results || []).map((item) => ({ url: item.url, title: item.title || "", snippet: "" }));
}
const lane = path.resolve(root, args.get("lane") || "agent-workflow/reports/china-funding-history/2026-01-01_2026-09-12");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const write = (file, data) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n"); };
const ledger = read(path.join(lane, "systematic-ledger.json"));
const discoveryFile = path.join(lane, "china-funding-source-intake-candidates.json");
const discovery = read(discoveryFile);
const sources = read(path.join(root, CHINA_FUNDING_CONFIG)).sources;
const allLeads = new Map(discovery.items.map((item) => [item.url, item]));
const normalize = (article) => {
  let hostname; try { hostname = new URL(article.url).hostname; } catch { return null; }
  const source = sources.find((s) => s.domains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`)));
  return source ? normalizeChinaFundingLead({ ...article, published_at: "" }, source) : null;
};
for (const row of ledger.cases) for (const article of row.original_candidates) {
  const lead = normalize(article); if (lead) allLeads.set(lead.url, { ...lead, discovery_month: row.date_hint.slice(0, 7) });
}
const jobs = ledger.cases.flatMap((row) => [
  `${row.company_hint} ${row.round_hint} 融资 ${row.date_hint.slice(0, 7)} 投资方`,
  ...(!row.original_candidates.length ? [`${row.company_hint} 2026年 融资 ${row.amount_hint}`] : []),
].map((query) => ({ row, query })));
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < jobs.length) {
    const { row, query } = jobs[cursor++];
    const hash = crypto.createHash("sha256").update(query).digest("hex").slice(0, 20);
    const file = path.join(lane, "case-searches", `${hash}.json`);
    let result = fs.existsSync(file) ? read(file) : null;
    if (result?.status !== "collected") {
      const previousAttempt = result ? { provider: result.provider || "anysearch", attempted_at: result.attempted_at, status: result.status, error: result.error || "" } : null;
      result = { case_id: row.case_id, query, provider, attempted_at: new Date().toISOString(), prior_attempts: [...(result?.prior_attempts || []), ...(previousAttempt ? [previousAttempt] : [])], purpose: "original_announcement_and_missing_financing_fields", items: [] };
      try { result.items = (await search(query)).map((item) => ({ ...item, snippet: item.snippet.slice(0, 500) })); result.status = "collected"; }
      catch (error) { result.status = "failed"; result.error = error.message; }
      write(file, result);
    }
    row.secondary_searches ||= [];
    row.secondary_searches = [...row.secondary_searches.filter((item) => item.query !== query), { query, provider: result.provider || "anysearch", status: result.status, checkpoint: path.relative(root, file).replaceAll("\\", "/") }];
    for (const article of result.items) {
      const lead = normalize(article);
      if (!lead) continue;
      allLeads.set(lead.url, { ...lead, discovery_month: row.date_hint.slice(0, 7) });
      if (!row.original_candidates.some((item) => item.url === lead.url)) row.original_candidates.push({ url: lead.url, title: lead.title, date_hint: "", discovery: "targeted_secondary_search" });
    }
    if (cursor % 20 === 0) console.log(`case searches ${cursor}/${jobs.length}, cumulative URLs ${allLeads.size}`);
  }
}));
discovery.items = [...allLeads.values()];
discovery.source_item_count = discovery.discovered_count = discovery.items.length;
discovery.generated_at = new Date().toISOString();
for (const source of discovery.diagnostics) source.candidates = discovery.items.filter((item) => item.source_registry_id === source.registry_id).length;
write(discoveryFile, discovery);
write(path.join(lane, "systematic-ledger.json"), ledger);
console.log(JSON.stringify({ searches: jobs.length, cases: ledger.cases.length, urls: discovery.items.length, without_original_candidates: ledger.cases.filter((row) => !row.original_candidates.length).length }));
