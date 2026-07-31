#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  chinaMarketLaneQueries,
  chinaMarketOrganizationAliases,
  loadChinaMarketConfig,
  mergeChinaMarketSources,
} from "./lib/china-market-v1.mjs";
import { loadSourceIntakeEntries } from "./lib/source-intake-v1.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const date = process.argv.find((value) => value.startsWith("--date="))?.slice("--date=".length) || "";
const config = loadChinaMarketConfig(root);
const mergedSources = mergeChinaMarketSources([], config.sourceRegistry);
const rssSources = mergedSources.filter((source) => source.interface_type === "rss");
const keywordQueries = chinaMarketLaneQueries(config.monitoring, "keyword_search");
const organizationAliases = chinaMarketOrganizationAliases(config.entityAliases);
const facts = [];

if (date) {
  const intake = loadSourceIntakeEntries(root, date);
  if (!intake) throw new Error(`China market intake is missing for ${date}`);
  const invalidScope = intake.entries.filter(({ raw }) =>
    raw.source_region !== "CN"
    || raw.market_region !== "CN"
    || raw.china_market_match !== true
    || !raw.source_registry_id
  );
  if (invalidScope.length) {
    throw new Error(`China market intake has ${invalidScope.length} record(s) without explicit source/market scope`);
  }

  const batchRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", date);
  const readBatch = (name) => JSON.parse(fs.readFileSync(path.join(batchRoot, name), "utf8").replace(/^\uFEFF/u, ""));
  const events = readBatch("canonical-events.json");
  const claims = readBatch("claims.json");
  const rawIds = new Set(intake.entries.map(({ intake_document: document }) => document.raw_id));
  const invalidClaims = claims.filter((claim) => !rawIds.has(claim.raw_id));
  if (invalidClaims.length) {
    throw new Error(`China market batch has ${invalidClaims.length} claim(s) outside the scoped intake`);
  }
  facts.push(
    `date=${date}`,
    `intake_documents=${intake.entries.length}`,
    `claims=${claims.length}`,
    `canonical_events=${events.length}`
  );
}

console.log([
  "China market V1 data passed",
  `sources=${mergedSources.length}`,
  `rss_sources=${rssSources.length}`,
  `keyword_queries=${keywordQueries.length}`,
  `organization_aliases=${organizationAliases.length}`,
  ...facts,
].join(" "));
