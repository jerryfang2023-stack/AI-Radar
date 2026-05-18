# WSD-20260518-PRE516-RAW-DERIVED-CLEANUP Closeout

## 任务

按用户最新口径，不再处理 2026-05-16 及以前的历史内容，删除 / 剔除 Raw、Pool 以及由 Raw 延展出来的旧文件和旧记录。

## 已完成

- 文件级清理：删除 `01-SiteV2/content/` 与 `01-SiteV2/knowledge/` 中文件名日期为 2026-05-16 及以前的 Raw / Pool / 今日观察 / 商业信号 / 案例 / 观点 / 变化簇 / 发布索引等文件，共 88 项。
- 记录级清理：进一步剔除 2026-05-17 / 2026-05-18 聚合文件中 `original_date / published_at / first_seen_at` 为 2026-05-16 及以前的旧来源记录。
- 删除 138 个仍指向旧原始发布时间的 Raw 原文档案或观点卡文件。
- 剔除 4 个聚合文件中的旧记录：
  - `01-SiteV2/content/01-raw/2026-05-17-raw-candidates.md`
  - `01-SiteV2/content/01-raw/2026-05-18-raw-candidates.md`
  - `01-SiteV2/content/04-business-signals/2026-05-17-opinion-candidates.md`
  - `01-SiteV2/content/04-business-signals/2026-05-18-opinion-candidates.md`
- 重新生成前台数据：`01-SiteV2/site/data/site-content.json` 与 `01-SiteV2/site/data/site-content.js`。
- 清理前台脚本中的旧内容兜底：移除 2026-05-15 / 2026-05-16 变化卡固定标题、固定摘要和 2026-05-16 今日观察特例；旧 CSS 日期注释也已移除。
- 更新 `urgent-trend-candidates/README.md` 示例日期，避免残留旧 UTCAND 示例命中。

## 留存清单

- 文件级删除清单：`agent-workflow/reports/raw-derived-delete-manifest-2026-05-18.txt`
- 记录级剔除清单：`agent-workflow/reports/raw-derived-record-prune-2026-05-18.txt`

## 当前内容状态

- `site-content` 当前日期：2026.05.18
- Raw Candidates：78
- Raw Originals：78
- Pool Items：30
- Opinion Cards：6
- Builders / Opinion Candidates：5
- Change Cards：0
- Case Cards：0
- Daily Observation：0

这是清理后的正常空档：旧变化卡、案例卡、今日观察已被删除，后续需要重新跑卡片生成与今日观察写作。

## 验证

- 残留检查通过：`rg "2026-05-14|2026-05-15|2026-05-16|2026051[4-6]|CHG-2026051[4-6]|CASE-2026051[4-6]|OPN-2026051[4-6]" 01-SiteV2/content 01-SiteV2/knowledge 01-SiteV2/site/data 01-SiteV2/site/assets/app.js 01-SiteV2/site/assets/styles.css` 无命中。
- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告：`agent-workflow/reports/quality-gates-syntax-2026-05-18-20260518-073231.md`。
- `node agent-workflow/tools/run-quality-gates.mjs v2content` 未通过，符合清库后的预期：缺少 2026-05-18 今日观察、变化卡、精选变化卡。详细报告：`agent-workflow/reports/v2-content-gate-2026-05-18-20260518-073412.md`。

## 后续建议

下一步从干净内容状态重新启动生产链路：先跑 `asset-card-generator` 生成变化卡 / 案例卡 / 观点卡，再跑 `daily-observation-writer`。当前不应再修 2026-05-16 及以前的历史内容。

## 注意

当前工作区已有大量历史脏状态和未跟踪报告文件。本轮只对上述清理范围负责，没有回滚或整理其他既有改动。
