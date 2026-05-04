# 长期 Agent 调度硬规则

更新时间：2026-05-02

本规则用于防止把“分配给长期智能体”误操作成“重复创建临时智能体”。

## 1. 核心原则

观澜 AI 项目的 agent 是长期岗位，不是一次性对话线程。

长期 agent 的存在形式是：

- `agent-workflow/agents/*.md` 岗位说明书。
- `agent-workflow/feature_list.json` 任务池。
- `agent-workflow/prd/active/*.md` 活跃 PRD。
- `agent-workflow/execution/*.md` 本轮执行计划。
- `agent-workflow/progress.md` 进度账本。
- `agent-workflow/reports/*.md` 交付与验收报告。

因此，分配工作时必须把任务写入这些文件，而不是默认创建新的临时 agent 线程。

## 2. 严禁事项

除非用户明确批准，禁止：

1. 为已有岗位重复创建新的临时 agent。
2. 用 `spawn_agent` 代替长期 agent 的任务分配文件。
3. 把“PM Agent / Data Agent / UI Agent / Copy Agent / Dev Agent / QA Agent / Workflow Agent”的工作重新开成新的同名线程。
4. 在未说明原因、未取得确认的情况下启动临时执行线程。
5. 让临时线程产生未沉淀到 `agent-workflow` 的结论。

这条规则优先级高于一般并行效率考虑。

## 3. 正确分配方式

每轮工作按以下方式分配：

1. 读取 `product/strategy-single-source.md`。
2. 读取对应长期 agent 岗位说明书。
3. 在 `execution/` 中创建或更新本轮接力计划。
4. 在 `feature_list.json` 中登记任务、owner、优先级、状态和验收标准。
5. 必要时更新 `prd/active/*.md`。
6. agent 完成后把结果写入 `reports/` 或 `progress.md`。

任务 owner 只能使用长期岗位：

```text
strategy
pm
data
ui-ue
copy
dev
qa
workflow
signal-intelligence
daily-brief
opportunity-engine
trend-intelligence
commercial-site
```

## 4. 临时线程例外

只有在同时满足以下条件时，才允许创建临时线程：

1. 用户明确说“可以新建临时 agent”或“请并行启动 agent”。
2. 已说明为什么长期文档分配不足以完成该任务。
3. 已声明临时线程的写入范围。
4. 已声明临时线程完成后必须把结论沉淀回 `agent-workflow`。

如果用户没有明确批准，默认不创建。

## 5. 本轮执行要求

下一步应先创建或更新：

```text
agent-workflow/execution/next-dispatch-2026-05-02.md
```

该文件应列出：

- 分配给哪个长期 agent。
- 任务目标。
- 输入文件。
- 输出文件。
- 验收标准。
- 是否需要人工确认。

完成后再按顺序推进，不创建新的临时 agent。
