# 2026-07-26 Business Signals Frontstage Gate

- generated_at: 2026-07-26T01:51:51.891Z
- status: failed
- failure_categories: frontstage_contract, frontstage_regression, compatibility_contract

## Gate Results

### Signal Card editorial quality gate

- status: failed
- script: agent-workflow/tools/assert-signal-card-editorial-quality.mjs
- exit_code: 1

```text
{
  "ok": false,
  "date": "2026-07-26",
  "card_count": 0,
  "problems": [
    "no formal Signal Cards generated for 2026-07-26"
  ]
}
```

### V3 source-first frontstage gate

- status: failed
- script: agent-workflow/tools/assert-v3-source-first-frontstage.mjs
- exit_code: 1

```text
{
  "ok": false,
  "status": "failed",
  "checked_file": "01-SiteV2/site/data/v3-data-observation-desk.json",
  "card_count": 996,
  "frontstage_card_count": 995,
  "issue_count": 1,
  "issues": [
    "payload activeDate is 2026-07-25, expected 2026-07-26"
  ]
}
```

### Business Signals compatibility contract

- status: failed
- script: agent-workflow/tools/assert-business-signals-compatibility-contract.mjs
- exit_code: 1

```text
{
  "ok": false,
  "date": "2026-07-26",
  "active_date": "2026-07-25",
  "active_card_count": 0,
  "relationship_node_count": 28,
  "relationship_edge_count": 26,
  "problems": [
    "activeDate 2026-07-25 does not match 2026-07-26",
    "active-date public Card count is 0",
    "relationship graph date 2026-07-25 does not match 2026-07-26",
    "relationship edge 1 references non-active Card SIG-20260725-A26",
    "relationship edge 2 references non-active Card SIG-20260725-A01",
    "relationship edge 3 references non-active Card SIG-20260725-A10",
    "relationship edge 4 references non-active Card SIG-20260725-A06",
    "relationship edge 5 references non-active Card SIG-20260725-A16",
    "relationship edge 6 references non-active Card SIG-20260725-A07",
    "relationship edge 7 references non-active Card SIG-20260725-A22",
    "relationship edge 8 references non-active Card SIG-20260725-A11",
    "relationship edge 9 references non-active Card SIG-20260725-A08",
    "relationship edge 10 references non-active Card SIG-20260725-A14",
    "relationship edge 11 references non-active Card SIG-20260725-A13",
    "relationship edge 12 references non-active Card SIG-20260725-A25",
    "relationship edge 13 references non-active Card SIG-20260725-A15",
    "relationship edge 14 references non-active Card SIG-20260725-A09",
    "relationship edge 15 references non-active Card SIG-20260725-A27",
    "relationship edge 16 references non-active Card SIG-20260725-A24",
    "relationship edge 17 references non-active Card SIG-20260725-A20",
    "relationship edge 18 references non-active Card SIG-20260725-A21",
    "relationship edge 19 references non-active Card SIG-20260725-A18",
    "relationship edge 20 references non-active Card SIG-20260725-A12",
    "relationship edge 21 references non-active Card SIG-20260725-A23",
    "relationship edge 22 references non-active Card SIG-20260725-A19",
    "relationship edge 23 references non-active Card SIG-20260725-A04",
    "relationship edge 24 references non-active Card SIG-20260725-A02",
    "relationship edge 25 references non-active Card SIG-20260725-A17",
    "relationship edge 26 references non-active Card SIG-20260725-A03"
  ]
}
```

### Frontstage regression gate

- status: failed
- script: agent-workflow/tools/frontstage-regression-gate.mjs
- exit_code: 1

```text
{
  "ok": false,
  "status": "failed",
  "issue_count": 1,
  "report": "agent-workflow/reports/frontstage-regression-gate-20260726015151.md"
}
```
