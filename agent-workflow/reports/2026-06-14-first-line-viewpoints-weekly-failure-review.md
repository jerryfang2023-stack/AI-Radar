# First-Line Viewpoints Weekly Failure Review - 2026-06-08 to 2026-06-14

- generated_at: 2026-06-14T18:55:00+08:00
- lane: First-Line Viewpoints / follow-builders
- scope: morning RSS collection/build/Obsidian sync, GitHub RSS fallback, afternoon follow-builders skill publish, Hermes supervision
- evidence_sources: local gate reports, manifests, Hermes inbox items, GitHub workflow logs, local publish outputs

## Executive Summary

The First-Line Viewpoints lane was healthier than Business Signals at the data-gate level: most final `follow-builders-daily.json` gates passed. The repeated weakness was around orchestration and observability:

1. Missing or late supervision reports made healthy data look uncertain.
2. One GitHub fallback run failed in the commit step because ignored report files were not force-added.
3. The 08:30 local Codex RSS collection was not reliable enough to be the only morning route.
4. Hermes initially judged the afternoon follow-builders skill lane before the 16:30 record window.
5. The 2026-06-13 afternoon publish report existed but still recorded `builder_items_count: 0` while the output file contained 43 items, proving that report existence alone is not a success signal.

The better path is to keep the lane split into morning RSS and afternoon skill publish, but add a failure router, count consistency checks, and strict handoff windows.

## Daily Failure Detail

| Date | Primary blocker | Blocking details | Same-day solution | Re-evaluation |
|---|---|---|---|---|
| 2026-06-08 | Missing supervision coverage | Weekly health later reported the daily supervision report for 2026-06-08 as missing. No same-date First-Line gate or manifest is present in local reports. | No direct lane repair evidence found for that day; this should be treated as supervision coverage missing, not proof of data failure. | Reasonable only if explicitly classified as observability. It should not trigger RSS or skill reruns without checking `follow-builders-daily.json` active date, remarks count, and timeline files. |
| 2026-06-09 | GitHub observability warning | Daily supervision marked First-Line Viewpoints as `warning` only because GitHub CLI timed out: `spawnSync gh ETIMEDOUT`. Same-date data gate later passed with no problems or warnings. | No data repair required. Hermes audit clarified current source routes and schedule truth. | Correct. A GitHub lookup timeout is not a lane failure. Retry run lookup or use local files before dispatching. |
| 2026-06-10 | GitHub workflow commit-step failure | Run `27248239271` reached the commit step, but failed because `agent-workflow/reports/2026-06-10-follow-builders-data-gate.md` was ignored by `.gitignore` and the workflow used plain `git add`. Data files had changed, but publication stopped. | Later workflow runs succeeded; current workflow uses `git add -f` for reports and stages Obsidian timeline files. | Correct. This was a publication/staging bug, not RSS/data quality. The right fix is force-adding lane-owned reports, not rerunning source collection. |
| 2026-06-11 | Supervision coverage gap, final lane passed | Local reports show `follow-builders-data-gate` passed and first-line manifest success at 09:24. Weekly health still listed daily supervision for 2026-06-11 as missing. | Subsequent Hermes and weekly health automation improved supervision coverage. | Treat as supervision gap only. The lane itself should be judged by same-date gate, manifest, and Obsidian timeline sync, not by the absence of a daily supervision file alone. |
| 2026-06-12 | No production failure; Obsidian sync rule hardened | Daily supervision passed all lanes. First-Line manifest recorded builders data, gate, and Obsidian sync success. The key risk discovered around this period was that old monthly timeline files could be mistaken for current sync success. | Skill memory/evals recorded that V3.3.6 success requires same-date person/date timeline files, not legacy `YYYY-MM.md` month files. | Correct and durable. The lane needs person/date timeline sync and idempotency checks as first-class gates. |
| 2026-06-13 | Morning stale data, then afternoon skill publish failure | Morning supervision found first-line data date 2026-06-12, expected 2026-06-13, no same-date RSS run after the old 10:30 watchdog, and missing gate report. Afternoon Hermes found missing `01-SiteV2/content/07-points/2026-06-13-builders-viewpoints.md` and missing publish report. | Manual dispatch produced a same-date First-Line manifest with builders gate and Obsidian sync success. The afternoon runner was fixed after a PowerShell invocation issue; the output file now contains `builder_items_count: 43`. | Partly correct but incomplete. The local publish report still records `builder_items_count: 0`, so report existence alone is not enough. The skill should require output/report count consistency before considering the afternoon skill lane healthy. |
| 2026-06-14 | Local 08:30 RSS pipeline missed; early false alarms before valid windows | Hermes builders-local report said the 08:30 Codex `builder-observation-daily-sync` pipeline did not run, `follow-builders-daily.json` was stale at 2026-06-12, no 2026-06-14 gate existed, and Obsidian timelines were stale. Separate early inbox items were later closed after pre-window gating fixed the false alarm problem. | GitHub fallback at 09:55 and later runs produced same-date `follow-builders-daily.json`, 45 remarks, 20 builders, data gate pass, Obsidian sync success, and afternoon skill output with 26 items. | Correct direction. The lane must not depend solely on local Codex automation; GitHub fallback is a valid morning recovery. But local 08:30 misses should be recorded as local automation reliability issues, not confused with data-quality failures. |

## Failure Categories and Correct Repair Path

| Category | Symptoms | Do first | Do not do |
|---|---|---|---|
| supervision_observability | Missing daily report, GitHub CLI timeout, but data may be healthy | Inspect `follow-builders-daily.json`, latest gate, manifest, and timeline files | Do not dispatch or rerun just because `gh` timed out |
| local_rss_cron_missed | 08:30 local Codex RSS collection did not run or left stale data | Let 09:17 / 09:47 GitHub fallback run; inspect local automation logs separately | Do not call the afternoon skill route as a substitute for morning RSS data |
| github_rss_publication | RSS build/gate passed but commit/PR failed | Repair staging/PR/merge only, especially ignored report staging | Do not rerun RSS collection unless source data is stale or gate failed |
| data_gate_failure | `assert-follow-builders-data.mjs` fails on counts, translation, URL, dedupe, tags, or freshness | Repair the builder data build or source translation path | Do not weaken translation, URL, or tag gates |
| obsidian_sync_failure | Same-date person/date timeline files missing or second sync adds entries unexpectedly | Repair `sync-follow-builders-to-opinion-timelines.mjs` or idempotency logic | Do not accept old `YYYY-MM.md` month files as success |
| prewindow_false_alarm | Hermes reports failure before 09:55 RSS handoff or before 16:30 skill record | Fix supervision window gating | Do not create Codex inbox items before the lane's valid check window |
| afternoon_skill_runner | PowerShell/local script invocation fails or publish report missing after 16:30 | Repair `run-follow-builders-skill.ps1` or local publisher | Do not judge this lane from morning RSS data only |
| afternoon_count_mismatch | Output file count and publish report count disagree, or either count is 0 | Regenerate report from output and enforce count consistency | Do not close Hermes because a report file merely exists |

## Better Monitoring Path

Use two independent but coordinated paths:

1. Morning RSS page path:
   - 08:30 local Codex `builder-observation-daily-sync` runs blog RSS fetch, podcast RSS fetch, page-data build, data gate, and Obsidian sync.
   - 09:17 / 09:47 GitHub fallback runs the same page-data and Obsidian path if same-date data is missing.
   - 09:55 Hermes checks only after both fallback windows and no active run remain.
   - Success requires same-date `follow-builders-daily.json`, remarks > 0, builders >= 6, data gate pass, same-date person/date timeline files, and no generic `Builder viewpoint` frontstage tag leakage.

2. Afternoon all-builders skill path:
   - 16:10 local `follow-builders` skill publisher generates `01-SiteV2/content/07-points/<date>-builders-viewpoints.md`.
   - 16:30 Hermes records it.
   - Success requires output file present, output frontmatter `builder_items_count > 0`, publish report present, report count > 0, and report count matching output count.
   - This path is a full discovery archive. It must not block the morning public page if RSS page-data is already healthy.

## Speed and Reliability Recommendations

- Keep First-Line separate from Business Signals and Community Intelligence. It has different source dependencies and should not be blocked by Raw / Pool / Card failures.
- Keep GitHub fallback because it is fast: successful recent runs finished in about 1 minute. The local 08:30 route is useful for RSS collection and Obsidian sync, but it should not be the only morning path.
- Fetch builder blog RSS and podcast RSS as parallel source steps where possible, then build once after both finish. This reduces wall-clock time without changing quality gates.
- Do not run the afternoon skill route before 16:10; upstream follow-builders data typically lands later in the day.
- Add report-count consistency as a hard gate for the afternoon skill route so stale or mismatched reports cannot hide a broken publish.

## Skill Updates Required

- Add a First-Line failure router that distinguishes morning RSS, GitHub publication, Obsidian sync, pre-window false alarm, and afternoon skill publish failures.
- Add a morning fast path with explicit 09:55 handoff discipline.
- Add an afternoon count-consistency rule.
- Add memory that local 08:30 misses are recoverable through GitHub fallback but must still be recorded as local automation reliability issues.
- Add an eval that rejects old month timeline files and report-only success.

## Status After Review

- Current 2026-06-14 page data gate passes.
- Current `follow-builders-daily.json` has 45 remarks and 20 builders.
- Current 2026-06-14 afternoon skill output has 26 builder items and its publish report records 26.
- The remaining improvement is to make future failures classify earlier and avoid false positives or report-only success.
