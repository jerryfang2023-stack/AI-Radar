#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createSearchGateway, searchBingRss } from "./lib/search-gateway.mjs";
const args = new Map(process.argv.slice(2).map((v) => { const [k,...r] = v.replace(/^--/u, "").split("="); return [k,r.join("=")]; }));
if (args.get("env-file")) process.loadEnvFile(path.resolve(args.get("env-file")));
const rows = [], query = args.get("query") || '"Armadin" funding investors';
for (const provider of ["anysearch", "brave", "tavily", "exa"]) {
  const gateway = createSearchGateway({ providers: [provider], fallback: null, maxRequests: 1 });
  const state = gateway.status().providers[0];
  if (!state.configured || args.get("live") !== "true") { rows.push({ ...state, live_tested: false }); continue; }
  try { const results = await gateway.search(query, 3); rows.push({ ...state, live_tested: true, status: results.length ? "available" : "empty", count: results.length, attempts: gateway.attempts }); }
  catch { rows.push({ ...state, live_tested: true, status: "unavailable", attempts: gateway.attempts }); }
}
if (args.get("live") === "true") {
  try { const items = await searchBingRss(query); rows.push({ id: "bing_rss", live_tested: true, status: items.length ? "available" : "empty", count: items.length }); }
  catch { rows.push({ id: "bing_rss", live_tested: true, status: "unavailable" }); }
}
const report = { tested_at: new Date().toISOString(), query, providers: rows, credentials_disclosed: false };
if (args.get("output")) { const file = path.resolve(args.get("output")); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(report, null, 2)); }
console.log(JSON.stringify(report, null, 2));
