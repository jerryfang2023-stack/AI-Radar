# Heat Card Schema

Status: V2 isolation schema.

## Shared Fields

| Field | Type | Rule |
|---|---|---|
| `id` | string | Stable heat card ID |
| `cardType` | enum | `industry`, `job`, `workflow`, `triple` |
| `title` | string | Business-readable title |
| `aiHeatScore` | number | 0-10 |
| `stage` | enum | `low`, `observe`, `early`, `accelerating`, `hot`, `mature`, `controversial` |
| `heatChange` | number | Change vs previous period |
| `period` | string | Weekly or monthly period |
| `evidenceIds` | list | Must trace to HeatEvidence |
| `relatedSignals` | list | Source IDs |
| `relatedPoints` | list | Calibration IDs |
| `relatedOpportunities` | list | Opportunity IDs |
| `relatedTrends` | list | Trend IDs |
| `counterEvidence` | list | Required when stage is controversial |
| `guanlanJudgment` | string | Bounded judgment, no action command |

## Triple Card Extra Fields

| Field | Rule |
|---|---|
| `industry` | Industry seed or governed tag |
| `job` | Job seed or governed tag |
| `workflow` | Workflow seed or governed tag |
| `signalEvidenceScore` | Evidence component |
| `pointEvidenceScore` | Calibration component |
| `opportunityEvidenceScore` | Opportunity component |
| `trendEvidenceScore` | Trend component |

