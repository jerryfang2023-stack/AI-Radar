# 01-SiteV2/content｜V2 日常监测内容库

本目录承载观澜AI V2 日常监测算法的内容资产。它服务“信号 -> 判断 -> 机会 -> 验证 -> 沉淀 -> 分发 -> 反馈”的闭环，是 V2 生产线内容库，不再服务 V1 旧栏目更新。

## 1. 目录结构

| 目录 | 阶段 | 每日输出 | 建议字数 |
|---|---|---:|---:|
| `00-inbox/` | 临时收件箱 | 手工补充线索、临时链接、待复核素材 | 不限 |
| `01-raw/` | 原始采集 | 80-150 条候选；低信号或接口失败日可降级 50-80 | 每条 30-80 字，另存原文 |
| `02-pool/` | 初筛入池 | 20-30 条候选；降级日 12-20 | 每条 120-250 字 |
| `03-structured-signals/` | 结构化入库 | 8-15 条 Signal；降级日 5-8 | 每条 1200-2000 字 |
| `04-selected-signals/` | 精选 3-5 条 | 默认 3 条，高信号日 4-5 条 | 每条 3000-5000 字 |
| `05-trend-chain/` | 趋势归类 | 全量结构化 Signal 的趋势挂载 | 800-1500 字 |
| `06-insights/` | 观澜判断 | 1-3 条 Insight | 每条 300-600 字 |
| `07-points/` | 观点输入 | Point / Builder 共识 | 每条 150-300 字 |
| `08-opportunities/deep-dive/` | 深挖机会 | 1-2 篇内参级深挖；证据不足时明确说明不硬凑 | 6000-10000 字 |
| `09-mvp-validation/` | MVP 验证 | 0-1 个 7-14 天验证计划 | 600-1200 字 |
| `10-databases/` | 长期沉淀 | 趋势库、机会库、场景库、项目库、风险库 | 按条目更新 |
| `11-content-distribution/` | 分发派生 | 内参、朋友圈、海报、短视频脚本 | 按渠道 |
| `12-feedback/` | 反馈回流 | 用户问题、企业需求、项目线索 | 每条 100-300 字 |
| `_archive/` | 归档 | 被替换、降级或过期的测试资产 | 不限 |

### 1.1 Legacy import

`00-inbox/legacy-import/` 用于接收 V1 历史判断资产和近期监测产物的迁移索引。它不是最终内容目录，不能把 V1 Markdown 原样搬入前台。

本轮索引文件：

- `00-inbox/legacy-import/README.md`
- `00-inbox/legacy-import/legacy-import-index-2026-05-07.md`
- `agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md`
- `agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md`

历史资产只有完成 V2 稳定 ID、来源路径、原始日期、转换日期、关系字段、证据缺口和反证边界后，才能进入 Structured / Front Signal / Opportunity / HeatEvidence。

## 2. Source-router 采样口径

V2 每日 Raw 不再给 follow-builders 设置固定比例。当前口径：

| 来源通道 | Raw 角色 | Pool 角色 |
|---|---|---|
| AI HOT | 主数量池，提供高通量热点和中文 AI 圈趋势密度 | 与关键词搜索共同竞争主池，按商业信号强度筛选 |
| 联网关键词搜索 | 主数量池，补融资、产品、客户、监管、反证和商业事实 | 与 AI HOT 共同竞争主池，优先保留可追溯事实线索 |
| follow-builders | 全量扫描，不设比例；通常每日约 10-20 条可用 builder 观点/实践线索 | 不设配额，按质量进入 Point / Trend / Signal 线索 |

进入 Structured / Front Signal / Deep Dive 后，取消来源比例，只看证据质量、商业判断价值和是否能补足 S/A/B 原始来源。

## 2. 每日交付包

每日完整交付不是一篇文章，而是一组判断资产。

| 交付物 | 必须 / 可选 | 质量门槛 |
|---|---|---|
| Raw Candidates | 必须 | 80-150 条，低信号或接口失败日可降级 50-80；覆盖融资、产品、客户、观点、政策、开源、招聘等来源类型；每条必须保存本地原文并写明出处 |
| Signal Pool | 必须 | 20-30 条，降级日 12-20；写明入池理由和淘汰风险 |
| Structured Signals | 必须 | 8-15 条，降级日 5-8；完成 6 维度分析、反证、证据缺口和趋势候选 |
| Selected Signals | 必须 | 3-5 条，默认 3 条；每条完成官网、融资/投资人、客户/案例/定价三类二次搜索 |
| Insight | 必须 | 至少 1 条，把 Signal 转成观澜判断，不写泛泛总结 |
| Trend Classification | 必须 | 全量结构化 Signal 都要挂载旧 Trend / 新建候选 / 观察中 |
| Opportunity Deep Dive | 条件必做 | 每天 1-2 篇；第 2 篇必须有充足证据，证据不足时明确写“今日暂无足够证据支撑深挖内参” |
| MVP Validation | 条件必做 | 只有深挖机会成立时输出 7-14 天验证计划 |
| Database Update | 必须 | 至少更新趋势库；若有深挖，更新机会库、场景库、项目库、风险库 |
| Content Derivatives | 可选 | 只从已完成的深挖或精选 Signal 派生，不反向编造判断 |
| Feedback | 可选 | 有真实用户问题或项目线索时写入，后续回流到 Signal |

### 2.2 各阶段最低质量门槛

### 2.1A 主数量池 + Builder 观点雷达

V2 每日生产线使用 AI HOT 与联网关键词搜索作为主数量池，follow-builders 作为全量扫描的 Builder 观点雷达：

| 来源 | 角色 | 使用方式 |
|---|---|---|
| AI HOT | 主数量池，高通量热点与中文 AI 圈趋势密度 | 直接通过接口拉取优质候选 |
| 联网关键词搜索 | 主数量池，观澜自有主动监测 | 用关键词覆盖融资、产品、客户、监管、反证、商业事实 |
| follow-builders | 全量扫描的 Builder 观点雷达 | 优先读取 follow-builders skill；不设 Raw / Pool 固定比例；脚本层使用 builder query proxy 兜底 |

每日自动化先运行：

```powershell
node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=YYYY-MM-DD
```

该脚本会：

- 从 AI HOT public API 获取优质候选。
- 合并联网关键词搜索、follow-builders skill / proxy、HN / GDELT 等补充候选。
- 去重、初步分级和排序。
- 写入 `01-SiteV2/content/01-raw/YYYY-MM-DD-raw-candidates.md`。
- 写入 `01-SiteV2/content/01-raw/originals/YYYY-MM-DD/` 本地原文档案。
- 写入 `01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md`。
- 写入 `agent-workflow/reports/YYYY-MM-DD-v2-daily-source-router-log.md`。

脚本不替代内容判断。AI HOT、联网关键词搜索、follow-builders、HN、X、Reddit 等仍是 discovery / source-router，不能直接作为 Front Signal 的事实主证据。进入 Structured / Front / Deep Dive 前，必须打开原始 URL，并补充官方、产品页、论文、客户案例、A 级媒体等 S/A/B 来源。

2026-05-10 B 类确认后，每日生产漏斗不只检查数量，也检查字段完整度：

| 阶段 | 必填质量项 |
|---|---|
| Raw | 每条必须有本地原文档案 |
| Pool | 每条必须有入池理由、淘汰风险 |
| Structured | 每条必须有事件、商业变量、来源等级、反证或证据边界、趋势候选，1200-2000 中文字 |
| Front | 每条固定至少 3 个 S/A/B 来源、3000-5000 中文字 |
| Deep Dive | 每条固定 5 来源、其中 2 个 S 级或一手来源、6000-10000 中文字 |
| Point | 每条必须有原始观点、观澜解读、关联关系 |

缺失处理：

- Raw 没有本地原文档案，不计入 Raw 数量。
- Pool 没有入池理由或淘汰风险，不得进入 Structured。
- Structured 缺事件、商业变量、来源等级、反证或趋势候选，不得进入 Front。
- Front 不足 3 个解析后的 S/A/B 原始来源，不得进入前台精选。
- Deep Dive 不足 5 来源或不足 2 个 S 级 / 一手来源，不得硬凑，应明确记录证据不足。
- Point 缺原始观点、观澜解读或关联关系，不得作为 Point Calibration 完整项。
- 所有事实引用、数据、融资、客户案例、产品发布、监管、观点和参数必须带来源名、来源等级、原始外链和增量事实说明。
- 没有原始外链的引用不得作为事实引用；只能记录为待补证线索。

### 2.3 数量不足时的处理

数量不足时允许降级运行，但必须写清缺口：

| 阶段 | 处理 |
|---|---|
| Raw | 80-150 完整；50-79 降级；低于 50 严重降级，仍有多少抓多少 |
| Front | 不足 3 条时允许发布 2 条，并写明缺口；低于 2 条不得标记为前台完整更新 |
| Deep Dive | 无足够证据时写“今日暂无足够证据支撑深挖内参”，不得硬凑 |
| Trend | 不足 3 条时允许只更新 1-2 条，并写清缺口 |

降级日必须记录：

- 为什么数量不足。
- 哪些来源失败。
- 哪些候选因缺证据被挡下。
- 是否影响前台更新、Trend 判断或 Deep Dive。
- 后续需要补哪些来源或关键词。

### 2.4 反证、风险与字数硬门槛

反证要求：

- Structured Signal：不强制每条都有反证；未发现时写 `counter_evidence_status: not_found / not_applicable`。
- Front Signal：不强制每条都有反证；但必须写清证据边界或仍需观察的缺口。
- Deep Dive：只有利好、没有反证可以通过，但必须说明“本轮未发现关键反证”；证据不足不得通过。
- 风险类高热内容：进入 `risk trend` 或 `counter-evidence` 候选。

风险类高热内容包括监管、诉讼、安全、隐私、成本、客户流失、停用、关停、融资失败、产品下架等。

字数与深度硬门槛：

| 内容类型 | 字数门槛 | 是否必需 |
|---|---:|---:|
| Structured Signal | 1200-2000 中文字 | 是 |
| Front Signal | 3000-5000 中文字 | 是 |
| Deep Dive | 6000-10000 中文字 | 是 |

字数达标但证据不足，不得通过。

### 2.5 v2content Gate 后续升级

B 类当前只更新规范，不修改脚本。F 类确认后，建议升级 `v2content` gate，检查：

- Heat Candidate 文件与字段。
- daily run log 六个必填字段。
- 来源等级和 M 通道隔离。
- Raw 原文档案覆盖率。
- Pool 入池理由和淘汰风险。
- Structured / Front / Deep Dive 字数门槛。
- 引用来源名、来源等级、原始外链和增量事实。
- Front S/A/B 来源数量。
- Point 原始观点、观澜解读和关联关系。

### 2.1 Raw 本地原文规则

Raw 阶段的目标是“可回溯”，不是先做判断。每条 Raw 必须有两部分：

1. `raw-candidates.md` 中的短条目：30-80 字，只写这条为什么值得进入候选。
2. `originals/YYYY-MM-DD/` 中的本地原文档案：保存原文标题、原文正文或可用摘录、出处、URL、采集时间和来源类型。

推荐路径：

```text
01-SiteV2/content/01-raw/YYYY-MM-DD-raw-candidates.md
01-SiteV2/content/01-raw/originals/YYYY-MM-DD/R-001-source-title.md
```

Raw 条目模板：

```markdown
### R-001｜标题或事件名

- 原文档案：`01-SiteV2/content/01-raw/originals/YYYY-MM-DD/R-001-source-title.md`
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

## 3A. 高热但未入 Signal 的保存规则

Raw 在 Trend 判断中承担“热度轴”，不能只作为低权重背景。高热但暂未进入 Structured Signal / Front Signal 的内容，应保存为 Heat Candidates：

```text
01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md
```

Heat Candidate 适用于：

- Raw 中同一主题、事件、公司或赛道被多来源重复提及。
- AI HOT / follow-builders / HN / X / Reddit 等 M 级通道显示话题升温，但还缺 S/A/B 商业证据。
- Pool 中有明显主题簇，但还不能证明商业含义。
- 高热内容更多体现风险、监管、成本、争议或失败反馈。

Heat Candidate 不进入前台关键信号，也不进入正式 Signal / Trend / Opportunity 知识库；但应同步沉淀到 `01-SiteV2/knowledge/11-Heat-Candidates/`，作为观察型知识资产，用于 7 / 30 / 90 天回看、重复热度累计和未来升级回链。

每条 Heat Candidate 至少包含：

```yaml
heat_id:
date:
topic:
heat_reason:
raw_refs:
source_mix:
m_channels:
original_urls:
related_pool_items:
formal_tags:
classification_labels:
candidate_tags:
why_not_signal:
needed_evidence:
suggested_trend_status:
```

处理规则：

- 连续 2 天以上出现，且补齐 S/A/B 商业证据：升级为 Structured Signal 候选。
- 连续高热但无法补证：保留为 Trend 背景或降级为 noise。
- 指向监管、诉讼、安全、成本、客户流失：优先进入 Trend risk / counter-evidence。
- 只来自 M / C 来源且无原始证据：保留在 heat candidates，不进入 Front Signal。

标签规则：

- Heat Candidate 必须同步正式标签体系，便于后续搜索、筛选和趋势连续性统计。
- `formal_tags` 只能使用 `agent-workflow/product/tag-taxonomy.md` 中已有的正式 tag_id。
- 建议至少挂 1 个 `track`，可选 `source`、`stage`、`evidence`、`function`。
- 新出现但未确认的热词写入 `classification_labels` 或 `candidate_tags`，不得直接扩充正式标签。
- 公司名、产品名、人物名不作为正式 tag；分别进入 topic、company、person 或 candidate context。
- 无法归类时写 `needs_tag_review`，交由 Data Agent 后续周报处理。

### 3A.1 Heat Candidate 升级与降级

Heat Candidate 每日复核必须维护状态：

```yaml
status: watch / upgrade_to_structured_signal / upgrade_to_front_signal_candidate / upgrade_to_trend_update / upgrade_to_risk_trend / keep_as_background / downgrade_to_noise
first_seen:
last_seen:
seen_count_7d:
source_type_count:
related_heat_ids:
related_signal_ids:
upgrade_trigger:
```

升级为 Structured Signal 的最低条件：

- 连续 2 天出现，或 7 天内出现 3 次以上。
- 至少补齐 2 个 S/A/B 原始来源。
- 有明确事件和至少 1 个商业变量。

升级为 Front Signal 候选的最低条件：

- 已满足 Structured 条件。
- 至少 3 个 S/A/B 原始来源。
- 有明确商业含义、反证边界和后续观察点。

升级为 Trend Update / Trend 库候选的最低条件：

- 同一主题跨 3 天或近 7 天出现 3 次以上。
- 覆盖至少 2 类来源类型。
- 至少有 2 条 Structured / Front Signal 支撑，或 1 条 Structured / Front Signal 加 2 条有 S/A/B 来源的 Heat Candidate。
- 能判断趋势阶段：emerging / rising / splitting / risk / cooling。

降级为 noise 的条件：

- 连续 3 次只来自 M/C 来源，无法补 S/A/B。
- 只有情绪热度、SEO、搬运或工具导航，没有商业变量。
- 与观澜 AI 当前重点赛道和商业判断无关。

### 3A.2 重复与合并规则

同一事件多来源：

- 合并为一条 Raw / Pool / Structured 资产。
- S 级原始来源作为主来源。
- A/B 来源作为补充来源。
- M 级通道只记录发现路径。
- 多来源不增加 Signal 数量，但增加热度说明和来源强度。

同一公司连续多天出现：

- 默认更新旧 Signal 或 Heat Candidate。
- 必须追加热度说明或变化说明。
- 只有出现新事件类型、新商业变量或新趋势候选时，才新建 Signal。

Heat Candidate 升级后：

- 原 Heat Candidate 状态改为 `converted`。
- 原候选必须写 `converted_to`，指向新 Signal / Trend。
- 新 Signal / Trend 必须写 `origin_heat_candidates`，回链原候选。
- 不删除原候选，保留为趋势热度历史。
- `converted_to` 与 `origin_heat_candidates` 是 F 类验收硬门槛。

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

当前可执行检查：

```powershell
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
```

该检查只验证 V2 内容生产路径，不运行旧 `04-Site` 同步，不部署 Netlify。
