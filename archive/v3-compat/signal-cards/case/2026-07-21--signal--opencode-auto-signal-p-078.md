---
id: SIG-20260721-A25
type: signal_card
signal_type: case
title: "请停止使用 OpenCode"
date: 2026-07-21
status: published
source_title: "请停止使用 OpenCode"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-21T01:28:03.543Z
updated_at: 2026-07-21T01:28:03.543Z

raw_refs: ["R-078"]
pool_refs: ["P-078"]
primary_raw:
  raw_ref: R-078
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-21/r-078-请停止使用-opencode.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-21/r-078-请停止使用-opencode.json"
  source_url: "https://wren.wtf/shower-thoughts/stop-using-opencode"
  full_text_hash: "75d000f3ca16613e"
  source_level: B
  extraction_quality: high
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
    - emerging_pool
  raw_qc_decision: allow
  importance_type: important_technical_trend
  importance_score: 5

formal_tags:
  track: ["track-ai-coding", "track-ai-governance"]
  function: ["function-engineering"]
  scenario: ["scenario-agent-governance"]
  customer: ["customer-developer-team"]
  evidence: ["evidence-customer-adoption"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["sales_team", "engineering_team"]
  team_or_function: ["sales", "engineering"]
  specific_task: ["sales_lead_research", "internal_tool_building"]
  business_action: ["customer_deployment", "open_source_release", "governance_requirement"]
  product_form: ["developer_tool"]
  delivery_model: []
  pain_or_constraint: ["data_silo", "security_compliance", "evaluation_gap"]
  adoption_evidence: ["deployment_scale"]
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "使用本地 LLM 测试发现严重提示缓存未命中：每次 SSE 轮次重读 AGENTS.md、agent→用户转换时修剪上下文导致 40k token 缓存失效、午夜日期变更引发完全缓存未命中。"
  missing_fields: ["delivery_model"]

signal_owner: "请停止使用 OpenCode"

frontend:
  displayTitle: "请停止使用 OpenCode"
  sourceLinks:
    - "https://wren.wtf/shower-thoughts/stop-using-opencode"
---

# 请停止使用 OpenCode

## 新闻事实

OpenCode（GitHub 161k stars）安全立场极差，本质是"将 LLM 管道连接到 bash"的 Web 工具。

## 原文要点

- The boot is made of TypeScript and the face is everything we have learned about security and systems software since the invention of the electronic computer in the 1940s.

## 价值描述

使用本地 LLM 测试发现严重提示缓存未命中：每次 SSE 轮次重读 AGENTS.md、agent→用户转换时修剪上下文导致 40k token 缓存失效、午夜日期变更引发完全缓存未命中。

## 可见原文片段

Stop Using OpenCode If you don’t know what OpenCode is, imagine a boot stamping on a human face forever.

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
