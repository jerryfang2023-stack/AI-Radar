---
name: guanlan-weekly-business-change-radar
description: Use when writing, revising, or auditing the WaveSight weekly AI business change report from accepted V4 CanonicalEvents plus separately namespaced First-Line Viewpoints and Community Intelligence. The report may make downstream judgments, but every factual statement must cite accepted V4 evidence. Do not use for canonical fact creation, Opportunity Map generation, or HTML rendering.
metadata:
  guanlan:
    version: "1.3.0"
    lane: "Guanlan Research"
    status: "downstream application"
    order: 90
    responsibility: "Generate the weekly judgment report from accepted V4 event evidence with independent O/C context."
    upstream: "Accepted V4 CanonicalEvents and Claim/Source refs; independent First-Line Viewpoints and Community Intelligence context"
    downstream: "weekly report Markdown"
    gates: "complete-week window, exact counts, valid E/O/C IDs, factual E boundary, cross-evidence threshold, report content gate"
    recent_learning: "The report lane is independent from Opportunity Map generation. V3 Desk and Signal Cards are retired and must never be fallback inputs."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Weekly Business Change Radar

This is a downstream judgment report. It cannot write Data Center V4 canonical facts or block publication on an Opportunity Map failure.

## Required Reads

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/12-data-center-v4.md`
4. `context/08-automation.md`
5. `01-SiteV2/content/12-applications/industry-reports/`
6. `agent-workflow/tools/generate-periodic-report-deepseek.mjs`
7. `agent-workflow/tools/assert-periodic-report-content.mjs`

## Inputs

The deterministic report generator builds one evidence manifest for the previous complete Monday-Sunday window:

- `E`: accepted `verified` or `partial` CanonicalEvents from daily V4 bundles, preserving Event IDs and source refs;
- `O`: published records from `first-line-viewpoints-v4.json`;
- `C`: deduplicated records from `community-intelligence-daily/*.json`.

Only `E` is factual event evidence. `O` is interpretation and `C` is community demand/context. Neither may create or alter a Claim, CanonicalEvent, Entity, relationship, FDE record, or hardware record.

V3 Desk, Signal Cards, old graph data, legacy mappings, and historical weekly HTML are forbidden inputs.

## Cadence and ownership

- Run Monday 10:30 Asia/Shanghai.
- Cover the previous complete Monday through Sunday.
- DeepSeek Pro writes draft Markdown from the bounded manifest.
- `assert-periodic-report-content.mjs` must pass before deterministic page rendering.
- Opportunity direction candidates run as an independent task; their failure cannot block report content acceptance.

## Workflow

1. Resolve the previous complete Monday-Sunday window and build the bounded E/O/C manifest.
2. Verify counts, IDs, factual E provenance, and O/C namespace separation before drafting.
3. Draft the nine-section report with evidence-bounded judgments and explicit unknowns.
4. Run the content gate; repair unsupported statements in Markdown without mutating canonical inputs.
5. Hand accepted Markdown to the page generator. Keep rendering and deployment outside this skill.

## Evidence contract

- Every concrete statement cites a valid `[E:event_id]`, `[O:viewpoint_id]`, or `[C:community_id]`.
- Event claims and numeric facts require `E`.
- `O` and `C` may explain interpretation, demand, disagreement, or unknowns only.
- Unknown or insufficient evidence stays explicit.
- Do not cite IDs outside the generated manifest.
- A trend chain requires at least two accepted Events plus one named viewpoint and one community signal.

## Report shape

Produce nine numbered sections:

0. Data boundary and exact counts
1. One-sentence conclusion
2. Top-five change heatmap with direction
3. Three evidence-backed trend chains
4. Industry / role / workflow impact
5. Two or three downstream opportunity hypotheses
6. Contrarian judgment
7. Next-week verification list
8. Role-specific actions

Opportunity scores and actions are downstream research judgments. Label them as such and never write them into V4 canonical tables.

## Boundaries

- Local manifest inspection, Markdown editing, and content validation are allowed within an authorized report task.
- Do not invent IDs, facts, counts, or certainty; stop unsupported statements or mark them for verification.
- Do not publish, render HTML, modify canonical data, or let Opportunity Map availability decide report acceptance.

## Headline contract

Use one evidence-bounded judgment with a concrete consequence for budget, procurement, cost, delivery, responsibility, results, or risk. Do not use a generic report label, a table-of-contents title, or unsupported certainty.

## Output

```text
agent-workflow/reports/YYYY-MM-DD-weekly-ai-business-change-radar.md
01-SiteV2/content/12-applications/industry-reports/YYYY-MM-DD--weekly-report--ai-business-change-radar.md
```

Both files carry `status: draft` until the deterministic content gate passes.

## Validation

```powershell
node agent-workflow/tools/assert-periodic-report-content.mjs --kind=weekly --date=YYYY-MM-DD
node --test agent-workflow/tools/tests/periodic-report-renderer.test.mjs
node agent-workflow/tools/frontstage-regression-gate.mjs
```

Confirm the current report pipeline contains no V3 dataset path and does not modify canonical bundles.

## Done When

Finish when the exact weekly window and counts are disclosed, every concrete statement resolves to the bounded manifest, O/C remain contextual, the required structure and verification list are complete, and the report content gate passes before rendering.
