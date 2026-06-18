# Guanlan First-Line Viewpoints Monitor Memory

Keep this file short. Add only durable lane-level lessons from repeated production failures.

## 2026-06-12

- V3.3.6+ First-Line Viewpoints success requires both fresh frontstage JSON and Obsidian person/date timeline persistence. Old month files such as `YYYY-MM.md` are legacy evidence, not current sync proof.

## 2026-06-13

- The afternoon `run-follow-builders-skill.ps1` task is the first validation point for the local publish route. If it shells out with PowerShell array splatting incorrectly, Hermes will report a missing same-date publish report and missing `01-SiteV2/content/07-points/<date>-builders-viewpoints.md` even when the skill data itself is healthy.

## 2026-06-14

- First-Line Viewpoints has two different health paths: morning RSS page-data plus Obsidian sync, and afternoon all-builders skill archive. Do not use one as proof that the other is healthy.
- A local 08:30 Codex RSS miss is recoverable through the single 09:17 GitHub fallback, but it should still be recorded as local automation reliability drift.
- Hermes must not report First-Line RSS missing before the 09:30 handoff window, and must not report the afternoon skill lane missing before the 16:30 record window.
- Afternoon skill success requires count consistency: output frontmatter `builder_items_count > 0`, publish report `builder_items_count > 0`, and both counts matching. A report that exists with count `0` is not a healthy publish.

## 2026-06-18

- Afternoon builders feed/archive generation can succeed while publication fails later at branch push, PR merge, or Pages. Treat this as `afternoon_publication_failure`, not as a builders feed failure.
- Same-day reruns after a merged PR may hit stale remote branch refs because the remote automation branch was deleted. Prune remote refs before `force-with-lease`, and require the publish report or supervision closeout to expose unresolved `Publish Failure` sections.
