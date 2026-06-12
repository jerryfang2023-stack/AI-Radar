---
name: guanlan-first-line-viewpoints-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI V3.3.5 First-Line Viewpoints lane. Covers builders / follow-builders data refresh, Chinese translation gate, original URL and tag checks, fallback safety, Obsidian person/date timeline sync, PR publication, Hermes repair closure, and lane-specific self-improvement. Do not use for Business Signals, Signal Cards, relationship graph evidence, trend candidates, or Community Intelligence.
---

# Guanlan First-Line Viewpoints Monitor

This skill owns the First-Line Viewpoints lane. It supervises builders data generation, frontstage JSON, translation quality, formal tags, fallback behavior, Obsidian person/date timeline sync, and lane repair.

It may call the generic `follow-builders` skill for source / digest behavior, but this skill is the WaveSight lane owner.

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

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Check daily supervision and Hermes inbox for the First-Line Viewpoints lane.
3. Build or inspect `01-SiteV2/site/data/follow-builders-daily.json`.
4. Run or inspect `assert-follow-builders-data.mjs`.
5. Sync same-date data into `01-SiteV2/knowledge/02-Opinion-Timelines/people/<person>/<YYYY-MM-DD>.md`.
6. Verify sync idempotency with a second run or dry run that adds `0` entries.
7. Stage / publish only first-line owned files through the automation PR route.
8. Add or tighten evals before adding long prose when a failure recurs.
9. Close Hermes inbox items only after validation and prevention are recorded.

## Lane Boundaries

- Builder viewpoints are independent public viewpoints.
- Do not write Business Signal Cards, relationship graph evidence, trend candidates, or Community Intelligence data.
- Do not use `01-SiteV2/content/05-frontier-opinions/*` as current evidence.
- Do not treat old `YYYY-MM.md` month files as V3.3.5 sync success.
- Do not allow untranslated English as primary Chinese frontstage text.

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
