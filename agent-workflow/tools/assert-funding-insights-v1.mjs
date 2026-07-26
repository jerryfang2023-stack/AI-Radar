#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  FUNDING_INSIGHT_VERSION,
  fundingInsightProblems,
  latestDataDate,
  readJson,
} from "./funding-insight-v1-utils.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || latestDataDate(root);
const input = path.resolve(args.get("input")
  || path.join(root, "01-SiteV2/content/12-applications/funding-insights", `${date}.json`));
const schemaFile = path.join(root, "agent-workflow/product/funding-insight-v1.schema.json");

function main() {
  const data = readJson(input);
  if (!data) throw new Error(`funding_insight_bundle_missing:${input}`);
  const schema = readJson(schemaFile);
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const problems = [];
  if (data.meta?.schema_version !== FUNDING_INSIGHT_VERSION) problems.push("bundle_schema_version_invalid");
  if (data.meta?.human_review_required !== false) problems.push("automatic_publication_contract_missing");
  if (!Array.isArray(data.cards) || !Array.isArray(data.queue)) problems.push("bundle_arrays_missing");
  const seenEvents = new Set();
  for (const card of data.cards || []) {
    if (!validate(card)) {
      problems.push(`${card.funding_insight_id || "unknown"}:schema:${ajv.errorsText(validate.errors)}`);
    }
    for (const item of fundingInsightProblems(card)) problems.push(`${card.funding_insight_id || "unknown"}:${item}`);
    if (seenEvents.has(card.triggered_by_event_id)) problems.push(`${card.triggered_by_event_id}:duplicate_published_card`);
    seenEvents.add(card.triggered_by_event_id);
    const sourceIds = new Set((card.research_sources || []).map((source) => source.source_id));
    const evidenceGroups = [
      card.company?.evidence_refs,
      card.financing?.evidence_refs,
      ...(card.financing?.investors || []).map((item) => item.evidence_refs),
      ...(card.products || []).map((item) => item.evidence_refs),
      ...(card.customers || []).map((item) => item.evidence_refs),
      ...(card.comparisons || []).map((item) => item.evidence_refs),
      ...(card.metrics || []).map((item) => item.evidence_refs),
    ];
    for (const evidence of evidenceGroups.flat().filter(Boolean)) {
      if (!sourceIds.has(evidence.source_id)) problems.push(`${card.funding_insight_id}:evidence_source_unresolved:${evidence.source_id}`);
      if (!String(evidence.quote || "").trim()) problems.push(`${card.funding_insight_id}:evidence_quote_missing`);
    }
  }
  for (const queueItem of data.queue || []) {
    if (!["auto_published", "blocked", "pending"].includes(queueItem.status)) {
      problems.push(`${queueItem.event_id || "unknown"}:queue_status_invalid`);
    }
    if (queueItem.status === "auto_published" && !seenEvents.has(queueItem.event_id)) {
      problems.push(`${queueItem.event_id}:published_queue_without_card`);
    }
  }
  if (problems.length) {
    console.error(JSON.stringify({ ok: false, input, problems }, null, 2));
    process.exit(1);
  }
  console.log(JSON.stringify({
    ok: true,
    input: path.relative(root, input).replace(/\\/gu, "/"),
    date,
    cards: data.cards.length,
    blocked: data.queue.filter((item) => item.status === "blocked").length,
  }, null, 2));
}

main();
