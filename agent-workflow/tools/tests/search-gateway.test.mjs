import test from "node:test";
import assert from "node:assert/strict";
import { createSearchGateway, providerRequest, normalizeSearchResults } from "../lib/search-gateway.mjs";
import { collectAIHotFeed, isFundingDiscovery } from "../lib/aihot-feed.mjs";
import { planFundingResearch } from "../lib/funding-research-plan.mjs";

const response = (data, status = 200) => ({ ok: status === 200, status, headers: new Headers(), json: async () => data });

test("AIHOT retains a disclosed investment commitment to an AI infrastructure company", () => {
  assert.equal(isFundingDiscovery({ title: "三星系 6 家企业向 KKR 旗下 AI 基础设施公司 Helix 合计投资 10 亿美元" }), true);
  assert.equal(isFundingDiscovery({ title: "Samsung To Invest USD 1 Billion in AI Infrastructure Company Helix" }), true);
  assert.equal(isFundingDiscovery({ title: "Samsung Commits USD 1 Billion to Helix" }), true);
  assert.equal(isFundingDiscovery({ title: "南亚科技将在屏东科学园区投资设厂" }), false);
});
test("Chinese queries retain language and domain constraints across providers", () => {
  const query = 'AI 玩具 融资 (site:36kr.com OR site:stcn.com) -site:stock.stcn.com';
  const request = providerRequest("exa", query, 8, { EXA_API_KEY: "fixture" });
  const body = JSON.parse(request.init.body);
  assert.deepEqual(body.includeDomains, ["36kr.com", "stcn.com"]);
  assert.deepEqual(body.excludeDomains, ["stock.stcn.com"]);
  assert.equal(body.query, "AI 玩具 融资");
  const any = JSON.parse(providerRequest("anysearch", query, 8, {}).init.body);
  assert.equal(any.query, query);
  assert.equal(any.language, undefined);
  const rows = normalizeSearchResults({ results: [
    { title: "融资", url: "https://www.36kr.com/p/1?utm_source=a", content: "not evidence" },
    { title: "融资", url: "https://www.36kr.com/p/1" },
    { title: "融资", url: "https://stock.stcn.com/p/1" },
    { title: "融资", url: "https://evil36kr.com/p/1" },
  ] }, "exa", query);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].provider_body, "");
  assert.equal(rows[0].evidence_role, "discovery_only");
});

test("quota failure opens circuit, fallback results are cached and identical concurrent queries share work", async () => {
  let requests = 0, fallbacks = 0;
  const gateway = createSearchGateway({ env: { EXA_API_KEY: "fixture" }, providers: ["exa"],
    fetcher: async () => { requests++; return response({}, 402); },
    fallback: async (query) => { fallbacks++; return [{ title: query, url: "https://example.com/" + encodeURIComponent(query) }]; },
  });
  const [a, b] = await Promise.all([gateway.search("A融资", 1), gateway.search("A融资", 1)]);
  assert.deepEqual(a, b);
  await gateway.search("A融资", 1);
  await gateway.search("B融资", 1);
  assert.equal(requests, 1);
  assert.equal(fallbacks, 2);
  assert.equal(gateway.status().providers[0].disabled, "http_402");
});

test("invalid responses and unavailable providers cannot masquerade as zero financing", async () => {
  const gateway = createSearchGateway({ env: { EXA_API_KEY: "fixture" }, providers: ["exa"], fallback: null,
    fetcher: async () => response({ message: "upstream failure" }) });
  await assert.rejects(gateway.search("funding"), /search_providers_unavailable/u);
  const empty = createSearchGateway({ env: {}, providers: [], fallback: async () => [] });
  assert.deepEqual(await empty.search("funding"), []);
  assert.equal(empty.attempts[0].status, "empty");
});

test("AIHOT reads beyond the old 500 limit, including unselected funding, before filtering", async () => {
  let page = 0;
  const result = await collectAIHotFeed({ fetcher: async (url) => {
    const parsed = new URL(url);
    assert.equal(parsed.searchParams.get("mode"), "all");
    assert.equal(parsed.searchParams.get("limit"), "100");
    assert.equal(parsed.searchParams.has("since"), false);
    page++;
    return response({ schemaVersion: 1, items: Array.from({ length: 100 }, (_, i) => ({
      id: `${page}-${i}`, title: page === 6 && i === 99 ? "AI玩具完成融资" : "发布新产品", selected: false,
      originalTitle: page === 6 && i === 99 ? "Companion raises Series A" : "product release",
      links: { original: `https://example.com/${page}/${i}` },
    })), page: { hasMore: page < 6, nextCursor: page < 6 ? `c${page}` : null } });
  } });
  assert.equal(result.complete, true);
  assert.equal(result.discovered_count, 600);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].title, "Companion raises Series A");
  assert.equal(result.items[0].evidence_role, "discovery_only");
});

test("AIHOT cursor stalls and page caps remain incomplete", async () => {
  const fetcher = async () => response({ schemaVersion: 1, items: [{ id: "same", title: "AI" }], page: { hasMore: true, nextCursor: "repeat" } });
  const stalled = await collectAIHotFeed({ fetcher });
  assert.equal(stalled.complete, false);
  assert.match(stalled.failures[0], /cursor_stalled/u);
  const capped = await collectAIHotFeed({ fetcher, maxPages: 1 });
  assert.equal(capped.complete, false);
  assert.match(capped.failures[0], /page_budget/u);
});

test("secondary research starts with identity, includes aliases, and does not require a known amount", () => {
  const plan = planFundingResearch({ company: { canonical_name: "小伴科技有限公司", aliases: ["小伴AI"] },
    chinese: true, event: { disclosed_at: "2026-10-01" } });
  assert.equal(plan.length, 6);
  assert.match(plan[0].query, /2026 融资/u);
  assert.ok(plan.some((row) => row.query.includes('"小伴"')));
  assert.ok(plan.every((row) => !/undefined|null|""/u.test(row.query)));
  assert.throws(() => planFundingResearch({ company: {} }), /identity_required/u);
});
