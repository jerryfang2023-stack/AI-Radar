---
status: current
scope: execution-harness
last_updated: 2026-06-05
use_when:
  - daily monitoring
  - raw pool card workflow
  - page copy typography workflow
  - task dispatch for high-risk flows
do_not_use_when:
  - small direct file edit with explicit files
  - past-state audit
priority: current
---

# 06 Execution Harness｜观澜高风险流程执行外壳

本文件不是新规范大全，而是三类高风险流程的执行外壳。它规定每类任务启动时读什么、产出什么、在哪里停、如何交接。

执行窗口禁止因为本文件提到某个二级文档就继续自动追读。只有任务需要修改对应规则或排错时，才补读 1-3 个直接真源。

## 1. 使用原则

- 只服务 V3.1 数据观察台生产线。
- 先确定流程类型，再读取最小上下文。
- 任何下游内容必须能追溯到 Raw / Pool / Card 或明确人工判断来源。
- 失败、阻断、降级要明确写出，不允许靠补文案绕过质量门。
- 前台不展示 Raw、Pool、gate、字段、同步、入库、eligible、index_only 等内部生产语言。

## 2. 三个高风险流程

### A. 每日监测 Harness

适用：

- 执行或修复每日监测。
- 调整 AI HOT、follow-builders、关键词搜索、媒体、官方源、GDELT / Anysearch / Tavily / Exa 等入口。
- 重新生成 Raw / Pool / monitor log / quality loop / Daily Monitor QC。

固定读取：

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `context/06-execution-harness.md`
4. `skills/guanlan-daily-monitor/SKILL.md`
5. `skills/guanlan-monitor-quality-gate/SKILL.md`
6. `skills/guanlan-daily-monitor-qc/SKILL.md`

按需补读：

- 来源等级调整：`agent-workflow/product/source-intelligence.md`
- 证据字段和 Pool 分流：`agent-workflow/product/evidence-and-routing-rules.md`
- 目录写入：`01-SiteV2/content/README.md`

硬门：

- Raw 目标区间为 80-150，不为凑数量接受垃圾页。
- AI HOT 是发现入口，不能直接等于事实主证据。
- follow-builders / 社区内容默认是观点或反馈，不单独作为公司事实。
- NewsAPI 已退出当前监测入口；A-media / news verification 当前顺序为 `GDELT -> Anysearch -> Tavily / Exa -> DuckDuckGo / Bing fallback`。
- Tavily / Exa / Anysearch / GDELT 必须把供应商日期字段统一写入 `published_at` 后再做新鲜度比较；不能用 activity id、孤立年份或 URL 噪音伪造日期。
- 搜索结果进入 Raw 前必须跨入口去重：先按 canonical URL，再按来源家族 + 标题指纹 + 发布日，重点合并 Reuters、融资稿、产品页、公司公告等多入口重复命中。
- 官网首页、工具平台官网、产品目录、文档目录、搜索结果页、SEO 页、导航页默认 `index_only`。
- `full_text`、snapshot、hash、source_level、raw_qc_decision、key_excerpts、evidence_seed 和 missing_information 缺失时，不得进入 core_pool。
- `block` 不得进入下游。

必须产出：

- Raw 文件。
- Pool 文件。
- monitor log。
- quality loop。
- quality gate 结果。
- Daily Monitor QC 报告。
- 是否允许进入资产链 / 今日观察 / 前台更新的结论。

Stop 条件：

- core_pool 含搜索页、目录页、工具导航页或无正文页面。
- core_pool 大量依赖 failed provider text、AI HOT 摘要或社区观点。
- 六类 `importance_type` 覆盖靠弱页面硬凑。
- Daily Monitor QC 为 `block`。

### B. Raw / Pool / Card 资产 Harness

适用：

- 生成或修复商业信号卡、前沿观点卡、变化候选、场景候选、趋势候选或变化短专题。
- 调整 Pool-to-Card、Card Copy、资产入库和前台展示字段。
- 将监测素材交给今日观察、商业信号、趋势追踪、商业内参使用。

固定读取：

1. `AGENTS.md`
2. `context/01-product-map.md`
3. `context/05-daily-monitoring.md`
4. `context/06-execution-harness.md`
5. `agent-workflow/product/evidence-and-routing-rules.md`

按需补读：

- 卡片脚本：`agent-workflow/automation-prompts/asset-card-generator.md`
- 标签体系：`agent-workflow/product/tag-taxonomy.md`
- 目录写入：`01-SiteV2/content/README.md`

硬门：

- Card 不能从 `block`、`index_only`、搜索摘要、失败 provider 记录、官网首页、工具目录页或无正文页面生成。
- 事实主证据必须来自 `raw_qc_decision=allow` 的 eligible core_pool 或已验收资产。
- eligible fact `core_pool` 默认全部生成正式前台商业信号卡；不得再用单日数量上限、人工精选名额或目录/文档二次黑名单把已入 `core_pool` 的事实型条目挡在前台之外。`important_viewpoint_or_article` 走观点卡 / 观点索引，不得自动生成事实型商业信号。若事实型材料不适合前台，应先修正 Raw-to-Pool 分流，不应在 Pool-to-Card 阶段静默丢弃。
- `allow_with_degradation` 只能在 Daily Monitor QC 明确允许的弱范围内作为背景、补证提醒或观察线索。
- 商业信号卡必须有具体主体、动作、时间、商业变量和边界。
- 场景候选必须有行业 / 部门、岗位 / 使用者、AI 角色和流程变化。
- 前沿观点必须先入 `opinion_intake`，入库时同步写入中文翻译；翻译失败只能保留为待处理 intake，不得前台放行。
- 前沿观点评级前必须按 `canonical_url` / `original_url` / `source_url` 合并重复卡；保留较高档位、较高评分、较完整翻译和人工复核优先的 keeper，重复文件移入 `knowledge/99-Archive/Opinion-Duplicates/<date>/`，并在 keeper 写入合并记录。
- X / Twitter 来源必须做 full-text 可见全文抓取、全文翻译和前台详情展示；不得用 480 字翻译、900 字摘录或“见正文摘录”占位替代全文。
- 前沿观点的中文翻译可在列表、侧栏和首页预览中截短，但观点详情页和人物详情页必须读取完整翻译字段并完整展示；页面问题不能成为丢弃或截断详情译文的理由。
- 前沿观点卡必须区分观点与事实，并执行四档评级：`feature` / `sidebar` / `archive` / `discard`。
- 前沿观点卡只有 `opinion_tier=feature|sidebar`、`display_lane=daily_feature|signal_sidebar`、`publish_status=frontstage_feature|frontstage_sidebar` 且中文翻译已完成时，才允许进入前台；`archive` / `discard` 不得被页面同步 fallback 带出。
- 变化候选和趋势候选不能由单条弱事实直接升级为正式判断。
- 前台展示不得因旧文案规范改写原始事实；商业信号标题优先使用可追溯原文标题，英文展示内容必须翻译为中文。

必须产出：

- Card / Cluster 文件或修复说明。
- linked_raw_ids / linked_fact_cards。
- evidence_gap 和 boundary。
- usable_for / cannot_use_for。
- 前台标题与中文展示结果。
- 给 Experience & Editorial 的素材 handoff。

Stop 条件：

- 无证据生成 Card。
- 用弱材料包装成趋势。
- 把前沿观点卡当事实卡。
- Card 无边界、无来源、无可追溯链接。
- 前台字段出现内部生产语言。

### C. 页面 / 文案 / Typography Harness

适用：

- 新增或重构首页、栏目页、详情页、内参页、信号页、趋势页。
- 修改导航、页头、页脚、卡片、CTA、页面模块、公开展示文案。
- 将 Card / 今日观察 / 商业信号等素材同步到前台页面。

固定读取：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/02-vi-style.md`
4. `context/06-execution-harness.md`
5. 任务指定页面或代码文件

按需补读：

- 页面位置字体：`docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
- VI 使用：`docs/brand/wavesight-ai-vi/USAGE.md`
- 页面设计总纲：`agent-workflow/product/DESIGN.md`
- 字体 QC：`skills/guanlan-typography-qc/SKILL.md`

硬门：

- 页面生成或大改前必须先有 Typography 页面位置表。
- Build & Release 不得临场新增表外字号体系或视觉口径；前台文案以可追溯事实和中文可读为准。
- 不得新增一级导航，除非用户明确确认。
- 不得修改正式 Logo、SVG 生成脚本或品牌 token，除非用户明确确认。
- 公开页面不得暴露 Raw / Pool / gate / 后台字段 / 入库 / 同步等生产语言。
- 页面同步、页面大改或新增页面后必须运行前台回归门禁，拦截 V2.1 / V2.0 口径、已退休组件、旧模块文案和合成 fallback 内容重新进入前台。
- 前台回归门禁命令为 `node agent-workflow/tools/frontstage-regression-gate.mjs`；失败即阻塞发布和下游继续。
- 前台同步不得生成合成趋势报告、合成趋势 id 或旧页面兜底文案。没有正式趋势报告时，可以展示已放行的趋势候选；没有趋势候选时，应显示空状态，不得用历史页面或旧模块补位。
- 趋势页、首页趋势模块和趋势详情页只能展示当前趋势的直接 `relations` 关联材料；不得用标签重叠、全站列表或历史内容 fallback 补充右侧案例、观点或信号。
- 桌面端优先；移动端专项暂缓，除非任务明确要求。

必须产出：

- Typography 页面位置表。
- Copy-first 文案表。
- 实现范围说明。
- 桌面截图或核心交互检查说明。
- `frontstage-regression-gate` 结果。
- 是否新增表外字号、表外字重、表外文案的说明。

Stop 条件：

- 没有 Typography 表却进入 Build。
- 没有 Copy 表却临场补文案。
- 页面文案像普通 AI 新闻站、工具站、公关稿或空泛趋势页。
- 页面视觉绕开 VI / token / 字体规范。
- 前台事实无法回到已放行 Raw / Card / 人工确认来源。

## 3. Handoff 要求

高风险流程完成后，closeout 必须回答：

- 本次属于哪一个 harness。
- 固定读取文件是否完整。
- 是否补读额外文档，为什么。
- 产物写入哪里。
- 哪些质量门已运行。
- 哪些质量门未运行，原因和风险。
- 是否允许下游继续。
- 如果允许，下游只能使用哪些素材或页面。

## 4. 冲突处理

优先级：

1. 用户当前明确指令。
2. 对应专题 Skill。
3. 本文件对应 harness。
4. `context/` 当前文档。
5. 当前产品 / VI / Copy / Evidence 真源。
6. 已删除或历史文档不作为执行依据。
