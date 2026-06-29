---
title: WaveSight Content
date: 2026-06-29
status: active-content-pipeline
type: v3-content-pipeline
encoding: UTF-8
---

# 01-SiteV2/content｜观澜 AI 生产过程库

本目录承载当前 V3.3 生产过程：Raw 原文、Pool 证据、商业信号索引、First-Line Viewpoints 数据、Community Intelligence 数据、周度雷达内容、可执行配置和轻量数据库。

当前规则以 `context/07-v3-intelligence-generation-rules.md` 为准。旧内容型生产路线只保留为历史档案，不作为当前任务、门禁、发布或网站运营依据。

## 当前保留结构

| 目录 | 用途 | 当前线程 |
|---|---|---|
| `01-raw/` | Raw 监测候选和本地原文档案 | Business Signals |
| `01-raw/originals/` | 每日 Raw 原文快照 | Business Signals |
| `02-pool/` | Pool 候选池、入池理由和淘汰风险 | Business Signals |
| `04-business-signals/signals/` | 前台商业信号流索引，包含 product_service / funding / case 三类 | Business Signals |
| `07-points/` | First-Line Viewpoints skill 产物 | First-Line Viewpoints |
| `08-report/` | 周度 AI 商业变化雷达内容 | Weekly Radar |
| `11-databases/` | 可执行配置、关键词、主题、翻译表和轻量数据库索引 | automation / data |

已存在的旧内容目录只作为历史档案查看；新的每日生产不得向旧路线写入，不得把旧路线作为当前成功标准。

## Business Signals 边界

Business Signals 负责 Raw 采集、Pool 筛选、Signal Card 资产生成、前台 Top10 选择、关系图和趋势候选输入。

输出位置：

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
01-SiteV2/content/04-business-signals/signals/
01-SiteV2/knowledge/01-Signal-Cards/
agent-workflow/reports/
```

规则：

- Raw 只收集外部材料，不写判断。
- Pool 只筛选证据，不替代原文。
- Signal Card 类型只能是 `product_service`、`funding`、`case`。
- Signal Card 资产应覆盖所有合格 Core Pool；前台只从这些资产中选出当日 Top10。
- 前台标题必须来自原始来源标题的中文翻译，不得使用模板化生成标题、搜索词、公司名拼接或旧后台字段兜底。

## 独立栏目边界

- First-Line Viewpoints 使用 builders / follow-builders 数据链路，不作为 Business Signals 的事实证据。
- Community Intelligence 使用本地登录态采集链路，默认是需求信号和社群线索，不直接成为 Business Signals 事实。
- Weekly Radar 使用当前商业信号与机会雷达数据做周度复盘，不改变每日 Business Signals 的证据门禁。

## 质量边界

- Business Signals 只能使用 eligible `core_pool` 作为正式 Card 的事实主证据。
- 英文前台标题、摘要或详情必须翻译为中文展示。
- 乱码、二进制污染、模板化标题、搜索参数污染、旧字段兜底都属于阻塞问题。
- 旧内容型路线、旧页面、旧模板、旧文案门禁不得作为当前生产依赖。
