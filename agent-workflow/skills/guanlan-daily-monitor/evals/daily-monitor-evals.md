# Daily Monitor Evals

Run these pass/fail checks when running, repairing, or updating the current WaveSight AI daily monitor source-capture layer.

## Required Checks

1. `current_context_loaded`
   - Pass when the run uses `context/05-daily-monitoring.md` and `context/07-v3-intelligence-generation-rules.md` as current rule sources.

2. `current_quantity_targets`
   - Pass when the report checks at least 150 active Raw candidates, at least 75 Pool items, at least 60 routed Pool items, and at least 30 usable `core_pool` items unless the run is explicitly blocked.

3. `no_legacy_quantity_flags`
   - Pass when commands and reports do not use retired defaults such as Raw `80-150`, Raw degraded `50-80`, Pool `20-40`, `--raw-target=120`, `--raw-min=80`, or `--raw-max=150`.

4. `original_source_capture`
   - Pass when downstream-worthy items preserve original URL, readable text or fallback explanation, extraction diagnostics, content hash, and missing-information notes.

5. `discovery_channel_boundary`
   - Pass when AI HOT, HN, X, Reddit, RSS, newsletters, and search aggregators are discovery only unless original sources were captured.

6. `page_type_downgrade`
   - Pass when homepage, directory, login, docs-index, catalog, marketplace, search-result, SEO, and navigation pages are downgraded unless they contain a dated concrete event.

7. `business_signals_only`
   - Pass when this skill does not stage First-Line Viewpoints, Builder Obsidian timelines, or Community Intelligence outputs.

8. `qc_handoff_written`
   - Pass when monitor output includes a quality-gate report, quality-loop report, monitor log, failed sources, fallback used, and evidence gaps.

## Repair Loop

When a check fails, repair Raw capture, Pool routing, configuration, or monitor log output before downstream Signal Card generation. Do not lower gates to make a run appear complete.
