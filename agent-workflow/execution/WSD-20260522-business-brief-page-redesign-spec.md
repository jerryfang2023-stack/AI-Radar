---
task_id: WSD-20260522-business-brief-page-redesign-spec
title: 商业内参页面规划与重设计规格
date: 2026-05-22
status: ready
owner: Experience & Editorial / Product Commander
encoding: UTF-8
---

# WSD-20260522 Business Brief Page Redesign Spec：商业内参页面规划与重设计规格

## 1. 任务性质

本任务是“商业内参”栏目页面规划与重设计规格任务，不是代码实现任务。

目标：根据现在的卡片设计、前台字段治理、今日观察内容定位变化，以及商业信号 / 趋势追踪页面规划方向，重新确定“商业内参”栏目应该呈现哪些内容、以什么形式呈现、哪些内容不应该呈现。

商业内参必须体现“周期性融合判断、会员内容、机会判断复盘、经营者可读的决策材料”。它不是普通文章页、订阅营销页、后台热力图、趋势报告列表或资料归档页。

旧版 `brief.html` 的设计样式、模块结构和会员控件逻辑全部不要。可以读取旧页面和 `app.js` 了解当前数据来源与渲染字段，但不得以旧版面作为改造底稿，不得做修修补补式方案。

## 2. 调度边界

- 只输出规格和规划，不改代码。
- 不新增一级导航。
- 不修改 VI 正式资产、Logo、SVG 生成脚本或品牌 token。
- 不改自动化、部署、GitHub、Netlify 配置。
- 不推送 GitHub，不部署 Netlify。
- 不恢复 failed / abandoned / stopped 成果。
- 若需要用户对公开态、会员态、价格权益、栏目商业定位做产品取舍，必须在 closeout 中列为“需用户确认”，不得自行拍板。

## 3. 最小读取

执行窗口必须按 AGENTS 最小上下文规则读取：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/01-product-map.md`
4. `context/02-vi-style.md`
5. `context/03-copy-style.md`
6. `context/06-execution-harness.md`
7. `agent-workflow/product/DESIGN.md`
8. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
9. 本派发单：`agent-workflow/execution/WSD-20260522-business-brief-page-redesign-spec.md`

按需只可补读 1-3 个单一真源。若超出，必须在 closeout 中说明原因。

## 4. 必须吸收的当前结论

执行窗口必须读取并吸收：

- `agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md`
- `agent-workflow/reports/WSD-20260522-business-signals-page-redesign-spec-closeout.md`（如存在）
- `agent-workflow/reports/WSD-20260522-daily-observation-page-redesign-spec-closeout.md`（如存在）
- `agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-spec-closeout.md`（如存在）
- `agent-workflow/reports/WSD-20260522-opinion-rating-governance-closeout.md`
- `agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md`
- `agent-workflow/reports/WSD-20260522-daily-observation-skill-consistency-closeout.md`

若某个 closeout 不存在，需在 closeout 中说明“未发现，不阻塞本规格任务”，不得自行伪造结论。

## 5. 当前栏目边界

必须重新定义商业内参与其他栏目之间的边界：

- 今日观察：当天 newsletter，一眼看清一天要点，强调日级观察文章和当天关键卡片。
- 商业信号：案例 / 融资 / 产品服务 / 观点等信号资产的前台发现页，强调事实对象和信号粒度。
- 趋势追踪：跨时间的趋势候选、趋势演进和趋势判断，强调连续观察和成熟趋势。
- 商业内参：周期性融合判断，面向企业老板、资源型合伙人、行业操盘手，强调“本期判断、机会组合、风险提示、行动建议、复盘线索”。

商业内参不应直接复刻今日观察、商业信号或趋势追踪。它应调用它们的卡片和关系，但以“内参期号 / 周期 / 主题包 / 决策问题”重新组织。

## 6. 必须重新规划的内容构成

执行窗口必须给出商业内参栏目应该包含的内容层级，并说明每一层的前台形式：

1. 期号入口：按周 / 半月 / 专题期呈现，必须支持日期或周期查看。
2. 本期主判断：用短摘要说明本期最重要的商业判断，不写成营销文案。
3. 机会组合：由案例、融资、产品服务、商业信号卡组成，说明为什么它们共同构成机会。
4. 观点组：展示精选观点卡，必须说明观点与本期判断的关系。
5. 趋势关联：引用趋势候选或趋势追踪对象，但不得把弱信号包装成成熟趋势。
6. 风险与反证：列出不确定性、反例、观察条件。
7. 行动建议：面向经营者给出可执行的下一步问题或判断框架。
8. 复盘线索：说明上一期判断是否被新信号增强、削弱或修正。
9. 会员层内容：明确哪些内容公开可见，哪些内容只在会员态完整呈现。

## 7. 页面形态要求

必须至少规划以下页面或状态：

- 商业内参栏目首页：不是订阅营销页，应首先呈现最新一期和可检索的内参期号。
- 内参期详情页：按“本期判断 -> 机会组合 -> 观点组 -> 趋势关联 -> 风险反证 -> 行动建议 -> 复盘线索”组织。
- 会员态 / 非会员态：说明公开可见内容、折叠内容、会员提示位置和不得公开的内容。
- 日期 / 周期查看：支持按期号、日期范围或周期筛选。
- tags 检索页或筛选状态：支持关键词 tags 归类和检索。
- 关联卡片详情跳转：案例 / 融资 / 产品服务卡跳转到对应详情页，观点卡跳转到观点详情页，趋势对象跳转到趋势详情页。

## 8. 卡片与字段要求

商业内参页面必须基于新的卡片形式和字段特征规划，不得按旧版块硬塞内容。

必须覆盖以下卡片类型：

- 案例卡
- 融资卡
- 产品服务卡
- 观点卡
- 趋势候选 / 趋势对象引用卡
- 内参期卡
- 复盘线索卡

每种卡片必须输出：

- 前台显示字段
- 详情页显示字段
- 不允许前台显示字段
- tags 字段
- 日期 / 周期字段
- 关联关系字段
- 空值处理
- 点击跳转目标

观点卡在商业内参中的组织方式必须保留“人 + title + 观点 + 时间线”的结构，但在栏目页中可以压缩为摘要卡；完整结构进入观点详情页。

## 9. 关联关系要求

执行窗口必须建立商业内参卡片之间的关联模型：

- 内参期 -> 本期主判断
- 内参期 -> 机会组合
- 内参期 -> 观点组
- 内参期 -> 趋势对象
- 信号卡 -> 观点卡
- 信号卡 -> 趋势对象
- 观点卡 -> 人物 / title / 时间线
- 本期判断 -> 上期判断 / 后续复盘

必须输出“关系矩阵”，说明关系名称、前台呈现方式、详情页呈现方式、缺失关系时的降级策略。

## 10. 设计规范调用

执行窗口必须查看可调用的设计规范，并选择最合适的方案。设计参考可以用于方法，不得覆盖项目 VI：

- 项目 VI、DESIGN、Typography 页面位置表优先级最高。
- 可参考 `design-taste-frontend`、`gpt-taste`、`high-end-visual-design`、`minimalist-ui` 等设计方法。
- 不得把商业内参做成装饰型 landing page。
- 不得使用旧版 `brief.html` 作为布局基础。
- 不得使用大面积营销卡片、订阅墙视觉或空泛 slogan。

必须提出 2-3 个方向方案，并给出推荐方案：

- 方案 A：期刊式内参。
- 方案 B：决策简报式内参。
- 方案 C：机会组合看板式内参。

推荐方案必须说明为什么适合“企业老板、资源型合伙人、行业操盘手”。

## 11. Copy-first 与 Typography 硬要求

closeout 必须包含：

- Copy-first 文案表：页面标题、模块标题、按钮、空状态、会员提示、日期筛选、tags 搜索、详情页标题。
- Typography 页面位置表：H1、H2、模块标题、卡片标题、摘要、元信息、标签、按钮、详情正文、会员提示。
- 桌面端验收清单：首屏、列表密度、详情页阅读节奏、卡片字段可读性、tags 检索、日期切换、关联卡片跳转。

页面任务缺少上述三项时，不得进入 Build。

## 12. 输出要求

执行窗口必须输出 closeout：

`agent-workflow/reports/WSD-20260522-business-brief-page-redesign-spec-closeout.md`

closeout 至少包含：

1. 最小读取清单与实际读取清单。
2. 已吸收 closeout 清单。
3. 商业内参与其他栏目的边界表。
4. 商业内参内容构成表。
5. 页面信息架构。
6. 页面状态清单。
7. 卡片类型与字段治理表。
8. 详情页与跳转规则。
9. 日期 / 周期查看方案。
10. tags 归类与检索方案。
11. 卡片关联关系矩阵。
12. 公开态 / 会员态内容分层。
13. 2-3 个设计方案与推荐方案。
14. Copy-first 文案表。
15. Typography 页面位置表。
16. 桌面端验收清单。
17. 需用户确认的问题。
18. 下游 Build 是否可启动的结论。

## 13. 验收口径

调度窗口验收时只接受以下结果：

- `accepted`：规格完整，字段、卡片、关系、Copy-first、Typography、桌面验收齐全，可进入后续页面规格整合或 Build。
- `accepted_with_notes`：核心规格完整，但存在少量需用户确认项，不阻塞后续规划。
- `needs_revision`：缺少栏目边界、内容构成、字段治理、关联关系、Copy-first、Typography 或桌面验收任一关键项。

未输出 closeout、直接改代码、沿用旧版面、跳过会员态 / 日期 / tags / 关联关系，均视为 `needs_revision`。
