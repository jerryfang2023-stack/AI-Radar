# 06-content｜日常监测 v2 内容库

本目录承载观澜AI日常监测算法 v2 的测试内容资产。它服务“信号 -> 判断 -> 机会 -> 验证 -> 沉淀 -> 分发 -> 反馈”的闭环，成熟前不替换正式 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`07-Opportunities/` 或 `signals.html`。

## 1. 目录结构

| 目录 | 阶段 | 每日输出 | 建议字数 |
|---|---|---:|---:|
| `00-inbox/` | 临时收件箱 | 手工补充线索、临时链接、待复核素材 | 不限 |
| `01-raw/` | 原始采集 | 30-50 条候选 + 本地原文档案 | 每条 30-80 字，另存原文 |
| `02-pool/` | 初筛入池 | 10-15 条候选 | 每条 120-250 字 |
| `03-structured-signals/` | 结构化入库 | 5-8 条 Signal | 每条 700-1200 字 |
| `04-selected-signals/` | 精选 3 条 | 3 条短深度 Signal | 每条 1200-1800 字 |
| `05-trend-chain/` | 趋势归类 | 全量结构化 Signal 的趋势挂载 | 800-1500 字 |
| `06-insights/` | 观澜判断 | 1-3 条 Insight | 每条 300-600 字 |
| `07-points/` | 观点输入 | Point / Builder 共识 | 每条 150-300 字 |
| `08-opportunities/deep-dive/` | 深挖机会 | 0-1 篇内参级深挖 | 3000-6000 字 |
| `09-mvp-validation/` | MVP 验证 | 0-1 个 7-14 天验证计划 | 600-1200 字 |
| `10-databases/` | 长期沉淀 | 趋势库、机会库、场景库、项目库、风险库 | 按条目更新 |
| `11-content-distribution/` | 分发派生 | 内参、朋友圈、海报、短视频脚本 | 按渠道 |
| `12-feedback/` | 反馈回流 | 用户问题、企业需求、项目线索 | 每条 100-300 字 |
| `_archive/` | 归档 | 被替换、降级或过期的测试资产 | 不限 |

## 2. 每日交付包

每日完整交付不是一篇文章，而是一组判断资产。

| 交付物 | 必须 / 可选 | 质量门槛 |
|---|---|---|
| Raw Candidates | 必须 | 30-50 条，覆盖融资、产品、客户、观点、政策、开源、招聘等来源类型；每条必须保存本地原文并写明出处 |
| Signal Pool | 必须 | 10-15 条，写明入池理由和淘汰风险 |
| Structured Signals | 必须 | 5-8 条，完成 6 维度分析、反证、证据缺口和趋势候选 |
| Selected Signals | 必须 | 正好 3 条，每条完成官网、融资/投资人、客户/案例/定价三类二次搜索 |
| Insight | 必须 | 至少 1 条，把 Signal 转成观澜判断，不写泛泛总结 |
| Trend Classification | 必须 | 全量结构化 Signal 都要挂载旧 Trend / 新建候选 / 观察中 |
| Opportunity Deep Dive | 条件必做 | 每天最多 1 篇；证据不足时明确写“今日暂无足够证据支撑深挖内参” |
| MVP Validation | 条件必做 | 只有深挖机会成立时输出 7-14 天验证计划 |
| Database Update | 必须 | 至少更新趋势库；若有深挖，更新机会库、场景库、项目库、风险库 |
| Content Derivatives | 可选 | 只从已完成的深挖或精选 Signal 派生，不反向编造判断 |
| Feedback | 可选 | 有真实用户问题或项目线索时写入，后续回流到 Signal |

### 2.1 Raw 本地原文规则

Raw 阶段的目标是“可回溯”，不是先做判断。每条 Raw 必须有两部分：

1. `raw-candidates.md` 中的短条目：30-80 字，只写这条为什么值得进入候选。
2. `originals/YYYY-MM-DD/` 中的本地原文档案：保存原文标题、原文正文或可用摘录、出处、URL、采集时间和来源类型。

推荐路径：

```text
06-content/01-raw/YYYY-MM-DD-raw-candidates.md
06-content/01-raw/originals/YYYY-MM-DD/R-001-source-title.md
```

Raw 条目模板：

```markdown
### R-001｜标题或事件名

- 原文档案：`06-content/01-raw/originals/YYYY-MM-DD/R-001-source-title.md`
- 出处：来源名称 + URL
- 来源类型：官网 / 媒体 / 投资方 / 客户案例 / 社媒 / 开源 / 招聘 / 政策 / 数据库
- 采集理由：30-80 字，说明它可能影响收入、成本、流程、岗位、资本或迁移判断。
```

本地原文档案模板：

```markdown
---
raw_id: R-001
source_name:
source_url:
source_type:
captured_at:
language:
copyright_note: local research archive only
---

# 原文标题

## 原文 / 可用正文

保存网页正文、官方公告正文、社媒原帖文本、播客转写片段或招聘 JD 正文。若只能合法保存短摘录，必须说明限制。

## 机器翻译 / 中文摘录

可选。只用于内部理解，不替代原文。

## 采集备注

说明是否为一手来源、是否需要二次搜索、是否存在可信度问题。
```

没有本地原文档案的线索，只能放入 `00-inbox/`，不得进入 `01-raw/`。

## 3. 标签与标题体系

v2 不另起一套失控标签。所有正式标签必须兼容 `agent-workflow/product/tag-taxonomy.md`，并服务现有栏目标题体系。

### 3.1 两层标签

| 类型 | 用途 | 是否迁移到正式 Tags |
|---|---|---|
| `formal_tags` | 搜索、筛选、关系网络 | 可以迁移 |
| `classification_labels` | v2 聚类中间判断，如场景标签、技术标签、商业标签、影响对象、价值维度、迁移判断 | 不直接迁移 |

### 3.2 与现有标题体系的融合

每天每条核心内容都要同时写：

```yaml
primary_title_family: Signals | The Point | Opportunities | Trends | Daily Brief
primary_trend_label: AI Sales Automation | AI Customer Support | AI Knowledge Base | AI Workflow Automation | AI Coding / Vibe Coding | One-person Company | AI Content Growth | Other
formal_tags:
  - track-...
  - function-...
  - scenario-...
  - evidence-...
classification_labels:
  scene:
  tech:
  business:
  affected_object:
  value_dimension:
  migration:
candidate_tags:
  - ...
```

`primary_trend_label` 用于内容理解和标题归类，`formal_tags` 用于迁移和关系网络。两者不能混成一堆标签。

### 3.3 控制膨胀

- 单条 Signal 最多 6 个正式标签：1 个 `track`、1 个 `function`、1 个 `scenario`、1 个 `evidence`、1 个 `source`，可选 1 个 `region` 或 `stage`。
- 单条 Opportunity 必须有 `track + function + scenario`，建议补 1 个 `customer`，最多 7 个正式标签。
- Point 不以人物姓名做 tag；人物进入 `person` 字段。
- 公司名、产品名、轮次名、情绪词、宽泛词不进入正式 tag。
- 新词先进入 `candidate_tags`，只有满足“连接 3 条以上资产、跨 2 个日期或经 PM / Data 确认”才进入正式标签字典。
- `One-person Company`、`AI Content Growth` 等新方向先作为 `primary_trend_label`，不要马上新增正式 `track`；等连续出现后再由 Data Agent 决定是否扩充字典。

### 3.4 迁移友好

正式迁移时只读取：

- 稳定 ID：`signal_id` / `trend_id` / `opportunity_id` / `point_id`。
- `primary_title_family`。
- `primary_trend_label`。
- `formal_tags` 的 `tag_id`。
- 关系字段：`related_signal_ids` / `related_trend_ids` / `related_opportunity_ids`。

`classification_labels` 和 `candidate_tags` 作为分析上下文保留，不直接进入前台筛选。

## 4. 手工启动口令

在调度中枢或独立执行窗口中，可使用以下口令启动 v2 流程：

| 口令 | 执行范围 |
|---|---|
| `启动：日常监测v2` | 跑完整链路：采集、初筛、结构化、精选 3 条、Insight、趋势归类、深挖判断、数据库更新 |
| `启动：日常监测v2-采集` | 只生成 `01-raw/` 与 `02-pool/` |
| `启动：日常监测v2-入库` | 从 pool 生成 `03-structured-signals/` |
| `启动：日常监测v2-精选` | 从 structured 中选 3 条，并完成轻量二次搜索 |
| `启动：日常监测v2-深挖` | 从精选 Signal 中选择 0-1 个机会，执行重搜索和内参级深挖 |
| `启动：日常监测v2-趋势` | 执行 Signal -> Trend 挂载、评分和长期库更新 |
| `启动：日常监测v2-复核` | 检查数量、来源、6 维度、反证、字数和标签是否合规 |

这些口令是项目工作流指令，不替代生产自动化 `ai-2` 和 `ai-3`。

## 5. 运行边界

- 测试页：`04-Site/signal-lab.html`
- 测试同步脚本：`04-Site/scripts/sync-signal-lab.mjs`
- 测试数据：`04-Site/data/signal-lab-data.json` 与 `04-Site/data/signal-lab-data.js`

禁止把本目录内容直接同步进正式前台。若需要迁移，必须另行派发正式入站任务。
