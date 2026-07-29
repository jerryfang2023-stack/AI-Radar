---
name: guanlan-daily-monitor
description: Use when running or repairing the daily source-capture implementation that writes immutable snapshots and SOURCE-INTAKE-V1 for Data Center V4. It does not own Claims, CanonicalEvents, tags, projections, pages, judgment, or recommendations, and it must not create V3 Raw/Pool Markdown or Signal Cards.
metadata:
  guanlan:
    version: "1.2.0"
    lane: "Data Center Source Ingestion"
    status: "current sub-skill"
    order: 40
    responsibility: "Run source capture once and hand immutable evidence plus structured intake to the V4 build."
    upstream: "external monitoring sources"
    downstream: "immutable snapshots, SOURCE-INTAKE-V1, and evidence-supply diagnostics"
    gates: "source capture, provenance integrity, minimum structured evidence supply"
    recent_learning: "After post-fetch hash dedupe, expand only within the already collected candidate set; do not recollect providers or pad intake with weak evidence."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Daily Monitor

This skill owns commercial-source discovery, immutable snapshot capture, and `SOURCE-INTAKE-V1` only. `guanlan-source-ingestion` owns SourceArtifact and RawDocument normalization; `guanlan-data-center-supervisor` owns the V4 factual chain.

## Required Reads

1. `AGENTS.md`
2. `context/12-data-center-v4.md`
3. `context/06-execution-harness.md`
4. `context/08-automation.md`
5. `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md`
6. `evals/daily-monitor-evals.md` when changing the monitor.

## Current flow

```text
AI HOT + keyword + GDELT + RSS discovery
-> immutable source snapshots
-> one unified normalization pass
-> SOURCE-INTAKE-V1
-> source-intake gate
-> V4 SourceArtifact / RawDocument build
```

Internal collector fields such as `pool_count` or `core_pool` are selection diagnostics only. They must not create Pool Markdown, Signal Cards, a V3 Desk, an old graph, or compatibility payloads.

## Execution

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<YYYY-MM-DD> --pass-score=85 --max-cycles=1 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --monitor-timeout-ms=900000
```

The production policy permits one monitor attempt and at most one targeted refill for a failed hard evidence-supply bucket. Provider or volume diagnostics cannot trigger a full recollection.

## Rules

- Resolve discovery results to original sources before factual use.
- Preserve original URL, readable text or fallback boundary, extraction diagnostics, content hash, excerpts, and missing information.
- Keep homepage, directory, login, docs-index, catalog, marketplace, search-result, SEO, and navigation pages discovery-only unless they contain a dated concrete event.
- Normalize publication dates and filter stale archives.
- Use same-attempt adaptive expansion only from already collected candidates.
- Do not stage First-Line Viewpoints, Community Intelligence, canonical facts, application projections, or frontstage data.
- Do not write `01-SiteV2/content/01-raw`, `01-SiteV2/content/02-pool`, Signal Cards, V3 Desk, graph, or legacy mappings.

## Failure routing

- Capture or source-intake failure: stop once, name the deficient bucket, and hand off targeted repair.
- Provider unavailable with healthy combined evidence: continue with a diagnostic.
- Claim/Event, application, frontstage, PR, Pages, or local-sync failure: repair that downstream owner; do not recollect sources.

## Outputs

```text
agent-workflow/reports/source-runs/<date>/
01-SiteV2/content/11-databases/data-center-v4/intake-v1/<date>.json
agent-workflow/reports/<date>-guanlan-daily-monitor-*.md
```

## Verification

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node agent-workflow/tools/assert-business-signals-pipeline-policy.mjs
npm run assert:no-active-v3
```
