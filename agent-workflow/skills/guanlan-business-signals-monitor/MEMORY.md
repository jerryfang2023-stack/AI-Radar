# Guanlan Business Signals Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-07-11 Single-Attempt Stage Ownership

- Business Signals production has four owning stages: evidence supply, Card/editorial quality, frontstage contract, and publication. The monitor runs once; provider/volume/mix diagnostics cannot trigger another full collection, and a failed hard evidence bucket permits at most one targeted refill.
- Open automation PRs and merge conflicts are `publication_waiting`. Health dispatch must repair or merge publication instead of recollecting Raw / Pool / Cards.

## 2026-07-11 Editorial Gate Must Be Release-Blocking

- Source-first structure checks do not prove editorial quality. The unified Business gate must also block stale or undated events, summary-only evidence, title-as-fact output, and duplicated public detail fields.
- Recall and precision must be tested together on real incidents: confirmed IPOs, lawsuits, shutdowns, and deployments must survive while old launches, company profiles, explainers, and failed extractions remain backend-only.

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
- Raw / Pool helper metadata such as captured search query, search path, before/after clue guesses, affected roles, and fallback provider labels must not be used as evidence for Card eligibility. Card promotion must read the source title, original source URL, source excerpts, and source-backed evidence text; otherwise broad query words like procurement, deployment, customer, or funding can promote research, job, ESG, FDE explainer, or funding-list pages.
- Research benchmarks, OCR/model papers, generic FDE/implementation explainers, job posts, ESG/environment reports, and broad AI startup/funding lists remain backend context unless the same original source proves a single-company financing, concrete product launch, named customer deployment, procurement/contract, pricing, partnership, or other dated commercial AI event.
- English source-title translation and source-backed fact extraction belong to Raw / raw-to-card ingestion. A formal Signal Card should already carry Chinese-facing title/fact fields before frontstage build.
- If an English source title has no approved literal translation mapping, repair the Raw/Card translation field or generator. Do not block an already generated formal Signal Card only because the frontstage has no separate translation registry entry.
- Template filler facts such as `original source says`, `original AI event`, `specific AI business event`, `signal value is to observe`, or `need to continue verifying customer/product/business outcome` should be repaired in the Card asset or generator, not used as a frontstage-only suppression reason after formal Card generation.

## Durable Operations Rules

- Before a full Raw / Pool / Card rerun, check same-date state in this order: activeDate, public Card count, signal Card files, Raw count, Pool/routed Pool counts, cardable candidate count, source-artifact freshness by source/channel, Raw/Card title-translation and fact-extraction status, PR/Pages state, and local dirty / fast-forward state.
- Provider recovery must be judged from direct endpoint failures, fallback use, discovered/source/raw-candidate counts, and downstream Card/frontstage gate health. AIHOT `status=collected` can still mean direct API timeout with fallback search; Anysearch can be usable even when one query fallback fails.
- If Raw / Pool / Cards are healthy but public Cards are missing, do not recollect sources until Card asset status, source-first readiness, and frontstage build failures have been ruled out. Repair the smallest failed layer and rerun the unified Business frontstage gate only.
- If same-date data and gates are healthy but the latest workflow is red, Pages is skipped, a manifest is missing, or local Obsidian sync is blocked, classify the issue as publication, local sync, or supervision observability. Do not report it as Business data-generation failure and do not rerun generated assets.
- Hermes inbox closure must record the final commit or PR, exact validation, and prevention artifact. A resolved item should not keep `fix_commit=pending` after the repair has merged.

## FDE Boundary

- Enterprise AI / FDE is an independent implementation lens, not a fourth Business Signal Card type. FDE may share Business Signals Raw capture and Pool evidence, but its frontstage uses the independent `enterpriseAiFdePool` / `enterprise-ai-fde.json` lens pool.
- FDE lens-only evidence must not weaken formal product / service, funding, or case Card gates. FDE lens entries must hide backend fields, keep concrete implementation evidence, and get Chinese-facing title/fact fields from Raw / Card / FDE asset generation rather than generic frontstage blocking.

## AI Hardware Lens Boundary

- AI hardware investment, scenario/service, and trend/innovation news should be monitored through a separate Business Signals lens (`aiHardwareSignals`) rather than being forced into the main active-date Card mix. Formal Cards remain limited to product / service, funding, and case.
- Source-only hardware artifacts may feed the separate AI Hardware observation lens when they have source URL, title, and commercial-event evidence, but they must be marked `ai_hardware_lens_only` and must not bypass Raw / Pool / Card gates to become formal Cards.
- Hardware queries must reject social/profile posts, broad company lists, market reports, forecasts, and generic rankings. Prefer single-company financing, customer deployment, procurement/contract, product availability, supply/capacity, data-center, server, chip, accelerator, HBM, packaging, cooling, edge-device, robotics, or manufacturing-capacity events.
