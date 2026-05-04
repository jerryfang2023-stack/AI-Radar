---
title: UI / UE Design Director Upgrade
date: 2026-05-04
type: plan
status: completed
owner: ui-ue / workflow
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# UI / UE Design Director Upgrade

## 1. 背景

用户反馈：网站方案和海报方案多次出现“不高级、栏目不紧凑、海报不符合网站调性、排版杂乱”等问题。

复盘判断：这不是单点样式问题，而是 UI/UE Agent 过去更偏页面修补，缺少全站视觉总监职责。

## 2. 目标

将现有 `ui-ue-agent` 原地升级为 `UI / UE Design Director`。

不新增第九个长期 Agent，不改变八 Agent 架构。

## 3. 非目标

- 不直接重做网站 UI。
- 不修改 `04-Site/`。
- 不生成海报或页面资产。
- 不改变产品定位、栏目、权限、数据模型或自动化任务。

## 4. 改动范围

- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/agents/agent-registry.json`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/reports/ui-ue-design-director-upgrade-2026-05-04.md`
- `agent-workflow/reports/WSD-ui-ue-design-director-upgrade-closeout-2026-05-04.md`

## 5. 升级内容

- 岗位名称升级为 `UI / UE Design Director`。
- 新增强制输出：Art Direction、全站视觉母版、字体和间距系统、色彩和材质系统、海报与视觉资产规则、审美阻塞项。
- 明确 Design Director 对“不高级、粗糙、海报不合调性、排版杂乱、字体随意、栏目不紧凑”拥有阻塞权。
- 明确全站 UI、首页、栏目、Admin、海报任务必须先定方向和母版，再进入 Dev。

## 6. 验收标准

- `agent-registry.json` 名称和 primary outputs 已更新。
- `ui-ue-agent.md` 明确 Design Director 职责。
- `agent-memory.md` 写入长期记忆。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。

