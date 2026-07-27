# 2026-07-27 Business Signals Frontstage Gate

- generated_at: 2026-07-27T03:20:33.291Z
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
  "card_count": 1014,
  "frontstage_card_count": 1013,
  "issue_count": 0,
  "issues": []
}
```

### Business Signals compatibility contract

- status: passed
- script: agent-workflow/tools/assert-business-signals-compatibility-contract.mjs
- exit_code: 0

```text
{
  "ok": true,
  "date": "2026-07-27",
  "active_date": "2026-07-27",
  "active_card_count": 18,
  "relationship_node_count": 28,
  "relationship_edge_count": 40,
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
  "report": "agent-workflow/reports/frontstage-regression-gate-20260727032033.md"
}
```
