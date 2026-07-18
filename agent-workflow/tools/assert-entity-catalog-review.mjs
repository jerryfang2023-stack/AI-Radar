#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ledgerPath = path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/entity-catalog-review-decisions.json");
const phase2Path = path.join(root, "agent-workflow/reports/entity-catalog-deepseek-audit-phase2.json");
const claimsPath = path.join(root, "data-lake/tables/claims.jsonl");
const entitiesPath = path.join(root, "data-lake/tables/entities.jsonl");
const frontstagePath = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function readJsonl(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
}

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function fail(problems) {
  if (!problems.length) return;
  throw new Error(`entity_catalog_review_gate_failed:\n- ${problems.join("\n- ")}`);
}

function main() {
  const ledger = readJson(ledgerPath);
  const phase2 = readJson(phase2Path);
  const claimIds = new Set(readJsonl(claimsPath).map((claim) => claim.claim_id));
  const entityIds = new Set(readJsonl(entitiesPath).map((entity) => entity.entity_id));
  const decisions = ledger.decisions || [];
  const problems = [];
  const allowedActions = new Set(["confirm", "correct", "merge", "quarantine"]);
  const allowedTypes = new Set(["company", "product", "person", "other"]);
  const phase2Ids = new Set((phase2.reviews || []).map((review) => review.entity_id));
  const decisionIds = new Set(decisions.map((decision) => decision.entity_id));
  if (ledger.schema_version !== "ENTITY-CATALOG-REVIEW-V1") problems.push("schema_version must be ENTITY-CATALOG-REVIEW-V1");
  if (phase2.summary?.reviewed !== 476 || phase2Ids.size !== 476) problems.push("phase2 must contain 476 unique reviewed entities");
  if (decisions.length !== 476 || decisionIds.size !== 476) problems.push("ledger must contain 476 unique decisions");
  for (const entityId of phase2Ids) if (!decisionIds.has(entityId)) problems.push(`missing decision: ${entityId}`);
  const byId = new Map(decisions.map((decision) => [decision.entity_id, decision]));
  for (const decision of decisions) {
    if (!allowedActions.has(decision.action)) problems.push(`invalid action: ${decision.entity_id}`);
    if (!allowedTypes.has(decision.canonical?.catalog_type)) problems.push(`invalid canonical type: ${decision.entity_id}`);
    if (decision.review_status !== "accepted" || !clean(decision.reviewer) || !clean(decision.reviewed_at)) problems.push(`missing explicit review: ${decision.entity_id}`);
    if (!clean(decision.canonical?.name)) problems.push(`missing canonical name: ${decision.entity_id}`);
    if (!Array.isArray(decision.canonical?.company_names)) problems.push(`company_names must be an array: ${decision.entity_id}`);
    if (decision.action === "merge") {
      const target = byId.get(decision.merge_into_entity_id);
      if ((!target && !entityIds.has(decision.merge_into_entity_id)) || target?.action === "quarantine" || target?.action === "merge") problems.push(`invalid merge target: ${decision.entity_id}`);
    }
    if (decision.action === "quarantine" && !clean(decision.rationale)) problems.push(`quarantine requires rationale: ${decision.entity_id}`);
    if (decision.action !== "quarantine") {
      for (const claimRef of decision.evidence?.claim_refs || []) if (!claimIds.has(claimRef)) problems.push(`unknown Claim: ${decision.entity_id}:${claimRef}`);
    }
    for (const evidence of decision.evidence?.secondary_sources || []) {
      if (!clean(evidence.source_id) || !/^https?:\/\//u.test(evidence.source_url || "") || !clean(evidence.quote)) problems.push(`invalid secondary evidence: ${decision.entity_id}`);
    }
  }
  const summaryCount = ["confirm", "correct", "merge", "quarantine"].reduce((sum, action) => sum + decisions.filter((item) => item.action === action).length, 0);
  if (summaryCount !== 476) problems.push("action totals do not close to 476");
  if (fs.existsSync(frontstagePath)) {
    const frontstage = readJson(frontstagePath);
    const profilesById = new Map((frontstage.entityProfiles || []).map((profile) => [profile.id, profile]));
    for (const decision of decisions) {
      const profile = profilesById.get(decision.entity_id);
      if (["quarantine", "merge"].includes(decision.action) && profile) problems.push(`retired entity remains public: ${decision.entity_id}`);
      if (decision.action === "merge" && !profilesById.has(decision.merge_into_entity_id)) problems.push(`merge target missing from projection: ${decision.entity_id}`);
      if (["confirm", "correct"].includes(decision.action)) {
        if (!profile) problems.push(`accepted entity missing from projection: ${decision.entity_id}`);
        else if (profile.name !== decision.canonical.name) problems.push(`projection name mismatch: ${decision.entity_id}`);
      }
    }
    const companiesByName = new Map((frontstage.companies || []).map((company) => [company.name, company]));
    const productsByName = new Map((frontstage.products || []).map((product) => [product.name, product]));
    const peopleByName = new Map((frontstage.people || []).map((person) => [person.name, person]));
    const requiredOwnership = [["1Password for Claude", "1Password"], ["Claude", "Anthropic"], ["ChatGPT", "OpenAI"], ["峰谷 Token", "阿里云"]];
    for (const [productName, companyName] of requiredOwnership) {
      const product = productsByName.get(productName);
      const company = companiesByName.get(companyName);
      if (!product || !company || !(product.companyIds || []).includes(company.id)) problems.push(`required ownership missing: ${productName}:${companyName}`);
    }
    if (!peopleByName.has("Clive Chan") || productsByName.has("Clive Chan")) problems.push("Clive Chan type correction missing");
  }
  fail(problems);
  console.log(JSON.stringify({
    ok: true,
    reviewed: decisions.length,
    actions: Object.fromEntries(["confirm", "correct", "merge", "quarantine"].map((action) => [action, decisions.filter((item) => item.action === action).length])),
    claim_refs: new Set(decisions.flatMap((decision) => decision.evidence?.claim_refs || [])).size,
    secondary_sources: new Set(decisions.flatMap((decision) => decision.evidence?.secondary_sources || []).map((source) => source.source_id)).size
  }, null, 2));
}

main();
