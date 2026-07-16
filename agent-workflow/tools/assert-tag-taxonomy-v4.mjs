#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v4.json");
const STRUCTURED_DIMENSIONS = new Set([
  "event_type", "source_type", "geography", "region", "entity", "company", "customer",
  "industry", "organization_function", "function", "workflow", "use_case", "product_form",
  "deployment_model", "deployment_stage", "target_user", "evidence_type"
]);
const REQUIRED_FACETS = new Set(["product_form", "use_case", "industry", "deployment_model", "target_user"]);

function normalize(value) {
  return String(value || "").trim().toLocaleLowerCase();
}

function validateTerms(owner, definition, failures) {
  if (!definition.definition) failures.push(`${owner}: definition is required`);
  if (!Array.isArray(definition.includes) || !definition.includes.length) failures.push(`${owner}: includes must contain explicit evidence terms`);
  if (!Array.isArray(definition.excludes)) failures.push(`${owner}: excludes must be an array`);
  const includes = new Set((definition.includes || []).map(normalize));
  for (const term of definition.excludes || []) {
    if (includes.has(normalize(term))) failures.push(`${owner}: include/exclude conflict ${term}`);
  }
  for (const term of definition.includes || []) {
    const value = normalize(term);
    if (/\p{Script=Han}/u.test(value) ? [...value].length < 2 : value.length < 3) failures.push(`${owner}: over-broad include term ${term}`);
  }
}

export function validateTaxonomy(taxonomy) {
  const failures = [];
  if (taxonomy.taxonomy_version !== "TAG-V4.0") failures.push("taxonomy_version must be TAG-V4.0");
  if (taxonomy.assignment_contract?.source !== "accepted_claim_only") failures.push("assignment source must be accepted_claim_only");
  if (taxonomy.assignment_contract?.evidence_ref_required !== true || taxonomy.assignment_contract?.source_span_required !== true) failures.push("evidence_ref and source_span must be required");
  if (taxonomy.assignment_contract?.ranking_input !== false || taxonomy.assignment_contract?.eligibility_input !== false) failures.push("taxonomy cannot be a ranking or eligibility input");
  if (taxonomy.assignment_contract?.default_tags?.length) failures.push("default tags are forbidden");
  if (taxonomy.admission_contract?.automatic_creation !== false) failures.push("automatic creation is forbidden");
  if (taxonomy.admission_contract?.minimum_independent_claims !== 3 || taxonomy.admission_contract?.manual_approval_allowed !== true) failures.push("new definitions require three independent Claims or manual approval");
  if (!taxonomy.admission_contract?.manual_approval_ref) failures.push("manual approval reference is required for the V4 rebuild");

  const tagIds = new Set();
  const tagNames = new Set();
  const aliases = new Set();
  for (const tag of taxonomy.tags || []) {
    if (!/^[a-z][a-z0-9_]*$/u.test(tag.id || "")) failures.push(`invalid tag id: ${tag.id || "missing"}`);
    if (tagIds.has(tag.id)) failures.push(`duplicate tag id: ${tag.id}`);
    if (STRUCTURED_DIMENSIONS.has(tag.id)) failures.push(`structured dimension cannot be a technical tag: ${tag.id}`);
    tagIds.add(tag.id);
    const name = normalize(tag.name);
    if (!name || tagNames.has(name)) failures.push(`missing or duplicate tag name: ${tag.name || tag.id}`);
    tagNames.add(name);
    if (!tag.group) failures.push(`${tag.id}: technical group is required`);
    if (!Array.isArray(tag.aliases)) failures.push(`${tag.id}: aliases must be an array`);
    for (const alias of tag.aliases || []) {
      const key = normalize(alias);
      if (!key || aliases.has(key) || tagIds.has(alias)) failures.push(`${tag.id}: alias conflict ${alias}`);
      aliases.add(key);
    }
    if (!["active", "deprecated"].includes(tag.status)) failures.push(`${tag.id}: invalid status`);
    validateTerms(`tag ${tag.id}`, tag, failures);
  }
  for (const tag of taxonomy.tags || []) {
    if (tag.parent && !tagIds.has(tag.parent)) failures.push(`${tag.id}: unknown parent ${tag.parent}`);
    if (tag.parent === tag.id) failures.push(`${tag.id}: tag cannot parent itself`);
  }

  const facetIds = new Set();
  let facetValueCount = 0;
  for (const facet of taxonomy.facets || []) {
    if (!REQUIRED_FACETS.has(facet.id)) failures.push(`unknown structured facet: ${facet.id}`);
    if (facetIds.has(facet.id)) failures.push(`duplicate facet: ${facet.id}`);
    facetIds.add(facet.id);
    if (!facet.name || !facet.definition) failures.push(`${facet.id}: name and definition are required`);
    const valueIds = new Set();
    const valueNames = new Set();
    for (const value of facet.values || []) {
      facetValueCount += 1;
      if (!/^[a-z][a-z0-9_]*$/u.test(value.id || "")) failures.push(`${facet.id}: invalid value id ${value.id || "missing"}`);
      if (valueIds.has(value.id)) failures.push(`${facet.id}: duplicate value id ${value.id}`);
      valueIds.add(value.id);
      const name = normalize(value.name);
      if (!name || valueNames.has(name)) failures.push(`${facet.id}: missing or duplicate value name ${value.name || value.id}`);
      valueNames.add(name);
      if (!["active", "deprecated"].includes(value.status)) failures.push(`${facet.id}.${value.id}: invalid status`);
      validateTerms(`facet ${facet.id}.${value.id}`, { ...value, definition: facet.definition }, failures);
    }
    if (!valueIds.size) failures.push(`${facet.id}: at least one value is required`);
  }
  for (const required of REQUIRED_FACETS) if (!facetIds.has(required)) failures.push(`required facet missing: ${required}`);

  return {
    ok: failures.length === 0,
    failures,
    counts: {
      technical_tags: tagIds.size,
      aliases: aliases.size,
      facets: facetIds.size,
      facet_values: facetValueCount
    }
  };
}

function main() {
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, "utf8").replace(/^\uFEFF/u, ""));
  const result = validateTaxonomy(taxonomy);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
