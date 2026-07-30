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
- After local repair writes the same-date gate, rerun Daily Closure or resolve the stale production incident. Do not let a pre-repair missing-gate report override the newer passed gate.

## 2026-07-30 External Guanlan Vault Boundary

- First-Line publication health is proved by repository production data, gates, count consistency and PR/Pages closure. GitHub Actions do not write a local knowledge base.
- The external Guanlan AI Vault projects deduplicated person timelines from accepted data only after local `main` sync. A Vault projection failure cannot be repaired by rerunning the source feed.
- Afternoon skill reports expose `publish_status`, `publish_error`, and `builder_items_count`. `publish_status: failed` is a real lane failure even if feed output exists.
- If a same-date afternoon publish report, output count and V4 afternoon projection are already healthy, the local publisher should skip instead of opening another PR.

## 2026-06-13

- The afternoon `run-follow-builders-skill.ps1` task is the first validation point for the local publish route. If it shells out with PowerShell array splatting incorrectly, lane supervision will report a missing same-date publish report and missing `01-SiteV2/content/07-points/<date>-builders-viewpoints.md` even when the skill data itself is healthy.

## 2026-06-14

- First-Line Viewpoints has two different health paths: morning RSS page-data and afternoon all-builders skill output. Do not use one as proof that the other is healthy.
- A local 08:30 Codex RSS miss is recoverable through the single 09:15 conditional fallback, but it should still be recorded as local automation reliability drift.
- Supervision / Daily Problem Watchdog must not report First-Line RSS missing before the 09:50 consolidated closure, and must not report the afternoon skill lane missing before the 16:30 record window.
- Afternoon skill success requires count consistency: output frontmatter `builder_items_count > 0`, publish report `builder_items_count > 0`, and both counts matching. A report that exists with count `0` is not a healthy publish.

## 2026-06-18

- Afternoon builders feed/archive generation can succeed while publication fails later at branch push, PR merge, or Pages. Treat this as `afternoon_publication_failure`, not as a builders feed failure.
- Same-day reruns after a merged PR may hit stale remote branch refs because the remote automation branch was deleted. Prune remote refs before `force-with-lease`, and require the publish report or supervision closeout to expose unresolved `Publish Failure` sections.
