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

9. `early_start_problem_watchdog`
   - Pass when startup or monitor-stage failures in the 08:57 primary Business Signals window or 09:27 conditional health dispatch are recorded by Daily Problem Watchdog with run URLs, failure count context, and a Codex repair inbox item.
   - Pass when the watchdog does not dispatch recovery or start a full-chain rerun.
   - Fail when monitor startup failures are handled by repeated late schedule windows, Hermes recovery / early handoff workflows, or any automatic full-chain rerun.

10. `monitor_parameter_alignment`
    - Pass when Business Signals PR, production-chain dry run, problem watchdog, and manual skill examples share the same production monitor baseline: diagnostic reference `85`, `search-limit=200`, `search-path-query-limit=5`, `gdelt-query-limit=12`, `hn-limit=8`, `fetch-timeout-ms=20000`, `snapshot-timeout-ms=16000`, and `monitor-timeout-ms=900000`.
    - Pass when HN remains feedback-only and is not expanded as the primary fix for routed Pool / Core Pool shortages.
    - Fail when dry-run or skill examples keep lightweight historical parameters such as `search-limit=30`, `search-path-query-limit=1`, `gdelt-query-limit=4`, `hn-limit=20`, or diagnostic `pass-score=80`.

11. `source_artifact_retry_refresh`
    - Pass when source-artifact production retries refresh `aihot`, `keyword`, `gdelt`, and `rss` artifacts with the current retry-cycle search / GDELT limits before rerunning the unified monitor.
    - Fail when retry cycles only replay first-pass source artifacts, because `raw_count_min` cannot recover from additional search ceilings if source artifacts remain stale.

## Repair Loop

When a check fails, repair Raw capture, Pool routing, configuration, or monitor log output before downstream Signal Card generation. Do not lower gates to make a run appear complete.
