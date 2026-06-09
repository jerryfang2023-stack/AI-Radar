---
name: guanlan-first-line-viewpoints-monitor
description: Use when running, repairing, auditing, or committing the independent WaveSight First-Line Viewpoints lane. Covers builder blog/podcast feed refresh, follow-builders data generation, Chinese translation gate, independent PR handoff, and post-incident skill improvement. Do not use for Business Signals facts, relationship graph evidence, trend candidates, or Community Intelligence.
---

# Guanlan First-Line Viewpoints Monitor

This skill owns the First-Line Viewpoints production lane.

It produces public builder viewpoints only. It does not create Business Signal Cards and does not deploy the site directly.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/08-v3-3-automation.md`
3. `context/frontstage-page-contracts.md`
4. `agent-workflow/product/tag-taxonomy.md`
5. `01-SiteV2/site/scripts/build-follow-builders-page-data.mjs`
6. `agent-workflow/tools/assert-follow-builders-data.mjs`

## Workflow

1. Resolve the Asia/Shanghai production date.
2. Confirm this lane is independent from Business Signals.
3. Run or inspect the GitHub lane:

```text
.github/workflows/daily-first-line-viewpoints-pr.yml
```

4. For local repair, use:

```powershell
node agent-workflow/tools/fetch-builder-blog-feed.mjs --date=<YYYY-MM-DD>
node agent-workflow/tools/fetch-builder-podcast-feed.mjs --date=<YYYY-MM-DD>
node 01-SiteV2/site/scripts/build-follow-builders-page-data.mjs
node agent-workflow/tools/assert-follow-builders-data.mjs --date=<YYYY-MM-DD>
```

5. Commit only lane-owned outputs:
   - `01-SiteV2/site/data/follow-builders-daily.json`;
   - builder blog / podcast feed JSON when refreshed;
   - first-line manifest and gate reports.

## Pass Criteria

- Builders data is fresh for the production date.
- Remark and builder counts meet the gate floor.
- Every visible remark has an original URL.
- Every visible remark has complete Chinese translation.
- `translationStatus` is `translated` for every visible remark.
- Every remark has at least one `opinion`, one `track`, and one `source` formal tag.
- Fallback data is allowed only when fresh and explicitly marked.

## Boundaries

- Do not feed builder viewpoints into Business Signal Cards.
- Do not use viewpoints as relationship graph or trend-candidate evidence.
- Do not stage Raw / Pool / Card files.
- Do not stage Community Intelligence data.
- Do not deploy directly from an automation branch.

## Self-Improvement Loop

After any failure:

1. Name the failed gate and exact report path.
2. Classify the root cause as feed refresh, translation, tag taxonomy, stale fallback, duplicate URL, or workflow permission.
3. Add or update one pass/fail item in `evals/first-line-viewpoints-monitor-evals.md`.
4. Update this skill only when the workflow boundary or required command changes.
5. Record durable incidents in `MEMORY.md` only when likely to recur.
6. Rerun `assert-follow-builders-data.mjs`.

## Reporting

Report:

- remarks count;
- builders count;
- translation failures removed or repaired;
- gate report path;
- files committed;
- PR / merge / Pages status when known;
- skill eval or memory updates made after failures.
