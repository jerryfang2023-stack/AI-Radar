import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { sourceTextHash } from "./deepseek-translation-client.mjs";

export const MODEL_ASSIST_VERSION = "MODEL-ASSIST-V1.0";
export const MODEL_ASSIST_PROMPT_VERSION = "model-assist-2026-07-18.1";
export const MODEL_ASSIST_TASKS = new Set([
  "claim_extraction",
  "fde_enrichment",
  "hardware_enrichment",
  "entity_resolution",
  "community_translation",
  "qa_repair",
]);
export const AUTO_PROMOTABLE_TASKS = new Set(["claim_extraction", "fde_enrichment", "hardware_enrichment"]);
const MODEL_EVENT_TYPES = new Set(["acquisition", "lawsuit_settlement", "funding", "partnership", "procurement_contract", "hardware_capacity", "hardware_supply", "hardware_deployment", "pricing_change", "policy_regulation", "deployment", "research_result", "organization_people", "model_release", "hardware_product", "service_change", "product_release"]);
const FDE_ARRAY_FIELDS = new Set(["systems_integrated", "data_requirements", "governance_controls", "reported_metrics", "reported_delivery_components", "reported_outcomes"]);
const FDE_STRING_FIELDS = new Set(["customer", "vendor", "industry", "use_case", "workflow_before", "workflow_after", "deployment_stage", "delivery_model", "team_composition", "timeline", "metric_attribution", "reported_need"]);
const HARDWARE_STRING_FIELDS = new Set(["component_type", "compute_layer", "manufacturing_stage", "process_node", "capacity_unit", "supplier", "customer", "deployment_site", "region", "contract_value", "shipment_date"]);

export function stableModelAssistId(...parts) {
  return `MAC-${crypto.createHash("sha256").update(parts.map((item) => String(item || "")).join("|")).digest("hex").slice(0, 16)}`;
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, file);
}

export function candidateStore(dataDate, candidates = [], { sourceCount = 0 } = {}) {
  return {
    schema_version: MODEL_ASSIST_VERSION,
    generated_at: new Date().toISOString(),
    data_date: dataDate,
    prompt_version: MODEL_ASSIST_PROMPT_VERSION,
    source_count: sourceCount,
    candidates,
  };
}

export function sourceEvidenceProblems(body = "", evidence = []) {
  const text = String(body || "");
  const problems = [];
  if (!Array.isArray(evidence) || !evidence.length) return ["missing_source_evidence"];
  for (const [index, item] of evidence.entries()) {
    const start = Number(item?.start);
    const end = Number(item?.end);
    const quote = String(item?.quote || "");
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end <= start || end > text.length) {
      problems.push(`invalid_source_span:${index}`);
      continue;
    }
    if (text.slice(start, end) !== quote) problems.push(`source_quote_mismatch:${index}`);
  }
  return problems;
}

function numericTokens(value = "") {
  return [...String(value || "").matchAll(/(?:[$€£₹¥]\s*)?\d+(?:[.,]\d+)*(?:\s*(?:%|x|k|m|mn|bn|b|million|billion|trillion|万|亿|万元|亿元|nm|mw|gw|gb|tb|pb))?/giu)]
    .map((match) => match[0].toLowerCase().replace(/[\s,]/gu, ""));
}

export function proposalEvidenceProblems(proposal = {}, evidence = []) {
  const evidenceText = evidence.map((item) => item.quote).join("\n");
  const proposalText = JSON.stringify(proposal, (key, value) => key === "evidence_index" ? undefined : value);
  const evidenceNumbers = new Set(numericTokens(evidenceText));
  return numericTokens(proposalText)
    .filter((token) => !evidenceNumbers.has(token))
    .map((token) => `unsupported_numeric_fact:${token}`);
}

export function evaluateModelAssistCandidate(candidate, body = "") {
  const problems = [];
  if (!MODEL_ASSIST_TASKS.has(candidate?.task_type)) problems.push("unsupported_task_type");
  if (candidate?.source_hash !== sourceTextHash(body)) problems.push("stale_source_hash");
  problems.push(...sourceEvidenceProblems(body, candidate?.evidence));
  problems.push(...proposalEvidenceProblems(candidate?.proposal, candidate?.evidence || []));
  if (candidate?.task_type === "claim_extraction") {
    const claims = candidate?.proposal?.claims;
    if (!Array.isArray(claims) || !claims.length) problems.push("missing_claim_proposal");
    for (const [index, claim] of (claims || []).entries()) {
      if (!claim?.event_type || !claim?.subject || !claim?.object) problems.push(`incomplete_claim:${index}`);
      if (claim?.event_type && !MODEL_EVENT_TYPES.has(claim.event_type)) problems.push(`unsupported_claim_event_type:${index}`);
      if (!Number.isInteger(claim?.evidence_index) || !candidate.evidence?.[claim.evidence_index]) problems.push(`invalid_claim_evidence_index:${index}`);
    }
  }
  if (["fde_enrichment", "hardware_enrichment"].includes(candidate?.task_type)) {
    const fields = candidate?.proposal?.fields;
    if (!Array.isArray(fields) || !fields.length) problems.push("missing_projection_fields");
    for (const [index, field] of (fields || []).entries()) {
      if (!field?.field || field?.value === undefined) problems.push(`incomplete_projection_field:${index}`);
      if (!Number.isInteger(field?.evidence_index) || !candidate.evidence?.[field.evidence_index]) problems.push(`invalid_projection_evidence_index:${index}`);
      if (candidate.task_type === "fde_enrichment") {
        if (!FDE_STRING_FIELDS.has(field.field) && !FDE_ARRAY_FIELDS.has(field.field)) problems.push(`unsupported_fde_field:${index}`);
        if (FDE_STRING_FIELDS.has(field.field) && typeof field.value !== "string") problems.push(`invalid_fde_field_type:${index}`);
        if (FDE_ARRAY_FIELDS.has(field.field) && !Array.isArray(field.value)) problems.push(`invalid_fde_field_type:${index}`);
      }
      if (candidate.task_type === "hardware_enrichment") {
        if (!HARDWARE_STRING_FIELDS.has(field.field) && field.field !== "capacity") problems.push(`unsupported_hardware_field:${index}`);
        if (HARDWARE_STRING_FIELDS.has(field.field) && typeof field.value !== "string") problems.push(`invalid_hardware_field_type:${index}`);
        if (field.field === "capacity" && typeof field.value !== "number") problems.push(`invalid_hardware_field_type:${index}`);
      }
    }
  }
  if (candidate?.task_type === "entity_resolution" && candidate?.status !== "requires_review"
      && !(candidate?.status === "accepted" && candidate?.review?.decision === "accept" && candidate?.review?.reviewer)) {
    problems.push("entity_resolution_must_require_review");
  }
  return [...new Set(problems)];
}

export function withGateResult(candidate, body = "") {
  const reviewedAccepted = candidate?.task_type === "entity_resolution"
    && candidate?.status === "accepted"
    && candidate?.review?.decision === "accept"
    && candidate?.review?.reviewer;
  const evaluationCandidate = candidate?.task_type === "entity_resolution" && !reviewedAccepted
    ? { ...candidate, status: "requires_review" }
    : candidate;
  const problems = evaluateModelAssistCandidate(evaluationCandidate, body);
  const status = problems.length
    ? (problems.includes("stale_source_hash") ? "stale" : "rejected")
    : reviewedAccepted ? "accepted"
      : AUTO_PROMOTABLE_TASKS.has(candidate.task_type) ? "accepted" : "requires_review";
  return {
    ...candidate,
    status,
    gate_results: [
      { gate: "source_hash", status: problems.includes("stale_source_hash") ? "failed" : "passed", detail: problems.includes("stale_source_hash") ? "source hash changed" : "source hash matches" },
      { gate: "exact_source_span", status: problems.some((item) => /source_(?:quote|span)|missing_source_evidence/u.test(item)) ? "failed" : "passed", detail: problems.filter((item) => /source_(?:quote|span)|missing_source_evidence/u.test(item)).join(", ") || "all quotes match exact spans" },
      { gate: "protected_facts", status: problems.some((item) => item.startsWith("unsupported_numeric_fact")) ? "failed" : "passed", detail: problems.filter((item) => item.startsWith("unsupported_numeric_fact")).join(", ") || "all proposal numbers occur in evidence" },
      { gate: "task_contract", status: problems.some((item) => !/(?:source_|numeric_fact)/u.test(item)) ? "failed" : "passed", detail: problems.filter((item) => !/(?:source_|numeric_fact)/u.test(item)).join(", ") || "task contract passed" },
    ],
  };
}
