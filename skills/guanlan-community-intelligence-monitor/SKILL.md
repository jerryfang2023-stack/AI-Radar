---
name: guanlan-community-intelligence-monitor
description: Use when running, repairing, auditing, or committing the WaveSight Community Intelligence local production lane. Covers local scheduled task checks, logged-in browser collection, archive generation, community data gate, explicit Git sync, and post-incident skill improvement. Do not use for Business Signals facts or First-Line Viewpoints.
---

# Guanlan Community Intelligence Monitor

This skill owns the Community Intelligence production lane.

It runs locally because collection depends on logged-in browser state. It does not deploy the site directly; publication happens after explicit commit / sync to `main` and GitHub Pages.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/08-v3-3-automation.md`
3. `context/frontstage-page-contracts.md`
4. `01-SiteV2/site/scripts/collect-community-intelligence.mjs`
5. `01-SiteV2/site/scripts/archive-community-intelligence.mjs`
6. `agent-workflow/tools/assert-community-intelligence-data.mjs`

## Workflow

1. Resolve the Asia/Shanghai production date.
2. Confirm the Windows scheduled task exists:

```powershell
Get-ScheduledTask -TaskName "WaveSight Community Intelligence Daily"
Get-ScheduledTaskInfo -TaskName "WaveSight Community Intelligence Daily"
```

3. For manual repair or rerun:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File agent-workflow/tools/run-community-intelligence.ps1
```

4. If running steps directly:

```powershell
npm run collect:community-intelligence
npm run archive:community-intelligence
npm run assert:community-intelligence -- --date=<YYYY-MM-DD>
```

5. Commit only lane-owned outputs:
   - `01-SiteV2/site/data/community-intelligence.json`;
   - community archive files under `01-SiteV2/content/07-community-intelligence/`;
   - community gate reports;
   - collector rule changes directly needed by this lane.

## Pass Criteria

- Scheduled task is installed, Ready, and has a future next run.
- Last task result is `0` after a scheduled or manual run.
- Community data is generated for the Asia/Shanghai date.
- Item and deduped-link floors pass.
- Selected keyword rotation and collector errors are recorded.
- Daily Obsidian archive, index, and category views exist.
- Gate report and latest gate report are written.

## Boundaries

- Do not treat community posts as verified Business Signal facts.
- Do not stage Raw / Pool / Card files unless a separate Business Signals verification task promotes them.
- Do not stage First-Line Viewpoints data.
- Do not bypass the logged-in browser requirement by fabricating community data.
- Do not deploy directly from the local lane.

## Self-Improvement Loop

After any failure:

1. Name the failed step, log path, gate report path, and scheduled task state.
2. Classify root cause as task scheduling, Chrome/CDP, source login state, collector selector, dedupe, archive, gate threshold, or Git sync.
3. Add or update one pass/fail item in `evals/community-intelligence-monitor-evals.md`.
4. Update this skill only when the workflow boundary or command changes.
5. Record durable incidents in `MEMORY.md` only when likely to recur.
6. Rerun the community gate.

## Reporting

Report:

- scheduled task state, last result, and next run;
- item count and generated date;
- archive path;
- gate report path;
- files committed;
- sync / Pages status when known;
- skill eval or memory updates made after failures.
