---
title: WaveSight Current Handoff
date: 2026-05-18
status: current
encoding: UTF-8
---

# WaveSight 当前交接

本文件只保留当前可继承状态。旧长交接已清理，避免把过期栏目、旧路径和旧漏斗带入新任务。

## 当前口径

- 项目：观澜AI｜WaveSight AI。
- 阶段：V2-only 生产开发。
- 前台导航：`今日观察 / 商业信号 / 趋势追踪 / 商业内参`。
- 旧 `机会判断` 不再作为一级导航，只作为趋势追踪和商业内参里的机会判断段落。
- The Point 不作为一级导航，前台表达为 Builders 观点 / 前沿观点 / 观点参照。
- Scoring / Priority Engine 后台化。
- Tags 作为搜索、筛选和关系网络能力，不做一级栏目。

## 当前目录

- 网站：`01-SiteV2/site/`
- 内容生产：`01-SiteV2/content/`
- 判断资产：`01-SiteV2/knowledge/`
- V1 旧站与旧文章归档：已从当前仓库物理移除；如需追溯，只能查看 Git 历史。
- 旧内容归档：`01-SiteV2/content/_archive/2026-05-12-pre-reframe-content/`

## 2026-05-18 V1 旧站物理移除

- 已删除旧 V1 归档目录：`10-Archive/v1.0/`。
- 已删除 V1 历史改写入库目录：`01-SiteV2/content/00-inbox/legacy-import/`、`01-SiteV2/content/00-inbox/legacy-full-import/`。
- 已删除旧 V1 同步 / QA 脚本：`agent-workflow/tools/unified-site-sync.mjs`、`agent-workflow/tools/the-point-browser-qa.mjs`。
- `run-quality-gates.mjs` 已改为 V2-only 检查口径；旧 `04-Site` / V1 归档不再是当前检查目标。
- `09-ai-news-radar/` 未处理，仍按用户要求保留。

## 当前前台路径

- 首页：`index.html`
- 今日观察：`daily.html`
- 今日观察详情：`daily-detail.html`
- 商业信号：`signals.html`
- 商业信号详情：`signal-detail.html`
- 趋势追踪：`trend-tracking.html`
- 趋势追踪详情：`trend-detail.html`
- 商业内参：`brief.html`

旧路径 旧机会相关路径 不再作为 V2 当前前台路径。

## 六线程生产线

1. `daily-monitor-router`：广泛监测、Raw、Pool、来源分布。
2. `asset-card-generator`：变化卡、案例卡、观点卡候选、变化簇。
3. `daily-observation-writer`：今日观察长文。
4. `case-signal-researcher`：案例、同类产品、市场竞争、客户需求和二搜补证。
5. `trend-report-writer`：趋势追踪深度报告和趋势卡。
6. `brief-periodical-writer`：商业内参周期刊物。

当前内容链路：

```text
Raw -> Pool -> Change / Case / Opinion Cards -> Change Clusters
-> Daily Observation
-> Trend Reports
-> Business Briefs
```

## 当前内容目录

- `01-SiteV2/content/01-raw/`
- `01-SiteV2/content/02-pool/`
- `01-SiteV2/content/03-daily-observation/`
- `01-SiteV2/content/04-business-signals/`
- `01-SiteV2/content/05-case-research/`
- `01-SiteV2/content/06-trend-reports/`
- `01-SiteV2/content/07-business-briefs/`
- `01-SiteV2/content/08-publication-index/`
- `01-SiteV2/content/09-databases/`

旧信号、趋势、观点和机会目录 只存在于归档或旧报告中，不作为当前生产路径。

## 当前质量检查

常用命令：

```powershell
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs style
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
```

2026-05-14 已通过：

- `syntax`
- `style`
- `v2content --date=2026-05-14`

## 当前站点同步

`01-SiteV2/site/scripts/sync-v2-site-data.mjs` 已改为优先读取新目录。

内部数据键已迁移为 `trendReport` / `trendReports`；旧英文机会字段不再作为当前生产 schema。

## 趋势报告机制

- Trend Report 是一级判断资产，前台以文章为主，卡片只作为索引和关系网络。
- Trend Card 记录趋势状态，Trend Report 形成判断。
- 机会判断保留为趋势报告和商业内参中的文章段落，不再作为独立 schema / 独立栏目 / 独立卡片资产。
- Trend Report 分为 `kind = flash` 趋势快报和 `kind = full` 深度报告。
- 趋势快报：急件候选触发，2000-3500 中文字，公开或登录可读，30 天 follow-up。
- 深度报告：周任务或快报升级触发，6000-10000 中文字，会员重点内容。
- Trend Report ID：`TRD-FLASH-YYYYMMDD-XX` / `TRD-FULL-YYYYMMDD-XX`。
- 急件候选 ID：`UTCAND-YYYYMMDD-XX`。
- 前台第一版只展示 `watching` / `upgraded` 两种状态；后台保留 `archived` / `revised`，商业内参可引用。
- 急件链路：`urgent_trend_candidate -> rapid_review -> temporary_trend_report_run`。
- 急件候选记录目录：`01-SiteV2/content/09-databases/urgent-trend-candidates/`。
- 急件候选排序：`多源密度 > 观澜重点赛道 > 商业影响 > 来源质量 > 时间新鲜度`。
- `trend-report-writer` 每次最多产出 1 篇；未选中的候选写入当天 `Deferred Candidates`，最多延后 2 次。
- 没有足够证据写报告时，writer 必须输出 `no_report_decision`，不硬写、不沉默。
- Trend Report 新输出路径：`06-trend-reports/flash/`、`06-trend-reports/full/`、`06-trend-reports/no-report-decisions/`。
- 趋势快报必须遵守观澜写作风格，不写新闻快讯、自媒体爆款或技术热闹总结。
- 趋势快报和今日观察分工：今日观察写当天行情综述，趋势快报写单一方向突然升温的临时深读。

## 最近重要报告

- `agent-workflow/reports/wavesight-schema-migration-trend-report-2026-05-14.md`
- `agent-workflow/reports/wavesight-grill-80-120-solidification-2026-05-14.md`
- `agent-workflow/reports/wavesight-trend-report-template-urgent-candidate-2026-05-15.md`
- `agent-workflow/reports/wavesight-trend-report-writer-routing-rules-2026-05-15.md`
- `agent-workflow/reports/wavesight-trend-report-writer-prompt-update-2026-05-15.md`
- `agent-workflow/reports/wavesight-trend-report-sync-script-update-2026-05-15.md`

## 2026-05-15 最新自动化更新

- `trend-report-writer` 项目 prompt 已更新为新 Trend Report 规则。
- Codex 自动化任务 `trend-report-writer` 已同步更新并保持 `ACTIVE`。
- 自动化现在按 `weekly mode` / `urgent mode` 判断：
  - weekly mode 最多产出 1 篇 `TRD-FULL-*`。
  - urgent mode 只有存在 `approve_flash` 的 `UTCAND-*` 急件候选时，最多产出 1 篇 `TRD-FLASH-*`。
- 每次运行只能产出 1 篇 Trend Report 或 1 份 `no_report_decision`。
- 旧的“没有达标趋势就写简短运行报告”不再作为当前口径。
- 同步脚本已改为优先读 `06-trend-reports/full/`、再读 `flash/`，短期兼容根目录旧文件，并排除 `no-report-decisions/`。
- `v2-content-gate` 已支持 `flash / full / no_report_decision` 新路径；`writer-style-gate` 已跳过 `no-report-decisions/`。
- 2026-05-15 已用临时 `TRD-FULL-20260515-99` 验证新目录可同步；测试文件已删除，真实站点数据已重新生成。
- 下一步未完成项：跑一次 `trend-report-writer` dry run 或正式临时运行，验证无报告时生成 `no_report_decision`，证据满足时生成 `TRD-FLASH-*` / `TRD-FULL-*`。
- `agent-workflow/reports/wavesight-v2-sync-and-content-gate-alignment-2026-05-14.md`
- `agent-workflow/reports/wavesight-site-navigation-sync-2026-05-14.md`
- `agent-workflow/reports/wavesight-automation-start-2026-05-14.md`
- `agent-workflow/reports/wavesight-writer-style-update-2026-05-14.md`

## 接手提醒

- 不要从历史报告恢复旧导航。
- 不要恢复 `旧机会相关路径` 路径。
- 不要把旧 精选变化卡 / 变化卡 漏斗当作当前生产链路。
- 不要把趋势追踪做成卡片聚合页；它应是深度报告 + 趋势卡双重结构。
- 不要把商业内参做成结构化页面；它是周期刊物。
