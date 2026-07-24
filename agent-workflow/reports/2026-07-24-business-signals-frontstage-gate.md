# 2026-07-24 Business Signals Frontstage Gate

- generated_at: 2026-07-24T13:22:59.965Z
- status: passed
- failure_categories: none

## Gate Results

### Signal Card editorial quality gate

- status: passed
- script: agent-workflow/tools/assert-signal-card-editorial-quality.mjs
- exit_code: 0

```text
{
  "ok": true,
  "date": "2026-07-24",
  "card_count": 38,
  "problems": []
}
```

### V3 source-first frontstage gate

- status: passed
- script: agent-workflow/tools/assert-v3-source-first-frontstage.mjs
- exit_code: 0

```text
{
  "ok": true,
  "status": "passed",
  "checked_file": "01-SiteV2/site/data/v3-data-observation-desk.json",
  "card_count": 969,
  "frontstage_card_count": 968,
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
  "date": "2026-07-24",
  "active_date": "2026-07-24",
  "active_card_count": 38,
  "relationship_node_count": 28,
  "relationship_edge_count": 27,
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
  "report": "agent-workflow/reports/frontstage-regression-gate-20260724132259.md"
}
```
