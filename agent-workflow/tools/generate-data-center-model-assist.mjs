#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { deepSeekJsonCompletion, deepSeekModels, sourceTextHash } from "./deepseek-translation-client.mjs";
import {
  MODEL_ASSIST_PROMPT_VERSION,
  candidateStore,
  readJson,
  stableModelAssistId,
  withGateResult,
  writeJson,
} from "./model-assist-v1.mjs";

const root = process.cwd();
const bundleRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const outputRoot = path.join(root, "01-SiteV2", "content", "11-databases", "model-assist-v1");
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const write = args.get("write") === "true";
const concurrency = Math.max(1, Number(args.get("concurrency") || 2));
const limit = Math.max(0, Number(args.get("limit") || 0));
const offset = Math.max(0, Number(args.get("offset") || 0));
const reuseExisting = args.get("reuse-existing") === "true";
const requestedTasks = new Set(String(args.get("tasks") || "claim_extraction,fde_enrichment,hardware_enrichment,entity_resolution,qa_repair").split(",").filter(Boolean));

function availableDates() {
  return fs.readdirSync(bundleRoot).filter((name) => /^\d{4}-\d{2}-\d{2}$/u.test(name)).sort();
}

function selectedDates() {
  const dates = availableDates();
  const exact = args.get("date");
  if (exact) return dates.filter((date) => date === exact);
  const from = args.get("from") || dates[0];
  const to = args.get("to") || dates.at(-1);
  return dates.filter((date) => date >= from && date <= to);
}

function bundle(date, name) {
  return readJson(path.join(bundleRoot, date, `${name}.json`), []);
}

function rawForEvent(event, rawByArtifact) {
  return (event?.source_refs || []).map((ref) => rawByArtifact.get(ref)).find(Boolean) || null;
}

function jobKey(job) {
  return [job.date, job.taskType, job.assetId, job.raw?.raw_id || ""].join("|");
}

function buildJobs(date) {
  const raws = bundle(date, "raw-documents");
  const claims = bundle(date, "claims");
  const events = bundle(date, "canonical-events");
  const fde = bundle(date, "fde-records");
  const hardware = bundle(date, "hardware-records");
  const qa = bundle(date, "qa-queue");
  const entities = bundle(date, "entities");
  const mentions = bundle(date, "entity-mentions");
  const rawById = new Map(raws.map((raw) => [raw.raw_id, raw]));
  const rawByArtifact = new Map(raws.map((raw) => [raw.source_artifact_id, raw]));
  const eventById = new Map(events.map((event) => [event.event_id, event]));
  const jobs = [];

  if (requestedTasks.has("claim_extraction") || requestedTasks.has("qa_repair")) {
    for (const item of qa) {
      const raw = rawById.get(item.asset_id);
      if (!raw || raw.extraction_status === "quarantined" || String(raw.body_clean || "").length < 300) continue;
      const actionLike = /\b(?:launch|release|raise|fund|deploy|partner|acquir|ship|appoint|join|leave|introduce|unveil|contract)\w*\b|发布|推出|融资|部署|合作|收购|出货|任命|加入|离职|合同/iu.test(`${raw.title_original}\n${String(raw.body_clean).slice(0, 1000)}`);
      if (requestedTasks.has("claim_extraction") && (item.reason === "no_source_bounded_claim" || (item.reason === "no_source_bounded_event" && actionLike))) {
        jobs.push({ date, taskType: "claim_extraction", assetId: item.qa_id, raw, sourceRef: raw.source_artifact_id, context: { qa_reason: item.reason } });
      } else if (requestedTasks.has("qa_repair") && ["event_not_ai_relevant", "public_event_title_incomplete"].includes(item.reason)) {
        jobs.push({ date, taskType: "qa_repair", assetId: item.qa_id, raw, sourceRef: raw.source_artifact_id, context: { qa_reason: item.reason } });
      }
    }
  }

  if (requestedTasks.has("fde_enrichment")) {
    for (const record of fde.filter((item) => item.undisclosed_fields?.length)) {
      const event = eventById.get(record.event_id);
      const raw = rawForEvent(event, rawByArtifact);
      if (raw) jobs.push({ date, taskType: "fde_enrichment", assetId: record.fde_id, raw, sourceRef: raw.source_artifact_id, context: { event, record, allowed_fields: record.undisclosed_fields } });
    }
  }

  if (requestedTasks.has("hardware_enrichment")) {
    for (const record of hardware) {
      const event = eventById.get(record.event_id);
      const raw = rawForEvent(event, rawByArtifact);
      const missing = ["component_type", "compute_layer", "manufacturing_stage", "process_node", "capacity", "capacity_unit", "supplier", "customer", "deployment_site", "region", "contract_value", "shipment_date"]
        .filter((field) => record[field] === "" || record[field] === null);
      if (raw && missing.length) jobs.push({ date, taskType: "hardware_enrichment", assetId: record.hardware_record_id, raw, sourceRef: raw.source_artifact_id, context: { event, record, allowed_fields: missing } });
    }
  }

  if (requestedTasks.has("entity_resolution")) {
    const mentionByEntity = new Map();
    for (const mention of mentions) if (!mentionByEntity.has(mention.entity_id)) mentionByEntity.set(mention.entity_id, mention);
    for (const entity of entities.filter((item) => item.verification_status === "candidate")) {
      const mention = mentionByEntity.get(entity.entity_id);
      const raw = rawById.get(mention?.raw_id);
      if (raw) jobs.push({ date, taskType: "entity_resolution", assetId: entity.entity_id, raw, sourceRef: raw.source_artifact_id, context: { entity, mention } });
    }
  }
  return [...new Map(jobs.map((job) => [jobKey(job), job])).values()];
}

function taskPrompt(job, excerpt) {
  const common = [
    "You are creating evidence-bounded candidates for an AI industry factual database.",
    "Use only the supplied source. Never infer an undisclosed fact, recommendation, importance, trend, or opportunity.",
    "Every proposed fact must copy one exact contiguous quote from SOURCE_TEXT. Return JSON only.",
  ];
  if (job.taskType === "claim_extraction") return [
    ...common,
    "Return {\"claims\":[{\"event_type\":string,\"subject\":string,\"object\":string,\"quote\":string}]}. Return at most 3 claims. Use only a concrete completed/planned commercial, policy, research, people, or hardware event; otherwise return an empty claims array.",
    `QA_REASON: ${job.context.qa_reason}`,
    `TITLE: ${job.raw.title_original}`,
    `SOURCE_TEXT:\n${excerpt}`,
  ].join("\n\n");
  if (["fde_enrichment", "hardware_enrichment"].includes(job.taskType)) return [
    ...common,
    `Return {\"fields\":[{\"field\":string,\"value\":string|number|array,\"quote\":string}]}. Only use these missing fields: ${job.context.allowed_fields.join(", ")}. Omit every field not explicitly disclosed.`,
    `CURRENT_RECORD: ${JSON.stringify(job.context.record)}`,
    `TITLE: ${job.raw.title_original}`,
    `SOURCE_TEXT:\n${excerpt}`,
  ].join("\n\n");
  if (job.taskType === "entity_resolution") return [
    ...common,
    "Return {\"decision\":\"same_entity\"|\"distinct_entity\"|\"publisher_of\"|\"component_supplier\"|\"unknown\",\"canonical_name\":string,\"rationale\":string,\"quote\":string}. This is advisory and will require review.",
    `ENTITY_CANDIDATE: ${JSON.stringify(job.context.entity)}`,
    `TITLE: ${job.raw.title_original}`,
    `SOURCE_TEXT:\n${excerpt}`,
  ].join("\n\n");
  return [
    ...common,
    "Return {\"action\":\"keep_qa\"|\"recollect_original\"|\"repair_title\"|\"extract_claim\",\"reason\":string,\"quote\":string}. This is advisory and cannot close QA.",
    `QA_REASON: ${job.context.qa_reason}`,
    `TITLE: ${job.raw.title_original}`,
    `SOURCE_TEXT:\n${excerpt}`,
  ].join("\n\n");
}

function outputProblems(taskType, payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return ["response_must_be_object"];
  if (taskType === "claim_extraction") return Array.isArray(payload.claims) ? [] : ["claims_must_be_array"];
  if (["fde_enrichment", "hardware_enrichment"].includes(taskType)) return Array.isArray(payload.fields) ? [] : ["fields_must_be_array"];
  if (taskType === "entity_resolution") return payload.decision && payload.quote ? [] : ["entity_decision_incomplete"];
  return payload.action && payload.quote ? [] : ["qa_suggestion_incomplete"];
}

function normalizePayload(job, payload, body) {
  const rows = job.taskType === "claim_extraction" ? payload.claims
    : ["fde_enrichment", "hardware_enrichment"].includes(job.taskType) ? payload.fields
      : [payload];
  const evidence = [];
  const evidenceIndex = new Map();
  for (const row of rows || []) {
    const quote = String(row?.quote || "").trim();
    if (!quote) continue;
    const start = body.indexOf(quote);
    if (start < 0) continue;
    if (!evidenceIndex.has(quote)) {
      evidenceIndex.set(quote, evidence.length);
      evidence.push({ start, end: start + quote.length, quote });
    }
  }
  if (job.taskType === "claim_extraction") {
    return { proposal: { claims: (payload.claims || []).filter((row) => evidenceIndex.has(String(row.quote || "").trim())).map(({ quote, ...row }) => ({ ...row, evidence_index: evidenceIndex.get(String(quote).trim()) })) }, evidence };
  }
  if (["fde_enrichment", "hardware_enrichment"].includes(job.taskType)) {
    return { proposal: { fields: (payload.fields || []).filter((row) => evidenceIndex.has(String(row.quote || "").trim())).map(({ quote, ...row }) => ({ ...row, evidence_index: evidenceIndex.get(String(quote).trim()) })) }, evidence };
  }
  const { quote, ...proposal } = payload;
  if (job.taskType === "entity_resolution") proposal.candidate_name = job.context.entity.canonical_name;
  return { proposal, evidence };
}

async function generate(job) {
  const body = String(job.raw.body_clean || "");
  const excerpt = body.slice(0, Number(process.env.MODEL_ASSIST_MAX_SOURCE_CHARS || 16000));
  const result = await deepSeekJsonCompletion({
    model: deepSeekModels().pro,
    messages: [{ role: "user", content: taskPrompt(job, excerpt) }],
    maxTokens: 3000,
    timeoutMs: Number(process.env.MODEL_ASSIST_TIMEOUT_MS || 90000),
    validate: (payload) => outputProblems(job.taskType, payload),
  });
  const normalized = normalizePayload(job, result.payload, body);
  const candidate = {
    candidate_id: stableModelAssistId(job.date, job.taskType, job.assetId, sourceTextHash(body), MODEL_ASSIST_PROMPT_VERSION),
    task_type: job.taskType,
    asset_id: job.assetId,
    raw_id: job.raw.raw_id,
    source_ref: job.sourceRef,
    source_hash: sourceTextHash(body),
    provider: result.provider,
    model: result.model,
    prompt_version: MODEL_ASSIST_PROMPT_VERSION,
    status: "pending",
    proposal: normalized.proposal,
    evidence: normalized.evidence,
    gate_results: [],
    generated_at: result.generatedAt,
  };
  return withGateResult(candidate, body);
}

async function mapConcurrent(items, worker, size) {
  const output = new Array(items.length);
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index++;
      try { output[current] = await worker(items[current]); }
      catch (error) { output[current] = { error: error.message, job: items[current] }; }
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, Math.max(1, items.length)) }, run));
  return output;
}

async function main() {
  const dates = selectedDates();
  const rawDocumentsScanned = dates.reduce((sum, item) => sum + bundle(item, "raw-documents").length, 0);
  let jobs = dates.flatMap(buildJobs).sort((a, b) => jobKey(a).localeCompare(jobKey(b)));
  const scannedJobs = jobs.length;
  if (reuseExisting) {
    const existingCandidateIds = new Set(dates.flatMap((date) => {
      const store = readJson(path.join(outputRoot, `${date}.json`), candidateStore(date));
      return (store.candidates || []).map((candidate) => candidate.candidate_id);
    }));
    jobs = jobs.filter((job) => !existingCandidateIds.has(stableModelAssistId(
      job.date,
      job.taskType,
      job.assetId,
      sourceTextHash(String(job.raw.body_clean || "")),
      MODEL_ASSIST_PROMPT_VERSION,
    )));
  }
  const reusedJobs = scannedJobs - jobs.length;
  jobs = jobs.slice(offset, limit ? offset + limit : undefined);
  if (!write) {
    console.log(JSON.stringify({ ok: true, mode: "dry-run", dates: dates.length, raw_documents_scanned: rawDocumentsScanned, scanned_jobs: scannedJobs, reused_jobs: reusedJobs, selected_jobs: jobs.length, by_task: Object.fromEntries([...requestedTasks].map((task) => [task, jobs.filter((job) => job.taskType === task).length])) }, null, 2));
    return;
  }
  if (jobs.length && !process.env.DEEPSEEK_API_KEY) throw new Error("deepseek_key_missing_for_required_model_task");
  const results = await mapConcurrent(jobs, generate, concurrency);
  for (let retry = 0; retry < 2; retry += 1) {
    const failedIndexes = results.map((result, index) => result?.error ? index : -1).filter((index) => index >= 0);
    if (!failedIndexes.length) break;
    const retried = await mapConcurrent(failedIndexes.map((index) => jobs[index]), generate, Math.max(1, Math.floor(concurrency / 2)));
    for (const [position, result] of retried.entries()) results[failedIndexes[position]] = result;
  }
  const failures = results.filter((result) => result?.error);
  const byDate = new Map();
  for (const [index, candidate] of results.entries()) {
    if (candidate?.error) continue;
    const job = jobs[index];
    if (!byDate.has(job.date)) byDate.set(job.date, []);
    byDate.get(job.date).push(candidate);
  }
  for (const date of dates) {
    const file = path.join(outputRoot, `${date}.json`);
    const previous = readJson(file, candidateStore(date));
    const generated = byDate.get(date) || [];
    if (reuseExisting && !generated.length && fs.existsSync(file)) continue;
    const merged = new Map((previous.candidates || []).map((candidate) => [candidate.candidate_id, candidate]));
    for (const candidate of generated) {
      const existing = merged.get(candidate.candidate_id);
      merged.set(candidate.candidate_id, existing?.review ? existing : candidate);
    }
    writeJson(file, candidateStore(date, [...merged.values()].sort((a, b) => a.candidate_id.localeCompare(b.candidate_id)), { sourceCount: bundle(date, "raw-documents").length }));
  }
  const checkpoint = {
    schema_version: MODEL_ASSIST_PROMPT_VERSION,
    generated_at: new Date().toISOString(),
    dates,
    raw_documents_scanned: rawDocumentsScanned,
    scanned_jobs: scannedJobs,
    reuse_existing: reuseExisting,
    reused_jobs: reusedJobs,
    offset,
    selected_jobs: jobs.length,
    completed: results.length - failures.length,
    failures: failures.map((failure) => ({ date: failure.job.date, task_type: failure.job.taskType, asset_id: failure.job.assetId, error: failure.error })),
  };
  writeJson(path.join(outputRoot, "checkpoint.json"), checkpoint);
  console.log(JSON.stringify({ ok: !failures.length, ...checkpoint }, null, 2));
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
