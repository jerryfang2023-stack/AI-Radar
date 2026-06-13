---
name: guanlan-community-intelligence-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI V3.3.6 Community Intelligence lane. Covers local logged-in collection, archive generation, community data gate, local publish handoff, GitHub publish PR, Hermes repair closure, and lane-specific self-improvement. Do not use for Business Signals facts, Signal Cards, relationship graph evidence, trend candidates, or First-Line Viewpoints.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Community Intelligence"
    status: "current lane owner"
    order: 30
    responsibility: "Own Community Intelligence supervision and repair: local logged-in collection, archive outputs, community data gate, and publication handoff."
    upstream: "local Windows collection, community publish workflow, Hermes inbox"
    downstream: "community frontstage data, archive snapshots, community PR publication"
    gates: "local collection availability, community data assertion, archive presence, publication completeness"
    recent_learning: "GitHub can publish validated community files but cannot replace logged-in local collection."
    mirrored_in_skill_store: true
    memory_required: true
---

# Guanlan Community Intelligence Monitor

This skill owns the Community Intelligence lane. It supervises local logged-in collection, community frontstage data, Obsidian archive output, community data gate, and publication through the community PR workflow.

## Current Timing

- Local logged-in collection: 08:30 Asia/Shanghai.
- GitHub publish windows for already-collected data: 08:45 and 10:45 Asia/Shanghai.
- Hermes publish handoff: 09:30 Asia/Shanghai, with follow-up checks at 09:45 and 09:55.
- GitHub Actions can publish validated community files, but cannot replace local Chrome / logged-in collection.

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
8. Add or tighten evals before adding long prose when a failure recurs.
9. Close Hermes inbox items only after validation and prevention are recorded.

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
- files changed;
- prevention artifact added or not needed;
- Hermes inbox item status.
