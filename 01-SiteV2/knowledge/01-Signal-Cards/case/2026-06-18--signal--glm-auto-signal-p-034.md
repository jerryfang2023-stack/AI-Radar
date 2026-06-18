---
id: SIG-20260618-A04
type: signal_card
signal_type: case
title: "GLM-5.2：为长周期任务而生"
date: 2026-06-18
status: published
source_title: "GLM-5.2：为长周期任务而生"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-06-18T06:41:09.947Z
updated_at: 2026-06-18T06:41:09.947Z

raw_refs: ["R-034"]
pool_refs: ["P-034"]
primary_raw:
  raw_ref: R-034
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-06-18/r-034-glm-5-2-为长周期任务而生.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-06-18/r-034-glm-5-2-为长周期任务而生.json"
  source_url: "https://huggingface.co/blog/zai-org/glm-52-blog"
  full_text_hash: "21e4e0033af8dc7f"
  source_level: B
  extraction_quality: high
  has_full_text: true
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_vertical_solution
  importance_score: 5

formal_tags:
  track: ["track-ai-agent"]
  function: []
  scenario: []
  customer: []
  evidence: ["evidence-customer-metric", "evidence-customer-adoption"]
  stage: []
  region: []
  source: ["source-industry-data"]

signal_owner: "GLM"

frontend:
  displayTitle: "GLM-5.2：为长周期任务而生"
  sourceLinks:
    - "https://huggingface.co/blog/zai-org/glm-52-blog"
---

# GLM-5.2：为长周期任务而生

## 新闻事实

GLM-5.2 发布，支持 1M token 上下文，采用 IndexShare 架构--每 4 个稀疏注意力层共用一个轻量索引器，将 1M 上下文下每 token FLOPs 降低 2.9 倍；MTP 层改进使推测解码接受长度提升 20%。长周期编码基准上，FrontierSWE 落后 Opus 4.8 仅 1%、领先 GPT-5.5 1%；PostTrainBench 仅次于 Opus 4.8；SWE-Marathon 落后 Op...

## 原文要点

- 原文未提供更多可拆分事实点，需以可见原文片段核对。

## 价值描述

GLM 的案例信号可用于观察 AI 是否已经进入 模型部署和算力调用，以及后续是否出现客户、流程或结果指标。

## 可见原文片段

GLM-5.2 发布，支持 1M token 上下文，采用 IndexShare 架构--每 4 个稀疏注意力层共用一个轻量索引器，将 1M 上下文下每 token FLOPs 降低 2.9 倍；MTP 层改进使推测解码接受长度提升 20%。长周期编码基准上，FrontierSWE 落后 Opus 4.8 仅 1%、领先 GPT-5.5 1%；PostTrainBench 仅次于 Opus 4.8；SWE-Marathon 落后 Op...

## 证据边界

没有具体客户或真实企业案例
