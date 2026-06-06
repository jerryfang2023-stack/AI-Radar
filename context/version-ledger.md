---
status: current
scope: version-ledger
last_updated: 2026-06-06
use_when:
  - task startup
  - page change
  - data sync
  - release check
priority: current
---

# Version Ledger - 观澜版本台账

本文件是当前版本基线。closeout 只能证明做过什么，不能替代本文件、页面契约、当前 Skill 或自动门禁。

## 当前版本

| 字段 | 当前值 |
|---|---|
| 当前版本 | V3.2.0-intelligence-graph-trend |
| 版本名 | 数据观察台关系图谱与趋势候选重构版 |
| 版本层级 | Minor |
| 发布日期 | 2026-06-06 |
| 产品主版本 | V3.2 |
| Git tag | `v3.2.0-intelligence-graph-trend` |
| 当前入口 | 数据观察台 |

## 当前产品口径

- 观澜 AI 当前前台是数据观察台，不再是 V2 四栏目内容站。
- V3 只保留 Raw / Pool / Card / Relationship Graph / Trend Candidate 链路。
- 每天前台核心目标：展示最值得关注的 10 条 AI 商业信号，包括产品/服务、融资、案例。
- 不再输出每日观察、趋势报告、商业内参。
- 不再把 follow-builders / 观点卡作为商业信号、关系图谱或趋势候选的组成部分。
- 前台标题优先使用可追溯原文标题；英文详情必须中文化。

## 当前有效页面

| 页面 | 文件 | 当前口径 |
|---|---|---|
| 数据观察台 | `01-SiteV2/site/v3-data-observation.html` | V3 当前前台入口，展示商业信号、关系图谱、趋势候选和历史趋势资产 |
| 运营后台 | `01-SiteV2/site/operations-console.html` | 内部生产链与运营状态页面，保留 |
| 管线仪表盘 | `01-SiteV2/site/pipeline-dashboard.html` | 生产链路仪表盘，保留 |
| 管理入口 | `01-SiteV2/site/admin.html` | 管理入口，保留 |
| 根入口 | `01-SiteV2/site/index.html` | 跳转到 V3 数据观察台 |

本地 V2 前台静态页面存档：`agent-workflow/backups/v2-static-pages-20260604.zip`。该存档只用于追溯，不作为当前执行依据。

## 当前有效规则

| 类型 | 当前真源 |
|---|---|
| V3 生成规则 | `context/07-v3-intelligence-generation-rules.md` |
| 产品结构 | `context/01-product-map.md` |
| VI / 字体 | `context/02-vi-style.md` |
| 页面契约 | `context/frontstage-page-contracts.md` |
| 质量门禁 | `context/04-qc-rules.md` |
| 执行外壳 | `context/06-execution-harness.md` |
| 前台数据 | `01-SiteV2/site/data/v3-data-observation-desk.json` |

## 当前禁止回退

- 禁止恢复 V2 四栏目页面、旧首页、旧趋势页面、旧商业内参页面。
- 禁止恢复每日观察 / 趋势报告 / 商业内参输出要求。
- 禁止在商业信号、关系图谱、趋势候选中显示观点 / follow-builders 分支。
- 禁止用标签数量、日期数字、内部状态或机械摘要冒充趋势。
- 禁止在前台显示 Raw、Pool、gate、eligible、index_only、threshold_pending、threshold_passed 等内部生产语言。
- 禁止关系图谱回退成大量文字卡片堆叠；当前版本必须使用更直观的节点关系图。
- 禁止趋势模块回退成趋势报告式长文；当前版本只展示趋势候选的“是什么、表现在哪里、证据边界”。

## 必须运行的检查

页面 / 数据 / 生成规则改动至少运行：

```powershell
node --check 01-SiteV2/site/assets/v3-data-observation-desk.js
node --check 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs
node 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs
node 01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs
```

按改动类型补充：

| 改动类型 | 补充检查 |
|---|---|
| Page Change | typography + frontstage regression |
| Data Change | source-first gate + production chain gate |
| Release Change | regression + release checklist + Git tag |

## 当前冻结点

| 冻结点 | 页面 | 日期 | 版本 | 不允许回退内容 | 通过门禁 |
|---|---|---|---|---|---|
| `V3.2.0-freeze-intelligence-graph-trend-20260606` | 数据观察台 | 2026-06-06 | V3.2.0-intelligence-graph-trend | 观点进入关系图谱；文字堆叠式关系卡；趋势报告式长文；内部状态当趋势；V2 页面逻辑 | syntax + site data build + ops data sync |
| `V3.1.1-freeze-source-first-frontstage-20260605` | 数据观察台 / 每日资产链 | 2026-06-05 | V3.1.1-source-first-frontstage | Card / 趋势 / 关系模块不得用旧摘要、标签解释或内部字段生成前台内容 | 已升级 |
| `V3.1-freeze-data-observation-mobile-copy-20260605` | 数据观察台 | 2026-06-05 | V3.1-data-observation-mobile-copy | 移动端首屏统计区过高、旧标题、英文直出、文案门禁污染 | 已升级 |
| `V3.0.0-freeze-data-observation-desk-20260604` | 数据观察台 | 2026-06-04 | V3.0.0-data-observation-desk | V2 前台四栏目页面、旧首页、标签数量伪趋势、内部状态语言 | 已升级 |
| `V2.2.1-freeze-frontstage-20260601` | 首页 / 趋势追踪 / 趋势详情 | 2026-06-01 | V2.2.1 | 旧趋势模块、合成趋势、非直接关联内容、V2.1 口径 | 已退役 |

## 历史版本摘要

| 版本 | 摘要 | 当前状态 |
|---|---|---|
| V3.2.0-intelligence-graph-trend | 数据观察台关系图谱改为节点图；趋势候选改为“是什么、表现在哪里、证据边界”；观点分支不参与商业信号、关系图谱和趋势候选 | 当前执行版本 |
| V3.1.1-source-first-frontstage | 前台内容回源治理；Card / 趋势 / 关系内容必须回到 Raw / Pool / 原文 | 已升级 |
| V3.1-data-observation-mobile-copy | 移动端适配、首屏统计压缩、标题原文优先和英文中文化 | 已升级 |
| V3.0.0-data-observation-desk | 前台入口转为数据观察台，删除 V2 前台页面，保留运营仪表盘 | 已升级 |
| V2.2.x | 四栏目内容站与防回退治理 | 已退役 |
