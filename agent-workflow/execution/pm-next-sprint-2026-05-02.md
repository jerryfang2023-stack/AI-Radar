# PM Agent 下一阶段 Sprint 计划

更新时间：2026-05-02  
owner：`pm`  
状态：待用户确认后交给各长期 agent 执行

## 1. 本轮 PM 结论

本轮产品方向以 `product/strategy-single-source.md` 为准：

- 观澜 AI 是面向商业决策者的 AI 机会判断系统。
- 前台主导航收敛为：首页 / Daily Brief / Signals / Opportunities / Trends。
- Scoring 后台化为 Priority Engine，不作为普通前台栏目。
- Tags 当前不作为一线栏目，而是搜索、筛选和关系网络能力。
- Admin 与普通前台必须彻底分离。
- Daily Brief 不输出行动建议，只交付信号、趋势、判断依据和风险边界。
- 首页需要减少信息密度，成为高价值判断入口。

## 2. Active PRD

本轮已更新或新增以下 PRD：

| PRD | 名称 | 优先级 | 说明 |
|---|---|---:|---|
| PRD-001 | Daily Brief 每日判断内参 | P0 | 第一付费级交付物 |
| PRD-002 | Signals 商业信号系统 | P0 | 证据层，支撑全部判断 |
| PRD-003 | Opportunities 机会库与 Priority Engine | P0 | 承接评分、证据、趋势和机会判断 |
| PRD-004 | Trends 趋势判断模型 | P1 | 支撑 Daily Brief 和机会库 |
| PRD-005 | 会员访问与 Admin 权限边界 | P0 | 普通前台和后台运营分离 |
| PRD-006 | 首页布局与排版优化 | P0 | 首页从内容堆叠改为判断入口 |
| PRD-007 | Admin 管理后台独立升级 | P1 | 后台功能、设计、页面、文案和管理效率独立开发 |

## 3. P0 执行顺序

### P0-1：Daily Brief 结构更新

对应 PRD：`PRD-001-daily-brief.md`

目标：

- 将 Daily Brief 固定为“今日判断、关键 Signals、机会观察、趋势变化、判断依据、风险与反证”。
- 删除行动建议作为核心模块。

交给：

- Data Agent：定义字段。
- Copy Agent：定义文案语气。
- UI/UE Agent：定义页面阅读结构。
- Dev Agent：最后实现。
- QA Agent：检查是否仍出现行动指令。

### P0-2：Signals 展示重构

对应 PRD：`PRD-002-signals-system.md`

目标：

- Signal 标题从公司名改为“事件 + 商业含义”。
- 首页、Daily、Signals 三处展示逻辑一致。
- 重复 Signal 进入合并候选。
- 建立可运营的 Signal Score 模型，用于筛选、排序、复核和每日监测优化。
- 根据模型反馈持续优化关键词、优秀网站和数据源。
- 建立每日、每周、每月、季度的反馈与校准机制。

交给：

- Data Agent：定义 `display_title`、`entity`、`business_meaning`、`signal_score`、`score_breakdown`、监测批次、关键词来源、来源分层和去重规则。
- Copy Agent：定义标题和摘要表达规范。
- UI/UE Agent：定义卡片结构。
- Dev Agent：最后修改展示、同步、评分、质量报告和监测反馈逻辑。

### P0-3：Opportunities 与 Priority Engine 合并

对应 PRD：`PRD-003-opportunities-engine.md`

目标：

- Scoring 不作为普通前台栏目。
- 评分作为后台 Priority Engine 进入机会卡。
- 机会标题不出现公司名。

交给：

- Data Agent：定义评分与机会的关联字段。
- UI/UE Agent：定义机会卡和详情页结构。
- Copy Agent：定义机会标题规则。
- Dev Agent：最后迁移旧 scoring 入口和数据展示。

### P0-4：首页布局与排版优化

对应 PRD：`PRD-006-homepage-layout.md`

目标：

- 首页只保留品牌价值、今日判断入口、代表性机会与趋势。
- 内容密度降低，重点更明确。
- 首页不承载完整栏目页功能。

交给：

- UI/UE Agent：输出桌面端和移动端页面结构。
- Copy Agent：输出首页主文案和模块文案。
- Data Agent：定义首页精选内容来源规则。
- Dev Agent：最后落地页面。

### P0-5：普通前台与 Admin 分离

对应 PRD：`PRD-005-membership-access.md`

目标：

- 普通页面不出现编辑、同步、恢复、访问状态、JSON 等后台痕迹。
- Admin 集中承接同步、编辑、审批、会员权限和质量检查。

交给：

- UI/UE Agent：定义普通前台和 Admin 视觉/交互边界。
- Dev Agent：实现权限边界。
- QA Agent：独立验收普通前台无后台入口。

当前验收记录：

- `reports/membership-admin-boundary-acceptance-2026-05-03.md`

### P0-6：会员模块收口

对应 PRD：`PRD-005-membership-access.md`

目标：

- 会员模块只保留普通用户注册、登录、账户、订阅、购买和阅读权限。
- 注册和登录采用邮箱 + 密码。
- 普通前台统一使用“注册”，不再使用“注册试读”作为入口文案。
- Admin 后台能力不再混在会员模块中，转入 PRD-007。

交给：

- Copy Agent：继续统一账户页、订阅页、购买页文案。
- Dev Agent：保持密码登录、阅读权限和到期拦截稳定。
- QA Agent：持续以未登录、有效用户、到期用户、Admin 四种状态验收。

## 4. P1 执行顺序

### P1-1：Trends 趋势详情页

对应 PRD：`PRD-004-trends-model.md`

目标：

- 每个 Trend 有独立页面。
- 展示趋势状态、证据阶梯、反证点和相关机会。

### P1-2：Tags 关系能力

目标：

- Tags 不作为当前一线栏目。
- 先做为筛选、搜索和内容关系网络。
- 避免长标签墙。

需要 Data Agent 先输出 `tag-taxonomy.md` 后再进入 UI/UE 和 Dev。

### P1-3：Admin 管理后台独立升级

对应 PRD：`PRD-007-admin-console.md`

目标：

- 将 Admin 从会员模块拆出，作为独立后台产品继续开发。
- 管理后台要让每日同步、内容复核、用户权限、订阅订单、质量检查和发布准备更方便快捷。
- 后台设计、页面结构、操作文案和高风险操作提示需要独立优化。

交给：

- PM Agent：维护 PRD-007 和 Admin 开发批次。
- UI/UE Agent：输出 Admin 页面地图、首屏工作台和后台模块结构。
- Copy Agent：统一后台操作文案，面向管理任务，不写营销语。
- Dev Agent：逐步重构 Admin 功能与页面。
- QA Agent：验收普通前台无后台痕迹，并验收 Admin 操作效率。

## 5. 各长期 Agent 下一步

| Agent | 下一步 |
|---|---|
| Data Agent | 输出 `data-schema.md`、`tag-taxonomy.md`、数据检查脚本需求 |
| UI/UE Agent | 输出 `ui-ue-page-spec.md` 并更新 `04-Site/DESIGN.md` |
| Copy Agent | 输出 `copy-style-guide.md` 和首页/Daily/Signal 文案规则 |
| Dev Agent | 暂不改代码，先等 Data/UI/Copy 输出后写影响评估 |
| QA Agent | 基于 PRD 建立验收清单 |
| Workflow Agent | 更新任务状态和进度记录 |

## 6. 需要人工确认的事项

1. 是否确认普通前台不再展示 Scoring / Priorities 一级栏目。
2. 是否确认 Tags 暂不作为当前一线栏目。
3. 是否确认首页只展示精选内容，不再承载全部栏目内容。
4. 是否确认 Daily Brief 不输出行动建议。

如以上确认，则进入 Data Agent、UI/UE Agent、Copy Agent 三条并行规范阶段。
