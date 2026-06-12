# Bad Count-Only Pass Example

```yaml
script_pre_gate: passed
score: 88
raw_count: 160
pool_count: 80
core_pool_count: 35
ignored_risks:
  - discovery_only_sources_promoted
  - homepage_pages_in_core_pool
downstream_status: allowed
```

Why it fails: counts alone cannot override weak source quality, discovery-only facts, or homepage/index evidence.
