# Business Signals Weekly Failure Review - 2026-06-08 to 2026-06-14

- generated_at: 2026-06-14T18:30:00+08:00
- lane: Business Signals / Intelligence Map / Dashboard
- scope: past-week monitor failures, blockers, fixes, and skill improvements
- evidence_sources: local reports, Hermes inbox items, GitHub run failure summaries

## Executive Summary

The week did not fail for one single reason. It showed four different failure classes that were being treated too much like one generic "rerun the whole workflow" problem:

1. Raw / Pool supply gates failed when quantity or lane mix was thin.
2. Public Top10 contract was missing even when internal frontstage selection had enough cards.
3. Source-first / title gates caught translation and field-boundary problems too late.
4. Weekend low-supply runs exposed a weak recovery path: caps were relaxed after selection instead of repairing non-large-company supply before Top10 selection.

The better operating path is to keep Top10, move supply and cap checks earlier, and route failures by category before rerunning the whole chain.

## Daily Failure Detail

| Date | Primary blocker | Blocking details | Same-day solution | Re-evaluation |
|---|---|---|---|---|
| 2026-06-08 | Raw volume hard gate | Monitor quality loop failed 3 cycles on `raw_count_min`: 131, 141, then 139 active Raw candidates against a 150 minimum. Pool, Core Pool, and non-large Core Pool were otherwise healthy: Pool 75, Core Pool 31, non-large Core Pool 24. | Downstream assets were later generated, with 16 signal card assets visible in the frontstage manifest. | Partly reasonable but too blunt. This was a Raw quantity problem, not a Card or frontstage problem. The repair path should be targeted Raw refill or a supervised quality override with an explicit report, not repeated full-chain reruns or silent continuation. |
| 2026-06-09 | Supervision observability warning, not lane failure | Daily supervision reported Business Signals warnings: missing same-date local manifest, missing quality gate/readiness reports, and GitHub CLI timeout. GitHub showed same-date Business Signals runs succeeded. | Hermes audit corrected schedule truth and clarified that warning-only supervision gaps should not force data regeneration. | Reasonable. This should remain a "supervision evidence gap" path: refresh run visibility, retry GitHub lookup, and avoid Raw / Pool reruns unless same-date assets are actually unhealthy. |
| 2026-06-10 | Pool importance coverage, then source-first | Early runs failed at Raw / Pool post-dedupe gate because `pool_importance_coverage_gaps_must_be_none` failed, especially `important_case=2/5`. Later reruns reached Card/frontstage but failed `V3 source-first frontstage gate`. | Manual repair moved the chain past Pool coverage and then source-first/frontstage issues; later site artifacts were produced. | Directionally correct but too late in the chain. Pool importance shortages should be classified immediately after Raw / Pool and fixed by targeted case/customer-deployment refill. Source-first failures should not wait until after unrelated dashboard/topic-center work. |
| 2026-06-11 | Public Top10 contract missing | Hermes found workflow success and generated data, but public `top10` was empty: 0 items. Internal card/frontstage data existed, so the failure was the public JSON contract, not supply. | `build-v3-data-observation-desk.mjs` was fixed to emit active-date `top10`; the source-first gate was tightened to fail when `top10` is missing or not exactly 10. | Correct. This is the durable fix: public Top10 must be a lane-level contract, not an optional derived field. |
| 2026-06-12 | Top10 recurrence plus source-first false positive | Hermes recorded `source_first_frontstage_gate + top10 missing`. One card was blocked by an over-broad procurement/ERP check, and the public JSON still lacked `top10` even though `frontstageSelection` selected 10 cards. Initial run logs also showed Pool importance coverage failure before the final successful run. | Fixed Top10 emission, added source/display title fields, and narrowed the source-first procurement false positive. | Correct, but the lesson belonged in the lane monitor immediately. `frontstageSelection` and `frontstageCards` are not substitutes for the public `top10` key. |
| 2026-06-13 | Morning no-run / stale-data state, followed by frontstage gate failures | Daily supervision saw activeDate still 2026-06-12, Top10 selected count 0, signal card files 0, and no same-date Business Signals run after the watchdog. Manual dispatches then produced several failures: one Pool-to-Card duplicate gate failure and multiple source-first/frontstage failures before later success. | Manual dispatch and subsequent repairs produced same-date passing monitor, readiness, and manifest reports. The inbox was resolved with `prevention_added=not-needed`. | Incomplete. The day ultimately passed, but repeated frontstage-gate failures should not be classified as "not-needed" prevention. The skill needs a failure router that distinguishes no-run/stale assets from Pool-to-Card, source-first, and publication categories. |
| 2026-06-14 | Weekend supply shortage, broken RSS, translation/title issues, and large-company cap | Morning handoff found stale public data. Repeated runs failed on `core_pool_min`, `core_non_large_vendor_min`, `pool_importance_coverage_gaps_must_be_none`, and sometimes `core_large_vendor_ratio_max`. Later runs exposed untranslated titles and large-company overage. Final report passed under weekend policy with Core Pool 18, non-large Core Pool 12, and 12 signal cards. | Several fixes landed: weekend monitor quantity floors, broken RSS/title repair, then large-company preselection and unified early Business frontstage gate. Temporary large-company cap relaxation was later reversed. | Mixed. Weekend Raw/Core quantity floors are reasonable only for monitor-stage supply acceptance. Relaxing the frontstage large-company cap is not reasonable because it weakens the product promise. Correct path is: keep the cap strict, trigger non-large source refill, and validate Top10 before dashboard/topic-center work. |

## Failure Categories and Correct Repair Path

| Category | Symptoms | Do first | Do not do |
|---|---|---|---|
| supervision_observability | Missing local report, GitHub lookup timeout, but same-date run/assets may exist | Retry run lookup, inspect activeDate/top10/card count, classify as warning if assets are healthy | Do not rerun Raw / Pool just because supervision could not see GitHub once |
| no_run_or_stale_assets | activeDate is old, Top10 is 0/missing, no active same-date run | Dispatch the lane once, then wait for result or Hermes handoff | Do not launch overlapping full-chain reruns |
| raw_volume_shortfall | `raw_count_min` fails but Pool/Core quality is healthy | Targeted Raw refill from source lanes that are thin; if supervised override is used, report it explicitly | Do not proceed silently or copy stale site data |
| pool_mix_shortfall | `pool_importance_coverage_gaps_must_be_none` fails | Refill the missing lane, especially customer/case, funding, procurement, pricing, vertical deployment | Do not weaken Card entry gates or fill with social/community feedback |
| core_supply_shortfall | `core_pool_min` or `core_non_large_vendor_min` fails | Run non-large-company source refill before Card generation | Do not solve by raising large-company exposure |
| top10_contract | `frontstageSelection` exists but public `top10` is missing or not 10 | Fix build contract and rerun the unified frontstage gate | Do not treat internal selection as public success |
| translation_title | English/mixed/placeholder title, source-domain subject | Run title normalization/source-title mapping and source-first gate | Do not patch UI labels only |
| large_company_cap | More than 3 large-company cards total or more than 1 per company | Enforce cap inside Top10 preselection and backfill from non-large Core Pool | Do not relax the cap for weekends |
| publication | PR, merge, or Pages did not publish after valid assets | Repair PR/automerge/Pages only | Do not regenerate data when same-date artifacts already passed |

## Better Morning Monitoring Path

The recommended path for finishing before 10:00 Asia/Shanghai is:

1. Run the primary Business Signals workflow at 09:07 and 09:37.
2. After Raw / Pool, immediately compute a supply preflight:
   - active Raw count;
   - Pool count and routed Pool count;
   - Core Pool count;
   - non-large Core Pool count;
   - funding / case / product lane coverage;
   - predicted Top10 eligibility after large-company cap.
3. If supply preflight fails, run targeted refill for the missing category. Do not continue to Card/frontstage/dashboard generation yet.
4. Generate Cards from all eligible Core Pool items.
5. Run Top10 preselection with strict large-company caps before public JSON build.
6. Build `v3-data-observation-desk.json`.
7. Run the unified Business frontstage gate immediately. This catches Top10 count, translation, source-first, and large-company-cap failures before operations dashboard or topic-center generation.
8. Only after the unified gate passes, build operations dashboard, topic center, manifest, PR, merge, and Pages.
9. At 09:45 / 09:55, Hermes should dispatch or hand off exactly one categorized repair path, not trigger repeated full-chain retries.

## Top10 Evaluation

Do not cancel Top10.

Top10 selection is not the expensive part of the workflow. The expensive parts are source collection, page fetches, snapshot extraction, Card generation, PR/merge, and Pages. Removing Top10 would hide the quality failure instead of fixing it. It would also push duplicate, low-value, or large-company-heavy cards directly to the frontstage.

The better product path is:

- Keep Top10 as the frontstage editorial surface.
- Keep all eligible Signal Cards as assets for graph/trend analysis.
- Expose "All Cards / Core Pool review" as a secondary operational or review view, not as the main public Business Signals surface.

## Skill Updates Required

- Add a morning failure router to the Business Signals monitor skill.
- Add a weekend rule: monitor quantity floors may be lighter, but frontstage caps and source-first/Card gates stay strict.
- Add a supply preflight check before Card/frontstage/dashboard work.
- Add an eval that fails if the same failure category triggers more than one full-chain rerun without targeted repair.
- Add durable memory that "supervision warning" is not the same as "data lane failure".

## Status After Review

- The latest production fixes already move the lane in the right direction:
  - large-company cap is now enforced before Top10 publication;
  - Business frontstage validation runs earlier as a unified gate;
  - weekend monitor floors are explicit;
  - Top10 public contract exists.
- Remaining improvement is mostly operational: make the skill force categorized repair and supply preflight discipline so the next failure is diagnosed before the workflow spends time on downstream build and publication.
