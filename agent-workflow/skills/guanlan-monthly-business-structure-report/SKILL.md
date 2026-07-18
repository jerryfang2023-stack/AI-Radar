---
name: guanlan-monthly-business-structure-report
description: Produce WaveSight AI monthly business structure and opportunity reports. Use when writing, revising, or auditing a monthly report from Business compatibility Cards, weekly reports, Community Intelligence, First-Line Viewpoints, internal trend candidates, or the independent Opportunity Map projection. The report must diagnose industry-structure change, adjudicate trends, interpret source-backed opportunity evidence, and define next-month verification conditions. Do not use for daily Cards, weekly reports, frontstage page generation, or business-signal fact creation.
metadata:
  guanlan:
    version: "0.2.1"
    lane: "Business Signals"
    status: "downstream application"
    order: 95
    responsibility: "Write monthly AI business structure and opportunity reports from compatibility Cards, weekly reports, Community Intelligence, First-Line Viewpoints, internal trend candidates, and the independent Opportunity Map projection."
    upstream: "Business compatibility Cards, weekly business change radar reports, Community Intelligence demand signals, First-Line Viewpoints expectation shifts, internal trend candidates, Opportunity Map projection"
    downstream: "monthly business structure report, trend adjudication table, opportunity map, next-month verification list"
    gates: "headline tension and structural consequence, source-backed fact boundary, no weekly-roundup structure, multi-signal trend threshold, opportunity buyer/workflow/trigger completeness, next-month verification conditions"
    recent_learning: "月报标题应选择一个最强结构判断，并写清它如何改变预算、采购、成本、交付或竞争位置；不要把日期、报告类型和多个趋势压进标题。"
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

Production generation uses DeepSeek Pro and first writes `status: draft`. Concrete judgments cite only manifest IDs in `[E:]`, `[O:]`, or `[C:]` form. After the content gate passes, the deterministic renderer promotes the accepted Markdown and updates the V4 page; the model never edits HTML or canonical facts.

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

## Headline Contract

The title must express one structural judgment and its business consequence. Date, month, and report type belong in metadata and page context, not in the headline.

- Use 14-42 visible characters.
- Build tension with `不是 / 却 / 反而 / 真正 / 缺的是 / 越...越...` or a colon-led consequence.
- Name the changed value position, budget destination, procurement gate, cost structure, delivery responsibility, or opportunity boundary.
- Prefer the strongest structural judgment in §1 or the most consequential contradiction in §6.
- Avoid generic labels such as `2026 年 6 月 AI 商业结构与机会月报`.
- Avoid stacking abstract transitions such as `浮现 / 进入 / 转向 / 升温` in one title.
- Keep every claim within accepted report evidence.

Good: `模型继续制造注意力，真正接近预算的是部署交付层`

Bad: `部署交付层浮现，企业 AI 从工具采用进入流程接管`

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

1. The title passes the Headline Contract and states one evidence-bounded structural consequence.
2. Data scope includes exact files, counts, and boundary notes.
3. The report is not a four-week news or weekly-report digest.
4. Every core claim is traceable to compatibility Cards, weekly reports, Community, Viewpoints, internal trend candidates, or accepted Opportunity Map inputs.
5. Community and Viewpoints are not used as fact evidence.
6. At least one trend is downgraded or removed when evidence is weak.
7. Opportunity cards include buyer, pain, supply gap, path, risk, and verification signal.
8. Every next-month watch item has an observable trigger.
9. Unsupported external numbers are removed or marked `待复核`.

## Handoff

After writing:

- keep source files unchanged unless explicitly asked;
- if a monthly report reveals missing data or weak gates, record the risk in the report rather than silently repairing data;
- update this skill only when a recurring monthly-report failure appears.
