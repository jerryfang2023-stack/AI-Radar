# 2026-06-15 to 2026-06-21 Three-Lane Daily Monitor Audit

- generated_at: 2026-06-21
- scope: Business Signals, First-Line Viewpoints, Community Intelligence
- purpose: identify daily failures, rule / document / algorithm roots, and prevention updates

## Executive Summary

This week did not show one uniform production failure. The repeated red states came from three different classes:

1. Supervision coverage gap: 2026-06-15, 2026-06-16, 2026-06-18, and 2026-06-19 have lane gates and production reports, but no unified daily supervision JSON. That makes later Hermes diagnosis depend on partial evidence.
2. Supervision classification drift: 2026-06-20 and part of 2026-06-21 treated latest workflow failures, Windows task result codes, or supply warnings as full lane failures even when same-date data and gates were healthy.
3. Real publish / timing gaps: Community Intelligence and Business Signals still had publication closure problems on 2026-06-20 / 2026-06-21. Those should be routed to publish workflow / PR / local sync repair, not blind data recollection or full Business reruns.

The prevention rule is now:

same-date data and gate health > PR / publication evidence > latest workflow status > scheduled-task history / observability warnings.

## Daily Findings

| Date | Business Signals | First-Line Viewpoints | Community Intelligence | Root Problem |
|---|---|---|---|---|
| 2026-06-15 | Business frontstage gate passed, monitor quality gate passed, persistent manifest present. | Follow-builders data gate passed, manifest present, afternoon skill report count 26. | Community gate passed, local publish report present. | Unified daily supervision artifact missing. This is an observability coverage gap, not a lane failure. |
| 2026-06-16 | Business frontstage gate passed, monitor quality gate passed, persistent manifest present. | Follow-builders data gate passed, manifest present, afternoon skill report count 27. | Community gate passed, local publish report present. | Unified daily supervision artifact missing. |
| 2026-06-17 | Daily supervision reported Business passed. | Daily supervision warning only; local gate and reports passed, afternoon skill report count 36. | Daily supervision marked manual_required although community gate and local publish existed. Later lesson: same-date local publisher / PR evidence must count even when the GitHub workflow list has no same-date run. | Supervision looked too much at workflow presence and not enough at same-date local data / publish evidence. Skill Ops mirror drift also existed but is governance, not lane data failure. |
| 2026-06-18 | Business frontstage gate passed, monitor quality gate passed, persistent manifest present. | Follow-builders data gate passed, manifest present, afternoon skill report count 39. | Community gate passed, local publish report present. | Unified daily supervision artifact missing. |
| 2026-06-19 | Business frontstage gate passed, monitor quality gate passed, persistent manifest present. | Follow-builders data gate passed, manifest present, afternoon skill report count 42. | Community gate passed, local publish report present. | Unified daily supervision artifact missing. |
| 2026-06-20 | Business data was same-date, Top10 count 10, 17 signal Card files, manifest present, gates passed. Daily supervision still failed on `supplyConstrained` and latest workflow failure. | Morning page gate passed, PRs merged, afternoon skill report count 24. | Community data and gate were healthy, but scheduled task result was 1 and publish workflow failed; no local publish report was present in the weekly summary. | Business: false hard failure from supply warning and workflow redness. Community: publish-stage failure after healthy data. |
| 2026-06-21 | Business data was same-date, Top10 count 10, 23 signal Card files, manifest present, gates passed. Daily supervision failed on latest workflow failure and warned local sync dirty files. | Current gate passes with 42 remarks and 14 builders. A stale Hermes inbox item existed from an earlier missing-gate view and was resolved after the gate passed. | Early daily supervision saw 2026-06-20 data and missing gate. Later same-date local publish and community gate passed with 61 items and 55 links. | Stale supervision report was not regenerated after local repair; Business issue is publication / PR / sync closure, not data generation. |

## Root Causes

### 1. Daily supervision was not continuous every day

The daily lane outputs exist for multiple days without a corresponding `*-daily-supervision-report.json`. This weakens the evidence chain because Hermes and Codex then rely on older reports, inbox fragments, or latest workflow state.

Solution:

- Treat missing unified daily supervision as an observability gap.
- Run `npm run health:daily -- --date=<date>` after each lane repair or gate rerun.
- Weekly health should flag days that have lane gates but no unified daily supervision report.

### 2. Business Signals confused data health with publication health

On 2026-06-20, same-date Business data was healthy and gates passed, but `frontstageSelection.supplyConstrained=true` was treated as a failed lane. On 2026-06-21, latest workflow failure remained a failed lane even though same-date data, Top10, Card files, and gates were healthy.

Solution:

- Data health requires activeDate = date, Top10 = 10, signal Card files >= 10, intelligence graph exists, and Business gates pass.
- `supplyConstrained=true` blocks only when Top10 or gates fail.
- Workflow failure after healthy data is publication / branch / PR repair only.
- Dirty local Obsidian sync is local sync closure warning only.

Updated prevention:

- `context/08-v3-3-automation.md` now defines supervision evidence precedence.
- `guanlan-business-signals-monitor/MEMORY.md` records the durable lesson.
- `business-signals-monitor-evals.md` adds `supervision_data_publication_precedence`.
- `write-daily-supervision-report.mjs` already contains this classifier in current HEAD.

### 3. Community Intelligence confused local collection with publish workflow state

On 2026-06-20, local data and gate were healthy, but Windows task `LastTaskResult=1` and a failed publish workflow became a manual-required lane failure. On 2026-06-21, the early daily report was correct at the time because same-date community data and gate were missing; after local repair produced same-date data and a passed gate, the old report became stale and should not remain active truth.

Solution:

- If community data is same-date, items / links meet floors, collector errors are zero, archive outputs exist, and the gate passes, local collection is healthy.
- Non-zero scheduled task result is warning-only after healthy local data.
- Red GitHub publish after healthy local data routes to publish workflow / PR repair only.
- Rerun daily supervision after local repair writes the same-date gate.

Updated prevention:

- `guanlan-community-intelligence-monitor/MEMORY.md` records the precedence rule and stale-report rule.
- `community-intelligence-monitor-evals.md` adds `publication_evidence_precedence`.

### 4. First-Line Viewpoints had stale supervision artifacts, not recurring data failure

The lane gates passed throughout the week. The main risk is stale or missing workflow evidence overriding local same-date gate health.

Solution:

- Treat same-date `follow-builders-daily.json`, remarks / builders floors, and passed data gate as public-lane health.
- Missing GitHub fallback state is only observability when local data and gate are healthy.
- Resolve or regenerate stale Hermes inbox items after local repair passes the gate.

Updated prevention:

- `guanlan-first-line-viewpoints-monitor/MEMORY.md` records local-data-first supervision.
- `first-line-viewpoints-monitor-evals.md` adds `local_data_precedence_in_supervision`.

## What Should Happen Next

1. Keep the three lane owners independent. Do not introduce a single heavy daily monitor agent.
2. Run daily supervision after every local repair, especially after Community or First-Line gates are generated later than the first Hermes report.
3. Historical coverage records have been added for 2026-06-15, 2026-06-16, 2026-06-18, and 2026-06-19. They document gate evidence only and must not be used as real-time dispatch evidence.
4. For Business 2026-06-21, repair publication / PR / local sync closure, not Raw / Pool / Card generation.
5. For Community 2026-06-21, use the later passed gate as current truth and regenerate daily supervision so Hermes no longer points at stale missing-gate evidence.

## Files Updated By This Audit

- `context/08-v3-3-automation.md`
- `agent-workflow/skills/guanlan-business-signals-monitor/MEMORY.md`
- `agent-workflow/skills/guanlan-business-signals-monitor/evals/business-signals-monitor-evals.md`
- `agent-workflow/skills/guanlan-community-intelligence-monitor/MEMORY.md`
- `agent-workflow/skills/guanlan-community-intelligence-monitor/evals/community-intelligence-monitor-evals.md`
- `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/MEMORY.md`
- `agent-workflow/skills/guanlan-first-line-viewpoints-monitor/evals/first-line-viewpoints-monitor-evals.md`
