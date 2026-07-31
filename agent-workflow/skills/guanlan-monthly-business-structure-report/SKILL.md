---
name: guanlan-monthly-business-structure-report
description: Use when writing, revising, or auditing a WaveSight monthly business-structure report from accepted V4 CanonicalEvents and separately namespaced viewpoint/community context. The report may adjudicate structure and downstream opportunities, but factual claims must resolve to accepted V4 evidence. Do not use for weekly reports, page rendering, or canonical fact creation.
metadata:
  guanlan:
    version: "0.3.0"
    lane: "Guanlan Research"
    status: "downstream application"
    order: 95
    responsibility: "Write the monthly business-structure report from accepted V4 evidence."
    upstream: "Accepted V4 CanonicalEvents and Claim/Source refs; weekly reports; independent O/C context; Opportunity Map projection"
    downstream: "monthly business structure report and next-month verification list"
    gates: "complete-month window, valid evidence IDs, factual E boundary, structural judgment, observable verification conditions"
    recent_learning: "V3 Desk, Signal Cards, old graph data, and compatibility mappings are retired and cannot be monthly-report inputs."
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
5. current weekly reports under `01-SiteV2/content/12-applications/industry-reports/`
6. the bounded E/O/C manifest produced by `generate-periodic-report-deepseek.mjs`
7. `references/monthly-report-template.md`

## Evidence boundary

- `E` accepted CanonicalEvents are the factual base.
- `O` First-Line Viewpoints explain expectations and disagreement only.
- `C` Community Intelligence describes demand, friction, or practice only.
- Opportunity Map and weekly reports are downstream context, not canonical evidence.
- V3 Desk, Signal Cards, old graph, trend candidates, and legacy mappings are forbidden.

Every concrete statement uses a valid manifest citation. Unsupported facts and numbers are removed or marked for verification.

## Method

```text
accepted monthly V4 evidence
-> structural change
-> evidence-bounded trend adjudication
-> downstream opportunity hypotheses
-> next-month verification conditions
```

Do not create a trend from one article, one opinion, one funding event, or one demo.

## Output

```text
01-SiteV2/content/12-applications/industry-reports/monthly/YYYY-MM-DD--monthly-report--ai-business-structure-and-opportunity.md
```

Use `status: draft` until `assert-periodic-report-content.mjs` passes. DeepSeek writes Markdown only; deterministic tooling owns HTML and navigation.

## Required sections

1. Data boundary
2. Monthly structural judgment
3. Industry structure changes
4. Trend adjudication
5. Evidence completeness
6. Downstream opportunity hypotheses
7. Key contradictions
8. Next-month verification checklist
9. Conclusion

## Validation

- Complete previous calendar-month window.
- Exact counts and valid E/O/C IDs.
- No O/C item used as a factual event.
- No V3 path or compatibility object.
- At least one weak trend is downgraded or removed.
- Every next-month condition is observable.
- Content gate passes before page generation.
