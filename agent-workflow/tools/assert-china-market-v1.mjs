#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  chinaMarketLaneQueries,
  chinaMarketOrganizationAliases,
  loadChinaMarketConfig,
  mergeChinaMarketSources,
  selectChinaMarketIntakeDocuments,
} from "./lib/china-market-v1.mjs";
import { readSourceIntake } from "./lib/source-intake-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const date = process.argv.find((value) => value.startsWith("--date="))?.slice("--date=".length) || "";
const stage = process.argv.find((value) => value.startsWith("--stage="))?.slice("--stage=".length) || "full";
if (!["intake", "bundle", "full"].includes(stage)) {
  throw new Error(`Invalid China market gate stage: ${stage}`);
}
const config = loadChinaMarketConfig(root);
const mergedSources = mergeChinaMarketSources([], config.sourceRegistry);
const rssSources = mergedSources.filter((source) => source.interface_type === "rss");
const keywordQueries = chinaMarketLaneQueries(config.monitoring, "keyword_search");
const organizationAliases = chinaMarketOrganizationAliases(config.entityAliases);
const facts = [];

if (date) {
  const intake = readSourceIntake(root, date);
  if (!intake) throw new Error(`China market intake is missing for ${date}`);
  const selected = selectChinaMarketIntakeDocuments(intake.payload.raw_documents);
  if (selected.invalidSourceDocuments.length) {
    throw new Error(`China market intake has ${selected.invalidSourceDocuments.length} CN source record(s) without a registry id`);
  }
  if (selected.invalidMarketDocuments.length) {
    throw new Error(`China market intake has ${selected.invalidMarketDocuments.length} market record(s) without explicit CN match scope`);
  }
  if (!selected.sourceDocuments.length && !selected.marketDocuments.length) {
    throw new Error(`China market intake has no traceable CN source or market records for ${date}`);
  }

  facts.push(
    `date=${date}`,
    `stage=${stage}`,
    `source_documents=${selected.sourceDocuments.length}`,
    `market_documents=${selected.marketDocuments.length}`,
  );

  if (stage !== "intake") {
    const batchRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", date);
    const readBatch = (name) => JSON.parse(fs.readFileSync(path.join(batchRoot, name), "utf8").replace(/^\uFEFF/u, ""));
    const events = readBatch("canonical-events.json");
    const claims = readBatch("claims.json");
    const eventClaims = readBatch("event-claims.json");
    const rawIds = new Set(
      [...selected.sourceDocuments, ...selected.marketDocuments].map((document) => document.raw_id),
    );
    const scopedClaims = claims.filter((claim) => rawIds.has(claim.raw_id));
    const claimIds = new Set(scopedClaims.map((claim) => claim.claim_id));
    const eventIds = new Set(
      eventClaims.filter((link) => claimIds.has(link.claim_id)).map((link) => link.event_id),
    );
    const scopedEvents = events.filter((event) => eventIds.has(event.event_id));
    const marketEvents = events.filter((event) => event.market_scope?.china_market_match === true);
    const allowedBasis = new Set([
      "actor_origin",
      "event_market",
      "regulatory_jurisdiction",
      "deployment_location",
    ]);
    for (const event of marketEvents) {
      if (event.event_type === "procurement_contract") {
        throw new Error(`${event.event_id}: procurement event must not enter the China market scope`);
      }
      if (event.market_scope.market_region !== "CN") {
        throw new Error(`${event.event_id}: China market event must declare market_region=CN`);
      }
      if (!event.market_scope.china_market_basis?.length
          || event.market_scope.china_market_basis.some((basis) => !allowedBasis.has(basis))) {
        throw new Error(`${event.event_id}: China market event has no controlled match basis`);
      }
      if (!event.market_scope.claim_refs?.length) {
        throw new Error(`${event.event_id}: China market event has no Claim provenance`);
      }
    }
    facts.push(
      `claims=${scopedClaims.length}`,
      `canonical_events=${scopedEvents.length}`,
      `market_events=${marketEvents.length}`,
    );
  }
}

console.log([
  "China market V1 data passed",
  `sources=${mergedSources.length}`,
  `rss_sources=${rssSources.length}`,
  `keyword_queries=${keywordQueries.length}`,
  `organization_aliases=${organizationAliases.length}`,
  ...facts,
].join(" "));
