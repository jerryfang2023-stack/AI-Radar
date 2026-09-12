#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { CHINA_FUNDING_CONFIG, normalizeChinaFundingLead } from "./lib/china-funding-collector.mjs";

export function historyWindows(from, to, today) {
  const valid = (value) => /^\d{4}-\d{2}-\d{2}$/u.test(value || "") && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  if (!valid(from) || !valid(to) || from > to || to > today) throw new Error("Invalid historical date range");
  const windows = [];
  let cursor = from;
  while (cursor <= to) {
    const month = cursor.slice(0, 7);
    const next = new Date(`${month}-01T00:00:00Z`);
    next.setUTCMonth(next.getUTCMonth() + 1);
    const end = new Date(next.getTime() - 86400000).toISOString().slice(0, 10);
    windows.push({ month, from: cursor, to: end < to ? end : to });
    cursor = next.toISOString().slice(0, 10);
  }
  return windows;
}

export async function historicalSearch(query, limit, fetcher = fetch, env = process.env) {
  if (!env.ANYSEARCH_API_KEY) throw new Error("ANYSEARCH_API_KEY is not configured");
  // Domestic discovery must not inherit the overseas English/intl filters.
  const response = await fetcher("https://api.anysearch.com/v1/search", {
    method: "POST", headers: { authorization: `Bearer ${env.ANYSEARCH_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ query, max_results: Math.min(limit, 10) }), signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`Anysearch HTTP ${response.status}`);
  const payload = await response.json();
  if (typeof payload.code === "number" && payload.code !== 0) throw new Error(`Anysearch error code ${payload.code}`);
  const results = payload.results || payload.items || payload.data?.results || payload.data?.items || (Array.isArray(payload.data) ? payload.data : []);
  if (!Array.isArray(results)) throw new Error("Anysearch results are not an array");
  return results.map((item) => ({ url: item.url || item.link || "", title: item.title || item.name || "", snippet: item.snippet || item.summary || item.description || "" }));
}

export async function collectHistory({ root, from, to, date, search = historicalSearch, concurrency = 3 }) {
  const windows = historyWindows(from, to, date);
  const config = JSON.parse(fs.readFileSync(path.join(root, CHINA_FUNDING_CONFIG), "utf8"));
  const lane = path.join(root, "agent-workflow/reports/china-funding-history", `${from}_${to}`);
  const write = (file, data) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n"); };
  const jobs = windows.flatMap((window) => config.sources.filter((source) => source.enabled !== false).flatMap((source) => [...config.query_terms, "AI 人工智能 融资", "具身智能 机器人 融资"].map((terms, index) => {
    const next = new Date(`${window.to}T00:00:00Z`); next.setUTCDate(next.getUTCDate() + 1);
    const query = index < config.query_terms.length
      ? `site:${source.domains[0]} ${terms} ${window.month.replace("-", "年")}月 after:${window.from} before:${next.toISOString().slice(0, 10)}`
      : `site:${source.id === "pedaily" ? `news.pedaily.cn/${window.month.replace("-", "")}/` : source.domains[0]} ${window.month.slice(0, 4)}年${Number(window.month.slice(5))}月 ${terms}`;
    return { window, source, query, index, key: crypto.createHash("sha256").update(query).digest("hex").slice(0, 16) };
  })));
  const plan = { schema_version: "CHINA-FUNDING-HISTORY-V1.0", from, to, collection_date: date, windows, query_count: jobs.length,
    models: { orchestration: "gpt-6-astra", orchestration_scope: "configuration_and_exceptions_only", orchestration_reasoning: "high", claim_extraction: "deepseek-v4-flash", claim_extraction_retry: "deepseek-v4-flash", translation: "deepseek-v4-flash", translation_fallback: "deepseek-v4-pro" },
    scope_note: "China-market AI financing; publisher origin and search dates are discovery hints only. Original evidence decides factual date and market.",
  };
  write(path.join(lane, "plan.json"), plan);
  const rows = [];
  let cursor = 0;
  const worker = async () => {
    while (cursor < jobs.length) {
      const job = jobs[cursor++];
      const checkpoint = path.join(lane, "queries", `${job.key}.json`);
      if (fs.existsSync(checkpoint)) { rows.push(JSON.parse(fs.readFileSync(checkpoint, "utf8"))); continue; }
      const row = { key: job.key, month: job.window.month, source_id: job.source.id, registry_id: job.source.registry_id, name: job.source.name, query: job.query, attempted_at: new Date().toISOString(), items: [] };
      try {
        const results = await search(job.query, config.results_per_query);
        row.items = results.map((item) => normalizeChinaFundingLead(item, job.source)).filter(Boolean)
          .map((item) => ({ ...item, published_at: "", discovery_month: job.window.month, query_theme: "china-funding-history" }));
        row.status = row.items.length ? "collected" : "empty";
        row.result_count = results.length;
      } catch (error) { row.status = "failed"; row.error = error.message; }
      row.completed_at = new Date().toISOString();
      write(checkpoint, row); rows.push(row);
      console.log(`${row.month} ${row.source_id} ${row.status} ${row.items.length}`);
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  rows.sort((a, b) => a.month.localeCompare(b.month) || a.source_id.localeCompare(b.source_id) || a.key.localeCompare(b.key));
  const items = [...new Map(rows.flatMap((row) => row.items).map((item) => [item.url, item])).values()];
  const diagnostics = config.sources.filter((source) => source.enabled !== false).map((source) => {
    const entries = rows.filter((row) => row.source_id === source.id);
    const failures = entries.filter((row) => row.status === "failed").map((row) => `${row.month}: ${row.error}`);
    return { source_id: source.id, registry_id: source.registry_id, name: source.name, query_count: entries.length, successful_queries: entries.length - failures.length,
      candidates: new Set(entries.flatMap((row) => row.items).map((item) => item.url)).size, failures, status: failures.length === entries.length ? "failed" : failures.length ? "partial" : "collected" };
  });
  const artifact = { date, generated_at: new Date().toISOString(), mode: "data_center_source_intake", source_id: "china-funding", source_label: "2026 国内融资历史补采", history: plan,
    status: rows.some((row) => row.status === "failed") ? "partial" : "collected", source_item_count: items.length, discovered_count: items.length,
    failures: rows.filter((row) => row.status === "failed").map((row) => `${row.query}: ${row.error}`), diagnostics, items };
  write(path.join(lane, "china-funding-source-intake-candidates.json"), artifact);
  write(path.join(lane, "coverage.json"), { ...plan, status: artifact.status, unique_candidates: items.length, completed_queries: rows.length,
    failed_queries: artifact.failures.length, months: windows.map((window) => ({ ...window, queries: rows.filter((row) => row.month === window.month).length,
      candidates: new Set(rows.filter((row) => row.month === window.month).flatMap((row) => row.items).map((item) => item.url)).size })) });
  console.log(JSON.stringify({ lane, status: artifact.status, queries: rows.length, failed_queries: artifact.failures.length, candidates: items.length }));
  return artifact;
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const args = new Map(process.argv.slice(2).map((arg) => arg.replace(/^--/u, "").split("=")));
  const date = args.get("date") || new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
  await collectHistory({ root: process.cwd(), from: args.get("from") || "2026-01-01", to: args.get("to") || date, date });
}
