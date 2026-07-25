---
name: guanlan-opportunity-radar-updater
description: "Use when updating, rebuilding, auditing, or explaining the independent Opportunity Map column at OMAP-V1.1.0: Entry Point Map, Product Pain Map, and reviewed Direction Cards. Applies to weekly refreshes of opportunity_signals, source-backed field extraction, heat-cell scoring, buyer-task and pain-product matrices, reviewed startup hypotheses, evidence modal behavior, and repairs when these surfaces become generic, label-driven, merged into Industry Reports, or disconnected from original articles. Do not use for weekly/monthly report prose, Reports Center pages, trend candidates, or old formal_tags aggregation."
metadata:
  guanlan:
    version: "1.3.0"
    lane: "Opportunity Map"
    status: "downstream application"
    order: 92
    responsibility: "Own the independent source-backed Opportunity Map projection and frontstage: Entry Point Map, Product Pain Map, and reviewed Direction Cards."
    upstream: "Business Signal Cards, original source excerpts, opportunity_signals taxonomy"
    downstream: "opportunity-map.html, industry-reports-frontstage.json, opportunity-direction-cards.json, source-near opportunity field repairs, evidence modal behavior, weekly opportunity radar notes"
    gates: "OMAP version boundary, weekly cadence, source-backed opportunity_signals, reviewed direction definitions, no old formal_tags aggregation, map-specific evidence thresholds, independent map page, no Relation Paths, evidence modal smoke, frontstage regression"
    recent_learning: "Direction Cards must be few, human-reviewed, falsifiable startup hypotheses backed by accepted map evidence; tag frequency alone cannot publish a direction."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Opportunity Radar Updater

This is a downstream decision-support/page-compatibility skill. Opportunity maps and scores cannot enter Data Center V4.

## Scope

Use this skill to update the independent `01-SiteV2/site/opportunity-map.html` column's source-backed maps and reviewed Direction Cards:

- `Entry Point Map`: buyer or user x specific task.
- `Product Pain Map`: pain or constraint x product form / delivery model.
- `Direction Cards`: a small set of human-reviewed startup hypotheses linked to accepted Cards and original sources.

Do not write weekly/monthly report prose with this skill. The map evidence comes from `opportunity_signals`; retired relation-path modules must not return to the page.

## Required Reads

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `context/frontstage-page-contracts.md`
5. `agent-workflow/product/opportunity-signal-taxonomy.json`
6. `references/update-rules.md`
7. `agent-workflow/product/opportunity-direction-cards.json`
8. The current Card files or `01-SiteV2/site/data/v3-data-observation-desk.json`, depending on whether the task is field repair or page refresh.

## Cadence

Run as part of the consolidated weekly report task every Monday at 10:30 Asia/Shanghai. The window is the previous complete Monday through Sunday.

Default window:

- Primary update window: latest 7 complete days of Business Signal Cards.
- Baseline comparison: previous 30 days.
- Context check: 90 days only when deciding whether a cell is persistent, newly warming, or a one-off spike.

Do not run a full map rewrite every day. Daily Cards may add `opportunity_signals`, but the map interpretation should be reviewed weekly so it reflects accumulated evidence rather than news noise.

This skill does not own an independent scheduled task. Its refresh completes before weekly report content generation so Opportunity Map and downstream reports may read the same accepted projection without sharing page ownership or version metadata.

## Workflow

1. Confirm the week window and active data source.
2. Rebuild or audit `opportunity_signals` from original source text, source excerpts, and Card facts.
3. Keep only source-near fields that the source supports:
   - buyer/user;
   - team/function;
   - specific task;
   - business action;
   - product form;
   - delivery model;
   - pain/constraint;
   - adoption evidence;
   - source evidence type.
4. Generate the two maps from those fields:
   - `Entry Point Map`: buyer/team rows x specific-task columns.
   - `Product Pain Map`: pain rows x product-form or delivery-model columns.
5. Compare 7-day cells against the 30-day baseline.
6. Leave unsupported cells blank. A blank cell is better than a vague cell.
7. Review a maximum of a few Direction Cards; each must include a falsifiable hypothesis, buyer, task, pain, product wedge, unknowns, first validation action, and at least two accepted evidence Cards.
8. Keep the two maps as separate sections on `opportunity-map.html`; Direction Cards are a third full-width section, not a new top-level navigation item and not a replacement for either map.
9. Put cell and Direction Card evidence behind click-to-open detail, not in a permanent right-side "Cell Evidence" panel.
10. Run syntax and frontstage regression checks after data or page generation.

## Evidence Rules

Allowed evidence:

- accepted Business Signal Cards;
- source URL and original source excerpt;
- source-backed `opportunity_signals`;
- first-party announcement, case study, customer deployment, funding news, procurement, pricing, product launch, technical release, or credible business media.

Disallowed as direct map evidence:

- old `formal_tags`;
- broad AI topic labels;
- trend prose;
- First-Line Viewpoints;
- Community Intelligence posts unless separately promoted through Raw / Pool / Card;
- internal ROI assumptions, private customer outcomes, or imagined implementation results.

If a source does not name a buyer, task, product form, pain, or adoption evidence, record the missing field instead of inventing one.

Direction Cards may state downstream hypotheses and validation questions, but they must be explicitly labeled as hypotheses rather than facts or recommendations. They must not contain unsupported market size, revenue projections, opaque opportunity scores, or claims that a direction is "worth doing."

## Heat Meaning

A hot cell should answer: "Where is there repeated source-backed movement that could guide an AI-native startup decision?"

Rank cells by:

- evidence count in the 7-day window;
- diversity of companies or actors;
- presence of customer deployment, procurement, pricing, adoption, or funding action;
- original-evidence strength;
- change versus the 30-day baseline.

Do not rank by:

- generic AI popularity;
- tag volume alone;
- number of repeated articles about the same event;
- model-generated label frequency.

## Output Rules

The weekly output should support these decisions:

- which buyer/task combinations deserve founder interviews;
- which product forms are being pulled by concrete pain;
- which cells are noisy supply-side launches;
- which cells have adoption or budget evidence;
- which cells should stay empty because source evidence is weak.
- which few reviewed directions have enough evidence for founder interviews, and what remains unknown.

When a cell is highlighted, include at least one Card id or source title in the supporting notes or report. When no support exists, do not highlight it.

Direction Cards require at least two accepted Cards and should prefer multiple actors or evidence forms. A single funding event, product launch, broad topic label, or model-generated aggregation cannot publish a Direction Card.

## Validation

Before finishing:

1. Verify both maps and reviewed Direction Cards render only in `01-SiteV2/site/opportunity-map.html`, under `OMAP-V1.1.0-direction-cards`.
2. Verify Reports Center contains no opportunity matrices or OMAP metadata.
3. Verify no `Relation Paths`, `Signal Candidates`, old time-clustering, or old tag-aggregation module returns.
4. Verify the old map toggle buttons and persistent right-side evidence panel do not return.
5. Verify relation path data was not converted into `opportunity_signals`.
6. Verify every Direction Card resolves to at least two accepted Cards and original-source URLs, and that no Direction Card was generated from tag frequency alone.
7. Run the most relevant syntax check for edited scripts.
8. Run `node agent-workflow/tools/frontstage-regression-gate.mjs` after page/data changes.
