---
status: current
scope: context-index
last_updated: 2026-06-06
use_when:
  - decide what to read
  - dispatch task
  - recover context
priority: router
---

# Context Index｜观澜 AI 当前上下文索引

## 当前有效文档

| 文档 | 用途 | 什么时候读 |
|---|---|---|
| `context/00-current-state.md` | 当前项目状态与停止口径 | 大任务启动、状态恢复、派发 |
| `context/version-ledger.md` | 当前版本基线、冻结点和历史摘要 | 页面改动、发布检查、版本确认 |
| `context/frontstage-page-contracts.md` | 前台页面契约 | 页面、前台数据同步、回归检查 |
| `context/01-product-map.md` | V3 产品结构与数据流 | 产品结构、页面结构、导航判断 |
| `context/02-vi-style.md` | VI、字体、页面视觉 | UI、排版、品牌资产 |
| `context/04-qc-rules.md` | 通用质量门禁 | 验收、收口、发布检查 |
| `context/05-daily-monitoring.md` | V3 每日监测最小上下文 | Raw / Pool / 监测 QC |
| `context/06-execution-harness.md` | 高风险流程执行外壳 | 每日监测、Raw / Pool / Card、页面大改 |
| `context/07-v3-intelligence-generation-rules.md` | V3 Raw / Pool / Card / 关系 / 趋势候选生成真源 | 任何生成规则、监测链路、成卡链路修改 |
| `context/08-card-asset-qc-checklist.md` | 卡片资产轻量质检清单 | Card 入库前、前台同步前 |

## 当前 Skill

| Skill | 用途 |
|---|---|
| `skills/guanlan-daily-monitor/SKILL.md` | V3 Raw 监测与候选采集 |
| `skills/guanlan-monitor-quality-gate/SKILL.md` | 监测预闸门 |
| `skills/guanlan-daily-monitor-qc/SKILL.md` | Raw / Pool 质量放行 |
| `skills/guanlan-trend-candidate-writer/SKILL.md` | 趋势候选判断，不写趋势报告 |

## 停止使用

- 今日观察写作、商业内参、趋势报告不是当前 V3 必要输出。
- `guanlan-copy-style`、`guanlan-copy-style-qc`、`publiccopy`、`cardcopy` 不作为当前发布阻塞门禁。
- follow-builders / opinion lane 不参与当前商业信号、关系图谱和趋势候选生成。

如果任务缺少上下文，先说明缺什么，不要自行全库扫描。
