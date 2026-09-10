---
title: WaveSight Current Handoff
date: 2026-09-10
status: current
encoding: UTF-8
---

# WaveSight Current Handoff

This file keeps only the current handoff state needed by a new window. Historical closeouts and process notes are audit evidence, not current execution truth.

## Current Position

- Project: WaveSight AI / 观澜 AI.
- Current release: `V4.8.1-research-retirement`; compatibility shell `SITE-V4.6.1-research-retirement`.
- Product role: AI industry data center and structured factual data foundation for downstream products and research.
- Current public application: the independent AI financing site owns financing cards and accepted weekly/monthly reports. WaveSight keeps the internal Data Center and Trend Radar; Guanlan Research is retired.
- Current backend: `OPS-V3.6.1-member-editor-collapse` at `https://www.zkdlj.vip/ops/`, shared by the Data Center, Funding Portal, Mini Program, H5 and community membership. The whole console, scripts and operational snapshots are protected by an allowlisted email challenge plus an HttpOnly VPS session; GitHub Pages excludes them. Membership & Entitlements has a summary page plus persistent Community Application Review, Community Member Management, Mini Program Member Management and Activity Scheduling subpanels in the left navigation; all reuse the console session and load only their own protected data when opened. Successful Mini Program member adjustments close the editor and return to the list. Integration/local settings and cross-platform Skill sync are documented in `docs/operations-console.md`.
- Current human-readable knowledge base: the physically independent Guanlan AI Vault (`GUANLAN-VAULT-V1.2-private-evidence-linked`), split into system state, Data Center, Application Center, Operations, contracts, knowledge assets, and workspace.
- Current machine-serving projection: `DATA-LAKE-V4.1-24-table`, rebuilt and gated by Final Closure.
- Current private evidence source: `PRIVATE-EVIDENCE-STORE-V2.0`, authoritative, content-addressed, and outside the public repository/Vault. Public RAW-V4 data and the Vault store evidence locators, not complete original bodies.
- Current accepted Funding Insights projection: 292 cards through 2026-09-10, including 35 China-market cards. Cato (EUR 6 million seed) and Cognition AI (USD 2 billion Series E) are the two new public cards. One eligible event is deduplicated; the cancelled Listen Labs financing is withdrawn, with its original evidence and blocked queue reason retained. Website and Mini Program full-commit/release-ID receipts independently establish publication.
- Current Data Center accepted frontstage: 2,795 events, 219 companies, 343 products, 61 people, 1,381 investors, 392 relationships, 142 FDE records, 104 hardware records, 70 community items, and 1,273 viewpoints for 2026-09-10.
- The 2026-09-10 daily bundle contains 44 canonical events and 137 Claims from 236 RawDocuments, with two FDE records and one hardware record. Source/Claim traceability is 100%. Manual repair reuses the accepted batch from run 34420234024; it changes only the cancelled transaction's state and dependent projections, without recollection or new model research. The morning controllers ran successfully; afternoon tasks remain waiting until their scheduled windows.
- Current funding taxonomy projection uses reviewed event decisions and evidence-backed event/entity classification assertions under `TAG-V4.1`; current counts are owned by the generated taxonomy review and consistency-gate reports rather than this handoff.
- Current private-evidence counts are owned by the latest private-evidence gate rather than this handoff; the public repository contains locators only.
- Current local automation: exactly seven Windows tasks, including one combined Hermes watchdog/heartbeat control-plane task.
- Current Skill governance: Skill Store `v2.2.0`, preserving all 23 active governed Skills certified against `GPT-5.6-SKILL-V1.0`. Content registrations, AIP project Skills, and latest plugin caches are separate inventory, not extra certifications or global installations. Use `npm run check:skill-ops` for the read-only release gate and `npm run build:skill-store-dashboard` to refresh available local sources.
- Default truth sources: `AGENTS.md`, `context/00-current-state.md`, `context/version-ledger.md`, `context/12-data-center-v4.md`, and directly relevant task files.

## Current Entries

| Entry | File |
|---|---|
| Event Library / Community Intelligence / First-Line Viewpoints / Entity Library | `01-SiteV2/site/data-center.html` |
| Weekly/monthly reports | `https://www.zkdlj.vip/#reports` |
| Trend Radar | `01-SiteV2/site/trend-radar.html` |
| Financing intelligence | `https://www.zkdlj.vip/#home` |
| Opportunity Map (unlisted internal lab) | `01-SiteV2/site/opportunity-map.html` |
| Dashboard | `https://www.zkdlj.vip/ops/` (source: `01-SiteV2/site/operations-console.html`) |

## Current Production Chain

```text
External sources
-> SourceArtifacts + RawDocuments
-> exact-span Claims + Entities
-> CanonicalEvents
-> FDE / hardware / tag projections
-> queryable V4 exports + entity history
-> split frontstage indexes and downstream applications
-> operations data
-> GitHub PR / merge
-> GitHub Pages
-> independent Funding Portal / protected Mini Program publication and matching release receipts
-> projection-only local refresh into the independent Guanlan AI Vault
```

Model-assist production validates and rebuilds from the accepted candidate subset even when an isolated candidate generation fails; invalid partial output still fails closed at the model-assist gate.

Use `docs/daily-production-recovery.md` for recovery. The 2026-09-10 accepted core production run is `34420234024`; private-evidence HEAD is `5219d8cf34253db29222f9f6ff24745d89a71dda`. Shared source-title withdrawal detection repairs the factual status, while persisted-card consistency prevents cached/recovered financing from bypassing it. Repeated generator runs preserve the withdrawal's blocked reason. Empty GitHub check jobs are not acceptance: run `34428073538` explicitly passed Windows/Linux checks on the morning publication baseline. The repair commit needs its own exact-head check. Runtime final-closure reports and live receipts establish deployment completion; data checks are not PC/mobile visual acceptance when browser control is unavailable. The primary checkout contains concurrent community Token/member-development edits; do not reset, commit or deploy them as part of daily production.

The retired OPS worktree was removed after archiving its unique commit and 15 unsubmitted image deletions on local-only `workspace-archive/ops-analytics-readonly-20260907` (`54d9a0de72`). These deletions are not production changes. All 156 non-cache ignored files were SHA-256-verified into `C:/Users/86186/Documents/Fang/backups/workspace-cleanup-20260907/ops-analytics-readonly`; 746 rebuildable cache files were discarded. Keep this archive and backup until explicitly released. The merged 2026-09-07 auto-repair worktree was also removed; active monitoring browser profiles and the external Vault workspace were not deleted.

Failed-run recovery artifacts retain same-date model-assist decisions/checkpoint and projection-coverage diagnostics. Older artifacts may omit model decisions: do not rebuild an accepted factual bundle from intake alone or silently replace it with fewer events. The 2026-09-02 recovery preserved 197 RawDocuments and 99 Claims, rebuilt 40 canonical events without inventing missing currency or financing facts, and restored accepted-event entity/project coverage to 100%.

Community login-expiry markers override a zero collector exit code. After the collection window, any non-passed gate (including missing or malformed reports) is an upstream failure; publication stays blocked on that evidence rather than generating a duplicate missing-publication repair.

Collection telemetry reports provider failures after final recovery reconciliation. A checked-in `publication: waiting` record is a non-authoritative pre-deploy snapshot; only the Pages artifact and completed deployment run can establish publication success.

V4 canonical tables contain factual evidence only. Trend, opportunity, funding-insight, report, recommendation, and value-judgment objects are downstream applications. V3 Card interfaces are removed. First-Line Viewpoints and Community Intelligence are independent columns and cannot become business-signal facts without separate original-source capture through the V4 evidence chain.

## Retired Routes

- `v3-data-observation.html`, `follow-builders.html`, `community-intelligence.html`, `intelligence-map.html`, `funding-insights.html`, `reports.html`, and weekly/monthly HTML routes are redirects only.
- V2 homepage and four-column public site content routes.
- Daily observation as required output.
- Business brief / internal reference as required output.
- Trend report prose as required output.
- Netlify deployment.
- Repository-root or removed repository `vault/` Obsidian indexing.

## Recovery

New windows should read:

1. `AGENTS.md`
2. `context/context-index.md`
3. `context/version-ledger.md`
4. `context/12-data-center-v4.md` for V4 work; historical V3 recovery requires an explicit Git ref and isolated worktree
5. The current task dispatch or closeout
6. One to three directly relevant task files or skills

For Obsidian work, read `docs/obsidian-vault.md`. V1/V2/V3 files, old Hermes handoffs, and dated May/June run reports are recovered from Git history rather than current production directories.
