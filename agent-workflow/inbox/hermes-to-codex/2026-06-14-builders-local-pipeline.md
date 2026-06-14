# Builders 本地管线修复 — 2026-06-14

## 问题

本地 08:30 Codex `builder-observation-daily-sync` 管线今日未执行。

## 检查证据

### 1. RSS 采集
- `agent-workflow/reports/` 下无今日 RSS 采集报告
- 最近 report 日期：2026-06-12

### 2. follow-builders-daily.json
- 文件：`01-SiteV2/site/data/follow-builders-daily.json`
- `meta.generatedAt`：`2026-06-12T08:31:13.368Z`
- `meta.sourceRoute`：`prepare-digest`
- **错误**：文件日期为 06-12，不是今日

### 3. Gate
- `agent-workflow/reports/2026-06-14-follow-builders-data-gate.md`：不存在
- 最近 gate：`2026-06-12-follow-builders-data-gate.md` (passed)

### 4. Obsidian 同步
- `01-SiteV2/knowledge/02-Opinion-Timelines/people/` 下所有 builder 目录
- 无任何文件修改日期为 2026-06-14
- 最近 timeline 文件均为 06-12

## 处理措施

Hermes 已触发 GitHub fallback 补充：
- Dispatched: `daily-first-line-viewpoints-pr.yml` date=2026-06-14
- 北京时间 09:55 触发

## 可能原因

1. Codex 08:30 cron 未触发或触发后失败（需检查 Codex 运行日志）
2. RSS 源不可用或采集脚本报错
3. `skip-weekend` 逻辑导致周日跳过（若是故意设计，需在 AGENTS.md 或 context 中明确标注；任务指令未提及周末跳过）
4. `prepare-digest` 脚本依赖的上游数据源未更新

## 建议修复

1. 检查 Codex 08:30 时段的运行日志
2. 确认 `builder-observation-daily-sync` 管线中各脚本的执行状态
3. 如果是周末跳过逻辑，请明确记录
4. 如遇脚本报错，修复后重跑今日数据
