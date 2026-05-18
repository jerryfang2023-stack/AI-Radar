# V2 Content Gate Report

生成时间：2026/5/18 15:34:12

## 结论

- 日期：2026-05-18
- 状态：failed
- 检查项：18
- 失败项：4

## 指标

| 指标 | 数量 |
|---|---:|
| Raw Candidates | 78 |
| Raw Originals | 78 |
| Pool Items | 30 |
| Daily Observation Chinese Chars | 0 |
| Change Cards | 0 |
| Selected Change Cards | 0 |
| Case Cards | 0 |
| Opinion Cards | 6 |
| Change Clusters | 0 |
| Trend Report Chinese Chars | 0 |
| Builders / Opinion Candidates | 5 |
| Cluster Candidates | 12 |

## 检查明细

| 检查 | 状态 | 说明 |
|---|---|---|
| V2 content root exists | passed | 01-SiteV2/content |
| Raw candidates file exists | passed | 01-SiteV2/content/01-raw/2026-05-18-raw-candidates.md |
| Raw count is 80-150, fallback 50-79, or severe fallback captures what is available | passed | 78 raw candidates |
| Raw originals exist for candidates | passed | 78 originals for 78 raw candidates |
| Daily observation article exists and has enough substance | failed | missing daily observation article |
| Pool count is 20-40, or severe documented fallback is declared | passed | 30 pool items |
| Pool items include conversion reason and elimination risk / evidence gaps | passed | 30 pool items meet quality gate |
| Change cards are generated into knowledge | failed | 0 change cards |
| Change cards include source, data, technical route and similar-product fields | passed | 0 change cards meet quality gate |
| Selected change cards count is 3-8, or high-signal day documents more | failed | 0 selected change cards |
| Selected change cards include reasons for inclusion | failed | 0 selected change cards meet selection gate |
| Trend report meets flash/full evidence gate or has no-report decision / explicit absence | passed | no trend report claimed for this date |
| Opinion candidates are handled through business signals | passed | opinion candidates are checked in the builders viewpoint gate |
| Frontier viewpoints are fully captured from follow-builders items | passed | 5 builder viewpoints captured |
| Heat Candidates file exists or daily log explicitly says no high-heat candidates | passed | 01-SiteV2/content/04-business-signals/2026-05-18-change-cluster-candidates.md |
| Heat Candidates include tags, status and trend continuity fields | passed | 12 heat candidates meet field gate |
| Daily run log includes source distribution, failures, fallback, evidence gaps and SAB counts | passed | agent-workflow/reports/2026-05-18-v2-daily-source-router-log.md |
| V2 site root exists | passed | 01-SiteV2/site |

## 说明

- 本闸门检查当前 V2 内容生产路径 `01-SiteV2/content/`。
- 它不运行旧 `04-Site` 同步，也不部署 Netlify。
- 旧 `04-Site` 已从当前仓库移除，本检查只确认 V2 生产内容链路是否具备可入站基础。
- Raw 低于 80 会被视为降级或严重降级，但仍检查是否有本地原文档案和缺口记录。
- 当前六线程口径下，本闸门检查 Raw、Pool、今日观察、变化卡、案例卡、观点候选、变化簇候选和 daily log 必填字段。
