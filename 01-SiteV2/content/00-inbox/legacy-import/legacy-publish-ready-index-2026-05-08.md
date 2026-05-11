---
date: 2026-05-08
stage: legacy-publish-ready-index
status: publish-ready-index
task_id: WSD-20260508-03-v2-legacy-candidates-refinement-autopilot
encoding: UTF-8
---

# Legacy Publish-Ready Index

## 1. 发布原则

本索引只登记已精修后的 legacy publish-ready 内容。V1 原文仍保留在归档，不直接进入 V2 前台。

## 2. 可进入 Home / 今日要点

| asset_id | 标题 | 处理 |
|---|---|---|
| `LS-20260508-02` | 历史 Agent 治理信号并入控制层判断 | 不替换今日主线，只作为 2026-05-07 Agent 控制层的历史延续，在关系网展示。 |
| `LEGACY-OPP-20260508-03` | 企业 Agent 控制与审计层 | 合并到 2026-05-07 机会深挖的关系资产，不新增第二个首页机会。 |

## 3. 可进入关键信号

| asset_id | 标题 | 关系 |
|---|---|---|
| `LS-20260508-01` | 历史客服 Agent 信号合并为客户前台运营判断 | 关联 `LEGACY-OPP-20260508-01`、`LT-20260508-01`、`LPT-20260508-03` |
| `LS-20260508-02` | 历史 Agent 治理信号并入控制层判断 | 关联 `LEGACY-OPP-20260508-03`、`LT-20260508-02`、`LPT-20260508-01` |

## 4. 可进入机会解码

| asset_id | 标题 | 发布状态 |
|---|---|---|
| `LEGACY-OPP-20260508-01` | 客户体验 Agent 平台 | publish-ready / 新增到机会索引 |
| `LEGACY-OPP-20260508-02` | 专业服务 AI 工作流平台 | publish-ready / 新增到机会索引，证据状态为 observation |
| `LEGACY-OPP-20260508-03` | 企业 Agent 控制与审计层 | publish-ready / 与 2026-05-07 深挖合并展示 |

## 5. 只作为观点校准 / 趋势背景嵌入

| asset_id | 标题 | 用途 |
|---|---|---|
| `LPT-20260508-01` | Claude Code auto mode 把默认执行推向治理问题 | 校准 Agent 控制层与 AI Coding 治理 |
| `LPT-20260508-02` | 复现环境产品化让 Agentic debug 可回放 | 校准 AI Coding 工程基础设施 |
| `LPT-20260508-03` | 语音入口让客服 Agent 更接近业务前台 | 校准客户体验 Agent 平台 |
| `LT-20260508-01` | AI 客户前台运营 | 趋势背景 |
| `LT-20260508-02` | Agent 治理与控制平面 | 趋势背景 |
| `LT-20260508-03` | 专业服务 AI 交付流程 | 趋势背景 |

## 6. 仅留作内部证据，不前台展示

| asset_id | 原因 |
|---|---|
| `legacy-priority-20260429-batch` - `legacy-priority-20260505-batch` | 缺 V2 evidenceScore、source level 和 counter evidence。 |
| `legacy-signal-20260429-batch` - `legacy-signal-20260505-batch` | 多数仍是批次级候选，缺逐条来源等级和反证。 |
| `legacy-trend-ai-marketing` | ROI、渠道规则和客户采用证据不足。 |
| `legacy-opportunity-ai-growth-agent` / `legacy-opportunity-marketing-agent` / `legacy-opportunity-smb-marketing-chat` | 方向重复，暂需合并和补客户数据。 |
| `legacy-opportunity-medical-imaging-ai` / `legacy-opportunity-engineering-simulation` / `legacy-opportunity-embodied-control-stack` | 监管、精度、量产或单位经济模型证据不足。 |

## 7. 站点接入

站点数据生成器读取 refined publish-ready 文件后，将 publish-ready 资产追加到：

- `contentIndex.signals`
- `contentIndex.points`
- `contentIndex.trends`
- `contentIndex.opportunities`

当前不恢复 The Point / Trends 一级导航，不新增 Scoring 前台栏目。
