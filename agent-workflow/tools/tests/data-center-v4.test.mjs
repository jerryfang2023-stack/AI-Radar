import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildBundle, eventAiRelevanceEvidence, eventSourceEligibility, eventStatus, facetAssertionsForClaim, facetMatchers, findEventRule, metricValues, modelAssistedEventEligibility, normalizeEventTitle, normalizedFundingMetric, organizationMentions, publicEventSourceTitleIssue, publicEventSourceUrlIssue, repairExistingChinaMarketScope, repairExistingEntityLinks, sourceArtifact, tagAssertionsForClaim, taxonomyEvidenceSegmentRelevant, taxonomyMatchers, trimBoilerplate } from "../build-data-center-v4.mjs";
import { evaluateBundle, evaluateBundleFiles } from "../assert-data-center-v4.mjs";
import { buildEventDisplayTitle } from "../event-public-title.mjs";
import { coreRawQcViolationCounts, isCoreV4EvidenceItem, isRoutedV4EvidenceItem, isUsableCoreEvidenceItem } from "../guanlan-monitor-quality-gate.mjs";
import { generateSourceTitleTranslation, isApprovedSourceTitleTranslation, normalizeSourceTitleTranslation, sourceTitleFactsPreserved, sourceTitleFromCapturedPayload, sourceTitleNeedsChineseTranslation, titleTranslationLooksUsable } from "../source-title-translation-generator.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
const taxonomy = JSON.parse(fs.readFileSync(path.join(root, "agent-workflow/product/tag-taxonomy-v4.json"), "utf8"));
const date = "2026-07-16";

test("technical tag exclusions are scoped to the matching evidence sentence", () => {
  const claim = {
    claim_id: "CL-tag-segment",
    source_quote: "The company launched AI agent 0.5 with ROCm.ai.Support remains available from a human agent。智能体可以执行任务；人工代理负责支持。",
    source_span: { start: 0, end: 89 },
  };
  const tags = tagAssertionsForClaim(claim, taxonomyMatchers(taxonomy));
  assert.equal(tags.some((item) => item.tag_id === "agentic_execution"), true);

  const excluded = tagAssertionsForClaim({
    ...claim,
    claim_id: "CL-tag-excluded",
    source_quote: "A human agent handles every request.",
  }, taxonomyMatchers(taxonomy));
  assert.equal(excluded.some((item) => item.tag_id === "agentic_execution"), false);
});

test("founder biographies and investor backgrounds cannot classify the funded company", () => {
  const biography = "创始人曾在一家自动驾驶公司担任COO，也有过具身智能的工作经历。";
  assert.equal(taxonomyEvidenceSegmentRelevant(biography), false);
  const biographyTags = tagAssertionsForClaim({
    claim_id: "CL-founder-biography",
    claim_type: "funding",
    source_quote: biography,
    source_span: { raw_id: "RAW-1", start: 0, end: biography.length },
  }, taxonomyMatchers(taxonomy));
  assert.equal(biographyTags.some((item) => item.tag_id === "embodied_ai"), false);

  const investor = "The investor previously backed several robotics and embodied AI startups.";
  assert.equal(taxonomyEvidenceSegmentRelevant(investor), false);
  const company = "Acme builds embodied AI software for autonomous warehouse robots.";
  assert.equal(taxonomyEvidenceSegmentRelevant(company), true);
});

test("translated double-dash titles preserve an evidence-backed organization mention", () => {
  const mentions = organizationMentions(
    "蒙德·迪夫林--用克隆人智能体管理办公室的开源多智能体工具",
    { subject: "", action: "product_release", object: "open source multi-agent tool" },
    "product_release",
    "The app is open source and runs on your laptop forever.",
    [{ subject: "Munder Difflin", source_quote: "The app is open source and runs on your laptop forever." }],
  );
  assert.deepEqual(mentions, [{
    canonicalName: "蒙德·迪夫林",
    mentionText: "蒙德·迪夫林",
    start: 0,
    source: "title_original",
    verified: false,
  }]);
});

test("lawsuit claims resolve Twitch from exact title and Claim evidence", () => {
  const quote = "一名 Twitch 主播已针对该平台及其母公司亚马逊提起拟议的集体诉讼，声称创作者内容被用于生成式 AI 训练。";
  const mentions = organizationMentions(
    "Twitch 因使用主播内容训练亚马逊 AI 面临集体诉讼",
    { subject: "Twitch 因使用主播内容训练亚马逊 AI 面临集体", action: "诉讼", object: "" },
    "lawsuit_settlement",
    quote,
    [{ subject: "Twitch 因使用主播内容训练亚马逊 AI 面临集体", source_quote: quote }],
  );
  assert.deepEqual(
    mentions.map((item) => [item.canonicalName, item.verified]),
    [["Twitch", true]],
  );
});

test("facet matching does not treat trailing retrieval metadata as event evidence", () => {
  const facets = facetAssertionsForClaim({
    claim_id: "CL-facet-metadata",
    claim_type: "partnership",
    object: "Across AI",
    source_quote: "SK Group and NVIDIA Expand Strategic Partnership Across AI. / query=edge AI device customer deployment manufacturing / intent=find_customer_case",
    source_span: { start: 0, end: 142 },
  }, facetMatchers(taxonomy));
  assert.equal(facets.some((item) => item.value_id === "ai_device"), false);
});

test("DeepSeek V4 translates source titles through its chat completion endpoint", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.DEEPSEEK_API_KEY;
  const originalModel = process.env.DEEPSEEK_MODEL;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = originalKey;
    if (originalModel === undefined) delete process.env.DEEPSEEK_MODEL;
    else process.env.DEEPSEEK_MODEL = originalModel;
  });

  process.env.DEEPSEEK_API_KEY = "test-key";
  process.env.DEEPSEEK_MODEL = "deepseek-v4-flash";
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.deepseek.com/chat/completions");
    const body = JSON.parse(options.body);
    assert.equal(body.model, "deepseek-v4-flash");
    assert.deepEqual(body.thinking, { type: "disabled" });
    assert.equal(options.headers.authorization, "Bearer test-key");
    return {
      ok: true,
      async json() {
        return { choices: [{ message: { content: "Acme 发布 AI 工作流平台" } }] };
      },
    };
  };

  const result = await generateSourceTitleTranslation("Acme Launches AI Workflow Platform", {
    provider: "deepseek",
    timeoutMs: 1000,
  });
  assert.deepEqual(result, {
    titleZh: "Acme 发布 AI 工作流平台",
    status: "translated",
    method: "deepseek_title_translation",
    model: "deepseek-v4-flash",
  });
  assert.equal(isApprovedSourceTitleTranslation({ generatedBy: result.method }), true);
  assert.equal(sourceTitleFactsPreserved("Aina Raises $5.5 Mn", "Aina 获得 550 万美元融资"), true);
  assert.equal(sourceTitleFactsPreserved("Aina Raises $5.5 Mn", "Aina 获得 450 万美元融资"), false);
  assert.equal(sourceTitleFactsPreserved("Aina Raises $5.5 Mn", "Aina 获得 550 万卢比融资"), false);
  assert.equal(sourceTitleFactsPreserved("Parloa triples valuation to $3 billion", "Parloa 估值翻三倍至 30 亿美元"), true);
  assert.equal(sourceTitleFactsPreserved(
    "Anthropic locks in 45-billion-dollar compute deal with Nscale ahead of IPO",
    "Anthropic 在 IPO 前与 Nscale 敲定 450 亿美元算力交易",
  ), true);
});

test("DeepSeek translations with changed monetary facts are rejected", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.DEEPSEEK_API_KEY;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.DEEPSEEK_API_KEY;
    else process.env.DEEPSEEK_API_KEY = originalKey;
  });

  process.env.DEEPSEEK_API_KEY = "test-key";
  globalThis.fetch = async () => ({
    ok: true,
    async json() {
      return { choices: [{ message: { content: "Aina 获 Info Edge 等投资 450 万美元，打造 AI 硬件接口" } }] };
    },
  });

  const result = await generateSourceTitleTranslation(
    "Aina Raises $5.5 Mn From Info Edge, Others To Build AI Hardware Interface",
    { provider: "deepseek", timeoutMs: 1000 },
  );
  assert.deepEqual(result, {
    titleZh: "",
    status: "needs_ingestion_translation",
    method: "title_translation_generator_failed",
  });
});

test("product-name-only mixed titles do not require artificial translation", () => {
  assert.equal(sourceTitleNeedsChineseTranslation("Claude Fable 5 和 Claude Mythos 5"), false);
  assert.equal(sourceTitleNeedsChineseTranslation("Grok 4.5 🤖, GPT-Live 🎙️, SWE-1.7 👨‍💻"), false);
  assert.equal(sourceTitleNeedsChineseTranslation("Parloa triples valuation to $3 billion"), true);
});

test("a versioned technical source title is displayed exactly as published", () => {
  const sourceTitle = "llm-chat-completions-server 0.1a0";
  assert.equal(buildEventDisplayTitle({
    rawDocument: {
      title_original: sourceTitle,
      title_zh: sourceTitle,
    },
  }), sourceTitle);
});

test("publisher decorations are removed from pipe-delimited Chinese source titles", () => {
  assert.equal(buildEventDisplayTitle({
    rawDocument: {
      title_original: "灵初智能已完成20亿融资，获国家队资本投资 | 华兴交易",
      title_zh: "灵初智能已完成20亿融资，获国家队资本投资 | 华兴交易",
    },
  }), "灵初智能已完成20亿融资，获国家队资本投资");
  assert.equal(buildEventDisplayTitle({
    rawDocument: {
      title_original: "锡创动态 | 穹彻智能完成新一轮融资，锡创投加码人工智能大脑赛道",
      title_zh: "锡创动态 | 穹彻智能完成新一轮融资，锡创投加码人工智能大脑赛道",
    },
  }), "穹彻智能完成新一轮融资，锡创投加码人工智能大脑赛道");
});

test("a version-only developer package release does not become a commercial or hardware event", () => {
  const quote = "Release: llm-chat-completions-server 0.1a0";
  const source = entry(
    "versioned-developer-package",
    "llm-chat-completions-server 0.1a0",
    `${quote}\nThis experimental utility supports OpenAI Chat Completion style requests where each incoming message extends the previous conversation. It is a small developer package published from a personal builder blog, not a company product launch or a physical server release.`,
    { source_type: "builder" },
  );
  const bundle = buildBundle(
    [source],
    taxonomy,
    date,
    "2026-07-16T00:00:00.000Z",
    {
      modelAssist: {
        candidates: [
          acceptedModelCandidate(source, [{
            event_type: "product_release",
            subject: "llm-chat-completions-server",
            object: "0.1a0",
            evidence_index: 0,
          }], [{
            start: 0,
            end: quote.length,
            quote,
          }]),
        ],
      },
    },
  );

  assert.equal(bundle.canonical_events.length, 0);
  assert.equal(bundle.hardware_facts.length, 0);
  assert.ok(bundle.qa_queue.some(
    (item) => item.reason === "versioned_developer_package_not_commercial_event",
  ));
});

test("stable developer package releases do not become commercial or hardware events", () => {
  const quote = "发布：mcp-server-kit v2.1.0";
  const source = entry(
    "stable-developer-package",
    "mcp-server-kit v2.1.0 发布",
    `${quote}\nThis is a developer package release for a software protocol server, not a company product launch or a physical server release.`,
    { source_type: "builder" },
  );
  const bundle = buildBundle(
    [source],
    taxonomy,
    date,
    "2026-07-16T00:00:00.000Z",
    {
      modelAssist: {
        candidates: [
          acceptedModelCandidate(source, [{
            event_type: "product_release",
            subject: "mcp-server-kit",
            object: "v2.1.0",
            evidence_index: 0,
          }], [{
            start: 0,
            end: quote.length,
            quote,
          }]),
        ],
      },
    },
  );

  assert.equal(bundle.canonical_events.length, 0);
  assert.equal(bundle.hardware_facts.length, 0);
  assert.ok(bundle.qa_queue.some(
    (item) => item.reason === "versioned_developer_package_not_commercial_event",
  ));
});

test("source title translation cannot omit explicit AI semantics", () => {
  assert.equal(titleTranslationLooksUsable("Bayer Uses AI to Cut Errors by 70%", "拜耳将错误减少 70%"), false);
  assert.equal(titleTranslationLooksUsable("Bayer Uses AI to Cut Errors by 70%", "拜耳利用 AI 将错误减少 70%"), true);
});

test("source title translation preserves the Situational Awareness organization name", () => {
  assert.equal(titleTranslationLooksUsable("The loss of Situational Awareness", "情境感知的缺失"), false);
  assert.equal(titleTranslationLooksUsable("The loss of Situational Awareness", "Situational Awareness 的失利"), true);
});

test("source title normalization removes a trailing publisher suffix", () => {
  assert.equal(normalizeSourceTitleTranslation("Maybern MCP 已上线 | Maybern"), "Maybern MCP 已上线");
  assert.equal(normalizeSourceTitleTranslation("SambaNova | The Fastest AI Inference Platform"), "SambaNova | The Fastest AI Inference Platform");
});

test("placeholder source title is repaired from captured article text", () => {
  assert.equal(sourceTitleFromCapturedPayload({
    title: "-",
    clean_text: "Bespoke Labs Raises $40M to Build Environments that Enable Reliable Agents - My Framer Site\nBlog",
  }), "Bespoke Labs Raises $40M to Build Environments that Enable Reliable Agents");
});

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

function acceptedModelCandidate(sourceEntry, claims, evidence) {
  return {
    candidate_id: `MAC-${sourceEntry.raw.raw_id}`,
    task_type: "claim_extraction",
    asset_id: `QA-${sourceEntry.raw.raw_id}`,
    source_ref: sourceArtifact(sourceEntry.raw, sourceEntry.file).source_artifact_id,
    status: "accepted",
    proposal: { claims },
    evidence,
  };
}

test("URL-less SourceArtifact ids use repository-relative paths", () => {
  const file = path.join(root, "01-SiteV2/content/01-raw/originals/2026-07-20/r-001.json");
  const raw = { content_hash: "same-content", source_name: "Source without URL" };
  const artifact = sourceArtifact(raw, file);
  const stableIdentity = "01-SiteV2/content/01-raw/originals/2026-07-20/r-001.json|same-content";
  const expectedId = `SA-${crypto.createHash("sha256").update(stableIdentity).digest("hex").slice(0, 16)}`;

  assert.equal(artifact.source_artifact_id, expectedId);
});

test("URL-less restored SourceArtifact ids honor the accepted intake identity", () => {
  const raw = { content_hash: "same-content", source_name: "Source without URL" };
  const artifact = sourceArtifact(raw, path.join(root, "private-evidence", "moved.json"), {
    source_artifact_id: "SA-accepted-intake-id",
  });

  assert.equal(artifact.source_artifact_id, "SA-accepted-intake-id");
});

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

test("rumor disclosure in source evidence keeps an acquisition unconfirmed", () => {
  const bundle = buildBundle([
    entry(
      "acquisition-rumor-in-body",
      "OpenRouter receives acquisition interest from technology companies",
      "消息称 OpenRouter 已收到多家大型科技公司的潜在收购意向，目前该消息仍停留在传闻阶段。"
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "acquisition");
  assert.equal(bundle.canonical_events[0].event_status, "rumored");
  assert.equal(bundle.canonical_events[0].publication_status, "disputed");
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

test("portfolio-sale reporting becomes one acquisition event across source headlines", () => {
  const techCrunchQuote = "Situational Awareness, an AI hedge fund, has sold the majority of its public stock portfolio to Ken Griffin's Citadel.";
  const retainedQuote = "Situational Awareness continues to hold its private investment in Anthropic.";
  const vergeQuote = "Situational Awareness, the AI hedge fund, has sold most of its entire public stock portfolio to Ken Griffin's Citadel.";
  const techCrunch = entry("situational-techcrunch", "AI hedge fund Situational Awareness may have sold its public portfolio, but it still has its Anthropic shares", `${retainedQuote}\n${techCrunchQuote}`, {
    title_zh: "AI 对冲基金 Situational Awareness 可能已出售公开投资组合，但仍持有 Anthropic 股份",
  });
  const verge = entry("situational-verge", "The loss of Situational Awareness", vergeQuote, {
    title_zh: "Situational Awareness 的失利",
  });
  const modelAssist = {
    candidates: [
      acceptedModelCandidate(techCrunch, [
        { event_type: "capital_investment", subject: "Situational Awareness", object: "Anthropic shares", evidence_index: 0 },
        { event_type: "acquisition", subject: "Citadel", object: "majority of Situational Awareness's public stock portfolio", evidence_index: 1 },
      ], [
        { start: 0, end: retainedQuote.length, quote: retainedQuote },
        { start: retainedQuote.length + 1, end: retainedQuote.length + 1 + techCrunchQuote.length, quote: techCrunchQuote },
      ]),
      acceptedModelCandidate(verge, [
        { event_type: "financial_performance", subject: "Situational Awareness", object: "public stock portfolio sold to Citadel", evidence_index: 0 },
      ], [
        { start: 0, end: vergeQuote.length, quote: vergeQuote },
      ]),
    ],
  };

  const bundle = buildBundle([techCrunch, verge], taxonomy, date, "2026-07-16T00:00:00.000Z", { modelAssist });

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "acquisition");
  assert.equal(bundle.canonical_events[0].source_refs.length, 2);
  assert.equal(bundle.canonical_events[0].display_title_zh, techCrunch.raw.title_zh);
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

test("an FDE role interview does not become an enterprise implementation event", () => {
  const bundle = buildBundle([
    entry(
      "fde-role-interview",
      "Q&A: A look at forward-deployed engineers, AWS style",
      "Hot AI companies are talking about forward-deployed engineers. The interview explains how teams deploy AI tools, work at customer sites, and integrate systems into enterprise workflows."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.equal(bundle.fde_records.length, 0);
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

test("funding claims exclude adjacent fundraising metrics, links, and section headings", () => {
  const bundle = buildBundle([
    entry(
      "ontora-funding-evidence",
      "Ontora Raised $700K for Its Enterprise AI Platform Before Officially Opening Its Round",
      [
        "Ontora launches the discovery layer for AI transformation.",
        "- $700K raised before officially opening our round",
        "- 80+ inbound VC calls already lined up for our fundraise",
        "https://www.youtube.com/watch?",
        "2. What Ontora does for your company:",
      ].join("\n"),
      { title_zh: "企业级 AI 平台 Ontora 已融资 70 万美元" },
    ),
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.claims.length, 1);
  assert.equal(bundle.claims[0].source_quote, "- $700K raised before officially opening our round");
});

test("launches with disclosed capital is normalized as funding", () => {
  const bundle = buildBundle([
    entry(
      "launches-with-capital",
      "Exclusive: Startup Adapter Launches With $17.8M To Bring New Cognition To AI Tools",
      "Startup Adapter launches with $17.8 million in financing to build enterprise AI tools.",
      { title_zh: "独家：初创公司 Adapter 获得 1780 万美元融资，用于为 AI 工具带来新认知" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "funding");
  assert.equal(bundle.canonical_events[0].display_title_zh, "独家：初创公司 Adapter 获得 1780 万美元融资，用于为 AI 工具带来新认知");
});

test("public event title is the exact Raw source-title translation", () => {
  const sourceTitle = "Aina Raises $5.5 Mn From Info Edge, Others To Build AI Hardware Interface";
  const translatedTitle = "Aina 从 Info Edge 等投资方获得 550 万美元融资，用于打造 AI 硬件界面";
  const bundle = buildBundle([
    entry("aina-funding", sourceTitle, "Aina raised $5.5 million from Info Edge and other investors to build an AI hardware interface.", {
      title_zh: translatedTitle
    })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.raw_documents[0].title_original, sourceTitle);
  assert.equal(bundle.raw_documents[0].title_zh, translatedTitle);
  assert.equal(bundle.canonical_events[0].display_title_zh, translatedTitle);
  assert.equal("compatibility_cards" in bundle, false);
});

test("incomplete mixed-language public titles remain canonical and enter QA", () => {
  const bundle = buildBundle([
    entry(
      "untranslated-product",
      "OpenAI releases new voice models for more natural live conversations",
      "OpenAI released new AI voice models for more natural live conversations."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.ok(bundle.canonical_events[0].missing_fields.includes("display_title_zh"));
  assert.equal("compatibility_cards" in bundle, false);
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

test("a computer vision model release does not become AI hardware", () => {
  const bundle = buildBundle([
    entry(
      "computer-vision-model",
      "Google DeepMind releases GenCeption for computer vision tasks",
      "Google DeepMind released the GenCeption model for depth estimation and segmentation in computer vision. The team repurposed a pretrained video generation model as a visual analysis system.",
      { title_zh: "Google DeepMind 发布 GenCeption 计算机视觉模型" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.notEqual(bundle.canonical_events[0].event_type, "hardware_product");
  assert.equal(bundle.hardware_records.length, 0);
});

test("an AI factory network rollout becomes hardware instead of FDE", () => {
  const bundle = buildBundle([
    entry(
      "spectrum-network-rollout",
      "102.4Tbps：英伟达 Spectrum-6 交换系统落地全球超大规模 AI 工厂",
      "102.4Tbps：英伟达 Spectrum-6 交换系统落地全球超大规模 AI 工厂。英伟达表示 CoreWeave、Microsoft 和 Nebius 将率先部署基于 Vera Rubin、并结合 Spectrum-6 的基础设施。Spectrum-6 和液冷的 Spectrum-X Ethernet 基础设施将提供训练模型和部署推理所需的带宽。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "hardware_deployment");
  assert.equal(bundle.hardware_records.length, 1);
  assert.equal(bundle.hardware_records[0].component_type, "networking");
  assert.equal(bundle.fde_records.length, 0);
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
  assert.ok(bundle.entities.some((entity) => entity.entity_type === "product_candidate" && entity.canonical_name === "Jetson Thor"));
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

test("organization aliases resolve Chinese commercial-event title structures", () => {
  const bundle = buildBundle([
    entry("databricks-funding", "Databricks 估值达 1880 亿美元，Coatue 领投新一轮融资", "Databricks raised $3 billion in a new funding round as the company expands its AI platform.", { language: "zh" }),
    entry("huawei-deployment", "华为昇腾 950 超节点真机首展，昇腾 384 超节点已商用落地 750 多套", "华为昇腾 384 超节点已商用落地 750 多套，用于大模型训练和推理。", { language: "zh" }),
    entry("baidu-allowance", "百度沈抖：为每位员工每月发放1000元额度，体验市面主流大模型产品", "百度推出常态化员工福利政策，为每位员工发放主流大模型产品使用额度。", { language: "zh" })
  ], taxonomy, date, "2026-07-18T00:00:00.000Z");
  const names = new Set(bundle.entities.filter((item) => item.entity_type === "organization_candidate").map((item) => item.canonical_name));

  assert.ok(names.has("Databricks"));
  assert.ok(names.has("Huawei"));
  assert.ok(names.has("Baidu"));
  assert.ok(bundle.canonical_events.every((event) => event.entities.length > 0));
});

test("a bilingual organization subject resolves to one canonical company", () => {
  const quote = "沐曦股份 (MetaX) 今日宣布旗下曦云 C 系列 GPU 完成对稀宇 MiniMax H3 多模态生成模型的 Day 0 适配";
  const mentions = organizationMentions(
    "沐曦曦云 C 系列 GPU 实现 Day 0 适配 MiniMax H3 多模态生成模型",
    { subject: "沐曦股份", action: "model_release", object: "曦云 C 系列 GPU" },
    "model_release",
    quote,
    [{ subject: "沐曦股份", source_quote: quote }],
  );

  assert.equal(mentions.some((item) => item.canonicalName === "MetaX"), true);
  assert.equal(mentions.some((item) => item.canonicalName === "沐曦股份"), false);
});

test("current funding, public-sector, and hardware titles resolve named organizations", () => {
  const bundle = buildBundle([
    entry(
      "prentis-funding",
      "Prentis in talks to raise $100M at a $1 billion valuation",
      "Prentis is in talks to raise $100 million at a valuation of about $1 billion for its AI lab."
    ),
    entry(
      "public-security-ai",
      "公安部发布 AI 内容鉴定工具",
      "公安部发布 AI 内容鉴定工具，并在国家反诈中心 App 上布设该功能。",
      { language: "zh" }
    ),
    entry(
      "odisha-ai-data-center",
      "HCLTech 联手奥里萨邦政府及 Sarvam 建设 AI 数据中心",
      "HCLTech announced that it will work with the Government of Odisha and Sarvam to build an AI data center in Bhubaneswar.",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-25T00:00:00.000Z");
  const names = new Set(bundle.entities.filter((item) => item.entity_type === "organization_candidate").map((item) => item.canonical_name));

  for (const name of ["Prentis", "Ministry of Public Security of China", "HCLTech", "Government of Odisha", "Sarvam"]) {
    assert.ok(names.has(name), `missing organization entity ${name}`);
  }
  assert.ok(bundle.canonical_events.every((event) => event.entities.length > 0));
});

test("funding organization is recovered from accepted Claim evidence when the title is descriptive", () => {
  const bundle = buildBundle([
    entry(
      "claim-led-funding-company",
      "Agentic AI engineering startup announces initial closing of $50 million Series A",
      "P-1 AI, Inc. , an Agentic AI engineering startup for industrial teams that just announced the initial closing of its $50 million Series A financing round."
    )
  ], taxonomy, date, "2026-07-30T00:00:00.000Z");
  const event = bundle.canonical_events[0];
  const organization = bundle.entities.find((entity) => entity.canonical_name === "P-1 AI, Inc.");

  assert.equal(event.event_type, "funding");
  assert.ok(organization);
  assert.ok(event.entities.includes(organization.entity_id));
});

test("Chinese funding organization and qualitative amount are recovered from accepted Claim evidence", () => {
  const bundle = buildBundle([
    entry(
      "claim-led-chinese-funding-company",
      "国内唯一做多模态长记忆的公司，融资数千万，押注主动智能",
      "近日，丘脑智能已完成数千万元种子轮融资，投资方包括深圳一线基金和产业资本，本轮融资主要用于技术研发以及人才队伍补充。",
      { language: "zh" },
    ),
  ], taxonomy, date, "2026-08-01T00:00:00.000Z");
  const event = bundle.canonical_events[0];
  const organization = bundle.entities.find((entity) => entity.canonical_name === "丘脑智能");

  assert.equal(event.event_type, "funding");
  assert.ok(organization);
  assert.ok(event.entities.includes(organization.entity_id));
  assert.ok(!bundle.entities.some((entity) => entity.canonical_name === "国内唯一做多模态长记忆的公司"));
  assert.ok(event.metrics.includes("数千万元"));
});

test("a secured AI infrastructure contract with a dollar value is not funding", () => {
  const bundle = buildBundle([
    entry(
      "axe-compute-cluster-contract",
      "Axe Compute secures $1.5B AI GPU cluster deal",
      "Axe Compute secured a five-year $1.5 billion dedicated AI infrastructure contract.",
    ),
  ], taxonomy, date, "2026-08-01T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "procurement_contract");
  assert.ok(bundle.claims.every((claim) => claim.claim_type !== "funding"));
});

test("a procurement headline ending in an AI tender product still links the winning company", () => {
  const title = "Cactus Wins MeitY Contract To Build AI Tender Authoring Platform";
  const bundle = buildBundle([
    entry(
      "cactus-meity-contract",
      title,
      `${title}. Mumbai-based Cactus Technology Solutions has been awarded a contract by the National e-Governance Division under the IT Ministry to build an artificial intelligence powered procurement authoring platform.`,
    ),
  ], taxonomy, date, "2026-08-19T00:00:00.000Z");

  const event = bundle.canonical_events[0];
  const cactus = bundle.entities.find((entity) => entity.canonical_name === "Cactus");
  assert.equal(event.event_type, "procurement_contract");
  assert.ok(cactus);
  assert.ok(event.entities.includes(cactus.entity_id));
  assert.ok(!event.missing_fields.includes("entities"));
});

test("a sovereign AI appliance headline resolves the operator instead of the title fragment", () => {
  const title = "Korea's First Sovereign AI Appliance Ships: Domestic Chip, Domestic LLM, One Server";
  const bundle = buildBundle([
    entry(
      "kt-sovereign-ai-appliance",
      title,
      "Korea Telecom launched the KT NPU LLM Station, the first commercially available enterprise AI appliance to pair a Korean-made inference chip with a Korean-developed large language model in one on-premises server.",
    ),
  ], taxonomy, date, "2026-08-20T00:00:00.000Z");

  const names = new Set(bundle.entities
    .filter((entity) => entity.entity_type === "organization_candidate")
    .map((entity) => entity.canonical_name));
  assert.ok(names.has("KT"));
  assert.ok(!names.has("Korea's First Sovereign AI Appliance"));
});

test("contract hardware financing language does not turn a customer agreement into funding", () => {
  const bundle = buildBundle([
    entry(
      "axe-compute-financed-hardware-contract",
      "Axe Compute secures $1.5B AI GPU cluster deal - The Globe and Mail",
      "Axe Compute secured a five-year $1.5 billion dedicated AI infrastructure contract. The company participates in the financing of the hardware and operates the cluster under enterprise SLAs.",
    ),
  ], taxonomy, date, "2026-08-04T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "procurement_contract");
  assert.ok(bundle.claims.every((claim) => claim.claim_type !== "funding"));
});

test("funding entity extraction resolves described companies and SEO-style startup titles", () => {
  const bundle = buildBundle([
    entry(
      "designarena-intelligence-funding",
      "DesignArena 开发商 Intelligence 获 790 万美元种子轮融资，为 AI 模型注入品味",
      "Design Arena creators raise $7.9 million to bring taste to AI models. Intelligence raised a $7.9 million seed round.",
    ),
    entry(
      "hark-hardware-funding",
      "Hark AI Hardware Funding: $700M Raised at $6B Valuation",
      "Hark AI Hardware Startup Secures $700M at $6B Valuation. Hark raised over $700 million in Series A funding.",
    ),
  ], taxonomy, date, "2026-08-04T00:00:00.000Z", { allowHistoricalFunding: true });

  const companies = new Set(bundle.entities.map((entity) => entity.canonical_name));
  assert.ok(companies.has("Intelligence"));
  assert.ok(companies.has("Hark"));
});

test("a truncated secured-infrastructure title still uses the captured contract lead", () => {
  const bundle = buildBundle([
    entry(
      "axe-compute-truncated-contract",
      "Axe Compute Secures $1.5 Billion Five-Year Dedicated AI",
      "Axe Compute Secures $1.5 Billion Five-Year Dedicated AI Infrastructure Contract, Surpassing $3 Billion in 2026 Signed Contracted Value. / query=AI server startup funding GPU cluster customers",
    ),
  ], taxonomy, date, "2026-08-01T00:00:00.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "procurement_contract");
  assert.ok(bundle.claims.every((claim) => claim.claim_type !== "funding"));
});

test("a state-funded agentic AI mandate is a project contract rather than company financing", () => {
  const bundle = buildBundle([
    entry(
      "nc-ai-state-project",
      "NC AI Lands Korea's $34M Agentic Enterprise Mandate With Gabia as Live Testbed",
      "The Ministry of Science and ICT designated NC AI as the principal agency for the Real-World Proactive Action-Type Agentic AI Technology Development Project. The four-year initiative carries a total state budget of $34 million.",
    ),
  ], taxonomy, date, "2026-08-01T17:31:36.000Z");

  assert.equal(bundle.canonical_events[0].event_type, "procurement_contract");
  assert.ok(bundle.claims.every((claim) => claim.claim_type !== "funding"));
});

test("entity-link repair preserves an accepted bundle while restoring missing organizations", () => {
  const bundle = buildBundle([
    entry(
      "odisha-ai-data-center-repair",
      "HCLTech 联手奥里萨邦政府及 Sarvam 建设 AI 数据中心",
      "HCLTech announced that it will work with the Government of Odisha and Sarvam to build an AI data center in Bhubaneswar.",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-25T00:00:00.000Z");
  const event = bundle.canonical_events[0];
  event.entities = [];
  event.missing_fields = [...new Set([...(event.missing_fields || []), "entities"])];
  bundle.entities = [];
  bundle.entity_mentions = [];
  for (const document of bundle.raw_documents) document.entity_mention_ids = [];

  const result = repairExistingEntityLinks(bundle, "2026-07-25T01:00:00.000Z");
  const names = new Set(bundle.entities.map((entity) => entity.canonical_name));

  assert.deepEqual(result.repaired_event_ids, [event.event_id]);
  assert.deepEqual(names, new Set(["HCLTech", "Government of Odisha", "Sarvam"]));
  assert.equal(event.entities.length, 3);
  assert.ok(!event.missing_fields.includes("entities"));
  assert.equal(bundle.manifest.counts.entities, 3);
  assert.equal(bundle.manifest.counts.entity_mentions, 3);
});

test("entity extraction recovers claim subjects and described Chinese funding companies", () => {
  const deploymentMatches = organizationMentions(
    "JetBrains CTO 谈如何评估并部署 Claude Fable 5：私有仓库评测、效率提升与安全策略",
    { subject: "JetBrains CTO 谈如何评估并", action: "部署", object: "Claude Fable 5" },
    "deployment",
    "We provide an agent running Claude Fable 5 with specifications.",
    [{ subject: "JetBrains", source_quote: "We provide an agent running Claude Fable 5 with specifications." }],
  );
  assert.ok(deploymentMatches.some((item) => item.canonicalName === "JetBrains" && item.source === "title_original"));

  const fundingQuote = "近日，具身智能数据基础设施公司元点科技（SCALEFORCE）完成数千万元人民币融资，投资者包含恒旭资本和凯联资本。";
  const fundingMatches = organizationMentions(
    "具身数据来了实战派！40天2轮融资数千万，瞄准物理AI基础设施",
    { subject: "具身数据来了实战派！40天2轮", action: "融资", object: "数千万" },
    "funding",
    fundingQuote,
    [{ subject: "具身数据来了实战派！40天2轮", source_quote: fundingQuote }],
  );
  assert.ok(fundingMatches.some((item) => item.canonicalName === "元点科技" && item.source === "claim_evidence"));

  const runableQuote = "As artificial intelligence makes it easier to build websites, Indian startup Runable is betting on growth. The startup has raised $21 million.";
  const runableMatches = organizationMentions(
    "Runable 获 2100 万美元融资",
    { subject: "Runable 获 2100 万美元", action: "融资", object: "" },
    "funding",
    runableQuote,
    [{ subject: "Runable 获 2100 万美元", source_quote: runableQuote }],
  );
  assert.ok(runableMatches.some((item) => item.canonicalName === "Runable" && item.source === "claim_evidence"));

  const instinctQuote = "Viral AI startup Instinct has raised $350 million at a $2.5 billion valuation.";
  const instinctMatches = organizationMentions(
    "爆火AI初创公司Instinct以25亿美元估值融资3.5亿美元",
    { subject: "爆火AI初创公司Instinct以25亿美元估值", action: "融资", object: "3.5亿美元" },
    "funding",
    instinctQuote,
    [{ subject: "爆火AI初创公司Instinct以25亿美元估值", source_quote: instinctQuote }],
  );
  assert.ok(instinctMatches.some((item) => item.canonicalName === "Instinct" && item.source === "claim_evidence"));

  const roleBoundedQuote = "AI startup Acme CEO Jane Doe said the company has raised $25 million.";
  const roleBoundedMatches = organizationMentions(
    "Acme 融资 2500 万美元",
    { subject: "", action: "融资", object: "2500 万美元" },
    "funding",
    roleBoundedQuote,
    [{ subject: "", source_quote: roleBoundedQuote }],
  );
  assert.deepEqual(roleBoundedMatches.map((item) => item.canonicalName), ["Acme"]);

  const roleOnlyQuote = "The AI startup CEO Jane Doe said the company has raised $25 million.";
  assert.deepEqual(organizationMentions(
    roleOnlyQuote,
    { subject: "", action: "融资", object: "2500 万美元" },
    "funding",
    roleOnlyQuote,
    [{ subject: "", source_quote: roleOnlyQuote }],
  ), []);

  for (const role of ["Founder", "Co-Founder", "Chief Executive Officer", "President"]) {
    const roleQuote = `The AI startup ${role} Jane Doe said the company has raised $25 million.`;
    assert.deepEqual(organizationMentions(
      roleQuote,
      { subject: "", action: "融资", object: "2500 万美元" },
      "funding",
      roleQuote,
      [{ subject: "", source_quote: roleQuote }],
    ), [], role);
  }

  const roundBoundedQuote = "Startup Acme Series A funding has raised $25 million.";
  const roundBoundedMatches = organizationMentions(
    "Acme A 轮融资 2500 万美元",
    { subject: "", action: "融资", object: "2500 万美元" },
    "funding",
    roundBoundedQuote,
    [{ subject: "", source_quote: roundBoundedQuote }],
  );
  assert.deepEqual(roundBoundedMatches.map((item) => item.canonicalName), ["Acme"]);

  const noFundingQuote = "AI startup Acme CEO Jane Doe announced a product update.";
  assert.deepEqual(organizationMentions(
    "AI startup Acme product update",
    { subject: "", action: "融资", object: "" },
    "funding",
    noFundingQuote,
    [{ subject: "", source_quote: noFundingQuote }],
  ), []);
});

test("an earlier release verb preserves the organization when deployment determines the event type", () => {
  const bundle = buildBundle([
    entry(
      "space-matrix-deployment",
      "深空矩阵发布\"星环计划\"，第一阶段部署约210颗卫星构建太空AI算力星座",
      "深空矩阵在 2026 世界人工智能大会上，发布面向太空 AI 算力产业化落地的系统性星座方案\"星环计划\"。第一阶段目标部署约 210 颗卫星。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-20T00:00:00.000Z");

  const organization = bundle.entities.find((item) => item.entity_type === "organization_candidate");
  assert.equal(organization?.canonical_name, "深空矩阵");
  assert.ok(bundle.canonical_events[0].entities.includes(organization.entity_id));
  assert.ok(!bundle.canonical_events[0].missing_fields.includes("entities"));
});

test("boilerplate is removed before claim extraction", () => {
  const cleaned = trimBoilerplate("Acme launched a model.\nMost Popular\nUnrelated lawsuit story");
  assert.equal(cleaned, "Acme launched a model.");
  assert.equal(findEventRule("Acme launched a model").eventType, "model_release");
  assert.equal(normalizeEventTitle("Samsung SDS to Launch AI Services < Semiconductor < 기사본문 - The Elec Inc."), "Samsung SDS to Launch AI Services");
});

test("EVENT-V1.1 recognizes necessary capital, operating, governance, and security events", () => {
  const cases = [
    ["Anthropic filed for an initial public offering", "ipo_listing"],
    ["Google invests $1.5 billion in an AI data center campus", "capital_investment"],
    ["Global Mofy strategically participates in a new financing round of Moonshot AI", "capital_investment"],
    ["Abridge reports annual recurring revenue reached $100 million", "financial_performance"],
    ["Parloa opens a new office in Madrid", "market_expansion"],
    ["Oracle lays off 2,100 employees in an AI organization restructuring", "organization_restructuring"],
    ["Augment Code obtains ISO/IEC 42001 certification", "certification_compliance"],
    ["Google publishes an open technical specification for agent discovery", "standard_specification"],
    ["Acme discloses a security breach affecting its AI service", "security_incident"],
  ];
  for (const [title, expected] of cases) assert.equal(findEventRule(title)?.eventType, expected, title);
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
    ["欧盟 AI 透明度准则 8 月 2 日生效：聊天机器人须自报身份", "policy_regulation"],
    ["澳大利亚将推出人工智能标准并设立人工智能办公室", "policy_regulation"],
    ["Anthropic 与私募巨头合资成立 AI 实施公司 Ode，初始资金 15 亿美元", "partnership"],
    ["Exclusive: Startup Adapter 完成 1780 万美元融资，用于 Bring New Cognition To AI Tools", "funding"],
    ["交友应用 Soul 将推出首款便携式 AI 智能硬件，搭载自研大模型 SoulX", "hardware_product"],
    ["MiniMax Code 2.0 桌面端焕新：底层架构全面升级，金融模块即将上线", "product_release"]
  ];

  for (const [title, eventType] of cases) assert.equal(findEventRule(title)?.eventType, eventType, title);
});

test("EU AI Act transparency rules resolve to a policy event with an entity", () => {
  const bundle = buildBundle([
    entry(
      "eu-ai-transparency-rules",
      "欧盟 AI 透明度准则 8 月 2 日生效：聊天机器人须自报身份",
      "欧盟《人工智能法案》第 50 条 AI 透明度准则将于 8 月 2 日正式生效。根据法案，聊天机器人必须明确告知用户其为 AI 系统。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-27T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "policy_regulation");
  assert.ok(bundle.canonical_events[0].entities.length > 0);
  assert.ok(!bundle.canonical_events[0].missing_fields.includes("entities"));
  assert.ok(bundle.entities.some((entity) => entity.canonical_name === "European Union"));
  assert.ok(!bundle.entities.some((entity) => entity.canonical_name === "欧盟"));
});

test("known upstream category collisions stay in their responsible canonical types", () => {
  const cases = [
    ["Google's A2A Agent Marketplace Goes Live: The First Natural Language Agent Discovery Platform", "product_release"],
    ["Qualcomm unveils three new data center solutions including Dragonfly C1000 CPU, set to be deployed by Meta", "hardware_product"],
    ["Microsoft launches its own AI deployment company, invests $2.5 billion", "organization_restructuring"],
    ["微软推出自有AI部署公司，投入25亿美元", "organization_restructuring"],
    ["The Home Depot Delivers Customer Store Phone Support Four Times Faster Using Google Cloud's Gemini Enterprise", "deployment"],
    ["Banco do Brasil Embeds Agentic AI Into Core Workflows to Strengthen Relationship Banking", "deployment"],
    ["Bayer GBS Transformed Procurement with Intelligent Automation", "deployment"],
    ["Bristol Myers Squibb Building Life Science Industry's Most Advanced AI Factory on NVIDIA Vera Rubin", "hardware_deployment"],
    ["Archestra.AI Announces $10M Seed", "funding"],
    ["Former GitHub CEO Thomas Dohmke launches Entire with a landmark $60 million seed round", "funding"],
  ];

  for (const [title, eventType] of cases) assert.equal(findEventRule(title)?.eventType, eventType, title);
});

test("a research-fund commitment is not eligible as company financing", () => {
  const result = eventSourceEligibility(
    {
      clean_text: "Anthropic is committing $200 million to the fund to support ambitious external research.",
      raw_qc_decision: "pass",
      extraction_quality: "high",
    },
    { source_url: "https://www.anthropic.com/news/economic-futures-research-fund-agenda" },
    "Anthropic launches Economic Futures research fund agenda",
  );

  assert.deepEqual(result, {
    accepted: false,
    reason: "research_fund_commitment_not_company_financing",
  });
});

test("known cumulative-funding corrections reject the superseded secondary source", () => {
  const marketOverview = eventSourceEligibility(
    { clean_text: "The global AI agents market is growing, according to Gartner.", raw_qc_decision: "pass" },
    { source_url: "https://example.com/vertical-ai-agents" },
    "Vertical AI Agents: The $1B Shift Reshaping Enterprise in 2026",
  );
  const bunkerhillSecondary = eventSourceEligibility(
    { clean_text: "Bunkerhill announced a Series B.", source_level: "B", raw_qc_decision: "pass" },
    { source_url: "https://example.com/bunkerhill" },
    "Bunkerhill Health raises $55M to scale agentic AI",
  );
  const bunkerhillOfficial = eventSourceEligibility(
    { clean_text: "The Series B brings total funding to date to $55 million.", source_level: "official", raw_qc_decision: "pass" },
    { source_url: "https://www.bunkerhillhealth.com/resources/series-b-announcement" },
    "Bunkerhill Health Raises $55 Million to Help Health Systems Turn Their Best Ideas into Reality",
  );

  assert.equal(marketOverview.reason, "market_overview_not_company_funding_source");
  assert.equal(bunkerhillSecondary.reason, "funding_amount_semantics_replaced_by_official_source");
  assert.equal(bunkerhillOfficial.accepted, true);
});

test("superseded roundups and secondary event sources remain outside canonical events", () => {
  const cases = [
    [
      { clean_text: "Daily digest.", raw_qc_decision: "pass" },
      { source_url: "https://example.com/daily" },
      "IT早报｜月之暗面完成新一轮融资；其他新闻",
      "multi_event_roundup_not_single_event_source",
    ],
    [
      { clean_text: "Entire launches.", raw_qc_decision: "pass" },
      { source_url: "https://the-agent-report.com/entire-launch" },
      "The Agent Report: Thomas Dohmke launches Entire",
      "secondary_source_replaced_by_original_announcement",
    ],
    [
      { clean_text: "Bayer case.", raw_qc_decision: "pass" },
      { source_url: "https://theapplied.co/bayer-gbs" },
      "Bayer GBS Transformed Procurement with Intelligent Automation",
      "secondary_source_replaced_by_vendor_case_study",
    ],
  ];

  for (const [raw, artifact, title, reason] of cases) {
    assert.equal(eventSourceEligibility(raw, artifact, title).reason, reason);
  }
});

test("index pages, question headlines, roundups, and reaction articles cannot become commercial events", () => {
  assert.equal(
    publicEventSourceTitleIssue("硬科技投向标|英特尔发布AI芯片 华为天才再获6亿元融资"),
    "multi_event_roundup_not_single_event_source",
  );
  const cases = [
    ["新闻室 \\ Anthropic", "index_or_listing_page_not_event_source"],
    ["企业AI新闻", "index_or_listing_page_not_event_source"],
    ["商业新闻融资快讯与新闻稿", "index_or_listing_page_not_event_source"],
    ["Funding Breaking News and Press Releases from Business Wire", "index_or_listing_page_not_event_source"],
    ["智能体AI能否让美国制造业回归？", "question_headline_not_event_specific"],
    ["The AI Race: What's Left of the Western AI Lead?", "question_headline_not_event_specific"],
    ["前沿雷达 #4：中国已迎头赶上，西方AI领先优势还剩什么？", "question_headline_not_event_specific"],
    ["AI巨头斥资数十亿美元布局企业部署", "multi_event_roundup_not_single_event_source"],
    ["Latest open artifacts (#23): Laguna S2.1, Inkling, & Kimi K3 show the utility of open models on the Pareto frontier", "multi_event_roundup_not_single_event_source"],
    ["最新开源模型盘点（#23）：Laguna S2.1、Inkling 与 Kimi K3 展现开源模型在帕累托前沿的价值", "multi_event_roundup_not_single_event_source"],
    ["OpenAI 总裁布罗克曼回应苹果诉讼：无意窃取商业机密", "reaction_or_commentary_not_new_event"],
    ["黄仁勋驳斥\"循环融资\"质疑：AI 行业需要巨额资金，英伟达投资风险很低", "reaction_or_commentary_not_new_event"],
  ];

  for (const [title, reason] of cases) {
    assert.equal(publicEventSourceTitleIssue(title), reason, title);
    assert.equal(eventSourceEligibility(
      { clean_text: "Source text with a candidate event.", raw_qc_decision: "pass" },
      { source_url: "https://example.com/source" },
      title,
    ).reason, reason, title);
  }
});

test("TLDR, listicle, and context-only titles cannot become commercial events", () => {
  const titles = [
    "Anthropic 开放权重，Kimi 发布 K3 权重，MAI Cyber 模型 TLDR",
    "情境感知的缺失",
    "AI 工厂供应链再平衡的真正含义",
  ];
  for (const title of titles) {
    assert.equal(eventSourceEligibility(
      { clean_text: "Source text with a candidate event.", raw_qc_decision: "pass" },
      { source_url: "https://example.com/source" },
      title,
    ).accepted, false, title);
  }
});

test("the reviewed Top 50 AI funded startups source remains eligible", () => {
  for (const title of [
    "50 Top AI Funded Startups (July 2026)",
    "2026年7月50家顶级AI融资初创公司",
  ]) {
    assert.equal(eventSourceEligibility(
      { clean_text: "The ranked source contains dated company financing and IPO facts.", raw_qc_decision: "pass" },
      { source_url: "https://aifundingtracker.com/top-50-ai-startups/" },
      title,
    ).accepted, true, title);
  }
});

test("recap articles do not become model release events", () => {
  const result = eventSourceEligibility(
    { clean_text: "A discussion covering several previously released open models.", raw_qc_decision: "pass" },
    { source_url: "https://www.interconnects.ai/p/open-models-recap" },
    "Open models recap: more on Kimi K3, Qwen 3.8, distillation, and what's next",
  );

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "non_event_or_index_title");
});

test("analysis headlines about what a rebalance means stay out of commercial events", () => {
  const result = eventSourceEligibility(
    { clean_text: "An analysis of the portfolio implications of a monthly fund rebalance.", raw_qc_decision: "pass" },
    { source_url: "https://www.wisdomtree.com/us/insights/blog/wtai-rebalance" },
    "The AI Factory Supply Chain: What WTAI's July 2026 Rebalance Is Really Saying | WisdomTree",
  );

  assert.equal(result.accepted, false);
  assert.equal(result.reason, "non_event_or_index_title");
});

test("tag and topic index pages cannot become commercial events", () => {
  for (const sourceUrl of [
    "https://cn.ft.com/tag/artificial-intelligence?page=14",
    "https://example.com/topics/enterprise-ai/",
  ]) {
    const result = eventSourceEligibility(
      { clean_text: "A page containing excerpts from several unrelated articles.", raw_qc_decision: "pass" },
      { source_url: sourceUrl },
      "Artificial Intelligence",
    );
    assert.equal(result.accepted, false, sourceUrl);
    assert.equal(result.reason, "tag_or_topic_index_not_event_source", sourceUrl);
  }
  assert.equal(eventSourceEligibility(
    { clean_text: "The project released version 1.2.3.", raw_qc_decision: "pass" },
    { source_url: "https://github.com/example/project/releases/tag/v1.2.3" },
    "Project 1.2.3 released",
  ).accepted, true);
  assert.equal(publicEventSourceUrlIssue("https://cn.ft.com/tag/artificial-intelligence?page=14"), "tag_or_topic_index_not_event_source");
  assert.equal(publicEventSourceUrlIssue("https://github.com/example/project/releases/tag/v1.2.3"), "");
});

test("integrity gate rejects canonical events sourced from tag or topic indexes", () => {
  const bundle = buildBundle([
    entry("tag-index-gate", "Acme launches AI agent", "Acme launched an AI agent for support teams.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.source_artifacts[0].source_url = "https://cn.ft.com/tag/artificial-intelligence?page=14";
  bundle.source_artifacts[0].canonical_url = bundle.source_artifacts[0].source_url;
  bundle.raw_documents[0].source_url = bundle.source_artifacts[0].source_url;
  bundle.raw_documents[0].canonical_url = bundle.source_artifacts[0].source_url;

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("ineligible source URL (tag_or_topic_index_not_event_source)")));
});

test("thousand-denominated funding metrics retain their K magnitude", () => {
  assert.deepEqual(metricValues("Optimly raised $800K in pre-seed funding."), ["$800K"]);
  assert.equal(normalizedFundingMetric("$800K"), "$:0.8:million");
});

test("research and report containers cannot promote incidental historical events", () => {
  assert.deepEqual(modelAssistedEventEligibility(
    { source_type: "web" },
    "边缘AI技术报告2026 - 合作伙伴",
    "acquisition",
  ), {
    accepted: false,
    reason: "research_or_report_container_not_event_source",
  });
  assert.equal(modelAssistedEventEligibility(
    { source_type: "research" },
    "HANDBOOK.md 基准测试：长政策文档无法可靠约束AI智能体行为",
    "research_result",
  ).accepted, true);
  assert.deepEqual(modelAssistedEventEligibility(
    { source_type: "web", published_at: "2026-07-16T00:00:00.000Z" },
    "Thinking Machines launched Inkling",
    "model_release",
    "2026-07-31",
  ), {
    accepted: false,
    reason: "model_assist_source_outside_daily_window",
  });
});

test("model-assisted funding can use the three-month backfill window", () => {
  assert.deepEqual(modelAssistedEventEligibility(
    { source_type: "web", published_at: "2026-05-01T00:00:00.000Z" },
    "Natural completed financing for its AI agent platform",
    "funding",
    "2026-08-01",
  ), {
    accepted: true,
    reason: "",
  });
});

test("verified funding sources within the three-month backfill window become canonical events", () => {
  const bundle = buildBundle([
    entry(
      "historical-funding-within-window",
      "Natural raises $30M for AI agent payments",
      "Natural raised $30 million in a Series A round for its AI agent payment platform.",
      { published_at: "2026-05-01T00:00:00.000Z" },
    ),
  ], taxonomy, "2026-08-01", "2026-08-01T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "funding");
});

test("funding sources older than three months stay in QA by default", () => {
  const bundle = buildBundle([
    entry(
      "historical-funding-outside-window",
      "Natural raises $30M for AI agent payments",
      "Natural raised $30 million in a Series A round for its AI agent payment platform.",
      { published_at: "2026-04-30T00:00:00.000Z" },
    ),
  ], taxonomy, "2026-08-01", "2026-08-01T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.ok(bundle.qa_queue.some((item) => item.reason === "source_outside_funding_backfill_window"));
});

test("sources dated after the data day cannot become commercial events", () => {
  const bundle = buildBundle([
    entry(
      "future-dated-service-change",
      "GSA removes Anthropic integrations",
      "GSA will remove its Anthropic system integrations by August 27.",
      { published_at: "2026-08-27T00:00:00.000Z" },
    ),
  ], taxonomy, "2026-07-31", "2026-07-31T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 0);
  assert.ok(bundle.qa_queue.some((item) => item.reason === "source_published_after_data_date"));
});

test("secondary rumor wording in the source lead requires primary confirmation", () => {
  const result = eventSourceEligibility(
    {
      clean_text: "消息称 OpenAI ChatGPT 周活用户即将破 10 亿。据 The Information 报道，OpenAI 内部披露的信息显示其周活跃用户接近该数字。",
      source_level: "B",
      raw_qc_decision: "pass",
    },
    { source_url: "https://example.com/secondary-usage-rumor" },
    "OpenAI ChatGPT 周活用户即将突破 10 亿，较预期晚了半年",
  );

  assert.equal(result.reason, "rumor_requires_primary_confirmation");
});

test("specific research, policy, standard, and financial facts outrank generic release words", () => {
  const cases = [
    ["HANDBOOK.md 基准测试：长政策文档无法可靠约束AI智能体行为", "research_result"],
    ["上海发布户外广告合规指引：AI 生成内容须明确标识", "policy_regulation"],
    ["MCP 2026-07-28 规范发布，转向“无状态”核心", "standard_specification"],
    ["OpenAI 称 7 月年化收入已超 Q2 总和，面临 Anthropic 与开源模型双重竞争", "financial_performance"],
  ];

  for (const [title, eventType] of cases) assert.equal(findEventRule(title)?.eventType, eventType, title);
  assert.equal(eventStatus(
    "MCP 2026-07-28 规范发布，转向“无状态”核心",
    "新规范取消握手并移除了会话 ID。",
    "standard_specification",
  ), "completed");
});

test("a disclosed cybersecurity incident is not classified as a product release", () => {
  const bundle = buildBundle([
    entry(
      "anthropic-security-incident",
      "Anthropic：第三方评估环境配置失误，导致三起真实网络安全事件",
      "Anthropic 发布公告，表示在 Claude 网络安全评估审查中发现了三起真实网络安全事件，原因是第三方评估环境配置失误。",
    ),
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "security_incident");
});

test("an announced AI lawmaking process is classified as policy regulation", () => {
  const bundle = buildBundle([
    entry(
      "china-ai-law",
      "国家发改委：将加快《人工智能法》立法进程",
      "国家发展改革委表示将加快《人工智能法》的立法进程，统筹人工智能发展与安全。",
    ),
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "policy_regulation");
  assert.equal(bundle.canonical_events[0].event_status, "planned");
});

test("an attributed completed financing is not downgraded to rumor", () => {
  const result = eventSourceEligibility(
    {
      clean_text: "据华峰资本官微消息，月之暗面已完成新一轮约20亿美元融资，本轮由美团龙珠领投。",
      source_level: "A",
      raw_qc_decision: "pass",
    },
    { source_url: "https://www.nbd.com.cn/articles/2026-05-07/4381686.html" },
    "月之暗面完成约20亿美元融资 投后估值超过200亿美元",
  );
  const roundup = eventSourceEligibility(
    { clean_text: "A daily collection of unrelated items.", raw_qc_decision: "pass" },
    { source_url: "https://example.com/roundup" },
    "OpenAI 私有 MCP 🤖，Cognition 估值 260 亿美元 💰，ElevenLabs Music v2 🎵",
  );

  assert.equal(result.accepted, true);
  assert.equal(roundup.reason, "multi_event_roundup_not_single_event_source");
});

test("corrected event statuses distinguish completed rollout evidence from future hardware", () => {
  assert.equal(findEventRule("Qualcomm unveils Dragonfly C1000 CPU, set to be deployed by Meta")?.eventType, "hardware_product");
  assert.equal(eventAiRelevanceEvidence({
    title: "Qualcomm unveils Dragonfly C1000 CPU",
    claims: [],
    entityNames: ["Qualcomm"],
    eventType: "hardware_product",
  }).accepted, true);
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
    }),
    entry("copilot-super-app-a", "Microsoft launches Copilot AI super app this year", "Microsoft launched the Copilot AI super app to combine chat, coding, and agentic capabilities.", {
      title_zh: "微软确认 Copilot 超级应用将于今年推出"
    }),
    entry("copilot-super-app-b", "Microsoft releases Copilot AI 超级应用 for consumers and companies", "Microsoft released the Copilot AI 超级应用 for consumer and commercial experiences.", {
      title_zh: "微软确认 Copilot 超级应用年内问世"
    })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 2);
  assert.ok(bundle.canonical_events.every((event) => event.source_refs.length === 2));
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

test("NPU mini PCs produce a hardware projection with source-bounded TOPS capacity", () => {
  const bundle = buildBundle([
    entry(
      "npu-mini-pc",
      "零刻推出 SEi13 AI / SEi14 AI 迷你主机：独立 NPU 最高 160TOPS",
      "零刻今日宣布推出零刻 SEi13 AI 与零刻 SEi14 AI 迷你主机，搭载最高 160TOPS 算力独立 NPU，为本地 AI 推理而生。",
      { language: "zh" }
    )
  ], taxonomy, date, "2026-07-30T00:00:00.000Z");

  assert.equal(bundle.hardware_records.length, 1);
  assert.equal(bundle.hardware_records[0].component_type, "ai_accelerator");
  assert.equal(bundle.hardware_records[0].capacity, 160);
  assert.equal(bundle.hardware_records[0].capacity_unit.toLowerCase(), "tops");
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

test("FDE role projection rejects substring aliases and action-fragment organizations", () => {
  const bundle = buildBundle([
    entry(
      "cactus-contract",
      "Cactus Technology wins MeitY contract for AI tender drafting platform",
      "Cactus Technology Solutions was awarded a contract to provide an artificial intelligence platform for government procurement workflows."
    ),
    entry(
      "kpmg-openai-alliance",
      "KPMG and OpenAI form Strategic Alliance to Advance AI-Native Enterprise Workflows",
      "KPMG and OpenAI announced a strategic alliance. KPMG employees will deploy OpenAI services across enterprise workflows."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  const entityNames = bundle.entities.map((item) => item.canonical_name);
  const claimById = new Map(bundle.claims.map((item) => [item.claim_id, item]));
  const eventFor = (name) => bundle.canonical_events.find((event) =>
    event.claim_refs.some((id) => claimById.get(id)?.source_quote.includes(name)));
  const cactus = bundle.fde_records.find((item) => item.event_id === eventFor("Cactus Technology")?.event_id);
  const kpmg = bundle.fde_records.find((item) => item.event_id === eventFor("KPMG and OpenAI")?.event_id);

  assert.equal(entityNames.includes("Intel"), false, "Intel must not match inside intelligence");
  assert.equal(entityNames.includes("OpenAI form Strategic"), false);
  assert.notEqual(cactus?.customer, "Intel");
  assert.equal(kpmg?.customer, "KPMG");
  assert.equal(kpmg?.vendor, "OpenAI");
});

test("FDE partnership entity extraction does not turn an action fragment into the vendor", () => {
  const bundle = buildBundle([
    entry(
      "stellantis-mistral",
      "Stellantis and Mistral AI Expand Their Collaboration to Accelerate Enterprise-Wide AI Adoption",
      "Stellantis and Mistral AI elevate their partnership from pilots to company-wide AI deployment, embedding generative AI across operations."
    )
  ], taxonomy, date, "2026-07-30T00:00:00.000Z");

  assert.equal(bundle.fde_records.length, 1);
  assert.equal(bundle.fde_records[0].customer, "Stellantis");
  assert.equal(bundle.fde_records[0].vendor, "Mistral AI");
  assert.equal(bundle.entities.some((entity) => entity.canonical_name === "Mistral AI Expand Their"), false);
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
    title: "打造高性能国产AGI算力底座，容芯致远完成数亿元天使轮融资",
    claims: ["北京容芯致远科技有限公司宣布完成数亿元天使轮融资。"],
    entityNames: ["北京容芯致远科技有限公司"],
    eventType: "funding"
  }).accepted, true);

  assert.equal(eventAiRelevanceEvidence({
    title: "Poolside releases Laguna S 2.1",
    claims: ["Poolside has released Laguna S 2.1, its third coding model in three months."],
    entityNames: ["Poolside"],
    eventType: "model_release"
  }).basis, "explicit_claim_text");

  assert.equal(eventAiRelevanceEvidence({
    title: "北京亦庄联合京东云上线模型券即时补贴平台",
    claims: ["企业购买模型服务可获得最高65%的即时补贴。"],
    entityNames: ["京东云"],
    eventType: "deployment"
  }).basis, "administrative_ai_support_program");
});

test("generated bundle passes the V4 integrity gate", () => {
  const entries = [
    entry("deployment", "Hospital deploys Acme AI workflow", "Hospital deployed Acme AI workflow in production. The system reduced review time by 20%."),
    entry("model", "Example releases multimodal open weights model", "Example released a multimodal model with open weights for on-device use.")
  ];
  const bundle = buildBundle(entries, taxonomy, date, "2026-07-16T00:00:00.000Z");
  const bodyByHash = new Map(entries.map((item) => [item.raw.content_hash, trimBoilerplate(item.raw.clean_text)]));
  assert.equal(bundle.manifest.compatibility_state, "retired");
  assert.equal("compatibility_cards" in bundle, false);
  assert.equal("legacy_asset_mappings" in bundle, false);
  assert.ok(bundle.raw_documents.every((raw) => raw.body_ref));
  const bodyFreeBundle = {
    manifest: bundle.manifest,
    source_artifacts: bundle.source_artifacts,
    raw_documents: bundle.raw_documents,
    claims: bundle.claims,
    entities: bundle.entities,
    entity_mentions: bundle.entity_mentions,
    canonical_events: bundle.canonical_events,
    event_sources: bundle.event_sources,
    event_claims: bundle.event_claims,
    event_conflicts: bundle.event_conflicts,
    relationships: bundle.relationships,
    tag_assertions: bundle.tag_assertions,
    facet_assertions: bundle.facet_assertions,
    reviewed_event_classifications: bundle.reviewed_event_classifications,
    fde_records: bundle.fde_records,
    fde_observations: bundle.fde_observations,
    hardware_records: bundle.hardware_records,
    hardware_facts: bundle.hardware_facts,
    hardware_snapshots: bundle.hardware_snapshots,
    monitoring_funnel: bundle.monitoring_funnel,
    qa_queue: bundle.qa_queue
  };
  const result = evaluateBundle(bodyFreeBundle, taxonomy, {
    hydratedRawDocuments: bundle.raw_documents.map((raw) => ({
      ...raw,
      body_clean: bodyByHash.get(raw.content_hash) || "",
    })),
  });
  assert.deepEqual(result.failures, []);
});

test("Claim-native FDE observations aggregate implementation facts without using the event as the admission key", () => {
  const bundle = buildBundle([
    entry(
      "fde-observation",
      "Hospital deploys Acme AI workflow",
      "Hospital deployed Acme AI workflow in production. The system integrated with the hospital workflow and reduced review time by 20%."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.fde_observations.length, 1);
  assert.ok(bundle.fde_observations[0].claim_refs.every((id) => bundle.claims.some((claim) => claim.claim_id === id)));
  assert.ok(bundle.fde_observations[0].source_refs.length > 0);
  assert.ok(bundle.fde_observations[0].implementation_key);
  assert.equal(bundle.fde_observations[0].completeness.total_fields, 8);
});

test("hardware Claims produce facts, dated snapshots, and monitored funnel rows", () => {
  const bundle = buildBundle([
    entry(
      "hardware-fact",
      "Acme launches AI accelerator server",
      "Acme launched an AI accelerator server delivering 160 TOPS for enterprise customers. The server ships in July."
    )
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.ok(bundle.hardware_facts.length > 0);
  assert.ok(bundle.hardware_facts.every((fact) => bundle.claims.some((claim) => claim.claim_id === fact.claim_ref && claim.source_quote === fact.source_quote)));
  assert.ok(bundle.hardware_snapshots.length > 0);
  assert.ok(bundle.hardware_snapshots.every((snapshot) => snapshot.as_of === date && snapshot.fact_refs.length > 0));
  assert.deepEqual(bundle.monitoring_funnel.map((item) => item.lens).sort(), ["fde", "hardware"]);
  assert.ok(bundle.monitoring_funnel.every((item) => Object.values(item.rates).every((value) => value >= 0 && value <= 1)));
});

test("SourceArtifact retains a content-addressed private evidence locator", (t) => {
  const tempDir = fs.mkdtempSync(path.join(root, ".data-center-v4-test-"));
  t.after(() => fs.rmSync(tempDir, { recursive: true, force: true }));
  const rawEntry = entry(
    "raw-snapshot-fallback",
    "Acme launches AI workflow",
    "Acme launched an AI workflow for operations teams. The workflow is now available to customers.",
    { markdown_snapshot_path: "fixtures/deleted-snapshot.md" },
  );
  rawEntry.file = path.join(tempDir, "raw.json");
  fs.writeFileSync(rawEntry.file, JSON.stringify(rawEntry.raw), "utf8");
  const bundle = buildBundle([rawEntry], taxonomy, date, "2026-07-16T00:00:00.000Z");
  assert.deepEqual(bundle.source_artifacts[0].snapshot_refs, [`evidence://${rawEntry.raw.content_hash}`]);
  assert.ok(!bundle.source_artifacts[0].snapshot_refs.includes("fixtures/deleted-snapshot.md"));
});

test("filesystem integrity gate requires resolvable snapshots and complete current-day Raw coverage", () => {
  const workspaceRoot = fs.mkdtempSync(path.join(process.env.TEMP || process.cwd(), "wavesight-v4-gate-"));
  const rawDir = path.join(workspaceRoot, "01-SiteV2/content/01-raw/originals", date);
  fs.mkdirSync(rawDir, { recursive: true });
  const rawPath = path.join(rawDir, "r-001.json");
  fs.writeFileSync(rawPath, JSON.stringify({
    raw_id: "legacy-raw-001",
    original_url: "https://www.example.com/story/",
    canonical_url: "https://example.com/story",
    content_hash: "hash-001"
  }), "utf8");
  const relativeRawPath = path.relative(workspaceRoot, rawPath).replace(/\\/gu, "/");
  const bundle = {
    manifest: { date },
    source_artifacts: [{
      source_artifact_id: "SA-001",
      source_url: "https://example.com/story",
      canonical_url: "https://example.com/story",
      snapshot_refs: [relativeRawPath],
      content_hash: "hash-001"
    }],
    raw_documents: [{
      raw_id: "RAW-001",
      source_artifact_id: "SA-001",
      source_url: "https://example.com/story",
      canonical_url: "https://example.com/story",
      body_ref: relativeRawPath,
    }]
  };

  const passing = evaluateBundleFiles(bundle, { workspaceRoot, date });
  assert.deepEqual(passing.failures, []);
  assert.equal(passing.metrics.current_raw_snapshot_coverage, 1);

  bundle.source_artifacts[0].snapshot_refs = ["outside/missing.json"];
  bundle.raw_documents[0].body_ref = "outside/missing.json";
  bundle.source_artifacts[0].source_url = "https://example.com/different";
  bundle.source_artifacts[0].canonical_url = "https://example.com/different";
  bundle.source_artifacts[0].content_hash = "different";
  bundle.raw_documents[0].source_url = "https://example.com/different";
  bundle.raw_documents[0].canonical_url = "https://example.com/different";
  const failing = evaluateBundleFiles(bundle, { workspaceRoot, date });
  assert.ok(failing.failures.some((failure) => failure.includes("snapshot_ref does not exist")));
  assert.ok(failing.failures.some((failure) => failure.includes("not represented in the V4 bundle")));
});

test("integrity gate blocks a canonical event whose evidence is no longer AI-industry scoped", () => {
  const bundle = buildBundle([
    entry("tampered", "Acme launches AI agent platform", "Acme launched an AI agent platform for customer support.", {
      title_zh: "Acme 发布 AI 智能体平台"
    })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  const raw = bundle.raw_documents[0];
  const claim = bundle.claims[0];
  const quote = "Acme launched a billing dashboard for finance teams.";

  raw.title_original = "Acme launches billing dashboard";
  raw.title_zh = "";
  raw.body_original = quote;
  raw.body_clean = quote;
  claim.source_quote = quote;
  claim.object = "billing dashboard";
  claim.source_span = { raw_id: raw.raw_id, start: 0, end: quote.length };
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

test("integrity gate rejects event-field summaries as public titles", () => {
  const bundle = buildBundle([
    entry("source-title-contract", "Acme AI raises $10 million to build AI hardware", "Acme AI raised $10 million to build AI hardware.", {
      title_zh: "Acme AI 获得 1000 万美元融资，用于打造 AI 硬件"
    })
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");
  bundle.canonical_events[0].display_title_zh = "Acme AI 完成 1000 万美元融资";

  const result = evaluateBundle(bundle, taxonomy);
  assert.ok(result.failures.some((failure) => failure.includes("not an exact source-title translation")));
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

test("daily workflow stages only V4-native outputs after the pre-commit gate succeeds", () => {
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/daily-persistent-assets-pr.yml"), "utf8");
  const stagingBlock = workflow.indexOf("- name: Commit Data Center V4 assets");

  assert.ok(stagingBlock > 0);
  for (const asset of [
    "data-center-v4/intake-v1/${RUN_DATE}.json",
    "data-center-v4/${RUN_DATE}",
    "opportunity-evidence-v2.json",
    "trend-radar-v1.json",
    "collection-telemetry-v1.json",
  ]) {
    assert.ok(workflow.indexOf(asset, stagingBlock) > stagingBlock, `${asset} must be staged inside the V4-success block`);
  }
  assert.doesNotMatch(workflow, /(?:no-)?trend-candidate-decision\.md|v3-data-observation-desk\.json|intelligence-graph-index\.json|01-Signal-Cards/iu);
  assert.match(workflow, /if: always\(\) && steps\.pre-commit-gate\.outcome == 'success'/iu);
});

test("daily workflow resumes downstream failures without repeating accepted collection", () => {
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/daily-persistent-assets-pr.yml"), "utf8");
  const dispatcher = fs.readFileSync(path.join(root, "agent-workflow/tools/run-business-signals-health-dispatch.mjs"), "utf8");
  const titleRepair = fs.readFileSync(path.join(root, "agent-workflow/tools/backfill-source-title-translations.mjs"), "utf8");
  const agentRules = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");

  assert.match(workflow, /resume_run_id:/u);
  assert.match(workflow, /Restore accepted source intake from failed run/u);
  assert.match(workflow, /resume_dir="\$\(mktemp -d\)"/u);
  assert.match(workflow, /gh run download "\$resume_run_id" --name "\$artifact_name" --dir "\$resume_dir\/artifact"/u);
  assert.match(workflow, /cp -a "\$resume_dir\/artifact\/\." \./u);
  assert.match(workflow, /Collect source raw artifacts[\s\S]*?if: steps\.existing-assets\.outputs\.skip != 'true' && steps\.resume-artifact\.outputs\.used != 'true'/u);
  assert.match(workflow, /Run Daily Monitor with QC[\s\S]*?if: steps\.existing-assets\.outputs\.skip != 'true' && steps\.resume-artifact\.outputs\.used != 'true'/u);
  assert.match(workflow, /const requiredSteps = \[\s*"Collect source raw artifacts",\s*"Run Daily Monitor with QC",\s*\]/u);
  assert.match(dispatcher, /const requiredSteps = \[\s*"Collect source raw artifacts",\s*"Run Daily Monitor with QC",\s*\]/u);
  assert.match(workflow, /Confirm V4 source-intake handoff and dedupe state[\s\S]*?if: always\(\)/u);
  assert.match(workflow, /Persist originals privately and enforce the public boundary[\s\S]*?\(steps\.monitor\.outcome == 'success' \|\| steps\.resume-artifact\.outputs\.used == 'true'\)/u);
  assert.match(workflow, /Repair required source-title translations[\s\S]*backfill-source-title-translations\.mjs[\s\S]*--date="\$\{RUN_DATE\}"[\s\S]*--write=true[\s\S]*normalize-source-intake-titles\.mjs --date="\$\{RUN_DATE\}"[\s\S]*build-data-center-v4\.mjs --date="\$\{RUN_DATE\}"[\s\S]*assert:source-titles/u);
  assert.match(workflow, /Run Data Center V4 integrity gate[\s\S]*steps\.source-title-repair\.outcome == 'success'/u);
  assert.match(titleRepair, /const selectedDate = arg\("date"\)/u);
  assert.match(titleRepair, /filter\(\(date\) => !selectedDate \|\| date === selectedDate\)/u);
  assert.match(workflow, /assert:private-evidence-backup -- --date="\$\{RUN_DATE\}"/u);
  const evidenceBoundary = workflow.indexOf("Persist originals privately and enforce the public boundary");
  const evidencePush = workflow.indexOf('git -C "$GUANLAN_EVIDENCE_BACKUP_ROOT" push origin HEAD:main', evidenceBoundary);
  const evidenceAssert = workflow.indexOf('npm run assert:private-evidence-remote', evidencePush);
  const evidenceCoverage = workflow.indexOf('npm run assert:private-evidence-backup -- --date="${RUN_DATE}"', evidencePush);
  assert.ok(evidenceBoundary >= 0 && evidencePush > evidenceBoundary, "private evidence must push before final remote assertions");
  assert.ok(evidenceAssert > evidencePush && evidenceCoverage > evidencePush, "private evidence coverage must run after push");
  assert.match(agentRules, /Same-date accepted collection is immutable reusable input/u);
  assert.match(agentRules, /must restore that artifact and must not recollect/u);
});

test("cloud Business Signals health dispatch waits for downstream completion", () => {
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/business-signals-health-dispatch.yml"), "utf8");
  const dispatcher = fs.readFileSync(path.join(root, "agent-workflow/tools/run-business-signals-health-dispatch.mjs"), "utf8");

  assert.match(workflow, /timeout-minutes: 45/u);
  assert.match(workflow, /--wait=true/u);
  assert.match(workflow, /--wait-timeout-minutes=35/u);
  assert.match(dispatcher, /waitForBusinessSignalsRun/u);
  assert.match(dispatcher, /waitForHealthyV4/u);
  assert.match(dispatcher, /Business Signals run concluded/u);
  assert.match(dispatcher, /\+refs\/heads\/main:refs\/remotes\/origin\/main/u);
  assert.match(dispatcher, /data-center-v4\/manifest\.json/u);
  assert.doesNotMatch(dispatcher, /frontstagePath = "01-SiteV2\/site\/data\/data-center-v4-frontstage\.json"/u);
  assert.match(dispatcher, /ready: fetch\.ok/u);
  assert.match(dispatcher, /Timed out waiting for Business Signals publication/u);
  assert.match(dispatcher, /action: "completed"/u);
});

test("source-intake gate replays V4 evidence eligibility without private Raw routing fields", () => {
  const accepted = {
    eligibleForV4Extraction: true,
    evidenceObjectUsable: true,
    evidenceStrength: "rich_evidence",
    rawQcDecision: "allow",
    hasFullText: true,
    originFetchStatus: "success",
    evidenceObjectType: "event",
    text: "Acme released an AI workflow product.",
  };
  assert.equal(isRoutedV4EvidenceItem(accepted), true);
  assert.equal(isCoreV4EvidenceItem(accepted), true);
  assert.equal(isUsableCoreEvidenceItem(accepted), true);

  assert.equal(isRoutedV4EvidenceItem({ ...accepted, eligibleForV4Extraction: false }), false);
  assert.equal(isUsableCoreEvidenceItem({ ...accepted, evidenceObjectType: "official_index_or_directory" }), false);
  assert.equal(isCoreV4EvidenceItem({ ...accepted, rawQcDecision: "allow_with_degradation" }), false);
  assert.equal(isUsableCoreEvidenceItem({ ...accepted, rawQcDecision: "allow_with_degradation" }), false);
});

test("Core Raw QC metrics count blocked or degraded records before the decision filter", () => {
  const candidate = {
    eligibleForV4Extraction: true,
    evidenceObjectUsable: true,
    evidenceStrength: "source_backed_event",
    rawQcDownstreamUse: "eligible_after_qc",
    hasFullText: true,
    originFetchStatus: "success",
  };
  assert.deepEqual(coreRawQcViolationCounts([
    { ...candidate, rawQcDecision: "allow" },
    { ...candidate, rawQcDecision: "block" },
    { ...candidate, rawQcDecision: "allow_with_degradation" },
    { ...candidate, rawQcDecision: "block", rawQcDownstreamUse: "not_allowed" },
  ]), {
    blocked: 1,
    degraded: 1,
  });
});

test("production-chain staleness ignores clean-checkout filesystem timestamp order", () => {
  const gate = fs.readFileSync(path.join(root, "agent-workflow/tools/assert-daily-production-chain.mjs"), "utf8");

  assert.match(gate, /git", \[\s*"status",\s*"--porcelain"/u);
  assert.match(gate, /relevantWorktreeChanged \? Object\.entries\(downstreamGroups\) : \[\]/u);
  assert.match(gate, /application_opportunity/u);
  assert.match(gate, /application_trend/u);
  assert.match(gate, /application_funding/u);
  assert.match(gate, /blockedStaleGroups = blockStale[\s\S]*!group\.name\.startsWith\("application_"\)/u);
  assert.match(gate, /application_warning_groups/u);
});

test("production-chain handoff uses V4 eligible document counts instead of retired Pool markers", () => {
  const gate = fs.readFileSync(path.join(root, "agent-workflow/tools/assert-daily-production-chain.mjs"), "utf8");

  assert.match(gate, /counts\?\.eligible_documents/u);
  assert.match(gate, /eligible_for_v4_extraction/u);
  assert.doesNotMatch(gate, /intake_diagnostics\?\.pooled/u);
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
    entry("microagi-funding", "Microagi nabs $55M to teach factory robots how to work", "Microagi today announced it has raised $55 million in seed funding for its AI robotics platform.", {
      title_zh: "Microagi 获得 5500 万美元融资，用于训练工厂机器人工作"
    }),
    entry("elorian-funding", "How a former DeepMind researcher raised at a $300M pre-seed valuation", "Elorian raised a $55 million seed round at a $300 million valuation to build visual AI systems.")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 2);
  assert.ok(bundle.canonical_events.every((event) => event.event_type === "funding"));
  assert.ok(bundle.canonical_events.some((event) => event.display_title_zh === "Microagi 获得 5500 万美元融资，用于训练工厂机器人工作"));
});

test("benchmark releases and body-led product launches remain factual events", () => {
  const bundle = buildBundle([
    entry("benchmark-release", "Moonshot AI 发布 PerceptionBench：多模态模型视觉感知能力诊断基准", "We are releasing PerceptionBench, a benchmark that evaluates visual perception in multimodal language models."),
    entry("wps-release", "金山办公 CEO 章庆元谈 AI 办公商业模式", "金山办公在大会上发布两款 AI 办公智能体。灵犀专业版面向个人用户，WPS Comate 面向企业用户。")
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.ok(bundle.canonical_events.some((event) => event.event_type === "research_result" && /PerceptionBench/u.test(event.display_title_zh)));
  assert.ok(bundle.canonical_events.some((event) => event.event_type === "product_release" && event.display_title_zh === "金山办公 CEO 章庆元谈 AI 办公商业模式"));
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

test("Gemini Robotics ER 2 reports cluster into one model release", () => {
  const bundle = buildBundle([
    entry(
      "gemini-er2-official",
      "Gemini Robotics ER 2: Powering robotics with video understanding and multi-robot collaboration",
      "Google DeepMind released the Gemini Robotics ER 2 model for video understanding and multi-robot collaboration.",
      { title_zh: "Gemini Robotics ER 2：用视频理解与多机器人协作赋能机器人" },
    ),
    entry(
      "gemini-er2-media",
      "谷歌 DeepMind 推出 Gemini Robotics ER 2，支持连续视频理解与多机器人协作",
      "谷歌 DeepMind 推出 Gemini Robotics ER 2 模型，支持连续视频理解与多机器人协作。",
      { title_zh: "谷歌 DeepMind 推出 Gemini Robotics ER 2，支持连续视频理解与多机器人协作" },
    ),
  ], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "model_release");
  assert.equal(bundle.canonical_events[0].source_refs.length, 2);
});

test("GPT-5.6 price-cut reports cluster into one pricing event", () => {
  const decoder = entry(
    "gpt56-price-decoder",
    "OpenAI goes full China pricing mode with an 80 percent cut to its most affordable GPT-5.6 model",
    "OpenAI goes full China pricing mode with an 80 percent cut to its most affordable GPT-5.6 model. OpenAI cut GPT-5.6 Luna prices by 80 percent and GPT-5.6 Terra prices by 20 percent.",
    { title_zh: "OpenAI 采用“中国式定价”，将最便宜的 GPT-5.6 模型降价 80%" },
  );
  const analysisQuote = "GPT-5.6 Terra price decreases by 20 percent and GPT-5.6 Luna price decreases by 80 percent.";
  const analysis = entry(
    "gpt56-price-analysis",
    "Advancing the price-performance frontier with GPT-5.6",
    analysisQuote,
    { title_zh: "以 GPT-5.6 推进性价比前沿" },
  );
  const modelAssist = {
    candidates: [
      acceptedModelCandidate(analysis, [
        { event_type: "pricing_change", subject: "OpenAI", object: "GPT-5.6 Luna and Terra prices", evidence_index: 0 },
      ], [
        { start: 0, end: analysisQuote.length, quote: analysisQuote },
      ]),
    ],
  };
  const bundle = buildBundle([decoder, analysis], taxonomy, date, "2026-07-16T00:00:00.000Z", { modelAssist });

  assert.equal(bundle.canonical_events.length, 1);
  assert.equal(bundle.canonical_events[0].event_type, "pricing_change");
  assert.equal(bundle.canonical_events[0].source_refs.length, 2);
  assert.equal("market_scope" in bundle.canonical_events[0], false);
});

test("China market scope survives the canonical Raw and Event build", () => {
  const source = entry(
    "deepseek-cn-market-scope",
    "DeepSeek releases a new reasoning model",
    "DeepSeek released a new reasoning model through its official API documentation. The company published model access details, supported inputs, and release availability for developers.",
    {
      source_name: "DeepSeek official",
      source_registry_id: "cn-deepseek-news",
      source_region: "CN",
      market_region: "CN",
      china_market_match: true,
      china_market_match_basis: "china_entity:DeepSeek:DeepSeek",
      title_zh: "DeepSeek 发布新推理模型",
    },
  );
  const bundle = buildBundle([source], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.deepEqual(bundle.raw_documents[0].market_scope, {
    source_registry_id: "cn-deepseek-news",
    source_region: "CN",
    market_region: "CN",
    china_market_match: true,
    china_market_match_basis: "china_entity:DeepSeek:DeepSeek",
  });
  assert.deepEqual(bundle.canonical_events[0].market_scope, {
    market_region: "CN",
    china_market_match: true,
    china_market_basis: ["actor_origin"],
    source_registry_ids: ["cn-deepseek-news"],
    claim_refs: bundle.canonical_events[0].claim_refs,
  });
});

test("Biren aliases resolve to the reviewed stable company identity", () => {
  const source = entry(
    "biren-stable-identity",
    "Biren Technology raises $700 million for AI chip development",
    "Biren Technology raised $700 million in a completed financing round for AI chip development. The company said the capital will support its GPU product roadmap and commercial deployment.",
  );
  const bundle = buildBundle([source], taxonomy, date, "2026-07-16T00:00:00.000Z");
  const biren = bundle.entities.find((entity) => entity.canonical_name === "壁仞科技");

  assert.equal(biren?.entity_id, "EN-721eb3fd31f8e1f6");
  assert.equal(bundle.entities.some((entity) => entity.canonical_name === "Biren Technology"), false);
});

test("a Chinese competitor mention does not make a foreign actor a China-origin event", () => {
  const source = entry(
    "foreign-actor-china-comparison",
    "OpenAI releases a reasoning model that outperforms DeepSeek",
    "OpenAI released a reasoning model through its official API. The company reports that the model outperforms DeepSeek on a published reasoning benchmark.",
  );
  const bundle = buildBundle([source], taxonomy, date, "2026-07-16T00:00:00.000Z");

  assert.equal(bundle.raw_documents[0].market_scope?.china_market_match, true);
  assert.equal("market_scope" in bundle.canonical_events[0], false);
});

test("an accepted bundle can receive China market scope without recollecting private evidence", () => {
  const source = entry(
    "deepseek-cn-market-migration",
    "DeepSeek releases a new reasoning model",
    "DeepSeek released a new reasoning model through its official API documentation. The company published model access details and release availability for developers.",
    { title_zh: "DeepSeek 发布新推理模型" },
  );
  const bundle = buildBundle([source], taxonomy, date, "2026-07-16T00:00:00.000Z");
  for (const raw of bundle.raw_documents) delete raw.market_scope;
  for (const event of bundle.canonical_events) delete event.market_scope;

  const result = repairExistingChinaMarketScope(bundle, []);

  assert.equal(result.raw_market_count, 1);
  assert.equal(result.event_market_count, 1);
  assert.deepEqual(bundle.canonical_events[0].market_scope.china_market_basis, ["actor_origin"]);
});

test("China market migration leaves unrelated Raw documents untouched", () => {
  const source = entry(
    "openai-unrelated-market-migration",
    "OpenAI releases a new reasoning model",
    "OpenAI released a new reasoning model through its official API documentation. The company published model access details and release availability for developers.",
  );
  const bundle = buildBundle([source], taxonomy, date, "2026-07-16T00:00:00.000Z");
  for (const raw of bundle.raw_documents) delete raw.market_scope;

  const result = repairExistingChinaMarketScope(bundle, []);

  assert.equal(result.raw_market_count, 0);
  assert.equal(result.event_market_count, 0);
  assert.equal("market_scope" in bundle.raw_documents[0], false);
  assert.equal("market_scope" in bundle.canonical_events[0], false);
});
