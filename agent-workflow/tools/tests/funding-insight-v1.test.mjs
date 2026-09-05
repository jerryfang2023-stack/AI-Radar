import assert from "node:assert/strict";
import childProcess from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INDUSTRY_IDS,
  FUNDING_INSIGHT_VERSION,
  FUNDING_TARGET_USER_IDS,
  FUNDING_USE_CASE_IDS,
  acceptedFundingCompanyIdentityForCard,
  acceptedFundingCompanyIdentityDecisions,
  buildFundingEntityReviewQueue,
  canonicalFundingEventAmount,
  ensureCanonicalFundingEvidence,
  ensureNamedCompanyEvidence,
  entityResolver,
  fundingEvidenceProofProblems,
  fundingEventCardConsistencyProblems,
  fundingDisclosureStatus,
  fundingInsightProblems,
  isEligibleFundingInsightEvent,
  normalizeFundingAmount,
  normalizeFounderRole,
  normalizeFundingRound,
  normalizeFundingInsightCard,
  partitionRoundInvestors,
  researchPayloadProblems,
  sanitizeResearchPayload,
  subjectCompanyForEvent,
  verifiedFundingEventCardCoverageProblems,
} from "../funding-insight-v1-utils.mjs";
import { canonicalSources } from "../generate-funding-insights-deepseek.mjs";
import {
  preserveFundingSourceChannels,
  verifiedFundingEventCount,
  verifiedFundingSourceUrls,
} from "../build-funding-source-health-v1.mjs";
import { resolveReviewedCompany } from "../project-funding-taxonomy-to-events-v4-1.mjs";

test("source health counts a verified event whose existing card is reused by deduplication", () => {
  assert.equal(verifiedFundingEventCount({
    meta: { counts: { funding_events: 1, auto_published: 0, deduplicated: 1 } },
    cards: [],
    queue: [{ event_id: "EV-existing", status: "deduplicated" }],
  }), 1);
  assert.equal(verifiedFundingEventCount({
    meta: { counts: { funding_events: 1, auto_published: 0, blocked: 1, deduplicated: 0 } },
    cards: [],
    queue: [{ event_id: "EV-blocked", status: "blocked" }],
  }), 0);
  assert.deepEqual([...verifiedFundingSourceUrls({
    cards: [],
    queue: [{ event_id: "EV-existing", status: "deduplicated" }],
  }, {
    cards: [{
      triggered_by_event_id: "EV-existing",
      source_event_ids: ["EV-existing", "EV-secondary"],
      research_sources: [{ source_url: "https://wonderful.ai/news?utm_source=test" }],
    }],
  }, [{
    event_id: "EV-existing",
    source_artifact_id: "SA-existing",
  }], [{
    source_artifact_id: "SA-existing",
    source_url: "https://www.wonderful.ai/news?scLang=en",
    canonical_url: "https://wonderful.ai/news?scLang=en",
  }])], [
    "https://wonderful.ai/news",
    "https://www.wonderful.ai/news",
  ]);
});

test("downstream funding projection cannot replace same-day source health with an empty cloud snapshot", () => {
  const previousChannels = [{ id: "keyword", fetched_count: 137, verified_event_count: 1 }];
  assert.deepEqual(preserveFundingSourceChannels([], {
    date: "2026-09-04",
    channels: previousChannels,
  }, "2026-09-04"), previousChannels);
  assert.deepEqual(preserveFundingSourceChannels([], {
    date: "2026-09-03",
    channels: previousChannels,
  }, "2026-09-04"), []);
  assert.deepEqual(preserveFundingSourceChannels([{ id: "rss" }], {
    date: "2026-09-04",
    channels: previousChannels,
  }, "2026-09-04"), [{ id: "rss" }]);
});

test("multi-company canonical funding events cannot publish a mismatched company amount", () => {
  const card = {
    company: { entity_id: "EN-SAMBA", name: "SambaNova Systems" },
    financing: { amount: "$312 million" },
    triggered_by_event_id: "EV-MULTI",
  };
  const event = {
    event_id: "EV-MULTI",
    entities: ["EN-OLIX", "EN-SAMBA"],
    claim_refs: ["CL-OLIX", "CL-SAMBA"],
  };
  const claims = [
    { claim_id: "CL-OLIX", subject: "OLIX", object: "$312 million" },
    { claim_id: "CL-SAMBA", subject: "SambaNova", object: "$1 billion" },
  ];
  const entities = [{ entity_id: "EN-SAMBA", canonical_name: "SambaNova" }];
  assert.deepEqual(
    fundingEventCardConsistencyProblems(card, event, claims, entities),
    ["funding_event_company_amount_mismatch"],
  );
});

test("multi-company funding cards can use the exact source quote when claim object is truncated", () => {
  const card = {
    company: { entity_id: "EN-LUMILENS", name: "Lumilens" },
    financing: { amount: "$700 million" },
    triggered_by_event_id: "EV-LUMILENS",
  };
  const event = {
    event_id: "EV-LUMILENS",
    entities: ["EN-LUMILENS", "EN-FOUNDER-ENTITY"],
    claim_refs: ["CL-LUMILENS"],
  };
  const claims = [{
    claim_id: "CL-LUMILENS",
    subject: "Optical networking startup Lumilens",
    object: "00M in funding - SiliconANGLE",
    source_quote: "The company raised the bulk of the capital, $700 million, through a Series C round.",
  }];
  const entities = [{ entity_id: "EN-LUMILENS", canonical_name: "Lumilens" }];
  assert.deepEqual(
    fundingEventCardConsistencyProblems(card, event, claims, entities),
    [],
  );
});

test("funding claim source quotes recover the funded company when a headline becomes the claim subject", () => {
  const card = {
    company: { entity_id: "EN-NEXUS", name: "奇点逃逸" },
    financing: { amount: "千万级" },
    triggered_by_event_id: "EV-NEXUS",
  };
  const event = {
    event_id: "EV-NEXUS",
    entities: ["EN-NEXUS", "EN-INVESTOR"],
    claim_refs: ["CL-NEXUS"],
  };
  const claims = [{
    claim_id: "CL-NEXUS",
    subject: "让Agent在协作中自进化，清华00后博士获千万元",
    object: "| 36氪首发",
    source_quote: "36氪获悉，近日奇点逃逸完成千万级种子轮融资。",
  }];
  const entities = [{ entity_id: "EN-NEXUS", canonical_name: "奇点逃逸" }];
  assert.deepEqual(fundingEventCardConsistencyProblems(card, event, claims, entities), []);
});
import { selectHistoricalFundingEvents } from "../backfill-funding-insights-history.mjs";
import { promptFor, selectFundingEventsForGeneration } from "../generate-funding-insights-deepseek.mjs";
import { assertFundingFounderReview, collectFundingFounderCandidates } from "../build-funding-founder-review.mjs";
import { inspectFundingInsightWork } from "../inspect-funding-insight-work.mjs";
import {
  aggregateFundingRoundCards,
  buildFundingInsightsFrontstage,
  dedupeFundingRounds,
  fundingMarketCategoryDecision,
  fundingProductFormDecision,
  fundingProductFormId,
  enrichFundingHistory,
} from "../../../01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs";
import {
  buildInvestmentInstitutionRegistry,
  investmentInstitutionId,
} from "../../product/investment-institution-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

test("canonical funding amount repairs a truncated K metric from the complete event metric", () => {
  assert.equal(canonicalFundingEventAmount({ metrics: ["$800", "$800,000"] }), "$800,000");
  assert.equal(canonicalFundingEventAmount({ metrics: ["$800K", "$800,000"] }), "$800K");
});

test("valuation-only fundraising talks cannot become a financing amount", () => {
  const event = {
    event_type: "funding",
    event_status: "announced",
    publication_status: "verified",
    display_title_zh: "Valor、Point72投资General Intuition，估值达60亿美元",
    object: "$6 billion pre-money valuation",
    metrics: ["$6 billion", "$320 million", "$2.3 billion"],
  };

  const claims = [{
    claim_id: "CL-GENERAL-INTUITION",
    claim_type: "funding",
    verification_status: "accepted",
    object: "$6 billion pre-money valuation",
    source_quote: "is in talks to raise funding at a $6 billion pre-money valuation",
  }];
  event.claim_refs = [claims[0].claim_id];

  assert.equal(canonicalFundingEventAmount(event, claims), "");
  assert.equal(isEligibleFundingInsightEvent(event, claims), false);
  assert.deepEqual(
    verifiedFundingEventCardCoverageProblems([event], [], [], claims),
    [],
    "a valuation-only event must not create a missing-card alert",
  );
});

test("a financing verb cannot turn its valuation into round proceeds", () => {
  const event = {
    event_type: "funding",
    event_status: "announced",
    publication_status: "verified",
    display_title_zh: "Acme 融资估值达60亿美元",
    object: "$6 billion pre-money valuation",
    metrics: ["$6 billion"],
  };

  assert.equal(canonicalFundingEventAmount(event), "");
  assert.equal(isEligibleFundingInsightEvent(event), false);
});

test("valuation-of and valued-at wording cannot become round proceeds", () => {
  for (const object of ["valuation of $6 billion", "valued at $6 billion"]) {
    const event = {
      event_type: "funding",
      event_status: "announced",
      publication_status: "verified",
      display_title_zh: `Acme funding ${object}`,
      object,
      metrics: ["$6 billion"],
    };
    assert.equal(canonicalFundingEventAmount(event), "");
    assert.equal(isEligibleFundingInsightEvent(event), false);
  }
});

test("fundraising talks remain ineligible even when described as a funding round", () => {
  const event = {
    event_type: "funding",
    event_status: "announced",
    publication_status: "verified",
    display_title_zh: "Acme is in talks for a $6 billion funding round",
    object: "$6 billion funding round",
    metrics: ["$6 billion"],
  };

  assert.equal(canonicalFundingEventAmount(event), "");
  assert.equal(isEligibleFundingInsightEvent(event), false);
});

test("common Chinese valuation continuations cannot become round proceeds", () => {
  for (const phrase of ["估值达到60亿美元", "估值超过60亿美元", "估值高达60亿美元"]) {
    const event = {
      event_type: "funding",
      event_status: "announced",
      publication_status: "verified",
      display_title_zh: `Acme 融资谈判${phrase}`,
      object: phrase,
      metrics: ["60亿美元"],
    };
    assert.equal(canonicalFundingEventAmount(event), "");
    assert.equal(isEligibleFundingInsightEvent(event), false);
  }
});

test("a disclosed financing amount remains eligible when valuation is also reported", () => {
  const event = {
    event_type: "funding",
    event_status: "announced",
    publication_status: "verified",
    display_title_zh: "Higgsfield 融资 4 亿美元，估值达 54 亿美元",
    object: "4 亿美元，估值达 54 亿美元",
    metrics: ["4 亿美元", "54 亿美元"],
  };

  assert.equal(canonicalFundingEventAmount(event), "4 亿美元");
  assert.equal(isEligibleFundingInsightEvent(event), true);
});

test("round amount selection does not depend on metric order", () => {
  const event = {
    event_type: "funding",
    event_status: "completed",
    publication_status: "verified",
    display_title_zh: "Acme raised $100M at a $1B valuation",
    object: "$100M at a $1B valuation",
    metrics: ["$1B", "$100M"],
  };

  assert.equal(canonicalFundingEventAmount(event), "$100M");
  assert.equal(isEligibleFundingInsightEvent(event), true);
});

test("Chinese post-amount financing wording identifies proceeds without a Latin word boundary", () => {
  for (const phrase of ["获得1.5亿美元融资", "获得1.5亿美元的Pre-B轮融资"]) {
    assert.equal(canonicalFundingEventAmount({ display_title_zh: phrase }), "1.5亿美元");
  }
});

test("financing that pushes valuation higher does not disclose round proceeds", () => {
  const event = {
    event_type: "funding", event_status: "completed", publication_status: "verified",
    display_title_zh: "这笔融资将公司估值推高至10亿美元。", metrics: ["10亿美元"],
    claim_refs: ["CL-VALUATION"],
  };
  const claims = [{ claim_id: "CL-VALUATION", claim_type: "funding", verification_status: "accepted",
    source_quote: event.display_title_zh }];
  assert.equal(canonicalFundingEventAmount(event, claims), "");
  assert.equal(isEligibleFundingInsightEvent(event, claims), false);
  const payload = ensureCanonicalFundingEvidence({ financing: { amount: "未披露" } }, { claims }, event);
  assert.equal(payload.financing.amount, "未披露");
});

test("Even Realities accepted evidence cannot overwrite proceeds with its unicorn valuation", () => {
  const claims = [
    "前苹果工程师的AI眼镜获得1.5亿美元融资",
    "Even Realities获得1.5亿美元融资，估值达10亿美元，用于AI扩张。",
    "Even Realities Technology，在获得包括美团和腾讯在内的投资者1.5亿美元的Pre-B轮融资后，正式成为独角兽企业。",
    "据 CNBC 报道，这笔融资将公司估值推高至10亿美元。",
  ].map((source_quote, index) => ({ claim_id: `CL-EVEN-${index}`, claim_type: "funding",
    verification_status: "accepted", subject: "Even Realities Technology", source_quote }));
  const event = { event_id: "EV-EVEN", display_title_zh: claims[0].source_quote,
    object: "- IDN Financials", metrics: ["1.5亿", "10亿"],
    claim_refs: claims.map((claim) => claim.claim_id) };
  assert.equal(canonicalFundingEventAmount(event, claims), "1.5亿美元");
  const payload = ensureCanonicalFundingEvidence({ financing: { amount: "1.5亿美元" } }, { claims }, event);
  assert.equal(payload.financing.amount, "1.5亿美元");
  for (const entities of [["EN-EVEN"], ["EN-EVEN", "EN-TENCENT"]]) {
    const card = { company: { entity_id: "EN-EVEN", name: "Even Realities Technology" },
      financing: { amount: "10亿美元" } };
    assert.ok(fundingEventCardConsistencyProblems(card, { ...event, entities }, claims)
      .includes("funding_amount_is_valuation"));
    card.financing.amount = "1.5亿美元";
    assert.deepEqual(fundingEventCardConsistencyProblems(card, { ...event, entities }, claims), []);
  }
  const evidenceCard = { financing: { amount: "10亿美元", evidence_refs: claims.map((claim) => ({ quote: claim.source_quote })) } };
  assert.ok(fundingEvidenceProofProblems(evidenceCard).includes("funding_amount_is_valuation"));
  evidenceCard.financing.amount = "1.5亿美元";
  assert.deepEqual(fundingEvidenceProofProblems(evidenceCard), []);
});

test("accepted Chinese proceeds quote supplies an English company name instead of a headline fragment", () => {
  const fragment = "前苹果工程师的AI眼镜获得1.5亿美元";
  const entity = { entity_id: "EN-EVEN", entity_type: "organization_candidate", canonical_name: fragment };
  const event = { event_id: "EV-EVEN", entities: [entity.entity_id], claim_refs: ["CL-EVEN"],
    display_title_zh: `${fragment}融资 - IDN Financials` };
  const claim = { claim_id: "CL-EVEN", subject: fragment, claim_type: "funding", verification_status: "accepted",
    source_quote: "Even Realities获得1.5亿美元融资，估值达10亿美元，用于AI扩张。" };
  assert.equal(subjectCompanyForEvent(event, [entity], {}, [claim]).canonical_name, "Even Realities");
  assert.equal(subjectCompanyForEvent(event, [entity], {}, [{ ...claim, verification_status: "pending" }])?.canonical_name === "Even Realities", false);
  for (const quote of ["Meituan完成对Even Realities的1.5亿美元融资领投。", "Tencent宣布完成对Even Realities的1.5亿美元融资。"] ) {
    const namedEntity = { ...entity, canonical_name: "Even Realities" };
    assert.equal(subjectCompanyForEvent(event, [namedEntity], {}, [{ ...claim,
      subject: namedEntity.canonical_name, source_quote: quote }]).canonical_name, "Even Realities");
    assert.equal(subjectCompanyForEvent(event, [entity], {}, [{ ...claim, source_quote: quote }]).canonical_name, fragment);
  }
});

test("funding research prompt enumerates every governed taxonomy list ID", () => {
  const prompt = promptFor(
    { event_id: "EV-1", display_title_zh: "示例融资", event_time: "2026-08-01", action: "融资", object: "A 轮", metrics: ["$10M"] },
    { entity_id: "EN-1", canonical_name: "Acme" },
    [{ source_id: "SRC-1", source_url: "https://example.test", source_class: "canonical_event_source", title: "Acme funding", body_clean: "Acme raised $10 million." }],
    [],
  );
  for (const id of [...FUNDING_USE_CASE_IDS, ...FUNDING_INDUSTRY_IDS, ...FUNDING_TARGET_USER_IDS]) {
    assert.match(prompt, new RegExp(`\\b${id}\\b`, "u"));
  }
});

test("Articul8 valuation-only disclosure is withdrawn from funding, not from canonical evidence", () => {
  const bundle = JSON.parse(fs.readFileSync(path.join(root,
    "01-SiteV2/content/12-applications/funding-insights/2026-08-20.json"), "utf8"));
  assert.ok(!bundle.cards.some((item) => item.funding_insight_id === "FI-168dcf41bf120176"));
  const queue = bundle.queue.find((item) => item.event_id === "EV-a81c5dc2e9abff3a");
  assert.equal(queue.status, "blocked");
  assert.ok(queue.problems.some((item) => item.startsWith("valuation_is_not_round_proceeds")));
  const events = JSON.parse(fs.readFileSync(path.join(root,
    "01-SiteV2/content/11-databases/data-center-v4/2026-08-20/canonical-events.json"), "utf8"));
  assert.ok(events.some((item) => item.event_id === "EV-a81c5dc2e9abff3a"));
});

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

test("write-mode taxonomy maintenance removes decisions for withdrawn cards", () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "funding-taxonomy-prune-"));
  const fundingRoot = path.join(tempRoot, "01-SiteV2/content/12-applications/funding-insights");
  const productRoot = path.join(tempRoot, "agent-workflow/product");
  fs.mkdirSync(fundingRoot, { recursive: true });
  fs.mkdirSync(productRoot, { recursive: true });
  fs.copyFileSync(
    path.join(root, "agent-workflow/product/tag-taxonomy-v4.json"),
    path.join(productRoot, "tag-taxonomy-v4.json"),
  );
  fs.writeFileSync(
    path.join(fundingRoot, "2026-08-25.json"),
    `${JSON.stringify({ cards: [] }, null, 2)}\n`,
  );
  fs.writeFileSync(
    path.join(fundingRoot, "taxonomy-decisions-v4-1.json"),
    `${JSON.stringify({
      meta: { schema_version: "FUNDING-TAXONOMY-DECISION-V1.0" },
      decisions: [{ event_id: "EV-WITHDRAWN" }],
    }, null, 2)}\n`,
  );

  childProcess.execFileSync(process.execPath, [
    path.join(root, "agent-workflow/tools/classify-funding-taxonomy-v4-1.mjs"),
    "--write=true",
  ], { cwd: tempRoot, stdio: "pipe" });

  const ledger = JSON.parse(fs.readFileSync(
    path.join(fundingRoot, "taxonomy-decisions-v4-1.json"),
    "utf8",
  ));
  assert.deepEqual(ledger.decisions, []);
  fs.rmSync(tempRoot, { recursive: true, force: true });
});

test("the withdrawn valuation-only card is absent from every funding projection", () => {
  for (const relativePath of [
    "01-SiteV2/content/12-applications/funding-insights/taxonomy-decisions-v4-1.json",
    "01-SiteV2/site/data/funding-insights-v1.json",
    "01-SiteV2/content/11-databases/investment-institutions-v1.json",
  ]) {
    assert.doesNotMatch(
      fs.readFileSync(path.join(root, relativePath), "utf8"),
      /EV-4a3fa2b57b7ce64a|EV-a81c5dc2e9abff3a/u,
      `${relativePath} must not retain the withdrawn valuation-only funding card`,
    );
  }
});

test("announced verified funding events remain eligible for card generation", () => {
  assert.equal(isEligibleFundingInsightEvent({
    event_type: "funding",
    event_status: "announced",
    publication_status: "verified",
    display_title_zh: "Acme 宣布完成 B 轮融资",
    object: "$10 million",
    metrics: ["$10 million"],
  }), true);
  assert.equal(isEligibleFundingInsightEvent({
    event_type: "funding",
    event_status: "planned",
    publication_status: "verified",
    display_title_zh: "Acme 计划融资",
  }), false);
});

test("subject company matching does not treat an organization prefix as an exact name", () => {
  const event = {
    event_id: "EV-INTELLIGENCE",
    display_title_zh: "Intelligence raises $7.9 million for DesignArena",
    action: "raises",
    object: "$7.9 million",
    metrics: ["$7.9 million"],
    entities: [],
    claim_refs: [],
  };
  const entityIndex = {
    companies: [{ id: "EN-INTEL", name: "Intel", aliases: [] }],
  };

  assert.equal(subjectCompanyForEvent(event, [], entityIndex), null);
});

test("canonical funding facts override same-name secondary research drift", () => {
  const payload = {
    company: { full_name: "June Health" },
    financing: {
      amount: "$2.4 million",
      round: "Seed",
      announced_at: "2026-06-20",
      evidence_refs: [{ source_id: "SRC-WRONG", quote: "June Health raised $2.4 million." }],
    },
  };
  const event = {
    event_id: "EV-JUNE",
    event_time: "2026-08-03T00:00:00.000Z",
    display_title_zh: "June 获得 2000 万美元 pre-seed 融资",
    object: "$20 million pre-seed funding",
    metrics: ["$20 million"],
    claim_refs: ["CL-JUNE"],
  };
  const bundle = {
    claims: [{
      claim_id: "CL-JUNE",
      raw_id: "RAW-JUNE",
      claim_type: "funding",
      verification_status: "accepted",
      source_quote: "the company raised $20 million in pre-seed funding",
    }],
  };
  const sources = [{
    source_id: "SRC-CANONICAL",
    raw_id: "RAW-JUNE",
    body_clean: "June emerged from stealth and the company raised $20 million in pre-seed funding.",
  }];

  ensureCanonicalFundingEvidence(payload, bundle, event, sources);
  assert.equal(payload.financing.amount, "$20 million");
  assert.equal(payload.financing.announced_at, "2026-08-03");
  assert.equal(normalizeFundingRound(payload.financing.round).code, "pre_seed");
  assert.equal(payload.financing.evidence_refs[0].source_id, "SRC-CANONICAL");
});

test("canonical funding evidence tolerates deterministic source whitespace normalization", () => {
  const payload = { financing: { evidence_refs: [] } };
  ensureCanonicalFundingEvidence(payload, {
    claims: [{
      claim_id: "CL-WHITESPACE",
      raw_id: "RAW-WHITESPACE",
      claim_type: "funding",
      source_quote: "Acme raised $20 million in Series A funding.",
      verification_status: "accepted",
    }],
  }, { claim_refs: ["CL-WHITESPACE"] }, [{
    source_id: "FISRC-WHITESPACE",
    raw_id: "RAW-WHITESPACE",
    body_clean: "Acme raised $20 million\n in Series A funding.",
  }]);
  assert.deepEqual(payload.financing.evidence_refs, [{
    source_id: "FISRC-WHITESPACE",
    quote: "Acme raised $20 million in Series A funding.",
  }]);
});

test("canonical source remains citable when private evidence body is unavailable", () => {
  const sources = canonicalSources({
    sourceArtifacts: [{
      source_artifact_id: "SA-BLACKSMITH",
      source_url: "https://techcrunch.com/blacksmith",
      publisher: "TechCrunch",
      captured_at: "2026-08-13T00:00:00.000Z",
      content_hash: "hash",
    }],
    rawDocuments: [{
      source_artifact_id: "SA-BLACKSMITH",
      raw_id: "RAW-BLACKSMITH",
      title_original: "Blacksmith raises $45 million",
    }],
    claims: [{
      claim_id: "CL-BLACKSMITH",
      raw_id: "RAW-BLACKSMITH",
      claim_type: "funding",
      verification_status: "accepted",
      source_quote: "Blacksmith has raised a new $45 million round.",
    }],
  }, {
    source_refs: ["SA-BLACKSMITH"],
    claim_refs: ["CL-BLACKSMITH"],
  });
  assert.equal(sources.length, 1);
  assert.equal(sources[0].source_class, "canonical_event_source");
  assert.match(sources[0].body_clean, /Blacksmith has raised a new \$45 million round/u);
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
      taxonomy_version: "TAG-V4.1",
      sector: "企业 AI",
      product_form_id: "enterprise_software_platform",
      market_category_id: "enterprise_applications",
      market_subcategory_id: "productivity_enterprise_workflows",
      market_application_id: "",
      use_case_ids: ["productivity_enterprise_workflows"],
      industry_ids: [],
      target_user_ids: ["business_user"],
      investment_rationale: [],
      capital_judgment: "资本押注的是可重复交付，而不是通用聊天入口。",
      validated_signals: ["已经形成企业工作流产品"],
      risks: ["客户部署周期仍然较长"],
      related_direction_id: "DIR-1",
    },
    entity_links: [],
    funding_history: [],
    research_sources: [
      { source_id: "SRC-1", title: "Funding", publisher: "Example", source_url: "https://example.com/funding", source_class: "canonical_event_source", content_hash: "source-one-hash" },
      { source_id: "SRC-2", title: "Product", publisher: "Acme", source_url: "https://acme.example/product", source_class: "official_candidate", content_hash: "source-two-hash" },
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

test("创始人常见英文职位统一为中文公开展示", () => {
  assert.equal(normalizeFounderRole("Founder"), "创始人");
  assert.equal(normalizeFounderRole("Co-Founder"), "联合创始人");
  assert.equal(normalizeFounderRole("Co-Founder & CEO"), "联合创始人兼 CEO");
  assert.equal(normalizeFounderRole("董事长"), "董事长");
});

test("创始人中间名变体合并为证据更完整的公开身份", () => {
  const card = validCard();
  card.company.founders = [
    { name: "Siddharth Tripathi", role: "Co-founder", evidence_refs: evidence("SRC-SHORT", "co-founder Siddharth Tripathi") },
    { name: "Siddharth Shankar Tripathi", role: "Founder, CEO", evidence_refs: evidence("SRC-FULL", "Siddharth Shankar Tripathi Founder, CEO") },
  ];
  const normalized = normalizeFundingInsightCard(card);
  assert.equal(normalized.company.founders.length, 1);
  assert.equal(normalized.company.founders[0].name, "Siddharth Shankar Tripathi");
  assert.equal(normalized.company.founders[0].evidence_refs.length, 2);
});

test("融资金额同时保留原文并生成可计算的币种、基准值和中文标准展示", () => {
  assert.deepEqual(normalizeFundingAmount("$312 million"), {
    currency: "USD",
    value: 312000000,
    min_value: null,
    max_value: null,
    unit: "base",
    status: "exact",
    display_zh: "3.12 亿美元",
  });
  assert.deepEqual(normalizeFundingAmount("近5亿元"), {
    currency: "CNY",
    value: 500000000,
    min_value: null,
    max_value: null,
    unit: "base",
    status: "approximate",
    display_zh: "约 5 亿元",
  });
  const lowerBound = normalizeFundingAmount("超过 €70 million");
  assert.equal(lowerBound.currency, "EUR");
  assert.equal(lowerBound.value, 70000000);
  assert.equal(lowerBound.min_value, 70000000);
  assert.equal(lowerBound.status, "lower_bound");
});

test("融资金额量级表达标准化为有边界的人民币区间且公开文案只显示元", () => {
  assert.deepEqual(normalizeFundingAmount("数亿元"), {
    currency: "CNY",
    value: null,
    min_value: 200000000,
    max_value: 900000000,
    unit: "base",
    status: "range",
    display_zh: "2 亿元–9 亿元",
  });
  assert.equal(normalizeFundingAmount("千万级").min_value, 10000000);
  assert.equal(normalizeFundingAmount("千万级").max_value, 100000000);
});

test("融资卡补齐金额原文、标准金额与融资披露状态", () => {
  const card = validCard();
  assert.equal(card.financing.amount_original, "$20M");
  assert.equal(card.financing.amount_normalized.value, 20000000);
  assert.equal(card.financing.total_raised_original, "$25M");
  assert.equal(card.financing.disclosure_status, "disclosed");
  card.financing.investors = [];
  card.financing.investor_disclosure_status = "not_disclosed";
  assert.equal(fundingDisclosureStatus(card.financing), "partially_disclosed");
});

test("融资历史按规范轮次形成稳定字段并计算已知轮次累计金额", () => {
  const seed = validCard();
  seed.funding_insight_id = "FI-SEED";
  seed.triggered_by_event_id = "EV-SEED";
  seed.source_event_ids = ["EV-SEED"];
  seed.financing.round = "种子轮";
  seed.financing.round_original = "Seed";
  seed.financing.amount = "$5M";
  seed.financing.amount_original = "$5M";
  const roundA = validCard();
  const cards = enrichFundingHistory([normalizeFundingInsightCard(seed), roundA]);
  assert.equal(cards[0].historical_rounds.length, 2);
  assert.equal(cards[0].financing.cumulative_amount.known_round_totals[0].value, 25000000);
});

test("已知轮次累计金额保留模糊金额区间而不是显示未披露", () => {
  const card = validCard();
  card.financing.amount = "数亿元";
  card.financing.total_raised = "";
  const [result] = enrichFundingHistory([normalizeFundingInsightCard(card)]);
  const cumulative = result.financing.cumulative_amount.known_round_totals[0];
  assert.equal(cumulative.status, "range");
  assert.equal(cumulative.min_value, 200000000);
  assert.equal(cumulative.max_value, 900000000);
  assert.equal(cumulative.display_zh, "2 亿元–9 亿元");
});

test("投资机构库只从融资卡精确投资方证据生成可追溯活动", () => {
  const card = validCard();
  card.market_scope = { market_region: "CN", china_market_match: true };
  card.financing.investors[0].institution_id = "ignored";
  const registry = buildInvestmentInstitutionRegistry([card], {}, card.published_at);
  assert.equal(registry.meta.institution_count, 1);
  assert.equal(registry.meta.current_round_activity_count, 1);
  assert.equal(registry.institutions[0].name, "Northstar Ventures");
  assert.equal(registry.institutions[0].investor_kind, "investment_institution");
  assert.equal(registry.institutions[0].activities[0].role_code, "lead");
  assert.equal(registry.institutions[0].activities[0].market_region, "CN");
  assert.equal(registry.institutions[0].china_market_activity_count, 1);
  assert.equal(registry.institutions[0].china_market_company_count, 1);
  assert.deepEqual(registry.institutions[0].market_regions, ["CN"]);
  assert.equal(registry.institutions[0].activities[0].evidence[0].quote, evidence()[0].quote);
});

test("投资机构活动按同轮次金额和精确引文去重并保留全部事件", () => {
  const first = validCard();
  const duplicate = validCard();
  duplicate.funding_insight_id = "FI-DUPLICATE";
  duplicate.triggered_by_event_id = "EV-DUPLICATE";
  duplicate.source_event_ids = ["EV-DUPLICATE"];
  duplicate.company.name = "Acme AI Labs Inc.";
  duplicate.financing.amount = "$20 million";
  const registry = buildInvestmentInstitutionRegistry([
    normalizeFundingInsightCard(first),
    normalizeFundingInsightCard(duplicate),
  ], {}, first.published_at);
  assert.equal(registry.meta.current_round_activity_count, 1);
  assert.deepEqual(registry.institutions[0].activities[0].event_ids.sort(), ["EV-1", "EV-DUPLICATE"]);
});

test("相同投资方引文和金额不能合并名称无关的被投公司", () => {
  const first = validCard();
  const other = validCard();
  other.funding_insight_id = "FI-OTHER-COMPANY";
  other.triggered_by_event_id = "EV-OTHER-COMPANY";
  other.company.entity_id = "EN-OTHER";
  other.company.application_entity_id = "EN-OTHER";
  other.company.name = "Different Robotics";
  const registry = buildInvestmentInstitutionRegistry([first, other], {}, first.published_at);
  assert.equal(registry.meta.current_round_activity_count, 2);
  assert.equal(new Set(registry.institutions[0].activities.map((item) => item.activity_id)).size, 2);
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

test("带历史披露月份的同名轮次投资方不能污染当前轮", () => {
  const result = partitionRoundInvestors([
    { name: "Nvidia", role: "本轮参投", evidence_refs: evidence() },
    { name: "FirstMark Capital", role: "种子轮参投（2025年12月首次披露）", evidence_refs: evidence() },
  ], "Seed", "2026-07-09");
  assert.deepEqual(result.current.map((item) => item.name), ["Nvidia"]);
  assert.deepEqual(result.other.map((item) => item.name), ["FirstMark Capital"]);
  assert.equal(result.other[0].classification_reason, "historical_disclosure_date");
});

test("投资机构别名使用稳定主体键合并且类型判断不受整句其他机构词污染", () => {
  const first = validCard();
  first.financing.investors = [{ ...first.financing.investors[0], name: "a16z" }];
  const duplicate = structuredClone(first);
  duplicate.funding_insight_id = "FI-ALIAS";
  duplicate.triggered_by_event_id = "EV-ALIAS";
  duplicate.financing.investors[0].name = "Andreessen Horowitz";
  const corporate = structuredClone(first);
  corporate.funding_insight_id = "FI-CORPORATE";
  corporate.triggered_by_event_id = "EV-CORPORATE";
  corporate.company.entity_id = "EN-OTHER";
  corporate.company.name = "Other Co";
  corporate.financing.investors = [{
    name: "Cisco",
    entity_id: "EN-CISCO",
    role: "本轮参投",
    evidence_refs: evidence("SRC-CISCO", "Cisco participated alongside Sequoia Capital and Founders Fund."),
  }];
  const registry = buildInvestmentInstitutionRegistry([first, duplicate, corporate], {
    companies: [{ id: "EN-CISCO", name: "Cisco", type: "公司/机构" }],
  }, first.published_at);
  const a16z = registry.institutions.find((item) => item.name === "Andreessen Horowitz");
  const cisco = registry.institutions.find((item) => item.name === "Cisco");
  assert.ok(a16z);
  assert.deepEqual(a16z.aliases, ["a16z"]);
  assert.equal(a16z.investor_kind, "investment_institution");
  assert.equal(cisco.investor_kind, "corporate_investor");
  assert.equal(
    investmentInstitutionId("a16z", "EN-OLD"),
    investmentInstitutionId("Andreessen Horowitz", "EN-NEW"),
  );
});

test("Y Combinator 保持稳定公开 ID 并明确归类为投资机构", () => {
  const card = validCard();
  card.financing.investors = [{
    name: "Y Combinator",
    entity_id: "EN-YC",
    role: "本轮参投",
    evidence_refs: evidence("SRC-YC", "Y Combinator participated in the round."),
  }];
  const abbreviated = structuredClone(card);
  abbreviated.funding_insight_id = "FI-YC-ABBREVIATED";
  abbreviated.triggered_by_event_id = "EV-YC-ABBREVIATED";
  abbreviated.financing.investors[0].name = "YC";
  const registry = buildInvestmentInstitutionRegistry([card, abbreviated], {
    companies: [{ id: "EN-YC", name: "Y Combinator", type: "公司/机构" }],
  }, card.published_at);
  assert.equal(investmentInstitutionId("Y Combinator", "EN-YC"), "INV-7a5c599caeb7de");
  assert.equal(investmentInstitutionId("YC", "EN-YC"), "INV-7a5c599caeb7de");
  assert.equal(registry.institutions.length, 1);
  assert.deepEqual(registry.institutions[0].aliases, ["YC"]);
  assert.equal(registry.institutions[0].investor_kind, "investment_institution");
  assert.equal(registry.institutions[0].investor_kind_label, "投资机构");
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
  card.market_scope = { market_region: "CN", china_market_match: true };
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
  assert.equal(queue.meta.china_market_candidates, 1);
  assert.equal(queue.meta.china_market_person_candidates, 1);
  assert.equal(queue.candidates[0].research_name, "Ada Lee");
  assert.deepEqual(queue.candidates[0].market_regions, ["CN"]);
  assert.equal(queue.candidates[0].china_market_match, true);
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
      object: "$20 million",
      metrics: ["$20 million"],
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

    fs.writeFileSync(output, `${JSON.stringify({
      cards: [],
      queue: [{ event_id: "EV-1", status: "deduplicated" }],
    })}\n`, "utf8");
    const deduplicated = inspectFundingInsightWork(projectRoot, "2026-07-26");
    assert.equal(deduplicated.needs_generation, false);
    assert.equal(deduplicated.auto_published, 1);
    assert.deepEqual(deduplicated.pending_event_ids, []);
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
    object: "$20 million",
    metrics: ["$20 million"],
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
      { event_id: "EV-1", event_type: "funding", publication_status: "verified", display_title_zh: "Acme 完成 A 轮融资", object: "$20 million", metrics: ["$20 million"] },
      { event_id: "EV-2", event_type: "funding", publication_status: "verified", display_title_zh: "Acme A 轮融资补充披露", object: "$20 million", metrics: ["$20 million"] },
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
      { event_id: "EV-1", event_type: "funding", event_status: "completed", publication_status: "verified", display_title_zh: "Acme 完成 A 轮融资", object: "$20 million", metrics: ["$20 million"] },
      { event_id: "EV-2", event_type: "funding", event_status: "completed", publication_status: "verified", display_title_zh: "Beta 完成种子轮融资", object: "$20 million", metrics: ["$20 million"] },
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
  const taxonomyClassifier = fs.readFileSync(
    path.join(root, "agent-workflow/tools/classify-funding-taxonomy-v4-1.mjs"),
    "utf8",
  );
  const taxonomyConsistencyGate = fs.readFileSync(
    path.join(root, "agent-workflow/tools/assert-taxonomy-consistency-v4-1.mjs"),
    "utf8",
  );
  assert.match(workflow, /workflow_run:[\s\S]*WaveSight Business Signals PR/u);
  assert.match(workflow, /inspect-funding-insight-work\.mjs/u);
  assert.match(workflow, /TAVILY_DISABLED: "false"/u);
  assert.match(workflow, /generate-funding-insights-deepseek\.mjs[\s\S]*assert-funding-insights-v1\.mjs[\s\S]*build-funding-insights-frontstage\.mjs/u);
  assert.match(workflow, /build-funding-insights-frontstage\.mjs[\s\S]*assert-funding-insights-v1\.mjs --all=true --frontstage=true/u);
  assert.match(workflow, /build-funding-insights-frontstage\.mjs[\s\S]*classify:funding-taxonomy-v4\.1 -- --write=true[\s\S]*assert-funding-insights-v1\.mjs --all=true --frontstage=true/u);
  assert.match(
    workflow,
    /classify:funding-taxonomy-v4\.1 -- --write=true --apply=true[\s\S]*project:funding-taxonomy-events[\s\S]*build-funding-insights-frontstage\.mjs[\s\S]*assert-funding-insights-v1\.mjs --all=true --frontstage=true/u,
    "the funding workflow must rebuild the frontstage after applying taxonomy decisions",
  );
  assert.match(workflow, /assert-funding-insights-v1\.mjs --all=true --frontstage=true[\s\S]*build:investment-institutions[\s\S]*assert:investment-institutions[\s\S]*build:data-center-site/u);
  assert.match(
    workflow,
    /git add[\s\S]*investment-institutions-v1\.json[\s\S]*"01-SiteV2\/site\/data\/data-center-v4"/u,
    "the funding workflow must persist the complete split Data Center projection",
  );
  assert.match(workflow, /git add[\s\S]*taxonomy-decisions-v4-1\.json/u);
  assert.doesNotMatch(workflow, /sync-funding-insights-to-obsidian\.mjs|vault\/20-Application-Center/u);
  assert.match(workflow, /automation\/funding-insights-\$\{RUN_DATE\}/u);
  assert.match(workflow, /push:[\s\S]*canonical-events\.json/u);
  assert.match(workflow, /startsWith\(github\.event\.head_commit\.message, 'Persist business signals for '\)/u);
  assert.match(workflow, /gh workflow run daily-funding-insights-pr\.yml --ref main -f date=/u);
  assert.match(workflow, /group: wavesight-funding-insights-\$\{\{ needs\.resolve-date\.outputs\.date \}\}/u);
  assert.match(workflow, /Wait for Funding Insights PR to reach main/u);
  assert.match(workflow, /gh workflow run github-pages\.yml --ref main -f source_sha=/u);
  assert.match(workflow, /wait-for-pages-deployment\.mjs --source-sha=/u);
  assert.match(workflow, /awaiting_portal/u);
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
  assert.match(
    taxonomyClassifier,
    /write && incrementalInputs\.length[\s\S]*const incremental = args\.get\("refresh"\) !== "true"[\s\S]*const existingOrder = existing\.map[\s\S]*const orderedEventIds = \[[\s\S]*const decisions = orderedEventIds\.map\(\(eventId\) => accumulated\.get\(eventId\)\)/u,
    "the taxonomy classifier must rebuild the ledger without reclassifying history or reordering accepted decisions",
  );
  assert.match(
    taxonomyClassifier,
    /staleLedgerDecisions[\s\S]*write && staleLedgerDecisions\.length[\s\S]*existingOrder = existing\.map[\s\S]*inputEventIds\.has/u,
    "write mode must prune taxonomy decisions whose source cards were withdrawn",
  );
  assert.match(
    taxonomyClassifier,
    /canonicalEventId = clean\(decision\.canonical_event_id\)[\s\S]*normalized\.canonical_event_id = canonicalEventId/u,
    "incremental taxonomy normalization must preserve reviewed canonical-event mappings",
  );
  assert.match(taxonomyConsistencyGate, /reviewedByDecisionEvent\.size !== decisionEventIds\.size/u);
  assert.doesNotMatch(taxonomyConsistencyGate, /reviewed funding coverage must be \d+/u);
  const fundingJob = workflow.slice(workflow.indexOf("  funding-insights-pr:"));
  assert.doesNotMatch(fundingJob, /steps\.run-date\.outputs\.date/u);
});

test("商业事件工作流原子发布融资卡、机构索引与数据中心投影", () => {
  const workflow = fs.readFileSync(
    path.join(root, ".github/workflows/daily-persistent-assets-pr.yml"),
    "utf8",
  );
  const fundingStep = workflow.slice(
    workflow.indexOf("      - name: Research, gate, and publish Funding Insights"),
    workflow.indexOf("      - name: Record funding supply health"),
  );
  const fundingCommit = workflow.slice(
    workflow.indexOf('          if [ "${{ steps.funding-insights.outcome }}" = "success" ]; then'),
    workflow.indexOf('          if [ "${{ steps.opportunity-map-v4.outcome }}" = "success" ]; then'),
  );
  assert.match(
    fundingStep,
    /build-funding-insights-frontstage\.mjs[\s\S]*build:investment-institutions[\s\S]*build:data-center-site[\s\S]*translate:public-structured-fields[\s\S]*classify:funding-taxonomy-v4\.1[\s\S]*project:funding-taxonomy-events[\s\S]*sync-light-data-lake[\s\S]*build:trend-radar-site[\s\S]*build:opportunity-map-site[\s\S]*assert:taxonomy-consistency[\s\S]*frontstage-regression-gate\.mjs/u,
    "business-signals publication must gate the complete funding projection before commit",
  );
  assert.match(
    fundingCommit,
    /if \[ "\$\{\{ steps\.funding-insights\.outcome \}\}" = "success" \]; then[\s\S]*reviewed-event-classifications\.json[\s\S]*taxonomy-decisions-v4-1\.json[\s\S]*investment-institutions-v1\.json[\s\S]*data-center-v4-frontstage\.json[\s\S]*site\/data\/data-center-v4[\s\S]*trend-radar-v1\.json[\s\S]*opportunity-evidence-v2\.json/u,
    "business-signals publication must stage the institution registry and split Data Center projection with funding cards",
  );
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

test("accepted funding claim subject takes precedence over investor names in the title", () => {
  const entities = [
    {
      entity_id: "EN-VOLTA",
      entity_type: "organization_candidate",
      canonical_name: "Volta Infra Holdings Ltd.",
    },
    {
      entity_id: "EN-NVIDIA",
      entity_type: "organization_candidate",
      canonical_name: "NVIDIA",
      aliases: ["Nvidia"],
      verification_status: "verified",
    },
  ];
  const claims = [{
    claim_id: "CL-VOLTA",
    claim_type: "funding",
    verification_status: "accepted",
    subject: "Volta Infra Holdings Ltd.",
    source_quote: "Volta Infra Holdings Ltd., a new artificial intelligence cloud company, has raised $300 million in venture funding",
  }];
  const event = {
    display_title_zh: "Nvidia, Dell Back AI Cloud Startup Volta at $2.4 Billion Value",
    action: "funding",
    object: "$300 million in venture funding",
    metrics: ["$300 million"],
    entities: ["EN-VOLTA", "EN-NVIDIA"],
    claim_refs: ["CL-VOLTA"],
  };

  assert.equal(subjectCompanyForEvent(event, entities, {}, claims)?.entity_id, "EN-VOLTA");
});

test("accepted funding claim quote can correct a descriptive founder-group subject to the funded startup", () => {
  const entities = [{
    entity_id: "EN-FOUNDERS",
    entity_type: "organization_candidate",
    canonical_name: "Ex-Spotify employees",
  }];
  const claims = [{
    claim_id: "CL-MALACHYTE",
    claim_type: "funding",
    verification_status: "accepted",
    subject: "Ex-Spotify employees",
    source_quote: "Now, the three are bringing a similar system to e-commerce with their new startup, Malachyte . The company on Thursday said it had raised $10 million in seed funding to scale distribution and hire more product and commercial leaders.",
  }];
  const event = {
    display_title_zh: "前 Spotify 员工筹集 1000 万美元，将推荐背后的 AI 引入电商",
    action: "funding",
    object: "$10 million in seed funding",
    metrics: ["$10 million"],
    entities: ["EN-FOUNDERS"],
    claim_refs: ["CL-MALACHYTE"],
  };

  const company = subjectCompanyForEvent(event, entities, {}, claims);
  assert.equal(company?.entity_id, "EN-FOUNDERS");
  assert.equal(company?.canonical_name, "Malachyte");
  assert.ok(company?.aliases?.includes("Ex-Spotify employees"));
});

test("accepted Chinese funding Claim corrects a descriptive subject to the legal company name", () => {
  const entities = [{
    entity_id: "EN-ETHERHEART",
    entity_type: "organization_candidate",
    canonical_name: "AI智能体基础设施公司“以太之心”",
  }];
  const claims = [{
    claim_id: "CL-ETHERHEART",
    claim_type: "funding",
    verification_status: "accepted",
    subject: "AI智能体基础设施公司“以太之心”",
    source_quote: "近日，国内AI智能体全栈技术研发企业——上海以太之心科技有限公司（以下简称“以太之心”）宣布完成数千万种子轮融资。",
  }];
  const event = {
    display_title_zh: "AI智能体基础设施公司“以太之心”完成数千万种子轮融资",
    action: "完成数千万种子轮融资",
    object: "",
    metrics: ["数千万"],
    entities: ["EN-ETHERHEART"],
    claim_refs: ["CL-ETHERHEART"],
  };

  const company = subjectCompanyForEvent(event, entities, {}, claims);
  assert.equal(company?.entity_id, "EN-ETHERHEART");
  assert.equal(company?.canonical_name, "上海以太之心科技有限公司");
  assert.ok(company?.aliases?.includes("AI智能体基础设施公司“以太之心”"));
});

test("Chinese funding titles resolve the company entity instead of a headline fragment", () => {
  const cases = [
    {
      title: "字节、阿里、美团罕见会师：自变量机器人获10亿元融资",
      expected: "EN-ZIBIANLIANG",
      entities: [
        { entity_id: "EN-FRAGMENT", entity_type: "organization_candidate", canonical_name: "字节、阿里、美团罕见会师：自变量机器人获10亿元" },
        { entity_id: "EN-ZIBIANLIANG", entity_type: "organization_candidate", canonical_name: "自变量机器人" },
      ],
    },
    {
      title: "开年最大融资诞生！银河通用再融25亿",
      expected: "EN-GALBOT",
      entities: [
        { entity_id: "EN-GENERIC", entity_type: "organization_candidate", canonical_name: "开年最大", verification_status: "candidate" },
        { entity_id: "EN-FRAGMENT", entity_type: "organization_candidate", canonical_name: "加上本次融资银河通用累计已斩", verification_status: "candidate" },
        { entity_id: "EN-GALBOT", entity_type: "organization_candidate", canonical_name: "银河通用", verification_status: "verified" },
      ],
    },
    {
      title: "灵初智能已完成20亿融资",
      expected: "EN-LINGCHU",
      entities: [
        { entity_id: "EN-FRAGMENT", entity_type: "organization_candidate", canonical_name: "灵初智能已" },
        { entity_id: "EN-LINGCHU", entity_type: "organization_candidate", canonical_name: "灵初智能" },
      ],
    },
    {
      title: "穹彻智能完成新一轮融资，锡创投加码人工智能大脑赛道",
      expected: "EN-NOEMATRIX",
      entities: [
        { entity_id: "EN-FRAGMENT", entity_type: "organization_candidate", canonical_name: "锡创动态 | 穹彻智能", verification_status: "candidate" },
        { entity_id: "EN-NOEMATRIX", entity_type: "organization_candidate", canonical_name: "穹彻智能", verification_status: "verified" },
      ],
    },
    {
      title: "让Agent在协作中自进化，清华00后博士获千万元融资",
      expected: "EN-SINGULARITY",
      entities: [
        { entity_id: "EN-FRAGMENT", entity_type: "organization_candidate", canonical_name: "让Agent在协作中自进化", verification_status: "candidate" },
        { entity_id: "EN-SINGULARITY", entity_type: "organization_candidate", canonical_name: "奇点逃逸", verification_status: "verified" },
      ],
      claims: [{
        claim_id: "CL-SINGULARITY",
        subject: "让Agent在协作中自进化",
        source_quote: "近日奇点逃逸完成千万级种子轮融资。",
      }],
    },
  ];
  for (const item of cases) {
    const event = {
      display_title_zh: item.title,
      action: "完成融资",
      object: "本轮融资",
      metrics: ["10亿元"],
      entities: item.entities.map((entity) => entity.entity_id),
      claim_refs: (item.claims || []).map((claim) => claim.claim_id),
    };
    assert.equal(subjectCompanyForEvent(event, item.entities, {}, item.claims || [])?.entity_id, item.expected);
  }
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

test("accepted Chinese descriptive funding subjects recover an application company without a canonical entity", () => {
  const claims = [{
    claim_id: "CL-HIGGSFIELD",
    claim_type: "funding",
    verification_status: "accepted",
    subject: "AI 视频生成平台 Higgsfield",
    object: "4 亿美元，估值达 54 亿美元",
    source_quote: "AI 视频生成平台 Higgsfield 已从投资者手中筹集 4 亿美元，估值达 54 亿美元。",
  }];
  const company = subjectCompanyForEvent({
    display_title_zh: "AI 视频生成平台 Higgsfield 融资 4 亿美元，估值达 54 亿美元",
    action: "融资",
    object: "4 亿美元，估值达 54 亿美元",
    metrics: ["4 亿美元"],
    entities: [],
    claim_refs: ["CL-HIGGSFIELD"],
  }, [], {}, claims);

  assert.equal(company?.canonical_name, "Higgsfield");
  assert.match(company?.entity_id || "", /^FICO-/u);
});

test("funding taxonomy projection preserves an existing application company id", () => {
  assert.deepEqual(resolveReviewedCompany({
    company: {
      entity_id: "FICO-50b2676afbe30c83",
      name: "Higgsfield Inc.",
      full_name: "Higgsfield Inc.",
    },
  }, new Map(), new Map()), {
    entity_id: "FICO-50b2676afbe30c83",
    company_name: "Higgsfield Inc.",
    resolution: "funding_application_entity",
  });
});

test("company normalization relinks a descriptive entity to the exact full-name entity", () => {
  const normalized = normalizeFundingInsightCard({
    ...validCard(),
    company: {
      ...validCard().company,
      entity_id: "EN-DESCRIPTIVE",
      name: "European AI chip startup Axelera",
      full_name: "Axelera AI",
    },
  }, {
    companies: [{
      id: "EN-AXELERA",
      name: "Axelera AI",
      aliases: [],
      type: "公司/机构",
    }],
  });

  assert.equal(normalized.company.entity_id, "EN-AXELERA");
  assert.equal(normalized.company.name, "Axelera AI");
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
      taxonomy_version: "TAG-V4.1",
      product_form_id: "enterprise_software_platform",
      market_category_id: "enterprise_applications",
      market_subcategory_id: "productivity_enterprise_workflows",
      market_application_id: "",
      use_case_ids: ["productivity_enterprise_workflows"],
      industry_ids: [],
      target_user_ids: ["business_user"],
      sector: "企业人工智能",
    },
  };
  assert.deepEqual(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]), []);
  payload.financing.investors[0].evidence_refs[0].quote = "source does not contain this";
  assert.ok(researchPayloadProblems(payload, [source, productSource], ["DIR-1"]).includes("investor_1_evidence_1_quote_mismatch"));
});

test("named investors recover an exact financing sentence when the model quote is not verbatim", () => {
  const body = "昆仑元AI宣布完成战略轮融资。本轮融资由长沙景美集成电路设计有限公司独家领投，投资金额人民币5000万元。";
  const payload = {
    financing: {
      evidence_refs: [],
      investors: [{
        name: "长沙景美集成电路设计有限公司",
        role: "本轮独家领投",
        evidence_refs: [{ source_id: "SRC-1", quote: "景美独家领投5000万元" }],
      }],
      other_round_investors: [],
    },
    products: [], customers: [], comparisons: [], metrics: [], quotes: [],
  };
  const sanitized = sanitizeResearchPayload(payload, [{ source_id: "SRC-1", body_clean: body }]);
  assert.deepEqual(sanitized.financing.investors[0].evidence_refs, [{
    source_id: "SRC-1",
    quote: "本轮融资由长沙景美集成电路设计有限公司独家领投，投资金额人民币5000万元。",
  }]);
});

test("company evidence recovers an exact source sentence from the canonical company name", () => {
  const payload = { company: { full_name: "穹彻智能科技有限公司", evidence_refs: [] } };
  ensureNamedCompanyEvidence(payload, { canonical_name: "穹彻智能" }, [{
    source_id: "SRC-1",
    body_clean: "锡创动态。穹彻智能完成新一轮融资，专注具身智能大脑研发。",
  }]);
  assert.deepEqual(payload.company.evidence_refs, [{
    source_id: "SRC-1",
    quote: "穹彻智能完成新一轮融资，专注具身智能大脑研发。",
  }]);
});

test("optional controlled taxonomy arrays discard unknown model values", () => {
  const payload = {
    financing: { investors: [], other_round_investors: [] },
    products: [], customers: [], comparisons: [], metrics: [], quotes: [],
    analysis: {
      use_case_ids: ["physical_automation", "invented_use_case"],
      industry_ids: ["retail_ecommerce", "robotics"],
      target_user_ids: ["consumer", "home_owner"],
      investment_rationale: [],
    },
  };
  const sanitized = sanitizeResearchPayload(payload, []);
  assert.deepEqual(sanitized.analysis.use_case_ids, ["physical_automation"]);
  assert.deepEqual(sanitized.analysis.industry_ids, ["retail_ecommerce"]);
  assert.deepEqual(sanitized.analysis.target_user_ids, ["consumer"]);
});

test("infrastructure application IDs restore their unique parent subcategory", () => {
  const payload = {
    financing: { investors: [], other_round_investors: [] },
    products: [], customers: [], comparisons: [], metrics: [], quotes: [],
    analysis: {
      market_category_id: "infrastructure_compute",
      market_subcategory_id: "hardware_computing",
      market_application_id: "models",
      use_case_ids: [], industry_ids: [], target_user_ids: [], investment_rationale: [],
    },
  };
  const sanitized = sanitizeResearchPayload(payload, []);
  assert.equal(sanitized.analysis.market_subcategory_id, "development_deployment");
  assert.equal(sanitized.analysis.market_application_id, "models");
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
      taxonomy_version: "TAG-V4.1",
      product_form_id: "end_user_application",
      market_category_id: "industry_applications",
      market_subcategory_id: "industrials",
      market_application_id: "",
      use_case_ids: ["physical_automation"],
      industry_ids: ["manufacturing"],
      target_user_ids: ["business_user"],
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
      taxonomy_version: "TAG-V4.1",
      product_form_id: "enterprise_software_platform",
      market_category_id: "enterprise_applications",
      market_subcategory_id: "productivity_enterprise_workflows",
      market_application_id: "",
      use_case_ids: ["productivity_enterprise_workflows"],
      industry_ids: [],
      target_user_ids: ["business_user"],
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
    company: {
      founders: [{ name: "", role: "", evidence_refs: evidence("SRC-1", "Northstar invested in Acme.") }],
    },
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
  assert.deepEqual(payload.company.founders, []);
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

test("同一公司相隔较久的同名同额轮次保持为不同融资事件", () => {
  const first = validCard();
  first.financing.announced_at = "2026-01-10";
  const later = structuredClone(first);
  later.triggered_by_event_id = "EV-LATER";
  later.financing.announced_at = "2026-07-10";
  assert.equal(aggregateFundingRoundCards([first, later]).length, 2);
});

test("错误共用规范实体 ID 的不同融资公司在应用层被隔离", () => {
  const gradium = validCard();
  gradium.company = { ...gradium.company, entity_id: "EN-NVIDIA", name: "NVIDIA", full_name: "Gradium" };
  gradium.funding_history = [
    { event_id: gradium.triggered_by_event_id },
    { event_id: "EV-UNRELATED-NVIDIA" },
  ];
  const upscale = structuredClone(gradium);
  upscale.triggered_by_event_id = "EV-UPSCALE";
  upscale.company.full_name = "Upscale AI";
  upscale.funding_history = [
    { event_id: upscale.triggered_by_event_id },
    { event_id: "EV-UNRELATED-NVIDIA" },
  ];
  const cards = enrichFundingHistory(aggregateFundingRoundCards([gradium, upscale], {
    companies: [{ id: "EN-NVIDIA", name: "NVIDIA", type: "公司/机构" }],
  }));
  assert.equal(cards.length, 2);
  assert.deepEqual(cards.map((card) => card.company.name).sort(), ["Gradium", "Upscale AI"]);
  assert.equal(new Set(cards.map((card) => card.company.application_entity_id)).size, 2);
  assert.ok(cards.every((card) => card.company.entity_id === "EN-NVIDIA"));
  assert.ok(cards.every((card) => card.company.canonical_entity_consistent === false));
  assert.ok(cards.every((card) => card.historical_rounds.length === 1));
  assert.deepEqual(
    cards.map((card) => card.funding_history.map((item) => item.event_id)),
    [[gradium.triggered_by_event_id], ["EV-UPSCALE"]],
  );
});

test("重复披露冲突时累计融资保留同币种较完整的最高来源披露", () => {
  const complete = validCard();
  complete.financing.total_raised = "$800M";
  complete.published_at = "2026-07-01T00:00:00Z";
  const newer = structuredClone(complete);
  newer.triggered_by_event_id = "EV-NEWER";
  newer.financing.total_raised = "$700M";
  newer.published_at = "2026-08-01T00:00:00Z";
  const [card] = enrichFundingHistory(aggregateFundingRoundCards([complete, newer]));
  assert.equal(card.financing.cumulative_amount.normalized.value, 800000000);
  assert.equal(card.financing.cumulative_amount.original, "$800M");
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

test("经审核的公司名称可将历史应用身份对齐到新出现的规范实体", () => {
  const card = validCard();
  card.company.entity_id = "FICO-higgsfield";
  card.company.name = "Higgsfield Inc.";
  card.company.full_name = "Higgsfield Inc.";
  const identityReview = {
    decisions: [{
      decision_id: "FICID-HIGGSFIELD",
      entity_id: "FICO-higgsfield",
      application_entity_id: "EN-higgsfield",
      current: { name: "Higgsfield Inc.", catalog_type: "company" },
      match_names: ["Higgsfield", "Higgsfield Inc."],
      action: "correct",
      merge_into_entity_id: "",
      canonical: { name: "Higgsfield", catalog_type: "company" },
      review_status: "accepted",
      evidence: { source_url: "https://example.com/higgsfield", quote: "Higgsfield Inc. is a company" },
      rationale: "reviewed exact company identity",
    }],
  };
  const normalized = normalizeFundingInsightCard(card, {}, {}, identityReview);
  assert.equal(normalized.company.entity_id, "EN-higgsfield");
  assert.equal(normalized.company.application_entity_id, "EN-higgsfield");
  assert.equal(normalized.company.canonical_entity_consistent, true);
  assert.equal(acceptedFundingCompanyIdentityDecisions(identityReview).get("FICO-higgsfield"), undefined);
  assert.equal(acceptedFundingCompanyIdentityForCard(identityReview, card.company).id, "EN-higgsfield");
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
          values: [{ id: "enterprise_software_platform", name: "企业软件平台", status: "active" }],
        },
        {
          id: "ai_market_category",
          values: [{ id: "enterprise_applications", name: "企业级应用", status: "active" }],
        },
        {
          id: "ai_market_subcategory",
          values: [{ id: "productivity_enterprise_workflows", name: "生产力与企业工作流", status: "active" }],
        },
        {
          id: "ai_market_application",
          values: [{ id: "models", name: "模型", status: "active" }],
        },
      ],
    }));
    const data = buildFundingInsightsFrontstage(tempRoot);
    const rebuilt = buildFundingInsightsFrontstage(tempRoot);
    assert.equal(data.cards.length, 1);
    assert.equal(data.meta.site_version, "SITE-V4.6.1-research-retirement");
    assert.equal(data.meta.generated_at, "2026-07-26T09:00:00.000Z");
    assert.equal(rebuilt.meta.generated_at, data.meta.generated_at);
    assert.equal(data.cards[0].financing.investors[0].name, "Northstar Ventures");
    assert.deepEqual(data.cards[0].product_form, {
      dimension: "product_form",
      id: "enterprise_software_platform",
      name: "企业软件平台",
      method: "card_explicit",
      decision_id: "",
    });
    assert.deepEqual(data.cards[0].market_category, {
      dimension: "ai_market_category",
      id: "enterprise_applications",
      name: "企业级应用",
      method: "card_explicit",
      decision_id: "",
    });
    assert.deepEqual(data.filters.market_categories, [{
      dimension: "ai_market_category",
      id: "enterprise_applications",
      name: "企业级应用",
    }]);
    assert.deepEqual(data.filters.product_forms, [{
      dimension: "product_form",
      id: "enterprise_software_platform",
      name: "企业软件平台",
    }]);
    assert.match(data.cards[0].links.company, /detail=entity&id=EN-1/u);
    assert.match(data.cards[0].links.relation_map, /view=relations&entity=EN-1/u);
    assert.equal(data.cards[0].analysis.related_direction.title, "企业智能代理的可重复交付");
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test("旧融资透视页面跳转到独立融资站且保留旧前台资产的回归覆盖", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/funding-insights.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/funding-insights.js"), "utf8");
  const styles = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/funding-insights.css"), "utf8");
  assert.match(html, /url=https:\/\/www\.zkdlj\.vip\/#home/u);
  assert.match(html, /location\.replace\("https:\/\/www\.zkdlj\.vip\/#home"\)/u);
  assert.doesNotMatch(html, /dc-sidebar|fi-controls|funding-insights\.js/u);
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
  assert.match(script, /amount_normalized\?\.currency !== "CNY"[\s\S]*amount_original/u);
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
  chip.analysis.product_form_id = "chip_accelerator";
  chip.analysis.sector = "AI 推理芯片 / 半导体硬件";
  assert.equal(fundingProductFormId(chip), "chip_accelerator");
  delete chip.analysis.product_form_id;
  assert.throws(() => fundingProductFormId(chip), /missing explicit product_form_id/u);
});

test("融资透视主产品形态必须来自源卡显式判断，缺失时前台失败关闭", () => {
  const card = validCard();
  card.analysis.product_form_id = "ai_infrastructure_software";
  assert.deepEqual(fundingProductFormDecision(card), {
    id: "ai_infrastructure_software",
    method: "card_explicit",
    decision_id: "",
  });

  delete card.analysis.product_form_id;
  assert.throws(() => fundingProductFormDecision(card), /missing explicit product_form_id/u);
});

test("融资透视市场母分类必须来自源卡显式判断，缺失时前台失败关闭", () => {
  const card = validCard();
  assert.deepEqual(fundingMarketCategoryDecision(card), {
    id: "enterprise_applications",
    method: "card_explicit",
    decision_id: "",
  });
  delete card.analysis.market_category_id;
  assert.throws(() => fundingMarketCategoryDecision(card), /missing explicit market_category_id/u);
});

test("全部历史融资事件都有 CB 2026 层级与产品形态复核决定", () => {
  const ledger = JSON.parse(fs.readFileSync(
    path.join(root, "01-SiteV2/content/12-applications/funding-insights/taxonomy-decisions-v4-1.json"),
    "utf8",
  ));
  const decisions = new Map(ledger.decisions.map((decision) => [decision.event_id, decision]));
  assert.equal(ledger.meta.taxonomy_version, "TAG-V4.1");
  assert.equal(ledger.decisions.length, ledger.meta.decision_count);
  assert.ok(ledger.decisions.length >= 220);
  assert.equal(decisions.get("EV-20d762872664fddb").market_category_id, "infrastructure_compute");
  assert.equal(decisions.get("EV-cded77b1de2db61a").product_form_id, "model");
  assert.equal(decisions.get("EV-6e516b6e68def9cf").product_form_id, "compute_cloud_service");
  assert.equal(decisions.get("EV-bffc68e7bb4d598b").market_category_id, "industry_applications");
});
