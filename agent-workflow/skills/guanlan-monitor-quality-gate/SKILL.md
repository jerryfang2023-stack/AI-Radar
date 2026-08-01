---
name: guanlan-monitor-quality-gate
description: Use when running or repairing the structured source-intake pre-gate before the Data Center V4 build after one monitor attempt. Do not use to validate CanonicalEvents, tags, projections, commercial value, or page quality.
metadata:
  guanlan:
    version: "1.3.0"
    lane: "Data Center Source Ingestion"
    status: "current sub-skill"
    order: 50
    responsibility: "Decide whether captured evidence is sufficient to attempt the V4 factual build."
    upstream: "SOURCE-INTAKE-V1 and immutable source snapshots"
    downstream: "Data Center V4 build decision and source diagnostics"
    gates: "minimum evidence supply and evidence integrity"
    recent_learning: "Provider, source-volume and channel-mix diagnostics do not independently block release or trigger repeated collection."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Monitor Quality Gate

This is the acquisition evidence-supply gate between monitoring and the Data Center V4 build. It is not the V4 integrity gate and does not decide event value or application/page quality.

## Required Reads

For changes, read only the relevant source:

- `context/12-data-center-v4.md`
- `context/08-automation.md` for the current collection and production loop
- `01-SiteV2/content/11-databases/source-intake-gate-v1.json`
- `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`
- `evals/monitor-quality-gate-evals.md`

## Decision Boundary

This gate answers:

```text
Are immutable snapshots and structured intake records present and internally consistent?
Is there enough source-backed evidence to attempt the V4 factual build?
Did index, contaminated, blocked or degraded evidence enter Core?
```

It does not answer whether events are valuable or important, and it does not validate Claims, CanonicalEvents, tags, projections, applications, or pages. V4 structural truth belongs to `guanlan-data-integrity-gate`; application and page contracts have separate gates.

## Hard Gates

Read hard thresholds from `source-intake-gate-v1.json`:

- minimum captured and selected evidence counts;
- minimum routed and usable core evidence;
- zero homepage/directory promotion into factual intake;
- zero core text contamination;
- zero blocked/degraded source QC in factual intake.

Provider failures are never a standalone hard gate. When evidence supply is below minimum, report both the deficient supply bucket and provider diagnostics; do not report the provider note as an independent blocker.

## Diagnostics

Keep these visible without converting them into release blockers:

- source 150 target;
- selected/routed/core targets above the hard minimum;
- keyword and channel breadth;
- AI-title ratio and off-topic titles;
- importance-lane gaps;
- large-company concentration;
- provider failures and fallback use;
- numeric score.

## Execution

```powershell
node agent-workflow/tools/guanlan-monitor-quality-gate.mjs --date=<YYYY-MM-DD>
```

Run this gate against the existing immutable snapshots and `SOURCE-INTAKE-V1`. Do not call `run-guanlan-daily-monitor-with-qc.mjs` from a gate-only task: that wrapper starts a new monitor attempt. Thresholds and diagnostic references come from `source-intake-gate-v1.json`; do not duplicate them in the command. On failure, report the exact hard gate and exit for targeted repair.

## Boundaries

- Run local inspection and the documented gate within an authorized monitoring or repair task.
- Do not start publication, mutate downstream V4/application data, add new thresholds, or repeat collection to make a score pass.
- Ask only when the date or intended repair scope is genuinely ambiguous and cannot be resolved from the active automation state.

## Outputs

```text
agent-workflow/reports/<date>-guanlan-monitor-quality-gate.md
```

Use `passed` or `failed` for the evidence-supply result. A pre-existing `<date>-guanlan-daily-monitor-quality-loop.md` belongs to the monitor wrapper and is optional upstream context, not output or completion evidence for this gate-only run. Optional `guanlan-daily-monitor-qc` audits may add semantic findings, but their presence or freshness is not a release prerequisite.

## Verification

```powershell
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node agent-workflow/tools/assert-business-signals-pipeline-policy.mjs
```

## Done When

Finish when the intake decision is supported by immutable evidence, every hard failure names its deficient bucket and earliest owner, diagnostics remain non-blocking, and no unnecessary recollection was started.
