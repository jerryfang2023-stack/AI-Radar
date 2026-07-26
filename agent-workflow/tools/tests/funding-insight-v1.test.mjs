import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_VERSION,
  fundingInsightProblems,
  researchPayloadProblems,
} from "../funding-insight-v1-utils.mjs";
import { buildFundingInsightsFrontstage } from "../../../01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function evidence(sourceId = "SRC-1", quote = "Acme raised $20 million led by Northstar Ventures.") {
  return [{ source_id: sourceId, quote }];
}

function validCard() {
  return {
    schema_version: FUNDING_INSIGHT_VERSION,
    funding_insight_id: "FI-1",
    triggered_by_event_id: "EV-1",
    as_of_date: "2026-07-26",
    company: {
      entity_id: "EN-1",
      name: "Acme",
      full_name: "Acme, Inc.",
      website: "https://acme.example",
      summary: "企业智能代理平台",
      headquarters: "旧金山",
      founders: [],
      team_size: {},
      evidence_refs: evidence(),
    },
    financing: {
      round: "A 轮",
      amount: "$20M",
      total_raised: "$25M",
      announced_at: "2026-07-26",
      investors: [{ name: "Northstar Ventures", role: "本轮领投", entity_id: null, evidence_refs: evidence() }],
      evidence_refs: evidence(),
    },
    products: [{ name: "Acme Agent", description: "企业智能代理", evidence_refs: evidence("SRC-2", "Acme Agent automates enterprise workflows.") }],
    customers: [],
    comparisons: [],
    metrics: [],
    quotes: [],
    analysis: {
      sector: "企业 AI",
      capital_judgment: "资本押注的是可重复交付，而不是通用聊天入口。",
      risks: ["客户部署周期仍然较长"],
      related_direction_id: "DIR-1",
    },
    entity_links: [],
    funding_history: [],
    research_sources: [
      { source_id: "SRC-1", title: "Funding", publisher: "Example", source_url: "https://example.com/funding", source_class: "media" },
      { source_id: "SRC-2", title: "Product", publisher: "Acme", source_url: "https://acme.example/product", source_class: "official" },
    ],
    model_provenance: {},
    auto_publish_gate: { passed: true, problems: [], gate_version: "FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.0" },
    publication_status: "auto_published",
    published_at: "2026-07-26T08:00:00.000Z",
  };
}

test("自动发布门禁要求明确投资方及产品证据", () => {
  const card = validCard();
  assert.deepEqual(fundingInsightProblems(card), []);
  card.financing.investors = [];
  assert.ok(fundingInsightProblems(card).includes("investors_missing"));
});

test("DeepSeek 研究结果必须逐项引用已抓取来源原文", () => {
  const source = {
    source_id: "SRC-1",
    body_clean: "Acme raised $20 million led by Northstar Ventures. Acme Agent automates enterprise workflows.",
  };
  const productSource = {
    source_id: "SRC-2",
    body_clean: "Acme Agent automates enterprise workflows.",
  };
  const payload = {
    company: { full_name: "Acme, Inc.", summary: "企业智能代理平台", evidence_refs: evidence() },
    financing: {
      round: "A 轮",
      amount: "$20M",
      evidence_refs: evidence(),
      investors: [{ name: "Northstar Ventures", role: "本轮领投", evidence_refs: evidence() }],
    },
    products: [{ name: "Acme Agent", description: "企业智能代理", evidence_refs: evidence("SRC-2", "Acme Agent automates enterprise workflows.") }],
    customers: [],
    comparisons: [],
    metrics: [],
    analysis: { capital_judgment: "资金用于扩大企业交付。", risks: ["交付周期"], related_direction_id: "DIR-1", sector: "企业人工智能" },
  };
  assert.deepEqual(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]), []);
  payload.financing.investors[0].evidence_refs[0].quote = "source does not contain this";
  assert.ok(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]).includes("investor_1_evidence_1_quote_mismatch"));
});

test("前台构建只发布通过门禁的卡片并生成双向链接", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-insight-"));
  try {
    const bundleDir = path.join(tempRoot, "01-SiteV2/content/12-applications/funding-insights");
    const dataDir = path.join(tempRoot, "01-SiteV2/site/data");
    const entityIndexDir = path.join(dataDir, "data-center-v4/indexes");
    fs.mkdirSync(bundleDir, { recursive: true });
    fs.mkdirSync(entityIndexDir, { recursive: true });
    const blocked = validCard();
    blocked.funding_insight_id = "FI-2";
    blocked.triggered_by_event_id = "EV-2";
    blocked.financing.investors = [];
    fs.writeFileSync(path.join(bundleDir, "2026-07-26.json"), JSON.stringify({
      meta: { date: "2026-07-26" },
      cards: [validCard(), blocked],
      queue: [],
    }));
    fs.writeFileSync(path.join(dataDir, "industry-reports-frontstage.json"), JSON.stringify({
      directionCards: [{ id: "DIR-1", title: "企业智能代理的可重复交付" }],
    }));
    fs.writeFileSync(path.join(entityIndexDir, "entities.json"), JSON.stringify({
      companies: [{ id: "EN-1" }],
      products: [],
      people: [],
    }));
    const data = buildFundingInsightsFrontstage(tempRoot);
    assert.equal(data.cards.length, 1);
    assert.equal(data.cards[0].financing.investors[0].name, "Northstar Ventures");
    assert.match(data.cards[0].links.company, /detail=entity&id=EN-1/u);
    assert.match(data.cards[0].links.relation_map, /view=relations&entity=EN-1/u);
    assert.equal(data.cards[0].analysis.related_direction.title, "企业智能代理的可重复交付");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("融资透视页面使用应用中心新结构并声明自动数据入口", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/funding-insights.html"), "utf8");
  assert.match(html, /href="trend-radar\.html">变化雷达/u);
  assert.match(html, /href="funding-insights\.html" aria-current="page">融资透视/u);
  assert.match(html, /href="opportunity-map\.html">机会地图/u);
  assert.match(html, /href="intelligence-map\.html">行业报告/u);
  assert.match(html, /assets\/funding-insights\.js/u);
});
