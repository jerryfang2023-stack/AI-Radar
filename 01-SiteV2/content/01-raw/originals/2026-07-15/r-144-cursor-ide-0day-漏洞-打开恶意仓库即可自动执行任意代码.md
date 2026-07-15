---
schema_version: raw-evidence-v2
raw_id: R-144
title: "Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码"
title_zh: ""
title_translation_status: needs_ingestion_translation
title_translation_method: title_translation_generator_failed
original_url: ""
canonical_url: ""
source_name: "Hacker News 热门（buzzing.cc 中文翻译）"
source_type: web
source_level: B
source_level_role: traceability_only_not_value_score_or_core_gate
evidence_object_type: official_index_or_directory
evidence_object_usable: false
event_evidence: false
index_only_evidence: true
acquisition_source_level: "M"
acquisition_channel: aihot
research_status: not_research
search_intent: ""
search_path: ""
search_path_label: ""
author: ""
published_at: ""
collected_at: 2026-07-15T04:28:38.282Z
language: mixed
full_text_hash: 03371df93fc79d5d
markdown_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-144-cursor-ide-0day-漏洞-打开恶意仓库即可自动执行任意代码.md"
json_snapshot_path: "01-SiteV2/content/01-raw/originals/2026-07-15/r-144-cursor-ide-0day-漏洞-打开恶意仓库即可自动执行任意代码.json"
html_snapshot_path: ""
screenshot_path: ""
fetch_status: no-url-summary-only
extraction_quality: failed
extraction_method: "no_url_summary_fallback"
readability_score: 0
extractor_diagnostics: {"method":"no_url_summary_fallback"}
has_full_text: false
content_length: 290
fetch_error: ""
evidence_strength: blocked
raw_qc_decision: block
raw_qc_downstream_use: not_allowed
degradation_reasons: ["index_only_or_directory_page","missing_full_text","missing_snapshot"]
evidence_completeness: {"original_url_status":"missing","full_text_status":"missing_or_summary_only","snapshot_status":"missing_or_fetch_failed","hash_status":"present","excerpt_status":"present","markdown_snapshot_status":"will_write","json_snapshot_status":"will_write","evidence_hash":"03371df93fc79d5d","missing":["missing_original_url","missing_full_text","missing_snapshot"]}
source_volatility: high
community_name: "Hacker News 热门（buzzing.cc 中文翻译）"
capture_scope: summary_only
visible_range: "采集通道提供的标题与摘要"
evidence_level: discovery_only
discovery_source: "AI HOT"
discovery_record: {"discovery_title":"Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码","discovery_summary":"安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"","discovered_at":"2026-07-15T04:20:25.015Z","rank_on_page":11,"discovery_status":"discovered"}
source_role: discovery_source
origin_fetch_status: "summary_only"
paywall_status: none
block_status: none
duplicate_status: unique
url_hash: e3b0c44298fc1c14
content_hash: 03371df93fc79d5d
semantic_hash: 9b7c4554ac840ff8
duplicate_of: ""
first_seen_at: "2026-07-15T04:28:38.282Z"
last_seen_at: 2026-07-15T04:28:38.282Z
update_detected: false
raw_status: ignored
usable_for: {"viewpoint":false,"case":false,"business_change":false,"relationship_graph_input":false,"trend_candidate_context":false,"signal_card_candidate":false,"emerging_pool":false,"user_feedback_pool":false,"watchlist":false}
pool_routes: ["index_only"]
change_action_detected: true
evidence_eligibility: blocked
evidence_block_reason: "homepage_or_directory_observation"
guanlan_scores: {"importance_type":"important_product_or_service","importance_score":4,"importance_reason":"new product or service; rubric=4 concrete important change","supporting_signals":["commercial_or_risk_context"],"novelty":3,"evidence_strength":2,"case_richness":4,"trend_relevance":4,"guanlan_relevance":5,"emerging_signal_score":3}
business_elements: {"companies":["Hacker News 热门（buzzing.cc 中文翻译）","Cursor"],"products":["Cursor"],"people":[],"industries":[],"roles":[],"workflows":["权限 / 安全治理"],"business_actions":["发布 / 推出"],"affected_departments":["IT / 安全"],"numbers":["0","2025","12","15","7","70"],"quotes":[]}
evidence_seed: {"company_actions":["当用户在 Windows 上打开包含恶意 `git.","exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。","漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。"],"case_details":[],"workflow_changes":["Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。"],"before_after_clues":["可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。"],"affected_roles":[],"risks_or_constraints":["安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。"]}
missing_information: ["证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象","疑似官网首页、产品目录或导航页，只能索引留存","没有具体客户或真实企业案例","没有可用全文快照"]
key_excerpts: [{"type":"supporting_context","text":"安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"medium"},{"type":"supporting_context","text":"安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。","supports":["signal_card_candidate","relationship_graph_input"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"当用户在 Windows 上打开包含恶意 `git.","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"company_action","text":"漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"},{"type":"workflow_change","text":"Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。","supports":["signal_card_candidate","relationship_graph_input","business_change","case","trend_candidate_context"],"importance":"high","confidence":"medium"}]
fact_extraction_status: extracted_at_raw_ingestion
fact_extraction_method: structured_key_excerpts_and_business_elements
fact_extraction_completed_at: 2026-07-15T04:28:38.282Z
theme: mature-commercial-signal
keyword_group: mature-commercial-signal
copyright_note: local research archive only
---

# Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码

## clean_text

安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。

## full_text

安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。

## extraction_diagnostics

- extraction_method: no_url_summary_fallback
- readability_score: 0
- fetch_status: no-url-summary-only
- extraction_quality: failed
- diagnostics: {"method":"no_url_summary_fallback"}

## markdown_snapshot

本文件即为人工回查用 Markdown 快照；机器读取优先使用同目录 JSON 证据对象。

## key_excerpts

1. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=medium
   安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。

2. **supporting_context**｜supports=signal_card_candidate, relationship_graph_input｜importance=high｜confidence=medium
   安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。

3. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   当用户在 Windows 上打开包含恶意 `git.

4. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。

5. **company_action**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。

6. **workflow_change**｜supports=signal_card_candidate, relationship_graph_input, business_change, case, trend_candidate_context｜importance=high｜confidence=medium
   Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。

## business_elements

- companies: Hacker News 热门（buzzing.cc 中文翻译）, Cursor
- products: Cursor
- people: 暂无公开信息
- industries: 暂无公开信息
- roles: 暂无公开信息
- workflows: 权限 / 安全治理
- business_actions: 发布 / 推出
- affected_departments: IT / 安全
- numbers: 0, 2025, 12, 15, 7, 70
- quotes: 暂无公开信息

## evidence_seed

- company_actions: 当用户在 Windows 上打开包含恶意 `git. / exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。 / 漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。
- case_details: 暂无公开信息
- workflow_changes: Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。
- before_after_clues: 可能涉及 权限 / 安全治理 的前后变化，需要二搜补足变化前流程。
- affected_roles: 暂无公开信息
- risks_or_constraints: 安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。 / 安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。

## guanlan_scores

- importance_type: important_product_or_service
- importance_score: 4
- importance_reason: new product or service; rubric=4 concrete important change
- supporting_signals: commercial_or_risk_context
- novelty: 3
- evidence_strength: 2
- case_richness: 4
- trend_relevance: 4
- guanlan_relevance: 5
- emerging_signal_score: 3

## usable_for

- viewpoint: false
- case: false
- business_change: false
- relationship_graph_input: false
- trend_candidate_context: false
- signal_card_candidate: false
- emerging_pool: false
- user_feedback_pool: false
- watchlist: false

## pool_routes

- index_only

## missing_information

- 证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象
- 疑似官网首页、产品目录或导航页，只能索引留存
- 没有具体客户或真实企业案例
- 没有可用全文快照

## volatile_and_discovery_handling

- source_volatility: high
- community_name: Hacker News 热门（buzzing.cc 中文翻译）
- capture_scope: summary_only
- visible_range: 采集通道提供的标题与摘要
- evidence_level: discovery_only
- discovery_source: AI HOT
- source_role: discovery_source
- origin_fetch_status: summary_only
- discovery_record: {"discovery_title":"Cursor IDE 0day 漏洞：打开恶意仓库即可自动执行任意代码","discovery_summary":"安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。","source_name":"Hacker News 热门（buzzing.cc 中文翻译）","origin_url":"","discovered_at":"2026-07-15T04:20:25.015Z","rank_on_page":11,"discovery_status":"discovered"}

## 原始摘要 / 采集文本

安全公司 Mindgard 于 2025 年 12 月 15 日发现 Cursor IDE 存在严重 0day 漏洞。当用户在 Windows 上打开包含恶意 `git.exe` 的仓库时，Cursor 会自动执行该文件，无需任何用户交互。漏洞源于 Cursor 在加载项目时会在包括工作区在内的多个位置搜索 Git 二进制文件。Mindgard 在 7 个月内多次报告，Cursor CISO 虽确认但因内部自动化故障导致流程中断，至今已发布 70 多个新版本仍未修复。临时缓解措施包括使用 AppLocker 阻止从工作区目录执行该文件名，或在隔离虚拟机中打开不受信任的仓库。

## 采集备注

该条目由 aihot 发现，source_level 只作追溯记录，不判断商业价值，也不决定 core_pool。AI HOT、RSS、搜索和社区入口都只是发现入口；HN / Reddit / X 等社区材料可用于讨论升温、用户反馈和早期观察，但不能单独证明公司动作、客户采用、收入、融资或市场规模。
