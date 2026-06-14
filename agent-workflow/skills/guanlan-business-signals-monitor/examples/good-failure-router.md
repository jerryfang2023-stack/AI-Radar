# Good Business Signals Failure Router Example

Use this when Business Signals has not cleanly published by the morning handoff window.

## Correct Behavior

1. Check same-date run state and same-date public assets:
   - activeDate;
   - public `top10` length;
   - Signal Card count;
   - latest manifest and quality gate path.
2. Classify the failure before rerunning:
   - `supervision_observability`: report or GitHub lookup missing, but assets may be healthy;
   - `no_run_or_stale_assets`: no same-date run or activeDate is stale;
   - `raw_volume_shortfall`: Raw count below hard floor;
   - `pool_mix_shortfall`: funding / case / product / vertical coverage gap;
   - `core_supply_shortfall`: Core Pool or non-large Core Pool too thin;
   - `top10_contract`: public Top10 missing or not exactly 10;
   - `translation_title`: untranslated or placeholder public title;
   - `large_company_cap`: Top10 exceeds large-company cap;
   - `publication`: assets pass but PR/merge/Pages failed.
3. Repair the earliest category:
   - for supply failures, run targeted source refill;
   - for Top10 contract failures, fix the build/gate contract;
   - for translation/title failures, normalize source-derived titles;
   - for large-company cap failures, enforce cap before Top10 selection and refill from non-large Core Pool;
   - for publication failures, repair PR/merge/Pages only.
4. Rerun the exact failed gate or the smallest validation.
5. Record validation and prevention before closing Hermes.

## Incorrect Behavior

- Launching repeated full-chain reruns for the same category.
- Treating GitHub lookup timeout as proof that data generation failed.
- Waiting until dashboard, topic-center, or Pages work to discover Top10 shortage.
- Relaxing large-company caps to solve weekend low supply.
- Filling Business Signal Cards from builders viewpoints, community posts, social feedback, repo roots, package pages, marketplace pages, or generic lists.
