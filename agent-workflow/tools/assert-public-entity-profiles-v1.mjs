#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const file = path.join(root, "01-SiteV2/content/11-databases/public-entity-profiles-v1.json");
const coverageFile = path.join(root, "01-SiteV2/content/11-databases/public-entity-profile-coverage-v1.json");
const backlogFile = path.join(root, "01-SiteV2/content/11-databases/public-entity-profile-backlog-v1.json");
const investorFile = path.join(root, "01-SiteV2/content/11-databases/investment-institutions-v1.json");
const peopleIndexFile = path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json");
const schemaFile = path.join(root, "agent-workflow/product/public-entity-profiles-v1.schema.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const coverage = fs.existsSync(coverageFile) ? JSON.parse(fs.readFileSync(coverageFile, "utf8")) : null;
const backlog = fs.existsSync(backlogFile) ? JSON.parse(fs.readFileSync(backlogFile, "utf8")) : null;
const investorData = JSON.parse(fs.readFileSync(investorFile, "utf8"));
const peopleIndex = JSON.parse(fs.readFileSync(peopleIndexFile, "utf8"));
const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const problems = [];
const organizationKinds = new Set(["investment_institution", "corporate_investor", "government_fund"]);
if (!validate(data)) problems.push(ajv.errorsText(validate.errors));
if (coverage) {
  const complete = {
    ...data,
    institutions: { ...(coverage.institutions || {}), ...(data.institutions || {}) },
    people: { ...(coverage.people || {}), ...(data.people || {}) }
  };
  if (!validate(complete)) problems.push(`invalid_merged_profile_coverage:${ajv.errorsText(validate.errors)}`);
}
function assertSameIds(label, actualRows, expectedIds) {
  const actualIds = (actualRows || []).map((row) => row.id);
  if (new Set(actualIds).size !== actualIds.length) problems.push(`duplicate_backlog_ids:${label}`);
  const actual = new Set(actualIds);
  const expected = new Set(expectedIds);
  for (const id of expected) if (!actual.has(id)) problems.push(`missing_backlog_id:${label}:${id}`);
  for (const id of actual) if (!expected.has(id)) problems.push(`unexpected_backlog_id:${label}:${id}`);
}

if (!backlog || !coverage) {
  problems.push("missing_profile_coverage_or_backlog");
} else {
  const investors = investorData.institutions || [];
  const people = peopleIndex.people || [];
  assertSameIds("pending_identity_verification", backlog.pending_identity_verification,
    investors.filter((row) => row.investor_kind !== "individual" && !organizationKinds.has(row.investor_kind)).map((row) => row.id));
  assertSameIds("pending_investor_research", backlog.pending_investor_research,
    investors.filter((row) => (row.investor_kind === "individual" || organizationKinds.has(row.investor_kind))
      && coverage.institutions?.[row.id]?.coverage_status !== "researched").map((row) => row.id));
  assertSameIds("pending_people_research", backlog.pending_people_research,
    people.filter((row) => coverage.people?.[row.id]?.coverage_status !== "researched").map((row) => row.id));
  assertSameIds("unresolved_investors", backlog.unresolved_investors,
    investors.filter((row) => !coverage.institutions?.[row.id]).map((row) => row.id));
  assertSameIds("unresolved_people", backlog.unresolved_people,
    people.filter((row) => !coverage.people?.[row.id]).map((row) => row.id));
}

function validateProfile(profile, label) {
  const sources = new Map((profile.sources || []).map((source) => [source.source_id, source]));
  if (sources.size !== (profile.sources || []).length) problems.push(`duplicate_profile_source:${label}`);
  for (const source of profile.sources || []) {
    const normalizedQuote = String(source.quote || "").replace(/\s+/gu, " ").trim();
    const quoteHash = crypto.createHash("sha256").update(normalizedQuote).digest("hex");
    if (source.quote_hash !== quoteHash) problems.push(`invalid_profile_quote_hash:${label}:${source.source_id}`);
  }
  const refs = [
    ...(profile.facts || []).map((item) => item.source_id),
    ...(profile.milestones || []).map((item) => item.source_id),
    ...(profile.track_record || []).map((item) => item.source_id),
    ...(profile.contacts || []).map((item) => item.source_id),
    ...(profile.current_roles || []).map((item) => item.source_id),
    ...(profile.career || []).map((item) => item.source_id),
    ...(profile.education || []).map((item) => item.source_id)
  ];
  for (const sourceId of refs) if (!sources.has(sourceId)) problems.push(`unresolved_profile_source:${label}:${sourceId}`);
}

for (const [id, profile] of Object.entries(data.institutions || {})) validateProfile(profile, id);
for (const [id, profile] of Object.entries(data.people || {})) validateProfile(profile, id);
for (const [id, profile] of Object.entries(coverage?.institutions || {})) validateProfile(profile, id);
for (const [id, profile] of Object.entries(coverage?.people || {})) validateProfile(profile, id);
for (const [id, profile] of Object.entries(coverage?.institutions || {})) {
  if (profile.coverage_status === "researched" && !profile.profile_type) problems.push(`missing_researched_profile_type:${id}`);
  if (profile.profile_type === "unverified" && profile.identity_status !== "pending_verification") problems.push(`unverified_profile_missing_pending_identity:${id}`);
  if (profile.identity_status === "pending_verification" && profile.profile_type !== "unverified") problems.push(`pending_identity_profile_type_mismatch:${id}`);
}
if (problems.length) {
  console.error(JSON.stringify({ ok: false, problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, institutions: Object.keys(coverage?.institutions || data.institutions || {}).length, people: Object.keys(coverage?.people || data.people || {}).length, sources: [...Object.values(coverage?.institutions || data.institutions || {}), ...Object.values(coverage?.people || data.people || {})].reduce((sum, profile) => sum + profile.sources.length, 0), pendingIdentityVerification: backlog?.pending_identity_verification.length, pendingInvestorResearch: backlog?.pending_investor_research.length, pendingPeopleResearch: backlog?.pending_people_research.length }, null, 2));
