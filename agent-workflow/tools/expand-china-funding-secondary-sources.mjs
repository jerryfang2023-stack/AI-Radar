#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const lane = path.join(root, "agent-workflow/reports/china-funding-history/2026-01-01_2026-09-12");
const read = (name) => JSON.parse(fs.readFileSync(path.join(lane, name), "utf8"));
const write = (name, value) => fs.writeFileSync(path.join(lane, name), JSON.stringify(value, null, 2) + "\n");
const ledger = read("systematic-ledger.json");
const discovery = read("china-funding-source-intake-candidates.json");
// Supplemental original-report publishers; directories and database records stay leads.
const publishers = [
  ["sina.com.cn", "新浪财经", "cn-sina-finance"], ["leiphone.com", "雷峰网", ""], ["donews.com", "DoNews", ""],
  ["nbd.com.cn", "每日经济新闻", ""], ["chinastarmarket.cn", "科创板日报", "cn-cls"], ["china.com", "中华网", ""],
  ["sohu.com", "搜狐", ""], ["stockstar.com", "证券之星", ""], ["tmtpost.com", "钛媒体", ""],
  ["stcn.com", "证券时报", ""], ["jiemian.com", "界面新闻", ""], ["dify.ai", "Dify 官方", ""],
];
const norm = (value) => String(value).toLowerCase().replace(/\.ai$/u, "").replace(/[\s.（）()]/gu, "");
const leads = new Map(discovery.items.map((item) => [item.url, item]));
let added = 0;
for (const row of ledger.cases) {
  const found = [];
  for (const attempt of row.secondary_searches || []) {
    const file = path.resolve(root, attempt.checkpoint);
    if (!fs.existsSync(file)) continue;
    for (const article of JSON.parse(fs.readFileSync(file, "utf8")).items || []) {
      let url; try { url = new URL(article.url); } catch { continue; }
      const source = publishers.find(([host]) => url.hostname === host || url.hostname.endsWith(`.${host}`));
      if (!source || !/^https?:$/u.test(url.protocol) || !norm(article.title).includes(norm(row.company_hint)) || !/融资|获投|投资|raises?|funding/iu.test(article.title)) continue;
      if (!/\.s?html?$|\/a\/\d|\/detail\/\d|\/blog\/[^/]+$/u.test(url.pathname)) continue;
      if (/周报|月报|盘点|竞品|股价|融资融券/u.test(article.title)) continue;
      found.push({ article, source });
    }
  }
  for (const { article, source } of [...new Map(found.map((entry) => [entry.article.url, entry])).values()].slice(0, 2)) {
    if (!leads.has(article.url)) {
      leads.set(article.url, { acquisition_channel: "china-funding", original_id: article.url, url: article.url, title: article.title,
        summary: "", source: source[1], source_region: "CN", source_registry_id: source[2], published_at: "", category: "funding", query_theme: "china-funding-secondary-original", keyword_group: "important_funding", discovery_month: row.date_hint.slice(0, 7) });
      added++;
    }
    if (!row.original_candidates.some((item) => item.url === article.url)) row.original_candidates.push({ url: article.url, title: article.title, date_hint: "", discovery: "secondary_publisher_original" });
  }
}
discovery.items = [...leads.values()];
discovery.source_item_count = discovery.discovered_count = discovery.items.length;
for (const [host, name, registry] of publishers) {
  const count = discovery.items.filter((item) => item.source === name).length;
  if (!count || discovery.diagnostics.some((item) => item.name === name || (registry && item.registry_id === registry))) continue;
  discovery.diagnostics.push({ source_id: `secondary-${host}`, registry_id: registry, name, query_count: 0, successful_queries: 0, candidates: count, failures: [], status: "collected", discovery_method: "reuse_completed_case_searches" });
}
write("systematic-ledger.json", ledger);
write("china-funding-source-intake-candidates.json", discovery);
console.log(JSON.stringify({ new_secondary_original_urls: added, cumulative_urls: discovery.items.length, cases_without_original_candidates: ledger.cases.filter((row) => !row.original_candidates.length).length }));
