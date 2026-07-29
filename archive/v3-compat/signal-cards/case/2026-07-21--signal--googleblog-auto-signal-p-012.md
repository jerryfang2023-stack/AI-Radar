---
id: SIG-20260721-A21
type: signal_card
signal_type: case
title: "Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片"
date: 2026-07-21
status: published
source_title: "Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片"
asset_level: frontstage
title_translation_status: not_required
title_translation_method: source_title
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-07-21T01:28:03.543Z
updated_at: 2026-07-21T01:28:03.543Z

raw_refs: ["R-012"]
pool_refs: ["P-012"]
primary_raw:
  raw_ref: R-012
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-07-21/r-012-ray-2-55-正式支持-google-cloud-tpu-通过-kuberay-自动编排多主机切片.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-07-21/r-012-ray-2-55-正式支持-google-cloud-tpu-通过-kuberay-自动编排多主机切片.json"
  source_url: "https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations"
  full_text_hash: "f047ea551bc9aa94"
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
  track: ["track-ai-coding"]
  function: ["function-engineering"]
  scenario: []
  customer: ["customer-developer-team"]
  evidence: ["evidence-customer-adoption"]

opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: ["engineering_team"]
  team_or_function: ["engineering"]
  specific_task: ["internal_tool_building"]
  business_action: ["customer_deployment"]
  product_form: ["api"]
  delivery_model: ["api_usage_based"]
  pain_or_constraint: []
  adoption_evidence: []
  source_evidence_type: ["technical_blog", "first_party_announcement"]
  evidence_basis: "raw_source_text"
  source_excerpt: "Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片 Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片 Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。"
  missing_fields: ["adoption_evidence"]

signal_owner: "Googleblog"

frontend:
  displayTitle: "Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片"
  sourceLinks:
    - "https://developers.googleblog.com/run-ray-on-tpu-part-1-the-foundations"
---

# Ray 2.55 正式支持 Google Cloud TPU，通过 KubeRay 自动编排多主机切片

## 新闻事实

Ray 2.55 首次为 Google Cloud TPU 提供一等支持，开发者可通过 Ray 任务与 Actor API 在 TPU 上运行分布式 Python 负载。

## 原文要点

- 原文称，The task-and-actor model, a JaxTrainer, the same Ray Serve deployment just pointed at TPUs orchestrated by Google Kubernetes Engine (GKE).

## 价值描述

Googleblog 的案例为企业评估 AI 在真实流程中的部署方式、成本边界和结果指标提供了可核查样本。

## 可见原文片段

Run Ray on TPU, Part 1: The foundations JULY 20, 2026 Ivan Nardini AI Developer Relations Share Facebook Twitter LinkedIn Mail TL;DR : If you already scale Python with Ray on GPUs, your code can now run on TPU (Tensor Processing Unit, Google's AI accelerator chip) with fully supported official APIs you already know.

## 证据边界

证据边界：本卡只使用已保留的 Raw / Pool 原文标题、摘录和来源链接。
