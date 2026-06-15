status: open
priority: medium
lane: first_line_viewpoints_skill
category: afternoon_skill_check
failed_gate: afternoon_skill_check
report_path: agent-workflow/reports/2026-06-14-follow-builders-skill-local-publish.md
data_generated: no
needed_action: inspect
created_at: 2026-06-14T16:30:00+08:00
source: hermes-auto

# 下午 follow-builders skill 链路补充检查 — 2026-06-14

## 前置确认

检查本机 16:10 的 `WaveSight Follow-Builders Skill Daily` 任务是否已运行：

- **结果：任务未运行**。本机（Linux）没有配置该任务的 cron 或 Hermes 定时任务。
- 本机 Hermes cron jobs 中仅有 16:30 的检查任务（即本次自身）。
- 负责运行 `publish-follow-builders-skill-local.mjs` 的 `run-follow-builders-skill.ps1` 为 PowerShell 脚本（Windows/Codex 端），不适用于本机。

## 检查项结果

| 检查项 | 状态 | 说明 |
|--------|------|------|
| 1. 报告文件存在 | ❌ 缺失 | `agent-workflow/reports/2026-06-14-follow-builders-skill-local-publish.md` 不存在 |
| 2. 输出文件存在 | ❌ 缺失 | `01-SiteV2/content/07-points/2026-06-14-builders-viewpoints.md` 不存在 |
| 3. item count > 0 | ⛔ 无法检查 | 输出文件不存在 |
| 4. 报告数量与输出一致 | ⛔ 无法检查 | 两文件均不存在 |

## 背景

- **06-13 的本地发布报告**也存在（Windows 端生成，`builder_items_count: 0`）— 说明即使跑通也没产生有效 item。
- **今天 09:55 的 GitHub fallback** 已成功运行：manifest 显示所有步骤 passed，`follow-builders-daily.json` 数据存在（52 remarks / 22 builders，generatedAt: 2026-06-13T16:34 UTC）。
- **Data gate passed**（12 remarks / 6 builders 阈值已满足）。
- **今天凌晨 03:17 的 inbox** 已标记 resolved，明确将检查窗口推迟到 16:30。

## 需要 Codex 处理

1. **确认 16:10 `WaveSight Follow-Builders Skill Daily` 的部署方式**：
   - 是否应是 Codex（Windows）端 cron 触发？
   - 如果是，今天为什么没触发？
2. **检查 `publish-follow-builders-skill-local.mjs` 是否能直接运行 生成 builders-viewpoints.md**
   - 需要的 skill store 路径：`~/.skill-store/follow-builders/scripts/prepare-digest.js`
   - 本机不存在该 skill store
3. **修复建议**：
   - 如果 16:10 任务是 Codex 端负责，检查 Codex 当天运行日志
   - 如果是周末跳过逻辑，明确记录在 context 中
   - 如果技能 store 未安装，安装或提供替代方案
