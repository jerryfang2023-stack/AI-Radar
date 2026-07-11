# Business Signals Pipeline Audit — 2026-07-11

## Conclusion

The recurring failures were caused primarily by workflow and rule architecture, not by a persistent inability to collect enough useful news.

The old path mixed four different states into one red workflow:

```text
source/evidence supply
-> Card generation and editorial quality
-> frontstage contract
-> PR / merge / Pages publication
```

It also rechecked the same monitor report through multiple gates, retried the complete monitor up to three times, and treated publication conflicts as monitoring failures. Manual reruns then reproduced the same source work instead of repairing the owning stage.

## 30-Day Evidence

GitHub Actions history for `daily-persistent-assets-pr.yml`, 2026-06-12 through 2026-07-11:

- total runs: 156;
- failures: 91;
- successes: 46;
- cancelled: 19;
- manual-dispatch failures: 82;
- scheduled failures: 9.

For 2026-07-05 through 2026-07-11 there were 17 runs: 7 failures and 10 successes. Five failures came from manual dispatches after an earlier attempt.

The 30-day health report records 18 Business Signals `monitor_or_gate_failure` incidents and 14 retired `business_signals_top10_missing` incidents. This proves that historical failure categories survived after the public Top10 contract was removed.

## Confirmed Failure Patterns

### 1. Retired diagnostics became hard blockers

Representative runs on 2026-06-30 through 2026-07-02 retried three times for combinations of:

- `raw_count_min`;
- `core_pool_min` / `usable_core_evidence_min`;
- non-large-vendor and importance-lane quotas;
- `unrecovered_failed_sources_max`.

Later rule updates correctly made these diagnostic after healthy downstream supply, but current skills, evals, examples and retry code still prescribed the old model.

### 2. Collection was duplicated inside one workflow

The workflow first collected `aihot`, `keyword`, `gdelt`, and `rss` source artifacts. The unified monitor then recollected keyword/GDELT/RSS when Raw was below 150 or an importance lane was thin. It could additionally run three Pool/Core refills, two Raw-volume refills, and three outer monitor cycles.

This inflated runtime and provider usage and encouraged low-value padding.

### 3. The earliest failure was hidden

`Run Daily Monitor with QC`, readiness, post-monitor, generation, dedupe, frontstage and freshness steps used `continue-on-error`. The final result usually reported `Commit business signals did not pass: skipped`, which is a consequence rather than the root cause.

The separate readiness step and the Card generator both parsed the same monitor reports again, so one state could be interpreted three times.

### 4. Card defects were detected late

On 2026-07-09 the monitor passed, but Pool-to-Card dedupe later found four cards sharing one FT URL and a stale source. On 2026-07-11 the monitor and dedupe passed, but the frontstage gate failed on title translation/editorial defects. Those are Card-stage failures and should never route back to source recollection.

### 5. Publication failure was mislabeled as monitoring failure

On 2026-07-11 all data and quality gates passed, the automation branch and PR existed, and the run failed only because auto-merge was unavailable and immediate merge found conflicts. The final workflow marked the whole Business Signals run failed, enabling another full-chain dispatch.

## Refactored Policy

1. One source-artifact collection and one unified monitor attempt.
2. No refill solely for Raw 150, channel count, importance mix or provider state.
3. At most one targeted refill only when the configured hard evidence-supply minimum fails.
4. Provider failures are diagnostics, not an independent hard gate.
5. The duplicate readiness gate is removed; the workflow uses the evidence-supply gate once before Card generation.
6. Card generation is followed by dedupe and release-blocking editorial quality before frontstage publication.
7. Business dry run contains only the Business Signals lane.
8. PR conflict or open automation branch is `publication_waiting`; health dispatch must not recollect sources.
9. Existing same-date files may skip only when current evidence, Card/editorial and frontstage gates pass—not merely because files exist.

## Prevention

`assert-business-signals-pipeline-policy.mjs` blocks reintroduction of:

- three-cycle monitor retries;
- Raw-volume refill;
- duplicate readiness gates;
- provider failure as a hard gate;
- cross-column work in the Business dry run;
- publication conflicts routed as monitor failures;
- stale skill/eval wording that requires the retired QC model.
