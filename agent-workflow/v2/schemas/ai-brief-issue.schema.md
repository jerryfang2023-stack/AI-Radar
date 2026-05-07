# AI Brief Issue Schema

Status: V2 isolation schema.

Required fields:

| Field | Type | Rule |
|---|---|---|
| `id` | string | Suggested `aibrief-YYYY-Www` or `aibrief-YYYY-MM` |
| `title` | string | Issue title |
| `period` | string | Weekly or monthly period |
| `issueType` | enum | `weekly`, `monthly` |
| `executiveSummary` | list | 3-5 bounded judgments |
| `topIndustries` | list | HeatCard references |
| `topJobs` | list | HeatCard references |
| `topWorkflows` | list | HeatCard references |
| `topTriples` | list | MVP priority |
| `risingHeatPoints` | list | Rising cards |
| `coolingHeatPoints` | list | Cooling cards |
| `controversialHeatPoints` | list | Must include counter-evidence |
| `keyJudgments` | list | Bounded conclusions |
| `evidenceSummary` | object | Signals, Points, Opportunities, Trends references |
| `counterEvidenceSummary` | list | Required |
| `evidenceGaps` | list | Required |
| `guanlanConclusion` | string | No investment, operation, or partnership decision |

Weekly is MVP. Monthly full issue is a later phase.

