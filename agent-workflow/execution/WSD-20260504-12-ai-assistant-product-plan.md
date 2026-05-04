# WSD-20260504-12-ai-assistant-product-plan 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`strategy` / `pm`

## 1. 任务目标

规划“观澜AI 助理”产品能力：AI 助理可在网页端或手机端与客户对话交流，帮助客户理解 Signals、Trends、Opportunities、The Point 和每日简报。

## 2. 非目标

- 本任务不直接开发 AI 助理。
- 不调用外部模型 API。
- 不接入真实用户数据。
- 不决定最终技术栈。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| Strategy Agent | 判断 AI 助理是否符合观澜AI定位和商业化路径 |
| PM Agent | 输出用户场景、功能边界、MVP、权限和验收 |
| Intelligence Data Agent | 后续定义可回答的数据范围和引用边界 |
| Dev Agent | 后续输出技术方案 |
| QA Agent | 后续验收回答边界和风险 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-12-ai-assistant-product-plan.md`
5. `agent-workflow/product/strategy-single-source.md`
6. `agent-workflow/product/commercial-operating-model.md`
7. `agent-workflow/product/intelligence-data-model.md`

## 5. 允许改动范围

- 可新增 `agent-workflow/reports/ai-assistant-product-plan-2026-05-04.md`
- 可新增 `agent-workflow/prd/active/PRD-009-ai-assistant.md`
- `agent-workflow/reports/WSD-20260504-12-ai-assistant-product-plan-closeout.md`

## 6. 禁止改动范围

- 不改网站代码。
- 不改自动化任务。
- 不接入模型 API。
- 不承诺投资、经营或合作建议。

## 7. 预期输出

- AI 助理战略判断。
- 用户场景和核心问题。
- MVP 功能范围。
- 网页端 / 手机端入口方案。
- 数据引用和回答边界。
- 权限、商业化和风险说明。
- 后续 Data / Dev / QA 派发建议。
- 收口文件：`agent-workflow/reports/WSD-20260504-12-ai-assistant-product-plan-closeout.md`

## 8. 必跑检查

- [x] `node agent-workflow/tools/run-quality-gates.mjs syntax`

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：规划阶段否。
- 是否可能影响 `ai-2`：规划阶段否。
- 是否可能影响 `ai-3`：规划阶段否。

后续开发可能影响权限、数据接口和云端部署，必须另起 Plan-first 实施任务。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-12-ai-assistant-product-plan.md

你是本任务的独立执行窗口，只处理派发单中允许的范围。
请以 Strategy Agent + PM Agent 口径规划“观澜AI 助理”产品能力，明确网页端或手机端与客户对话交流的场景、MVP、边界、数据引用和风险。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-12-ai-assistant-product-plan-closeout.md
```

