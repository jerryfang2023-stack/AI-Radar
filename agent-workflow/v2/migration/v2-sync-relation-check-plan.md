# V2 Sync Relation Check Plan

Status: isolation plan.

## Relation Checks To Add Later

| Relation | Rule |
|---|---|
| Raw -> Pool | Pool item must reference raw IDs or source paths |
| Pool -> Structured | Structured item must reference pool IDs |
| Structured -> Front Signal | Front Signal must reference structured ID |
| Front Signal -> HeatEvidence | HeatEvidence must reference source signal ID |
| Point -> HeatEvidence | Point can only contribute calibration, counter-evidence, or boundary |
| HeatEvidence -> HeatCard | HeatCard evidence IDs must exist |
| HeatCard -> AIBriefIssue | Issue top cards must exist |
| Legacy index -> V1 path | Indexed file must still exist |

## Future Dev Tasks

- Add isolated parser for V2 markdown.
- Add HeatEvidence relation validator.
- Add AIBriefIssue evidence validator.
- Add legacy index path validator.
- Add V1 fallback check before V2 data output.

