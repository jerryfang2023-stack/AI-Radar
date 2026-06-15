---
title: WaveSight Content
date: 2026-06-04
status: active-content-pipeline
type: v3-content-pipeline
encoding: UTF-8
---

# 01-SiteV2/content｜观澜 AI 内容生产与发布库

本目录承载观澜 AI V3 的每日生产过程：Raw 原文、Pool 候选、前台索引、观点索引、趋势报告和发布索引。它不是长期判断资产主库；长期可复用资产写入 `01-SiteV2/knowledge/`。

当前卡片与资产结构以 `context/07-card-asset-stage-model.md` 为准：前台先跑商业信号流和前沿观点流，变化、场景、趋势先在后台候选区积累，成熟后再升级为短专题、趋势追踪或内参材料。

## 1. 当前保留结构

| 目录 | 用途 | 主要线程 |
|---|---|---|
| `01-raw/` | Raw 广泛监测候选和本地原文档案 | guanlan-daily-monitor |
| `01-raw/originals/` | 每日 Raw 原文档案 | guanlan-daily-monitor |
| `02-pool/` | Pool 候选池、入池理由和淘汰风险 | guanlan-daily-monitor |
| `03-daily-observation/` | 今日观察长文 | daily-observation-writer |
| `04-business-signals/signals/` | 前台商业信号流索引，包含 product_service / funding / case 三类 | asset-card-generator / site sync |
| `05-frontier-opinions/` | 前沿观点流索引，保留原文或原文摘录与出处 | guanlan-daily-monitor / asset-card-generator |
| `06-asset-candidates/` | 后台轻量候选，不直接前台展示 | asset-card-generator |
| `06-asset-candidates/change/` | 变化候选 | asset-card-generator |
| `06-asset-candidates/scene/` | 场景候选与案例补全研究 | case-signal-researcher |
| `06-asset-candidates/trend/` | 趋势候选 / 变化簇候选 | trend-report-writer |
| `08-report/` | 周度商业变化雷达报告 | guanlan-weekly-business-change-radar |
| `08-trend-reports/` | 趋势追踪深度报告 | trend-report-writer |
| `09-business-briefs/` | 商业内参周期刊物 | brief-periodical-writer |
| `10-publication-index/` | 今日观察、趋势报告、商业内参等发布索引 | all writers |
| `11-databases/` | 可执行配置、关键词、主题和轻量数据库 | automation / data |

已清理的占位目录：`00-inbox/`、`07-change-topics/`、`12-distribution/`、`13-feedback/`。后续如确有稳定流程再重建，不保留空壳。

## 2. 自动化线程边界

### guanlan-daily-monitor

负责 Raw 广泛监测、Pool 筛选、来源覆盖、去重、主题分布、初筛，以及本地正文快照和关键摘录保存。

输出位置：

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

边界：

- AI HOT 是 M 级发现入口，不是事实主证据。
- follow-builders 进入前沿观点流或观点候选，不直接证明公司事实。
- Daily Monitor QC 未输出 `allow` 或明确范围的 `allow_with_degradation` 前，资产链、今日观察、商业信号、趋势报告和商业内参不得使用当日 Raw / Pool。

### guanlan-daily-assets-chain

负责从放行 Pool 生成前台商业信号、前沿观点和后台候选。

主要输出位置：

```text
01-SiteV2/knowledge/01-Signal-Cards/product-service/
01-SiteV2/knowledge/01-Signal-Cards/funding/
01-SiteV2/knowledge/01-Signal-Cards/case/
01-SiteV2/knowledge/03-Asset-Candidates/change/
01-SiteV2/knowledge/03-Asset-Candidates/scene/
01-SiteV2/knowledge/03-Asset-Candidates/trend/
01-SiteV2/content/04-business-signals/signals/
01-SiteV2/content/05-frontier-opinions/
01-SiteV2/content/06-asset-candidates/
```

观点卡生成后必须执行四档评级：

| 档位 | 内容层去向 | 前台 |
|---|---|---|
| `feature` | `content/05-frontier-opinions/` 当日索引 | 今日观察主推观点 |
| `sidebar` | `content/05-frontier-opinions/` 当日索引 | 商业信号页观点模块 |
| `archive` | 仅记录在索引和 knowledge | 不展示 |
| `discard` | 仅记录或后续清理 | 不展示 |

当前不做“单条材料生成正式变化判断”或“单条观点生成趋势判断”。变化、场景、趋势先积累候选，成熟后再升级。

### daily-observation-writer

今日观察基于 Raw 全量监测和 Pool / Card / Candidate 中的放行素材做主编选择：每天只选一个最有冲突和叙事价值的对象，不基于精选卡片小样本倒推，也不做每日行情综述。

文章本体输出位置：

```text
01-SiteV2/content/03-daily-observation/
```

首页摘要、栏目页摘要、卡片和发布索引不由 daily-observation-writer 直接撰写；需要前台展示时，走页面 / 文案流程或同步脚本生成。

### case-signal-researcher

触发式补全案例、场景、竞品、市场规模、客户需求、商业模式、风险与反证，不做全量日更。

### trend-report-writer

趋势追踪必须是深度报告或趋势快报，不是卡片聚合页。证据不足时输出 `no_report_decision`，不硬凑、不沉默。

### brief-periodical-writer

商业内参是周期刊物，基于周期内今日观察、商业信号、前沿观点、成熟变化、趋势报告和反馈重新融合判断。

## 3. 与 knowledge 的关系

```text
content/01-raw               -> 证据底座，不直接进入 knowledge
content/02-pool              -> 候选索引，不替代 Raw
content/03-daily-observation -> 发布文章
content/04-business-signals  -> 前台商业信号流索引
content/05-frontier-opinions -> 前台观点流索引
content/06-asset-candidates  -> 后台变化 / 场景 / 趋势候选
content/08-trend-reports     -> 趋势追踪报告
content/09-business-briefs   -> 商业内参刊物
knowledge/                   -> 长期判断资产主库
```

## 4. 质量边界

- 商业信号卡只能使用 eligible `core_pool` 作为事实主证据。
- 前沿观点卡必须保留原文或原文摘录，不用中文摘要替代原文。
- 前沿观点卡必须执行四档评级；未评级、评级冲突、`archive` 或 `discard` 不得进入前台。
- 变化候选需要材料积累、前后对比、商业变量和风险边界，单一材料不得升级为正式变化。
- 趋势候选需要多个变化、多个场景 / 案例和多类来源支撑，并写清信息缺口或后续观察变量，不能由单条新闻硬凑。
- 当前暂停使用前台文案规范与文案门禁；前台标题优先使用可追溯原文标题，英文标题 / 摘要 / 详情必须翻译为中文展示。
