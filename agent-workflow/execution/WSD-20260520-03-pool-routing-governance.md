---
task_id: WSD-20260520-03-pool-routing-governance
title: Pool / 分流层治理
status: accepted
owner: Intelligence Engine
created_at: 2026-05-20
encoding: UTF-8
depends_on: WSD-20260520-02-raw-evidence-governance accepted
next_task: WSD-20260520-04-card-asset-governance
---

# WSD-20260520-03｜Pool / 分流层治理

## 1. 任务目标

治理 Pool / 分流层，明确 Raw 进入 `core_pool`、`watchlist`、`index_only`、`discard` 的理由和边界，确保只有具备事件证据、商业变量和可追溯材料的候选才能进入下游。

本任务必须在 Raw / 证据层 closeout 被调度窗口验收后执行。

## 2. 必读文件

只读取：

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `agent-workflow/reports/WSD-20260520-01-source-layer-governance-closeout.md`
4. `agent-workflow/reports/WSD-20260520-02-raw-evidence-governance-closeout.md`
5. `agent-workflow/product/evidence-and-routing-rules.md`
6. `agent-workflow/product/daily-monitoring-playbook.md`
7. `skills/guanlan-daily-monitor/SKILL.md`
8. `skills/guanlan-daily-monitor-qc/SKILL.md`
9. `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`
10. `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
11. `agent-workflow/tools/assert-guanlan-automation-readiness.mjs`

## 3. 治理问题

必须回答并落地：

- `core_pool` 的最小门槛是什么。
- `watchlist` 和 `index_only` 的区别是什么。
- AI HOT daily selected 全量保留时，如何避免它们自动进入核心池。
- S/A/B/M 是否只作为来源类型、证据角色和使用边界，而不作为内容价值加分。
- Pool 是否需要强制六类 `importance_type` 覆盖：`important_case`、`important_funding`、`important_technical_trend`、`important_product_or_service`、`important_vertical_solution`、`important_viewpoint_or_article`。
- 什么时候可以 `allow_with_degradation`。
- 资产链 readiness 是否正确读取 QC 决策。
- 不得恢复旧五类信号、`required_signal_classes` 或 S/A/B 价值加分。

## 4. 可修改范围

允许修改：

- `agent-workflow/product/evidence-and-routing-rules.md`
- `agent-workflow/product/daily-monitoring-playbook.md`
- `skills/guanlan-daily-monitor/SKILL.md`
- `skills/guanlan-daily-monitor-qc/SKILL.md`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`
- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `agent-workflow/tools/assert-guanlan-automation-readiness.mjs`

不得修改：

- Source 采集入口。
- Raw 捕获字段，除非是上一层遗留 bug。
- 卡片模板和前台内容。
- GitHub / Netlify。

## 5. 验收闸门

必须运行：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
node -e "const fs=require('fs'); JSON.parse(fs.readFileSync('01-SiteV2/content/11-databases/monitor-quality-gate-v2.json','utf8')); console.log('json ok')"
```

## 6. Closeout 要求

写入：

```text
agent-workflow/reports/WSD-20260520-03-pool-routing-governance-closeout.md
```

closeout 必须说明：

- 各 Pool 路由定义和边界。
- `core_pool` 的硬门槛。
- `index_only` 和 `watchlist` 的降级理由。
- 如何继承 Raw 层的 `raw_qc_decision`、`evidence_completeness`、六类 `importance_type` 覆盖。
- readiness 是否有更新。
- 验证结果。
- 是否建议解锁 Card / 资产层任务。
