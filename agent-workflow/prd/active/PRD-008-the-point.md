# PRD-008：The Point 一线 AI 创造者观点栏目

更新时间：2026-05-03  
owner：`pm`  
协作 agent：`data`、`daily-brief`、`trend-intelligence`、`opportunity-engine`、`ui-ue`、`copy`、`dev`、`qa`、`workflow`

## 1. 背景

观澜AI当前已经有 Daily Brief、Signals、Opportunities、Trends 四个核心模块。它们解决了“发生了什么、为什么值得看、机会在哪里、趋势是否延续”的问题。

但 AI 领域还有一个重要判断来源：真正创造产品、模型、公司和基础设施的人每天在公开渠道表达的观点。这些观点往往比新闻更早反映技术方向、产品共识、分歧、风险和商业机会。

本 PRD 引入新栏目：

```text
The Point
```

它基于 `follow-builders` skill，追踪一线 AI 创造者的公开观点，并将其转化为每日 Top10、长期观点热度和跨栏目判断证据。

## 2. 产品目标

1. 每日展示一线 AI 创造者的关键观点，并给出简要解读。
2. 每天评出 The Point Top10。
3. 按日期归档观点，观察长期趋势和热度变化。
4. 将 The Point 融入 Daily Brief、Trends、Opportunities。
5. 更新算法，让观点层成为趋势和机会判断的辅助证据。
6. 在首页 Decision Brief 中，用 The Point 替代原“趋势线索”位置。
7. 将 The Point 加入前台一级导航，位置在 `Signals` 之后。
8. 建立 The Point 详情页，让单条观点可被引用、解读、关联和回看。

## 3. 用户任务

用户进入 The Point，是为了回答：

1. 今天真正有影响力的一线 AI 创造者在说什么。
2. 哪些观点不是噪音，而是值得进入商业判断的线索。
3. 哪些观点正在形成共识、分歧或反证。
4. 这些观点和现有 Signal、Trend、Opportunity 有什么关系。
5. 哪些方向的讨论热度正在连续累积。

## 4. 非目标

- 不做社媒热榜。
- 不做 X / Twitter 内容搬运站。
- 不收录纯情绪、纯转发、纯自我宣传。
- 不把观点等同于事实证据。
- 不直接替代 Signals、Trends 或 Opportunities。
- 不输出投资建议、经营建议或确定性结论。

## 5. 数据来源

第一阶段使用 `follow-builders` skill 默认来源：

- X / Twitter 一线 AI 创造者观点
- AI 播客摘要
- 官方博客文章

默认来源数量：

- 25 位 X / Twitter 一线 AI 创造者
- 6 个 AI 播客
- 2 个官方博客来源

后续可扩展：

- 用户自定义一线 AI 创造者名单
- 中文 AI 创业者 / 投资人 / 产品负责人
- 官方产品博客
- 研究团队博客
- YouTube / podcast 长内容

## 5.1 自动更新要求

The Point 需要设计为每日自动更新任务。

运行时间：

```text
每日 08:30
```

时区：

```text
Asia/Shanghai
```

自动更新目标：

1. 调用 `follow-builders` skill 获取最新一线观点 feed。
2. 生成当天 The Point Markdown。
3. 写入 Obsidian 项目目录。
4. 标记等待统一同步。
5. 写入运行日志。

协调要求：

- The Point 自动化任务只负责生成 Obsidian Markdown，不单独运行网站同步。
- 商业雷达自动化任务仍作为统一同步入口。
- 网站同步由统一流程一次性解析 Signals、Scoring、Trends、The Point、Opportunities。
- 避免 The Point 和商业雷达两个任务同时写入 `04-Site/data/radar-data.json`。

Markdown 输出目录：

```text
05-Point/
```

目录位置：

```text
01-WaveSight/05-Point/
```

命名规则参照商业雷达和评分文件：

```text
YYYY-MM-DD-The-Point.md
```

示例：

```text
2026-05-04-The-Point.md
```

同步要求：

- The Point Markdown 是 Obsidian 中的主内容源。
- `04-Site/scripts/sync-data.mjs` 后续需要解析 `05-Point/`。
- 由统一同步流程写入 `04-Site/data/radar-data.json` 和 `04-Site/data/radar-data.js`。
- 网站数据新增 `points` 和 `pointTopics` 集合。
- 统一同步后运行关系检查，确保 Point 与 Signal / Trend / Opportunity 的关联不出现硬断链。

降级要求：

- 如果远程 feed 抓取失败，保留上一日缓存，不生成空内容。
- 运行日志必须写明失败原因。
- 不允许用空模板覆盖已有 The Point 文件。
- 如果当天没有足够高质量观点，应生成 `needs_review` 状态，而不是强行凑满 Top10。

## 6. 页面规划

### 6.0 前台导航

The Point 进入前台一级导航。

导航顺序调整为：

```text
首页 / Daily Brief / Signals / The Point / Opportunities / Trends
```

说明：

- The Point 放在 Signals 之后，因为它不是原始商业事件，而是对事件、产品方向和技术变化的观点解释层。
- The Point 放在 Opportunities 之前，因为观点可以辅助判断哪些机会值得继续观察。
- The Point 不替代 Signals，观点不能直接当作事实证据。

### 6.1 The Point 栏目页

路径建议：

```text
the-point.html
```

页面结构：

1. 顶部：栏目定位，说明这里追踪一线 AI 创造者的公开观点，并把它转化为商业判断线索。
2. 日期归档：按日期进入每日内容集合页。
3. 长期热度：按 topic / track 展示 7 日、30 日观点热度。
4. 主题入口：展示近期连续升温、出现分歧或值得复核的观点主题。
5. 栏目页不直接承载全部观点，避免变成信息流；具体观点进入每日集合页和详情页阅读。

### 6.2 每日内容集合页

路径建议：

```text
point-daily.html?date=YYYY-MM-DD
```

页面结构：

1. 顶部：日期、当日观点数量、Top10 入口。
2. 今日 Top10：按 `point_score` 排序，突出当天最值得进入商业判断的观点。
3. 全部一线观点：展示当天抓取到的全部有效观点，Top10 之外也保留原文摘录、简评、主题和来源。
4. 观点卡片：人物、来源、观点标题、原文摘录、观澜简评、关联主题、关联内容。
5. 每张卡片可进入单条详情页。

### 6.3 The Point 详情页

路径建议：

```text
point.html?slug=<point_slug>
```

页面结构：

1. 顶部标题：观点标题、人物、来源类型、日期、分数。
2. 原始观点摘要：保留短摘录或播客 / 博客观点摘要，不大段搬运原文。
3. 简要解读：用观澜AI口径解释这句话为什么值得看。
4. 商业含义：说明它可能影响哪个产品方向、客户场景、趋势判断或机会卡。
5. 观点边界：说明它只是观点、仍需哪些事实证据验证。
6. 关联 Signals：如果观点对应已有商业事件，展示关联 Signal。
7. 关联 Trends：展示它支持、削弱或分化了哪个 Trend。
8. 关联 Opportunities：展示它对哪些机会卡构成支持或风险提示。
9. 长期热度：展示该 topic 近 7 日和 30 日观点热度。
10. 原文链接：跳转到 X、播客、博客原始来源。

详情页核心任务：

- 让用户理解单条观点的商业含义，而不是只看原文摘要。
- 让观点可以回链到现有判断系统。
- 让 Daily Brief、Trend、Opportunity 中引用的观点有独立落点。

详情页非目标：

- 不展示完整长原文。
- 不做评论区。
- 不做观点点赞排行。
- 不把观点写成事实结论或投资建议。

第一阶段需要开发详情页。每日集合页中的每张 Point 卡片应可点击进入 `point.html?slug=<point_slug>`。

### 6.4 详情页字段需求

详情页至少需要以下字段：

- `point_id`
- `date`
- `source_type`
- `source_name`
- `source_handle`
- `source_url`
- `title`
- `raw_excerpt`
- `summary`
- `interpretation`
- `commercial_meaning`
- `point_boundary`
- `topic`
- `track`
- `stance`
- `point_score`
- `point_heat_7d`
- `point_heat_30d`
- `related_signal_ids`
- `related_trend_ids`
- `related_opportunity_ids`
- `tags`
- `status`

## 7. Daily Brief 融合

Daily Brief 新增模块：

```text
今日大牛观点 / The Point
```

展示规则：

- 默认展示当天 Top 3。
- 每条包含：人物、观点、一句话解读、关联栏目。
- 如果观点支持今日主线，放入主判断之后。
- 如果观点构成反证，放入风险与反证。

Daily Brief 的结构调整为：

1. 今日判断
2. The Point：今日大牛观点
3. 关键 Signals
4. 机会观察
5. 趋势变化
6. 判断依据
7. 风险与反证

## 8. Trends 融合

Trends 新增观点维度：

- `related_point_ids`
- `point_heat_7d`
- `point_heat_30d`
- `point_momentum`
- `supporting_points`
- `counter_points`

Trend 状态可参考 The Point：

- 多位一线 AI 创造者连续讨论，增强 `rising` 证据。
- 出现高质量反对观点，增强 `counter_evidence`。
- 同一主题出现明显分歧，辅助判断 `splitting`。

## 9. Opportunities 融合

Opportunity 新增观点证据：

- `related_point_ids`
- `point_support_count`
- `point_risk_count`
- `builder_consensus`

展示规则：

- 机会详情页展示 2-5 条相关观点。
- 观点只作为辅助证据，不单独决定机会优先级。
- 第一阶段不大幅修改 Priority Engine，只增加轻量 `point_support_bonus`。

## 10. 首页融合

首页 Decision Brief 中，原“趋势线索”模块替换为 The Point。

展示内容：

- 今日 2-3 条高价值观点。
- 人物名 / 来源。
- 观点标题。
- 简要解读。
- 入口：进入 The Point 或 Daily Brief。

目的：

- 增加首页的新鲜度。
- 强化“观澜AI不是新闻流，而是判断系统”。
- 让用户看到一线 AI 创造者正在形成什么共识或分歧。

## 11. 算法需求

### 11.1 Point Score

总分 100：

| 维度 | 权重 |
|---|---:|
| 作者权威度 | 20 |
| 原创性 | 20 |
| 商业相关性 | 25 |
| 证据强度 | 15 |
| 讨论热度 | 10 |
| 新鲜度 | 10 |

### 11.2 Daily Top10

每日 Top10 排序：

```text
point_score desc
```

平分时优先：

1. 能关联 Trend 或 Opportunity。
2. 有明确商业含义。
3. 来自更高权威来源。
4. 与当天 Daily 主线相关。

### 11.3 长期观点热度

按 topic / track 聚合：

```text
point_heat_today = sum(point_score)
point_heat_7d = 7日加权累计
point_heat_30d = 30日加权累计
point_momentum = point_heat_7d / max(30日均值, 1)
```

趋势标签：

- `emerging`
- `rising`
- `splitting`
- `cooling`
- `noise`

## 12. 数据目录建议

新增内容目录：

```text
05-Point/
```

命名规则：

```text
YYYY-MM-DD-The-Point.md
```

网站同步输出：

```text
04-Site/data/radar-data.json
04-Site/data/radar-data.js
```

新增数据集合：

```json
{
  "points": [],
  "pointTopics": []
}
```

## 13. 文案原则

推荐表达：

- `今天大牛怎么看`
- `观点正在形成共识`
- `这个判断值得继续观察`
- `它为趋势提供了观点证据`
- `这更像早期分歧，而不是确定结论`

避免表达：

- `大佬说了就一定对`
- `行业已经确定`
- `马上跟进`
- `财富密码`
- `爆火观点`

## 14. 权限边界

| 用户状态 | 可见内容 |
|---|---|
| 访客 | The Point 样例摘要、今日前 1-2 条 |
| 已登录有效用户 | 完整 Top10、日期归档、关联内容 |
| 到期用户 | 摘要和续订提示 |
| Admin | 来源配置、观点编辑、隐藏、关联关系维护 |

## 15. 验收标准

- The Point 有独立栏目规划。
- The Point 出现在前台一级导航，位置在 Signals 之后。
- 每天可生成 Top10。
- 每条 Point 有人物、来源、观点、解读、分数和日期。
- 观点可以关联 Signal、Trend、Opportunity。
- 每条 Point 可进入独立详情页。
- Point 详情页包含原始观点摘要、观澜解读、商业含义、观点边界、关联内容和原文链接。
- Daily Brief 能展示 Top 3 The Point。
- Trends 能显示观点热度和代表观点。
- Opportunities 能展示相关观点证据。
- 首页 Decision Brief 使用 The Point 替代趋势线索。
- 文案不夸大观点价值，不把观点等同事实。
- 普通前台无后台来源、脚本、JSON 等内部话术。

## 16. 需要用户确认的问题

1. The Point 中文名是否使用“观点”还是保留英文栏目名？
2. 每日 Top10 是否只收英文全球一线 AI 创造者，还是第一版就加入中文来源？
3. 观点来源是否允许包含 Sam Altman、Claude 官方账号等公司/官方账号？
4. 首页 Decision Brief 替换“趋势线索”后，是否仍保留 Trends 的少量入口？
5. Daily Brief 中 The Point 放在“今日判断”之后是否确认？
