# WSD-20260504-19 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade

牵头角色：
Workflow / Automation Agent、Intelligence Data Agent

协作角色：
PM Agent、QA / Acceptance Agent

任务目标：
升级 `ai-2` 每日机会评分提示词，使其兼容 Priority Engine 2.0。必须保留旧 30 分表兼容，同时新增 Priority Engine 2.0 拆解段，不破坏现有同步。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/agents/workflow-agent.md
4. agent-workflow/agents/data-agent.md
5. agent-workflow/product/priority-engine-2.md
6. agent-workflow/reports/priority-engine-2-2026-05-04.md
7. 提示词/AI机会评分与趋势判断系统V4.0.md
8. agent-workflow/governance/automation-fallback-policy.md

允许改动：
- 提示词/AI机会评分与趋势判断系统V4.0.md
- agent-workflow/reports/WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade-closeout.md

禁止改动：
- 04-Site/
- 内容源 Markdown
- 同步脚本
- ai-3 统一同步闸门
- 自动化时间线

执行要求：
- 保留旧 30 分评分表。
- 新增 Priority Engine 2.0 拆解段。
- 每条评分必须关联 Judgment Node 或标注为新候选。
- The Point 只能作为观点共识、分歧和边界信号，不作为事实证据直接加权。
- 对外状态使用“优先验证 / 持续观察 / 早期观察 / 谨慎观察 / 暂缓关注”。
- 禁止“做多 / 做空 / 必投 / 确定性机会”等表达。

必跑检查：
- node agent-workflow/tools/run-quality-gates.mjs syntax
- UTF-8 读取更新后的提示词，确认中文无乱码

完成后生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade-closeout.md

完成后回主调度窗口汇报：
收口：agent-workflow/reports/WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade-closeout.md
