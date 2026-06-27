# Business Signals Weekly Failure Review - 2026-06-21 to 2026-06-27

- review_date: 2026-06-27
- lane: Business Signals
- scope: daily monitoring, Hermes handoff, repair path, and skill evolution

## Executive Summary

Business Signals did not truly fail every day this week. The recurring user-facing pain came from four Business repair days plus noisy supervision:

- 2026-06-21, 2026-06-25, 2026-06-26, and 2026-06-27 created `business_signals_top10_missing` or monitor/gate Hermes items.
- 2026-06-22 had healthy same-date data but no daily supervision JSON, so the failure was observability, not Business data.
- 2026-06-23 had healthy Business data but supervision warned on skipped Pages workflow and dirty local Obsidian sync.
- 2026-06-24 Business Signals passed; the overall daily warning was from another lane.

The operational lesson is strict: before any full-chain rerun, classify the earliest failing category and verify same-date Raw / Pool / Card / Top10 state. If data is already healthy, repair the specific translation, source-artifact, publication, local-sync, or supervision mechanism only.

## Daily Findings

| Date | Concrete Failure / Status | Evidence | Repair Used | Better Targeted Path |
|---|---|---|---|---|
| 2026-06-21 | Business assets were stale or missing at handoff; public Top10 was 0 and signal Card files were 0. A second Hermes item also reported monitor/gate failure. | Hermes evidence showed activeDate `2026-06-20` while expected `2026-06-21`, missing manifest / quality gate / readiness, and latest Business workflow failure. Final artifacts later reached Raw 183, Pool 95, and frontstage gate passed. | Regenerated same-date Business assets and validated `assert:business-frontstage` plus daily production chain. | Separate stale/no-run from later publication/local-sync warnings. After Top10 and gates pass, Hermes must stop requesting data reruns and track only publication or sync closure. |
| 2026-06-22 | No confirmed Business data failure. The gap was missing daily supervision JSON. | No `2026-06-22-daily-supervision-report.json` was found, but same-date Business artifacts showed Raw 227, Pool 95, and frontstage gate passed. | No Business repair was needed based on available evidence. | Hermes should classify missing supervision report as `supervision_observability`, not `business_signals_top10_missing`, when same-date assets and gates are healthy. |
| 2026-06-23 | Business data was healthy; supervision warnings were publication/local-sync noise. | Business lane warned that latest same-date GitHub Pages workflow was skipped and local Obsidian sync might be blocked by 4 dirty files. Raw 190, Pool 95, frontstage gate passed. | No Raw / Pool / Card repair needed. | Supervision must apply data-health precedence: workflow redness, Pages skipped, or local dirty files after healthy Top10 are publication/local-sync warnings only. |
| 2026-06-24 | Business Signals passed. | Daily supervision overall status was warning, but Business lane status was passed. Raw 190, Pool 95, frontstage gate passed. | No Business repair needed. | Daily reports should isolate lane status so another lane does not look like Business failure. |
| 2026-06-25 | Business public assets were stale; Top10 and Card files were missing at handoff. | Hermes evidence showed activeDate `2026-06-24`, Top10 0, Card files 0, missing manifest / gate / readiness, latest workflow failure. Later supervision still warned on missing persistent manifest, Pages skipped, dirty local files, and stale workflow state even though same-date data was healthy. | Widened monitor retry collection caps, regenerated Raw / Pool / Cards / site data, then validated Top10 health. | This was too broad. First diagnose which source-artifact or channel is short, then refill only that lane. If same-date data is healthy but manifest or Pages is missing, repair publication closure rather than recollecting. |
| 2026-06-26 | Business public assets were stale at handoff. Source-artifact retry freshness and source-title translations both contributed. | Hermes evidence showed activeDate `2026-06-25`, Top10 0, Card files 0, missing manifest / gate / readiness. Action log records source-artifact retry refresh repair and added source-title translations. Final Raw 188, Pool 95, frontstage gate passed. | Fixed source-artifact retry refresh, generated same-date assets, added source-title translations, and validated daily production chain. | Keep source-artifact retry refresh as a root fix, but make translation-title completion automatic and keep workflow red / local dirty warnings out of data-generation status. |
| 2026-06-27 | Initial handoff again reported stale activeDate and Top10 0, but the practical blocker became source-title translation starvation after data existed. | Hermes evidence showed activeDate `2026-06-26`, Top10 0, Card files 0, missing manifest / gate / readiness. Action log records restoring Top10 by adding source-title translations and replaying generated artifacts. Final Raw 177, Pool 95, Business frontstage and supervision passed. | Initial repair replayed generated Raw / Pool / Card artifacts and was wasteful. Later code repair synced source-title translations from active-date Cards and stabilized skill dashboard data. | If Raw / Pool / Cards already exist, do not recollect. Run a translation-title preflight, sync missing approved source-title translations, rebuild frontstage data, and rerun only the unified Business gate. |

## Remaining Optimization Opportunities

1. Targeted source diagnosis before full rerun
   - Current weakness: repair often starts from the full Business chain.
   - Required improvement: before rerun, report active Raw, Pool, routed Pool, Core Pool, non-large Core Pool, Top10 count, Card count, source-artifact freshness, and missing title translations. Rerun only the deficient source lane or build step.

2. Hermes category precision
   - Current weakness: `top10_missing` can hide different causes: stale assets, source-artifact retry, translation-title starvation, publication, or local sync.
   - Required improvement: Hermes handoff must name the earliest category and include the smallest recommended repair path. Healthy data plus red workflow must be `publication`, not `business_signals_top10_missing`.

3. Translation-title dependency
   - Current weakness: approved Chinese source-title mappings are a hard public-display dependency, but historically they were discovered after Cards existed.
   - Required improvement: translation-title preflight must run before Top10 publication and block with a list of missing source titles. Repair is translation registry / frontstage build only.

4. Publication closure and local sync
   - Current weakness: missing manifest, skipped Pages, workflow failure, and dirty local Obsidian files are reported beside data failures.
   - Required improvement: supervision must separate data health, PR/Pages publication, and local Obsidian sync. Only stale activeDate, Top10 count failure, Card count failure, or failed gates should trigger data repair.

5. Hermes resolution quality
   - Current weakness: some resolved inbox items keep `fix_commit=pending` or contain multiple resolution records after later repairs.
   - Required improvement: closure must record the final fix commit or PR, exact validation, and prevention artifact. If the fix is not merged, keep the item open or mark `pending-local-change` explicitly.

6. Supervision report completeness
   - Current weakness: 2026-06-22 lacked daily supervision JSON even though Business data was healthy.
   - Required improvement: daily supervision report generation itself needs a gate. Missing supervision output is an observability incident, not a Business lane failure when same-date assets pass.

## Root-Level Fixes Required

- Enforce a pre-rerun checklist in the Business Signals skill and evals.
- Add Hermes handoff precedence: data health first, publication second, local sync third.
- Treat source-title translation starvation as its own repair category with no Raw / Pool recollection.
- Keep source-artifact retry freshness checks at the source-artifact layer and expose which source/channel is deficient.
- Require weekly repeated-failure review when the same Business Hermes category appears two or more times in seven days.

## Skill Evolution Applied

This review updates the Business Signals skill memory, evals, and failure-router example so future agents must:

- distinguish data failures from observability, publication, and local-sync warnings;
- inspect channel/source-specific supply before rerunning;
- repair translation-title starvation without rerunning Raw / Pool / Cards;
- add a weekly review and skill lesson when repeated Business failures recur.
