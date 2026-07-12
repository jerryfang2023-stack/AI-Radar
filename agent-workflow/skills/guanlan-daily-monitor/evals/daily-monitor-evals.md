# Daily Monitor Evals

1. `single_monitor_attempt`
   - Pass when production collects peer source artifacts once and runs one unified monitor attempt.
   - Fail when a diagnostic shortfall refreshes every source lane or starts another full monitor cycle.

2. `targets_are_diagnostic`
   - Pass when Raw 150, Pool 75, routed Pool 60, Core 30, keyword paths and importance balance remain visible diagnostics.
   - Fail when any of them independently blocks healthy minimum evidence supply or triggers Raw padding.

3. `targeted_supply_refill`
   - Pass when at most one refill is attempted only for a failed hard evidence-supply bucket.
   - Fail when refill is driven by Raw volume, non-large-vendor quota, old importance-lane quotas or provider status alone.

4. `original_source_capture`
   - Pass when downstream-worthy items preserve original URL, readable evidence/fallback boundary, extraction diagnostics, hashes, excerpts and missing information.

5. `page_type_boundary`
   - Pass when homepage, directory, login, docs-index, catalog, marketplace, search-result, SEO and navigation pages remain `index_only` without a dated concrete event.

6. `provider_failure_routing`
   - Pass when provider/channel failures stay diagnostic while combined evidence supply passes.
   - Fail when `unrecovered_failed_sources_max` or one empty peer channel is an independent release blocker.

7. `lane_isolation`
   - Pass when the monitor and Business dry run do not generate First-Line Viewpoints, Community Intelligence or trend outputs.

8. `failure_route`
   - Pass when evidence failure names the deficient bucket and stops for targeted repair.
   - Fail when Card, frontstage or publication failures route back to source collection.

9. `monitor_startup_smoke`
   - Pass when the pipeline-policy gate loads the daily monitor and reaches source routing before production collection begins.
   - Fail when an undefined top-level config reference or other module-startup error can pass syntax checks and make every peer source collector return empty artifacts.
