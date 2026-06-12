---
name: guanlan-business-signals-monitor
description: Use when supervising, running, repairing, or improving the WaveSight AI V3.3.5 Business Signals lane. Covers daily Raw / Pool / Signal Card / Top10 / Intelligence Map / trend-candidate inputs, source-first gates, PR publication, Hermes repair closure, and lane-specific self-improvement. Do not use for First-Line Viewpoints, Community Intelligence, direct deployment, or retired daily observation / brief / trend-report outputs.
---

# Guanlan Business Signals Monitor

This skill owns the Business Signals production lane. It coordinates source capture, evidence screening, Signal Cards, public Top10, relationship / intelligence map inputs, trend-candidate inputs, and lane repair.

It is the lane owner. It may call narrower skills such as `guanlan-daily-monitor`, `guanlan-monitor-quality-gate`, `guanlan-daily-monitor-qc`, `guanlan-raw-pool-card`, and `guanlan-trend-candidate-writer`.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/version-ledger.md`
4. `context/05-daily-monitoring.md`
5. `context/07-v3-intelligence-generation-rules.md`
6. `context/08-v3-3-automation.md`
7. `context/09-v3-3-current-action-index.md`
8. Relevant Business Signals report, Hermes inbox item, or failed gate output.

For detailed chain work, load the narrower skill:

- `agent-workflow/skills/guanlan-daily-monitor/SKILL.md`
- `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md`
- `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md`
- `agent-workflow/skills/guanlan-raw-pool-card/SKILL.md`
- `agent-workflow/skills/guanlan-trend-candidate-writer/SKILL.md`

For regression prevention, read `evals/business-signals-monitor-evals.md`. When repairing Top10, frontstage selection, or title-derived public fields, also read `examples/good-top10-contract.md` and `examples/bad-top10-missing.md`. Read `MEMORY.md` only when a failure resembles a previous incident or when updating this skill.

## Workflow

1. Resolve the Asia/Shanghai production date unless the user gives another date.
2. Check daily supervision and Hermes inbox for the Business Signals lane.
3. If production has not run, use the GitHub workflow / current automation route rather than pushing generated assets directly to `main`.
4. If production failed, start from the failed gate report and determine the earliest responsible stage:
   - Raw capture;
   - Pool routing;
   - monitor QC;
   - Card generation;
   - Top10 selection;
   - source-first gate;
   - frontstage regression;
   - PR / merge / Pages publication.
5. Repair the smallest script, rule, gate, or skill path needed for the failing stage.
6. Rerun the exact failed gate or the smallest relevant validation.
7. Add or tighten an eval before adding long prose when the failure is recurring.
8. Close the Hermes inbox item only after validation and prevention are recorded.

## Lane Boundaries

- Do not write First-Line Viewpoints or Community Intelligence data.
- Do not use builders viewpoints, opinion cards, or community posts as business-signal facts unless separately verified through Raw / Pool.
- Do not restore daily observation, business brief, trend report, publiccopy, cardcopy, or copy-style blockers.
- Do not lower Raw / Pool / Core Pool / Top10 quality gates to make a day look complete.
- Do not deploy directly from automation branches.

## Reporting

When finishing, report:

- lane status;
- failed gate or report path inspected;
- files changed;
- validation run;
- prevention artifact added or not needed;
- Hermes inbox item status;
- commit / PR / deployment status when relevant.
