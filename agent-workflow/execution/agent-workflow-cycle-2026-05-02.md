# Agent Workflow Cycle：2026-05-02

本文件定义当前阶段的长期 agent 接力计划。

## 本轮总目标

从 Strategy Agent 开始，逐步把观澜AI梳理成一个可监测、可执行、可优化、可商业化的 AI 商业判断产品。

## 当前事实源

- 核心卖点：比市场早一步，看清哪些 AI 机会值得验证。
- 前台导航：首页 / Daily Brief / Signals / Opportunities / Trends。
- Scoring 后台化为 Priority Engine。
- Priorities 合并进 Opportunities。
- Method 暂作为内部方法论资产。
- 注册后 7 天试读，订阅分月 / 季 / 年；企业版和私享内参单独申请。

## Step 1：Strategy Agent

### 任务

1. 固化战略单一事实源。
2. 检查当前所有新需求是否符合核心卖点。
3. 明确非目标：新闻站、工具站、公司榜、后台系统、低端营销页。
4. 明确商业化阶段：会员情报访问、行业/闭门简报、机会连接与项目化服务。
5. 输出需要 PM 转化的产品问题。

### 交付物

- 战略判断清单。
- 栏目边界风险。
- 商业化阶段判断。
- 需要 PM 拆解的问题列表。

### 验收

- 能用一句话说明观澜AI为什么值得付费。
- 不再出现前台 Method、前台 Priorities、普通申请访问路径的混乱表达。

## Step 2：PM Agent

### 任务

1. 将 Strategy 结论转成 PRD。
2. 维护 active PRD 优先级。
3. 明确每个 PRD 的非目标。
4. 将任务分配给 Data、UI/UE、Copy、Dev、QA。

### 当前优先 PRD

1. `PRD-001-daily-brief.md`
2. `PRD-002-signals-system.md`
3. `PRD-003-opportunities-engine.md`
4. `PRD-004-trends-model.md`
5. `PRD-005-membership-access.md`

### 验收

- 每个 PRD 都有字段、权限、页面行为和验收标准。
- 每个任务能进入 `feature_list.json`。

## Step 3：Data Agent

### 任务

1. 为 5 个 PRD 补字段规范。
2. 定义 Signal、Opportunity、Trend、Brief、User 的 schema。
3. 建立 Tags 字典与关系网络规则。
4. 设计 schema-check、relation-check、dedupe-check、brief-quality-check、keyword-quality-report。

### 验收

- 每个核心实体有 ID、slug 或稳定键。
- Opportunity 能追溯 Signal 和 Trend。
- Daily Brief 能引用 Signals、Opportunities、Trends。

## Step 4：UI / UE Agent

### 任务

1. 根据 PRD 设计首页、Daily Brief、Signals、Opportunities、Trends、会员权限提示的页面结构。
2. 更新 DESIGN.md 的组件规则。
3. 输出桌面和移动端截图验收点。

### 验收

- 首页不再承担全部内容展示。
- Daily Brief 像商业内参，不像资讯列表。
- Opportunities 像机会库，不像公司榜。

## Step 5：Copy Agent

### 任务

1. 为首页、Daily Brief、Signals、Opportunities、Trends、会员页写对外文案。
2. 删除内部语言。
3. 输出 CTA 和禁用词清单。

### 验收

- 对外页面只讲判断、证据、机会、验证和行动。
- 不出现 Markdown、同步、JSON、字段、后台沉淀等内部表达。

## Step 6：Dev Agent

### 任务

1. 按 PRD 实现最小功能。
2. 建立检查脚本。
3. 处理旧 scoring.html 的迁移、隐藏或兼容。
4. 实现普通端、试读用户、会员、管理员的权限边界。

### 验收

- 本地检查通过。
- 普通页面无 Admin 控件。
- 核心页面有独立 URL。
- 数据同步不破坏旧内容。

## Step 7：QA Agent

### 任务

1. 独立验收 PRD。
2. 检查桌面、移动端、权限、文案、数据、后台边界。
3. 输出是否可发布建议。

### 验收

- 阻塞问题清零后才可发布。
- 风险项写入 feature_list 或 progress。

## Step 8：Workflow Agent

### 任务

1. 更新 `progress.md`。
2. 更新 `feature_list.json`。
3. 归档 agent 输出。
4. 写下一轮交接。

### 验收

- 新会话可从 workflow 恢复。
- 旧 agent 关闭不丢结论。
- 下轮任务清楚。
