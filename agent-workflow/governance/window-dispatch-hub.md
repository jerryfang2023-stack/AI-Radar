# Window Dispatch Hub

更新时间：2026-05-04  
owner：`pm` / `workflow`  
状态：长期生效

## 1. 定位

本文件定义“调度中枢窗口”机制。

当前主窗口是任务看板驱动的调度中枢，只负责：

- 维护任务看板。
- 接收用户的新任务并加入看板。
- 判断牵头长期 Agent。
- 预生成或更新任务派发单。
- 将任务从 `ready` 流转到 `running` / `review` / `accepted`。
- 等待独立执行窗口完成。
- 读取收口文件。
- 验收收口质量。
- 更新进度、看板和下一步。

具体执行任务应在单独窗口完成。执行窗口结束后，必须回到调度中枢窗口汇报，并提供收口文件路径。

## 2. 任务 ID

任务 ID 统一使用：

```text
WSD-YYYYMMDD-NN-short-name
```

示例：

```text
WSD-20260504-01-copy-audit
WSD-20260504-02-ui-screenshot-matrix
```

## 3. 状态

| 状态 | 含义 |
|---|---|
| `backlog` | 已记录，尚未派发 |
| `ready` | 已生成派发单，等待用户领取执行 |
| `dispatched` | 已给出执行窗口提示词，等待独立窗口启动 |
| `running` | 执行窗口正在处理 |
| `review` | 已提交收口文件，等待本窗口验收 |
| `accepted` | 收口通过，进度已回填 |
| `blocked` | 有阻塞，需要用户或 PM 决策 |

## 4. 快捷口令

用户可在调度中枢窗口使用以下短句：

```text
执行：<看板编号或 Task ID>
```

PM / Workflow Agent 应从 `dispatch-board.md` 找到对应任务，输出：

- Task ID。
- 派发单路径。
- 独立执行窗口复制提示词。
- 预期 closeout 路径。
- 必跑检查。

如用户确认该任务已开新窗口执行，则把状态更新为 `running`。

```text
派发：<任务描述>
```

PM / Workflow Agent 应输出：

- 任务 ID。
- 牵头 Agent。
- 看板编号。
- 派发单路径。
- 执行窗口复制提示词。
- 需要读取的文件。
- 输出和收口文件路径。
- 必跑 Quality Gates。

```text
收口：<closeout 文件路径>
```

PM / Workflow Agent 应读取收口文件并检查：

- 是否说明任务目标、改动文件、验证结果、遗留风险。
- 是否说明自动化影响。
- 是否通过对应 Quality Gates。
- 是否需要更新 `feature_list.json`、`progress.md`、`docs/agent-handoff.md`。
- 是否可以标记 `accepted`，或退回补充。

```text
状态
```

输出 `agent-workflow/execution/dispatch-board.md` 中当前任务状态。

```text
看板
```

等同于 `状态`，但优先输出 ready / running / review 任务。

```text
下一批
```

根据当前 backlog 和项目交接，列出建议派发顺序。

```text
加入看板：<优先级> <牵头 Agent> <任务描述>
```

将新任务写入 `dispatch-board.md`，必要时创建派发单。任务复杂或影响重大时，应先按 Plan-first 创建计划。

```text
阻塞：<task-id> <原因>
```

把任务标记为 `blocked`，并写清需要谁决策。

## 5. 派发单

看板驱动模式下，调度中枢应尽量提前为 ready 任务创建派发单：

```text
agent-workflow/execution/<task-id>.md
```

派发单模板见：

```text
agent-workflow/execution/TASK-window-dispatch-template.md
```

派发单必须写清：

- 任务目标。
- 非目标。
- 牵头 Agent 和协作 Agent。
- 执行窗口启动时必须读取的文件。
- 允许改动的文件范围。
- 禁止改动的文件范围。
- 预期收口文件路径。
- 必跑检查。
- 自动化影响判断。

## 6. 收口文件

每个独立执行窗口结束前，必须生成收口文件：

```text
agent-workflow/reports/<task-id>-closeout.md
```

收口模板见：

```text
agent-workflow/reports/TASK-window-closeout-template.md
```

所有 handoff、closeout、阶段总结 Markdown 必须保存为 UTF-8。

## 7. 看板流转流程

### 7.1 领取执行

用户输入：

```text
执行：P0-1
```

调度中枢应：

1. 读取 `dispatch-board.md`。
2. 找到 `P0-1` 对应 Task ID。
3. 读取派发单。
4. 输出独立执行窗口提示词。
5. 将看板状态从 `ready` 更新为 `dispatched` 或 `running`。

### 7.2 收口验收

收到 `收口：<path>` 后，按以下流程处理：

1. 用 UTF-8 读取收口文件。
2. 核对任务 ID 与派发单是否一致。
3. 检查改动文件是否超出派发范围。
4. 检查 Quality Gates 是否运行，未运行项是否说明原因。
5. 检查是否影响自动化任务。
6. 如涉及外部 GitHub skill / repo，检查来源、安装路径、静态安全审查、风险等级和观澜AI适配边界。
7. 如通过，更新 `dispatch-board.md` 为 `accepted`。
8. 必要时更新 `feature_list.json`、`progress.md`、`docs/agent-handoff.md`。
9. 输出下一步建议。

如果收口文件缺少关键内容，调度中枢不应代补事实，应退回执行窗口补充。

## 8. 执行窗口启动提示词

调度中枢给执行窗口的提示词应包含：

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. <本任务派发单路径>

你是本任务的执行窗口，只处理派发单中的范围。
完成后必须生成 UTF-8 收口文件：
<closeout 文件路径>

收口文件必须写清：
- 做了什么
- 改了哪些文件
- 运行了哪些检查
- 哪些检查未运行及风险
- 是否影响自动化任务
- 下一步应回到调度中枢窗口处理什么
```

## 9. 禁止事项

- 调度中枢窗口不直接吞掉大任务执行，除非任务非常小且用户明确要求。
- 独立执行窗口不得超出派发单范围。
- 执行窗口不得只在聊天中汇报，必须写收口文件。
- 收口文件不得省略 Quality Gates 和自动化影响。
- 未回填进度的任务不得标记为 `accepted`。
