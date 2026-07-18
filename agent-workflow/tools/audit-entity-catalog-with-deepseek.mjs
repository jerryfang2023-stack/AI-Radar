#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { deepSeekJsonCompletion, deepSeekModels, sourceTextHash } from "./deepseek-translation-client.mjs";

const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const siteDataRoot = path.join(root, "01-SiteV2", "site", "data", "data-center-v4");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const outputStem = String(args.get("output-stem") || "entity-catalog-deepseek-audit").replace(/[^a-z0-9._-]/giu, "-");
const reportPath = path.join(root, "agent-workflow", "reports", `${outputStem}.json`);
const markdownPath = path.join(root, "agent-workflow", "reports", `${outputStem}.md`);
const promptVersion = "ENTITY-CATALOG-AUDIT-V1.1";
const write = args.get("write") === "true";
const batchSize = Math.max(1, Math.min(12, Number(args.get("batch-size") || 8)));
const concurrency = Math.max(1, Math.min(6, Number(args.get("concurrency") || 3)));
const evidenceLimit = Math.max(1, Math.min(20, Number(args.get("evidence-limit") || 3)));
const limit = Math.max(0, Number(args.get("limit") || 0));
const offset = Math.max(0, Number(args.get("offset") || 0));
const reuseExisting = args.get("reuse-existing") === "true";
const configuredModel = args.get("model")
  || process.env.DEEPSEEK_PRO_MODEL
  || process.env.DEEPSEEK_MODEL
  || deepSeekModels().pro;

// The shared client retries with DEEPSEEK_PRO_MODEL. Keep retries on the same
// explicitly configured model when a separate Pro override is not present.
if (!process.env.DEEPSEEK_PRO_MODEL) process.env.DEEPSEEK_PRO_MODEL = configuredModel;

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function availableDates() {
  return fs.readdirSync(bundleRoot).filter((name) => /^\d{4}-\d{2}-\d{2}$/u.test(name)).sort();
}

function normalized(value = "") {
  return String(value || "").trim().toLocaleLowerCase("en-US");
}

function includesName(text = "", name = "") {
  const candidate = normalized(name);
  return candidate.length >= 2 && normalized(text).includes(candidate);
}

function sameStringSet(left = [], right = []) {
  const normalize = (values) => [...new Set((values || []).map((value) => String(value || "").trim()).filter(Boolean))].sort();
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

function loadEvidenceRegistry() {
  const claims = new Map();
  const events = new Map();
  const dates = availableDates();
  for (const date of dates) {
    const dir = path.join(bundleRoot, date);
    for (const claim of readJson(path.join(dir, "claims.json"), [])) {
      claims.set(claim.claim_id, { ...claim, data_date: date });
    }
    for (const event of readJson(path.join(dir, "canonical-events.json"), [])) {
      events.set(event.event_id, { ...event, data_date: date });
    }
  }
  return { claims, events, dates };
}

function claimEvidence(claim, event, relationClaimIds, entity) {
  const quote = String(claim?.source_quote || "").trim();
  if (!quote) return null;
  const ownerNames = entity.current_company_names || [];
  let score = relationClaimIds.has(claim.claim_id) ? 8 : 0;
  if (includesName(quote, entity.name)) score += 6;
  if (includesName(claim.subject, entity.name)) score += 4;
  if (includesName(event?.display_title_zh, entity.name)) score += 3;
  if (ownerNames.some((name) => includesName(quote, name))) score += 3;
  if (ownerNames.some((name) => includesName(claim.subject, name))) score += 2;
  if (claim.verification_status === "accepted") score += 1;
  return {
    claim_id: claim.claim_id,
    event_id: event?.event_id || "",
    event_title: event?.display_title_zh || "",
    event_type: event?.event_type || "",
    data_date: event?.data_date || claim.data_date || "",
    subject: String(claim.subject || ""),
    predicate: String(claim.predicate || ""),
    quote,
    score,
  };
}

function buildCatalogItems(index, registry) {
  const rows = [
    ...(index.companies || []).map((item) => ({ ...item, catalog_type: "company" })),
    ...(index.products || []).map((item) => ({ ...item, catalog_type: "product" })),
  ];
  return rows.map((row) => {
    const profile = readJson(path.join(siteDataRoot, "entities", `${row.id}.json`), {});
    const relations = Array.isArray(profile?.relationships) ? profile.relationships : [];
    const relationClaimIds = new Set(relations.flatMap((relation) => relation.claim_refs || []));
    const eventRows = (row.eventIds || []).map((eventId) => registry.events.get(eventId)).filter(Boolean);
    const evidenceByClaim = new Map();
    for (const event of eventRows) {
      for (const claimId of [...new Set([...(event.claim_refs || []), ...relationClaimIds])]) {
        const evidence = claimEvidence(registry.claims.get(claimId), event, relationClaimIds, {
          name: row.name,
          current_company_names: row.companyNames || [],
        });
        if (evidence && (!evidenceByClaim.has(claimId) || evidence.score > evidenceByClaim.get(claimId).score)) {
          evidenceByClaim.set(claimId, evidence);
        }
      }
    }
    const evidence = [...evidenceByClaim.values()]
      .sort((a, b) => b.score - a.score || b.data_date.localeCompare(a.data_date) || a.claim_id.localeCompare(b.claim_id))
      .slice(0, evidenceLimit)
      .map(({ score, ...item }) => item);
    const input = {
      entity_id: row.id,
      catalog_type: row.catalog_type,
      canonical_name: row.name,
      aliases: row.aliases || [],
      current_company_names: row.companyNames || [],
      current_relationships: relations.map((relation) => ({
        relationship_id: relation.relationship_id,
        subject_ref: relation.subject_ref,
        predicate: relation.predicate,
        object_ref: relation.object_ref,
        claim_refs: relation.claim_refs || [],
        status: relation.status,
      })),
      evidence,
    };
    return { ...input, input_hash: sourceTextHash(`${promptVersion}\n${JSON.stringify(input)}`) };
  }).sort((a, b) => a.catalog_type.localeCompare(b.catalog_type) || a.canonical_name.localeCompare(b.canonical_name) || a.entity_id.localeCompare(b.entity_id));
}

function promptFor(items) {
  return [
    "You are auditing an AI industry entity catalog using only supplied accepted Claims.",
    "Review every item independently. Do not use outside knowledge and do not guess from a familiar brand name.",
    "For a company, verify whether canonical_name is actually an organization rather than a product, article title, feature, person, or fragment.",
    "For a product, verify canonical_name, product type, and current_company_names. Same-event co-occurrence, comparison, integration, compatibility, hosting, or a platform mention does not prove ownership.",
    "Only an exact supplied Claim that explicitly supports publishing, developing, manufacturing, operating, or ownership can confirm or change a product-company mapping.",
    "Use correction_candidate only when supplied evidence supports a concrete corrected value. Otherwise use requires_review or insufficient_evidence.",
    "Current rows are company or product. Models, services, platforms, tools, reports, and features map to product. If evidence shows a person, use person; if it is an article fragment or another non-entity, use other.",
    "Return concise Simplified Chinese rationale. Return one JSON object only, with exactly one review for every input entity_id.",
    "Schema: {\"reviews\":[{\"entity_id\":string,\"decision\":\"confirmed\"|\"correction_candidate\"|\"requires_review\"|\"insufficient_evidence\",\"proposed_name\":string,\"proposed_catalog_type\":\"company\"|\"product\"|\"person\"|\"other\"|\"\",\"proposed_company_names\":string[],\"issue_fields\":(\"name\"|\"type\"|\"company\"|\"duplicate\"|\"evidence\")[],\"confidence\":number,\"evidence_claim_ids\":string[],\"rationale\":string}]}",
    "For confirmed, proposed fields should repeat the accepted current values. For insufficient_evidence, leave proposed fields empty and cite no Claim. confidence must be between 0 and 1.",
    `CATALOG_ITEMS:\n${JSON.stringify(items)}`,
  ].join("\n\n");
}

function validatePayload(items, payload) {
  const problems = [];
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return ["response_must_be_object"];
  if (!Array.isArray(payload.reviews)) return ["reviews_must_be_array"];
  const expectedIds = items.map((item) => item.entity_id).sort();
  const actualIds = payload.reviews.map((item) => String(item?.entity_id || "")).sort();
  if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) problems.push("entity_ids_must_match_input_exactly");
  const allowedDecisions = new Set(["confirmed", "correction_candidate", "requires_review", "insufficient_evidence"]);
  const allowedTypes = new Set(["company", "product", "person", "other", ""]);
  const allowedIssues = new Set(["name", "type", "company", "duplicate", "evidence"]);
  const itemById = new Map(items.map((item) => [item.entity_id, item]));
  for (const review of payload.reviews) {
    const item = itemById.get(review?.entity_id);
    if (!item) continue;
    if (!allowedDecisions.has(review.decision)) problems.push(`invalid_decision:${review.entity_id}`);
    if (!allowedTypes.has(review.proposed_catalog_type)) problems.push(`invalid_catalog_type:${review.entity_id}`);
    if (!Array.isArray(review.proposed_company_names)) problems.push(`company_names_must_be_array:${review.entity_id}`);
    if (!Array.isArray(review.issue_fields) || review.issue_fields.some((value) => !allowedIssues.has(value))) problems.push(`invalid_issue_fields:${review.entity_id}`);
    if (!Number.isFinite(review.confidence) || review.confidence < 0 || review.confidence > 1) problems.push(`invalid_confidence:${review.entity_id}`);
    if (!Array.isArray(review.evidence_claim_ids)) problems.push(`claim_ids_must_be_array:${review.entity_id}`);
    const allowedClaims = new Set(item.evidence.map((evidence) => evidence.claim_id));
    for (const claimId of review.evidence_claim_ids || []) {
      if (!allowedClaims.has(claimId)) problems.push(`unknown_claim_id:${review.entity_id}:${claimId}`);
    }
    if (review.decision === "insufficient_evidence" && (review.evidence_claim_ids || []).length) problems.push(`insufficient_must_not_cite_claim:${review.entity_id}`);
    if (["confirmed", "correction_candidate"].includes(review.decision) && !(review.evidence_claim_ids || []).length) problems.push(`decision_requires_claim:${review.entity_id}`);
    if (review.decision === "confirmed") {
      if (String(review.proposed_name || "").trim() !== item.canonical_name) problems.push(`confirmed_name_must_match_current:${review.entity_id}`);
      if (review.proposed_catalog_type !== item.catalog_type) problems.push(`confirmed_type_must_match_current:${review.entity_id}`);
      if (!sameStringSet(review.proposed_company_names, item.current_company_names)) problems.push(`confirmed_companies_must_match_current:${review.entity_id}`);
    }
    if (!String(review.rationale || "").trim()) problems.push(`missing_rationale:${review.entity_id}`);
  }
  return [...new Set(problems)];
}

function normalizeStoredReview(review) {
  if (review.decision !== "confirmed") return review;
  const issueFields = new Set(review.issue_fields || []);
  if (String(review.proposed_name || "").trim() !== review.current_name) issueFields.add("name");
  if (review.proposed_catalog_type !== review.catalog_type) issueFields.add("type");
  if (!sameStringSet(review.proposed_company_names, review.current_company_names)) issueFields.add("company");
  if (!issueFields.size) return review;
  return {
    ...review,
    decision: "correction_candidate",
    issue_fields: [...issueFields],
    status: "pending_human_review",
  };
}

async function reviewBatch(items) {
  const result = await deepSeekJsonCompletion({
    model: configuredModel,
    messages: [{ role: "user", content: promptFor(items) }],
    maxTokens: Math.max(3000, items.length * 650),
    timeoutMs: Number(process.env.ENTITY_CATALOG_AUDIT_TIMEOUT_MS || 120000),
    validate: (payload) => validatePayload(items, payload),
  });
  const itemById = new Map(items.map((item) => [item.entity_id, item]));
  return result.payload.reviews.map((review) => ({
    entity_id: review.entity_id,
    catalog_type: itemById.get(review.entity_id).catalog_type,
    current_name: itemById.get(review.entity_id).canonical_name,
    current_company_names: itemById.get(review.entity_id).current_company_names,
    input_hash: itemById.get(review.entity_id).input_hash,
    decision: review.decision,
    proposed_name: String(review.proposed_name || "").trim(),
    proposed_catalog_type: review.proposed_catalog_type,
    proposed_company_names: review.proposed_company_names,
    issue_fields: review.issue_fields,
    confidence: review.confidence,
    evidence_claim_ids: review.evidence_claim_ids,
    rationale: String(review.rationale || "").trim(),
    evidence: itemById.get(review.entity_id).evidence,
    provider: result.provider,
    model: result.model,
    prompt_version: promptVersion,
    status: review.decision === "confirmed" ? "model_confirmed_advisory" : "pending_human_review",
    generated_at: result.generatedAt,
  }));
}

async function mapConcurrent(items, worker, size, onSettled) {
  const output = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const current = cursor++;
      try { output[current] = await worker(items[current]); }
      catch (error) { output[current] = { error: error.message, items: items[current] }; }
      await onSettled(output[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, Math.max(1, items.length)) }, run));
  return output;
}

function summaryFor(reviews, totalItems, failures = []) {
  const decisions = ["confirmed", "correction_candidate", "requires_review", "insufficient_evidence"];
  const byDecision = Object.fromEntries(decisions.map((decision) => [decision, reviews.filter((item) => item.decision === decision).length]));
  const byType = Object.fromEntries(["company", "product"].map((type) => [type, {
    total: reviews.filter((item) => item.catalog_type === type).length,
    ...Object.fromEntries(decisions.map((decision) => [decision, reviews.filter((item) => item.catalog_type === type && item.decision === decision).length])),
  }]));
  return { catalog_total: totalItems, reviewed: reviews.length, remaining: totalItems - reviews.length, failed_batches: failures.length, by_decision: byDecision, by_type: byType };
}

function reportObject(registry, catalogItems, reviews, failures = []) {
  const normalizedReviews = reviews.map(normalizeStoredReview);
  return {
    meta: {
      schema_version: promptVersion,
      generated_at: new Date().toISOString(),
      provider: "deepseek",
      model: configuredModel,
      latest_data_date: registry.dates.at(-1) || "",
      source_date_count: registry.dates.length,
      canonical_write_performed: false,
      review_policy: "advisory_only_human_review_required_for_changes",
    },
    summary: summaryFor(normalizedReviews, catalogItems.length, failures),
    reviews: normalizedReviews.sort((a, b) => a.catalog_type.localeCompare(b.catalog_type) || a.current_name.localeCompare(b.current_name) || a.entity_id.localeCompare(b.entity_id)),
    failures,
  };
}

function markdownReport(report) {
  const flagged = report.reviews.filter((item) => item.decision !== "confirmed");
  const lines = [
    "# Entity Catalog DeepSeek Audit",
    "",
    `- Generated: ${report.meta.generated_at}`,
    `- Model: ${report.meta.model}`,
    `- Catalog: ${report.summary.catalog_total}`,
    `- Reviewed: ${report.summary.reviewed}`,
    `- Confirmed (advisory): ${report.summary.by_decision.confirmed}`,
    `- Correction candidates: ${report.summary.by_decision.correction_candidate}`,
    `- Requires review: ${report.summary.by_decision.requires_review}`,
    `- Insufficient evidence: ${report.summary.by_decision.insufficient_evidence}`,
    `- Failed batches: ${report.summary.failed_batches}`,
    "",
    "> DeepSeek output is advisory. No canonical entity, company-product relation, or public index was changed.",
    "",
    "## Flagged items",
    "",
  ];
  if (!flagged.length) lines.push("No flagged items in the completed scope.", "");
  for (const item of flagged) {
    lines.push(`### ${item.current_name} (${item.entity_id})`, "");
    lines.push(`- Decision: ${item.decision}`);
    lines.push(`- Current type / company: ${item.catalog_type} / ${(item.current_company_names || []).join(", ") || "-"}`);
    lines.push(`- Proposed: ${item.proposed_name || "-"} / ${item.proposed_catalog_type || "-"} / ${(item.proposed_company_names || []).join(", ") || "-"}`);
    lines.push(`- Issues: ${(item.issue_fields || []).join(", ") || "-"}`);
    lines.push(`- Confidence: ${item.confidence}`);
    lines.push(`- Claims: ${(item.evidence_claim_ids || []).join(", ") || "-"}`);
    lines.push(`- Rationale: ${item.rationale}`, "");
  }
  return `${lines.join("\n")}\n`;
}

async function main() {
  const index = readJson(path.join(siteDataRoot, "indexes", "entities.json"), null);
  if (!index) throw new Error("entity_catalog_index_missing");
  const registry = loadEvidenceRegistry();
  const catalogItems = buildCatalogItems(index, registry);
  const selectedItems = catalogItems.slice(offset, limit ? offset + limit : undefined);
  const existing = reuseExisting ? readJson(reportPath, { reviews: [] }) : { reviews: [] };
  const reviewById = new Map((existing.reviews || []).map((review) => [review.entity_id, review]));
  const pending = selectedItems.filter((item) => reviewById.get(item.entity_id)?.input_hash !== item.input_hash);
  const batches = [];
  for (let indexPosition = 0; indexPosition < pending.length; indexPosition += batchSize) batches.push(pending.slice(indexPosition, indexPosition + batchSize));
  if (!write) {
    console.log(JSON.stringify({
      ok: true,
      mode: "dry-run",
      catalog_total: catalogItems.length,
      companies: catalogItems.filter((item) => item.catalog_type === "company").length,
      products: catalogItems.filter((item) => item.catalog_type === "product").length,
      selected: selectedItems.length,
      reused: selectedItems.length - pending.length,
      pending: pending.length,
      batches: batches.length,
      batch_size: batchSize,
      evidence_limit: evidenceLimit,
      concurrency,
      model: configuredModel,
    }, null, 2));
    return;
  }
  if (pending.length && !process.env.DEEPSEEK_API_KEY) throw new Error("deepseek_key_missing_for_entity_catalog_audit");
  const failures = [];
  let completedBatches = 0;
  await mapConcurrent(batches, reviewBatch, concurrency, async (result, batchIndex) => {
    completedBatches += 1;
    if (result?.error) {
      failures.push({
        batch_index: batchIndex,
        entity_ids: result.items.map((item) => item.entity_id),
        error: result.error,
      });
    } else {
      for (const review of result) reviewById.set(review.entity_id, review);
    }
    const report = reportObject(registry, catalogItems, [...reviewById.values()], failures);
    writeJson(reportPath, report);
    fs.writeFileSync(markdownPath, markdownReport(report), "utf8");
    console.log(JSON.stringify({ progress: `${completedBatches}/${batches.length}`, reviewed: report.summary.reviewed, flagged: report.summary.reviewed - report.summary.by_decision.confirmed, failed_batches: failures.length }));
  });
  const report = reportObject(registry, catalogItems, [...reviewById.values()], failures);
  writeJson(reportPath, report);
  fs.writeFileSync(markdownPath, markdownReport(report), "utf8");
  console.log(JSON.stringify({ ok: !failures.length, report: path.relative(root, reportPath), markdown: path.relative(root, markdownPath), summary: report.summary }, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
