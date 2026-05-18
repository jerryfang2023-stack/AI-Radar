---
title: Copy-first 页面文案硬闸门升级
date: 2026-05-11
task_id: WSD-20260511-12-copy-first-page-gate-upgrade
status: accepted / governance-updated
owner: workflow / copy / qa
encoding: UTF-8
---

# Copy-first 页面文案硬闸门升级

## 1. 问题

用户指出：网站修改文案和新增页面文案没有真正按文案 Skill 执行，仍然充满 AI 味和拼凑感。

根因是：现有独立质检主要是开发后评审，缺少开发前 Copy-first 硬闸门。Dev 仍可能先拼页面，再临场补写文案。

## 2. 本次升级

新增：

- `agent-workflow/governance/copy-first-page-gate.md`

更新：

- `AGENTS.md`
- `agent-workflow/governance/current-context.md`
- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/governance/page-copy-quality-review-skill.md`
- `agent-workflow/agents/copy-agent.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/execution/TASK-page-copy-quality-review-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`

## 3. 新硬规则

- 页面 / 文案类任务进入 Dev 前，必须先由 Copy Agent 输出可直接落地的 Copy 文案规范表。
- Copy 表必须包含最终文案，不得只写“优化文案”“提升高级感”等方向。
- Dev 只能按表实现。
- Dev 不得临场补写首页首屏、栏目标题、详情页 H1、CTA、卡片标题、会员态、空状态或关键说明。
- 如果必须新增表外文案，任务状态改为 `blocked / copy-required`，回退 Copy 复核。
- 开发 closeout 必须说明是否 100% 按表实现、是否新增表外文案、禁用语扫描和文案自然度自查。
- 独立质检缺 Copy 表时，必须 `needs-input`，不得 accepted。

## 4. 验证

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。

## 5. 后续影响

后续派发页面、栏目、详情、会员、Admin、首页模块和文案任务时，必须把 Copy-first 作为开发前硬闸门。独立质检仍保留，作为开发后闸门。
