#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const root = process.cwd();
const file = path.join(root, "01-SiteV2/content/11-databases/investment-institutions-v1.json");
const schemaFile = path.join(root, "agent-workflow/product/investment-institution-v1.schema.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const schema = JSON.parse(fs.readFileSync(schemaFile, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);
const problems = [];
if (!validate(data)) problems.push(ajv.errorsText(validate.errors));
if (data.meta?.institution_count !== data.institutions?.length) problems.push("institution_count_mismatch");
if (new Set((data.institutions || []).map((item) => item.id)).size !== data.institutions?.length) problems.push("duplicate_institution_id");
if ((data.institutions || []).some((item) => item.activities.some((activity) => !activity.evidence.length))) {
  problems.push("activity_without_evidence");
}
for (const institution of data.institutions || []) {
  const chinaActivities = institution.activities.filter((activity) => activity.china_market_match);
  if (institution.china_market_activity_count !== chinaActivities.filter((activity) => activity.scope === "current_round").length) {
    problems.push(`china_market_activity_count_mismatch:${institution.id}`);
  }
  if (institution.market_regions.some((region) => !["CN", "GLOBAL"].includes(region))) {
    problems.push(`market_region_invalid:${institution.id}`);
  }
  if (institution.activities.some((activity) => activity.china_market_match !== (activity.market_region === "CN"))) {
    problems.push(`china_market_activity_scope_invalid:${institution.id}`);
  }
}
const evidenceRows = (data.institutions || []).flatMap((item) => item.activities.flatMap((activity) => activity.evidence));
for (const evidence of evidenceRows) {
  const normalizedQuote = String(evidence.quote || "").replace(/\s+/gu, " ").trim();
  const quoteHash = crypto.createHash("sha256").update(normalizedQuote).digest("hex");
  if (!/^https?:\/\//u.test(evidence.source_url || "")) problems.push(`invalid_source_url:${evidence.source_id || "missing"}`);
  if (!/^[a-f0-9]{16,64}$/u.test(evidence.source_content_hash || "")) problems.push(`invalid_source_hash:${evidence.source_id || "missing"}`);
  if (evidence.quote_hash !== quoteHash) problems.push(`invalid_quote_hash:${evidence.source_id || "missing"}`);
}
if (problems.length) {
  console.error(JSON.stringify({ ok: false, problems }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  institutions: data.meta.institution_count,
  evidence_backed: data.meta.evidence_backed_count,
  current_round_activities: data.meta.current_round_activity_count,
  china_market_institutions: data.institutions.filter((item) => item.china_market_activity_count > 0).length,
}, null, 2));
