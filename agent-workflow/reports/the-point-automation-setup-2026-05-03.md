# 2026-05-03 The Point 每日自动化落地报告

## 任务归属

- Workflow / Automation Agent
- Dev Agent

本次未创建临时 agent，按长期 `agent-workflow` 将 The Point 每日生成任务落地为 Codex 自动化。

## 自动化配置

- 自动化名称：观澜AI The Point 每日观点生成
- 自动化 ID：`ai-the-point`
- 类型：Codex cron automation
- 状态：ACTIVE
- 运行目录：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight`
- 执行环境：local
- 计划时间：每日 08:30
- 时区口径：按当前项目环境 Asia/Shanghai 理解
- 模型：`gpt-5.2`
- 推理强度：medium

## 运行边界

自动化任务只允许写入：

- `05-Point/YYYY-MM-DD-The-Point.md`
- `05-Point/sources/YYYY-MM-DD/`
- `agent-workflow/daily-run-log.md`
- 必要时写入 `agent-workflow/reports/the-point-run-YYYY-MM-DD.md`

自动化任务不得直接执行：

- `node 04-Site/scripts/sync-data.mjs`
- `node 04-Site/scripts/check-relations.mjs`

自动化任务不得直接写入：

- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`

The Point 生成后必须标记为：

```text
pending_unified_sync
```

由商业雷达统一同步流程负责一次性解析 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/` 并更新网站数据。

## 自动化提示词核心规则

- 启动时读取 `AGENTS.md`、`docs/agent-handoff.md`、`agent-workflow/execution/the-point-daily-automation-2026-05-03.md`、`agent-workflow/product/the-point-model.md`、`agent-workflow/reports/the-point-handoff-2026-05-03.md`。
- 使用已安装的 `follow-builders` 技能准备来源素材。
- 优先通过 `follow-builders/scripts/prepare-digest.js` 获取结构化素材。
- 不直接网页抓取。
- 若当天 The Point 文件已存在且非空，不覆盖，改为记录跳过原因。
- 若素材不足或准备失败，不生成空文件，必须记录尝试路径、命令、降级方式和失败原因。
- X 来源必须保留 `原文全文` / `中文译文全文`。
- Podcast 来源必须保留 `原始发言段` / `发言段译文`。
- Blog 来源必须保留 `原始段落` / `原始段落译文`。
- Podcast / Blog 来源需要在 `05-Point/sources/YYYY-MM-DD/` 创建素材笔记。
- 禁止用摘要或标题替代原始材料字段。
- 输出需包含成功或失败状态、来源数量、生成文件路径、待统一同步事项。

## 已确认事项

- 项目中未发现已有 Codex automations 目录，未检测到同类本地自动化记录。
- `follow-builders` 技能目录存在：
  - `C:\Users\86186\.skill-store\follow-builders`
  - `C:\Users\86186\.codex\skills\follow-builders`
- 自动化已通过 Codex app 创建，并可通过 ID `ai-the-point` 查看。

## 后续建议

1. 明天 08:30 后检查 `agent-workflow/daily-run-log.md` 与 `05-Point/` 是否出现新文件。
2. 第一次真实运行后，补一份 `agent-workflow/reports/the-point-run-YYYY-MM-DD.md` 复盘来源数量、失败降级和字段完整性。
3. 统一同步任务需要在 The Point 生成后运行 `sync-data.mjs` 与 `check-relations.mjs`，但这应由商业雷达同步流程执行，不由 The Point 自动化执行。
