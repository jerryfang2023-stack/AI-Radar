#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v3.json");
const STRUCTURED_DIMENSIONS = new Set([
  "event_type", "source_type", "geography", "region", "entity", "company", "customer", "industry",
  "organization_function", "function", "workflow", "product_form", "deployment_stage", "evidence_type"
]);

export function validateTaxonomy(taxonomy) {
  const failures = [];
  if (taxonomy.taxonomy_version !== "TAG-V3.0") failures.push("taxonomy_version must be TAG-V3.0");
  if (taxonomy.assignment_contract?.source !== "accepted_claim_only") failures.push("assignment source must be accepted_claim_only");
  if (taxonomy.assignment_contract?.evidence_ref_required !== true || taxonomy.assignment_contract?.source_span_required !== true) failures.push("evidence_ref and source_span must be required");
  if (taxonomy.assignment_contract?.ranking_input !== false || taxonomy.assignment_contract?.eligibility_input !== false) failures.push("tags cannot be ranking or eligibility inputs");
  if (taxonomy.assignment_contract?.default_tags?.length) failures.push("default tags are forbidden");
  if (taxonomy.admission_contract?.automatic_creation !== false) failures.push("automatic tag creation is forbidden");
  if (taxonomy.admission_contract?.minimum_independent_claims !== 3 || taxonomy.admission_contract?.manual_approval_allowed !== true) failures.push("new tags require three independent Claims or manual approval");
  if (taxonomy.deprecation_contract?.new_assertions_blocked !== true || taxonomy.deprecation_contract?.historical_assertions_preserved !== true) failures.push("deprecated tags must block new assertions and preserve history");

  const ids = new Set();
  const names = new Set();
  const aliases = new Map();
  for (const tag of taxonomy.tags || []) {
    if (!/^[a-z][a-z0-9_]*$/u.test(tag.id || "")) failures.push(`invalid tag id: ${tag.id || "missing"}`);
    if (ids.has(tag.id)) failures.push(`duplicate tag id: ${tag.id}`);
    ids.add(tag.id);
    if (STRUCTURED_DIMENSIONS.has(tag.id)) failures.push(`structured dimension cannot be a tag: ${tag.id}`);
    const normalizedName = String(tag.name || "").toLowerCase();
    if (!normalizedName || names.has(normalizedName)) failures.push(`missing or duplicate tag name: ${tag.name || tag.id}`);
    names.add(normalizedName);
    if (!tag.definition || !Array.isArray(tag.includes) || !Array.isArray(tag.excludes) || !Array.isArray(tag.aliases)) failures.push(`${tag.id}: definition/includes/excludes/aliases required`);
    if (!tag.includes?.length) failures.push(`${tag.id}: at least one explicit evidence term required`);
    if (!['active', 'deprecated'].includes(tag.status)) failures.push(`${tag.id}: invalid status`);
    for (const alias of tag.aliases || []) {
      if (ids.has(alias) || aliases.has(alias)) failures.push(`${tag.id}: alias conflict ${alias}`);
      aliases.set(alias, tag.id);
    }
  }
  for (const tag of taxonomy.tags || []) {
    if (tag.parent && !ids.has(tag.parent)) failures.push(`${tag.id}: unknown parent ${tag.parent}`);
    if (tag.parent === tag.id) failures.push(`${tag.id}: tag cannot parent itself`);
    if ((tag.includes || []).some((term) => {
      const value = normalize(term);
      return /\p{Script=Han}/u.test(value) ? [...value].length < 2 : value.length < 3;
    })) failures.push(`${tag.id}: over-broad include term`);
    const includeSet = new Set((tag.includes || []).map(normalize));
    for (const term of tag.excludes || []) if (includeSet.has(normalize(term))) failures.push(`${tag.id}: include/exclude conflict ${term}`);
  }
  return { ok: failures.length === 0, failures, counts: { tags: ids.size, aliases: aliases.size } };
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function main() {
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, "utf8").replace(/^\uFEFF/u, ""));
  const result = validateTaxonomy(taxonomy);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) main();
