# 2026-09-24 production recovery

## Accepted input and ownership

- Reused Business Signals artifact `wavesight-business-signals-pr-2026-09-24`, run 35937315151. Collection, intake quality and private archival passed; required source-title translation failed. No recollection.
- Reconciled domestic intake/card checkpoints from PR #992, commit `7c0e7099486dde7e7788f38f9d8e8a5e088e2440`, and RSS from PR #990, commit `5ff8b388e7f660a41ffc6bce517adec0bc49e377`. Both exact-head Windows/Linux checks passed after reviewed approval. Shared projections were rebuilt, not overwritten with stale branch output.
- Community PR #991 already merged. Afternoon and Final Closure tasks are not yet due at morning inspection.
- Unified input: 350 RawDocuments (264 general, 86 domestic), 314 eligible; 54 events, 140 Claims, three FDE records and five hardware facts. No event-backed hardware record. Stable IDs and collection batches retained.
- Funding generation reused five cards, generated two, deduplicated four; zero blocked/pending. Public aggregation is 439 cards, including 173 China-market cards. Seven accepted source cards represent five net-new public company/round groups.

## Targeted repairs and prevention

1. Meta Muse's source title uses `a week`, correctly translated as `一周`. The numeric comparator treated Chinese one as an extra number because it recognized English `one` but not duration-bound `a/an`. Added a failing regression, normalized singular durations, and verified changed counts/durations remain rejected. Re-ran only required title repair and downstream factual/application builds; original source intake remains unchanged.
2. The September 23 scheduled Final Closure failed solely because supervision returned exit zero without writing a fresh report. Its remaining string-based CLI entry guard mishandled the C→D junction. Changed the actual writer to `isMainModule` and added an actual junction-invoked CLI regression requiring a dated receipt; red before, green after.
3. Plugin inventory snapshots lagged installed plugin versions. Refreshed external runtime inventory, not production source rules; all 24 governed skills validate and runtime Skill Ops passes.

## Validation and release boundary

- 291 factual tests, 54 runtime/community tests, 236 prepared frontstage tests passed.
- Source-title gate: 125 dates, zero violations. Current factual and projection coverage gates passed. Public/private boundary and remote evidence parity passed.
- Funding full-bundle, taxonomy/institution, frontstage regression and pre-commit readiness gates passed.
- Full evidence inventory, final CI, merge, Pages, VPS/Mini parity and workspace receipts are recorded in external `runtime/daily-recovery-20260924` after completion. Repository artifacts alone do not certify deployment.
- Original failed cloud receipts remain preserved in the downloaded artifact. The dated persistent-asset manifest now identifies the operator recovery and original run, without claiming the failed cloud execution succeeded.
