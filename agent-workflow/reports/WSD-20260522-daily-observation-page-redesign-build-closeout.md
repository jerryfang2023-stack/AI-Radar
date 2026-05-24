---
task_id: WSD-20260522-daily-observation-page-redesign-build
title: 今日观察首页、栏目页与详情页重构 Build closeout
date: 2026-05-22
status: completed
owner: Codex / Build & Release
harness: page-copy-typography
encoding: UTF-8
---

# WSD-20260522 今日观察页面重构 Build Closeout

## 1. 执行结论

本次属于 `页面 / 文案 / Typography Harness` 的 Build 执行，围绕首页今日观察模块、今日观察栏目页、今日观察详情页以及前沿观点跳转逻辑完成连续返修。

已按用户最新口径完成：

- 今日观察不是“判断”栏目，不再用“支撑信号、校准观点、给别人指导”的页面逻辑组织内容。
- 首页今日观察改成文章优先：首屏展示更多原文段落，右侧只保留同日案例和前沿观点，不保留概要和无意义右侧内容。
- 今日观察栏目页去掉与导航重复的搜索栏，改为单行标签筛选栏；标签来源遵守观澜 tags 体系，不随机生成文章标签。
- 每一天内容集中在同一个日期模块下，日期旁承载文章、信号、观点、趋势报告等统计，避免统计信息抢正文空间。
- 文章详情页右侧卡片修复为统一边框、统一字体层级；商业信号不再出现外层框套内层框的重复框架。
- 详情页前沿观点卡片显示人物、title 和观点要点。
- 前沿观点卡片主入口改为站内人物详情页或观点详情页，不再直接跳原文。
- 公开前台数据移除 `2026.05.17`、`2026.05.18`、`2026.05.19`。

未新增一级导航，未修改正式 Logo、SVG 生成脚本或品牌 token，未部署。

## 2. 主要文件变更

| 文件 | 变更 |
|---|---|
| `01-SiteV2/site/assets/app.js` | 重构首页今日观察渲染、栏目页日期和标签逻辑、详情页右侧卡片内容；补齐历史每日观察文章读取；修复前沿观点入口为站内人物/观点详情 |
| `01-SiteV2/site/assets/styles.css` | 调整首页今日观察模块、日期筛选、单行标签栏、详情页正文与右侧卡片、商业信号列表、按钮和标题栏样式 |
| `01-SiteV2/site/scripts/sync-v2-site-data.mjs` | 增加公开站点起始日期过滤；生成 `contentIndex.dailyArticles`，让历史日期详情页能读取完整文章 |
| `01-SiteV2/site/data/site-content.json` | 重新生成前台数据；公开日期只保留 2026-05-20 至 2026-05-22 |
| `01-SiteV2/site/data/site-content.js` | 同步重新生成浏览器可用数据 |
| `01-SiteV2/site/index.html` | 调整首页今日观察相关 aria 语义，避免“判断”口径 |

## 3. 用户反馈落实

| 用户反馈 | 处理 |
|---|---|
| “所有边界、反证、后续观察字段都不要” | 今日观察公开页面不再把这些后台字段作为页面模块主表达；保留在数据层的历史字段不作为前台主文案 |
| “不要页头栏目说明” | 今日观察栏目页和相关详情页弱化/移除栏目说明式页头，直接进入日期、文章和内容 |
| “首屏不是今日判断，是今日观察文章” | 首页今日观察模块改为文章标题、导语、原文段落和阅读原文入口 |
| “首页右侧不要概要/无意义内容” | 右侧改为同日案例和前沿观点；随后按要求删除右侧商业信号组 |
| “搜索栏不要一天一天陈列，按年月日筛选” | 栏目页日期筛选从日期堆叠改为年月日选择和日期模块 |
| “统计信息放日期旁，不抢正文空间” | 日期模块承载文章、信号、观点、趋势报告统计 |
| “标签栏只一行，符合 tags 体系” | 栏目页搜索区域改为单行 tags 分类筛选，来源使用 `tagTaxonomy` |
| “字体变粗糙，检查字体规范” | 详情页 H1、正文、侧栏卡片标题和正文恢复为更克制的层级 |
| “右侧卡片栏被污染” | 侧栏卡片统一 padding、边框、阴影和字号，去掉前沿观点左侧异常重影 |
| “商业信号框框太多” | 商业信号改为一个模块内的列表行，不再一层卡片套一层卡片 |
| “删除 17-19 号内容” | 前台公开数据过滤掉 2026-05-17 至 2026-05-19；未把本次处理解释为删除底层源档案 |
| “前沿观点进入人物详情页，而不是原文跳转” | `dailyPointHref()` 改为优先进入 `builder-detail.html?id=<handle>`；无人物 handle 时进入 `opinion-detail.html` |

## 4. 当前页面结构

### 首页今日观察

- 使用原统一标题栏样式：圆形编号 + 模块标题 + 短装饰线。
- 主体为单个今日观察大模块。
- 左侧为文章标题、日期、导语、原文段落和“阅读原文”入口。
- 右侧只保留：
  - 案例。
  - 前沿观点。
- 不保留概要列表。
- 不保留首页今日观察右侧商业信号组。

### 今日观察栏目页

- 顶部不再使用搜索框。
- 改为单行标签归类栏。
- 日期筛选和日期模块共同承担日期切换与统计。
- 每一天内容收在一个日期模块内，避免内容碎片散落。
- 公开日期目前只显示：
  - `2026.05.22`
  - `2026.05.21`
  - `2026.05.20`

### 今日观察详情页

- 主体继续是长文阅读。
- 右侧为阅读信息、前沿观点、商业信号、趋势追踪等辅助信息。
- 前沿观点显示人物、身份/title、观点要点。
- 商业信号为单模块列表，不再重复套框。
- 右侧卡片统一无额外阴影和异常左边框。
- 前沿观点点击进入站内人物详情或观点详情，不直接打开原文。

## 5. 数据与路由处理

### 历史文章详情

`selectedDailyContent(issue)` 已改为优先从 `contentIndex.dailyArticles` 按日期读取文章，因此 `daily-detail.html?date=2026-05-21` 可以进入 5 月 21 日完整详情，不再落回当天默认文章。

### 公开日期过滤

`sync-v2-site-data.mjs` 增加公开站点起始日期：

```text
2026-05-20
```

早于该日期的内容不会进入前台公开数据。这个处理是“前台公开展示删除”，不是确认删除 Raw / Pool / Knowledge 等底层生产档案。

### 前沿观点路由

前沿观点点击规则：

- 如果 `sourceUrl` 可识别 X / Twitter handle，进入 `builder-detail.html?id=<handle>`。
- 如果没有人物 handle，但有 `slug` 或 `id`，进入 `opinion-detail.html?id=<slug|id>`。
- 原文链接仍保留在人物/观点详情页里，不作为卡片主入口。

验证样例：

| 观点 | 当前入口 |
|---|---|
| Sam Altman：客户开始要求提前锁定算力容量 | `builder-detail.html?id=sama` |
| Aaron Levie：Gemini Flash 能力跃升 | `builder-detail.html?id=levie` |
| Aaron Levie：企业会重新计算 AI token 成本 | `builder-detail.html?id=levie` |

## 6. Tags 体系约束

本次没有把文章临时关键词、公司名或随机主题直接当 tag 使用。

栏目页标签筛选只应来自统一治理后的 `tagTaxonomy`，并通过既有 tag id / group / aliases 做映射。后续不得为了页面好看临时生成 “今日观察标签”“文章标签”“观点标签墙”。

## 7. Typography 与 VI 约束

本次遵守的页面视觉口径：

- 背景保持观澜暖白纸面。
- 主色使用墨海蓝，强调色使用黄铜金，辅助边框用低透明深色。
- 不使用大面积紫蓝渐变、装饰性光斑或无关插画。
- 首页今日观察标题栏恢复统一样式，不新增多余横线。
- 详情页主标题、正文和右侧卡片字号分层：
  - 正文标题强于侧栏标题。
  - 侧栏标题不超过正文层级。
  - 卡片说明文本保持克制，不用过粗字重。
- 按钮改为文字链接式入口，避免大块深色按钮抢正文。

## 8. 验证

已运行：

```text
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs
```

已检查：

- `site-content.json` / `site-content.js` 中不再包含 `2026-05-17`、`2026-05-18`、`2026-05-19`、`05.17`、`05.18`、`05.19`。
- `contentIndex.dates` 只剩 `2026-05-22`、`2026-05-21`、`2026-05-20`。
- `2026-05-21` 前沿观点入口生成站内人物详情页链接。
- 本地页面服务 `http://127.0.0.1:4173/daily.html` 返回 200。
- `daily-detail.html?date=2026-05-21` 已验证可读取 5 月 21 日完整文章。

截图产物：

| 文件 | 用途 |
|---|---|
| `agent-workflow/reports/home-daily-observation-without-signal-group-qc-pass.png` | 首页今日观察右侧删除商业信号组后的检查 |
| `agent-workflow/reports/home-daily-titlebar-restored-qc-pass.png` | 首页今日观察标题栏恢复检查 |
| `agent-workflow/reports/daily-detail-2026-05-21-restored-qc-pass.png` | 5 月 21 日详情页文章恢复检查 |
| `agent-workflow/reports/daily-detail-side-card-uniform-border-qc-pass.png` | 详情页右侧卡片边框一致性检查 |
| `agent-workflow/reports/daily-detail-signals-list-mobile-qc-pass.png` | 移动端商业信号列表不套框检查 |

未完成：

- 本次最后一轮“前沿观点入口改为人物详情页”没有重新生成浏览器截图；原因是当前桌面会话的 Playwright 运行依赖缺少 `playwright-core`，无法继续使用同一方式截图。
- 未运行部署。
- 未运行完整站点构建；当前站点为静态页面和数据同步脚本。

## 9. 工作区注意

当前工作区存在大量与本次页面返修无关的历史文件删除、迁移和内容治理变更。本 closeout 只对以下范围负责：

- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`
- `01-SiteV2/site/index.html`
- 本 closeout 文件

本次没有主动执行 Git 回滚、没有清理用户已有工作区变更、没有确认删除底层 Raw / Pool / Knowledge 源档案。

## 10. 下游允许继续

允许下游继续做页面复核、局部视觉微调和浏览器截图补验。

下游不得回退：

- 不得恢复“今日判断”作为今日观察首页/栏目页主口径。
- 不得恢复首页今日观察右侧概要或商业信号组。
- 不得把前沿观点卡片主入口改回原文外链。
- 不得把随机文章关键词、公司名或人物名当作正式 tag。
- 不得把 `2026.05.17`、`2026.05.18`、`2026.05.19` 重新带回公开前台数据，除非用户明确要求恢复历史公开内容。
- 不得恢复详情页商业信号内外双层框。

## 11. 删除与部署

- 未在本次 closeout 中删除源 Markdown。
- 前台公开数据已移除 17-19 号。
- 未部署 GitHub。
- 未部署 Netlify。
