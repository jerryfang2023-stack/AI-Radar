---
name: guanlan-trend-radar-updater
description: "Use when building, refreshing, auditing, or explaining the independent Trend Radar application at TRADAR-V1.0.0-factual-change-explorer. It projects accepted Data Center V4 events into daily changes, weekly structure changes, and monthly market snapshots with event/entity/source traceability. Do not use for report prose, opportunity scoring, trend candidates, viewpoints, community intelligence, recommendations, rankings, or canonical-data mutation."
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Trend Radar"
    status: "downstream factual application"
    order: 91
    responsibility: "Own the factual daily, weekly, and monthly change projection and trend-radar.html frontstage."
    upstream: "Accepted Data Center V4 canonical events, verified entities, Claims, SourceArtifacts, classifications, and verified factual relationships"
    downstream: "trend-radar-v1.json, trend-radar.html, period navigation, event/entity/source evidence links"
    gates: "TRADAR version, accepted publication state, dataDate basis, evidence lineage, exact period counts, coverage disclosure, forbidden judgment fields, no community/viewpoints/V3 inputs"
    recent_learning: "A change explorer must expose collection coverage and evidence IDs; it must not turn sparse observation into a market judgment."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Trend Radar Updater

Build and maintain the independent factual-change application in the V4 Application Center.

## Required Reads

1. `AGENTS.md`
2. `context/12-data-center-v4.md`
3. `context/frontstage-page-contracts.md`
4. `agent-workflow/product/trend-radar-v1-contract.md`
5. `01-SiteV2/site/scripts/build-trend-radar-frontstage.mjs`
6. `agent-workflow/tools/assert-trend-radar-v1.mjs`

## Workflow

1. Rebuild the V4 frontstage data before this projection when canonical inputs changed.
2. Run `npm run build:trend-radar-site`.
3. Run `npm run assert:trend-radar`.
4. Run `npm run test:data-center-site:prepared` for page and integration checks.
5. Inspect the default day plus the latest week and month. Confirm counts, links and coverage notes.
6. Repair input facts at their owning V4 generator or gate. Repair aggregation defects in the Trend Radar generator. Never patch generated JSON by hand.

## Rules

- Use `dataDate` as the accepted-batch date. Keep occurrence date separate.
- Accept only `verified` and `partial` canonical events.
- Preserve Claim IDs, SourceArtifact IDs and original source URL on every event.
- Show daily financing, deployment, partnership, product/service and hardware changes.
- Weekly continuous-change entities require at least two tracked events across at least two categories.
- “Product entering use” requires a product entity's first verified RELATION-V2 `serves` customer relationship and its event/Claim/source evidence.
- Monthly differences compare the same day range with the previous month only when every prior-window batch day is observed; otherwise display no delta.
- Monthly distributions count unique evidence-backed events and disclose observed data days.
- Link all structures back to event/entity details and the original source.

## Prohibited

- First-Line Viewpoints, Community Intelligence, V3 Cards, trend candidates or opportunity signals as factual inputs.
- Importance, value, heat, maturity, score, direction, ranking, advice, recommendations or “representative” selection.
- Currency aggregation across currencies.
- Treating unobserved dates as zero activity.
- Writing report prose or replacing Industry Reports.

See `examples/good-factual-change-set.md`, `examples/bad-judgment-change-set.md`, and `evals/trend-radar-updater-evals.md`.
