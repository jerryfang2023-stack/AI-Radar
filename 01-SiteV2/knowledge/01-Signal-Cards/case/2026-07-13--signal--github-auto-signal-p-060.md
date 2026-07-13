---
id: SIG-20260713-A13
type: signal_card
signal_type: case
title: "GitHub 使用秘密扫描，在九个月内清零安全告警积压"
date: 2026-07-13
status: published
source_title: "How GitHub used secret scanning to reach inbox zero"
asset_level: frontstage
title_zh: "GitHub 使用秘密扫描，在九个月内清零安全告警积压"
title_translation_status: translated
title_translation_method: raw_or_source_title_translation_db
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-13T08:26:47.889Z
updated_at: 2026-07-13T08:26:47.889Z

raw_refs: ["R-060"]
pool_refs: ["P-060"]
primary_raw:
  raw_ref: R-060
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-13/r-060-how-github-used-secret-scanning-to-reach-inbox-zero.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-13/r-060-how-github-used-secret-scanning-to-reach-inbox-zero.json"
  source_url: "https://github.blog/security/application-security/how-github-used-secret-scanning-to-reach-inbox-zero/"
  full_text_hash: "a62d7d248c11ddfa"
  source_level: S
  extraction_quality: high
  has_full_text: true
  evidence_strength: rich_evidence
  pool_routes:
    - core_pool
    - emerging_pool
  raw_qc_decision: allow
  importance_type: important_case
  importance_score: 5

formal_tags:
  track: ["track-ai-coding", "track-ai-governance"]
  function: ["function-engineering"]
  scenario: ["scenario-agent-governance"]
  customer: ["customer-developer-team"]
  evidence: ["evidence-customer-adoption"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["engineering_team"]
  team_or_function: ["engineering"]
  specific_task: ["internal_tool_building"]
  business_action: ["product_launch", "open_source_release", "governance_requirement"]
  product_form: ["developer_tool"]
  delivery_model: []
  pain_or_constraint: ["security_compliance"]
  adoption_evidence: []
  source_evidence_type: ["technical_blog"]
  evidence_basis: "raw_source_text"
  source_excerpt: "[{\"type\":\"workflow_change\",\"text\":\"GitHub had 20,000+ secret scanning alerts across 15,000 repositories."
  missing_fields: ["adoption_evidence", "delivery_model"]

signal_owner: "GitHub"

frontend:
  displayTitle: "GitHub 使用秘密扫描，在九个月内清零安全告警积压"
  sourceLinks:
    - "https://github.blog/security/application-security/how-github-used-secret-scanning-to-reach-inbox-zero/"
---

# GitHub 使用秘密扫描，在九个月内清零安全告警积压

## 新闻事实

GitHub 在 1.5 万多个代码库中发现超过 2 万条秘密扫描告警，并在九个月内清零未处理告警。

## 原文要点

- 原始来源标题显示：GitHub 使用秘密扫描，在九个月内清零安全告警积压。

## 价值描述

GitHub 的案例为企业评估 AI 在真实流程中的部署方式、成本边界和结果指标提供了可核查样本。

## 可见原文片段

GitHub had 20,000+ secret scanning alerts across 15,000 repositories. Here's how we separated signal from noise, built remediation workflows, and reached inbox zero in nine months. The post How GitHub used secret scanning to reach inbox zero appeared first on The GitHub Blog. ]]>

## 证据边界

none
