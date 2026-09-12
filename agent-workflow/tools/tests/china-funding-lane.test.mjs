import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { collectChinaFunding, normalizeChinaFundingLead, articleUrl } from "../lib/china-funding-collector.mjs";
import { buildChinaFundingHealth } from "../lib/china-funding-health.mjs";
import { chinaFundingPlan, selectChinaFundingIntake } from "../run-china-funding-pipeline.mjs";
import { mergeSourceIntakes } from "../lib/source-intake-v1.mjs";

const root = process.cwd();
const config = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/content/11-databases/china-funding-monitor-v1.json"), "utf8"));
test("intake checkpoint uses the actual intake contract without bundle-only body_length", () => {
  const source = { source_artifact_id: "SA1", source_url: "https://m.pedaily.cn/first/123456.shtml" };
  const raw = { raw_id: "RAW1", source_artifact_id: "SA1", extraction_status: "accepted", body_ref: "evidence://abc" };
  const intake = { schema_version: "SOURCE-INTAKE-V1.1", data_date: "2026-09-12", source_artifacts: [source], raw_documents: [raw] };
  const discovery = { items: [{ url: source.source_url }] };
  assert.equal(selectChinaFundingIntake(intake, discovery).raw_documents.length, 1);
  assert.throws(() => selectChinaFundingIntake({ ...intake, raw_documents: [{ ...raw, extraction_status: "quarantined" }] }, discovery));
});
test("all publishers execute both dedicated searches without the global first-five cap", async () => {
  const calls = [];
  const result = await collectChinaFunding({ root, date: "2026-09-12", fetcher: async () => ({ ok: true, text: async () => "<html>dynamic page</html>" }), search: async (query) => {
    calls.push(query); const domain = query.match(/^site:(\S+)/u)[1];
    return [{ url: `https://${domain}/article/123456`, title: "AI公司完成A轮融资", snippet: "企业AI产品" }];
  } });
  assert.equal(calls.length, config.sources.length * config.query_terms.length);
  assert.equal(result.diagnostics.length, config.sources.length);
  assert.ok(result.diagnostics.every((row) => row.query_count === 2 && row.successful_queries === 2 && row.status === "partial"));
  assert.equal(result.items.length, config.sources.length);
  assert.ok(result.items.every((item) => !Object.hasOwn(item, "market_region")));
});
test("an unavailable source is failed rather than a healthy zero-news day", async () => {
  const result = await collectChinaFunding({ root, date: "2026-09-12", fetcher: async () => { throw new Error("HTTP 403"); }, search: async () => { throw new Error("unavailable"); } });
  assert.ok(result.diagnostics.every((row) => row.status === "failed"));
  assert.ok(result.failures.length >= config.sources.length * 3);
});
test("reject foreign hosts, list pages, stock margin noise and scheme injection", () => {
  const source = config.sources[0];
  for (const url of ["https://pedaily.cn.evil.com/article/123", "https://m.pedaily.cn/", "javascript:alert(1)"]) assert.equal(articleUrl(url, source.domains), "");
  assert.equal(normalizeChinaFundingLead({ url: "https://m.pedaily.cn/first/178491.shtml", title: "AI公司融资余额增加" }, source), null);
  assert.equal(articleUrl("https://m.pedaily.cn/news/f7", source.domains), "");
  assert.ok(normalizeChinaFundingLead({ url: "https://m.pedaily.cn/first/178491.shtml", title: "超维动力完成天使轮融资" }, source));
});
test("cross-publisher repeated events and cards are counted once, with evidence-derived CN scope", () => {
  const discovery = { date: "2026-09-12", diagnostics: [{ name: "A", status: "collected" }, { name: "B", status: "collected" }], items: [{ source: "A", url: "https://a.cn/article/1" }, { source: "B", url: "https://b.cn/article/2" }] };
  const payload = buildChinaFundingHealth({ date: discovery.date, discovery,
    artifacts: [{ source_artifact_id: "SA1", source_url: discovery.items[0].url }, { source_artifact_id: "SA2", source_url: discovery.items[1].url }],
    events: [{ event_id: "EV1", event_type: "funding", publication_status: "verified", source_refs: ["SA1", "SA2"], entities: ["EN1"] }],
    cards: [{ funding_insight_id: "FI1", research_sources: discovery.items.map((item) => ({ source_url: item.url })) }] });
  assert.equal(payload.totals.funding_events, 1);
  assert.equal(payload.totals.china_funding_events, 0);
  assert.equal(payload.totals.published_card_matches, 1);
  assert.equal(payload.publication.status, "awaiting_publication_receipt");
});
test("missing batch is unavailable and failed projection is not reported synchronized", () => {
  assert.equal(buildChinaFundingHealth({ date: "2026-09-12" }).totals, null);
  const health = buildChinaFundingHealth({ date: "2026-09-12", discovery: { date: "2026-09-12", diagnostics: [] }, stages: [{ id: "projections", status: "failed" }] });
  assert.equal(health.status, "failed");
  assert.equal(health.failed_stage, "projections");
});
test("accepted domestic snapshot merges additively and current main wins shared IDs", () => {
  const make = (id, title) => ({ schema_version: "SOURCE-INTAKE-V1.1", data_date: "2026-09-12", source_artifacts: [{ source_artifact_id: id }], raw_documents: [{ raw_id: id, source_artifact_id: id, title }] });
  const domestic = mergeSourceIntakes(make("domestic", "new"), make("shared", "old"));
  const main = mergeSourceIntakes(make("overseas", "preserved"), make("shared", "corrected"));
  const result = mergeSourceIntakes(domestic, main);
  assert.equal(result.raw_documents.length, 3);
  assert.equal(result.raw_documents.find((item) => item.raw_id === "shared").title, "corrected");
});
test("domestic pipeline includes original evidence, canonical, entity and institution gates", () => {
  const plan = chinaFundingPlan("2026-09-12", "test-sources");
  const commands = plan.flatMap((stage) => stage.commands.map((args) => args.join(" ")));
  for (const stage of plan) for (const args of stage.commands) assert.ok(fs.existsSync(args[0]), args[0]);
  for (const expected of ["--targeted-source-artifacts=true", "--merge-existing-intake=true", "assert-public-evidence-boundary", "assert-data-center-v4", "assert-entity-history-v1", "build-investment-institutions-v1", "assert-investment-institutions-v1"]) assert.ok(commands.some((command) => command.includes(expected)), expected);
});
test("domestic collection is an independent simultaneous job and only publication holds writer lock", () => {
  const parent = fs.readFileSync(".github/workflows/daily-persistent-assets-pr.yml", "utf8");
  const child = fs.readFileSync(".github/workflows/china-funding-pr.yml", "utf8");
  assert.match(parent, /jobs:\s+china-funding:/u);
  assert.match(parent, /business-signals-pr:[\s\S]*?concurrency:[\s\S]*?wavesight-data-center-publication/u);
  assert.doesNotMatch(parent.slice(0, parent.indexOf("jobs:")), /concurrency:/u);
  assert.match(child, /publish:\s+needs: collect[\s\S]*?concurrency:/u);
  assert.match(child, /ref: main/u);
  assert.match(child, /git restore --worktree --staged \./u);
  assert.doesNotMatch(child, /gh pr merge[^\n]*--auto/u);
});
