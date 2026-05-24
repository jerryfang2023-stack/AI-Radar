---
id: OPN-FB-20260522-10
type: opinion_intake
title: "Dan Shipper：MCP 设计要少而准，才能服务 Agent"
date: 2026-05-22
status: draft
created_at: 2026-05-22T05:10:29.416Z
updated_at: 2026-05-22T05:10:29.416Z
person_name: "Dan Shipper"
column_name: 前沿观点
source_level: C
source_volatility: high
capture_scope: x_full_visible_text
evidence_level: community_signal
fact_draft_gate: passed
frontend_copy_gate: pending
cardcopy_gate: skipped_intake_translation_pending
publish_status: internal_archive
source_url: "https://x.com/danshipper/status/2057122805657821240"
source_name: "follow-builders / X / Dan Shipper"
original_date: "2026-05-20"
theme: "technical-iteration-signal"
keyword_group: "technical-iteration-signal"
opinion_tier: archive
display_lane: archive_only
selection_reason: "人工指定侧栏观点，具备当日前台参照价值。 已尝试补译但未成功，暂不进入前台。"
opinion_rating_score: 40
opinion_rating_version: 2026-05-22-v1

formal_tags:
  track: ["track-ai-agent", "track-ai-coding", "track-enterprise-workflow", "track-enterprise-data"]
  function: []
  scenario: ["scenario-frontier-opinion"]
  customer: ["customer-developer-team", "customer-enterprise"]
  evidence: ["evidence-frontier-opinion"]
  stage: ["stage-watch"]
  region: []
  source: ["source-social"]
  opinion: ["opinion-ai-coding"]
intake_suggested_tier: sidebar
translation_status: translated
translation_method: existing
opinion_capture:
  capture_scope: x_full_visible_text
---

# Dan Shipper：MCP 设计要少而准，才能服务 Agent

## 观点底稿

- 谁：Dan Shipper
- 当时身份：暂无公开信息
- 在哪里说：follow-builders / X / Dan Shipper，https://x.com/danshipper/status/2057122805657821240
- 原文说了什么：Anthropic just acquired developer tool startup @StainlessAPI, whose biggest customers were OpenAI and Google. Back in October, I had Stainless CEO and founder Alex Rattray (@RattrayAlex) on AI & I to talk about MCP servers and the unglamorous plumbing that makes AI agents actually work. (Disclosure: I’m a small investor in the company.) After Monday's news, the conversation lands differently—in it, Alex essentially walks me through the design thinking for building APIs, SDKs, and MCP servers that Anthropic paid a reported $300 million for. On @every's AI & I, we get into MCP and the future of the AI-native internet. Highlights include: - Design MCP servers to be lean and precise. Alex's best practices for building reliable MCP servers start with keeping the toolset small, giving each tool a precise name and description, and minimizing the inputs and outputs the model has to handle. At Stainless, they also often add a JSON filter on top to strip out unnecessary data. - Make complex APIs manageable with dynamic mode. To solve the problem of how an AI figures out which tool to use in larger APIs, Stainless switches to "dynamic mode," where the model gets only three tools: List the endpoints, pick one and learn about it, and then execute it. - MCP servers as business copilots. At Stainless, Alex uses MCP servers to connect tools like @NotionHQ and @HubSpot, so he can ask questions like, "Which customers signed up last week?" The system queries multiple databases and returns a summary that would've otherwise taken multiple logins and searches. - Create a "brain" for your comp
- 事实主张是否需要补证：需要。观点卡只能证明这句话出现过，不能单独证明公司动作、客户采用、收入、融资或市场规模。

## 人物 / Title / 原文

- 人物：Dan Shipper
- Title：暂无公开信息
- 原文：[查看原文](https://x.com/danshipper/status/2057122805657821240)

## 原文摘录

Anthropic just acquired developer tool startup @StainlessAPI, whose biggest customers were OpenAI and Google. Back in October, I had Stainless CEO and founder Alex Rattray (@RattrayAlex) on AI & I to talk about MCP servers and the unglamorous plumbing that makes AI agents actually work. (Disclosure: I’m a small investor in the company.) After Monday's news, the conversation lands differently—in it, Alex essentially walks me through the design thinking for building APIs, SDKs, and MCP servers that Anthropic paid a reported $300 million for. On @every's AI & I, we get into MCP and the future of the AI-native internet. Highlights include: - Design MCP servers to be lean and precise. Alex's best practices for building reliable MCP servers start with keeping the toolset small, giving each tool a precise name and description, and minimizing the inputs and outputs the model has to handle. At St

## 观澜解读

这条观点把 Agent 落地的难点放在 API、SDK 和 MCP 的工具设计上，可作为开发者基础设施信号的侧栏参照。

## 关联资产

- 关联商业信号：暂无公开信息
- 关联变化 / 场景候选：暂无公开信息
- 关联今日观察：暂无公开信息

## 可信边界

follow-builders 是观点发现入口。X / 社区来源波动高，本卡只作为前沿观点线索，不作为公司动作、客户采用、收入、融资或市场规模的事实主证据。
