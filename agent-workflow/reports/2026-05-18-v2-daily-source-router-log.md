# 2026-05-18 V2 Daily Source Router Log

- generated_at: 2026-05-18T07:52:02.373Z
- raw_count: 100
- aihot_mode: daily+all
- aihot_since: 2026-05-17T07:42:34.183Z
- aihot_discovered_count: 175
- aihot_daily_discovered_count: 12
- aihot_all_discovered_count: 163
- aihot_daily_included_count: 12
- aihot_rejected_by_raw_entry_rules: 49
- external_search_activated: true
- aihot_count: 21
- keyword_search_count: 21
- keyword_search_non_community_count: 13
- keyword_search_path_distribution: official_original=9; community_feedback=8; procurement_marketplace=4
- keyword_search_intent_distribution: find_startups=12; find_user_feedback=8; find_original_source=1
- follow_builders_count: 19
- source_distribution: hn=39; aihot=21; keyword-search=21; follow-builders=19
- raw_count_by_channel: hn=39; aihot=21; keyword-search=21; follow-builders=19
- keyword_monitoring_config: 01-SiteV2/content/09-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=27; developer-ecosystem-signal=19; uncategorized=18; technical-iteration-signal=17; early-direction-signal=14; outside-core-exploration=5
- theme_distribution: mature-commercial-signal=27; developer-ecosystem-signal=19; uncategorized=18; technical-iteration-signal=17; early-direction-signal=14; outside-core-exploration=5
- theme_concentration_warning: none
- signal_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- failed_sources: keyword-search a_media_gdelt AI Agent funding enterprise customers: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt pre-seed AI startup vertical AI design partner: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt model release inference cost reduction enterprise adoption: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt open-source AI agent GitHub enterprise adoption: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt AI adoption unexpected industry workflow: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt AI sales agent ARR customers: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt voice AI agent funding customer adoption: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt AI coding agent enterprise deployment: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt AI workflow automation procurement: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); keyword-search a_media_gdelt AI infrastructure startup Series A customers: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); GDELT AI acquisition enterprise software: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); GDELT pre-seed AI startup vertical AI: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); GDELT inference cost reduction AI enterprise: content-type=text/html; charset=utf-8; invalid JSON — Unexpected token 'Y', "Your searc"... is not valid JSON — Your search contained a keyword that was too short.; GDELT AI developer tools enterprise adoption: fetch failed (code=UND_ERR_CONNECT_TIMEOUT); GDELT AI adoption vertical industry workflow: fetch failed (code=UND_ERR_CONNECT_TIMEOUT)
- fallback_used: Default source-router uses AI HOT full 24h + follow-builders + keyword rules first. External multi-path keyword search, standalone HN and GDELT activate when the default lanes do not meet the Raw target, a required signal class is thin, or important cards need S/A/B补证. Later Agent pass must use official / S/A/B sources for fact evidence.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=31; industry=26; official=19; developer=12; community=10; media=1; research=1
- raw_snapshot_status_distribution: timeout-fallback-visible-text=61; fetched-clean-text=24; no-url-summary-only=12; blocked-http-403=3
- frontstage_sab_source_count: pending; to be filled after important-card secondary source backfill.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before frontstage use.

## Source Level Distribution

- B: 69
- A: 2
- S: 19
- C: 10

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 27
- 早期信号 (early-direction-signal): 14
- 开发者生态信号 (developer-ecosystem-signal): 19
- 技术迭代信号 (technical-iteration-signal): 17
- uncategorized (uncategorized): 18
- 外围探索信号 (outside-core-exploration): 5

## Keyword Group Distribution

- mature-commercial-signal: 27
- early-direction-signal: 14
- developer-ecosystem-signal: 19
- technical-iteration-signal: 17
- uncategorized: 18
- outside-core-exploration: 5

## Keyword Search Path Distribution

- procurement_marketplace: 4
- official_original: 9
- community_feedback: 8

## Keyword Search Intent Distribution

- find_startups: 12
- find_user_feedback: 8
- find_original_source: 1

## Three-Lane Source-Router Policy

Default strategy: AI HOT full 24h is the primary Raw discovery entrance; follow-builders is fully scanned and fully written into the frontier-opinion library; keyword rules fill categories, tracks and evidence terms. If those lanes do not reach the Raw target, a required signal class is thin, or important cards need補证, activate external multi-path search. Important cards must then resolve original S/A/B evidence before publication.
