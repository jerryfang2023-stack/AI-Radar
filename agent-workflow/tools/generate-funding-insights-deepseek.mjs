#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { deepSeekJsonCompletion, deepSeekModels, sourceTextHash } from "./deepseek-translation-client.mjs";
import {
  FUNDING_INSIGHT_PROMPT_VERSION,
  FUNDING_INSIGHT_VERSION,
  clean,
  ensureCanonicalFundingEvidence,
  entityResolver,
  fundingInsightProblems,
  latestDataDate,
  loadDailyBundle,
  readJson,
  referencedSourceIds,
  researchPayloadProblems,
  sanitizeResearchPayload,
  stableId,
  subjectCompanyForEvent,
  writeJson,
} from "./funding-insight-v1-utils.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || latestDataDate(root);
const write = args.get("write") === "true";
const force = args.get("force") === "true";
const limit = Math.max(0, Number(args.get("limit") || 0));
const eventId = clean(args.get("event-id") || "");
const eventIds = new Set([
  eventId,
  ...clean(args.get("event-ids") || "").split(",").map(clean),
].filter(Boolean));
const selectedOnly = args.get("selected-only") === "true";
const concurrency = Math.max(1, Math.min(4, Number(args.get("concurrency") || 2)));
const output = path.resolve(args.get("output")
  || path.join(root, "01-SiteV2/content/12-applications/funding-insights", `${date}.json`));
const model = deepSeekModels().pro;

function decodeHtml(value = "") {
  const named = new Map([
    ["amp", "&"], ["lt", "<"], ["gt", ">"], ["quot", "\""], ["apos", "'"], ["nbsp", " "],
  ]);
  return String(value || "")
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&([a-z]+);/giu, (match, name) => named.get(name.toLowerCase()) ?? match);
}

function htmlToText(html = "") {
  return clean(decodeHtml(String(html || "")
    .replace(/<(?:script|style|noscript|svg|template)[^>]*>[\s\S]*?<\/(?:script|style|noscript|svg|template)>/giu, " ")
    .replace(/<br\s*\/?\s*>/giu, "\n")
    .replace(/<\/(?:p|div|li|section|article|h[1-6])>/giu, "\n")
    .replace(/<[^>]+>/gu, " ")));
}

function hostFor(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./u, "").toLowerCase();
  } catch {
    return "";
  }
}

function normalizedUrlKey(url = "") {
  try {
    const parsed = new URL(url);
    return `${hostFor(url)}${parsed.pathname.replace(/\/+$/u, "") || "/"}`.toLowerCase();
  } catch {
    return clean(url).replace(/[?#].*$/u, "").replace(/\/$/u, "").toLowerCase();
  }
}

function sameHostFamily(left = "", right = "") {
  return left === right || left.endsWith(`.${right}`) || right.endsWith(`.${left}`);
}

const secondaryDomains = /(?:^|\.)(?:techcrunch\.com|reuters\.com|bloomberg\.com|forbes\.com|theverge\.com|crunchbase\.com|linkedin\.com|wikipedia\.org|businesswire\.com|prnewswire\.com|globenewswire\.com|36kr\.com)$/iu;

function sourceClass(url, companyName) {
  const host = hostFor(url);
  if (!host || secondaryDomains.test(host)) return "secondary";
  const key = clean(companyName).toLowerCase().replace(/[^a-z0-9]/gu, "");
  const hostKey = host.replace(/[^a-z0-9]/gu, "");
  return key.length >= 4 && (hostKey.includes(key) || key.includes(host.split(".")[0].replace(/[^a-z0-9]/gu, "")))
    ? "official_candidate"
    : "independent";
}

async function searchTavily(query, companyName) {
  if (!process.env.TAVILY_API_KEY || process.env.TAVILY_DISABLED === "true") return [];
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.TAVILY_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      query,
      topic: "general",
      search_depth: "advanced",
      max_results: 8,
      include_answer: false,
      include_raw_content: true,
    }),
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`tavily_${response.status}`);
  const data = await response.json();
  return (data.results || []).map((result) => ({
    provider: "tavily",
    title: clean(result.title),
    url: clean(result.url),
    provider_body: clean(result.raw_content || result.content),
    source_class: sourceClass(result.url, companyName),
  })).filter((result) => result.url);
}

async function searchExa(query, companyName) {
  if (!process.env.EXA_API_KEY) return [];
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "x-api-key": process.env.EXA_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({
      query,
      type: "auto",
      numResults: 8,
      contents: { text: { maxCharacters: 18000 } },
    }),
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`exa_${response.status}`);
  const data = await response.json();
  return (data.results || []).map((result) => ({
    provider: "exa",
    title: clean(result.title),
    url: clean(result.url),
    provider_body: clean(result.text),
    source_class: sourceClass(result.url, companyName),
  })).filter((result) => result.url);
}

async function capturePage(result) {
  let title = result.title;
  let body = "";
  let method = "";
  try {
    const response = await fetch(result.url, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; WaveSightFundingResearch/1.0; +https://github.com/jerryfang2023-stack/AI-Radar)",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    });
    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      const raw = (await response.text()).slice(0, 600000);
      body = /html/iu.test(contentType) ? htmlToText(raw) : clean(raw);
      const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/iu);
      if (titleMatch) title = clean(decodeHtml(titleMatch[1]));
      method = "direct_fetch";
    }
  } catch {}
  if (body.length < 300 && result.provider_body.length >= 300) {
    body = result.provider_body;
    method = `${result.provider}_captured_content`;
  }
  if (body.length < 300) return null;
  return {
    source_id: stableId("FISRC", result.url),
    source_url: result.url,
    title,
    publisher: hostFor(result.url),
    source_class: result.source_class,
    capture_method: method,
    captured_at: new Date().toISOString(),
    content_hash: sourceTextHash(body),
    body_clean: body.slice(0, 18000),
  };
}

function canonicalSources(bundle, event) {
  const artifactById = new Map(bundle.sourceArtifacts.map((item) => [item.source_artifact_id, item]));
  const rawByArtifact = new Map(bundle.rawDocuments.map((item) => [item.source_artifact_id, item]));
  return (event.source_refs || []).map((sourceRef) => {
    const artifact = artifactById.get(sourceRef);
    const raw = rawByArtifact.get(sourceRef);
    if (!artifact || !raw?.body_clean) return null;
    return {
      source_id: stableId("FISRC", artifact.source_url),
      source_url: artifact.source_url,
      title: raw.title_zh || raw.title_original,
      publisher: artifact.publisher || hostFor(artifact.source_url),
      source_class: "canonical_event_source",
      capture_method: "data_center_v4_source_artifact",
      captured_at: artifact.captured_at,
      content_hash: artifact.content_hash,
      body_clean: clean(raw.body_clean).slice(0, 18000),
      source_artifact_id: sourceRef,
      raw_id: raw.raw_id,
    };
  }).filter(Boolean);
}

function scoreCandidate(result, companyName) {
  const text = clean(`${result.title} ${result.url}`).toLowerCase();
  const body = clean(result.provider_body).toLowerCase();
  const name = clean(companyName).toLowerCase();
  let score = result.source_class === "official_candidate" ? 10 : result.source_class === "secondary" ? 4 : 6;
  if (text.includes(name)) score += 4;
  if (/\b(?:funding|raises|series|seed|investor|product|customer|case study|about|team|pricing)\b/iu.test(text)) score += 3;
  if (result.intent === "investor_rationale" && body.includes(name) && /\b(?:invest|investment|portfolio)\b/iu.test(body)) score += 5;
  return score;
}

async function researchSources(bundle, event, company) {
  const captured = canonicalSources(bundle, event);
  const officialHosts = [...new Set(captured.map((source) => hostFor(source.source_url)).filter(Boolean))];
  const queries = [
    { intent: "funding", query: `"${company.canonical_name}" funding investors round` },
    { intent: "product", query: `"${company.canonical_name}" official product customers case study` },
    { intent: "comparison", query: `"${company.canonical_name}" competitors product use case funding` },
    { intent: "investor_rationale", query: `"${company.canonical_name}" investor quote why invested` },
    { intent: "investor_rationale", query: `"${company.canonical_name}" \"why we invested\" OR \"our investment\"` },
  ];
  const attempts = [];
  const results = [];
  for (const { intent, query } of queries) {
    const settled = await Promise.allSettled([
      searchTavily(query, company.canonical_name),
      searchExa(query, company.canonical_name),
    ]);
    for (const [index, outcome] of settled.entries()) {
      const provider = index === 0 ? "tavily" : "exa";
      attempts.push({
        provider,
        query,
        status: outcome.status === "fulfilled" ? "completed" : "failed",
        error: outcome.status === "rejected" ? clean(outcome.reason?.message) : "",
      });
      if (outcome.status === "fulfilled") {
        results.push(...outcome.value.map((result) => ({ ...result, intent, query })));
      }
    }
  }
  const deduped = new Map();
  for (const result of results) {
    const candidateHost = hostFor(result.url);
    const isKnownSecondary = secondaryDomains.test(candidateHost);
    const isOfficialCandidate = result.source_class === "official_candidate";
    const isCanonicalHost = officialHosts.some((host) => sameHostFamily(candidateHost, host));
    const companyName = clean(company.canonical_name).toLowerCase();
    const companyInLead = clean(`${result.title} ${result.provider_body}`).toLowerCase().includes(companyName);
    const isInvestorRationaleLead = result.intent === "investor_rationale"
      && companyInLead
      && /\b(?:invest|investment|portfolio|series|seed|funding)\b/iu.test(clean(`${result.title} ${result.url} ${result.provider_body}`));
    if (!isKnownSecondary && !isOfficialCandidate && !isCanonicalHost && !isInvestorRationaleLead) continue;
    const key = normalizedUrlKey(result.url);
    if (!deduped.has(key) || scoreCandidate(result, company.canonical_name) > scoreCandidate(deduped.get(key), company.canonical_name)) {
      deduped.set(key, result);
    }
  }
  for (const candidate of [...deduped.values()].sort((a, b) => scoreCandidate(b, company.canonical_name) - scoreCandidate(a, company.canonical_name))) {
    if (captured.length >= 8) break;
    if (captured.some((source) => normalizedUrlKey(source.source_url) === normalizedUrlKey(candidate.url))) continue;
    const source = await capturePage(candidate);
    if (source) captured.push(source);
  }
  return { sources: captured, queries: queries.map((item) => item.query), attempts };
}

function directionManifest() {
  const file = path.join(root, "01-SiteV2/site/data/industry-reports-frontstage.json");
  return (readJson(file, {})?.directionCards || []).map((card) => ({ id: card.id, title: card.title }));
}

function promptFor(event, company, sources, directions) {
  const sourceText = sources.map((source) => [
    `SOURCE_ID: ${source.source_id}`,
    `SOURCE_URL: ${source.source_url}`,
    `SOURCE_CLASS: ${source.source_class}`,
    `TITLE: ${source.title}`,
    `BODY: ${source.body_clean}`,
  ].join("\n")).join("\n\n---\n\n");
  return [
    "你是观澜AI融资透视研究员。只使用下方已抓取SOURCE正文，不得使用模型记忆、搜索摘要或常识补写事实。",
    "任务：基于一个已验证融资事件，完成公司、产品、投资方、客户、关键数据、竞争比较和投资逻辑的结构化二次研究。投资方必须明确列出；无法从来源确认投资方时，返回空数组，系统会阻止发布。",
    "每个事实对象必须附evidence_refs。quote必须逐字复制SOURCE正文中的连续短片段，不得改写。缺失信息用空字符串或空数组，不得猜测。",
    "除公司、产品、人名、金额、轮次等专有名词外，summary、description、use_case、比较字段、sector、capital_judgment、risks等面向读者的内容必须使用简体中文。",
    "financing.amount写round所覆盖轮次的金额；若round同时覆盖多轮，则写多轮合计。total_raised写截至本次披露的累计融资额，不得混用。每个投资方的role必须用中文并写清轮次语境，例如“本轮领投”“本轮参投”“种子轮领投”“天使投资人”或“既有投资方”。",
    "必须列出来源中与本次披露及其所述历史轮次有关的全部投资方，不得选择性省略；同一机构只列一次，并在role中说明所属轮次。",
    "comparisons是应用层比较集合，不代表事实关系。只收录来源明确支持具体产品或方案、应用场景、目标客户、融资信息或商业路径的竞品；如果来源只说“同类公司”或“起点不同”，不要输出该条。product写具体产品或方案，scenario写具体工作流，缺失融资金额时funding_summary留空；core_difference必须逐字段比较已经证实的差异，不得写“起点不同”“各有优势”等机械句式。",
    "analysis.investment_rationale只收录本轮投资机构或其投资人的公开原话。institution必须与financing.investors中的机构名一致；speaker和speaker_role写公开归属；rationale用中文概括机构为何投资；quote逐字复制机构或投资人原文。没有机构原话时返回空数组，不得用公司创始人、媒体或模型判断冒充。",
    "analysis.capital_judgment必须回答资本押注的核心变量、当前估值或融资所依赖的已验证信号，以及判断的证据边界；不得使用“知名机构参与表明看好”“商业化前景广阔”等空泛模板。validated_signals只写来源已验证的业务信号。risks至少一项，用于约束资本判断，不单独扩展成问题清单。",
    "related_direction_id只能从DIRECTION_OPTIONS选择；没有合适方向时返回空字符串。",
    "返回一个JSON对象，不要代码围栏。Schema:",
    JSON.stringify({
      company: {
        full_name: "string",
        website: "string",
        summary: "string",
        headquarters: "string",
        founders: [{ name: "string", role: "string", evidence_refs: [{ source_id: "string", quote: "string" }] }],
        team_size: { value: "string", observed_at: "YYYY-MM-DD|string", evidence_refs: [{ source_id: "string", quote: "string" }] },
        evidence_refs: [{ source_id: "string", quote: "string" }],
      },
      financing: {
        round: "string",
        amount: "string",
        total_raised: "string",
        announced_at: "YYYY-MM-DD|string",
        investors: [{ name: "string", role: "lead|participant|string", evidence_refs: [{ source_id: "string", quote: "string" }] }],
        evidence_refs: [{ source_id: "string", quote: "string" }],
      },
      products: [{
        name: "string",
        description: "string",
        target_customers: "string",
        features: ["string"],
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      customers: [{
        name: "string",
        industry: "string",
        use_case: "string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      comparisons: [{
        name: "string",
        product: "string",
        scenario: "string",
        target_customer: "string",
        funding_summary: "string",
        core_difference: "string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      metrics: [{
        label: "string",
        value: "string",
        observed_at: "YYYY-MM-DD|string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      quotes: [{
        speaker: "string",
        quote: "string",
        evidence_refs: [{ source_id: "string", quote: "string" }],
      }],
      analysis: {
        investment_rationale: [{
          institution: "string",
          speaker: "string",
          speaker_role: "string",
          rationale: "string",
          quote: "exact source quote",
          evidence_refs: [{ source_id: "string", quote: "string" }],
        }],
        capital_judgment: "string",
        validated_signals: ["string"],
        risks: ["string"],
        related_direction_id: "string",
        sector: "string",
      },
    }),
    `CANONICAL_FUNDING_EVENT:\n${JSON.stringify({
      event_id: event.event_id,
      title: event.display_title_zh,
      event_time: event.event_time,
      action: event.action,
      object: event.object,
      metrics: event.metrics,
      company_entity_id: company.entity_id,
      company_name: company.canonical_name,
    })}`,
    `DIRECTION_OPTIONS:\n${JSON.stringify(directions)}`,
    `CAPTURED_SOURCES:\n${sourceText}`,
  ].join("\n\n");
}

function publicSource(source) {
  return {
    source_id: source.source_id,
    source_url: source.source_url,
    title: source.title,
    publisher: source.publisher,
    source_class: source.source_class,
    capture_method: source.capture_method,
    captured_at: source.captured_at,
    content_hash: source.content_hash,
    source_artifact_id: source.source_artifact_id || null,
    raw_id: source.raw_id || null,
  };
}

function linkObject(kind, relationType, item, resolver) {
  const allowed = kind === "product" ? ["产品/服务"] : kind === "person" ? ["人物"] : ["公司/机构"];
  const resolved = resolver(item.name, allowed);
  return {
    relation_type: relationType,
    target_kind: kind,
    research_name: item.name,
    canonical_entity_id: resolved?.id || null,
    canonical_name: resolved?.name || "",
    evidence_refs: item.evidence_refs || [],
  };
}

function fundingHistory(companyId) {
  const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
  const seen = new Set();
  const history = [];
  for (const entry of fs.readdirSync(dataRoot, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d{4}-\d{2}-\d{2}$/u.test(entry.name)) continue;
    const events = readJson(path.join(dataRoot, entry.name, "canonical-events.json"), []);
    for (const event of events) {
      if (event.event_type !== "funding" || !(event.entities || []).includes(companyId) || seen.has(event.event_id)) continue;
      seen.add(event.event_id);
      history.push({
        event_id: event.event_id,
        date: String(event.event_time || event.disclosed_at || "").slice(0, 10),
        title: event.display_title_zh,
        amount: (event.metrics || [])[0] || "",
        source_refs: event.source_refs || [],
      });
    }
  }
  return history.sort((left, right) => right.date.localeCompare(left.date));
}

function buildCard(event, company, payload, sources, result, resolver) {
  const founders = (payload.company.founders || []).map((founder) => {
    const resolved = resolver(founder.name, ["人物"]);
    return { ...founder, entity_id: resolved?.id || null };
  });
  const investors = payload.financing.investors.map((investor) => {
    const resolved = resolver(investor.name, ["公司/机构"]);
    return { ...investor, entity_id: resolved?.id || null };
  });
  const products = payload.products.map((product) => {
    const resolved = resolver(product.name, ["产品/服务"]);
    return { ...product, entity_id: resolved?.id || null };
  });
  const entityLinks = [
    ...products.map((item) => linkObject("product", "product_of", item, resolver)),
    ...founders.map((item) => linkObject("person", "founded_by", item, resolver)),
    ...investors.map((item) => linkObject("organization", "invested_in_round", item, resolver)),
    ...(payload.customers || []).map((item) => linkObject("organization", "public_customer_case", item, resolver)),
    ...(payload.comparisons || []).map((item) => linkObject("organization", "compared_with", item, resolver)),
  ];
  const publishedAt = result.generatedAt;
  return {
    schema_version: FUNDING_INSIGHT_VERSION,
    funding_insight_id: stableId("FI", event.event_id),
    triggered_by_event_id: event.event_id,
    as_of_date: date,
    company: {
      entity_id: company.entity_id,
      name: company.canonical_name,
      full_name: payload.company.full_name,
      website: payload.company.website,
      summary: payload.company.summary,
      headquarters: payload.company.headquarters,
      founders,
      team_size: payload.company.team_size || {},
      evidence_refs: payload.company.evidence_refs,
    },
    financing: {
      round: payload.financing.round,
      amount: payload.financing.amount,
      total_raised: payload.financing.total_raised,
      announced_at: payload.financing.announced_at,
      investors,
      evidence_refs: payload.financing.evidence_refs,
    },
    products,
    customers: payload.customers || [],
    comparisons: payload.comparisons || [],
    metrics: payload.metrics || [],
    quotes: payload.quotes || [],
    analysis: payload.analysis,
    entity_links: entityLinks,
    funding_history: fundingHistory(company.entity_id),
    research_sources: sources.filter((source) => referencedSourceIds(payload).has(source.source_id)).map(publicSource),
    model_provenance: {
      provider: result.provider,
      model: result.model,
      attempts: result.attempts,
      prompt_version: FUNDING_INSIGHT_PROMPT_VERSION,
      generated_at: result.generatedAt,
    },
    auto_publish_gate: {
      passed: true,
      problems: [],
      gate_version: "FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.0",
    },
    publication_status: "auto_published",
    published_at: publishedAt,
  };
}

async function processEvent(bundle, event, entityIndex) {
  const company = subjectCompanyForEvent(event, bundle.entities);
  if (!company) return { event_id: event.event_id, status: "blocked", problems: ["subject_company_unresolved"] };
  const research = await researchSources(bundle, event, company);
  if (research.sources.length < 2) {
    return {
      event_id: event.event_id,
      company_name: company.canonical_name,
      status: "blocked",
      problems: ["research_sources_insufficient"],
      queries: research.queries,
      attempts: research.attempts,
    };
  }
  const directions = directionManifest();
  try {
    let acceptedPayload = null;
    const result = await deepSeekJsonCompletion({
      model,
      messages: [
        { role: "system", content: "输出严格受来源正文约束的融资项目研究JSON；事实必须逐项引用原文，缺失时留空。" },
        { role: "user", content: promptFor(event, company, research.sources, directions) },
      ],
      maxTokens: 9000,
      temperature: 0.1,
      timeoutMs: 180000,
      validate: (payload) => {
        acceptedPayload = sanitizeResearchPayload(payload, research.sources);
        ensureCanonicalFundingEvidence(acceptedPayload, bundle, event, research.sources);
        return researchPayloadProblems(acceptedPayload, research.sources, directions.map((item) => item.id));
      },
    });
    const payload = acceptedPayload || sanitizeResearchPayload(result.payload, research.sources);
    ensureCanonicalFundingEvidence(payload, bundle, event, research.sources);
    return {
      event_id: event.event_id,
      company_name: company.canonical_name,
      status: "auto_published",
      card: buildCard(event, company, payload, research.sources, result, entityResolver(entityIndex)),
      queries: research.queries,
      attempts: research.attempts,
    };
  } catch (error) {
    return {
      event_id: event.event_id,
      company_name: company.canonical_name,
      status: "blocked",
      problems: [clean(error.message)],
      queries: research.queries,
      attempts: research.attempts,
    };
  }
}

async function mapConcurrent(items, worker, size) {
  const outputItems = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      outputItems[index] = await worker(items[index]);
      console.log(JSON.stringify({
        progress: `${index + 1}/${items.length}`,
        event_id: items[index].event_id,
        status: outputItems[index].status,
      }));
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, Math.max(1, items.length)) }, run));
  return outputItems;
}

async function main() {
  if (!date) throw new Error("funding_insight_date_missing");
  if (!process.env.DEEPSEEK_API_KEY) throw new Error("deepseek_key_missing_for_funding_insight");
  if (!process.env.TAVILY_API_KEY && !process.env.EXA_API_KEY) throw new Error("funding_insight_search_provider_missing");
  const bundle = loadDailyBundle(root, date);
  const entityIndex = readJson(path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), {});
  const existing = readJson(output, { cards: [], queue: [] });
  const existingByEvent = new Map((existing.cards || []).map((card) => [card.triggered_by_event_id, card]));
  let eligibleEvents = bundle.events
    .filter((event) => event.event_type === "funding")
    .filter((event) => event.publication_status === "verified")
    .filter((event) => event.display_title_zh);
  const eligibleEventIds = new Set(eligibleEvents.map((event) => event.event_id));
  const missingEventIds = [...eventIds].filter((id) => !eligibleEventIds.has(id));
  if (missingEventIds.length) throw new Error(`funding_event_not_found:${missingEventIds.join(",")}`);
  let events = selectedOnly && eventIds.size
    ? eligibleEvents.filter((event) => eventIds.has(event.event_id))
    : eligibleEvents;
  let selectedEvents = eventIds.size
    ? events.filter((event) => eventIds.has(event.event_id))
    : events;
  if (limit) {
    selectedEvents = selectedEvents.slice(0, limit);
    if (selectedOnly) events = selectedEvents;
  }
  const pending = selectedEvents.filter((event) => force || !existingByEvent.has(event.event_id));
  if (!write) {
    console.log(JSON.stringify({
      ok: true,
      mode: "dry-run",
      date,
      eligible_funding_events: eligibleEvents.length,
      funding_events: events.length,
      selected_events: selectedEvents.length,
      reused: selectedEvents.length - pending.length,
      pending: pending.length,
      providers: {
        tavily: Boolean(process.env.TAVILY_API_KEY) && process.env.TAVILY_DISABLED !== "true",
        exa: Boolean(process.env.EXA_API_KEY),
        deepseek: Boolean(process.env.DEEPSEEK_API_KEY),
      },
    }, null, 2));
    return;
  }
  const results = await mapConcurrent(pending, (event) => processEvent(bundle, event, entityIndex), concurrency);
  for (const result of results) {
    if (result.card) existingByEvent.set(result.event_id, result.card);
    else if (force) existingByEvent.delete(result.event_id);
  }
  const queueByEvent = new Map((existing.queue || []).map((item) => [item.event_id, item]));
  for (const result of results) {
    queueByEvent.set(result.event_id, {
      event_id: result.event_id,
      company_name: result.company_name || "",
      status: result.status,
      problems: result.problems || [],
      queries: result.queries || [],
      attempts: result.attempts || [],
      updated_at: new Date().toISOString(),
    });
  }
  const cards = [...existingByEvent.values()]
    .filter((card) => events.some((event) => event.event_id === card.triggered_by_event_id))
    .filter((card) => fundingInsightProblems(card).length === 0)
    .sort((left, right) => right.published_at.localeCompare(left.published_at));
  const queue = events.map((event) => queueByEvent.get(event.event_id)
    || { event_id: event.event_id, company_name: "", status: "pending", problems: [], queries: [], attempts: [], updated_at: "" });
  const value = {
    meta: {
      schema_version: FUNDING_INSIGHT_VERSION,
      date,
      generated_at: new Date().toISOString(),
      trigger: "verified_daily_funding_events",
      research_provider: "tavily+exa+deepseek",
      model,
      human_review_required: false,
      auto_publish_gate: "FUNDING-INSIGHT-AUTO-PUBLISH-GATE-V1.0",
      counts: {
        funding_events: events.length,
        auto_published: cards.length,
        blocked: queue.filter((item) => item.status === "blocked").length,
        pending: queue.filter((item) => item.status === "pending").length,
      },
    },
    cards,
    queue,
  };
  writeJson(output, value);
  console.log(JSON.stringify({
    ok: true,
    output: path.relative(root, output).replace(/\\/gu, "/"),
    counts: value.meta.counts,
  }, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
