# WSD-20260504-22 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-22-priority-engine-2-fast-track-implementation

优先级：
P0 / highest

任务目标：
把 Priority Engine 2.0 尽快从模型文档推进到第一版可运行能力。不要拆成多个窗口；请在一个执行窗口连续完成 PM 确认、ai-2 提示词升级、Dev 解析实现、QA 验收，并尽量推进到可运行 / 可预览状态。

牵头角色：
PM Agent、Intelligence Data Agent、Dev Agent

协作角色：
Workflow / Automation Agent、QA / Acceptance Agent、Copy Agent

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/governance/quality-gates.md
5. agent-workflow/governance/automation-fallback-policy.md
6. agent-workflow/execution/WSD-20260504-22-priority-engine-2-fast-track-implementation.md
7. agent-workflow/product/priority-engine-2.md
8. agent-workflow/reports/priority-engine-2-2026-05-04.md
9. agent-workflow/execution/PLAN-priority-engine-2-2026-05-04.md
10. agent-workflow/prd/active/PRD-003-opportunities-engine.md
11. agent-workflow/prd/active/PRD-004-trends-model.md
12. agent-workflow/product/opportunity-priority-schema.md
13. agent-workflow/product/relation-check-schema.md
14. agent-workflow/product/COPY.md
15. 提示词/AI机会评分与趋势判断系统V4.0.md
16. 04-Site/scripts/sync-data.mjs
17. 04-Site/scripts/check-relations.mjs
18. 04-Site/config/content-paths.json

合并范围：
以下四个任务已合并到本任务，不再单独执行：
- WSD-20260504-18-priority-engine-2-pm-boundary
- WSD-20260504-19-ai-2-priority-engine-2-prompt-upgrade
- WSD-20260504-20-judgment-node-dev-plan
- WSD-20260504-21-priority-engine-2-qa-criteria

必须完成：
1. PM 边界确认：
   - Priority Engine 2.0 是后台判断能力，不新增前台栏目。
   - Judgment Node 是后台判断节点，不是公司榜单、投资建议或单条新闻评分。
   - 旧 30 分表短期保留，避免破坏现有同步。
2. ai-2 提示词升级：
   - 更新 `提示词/AI机会评分与趋势判断系统V4.0.md`。
   - 保留旧 30 分评分表。
   - 新增 Priority Engine 2.0 拆解段。
   - The Point 只作为观点共识、分歧和边界信号，不作为事实证据直接加权。
3. Dev 第一版实现：
   - 扩展 `sync-data.mjs`，能解析或派生 Judgment Node 相关字段。
   - 扩展网站数据输出，保持旧字段兼容。
   - 扩展 `check-relations.mjs`，检查 Priority Row -> Judgment Node 基础关系完整性。
   - 如果历史 Markdown 没有 2.0 字段，使用 derived 降级策略，不批量重写旧内容源。
4. QA 验收：
   - 抽查至少 5 条 Priority / Opportunity / Trend 的 Judgment Node 结果。
   - 检查关系硬错误。
   - 检查非投资化表达。
   - 检查 The Point 未被当作事实证据直接加权。

允许改动：
- agent-workflow/product/priority-engine-2.md
- agent-workflow/prd/active/PRD-003-opportunities-engine.md
- agent-workflow/prd/active/PRD-004-trends-model.md
- 提示词/AI机会评分与趋势判断系统V4.0.md
- 04-Site/scripts/sync-data.mjs
- 04-Site/scripts/check-relations.mjs
- 04-Site/data/radar-data.json
- 04-Site/data/radar-data.js
- agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md
- 必要的 QA / 关系检查报告

禁止：
- 不新增普通前台栏目。
- 不删除旧 30 分评分表。
- 不批量重写历史内容源。
- 不修改 ai-3 统一同步闸门。
- 不输出投资建议、公司排行榜或确定性判断。
- 不使用“做多 / 做空 / 必投 / 稳赚 / 确定性机会”等表达。

必跑检查：
- node --check 04-Site/scripts/sync-data.mjs
- node --check 04-Site/scripts/check-relations.mjs
- node --check 04-Site/js/app.js
- node 04-Site/scripts/sync-data.mjs
- node 04-Site/scripts/check-relations.mjs
- node agent-workflow/tools/run-quality-gates.mjs syntax
- UTF-8 读取更新后的提示词和报告，确认中文无乱码

上线 / 预览要求：
完成实现后，若 Netlify 预览环境已经可用或授权可用，尽量衔接预览部署并记录 URL；若无法部署，不要假装上线，必须写清阻塞点，并给出本地可运行验证结果。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md

收口文件必须写清：
- 任务状态：done / partial / blocked
- PM 边界确认结论
- ai-2 提示词改了什么
- Dev 实现了哪些字段、脚本和兼容策略
- QA 抽查了哪些样本
- 运行了哪些检查
- 哪些检查未运行及原因
- 是否已进入可运行 / 可预览状态
- 如未上线，阻塞点是什么
- 是否影响 ai-the-point、ai-2、ai-3
- 是否可以由主调度窗口验收

完成后回到主调度窗口汇报：

收口：agent-workflow/reports/WSD-20260504-22-priority-engine-2-fast-track-implementation-closeout.md
