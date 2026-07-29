# WaveSight Boundary Evals

Run these pass/fail checks when using `follow-builders` inside WaveSight AI / Guanlan work.

## Required Checks

1. `viewpoints_only`
   - Pass when outputs are routed to the independent First-Line Viewpoints column or digest flow, not Business Signals.

2. `not_fact_source`
   - Pass when builder posts, podcasts, and summaries do not create Claims, CanonicalEvents, or RELATION-V2.1 evidence.

3. `original_source_required`
   - Pass when any factual business claim discovered through a builder viewpoint is traced to a separately captured original source and accepted through the V4 Claim/Event chain before downstream use.

4. `chinese_frontstage_ready`
   - Pass when WaveSight frontstage viewpoint data has complete Chinese primary text, original URLs, author identity, timestamp, and translation status before release.

## Repair Loop

When a check fails, keep the item in viewpoints only or recapture the original business source through the V4 source-intake and integrity workflow. Do not promote commentary into factual evidence.
