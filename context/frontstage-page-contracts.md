---
status: current
scope: frontstage-page-contracts
last_updated: 2026-06-01
use_when:
  - page change
  - copy change
  - data sync
  - release check
priority: current
---

# Frontstage Page Contracts｜前台页面契约

本文件约束核心页面“不能被什么污染”。页面改动必须先读 `context/version-ledger.md`，再读本文件。

| 页面 | 当前职责 | 必须保留 | 禁止回退 / 禁止污染 | 必跑门禁 |
|---|---|---|---|---|
| 数据观察台 | V3 当前前台入口，承接 AI 数据中心 + 内容选题中心；展示 Card 工作区、关系图谱、趋势候选和历史趋势 | 当日 Card；日期筛选；正式标签；关系说明；真实趋势候选；历史趋势卡片；详情页 | V2 四栏目首页、旧栏目页、旧详情页、标签数量伪趋势、机械内部语言、Raw / Pool / threshold / gate 外露 | `frontstage-regression-gate` + syntax |
| 运营控制台 | 运营后台与生产链路查看，不属于 V2 前台页面 | `operations-console.html`、`pipeline-dashboard.html`、`admin.html` 及相关数据 | 被误删、被前台 V3 样式重写、被旧栏目导航污染 | syntax + manual smoke |
| V2 前台页面 | 已退役页面集合 | 不保留为当前前台入口 | 继续作为首页、栏目页、详情页被新任务继承 | 不适用 |

## 改动分级

| 类型 | 定义 | 示例 | 检查 |
|---|---|---|---|
| Patch | 不改变页面结构的小修复 | 修文案、修链接、删旧组件 | syntax + regression |
| Page Change | 页面布局、模块、视觉结构变化 | 重排趋势页、首页模块调整 | syntax + typography + public copy + regression |
| Copy Change | 前台标题、摘要、CTA、说明变化 | 商业信号标题规则、按钮文案 | public copy + cardcopy |
| Data Change | 字段、同步规则、生成规则变化 | activeDate、relations、sourceTitle 优先级 | v2content + cardcopy + regression |
| Release Change | 部署、自动化、GitHub Action 或 tag | 发布版本、冻结点、GitHub workflow | regression + release checklist |

## 冻结记录规则

页面被确认后，必须在 `context/version-ledger.md` 的“当前冻结点”记录：

- 页面名称。
- 确认日期。
- 对应版本。
- 不允许回退的内容。
- 当时通过的门禁。
- 可回滚的 Git commit 或 tag。
