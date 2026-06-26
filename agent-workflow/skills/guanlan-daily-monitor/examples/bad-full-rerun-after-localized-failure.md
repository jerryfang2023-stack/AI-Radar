# Bad Full Rerun After Localized Failure Example

```yaml
date: 2026-06-26
symptom: raw_count_min failed
available_artifacts:
  aihot_raw_candidate_count: 190
  keyword_raw_candidate_count: 53
  gdelt_raw_candidate_count: 6
  rss_raw_candidate_count: 190
final_raw_count_by_channel:
  aihot: 64
  keyword-search: 46
  gdelt: 5
  rss-feed: 0
wrong_repair:
  - rerun full Business Signals workflow
  - recollect all source channels repeatedly
correct_repair:
  - inspect source artifacts before rerun
  - identify rss-feed selector omission
  - patch aggregation / selector logic
  - rerun only downstream monitor or gate using existing source artifacts
```

Why it fails: source collection had already produced enough RSS candidates, so repeated full workflow runs wasted time and provider quota. The issue was downstream selection: `rss-feed` was missing from the Raw priority pass. Repair the selector and validate with existing artifacts before triggering a full workflow.
