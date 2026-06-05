---
status: current
scope: version-ledger
last_updated: 2026-06-05
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
| 当前版本 | V3.1-data-observation-mobile-copy |
| 版本名 | 数据观察台移动端与文案治理版 |
| 版本层级 | Minor |
| 发布日期 | 2026-06-05 |
| 产品主版本 | V3.1 |
| Git tag | `v3.1-data-observation-mobile-copy` |
| 当前入口 | 数据观察台 |

## 内部运营后台版本

| 字段 | 当前值 |
|---|---|
| 运营后台版本 | V1.1.1 |
| 版本名 | 运营后台 + 数据观察台双向入口版 |
| 版本范围 | `operations-console.html` / `v3-data-observation.html` / 数据观察台资源与生成脚本 |
| 基准提交 | `fa9db651 Add operations data observation console` |
| Git tag | `ops-console-v1.1.1` |
| 说明 | 仅代表内部运营后台版本，不改变项目主版本 `V3.1-data-observation-mobile-copy`。 |

## 版本分层

| 层级 | 使用条件 | 示例 |
|---|---|---|
| V2.2 | 旧四栏目网站主版本 | 今日观察 / 商业信号 / 趋势追踪 / 商业内参 |
| V2.2.x | V2 页面修复、文案修复、样式修复、门禁补丁 | V2.2.1 前台防回退门禁版 |
| V3.0 | 产品入口转为 AI 数据中心 / 内容选题中心 | V3.0.0 数据观察台生产版 |
| V3.1 | V3 数据观察台移动端、标题取值、中文化和文案门禁治理 | V3.1 数据观察台移动端与文案治理版 |
| V3.1.x | V3.1 页面、样式、关系和趋势模块小修 | 后续小修 |

## 当前有效页面

| 页面 | 文件 | 当前口径 |
|---|---|---|
| 数据观察台 | `01-SiteV2/site/v3-data-observation.html` | V3 当前前台入口，基于当日 Raw / Pool / Card / 观点 / 趋势资产，展示商业信号、关系图谱、趋势候选和历史趋势 |
| 根入口 | `01-SiteV2/site/index.html` | 只跳转到 V3 数据观察台，不再承载 V2 首页 |
| 运营控制台 | `01-SiteV2/site/operations-console.html` | 运营后台保留，不属于 V2 前台页面 |
| 管线仪表盘 | `01-SiteV2/site/pipeline-dashboard.html` | 生产链路仪表盘保留，不属于 V2 前台页面 |
| 管理入口 | `01-SiteV2/site/admin.html` | 管理入口保留，不属于 V2 前台页面 |

本机保留 V2 前台静态页面存档：`agent-workflow/backups/v2-static-pages-20260604.zip`。该目录为本地忽略目录，只用于追溯，不作为当前前台执行依据。

## 当前有效口径

| 类型 | 当前基线 |
|---|---|
| 文案口径 | 前台文案规范与文案门禁暂停使用；商业信号标题优先使用可追溯原文标题，英文展示内容必须翻译为中文 |
| 字体规范 | `context/02-vi-style.md` 和 `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md` |
| 页面执行 | `context/06-execution-harness.md` |
| 质量门禁 | `context/04-qc-rules.md` |
| 页面契约 | `context/frontstage-page-contracts.md` |
| 前台数据 | `01-SiteV2/site/data/v3-data-observation-desk.json`，当前 activeDate 必须跟最新生产 Card 日期一致 |
| 发布闭环 | 自动监测 PR 人工合并进 `main` 后，GitHub Pages 自动部署完整 `01-SiteV2/site` 前台 |

## 当前禁止再出现

- V2.2 / V2.1 / V2.0 公开四栏目网站口径。
- 旧 hero、旧趋势模块、旧观点卡模块、旧今日观察总结卡、旧四栏目首页。
- V2 前台页面继续作为当前入口或被新任务继承。
- `今日判断`、`今天的趋势判断还在观察`、`历史内容已完成` 等旧占位文案。
- `TRD-WATCH-*` 合成趋势报告 id。
- `dailySummaryCard`、`legacyPerspectiveCard`、`mountTrendReportLegacy` 等已退休组件。
- 趋势页用标签重叠、全站列表或历史内容 fallback 补充右侧案例、观点或信号。
- 前台展示 Raw、Pool、gate、eligible、index_only、入库、同步、threshold_pending、threshold_passed 等内部生产语言。
- 把标签数量、日期数字或内部状态当作趋势描述本身。

## 当前必须运行的门禁

页面 / 文案 / 前台数据改动至少运行：

```powershell
node --check 01-SiteV2/site/assets/v3-data-observation-desk.js
node --check 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs
node agent-workflow/tools/frontstage-regression-gate.mjs
```

按改动类型补充：

| 改动类型 | 必须补充 |
|---|---|
| Patch | syntax + frontstage regression |
| Page Change | syntax + typography + frontstage regression |
| Copy Change | syntax + frontstage regression |
| Data Change | v2content + frontstage regression |
| Release Change | regression + release checklist + Git tag |

## 当前冻结点

| 冻结点 | 页面 | 日期 | 版本 | 不允许回退内容 | 通过门禁 |
|---|---|---|---|---|---|
| `V3.1-freeze-data-observation-mobile-copy-20260605` | 数据观察台 | 2026-06-05 | V3.1-data-observation-mobile-copy | 移动端首屏统计区过高、趋势模块手机端双列撑长、`TABLE / CARDS` 与 `Card 工作区` 旧标题、`16 张 Card` 小行、机械商业信号标题、英文标题和英文详情直出、前台文案规范 / 文案门禁污染 | syntax + `frontstage-regression-gate` + mobile smoke passed |
| `V3.0.0-freeze-data-observation-desk-20260604` | 数据观察台 | 2026-06-04 | V3.0.0-data-observation-desk | V2 前台四栏目页面、旧首页、标签数量伪趋势、内部状态语言、Raw / Pool 字段外露 | `frontstage-regression-gate` passed |
| `V2.2.1-freeze-frontstage-20260601` | 首页 / 趋势追踪 / 趋势详情 | 2026-06-01 | V2.2.1 | 旧趋势模块、合成趋势、非直接关联内容、V2.1 口径 | 已退役 |

## 历史版本摘要

| 版本 | 摘要 | 当前状态 |
|---|---|---|
| V3.1-data-observation-mobile-copy | 数据观察台移动端适配；首屏统计区压缩；趋势模块手机端单列；商业信号标题改为原文优先并中文化；暂停并删除前台文案规范 / 文案门禁；V3 数据包过滤机械模板和英文详情直出 | 当前执行版本 |
| V3.0.0-data-observation-desk | 前台入口转为数据观察台，保留每日生产资产，删除 V2 前台页面，运营仪表盘保留 | 已升级 |
| V2.2 | 四栏目网站主版本，确定今日观察 / 商业信号 / 趋势追踪 / 商业内参 | 已退役 |
| V2.2.1 | 前台防回退门禁版，补齐版本基线、页面契约、趋势直接关联和前台回归门禁 | 已退役 |
