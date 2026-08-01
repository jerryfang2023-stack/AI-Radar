#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  FUNDING_INSIGHT_FRONTSTAGE_VERSION,
  FUNDING_INSIGHT_GATE_VERSION,
  FUNDING_INSIGHT_VERSION,
  acceptedFundingEntityDecisions,
  fundingEvidenceProofProblems,
  fundingInsightProblems,
  latestDataDate,
  loadDailyBundle,
  readJson,
  verifiedFundingEventCardCoverageProblems,
} from "./funding-insight-v1-utils.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || latestDataDate(root);
const all = args.get("all") === "true";
const assertFrontstage = args.get("frontstage") === "true";
const input = path.resolve(args.get("input")
  || path.join(root, "01-SiteV2/content/12-applications/funding-insights", `${date}.json`));
const schemaFile = path.join(root, "agent-workflow/product/funding-insight-v1.schema.json");

function normalizedKey(value = "") {
  return String(value || "").normalize("NFKC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

function validateBundle(inputFile, validate) {
  const data = readJson(inputFile);
  if (!data) return { data: null, problems: [`funding_insight_bundle_missing:${inputFile}`] };
  const problems = [];
  if (data.meta?.schema_version !== FUNDING_INSIGHT_VERSION) problems.push("bundle_schema_version_invalid");
  if (data.meta?.auto_publish_gate !== FUNDING_INSIGHT_GATE_VERSION) problems.push("bundle_gate_version_invalid");
  if (data.meta?.human_review_required !== false) problems.push("automatic_publication_contract_missing");
  if (!Array.isArray(data.cards) || !Array.isArray(data.queue)) problems.push("bundle_arrays_missing");
  const seenEvents = new Set();
  for (const card of data.cards || []) {
    if (!validate(card)) {
      problems.push(`${card.funding_insight_id || "unknown"}:schema:${ajv.errorsText(validate.errors)}`);
    }
    for (const item of fundingInsightProblems(card)) problems.push(`${card.funding_insight_id || "unknown"}:${item}`);
    for (const item of fundingEvidenceProofProblems(card)) {
      problems.push(`${card.funding_insight_id || "unknown"}:${item}`);
    }
    if (seenEvents.has(card.triggered_by_event_id)) problems.push(`${card.triggered_by_event_id}:duplicate_published_card`);
    seenEvents.add(card.triggered_by_event_id);
    const sourceIds = new Set((card.research_sources || []).map((source) => source.source_id));
    const evidenceGroups = [
      card.company?.evidence_refs,
      card.financing?.evidence_refs,
      ...(card.financing?.investors || []).map((item) => item.evidence_refs),
      ...(card.financing?.other_round_investors || []).map((item) => item.evidence_refs),
      ...(card.products || []).map((item) => item.evidence_refs),
      ...(card.customers || []).map((item) => item.evidence_refs),
      ...(card.comparisons || []).map((item) => item.evidence_refs),
      ...(card.metrics || []).map((item) => item.evidence_refs),
      ...(card.analysis?.investment_rationale || []).map((item) => item.evidence_refs),
    ];
    for (const evidence of evidenceGroups.flat().filter(Boolean)) {
      if (!sourceIds.has(evidence.source_id)) problems.push(`${card.funding_insight_id}:evidence_source_unresolved:${evidence.source_id}`);
      if (!String(evidence.quote || "").trim()) problems.push(`${card.funding_insight_id}:evidence_quote_missing`);
    }
  }
  for (const queueItem of data.queue || []) {
    if (!["auto_published", "blocked", "pending", "deduplicated"].includes(queueItem.status)) {
      problems.push(`${queueItem.event_id || "unknown"}:queue_status_invalid`);
    }
    if (queueItem.status === "auto_published" && !seenEvents.has(queueItem.event_id)) {
      problems.push(`${queueItem.event_id}:published_queue_without_card`);
    }
  }
  return { data, problems };
}

function validateEntityReviewQueue(cards) {
  const queueFile = path.join(
    root,
    "01-SiteV2/content/12-applications/funding-insights/entity-review-queue.json",
  );
  const queue = readJson(queueFile, {});
  const candidateKeys = new Set((queue.candidates || []).map(
    (item) => `${item.candidate_kind}|${normalizedKey(item.research_name)}`,
  ));
  const problems = [];
  const expected = new Set();
  const cardEvidence = new Set();
  for (const card of cards) {
    for (const [kind, items] of [
      ["product", card.products || []],
      ["person", card.company?.founders || []],
    ]) {
      for (const item of items) {
        for (const evidence of item.evidence_refs || []) {
          cardEvidence.add([
            card.funding_insight_id,
            evidence.source_id,
            evidence.quote,
            evidence.source_content_hash,
            evidence.quote_hash,
          ].join("|"));
        }
        if (item.entity_id) continue;
        const key = `${kind}|${normalizedKey(item.name)}`;
        expected.add(key);
        if (!candidateKeys.has(key)) problems.push(`entity_review_candidate_missing:${key}`);
      }
    }
  }
  if (candidateKeys.size !== expected.size) problems.push("entity_review_candidate_count_mismatch");
  for (const item of queue.candidates || []) {
    if (
      item.status !== "pending_canonical_review"
      || item.reason !== "canonical_exact_match_missing"
      || !item.evidence_refs?.length
    ) problems.push(`entity_review_candidate_invalid:${item.candidate_id || item.research_name}`);
    for (const evidence of item.evidence_refs || []) {
      const resolved = (item.funding_insight_ids || []).some((fundingInsightId) => (
        cardEvidence.has([
          fundingInsightId,
          evidence.source_id,
          evidence.quote,
          evidence.source_content_hash,
          evidence.quote_hash,
        ].join("|"))
      ));
      if (!resolved) {
        problems.push(`entity_review_evidence_unresolved:${item.candidate_id || item.research_name}`);
      }
    }
  }
  return problems;
}

function validateEntityDecisions(cards) {
  const decisionsFile = path.join(
    root,
    "01-SiteV2/content/12-applications/funding-insights/entity-link-decisions.json",
  );
  const decisions = readJson(decisionsFile, {});
  const entityIndex = readJson(
    path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"),
    {},
  );
  const problems = [];
  if (decisions.meta?.schema_version !== "FUNDING-INSIGHT-ENTITY-DECISION-V1.0") {
    problems.push("entity_decision_schema_invalid");
  }
  const accepted = acceptedFundingEntityDecisions(entityIndex, decisions);
  const seen = new Set();
  for (const decision of decisions.decisions || []) {
    const key = `${decision.candidate_kind}|${normalizedKey(decision.research_name)}`;
    if (seen.has(key)) problems.push(`entity_decision_duplicate:${key}`);
    seen.add(key);
    if (decision.status !== "accepted" || !accepted.has(key)) {
      problems.push(`entity_decision_target_invalid:${decision.decision_id || key}`);
      continue;
    }
    const matchingItems = cards.flatMap((card) => (
      decision.candidate_kind === "product" ? card.products || [] : card.company?.founders || []
    )).filter((item) => normalizedKey(item.name) === normalizedKey(decision.research_name));
    if (!matchingItems.length) problems.push(`entity_decision_orphan:${key}`);
    if (matchingItems.some((item) => item.entity_id !== decision.canonical_entity_id)) {
      problems.push(`entity_decision_not_applied:${key}`);
    }
  }
  return problems;
}

function validateFrontstage() {
  const frontstageFile = path.join(root, "01-SiteV2/site/data/funding-insights-v1.json");
  const data = readJson(frontstageFile, {});
  const problems = [];
  if (data.meta?.schema_version !== FUNDING_INSIGHT_FRONTSTAGE_VERSION) {
    problems.push("frontstage_schema_version_invalid");
  }
  if (data.meta?.card_count !== (data.cards || []).length) problems.push("frontstage_card_count_invalid");
  const keys = new Set();
  for (const card of data.cards || []) {
    for (const item of fundingInsightProblems(card)) problems.push(`${card.funding_insight_id}:${item}`);
    for (const item of fundingEvidenceProofProblems(card)) {
      problems.push(`${card.funding_insight_id}:${item}`);
    }
    if (card.aggregation?.event_count !== card.source_event_ids?.length) {
      problems.push(`${card.funding_insight_id}:aggregation_event_count_invalid`);
    }
    const key = `${card.company?.entity_id || normalizedKey(card.company?.name)}|${card.financing?.round_code}`;
    if (keys.has(key)) problems.push(`frontstage_company_round_duplicate:${key}`);
    keys.add(key);
  }
  const filterRounds = new Set(data.filters?.rounds || []);
  const cardRounds = new Set((data.cards || []).map((card) => card.financing?.round).filter(Boolean));
  if (
    filterRounds.size !== cardRounds.size
    || [...cardRounds].some((round) => !filterRounds.has(round))
  ) problems.push("frontstage_round_filters_not_normalized");
  return problems;
}

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

function main() {
  const schema = readJson(schemaFile);
  const validate = ajv.compile(schema);
  const files = all
    ? fs.readdirSync(path.dirname(input))
      .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
      .sort()
      .map((file) => path.join(path.dirname(input), file))
    : [input];
  const results = files.map((file) => ({ file, ...validateBundle(file, validate) }));
  const cards = results.flatMap((result) => result.data?.cards || []);
  const problems = results.flatMap((result) => result.problems.map(
    (problem) => `${path.basename(result.file)}:${problem}`,
  ));
  const persistedCards = all
    ? cards
    : fs.readdirSync(path.dirname(input))
      .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
      .flatMap((file) => readJson(path.join(path.dirname(input), file), { cards: [] }).cards || []);
  const currentEvents = loadDailyBundle(root, date).events;
  const currentQueue = results.find((result) => result.data?.meta?.date === date)?.data?.queue || [];
  problems.push(...verifiedFundingEventCardCoverageProblems(currentEvents, persistedCards, currentQueue)
    .map((problem) => `${date}:${problem}`));
  if (all) {
    problems.push(...validateEntityReviewQueue(cards));
    problems.push(...validateEntityDecisions(cards));
  }
  if (assertFrontstage) problems.push(...validateFrontstage());
  if (problems.length) {
    console.error(JSON.stringify({ ok: false, files: files.length, problems }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({
    ok: true,
    files: files.length,
    date: all ? "all" : date,
    cards: cards.length,
    blocked: results.reduce(
      (sum, result) => sum + (result.data?.queue || []).filter((item) => item.status === "blocked").length,
      0,
    ),
    entity_review_queue_checked: all,
    frontstage_checked: assertFrontstage,
  }, null, 2));
}

main();
