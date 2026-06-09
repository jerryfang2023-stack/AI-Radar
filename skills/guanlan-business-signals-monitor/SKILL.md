---
name: guanlan-business-signals-monitor
description: Use when running, repairing, auditing, or committing the WaveSight Business Signals daily production lane. Covers Raw / Pool monitoring, Core Pool balance, Signal Card generation, Top10 selection, intelligence-map data, dashboard sync, independent PR handoff, and post-incident skill improvement. Do not use for First-Line Viewpoints or Community Intelligence.
---

# Guanlan Business Signals Monitor

This skill owns the Business Signals production lane. Intelligence Map and Dashboard data follow this lane because they are derived from Business Signal Cards and the production state.

It does not deploy the site directly. Site publication happens only after merged changes reach `main` and GitHub Pages runs.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `context/08-v3-3-automation.md`
5. `context/frontstage-page-contracts.md`
6. target date Raw / Pool / Card / site data files

## Workflow

1. Resolve the Asia/Shanghai production date.
2. Confirm this lane is not being confused with First-Line Viewpoints or Community Intelligence.
3. Run or inspect the GitHub lane:

```text
.github/workflows/daily-persistent-assets-pr.yml
```

4. For local repair, use the existing scripts in this order:

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD>
node agent-workflow/tools/assert-daily-production-chain.mjs --date=<YYYY-MM-DD> --stage=post-monitor --raw-min=150 --pool-min=75
node agent-workflow/tools/generate-asset-cards-from-pool.mjs --date=<YYYY-MM-DD> --signal-target=10 --require-final-qc=false --trend-candidates=false
node agent-workflow/tools/assert-pool-to-card-dedupe.mjs --date=<YYYY-MM-DD>
node 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs
node 01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs
node agent-workflow/tools/build-topic-center-data.mjs --date=<YYYY-MM-DD>
node agent-workflow/tools/assert-v3-source-first-frontstage.mjs
node agent-workflow/tools/frontstage-regression-gate.mjs
```

5. Commit only lane-owned outputs:
   - Raw / Pool files;
   - Signal Card assets;
   - `v3-data-observation-desk.json`;
   - `intelligence-graph-index.json`;
   - dashboard / topic-center data;
   - related reports and manifests.

## Pass Criteria

- Raw active count is at least 150.
- Pool count is at least 75.
- Usable Core Pool count is at least 30.
- Non-large-company Core Pool depth is at least 20 when supply exists.
- Same-date frontstage selected count is exactly 10.
- Same large company appears at most once in the Top10.
- Large-company total is at most 3 in the Top10.
- Source-first and frontstage regression gates pass.

## Boundaries

- Do not use builders viewpoints as facts, graph evidence, or trend evidence.
- Do not use community posts as business facts unless separately verified through Raw / Pool.
- Do not weaken large-company caps to fill Top10.
- Do not restore daily observation, business brief, trend report, publiccopy, or cardcopy gates.
- Do not deploy directly from an automation branch.

## Self-Improvement Loop

After any failure, apply this loop before closing the task:

1. Name the failed lane, gate, exact report path, and failed invariant.
2. Decide whether the root cause is source coverage, routing, script logic, stale data, missing logs, or GitHub permissions.
3. Add or update one pass/fail item in `evals/business-signals-monitor-evals.md` before adding prose.
4. Update this skill only when the workflow boundary or required command changes.
5. Record durable incidents in `MEMORY.md` only when the same failure is likely to recur.
6. Rerun the smallest relevant validation.

## Reporting

Report:

- Raw / Pool / Core Pool counts;
- Top10 selected count and large-company count;
- gates run;
- files committed;
- PR / merge / Pages status when known;
- skill eval or memory updates made after failures.
