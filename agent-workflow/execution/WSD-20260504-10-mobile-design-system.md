# WSD-20260504-10-mobile-design-system 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue` / `qa`

## 1. 任务目标

将移动端设计作为独立任务推进，建立全站移动端设计规则，并对关键页面做移动端验收。

## 2. 非目标

- 不同时处理桌面端大改。
- 不改数据模型。
- 不改自动化任务。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Agent | 输出移动端布局规则、导航、首屏、详情页阅读规则 |
| QA Agent | 移动端验收和截图记录 |
| Dev Agent | 后续修复移动端样式问题 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-10-mobile-design-system.md`
5. `agent-workflow/product/DESIGN.md`
6. `agent-workflow/agents/ui-ue-agent.md`
7. `agent-workflow/agents/qa-agent.md`

## 5. 允许改动范围

- 可新增 `agent-workflow/reports/mobile-design-system-2026-05-04.md`
- 可新增移动端截图到 `agent-workflow/reports/`
- `agent-workflow/reports/WSD-20260504-10-mobile-design-system-closeout.md`

## 6. 禁止改动范围

- 不改 `04-Site/` 代码，除非调度中枢另行派发。
- 不改自动化任务。

## 7. 预期输出

- 移动端设计规则。
- 关键页面移动端问题清单。
- 后续 Dev 修复任务建议。
- 收口文件：`agent-workflow/reports/WSD-20260504-10-mobile-design-system-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [x] 移动端浏览器检查或说明未运行原因

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否。
- 是否可能影响 `ai-2`：否。
- 是否可能影响 `ai-3`：否。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-10-mobile-design-system.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
请把移动端设计作为独立任务，输出全站移动端规则、关键页面问题清单和后续 Dev 修复建议。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-10-mobile-design-system-closeout.md
```

