---
name: guanlan-opportunity-radar-updater
description: "Use when updating, rebuilding, auditing, or explaining the Reports Center opportunity maps: Entry Point Map and Product Pain Map. Applies to weekly refreshes of opportunity_signals, source-backed field extraction, heat-cell scoring, buyer-task and pain-product matrices, evidence modal behavior, and repairs when these maps become generic, label-driven, squeezed behind toggles, or disconnected from original articles. Do not use for weekly/monthly report prose, trend candidates, or old formal_tags aggregation."
metadata:
  guanlan:
    version: "1.1.0"
    lane: "Reports Center"
    status: "downstream application"
    order: 92
    responsibility: "Update the source-backed opportunity maps and their frontstage presentation for AI-native startup judgment: Entry Point Map and Product Pain Map."
    upstream: "Business Signal Cards, original source excerpts, opportunity_signals taxonomy"
    downstream: "Reports Center opportunity maps, source-near opportunity field repairs, evidence modal behavior, weekly opportunity radar notes"
    gates: "weekly cadence, source-backed opportunity_signals, no old formal_tags aggregation, map-specific evidence thresholds, standalone map presentation, evidence modal smoke, frontstage regression"
    recent_learning: "The maps are useful only when cells come from concrete buyer, task, product-form, pain, and adoption evidence in original materials; on the Reports Center page, the two maps must remain separate full-width decision surfaces with click-to-open evidence instead of a persistent right-side explanation panel."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Opportunity Radar Updater

This is a downstream decision-support/page-compatibility skill. Opportunity maps and scores cannot enter Data Center V4.

## Scope

Use this skill to update the Reports Center's two startup-oriented maps:

- `Entry Point Map`: buyer or user x specific task.
- `Product Pain Map`: pain or constraint x product form / delivery model.

Do not write weekly/monthly report prose with this skill. Relation paths may sit near the maps on the Reports Center page, but the map evidence still comes from `opportunity_signals`.

## Required Reads

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `context/frontstage-page-contracts.md`
5. `agent-workflow/product/opportunity-signal-taxonomy.json`
6. `references/update-rules.md`
7. The current Card files or `01-SiteV2/site/data/v3-data-observation-desk.json`, depending on whether the task is field repair or page refresh.

## Cadence

Update once per week.

Default window:

- Primary update window: latest 7 complete days of Business Signal Cards.
- Baseline comparison: previous 30 days.
- Context check: 90 days only when deciding whether a cell is persistent, newly warming, or a one-off spike.

Do not run a full map rewrite every day. Daily Cards may add `opportunity_signals`, but the map interpretation should be reviewed weekly so it reflects accumulated evidence rather than news noise.

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
7. Keep the two maps as separate frontstage sections with their own Chinese / English subcolumn names.
8. Put cell evidence behind click-to-open detail, not in a permanent right-side "Cell Evidence" panel.
9. Run syntax and frontstage regression checks after data or page generation.

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

When a cell is highlighted, include at least one Card id or source title in the supporting notes or report. When no support exists, do not highlight it.

## Validation

Before finishing:

1. Verify both maps still render in `01-SiteV2/site/intelligence-map.html`.
2. Verify no `Signal Candidates`, old time-clustering, or old tag-aggregation module returns.
3. Verify the old map toggle buttons and persistent right-side evidence panel do not return.
4. Verify relation path data was not converted into `opportunity_signals`.
5. Run the most relevant syntax check for edited scripts.
6. Run `node agent-workflow/tools/frontstage-regression-gate.mjs` after page/data changes.
