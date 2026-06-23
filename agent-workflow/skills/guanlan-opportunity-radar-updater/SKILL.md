---
name: guanlan-opportunity-radar-updater
description: "Use when updating, rebuilding, auditing, or explaining the Intelligence Map opportunity radar: the Entry Point Map / 切入点图 and Product Pain Map / 产品痛点图. Applies to weekly refreshes of opportunity_signals, source-backed field extraction, heat-cell scoring, buyer-task and pain-product matrices, and repairs when these maps become generic, label-driven, or disconnected from original articles. Do not use for the relationship graph, weekly report prose, trend candidates, or old formal_tags aggregation."
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Intelligence Map"
    status: "current sub-skill"
    order: 92
    responsibility: "Update the source-backed opportunity radar maps for AI-native startup judgment: Entry Point Map and Product Pain Map."
    upstream: "Business Signal Cards, original source excerpts, opportunity_signals taxonomy"
    downstream: "Intelligence Map opportunity panels, source-near opportunity field repairs, weekly opportunity radar notes"
    gates: "weekly cadence, source-backed opportunity_signals, no old formal_tags aggregation, map-specific evidence thresholds, frontstage regression"
    recent_learning: "The maps are useful only when cells come from concrete buyer, task, product-form, pain, and adoption evidence in original materials; generic AI-generated labels must be removed or left blank."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Opportunity Radar Updater

## Scope

Use this skill to update the Intelligence Map's two startup-oriented maps:

- `切入点图`: buyer or user x specific task.
- `产品痛点图`: pain or constraint x product form / delivery model.

Do not update the relationship graph with this skill. The relationship graph continues to use the old relationship tags and Card graph inputs.

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
   - `切入点图`: buyer/team rows x specific-task columns.
   - `产品痛点图`: pain rows x product-form or delivery-model columns.
5. Compare 7-day cells against the 30-day baseline.
6. Leave unsupported cells blank. A blank cell is better than a vague cell.
7. Run syntax and frontstage regression checks after data or page generation.

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
- source quality;
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
2. Verify no `Signal Candidates`, `时间聚集`, or old `Tag 聚合` module returns.
3. Verify relationship graph data was not converted to `opportunity_signals`.
4. Run the most relevant syntax check for edited scripts.
5. Run `node agent-workflow/tools/frontstage-regression-gate.mjs` after page/data changes.
