---
id: SIG-20260715-A11
type: signal_card
signal_type: product_service
title: "报告称 Claude Code 处理用户请求前消耗 Tokens 量约为 OpenCode 的 4.7 倍"
date: 2026-07-15
status: published
source_title: "报告称 Claude Code 处理用户请求前消耗 Tokens 量约为 OpenCode 的 4.7 倍"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-15T08:18:16.079Z
updated_at: 2026-07-15T08:18:16.079Z

raw_refs: ["R-094"]
pool_refs: ["P-094"]
primary_raw:
  raw_ref: R-094
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-15/r-094-报告称-claude-code-处理用户请求前消耗-tokens-量约为-opencode-的-4-7-倍.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-15/r-094-报告称-claude-code-处理用户请求前消耗-tokens-量约为-opencode-的-4-7-倍.json"
  source_url: "https://www.ithome.com/0/976/510.htm"
  full_text_hash: "d1c0c12135078896"
  source_level: B
  extraction_quality: medium
  has_full_text: true
  evidence_strength: source_backed_event
  pool_routes:
    - index_only
  raw_qc_decision: allow
  importance_type: important_market_structure
  importance_score: 5

formal_tags:
  track: ["track-ai-coding", "track-ai-agent", "track-ai-infra"]
  function: ["function-engineering"]
  scenario: []
  customer: ["customer-developer-team"]
  evidence: ["evidence-pricing-cost", "evidence-product-launch"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["engineering_team"]
  team_or_function: ["engineering"]
  specific_task: ["internal_tool_building"]
  business_action: ["product_launch", "pricing_change"]
  product_form: ["api"]
  delivery_model: ["api_usage_based"]
  pain_or_constraint: ["evaluation_gap"]
  adoption_evidence: ["deployment_scale", "third_party_report"]
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "IT之家 7 月 14 日消息，科技媒体 systima 于 7 月 12 日发布博文，对比测试指出在相同提示词、相同 AI 模型情况下， 在处理用户请求前，Claude Code 消耗的 Tokens 数量约为 OpenCode 的 4.7 倍。"
  missing_fields: []

signal_owner: "Anthropic / Claude Code"

frontend:
  displayTitle: "报告称 Claude Code 处理用户请求前消耗 Tokens 量约为 OpenCode 的 4.7 倍"
  sourceLinks:
    - "https://www.ithome.com/0/976/510.htm"
---

# 报告称 Claude Code 处理用户请求前消耗 Tokens 量约为 OpenCode 的 4.7 倍

## 新闻事实

科技媒体 systima 对比测试 Claude Code 2.1.207 与 OpenCode 1.17.18，均使用 Claude Sonnet 4.5 模型。

## 原文要点

- 结果显示，Claude Code 初始请求包含系统提示词和 27 个工具说明，工具描述占用约 24000 个 Tokens，总计约消耗 32800 个 Tokens，约为 OpenCode（6900 个 Tokens）的 4.7 倍。
- 调查显示 Claude Code 初始请求包含系统提示词和 27 个工具说明，仅工具描述就占用了约 24000 个 Tokens，在处理用户输入之前大约需要消耗约 32800 个 Tokens。
- IT之家 7 月 14 日消息，科技媒体 systima 于 7 月 12 日发布博文，对比测试指出在相同提示词、相同 AI 模型情况下， 在处理用户请求前，Claude Code 消耗的 Tokens 数量约为 OpenCode 的 4.7 倍。
- 该媒体对比测试 Claude Code 2.1.207 与 OpenCode 1.17.18 版本，均使用相同的 Claude Sonnet 4.5 模型，并通过日志智能体记录请求载荷和 API 用量。

## 价值描述

生产环境中，72KB 指令文件平均增加 2 万个 Tokens，5 个常规 MCP 配置再增加 5000~7000 个 Tokens，首个请求后总消耗可达 75000 到 85000 个 Tokens。

## 可见原文片段

关闭全部工具后，Claude Code 的系统提示词仍约占 6500 个 Token。

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
