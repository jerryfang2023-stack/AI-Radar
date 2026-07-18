#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { evaluateModelAssistCandidate, readJson, writeJson } from "./model-assist-v1.mjs";

const root = process.cwd();
const assistRoot = path.join(root, "01-SiteV2", "content", "11-databases", "model-assist-v1");
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const reviewer = args.get("reviewer");
const write = args.get("write") === "true";
const reviewedAt = new Date().toISOString();

function verifiedNames(date) {
  const entities = readJson(path.join(bundleRoot, date, "entities.json"), []);
  return new Set(entities.filter((item) => item.verification_status === "verified").map((item) => item.canonical_name));
}

function rawBodies(date) {
  const raws = readJson(path.join(bundleRoot, date, "raw-documents.json"), []);
  return new Map(raws.map((raw) => [raw.raw_id, String(raw.body_clean || "")]));
}

function disposition(candidate, names, body) {
  const gateProblems = evaluateModelAssistCandidate({ ...candidate, status: "requires_review", review: undefined }, body);
  if (gateProblems.length) return { decision: "reject", reason: `deterministic_gate_failed:${gateProblems.join(",")}` };
  if (candidate.task_type === "qa_repair") {
    if (candidate.proposal.action === "extract_claim") return { decision: "accept", reason: "reviewed_exact_span_claim_candidate" };
    if (candidate.proposal.action === "keep_qa") return { decision: "accept", reason: "reviewed_and_retained_in_qa" };
    if (candidate.proposal.action === "recollect_original") return { decision: "accept", reason: "reviewed_source_gap_retained_for_recollection" };
    return { decision: "reject", reason: "title_repair_requires_source_ingestion_fix" };
  }
  const proposal = candidate.proposal || {};
  if (proposal.decision === "same_entity") {
    const targetExists = names.has(proposal.canonical_name);
    const distinctNames = proposal.candidate_name && proposal.canonical_name && proposal.candidate_name !== proposal.canonical_name;
    const evidenceText = (candidate.evidence || []).map((item) => item.quote).join("\n").toLocaleLowerCase();
    const targetInEvidence = evidenceText.includes(String(proposal.canonical_name || "").toLocaleLowerCase());
    return targetExists && distinctNames && targetInEvidence
      ? { decision: "accept", reason: "reviewed_merge_to_verified_entity" }
      : { decision: "reject", reason: "same_entity_target_not_proven" };
  }
  if (proposal.decision === "distinct_entity") return { decision: "accept", reason: "reviewed_as_distinct_entity" };
  return { decision: "reject", reason: "insufficient_evidence_for_entity_resolution" };
}

function main() {
  if (!reviewer) throw new Error("reviewer is required");
  const fileNames = fs.readdirSync(assistRoot).filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(name)).sort();
  const decisionsFile = path.join(assistRoot, "entity-resolution-decisions.json");
  const decisions = readJson(decisionsFile, { schema_version: "ENTITY-RESOLUTION-DECISIONS-V1", decisions: [] });
  const decisionRows = new Map((decisions.decisions || []).map((row) => [row.candidate_id, row]));
  const manifest = [];
  for (const name of fileNames) {
    const date = name.slice(0, 10);
    const file = path.join(assistRoot, name);
    const store = readJson(file);
    const names = verifiedNames(date);
    const bodies = rawBodies(date);
    let changed = false;
    for (const candidate of store?.candidates || []) {
      if (!["entity_resolution", "qa_repair"].includes(candidate.task_type)) continue;
      if (candidate.status !== "requires_review" && candidate.review?.decision && candidate.review?.reviewer) {
        manifest.push({ date, candidate_id: candidate.candidate_id, task_type: candidate.task_type, action: candidate.proposal?.action || candidate.proposal?.decision || "", decision: candidate.review.decision, reason: String(candidate.review.note || "reviewed").replace(/^queue-closeout:/u, "") });
        continue;
      }
      if (candidate.status !== "requires_review") continue;
      const outcome = disposition(candidate, names, bodies.get(candidate.raw_id) || "");
      const note = `queue-closeout:${outcome.reason}`;
      manifest.push({ date, candidate_id: candidate.candidate_id, task_type: candidate.task_type, action: candidate.proposal?.action || candidate.proposal?.decision || "", decision: outcome.decision, reason: outcome.reason });
      if (!write) continue;
      candidate.review = { decision: outcome.decision, reviewer, reviewed_at: reviewedAt, note };
      candidate.status = outcome.decision === "accept" ? "accepted" : "rejected";
      changed = true;
      if (outcome.decision === "accept" && candidate.task_type === "entity_resolution" && candidate.proposal?.decision === "same_entity") {
        decisionRows.set(candidate.candidate_id, {
          candidate_id: candidate.candidate_id,
          candidate_name: candidate.proposal.candidate_name || "",
          canonical_name: candidate.proposal.canonical_name || "",
          resolution: "same_entity",
          evidence: candidate.evidence,
          reviewer,
          reviewed_at: reviewedAt,
          note,
        });
      }
    }
    if (write && changed) writeJson(file, store);
  }
  const report = {
    schema_version: "MODEL-ASSIST-REVIEW-CLOSEOUT-V1",
    generated_at: reviewedAt,
    reviewer,
    total: manifest.length,
    by_task: Object.fromEntries(["entity_resolution", "qa_repair"].map((task) => [task, manifest.filter((row) => row.task_type === task).length])),
    by_decision: Object.fromEntries(["accept", "reject"].map((decision) => [decision, manifest.filter((row) => row.decision === decision).length])),
    decisions: manifest,
  };
  if (write) {
    decisions.decisions = [...decisionRows.values()].sort((a, b) => a.candidate_id.localeCompare(b.candidate_id));
    writeJson(decisionsFile, decisions);
    writeJson(path.join(assistRoot, "review-closeout.json"), report);
  }
  console.log(JSON.stringify({ ok: true, mode: write ? "write" : "dry-run", ...report }, null, 2));
}

main();
