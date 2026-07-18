import assert from "node:assert/strict";
import test from "node:test";
import { sourceTextHash } from "../deepseek-translation-client.mjs";
import { evaluateModelAssistCandidate, withGateResult } from "../model-assist-v1.mjs";
import { needsChineseTranslation } from "../translate-community-intelligence.mjs";

function claimCandidate(body, overrides = {}) {
  const quote = "Aina raised $5.5 Mn from Info Edge to build an AI hardware interface.";
  const start = body.indexOf(quote);
  return {
    candidate_id: "MAC-test",
    task_type: "claim_extraction",
    asset_id: "QA-test",
    raw_id: "RAW-test",
    source_ref: "SRC-test",
    source_hash: sourceTextHash(body),
    provider: "deepseek",
    model: "deepseek-v4-pro",
    prompt_version: "test",
    status: "pending",
    proposal: { claims: [{ event_type: "funding", subject: "Aina", object: "$5.5 Mn from Info Edge", evidence_index: 0 }] },
    evidence: [{ start, end: start + quote.length, quote }],
    gate_results: [],
    generated_at: "2026-07-18T00:00:00.000Z",
    ...overrides,
  };
}

test("accepts an exact-span model Claim with protected numbers", () => {
  const body = "Funding update. Aina raised $5.5 Mn from Info Edge to build an AI hardware interface.";
  const candidate = withGateResult(claimCandidate(body), body);
  assert.equal(candidate.status, "accepted");
  assert.deepEqual(evaluateModelAssistCandidate(candidate, body), []);
});

test("rejects a model Claim when its quote is not an exact source span", () => {
  const body = "Aina raised $5.5 Mn from Info Edge to build an AI hardware interface.";
  const candidate = claimCandidate(body);
  candidate.evidence[0].quote = "Aina raised $6 Mn from Info Edge.";
  const result = withGateResult(candidate, body);
  assert.equal(result.status, "rejected");
  assert.match(evaluateModelAssistCandidate(result, body).join(" "), /source_quote_mismatch/u);
});

test("entity resolution can never auto-promote", () => {
  const body = "Acme announced Acme Cloud.";
  const candidate = withGateResult({
    ...claimCandidate(body),
    task_type: "entity_resolution",
    proposal: { decision: "same_entity", candidate_name: "Acme", canonical_name: "Acme Inc." },
    evidence: [{ start: 0, end: body.length, quote: body }],
    status: "pending",
  }, body);
  assert.equal(candidate.status, "requires_review");
  assert.deepEqual(evaluateModelAssistCandidate(candidate, body), []);
});

test("community translation detection targets English, not Chinese mixed with product names", () => {
  assert.equal(needsChineseTranslation("Aina Raises $5.5 Mn From Info Edge"), true);
  assert.equal(needsChineseTranslation("Aina 获得 Info Edge 参投的 550 万美元融资"), false);
});
