# WSD-20260511-04-v2-admin-pages-redesign 派发单

日期：2026-05-11  
状态：ready  
派发模式：formal_task / desktop_first / independent_review_required  
看板编号：V2-ADMIN-PAGES  
牵头 Agent：UI / UE Agent + Dev Agent  
协作 Agent：PM Agent / Copy Agent / QA Agent / Workflow Agent  
Skill Pattern：Inversion + Generator + Reviewer + Pipeline  

## 1. 任务目标

根据当前观澜AI V2 的 UI、VI、字体、文案和页面质量要求，将 V1 归档中的 Admin 页面能力重新设计，并接入 V2 网站工程。

本任务不是复制 V1 Admin，也不是恢复 V1 网站后台；V1 只作为功能参考。最终产出应是一个符合 V2 气质的内部管理台：克制、清晰、稳定、面向内容生产和运营判断，不得像旧后台、普通 SaaS 模板或临时调试页。

## 2. 启动必读

默认读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `agent-workflow/execution/WSD-20260511-04-v2-admin-pages-redesign.md`

任务相关补读：

1. `agent-workflow/product/DESIGN.md`
2. `agent-workflow/product/COPY.md`
3. `docs/brand/wavesight-ai-vi/USAGE.md`
4. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
5. `docs/brand/wavesight-ai-vi/brand-tokens.css`
6. `docs/brand/wavesight-ai-vi/executable-svg/README.md`
7. `10-Archive/v1.0/site/04-Site/admin.html`
8. `01-SiteV2/site/README.md`

如需理解 V2 站点实现方式，可补读：

- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/assets/app.js`

禁止把 `frontend-design` 作为设计口径。

## 3. 范围边界

### 必须完成

1. 梳理 V1 Admin 的功能参考，并输出 V2 取舍表。
2. 输出 Admin 信息架构表，说明哪些能力保留、合并、降级、删除。
3. 输出 Admin 页面 UI / UE 规范表。
4. 输出 Admin 文案规范表。
5. 在 `01-SiteV2/site/` 中实现 V2 Admin 页面，优先单页内部管理台。
6. 保持公开前台与 Admin 边界清晰，公开导航不得出现 Admin / 管理 / 同步 / JSON / 编辑等后台痕迹。
7. 完成桌面端截图 QA 和基础交互检查。
8. 写 UTF-8 closeout，并登记到 `agent-workflow/inbox/closeout-queue.jsonl`。

### 推荐实现形态

默认实现为：

- `01-SiteV2/site/admin.html`

页面内部可采用分区或标签页，不强制拆成多个页面。建议覆盖：

1. 今日生产概览：内容更新、待审、发布状态、异常提醒。
2. 内容运营台：Daily Brief、Signals、Opportunities、Business Brief 的数量、质量和状态。
3. 来源与证据质量：AI HOT、follow-builders、联网搜索等来源健康度与证据等级概览。
4. 质量检查台：页面 / 文案 / 内容 / 数据闸门状态。
5. 会员与访问状态预览：只做展示与说明，不接真实权限。
6. 发布准备：本地生成、检查、部署准备状态，只做只读状态表达。

### 不做

1. 不接入真实后端认证。
2. 不接入真实支付、会员权限或数据库写入。
3. 不做 Netlify / GitHub 部署。
4. 不修改每日自动化任务本体。
5. 不修改内容 schema、生产线脚本或 `01-SiteV2/content/` 数据结构。
6. 不修改 `10-Archive/` 原文件。
7. 不处理 `09-ai-news-radar/`。
8. 不把 Admin 链接加入公开前台导航。
9. 不做移动端专项设计和截图验收；本阶段只保证无明显崩坏或严重横向溢出。

如果执行过程中发现必须新增真实权限、写入接口、部署动作或数据模型变更，必须停止并回调度窗口，不得自行扩大范围。

## 4. 执行步骤

### Stage A：PM / IA 取舍

先输出 Admin 功能取舍表：

| V1 功能参考 | V2 是否保留 | V2 位置 | 用户对象 | 数据来源 | 写入行为 | 理由 |
|---|---|---|---|---|---|---|

要求：

- V1 仅作功能参考，不继承旧 UI。
- Admin 必须服务 V2 生产运营，不服务 V1 旧链路。
- Priority Engine / Scoring 可作为后台概览，但不得变成普通前台栏目。

### Stage B：UI / UE 规范表

输出并按表实现：

| 页面区域 | 信息任务 | 视觉层级 | 组件形态 | 字体 / 间距 | 状态 | 验收点 |
|---|---|---|---|---|---|---|

要求：

- 使用观澜 VI token、字体规范和真实 SVG 资产。
- 背景遵守 `--gl-bg-page` / `#FFFDF8`。
- 导航无边框、无阴影，和页面背景融合。
- Admin 视觉应像“商业判断系统的控制台”，不是普通 CMS、SaaS 模板或临时调试台。
- 不出现粗糙占位、后台字段堆叠、JSON 原文暴露。

### Stage C：Copy 规范表

输出并按表实现：

| 页面位置 | 原文 / 草案 | V2 表达 | 禁用表达 | 理由 |
|---|---|---|---|---|

要求：

- 文案简洁、克制、有判断感。
- 内部管理台可以使用运营语言，但不得把“同步、字段、JSON、编辑、后台”等内部痕迹暴露到公开页面。
- 不要写成营销落地页，也不要写成开发工具说明页。

### Stage D：Dev 实现

允许写入：

- `01-SiteV2/site/admin.html`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/assets/app.js`
- `agent-workflow/reports/WSD-20260511-04-v2-admin-pages-redesign-closeout.md`
- `agent-workflow/inbox/closeout-queue.jsonl`

如需新增 Admin 专属静态数据，必须先说明原因，并优先内嵌在页面或沿用现有 generated data；不得新增混乱临时目录。

开发要求：

- CSS class 命名应作用域清晰，例如 `admin-*`。
- 不能破坏现有 V2 前台页面。
- 不能把 Admin 链接加入公开导航。
- 如果复用站点导航组件，必须保证 Admin 页面内部可用、公开前台不被污染。
- 不保留死代码、临时文件、空目录或未使用资产。

### Stage E：桌面 QA

必须完成：

1. `node --check 01-SiteV2/site/assets/app.js`
2. `node agent-workflow/tools/run-quality-gates.mjs syntax`
3. 本地打开 Admin 页面，完成桌面截图，建议视口 `1440x1000`。
4. 检查公开前台导航未出现 Admin / 管理 / 后台 / 同步 / JSON / 编辑等后台痕迹。
5. 检查 Admin 页面没有明显控制台错误、布局错位、文字溢出、死链接或空白模块。

移动端只做非阻塞观察：无严重横向溢出即可，不作为本任务 accepted 硬闸门。

### Stage F：Closeout

收口文件路径：

`agent-workflow/reports/WSD-20260511-04-v2-admin-pages-redesign-closeout.md`

closeout 必须包含：

1. 改动摘要。
2. 文件清单。
3. V1 Admin 功能取舍表。
4. UI / UE 规范表与实现对照。
5. Copy 规范表与实现对照。
6. 桌面截图路径和 QA 结果。
7. 公开前台 / Admin 边界检查结果。
8. 已运行的质量检查和结果。
9. 未做事项与风险。
10. 是否准备进入独立页面与文案质检。

执行窗口不得自称 accepted。完成后状态只能是：

`ready_for_independent_page_copy_quality_review`

调度窗口必须另派独立 QA / Acceptance 窗口读取：

- `agent-workflow/governance/page-copy-quality-review-skill.md`
- `agent-workflow/execution/TASK-page-copy-quality-review-template.md`

独立质检通过后，本任务才允许最终 accepted。

## 5. 验收硬闸门

本任务最终 accepted 必须同时满足：

1. V1 只作为功能参考，没有继承旧 UI。
2. Admin 页面已接入 `01-SiteV2/site/`。
3. 公开前台导航没有 Admin 或后台痕迹。
4. UI / UE 规范表、Copy 规范表、Dev 实现对照完整。
5. 桌面端截图 QA 通过。
6. `app.js` 语法检查和 syntax gate 通过。
7. 没有修改 `09-ai-news-radar/`、`10-Archive/` 原文件、自动化任务、部署配置或内容 schema。
8. 没有临时文件、死文件、死代码或无意义目录。
9. 独立页面与文案质检通过：总分不少于 58 / 70，且定位一致性、商业判断、文案自然度、可信度均不低于 8。

## 6. 独立窗口短提示词

```text
你是观澜AI V2 Admin 页面设计开发执行窗口。

任务 ID：WSD-20260511-04-v2-admin-pages-redesign
派发单：agent-workflow/execution/WSD-20260511-04-v2-admin-pages-redesign.md

请先读取：
1. AGENTS.md
2. agent-workflow/governance/current-context.md
3. agent-workflow/execution/WSD-20260511-04-v2-admin-pages-redesign.md

然后按派发单执行。

核心要求：
- V1 `10-Archive/v1.0/site/04-Site/admin.html` 只作功能参考，不继承旧 UI。
- 按当前 V2 VI、DESIGN、COPY、字体和真实 SVG 资产重做 Admin。
- 默认实现 `01-SiteV2/site/admin.html`，作为内部管理台，不加入公开前台导航。
- 输出 V1 功能取舍表、UI/UE 规范表、Copy 规范表，并按表实现。
- 桌面端设计 / 实现 / 截图 QA 是硬闸门；移动端专项暂缓。
- 不做真实后端认证、支付、部署、自动化本体、schema 或内容生产线改造。
- 不处理 `09-ai-news-radar/`，不修改 `10-Archive/` 原文件。
- 开发窗口不得自验自收。完成后只写 ready_for_independent_page_copy_quality_review，等待调度窗口另派独立质检。

完成后写 UTF-8 closeout：
agent-workflow/reports/WSD-20260511-04-v2-admin-pages-redesign-closeout.md

并向：
agent-workflow/inbox/closeout-queue.jsonl

追加登记。
```
