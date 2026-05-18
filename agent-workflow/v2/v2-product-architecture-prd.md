---
title: V2 产品架构当前摘要
date: 2026-05-14
status: current
encoding: UTF-8
---

# V2 产品架构当前摘要

本文件替代旧 V2 PRD，保留当前可继承口径。旧版中关于 `今日观察 / 商业信号 / 机会判断`、旧 精选变化卡 漏斗和 `旧机会相关路径` 路径的内容不再生效。

## 产品定位

观澜AI是面向商业决策者的 AI 机会判断系统。

它不是新闻站，也不是工具榜。它要做的是：从 AI 变化中筛出商业信号，解释原因、影响、趋势、同类产品、客户需求和机会边界。

## 前台结构

```text
今日观察 / 商业信号 / 趋势追踪 / 商业内参
```

| 栏目 | 用户任务 | 主要内容 |
|---|---|---|
| 今日观察 | 今天该看什么，为什么 | 当日市场综述、精选变化、观点露出、风险边界 |
| 商业信号 | 哪些变化值得进入判断资产 | 变化卡、案例卡、观点卡、来源和关联 |
| 趋势追踪 | 哪些方向正在形成连续趋势 | 深度趋势报告、变化簇、趋势卡、机会判断 |
| 商业内参 | 周期内哪些判断需要重新融合 | 周刊 / 半月刊 / 月刊 / 专题刊物 |

## 内容生产链路

```text
Raw -> Pool
-> Change Cards / Case Cards / Opinion Cards
-> Change Clusters
-> Daily Observation
-> Trend Reports
-> Business Briefs
```

六个自动化线程：

1. `daily-monitor-router`
2. `asset-card-generator`
3. `daily-observation-writer`
4. `case-signal-researcher`
5. `trend-report-writer`
6. `brief-periodical-writer`

## 当前目录

- `01-SiteV2/content/03-daily-observation/`
- `01-SiteV2/content/04-business-signals/`
- `01-SiteV2/content/05-case-research/`
- `01-SiteV2/content/06-trend-reports/`
- `01-SiteV2/content/07-business-briefs/`
- `01-SiteV2/knowledge/01-Change-Cards/`
- `01-SiteV2/knowledge/02-Case-Cards/`
- `01-SiteV2/knowledge/03-Opinion-Cards/`
- `01-SiteV2/knowledge/04-Trend-Cards/`
- `01-SiteV2/knowledge/05-Change-Clusters/`

## 当前路由

- `trend-tracking.html`
- `trend-detail.html`

旧 旧机会相关路径 不再作为当前 V2 路径。

## 边界

- 不恢复旧 `机会判断` 一级导航。
- 不恢复旧 精选变化卡 / 变化卡 生产漏斗。
- 不把商业内参做成结构化页面。
- 不把趋势追踪做成卡片墙。
- 不把公司名写成机会判断标题；公司只作为案例、证据或来源。
