---
name: guanlan-monthly-business-structure-report
description: Use when writing, revising, or auditing a WaveSight monthly business-structure report from accepted V4 CanonicalEvents and separately namespaced viewpoint/community context. The report may adjudicate structure and downstream opportunities, but factual claims must resolve to accepted V4 evidence. Do not use for weekly reports, page rendering, or canonical fact creation.
metadata:
  guanlan:
    version: "1.1.0"
    lane: "AI financing-site reports"
    status: "downstream application"
    order: 95
    responsibility: "Write the monthly business-structure report from accepted V4 evidence."
    upstream: "Accepted monthly V4 CanonicalEvents and Claim/Source refs; independent O/C context"
    downstream: "complete six-section monthly business structure report"
    gates: "complete-month window, valid evidence IDs, factual E boundary, structural judgment, visible-body completeness"
    recent_learning: "V3 inputs and Guanlan Research are retired. Accepted monthly Markdown publishes through the AI financing site and must not regenerate duplicate report HTML."
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Monthly Business Structure Report

This downstream report cannot modify V4 canonical data.

## Required Reads

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/12-data-center-v4.md`
4. accepted daily V4 bundles for the previous complete calendar month
5. `agent-workflow/tools/lib/periodic-report-structure.mjs` for section and completeness checks
6. the bounded E/O/C manifest produced by `generate-periodic-report-deepseek.mjs`
7. `references/monthly-report-template.md`

## Evidence boundary

- `E` accepted CanonicalEvents are the factual base.
- `O` First-Line Viewpoints explain expectations and disagreement only.
- `C` Community Intelligence describes demand, friction, or practice only.
- Do not load historical weekly/monthly prose, titles or conclusions as writing material. Analyze the full monthly manifest independently; never select only the earliest records.
- V3 Desk, Signal Cards, old graph, trend candidates, and legacy mappings are forbidden.

Every concrete statement uses a valid manifest citation. Unsupported facts and numbers are removed or marked for verification.

## Method

```text
accepted monthly V4 evidence
-> structural change
-> evidence-bounded trend adjudication
-> downstream opportunity hypotheses
-> complete monthly conclusion
```

Do not create a trend from one article, one opinion, one funding event, or one demo.

## Execution

For the resolved previous complete calendar month, provide the report date and exact window:

```powershell
node agent-workflow/tools/generate-periodic-report-deepseek.mjs --kind=monthly --date=YYYY-MM-DD --window-start=YYYY-MM-DD --window-end=YYYY-MM-DD
node agent-workflow/tools/assert-periodic-report-content.mjs --kind=monthly --date=YYYY-MM-DD --window-start=YYYY-MM-DD --window-end=YYYY-MM-DD
```

The first command is an external model call and is allowed only when report generation is in scope. On content-gate failure, repair the Markdown or evidence manifest; do not render a page.

## Output

```text
01-SiteV2/content/12-applications/industry-reports/monthly/YYYY-MM-DD--monthly-report--ai-business-structure-and-opportunity.md
```

Use `status: draft` until `assert-periodic-report-content.mjs` passes. DeepSeek writes Markdown only; deterministic tooling owns HTML and navigation.

## Required sections

1. 本月核心结论
2. 结构判断
3. 趋势裁决
4. 证据完整性
5. 下游机会假设与机会地图
6. 结论

Do not produce 数据边界、矛盾与反证 or 下月验证清单, including renamed standalone modules. Exact counts and provenance belong in frontmatter and generation records. Evidence completeness addresses the business argument; it must not recreate a data-boundary module.

Deliver at least 6,000 visible body characters, preferably 7,000–8,500. Internal evidence IDs, metadata, whitespace and link URLs do not count. Minimum per section: core conclusion 450, structure 1,700, trends 1,300, evidence completeness 300, opportunities 1,500, conclusion 350. Do not pad with repetition.

Structure analysis covers value chain, buyers, supply, costs and governance through concrete examples, mechanisms, commercial consequences and limitations. Adjudicate at least three trends and develop two or three opportunity cards with buyer, demand, substitutes, supply gap, minimum product, commercialization, risks and reasoned scores. Funding is not customer revenue; planned deployment is not a delivered result.

Final titles use `laofang-title-writer` with DeepSeek Flash after the full body is available.

## Validation

- Complete previous calendar-month window.
- Exact counts and valid E/O/C IDs.
- No O/C item used as a factual event.
- No V3 path or compatibility object.
- At least one weak trend is downgraded or removed.
- All six sections remain substantively complete after internal citations are stripped.
- Content gate passes before page generation.

## Done When

Finish when the requested calendar month is fully covered, every factual statement resolves to accepted E evidence, O/C remain contextual, all six sections meet reader-visible completeness checks, and the content gate passes before page generation.
