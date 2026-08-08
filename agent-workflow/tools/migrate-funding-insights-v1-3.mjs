#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  FUNDING_INSIGHT_VERSION,
  normalizeFundingInsightCard,
  readJson,
  writeJson,
} from "./funding-insight-v1-utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "../..");
const write = process.argv.includes("--write=true");

export function migrateFundingInsightBundles(projectRoot = root, shouldWrite = false) {
  const directory = path.join(projectRoot, "01-SiteV2/content/12-applications/funding-insights");
  const entityIndex = readJson(path.join(projectRoot, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), {});
  const entityDecisions = readJson(path.join(directory, "entity-link-decisions.json"), {});
  const companyIdentityReview = readJson(path.join(directory, "company-identity-decisions.json"), {});
  const files = fs.readdirSync(directory).filter((file) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(file)).sort();
  let cards = 0;
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const bundle = readJson(fullPath, {});
    bundle.meta = { ...(bundle.meta || {}), schema_version: FUNDING_INSIGHT_VERSION };
    bundle.cards = (bundle.cards || []).map((card) => normalizeFundingInsightCard(
      card,
      entityIndex,
      entityDecisions,
      companyIdentityReview,
    ));
    cards += bundle.cards.length;
    if (shouldWrite) writeJson(fullPath, bundle);
  }
  return { files: files.length, cards, write: shouldWrite, schema_version: FUNDING_INSIGHT_VERSION };
}

if (path.resolve(process.argv[1] || "") === __filename) {
  console.log(JSON.stringify(migrateFundingInsightBundles(root, write), null, 2));
}
