#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { loadPrivateEvidenceRecord } from "./lib/private-evidence-store.mjs";

const clean = (text = "") => String(text).replace(/\s+/gu, " ").trim();
const hash = (text) => crypto.createHash("sha256").update(text).digest("hex");
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

export function chinaFundingEntityReviewProblems(ledger, index, { readBody } = {}) {
  const problems = [];
  const companies = new Map((index.companies || []).map((item) => [item.id, item]));
  const people = new Map((index.people || []).map((item) => [item.id, item]));
  const covered = new Set();
  for (const decision of ledger.decisions || []) {
    if (decision.canonical?.catalog_type !== "person") continue;
    if (decision.review_status !== "accepted" || !["confirm", "correct"].includes(decision.action)) {
      problems.push(`person decision is not accepted: ${decision.entity_id}`);
    }
    if (!people.has(decision.entity_id)) problems.push(`person is not published: ${decision.entity_id}`);
    const keys = decision.canonical.reviewed_candidate_keys || [];
    for (const key of keys) {
      if (covered.has(key)) problems.push(`candidate has multiple person decisions: ${key}`);
      covered.add(key);
    }
    const profiles = decision.canonical.funding_profiles || [];
    if (!profiles.length) problems.push(`person has no reviewed funding lineage: ${decision.entity_id}`);
    for (const profile of profiles) {
      if (!companies.has(profile.company_entity_id)) problems.push(`person company is not published: ${decision.entity_id}:${profile.company_entity_id}`);
      if (!profile.role || !profile.funding_insight_id || !profile.source_event_id) problems.push(`incomplete person profile: ${decision.entity_id}`);
      if (!profile.evidence_refs?.length) problems.push(`person profile lacks evidence: ${decision.entity_id}`);
      for (const ref of profile.evidence_refs || []) {
        if (!/^https?:\/\//u.test(ref.source_url || "") || !ref.source_id || !ref.source_content_hash
          || !ref.verified_body_hash || hash(clean(ref.quote)) !== ref.quote_hash) problems.push(`invalid reviewed source proof: ${decision.entity_id}`);
        if (readBody && !readBody(ref)?.includes(ref.quote)) problems.push(`reviewed quotation does not replay: ${decision.entity_id}:${ref.source_id}`);
      }
    }
  }
  for (const item of ledger.summary?.deferred_people || []) {
    if (!item.reason || covered.has(item.candidate_key)) problems.push(`invalid deferred person: ${item.candidate_key}`);
    covered.add(item.candidate_key);
  }
  if (covered.size !== ledger.summary?.person_candidates) problems.push(`person census does not close: ${covered.size}/${ledger.summary?.person_candidates}`);
  const companyCoverage = ledger.summary?.company_coverage || [];
  if (new Set(companyCoverage.map((item) => item.source_entity_id)).size !== ledger.summary?.company_candidates) problems.push("company census does not close");
  for (const item of companyCoverage) {
    if (item.status === "linked" && !companies.has(item.entity_id)) problems.push(`company is not published: ${item.entity_id}`);
    if (item.status !== "linked" && (item.status !== "deferred" || !item.reason)) problems.push(`invalid company disposition: ${item.source_entity_id}`);
  }
  return problems;
}

export function assertChinaFundingEntities(root = process.cwd(), { requirePrivateEvidence = false, writeHealth = false } = {}) {
  const ledger = read(path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/china-funding-entity-review-decisions.json"));
  const index = read(path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"));
  const problems = chinaFundingEntityReviewProblems(ledger, index, { readBody: requirePrivateEvidence
    ? (ref) => loadPrivateEvidenceRecord(root, "", ref.verified_body_hash, { required: false, sourceUrl: ref.source_url })?.body : undefined });
  if (problems.length) throw new Error(`china_funding_entity_gate_failed:\n${problems.join("\n")}`);
  const accepted = ledger.decisions.filter((decision) => decision.canonical.catalog_type === "person");
  const coverage = ledger.summary.company_coverage;
  const report = { schema_version: "CHINA-FUNDING-ENTITY-HEALTH-V1.0", reviewed_at: ledger.generated_at,
    status: ledger.summary.deferred_people.length || coverage.some((item) => item.status === "deferred") ? "partial" : "passed",
    company_candidates: coverage.length, linked_company_candidates: coverage.filter((item) => item.status === "linked").length,
    unique_linked_companies: new Set(coverage.filter((item) => item.status === "linked").map((item) => item.entity_id)).size,
    deferred_companies: coverage.filter((item) => item.status === "deferred"),
    person_candidates: ledger.summary.person_candidates, accepted_people: accepted.length,
    linked_person_candidates: accepted.reduce((sum, decision) => sum + decision.canonical.reviewed_candidate_keys.length, 0),
    deferred_people: ledger.summary.deferred_people, private_evidence_replayed: requirePrivateEvidence,
    public_totals: { companies: index.companies.length, people: index.people.length, institutions: index.investors.length },
    metric_note: "来源公司 ID 与人物—公司候选分别去重；简称与重复身份经审核合并。待核验条目不计入正式档案，人物应用引用不等同于规范创立或任职关系。" };
  if (writeHealth) fs.writeFileSync(path.join(root, "01-SiteV2/site/data/china-funding-entity-health-v1.json"), `${JSON.stringify(report, null, 2)}\n`);
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = assertChinaFundingEntities(process.cwd(), { requirePrivateEvidence: process.argv.includes("--require-private-evidence"), writeHealth: process.argv.includes("--write-health") });
  console.log(JSON.stringify({ ok: true, ...report, deferred_people: report.deferred_people.length, deferred_companies: report.deferred_companies.length }, null, 2));
}
