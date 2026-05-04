---
title: WSD PM Module Governance Closeout
date: 2026-05-04
type: closeout
status: review
owner: pm / workflow
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# WSD PM Module Governance Closeout

## 1. 做了什么

根据用户要求，已将 PM Agent 的功能模块构建和存量治理原则升级为“宁缺毋滥”。

PM Agent 后续新增、保留、强化、合并、后台化、隐藏或淘汰模块前，必须先判断商业价值、与现有模块关系、目标用户接受和付费意愿、使用体验顺畅度、战略核心贴合度。

本规则不仅是新增模块的决策门槛，也是现有模块的优化和淘汰标准。既有模块不适合目标用户、商业价值有限、路径不顺或偏离战略核心时，PM 必须提出优化、合并、后台化、隐藏、延期复核或淘汰方案。

根据用户追加要求，本轮进一步设置了 PM 新增功能门禁：任何新增功能、页面、入口、视图、筛选、后台能力、会员能力、自动化产物或数据维度，都必须先过 WAVE 门禁，判断它是否是观澜AI真正需要的功能。

## 2. 改了哪些文件

- `agent-workflow/agents/pm-agent.md`：新增“宁缺毋滥模块生命周期治理”、模块决策表、工作流和验收标准。
- `agent-workflow/agents/agent-registry.json`：将 PM primary outputs 补充为包含“新增功能门禁记录”和“模块决策表”。
- `agent-workflow/governance/agent-memory.md`：写入 PM 模块治理长期记忆。
- `agent-workflow/governance/window-dispatch-hub.md`：新增产品功能类任务派发硬规则，要求先过 PM 新增功能门禁。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：新增产品功能类任务硬性要求、新增功能门禁记录和模块决策表。
- `agent-workflow/reports/pm-module-governance-2026-05-04.md`：新增本轮治理报告。
- `agent-workflow/reports/WSD-pm-module-governance-closeout-2026-05-04.md`：新增本收口文件。
- `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-150110.md`：本轮语法闸门报告。
- `agent-workflow/reports/quality-gates-syntax-latest.md`：由语法闸门自动刷新 latest 指针。

## 3. 未改哪些文件

- 未修改 `04-Site/`。
- 未修改内容源 Markdown。
- 未修改自动化任务。
- 未修改 `sync-data.mjs`、`check-relations.mjs`、`unified-site-sync.mjs`。
- 未新增临时 agent。
- 未执行具体产品功能开发。
- 未改变前台栏目、数据模型、权限、云端部署或商业化路径。

## 4. 检查

已运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`

结果：passed，6 项语法检查全部通过，失败项 0。

报告：

- `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-150110.md`

## 5. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 6. 需要回到主调度窗口合并

```text
收口：agent-workflow/reports/WSD-pm-module-governance-closeout-2026-05-04.md
```

主调度窗口应合并：

- PM Agent 的“宁缺毋滥模块生命周期治理”。
- 后续产品功能类派发单必须要求 PM 先输出模块决策表。
- 未通过模块决策表的需求不得进入 Dev。
- 既有模块未通过模块决策表时，必须进入优化、合并、后台化、隐藏、延期复核或淘汰路径。
- PM 新增功能门禁和 WAVE 评分：Worth paying for、Alignment、Validation、Experience / Effort。
