---
title: UI / UE Design Director Upgrade Report
date: 2026-05-04
type: agent-upgrade-report
status: accepted
owner: ui-ue / workflow
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# UI / UE Design Director Upgrade Report

## 1. 升级结论

`ui-ue-agent` 已原地升级为 `UI / UE Design Director`。

本轮不新增长期 Agent，不改变八 Agent 架构。

## 2. 为什么升级

首页、后台、栏目页和海报方案多次出现：

- 不高级。
- 栏目不紧凑。
- 海报不符合网站调性。
- 排版杂乱。
- 标题、字号、间距不统一。
- 页面像模板页或后台组件堆叠。

根因是 UI/UE Agent 过去更像页面修补者，而不是全站视觉总监。后续重做全站 UI 必须先定 Art Direction 和视觉母版。

## 3. 新职责

UI / UE Design Director 负责：

- Art Direction。
- DESIGN v2。
- 页面母版。
- 字体和间距系统。
- 色彩和材质系统。
- 海报与视觉资产规则。
- 审美阻塞项。
- 截图验收矩阵。

## 4. 新硬规则

以下任务不得直接进入 Dev：

- 全站 UI 重设计。
- 首页重设计。
- 栏目体系重设计。
- Admin 重设计。
- 海报 / 首屏视觉任务。

必须先由 Design Director 输出：

- Art Direction。
- 全站视觉母版。
- 字体和间距系统。
- 色彩和材质系统。
- 海报与视觉资产规则。
- 审美阻塞项。

## 5. 审美阻塞项

以下情况必须阻塞：

- 页面不高级、粗糙、简陋、像模板页。
- 栏目不紧凑，标题位置、字号、行高或模块起点不一致。
- 海报不符合网站调性，像 AI 氛围图或素材图。
- 排版杂乱，主次不清。
- 字体大小随意，缺少统一层级。
- 文案长度破坏布局，但 UI 未要求 Copy 重写。
- Admin 像前台页面，或前台像后台组件。

## 6. 已更新文件

- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/agents/agent-registry.json`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/execution/ui-ue-design-director-upgrade-2026-05-04.md`
- `agent-workflow/reports/ui-ue-design-director-upgrade-2026-05-04.md`

## 7. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

本轮只改长期 Agent 职责说明和治理文档，不改网站代码、内容源、同步脚本或自动化任务。
