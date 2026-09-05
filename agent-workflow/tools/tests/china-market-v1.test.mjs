import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  chinaMarketLaneQueries,
  chinaMarketOrganizationAliases,
  loadChinaMarketConfig,
  mergeChinaMarketSources,
  selectChinaMarketIntakeDocuments,
  scopeChinaMarketItems,
} from "../lib/china-market-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("China market source registry is source-only and adds no ranking fields", () => {
  const config = loadChinaMarketConfig(root);
  const serialized = JSON.stringify(config.sourceRegistry);
  assert.equal(/"(?:source_level|source_weight|weight|score|priority|rank|trust_score|quality_score|confidence_score|boost|bonus|multiplier)"\s*:/iu.test(serialized), false);
  assert.equal(config.sourceRegistry.classification_policy.ranking_or_weighting, "forbidden");
  assert.equal(
    config.sourceRegistry.sources.some((source) => source.source_category === "government_procurement" && source.enabled_default !== false),
    false,
  );
  assert.ok(config.sourceRegistry.sources.some((source) => source.source_category === "company_official"));
  assert.ok(config.sourceRegistry.sources.some((source) => source.interface_type === "rss"));
  assert.ok(config.sourceRegistry.sources.some((source) => source.source_id === "cn-cyzone" && source.collection_scope.includes("startup_funding")));
});

test("China market sources adapt to the existing monitor without source levels", () => {
  const config = loadChinaMarketConfig(root);
  const merged = mergeChinaMarketSources([{ source_id: "existing", source_level: "S" }], config.sourceRegistry);
  const chinaSources = merged.filter((source) => source.registry_scope === "china_market");
  assert.equal(chinaSources.length, config.sourceRegistry.sources.filter((source) => source.enabled_default !== false).length);
  assert.equal(chinaSources.every((source) => !("source_level" in source)), true);
  assert.equal(chinaSources.every((source) => source.source_region === "CN"), true);
  assert.equal(chinaSources.every((source) => !("market_region" in source)), true);
  assert.equal(merged[0].source_id, "existing");
});

test("China market queries preserve explicit collection paths and do not change scoring", () => {
  const config = loadChinaMarketConfig(root);
  const keyword = chinaMarketLaneQueries(config.monitoring, "keyword_search");
  const gdelt = chinaMarketLaneQueries(config.monitoring, "gdelt");
  assert.equal(keyword.some((query) => query.search_paths.includes("procurement_marketplace")), false);
  assert.equal(keyword.some((query) => query.query_theme === "china-procurement"), false);
  assert.ok(keyword.some((query) => query.search_paths.includes("official_original")));
  assert.ok(keyword.some((query) => query.china_market_query_id === "cn-ai-hardware-funding" && query.search_paths.includes("china_ai_hardware_funding")));
  assert.ok(keyword.some((query) => query.china_market_query_id === "cn-vertical-agent-funding" && query.search_paths.includes("china_vertical_agent_funding")));
  assert.ok(keyword.some((query) => query.china_market_query_id === "cn-ai-funding-media-sweep"));
  assert.equal(keyword.find((query) => query.china_market_query_id === "cn-ai-hardware-funding")?.query_theme, "china-ai-hardware-funding");
  assert.equal(keyword.find((query) => query.china_market_query_id === "cn-vertical-agent-funding")?.query_theme, "china-vertical-agent-funding");
  assert.ok(gdelt.some((query) => query.query_theme === "china-policy-regulation"));
  assert.equal(keyword.every((query) => query.market_region === "CN"), true);
  assert.equal(keyword.every((query) => !("score" in query) && !("weight" in query) && !("priority" in query)), true);
});

test("China organization aliases include Chinese, English and legal names", () => {
  const config = loadChinaMarketConfig(root);
  const aliases = chinaMarketOrganizationAliases(config.entityAliases);
  const deepSeek = aliases.find((entity) => entity.canonicalName === "DeepSeek");
  const moonshot = aliases.find((entity) => entity.canonicalName === "Moonshot AI");
  const biren = aliases.find((entity) => entity.canonicalName === "壁仞科技");
  assert.ok(deepSeek.aliases.includes("深度求索"));
  assert.ok(deepSeek.aliases.includes("杭州深度求索人工智能基础技术研究有限公司"));
  assert.ok(moonshot.aliases.includes("月之暗面"));
  assert.ok(biren.aliases.includes("Biren Technology"));
  assert.ok(biren.aliases.includes("壁仞科技"));
  const evenRealities = aliases.find((entity) => entity.canonicalName === "Even Realities");
  assert.deepEqual(evenRealities.aliases, ["Even Realities", "Even Realities Technology"]);
  const aliasEvidence = config.entityAliases.entities.find((entity) => entity.canonical_name === "Even Realities").evidence_refs[0];
  const fundingBundle = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/content/12-applications/funding-insights/2026-09-05.json"), "utf8"));
  const sourceCard = fundingBundle.cards.find((card) => card.funding_insight_id === aliasEvidence.funding_insight_id);
  const researchSource = sourceCard.research_sources.find((source) => source.source_id === aliasEvidence.source_id);
  assert.equal(aliasEvidence.source_url, researchSource.source_url);
  assert.ok(sourceCard.company.evidence_refs.some((ref) => ref.source_id === aliasEvidence.source_id && ref.quote === aliasEvidence.quote));
  assert.ok(aliases.length >= 30);
});

test("China market scope is based on event content, not a Chinese publisher", () => {
  const config = loadChinaMarketConfig(root);
  const scoped = scopeChinaMarketItems([
    {
      title: "腾讯混元发布科研智能体",
      source: "IT之家",
    },
    {
      title: "GPT-5.6 reduces global API prices",
      source: "量子位",
      market_region: "CN",
    },
  ], config.entityAliases);
  assert.equal(scoped.included.length, 1);
  assert.equal(scoped.included[0].market_region, "CN");
  assert.match(scoped.included[0].china_market_match_basis, /^china_entity:Tencent:/u);
  assert.equal(scoped.excluded.length, 1);
  assert.equal("market_region" in scoped.excluded[0], false);
});

test("China market scope ignores appended search-query metadata and recognizes English entity aliases", () => {
  const config = loadChinaMarketConfig(root);
  const scoped = scopeChinaMarketItems([
    {
      title: "OpenAI lowers global API prices",
      summary: "OpenAI reduced prices worldwide / query=中国 AI 公司 融资 / intent=capital",
      source: "量子位",
    },
    {
      title: "DeepSeek releases a new reasoning model",
      summary: "DeepSeek released the model through its official API documentation.",
      source: "DeepSeek official",
    },
  ], config.entityAliases);

  assert.deepEqual(scoped.included.map((item) => item.title), ["DeepSeek releases a new reasoning model"]);
  assert.match(scoped.included[0].china_market_match_basis, /^china_entity:DeepSeek:/u);
  assert.deepEqual(scoped.excluded.map((item) => item.title), ["OpenAI lowers global API prices"]);
});

test("China market scope recognizes a disclosed Chinese legal entity without trusting publisher geography", () => {
  const config = loadChinaMarketConfig(root);
  const scoped = scopeChinaMarketItems([
    {
      title: "博登智能完成 A+ 轮融资",
      summary: "宁波博登智能科技有限公司宣布完成本轮融资。",
      source: "创业邦",
    },
    {
      title: "Global startup raises funding",
      summary: "The company announced a new financing round.",
      source: "创业邦",
    },
  ], config.entityAliases);

  assert.equal(scoped.included.length, 1);
  assert.match(scoped.included[0].china_market_match_basis, /^china_legal_entity:/u);
  assert.deepEqual(scoped.excluded.map((item) => item.title), ["Global startup raises funding"]);
});

test("China market scope recognizes the Kling AI product actor as Kuaishou", () => {
  const config = loadChinaMarketConfig(root);
  const scoped = scopeChinaMarketItems([
    { title: "可灵AI完成新一轮融资", summary: "国家人工智能基金参与本轮投资。", source: "公开报道" },
  ], config.entityAliases);

  assert.equal(scoped.included.length, 1);
  assert.equal(scoped.included[0].china_market_match_basis, "china_entity:Kuaishou:可灵AI");
});

test("China market intake selection reads only the CN subset from a unified daily intake", () => {
  const selected = selectChinaMarketIntakeDocuments([
    {
      raw_id: "RAW-global",
      market_scope: {
        source_registry_id: "",
        source_region: "",
        market_region: "",
        china_market_match: false,
        china_market_match_basis: "",
      },
    },
    {
      raw_id: "RAW-cn-source",
      market_scope: {
        source_registry_id: "cn-ithome-rss",
        source_region: "CN",
        market_region: "",
        china_market_match: false,
        china_market_match_basis: "",
      },
    },
    {
      raw_id: "RAW-cn-market",
      market_scope: {
        source_registry_id: "cn-company-official",
        source_region: "CN",
        market_region: "CN",
        china_market_match: true,
        china_market_match_basis: "china_entity:Example",
      },
    },
  ]);

  assert.deepEqual(selected.sourceDocuments.map((item) => item.raw_id), ["RAW-cn-source", "RAW-cn-market"]);
  assert.deepEqual(selected.marketDocuments.map((item) => item.raw_id), ["RAW-cn-market"]);
  assert.deepEqual(selected.invalidSourceDocuments, []);
  assert.deepEqual(selected.invalidMarketDocuments, []);
});

test("the daily post-monitor handoff runs the dated China market gate", () => {
  const workflow = fs.readFileSync(
    path.join(root, ".github/workflows/daily-persistent-assets-pr.yml"),
    "utf8",
  );
  assert.match(
    workflow,
    /Confirm V4 source-intake handoff[\s\S]*npm run assert:china-market -- --date="\$\{RUN_DATE\}" --stage=intake/u,
  );
  assert.doesNotMatch(workflow, /node agent-workflow\/tools\/normalize-china-market-intake\.mjs/u);
  assert.match(
    workflow,
    /Restore accepted source intake[\s\S]*source-title-translations-main\.json[\s\S]*guanlan-monitor-quality-gate\.mjs/u,
  );
  assert.match(
    workflow,
    /Run Data Center V4 integrity gate[\s\S]*npm run assert:china-market -- --date="\$\{RUN_DATE\}" --stage=bundle/u,
  );
  assert.match(
    workflow,
    /Confirm site data freshness[\s\S]*npm run assert:source-titles/u,
  );
});
