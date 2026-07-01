---
id: SIG-20260609-A04
type: signal_card
signal_type: product_service
title: "Claude Code v2.1.169 发布"
date: 2026-06-09
status: published
source_title: "Claude Code v2.1.169 发布"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-06-09T02:34:03.773Z
updated_at: 2026-06-09T02:34:03.773Z

raw_refs: ["R-006"]
pool_refs: ["P-006"]
primary_raw:
  raw_ref: R-006
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-06-09/r-006-claude-code-v2-1-169-发布.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-06-09/r-006-claude-code-v2-1-169-发布.json"
  source_url: "https://github.com/anthropics/claude-code/releases/tag/v2.1.169"
  full_text_hash: "8d430737f640ea21"
  source_level: S
  extraction_quality: high
  has_full_text: true
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 5

formal_tags:
  track: ["track-ai-coding", "track-enterprise-workflow"]
  function: ["function-engineering"]
  scenario: []
  customer: ["customer-developer-team", "customer-enterprise"]
  evidence: ["evidence-product-launch"]
  stage: []
  region: []
  source: ["source-first-party"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["engineering_team", "enterprise_ai_owner"]
  team_or_function: ["engineering"]
  specific_task: ["internal_tool_building"]
  business_action: ["product_launch", "open_source_release"]
  product_form: ["developer_tool"]
  delivery_model: []
  pain_or_constraint: ["hallucination_risk", "workflow_integration"]
  adoption_evidence: ["customer_metric", "deployment_scale"]
  source_evidence_type: ["technical_blog"]
  evidence_basis: "raw_source_text"
  source_excerpt: "Claude Code v2.1.169 发布 Claude Code v2.1.169 发布 Claude Code v2.1.169 新增 `--safe-mode` 标志及环境变量，用于禁用所有自定义配置以排查问题；新增 `/cd` 命令，可在不破坏提示词缓存的情况下切换工作目录；新增 `disableBundledSkills` 设置隐藏内置技能。修复了企业 MCP 策略在重连、IDE 配置及首次会话中不被强制的问题，以及 m..."
  missing_fields: ["delivery_model"]

signal_owner: "GitHub"

frontend:
  displayTitle: "Claude Code v2.1.169 发布"
  sourceLinks:
    - "https://github.com/anthropics/claude-code/releases/tag/v2.1.169"
---

# Claude Code v2.1.169 发布

## 新闻事实

Claude Code v2.1.169 新增 `--safe-mode` 标志及环境变量，用于禁用所有自定义配置以排查问题；新增 `/cd` 命令，可在不破坏提示词缓存的情况下切换工作目录；新增 `disableBundledSkills` 设置隐藏内置技能。修复了企业 MCP 策略在重连、IDE 配置及首次会话中不被强制的问题，以及 macOS 用户每轮约 30-50ms 的 UI 卡顿、Windows 下 `claude -p`...

## 原文要点

- 原文未提供更多可拆分事实点，需以可见原文片段核对。

## 价值描述

GitHub 的产品信号可用于观察 AI 能力是否正在进入更具体的工具、平台或工作流入口。

## 可见原文片段

Claude Code v2.1.169 新增 `--safe-mode` 标志及环境变量，用于禁用所有自定义配置以排查问题；新增 `/cd` 命令，可在不破坏提示词缓存的情况下切换工作目录；新增 `disableBundledSkills` 设置隐藏内置技能。修复了企业 MCP 策略在重连、IDE 配置及首次会话中不被强制的问题，以及 macOS 用户每轮约 30-50ms 的 UI 卡顿、Windows 下 `claude -p`...

## 证据边界

没有具体客户或真实企业案例
