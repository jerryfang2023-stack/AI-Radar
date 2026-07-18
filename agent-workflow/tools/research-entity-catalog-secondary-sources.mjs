#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { deepSeekJsonCompletion, deepSeekModels, sourceTextHash } from "./deepseek-translation-client.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const inputPath = path.resolve(root, args.get("input") || "agent-workflow/reports/entity-catalog-deepseek-audit-phase2.json");
const outputPath = path.resolve(root, args.get("output") || "agent-workflow/reports/entity-catalog-secondary-search.json");
const write = args.get("write") === "true";
const reuseExisting = args.get("reuse-existing") === "true";
const concurrency = Math.max(1, Math.min(6, Number(args.get("concurrency") || 3)));
const limit = Math.max(0, Number(args.get("limit") || 0));
const selectedDecisions = new Set(String(args.get("decisions") || "requires_review,insufficient_evidence").split(",").filter(Boolean));
const correctionConfidenceBelow = Math.max(0, Math.min(1, Number(args.get("correction-confidence-below") || 0)));
const model = process.env.DEEPSEEK_PRO_MODEL || process.env.DEEPSEEK_MODEL || deepSeekModels().pro;
const promptVersion = "ENTITY-SECONDARY-SEARCH-V1.0";
if (!process.env.DEEPSEEK_PRO_MODEL) process.env.DEEPSEEK_PRO_MODEL = model;

function readJson(file, fallback = null) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}

function redactSensitiveText(value = "") {
  return String(value || "")
    .replace(/\bLTAI[A-Za-z0-9]{12,24}\b/gu, "[REDACTED_ALIBABA_ACCESS_KEY_ID]")
    .replace(/([?&](?:OSSAccessKeyId|Signature|X-Amz-Credential|X-Amz-Signature)=)[^&#\s)]+/giu, "$1[REDACTED]")
    .replace(/\bsk-[a-f0-9]{32,}\b/gu, "[REDACTED_API_KEY]");
}

function redactSensitiveValues(value) {
  if (typeof value === "string") return redactSensitiveText(value);
  if (Array.isArray(value)) return value.map(redactSensitiveValues);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, redactSensitiveValues(item)]));
  }
  return value;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(redactSensitiveValues(value), null, 2)}\n`, "utf8");
}

function clean(value = "") {
  return redactSensitiveText(value).replace(/\s+/gu, " ").trim();
}

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
  try { return new URL(url).hostname.replace(/^www\./u, "").toLowerCase(); }
  catch { return ""; }
}

const secondaryDomains = /(?:^|\.)(?:techcrunch\.com|theverge\.com|reuters\.com|bloomberg\.com|forbes\.com|wikipedia\.org|linkedin\.com|facebook\.com|x\.com|twitter\.com|youtube\.com|reddit\.com|medium\.com|businesswire\.com|prnewswire\.com|globenewswire\.com|ithome\.com|36kr\.com|sohu\.com|sina\.com\.cn|qq\.com|163\.com)$/iu;

function sourceClass(result, item) {
  const host = hostFor(result.url);
  if (!host || secondaryDomains.test(host)) return "secondary";
  const names = [item.current_name, item.proposed_name, ...(item.current_company_names || []), ...(item.proposed_company_names || [])]
    .map((value) => clean(value).toLowerCase()).filter((value) => value.length >= 3);
  const hostKey = host.replace(/[^a-z0-9]/gu, "");
  const domainMatch = names.map((name) => name.replace(/[^a-z0-9]/gu, "")).filter((name) => name.length >= 4)
    .some((name) => hostKey.includes(name) || name.includes(host.split(".")[0].replace(/[^a-z0-9]/gu, "")));
  const githubPathMatch = host === "github.com" && names.some((name) => result.url.toLowerCase().includes(name.replace(/\s+/gu, "-")) || result.url.toLowerCase().includes(name.replace(/\s+/gu, "")));
  return domainMatch || githubPathMatch ? "official_candidate" : "unknown";
}

function scoreResult(result, item) {
  const text = clean(`${result.title} ${result.url} ${result.snippet}`).toLowerCase();
  const names = [item.current_name, item.proposed_name, ...(item.current_company_names || []), ...(item.proposed_company_names || [])]
    .map((value) => clean(value).toLowerCase()).filter(Boolean);
  let score = sourceClass(result, item) === "official_candidate" ? 8 : sourceClass(result, item) === "secondary" ? 1 : 3;
  for (const name of names) if (text.includes(name)) score += 2;
  if (/\b(?:about|company|product|products|documentation|docs|blog|news|press|launch|release|team)\b/iu.test(text)) score += 2;
  return score;
}

function queriesFor(item) {
  const name = item.current_name.replace(/"/gu, "");
  const company = clean((item.current_company_names || []).join(" "));
  const typeIntent = item.catalog_type === "company" ? "official company organization about" : "official product model service developed by";
  return [
    `"${name}" ${typeIntent}`,
    company ? `"${name}" "${company}" official` : `"${name}" official launch release company`,
  ];
}

async function searchTavily(query, item) {
  if (!process.env.TAVILY_API_KEY) return [];
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { authorization: `Bearer ${process.env.TAVILY_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ query, topic: "general", search_depth: "advanced", max_results: 6, include_answer: false, include_raw_content: true }),
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`tavily_${response.status}`);
  const data = await response.json();
  return (data.results || []).map((result) => ({
    provider: "tavily",
    title: clean(result.title),
    url: clean(result.url),
    snippet: clean(result.content),
    provider_body: clean(result.raw_content),
    source_class: sourceClass(result, item),
  })).filter((result) => result.url);
}

async function searchExa(query, item) {
  if (!process.env.EXA_API_KEY) return [];
  const response = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: { "x-api-key": process.env.EXA_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ query, type: "auto", numResults: 6, contents: { highlights: { numSentences: 3, highlightsPerUrl: 1 }, text: false } }),
    signal: AbortSignal.timeout(45000),
  });
  if (!response.ok) throw new Error(`exa_${response.status}`);
  const data = await response.json();
  return (data.results || []).map((result) => ({
    provider: "exa",
    title: clean(result.title),
    url: clean(result.url),
    snippet: clean((result.highlights || []).join(" ")),
    provider_body: "",
    source_class: sourceClass(result, item),
  })).filter((result) => result.url);
}

async function capturePage(result) {
  let body = "";
  let method = "";
  let title = result.title;
  try {
    const response = await fetch(result.url, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; WaveSightEntityReview/1.0; +https://github.com/jerryfang2023-stack/AI-Radar)" },
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
  if (body.length < 200 && result.provider_body.length >= 200) {
    body = result.provider_body;
    method = "tavily_raw_content";
  }
  if (body.length < 200) return null;
  return {
    source_id: `SRC-${sourceTextHash(result.url)}`,
    source_url: result.url,
    title,
    source_class: result.source_class,
    capture_method: method,
    captured_at: new Date().toISOString(),
    content_hash: sourceTextHash(body),
    body_clean: body.slice(0, 24000),
  };
}

function promptFor(item, sources) {
  const sourceText = sources.map((source) => [
    `SOURCE_ID: ${source.source_id}`,
    `SOURCE_URL: ${source.source_url}`,
    `SOURCE_CLASS: ${source.source_class}`,
    `TITLE: ${source.title}`,
    `BODY: ${source.body_clean}`,
  ].join("\n")).join("\n\n---\n\n");
  return [
    "Audit one entity catalog row using only the captured source bodies below. Search snippets are not evidence.",
    "Company means an organization or institution. Product includes models, services, platforms, tools, reports, features, and hardware. Use person for a person and other for an article fragment, event, or non-entity.",
    "A product-company mapping requires explicit developed by, launched by, published by, manufactured by, operated by, or ownership language. Integration, compatibility, hosting, availability, comparison, and event co-occurrence do not prove ownership.",
    "Prefer an official source. If no official source exists, cite two independent captured secondary sources for confirmed or correction_candidate.",
    "Return concise Simplified Chinese rationale and one JSON object only.",
    "Schema: {\"decision\":\"confirmed\"|\"correction_candidate\"|\"requires_review\"|\"insufficient_evidence\",\"proposed_name\":string,\"proposed_catalog_type\":\"company\"|\"product\"|\"person\"|\"other\"|\"\",\"proposed_company_names\":string[],\"issue_fields\":(\"name\"|\"type\"|\"company\"|\"duplicate\"|\"evidence\")[],\"confidence\":number,\"evidence\":[{\"source_id\":string,\"quote\":string}],\"rationale\":string}",
    `CURRENT_ROW: ${JSON.stringify({ entity_id: item.entity_id, catalog_type: item.catalog_type, name: item.current_name, company_names: item.current_company_names, previous_decision: item.decision, previous_rationale: item.rationale })}`,
    `CAPTURED_SOURCES:\n${sourceText}`,
  ].join("\n\n");
}

function sameSet(left = [], right = []) {
  const normalized = (values) => [...new Set((values || []).map(clean).filter(Boolean))].sort();
  return JSON.stringify(normalized(left)) === JSON.stringify(normalized(right));
}

function validateReview(item, sources, payload) {
  const problems = [];
  const allowedDecisions = new Set(["confirmed", "correction_candidate", "requires_review", "insufficient_evidence"]);
  const allowedTypes = new Set(["company", "product", "person", "other", ""]);
  const allowedIssues = new Set(["name", "type", "company", "duplicate", "evidence"]);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return ["response_must_be_object"];
  if (!allowedDecisions.has(payload.decision)) problems.push("invalid_decision");
  if (!allowedTypes.has(payload.proposed_catalog_type)) problems.push("invalid_type");
  if (!Array.isArray(payload.proposed_company_names)) problems.push("companies_must_be_array");
  if (!Array.isArray(payload.issue_fields) || payload.issue_fields.some((value) => !allowedIssues.has(value))) problems.push("invalid_issues");
  if (!Number.isFinite(payload.confidence) || payload.confidence < 0 || payload.confidence > 1) problems.push("invalid_confidence");
  if (!Array.isArray(payload.evidence)) problems.push("evidence_must_be_array");
  const sourceById = new Map(sources.map((source) => [source.source_id, source]));
  for (const evidence of payload.evidence || []) {
    const source = sourceById.get(evidence?.source_id);
    if (!source) problems.push(`unknown_source:${evidence?.source_id || ""}`);
    else if (!clean(evidence.quote) || !source.body_clean.includes(clean(evidence.quote))) problems.push(`quote_mismatch:${evidence.source_id}`);
  }
  if (payload.decision === "insufficient_evidence" && (payload.evidence || []).length) problems.push("insufficient_must_not_cite");
  if (["confirmed", "correction_candidate"].includes(payload.decision) && !(payload.evidence || []).length) problems.push("decision_requires_evidence");
  if (["confirmed", "correction_candidate"].includes(payload.decision)) {
    const cited = [...new Set((payload.evidence || []).map((evidence) => evidence.source_id))].map((id) => sourceById.get(id)).filter(Boolean);
    if (!cited.some((source) => source.source_class === "official_candidate") && cited.length < 2) problems.push("nonofficial_requires_two_sources");
  }
  if (payload.decision === "confirmed") {
    if (clean(payload.proposed_name) !== item.current_name) problems.push("confirmed_name_changed");
    if (payload.proposed_catalog_type !== item.catalog_type) problems.push("confirmed_type_changed");
    if (!sameSet(payload.proposed_company_names, item.current_company_names)) problems.push("confirmed_companies_changed");
    if (payload.issue_fields.length) problems.push("confirmed_has_issues");
  }
  if (!clean(payload.rationale)) problems.push("missing_rationale");
  return [...new Set(problems)];
}

async function reviewItem(item) {
  const queries = queriesFor(item);
  const attempts = [];
  const results = [];
  for (const query of queries) {
    const settled = await Promise.allSettled([searchTavily(query, item), searchExa(query, item)]);
    for (const [index, outcome] of settled.entries()) {
      const provider = index === 0 ? "tavily" : "exa";
      attempts.push({ provider, query, status: outcome.status === "fulfilled" ? "completed" : "failed", error: outcome.status === "rejected" ? clean(outcome.reason?.message) : "" });
      if (outcome.status === "fulfilled") results.push(...outcome.value);
    }
  }
  const deduped = new Map();
  for (const result of results) {
    const key = result.url.replace(/[?#].*$/u, "").replace(/\/$/u, "").toLowerCase();
    if (!deduped.has(key) || scoreResult(result, item) > scoreResult(deduped.get(key), item)) deduped.set(key, result);
  }
  const candidates = [...deduped.values()].sort((left, right) => scoreResult(right, item) - scoreResult(left, item)).slice(0, 8);
  const captured = [];
  for (const candidate of candidates) {
    if (captured.length >= 4) break;
    const source = await capturePage(candidate);
    if (source) captured.push(source);
  }
  if (!captured.length) {
    return { entity_id: item.entity_id, current_name: item.current_name, catalog_type: item.catalog_type, previous_decision: item.decision, queries, attempts, candidates, sources: [], decision: "insufficient_evidence", proposed_name: "", proposed_catalog_type: "", proposed_company_names: [], issue_fields: ["evidence"], confidence: 0, evidence: [], rationale: "二次检索未能抓取可审计的原始页面。", status: "search_exhausted_requires_review" };
  }
  let result;
  try {
    result = await deepSeekJsonCompletion({
      model,
      messages: [{ role: "user", content: promptFor(item, captured) }],
      maxTokens: 2600,
      timeoutMs: 120000,
      validate: (payload) => validateReview(item, captured, payload),
    });
  } catch (error) {
    return {
      entity_id: item.entity_id,
      current_name: item.current_name,
      catalog_type: item.catalog_type,
      current_company_names: item.current_company_names,
      previous_decision: item.decision,
      queries,
      attempts,
      candidates,
      sources: captured,
      decision: "requires_review",
      proposed_name: "",
      proposed_catalog_type: "",
      proposed_company_names: [],
      issue_fields: ["evidence"],
      confidence: 0,
      evidence: [],
      rationale: "已完成二次检索并抓取原始页面，但模型引文或结构未通过质量校验，不能自动确认。",
      provider: "deepseek",
      model,
      prompt_version: promptVersion,
      generated_at: new Date().toISOString(),
      status: "search_exhausted_requires_review",
      model_error: clean(error.message)
    };
  }
  return {
    entity_id: item.entity_id,
    current_name: item.current_name,
    catalog_type: item.catalog_type,
    current_company_names: item.current_company_names,
    previous_decision: item.decision,
    queries,
    attempts,
    candidates,
    sources: captured,
    ...result.payload,
    provider: result.provider,
    model: result.model,
    prompt_version: promptVersion,
    generated_at: result.generatedAt,
    status: ["confirmed", "correction_candidate"].includes(result.payload.decision) ? "pending_explicit_review" : "search_exhausted_requires_review",
  };
}

async function mapConcurrent(items, worker, size, settled) {
  const output = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      try { output[index] = await worker(items[index]); }
      catch (error) { output[index] = { entity_id: items[index].entity_id, error: clean(error.message) }; }
      await settled(output[index], index);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, Math.max(1, items.length)) }, run));
  return output;
}

function reportFor(input, reviews, failures) {
  const decisions = ["confirmed", "correction_candidate", "requires_review", "insufficient_evidence"];
  return {
    meta: { schema_version: promptVersion, generated_at: new Date().toISOString(), input: path.relative(root, inputPath).replace(/\\/gu, "/"), provider: "tavily+exa+deepseek", model, canonical_write_performed: false },
    summary: { selected: reviews.length + failures.length, completed: reviews.length, failures: failures.length, by_decision: Object.fromEntries(decisions.map((decision) => [decision, reviews.filter((review) => review.decision === decision).length])) },
    reviews: reviews.sort((left, right) => left.current_name.localeCompare(right.current_name) || left.entity_id.localeCompare(right.entity_id)),
    failures,
  };
}

async function main() {
  const input = readJson(inputPath);
  if (!input?.reviews) throw new Error("phase2_audit_missing");
  const existing = reuseExisting ? readJson(outputPath, { reviews: [] }) : { reviews: [] };
  const reviewById = new Map((existing.reviews || []).map((review) => [review.entity_id, review]));
  let selected = input.reviews.filter((review) => selectedDecisions.has(review.decision)
    || (review.decision === "correction_candidate" && correctionConfidenceBelow > 0 && review.confidence < correctionConfidenceBelow));
  if (limit) selected = selected.slice(0, limit);
  const pending = selected.filter((review) => !reviewById.has(review.entity_id));
  if (!write) {
    console.log(JSON.stringify({ ok: true, mode: "dry-run", selected: selected.length, reused: selected.length - pending.length, pending: pending.length, concurrency, providers: { tavily: Boolean(process.env.TAVILY_API_KEY), exa: Boolean(process.env.EXA_API_KEY), deepseek: Boolean(process.env.DEEPSEEK_API_KEY) } }, null, 2));
    return;
  }
  const failures = [];
  let completed = 0;
  await mapConcurrent(pending, reviewItem, concurrency, async (result) => {
    completed += 1;
    if (result.error) failures.push(result); else reviewById.set(result.entity_id, result);
    const report = reportFor(input, [...reviewById.values()], failures);
    writeJson(outputPath, report);
    console.log(JSON.stringify({ progress: `${completed}/${pending.length}`, completed: report.summary.completed, failures: report.summary.failures }));
  });
  const report = reportFor(input, [...reviewById.values()], failures);
  writeJson(outputPath, report);
  console.log(JSON.stringify({ ok: !failures.length, output: path.relative(root, outputPath).replace(/\\/gu, "/"), summary: report.summary }, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
