# Good Business Signals Failure Router Example

Use this when Business Signals has not cleanly published by the morning handoff window.

## Correct Behavior

1. Check same-date run state and same-date public assets:
   - activeDate;
   - public Card count;
   - Signal Card file count;
   - latest manifest and quality gate path.
2. Classify the failure before rerunning:
   - `supervision_observability`: report or GitHub lookup missing, but assets may be healthy;
   - `no_run_or_stale_assets`: no same-date run or activeDate is stale;
   - `raw_volume_shortfall`: Raw count below hard floor and downstream Card supply is insufficient;
   - `pool_mix_shortfall`: funding / case / product coverage gap;
   - `card_supply_shortfall`: cardable Raw / Pool supply or generated Card supply too thin;
   - `frontstage_card_contract`: public Cards missing, stale, unsorted, or leaking backend fields;
   - `translation_title`: untranslated or placeholder public title;
   - `publication`: assets pass but PR/merge/Pages failed.
3. Run the pre-rerun checklist before any full-chain repair:
   - compare local branch with `origin/main` so stale local checkout is not mistaken for missing data;
   - inspect active Raw, Pool, routed Pool, cardable candidate count, and large-company concentration;
   - identify the deficient source/channel or downstream eligibility bucket before calling it a Raw shortage;
   - check source-artifact retry freshness;
   - list missing source-title translations when active-date Cards exist but public Cards are empty;
   - separate PR / Pages / manifest / local Obsidian sync warnings from Business data health.
4. Repair the earliest category:
   - for supply failures, run targeted source refill;
   - for frontstage Card contract failures, fix the build/gate contract;
   - for translation/title failures, repair source-title translations or the upstream translation sync, then rebuild the frontstage JSON only;
   - for publication failures, repair PR/merge/Pages only.
5. Rerun the exact failed gate or the smallest validation.
6. Record validation, final commit or PR, and prevention before closing Hermes.

## Incorrect Behavior

- Launching repeated full-chain reruns for the same category.
- Reporting "raw insufficient" without identifying the deficient channel, source-artifact, or eligibility bucket.
- Treating GitHub lookup timeout as proof that data generation failed.
- Treating missing source-title translations as a reason to recollect Raw / Pool.
- Treating skipped Pages, red workflow, missing manifest, or dirty local Obsidian sync as Business data failure after public Cards and gates pass.
- Waiting until dashboard or Pages work to discover public Card shortage.
- Filling Business Signal Cards from builders viewpoints, community posts, social feedback, repo roots, package pages, marketplace pages, or generic lists.
