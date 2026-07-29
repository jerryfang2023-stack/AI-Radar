---
id: SIG-20260617-A16
type: signal_card
signal_type: case
title: "M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码"
date: 2026-06-17
status: published
source_title: "M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码"
asset_level: frontstage
evidence_gate: core_evidence_passed
fact_draft_gate: passed
created_at: 2026-06-17T01:51:13.717Z
updated_at: 2026-06-17T01:51:13.717Z

raw_refs: ["R-050"]
pool_refs: ["P-046"]
primary_raw:
  raw_ref: R-050
  raw_archive: "01-SiteV2/content/01-raw/originals/2026-06-17/r-050-m365-copilot-曝最高严重性漏洞-攻击者可窃取-2fa-码.md"
  raw_json: "01-SiteV2/content/01-raw/originals/2026-06-17/r-050-m365-copilot-曝最高严重性漏洞-攻击者可窃取-2fa-码.json"
  source_url: "https://arstechnica.com/security/2026/06/critical-copilot-vulnerability-allowed-hackers-to-seal-2fa-code-from-users"
  full_text_hash: "1ca8297c6694c3c1"
  source_level: A
  extraction_quality: high
  has_full_text: true
  pool_routes:
    - core_pool
  raw_qc_decision: allow
  importance_type: important_case
  importance_score: 5

formal_tags:
  track: ["track-ai-governance"]
  function: []
  scenario: ["scenario-agent-governance"]
  customer: []
  evidence: ["evidence-customer-adoption"]
opportunity_signals:
  schema_version: "opportunity-signals-v1"
  buyer_or_user: []
  team_or_function: []
  specific_task: []
  business_action: ["customer_deployment", "product_launch", "governance_requirement"]
  product_form: ["copilot"]
  delivery_model: []
  pain_or_constraint: ["hallucination_risk", "security_compliance"]
  adoption_evidence: ["deployment_scale"]
  source_evidence_type: ["first_party_announcement", "business_media"]
  evidence_basis: "raw_source_text"
  source_excerpt: "M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码 M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码 微软修复了 M365 Copilot 平台一个\"最高严重性\"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在\"思考\"阶段后生效，攻..."
  missing_fields: ["buyer_or_user", "specific_task", "delivery_model"]

signal_owner: "Microsoft"

frontend:
  displayTitle: "M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码"
  sourceLinks:
    - "https://arstechnica.com/security/2026/06/critical-copilot-vulnerability-allowed-hackers-to-seal-2fa-code-from-users"
---

# M365 Copilot 曝最高严重性漏洞，攻击者可窃取 2FA 码

## 新闻事实

微软修复了 M365 Copilot 平台一个"最高严重性"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在"思考"阶段后生效，攻击者利用流式响应先渲染 `<img>` 标签的特性提前触发 HTTP 请求，绕过输出封装限制，并通过 Bing 跳板绕过可信站点限制，窃取 ...

## 原文要点

- 原文未提供更多可拆分事实点，需以可见原文片段核对。

## 价值描述

Microsoft 的案例信号可用于观察 AI 是否已经进入 模型部署和算力调用，以及后续是否出现客户、流程或结果指标。

## 可见原文片段

微软修复了 M365 Copilot 平台一个"最高严重性"漏洞。安全公司 Varonis 披露，攻击者通过参数到提示注入，向目标发送含恶意 URL 的邮件，利用 URL 中 `q` 参数嵌入指令，诱使 Copilot 搜索用户邮件并提取标题嵌入图片 URL。由于安全护栏仅在"思考"阶段后生效，攻击者利用流式响应先渲染 `<img>` 标签的特性提前触发 HTTP 请求，绕过输出封装限制，并通过 Bing 跳板绕过可信站点限制，窃取 ...

## 证据边界

none
