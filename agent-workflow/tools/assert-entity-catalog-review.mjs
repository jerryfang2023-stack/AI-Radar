#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ledgerPath = path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/entity-catalog-review-decisions.json");
const personLedgerPath = path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/person-account-review-decisions.json");
const phase2Path = path.join(root, "agent-workflow/reports/entity-catalog-deepseek-audit-phase2.json");
const claimsPath = path.join(root, "data-lake/tables/claims.jsonl");
const entitiesPath = path.join(root, "data-lake/tables/entities.jsonl");
const frontstagePath = path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json");
const viewpointsPath = path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json");

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
  const personLedger = readJson(personLedgerPath);
  const phase2 = readJson(phase2Path);
  const claimIds = new Set(readJsonl(claimsPath).map((claim) => claim.claim_id));
  const entityIds = new Set(readJsonl(entitiesPath).map((entity) => entity.entity_id));
  const decisions = ledger.decisions || [];
  const personDecisions = personLedger.decisions || [];
  const problems = [];
  const allowedActions = new Set(["confirm", "correct", "merge", "quarantine"]);
  const allowedTypes = new Set(["company", "product", "person", "other"]);
  const phase2Ids = new Set((phase2.reviews || []).map((review) => review.entity_id));
  const decisionIds = new Set(decisions.map((decision) => decision.entity_id));
  if (ledger.schema_version !== "ENTITY-CATALOG-REVIEW-V1") problems.push("schema_version must be ENTITY-CATALOG-REVIEW-V1");
  if (phase2.summary?.reviewed !== 476 || phase2Ids.size !== 476) problems.push("phase2 must contain 476 unique reviewed entities");
  if (decisions.length !== 476 || decisionIds.size !== 476) problems.push("ledger must contain 476 unique decisions");
  const personDecisionIds = new Set(personDecisions.map((decision) => decision.entity_id));
  if (personLedger.schema_version !== "ENTITY-PERSON-ACCOUNT-REVIEW-V1") problems.push("person review schema_version must be ENTITY-PERSON-ACCOUNT-REVIEW-V1");
  if (personLedger.summary?.candidates !== 37 || personLedger.summary?.inherited_catalog_decisions !== 3) problems.push("person review must cover 37 candidates with 3 inherited catalog decisions");
  if (personDecisions.length !== 34 || personDecisionIds.size !== 34) problems.push("person review ledger must contain 34 unique new decisions");
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
  for (const decision of personDecisions) {
    if (!allowedActions.has(decision.action) || decision.action === "merge") problems.push(`invalid person review action: ${decision.entity_id}`);
    if (!allowedTypes.has(decision.canonical?.catalog_type)) problems.push(`invalid person canonical type: ${decision.entity_id}`);
    if (decision.review_status !== "accepted" || !clean(decision.reviewer) || !clean(decision.reviewed_at)) problems.push(`missing explicit person review: ${decision.entity_id}`);
    if (!clean(decision.current?.name) || !clean(decision.canonical?.name)) problems.push(`missing person review name: ${decision.entity_id}`);
    if (decision.action === "quarantine" && decision.canonical?.catalog_type !== "other") problems.push(`quarantined account must use other type: ${decision.entity_id}`);
    if (decision.action !== "quarantine" && decision.canonical?.catalog_type !== "person") problems.push(`accepted person must use person type: ${decision.entity_id}`);
    if (!clean(decision.rationale)) problems.push(`person review requires rationale: ${decision.entity_id}`);
    for (const evidence of decision.evidence?.secondary_sources || []) {
      if (!clean(evidence.source_id) || !/^https?:\/\//u.test(evidence.source_url || "") || !clean(evidence.quote)) problems.push(`invalid person evidence: ${decision.entity_id}`);
    }
    if (!(decision.evidence?.secondary_sources || []).length) problems.push(`person review requires source evidence: ${decision.entity_id}`);
  }
  const inheritedPersonDecisions = decisions.filter((decision) => decision.canonical?.catalog_type === "person");
  const allPersonDecisions = [...inheritedPersonDecisions, ...personDecisions];
  if (allPersonDecisions.length !== 37 || new Set(allPersonDecisions.map((decision) => decision.entity_id)).size !== 37) problems.push("combined person review coverage must be 37/37");
  if (allPersonDecisions.filter((decision) => decision.action === "quarantine").length !== 6) problems.push("person review must quarantine 6 non-natural accounts");
  const summaryCount = ["confirm", "correct", "merge", "quarantine"].reduce((sum, action) => sum + decisions.filter((item) => item.action === action).length, 0);
  if (summaryCount !== 476) problems.push("action totals do not close to 476");
  if (fs.existsSync(frontstagePath)) {
    const frontstage = readJson(frontstagePath);
    const viewpoints = readJson(viewpointsPath);
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
    const combinedPersonById = new Map(allPersonDecisions.map((decision) => [decision.entity_id, decision]));
    const publicPeople = frontstage.people || [];
    if (publicPeople.length !== 31) problems.push(`public natural-person count must be 31, found ${publicPeople.length}`);
    for (const person of publicPeople) {
      const decision = combinedPersonById.get(person.id);
      if (!decision || !["confirm", "correct"].includes(decision.action) || decision.canonical?.catalog_type !== "person") problems.push(`public person lacks accepted natural-person review: ${person.id}`);
      else if (person.name !== decision.canonical.name) problems.push(`public person name mismatch: ${person.id}`);
    }
    for (const decision of personDecisions) {
      const profile = profilesById.get(decision.entity_id);
      if (decision.action === "quarantine" && profile) problems.push(`non-natural account remains in entity projection: ${decision.entity_id}`);
      if (["confirm", "correct"].includes(decision.action) && !profile) problems.push(`reviewed natural person missing from entity projection: ${decision.entity_id}`);
    }
    const forbiddenAccountNames = ["Ben's Bites AI Newsletter", "Claude", "Dataiku Blog", "Google Labs", "Tigera Blog (Calico / AI Security)", "TLDR AI Newsletter"];
    for (const name of forbiddenAccountNames) if (peopleByName.has(name)) problems.push(`non-natural account remains public: ${name}`);
    const correctedAuthors = new Map([
      ["Jack Clark", "Import AI (Jack Clark)"],
      ["Nathan Lambert", "Interconnects (Nathan Lambert)"],
      ["Lilian Weng", "Lilian Weng's Blog (OpenAI)"],
      ["Simon Willison", "Simon Willison's Blog"]
    ]);
    for (const [name, sourceAlias] of correctedAuthors) {
      const person = peopleByName.get(name);
      if (!person || !(person.aliases || []).includes(sourceAlias)) problems.push(`author normalization missing: ${sourceAlias} -> ${name}`);
    }
    if ((frontstage.viewpoints || []).length !== (viewpoints.remarks || []).length) problems.push("person review changed First-Line Viewpoints record count");
  }
  fail(problems);
  console.log(JSON.stringify({
    ok: true,
    reviewed: decisions.length + personDecisions.length,
    person_candidates_reviewed: 37,
    public_natural_people: 31,
    actions: Object.fromEntries(["confirm", "correct", "merge", "quarantine"].map((action) => [action, decisions.filter((item) => item.action === action).length])),
    person_actions: Object.fromEntries(["confirm", "correct", "quarantine"].map((action) => [action, personDecisions.filter((item) => item.action === action).length])),
    claim_refs: new Set(decisions.flatMap((decision) => decision.evidence?.claim_refs || [])).size,
    secondary_sources: new Set([...decisions, ...personDecisions].flatMap((decision) => decision.evidence?.secondary_sources || []).map((source) => source.source_id)).size
  }, null, 2));
}

main();
