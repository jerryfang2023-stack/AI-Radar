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

4. Apply the schedule watchdog before declaring the lane idle:
   - current cron windows are 09:07 / 09:37 / 10:07 Asia/Shanghai, not the retired 08:00 slot;
   - if no same-date scheduled run is visible by about 10:20, dispatch the workflow manually;
   - if a downstream task starts while the workflow is still `in_progress`, wait for the run to finish before reporting missing data.

5. For local repair, use the existing scripts in this order:

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

6. Commit only lane-owned outputs:
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

## Recovery Rules

- Auto-merge skip is a publication state, not a data-generation failure. If the automation branch and PR contain passing data, keep the PR route and merge policy; do not push directly to `main`.
- If only `raw_count_min` fails while quality score is high and other hard gates pass, treat it as a recovery candidate. Download Raw / Pool artifacts, regenerate Cards locally, rebuild site data, then rerun source-first and regression gates.
- Do not copy artifact `site-content.json` when it was generated before Card creation. Rebuild site data from current Cards instead.
- Watchlist material does not directly create Cards. A high-score watchlist item with aggregate industry data can only trigger source repair or Pool rerouting before Card generation.
- If Top10 is short, repair Raw / Pool / Core Pool coverage. Do not use supply-fill, duplicate large-company items, or weakened caps as the fix.
- If title text remains English or subject duplicates title, rebuild with the current source-first frontstage generator and rerun the source-first gate.

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

For daily supervision, prefer the unified read-only report:

```powershell
npm run supervise:daily -- --date=<YYYY-MM-DD>
```
