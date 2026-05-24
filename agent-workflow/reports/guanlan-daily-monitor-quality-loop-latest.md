# Guanlan Daily Monitor Quality Loop

- date: 2026-05-24
- status: passed_with_notes
- final_status: passed_with_notes
- final_downstream_decision: allow_with_degradation
- final_quality_score: 88.65
- pass_score_threshold: 80

## Cycle 1

- mode: wrapper execution
- status: timed_out
- note: `run-guanlan-daily-monitor-with-qc.mjs` exceeded the execution window before Raw / Pool files were written. The orphan monitor processes were stopped before rerun.
- output_state: only an interim failed quality-gate report existed, with Raw 0 and Pool 0.

## Cycle 2

- mode: direct monitor execution + standalone quality gate + manual QC
- monitor_status: collected
- raw_count: 80
- pool_count: 40
- opinion_candidate_count: 25
- core_pool_count: 25
- routed_pool_count: 28
- keyword_search_non_community_count: 38
- quality_status: passed
- quality_score: 88.65
- downstream_recommendation: allow_with_degradation
- report: agent-workflow/reports/2026-05-24-guanlan-monitor-quality-gate.md
- qc_report: agent-workflow/reports/2026-05-24-guanlan-daily-monitor-qc.md

## Notes

- Hard gates all passed after the direct monitor rerun.
- Downstream use is allowed only with the degradation notes from the QC report.
- Main residual risks: 3 failed source records and a mature-commercial-signal concentration warning at 61.3%.
