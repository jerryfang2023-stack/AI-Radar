import assert from "node:assert/strict";
import test from "node:test";
import { classifyEntityReviewErrorPatterns } from "../../product/entity-review-error-patterns.mjs";

test("confirmed entities carry no error pattern", () => {
  assert.deepEqual(classifyEntityReviewErrorPatterns({
    action: "confirm",
    current: { name: "Claude Code", catalog_type: "product", company_names: ["Anthropic"] },
    canonical: { name: "Claude Code", catalog_type: "product", company_names: ["Anthropic"] }
  }), []);
});

test("version merges are distinguished from ordinary duplicate entities", () => {
  assert.ok(classifyEntityReviewErrorPatterns({
    action: "merge",
    current: { name: "Claude Code v2.1.219", catalog_type: "product", company_names: ["Anthropic"] },
    canonical: { name: "Claude Code", catalog_type: "product", company_names: ["Anthropic"] }
  }).includes("version_alias"));
  assert.ok(classifyEntityReviewErrorPatterns({
    action: "merge",
    current: { name: "DeepMind", catalog_type: "company", company_names: [] },
    canonical: { name: "Google DeepMind", catalog_type: "company", company_names: [] }
  }).includes("duplicate_entity"));
});

test("headline fragments and ownership corrections produce auditable classes", () => {
  const patterns = classifyEntityReviewErrorPatterns({
    action: "quarantine",
    current: { name: "Enter Next Phase", catalog_type: "product", company_names: ["Example"] },
    canonical: { name: "Enter Next Phase", catalog_type: "other", company_names: [] },
    evidence: { claim_refs: [] }
  });
  assert.ok(patterns.includes("name_extraction_fragment"));
  assert.ok(patterns.includes("ownership_attribution"));
  assert.ok(patterns.includes("insufficient_claim_evidence"));
});
