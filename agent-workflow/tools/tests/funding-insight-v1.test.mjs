import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_VERSION,
  buildFundingEntityReviewQueue,
  ensureCanonicalFundingEvidence,
  entityResolver,
  fundingEvidenceProofProblems,
  fundingInsightProblems,
  normalizeFundingRound,
  normalizeFundingInsightCard,
  partitionRoundInvestors,
  researchPayloadProblems,
  sanitizeResearchPayload,
  subjectCompanyForEvent,
  verifiedFundingEventCardCoverageProblems,
} from "../funding-insight-v1-utils.mjs";
import { selectHistoricalFundingEvents } from "../backfill-funding-insights-history.mjs";
import { selectFundingEventsForGeneration } from "../generate-funding-insights-deepseek.mjs";
import { assertFundingFounderReview, collectFundingFounderCandidates } from "../build-funding-founder-review.mjs";
import { inspectFundingInsightWork } from "../inspect-funding-insight-work.mjs";
import {
  aggregateFundingRoundCards,
  buildFundingInsightsFrontstage,
  dedupeFundingRounds,
  fundingMarketCategoryDecision,
  fundingProductFormDecision,
  fundingProductFormId,
  productFormDecisionMap,
} from "../../../01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("funding generation skips event IDs already published in another date bundle", () => {
  const selection = selectFundingEventsForGeneration([
    { event_id: "EV-NEW" },
    { event_id: "EV-CURRENT" },
    { event_id: "EV-HISTORICAL-DUPLICATE" },
    { event_id: "EV-COMPANY-ROUND-DUPLICATE", aggregation_key: "EN-HARK|series_a" },
  ], {
    currentCards: [{ triggered_by_event_id: "EV-CURRENT" }],
    publishedCards: [
      { triggered_by_event_id: "EV-CURRENT" },
      { triggered_by_event_id: "EV-HISTORICAL-DUPLICATE" },
      { triggered_by_event_id: "EV-HARK-ORIGINAL", aggregation: { key: "EN-HARK|series_a" } },
    ],
    eventAggregationKey: (event) => event.aggregation_key || "",
  });

  assert.deepEqual(selection.pending.map((event) => event.event_id), ["EV-NEW"]);
  assert.deepEqual(selection.reused.map((event) => event.event_id), ["EV-CURRENT"]);
  assert.deepEqual(selection.deduplicated.map((event) => event.event_id), [
    "EV-HISTORICAL-DUPLICATE",
    "EV-COMPANY-ROUND-DUPLICATE",
  ]);
});

function evidence(sourceId = "SRC-1", quote = "Acme raised $20 million led by Northstar Ventures.") {
  return [{ source_id: sourceId, quote }];
}

test("founder profile candidates require explicit founder evidence, company support, and complete source locators", () => {
  const candidates = collectFundingFounderCandidates([{
    funding_insight_id: "FI-FOUNDER",
    triggered_by_event_id: "EV-FOUNDER",
    as_of_date: "2026-07-30",
    company: {
      entity_id: "EN-COMPANY",
      name: "Acme",
      founders: [
        { name: "Ada Founder", role: "Co-founder and CEO", evidence_refs: [{ source_id: "SRC-FOUNDER", quote: "Ada Founder, co-founder and CEO of Acme.", source_content_hash: "source-hash", quote_hash: "quote-hash" }] },
        { name: "Team Member", role: "Chief Scientist", evidence_refs: [{ source_id: "SRC-MEMBER", quote: "Team Member is Chief Scientist.", source_content_hash: "member-source", quote_hash: "member-quote" }] }
      ]
    },
    research_sources: [
      { source_id: "SRC-FOUNDER", source_url: "https://example.com/founder" },
      { source_id: "SRC-MEMBER", source_url: "https://example.com/member" }
    ]
  }, {
    funding_insight_id: "FI-MISLINKED",
    triggered_by_event_id: "EV-MISLINKED",
    as_of_date: "2026-07-30",
    company: {
      entity_id: "EN-AMD",
      name: "AMD",
      full_name: "Featherless.ai",
      founders: [{
        name: "Mislinked Founder",
        role: "Co-founder",
        evidence_refs: [{ source_id: "SRC-MISLINKED", quote: "Mislinked Founder, co-founder of Featherless.ai.", source_content_hash: "mislinked-source", quote_hash: "mislinked-quote" }]
      }]
    },
    research_sources: [{ source_id: "SRC-MISLINKED", source_url: "https://example.com/mislinked" }]
  }]);

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].name, "Ada Founder");
  assert.equal(candidates[0].profiles[0].evidence_refs[0].source_url, "https://example.com/founder");
});

test("stored founder review cannot replace an approved name while preserving the accepted count", () => {
  const review = JSON.parse(fs.readFileSync(
    path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/funding-founder-review-decisions.json"),
    "utf8"
  ));
  const tampered = structuredClone(review);
  tampered.decisions[0].canonical.name = "Unreviewed Founder";
  const mislinked = structuredClone(review);
  mislinked.decisions[0].canonical.funding_profiles[0].company_name = "Unrelated Company";

  assert.ok(assertFundingFounderReview(tampered).includes("reviewed_name_allowlist_mismatch"));
  assert.ok(assertFundingFounderReview(mislinked).some((problem) => problem.endsWith(":profile_company_evidence_mismatch")));
});

function validCard() {
  return normalizeFundingInsightCard({
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
      product_form_id: "enterprise_platform",
      market_category_id: "horizontal_ai",
      investment_rationale: [],
      capital_judgment: "资本押注的是可重复交付，而不是通用聊天入口。",
      validated_signals: ["已经形成企业工作流产品"],
      risks: ["客户部署周期仍然较长"],
      related_direction_id: "DIR-1",
    },
    entity_links: [],
    funding_history: [],
    research_sources: [
      { source_id: "SRC-1", title: "Funding", publisher: "Example", source_url: "https://example.com/funding", source_class: "media", content_hash: "source-one-hash" },
      { source_id: "SRC-2", title: "Product", publisher: "Acme", source_url: "https://acme.example/product", source_class: "official", content_hash: "source-two-hash" },
    ],
    model_provenance: {},
    auto_publish_gate: { passed: true, problems: [], gate_version: "FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.1" },
    publication_status: "auto_published",
    published_at: "2026-07-26T08:00:00.000Z",
  });
}

function writeDailyFundingFixture(projectRoot, events) {
  const dir = path.join(projectRoot, "01-SiteV2/content/11-databases/data-center-v4/2026-07-26");
  fs.mkdirSync(dir, { recursive: true });
  for (const [file, value] of [
    ["canonical-events.json", events],
    ["claims.json", []],
    ["entities.json", []],
    ["raw-documents.json", []],
    ["source-artifacts.json", []],
  ]) {
    fs.writeFileSync(path.join(dir, file), `${JSON.stringify(value)}\n`, "utf8");
  }
}

test("自动发布门禁要求明确投资方及产品证据", () => {
  const card = validCard();
  assert.deepEqual(fundingInsightProblems(card), []);
  card.analysis.related_direction_id = "";
  assert.deepEqual(fundingInsightProblems(card), [], "a funding event may publish without a matching Direction Card");
  card.financing.investors = [];
  assert.ok(fundingInsightProblems(card).includes("investors_missing"));
});

test("已确认融资但具体投资方未披露时保留风险标记并允许发布", () => {
  const card = validCard();
  card.financing.investors = [];
  card.financing.investor_disclosure_status = "not_disclosed";
  const normalized = normalizeFundingInsightCard(card);
  assert.equal(normalized.financing.investor_disclosure_status, "not_disclosed");
  assert.ok(normalized.financing.risk_markers.includes("investors_missing"));
  assert.ok(normalized.analysis.risks.some((risk) => risk.includes("具体投资方未披露")));
  assert.deepEqual(fundingInsightProblems(normalized), []);
});

test("融资轮次统一为稳定代码和中文展示名，同时保留原始写法", () => {
  assert.deepEqual(normalizeFundingRound("Series A"), {
    code: "series_a",
    label: "A轮",
    original: "Series A",
  });
  assert.deepEqual(normalizeFundingRound("A 轮"), {
    code: "series_a",
    label: "A轮",
    original: "A 轮",
  });
  assert.deepEqual(normalizeFundingRound("pre-seed"), {
    code: "pre_seed",
    label: "预种子轮",
    original: "pre-seed",
  });
  assert.deepEqual(normalizeFundingRound("Series B extension"), {
    code: "series_b_extension",
    label: "B轮扩展",
    original: "Series B extension",
  });
  assert.deepEqual(normalizeFundingRound("Seed and Series A"), {
    code: "multi_round",
    label: "多轮融资",
    original: "Seed and Series A",
  });
});

test("本轮投资方与历史或轮次不明投资方必须分开", () => {
  const result = partitionRoundInvestors([
    { name: "Northstar", role: "本轮领投", evidence_refs: evidence() },
    { name: "Seed Fund", role: "种子轮领投", evidence_refs: evidence() },
    { name: "Legacy Capital", role: "既有投资方", evidence_refs: evidence() },
    { name: "Growth Partner", role: "A轮参投", evidence_refs: evidence() },
  ], "Series A");
  assert.deepEqual(result.current.map((item) => item.name), ["Northstar", "Growth Partner"]);
  assert.deepEqual(result.other.map((item) => item.name), ["Seed Fund", "Legacy Capital"]);
  assert.equal(result.other[0].round_context.code, "seed");
  assert.equal(result.other[1].round_context.code, "undisclosed");
});

test("实体链接只做可解释的规范精确匹配并容忍商标与人物角色后缀", () => {
  const resolve = entityResolver({
    products: [{ id: "EN-PRODUCT", type: "产品/服务", name: "Acme Agent", aliases: [] }],
    people: [{ id: "EN-PERSON", type: "人物", name: "Thomas Dohmke", aliases: [] }],
  });
  assert.equal(resolve("Acme Agent™", ["产品/服务"])?.id, "EN-PRODUCT");
  assert.equal(resolve("Thomas Dohmke (CEO)", ["人物"])?.id, "EN-PERSON");
  assert.equal(resolve("Acme", ["产品/服务"]), null, "substring matching remains forbidden");
});

test("融资卡规范化同时修复轮次、本轮投资方、研究覆盖和实体链接状态", () => {
  const card = validCard();
  card.financing.round = "Series A";
  card.financing.investors.push({
    name: "Seed Fund",
    role: "种子轮领投",
    entity_id: null,
    evidence_refs: evidence(),
  });
  card.company.founders = [{
    name: "Ada Lee",
    role: "联合创始人",
    entity_id: null,
    evidence_refs: evidence(),
  }];
  const normalized = normalizeFundingInsightCard(card, {
    products: [{ id: "EN-PRODUCT", type: "产品/服务", name: "Acme Agent", aliases: [] }],
    people: [],
  });
  assert.equal(normalized.financing.round, "A轮");
  assert.equal(normalized.financing.round_code, "series_a");
  assert.equal(normalized.financing.round_original, "Series A");
  assert.deepEqual(normalized.financing.investors.map((item) => item.name), ["Northstar Ventures"]);
  assert.deepEqual(normalized.financing.other_round_investors.map((item) => item.name), ["Seed Fund"]);
  assert.equal(normalized.products[0].entity_id, "EN-PRODUCT");
  assert.deepEqual(normalized.entity_link_coverage.products, {
    linked: 1,
    total: 1,
    unresolved_names: [],
  });
  assert.deepEqual(normalized.entity_link_coverage.founders.unresolved_names, ["Ada Lee"]);
  assert.equal(normalized.customer_research.status, "no_verified_customer_found");
  assert.equal(normalized.analysis.investment_thesis.institutional_rationale_status, "not_disclosed");
});

test("融资证据将来源内容哈希与引文哈希绑定，任一漂移都会被门禁识别", () => {
  const card = validCard();
  assert.deepEqual(fundingEvidenceProofProblems(card), []);
  card.company.evidence_refs[0].quote = "tampered quote";
  assert.ok(fundingEvidenceProofProblems(card).some((item) => item.includes("evidence_quote_hash_mismatch")));
  const restored = validCard();
  restored.company.evidence_refs[0].source_content_hash = "wrong-source-hash";
  assert.ok(fundingEvidenceProofProblems(restored).some((item) => item.includes("evidence_source_hash_mismatch")));
});

test("已审核实体决策只回写到现有同类型规范实体", () => {
  const card = validCard();
  card.products[0].name = "Trace 工作流编排平台";
  const decisions = {
    decisions: [{
      candidate_kind: "product",
      research_name: "Trace 工作流编排平台",
      status: "accepted",
      canonical_entity_id: "EN-TRACE",
    }],
  };
  const normalized = normalizeFundingInsightCard(card, {
    products: [{ id: "EN-TRACE", type: "产品/服务", name: "TRACE", aliases: [] }],
  }, decisions);
  assert.equal(normalized.products[0].entity_id, "EN-TRACE");
  const wrongType = normalizeFundingInsightCard(card, {
    people: [{ id: "EN-TRACE", type: "人物", name: "TRACE", aliases: [] }],
  }, decisions);
  assert.equal(wrongType.products[0].entity_id, null);
});

test("未链接产品与创始人进入证据化待审队列，已链接实体不重复排队", () => {
  const card = validCard();
  card.products[0].entity_id = "EN-PRODUCT";
  card.company.founders = [{
    name: "Ada Lee",
    role: "联合创始人",
    entity_id: null,
    evidence_refs: evidence(),
  }];
  const queue = buildFundingEntityReviewQueue([card]);
  assert.equal(queue.meta.candidate_count, 1);
  assert.equal(queue.meta.product_candidates, 0);
  assert.equal(queue.meta.person_candidates, 1);
  assert.equal(queue.candidates[0].research_name, "Ada Lee");
  assert.ok(queue.candidates[0].evidence_refs.length);
});

test("融资卡工作检查器只调度尚未发布的已验证融资事件", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-work-"));
  try {
    writeDailyFundingFixture(projectRoot, [{
      event_id: "EV-1",
      event_type: "funding",
      publication_status: "verified",
      display_title_zh: "Acme 完成 A 轮融资",
    }]);
    const pending = inspectFundingInsightWork(projectRoot, "2026-07-26");
    assert.equal(pending.needs_generation, true);
    assert.deepEqual(pending.pending_event_ids, ["EV-1"]);

    const output = path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights/2026-07-26.json");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const priorOutput = path.join(path.dirname(output), "2026-07-25.json");
    fs.writeFileSync(priorOutput, `${JSON.stringify({ cards: [validCard()], queue: [] })}\n`, "utf8");
    const publishedPreviously = inspectFundingInsightWork(projectRoot, "2026-07-26");
    assert.equal(publishedPreviously.output_exists, false);
    assert.equal(publishedPreviously.needs_generation, false);
    assert.equal(publishedPreviously.auto_published, 1);
    fs.unlinkSync(priorOutput);

    fs.writeFileSync(output, `${JSON.stringify({ cards: [validCard()], queue: [] })}\n`, "utf8");
    const current = inspectFundingInsightWork(projectRoot, "2026-07-26");
    assert.equal(current.needs_generation, false);
    assert.equal(current.auto_published, 1);
    assert.deepEqual(current.pending_event_ids, []);

    const invalid = validCard();
    invalid.financing.investors = [];
    fs.writeFileSync(output, `${JSON.stringify({ cards: [invalid], queue: [] })}\n`, "utf8");
    const repair = inspectFundingInsightWork(projectRoot, "2026-07-26");
    assert.equal(repair.needs_generation, true);
    assert.deepEqual(repair.pending_event_ids, ["EV-1"]);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("每个已验证融资商业事件都必须被一张有效融资卡覆盖", () => {
  const verified = {
    event_id: "EV-1",
    event_type: "funding",
    publication_status: "verified",
    display_title_zh: "Acme 完成 A 轮融资",
  };
  const disputed = {
    event_id: "EV-DISPUTED",
    event_type: "funding",
    publication_status: "disputed",
    display_title_zh: "待核验融资事件",
  };
  assert.deepEqual(
    verifiedFundingEventCardCoverageProblems([verified, disputed], []),
    ["EV-1:verified_funding_event_without_valid_card"],
  );
  assert.deepEqual(
    verifiedFundingEventCardCoverageProblems([verified, disputed], [validCard()]),
    [],
  );
  assert.deepEqual(
    verifiedFundingEventCardCoverageProblems([verified], [], [{ event_id: "EV-1", status: "deduplicated" }]),
    [],
  );
  const invalid = validCard();
  invalid.financing.investors = [];
  assert.deepEqual(
    verifiedFundingEventCardCoverageProblems([verified], [invalid]),
    ["EV-1:verified_funding_event_without_valid_card"],
  );
  const evidenceTampered = validCard();
  evidenceTampered.company.evidence_refs[0].quote = "tampered quote";
  assert.deepEqual(
    verifiedFundingEventCardCoverageProblems([verified], [evidenceTampered]),
    ["EV-1:verified_funding_event_without_valid_card"],
    "coverage must reject cards whose evidence hashes no longer match",
  );
});

test("融资卡聚合的全部来源事件都视为已完成，不重复调度", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-aggregate-work-"));
  try {
    writeDailyFundingFixture(projectRoot, [
      { event_id: "EV-1", event_type: "funding", publication_status: "verified", display_title_zh: "Acme 完成 A 轮融资" },
      { event_id: "EV-2", event_type: "funding", publication_status: "verified", display_title_zh: "Acme A 轮融资补充披露" },
    ]);
    const output = path.join(
      projectRoot,
      "01-SiteV2/content/12-applications/funding-insights/2026-07-26.json",
    );
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const aggregated = validCard();
    aggregated.source_event_ids = ["EV-1", "EV-2"];
    fs.writeFileSync(output, `${JSON.stringify({ cards: [aggregated], queue: [] })}\n`, "utf8");

    const result = inspectFundingInsightWork(projectRoot, "2026-07-26");
    assert.equal(result.needs_generation, false);
    assert.deepEqual(result.pending_event_ids, []);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("单事件增量生成不会删除同日已经发布的其他融资卡", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-selected-"));
  try {
    writeDailyFundingFixture(projectRoot, [
      { event_id: "EV-1", event_type: "funding", publication_status: "verified", display_title_zh: "Acme 完成 A 轮融资" },
      { event_id: "EV-2", event_type: "funding", publication_status: "verified", display_title_zh: "Beta 完成种子轮融资" },
    ]);
    const output = path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights/2026-07-26.json");
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const secondCard = structuredClone(validCard());
    secondCard.funding_insight_id = "FI-2";
    secondCard.triggered_by_event_id = "EV-2";
    secondCard.company.entity_id = "EN-2";
    secondCard.company.name = "Beta";
    fs.writeFileSync(output, `${JSON.stringify({ cards: [validCard(), secondCard], queue: [] })}\n`, "utf8");
    childProcess.execFileSync(process.execPath, [
      path.join(root, "agent-workflow/tools/generate-funding-insights-deepseek.mjs"),
      "--date=2026-07-26",
      "--event-id=EV-1",
      "--selected-only=true",
      "--write=true",
    ], {
      cwd: projectRoot,
      env: { ...process.env, DEEPSEEK_API_KEY: "", TAVILY_API_KEY: "", EXA_API_KEY: "" },
      stdio: "pipe",
    });
    const result = JSON.parse(fs.readFileSync(output, "utf8"));
    assert.equal(result.meta.counts.funding_events, 2);
    assert.deepEqual(result.cards.map((card) => card.triggered_by_event_id).sort(), ["EV-1", "EV-2"]);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("没有融资事件时生成器无需搜索或模型密钥也会写出可验证空包", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-empty-"));
  try {
    writeDailyFundingFixture(projectRoot, []);
    const generator = path.join(root, "agent-workflow/tools/generate-funding-insights-deepseek.mjs");
    childProcess.execFileSync(process.execPath, [
      generator,
      "--date=2026-07-26",
      "--write=true",
    ], {
      cwd: projectRoot,
      env: {
        ...process.env,
        DEEPSEEK_API_KEY: "",
        TAVILY_API_KEY: "",
        EXA_API_KEY: "",
      },
      stdio: "pipe",
    });
    const output = JSON.parse(fs.readFileSync(
      path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights/2026-07-26.json"),
      "utf8",
    ));
    assert.deepEqual(output.meta.counts, {
      funding_events: 0,
      auto_published: 0,
      blocked: 0,
      pending: 0,
      deduplicated: 0,
    });
    assert.deepEqual(output.cards, []);
    assert.deepEqual(output.queue, []);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("融资透视自动化在商业事件工作流后增量研究、同步并发布", () => {
  const workflow = fs.readFileSync(
    path.join(root, ".github/workflows/daily-funding-insights-pr.yml"),
    "utf8",
  );
  const pagesWorkflow = fs.readFileSync(path.join(root, ".github/workflows/github-pages.yml"), "utf8");
  const fullGate = fs.readFileSync(
    path.join(root, "agent-workflow/tools/assert-funding-insights-v1.mjs"),
    "utf8",
  );
  assert.match(workflow, /workflow_run:[\s\S]*WaveSight Business Signals PR/u);
  assert.match(workflow, /inspect-funding-insight-work\.mjs/u);
  assert.match(workflow, /TAVILY_DISABLED: "false"/u);
  assert.match(workflow, /generate-funding-insights-deepseek\.mjs[\s\S]*assert-funding-insights-v1\.mjs[\s\S]*build-funding-insights-frontstage\.mjs/u);
  assert.match(workflow, /build-funding-insights-frontstage\.mjs[\s\S]*assert-funding-insights-v1\.mjs --all=true --frontstage=true/u);
  assert.doesNotMatch(workflow, /sync-funding-insights-to-obsidian\.mjs|vault\/20-Application-Center/u);
  assert.match(workflow, /automation\/funding-insights-\$\{RUN_DATE\}/u);
  assert.match(workflow, /push:[\s\S]*canonical-events\.json/u);
  assert.match(workflow, /startsWith\(github\.event\.head_commit\.message, 'Persist business signals for '\)/u);
  assert.match(workflow, /gh workflow run daily-funding-insights-pr\.yml --ref main -f date=/u);
  assert.match(workflow, /group: wavesight-funding-insights-\$\{\{ needs\.resolve-date\.outputs\.date \}\}/u);
  assert.match(workflow, /Wait for Funding Insights PR to reach main/u);
  assert.match(workflow, /gh workflow run github-pages\.yml --ref main -f source_sha=/u);
  assert.match(workflow, /gh run watch "\$run_id" --exit-status/u);
  assert.match(pagesWorkflow, /run-name: Deploy Frontstage to GitHub Pages \$\{\{ inputs\.source_sha \|\| github\.sha \}\}/u);
  assert.match(
    fullGate,
    /function validateFrontstage\(\)[\s\S]*fundingEvidenceProofProblems\(card\)/u,
    "the full gate must reject evidence-proof drift in the persisted frontstage projection",
  );
  assert.match(
    fullGate,
    /verifiedFundingEventCardCoverageProblems/u,
    "the publication gate must reject a verified funding event without a valid funding card",
  );
  const fundingJob = workflow.slice(workflow.indexOf("  funding-insights-pr:"));
  assert.doesNotMatch(fundingJob, /steps\.run-date\.outputs\.date/u);
});

test("融资主体解析优先选择被投公司而不是投资方", () => {
  const entities = [
    { entity_id: "EN-OPENAI", entity_type: "organization_candidate", canonical_name: "OpenAI" },
    { entity_id: "EN-POETIC", entity_type: "organization_candidate", canonical_name: "Poetic" },
  ];
  const event = {
    display_title_zh: "OpenAI 投资 AI 初创公司 Poetic，布局合规与承保任务",
    action: "投资",
    object: "$50 million",
    entities: ["EN-OPENAI", "EN-POETIC"],
  };
  assert.equal(subjectCompanyForEvent(event, entities)?.entity_id, "EN-POETIC");
});

test("融资主体可按事件标题精确链接稳定公司实体", () => {
  const event = {
    display_title_zh: "Runlayer 完成 3000 万美元 A 轮融资",
    action: "完成融资",
    object: "$30 million",
    entities: [],
  };
  const entityIndex = {
    companies: [{
      id: "EN-RUNLAYER",
      name: "Runlayer",
      sourceType: "organization_candidate",
      aliases: [],
    }],
  };
  assert.equal(subjectCompanyForEvent(event, [], entityIndex)?.entity_id, "EN-RUNLAYER");
});

test("融资主体可从事件 Claim 证据解析，避免在二次搜索前误阻塞", () => {
  const entities = [{
    entity_id: "EN-P1",
    entity_type: "organization_candidate",
    canonical_name: "P-1 AI, Inc.",
  }];
  const claims = [{
    claim_id: "CL-P1",
    subject: "P-1 AI, Inc.",
    source_quote: "P-1 AI, Inc. announced the initial closing of its $50 million Series A financing round.",
  }];
  const event = {
    display_title_zh: "智能体 AI 能否让美国制造业回归？",
    action: "funding",
    object: "$50 million Series A financing round",
    metrics: ["$50 million"],
    entities: ["EN-P1"],
    claim_refs: ["CL-P1"],
  };

  assert.equal(subjectCompanyForEvent(event, entities, {}, claims)?.entity_id, "EN-P1");
});

test("融资主体可从带英文描述前缀的规范实体名中恢复公司名", () => {
  const entities = [{
    entity_id: "EN-PATHWORK",
    entity_type: "organization_candidate",
    canonical_name: "AI-driven insurtech company Pathwork",
  }];
  const event = {
    display_title_zh: "AI驱动的保险科技公司Pathwork获350万美元种子轮融资",
    action: "获种子轮融资",
    object: "$3.5 million",
    metrics: ["$3.5 million"],
    entities: ["EN-PATHWORK"],
  };
  const company = subjectCompanyForEvent(event, entities);
  assert.equal(company?.entity_id, "EN-PATHWORK");
  assert.equal(company?.canonical_name, "Pathwork");
});

test("descriptive startup prefixes never leak into the Funding Insight company name", () => {
  const company = subjectCompanyForEvent({
    display_title_zh: "Inference startup Infinity raises $15M",
    action: "raises",
    object: "$15M",
    metrics: ["$15M"],
    entities: ["EN-INFINITY"],
  }, [{
    entity_id: "EN-INFINITY",
    entity_type: "organization_candidate",
    canonical_name: "Inference startup Infinity",
  }]);

  assert.equal(company?.canonical_name, "Infinity");
  const normalized = normalizeFundingInsightCard({
    ...validCard(),
    company: {
      ...validCard().company,
      name: "Inference startup Infinity",
      full_name: "Infinity",
    },
  });
  assert.equal(normalized.company.name, "Infinity");
});

test("融资主体没有强主语信号时保持阻断", () => {
  const entities = [
    { entity_id: "EN-ANTHROPIC", entity_type: "organization_candidate", canonical_name: "Anthropic" },
    { entity_id: "EN-META", entity_type: "organization_candidate", canonical_name: "Meta" },
  ];
  const event = {
    display_title_zh: "获 Anthropic、OpenAI 及 Meta 内部人士支持，Bespoke Labs 融资 4000 万美元",
    action: "获支持",
    object: "$40 million",
    entities: ["EN-ANTHROPIC", "EN-META"],
  };
  assert.equal(subjectCompanyForEvent(event, entities), null);
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
    analysis: {
      investment_rationale: [],
      capital_judgment: "资金用于扩大企业交付。",
      validated_signals: ["已经形成企业工作流产品"],
      risks: ["交付周期"],
      related_direction_id: "DIR-1",
      product_form_id: "enterprise_platform",
      market_category_id: "horizontal_ai",
      sector: "企业人工智能",
    },
  };
  assert.deepEqual(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]), []);
  payload.financing.investors[0].evidence_refs[0].quote = "source does not contain this";
  assert.ok(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]).includes("investor_1_evidence_1_quote_mismatch"));
});

test("DeepSeek 可用未披露状态表达只有泛称、没有具体名称的投资方", () => {
  const fundingSource = {
    source_id: "SRC-1",
    body_clean: "丘脑智能已完成数千万元种子轮融资，投资方包括深圳一线基金和产业资本。",
  };
  const productSource = {
    source_id: "SRC-2",
    body_clean: "丘脑智能研发面向工业场景的人工智能产品。",
  };
  const payload = {
    company: { full_name: "丘脑智能", summary: "面向工业场景的人工智能公司", evidence_refs: evidence("SRC-2", productSource.body_clean) },
    financing: {
      round: "种子轮",
      amount: "数千万元",
      investor_disclosure_status: "not_disclosed",
      evidence_refs: evidence("SRC-1", fundingSource.body_clean),
      investors: [],
    },
    products: [{ name: "丘脑智能工业 AI", description: "面向工业场景的人工智能产品", evidence_refs: evidence("SRC-2", productSource.body_clean) }],
    customers: [], comparisons: [], metrics: [],
    analysis: {
      investment_rationale: [],
      capital_judgment: "资本押注工业人工智能产品的研发与交付能力。",
      validated_signals: ["已完成种子轮融资"],
      risks: ["具体投资机构未披露"],
      related_direction_id: "",
      product_form_id: "ai_application",
      market_category_id: "vertical_ai",
      sector: "工业人工智能",
    },
  };
  assert.deepEqual(researchPayloadProblems(payload, [fundingSource, productSource], []), []);
});

test("机构投资理由必须来自本轮投资方并保留原文证据", () => {
  const source = {
    source_id: "SRC-1",
    body_clean: "Northstar partner Ada Lee said: The team has turned a difficult workflow into measurable customer outcomes.",
  };
  const productSource = {
    source_id: "SRC-2",
    body_clean: "Acme Agent automates enterprise workflows.",
  };
  const payload = {
    company: { full_name: "Acme, Inc.", summary: "企业智能代理平台", evidence_refs: evidence("SRC-1", source.body_clean) },
    financing: {
      round: "A 轮",
      amount: "$20M",
      evidence_refs: evidence("SRC-1", source.body_clean),
      investors: [{ name: "Northstar Ventures", role: "本轮领投", evidence_refs: evidence("SRC-1", source.body_clean) }],
    },
    products: [{ name: "Acme Agent", description: "企业智能代理", evidence_refs: evidence("SRC-2", productSource.body_clean) }],
    customers: [],
    comparisons: [],
    metrics: [],
    analysis: {
      investment_rationale: [{
        institution: "Northstar Ventures",
        speaker: "Ada Lee",
        speaker_role: "合伙人",
        rationale: "团队已把复杂工作流转化为可量化客户结果。",
        quote: "The team has turned a difficult workflow into measurable customer outcomes.",
        evidence_refs: evidence("SRC-1", source.body_clean),
      }],
      capital_judgment: "资金押注可量化的企业交付结果。",
      validated_signals: ["已有工作流产品"],
      risks: ["交付周期仍待规模化验证"],
      related_direction_id: "DIR-1",
      product_form_id: "enterprise_platform",
      market_category_id: "horizontal_ai",
      sector: "企业人工智能",
    },
  };
  assert.deepEqual(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]), []);
  payload.analysis.investment_rationale[0].institution = "Unknown Fund";
  assert.ok(researchPayloadProblems(payload, [source, productSource], ["DIR-1"])
    .includes("investment_rationale_1_institution_not_in_round"));
});

test("可选研究数组中的不完整条目在硬门禁前被删除", () => {
  const source = {
    source_id: "SRC-1",
    body_clean: "Northstar invested in Acme. Acme Agent automates enterprise workflows. Peer serves developers. Revenue grew 50%.",
  };
  const payload = sanitizeResearchPayload({
    financing: {
      investors: [{
        name: "Northstar",
        role: "本轮领投",
        evidence_refs: evidence("SRC-1", "Northstar invested in Acme."),
      }],
    },
    customers: [
      { name: "", evidence_refs: evidence("SRC-1", "Acme Agent automates enterprise workflows.") },
      { name: "Customer", use_case: "Automates enterprise workflows", evidence_refs: evidence("SRC-1", "Acme Agent automates enterprise workflows.") },
    ],
    comparisons: [
      { name: "Peer", product: "", scenario: "", evidence_refs: evidence("SRC-1", "Acme Agent automates enterprise workflows.") },
      { name: "Peer", product: "Developer platform", scenario: "Coding", evidence_refs: evidence("SRC-1", "Peer serves developers.") },
    ],
    metrics: [
      { label: "", evidence_refs: evidence("SRC-1", "Acme Agent automates enterprise workflows.") },
      { label: "Revenue growth", value: "50%", evidence_refs: evidence("SRC-1", "Revenue grew 50%.") },
    ],
    quotes: [{ speaker: "", quote: "", evidence_refs: evidence("SRC-1", "Northstar invested in Acme.") }],
    analysis: {
      investment_rationale: [{
        institution: "Not In Round",
        rationale: "不属于本轮投资方",
        quote: "Northstar invested in Acme.",
        evidence_refs: evidence("SRC-1", "Northstar invested in Acme."),
      }],
    },
  }, [source]);
  assert.deepEqual(payload.customers, []);
  assert.deepEqual(payload.comparisons, []);
  assert.deepEqual(payload.metrics, []);
  assert.deepEqual(payload.quotes, []);
  assert.deepEqual(payload.analysis.investment_rationale, []);
});

test("同一公司同轮次同金额的重复融资事件只投影为一张前台卡", () => {
  const older = validCard();
  older.triggered_by_event_id = "EV-PAPER-OLD";
  older.financing.round = "Series A";
  older.financing.amount = "$34 million";
  older.financing.announced_at = "2026-07-23";
  older.published_at = "2026-07-25T08:00:00.000Z";
  const newer = structuredClone(older);
  newer.triggered_by_event_id = "EV-PAPER-NEW";
  newer.financing.round = "A 轮";
  newer.financing.amount = "3400 万美元";
  newer.financing.announced_at = "2026-07-24";
  newer.published_at = "2026-07-26T08:00:00.000Z";
  assert.deepEqual(
    dedupeFundingRounds([older, newer]).map((card) => card.triggered_by_event_id),
    ["EV-PAPER-NEW"],
  );
});

test("同一公司与规范轮次聚合为一张卡并保留全部事件和研究信息", () => {
  const older = validCard();
  older.triggered_by_event_id = "EV-OLD";
  older.financing.round = "Series A";
  older.customers = [{
    name: "Customer One",
    industry: "金融",
    use_case: "用于客户支持",
    evidence_refs: evidence(),
  }];
  const newer = structuredClone(older);
  newer.triggered_by_event_id = "EV-NEW";
  newer.financing.round = "A 轮";
  newer.published_at = "2026-07-27T08:00:00.000Z";
  newer.customers = [];
  newer.products.push({
    name: "Acme Studio",
    description: "企业工作流设计工具",
    evidence_refs: evidence("SRC-2", "Acme Agent automates enterprise workflows."),
  });
  const cards = aggregateFundingRoundCards([older, newer]);
  assert.equal(cards.length, 1);
  assert.deepEqual(cards[0].source_event_ids, ["EV-NEW", "EV-OLD"]);
  assert.equal(cards[0].aggregation.event_count, 2);
  assert.deepEqual(cards[0].customers.map((item) => item.name), ["Customer One"]);
  assert.deepEqual(cards[0].products.map((item) => item.name).sort(), ["Acme Agent", "Acme Studio"]);
});

test("经审核的公司别名合并会让同一融资轮次跨实体 ID 聚合", () => {
  const branded = validCard();
  branded.company.entity_id = "EN-aligned-brand";
  branded.company.name = "Aligned";
  branded.triggered_by_event_id = "EV-aligned-brand";
  const legal = validCard();
  legal.funding_insight_id = "FI-aligned-legal";
  legal.company.entity_id = "EN-aligned-legal";
  legal.company.name = "Team Aligned Inc.";
  legal.triggered_by_event_id = "EV-aligned-legal";
  const identityReview = {
    decisions: [
      {
        entity_id: "EN-aligned-brand",
        current: { name: "Aligned", catalog_type: "company" },
        canonical: { catalog_type: "company", name: "Aligned" },
        action: "correct",
        merge_into_entity_id: "",
        review_status: "accepted",
        evidence: { source_url: "https://aligned.example/terms", quote: "Team Aligned, Inc. (Aligned)" },
        rationale: "瀹樻柟鏉℃纭鍝佺墝涓庢硶寰嬪疄浣撱€?",
      },
      {
        entity_id: "EN-aligned-legal",
        current: { name: "Team Aligned Inc.", catalog_type: "company" },
        canonical: { catalog_type: "company", name: "Aligned" },
        action: "merge",
        merge_into_entity_id: "EN-aligned-brand",
        review_status: "accepted",
        evidence: { source_url: "https://aligned.example/terms", quote: "Team Aligned, Inc. (Aligned)" },
        rationale: "瀹樻柟鏉℃纭涓轰竴瀹跺叕鍙搞€?",
      },
    ],
  };
  const cards = aggregateFundingRoundCards([branded, legal], {}, {}, identityReview);
  assert.equal(cards.length, 1);
  assert.equal(cards[0].company.entity_id, "EN-aligned-brand");
  assert.equal(cards[0].company.name, "Aligned");
  assert.deepEqual(cards[0].source_event_ids.sort(), ["EV-aligned-brand", "EV-aligned-legal"]);
});

test("company identity decisions require evidence and an accepted merge target", () => {
  const invalidEvidence = {
    decisions: [{
      entity_id: "EN-aligned-brand",
      current: { name: "Aligned", catalog_type: "company" },
      canonical: { name: "Aligned", catalog_type: "company" },
      action: "correct",
      merge_into_entity_id: "",
      review_status: "accepted",
      evidence: {},
      rationale: "",
    }],
  };
  assert.throws(
    () => aggregateFundingRoundCards([validCard()], {}, {}, invalidEvidence),
    /missing evidence or rationale/u,
  );

  const missingTarget = structuredClone(invalidEvidence);
  missingTarget.decisions[0] = {
    ...missingTarget.decisions[0],
    entity_id: "EN-aligned-legal",
    current: { name: "Team Aligned Inc.", catalog_type: "company" },
    canonical: { name: "Aligned", catalog_type: "company" },
    action: "merge",
    merge_into_entity_id: "EN-aligned-brand",
    evidence: { source_url: "https://aligned.example/terms", quote: "Team Aligned, Inc. (Aligned)" },
    rationale: "瀹樻柟鏉℃纭涓轰竴瀹跺叕鍙搞€?",
  };
  assert.throws(
    () => aggregateFundingRoundCards([validCard()], {}, {}, missingTarget),
    /merge target is not accepted/u,
  );
});

test("未披露和多轮融资也严格按公司与规范轮次聚合", () => {
  for (const round of ["未披露", "Seed and Series A"]) {
    const older = validCard();
    older.triggered_by_event_id = `EV-OLD-${round}`;
    older.financing.round = round;
    const newer = structuredClone(older);
    newer.triggered_by_event_id = `EV-NEW-${round}`;
    newer.published_at = "2026-07-27T08:00:00.000Z";
    const cards = aggregateFundingRoundCards([older, newer]);
    assert.equal(cards.length, 1);
    assert.equal(cards[0].source_event_ids.length, 2);
  }
});

test("模型漏填融资引用时只允许回填已验收的规范 Claim 原文", () => {
  const payload = { financing: { evidence_refs: [] } };
  const source = {
    source_id: "FISRC-1",
    raw_id: "RAW-1",
    body_clean: "Acme raises $20M in Series A funding.",
  };
  ensureCanonicalFundingEvidence(payload, {
    claims: [{
      claim_id: "CL-1",
      raw_id: "RAW-1",
      claim_type: "funding",
      source_quote: "Acme raises $20M in Series A funding.",
      verification_status: "accepted",
    }],
  }, { claim_refs: ["CL-1"] }, [source]);
  assert.deepEqual(payload.financing.evidence_refs, [{
    source_id: "FISRC-1",
    quote: "Acme raises $20M in Series A funding.",
  }]);
});

test("历史融资回填为重复 CanonicalEvent 选择证据最完整的唯一归属批次", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-history-"));
  try {
    const dataRoot = path.join(tempRoot, "01-SiteV2/content/11-databases/data-center-v4");
    const event = {
      event_id: "EV-DUPLICATE",
      event_type: "funding",
      publication_status: "verified",
      display_title_zh: "Acme 完成 A 轮融资",
      source_refs: ["SA-1"],
      claim_refs: ["CL-1"],
      missing_fields: ["investors"],
    };
    fs.mkdirSync(path.join(dataRoot, "2026-07-01"), { recursive: true });
    fs.mkdirSync(path.join(dataRoot, "2026-07-02"), { recursive: true });
    fs.writeFileSync(
      path.join(dataRoot, "2026-07-01/canonical-events.json"),
      JSON.stringify([event]),
    );
    fs.writeFileSync(
      path.join(dataRoot, "2026-07-02/canonical-events.json"),
      JSON.stringify([{
        ...event,
        source_refs: ["SA-1", "SA-2"],
        claim_refs: ["CL-1", "CL-2"],
        missing_fields: [],
      }]),
    );
    const selection = selectHistoricalFundingEvents(tempRoot, {
      from: "2026-07-01",
      to: "2026-07-02",
    });
    assert.equal(selection.occurrence_count, 2);
    assert.equal(selection.unique_event_count, 1);
    assert.equal(selection.duplicate_occurrences_removed, 1);
    assert.equal(selection.owners[0].owner_date, "2026-07-02");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("前台构建只发布通过门禁的卡片并生成双向链接", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-insight-"));
  try {
    const bundleDir = path.join(tempRoot, "01-SiteV2/content/12-applications/funding-insights");
    const dataDir = path.join(tempRoot, "01-SiteV2/site/data");
    const entityIndexDir = path.join(dataDir, "data-center-v4/indexes");
    const productDir = path.join(tempRoot, "agent-workflow/product");
    fs.mkdirSync(bundleDir, { recursive: true });
    fs.mkdirSync(entityIndexDir, { recursive: true });
    fs.mkdirSync(productDir, { recursive: true });
    const blocked = validCard();
    blocked.funding_insight_id = "FI-2";
    blocked.triggered_by_event_id = "EV-2";
    blocked.financing.investors = [];
    fs.writeFileSync(path.join(bundleDir, "2026-07-26.json"), JSON.stringify({
      meta: { date: "2026-07-26", generated_at: "2026-07-26T09:00:00.000Z" },
      cards: [validCard(), blocked],
      queue: [],
    }));
    fs.writeFileSync(path.join(dataDir, "opportunity-evidence-v2.json"), JSON.stringify({
      directionCards: [{ id: "DIR-1", title: "企业智能代理的可重复交付" }],
    }));
    fs.writeFileSync(path.join(entityIndexDir, "entities.json"), JSON.stringify({
      companies: [{ id: "EN-1" }],
      products: [],
      people: [],
    }));
    fs.writeFileSync(path.join(productDir, "tag-taxonomy-v4.json"), JSON.stringify({
      facets: [
        {
          id: "product_form",
          values: [{ id: "enterprise_platform", name: "企业 AI 平台", status: "active" }],
        },
        {
          id: "ai_market_category",
          values: [{ id: "horizontal_ai", name: "通用型 AI", status: "active" }],
        },
      ],
    }));
    const data = buildFundingInsightsFrontstage(tempRoot);
    const rebuilt = buildFundingInsightsFrontstage(tempRoot);
    assert.equal(data.cards.length, 1);
    assert.equal(data.meta.site_version, "SITE-V4.4.1-china-market-scope");
    assert.equal(data.meta.generated_at, "2026-07-26T09:00:00.000Z");
    assert.equal(rebuilt.meta.generated_at, data.meta.generated_at);
    assert.equal(data.cards[0].financing.investors[0].name, "Northstar Ventures");
    assert.deepEqual(data.cards[0].product_form, {
      dimension: "product_form",
      id: "enterprise_platform",
      name: "企业 AI 平台",
      method: "card_explicit",
      decision_id: "",
    });
    assert.deepEqual(data.cards[0].market_category, {
      dimension: "ai_market_category",
      id: "horizontal_ai",
      name: "通用型 AI",
      method: "card_explicit",
      decision_id: "",
    });
    assert.deepEqual(data.filters.market_categories, [{
      dimension: "ai_market_category",
      id: "horizontal_ai",
      name: "通用型 AI",
    }]);
    assert.deepEqual(data.filters.product_forms, [{
      dimension: "product_form",
      id: "enterprise_platform",
      name: "企业 AI 平台",
    }]);
    assert.match(data.cards[0].links.company, /detail=entity&id=EN-1/u);
    assert.match(data.cards[0].links.relation_map, /view=relations&entity=EN-1/u);
    assert.equal(data.cards[0].analysis.related_direction.title, "企业智能代理的可重复交付");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("融资透视页面使用应用中心新结构并声明自动数据入口", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/funding-insights.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/funding-insights.js"), "utf8");
  const styles = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/funding-insights.css"), "utf8");
  assert.match(html, /href="trend-radar\.html">变化雷达/u);
  assert.match(html, /href="intelligence-map\.html" aria-current="page">观澜研究/u);
  assert.doesNotMatch(html, /href="funding-insights\.html" aria-current="page">融资透视/u);
  assert.doesNotMatch(html, /href="opportunity-map\.html">机会地图/u);
  assert.match(html, /assets\/funding-insights\.js/u);
  assert.match(html, /<span>AI 市场类别<\/span>[\s\S]*<select name="market_category"><option value="">全部类别<\/option><\/select>/u);
  assert.doesNotMatch(html, /data-category-tabs|按赛道查看融资项目/u);
  assert.doesNotMatch(html, /data-status|fi-status/u);
  assert.match(html, /<form class="fi-controls"[\s\S]*name="query"[\s\S]*name="round"[\s\S]*name="market_category"[\s\S]*<\/form>/u);
  assert.match(script, /fillSelect\("market_category", data\.filters\?\.market_categories \|\| \[\]\)/u);
  assert.match(script, /card\.market_category\?\.id === marketCategory/u);
  assert.match(script, /收录于 \$\{escapeHtml\(card\.as_of_date/u);
  assert.match(script, /融资 \$\{escapeHtml\(card\.financing\?\.announced_at[\s\S]*· 收录/u);
  const cardTemplate = script.slice(
    script.indexOf('<article class="fi-card">'),
    script.indexOf('list.querySelectorAll("[data-open-id]")'),
  );
  assert.match(cardTemplate, /card\.company\?\.name[\s\S]*fi-card-round[\s\S]*<span>产品<\/span>[\s\S]*本轮融资[\s\S]*投资方[\s\S]*查看完整融资透视/u);
  const detailTemplate = script.slice(
    script.indexOf('<div class="fi-detail">'),
    script.indexOf("function openDetail"),
  );
  assert.match(detailTemplate, /fi-detail-hero[\s\S]*创始团队[\s\S]*本轮融资[\s\S]*投资逻辑[\s\S]*机构公开理由/u);
  assert.match(script, /other_round_investors/u);
  assert.match(detailTemplate, /历史或轮次未明[\s\S]*不计入本轮/u);
  assert.match(script, /investment_thesis[\s\S]*evidence_signals[\s\S]*institutional_rationale_status/u);
  assert.match(script, /customer_research[\s\S]*searched_source_count/u);
  assert.match(detailTemplate, /<h3>产品<\/h3>[\s\S]*<h3>目标客户<\/h3>[\s\S]*<h3>客户案例<\/h3>[\s\S]*<h3>关键数据<\/h3>/u);
  assert.match(detailTemplate, /产品 \/ 方案[\s\S]*应用场景[\s\S]*目标客户[\s\S]*融资[\s\S]*已证实差异/u);
  assert.doesNotMatch(detailTemplate, /尚待验证问题|产品与买方|客户与关键数据/u);
  assert.match(styles, /\.fi-list\s*\{[\s\S]*grid-template-columns:\s*repeat\(2,/u);
  assert.match(styles, /\.fi-detail-hero\s*\{[\s\S]*grid-template-columns:/u);
  assert.doesNotMatch(styles, /\.fi-fact-grid/u);
  const detailStyles = styles.slice(styles.indexOf(".fi-dialog {"));
  assert.match(detailStyles, /\.fi-detail h2\s*\{[\s\S]*--gl-type-detail-title-size[\s\S]*--gl-type-detail-title-line/u);
  assert.match(detailStyles, /\.fi-detail-deck\s*\{[\s\S]*--gl-type-detail-deck-size[\s\S]*--gl-type-detail-deck-line/u);
  assert.match(detailStyles, /\.fi-section h3\s*\{[\s\S]*--gl-type-detail-h2-size[\s\S]*--gl-type-detail-h2-line/u);
  assert.match(detailStyles, /\.fi-product p\s*\{[\s\S]*--gl-type-detail-body-size[\s\S]*--gl-type-detail-body-line/u);
  assert.doesNotMatch(detailStyles, /font-size:\s*(?:10|11)px|font-weight:\s*(?:650|700)/u);
});

test("融资透视产品方向使用受控应用层分类，不把自由文本赛道当作 TAG-V4 标签", () => {
  const chip = validCard();
  delete chip.analysis.product_form_id;
  chip.analysis.sector = "AI 推理芯片 / 半导体硬件";
  assert.equal(fundingProductFormId(chip), "chip_accelerator");

  const agentPlatform = validCard();
  delete agentPlatform.analysis.product_form_id;
  agentPlatform.analysis.sector = "企业 AI 智能体平台";
  assert.equal(fundingProductFormId(agentPlatform), "enterprise_platform");

  const application = validCard();
  delete application.analysis.product_form_id;
  application.analysis.sector = "餐饮科技 / AI 虚拟礼宾";
  application.company.summary = "";
  application.products = [];
  assert.equal(fundingProductFormId(application), "ai_application");
});

test("融资透视主产品形态优先使用卡片显式判断和人工复核，不再由关键词抢占", () => {
  const card = validCard();
  card.analysis.product_form_id = "data_infrastructure";
  const manual = new Map([["EV-1", {
    decision_id: "PF-TEST",
    product_form_id: "model",
  }]]);
  assert.deepEqual(fundingProductFormDecision(card, manual), {
    id: "data_infrastructure",
    method: "card_explicit",
    decision_id: "",
  });

  delete card.analysis.product_form_id;
  assert.deepEqual(fundingProductFormDecision(card, manual), {
    id: "model",
    method: "manual_review",
    decision_id: "PF-TEST",
  });
});

test("融资透视市场母分类优先使用卡片显式判断和人工复核", () => {
  const card = validCard();
  const manual = new Map([["EV-1", {
    decision_id: "PF-TEST",
    market_category_id: "vertical_ai",
  }]]);
  assert.deepEqual(fundingMarketCategoryDecision(card, manual, "enterprise_platform"), {
    id: "horizontal_ai",
    method: "card_explicit",
    decision_id: "",
  });
  delete card.analysis.market_category_id;
  assert.deepEqual(fundingMarketCategoryDecision(card, manual, "enterprise_platform"), {
    id: "vertical_ai",
    method: "manual_review",
    decision_id: "PF-TEST",
  });
});

test("七月50个来源案例去重为49家公司并完成双层分类复核", () => {
  const productForms = new Map(JSON.parse(fs.readFileSync(
    path.join(root, "agent-workflow/product/tag-taxonomy-v4.json"),
    "utf8",
  )).facets.find((facet) => facet.id === "product_form").values.map((value) => [value.id, value.name]));
  const decisions = productFormDecisionMap(root, productForms);
  const ledger = JSON.parse(fs.readFileSync(
    path.join(root, "01-SiteV2/content/12-applications/funding-insights/product-form-decisions.json"),
    "utf8",
  ));
  assert.equal(ledger.decisions.length, 49);
  assert.equal(ledger.meta.source_event_count, 52);
  assert.equal(decisions.get("EV-81bd541510a530f0").decision_id, "PF-202607-005");
  assert.equal(decisions.get("EV-439ba8d5f2f575c4").decision_id, "PF-202607-005");
  assert.equal(decisions.get("EV-20d762872664fddb").product_form_id, "data_infrastructure");
  assert.equal(decisions.get("EV-20d762872664fddb").market_category_id, "ai_infrastructure");
  assert.equal(decisions.get("EV-f6a72cddbda748b3").product_form_id, "enterprise_platform");
  assert.equal(decisions.get("EV-f6a72cddbda748b3").market_category_id, "horizontal_ai");
  assert.equal(decisions.get("EV-cded77b1de2db61a").product_form_id, "model");
  assert.equal(decisions.get("EV-6e516b6e68def9cf").product_form_id, "compute_service");
  assert.equal(decisions.get("EV-bffc68e7bb4d598b").market_category_id, "vertical_ai");
});
