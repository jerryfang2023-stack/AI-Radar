import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_VERSION,
  ensureCanonicalFundingEvidence,
  fundingInsightProblems,
  researchPayloadProblems,
  sanitizeResearchPayload,
  subjectCompanyForEvent,
} from "../funding-insight-v1-utils.mjs";
import { selectHistoricalFundingEvents } from "../backfill-funding-insights-history.mjs";
import { inspectFundingInsightWork } from "../inspect-funding-insight-work.mjs";
import {
  buildFundingInsightsFrontstage,
  dedupeFundingRounds,
  fundingProductFormId,
} from "../../../01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs";

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
      investment_rationale: [],
      capital_judgment: "资本押注的是可重复交付，而不是通用聊天入口。",
      validated_signals: ["已经形成企业工作流产品"],
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
  assert.match(workflow, /workflow_run:[\s\S]*WaveSight Business Signals PR/u);
  assert.match(workflow, /inspect-funding-insight-work\.mjs/u);
  assert.match(workflow, /TAVILY_DISABLED: "false"/u);
  assert.match(workflow, /generate-funding-insights-deepseek\.mjs[\s\S]*assert-funding-insights-v1\.mjs[\s\S]*build-funding-insights-frontstage\.mjs[\s\S]*sync-funding-insights-to-obsidian\.mjs/u);
  assert.match(workflow, /automation\/funding-insights-\$\{RUN_DATE\}/u);
  assert.match(workflow, /push:[\s\S]*canonical-events\.json/u);
  assert.match(workflow, /startsWith\(github\.event\.head_commit\.message, 'Persist business signals for '\)/u);
  assert.match(workflow, /gh workflow run daily-funding-insights-pr\.yml --ref main -f date=/u);
  assert.match(workflow, /group: wavesight-funding-insights-\$\{\{ needs\.resolve-date\.outputs\.date \}\}/u);
  assert.match(workflow, /Wait for Funding Insights PR to reach main/u);
  assert.match(workflow, /gh workflow run github-pages\.yml --ref main -f source_sha=/u);
  assert.match(workflow, /gh run watch "\$run_id" --exit-status/u);
  assert.match(pagesWorkflow, /run-name: Deploy Frontstage to GitHub Pages \$\{\{ inputs\.source_sha \|\| github\.sha \}\}/u);
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
      sector: "企业人工智能",
    },
  };
  assert.deepEqual(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]), []);
  payload.financing.investors[0].evidence_refs[0].quote = "source does not contain this";
  assert.ok(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]).includes("investor_1_evidence_1_quote_mismatch"));
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
      facets: [{
        id: "product_form",
        values: [{ id: "enterprise_platform", name: "企业 AI 平台", status: "active" }],
      }],
    }));
    const data = buildFundingInsightsFrontstage(tempRoot);
    const rebuilt = buildFundingInsightsFrontstage(tempRoot);
    assert.equal(data.cards.length, 1);
    assert.equal(data.meta.site_version, "SITE-V4.3.0-compatibility-retired");
    assert.equal(data.meta.generated_at, "2026-07-26T09:00:00.000Z");
    assert.equal(rebuilt.meta.generated_at, data.meta.generated_at);
    assert.equal(data.cards[0].financing.investors[0].name, "Northstar Ventures");
    assert.deepEqual(data.cards[0].application_category, {
      dimension: "product_form",
      id: "enterprise_platform",
      name: "企业 AI 平台",
    });
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
  assert.match(html, /href="funding-insights\.html" aria-current="page">融资透视/u);
  assert.match(html, /href="opportunity-map\.html">机会地图/u);
  assert.match(html, /href="intelligence-map\.html">行业报告/u);
  assert.match(html, /assets\/funding-insights\.js/u);
  assert.match(html, /<span>产品方向<\/span>[\s\S]*<select name="product_form"><option value="">全部产品方向<\/option><\/select>/u);
  assert.doesNotMatch(html, /data-category-tabs|按赛道查看融资项目/u);
  assert.doesNotMatch(html, /data-status|fi-status/u);
  assert.match(html, /<form class="fi-controls"[\s\S]*name="query"[\s\S]*name="round"[\s\S]*name="product_form"[\s\S]*<\/form>/u);
  assert.match(script, /fillSelect\("product_form", data\.filters\?\.product_forms \|\| \[\]\)/u);
  assert.match(script, /card\.application_category\?\.id === productForm/u);
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
  chip.analysis.sector = "AI 推理芯片 / 半导体硬件";
  assert.equal(fundingProductFormId(chip), "chip_accelerator");

  const agentPlatform = validCard();
  agentPlatform.analysis.sector = "企业 AI 智能体平台";
  assert.equal(fundingProductFormId(agentPlatform), "enterprise_platform");

  const application = validCard();
  application.analysis.sector = "餐饮科技 / AI 虚拟礼宾";
  application.company.summary = "";
  application.products = [];
  assert.equal(fundingProductFormId(application), "ai_application");
});
