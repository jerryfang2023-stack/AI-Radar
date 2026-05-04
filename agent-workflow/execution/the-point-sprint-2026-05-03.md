# The Point Sprint 计划

更新时间：2026-05-03  
owner：`pm`  
状态：已确认，进入 Data / Workflow / UI / Copy / Dev / QA 开发分派

## 1. 本轮 PM 结论

The Point 应作为“建造者观点层”引入观澜AI。

The Point 确认为前台一级栏目，导航位置放在 `Signals` 之后。它的核心价值不是多一个信息流，而是：

- 给 Daily Brief 增加大牛观点证据。
- 给 Trends 增加观点热度、分歧和反证。
- 给 Opportunities 增加建造者观点支持或风险提示。
- 让首页 Decision Brief 更鲜活，用今日观点替代原“趋势线索”。

## 2. 参考 Skill

已安装：

```text
C:\Users\86186\.codex\skills\follow-builders
```

能力摘要：

- 追踪 AI 建造者，而非网红。
- 默认包含 25 位 X 建造者、6 个 AI 播客、2 个官方博客来源。
- 可通过 `scripts/prepare-digest.js` 获取中心化 feed。
- 不需要 X / YouTube API key。
- 可输出中文、英文或双语 digest。

提示：

- 需要重启 Codex 后，该 skill 会作为正式技能被自动识别。
- 本轮已读取本地 skill 文件，可先按其规则设计产品。

## 3. P0 任务

### P0-0：前台导航接入

交给：UI/UE Agent / Dev Agent / QA Agent

目标：

- The Point 进入前台一级导航。
- 导航顺序调整为：首页 / Daily Brief / Signals / The Point / Opportunities / Trends。
- 所有普通前台页面保持一致导航。
- Admin 后台可以保留管理入口，但不影响普通前台。

验收：

- 首页、Daily、Signals、The Point、Opportunities、Trends 导航顺序一致。
- The Point 位于 Signals 之后。
- 普通前台不出现后台编辑、feed、JSON、同步等内部词。

### P0-1：The Point 数据模型

交给：Data Agent

输出：

- `05-Point/` 内容目录规范。
- `Point` 字段定义。
- `point_score` 算法。
- `pointTopics` 长期热度字段。
- 与 Signal / Trend / Opportunity 的关联字段。

验收：

- 每条 Point 有人物、来源、观点、解读、分数、日期和原文链接。
- 每条 Point 可选关联 Signal、Trend、Opportunity。
- 可按日期生成 Top10。

### P0-2：The Point 内容生成流程

交给：Workflow Agent / Data Agent

输出：

- 如何运行 `follow-builders`。
- 如何从 digest feed 转成 `YYYY-MM-DD-The-Point.md`。
- 如何去重、打分、翻译和归档。
- 如何处理来源抓取失败。
- 如何在每日 08:30 自动运行。
- 如何写入 Obsidian 的 `05-Point/` 目录。
- 如何标记等待商业雷达统一同步。

验收：

- 每日可产出一份 The Point。
- 自动任务时间为每日 08:30，时区 `Asia/Shanghai`。
- Markdown 写入 `01-WaveSight/05-Point/`。
- 文件命名为 `YYYY-MM-DD-The-Point.md`，例如 `2026-05-04-The-Point.md`。
- The Point 任务不直接运行网站同步。
- The Point 任务完成后标记 `pending_unified_sync`。
- 商业雷达统一同步后 `radar-data.json` 中包含 `points` 和 `pointTopics`。
- 失败时有降级说明。
- 不需要用户手动复制大量原文。

### P0-2.1：网站同步接入

交给：Dev Agent / QA Agent

目标：

- `04-Site/config/content-paths.json` 增加 The Point 内容路径。
- `04-Site/scripts/sync-data.mjs` 解析 `05-Point/` Markdown。
- 网站数据新增 `points` 和 `pointTopics`。
- Daily Brief、首页、Trends、Opportunities 可以读取 The Point 数据。
- The Point 不单独触发网站同步，由商业雷达统一同步流程一起解析。

验收：

- 运行统一网站同步后，The Point 数据进入 `04-Site/data/radar-data.json`。
- 运行关系检查后，Point 关联的 Signal / Trend / Opportunity 不出现硬断链。
- 远程 feed 失败时，不生成空 The Point 内容，不覆盖上一日数据。
- The Point 任务不会与商业雷达任务并发写入网站数据文件。

### P0-3：Daily Brief 融合

交给：Daily Brief Agent / Copy Agent / Dev Agent

目标：

- Daily Brief 增加 The Point 模块。
- 默认展示当天 Top 3。
- 与今日判断、风险与反证互相支撑。

验收：

- Daily Detail 有“今日大牛观点”模块。
- 每条观点有简要解读。
- 不把观点写成确定结论。

### P0-4：首页 Decision Brief 替换

交给：UI/UE Agent / Copy Agent / Dev Agent

目标：

- 首页 Decision Brief 中，用 The Point 替代原趋势线索。
- 展示 2-3 条当天高价值观点。
- 保留进入 The Point 或 Daily Brief 的入口。

验收：

- 首页更像判断入口，不像资讯流。
- The Point 卡片可读、简洁、有来源。
- 不出现后台抓取、feed、JSON 等内部词。

### P0-5：The Point 详情页

交给：Data Agent / UI-UE Agent / Copy Agent / Dev Agent / QA Agent

建议路径：

```text
04-Site/point.html?id=<point_id>
```

目标：

- 为每条 Point 提供独立落点。
- 承接 Daily Brief、首页、Trend、Opportunity 中引用的观点。
- 解释观点的商业含义和边界，而不是只展示原文摘要。

页面结构：

1. 观点标题、人物、来源、日期、分数。
2. 原始观点摘要。
3. 观澜AI简要解读。
4. 商业含义。
5. 观点边界。
6. 关联 Signals。
7. 关联 Trends。
8. 关联 Opportunities。
9. 该 topic 近 7 日 / 30 日热度。
10. 原文链接。

验收：

- The Point 列表卡片可点击进入详情页。
- 详情页不大段搬运原文。
- 详情页有来源链接。
- 详情页能展示至少一种关联内容。
- 文案不把观点写成事实结论。

## 4. P1 任务

### P1-1：The Point 独立栏目页

建议路径：

```text
04-Site/the-point.html
```

内容：

- 今日 Top10。
- 日期切换。
- 主题热度。
- 观点分歧。
- 关联内容入口。

### P1-2：Trends 观点热度融合

目标：

- Trend 详情页显示观点热度和代表观点。
- `rising / splitting / cooling` 可参考 The Point 长期热度。

### P1-3：Opportunities 观点证据融合

目标：

- Opportunity 详情页展示相关建造者观点。
- 作为机会判断辅助证据，不直接替代评分。

## 5. P2 任务

- 自定义中文建造者来源。
- Admin 中管理 The Point 来源和隐藏规则。
- The Point newsletter 版本。
- 观点热度图表。

## 6. PM 默认决策

用户已确认开始开发。本轮按以下默认决策推进：

1. 前台显示名使用 `The Point`。
2. 第一版先使用 follow-builders 默认来源。
3. 中文 AI 建造者来源进入 P2，不阻塞 P0。
4. Daily Brief 中 The Point 放在“今日判断”之后。
5. 首页 Decision Brief 用 The Point 替代趋势线索；Trends 保留导航与详情页，不在首页重复展示趋势线索卡片。

## 7. 开发分派

本文件已进入开发分派，对应总控任务：

```text
agent-workflow/execution/task-GL-M2-005-the-point-agent-dispatch.md
```

执行顺序：

```text
Data -> Workflow -> UI/UE + Copy -> Dev -> QA
```
