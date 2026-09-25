#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const file = path.join(root, "01-SiteV2/content/11-databases/public-entity-profiles-v1.json");
const coverageFile = path.join(root, "01-SiteV2/content/11-databases/public-entity-profile-coverage-v1.json");
const schemaFile = path.join(root, "agent-workflow/product/public-entity-profiles-v1.schema.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const coverage = fs.existsSync(coverageFile) ? JSON.parse(fs.readFileSync(coverageFile, "utf8")) : null;
const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const problems = [];
if (!validate(data)) problems.push(ajv.errorsText(validate.errors));
if (coverage) {
  const complete = {
    ...data,
    institutions: { ...(coverage.institutions || {}), ...(data.institutions || {}) },
    people: { ...(coverage.people || {}), ...(data.people || {}) }
  };
  if (!validate(complete)) problems.push(`invalid_merged_profile_coverage:${ajv.errorsText(validate.errors)}`);
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
if (problems.length) {
  console.error(JSON.stringify({ ok: false, problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, institutions: Object.keys(coverage?.institutions || data.institutions || {}).length, people: Object.keys(coverage?.people || data.people || {}).length, sources: [...Object.values(coverage?.institutions || data.institutions || {}), ...Object.values(coverage?.people || data.people || {})].reduce((sum, profile) => sum + profile.sources.length, 0) }, null, 2));
