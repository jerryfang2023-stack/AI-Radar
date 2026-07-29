---
id: SIG-20260718-A25
type: signal_card
signal_type: product_service
title: "OpenAI 回应 GPT-5.6 Sol 意外删除用户文件：已采取措施降低风险"
date: 2026-07-18
status: published
source_title: "OpenAI 回应 GPT-5.6 Sol 意外删除用户文件：已采取措施降低风险"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-18T02:44:14.529Z
updated_at: 2026-07-18T02:44:14.529Z

raw_refs: ["R-102"]
pool_refs: ["P-102"]
primary_raw:
  raw_ref: R-102
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-18/r-102-openai-回应-gpt-5-6-sol-意外删除用户文件-已采取措施降低风险.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-18/r-102-openai-回应-gpt-5-6-sol-意外删除用户文件-已采取措施降低风险.json"
  source_url: "https://www.ithome.com/0/978/347.htm"
  full_text_hash: "bd95b5535205be27"
  source_level: B
  extraction_quality: medium
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - emerging_pool
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 5

formal_tags:
  track: ["track-ai-coding", "track-enterprise-data", "track-ai-infra", "track-ai-governance"]
  function: ["function-engineering"]
  scenario: ["scenario-knowledge-base", "scenario-agent-governance"]
  customer: ["customer-developer-team"]
  evidence: ["evidence-customer-metric", "evidence-product-launch"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["sales_team", "engineering_team", "it_security_team"]
  team_or_function: ["sales", "engineering", "it_security"]
  specific_task: ["sales_lead_research", "internal_tool_building"]
  business_action: ["customer_deployment", "product_launch", "governance_requirement"]
  product_form: []
  delivery_model: ["enterprise_subscription"]
  pain_or_constraint: ["permission_boundary", "security_compliance"]
  adoption_evidence: ["customer_metric", "deployment_scale"]
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "6 Sol AI 意外删除用户文件：已采取措施降低风险 - IT之家 首页 IT圈 最会买 设置 日夜间 随系统 浅色 深色 主题色 黑色 投稿 订阅 RSS订阅 收藏IT之家 软媒应用 App客户端 要知App 软媒魔方 业界 手机 电脑 测评 视频 AI 苹果 iPhone 鸿蒙 软件 智车 数码 学院 游戏 直播 5G 微软 Win10 Win11 专题 搜索 首页 > 智能时代 > 人工智能 OpenAI 回应 GPT-5."
  missing_fields: ["product_form"]

signal_owner: "OpenAI 回应 GPT"

frontend:
  displayTitle: "OpenAI 回应 GPT-5.6 Sol 意外删除用户文件：已采取措施降低风险"
  sourceLinks:
    - "https://www.ithome.com/0/978/347.htm"
---

# OpenAI 回应 GPT-5.6 Sol 意外删除用户文件：已采取措施降低风险

## 新闻事实

OpenAI 核心产品负责人蒂博·索蒂奥回应 GPT-5.6 Sol 擅自删除用户文件事件，称该问题通常发生在"完全访问"模式下且 Codex 无沙盒保护运行时。

## 原文要点

- AI 本意是覆盖环境变量 $HOME 定义临时目录，但操作失误导致删除了整个 $HOME 目录。
- OpenAI 核心产品负责人蒂博 · 索蒂奥（Tibo Sottiaux）于 7 月 16 日在 X 平台发布推文， 回应 GPT-5.6 Sol 会擅自删除用户文件问题。
- 多名用户反馈在使用 OpenAI 最强模型 GPT-5.6 Sol 后， 该模型没有事先询问便擅自删除了文件、数据，甚至整个数据库 。
- 以明确告知用户在授予该权限时可能面临的操作影响，并引导用户切换至更安全的权限模式。

## 价值描述

OpenAI 正在更新"完全访问模式"下的开发者提示信息，并加固额外防护措施以防止此类误操作。

## 可见原文片段

索蒂奥在推文中回应表示，这种情况通常发生在“完全访问”模式下，且 Codex 在无沙盒保护的情况下运行，包括未启用自动审核。

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
