# Bad Old Thresholds Example

```yaml
date: 2026-06-12
raw_target: 120
pool_target: 30
core_pool_target: 12
status: complete
handoff: direct_card_generation
```

Why it fails: old Raw 80-150 / Pool 20-40 thinking is not current V3.3.5 production truth, and the monitor must not skip QC before downstream use.
