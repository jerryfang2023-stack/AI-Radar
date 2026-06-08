---
task_id: <TASK-ID>
title: <任务标题>
status: ready
owner: <Agent>
encoding: UTF-8
---

# <TASK-ID>｜<任务标题>

## 1. 任务目标

<说明本任务要解决的问题。>

## 2. 最小读取

1. `AGENTS.md`
2. `context/context-index.md`
3. `<本派发单路径>`
4. `<任务相关的 1-3 个 current 文件或 Skill>`
5. 高风险流程必须加入 `context/06-execution-harness.md`

不要自行扩大读取范围。上下文不足时先说明缺什么。

## 3. 执行边界

允许：

- <允许修改或检查的范围>

不允许：

- 推送 GitHub，除非用户明确要求。
- 恢复 Netlify 作为网站部署路径。
- 恢复已删除链路。
- 顺手处理与本任务无关的内容漂移。

## 4. 输出

- <交付物 1>
- <交付物 2>
- closeout：`agent-workflow/reports/<TASK-ID>-closeout.md`
- 高风险流程 closeout 必须说明使用的 harness、固定读取、质量门和下游放行结论。

## 5. 验证

按任务类型运行最小验证，并在 closeout 中说明。
