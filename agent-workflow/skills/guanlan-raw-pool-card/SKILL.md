---
name: guanlan-raw-pool-card
description: Use when running, repairing, auditing, or changing WaveSight AI raw-to-card Signal Card and frontstage production. Covers daily Raw/Pool audit targets, cardability judgment, Signal Card generation, unified frontstage Card display, and site/Obsidian handoff rules.
metadata:
  guanlan:
    version: "1.0.3"
    lane: "Business Signals"
    status: "current sub-skill"
    order: 70
    responsibility: "Convert eligible Raw / Pool evidence into source-backed Business Signal Cards."
    upstream: "eligible Raw / Pool items"
    downstream: "Signal Cards and card examples"
    gates: "source-backed details, type contract, field discipline"
    recent_learning: "Card release must test recall as well as precision: confirmed source-backed events override stale Pool route/importance labels, while rumors, viewpoints, disputes, and research-only results need explicit rejection reasons."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Raw Pool Card

This skill is the production route for WaveSight AI business-signal assets after daily monitoring starts and before public frontstage release.

Use it for:

- Raw / Pool audit quantity and balance checks.
- Generating or repairing Signal Cards from Pool.
- Deciding why a Raw / Pool candidate did or did not become a formal Signal Card.
- Updating the unified Business Signals frontstage Card view.
- Auditing cardable coverage and large-company concentration.

Do not use it for first-line builders viewpoints, opinion cards, daily observation articles, trend reports, or business briefs.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/07-v3-intelligence-generation-rules.md`
3. `context/05-daily-monitoring.md`
4. `context/frontstage-page-contracts.md`
5. Target date files under:
   - `01-SiteV2/content/01-raw/`
   - `01-SiteV2/content/02-pool/`
   - `01-SiteV2/knowledge/01-Signal-Cards/`
   - `01-SiteV2/site/data/v3-data-observation-desk.json`

For frontstage count and display rules, read `references/frontstage-cardability-rules.md`.

For self-improvement and regression prevention, read these only when relevant:

- `evals/raw-pool-card-evals.md` when generating, repairing, or auditing the chain.
- `MEMORY.md` when a failure resembles a previous incident or when updating this skill.
- `examples/good-signal-card.md` and `examples/bad-signal-card.md` when repairing Card fields or details.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Confirm Raw / Pool exist and are not stale relative to Card/site data.
   - For a manual backfill or replay, pass `--expected-raw-count=<persisted-count>` to Card generation and verify the handoff records matching `raw_input_count` / `pool_input_count` before publication.
   - Same-date regeneration replaces that date's Card set. Publication must stage removed prior Card filenames together with new files and persist the matching Pool-to-Card handoff plus frontstage manifest; an in-run clean set with stale merged files is a failed release.
3. Count audit supply:
   - total Pool;
   - routed Pool;
   - cardable Raw / Pool candidates;
   - non-large-company cardable candidates;
   - large-company cardable candidates.
   Pool must not be capped to a fixed top-N after Raw collection; all non-discard screened evidence should remain in the Pool file for audit and downstream repair.
4. After the evidence-supply gate passes, generate Signal Cards with the existing script:

```powershell
node agent-workflow/tools/generate-asset-cards-from-pool.mjs --date=YYYY-MM-DD --from-raw=true --signal-target=999 --trend-candidates=false --debug-auto-signals=true
```

5. Treat the generator's semantic gate as authoritative for formal Signal Cards. If a Raw / Pool candidate is rejected for stale source, generic list/report, index-only evidence, or user-feedback-only evidence, do not silently force it into `01-Signal-Cards`.
   - A historical `index_only` route or non-core importance label is not itself authoritative when the same Raw evidence is a readable, dated, confirmed commercial event. Re-evaluate the evidence object and formal event; do not let stale routing suppress a valid Card.
   - A confirmed formal event rejected only for repairable ingestion gaps is a high-priority Card-recall failure only when the source is fresh and dated, the item is routed to Core/Emerging, and it has a core commercial importance type. Undated profiles, index-only discovery records, watchlist context, and non-core RSS articles must not fail the batch merely because a Chinese field is missing.
   - Deterministic English funding-title normalization must preserve company, amount, round, and protected AI-agent terminology even when the headline continues with an `After/With/And...` factual clause. Repair that Raw title rule instead of letting `missing_chinese_fact_translation` silently remove the event.
   - Run the pinned Core/high-value recall fixture after changing Card eligibility or Pool evidence classification:

```powershell
node agent-workflow/tools/generate-asset-cards-from-pool.mjs --date=2026-07-12 --core-recall-regression-fixtures=true
node agent-workflow/tools/run-guanlan-daily-monitor.mjs --evidence-object-regression-fixtures=true
```
6. Rebuild site data:

```powershell
node 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs
```

7. Verify:

```powershell
node agent-workflow/tools/assert-v3-source-first-frontstage.mjs
node agent-workflow/tools/frontstage-regression-gate.mjs
```

8. Run the pass/fail checks in `evals/raw-pool-card-evals.md`. If any check fails, repair the source script or data and rerun until all required checks pass.

## Current Frontstage Contract

- Business Signals has one public Card view for the active date.
- Every qualified Raw / Pool business signal that passes raw-to-card cardability and can become a Card should appear in that public Card set.
- Frontstage must consume formal Signal Cards. It must not re-run semantic cardability, support-sufficiency, customer-detail, ROI, or before/after-workflow blockers after the Card has been generated.
- English source-title translation and source-backed fact extraction belong to raw-to-card ingestion. Missing or weak title/fact fields must fail before publication and route to the Card asset or generator; do not suppress a formal Card or replace its title in the frontstage selector.
- The Card generator may satisfy Chinese fact normalization from captured original-source excerpts when its source-backed normalization produces usable Chinese facts. Do not require a redundant pre-populated `fact_translation_zh` field if the same ingestion stage has already produced the compliant fact material.
- The public page must not split items into Top10 versus candidate-pool modes.
- Cards are sorted by importance / impact from high to low.
- The page must not display sorting reasons, selection tiers, or candidate-only labels.

## Card Boundary

Formal Signal Cards are persistent knowledge assets. They must be source-backed and pass semantic gates. A Raw / Pool item that cannot pass Card display requirements may stay in backend Pool evidence, but it must not appear as a separate public candidate-pool item.

Besides product launches, funding rounds, and customer deployments, concrete AI commercial market-structure events can become Cards when source-backed: acquisitions / mergers, material partnerships, procurement / contracts, pricing or billing changes, regulatory approvals / antitrust actions, and material lawsuits / settlements. They must be normalized into the existing `case` or `product_service` Card types, not a fourth public type.

Funding recognition must cover English and Chinese financing expressions, including `raises`, `closes`, `announcing our <amount> <round>`, `launches with <amount>`, `emerged from stealth with <amount>`, and `完成/获得/宣布 <amount> <round> 融资`. Rumors, future-tense items such as `将完成`, funding trackers, broad lists, and generic funding commentary stay backend-only.

A headline about helping, running, or automating a fundraise is not proof that the round closed. If the source says the raise is still coming together, on track rather than closed, expected to close, or otherwise unconfirmed, keep it in Pool even when an amount and round appear in the title. Deduplicate confirmed financing across dates and alternate media URLs by the source-backed company + amount + round identity.

Funding confirmation is cluster-wide, not headline-local. Normalize optional company suffixes such as `AI` when clustering company + amount + round. If any same-event source says the round is pending, still coming together, or not closed, block every alternate-source version from formal Cards until a primary source or named investor confirms closing; a more assertive secondary headline must not override the contradiction.

Public titles should be resolved during raw-to-card ingestion. English articles should enter the Card asset with a Chinese event title or an exact approved source-title translation entry. The unified pre-publication Business gate may block missing translation fields and route them to Raw/Card repair, but the frontstage builder must not silently hide a formal Card or replace its title because a separate frontstage lookup is missing. The Raw/Card title translation generator may produce a factual funding-title translation only when the original source title itself confirms a single-company financing event with amount / round wording such as `raises <amount>`, `announcing our <amount> <round>`, `launches with <amount>`, or `emerged from stealth with <amount>`. Do not use this exception for rumors, future-tense financing claims, funding trackers, broad lists, or commentary.

Rumor detection must inspect the whole source title, not only its prefix. Titles containing `爆料`, `传闻`, `泄露`, `据称`, or equivalent language stay backend-only unless the same title independently confirms an official launch. Source-backed `How X used Y to achieve Z` case titles are valid case evidence and need deterministic Chinese title coverage when the exact translation registry is empty.

Production auto-translation must use the controlled business-news translation prompt when its model credential is available, then deterministic event-title rules. Generic public machine-translation output is not an accepted fallback because it can mistranslate protected product/company terms while still looking Chinese; unresolved formal-event titles must block for ingestion repair instead.

Current-day recall must also audit fresh A/S-tier English product-change events that land in Watchlist or carry a non-core importance label. Confirmed feature additions, removals, and infrastructure launches are formal product/service events; normalize their Chinese title and source-backed fact during Raw/Card ingestion. A discovery acquisition channel does not make an item unauditable when the captured Raw explicitly records `source_role: primary_source` or `resolved_original_source` with readable dated event text.

AI relevance must be present in the event title or captured original-source text. Do not count an acquisition feed, source label, section name, or publisher channel containing `AI` as event evidence. A security, policy, or general technology article with no AI / Agent / model / machine-learning anchor in its own content remains backend context even when it comes from an AI-labelled RSS feed.

Funding Card facts should preserve amount / round plus investor, use of proceeds, product direction, or deployment context when present in the original source. The company and financing amount must match the current source-title event; valuation figures, related-story amounts, rival-company rounds, navigation text, and truncated page chrome must not be rewritten as the current company's financing. Generic funding/list blockers should inspect source identity fields, not source-backed fact text or captured query tails.

Fact extraction also belongs to raw-to-card ingestion. Missing customer / ROI / before-after workflow details are evidence-boundary notes, not frontstage blockers for a formal Signal Card.

Frontstage summaries should reuse each Card asset's source-backed `价值描述` before category-level fallback text. Repeated category boilerplate is a frontstage build defect, not a Card-content shortage.

Voluntary privacy pledges and similar policy/ethics events remain backend context unless the same source proves a separate product, funding, procurement, contract, or customer event.

A Pool item explicitly routed as `usable_for: viewpoint` with no event evidence remains backend viewpoint context. Separately, a title whose event is an executive criticism, prediction, warning, or commentary remains viewpoint context even when upstream labels the speech or post as `event_evidence: true`; a mixed `usable_for` list must not turn that speech into a Card. A title-confirmed commercial event such as a launch, deployment, acquisition, or completed financing remains eligible. Reject viewpoint-only items before Card spec generation instead of allowing an unexplained `company_name_unusable` failure to block the editorial batch.

Do not lower Card quality to satisfy a count. If many Raw / Pool candidates fail the formal Card gate, repair Pool routing or collect better Raw evidence.

## Self-Improvement Loop

- Prefer adding a pass/fail eval before adding another long prose rule.
- Record only durable lessons in `MEMORY.md`: one dated entry, two to three sentences, no raw command transcripts.
- Keep examples short and concrete. Use good examples for target shape and bad examples for failure signatures.
- When a real production failure recurs, update the eval first, then update this skill only if the workflow itself changed.

## Reporting

When finishing, report:

- Raw / Pool audit counts;
- Signal Card count;
- public Card count;
- rejected Raw / Pool candidates and gate reasons;
- gates run;
- whether changes were committed and deployed.
