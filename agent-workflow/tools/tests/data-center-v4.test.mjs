import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildBundle, eventAiRelevanceEvidence, findEventRule, normalizeEventTitle, trimBoilerplate } from "../build-data-center-v4.mjs";
import { evaluateBundle } from "../assert-data-center-v4.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const taxonomy = JSON.parse(fs.readFileSync(path.join(root, "agent-workflow/product/tag-taxonomy-v4.json"), "utf8"));
const date = "2026-07-16";

function entry(id, title, body, extra = {}) {
  return {
    file: path.join(root, `fixtures/${id}.json`),
    raw: {
      raw_id: id,
      title,
      original_url: `https://example.com/${id}`,
      canonical_url: `https://example.com/${id}`,
      source_name: "Example News",
      source_type: "news",
      source_role: "resolved_original_source",
      published_at: `${date}T01:00:00.000Z`,
      collected_at: `${date}T02:00:00.000Z`,
      language: "en",
      clean_text: body,
      content_hash: id,
      extraction_method: "fixture",
      ...extra
    }
  };
}

test("opinion article does not become a regulation or hardware event", () => {
  const bundle = buildBundle([
    entry("opinion", "Lorde says AI glasses are not sexy", "Lorde says AI glasses are not sexy. A related lawsuit is mentioned later in background material. Most Popular\nApple sues another company.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.equal(bundle.canonical_events.length, 0);
  assert.equal(bundle.hardware_records.length, 0);
  assert.equal(bundle.qa_queue[0].reason, "opinion_without_source_bounded_event");
});

test("pending funding is represented as disputed and never projected", () => {
  const bundle = buildBundle([
    entry("pending-funding", "Acme AI in talks to raise $200 million Series B", "Acme AI is in talks to raise about $200 million at a $2 billion valuation. Talks are ongoing and the deal may not be final.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.equal(bundle.canonical_events[0].event_type, "funding");
  assert.equal(bundle.canonical_events[0].event_status, "disputed");
  assert.equal(bundle.canonical_events[0].publication_status, "disputed");
  assert.equal(bundle.fde_records.length, 0);
  assert.equal(bundle.hardware_records.length, 0);
});

test("duplicate funding sources cluster and preserve status conflict", () => {
  const bundle = buildBundle([
    entry("funding-confirmed", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round."),
    entry("funding-pending", "Acme AI in talks to raise $10 million", "Acme AI is in talks to raise $10 million. The deal may not be final.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].source_refs.length, 2);
  assert.equal(bundle.canonical_events[0].publication_status, "disputed");
  assert.equal(bundle.event_conflicts.length, 1);
});

test("same URL snapshots use content-addressed source IDs and identical captures are deduplicated", () => {
  const sameUrl = "https://example.com/versioned";
  const first = entry("snapshot-a", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round.", {
    original_url: sameUrl,
    canonical_url: sameUrl,
    content_hash: "content-a"
  });
  const duplicate = entry("snapshot-a-copy", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round.", {
    original_url: sameUrl,
    canonical_url: sameUrl,
    content_hash: "content-a"
  });
  const update = entry("snapshot-b", "Acme AI raises $20 million", "Acme AI raised $20 million in a later financing round.", {
    original_url: sameUrl,
    canonical_url: sameUrl,
    content_hash: "content-b"
  });
  const bundle = buildBundle([first, duplicate, update], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.source_artifacts.length, 2);
  assert.equal(bundle.raw_documents.length, 2);
  assert.equal(new Set(bundle.source_artifacts.map((item) => item.source_artifact_id)).size, 2);
  assert.equal(new Set(bundle.raw_documents.map((item) => item.raw_id)).size, 2);
  assert.equal(new Set(bundle.claims.map((item) => item.claim_id)).size, bundle.claims.length);
});

test("guides and implementation explainers do not become deployment events", () => {
  const bundle = buildBundle([
    entry("cost-guide", "Cost to Implement AI Customer Support for Software Startups in 2026", "This guide explains the cost to implement AI customer support for startups."),
    entry("fde-guide", "Forward Deployed Engineer (FDE): The Essential 2026 Guide", "This guide explains the forward deployed engineer role."),
    entry("how-case", "How Forward Deployed Engineers Transformed Customer Outcomes", "This article explains how forward deployed engineers work with customers.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
});

test("blocked, community, and launch-index sources do not become canonical events", () => {
  const bundle = buildBundle([
    entry("blocked-source", "Hugging Face Releases Experimental AI Agent for Computers", "Hugging Face released an experimental AI computer agent.", {
      raw_qc_decision: "block",
      extraction_quality: "failed"
    }),
    entry("community-source", "Hugging Face releases free AI computer agent", "Hugging Face released a free AI computer agent.", {
      original_url: "https://www.facebook.com/groups/example/posts/123/",
      canonical_url: "https://www.facebook.com/groups/example/posts/123/",
      raw_qc_decision: "allow_with_degradation",
      extraction_quality: "low"
    }),
    entry("launch-index", "Launch HN: Chamber – An AI Teammate for GPU Infrastructure", "Chamber launched an AI teammate for GPU infrastructure.", {
      original_url: "https://example.com/",
      canonical_url: "https://example.com/"
    })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.deepEqual(
    new Set(bundle.qa_queue.map((item) => item.reason)),
    new Set(["raw_source_quality_block", "community_source_requires_original_event_source", "non_event_or_index_title"])
  );
});

test("funding amounts with equivalent units cluster into one canonical event", () => {
  const bundle = buildBundle([
    entry("funding-million", "InstaLILY Raises $60 Million Series B", "InstaLILY raised $60 million in a Series B financing round for its AI teammates."),
    entry("funding-short-unit", "InstaLILY raises $60M", "InstaLILY raised $60M to expand its AI teammate platform.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].source_refs.length, 2);
});

test("launches with disclosed capital is normalized as funding", () => {
  const bundle = buildBundle([
    entry(
      "launches-with-capital",
      "Exclusive: Startup Adapter Launches With $17.8M To Bring New Cognition To AI Tools",
      "Startup Adapter launches with $17.8 million in financing to build enterprise AI tools."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "funding");
  assert.equal(bundle.canonical_events[0].display_title_zh, "Adapter 完成 1780 万美元融资");
});

test("incomplete mixed-language public titles remain canonical but are withheld from public compatibility output", () => {
  const bundle = buildBundle([
    entry(
      "untranslated-product",
      "OpenAI releases new voice models for more natural live conversations",
      "OpenAI released new AI voice models for more natural live conversations."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.ok(bundle.canonical_events[0].missing_fields.includes("display_title_zh"));
  assert.equal(bundle.compatibility_cards.length, 0);
  assert.ok(bundle.qa_queue.some((item) => item.reason === "public_event_title_incomplete"));
  const result = evaluateBundle(bundle, taxonomy);
  assert.equal(result.failures.some((failure) => failure.includes("display_title_zh incomplete")), false);
});

test("product launch is not rewritten as funding", () => {
  const bundle = buildBundle([
    entry("launch", "Samsung SDS launches enterprise AI agent platform", "Samsung SDS launched an enterprise AI agent platform for customers. The platform supports tool use and human review in workflows.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.equal(bundle.canonical_events[0].event_type, "product_release");
  assert.ok(bundle.tag_assertions.some((item) => item.tag_id === "agentic_execution"));
  assert.ok(bundle.tag_assertions.every((item) => item.evidence_ref && item.source_span));
});

test("named products are persisted as source-backed product entities", () => {
  const bundle = buildBundle([
    entry("named-product", "OpenAI releases GPT-Red model", "OpenAI released the GPT-Red model for AI safety research.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  const product = bundle.entities.find((entity) => entity.entity_type === "product_candidate" && entity.canonical_name === "GPT-Red");

  assert.ok(product);
  assert.ok(bundle.canonical_events[0].entities.includes(product.entity_id));
  assert.ok(bundle.entity_mentions.some((mention) => mention.entity_id === product.entity_id && mention.text === "GPT-Red"));
});

test("product entities exclude organization roles and generic marketing phrases", () => {
  const bundle = buildBundle([
    entry("named-product-role", "Thinking Machines Lab releases Inkling model", "Thinking Machines Lab released the Inkling model. The company was founded by a former OpenAI CTO."),
    entry("generic-product-phrase", "Acme releases AI-powered game-creation platform", "Acme released an AI-powered game-creation platform for developers.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  const names = bundle.entities.filter((entity) => entity.entity_type === "product_candidate").map((entity) => entity.canonical_name);

  assert.ok(names.includes("Inkling"));
  assert.equal(names.some((name) => /OpenAI CTO|AI-powered game-creation/iu.test(name)), false);
});

test("scheduled product launch remains a planned product event", () => {
  const bundle = buildBundle([
    entry("scheduled-launch", "Samsung SDS to launch FuriosaAI-powered AI services on July 16", "Samsung SDS will launch FuriosaAI-powered AI services on July 16. The company described product availability and deployment support.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.equal(bundle.canonical_events[0].event_type, "product_release");
  assert.equal(bundle.canonical_events[0].event_status, "planned");
});

test("Chinese technical tags are assigned from the accepted Claim span", () => {
  const bundle = buildBundle([
    entry("zh-tags", "Acme 发布支持端侧推理的多模态模型", "Acme 发布支持端侧推理的多模态模型，并提供设备端运行能力。", { language: "zh" })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.deepEqual(new Set(bundle.tag_assertions.map((item) => item.tag_id)), new Set(["multimodal", "on_device"]));
});

test("taxonomy assertions reject an unrelated aggregated headline inside the same Raw document", () => {
  const bundle = buildBundle([
    entry(
      "aggregated-headline",
      "Google releases LiteRT.js JavaScript binding",
      "Google Research introduces a wearable health foundation model. Google releases LiteRT.js, a JavaScript binding for on-device inference."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.ok(bundle.tag_assertions.some((item) => item.tag_id === "on_device"));
  assert.ok(bundle.facet_assertions.every((item) => item.value_id !== "model"));
});

test("hardware projection requires a concrete hardware event", () => {
  const bundle = buildBundle([
    entry("hardware", "Nvidia ships 10,000 GPUs to Example Cloud for AI workloads", "Nvidia shipped 10,000 GPUs to Example Cloud for a new AI data center cluster.", {
      title_zh: "NVIDIA 向 Example Cloud 交付 1 万块 GPU，用于 AI 数据中心集群"
    }),
    entry("lawsuit", "Apple sues OpenAI over trade secrets", "Apple sued OpenAI. The background mentions servers and chips."),
    entry("software", "LMSYS launches inference optimization", "LMSYS launched inference optimization software tested on eight B300 GPUs."),
    entry("whitepaper", "Acme accelerator whitepaper released", "Acme released a whitepaper about an accelerator architecture.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.equal(bundle.hardware_records.length, 1);
  assert.equal(bundle.hardware_records[0].component_type, "gpu");
  assert.equal(bundle.hardware_records[0].hardware_event_type, "hardware_supply");
  assert.equal(bundle.hardware_records[0].capacity, 10000);
  assert.equal(bundle.hardware_records[0].capacity_unit.toLowerCase(), "gpus");
});

test("a computer launch with explicit accelerator modules becomes a hardware product", () => {
  const bundle = buildBundle([
    entry(
      "jetson-thor",
      "NVIDIA introduces new Jetson Thor computers for mainstream robotics and edge AI",
      "NVIDIA introduced the T3000 and T2000 computers. The new modules use NVIDIA Thor GPUs for robotics and edge AI systems.",
      { title_zh: "NVIDIA 发布 Jetson Thor 计算机，面向机器人与边缘 AI" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "hardware_product");
  assert.equal(bundle.hardware_records.length, 1);
  assert.equal(bundle.hardware_records[0].component_type, "gpu");
  assert.deepEqual(bundle.hardware_records[0].claim_refs, bundle.canonical_events[0].claim_refs);
});

test("a source-bounded portable AI hardware launch receives a hardware projection", () => {
  const bundle = buildBundle([
    entry(
      "portable-ai-device",
      "Soul 将推出首款便携式 AI 智能硬件，搭载自研大模型 SoulX",
      "Soul 将推出首款便携式 AI 智能硬件产品。该产品将搭载自研语言大模型 SoulX。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "hardware_product");
  assert.equal(bundle.hardware_records[0].component_type, "ai_device");
});

test("researcher job change is not a research-result event", () => {
  const bundle = buildBundle([
    entry("researcher", "OpenAI researcher Miles Wang plans to leave and found a startup", "OpenAI researcher Miles Wang plans to leave the company and found a startup.", {
      title_zh: "OpenAI 研究员 Miles Wang 计划离职创业"
    })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.equal(bundle.canonical_events[0].event_type, "organization_people");
  assert.equal(bundle.canonical_events[0].event_status, "planned");
  assert.deepEqual(bundle.entities.map((item) => item.canonical_name), ["OpenAI"]);
});

test("organization extraction excludes people and title fragments", () => {
  const bundle = buildBundle([
    entry("meta-lawsuit", "26 名 Meta AI 员工起诉公司：休病假或育儿假也会导致自己被裁", "26 名 Meta AI 员工起诉公司，称人工智能团队裁员流程存在问题。", { language: "zh" }),
    entry("baidu-contract", "百度智能云 2026 上半年大模型中标金额居首", "百度智能云在 2026 年上半年大模型项目中标金额居首。", { language: "zh" })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  const names = bundle.entities.map((item) => item.canonical_name).sort();

  assert.deepEqual(names, ["Baidu AI Cloud", "Meta"]);
  assert.ok(names.every((name) => !/员工|2026|大模型/u.test(name)));
});

test("boilerplate is removed before claim extraction", () => {
  const cleaned = trimBoilerplate("Acme launched a model.\nMost Popular\nUnrelated lawsuit story");
  assert.equal(cleaned, "Acme launched a model.");
  assert.equal(findEventRule("Acme launched a model").eventType, "model_release");
  assert.equal(normalizeEventTitle("Samsung SDS to Launch AI Services < Semiconductor < 기사본문 - The Elec Inc."), "Samsung SDS to Launch AI Services");
});

test("current factual title language maps to canonical event types", () => {
  const cases = [
    ["OpenAI 在欧盟法院商标纠纷中败诉，OPENAI 因缺乏显著性被驳回注册", "lawsuit_settlement"],
    ["网信部门公布 7 款手机端侧生成式 AI 服务备案，Apple 智能在列", "policy_regulation"],
    ["Mozilla 2026 开源 AI 报告：DeepSeek V4 Flash 月用量 18.4T Tokens 登顶", "research_result"],
    ["小米开源 Xiaomi-Robotics-U0：380 亿参数多模态具身生成模型", "model_release"],
    ["马斯克宣布开源 Grok Build 编程 AI 智能体工具", "product_release"],
    ["OpenAI 首款联名硬件：Codex Micro 键盘登场", "hardware_product"],
    ["Suno 接入 iMessage：用户可在聊天内直接 AI 生成歌曲", "partnership"],
    ["Rubrik Announces Upcoming Integration with Amazon Bedrock AgentCore to Secure AI Agents", "partnership"],
    ["澳大利亚将推出人工智能标准并设立人工智能办公室", "policy_regulation"],
    ["Anthropic 与私募巨头合资成立 AI 实施公司 Ode，初始资金 15 亿美元", "partnership"],
    ["Exclusive: Startup Adapter 完成 1780 万美元融资，用于 Bring New Cognition To AI Tools", "funding"],
    ["交友应用 Soul 将推出首款便携式 AI 智能硬件，搭载自研大模型 SoulX", "hardware_product"],
    ["MiniMax Code 2.0 桌面端焕新：底层架构全面升级，金融模块即将上线", "product_release"]
  ];

  for (const [title, eventType] of cases) assert.equal(findEventRule(title)?.eventType, eventType, title);
});

test("a source-bounded app launch in the lead becomes a product event", () => {
  const bundle = buildBundle([
    entry(
      "reelful",
      "Reelful 利用 AI 将相册内容自动剪辑成短视频",
      "A new iOS app called Reelful uses AI to automatically turn photos and video clips into polished short-form videos. The app's launch reflects a broader shift in consumer creation tools."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "product_release");
  assert.equal(bundle.claims[0].subject, "Reelful");
});

test("multi-event roundups and codebase discoveries stay out of canonical events", () => {
  assert.equal(findEventRule("Apple 智能通过备案，阿里千问将集成至国行 iPhone；小米开源具身通用模型"), null);
  assert.equal(findEventRule("xAI 开源 Grok CLI 代码库中发现 Mermaid 转 Unicode 框图工具"), null);

  const bundle = buildBundle([
    entry(
      "roundup",
      "Apple 智能通过备案，阿里千问将集成至国行 iPhone；小米开源具身通用模型",
      "Apple 智能通过备案。阿里千问将集成至国行 iPhone。小米开源具身通用模型。"
    ),
    entry(
      "code-discovery",
      "xAI 开源 Grok CLI 代码库中发现 Mermaid 转 Unicode 框图工具",
      "While exploring the newly open-sourced codebase, an existing Mermaid renderer was discovered."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
});

test("opinion proposals and post-launch usage headlines do not become commercial events", () => {
  const bundle = buildBundle([
    entry(
      "proposal",
      "诺奖得主哈萨比斯预言：AGI 影响将是工业革命 10 倍，提议设立前沿 AI 标准机构",
      "哈萨比斯在访谈中预测 AGI 的影响，并提议设立一个前沿 AI 标准机构。",
      { language: "zh" }
    ),
    entry(
      "usage",
      "腾讯混元 Hy3 上线一周调用量增长超 68 倍，登顶 OpenRouter 全球总榜",
      "腾讯混元 Hy3 上线一周后，调用量增长超过 68 倍。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.ok(bundle.qa_queue.every((item) => ["opinion_without_source_bounded_event", "no_source_bounded_event"].includes(item.reason)));
});

test("AI industry scope gate rejects unrelated technology news and generic vertical publicity", () => {
  const bundle = buildBundle([
    entry("windows", "Microsoft releases patches for Windows zero-day vulnerabilities", "Microsoft released security patches for Windows zero-day vulnerabilities."),
    entry("spacex", "SpaceX launches Starship after IPO filing", "SpaceX launched Starship after an IPO filing."),
    entry("apollo", "Buzz Aldrin sells pen that helped launch Apollo", "Buzz Aldrin sold a felt-tip pen that helped launch Apollo."),
    entry(
      "vertical-publicity",
      "我国首个水风光一体化智慧运营大模型在雅砻江流域发布",
      "国投集团雅砻江公司发布我国首个水风光一体化智慧运营大模型，用于流域水文和气象预测。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.equal(bundle.claims.length, 0);
  assert.deepEqual(
    new Set(bundle.qa_queue.map((item) => item.reason)),
    new Set(["event_not_ai_relevant", "event_outside_ai_industry_scope"])
  );
});

test("administrative AI voucher programs do not enter commercial events", () => {
  const bundle = buildBundle([
    entry(
      "model-voucher",
      "北京亦庄联合京东云上线全国首个模型券即时补贴平台",
      "北京亦庄联合京东科技集团上线模型券即时补贴平台，企业购买模型服务可获得最高65%的即时补贴。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.equal(bundle.qa_queue[0].reason, "administrative_ai_support_program_not_commercial_event");
});

test("publisher channel does not establish AI relevance", () => {
  const bundle = buildBundle([
    entry(
      "channel-only",
      "Acme launches billing dashboard",
      "Acme launched a billing dashboard for finance teams.",
      { source_name: "AI News RSS" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.equal(bundle.qa_queue[0].reason, "event_not_ai_relevant");
});

test("negated partnerships and AI-branded merchandise stay outside canonical events", () => {
  const bundle = buildBundle([
    entry(
      "negated-partnership",
      "古尔曼：苹果与 PrismML 在 AI 量化技术上的合作可能性较低",
      "古尔曼认为苹果与 PrismML 合作的可能性较低。",
      { language: "zh" }
    ),
    entry(
      "chatgpt-basketball",
      "OpenAI 推出官方周边，含 ChatGPT 篮球、Codex T 恤等",
      "OpenAI released a ChatGPT basketball and Codex T-shirts as official merchandise.",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.ok(bundle.qa_queue.some((item) => item.reason === "non_ai_merchandise_not_industry_event"));
});

test("completed transactions outrank future-use wording in status extraction", () => {
  const bundle = buildBundle([
    entry(
      "funding-with-future-use",
      "Neko Health raises $700 million and will open its first US clinic",
      "Neko Health raised $700 million in a Series C financing round and will use the funding to open a clinic."
    ),
    entry(
      "completed-acquisition",
      "Whatnot acquires Shaped",
      "Whatnot acquired AI recommendation startup Shaped."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.deepEqual(new Set(bundle.canonical_events.map((event) => event.event_status)), new Set(["completed"]));
});

test("same named release clusters across source wording", () => {
  const bundle = buildBundle([
    entry("inkling-a", "Thinking Machines Lab releases Inkling multimodal AI model", "Thinking Machines Lab released the Inkling multimodal AI model.", {
      title_zh: "Thinking Machines Lab 发布 Inkling 多模态 AI 模型"
    }),
    entry("inkling-b", "Thinking Machines Lab launches Inkling with 975B parameters", "Thinking Machines Lab launched Inkling, a 975B parameter multimodal AI model.", {
      title_zh: "Thinking Machines Lab 发布 975B 参数的 Inkling 多模态 AI 模型"
    })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].source_refs.length, 2);
});

test("hardware capacity excludes price metrics and keeps price as contract value", () => {
  const bundle = buildBundle([
    entry(
      "priced-keyboard",
      "OpenAI releases Codex Micro AI keyboard for $230",
      "OpenAI and Work Louder released the Codex Micro keyboard for Codex. The AI keyboard costs $230.",
      { title_zh: "OpenAI 与 Work Louder 发布 Codex Micro AI 键盘，售价 230 美元" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.hardware_records.length, 1);
  assert.equal(bundle.hardware_records[0].capacity, null);
  assert.equal(bundle.hardware_records[0].capacity_unit, "");
  assert.equal(bundle.hardware_records[0].contract_value, "$230");
  assert.equal(bundle.hardware_records[0].supplier, "");
});

test("current Chinese Jetson expansion is classified as hardware product", () => {
  const bundle = buildBundle([
    entry(
      "jetson-expansion",
      "NVIDIA 扩展 Jetson Thor 计算机家族，新增 T3000、T2000 模组",
      "NVIDIA 扩展 Jetson Thor 计算机家族，新增 T3000 和 T2000 模组。新模组使用 NVIDIA Thor GPU，面向机器人与边缘 AI。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "hardware_product");
  assert.equal(bundle.hardware_records.length, 1);
});

test("FDE projection requires enterprise implementation evidence", () => {
  const bundle = buildBundle([
    entry(
      "pwc-deployment",
      "PwC is deploying Claude to employees across its business",
      "PwC is deploying Claude to employees across its business workflows. The company integrated Claude with internal knowledge systems."
    ),
    entry(
      "consumer-safety",
      "Meta AI rolls out teen self-harm notifications to parents",
      "Meta AI rolled out notifications to parents when teens discuss self-harm."
    ),
    entry(
      "implementation-jv",
      "Anthropic forms Ode AI implementation joint venture",
      "Anthropic formed Ode, an AI implementation joint venture with initial capital."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.fde_records.length, 1);
  assert.equal(bundle.fde_records[0].customer, "PwC");
  assert.ok(bundle.fde_records[0].reported_delivery_components.length > 0);
});

test("AI relevance evaluator distinguishes industry facts from generic AI wording", () => {
  assert.equal(eventAiRelevanceEvidence({
    title: "Microsoft releases Windows security patches",
    claims: ["Microsoft released Windows security patches."],
    entityNames: ["Microsoft"],
    eventType: "product_release"
  }).accepted, false);

  assert.equal(eventAiRelevanceEvidence({
    title: "我国首个水风光一体化智慧运营大模型在雅砻江流域发布",
    claims: ["国投集团雅砻江公司发布水风光一体化智慧运营大模型。"],
    entityNames: ["国投集团雅砻江公司"],
    eventType: "model_release"
  }).basis, "outside_ai_industry_event_scope");

  assert.equal(eventAiRelevanceEvidence({
    title: "Samsung SDS launches enterprise AI agent platform",
    claims: ["Samsung SDS launched an enterprise AI agent platform for customers."],
    entityNames: ["Samsung SDS"],
    eventType: "product_release"
  }).accepted, true);

  assert.equal(eventAiRelevanceEvidence({
    title: "北京亦庄联合京东云上线模型券即时补贴平台",
    claims: ["企业购买模型服务可获得最高65%的即时补贴。"],
    entityNames: ["京东云"],
    eventType: "deployment"
  }).basis, "administrative_ai_support_program");
});

test("generated bundle passes the V4 integrity gate", () => {
  const bundle = buildBundle([
    entry("deployment", "Hospital deploys Acme AI workflow", "Hospital deployed Acme AI workflow in production. The system reduced review time by 20%."),
    entry("model", "Example releases multimodal open weights model", "Example released a multimodal model with open weights for on-device use.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  const result = evaluateBundle({
    manifest: bundle.manifest,
    source_artifacts: bundle.source_artifacts,
    raw_documents: bundle.raw_documents,
    claims: bundle.claims,
    entities: bundle.entities,
    entity_mentions: bundle.entity_mentions,
    canonical_events: bundle.canonical_events,
    compatibility_cards: bundle.compatibility_cards,
    event_sources: bundle.event_sources,
    event_claims: bundle.event_claims,
    event_conflicts: bundle.event_conflicts,
    relationships: bundle.relationships,
    tag_assertions: bundle.tag_assertions,
    facet_assertions: bundle.facet_assertions,
    fde_records: bundle.fde_records,
    hardware_records: bundle.hardware_records,
    qa_queue: bundle.qa_queue,
    legacy_asset_mappings: bundle.legacy_asset_mappings
  }, taxonomy);
  assert.deepEqual(result.failures, []);
});

test("integrity gate blocks a canonical event whose evidence is no longer AI-industry scoped", () => {
  const bundle = buildBundle([
    entry("tampered", "Acme launches AI agent platform", "Acme launched an AI agent platform for customer support.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  const raw = bundle.raw_documents[0];
  const claim = bundle.claims[0];
  const card = bundle.compatibility_cards[0];
  const quote = "Acme launched a billing dashboard for finance teams.";

  raw.title_original = "Acme launches billing dashboard";
  raw.title_zh = "";
  raw.body_original = quote;
  raw.body_clean = quote;
  claim.source_quote = quote;
  claim.object = "billing dashboard";
  claim.source_span = { raw_id: raw.raw_id, start: 0, end: quote.length };
  card.title = raw.title_original;
  card.fact = quote;
  bundle.tag_assertions = [];

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("fails AI industry scope gate")));
});

test("integrity gate enforces the published JSON Schema", () => {
  const bundle = buildBundle([
    entry("schema", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.canonical_events[0].unexpected_schema_field = true;

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("additional properties")));
});

test("integrity gate enforces FDE and hardware contract versions", () => {
  const bundle = buildBundle([
    entry("projection-versions", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.manifest.fde_version = "FDE-V1.0";
  bundle.manifest.hardware_version = "HARDWARE-V0.9";

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("fde_version")));
  assert.ok(result.failures.some((failure) => failure.includes("hardware_version")));
});

test("integrity gate rejects unresolved auxiliary provenance links", () => {
  const bundle = buildBundle([
    entry("auxiliary-links", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.entity_mentions[0].entity_id = "EN-missing";
  bundle.event_sources[0].source_artifact_id = "SA-missing";
  bundle.event_claims[0].claim_id = "CL-missing";

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("entity mention entity_id does not resolve")));
  assert.ok(result.failures.some((failure) => failure.includes("event source source_artifact_id does not resolve")));
  assert.ok(result.failures.some((failure) => failure.includes("event claim claim_id does not resolve")));
});

test("published JSON Schema covers auxiliary provenance tables", () => {
  const bundle = buildBundle([
    entry("auxiliary-schema", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.event_sources[0].unexpected_schema_field = true;

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("additional properties")));
});

test("integrity gate resolves FDE and hardware evidence references", () => {
  const bundle = buildBundle([
    entry("fde-links", "PwC is deploying Claude to employees across its business", "PwC is deploying Claude to employees across its business workflows. The company integrated Claude with internal knowledge systems."),
    entry("hardware-links", "NVIDIA launches AI robot computer", "NVIDIA launched an AI robot computer with a GPU module for edge AI systems.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.fde_records[0].claim_refs = ["CL-missing"];
  bundle.hardware_records[0].source_refs = ["SA-missing"];

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("FDE claim_refs invalid")));
  assert.ok(result.failures.some((failure) => failure.includes("hardware source_refs invalid")));
});

test("integrity gate rejects duplicate stable identifiers", () => {
  const bundle = buildBundle([
    entry("duplicate-id", "Acme AI raises $10 million", "Acme AI raised $10 million in a financing round.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.raw_documents.push({ ...bundle.raw_documents[0] });

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("duplicate raw_id")));
});

test("Chinese related-article tails never enter accepted claims", () => {
  const bundle = buildBundle([
    entry(
      "related-tail",
      "Roblox 将推出 AI 游戏创作工具 Build",
      "Roblox will launch the Build AI game-creation tool on July 28.\n相关文章\nxAI released Grok Build with coding agents and tool calling."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.ok(bundle.claims.every((claim) => !/xAI|Grok Build/iu.test(claim.source_quote)));
});

test("current funding language captures nabs and separates raised capital from valuation", () => {
  const bundle = buildBundle([
    entry("microagi-funding", "Microagi nabs $55M to teach factory robots how to work", "Microagi today announced it has raised $55 million in seed funding for its AI robotics platform."),
    entry("elorian-funding", "How a former DeepMind researcher raised at a $300M pre-seed valuation", "Elorian raised a $55 million seed round at a $300 million valuation to build visual AI systems.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 2);
  assert.ok(bundle.canonical_events.every((event) => event.event_type === "funding"));
  assert.ok(bundle.canonical_events.some((event) => /完成 5500 万美元 种子轮融资/u.test(event.display_title_zh)));
});

test("benchmark releases and body-led product launches remain factual events", () => {
  const bundle = buildBundle([
    entry("benchmark-release", "Moonshot AI 发布 PerceptionBench：多模态模型视觉感知能力诊断基准", "We are releasing PerceptionBench, a benchmark that evaluates visual perception in multimodal language models."),
    entry("wps-release", "金山办公 CEO 章庆元谈 AI 办公商业模式", "金山办公在大会上发布两款 AI 办公智能体。灵犀专业版面向个人用户，WPS Comate 面向企业用户。")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.ok(bundle.canonical_events.some((event) => event.event_type === "research_result" && /PerceptionBench/u.test(event.display_title_zh)));
  assert.ok(bundle.canonical_events.some((event) => event.event_type === "product_release" && /灵犀专业版与 WPS Comate/u.test(event.display_title_zh)));
});

test("unconfirmed secondary rumors stay in QA", () => {
  const bundle = buildBundle([
    entry("unconfirmed-rumor", "阿里将推出 AI 音乐平台 HappyShrimp", "据媒体消息，阿里或计划推出 AI 音乐平台，但目前尚未对外开放，具体情况需以官方公告为准。")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.ok(bundle.qa_queue.some((item) => item.reason === "rumor_requires_primary_confirmation"));
});

test("Noetra infrastructure sources merge and preserve disclosed chip capacity", () => {
  const bundle = buildBundle([
    entry("japan-rubin", "Japan to buy Nvidia Rubin chips to build an AI for robots", "Japan is planning to buy 27,500 next-generation Rubin chips from Nvidia. Noetra will oversee the project and build a 140 megawatt AI data center."),
    entry("noetra-infrastructure", "NVIDIA and Japan launch national AI infrastructure with Noetra", "NVIDIA and Noetra launched a national AI infrastructure using 27,500 Rubin GPUs for robotics AI.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.hardware_records.length, 1);
  assert.equal(bundle.hardware_records[0].capacity, 27500);
  assert.equal(bundle.hardware_records[0].supplier, "NVIDIA");
  assert.equal(bundle.hardware_records[0].customer, "Noetra");
  assert.equal(bundle.hardware_records[0].source_refs.length, 2);
});
