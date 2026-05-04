# WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade 派发单

日期：2026-05-04  
状态：merged  
调度窗口：当前主窗口  
牵头 Agent：`workflow` / `data`  
协作 Agent：`pm` / `qa`

## 1. 任务目标

> 2026-05-04 调度中枢更新：本任务已按用户要求合并进 `WSD-20260504-22-priority-engine-2-fast-track-implementation`，不再单独派发执行。

- 升级 `ai-2` 每日机会评分提示词，使其兼容 Priority Engine 2.0。
- 保留旧 30 分表兼容，不破坏现有同步和前台展示。
- 新增 Priority Engine 2.0 拆解段：Judgment Node、证据质量、需求真实度、趋势动量、观点智能、机会适配、反证强度、回测记忆。

## 2. 必读文件

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/agents/workflow-agent.md`
4. `agent-workflow/agents/data-agent.md`
5. `agent-workflow/product/priority-engine-2.md`
6. `agent-workflow/reports/priority-engine-2-2026-05-04.md`
7. `提示词/AI机会评分与趋势判断系统V4.0.md`
8. `agent-workflow/governance/automation-fallback-policy.md`

## 3. 允许改动范围

- `提示词/AI机会评分与趋势判断系统V4.0.md`
- 必要时新增提示词升级报告
- `agent-workflow/reports/WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade-closeout.md`

## 4. 禁止改动范围

- 不改 `04-Site/`
- 不改同步脚本
- 不改历史内容源
- 不改 `ai-3` 统一同步闸门
- 不删除旧 30 分表

## 5. 验收标准

- 旧 30 分评分表仍保留。
- 新增 Priority Engine 2.0 拆解段。
- 每条评分必须关联一个 Judgment Node 或标注为新候选。
- 文案不使用投资化表达。
- 明确 The Point 不作为事实证据直接加权。
- 说明对 `ai-2` 有影响，对 `ai-the-point` 和 `ai-3` 是否有后续影响。

## 6. 必跑检查

- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- UTF-8 读取更新后的提示词，确认中文无乱码。
