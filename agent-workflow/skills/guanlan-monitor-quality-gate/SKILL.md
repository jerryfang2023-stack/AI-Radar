---
name: guanlan-monitor-quality-gate
description: Run or repair the WaveSight AI current V3 daily-monitor script pre-gate for automated scoring, hard thresholds, and up to 3 bounded refetch cycles. It checks Raw / Pool counts, routed Pool, core_pool depth, source distribution, S/A/B ratio, keyword paths, non-community evidence, theme concentration, and basic business relevance. It is not final QC; downstream release still requires guanlan-daily-monitor-qc.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Business Signals"
    status: "current sub-skill"
    order: 50
    responsibility: "Gate monitor output before downstream Card and asset generation."
    upstream: "Raw / Pool output"
    downstream: "monitor pass/fail reports"
    gates: "eligibility, evidence quality, source-first fields"
    recent_learning: "A pass should block weak source summaries before they become public Cards."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Monitor Quality Gate

This skill runs the script-based pre-gate for `guanlan-daily-monitor`.

It is a machine-check and retry loop. It does not replace `guanlan-daily-monitor-qc`.

Use it to:

- Run daily monitor with automatic scoring.
- Trigger bounded refetch when the script score or hard thresholds fail.
- Generate machine-readable monitor quality reports.
- Escalate to manual intervention after repeated failure.
- Provide inputs for the stricter Markdown QC report.

## Boundary

This skill answers:

```text
Did the monitor run meet the minimum automated thresholds?
Should the monitor rerun with bounded refetch before human/Agent QC?
Which source paths, counts, and basic hard gates failed?
```

It does not answer:

```text
Can downstream cards and articles use this Raw safely?
Were homepage/tool/directory pages wrongly treated as core evidence?
Are S/A overseas first-line sources sufficient for the day's main business themes?
```

Those decisions belong to:

```text
C:\Users\86186\.skill-store\guanlan-daily-monitor-qc\SKILL.md
```

Do not report the daily monitor as complete until both conditions are true:

1. This script pre-gate passes.
2. `guanlan-daily-monitor-qc` outputs `allow` or explicitly scoped `allow_with_degradation`.

## Required Reads

When this skill is called from `guanlan-daily-monitor`, do not add another reading chain. Use the files already opened by the monitor task.

For standalone debugging or threshold changes, read only the specific file needed:

- Daily monitor rule conflict: `context/05-daily-monitoring.md`
- Final QC handoff conflict: `C:\Users\86186\.skill-store\guanlan-daily-monitor-qc\SKILL.md`
- Script threshold or scoring conflict: `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`
- Script implementation bug: `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`
- Retry wrapper bug: `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`
- Score explanation conflict: `C:\Users\86186\.skill-store\guanlan-monitor-quality-gate\references\scorecard.md`
- Skill regression check: `C:\Users\86186\.skill-store\guanlan-monitor-quality-gate\evals\monitor-quality-gate-evals.md`
- Gate-shape examples: `examples/good-pre-gate-block.md` and `examples/bad-count-only-pass.md`

Do not read the JSON or scripts during normal human startup. Scripts read configuration directly.

## Execution

Run from the project root:

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=85 --max-cycles=3 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --monitor-timeout-ms=840000
```

Use Asia/Shanghai date unless the user specifies another date.

The script loop enforces:

- automated score reaches the configured pre-gate threshold;
- configured hard thresholds pass;
- at most 3 monitor/retry cycles;
- final failure sets `manual_intervention_required=true`.

The script `--pass-score` is a diagnostic reference, not a release gate. Hard thresholds decide the automated pre-gate, and the stricter downstream decision still belongs to `guanlan-daily-monitor-qc`.

## Current Monitoring Model

The monitor must reflect the current V3 production rules:

- Raw-first / Evidence-first.
- AI HOT, follow-builders, HN, X, Reddit, RSS and search aggregators are discovery channels, not fact sources.
- Source level `S/A/B/C/D` belongs to the captured original source.
- Acquisition channel `M` belongs to discovery routes only.
- Raw target is at least 150 active candidates in the daily production chain.
- Pool target is at least 75 items, at least 60 routed Pool items, and at least 30 usable `core_pool` items.
- Core downstream evidence requires `has_full_text=true`, `extraction_quality=high|medium`, `source_level=S|A|B`, and a concrete business change.
- Homepage, open-platform homepage, product directory, docs directory, console/login page, search-result page, tool directory and generic vendor homepage are `index_only` unless they contain a dated concrete new action.

## Script Score Dimensions

The automated gate scores basic monitor health:

- `source_integrity`
- `content_quality`
- `coverage_scope`
- `keyword_compliance`
- `strategic_alignment`
- `business_value_readiness`

It should detect low counts, weak source mix, missing non-community keyword paths, poor relevance, theme concentration, too few `core_pool` candidates, and missing fallback logs.

It may not reliably detect every semantic misuse of low-value pages. That is why `guanlan-daily-monitor-qc` is mandatory before downstream use.

## Automated Hard Gates

Fail or rerun if the configured gate detects:

- Raw below floor.
- Pool below floor.
- S/A/B ratio below floor.
- Non-community keyword evidence below floor.
- Keyword path diversity missing.
- AI relevance ratio below floor.
- Off-topic count above maximum.
- Required source or signal-class gaps not closed.
- `core_pool` below baseline.
- Failed sources or fallback paths not logged.

When these fail, rerun with bounded refetch. Do not patch the report by hand to make it pass.

## Mandatory QC Handoff

After this script loop finishes, immediately prepare input for:

```text
C:\Users\86186\.skill-store\guanlan-daily-monitor-qc\SKILL.md
```

The QC handoff must include:

- Raw count.
- Pool count.
- Source distribution.
- Source level distribution.
- Raw count by source type.
- Keyword path distribution.
- Failed sources.
- Fallback used.
- Evidence gaps.
- `core_pool` candidates.
- Suspicious homepage / tool / directory / search-result items.
- M-source-only or discovery-only items.
- Items missing `full_text`, snapshot, hash, or Raw JSON.

If the script passes but QC blocks, the day is still blocked. Do not let Signal Cards, relationship graph inputs, trend candidates, or Business Signals frontstage data proceed.

## Outputs

Always write or update:

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-monitor-quality-gate.md
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-quality-loop.md
```

Then run or request the Markdown QC report:

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-qc.md
```

Use clear downstream language:

```text
script_pre_gate=passed | failed
daily_monitor_qc=allow | allow_with_degradation | block | not_run
downstream_status=allowed | degraded | blocked
```

## Failure Handling

On final script failure:

- set `manual_intervention_required=true`;
- list failed thresholds and failed source paths;
- list fallback attempts;
- list Raw / Pool counts;
- list evidence gaps;
- mark downstream status as `blocked`;
- do not report daily monitoring complete.

On script pass but QC not yet run:

- mark downstream status as `pending_qc`;
- do not run Signal Card, relationship graph, trend candidate, or Business Signals frontstage generation from that Raw.

On script pass and QC `allow_with_degradation`:

- list exactly which Raw / Pool items may be used;
- list blocked items;
- instruct downstream tasks to ignore blocked materials.

## Verification

Run:

```powershell
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

Validate this skill after edits:

```powershell
python C:\Users\86186\.skill-store\.system\skill-creator\scripts\quick_validate.py C:\Users\86186\.skill-store\guanlan-monitor-quality-gate
```
