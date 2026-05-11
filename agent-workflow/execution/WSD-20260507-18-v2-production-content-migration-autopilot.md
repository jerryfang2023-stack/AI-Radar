---
task_id: WSD-20260507-18-v2-production-content-migration-autopilot
board_id: V2-13AUTO
title: V2 生产线与历史判断资产迁移自动包
date: 2026-05-07
status: ready
lead_agent: V2 Platform / Workflow Agent
support_agents:
  - V2 Source Intelligence Agent
  - V2 Heatmap Algorithm Agent
  - V2 Content Product Agent
  - QA / Acceptance Agent
encoding: UTF-8
merged_from:
  - V2-13
  - V2-DOC
  - V1 / recent monitoring valuable content migration
---

# V2-13AUTO｜V2 生产线与历史判断资产迁移自动包

## 1. 任务目标

在一个执行窗口中连续完成：

1. 建立 V2 生产内容路径、同步闸门、质量检查、备份和回滚方案。
2. 整理 V2-only 文档入口和索引，确保新窗口不再误用 V1 旧目录。
3. 将 V1.0 已沉淀的高价值内容和最近几天自动化 / 监测产物，按 V2 规则重新清洗、评分、结构化后导入 `01-SiteV2/content/`。

本任务不是把旧文档原样搬进 V2，而是做“历史判断资产再加工”：保留有价值事实、来源、观点、机会判断和趋势线索，按 V2 算法重新进入内容库。

## 2. 输入范围

### 2.1 必读

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/v2/v2-agent-system.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/v2/v2-directory-content-architecture.md`
- `agent-workflow/v2/v2-documentation-directory-architecture.md`
- `01-SiteV2/README.md`
- `01-SiteV2/content/README.md`

### 2.2 历史资产输入

优先扫描并建立清单：

- `10-Archive/v1.0/v1.0-content-archive.md`
- `10-Archive/v1.0/source-dirs/01-Signals/`
- `10-Archive/v1.0/source-dirs/02-Scoring/`
- `10-Archive/v1.0/source-dirs/03-Trends/`
- `10-Archive/v1.0/source-dirs/05-point/`
- `10-Archive/v1.0/source-dirs/07-Opportunities/`
- `01-SiteV2/content/01-raw/`
- `01-SiteV2/content/02-pool/`
- `01-SiteV2/content/03-structured-signals/`
- `01-SiteV2/content/04-selected-signals/`
- `01-SiteV2/content/08-opportunities/deep-dive/`
- `01-SiteV2/content/10-databases/`
- `agent-workflow/reports/daily-radar-run-2026-05-05.md`
- `agent-workflow/reports/daily-radar-run-2026-05-06.md`
- `agent-workflow/reports/the-point-run-2026-05-05.md`
- `agent-workflow/reports/the-point-run-2026-05-06.md`

暂不处理：

- `09-ai-news-radar/`
- failed / void / stopped 页面任务产物
- UI 截图审美报告
- 纯工作流 closeout，除非其中包含可复用产品判断

## 3. 阶段顺序

### Stage A｜V2 生产线路径确认

输出：

- V2 内容路径映射表。
- V2 同步 / 检查 / 备份 / 回滚方案。
- 说明旧 `04-Site` 不再是生产发布目录。

硬要求：

- V2 内容入口统一为 `01-SiteV2/content/`。
- V2 新站入口统一为 `01-SiteV2/site/`。
- 不恢复 V1 旧目录为生产入口。

### Stage B｜历史资产盘点

输出：

- `agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md`

盘点字段：

| 字段 | 要求 |
|---|---|
| source_path | 原文件路径 |
| asset_type | Signal / Scoring / Point / Trend / Opportunity / Daily monitoring / Report |
| date | 内容日期 |
| value_type | 事实 / 来源 / 趋势 / 机会 / 观点 / 评分 / 反证 |
| v2_destination | 建议进入 V2 的目录 |
| action | import / transform / archive-only / reject |
| reason | 处理理由 |

### Stage C｜V2 算法再加工

对可迁移资产按 V2 规则重新处理：

1. 去重：同一事件、同一公司、同一来源重复内容合并。
2. 去噪：浅新闻、工具教程、无商业信号内容不进入结构化库。
3. 二次判断：按 V2 的问题、客户、流程、模式、为什么现在、迁移判断六维重写。
4. 重新挂载：Signal / Trend Context / Point Calibration / Opportunity / HeatEvidence 建立关系。
5. 重新评分：按 V2 HeatEvidence 和商业热力逻辑标注热度、证据强度、时间敏感度、付费价值。

### Stage D｜导入 V2 内容库

建议输出路径：

```text
01-SiteV2/content/00-inbox/legacy-import/
01-SiteV2/content/01-raw/legacy/
01-SiteV2/content/02-pool/legacy/
01-SiteV2/content/03-structured-signals/legacy/
01-SiteV2/content/04-selected-signals/legacy/
01-SiteV2/content/05-trend-chain/legacy/
01-SiteV2/content/07-points/legacy/
01-SiteV2/content/08-opportunities/deep-dive/legacy/
01-SiteV2/content/10-databases/legacy/
```

每条导入资产必须保留：

- V2 稳定 ID。
- 原始来源路径。
- 原始日期。
- 转换日期。
- 转换理由。
- V2 目标栏目或模块。
- 关系字段。
- 不确定性或证据缺口。

### Stage E｜V2 文档索引回填

更新：

- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/execution/dispatch-board.md`
- 必要时更新 `01-SiteV2/content/README.md`

### Stage F｜质量检查与 closeout

必须输出：

- `agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md`
- `agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md`
- `agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md`
- quality gate 报告

## 4. 禁止事项

- 不把 V1 文档原样改名塞进 V2 内容库。
- 不把 failed / void / stopped 页面任务当成 V2 accepted 资产。
- 不恢复旧 `04-Site` 为生产站点。
- 不处理 `09-ai-news-radar/`。
- 不直接做 V2 前台页面 Dev。
- 不部署 Netlify 生产站。
- 不删除历史归档。

## 5. 验收标准

- 历史资产清单完整覆盖 V1 Signals / Scoring / Trends / Point / Opportunities 与最近监测产物。
- 每个迁移资产都有 import / transform / archive-only / reject 判断。
- 进入 V2 的内容符合 V2 六维分析、HeatEvidence、关系字段和来源追溯要求。
- V2 内容库路径不再使用旧 `06-content` 作为生产入口。
- 文档入口与看板回填完成。
- closeout 为 UTF-8 Markdown。

## 6. 新窗口执行提示词

```text
你是观澜AI V2 生产线与历史判断资产迁移执行窗口。

请在 C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight 执行：

Task ID：WSD-20260507-18-v2-production-content-migration-autopilot
派发单：agent-workflow/execution/WSD-20260507-18-v2-production-content-migration-autopilot.md

任务目标：
1. 承接 V2-13：建立 V2 生产内容路径、同步闸门、质量检查、备份和回滚方案。
2. 承接 V2-DOC：更新 V2-only 文档入口和索引。
3. 新增历史判断资产迁移：将 V1.0 已沉淀文档、自动化跑出的商业机会 / The Point、以及 2026-05-05 / 2026-05-06 的 30-50 条监测链路，按 V2 规则和算法重新清洗、评分、结构化后导入 `01-SiteV2/content/`。

必须先读取：
- AGENTS.md
- docs/README.md
- docs/agent-handoff.md
- agent-workflow/execution/dispatch-board.md
- agent-workflow/v2/v2-algorithm-source-architecture.md
- agent-workflow/v2/v2-product-architecture-prd.md
- agent-workflow/v2/v2-directory-content-architecture.md
- agent-workflow/v2/v2-documentation-directory-architecture.md
- 01-SiteV2/README.md
- 01-SiteV2/content/README.md
- 本派发单

重点要求：
- 不要把 V1 文档原样搬进 V2。
- 先做历史资产 inventory，再按 V2 的六维分析、HeatEvidence、Trend Context、Point Calibration、Opportunity 关系重新加工。
- 输出进入 V2 的内容必须有稳定 ID、来源路径、原始日期、转换日期、转换理由、关系字段和证据缺口。
- `09-ai-news-radar/` 暂不处理。
- 不做 V2 页面 Dev，不部署 Netlify。

最终必须写 UTF-8 closeout：
agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md

并同时输出：
- agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md
- agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md

完成后回到调度中枢窗口汇报：
收口：agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md
```
