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
  assert.ok(gdelt.some((query) => query.query_theme === "china-policy-regulation"));
  assert.equal(keyword.every((query) => query.market_region === "CN"), true);
  assert.equal(keyword.every((query) => !("score" in query) && !("weight" in query) && !("priority" in query)), true);
});

test("China organization aliases include Chinese, English and legal names", () => {
  const config = loadChinaMarketConfig(root);
  const aliases = chinaMarketOrganizationAliases(config.entityAliases);
  const deepSeek = aliases.find((entity) => entity.canonicalName === "DeepSeek");
  const moonshot = aliases.find((entity) => entity.canonicalName === "Moonshot AI");
  assert.ok(deepSeek.aliases.includes("深度求索"));
  assert.ok(deepSeek.aliases.includes("杭州深度求索人工智能基础技术研究有限公司"));
  assert.ok(moonshot.aliases.includes("月之暗面"));
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
  assert.match(
    workflow,
    /Restore accepted source intake[\s\S]*normalize-china-market-intake\.mjs --date="\$\{RUN_DATE\}"/u,
  );
  assert.match(
    workflow,
    /Run Data Center V4 integrity gate[\s\S]*npm run assert:china-market -- --date="\$\{RUN_DATE\}" --stage=bundle/u,
  );
});
