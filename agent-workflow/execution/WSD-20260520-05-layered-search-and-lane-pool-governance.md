---
task_id: WSD-20260520-05-layered-search-and-lane-pool-governance
title: Layered Search And Lane Pool Governance
date: 2026-05-20
status: accepted
owner: product-commander / intelligence-engine
scope: daily-monitoring / raw / pool / core-pool
---

# WSD-20260520-05 Layered Search And Lane Pool Governance

## Background

The 2026-05-20 Pool run exposed a structural failure: generic keyword search could retrieve dictionary pages, HTML reference pages, tutorial pages, directories and other non-AI pages, and those pages could later be over-promoted into `core_pool`.

The failure was not only a Bing issue. It was a governance issue across four layers:

1. Search queries were too broad.
2. Search results were not pre-gated before Raw capture.
3. Search discovery was treated too close to evidence.
4. Core Pool selection did not enforce lane-specific proof strongly enough.

## Decision

Rebuild the monitoring system around six importance lanes and layered search.

### Six Importance Lanes

Raw monitoring must explicitly cover:

- `important_case`
- `important_funding`
- `important_technical_trend`
- `important_product_or_service`
- `important_vertical_solution`
- `important_viewpoint_or_article`

Each lane must maintain its own source strategy, query templates, minimum evidence structure, and downgrade rules.

Core Pool must not force quota filling. Each lane may contribute up to 2-3 Core Pool candidates when qualified. If no item qualifies, the lane remains empty for that day and the gap is reported.

### Layered Search Priority

Search and discovery priority:

1. Curated and owned entrances: AI HOT, follow-builders, registered RSS, official source registry.
2. Whitelisted official and high-signal domains.
3. Vertical APIs or structured databases where available.
4. GDELT / A-media verification.
5. Semantic or agent search providers such as Tavily / Exa / Brave when configured.
6. Bing / generic web search only as fallback discovery.

Generic search results are discovery only. They cannot directly justify `core_pool` without original evidence capture and Raw QC.

## Implementation Requirements

- Add lane-level governance to the monitoring docs and keyword config.
- Add search-result pre-gate before Raw capture for keyword search.
- Block obvious non-AI and non-event pages at result stage, including dictionary, translation, pronunciation, HTML tag reference, tutorial, directory, SEO and search result pages.
- Record filtered keyword-search results in monitor failures/logs as a search hygiene signal.
- Keep AI HOT and follow-builders as acquisition entrances, not evidence levels.
- Preserve Raw records for audit where already captured, but downgrade unusable records to `discard` or `index_only`.

## Acceptance Criteria

- Keyword search cannot admit dictionary / translation / HTML tag / tutorial pages into Raw candidates.
- `core_pool` requires `raw_qc_decision=allow`, full evidence, lane-specific `importance_type`, and `importance_score >= 4`.
- Six lane coverage is reported separately for Raw and Pool.
- Bing or generic search fallback is never treated as evidence authority.
- Existing monitoring validation scripts pass.
