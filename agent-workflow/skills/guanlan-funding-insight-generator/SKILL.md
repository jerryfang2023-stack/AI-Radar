---
name: guanlan-funding-insight-generator
description: "Use when generating, backfilling, repairing, auditing, or explaining the Funding Insights column from verified Data Center V4 funding events. Covers secondary web research with Tavily and Exa, captured-source evidence, DeepSeek V4 Pro card writing, explicit-investor and exact-quote gates, historical event deduplication, application-layer entity links, frontstage projection, and automatic fail-closed publication. Do not use to create canonical funding facts, mutate the entity registry, publish search snippets, or treat model output as evidence."
metadata:
  guanlan:
    version: "1.6.0"
    lane: "Funding Insights"
    status: "current downstream application"
    order: 91
    responsibility: "Turn verified funding CanonicalEvents into evidence-bounded Funding Insight research cards."
    upstream: "verified Data Center V4 funding events, Claims, SourceArtifacts, RawDocuments, secondary source discovery"
    downstream: "funding-insight application bundles, funding-insights-v1.json, funding-insights.html"
    gates: "unique-event ownership, normalized rounds and amounts, financing disclosure status, current-round investor-role separation, reviewed company-round/history aggregation, investment-institution exact evidence, CB Insights-aligned market category, explicit primary product form, captured-source exact quotes, entity-review queue, schema, automatic publication, frontstage regression"
    recent_learning: "Keep financing source text and normalized values together, calculate cumulative totals only with an explicit basis, and project named investors into Entity Library only when an exact source quote remains attached."
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

1. Select only `event_type=funding`, `publication_status=verified` CanonicalEvents with an approved Chinese display title and a resolvable subject-company entity. Daily automatic historical admission is limited to financing sources published within the preceding three calendar months; older sources require an explicit targeted-backfill instruction and `--allow-historical-funding=true` during the Event rebuild.
2. For historical work, dry-run the range first:

   ```powershell
   npm run backfill:funding-insights -- --from=YYYY-MM-DD --to=YYYY-MM-DD
   ```

   The backfill owner chooses one source bundle for every unique `event_id`, preferring the occurrence with more accepted source and Claim references, fewer missing fields, then the newer bundle. The generator also checks all persisted date bundles and records `deduplicated` instead of invoking search or DeepSeek when the event ID or canonical company-plus-normalized-round key already has a valid card. Never pay for duplicate research on repeated financing.
3. Generate cards:

   ```powershell
   npm run generate:funding-insights -- --date=YYYY-MM-DD --write=true
   npm run backfill:funding-insights -- --from=YYYY-MM-DD --to=YYYY-MM-DD --write=true --date-concurrency=3 --concurrency=3
   ```

   Resume without `--force`; existing accepted cards are reused and blocked events are retried. `--date-concurrency` controls parallel source bundles and `--concurrency` controls events inside each bundle; keep their product within search/model rate limits. Use `--force=true` only when source capture, prompt rules, or a card is known to be stale.
4. Search each subject company through both configured providers. Capture original page text; search titles, snippets, provider answers, and URLs are discovery metadata only.
5. Send the verified CanonicalEvent plus captured source bodies to `deepseek-v4-pro`. Require every factual object to cite an exact continuous quote contained in one captured body. `financing.investors` contains only investors explicitly tied to the current round; historical or ambiguous investors belong in `other_round_investors`.
6. Normalize the financing round into `round_code` plus a canonical Chinese `round`, preserve `round_original`, and preserve amount/total source text beside deterministic normalized currency and base values. Record the announced date, financing disclosure status, and a role for every current-round investor. Build the structured investment thesis and customer research status, and resolve product/founder links by canonical exact match or an accepted same-type mapping in `entity-link-decisions.json`. Persist `analysis.taxonomy_version=TAG-V4.1`, one governed market category, its required children, one independent primary product form, plus supported Facets. Do not publish a card whose source classification is absent; the public builder must not guess from keywords.
7. Block publication when current-round investors are unnamed or missing unless the source explicitly does not disclose investors. That bounded exception requires an empty `financing.investors` list, `investor_disclosure_status=not_disclosed`, and the retained `investors_missing` risk marker. Also block when historical investors remain in the current-round field, fewer than two cited captured sources remain, required company/product/financing facts lack exact quotes, reader-facing narrative is not Chinese, or schema/model provenance fails.
8. Build and validate the public projection:

   ```powershell
   npm run build:funding-insights-site
   npm run assert:funding-insights:full
   npm run test:funding-insights
   npm run build:investment-institutions
   npm run assert:investment-institutions
   node agent-workflow/tools/frontstage-regression-gate.mjs
   ```

9. Report unique verified events, company-and-round aggregated cards, separated historical investors, unresolved canonical entity candidates, blocked events and their problem codes. Do not describe blocked cards as converted.

## Boundaries

- A secondary research source belongs to the Funding Insights application bundle. It does not become a canonical SourceArtifact, Claim, Entity, relationship, or event automatically.
- Canonical Claims may anchor the financing fact, but no model-generated sentence may repair canonical data.
- Exact-match entity resolution may add application links only. Ambiguous or absent matches remain `null`.
- Unresolved product and founder names must appear in `entity-review-queue.json` with evidence. Reviewed aliases can be mapped only to an existing same-type canonical V4 entity through `entity-link-decisions.json`; neither file is authority to create a canonical entity.
- Public cards aggregate repeated disclosures for the same canonical company and normalized round code, including undisclosed, multi-round, and other categories, while preserving every source event and disclosure.
- Apply accepted company corrections and merges from `company-identity-decisions.json` before company-round aggregation. Preserve the source events; merge their public card only when the reviewed identity and normalized round agree. These decisions are application projections and do not mutate canonical Data Center entities.
- Public market classification uses CB Insights AI 100 2026: Infrastructure & compute, Enterprise applications, Industry applications, or Physical AI. Subcategories remain inside that hierarchy; product form is a separate Facet and must not be displayed as a peer market category.
- Product form is a governed Facet, not a technical Tag. One card gets one primary product form. `compute_cloud_service` covers hosted GPU, training, or inference capacity; `ai_compute_system` covers physical systems; `ai_infrastructure_software` covers the software layer around model training, inference, memory, routing, compression, and evaluation.
- Comparisons and capital judgment are downstream analysis, not factual RELATION-V2 edges.
- Missing investor data is a hard publication failure unless the captured source explicitly establishes non-disclosure and the card uses the empty-list/status/risk-marker exception defined above. Generic investor categories never become named institutions.
- Automatic publication means deterministic gate passage; it does not mean model output bypasses validation.
- Dry runs, local inspection, and deterministic gates are safe within an authorized funding task. Search/model calls may incur external usage and run only through the requested generator/backfill workflow; publication, canonical mutation, and ambiguous entity decisions require their owning workflow or explicit review.

## Output

Produce evidence-bounded Funding Insight application bundles, aggregated public cards with stable historical rounds and cumulative-amount basis, blocked-event reasons, separated historical investors, the exact-evidence Investment Institution projection, and an evidence-backed entity review queue. Report unique-event ownership and external calls avoided by deduplication.

## Validation

Before finishing:

1. Run the Skill quick validator and Guanlan Skill governance checks.
2. Confirm historical dry-run reports one owner per unique funding event.
3. Assert every generated date bundle and rebuild the combined frontstage JSON.
4. Confirm public card count equals the number of unique company-and-confident-round groups plus ungrouped ambiguous disclosures, not raw duplicate occurrences.
5. Confirm every newly generated card has valid explicit `analysis.market_category_id` and `analysis.product_form_id`; every reviewed legacy decision resolves to active `ai_market_category` and `product_form` Facets; and the public projection records whether each result came from the card, manual review, or fallback.
6. Confirm current-round investors exclude every historical or round-ambiguous investor, expose roles, and link only to investor subjects carrying exact financing evidence; confirm every unresolved product/person exact match is in the evidence-backed review queue.
7. Confirm source and normalized amounts agree, cumulative totals declare their basis, and historical rounds are stable company-round projections.
8. Run the full bundle gate, institution gate, funding tests, frontstage regression, and a desktop/mobile smoke when page structure changed.

## Done When

Finish when each accepted card owns one unique funding event/company-round group, exposes complete financing fields, every factual object has captured exact-quote evidence, historical/cumulative amounts declare their basis, every investor projection remains traceable and type-bounded, blocked items remain unpublished with problem codes, and all affected schema/frontstage gates pass.
