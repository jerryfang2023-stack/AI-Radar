import assert from "node:assert/strict";
import test from "node:test";
import { buildEntityHistoryService } from "../../product/entity-history-v1.mjs";

const event = {
  id: "EV-1",
  dataDate: "2026-07-17",
  date: "2026-01-18",
  eventType: "product_release",
  eventTypeLabel: "产品发布",
  eventGroup: "模型、产品与服务",
  status: "announced",
  statusLabel: "已公布",
  title: "Acme 发布 Atlas Agent",
  subject: "Acme",
  object: "Atlas Agent",
  entityIds: ["EN-1111111111111111", "EN-2222222222222222"],
  classifications: [
    { dimensionId: "technology", dimensionName: "技术", id: "agentic_execution", name: "智能体" },
    { dimensionId: "use_case", dimensionName: "场景", id: "software_development", name: "软件开发" }
  ],
  claims: [{ id: "CL-1" }],
  sources: [{ id: "SA-1" }]
};

test("entity history deduplicates cross-day entities and preserves canonical product ids", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: ["Acme AI"], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Atlas Agent", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [event]
  });
  const organization = service.profiles.find((item) => item.id === "EN-1111111111111111");
  const product = service.profiles.find((item) => item.id === "EN-2222222222222222");

  assert.equal(service.profiles.filter((item) => item.id === organization.id).length, 1);
  assert.deepEqual(organization.aliases, ["Acme AI"]);
  assert.equal(product.id, "EN-2222222222222222");
  assert.ok(service.relationships.some((item) => item.subject_ref === organization.id && item.object_ref === product.id && item.predicate === "publishes"));
});

test("technology and use case remain taxonomy nodes instead of entities", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Atlas Agent", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [event]
  });

  assert.ok(service.taxonomyNodes.some((item) => item.id === "TX-technology-agentic_execution"));
  assert.ok(service.taxonomyNodes.some((item) => item.id === "TX-use_case-software_development"));
  assert.equal(service.profiles.some((item) => ["technology", "use_case", "industry"].includes(item.entityType)), false);
});

test("viewpoint people enter the unified index without entering canonical events", () => {
  const service = buildEntityHistoryService({
    viewpointData: {
      builders: [{ name: "Jane Doe", handle: "janedoe", role: "Builder" }],
      remarks: [{ id: "VP-1", name: "Jane Doe", handle: "janedoe", role: "Builder", date: "2026-07-17", translation: "关于智能体的公开观点", url: "https://example.com/viewpoint", topic: "Agent", columnTags: [] }]
    }
  });
  const person = service.profiles.find((item) => item.entityType === "person_candidate");

  assert.ok(person.id.startsWith("EN-"));
  assert.deepEqual(person.datasetScopes, ["viewpoints"]);
  assert.deepEqual(person.eventIds, []);
  assert.deepEqual(person.viewpointIds, ["VP-1"]);
});

test("RELATION-V2 rows require event, Claim, source, and stable endpoints", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Atlas Agent", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [event]
  });
  const relation = service.relationships[0];

  assert.equal(relation.relationship_version, "RELATION-V2.0");
  assert.equal(relation.event_id, "EV-1");
  assert.deepEqual(relation.claim_refs, ["CL-1"]);
  assert.deepEqual(relation.source_refs, ["SA-1"]);
  assert.match(relation.subject_ref, /^EN-/u);
  assert.match(relation.object_ref, /^EN-/u);
});

test("product publisher resolves to the grammatical subject organization when context names another lab", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "OpenAI", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Thinking Machines Lab", entity_type: "organization_candidate", aliases: ["TML"], verification_status: "verified" },
      { entity_id: "EN-3333333333333333", canonical_name: "Inkling", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "前 OpenAI CTO 创立的 Thinking Machines Lab",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222", "EN-3333333333333333"]
    }]
  });
  const relation = service.relationships.find((item) => item.predicate === "publishes");

  assert.equal(relation?.subject_ref, "EN-2222222222222222");
  assert.equal(relation?.object_ref, "EN-3333333333333333");
});

test("an integration event cannot turn the integrator into the product publisher", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Sakana AI", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "NVIDIA", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-3333333333333333", canonical_name: "Nemotron", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "Sakana AI orchestrator",
      action: "adds",
      object: "NVIDIA Nemotron",
      title: "Sakana AI 将 NVIDIA Nemotron 接入 Fugu",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222", "EN-3333333333333333"]
    }]
  });

  assert.equal(service.relationships.some((item) => item.predicate === "publishes"), false);
});

test("organization co-occurrence cannot create a partnership without two explicit partners and a partnership action", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Rubrik", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Thinking Machines Lab", entity_type: "organization_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      eventType: "partnership",
      subject: "Cognizant and Rubrik expand",
      action: "to give enterprises control",
      object: "over autonomous AI",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222"]
    }]
  });

  assert.equal(service.relationships.some((item) => item.predicate === "partners_with"), false);
});

test("a component supplier mentioned in the object cannot become publisher of the subject product", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "NVIDIA", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Jetson Thor", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "映泰",
      action: "推出",
      object: "边缘 AI 系统，搭载 NVIDIA Jetson Thor 模组",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222"]
    }]
  });

  assert.equal(service.relationships.some((item) => item.predicate === "publishes"), false);
});
