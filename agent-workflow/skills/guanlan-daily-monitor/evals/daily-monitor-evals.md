# Daily Monitor Evals

1. `single_monitor_attempt`
   - Pass when production collects peer sources once and runs one unified monitor attempt.

2. `structured_intake_output`
   - Pass when the monitor writes immutable snapshots and `SOURCE-INTAKE-V1`.
   - Fail when it writes daily Raw/Pool candidate Markdown, Signal Cards, V3 Desk, graph, or mappings.

3. `targets_are_diagnostic`
   - Pass when volume, route mix, provider, and concentration targets stay diagnostic unless the configured minimum evidence supply fails.

4. `targeted_supply_refill`
   - Pass when at most one refill addresses a failed hard evidence bucket using already collected candidates.

5. `original_source_capture`
   - Pass when every downstream-worthy item preserves URL, readable evidence boundary, extraction diagnostics, hash, excerpt, and missing fields.

6. `page_type_boundary`
   - Pass when homepages, directories, login pages, indexes, marketplaces, search results, and SEO pages remain discovery-only without a dated event.

7. `provider_failure_routing`
   - Pass when one provider failure stays diagnostic while combined evidence supply is healthy.

8. `namespace_isolation`
   - Pass when the monitor does not write First-Line Viewpoints, Community Intelligence, canonical facts, application judgments, or OPS evidence.

9. `downstream_failure_route`
   - Pass when Claim/Event, application, frontstage, PR, Pages, or sync failures do not route back to source recollection.

10. `same_date_idempotency`
    - Pass when a same-date rerun preserves valid immutable snapshots and stable structured references without relying on V3 Cards.

11. `adaptive_dedupe_expansion`
    - Pass when post-fetch hash dedupe may consume additional balanced candidates from the same attempt but cannot recollect providers or pad weak evidence.

12. `fact_type_gap_visibility`
    - Pass when source-coverage gaps stay visible without fabricating same-day facts or lowering the V4 integrity gate.
