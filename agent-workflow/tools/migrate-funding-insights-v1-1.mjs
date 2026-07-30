#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  FUNDING_INSIGHT_GATE_VERSION,
  FUNDING_INSIGHT_VERSION,
  buildFundingEntityReviewQueue,
  fundingInsightProblems,
  normalizeFundingInsightCard,
  readJson,
  writeJson,
} from "./funding-insight-v1-utils.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const write = args.get("write") === "true";
const fundingRoot = path.join(root, "01-SiteV2/content/12-applications/funding-insights");
const entityIndex = readJson(
  path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"),
  {},
);
const entityDecisions = readJson(
  path.join(fundingRoot, "entity-link-decisions.json"),
  {},
);

function main() {
  const files = fs.readdirSync(fundingRoot)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
    .sort();
  const allCards = [];
  const changedFiles = [];
  const problemRows = [];
  for (const file of files) {
    const input = path.join(fundingRoot, file);
    const bundle = readJson(input);
    const cards = (bundle.cards || []).map(
      (card) => normalizeFundingInsightCard(card, entityIndex, entityDecisions),
    );
    for (const card of cards) {
      const problems = fundingInsightProblems(card);
      if (problems.length) problemRows.push({ file, card: card.funding_insight_id, problems });
    }
    const cardEventIds = new Set(cards.map((card) => card.triggered_by_event_id));
    const queue = (bundle.queue || []).map((item) => (
      cardEventIds.has(item.event_id)
        ? { ...item, status: "auto_published", problems: [] }
        : item
    ));
    const output = {
      ...bundle,
      meta: {
        ...(bundle.meta || {}),
        schema_version: FUNDING_INSIGHT_VERSION,
        auto_publish_gate: FUNDING_INSIGHT_GATE_VERSION,
        normalization_contract: "company_and_normalized_round",
        counts: {
          ...(bundle.meta?.counts || {}),
          auto_published: cards.length,
          blocked: queue.filter((item) => item.status === "blocked").length,
          pending: queue.filter((item) => item.status === "pending").length,
        },
      },
      cards,
      queue,
    };
    allCards.push(...cards);
    const serialized = `${JSON.stringify(output, null, 2)}\n`;
    if (serialized !== fs.readFileSync(input, "utf8")) {
      changedFiles.push(file);
      if (write) fs.writeFileSync(input, serialized, "utf8");
    }
  }
  const queueValue = buildFundingEntityReviewQueue(allCards);
  const candidates = queueValue.candidates;
  const queueFile = path.join(fundingRoot, "entity-review-queue.json");
  if (write) writeJson(queueFile, queueValue);
  const result = {
    ok: problemRows.length === 0,
    mode: write ? "write" : "dry-run",
    files: files.length,
    changed_files: changedFiles.length,
    cards: allCards.length,
    round_labels: [...new Set(allCards.map((card) => card.financing.round))].sort(),
    current_investors: allCards.reduce((sum, card) => sum + card.financing.investors.length, 0),
    separated_other_round_investors: allCards.reduce(
      (sum, card) => sum + card.financing.other_round_investors.length,
      0,
    ),
    entity_review_candidates: candidates.length,
    problems: problemRows,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main();
