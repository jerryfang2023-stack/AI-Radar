# Opportunity Radar Updater Evals

1. `source_near_fields`
   - Pass when map cells are derived from `opportunity_signals` fields backed by source excerpts or Card facts.
   - Fail when cells are driven by old `formal_tags`, broad topic labels, or generated phrases.

2. `entry_point_specificity`
   - Pass when the Entry Point Map expresses buyer/team x concrete task.
   - Fail when it uses broad labels such as "AI Agent", "enterprise workflow", "productivity", or "AI transformation" as the main cell meaning.

3. `product_pain_specificity`
   - Pass when the Product Pain Map expresses pain/constraint x product form or delivery model.
   - Fail when it uses vague pairings such as "AI adoption x solution" or "enterprise AI x SaaS".

4. `weekly_cadence`
   - Pass when the update uses a 7-day current window, a 30-day baseline, and 90-day context only when needed.
   - Fail when a daily refresh rewrites the map interpretation from single-day noise.

5. `evidence_boundary`
   - Pass when First-Line Viewpoints and Community Intelligence are excluded from direct map evidence unless promoted through Raw / Pool / Card.
   - Fail when community demand posts or opinions directly heat a public cell.

6. `frontstage_integrity`
   - Pass when the Intelligence Map keeps only the two opportunity panels and the relationship graph, without restoring Signal Candidates, 时间聚集, or Tag 聚合.
   - Fail when removed modules return.
