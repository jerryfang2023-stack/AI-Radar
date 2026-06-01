---
status: current
scope: version-ledger
last_updated: 2026-06-01
use_when:
  - task startup
  - page change
  - copy change
  - data sync
  - release check
priority: current
---

# Version Ledger｜观澜版本台账

本文件是当前版本基线。它记录“现在应该按哪个版本执行”，不记录过程细节。closeout 只能证明做过什么，不能替代本文件、页面契约、当前 Skill 或自动门禁。

## 当前版本

| 字段 | 当前值 |
|---|---|
| 当前版本 | V2.2.1 |
| 版本名 | 前台防回退门禁版 |
| 版本层级 | Patch |
| 发布日期 | 2026-06-01 |
| 产品主版本 | V2.2 |
| Git tag | `v2.2.1-frontstage-regression` |
| 当前导航 | 今日观察 / 商业信号 / 趋势追踪 / 商业内参 |

## 版本分层

| 层级 | 使用条件 | 示例 |
|---|---|---|
| V2.2 | 当前产品主版本，不轻易改变 | 当前 AI 商业情报系统主线 |
| V2.2.x | 页面修复、文案修复、样式修复、门禁补丁 | V2.2.1 前台防回退门禁版 |
| V2.3 | 栏目结构、数据结构或生成规则明显升级 | 新增稳定栏目或重建资产模型 |
| V3.0 | 产品定位、导航、信息架构或核心生成链路大变化 | 产品形态重新定义 |

## 当前有效页面

| 页面 | 文件 | 当前口径 |
|---|---|---|
| 首页 | `01-SiteV2/site/index.html` | V2.2.1 首页，趋势模块展示真实趋势候选或正式趋势报告 |
| 今日观察 | `01-SiteV2/site/daily.html` / `daily-detail.html` | newsletter 口径，一眼看清当天要点 |
| 商业信号 | `01-SiteV2/site/signals.html` / `signal-detail.html` | 事实卡、融资卡、案例卡和产品服务卡的前台化展示 |
| 趋势追踪 | `01-SiteV2/site/trend-tracking.html` / `trend-detail.html` | 区分正在形成的趋势和正式趋势报告，只展示直接关联材料 |
| 商业内参 | `01-SiteV2/site/brief.html` | 周期性判断和会员层材料，不借用旧首页或旧信号模块 |

## 当前有效口径

| 类型 | 当前基线 |
|---|---|
| 文案口径 | `context/03-copy-style.md` 和 `skills/guanlan-copy-style/SKILL.md` |
| 字体规范 | `context/02-vi-style.md` 和 `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md` |
| 页面执行 | `context/06-execution-harness.md` |
| 质量门禁 | `context/04-qc-rules.md` |
| 页面契约 | `context/frontstage-page-contracts.md` |
| 前台数据 | `01-SiteV2/site/data/site-content.json`，当前 activeDate 必须跟最新生产内容日期一致 |
| 发布闭环 | 自动监测 PR 人工合并进 `main` 后，GitHub Pages 自动部署完整 `01-SiteV2/site` 前台 |

## 当前禁止再出现

- V2.1 / V2.0 公开版本口径。
- 旧 hero、旧趋势模块、旧观点卡模块、旧今日观察总结卡。
- `今日判断`、`今天的趋势判断还在观察`、`历史内容已完成` 等旧占位文案。
- `TRD-WATCH-*` 合成趋势报告 id。
- `dailySummaryCard`、`legacyPerspectiveCard`、`mountTrendReportLegacy` 等已退休组件。
- 趋势页用标签重叠、全站列表或历史内容 fallback 补充右侧案例、观点或信号。
- 前台展示 Raw、Pool、gate、eligible、index_only、入库、同步等内部生产语言。

## 当前必须运行的门禁

页面 / 文案 / 前台数据改动至少运行：

```powershell
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node agent-workflow/tools/frontstage-regression-gate.mjs
```

按改动类型补充：

| 改动类型 | 必须补充 |
|---|---|
| Patch | syntax + frontstage regression |
| Page Change | syntax + typography + public copy + frontstage regression |
| Copy Change | public copy + cardcopy 或对应 copy QC |
| Data Change | v2content + cardcopy + frontstage regression |
| Release Change | regression + release checklist + Git tag |

## 当前冻结点

| 冻结点 | 页面 | 日期 | 版本 | 不允许回退内容 | 通过门禁 |
|---|---|---|---|---|---|
| `V2.2.1-freeze-frontstage-20260601` | 首页 / 趋势追踪 / 趋势详情 | 2026-06-01 | V2.2.1 | 旧趋势模块、合成趋势、非直接关联内容、V2.1 口径 | `frontstage-regression-gate` passed |

## 历史版本摘要

| 版本 | 摘要 | 当前状态 |
|---|---|---|
| V2.2 | 当前产品主版本，确定四个前台导航和 V2 生产线 | 仍为产品主线 |
| V2.2.1 | 前台防回退门禁版，补齐版本基线、页面契约、趋势直接关联和前台回归门禁 | 当前执行版本 |
