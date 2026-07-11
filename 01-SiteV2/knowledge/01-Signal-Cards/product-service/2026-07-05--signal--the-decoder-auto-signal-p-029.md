---
id: SIG-20260705-A12
type: signal_card
signal_type: product_service
title: "开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70%"
date: 2026-07-05
status: published
source_title: "开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70%"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-05T04:56:15.778Z
updated_at: 2026-07-05T04:56:15.778Z

raw_refs: ["R-029"]
pool_refs: ["P-029"]
primary_raw:
  raw_ref: R-029
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-05/r-029-开源工具-pxpipe-将文本隐藏到-png-中-削减-claude-code-和-fable-5-的-token-成本高达-70.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-05/r-029-开源工具-pxpipe-将文本隐藏到-png-中-削减-claude-code-和-fable-5-的-token-成本高达-70.json"
  source_url: "https://the-decoder.com/open-source-tool-pxpipe-hides-text-in-pngs-to-cut-claude-code-and-fable-5-token-costs-up-to-70"
  full_text_hash: "dd4f744bbb274d93"
  source_level: A
  extraction_quality: high
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - watchlist
  raw_qc_decision: allow
  importance_type: supporting_signal
  importance_score: 2

formal_tags:
  track: ["track-ai-coding"]
  function: ["function-engineering"]
  scenario: []
  customer: ["customer-developer-team"]
  evidence: ["evidence-pricing-cost", "evidence-customer-metric"]
opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["sales_team", "engineering_team"]
  team_or_function: ["sales", "engineering"]
  specific_task: ["sales_lead_research", "internal_tool_building"]
  business_action: ["customer_deployment", "pricing_change", "open_source_release"]
  product_form: ["model_gateway"]
  delivery_model: []
  pain_or_constraint: ["api_cost_spike"]
  adoption_evidence: ["customer_metric"]
  source_evidence_type: ["business_media"]
  evidence_basis: "raw_source_text"
  source_excerpt: "开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70% 开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70% 原始来源标题显示：开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70%。"
  missing_fields: ["delivery_model"]

signal_owner: "The-Decoder"

frontend:
  displayTitle: "开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70%"
  sourceLinks:
    - "https://the-decoder.com/open-source-tool-pxpipe-hides-text-in-pngs-to-cut-claude-code-and-fable-5-token-costs-up-to-70"
---

# 开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70%

## 新闻事实

原始来源标题显示：开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70%。

## 原文要点

- 开源工具 pxpipe 利用 Anthropic 的图像定价策略，将长文本（如提示、文档、历史对话）渲染为紧凑 PNG，以降低 token 消耗。文本约 1 token/字符，图像按像素固定计费，每图像 token 约容纳 3.1 字符。pxpipe 作为本地代理拦截 Claude Code 请求，将静态内容转为图像，近期消息和输出仍为文本。开发者称平均节省 59%-70% token 成本；Fable 5 演示中会话成本从 42.2...

## 价值描述

开源工具 pxpipe 利用 Anthropic 的图像定价策略，将长文本（如提示、文档、历史对话）渲染为紧凑 PNG，以降低 token 消耗。文本约 1 token/字符，图像按像素固定计费，每图像 token 约容纳 3.1 字符。pxpipe 作为本地代理拦截 Claude Code 请求，将静态内容转为图像，近期消息和输出仍为文本。开发者称平均节省 59%-70% token 成本；Fable 5 演示中会话成本从 42.2...

## 可见原文片段

原始来源标题显示：开源工具 pxpipe 将文本隐藏到 PNG 中，削减 Claude Code 和 Fable 5 的 token 成本高达 70%。

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
