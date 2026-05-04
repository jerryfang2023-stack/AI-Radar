# The Point 观点层模型

更新时间：2026-05-03  
owner：`pm` / `data`  
参考 skill：`follow-builders`

## 1. 定位

The Point 是观澜AI的“建造者观点层”。

它不追踪泛泛热点，也不追踪网红评论，而是追踪 AI 领域真正建造产品、研究模型、运营公司和设计产品的人，提取他们每天表达的关键观点，并转化为可积累、可打分、可回链到 Daily Brief / Trends / Opportunities 的判断素材。

一句话：

> The Point 记录大牛今天怎么看，并判断这些观点是否正在形成长期共识、分歧或机会线索。

## 2. 与现有栏目关系

| 模块 | The Point 的作用 |
|---|---|
| Daily Brief | 增加“今日大牛观点”模块，辅助解释当天商业信号为什么值得看 |
| Trends | 为趋势热度、分歧、反证提供观点证据 |
| Opportunities | 为机会卡补充“谁在讨论、为什么值得观察、是否出现建造者共识” |
| 首页 Decision Brief | 用 The Point 替代原来的趋势线索，让首页展示更鲜活的观点判断 |
| Signals | The Point 不直接等同 Signal；只有观点背后有商业事件或证据时，才可派生 Signal |

## 2.1 前台导航位置

The Point 进入前台一级导航，位置在 `Signals` 之后。

导航顺序：

```text
首页 / Daily Brief / Signals / The Point / Opportunities / Trends
```

放在 Signals 之后的原因：

- Signals 是事实与商业事件层。
- The Point 是建造者观点与解释层。
- 用户先看“发生了什么”，再看“关键建造者怎么看”，最后进入机会与趋势判断。

## 3. 来源原则

第一阶段使用 `follow-builders` skill 的默认来源：

- 25 位 X / Twitter AI 建造者
- 6 个 AI 播客
- 2 个官方博客来源

来源哲学：

- 追踪建造者，不追踪搬运者。
- 追踪原创观点，不追踪单纯转发和情绪表达。
- 观点必须能帮助判断技术方向、产品变化、商业机会、组织策略或风险边界。

## 3.1 自动更新与内容目录

The Point 需要成为每日自动更新任务。

运行规则：

```text
每日 08:30 Asia/Shanghai
```

输出目录：

```text
05-Point/
```

文件命名：

```text
YYYY-MM-DD-The-Point.md
```

示例：

```text
2026-05-04-The-Point.md
```

流程：

1. 调用 `follow-builders` 获取最新 feed。
2. 从 X、播客、博客中提取候选观点。
3. 按 Point Score 评分。
4. 生成每日 Top10。
5. 生成 topic / track 热度统计。
6. 写入 `05-Point/YYYY-MM-DD-The-Point.md`。
7. 标记 `pending_unified_sync`。
8. 等待商业雷达统一同步流程解析入站。
9. 将 The Point 融入 Daily Brief、Trends、Opportunities 和首页 Decision Brief。

原文硬规则：

- `follow-builders` feed 中的 X/Twitter `tweet.text`、播客 `transcript`、博客 `content` 是原始来源字段。
- The Point 写入 MD 时不得把摘要、改写、截断句或观澜判断写入原文字段。
- X/Twitter 单条内容使用 `原文全文` 和 `中文译文全文`，字段必须来自 `tweet.text` 全文。
- Podcast 使用 `原始发言段` 和 `发言段译文`，必须保留 speaker 与时间段；不得把总结语写成原文。
- Blog 使用 `原始段落` 和 `原始段落译文`，必须保留与该 Point 对应的完整原始段落；不得只截取文章前 1/3。
- Podcast 和 Blog 必须先生成 `05-Point/sources/YYYY-MM-DD/` 下的站内素材笔记，再由 Point 卡片引用 `素材笔记`。
- 站内素材笔记支持 `全文文档` 和 `全文译文`。如内容具备转载授权或来自自有导出文档，先写入这两个字段，再运行网站同步；网站素材页必须优先展示全文文档。
- 对外部 YouTube / Blog，时间戳只用于定位，不作为站内阅读的主要结构；主要阅读结构应是完整文档或完整文档的章节化阅读。
- 网站展示 The Point 时，`originalText` 只来自原文字段；如果缺失，不得回退到 `观点摘要` 或标题。

同步协调：

- The Point 自动化不直接运行网站同步。
- 商业雷达任务是统一同步入口。
- `sync-data.mjs` 后续需要一次性解析 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/`。
- 这样避免多个自动化任务同时写入网站数据文件。

降级：

- feed 失败时不生成空文件。
- 使用上一日缓存作为回看数据。
- 在 `agent-workflow/daily-run-log.md` 中记录失败原因。
- 标记 `status: needs_review` 的内容不得进入首页精选。

## 4. 内容单元

The Point 的最小内容单元是 `Point`。

一个 Point 不是完整新闻，而是一条结构化观点：

```text
某位建造者，在某天，围绕某个主题，提出了一个可被引用和追踪的判断。
```

示例结构：

- Karpathy 认为自然语言编程会改变软件开发边界。
- Guillermo Rauch 认为多人协作式 AI 原型工具会成为新工作台。
- Anthropic 博客强调某类 eval 比普通能力榜单更重要。

## 5. 建议数据字段

```json
{
  "point_id": "point-2026-05-03-karpathy-software-30",
  "date": "2026-05-03",
  "source_type": "x | podcast | blog",
  "source_name": "Andrej Karpathy",
  "source_handle": "karpathy",
  "source_url": "https://x.com/...",
  "title": "自然语言正在改变软件开发入口",
  "original_text": "原文全文，来自 feed 原始字段，不得摘要或截断",
  "original_translation": "中文译文全文，逐句对应 original_text",
  "summary": "简要解读",
  "interpretation": "它对 AI 商业判断意味着什么",
  "topic": "AI coding",
  "track": "AI Agent / Developer Tools / Model Infra",
  "stance": "bullish | cautious | critical | explanatory | product",
  "point_score": 86,
  "heat_score": 12,
  "originality_score": 18,
  "commercial_relevance_score": 20,
  "authority_score": 18,
  "evidence_score": 15,
  "recency_score": 15,
  "related_signal_ids": [],
  "related_trend_ids": [],
  "related_opportunity_ids": [],
  "tags": [],
  "status": "published | needs_review | hidden"
}
```

## 6. 每日 Top10 评分

每日 Top10 不按声量排序，而按“观点对商业判断的价值”排序。

建议总分 100：

| 维度 | 权重 | 说明 |
|---|---:|---|
| 作者权威度 | 20 | 是否来自高质量建造者、研究员、创始人或产品负责人 |
| 原创性 | 20 | 是否提出新判断，而不是转述共识 |
| 商业相关性 | 25 | 是否影响产品、客户、收入、生态、组织或机会判断 |
| 证据强度 | 15 | 是否有产品发布、客户采用、论文、数据、案例或实践经验支撑 |
| 讨论热度 | 10 | 是否被多位建造者呼应、反驳或延展 |
| 新鲜度 | 10 | 是否是当天或近 24-48 小时内的新观点 |

Top10 标准：

- 必须有明确观点。
- 必须能简要解释“为什么重要”。
- 优先选择能连接 Signal、Trend 或 Opportunity 的观点。
- 不选纯情绪、纯转发、纯自我宣传。

## 7. 长期趋势热度

The Point 的长期趋势不等同于社媒热度，而是“高质量观点的连续出现”。

建议计算：

```text
topic_heat_today = 今日该 topic 下 Point Score 总和
topic_heat_7d = 过去 7 日 topic_heat_today 加权和
topic_heat_30d = 过去 30 日 topic_heat_today 加权和
momentum = topic_heat_7d / max(topic_heat_30d 均值, 1)
```

状态建议：

- `rising`：连续多日增强，且至少 2 个高质量来源参与。
- `splitting`：同一主题出现明显相反观点。
- `cooling`：过去热但近 7 日观点减少。
- `emerging`：首次出现高分观点。
- `noise`：讨论多但商业相关性低。

## 8. 与 Daily Brief 融合

Daily Brief 新增模块：

```text
今日大牛观点 / The Point
```

建议展示：

1. 今日 Top 3 观点。
2. 每条观点包含：人物、观点、一句话解读、关联 Signal / Trend / Opportunity。
3. 如果当天观点与 Daily 主线一致，用它增强主判断。
4. 如果当天观点与 Daily 主线相反，放入风险与反证。

## 9. 与 Trends 融合

Trend 详情页新增：

- 观点热度曲线
- 近 7 日代表观点
- 支持观点
- 反对 / 谨慎观点
- 观点分歧说明

Trend 状态可参考 The Point：

- 多位建造者持续讨论同一 topic，可辅助判断 `rising`。
- 高权威来源表达谨慎，可进入 `counter_evidence`。
- 观点明显分裂，可辅助判断 `splitting`。

## 10. 与 Opportunities 融合

Opportunity 详情页新增：

- 建造者观点证据
- 该机会是否被高质量建造者反复讨论
- 观点是否支持机会成立
- 观点是否提示风险、门槛或替代路径

Opportunity 排序可加入轻量因子：

```text
priority_score_adjusted = priority_score + point_support_bonus - point_risk_penalty
```

第一阶段只展示观点证据，不直接大幅改动机会评分。

## 11. 首页融合

首页 Decision Brief 中，原“趋势线索”位置改为 The Point：

- 展示今日 2-3 条最高价值观点。
- 每条包含人物、观点、解读。
- 引导进入 The Point 栏目或 Daily Brief。

目的：

- 让首页更鲜活。
- 让用户看到“行业里真正建造的人正在讨论什么”。
- 用观点层增强每日判断的可信度。

## 11.1 Point 详情页

每条 Point 应有独立详情页，建议路径：

```text
point.html?id=<point_id>
```

详情页用于承接首页、Daily Brief、Trends 和 Opportunities 中对观点的引用。

详情页必须回答：

1. 谁说了什么。
2. 这句话为什么值得看。
3. 它对商业判断意味着什么。
4. 它有哪些边界和不确定性。
5. 它关联哪些 Signal、Trend、Opportunity。
6. 原始来源在哪里。

详情页不应：

- 大段复制原文。
- 把观点包装成事实。
- 输出投资、经营或合作指令。
- 展示后台抓取、feed、JSON、脚本等内部流程语言。

## 12. 内容边界

The Point 不做：

- 网红观点搬运。
- 情绪热榜。
- 无来源短评。
- 未经解读的原文堆叠。
- 投资建议。
- 替用户下最终经营判断。

The Point 必须做：

- 标明来源。
- 保留观点边界。
- 简要解释商业含义。
- 可回链到原文。
- 可关联现有 Signal、Trend、Opportunity。
