---
title: WaveSight Current Handoff
date: 2026-09-03
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
- Current backend: `OPS-V3.2.0-member-admin`, shared by the Data Center, Funding Portal, Mini Program, H5 and community membership. Seven modules; issue/task UI retired with production records preserved. Membership aggregates are identity-free; Mini Program user detail and audited adjustments require the runtime admin token. Integration/local settings and cross-platform Skill sync are documented in `docs/operations-console.md`; source baselines must not be represented as verified deployments.
- Current human-readable knowledge base: the physically independent Guanlan AI Vault (`GUANLAN-VAULT-V1.2-private-evidence-linked`), split into system state, Data Center, Application Center, Operations, contracts, knowledge assets, and workspace.
- Current machine-serving projection: `DATA-LAKE-V4.1-24-table`, rebuilt and gated by Final Closure.
- Current private evidence source: `PRIVATE-EVIDENCE-STORE-V2.0`, authoritative, content-addressed, and outside the public repository/Vault. Public RAW-V4 data and the Vault store evidence locators, not complete original bodies.
- Current Funding Insights projection: 288 public financing-event cards checked through 2026-09-03, including 34 China-market cards; the latest qualifying financing disclosure is dated 2026-09-02. The 2026-09-03 bundle publishes 上海以太之心科技有限公司（数千万人民币种子轮）、小鹏机器人业务（9 亿美元战略融资）、HiddenLayer（1 亿美元）和 Wonderful（5.5 亿美元 C 轮），并去重一条重复披露。The public financing portal and Mini Program live contract consume the same gated projection; publication must still be verified independently from the generated source.
- Current Data Center frontstage: 2,614 events, 219 companies, 343 products, 61 people, 1,353 investors, 370 relationships, 137 FDE records, and 96 hardware records through 2026-09-03.
- The 2026-09-03 daily bundle contains 45 canonical events and restores accepted-event entity coverage to 100% through exact accepted-Claim subject evidence. University/institute-led research now resolves as research results with the cited institution; disputed Claims cannot project factual tag/facet assertions. Publisher-host, document-attribution, and title-only matches remain candidates until evidence or explicit catalog review supports promotion.
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
| Dashboard | `01-SiteV2/site/operations-console.html` |

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
-> projection-only local refresh into the independent Guanlan AI Vault
```

Model-assist production validates and rebuilds from the accepted candidate subset even when an isolated candidate generation fails; invalid partial output still fails closed at the model-assist gate.

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
