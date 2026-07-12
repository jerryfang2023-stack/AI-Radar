---
date: 2026-07-12
stage: raw
status: guanlan-daily-monitor-collected
raw_count: 62
aihot_mode: source-artifacts
aihot_since: ""
aihot_discovered_count: 0
aihot_daily_discovered_count: 0
aihot_all_discovered_count: 0
aihot_daily_included_count: 0
aihot_daily_pool_policy: full_daily_selected_to_pool_index
aihot_rejected_by_raw_entry_rules: 0
external_search_activated: false
anysearch_configured: true
anysearch_disabled_for_run: false
provider_fallback_notes: Historical Raw dedupe removed 566 URL duplicate candidate(s) before Raw selection.; Search cross-entry dedupe removed 9 duplicate provider hits before Raw selection.; Historical Raw dedupe removed 228 fetched hash duplicate candidate(s) before Raw writing.
source_artifacts_used: true
source_artifact_files: agent-workflow/reports/source-runs/2026-07-12/aihot-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-12/gdelt-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-12/keyword-raw-source-candidates.json, agent-workflow/reports/source-runs/2026-07-12/rss-raw-source-candidates.json
historical_dedupe_enabled: true
historical_raw_records_checked: 7809
historical_duplicates_removed_before_fetch: 566
historical_duplicates_removed_after_fetch: 228
raw_dedupe_buffer: 140
aihot_count: 43
keyword_search_count: 13
social_discovery_count: 0
keyword_monitoring_config: 01-SiteV2/content/11-databases/keyword-monitoring-v2.json
source_registry_config: 01-SiteV2/content/11-databases/source-registry-v2.json
pool_target: 75
pool_selection_buffer: 20
routed_pool_target: 60
core_pool_target: 30
core_non_large_vendor_target: 20
generated_at: 2026-07-12T06:10:44.064Z
---

# 2026-07-12 Raw Candidates

说明：本文件由 `agent-workflow/tools/run-guanlan-daily-monitor.mjs` 生成。默认采用 Raw-first 策略：AI HOT、RSS、关键词搜索和 GDELT 作为发现入口，关键词规则补齐海外大厂、垂直赛道、融资、客户采用和行业落地缺口；HN / 社区只作为反馈补充。所有 discovery 入口进入 Business Signals 前必须回到原始 URL，保存全文或当时可见文本，并重新判定页面类型与事件证据。

### R-001｜微软和 Meta 对 CoreWeave 与 Nebius 的 1222 亿美元承诺额剖析

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-001-微软和-meta-对-coreweave-与-nebius-的-1222-亿美元承诺额剖析.md`
- 出处：Hacker News 热门（buzzing.cc 中文翻译）｜https://io-fund.com/ai-stocks/nvidia-coreweave-nebius-circular-financing-gpu-boom
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：早期信号
- 关键词组：early-direction-signal
- 发布时间：2026-07-11T22:07:25.362Z
- 分类：tip
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: low_value_ai_adjacent_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=0dbc1b8e93964244
- 原文抓取优先级：22.1
- Raw 状态：pooled
- Pool 分流：user_feedback_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, user_feedback_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-002｜OpenAI GPT-5.6 Sol Ultra 一小时解决 50 年数学猜想

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-002-openai-gpt-5-6-sol-ultra-一小时解决-50-年数学猜想.md`
- 出处：The Decoder：AI News（RSS）｜https://the-decoder.com/openais-gpt-5-6-sol-ultra-reportedly-solves-a-50-year-old-math-problem-in-under-an-hour
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：早期信号
- 关键词组：early-direction-signal
- 发布时间：2026-07-11T17:38:35.000Z
- 分类：ai-models
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_technical_trend
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens
- 本地快照：fetched-readable-text-json-ld｜quality=high｜has_full_text=true｜hash=69180af749f31fea
- 原文抓取优先级：22.1
- Raw 状态：pooled
- Pool 分流：emerging_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, emerging_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-003｜OpenAI GPT-5.6 Sol Ultra 一小时证明 50 年图论猜想

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-003-openai-gpt-5-6-sol-ultra-一小时证明-50-年图论猜想.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/646.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: research_or_report
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-12T00:44:43.000Z
- 分类：paper
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=high｜has_full_text=true｜hash=7a411771f8855aec
- 原文抓取优先级：22.1
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜not_event_case_or_trend_evidence
- 可用方向：viewpoint
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象

### R-004｜苹果起诉OpenAI，指控其通过挖角员工窃取未发布产品商业机密

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-004-苹果起诉openai-指控其通过挖角员工窃取未发布产品商业机密.md`
- 出处：The Decoder：AI News（RSS）｜https://the-decoder.com/apple-sues-openai-for-allegedly-running-a-coordinated-campaign-to-steal-trade-secrets-through-poached-employees
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: regulatory_or_procurement
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：2026-07-11T06:56:20.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=d599a5cdbef87147
- 原文抓取优先级：22.1
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-005｜Mesh LLM：在 iroh 上进行分布式人工智能计算

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-005-mesh-llm-在-iroh-上进行分布式人工智能计算.md`
- 出处：Hacker News 热门（buzzing.cc 中文翻译）｜https://www.iroh.computer/blog/mesh-llm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：2026-07-12T02:23:05.249Z
- 分类：ai-products
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-article｜quality=high｜has_full_text=true｜hash=a58317c66a8a63db
- 原文抓取优先级：22.1
- Raw 状态：pooled
- Pool 分流：core_pool, emerging_pool, user_feedback_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, emerging_pool, user_feedback_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-006｜Ghost Font：一种人类能读懂但AI无法识别的反AI字体

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-006-ghost-font-一种人类能读懂但ai无法识别的反ai字体.md`
- 出处：Hacker News 热门（buzzing.cc 中文翻译）｜https://www.mixfont.com/ghost-font
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：2026-07-11T16:31:09.615Z
- 分类：tip
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_technical_trend
- importance_score: 5
- supporting_signals: none
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=395af1a81eab0bfb
- 原文抓取优先级：22.1
- Raw 状态：pooled
- Pool 分流：emerging_pool, user_feedback_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, emerging_pool, user_feedback_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-007｜OpenAI 招聘家庭产品经理，ChatGPT 用户向年长群体扩展

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-007-openai-招聘家庭产品经理-chatgpt-用户向年长群体扩展.md`
- 出处：TechCrunch：AI（RSS）｜https://techcrunch.com/2026/07/11/openai-bets-on-families-as-chatgpt-goes-deeper-into-households
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：news
- 追溯标签：A
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T14:13:00.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=51cff43304e96664
- 原文抓取优先级：22.1
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-008｜Forward Deployed Engineering: Moving AI Pilots to Production

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-008-forward-deployed-engineering-moving-ai-pilots-to-production.md`
- 出处：keyword search / Anysearch｜https://beetroot.co/ai-ml/forward-deployed-engineering-the-role-between-ai-pilots-and-production/
- 采集通道：keyword-search
- 搜索意图：find_original_source
- 搜索路径：fde_implementation
- 来源类型：web
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：Enterprise AI / FDE implementation signal
- 关键词组：enterprise-ai-implementation-signal
- 发布时间：unknown
- 分类：fde_implementation
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, market_shaping_risk_context, adoption_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=e9cf49aed3279460
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-009｜Upscale AI Adds $190 Million in Extension to Series A, Reaching Half-Billion Dollars in Total Funding

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-009-upscale-ai-adds-190-million-in-extension-to-series-a-reaching-half-bil.md`
- 出处：keyword search / Anysearch｜https://upscale.com/blogs/upscale-ai-adds-190-million-in-extension-to-series-a-reaching-half-billion-dollars-in-total-funding?from_theconsensus=1
- 采集通道：keyword-search
- 搜索意图：find_startups
- 搜索路径：ai_hardware_original
- 来源类型：official
- 追溯标签：S
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：AI Hardware investment and financing
- 关键词组：ai-hardware-investment-signal
- 发布时间：unknown
- 分类：ai_hardware_original
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_funding
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, ai_hardware_lens, adoption_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=23145edb5fdd8d69
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-010｜Lenovo Enables One-Week Deployment of Production-Ready Agentic AI to Transform Enterprise Workflows – Company Announcement - FT.com

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-010-lenovo-enables-one-week-deployment-of-production-ready-agentic-ai-to-t.md`
- 出处：keyword search / Anysearch｜https://markets-data-api-proxy.ft.com/data/announce/full?dockey=600-202605120900BIZWIRE_USPRX____20260512_BW858142-1
- 采集通道：keyword-search
- 搜索意图：find_market_trend
- 搜索路径：a_media_gdelt
- 来源类型：media
- 追溯标签：A
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：a_media_gdelt
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, market_shaping_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=25dc602e392f702d
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：emerging_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：case, relationship_graph_input, trend_candidate_context, signal_card_candidate, emerging_pool, watchlist
- 缺失信息：none

### R-011｜Wonderful raises $150M Series B

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-011-wonderful-raises-150m-series-b.md`
- 出处：keyword search / Anysearch｜https://thenextweb.com/news/wonderful-series-b-enterprise-ai-agents
- 采集通道：keyword-search
- 搜索意图：find_original_source
- 搜索路径：capital_startup
- 来源类型：web
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：capital_startup
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_funding
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-json-ld｜quality=high｜has_full_text=true｜hash=ce420c93fe4b8b40
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：emerging_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, emerging_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-012｜Accelerating supply chain AI with Kinaxis MCP on Amazon Bedrock AgentCore | AWS Partner Network (APN) Blog

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-012-accelerating-supply-chain-ai-with-kinaxis-mcp-on-amazon-bedrock-agentc.md`
- 出处：keyword search / Anysearch｜https://aws.amazon.com/blogs/apn/accelerating-supply-chain-ai-with-kinaxis-mcp-on-amazon-bedrock-agentcore/
- 采集通道：keyword-search
- 搜索意图：find_original_source
- 搜索路径：official_original
- 来源类型：marketplace
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：official_original
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=b728545b3475b3f1
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-013｜awesome-copilot/skills/devops-rollout-plan/SKILL.md at main - GitHub

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-013-awesome-copilot-skills-devops-rollout-plan-skill-md-at-main-github.md`
- 出处：keyword search / Anysearch｜https://github.com/github/awesome-copilot/blob/main/skills/devops-rollout-plan/SKILL.md
- 采集通道：keyword-search
- 搜索意图：find_original_source
- 搜索路径：developer_ecosystem
- 来源类型：developer
- 追溯标签：S
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：developer-ecosystem-signal
- 发布时间：unknown
- 分类：developer_ecosystem
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_case
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=bf8ace2ddb9fa4b9
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-014｜Databricks will bake OpenAI models into its products in $100M bet to ...

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-014-databricks-will-bake-openai-models-into-its-products-in-100m-bet-to.md`
- 出处：keyword search / Anysearch｜https://techcrunch.com/2025/09/25/databricks-will-bake-openai-models-into-its-products-in-100m-bet-to-spur-enterprise-adoption/
- 采集通道：keyword-search
- 搜索意图：find_market_trend
- 搜索路径：a_media_gdelt
- 来源类型：news
- 追溯标签：A
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：a_media_gdelt
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_case
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=8f76537532740a4f
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：emerging_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, emerging_pool, watchlist
- 缺失信息：none

### R-015｜Iberdrola enhances IT operations using Amazon Bedrock AgentCore | Artificial Intelligence

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-015-iberdrola-enhances-it-operations-using-amazon-bedrock-agentcore-artifi.md`
- 出处：keyword search / Anysearch｜https://aws.amazon.com/blogs/machine-learning/iberdrola-enhances-it-operations-using-amazon-bedrock-agentcore/
- 采集通道：keyword-search
- 搜索意图：find_original_source
- 搜索路径：official_original
- 来源类型：marketplace
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：official_original
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, market_shaping_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=5277374459acc264
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-016｜Zensar Technologies Launches 'ZenseAI.AgentMesh' to Accelerate Enterprise AI Adoption at Scale – Company Announcement - FT.com

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-016-zensar-technologies-launches-zenseai-agentmesh-to-accelerate-enterpris.md`
- 出处：keyword search / Anysearch｜https://markets.ft.com/data/announce/detail?dockey=600-202606190950PR_NEWS_USPRX____IO87878-1
- 采集通道：keyword-search
- 搜索意图：find_market_trend
- 搜索路径：a_media_gdelt
- 来源类型：media
- 追溯标签：A
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：unknown
- 分类：a_media_gdelt
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=8d31d2e331059d2b
- 原文抓取优先级：21.4
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-017｜北京智源发布世界基础模型 Orca，不预测 token 而建模世界下一状态

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-017-北京智源发布世界基础模型-orca-不预测-token-而建模世界下一状态.md`
- 出处：The Decoder：AI News（RSS）｜https://the-decoder.com/chinas-orca-world-model-matches-specialized-robotics-systems-without-ever-seeing-a-single-action-label
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：早期信号
- 关键词组：early-direction-signal
- 发布时间：2026-07-11T09:03:26.000Z
- 分类：ai-models
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: ai_hardware_lens
- 本地快照：fetched-readable-text-json-ld｜quality=high｜has_full_text=true｜hash=ec996f7c4ac254ef
- 原文抓取优先级：20.7
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-018｜Thinking Machines Lab 发布技术白皮书：以可定制模型权重构建以人为本的 AI

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-018-thinking-machines-lab-发布技术白皮书-以可定制模型权重构建以人为本的-ai.md`
- 出处：MarkTechPost（RSS）｜https://www.marktechpost.com/2026/07/11/mira-muratis-thinking-machines-lab-makes-the-technical-case-for-human-centered-ai-built-on-customizable-model-weights
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-12T00:46:13.000Z
- 分类：tip
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_technical_trend
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens
- 本地快照：fetched-readable-text-article｜quality=high｜has_full_text=true｜hash=38062e505675e3f2
- 原文抓取优先级：20.7
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-019｜microsoft/ai-agents-for-beginners: 12 Lessons to Get ... - GitHub

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-019-microsoft-ai-agents-for-beginners-12-lessons-to-get-github.md`
- 出处：keyword search / Anysearch｜https://github.com/microsoft/ai-agents-for-beginners
- 采集通道：keyword-search
- 搜索意图：find_startups
- 搜索路径：developer_ecosystem
- 来源类型：developer
- 追溯标签：S
- evidence_object_type: changelog_or_release
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：早期信号
- 关键词组：developer-ecosystem-signal
- 发布时间：unknown
- 分类：developer_ecosystem
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_market_structure
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=b8a5c5a866af2a1b
- 原文抓取优先级：20
- Raw 状态：pooled
- Pool 分流：emerging_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, emerging_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-020｜OpenAI 承认 ChatGPT Work 发布"并非一切顺利"，紧急修复用户体验和成本问题

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-020-openai-承认-chatgpt-work-发布-并非一切顺利-紧急修复用户体验和成本问题.md`
- 出处：The Decoder：AI News（RSS）｜https://the-decoder.com/openai-admits-it-didnt-get-everything-quite-right-with-chatgpt-work-launch-and-scrambles-to-fix-ux-and-costs
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：formal_report
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T08:01:09.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: low_value_ai_adjacent_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=f2ce550708f7fd69
- 原文抓取优先级：19.299999999999997
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-021｜Hitachi Announces Strategic Partnership With Anthropic to Strengthen "Lumada 3.0" Through Frontier AI – Company Announcement - FT.com

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-021-hitachi-announces-strategic-partnership-with-anthropic-to-strengthen-l.md`
- 出处：keyword search / Anysearch｜https://markets.ft.com/data/announce/detail?dockey=600-202605182000BIZWIRE_USPRX____20260518_BW301548-1
- 采集通道：gdelt
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：not_applicable
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：news
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=238814da834a2d6d
- 原文抓取优先级：19.2
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-022｜Tiered Network Policy: Scaling Kubernetes Security

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-022-tiered-network-policy-scaling-kubernetes-security.md`
- 出处：Tigera Blog (Calico / AI Security)｜https://www.tigera.io/blog/tiered-network-policy-scaling-kubernetes-security/
- 采集通道：rss-feed
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：analysis
- 追溯标签：B
- evidence_object_type: supporting_article
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：早期信号
- 关键词组：early-direction-signal
- 发布时间：unknown
- 分类：rss
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=a5e5d057a03328d1
- 原文抓取优先级：19.2
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜not_event_case_or_trend_evidence
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势；没有具体客户或真实企业案例

### R-023｜谷歌 Voice 推出个人付费套餐：每月 10 美元起，Gemini 纪要功能首次下放

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-023-谷歌-voice-推出个人付费套餐-每月-10-美元起-gemini-纪要功能首次下放.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/573.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：2026-07-11T11:01:54.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=2ed75f84ade28e2a
- 原文抓取优先级：18.6
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-024｜特斯拉披露 Cybercab 更多细节：全新超高效动力总成、4680 电池、低压电气架构等

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-024-特斯拉披露-cybercab-更多细节-全新超高效动力总成-4680-电池-低压电气架构等.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/661.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：外围探索信号
- 关键词组：outside-core-exploration
- 发布时间：2026-07-12T02:18:10.000Z
- 分类：ai-products
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=medium｜has_full_text=true｜hash=9fc367f646b98abe
- 原文抓取优先级：18.6
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-025｜OpenAI 招聘家庭产品经理，拓展家庭用户市场

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-025-openai-招聘家庭产品经理-拓展家庭用户市场.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/633.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T23:15:38.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=medium｜has_full_text=true｜hash=d709bf2694753b56
- 原文抓取优先级：18.6
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-026｜OpenAI&#039;s GPT-5.6 Sol autonomously post-trained the smaller Luna model with a &quot;fairly underspecified prompt&quot;

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-026-openai-039-s-gpt-5-6-sol-autonomously-post-trained-the-smaller-luna-mo.md`
- 出处：The Decoder AI News｜https://the-decoder.com/openais-gpt-5-6-sol-autonomously-post-trained-the-smaller-luna-model-with-a-fairly-underspecified-prompt/
- 采集通道：rss-feed
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：uncategorized
- 关键词组：uncategorized
- 发布时间：unknown
- 分类：rss
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=c49b8620aa6bccbe
- 原文抓取优先级：18
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-027｜努比亚倪飞谈 AI 智能体手机：下半场从"功能叠加"走向"原生智能体"

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-027-努比亚倪飞谈-ai-智能体手机-下半场从-功能叠加-走向-原生智能体.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/662.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：外围探索信号
- 关键词组：outside-core-exploration
- 发布时间：2026-07-12T02:23:53.000Z
- 分类：tip
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 4
- supporting_signals: commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=8f0c4bf6e1c59756
- 原文抓取优先级：17.2
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-028｜特斯拉正开发 Grok 语音控制 FSD 功能

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-028-特斯拉正开发-grok-语音控制-fsd-功能.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/658.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: false
- event_evidence: true
- index_only_evidence: false
- evidence_strength: blocked
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page
- 采集入口标记：M
- research_status：not_research
- 主题分类：外围探索信号
- 关键词组：outside-core-exploration
- 发布时间：2026-07-12T01:56:15.000Z
- 分类：ai-products
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: automotive_vertical_context
- 本地快照：fetched-readable-text-content-container｜quality=medium｜has_full_text=true｜hash=ef04ca428ac22782
- 原文抓取优先级：17.2
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：viewpoint
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例

### R-029｜GPT-5.6 上线之际，马斯克与奥尔特曼隔空"掐架"

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-029-gpt-5-6-上线之际-马斯克与奥尔特曼隔空-掐架.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/641.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：早期信号
- 关键词组：early-direction-signal
- 发布时间：2026-07-12T00:14:08.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=d9470a073d194dd5
- 原文抓取优先级：17.2
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-030｜消息称中兴系战略深度聚焦 AI 手机，常规产品线暂定正常迭代

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-030-消息称中兴系战略深度聚焦-ai-手机-常规产品线暂定正常迭代.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/478.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：2026-07-11T08:00:28.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: ai_hardware_lens, adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=9dc16beb3343e94d
- 原文抓取优先级：17.2
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有变化前后流程线索

### R-031｜Meta 发布 Muse Spark 1.1 模型

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-031-meta-发布-muse-spark-1-1-模型.md`
- 出处：The Decoder：AI News（RSS）｜https://the-decoder.com/metas-muse-spark-1-1-outperforms-glm-5-2-in-coding-and-costs-slightly-less
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T08:28:12.000Z
- 分类：ai-models
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: low_value_ai_adjacent_context
- 本地快照：fetched-readable-text-content-container｜quality=medium｜has_full_text=true｜hash=57ee0d4cf810c15b
- 原文抓取优先级：17.2
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-032｜xAI Grok Build CLI 网络流量分析：上传仓库全部文件及 git 历史

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-032-xai-grok-build-cli-网络流量分析-上传仓库全部文件及-git-历史.md`
- 出处：Hacker News 热门（buzzing.cc 中文翻译）｜https://gist.github.com/cereblab/dc9a40bc26120f4540e4e09b75ffb547
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：developer
- 追溯标签：B
- evidence_object_type: repo_readme_or_index
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: true
- evidence_strength: blocked
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：2026-07-12T03:59:09.632Z
- 分类：tip
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=ee85f1f5b841d765
- 原文抓取优先级：16.5
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例

### R-033｜别再让我去问LLM了：当"Ask Claude"成为拒绝深度交流的借口

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-033-别再让我去问llm了-当-ask-claude-成为拒绝深度交流的借口.md`
- 出处：Hacker News 热门（buzzing.cc 中文翻译）｜https://blog.yaelwrites.com/stop-telling-me-to-ask-an-llm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: community_feedback
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T23:59:09.075Z
- 分类：tip
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_technical_trend
- importance_score: 4
- supporting_signals: none
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=584099fba1dec7b5
- 原文抓取优先级：16.5
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜not_event_case_or_trend_evidence
- 可用方向：viewpoint
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势；没有具体客户或真实企业案例

### R-034｜研究：博科圣地已使用ChatGPT、Claude等主流AI聊天机器人用于袭击策划与武器开发

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-034-研究-博科圣地已使用chatgpt-claude等主流ai聊天机器人用于袭击策划与武器开发.md`
- 出处：The Decoder：AI News（RSS）｜https://the-decoder.com/terrorist-groups-are-using-every-major-ai-chatbot-for-attack-planning-and-weapons-development
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: regulatory_or_procurement
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：2026-07-11T17:04:28.000Z
- 分类：industry
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_technical_trend
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=a3fc7c4a5912d5e8
- 原文抓取优先级：16.4
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-035｜《AI 2040》与"智能崇拜"：作者反思从硬起飞信仰到现实琐碎细节的转变

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-035-ai-2040-与-智能崇拜-作者反思从硬起飞信仰到现实琐碎细节的转变.md`
- 出处：Hacker News 热门（buzzing.cc 中文翻译）｜https://geohot.github.io//blog/jekyll/update/2026/07/11/ai-2040.html
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: regulatory_or_procurement
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：2026-07-11T19:27:11.440Z
- 分类：tip
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=5dfe91fe61656b8b
- 原文抓取优先级：16.4
- Raw 状态：pooled
- Pool 分流：core_pool, emerging_pool, user_feedback_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, emerging_pool, user_feedback_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-036｜TileGym GPU 编程教程：从cuTile与Triton内核到Flash Attention

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-036-tilegym-gpu-编程教程-从cutile与triton内核到flash-attention.md`
- 出处：MarkTechPost（RSS）｜https://www.marktechpost.com/2026/07/11/a-coding-guide-to-nvidias-tile-based-gpu-programming-from-cutile-and-triton-kernels-to-flash-attention
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: research_or_report
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：外围探索信号
- 关键词组：outside-core-exploration
- 发布时间：2026-07-12T00:01:06.000Z
- 分类：tip
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, adoption_context
- 本地快照：fetched-readable-text-article｜quality=high｜has_full_text=true｜hash=0b219907879282b5
- 原文抓取优先级：16.4
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜not_event_case_or_trend_evidence
- 可用方向：viewpoint
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势

### R-037｜KKAzilen/agentic-ai-lending-workflow: A practical reference ... - GitHub

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-037-kkazilen-agentic-ai-lending-workflow-a-practical-reference-github.md`
- 出处：keyword search / Anysearch｜https://github.com/KKAzilen/agentic-ai-lending-workflow
- 采集通道：keyword-search
- 搜索意图：find_startups
- 搜索路径：developer_ecosystem
- 来源类型：developer
- 追溯标签：B
- evidence_object_type: event_on_official_page
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：资本市场信号
- 关键词组：developer-ecosystem-signal
- 发布时间：unknown
- 分类：developer_ecosystem
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, market_shaping_risk_context, adoption_context
- 本地快照：fetched-readable-text-main｜quality=high｜has_full_text=true｜hash=965290853a1019d8
- 原文抓取优先级：15.7
- Raw 状态：pooled
- Pool 分流：emerging_pool, watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, emerging_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例

### R-038｜UiPath's venture arm backs workflow automation startup AirSlate

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-038-uipath-s-venture-arm-backs-workflow-automation-startup-airslate.md`
- 出处：keyword search / Anysearch｜https://techcrunch.com/2022/06/16/uipaths-new-venture-arm-backs-workflow-automation-startup-airslate/
- 采集通道：keyword-search
- 搜索意图：find_market_trend
- 搜索路径：a_media_gdelt
- 来源类型：news
- 追溯标签：A
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：资本市场信号
- 关键词组：capital-market-signal
- 发布时间：unknown
- 分类：a_media_gdelt
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: low_value_ai_adjacent_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=b8d929ddd4035d55
- 原文抓取优先级：15.7
- Raw 状态：pooled
- Pool 分流：index_only
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change
- 缺失信息：没有具体客户或真实企业案例

### R-039｜阶跃星辰发布 Step Edge 端侧模型全家桶

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-039-阶跃星辰发布-step-edge-端侧模型全家桶.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/681.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-12T03:42:29.000Z
- 分类：ai-models
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 4
- supporting_signals: commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=66e88b725135558f
- 原文抓取优先级：15.2
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-040｜Cognizant and Rubrik expand alliance to give enterprises control over autonomous AI in production – Company Announcement - FT.com

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-040-cognizant-and-rubrik-expand-alliance-to-give-enterprises-control-over-.md`
- 出处：keyword search / Anysearch｜https://markets.ft.com/data/announce/full?dockey=600-202606161000PR_NEWS_USPRX____NY84494-1
- 采集通道：gdelt
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：not_applicable
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：unknown
- 分类：news
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: ai_hardware_lens, commercial_or_risk_context, adoption_context
- 本地快照：fetched-readable-text-content-container｜quality=high｜has_full_text=true｜hash=5892aead9d3b17bb
- 原文抓取优先级：15
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：none

### R-041｜llm 0.31.1

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-041-llm-0-31-1.md`
- 出处：Simon Willison's Blog｜https://simonwillison.net/2026/Jul/9/llm/#atom-everything
- 采集通道：rss-feed
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：builder
- 追溯标签：S
- evidence_object_type: changelog_or_release
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：uncategorized
- 关键词组：uncategorized
- 发布时间：2026-07-09T16:06:15.000Z
- 分类：rss
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: none
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=1929c009535126c1
- 原文抓取优先级：14.5
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-042｜11天Claude Fable 5写超100万行代码：Rust重构JavaScript运行时Bun

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-042-11天claude-fable-5写超100万行代码-rust重构javascript运行时bun.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/469.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：2026-07-11T07:33:08.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_market_structure
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：fetched-readable-text-content-container｜quality=low｜has_full_text=true｜hash=0da8b2623036a378
- 原文抓取优先级：13.1
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-043｜彭博社揭秘苹果起诉 OpenAI 内幕：前员工一句"哈哈"成窃密关键

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-043-彭博社揭秘苹果起诉-openai-内幕-前员工一句-哈哈-成窃密关键.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/634.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: regulatory_or_procurement
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：2026-07-11T23:21:57.000Z
- 分类：industry
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_technical_trend
- importance_score: 5
- supporting_signals: ai_hardware_lens, commercial_or_risk_context, market_shaping_risk_context, adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=0bcbf01b5a27a4c8
- 原文抓取优先级：13
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, watchlist
- 缺失信息：none

### R-044｜荣耀公布平板端MagicOS 7月升级特性

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-044-荣耀公布平板端magicos-7月升级特性.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/546.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：外围探索信号
- 关键词组：outside-core-exploration
- 发布时间：2026-07-11T10:12:19.000Z
- 分类：ai-products
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 4
- supporting_signals: adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=f342e6be40105a6d
- 原文抓取优先级：13
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有变化前后流程线索

### R-045｜OpenAI 称 GPT-5.6 Sol 可化身研究员，后训练 Luna AI 模型

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-045-openai-称-gpt-5-6-sol-可化身研究员-后训练-luna-ai-模型.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/461.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T07:14:57.000Z
- 分类：ai-products
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: adoption_context
- 本地快照：fetched-readable-text-body-visible-text｜quality=medium｜has_full_text=true｜hash=f06915a888a7f2f3
- 原文抓取优先级：13
- Raw 状态：pooled
- Pool 分流：core_pool
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change, relationship_graph_input, trend_candidate_context, signal_card_candidate, watchlist
- 缺失信息：没有变化前后流程线索

### R-046｜分析师：特斯拉 FSD 即将迎来属于自己的 iPhone 时刻

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-046-分析师-特斯拉-fsd-即将迎来属于自己的-iphone-时刻.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/667.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-12T02:47:11.000Z
- 分类：tip
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: automotive_vertical_context, commercial_or_risk_context
- 本地快照：fetched-readable-text-content-container｜quality=medium｜has_full_text=true｜hash=8de81e96c3022b84
- 原文抓取优先级：12.9
- Raw 状态：pooled
- Pool 分流：index_only
- 证据对象门禁：eligible
- 可用方向：viewpoint, case, business_change
- 缺失信息：没有具体客户或真实企业案例

### R-047｜特斯拉 FSD v14 Lite 首次走出美国，韩国率先获得更新

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-047-特斯拉-fsd-v14-lite-首次走出美国-韩国率先获得更新.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/655.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: changelog_or_release
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: rich_evidence
- raw_qc_decision: allow
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: none
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-12T01:44:04.000Z
- 分类：ai-products
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: automotive_vertical_context
- 本地快照：fetched-readable-text-content-container｜quality=medium｜has_full_text=true｜hash=64e2125ff311881f
- 原文抓取优先级：12.9
- Raw 状态：pooled
- Pool 分流：index_only
- 证据对象门禁：eligible
- 可用方向：case, business_change
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-048｜韩国首尔将试点公共数据 MCP 服务，AI 可查询实时交通与空气信息

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-048-韩国首尔将试点公共数据-mcp-服务-ai-可查询实时交通与空气信息.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/674.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: false
- event_evidence: true
- index_only_evidence: false
- evidence_strength: blocked
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-12T03:23:03.000Z
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_market_structure
- importance_score: 5
- supporting_signals: none
- 本地快照：fetched-readable-text-content-container｜quality=low｜has_full_text=true｜hash=2446a1083c964d94
- 原文抓取优先级：11.7
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有变化前后流程线索

### R-049｜月之暗面 K2.7 Code 高速版正式登陆 Kimi Code，成为常驻可选模式

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-049-月之暗面-k2-7-code-高速版正式登陆-kimi-code-成为常驻可选模式.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/619.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: research_or_report
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T14:22:15.000Z
- 分类：ai-products
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_market_structure
- importance_score: 4
- supporting_signals: none
- 本地快照：fetched-readable-text-content-container｜quality=low｜has_full_text=true｜hash=1b5649a005cdafc0
- 原文抓取优先级：11.7
- Raw 状态：indexed
- Pool 分流：index_only
- 证据对象门禁：blocked｜not_event_case_or_trend_evidence
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有具体客户或真实企业案例；没有变化前后流程线索

### R-050｜阿里巴巴等启动"古壁生辉"古代壁画 AI 重现工程

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-050-阿里巴巴等启动-古壁生辉-古代壁画-ai-重现工程.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/537.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-11T09:30:44.000Z
- 分类：tip
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_market_structure
- importance_score: 5
- supporting_signals: none
- 本地快照：fetched-readable-text-content-container｜quality=low｜has_full_text=true｜hash=1f026a318f5f0f7d
- 原文抓取优先级：11.7
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-051｜苹果起诉OpenAI挖角窃密，分析师称即使指控未证实也可能重创其硬件计划

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-051-苹果起诉openai挖角窃密-分析师称即使指控未证实也可能重创其硬件计划.md`
- 出处：IT之家（RSS）｜https://www.ithome.com/0/975/666.htm
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: regulatory_or_procurement
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: source_backed_event
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=present; snapshot=present; hash=present; excerpt=present
- degradation_reasons: insufficient_usable_evidence_object
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：2026-07-12T02:37:22.000Z
- 分类：industry
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_market_structure
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：fetched-readable-text-content-container｜quality=low｜has_full_text=true｜hash=27124680b3a6e778
- 原文抓取优先级：7.5
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索

### R-052｜Customer Success Manager (Implementation &amp; AI Enablement) @ Suger.io

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-052-customer-success-manager-implementation-amp-ai-enablement-suger-io.md`
- 出处：keyword search / Anysearch｜https://www.tealhq.com/job/customer-success-manager-implementation-ai-enablement_7ea1ae2db3e6b4ac4307956e58f6d5593e008
- 采集通道：keyword-search
- 搜索意图：find_startups
- 搜索路径：procurement_marketplace
- 来源类型：web
- 追溯标签：B
- evidence_object_type: case_or_customer
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：早期信号
- 关键词组：early-direction-signal
- 发布时间：unknown
- 分类：procurement_marketplace
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 5
- supporting_signals: enterprise_ai_transformation_lens, commercial_or_risk_context, adoption_context
- 本地快照：blocked-http-403｜quality=failed｜has_full_text=false｜hash=04d21e707e3b7593
- 原文抓取优先级：2.4000000000000004
- Raw 状态：ignored
- Pool 分流：discard
- 证据对象门禁：eligible
- 可用方向：emerging_pool, watchlist
- 缺失信息：没有具体客户或真实企业案例；没有可用全文快照

### R-053｜OpenAI 发布 GPT-5.6 系列医疗评估结果

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-053-openai-发布-gpt-5-6-系列医疗评估结果.md`
- 出处：X：Sam Altman (@sama)｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: official_index_or_directory
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: true
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: none
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=d0d1fdb9fcf5c017
- 原文抓取优先级：1.0999999999999996
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例；没有可用全文快照

### R-054｜Claude Code v2.1.207 发布

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-054-claude-code-v2-1-207-发布.md`
- 出处：Claude Code：GitHub Releases（RSS）｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: official_index_or_directory
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: true
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=ac816b48d860395d
- 原文抓取优先级：1.0999999999999996
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例；没有可用全文快照

### R-055｜11天Claude Fable 5写超100万行代码：Rust重构JavaScript运行时Bun

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-055-11天claude-fable-5写超100万行代码-rust重构javascript运行时bun.md`
- 出处：IT之家（RSS）｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event_on_official_page
- evidence_object_usable: false
- event_evidence: true
- index_only_evidence: false
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_market_structure
- importance_score: 5
- supporting_signals: commercial_or_risk_context
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=9d216b400d38a722
- 原文抓取优先级：1.0999999999999996
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例；没有变化前后流程线索；没有可用全文快照

### R-056｜Ghost Font：一种人类能读懂但AI无法识别的反AI字体

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-056-ghost-font-一种人类能读懂但ai无法识别的反ai字体.md`
- 出处：Hacker News 热门（buzzing.cc 中文翻译）｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event_on_official_page
- evidence_object_usable: false
- event_evidence: true
- index_only_evidence: false
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_technical_trend
- importance_score: 5
- supporting_signals: none
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=8fb891b4feb8f6cc
- 原文抓取优先级：1.0999999999999996
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例；没有变化前后流程线索；没有可用全文快照

### R-057｜蚂蚁集团 Robbyant 发布 LingBot-VA 2.0，首个原生具身基础模型

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-057-蚂蚁集团-robbyant-发布-lingbot-va-2-0-首个原生具身基础模型.md`
- 出处：MarkTechPost（RSS）｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: official_index_or_directory
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: true
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_product_or_service
- importance_score: 4
- supporting_signals: adoption_context
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=f43003e2e29c053a
- 原文抓取优先级：-0.3000000000000007
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；疑似官网首页、产品目录或导航页，只能索引留存；没有变化前后流程线索；没有可用全文快照

### R-058｜OpenAI GPT-5.6-Sol 删光 AI 创业者 Matt Shumer 的 Mac 硬盘

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-058-openai-gpt-5-6-sol-删光-ai-创业者-matt-shumer-的-mac-硬盘.md`
- 出处：X：阿易 AI Notes (@AYi_AInotes)｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: official_index_or_directory
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: true
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：高相关候选，命中重要案例、融资、技术趋势、产品服务、垂直方案或重要观点。
- importance_type: important_vertical_solution
- importance_score: 4
- supporting_signals: commercial_or_risk_context
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=ea8a24592ac82f62
- 原文抓取优先级：-0.3000000000000007
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例；没有可用全文快照

### R-059｜阶跃星辰发布 Step Edge 端侧模型全家桶

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-059-阶跃星辰发布-step-edge-端侧模型全家桶.md`
- 出处：公众号：阶跃星辰（Step）｜https://mp.weixin.qq.com/s/StOzmXaUGSsjUXkAoW-HZg
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: event
- evidence_object_usable: true
- event_evidence: true
- index_only_evidence: false
- evidence_strength: traceable_summary
- raw_qc_decision: allow_with_degradation
- evidence_completeness: full_text=missing_or_summary_only; snapshot=present; hash=present; excerpt=present
- degradation_reasons: missing_full_text
- 采集入口标记：M
- research_status：not_research
- 主题分类：技术迭代信号
- 关键词组：technical-iteration-signal
- 发布时间：2026-07-12T02:00:37.000Z
- 分类：ai-models
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: important_product_or_service
- importance_score: 4
- supporting_signals: commercial_or_risk_context
- 本地快照：summary-only-low-readable-body｜quality=failed｜has_full_text=false｜hash=f67191ed1e5c879a
- 原文抓取优先级：-3.3000000000000007
- Raw 状态：pooled
- Pool 分流：watchlist
- 证据对象门禁：eligible
- 可用方向：watchlist
- 缺失信息：没有具体客户或真实企业案例；没有变化前后流程线索；没有可用全文快照

### R-060｜AI sticker shock hits corporate America

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-060-ai-sticker-shock-hits-corporate-america.md`
- 出处：keyword search / Anysearch｜https://www.axios.com/2026/05/28/ai-spending-roi-enterprise-costs
- 采集通道：gdelt
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：media
- 追溯标签：A
- evidence_object_type: supporting_article
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: false
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: missing_full_text；missing_snapshot
- 采集入口标记：not_applicable
- research_status：not_research
- 主题分类：开发者生态信号
- 关键词组：developer-ecosystem-signal
- 发布时间：unknown
- 分类：news
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: low_value_ai_adjacent_context
- 本地快照：blocked-http-403｜quality=failed｜has_full_text=false｜hash=45963a2f69ce0287
- 原文抓取优先级：-4.1
- Raw 状态：ignored
- Pool 分流：discard
- 证据对象门禁：blocked｜not_event_case_or_trend_evidence
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势；没有具体客户或真实企业案例；没有变化前后流程线索；没有可用全文快照

### R-061｜彭博社揭秘苹果起诉 OpenAI 内幕：前员工一句“哈哈”成窃密关键

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-061-彭博社揭秘苹果起诉-openai-内幕-前员工一句-哈哈-成窃密关键.md`
- 出处：IT之家（RSS）｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: official_index_or_directory
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: true
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: none
- importance_score: 1
- supporting_signals: none
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=03324f34dca9d78a
- 原文抓取优先级：-4.5
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例；没有变化前后流程线索；没有可用全文快照

### R-062｜研究：博科圣地已使用ChatGPT、Claude等主流AI聊天机器人用于袭击策划与武器开发

- 原文档案：`01-SiteV2/content/01-raw/originals/2026-07-12/r-062-研究-博科圣地已使用chatgpt-claude等主流ai聊天机器人用于袭击策划与武器开发.md`
- 出处：The Decoder：AI News（RSS）｜no-url
- 采集通道：aihot
- 搜索意图：not_applicable
- 搜索路径：not_applicable
- 来源类型：web
- 追溯标签：B
- evidence_object_type: official_index_or_directory
- evidence_object_usable: false
- event_evidence: false
- index_only_evidence: true
- evidence_strength: blocked
- raw_qc_decision: block
- evidence_completeness: full_text=missing_or_summary_only; snapshot=missing_or_fetch_failed; hash=present; excerpt=present
- degradation_reasons: index_only_or_directory_page；missing_full_text；missing_snapshot
- 采集入口标记：M
- research_status：not_research
- 主题分类：成熟信号
- 关键词组：mature-commercial-signal
- 发布时间：unknown
- 分类：industry
- 采集理由：中等相关候选，保留为观察线索，需二次搜索确认是否属于六类观澜重要性。
- importance_type: supporting_signal
- importance_score: 2
- supporting_signals: commercial_or_risk_context
- 本地快照：no-url-summary-only｜quality=failed｜has_full_text=false｜hash=9675d828eb7e2040
- 原文抓取优先级：-4.6
- Raw 状态：ignored
- Pool 分流：index_only
- 证据对象门禁：blocked｜homepage_or_directory_observation
- 可用方向：index_only
- 缺失信息：证据对象不可用：疑似索引页、目录页、薄文本或非可用证据对象；没有检测到明确动作词；可作为诊断信息，不能单独阻断重要观点、文章或技术趋势；疑似官网首页、产品目录或导航页，只能索引留存；没有具体客户或真实企业案例；没有可用全文快照
