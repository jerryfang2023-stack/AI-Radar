# GL-M2-005 The Point 开发分派

更新时间：2026-05-03  
owner：`pm`  
状态：已确认，进入开发分派  
执行规则：只分派给既有长期 Agent，不创建临时 Agent。

## 1. 总目标

开发 The Point 一线 AI 创造者观点栏目，并把它纳入观澜AI现有判断系统：

- 前台导航新增 `The Point`，位置在 `Signals` 之后。
- 每日 08:30 自动生成 The Point 内容，先写入 Obsidian `05-Point/`。
- The Point 自动任务不直接同步网站，等待商业雷达统一同步流程一起入站。
- 网站数据新增 `points` 与 `pointTopics`。
- Daily Brief、首页 Decision Brief、Trends、Opportunities 可引用 The Point。
- 新增 The Point 栏目页、每日内容集合页和 Point 详情页。

## 2. 共同遵守的规范

所有 Agent 开工前必须读取：

- `agent-workflow/product/the-point-model.md`
- `agent-workflow/prd/active/PRD-008-the-point.md`
- `agent-workflow/execution/the-point-sprint-2026-05-03.md`
- `agent-workflow/execution/the-point-daily-automation-2026-05-03.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/product/COPY.md`

共同边界：

- The Point 是“一线观点层”，不是新闻流、语录墙或社媒热榜。
- 观点只能作为判断证据，不能写成事实结论。
- 普通前台不出现 `feed`、`JSON`、`同步`、`抓取任务`、`后台` 等内部词。
- The Point 自动任务只写 Obsidian，不直接写网站数据文件。
- 商业雷达统一同步是唯一入站入口，避免与现有自动化任务并发冲突。
- Admin 后台能力作为后续独立任务，不混入本轮前台开发。

## 3. Data Agent 任务

负责人：`Data Agent`

输入：

- `05-Point/YYYY-MM-DD-The-Point.md` 目标格式。
- follow-builders digest 输出结构。
- 现有 `signals`、`trends`、`opportunities`、`daily` 数据结构。

任务：

1. 定义 `Point` Markdown frontmatter 与正文结构。
2. 定义 `point_id`、`slug`、`date`、`person`、`source`、`original_url`、`point_summary`、`interpretation`、`commercial_meaning`、`boundary`、`point_score`、`topics`、`relatedSignalIds`、`relatedTrendIds`、`relatedOpportunityIds`。
3. 定义 `pointTopics` 长期热度字段：`topic_id`、`name`、`heat_7d`、`heat_30d`、`momentum`、`topPoints`、`relatedTrends`。
4. 定义 Top10 排序算法：观点新鲜度、来源相关性、商业含义、趋势关联、分歧/反证价值、来源可信度。
5. 提供一份最小样例 Markdown，供 Dev Agent 编写解析器。

验收：

- 每条 Point 可稳定生成 ID。
- 每条 Point 可进入当天 Top10。
- 每条 Point 至少有一句观澜AI解读和一个边界提醒。
- 关联字段为空时不造成网站断链。

## 4. Workflow Agent 任务

负责人：`Workflow Agent`

任务：

1. 设计每日 08:30 `Asia/Shanghai` 自动任务。
2. 自动任务运行 follow-builders，生成当日 digest。
3. 将 digest 转为 `05-Point/YYYY-MM-DD-The-Point.md`。
4. 完成去重、打分、中文摘要、观点解读和失败降级。
5. 写入 `pending_unified_sync` 状态，等待商业雷达统一同步。
6. 失败时写入 `agent-workflow/daily-run-log.md`，不生成空文件，不覆盖旧文件。

禁止：

- 禁止在 The Point 自动任务中运行 `04-Site/scripts/sync-data.mjs`。
- 禁止在 The Point 自动任务中写入 `04-Site/data/radar-data.json` 或 `.js`。
- 禁止与商业雷达自动任务同时写网站数据。

验收：

- 08:30 自动任务只产生 Obsidian Markdown。
- 商业雷达统一同步后，The Point 才进入网站数据。
- 远程来源失败时，现有网站内容不受影响。

## 5. UI/UE Agent 任务

负责人：`UI/UE Agent`

必须遵守：

- 先读取 `product/DESIGN.md`。
- 页面气质保持高端商业判断系统，不能做成资讯站、社媒榜单或后台面板。
- 卡片克制、信息层级清楚，桌面和移动端都要可读。

任务：

1. 设计前台导航新增 `The Point` 的一致样式。
2. 设计 `the-point.html` 栏目页阅读路径：日期归档、长期热度、主题入口。
3. 设计 `point-daily.html?date=YYYY-MM-DD` 每日集合页阅读路径：当日 Top10、全部一线观点、来源链接。
4. 设计 `point.html?slug=<point_slug>` 详情页阅读路径：观点、人物、来源、解读、商业含义、边界、关联内容。
5. 设计 Daily Brief 中 The Point Top3 模块。
6. 设计首页 Decision Brief 中 The Point 替代趋势线索后的模块。

验收：

- The Point 栏目页和每日集合页不显得像社媒热搜。
- Point 详情页重点是“观点如何影响商业判断”。
- 首页 Decision Brief 更像判断入口，不像资讯流。
- 移动端无文字拥挤、按钮溢出、模块重叠。

## 6. Copy Agent 任务

负责人：`Copy Agent`

必须遵守：

- 先读取 `product/COPY.md`。
- 文案克制、有判断、有边界。
- 不把观点写成事实，不把一线观点写成投资、经营或合作建议。

任务：

1. 输出 The Point 栏目页标题、副标题和空状态文案。
2. 输出 Point 详情页字段文案。
3. 输出首页 Decision Brief 的 The Point 模块文案。
4. 输出 Daily Brief 中 The Point 模块文案。
5. 建立 The Point 禁用词清单：避免 `大佬背书`、`确定趋势`、`必然机会`、`内幕消息` 等过度承诺表达。

验收：

- 用户能理解 The Point 的价值：看见一线 AI 创造者正在判断什么、分歧在哪里、对机会判断有什么影响。
- 所有文案不出现内部流程词。
- 所有文案都有证据边界。

## 7. Dev Agent 任务

负责人：`Dev Agent`

任务顺序：

1. 新增 `05-Point/` 内容目录与样例文件。
2. 更新 `04-Site/config/content-paths.json`，加入 The Point 内容路径。
3. 更新 `04-Site/scripts/sync-data.mjs`，解析 `05-Point/` 并输出 `points`、`pointTopics`。
4. 更新前台导航，顺序为：首页 / Daily Brief / Signals / The Point / Opportunities / Trends。
5. 新增 `04-Site/the-point.html`。
6. 新增 `04-Site/point-daily.html`。
7. 新增 `04-Site/point.html`。
8. 更新 `04-Site/js/app.js`，渲染栏目页、每日集合页、详情页、Daily Brief 模块、首页 Decision Brief 模块。
9. 更新关系检查，让 Point 关联 Signal / Trend / Opportunity 时不产生硬断链。

禁止：

- 禁止把 The Point 自动任务做成直接网站同步。
- 禁止把 Admin 来源管理混进本轮。
- 禁止在普通前台暴露后台工具或内部数据词。

验收：

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- 统一同步后 `radar-data.json` 包含 `points` 和 `pointTopics`。
- The Point 栏目页、每日集合页和详情页可打开。
- 首页和 Daily Brief 能读取 The Point 内容。

## 8. QA / Acceptance Agent 任务

负责人：`QA / Acceptance Agent`

验收清单：

1. 导航顺序：The Point 位于 Signals 后。
2. 普通前台无后台入口、编辑工具、同步、JSON、feed 等内部词。
3. The Point 自动任务不直接写网站数据。
4. 商业雷达统一同步后，The Point 正常入站。
5. The Point 来源失败时不生成空内容、不覆盖旧内容。
6. The Point 栏目页、每日集合页、详情页、首页模块、Daily Brief 模块在桌面和移动端可读。
7. Point 关联 Signal / Trend / Opportunity 不出现硬断链。
8. 文案不把观点写成事实结论。
9. 4 月 28 日 Daily Brief 隐藏规则不被回退。
10. 会员与 Admin 权限边界不被回退。

输出：

- `agent-workflow/reports/the-point-acceptance-2026-05-03.md`

## 9. PM 决策

本轮默认采用以下决策推进：

- 前台显示名：`The Point`。
- 第一版来源：先使用 follow-builders 默认来源。
- 中文一线 AI 创造者来源：进入 P2。
- Daily Brief 位置：放在“今日判断”之后。
- 首页 Decision Brief：用 The Point 替代原趋势线索，Trends 保留导航和详情页，不在首页重复展示趋势线索卡片。

如后续需要调整显示名或来源池，进入单独 PM 变更，不阻塞 P0 开发。
