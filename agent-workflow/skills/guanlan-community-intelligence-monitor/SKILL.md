---
name: guanlan-community-intelligence-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI current SITE-V3.4.0 Community Intelligence lane. Covers local logged-in collection, archive generation, community data gate, local publish handoff, Waiting-vs-Problem publication checks, GitHub publish PR, Hermes repair closure, and lane-specific self-improvement. Do not use for Business Signals facts, Signal Cards, relationship graph evidence, trend candidates, or First-Line Viewpoints.
metadata:
  guanlan:
    version: "1.0.3"
    lane: "Community Intelligence"
    status: "current lane owner"
    order: 30
    responsibility: "Own Community Intelligence supervision and repair: local logged-in collection, archive outputs, community data gate, and publication handoff."
    upstream: "local Windows collection, community publish workflow, Hermes inbox"
    downstream: "community frontstage data, archive snapshots, community PR publication"
    gates: "local collection availability, community data assertion, archive presence, publication completeness"
    recent_learning: "Healthy same-date community data with an open PR or queued publish workflow is Waiting, not a collection failure or repair inbox."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Community Intelligence Monitor

This skill owns the Community Intelligence lane. It supervises local logged-in collection, community frontstage data, Obsidian archive output, community data gate, and publication through the community PR workflow.

## Current Timing

- Local logged-in collection: 08:30 Asia/Shanghai via Windows task `WaveSight Community Intelligence Daily`.
- Codex local fallback / repair window: about 09:00 Asia/Shanghai via automation `community-intelligence-daily-local`. It must first check same-date community data, archive, and gate; if they are healthy, report no-op instead of recollecting.
- GitHub publish windows for already-collected data: 08:45 and 10:45 Asia/Shanghai.
- Daily Problem Watchdog records failed publish runs to Hermes inbox. It must not rerun local collection or dispatch recovery.
- GitHub Actions can publish validated community files, but cannot replace local Chrome / logged-in collection.
- Do not classify same-date data as missing before the first Community Intelligence check window. Before 08:45 Asia/Shanghai, stale data is normally yesterday's completed state unless a local collector failure log already exists.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/version-ledger.md`
4. `context/08-v3-3-automation.md`
5. `context/09-v3-3-current-action-index.md`
6. Relevant Community Intelligence report, Hermes inbox item, local log, workflow log, or gate output.

For implementation detail, read:

- `agent-workflow/tools/run-community-intelligence.ps1`
- `agent-workflow/tools/publish-community-intelligence-local.mjs`
- `agent-workflow/tools/assert-community-intelligence-data.mjs`
- `01-SiteV2/site/scripts/collect-community-intelligence.mjs`
- `01-SiteV2/site/scripts/archive-community-intelligence.mjs`

For regression prevention, read `evals/community-intelligence-monitor-evals.md`. When repairing lead handling or cross-lane promotion boundaries, also read `examples/good-community-lead.md` and `examples/bad-unverified-fact-promotion.md`. Read `MEMORY.md` only when a failure resembles a previous incident or when updating this skill.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Check daily supervision and Hermes inbox for the Community Intelligence lane.
3. Confirm whether local collection ran and whether the local Chrome / login state was available.
4. Validate community data with `npm run assert:community-intelligence -- --date=<YYYY-MM-DD>`.
5. Confirm archive outputs and daily snapshots exist.
6. Publish only validated community-owned files through the community automation PR route.
7. Treat local collection success without PR / merge / Pages publication as incomplete publication.
8. When same-date data, archive, and gate are healthy, report open PRs or queued / in-progress publish workflows under Waiting, not Problems.
9. Add or tighten evals before adding long prose when a failure recurs.
10. Close Hermes inbox items only after validation and prevention are recorded.

## Failure Router

Classify Community Intelligence failures by the earliest broken stage. Do not rerun the full lane blindly.

| Stage | Evidence | Action |
|---|---|---|
| Pre-window stale data | Before 08:45 Asia/Shanghai, `community-intelligence.json` still shows the previous production date and there is no same-day local failure log | Wait until 08:45 / 09:30; do not create a failure inbox yet. |
| Local collection missing | After 08:45, same-date data / daily snapshot / archive is missing, or the local log shows Chrome / login / collector failure | Repair or rerun `agent-workflow/tools/run-community-intelligence.ps1` locally; GitHub cannot collect this lane. |
| Local gate failed | Same-date data exists but `assert-community-intelligence-data.mjs` fails | Fix data shape, item/link floors, collector errors, or archive outputs, then rerun the gate. |
| Publish workflow failed before gate | GitHub publish run fails while same-date local files are absent or stale on `main` | Stop GitHub retries; run local collection / archive first. |
| Publish workflow shell / PR failure | Local data is healthy, but publish workflow fails in shell, branch, PR, auto-merge, or permissions | Repair workflow / PR handling only; do not rerun browser collection unless local data changed. |
| Publication waiting | Same-date local data, archive, and gate are healthy, and a same-date PR is open or publish workflow is queued / in progress | Report Waiting and recheck; do not create a Hermes repair inbox or rerun collection. |
| Published but not deployed | PR merged but Pages is not updated yet | Wait for Pages or inspect GitHub Pages workflow; local collection is already complete. |

## 2026-06-08 To 2026-06-14 Review Lessons

- 2026-06-08 had no current Community Intelligence supervision artifact. Treat this as a coverage gap from the V3.3.2 rollout, not as a content failure.
- 2026-06-09 to 2026-06-12 passed the community data gate when local collection, archive, and publish checks were run.
- 2026-06-13 failed morning supervision because the report saw 2026-06-12 data and no same-date publish run; the later local task produced 61 items / 58 links, passed the gate, opened PR #46, and merged commit `1bdabf15`.
- 2026-06-13 also exposed a publish-workflow classification problem: early manual GitHub runs failed before local same-date files were available or during PR/auto-merge handling. These are publish-stage failures, not evidence that community sources were scarce.
- 2026-06-14 early failure was a pre-window false positive at 03:17 Asia/Shanghai. The correct rule is to wait for the 08:45 / 09:30 community windows unless an explicit local collector failure log already exists. The 08:30 task later produced same-date data, passed the gate, opened PR #66, and merged commit `9869b4e3`.
- Weekend data volume was not the blocker this week: Saturday and Sunday still produced 61+ items and 57+ links, far above the 12 item / 3 link floors. Weekend handling should therefore keep normal gates and focus on local-run/publish sequencing.

## Faster Morning Path

The preferred before-10:00 path is:

1. 08:30 local task runs collection, archive, gate, and local publish handoff in one local path.
2. 08:45 supervision checks only local output and gate presence. If missing, classify as local collection missing and hand off to Codex / human local repair.
3. About 09:00, Codex automation may run a local fallback / repair pass. It should skip recollection when same-date data, archive, and gate are already healthy.
4. 09:30 supervision checks publication. If local output exists but publish is missing, record a targeted problem instead of rerunning collection.
5. Daily Problem Watchdog records failed publish workflows to Hermes inbox and never retries the browser collector in GitHub.
6. 10:50 confirms PR merge and Pages. If Pages is still running, report waiting rather than local failure.

## 2026-06-30 Publication Waiting Rule

- Same-date local data, daily snapshot, Obsidian archive, selected keywords, links, and `assert:community-intelligence` passing are enough to mark collection healthy.
- An open same-date Community Intelligence PR or queued / in-progress publish workflow after healthy local data is a Waiting state, not a Problem.
- Waiting-only publication state must not create Hermes repair inbox items.
- If a later same-date PR merges and Pages succeeds, resolve stale Hermes red states without recollecting.

## Lane Boundaries

- Community posts are leads, not verified Business Signals.
- Do not generate Signal Cards, relationship graph evidence, or trend candidates from community material unless it is separately verified through Raw / Pool.
- Do not write First-Line Viewpoints data.
- Do not expect GitHub Actions to run the logged-in local collector; GitHub can only publish already-generated validated community files.
- Do not force local browser state, credentials, or uncommitted workspace sync.

## Reporting

When finishing, report:

- lane status;
- local collection status;
- community gate result;
- archive / daily snapshot status;
- publication PR / merge / Pages status;
- Waiting vs Problems split when publication is still open or queued;
- files changed;
- prevention artifact added or not needed;
- Hermes inbox item status.
