---
task_id: WSD-20260520-daily-monitor-offtopic-repair
title: 修复 2026-05-20 每日监测 off-topic Raw 噪音
status: void
owner: Intelligence Engine / Build & Release
created_at: 2026-05-20
encoding: UTF-8
depends_on:
  - WSD-20260520-daily-monitor-run repair_required
---

# WSD-20260520｜每日监测 off-topic Raw 返修

> 2026-05-21 调度决定：本任务废弃。不要再按“修补旧 Raw 噪音”的方式执行。应改为执行 `WSD-20260521-rerun-20260520-raw-pool-layered-search`，按最新分层搜索和六 lane Pool 治理重新跑 2026-05-20 Raw / Pool。

## 1. 任务目标

只修复 2026-05-20 每日监测质量门禁中唯一未过的硬闸门：`off_topic_title_max`。

当前状态：

- Raw count：120。
- Pool count：49。
- Core pool count：15。
- usable core evidence：15。
- 六类 `importance_type` 覆盖：通过。
- homepage / directory core：通过。
- Raw QC core：通过。
- 未过硬闸门：`off_topic_title_max`，最新复核为 `6/3`。

本任务只允许移除、降级或重路由 off-topic Raw / Pool 噪音，并重新生成质量门禁与 QC 报告。不得重写 Source / Raw / Pool 基础规则。

## 2. 必读文件

只读取：

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `agent-workflow/reports/WSD-20260520-daily-monitor-run-closeout.md`
4. `agent-workflow/reports/2026-05-20-guanlan-monitor-quality-gate.md`
5. `agent-workflow/reports/2026-05-20-guanlan-daily-monitor-qc.md`
6. `01-SiteV2/content/01-raw/2026-05-20-raw-candidates.md`
7. `01-SiteV2/content/02-pool/2026-05-20-pool-candidates.md`
8. `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`

按需读取：

- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`

## 3. 修复范围

允许：

- 找出 off-topic Raw 标题。
- 将明显无关 Raw 降级为 `discard` / `index_only`，或从当日 Raw / Pool 候选中移除。
- 修复过宽的噪音过滤规则，但只能针对 off-topic 标题问题。
- 重新运行 quality gate。
- 重新生成或更新 `2026-05-20-guanlan-daily-monitor-qc.md`。

不得：

- 重写 Source / Raw / Pool 基础规则。
- 改 AI HOT / follow-builders / keyword 采集比例。
- 改六类 `importance_type` 口径。
- 改已通过的 homepage / directory core gate。
- 写今日观察。
- 生成卡片。
- 更新前台。
- 推送 GitHub 或部署 Netlify。

## 4. 验收命令

必须运行：

```powershell
node agent-workflow/tools/guanlan-monitor-quality-gate.mjs --date=2026-05-20
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
```

如 quality gate 完全通过，再运行：

```powershell
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=2026-05-20
```

## 5. Closeout 要求

写入：

```text
agent-workflow/reports/WSD-20260520-daily-monitor-offtopic-repair-closeout.md
```

closeout 必须说明：

- 找到了哪些 off-topic Raw / Pool 项。
- 如何处理：移除、降级、重路由或规则修复。
- 修复后 `off_topic_title_max` 是否通过。
- Raw / Pool / core_pool 数量是否仍符合要求。
- 六类 `importance_type` 是否仍无缺口。
- Daily Monitor QC 结论是否从 `repair_required` 更新为 `allow` 或明确范围的 `allow_with_degradation`。
- assets readiness 是否通过。
