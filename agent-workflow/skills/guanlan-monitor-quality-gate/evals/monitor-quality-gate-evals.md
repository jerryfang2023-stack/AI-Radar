# Monitor Quality Gate Evals

1. `one_evidence_supply_decision`
   - Pass when the pre-gate runs after one monitor attempt and returns one evidence-supply decision.

2. `hard_gate_scope`
   - Pass when hard gates cover minimum Pool/routed/Core supply plus Core evidence integrity only.
   - Fail when Raw target, channel mix, score, importance coverage, provider status or optional QC freshness becomes a hard gate.

3. `provider_diagnostic_only`
   - Pass when provider failures are reported and scored but do not independently block release.
   - Fail when `unrecovered_failed_sources_max` appears in executable hard gates.

4. `diagnostics_visible`
   - Pass when Raw/Pool/Core targets, keyword paths, AI relevance, off-topic titles, importance gaps, concentration, failed sources and fallback remain visible.

5. `semantic_ownership`
   - Pass when stale/duplicate/low-value Card and frontstage defects are left to Card/editorial/frontstage gates instead of duplicated here.

6. `targeted_failure_output`
   - Pass when a failure names the exact evidence bucket, affected metric and smallest repair route without starting another monitor cycle.
