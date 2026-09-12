import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { investmentRows, relatedArticles, collectIndex } from "../collect-china-funding-index.mjs";
import { chinaFundingArticleHtml } from "../lib/china-funding-html.mjs";
import { uncapturedChinaFundingItems } from "../run-china-funding-pipeline.mjs";
import { historicalFundingClusterKey } from "../build-data-center-v4.mjs";
import { historyCaseClosure } from "../build-china-funding-history-quality.mjs";
import { chinaFundingActorEvidence } from "../lib/china-market-v1.mjs";
import { domesticFundingResearchQueries, selectFundingEventsForGeneration } from "../generate-funding-insights-deepseek.mjs";
import { publisherDateObservation } from "../repair-china-funding-source-dates.mjs";
import { chinaFundingPublicationScope } from "../lib/china-funding-publication-scope.mjs";

test("historical CN scope retains all domestic and ordinary daily coverage", () => {
  const events = [{ event_id: "H", source_refs: ["S"], disclosed_at: "2026-02-01", market_scope: { china_market_match: true } }, { event_id: "D", source_refs: ["daily"], disclosed_at: "2026-09-12" }, { event_id: "X", source_refs: ["S"], disclosed_at: "2026-02-01" }];
  const policy = { application_market_region: "CN", authorized_by: "explicit_user_request_2026_china_funding_backfill", source_refs: ["S"], from: "2026-01-01", to: "2026-09-12" };
  assert.deepEqual(chinaFundingPublicationScope(events, policy).events.map(event => event.event_id), ["H", "D"]);
  assert.deepEqual(chinaFundingPublicationScope(events, {}).events, events);
  assert.deepEqual(chinaFundingPublicationScope(events, { ...policy, from: "2026-03-01" }).events, events);
});

import { canonicalFundingEventAmount, canonicalFundingEventRound, normalizeFundingRound, normalizeFundingAmount, fundingEventCardConsistencyProblems, subjectCompanyForEvent } from "../funding-insight-v1-utils.mjs";

test("current round stays separate from earlier rounds and preserves Chinese plus suffixes", () => {
  assert.equal(normalizeFundingRound("Pre-A++轮").label, "Pre-A++轮");
  assert.equal(normalizeFundingRound("天使++轮").label, "天使++轮");
  assert.equal(normalizeFundingRound("种子+轮").label, "种子+轮");
  assert.notEqual(normalizeFundingRound("B+轮").code, normalizeFundingRound("B轮").code);
  const claims = [{ claim_id: "C", claim_type: "funding", verification_status: "accepted", source_quote: "智推时代宣布完成数千万元天使轮融资。2025年曾完成种子轮融资。" }];
  assert.equal(canonicalFundingEventRound({ claim_refs: ["C"], object: "数千万元" }, claims).code, "angel");
});

test("Chinese round proceeds retain fuzzy amounts and do not substitute cumulative financing", () => {
  for (const amount of ["数亿元", "10亿元", "数千万美元"]) {
    const event = { object: `完成${amount}天使轮融资`, metrics: [] };
    assert.equal(canonicalFundingEventAmount(event, []), amount);
    assert.ok(normalizeFundingAmount(amount).currency);
  }
  assert.equal(canonicalFundingEventAmount({ object: "完成10亿元B轮融资", display_title_zh: "两个月融资25亿元，公司完成新一轮融资" }), "10亿元");
  const claim = { claim_id: "C", claim_type: "funding", verification_status: "accepted", subject: "设序科技", object: "完成B轮超亿元融资", source_quote: "设序科技完成B轮超亿元融资，累计获超3亿元融资。" };
  const event = { event_id: "E", entities: ["CO", "INV"], claim_refs: ["C"], event_status: "completed", publication_status: "verified" };
  const card = { company: { entity_id: "CO", name: "设序科技" }, financing: { amount: "超亿元" } };
  assert.deepEqual(fundingEventCardConsistencyProblems(card, event, [claim]), []);
  const current = { ...claim, subject: "AI搜索公司智推时代", object: "数千万元", source_quote: "智推时代GenOptima宣布完成数千万元天使轮融资。" };
  const biography = { ...current, claim_id: "BIO", source_quote: "联合创始人曾在上一家公司主导近4亿美元融资。" };
  const funding = { ...event, claim_refs: ["C", "BIO"], display_title_zh: "智推时代完成数千万元天使轮融资" };
  assert.deepEqual(fundingEventCardConsistencyProblems({ company: { entity_id: "CO", name: "智推时代GenOptima" }, financing: { amount: "4亿美元" } }, funding, [current, biography]), ["funding_event_company_amount_mismatch"]);
  assert.deepEqual(fundingEventCardConsistencyProblems({ company: { entity_id: "CO", name: "智推时代GenOptima" }, financing: { amount: "数千万元" } }, funding, [current, biography]), []);
});

test("HTML spacing inside a Chinese legal name cannot turn the recipient into a generic company suffix", () => {
  const claim = { claim_id: "C", claim_type: "funding", verification_status: "accepted", subject: "上海复鞍智能科技有限公司", source_quote: "上海 复鞍智能 科技有限公司（以下简称复鞍智能）宣布完成数千万元融资。" };
  const company = subjectCompanyForEvent({ event_id: "E", entities: ["CO"], claim_refs: ["C"] }, [{ entity_id: "CO", entity_type: "organization_candidate", canonical_name: "上海复鞍智能科技有限公司" }], {}, [claim]);
  assert.equal(company.canonical_name, "上海复鞍智能科技有限公司");
});

test("source date repair uses publication metadata, never modified date or URL date", () => {
  const html = '<meta property="article:modified_time" content="2026-09-12T08:00:00Z"><meta content="2026-01-07 09:20:00" name="publishdate">';
  assert.equal(publisherDateObservation(html, "https://example.com/2026/09/12").published_at, "2026-01-07T09:20:00+08:00");
  assert.equal(publisherDateObservation('<meta property="article:modified_time" content="2026-09-12">', "https://example.com/2026/09/12"), null);
});

test("historical funding cannot reuse another disclosure by company and round label alone", () => {
  const event = { event_id: "EV-new" };
  const selection = selectFundingEventsForGeneration([event], {
    publishedCards: [{ triggered_by_event_id: "EV-old", aggregation: { key: "company|seed" } }],
    eventAggregationKey: () => "company|seed", allowAggregationReuse: () => false,
  });
  assert.deepEqual(selection.pending, [event]);
  assert.equal(selection.deduplicated.length, 0);
});

test("domestic card research covers missing financing and company/product fields in Chinese", () => {
  const queries = domesticFundingResearchQueries("案例公司", "数亿元", "2026-03-01");
  assert.equal(queries.length, 4);
  assert.ok(domesticFundingResearchQueries("智子芯元(深圳)科技有限公司", "数千万元", "2026-03-01").some(item => item.query.includes('"智子芯元"')));
  assert.ok(queries.every((item) => item.query.includes("案例公司")));
  for (const field of ["2026", "金额", "投资方", "产品", "总部", "融资用途"]) assert.ok(queries.map((item) => item.query).join(" ").includes(field));
});

const index = (day, name = "案例公司") => `<div id="invest-list"><div class="item"><div class="t"><span>A轮</span><span>数亿元</span></div><div class="d">${day}</div><h3><a href="https://vc.pedaily.cn/company/123.html">${name}</a></h3><div class="ai-summary">不可作为事实的生成摘要</div></div></div>`;
test("investment discovery omits generated summaries and keeps distinct company rounds/dates", () => {
  const first = investmentRows(index("2026-01-02"), "https://vc.pedaily.cn/invest/f2760-p1");
  const second = investmentRows(index("2026-02-02"), "https://vc.pedaily.cn/invest/f2760-p1");
  assert.equal(first[0].evidence_status, "discovery_only_not_canonical");
  assert.notEqual(first[0].case_id, second[0].case_id);
  assert.ok(!JSON.stringify(first).includes("不可作为事实"));
});
test("index census stops only after reaching the older date boundary and reuses successful pages", async (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "cn-index-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  let calls = 0;
  const fetchPage = async (url) => { calls++; return url.includes("company") ? "<html></html>" : url.endsWith("p1") ? index("2026-01-01") : index("2025-12-31"); };
  const options = { root, from: "2026-01-01", to: "2026-09-12", date: "2026-09-12", fetchPage };
  const result = await collectIndex(options);
  assert.equal(result.cases.length, 1);
  assert.equal(result.index.historical_boundary_reached, true);
  assert.equal(result.index.pages.length, 2);
  await collectIndex(options);
  assert.equal(calls, 3);
});
test("company related news remains article metadata, not company-index body or invented date", () => {
  const html = '<script type="application/ld+json">{"itemListElement":[{"item":{"@type":"NewsArticle","url":"https://news.pedaily.cn/202601/123456.shtml","headline":"案例公司完成A轮融资","datePublished":"2026-01-01","articleBody":"do not export"}}]}</script>';
  assert.deepEqual(relatedArticles(html), [{ url: "https://news.pedaily.cn/202601/123456.shtml", title: "案例公司完成A轮融资", date_hint: "2026-01-01" }]);
});
test("nested publisher body survives while AI summary and related-news footer stay outside", () => {
  const html = '<div class="newsai">AI解读</div><time datetime="2026-02-03T09:10:00+08:00"></time><div id="news-content"><div>融资事实</div><p>公司产品正文</p></div><div>相关推荐</div>';
  const result = chinaFundingArticleHtml(html, "https://news.pedaily.cn/202602/123456.shtml");
  assert.ok(result.fragment.includes("公司产品正文"));
  assert.ok(!result.fragment.includes("AI解读"));
  assert.ok(!result.fragment.includes("相关推荐"));
  assert.equal(result.published_at, "2026-02-03T09:10:00+08:00");
});
test("capture delta preserves accepted evidence and selects only unknown URLs", () => {
  assert.deepEqual(uncapturedChinaFundingItems({ items: [{ url: "https://a.cn/p/1?from=x" }, { url: "https://a.cn/p/2" }] }, { source_artifacts: [{ source_url: "https://a.cn/p/1" }] }), [{ url: "https://a.cn/p/2" }]);
});
test("historical events do not merge different recipients that share an investor and amount", () => {
  const first = { cluster_subject: "公司甲", entities: ["投资机构"], action: "完成A轮融资", object: "数千万元A轮融资", metrics: ["数千万元"], disclosed_at: "2026-01-08" };
  assert.notEqual(historicalFundingClusterKey(first), historicalFundingClusterKey({ ...first, cluster_subject: "公司乙" }));
  assert.notEqual(historicalFundingClusterKey(first), historicalFundingClusterKey({ ...first, action: "完成B轮融资", object: "数千万元B轮融资" }));
  assert.notEqual(historicalFundingClusterKey(first), historicalFundingClusterKey({ ...first, disclosed_at: "2026-07-08" }));
});
test("a company card for another financing event is not accepted as case closure", () => {
  const cases = historyCaseClosure({ cases: [{ case_id: "1", company_hint: "甲科技", date_hint: "2026-01-08", original_candidates: [{ url: "https://a.cn/p/1" }] }] }, {
    raws: [{ raw_id: "R1", source_artifact_id: "S1", source_url: "https://a.cn/p/1" }],
    claims: [{ claim_id: "C1", subject: "甲科技" }],
    events: [{ event_id: "E1", event_type: "funding", publication_status: "verified", disclosed_at: "2026-01-08", source_refs: ["S1"], claim_refs: ["C1"], market_scope: { china_market_match: true } }],
    cards: [{ company: { name: "甲科技" }, triggered_by_event_id: "OLDER-EVENT", funding_insight_id: "F1" }],
  });
  assert.equal(cases[0].status, "card_evidence_incomplete");
  assert.deepEqual(cases[0].card_ids, []);
});
test("China funding geography belongs to the recipient, not its Chinese investor or publisher", () => {
  assert.equal(chinaFundingActorEvidence("Noiz AI", '深圳声音动力科技有限公司（以下简称“Noiz AI”）是一家音频AI平台开发商。').matched, true);
  assert.equal(chinaFundingActorEvidence("甲智能", "深圳甲智能科技有限公司完成A轮融资。").matched, true);
  assert.equal(chinaFundingActorEvidence("甲智能", "甲智能是一家总部位于深圳的机器人公司。").matched, true);
  assert.equal(chinaFundingActorEvidence("Acme", "Acme完成融资，投资方是深圳甲智能科技有限公司。").matched, false);
  assert.equal(chinaFundingActorEvidence("Acme", "投资界报道，Acme获得中国企业投资。").matched, false);
});
