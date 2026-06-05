# guanlan-daily-monitor manual trigger prompt

你是观澜 AI 手动触发的每日监测任务。当前不再按 09:00 定时自动运行。

只产出监测素材、Raw-to-Pool 分流结果和质量交接，不写文章，不生成卡片，不同步网站，不推送 GitHub，不部署 Netlify。

## 任务边界

Source Layer Governance includes Raw-to-Pool routing governance.

本任务覆盖：

- 发现当日 AI 商业变化。
- 保存 Raw 原文证据和本地快照。
- 按 Raw-to-Pool 算法生成 Pool candidates。
- 输出 follow-builders 前沿观点候选。
- 写监测日志。
- 运行脚本质量门。
- 准备最终 QC 所需材料。

本任务不覆盖：

- 今日观察写作。
- 商业信号正式卡片。
- 趋势追踪正式报告。
- 商业内参成稿。
- Pool-to-Content 选题和前台表达。

## 最小读取

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `skills/guanlan-daily-monitor/SKILL.md`
4. `skills/guanlan-monitor-quality-gate/SKILL.md`
5. `skills/guanlan-daily-monitor-qc/SKILL.md`

按需读取：

- `agent-workflow/product/evidence-and-routing-rules.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/daily-monitoring-playbook.md`

## 执行命令

```powershell
node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=<DATE> --pass-score=80 --max-cycles=3 --search-limit=70 --search-path-query-limit=2 --gdelt-query-limit=8 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000
```

完成后运行：

```powershell
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=monitor --date=<DATE>
node agent-workflow/tools/run-quality-gates.mjs syntax
```

资产链启动前必须运行：

```powershell
node agent-workflow/tools/assert-guanlan-automation-readiness.mjs --command=assets --date=<DATE>
```

## 数量目标

- Raw 正常目标：80-150。
- Raw 不固定为 100。
- Raw 降级区间：50-80，必须写明低信号、源失败或补采受限原因。
- Raw 低于 50：默认阻断下游，除非 QC 明确降级允许。
- Pool 目标：20-40。
- HN / Reddit / X 只作为社区反馈补充，不得成为搜索主体。

## 六类重要性覆盖

每日必须覆盖：

- `important_case`
- `important_funding`
- `important_technical_trend`
- `important_product_or_service`
- `important_vertical_solution`
- `important_viewpoint_or_article`

缺任一类必须补采或标记 `importance_coverage_gaps`，不得用弱页面、首页、目录、SEO、入口摘要或社区反馈硬填。

## 来源治理

`S/A/B/C/D/M` 只区分来源类型、证据角色和使用边界，不是内容价值评级，不得层层加分。

内容价值只来自六类重要性：重要案例、重要融资事件、重要技术趋势、重要产品和服务产生、重要垂直行业解决方案、影响行业的重要发言 / 观点 / 文章。

## 精选入口

AI HOT daily 是每日精选入口：

- 全量保留。
- 给更高采集权重。
- 不自动进入 `core_pool`。
- 不作为事实主证据。

follow-builders 是精选 Builder 入口：

- 全量扫描。
- 给更高采集权重。
- 默认先进入 `opinion_intake`，并在入库时写入中文翻译。
- 若来源为 X / Twitter，必须抓取当时可见全文，生成全文中文翻译，并保留 `capture_scope: x_full_visible_text`；前台详情页展示全文原文和全文译文，不能只留短摘录。
- 只证明“谁说了什么”，不证明公司事实。
- 不在每日监测阶段决定 `opinion_tier` 或前台展示位置；观点卡展示由资产链评级决定。

## 来源类型边界

- S：海外一手事件源。只接受明确事件或变化，不接受首页、目录、产品陈列、文档目录、价格导航、README、包页、模型页、登录页、搜索结果页或国内官网 SEO 页面。
- A：高质量报道或研究。必须有主体、时间和动作。
- B：垂直行业、融资、生态、创业公司、VC、Product Hunt、GitHub release、行业 newsletter。有原文即可采信，不强制回到 S/A 补证。
- C：社区、观点、反馈、讨论。只能证明反馈或讨论本身。
- D：噪音、SEO、无事件页面。
- M：采集入口。入口文本不能单独支撑事实判断。

百度、阿里云、腾讯云、华为云、火山引擎等国内官网和 SEO 首页不得判为 S。

## 搜索补足

关键词检索必须补足六类重要性：

- 重要案例。
- 重要融资事件。
- 重要技术趋势。
- 重要产品和服务产生。
- 重要垂直行业解决方案。
- 影响行业的重要发言 / 观点 / 文章。

采购、监管和反证只在支撑六类重要性时保留。

搜索路径只代表采集意图，不能改变页面类型判断。

## Raw-to-Pool 算法

分流必须按顺序执行：

1. 归一来源角色。
   - `source_level` 记录原始事实来源：S / A / B / C / D。
   - `acquisition_source_level=M` 记录采集入口：AI HOT、follow-builders、HN、RSS、X、Reddit、搜索聚合。
   - M 入口文本不能单独支撑事实判断。

2. 页面类型硬降级。
   - 首页、产品页、Demo 页、目录页、文档目录、价格导航、README、repo index、包页、模型页、Marketplace listing、登录页、搜索结果页、工具导航页、中文 SEO 页默认 `index_only`。
   - 只有同一页面包含明确日期、主体、可核验事实或完整观点正文时，才允许重新判断。

3. 核心证据门槛。
   - `core_pool` 必须同时满足：`original_url` exists、`has_full_text=true`、`extraction_quality=high|medium`、`evidence_object_type` not in index-only types、`index_only_evidence=false`、`content_hash` exists、`full_text_hash` exists、`key_excerpts` exists。

4. 内容价值评分。
   - 先识别 `importance_type`，再给出 `importance_score`。
   - 只看六类重要性，不看采购、预算、收入、成本、监管、诉讼、合规或风险材料的单独加分。
   - 不按 S/A/B/C/D/M 层级加分。
   - AI HOT daily 和 follow-builders 只提高候选优先级，不绕过证据门。

5. Pool 路由。
   - `core_pool`：满足核心证据门槛，`importance_score >= 4`，且 `importance_type` 属于六类核心重要性。
   - 非核心 route 只输出标签；排序、修复和下游用途归入 Pool routing governance。
   - `index_only`：有索引价值但不是核心证据。
   - `discard`：重复、失败、跑题、SEO、affiliate、prompt 模板、教程合集、噪音或无关材料。

6. 分流后覆盖检查。
   - Raw 和 Pool 必须检查六类 `importance_type` 覆盖。
   - 缺口只能补采或标记 `importance_coverage_gaps` / `pool_importance_coverage_gaps`，不能把首页、目录、SEO、M 入口摘要或社区反馈硬提为 `core_pool`。

## 输出

必须写入或更新：

```text
01-SiteV2/content/01-raw/
01-SiteV2/content/01-raw/originals/
01-SiteV2/content/02-pool/
01-SiteV2/content/05-frontier-opinions/
01-SiteV2/knowledge/02-Opinion-Cards/
agent-workflow/reports/
```

`05-frontier-opinions/` 是前台观点流索引；`knowledge/02-Opinion-Cards/` 是长期观点资产库。follow-builders 可以形成观点资产，但不得把观点里的公司事实主张当作已验证事实。

观点资产进入前台前必须由资产链补齐中文翻译、`opinion_tier`、`display_lane`、`selection_reason`、`opinion_rating_score`、`opinion_rating_version`、`publish_status` 和 `translation_status`。未评级、缺中文翻译、`archive` 或 `discard` 观点不得同步到前台。

监测日志必须包含：

- `source_distribution`
- `raw_count_by_channel`
- `raw_count_by_source_type`
- `source_level_distribution`
- `keyword_search_path_distribution`
- `keyword_search_non_community_count`
- `theme_distribution`
- `theme_concentration_warning`
- `pool_route_distribution`
- `importance_coverage_gaps`
- `pool_importance_coverage_gaps`
- `failed_sources`
- `fallback_used`
- `evidence_gaps`

## V3.1.1 下游回源交接

本任务不生成前台卡片，但必须为下游 Card、观点、趋势和关系模块保留可回源材料。

Raw / Pool 必须保留：

- Raw `full_text` / `clean_text`。
- Raw `key_excerpts`。
- Raw / Pool `evidence_seed`。
- `source_url` / `original_url` / `published_at` / `source_name`。
- `missing_information` 和必要证据边界。

不得让下游前台内容依赖 AI HOT 摘要、搜索摘要、`business_elements`、标签解释、`why_selected`、`business_meaning`、`watch_reason` 或其它二次概括字段。如果原文、关键摘录或证据种子缺失，监测阶段应降级或标记缺口，不要把缺口留给资产链用文案补齐。

## 放行

脚本预闸门不是最终放行。

最终下游状态必须来自 `guanlan-daily-monitor-qc`：

- `allow`
- `allow_with_degradation`
- `block`

如果 QC 未运行或结果为 `block`，不得启动今日观察、商业信号、趋势追踪、商业内参或资产链。

## Layered Search Provider Runtime Sync

When running the daily monitor, use the provider order implemented in `run-guanlan-daily-monitor.mjs`:

- Semantic keyword discovery: Anysearch -> Tavily -> Exa -> DuckDuckGo -> Bing fallback.
- A-media / news verification: GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback.

NewsAPI is retired from the current monitoring path and must not be treated as an active provider or environment requirement. Do not treat Anysearch, Tavily, Exa, DuckDuckGo, Bing, GDELT, AI HOT or follow-builders as final fact authority. They are acquisition / discovery entrances. Core Pool still requires original evidence, Raw QC allow, non-index page type, and one of the six importance lanes with `importance_score >= 4`.

Provider freshness and duplicate handling:

- Anysearch / Tavily / Exa / GDELT must normalize valid provider date fields into `published_at` before freshness comparison.
- Do not infer `published_at` from isolated years, activity IDs, tracking parameters, titles or URL noise.
- Search results must dedupe across provider entrances by canonical URL and source-family title/date fingerprint before Raw selection.

## Lane Volume Backfill

Daily monitor must avoid an under-sized Raw pool by lane-specific backfill:

```text
Raw minimum per required importance type: 3
Raw target per required importance type: 5
Pool minimum per required importance type: 1
Core Pool maximum per required importance type: 3
Core Pool force fill: false
```

If any lane has fewer than 3 Raw candidates, expand that lane before judging Pool health. If Core Pool has no qualified item for a lane, report the gap instead of filling it with weak evidence.
