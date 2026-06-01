---
status: current
scope: context-index
last_updated: 2026-06-01
use_when:
  - decide what to read
  - dispatch task
  - recover context
do_not_use_when:
  - small direct file edit with explicit path
priority: router
---

# Context Index｜观澜上下文索引

## 当前有效文档

| 文档 | 用途 | 什么时候读 |
|---|---|---|
| `context/00-current-state.md` | 当前项目状态 | 大任务、状态恢复、派发 |
| `context/version-ledger.md` | 当前版本基线、版本分层、冻结点和必须门禁 | 新任务启动、页面改动、发布检查 |
| `context/frontstage-page-contracts.md` | 前台页面契约，约束页面不能被旧模块污染 | 页面、文案、前台数据同步 |
| `context/01-product-map.md` | 产品结构、栏目、数据流 | 产品、栏目、页面结构 |
| `context/02-vi-style.md` | VI、字体、页面视觉 | UI、页面、海报、品牌资产 |
| `context/03-copy-style.md` | 全站基础文案 | 命名、页面文案、卡片展示文案 |
| `context/04-qc-rules.md` | 通用质量门禁 | 验收、收口、发布检查 |
| `context/05-daily-monitoring.md` | 每日监测最小上下文 | Raw / Pool / 监测 QC |
| `context/06-execution-harness.md` | 高风险流程执行外壳 | 每日监测、Raw / Pool / Card、页面 / 文案 / Typography |
| `context/07-card-asset-stage-model.md` | 卡片资产阶段化模型，含前沿观点四档评级 | Card / 资产层、商业信号、前沿观点、变化 / 场景 / 趋势候选 |
| `context/08-card-asset-qc-checklist.md` | 卡片资产轻量质检清单 | 卡片入库前、前台同步前、资产链 QC |

## 当前 Skill

| Skill | 用途 |
|---|---|
| `skills/guanlan-daily-monitor/SKILL.md` | 每日监测执行入口 |
| `skills/guanlan-monitor-quality-gate/SKILL.md` | 监测脚本预闸门 |
| `skills/guanlan-daily-monitor-qc/SKILL.md` | Raw / Pool 质量放行 |
| `skills/guanlan-copy-style/SKILL.md` | 全站基础文案生成 |
| `skills/guanlan-copy-style-qc/SKILL.md` | 全站基础短文案 QC |
| `~/.skill-store/guanlan-daily-observation-pitch/SKILL.md` | 今日观察商业主编选题 |
| `~/.skill-store/guanlan-daily-observation/SKILL.md` | 今日观察撰写与返修 |
| `~/.skill-store/guanlan-daily-observation-qc/SKILL.md` | 今日观察可读性质检 |

如果任务缺少上下文，先说明缺什么，不要自行全库扫描。
