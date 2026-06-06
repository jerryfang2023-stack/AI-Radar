# 2026-06-06 GitHub Automation Readiness Report

- generated_at: 2026-06-06T12:40:26.095Z
- status: ready_for_v3_asset_chain
- current_chain: V3 Raw / Pool / Card / Relationship / Trend Candidate
- stopped_outputs: daily observation, business brief, trend report, opinion lane
- frontstage_goal: update V3 data observation desk and operations dashboard after PR merge

## Step Readiness

| Step | Status | Script |
|---|---|---|
| Run Raw / Pool monitor with QC | ready | `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs` |
| Confirm Raw / Pool counts and stale state | ready | `agent-workflow/tools/assert-daily-production-chain.mjs` |
| Generate 10 business-signal Cards | ready | `agent-workflow/tools/generate-asset-cards-from-pool.mjs` |
| Run Pool-to-Card duplicate gate | ready | `agent-workflow/tools/assert-pool-to-card-dedupe.mjs` |
| Run trend candidate / no-decision shell | ready | `agent-workflow/tools/run-trend-candidate-decision.mjs` |
| Build V3 data observation desk | ready | `01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs` |
| Sync operations dashboard data | ready | `01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs` |

## Required Gates

- Raw / Pool count and historical duplicate gate.
- Pool-to-Card duplicate gate.
- V3 source-first frontstage gate.
- Frontstage regression gate.
- Pre-commit gate before PR update.

## Current Boundaries

- No stopped content-output lane is executed.
- No publiccopy, cardcopy, or copy-style gate is required for publishing.
- No opinion / follow-builders material enters business-signal generation.
- Card details must be generated from original source text, not old summaries or backend fields.

## Missing / Blocked

- none
