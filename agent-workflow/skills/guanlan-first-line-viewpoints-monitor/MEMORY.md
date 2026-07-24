# Guanlan First-Line Viewpoints Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-07-18 Translation Provenance

- Repeated English or mistranslated primary text was caused by treating translation as an optional fallback and allowing legacy public-MT cache entries. Production now requires DeepSeek credentials, matching source hashes, model provenance, and a fidelity gate; missing or incomplete translation blocks publication.
- Flash owns titles and short text. Pro owns long/complex text and quality retries. Provider failure must be surfaced immediately instead of hidden behind untranslated source text.

## 2026-07-24 Afternoon Scheduler Observability

- A single 16:10 interactive Windows trigger with `WakeToRun=false` can miss an afternoon archive while the 09:50 supervisor has already marked the not-yet-due lane `passed`. The task must wake the machine, retry bounded failures, and force a post-run supervision refresh.
- Exact-date afternoon reports and outputs already merged to `origin/main` outrank a stale working tree. Historical morning health is proved by the exact-date passed gate plus successful manifest, not by comparing the current mutable JSON date to an older audit date.

## 2026-06-21 Supervision Classification

- First-Line morning RSS health is local-data-first: if `follow-builders-daily.json` is same-date, remarks and builders meet floors, and `assert-follow-builders-data` passes, the public lane is healthy even when GitHub workflow lookup has no same-date run.
- A missing same-date GitHub fallback run is not a failure when local 08:30 data / gate already passed. Report it only as observability or local automation evidence, not as a reason to dispatch another RSS workflow.
- After local repair writes the same-date gate, rerun daily supervision or resolve the stale Hermes inbox. Do not let a pre-repair missing-gate report override the newer passed gate.

## 2026-06-30 Original-Date Sync And Publish Reports

- First-Line Obsidian timelines are keyed by each source item's original date, not the production run date. A same-day run can have zero `### <run-date>` headings and still be healthy if `sync-follow-builders-to-opinion-timelines --from=<run-date> --to=<run-date> --dry-run=true` reports `added: 0`.
- The morning GitHub fallback must skip when same-date `follow-builders-daily.json` exists and sync dry-run is idempotent; counting only same-day headings creates duplicate PRs.
- Afternoon skill reports must expose `publish_status`, `publish_error`, and `obsidian_sync_*` counts. `publish_status: failed` is a real lane failure even if feed/archive output exists.
- If a same-date afternoon publish report, output count, and Obsidian sync counts are already healthy, the local publisher should skip instead of opening another PR.

## 2026-06-12

- Current First-Line Viewpoints success requires both fresh frontstage JSON and Obsidian person/date timeline persistence. Old month files such as `YYYY-MM.md` are legacy evidence, not current sync proof.

## 2026-06-13

- The afternoon `run-follow-builders-skill.ps1` task is the first validation point for the local publish route. If it shells out with PowerShell array splatting incorrectly, Hermes will report a missing same-date publish report and missing `01-SiteV2/content/07-points/<date>-builders-viewpoints.md` even when the skill data itself is healthy.

## 2026-06-14

- First-Line Viewpoints has two different health paths: morning RSS page-data plus Obsidian sync, and afternoon all-builders skill archive. Do not use one as proof that the other is healthy.
- A local 08:30 Codex RSS miss is recoverable through the single 09:15 conditional fallback, but it should still be recorded as local automation reliability drift.
- Supervision / Daily Problem Watchdog must not report First-Line RSS missing before the 09:50 consolidated closure, and must not report the afternoon skill lane missing before the 16:30 record window.
- Afternoon skill success requires count consistency: output frontmatter `builder_items_count > 0`, publish report `builder_items_count > 0`, and both counts matching. A report that exists with count `0` is not a healthy publish.

## 2026-06-18

- Afternoon builders feed/archive generation can succeed while publication fails later at branch push, PR merge, or Pages. Treat this as `afternoon_publication_failure`, not as a builders feed failure.
- Same-day reruns after a merged PR may hit stale remote branch refs because the remote automation branch was deleted. Prune remote refs before `force-with-lease`, and require the publish report or supervision closeout to expose unresolved `Publish Failure` sections.
