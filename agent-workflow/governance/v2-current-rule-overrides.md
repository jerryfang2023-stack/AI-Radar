---
title: V2 Current Rule Overrides
date: 2026-05-10
task_id: WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
status: active
owner: workflow / pm / data
encoding: UTF-8
---

# V2 当前规则覆盖表

本文件用于清理历史冲突：当旧 PRD、旧派发单、旧 sprint 文档、V1 baseline、test-only 管线或早期产品文档与本文件冲突时，以本文件为准。

## 当前前台栏目

V2 当前前台主结构：

```text
今日要点 / 关键信号 / 机会解码 / 商业内参
```

旧口径处理：

- `Daily Brief / Signals / Opportunities / Trends` 作为历史名称参考，不作为新的页面命名默认值。
- `The Point` 不作为 V2 一级栏目，归入 `关键信号 > Builders 观点` 和各栏目观点校准模块。
- `Trends` 不作为 V2 一级栏目，作为趋势背景、热力输入和内参材料。
- `Scoring / Priorities` 不作为前台一级栏目，后台化为 Priority Engine。
- `Tags` 不作为一线栏目，作为搜索、筛选和关系网络能力。

## 每日生产漏斗

当前硬口径：

| 阶段 | 当前规则 |
|---|---|
| Raw | 80-150；降级日 50-80；低于 50 为严重降级 |
| Pool | 20-30 |
| Structured | 8-15；1200-2000 中文字 |
| Front Signal | 3-5；3000-5000 中文字；至少 3 个 S/A/B 原始来源 |
| Deep Dive | 1-2；6000-10000 中文字；证据不足明确缺席 |
| Trend Update | 3-5；不足可 1-2 并写缺口 |

旧 `Raw 30-50 / Pool 10-15 / Structured 5-8 / Front 3 / Deep Dive 0-1` 只作为历史测试管线记录，不再作为 V2 当前生产标准。

## 来源与证据

- AI HOT、follow-builders、HN、X、Reddit、聚合页等只作为 M 级 discovery / source-router。
- AI HOT 与联网关键词搜索是当前 V2 每日生产线的主数量池；follow-builders 是全量扫描的高价值 Builder 观点雷达，不设固定比例：
  - AI HOT：高通量热点和中文 AI 圈趋势密度，承担 Raw 主体候选。
  - 联网关键词搜索：观澜自有主动监测，用于补融资、产品、客户、监管、反证和商业事实，承担 Raw 主体候选。
  - follow-builders：建造者、创始人、工程实践和一线观点变化；由于监测对象约 25 个、每日可用量通常 10-20 条，Raw / Pool 不按比例分配，原则上全量扫描、按质量进入 Pool / Point / Trend / Signal 线索。
- 每日自动化必须先运行 `node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=<YYYY-MM-DD>`，从 source-router 获取候选并生成 Raw 原文档案、Heat Candidate 初稿和 source-router log。
- 每条线索必须回看原始 URL，并按原始来源重新判定 S/A/B/C/D。
- M/C 级通道不得作为事实主证据，不得替代 S/A/B 来源数量。
- 所有事实、数据、融资、客户案例、产品发布、监管、观点和参数必须有来源名、来源等级、原始外链和增量事实。
- `run-v2-daily-pipeline.mjs` 只负责三路采集、去重、初筛、原文档案和日志；它不替代 Data / PM / Copy Agent 对 Pool、Structured、Front Signal、Opportunity 和知识库卡片的判断。

## Heat Candidate

- 高热但未成 Signal 的内容保存在 `01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md`。
- 未升级 Heat Candidate 不进入正式 Signal / Trend / Opportunity。
- 未升级 Heat Candidate 必须进入 `01-SiteV2/knowledge/11-Heat-Candidates/` 作为观察型知识资产。
- 升级后必须双向回链：原候选写 `converted_to`，新 Signal / Trend 写 `origin_heat_candidates`。

## 栏目与内容边界

- 今日要点是 AI 商业判断 Newsletter，不是普通日报，也不是行动建议书。
- 关键信号包含 Front Signals、Structured Signals 和 Builders 观点。
- 机会解码是能辅助老板判断的商业机会深度分析报告，不是机会卡列表。
- Deep Dive 是 6000-10000 中文字的商业内参级长文。
- 商业内参是跨周期、跨栏目、可归档、可复盘、可付费阅读的组合判断报告，不等于单个 Deep Dive。

## 知识库

当前知识库目录：

```text
01-SiteV2/knowledge/
├─ 00-MOC/
├─ 01-Signals/
├─ 02-Points/
├─ 03-Cases/
├─ 04-Opportunities/
├─ 05-Trends/
├─ 06-Sources/
├─ 07-Companies/
├─ 08-People/
├─ 09-Templates/
├─ 10-AIBriefs/
├─ 11-Heat-Candidates/
└─ 99-Archive/
```

- Builders 使用 `08-People/`，不新建 `08-Builders/`。
- AIBriefs 使用 `10-AIBriefs/`，不新建 `09-AIBriefs/`。
- Heat Candidates 使用 `11-Heat-Candidates/`，不新建 `06-Heat-Candidates/`。
- 今日要点不全文入库，只生成 `00-MOC/YYYY-MM-DD--daily-brief-index.md`。

## 历史文件处理

以下文件或任务中的冲突口径只作历史记录，不自动继承：

- V1 baseline / archive / `04-Site` 相关文件。
- `P0-12` test-only 管线。
- 旧自动化 `ai-the-point`、`ai-2`、`ai-3`。
- failed / not-accepted / closed 任务的 stage summary、reference mockups 或 local-site-quality-pass。
- 2026-05-02 至 2026-05-05 早期 sprint / execution 文件中的旧导航、行动建议、Raw 30-50 和 The Point 一级栏目。

## 当前依据文件

当前执行窗口应优先读取：

- `AGENTS.md`
- `agent-workflow/governance/v2-current-rule-overrides.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/intelligence-data-model.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/knowledge/README.md`
- `agent-workflow/tools/run-v2-daily-pipeline.mjs`
