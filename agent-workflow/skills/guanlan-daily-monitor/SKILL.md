---
name: guanlan-daily-monitor
description: Use when running, repairing, or updating the WaveSight AI current SITE-V3.4.5 daily Business Signals source-capture layer. It collects peer source artifacts once, normalizes Raw, preserves Pool audit evidence, writes monitor diagnostics, and hands off to the evidence-supply gate. It does not generate Cards or other columns.
metadata:
  guanlan:
    version: "1.1.0"
    lane: "Business Signals"
    status: "current sub-skill"
    order: 40
    responsibility: "Run the narrow Business Signals Raw / Pool source-capture stage once per production attempt."
    upstream: "external monitoring sources"
    downstream: "Raw / Pool outputs and evidence-supply report"
    gates: "source capture, evidence integrity, minimum evidence supply"
    recent_learning: "Raw, channel and importance targets are diagnostics. Do not recollect all sources or pad Raw after the minimum evidence supply is healthy."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Daily Monitor

This skill owns only Business Signals source capture and Raw / Pool persistence. The lane owner is `guanlan-business-signals-monitor`.

## Required Reads

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `context/08-v3-3-automation.md`
5. `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md`
6. `evals/daily-monitor-evals.md` when changing the monitor.

## Current Flow

```text
aihot + keyword + gdelt + rss source artifacts
-> one unified normalize/enrich/dedupe pass
-> at most one targeted refill when the hard evidence-supply minimum is missing
-> Raw / Pool files and monitor diagnostics
-> evidence-supply gate
```

The production wrapper runs one monitor attempt. It must not refresh every source lane and rerun the whole monitor because a diagnostic target, provider note, keyword mix, or Raw count is below target.

## Execution

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=85 --max-cycles=1 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --monitor-timeout-ms=900000
```

`--max-cycles` is retained for command compatibility but the current policy permits one production attempt only.

## Targets Versus Blockers

Diagnostic targets remain visible:

- Raw 150;
- Pool 75;
- routed Pool 60;
- Core evidence 30;
- channel, keyword, importance-lane and large-company balance.

They are not independent release blockers. The monitor blocks only when the configured minimum evidence supply or evidence integrity fails: missing Raw/Pool artifacts, too little Pool/routed/Core evidence to attempt Card generation, index/contaminated/blocked evidence in Core, or no usable original evidence.

Provider and channel failures remain diagnostics. They become actionable supply failures only when the combined evidence supply is also below the hard minimum.

## Operating Rules

- Resolve discovery results to original sources before factual use.
- Preserve original URL, readable text or fallback boundary, extraction diagnostics, hashes, excerpts and missing information.
- Keep homepage, directory, login, docs-index, catalog, marketplace, search-result, SEO and navigation pages `index_only` unless the page contains a dated concrete event.
- Historical duplicates do not count as active supply.
- Do not refill solely to reach Raw 150 or an old importance-lane quota.
- Do not stage First-Line Viewpoints, Community Intelligence, Cards or frontstage data from this skill.

## Failure Routing

- Collection command or evidence-supply failure: stop once, record the deficient evidence bucket, and hand off targeted repair.
- Provider unavailable but evidence supply healthy: continue and keep a diagnostic note.
- Card or frontstage failure: reuse Raw / Pool; do not rerun this skill.
- PR, merge or Pages failure: route to publication repair; do not rerun this skill.

## Outputs

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/<date>-guanlan-daily-monitor-*.md
```

## Verification

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node agent-workflow/tools/assert-business-signals-pipeline-policy.mjs
```
