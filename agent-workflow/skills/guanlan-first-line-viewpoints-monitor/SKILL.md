---
name: guanlan-first-line-viewpoints-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI current SITE-V3.4.0 First-Line Viewpoints lane. Covers builders / follow-builders data refresh, Chinese translation gate, original URL and tag checks, fallback safety, Obsidian person/date timeline sync, idempotent morning/afternoon publication checks, Hermes repair closure, and lane-specific self-improvement. Do not use for Business Signals, Signal Cards, relationship graph evidence, trend candidates, or Community Intelligence.
metadata:
  guanlan:
    version: "1.0.3"
    lane: "First-Line Viewpoints"
    status: "current lane owner"
    order: 20
    responsibility: "Own First-Line Viewpoints supervision and repair: builders data, Chinese translation, formal tags, and Obsidian person/date timelines."
    upstream: "follow-builders source data, builders workflow, Hermes inbox"
    downstream: "follow-builders-daily.json, frontstage page data, Obsidian opinion timelines, PR publication"
    gates: "builders data assertion, translation gate, URL/tag checks, sync idempotency"
    recent_learning: "Obsidian timelines are keyed by source original date, so same-day health must use sync dry-run added=0; afternoon reports must expose publish_status, publish_error, and Obsidian sync counts."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan First-Line Viewpoints Monitor

This skill owns the First-Line Viewpoints lane. It supervises builders data generation, frontstage JSON, translation quality, formal tags, fallback behavior, Obsidian person/date timeline sync, and lane repair.

The lane has two production routes: the morning RSS / podcast refresh that feeds `follow-builders-daily.json`, and the afternoon local `follow-builders` skill publish that emits `01-SiteV2/content/07-points/<date>-builders-viewpoints.md`.

It may call the generic `follow-builders` skill for source / digest behavior, but this skill is the WaveSight lane owner.

## Current Timing

- Morning local Codex RSS collection/build/sync: 08:30 Asia/Shanghai via `builder-observation-daily-sync`.
- GitHub RSS fallback window: 09:17 Asia/Shanghai.
- Hermes RSS handoff: 09:30 Asia/Shanghai, after the local run and the single 09:17 fallback window.
- Afternoon local `follow-builders` skill publish: 16:10 Asia/Shanghai; Hermes records it at 16:30.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/version-ledger.md`
4. `context/08-v3-3-automation.md`
5. `context/09-v3-3-current-action-index.md`
6. Relevant First-Line Viewpoints report, Hermes inbox item, workflow log, or gate output.

For implementation detail, read:

- `agent-workflow/skills/follow-builders/SKILL.md`
- `agent-workflow/tools/assert-follow-builders-data.mjs`
- `agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs`
- `01-SiteV2/site/scripts/build-follow-builders-page-data.mjs`

For regression prevention, read `evals/first-line-viewpoints-monitor-evals.md`. When repairing translation or timeline sync, also read `examples/good-timeline-entry.md` and `examples/bad-untranslated-remark.md`. Read `MEMORY.md` only when a failure resembles a previous incident or when updating this skill.
When repairing repeated morning or afternoon monitoring failures, also read `examples/good-first-line-failure-router.md` and the latest first-line weekly failure review report.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Check daily supervision and Hermes inbox for the First-Line Viewpoints lane.
3. Build or inspect `01-SiteV2/site/data/follow-builders-daily.json`.
4. Run or inspect `assert-follow-builders-data.mjs`.
5. Sync gated run data into `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<original-date>.md`, then confirm a same-date dry run reports `added: 0`.
6. Verify sync idempotency with a second run or dry run that adds `0` entries.
7. Publish the afternoon follow-builders skill output through its branch / PR route and verify the local publish report.
8. Stage / publish only first-line owned files through the automation PR route.
9. Add or tighten evals before adding long prose when a failure recurs.
10. Close Hermes inbox items only after validation and prevention are recorded.

## Failure Router

Classify a failure before rerunning anything:

- `supervision_observability`: daily report missing or GitHub lookup timed out while same-date data may be healthy.
- `local_rss_cron_missed`: the 08:30 local Codex RSS collection/build/sync did not run or left stale page data.
- `github_rss_publication`: GitHub RSS build/gate/sync passed but commit, PR, merge, or Pages failed.
- `data_gate_failure`: `assert-follow-builders-data.mjs` failed on freshness, count, translation, URL/id, dedupe, or formal tags.
- `obsidian_sync_failure`: original-date person/date timeline files are missing or sync is not idempotent.
- `prewindow_false_alarm`: Hermes checked before 09:30 for RSS or before 16:30 for the afternoon skill lane.
- `afternoon_skill_runner`: the local `follow-builders` skill publisher failed or did not write its output/report after 16:30.
- `afternoon_count_mismatch`: the output file count and publish report count disagree, or either is zero.
- `afternoon_publication_failure`: the afternoon feed/archive output, report, and Obsidian sync are healthy, but branch push, PR creation, PR merge, or Pages publication failed. If same-day reruns fail with `stale info` or `force-with-lease` rejection after a previous PR deleted the remote automation branch, prune stale remote refs and rerun the publication path rather than reclassifying the feed as failed.

Repair the earliest category and rerun the smallest validation. Do not substitute the afternoon skill route for missing morning RSS page data.

## Morning Fast Path

Use this path for the public First-Line Viewpoints page:

1. At 08:30, local Codex `builder-observation-daily-sync` runs blog RSS fetch, podcast RSS fetch, page-data build, data gate, and Obsidian sync.
2. At 09:17, GitHub fallback may run the same RSS page-data path when same-date data / timelines are missing.
3. At 09:30, Hermes checks after the local attempt and the single GitHub fallback window. If the 09:17 fallback failed, same-date data is still unhealthy, and no run is active, Hermes takes over and dispatches the RSS workflow.
4. Success means:
   - same-date `follow-builders-daily.json`;
   - remarks count greater than `0` and builders count at least `6`;
   - `assert-follow-builders-data.mjs --date=<date>` passes;
   - gated records are present in person/date Obsidian timeline files keyed by original source date;
   - a second sync or dry run adds `0` entries;
   - frontstage data does not contain the generic tag `Builder viewpoint`.
5. Do not treat zero `### <run-date>` headings as missing sync by itself. A run can be healthy when all source items have earlier original dates and dry-run sync reports `added: 0`.
6. If the 08:30 local run misses but GitHub fallback produces healthy same-date data, classify the local miss as an automation reliability issue, not a data-quality failure.

## Afternoon Skill Path

The afternoon local `follow-builders` skill lane is a discovery archive, not the public page-data gate.

Success after 16:30 requires:

- `01-SiteV2/content/07-points/<YYYY-MM-DD>-builders-viewpoints.md` exists;
- the output frontmatter `builder_items_count` is greater than `0`;
- generated skill viewpoints are synced into `01-SiteV2/knowledge/02-Opinion-Timelines/`;
- `agent-workflow/reports/<YYYY-MM-DD>-follow-builders-skill-local-publish.md` exists;
- the report `builder_items_count` is greater than `0`;
- the report count matches the output count.
- the report includes Obsidian sync counts.
- the report does not contain `publish_status: failed` or a `Publish Failure` section;
- Hermes can parse `publish_status`, `publish_error`, and `obsidian_sync_*` counts from the report;
- the automation branch was pushed, the PR was merged to `main`, and GitHub Pages completed when the local task runs with `-Merge`.

If the report exists but records `0` while the output contains items, or if the report lacks Obsidian sync counts, repair or regenerate the report before closing Hermes.
If the report shows healthy feed/archive counts but a publish failure, repair the publication path only. Do not rerun or blame the upstream builders feed unless the output file itself is stale, missing, or zero-count.

## Lane Boundaries

- Builder viewpoints are independent public viewpoints.
- Do not write Business Signal Cards, relationship graph evidence, trend candidates, or Community Intelligence data.
- Do not use `01-SiteV2/content/05-frontier-opinions/*` as current evidence.
- Do not treat old `YYYY-MM.md` month files as current sync success.
- Do not allow untranslated English as primary Chinese frontstage text.
- Do not treat a report file's existence as publish success when its item count is zero or mismatched.
- Do not let the afternoon skill lane block the morning public page when the RSS page-data gate and Obsidian sync are healthy.

## Reporting

When finishing, report:

- lane status;
- builders data date and item counts;
- data gate result;
- Obsidian sync result and idempotency result;
- files changed;
- prevention artifact added or not needed;
- Hermes inbox item status;
- commit / PR / deployment status when relevant.
