---
name: guanlan-daily-monitor
description: Use when running, updating, auditing, or repairing WaveSight AI daily monitoring. It executes the independent daily monitor task: source discovery, Raw capture, Pool routing, source-router logs, and evidence gaps. It does not write articles or generate full cards.
---

# Guanlan Daily Monitor

This skill runs the WaveSight AI daily monitoring task as an independent job.

Use it for:

- Running the daily monitor.
- Updating daily monitor rules.
- Auditing Raw / Pool monitoring quality.
- Repairing failed source-router runs.
- Creating or updating the independent Guanlan daily monitoring automation.

Do not use it to write 今日观察, generate full cards, or produce trend reports. Those belong to downstream tasks and will follow their own rules.

## Required Reads

Read in this order:

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `agent-workflow/product/daily-monitoring-playbook.md`
4. `agent-workflow/product/source-intelligence.md`
5. `agent-workflow/product/raw-evidence-schema.md`
6. `agent-workflow/product/pool-routing-rules.md`
7. `01-SiteV2/content/README.md`
8. `01-SiteV2/content/09-databases/keyword-monitoring-v2.json`
9. `01-SiteV2/content/09-databases/source-registry-v2.json`

The playbook is the daily monitoring source of truth. Raw schema defines evidence fields. Pool routing rules define candidate routing. Do not redefine those standards inside task notes.

## Mission

Produce the day's monitoring base:

- Raw candidates and local evidence archives.
- Pool candidates and routing reasons.
- Frontier viewpoint intake from follow-builders.
- Change-cluster and viewpoint candidates for downstream tasks.
- Source-router log with failures, fallback, evidence gaps, and distribution.

## Execution

Run:

```powershell
node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=<YYYY-MM-DD> --search-limit=30 --search-path-query-limit=1 --gdelt-query-limit=4 --hn-limit=20 --fetch-timeout-ms=10000 --snapshot-timeout-ms=8000
```

Use Asia/Shanghai date unless the user gives another date.

External search is a bounded补证 lane. If non-community paths timeout or return rate limits, preserve the failure in `failed_sources` and keep community-only results in Watchlist / User Feedback rather than treating them as fact evidence.

## Default Source Strategy

Use the three-lane default:

1. AI HOT recent 24h `mode=all` as the main Raw discovery entrance.
2. follow-builders full daily scan into the frontier opinion library.
3. keyword rules to fill P0/P1 tracks, four signal classes, and outside-core exploration.

Only activate external multi-path search when default lanes are insufficient, a signal class is thin, or important cards need S/A/B evidence.

## Raw Rules

Every useful Raw must preserve:

- `full_text`
- `clean_text`
- Markdown snapshot
- JSON evidence object
- source URL and origin URL
- fetch status and extraction quality
- source level S/A/B/C/D
- acquisition source level M when discovered through AI HOT, follow-builders, search aggregation, RSS, or other routers
- key excerpts with type/support/importance/confidence
- business elements
- evidence seed
- missing information
- usable_for
- pool_routes
- raw_status

`full_text` is the evidence base. `clean_text` is the analysis input.

## Pool Rules

Pool is only a candidate index. It cannot replace Raw.

Allowed routes:

- `core_pool`
- `emerging_pool`
- `user_feedback_pool`
- `watchlist`
- `index_only`
- `discard`

`core_pool` requires:

```text
has_full_text = true
extraction_quality = high | medium
source_level = S | A | B
clear commercial change
commercial_value >= 3
guanlan_relevance >= 3
```

Do not promote weak evidence to `core_pool` just to reach quantity targets.

## Community And Aggregator Rules

AI HOT, follow-builders, HN, X, Reddit, newsletters, RSS and search aggregators are discovery channels until the original source is captured.

Community materials can support:

- discussion heat
- user feedback
- developer resistance
- early watch signals
- viewpoint cards when original visible text is preserved

They cannot alone prove company action, customer adoption, revenue, financing, market size, or procurement.

## Targets

Normal day:

- Raw: 80-150
- Pool: 20-40

Low-signal or source-failure day:

- Raw: 50-80 with explicit fallback notes
- Pool shortage must be explained through evidence gaps

Coverage must include mature signals, early signals, technical iteration signals, and developer ecosystem signals.

## Required Log Fields

The source-router log must include:

- `source_distribution`
- `raw_count_by_channel`
- `raw_count_by_source_type`
- `aihot_discovered_count`
- `aihot_rejected_by_raw_entry_rules`
- `external_search_activated`
- `keyword_group_distribution`
- `theme_distribution`
- `theme_concentration_warning`
- `source_level_distribution`
- `pool_route_distribution`
- `raw_snapshot_status_distribution`
- `failed_sources`
- `fallback_used`
- `evidence_gaps`

## Output Paths

Write only monitoring outputs:

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
01-SiteV2/content/04-business-signals/
01-SiteV2/knowledge/03-Opinion-Cards/
agent-workflow/reports/
```

## Failure Handling

If sources fail, do not pretend the run succeeded.

Report:

- failed source
- failed stage
- fallback used
- Raw / Pool count
- evidence gaps
- downstream tasks that should pause or downgrade

Do not ask writers to produce a normal 今日观察 from empty or thin Raw / Pool.

## Verification

At minimum run:

```powershell
node --check agent-workflow/tools/run-v2-daily-pipeline.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

If a check cannot run, state why and whether it blocks downstream tasks.
