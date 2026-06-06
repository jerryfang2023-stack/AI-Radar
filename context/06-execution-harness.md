---
status: current
scope: v3-execution-harness
last_updated: 2026-06-06
priority: current
---

# V3 Execution Harness

Use this harness for V3 monitoring, Pool routing, Card generation, relationship graph, trend-candidate analysis, and site data sync.

Current rule source:

```text
context/07-v3-intelligence-generation-rules.md
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
- frontstage manifest;
- relationship graph inputs;
- trend-candidate inputs.

Current business-signal Card types:

- `product_service`;
- `funding`;
- `case`.

Default daily target: 10 signal cards.

### C. Relationship Graph

Reads accepted Cards only.

Produces graph data:

- nodes;
- edges;
- evidence links.

Do not write long prose as the graph. Do not include opinion content.

### D. Trend Candidate

Reads accepted Cards and relationship graph input.

Produces trend candidates only when multiple same-direction signals exist.

Trend candidate is not a trend report.

## Paused / Not Active For V3

These are not required outputs for the current V3 bottom layer:

- daily observation;
- trend report;
- business brief / business internal reference;
- publiccopy gate;
- cardcopy gate;
- Guanlan-style content judgment;
- follow-builders / opinion lane.

If any workflow or script still requires these as blockers for V3 business-signal production, treat it as historical contamination and update it.

## Hard Stops

Stop downstream use when:

- Raw has no original source;
- Pool has no readable body text;
- evidence comes only from search snippets or discovery pages;
- Card title falls back to backend fields;
- Card body uses naked-number fallback;
- opinion / follow-builders material enters business-signal generation;
- relationship graph uses long generated prose instead of Card-derived nodes and edges.

