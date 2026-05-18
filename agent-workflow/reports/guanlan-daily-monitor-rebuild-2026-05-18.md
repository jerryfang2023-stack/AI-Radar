# Guanlan Daily Monitor Rebuild｜2026-05-18

## 结论

每日监测任务已从旧 `daily-monitor-router` 口径中拆出，重建为独立任务：

- Skill：`skills/guanlan-daily-monitor/SKILL.md`
- Playbook：`agent-workflow/product/daily-monitoring-playbook.md`
- Automation prompt：`agent-workflow/automation-prompts/guanlan-daily-monitor.md`
- Codex automation：`guanlan-daily-monitor`

旧监测自动化 `v2-content-site-daily-update` 已删除。旧 prompt `agent-workflow/automation-prompts/daily-monitor-router.md` 已删除。

## 已执行

1. 新增 `daily-monitoring-playbook.md`
   - 每日监测定义为独立任务。
   - 只负责发现、Raw 保存、Pool 分流、source-router log、fallback 和 evidence gaps。
   - 不写今日观察，不生成完整卡片，不写趋势报告。

2. 新增 `guanlan-daily-monitor` skill
   - 项目内：`skills/guanlan-daily-monitor/SKILL.md`
   - 本地 skill-store：`C:\Users\86186\.skill-store\guanlan-daily-monitor\SKILL.md`

3. 新增 `agent-workflow/automation-prompts/guanlan-daily-monitor.md`
   - 作为每日监测自动化的简洁执行说明。
   - 细则不再散落在自动化 prompt 中，统一回到 Playbook / Raw schema / Pool rules。

4. 删除旧监测入口
   - 删除 `agent-workflow/automation-prompts/daily-monitor-router.md`
   - 删除 Codex automation `v2-content-site-daily-update`

5. 新建 Codex automation
   - ID / name：`guanlan-daily-monitor`
   - Schedule：每天 09:00
   - Status：ACTIVE
   - Model：`gpt-5.2`
   - Reasoning：high

6. 删除历史 V1 自动化
   - `ai-the-point`
   - `ai-2`
   - `ai-3`

7. 同步项目入口
   - `AGENTS.md`
   - `agent-workflow/governance/current-context.md`

## 当前边界

每日监测不再为旧卡片规则或旧 writer 规则做兼容。后续卡片生成、今日观察、趋势报告和商业内参的规则可以重新设定。

每日监测只输出可供下游使用的证据底座：

- Raw
- Pool
- 前沿观点入口
- source-router log
- failed_sources
- fallback_used
- evidence_gaps

## 验证

已检查当前入口中不再出现：

- `daily-monitor-router`
- `v2-content-site-daily-update`
- `兼容任务名`

当前自动化目录只保留 V2 六线程：

- `guanlan-daily-monitor`
- `asset-card-generator`
- `daily-observation-writer`
- `case-signal-researcher`
- `trend-report-writer`
- `brief-periodical-writer`

验证命令：

- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`：passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
