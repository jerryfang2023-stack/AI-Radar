# 2026-07-13 Business Signals Targeted Repair

- status: passed
- repair_stage: Pool/Card recall audit -> Card editorial quality -> frontstage publication
- source_artifact_run: https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/29222023914
- code_repairs: PR #266, PR #267
- raw_count: 154
- pool_count: 98
- routed_pool_count: 65
- core_pool_count: 22
- public_card_count: 10
- active_date: 2026-07-13

## Repaired Defects

- Restored confirmed product launches suppressed by stale `important_technical_trend` routing labels.
- Preserved Microsoft Research as a usable organization subject for the Flint launch.
- Kept career advice, market commentary, consumer AI games, minor image-policy stories, and guide/tutorial articles out of formal Cards.
- Prioritized funding queries in the capital/startup path and added the production month as a recency hint.
- Removed the redundant `fact_translation_zh` precondition when Card ingestion can normalize source-backed Chinese facts from captured original excerpts.
- Added a recall-accountability gate: confirmed formal events with only repairable source/date/material/translation gaps now stop editorial release instead of silently disappearing.
- Fixed article-page classification so navigation words such as `消息中心` / `工单` cannot turn a dated event article into a homepage/directory observation.
- Downgraded temporary usage-window resets and old podcast episodes so they do not become false high-priority Card recall blockers.

## Active Cards

1. Taskade launches the TSK-1 system kernel.
2. Microsoft Research and Renmin University release Flint.
3. Swancor Advanced Materials launches Qiyuan T1.
4. XPENG announces the MONA L03 global launch with physical-AI / VLA capabilities.
5. Meta releases Muse Spark 1.1.
6. DPVR launches VisionRay Flow Pro AI glasses.
7. Tencent Hunyuan officially releases Hy3 and opens its TokenHub API.
8. Nubia schedules iMoochi retail availability.
9. Stigg launches its 2.0 usage runtime for AI products.
10. Ploy migrates its production AI agent from Claude Opus 4.8 to GPT-5.6 Sol.

## Quality And Coverage Notes

- Pool 98 is an audit denominator, not 98 expected Cards: the original artifact contained 35 index-only entries and only 20 Core labels; Core itself included opinions, newsletters and directory pages.
- Before repair, 50 rejected candidates carried `missing_chinese_fact_translation`, but only Taskade and Stigg were fresh formal events blocked solely by that condition. They now generate qualified Cards.
- XPENG was omitted because a valid IT Home event article was misclassified from page-navigation text. Tencent Hy3 was a real high-quality omission whose first capture was only an unsupported social summary; it was recaptured from Tencent's official release and unsupported claims were removed.
- The executable evidence gate passed; no duplicate groups, unexplained recall failures or editorial-quality problems remain.
- Funding and customer-case coverage remain thin. The monitor reported `important_funding=3/5` and `important_case=1/5` at Pool level, and no funding/case item passed all Card gates for the active date.
- External omission review also found recent financing events absent from the archive, including Tripo AI's $150M Series A3 and ARC Intelligence's EUR 4M seed round. These remain source-recall gaps and were not forced into Cards without original-source ingestion.

## Validation

- `node agent-workflow/tools/assert-pool-to-card-dedupe.mjs --date=2026-07-13`
- `node agent-workflow/tools/assert-signal-card-editorial-quality.mjs --date=2026-07-13`
- `npm run assert:business-frontstage -- --date=2026-07-13`
- `node agent-workflow/tools/assert-daily-production-chain.mjs --date=2026-07-13 --stage=pre-commit --raw-min=120 --pool-min=75 --block-stale=true`
- `node agent-workflow/tools/assert-v3-source-first-frontstage.mjs --date=2026-07-13`
- `node agent-workflow/tools/frontstage-regression-gate.mjs --date=2026-07-13`

## Prevention

- Real production examples are covered by the 2026-07-12 core-recall fixture.
- Capital/startup query priority and recency are covered by `query-selection-regression-fixtures`.
- Article/navigation misclassification is covered by `evidence-object-regression-fixtures`.
- High-priority repairable omissions are now enforced by `assert-signal-card-editorial-quality.mjs`.
