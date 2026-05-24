---
task_id: WSD-20260523-trend-page-judgment-desk-redesign
title: 趋势栏目页判断台重制 closeout
date: 2026-05-23
status: completed
owner: Codex / Build & Release
harness: page-copy-typography
skill: design-taste-frontend
encoding: UTF-8
---

# WSD-20260523 趋势栏目页判断台重制 Closeout

## 1. 设计判断

本次使用 `design-taste-frontend` 做审美判断，并以观澜 VI、`agent-workflow/product/DESIGN.md`、Apple 的克制留白和 Linear 的信息密度作为边界。

执行结论：

- 趋势页不再按“雷达工具条 + 卡片列表”组织。
- 改为“判断台”：先给趋势判断，再展示日期演变、证据与案例 / 产品卡、观点参照和正式报告状态。
- 右侧只做队列、观点、报告和站内关联，不抢主阅读路径。
- 视觉上减少盒子感，用分割线、留白、字号层级和少量香槟金状态线建立秩序。

## 2. Typography 页面位置表

| 位置 | 字号 / 行高 | 字体 | 字重 | 说明 |
|---|---:|---|---:|---|
| 导航 | 14 / 20 | `--gl-font-sans-cn` | 500-600 | 沿用全站导航 |
| 栏目 H1 | 44 / 58 | `--gl-font-serif-cn` | 600 | 趋势页首屏主标题 |
| 主趋势标题 | 28 / 40 | `--gl-font-serif-cn` | 600 | 当前选中趋势 |
| 分组标题 | 24 / 34 | `--gl-font-sans-cn` | 600 | 判断演变、证据与案例 |
| 右栏标题 | 16 / 24 | `--gl-font-sans-cn` | 600 | 队列、观点、报告 |
| 普通行标题 | 18 / 28 | `--gl-font-sans-cn` | 600 | 时间线和材料行 |
| 摘要正文 | 14 / 24 或 16 / 28 | `--gl-font-sans-cn` | 400 | 主判断用 16，列表用 14 |
| 日期 / 编号 | 12 / 18 | `--gl-font-mono` | 500-600 | 日期、序号、状态 |

未新增品牌 token，未新增表外大字号，未使用 `vw` 字号。

## 3. Copy-first 文案表

| 位置 | 文案 |
|---|---|
| 页面主句 | 趋势不是内容列表，而是一组信号如何变成可追踪判断。 |
| 页面说明 | 这里只保留正在形成或已经成稿的方向：先看判断，再看它由哪些商业信号、产品案例、场景和观点共同推高。 |
| 主区块 | 正在形成的趋势 |
| 时间线 | 判断如何变化 |
| 材料区 | 证据、案例和产品卡 |
| 右栏 | 正在形成的趋势 / 观点参照 / 正式报告 / 站内关联 |
| 空状态 | 暂无正式趋势报告。当前只展示正在形成的方向。 |

文案保持候选边界：不写确定性结论，不把候选包装成正式报告，不恢复旧栏目标题区。

## 4. 文件变更

| 文件 | 变更 |
|---|---|
| `01-SiteV2/site/trend-tracking.html` | 重写趋势栏目页结构为判断台：Hero、摘要指标、搜索、主判断、时间线、材料聚合、右侧参照 |
| `01-SiteV2/site/assets/app.js` | 新增 `trendLab*` 渲染函数；支持趋势候选点击切换、搜索过滤、时间演变、证据 / 案例 / 产品聚合、观点与报告侧栏 |
| `01-SiteV2/site/assets/styles.css` | 追加趋势判断台最终样式；使用观澜暖白、墨海蓝、香槟金细线、无卡片堆叠布局 |
| `agent-workflow/reports/WSD-20260523-trend-page-redesign-judgment-desk-desktop.png` | 桌面截图 |
| `agent-workflow/reports/WSD-20260523-trend-page-redesign-judgment-desk-mobile.png` | 移动基础观察截图 |
| `agent-workflow/reports/WSD-20260523-trend-page-judgment-desk-redesign-closeout.md` | 本收口报告 |

验证命令更新：

- `agent-workflow/reports/tag-quality-gate-latest.md`
- `agent-workflow/reports/quality-gates-syntax-2026-05-23-20260523-031229.md`

## 5. 页面结果

当前趋势页展示：

- 顶部主判断：解释趋势页为什么存在，不再像内容列表。
- 摘要指标：方向、真实候选、关联材料、正式报告。
- 主判断卡：当前趋势的一句话判断、关键变量、商业信号、案例 / 产品、观点参照。
- 日期演变：按日期展示 `TRC-20260521-01` 到 `TRC-20260522-01` 的判断推进。
- 证据与案例 / 产品卡：聚合相关商业信号，并标记融资、案例、产品等材料类型。
- 右侧队列：可切换两条正在形成的趋势。
- 正式报告区：当前无正式报告，保持克制空状态。

## 6. 验证

已通过：

```text
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

说明：

- `run-quality-gates.mjs syntax` 总结论为 `passed`。
- 其中子进程语法项在当前环境被脚本标记为 `child_process spawn blocked (EPERM)`，但派发单相关核心 `node --check` 已单独直接运行通过。

浏览器检查：

- 桌面 Chrome 1440 宽：主趋势、右侧趋势队列、时间线和材料聚合均正常渲染。
- 移动 Chrome 390 宽：无横向溢出，主趋势正常显示。
- 点击右侧第二条趋势后，主判断切换到 `企业 Agent 的预算和工作流信号开始积累`。
- 页面文本未出现 `7D / 30D / 90D`、`反证`、`还缺什么`、`主要缺口`、`证据缺口`、`机会判断`。

截图：

- `agent-workflow/reports/WSD-20260523-trend-page-redesign-judgment-desk-desktop.png`
- `agent-workflow/reports/WSD-20260523-trend-page-redesign-judgment-desk-mobile.png`

## 7. 删除、部署与推送

- 未删除文件。
- 未新增一级导航。
- 未修改 Logo、SVG 生成脚本或品牌 token。
- 未修改 GitHub / Netlify / 自动化配置。
- 未部署。
- 未推送。

## 8. UI/UE 自评

| 项 | 分数 | 说明 |
|---|---:|---|
| Style Purity | 17 / 20 | 遵守观澜暖白、墨海蓝、香槟金线条；未引入外部品牌感 |
| Proportion & Rhythm | 17 / 20 | 首屏留白足够，主判断和右侧队列清楚；右栏后续可再压缩密度 |
| Color Sophistication | 18 / 20 | 色彩克制，没有蓝紫科技感或发光装饰 |
| Craftsmanship | 16 / 20 | 分割线和切换状态成立；观点参照仍可进一步提高显式关联精度 |
| Emotional Resonance | 17 / 20 | 第一屏更像商业判断产品，不像资讯流 |

综合：85 / 100，达到一级栏目页通过线。

## 9. 下游建议

允许下游继续做两件事：

- 为趋势候选补更精确的 `related_opinion_cards` 前台展示映射，减少 tag fallback。
- 若正式 Trend Report 生成后，在当前结构中把报告区从空状态切换为“报告入口 + 与候选的升级关系”。
