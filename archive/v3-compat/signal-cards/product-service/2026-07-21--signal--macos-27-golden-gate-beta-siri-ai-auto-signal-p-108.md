---
id: SIG-20260721-A33
type: signal_card
signal_type: product_service
title: "macOS 27 Golden Gate Beta 隐藏Siri AI内容创作功能"
date: 2026-07-21
status: published
source_title: "macOS 27 Golden Gate Beta 隐藏Siri AI内容创作功能"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-21T01:28:03.543Z
updated_at: 2026-07-21T01:28:03.543Z

raw_refs: ["R-108"]
pool_refs: ["P-108"]
primary_raw:
  raw_ref: R-108
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-21/r-108-macos-27-golden-gate-beta-隐藏siri-ai内容创作功能.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-21/r-108-macos-27-golden-gate-beta-隐藏siri-ai内容创作功能.json"
  source_url: "https://www.ithome.com/0/979/280.htm"
  full_text_hash: "a3e759efba872ff2"
  source_level: B
  extraction_quality: low
  has_full_text: true
  evidence_strength: source_backed_event
  pool_routes:
    - index_only
  raw_qc_decision: allow
  importance_type: important_product_or_service
  importance_score: 4

formal_tags:
  track: []
  function: []
  scenario: []
  customer: []
  evidence: ["evidence-product-launch"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: []
  team_or_function: []
  specific_task: []
  business_action: ["product_launch"]
  product_form: []
  delivery_model: []
  pain_or_constraint: ["evaluation_gap"]
  adoption_evidence: ["deployment_scale"]
  source_evidence_type: []
  evidence_basis: "raw_source_text"
  source_excerpt: "IT之家 7 月 21 日消息，科技媒体 AppleInsider 昨日（7 月 20 日）发布博文，报道称在 macOS 27 Golden Gate Beta 更新中， 苹果正在测试隐藏 AI 功能，让用户调用 Siri 内容创作。"
  missing_fields: ["buyer_or_user", "specific_task", "product_form", "delivery_model"]

signal_owner: "macOS 27 Golden Gate Beta 隐藏Siri AI内容创作功能"

frontend:
  displayTitle: "macOS 27 Golden Gate Beta 隐藏Siri AI内容创作功能"
  sourceLinks:
    - "https://www.ithome.com/0/979/280.htm"
---

# macOS 27 Golden Gate Beta 隐藏Siri AI内容创作功能

## 新闻事实

macOS 27 Golden Gate Beta中隐藏了一项AI功能，用户选中文本后会出现Siri AI图标，点击可弹出包含校对、重写（支持友好/专业/简洁三种风格）等4种选项的菜单。

## 原文要点

- 该功能目前尚未完善，图标最长可能需等待10秒才出现，用户需通过终端命令手动启用。
- 触发方式方面，该媒体测试指出用户选中文本后，屏幕上会出现一个微型 Siri AI 图标，点击图标后，会弹出一个精简菜单。
- 该媒体测试表明该功能目前尚未完善，最长可能需等待 10 秒才会出现 Siri AI 图标。
- IT之家援引博文介绍，在跳出的菜单中共有以下 4 种选项： 校对（Proofread） 重写（Rewrite）：展开选项包括友好（Friendly）、专业（Professional）、简洁（Concise）三种风格。

## 价值描述

IT之家 7 月 21 日消息，科技媒体 AppleInsider 昨日（7 月 20 日）发布博文，报道称在 macOS 27 Golden Gate Beta 更新中， 苹果正在测试隐藏 AI 功能，让用户调用 Siri 内容创作。

## 可见原文片段

） 使用 Siri 编辑（Edit with Siri） 用户如果想要启用此隐藏功能，请打开“终端”App，然后按顺序粘贴以下两条命令： sudo mkdir -p /Library/Preferences/FeatureFlags/Domain && \ sudo defaults write /Library/Preferences/FeatureFlags/Domain/WritingTools LightweightUI_macOS -dict Enabled -bool true 在重启 Mac 设备后，用户会看到相关选项。

## 证据边界

证据边界：缺失项作为内部复核线索保留；公开判断只采用原文标题、摘录和来源链接。
