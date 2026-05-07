# V2 Ingestion Rules

V2 ingestion uses a staged funnel:

```text
Raw -> Pool -> Structured -> Front Signal -> Deep Dive / Trend -> HeatEvidence -> HeatCard -> AIBriefIssue
```

## Hard Rules

- V2 new content defaults to `06-content/v2/`.
- Do not write V2 new content into V1 directories without a separate production cutover task.
- Raw and Pool are never frontstage content.
- Front Signals require at least 3 S/A/B sources.
- C-level sources can trigger investigation but cannot serve as sole fact evidence.
- Every promoted item must preserve source path, source level, evidence gaps, counter-evidence, and mapping reason.
- Point / Builder material is calibration, boundary, or counter-evidence unless separately backed by S/A/B fact sources.

## Promotion Gates

| Stage | Promote When | Stop When |
|---|---|---|
| Raw -> Pool | Commercial relevance and industry/job/workflow hypothesis exist | No source path or no business relevance |
| Pool -> Structured | Fact can be checked and secondary search is possible | Duplicate, PR-only, or no business meaning |
| Structured -> Front Signal | 3 S/A/B sources, six-part opportunity decomposition, counter-evidence | Confidence below 60 or missing evidence boundary |
| Front Signal -> HeatEvidence | Industry + job/workflow tags and impact modes exist | No traceable source ID |
| HeatEvidence -> HeatCard | Enough evidence across period and no hard relation break | Point-only fact, missing counter-evidence in controversial items |
| HeatCard -> AIBriefIssue | Issue can explain heat change and evidence boundary | Ranking list without evidence explanation |

