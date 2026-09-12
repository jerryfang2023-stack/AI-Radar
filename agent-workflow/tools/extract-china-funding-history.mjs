#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { codexExtractionCompletion } from "./codex-extraction-client.mjs";
import { hydrateRawDocument, loadPrivateEvidenceRecord } from "./lib/private-evidence-store.mjs";
import { historicalFundingAuthorized, eventSourceEligibility } from "./build-data-center-v4.mjs";
import { sourceTextHash } from "./deepseek-translation-client.mjs";
import { candidateStore, stableModelAssistId, withGateResult } from "./model-assist-v1.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => arg.replace(/^--/u, "").split("=")));
const date = args.get("date") || "2026-09-12";
const base = path.join(root, "01-SiteV2/content/11-databases/data-center-v4", date);
const read = (file, fallback) => fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(`${file}.tmp`, JSON.stringify(value, null, 2) + "\n"); fs.renameSync(`${file}.tmp`, file); };
const policy = read(path.join(base, "historical-funding-authorization.json"), {});
if (!policy.source_refs?.length) throw new Error("Explicit source authorization required");
const refs = new Set(policy.source_refs);
const lane = path.join(root, "agent-workflow/reports/china-funding-history", `${policy.from}_${policy.to}`);
const outputFile = path.join(root, "01-SiteV2/content/11-databases/model-assist-v1", `${date}.json`);
const outcomeFile = path.join(lane, "extraction-coverage.json");
const outcomes = new Map((read(outcomeFile, {}).items || []).map((item) => [item.raw_id, item]));
const raws = read(path.join(base, "raw-documents.json"), []).filter((raw) => refs.has(raw.source_artifact_id));
const jobs = [];
const promptVersion = "china-funding-history-2026-09-12.1";
for (const raw of raws) {
  const original = loadPrivateEvidenceRecord(root, raw.body_ref, raw.content_hash);
  const prior = outcomes.get(raw.raw_id);
  if (prior?.content_hash === raw.content_hash && prior.prompt_version === promptVersion && !["failed", "source_blocked"].includes(prior.status)) continue;
  // The V4 reader may recover an explicit visible source byline offline.
  const source = { ...original.raw, published_at: raw.published_at };
  const eligible = eventSourceEligibility(source, { source_artifact_id: raw.source_artifact_id, source_url: raw.source_url }, raw.title_original, date, { eventType: "funding", allowHistoricalFunding: historicalFundingAuthorized(source, { source_artifact_id: raw.source_artifact_id }, policy) });
  if (!eligible.accepted) { outcomes.set(raw.raw_id, { raw_id: raw.raw_id, source_ref: raw.source_artifact_id, content_hash: raw.content_hash, status: "source_blocked", reason: eligible.reason, prompt_version: promptVersion }); continue; }
  jobs.push(hydrateRawDocument(root, raw));
}
const persist = () => write(outcomeFile, { schema_version: "CHINA-FUNDING-EXTRACTION-COVERAGE-V1.0", from: policy.from, to: policy.to, model: "gpt-5.6-terra", generated_at: new Date().toISOString(), source_count: raws.length, items: [...outcomes.values()] });
persist();
const batches = [];
const batchSize = Math.max(1, Math.min(4, Number(args.get("batch-size") || 4)));
for (let i = 0; i < jobs.length; i += batchSize) batches.push(jobs.slice(i, i + batchSize));
console.log(JSON.stringify({ authorized_sources: raws.length, extraction_sources: jobs.length, batches: batches.length, reused_or_blocked: raws.length - jobs.length }));
let cursor = 0;
await Promise.all(Array.from({ length: 2 }, async () => {
  while (cursor < batches.length) {
    const batch = batches[cursor++];
    try {
      const result = await codexExtractionCompletion({ timeoutMs: 180000, messages: [{ role: "user", content: [
        'Extract completed AI-company financing announcements from each supplied article independently. Return {"articles":[{"raw_id":string,"disposition":"funding"|"not_single_funding"|"not_ai"|"insufficient_evidence","reason":string,"claims":[{"event_type":"funding","subject":string,"object":string,"quote":string}]}]}. Include exactly one result per raw_id.',
        'Use only supplied source text, never search snippets or model memory. Each quote must be an EXACT CONTIGUOUS substring, no ellipses. No inferred numeric facts, investors, dates or country. Subject is the actual recipient company copied from the quote, never investors, round counts or headline descriptors. Object is a concise exact-source financing description. Keep original numbers/units. At most 3 claims per article, ALL about the SAME recipient and same discrete round. Prefer one quote spanning the financing and AI product description; additional evidence may establish that recipient’s AI business. Quotes can be up to 1600 characters.',
        'Reject fundraising plans, rumors, IPO/LP fundraising, investment indices and multi-company roundups. Do not turn cumulative funding across different rounds into one round. Phased closes of a single explicitly named round are allowed. Do not equate Chinese-language source with Chinese company. Return empty claims for non-funding/insufficient evidence. Main-subject financing must be explicitly completed/announced; incidental old financings in an editorial are not a new event.',
        ...batch.map((raw) => `RAW_ID: ${raw.raw_id}\nTITLE: ${raw.title_original}\nPUBLICATION_DATE: ${raw.published_at}\nSOURCE_TEXT:\n${raw.body_clean.slice(0, 14000)}`),
      ].join("\n\n") }], validate: (payload) => Array.isArray(payload.articles) && payload.articles.length === batch.length && batch.every((raw) => payload.articles.filter((item) => item.raw_id === raw.raw_id && Array.isArray(item.claims)).length === 1) ? [] : ["source_result_mapping_invalid"] });
      const store = read(outputFile, candidateStore(date));
      for (const raw of batch) {
        const item = result.payload.articles.find((row) => row.raw_id === raw.raw_id);
        const evidence = [], claims = [];
        const badQuotes = [];
        for (const claim of item.claims) {
          const quote = String(claim.quote || "");
          const start = raw.body_clean.indexOf(quote);
          if (!quote || start < 0) { badQuotes.push("source_quote_mismatch"); continue; }
          claims.push({ event_type: claim.event_type, subject: claim.subject, object: claim.object, evidence_index: evidence.length });
          evidence.push({ start, end: start + quote.length, quote });
        }
        const assetId = `HISTORY-${raw.raw_id}`;
        const candidate = withGateResult({ candidate_id: stableModelAssistId(date, "claim_extraction", assetId, sourceTextHash(raw.body_clean), promptVersion), task_type: "claim_extraction", asset_id: assetId, raw_id: raw.raw_id, source_ref: raw.source_artifact_id, source_hash: sourceTextHash(raw.body_clean), provider: result.provider, model: result.model, prompt_version: promptVersion, status: "pending", proposal: { claims: badQuotes.length ? [] : claims }, evidence, gate_results: [], generated_at: result.generatedAt }, raw.body_clean);
        store.candidates = [...store.candidates.filter((row) => row.asset_id !== assetId), candidate];
        outcomes.set(raw.raw_id, { raw_id: raw.raw_id, source_ref: raw.source_artifact_id, content_hash: raw.content_hash, candidate_id: candidate.candidate_id, status: candidate.status, disposition: item.disposition, reason: item.reason, prompt_version: promptVersion });
      }
      write(outputFile, candidateStore(date, store.candidates, { sourceCount: raws.length }));
      persist();
      console.log(`Terra history ${outcomes.size}/${raws.length} source decisions checkpointed`);
    } catch (error) {
      for (const raw of batch) outcomes.set(raw.raw_id, { raw_id: raw.raw_id, source_ref: raw.source_artifact_id, content_hash: raw.content_hash, status: "failed", reason: error.message, prompt_version: promptVersion });
      persist(); console.error(`Terra batch failed: ${error.message}`);
    }
  }
}));
if ([...outcomes.values()].some((item) => item.status === "failed")) process.exitCode = 1;
