---
name: guanlan-raw-pool-card
description: Use when running, repairing, auditing, or changing WaveSight AI Raw to Pool to Core Pool to Signal Card to frontstage production. Covers daily Raw/Pool quantity targets, Core Pool qualification, Signal Card generation, unified frontstage Card display, and site/Obsidian handoff rules.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Business Signals"
    status: "current sub-skill"
    order: 70
    responsibility: "Convert eligible Raw / Pool evidence into source-backed Business Signal Cards."
    upstream: "eligible Raw / Pool items"
    downstream: "Signal Cards and card examples"
    gates: "source-backed details, type contract, field discipline"
    recent_learning: "Card frontstage details must come from original source text, not old summaries or backend fallbacks."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Raw Pool Card

This skill is the production route for WaveSight AI business-signal assets after daily monitoring starts and before public frontstage release.

Use it for:

- Raw / Pool / Core Pool quantity and balance checks.
- Generating or repairing Signal Cards from Pool.
- Deciding why a Core Pool candidate did or did not become a formal Signal Card.
- Updating the unified Business Signals frontstage Card view.
- Auditing Core Pool coverage and non-large-company supply.

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

For frontstage count and display rules, read `references/frontstage-core-pool-rules.md`.

For self-improvement and regression prevention, read these only when relevant:

- `evals/raw-pool-card-evals.md` when generating, repairing, or auditing the chain.
- `MEMORY.md` when a failure resembles a previous incident or when updating this skill.
- `examples/good-signal-card.md` and `examples/bad-signal-card.md` when repairing Card fields or details.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Confirm Raw / Pool exist and are not stale relative to Card/site data.
3. Count Pool routes:
   - total Pool;
   - routed Pool;
   - `core_pool`;
   - non-large-company `core_pool`;
   - large-company `core_pool`.
   Pool must not be capped to a fixed top-N after Raw collection; all non-discard screened evidence should remain in the Pool file for audit and downstream repair.
4. Generate Signal Cards with the existing script. Use manual override only when the user explicitly releases a blocked run:

```powershell
node agent-workflow/tools/generate-asset-cards-from-pool.mjs --date=YYYY-MM-DD --signal-target=999 --require-final-qc=false --trend-candidates=false --manual-release-override=true --debug-auto-signals=true
```

5. Treat the generator's semantic gate as authoritative for formal Signal Cards. If a `core_pool` item is rejected for stale source, generic list/report, index-only evidence, or user-feedback-only evidence, do not silently force it into `01-Signal-Cards`.
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
- Every qualified Core Pool business signal that can become a Card should appear in that public Card set.
- The public page must not split items into Top10 versus candidate-pool modes.
- Cards are sorted by importance / impact from high to low.
- The page must not display sorting reasons, selection tiers, or candidate-only labels.

## Card Boundary

Formal Signal Cards are persistent knowledge assets. They must be source-backed and pass semantic gates. A Core Pool item that cannot pass Card display requirements may stay in backend Pool evidence, but it must not appear as a separate public candidate-pool item.

Besides product launches, funding rounds, and customer deployments, concrete AI commercial market-structure events can become Cards when source-backed: acquisitions / mergers, material partnerships, procurement / contracts, pricing or billing changes, regulatory approvals / antitrust actions, and material lawsuits / settlements. They must be normalized into the existing `case` or `product_service` Card types, not a fourth public type.

Funding recognition must cover English and Chinese financing expressions, including `raises`, `closes`, `announcing our <amount> <round>`, `launches with <amount>`, `emerged from stealth with <amount>`, and `完成/获得/宣布 <amount> <round> 融资`. Rumors, future-tense items such as `将完成`, funding trackers, broad lists, and generic funding commentary stay backend-only.

Public titles should come from source-title translations by default. A funding Card may use a generated factual title only when the original source title itself confirms a single-company financing event with amount / round wording such as `raises <amount>`, `announcing our <amount> <round>`, `launches with <amount>`, or `emerged from stealth with <amount>`. Do not use this exception for rumors, future-tense financing claims, funding trackers, broad lists, or commentary.

Funding Card facts should preserve amount / round plus investor, use of proceeds, product direction, or deployment context when present in the original source. Generic funding/list blockers should inspect source identity fields, not source-backed fact text or captured query tails.

Do not lower Card quality to satisfy a count. If many `core_pool` candidates fail the formal Card gate, repair Pool routing or collect better Raw evidence.

## Self-Improvement Loop

- Prefer adding a pass/fail eval before adding another long prose rule.
- Record only durable lessons in `MEMORY.md`: one dated entry, two to three sentences, no raw command transcripts.
- Keep examples short and concrete. Use good examples for target shape and bad examples for failure signatures.
- When a real production failure recurs, update the eval first, then update this skill only if the workflow itself changed.

## Reporting

When finishing, report:

- Raw / Pool / Core Pool counts;
- Signal Card count;
- public Card count;
- rejected Core Pool candidates and gate reasons;
- gates run;
- whether changes were committed and deployed.
