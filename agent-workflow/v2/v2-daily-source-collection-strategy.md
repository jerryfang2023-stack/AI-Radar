---
title: V2 Daily Source Collection Strategy
date: 2026-05-08
type: v2-source-strategy
status: active
task_id: WSD-20260508-10-v2-source-interface-upgrade-autopilot
owner: v2-source-intelligence / workflow
---

# V2 Daily Source Collection Strategy

## 1. 目标

每日 09:00 自动化按 source registry 生成 Raw 候选，不再只依赖泛搜索。

目标漏斗：

```text
Source Registry
-> Raw 80-150
-> Pool 20-30
-> Structured 8-15
-> Front Signal 3-5
-> Deep Dive 1-2
-> Trend Updates 3-5
-> V2 site data update
```

## 2. 三档生产口径

| 场景 | Raw | Pool | Structured | Front Signals | Deep Dive | Trend Updates | 使用条件 |
|---|---:|---:|---:|---:|---:|---:|---|
| 日常默认 | 80-120 | 20-25 | 8-12 | 3 | 1 | 3 | source probe 正常，S/A/B 覆盖稳定 |
| 高信号日 | 120-150 | 25-30 | 12-15 | 4-5 | 1-2 | 4-5 | 多个 S/A/B 来源同日高密度更新 |
| 降级日 | 50-80 | 12-20 | 5-8 | 2-3 | 0-1 | 1-3 | 关键接口失败、S/A/B 证据不足或噪音偏高 |

硬规则：

- 扩大 Raw 只扩大候选池，不降低前台证据门槛。
- Front Signal 仍必须每条至少 3 个 S/A/B 来源。
- 第 2 条 Deep Dive 只有在证据链、反证和商业模式都充足时生成。
- 采集通道和事实来源分离；AI HOT、follow-builders、HN 等先作为 discovery channel，解析原始 URL 后再给原始来源定 S/A/B/C。
- 2026-05-10 A 类确认后，旧 Raw 30-50 与单一泛搜索完成每日监测的口径废止；任何低于 50 Raw 的运行只能记录为失败或部分失败，不能报告为 V2 每日生产完成。

## 3. Raw 80-150 来源配比

| 类型 | 目标数量 | 默认来源 |
|---|---:|---|
| S 级官方产品 / 平台 | 20-30 | OpenAI、Anthropic、Google、Microsoft、GitHub、NVIDIA |
| A 级媒体 / 全球新闻 | 18-28 | GDELT、TechCrunch、Reuters、VentureBeat |
| B 级开发者 / 研究 | 15-25 | GitHub、arXiv、Hugging Face、HN |
| B 级融资 / 创业 / 市场 | 12-20 | YC、a16z、Sequoia、AWS / Azure Marketplace |
| 混合采集通道 / Builder / 聚合 | 10-25 | AI HOT、follow-builders、HN、已批准 Builder 线索 |
| 反证 / 风险 | 5-10 | 监管、诉讼、安全、成本、失败反馈 |

配比不是硬凑数量。若某类来源当天为空，应记录缺口和降级，不得用低质量来源填满。

### 3.1 A 类确认后的来源记账要求

每日 Raw 记账必须同时按两条线统计：

| 统计项 | 用途 |
|---|---|
| `raw_count_by_source_type` | 说明 Raw 是否覆盖官方产品、媒体、开发者 / 研究、融资 / 市场、混合采集、风险反证等类型 |
| `source_distribution` | 说明各来源、来源层级和采集通道的实际贡献 |

M 级通道单独记录为 routing，不计入 S/A/B 事实来源数量。若 AI HOT / follow-builders / HN 指向一手公告、产品文档、GitHub、论文或 A 级媒体，应把解析后的原始 URL 写入对应 S/A/B 来源，并保留 M 通道作为发现路径。

## 4. 查询模板

### Agent / Workflow

```text
"AI agent" enterprise workflow adoption
"agentic workflow" cost token GitHub
"agent governance" security permission audit
智能体 工作流 企业 采用
```

### AI Coding / Devtools

```text
"AI coding" enterprise adoption
"code agent" pull request review
"AI developer tool" release
GitHub AI agent stars enterprise
```

### Enterprise AI / Governance / Security

```text
"enterprise AI" governance security
"AI control plane" agent audit
"AI security" funding customer
"model evals" enterprise deployment
```

### Vertical AI

```text
"vertical AI" pilot customer
"AI for legal" customer deployment
"AI healthcare" procurement pilot
"AI accounting" first customer
```

### AI Infra / Model Routing / Evals

```text
"model routing" API gateway AI
"AI evals" open source enterprise
"inference cost" reduction deployment
"local inference" quantization enterprise
```

### Customer Support / Sales / Marketing / Finance / Legal / Procurement

```text
"AI voice agent" customer support deployment
"AI sales agent" ARR customer
"AI procurement" tender bidding
"legal AI" law firm adoption
```

### Robotics / On-device / Edge AI

```text
"on-device AI" product release
"AI wearable" camera assistant
"robotics foundation model" deployment
"edge AI" enterprise inference
```

## 5. 时间窗口

| 阶段 | 时间窗 | 用途 |
|---|---|---|
| 24h | 默认新闻与官方更新 | 今日 Raw 主池 |
| 72h | 周末、低频官方博客、融资补证 | 防止漏掉时差和晚发布 |
| 7d | arXiv、GitHub、市场 listing、投资机构观点 | 早期和低频信号 |

AI HOT 默认使用最近 24h selected；如 24h 少于 10 条，可扩至 72h，但必须在日志说明。

## 6. 去重规则

基础键：

```text
normalized_url
company + product + event_type + event_date
```

增强键：

```text
workflow_change + customer_segment + business_signal_type
source_cluster
```

合并规则：

- 同一融资新闻多来源合并为一条 Raw，保留所有来源。
- 同一官方发布 + 多个媒体报道合并为一条 Pool 候选。
- AI HOT / HN / X 线索若指向同一官方源，只保留原始官方源作为主证据。
- 新增证据明显的重复事件可标记为 `tracked_signal_update`，不新增同名 Signal。

## 7. C 级来源二次搜索

混合采集通道包括 AI HOT、follow-builders、HN 社区、X、LinkedIn、Reddit、聚合站。

处理规则：

1. 先做 discovery / routing，不直接计入事实证据。
2. 回看每条 item 的原始 URL。
3. 对原始 URL 重新判定 S/A/B/C：官方公告、产品文档、GitHub repo、论文、A 级报道、社交观点各自分级。
4. 至少补 2 个解析后的 S/A/B 来源才可进 Structured。
5. 至少 3 个解析后的 S/A/B 来源才可进 Front Signal。
6. 找不到原始证据时进入 `hold / needs_review`。

## 8. 噪音降权

降权内容：

- 纯工具导航。
- prompt 合集。
- affiliate 或 SEO 内容。
- 无来源搬运。
- 只有 benchmark，没有商业含义。
- 只有融资金额，没有客户 / 产品 / 技术路径。
- 社媒单点爆料但无原始链接。

连续 7 天低产或污染的来源，写入 source weekly report，并在 registry 中将 `enabled_default` 调整为 false。

## 9. 失败降级

| 失败 | 降级 |
|---|---|
| GDELT 失败 | 使用 A 级媒体 RSS / search-only + 官方来源 |
| AI HOT 失败 | 使用 GDELT + HN + 官方博客，不用单一泛搜索冒充精选池 |
| GitHub API 限流 | 使用 GitHub web search / HN / 项目官网，记录限流 |
| arXiv 失败 | 使用 arXiv RSS / Semantic Scholar / 手动搜索 |
| requires-key 来源不可用 | 跳过，不阻塞每日任务 |
| C 级来源无法回证 | 标记 hold，不进入 Front Signal |

每日日志必须写：

```text
source_distribution:
failed_sources:
fallback_used:
evidence_gaps:
raw_count_by_source_type:
front_signal_sab_source_count:
```

缺少以上字段时，只能标记为 `needs_review` 或 `partial`，不得标记为每日生产完整完成。

## 10. 明天 09:00 自动化执行建议

自动化启动时先读取：

```text
01-SiteV2/content/10-databases/source-registry-v2.json
agent-workflow/v2/v2-commercial-brief-depth-standard.md
```

建议执行顺序：

1. 运行 `v2-source-quality-gate.mjs` 检查 registry。
2. 运行 `v2-source-probe.mjs` 诊断默认低门槛来源。
3. 按本策略采集 Raw 80-150，并按默认 / 高信号 / 降级三档记录原因。
4. 对 AI HOT / follow-builders / HN 等采集通道回看原始 URL，并按原始来源重新补 S/A/B 来源。
5. 先生成结构化分析字段，再生成 V2 内容。
6. 每日信号、深挖机会卡、趋势链必须按商业内参深度标准生成展示元素。
7. 运行 `v2content` 和 `syntax`。

## 11. 商业内参深度与展示要求

每日内容不能只满足数量和字数。自动化必须读取：

```text
agent-workflow/v2/v2-commercial-brief-depth-standard.md
```

生成正文前，必须先形成：

- 面向普通老板的一句话判断。
- 事实变化、商业变量、受影响行业 / 岗位 / 流程。
- S/A/B 原始证据梯子，M 级采集通道只能作为 routing 记录。
- 反证与边界。
- 对应展示元素数据。

三类内容最低展示要求：

| 内容 | 最低展示元素 |
|---|---|
| 每日信号 | 时间线、影响坐标、证据梯子、商业变量卡、反证卡中至少 3 个 |
| 深挖机会卡 | 机会地图、玩家分层、商业模式表、验证清单、雷达图 / 风险雷达中至少 5 个 |
| 趋势链 | 趋势阶段条、趋势线、热力图、信号簇、推力 / 阻力、升降级触发器中至少 4 个 |

写作口径：

- 先讲人话，再解释专业词。
- 每段必须回答一个商业问题，不写空泛总结。
- 不用 AI 行话替代判断；模型、论文、框架必须落到客户、成本、收入、交付、采购或风险上。
- 如果材料不足以讲清商业变量，正确动作是降级为 hold 或趋势背景，不硬写成深挖。

## 12. Trend 热度轴与证据轴

Trend Updates 不只从 Structured Signals 或 Front Signals 生成。2026-05-10 B 类确认后，趋势判断采用双轴模型：

```text
Trend 判断 = Raw 热度变化 + Pool 主题簇 + Structured 证据强度 + 历史连续性 + 反证边界
```

### 12.1 热度轴

热度轴主要读取 Raw / Pool：

| 输入 | 作用 | 权重 |
|---|---|---:|
| Raw 80-150 | 判断声量、扩散速度、重复事件密度、多来源同题频率 | 高 |
| Pool 20-30 | 从热度中排除噪音，识别主题簇和候选趋势 | 高 |
| M 级通道 | 记录发现路径和讨论热度，不作为事实证据 | routing |

Raw 热度可触发 Trend 候选，但不能单独证明趋势成立。判断热度时应看：

- 同一事件是否被多来源重复提及。
- 同一公司 / 产品是否在多个类型来源中出现。
- 同一主题是否同时出现在官方、媒体、开发者、融资、社媒或社区通道。
- 与过去 7 / 30 / 90 天相比，声量是否明显上升。
- 高热内容是否集中在同一商业变量：客户、成本、收入、效率、风险、采购、渠道或竞争位置。

### 12.2 证据轴

证据轴主要读取 Structured / Front / 历史 Signals：

| 输入 | 作用 | 权重 |
|---|---|---:|
| Structured Signals 8-15 | 判断商业证据和结构化含义 | 高 |
| Front Signals 3-5 | 高可信样本与前台主线 | 中高 |
| 近 7 / 30 / 90 天历史 Signals | 判断连续性、阶段变化和趋势升降级 | 高 |
| Point Calibration | 判断共识、分歧、反证和假设边界 | 中 |
| Deep Dive | 补强机会侧和商业模式判断 | 中 |

Trend 状态必须由热度轴和证据轴共同决定：

- `emerging`：Raw / Pool 热度升高，但 Structured 证据仍少。
- `rising`：Raw / Pool 热度升高，且 Structured / Front / 历史 Signals 有连续证据。
- `splitting`：Raw 热度高，但证据指向不同场景或出现明显分歧。
- `risk`：Raw 热度集中在诉讼、安全、监管、成本、客户流失等反证。
- `cooling`：Raw 声量下降，且近 7 / 30 / 90 天新增证据减少。

### 12.3 高热但未入 Signal 的保存位置

高热但暂未进入 Structured Signal / Front Signal 的内容不得丢弃，也不得硬写成 Signal。统一保存为 Heat Candidates：

```text
01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md
```

用途：

- 记录当天高热主题、重复事件、来源扩散和未入选原因。
- 为 Trend Updates 提供热度轴输入。
- 为后续 7 / 30 / 90 天趋势连续性提供回看材料。

每条 Heat Candidate 至少写：

```markdown
## HC-YYYYMMDD-01｜主题或事件

- heat_reason:
- raw_refs:
- source_mix:
- m_channels:
- original_urls:
- related_pool_items:
- formal_tags:
- classification_labels:
- candidate_tags:
- why_not_signal:
- needed_evidence:
- suggested_trend_status: emerging / watch / risk / noise
```

如果某个 Heat Candidate 连续 2 天以上出现，或后续补齐 S/A/B 商业证据，应升级为 Structured Signal 候选；如果连续高热但无法补证，应保留为 Trend 背景或 noise，不进入前台关键信号。

Heat Candidates 必须同步标签体系，但不得污染正式标签字典：

- `formal_tags` 只能使用 `agent-workflow/product/tag-taxonomy.md` 中已经存在的正式 tag_id。
- 单条 Heat Candidate 建议至少挂 1 个 `track`，可选 `source`、`stage`、`evidence`、`function`。
- 如果无法确定正式标签，写入 `needs_tag_review`，不得临时编造正式标签。
- 热度中新出现的主题词、公司名、产品名、说法或社媒热词写入 `classification_labels` 或 `candidate_tags`，不直接进入正式 tag。
- `candidate_tags` 只有满足“连接 3 条以上资产、跨 2 个日期或经 PM / Data 确认”后，才可进入正式标签字典评审。

### 12.4 Heat Candidate 升级与降级规则

Heat Candidate 是趋势热度候选，不是永久停车场。每日 Trend 复核时必须判断其状态：

| 状态 | 触发条件 | 处理 |
|---|---|---|
| `watch` | 单日热度高，但 S/A/B 证据不足 | 留在 heat candidates，写明所需补证 |
| `upgrade_to_structured_signal` | 连续 2 天出现，且至少补齐 2 个 S/A/B 原始来源，并能说明一个商业变量 | 进入下一次 Structured Signal 候选 |
| `upgrade_to_front_signal_candidate` | 已满足 Structured 条件，且补齐至少 3 个 S/A/B 原始来源，有明确事件、商业含义和反证边界 | 可参与 Front Signal 3-5 竞争 |
| `upgrade_to_trend_update` | 同一主题跨 3 天或近 7 天出现 3 次以上，覆盖至少 2 类来源类型，并至少有 2 条 Structured / Front Signal 支撑 | 进入 Trend Update 或趋势库候选 |
| `upgrade_to_risk_trend` | 热度来自监管、诉讼、安全、成本、客户流失等反证，且有至少 1 个 S/A 来源确认 | 进入 Trend risk / counter-evidence |
| `keep_as_background` | 连续高热但商业变量不清，或只说明行业讨论升温 | 保留为 Trend 背景，不进入前台 Signal |
| `downgrade_to_noise` | 连续 3 次只来自 M/C 来源，无法补证，或被判定为 SEO / 搬运 / 情绪噪音 | 标记 noise，进入来源 / 关键词降权观察 |

升级为 Signal 的最低条件：

- 有明确事件，不只是话题热。
- 至少 2 个 S/A/B 原始来源；进入 Front Signal 竞争时至少 3 个。
- 能说明至少 1 个商业变量：客户、成本、收入、效率、风险、采购、渠道或竞争位置。
- 写清 `why_now`、`needed_evidence` 和反证边界。

升级为 Trend 的最低条件：

- 不是单点事件，而是同一主题或商业变量的连续出现。
- 至少跨 3 天或近 7 天出现 3 次以上。
- 至少覆盖 2 类来源类型，例如官方 / 媒体 / 开发者 / 融资 / 社区 / 风险反证。
- 至少有 2 条 Structured / Front Signal，或 1 条 Structured / Front Signal 加 2 条有 S/A/B 来源的 Heat Candidate。
- 能判断阶段：emerging / rising / splitting / risk / cooling。

Heat Candidate 每日文件中必须维护：

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

## 13. 内容漏斗最低质量门槛

2026-05-10 B 类确认后，每日内容漏斗各阶段必须同时满足数量和字段质量。数量达标但字段缺失，不得报告为完整完成。

| 阶段 | 最低质量门槛 |
|---|---|
| Raw | 每条 Raw 必须有本地原文档案，路径位于 `01-SiteV2/content/01-raw/originals/YYYY-MM-DD/`；没有本地原文档案的线索只能进入 `00-inbox/`，不得计入 Raw 数量 |
| Pool | 每条 Pool 必须写入入池理由和淘汰风险，说明为什么值得继续看，以及为什么可能不成立 |
| Structured | 每条 Structured Signal 必须包含事件、商业变量、来源等级、反证或证据边界、趋势候选，正文 1200-2000 中文字 |
| Front | 每条 Front Signal 固定至少 3 个解析后的 S/A/B 原始来源，正文 3000-5000 中文字 |
| Deep Dive | 每条 Deep Dive 固定至少 5 个来源，其中至少 2 个 S 级或一手来源，正文 6000-10000 中文字 |
| Point | 每条 Point 必须包含原始观点、观澜解读和关联关系 |

细化规则：

- Raw 本地原文档案必须保留来源名、URL、来源类型、采集时间、可用正文或摘录，以及采集备注。
- Pool 的入池理由必须落到商业变量，不得只写“热度高”。
- Pool 的淘汰风险必须说明缺哪类证据，例如客户、价格、部署、合规、复购、商业模式或一手来源。
- Structured 的来源等级必须区分 S/A/B/C/D/M；M 只记录发现路径。
- Front 的 3 个 S/A/B 来源不得把 AI HOT / follow-builders / HN 通道本身计入。
- Deep Dive 如无法满足 5 来源和 2 个 S 级 / 一手来源，正确输出是“今日暂无足够证据支撑深挖内参”，不得硬凑。
- Point 的关联关系至少关联 Signal / Trend / Opportunity / Risk / Point 中一类；不能只保存孤立观点。
- 所有事实引用、数据、融资、客户案例、产品发布、监管、观点和参数必须有来源名、来源等级、原始外链和该来源提供的增量事实。
- 外链必须指向原始 URL；M 级通道可以作为发现路径记录，但不能替代原始外链。

## 14. 数量不足时的处理规则

2026-05-10 B 类确认后，数量不足不等于停止生产，但必须明确标记降级、缺口和前台影响。

| 阶段 | 数量不足处理 |
|---|---|
| Raw | 80-150 为完整运行；50-79 为降级运行；低于 50 为严重降级，仍然有多少抓多少，但必须写清失败来源、尝试路径、缺口和是否影响后续产出 |
| Pool | 少于 20 时可按实际数量继续，但必须说明 Raw 来源不足、噪音过高或证据不足原因 |
| Structured | 少于 8 时可按实际数量继续，但必须说明哪些 Pool 候选因缺事件、商业变量、来源等级、反证或趋势候选被挡下 |
| Front | 不足 3 条时允许发布 2 条，但必须写明缺口；低于 2 条不得伪装成前台完整更新 |
| Deep Dive | 无足够证据时明确写“今日暂无足够证据支撑深挖内参”，不得硬凑 |
| Trend Updates | 不足 3 条时允许只更新 1-2 条，并写明缺口、缺少的趋势证据和后续观察 |

严重降级日仍要保留生产记录：

- Raw 有多少抓多少，并保存本地原文档案。
- Pool / Structured / Front / Trend 按证据实际情况产出。
- 不得为了达标把 M / C 级来源写成 S/A/B。
- 不得把缺证据的 Deep Dive 写成机会内参。
- daily log 必须标记 `fallback_used`、`evidence_gaps` 和 `front_signal_sab_source_count`。

## 15. 重复、连续出现与候选升级合并规则

2026-05-10 B 类确认后，重复事件和连续出现内容按以下规则处理，避免同一变化被拆成多条孤立资产。

### 15.1 同一事件多来源

同一事件被多个来源报道或采集通道命中时，应合并为一条 Raw / Pool / Structured 资产，保留来源簇，不重复新建：

```yaml
source_cluster:
  primary_source:
  supporting_sources:
  m_discovery_channels:
  source_tiers:
```

处理规则：

- 官方公告、产品页、监管文件、客户案例等 S 级来源优先作为 `primary_source`。
- A/B 来源作为 `supporting_sources`，用于补充融资、市场、开发者、客户或行业语境。
- AI HOT / follow-builders / HN / X / Reddit 等只记录为 `m_discovery_channels`。
- 同一事件多来源不增加 Signal 数量，但会增加来源强度、热度说明和趋势热度权重。

### 15.2 同一公司连续多天出现

同一公司、产品或项目连续多天出现时，默认更新旧 Signal 或相关 Heat Candidate，不直接新建重复 Signal。

允许新建 Signal 的情况：

- 出现新的事件类型，例如从融资变为客户采用、从产品发布变为监管风险。
- 出现新的商业变量，例如客户、成本、收入、效率、风险、采购、渠道或竞争位置发生变化。
- 与旧 Signal 的主题和趋势候选不同。

否则应更新旧 Signal / Heat Candidate，并追加：

```yaml
heat_update:
  new_date:
  new_sources:
  heat_change:
  business_change:
  relation_to_previous_signal:
```

正文中必须写“热度说明或变化说明”，回答：

- 这次新增信息比上次多了什么？
- 是声量升高、证据增强、反证出现，还是只是重复传播？
- 是否改变趋势阶段或机会判断？

### 15.3 Heat Candidate 升级后的回链

Heat Candidate 升级为 Signal / Trend 后，原候选不得丢失。必须在原 Heat Candidate 和新资产之间建立双向关系：

Heat Candidate 中追加：

```yaml
converted_to:
  type: signal / trend / risk_trend
  id:
  date:
  reason:
```

新 Signal / Trend 中追加：

```yaml
origin_heat_candidates:
  - heat_id:
    date:
    heat_reason:
```

处理规则：

- 升级为 Signal：保留原 Heat Candidate 的 `raw_refs`、`source_mix`、`m_channels` 和 `needed_evidence`，用于解释为什么从热度进入信号。
- 升级为 Trend：保留所有相关 Heat Candidate 的 `seen_count_7d`、`source_type_count` 和 `related_signal_ids`，用于解释趋势连续性。
- 升级后 Heat Candidate 状态改为 `converted`，但不删除，作为趋势热度历史。

## 16. 反证、风险与深度硬门槛

2026-05-10 B 类确认后，反证和风险要求按内容类型区分：

| 内容类型 | 反证 / 风险要求 |
|---|---|
| Structured Signal | 不强制每条都有反证；如未发现反证，应写 `counter_evidence_status: not_found / not_applicable`，不得编造 |
| Front Signal | 不强制每条都有反证；但必须写清证据边界或仍需观察的缺口 |
| Heat Candidate | 风险类高热内容进入 `risk trend` 或 `counter-evidence` 候选 |
| Deep Dive | 只有利好、没有反证时可以通过，但必须说明“本轮未发现关键反证”；证据不足时不得通过 |

风险类高热内容包括：

- 监管 / 政策变化。
- 诉讼 / 版权 / 合规。
- 安全事故 / 隐私事件。
- 推理成本、毛利、交付成本压力。
- 客户流失、停用、负面采购反馈。
- 关停、裁员、融资失败、产品下架。

风险类高热内容即使不适合作为普通 Signal，也应进入 Trend risk / counter-evidence 观察，不得被普通利好新闻挤掉。

字数与深度硬门槛：

| 内容类型 | 字数门槛 | 说明 |
|---|---:|---|
| Structured Signal | 1200-2000 中文字 | 必需 |
| Front Signal | 3000-5000 中文字 | 必需 |
| Deep Dive | 6000-10000 中文字 | 必需 |

字数达标但证据不足，不得通过。字数是最低表达深度，不替代来源、事件、商业变量、来源等级和证据完整性。

## 17. v2content gate 升级项

B 类阶段已按用户确认同步升级 `v2content` gate。F 类“验收与回填”阶段需要再检查一次脚本执行结果和历史内容差距。

建议新增检查项：

- Heat Candidate 文件是否存在或是否明确说明当日无高热候选。
- Heat Candidate 是否包含 `formal_tags`、`classification_labels`、`candidate_tags`、`status`、`seen_count_7d`、`source_type_count`。
- daily run log 是否包含 `source_distribution`、`failed_sources`、`fallback_used`、`evidence_gaps`、`raw_count_by_source_type`、`front_signal_sab_source_count`。
- Raw 是否每条有本地原文档案。
- Pool 是否每条有入池理由和淘汰风险。
- Structured 是否包含事件、商业变量、来源等级、趋势候选，且达到 1200-2000 中文字。
- Front 是否每条至少 3 个解析后的 S/A/B 原始来源，且达到 3000-5000 中文字。
- Deep Dive 如存在，是否至少 5 来源、2 个 S 级 / 一手来源，且达到 6000-10000 中文字。
- Point 是否包含原始观点、观澜解读和关联关系。
