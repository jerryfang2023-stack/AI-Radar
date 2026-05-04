# WSD-20260504-00-dispatch-hub Closeout

日期：2026-05-04  
owner：`workflow` / `pm`  
状态：accepted  
编码：UTF-8

## 1. 对应任务

- 任务：建立调度中枢窗口机制。
- 派发单：本任务由当前调度窗口直接建立长期机制，未单独创建执行窗口。

## 2. 本轮完成

- 建立 `window-dispatch-hub.md`，定义当前窗口作为调度中枢的职责、状态、快捷口令、派发和收口流程。
- 建立 `dispatch-board.md`，作为当前窗口任务看板。
- 建立任务派发模板 `TASK-window-dispatch-template.md`。
- 建立收口模板 `TASK-window-closeout-template.md`。
- 将机制写入 `AGENTS.md`、`governance/README.md`、`workflow-agent.md`、`agent-memory.md`、`progress.md` 和 `feature_list.json`。
- 将 handoff / closeout 文件 UTF-8 规则纳入机制。

## 3. 修改文件

- `AGENTS.md`：新增调度中枢窗口机制与快捷口令。
- `agent-workflow/governance/window-dispatch-hub.md`：新增长期调度规则。
- `agent-workflow/execution/dispatch-board.md`：新增当前调度看板。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：新增派发单模板。
- `agent-workflow/reports/TASK-window-closeout-template.md`：新增收口模板。
- `agent-workflow/governance/README.md`：补充治理文件地图与调度中枢规则。
- `agent-workflow/agents/workflow-agent.md`：补充 Workflow Agent 维护调度中枢职责。
- `agent-workflow/governance/agent-memory.md`：补充长期记忆。
- `agent-workflow/progress.md`：记录机制建立。
- `agent-workflow/feature_list.json`：新增 `GL-M3-011`。

## 4. 验证结果

已运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过，6 项检查全部 passed。

未运行：

- 浏览器截图检查：本任务只更新工作流和 Markdown 文档，不涉及前台页面。
- 同步与关系检查：本任务不改内容源、同步脚本或网站数据。

## 5. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

本任务只更新工作流治理、派发模板、收口模板和调度看板，不改变自动化提示词、运行顺序、Markdown 内容字段、同步脚本或质量闸门。

## 6. 风险与遗留

- 后续需要在真实任务派发和收口中持续使用该机制，观察是否需要进一步简化口令或模板。
- 如果执行窗口忘记写 closeout 文件，调度中枢不得直接标记 accepted，应退回补写。

## 7. 建议调度中枢更新

- `dispatch-board.md`：已新增本机制任务并标记 accepted。
- `feature_list.json`：已新增 `GL-M3-011` 并标记 passed。
- `progress.md`：已记录机制建立。
- `docs/agent-handoff.md`：已补充交接规则。

## 8. 下一步

建议用新机制派发第一批任务：

1. `派发：全站前台 Copy 语气审计`
2. `派发：Signals / Daily / Opportunities / Trends UI 截图矩阵验收`
3. `派发：普通前台与 Admin 边界复查`

