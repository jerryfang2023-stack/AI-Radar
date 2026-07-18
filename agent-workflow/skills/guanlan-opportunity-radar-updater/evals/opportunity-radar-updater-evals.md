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
   - Pass when `opportunity-map.html` owns both matrices under OMAP metadata and Reports Center owns no opportunity matrices.
   - Fail when OMAP content returns to Industry Reports, or Relation Paths, Signal Candidates, 时间聚集, or Tag 聚合 returns on either page.
7. `standalone_map_presentation`
   - Pass when Entry Point Map and Product Pain Map render as separate full-width sections with Chinese and English subcolumn names.
   - Fail when the maps are squeezed behind toggle buttons or merged into a single "切入点地图 / 痛点地图" heading.

8. `evidence_modal_presentation`
   - Pass when clicking a hot map cell opens related Card evidence in a modal or equivalent detail layer.
   - Fail when a persistent right-side "Cell Evidence" instruction panel returns or when map evidence is shown as internal diagnostic text.

9. `consolidated_schedule_ownership`
   - Pass when the opportunity refresh runs inside the Monday 10:30 weekly report controller before report generation.
   - Fail when a separate opportunity-map scheduled task is introduced or the report reads a pre-refresh projection.

10. `independent_column_version`
   - Pass when Opportunity Map emits `OMAP-V1.0.0-independent-column` and report pages emit only `REPORTS-V1.0.0-periodic-report-center`.
   - Fail when shared IMAP metadata returns or either application emits the other's column version.
