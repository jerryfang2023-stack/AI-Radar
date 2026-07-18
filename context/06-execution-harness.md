---
status: current
scope: site-v4-execution-harness
last_updated: 2026-07-17
priority: current
---

# SITE-V4.2 Execution Harness

Use this harness for Data Center V4 production, monitoring, V3 internal Card compatibility, first-line viewpoints data, relationship graph, trend-candidate analysis, and site data sync.

Current V4 factual rule source:

```text
context/12-data-center-v4.md
```

V3 internal compatibility rule source:

```text
context/07-v3-intelligence-generation-rules.md
```

Automation source:

```text
context/08-v3-3-automation.md
```

## Active Flows

### A0. Data Center V4

Reads:

1. `AGENTS.md`
2. `context/12-data-center-v4.md`
3. `agent-workflow/product/data-center-v4-contract.md`
4. `agent-workflow/product/data-center-v4.schema.json`

Produces source artifacts, exact-span Claims, Entities, CanonicalEvents, evidence-backed tags, FDE / hardware projections, queryable exports, and V4 frontstage bundles. It does not produce recommendations, opportunity judgments, trend maturity, or other decision fields in canonical tables.

### A. Daily Monitoring

Reads:

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `agent-workflow/skills/guanlan-daily-monitor/SKILL.md`
5. `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md`
6. `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md`

Produces:

- Raw candidates;
- Pool evidence;
- monitor logs;
- QC handoff.

Does not produce legacy content outputs, frontstage copy, or recommendations.

### B. Raw / Pool / Card

Reads:

1. `AGENTS.md`
2. `context/07-v3-intelligence-generation-rules.md`
3. `agent-workflow/automation-prompts/asset-card-generator.md`

Produces:

- `signal_card` assets;
- V3 internal Card compatibility manifest;
- relationship graph inputs;
- trend-candidate inputs.

Current business-signal Card types:

- `product_service`;
- `funding`;
- `case`.

Compatibility target: preserve every qualified Raw / Pool business signal that passes raw-to-card cardability and can become a Card. Asset generation should cover all cardable Raw / Pool items; Pool is an audit index and repair surface, not a required manual selection layer. V3 Card data is not a public page payload and has no public Top10 selector or candidate-pool split.

### C. First-Line Viewpoints

Reads builders / follow-builders data only.

Produces:

- `01-SiteV2/site/data/follow-builders-daily.json`;
- `01-SiteV2/site/data-center.html?view=viewpoints` frontstage view; `follow-builders.html` is a redirect only.
- `agent-workflow/tools/assert-follow-builders-data.mjs` for freshness, source URL, duplicate, tag and fallback checks.

This flow is independent. It must not feed business-signal Card generation, relationship graph, or trend candidates.

### D. Relationship Graph

Reads accepted business-signal Cards only.

Produces graph data:

- nodes;
- edges;
- evidence links.

Do not write long prose as the graph. Do not include opinion or builders content.

### E. Trend Candidate

Reads accepted business-signal Cards and relationship-graph input.

Produces trend candidates only when multiple same-direction signals exist.

Trend candidate is an internal candidate object, not a long-form publication route.

### F. Site / Dashboard / Obsidian Sync

Runs:

- business-signal site data build;
- first-line viewpoint data build;
- operations dashboard data sync;
- GitHub PR / merge path;
- local Obsidian sync after merged changes are available on `origin/main`.

## Retired / Not Active

Legacy content-output routes, retired V3 page CSS/JS, legacy publication templates, and legacy copy gates are not current outputs.

If any workflow or script still requires them as blockers for V4 production or V3 internal compatibility production, treat it as historical contamination and update it.

## Hard Stops

Stop downstream use when:

- Raw has no original source;
- Pool has no readable body text;
- evidence comes only from search snippets or discovery pages;
- Card title falls back to backend fields;
- Card body uses naked-number fallback;
- opinion / builders material enters business-signal generation;
- relationship graph uses long generated prose instead of Card-derived nodes and edges.
