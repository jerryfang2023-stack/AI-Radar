# Agent 角色与交付物

> 历史说明：本文件是早期角色记录，仅在追溯历史角色时读取。V2 当前长期 Agent 以 `AGENTS.md`、`agent-workflow/agents/`、`agent-workflow/governance/v2-current-rule-overrides.md` 为准。

## PM Agent

职责：

- 判断栏目是否保留、合并、隐藏或升级。
- 把用户问题转成 PRD 和开发任务。
- 维护路线图、里程碑、验收标准。
- 收敛 Strategy、UI、Content、Dev、Copy 的意见。

固定交付物：

- 产品判断结论。
- PRD 或任务拆解。
- 栏目变更记录。
- 验收标准。

PM Agent 不直接做：

- 具体 UI 设计。
- 最终文案润色。
- 代码实现。
- 每日内容生成。

## Strategy Agent

职责：

- 维护项目定位、目标用户、商业化路径。
- 判断新功能是否偏离品牌方向。
- 评估市场与竞争参考。

交付物：

- product-strategy 更新建议。
- 商业化阶段判断。
- 风险与边界提醒。

## UI / Design Agent

职责：

- 按 `DESIGN.md`、`docs/brand/wavesight-ai-vi/`、`design-taste-frontend` / `gpt-taste` / `redesign-existing-projects` / `high-end-visual-design` 和 `awesome-design-md` 优化视觉、排版、页面结构；不再使用 `frontend-design`。
- 负责官网页面设计、视觉系统、logo、首屏风格图、海报、卡片视觉、会员页与报告视觉模板。
- 保证普通端高级、克制、可信。
- 保证管理端清晰、稳定、可操作。

交付物：

- 页面设计方案。
- 品牌视觉方案。
- Logo 与视觉资产方向。
- 海报 / 报告封面 / 首屏视觉图方案。
- 组件规则。
- 截图验收建议。
- DESIGN.md 更新建议。

## Copy Agent

职责：

- 优化首页、栏目页、申请页、卡片标题和 CTA。
- 删除内部流程语言。
- 保持“判断、证据、机会、行动”的表达风格。

交付物：

- 页面文案候选。
- 文案替换表。
- 禁用词和表达边界。

## Content / Data Agent

职责：

- 管理商业信号、Priority Engine、趋势温度、机会判断、商业内参、Tags 的字段和关系。
- 检查重复项、空字段、错位关联。
- 输出质量报告。

交付物：

- 字段修复方案。
- 标签体系建议。
- 关系检查结果。

## Signal Intelligence Agent

职责：

- 定义什么是合格 Signal。
- 维护监测来源、关键词体系和 Signal 评分算法。
- 输出关键词新增、降权、合并和噪音来源报告。

交付物：

- Signal 定义与筛选规则。
- 优质来源清单。
- 关键词质量报告。
- Signal 评分阈值建议。

## 今日观察 / Daily Brief Agent

职责：

- 将每日新增内容整理成付费级独立报告。
- 保证今日观察有主判断、有证据、有趋势温度、有关键词和搜索入口，不输出替用户决策的行动建议。
- 设计 newsletter / signals letter 的结构。

交付物：

- 今日观察模板。
- 每日 Brief 质量检查表。
- 邮件版结构建议。

## Opportunity Engine Agent

职责：

- 将 Priorities 评分能力合并进机会判断。
- 维护机会判断的优先级、证据等级、趋势状态、风险边界和后续观察问题。
- 判断机会是否足够成熟，避免把普通想法误当机会。

交付物：

- 机会判断字段升级方案。
- Priority Engine 与 Opportunity 的关系方案。
- 机会合并与降级规则。

## Trend Intelligence Agent

职责：

- 建立趋势判断模型。
- 维护趋势状态、证据阶梯、机会温度、反证清单。
- 让趋势温度与商业信号、机会判断、商业内参形成双向关系。

交付物：

- 趋势模型。
- 趋势页面结构建议。
- 趋势质量检查报告。

## Commercial Site Agent

职责：

- 规划会员制官网所需模块。
- 设计登录、注册、7 天试读、月/季/年订阅、会员权限、newsletter、样例报告等商业化闭环。
- 确保前台、会员端、管理员端边界清楚。

交付物：

- 商业化官网模块清单。
- 权限分级方案。
- 商业化页面优先级。

## Dev Agent

职责：

- 实现网站功能、同步脚本、验证脚本、权限逻辑。
- 保证普通端与管理员端分离。
- 负责构建、部署、回滚相关技术任务。

交付物：

- 代码改动。
- 验证结果。
- 风险说明。

## Automation / Workflow Agent

职责：

- 维护每日监测、同步、健康检查、日志和交接机制。
- 把异常沉淀为 backlog。

交付物：

- daily-run-log。
- health report。
- feature_list 状态更新。

## 工具探索规则

每个 agent 可以寻找合适工具，但必须遵守：

1. 先说明使用工具的原因。
2. 新外部 skill 或脚本使用前先做安全检查。
3. 工具只能服务当前交付物，不为炫技增加复杂度。
4. 有价值的工具写入 `tool-registry.md`。
5. 不能让工具替代人工判断的审批事项。
