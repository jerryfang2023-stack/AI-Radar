# Agent Dispatch：2026-05-02 第一轮任务分配

## 结论

第一轮从 PM Agent 开始。

原因：当前最重要的不是马上改页面，而是先把栏目边界、功能优先级和验收标准定住。否则 UI、文案、数据和开发会各自优化，但方向可能不一致。

用户不需要进入每个 agent 的对话框。主对话负责分派 agent、等待结果、收敛冲突、写入任务文件；用户只需要对关键产品决策拍板。

## 已分配的 agent

### PM Agent

任务：

- 判断 Scoring 是否正式改为 Priorities。
- 明确 Priorities 与 Opportunities 的分工。
- 规划首页、Daily、Signals、Priorities、Trends、Opportunities、Tags 的第一阶段功能边界。
- 输出第一轮 PRD 优先级和验收标准。

交付：

- 建议 Scoring 对外改为 Priorities。
- Priorities 负责机会优先级，Opportunities 负责机会库和行动说明。
- 第一轮不做大改版，先完成栏目边界、前台表达、核心关联和权限隔离。

### Content / Data Agent

任务：

- 处理 4 条空赛道评分项。
- 设计 Signal 的事件标题字段。
- 建立 Opportunities 与 Priorities 的关联。
- 设计 Tags 字典第一版。
- 输出 schema-check、relation-check、dedupe-check 规则。

交付：

- 空赛道项建议补为 AI营销、AI基础设施服务、AI增长Agent。
- Signal 新增 `event_title`、`business_meaning`、`display_title` 等字段。
- Priority 必须关联 Opportunity。
- Tags 字典分为 track、scenario、customer、evidence、stage、action、region、risk。

### Dev / Workflow Agent

任务：

- 拆解 schema-check、relation-check、dedupe-check、content-quality-check。
- 设计普通端/管理端权限检查。
- 评估 Scoring 改 Priorities 的前端风险。
- 输出开发顺序、文件范围和验收方式。

交付：

- 先做 schema-check，再做 dedupe、relation、content-quality、public-admin 检查。
- Scoring 改 Priorities 需要前端兼容层，底层 scoring 数据可保留。

## 第一轮建议顺序

1. PM Agent：先解决栏目边界和 PRD 优先级。
2. Content / Data Agent：补字段、清空赛道、建立关系。
3. Dev / Workflow Agent：做自动检查脚本和权限检查。
4. UI / Design Agent：在产品边界确定后优化页面。
5. Copy Agent：在页面结构确定后优化文案。

## 当前需要拍板的冲突

当前工作流文件里曾出现一个方案：把 `Priorities` 合并进 `Opportunities`。本轮 PM Agent 的建议是：前台保留 `Priorities` 独立栏目，但把 `Scoring` 降级为后台评分引擎。

建议采用本轮 PM 方案：

- `Scoring` 不做前台栏目。
- `Priorities` 保留为前台机会优先级入口。
- `Opportunities` 保留为机会库和行动说明书。

原因：

- Priorities 解决“先看哪个”的问题。
- Opportunities 解决“这个机会怎么做”的问题。
- 两者用户任务不同，暂时不宜完全合并。
