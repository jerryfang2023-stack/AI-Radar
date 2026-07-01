# Opportunity Radar Update Rules

## Purpose

The opportunity radar is a startup decision surface, not a trend word cloud.

It should tell a founder:

- who appears to buy, deploy, or operate AI;
- which concrete task is changing;
- which product form is being pulled by pain;
- whether evidence is customer/budget/adoption-backed or only supply-side launch noise.

## Weekly Rhythm

Run once per week, preferably after the weekly Business Signals data is complete.

Use three windows:

| Window | Role |
|---|---|
| 7 days | New movement and current heat |
| 30 days | Baseline and repeated evidence |
| 90 days | Persistence check only |

The 7-day window decides what changed. The 30-day window prevents overreacting to a single event. The 90-day window is only for context, not for inflating heat.

## Field Discipline

Each Card should carry `opportunity_signals` fields only when the source supports them.

Required for useful map cells:

- `buyer_or_user` or `team_or_function`;
- `specific_task`;
- either `product_form` or `delivery_model`;
- `pain_or_constraint` for the Product Pain Map;
- `business_action`;
- `source_evidence_type`;
- `source_excerpt`.

High-value optional fields:

- `adoption_evidence`;
- `pricing_or_budget` when present in source text;
- concrete metric from the source.

## Map Rules

### Entry Point Map / 切入点图

Rows represent buyer/user or team/function. Columns represent concrete tasks.

Good cells:

- sales team x lead research;
- legal team x contract review;
- procurement team x RFP response;
- healthcare provider x medical documentation;
- engineering team x code review.

Bad cells:

- enterprise x AI transformation;
- AI Agent x workflow;
- productivity x automation.

Those are labels, not startup entry points.

### Product Pain Map / 产品痛点图

Rows represent pain/constraint. Columns represent product form or delivery model.

Good cells:

- cost pressure x model gateway;
- permission/audit x agent workbench;
- hallucination/trust x evaluation platform;
- workflow integration x FDE service;
- data silo/context x RAG knowledge base.

Bad cells:

- AI adoption x platform;
- efficiency x solution;
- enterprise AI x SaaS.

Those do not explain what to build or how to sell it.

## Heat Scoring Heuristic

For each cell, score qualitatively before visual rendering:

| Signal | Weight |
|---|---:|
| unique source-backed Cards | 30 |
| distinct actors / companies | 15 |
| customer deployment, procurement, pricing, funding, or usage evidence | 25 |
| source quality and excerpt strength | 15 |
| 7-day rise versus 30-day baseline | 15 |

Use this as judgment guidance, not as a public backend field unless the user asks for it.

## Empty Cell Rule

If the source evidence does not support a cell, keep it empty.

An empty cell means "no reliable public evidence yet." It is better than filling the map with broad AI language.


## Frontstage Presentation Rules

The Reports Center page should present the opportunity maps as decision surfaces, not as a compact dashboard widget.

- The top-level section title should be `机会地图` / `Opportunity Map`.
- Entry Point Map and Product Pain Map must be separate sections with their own Chinese and English subcolumn names.
- Do not hide the two maps behind toggle buttons once both can be read on the same page.
- Map cells should open related Card evidence in a modal or equivalent detail layer.
- Do not keep a persistent right-side "Cell Evidence" instruction panel on the page.
- Relation paths may appear after the maps as supporting exploration, but they should not occupy the first screen or replace map evidence.
- Keep the visual palette report-like and low saturation: warm paper background, dark blue actions, gold accents, and restrained status colors.
## Boundaries

- Relationship graph uses old graph tags and Card edges.
- Opportunity maps use `opportunity_signals`.
- Weekly report prose may interpret the map, but it is not the data source for the map.
- Community and viewpoint materials can inspire questions, but cannot directly heat a cell unless promoted through Raw / Pool / Card.
