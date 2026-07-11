---
name: guanlan-monitor-quality-gate
description: Run or repair the current V3 Business Signals evidence-supply pre-gate. It separates diagnostic targets from release blockers, validates minimum Pool/Core evidence integrity after one monitor attempt, and routes failures without starting another full-chain run.
metadata:
  guanlan:
    version: "1.1.0"
    lane: "Business Signals"
    status: "current sub-skill"
    order: 50
    responsibility: "Decide whether Raw / Pool evidence is sufficient to attempt Card generation."
    upstream: "Raw / Pool output"
    downstream: "evidence-supply decision and diagnostics"
    gates: "minimum evidence supply and evidence integrity"
    recent_learning: "Provider, Raw-volume and channel-mix diagnostics do not independently block release or trigger repeated collection."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Monitor Quality Gate

This is the automated evidence-supply gate between monitoring and Card generation. It is not a second monitor and it does not decide Card editorial quality.

## Required Reads

For changes, read only the relevant source:

- `context/05-daily-monitoring.md`
- `context/07-v3-intelligence-generation-rules.md`
- `01-SiteV2/content/11-databases/business-signals-gate-v3.json`
- `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`
- `evals/monitor-quality-gate-evals.md`

## Decision Boundary

This gate answers:

```text
Are Raw / Pool artifacts present and internally consistent?
Is there enough routed, source-backed evidence to attempt Card generation?
Did index, contaminated, blocked or degraded evidence enter Core?
```

It does not answer whether Cards are fresh, valuable, non-duplicated or well written. Those decisions belong to Card generation, dedupe, editorial quality and unified frontstage gates.

## Hard Gates

Read hard thresholds from `business-signals-gate-v3.json`:

- minimum Pool count;
- minimum routed Pool count;
- minimum Core and usable Core evidence;
- zero homepage/directory Core promotion;
- zero Core text contamination;
- zero blocked/degraded Raw QC in Core.

Provider failures are never a standalone hard gate. When evidence supply is below minimum, report both the deficient supply bucket and provider diagnostics; do not report the provider note as an independent blocker.

## Diagnostics

Keep these visible without converting them into release blockers:

- Raw 150 target;
- Pool/routed/Core targets above the hard minimum;
- keyword and channel breadth;
- AI-title ratio and off-topic titles;
- importance-lane gaps;
- large-company concentration;
- provider failures and fallback use;
- numeric score.

## Execution

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=85 --max-cycles=1 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --monitor-timeout-ms=900000
```

The wrapper runs once. On failure it writes the exact hard gate and exits for targeted repair. It must not recollect all source artifacts automatically.

## Outputs

```text
agent-workflow/reports/<date>-guanlan-monitor-quality-gate.md
agent-workflow/reports/<date>-guanlan-daily-monitor-quality-loop.md
```

Use `passed` or `failed` for the evidence-supply result. Optional `guanlan-daily-monitor-qc` audits may add semantic findings, but their presence or freshness is not a release prerequisite.

## Verification

```powershell
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node agent-workflow/tools/assert-business-signals-pipeline-policy.mjs
```
