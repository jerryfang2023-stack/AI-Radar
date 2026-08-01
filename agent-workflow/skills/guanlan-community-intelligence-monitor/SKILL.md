---
name: guanlan-community-intelligence-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI Community Intelligence lane at CINT-V1.0.2-publication-waiting-gate. Covers local logged-in collection, archive generation, community data gate, local publish handoff, Waiting-vs-Problem publication checks, GitHub publish PR, production-incident closure, and lane-specific self-improvement. Do not use to create Claims, CanonicalEvents, RELATION-V2.1 rows, or First-Line Viewpoints.
metadata:
  guanlan:
    version: "1.1.0"
    lane: "Community Intelligence"
    status: "current lane owner"
    order: 30
    responsibility: "Own Community Intelligence supervision and repair: local logged-in collection, archive outputs, community data gate, and publication handoff."
    upstream: "local Windows collection, community publish workflow, production incident registry"
    downstream: "community frontstage data, archive snapshots, community PR publication"
    gates: "local collection availability, community data assertion, archive presence, publication completeness"
    recent_learning: "Healthy same-date community data with an open PR or queued publish workflow is Waiting, not a collection failure or repair inbox."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Community Intelligence Monitor

This skill owns the Community Intelligence lane. It supervises local logged-in collection, community frontstage data, the community data gate, and publication through the community PR workflow. The external Guanlan AI Vault receives a local readable projection only after accepted data reaches `main`.

## Current Timing

- Local logged-in collection: 08:30 Asia/Shanghai via Windows task `WaveSight Community Intelligence Daily`.
- Successful local collection owns the archive, gate, and publish handoff.
- Consolidated recovery: 09:15 Asia/Shanghai validates local data and records local Chrome/login repair when missing. GitHub publication is dispatch-only for targeted repair.
- Daily Problem Watchdog records failed publish runs to the production incident registry. It must not rerun local collection or dispatch recovery.
- GitHub Actions can publish validated community files, but cannot replace local Chrome / logged-in collection.
- Do not classify same-date data as missing before the first Community Intelligence check window. Before 08:45 Asia/Shanghai, stale data is normally yesterday's completed state unless a local collector failure log already exists.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/version-ledger.md`
4. `context/08-automation.md`
5. `context/09-current-action-index.md`
6. Relevant Community Intelligence report, production incident, legacy Hermes record, local log, workflow log, or gate output.

For implementation detail, read:

- `agent-workflow/tools/run-community-intelligence.ps1`
- `agent-workflow/tools/publish-community-intelligence-local.mjs`
- `agent-workflow/tools/assert-community-intelligence-data.mjs`
- `01-SiteV2/site/scripts/collect-community-intelligence.mjs`
- `agent-workflow/tools/build-guanlan-vault.mjs`

For regression prevention, read `evals/community-intelligence-monitor-evals.md`. When repairing lead handling or cross-lane promotion boundaries, also read `examples/good-community-lead.md` and `examples/bad-unverified-fact-promotion.md`. Read `MEMORY.md` only when a failure resembles a previous incident or when updating this skill.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Confirm whether local collection ran and whether the local Chrome/login state was available.
3. After collection and before archive generation, run `npm run translate:community-intelligence -- --date=<YYYY-MM-DD>`. Preserve `*Original`, model provenance, and `translationSourceHash`; failed translation blocks publication.
4. Check Daily Closure and the production incident registry for the lane.
5. Validate community data with `npm run assert:community-intelligence -- --date=<YYYY-MM-DD>`.
6. Confirm archive outputs and daily snapshots exist.
7. Publish only validated community-owned files through the community automation PR route when publication is authorized.
8. Treat local collection success without PR/merge/Pages publication as incomplete publication.
9. When same-date data, archive, and gate are healthy, report open PRs or queued/in-progress workflows under Waiting, not Problems.
10. Reject any English primary field, stale source hash, missing DeepSeek provenance, or translated record whose original was discarded.
11. Add or tighten evals before adding long prose when a failure recurs.
12. Close production incidents only after validation and prevention are recorded.

## Failure Router

Classify Community Intelligence failures by the earliest broken stage. Do not rerun the full lane blindly.

| Stage | Evidence | Action |
|---|---|---|
| Pre-window stale data | Before 08:45 Asia/Shanghai, `community-intelligence.json` still shows the previous production date and there is no same-day local failure log | Wait for the 08:45 local check and 09:15 consolidated recovery; do not create a failure inbox yet. |
| Local collection missing | After 08:45, same-date data / daily snapshot / archive is missing, or the local log shows Chrome / login / collector failure | Repair or rerun `agent-workflow/tools/run-community-intelligence.ps1` locally; GitHub cannot collect this lane. |
| Local gate failed | Same-date data exists but `assert-community-intelligence-data.mjs` fails | Fix data shape, item/link floors, collector errors, or archive outputs, then rerun the gate. |
| Publish workflow failed before gate | GitHub publish run fails while same-date local files are absent or stale on `main` | Stop GitHub retries; run local collection / archive first. |
| Publish workflow shell / PR failure | Local data is healthy, but publish workflow fails in shell, branch, PR, auto-merge, or permissions | Repair workflow / PR handling only; do not rerun browser collection unless local data changed. |
| Publication waiting | Same-date local data, archive, and gate are healthy, and a same-date PR is open or publish workflow is queued / in progress | Report Waiting and recheck; do not create a production incident or rerun collection. |
| Published but not deployed | PR merged but Pages is not updated yet | Wait for Pages or inspect GitHub Pages workflow; local collection is already complete. |

## Faster Morning Path

The preferred before-10:00 path is:

1. 08:30 local task runs collection, archive, gate, and local publish handoff in one local path.
2. 09:15 consolidated recovery checks only local output and gate presence. If missing, classify as local collection missing and hand off to Codex / human local repair.
3. Healthy same-date data is a no-op; do not recollect it.
4. 09:50 closure checks publication. If local output exists but publish is missing, record a targeted problem instead of rerunning collection.
5. Daily Problem Watchdog records failed publish workflows to the production incident registry and never retries the browser collector in GitHub.
6. 09:50 closure confirms PR merge and Pages. If Pages is still queued / in progress, report waiting rather than local failure.

## Lane Boundaries

- Community posts are leads, not verified commercial-event facts.
- Do not create Claims, CanonicalEvents, or RELATION-V2.1 rows from community material. A factual promotion requires separate original-source capture and the full V4 integrity chain.
- Do not write First-Line Viewpoints data.
- Do not expect GitHub Actions to run the logged-in local collector; GitHub can only publish already-generated validated community files.
- Do not force local browser state, credentials, or uncommitted workspace sync.
- Local inspection, translation, archive builds, and gates are safe within an authorized supervision/repair task. Browser collection, Vault writes, branch pushes, PRs, merges, and deployment run only through the owning task/workflow or explicit user authorization.

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
- production incident status.

## Done When

Finish when same-date collection, translation provenance, archive and data gates are verified; publication is accurately classified as complete, waiting, or failed at one owning stage; no unverified community material crossed into factual V4 data; and recurring failures have prevention evidence.
