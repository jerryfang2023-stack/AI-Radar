# Good Evidence-Supply Block Example

```yaml
evidence_supply_gate: failed
diagnostic_score: 82
hard_failed:
  - routed_pool_count_min
  - usable_core_evidence_min
provider_diagnostics:
  - rss_http_415
action: repair_the_missing_original_evidence_bucket
monitor_rerun: false
```

Why it passes: the report names the actual missing evidence supply, keeps provider details diagnostic, and stops for targeted repair instead of starting another full monitor cycle.
