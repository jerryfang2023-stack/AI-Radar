---
name: guanlan-funding-insight-generator
description: "Use when generating, backfilling, repairing, auditing, or explaining the Funding Insights column from verified Data Center V4 funding events. Covers secondary web research with Tavily and Exa, captured-source evidence, DeepSeek V4 Pro card writing, explicit-investor and exact-quote gates, historical event deduplication, application-layer entity links, frontstage projection, and automatic fail-closed publication. Do not use to create canonical funding facts, mutate the entity registry, publish search snippets, or treat model output as evidence."
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Funding Insights"
    status: "current downstream application"
    order: 91
    responsibility: "Turn verified funding CanonicalEvents into evidence-bounded Funding Insight research cards."
    upstream: "verified Data Center V4 funding events, Claims, SourceArtifacts, RawDocuments, secondary source discovery"
    downstream: "funding-insight application bundles, funding-insights-v1.json, funding-insights.html"
    gates: "unique-event ownership, captured-source exact quotes, explicit investors, Chinese reader-facing fields, DeepSeek provenance, schema, automatic publication, frontstage regression"
    recent_learning: "Historical conversion must deduplicate repeated CanonicalEvent IDs before secondary search and must keep blocked cards out of the public projection."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Funding Insight Generator

Funding Insights is a downstream application. Keep its research, comparisons, capital judgment, and cross-links out of Data Center V4 canonical tables.

## Required reads

1. `context/00-current-state.md`
2. `context/12-data-center-v4.md`
3. `context/frontstage-page-contracts.md`
4. `agent-workflow/product/funding-insight-v1.schema.json`
5. `references/card-contract.md`
6. `agent-workflow/tools/generate-funding-insights-deepseek.mjs`
7. Read the target date bundles under `01-SiteV2/content/11-databases/data-center-v4/` only as needed.

## Workflow

1. Select only `event_type=funding`, `publication_status=verified` CanonicalEvents with an approved Chinese display title and a resolvable subject-company entity.
2. For historical work, dry-run the range first:

   ```powershell
   npm run backfill:funding-insights -- --from=YYYY-MM-DD --to=YYYY-MM-DD
   ```

   The backfill owner chooses one source bundle for every unique `event_id`, preferring the occurrence with more accepted source and Claim references, fewer missing fields, then the newer bundle. Never pay for duplicate research on repeated event IDs.
3. Generate cards:

   ```powershell
   npm run generate:funding-insights -- --date=YYYY-MM-DD --write=true
   npm run backfill:funding-insights -- --from=YYYY-MM-DD --to=YYYY-MM-DD --write=true --date-concurrency=3 --concurrency=3
   ```

   Resume without `--force`; existing accepted cards are reused and blocked events are retried. `--date-concurrency` controls parallel source bundles and `--concurrency` controls events inside each bundle; keep their product within search/model rate limits. Use `--force=true` only when source capture, prompt rules, or a card is known to be stale.
4. Search each subject company through both configured providers. Capture original page text; search titles, snippets, provider answers, and URLs are discovery metadata only.
5. Send the verified CanonicalEvent plus captured source bodies to `deepseek-v4-pro`. Require every factual object to cite an exact continuous quote contained in one captured body.
6. Block publication when investors are unnamed or missing, fewer than two cited captured sources remain, required company/product/financing facts lack exact quotes, reader-facing narrative is not Chinese, or schema/model provenance fails.
7. Build and validate the public projection:

   ```powershell
   npm run build:funding-insights-site
   npm run test:funding-insights
   node agent-workflow/tools/frontstage-regression-gate.mjs
   ```

8. Report unique verified events, auto-published cards, blocked events and their problem codes. Do not describe blocked cards as converted.

## Boundaries

- A secondary research source belongs to the Funding Insights application bundle. It does not become a canonical SourceArtifact, Claim, Entity, relationship, or event automatically.
- Canonical Claims may anchor the financing fact, but no model-generated sentence may repair canonical data.
- Exact-match entity resolution may add application links only. Ambiguous or absent matches remain `null`.
- Comparisons and capital judgment are downstream analysis, not factual RELATION-V2 edges.
- Missing investor disclosure is a hard publication failure.
- Automatic publication means deterministic gate passage; it does not mean model output bypasses validation.

## Validation

Before finishing:

1. Run the Skill quick validator and Guanlan Skill governance checks.
2. Confirm historical dry-run reports one owner per unique funding event.
3. Assert every generated date bundle and rebuild the combined frontstage JSON.
4. Confirm public card count equals the number of unique auto-published event IDs, not raw duplicate occurrences.
5. Run funding tests, frontstage regression, and a desktop/mobile smoke when page structure changed.
