# 2026-05-15 trend-report-writer Prompt 更新收口

状态：accepted / automation-prompt-updated

## 本轮目标

把已固化的 Trend Report 新规则写入 `trend-report-writer` 的项目 prompt，并同步更新 Codex 定时自动化任务，让后续自动化按 `flash / full / no_report_decision` 新链路生产。

## 已更新

- `agent-workflow/automation-prompts/trend-report-writer.md`
- `01-SiteV2/content/README.md`
- Codex 自动化任务：`trend-report-writer`

## 核心变化

- writer 先判断 `weekly mode` 或 `urgent mode`。
- weekly mode 每次最多产出 1 篇 `TRD-FULL-*` 深度报告。
- urgent mode 只有存在 `approve_flash` 的 `UTCAND-*` 急件候选时，最多产出 1 篇 `TRD-FLASH-*` 趋势快报。
- 每次运行只能二选一：产出 1 篇 Trend Report，或输出 1 份 `no_report_decision`。
- 删除旧口径：没有达标趋势时写简短运行报告。
- 新报告只写入：

```text
01-SiteV2/content/06-trend-reports/flash/
01-SiteV2/content/06-trend-reports/full/
```

- `no_report_decision` 只写入：

```text
01-SiteV2/content/06-trend-reports/no-report-decisions/
```

- 急件候选排序写入 writer prompt：

```text
多源密度 > 观澜重点赛道 > 商业影响 > 来源质量 > 时间新鲜度
```

- 未选急件候选写入当天 `Deferred Candidates`，最多延后 2 次，第三次必须落状态。
- writer prompt 明确引用观澜写作风格，要求减少 AI 味，避免禁用过渡词和 `XX感 / XX性 / XX化` 抽象名词。

## 自动化任务同步

已通过 Codex App automation update 更新 `trend-report-writer`：

- `status`: `ACTIVE`
- `rrule`: `FREQ=WEEKLY;BYDAY=TU;BYHOUR=10;BYMINUTE=0;BYSECOND=0`
- `model`: `gpt-5.2`
- `reasoning_effort`: `high`
- `execution_environment`: `local`
- `cwd`: `C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight`

## 验证

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
- `node agent-workflow/tools/run-quality-gates.mjs style`：passed
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-15`：passed

## 边界

- 本轮只改 writer prompt、内容 README 和实际自动化任务正文。
- 未改站点同步脚本。
- 未改前台趋势追踪页面。
- 未立即触发一次 trend-report-writer 运行。

## 下一步

下一步应修改站点同步脚本读取策略：优先读取 `06-trend-reports/full/`，再读取 `flash/`，短期兼容根目录旧文件，并排除 `no-report-decisions/`。
