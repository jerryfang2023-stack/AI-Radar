# 2026-07-19 Business Signals Frontstage Gate

- generated_at: 2026-07-19T06:43:55.487Z
- status: passed
- failure_categories: none

## Gate Results

### V3 source-first frontstage gate

- status: passed
- script: agent-workflow/tools/assert-v3-source-first-frontstage.mjs
- exit_code: 0

```text
{
  "ok": true,
  "status": "passed",
  "checked_file": "01-SiteV2/site/data/v3-data-observation-desk.json",
  "card_count": 850,
  "frontstage_card_count": 849,
  "issue_count": 0,
  "issues": []
}
```

### Business Signals three-block contract

- status: passed
- script: agent-workflow/tools/assert-business-signals-three-block-contract.mjs
- exit_code: 0

```text
{
  "ok": true,
  "date": "2026-07-19",
  "active_date": "2026-07-19",
  "active_card_count": 33,
  "relationship_node_count": 28,
  "relationship_edge_count": 26,
  "today_trend_candidate_count": 0,
  "no_trend_candidate_decision": true,
  "problems": []
}
```

### Frontstage regression gate

- status: passed
- script: agent-workflow/tools/frontstage-regression-gate.mjs
- exit_code: 0

```text
{
  "ok": true,
  "status": "passed",
  "issue_count": 0,
  "report": "agent-workflow/reports/frontstage-regression-gate-20260719064355.md"
}
```
