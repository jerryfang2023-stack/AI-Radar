import assert from "node:assert/strict";
import test from "node:test";
import {
  attachTargetedBackfillEvidence,
  buildTargetedBackfillQueue,
  claimTargetedBackfillTask,
  recordTargetedBackfillRun
} from "../../product/targeted-backfill-v1.mjs";

const generatedAt = "2026-07-18T00:00:00.000Z";
const company = { id: "EN-1111111111111111", name: "Acme", eventIds: ["EV-P", "EV-F", "EV-D"] };
const product = { id: "EN-2222222222222222", name: "Atlas Agent", eventIds: ["EV-P"] };
const baseEvent = {
  dataDate: "2026-07-17",
  date: "2026-07-16",
  publicationStatus: "verified",
  entityIds: [company.id, "EN-3333333333333333"],
  entityNames: [company.name, "Example AI"],
  claims: [{ id: "CL-1", quote: "Acme announced an AI change." }],
  sources: [{ id: "SA-1", url: "https://acme.example/news/item", publisher: "acme.example" }]
};

function fixture() {
  return {
    meta: { productVersion: "SITE-V4.2.0-entity-history", currentDate: "2026-07-17" },
    entityHistoryManifest: { entityVersion: "ENTITY-V1.0", coverage: { startDate: "2026-01-20", endDate: "2026-07-17" } },
    companies: [company],
    products: [product],
    events: [
      { ...baseEvent, id: "EV-P", eventType: "product_release", title: "Acme 发布 Atlas Agent", subject: "Acme", metrics: [] },
      { ...baseEvent, id: "EV-F", eventType: "funding", title: "Acme 完成融资", originalTitle: "Acme raises funding", subject: "Acme", metrics: [] },
      { ...baseEvent, id: "EV-D", eventType: "deployment", title: "Acme 公司部署 AI", originalTitle: "Acme company deploys AI", action: "部署", subject: "Acme", metrics: [] }
    ],
    fde: [{ id: "FDE-1", eventId: "EV-D", customer: "Acme", vendor: "", useCase: "", stage: "announced", reportedNeed: "未披露", deliveryComponents: [], outcomes: [], undisclosedFields: ["vendor", "reported_outcomes"] }]
  };
}

test("builds stable company, product, funding, and deployment backfill tasks", () => {
  const queue = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  assert.deepEqual(new Set(queue.tasks.map((task) => task.taskType)), new Set(["company_history", "product_history", "funding_detail", "deployment_case"]));
  assert.equal(queue.manifest.queueVersion, "BACKFILL-V1.0");
  assert.equal(queue.tasks.every((task) => task.searchPlan.forbiddenAsFactEvidence.includes("search_result_snippet")), true);
  assert.ok(queue.tasks.find((task) => task.taskType === "funding_detail").detection.missingFields.includes("funding_amount"));
  assert.ok(queue.tasks.find((task) => task.taskType === "deployment_case").detection.missingFields.includes("vendor"));
});

test("preserves task state across deterministic queue rebuilds", () => {
  const first = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  const task = first.tasks[0];
  claimTargetedBackfillTask(first, { taskId: task.taskId, worker: "source-agent", at: generatedAt });
  const second = buildTargetedBackfillQueue({ data: fixture(), previousQueue: first, generatedAt: "2026-07-19T00:00:00.000Z" });
  const rebuilt = second.tasks.find((item) => item.taskId === task.taskId);
  assert.equal(rebuilt.state.status, "in_progress");
  assert.equal(rebuilt.state.worker, "source-agent");
  assert.equal(rebuilt.detection.detectedAt, generatedAt);
});

test("records discovery candidates without treating them as accepted facts", () => {
  const queue = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  const task = queue.tasks.find((item) => item.taskType === "company_history");
  claimTargetedBackfillTask(queue, { taskId: task.taskId, worker: "source-agent", at: generatedAt });
  const { run } = recordTargetedBackfillRun(queue, {
    taskId: task.taskId,
    at: "2026-07-18T01:00:00.000Z",
    report: { attemptedQueries: task.searchPlan.queries, candidates: [{ url: "https://acme.example/news/new", title: "Acme update" }] }
  });
  assert.equal(task.state.status, "candidates_found");
  assert.equal(task.state.acceptedRefs.length, 0);
  assert.equal(run.candidates[0].publisher, "acme.example");
  assert.equal("snippet" in run.candidates[0], false);
});

test("rejects unclaimed discovery-run writes", () => {
  const queue = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  const task = queue.tasks.find((item) => item.taskType === "company_history");
  assert.throws(() => recordTargetedBackfillRun(queue, { taskId: task.taskId, report: { attemptedQueries: task.searchPlan.queries } }), /must be claimed/u);
});

test("requires SourceArtifact and RawDocument before attaching exact-span Claims", () => {
  const queue = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  const task = queue.tasks.find((item) => item.taskType === "funding_detail");
  assert.throws(() => attachTargetedBackfillEvidence(queue, { taskId: task.taskId, sourceArtifactId: "SA-2" }), /Both SourceArtifact and RawDocument/u);
  attachTargetedBackfillEvidence(queue, { taskId: task.taskId, sourceArtifactId: "SA-2", rawId: "RAW-2", claimIds: ["CL-2"], at: generatedAt });
  assert.equal(task.state.status, "accepted_pending_rebuild");
  assert.deepEqual(task.state.acceptedRefs, ["CL-2"]);
});

test("keeps a completed recurring sweep closed until its next review date", () => {
  const first = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  const task = first.tasks.find((item) => item.taskType === "company_history");
  attachTargetedBackfillEvidence(first, { taskId: task.taskId, sourceArtifactId: "SA-2", rawId: "RAW-2", claimIds: ["CL-2"], at: generatedAt });
  const second = buildTargetedBackfillQueue({ data: fixture(), previousQueue: first, generatedAt: "2026-07-19T00:00:00.000Z" });
  assert.equal(second.tasks.find((item) => item.taskId === task.taskId).state.status, "accepted_pending_rebuild");
  assert.equal(second.tasks.find((item) => item.taskId === task.taskId).state.nextReviewOn, "2026-08-17");
});

test("resolves a fact-gap only when the canonical target remains and the gap disappears", () => {
  const first = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  const repaired = fixture();
  const funding = repaired.events.find((event) => event.id === "EV-F");
  funding.title = "Acme 获 1200 万美元 A 轮融资，由 Example Ventures 领投";
  funding.originalTitle = "Acme raises $12 million Series A led by Example Ventures";
  funding.claims = [{ id: "CL-2", quote: "Acme raised $12 million in a Series A led by Example Ventures." }];
  const second = buildTargetedBackfillQueue({ data: repaired, previousQueue: first, generatedAt: "2026-07-19T00:00:00.000Z" });
  assert.equal(second.tasks.some((task) => task.target.eventId === "EV-F"), false);
  assert.equal(second.resolvedTasks.find((task) => task.target.eventId === "EV-F").state.status, "resolved");
});

test("retires a task instead of claiming success when its canonical target disappears", () => {
  const first = buildTargetedBackfillQueue({ data: fixture(), generatedAt });
  const rebuilt = fixture();
  rebuilt.events = rebuilt.events.filter((event) => event.id !== "EV-F");
  const second = buildTargetedBackfillQueue({ data: rebuilt, previousQueue: first, generatedAt: "2026-07-19T00:00:00.000Z" });
  assert.equal(second.resolvedTasks.some((task) => task.target.eventId === "EV-F"), false);
  const retired = second.retiredTasks.find((task) => task.target.eventId === "EV-F");
  assert.equal(retired.state.status, "retired");
  assert.equal(retired.state.retirementReason, "target_no_longer_canonical");
});

test("funding searches use the disclosed company subject instead of an investor-shaped display title", () => {
  const data = fixture();
  data.events.find((event) => event.id === "EV-F").title = "Microsoft 完成 1200 万美元 A 轮融资";
  data.events.find((event) => event.id === "EV-F").originalTitle = "";
  data.events.find((event) => event.id === "EV-F").subject = "Solve Intelligence";
  data.events.find((event) => event.id === "EV-F").claims = [{ id: "CL-2", quote: "Solve Intelligence raised $12 million in a Series A." }];
  const queue = buildTargetedBackfillQueue({ data, generatedAt });
  const task = queue.tasks.find((item) => item.taskType === "funding_detail");
  assert.equal(task.target.name, "Solve Intelligence");
  assert.ok(task.searchPlan.queries[0].startsWith("\"Solve Intelligence\""));
});

test("excludes upstream false funding, consumer feature, and generic product targets", () => {
  const data = fixture();
  data.events.push(
    { ...baseEvent, id: "EV-BAD-F", eventType: "funding", title: "AI Finance Automation Case Study: Month-End Close 11→3 Days", action: "Close", object: "11→3 Days", subject: "Case Study" },
    { ...baseEvent, id: "EV-BAD-D", eventType: "deployment", title: "高考志愿助手上线，免费提供咨询服务", action: "上线", object: "AI 志愿助手", subject: "Example" }
  );
  data.products.push({ id: "EN-4444444444444444", name: "Blog", eventIds: ["EV-P"] });
  const queue = buildTargetedBackfillQueue({ data, generatedAt });
  assert.equal(queue.tasks.some((task) => task.target.eventId === "EV-BAD-F"), false);
  assert.equal(queue.tasks.some((task) => task.target.eventId === "EV-BAD-D"), false);
  assert.equal(queue.tasks.some((task) => task.target.name === "Blog"), false);
});
