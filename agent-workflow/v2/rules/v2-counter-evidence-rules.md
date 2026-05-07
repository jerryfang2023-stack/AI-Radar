# V2 Counter-Evidence Rules

Counter-evidence is required for V2 judgment quality. It prevents hot topics from becoming certainty claims.

## Counter-Evidence Types

| Type | Examples | Field |
|---|---|---|
| Commercial | No customer proof, unclear pricing, long sales cycle, low margin | `counterEvidence` |
| Technical | Accuracy, latency, cost, integration, reliability | `counterEvidence` |
| Regulatory | Privacy, data transfer, industry approval, safety | `riskFactors` |
| Platform | Model API dependence, channel lock-in, ecosystem policy | `riskFactors` |
| Point calibration | Builder criticism, customer failure, VC cooling | `pointCalibration` |
| China transfer | Budget, delivery model, channel, compliance, localization | `chinaTransferNotes` |

## Required Use

- Front Signals need at least two boundary or counter-evidence variables.
- Controversial HeatCards must include counter-evidence.
- AIBriefIssue must include `counterEvidenceSummary` and `evidenceGaps`.
- Unknowns must stay as unknowns; do not convert missing data into confident judgment.

