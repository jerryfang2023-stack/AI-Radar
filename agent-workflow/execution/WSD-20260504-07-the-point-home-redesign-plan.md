# WSD-20260504-07-the-point-home-redesign-plan 派发单

日期：2026-05-04  
状态：review  
调度窗口：当前主窗口  
牵头 Agent：`strategy` / `pm`

## 1. 任务目标

为 The Point 首页改版制定方向和执行需求。当前问题是 The Point 首页价值表达平庸，没有突出“一线观点如何帮助商业判断”的独特价值。

本任务先由 Strategy Agent 和 PM Agent 定方向，再交给 Copy Agent 和 UI / UE Agent 执行。

## 2. 非目标

- 本任务不直接写代码落地页面。
- 不改 The Point 数据模型和自动化规则。
- 不新增栏目。
- 不改变 The Point 在导航中的位置。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Strategy Agent | 明确 The Point 的战略价值、用户场景和与 Signals / Trends 的边界 |
| PM Agent | 输出改版目标、页面模块、非目标、验收标准和后续任务拆分 |
| Copy Agent | 后续负责标题、栏目价值表达、CTA |
| UI / UE Agent | 后续负责首页结构、首屏节奏、卡片层级 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-07-the-point-home-redesign-plan.md`
5. `agent-workflow/agents/strategy-agent.md`
6. `agent-workflow/agents/pm-agent.md`
7. `agent-workflow/product/the-point-model.md`
8. `agent-workflow/product/strategy-single-source.md`
9. `agent-workflow/product/DESIGN.md`
10. `agent-workflow/product/COPY.md`

## 5. 允许改动范围

- `agent-workflow/execution/WSD-20260504-07-the-point-home-redesign-plan.md`
- `agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md`
- 可新增 `agent-workflow/reports/the-point-home-redesign-plan-2026-05-04.md`
- 必要时更新 `agent-workflow/execution/dispatch-board.md` 的后续任务建议

## 6. 禁止改动范围

- 不改 `04-Site/` 页面文件。
- 不改 `05-Point/` 内容源。
- 不改自动化任务和同步脚本。

## 7. 预期输出

- The Point 首页改版战略判断。
- PM 页面模块和执行任务拆分。
- 后续 Copy / UI / Dev / QA 派发建议。
- 收口文件：`agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 本任务为规划任务，不需要浏览器检查；如未运行需在收口说明。

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否，本任务只做页面方向和需求规划。
- 是否可能影响 `ai-2`：否。
- 是否可能影响 `ai-3`：否。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-07-the-point-home-redesign-plan.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
请以 Strategy Agent + PM Agent 口径，为 The Point 首页改版制定方向，突出一线观点对商业判断的价值，并拆出后续 Copy / UI / Dev / QA 任务。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md
```

## 11. 执行窗口输出

本任务已由独立执行窗口完成规划收口，未进入页面开发。

- 规划报告：`agent-workflow/reports/the-point-home-redesign-plan-2026-05-04.md`
- 收口文件：`agent-workflow/reports/WSD-20260504-07-the-point-home-redesign-plan-closeout.md`

后续建议由调度中枢按报告中的任务拆分继续派发 Copy / UI / Dev / QA，不在本窗口直接实现页面。
