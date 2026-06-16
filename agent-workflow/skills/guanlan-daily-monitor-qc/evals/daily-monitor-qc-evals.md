# Daily Monitor QC Evals

Run these pass/fail checks when auditing a WaveSight AI current V3 daily monitor run or editing this skill.

Do not use numeric self-scores without observable evidence. Each check must be `pass` or `fail` and cite the file, field, or report section that proves it.

## Required Checks

1. `v3_context_loaded`
   - Pass when the audit uses `context/07-v3-intelligence-generation-rules.md` and `context/05-daily-monitoring.md` as the current rule source.

2. `raw_pool_quantity_gate`
   - Pass when the report checks at least 150 active Raw candidates, at least 75 Pool items, at least 60 routed Pool items, and at least 30 usable `core_pool` items unless the run is explicitly blocked.

3. `source_integrity_gate`
   - Pass when every downstream-worthy item has original URL, source level, acquisition channel, full-text status, extraction quality, content hash, and missing-information notes where applicable.

4. `discovery_channel_separation`
   - Pass when AI HOT, follow-builders, HN, X, Reddit, RSS, and search aggregation text are treated as discovery only unless the original source was captured.

5. `index_page_downgrade`
   - Pass when homepage, directory, login, docs index, product catalog, marketplace, SEO, and search-result pages are downgraded unless the page itself contains a dated concrete event.

6. `large_company_concentration`
   - Pass when the report exposes large-company concentration in usable `core_pool` and recommends repair rather than lowering frontstage caps.

7. `builders_boundary`
   - Pass when builders viewpoints are not approved as business-signal facts, relationship graph evidence, or trend-candidate evidence.

8. `downstream_decision_current`
   - Pass when the report uses only `allow`, `allow_with_degradation`, or `block` for Signal Cards, relationship graph inputs, trend candidates, and Business Signals frontstage data.

## Repair Loop

When a check fails, repair the earliest responsible stage: Raw capture, Pool routing, monitor log, source refetch, or QC report wording. Rerun this eval list after repair.
