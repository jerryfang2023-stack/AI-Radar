---
task_id: WSD-20260522-trend-tracking-page-redesign-build
title: 趋势追踪页面重设计 Build closeout
date: 2026-05-22
status: completed
owner: Codex / Build & Release
harness: page-copy-typography
encoding: UTF-8
---

# WSD-20260522 趋势追踪页面重设计 Build Closeout

## 1. 执行结论

本任务属于 `页面 / 文案 / Typography Harness` 的 Build 执行。

已按用户最新确认完成趋势追踪页重设计开发：

- 不保留栏目标题区。
- 不展示“证据缺口 / 还缺什么 / 反证 / 主要缺口”等前台表达。
- 趋势追踪页从导航后直接进入时间窗口、搜索、筛选和趋势内容。
- 页面结构从旧报告频道改为“工具条 + 正在观察的方向 + 材料正在累积 + 已形成趋势报告 + 右侧关联 + 底部关系路径”。
- 未新增一级导航。
- 未修改 `site-content.json`。
- 未部署。

本地预览地址：

```text
http://127.0.0.1:8000/trend-tracking.html
```

## 2. 文件变更

| 文件 | 变更 |
|---|---|
| `01-SiteV2/site/trend-tracking.html` | 重写趋势追踪页结构，移除旧 featured report / framework / archive 结构，改为无页头的趋势雷达式内容布局 |
| `01-SiteV2/site/assets/app.js` | 新增趋势雷达渲染逻辑、搜索过滤、弱关联匹配、右侧观点 / 今日观察 / 内参关联；趋势详情页去掉缺口 / 反证表达 |
| `01-SiteV2/site/assets/styles.css` | 新增趋势雷达页面样式、桌面双栏布局、移动端单列折叠和长标题换行保护 |

截图产物：

| 文件 | 用途 |
|---|---|
| `agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-screenshot.png` | 桌面 1440px 截图 |
| `agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-mobile.png` | 移动基础观察截图 |

## 3. 用户反馈落实

| 用户反馈 | 处理 |
|---|---|
| 不要栏目标题区 | `trend-tracking.html` 不再包含栏目 H1 / 栏目说明 / hero；导航后直接进入工具条 |
| 不要证据缺口之类 | 页面渲染层不再展示“证据缺口 / 还缺什么 / 反证 / 主要缺口”；旧数据中类似表达在趋势展示层做了文案清洗 |

## 4. 当前页面结构

| 顺序 | 区块 | 说明 |
|---|---|---|
| 1 | 时间窗口工具条 | `7D / 30D / 90D`、搜索、筛选 chip、结果状态 |
| 2 | 正在观察的方向 | 主趋势观察列表，包含状态、更新时间、支撑信号、相关变量、观点参照 |
| 3 | 观点参照侧栏 | 只作为判断参照，不当事实主证据 |
| 4 | 今日观察关联 | 连接当天主判断 |
| 5 | 商业内参关联 | 连接周期判断 |
| 6 | 材料正在累积 | 候选方向压缩列表 |
| 7 | 已形成的趋势报告 | 当前无正式报告时显示克制空状态 |
| 8 | 底部关系路径 | 趋势观察 -> 商业信号 -> 观点参照 -> 今日观察 -> 商业内参 |

## 5. 验证

已完成：

```text
node --check 01-SiteV2/site/assets/app.js
```

结果：通过。

已完成浏览器截图：

- 桌面：Chrome headless，`1440 x 1200`
- 移动基础观察：Chrome headless，`390 x 1200`

页面检查结论：

- 趋势追踪页没有栏目标题区。
- 趋势追踪页可见区域未出现“证据缺口 / 还缺什么 / 反证 / 主要缺口”。
- 桌面首屏结构成立：工具条、主列表、右侧关联栏清楚。
- 移动端能折成单列；已加长标题换行保护。

未运行：

- 未运行完整构建：当前站点为静态页面，本任务未引入构建流程。
- 未运行部署。
- 未运行数据同步：本任务不改数据。

## 6. 风险与后续

| 项 | 说明 |
|---|---|
| `styles.css` 历史改动很多 | 本次只追加趋势雷达相关样式，但仓库原本已有大量历史差异，未回滚、未清理 |
| 当前趋势数据仍偏候选 | 页面已按“观察方向 / 材料累积”展示；正式趋势报告区当前为空状态 |
| 关系字段多数为空 | 页面先使用 tags / date 的弱关联展示，未伪装强关系 |
| 移动端非专项 | 做了基础不崩坏观察；若后续要移动端专项，需要单独设计密度和折叠策略 |

## 7. 是否允许下游继续

允许继续进入下一步页面复核或局部微调。

下游只能基于以下产物继续：

- `01-SiteV2/site/trend-tracking.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`
- 桌面截图：`agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-screenshot.png`
- 移动截图：`agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-mobile.png`

不得恢复旧趋势报告频道、栏目标题区或“证据缺口 / 反证 / 还缺什么”类前台表达。

## 8. 删除与部署

- 未删除文件。
- 未修改 `site-content.json`。
- 未推送 GitHub。
- 未部署 Netlify。
