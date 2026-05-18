---
title: V2 Current Rule Overrides
date: 2026-05-14
status: current
encoding: UTF-8
---

# V2 当前规则覆盖

本文件只记录当前覆盖规则。旧栏目名、旧路径和旧生产漏斗不再生效。

## 前台

```text
今日观察 / 商业信号 / 趋势追踪 / 商业内参
```

## 路径

- `daily.html`
- `daily-detail.html`
- `signals.html`
- `signal-detail.html`
- `trend-tracking.html`
- `trend-detail.html`
- `brief.html`

## 内容链路

```text
Raw -> Pool -> Change Cards / Case Cards / Opinion Cards
-> Change Clusters
-> Daily Observation
-> Trend Reports
-> Business Briefs
```

## 质量要求

- Raw 常规 80-150 条；降级日 50-80 条并写明原因。
- Pool 常规 20-40 条。
- 今日观察必须是一篇自然语言长文，不是候选卡片拼接。
- 变化卡、案例卡、观点卡必须写入 `01-SiteV2/knowledge/`。
- 商业信号前台材料写入 `01-SiteV2/content/04-business-signals/`。
- 趋势追踪报告写入 `01-SiteV2/content/06-trend-reports/`。
- 商业内参写入 `01-SiteV2/content/07-business-briefs/`。
- 趋势追踪证据不足时写“暂无公开信息”或“暂未监测到同类案例”，不得留空。
- 商业内参是周期刊物，不照搬每日观察。

## 降级与后台

- The Point 只作为观点参照和观点资产。
- 旧机会栏目只作为机会判断能力，不作为一级导航。
- Priority Engine 后台化。
- Tags 用于筛选、搜索和关系网络，不做一级栏目。
