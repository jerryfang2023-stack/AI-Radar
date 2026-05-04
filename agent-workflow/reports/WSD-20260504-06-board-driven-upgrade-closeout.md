# WSD-20260504-06-board-driven-upgrade Closeout

日期：2026-05-04  
owner：`workflow` / `pm`  
状态：accepted  
编码：UTF-8

## 1. 对应任务

- 任务：将调度中枢升级为任务看板驱动。
- 派发单：本任务为调度机制优化，由当前调度窗口直接执行。

## 2. 本轮完成

- 将 `window-dispatch-hub.md` 从单次派发机制升级为看板驱动机制。
- 增加 `ready` 状态，用于表示派发单已预生成、等待领取。
- 增加 `执行：<看板编号或 Task ID>`、`看板`、`加入看板：...` 等快捷口令。
- 更新 `dispatch-board.md`，加入固定看板编号和首批 ready 任务。
- 为首批 5 个任务预生成派发单。
- 更新 `AGENTS.md` 和 `agent-memory.md` 中的调度口径。

## 3. 修改文件

- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/dispatch-board.md`
- `AGENTS.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/execution/WSD-20260504-01-copy-audit.md`
- `agent-workflow/execution/WSD-20260504-02-ui-screenshot-matrix.md`
- `agent-workflow/execution/WSD-20260504-03-admin-boundary-qa.md`
- `agent-workflow/execution/WSD-20260504-04-daily-brief-detail-productization.md`
- `agent-workflow/execution/WSD-20260504-05-automation-first-run-log-review.md`
- `agent-workflow/reports/WSD-20260504-06-board-driven-upgrade-closeout.md`

## 4. 验证结果

已运行：

- `node -e "JSON.parse(require('fs').readFileSync('agent-workflow/feature_list.json','utf8')); console.log('feature_list.json OK')"`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过，6 项检查全部 passed。

未运行：

- 浏览器检查：本任务只更新调度文档和派发单，不涉及前台页面。
- 同步 / 关系检查：本任务不改内容源、同步脚本或网站数据。

## 5. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

本任务只更新任务调度机制和 Markdown 派发文件，不改变自动化提示词、运行顺序、同步脚本或内容字段。

## 6. 风险与遗留

- 后续真实执行任务时，需要调度中枢在用户说 `执行：P0-1` 后，把看板状态从 `ready` 流转到 `dispatched` 或 `running`。
- 如果执行窗口没有提交 closeout 文件，不得标记任务 accepted。

## 7. 建议调度中枢更新

- `dispatch-board.md`：已更新为看板驱动。
- `feature_list.json`：如需细分，可后续新增单独 feature；当前仍归入 `GL-M3-011` 调度中枢机制。
- `progress.md`：建议补充本次升级记录。
- `docs/agent-handoff.md`：建议补充本次升级记录。

## 8. 下一步

建议优先执行：

1. `执行：P0-1`
2. `执行：P0-2`
3. `执行：P0-3`

