---
title: WSD Page and Copy Dispatch Gate Rules Closeout
date: 2026-05-04
type: closeout
status: accepted
owner: workflow
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# WSD Page and Copy Dispatch Gate Rules Closeout

## 1. 做了什么

根据用户反馈“页面粗糙、简陋、栏目间距不一、标题位置不一、字体大小随意、排版丑陋”以及“文案不规范”，本轮建立页面类和文案类任务派发硬规则，并重新完善派发单和收口模板。

核心变化：

- 页面类任务必须先有 UI/UE 页面规范表。
- 涉及可见文案的页面任务必须先有 Copy 文案规范表。
- Dev 必须按 UI/UE 页面规范表逐条实现并说明。
- Dev 不得自行补写、改写或扩写 Copy 未提供的关键文案。
- QA 必须独立按规范表做桌面/移动端截图、坐标/字号/间距验收和文案验收。
- 调度中枢缺少上述材料不得标记 `accepted`。

## 2. 改了哪些文件

- `agent-workflow/governance/window-dispatch-hub.md`：新增并扩展 `5.1 页面类任务派发硬规则`，新增 `5.2 文案类任务派发硬规则`，并更新收口验收流程。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：新增并扩展 `7A 页面类任务硬性要求`，新增 `7B 文案类任务硬性要求`。
- `agent-workflow/reports/TASK-window-closeout-template.md`：新增并扩展 `4A 页面 / 文案类任务验收`。
- `agent-workflow/governance/agent-memory.md`：写入页面类和文案类任务派发闸门失效的长期记忆和新硬规则。
- `agent-workflow/reports/page-dispatch-gate-rules-2026-05-04.md`：新增并更新规则说明报告。
- `agent-workflow/reports/WSD-page-dispatch-gate-rules-closeout-2026-05-04.md`：新增本收口文件。

## 3. 未改哪些文件

本轮未修改：

- `04-Site/` 代码、页面、样式、数据或配置。
- 内容源 Markdown。
- 自动化任务。
- `sync-data.mjs`、`check-relations.mjs`、`check-point-quality.mjs`、`unified-site-sync.mjs`。
- 前台栏目、数据模型、权限、云端部署或商业化路径。

## 4. 运行了哪些检查

已运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed，6 项检查全部通过，失败项 0。

检查报告：

- `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-132941.md`

## 5. 哪些检查未运行及原因

- `content` Quality Gate：不运行。本轮不改内容源，避免触发网站数据同步。
- `site` / 浏览器截图：不运行。本轮不改前台页面。
- 多身份权限验收：不运行。本轮不改权限或 Admin 功能。

## 6. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

原因：本轮只改调度治理、派发模板、收口模板和长期记忆，不改 Markdown 字段、同步脚本、自动化时间线或统一同步闸门。

## 7. 需要回到主调度窗口合并

建议回到主调度窗口汇报：

```text
收口：agent-workflow/reports/WSD-page-dispatch-gate-rules-closeout-2026-05-04.md
```

主调度窗口应重点检查：

- 是否接受 `page-dispatch-gate-rules-2026-05-04.md`。
- 是否用新模板更新后续所有页面类派发单。
- 是否用新模板更新后续所有文案类派发单。
- 是否退回或重新派发现有首页 / Admin / 栏目页任务，补 UI/UE 页面规范表、Copy 文案规范表和 QA 独立验收。

## 8. 下一步建议

- 重新派发首页首屏 P0，不沿用旧轮播任务，先出 UI/UE 页面规范表。
- 派发 Admin 视觉与文案返修验收，用新页面 / 文案类规则复查模块间距、标题、字体层级、操作提示和后台文案。
- 派发全站栏目标题与 Copy 矩阵验收，统一 Daily / Signals / The Point / Opportunities / Trends 的标题位置、字号、行高、首屏节奏和栏目价值表达。

## 9. 调度中枢验收

2026-05-04 调度中枢已验收通过，状态更新为 `accepted`。

验收结论：

- 本轮属于计划外治理任务，牵头 Agent 为 Workflow / Automation Agent，协同 UI/UE Agent 与 QA / Acceptance Agent。
- 已确认 `window-dispatch-hub.md`、派发模板、收口模板和 `agent-memory.md` 均写入页面类任务硬闸门。
- 新规则明确：页面类任务缺少 UI/UE 页面规范表、Dev 逐条实现说明、QA 桌面 / 移动端截图和坐标 / 字号 / 间距验收时，调度中枢不得标记 `accepted`。
- 本轮未修改 `04-Site/`、内容源、同步脚本、自动化配置或前台数据。

调度中枢回填：

- `dispatch-board.md` 已新增 `SYS-3 / WSD-page-dispatch-gate-rules`，状态为 `accepted`。
- `progress.md` 与 `docs/agent-handoff.md` 已记录页面类任务派发闸门规则。
- 2026-05-04 21:26 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-132602.md`。

自动化影响确认：

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
