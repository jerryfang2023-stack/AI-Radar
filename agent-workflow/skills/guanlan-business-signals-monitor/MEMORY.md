# Guanlan Business Signals Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-07-02 Core Signal Cards Contract

- BSIG-V1.2.0 removes the retired public ranked-list versus candidate-pool split. The public Business Signals page renders one active-date Card set: every qualified Raw / Pool business signal that can become a Card, sorted by importance / impact from high to low.
- Do not display ranking reasons, selection tiers, candidate labels, or source/channel quality scores on the public page. Keep source-first checks focused on auditable source URL, generated formal Signal Card identity, and exclusion of internal Raw / Pool / gate fields.
- Retired public ranked-list counts, fill logic, candidate-pool display, and large-company caps are historical incident context only. They are not current release blockers after BSIG-V1.2.0.
- Raw / Pool audit presence is not automatic public eligibility. `not_promoted_candidates`, `notPromotedReason`, and non-empty `notPromotedIssues` are hard blockers; low-value AI-adjacent consumer entertainment, minor platform enforcement/policy notices, monthly update roundups, explainer posts, analyst commentary, and unclosed VC-fund formation items must remain backend-only unless the same original source proves a concrete business event.

## 2026-07-02 Retired Gates And Raw Diagnostics

- V1/V2 daily observation, business brief, publiccopy, cardcopy, writer-style, V2 typography, V2 raw-evidence, V2 source gates, and retired ranked-list gates are retired. Do not use them as Business Signals release blockers or recovery routes.
- When Pool audit supply and Card supply are healthy, Raw-only diagnostics such as Anysearch quota exhaustion, source-channel failures, keyword-only floors, AI-title ratio, off-topic raw-title count, and Raw floor shortfall must stay in reports but must not trigger a full monitor rerun or block publication.
- Business Signals recovery should repair the exact failed stage and publish after the smallest relevant validation passes. Re-running the whole monitor chain is allowed only after the pre-rerun checklist proves same-date artifacts are missing, stale, corrupt, or truly insufficient.

## Durable Source-First Rules

- Business Signal Cards are limited to product / service, funding, and case / deployment facts. Technical explainers, builder opinions, newsletters, workforce programs, docs, generic lists, repo roots, package pages, marketplace pages, and social feedback must not become Cards unless a separate original source proves a dated business event.
- English source-title translation and source-backed fact extraction belong to Raw / raw-to-card ingestion. A formal Signal Card should already carry Chinese-facing title/fact fields before frontstage build.
- If an English source title has no approved literal translation mapping, repair the Raw/Card translation field or generator. Do not block an already generated formal Signal Card only because the frontstage has no separate translation registry entry.
- Template filler facts such as `original source says`, `original AI event`, `specific AI business event`, `signal value is to observe`, or `need to continue verifying customer/product/business outcome` should be repaired in the Card asset or generator, not used as a frontstage-only suppression reason after formal Card generation.

## Durable Operations Rules

- Before a full Raw / Pool / Card rerun, check same-date state in this order: activeDate, public Card count, signal Card files, Raw count, Pool/routed Pool counts, cardable candidate count, source-artifact freshness by source/channel, Raw/Card title-translation and fact-extraction status, PR/Pages state, and local dirty / fast-forward state.
- If Raw / Pool / Cards are healthy but public Cards are missing, do not recollect sources until Card asset status, source-first readiness, and frontstage build failures have been ruled out. Repair the smallest failed layer and rerun the unified Business frontstage gate only.
- If same-date data and gates are healthy but the latest workflow is red, Pages is skipped, a manifest is missing, or local Obsidian sync is blocked, classify the issue as publication, local sync, or supervision observability. Do not report it as Business data-generation failure and do not rerun generated assets.
- Hermes inbox closure must record the final commit or PR, exact validation, and prevention artifact. A resolved item should not keep `fix_commit=pending` after the repair has merged.

## FDE Boundary

- Enterprise AI / FDE is an independent implementation lens, not a fourth Business Signal Card type. FDE may share Business Signals Raw capture and Pool evidence, but its frontstage uses the independent `enterpriseAiFdePool` / `enterprise-ai-fde.json` lens pool.
- FDE lens-only evidence must not weaken formal product / service, funding, or case Card gates. FDE lens entries must still hide backend fields and use direct Chinese translations of source/original titles.
