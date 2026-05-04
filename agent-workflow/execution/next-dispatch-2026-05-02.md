# 2026-05-02 长期 Agent 本轮任务分配

本文件只分配给长期 agent 岗位，不创建临时 agent 线程。

调度硬规则：

- 依据：`governance/long-term-agent-dispatch-policy.md`
- 禁止：未经用户明确批准创建新的临时 agent
- 执行方式：所有任务写入 PRD、任务池、报告或执行计划

## 0. 共同输入

所有长期 agent 开始前必须读取：

```text
agent-workflow/product/strategy-single-source.md
agent-workflow/progress.md
agent-workflow/feature_list.json
```

## 1. Strategy Agent

owner：`strategy`

任务：

- 审核当前所有任务是否仍符合“面向商业决策者的 AI 机会判断系统”定位。
- 确认 Daily Brief 不输出行动建议，只输出信号、趋势、判断依据和风险边界。
- 确认 Scoring 后台化为 Priority Engine，不作为普通前台栏目。

输出文件：

```text
agent-workflow/reports/strategy-review-2026-05-02.md
```

验收：

- 能列出本轮允许做什么、不做什么。
- 能指出与战略事实源冲突的旧表达。

## 2. PM Agent

owner：`pm`

任务：

- 将最新战略事实源更新到 active PRD。
- 统一栏目边界：首页 / Daily Brief / Signals / Opportunities / Trends。
- 明确 Tags 为搜索、筛选和关系网络能力，不作为当前一线栏目。
- 明确 Admin 与普通前台的权限边界。
- 增加首页页面布局和排版优化要求，明确首页只承担品牌价值、今日判断入口和少量代表内容，不承载全部栏目内容。
- 拆分下一阶段 P0 / P1 开发任务。

输出文件：

```text
agent-workflow/execution/pm-next-sprint-2026-05-02.md
agent-workflow/prd/active/PRD-001-daily-brief.md
agent-workflow/prd/active/PRD-002-signals-system.md
agent-workflow/prd/active/PRD-003-opportunities-engine.md
agent-workflow/prd/active/PRD-004-trends-model.md
agent-workflow/prd/active/PRD-005-membership-access.md
agent-workflow/prd/active/PRD-006-homepage-layout.md
```

验收：

- 每个 PRD 都有目标、非目标、页面行为、字段依赖、权限边界和验收标准。
- 不再出现“Daily Brief 行动建议”作为核心结构。
- 首页优化任务必须包含信息层级、模块取舍、桌面/移动端排版验收点，并明确交给 UI/UE Agent 和 Copy Agent 的后续边界。

## 3. Data Agent

owner：`data`

任务：

- 定义 Signal、Daily Brief、Opportunity、Trend、Priority Engine、Tag 的字段规范。
- 建立 ID、slug、必填字段、关联字段和去重规则。
- 设计 Tags 字典，避免标签页变成长列表。
- 列出后续需要 Dev 实现的质量检查脚本。

输出文件：

```text
agent-workflow/product/data-schema.md
agent-workflow/product/tag-taxonomy.md
agent-workflow/reports/data-next-checks-2026-05-02.md
```

验收：

- 每类内容都有稳定 ID / slug 规则。
- Opportunity 可追溯 Signal、Trend 和 Priority Engine 记录。
- Tag 有分组、同义词和新增审核规则。

## 4. UI / UE Agent

owner：`ui-ue`

任务：

- 基于最新 UI 原则，定义首页、Daily Brief、Signals、Opportunities、Trends、Admin 的页面结构。
- 明确普通用户前台不得出现编辑、同步、恢复、访问状态等后台痕迹。
- 明确 Daily Brief 的视觉气质：商业内参，不是新闻流。
- 明确桌面与移动端验收点。

输出文件：

```text
04-Site/DESIGN.md
agent-workflow/product/ui-ue-page-spec.md
```

验收：

- 首页减少信息密度，突出价值判断入口。
- 栏目页各自独立承载完整内容。
- Admin 与普通前台视觉和交互边界清楚。

## 5. Copy Agent

owner：`copy`

任务：

- 为首页、Daily Brief、Signals、Opportunities、Trends、会员/试读页面建立文案规范。
- 输出禁用词和推荐表达。
- 确保文案克制、有观点、有证据边界，不替客户下最终判断。

输出文件：

```text
agent-workflow/product/copy-style-guide.md
agent-workflow/reports/copy-review-2026-05-02.md
```

验收：

- 不出现“稳赚、必然、一定、马上行动”等绝对化表达。
- 不出现 Markdown、JSON、同步、字段、脚本等后台语言。
- CTA 不制造焦虑，不承诺结果。

## 6. Dev Agent

owner：`dev`

任务：

- 等 PM、Data、UI、Copy 输出完成后再执行。
- 先不改网站页面。
- 只准备开发清单和影响范围评估。

输出文件：

```text
agent-workflow/reports/dev-impact-plan-2026-05-02.md
```

验收：

- 明确哪些文件会被改。
- 明确哪些功能需要先等人工确认。
- 明确本地验证和云端部署前检查方式。

## 7. QA Agent

owner：`qa`

任务：

- 基于 PRD、数据规范、UI 规范和文案规范，建立验收清单。
- 特别检查：普通前台无后台入口、Daily Brief 无行动指令、Scoring 不作为前台核心栏目。

输出文件：

```text
agent-workflow/verification/acceptance-checklist-2026-05-02.md
```

验收：

- 每个 P0 任务有可检查标准。
- 每个阻断项有风险等级。

## 8. Workflow Agent

owner：`workflow`

任务：

- 维护本轮任务状态。
- 将各 agent 输出沉淀到 `progress.md`。
- 更新 `feature_list.json`。
- 准备下一轮交接。

输出文件：

```text
agent-workflow/progress.md
agent-workflow/feature_list.json
agent-workflow/reports/workflow-handoff-2026-05-02.md
```

验收：

- 新会话可以只读 workflow 文件恢复状态。
- 没有任务只停留在对话里。
- 没有未经批准的新临时 agent。
