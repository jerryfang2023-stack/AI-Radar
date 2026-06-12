# Good Trend Candidate Example

Use this pattern when a lightweight trend candidate is justified.

```yaml
---
id: TRC-20260612-01
type: trend_candidate
date: 2026-06-12
status: draft
trend_evidence_gate: threshold_pending
related_signal_cards:
  - BS-20260610-03
  - BS-20260611-07
  - BS-20260612-02
source_types:
  - product_release
  - customer_case
  - pricing_or_procurement_signal
commercial_variable: workflow_budget_shift
boundary_notes: "The pattern is visible across multiple signals, but adoption scale is not yet proven."
missing_information:
  - "Independent customer count"
  - "Budget owner or procurement path"
next_observation: "Watch whether more vertical teams buy the same workflow, not just test it."
---
```

Pass criteria:

- At least 2-3 related source-backed business signals.
- At least 2 source types or evidence contexts.
- A concrete commercial variable is named.
- Boundary and missing-information fields stay explicit.
