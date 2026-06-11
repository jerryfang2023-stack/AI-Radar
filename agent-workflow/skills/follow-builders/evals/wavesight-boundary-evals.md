# WaveSight Boundary Evals

Run these pass/fail checks when using `follow-builders` inside WaveSight AI / Guanlan work.

## Required Checks

1. `viewpoints_only`
   - Pass when outputs are routed to the independent First-Line Viewpoints column or digest flow, not Business Signals.

2. `not_fact_source`
   - Pass when builder posts, podcasts, and summaries are not used as business-signal facts, relationship graph evidence, trend-candidate evidence, or Signal Card source material.

3. `original_source_required`
   - Pass when any factual business claim discovered through a builder viewpoint is traced to a separate original source captured by the Raw / Pool chain before downstream use.

4. `chinese_frontstage_ready`
   - Pass when WaveSight frontstage viewpoint data has complete Chinese primary text, original URLs, author identity, timestamp, and translation status before release.

## Repair Loop

When a check fails, keep the item in viewpoints only or recapture the original business source through the Raw / Pool workflow. Do not promote commentary into business-signal evidence.
