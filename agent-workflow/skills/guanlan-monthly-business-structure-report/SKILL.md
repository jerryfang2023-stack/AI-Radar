---
name: guanlan-monthly-business-structure-report
description: Produce WaveSight AI monthly business structure and opportunity reports. Use when writing, revising, or auditing a monthly report from Business compatibility Cards, weekly reports, Community Intelligence, First-Line Viewpoints, Industry Reports context, trend candidates, or opportunity maps. The report must diagnose industry-structure change, adjudicate trends, build an opportunity map, and define next-month verification conditions. Do not use for daily Cards, weekly reports, frontstage page generation, or business-signal fact creation.
metadata:
  guanlan:
    version: "0.1.2"
    lane: "Business Signals"
    status: "downstream application"
    order: 95
    responsibility: "Write monthly AI business structure and opportunity reports from compatibility Cards, weekly reports, Community Intelligence, First-Line Viewpoints, and Industry Reports context."
    upstream: "Business compatibility Cards, weekly business change radar reports, Community Intelligence demand signals, First-Line Viewpoints expectation shifts, Industry Reports context"
    downstream: "monthly business structure report, trend adjudication table, opportunity map, next-month verification list"
    gates: "source-backed fact boundary, no weekly-roundup structure, multi-signal trend threshold, opportunity buyer/workflow/trigger completeness, next-month verification conditions"
    recent_learning: "A strong monthly report should merge the expressive structure of the DeepSeek draft with WaveSight evidence discipline: keep deployment-delivery-layer judgment, but remove or mark unverified external macro numbers."
    mirrored_in_skill_store: true
---

# Guanlan Monthly Business Structure Report

This judgment report is a downstream application and cannot write Data Center V4 canonical facts.

## Required Reads

Read only what is needed:

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. current month files under `01-SiteV2/content/04-business-signals/signals/`
5. current month weekly reports under `01-SiteV2/content/08-report/`
6. relevant Community Intelligence daily data under `01-SiteV2/site/data/community-intelligence-daily/`
7. `01-SiteV2/site/data/follow-builders-daily.json` or current First-Line Viewpoints archive
8. `01-SiteV2/site/data/v3-data-observation-desk.json` and `intelligence-graph-index.json` when relationship or trend context is needed

Read `references/monthly-report-template.md` before writing a new report.

## Scope

This skill writes one monthly judgment report, not a longer weekly roundup.

Default output path:

```text
01-SiteV2/content/08-report/monthly/YYYY-MM-DD--monthly-report--ai-business-structure-and-opportunity.md
```

Use `status: draft` unless the user explicitly asks to publish and validation is complete.

## Cadence

Run at 14:00 Asia/Shanghai on the first Monday-Friday weekday of each month and cover the previous complete calendar month. The same controller also creates the monthly maintenance report. After the monthly Markdown is written, `assert-periodic-report-content.mjs` must pass before the monthly page-generator skill may run.

## Core Method

Monthly reports follow this causal chain:

```text
industry structure change
-> trend adjudication
-> opportunity map
-> next-month verification
```

The report must answer:

1. What changed in the AI business structure this month?
2. Which trends should be upgraded, newly added, watched, downgraded, or removed?
3. Which opportunities became actionable because of the structural change?
4. What evidence would upgrade or downgrade each trend next month?

## Evidence Boundaries

- Use Business Signals and source-backed Cards as the fact base.
- Use Community Intelligence only as demand-side temperature, workflow evidence, and supply-gap hints.
- Use First-Line Viewpoints only for expectation shifts, consensus, and disagreement.
- Do not use viewpoints, social/community posts, or funding alone as business-signal facts.
- Do not create a trend from one article, one opinion, one funding event, or one demo.
- Mark any external statistic not traceable to current repo evidence as `待复核` or remove it from core claims.

## Report Shape

Every report should contain:

1. Data boundary
2. Monthly structure judgment
3. Industry structure change map
4. Trend adjudication table
5. Trend-chain completeness judgment
6. Opportunity map with opportunity cards
7. Key contradictions
8. Next-month verification checklist
9. Monthly conclusion

Use the template in `references/monthly-report-template.md`.

## Trend Adjudication

Classify each trend:

- `升级`: multi-week or multi-source evidence strengthened.
- `新增`: early but meaningful evidence entered the watch pool.
- `继续观察`: evidence exists but remains incomplete.
- `降级`: hype or supply-side activity remains but business evidence weakened.
- `淘汰`: no longer supported by source-backed evidence.

Each trend row must include:

- corresponding structural change;
- evidence base;
- counter-evidence or limitation;
- next-month upgrade / downgrade condition.

## Opportunity Cards

Prefer 5-7 opportunity cards. Each card must include:

- opportunity name;
- opportunity type;
- corresponding structural change;
- supporting trend;
- target buyer;
- specific pain;
- supply gap;
- why now;
- commercialization path;
- main risk;
- next-month verification signal.

Do not present a community-only idea as high certainty. Mark it as early or observation unless it is separately supported by Business Signals.

## Quality Gates

Before finalizing:

1. Data scope includes exact files, counts, and boundary notes.
2. The report is not a four-week news or weekly-report digest.
3. Every core claim is traceable to compatibility Cards, weekly reports, Community, Viewpoints, or Industry Reports inputs.
4. Community and Viewpoints are not used as fact evidence.
5. At least one trend is downgraded or removed when evidence is weak.
6. Opportunity cards include buyer, pain, supply gap, path, risk, and verification signal.
7. Every next-month watch item has an observable trigger.
8. Unsupported external numbers are removed or marked `待复核`.

## Handoff

After writing:

- keep source files unchanged unless explicitly asked;
- if a monthly report reveals missing data or weak gates, record the risk in the report rather than silently repairing data;
- update this skill only when a recurring monthly-report failure appears.
