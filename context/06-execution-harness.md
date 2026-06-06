---
status: current
scope: v3-execution-harness
last_updated: 2026-06-06
priority: current
---

# V3.3 Execution Harness

Use this harness for monitoring, Pool routing, Card generation, first-line viewpoints data, relationship graph, trend-candidate analysis, and site data sync.

Current rule source:

```text
context/07-v3-intelligence-generation-rules.md
```

Automation source:

```text
context/08-v3-3-automation.md
```

## Active Flows

### A. Daily Monitoring

Reads:

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `skills/guanlan-daily-monitor/SKILL.md`
5. `skills/guanlan-monitor-quality-gate/SKILL.md`
6. `skills/guanlan-daily-monitor-qc/SKILL.md`

Produces:

- Raw candidates;
- Pool evidence;
- monitor logs;
- QC handoff.

Does not produce articles, briefs, trend reports, frontstage copy, or recommendations.

### B. Raw / Pool / Card

Reads:

1. `AGENTS.md`
2. `context/07-v3-intelligence-generation-rules.md`
3. `agent-workflow/automation-prompts/asset-card-generator.md`

Produces:

- `signal_card` assets;
- business-signal frontstage manifest;
- relationship graph inputs;
- trend-candidate inputs.

Current business-signal Card types:

- `product_service`;
- `funding`;
- `case`.

Default daily target: 10 signal cards.

### C. First-Line Viewpoints

Reads builders / follow-builders data only.

Produces:

- `01-SiteV2/site/data/follow-builders-daily.json`;
- `01-SiteV2/site/follow-builders.html` frontstage view.

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

Trend candidate is not a trend report.

### F. Site / Dashboard / Obsidian Sync

Runs:

- business-signal site data build;
- first-line viewpoint data build;
- operations dashboard data sync;
- topic center data build;
- GitHub PR / merge path;
- local Obsidian sync after merged changes are available on `origin/main`.

## Paused / Not Active For V3.3

These are not required outputs for the current bottom layer:

- daily observation;
- trend report;
- business brief / business internal reference;
- publiccopy gate;
- cardcopy gate;
- Guanlan-style content judgment.

If any workflow or script still requires these as blockers for V3.3 business-signal production, treat it as historical contamination and update it.

## Hard Stops

Stop downstream use when:

- Raw has no original source;
- Pool has no readable body text;
- evidence comes only from search snippets or discovery pages;
- Card title falls back to backend fields;
- Card body uses naked-number fallback;
- opinion / builders material enters business-signal generation;
- relationship graph uses long generated prose instead of Card-derived nodes and edges.
