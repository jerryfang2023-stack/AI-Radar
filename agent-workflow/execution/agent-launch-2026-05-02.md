# 2026-05-02 多 Agent 启动计划

## 本阶段总目标

把观澜 AI 从“本地内容网站”升级为“可监测、可执行、可优化、可商业化的 AI 商业判断产品”。

核心卖点统一为：

> 比市场早一步，看清哪些 AI 机会值得验证。

## 本阶段产品结构判断

- Signals：商业信号源，不是新闻列表。
- Daily Brief：每日付费级独立报告，不是内容汇总。
- Opportunities：核心机会库，合并 Priorities 的评分与优先级能力。
- Trends：趋势判断模型，不是趋势名称列表。
- 方法论资产：暂不作为对外栏目，用于支撑样例报告、销售沟通和未来信任内容。
- Tags：降级为搜索和机会网络能力，不一定长期作为前台一级导航。

## Agent 分工

长期岗位说明书见：

```text
agent-workflow/agents/
```

本文件记录阶段性启动任务；`agents/` 记录长期岗位职责。临时子 agent 结束后，必须将结论沉淀回岗位库、PRD、feature list 或 progress。

## 调度链路

```text
Strategy Agent
  -> PM Agent
  -> Data Agent
  -> UI / UE Agent + Copy Agent
  -> Dev Agent
  -> QA Agent
  -> Workflow Agent
```

执行原则：

1. Strategy Agent 先判断方向。
2. PM Agent 再写 PRD 和任务。
3. Data Agent 先确认字段和关系。
4. UI/UE 与 Copy 在产品边界确定后进入。
5. Dev 只按 PRD 和验收标准实现。
6. QA 独立验收。
7. Workflow Agent 最后更新进度、任务状态和交接。

### 1. Strategy Agent

目标：

- 固化核心卖点。
- 明确产品边界。
- 设计商业化阶段。

本轮交付物：

- 更新 `product-strategy.md`。
- 输出内部方法论资产应包含的判断框架。

验收：

- 5 秒内能说明观澜 AI 为什么值得付费。
- 不再按老板、行业大咖、资源方、投资人分别写卖点。

### 2. Signal Intelligence Agent

目标：

- 建立 Signals 定义、来源、关键词自优化机制和评分算法。

本轮交付物：

- 维护 `product/signal-system.md`。
- 设计关键词质量报告字段。
- 提出优质新闻源与一手来源清单。

验收：

- 能区分新闻与 Signal。
- 能说明一条内容为什么进入或不进入 Signals。
- 能沉淀关键词新增、降权、合并规则。

### 3. Daily Brief Agent

目标：

- 把 Daily Brief 做成每日独立报告和未来 newsletter 产品。

本轮交付物：

- 维护 `product/daily-brief-product.md`。
- 设计 Daily Brief 模板。
- 设计 Daily Brief 页面结构。

验收：

- 每天 Brief 有明确观点、结构和行动建议。
- 用户读完能带到会议或合作讨论里。

### 4. Opportunity Engine Agent

目标：

- 将 Priorities 合并进 Opportunities，形成评分化机会库。

本轮交付物：

- 更新栏目架构。
- 设计机会卡字段升级方案。
- 设计旧 Priorities 页面降级或迁移方案。

验收：

- 没有评分或优先级的内容不作为机会展示。
- 每张机会卡有优先级、证据等级、趋势状态、验证动作。

### 5. Trend Intelligence Agent

目标：

- 将 Trends 升级为趋势判断模型。

本轮交付物：

- 维护 `product/trend-model.md`。
- 设计趋势状态、证据阶梯、机会温度、反证模型。

验收：

- Trends 能解释为什么升温、分化、降温或进入风险区。
- 每个核心趋势可关联 Signals 和 Opportunities。

### 6. UI / Brand Agent

目标：

- 官网风格符合高知高净值商业用户审美。

本轮交付物：

- 更新 `04-Site/DESIGN.md` 的方向建议。
- 输出首页、Daily Brief、Opportunities、Trends 的页面改造建议。

验收：

- 高端、大气、克制、有力。
- 不像普通 SaaS 模板，不像 AI 工具导航站。

### 7. Commercial Site Agent

目标：

- 补齐商业化官网模块。

本轮交付物：

- 维护 `product/commercial-site-modules.md`。
- 拆解登录、注册、会员状态、权限提示、newsletter、样例报告任务。

验收：

- 官网具备会员制产品的基本闭环。
- 普通访问、试读、会员、管理员权限边界清晰。

### 8. Dev / Automation Agent

目标：

- 把以上产品判断变成可执行任务和验证脚本。

本轮交付物：

- 更新 `feature_list.json`。
- 补充 schema-check、relation-check、keyword-quality-report、brief-quality-check 等任务。
- 维护健康检查与日志。

验收：

- 每个战略方向都有明确任务、责任 agent、验收标准。
- 每轮执行后能写入 progress 和 logs。

## 本阶段里程碑

### M1：定义清楚

- Signals 定义与算法完成。
- 核心卖点统一。
- Daily Brief 产品结构完成。
- Priorities / Opportunities 合并方案完成。
- Trends 模型完成。

### M2：产品闭环

- Daily Brief 页面和归档初版。
- Opportunities 详情页升级。
- 登录/注册/会员状态流程初版。
- 样例报告或试读内容初版。

### M3：商业化准备

- newsletter 订阅流程。
- 会员权限分级。
- 样例报告。
- 管理后台运营控制台。

## 执行纪律

1. 每个 agent 先交付文档或方案，再进入实现。
2. 涉及前台页面风格，必须使用 frontend-design 和 awesome-design-md。
3. 涉及对外文案，必须使用 copywriting / copy-editing 的原则。
4. 涉及新增功能，必须先写验收标准。
5. 涉及权限和云端部署，必须先区分普通端、会员端、管理员端。
