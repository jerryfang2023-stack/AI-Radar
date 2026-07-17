# 2026-07-17 Business Signals Frontstage Gate

- generated_at: 2026-07-17T04:40:47.977Z
- status: failed
- failure_categories: raw_card_ingestion_fields

## Gate Results

### V3 source-first frontstage gate

- status: failed
- script: agent-workflow/tools/assert-v3-source-first-frontstage.mjs
- exit_code: 1

```text
{
  "ok": false,
  "status": "failed",
  "checked_file": "01-SiteV2/site/data/v3-data-observation-desk.json",
  "card_count": 587,
  "frontstage_card_count": 586,
  "issue_count": 2,
  "issues": [
    "01-SiteV2/knowledge/01-Signal-Cards/funding/2026-07-17--signal--now-auto-signal-p-052.md has English source_title but no title_zh or exact source-title translation entry",
    "frontstage card 2026-07-17 SIG-20260717-A14 public title is not backed by original source title translation: Now 获得 550 万美元融资"
  ]
}
```

### Business Signals three-block contract

- status: passed
- script: agent-workflow/tools/assert-business-signals-three-block-contract.mjs
- exit_code: 0

```text
{
  "ok": true,
  "date": "2026-07-17",
  "active_date": "2026-07-17",
  "active_card_count": 28,
  "relationship_node_count": 28,
  "relationship_edge_count": 40,
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
  "report": "agent-workflow/reports/frontstage-regression-gate-20260717044047.md"
}
```
