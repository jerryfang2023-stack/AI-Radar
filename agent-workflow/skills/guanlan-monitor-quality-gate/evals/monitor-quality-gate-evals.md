# Monitor Quality Gate Evals

Run these pass/fail checks when editing or using the WaveSight AI monitor quality pre-gate.

## Required Checks

1. `pre_gate_not_final_qc`
   - Pass when outputs state that script success is only `script_pre_gate=passed` and downstream remains `pending_qc` until `guanlan-daily-monitor-qc` returns `allow` or scoped `allow_with_degradation`.

2. `v3_quantity_thresholds`
   - Pass when automated reports check at least 150 active Raw candidates, at least 75 Pool items, at least 60 routed Pool items, and at least 30 usable `core_pool` items.

3. `bounded_retry`
   - Pass when failed script thresholds trigger at most 3 bounded refetch cycles before `manual_intervention_required=true`.

4. `source_path_logging`
   - Pass when the handoff includes source distribution, source level distribution, Raw count by source type, keyword path distribution, failed sources, fallback used, and evidence gaps.

5. `discovery_not_fact_source`
   - Pass when M-level acquisition channels are not counted as fact source levels.

6. `semantic_gap_escalation`
   - Pass when suspicious homepage, directory, search-result, marketplace, or generic tool pages are handed to `guanlan-daily-monitor-qc` instead of being auto-approved.

7. `current_downstream_language`
   - Pass when blocked or pending status mentions Signal Cards, relationship graph inputs, trend candidates, and Business Signals frontstage data, not retired daily observations, trend reports, briefs, publiccopy, or cardcopy gates.

## Repair Loop

When a check fails, repair the script, configuration, scorecard, or handoff wording. Do not patch reports by hand to make thresholds pass.
