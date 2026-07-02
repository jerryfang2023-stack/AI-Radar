# Monitor Quality Gate Evals

Run these pass/fail checks when editing or using the WaveSight AI monitor quality pre-gate.

## Required Checks

1. `pre_gate_not_final_qc`
   - Pass when outputs state that script success is only `script_pre_gate=passed` and downstream remains `pending_qc` until `guanlan-daily-monitor-qc` returns `allow` or scoped `allow_with_degradation`.

2. `v3_quantity_thresholds`
   - Pass when automated reports check at least 150 active Raw candidates, at least 75 Pool items, at least 60 routed Pool items, and raw-to-card Card supply.

3. `bounded_retry`
   - Pass when failed script thresholds trigger at most 3 bounded refetch cycles before `manual_intervention_required=true`.

4. `source_path_logging`
   - Pass when the handoff includes Raw count by source type, keyword path distribution, failed sources, fallback used, and evidence gaps.

5. `source_labels_traceability_only`
   - Pass when `source_level` and `acquisition_source_level`, if present in backend Raw / Pool data, are traceability-only diagnostics and are not used as hard gates, ranking boosts, ranking penalties, quality scores, or automatic downgrade reasons.

6. `semantic_gap_escalation`
   - Pass when suspicious homepage, directory, search-result, marketplace, or generic tool pages are handed to `guanlan-daily-monitor-qc` instead of being auto-approved.

7. `current_downstream_language`
   - Pass when blocked or pending status mentions Signal Cards, relationship graph inputs, trend candidates, and Business Signals frontstage data, not retired daily observations, trend reports, briefs, publiccopy, or cardcopy gates.

8. `pool_core_release_diagnostics`
   - Pass when Raw count, failed source-channel count, keyword-only floor, AI-relevant title ratio, and off-topic raw-title diagnostics remain visible but do not block release after Pool audit supply and downstream Card supply are sufficient.
   - Fail when a provider quota note, one empty peer channel, or a Raw-title diagnostic causes a full monitor rerun while Pool audit supply and Card supply are already healthy.

## Repair Loop

When a check fails, repair the script, configuration, scorecard, or handoff wording. Do not patch reports by hand to make thresholds pass.
