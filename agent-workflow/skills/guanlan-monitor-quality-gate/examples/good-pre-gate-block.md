# Good Pre-Gate Block Example

```yaml
script_pre_gate: failed
score: 76
failed_thresholds:
  - core_pool_below_floor
  - missing_keyword_path_diversity
  - weak_non_community_evidence
action: rerun_with_bounded_refetch
downstream_status: blocked_pending_qc
```

Why it passes: the pre-gate blocks weak monitor output and routes repair before the Markdown QC and downstream Card chain.
