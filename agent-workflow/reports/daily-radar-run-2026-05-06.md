---
type: automation-report
automation_id: ai-2
date: 2026-05-06
status: generated
generated_at: 2026-05-06T14:58:20+08:00
---

# AI商业雷达每日内容生成｜2026-05-06

## 结论

- 状态：generated
- 产物：
  - `01-Signals/2026-05-06-AI商业雷达.md`（status: pending_unified_sync）
  - `02-Scoring/2026-05-06-AI机会评分.md`（status: pending_unified_sync）

## 输入来源

- follow-builders digest（用于当日线索汇总）：`agent-workflow/reports/follow-builders-digest-2026-05-06.json`
  - 生成命令：`node C:\Users\86186\.skill-store\follow-builders\scripts\prepare-digest.js --date=2026-05-06`

## 内容一致性说明

- 已确保每条 Signal 包含 `机会拆解（6点｜必须详细拆解）` 且 6 个模块齐全。
- 已确保每条 Signal 只指向 1 个最直接的主 Opportunity（通过 `相关机会：[[...]]` 口径）。
- 事件类型（新闻类型）只使用规范值：融资 / 客户采用 / 收入验证 / 产品发布 / 监管/政策 / 采购/招标 / 并购整合 / 平台数据。

## 下一步

- 本任务只生成内容 Markdown，不运行网站同步与检查；统一同步由 `ai-3` 执行。
