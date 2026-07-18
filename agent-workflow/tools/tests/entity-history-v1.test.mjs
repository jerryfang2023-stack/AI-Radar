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
  claims: [{ id: "CL-1", quote: "Acme released Atlas Agent." }],
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

test("unreviewed viewpoint identities remain candidates outside canonical events", () => {
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
  assert.equal(person.verificationStatus, "candidate");
});

test("person review canonicalizes named authors and quarantines non-natural accounts", () => {
  const service = buildEntityHistoryService({
    viewpointData: {
      builders: [
        { name: "Writer's Blog", handle: "writersblog", role: "Personal publication" },
        { name: "Brand Account", handle: "brandaccount", role: "Product updates" }
      ],
      remarks: [
        { id: "VP-WRITER", name: "Writer's Blog", handle: "writersblog", date: "2026-07-17", url: "https://example.com/writer" },
        { id: "VP-BRAND", name: "Brand Account", handle: "brandaccount", date: "2026-07-17", url: "https://example.com/brand" }
      ]
    },
    reviewDecisions: {
      decisions: [
        {
          entity_id: "EN-56169569c5af5ba5",
          current: { name: "Writer's Blog", catalog_type: "person", company_names: [] },
          action: "correct",
          canonical: { name: "Writer Name", catalog_type: "person", company_names: [] },
          evidence: { claim_refs: [], secondary_sources: [] },
          review_status: "accepted",
          reviewer: "person-review"
        },
        {
          entity_id: "EN-a16ee5eb64aebdfb",
          current: { name: "Brand Account", catalog_type: "person", company_names: [] },
          action: "quarantine",
          canonical: { name: "Brand Account", catalog_type: "other", company_names: [] },
          evidence: { claim_refs: [], secondary_sources: [] },
          review_status: "accepted",
          reviewer: "person-review"
        }
      ]
    }
  });
  const writer = service.profiles.find((item) => item.id === "EN-56169569c5af5ba5");

  assert.equal(writer?.name, "Writer Name");
  assert.deepEqual(writer?.aliases, ["Writer's Blog"]);
  assert.deepEqual(writer?.viewpointIds, ["VP-WRITER"]);
  assert.equal(writer?.verificationStatus, "verified");
  assert.equal(service.profiles.some((item) => item.id === "EN-a16ee5eb64aebdfb"), false);
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
      entityIds: ["EN-1111111111111111", "EN-2222222222222222", "EN-3333333333333333"],
      claims: [{ id: "CL-1", quote: "Thinking Machines Lab released Inkling." }]
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

test("organization aliases exclude names persisted as verified products", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Anthropic", entity_type: "organization_candidate", aliases: ["Claude", "Claude Code"], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Claude", entity_type: "product_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-3333333333333333", canonical_name: "Claude Code", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ]
  });

  assert.deepEqual(service.profiles.find((item) => item.name === "Anthropic")?.aliases, []);
});

test("a repeated publisher name still resolves its explicitly launched product", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "1Password", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "1Password for Claude", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "undisclosed_subject",
      object: "1Password for Claude",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222"],
      claims: [{ id: "CL-1", quote: "1Password has launched 1Password for Claude." }]
    }]
  });

  assert.equal(service.relationships.some((item) => item.subject_ref === "EN-1111111111111111" && item.object_ref === "EN-2222222222222222"), true);
});

test("a ChatGPT-like product mention does not make Spotify the publisher of ChatGPT", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Spotify", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "ChatGPT", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "Spotify",
      action: "推出",
      object: "类 ChatGPT 音乐助手",
      title: "Spotify 推出类 ChatGPT 音乐助手",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222"],
      claims: [{ id: "CL-1", quote: "Spotify expands its AI push with a ChatGPT-like music assistant." }]
    }]
  });

  assert.equal(service.relationships.some((item) => item.predicate === "publishes"), false);
});

test("a benchmark comparison does not assign a competitor product to the releasing company", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "OpenAI", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "GPT-5.5-Cyber", entity_type: "product_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-3333333333333333", canonical_name: "Claude Mythos 5", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "undisclosed_subject",
      action: "product_release",
      object: "GPT-5.5-Cyber outperforms Claude Mythos 5",
      title: "OpenAI releases GPT-5.5-Cyber, outperforming Claude Mythos 5",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222", "EN-3333333333333333"],
      claims: [
        { id: "CL-1", quote: "OpenAI released GPT-5.5-Cyber for security teams." },
        { id: "CL-2", quote: "Claude Mythos 5 scored 83.8% in the comparison." }
      ]
    }]
  });

  assert.equal(service.relationships.some((item) => item.object_ref === "EN-2222222222222222"), true);
  assert.equal(service.relationships.some((item) => item.object_ref === "EN-3333333333333333"), false);
});

test("a Chinese publisher name adjoining prose still resolves to its released product", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "阿里云", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "峰谷 Token", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "阿里云：QoderWork",
      action: "推出",
      object: "峰谷 Token",
      title: "阿里云推出峰谷 Token",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222"],
      claims: [{ id: "CL-1", quote: "阿里云公告，QoderWork 推出“峰谷 Token”，供开发者错峰使用。" }]
    }]
  });

  assert.equal(service.relationships.some((item) => item.subject_ref === "EN-1111111111111111" && item.object_ref === "EN-2222222222222222"), true);
});

test("a platform launch does not make a third-party model the platform company's product", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Microsoft", entity_type: "organization_candidate", aliases: ["微软"], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Anthropic", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-3333333333333333", canonical_name: "Claude", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "微软全面",
      action: "推出",
      object: "Anthropic Claude 模型 Azure 云服务",
      title: "微软推出 Anthropic Claude 模型 Azure 云服务",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222", "EN-3333333333333333"],
      claims: [{ id: "CL-1", quote: "微软正式在 Microsoft Foundry 平台推出托管在 Azure 云服务上的 Anthropic Claude 模型。" }]
    }]
  });

  assert.equal(service.relationships.some((item) => item.subject_ref === "EN-1111111111111111" && item.object_ref === "EN-3333333333333333"), false);
});

test("a source title and accepted claim can jointly prove a direct product launch", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "NVIDIA", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Jetson Thor", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{
      ...event,
      subject: "NVIDIA",
      action: "Introduces New Jetson Thor Computers",
      object: "to Advance Mainstream Robotics and Edge AI",
      title: "NVIDIA Introduces New Jetson Thor Computers for Mainstream Robotics and Edge AI",
      entityIds: ["EN-1111111111111111", "EN-2222222222222222"],
      claims: [
        { id: "CL-1", quote: "NVIDIA today introduced the T3000 and T2000, new modules based on the NVIDIA Thor architecture." },
        { id: "CL-2", quote: "Jetson AGX Thor is powering the next generation of humanoid and robotic systems." }
      ]
    }]
  });

  assert.equal(service.relationships.some((item) => item.subject_ref === "EN-1111111111111111" && item.object_ref === "EN-2222222222222222"), true);
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

test("accepted catalog review corrections update serving fields and keep Claim-backed ownership", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Atlas Agent", entity_type: "organization_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [event],
    reviewDecisions: {
      decisions: [{
        entity_id: "EN-2222222222222222",
        action: "correct",
        canonical: { name: "Atlas Platform", catalog_type: "product", company_names: ["Acme"] },
        evidence: { claim_refs: ["CL-1"], secondary_source_refs: [] },
        review_status: "accepted",
        reviewer: "codex-entity-review"
      }]
    }
  });
  const product = service.profiles.find((item) => item.id === "EN-2222222222222222");

  assert.equal(product?.name, "Atlas Platform");
  assert.equal(product?.entityType, "product_candidate");
  assert.deepEqual(product?.aliases, ["Atlas Agent"]);
  assert.equal(service.relationships.some((item) => item.subject_ref === "EN-1111111111111111" && item.object_ref === product.id && item.claim_refs.includes("CL-1")), true);
  assert.equal(service.manifest.review.corrected, 1);
});

test("accepted catalog review quarantines non-entities and merges duplicate ids in the serving projection", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Atlas Agent", entity_type: "product_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-3333333333333333", canonical_name: "Atlas Agent launch", entity_type: "product_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-4444444444444444", canonical_name: "Launches", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [{ ...event, entityIds: ["EN-1111111111111111", "EN-3333333333333333", "EN-4444444444444444"] }],
    reviewDecisions: {
      decisions: [
        {
          entity_id: "EN-3333333333333333",
          action: "merge",
          merge_into_entity_id: "EN-2222222222222222",
          canonical: { name: "Atlas Agent", catalog_type: "product", company_names: ["Acme"] },
          evidence: { claim_refs: ["CL-1"], secondary_source_refs: [] },
          review_status: "accepted",
          reviewer: "codex-entity-review"
        },
        {
          entity_id: "EN-4444444444444444",
          action: "quarantine",
          canonical: { name: "Launches", catalog_type: "other", company_names: [] },
          evidence: { claim_refs: ["CL-1"], secondary_source_refs: [] },
          review_status: "accepted",
          reviewer: "codex-entity-review"
        }
      ]
    }
  });

  assert.equal(service.profiles.some((item) => item.id === "EN-3333333333333333"), false);
  assert.equal(service.profiles.some((item) => item.id === "EN-4444444444444444"), false);
  assert.equal(service.profiles.find((item) => item.id === "EN-2222222222222222")?.name, "Atlas Agent");
  assert.equal(service.profiles.find((item) => item.id === "EN-2222222222222222")?.eventIds.includes("EV-1"), true);
  assert.equal(service.manifest.review.merged, 1);
  assert.equal(service.manifest.review.quarantined, 1);
});

test("accepted catalog company review bounds inferred product publishers", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "verified" },
      { entity_id: "EN-2222222222222222", canonical_name: "Atlas Agent", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [event],
    reviewDecisions: {
      decisions: [{
        entity_id: "EN-2222222222222222",
        action: "confirm",
        canonical: { name: "Atlas Agent", catalog_type: "product", company_names: [] },
        evidence: { claim_refs: ["CL-1"], secondary_sources: [] },
        review_status: "accepted",
        reviewer: "codex-entity-review"
      }]
    }
  });

  assert.equal(service.relationships.some((item) => item.predicate === "publishes" && item.object_ref === "EN-2222222222222222"), false);
});

test("explicit confirmation verifies a candidate organization for Claim-backed ownership", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "candidate" },
      { entity_id: "EN-2222222222222222", canonical_name: "Atlas Agent", entity_type: "product_candidate", aliases: [], verification_status: "verified" }
    ],
    events: [event],
    reviewDecisions: {
      decisions: [
        {
          entity_id: "EN-1111111111111111",
          action: "confirm",
          canonical: { name: "Acme", catalog_type: "company", company_names: [] },
          evidence: { claim_refs: ["CL-1"], secondary_sources: [] },
          review_status: "accepted",
          reviewer: "codex-entity-review"
        },
        {
          entity_id: "EN-2222222222222222",
          action: "confirm",
          canonical: { name: "Atlas Agent", catalog_type: "product", company_names: ["Acme"] },
          evidence: { claim_refs: ["CL-1"], secondary_sources: [] },
          review_status: "accepted",
          reviewer: "codex-entity-review"
        }
      ]
    }
  });

  assert.equal(service.profiles.find((item) => item.id === "EN-1111111111111111")?.verificationStatus, "verified");
  assert.equal(service.relationships.some((item) => item.subject_ref === "EN-1111111111111111" && item.object_ref === "EN-2222222222222222"), true);
});

test("a reviewed Claim-backed entity missing from historical rows is materialized only in the serving projection", () => {
  const service = buildEntityHistoryService({
    entityRows: [
      { entity_id: "EN-1111111111111111", canonical_name: "Acme", entity_type: "organization_candidate", aliases: [], verification_status: "candidate" }
    ],
    events: [{ ...event, entityIds: ["EN-1111111111111111"] }],
    reviewDecisions: {
      decisions: [{
        entity_id: "EN-2222222222222222",
        current: { name: "Atlas Agent", catalog_type: "product", company_names: [] },
        action: "correct",
        canonical: { name: "Atlas Agent", catalog_type: "product", company_names: ["Acme"] },
        evidence: { claim_refs: ["CL-1"], secondary_sources: [] },
        review_status: "accepted",
        reviewer: "codex-entity-review"
      }]
    }
  });

  assert.equal(service.profiles.find((item) => item.id === "EN-2222222222222222")?.eventIds.includes("EV-1"), true);
  assert.equal(service.relationships.some((item) => item.subject_ref === "EN-1111111111111111" && item.object_ref === "EN-2222222222222222"), true);
});
