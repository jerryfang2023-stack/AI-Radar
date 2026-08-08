#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildInvestmentInstitutionRegistry } from "../product/investment-institution-v1.mjs";

const __filename = fileURLToPath(import.meta.url);
const defaultRoot = path.resolve(path.dirname(__filename), "../..");

function readJson(file, fallback = {}) {
  if (!fs.existsSync(file)) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

export function writeInvestmentInstitutionRegistry(projectRoot = defaultRoot) {
  const funding = readJson(path.join(projectRoot, "01-SiteV2/site/data/funding-insights-v1.json"), { meta: {}, cards: [] });
  const entityIndex = readJson(path.join(projectRoot, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), {});
  const registry = buildInvestmentInstitutionRegistry(
    funding.cards || [],
    entityIndex,
    funding.meta?.generated_at || "",
  );
  const output = path.join(projectRoot, "01-SiteV2/content/11-databases/investment-institutions-v1.json");
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(registry, null, 2)}\n`, "utf8");
  return { output, registry };
}

if (path.resolve(process.argv[1] || "") === __filename) {
  const { output, registry } = writeInvestmentInstitutionRegistry();
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(defaultRoot, output).replace(/\\/gu, "/"),
    institutions: registry.meta.institution_count,
    evidence_backed: registry.meta.evidence_backed_count,
    current_round_activities: registry.meta.current_round_activity_count,
  }, null, 2));
}
