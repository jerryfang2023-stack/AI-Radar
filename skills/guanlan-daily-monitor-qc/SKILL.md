---
name: guanlan-daily-monitor-qc
description: 观澜 AI 每日监测 Raw / Pool 质量质检 Skill。用于审核 guanlan-daily-monitor 产出的 Raw、Pool、监测日志和质量门报告，判断是否允许下游内容使用。重点检查原文证据、页面类型、六类重要性覆盖、精选入口回源、关键词检索结构、首页/目录/SEO 噪音、M 入口误作事实证据、source_level 被误作价值或核心硬门槛等问题。
---

# Guanlan Daily Monitor QC

本 Skill 是每日监测的最终人工质量判断层。

它不负责补采、不写文章、不生成卡片、不修正文案。它只判断当日 Raw / Pool 是否可以被今日观察、商业信号、趋势追踪、商业内参和资产链使用。

## 与治理的关系

这次治理直接影响 QC：

- `S/A/B/C/D/M`：来源类型、证据角色、使用边界。禁止作为内容价值评级、层级加分或核心证据硬门槛。
- AI HOT daily 和 follow-builders 是精选入口，可以提高采集权重，但不是事实主证据。
- HN / Reddit / X 只作为开发者或社区反馈补充，不得成为搜索结果主体。
- `source_level` 只作追溯和证据边界说明，不决定核心证据资格。
- 每日必须覆盖六类 `importance_type`：`important_case`、`important_funding`、`important_technical_trend`、`important_product_or_service`、`important_vertical_solution`、`important_viewpoint_or_article`。
- Raw 数量目标是正常 80-150，低信号日可 50-80 并写明原因，不固定为 100。

脚本质量门通过不等于 QC 放行。

## 必读

每次审核只读：

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `skills/guanlan-daily-monitor/SKILL.md`
4. `agent-workflow/reports/<YYYY-MM-DD>-guanlan-monitor-quality-gate.md`
5. 当日 Raw / Pool / monitor log

仅在发现配置或规则冲突时再读：

- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/daily-monitoring-playbook.md`
- `agent-workflow/product/evidence-and-routing-rules.md`
- `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
- `01-SiteV2/content/11-databases/source-registry-v2.json`
- `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`

## 输入目录

按日期 `<DATE>` 检查：

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
agent-workflow/reports/
```

## 通过标准

一个可放行的监测日必须同时满足：

- Raw 有足够数量和来源跨度，正常 80-150；50-80 必须说明低信号或源失败原因。
- Pool 有可用候选，且 `core_pool` 不是首页、目录、SEO、工具页、精选入口摘要或缺原文项目堆出来的。
- Pool 健康度必须看 `routed_pool_count`、`core_pool_count`、`index_only_pool_count`、`aihot_index_only_count`、`aihot_core_count`，不得只看被 AI HOT 全量保留抬高的 `pool_count`。
- 下游核心材料有 `source_url`、Raw archive、Raw JSON、可读 `full_text`、`extraction_method`、`readability_score`、截图/快照或 hash、页面类型、来源类型和使用边界。
- 下游核心材料必须有 `raw_qc_decision=allow`；`allow_with_degradation` 只能按报告列明范围低强度使用，`block` 不得使用。
- 六类 `importance_type` 都有覆盖：`important_case`、`important_funding`、`important_technical_trend`、`important_product_or_service`、`important_vertical_solution`、`important_viewpoint_or_article`。
- 关键词检索不能过薄，必须补足重要案例、重要融资事件、重要技术趋势、重要产品和服务、重要垂直行业解决方案、重要观点 / 文章。
- AI HOT daily 和 follow-builders 可以优先进入候选，但事实陈述必须来自原文或明确标注为观点/反馈。

## P0 阻断

出现任一项，结果为 `blocked`：

- Raw 少于 50。
- Raw 为 50-79 且没有低信号、源失败或降级说明。
- 下游核心材料缺少可读 `full_text`、快照、hash 或来源 URL。
- `core_pool` 中 `extraction_method` 缺失，或 `readability_score` 低于当前门槛，导致正文疑似导航、登录、目录、评论加载、订阅提示或 fallback 摘要。
- `core_pool` 中出现 `raw_qc_decision=block` 或 `raw_qc_decision=allow_with_degradation`。
- `allow_with_degradation` 被用于资产链、今日观察、商业信号、趋势追踪或商业内参，但 QC 报告没有列明对应下游范围。
- `core_pool` 中出现首页、产品首页、目录页、文档目录、价格导航、README、包页、模型页、Marketplace listing、登录页、搜索结果页、SEO 页，且页面本身没有明确日期、主体、可核验事实或完整观点正文。
- AI HOT daily、follow-builders、HN、Reddit、X、RSS、搜索聚合文本被当作公司事实主证据。
- `source_level=S/A/B` 被用作核心硬门槛，或 `source_level=C/D` 被用于自动降级有原文、有可用证据对象、有重要性的材料。
- 关键词检索缺失，或搜索结果主要由 HN / Reddit / X / 社区反馈构成。
- 六类 `importance_type` 中任一类在 Raw 或 Pool 中缺失。
- Raw / Pool 的价值排序来自 S/A/B/C/D 层层加分，`source_level=S/A/B` 被当作核心硬门槛，或来自采购、预算、收入、监管、诉讼、合规、风险等 supporting signals 单独加分，而不是六类观澜重要性。
- `importance_score>=4` 没有可解释的 `importance_reason`，或 4/5 分项目不符合评分 rubric。
- `allow_with_degradation` 超过降级原因允许的最高路由，例如缺全文进 `emerging_pool`、目录页进 `watchlist`、聚合入口摘要进 `user_feedback_pool`。
- 监测日志缺少 Raw 数量、Pool 数量、来源分布、关键词路径、重要性覆盖缺口、失败来源、fallback、证据缺口。

## P1 必修

可在 `repair_required` 或明确降级后继续：

- AI HOT daily 有高价值线索但未完成原文抓取。
- follow-builders 缺作者、时间、原文边界或观点/事实分离。
- `core_pool` 有标题明确但未命中六类观澜重要性的候选。
- 某一主题、厂商、国家或关键词家族过度集中。
- `important_technical_trend` 缺少 release、changelog、benchmark、paper、repo release 或开发者采用证据。
- `important_funding` 只有二手转述，缺融资公告、投资方说明、公司公告或可信报道。
- Raw 重复或低信息摘要抬高数量。
- `clean_text` 存在但 `full_text`、fallback、`extraction_method`、`readability_score` 或缺失说明不清楚。
- Raw JSON 缺少 `evidence_completeness`、`degradation_reasons` 或 `raw_qc_decision`。

## Raw / Pool / Card 交接硬规则

每日监测 QC 放行只代表 Raw / Pool 可被下游使用，不代表可以直接上前台。生成 card 或同步网站前必须再过这些门：

- Pool-to-Card 必须生成 `agent-workflow/reports/<YYYY-MM-DD>-pool-to-card-handoff.md` 和 `agent-workflow/reports/<YYYY-MM-DD>-frontstage-manifest.json`。
- 前台 signal / opinion 只能读取 manifest 白名单；没有进入 manifest 的卡，即使文件存在，也不得上前台。
- active date 缺少 manifest 时，站点同步必须停止；manifest 中观点列表为空时，不得回退全量观点卡。
- Card 标题优先保留原文事实标题或清晰事件标题，禁止批量改写成“押注 xxx”“材料显示 xxx”“材料把 xxx 指向 xxx”。
- 观点卡必须区分 `opinion_card` 与 `opinion_intake`：只有标题、翻译、来源、评级和前台位置都合格的观点才能保留为 `opinion_card`；归档、跑题、社交噪音、机器翻译截断项必须降为 `opinion_intake` 或 hidden。
- 任何面向前台的字段不得出现 Raw、Pool、core_pool、入库、证据链、强证据、usable_for、pool_routes、gate 等内部生产词。
- 生成站点数据前必须运行 `card-copy-style-gate`、Pool-to-Card 去重检查和 public copy gate；发现问题先修资产，不在页面层硬遮丑。
- Public copy gate 命令：`node agent-workflow/tools/assert-public-copy-gate.mjs --date=<YYYY-MM-DD> --markdown=true`。历史清理或全量复盘时使用：`node agent-workflow/tools/assert-public-copy-gate.mjs --history=true`。

## 来源与页面规则

| 类型 | 可用边界 |
|---|---|
| S | 海外一手事件源。必须是发布、更新、客户、案例、changelog、监管文件、价格变化、投资公告等事件或变化页面。 |
| A | 高质量报道、研究、分析师或权威数据库。必须有主体、时间和动作。 |
| B | 垂直行业、融资、生态、创业公司、VC、Product Hunt、GitHub release、行业 newsletter。只要有原文和清晰边界即可使用，不强制 S/A 补证。 |
| C | 社区讨论、开发者反馈、观点、论坛和社交帖。只能证明“有人这样反馈/讨论”。 |
| D | 噪音、SEO、无事件页面、转述不清页面。 |
| M | 采集入口，如 AI HOT、follow-builders、HN、RSS、搜索聚合。入口文本不能单独支撑事实判断。 |

默认 `index_only`：

- 官网首页、产品首页、Demo 页、开放平台首页。
- 产品目录、工具目录、文档/API/SDK 目录。
- 价格导航页，除非是明确价格变更。
- GitHub README / repo index、Hugging Face / npm / PyPI 包页或模型页，除非有 release、license、采用或商业化事件。
- Marketplace listing，除非有新增集成、客户采用或排名/采购变化。
- 登录页、控制台页、搜索结果页、AI 工具导航页、中文 SEO 页。

`allow_with_degradation` 不得作为事实主证据。降级原因必须落到具体项：`missing_full_text`、`missing_snapshot`、`missing_hash`、`missing_excerpt`、`index_only_or_directory_page`、`discovery_or_feedback_source_boundary`。

## 评分

满分 100。通过需要 `>=85` 且无 P0。

| 维度 | 分值 |
|---|---:|
| Raw 数量与采集完整性 | 10 |
| 原文、快照、hash、fallback 完整性 | 20 |
| 原文证据可用性与页面类型正确性 | 20 |
| 六类重要性覆盖和关键词路径完整性 | 15 |
| 观澜重要性密度 | 15 |
| 精选入口与事实证据分离 | 10 |
| Pool 路由正确性 | 5 |
| 监测日志可追溯性 | 5 |

结果：

| 分数 | 结果 | 下游 |
|---:|---|---|
| 90-100 | `passed` | `allow` |
| 85-89 | `passed_with_notes` | `allow`，附修复备注 |
| 75-84 | `repair_required` | 修复后再使用 |
| <75 | `blocked` | 阻断 |

任一 P0 直接 `blocked`。

## 审核步骤

1. 检查 Raw、Pool、core_pool、watchlist、feedback 的数量和路由。
2. 检查质量门报告中的硬门槛、失败路径、关键词路径、Pool 拆分指标和重要性覆盖缺口。
3. 抽查全部 `core_pool`；数量过多时至少检查优先级最高 20 条和所有可疑首页/目录/SEO/精选入口项目。
4. 对每个核心候选核对 URL、原文、截图/快照、hash、页面类型、证据对象、来源类型和使用边界。
5. 检查 AI HOT daily、follow-builders、HN、Reddit、X 是否只作为入口或反馈使用。
6. 检查六类 `importance_type` 是否都能在 Raw 和 Pool 中找到可用证据。
7. 检查 `importance_score` 是否符合 1-5 分 rubric，尤其是 4/5 分是否有明确主体、动作、时间和证据。
8. 列出必须降级、删除、补采或禁止下游使用的项目。
9. 输出 Markdown QC 报告。

## 输出

写入：

```text
agent-workflow/reports/<YYYY-MM-DD>-guanlan-daily-monitor-qc.md
```

结构：

```md
# Guanlan Daily Monitor QC Report

## 1. Summary
- Date:
- Result: passed / passed_with_notes / repair_required / blocked
- Score:
- Downstream decision: allow / allow_with_degradation / block
- Biggest issue:

## 2. Metrics
| Metric | Value | Required | Result |
|---|---:|---:|---|
| Raw count |  | 80-150, or 50-80 with reason |  |
| Pool count |  | 20-40 target |  |
| Core pool count |  | task-dependent |  |
| Routed pool count |  | excludes index-only and discard |  |
| Index-only pool count |  | audit only |  |
| AI HOT index-only / core |  | separated |  |
| Usable original-evidence core items |  | >= core_pool baseline |  |
| Homepage / directory core items |  | 0 |  |
| Discovery-entrance-only core items |  | 0 |  |
| Missing full_text core items |  | 0 |  |
| Raw-QC blocked / degraded core items |  | 0 |  |
| Six importance types covered |  | yes |  |
| Scoped degradation permission |  | required when downstream decision is allow_with_degradation |  |

## 3. Hard Gates
| Gate | Triggered | Evidence | Required Fix |
|---|---|---|---|

## 4. Raw / Pool Findings
| Item | Problem | Current Route | Correct Route | Fix |
|---|---|---|---|---|

## 5. Importance Coverage
| Importance Type | Evidence Found | Gap | Fix |
|---|---|---|---|

## 6. Source And Page-Type Audit
| Item | Source Type | Page Type | Evidence Boundary | Decision |
|---|---|---|---|---|

## 7. Downstream Permission
- Daily observation:
- Business signal:
- Trend tracking:
- Business brief:
- Asset chain:

## 8. Required Repair Prompt
```

## 放行语言

只使用三种判断：

```text
allow: Raw / Pool 可以进入下游。
allow_with_degradation: 只能使用报告列明的项目；阻断项目不得被下游引用。
block: 暂停今日观察、商业信号、趋势追踪、商业内参和资产链，直到修复。
```

如果结果是 `blocked`，不得说每日监测完成。

## Layered Search Provider QC

QC must verify that layered search providers are only used as discovery entrances:

- Semantic keyword discovery: Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback.
- A-media / news verification: GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback.

Block downstream use if a provider search result is treated as fact evidence without the original page, full text or usable snapshot, Raw QC allow, non-index page type and six-lane importance classification.

Freshness and duplicate checks:

- NewsAPI is retired from the current monitoring path and must not be used as an active provider in QC expectations.
- Tavily / Exa / Anysearch / GDELT must normalize provider date fields into `published_at` before freshness comparison.
- Provider dates must be valid dates; do not treat isolated years, tracking ids or social activity ids as publication dates.
- Cross-provider results must be deduped by canonical URL and source-family title/date fingerprint before Raw selection, especially Reuters, financing-wire posts, product pages and company announcements.

## Lane Volume QC

QC must verify the six-lane volume guardrail:

- Each required importance type should have at least 3 Raw candidates, target 5.
- Each required importance type should have at least 1 Pool candidate when evidence permits.
- Core Pool may contain up to 3 items per type, but no type is force-filled.

If a lane lacks qualified Core Pool items, mark a gap instead of accepting weak evidence.
