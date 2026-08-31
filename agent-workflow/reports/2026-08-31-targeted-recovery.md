# 2026-08-31 Targeted Business-Signal Recovery

- source_run: 33350493823
- source_artifact: wavesight-business-signals-pr-2026-08-31
- original_failure: projection coverage (two events without entities; Huawei Cloud missing from the reviewed company index)
- recovery: accepted artifact reused; no recollection and no additional model calls
- integrity: 237 RawDocuments, 65 Claims, 23 canonical events; all original IDs and exact Claim quotes/spans preserved
- publication_candidates: 21 accepted events; entity and reviewed organization/product index coverage 100%
- funding: generator succeeded with zero eligible new funding events; zero new cards; 282 existing public cards retained, checked through 2026-08-31
- private_evidence: remote parity, backup integrity and public-boundary gates passed; no complete originals added to the public repository

## Source-bound corrections

1. EV-b1236dadc85894e4: link Caterpillar from the exact title and accepted Claims; add an explicit organization review. The generic parser now recognizes Claim-backed English organizations before localized action verbs, retaining unverified candidates until review.
2. EV-a0bc74f4892dcfad: link 巴克莱 from CL-ce32c0d87ca4174d and review the organization. Correct product_release to research_result, with action 发布研究报告; update the three existing Claims' classification metadata without modifying their IDs, quotes or spans. Add a report-specific parser rule with positive and negative regression fixtures.
3. Merge the Claim-backed Huawei Cloud alias into 华为云 and explicitly confirm the target organization from CL-e7887641a4e292a5. No legal ownership inference was added.

## Validation

- Data Center normalization tests: 139 passed.
- Daily integrity and exact source-title gates: passed.
- Reviewed entity catalog: passed.
- Projection coverage: passed, no failures. The zero-new-hardware warning is retained.
- Funding history and frontstage gates: passed (307 application cards across history, 282 public cards).
- Production-chain pre-commit gate: passed; zero stale downstream assets.

## Other monitoring lanes and publication boundary

Community collection recovered after restarting its dedicated browser and retrying the transient connection failure: 68 items, merged PR #758. First-line viewpoints published independently. Runtime self-check dashboard output isolation was fixed in PR #759 with regression tests, preserving the tracked release dashboard and the user's local documentation commit. The 16:10 and 16:45 scheduled tasks are not yet due and are not marked complete. This report does not claim that deployment or browser visual QA has completed; their evidence is recorded in the local closeout after publication.
