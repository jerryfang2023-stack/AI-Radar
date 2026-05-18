# WaveSight AI 当前上下文入口

更新时间：2026-05-14  
状态：current / V2-only  
用途：新执行窗口的轻量启动入口，替代长清单式默认读取。

## 1. 默认启动读取

除非派发单明确要求，执行窗口默认只需先读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. 当前任务派发单 `agent-workflow/execution/<TASK-ID>.md`

`docs/agent-handoff.md`、`agent-workflow/progress.md`、历史 closeout、旧 PRD 和旧报告只在派发单指定、验收收口、追溯冲突或恢复状态时读取。

## 2. 当前项目口径

- 当前阶段：V2-only 生产开发。
- 当前网站开发节奏：桌面端优先。先集中完成桌面端页面设计、开发和 QA，以加速 V2 生产推进；移动端专项设计和开发暂缓。
- V1.0 网站和旧内容日更不再更新，V1 旧站代码与旧文章归档已从当前仓库移除。
- 当前新站入口：`01-SiteV2/site/`。
- 当前内容入口：`01-SiteV2/content/`。
- 当前知识库入口：`01-SiteV2/knowledge/`。
- V1 归档：`10-Archive/v1.0/` 已物理移除；当前仓库不再保留 V1 网站代码或 V1 旧文章。
- 不处理 `09-ai-news-radar/`，除非用户明确要求。

## 3. 当前导航和栏目

V2 当前前台导航：

```text
今日观察 / 商业信号 / 趋势追踪 / 商业内参
```

栏目口径：

- The Point：降级为观点校准模块，不作为一级导航。
- 机会判断：不再作为一级导航，降级为趋势追踪和商业内参中的机会判断段落。
- Priority Engine / Scoring：后台化，不作为普通前台栏目。
- Tags：作为搜索、筛选和关系网络能力，不作为一线栏目。

当前前台路径：

```text
index.html
daily.html
daily-detail.html
signals.html
signal-detail.html
trend-tracking.html
trend-detail.html
brief.html
```

旧 旧机会相关路径 已废弃，不作为当前 V2 路径。

## 4. 当前 VI / 设计口径

最高优先级规范：

1. `docs/brand/wavesight-ai-vi/USAGE.md`
2. `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
3. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
4. `docs/brand/wavesight-ai-vi/brand-tokens.css`
5. `docs/brand/wavesight-ai-vi/motion-tokens.css`
6. `docs/brand/wavesight-ai-vi/executable-svg/README.md`
7. `docs/brand/wavesight-ai-vi/executable-svg/manifest.json`

当前设计技能：

```text
design-taste-frontend / gpt-taste / redesign-existing-projects / high-end-visual-design / awesome-design-md
```

禁止继续使用：

```text
frontend-design
```

当前视觉规则：

- 页面背景：`#FFFDF8` / `--gl-bg-page`。
- 品牌纸感底色：`#F7F4EF` / `--gl-bg`，只用于物料底色或局部背景。
- Logo 必须引用正式 SVG，不得 CSS、图标库或手写 SVG 重绘。
- 正式横版 Logo 默认不低于 `160px`；小于 `120px` 时优先使用 symbol。
- 站点 token 以 `brand-tokens.css` 为唯一品牌 token 来源，不在页面 CSS 重复定义同名 `--gl-*`。
- 导航栏无边框、无阴影，背景与页面融合。

当前页面验收节奏：

- 页面类任务默认以桌面端设计、桌面端实现和桌面端截图 QA 为 accepted 硬闸门。
- 移动端不作为当前开发主线，除非派发单明确要求；当前只做基础不崩坏 / 无严重横向溢出的非阻塞观察。
- 后续移动端体验、断点、组件密度和截图验收应另派移动端专项任务统一处理。
- 页面 / 文案独立质检 Skill 与强制独立质检流程已停用并移除；开发 closeout 后不再强制另派页面文案质检窗口。
- 页面类任务验收改为调度窗口复核、用户确认、桌面截图 / 核心交互检查和必要专项 QA；如用户明确要求，可临时专项审查，但不得引用已删除的 page-copy-quality-review 流程。
- 页面 / 文案开发必须 Copy-first：进入 Dev 前读取 `agent-workflow/governance/copy-first-page-gate.md`，由 Copy Agent 输出可直接落地的文案表；Dev 只能按表实现，不得临场补写关键文案。
- 页面看起来不像观澜AI，或文案明显像 AI 模板时，调度窗口应直接退回具体修改点或要求用户手工确认；不再走通用七维质检流程。

## 5. 当前失败 / 不可继承基线

- `V2-SITE-QUALITY-AUTO`：`failed / not-accepted / closed`。
- 不得继承该任务的 stage1、stage2、reference mockups 或 `local-site-quality-pass` 结论。
- 并入该失败任务的子项不得视为已完成，必须新建继任任务或重新派发。
- `P0-2B` 是 failed / not accepted，不得作为首页成功版本。

## 6. 每日生产线口径

当前六线程自动化：

- `guanlan-daily-monitor`：默认每天 09:00。
- `asset-card-generator`：默认每天 09:20。
- `daily-observation-writer`：默认每天 09:40。
- `case-signal-researcher`：默认每天 10:10。
- `trend-report-writer`：默认每周运行。
- `brief-periodical-writer`：默认每周运行，内容不足可合并为半月刊或月刊。

当前漏斗：

- Raw：80-150 条；降级日 50-80 条并写明原因。
- Pool：20-40 条。
- 今日观察精选变化卡：5-8 条。
- 趋势追踪必须基于变化簇、趋势卡、变化卡、案例卡、观点卡和来源数据，不由单条新闻或单个观点生成。
- 商业内参必须基于周期内事件重新融合、修正和升级判断，不照搬每日观察。

趋势报告机制：

- 当前生产 schema 使用 `trendReport / trendReports`，不再使用旧英文机会字段作为当前 V2 数据键。
- Trend Report 分为 `kind = flash` 和 `kind = full`。
- 趋势快报用于突然升温方向，公开或登录可读，2000-3500 中文字。
- 深度报告用于完整趋势研究，会员重点内容，6000-10000 中文字。
- Trend Report ID 使用 `TRD-FLASH-YYYYMMDD-XX` / `TRD-FULL-YYYYMMDD-XX`。
- 前台第一版只展示 `watching` / `upgraded` 两种状态；后台保留 `archived` / `revised` 供商业内参复盘。
- 每日监测不直接生成正式 Trend Report，只进入候选池；`trend-report-writer` 负责周任务和急件模式。
- `trend-report-writer` 每次最多产出 1 篇；weekly mode 最多 1 篇深度报告，urgent mode 最多 1 篇趋势快报。
- 急件链路为 `urgent_trend_candidate -> rapid_review -> temporary_trend_report_run`。
- 急件候选 ID 使用 `UTCAND-YYYYMMDD-XX`，记录在 `01-SiteV2/content/09-databases/urgent-trend-candidates/`。
- 急件候选必须有多源信号和商业影响，系统自动复核后进入人工批量复核。
- 急件候选排序：`多源密度 > 观澜重点赛道 > 商业影响 > 来源质量 > 时间新鲜度`。
- 未选中的急件候选写入当天 `Deferred Candidates`；最多延后 2 次，第三次必须落状态。
- `approve_flash` 必须有人工作出最终放行，记录 `reviewer_role` 和 `reviewer_window`，不记录真实姓名。
- 趋势快报发布后进入 30 天 follow-up，可升级为正式报告、归档观察或判断被修正。
- 若 writer 没有足够证据写报告，必须输出 `no_report_decision`，路径为 `01-SiteV2/content/06-trend-reports/no-report-decisions/`，不进入前台索引。
- 新 Trend Report 内容只写入 `06-trend-reports/flash/` 或 `06-trend-reports/full/`；同步脚本短期兼容读取根目录旧文件，但不读取 `no-report-decisions/` 入前台。

来源：

- AI HOT、follow-builders、联网关键词搜索并重。
- AI HOT / follow-builders / HN / X / Reddit 等只作 discovery / source-router，不作事实主证据。
- 今日观察和商业信号中的前台变化必须二搜，至少 3 个 S/A/B 原始来源。
- 趋势追踪深度报告至少 5 个来源，其中至少 2 个 S 级或一手来源。

## 7. 按任务类型补读

派发单只补充与任务直接相关的 1-4 个单一真源。

### 页面 / 视觉 / 设计

- `agent-workflow/product/DESIGN.md`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `docs/brand/wavesight-ai-vi/brand-tokens.css`
- 需要字体 / 动效 / SVG 时，再读对应 VI 文件。

### 文案 / 标题 / 对外表达

- `agent-workflow/product/COPY.md`
- `agent-workflow/product/strategy-single-source.md`

### 产品 / 栏目 / 功能

- `agent-workflow/product/column-architecture.md`
- `agent-workflow/v2/v2-navigation-column-finalization.md`
- `agent-workflow/feature_list.json`

### 数据 / 内容 / 知识库

- `agent-workflow/governance/v2-current-rule-overrides.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/tag-taxonomy.md`
- 对应 `01-SiteV2/content/` 或 `01-SiteV2/knowledge/` README。

### 开发 / 部署 / 自动化

- `agent-workflow/agents/dev-agent.md`
- `agent-workflow/governance/quality-gates.md`
- 相关脚本 README 或派发单指定文件。

### QA / 收口 / 调度

- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/governance/dispatch-state-reconciliation.md`
- `agent-workflow/governance/quality-gates.md`

## 8. 硬停顿

遇到以下情况，执行窗口必须停止并回调度窗口：

- 需要新增或改变一级导航。
- 需要改变 VI 正式资产、Logo、SVG 生成脚本或品牌 token。
- 需要修改自动化本体、部署、Git / Netlify / GitHub 配置。
- 任务会继承 failed / abandoned / stopped 成果。
- 需要用户产品取舍或商业判断。
- 页面类任务缺少 UI/UE 规范表、Copy 表、桌面端 QA 截图验收要求。

## 9. 当前调度机制

默认启动读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. 当前任务派发单

三轨派发：

- `quick_fix`：小型治理 / 文档 / 状态修正，当前窗口直接处理。
- `formal_task`：标准独立执行窗口任务。
- `autopilot_chain`：可连贯执行的多阶段任务，最终一次 closeout，硬停顿时暂停。

收口箱：

- 执行窗口完成后写 UTF-8 closeout。
- 同时向 `agent-workflow/inbox/closeout-queue.jsonl` 追加 JSONL 登记。
- 调度窗口可用 `检查收口箱` / `验收收口箱` 自动发现并验收。

维护规则：

- 轻量启动不等于轻量验收。
- 自动化合并执行不降低页面、产品、文案、数据、QA 或部署硬闸门。
- 后续页面 / 文案任务必须先接入 Copy-first 闸门：没有 Copy 文案规范表，不得进入 Dev；closeout 未说明是否按表实现、是否新增表外文案，不得 accepted。
- 不再创建通用页面 / 文案独立质检任务；页面质量问题由调度窗口按用户反馈、VI / DESIGN / COPY 规范、桌面截图、核心交互和必要专项 QA 处理。
- 导航、VI、目录、自动化、failed 基线、调度机制发生变化时，必须同步更新本文件。
