#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { historyWindows } from "./collect-china-funding-history.mjs";

const plain = (text) => String(text || "").replace(/<[^>]*>/gu, " ").replace(/&nbsp;|&#160;/gu, " ").replace(/&amp;/gu, "&").replace(/\s+/gu, " ").trim();
const key = (value) => crypto.createHash("sha256").update(value).digest("hex").slice(0, 20);
const write = (file, data) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n"); };
export function investmentRows(html, url) {
  const list = String(html).split('id="invest-list"')[1]?.split('class="page')[0] || "";
  return list.split(/<div class="item">/u).slice(1).map((row) => {
    const date = row.match(/class="d">(\d{4}-\d{2}-\d{2})</u)?.[1];
    const company = row.match(/<h3><a href="([^"]+)"[^>]*>([^<]+)<\/a>/u);
    const terms = row.match(/class="t"><span>(.*?)<\/span><span>(.*?)<\/span>/u);
    if (!date || !company || !terms) throw new Error("investment_index_row_schema_changed");
    return { case_id: `CNH-${key(`${company[1]}|${date}|${plain(terms[1])}`)}`, company_hint: plain(company[2]), company_url: company[1], date_hint: date,
      round_hint: plain(terms[1]), amount_hint: plain(terms[2]), index_url: url, status: "discovered", original_candidates: [],
      evidence_status: "discovery_only_not_canonical" };
  });
}
export function relatedArticles(html) {
  const found = [];
  const visit = (node) => {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node || typeof node !== "object") return;
    if (node["@type"] === "NewsArticle" && /^https:\/\/news\.pedaily\.cn\/\d{6}\//u.test(node.url || "")) found.push({ url: node.url, title: node.headline || "", date_hint: node.datePublished || "" });
    Object.values(node).forEach(visit);
  };
  for (const block of String(html).matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu)) {
    try { visit(JSON.parse(block[1])); } catch { /* Visible links remain discovery fallback. */ }
  }
  for (const m of String(html).matchAll(/<a\b[^>]*href="(https:\/\/news\.pedaily\.cn\/\d{6}\/\d+\.shtml)"[^>]*>([\s\S]*?)<\/a>/gu)) {
    const title = plain(m[2]);
    if (title && /融资|获投|投资/u.test(title) && !found.some((item) => item.url === m[1])) found.push({ url: m[1], title, date_hint: "" });
  }
  return [...new Map(found.map((item) => [item.url, item])).values()];
}
async function page(url) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (compatible; WaveSightFunding/1.0)" }, signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}
export async function collectIndex({ root, from, to, date, fetchPage = page, maxPages = 100, concurrency = 3 }) {
  const windows = historyWindows(from, to, date);
  const lane = path.join(root, "agent-workflow/reports/china-funding-history", `${from}_${to}`);
  const pages = [], rows = [];
  let boundary = false;
  for (let number = 1; number <= maxPages; number++) {
    const url = `https://vc.pedaily.cn/invest/f2760-p${number}`;
    const file = path.join(lane, "index-pages", `pedaily-ai-${number}.json`);
    let result = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
    if (result?.status !== "collected") {
      result = { url, page: number, fetched_at: new Date().toISOString() };
      try { result.rows = investmentRows(await fetchPage(url), url); if (!result.rows.length) throw new Error("empty_index_page"); result.status = "collected"; }
      catch (error) { result.status = "failed"; result.error = error.message; }
      write(file, result);
    }
    pages.push({ url, page: number, status: result.status, rows: result.rows?.length || 0, error: result.error || "" });
    if (result.status !== "collected") break;
    rows.push(...result.rows.filter((row) => row.date_hint >= from && row.date_hint <= to));
    console.log(`pedaily index ${number}: ${result.rows.length}, ${result.rows.at(-1).date_hint}`);
    if (result.rows.some((row) => row.date_hint < from)) { boundary = true; break; }
  }
  const cases = [...new Map(rows.map((row) => [row.case_id, row])).values()];
  const companies = [...new Set(cases.map((row) => row.company_url))];
  let cursor = 0;
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < companies.length) {
      const url = companies[cursor++];
      const file = path.join(lane, "company-discovery", `${key(url)}.json`);
      let result = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
      if (result?.status !== "collected") {
        result = { url, fetched_at: new Date().toISOString(), articles: [] };
        try { result.articles = relatedArticles(await fetchPage(url)); result.status = "collected"; }
        catch (error) { result.status = "failed"; result.error = error.message; }
        write(file, result);
      }
      for (const row of cases.filter((item) => item.company_url === url)) {
        row.original_candidates = result.articles.filter((article) => (article.date_hint || article.url.match(/\/(\d{6})\//u)?.[1]?.replace(/^(\d{4})(\d{2})$/u, "$1-$2") || "").startsWith(row.date_hint.slice(0, 7)));
        row.discovery_status = result.status;
        row.discovery_error = result.error || "";
      }
    }
  }));
  const output = { schema_version: "CHINA-FUNDING-SYSTEMATIC-LEDGER-V1.0", from, to, collection_date: date, generated_at: new Date().toISOString(),
    scope: "AI-labelled investment index is a discovery census, not proof of China geography or completed financing. Cross-source and original verification required.",
    index: { source: "pedaily_ai", pages, historical_boundary_reached: boundary },
    months: windows.map((window) => ({ ...window, discovered_cases: cases.filter((row) => row.date_hint.startsWith(window.month)).length })), cases };
  write(path.join(lane, "systematic-ledger.json"), output);
  console.log(JSON.stringify({ cases: cases.length, companies: companies.length, with_candidates: cases.filter((row) => row.original_candidates.length).length, boundary }));
  return output;
}
if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  const args = new Map(process.argv.slice(2).map((arg) => arg.replace(/^--/u, "").split("=")));
  const date = args.get("date") || new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(new Date());
  await collectIndex({ root: process.cwd(), from: args.get("from") || "2026-01-01", to: args.get("to") || date, date });
}
