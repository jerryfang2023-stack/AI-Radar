# 2026-06-09 Hermes Business Signals Monitoring Audit

This audit records the morning monitoring errors reported by Hermes for 2026-06-08 through 2026-06-09. These failures happened before the V3.3.3 column-independent monitor skill update was fully recorded, so they are treated as upgrade input and regression coverage, not proof that every issue remains active after V3.3.3.

## Decision Summary

| # | Hermes finding | Current decision | Rule after cleanup |
|---|---|---|---|
| 1 | GitHub Actions schedule delayed or missed | Accepted with time correction | Current schedule is 09:07 Asia/Shanghai. If no same-date run is visible by about 09:20, dispatch manually. Do not restore 08:00 as current truth. |
| 2 | Auto-merge skip caused no deploy | Partially accepted | Auto-merge skip is publication / permission state, not data-generation failure. Current policy remains automation branch -> PR -> `main` -> GitHub Pages; direct `main` push is rejected. |
| 3 | Top10 shortage / supply-fill risk | Accepted as regression risk | Keep Core Pool depth and Top10 gates. Repair source coverage and routing instead of weakening caps or using supply-fill. |
| 4 | English titles and `subject=title` | Accepted as already guarded | Current generator and source-first gate rebuild / block untranslated titles and title-like subjects. |
| 5 | Topic cron collided with slow pipeline | Accepted as operational rule | Downstream task must check workflow state and wait while Business Signals is `in_progress` before reporting missing data. |
| 6 | Low evidence score / missing evidence seed | Accepted with boundary | Watchlist aggregate data can trigger source repair or Pool rerouting only; it cannot directly generate Cards. |
| 7 | `raw_count_min` blocked high-quality run | Accepted as recovery case | If quality is high and other hard gates pass, restore Raw / Pool artifacts, regenerate Cards, rebuild site data, rerun gates, then commit. Do not copy stale pre-card `site-content.json`. |
| 8 | Builders viewpoints source unstable | Accepted for First-Line lane | Current source is `follow-builders-daily.json`; retired `05-frontier-opinions/*` files must not be used as success/failure source. |

## Current Repository Checks

- `.github/workflows/daily-persistent-assets-pr.yml` currently runs Business Signals at 09:07 Asia/Shanghai.
- The Business Signals workflow states that it never pushes directly to `main`.
- `agent-workflow/tools/assert-v3-source-first-frontstage.mjs` blocks short Top10 output, supply-fill, large-company overuse, untranslated titles, and title-like subjects.
- `01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs` contains Chinese-title / fact fallback logic for frontstage cards.
- `agent-workflow/tools/assert-guanlan-automation-readiness.mjs` supports manual release override, but a fully automated artifact-recovery workflow is not yet a standalone current workflow.
- First-Line Viewpoints current gate uses `01-SiteV2/site/data/follow-builders-daily.json`; old `05-frontier-opinions` paths are historical.

## Conflicts Corrected

- Hermes note that data "directly pushed to main" is not accepted as current policy. It may describe an external or historical observation, but V3.3.3 keeps PR-based publication.
- Historical 08:00 cron failures are not current schedule truth. The current schedule moved to 09:07 to avoid exact-hour congestion.
- Watchlist data is not promoted into Cards directly. It can only be used to decide where source repair or Pool rerouting is needed.

## Rule Updates Made

- `skills/guanlan-business-signals-monitor/SKILL.md`: added schedule watchdog, PR publication boundary, recovery rules, watchlist boundary, and title repair handling.
- `skills/guanlan-business-signals-monitor/evals/business-signals-monitor-evals.md`: added pass/fail checks for schedule, auto-merge, downstream waiting, raw-count recovery, watchlist use, and English/title-subject regressions.
- `skills/guanlan-business-signals-monitor/MEMORY.md`: recorded the durable 2026-06-09 lessons.
- `skills/guanlan-first-line-viewpoints-monitor/SKILL.md`: recorded `follow-builders-daily.json` as the current source and retired `05-frontier-opinions`.
- `skills/guanlan-first-line-viewpoints-monitor/evals/first-line-viewpoints-monitor-evals.md`: added a path-migration eval.
- `skills/guanlan-first-line-viewpoints-monitor/MEMORY.md`: recorded the builders route migration lesson.
- `context/08-v3-3-automation.md`: added the V3.3.3 watchdog and recovery policy.

## Remaining Follow-Up

- If the 09:20 watchdog should become a machine-run scheduled task, implement it separately instead of only documenting the Hermes supervision rule.
- If `raw_count_min` recovery should be fully automated, add a dedicated recovery workflow or script. The current safe rule is documented, but full artifact recovery is still a supervised/manual path.
