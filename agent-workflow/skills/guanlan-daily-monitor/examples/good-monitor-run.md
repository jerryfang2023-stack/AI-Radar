# Good Monitor Run Example

```yaml
date: 2026-06-12
raw_active_candidates: 158
pool_items: 82
routed_pool_items: 68
usable_core_pool_items: 34
parameters:
  diagnostic_score_reference: 85
  search_limit: 200
  search_path_query_limit: 5
  gdelt_query_limit: 12
  hn_limit: 8
  pool_selection_buffer: 20
source_capture:
  original_urls_present: true
  full_text_or_fallback_logged: true
  source_snapshots_saved: true
monitor_log:
  source_distribution: present
  failed_sources: present
  fallback_used: present
  evidence_gaps: present
handoff:
  next_gate: guanlan-monitor-quality-gate
```

Why it passes: the run captures original evidence, meets current quantity floors, keeps HN as feedback-only discovery, leaves Pool selection buffer for routed/core evidence, and hands off to the quality gates without staging downstream Cards.
