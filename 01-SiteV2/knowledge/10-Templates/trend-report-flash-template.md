---
asset_type: trend_report
kind: flash
id: TRD-FLASH-YYYYMMDD-XX
title:
slug:
date: YYYY-MM-DD
status: watching
front_status: visible
follow_up_window: 30d
trigger: urgent_trend_candidate
urgent_candidate_id: UTCAND-YYYYMMDD-XX
upgrade_target:
upgraded_from:
source_count:
primary_source_count:
has_boundary_note:
source_tiers:
related_signal_ids:
related_trend_card_ids:
related_case_card_ids:
related_opinion_card_ids:
formal_tags:
  track: []
  function: []
  scenario: []
  customer: []
  evidence: []
  stage: []
  region: []
  source: []
  opinion: []
---

# {{title}}

## 写作要求

趋势快报是突然升温方向的临时深读，不是新闻快讯，也不是正式深度报告的缩水版。

- 篇幅：2000-3500 中文字。
- 来源：至少 3 个独立来源。
- 一手 / S/A 来源：至少 1 个。
- 建议写明风险边界或信息缺口。
- 建议写清后续继续看什么。
- 不能只靠 AI HOT、X、HN、Reddit 或 builders 观点。
- builders 观点只能作为判断参照，不能作为事实主证据。
- 前台只显示 `watching` 和 `upgraded` 两种状态。
- 后台可保留 `archived` / `revised`，但第一版前台不展示。

## 场景开头

从一个具体人、具体岗位、具体组织或具体冲突切入。

不要写成：

- 今天某某公司发布了某某产品。
- 最近某某赛道非常火。
- AI 正在改变某某行业。

推荐写成：

```text
一个企业 IT 负责人今天真正关心的，不是某个模型参数又涨了，而是 Agent 开始接触内部系统之后，谁来负责权限、回滚和事故记录。
```

## 今天为什么突然升温

说明触发事件和多源信号。

必须写清楚：

- 发生了什么。
- 24-48 小时内有哪些信号共同指向同一方向。
- 哪些来源是一手来源或高质量来源。
- 这些信号不是同一篇稿子的转载链。

## 它可能改变谁的流程

写客户、场景、预算、岗位、交付链。

必须回答：

- 谁最先感受到变化。
- 哪段流程会先被影响。
- 钱可能从哪里来。
- 采购、试点或使用的阻力在哪里。

## 市面上谁在动

写同类产品、竞品、案例、客户采用、融资、招投标、合作或监管。

公司只作为证据，不作为标题结论。

## 技术路线的商业含义

只解释商业含义，不写技术教程。

必须回答：

- 新技术路线为什么让这件事现在可能发生。
- 它改变成本、交付、集成、权限、数据、体验或责任边界中的哪一项。
- 它是否会改变客户付费理由。

## 反证与信息缺口

必须写。

可包含：

- 客户是否只试用不续费。
- 是否缺真实付费数据。
- 是否缺同类案例。
- 是否依赖大厂平台。
- 是否存在数据、合规、安全或交付成本问题。

## 30 天后看什么

列出 3-5 个观察变量。

示例：

- 是否出现更多客户部署。
- 是否出现清晰定价。
- 是否有竞品跟进。
- 是否出现监管、事故或客户拒绝信号。
- builders / 投资人 / 企业客户讨论是否持续。

## 来源与事实

每条来源必须包含：

| 来源 | 等级 | 原始链接 | 增量事实 | 支撑段落 |
|---|---|---|---|---|
|  | S/A/B/C/D |  |  |  |
