# V2 Content Gate Report

生成时间：2026/5/24 19:54:23

## 结论

- 日期：2026-05-23
- 状态：passed
- 检查项：19
- 失败项：0

## 指标

| 指标 | 数量 |
|---|---:|
| Raw Candidates | 120 |
| Raw Originals | 120 |
| Pool Items | 43 |
| Daily Observation Chinese Chars | 2221 |
| Change Candidate Assets | 0 |
| Front Business Signal Cards | 11 |
| Selected Change Cards | 0 |
| Case Signal Cards | 1 |
| Frontier Opinion Assets | 36 |
| Trend Candidate Clusters | 0 |
| Trend Report Chinese Chars | 0 |
| Builders / Opinion Candidates | 35 |
| Cluster Candidates | 0 |

## 检查明细

| 检查 | 状态 | 说明 |
|---|---|---|
| V2 content root exists | passed | 01-SiteV2/content |
| Raw candidates file exists | passed | 01-SiteV2/content/01-raw/2026-05-23-raw-candidates.md |
| Raw count is 80-150, fallback 50-79, or severe fallback captures what is available | passed | 120 raw candidates |
| Raw originals exist for candidates | passed | 120 originals for 120 raw candidates |
| Daily observation article exists and has enough substance | passed | 2026-05-23--daily-observation--dust-multiplayer-ai.md (2221 Chinese chars) |
| Pool count is 20-40, or severe documented fallback is declared | passed | 43 pool items |
| Pool items include conversion reason and elimination risk / evidence gaps | passed | 43 pool items meet quality gate |
| Formal signal cards are generated into knowledge | passed | 11 signal cards |
| Change candidate assets are optional unless a change topic is claimed | passed | 0 change cards |
| Change cards include source, data, technical route and similar-product fields | passed | 0 change cards meet quality gate |
| Selected change-card list is optional under current signal-card frontstage rule | passed | not required when formal signal cards are present |
| Selected change cards include reasons for inclusion | passed | not required when formal signal cards are present |
| Trend report meets flash/full evidence gate or has no-report decision / explicit absence | passed | no trend report claimed for this date |
| Opinion candidates are handled through business signals | passed | opinion candidates are checked in the builders viewpoint gate |
| Frontier viewpoints are fully captured from follow-builders items | passed | 35 builder viewpoints captured |
| Heat Candidates file exists or daily log explicitly says no high-heat candidates | passed | daily log says no heat candidates |
| Heat Candidates include tags, status and trend continuity fields | passed | no heat candidates file |
| Daily run log includes source distribution, failures, fallback, evidence gaps and SAB counts | passed | agent-workflow/reports/2026-05-23-guanlan-daily-monitor-log.md |
| V2 site root exists | passed | 01-SiteV2/site |

## 说明

- 本闸门检查当前 V2.2 内容生产路径 `01-SiteV2/content/`。
- 它只检查内容入站基础，不部署 Netlify。
- Raw 低于 80 会被视为降级或严重降级，但仍检查是否有本地原文档案和缺口记录。
- 当前六线程口径下，本闸门检查 Raw、Pool、今日观察、商业信号、前沿观点、变化候选、场景候选、趋势候选和 daily log 必填字段。
