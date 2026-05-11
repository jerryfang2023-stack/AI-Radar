---
title: 首页右侧主视觉与首屏节奏收口
date: 2026-05-05
task_id: WSD-20260504-26-homepage-desk-visual-asset
status: review / evidence-required
encoding: UTF-8
---

# WSD-20260504-26 首页右侧主视觉与首屏节奏收口

## 1. 任务目标

在 `P0-10` 已 accepted 的前提下，按 `DESIGN.md` DESIGN v2 的“商业情报桌面 / 商业判断系统”方向，单独优化首页右侧主视觉，并完成桌面与移动端验收。

本轮后续根据用户现场反馈追加处理：首页首屏文案、右侧商业化图片融合、首屏与二屏节奏、Decision Brief 标题与卡片间距、分割线质感、顶部导航位置。

## 2. UI/UE 页面规范表

| 字段 | 最终规范 / 结果 |
|---|---|
| 页面类型 | 首页前台首屏 + Decision Brief 首段 |
| 主视觉方向 | 使用 AI 生成商业智能主视觉：AI 信号流进入判断面板，并通向商业路径与城市，表达“看懂 AI、判断影响、找到起点” |
| 首屏结构 | 由“左右两栏互相挤压”改为“文字层 + 图片视觉层”；图片作为视觉层，不再撑出屏幕 |
| 图片融合 | 图片左侧和上方使用透明淡出，露出页面真实渐变背景，避免矩形边框感 |
| 图片显示 | 无容器边框；不使用 `object-fit: cover` 裁切；保持完整 16:9 视觉资产 |
| 首屏标题 | 两行固定断句：`在这里看懂AI` / `判断影响，找到起点` |
| 首屏说明 | 删除首屏小字说明，降低信息噪音 |
| CTA | `查看今日简报` / `了解会员服务` |
| 顶部导航 | 桌面导航向视觉中轴略右移动；小屏回到左对齐，避免拥挤 |
| Decision Brief 节奏 | 标题底部到卡片区约 `41px`；标题底部到分隔线约 `19px`；分隔线到卡片约 `22px` |
| 分割线 | 从普通 border 改为渐变纸面规则线：左侧有重量，向右淡出，并带轻微高光 |
| 禁止项 | 未恢复三图轮播；未沿用旧雷达图、四 poster 卡或 P0-2B failed 方案；未改全站 UI |

## 3. Copy 文案规范表

| 字段 | 最终规范 / 结果 |
|---|---|
| 首页主句 | `在这里看懂AI` / `判断影响，找到起点` |
| 表达重点 | 看懂变化、判断影响、找到商业验证起点 |
| 删除项 | 删除“每天从融资、客户采用……”首屏说明小字 |
| 主 CTA | `查看今日简报` |
| 次 CTA | `了解会员服务`，替代“申请完整情报层” |
| Decision Brief 标题 | 保留 `用更可控的方式降低权限确认摩擦` |
| 语气边界 | 不承诺确定机会、不替用户下经营 / 投资判断，不使用内部流程语言 |
| 禁用语检查 | 前台可见文本未出现 Admin、JSON、同步、恢复、编辑、后台等后台痕迹 |

## 4. Dev 按表实现说明

| 文件 | 实现说明 |
|---|---|
| `04-Site/index.html` | 首页 H1 改为两行 span；删除首屏说明小字；CTA 改为“了解会员服务”；右侧主视觉使用 `home-ai-trends-business-future.png`；移除旧 Intelligence Desk 样张 DOM，避免旧文字泄漏 |
| `04-Site/css/styles.css` | 新增首页融合式 hero 规则：图片绝对定位为视觉层，标题保持前景层；图片边缘透明淡出；优化 Decision Brief 标题区、分割线和顶部导航位置 |
| `04-Site/js/app.js` | 为 `renderHomeDesk()` 增加旧样张节点不存在时的跳过保护，避免影响 `renderHomeHighlights()` 渲染 |
| `04-Site/assets/home-ai-trends-business-future.png` | 新增 / 替换 AI 生成商业化主视觉资产 |
| `agent-workflow/reports/*` | 生成桌面、宽屏、移动 smoke 与分割线 / 导航验收截图 |

## 5. QA 桌面 / 移动端截图与验收

| 项目 | 结果 |
|---|---|
| 桌面最终截图 | `agent-workflow/reports/WSD-20260504-26-homepage-final-desktop.png` |
| 宽屏最终截图 | `agent-workflow/reports/WSD-20260504-26-homepage-final-wide.png` |
| 移动 smoke 截图 | `agent-workflow/reports/WSD-20260504-26-homepage-final-mobile-smoke.png` |
| 导航 / 分割线截图 | `agent-workflow/reports/homepage-topnav-divider-final-qa.png` |
| 图片融合截图 | `agent-workflow/reports/homepage-fused-layer-edge-mask-wide.png` |
| 内容恢复截图 | `agent-workflow/reports/homepage-content-restored.png` |
| 桌面测量 | viewport `1440x1000`；scrollWidth `1440`；无横向溢出 |
| 宽屏测量 | viewport `2048x900`；scrollWidth `2048`；无横向溢出 |
| 移动 smoke 测量 | viewport `390x980`；scrollWidth `390`；无横向溢出 |
| Decision Brief 间距 | 标题到底部卡片距离约 `41px`，符合紧凑但不粘连的阅读节奏 |
| 内容渲染回归 | `#homeHighlights` 渲染 3 个内容卡；`#homeDesk` 旧样张文本长度为 `0`；浏览器 console error 为空 |
| 禁用语 | 可见文本禁用语列表为空 |
| UI/UE 评分 | 调整前约 `72/100`；调整后约 `89/100`。剩余风险：二屏卡片密度仍偏高，但不属于本轮右侧主视觉核心边界 |
| 阻塞项 | 未发现页面级阻塞项 |

## 6. 运行检查

| 检查 | 结果 |
|---|---|
| `node --check 04-Site/js/app.js` | 通过 |
| `node agent-workflow/tools/run-quality-gates.mjs syntax` | 通过 |
| 最新 syntax 报告 | `agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-161852.md` |
| 浏览器验收 | 已用 Chromium 对桌面、宽屏、移动 smoke 截图并检查横向溢出 |

## 7. 自动化影响说明

本轮只影响首页展示层、CSS 样式、首页样张渲染和视觉资产。

未修改：

- 内容源 Markdown
- `04-Site/data/`
- 同步脚本
- 关系检查脚本
- 统一同步闸门
- 自动化任务配置
- Signal / Priority / Trend / Opportunity / Point 字段规则

结论：未影响 `ai-the-point`、`ai-2`、`ai-3` 等长期自动化任务。

## 8. 调度中枢回报口令

收口：`agent-workflow/reports/WSD-20260504-26-homepage-desk-visual-asset-closeout.md`
