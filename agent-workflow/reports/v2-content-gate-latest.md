# V2 Content Gate Report

生成时间：2026/5/18 16:08:08

## 结论

- 日期：2026-05-18
- 状态：failed
- 检查项：18
- 失败项：2

## 指标

| 指标 | 数量 |
|---|---:|
| Raw Candidates | 100 |
| Raw Originals | 100 |
| Pool Items | 16 |
| Daily Observation Chinese Chars | 0 |
| Change Cards | 8 |
| Selected Change Cards | 8 |
| Case Cards | 6 |
| Opinion Cards | 19 |
| Change Clusters | 2 |
| Trend Report Chinese Chars | 0 |
| Builders / Opinion Candidates | 19 |
| Cluster Candidates | 0 |

## 检查明细

| 检查 | 状态 | 说明 |
|---|---|---|
| V2 content root exists | passed | 01-SiteV2/content |
| Raw candidates file exists | passed | 01-SiteV2/content/01-raw/2026-05-18-raw-candidates.md |
| Raw count is 80-150, fallback 50-79, or severe fallback captures what is available | passed | 100 raw candidates |
| Raw originals exist for candidates | passed | 100 originals for 100 raw candidates |
| Daily observation article exists and has enough substance | failed | missing daily observation article |
| Pool count is 20-40, or severe documented fallback is declared | passed | 16 pool items |
| Pool items include conversion reason and elimination risk / evidence gaps | passed | 16 pool items meet quality gate |
| Change cards are generated into knowledge | passed | 8 change cards |
| Change cards include source, data, technical route and similar-product fields | failed | Change card 1 missing 明确变化; Change card 2 missing 明确变化; Change card 3 missing 明确变化; Change card 4 missing 明确变化; Change card 5 missing 明确变化; Change card 6 missing 明确变化; Change card 7 missing 明确变化; Change card 8 missing 明确变化 |
| Selected change cards count is 3-8, or high-signal day documents more | passed | 8 selected change cards |
| Selected change cards include reasons for inclusion | passed | 8 selected change cards meet selection gate |
| Trend report meets flash/full evidence gate or has no-report decision / explicit absence | passed | no trend report claimed for this date |
| Opinion candidates are handled through business signals | passed | opinion candidates are checked in the builders viewpoint gate |
| Frontier viewpoints are fully captured from follow-builders items | passed | 19 builder viewpoints captured |
| Heat Candidates file exists or daily log explicitly says no high-heat candidates | passed | 01-SiteV2/content/04-business-signals/2026-05-18-change-cluster-candidates.md |
| Heat Candidates include tags, status and trend continuity fields | passed | 0 heat candidates meet field gate |
| Daily run log includes source distribution, failures, fallback, evidence gaps and SAB counts | passed | agent-workflow/reports/2026-05-18-v2-daily-source-router-log.md |
| V2 site root exists | passed | 01-SiteV2/site |

## 说明

- 本闸门检查当前 V2 内容生产路径 `01-SiteV2/content/`。
- 它不运行旧 `04-Site` 同步，也不部署 Netlify。
- 旧 `04-Site` 已从当前仓库移除，本检查只确认 V2 生产内容链路是否具备可入站基础。
- Raw 低于 80 会被视为降级或严重降级，但仍检查是否有本地原文档案和缺口记录。
- 当前六线程口径下，本闸门检查 Raw、Pool、今日观察、变化卡、案例卡、观点候选、变化簇候选和 daily log 必填字段。
