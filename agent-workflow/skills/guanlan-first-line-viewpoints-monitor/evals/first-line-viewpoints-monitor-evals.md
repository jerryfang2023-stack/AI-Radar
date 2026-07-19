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
   - Pass when the run's gated viewpoints are written under `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<original-date>.md`.
   - Pass when a same-day run has no same-day heading because all source items have earlier original dates, as long as the sync dry-run is idempotent.

7. `obsidian_sync_idempotent`
   - Pass when a second same-date sync or dry run reports `added: 0`.
   - Fail when a workflow reruns only because it counted zero `### <run-date>` headings, without checking sync dry-run idempotency.

8. `lane_isolation`
   - Pass when the First-Line Viewpoints PR stages no Business Signals, relationship graph, trend candidate, or Community Intelligence data.

9. `daily_problem_watchdog`
   - Pass when Daily Problem Watchdog records First-Line Viewpoints failures to Hermes inbox after the 08:30 local Codex RSS collection/build/sync attempt, the single 09:15 conditional fallback, and the 09:50 consolidated closure check.
   - Pass when the watchdog does not dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` or any recovery workflow.
   - Fail when the lane waits until the old 10:30 supervision check or uses Hermes recovery / early handoff instead of a problem report and Codex inbox path.

10. `afternoon_follow_builders_skill_lane`
    - Pass when the local afternoon `follow-builders` skill route writes `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`, syncs the generated skill viewpoints into `01-SiteV2/knowledge/02-Opinion-Timelines/`, records `agent-workflow/reports/<YYYY-MM-DD>-follow-builders-skill-local-publish.md`, and Hermes records the lane at 16:30.
    - Pass when the local task running with merge enabled also pushes the automation branch, merges the PR to `main`, and waits for GitHub Pages publication or writes an explicit publish failure.
    - Fail when the afternoon skill route is judged from morning RSS data only, when a missing 16:30 publish report is ignored, when Obsidian sync counts are missing from the report, or when feed/archive generation success is treated as full publication success without branch / PR / Pages closure.

11. `first_line_failure_router`
    - Pass when a failure is categorized as `supervision_observability`, `local_rss_cron_missed`, `github_rss_publication`, `data_gate_failure`, `history_backfill_failure`, `v4_projection_failure`, `obsidian_sync_failure`, `prewindow_false_alarm`, `afternoon_skill_runner`, `afternoon_count_mismatch`, or `afternoon_publication_failure`.
    - Pass when the repair targets the earliest category and reruns the smallest relevant validation.
    - Fail when RSS collection, Obsidian sync, GitHub publication, and afternoon skill publish are treated as one generic rerun problem.

12. `morning_rss_problem_window`
    - Pass when supervision waits until the 09:50 consolidated closure before declaring First-Line RSS missing, after the 08:30 local Codex run and the single 09:15 conditional fallback.
    - Pass when a healthy GitHub fallback can recover a missed local 08:30 run, while the local miss is still recorded as automation reliability drift.
    - Fail when Daily Problem Watchdog creates a First-Line RSS repair inbox before the 09:50 consolidated closure while recovery may still be active.

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
    - Fail when Hermes ignores `publish_status: failed`, `publish_error`, or missing `obsidian_sync_*` counts in `agent-workflow/reports/<date>-follow-builders-skill-local-publish.md`.

16. `local_data_precedence_in_supervision`
    - Pass when daily supervision treats same-date `follow-builders-daily.json`, remarks / builders floors, and a passed follow-builders data gate as sufficient public-lane health.
    - Pass when missing or unavailable GitHub workflow state is only an observability warning while local same-date data and gate are healthy.
    - Pass when a stale Hermes inbox generated before local repair is resolved or regenerated after the newer same-date gate passes.
    - Fail when supervision dispatches `.github/workflows/daily-first-line-viewpoints-pr.yml` only because no same-date GitHub run exists, while local same-date data and the data gate already pass.

17. `deepseek_translation_provenance`
    - Pass when every generated translation records `deepseek_translation`, the selected Flash or Pro model, and a source hash matching the preserved original text.
    - Pass when titles and short text use Flash, while text over 600 characters, three or more paragraphs, or a failed Flash quality check uses Pro.
    - Fail when active output reuses MyMemory, a failed cache entry, a cache entry for a different source hash, or an unrecorded model.

18. `translation_fidelity`
    - Pass when URLs, handles, hashtags, dates, amounts, percentages, and other factual tokens are preserved and full-text fields are translated completely rather than summarized.
    - Fail when an English primary field remains, a long post is shortened into a summary, or a factual token changes.

19. `translation_credential_gate`
    - Pass when a missing `DEEPSEEK_API_KEY` or failed/incomplete translation blocks publication before page-data generation is accepted.
    - Fail when the lane silently falls back to untranslated English or generic public machine translation.

20. `history_snapshot_provenance`
    - Pass when `first-line-viewpoints-history.json` is reconstructed only from committed `follow-builders-daily.json` snapshots and records source commit/snapshot counts plus each record's original URL and source snapshot.
    - Fail when search results, local drafts, or the afternoon archive are inserted as historical public records without committed morning evidence.

21. `history_gate_parity`
    - Pass when every published historical record passes the same complete Chinese translation, approved method/model, matching source hash, AI-relevance, opinion-tag, author, original-date, and original-URL requirements as current morning records.
    - Fail when a historical record bypasses any current public gate or when pending translations are published to increase volume.

22. `three_input_original_url_merge`
    - Pass when `first-line-viewpoints-v4.json` merges current morning, committed morning history, and afternoon intake by original URL; the current morning copy overrides history, and afternoon overlap changes coverage metadata without bypassing the morning public gate.
    - Fail when the same original URL appears twice, a historical copy overrides the current copy, or an afternoon-only item becomes public without passing the morning gate.

23. `history_release_closure`
    - Pass when the V4 gate confirms `currentMorningPublished + historicalPublished = remarks`, a non-empty historical segment for FLV-V1.1.0, a valid earliest/latest date range, morning and afternoon lane metadata, and consistent overlap counts.
    - Fail when only `follow-builders-daily.json` passes while the V4 projection is stale, history is absent, or published/current/historical counts disagree.

24. `history_backfill_is_not_routine_collection`
    - Pass when routine daily supervision reuses the accepted committed history asset and only rebuilds/translates history for an explicit backfill or repair.
    - Fail when every daily run performs an unnecessary network translation backfill or substitutes history generation for the current morning refresh.

## Repair Loop

When a check fails, repair the current source, historical backfill, V4 projection, gate, or timeline sync path. Do not unblock the lane by weakening translation, source URL, AI relevance, opinion tags, dedupe, or idempotency requirements.
