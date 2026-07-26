#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_FRONTSTAGE_VERSION,
  FUNDING_INSIGHT_VERSION,
  fundingInsightProblems,
  readJson,
  writeJson,
} from "../../../agent-workflow/tools/funding-insight-v1-utils.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function listBundles(projectRoot) {
  const dir = path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file))
    .sort()
    .map((file) => readJson(path.join(dir, file)))
    .filter(Boolean);
}

function directionById(projectRoot) {
  const data = readJson(path.join(projectRoot, "01-SiteV2/site/data/industry-reports-frontstage.json"), {});
  return new Map((data.directionCards || []).map((card) => [card.id, { id: card.id, title: card.title }]));
}

export function buildFundingInsightsFrontstage(projectRoot = root) {
  const bundles = listBundles(projectRoot);
  const directions = directionById(projectRoot);
  const entityIndex = readJson(path.join(projectRoot, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), {});
  const relationshipEntityIds = new Set([
    ...(entityIndex.companies || []),
    ...(entityIndex.products || []),
    ...(entityIndex.people || []),
  ].map((entity) => entity.id));
  const cardByEvent = new Map();
  for (const bundle of bundles) {
    for (const card of bundle.cards || []) {
      if (fundingInsightProblems(card).length) continue;
      const current = cardByEvent.get(card.triggered_by_event_id);
      if (!current || card.published_at > current.published_at) cardByEvent.set(card.triggered_by_event_id, card);
    }
  }
  const cards = [...cardByEvent.values()]
    .sort((left, right) => {
      const leftDate = left.financing.announced_at || left.as_of_date;
      const rightDate = right.financing.announced_at || right.as_of_date;
      return rightDate.localeCompare(leftDate) || right.published_at.localeCompare(left.published_at);
    })
    .map((card) => ({
      ...card,
      analysis: {
        ...card.analysis,
        related_direction: directions.get(card.analysis?.related_direction_id) || null,
      },
      links: {
        company: `data-center.html?view=index&detail=entity&id=${encodeURIComponent(card.company.entity_id)}`,
        relation_map: relationshipEntityIds.has(card.company.entity_id)
          ? `data-center.html?view=relations&entity=${encodeURIComponent(card.company.entity_id)}`
          : "",
        funding_event: `data-center.html?view=events&detail=event&id=${encodeURIComponent(card.triggered_by_event_id)}`,
        direction: card.analysis?.related_direction_id ? "opportunity-map.html#direction-cards" : "",
      },
    }));
  const latestDate = bundles.map((bundle) => bundle.meta?.date || "").sort().at(-1) || "";
  return {
    meta: {
      schema_version: FUNDING_INSIGHT_FRONTSTAGE_VERSION,
      funding_insight_version: FUNDING_INSIGHT_VERSION,
      site_version: "SITE-V4.2.0-entity-history",
      column_version: "FUNDING-INSIGHT-V1.0-auto-published-research",
      latest_date: latestDate,
      generated_at: new Date().toISOString(),
      card_count: cards.length,
      automatic_publication: true,
    },
    filters: {
      rounds: [...new Set(cards.map((card) => card.financing.round).filter(Boolean))].sort(),
      sectors: [...new Set(cards.map((card) => card.analysis?.sector).filter(Boolean))].sort(),
      directions: [...new Map(cards
        .map((card) => card.analysis?.related_direction)
        .filter(Boolean)
        .map((item) => [item.id, item])).values()],
    },
    cards,
  };
}

export function writeFundingInsightsFrontstage(projectRoot = root) {
  const data = buildFundingInsightsFrontstage(projectRoot);
  const output = path.join(projectRoot, "01-SiteV2/site/data/funding-insights-v1.json");
  writeJson(output, data);
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(projectRoot, output).replace(/\\/gu, "/"),
    cards: data.cards.length,
    latest_date: data.meta.latest_date,
  }, null, 2));
  return data;
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) writeFundingInsightsFrontstage(root);
