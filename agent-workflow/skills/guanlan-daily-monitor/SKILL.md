---
name: guanlan-daily-monitor
description: Use when running, repairing, or updating the WaveSight AI current V3.3 daily monitor source-capture layer for the Business Signals lane. It collects Raw candidates, captures original source evidence, routes Pool evidence, writes monitor logs, and hands off to monitor quality gates. It does not generate Cards, write frontstage copy, run First-Line Viewpoints, run Community Intelligence, or produce retired daily observation / brief / trend-report outputs.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Business Signals"
    status: "current sub-skill"
    order: 40
    responsibility: "Run and repair the narrow Business Signals Raw / Pool monitoring chain."
    upstream: "external monitoring sources"
    downstream: "Raw / Pool outputs and daily reports"
    gates: "source capture, pool thresholds, quality gating"
    recent_learning: "Keep workflow, dry-run, and manual monitor parameters aligned with V3.3.6 thresholds; Core Pool failures usually need better source routing, not more HN."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Daily Monitor

This skill is the lower-level source-capture route for the Business Signals lane. The lane owner is `guanlan-business-signals-monitor`; this skill only handles Raw / Pool monitoring work.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `context/08-v3-3-automation.md`
5. `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md`
6. `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md`

For regression prevention, read `evals/daily-monitor-evals.md` when running, repairing, or updating this skill. When checking threshold or evidence-shape regressions, also read `examples/good-monitor-run.md` and `examples/bad-old-thresholds.md`.

## Mission

Produce the Business Signals monitoring base:

- at least 150 active Raw candidates unless the run is explicitly blocked;
- at least 75 Pool items;
- at least 60 routed Pool items;
- at least 30 usable `core_pool` items;
- original URLs, readable source text or fallback explanation, source snapshots / archives, hashes, extraction diagnostics, and missing-information notes;
- monitor logs covering source distribution, failures, fallback, theme concentration, Pool routes, and evidence gaps;
- a QC handoff for downstream Signal Card generation.

## Execution

Run the current monitor + pre-gate loop from the project root:

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=85 --max-cycles=3 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --monitor-timeout-ms=900000
```

Use the Asia/Shanghai date unless the user gives another date.

The script `--pass-score` is a diagnostic score reference only. It is not final downstream permission and does not override hard gates. Final permission comes from hard gates plus `guanlan-daily-monitor-qc`.

## Release Gate

- `guanlan-monitor-quality-gate` is a script pre-gate.
- `guanlan-daily-monitor-qc` is the downstream release gate and must output `allow`, scoped `allow_with_degradation`, or `block`.
- Any QC P0 blocks downstream Signal Cards, relationship graph inputs, trend candidates, and Business Signals frontstage data even when the numeric pre-gate score is high.
- Do not ask card generators to use thin, community-only, homepage-only, builder-only, or unverified Raw / Pool material.

## Operating Rules

- Search providers, AI HOT, HN, X, Reddit, newsletters, RSS, and aggregators are discovery channels until original sources are captured.
- Source level belongs to the captured original source. Acquisition channel `M` belongs only to discovery routes.
- Homepage, directory, login, docs-index, product catalog, marketplace, search-result, SEO, and generic navigation pages are `index_only` unless the page itself contains a dated concrete event.
- Historical duplicates must not count toward active Raw / Pool quantity.
- `core_pool` requires original source link, readable body text or enough excerpt, content hash, Raw QC allow, and concrete business action.
- Do not promote weak evidence to `core_pool` just to hit quantity targets.
- Do not collect or stage First-Line Viewpoints or Community Intelligence outputs from this skill.

## Output Paths

Write only monitoring outputs:

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

## Verification

At minimum run:

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

If any check cannot run, state why and whether it blocks downstream tasks.
