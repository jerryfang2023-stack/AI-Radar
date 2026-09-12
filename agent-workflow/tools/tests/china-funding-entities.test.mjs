import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { fundingPersonResolver } from "../funding-insight-v1-utils.mjs";
import { chinaFundingEntityReviewProblems } from "../assert-china-funding-entities.mjs";
import { applyEntityReviewDecisions, buildEntityHistoryService } from "../../product/entity-history-v1.mjs";

test("funding people require reviewed company identity, including unique names", () => {
  const people = [
    { id: "p1", name: "李辉", aliases: ["Lihui"], founderCompanies: [{ entityId: "c1" }] },
    { id: "p2", name: "李辉", founderCompanies: [{ entityId: "c2" }] },
    { id: "p3", name: "独有人名", fundingResearchNames: ["已审核错别字"], founderCompanies: [{ entityId: "c1" }] },
  ];
  assert.equal(fundingPersonResolver({ people }, "c1")("李辉").id, "p1");
  assert.equal(fundingPersonResolver({ people }, "c2")("李辉").id, "p2");
  assert.equal(fundingPersonResolver({ people }, "c1")("Lihui").id, "p1");
  assert.equal(fundingPersonResolver({ people }, "c2")("独有人名"), null);
  assert.equal(fundingPersonResolver({ people }, "c1")("已审核错别字").name, "独有人名");
  assert.equal(fundingPersonResolver({ people }, "c2")("已审核错别字"), null);
});

test("review gate rejects evidence mismatch, missing companies and unaccounted candidates", () => {
  const quote = "甲公司创始人张三";
  const ref = { source_id: "s", source_url: "https://example.com/source", source_content_hash: "h", verified_body_hash: "h",
    quote, quote_hash: crypto.createHash("sha256").update(quote).digest("hex") };
  const ledger = { summary: { person_candidates: 1, company_candidates: 1, company_coverage: [{ source_entity_id: "c", entity_id: "c", status: "linked" }], deferred_people: [] },
    decisions: [{ entity_id: "p", action: "confirm", review_status: "accepted", canonical: { catalog_type: "person", reviewed_candidate_keys: ["c|张三"],
      funding_profiles: [{ company_entity_id: "c", role: "创始人", funding_insight_id: "f", source_event_id: "e", evidence_refs: [ref] }] } }] };
  const index = { companies: [{ id: "c" }], people: [{ id: "p" }] };
  assert.deepEqual(chinaFundingEntityReviewProblems(ledger, index, { readBody: () => quote }), []);
  assert.match(chinaFundingEntityReviewProblems(ledger, index, { readBody: () => "另一个人" }).join(), /does not replay/);
  assert.match(chinaFundingEntityReviewProblems(ledger, { ...index, companies: [] }).join(), /company is not published/);
  ledger.summary.person_candidates = 2;
  assert.match(chinaFundingEntityReviewProblems(ledger, index).join(), /census does not close/);
});

test("reviewed extraction fragments are not retained as company aliases", () => {
  const reviewed = applyEntityReviewDecisions([{ entity_id: "c", canonical_name: "教授创业，天使轮", entity_type: "organization_candidate" }], [], {
    decisions: [{ entity_id: "c", action: "correct", review_status: "accepted", reviewer: "test", canonical: { name: "工至海洋", catalog_type: "company", aliases: [], retain_original_name_as_alias: false } }],
  });
  assert.deepEqual(reviewed.entityRows[0].aliases, []);
});

test("merged financing cards retain person evidence and resolve surviving card IDs", () => {
  const service = buildEntityHistoryService({
    fundingCards: [{ funding_insight_id: "FI-new", company: { entity_id: "EN-company" }, source_event_ids: ["EV-source"] }],
    reviewDecisions: { decisions: [{ entity_id: "EN-4444444444444444", reviewer: "test", review_status: "accepted", action: "confirm",
      canonical: { name: "张三", catalog_type: "person", organization_names: ["甲公司"], funding_profiles: [{
        funding_insight_id: "FI-old", company_entity_id: "EN-company", company_name: "甲公司", role: "CEO",
        source_event_id: "EV-source", as_of_date: "2026-09-12", evidence_refs: [{ source_id: "SA-1", quote: "甲公司CEO张三" }],
      }] } }] },
  });
  assert.deepEqual(service.profiles[0].fundingInsightIds, ["FI-new"]);
  assert.equal(service.profiles[0].founderEvidence[0].fundingInsightId, "FI-new");
  assert.deepEqual(service.relationships, []);
});
