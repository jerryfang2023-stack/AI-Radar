# WSD-20260504-17 Netlify Preview Deploy Closeout

任务 ID：`WSD-20260504-17-netlify-preview-deploy`  
任务状态：done  
日期：2026-05-04  
牵头 Agent：Dev Agent  
协作 Agent：PM Agent / QA Agent / Workflow Agent

## 1. Netlify Preview URL

- 不可变部署链接：<https://69f88cb84d559e9a6e9354bd--wavesight-ai-preview.netlify.app>
- GitHub `main` 分支部署链接：<https://main--wavesight-ai-preview.netlify.app>
- 站点默认链接：<https://wavesight-ai-preview.netlify.app>
- Netlify 项目后台：<https://app.netlify.com/projects/wavesight-ai-preview>

本次建议主调度窗口验收时：
- 若验收一次性上传结果，使用不可变部署链接。
- 若验收后续自动部署链路，使用 `main` 分支部署链接。

## 2. 部署方式

- 使用方式：Netlify connector 创建项目，随后按 connector 返回的 MCP 上传命令部署。
- Netlify 站点名称：`wavesight-ai-preview`
- Netlify Site ID：`7ab8a5d2-477b-439d-ad4b-57f449ebad9e`
- 初始上传 Deploy ID：`69f88cb84d559e9a6e9354bd`
- GitHub 自动部署 Deploy ID：`69f893302488a7b32306be5b`
- 发布目录：`04-Site/`
- 部署状态：`ready`
- 部署摘要：Netlify 报告上传 `43` 个文件，其中包含 `23` 个页面和 `20` 个静态资源。

补充说明：
- 第一次从项目根目录上传时，Netlify MCP 上传阶段出现 `fetch failed`，未形成可用部署。
- 第二次改为从 `04-Site/` 目录上传，Netlify 已生成 Deploy ID；本地等待过程出现一次 `ECONNRESET`，但随后通过 Netlify connector 查询确认部署状态为 `ready`。

## 2.1 GitHub 连续部署配置

用户追问“之后网站有更新，会同步更新吗”后，已继续按方案 2 配置 GitHub 自动部署。

当前 Netlify 项目构建设置：

- Git provider：`github`
- GitHub 仓库：`jerryfang2023-stack/AI-Radar`
- 仓库 URL：<https://github.com/jerryfang2023-stack/AI-Radar>
- 自动部署分支：`main`
- Allowed branches：`main`
- Build command：无
- Publish directory：`04-Site`
- Deploy key：已由 Netlify 创建并加入 GitHub 仓库。
- GitHub webhook：已配置，Netlify deploy hook 为 `https://api.netlify.com/hooks/github`。

后续同步规则：
- 推送到 GitHub `main` 分支后，Netlify 会自动部署并更新 `https://wavesight-ai-preview.netlify.app`。
- 本地文件只保存但未 commit / push 时，不会自动更新线上站点。
- 每日内容自动化如只写本地 Markdown 或本地网站数据，也不会自动更新 Netlify；仍需要进入 GitHub 版本流程后才会触发 Netlify。

## 3. 改动文件

- 新增 `netlify.toml`
  - 作用：为后续从仓库根目录部署时固定 publish 目录为 `04-Site`。
  - 内容仅包含 `[build] publish = "04-Site"`，未写入 token、账号、域名、数据库或敏感配置。
- 更新 `.gitignore`
  - 作用：忽略 Netlify CLI 生成的本地 `.netlify/` 状态目录，避免把本地站点绑定信息提交到仓库。
- 新增本收口文件：`agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md`

未修改页面代码、样式、数据文件、内容源 Markdown、同步脚本或自动化任务。

## 4. 部署前检查

- `node --check 04-Site/js/app.js`：passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
- Quality Gates 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-120718.md`
- 已确认关键文件存在：
  - `04-Site/index.html`
  - `04-Site/daily.html`
  - `04-Site/signals.html`
  - `04-Site/the-point.html`
  - `04-Site/opportunities.html`
  - `04-Site/trends.html`
  - `04-Site/assets/logo.svg`
  - `04-Site/css/styles.css`
  - `04-Site/js/app.js`
  - `04-Site/data/radar-data.js`

## 5. 部署后访问检查

基于不可变部署链接检查：

| 路径 | 结果 |
|---|---|
| `/` | 200 |
| `/index.html` | 200 |
| `/daily.html` | 200 |
| `/signals.html` | 200 |
| `/the-point.html` | 200 |
| `/opportunities.html` | 200 |
| `/trends.html` | 200 |
| `/daily` | 200 |
| `/signals` | 200 |
| `/the-point` | 200 |
| `/opportunities` | 200 |
| `/trends` | 200 |
| `/css/styles.css` | 200 |
| `/js/app.js` | 200 |
| `/data/radar-data.js` | 200 |

结论：Netlify 预览链接可外部访问，首页、主要栏目和核心 CSS / JS / data 文件均可加载。

GitHub `main` 分支部署链接复查：

| 路径 | 结果 |
|---|---|
| `/` | 200 |
| `/daily` | 200 |
| `/signals` | 200 |
| `/the-point` | 200 |
| `/opportunities` | 200 |
| `/trends` | 200 |
| `/css/styles.css` | 200 |
| `/js/app.js` | 200 |
| `/data/radar-data.js` | 200 |

结论：GitHub 连续部署后的分支链接可访问，主要栏目和核心静态资源均可加载。

## 6. 普通前台后台痕迹检查

已对以下公开页面源码做关键词抽查：`/`、`/daily.html`、`/signals.html`、`/the-point.html`、`/opportunities.html`、`/trends.html`。

结果：
- `/`、`/daily.html`、`/the-point.html`、`/opportunities.html`、`/trends.html` 未命中 `Admin`、`JSON`、`同步`、`编辑`、`恢复`。
- `/signals.html` 源码命中 `编辑`，原因是历史遗留的隐藏 `editorDialog` 编辑弹窗仍存在于静态 HTML 中。

风险判断：
- 该隐藏编辑弹窗不是本任务引入。
- 本任务派发单原则上不允许修改 `signals.html`，因此未在部署任务中修复。
- 默认页面访问检查未发现独立 Admin 导航或公开同步入口；后续应由 Admin 边界 QA 或 Signals 页面整改任务处理该历史遗留源码风险。

## 7. 未运行检查

- 未运行 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`：本任务禁止修改内容源、网站数据和同步口径；部署仅上传当前 `04-Site/` 静态结果。
- 未做完整浏览器截图矩阵：本任务目标是 Netlify Preview URL 可访问；已用外部 HTTP 访问覆盖主要栏目和核心静态资源。截图矩阵仍建议放入后续发布前 QA。
- 未做四种身份完整权限验收：当前静态站会员状态依赖浏览器 `localStorage`，本任务未改权限逻辑；完整多身份验收仍属于发布前闸门。

## 8. 自动化影响

- 是否影响 `ai-the-point`：否。
- 是否影响 `ai-2`：否。
- 是否影响 `ai-3`：否。

原因：
- 未改 Markdown 命名、目录、frontmatter。
- 未改 Signal / Priority / Trend / Opportunity / Point 字段。
- 未改 `sync-data.mjs`、`check-relations.mjs`、`check-point-quality.mjs`、`unified-site-sync.mjs`。
- 未改每日自动化提示词、时间线、入站顺序或发布闸门。

补充说明：
- 本次改变的是 Netlify 部署入站方式：从一次性上传扩展为 GitHub `main` 分支自动部署。
- 这不改变三个每日自动化任务的生成、同步或检查逻辑。
- 如果未来希望每日自动化内容生成后自动上线，还需要另起任务设计“内容生成 -> 数据同步 -> Git commit/push -> Netlify deploy”的发布闸门。

## 9. 主调度窗口验收建议

可以由主调度窗口验收。

建议验收顺序：
1. 打开不可变部署链接：<https://69f88cb84d559e9a6e9354bd--wavesight-ai-preview.netlify.app>
2. 抽查 `/daily`、`/signals`、`/the-point`、`/opportunities`、`/trends`。
3. 确认 `netlify.toml` 只包含静态发布目录配置。
4. 打开 GitHub `main` 分支部署链接：<https://main--wavesight-ai-preview.netlify.app>
5. 确认 Netlify 项目 Build settings 指向 `jerryfang2023-stack/AI-Radar`、`main`、`04-Site`。
6. 将 `/signals.html` 的隐藏编辑弹窗源码命中记录为后续 Admin 边界或 Signals 页面任务，不阻塞本次预览部署验收。

回调度中枢口令：

```text
收口：agent-workflow/reports/WSD-20260504-17-netlify-preview-deploy-closeout.md
```

## 10. 调度中枢验收

2026-05-04 调度中枢已验收通过，状态更新为 `accepted`。

调度中枢复核：

- `netlify.toml` 仅包含 `[build] publish = "04-Site"`，未写入敏感配置。
- 已用外部 HTTP 抽查不可变部署链接，以下路径均返回 200：
  - `/`
  - `/daily.html`
  - `/signals.html`
  - `/the-point.html`
  - `/opportunities.html`
  - `/trends.html`
  - `/css/styles.css`
  - `/js/app.js`
  - `/data/radar-data.js`
- `P0-4A / WSD-20260504-17-netlify-preview-deploy` 已在 `dispatch-board.md` 标记为 `accepted`。

遗留风险：

- `/signals.html` 源码中隐藏 `editorDialog` 编辑弹窗属于历史遗留前台边界风险，不阻塞本次 Netlify Preview 验收。
- 调度中枢已将该风险回挂到 `P0-6 / WSD-20260504-03-admin-boundary-qa`。
