# 2026-07-01 Guanlan Daily Monitor Log

- generated_at: 2026-07-01T02:33:05.722Z
- raw_count: 159
- aihot_mode: source-artifacts
- aihot_since: 
- aihot_discovered_count: 0
- aihot_daily_discovered_count: 0
- aihot_all_discovered_count: 0
- aihot_daily_included_count: 0
- aihot_daily_pool_count: 17
- aihot_daily_pool_policy: AI HOT daily selected items are all kept in the Pool index; their route remains evidence-gated and may be core_pool, emerging_pool, user_feedback_pool, watchlist, or index_only.
- aihot_rejected_by_raw_entry_rules: 0
- external_search_activated: false
- historical_dedupe_enabled: true
- historical_raw_records_checked: 6040
- historical_duplicates_removed_before_fetch: 503
- historical_duplicates_removed_after_fetch: 171
- raw_dedupe_buffer: 180
- aihot_count: 65
- keyword_search_count: 82
- keyword_search_non_community_count: 82
- keyword_search_path_distribution: developer_ecosystem=16; procurement_marketplace=15; a_media_gdelt=13; capital_startup=10; fde_implementation=10; industry_landing=9; official_original=9
- keyword_search_intent_distribution: find_customer_case=36; find_original_source=24; find_market_trend=13; find_startups=8; find_workflow_change=1
- source_distribution: keyword-search=82; aihot=65; rss-feed=10; gdelt=2
- enterprise_ai_transformation_column: 企业AI化
- enterprise_ai_transformation_candidate_count: 88
- enterprise_ai_transformation_stage_distribution: production_rollout=24; platform_enablement=21; pilot=16; ai_transformation=11; org_build=11; procurement=5
- enterprise_ai_transformation_boundary: Enterprise AI transformation is a monitoring lens, not a fourth Business Signal Card type; FDE / Applied AI role pages are organization-capability signals and require separate source-backed product, funding, customer deployment, procurement, or production rollout evidence before formal Card use.
- raw_count_by_channel: keyword-search=82; aihot=65; rss-feed=10; gdelt=2
- keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
- keyword_group_distribution: mature-commercial-signal=51; developer-ecosystem-signal=34; technical-iteration-signal=31; early-direction-signal=15; enterprise-ai-implementation-signal=14; uncategorized=9; outside-core-exploration=5
- theme_distribution: mature-commercial-signal=58; technical-iteration-signal=32; developer-ecosystem-signal=24; early-direction-signal=15; enterprise-ai-implementation-signal=14; uncategorized=9; outside-core-exploration=5; capital-market-signal=2
- theme_concentration_warning: none
- source_level_distribution: B=91; S=27; A=22; C=19
- evidence_object_type_distribution: case_or_customer=63; event=47; official_index_or_directory=12; regulatory_or_procurement=10; supporting_article=7; changelog_or_release=6; pricing_change=5; event_on_official_page=3; community_feedback=2; repo_readme_or_index=2; marketplace_listing=1; research_or_report=1
- pool_route_distribution: watchlist=60; core_pool=55; emerging_pool=33; index_only=27; user_feedback_pool=20; discard=13
- pool_index_route_distribution: watchlist=40; core_pool=30; emerging_pool=22; index_only=20; user_feedback_pool=16; discard=1
- pool_index_count: 95
- pool_target: 75
- pool_selection_buffer: 20
- routed_pool_count: 74
- routed_pool_target: 60
- core_pool_target: 30
- core_non_large_vendor_target: 20
- non_core_pool_count: 44
- index_only_pool_count: 20
- aihot_index_only_count: 17
- aihot_core_count: 0
- importance_coverage_gaps: none
- pool_importance_coverage_gaps: none
- daily_selected_change_card_theme_gate: default max 2 per theme; max 3 only when theme_day=true and daily log explains why.
- pool_theme_gate: diversify Pool; default max 4 candidate items per theme unless theme_day=true.
- pool_count: 95
- change_cluster_candidates: not_generated_by_monitor
- heat_candidates: none
- failed_sources: source-artifact keyword: keyword-search pre-gate filtered 44 result(s): missing_ai_anchor_in_result=15; job_or_salary_page=11; noise_term:career=9; noise_term:hiring=5; noise_term:coupon=1; noise_term:definition=1; noise_term:jobs at=1; noise_term:meme=1; source-artifact keyword: Anysearch documented-payload retry for query "Applied AI architect enterprise customer workflow (site:github.com OR site:npmjs.com OR site:pypi.org OR site:huggingface.co OR site:marketplace.visualstudio.com OR site:chromewebstore.google.com)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "forward deployed engineer AI customer deployment (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "enterprise AI transformation workflow change customer case (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.; source-artifact keyword: Anysearch documented-payload retry for query "Applied AI architect enterprise customer workflow (procurement OR tender OR marketplace OR app store OR AWS Marketplace OR Azure Marketplace OR job description)": Anysearch Search service temporarily unavailable.
- fallback_used: Default monitor uses AI HOT daily feed first, AI HOT all-mode remainder second, then keyword rules. External multi-path keyword search and GDELT activate when the default lanes do not meet the Raw minimum, an importance type is thin, or important candidates lack original text / usable evidence object. HN is feedback only and must not dominate. GDELT failures fall back to A-tier media search.
- evidence_gaps: keyword-search must not stop at community feedback. If official, developer ecosystem, startup/funding, industry landing, procurement/marketplace or A-media paths fail, the item can only remain Watchlist/User Feedback until non-community evidence is found.
- raw_count_by_source_type: web=76; operators=19; official=15; media=12; developer=10; news=10; product=6; marketplace=4; industry=3; builder=2; newsletter=1; organization-capability=1
- front_signal_sab_source_count: S=2; A=2; B=1; total=5
- source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
- raw_snapshot_status_distribution: fetched-readable-text-main=43; fetched-readable-text-content-container=41; fetched-readable-text-body-visible-text=22; no-url-summary-only=19; fetched-readable-text-json-ld=13; blocked-http-401=4; blocked-http-403=4; fetched-readable-text-article=3; fetched-readable-text-meta-description=3; summary-only-low-readable-body=3; fetched-readable-text-json-text=2; http-410-fallback-text=1; timeout-fallback-visible-text=1
- core_original_evidence_count: pending; to be filled after important-card evidence review.
- raw_snapshot_policy: Raw originals save clean text snapshots when fetchable; high-volatility sources keep available local text and must be rechecked before downstream use.

## Source Level Distribution

- A: 22
- S: 27
- B: 91
- C: 19

## Evidence Object Type Distribution

- case_or_customer: 63
- event: 47
- regulatory_or_procurement: 10
- supporting_article: 7
- marketplace_listing: 1
- pricing_change: 5
- repo_readme_or_index: 2
- changelog_or_release: 6
- research_or_report: 1
- event_on_official_page: 3
- community_feedback: 2
- official_index_or_directory: 12

## Theme Distribution

- 成熟信号 (mature-commercial-signal): 58
- 开发者生态信号 (developer-ecosystem-signal): 24
- 外围探索信号 (outside-core-exploration): 5
- 早期信号 (early-direction-signal): 15
- 技术迭代信号 (technical-iteration-signal): 32
- Enterprise AI / FDE implementation signal (enterprise-ai-implementation-signal): 14
- uncategorized (uncategorized): 9
- 资本市场信号 (capital-market-signal): 2

## Keyword Group Distribution

- mature-commercial-signal: 51
- developer-ecosystem-signal: 34
- outside-core-exploration: 5
- early-direction-signal: 15
- technical-iteration-signal: 31
- enterprise-ai-implementation-signal: 14
- uncategorized: 9

## Keyword Search Path Distribution

- fde_implementation: 10
- capital_startup: 10
- official_original: 9
- developer_ecosystem: 16
- industry_landing: 9
- procurement_marketplace: 15
- a_media_gdelt: 13

## Keyword Search Intent Distribution

- find_customer_case: 36
- find_original_source: 24
- find_workflow_change: 1
- find_market_trend: 13
- find_startups: 8

## Three-Lane Monitor Policy

Default strategy: AI HOT, RSS, keyword search and GDELT are discovery entrances; keyword rules fill overseas big-company events, vertical product news, startup/funding news, customer adoption and industry landing. Builder and operator viewpoints are isolated from Business Signals. HN / community is feedback only. Business Signal Cards must resolve original text, page type and usable evidence object before publication.
