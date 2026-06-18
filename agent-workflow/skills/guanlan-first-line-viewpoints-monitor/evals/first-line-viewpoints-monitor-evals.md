# First-Line Viewpoints Monitor Evals

Run these pass/fail checks when supervising, repairing, or updating the First-Line Viewpoints lane.

## Required Checks

1. `lane_owner_loaded`
   - Pass when First-Line Viewpoints work routes through this skill before the generic `follow-builders` skill.

2. `frontstage_data_fresh`
   - Pass when `follow-builders-daily.json` exists for the active date or uses an explicitly fresh fallback with fallback metadata.

3. `translation_gate`
   - Pass when every frontstage remark has complete Chinese primary text and `translationStatus=translated`.

4. `source_and_dedupe_gate`
   - Pass when every remark has original URL / id, author identity, timestamp, and no duplicate id or URL.

5. `formal_tag_gate`
   - Pass when every remark has at least one `opinion`, one `track`, and one `source` formal tag.

6. `obsidian_person_date_sync`
   - Pass when same-date viewpoint entries are written under `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<YYYY-MM-DD>.md`.

7. `obsidian_sync_idempotent`
   - Pass when a second same-date sync or dry run reports `added: 0`.

8. `lane_isolation`
   - Pass when the First-Line Viewpoints PR stages no Business Signals, relationship graph, trend candidate, or Community Intelligence data.

9. `three_lane_early_handoff`
   - Pass when Hermes three-lane early handoff checks First-Line Viewpoints RSS at 09:30 Asia/Shanghai, after the 08:30 local Codex RSS collection/build/sync attempt and the single 09:17 GitHub fallback window, and dispatches `.github/workflows/daily-first-line-viewpoints-pr.yml` if the 09:17 fallback failed, same-date builders data / Obsidian person-date timelines are missing, and no run is active.
   - Fail when the lane waits until the old 10:30 supervision check without an early report, dispatch action, and Codex handoff path.

10. `afternoon_follow_builders_skill_lane`
    - Pass when the local afternoon `follow-builders` skill route writes `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`, syncs the generated skill viewpoints into `01-SiteV2/knowledge/02-Opinion-Timelines/`, records `agent-workflow/reports/<YYYY-MM-DD>-follow-builders-skill-local-publish.md`, and Hermes records the lane at 16:30.
    - Pass when the local task running with merge enabled also pushes the automation branch, merges the PR to `main`, and waits for GitHub Pages publication or writes an explicit publish failure.
    - Fail when the afternoon skill route is judged from morning RSS data only, when a missing 16:30 publish report is ignored, when Obsidian sync counts are missing from the report, or when feed/archive generation success is treated as full publication success without branch / PR / Pages closure.

11. `first_line_failure_router`
    - Pass when a failure is categorized as `supervision_observability`, `local_rss_cron_missed`, `github_rss_publication`, `data_gate_failure`, `obsidian_sync_failure`, `prewindow_false_alarm`, `afternoon_skill_runner`, `afternoon_count_mismatch`, or `afternoon_publication_failure`.
    - Pass when the repair targets the earliest category and reruns the smallest relevant validation.
    - Fail when RSS collection, Obsidian sync, GitHub publication, and afternoon skill publish are treated as one generic rerun problem.

12. `morning_rss_handoff_window`
    - Pass when Hermes waits until 09:30 Asia/Shanghai before declaring First-Line RSS missing, after the 08:30 local Codex run and the single 09:17 GitHub fallback window.
    - Pass when a healthy GitHub fallback can recover a missed local 08:30 run, while the local miss is still recorded as automation reliability drift.
    - Fail when Hermes creates a First-Line RSS repair inbox before the 09:30 handoff window.

13. `afternoon_skill_count_consistency`
    - Pass when `01-SiteV2/content/07-points/<date>-builders-viewpoints.md` frontmatter `builder_items_count` is greater than `0`, the local publish report count is greater than `0`, both counts match, and the report includes Obsidian sync counts.
    - Fail when the report exists but records `builder_items_count: 0`, when the output count is `0`, when report and output counts disagree, or when Obsidian sync is not recorded.

14. `report_existence_not_success`
    - Pass when First-Line success checks inspect the content and count inside gate/manifest/publish reports, not only the presence of the files.
    - Fail when a report-only success hides stale data, missing timelines, or a zero-count afternoon publish.

15. `afternoon_publication_closure`
    - Pass when the afternoon local task distinguishes feed/archive success from publication success: `builder_items_count > 0`, Obsidian sync counts are present, no `Publish Failure` section remains unresolved, the automation branch was pushed, the PR merged to `main`, and GitHub Pages succeeded when the task ran with `-Merge`.
    - Pass when same-day reruns prune stale remote branch refs before `git push --force-with-lease`, so a previous merged PR deleting `automation/follow-builders-skill-<date>` does not cause a false feed failure.
    - Fail when a `stale info` / `force-with-lease` rejection after a deleted remote automation branch is classified as feed failure.
    - Fail when the publish report says the feed/archive output is healthy but also contains `publish_status: failed`, and Hermes or Codex still reports the afternoon lane as fully complete.

## Repair Loop

When a check fails, repair the builder data source, build script, gate, or timeline sync path. Do not unblock the lane by weakening translation, source URL, or idempotency requirements.
