---
task_id: WSD-20260523-daily-observation-page-balance
title: 今日观察页面版式平衡与收口
date: 2026-05-23
status: completed
owner: Codex / Build & Release
harness: page-copy-typography
encoding: UTF-8
---

# WSD-20260523 今日观察页面版式平衡 Closeout

## 1. 执行结论

本轮属于 `页面 / 文案 / Typography Harness` 下的页面返修与收口任务。

本轮没有新增一级导航，没有修改导航栏、全站搜索栏、Logo、SVG、品牌 token、部署配置或自动化配置。

本轮最终状态：

- 首页今日观察恢复到用户要求的原版式，不保留误加的「日期档案横条 / 今日索引」结构。
- 今日观察栏目页的 `DAY FILE` 日期统计栏与正文大模块融合为同一个日期档案模块。
- 首页今日观察右侧内容减量，案例和前沿观点数量减少，左右视觉重量更平衡。
- 今日观察栏目页主文章的「阅读原文」按钮从左侧移动到正文列右侧。

## 2. 固定读取与约束

按项目入口要求，本轮页面任务已读取：

- `context/00-current-state.md`
- `context/02-vi-style.md`
- `context/06-execution-harness.md`
- `context/04-qc-rules.md`
- 任务相关页面代码：`01-SiteV2/site/assets/app.js`
- 任务相关样式：`01-SiteV2/site/assets/styles.css`

本轮用户明确约束：

- 不要动搜索栏。
- 不要动导航栏。
- 不要把首页内容结构改错。
- 首页今日观察恢复到修改之前的样子。
- 今日观察栏目页要让日期栏和正文内容栏目更像一个整体。
- 首页右侧案例和观点内容量要减少，使左右尽量平衡。
- 「阅读原文」按钮从左侧移动到右侧。

## 3. 变更范围

### 3.1 首页今日观察恢复

已撤回误加内容：

- 撤回首页今日观察顶部的「日期档案」统计横条。
- 撤回右侧「今日索引」标题结构。
- 撤回对应的强制覆盖样式。

当前首页今日观察保持：

- 左侧为文章标题、日期、导语、原文摘录和阅读入口。
- 右侧为案例和前沿观点。
- 不新增统计横条。
- 不新增首页右侧概要模块。

### 3.2 首页右侧内容减量

文件：`01-SiteV2/site/assets/app.js`

调整：

```js
const caseItems = (homeDailyCases.length ? homeDailyCases : homeDailySignals).slice(0, 1);
const pointItems = homeDailyPoints.slice(0, 2);
```

效果：

- 案例从 2 条减为 1 条。
- 前沿观点从 3 条减为 2 条。
- 右侧内容高度下降，避免右侧素材栏压过左侧正文。

### 3.3 今日观察栏目页日期栏与正文融合

文件：`01-SiteV2/site/assets/styles.css`

新增样式块：

```css
/* Daily Observation column: bind the day file strip to the article dossier. */
```

效果：

- `daily-issue-band` 不再像独立卡片悬浮在正文上方。
- 日期统计栏与下方 `daily-article-lead` 共用边界感。
- 两者通过统一边框、统一左侧金色竖线、上下圆角衔接形成一个日期档案模块。
- 不改 DOM，不改数据，不改标签栏和日期筛选逻辑。

### 3.4 栏目页「阅读原文」按钮右移

文件：`01-SiteV2/site/assets/styles.css`

调整：

```css
body.page-daily .daily-article-read-link {
  justify-self: end !important;
}
```

效果：

- 今日观察栏目页主文章里的「阅读原文」按钮从正文列左侧移动到右侧。
- 按钮样式、文案和链接逻辑未改。

## 4. 产物与截图

本轮新增或更新的检查截图：

| 文件 | 用途 |
|---|---|
| `agent-workflow/reports/home-daily-restored-qc.png` | 首页今日观察恢复原版式检查 |
| `agent-workflow/reports/daily-column-date-article-integrated-qc.png` | 栏目页日期栏与正文融合检查 |
| `agent-workflow/reports/home-right-rail-reduced-qc.png` | 首页右侧案例 / 观点减量检查 |
| `agent-workflow/reports/daily-read-button-right-qc.png` | 栏目页阅读原文按钮右移检查 |

本轮新增收口文件：

- `agent-workflow/reports/WSD-20260523-daily-observation-page-balance-closeout.md`

## 5. 验证

已运行：

```text
node --check 01-SiteV2/site/assets/app.js
```

已检查页面访问：

```text
http://127.0.0.1:4173/index.html -> 200
http://127.0.0.1:4173/daily.html?date=2026-05-22 -> 200
```

已使用 Chrome headless 截图复核：

- 首页今日观察恢复。
- 今日观察栏目页日期栏与正文合并视觉。
- 首页右侧素材减量。
- 栏目页「阅读原文」按钮右移。

Chrome 截图时出现本机扩展文件缺失提示，属于本机 Chrome 扩展加载警告，不影响页面渲染和截图输出。

## 6. 未执行项与风险

未执行：

- 未运行完整站点构建。
- 未运行部署。
- 未运行全量视觉回归。
- 未整理 `styles.css` 中历史累积的重复覆盖块。

风险：

- 当前 `styles.css` 已累积多轮页面返修覆盖，短期可用，但后续继续页面大改前建议做一次样式层收敛，避免选择器优先级继续膨胀。
- 当前工作区存在大量历史变更，本 closeout 只对本轮今日观察页面返修负责，不声明其他未审阅变更已完成验收。

## 7. 下游约束

后续继续改今日观察页面时，应遵守：

- 首页今日观察不要再改成「今日判断」或「决策建议」表达。
- 首页今日观察不要再新增概要型右侧模块。
- 首页右侧素材数量保持克制，避免右侧压过文章正文。
- 栏目页搜索 / 标签 / 日期筛选区域非本任务范围，不应顺手修改。
- 前台不要暴露 Raw / Pool / gate / 入库 / 同步等内部生产语汇。
- 如需继续优化视觉，只做指定页面与指定模块，不跨到导航栏、全站搜索栏和首页其他区块。

## 8. 删除情况

本轮未删除源文件、数据文件或内容文件。

本轮只新增收口文件和截图产物。
