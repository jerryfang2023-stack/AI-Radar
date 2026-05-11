---
date: 2026-05-08
stage: legacy-full-publish-ready-index
status: publish-ready-index
task_id: WSD-20260508-09-v1-history-full-refine-autopilot
encoding: UTF-8
---

# History Full Publish-Ready Index

## 发布原则

本索引只登记 12 篇 V1 历史源文档中完成 V2 化精修后的内容。V1 原文继续保留在只读归档，不直接进入 V2 前台。重复内容优先合并到已有 V2 资产；证据不足的内容进入 hold；Point 只作为观点参照，不作为事实主证据。

## 可进入关键信号

| asset_id | 标题 | 来源范围 | 处理 |
|---|---|---|---|
| `LS-20260508-03` | AI 营销从内容生成转向数据激活与收入系统 | 2026-04-29、2026-04-30、2026-05-04 AI商业雷达 | 新增到历史信号索引，关联营销机会与趋势。 |
| `LS-20260508-04` | 专业服务 AI 从文档助手进入交付工作流 | 2026-05-01、2026-05-03 AI商业雷达 | 新增到历史信号索引，关联专业服务机会与观点参照。 |
| `LS-20260508-05` | Agent 工程化进入权限、复现和安全评审阶段 | 2026-05-05、2026-05-06 AI商业雷达及 The Point | 新增到历史信号索引，关联 Agent 工程化运行层。 |
| `LS-20260508-06` | 企业数据与语义层成为 Agent 可信执行的基础 | 2026-05-03、2026-05-04 AI商业雷达 | 新增到历史信号索引，关联数据智能与控制平面。 |

## 可进入机会解码

| asset_id | 标题 | 发布状态 |
|---|---|---|
| `LEGACY-OPP-20260508-04` | AI 营销数据激活系统 | publish-ready / 新增到机会索引，证据状态为 supported。 |
| `LEGACY-OPP-20260508-05` | Agent 工程化运行层 | publish-ready / 新增到机会索引，证据状态为 observation。 |

## 观点参照

| asset_id | 标题 | 用途 |
|---|---|---|
| `LPT-20260508-04` | Agent 会放大现有记录系统和治理系统 | 校准企业 Agent 控制层。 |
| `LPT-20260508-05` | 可验证工作是 Agent 最先规模化的区域 | 校准 AI Coding、测试、回放和安全评审。 |
| `LPT-20260508-06` | Agent 落地会创造系统升级和变更管理需求 | 校准企业 Agent 工作平台与交付服务。 |
| `LPT-20260508-07` | 语音入口会先改变用户习惯，再改变业务流程 | 校准客户前台运营与语音分流。 |
| `LPT-20260508-08` | 上下文与记忆需要可导出、可审计和可分权 | 校准企业数据智能与记忆层。 |

## 趋势线索

| asset_id | 标题 | 用途 |
|---|---|---|
| `LT-20260508-04` | AI 营销收入系统 | 趋势线索 |
| `LT-20260508-05` | Agent 工程化运行层 | 趋势线索 |
| `LT-20260508-06` | 专业服务 AI 工作流 | 趋势线索 |
| `LT-20260508-07` | 企业数据语义层与控制平面 | 趋势线索 |

## 仅留作内部证据或后续补证

| asset_id | 原因 |
|---|---|
| `history-medical-ai-aidoc` | 医疗平台方向重要，但监管、临床责任、采购周期和本土适配证据不足，暂不直接前台机会化。 |
| `history-embodied-ai-logistics` | 星动纪元、ARI、Waymo 等信号价值高，但当前 V2 生产线尚未建立具身智能专项承接。 |
| `history-edge-inference-chip` | 端侧推理与芯片方向周期长，缺出货、SDK 生态和客户复用数据。 |
| `history-ai-consumer-loopit` | 偏消费内容平台，不符合当前面向商业决策者的主线。 |
| `history-arr-social-estimates` | 二手 ARR / 估值讨论只作经营指标趋势线索，不作为事实主证据。 |

## 站点接入

站点数据生成器读取 `history-refined/` 文件后，将 publish-ready 资产追加到：

- `contentIndex.signals`
- `contentIndex.points`
- `contentIndex.trends`
- `contentIndex.opportunities`

当前不恢复 The Point / Trends 一级导航，不新增 Scoring 前台栏目，不处理 `09-ai-news-radar/`。
