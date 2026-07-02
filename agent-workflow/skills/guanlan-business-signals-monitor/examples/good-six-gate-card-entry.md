# Good Six-Gate Card Entry

Use this example when repairing Business Signals raw-to-card promotion.

## Good Shape

```json
{
  "pool_ref": "P-042",
  "issues": [
    "source_auditability:discovery_source_not_resolved",
    "evidence_quality:missing_full_text",
    "valid_page_type:index_or_directory_url"
  ],
  "repair_suggestion": "Resolve to a dated original event page, then recapture full text, excerpts, hash, and extraction method before promoting."
}
```

## Pass Criteria

- The policy layer uses the six gates: `source_auditability`, `evidence_quality`, `business_signal_scope`, `valid_page_type`, `commercial_importance`, and `fact_type_constraints`.
- Field-level details remain as diagnostics after the gate prefix.
- The repair action targets the earliest broken stage, usually Raw recapture or Pool rerouting.
- No gate is weakened just to fill the public Card count.

## Bad Pattern

```json
{
  "issues": [
    "missing_full_text",
    "missing_source_url",
    "weak_extraction_quality",
    "incomplete_evidence_object"
  ],
  "repair_suggestion": "Lower the full text requirement for today's cards."
}
```

This fails because it exposes scattered field checks as policy and weakens the source-first gate instead of repairing evidence capture.
