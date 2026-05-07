# Heat Evidence Schema

Status: V2 isolation schema.

Required fields:

| Field | Type | Rule |
|---|---|---|
| `id` | string | Stable HeatEvidence ID |
| `sourceType` | enum | `signal`, `point`, `opportunity`, `trend` |
| `sourceId` | string | Must trace back to source asset |
| `sourceTitle` | string | Source title |
| `title` | string | Evidence title |
| `summary` | string | Factual or calibrated summary |
| `judgment` | string | Bounded judgment |
| `industryTags` | list | At least one required for heat entry |
| `jobTags` | list | At least one job or workflow tag required |
| `workflowTags` | list | At least one workflow or job tag required |
| `seedTags` | list | Heat seed layer |
| `formalTags` | list | Governed tags |
| `candidateTags` | list | Awaiting governance |
| `impactModes` | list | Revenue, cost, efficiency, experience, management, risk |
| `businessValueTags` | list | Business value mapping |
| `evidenceRole` | enum | `fact`, `calibration`, `opportunity`, `trend`, `counter_evidence`, `boundary` |
| `evidenceScore` | number | 0-100 |
| `confidenceScore` | number | 0-100 |
| `heatDirection` | enum | `up`, `stable`, `down`, `mixed` |
| `heatContribution` | number | Normalized 0-100 |
| `period` | string | `YYYY-Www` or `YYYY-MM` |
| `publishedAt` | date | Source publication date |
| `sourceLevel` | enum | `S`, `A`, `B`, `C` |
| `relatedSignalIds` | list | Can be empty only with reason |
| `relatedPointIds` | list | Calibration references |
| `relatedOpportunityIds` | list | Opportunity references |
| `relatedTrendIds` | list | Trend references |
| `counterEvidence` | list | Risk and opposition |
| `riskFactors` | list | Platform, regulation, transfer, execution risks |
| `evidenceGaps` | list | Known unknowns |
| `chinaTransferNotes` | list | Transfer observations |
| `productionReadiness` | enum | `isolation_only`, `candidate`, `production_ready` |

Point-only evidence cannot enter `evidenceRole: fact`.

