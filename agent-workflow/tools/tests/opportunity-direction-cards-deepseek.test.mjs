import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  buildDirectionEvidenceManifest,
  directionCandidatePayloadProblems,
  directionCardEditorialProblems,
} from "../generate-opportunity-direction-cards-deepseek.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");

function validCard(overrides = {}) {
  return {
    id: "DIR-20260725-01",
    title: "模型价值正在从单一调用层迁移至成本治理层",
    judgment: "旧均衡依赖单一模型能力，当前变量是多模型之间的成本与能力差异，价值正在迁移到能解释选择并控制预算的路由层，边界是路由复杂度不能超过节省。",
    hypothesis: "工程团队需要按任务、成本与延迟自动选择模型，并愿意为可审计的模型网关支付治理预算。",
    status: "validation_ready",
    buyer: "工程团队",
    task: "模型选择与成本控制",
    pain: "多模型选择复杂",
    product_wedge: "可审计模型网关",
    current_alternatives: "人工切换模型",
    why_now: "两个不同主体的已验收事件同时显示模型成本差异与自动路由需求正在出现。",
    counter_signal: "如果企业继续使用单一模型且不采购独立治理层，该判断被推翻。",
    unknowns: ["企业是否愿意把模型选择交给第三方网关？", "路由延迟是否会抵消成本收益？"],
    validation_action: "访谈使用多模型的工程负责人并核对实际切换流程。",
    minimum_evidence: 2,
    evidence_refs: [
      { event_id: "EV-A", claim_refs: ["CL-A"], source_refs: ["SA-A"] },
      { event_id: "EV-B", claim_refs: ["CL-B"], source_refs: ["SA-B"] },
    ],
    ...overrides,
  };
}

function manifest() {
  return {
    evidence: [
      {
        id: "EV-A",
        actor: "A",
        type: "product_service",
        title: "模型路由发布",
        source_excerpt: "支持按成本切换模型",
        claim_refs: ["CL-A"],
        source_refs: ["SA-A"],
      },
      {
        id: "EV-B",
        actor: "B",
        type: "case",
        title: "企业采用路由",
        source_excerpt: "企业开始治理模型调用",
        claim_refs: ["CL-B"],
        source_refs: ["SA-B"],
      },
    ],
  };
}

test("Direction Card editorial gate requires judgment, falsifiability, and bounded V4 evidence", () => {
  assert.deepEqual(directionCardEditorialProblems(validCard()), []);
  assert.ok(directionCardEditorialProblems(validCard({ title: "AI平台" })).includes("title_is_generic_category"));
  assert.ok(directionCardEditorialProblems(validCard({ counter_signal: "" })).includes("missing_counter_signal"));
  assert.ok(directionCardEditorialProblems(validCard({ minimum_evidence: 5 })).includes("minimum_evidence_must_match_refs"));
  assert.ok(directionCardEditorialProblems(validCard({ evidence_refs: [] })).includes("evidence_refs_must_be_2_to_5"));
});

test("Direction Card payload rejects unsupported factual numbers and single-actor evidence", () => {
  assert.deepEqual(directionCandidatePayloadProblems({
    candidates: [
      validCard(),
      validCard({ id: "DIR-20260725-02", title: "模型预算正在从采购转向运行治理" }),
    ],
  }, manifest()), []);
  const problems = directionCandidatePayloadProblems({
    candidates: [
      validCard({ hypothesis: "工程团队声称可以降低30%的成本，因此愿意为模型网关付费。" }),
      validCard({ id: "DIR-20260725-02", title: "模型预算正在从采购转向运行治理" }),
    ],
  }, manifest());
  assert.ok(problems.some((item) => item.includes("unsupported_number:30%")));
});

test("generated and reviewed Direction Cards preserve DeepSeek V4 Pro provenance and V4 refs", () => {
  const candidates = JSON.parse(fs.readFileSync(path.join(root, "agent-workflow/product/opportunity-direction-card-candidates.json"), "utf8"));
  const reviewed = JSON.parse(fs.readFileSync(path.join(root, "agent-workflow/product/opportunity-direction-cards.json"), "utf8"));
  assert.equal(candidates.generator.provider, "deepseek");
  assert.equal(candidates.generator.model, "deepseek-v4-pro");
  assert.ok(["pending_human_review", "approved_and_promoted"].includes(candidates.review_status));
  assert.equal(reviewed.draft_provenance.model, "deepseek-v4-pro");
  assert.equal(reviewed.review_mode, "human_reviewed_deepseek_draft");
  assert.equal(reviewed.cards.length, 2);
  assert.ok(reviewed.cards.every((card) => card.judgment && card.counter_signal));
  assert.ok([...candidates.candidates, ...reviewed.cards].every((card) => (
    !Object.hasOwn(card, "evidence_card_ids")
    && card.evidence_refs.every((ref) => ref.event_id.startsWith("EV-") && ref.claim_refs.length && ref.source_refs.length)
  )));
});

test("weekly automation treats opportunity generation as a non-blocking lane", () => {
  const controller = fs.readFileSync(path.join(root, "agent-workflow/tools/run-periodic-automation-controller.mjs"), "utf8");
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/periodic-reports-pr.yml"), "utf8");
  assert.match(controller, /generate-opportunity-direction-cards-deepseek\.mjs/u);
  assert.match(controller, /opportunity-direction-card-candidates\.json/u);
  assert.doesNotMatch(controller, /generate-opportunity-direction-cards-deepseek\.mjs[^]*opportunity-direction-cards\.json/u);
  assert.doesNotMatch(controller, /backfill-opportunity-signals|build-v3-data-observation-desk/u);
  assert.doesNotMatch(controller, /status:\s*"opportunity_refresh_failed"/u);
  assert.match(controller, /page_gate_passed_with_opportunity_warning/u);
  assert.match(workflow, /agent-workflow\/product\/opportunity-direction-card-candidates\.json/u);
});

test("Direction Card evidence manifest uses accepted source-backed V4 events", () => {
  const evidenceManifest = buildDirectionEvidenceManifest(root, { asOf: "2026-07-25", limit: 20 });
  assert.equal(evidenceManifest.active_date, "2026-07-25");
  assert.equal(evidenceManifest.window_days, 30);
  assert.ok(evidenceManifest.evidence.length > 5);
  assert.ok(evidenceManifest.evidence.every((item) => item.id.startsWith("EV-") && item.source_url && item.source_excerpt));
  assert.ok(evidenceManifest.evidence.every((item) => item.claim_refs.length && item.source_refs.length));
  assert.equal(JSON.stringify(evidenceManifest).includes("SIG-"), false);
});
