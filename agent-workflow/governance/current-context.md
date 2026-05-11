# WaveSight AI 当前上下文入口

更新时间：2026-05-11  
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
- V1.0 网站和旧内容日更不再更新。
- 当前新站入口：`01-SiteV2/site/`。
- 当前内容入口：`01-SiteV2/content/`。
- 当前知识库入口：`01-SiteV2/knowledge/`。
- V1 归档：`10-Archive/v1.0/`。
- 不处理 `09-ai-news-radar/`，除非用户明确要求。

## 3. 当前导航和栏目

V2 当前前台导航：

```text
今日要点 / 关键信号 / 机会解码 / 商业内参
```

栏目口径：

- The Point：降级为观点校准模块，不作为一级导航。
- Trends：降级为趋势背景和热力输入，不作为一级导航。
- Priority Engine / Scoring：后台化，不作为普通前台栏目。
- Tags：作为搜索、筛选和关系网络能力，不作为一线栏目。

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
- 页面 / 文案开发窗口不能自验自收。开发 closeout 后，调度窗口必须另派独立 QA / Acceptance 窗口使用 `agent-workflow/governance/page-copy-quality-review-skill.md` 复核。
- 页面与文案独立质检按 7 维评分：定位一致性、信息架构、商业判断、文案自然度、视觉体验、页面节奏、可信度；总分 70，accepted 需总分不少于 58，且定位一致性、商业判断、文案自然度、可信度均不低于 8。
- 页面看起来不像观澜AI，或文案明显像 AI 模板时，即使语法、链接和截图通过，也不得 accepted。

## 5. 当前失败 / 不可继承基线

- `V2-SITE-QUALITY-AUTO`：`failed / not-accepted / closed`。
- 不得继承该任务的 stage1、stage2、reference mockups 或 `local-site-quality-pass` 结论。
- 并入该失败任务的子项不得视为已完成，必须新建继任任务或重新派发。
- `P0-2B` 是 failed / not accepted，不得作为首页成功版本。

## 6. 每日生产线口径

自动化：`v2-content-site-daily-update`  
默认时间：每天 09:00。

当前漏斗：

- Raw：80-150 条；降级日 50-80 条并写明原因。
- Pool：20-30 条。
- Structured Signals：8-15 条。
- Front Signals：3-5 条。
- Opportunity Deep Dive：1-2 条，证据不足不得硬凑。
- Trend Updates：3-5 条。

来源：

- AI HOT、follow-builders、联网关键词搜索并重。
- AI HOT / follow-builders / HN / X / Reddit 等只作 discovery / source-router，不作事实主证据。
- Front Signal 必须二搜，至少 3 个 S/A/B 原始来源。
- Deep Dive 至少 5 个来源，其中至少 2 个 S 级或一手来源。

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

- `agent-workflow/v2/v2-product-architecture-prd.md`
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
- 页面 / 文案独立质检时读取 `agent-workflow/governance/page-copy-quality-review-skill.md` 和 `agent-workflow/execution/TASK-page-copy-quality-review-template.md`。

## 8. 硬停顿

遇到以下情况，执行窗口必须停止并回调度窗口：

- 需要新增或改变一级导航。
- 需要改变 VI 正式资产、Logo、SVG 生成脚本或品牌 token。
- 需要修改自动化本体、部署、Git / Netlify / GitHub 配置。
- 任务会继承 failed / abandoned / stopped 成果。
- 需要用户产品取舍或商业判断。
- 页面类任务缺少 UI/UE 规范表、Copy 表、桌面端 QA 截图验收要求。
- 页面 / 文案开发任务试图由开发窗口自验自收，或缺少独立页面与文案质检报告。

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
- 后续页面 / 文案任务必须接入独立质检流程：开发 closeout -> 调度派发独立质检 -> 未达标退回 Dev / Copy -> 独立质检 accepted 后调度窗口才可 accepted。
- 导航、VI、目录、自动化、failed 基线、调度机制发生变化时，必须同步更新本文件。
