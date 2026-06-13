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
   - Pass when Hermes three-lane early handoff checks First-Line Viewpoints RSS at 09:55 Asia/Shanghai, after the 08:30 local Codex RSS collection/build/sync attempt and the 09:17 / 09:47 GitHub fallback windows, and dispatches `.github/workflows/daily-first-line-viewpoints-pr.yml` if same-date builders data / Obsidian person-date timelines are missing and no run is active.
   - Fail when the lane waits until the old 10:30 supervision check without an early report, dispatch action, and Codex handoff path.

10. `afternoon_follow_builders_skill_lane`
   - Pass when the local afternoon `follow-builders` skill route writes `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md`, records `agent-workflow/reports/<YYYY-MM-DD>-follow-builders-skill-local-publish.md`, and Hermes records the lane at 16:30.
   - Fail when the afternoon skill route is judged from morning RSS data only or when a missing 16:30 publish report is ignored.

## Repair Loop

When a check fails, repair the builder data source, build script, gate, or timeline sync path. Do not unblock the lane by weakening translation, source URL, or idempotency requirements.
