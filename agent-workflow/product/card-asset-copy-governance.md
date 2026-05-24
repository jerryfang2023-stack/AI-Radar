---
title: Card Asset Copy Governance
date: 2026-05-22
status: active
owner: intelligence-engine / experience-editorial / build-release
---

# Card Asset Copy Governance｜卡片资产文案治理

本文件是 Card / 资产层进入长期资产库和前台展示前的 Copy 规则表。它承接：

- `context/07-card-asset-stage-model.md`
- `context/08-card-asset-qc-checklist.md`
- `skills/guanlan-copy-style/SKILL.md`
- `skills/guanlan-copy-style-qc/SKILL.md`

当前阶段不把 Pool 直接映射成复杂前台卡片体系。前台先保留两条流，后台保留三类候选：

```text
前台：
- signal_card
- opinion_card

后台：
- change_candidate
- scene_candidate
- trend_candidate
```

正式变化、正式场景和正式趋势只在材料积累成熟后升级。变化成熟后优先以前台“变化短专题”表达；趋势成熟后进入趋势追踪、热力图或商业内参，不作为普通卡片流。

## 1. 证据保护区

以下内容是证据，不是展示文案，不得为了统一观澜风格而改写：

- Raw 原文、`full_text`、`clean_text`、Markdown / HTML / JSON 快照。
- source quote、原始摘录、当时可见文本、`key_excerpts.text`。
- URL、source metadata、发布时间、抓取时间、capture_scope、截图路径。
- 原始数字、客户说法、产品公告原句、人物观点原文。

允许新增的是“观澜解读”“中文转述”“商业含义”或 `frontend` 展示文案，并且必须清楚标明它是解释，不是原文。

## 2. 后台文案与前台文案

| 层级 | 作用 | 可出现 | 不得出现 |
|---|---|---|---|
| 后台资产文案 | 供编辑、自动化和知识库维护者理解 | evidence_gate、missing_information、raw_ref、source_level 等结构字段；人读段落仍要清楚克制 | 把缺口写成结论；把 Raw 摘录风格化改写；用空泛趋势词替代事实 |
| 前台展示文案 | 供读者在首页、商业信号、前沿观点、趋势追踪和详情页阅读 | 事件型标题、发生了什么、为什么值得看、商业含义、继续观察、自然化来源说明 | Raw、Pool、gate、usable_for、入库、补证、强证据、证据链、候选、后台、字段 |

前台字段优先使用 `frontend` 对象。缺少合格 `frontend` 时，不得 fallback 到 Raw 摘要、后台字段或索引半成品。

## 3. 生成门槛

资产只能从 Daily Monitor QC 放行范围内生成。当日 QC 为 `allow_with_degradation` 时，资产链只能使用 QC 明确允许的 eligible `core_pool`，并继续排除 failed provider text、index-only AI HOT、community / frontier opinion 等弱材料。

### 每日默认生成量

从 2026-05-23 起，资产生成分为“草稿生成”和“前台放行”两层：

- 草稿生成：每日先使用人工精选清单；同时从 eligible `core_pool` 自动补足商业信号卡。默认不设单日数量上限，eligible `core_pool` 应全部生成正式前台 `signal_card`；如果某条不应进入前台，必须回到 Raw-to-Pool 阶段修正其 `core_pool` 资格，而不是在卡片生成阶段静默丢弃。
- 自动补足只允许使用 `raw_qc_decision=allow`、`has_full_text=true`、`source_level=S|A|B`、`extraction_quality=high|medium` 且不是目录页、文档页、Marketplace listing、社区观点或索引摘要的材料。
- 前台放行：不因为自动补足而降低质量门。进入正式前台展示仍必须通过事实门、前台文案门、卡片文案门和人工抽样 QC。
- 观点材料先进入 `opinion_intake`；入库时必须同步写入中文翻译。只有补齐原文、中文翻译、人物/机构、事实边界和四档评级后，才能升级为正式 `opinion_card`。

### 商业信号卡

`signal_card` 是前期最主要的显性卡片，只允许三种主类型：

- `product_service`：新产品、新服务、新能力或可交付功能。
- `funding`：融资、并购、资本押注方向。
- `case`：真实客户、行业场景、岗位流程或业务工作流里的 AI 使用。

合作、采购、定价、风险、合规、监管、诉讼、成本等不得作为前期主类型。它们只能作为 `business_variable`、`supporting_signal`、`evidence_tag` 或 `watch_reason`，除非清楚改变了客户采用路径、部署节奏或商业判断。

正式商业信号卡至少满足：

1. 主证据来自 eligible `core_pool`，且对应 Raw 满足 `raw_qc_decision=allow`、`has_full_text=true`、`extraction_quality=high|medium`。
2. 保留 `raw_ref`、`raw_archive`、`raw_json`、`source_url`、`full_text_hash`、`key_excerpts` 或等价证据对象。
3. 能写清谁做了什么、发生在哪里、影响什么商业变量、缺什么信息。
4. 标题必须是事件型标题，不得只有趋势判断。
5. 前台文案不得出现内部生产词。

### 前沿观点卡

`opinion_card` 是前台独立流，不只是其他卡片的观点校准。Builders、VC、Researcher、创始人、产品负责人和重要技术作者的前沿判断，若有明确商业、产品、技术路线或客户判断价值，可以形成观点卡。

正式观点卡必须满足：

1. 有人物 / 机构、当时身份、发表时间、平台、原文链接或快照。
2. 有当时可见文本、原文或原文摘录、capture_scope；高波动来源应保存截图或 Markdown 快照。
3. 短观点尽量保留完整原文；长观点保留关键原文摘录，并跳转原文出处。
4. 必须补充 `frontend.originalTranslation` 或等价中文翻译字段；中文翻译是辅助阅读层，不能替代原文或原文摘录。
5. 观澜解读必须放在原文和中文翻译之后，不得用中文摘要替代原文。
6. 观点里的公司动作、客户采用、收入、融资、市场规模等事实主张，另有 S/A/B 或 eligible `core_pool` 补证；没有补证时只能写成观点参照。

follow-builders / 社区观点不得单独生成商业信号事实、变化结论或趋势事实段落。

`opinion_intake` 入库要求：

1. 原文或当时可见摘录必须保留。
2. `frontend.originalTranslation` 和正文“中文翻译”必须在入库时写入；中文翻译用于辅助阅读，不替代原文。
3. X / Twitter 来源必须保留当时可见全文，写入全文中文翻译，并用 `capture_scope: x_full_visible_text` 或等价字段标记；前台详情页展示全文原文和全文译文，不能用短摘录或“见正文”占位替代。
4. 若翻译服务失败，必须写入 `translation_status: pending_translation`，并保持 `frontend_copy_gate: pending`、`cardcopy_gate: skipped_intake_translation_pending`；这类材料不得升级为 `feature/sidebar` 前台观点。
5. 评级脚本处理旧素材时必须先尝试补译，再执行前台分级；不得因为缺翻译直接把高价值观点永久降级。
6. 评级结果为 `feature` 或 `sidebar`，且中文翻译已完成的观点，必须升级为正式 `opinion_card`；`feature` 进入 `daily_feature`，`sidebar` 进入 `signal_sidebar`。
7. 评级前必须合并重复观点卡：以 `canonical_url`、`original_url` 或 `source_url` 为主键识别重复；保留较高档位、较高评分、人工复核优先且翻译更完整的 keeper；重复文件移入 `01-SiteV2/knowledge/99-Archive/Opinion-Duplicates/<date>/`，keeper 写入 `merged_duplicate_count`、`merged_duplicate_refs` 和正文合并记录。

#### 观点卡四档评级

观点卡入库前必须写入四档评级：

```yaml
opinion_tier: feature | sidebar | archive | discard
display_lane: daily_feature | signal_sidebar | archive_only | hidden
selection_reason:
opinion_rating_score:
opinion_rating_version: 2026-05-22-v1
publish_status: frontstage_feature | frontstage_sidebar | internal_archive | hidden
translation_status: translated | pending_translation
```

四档含义：

| 档位 | 作用 | 前台位置 | 规则 |
|---|---|---|---|
| `feature` | 当天最值得读的正式观点卡 | 今日观察的主推观点区 | 必须高价值人物 / 机构，观点完整，直接支撑当日观察或核心商业判断 |
| `sidebar` | 可作为读者判断参照的正式观点卡 | 商业信号页的观点模块 / 侧栏 | 观点清楚，和商业变量有关，但不一定构成当日主线 |
| `archive` | 长期归档 | 不进前台 | 有人物、原文和保留价值，但上下文、信息量或关联度不足 |
| `discard` | 隐藏或后续清理 | 不进前台 | 玩笑、祝贺、纯转发、纯营销、无上下文、无原文或无判断价值 |

前台同步硬条件：

```text
feature 只能进入 daily_feature
sidebar 只能进入 signal_sidebar
archive 只能进入 archive_only
discard 只能进入 hidden
feature/sidebar 必须有已完成中文翻译
```

任何 `archive`、`discard`、未评级观点卡或 `translation_status: pending_translation` 的观点不得因为有 `frontend` 字段而被前台同步。

### 变化候选与变化短专题

单一材料不能直接生成正式变化判断。单一强材料最多触发 `change_candidate`。

`change_candidate` 至少记录：

- 变化假设。
- 支撑信号。
- 前后对比。
- 影响的商业变量。
- 风险边界、限制条件或后续观察变量。
- 仍缺的信息。

正式变化升级至少需要：

1. 至少 3 条不同来源或不同对象的高质量商业信号。
2. 至少 1 个可核验案例或场景证据。
3. 清楚的前后对比，不只是“更多公司开始做”。
4. 明确商业变量：客户、流程、预算、组织、责任、风险、竞争、成本、交付或渠道。
5. 至少 1 条风险边界、限制条件或后续观察变量。

达到门槛后，前台优先生成 `content/04-business-signals/change-topics/` 下的变化短专题，不进入普通卡片流。

### 场景候选

`scene_candidate` 是后台资产，用来积累行业、部门、岗位、流程和任务中的 AI 使用变化。它不是公司百科，也不是产品列表。

场景候选至少写清：

- 行业 / 部门。
- 岗位 / 使用者。
- 具体流程 / 任务。
- AI 改变了哪一个步骤。
- 已有案例或证据。
- 缺什么补证。

成熟后，场景候选可支撑商业信号详情页、相关场景、热力图节点或商业内参，不急于前台独立成卡。

### 趋势候选与趋势追踪

`trend_candidate` 不得由单条新闻、单个观点或公司名清单生成。

正式趋势升级至少需要：

1. 至少 3 个正式变化判断或成熟变化短专题。
2. 至少 2 个正式案例 / 场景证据。
3. 至少 2 类来源类型，且事实主证据来自 S/A/B 或 eligible `core_pool`。
4. 至少 1 条技术路线、场景进程、成本结构、交付方式或客户流程变化说明。
5. 清楚说明风险边界、证据缺口或尚未证明的商业变量。

未达到门槛时，`trend_evidence_gate` 只能是 `threshold_pending`、`watchlist_only` 或 `rejected`，前台只能自然写成“继续观察”，不得包装为趋势判断。

## 4. 弱内容禁止生成规则

以下材料不得生成正式卡片，也不得作为公司事实证据：

- failed provider text、搜索结果摘要、采集失败 fallback 文本。
- index-only AI HOT、AI HOT 标题 / 摘要 / 热度。
- 官网首页、产品目录、文档目录、README、包页、模型页、Marketplace listing、控制台 / 登录页、SEO 页。
- 只有 community / frontier opinion、follow-builders 转述、HN / Reddit / X 讨论的材料。
- 无 `raw_ref`、`raw_archive`、`raw_json`、`source_url`、`full_text_hash`、`key_excerpts` 或 `evidence_seed` 的 Pool 条目。
- 只有采购、预算、收入、成本、监管、诉讼、合规、风险等 supporting signal，且没有改变采用路径、部署节奏或商业判断的材料。
- 无客户、无场景、无动作、无发布时间、无证据边界的公司简介或产品黄页。

弱材料可以进入 `watchlist_only`、`needs_backfill`、观点参照或补证任务，但不得写 `frontend_copy_gate: passed`、`cardcopy_gate: passed` 或同步前台。

## 5. `frontend` 展示对象

进入前台的 `signal_card`、`opinion_card` 和成熟变化短专题应优先生成 `frontend` 对象。

通用字段：

- `displayTitle`：完整标题，不使用省略号。
- `summary` 或 `eventLine`：补充事实，不重复标题。
- `whyWatch`：说明为什么值得看，落到商业变量。
- `businessMeaning`：说明影响客户、流程、预算、组织、责任、风险或竞争中的哪一项。
- `sourceLinks`：只引用已保留的来源链接，不改写 URL。
- `evidenceBoundary`：说明缺口或边界，不包装成确定结论。
- `watchWindow`：写具体观察变量，不写“持续关注”。

观点卡还必须覆盖：

- `speaker`：人物 / 机构和身份。
- `originalQuote` 或 `originalExcerpt`：原文或原文摘录。
- `originalTranslation`：中文翻译；用于中文读者理解，不作为原文证据。
- `sourceUrl`：原文出处。
- `interpretation`：观澜解读，必须区别观点与事实。
- `factBoundary`：说明该观点不能证明哪些事实。

如果 `frontend_copy_gate` 或 `cardcopy_gate` 不是 `passed`，`frontend` 字段不得覆盖前台。

## 6. Copy QC 通过标准

卡片资产写入 `cardcopy_gate: passed` 前，必须同时满足：

1. 事实清楚：有具体对象、动作、场景和来源。
2. 判断克制：不把弱线索、社区热度或观点写成已验证事实。
3. 商业变量明确：至少落到客户、流程、预算、组织、责任、风险、竞争之一。
4. 低 AI 味：不使用“赋能、生态、底座、闭环、重塑”等模板词填空。
5. 无内部生产词：前台展示文案不能出现生产流程语言。
6. 证据边界清楚：信息不足时写“暂无公开信息”或“暂未监测到同类案例”。
7. 阶段准确：候选就是候选，不伪装成正式趋势、正式变化或确定机会。
8. 观点评级一致：`opinion_tier`、`display_lane`、`publish_status` 和前台位置必须一致。

脚本 `card-copy-style-gate.mjs` 是硬闸门扫描，不替代语义 QC。复杂语义问题由执行窗口按本文、`context/08-card-asset-qc-checklist.md` 和 `guanlan-copy-style-qc` 抽样复核。
