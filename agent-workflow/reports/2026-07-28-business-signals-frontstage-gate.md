# 2026-07-28 Business Signals Frontstage Gate

- generated_at: 2026-07-28T06:25:17.300Z
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
  "date": "2026-07-28",
  "card_count": 35,
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
  "card_count": 1049,
  "frontstage_card_count": 1048,
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
  "date": "2026-07-28",
  "active_date": "2026-07-28",
  "active_card_count": 35,
  "relationship_node_count": 28,
  "relationship_edge_count": 29,
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
  "report": "agent-workflow/reports/frontstage-regression-gate-20260728062517.md"
}
```
